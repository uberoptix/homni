FROM nginx:alpine

# Create directory structure
WORKDIR /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the pre-built dist directory
COPY dist/ /usr/share/nginx/html/

# Fix permissions - critical for avoiding 403 errors
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