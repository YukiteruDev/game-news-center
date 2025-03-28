# ---- Builder Stage ----
FROM node:22-slim AS builder
WORKDIR /app
RUN corepack enable pnpm

# Copy dependency manifests
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY frontend/package.json ./frontend/
COPY backend/package.json ./backend/

# Install ALL dependencies
RUN pnpm install --frozen-lockfile

# Copy the entire source code
COPY . .

# Build the frontend application (assuming 'build' script in frontend/package.json)
# This should generate static files in 'dist' or 'build' folder
RUN pnpm --filter frontend run build


# ---- Production Stage ----
# Use a minimal Nginx image
FROM nginx:1.27-alpine-slim AS production

# Copy built static assets from the builder stage to Nginx's web root
COPY --from=builder /app/frontend/dist /usr/share/nginx/html

# (Optional but Recommended) Copy a custom Nginx configuration for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Default Nginx command starts the server
CMD ["nginx", "-g", "daemon off;"]