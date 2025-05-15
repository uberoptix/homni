FROM node:18-alpine as build

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY source/package*.json ./
RUN npm install

# Copy source code
COPY source/src ./src
COPY source/public ./public
COPY source/index.html ./
COPY source/vite.config.ts ./
COPY source/tsconfig*.json ./

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy nginx configuration
COPY source/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Fix permissions
RUN chmod -R 755 /usr/share/nginx/html && \
    chown -R nginx:nginx /usr/share/nginx/html

# Create a marker file to indicate this is a Docker environment
RUN echo "Docker environment - $(date)" > /usr/share/nginx/html/.dockerenv && \
    chmod 644 /usr/share/nginx/html/.dockerenv

# Expose port 80
EXPOSE 80

# Set up healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:80/index.html || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"] 