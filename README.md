app/
├── api/ # API routes
│ ├── auth/ # Authentication endpoints
│ │ ├── [...nextauth]/
│ │ │ └── route.ts
│ │ ├── login/
│ │ │ └── route.ts
│ │ └── verify/
│ │ └── route.ts
│ │
│ ├── llm/ # LLM API Gateway and endpoints
│ │ ├── [...slug]/ # Dynamic API Gateway route
│ │ │ └── route.ts
│ │ ├── endpoints/ # Endpoint management
│ │ │ ├── route.ts
│ │ │ └── [id]/
│ │ │ └── route.ts
│ │ └── config/ # LLM configurations
│ │ └── route.ts
│ │
│ ├── gateway/ # General API Gateway management
│ │ ├── endpoints/
│ │ │ └── route.ts
│ │ └── config/
│ │ └── route.ts
│ │
│ ├── features/ # Feature flag management
│ │ ├── flags/
│ │ │ └── route.ts
│ │ └── roles/
│ │ └── route.ts
│ │
│ └── data/ # Data management endpoints
│ ├── files/
│ │ └── route.ts
│ ├── scraping/
│ │ └── route.ts
│ └── rag/
│ └── route.ts
│
├── lib/ # Shared utilities and services
│ ├── gateway/ # API Gateway utilities
│ │ ├── router.ts
│ │ ├── validator.ts
│ │ └── types.ts
│ │
│ ├── llm/ # LLM utilities
│ │ ├── providers/
│ │ │ ├── anthropic.ts
│ │ │ ├── openai.ts
│ │ │ └── helsinki.ts
│ │ └── types.ts

Allas käyttö
