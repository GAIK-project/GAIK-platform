# syntax=docker.io/docker/dockerfile:1
FROM registry.access.redhat.com/ubi8/nodejs-20:latest AS deps

WORKDIR /opt/app-root/src

# TÄRKEÄ: Kopioi dashboard ENNEN pnpm install -komentoa
# Näin PNPM luo node_modules/.bin/next linkin oikein
COPY web/dashboard/ ./web/dashboard/

# Kopioi monorepo configuration
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY shared/ ./shared/

# Asenna pnpm ja aseta oikeudet
USER root
RUN npm install -g pnpm && \
    chown -R 1001:0 /opt/app-root/src && \
    chmod -R g+rwX /opt/app-root/src

# Vaihda käyttäjäksi ja asenna riippuvuudet
USER 1001
RUN pnpm install --frozen-lockfile --ignore-scripts

# Builder stage
FROM registry.access.redhat.com/ubi8/nodejs-20:latest AS builder

WORKDIR /opt/app-root/src

# Kopioi kaikki deps-vaiheesta valmiilla oikeuksilla
COPY --from=deps --chown=1001:0 /opt/app-root/src ./

# Aseta build-ympäristö
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Asenna pnpm builder-vaiheeseen
USER root
RUN npm install -g pnpm

# Buildaa sovellus käyttäjänä 1001
USER 1001
RUN pnpm --filter=gaik-dashboard build

# Runner stage - minimal image tuotantoon
FROM registry.access.redhat.com/ubi8/nodejs-20-minimal:latest AS runner

WORKDIR /opt/app-root/src

# Tuotantoympäristön muuttujat
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Kopioi standalone build oikeilla oikeuksilla
COPY --from=builder --chown=1001:0 /opt/app-root/src/web/dashboard/.next/standalone ./
COPY --from=builder --chown=1001:0 /opt/app-root/src/web/dashboard/.next/static ./web/dashboard/.next/static
COPY --from=builder --chown=1001:0 /opt/app-root/src/web/dashboard/public ./web/dashboard/public

# Käytä ei-root käyttäjää
USER 1001

# Avaa portti
EXPOSE 3000

# Käynnistä standalone-serveri
CMD ["node", "web/dashboard/server.js"]