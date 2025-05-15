#!/bin/bash

# Color output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
ORANGE='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=====================================================${NC}"
echo -e "${ORANGE}  Homni Release Directory Cleanup${NC}"
echo -e "${BLUE}=====================================================${NC}"

# Change to the root directory
cd "$(dirname "$0")/.." || {
  echo -e "${RED}Error: Could not find the root directory.${NC}"
  exit 1
}

# Directory containing all releases and backups
RELEASES_DIR="releases"

# Function to confirm actions
confirm() {
  read -p "$1 (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    return 0
  else
    return 1
  fi
}

# ================ Check if directory exists ================
if [ ! -d "$RELEASES_DIR" ]; then
  echo -e "${RED}Error: Releases directory not found!${NC}"
  exit 1
fi

# ================ Print statistics ================
TOTAL_DIRS=$(find "$RELEASES_DIR" -type d | wc -l)
TOTAL_FILES=$(find "$RELEASES_DIR" -type f | wc -l)
TOTAL_SIZE=$(du -sh "$RELEASES_DIR" | awk '{print $1}')
BACKUP_DIRS=$(find "$RELEASES_DIR" -type d -name "backup_*" | wc -l)
RELEASE_FILES=$(find "$RELEASES_DIR" -type f -name "homni*" | wc -l)

echo -e "${GREEN}Current state:${NC}"
echo -e "  Total directories: $TOTAL_DIRS"
echo -e "  Total files: $TOTAL_FILES"
echo -e "  Total size: $TOTAL_SIZE"
echo -e "  Backup directories: $BACKUP_DIRS"
echo -e "  Release files: $RELEASE_FILES"
echo

# ================ Standardize release files ================
echo -e "${BLUE}Standardizing release files...${NC}"

# Process all release files
for file in "$RELEASES_DIR"/homni*; do
  if [ -f "$file" ]; then
    filename=$(basename "$file")
    
    # Check for correct format (homni-v0.0.0.zip)
    if [[ $filename =~ ^homni-v[0-9]+\.[0-9]+\.[0-9]+\.zip$ ]]; then
      echo -e "${GREEN}  $filename is already in standard format${NC}"
      continue
    fi
    
    # Try to extract version from the filename
    if [[ $filename =~ v([0-9]+\.[0-9]+\.[0-9]+) ]]; then
      version="${BASH_REMATCH[1]}"
      new_name="homni-v$version.zip"
      
      # Check if the destination file already exists
      if [ -f "$RELEASES_DIR/$new_name" ]; then
        echo -e "${ORANGE}  Cannot rename $filename to $new_name - file already exists${NC}"
        if confirm "  Do you want to remove the duplicate $filename?"; then
          rm "$file"
          echo -e "${GREEN}  Removed duplicate file $filename${NC}"
        fi
      else
        echo -e "${GREEN}  Renaming $filename to $new_name${NC}"
        mv "$file" "$RELEASES_DIR/$new_name"
      fi
    else
      echo -e "${ORANGE}  Cannot determine version for $filename${NC}"
      if confirm "  Do you want to keep this file?"; then
        echo -e "${GREEN}  Keeping $filename${NC}"
      else
        rm "$file"
        echo -e "${GREEN}  Removed $filename${NC}"
      fi
    fi
  fi
done

# ================ Organize backups by date ================
echo -e "${BLUE}Organizing backups by date...${NC}"

# Get all unique dates from backup directories
dates=$(find "$RELEASES_DIR" -type d -name "backup_*" | grep -o "[0-9]\{8\}_" | sort -u | sed 's/_//')

# Count backups by date
for date in $dates; do
  count=$(find "$RELEASES_DIR" -type d -name "backup_${date}_*" | wc -l)
  echo -e "${GREEN}  Date $date: $count backups${NC}"
done

# Prompt for keeping recent backups
echo
MAX_DAYS=7
if confirm "Keep only backups from the last $MAX_DAYS days?"; then
  # Get current date and calculate cutoff date
  CUTOFF_DATE=$(date -v -${MAX_DAYS}d +%Y%m%d)
  
  # Find backup directories older than cutoff date
  OLD_BACKUPS=$(find "$RELEASES_DIR" -type d -name "backup_*" | grep -o "backup_[0-9]\{8\}_" | sort -u | grep -o "[0-9]\{8\}" | grep -v "${CUTOFF_DATE}\|$(date +%Y%m%d)")
  
  # Remove old backups
  for OLD_DATE in $OLD_BACKUPS; do
    if [ "$OLD_DATE" -lt "$CUTOFF_DATE" ]; then
      echo -e "${GREEN}  Removing all backups from ${OLD_DATE} (older than $MAX_DAYS days)${NC}"
      find "$RELEASES_DIR" -type d -name "backup_${OLD_DATE}_*" | while read OLD_BACKUP; do
        echo -e "    ${ORANGE}Removing $OLD_BACKUP${NC}"
        rm -rf "$OLD_BACKUP"
      done
    fi
  done
