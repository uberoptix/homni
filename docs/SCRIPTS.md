# Scripts Reference

## Server Management

```bash
# Start server on default port
./scripts/server.sh

# Start server with cache-busting
./scripts/server.sh --cache-busting

# Start server on custom port
./scripts/server.sh --port=8088

# Stop running server
./scripts/server.sh --stop
```

## Docker Management

```bash
# Deploy container
./scripts/docker.sh deploy

# Check status
./scripts/docker.sh status

# Start / Stop / Restart
./scripts/docker.sh start
./scripts/docker.sh stop
./scripts/docker.sh restart

# Build image only
./scripts/docker.sh build

# Custom port
./scripts/docker.sh deploy --port=9090
```

## Backup Management

```bash
# Create full backup
./scripts/backup.sh create

# Create web-only or config-only backup
./scripts/backup.sh create --type=web
./scripts/backup.sh create --type=config

# List all backups
./scripts/backup.sh list

# Restore from latest backup
./scripts/backup.sh restore --type=latest

# Clean up old backups (keep 5 most recent)
./scripts/backup.sh clean --max=5
```

## Utilities

```bash
# Fix file permissions
./scripts/utils.sh fix-permissions

# Update version number
./scripts/utils.sh update-version

# Display project information
./scripts/utils.sh show-info

# Clean up unused assets
./scripts/utils.sh clean-assets
```

All scripts support `--help` for full usage details.
