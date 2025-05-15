#!/bin/bash
# Script to serve the Homni application locally

PORT=8080
if [ "$1" != "" ]; then
  PORT=$1
fi

echo "===== STARTING HOMNI LOCAL SERVER ====="
echo "Serving Homni on port $PORT"
echo "Press Ctrl+C to stop the server"
echo ""

# Move to the dist directory
cd "$(dirname "$0")/../source/dist" || exit 1

# Start the Python HTTP server
python3 -m http.server $PORT 