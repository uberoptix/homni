# Homni v1.0.0 Product Requirements Document (PRD)

## 1. Product Overview

Homni is a web-based dashboard application designed to help users manage and access their self-hosted services across multiple servers. The application provides a clean, intuitive interface with a dark theme inspired by Plex, offering users a centralized location to organize and access all their services.

## 2. Target Users

- Self-hosting enthusiasts
- System administrators
- Home lab users
- Anyone managing multiple servers or services

## 3. Core Features

### 3.1 Server Management
3.1.1 Add Servers. Users can add servers with a name and hostname.
3.1.2 Delete Servers. Users can remove servers from the dashboard.
3.1.3 Server Organization. Servers are displayed in a responsive grid layout.
3.1.4 Edit Servers. A config icon (config.png) appears next to the server IP address, allowing users to modify server details after creation. The icon is subtle but recognizable, maintaining the clean UI aesthetic.
3.1.5 Server Notes. Each server has a notes section (multi-line text field) where users can add custom information such as location, maintenance windows, or other important details. This information is accessible during both creation and modification of a server.

### 3.2 Service Management
3.2.1 Add Services. Users can add services to each server with name, port, and optional path.
3.2.2 Delete Services. Users can remove services from a server.
3.2.3 Service Navigation. Direct links to access services via HTTP/HTTPS.
3.2.4 Service Sorting. Users can sort services by name or port.
3.2.5 Edit Services. A config icon (config.png) appears next to each service, allowing users to modify service details. The icon matches the server edit icon in styling, using the secondary-text color that changes to accent-text on hover.
3.2.6 Service Notes. Each service has a notes field where users can add custom information, documentation, or configuration details. These notes are not visible on the dashboard but are available when editing the service.
3.2.7 Service Status Indicator. A small circular indicator next to each service's port number displays the current ping status:
   - Green: Service successfully responded to the last ping test
   - Amber: Service failed to respond to the last ping test
   - Red: Service failed to respond to two or more consecutive ping tests
   - The indicator uses the status colors defined in the theme (--status-green, --status-amber, --status-red)

### 3.3 Search Functionality
3.3.1 Global Search. Users can search across all servers and services.
3.3.2 Real-time Filtering. Results update as the user types.
3.3.3 Clear Search. One-click option to clear search results.
3.3.4 Search Status. Visual feedback shows search results status.
3.3.5 Search Priority Logic. The search system follows a clear priority order to provide the most relevant results:
   - Service Name Priority: When users search for a term, the system first tries to find services that match that term
   - If services are found, only servers hosting those matching services are displayed
   - Within those servers, only the services matching the search term are shown
   - Server Name Fallback: If no services match the search term, the system falls back to searching server names
   - If a server name matches, that server is shown with all of its services
3.3.6 Search Behavior Examples:
   - When searching for a service (e.g., "plex"), all servers that host a service containing "plex" will be shown with only the matching service displayed
   - When searching for a server (assuming no service contains the term), the matching server will be shown with all its services
   - In conflicts where both a service and server share a name, service search takes priority
3.3.7 Future Search Enhancements. Potential for implementing advanced search with operators:
   - `service:plex` - Search specifically for services named "plex"
   - `server:plexpi` - Search specifically for servers named "plexpi"
   - `port:32400` - Search for services on a specific port

### 3.4 Data Management
3.4.1 Persistent Storage. Data is stored locally using IndexedDB.
3.4.2 Fallback Storage. Supports localStorage and sessionStorage as fallbacks.
3.4.3 Import/Export. Users can backup and restore their dashboard data via JSON files.
3.4.4 Storage Status. Notifications inform users about the current storage method.
3.4.5 Notes Storage. Server and service notes are stored as part of their respective objects in the database and included in exports.
3.4.6 User Preferences. Service sorting selection (by name or port) is retained across sessions and included in exports.

