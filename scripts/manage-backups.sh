#!/bin/bash

# IMPORTANT: This script manages local backups that may contain personal information.
# These backups should be stored securely and not committed to version control.

echo "⚠️  WARNING: Backups may contain personal server information"
echo "    - Store backups in a secure location"
echo "    - Do not commit backups to version control"
echo "    - Keep backups on your local device only"
echo ""

# Function to create a backup
create_backup() {
    local backup_dir="releases/backups/$(date +%Y%m%d)"
    local backup_file="backup_$(date +%Y%m%d_%H%M%S)"
    
    mkdir -p "$backup_dir"
    
    # Create the backup
    cp -r source/dist/* "$backup_dir/$backup_file/"
    
    echo "✅ Backup created in: $backup_dir/$backup_file"
    echo "   Contains client-side application data only"
}

# Function to clean old backups
clean_old_backups() {
    local days_to_keep=30
    find releases/backups -type d -mtime +$days_to_keep -exec rm -rf {} +
    echo "✅ Removed backups older than $days_to_keep days"
}

# Main menu
echo "Backup Management"
echo "1. Create new backup"
echo "2. Clean old backups"
echo "3. Exit"

read -p "Choose an option: " choice

case $choice in
    1)
        create_backup
        ;;
    2)
        clean_old_backups
        ;;
    3)
        exit 0
        ;;
    *)
        echo "Invalid option"
        exit 1
        ;;
esac 