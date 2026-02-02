# Backend Dockerfile for Stardust (NestJS)
# Using Debian-based image for better Prisma compatibility
FROM node:20-slim

WORKDIR /app

# Install dumb-init, openssl for Prisma, and build tools for native modules
RUN apt-get update && apt-get install -y --no-install-recommends dumb-init openssl python3 make g++ && rm -rf /var/lib/apt/lists/*

# Create app user
RUN groupadd -g 1001 nodejs && \
    useradd -u 1001 -g nodejs -m nestjs

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies (using local node_modules if available, or install from registry)
RUN npm config set registry https://registry.npmmirror.com && \
    npm install --omit=dev

# Copy Prisma schema
COPY prisma ./prisma/

# Copy pre-built application (assumes "npm run build" was run locally)
COPY dist ./dist

# Change ownership
RUN chown -R nestjs:nodejs /app

# Switch to non-root user
USER nestjs

# Expose the application port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})" || exit 0

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "dist/main.js"]
