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
| `pinnedColumns` | Array of column IDs to pin left. Requires `onPinnedColumnsChange` for interactive. |
| `expandable` + `renderExpandedRow` | Both needed for row expansion. |
| `enableRowDragDrop` + `onRowReorder` | Both needed for drag-and-drop row reordering. |
| `editable` + `onCellEdit` | Both needed for inline cell editing. |
| `enableColumnResizing` | Enables column resize handles. |
| `stickyHeader` | Requires `maxHeight` to be meaningful. |
| `enableInfiniteScroll` + `onLoadMore` + `hasMore` | All three for infinite scroll. |
| `showSearch` | Enables built-in search bar. |
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

## All Props

<!-- generated from Table.schema.json — edit the schema, not this table -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | array | — | TanStack ColumnDef array defining table columns. |
| `data` | array | — | Array of row data objects. |
| `loading` | boolean | `false` | Whether the table is in a loading state showing shimmer rows. |
| `showHeader` | boolean | `true` | Whether to show the table header row. |
| `pinnedColumns` | array | — | Column IDs to pin to the left side. |
| `onPinnedColumnsChange` | object | — | (pinnedColumns: string[]) => void — Fires when a pin button is pressed, with the full new `pinnedColumns` array: the column appended when pinned, removed when unpinned. |
| `pinnableColumns` | array | — | Column IDs that are allowed to be pinned. |
| `maxPinnedColumns` | number | `3` | Maximum number of columns that can be pinned simultaneously. |
| `onCursorPositionChange` | object | — | (position: { x: number; y: number } \| null) => void — Fires as the pointer moves over the table, with its position relative to the root; `null` when it leaves. |
| `onHeaderHoverChange` | object | — | (isOverHeader: boolean) => void — Fires with whether the pointer is over the header row. |
| `emptyContent` | object | — | React.ReactNode — Content shown when the table has no data. |
| `ariaLabel` | string | `"Data table"` | Accessible label for the table. |
| `caption` | string | — | Accessible caption rendered as a visually hidden <caption> element. |
| `getRowId` | object | — | (row: TData) => string — Function to derive a unique row ID. |
| `selectedRowId` | string \| null | — | ID of the currently selected row (single selection). |
| `onRowClick` | object | — | (rowData: TData) => void — Callback fired when a row is clicked. |
| `onRowHover` | object | — | (rowIndex: number \| null, rowRef?: React.RefObject) => void — Callback fired when a row is hovered. |
| `floatingActions` | object | — | React.ReactNode — Floating action elements displayed on row hover. |
| `isFloatingActionsHovered` | boolean | `false` | Whether the floating actions area is being hovered. |
| `popupOpen` | boolean | `false` | Set while a popup opened from `floatingActions` is open, so the hovered row and cursor tracking hold still. |
| `maxWidth` | string \| number | — | Maximum width of the table container. |
| `maxHeight` | string \| number | — | Maximum height of the table container. |
| `minHeight` | string \| number | — | Minimum height of the table container. |
| `hideVerticalScrollbar` | boolean | `false` | Whether to hide the vertical scrollbar. |
| `hideHorizontalScrollbar` | boolean | `false` | Whether to hide the horizontal scrollbar. |
| `stickyHeader` | boolean | `false` | Whether the header row sticks to the top when scrolling. |
| `classes` | object | — | CSS class overrides for table sub-elements. |
| `unstyled` | boolean | `false` | Removes all default styling. |
| `style` | object | — | Inline styles applied to the root container. |
| `PinIcon` | object | — | React.ComponentType — Custom pin icon component (unpinned state). |
| `PinnedIcon` | object | — | React.ComponentType — Custom pin icon component (pinned state). |
| `shimmerRowCount` | number | `10` | Number of shimmer rows to display while loading. |
| `className` | string | — | CSS class for the root element. |
| `children` | object | — | React.ReactNode — Child elements. |
| `sortable` | boolean | `false` | Enable column sorting. |
| `onSortingChange` | object | — | (sorting: SortingState) => void — Callback when sorting state changes. |
| `sorting` | array | — | Controlled sorting state. |
| `manualSorting` | boolean | `false` | When true, sorting is handled server-side. |
| `selectionMode` | `"single"` \| `"multiple"` \| `"none"` | `"none"` | Row selection mode. |
| `selectedRowIds` | array | — | Array of selected row IDs (controlled). |
| `onSelectedRowIdsChange` | object | — | (selectedRowIds: string[]) => void — Fires with the new `selectedRowIds` when selection changes. |
| `selectAllMode` | `"page"` \| `"all"` | `"page"` | Whether select-all selects current page or all rows. |
| `globalFilter` | string | — | Global filter value for searching across all columns. |
| `onGlobalFilterChange` | object | — | (value: string) => void — Callback when global filter changes. |
| `columnFilters` | array | — | Controlled column filters state. |
| `onColumnFiltersChange` | object | — | (filters: ColumnFiltersState) => void — Callback when column filters change. |
| `enableColumnFilters` | boolean | `false` | Enable per-column filtering. |
| `filterableColumns` | object | — | Map of column ID to filter options configuration. |
| `FilterIcon` | object | — | React.ComponentType — Custom filter icon component. |
| `renderColumnFilter` | object | — | (columnId: string, currentValues: string[], setValues: (values: string[]) => void) => ReactNode — Custom filter dropdown renderer. |
| `expandable` | boolean | `false` | Enable row expansion. |
| `expandedRowIds` | array | — | Array of expanded row IDs (controlled). |
| `onExpandedRowIdsChange` | object | — | (expandedRowIds: string[]) => void — Fires with the new `expandedRowIds` when a row expands or collapses. |
| `renderExpandedRow` | object | — | (row: TData) => ReactNode — Render function for expanded row content. |
| `ExpandIcon` | object | — | React.ComponentType — Custom expand icon component. |
| `expandColumnPosition` | `"left"` \| `"right"` | `"left"` | Position of the expand column. |
| `expandOnRowClick` | boolean | `false` | Make the entire row clickable to toggle expansion. |
| `columnVisibility` | object | — | Controlled column visibility map (column ID to boolean). |
| `onColumnVisibilityChange` | object | — | (visibility: Record<string, boolean>) => void — Callback when column visibility changes. |
| `striped` | boolean | `false` | Alternate row background colors. |
| `stripedClassName` | string | — | Custom CSS class for striped rows. |
| `density` | `"compact"` \| `"comfortable"` \| `"spacious"` | `"comfortable"` | Controls cell padding density. |
| `pinnedRightColumns` | array | — | Column IDs to pin to the right side. |
| `editable` | boolean | `false` | Enable inline cell editing: double-click a cell, or press Enter or F2 on it. |
| `editableColumns` | array | — | Column IDs that are editable. |
| `onCellEdit` | object | — | (rowId: string, columnId: string, value: unknown) => void — Callback when a cell value is edited. |
| `enableColumnResizing` | boolean | `false` | Enable column resizing via drag handles. |
| `columnSizing` | object | — | Controlled column sizing state. |
| `onColumnSizingChange` | object | — | (sizing: ColumnSizingState) => void — Callback when column sizing changes. |
| `manualPagination` | boolean | `false` | When true, pagination is handled server-side. |
| `manualFiltering` | boolean | `false` | When true, filtering is handled server-side. |
| `columnOrder` | array | — | Controlled column order (array of column IDs). |
| `onColumnOrderChange` | object | — | (order: string[]) => void — Callback when column order changes. |
| `enableRowDragDrop` | boolean | `false` | Enable row drag-and-drop reordering. |
| `onRowReorder` | object | — | (fromIndex: number, toIndex: number) => void — Callback when a row is reordered. |
| `dragColumnPosition` | `"left"` \| `"right"` | `"left"` | Position of the drag handle column. |
| `showFooter` | boolean | `false` | Show the table footer. |
| `footerContent` | object | — | React.ReactNode — Custom footer content for <tfoot>. Rows (a <tr>, a fragment of <tr>s, or an array of them) render directly in <tfoot>; anything else (text, or any other element) is placed in one full-width row. |
| `onContextMenu` | object | — | (event: React.MouseEvent, row: TData) => void — Callback on right-click of a row. |
| `enableCopyOnClick` | boolean | `false` | Enable single-click cell copy to clipboard. |
| `onCellCopy` | object | — | (value: string, rowId: string, columnId: string) => void — Callback after a cell value is copied. |
| `enableInfiniteScroll` | boolean | `false` | Enable infinite scroll loading. |
| `onLoadMore` | object | — | () => void — Callback when user scrolls near the bottom. |
| `hasMore` | boolean | `false` | Whether there is more data to load. |
| `loadingMore` | boolean | `false` | Whether more data is currently being loaded. |
| `infiniteEndContent` | object | — | React.ReactNode — Content shown when all data is loaded. |
| `responsiveBreakpoint` | number | — | Viewport width below which the table renders as card layout. |
| `renderMobileCard` | object | — | (row: TData) => ReactNode — Render function for mobile card layout. |
| `groupBy` | array | — | Column IDs to group rows by. |
| `onGroupByChange` | object | — | (groupBy: string[]) => void — Callback when group-by columns change. |
| `showSearch` | boolean | `false` | Show a built-in search bar above the table. |
| `searchPlaceholder` | string | `"Search..."` | Placeholder text for the search bar. |
| `searchIconPosition` | `"left"` \| `"right"` \| `"none"` | `"left"` | Position of the search icon. |
| `CheckboxIcon` | object | — | React.ComponentType — Custom checkbox component for multi-row selection. |
| `checkboxColor` | string | — | Simple color customization for the default checkbox. |
| `DragHandleIcon` | object | — | React.ComponentType — Custom drag handle icon component. |
| `SearchIcon` | object | — | React.ComponentType — Custom search icon component. |
| `onSearchClear` | object | — | () => void — Callback when the search clear button is clicked. |
| `loadingMoreContent` | object | — | React.ReactNode — Custom content for the loading more indicator. |

