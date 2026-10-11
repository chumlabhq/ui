import type { ReactNode, CSSProperties } from "react";
import type {
  ColumnDef,
  Table as TanstackTable,
  SortingState,
  ColumnFiltersState,
  ColumnSizingState,
} from "@tanstack/react-table";

export type { SortingState, ColumnFiltersState, ColumnSizingState } from "@tanstack/react-table";

export interface IconProps {
  className?: string;
}

/** Captures current table state for saving/restoring views. */
export interface TableView {
  /** Current sorting state. */
  sorting?: SortingState;
  /** Current column filters. */
  columnFilters?: ColumnFiltersState;
  /** Column visibility map. */
  columnVisibility?: Record<string, boolean>;
  /** Column order array. */
  columnOrder?: string[];
  /** Column sizing state. */
  columnSizing?: ColumnSizingState;
  /** Global filter value. */
  globalFilter?: string;
  /** Group-by columns. */
  groupBy?: string[];
}

/** CSS class overrides for Table sub-elements. */
export interface TableClasses {
  /** Root container wrapping the entire table region. */
  root?: string;
  /** The `<table>` element itself. */
  list?: string;
  /** The `<thead>` element. */
  header?: string;
  /**
   * The `<tr>` inside `header`. Style `header` to reach the `<thead>` and this
   * to reach the row alone.
   */
  headerRow?: string;
  /** Individual `<th>` elements. */
  headerCell?: string;
  /** The content wrapper inside each header cell. */
  headerCellText?: string;
  /** The `<tbody>` element. */
  body?: string;
  /** Each `<tr>` in the body. */
  item?: string;
  /** Individual `<td>` elements. */
  cell?: string;
  /** Container for pinned columns. */
  pinnedRegion?: string;
  /** The `<table>` element for pinned columns. */
  pinnedList?: string;
  /** Container for unpinned (scrollable) columns. */
  scrollRegion?: string;
  /** The empty-state wrapper. */
  empty?: string;
  /** Pin icon (unpinned state). */
  pinIcon?: string;
  /** Pin button (unpinned state). */
  pinTrigger?: string;
  /** Shimmer container. */
  loading?: string;
  /** Shimmer row. */
  loadingRow?: string;
  /** Shimmer cell. */
  loadingItem?: string;
  /** Shimmer bar animation. */
  loadingBar?: string;
  /** Checkbox input for row selection. */
  control?: string;
  /** Sort direction indicator icon. */
  sortIcon?: string;
  /** Filter input field for column filters. */
  /** Filter icon button in header. */
  filterTrigger?: string;
  /** Filter dropdown container. */
  filterContent?: string;
  /**
   * The column-filter panel's parts. A selected row carries `data-selected`
   * rather than a second set of classes.
   */
  filterHeader?: string;
  /** The heading naming the column being filtered. */
  filterLabel?: string;
  /** The button dropping that column's filter. */
  filterClearTrigger?: string;
  /** One value row in the filter panel. */
  filterItem?: string;
  /** The checkbox on that row. */
  filterItemControl?: string;
  /** Expand/collapse icon button. */
  expandTrigger?: string;
  /** Right-pinned column container. */
  pinnedRightRegion?: string;
  /** The `<table>` element for right-pinned columns. */
  pinnedRightList?: string;
  /** Inline edit input field. A text field, so it takes the field boundary
   *  (`--cl-border-input`) and the field hover and focus treatment. */
  input?: string;
  /** Drag handle for row reordering. */
  dragHandle?: string;
  /** The `<tfoot>` element. */
  footer?: string;
  /** Search bar container above the table. */
  /**
   * The box around the search field. It shared `searchInput` with the <input>
   * inside it — the same split already made in CascadingDropdown,
   * SearchableDropdown and MultiSelectSearchableDropdown.
   */
  searchControl?: string;
  /**
   * The search box's icon and clear button. Both search boxes — the desktop
   * one and the mobile card one — render these, and which side the control sits
   * on is `data-side` on `searchControl` rather than a second set of classes.
   */
  searchIcon?: string;
  /** The button emptying the search field. */
  clearTrigger?: string;
  /** The search field itself. */
  searchInput?: string;
  /** Mobile card layout wrapper. */
  mobileCard?: string;
  /** Group header row. */
  groupLabel?: string;
  /** Column resize handle. */
  resizeHandle?: string;
  /**
   * The bar drawn inside `resizeHandle` while a column is being resized. Carries
   * `data-resizing` for the duration of the drag.
   */
  resizeIndicator?: string;
  /** Loading more indicator for infinite scroll. */
  loadingFooter?: string;
}

/**
 * Props for the Table component.
 *
 * @example
 * ```tsx
 * <Table columns={cols} data={rows} sortable />
 * ```
 */
