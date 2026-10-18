# Pagination

> Accessible page navigation with page buttons, rows-per-page selector, custom ellipsis, page info display, section reordering, i18n, and full style customization.

**Category:** Navigation
**Keywords:** pagination, pager, page navigation, rows per page, page selector, data table, ellipsis, page info, i18n

---

## Quick Answer

Use `<Pagination value={page} totalPages={10} onValueChange={setPage} />` for basic pagination. Add `showRowsPerPage` for a rows-per-page dropdown. Supports custom ellipsis rendering, page info display, section reordering, i18n labels, and full class-driven styling. Works out-of-the-box with built-in Tailwind styles and dark mode.

---

## Import

```tsx
import { Pagination } from "@chumlab/ui/pagination";
import type { PaginationProps, PaginationClasses } from "@chumlab/ui/pagination";
```

---

## Basic Usage (copy-paste ready)

```tsx
import { useState } from "react";
import { Pagination } from "@chumlab/ui/pagination";

export default function Example() {
  const [page, setPage] = useState(1);
  return <Pagination value={page} totalPages={10} onValueChange={setPage} />;
}
```

---

## Prop Constraints (critical for correct usage)

| Prop | Constraint |
|------|-----------|
| `value` + `onValueChange` | Controlled mode — both needed together. |
| `defaultValue` | Uncontrolled mode — do not combine with `value`. |
| `totalPages` | **Required.** Must be >= 0. |
| `showRowsPerPage` | Requires `rowsPerPage` and `onRowsPerPageChange`. |
| `rowOptions` | Only meaningful with `showRowsPerPage`. Default: `[5, 10, 25, 50, 100]`. |
| `sectionOrder` | Controls layout order: `["selector", "pageInfo", "nav"]`. |
| `renderEllipsis` | Replaces default `...` with custom content. Receives `{ position, onValueChange }`. |
| `renderPageInfo` | Custom render for page info. Receives `{ value, totalPages, rowsPerPage }`. |
| `prevIcon` / `nextIcon` / `dropdownIcon` | Elements, not components, rendered as given. `classes.navIcon` styles the default arrows and `classes.rowsPerPage.icon` the default chevron. |
| `dropdownSide` | `"top"` or `"bottom"` — controls rows dropdown direction. |
| `unstyled` | Strips all default classes. Must provide styling via `classes`. |

---

## Narrow containers

Prev, the page list and next always share one row; the list never wraps.
`siblingCount` is the most sibling pages shown. When the row would overflow
the space its host gives it, measured with a `ResizeObserver` on the
component's own `<nav>` and on its host (so a narrow sidebar or a centred
footer counts, not just a narrow window), Pagination steps down, one step per
measurement:

1. Fewer siblings, down to 0: the first page, the current page and the last
   page, with ellipses between.
2. Compact spacing: the list's gap and the ellipsis padding go from 8 px to
   4 px.
3. Compact padding: the page buttons' horizontal padding goes from 12 px to
   8 px, with a 24 px minimum width, so every button keeps at least a
   24 × 24 px target.
4. If that still does not fit, the page list scrolls horizontally inside the
   row; prev and next stay on it, and the current page is scrolled into view.

The `<nav>` never grows past its host. When the host grows, Pagination starts
again from `siblingCount`. The server and the first client render show the
full set, so there is no hydration mismatch; the step-down runs after mount.

## Data Attributes (for CSS selectors and testing)

- `data-disabled` — on prev/next buttons at a boundary, and on every button when `disabled`
- `data-active` — on the active page button
- `data-selected` — on the selected row option in dropdown
- `data-highlighted` — on keyboard-focused dropdown option
- `data-state` — `"open"` on dropdown portal when visible
- `data-direction` — `"up"` or `"down"` on dropdown portal
- `data-side` — on the rows-per-page surface, the side it was placed on after any flip
- `data-reduce-motion` — on the root `<nav>`, while reduced motion is in force
- `aria-current="page"` — on the active page button
- `aria-expanded` — on selector button

DOM nesting: `nav(root) > [selector + pageInfo + nav(reorderable)] > nav > prevButton + pageButtons + ellipsis + nextButton`

---

## All Props

