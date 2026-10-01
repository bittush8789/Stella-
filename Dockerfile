# =========================================================================
# Multi-Stage Production Dockerfile for Stella E-Commerce
# Architecture: BuildKit-optimized, Multi-Stage, Non-Root Secure Execution
# =========================================================================

# -------------------------------------------------------------------------
# Stage 1: Build Dependencies and Static Assets
# -------------------------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Install build prerequisites
RUN apk add --no-cache libc6-compat

# Copy package descriptors for layer caching
COPY package.json ./

# Install dependencies cleanly using npm install or ci
RUN npm install

# Build arguments for client-side environment configuration
# NOTE: VITE_ prefixed variables are embedded into client bundle at build-time.
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY

ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

# Copy application source code (secrets excluded via .dockerignore)
COPY . .

# Compile application into /app/dist
RUN npm run build

# -------------------------------------------------------------------------
# Stage 2: Production Nginx Runner (Lightweight, ~25MB image)
# -------------------------------------------------------------------------
FROM nginx:1.27-alpine AS runner

# Remove default Nginx welcome page
RUN rm -rf /usr/share/nginx/html/*

# Copy custom Nginx configuration with SPA routing and security headers
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled static assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Set non-root user permissions for security hardening
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid /var/cache/nginx

# Run as non-root user
USER nginx

# Expose standard HTTP port
EXPOSE 80

# Health check to ensure service vitality
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Launch Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
