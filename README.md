# Homni Dashboard

A self-hosted monitoring dashboard for servers and services.

## Features

- Server and service monitoring
- Status indicators (Red/Amber/Green)
- Light and dark theme support with Evernote-inspired light theme and amber-accented dark theme
- Customizable color palettes via UI, with changes applied instantly
- Responsive design
- Smart search prioritizing services over servers
- True CSS-based masonry grid layout for optimal content distribution
- Intelligent server card ordering based on content size
- Client-side data storage (IndexedDB) for enhanced privacy and offline access
- Robust XSS protection (DOMPurify, Content Security Policy) and Nginx security hardening
- Data import/export functionality for backup and migration

## Data Storage & Privacy

Homni stores all your server, service, and theme configuration data directly in your web browser using IndexedDB. This approach offers several advantages:

- **Privacy:** Your data remains on your device and is not sent to any external server.
- **Offline Access:** You can view your dashboard even if you are temporarily offline (once loaded).
- **Performance:** Accessing local data is typically very fast.

You can export your data as a JSON file for backup purposes or to migrate to another browser/device, and import it back when needed.

## Security

Homni incorporates several security measures:

- **Input Sanitization:** User-provided notes for services are sanitized using DOMPurify to prevent Cross-Site Scripting (XSS) attacks.
- **Content Security Policy (CSP):** A strict CSP is implemented via a meta tag in `index.html` to control which resources can be loaded, further mitigating XSS and other injection attacks.
- **Nginx Hardening:** The provided Nginx configuration (for Docker deployment) includes rules to block common malicious requests, such as attempts to access `.php` files or `.git` repositories.
- **Secure Headers:** Standard security headers like `X-Frame-Options` and `X-Content-Type-Options` are configured.

It's recommended to deploy Homni behind a reverse proxy like Nginx Proxy Manager, which can provide additional security layers such as SSL termination, access controls, and web application firewall (WAF) features.

## Local Development & Testing

Homni uses Vite for its build process. The Vite development server is disabled in the configuration (`config/vite.config.ts`) to ensure that local testing closely mirrors the production environment.

To test changes locally, you first need to build the application:

```bash
npm run build
```

Then, you can serve the built assets (from the `web/` directory) using the provided script:

```bash
# Start the local server on default port 8080, serving pre-built assets
./run-local.sh

# Alternatively, use the underlying server script:
# ./scripts/server.sh start [--port=your_port]
```
Then visit `http://localhost:8080` (or your custom port) in your browser. The `run-local.sh` script handles building the application if the `web/` directory is not found.

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

- `/web` - Production web assets built by Vite (served by Nginx).
  - `/web/assets` - Hashed production assets (JS, CSS).
  - `/web/images` - Static images used by the application.
- `/src` - TypeScript and React source code.
  - `/src/components` - Reusable React components (e.g., `MasonryGrid.tsx`).
  - `/src/hooks` - Custom React hooks (e.g., `useThemeManager.ts`).
  - `/src/App.tsx` - Main application component.
  - `/src/main.tsx` - Application entry point.
  - `/src/db.ts` - IndexedDB interaction logic.
- `/config` - Configuration files.
  - `/config/nginx.conf` - Nginx configuration for the Docker container.
  - `/config/docker-compose.yml` - Docker Compose configuration.
  - `/config/vite.config.ts` - Vite build configuration.
  - `/config/tsconfig.json` - Main TypeScript configuration.
  - `/config/tsconfig.node.json` - TypeScript configuration for Node.js context (e.g., Vite config).
  - `/config/tsconfig.app.json` - TypeScript configuration for the application code.
  - `/config/VERSION` - Version information.
- `/scripts` - Utility and management scripts (Bash).
- `Dockerfile` - Defines the Docker image for Homni.
- `docker-deploy.sh` - Script for managing Docker deployments.
- `run-local.sh` - Script for building and serving Homni locally for testing.
- `package.json` - Project dependencies and scripts.

*(Note: Directories like `/releases`, `/BACKUP`, `/docs` might be present for user-specific versioning, backups, or detailed documentation and are not part of the core application structure managed by this repository unless otherwise specified).*

## Utility Scripts

The project includes several utility scripts to help with common tasks:

### Core Scripts

- `scripts/server.sh` - Manages the local development server with options for port selection, cache-busting, and server control
- `scripts/docker.sh` - Handles Docker deployment, container management, and status monitoring
- `scripts/backup.sh` - Provides backup creation, restoration, listing, and cleanup capabilities
- `scripts/utils.sh` - Collection of utility functions for maintenance tasks

### Server Management

The `scripts/server.sh` script is primarily for serving the pre-built static assets from the `web/` directory.

```bash
# Build the application (if not already built)
npm run build

# Start server on default port, serving from web/
./scripts/server.sh start

# Start server on custom port
./scripts/server.sh start --port=8088

# Stop running server
./scripts/server.sh stop

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
