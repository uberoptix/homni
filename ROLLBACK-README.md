# Homni Dashboard Rollback

## What Happened
The CSS styling for the Homni dashboard was broken in a recent update. This rollback restores a known working version of the application with proper styling.

## What Changed
- Replaced the broken CSS with a working version from backup_20250511_215901
- Modified the Docker configuration to use the rolled back files
- Retained all images and assets from the current deployment
- Simplified the build process to avoid any build-time issues

## How to Deploy

### 1. On the Production Server
```bash
# Pull the latest changes from GitHub
git pull

# Run the rebuild script
./rebuild-docker.sh
```

### 2. Testing the Deployment
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