### 3.5 Customization
3.5.1 Theme Selection. Users can choose between pre-defined Dark and Light themes, each represented by a visual preview button.
3.5.2 Dark Theme. The default dark theme uses Plex-inspired colors with orange accents.
3.5.3 Light Theme. An alternate light theme using Evernote-inspired colors with green accents.
3.5.4 Custom Colors. Users can customize individual colors after selecting a base theme.
3.5.5 Color Palette. Complete control over all color elements in the application.
3.5.6 Theme Controls. Detailed color controls for all UI elements with direct hex value editing.
3.5.7 Color Preview. Live preview of color changes before saving.
3.5.8 Reset to Defaults. Option to revert to the default color palette.
3.5.9 Default Dark Theme Colors:
   - Header Background: #171717
   - Page Background: #1B1B1B
   - Server Background: #252525
   - Service Background: #333333
   - Primary Text: #e0e0e0
   - Accent Text: #DBA33A
   - Accent Text Hover: #ECBA58 (Lighter version of Accent Text)
   - Secondary Text: #a0a0a0
   - Button Color: #CC7B18
   - Status Colors:
     - Red: #ED6B5E
     - Amber: #F5BF4F
     - Green: #61C554
3.5.10 Light Theme Colors:
   - Header Background: #3b4446 (Evernote Cape Cod)
   - Page Background: #eff2f3 (Evernote Porcelain)
   - Server Background: #d7dcdd (Evernote Iron)
   - Service Background: #aeb6b8 (Evernote Hit Gray)
   - Primary Text: #3b4446 (Evernote Cape Cod)
   - Accent Text: #2dbe60 (Evernote Green)
   - Secondary Text: #7b868a (Evernote Rolling Stone)
   - Button Color: #2dbe60 (Evernote Green)
   - Status Colors: Same as Dark theme

### 3.6 Keyboard Shortcuts
3.6.1 Add Server. Alt + A.
3.6.2 Import Data. Alt + I.
3.6.3 Export Data. Alt + E.
3.6.4 Customize Color Palette. Alt + P.
3.6.5 Focus Search. / or Alt + S.
3.6.6 Clear Search / Close Dialog. Esc.
3.6.7 Submit Form or Navigate Forms. Enter.
3.6.8 Navigate Between Fields. Tab.

### 3.7 UI/UX Features
3.7.1 Responsive Design. Works on devices of all sizes (desktop, tablet, mobile).
3.7.2 Intuitive Layout. Clean, organized interface with visual hierarchy.
3.7.3 Notifications. Transient notifications for user actions.
3.7.4 Welcome Screen. Information and guidance for new users.
3.7.5 Keyboard Navigation. Full keyboard accessibility.

## 4. Technical Implementation

### 4.1 Frontend Architecture
4.1.1 Framework. React with TypeScript.
4.1.2 Styling. Custom CSS with CSS variables for theming.
4.1.3 State Management. React Hooks (useState, useEffect).
4.1.4 Build System. Vite.

### 4.2 Data Storage
4.2.1 IndexedDB. Primary storage for servers, services, and settings.
4.2.2 localStorage. Fallback storage if IndexedDB is unavailable.
4.2.3 sessionStorage. Secondary fallback storage.

### 4.3 Deployment
4.3.1 Static Hosting. HTML/CSS/JS files can be served from any web server.
4.3.2 Local Server. Includes a simple Node.js server for local hosting.
4.3.3 Offline Support. Application functions without an internet connection.
4.3.4 Asset Management. Deployment process ensures proper handling of JavaScript, CSS, and image assets.
4.3.5 Environment Consistency. Development and production environments maintain feature parity through robust deployment processes.

## 5. User Workflows

### 5.1 Adding a Server
1. User clicks "Add Server" button or uses Alt+A shortcut
2. Dialog appears with fields for server name and hostname
3. User enters information and submits
4. Server card is added to the dashboard

### 5.2 Adding a Service
1. User clicks "Add Service" button on a server card
2. Dialog appears with fields for service name, port, and optional path
3. User enters information and submits
4. Service item is added to the server card

### 5.3 Accessing a Service
1. User clicks on a service item
2. Browser opens the service URL in a new tab
3. URL is constructed from server hostname, service port, and optional path

### 5.4 Searching for Services
1. User clicks on search field or uses / or Alt+S shortcut
2. User types search query
3. Dashboard filters to show only matching servers and services
4. User clicks on result or clears search

### 5.5 Customizing Colors
1. User accesses color palette dialog (Alt+P)
2. User selects either Dark Theme or Light Theme from the visual theme selectors
3. Theme is applied immediately, showing a preview of all colors
4. User can further adjust individual colors using color pickers with live preview
5. User saves changes, resets to defaults, or cancels
6. If saved, new color scheme is applied immediately

