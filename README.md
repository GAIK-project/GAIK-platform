# GAIK Monorepo

Simple pnpm monorepo structure for GAIK applications.

## 📁 Structure

```
gaik-monorepo/
├── apps/                    # Applications
│   ├── gaik-dashboard/     # Next.js Dashboard with AI features
│   └── python/             # Python applications
├── packages/               # Shared code
│   ├── shared-types/       # TypeScript type definitions
│   └── shared-utils/       # Shared utilities
├── package.json            # Monorepo main configuration
└── pnpm-workspace.yaml     # Workspace definitions
```

## 🚀 Getting Started

### Install dependencies for the entire monorepo:

```bash
pnpm install
```

### Start development server:

```bash
# Start gaik-dashboard
pnpm dev

# OR go directly to the app folder
cd apps/gaik-dashboard
npm run dev
```

### Build all applications:

```bash
pnpm build
```

## 📦 Applications

### gaik-dashboard

Next.js-based dashboard application with AI functionality.

**Location:** `apps/gaik-dashboard/`

**Start:**

```bash
# From monorepo root
pnpm dev

# From app directory
cd apps/gaik-dashboard
npm run dev
```

### Python applications

Python-based services and scripts.

**Location:** `apps/python/`

## 🔧 Monorepo Commands

| Command        | Description                               |
| -------------- | ----------------------------------------- |
| `pnpm install` | Install all dependencies                  |
| `pnpm dev`     | Start development server (gaik-dashboard) |
| `pnpm build`   | Build all applications                    |
| `pnpm lint`    | Lint all applications                     |
| `pnpm clean`   | Clean all build files                     |

## 💡 Tips

- **Individual app startup:** You can always navigate to the `apps/` folder and start the application normally without pnpm commands
- **Adding new apps:** Create a new folder under `apps/`
- **Shared code:** Put common code in `packages/` with `shared-` prefix
- **Python and Node.js:** Both work in the same monorepo structure

## 📖 More Information

- [pnpm workspace documentation](https://pnpm.io/workspaces)
- [Monorepo best practices](https://monorepo.tools/)
