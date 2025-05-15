#!/bin/bash
# Script to clean up the project directory and remove Docker elements

echo "===== CLEANING PROJECT DIRECTORY ====="

# Create a backup directory for removed files
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
REMOVAL_DIR="./BACKUP/removed_files_${TIMESTAMP}"
mkdir -p "${REMOVAL_DIR}"

echo "Removed files will be backed up to: ${REMOVAL_DIR}"

# 1. Remove Docker related files
echo "Removing Docker-related files..."
mv docker-compose.yml "${REMOVAL_DIR}/" 2>/dev/null || true
mv source/Dockerfile "${REMOVAL_DIR}/" 2>/dev/null || true
mv source/.dockerignore "${REMOVAL_DIR}/" 2>/dev/null || true
mv source/nginx.conf "${REMOVAL_DIR}/" 2>/dev/null || true

# 2. Remove rollback scripts
echo "Removing rollback-related files..."
mv ROLLBACK-README.md "${REMOVAL_DIR}/" 2>/dev/null || true
mv ensure-dist.sh "${REMOVAL_DIR}/" 2>/dev/null || true
mv fix-permissions.sh "${REMOVAL_DIR}/" 2>/dev/null || true
mv pre-deploy.sh "${REMOVAL_DIR}/" 2>/dev/null || true
mv rebuild-docker.sh "${REMOVAL_DIR}/" 2>/dev/null || true
mv deploy-homni.sh "${REMOVAL_DIR}/" 2>/dev/null || true

# 3. Check for and organize scripts
echo "Organizing scripts..."
mkdir -p scripts

# Move any remaining scripts to scripts directory
for script in *.sh; do
  if [ -f "$script" ] && [ "$script" != "cleanup.sh" ]; then
    echo "Moving $script to scripts directory"
    mv "$script" scripts/ 2>/dev/null || true
  fi
done

# 4. Clean up temporary files
echo "Cleaning temporary files..."
find . -name "*.tmp" -o -name "*.bak" -o -name ".DS_Store" | xargs rm -f

echo "===== CLEANUP COMPLETE ====="
echo "Your project is now ready for local development only."
echo "All Docker and rollback related files have been moved to: ${REMOVAL_DIR}"
echo "To verify local deployment:"
echo "cd source/dist && python3 -m http.server 8088"
echo "Then visit http://localhost:8088 in your browser" 