# Homni Dashboard Rollback

## What Happened
The CSS styling for the Homni dashboard was broken in a recent update. This rollback restores a known working version of the application with proper styling.

## What Changed
- Replaced the broken CSS with a working version from backup_20250511_215901
- Modified the Docker configuration to use the rolled back files
- Retained all images and assets from the current deployment
- Simplified the build process to avoid any build-time issues

## How to Deploy

### 1. From Local Environment
```bash
# Make sure the dist directory is included in git
./ensure-dist.sh

# Commit and push the changes
git add .
git commit -m "Rollback to working version with fixed styling"
git push
```

### 2. On the Production Server
```bash
# Pull the latest changes from GitHub
git pull

# Run the rebuild script
./rebuild-docker.sh
```

### 3. If Deployment Fails with "dist not found" Error
If you encounter an error like "failed to calculate checksum: /dist not found", do the following:

```bash
# 1. On your local machine, copy the dist directory contents
tar -czf dist-backup.tar.gz source/dist

# 2. Transfer the archive to the server
scp dist-backup.tar.gz user@server:/path/to/homni/

# 3. On the server, extract the archive
cd /path/to/homni
tar -xzf dist-backup.tar.gz

# 4. Then rebuild
./rebuild-docker.sh
```

### 4. Testing the Deployment
After deployment, verify that:
- The application is accessible at the correct URL (http://hostname:808)
- All styling is correct (server cards, buttons, layout)
- All functionality works as expected

## Reverting the Rollback (If Needed)
A backup of the previous deployment is stored in `./recovery-backup/`. 
If you need to revert to the previous version:

```bash
# Stop the current containers
docker compose down

# Restore the backup
rm -rf ./source/dist
cp -r ./recovery-backup/* ./source/dist

# Rebuild and restart
docker compose up -d --build
``` 