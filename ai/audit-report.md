# SYSTEM AUDIT REPORT — Chumlab UI

**Date:** 2026-04-03
**Auditor:** Staff+ Frontend Architect (System Auditor)
**Scope:** Full repository scan — 32 component directories, 110+ .tsx files

---

## 1. SYSTEM MODEL (Inferred)

- **Architecture:** React 19 SPA with Vite build tooling
- **Styling:** Tailwind CSS v4 with `cn()` utility (clsx + tailwind-merge)
- **Pattern:** forwardRef + controlled/uncontrolled state via `useControllableState`
- **Theming:** `classes` prop override + `unstyled` mode per component
- **State:** Context-based for compound components (Accordion, Avatar, Drawer, Toast, TabPanel)
- **Testing:** Vitest + React Testing Library (unit), Playwright (e2e)
- **Build:** Vite library mode, TypeScript strict, barrel exports via src/index.ts

---

## 2. BLOCKERS (🔴)

### B1. SSR — Direct `window`/`document` Access Without Guards

| File | Line(s) | API |
|------|---------|-----|
| `Dropdown/utils/helpers.ts` | 19-20 | `window.visualViewport`, `window.innerHeight/Width` |
| `TimePicker/TimePicker.tsx` | 42-43 | `window.visualViewport`, `window.innerHeight/Width` |
| `Toast/Toast.tsx` | 50, 55 | `window.matchMedia` in state initializer & useEffect |
| `ResizablePanel/ResizablePanel.tsx` | 117-118 | `document.body.style` in callback |
| `Dropdown/Dropdown.tsx` | 171, 188, 237-238, 452, 456, 484 | `window.addEventListener`, `window.visualViewport` |
| `DatePicker/DatePicker.tsx` | 88, 98 | `document.addEventListener` without guard |
| `Pagination/Pagination.tsx` | 301, 306, 313 | `document.getElementById`, `document.addEventListener` |
| `Table/Table.tsx` | 63 | `window.innerWidth` in state initializer |

**Impact:** SSR crash — any Next.js App Router or SSR usage will throw `ReferenceError: window is not defined`.

### B2. Consistency — Loader Missing `classes`/`unstyled` Props & Constants

- **Location:** `src/components/Loader/` (CircularLoader, LinearLoader, DotLoader, PulseLoader)
- **Issue:** No `classes` prop, no `unstyled` prop, no `constants.ts` file
- **Impact:** Loader is the ONLY component group breaking the library's core theming contract. Users cannot customize Loader via the standard API.

### B3. Consistency — Table Missing DEFAULT_TABLE_CLASSES Export

- **Location:** `src/components/Table/constants.ts`
- **Issue:** Only re-exports Pagination constants. No `DEFAULT_TABLE_CLASSES` or `UNSTYLED_TABLE_CLASSES`.
- **Impact:** Users cannot access/override default Table styles via the documented pattern.

### B4. Consistency — Toast & Table Missing forwardRef

- **Location:** `Toast/Toast.tsx`, `Table/Table.tsx`
- **Issue:** Both use `memo()` but NOT `forwardRef()`. 29/31 components use forwardRef.
- **Impact:** Broken ref forwarding contract — users cannot attach refs to Toast or Table.

### B5. Accessibility — Missing Accessible Names on Interactive Elements

| Component | Element | Issue |
|-----------|---------|-------|
| Dropdown | `role="option"` items | No aria-label/aria-labelledby |
| Button | Icon-only `<span role="button">` | No aria-label guidance |
| Pagination | `role="option"` row selector | No aria-label |
| Table | Table structure | Missing role="table", aria-label, aria-rowcount, aria-colcount |

### B6. Test Coverage — 13 Components Missing E2E Tests

Missing e2e: Breadcrumb, CascadingDropdown, DatePicker, InternationalPhoneInput, Loader, Modal, MultiSelectDropdown, MultiSelectSearchableDropdown, RadioButton, SearchableDropdown, Slider, Table, TimePicker, Toggle

### B7. Documentation — Main Component Files Missing JSDoc

39/70 main component .tsx files have NO JSDoc on their exported component. Props interfaces have JSDoc but the component exports themselves lack documentation.

### B8. Toast useEffect Without Dependency Array

- **Location:** `Toast/Toast.tsx` lines 41-44
- **Issue:** `useEffect(() => { ... })` — runs every render with no deps
- **Impact:** Wasteful re-execution on every render cycle

---

## 3. HIGH-RISK ISSUES (🟡)

### H1. Type Safety — Button onClick Uses `unknown[]`

- **Location:** `Button/utils/types.ts` line 149
- **Code:** `onClick?: (...args: unknown[]) => void`
- **Should be:** `onClick?: (event: React.MouseEvent<HTMLElement>) => void`

### H2. Accessibility — Keyboard Support Missing for Custom Roles

