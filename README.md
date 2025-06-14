# GAIK Monorepo

Simple pnpm monorepo for GAIK applications.

## 🏗️ Development Strategy

This repository follows a **fork-based development model** with clear branch structure:

### Branch Strategy:

- **development** - Unstable code, work in progress, not ready for public use
- **main** - Stable, tested code that works out-of-box for anyone cloning the repo
- **minimal** - Clean template without dashboard - ready for client forks
- **deployment** - Contains only shared components for public toolkit releases (no client demos)

### Repository Flow:

1. **Main repo** (this one) contains stable toolkit components and demo applications
2. **Client forks** should be created from **minimal** branch for clean start without unnecessary demo code
3. **Generic improvements** can be contributed back to main repo (only non-sensitive code)
4. **Main repo stays clean** - no client-specific or confidential code mixed with public toolkit

### For Forks:

```bash
# Fork from minimal branch for clean start
git clone -b minimal https://github.com/GAIK-project/GAIK-platform.git my-client-project
```

## 📁 Structure

```
gaik-platform/
├── web/                    # Web applications
│   ├── dashboard/          # Next.js Dashboard with AI features
│   ├── docs/               # Toolkit API documentation
│   └── client-template/    # Other web applications
├── shared/                 # Shared code packages
│   ├── components/         # Shared React components
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Shared utilities
│   ├── auth/               # Authentication utilities (Supabase)
│   └── allas/              # CSC Allas (S3) client utilities
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

**Dashboard quick start (from main branch):**

```bash
# Run dashboard directly from root
pnpm i
pnpm dev
```

**📦 Automatic Deployment:**

The Dashboard application (`web/dashboard`) is automatically deployed via CI/CD pipeline when changes are pushed to the **main** branch. Any modifications to the dashboard will be live shortly after merging to main.

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
    // Add only the packages you actually use in your app
    "@gaik/shared-utils", // Shared utility functions
    "@gaik/shared-types", // Shared TypeScript types
    "@gaik/shared-components", // Shared React components
    "@gaik/auth", // Authentication utilities
    "@gaik/allas", // CSC Allas (S3) utilities
  ],
};
```

This tells Next.js to transpile your local workspace packages during build time.

## 🎯 Beginner Tips

- **Start small:** Begin with the existing `dashboard` app in `web/dashboard/`
- **Shared packages:** Available packages: `@gaik/shared-types`, `@gaik/shared-utils`, `@gaik/shared-components`, `@gaik/auth`, and `@gaik/allas` - use only what you need
- **Development workflow:** Always run `pnpm install` at root first, then `cd` to your app folder
- **Hot reload:** Changes in `shared/` folders will trigger rebuilds in your Next.js apps
- **Import examples:**
  - `import { SomeType } from '@gaik/shared-types'`
  - `import { Button } from '@gaik/shared-components'`
  - `import { loginUser } from '@gaik/auth'`
  - `import { getFiles } from '@gaik/allas'`

## 📦 Package Management

### Adding Dependencies

```bash
# Add workspace packages (shared/) to specific app
cd web/dashboard
pnpm add @gaik/shared-types@workspace:*
pnpm add @gaik/auth@workspace:*
pnpm add @gaik/allas@workspace:*

# Add external packages to specific app only
cd web/dashboard
pnpm add react-icons

# Or use filters from root
pnpm --filter=dashboard add react-icons
```

### Key Points

- **One lock file:** Single `pnpm-lock.yaml` at root for all apps
- **App-specific deps:** Dependencies added in `web/dashboard/` only affect that app
- **Workspace packages:** Reference shared packages by their `package.json` name (e.g., `@gaik/shared-types`)
- **Filtering:** Use `--filter=<app-name>` to target commands to specific apps

### Benefits

✅ **Optimized installs** - Shared dependencies across apps  
✅ **Isolated apps** - Each app has its own dependencies  
✅ **Hot reload** - Changes in shared packages trigger rebuilds

## 📊 Monorepo Workflow

```mermaid
flowchart TD
    A[Developer] -->|pnpm install| B[Root Directory]
    B --> C[pnpm-workspace.yaml]
    C --> D[Discovers packages]

    D --> E[web/dashboard]
    D --> F[shared/types]
    D --> G[shared/utils]

    E -->|depends on| H["@gaik/shared-types@workspace:*"]
    E -->|depends on| I["@gaik/shared-utils@workspace:*"]

    H --> F
    I --> G

    B --> J[pnpm-lock.yaml]
    J --> K[Optimized Dependencies]

    style B fill:#e1f5fe
    style J fill:#fff3e0
    style F fill:#f3e5f5
    style G fill:#f3e5f5
    style E fill:#e8f5e8
```