export interface TableProps<TData> {
  columns?: ColumnDef<TData>[];
  data?: TData[];
  loading?: boolean;
  showHeader?: boolean;
  pinnedColumns?: string[];
  /** Fires when a pin button is pressed, with the full new `pinnedColumns` array: the column appended when pinned, removed when unpinned. */
  onPinnedColumnsChange?: (pinnedColumns: string[]) => void;
  pinnableColumns?: string[];
  maxPinnedColumns?: number;
  /** Fires as the pointer moves over the table, with its position relative to the root; `null` when it leaves. */
  onCursorPositionChange?: (position: { x: number; y: number } | null) => void;
  /** Fires with whether the pointer is over the header row. */
  onHeaderHoverChange?: (isOverHeader: boolean) => void;
  emptyContent?: ReactNode;
  /** The grid's accessible name; pinned parts append " - Pinned columns" and so on. Default: `"Data table"`. */
  "aria-label"?: string;
  /** The region's id. */
  id?: string;
  /** Ids of the elements that name the region; wins over `aria-label`. */
  "aria-labelledby"?: string;
  /** Ids of the elements that describe the region. */
  "aria-describedby"?: string;
  /** Accessible caption for the table, rendered as a visually hidden <caption> element. */
  caption?: string;
  getRowId?: (row: TData) => string;
  selectedRowId?: string | null;
  onRowClick?: (rowData: TData) => void;
  onRowHover?: (
    rowIndex: number | null,
    rowRef?: React.RefObject<HTMLTableRowElement>,
  ) => void;
  floatingActions?: ReactNode;
  floatingActionsHovered?: boolean;
  /** Set while a popup opened from `floatingActions` is open, so the hovered row and cursor tracking hold still. */
  popupOpen?: boolean;
  maxWidth?: string | number;
  maxHeight?: string | number;
  minHeight?: string | number;
  hideVerticalScrollbar?: boolean;
  hideHorizontalScrollbar?: boolean;
  stickyHeader?: boolean;
  /** CSS class overrides for table sub-elements. Preferred over individual className props. */
  classes?: TableClasses;
  /** Removes all default styling. */
  unstyled?: boolean;
  /** Inline styles applied to the root container. */
  style?: CSSProperties;
  /** Replaces the pin button's glyph. Rendered as given; also used for pinned columns unless `pinnedIcon` is set. */
  pinIcon?: ReactNode;
  /** Replaces the pin button's glyph on a pinned column. Rendered as given. */
  pinnedIcon?: ReactNode;
  shimmerCount?: number;
  className?: string;
  children?: ReactNode;

  /** Enable column sorting. */
  sortable?: boolean;
  /** Callback when sorting state changes. */
  onSortingChange?: (sorting: SortingState) => void;
  /** Controlled sorting state. */
  sorting?: SortingState;
  /** When true, sorting is handled server-side; the table will not sort data locally. */
  manualSorting?: boolean;

  /** Row selection mode. Defaults to "none". */
  selectionMode?: "single" | "multiple" | "none";
  /** Array of selected row IDs (controlled). */
  selectedRowIds?: string[];
  /** Fires with the new `selectedRowIds` when selection changes. */
  onSelectedRowIdsChange?: (selectedRowIds: string[]) => void;
  /** Whether the header "select all" checkbox selects all rows on the current page or all rows. Defaults to "page". */
  selectAllMode?: "page" | "all";

  /** Global filter value for searching across all columns. */
  globalFilter?: string;
  /** Callback when the global filter value changes. */
  onGlobalFilterChange?: (value: string) => void;

  /** Controlled column filters state. */
  columnFilters?: ColumnFiltersState;
  /** Callback when column filters change. */
  onColumnFiltersChange?: (filters: ColumnFiltersState) => void;
  /** Enable per-column filtering. */
  filterable?: boolean;
  /** Columns that should show a filter icon in the header. Maps column ID to filter options. */
  filterableColumns?: Record<string, { options: { label: string; value: string }[]; multi?: boolean }>;
  /** Draws the column filter button's icon. `active` is true while the column has a filter applied. */
  renderFilterIcon?: (state: { active: boolean; className: string }) => ReactNode;
  /** Render custom filter dropdown content for a column. Receives column ID, current values, and setter. */
  renderColumnFilter?: (columnId: string, currentValues: string[], setValues: (values: string[]) => void) => ReactNode;

  /** Enable row expansion. */
  expandable?: boolean;
  /** Array of expanded row IDs (controlled). */
  expandedRowIds?: string[];
  /** Fires with the new `expandedRowIds` when a row expands or collapses. */
  onExpandedRowIdsChange?: (expandedRowIds: string[]) => void;
  /** Render function for expanded row content. */
  renderExpandedRow?: (row: TData) => ReactNode;
  /** Draws the row expand button's icon, which can change with `expanded` (a plus that becomes a minus). */
  renderExpandIcon?: (state: { expanded: boolean; className: string }) => ReactNode;
  /** Which end of the row the expand column sits at. `start` is the first column. Defaults to `"start"`. */
  expandColumnPosition?: "start" | "end";
  /** Make the entire row clickable to toggle expansion instead of just the icon. */
  expandOnRowClick?: boolean;

  /** Controlled column visibility. Keys are column IDs, values indicate visibility. */
  columnVisibility?: Record<string, boolean>;
  /** Callback when column visibility changes. */
  onColumnVisibilityChange?: (visibility: Record<string, boolean>) => void;

