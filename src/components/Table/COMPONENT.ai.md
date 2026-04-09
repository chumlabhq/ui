# Table

> A feature-rich data table with sorting, filtering, selection, pinned columns, row expansion, drag-and-drop, inline editing, column resizing, infinite scroll, and full style customization. Built on TanStack Table.

**Category:** Display
**Keywords:** table, data table, grid, sorting, filtering, selection, pinned columns, row expansion, drag and drop, column resize, infinite scroll, pagination, CSV export

---

## Quick Answer

Use `<Table columns={[...]} data={[...]} />` for a data table. Built on TanStack Table with built-in sorting, row selection, column pinning, row expansion, drag-and-drop reordering, inline editing, column resizing, infinite scroll, search, and CSV export. Pair with `<Pagination>` for paged data. Works out-of-the-box with built-in Tailwind styles.

---

## Import

```tsx
import { Table } from "@chumlab/ui/table";
import { Pagination } from "@chumlab/ui/pagination";
import type { ColumnDef } from "@tanstack/react-table";
```

---

## Basic Usage (copy-paste ready)

```tsx
import { Table } from "@chumlab/ui/table";
import type { ColumnDef } from "@tanstack/react-table";

interface User { name: string; email: string; }

const columns: ColumnDef<User>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
];

const data: User[] = [
  { name: "Alice", email: "alice@example.com" },
  { name: "Bob", email: "bob@example.com" },
];

export default function Example() {
  return <Table columns={columns} data={data} />;
}
```

---

## Prop Constraints (critical for correct usage)

| Prop | Constraint |
|------|-----------|
| `columns` + `data` | **Required.** TanStack `ColumnDef<TData>[]` and `TData[]`. |
| `sortable` | Enables column sorting. Combine with `onSortingChange` for controlled. |
| `manualSorting` | When true, sorting is server-side; table won't sort locally. |
| `pinnedColumns` | Array of column IDs to pin left. Requires `onPinColumn` for interactive. |
| `expandable` + `renderExpandedRow` | Both needed for row expansion. |
| `draggable` + `onReorder` | Both needed for drag-and-drop row reordering. |
| `editable` + `onCellEdit` | Both needed for inline cell editing. |
| `resizable` | Enables column resize handles. |
| `stickyHeader` | Requires `maxHeight` to be meaningful. |
| `infiniteScroll` + `onLoadMore` + `hasMore` | All three for infinite scroll. |
| `globalSearch` | Enables built-in search bar. |
| `classes` | Per-slot class overrides. **Replaces** per slot, not additive. |

---

## Data Attributes (for CSS selectors and testing)

- `data-clickable` — on rows when `onRowClick` is provided
- `data-striped` — on alternating rows when `striped` is enabled
- `data-selected` — on selected rows
- `data-dragging` — on dragged row during reorder
- `data-expanded` — on expanded rows

DOM nesting: `container > flex(pinned + unpinned(overflow-x-auto) + pinnedRight) > table > thead > tr > th + tbody > tr > td`

---

## Styling Guide

### How class merging works

1. **Default** — uses `DEFAULT_TABLE_CLASSES`
2. **Partial override** — **replaces** per slot, not additive
3. **Unstyled** — all slots empty, you build from scratch

### Key slots

| "I want to change..." | Slot to use |
|------------------------|-------------|
| Root container | `container` |
| Table element | `table` |
| Header row/cell | `headerRow`, `headerCell` |
| Body row/cell | `row`, `cell` |
| Selected row | `selectedRow` |
| Pinned columns | `pinnedContainer`, `pinnedTable` |
| Scrollable area | `unpinnedContainer` (has `overflow-x-auto`) |
| Empty state | `empty` |
| Shimmer loading | `shimmer`, `shimmerRow`, `shimmerCell`, `shimmerBar` |
| Search bar | `searchBar`, `searchInput` |

### Responsive behavior

The table uses a flex layout with `overflow-x-auto` on the unpinned container, allowing horizontal scroll on mobile. Cell content uses `whitespace-nowrap` by default.

