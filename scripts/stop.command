#!/bin/bash
cd "$(dirname "$0")/.."
echo "Stopping Homni server..."
pkill -f "node.*server.js" && echo "Server stopped successfully!" || echo "No running Homni server found" 