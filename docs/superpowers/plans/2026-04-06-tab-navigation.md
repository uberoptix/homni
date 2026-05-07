# Tab Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let users Tab/Shift+Tab through visible service entries with a gold highlight, press Enter to navigate, and resume typing to return to search.

**Architecture:** A `selectedServiceId` state variable tracks the highlighted service. A `getVisibleServices()` helper builds a flat ordered list of `{ service, server }` from the currently filtered/sorted view. The existing `keydown` handler is extended to intercept Tab, Shift+Tab, Enter (when a service is selected), and any printable key (to refocus the search bar). The selected service gets a `service-selected` CSS class that applies a thick `--status-amber` border.

**Tech Stack:** React, TypeScript, CSS

**No tests configured** — validation is manual via `npm run dev`.

---

## File Structure

- **Modify:** `src/App.tsx` — add state, helper, keyboard logic, CSS class binding
- **Modify:** `src/App.css` — add `.service-selected` style

---

### Task 1: Add selectedServiceId state and getVisibleServices helper

**Files:**
- Modify: `src/App.tsx:390` (state declarations, around line 390)
- Modify: `src/App.tsx:500` (after `getAutocompleteMatch`, before `clearSearch`)

- [ ] **Step 1: Add the state variable**

After the existing `const [searchTerm, setSearchTerm] = useState('');` (line 390), add:

```tsx
const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
```

- [ ] **Step 2: Add the getVisibleServices helper**

After the `getAutocompleteMatch` function (ends around line 500) and before `clearSearch` (line 502), add:

```tsx
// Build flat ordered list of all currently visible services (server by server, sorted within each)
const getVisibleServices = () => {
  const result: { service: Service; server: Server }[] = [];
  const filteredServers = getFilteredServers();
  for (const server of filteredServers) {
    const services = getSortedServices(getFilteredServices(server.services));
    for (const service of services) {
      result.push({ service, server });
    }
  }
  return result;
};
```

This uses the same `getFilteredServers` → `getFilteredServices` → `getSortedServices` pipeline as the JSX rendering, so the order matches exactly what the user sees on screen.

- [ ] **Step 3: Clear selection when search term changes**

Update the existing `handleSearchChange` function (around line 507). Change:

```tsx
const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setSearchTerm(e.target.value);
};
```

To:

```tsx
const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setSearchTerm(e.target.value);
  setSelectedServiceId(null);
};
```

- [ ] **Step 4: Verify build compiles**

Run: `npm run build`
Expected: No errors

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx
git commit -m "feat: add selectedServiceId state and getVisibleServices helper"
```

---

### Task 2: Add Tab/Shift+Tab/Enter/typing keyboard handling

**Files:**
- Modify: `src/App.tsx:638-692` (the keyboard shortcuts `useEffect`)

- [ ] **Step 1: Add Tab handling to the keydown handler**

Inside the `handleKeyDown` function, after the `if (e.key === '?' && !isInput)` block (around line 687) and before the closing `};` of `handleKeyDown`, add:

```tsx
// Tab navigation through services
if (e.key === 'Tab' && !isDialogOpen && !isAddingService && !isPaletteDialogOpen && !isHelpOpen) {
  e.preventDefault();
  const visible = getVisibleServices();
  if (visible.length === 0) return;

  const currentIdx = selectedServiceId
    ? visible.findIndex(v => v.service.id === selectedServiceId)
    : -1;

  if (e.shiftKey) {
    // Shift+Tab: move backward
    if (currentIdx <= 0) {
      // At first service or nothing selected: deselect and focus search
      setSelectedServiceId(null);
      (document.querySelector('.search-input') as HTMLElement)?.focus();
    } else {
      setSelectedServiceId(visible[currentIdx - 1].service.id);
    }
  } else {
    // Tab: move forward
    const nextIdx = currentIdx + 1;
    if (nextIdx >= visible.length) {
      // Past last service: wrap to first
      setSelectedServiceId(visible[0].service.id);
    } else {
      setSelectedServiceId(visible[nextIdx].service.id);
    }
  }
  return;
}