### Dark mode

Defaults use Tailwind `dark:` prefix. When overriding, always provide both variants.

---

## Patterns

### With pagination

```tsx
const [page, setPage] = useState(1);
const [rows, setRows] = useState(10);
const paginatedData = data.slice((page - 1) * rows, page * rows);
<Table columns={columns} data={paginatedData} />
<Pagination value={page} totalPages={Math.ceil(data.length / rows)} onValueChange={setPage} />
```

### Sortable with controlled state

```tsx
const [sorting, setSorting] = useState<SortingState>([]);
<Table columns={columns} data={data} sortable sorting={sorting} onSortingChange={setSorting} />
```

### Row selection

```tsx
<Table columns={columns} data={data} selectable onSelectionChange={(rows) => console.log(rows)} />
```

### Column pinning

```tsx
<Table columns={columns} data={data} pinnedColumns={["name"]} onPinColumn={(id, pinned) => ...} />
```

---

## Accessibility

- `role="columnheader"` with `aria-sort` on sortable headers
- `role="gridcell"` on body cells
- `role="checkbox"` with `aria-checked` (including "mixed") on selection checkboxes
- `aria-label` on sort, filter, select, expand, and drag buttons
- `role="separator"` on column resize handles
- Keyboard: Tab between interactive elements

---

## Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| Styles wrong after overriding one class | `classes` replaces per slot | Provide full class string |
| Table overflows on mobile | Many columns | Default `unpinnedContainer` has `overflow-x-auto` |
| Sorting not working | `sortable` not set | Add `sortable` prop |
| Server-side sort not triggering | Missing `manualSorting` | Set `manualSorting={true}` |
| Pinned columns not scrolling | Expected behavior | Pinned columns stay fixed; unpinned scroll |
| Row expansion not showing | Missing `renderExpandedRow` | Provide render function |
| Drag handle not showing | Missing `draggable` | Add `draggable` prop |

---

## Demo Reference

**File:** `src/pages/demo/TableDemo.tsx`

| Feature | Search for |
|---------|-----------|
| Basic | `title="Basic Usage"` |
| Row selection | `title="With Row Selection"` |
| Floating actions | `title="With Floating Actions"` |
| Pinned columns | `title="With Pinned Columns"` |
| Pagination | `title="With Pagination"` |
| Horizontal scroll | `title="Horizontal Scroll"` |
| Sticky header | `title="Sticky Header"` |
| Loading/shimmer | `title="Loading State"` |
| Empty state | `title="Empty State"` |
| Sorting | `title="Column Sorting"` |
| Checkbox selection | `title="Multi-Row Selection"` |
| Global search | `title="Global Search"` |
| Row expansion | `title="Row Expansion"` |
| Column visibility | `title="Column Visibility"` |
| Striped rows | `title="Striped Rows"` |
| Density modes | `title="Density Modes"` |
| Column resizing | `title="Column Resizing"` |
| Inline editing | `title="Inline Cell Editing"` |
| CSV export | `title="CSV Export"` |
| Drag & drop | `title="Row Drag & Drop"` |
| Footer/summary | `title="Footer / Summary Row"` |
| Context menu | `title="Context Menu"` |
| Infinite scroll | `title="Infinite Scroll"` |
| Built-in search | `title="Built-in Search Bar"` |

### Source file index

| File | Contains |
|------|----------|
| `Table.tsx` | Main component (2000+ lines), all features |
| `constants.ts` | DEFAULT + UNSTYLED class maps |
| `utils/types.ts` | TableProps, TableClasses, TableView, re-exports from TanStack |
| `utils.ts` | getColumnId, getSortDirection, exportTableToCSV, copyToClipboard |
| `TableShimmer.tsx` | Loading skeleton component |
| `icons.tsx` | Sort, Pin, Expand, Drag, Search, Filter icons |
| `index.ts` | Public exports |
| `__tests__/` | Unit tests |
