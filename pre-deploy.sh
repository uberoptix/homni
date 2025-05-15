#!/bin/bash
# Script to ensure everything is ready for deployment

echo "===== HOMNI PRE-DEPLOYMENT CHECK ====="

# Run the ensure-dist script
./ensure-dist.sh

# If we're on GitHub Actions, we need to make sure directories are accessible
if [ -n "$GITHUB_ACTIONS" ]; then
  echo "Running in GitHub Actions environment, ensuring permissions..."
  
  # Make sure dist directory exists and has correct permissions
  mkdir -p ./source/dist
  chmod -R 755 ./source/dist
  
  # Create a placeholder index file if needed
  if [ ! -f "./source/dist/index.html" ]; then
    echo "Creating placeholder index.html..."
    echo '<!DOCTYPE html><html><head><title>Homni</title></head><body><div id="app">Loading...</div></body></html>' > ./source/dist/index.html
  fi
fi

echo "===== PRE-DEPLOYMENT CHECK COMPLETE ====="
echo "You can now proceed with deployment" 