// Enter on selected service: navigate
if (e.key === 'Enter' && selectedServiceId && !isInput && !isDialogOpen && !isAddingService) {
  e.preventDefault();
  const visible = getVisibleServices();
  const match = visible.find(v => v.service.id === selectedServiceId);
  if (match) {
    const url = `http://${match.server.hostname}:${match.service.port}${match.service.path || ''}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }
  return;
}

// Any printable key while a service is selected: refocus search bar
if (selectedServiceId && !isInput && !e.altKey && !e.ctrlKey && !e.metaKey && e.key.length === 1) {
  setSelectedServiceId(null);
  const searchInput = document.querySelector('.search-input') as HTMLInputElement;
  if (searchInput) {
    searchInput.focus();
    // Don't preventDefault — let the keystroke flow into the input
  }
}
```

- [ ] **Step 2: Update Escape handling to clear selection**

In the existing Escape handler (around line 671), add a check for `selectedServiceId` as the first condition. Change:

```tsx
if (e.key === 'Escape') {
  if (isHelpOpen) { setIsHelpOpen(false); return; }
  if (isPaletteDialogOpen) { setIsPaletteDialogOpen(false); return; }
  if (isAddingService) { setIsAddingService(false); return; }
  if (isDialogOpen) { setIsDialogOpen(false); return; }
  if (searchTerm) { setSearchTerm(''); return; }
}
```

To:

```tsx
if (e.key === 'Escape') {
  if (isHelpOpen) { setIsHelpOpen(false); return; }
  if (isPaletteDialogOpen) { setIsPaletteDialogOpen(false); return; }
  if (isAddingService) { setIsAddingService(false); return; }
  if (isDialogOpen) { setIsDialogOpen(false); return; }
  if (selectedServiceId) { setSelectedServiceId(null); return; }
  if (searchTerm) { setSearchTerm(''); return; }
}
```

- [ ] **Step 3: Verify build compiles**

Run: `npm run build`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx
git commit -m "feat: add Tab/Shift+Tab/Enter/Escape keyboard navigation for services"
```

---

### Task 3: Apply the selected CSS class to the highlighted service

**Files:**
- Modify: `src/App.tsx:1349-1370` (the service rendering loop)

- [ ] **Step 1: Add the `service-selected` class conditionally**

In the service rendering JSX, find the `<div className="service-item">` element (around line 1363). Change:

```tsx
<div className="service-item">
```

To:

```tsx
<div className={`service-item${selectedServiceId === service.id ? ' service-selected' : ''}`}>
```

- [ ] **Step 2: Verify build compiles**

Run: `npm run build`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/App.tsx
git commit -m "feat: apply service-selected class to tab-highlighted service"
```

---

### Task 4: Style the selected service with a gold border

**Files:**
- Modify: `src/App.css` (after `.service-item` block, around line 1285)

- [ ] **Step 1: Add the selected service style**

After the `.service-item` rule block (ends around line 1284), add:

```css
.service-selected {
  border: 2px solid var(--status-amber);
  padding: 0 calc(1rem - 2px);
}
```

The `padding` adjustment compensates for the 2px border so the service item doesn't shift in size. The original `.service-item` has `padding: 0 1rem` and no border, so we subtract the border width from the horizontal padding to maintain the same total box size.

- [ ] **Step 2: Verify build compiles**

Run: `npm run build`
Expected: No errors

- [ ] **Step 3: Manually test in dev server**

Run: `npm run dev`
Test:
1. Load the page — cursor is in search bar
2. Press Tab — first service on the first server gets a gold border
3. Press Tab again — next service highlighted, previous one loses highlight
4. Tab through all services on a server — moves to next server's first service
5. Tab past the last service — wraps to the first service
6. Shift+Tab from the first service — deselects and refocuses search bar
7. Press Enter on a highlighted service — opens its URL in a new tab
8. With a service selected, start typing — selection clears, text appears in search bar
9. Press Escape with a service selected — clears selection
10. Type a search term, then Tab — cycles through only the filtered services
11. Verify the gold border is visually clean (no layout shift, correct color)

- [ ] **Step 4: Commit**

```bash
git add src/App.css
git commit -m "feat: style selected service with gold border"
```

---

### Task 5: Build and validate

**Files:** None (validation only)

- [ ] **Step 1: Run the production build**

Run: `npm run build`
Expected: Clean build, no errors

- [ ] **Step 2: Start the dev server for final validation**

Run: `npm run dev`
Test all behaviors end-to-end:
1. Page loads, cursor in search bar
2. Tab cycles through all services (server by server, sorted order within each)
3. Shift+Tab cycles backward, returns to search bar from first service
4. Enter on selected service opens URL in new tab
5. Typing while service is selected refocuses search bar and captures keystroke
6. Escape clears selection, then clears search
7. Search filtering + Tab only cycles filtered services
8. Autocomplete ghost text still works (single match → ghost text → Enter navigates)
9. Gold border has no layout shift (padding compensation works)
10. Tab wraps from last service back to first
