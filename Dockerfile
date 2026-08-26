FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY client/package*.json ./
RUN npm ci

# Copy application files
COPY client/ .

# Build Next.js
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Production settings
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

EXPOSE 3000

CMD ["node", ".next/standalone/server.js"]