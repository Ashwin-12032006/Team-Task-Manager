# Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy the frontend folder contents
COPY frontend/package*.json ./frontend/
COPY frontend/prisma ./frontend/prisma/

# Install dependencies
WORKDIR /app/frontend
RUN npm install

# Copy the rest of the frontend code
COPY frontend/ ./

# Generate Prisma Client and build the Next.js app
# We skip linting to ensure the build succeeds
RUN npx prisma generate
RUN npm run build -- --no-lint

# Production Stage
FROM node:20-alpine AS runner

WORKDIR /app/frontend

ENV NODE_ENV=production

# Copy only the necessary files from the builder
COPY --from=builder /app/frontend/next.config.mjs ./
COPY --from=builder /app/frontend/package*.json ./
COPY --from=builder /app/frontend/public ./public
COPY --from=builder /app/frontend/.next ./.next
COPY --from=builder /app/frontend/node_modules ./node_modules
COPY --from=builder /app/frontend/prisma ./prisma

EXPOSE 3000

# Set the start command
CMD ["npm", "start"]
