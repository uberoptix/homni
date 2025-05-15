# Homni Release Notes

## 🚀 v0.10.0 - May 2025

## v0.10.0 (May 11, 2025)

- Added real-time ping status monitoring for all services
- Introduced colored status indicators next to service ports (green/amber/red)
- Implemented automatic background service monitoring
- Added status persistence across sessions
- All monitoring performed client-side for maximum privacy

## v0.9.1 (May 11, 2025)

- Standardized spacing throughout the dashboard UI (2rem between major sections)
- Fixed button bar spacing to exactly 2rem above and below
- Improved footer spacing consistency
- Enhanced responsive layout spacing on mobile devices
- Fixed CSS specificity issues for better style consistency

## 🚀 v0.9.1 - May 2025

### Masonry Layout 2.0
- Implemented true CSS-based masonry layout for server cards
- Optimized card distribution algorithm to sort servers by number of services
- Reduced default column count from 4 to 3 for better space utilization
- Enhanced responsive breakpoints for consistent layout across screen sizes
- Eliminated alphabetical ordering constraint to improve column balancing

### UI Enhancements
- Improved search bar styling with cleaner look and accent-text focused state
- Removed inactive border for a more modern appearance
- Maintained consistent styling across all UI elements

### Technical Improvements
- Eliminated reliance on external masonry libraries for better performance
- Improved server card distribution for better visual balance
- Created a smarter sorting algorithm that adapts based on search context

## 🚀 v0.8.0 - August 2025

### UI Layout Enhancement
- Implemented Masonry.js for a dynamic, Pinterest-style server card layout
- Improved visual appearance of server cards with varying content lengths
- Eliminated awkward spacing and gaps between server cards
- Enhanced responsive layout across different screen sizes
- Created seamless transitions when adding or removing content

### Technical Improvements
- Added TypeScript integration with Masonry.js library
- Created reusable MasonryGrid component for future expandability
- Optimized CSS for better performance with the new layout system
- Improved DOM handling for dynamic content changes

## 🚀 v0.7.1 - July 2025

### UI Polish & Accessibility
- Optimized keyboard shortcuts section with improved styling
- Made keyboard shortcut descriptions match server notes styling
- Refined keyboard shortcut key display with better contrast and improved text
- Adjusted container sizing to better fit text content
- Improved overall responsiveness of keyboard shortcut elements

## 🚀 v0.7.0 - July 2025

### Theme System
- Added Dark and Light themes with visual theme selectors
- Implemented Evernote-inspired Light theme with green accents
- Added theme previews and instant theme switching
- Maintained ability to customize individual colors after selecting a theme

### UI Improvements
- Added visual theme selectors to the color customization panel
- Improved dialog text and reduced vertical spacing
- Enhanced user experience with more intuitive theming options

## 🚀 v0.6.0 - June 2025

### Enhanced Deployment Process
- Improved asset management with automatic detection of latest build files
- Added comprehensive verification steps for asset deployment
- Fixed issues with production environment not showing service editing features
- Improved index.html references to always use the latest JS and CSS files
- Added automatic cleanup of older asset files during deployment
- Updated CSS path handling for config icons in production

### Service Notes Visibility
- Fixed service notes support across all environments
- Added fix-notes-visibility.sh diagnostic script

### Documentation Updates
- Added troubleshooting section to README
- Updated scripts reference with new tools
- Updated PRD to document service editing feature
- Improved deployment workflow documentation

## 🚀 v0.5.0 - May 2025

### Service Management Improvements
- Added service editing with config icons for each service
- Redesigned service management interface with consistent styling
- Added optional notes field to services for better documentation
- Enhanced service configuration workflow with improved editing dialog
- Removed delete (x) button from services in favor of config dialog

### UI Refinements
- Improved button sizing and spacing for better visual hierarchy
- Config icon styling with secondary-text color and accent-text on hover
- Increased size of "Add Service" button to match "Add Server" button
- Refined UI elements for consistent appearance and better usability

## 🚀 v0.4.0 - April 2025

### Asset Management
- Improved asset management system with centralized image organization
- Added images/source_files directory for raw image files and design templates
- Enhanced deployment script to prevent image duplication in root directory
- Added automatic cleanup of older JavaScript files during deployment

### Project Structure
- Renamed clean-css.sh to clean-assets.sh with expanded functionality
- Improved organization of project directory structure
- Updated README with comprehensive documentation on project structure and scripts

## 🚀 v0.3.0 - March 2025

### User Experience Improvements
- Added new keyboard shortcuts for improved usability
- Implemented custom color palette functionality with real-time preview
- Enhanced import/export capabilities for data backup
- Improved responsive design for mobile and tablet devices

### Technical Improvements
- Added support for offline-first operation with robust IndexedDB storage
- Implemented fallback storage mechanisms for improved reliability

## 🚀 v0.2.0 - February 2025

### Infrastructure Updates
- Migrated from Vite dev server to custom Node.js production server
- Restructured project with separate development and production environments
- Implemented deployment workflow with automated build process
- Added scripts directory with utility scripts for deployment and maintenance
- Improved CSS structure with custom styling

## 🚀 v0.1.0 - January 2025 (Initial Release)

### Core Features
- Basic dashboard functionality for managing self-hosted services
- Add and organize servers and services
- Quick access to services with direct links
- Search functionality to filter servers and services
- Dark theme with orange accents inspired by Plex

### Known Limitations
- Offline use only (no remote synchronization)
- No user accounts or multi-user support
- No automatic discovery of services

### Technical Details
- Built with React and TypeScript
- CSS styling without external frameworks
- Uses the Vite build system 