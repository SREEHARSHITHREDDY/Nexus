# ── Stage 1: Builder ─────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY packages/types/package*.json       ./packages/types/
COPY packages/config/package*.json      ./packages/config/
COPY services/api/package*.json         ./services/api/

RUN npm ci --workspace=services/api \
           --workspace=packages/types \
           --workspace=packages/config

COPY tsconfig.base.json ./
COPY packages/types/     ./packages/types/
COPY packages/config/    ./packages/config/
COPY services/api/       ./services/api/

RUN cd services/api && npm run build

# ── Stage 2: Production ───────────────────────────────────────
FROM node:20-alpine AS production

ENV NODE_ENV=production

WORKDIR /app

RUN addgroup -g 1001 -S nodejs && \
    adduser  -S nestjs -u 1001

COPY --from=builder --chown=nestjs:nodejs /app/services/api/dist    ./dist
COPY --from=builder --chown=nestjs:nodejs /app/services/api/package*.json ./

RUN npm ci --omit=dev

USER nestjs

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:4000/api/health/liveness || exit 1

CMD ["node", "dist/main"]