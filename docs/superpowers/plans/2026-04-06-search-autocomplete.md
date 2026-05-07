# Search Autocomplete Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** When the search bar narrows results to a single service, show ghost-text autocomplete with the service name and server:port, and let Enter navigate to that service.

**Architecture:** An overlay `<div>` inside `.search-bar` mirrors the input's font/padding and renders three styled `<span>` segments (remaining service name, emdash, server:port) positioned after the typed text. A computed match object derived from `searchTerm` + `servers` drives both the overlay display and the Enter-to-navigate behavior.

**Tech Stack:** React, TypeScript, CSS

**No tests configured** — this project has no test framework. Validation is manual via `npm run dev`.

---

## File Structure

- **Modify:** `src/App.tsx` — add autocomplete match computation, update search submit handler, render overlay
- **Modify:** `src/App.css` — add overlay positioning and ghost-text styling

---

### Task 1: Compute the single-service autocomplete match

**Files:**
- Modify: `src/App.tsx:405-492`

- [ ] **Step 1: Add the autocomplete match computation**

After the existing `getFilteredServices` function (line ~476) and before `clearSearch`, add:

```tsx
// Compute autocomplete match: exactly one service matches across all servers
const getAutocompleteMatch = () => {
  const trimmed = searchTerm.trim();
  if (!trimmed) return null;

  const lowerSearch = trimmed.toLowerCase();
  const matches: { service: Service; server: Server }[] = [];

  for (const server of servers) {
    for (const service of server.services) {
      if (service.name.toLowerCase().includes(lowerSearch)) {
        matches.push({ service, server });
      }
    }
  }

  if (matches.length !== 1) return null;

  const { service, server } = matches[0];
  const url = `http://${server.hostname}:${service.port}${service.path || ''}`;
  const displayText = `${service.name} — ${server.name}:${service.port}`;

  return { service, server, url, displayText };
};
```

- [ ] **Step 2: Verify the build compiles**

Run: `npm run build`
Expected: No errors (function is defined but not yet used — tree-shaking is fine, just checking syntax)

- [ ] **Step 3: Commit**

```bash
git add src/App.tsx
git commit -m "feat: add autocomplete match computation for single-service search results"
```

---

### Task 2: Update search submit to navigate on Enter

**Files:**
- Modify: `src/App.tsx:488-492` (the `handleSearchSubmit` function)

- [ ] **Step 1: Update handleSearchSubmit to open the matched service URL**

Replace the existing `handleSearchSubmit`:

```tsx
// Handle search form submission
const handleSearchSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  const match = getAutocompleteMatch();
  if (match) {
    window.open(match.url, '_blank', 'noopener,noreferrer');
    setSearchTerm('');
  }
};
```

- [ ] **Step 2: Run the dev server and manually test**

Run: `npm run dev`
Test: Type a search term that matches exactly one service. Press Enter. Verify it opens the correct URL in a new tab and clears the search bar.

- [ ] **Step 3: Commit**

```bash
git add src/App.tsx
git commit -m "feat: pressing Enter navigates to single matched service"
```

---

### Task 3: Add the ghost-text overlay to the search bar JSX

**Files:**
- Modify: `src/App.tsx:1099-1122` (the search bar JSX)

- [ ] **Step 1: Add the autocomplete overlay inside `.search-bar`**

Replace the search bar div (the `<div className="search-bar">` block, lines ~1101-1121) with:

```tsx
<div className="search-bar">
  <input
    type="text"
    placeholder="Search servers or services..."
    value={searchTerm}
    onChange={handleSearchChange}
    aria-label="Search servers or services"
    className="search-input"
    autoFocus
  />
  {(() => {
    const match = getAutocompleteMatch();
    if (!match) return null;
    const lowerSearch = searchTerm.toLowerCase();
    const nameIdx = match.service.name.toLowerCase().indexOf(lowerSearch);
    if (nameIdx === -1) return null;
    // Text before match in service name (preserve original casing)
    const beforeMatch = match.service.name.slice(0, nameIdx);
    // The typed portion (invisible spacer, preserve original casing from service name)
    const typedPortion = match.service.name.slice(nameIdx, nameIdx + searchTerm.length);
    // Remainder of service name after typed portion
    const afterMatch = match.service.name.slice(nameIdx + searchTerm.length);
    // If the match is not at position 0, we need to show the prefix too
    const spacer = beforeMatch + typedPortion;
    return (
      <div className="search-autocomplete-overlay" aria-hidden="true">
        <span className="search-autocomplete-spacer">{spacer}</span>
        <span className="search-autocomplete-ghost">{afterMatch}</span>
        <span className="search-autocomplete-ghost"> — </span>
        <span className="search-autocomplete-server">{match.server.name}:{match.service.port}</span>
      </div>
    );
  })()}
  {searchTerm && (
    <button 
      type="button" 
      className="search-clear-button" 
      onClick={clearSearch}
      aria-label="Clear search"
    >
      ×
    </button>
  )}