<!-- generated from Pagination.schema.json — edit the schema, not this table -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `totalPages` **(required)** | number | — | Total number of pages. |
| `siblingCount` | number | `1` | The most sibling page buttons shown on each side of the current page. When the page row would overflow its container, Pagination shows fewer, down to none, keeping the first, current and last pages with ellipses between; then it tightens the list's spacing; then the page buttons' padding; and if even that does not fit, the page list scrolls inside the row while prev and next stay on it. The server and first render show the full set. |
| `rowsPerPage` | number | — | Current number of rows displayed per page. |
| `rowOptions` | array | — | Available row-per-page options for the selector. |
| `disabled` | boolean | — | Disables the entire pagination control. |
| `onValueChange` | object | — | (page: number) => void - Fires when the current page changes. |
| `value` | number | — | Controlled current page number. |
| `defaultValue` | number | `1` | Initial page number for uncontrolled usage. |
| `onRowsPerPageChange` | object | — | (rows: number) => void - Fires when the rows-per-page value changes. |
| `showRowsPerPage` | boolean | `false` | Whether to show the rows-per-page selector. |
| `rowsPerPageSuffix` | string | `"rows"` | Visible text after the rows-per-page select ("Show 10 rows"). With the prefix, it names the select; with both empty the select is named "Rows per page". |
| `rowsPerPagePrefix` | string | `"Show"` | Visible text before the rows-per-page select. With the suffix, it names the select; the number is its value. |
| `dropdownAriaLabel` | string | `"Rows per page"` | Accessible label for the rows-per-page dropdown. |
| `dropdownSide` | `"top"` \| `"bottom"` | `"top"` | Vertical placement of the rows-per-page dropdown — opens upward (top) or downward (bottom). |
| `dropdownZIndex` | number | `50` | Z-index of the rows-per-page dropdown. |
| `dropdownOffset` | number | `4` | Gap in pixels between trigger and dropdown. |
| `dropdownIcon` | object | — | ReactNode — Replaces the rows-per-page select's chevron. Rendered as given; `classes.rowsPerPage.icon` styles the default one. |
| `prevIcon` | object | — | ReactNode — Replaces the previous-page arrow. Rendered as given; `classes.navIcon` styles the default one. |
| `nextIcon` | object | — | ReactNode — Replaces the next-page arrow. Rendered as given; `classes.navIcon` styles the default one. |
| `renderEllipsis` | object | — | (props: EllipsisRenderProps) => ReactNode - Custom render function for the ellipsis element. |
| `renderPageInfo` | object | — | (props: PageInfoRenderProps) => ReactNode - Custom render function for the page info display. |
| `sectionOrder` | array | — | Order of pagination sections. |
| `reduceMotion` | `true` \| `false` \| `"auto"` | `"auto"` | Controls motion preferences. 'auto' respects the user's OS setting. |
| `classes` | object | — | CSS class overrides for pagination sub-elements. |
| `unstyled` | boolean | `false` | Removes all default styling. |
| `portalContainer` | object | — | HTMLElement \| null - Portal target for the rows-per-page dropdown. |
| `keepMounted` | boolean | `false` | Keeps the rows-per-page menu mounted while closed. |
| `prevAriaLabel` | string | `"Previous page"` | Accessible label for the previous page button. |
| `nextAriaLabel` | string | `"Next page"` | Accessible label for the next page button. |
| `paginationAriaLabel` | string | — | Accessible label for the pagination nav element. |
| `pageAriaLabel` | object | — | (page: number) => string - Function to generate aria-label for each page button. |

## Ref API

```tsx
import { useRef } from "react";
import { Pagination } from "@chumlab/ui/pagination";

const paginationRef = useRef<HTMLElement>(null);

// Focus the row element
paginationRef.current?.focus();

<Pagination ref={paginationRef} value={page} totalPages={10} onValueChange={setPage} />
```

---

## Styling Guide

> **A plain utility replaces the library's for that property, in every state.**
> `classes={{ slot: "text-red-500" }}` drops the library's `hover:text-…` and
> `data-[state=…]:text-…` on that slot as well — otherwise they would sit beside
> your class and win in their own state, leaving your override in the DOM and
> inert. Pass your own variant to keep one: `"text-red-500 hover:text-red-400"`.
> A variant YOU pass is never dropped.

### How class merging works

1. **Default** (no `classes`, no `unstyled`) — uses `DEFAULT_PAGINATION_CLASSES`
2. **Partial override** (`classes` without `unstyled`) — your classes compose with that slot's defaults; slots you don't name keep theirs.

