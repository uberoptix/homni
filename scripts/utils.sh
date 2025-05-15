#!/bin/bash
# Consolidated utilities script for Homni

# Default values
COMMAND="help"

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    fix-permissions|fix-paths|update-version|show-info|clean-assets)
      COMMAND="$1"
      shift
      ;;
    --help)
      COMMAND="help"
      shift
      ;;
    *)
      shift
      ;;
  esac
done

# Navigate to the project root directory
cd "$(dirname "$0")/.." || exit 1
PROJECT_ROOT=$(pwd)

# Display help
show_help() {
  echo "Homni Utilities Script"
  echo "Usage: $0 [command] [options]"
  echo
  echo "Commands:"
  echo "  fix-permissions      Correct file permissions for web assets"
  echo "  fix-paths            Fix image paths in HTML and CSS files"
  echo "  update-version       Update the version number in config files"
  echo "  show-info            Display information about the project"
  echo "  clean-assets         Clean up unused assets"
  echo "  help                 Show this help message"
}

# Fix file permissions
fix_permissions() {
  echo "===== FIXING FILE PERMISSIONS ====="
  
  echo "Setting permissions for web directory..."
  find web -type f -exec chmod 644 {} \;
  find web -type d -exec chmod 755 {} \;
  
  echo "Setting permissions for config directory..."
  find config -type f -exec chmod 644 {} \;
  find config -type d -exec chmod 755 {} \;
  
  echo "Setting permissions for scripts..."
  find scripts -name "*.sh" -exec chmod 755 {} \;
  find . -maxdepth 1 -name "*.sh" -exec chmod 755 {} \;
  
  echo "Permissions fixed successfully."
}

# Fix image paths
fix_image_paths() {
  echo "===== FIXING IMAGE PATHS ====="
  
  # Check if web directory exists
  if [ ! -d "web" ]; then
    echo "Error: web directory not found"
    exit 1
  fi
  
  # Fix paths in HTML files
  echo "Fixing paths in HTML files..."
  find web -name "*.html" -exec sed -i.bak 's|src="images/|src="./images/|g' {} \;
  find web -name "*.html" -exec sed -i.bak 's|href="images/|href="./images/|g' {} \;
  
  # Fix paths in CSS files
  echo "Fixing paths in CSS files..."
  find web -name "*.css" -exec sed -i.bak 's|url(images/|url(./images/|g' {} \;
  
  # Clean up backup files
  find web -name "*.bak" -delete
  
  echo "Image paths fixed successfully."
}

# Update version number
update_version() {
  echo "===== UPDATING VERSION NUMBER ====="
  
  # Get current version from package.json
  if [ ! -f "package.json" ]; then
    echo "Error: package.json not found"
    exit 1
  fi
  
  CURRENT_VERSION=$(grep -o '"version": "[^"]*"' package.json | cut -d'"' -f4)
  
  echo "Current version: $CURRENT_VERSION"
  echo "Enter new version (leave empty to increment patch version):"
  read -r NEW_VERSION
  
  if [ -z "$NEW_VERSION" ]; then
    # Auto-increment patch version
    MAJOR=$(echo "$CURRENT_VERSION" | cut -d. -f1)
    MINOR=$(echo "$CURRENT_VERSION" | cut -d. -f2)
    PATCH=$(echo "$CURRENT_VERSION" | cut -d. -f3)
    
    NEW_PATCH=$((PATCH + 1))
    NEW_VERSION="$MAJOR.$MINOR.$NEW_PATCH"
  fi
  
  echo "Updating to version: $NEW_VERSION"
  
  # Update package.json
  sed -i.bak "s/\"version\": \"$CURRENT_VERSION\"/\"version\": \"$NEW_VERSION\"/" package.json
  rm -f package.json.bak
  
  # Update VERSION file if it exists
  if [ -f "config/VERSION" ]; then
    echo "$NEW_VERSION" > config/VERSION
  fi
  
  # Write the updated version to a timestamp file
  echo "Version: $NEW_VERSION" > "config/version_$NEW_VERSION.txt"
  echo "Updated: $(date)" >> "config/version_$NEW_VERSION.txt"
  
  echo "Version updated successfully to $NEW_VERSION"
}

