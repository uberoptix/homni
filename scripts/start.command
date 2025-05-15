#!/bin/bash
cd "$(dirname "$0")/.."
echo "Starting Homni server on http://localhost:8080"
node scripts/server.js 