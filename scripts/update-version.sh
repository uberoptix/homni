#!/bin/bash

# Color output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
ORANGE='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=====================================================${NC}"
echo -e "${ORANGE}  Homni Version Update Script${NC}"
echo -e "${BLUE}=====================================================${NC}"

# Check if a version is provided
if [ -z "$1" ]; then
  echo -e "${RED}Error: No version provided.${NC}"
  echo -e "Usage: ./scripts/update-version.sh <version>"
  echo -e "Example: ./scripts/update-version.sh v0.7.0"
  exit 1
fi

NEW_VERSION="$1"

# Validate version format
if ! [[ $NEW_VERSION =~ ^v[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  echo -e "${RED}Error: Invalid version format.${NC}"
  echo -e "Version should be in the format vX.Y.Z (e.g., v0.7.0)"
  exit 1
fi

# Change to the root directory
cd "$(dirname "$0")/.." || {
  echo -e "${RED}Error: Could not find the root directory.${NC}"
  exit 1
}

echo -e "${GREEN}Updating version to ${NEW_VERSION}...${NC}"

# Update VERSION file
echo -e "${GREEN}Updating VERSION file...${NC}"
echo "${NEW_VERSION}" > VERSION

# Update README.md
echo -e "${GREEN}Updating README.md...${NC}"
sed -i '' -E "s/# Homni v[0-9]+\.[0-9]+\.[0-9]+/# Homni ${NEW_VERSION}/" README.md

# Update package.json
echo -e "${GREEN}Updating package.json...${NC}"
if [ -f "source/package.json" ]; then
  VERSION_NUMBER="${NEW_VERSION#v}"
  sed -i '' -E "s/\"version\": \"[0-9]+\.[0-9]+\.[0-9]+\"/\"version\": \"${VERSION_NUMBER}\"/" source/package.json
fi

# Create release notes template if necessary
RELEASE_NOTES_FILE="docs/release-notes/${NEW_VERSION}.md"
if [ ! -f "$RELEASE_NOTES_FILE" ]; then
  echo -e "${GREEN}Creating release notes template at ${RELEASE_NOTES_FILE}...${NC}"
  mkdir -p "docs/release-notes"
  
  cat > "$RELEASE_NOTES_FILE" << EOF
# Homni ${NEW_VERSION} Release Notes

## Release Date: $(date +"%B %Y")

This release includes the following improvements and fixes.

## 🚀 Major Improvements

- 

## 🔧 Technical Improvements

- 

## 📚 Documentation Updates

- 

## 📋 Installation Instructions

1. Pull the latest changes from the repository
2. Run the deployment script: \`./scripts/deploy.sh\`
3. Restart the server: \`./scripts/stop.command && ./scripts/start.command\`

## 🔍 Known Issues

None at this time.

## 🙏 Acknowledgments

Special thanks to all contributors who made this release possible.
EOF
fi

# Update Release Notes master file
echo -e "${GREEN}Updating main release notes file...${NC}"
sed -i '' -E "1s/# Homni .*/# Homni Release Notes/" docs/RELEASE_NOTES.md
sed -i '' -E "3s|^.*$|## 🚀 ${NEW_VERSION} - $(date +"%B %Y")|" docs/RELEASE_NOTES.md

echo -e "${GREEN}Version updated to ${NEW_VERSION} successfully!${NC}"
echo -e "${BLUE}=====================================================${NC}"
echo -e "${GREEN}Don't forget to update the content of:${NC}"
echo -e "  - ${ORANGE}docs/release-notes/${NEW_VERSION}.md${NC} with release details"
echo -e "  - ${ORANGE}docs/RELEASE_NOTES.md${NC} with the main bullet points"
echo -e "${BLUE}=====================================================${NC}" 