### 5.6 Data Backup and Restore
1. User exports data via Export button or Alt+E
2. JSON file is downloaded with all dashboard data (servers, services, color palette, and user preferences)
3. User can later import this file via Import button or Alt+I
4. Dashboard is restored from the backup file, including all servers, services, color preferences, and user preferences like sort selection

### 5.7 Editing Server Information
1. User clicks the config icon (config.png) next to the server IP address
2. A dialog appears with the server's current details pre-populated
3. User can modify server name, hostname, and notes
4. User saves changes or cancels
5. If saved, server information is updated immediately

### 5.8 Editing Service Information
1. User clicks the config icon (config.png) next to the service
2. A dialog appears with the service's current details pre-populated
3. User can modify service name, port, path, and notes
4. User saves changes or cancels
5. If saved, service information is updated immediately

## 6. Non-Functional Requirements

### 6.1 Performance
6.1.1 Loading Speed. Application should load quickly (<2 seconds).
6.1.2 UI Responsiveness. UI interactions should be responsive (< 100ms).
6.1.3 Scaling. Should handle at least 50 servers with 20 services each.

### 6.2 Compatibility
6.2.1 Browser Support. Works in all modern browsers (Chrome, Firefox, Safari, Edge).
6.2.2 Device Support. Responsive design works on desktop, tablet, and mobile devices.
6.2.3 Theme Support. Supports both light and dark mode system preferences.

### 6.3 Accessibility
6.3.1 Keyboard Navigation. Keyboard navigation throughout the application.
6.3.2 HTML Structure. Semantic HTML structure.
6.3.3 Color Contrast. Meets WCAG standards.
6.3.4 Screen Reader Support. Screen reader friendly.

### 6.4 Security
6.4.1 Local Storage. All data stored locally (no server communication).
6.4.2 Data Privacy. No sensitive information transmitted.

### 6.5 Offline Functionality
6.5.1 Offline Operation. Application functions without internet connectivity.
6.5.2 Data Persistence. Data persistence across browser sessions.

## 7. Future Enhancements

### 7.1 Potential Features for Future Versions
7.1.1 Service Status Monitoring. Comprehensive service monitoring with the following capabilities:
   - Backend:
     - Pinging service that operates within the web application
     - Privacy-first approach with no external calls or APIs
     - Ping each service upon page load and at a set frequency (default: 300 seconds)
     - Save current status to the service record for persistence across page refreshes
     - Status categories:
       - Unknown: No status available, pending ping results
       - Online: Successful ping in the last attempt
       - Intermittent: Unsuccessful ping in the last attempt
       - Offline: Unsuccessful ping in the last 2+ attempts
   - Frontend:
     - Ping status indicator next to each service's port number
     - CSS-generated circle colored based on current ping status
     - Color indicators:
       - Green for successful ping
       - Amber for a single failed ping
       - Red for 2+ consecutive failed pings
       - Default color matching port numbers when status is unknown
     - Real-time status updates without page reload
     - Persistent notifications during ping process displaying "Pinging Services | status..."

7.1.2 Multi-user Support. Shared dashboards across users.
7.1.3 Service Categories. Tagging and categorization of services.
7.1.4 Service Documentation. Enhanced notes and documentation with markdown support.
7.1.5 Dashboard Widgets. Statistics and monitoring widgets.
7.1.6 Backup Automation. Scheduled backups and data exports.
7.1.7 Dependency Mapping. Visual mapping of service dependencies.
7.1.8 Custom Icons. Ability to set custom icons for services.
7.1.9 Monitoring Integration. Integration with third-party monitoring tools.
7.1.10 System Theme Integration. Option to follow system light/dark mode preferences.
7.1.11 Enhanced Status Monitoring. Extended ping history, configurable ping intervals, and detailed status reports.

## 8. Development and Deployment Requirements

### 8.1 Development Workflow
8.1.1 Simplified Approach. Production-focused workflow with no separate development environment.
8.1.2 Runtime. Node.js.
8.1.3 Package Management. npm.
8.1.4 Browser. Modern web browser.
8.1.5 Editor. Code editor.
8.1.6 Deployment. Simplified deployment script (deploy.sh) for build and server management.

### 8.2 Deployment Requirements
8.2.1 Server. Basic web server or Node.js for the included server.js.
8.2.2 Database. No database requirements (client-side storage only). 