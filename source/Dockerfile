FROM nginx:alpine

# Create directory structure first
WORKDIR /usr/share/nginx/html
RUN mkdir -p /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the pre-built files if they exist
# Use a script to handle conditional copy
COPY . /tmp/source/
RUN if [ -d "/tmp/source/dist" ]; then \
      cp -r /tmp/source/dist/* /usr/share/nginx/html/ || true; \
    fi && \
    rm -rf /tmp/source

# Fix permissions - this is critical for avoiding 403 errors
RUN chmod -R 755 /usr/share/nginx/html && \
    chown -R nginx:nginx /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"] 