## Styling Guide

> **A plain utility replaces the library's for that property, in every state.**
> `classes={{ slot: "text-red-500" }}` drops the library's `hover:text-…` and
> `data-[state=…]:text-…` on that slot as well — otherwise they would sit beside
> your class and win in their own state, leaving your override in the DOM and
> inert. Pass your own variant to keep one: `"text-red-500 hover:text-red-400"`.
> A variant YOU pass is never dropped.

### How class merging works

1. **Default** — uses `DEFAULT_TABLE_CLASSES`
2. **Partial override** — **replaces** per slot, not additive
3. **Unstyled** — all slots empty, you build from scratch

### Key slots

| "I want to change..." | Slot to use |
|------------------------|-------------|
| Root container | `root` |
| Table element | `list` |
| Header row/cell | `header`, `headerCell` |
| Body row/cell | `item`, `cell` |
| Selected row | `selectedRow` |
| Pinned columns | `pinnedRegion`, `pinnedList` |
| Scrollable area | `scrollRegion` (has `overflow-x-auto`) |
| Empty state | `empty` |
| Shimmer loading | `loading`, `loadingRow`, `loadingItem`, `loadingBar` |
| Search bar | `searchInput`, `searchInput` |

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
<Table columns={columns} data={data} selectionMode="multiple" onSelectedRowIdsChange={(rows) => console.log(rows)} />
```

### Column pinning

```tsx
const [pinned, setPinned] = useState<string[]>(["name"]);

