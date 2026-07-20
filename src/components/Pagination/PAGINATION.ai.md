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
| `prevIcon` / `nextIcon` / `dropdownIcon` | Accept either a `ComponentType<{ className }>` or `ReactNode`. |
| `dropdownPosition` | `"top"` or `"bottom"` — controls rows dropdown direction. |
| `unstyled` | Strips all default classes. Must provide styling via `classes`. |

---

## Data Attributes (for CSS selectors and testing)

- `data-disabled` — on prev/next buttons when at boundary
- `data-active` — on the active page button
- `data-selected` — on the selected row option in dropdown
- `data-highlighted` — on keyboard-focused dropdown option
- `data-state` — `"open"` on dropdown portal when visible
- `data-direction` — `"up"` or `"down"` on dropdown portal
- `aria-current="page"` — on the active page button
- `aria-expanded` — on selector button

DOM nesting: `nav(root) > [selector + pageInfo + nav(reorderable)] > nav > prevButton + pageButtons + ellipsis + nextButton`

---

## All Props

<!-- generated from Pagination.schema.json — edit the schema, not this table -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `totalPages` **(required)** | number | — | Total number of pages. |
| `siblingCount` | number | `1` | Number of sibling page buttons to show on each side of the current page. |
| `rowsPerPage` | number | — | Current number of rows displayed per page. |
| `rowOptions` | array | — | Available row-per-page options for the selector. |
| `disabled` | boolean | — | Disables the entire pagination control. |
| `onValueChange` | object | — | (page: number) => void - Fires when the current page changes. |
| `value` | number | — | Controlled current page number. |
| `defaultValue` | number | `1` | Initial page number for uncontrolled usage. |
| `onRowsPerPageChange` | object | — | (rows: number) => void - Fires when the rows-per-page value changes. |
| `showRowsPerPage` | boolean | `false` | Whether to show the rows-per-page selector. |
| `rowsPerPageLabel` | string | `"rows"` | Label text for the rows-per-page selector. |
| `showLabel` | string | `"Show"` | Label text for the 'show' section of the rows-per-page selector. |
| `dropdownAriaLabel` | string | `"Rows per page"` | Accessible label for the rows-per-page dropdown. |
| `dropdownPosition` | `"top"` \| `"bottom"` | `"top"` | Vertical placement of the rows-per-page dropdown — opens upward (top) or downward (bottom). |
| `dropdownZIndex` | number | `50` | Z-index of the rows-per-page dropdown. |
| `dropdownGap` | number | `4` | Gap in pixels between trigger and dropdown. |
| `dropdownIcon` | object | — | React.ComponentType<IconProps> \| React.ReactNode - Custom icon for the rows-per-page dropdown. |
| `prevIcon` | object | — | React.ComponentType<IconProps> \| React.ReactNode - Custom icon for the previous page button. |
| `nextIcon` | object | — | React.ComponentType<IconProps> \| React.ReactNode - Custom icon for the next page button. |
| `renderEllipsis` | object | — | (props: EllipsisRenderProps) => ReactNode - Custom render function for the ellipsis element. |
| `renderPageInfo` | object | — | (props: PageInfoRenderProps) => ReactNode - Custom render function for the page info display. |
| `sectionOrder` | array | — | Order of pagination sections. |
| `reduceMotion` | `true` \| `false` \| `"auto"` | — | Controls motion preferences. 'auto' respects the user's OS setting. |
| `classes` | object | — | CSS class overrides for pagination sub-elements. |
| `unstyled` | boolean | `false` | Removes all default styling. |
| `portalContainer` | object | — | HTMLElement \| null - Portal target for the rows-per-page dropdown. |
| `prevAriaLabel` | string | `"Previous page"` | Accessible label for the previous page button. |
| `nextAriaLabel` | string | `"Next page"` | Accessible label for the next page button. |
| `paginationAriaLabel` | string | — | Accessible label for the pagination nav element. |
| `pageAriaLabel` | object | — | (page: number) => string - Function to generate aria-label for each page button. |

## Ref API

