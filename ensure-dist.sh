#!/bin/bash
# Script to ensure the dist directory is included in the GitHub repository

echo "===== HOMNI DIST DIRECTORY CHECK ====="

# Create dist directory if it doesn't exist
if [ ! -d "./source/dist" ]; then
  echo "Creating dist directory..."
  mkdir -p ./source/dist
fi

# Ensure the directory isn't empty by adding a .gitkeep file
echo "Ensuring dist directory is tracked in git..."
touch ./source/dist/.gitkeep

# Create a minimal index.html if it doesn't exist
if [ ! -f "./source/dist/index.html" ]; then
  echo "Creating minimal index.html..."
  cat > ./source/dist/index.html << EOF
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Homni Dashboard</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
  <div id="app">Loading...</div>
</body>
</html>
EOF
fi

echo "===== DIST DIRECTORY PREPARED ====="
echo "Run these commands to add the directory to git:"
echo "git add ./source/dist/.gitkeep ./source/dist/index.html"
echo "git commit -m \"Add dist directory for Docker build\""
echo "git push" 