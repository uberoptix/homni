#!/bin/bash

# Docker deployment script for Homni dashboard

echo "===== HOMNI DOCKER DEPLOYMENT ====="

# Navigate to the project root directory (one level up from scripts)
cd "$(dirname "$0")/.." || exit 1
PROJECT_ROOT=$(pwd)
echo "Working from project root: $PROJECT_ROOT"

# Check if docker and docker compose are installed
if ! command -v docker &> /dev/null; then
    echo "ERROR: Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if dist directory exists and has files
if [ ! -d "source/dist" ] || [ -z "$(ls -A source/dist 2>/dev/null)" ]; then
    echo "WARNING: source/dist directory is empty or doesn't exist. Checking for backups..."
    LATEST_BACKUP=$(find BACKUP -name "homni_full_backup_*" -type d | sort | tail -1)
    if [ -n "$LATEST_BACKUP" ] && [ -d "$LATEST_BACKUP/working_dist" ]; then
        echo "Restoring files from backup: $LATEST_BACKUP/working_dist/"
        mkdir -p source/dist
        rsync -av "$LATEST_BACKUP/working_dist/" source/dist/
    else
        echo "ERROR: No working backup found. Please restore the files manually."
        exit 1
    fi
fi

# Create a backup of the current dist directory
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
echo "Creating backup in releases/backup_$TIMESTAMP..."
mkdir -p "releases/backup_$TIMESTAMP"
cp -r source/dist/* "releases/backup_$TIMESTAMP/"

# Fix permissions to avoid issues with Docker
echo "Setting correct permissions for Docker..."
chmod -R 755 source/dist

# Create a docker environment marker file
echo "Docker environment - $(date)" > source/dist/.dockerenv
chmod 644 source/dist/.dockerenv

# Stop any existing container
echo "Stopping existing containers..."
docker compose down || true

# Build and start the container
echo "Building and starting Docker container..."
docker compose up -d --build

# Check if the container started successfully
if [ "$(docker ps -q -f name=homni-dashboard)" ]; then
    echo "===== DOCKER DEPLOYMENT COMPLETE ====="
    echo "Homni dashboard is now running at: http://localhost:8088"
    echo "You can check the container logs with: docker logs homni-dashboard"
    echo "To stop the container: docker compose down"
else
    echo "ERROR: Container failed to start. Check the logs with: docker compose logs"
    exit 1
fi 