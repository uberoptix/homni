#!/bin/bash

# Deployment script for Homni dashboard
echo "===== HOMNI DEPLOYMENT SCRIPT ====="

# Kill any running servers
echo "Killing any running servers..."
pkill -f "node server.js" || true

# Generate a timestamp for cache busting and backups
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
echo "Using timestamp: $TIMESTAMP"

# Ensure dependencies are up-to-date
echo "Checking dependencies..."
cd ./source
npm ci || npm install

# Build production bundle
echo "Building production bundle..."
npm run build

# Create backup of current production (if it exists)
echo "Creating backup of current production..."
cd ..
if [ -d "assets" ]; then
  mkdir -p releases
  mkdir -p releases/backup_${TIMESTAMP}
  cp -r assets index.html custom.css releases/backup_${TIMESTAMP}/ 2>/dev/null || true
  
  # Run backup management to clean up old backups
  if [ -f "scripts/manage-backups.sh" ]; then
    echo "Managing backups..."
    scripts/manage-backups.sh
  fi
fi

# Back up custom.css to preserve any manual edits
if [ -f "custom.css" ]; then
  cp custom.css custom.css.backup
fi

# Clean up old asset files
echo "Cleaning up old asset files..."
rm -rf assets/*

# Copy build files to root directory, but exclude specific image files
echo "Copying build files to production directory..."
# First copy assets and main HTML
cp -r source/dist/assets .
cp source/dist/index.html .

# Copy any new directories except 'images'
find source/dist -mindepth 1 -maxdepth 1 -type d -not -name "assets" -not -name "images" -exec cp -r {} . \;

# Copy any other files except known image files we want to exclude
find source/dist -maxdepth 1 -type f -not -name "index.html" \
  -not -name "icon_black.png" \
  -not -name "icon_white.png" \
  -not -name "palette.png" \
  -not -name "vite.svg" \
  -not -name ".DS_Store" \
  -not -name "custom.css" \
  -exec cp {} . \;

# Restore custom.css from backup if it was modified
if [ -f "custom.css.backup" ]; then
  echo "Restoring custom CSS overrides..."
  mv custom.css.backup custom.css
fi

# Add cache-busting parameters to index.html
echo "Adding cache-busting parameters to index.html..."
sed -i '' "s/custom\.css\?v=[0-9]*/custom\.css\?v=$TIMESTAMP/g" index.html 2>/dev/null || true

# Use a more specific pattern for the CSS asset file
CSS_FILENAME=$(grep -o 'index-[a-zA-Z0-9]*\.css' index.html 2>/dev/null || echo "")
if [ ! -z "$CSS_FILENAME" ]; then
  # Escape any special characters in the filename
  ESCAPED_FILENAME=$(echo "$CSS_FILENAME" | sed 's/\./\\./g')
  # Now update the version parameter
  sed -i '' "s/$ESCAPED_FILENAME\?v=[0-9]*/$CSS_FILENAME\?v=$TIMESTAMP/g" index.html 2>/dev/null || true
fi

echo "Deployment complete!"
echo "Starting production server at http://localhost:8080/"
echo "Press Ctrl+C to stop when you're done."
node scripts/server.js 