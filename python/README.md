# Python Applications

Python applications and services for GAIK platform.

## 📁 Structure

```text
python/
├── your-app/              # Your Python application
│   ├── main.py           # Application entry point
│   ├── requirements.txt  # Dependencies
│   └── venv/            # Virtual environment
├── parsers/              # Document parsers (example)
│   ├── pdf_parser.py     # PDF parser
│   ├── excel_parser.py   # Excel parser
│   └── requirements.txt
├── ai/                   # AI services (example)
│   ├── whisper.py        # Audio transcription
│   ├── embeddings.py     # Text embeddings
│   └── requirements.txt
├── another-app/          # Another Python application
└── requirements.txt      # Shared dependencies (optional)
```

## 🚀 Getting Started

### Create Virtual Environment

```bash
cd python/your-app
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Run Application

```bash
python main.py
```

## 💡 Note

Python applications in this folder are not managed by pnpm. Each application can have its own virtual environment and dependencies.
