#!/bin/bash
# Script to fix permissions for Docker deployment

echo "===== FIXING PERMISSIONS FOR DOCKER DEPLOYMENT ====="

# Ensure dist directory exists
mkdir -p ./source/dist

# Fix permissions on dist directory
echo "Setting correct permissions on dist directory..."
chmod -R 755 ./source/dist

# Create a .dockerenv file to test docker is working properly
echo "Creating test file..."
echo "Docker environment test file" > ./source/dist/.dockerenv
chmod 644 ./source/dist/.dockerenv

echo "===== PERMISSIONS FIXED ====="
echo "You can now try rebuilding the Docker container with: ./rebuild-docker.sh" 