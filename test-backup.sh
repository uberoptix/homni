#!/bin/bash
# Script to test the most recent backup to ensure it's complete

echo "===== TESTING HOMNI BACKUP ====="

# Find the most recent backup
LATEST_BACKUP=$(find ./BACKUP -name "homni_full_backup_*" -type d | sort | tail -1)

if [ -z "$LATEST_BACKUP" ]; then
  echo "Error: No backup found. Please run create-full-backup.sh first."
  exit 1
fi

echo "Using latest backup: $LATEST_BACKUP"

# Test if the working_dist directory exists and has files
if [ ! -d "$LATEST_BACKUP/working_dist" ]; then
  echo "Error: working_dist directory not found in backup!"
  exit 1
fi

# Count files in the working_dist directory
FILE_COUNT=$(find "$LATEST_BACKUP/working_dist" -type f | wc -l)
echo "Found $FILE_COUNT files in working_dist"

if [ "$FILE_COUNT" -lt 5 ]; then
  echo "Warning: Very few files found in working_dist. Backup may be incomplete."
fi

# Check for critical files
echo "Checking for critical files..."
CRITICAL_FILES=(
  "index.html"
  "custom.css"
  "assets/index-B7u71UfC.js"
  "assets/index-NEPqWp29.css"
  "images/icon_white.png"
  "images/palette.png"
  "images/config.png"
)

MISSING_FILES=0
for file in "${CRITICAL_FILES[@]}"; do
  if [ ! -f "$LATEST_BACKUP/working_dist/$file" ]; then
    echo "Missing critical file: $file"
    MISSING_FILES=$((MISSING_FILES+1))
  else
    echo "✓ Found critical file: $file"
  fi
done

if [ "$MISSING_FILES" -gt 0 ]; then
  echo "Error: $MISSING_FILES critical files are missing from the backup!"
  exit 1
fi

# Start a test server with the backup
echo -e "\nStarting test server with the backup..."
echo "Press Ctrl+C when you're done testing."
cd "$LATEST_BACKUP/working_dist" && python3 -m http.server 8086 