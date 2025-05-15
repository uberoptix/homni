#!/bin/bash

# Change to the root directory
cd "$(dirname "$0")/.." || {
  echo "Error: Could not find the root directory."
  exit 1
}

# Fix image paths in production CSS files
echo "Fixing image paths in CSS files..."

# Fix paths in production CSS files
for file in assets/index-*.css; do
  echo "Processing: $file"
  # Use sed to replace image paths
  sed -i '' 's|url(/icon_|url(/images/icon_|g' "$file"
  sed -i '' 's|url(/palette.png)|url(/images/palette.png)|g' "$file"
  echo "Updated: $file"
done

# Fix production index.html
echo "Fixing image paths in index.html..."
sed -i '' 's|href="/icon_|href="/images/icon_|g' index.html
sed -i '' 's|url('\''/icon_|url('\''/images/icon_|g' index.html

echo "Done! Image paths have been updated." 