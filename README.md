# Project Setup Guide

This guide will help you set up your development environment for this Next.js 15 project.

## Prerequisites

Make sure you have the following installed on your system:

- Node.js (nodejs.org/en/download)
- pnpm (pnpm.io/installation)

## Installation Steps

1. Clone the repository and install dependencies:

   ```bash
   git clone https://github.com/GAIK-kokeilut/GAIK-dashboard
   cd GAIK-dashboard
   pnpm install
   ```

2. Install required setup dependencies:

   ```bash
   pnpm add -D tsx
   ```

3. Run the setup script:

   ```bash
   pnpm db:setup
   ```

The setup script will guide you through configuring:

- Supabase credentials (optional)
- CSC Allas S3 storage (optional)
- OpenAI API key (optional)

You can skip any step if you don't need that functionality right now.

After setup is complete, start the development server:

```bash
pnpm dev
```

**Note:** Alternatively, you can set up environment variables manually:

1. Copy `.env.example` to `.env.local`
2. Fill in the required values in `.env.local`

You can modify these values (e.g., S3 bucket name) at any time by editing `.env.local`

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [CSC Allas Documentation](https://docs.csc.fi/data/Allas/)
- [OpenAI API Documentation](https://platform.openai.com/docs)
