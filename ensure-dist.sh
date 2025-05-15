#!/bin/bash
# Script to ensure the dist directory is included in the GitHub repository

echo "===== HOMNI DIST DIRECTORY CHECK ====="

# Create .gitkeep file in source/dist if it doesn't exist
if [ ! -d "./source/dist" ]; then
  echo "Creating dist directory..."
  mkdir -p ./source/dist
fi

# Ensure the directory isn't empty by adding a .gitkeep file
echo "Ensuring dist directory is tracked in git..."
touch ./source/dist/.gitkeep

echo "===== DIST DIRECTORY PREPARED ====="
echo "Run this command to add the directory to git:"
echo "git add ./source/dist/.gitkeep"
echo "git commit -m \"Add dist directory for Docker build\""
echo "git push" 