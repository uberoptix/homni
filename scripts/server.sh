#!/bin/bash
# Consolidated server script for Homni
# Handles starting and stopping the local development server

PORT=8080
CACHE_BUSTING=false

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --port=*)
      PORT="${1#*=}"
      shift
      ;;
    --cache-busting)
      CACHE_BUSTING=true
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
      echo "  --cache-busting     Enable cache-busting headers"
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
echo "Starting server on port $PORT..."

# Kill any existing server processes on this port
echo "Checking for existing processes..."
pkill -f "python3 -m http.server $PORT" || true

# Prepare web directory
cd "$(dirname "$0")/.." || exit 1
if [ ! -d "web" ]; then
  echo "Error: web directory not found"
  exit 1
fi

# Change to web directory
cd web || exit 1

if [ "$CACHE_BUSTING" = true ]; then
  # Create a cache-busting server script
  echo "Using cache-busting server..."
  echo '#!/usr/bin/env python3
import http.server
import socketserver
import sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8080

class NoCacheHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

Handler = NoCacheHTTPRequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Serving with cache-busting headers at port {PORT}")
    httpd.serve_forever()
' > server_cache_busting.py
  chmod +x server_cache_busting.py
  
  # Start the Python HTTP server with cache-busting headers
  python3 server_cache_busting.py $PORT &
else
  # Start a standard Python HTTP server
  python3 -m http.server $PORT &
fi

SERVER_PID=$!

echo "Your Homni instance is now running at http://localhost:$PORT"
echo "Press Ctrl+C to stop the server"

# Wait for SIGINT
trap "kill $SERVER_PID; echo 'Server stopped'; exit 0" INT
wait 