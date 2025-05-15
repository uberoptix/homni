#!/bin/bash
# Consolidated backup script for Homni
# Handles creating, restoring, and managing backups

COMMAND="create"
BACKUP_TYPE="full"
MAX_BACKUPS=5
BACKUP_DIR="BACKUP"

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    create|restore|list|clean)
      COMMAND="$1"
      shift
      ;;
    --type=*)
      BACKUP_TYPE="${1#*=}"
      shift
      ;;
    --max=*)
      MAX_BACKUPS="${1#*=}"
      shift
      ;;
    --dir=*)
      BACKUP_DIR="${1#*=}"
      shift
      ;;
    --help)
      echo "Usage: $0 [command] [options]"
      echo "Commands:"
      echo "  create      Create a backup (default)"
      echo "  restore     Restore from a backup"
      echo "  list        List available backups"
      echo "  clean       Clean up old backups"
      echo "Options:"
      echo "  --type=TYPE   Backup type: full, web, or config (default: full)"
      echo "  --max=NUMBER  Maximum number of backups to keep (default: 5)"
      echo "  --dir=PATH    Backup directory (default: BACKUP)"
      echo "  --help        Show this help message"
      exit 0
      ;;
    *)
      shift
      ;;
  esac
done

# Navigate to the project root directory
cd "$(dirname "$0")/.." || exit 1
PROJECT_ROOT=$(pwd)
echo "Working from project root: $PROJECT_ROOT"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Generate timestamp for backup
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_NAME="homni_${BACKUP_TYPE}_backup_${TIMESTAMP}"
BACKUP_PATH="$BACKUP_DIR/$BACKUP_NAME"

