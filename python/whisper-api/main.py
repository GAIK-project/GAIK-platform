import os
import tempfile
import time
from pathlib import Path
from typing import Literal, Optional

from dotenv import load_dotenv
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.responses import JSONResponse
from openai import AzureOpenAI, OpenAI
from pydantic import BaseModel
from pydub import AudioSegment

# Load environment variables
env_path = Path(__file__).parent / ".env"
load_dotenv(env_path, override=True)  # Force reload with specific path

app = FastAPI(
    title="Whisper API",
    description="Simple OpenAI Whisper transcription API with automatic chunking",
    version="1.0.0"
)

class TranscriptionResponse(BaseModel):
    """Response model for transcription results."""
    language: str
    content: str
    format: str
    file_size_mb: float
    processing_time_seconds: float
    chunks_processed: int = 1
    token_usage: Optional[dict] = None

def get_openai_client() -> OpenAI:
    """Get OpenAI client instance."""
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="OPENAI_API_KEY environment variable not set"
        )
    return OpenAI(api_key=api_key)

def get_azure_openai_client() -> AzureOpenAI:
    """
    Create and return an Azure OpenAI client instance.

    Returns:
        AzureOpenAI: Configured Azure OpenAI client

    Raises:
        ValueError: If required environment variables are not set
    """
    api_key = os.getenv("AZURE_API_KEY")
    endpoint = os.getenv("AZURE_API_BASE")

    if not api_key or not endpoint:
        raise ValueError(
            "AZURE_API_KEY and AZURE_API_BASE environment variables must be set"
        )

    return AzureOpenAI(
        api_key=api_key, 
        api_version="2024-10-21", 
        azure_endpoint=endpoint
    )

def get_client(provider: str = "azure"):
    """
    Get OpenAI or Azure OpenAI client based on provider parameter.
    
    Args:
        provider: "azure" or "openai" - defaults to "azure"
    """
    if provider == "azure":
        # Try Azure first
        if os.getenv("AZURE_API_KEY") and os.getenv("AZURE_API_BASE"):
            try:
                return get_azure_openai_client()
            except ValueError as e:
                print(f"Azure client failed: {e}")
                # Fall back to OpenAI if Azure fails
                pass
    
    # Use OpenAI (either as fallback or explicitly requested)
    return get_openai_client()

def get_file_size_mb(file_path: str) -> float:
    """Get file size in MB."""
    return os.path.getsize(file_path) / (1024 * 1024)

def split_audio_chunks(file_path: str, max_size_mb: float = 20.0) -> list[str]:
    """
    Split audio file into chunks if it's too large.
    Returns list of chunk file paths.
    """
    file_size = get_file_size_mb(file_path)
    if file_size <= max_size_mb:
        return [file_path]
    
    print(f"File size {file_size:.1f}MB exceeds limit, splitting into chunks...")
    
    # Load audio file
    audio = AudioSegment.from_file(file_path)
    
    # Calculate chunk duration to stay under size limit
    # Rough estimate: assume consistent bitrate
    total_duration_ms = len(audio)
    target_chunks = int(file_size / max_size_mb) + 1
    chunk_duration_ms = total_duration_ms // target_chunks
    
    chunk_files = []
    temp_dir = tempfile.mkdtemp()
    
    for i in range(target_chunks):
        start_ms = i * chunk_duration_ms
        end_ms = min((i + 1) * chunk_duration_ms, total_duration_ms)
        
        if start_ms >= total_duration_ms:
            break
            
        chunk = audio[start_ms:end_ms]
        chunk_path = os.path.join(temp_dir, f"chunk_{i:03d}.wav")
        chunk.export(chunk_path, format="wav")
        chunk_files.append(chunk_path)
        
        print(f"Created chunk {i+1}/{target_chunks}: {Path(chunk_path).name}")
    
    return chunk_files

def cleanup_chunks(chunk_files: list[str], original_file: str):
    """Clean up temporary chunk files."""
    for chunk_file in chunk_files:
        if chunk_file != original_file and os.path.exists(chunk_file):
            try:
                os.remove(chunk_file)
                # Also remove temp directory if empty
                temp_dir = os.path.dirname(chunk_file)
                if temp_dir != os.path.dirname(original_file):
                    try:
                        os.rmdir(temp_dir)
                    except OSError:
                        pass  # Directory not empty or other issue
            except OSError:
                pass  # File might already be deleted

