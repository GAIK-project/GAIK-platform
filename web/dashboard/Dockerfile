# syntax=docker.io/docker/dockerfile:1
FROM registry.access.redhat.com/ubi8/nodejs-20:latest AS deps

WORKDIR /opt/app-root/src

# Set user 1001 from the start (default for UBI)
USER 1001

# Copy package.json files with correct permissions
COPY --chown=1001:1001 package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY --chown=1001:1001 web/dashboard/package.json ./web/dashboard/
COPY --chown=1001:1001 shared/ ./shared/

# Install pnpm globally (works with USER 1001 on UBI)
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install --frozen-lockfile --ignore-scripts

# Builder stage
FROM registry.access.redhat.com/ubi8/nodejs-20:latest AS builder

WORKDIR /opt/app-root/src
USER 1001

# Copy from deps stage
COPY --from=deps --chown=1001:1001 /opt/app-root/src ./

# Copy the rest of the application files
COPY --chown=1001:1001 web/dashboard/ ./web/dashboard/

# Build environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy .env.example -> .env.local
COPY --chown=1001:1001 web/dashboard/.env.example web/dashboard/.env.local

# Install pnpm and build
RUN npm install -g pnpm
RUN pnpm --filter=gaik-dashboard build

# Runner stage - minimal image
FROM registry.access.redhat.com/ubi8/nodejs-20-minimal:latest AS runner

WORKDIR /opt/app-root/src
USER 1001

# Production environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Copy standalone build
COPY --from=builder --chown=1001:1001 /opt/app-root/src/web/dashboard/.next/standalone ./
COPY --from=builder --chown=1001:1001 /opt/app-root/src/web/dashboard/.next/static ./web/dashboard/.next/static
COPY --from=builder --chown=1001:1001 /opt/app-root/src/web/dashboard/public ./web/dashboard/public

EXPOSE 3000

CMD ["node", "web/dashboard/server.js"]