fi

# ================ Limit backups per day ================
echo
MAX_BACKUPS_PER_DAY=3
if confirm "Keep only the $MAX_BACKUPS_PER_DAY most recent backups for each day?"; then
  # Get all unique dates again (may have changed)
  dates=$(find "$RELEASES_DIR" -type d -name "backup_*" | grep -o "[0-9]\{8\}_" | sort -u | sed 's/_//')
  
  # For each date, keep only the most recent backups
  for date in $dates; do
    BACKUPS_FOR_DATE=$(find "$RELEASES_DIR" -type d -name "backup_${date}_*" | sort -r)
    BACKUP_COUNT=$(echo "$BACKUPS_FOR_DATE" | wc -l)
    
    if [ "$BACKUP_COUNT" -gt "$MAX_BACKUPS_PER_DAY" ]; then
      EXCESS_COUNT=$((BACKUP_COUNT - MAX_BACKUPS_PER_DAY))
      echo -e "${GREEN}  Date ${date}: Keeping ${MAX_BACKUPS_PER_DAY} most recent backups, removing ${EXCESS_COUNT} older ones${NC}"
      
      # Skip the first MAX_BACKUPS_PER_DAY backups and remove the rest
      echo "$BACKUPS_FOR_DATE" | tail -n "$EXCESS_COUNT" | while read BACKUP; do
        echo -e "    ${ORANGE}Removing $BACKUP${NC}"
        rm -rf "$BACKUP"
      done
    else
      echo -e "${GREEN}  Date ${date}: Has $BACKUP_COUNT backups (under limit of $MAX_BACKUPS_PER_DAY)${NC}"
    fi
  done
fi

# ================ Create version directories ================
echo
if confirm "Organize releases into version directories?"; then
  # Get all release versions
  versions=$(find "$RELEASES_DIR" -type f -name "homni-v*.zip" | grep -o "v[0-9]\+\.[0-9]\+\.[0-9]\+" | sort -u)
  
  # Create a directory for each version and move the release file
  for version in $versions; do
    version_dir="$RELEASES_DIR/$version"
    
    # Create version directory if it doesn't exist
    if [ ! -d "$version_dir" ]; then
      echo -e "${GREEN}  Creating directory for $version${NC}"
      mkdir -p "$version_dir"
    fi
    
    # Move the release file to the version directory
    release_file="$RELEASES_DIR/homni-$version.zip"
    if [ -f "$release_file" ]; then
      echo -e "${GREEN}  Moving $release_file to $version_dir/${NC}"
      mv "$release_file" "$version_dir/"
    fi
  done
fi

# ================ Final report ================
CURRENT_DIRS=$(find "$RELEASES_DIR" -type d | wc -l)
CURRENT_FILES=$(find "$RELEASES_DIR" -type f | wc -l)
CURRENT_SIZE=$(du -sh "$RELEASES_DIR" | awk '{print $1}')
CURRENT_BACKUP_DIRS=$(find "$RELEASES_DIR" -type d -name "backup_*" | wc -l)
CURRENT_RELEASE_FILES=$(find "$RELEASES_DIR" -type f -name "homni-*.zip" | wc -l)

echo -e "${BLUE}=====================================================${NC}"
echo -e "${GREEN}Results after cleanup:${NC}"
echo -e "  Total directories: $CURRENT_DIRS (was $TOTAL_DIRS)"
echo -e "  Total files: $CURRENT_FILES (was $TOTAL_FILES)"
echo -e "  Total size: $CURRENT_SIZE (was $TOTAL_SIZE)"
echo -e "  Backup directories: $CURRENT_BACKUP_DIRS (was $BACKUP_DIRS)"
echo -e "  Release files: $CURRENT_RELEASE_FILES (was $RELEASE_FILES)"
echo -e "${BLUE}=====================================================${NC}"

echo -e "${GREEN}Cleanup complete!${NC}"
echo -e "${BLUE}=====================================================${NC}" 