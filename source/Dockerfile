FROM nginx:alpine

# Create directory structure
WORKDIR /usr/share/nginx/html

# Copy the pre-built files
COPY dist/ .

# If dist doesn't exist in repo, this ensures we don't fail
RUN mkdir -p /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"] 