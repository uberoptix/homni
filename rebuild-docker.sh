#!/bin/bash
# Script to rebuild the Docker container after the rollback

echo "Stopping current Docker containers..."
docker compose down

echo "Building and starting new containers with updated files..."
docker compose up -d --build

echo "Containers rebuilt and started successfully!"
echo "The application should now be accessible at http://localhost:808" 