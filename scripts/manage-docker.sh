#!/bin/bash

# Docker management script for Homni dashboard

# Navigate to the project root directory (one level up from scripts)
cd "$(dirname "$0")/.." || exit 1
PROJECT_ROOT=$(pwd)

# Display usage information
show_usage() {
    echo "===== HOMNI DOCKER MANAGEMENT ====="
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  start       Start the Docker container without rebuilding"
    echo "  stop        Stop the Docker container"
    echo "  restart     Restart the Docker container"
    echo "  logs        Show container logs"
    echo "  status      Show container status"
    echo "  rebuild     Rebuild and restart the container"
    echo "  clean       Remove unused Docker resources"
    echo "  deploy      Full deployment (same as deploy-docker.sh)"
    echo ""
}

# Check if docker is installed
if ! command -v docker &> /dev/null; then
    echo "ERROR: Docker is not installed. Please install Docker first."
    exit 1
fi

# If no arguments provided, show usage
if [ "$#" -eq 0 ]; then
    show_usage
    exit 0
fi

# Process commands
case "$1" in
    start)
        echo "Starting Homni Docker container..."
        docker compose up -d
        echo "Container started at http://localhost:8088"
        ;;
    stop)
        echo "Stopping Homni Docker container..."
        docker compose down
        echo "Container stopped"
        ;;
    restart)
        echo "Restarting Homni Docker container..."
        docker compose restart
        echo "Container restarted"
        ;;
    logs)
        echo "Showing Homni Docker container logs..."
        docker logs homni-dashboard -f
        ;;
    status)
        echo "===== HOMNI DOCKER STATUS ====="
        echo "Container status:"
        docker ps -a | grep homni-dashboard || echo "No container found"
        echo ""
        echo "Container health:"
        docker inspect --format='{{json .State.Health}}' homni-dashboard 2>/dev/null | grep -v "null" || echo "Health check not available"
        ;;
    rebuild)
        echo "Rebuilding Homni Docker container..."
        docker compose down
        docker compose up -d --build
        echo "Container rebuilt and started at http://localhost:8088"
        ;;
    clean)
        echo "Cleaning unused Docker resources..."
        docker system prune -f
        echo "Cleanup complete"
        ;;
    deploy)
        echo "Running full deployment..."
        ./scripts/deploy-docker.sh
        ;;
    *)
        echo "Unknown command: $1"
        show_usage
        exit 1
        ;;
esac 