#!/bin/bash
# Simplified deployment script for Homni

echo "===== HOMNI DEPLOYMENT ====="

# Step 1: Ensure dist directory exists and has proper permissions
echo "Step 1: Fixing permissions and preparing dist directory..."
./fix-permissions.sh

# Step 2: Backup current deployment if needed
echo "Step 2: Creating backup of current deployment..."
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
mkdir -p "./BACKUP/pre_deploy_${TIMESTAMP}"
rsync -av --exclude="node_modules" ./source/dist/ "./BACKUP/pre_deploy_${TIMESTAMP}/"
echo "Backup created at: ./BACKUP/pre_deploy_${TIMESTAMP}"

# Step 3: Stop current containers
echo "Step 3: Stopping current Docker containers..."
docker compose down

# Step 4: Clean build cache
echo "Step 4: Cleaning Docker build cache..."
docker builder prune -f

# Step 5: Build and start containers
echo "Step 5: Building and starting containers..."
docker compose up -d --build

# Step 6: Verify deployment
echo "Step 6: Verifying deployment..."
echo "Waiting 5 seconds for containers to start..."
sleep 5

if docker compose ps | grep -q "Up"; then
  echo "✅ Docker containers are running."
  echo "Deployment successful! The application should be accessible at http://localhost:808"
else
  echo "❌ Error: Docker containers are not running."
  echo "Check logs with: docker compose logs"
fi

echo "===== DEPLOYMENT COMPLETE =====" 