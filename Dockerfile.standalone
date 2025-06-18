# syntax=docker.io/docker/dockerfile:1
FROM registry.access.redhat.com/ubi8/nodejs-20:latest AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /opt/app-root/src

# Set user 1001 from the start (default for UBI)
USER 1001

# Install dependencies based on the preferred package manager
COPY --chown=1001:1001 package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /opt/app-root/src
USER 1001

COPY --from=deps --chown=1001:1001 /opt/app-root/src/node_modules ./node_modules
COPY --chown=1001:1001 . .

# Next.js collects completely anonymous telemetry data about general usage.
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Use .env.example for production builds
COPY --chown=1001:1001 .env.example .env.local

RUN \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Production image, copy all the files and run next
FROM registry.access.redhat.com/ubi8/nodejs-20-minimal:latest AS runner
WORKDIR /opt/app-root/src
USER 1001

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Copy standalone build
COPY --from=builder --chown=1001:1001 /opt/app-root/src/.next/standalone ./
COPY --from=builder --chown=1001:1001 /opt/app-root/src/.next/static ./.next/static
COPY --from=builder --chown=1001:1001 /opt/app-root/src/public ./public

EXPOSE 3000

CMD ["node", "server.js"]