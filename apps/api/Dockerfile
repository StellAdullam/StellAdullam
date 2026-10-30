# ── Multi-stage production Dockerfile for StellAdullam API ───────────────
FROM oven/bun:1.2-alpine AS base
WORKDIR /app

# Install dependencies in an isolated layer
FROM base AS dependencies
COPY package.json bun.lock ./
COPY apps/api/package.json ./apps/api/
COPY apps/shared/package.json ./apps/shared/
RUN bun install --frozen-lockfile

# Build shared library and API
FROM dependencies AS builder
COPY apps/shared ./apps/shared
COPY apps/api ./apps/api
WORKDIR /app/apps/shared
RUN bun run build
WORKDIR /app/apps/api
RUN bun run build

# Lean production runtime image
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3001

USER bun

COPY --from=builder --chown=bun:bun /app/node_modules ./node_modules
COPY --from=builder --chown=bun:bun /app/apps/shared/dist ./apps/shared/dist
COPY --from=builder --chown=bun:bun /app/apps/shared/package.json ./apps/shared/package.json
COPY --from=builder --chown=bun:bun /app/apps/api/dist ./apps/api/dist
COPY --from=builder --chown=bun:bun /app/apps/api/package.json ./apps/api/package.json

WORKDIR /app/apps/api

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/health || exit 1

CMD ["bun", "dist/index.js"]
