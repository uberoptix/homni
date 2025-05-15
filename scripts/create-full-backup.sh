#!/bin/bash
# Script to create a full backup of the working Homni project

# Set timestamp for the backup folder
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="./BACKUP/homni_full_backup_${TIMESTAMP}"

echo "===== CREATING FULL HOMNI BACKUP ====="
echo "Backup location: ${BACKUP_DIR}"

# Create backup directory
mkdir -p "${BACKUP_DIR}"

# Copy all project files
echo "Copying project files..."
rsync -av --exclude="node_modules" --exclude=".git" --exclude="BACKUP" \
      --exclude="build" --exclude="dist-backup.tar.gz" \
      ./ "${BACKUP_DIR}/"

# Create a special copy of the working dist directory
echo "Creating special backup of the working dist directory..."
mkdir -p "${BACKUP_DIR}/working_dist"
cp -r ./source/dist/* "${BACKUP_DIR}/working_dist/"

# Create a README file with backup information
cat > "${BACKUP_DIR}/BACKUP-README.md" << EOF
# Homni Full Backup

## Backup Information
- Date: $(date)
- Source: Local deployment running on port 8085
- Contains: Full project including working dist files

## Important Directories
- \`working_dist/\`: The working distribution files that were serving correctly on port 8085
- \`source/\`: Complete source code including Dockerfile and nginx config
- \`docker-compose.yml\`: The Docker Compose configuration

## How to Test This Backup
Run the following command from this backup directory:
\`\`\`bash
cd working_dist && python3 -m http.server 8086
\`\`\`

Then visit http://localhost:8086 in your browser to verify all styling and functionality works.

## How to Restore From This Backup
To restore the project from this backup:

1. Copy the backup to your destination:
\`\`\`bash
rsync -av ${BACKUP_DIR}/ /path/to/destination/
\`\`\`

2. Restore the working dist files:
\`\`\`bash
cp -r working_dist/* source/dist/
\`\`\`

3. Rebuild the Docker container:
\`\`\`bash
./rebuild-docker.sh
\`\`\`
EOF

# Make an archive of the dist directory for portability
echo "Creating portable archive of dist directory..."
cd "${BACKUP_DIR}"
tar -czf dist-backup.tar.gz working_dist/
cd - > /dev/null

echo "===== BACKUP COMPLETE ====="
echo "Full backup created at: ${BACKUP_DIR}"
echo "To test the backup: cd ${BACKUP_DIR}/working_dist && python3 -m http.server 8086"
echo "Then visit http://localhost:8086 in your browser" 