</div>
```

The key insight: the spacer span uses `visibility: hidden` to push the ghost text to exactly the right position after the typed text. The spacer contains the matched prefix of the service name (matching the actual characters), so it occupies the same width as the typed text in the real input.

- [ ] **Step 2: Verify the build compiles**

Run: `npm run build`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/App.tsx
git commit -m "feat: render ghost-text autocomplete overlay in search bar"
```

---

### Task 4: Style the ghost-text overlay

**Files:**
- Modify: `src/App.css` (after `.search-clear-button:hover` block, ~line 415)

- [ ] **Step 1: Add the autocomplete overlay CSS**

Insert after the `.search-clear-button:hover` rule (line ~415):

```css
.search-autocomplete-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: var(--height-button);
  padding: 0 1rem;
  display: flex;
  align-items: center;
  pointer-events: none;
  font-size: var(--font-size-base);
  font-family: inherit;
  white-space: nowrap;
  overflow: hidden;
}

.search-autocomplete-spacer {
  visibility: hidden;
}

.search-autocomplete-ghost {
  color: rgba(255, 255, 255, 0.4);
}

.search-autocomplete-server {
  color: color-mix(in srgb, var(--status-amber) 45%, transparent);
}
```

Note: `color-mix` with `transparent` creates the ghosted gold effect. The `pointer-events: none` ensures the overlay doesn't interfere with clicking/selecting in the input.

- [ ] **Step 2: Run the dev server and visually verify**

Run: `npm run dev`
Test:
1. Type a term that matches exactly one service — ghost text should appear with correct colors
2. Type a term that matches 2+ services — no ghost text
3. Type a term that matches zero services — no ghost text
4. Press Enter when ghost text is showing — should navigate to service URL in new tab
5. Press Escape — should clear search as before
6. Verify ghost text aligns horizontally with the typed text in the input

- [ ] **Step 3: Commit**

```bash
git add src/App.css
git commit -m "feat: style ghost-text autocomplete with gray and gold colors"
```

---

### Task 5: Handle edge case — light theme ghost text

**Files:**
- Modify: `src/App.css`

- [ ] **Step 1: Check if light theme needs different ghost text colors**

The light theme has a white/light background for the search bar. The ghost text uses `rgba(255, 255, 255, 0.4)` which is invisible on white backgrounds. Add a light-theme override inside the `:root` (light theme) scope.

Look at lines 1-30 of App.css — the light theme is the default `:root`. The dark theme overrides are applied via JS. Check how the theme switching works:

In `src/App.tsx`, the `applyPalette` function sets CSS variables on `document.documentElement.style`. So both themes use the same CSS selectors — just different variable values.

The ghost text color should adapt. Use CSS variables instead of hardcoded rgba values:

Replace the hardcoded colors in the overlay styles:

```css
.search-autocomplete-ghost {
  color: color-mix(in srgb, var(--server-text) 40%, transparent);
}

.search-autocomplete-server {
  color: color-mix(in srgb, var(--status-amber) 45%, transparent);
}
```

Using `var(--server-text)` (which is the main text color for the active theme) ensures the ghost text adapts to light/dark themes automatically.

- [ ] **Step 2: Verify in dev server**

Run: `npm run dev`
Test: Switch between light and dark themes. Ghost text should be visible but muted in both.

- [ ] **Step 3: Commit**

```bash
git add src/App.css
git commit -m "fix: use theme-aware CSS variables for ghost text colors"
```

---

### Task 6: Build and validate

**Files:** None (validation only)

- [ ] **Step 1: Run the production build**

Run: `npm run build`
Expected: Clean build, no errors or warnings

- [ ] **Step 2: Run the lint check**

Run: `npm run lint`
Expected: No new lint errors

- [ ] **Step 3: Start the preview server and do final validation**

Run: `npm run preview`
Test all behaviors:
1. Page loads with cursor in search bar
2. Typing a unique service match shows ghost text (service name gray, emdash gray, server:port gold)
3. Ghost text disappears when match is not unique
4. Enter navigates to the matched service URL
5. Escape clears the search
6. Clear button (×) works as before
7. No visual artifacts or misalignment

- [ ] **Step 4: Commit any remaining fixes if needed**
