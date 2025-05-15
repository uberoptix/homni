#!/bin/bash
# Consolidated Docker management script for Homni

# Default values
PORT=8088
COMMAND="status"

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --port=*)
      PORT="${1#*=}"
      shift
      ;;
    start|stop|restart|deploy|build|status)
      COMMAND="$1"
      shift
      ;;
    --help)
      echo "Usage: $0 [command] [options]"
      echo "Commands:"
      echo "  start       Start the Docker container"
      echo "  stop        Stop the Docker container"
      echo "  restart     Restart the Docker container"
      echo "  deploy      Build and deploy the Docker container"
      echo "  build       Build the Docker image"
      echo "  status      Check container status (default)"
      echo "Options:"
      echo "  --port=NUMBER  Set the host port (default: 8088)"
      echo "  --help         Show this help message"
      exit 0
      ;;
    *)
      shift
      ;;
  esac
done

# Navigate to the project root directory
cd "$(dirname "$0")/.." || exit 1
PROJECT_ROOT=$(pwd)
echo "Working from project root: $PROJECT_ROOT"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "ERROR: Docker is not installed. Please install Docker first."
    exit 1
fi

# Function to check container status
check_status() {
  echo "Checking Homni container status..."
  if [ "$(docker ps -q -f name=homni-dashboard)" ]; then
    echo "Homni container is RUNNING"
    echo "Access your dashboard at: http://localhost:$PORT"
    docker ps -f name=homni-dashboard
    return 0
  elif [ "$(docker ps -aq -f name=homni-dashboard)" ]; then
    echo "Homni container is STOPPED"
    docker ps -a -f name=homni-dashboard
    return 1
  else
    echo "Homni container is NOT DEPLOYED"
    return 2
  fi
}

# Function to start the container
start_container() {
  if [ "$(docker ps -q -f name=homni-dashboard)" ]; then
    echo "Homni container is already running."
    return 0
  elif [ "$(docker ps -aq -f name=homni-dashboard)" ]; then
    echo "Starting Homni container..."
    docker start homni-dashboard
    echo "Homni dashboard is now running at: http://localhost:$PORT"
  else
    echo "Container doesn't exist. Please deploy first."
    return 1
  fi
}

# Function to stop the container
stop_container() {
  if [ "$(docker ps -q -f name=homni-dashboard)" ]; then
    echo "Stopping Homni container..."
    docker stop homni-dashboard
    echo "Homni container stopped."
  else
    echo "Homni container is not running."
  fi
}

# Function to build the Docker image
build_image() {
  echo "Building Homni Docker image..."
  
  # Make sure we have the config directory set up correctly
  if [ ! -f "config/nginx.conf" ]; then
    echo "ERROR: Missing nginx.conf in config directory."
    exit 1
  fi
  
  # Update docker-compose.yml with the specified port if needed
  if grep -q "8088:80" config/docker-compose.yml; then
    sed -i.bak "s/8088:80/$PORT:80/" config/docker-compose.yml
    rm -f config/docker-compose.yml.bak
  fi
  
  docker build -t homni:latest .
  echo "Homni Docker image built successfully."
}

# Function to deploy the container
deploy_container() {
  echo "===== DEPLOYING HOMNI DOCKER CONTAINER ====="
  
  # Stop any existing container
  echo "Stopping existing containers..."
  docker compose -f config/docker-compose.yml down || true
  
  # Build the image if needed
  build_image
  
  # Start the container
  echo "Starting Homni container..."
  docker compose -f config/docker-compose.yml up -d
  
  # Check if the container started successfully
  if [ "$(docker ps -q -f name=homni-dashboard)" ]; then
    echo "===== DOCKER DEPLOYMENT COMPLETE ====="
    echo "Homni dashboard is now running at: http://localhost:$PORT"
    echo "You can check the container logs with: docker logs homni-dashboard"
  else
    echo "ERROR: Container failed to start. Check the logs with: docker compose logs"
    exit 1
  fi
}

# Execute the requested command
case $COMMAND in
  "start")
    start_container
    ;;
  "stop")
    stop_container
    ;;
  "restart")
    stop_container
    start_container
    ;;
  "deploy")
    deploy_container
    ;;
  "build")
    build_image
    ;;
  "status"|*)
    check_status
    ;;
esac 