# GAIK Monorepo

Simple pnpm monorepo for GAIK applications.

## 📁 Structure

```
gaik-dashboard/
├── web/                    # Web applications
│   ├── dashboard/          # Next.js Dashboard with AI features
│   └── another-web-app/    # Other web applications
├── shared/                 # Shared code
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Shared utilities
├── python/                 # Python applications (not managed by pnpm)
└── pnpm-workspace.yaml     # Workspace configuration
```

## 🚀 Quick Start

**1. Install dependencies:**

```bash
pnpm install
```

**2. Start dashboard:**

```bash
pnpm dev
```

This starts the development server at `http://localhost:3000`

## 🔧 Commands

| Command                | Description                    |
| ---------------------- | ------------------------------ |
| `pnpm install`         | Install all dependencies       |
| `pnpm dev`             | Start dashboard                |
| `pnpm dashboard:build` | Build dashboard for production |

## 💡 Tips

- **Individual applications:** You can navigate to `web/` folder and start the application normally
- **Python applications:** Located in `python/` folder and work independently
- **Shared code:** Put common code in `shared/` folder
