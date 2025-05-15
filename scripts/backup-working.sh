#!/bin/bash
# Script to backup the working version of Homni

echo "===== BACKING UP HOMNI ====="

# Set timestamp for the backup folder
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="../releases/backup_${TIMESTAMP}"

# Move to the scripts directory
cd "$(dirname "$0")" || exit 1

# Create backup directory
echo "Creating backup in: $BACKUP_DIR"
mkdir -p "$BACKUP_DIR"

# Copy the dist files
echo "Copying files..."
cp -r ../source/dist/* "$BACKUP_DIR/"

echo "===== BACKUP COMPLETE ====="
echo "Backup created at: $BACKUP_DIR"
echo "To test this backup: cd $BACKUP_DIR && python3 -m http.server 8085" 