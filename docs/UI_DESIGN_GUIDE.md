# Homni UI Design Guide

This document defines the styling conventions and UI component specifications used in the Homni dashboard to maintain consistent user interface elements.

## Table of Contents
1. [Button Types](#1-button-types)
2. [Button Sizing and Layout](#2-button-sizing-and-layout)
3. [Card Components](#3-card-components)
4. [Notifications](#4-notifications)
5. [Form Elements](#5-form-elements)
6. [Color Variables](#6-color-variables)
7. [UI Changelog](#7-ui-changelog)
8. [Typography Standardization](#8-typography-standardization)

## 1. Button Types

### 1.1 Primary Button
Primary buttons are used for the main actions on a page or in a component.

- **Background (Static)**: `var(--primary-button)`
- **Background (Hover)**: `var(--primary-button)` + 10% white highlight
- **Text (Static)**: `var(--primary-button-text)`
- **Text (Hover)**: `var(--primary-button-text)`
- **Shadow**: None
- **Usage**: Main actions, such as "Add Server"
- **CSS Classes**: `.add-button`, `.btn-primary`

### 1.2 Secondary Button
Secondary buttons are used for supporting actions on a page or in a component.

- **Background (Static)**: `var(--secondary-button)`
- **Background (Hover)**: `var(--secondary-button)` + 10% white highlight 
- **Text (Static)**: `var(--secondary-button-text)`
- **Text (Hover)**: `var(--secondary-button-text)`
- **Shadow**: None
- **Usage**: Supporting actions, such as "Import", "Export", "Sort" 
- **CSS Classes**: `.header-button`, `.import-button`, `.export-button`, `.sort-button`, `.btn-secondary`, `.btn-cancel`

### 1.3 Tertiary Button
Tertiary buttons are used for actions within cards or as less prominent options.

- **Background (Static)**: `var(--server-background)` (transparent)
- **Outline (Static)**: `var(--accent-text)`
- **Text (Static)**: `var(--accent-text)`
- **Background (Hover)**: `var(--primary-button)`
- **Outline (Hover)**: `var(--primary-button)`
- **Text (Hover)**: `var(--primary-button-text)` (typically white)
- **Usage**: In-card actions, such as "Add Service"
- **CSS Classes**: `.small-button`, `.server-actions .small-button`

### 1.4 Delete/Danger Button
Delete buttons are a special type of button used for destructive actions.

- **Background (Static)**: Transparent
- **Outline (Static)**: `var(--status-red)`
- **Text (Static)**: `var(--status-red)`
- **Background (Hover)**: `var(--status-red)`
- **Outline (Hover)**: `var(--status-red)`
- **Text (Hover)**: `var(--primary-button-text)` (typically white)
- **Usage**: Destructive actions, such as "Delete Server", "Delete Service"
- **CSS Classes**: `.small-button.delete`, `.btn-delete`

## 2. Button Sizing and Layout

All buttons maintain a consistent height of 38px and use the following common properties:

- **Height**: 38px
- **Padding**: 0.5rem 1rem
- **Border Radius**: 4px
- **Font Size**: 0.875rem
- **Min Width**: 90px (ensures consistent button sizing)
- **Display**: inline-flex
- **Alignment**: center (both horizontal and vertical)

## 3. Card Components

### 3.1 Server Card
Server cards are container components that display server information and host service items.

- **Background**: `var(--server-background)`
- **Text Color**: `var(--service-text)` for titles, `var(--secondary-text)` for metadata
- **Border Radius**: 8px
- **Padding**: 1.25rem
- **Border**: None
- **Shadow**: None
- **Hover Effects**: None (no shadow, no transform)
- **Transition**: None
- **Layout**: Masonry grid layout with automatic height based on content
- **Usage**: Displaying server information and services
- **CSS Classes**: `.server-card`

### 3.2 Service Item
Service items are displayed within server cards and represent individual services.

- **Background (Static)**: `var(--service-background)`
- **Background (Hover)**: `var(--hover-service-item)`
- **Text Color**: `var(--service-text)` for name, `var(--secondary-text)` for port
- **Border Radius**: 4px
- **Padding**: 0.75rem
- **Height**: 40px (fixed height)
- **Margin**: 0.5rem gap between items
- **Usage**: Displaying service name, port, and status
- **CSS Classes**: `.service-item`

### 3.3 No Services Message
A specific UI element displayed when a server has no services.

- **Background**: rgba(51, 51, 51, 0.3)
- **Text Color**: `var(--secondary-text)`
- **Font Style**: Italic
- **Text Alignment**: Center
- **Border Radius**: 4px
- **Padding**: 1rem 0
- **Margin**: 0.5rem 0 1.25rem
- **Usage**: Displayed when a server has no services
- **CSS Classes**: `.no-services`

## 4. Notifications

Notifications are used to provide feedback to the user about actions or system events. They follow the tertiary button styling for consistency.

### 4.1 Standard Notification
- **Position**: Fixed, bottom-right corner
- **Background**: `var(--server-background)` (transparent)
- **Text Color**: `var(--accent-text)`
- **Border**: 1px solid `var(--accent-text)`
- **Border Radius**: 4px (matches buttons)
- **Height**: 38px (matches buttons)
- **Padding**: 0 16px (horizontal only)
- **Shadow**: None
- **Animation**: Slide in from right
- **Z-index**: 1000
- **Max Width**: 350px
- **Min Width**: 200px
- **Usage**: General informational messages (e.g., "Theme changed", "Settings saved")
- **CSS Classes**: `.save-notification`

### 4.2 Success Notification
- **Background**: Transparent (`var(--server-background)`)
- **Text Color**: `var(--status-green)`
- **Border**: 1px solid `var(--status-green)`
- **Usage**: Successful operations (e.g., "Settings saved successfully")
- **CSS Classes**: `.save-notification.success`

### 4.3 Error Notification
- **Background**: Transparent (`var(--server-background)`)
- **Text Color**: `var(--status-red)`
- **Border**: 1px solid `var(--status-red)`
- **Usage**: Error messages or failed operations
- **CSS Classes**: `.save-notification.error`

### 4.4 Animation
Notifications use a slide-in animation from the right side:

```css
@keyframes slide-in-notification {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
```

## 5. Form Elements

### 5.1 Input Field
- **Background**: `var(--service-background)`
- **Text Color**: `var(--server-text)`
- **Border**: 1px solid `var(--input-border, #444)`
- **Border (Focus)**: `var(--accent-button)` or `var(--service-text)`
- **Border Radius**: 4px
- **Padding**: 0.5rem
- **Width**: 100%
- **Font Size**: 1rem
- **Usage**: Text input in forms
- **CSS Classes**: `input`, `textarea`

### 5.2 Search Input
- **Background**: `var(--service-background)`
- **Text Color**: `var(--secondary-text)`
- **Border**: None (no visible border when inactive)
- **Border (Focus)**: 1px solid `var(--accent-text)`
- **Border Radius**: 20px (defined in App.css)
- **Padding**: 8px 35px 8px 15px
- **Width**: 100%
- **Font Size**: 1rem
- **Placeholder Color**: `var(--secondary-text)` with 70% opacity
- **Usage**: Search bar in the header area
- **CSS Classes**: `.search-input`

### 5.3 Checkbox
- **Accent Color**: `var(--accent-button)`
- **Label Font Size**: 0.875rem
- **Usage**: Boolean options in forms
- **CSS Classes**: `.checkbox-label input[type="checkbox"]`

## 6. Color Variables

### 6.1 CSS Variable Definitions
The UI components rely on the following CSS variables defined in the theme system:

- `--primary-button`: Primary button background color
- `--primary-button-text`: Text color for primary buttons
- `--secondary-button`: Secondary button background color
- `--secondary-button-text`: Text color for secondary buttons
- `--server-background`: Background color for server cards and tertiary buttons
- `--service-background`: Background color for service items
- `--hover-service-item`: Hover background color for service items
- `--service-text`: Text color for service names and buttons
- `--secondary-text`: Secondary text color for metadata and ports
- `--accent-text`: Color for accents and tertiary button outline/text
- `--status-red`: Color for error states and destructive actions
- `--status-green`: Color for success status
- `--status-amber`: Color for warning status
- `--header-background`: Application header background
- `--page-background`: Main page background

### 6.2 Default Theme Values

Homni supports both dark and light themes, with dark theme being the default.

#### 6.2.1 Dark Theme (Default)

| Variable | Value | Purpose |
|----------|-------|---------|
| `--header-background` | #101010 | Application header background |
| `--page-background` | #202020 | Main application background |
| `--server-background` | #181818 | Server card background |
| `--service-background` | #202020 | Service item background |
| `--server-text` | #FFFFFF | Main content text |
| `--service-text` | #DBA33A | Server names, headings, and accent |
| `--accent-text` | #DBA33A | Links and interactive elements |
| `--secondary-text` | #919191 | Metadata and lower emphasis text |
| `--primary-button` | #C17F33 | Primary action buttons |
| `--secondary-button` | #535353 | Supporting action buttons |
| `--primary-button-text` | #FFFFFF | Text on primary buttons |
| `--secondary-button-text` | #FFFFFF | Text on secondary buttons |
| `--status-red` | #EC6141 | Error/offline status |
| `--status-amber` | #DBA33A | Warning/intermittent status |
| `--status-green` | #7BB961 | Success/online status |

#### 6.2.2 Light Theme

| Variable | Value | Purpose |
|----------|-------|---------|
| `--header-background` | #E9FDF1 | Application header background |
| `--page-background` | #F2F2F2 | Main application background |
| `--server-background` | #FFFFFF | Server card background |
| `--service-background` | #C9CFD1 | Service item background |
| `--server-text` | #2C3E50 | Main content text |
| `--service-text` | #00a82d | Server names, headings, and accent |
| `--accent-text` | #00a82d | Links and interactive elements |
| `--secondary-text` | #7D7D7D | Metadata and lower emphasis text |
| `--primary-button` | #00a82d | Primary action buttons |
| `--secondary-button` | #C9CFD1 | Supporting action buttons |
| `--primary-button-text` | #FFFFFF | Text on primary buttons |
| `--secondary-button-text` | #2C3E50 | Text on secondary buttons |
| `--status-red` | #EC6141 | Error/offline status |
| `--status-amber` | #DBA33A | Warning/intermittent status |
| `--status-green` | #7BB961 | Success/online status |

### 6.3 Color Palette UI Mapping

The color palette UI in the settings dialog uses specific terminology that maps to the CSS variables as follows:

| Color Palette UI | CSS Variable | Purpose |
|-----------------|--------------|---------|
| Header Background | `--header-background` | Application header background |
| Page Background | `--page-background` | Main application background |
| Server Card | `--server-background` | Server card background |
| Service Card | `--service-background` | Service item background |
| Primary Button & Text | `--primary-button` and `--primary-button-text` | Primary action button and text |
| Secondary Button & Text | `--secondary-button` and `--secondary-button-text` | Supporting action button and text |
| Accent Text | `--accent-text` and `--service-text` | Links, interactive elements, and server titles |
| Primary Text | `--server-text` | Main content text |
| Secondary Text | `--secondary-text` | Lower emphasis text, metadata |
| Red Status | `--status-red` | Error or offline status |
| Amber Status | `--status-amber` | Warning or intermittent status |
| Green Status | `--status-green` | Success or online status |

## 7. UI Changelog

### 7.1 Keyboard Shortcuts Styling - v0.7.1

#### 7.1.1 Initial State
- Keyboard shortcuts displayed in rectangular containers with fixed height (100px)
- Text was larger (0.9rem) and not matching other UI elements 
- Key display had less contrast with background
- Containers were not responsive to content size

#### 7.1.2 Iteration 1
- Reduced container fixed height to 80px
- Adjusted padding from 1rem to 0.75rem
- Reduced margin between keys and descriptions
- Decreased font size for shortcuts from 0.9rem to 0.875rem
- Reduced padding on keyboard keys (from 0.25rem/0.5rem to 0.2rem/0.4rem)

#### 7.1.3 Iteration 2
- Changed from fixed height to auto with min-height of 70px
- Further reduced padding to 0.6rem
- Further reduced margin between keys and description to 0.2rem
- Further reduced font sizes

#### 7.1.4 Final Implementation
- Container uses auto height with min-height of 55px for compact display
- Horizontal padding reduced (0.75rem 0.5rem) to better fit text
- Key styling improved:
  - Changed color to var(--service-text) for better contrast
  - Optimized padding (0.15rem 0.3rem)
  - Used consistent monospace font
- Description styling now matches server notes:
  - Font size: 0.875rem
  - Line height: 1.4
  - Added italic style
  - Used secondary-text color

## 8. Typography Standardization

### 8.1 Font Family
The application uses a system-native font stack for optimal performance and native feel:
```css
font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
```

For monospace elements (such as keyboard shortcuts), the application uses:
```css
font-family: monospace;
```

### 8.2 Typography Variables
To maintain consistency and simplify updates, all typography values are defined as CSS variables:

```css
/* Typography Variables */
--font-size-xl: 2rem;       /* Large headers (welcome card headers) */
--font-size-lg: 1.5rem;     /* Medium headers (dialog titles, section titles) */
--font-size-md: 1.25rem;    /* Small headers (server names and server headers) */
--font-size-base: 1rem;     /* Normal text (input text, general content, paragraphs) */
--font-size-sm: 0.875rem;   /* Secondary text (buttons, labels, form elements, notes) */

/* Line Heights */
--line-height-normal: 1.5;  /* General text content */
--line-height-compact: 1.4; /* Compact text (notes, descriptions) */

/* Fixed Component Heights */
--height-button: 38px;      /* Standard button height */
--height-service: 40px;     /* Service item height */
```

These variables should be used throughout the codebase instead of hard-coded values to ensure consistency and easy updates.

### 8.3 Font Sizes
The application uses a streamlined set of font sizes for different UI elements:

| Variable | Size | Usage |
|----------|------|-------|
| `--font-size-xl` | **2rem** | Large headers (welcome card headers) |
| `--font-size-lg` | **1.5rem** | Medium headers (dialog titles, section titles) |
| `--font-size-md` | **1.25rem** | Small headers (server names and server headers) |
| `--font-size-base` | **1rem** | Normal text (input text, general content, paragraphs) |
| `--font-size-sm` | **0.875rem** | Secondary text (buttons, labels, form elements, notes, descriptions) |

### 8.4 Font Weights
| Weight | Usage |
|--------|-------|
| **500** | Headers, titles, server names, section titles |
| **normal** (400) | Most text content, paragraphs, form labels |

### 8.5 Font Styles
| Style | Usage |
|-------|-------|
| **italic** | Notes, descriptions, secondary information |
| **normal** | Primary content, headers, buttons |

### 8.6 Line Heights
| Variable | Value | Usage |
|----------|-------|-------|
| `--line-height-normal` | **1.5** | General text content (normal text, paragraphs, headers) |
| `--line-height-compact` | **1.4** | Compact text (server notes, shortcut descriptions, secondary text) |
| `--height-button` | **38px** | Fixed height for buttons and notifications |
| `--height-service` | **40px** | Fixed height for service items |

### 8.7 Implementation Guidelines
When implementing typography:

1. Always use the predefined variables instead of hard-coded values
2. Example usage in CSS:
   ```css
   .element {
     font-size: var(--font-size-base);
     line-height: var(--line-height-normal);
   }
   ```
3. For overrides in custom.css, append `!important`:
   ```css
   .custom-element {
     font-size: var(--font-size-sm) !important;
     line-height: var(--line-height-compact) !important;
   }
   ```

### 8.8 Text Colors
All text colors are defined using CSS variables to ensure consistency across themes:

| CSS Variable | Dark Theme | Light Theme | Usage |
|--------------|------------|-------------|-------|
| `--server-text` | #FFFFFF | #2C3E50 | Main content text |
| `--service-text` | #DBA33A | #00a82d | Accent color for headings |
| `--accent-text` | #DBA33A | #00a82d | Links and interactive elements |
| `--secondary-text` | #919191 | #7D7D7D | Lower emphasis text |
| `--primary-button-text` | #FFFFFF | #FFFFFF | Button text |
| `--secondary-button-text` | #FFFFFF | #2C3E50 | Secondary button text | 