- Dropdown `role="option"` items: no Enter/Space keyboard activation
- Button as `<span role="button">`: Space key doesn't preventDefault (page scrolls)
- Pagination row selector: no keyboard activation on options

### H3. Accessibility — Missing aria-live Announcements

- Dropdown: no polite announcement on keyboard navigation
- Pagination: page changes not announced
- SearchableDropdown: no results count / "no results" announcement

### H4. Accessibility — Incomplete Reduced Motion Support

- Drawer: `useReducedMotion()` present but inline transitions not consistently gated
- Accordion: animation timing not fully disabled for motion preference
- Pagination: `useReducedMotion()` sets data attribute but no CSS/animation disabling

### H5. Performance — Non-Tree-Shakeable Barrel Export

- **Location:** `src/index.ts`
- **Issue:** Single barrel export forces parser to include all component code even when only one is imported
- **Recommendation:** Subpath exports in package.json

### H6. Performance — date-fns Not Optimized

- ~16KB bundled even for non-DatePicker users
- Should be optional peer dependency

### H7. Performance — Inconsistent React.memo Usage

- Only 18/110+ components use `React.memo`
- Missing on: Dropdown (main), Pagination (main), DatePicker, Breadcrumb items

### H8. Performance — Resize/Scroll Listeners Without Throttle

- `Table/Table.tsx` resize handler
- `ResizablePanel/ResizablePanel.tsx` pointer handlers
- No debounce/throttle utility applied

### H9. Performance — Toast setTimeout Without Cleanup Tracking

- `ToastProvider.tsx` lines 50-58, 99-100
- Multiple setTimeouts not tracked in refs for cleanup on unmount

### H10. Consistency — Deprecated Props Without Migration Guide

6 deprecated properties still exported:
- `Pagination.onPageChange` → use `onValueChange`
- `Pagination.page` → use `value`
- `Checkbox.onCheckedChange` → use `onValueChange`
- `Toast.onDismissed` → use `onDismiss`
- `Accordion.onValueChanged` → use `onExpandedChange`
- `Switch.onValueChanged` → use `onValueChange`

No migration timeline or guide documented.

### H11. Consistency — Mixed interface/type for Props

Some components use `interface`, others use `type` for props definitions. No enforced convention.

### H12. Consistency — Constants File Location

28/31 components use `utils/constants.ts`. DatePicker and InternationalPhoneInput use root `constants.ts`.

### H13. Performance — ClockFace Expensive Calculations

- `TimePicker/ClockFace.tsx` — isHourDisabled iterates 60 minutes per check, not memoized for drag operations

### H14. `brand` Component — No Unit Tests

Logo components exported publicly but have zero test coverage.

---

## 4. ROOT CAUSES (System-Level)

1. **No SSR testing or guard enforcement** — No lint rule or CI check ensures `window`/`document` are gated behind `isBrowser`. The `isBrowser` utility exists but is not uniformly applied.

2. **Loader was built without the design system contract** — Skipped the `classes`/`unstyled`/`constants` pattern entirely, likely added earlier than the pattern was established.

3. **No mandatory a11y lint enforcement** — eslint-plugin-jsx-a11y not in config. Accessibility relies entirely on manual review and tests.

4. **No e2e coverage gate** — No CI requirement for e2e coverage. 41% of components lack e2e tests.

5. **Performance optimizations inconsistently applied** — No team guideline on when to use `memo()`, `useCallback`, or throttle. Applied ad-hoc.

6. **Deprecated prop handling is informal** — `@deprecated` JSDoc tags exist but no policy on removal timeline or migration communication.

---

## 5. AFFECTED COMPONENT GROUPS

| Group | Blockers | High-Risk |
|-------|----------|-----------|
| **Loader** | B2 (no classes/unstyled) | — |
| **Table** | B3 (no constants export), B4 (no forwardRef), B5 (no aria) | H7 (no memo), H8 (no throttle) |
| **Toast** | B4 (no forwardRef), B8 (useEffect no deps) | H9 (setTimeout leak) |
| **Dropdown** | B1 (window SSR), B5 (no aria) | H2 (keyboard), H3 (aria-live), H7 (no memo) |
| **TimePicker** | B1 (window SSR) | H13 (ClockFace perf) |
| **DatePicker** | B1 (document SSR) | H6 (date-fns bundle) |
| **Pagination** | B1 (document SSR), B5 (no aria) | H2 (keyboard), H3 (aria-live), H4 (motion) |
| **ResizablePanel** | B1 (document SSR) | H8 (no throttle) |
| **Button** | B5 (icon a11y) | H1 (onClick type), H2 (Space key) |
| **Modal** | — | H2 (focus trap edge), H3 (landmark) |
| **Drawer** | — | H4 (motion gating) |
| **Accordion** | — | H4 (motion), H10 (deprecated) |
| **SearchableDropdown** | — | H3 (aria-live) |
| **All Components** | B6 (e2e gaps), B7 (JSDoc gaps) | H5 (barrel), H10 (deprecated), H11 (type convention) |
