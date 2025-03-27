# --- Base Stage ---
FROM node:22-slim AS base
WORKDIR /app
RUN npm install -g pnpm

# ---- Builder Stage ----
FROM base AS builder
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY frontend/package.json ./frontend/
COPY backend/package.json ./backend/

RUN pnpm install --frozen-lockfile --prod=false
COPY . .

RUN pnpm --filter frontend run build

# ---- Production Stage ----
FROM nginx:stable-alpine AS production

COPY --from=builder /app/frontend/dist /usr/share/nginx/html

COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]