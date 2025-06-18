# Whisper API

Simple FastAPI endpoint for OpenAI Whisper transcription with automatic audio chunking.

## Setup

1. Install dependencies:
```bash
uv sync
```

2. Create `.env` file:
```bash
OPENAI_API_KEY=your_openai_api_key_here
```

3. Run the server:
```bash
uv run uvicorn main:app --reload
```

## Usage

### Transcribe audio file

```bash
curl -X POST "http://localhost:8000/transcribe" \
  -F "file=@your_audio_file.mp3" \
  -F "language=fi" \
  -F "response_format=text"
```

### Parameters

- `file`: Audio file (mp3, wav, m4a, etc.)
- `language`: Language code (fi, en, sv, etc.) - optional, defaults to auto-detect
- `response_format`: Output format (text, srt, vtt, json) - optional, defaults to "text"

### Response

```json
{
  "language": "fi",
  "content": "Transcribed text content...",
  "format": "text",
  "file_size_mb": 2.5,
  "processing_time_seconds": 15.3
}
```

## API Documentation

Visit `http://localhost:8000/docs` for interactive API documentation.
