#!/bin/bash

# Color output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
ORANGE='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}=====================================================${NC}"
echo -e "${ORANGE}  Homni Assets Cleanup Script${NC}"
echo -e "${BLUE}=====================================================${NC}"

# Change to the root directory
cd "$(dirname "$0")/.." || {
  echo "Error: Could not find the root directory."
  exit 1
}

# Find the most recent CSS file
LATEST_CSS=$(find assets -name "index-*.css" -type f -exec ls -t {} \; | head -n 1)

if [ -z "$LATEST_CSS" ]; then
  echo -e "${ORANGE}No CSS files found in assets directory.${NC}"
  exit 1
fi

echo -e "${GREEN}Latest CSS file: $LATEST_CSS${NC}"

# Remove all other CSS files
echo -e "${GREEN}Removing older CSS files...${NC}"
find assets -name "index-*.css" -type f -not -path "$LATEST_CSS" -exec rm {} \;

# Count how many CSS files were removed
CSS_REMOVED_COUNT=$(find assets -name "index-*.css" -type f | wc -l)
CSS_REMOVED_COUNT=$((1 - CSS_REMOVED_COUNT))

echo -e "${GREEN}Removed $CSS_REMOVED_COUNT older CSS files.${NC}"

# Find the most recent JS file
LATEST_JS=$(find assets -name "index-*.js" -type f -exec ls -t {} \; | head -n 1)

if [ -z "$LATEST_JS" ]; then
  echo -e "${ORANGE}No JavaScript files found in assets directory.${NC}"
else
  echo -e "${GREEN}Latest JavaScript file: $LATEST_JS${NC}"

  # Remove all other JS files
  echo -e "${GREEN}Removing older JavaScript files...${NC}"
  find assets -name "index-*.js" -type f -not -path "$LATEST_JS" -exec rm {} \;

  # Count how many JS files were removed
  JS_REMOVED_COUNT=$(find assets -name "index-*.js" -type f | wc -l)
  JS_REMOVED_COUNT=$((1 - JS_REMOVED_COUNT))

  echo -e "${GREEN}Removed $JS_REMOVED_COUNT older JavaScript files.${NC}"
fi

echo -e "${GREEN}Assets cleanup complete.${NC}"
echo -e "${BLUE}=====================================================${NC}" 