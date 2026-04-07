# Homni

Organize and access all your servers and services from one clean dashboard.

**Try it free at [homni.io](https://homni.io)** -- no account required, nothing to install.

<img src="homni.png" alt="Homni dashboard showing dark and light themes" width="800"/>

## Features

- **Instant setup** -- no accounts, no config files, no database
- **Search with autocomplete** -- ghost-text suggestions when results narrow to a single service, with Enter to navigate directly
- **Tab navigation** -- Tab/Shift+Tab through services with a gold highlight border, Enter to open
- **Three themes** -- Cinema (dark/gold), Pachyderm (Evernote-inspired light), and Hunter (purple/pink/blue) with full color customization
- **Import/Export** your configuration as JSON for backup or sharing
- **Keyboard shortcuts** for fast navigation (Alt+A, Alt+I, Alt+E, Alt+P, /, ?, Tab, Escape)
- **Responsive** masonry grid layout

## How It Works

All data is stored in your browser's IndexedDB. Nothing is sent to any server. You can export your full configuration as a JSON file and import it on any device.

## Self-Host

Want to run your own instance? Use Docker:

```bash
docker compose -f config/docker-compose.yml up -d
```

Or build from source:

```bash
npm install
npm run build       # Build to ./dist
npx serve dist      # Serve locally
```

See [docs/SCRIPTS.md](docs/SCRIPTS.md) for full script reference.

## Project Structure

```
src/            Source code (React/TypeScript)
public/         Static assets (CSS, images, headers)
config/         Nginx, Docker Compose configs
scripts/        Server, Docker, backup, and utility scripts
docs/           Documentation
```

## Documentation

- [Product Requirements](docs/PRD.md)
- [UI Design Guide](docs/UI_DESIGN_GUIDE.md)
- [Scripts Reference](docs/SCRIPTS.md)
- [Release Notes](docs/RELEASE_NOTES.md)

## Privacy

All server and service data is stored exclusively on your device using IndexedDB (with localStorage fallback). No data is transmitted externally. Backups are local JSON files you control.

## License

Copyright 2025 James Forwood. All Rights Reserved.
