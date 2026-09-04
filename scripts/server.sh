#!/bin/bash
# Consolidated server script for Homni
# Handles starting and stopping the local development server

PORT=8080

SKIP_BUILD=false

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --port=*)
      PORT="${1#*=}"
      shift
      ;;
    --skip-build)
      SKIP_BUILD=true
      shift
      ;;
    --stop)
      echo "Stopping all Homni server processes..."
      pkill -f "python3 -m http.server $PORT" || true
      echo "Server stopped"
      exit 0
      ;;
    --help)
      echo "Usage: $0 [options]"
      echo "Options:"
      echo "  --port=NUMBER       Set server port (default: 8080)"
      echo "  --skip-build        Skip the build step and serve existing files"
      echo "  --stop              Stop running server"
      echo "  --help              Show this help message"
      exit 0
      ;;
    *)
      shift
      ;;
  esac
done

echo "===== HOMNI SERVER ====="

# Build the application first (unless skipped)
if [ "$SKIP_BUILD" = false ]; then
  echo "Building application..."
  if ! npm run build; then
    echo "❌ Build failed. Please check for errors above."
    exit 1
  fi
  echo "✅ Build completed successfully"
else
  echo "⏭️  Skipping build step"
  if [ ! -d "web" ]; then
    echo "❌ No web directory found. Run without --skip-build first."
    exit 1
  fi
fi

echo "Starting server on port $PORT..."

# Kill any existing server processes on this port
echo "Checking for existing processes..."
pkill -f "python3 -m http.server $PORT" || true

# Change to web directory
cd "$(dirname "$0")/web" || exit 1

# Start a standard Python HTTP server
python3 -m http.server $PORT &

SERVER_PID=$!

echo "Your Homni instance is now running at http://localhost:$PORT"
echo "Press Ctrl+C to stop the server"

# Wait for SIGINT
trap "kill $SERVER_PID; echo 'Server stopped'; exit 0" INT
wait 