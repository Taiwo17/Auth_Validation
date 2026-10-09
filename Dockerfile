
# syntax=docker/dockerfile:1.7

# ARG NODE_VERSION=22
# ARG BASE=bookworm-slim

# # =================
# # Build Stage
# # =================

# FROM node:${NODE_VERSION}-${BASE} AS build

# WORKDIR /app

# # Copy dependency files first for better Docker layer caching
# COPY package*.json ./

# # Install dependencies
# RUN npm ci

# # Copy application source 
# COPY . .

# # Remove development dependencies
# RUN npm prune --omit=dev

# # ================
# # Runtime stage
# # ================
# FROM node:${NODE_VERSION}-${BASE} AS runtime

# # Metadata
# LABEL org.opencontainers.image.title="Auth Validation App"
# LABEL org.opencontainers.image.source="https://github.com/Taiwo17/Auth_Validation"

# # Runtime Environment
# ENV NODE_ENV=production PORT=3000

# # Create non-root user
# RUN groupadd --system --gid 10001 app && \
#     useradd --system --uid 10001 \
#     --gid app \
#     --no-create-home \
#     --shell /usr/sbin/nologin app

# WORKDIR /app

# # Copy only what the application needs
# COPY --from=build --chown=app:app /app/package*.json ./
# COPY --from=build --chown=app:app /app/node_modules ./node_modules
# COPY --from=build --chown=app:app /app ./

# # Run as non root user
# USER app

# # Health Check
# HEALTHCHECK --interval=30s \
#     --timeout=3s \
#     --start-period=5s \
#     --retries=3 \
#     CMD node -e "require('http').get('http://localhost:3000/health', r => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"


# # Start application
# CMD ["node", "server.js"]


ARG NODE_VERSION=22
ARG BASE=bookworm-slim

# ===============
# Dependencies Stages
# ===============

FROM node:${NODE_VERSION}-${BASE} AS dependencies

WORKDIR /app

COPY package*.json ./

# Copy dependency manifests first for better layer caching
RUN npm ci --omit=dev && npm cache clean --force

# ===============
# Runtime Stages
# ===============

FROM node:${NODE_VERSION}-${BASE} AS runtime

LABEL org.opencontainers.image.title="Auth Validation App"
LABEL org.opencontainers.image.source="https://github.com/Taiwo17/Auth_Validation"

ENV NODE_ENV=production
ENV PORT=3000

# Create a non-root user
RUN groupadd --system --gid 10001 app && \
    useradd --system --uid 10001 \
    --gid app \
    --no-create-home \
    --shell /usr/sbin/nologin app

WORKDIR /app

# Copy production dependencies only
COPY --from=dependencies --chown=app:app /app/node_modules ./node_modules
COPY --chown=app:app package.json package-lock.json ./

# Copy only the application files needed at runtime
COPY --chown=app:app server.js ./
COPY --chown=app:app config/ ./config/
COPY --chown=app:app public/ ./public/
COPY --chown=app:app views/ ./views/
COPY --chown=app:app src/ ./src/

# Run as a non-root user
USER app

# Container health check
HEALTHCHECK --interval=30s \
    --timeout=3s \
    --start-period=10s \
    --retries=3 \
    CMD node -e "require('http').get('http://127.0.0.1:3000/health', r => { r.resume(); process.exit(r.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))"

CMD ["node", "server.js"]
