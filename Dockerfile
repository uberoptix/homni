FROM nginx:alpine

# Set working directory
WORKDIR /usr/share/nginx/html

# Copy web assets directly to nginx html directory
COPY web/index.html .
COPY web/assets/ ./assets/
COPY web/images/ ./images/
COPY web/custom.css .

# Copy nginx configuration
COPY config/nginx.conf /etc/nginx/conf.d/default.conf

# Fix permissions
RUN chmod -R 755 /usr/share/nginx/html && \
    chown -R nginx:nginx /usr/share/nginx/html

# Create a marker file to indicate this is a Docker environment
RUN echo "Docker environment - $(date)" > .dockerenv && \
    chmod 644 .dockerenv

# Expose port 80
EXPOSE 80

# Set up healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:80/index.html || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