**A plain utility of yours wins over every default in its group on that slot, states included.**
`classes={{ control: "bg-green-500" }}` paints green in every state, where a default
`data-[state=checked]:` background would otherwise keep winning. To restyle one state only,
pass that state's own variant (`data-[state=checked]:bg-green-500`). Defaults in other groups stay.

3. **Unstyled** (`unstyled={true}`) — all slots empty, you provide everything

### Slot → visual mapping

```
root (row, flex flex-wrap)
├── rowsPerPage (rows-per-page)
│   ├── label ("Show")
│   ├── selectorButton (trigger)
│   │   └── dropdownIcon
│   ├── selectorDropdownWrapper (portal)
│   │   └── selectorDropdown
│   │       └── selectorOption (role="option")
│   └── label ("rows")
├── pageInfo (custom render slot)
└── row (navigation controls)
    ├── navTrigger (prev)
    │   └── navIcon
    ├── list
    │   ├── item [data-state=active]
    │   └── ellipsis
    └── navTrigger (next)
        └── navIcon
```

| "I want to change..." | Slot to use | Notes |
|------------------------|-------------|-------|
| Root layout | `root` | Controls flex direction and gap |
| Page buttons | `item` | Inactive and active styles |
| Prev/next buttons | `navTrigger` | Shared for both |
| Ellipsis dots | `ellipsis` | Or use `renderEllipsis` for custom |
| Rows dropdown trigger | `rowsPerPage.trigger` | |
| Dropdown panel | `rowsPerPage.content` | Portal-rendered |
| Dropdown option | `rowsPerPage.item` | Use `data-[selected]` and `data-[highlighted]` |
| Icons | `navIcon`, `navIcon`, `rowsPerPage.icon` | |

### Dark mode

Defaults use Tailwind `dark:` prefix. When overriding, always provide both light and dark variants.

### Complete themed example (Pill style)

```tsx
<Pagination
  value={page}
  totalPages={10}
  onValueChange={setPage}
  classes={{
    root: "flex flex-wrap items-center gap-1",
    navTrigger: "p-2 rounded-full border shadow-sm bg-white border-gray-200 dark:bg-gray-700 dark:border-gray-600",
    item: "w-9 h-9 rounded-full border shadow-sm flex items-center justify-center text-sm bg-white border-gray-200 dark:bg-gray-700 dark:border-gray-600 data-[state=active]:shadow-md data-[state=active]:bg-blue-600 data-[state=active]:border-blue-600 data-[state=active]:text-white",
    list: "flex items-center gap-1",
    navIcon: "w-4 h-4",
    ellipsis: "px-2 text-gray-400",
  }}
/>
```

---

## Patterns

### Data table pagination with rows selector

```tsx
const [page, setPage] = useState(1);
const [rows, setRows] = useState(10);
<Pagination
  value={page}
  totalPages={Math.ceil(totalItems / rows)}
  onValueChange={setPage}
  showRowsPerPage
  rowsPerPage={rows}
  onRowsPerPageChange={(r) => { setRows(r); setPage(1); }}
/>
```

### Jump-to-page ellipsis

```tsx
<Pagination
  renderEllipsis={({ onValueChange }) => (
    <input
      type="number"
      onKeyDown={(e) => {
        if (e.key === "Enter") onValueChange(Number(e.currentTarget.value));
      }}
    />
  )}
/>
```

### Page info display

```tsx
<Pagination
  renderPageInfo={({ value, totalPages }) => (
    <span>Page {value} of {totalPages}</span>
  )}
/>
```

### i18n (French)

```tsx
<Pagination
  rowsPerPagePrefix="Afficher"
  rowsPerPageSuffix="lignes"
  dropdownAriaLabel="Lignes par page"
  paginationAriaLabel="Navigation des pages"
  prevAriaLabel="Page précédente"
  nextAriaLabel="Page suivante"
  pageAriaLabel={(p) => `Page ${p}`}
/>
```

### Section reordering

```tsx
<Pagination sectionOrder={["row", "pageInfo", "rowsPerPage"]} />
```

---

## Keyboard Interactions

| Key | Behaviour |
|-----|-----------|
| `Tab` | Moves between the page buttons, the navigation arrows and the rows-per-page trigger. |
| `Enter`, `Space` | Activates the focused control. |
| `ArrowDown`, `ArrowUp` | Moves between options in the open rows-per-page menu. |
| `Home`, `End` | Jumps to the first or last option in that menu. |
| `Escape` | Closes it and returns focus to the trigger. Always: there is no prop to turn it off, because the APG combobox pattern requires Escape to close the popup. |

