#!/usr/bin/env python3
"""
Simple script to start the Whisper API server.
Usage: python start.py
"""

import uvicorn

if __name__ == "__main__":
    print("🎤 Starting Whisper API server...")
    print("📖 API documentation: http://localhost:8000/docs")
    print("🔍 Health check: http://localhost:8000/health")
    print("🛑 Stop with Ctrl+C")
    print()
    
    uvicorn.run(
        "main:app",  # Import string instead of direct import
        host="0.0.0.0",
        port=8000,
        reload=True,  # Now works with import string
        log_level="info"
    )
