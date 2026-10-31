# Use Node.js 18 on Alpine Linux
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm ci --omit=dev

# Copy application files
COPY src/ ./src/
COPY data/ ./data/
COPY public/ ./public/

# Create a non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Application port
EXPOSE 3000

# Start application
CMD ["node", "src/server.js"]
