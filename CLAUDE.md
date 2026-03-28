# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Homni is a self-hosted services dashboard — a single-page React/TypeScript app that lets users organize servers and services in a searchable, themed masonry grid. All data is stored client-side in IndexedDB (with localStorage fallback). Nothing is sent to any server.

## Commands

- **Dev server:** `npm run dev` (Vite)
- **Build:** `npm run build` (outputs to `./dist`)
- **Lint:** `npm run lint` (ESLint, flat config)
- **Preview production build:** `npm run preview`
- **Self-host with Docker:** `docker compose -f config/docker-compose.yml up -d`

There are no tests configured.

## Architecture

This is a small, monolithic React app. Nearly all application logic lives in a single file:

- **`src/App.tsx`** (~1900 lines) — the entire application: data models (`Server`, `Service`, `ColorPalette`), IndexedDB persistence layer, state management, all UI components (dialogs, forms, search, settings, import/export), keyboard shortcuts, and theme handling. There is no routing, no state library, no API calls.
- **`src/App.css`** (~1400 lines) — all styling, including responsive breakpoints, CSS variables for theming, and masonry grid layout.
- **`src/components/MasonryGrid.tsx`** — thin wrapper div for CSS-column-based masonry layout.
- **`src/index.css`** — minimal global resets.

### Data Layer

IndexedDB is the primary storage, accessed via raw `IDBDatabase` APIs (no ORM). The database is named `homni` with a single object store `servers_store`. Three keys store all app state: `servers_data`, `color_palette`, and `user_preferences`. There is migration logic from a legacy DB name (`selfhosted_dashboard`).

### Theming

Two built-in palettes (dark default, light) plus full user customization via CSS variables. The `ColorPalette` interface maps to CSS custom properties applied at runtime. See `docs/UI_DESIGN_GUIDE.md` for the complete variable reference and component styling specs.

### Deployment

The site (homni.io) is deployed via **GitHub → Cloudflare Pages**:

1. Push to `main` on `origin` (`github.com/uberoptix/homni`)
2. Cloudflare Pages automatically builds and deploys — no GitHub Actions or wrangler config; the connection is configured in the Cloudflare dashboard
3. Build command: `npm run build`, output directory: `dist`

Cloudflare Pages-specific files in `public/`:
- `_headers` — security headers (CSP, X-Frame-Options, etc.)
- `_redirects` — SPA catch-all (`/* → /index.html 200`)

For self-hosting, `config/` has Docker Compose + Nginx configs (serves on port 808 by default).

Pre-built assets in `web/` are a snapshot of the current live deployment.

## Key Conventions

- All user data stays client-side. Never add server calls, analytics, or external data transmission.
- Use CSS variables (e.g., `var(--font-size-sm)`, `var(--server-background)`) instead of hard-coded values for colors, font sizes, and component heights.
- The UI Design Guide (`docs/UI_DESIGN_GUIDE.md`) is the source of truth for button types, card components, notification styles, and typography scales.
