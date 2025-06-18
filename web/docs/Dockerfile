# syntax=docker.io/docker/dockerfile:1
FROM registry.access.redhat.com/ubi8/nodejs-20:latest AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /opt/app-root/src

# Apply security updates (Red Hat requirement)
USER root
RUN dnf -y update-minimal --security --sec-severity=Important --sec-severity=Critical && \
    dnf clean all
USER 1001

# Install dependencies based on the preferred package manager  
COPY --chown=1001:0 package.json package-lock.json* ./
RUN \
  if [ -f package-lock.json ]; then npm ci --legacy-peer-deps; \
  elif [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /opt/app-root/src

# Apply security updates
USER root
RUN dnf -y update-minimal --security --sec-severity=Important --sec-severity=Critical && \
    dnf clean all
USER 1001

COPY --from=deps --chown=1001:0 /opt/app-root/src/node_modules ./node_modules
COPY --chown=1001:0 . .

# Next.js 15 environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Build the application
RUN \
  if [ -f package-lock.json ]; then npm run build; \
  elif [ -f yarn.lock ]; then yarn run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Production image, copy all the files and run next
FROM registry.access.redhat.com/ubi8/nodejs-20-minimal:latest AS runner
WORKDIR /opt/app-root/src

# Apply security updates to final image
USER root
RUN microdnf -y update && \
    microdnf clean all
USER 1001

# Red Hat Container Certification required labels
LABEL name="csc-rahti2/gaik-docs" \
      vendor="GAIK Platform" \
      version="1.0.0" \
      release="1" \
      summary="GAIK Documentation - Next.js 15 with Nextra" \
      description="Documentation platform for GAIK project built with Next.js 15 and Nextra, optimized for Red Hat OpenShift Rahti 2"

# Copy license information (Red Hat requirement)
COPY --chown=1001:0 licenses /licenses

# Environment variables for Next.js 15
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Copy standalone build from builder stage
COPY --from=builder --chown=1001:0 /opt/app-root/src/.next/standalone ./
COPY --from=builder --chown=1001:0 /opt/app-root/src/.next/static ./.next/static
COPY --from=builder --chown=1001:0 /opt/app-root/src/public ./public

EXPOSE 3000

CMD ["node", "server.js"]