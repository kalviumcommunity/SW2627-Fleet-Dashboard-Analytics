# Multi-stage Dockerfile for Fleet Dashboard (Next.js Standalone + Render compatibility)
# Context: client directory (when Root Directory is set to "client" on Render)
FROM node:22-alpine AS base

# Step 1: Install dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package manifests and Prisma schema for accurate dependency caching
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies with lockfile fallback for cross-platform stability
RUN npm ci || (npm install && npm cache clean --force)

# Step 2: Rebuild the source code
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_SUPABASE_URL="https://eizzxjuelgullptljdrx.supabase.co"
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY="sb_publishable_QreVZbOf3Ma6FoELS9TybQ_5ODYU8Y6"
ARG NEXT_PUBLIC_MAPPLS_KEY="plhbrlxwfoffaedkpzmqsaqmmtbmvuphxgsk"

ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_MAPPLS_KEY=$NEXT_PUBLIC_MAPPLS_KEY
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Ensure Prisma client is generated before Next.js build
RUN npx prisma generate
RUN npm run build

# Step 3: Production runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Create least-privilege user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy static assets and public files needed for standalone mode
COPY --from=builder /app/public ./public
COPY --from=builder /app/mock ./mock

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
