#!/bin/bash
# Script to rebuild the Docker container with the rollback version

echo "===== HOMNI ROLLBACK DEPLOYMENT ====="
echo "This script will deploy the rolled back version with fixed styling"

echo "Stopping current Docker containers..."
docker compose down

echo "Building and starting new containers with the rollback version..."
docker compose up -d --build

echo "===== DEPLOYMENT COMPLETE ====="
echo "The rollback version should now be accessible at http://localhost:808"
echo "If you encounter any issues, you can find a backup of the previous version in ./recovery-backup/" 