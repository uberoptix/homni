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

This is a simplified local development version of the Homni dashboard. All Docker and production deployment elements have been removed for clarity and simplicity.

### Running the Application Locally

```bash
# Start the server on default port 8080
./scripts/serve-local.sh

# Or specify a custom port
./scripts/serve-local.sh 8088
```

Then visit http://localhost:8080 in your browser (or the custom port you specified).

### Docker Deployment

You can also run Homni in a Docker container:

```bash
# Deploy with Docker
./scripts/deploy-docker.sh
```

This will build and start a Docker container serving Homni at http://localhost:8088.

#### Managing the Docker Container

Use the management script for common Docker operations:

```bash
# Show available commands
./scripts/manage-docker.sh

# Start the container
./scripts/manage-docker.sh start

# Stop the container
./scripts/manage-docker.sh stop

# View container logs
./scripts/manage-docker.sh logs

# Check container status
./scripts/manage-docker.sh status

# Rebuild the container
./scripts/manage-docker.sh rebuild
```

### Creating Backups

To create a backup of the working version:

```bash
./scripts/backup-working.sh
```

This will create a timestamped backup in the `releases/backup_[timestamp]` directory.

### Testing a Backup

To test a specific backup:

```bash
cd releases/backup_[timestamp]
python3 -m http.server 8085
```

Then visit http://localhost:8085 in your browser.

## Development Workflow

We use a production-focused workflow for all development. We've deliberately simplified to a single production-only workflow with no separate development server.

```bash
# From the Homni root directory
./deploy.sh
```

This script will:
- Kill any running server instances
- Ensure dependencies are up-to-date
- Build the source files
- Create a backup of the current production files
- Copy the build files to the production directory
- Start the server at http://localhost:8080/

### Why We Use This Approach

The dual development/production environment was causing synchronization issues, particularly with:
- Search logic implementation
- Style consistency 
- HMR updates not being properly applied
- Caching issues resulting in inconsistent UI updates

By focusing on a single production-ready workflow, we ensure:
- What you see is exactly what gets deployed
- No confusion about which environment is "correct"
- Streamlined testing and verification process
- Elimination of caching and hot-reload inconsistencies

### When Making Changes

1. Edit files in the `/source` directory 
2. Run `./deploy.sh` to see your changes at http://localhost:8080
3. Test thoroughly in the production environment
4. When finished, press Ctrl+C to stop the server 

**Important:** Do NOT run `npm run dev` to start a development server. Always use `./deploy.sh` for all development activities.

## Production Deployment

For production deployment:

```bash
# From the Homni root directory
./deploy.sh
```

The script automatically creates backups of previous deployments in the `releases` directory.

## Building and Running Manually

If you need to perform steps individually:

```bash
# Install dependencies
cd source
npm ci || npm install

# Build for production
npm run build

# Copy files to production directory
cd ..
cp -r source/dist/* .

# Start the server
node scripts/server.js
```

## Project Structure

- `/source` - Source code directory
  - `/source/src` - React application code
  - `/source/public` - Static assets for development
    - `/source/public/images` - Images used by the application
  - `/source/dist` - Contains the compiled application files
- `/assets` - Production assets
- `/images` - Production images directory
- `/scripts` - Server and utility scripts
- `/releases` - Historical releases and backups
- `/BACKUP` - Full project backups and removed components
- `/docs` - Documentation and version information
- `/custom.css` - Global CSS overrides for production

## Utility Scripts

The project includes several utility scripts in the `/scripts` directory to help with common tasks:

### Core Scripts

- `deploy.sh` - Main deployment script that builds the application, creates backups, and starts the server
- `server.js` - Simple HTTP server for serving the application
- `start.command` - macOS-friendly script to start the server (can be double-clicked)
- `stop.command` - macOS-friendly script to stop the server (can be double-clicked)
- `serve-local.sh` - Starts a Python HTTP server for local development
- `backup-working.sh` - Creates backups of the working version

### Installation and Updates

- `install.sh` - Sets up the project by installing dependencies and initializing directories
- `update-version.sh` - Updates version information across the project and creates release note templates
- `create-release.sh` - Creates a zip file of the release for distribution

### Maintenance and Fixes

- `clean-assets.sh` - Cleans up old CSS and JS files in the assets directory
- `fix-notes-visibility.sh` - Diagnostic script for fixing issues with service notes visibility
- `fix-image-paths.sh` - Corrects image paths in CSS and HTML files to ensure proper referencing
- `cleanup.sh` - Script to clean up the project directory and remove unnecessary files

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