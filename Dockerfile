# Build stage
FROM node:20-alpine AS builder

# Build arguments for environment
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN NODE_ENV=development npm install

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build application
RUN npm run build

# Production stage
FROM node:20-alpine AS runner

# Build arguments for environment
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

# Copy built assets and necessary files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules

# Install production dependencies only
RUN if [ "$NODE_ENV" = "production" ]; then \
        npm prune --production; \
    fi

# Create logs directory
RUN mkdir -p logs

# Copy environment-specific files
COPY .env.${NODE_ENV} .env

# Expose ports
EXPOSE 3000
EXPOSE 5173

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

# Start the application
CMD ["npm", "run", "start"]
