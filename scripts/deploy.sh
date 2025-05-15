#!/bin/bash

# Deployment script for Homni dashboard

echo "===== HOMNI DEPLOYMENT SCRIPT ====="

# Navigate to the project root directory (one level up from scripts)
cd "$(dirname "$0")/.." || exit 1
PROJECT_ROOT=$(pwd)
echo "Working from project root: $PROJECT_ROOT"

# Kill any existing server processes
echo "Checking for existing processes..."
pkill -f "python3 -m http.server" || true

# Check if important files exist in source/dist
if [ ! -f "source/dist/custom.css" ] || [ ! -f "source/dist/index.html" ]; then
  echo "WARNING: Missing critical files in source/dist. Checking for backups..."
  LATEST_BACKUP=$(find BACKUP -name "homni_full_backup_*" -type d | sort | tail -1)
  if [ -n "$LATEST_BACKUP" ] && [ -d "$LATEST_BACKUP/working_dist" ]; then
    echo "Restoring files from backup: $LATEST_BACKUP/working_dist/"
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

# Create a cache-busting script for the server
echo '#!/usr/bin/env python3
import http.server
import socketserver

PORT = 8080

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
' > source/dist/no_cache_server.py

# Start the server with cache-busting headers
echo "Starting server on port 8080 with cache-busting headers..."
cd source/dist && python3 no_cache_server.py 