# Show project information
show_info() {
  echo "===== HOMNI PROJECT INFORMATION ====="
  
  # Get version
  if [ -f "package.json" ]; then
    VERSION=$(grep -o '"version": "[^"]*"' package.json | cut -d'"' -f4)
    echo "Version: $VERSION"
  fi
  
  # Count files by type
  echo
  echo "File count by type:"
  echo "-------------------"
  echo "HTML: $(find . -name "*.html" | wc -l)"
  echo "CSS:  $(find . -name "*.css" | wc -l)"
  echo "JS:   $(find . -name "*.js" | wc -l)"
  echo "TS:   $(find . -name "*.ts" | wc -l | tr -d ' ')"
  echo "TSX:  $(find . -name "*.tsx" | wc -l | tr -d ' ')"
  echo "PNG:  $(find . -name "*.png" | wc -l)"
  echo "JPG:  $(find . -name "*.jpg" -o -name "*.jpeg" | wc -l)"
  echo "SVG:  $(find . -name "*.svg" | wc -l)"
  
  # Show directory sizes
  echo
  echo "Directory sizes:"
  echo "---------------"
  du -sh web config src scripts BACKUP 2>/dev/null | sort -hr
  
  # Show last modified files
  echo
  echo "Recently modified files:"
  echo "----------------------"
  find . -type f -not -path "*/node_modules/*" -not -path "*/.git/*" -not -path "*/BACKUP/*" -mtime -7 | grep -v "package-lock.json" | head -10
}

# Clean up unused assets
clean_assets() {
  echo "===== CLEANING UNUSED ASSETS ====="
  
  # Create a temporary directory for the process
  TEMP_DIR=$(mktemp -d)
  USED_ASSETS="$TEMP_DIR/used_assets.txt"
  ALL_ASSETS="$TEMP_DIR/all_assets.txt"
  UNUSED_ASSETS="$TEMP_DIR/unused_assets.txt"
  
  # Find all image assets
  find web/images -type f -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" -o -name "*.svg" -o -name "*.gif" > "$ALL_ASSETS"
  echo "Found $(wc -l < "$ALL_ASSETS") image assets"
  
  # Find references to assets in HTML and CSS files
  echo "Searching for asset references..."
  for file in $(find web -name "*.html" -o -name "*.css" -o -name "*.js"); do
    grep -o "images/[^\"' ]*" "$file" | sort -u >> "$USED_ASSETS"
  done
  
  # Convert to base filenames for comparison
  sed -i 's|^images/||' "$USED_ASSETS"
  sed -i 's|^web/images/||' "$ALL_ASSETS"
  
  # Find unused assets
  grep -v -f "$USED_ASSETS" "$ALL_ASSETS" > "$UNUSED_ASSETS"
  
  # Report findings
  UNUSED_COUNT=$(wc -l < "$UNUSED_ASSETS")
  echo "Found $UNUSED_COUNT potentially unused assets"
  
  if [ "$UNUSED_COUNT" -gt 0 ]; then
    echo
    echo "Potentially unused assets:"
    cat "$UNUSED_ASSETS"
    
    echo
    echo "Would you like to move these assets to a backup directory? (y/n)"
    read -r CONFIRM
    
    if [[ "$CONFIRM" == "y" || "$CONFIRM" == "Y" ]]; then
      # Create a backup directory
      BACKUP_DIR="BACKUP/unused_assets_$(date +%Y%m%d_%H%M%S)"
      mkdir -p "$BACKUP_DIR"
      
      # Move each unused asset to the backup directory
      while IFS= read -r asset; do
        if [ -f "web/images/$asset" ]; then
          echo "Moving: web/images/$asset"
          mv "web/images/$asset" "$BACKUP_DIR/"
        fi
      done < "$UNUSED_ASSETS"
      
      echo "Moved $UNUSED_COUNT unused assets to $BACKUP_DIR"
    else
      echo "No assets were removed."
    fi
  fi
  
  # Clean up temporary directory
  rm -rf "$TEMP_DIR"
}

# Execute the requested command
case $COMMAND in
  "fix-permissions")
    fix_permissions
    ;;
  "fix-paths")
    fix_image_paths
    ;;
  "update-version")
    update_version
    ;;
  "show-info")
    show_info
    ;;
  "clean-assets")
    clean_assets
    ;;
  "help"|*)
    show_help
    ;;
esac 