# ---- Builder Stage ----
FROM node:22-slim AS builder
WORKDIR /app
RUN corepack enable pnpm

RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ && rm -rf /var/lib/apt/lists/*

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm --filter backend run build

ENV PUPPETEER_CACHE_DIR=/app/.puppeteer-cache
RUN pnpm --filter backend exec -- pnpm dlx puppeteer@latest browsers install chrome --path ${PUPPETEER_CACHE_DIR}


# ---- Production Stage ----
FROM node:22-slim AS production
WORKDIR /app
RUN corepack enable pnpm

# Set production environment
ENV NODE_ENV=production
ENV PUPPETEER_CACHE_DIR=/app/.puppeteer-cache
# ENV PUPPETEER_EXECUTABLE_PATH=... # If needed

# Install *runtime* OS dependencies for Puppeteer and dumb-init
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    ca-certificates fonts-liberation libasound2 libatk-bridge2.0-0 libatk1.0-0 \
    libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgbm1 libglib2.0-0 libnspr4 \
    libnss3 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 \
    libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 \
    lsb-release wget xdg-utils dumb-init \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy dependency manifests
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
# COPY frontend/package.json ./frontend/ # Optional if needed for structure

# Install ONLY production dependencies AND ignore lifecycle scripts (like husky's prepare)
RUN pnpm install --prod --frozen-lockfile --ignore-scripts

# Copy built application code from builder stage
COPY --from=builder /app/backend/dist ./backend/dist
# COPY --from=builder /app/backend/public ./backend/public # If needed

# Copy the downloaded browser from the builder stage
COPY --from=builder ${PUPPETEER_CACHE_DIR} ${PUPPETEER_CACHE_DIR}

# Add a non-root user and switch to it
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 --ingroup nodejs --home /app/home --shell /bin/false nodejs

RUN mkdir -p ${PUPPETEER_CACHE_DIR} /app/home/.cache && chown -R nodejs:nodejs /app

ENV HOME=/app/home
USER nodejs

EXPOSE 3000

CMD ["dumb-init", "sh", "-c", "pnpm --filter backend migration:up && echo 'Starting application...' && node backend/dist/src/app.js"]