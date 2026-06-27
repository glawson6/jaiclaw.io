# Multi-stage build for React Vite application
FROM --platform=linux/amd64 node:19-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

RUN npm install

# Vite inlines these JAICLAW_* env vars at build time (vite.config.js sets
# envPrefix: 'JAICLAW_'). Defaults below mirror production. Override at build
# time with --build-arg JAICLAW_X=Y per env. To leave a flag unset, pass an
# empty string ("").
ARG JAICLAW_CONTACT_API_URL=https://api-crm.taptech.net/leads
ARG JAICLAW_CAPTCHA_URL=https://api-crm.taptech.net
ARG JAICLAW_TOKEN_API_URL=https://api-crm.taptech.net
ARG JAICLAW_FEATURE_PRICING=false
ARG JAICLAW_FEATURE_SUBMISSION_TOKEN=true
ENV JAICLAW_CONTACT_API_URL=$JAICLAW_CONTACT_API_URL \
    JAICLAW_CAPTCHA_URL=$JAICLAW_CAPTCHA_URL \
    JAICLAW_TOKEN_API_URL=$JAICLAW_TOKEN_API_URL \
    JAICLAW_FEATURE_PRICING=$JAICLAW_FEATURE_PRICING \
    JAICLAW_FEATURE_SUBMISSION_TOKEN=$JAICLAW_FEATURE_SUBMISSION_TOKEN

# Build the application
RUN npm run build

# Production stage
FROM --platform=linux/amd64 nginx:alpine AS production

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built application from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/health || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