def combine_transcriptions(
    transcriptions: list[str], 
    response_format: str
) -> str:
    """Combine multiple transcription chunks."""
    if len(transcriptions) == 1:
        return transcriptions[0]
    
    if response_format == "srt":
        # For SRT format, combine directly (timestamp adjustment would need more complex logic)
        combined_srt = ""
        
        for transcription in transcriptions:
            if not transcription.strip():
                continue
                
            # Simple SRT combination - in production you'd want proper timestamp adjustment
            if combined_srt:
                combined_srt += "\n\n"
            combined_srt += transcription
            
        return combined_srt
    else:
        # For text formats, just join with spaces
        return " ".join(t.strip() for t in transcriptions if t.strip())

@app.get("/")
async def root():
    """Health check endpoint."""
    return {"message": "Whisper API is running"}

@app.get("/health")
async def health():
    """Health check with OpenAI connection test."""
    # Reload environment variables to get latest changes
    env_path = Path(__file__).parent / ".env"
    load_dotenv(env_path, override=True)
    
    try:
        client = get_client()
        # Simple test to verify connection works
        return {
            "status": "healthy",
            "openai_configured": True
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "openai_configured": False,
            "error": str(e)
        }

@app.post("/transcribe", response_model=TranscriptionResponse)
async def transcribe_audio(
    file: UploadFile = File(...),
    language: Optional[str] = Form(None),
    response_format: Literal["text", "srt", "vtt", "json", "verbose_json"] = Form("text"),
    provider: Literal["azure", "openai"] = Form("azure")
):
    """
    Transcribe audio file using OpenAI Whisper.
    
    - **file**: Audio file to transcribe (mp3, wav, m4a, etc.)
    - **language**: Language code (fi, en, sv, etc.) - optional for auto-detect  
    - **response_format**: Output format (text, srt, vtt, json, verbose_json)
    - **provider**: AI provider (azure, openai) - defaults to "azure"
    """
    start_time = time.time()
    
    # Validate file type
    if not file.content_type or not file.content_type.startswith(('audio/', 'video/')):
        raise HTTPException(
            status_code=400,
            detail="File must be an audio or video file"
        )
    
    # Save uploaded file temporarily
    file_suffix = Path(file.filename).suffix if file.filename else ".tmp"
    with tempfile.NamedTemporaryFile(delete=False, suffix=file_suffix) as temp_file:
        content = await file.read()
        temp_file.write(content)
        temp_file_path = temp_file.name    
    try:
        file_size_mb = get_file_size_mb(temp_file_path)
        print(f"Processing file: {file.filename} ({file_size_mb:.1f} MB)")
        
        # Get OpenAI client based on provider parameter
        client = get_client(provider)
          # Split into chunks if necessary
        chunk_files = split_audio_chunks(temp_file_path)
        transcriptions = []
        total_chunks = len(chunk_files)
        
        # Process each chunk
        for i, chunk_file in enumerate(chunk_files):
            print(f"Transcribing chunk {i+1}/{total_chunks}")
            
            with open(chunk_file, "rb") as audio_file:
                # Prepare transcription parameters
                transcription_params = {
                    "model": "whisper-1",
                    "file": audio_file,
                    "response_format": response_format,
                }
                
                # Add language if specified
                if language:
                    transcription_params["language"] = language
                
                # Call OpenAI Whisper API
                response = client.audio.transcriptions.create(**transcription_params)
                transcriptions.append(str(response))
        
        # Combine transcriptions
        combined_content = combine_transcriptions(transcriptions, response_format)
        
        # Detect language if not specified (use first chunk result)
        detected_language = language or "auto"
        
        processing_time = time.time() - start_time
        
        # Token usage info (Whisper API doesn't provide detailed token usage)
        token_info = {
            "provider": provider,
            "model": "whisper-1", 
            "chunks_processed": total_chunks,
            "note": "Whisper API does not provide detailed token usage information"
        }
        
        return TranscriptionResponse(
            language=detected_language,
            content=combined_content,
            format=response_format,
            file_size_mb=file_size_mb,
            processing_time_seconds=round(processing_time, 2),
            chunks_processed=total_chunks,
            token_usage=token_info
        )
        
    except Exception as e:
        print(f"Transcription error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Transcription failed: {str(e)}"
        )
    
    finally:
        # Cleanup temporary files
        try:
            cleanup_chunks(chunk_files, temp_file_path)
            if os.path.exists(temp_file_path):
                os.remove(temp_file_path)
        except OSError:
            pass  # File cleanup failed, but transcription succeeded

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
