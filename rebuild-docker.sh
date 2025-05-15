#!/bin/bash
# Script to rebuild the Docker container with the rollback version

echo "===== HOMNI ROLLBACK DEPLOYMENT ====="
echo "This script will deploy the rolled back version with fixed styling"

# Run the permission fix script
echo "Fixing permissions..."
./fix-permissions.sh

echo "Stopping current Docker containers..."
docker compose down

# Clean any previous build cache
echo "Cleaning Docker build cache..."
docker builder prune -f

echo "Building and starting new containers with the rollback version..."
docker compose up -d --build

echo "===== DEPLOYMENT COMPLETE ====="
echo "The rollback version should now be accessible at http://localhost:808"
echo "If you encounter issues with 403 Forbidden, run: docker compose logs frontend"
echo "A backup of the previous version is in ./recovery-backup/" 