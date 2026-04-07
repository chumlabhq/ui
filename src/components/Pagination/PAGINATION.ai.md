# Pagination

> Accessible pagination with page buttons, rows-per-page selector, ellipsis truncation, and responsive layout.

**Category:** Navigation
**Keywords:** pagination, pager, page navigation, rows per page, page selector, data table pagination

---

## Quick Answer

Use `<Pagination value={page} totalPages={10} onValueChange={setPage} />` for basic pagination. Add `showRowsPerPage` for a rows-per-page dropdown. Built-in styles include dark mode, keyboard navigation, and ARIA attributes.

---

## Import

```tsx
import { Pagination } from "@chumlab/ui/pagination";
```

---

## Basic Usage (copy-paste ready)

```tsx
import { Pagination } from "@chumlab/ui/pagination";
import { useState } from "react";

export default function Example() {
  const [page, setPage] = useState(1);
  return <Pagination value={page} totalPages={10} onValueChange={setPage} />;
}
```

---

## Prop Constraints

| Prop | Constraint |
|------|-----------|
| `value` + `onValueChange` | Controlled mode. Must provide both. |
| `totalPages` | Required. Total number of pages. |
| `showRowsPerPage` | Requires `rowsPerPage` and `onRowsPerPageChange`. |
| `visiblePageCount` | Number of page buttons shown (default 3). Remaining shown as ellipsis. |
| `sectionOrder` | Array to reorder sections: `["rows", "nav", "info"]`. |

---

## Accessibility

- `<nav>` landmark with `aria-label`
- `aria-current="page"` on active page button
- Keyboard navigation: Arrow keys in dropdown, Tab between controls
- Disabled prev/next buttons properly communicated
- Screen reader-friendly labels on all buttons

---

## Demo Reference

**File:** `src/pages/demo/PaginationDemo.tsx`

| Feature | Search for |
|---------|-----------|
| Minimal | `title="Basic Usage"` |
| Rows per page | `title="With Rows Per Page"` |
| Custom ellipsis | `title="Custom Ellipsis"` |
| Section order | `title="Section Order"` |
| Themes | `title="Custom Theme"` |

| File | Contains |
|------|----------|
| `Pagination.tsx` | Main component with forwardRef |
| `utils/types.ts` | PaginationProps, PaginationClasses |
| `utils/constants.ts` | DEFAULT + UNSTYLED classes, DEFAULT_ROW_OPTIONS |
