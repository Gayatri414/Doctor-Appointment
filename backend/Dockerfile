# Use official lightweight Node.js LTS image as base
FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy dependency configuration files
COPY package*.json ./

# Install production-only dependencies
RUN npm ci --omit=dev

# Copy application source code
COPY . .

# Set production environment
ENV NODE_ENV=production

# Expose port
EXPOSE 4000

# Start backend server
CMD ["node", "server.js"]
