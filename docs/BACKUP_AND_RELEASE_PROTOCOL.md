# Homni Backup and Release Management Protocol

This document defines the standardized approach for managing backups and releases in the Homni dashboard project.

## Overview

The Homni project follows a structured protocol for:
1. Automatic backup creation during development
2. Regular cleanup of old backups
3. Standardized release creation
4. Organized storage of official releases

## Backup Management

### Backup Creation

Backups are automatically created during development:

1. **Automatic Backups**: Every time `deploy.sh` is run, a new backup is created
2. **Backup Naming**: Backups follow the format `backup_YYYYMMDD_HHMMSS`
3. **Backup Contents**: Each backup contains:
   - `assets/` - Built JavaScript and CSS files
   - `index.html` - Main HTML file
   - `custom.css` - Custom CSS overrides

### Backup Retention

The backup management system automatically:

1. **Daily Cleanup**: Keeps only the 3 most recent backups for each day
2. **Age-Based Cleanup**: Removes backups older than 7 days
3. **On-Demand Cleanup**: Full cleanup can be triggered with `scripts/cleanup-releases.sh`

## Release Management

### Release Creation

Official releases follow a structured creation process:

1. **Version Standards**: Follows semantic versioning (`X.Y.Z`)
2. **Release Command**: Created with `scripts/create-release.sh [optional_name]`
3. **Release Naming**: Files follow the format `homni-vX.Y.Z.zip`
4. **Release Metadata**: Each release includes a metadata file with:
   - Version number
   - Creation date/time
   - Optional release name

### Release Organization

Releases are organized for easy access:

1. **Version Directories**: Each official release is stored in a directory named after its version (e.g., `v0.9.0/`)
2. **Release Artifacts**: The directory contains the release zip file and metadata
3. **Standardized Naming**: All files follow the same naming convention for consistency

## Scripts and Commands

### Backup Scripts

| Script | Description |
|--------|-------------|
| `scripts/deploy.sh` | Creates backups automatically during deployment |
| `scripts/manage-backups.sh` | Handles routine cleanup of old backups |
| `scripts/cleanup-releases.sh` | Interactive tool for thorough cleanup of the releases directory |

### Release Scripts

| Script | Description |
|--------|-------------|
| `scripts/create-release.sh [name]` | Creates a new official release with optional name |
| `scripts/update-version.sh` | Updates version across project files |

## Backup Recovery

To restore from a backup:

1. Stop any running servers: `pkill -f "node.*server.js"`
2. Choose a backup from the `releases/` directory
3. Copy files from the backup: `cp -r releases/backup_TIMESTAMP/* .`
4. Restart the server: `node scripts/server.js`

## Release Deployment

To deploy a specific release:

1. Download or extract the release zip
2. Deploy using the standard deployment process: `./deploy.sh`

## Recommended Practices

1. **Regular Cleanup**: Run `scripts/cleanup-releases.sh` monthly to maintain an organized releases directory
2. **Version Documentation**: Update release notes (`docs/RELEASE_NOTES.md`) with each new version
3. **Backup Before Changes**: Always run `deploy.sh` before making significant changes to ensure a backup exists
4. **Release Tagging**: Create a new release for each significant feature or fix

By following this protocol, the Homni project maintains a clean, organized, and easily recoverable backup and release system. 