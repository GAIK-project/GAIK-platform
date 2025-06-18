import os
import tempfile
from pathlib import Path

import httpx
import pytest

# Test that requires a running server and actual OpenAI API key
# Run with: pytest test_api.py -v --tb=short

BASE_URL = "http://localhost:8000"

def test_health_endpoint():
    """Test health check endpoint."""
    with httpx.Client() as client:
        response = client.get(f"{BASE_URL}/health")
        assert response.status_code == 200
        data = response.json()
        assert "status" in data

def test_root_endpoint():
    """Test root endpoint."""
    with httpx.Client() as client:
        response = client.get(f"{BASE_URL}/")
        assert response.status_code == 200
        data = response.json()
        assert data["message"] == "Whisper API is running"

@pytest.mark.skip(reason="Requires actual audio file and OpenAI API key")
def test_transcribe_endpoint():
    """Test transcription endpoint with a real audio file."""
    # This test requires:
    # 1. A running server with valid OPENAI_API_KEY
    # 2. An actual audio file to test with
    
    # Create a dummy audio file for testing (you'd use a real one)
    test_audio_path = Path(__file__).parent / "test_audio.wav"
    
    if not test_audio_path.exists():
        pytest.skip("No test audio file found")
    
    with httpx.Client(timeout=60) as client:
        with open(test_audio_path, "rb") as f:
            files = {"file": ("test.wav", f, "audio/wav")}
            data = {
                "language": "en",
                "response_format": "text"
            }
            
            response = client.post(f"{BASE_URL}/transcribe", files=files, data=data)
            
        assert response.status_code == 200
        result = response.json()
        
        assert "content" in result
        assert "language" in result
        assert "format" in result
        assert result["format"] == "text"
        assert result["language"] == "en"
