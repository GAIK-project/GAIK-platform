# Python Services

Python microservices for GAIK platform, managed independently from the main pnpm workspace.

## 📁 Recommended Structure

```text
python/
├── shared/                 # Common Python code
│   ├── models/            # Pydantic models, DB schemas
│   ├── utils/             # Helper functions
│   └── config/            # Configuration
├── api-gateway/           # Main FastAPI gateway
│   ├── main.py           # FastAPI app entry point
│   ├── routers/          # API route handlers
│   └── requirements.txt
├── ai-service/           # AI processing microservice
│   ├── main.py
│   └── requirements.txt
└── data-processor/       # Data processing service
    ├── main.py
    └── requirements.txt
```

## 🚀 Quick Example

### API Gateway Setup

```python
# python/api-gateway/main.py
from fastapi import FastAPI
from routers import ai, data

app = FastAPI(title="GAIK API")
app.include_router(ai.router, prefix="/api/ai")
app.include_router(data.router, prefix="/api/data")
```

### Next.js Integration

```typescript
// web/dashboard/app/api/python/route.ts
export async function POST(request: Request) {
  const data = await request.json();
  const response = await fetch("http://localhost:8000/api/ai/process", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return Response.json(await response.json());
}
```

### Production Proxy Setup

For deployment (e.g., Rahti), add this to your `next.config.js`:

```javascript
const nextConfig = {
  async rewrites() {
    const rahtiServiceUrl =
      process.env.RAHTI_SERVICE_URL || "http://127.0.0.1:8000";
    return [
      {
        source: "/api/python/:path*",
        destination: `${rahtiServiceUrl}/api/:path*`, // Proxy to Python FastAPI service
      },
    ];
  },
};
```

This allows you to call `/api/python/ai/process` from your Next.js app instead of hardcoding `localhost:8000`.

## 🔄 Development Workflow

```bash
# Start Python services
cd python/api-gateway
uvicorn main:app --port 8000 --reload

# Start Next.js (separate terminal)
cd web/dashboard
pnpm dev
```

## 💡 Benefits

- **Independent deployment** - Each service scales separately
- **Technology freedom** - Different Python versions/dependencies per service
- **Clear separation** - Frontend (Next.js) communicates via HTTP APIs
- **Easy testing** - Each service can be tested in isolation
