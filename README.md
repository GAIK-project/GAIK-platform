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

**Prerequisites:** Install pnpm package manager - [pnpm.io/installation](https://pnpm.io/installation)

**1. Install all workspace dependencies:**

```bash
pnpm install
```

This installs dependencies for all applications defined in `pnpm-workspace.yaml`.

**2. Develop individual applications:**

Navigate to specific app folders in `web/` and work with their individual `package.json`:

```bash
cd web/dashboard
pnpm dev
```

## 🔧 How it works

- **Monorepo management:** `pnpm install` at root optimizes shared dependencies across all apps
- **Individual development:** Each app in `web/` has its own `package.json` and can use different versions (e.g., different Next.js versions)
- **Shared packages:** Common code in `shared/` can be easily imported by web applications
- **Package manager:** Use ONLY pnpm for consistency - mixing npm and pnpm breaks dependency optimization
- **Opt-out:** To use different package manager, remove your app from `pnpm-workspace.yaml`

## ⚙️ Next.js Configuration

For Next.js apps using shared workspace packages, add this to your `next.config.js`:

```javascript
const nextConfig = {
  transpilePackages: [
    "@gaik/shared-utils", // Shared utility functions
    "@gaik/shared-types", // Shared TypeScript types
  ],
};
```

This tells Next.js to transpile your local workspace packages during build time.

## 🎯 Beginner Tips

- **Start small:** Begin with the existing `dashboard` app in `web/dashboard/`
- **Shared packages:** Use `@gaik/shared-types` and `@gaik/shared-utils` in your apps
- **Development workflow:** Always run `pnpm install` at root first, then `cd` to your app folder
- **Hot reload:** Changes in `shared/` folders will trigger rebuilds in your Next.js apps
- **Import example:** `import { SomeType } from '@gaik/shared-types'`

## 💡 Tips

- **Shared code:** Common utilities and types are in `shared/` folder
- **Python applications:** Located in `python/` folder, managed independently
- **Development:** Work in individual app folders for day-to-day development
