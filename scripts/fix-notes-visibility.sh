#!/bin/bash

# Color output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
ORANGE='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=====================================================${NC}"
echo -e "${ORANGE}  Homni Service Notes Visibility Fix Script${NC}"
echo -e "${BLUE}=====================================================${NC}"

# Change to the root directory
cd "$(dirname "$0")/.." || {
  echo -e "${RED}Error: Could not find the root directory.${NC}"
  exit 1
}

# Check if we have the fix-notes-visibility.js file
if [ ! -f "source/fix-notes-visibility.js" ]; then
  echo -e "${RED}Error: fix-notes-visibility.js not found in source directory.${NC}"
  echo "This script requires the fix-notes-visibility.js utility to be present."
  exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
  echo -e "${RED}Error: Node.js is not installed. Please install Node.js to run this fix.${NC}"
  exit 1
fi

echo -e "${GREEN}Checking for issues with service notes visibility...${NC}"

# Run the fix-notes-visibility.js script
cd source
node fix-notes-visibility.js

if [ $? -ne 0 ]; then
  echo -e "${RED}Error: Failed to run the notes visibility fix.${NC}"
  exit 1
fi

echo -e "${GREEN}Service notes visibility check completed!${NC}"

# Check if deployment is needed
echo -e "${ORANGE}Do you want to deploy the updated version? (y/n)${NC}"
read -r deploy_answer

if [[ "$deploy_answer" =~ ^[Yy]$ ]]; then
  echo -e "${GREEN}Running deployment script...${NC}"
  cd ..
  ./scripts/deploy.sh
else
  echo -e "${BLUE}No deployment requested. Please run ./scripts/deploy.sh manually if needed.${NC}"
fi

echo -e "${BLUE}=====================================================${NC}"
echo -e "${GREEN}Script completed!${NC}"
echo -e "${BLUE}=====================================================${NC}" 