# Function to create a backup
create_backup() {
  echo "===== CREATING HOMNI $BACKUP_TYPE BACKUP ====="
  
  mkdir -p "$BACKUP_PATH"
  
  case $BACKUP_TYPE in
    "full")
      echo "Creating full backup..."
      # Back up web assets
      mkdir -p "$BACKUP_PATH/web"
      cp -r web/* "$BACKUP_PATH/web/" 2>/dev/null || true
      
      # Back up configuration
      mkdir -p "$BACKUP_PATH/config"
      cp -r config/* "$BACKUP_PATH/config/" 2>/dev/null || true
      
      # Back up source files
      mkdir -p "$BACKUP_PATH/src"
      cp -r src/* "$BACKUP_PATH/src/" 2>/dev/null || true
      
      # Back up root files
      cp Dockerfile "$BACKUP_PATH/" 2>/dev/null || true
      cp package.json "$BACKUP_PATH/" 2>/dev/null || true
      cp package-lock.json "$BACKUP_PATH/" 2>/dev/null || true
      cp run-local.sh "$BACKUP_PATH/" 2>/dev/null || true
      ;;
      
    "web")
      echo "Creating web-only backup..."
      mkdir -p "$BACKUP_PATH/web"
      cp -r web/* "$BACKUP_PATH/web/" 2>/dev/null || true
      ;;
      
    "config")
      echo "Creating configuration backup..."
      mkdir -p "$BACKUP_PATH/config"
      cp -r config/* "$BACKUP_PATH/config/" 2>/dev/null || true
      ;;
      
    *)
      echo "ERROR: Unknown backup type: $BACKUP_TYPE"
      echo "Valid types are: full, web, config"
      exit 1
      ;;
  esac
  
  echo "Backup created at: $BACKUP_PATH"
  
  # Clean up old backups if needed
  clean_backups
}

# Function to restore from a backup
restore_backup() {
  if [ "$BACKUP_TYPE" == "latest" ]; then
    # Find latest backup
    LATEST_BACKUP=$(find "$BACKUP_DIR" -name "homni_*_backup_*" -type d | sort | tail -1)
    
    if [ -z "$LATEST_BACKUP" ]; then
      echo "No backups found to restore."
      exit 1
    fi
    
    BACKUP_PATH="$LATEST_BACKUP"
  elif [ ! -d "$BACKUP_PATH" ]; then
    # If specific backup doesn't exist, show available backups
    echo "Backup not found: $BACKUP_PATH"
    list_backups
    exit 1
  fi
  
  echo "===== RESTORING FROM BACKUP: $BACKUP_PATH ====="
  
  # Determine backup type from directory structure
  if [ -d "$BACKUP_PATH/web" ]; then
    echo "Restoring web assets..."
    cp -r "$BACKUP_PATH/web/"* web/ 2>/dev/null || true
  fi
  
  if [ -d "$BACKUP_PATH/config" ]; then
    echo "Restoring configuration files..."
    cp -r "$BACKUP_PATH/config/"* config/ 2>/dev/null || true
  fi
  
  if [ -d "$BACKUP_PATH/src" ]; then
    echo "Restoring source files..."
    cp -r "$BACKUP_PATH/src/"* src/ 2>/dev/null || true
  fi
  
  # Restore root files if they exist in the backup
  if [ -f "$BACKUP_PATH/Dockerfile" ]; then
    cp "$BACKUP_PATH/Dockerfile" . 2>/dev/null || true
  fi
  
  if [ -f "$BACKUP_PATH/package.json" ]; then
    cp "$BACKUP_PATH/package.json" . 2>/dev/null || true
  fi
  
  if [ -f "$BACKUP_PATH/package-lock.json" ]; then
    cp "$BACKUP_PATH/package-lock.json" . 2>/dev/null || true
  fi
  
  if [ -f "$BACKUP_PATH/run-local.sh" ]; then
    cp "$BACKUP_PATH/run-local.sh" . 2>/dev/null || true
    chmod +x run-local.sh 2>/dev/null || true
  fi
  
  echo "Restore completed from: $BACKUP_PATH"
}

# Function to list available backups
list_backups() {
  echo "===== AVAILABLE HOMNI BACKUPS ====="
  
  # Find all backup directories
  BACKUPS=$(find "$BACKUP_DIR" -name "homni_*_backup_*" -type d | sort)
  
  if [ -z "$BACKUPS" ]; then
    echo "No backups found."
    return
  fi
  
  echo "Backup directory: $BACKUP_DIR"
  echo
  echo "Available backups:"
  echo "-----------------"
  
  # Display each backup with its type and date
  while IFS= read -r backup; do
    # Extract backup type and date from directory name
    BNAME=$(basename "$backup")
    BTYPE=$(echo "$BNAME" | grep -o "homni_.*_backup" | sed 's/homni_//;s/_backup//')
    BDATE=$(echo "$BNAME" | grep -o "[0-9]\{8\}_[0-9]\{6\}")
    BDATE_FORMATTED=$(date -r "$backup" "+%Y-%m-%d %H:%M:%S")
    
    # Determine backup size
    BSIZE=$(du -sh "$backup" | cut -f1)
    
    echo "[$BDATE_FORMATTED] $BTYPE ($BSIZE): $BNAME"
  done <<< "$BACKUPS"
}

# Function to clean up old backups
clean_backups() {
  echo "Cleaning up old backups (keeping $MAX_BACKUPS)..."
  
  # Count the backups of the specified type
  BACKUPS=$(find "$BACKUP_DIR" -name "homni_${BACKUP_TYPE}_backup_*" -type d | sort)
  BACKUPS_COUNT=$(echo "$BACKUPS" | grep -c .)
  
  # If we're over the limit, delete the oldest
  if [ "$BACKUPS_COUNT" -gt "$MAX_BACKUPS" ]; then
    # Calculate how many to delete
    TO_DELETE=$((BACKUPS_COUNT - MAX_BACKUPS))
    
    # Find the oldest backups and delete them
    OLDEST_BACKUPS=$(find "$BACKUP_DIR" -name "homni_${BACKUP_TYPE}_backup_*" -type d | sort | head -n "$TO_DELETE")
    
    while IFS= read -r backup; do
      echo "Removing old backup: $(basename "$backup")"
      rm -rf "$backup"
    done <<< "$OLDEST_BACKUPS"
    
    echo "Removed $TO_DELETE old backups."
  else
    echo "No cleanup needed. Current backups: $BACKUPS_COUNT, Maximum: $MAX_BACKUPS"
  fi
}

# Execute the requested command
case $COMMAND in
  "create")
    create_backup
    ;;
  "restore")
    restore_backup
    ;;
  "list")
    list_backups
    ;;
  "clean")
    clean_backups
    ;;
  *)
    echo "Unknown command: $COMMAND"
    echo "Use --help for usage information."
    exit 1
    ;;
esac 