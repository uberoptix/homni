# Homni Dashboard

A self-hosted monitoring dashboard for servers and services.

## Features

- Server and service monitoring
- Status indicators (Red/Amber/Green)
- Light and dark theme support with Evernote-inspired light theme and amber-accented dark theme
- Customizable color palette
- Responsive design
- Smart search prioritizing services over servers
- True CSS-based masonry grid layout for optimal content distribution
- Intelligent server card ordering based on content size

## Local Development

This is a simplified local development version of the Homni dashboard.

### Running the Application Locally

```bash
# Start the server on default port 8080
./run-local.sh

# With cache-busting enabled
./scripts/server.sh --cache-busting

# Or specify a custom port
./scripts/server.sh --port=8088
```

Then visit http://localhost:8080 in your browser (or the custom port you specified).

### Docker Deployment

You can run Homni in a Docker container:

```bash
# Deploy with Docker
./docker-deploy.sh deploy

# Or use the script directly
./scripts/docker.sh deploy
```

This will build and start a Docker container serving Homni at http://localhost:8088.

#### Managing the Docker Container

```bash
# Show container status
./scripts/docker.sh status

# Start the container
./scripts/docker.sh start

# Stop the container
./scripts/docker.sh stop

# Restart the container
./scripts/docker.sh restart
```

### Managing Backups

```bash
# Create a full backup
./scripts/backup.sh create --type=full

# Create a web-only backup
./scripts/backup.sh create --type=web

# List all available backups
./scripts/backup.sh list

# Restore from latest backup
./scripts/backup.sh restore --type=latest

# Clean up old backups (keep the 5 most recent)
./scripts/backup.sh clean --max=5
```

## Project Structure

- `/web` - Production web assets
  - `/web/assets` - Production assets (JS, CSS)
  - `/web/images` - Images used by the application
- `/src` - Source code directory
  - `/src/components` - React components
- `/config` - Configuration files
  - `/config/nginx.conf` - Nginx configuration
  - `/config/docker-compose.yml` - Docker Compose configuration
  - `/config/tsconfig.json` - TypeScript configuration
- `/scripts` - Server and utility scripts
- `/releases` - Historical releases and backups
- `/BACKUP` - Full project backups and removed components
- `/docs` - Documentation and version information

## Utility Scripts

The project includes several utility scripts to help with common tasks:

### Core Scripts

- `scripts/server.sh` - Manages the local development server with options for port selection, cache-busting, and server control
- `scripts/docker.sh` - Handles Docker deployment, container management, and status monitoring
- `scripts/backup.sh` - Provides backup creation, restoration, listing, and cleanup capabilities
- `scripts/utils.sh` - Collection of utility functions for maintenance tasks

### Server Management

```bash
# Start server on default port
./scripts/server.sh

# Start server with cache-busting
./scripts/server.sh --cache-busting

# Start server on custom port
./scripts/server.sh --port=8088

# Stop running server
./scripts/server.sh --stop

# Show help message
./scripts/server.sh --help
```

### Docker Management

```bash
# Deploy container
./scripts/docker.sh deploy

# Check status
./scripts/docker.sh status

# Start container
./scripts/docker.sh start

# Stop container
./scripts/docker.sh stop

# Restart container
./scripts/docker.sh restart

# Build image only
./scripts/docker.sh build

# Show help message
./scripts/docker.sh --help
```

### Backup Management

```bash
# Create full backup
./scripts/backup.sh create

# Create web-only backup
./scripts/backup.sh create --type=web

# Create config-only backup
./scripts/backup.sh create --type=config

# List all backups
./scripts/backup.sh list

# Restore from latest backup
./scripts/backup.sh restore --type=latest

# Clean up old backups
./scripts/backup.sh clean

# Show help message
./scripts/backup.sh --help
```

### Utilities

```bash
# Fix file permissions
./scripts/utils.sh fix-permissions

# Fix image paths
./scripts/utils.sh fix-paths

# Update version number
./scripts/utils.sh update-version

# Display project information
./scripts/utils.sh show-info

# Clean up unused assets
./scripts/utils.sh clean-assets

# Show help message
./scripts/utils.sh --help
```

## Documentation

- The Product Requirements Document (PRD) in docs/PRD.md contains comprehensive documentation about all features, including the search system and theme specifications.
- [Masonry Implementation](docs/MASONRY_IMPLEMENTATION_COMBINED.md) - Comprehensive guide to the masonry layout implementation
- [UI Design Guide](docs/UI_DESIGN_GUIDE_COMBINED.md) - Comprehensive guide for UI styling conventions including buttons, cards, and notifications
- [Release Notes](docs/RELEASE_NOTES.md) - Details of changes in each release
- [Backup and Release Protocol](docs/BACKUP_AND_RELEASE_PROTOCOL.md) - Documentation of backup and release management standards

## License

Copyright © 2024 

## Data Privacy and Storage

This application is designed with privacy in mind:

- All server and service information is stored **exclusively** on your local device using:
  - IndexedDB (primary storage)
  - localStorage (fallback storage)
- No data is transmitted to external servers
- No personal information or server details are included in the codebase
- Backups are stored locally in your chosen backup directory

### Data Storage Details

The following information is stored locally:
- Server names and hostnames
- Service configurations
- UI preferences and theme settings
- Notes and visibility states

To completely remove all stored data:
1. Clear your browser's IndexedDB storage for this application
2. Clear your browser's localStorage for this application
3. Delete any local backups you've created

## Project Structure Update

The Homni project structure has been completely simplified:

### New Structure
* `/public` - Contains all web assets (HTML, CSS, JS, images)
* `/src` - Contains source code (if needed for rebuilding)
* `/` - Root contains configuration files and scripts

### Quick Start
* Local Development: `./run-local.sh`
* Docker Deployment: `./docker-deploy.sh`

This new structure eliminates duplication and simplifies both development and deployment.
