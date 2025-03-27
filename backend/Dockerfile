FROM node:22-slim AS base
WORKDIR /app
RUN corepack enable pnpm

# ---- Builder Stage ----
FROM base AS builder
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/

RUN pnpm install --frozen-lockfile --prod=false --no-optional

COPY . .

RUN pnpm --filter backend run build

RUN pnpm deploy --filter backend --prod ./deploy/backend

# ---- Production Stage ----
FROM base AS production
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/deploy/backend ./backend

WORKDIR /app/backend

EXPOSE 3000

CMD ["node", "dist/app.js"]