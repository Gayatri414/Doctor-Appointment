# Stage 1: Build stage
FROM node:20-slim AS build

WORKDIR /app

# Copy dependency configuration files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Declare build arguments for Vite compile-time environment variables
ARG VITE_BACKEND_URL
ARG VITE_ADMIN_PANEL_URL

# Assign build arguments to environment variables so Vite can use them
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
ENV VITE_ADMIN_PANEL_URL=$VITE_ADMIN_PANEL_URL

# Build the production bundle
RUN npm run build

# Stage 2: Production stage
FROM nginx:1.25-alpine

# Copy built files from the build stage to Nginx HTML directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose Nginx port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
