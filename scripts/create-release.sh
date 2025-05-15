#!/bin/bash

# Color output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
ORANGE='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}=====================================================${NC}"
echo -e "${ORANGE}  Homni Release Creation Script${NC}"
echo -e "${BLUE}=====================================================${NC}"

# Change to the root directory
cd "$(dirname "$0")/.." || {
  echo "Error: Could not find the root directory."
  exit 1
}

# Get the version from package.json
VERSION=$(grep -o '"version": "[^"]*' source/package.json | cut -d'"' -f4)

if [ -z "$VERSION" ]; then
  echo -e "${ORANGE}Error: Could not determine version from package.json${NC}"
  exit 1
fi

# Get optional release name argument
RELEASE_NAME=$1
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo -e "${GREEN}Creating release for version $VERSION...${NC}"

# Create releases directory if it doesn't exist
mkdir -p releases

# Create release metadata file
RELEASE_INFO="releases/release-v$VERSION-info.txt"
echo "Version: v$VERSION" > "$RELEASE_INFO"
echo "Created: $(date)" >> "$RELEASE_INFO"
echo "Timestamp: $TIMESTAMP" >> "$RELEASE_INFO"
if [ ! -z "$RELEASE_NAME" ]; then
  echo "Name: $RELEASE_NAME" >> "$RELEASE_INFO"
  echo -e "${GREEN}Release name: $RELEASE_NAME${NC}"
fi

# Create the release zip file
echo -e "${GREEN}Creating zip file...${NC}"
zip -r "releases/homni-v$VERSION.zip" \
  index.html \
  server.js \
  custom.css \
  assets \
  images \
  scripts \
  docs \
  README.md \
  .gitignore \
  .gitattributes \
  "$RELEASE_INFO" \
  -x "*.DS_Store" \
  -x "*/node_modules/*" \
  -x "*/.*"

if [ $? -ne 0 ]; then
  echo -e "\n${ORANGE}Error: Failed to create zip file. Please check the errors above.${NC}"
  exit 1
fi

# Run backup management to organize releases
if [ -f "scripts/manage-backups.sh" ]; then
  echo -e "${GREEN}Managing releases...${NC}"
  scripts/manage-backups.sh
fi

echo -e "\n${GREEN}Release created successfully!${NC}"
echo -e "Release file: ${ORANGE}releases/homni-v$VERSION.zip${NC}"
echo -e "${BLUE}=====================================================${NC}" 