```tsx
import { useRef } from "react";
import { Pagination } from "@chumlab/ui/pagination";

const paginationRef = useRef<HTMLElement>(null);

// Focus the nav element
paginationRef.current?.focus();

<Pagination ref={paginationRef} value={page} totalPages={10} onValueChange={setPage} />
```

---

## Styling Guide

### How class merging works

1. **Default** (no `classes`, no `unstyled`) — uses `DEFAULT_PAGINATION_CLASSES`
2. **Partial override** (`classes` without `unstyled`) — **replaces** per slot, not additive
3. **Unstyled** (`unstyled={true}`) — all slots empty, you provide everything

### Slot → visual mapping

```
root (nav, flex flex-wrap)
├── selector (rows-per-page)
│   ├── label ("Show")
│   ├── selectorButton (trigger)
│   │   └── dropdownIcon
│   ├── selectorDropdownWrapper (portal)
│   │   └── selectorDropdown
│   │       └── selectorOption (role="option")
│   └── label ("rows")
├── pageInfo (custom render slot)
└── nav (navigation controls)
    ├── navButton (prev)
    │   └── prevIcon
    ├── pageButtons
    │   ├── pageButton / activePageButton
    │   └── ellipsis
    └── navButton (next)
        └── nextIcon
```

| "I want to change..." | Slot to use | Notes |
|------------------------|-------------|-------|
| Root layout | `root` | Controls flex direction and gap |
| Page buttons | `pageButton`, `activePageButton` | Inactive and active styles |
| Prev/next buttons | `navButton` | Shared for both |
| Ellipsis dots | `ellipsis` | Or use `renderEllipsis` for custom |
| Rows dropdown trigger | `selectorButton` | |
| Dropdown panel | `selectorDropdown` | Portal-rendered |
| Dropdown option | `selectorOption` | Use `data-[selected]` and `data-[highlighted]` |
| Icons | `prevIcon`, `nextIcon`, `dropdownIcon` | |

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
    navButton: "p-2 rounded-full border shadow-sm bg-white border-gray-200 dark:bg-gray-700 dark:border-gray-600",
    pageButton: "w-9 h-9 rounded-full border shadow-sm flex items-center justify-center text-sm bg-white border-gray-200 dark:bg-gray-700 dark:border-gray-600",
    activePageButton: "w-9 h-9 rounded-full shadow-md flex items-center justify-center text-sm bg-blue-600 text-white",
    pageButtons: "flex items-center gap-1",
    prevIcon: "w-4 h-4",
    nextIcon: "w-4 h-4",
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
  showLabel="Afficher"
  rowsPerPageLabel="lignes"
  dropdownAriaLabel="Lignes par page"
  paginationAriaLabel="Navigation des pages"
  prevAriaLabel="Page précédente"
  nextAriaLabel="Page suivante"
  pageAriaLabel={(p) => `Page ${p}`}
/>
```

### Section reordering

```tsx
<Pagination sectionOrder={["nav", "pageInfo", "selector"]} />
```

---

## Accessibility

- `<nav aria-label="Pagination">` landmark (configurable via `paginationAriaLabel`)
- `aria-current="page"` on active page button
- Page buttons have configurable `aria-label` via `pageAriaLabel`
- Prev/next buttons properly disabled at boundaries
- Ellipsis elements marked `aria-hidden="true"`
- Rows dropdown: `role="listbox"` with `aria-controls`, `aria-expanded`, `aria-activedescendant`
- Keyboard: Tab between controls, Enter/Space to select, Arrow Up/Down in dropdown, Home/End for first/last, Escape to close
- All text labels customizable for i18n
- `role="status"` with `aria-live="polite"` for state announcements
- Instance-scoped IDs via `useId()` prevent collisions
- Extends native `HTMLAttributes` — accepts `id`, `className`, `style`, `data-*`, `aria-*`

---

## Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| Styles wrong after overriding one class | `classes` replaces per slot | Provide full class string for each slot |
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
| Custom row options | `title="Custom Row Options & Label"` | rowOptions, rowsPerPageLabel |
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
