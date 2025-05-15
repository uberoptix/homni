#!/bin/bash
# Script to serve the Homni application locally with no-cache headers

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

# Create a cache-busting server script if it doesn't exist
if [ ! -f "no_cache_server.py" ]; then
  echo "Creating cache-busting server script..."
  echo '#!/usr/bin/env python3
import http.server
import socketserver
import sys

PORT = 8080
if len(sys.argv) > 1:
    PORT = int(sys.argv[1])

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
' > no_cache_server.py
  chmod +x no_cache_server.py
fi

# Start the Python HTTP server with cache-busting headers
python3 no_cache_server.py $PORT 