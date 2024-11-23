FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

# Copy built assets
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

# Install production dependencies only
RUN npm ci --only=production
RUN npx prisma generate

# Copy environment variables
COPY .env.production .env

EXPOSE 3000
EXPOSE 5173

CMD ["npm", "run", "start"]