---

## Accessibility

- `<nav aria-label="Pagination">` landmark (configurable via `paginationAriaLabel`)
- `aria-current="page"` on active page button
- Page buttons have configurable `aria-label` via `pageAriaLabel`
- Prev/next buttons properly disabled at boundaries, and with every other control when `disabled`: none of them takes focus or acts
- Ellipsis elements marked `aria-hidden="true"`
- Rows dropdown: `role="listbox"` with `aria-controls`, `aria-expanded`, `aria-activedescendant`
- Keyboard: Tab between controls, Enter/Space to select, Arrow Up/Down in dropdown, Home/End for first/last, Escape to close
- All text labels customizable for i18n
- `role="status"` with `aria-live="polite"` for state announcements
- Instance-scoped IDs via `useId()` prevent collisions
- Extends native `HTMLAttributes` — accepts `id`, `className`, `style`, `data-*`, `aria-*`
- **Reduced motion:** `reduceMotion` defaults to `"auto"`, which follows the OS
  `prefers-reduced-motion` setting. `true` always reduces motion. `false` always
  animates — **including for a user who has asked their OS for less motion**, so
  pass it only when you know more than the OS setting does. The value governs the
  decorative classes as well as the animation timings.
---

## Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| Styles wrong after overriding one class | Your class composes with the slot's defaults; only a utility in the same group replaces a default | Pass the utility that conflicts (a plain one overrides every state too), or use `unstyled` to start from nothing |
| Rows dropdown not showing | Missing `showRowsPerPage` | Set `showRowsPerPage={true}` |
| Rows change doesn't reset page | Parent not resetting `value` | Set `value` to 1 in `onRowsPerPageChange` |
| Ellipsis not interactive | Using default ellipsis | Use `renderEllipsis` for custom behavior |
| Page info not visible | Missing `renderPageInfo` | Provide render function |
| Sections in wrong order | Default order | Use `sectionOrder` prop |
| Pagination overflows on mobile | Missing `flex-wrap` | Default includes `flex-wrap`; ensure custom `root` class includes it |
| Dropdown renders behind overlay | z-index too low | Use `dropdownZIndex` prop |

---

## Demo Reference

**File:** `src/pages/demo/PaginationDemo.tsx`

| Feature | Search for | What you'll find |
|---------|-----------|------------------|
| Minimal example | `title="Basic Usage"` | value + totalPages |
| Rows per page | `title="With Rows Per Page"` | showRowsPerPage |
| Many pages | `title="Many Pages & Sibling Count"` | siblingCount variations |
| Jump-to-page | `title="Custom Ellipsis (Jump to Page)"` | renderEllipsis with 3 variants |
| Page info | `title="Page Info Display"` | renderPageInfo |
| Section reorder | `title="Section Reordering"` | sectionOrder |
| External rows | `title="External Rows Control"` | Custom rows UI |
| i18n | `title="i18n / Custom Labels"` | French labels |
| Custom icons | `title="Custom Icons"` | prevIcon, nextIcon, dropdownIcon |
| Custom row options | `title="Custom Row Options & Label"` | rowOptions, rowsPerPageSuffix |
| Pill style | `title="Pill Style"` | Full themed example |
| Data-attribute styling | `title="Data-Attribute Styling"` | data-[active] variants |
| Minimal/borderless | `title="Minimal / Borderless"` | Ghost style |
| Compact | `title="Compact"` | Small sizing |
| Boundary conditions | `title="Boundary Conditions"` | 0, 1, 3 pages |
| Ref forwarding | `title="Ref Forwarding & HTML Attributes"` | Programmatic focus |
| Dropdown z-index | `title="Dropdown Z-Index"` | dropdownZIndex |
| Disabled | `title="Disabled State"` | disabled prop |

### Source file index

| File | Contains |
|------|----------|
| `Pagination.tsx` | Main component, RowsPerPageSelector, dropdown portal, ref forwarding |
| `utils/types.ts` | PaginationProps, PaginationClasses, render prop types, SectionName |
| `utils/constants.ts` | DEFAULT + UNSTYLED classes, DEFAULT_ROW_OPTIONS |
| `utils/helpers.ts` | `getVisiblePages` — page range calculation with ellipsis |
| `utils/icons.tsx` | ChevronLeft, ChevronRight, ChevronDown icons |
| `index.ts` | Public exports |
| `__tests__/` | Unit tests |