<Table columns={columns} data={data} pinnableColumns={["name", "email"]} pinnedColumns={pinned} onPinnedColumnsChange={setPinned} />
```

---

## Keyboard Interactions

Cell navigation is on the grid itself; the controls inside a cell keep their own behaviour.

| Key | Behaviour |
|-----|-----------|
| `Tab` | Moves between the interactive elements — search, filter triggers, resize handles, the controls in a cell. |
| `ArrowLeft`, `ArrowRight` | Moves the focused cell along a row. `ArrowUp`/`ArrowDown` move down a column. |
| `Home`, `End` | Moves to the first or last cell in the row. |
| `Ctrl+Home`, `Ctrl+End` | Moves to the first cell in the first row, or the last cell in the last row. The header row is not part of this navigation: its sort, filter and pin buttons are reached with `Tab`. |
| `Enter` | Opens the focused control: a filter dialog, or an editable cell when `editable` is set. In the editor, commits the edit and returns focus to the cell. |
| `F2` | Opens the focused cell's editor when `editable` is set. |
| `Escape` | Closes the filter dialog and returns focus to its trigger, or abandons an edit in progress and returns focus to the cell. Always: there is no prop to turn it off, because the APG dialog pattern requires Escape to close the filter dialog. |
| `ArrowLeft`, `ArrowRight` on a resize handle | Resizes the column in steps, so column widths are reachable without a drag (SC 2.5.7). |

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
| Table overflows on mobile | Many columns | Default `scrollRegion` has `overflow-x-auto` |
| Sorting not working | `sortable` not set | Add `sortable` prop |
| Server-side sort not triggering | Missing `manualSorting` | Set `manualSorting={true}` |
| Pinned columns not scrolling | Expected behavior | Pinned columns stay fixed; unpinned scroll |
| Row expansion not showing | Missing `renderExpandedRow` | Provide render function |
| Drag handle not showing | Missing `enableRowDragDrop` | Add `enableRowDragDrop` prop |

---

## Demo Reference

**File:** `src/pages/demo/TableDemo.tsx`

| Feature | Search for |
|---------|-----------|
| Basic | `title="Basic Usage"` |
| Row selection | `title="With Row Selection"` |
| Floating actions | `title="With Floating Actions"` |
| Pinned columns | `title="With Pinned Columns (Interactive)"` |
| Pagination | `title="With Pagination"` |
| Horizontal scroll | `title="Horizontal Scroll (Many Columns)"` |
| Sticky header | `title="Sticky Header"` |
| Loading/shimmer | `title="Loading State"` |
| Empty state | `title="Empty State (Fully Customizable)"` |
| Sorting | `title="Column Sorting"` |
| Checkbox selection | `title="Multi-Row Selection (Checkboxes)"` |
| Global search | `title="Global Search (Basic)"` |
| Row expansion | `title="Row Expansion"` |
| Column visibility | `title="Column Visibility (Toggle Checkboxes)"` |
| Striped rows | `title="Striped Rows (Default)"` |
| Density modes | `title="Density Modes"` |
| Column resizing | `title="Column Resizing (Basic)"` |
| Inline editing | `title="Inline Cell Editing"` |
| CSV export | `title="CSV Export"` |
| Drag & drop | `title="Row Drag & Drop (Default)"` |
| Footer/summary | `title="Footer / Summary Row"` |
| Context menu | `title="Context Menu"` |
| Infinite scroll | `title="Infinite Scroll"` |
| Built-in search | `title="Built-in Search Bar (Default)"` |

### Source file index

| File | Contains |
|------|----------|
| `Table.tsx` | Main component (2000+ lines), all features |
| `constants.ts` | DEFAULT + UNSTYLED class maps |
| `utils/types.ts` | TableProps, TableClasses, TableView, re-exports from TanStack |
| `utils.ts` | getColumnId, getSortDirection, exportTableToCSV, copyToClipboard |
| `FilterPanel.tsx` | The column-filter dialog, loaded on demand: it is portalled, it only exists after a filter is opened, and it owns its own focus, positioning and dismissal |
| `TableShimmer.tsx` | Loading skeleton component |
| `icons.tsx` | Sort, Pin, Expand, Drag, Search, Filter icons |
| `index.ts` | Public exports |
| `__tests__/` | Unit tests |
