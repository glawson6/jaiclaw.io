# Production-only Dockerfile for pre-built dist
# JKube creates an assembly at maven/ directory
# This Dockerfile expects files in maven/ subdirectory
FROM --platform=linux/amd64 nginx:alpine

# Copy custom nginx config from JKube assembly
COPY maven/nginx.conf /etc/nginx/conf.d/default.conf

# Copy pre-built application from JKube assembly
COPY maven/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/health || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
