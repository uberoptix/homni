#!/bin/bash

# Color output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
ORANGE='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}=====================================================${NC}"
echo -e "${ORANGE}  Homni Dashboard Installation Script${NC}"
echo -e "${BLUE}=====================================================${NC}"

# Change to the root directory
cd "$(dirname "$0")/.." || {
  echo "Error: Could not find the root directory."
  exit 1
}

# Check if node is installed
if ! command -v node &> /dev/null; then
  echo -e "${ORANGE}Warning: Node.js is not installed. Please install Node.js to run this application.${NC}"
  echo "Visit https://nodejs.org/ to download and install Node.js."
  exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
  echo -e "${ORANGE}Warning: npm is not installed. Please install npm to install dependencies.${NC}"
  echo "npm usually comes with Node.js. Visit https://nodejs.org/ to download and install."
  exit 1
fi

# Install dependencies in source directory
echo -e "${GREEN}Installing dependencies...${NC}"
cd source
npm install

if [ $? -ne 0 ]; then
  echo -e "\n${ORANGE}Error: Dependency installation failed. Please check the errors above.${NC}"
  exit 1
fi
cd ..

# Make script files executable
echo -e "${GREEN}Making scripts executable...${NC}"
chmod +x scripts/*.sh scripts/*.command

# Make sure directories exist
echo -e "${GREEN}Setting up directories...${NC}"
mkdir -p images

# Run the deployment script
echo -e "${GREEN}Running deployment script...${NC}"
scripts/deploy.sh

echo -e "\n${GREEN}Installation complete!${NC}"
echo -e "To start the server: ${ORANGE}./scripts/start.command${NC}"
echo -e "To stop the server: ${ORANGE}./scripts/stop.command${NC}"
echo -e "${BLUE}=====================================================${NC}" 