  /** Alternate row background colors. */
  striped?: boolean;
  /** Custom class for striped (alternating) rows. Overrides the default bg-gray-50. */
  stripedClassName?: string;

  /** Cell padding and text size. Defaults to `"md"`. */
  size?: "sm" | "md" | "lg";

  /** Column IDs to pin to the right side of the table. */
  pinnedRightColumns?: string[];

  /** Enable inline cell editing: double-click a cell, or press Enter or F2 on it. */
  editable?: boolean;
  /** Column IDs that are editable. If not set, all columns are editable when `editable` is true. */
  editableColumns?: string[];
  /** Callback when a cell value is edited. */
  onCellEdit?: (rowId: string, columnId: string, value: unknown) => void;

  /** Enable column resizing via drag handles. */
  resizable?: boolean;
  /** Controlled column sizing state. */
  columnSizing?: ColumnSizingState;
  /** Callback when column sizing changes. */
  onColumnSizingChange?: (sizing: ColumnSizingState) => void;

  /** When true, pagination is handled server-side. */
  manualPagination?: boolean;
  /** When true, filtering is handled server-side; the table will not filter data locally. */
  manualFiltering?: boolean;

  /** Controlled column order (array of column IDs). */
  columnOrder?: string[];
  /** Callback when column order changes. */
  onColumnOrderChange?: (order: string[]) => void;

  /** Enable row drag-and-drop reordering. */
  reorderable?: boolean;
  /** Callback when a row is reordered. */
  onRowReorder?: (fromIndex: number, toIndex: number) => void;
  /** Which end of the row the drag handle column sits at. Defaults to `"start"`. */
  dragColumnPosition?: "start" | "end";

  /** Show the table footer (tfoot). */
  showFooter?: boolean;
  /**
   * Custom footer content for `<tfoot>`. Rows — a `<tr>`, a fragment of `<tr>`s
   * or an array of them — render directly in `<tfoot>`; anything else (text, or
   * any other element) is placed in one full-width row.
   */
  footerContent?: ReactNode;

  /** Callback on right-click of a row. */
  onContextMenu?: (event: React.MouseEvent, row: TData) => void;

  /** Enable single-click cell copy to clipboard. */
  copyOnClick?: boolean;
  /** Callback after a cell value is copied. */
  onCellCopy?: (value: string, rowId: string, columnId: string) => void;

  /** Enable infinite scroll loading. */
  infiniteScroll?: boolean;
  /** Callback when user scrolls near the bottom. */
  onLoadMore?: () => void;
  /** Whether there is more data to load. */
  hasMore?: boolean;
  /** Whether more data is currently being loaded. */
  loadingMore?: boolean;
  /** Content shown when all data is loaded (hasMore is false). */
  infiniteEndContent?: ReactNode;

  /** Viewport width below which the table renders as card layout. */
  responsiveBreakpoint?: number;
  /** Render function for mobile card layout. */
  renderMobileCard?: (row: TData) => ReactNode;

  /** Column IDs to group rows by. */
  groupBy?: string[];
  /** Callback when group-by columns change. */
  onGroupByChange?: (groupBy: string[]) => void;

  /** Show a built-in search bar above the table. */
  showSearch?: boolean;
  /** Placeholder text for the search bar. */
  searchPlaceholder?: string;
  /** Which end of the search field the icon sits at, or `"none"`. Defaults to `"start"`. */
  searchIconPosition?: "start" | "end" | "none";

  /** Draws the multi-row selection checkboxes in place of the native box. */
  renderCheckboxIcon?: (state: { checked: boolean; indeterminate: boolean; className?: string }) => ReactNode;
  /** Simple color customization for the default checkbox. */
  checkboxColor?: string;
  /** Replaces the drag handle's glyph. Rendered as given. */
  dragHandleIcon?: ReactNode;
  /** Replaces the search field's magnifier. Rendered inside a box carrying `classes.searchIcon`, which positions it in the field. */
  searchIcon?: ReactNode;
  /** Callback when the search clear button is clicked. */
  onSearchClear?: () => void;

  /** Custom content for the loading more indicator in infinite scroll. */
  loadingMoreContent?: ReactNode;
}

export interface TableContextValue<TData> {
  table: TanstackTable<TData>;
  pinnedColumnIds: string[];
  focusedCell: { row: number; col: number } | null;
  setFocusedCell: (cell: { row: number; col: number } | null) => void;
  onRowHover?: (
    rowIndex: number | null,
    rowRef?: React.RefObject<HTMLTableRowElement>,
  ) => void;
  onRowClick?: (rowData: TData) => void;
  getRowId?: (row: TData) => string;
  selectedRowId?: string | null;
  floatingActionsHovered?: boolean;
  popupOpen?: boolean;
  headerCellClassName?: string;
  cellClassName?: string;
  rowClassName?: string;
  selectedRowClassName?: string;
}

export interface TableShimmerProps {
  rowCount?: number;
  className?: string;
  rowClassName?: string;
  cellClassName?: string;
  shimmerClassName?: string;
}

export type SortDirection = "asc" | "desc" | false;

export interface ColumnMeta {
  accessorKey?: string;
}
