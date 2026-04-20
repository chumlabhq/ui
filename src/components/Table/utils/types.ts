import type { ReactNode, ComponentType, CSSProperties } from "react";
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
  container?: string;
  /** The `<table>` element itself. */
  table?: string;
  /** The `<thead>` element. */
  header?: string;
  /** The `<tr>` inside `<thead>`. */
  headerRow?: string;
  /** Individual `<th>` elements. */
  headerCell?: string;
  /** Applied on header cell hover. */
  headerCellHover?: string;
  /** The content wrapper inside each header cell. */
  headerCellContent?: string;
  /** The `<tbody>` element. */
  body?: string;
  /** Each `<tr>` in the body. */
  row?: string;
  /** Individual `<td>` elements. */
  cell?: string;
  /** Applied to a selected row. */
  selectedRow?: string;
  /** Container for pinned columns. */
  pinnedContainer?: string;
  /** The `<table>` element for pinned columns. */
  pinnedTable?: string;
  /** Container for unpinned (scrollable) columns. */
  unpinnedContainer?: string;
  /** The `<table>` element for unpinned columns. */
  unpinnedTable?: string;
  /** The empty-state wrapper. */
  empty?: string;
  /** Pin icon (unpinned state). */
  pinIcon?: string;
  /** Pin icon hover. */
  pinIconHover?: string;
  /** Pin icon (pinned state). */
  pinnedPinIcon?: string;
  /** Pin icon hover (pinned state). */
  pinnedPinIconHover?: string;
  /** Pin button (unpinned state). */
  pinButton?: string;
  /** Pin button (pinned state). */
  pinnedPinButton?: string;
  /** Shimmer container. */
  shimmer?: string;
  /** Shimmer row. */
  shimmerRow?: string;
  /** Shimmer cell. */
  shimmerCell?: string;
  /** Shimmer bar animation. */
  shimmerBar?: string;
  /** Checkbox input for row selection. */
  checkbox?: string;
  /** Checkbox cell (td/th) wrapper. */
  checkboxCell?: string;
  /** Sort direction indicator icon. */
  sortIcon?: string;
  /** Filter input field for column filters. */
  filterInput?: string;
  /** Filter icon button in header. */
  filterIcon?: string;
  /** Filter dropdown container. */
  filterDropdown?: string;
  /** Expand/collapse icon button. */
  expandIcon?: string;
  /** Expanded row content container. */
  expandedRow?: string;
  /** Right-pinned column container. */
  pinnedRightContainer?: string;
  /** The `<table>` element for right-pinned columns. */
  pinnedRightTable?: string;
  /** Inline edit input field. */
  editInput?: string;
  /** Drag handle for row reordering. */
  dragHandle?: string;
  /** The `<tfoot>` element. */
  footer?: string;
  /** Search bar container above the table. */
  searchBar?: string;
  /** Mobile card layout wrapper. */
  mobileCard?: string;
  /** Group header row. */
  groupHeader?: string;
  /** Column resize handle. */
  resizeHandle?: string;
  /** Loading more indicator for infinite scroll. */
  loadingMore?: string;
  /** Search input element inside the search bar. */
  searchInput?: string;
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
  COLUMNS?: ColumnDef<TData>[];
  COLUMNS_DATA?: TData[];
  loading?: boolean;
  showHeader?: boolean;
  tableHeader?: boolean;
  pinnedColumns?: string[];
  onPinColumn?: (columnId: string, isPinned: boolean) => void;
  pinnableColumns?: string[];
  maxPinnedColumns?: number;
  onCursorPosition?: (position: { x: number; y: number } | null) => void;
  onCursorOverHeader?: (isOverHeader: boolean) => void;
  emptyContent?: ReactNode;
  ariaLabel?: string;
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
  isFloatingActionsHovered?: boolean;
  isPopupOpen?: boolean;
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
  PinIcon?: ComponentType<IconProps>;
  PinnedIcon?: ComponentType<IconProps>;
  shimmerRowCount?: number;
  className?: string;
  children?: ReactNode;

  // ── Sorting ──────────────────────────────────────────────────────────
  /** Enable column sorting. */
  sortable?: boolean;
  /** Callback when sorting state changes. */
  onSortingChange?: (sorting: SortingState) => void;
  /** Controlled sorting state. */
  sorting?: SortingState;
  /** When true, sorting is handled server-side; the table will not sort data locally. */
  manualSorting?: boolean;

  // ── Multi-Row Selection ──────────────────────────────────────────────
  /** Row selection mode. Defaults to "none". */
  selectionMode?: "single" | "multiple" | "none";
  /** Array of selected row IDs (controlled). */
  selectedRowIds?: string[];
  /** Callback when selection changes. */
  onSelectionChange?: (selectedIds: string[]) => void;
  /** Whether the header "select all" checkbox selects all rows on the current page or all rows. Defaults to "page". */
  selectAllMode?: "page" | "all";

  // ── Global Search ────────────────────────────────────────────────────
  /** Global filter value for searching across all columns. */
  globalFilter?: string;
  /** Callback when the global filter value changes. */
  onGlobalFilterChange?: (value: string) => void;

  // ── Column Filters ───────────────────────────────────────────────────
  /** Controlled column filters state. */
  columnFilters?: ColumnFiltersState;
  /** Callback when column filters change. */
  onColumnFiltersChange?: (filters: ColumnFiltersState) => void;
  /** Enable per-column filtering. */
  enableColumnFilters?: boolean;
  /** Columns that should show a filter icon in the header. Maps column ID to filter options. */
  filterableColumns?: Record<string, { options: { label: string; value: string }[]; multi?: boolean }>;
  /** Custom filter icon component. Receives `active` boolean when the column has active filters. */
  FilterIcon?: ComponentType<{ active: boolean; className?: string }>;
  /** Render custom filter dropdown content for a column. Receives column ID, current values, and setter. */
  renderColumnFilter?: (columnId: string, currentValues: string[], setValues: (values: string[]) => void) => ReactNode;

  // ── Row Expansion ────────────────────────────────────────────────────
  /** Enable row expansion. */
  expandable?: boolean;
  /** Array of expanded row IDs (controlled). */
  expandedRowIds?: string[];
  /** Callback when expanded rows change. */
  onExpandedChange?: (expandedIds: string[]) => void;
  /** Render function for expanded row content. */
  renderExpandedRow?: (row: TData) => ReactNode;
  /** Custom expand icon component. Receives `expanded` boolean. */
  ExpandIcon?: ComponentType<{ expanded: boolean; className?: string }>;
  /** Place the expand column on the right side of the table. */
  expandColumnPosition?: "left" | "right";
  /** Make the entire row clickable to toggle expansion instead of just the icon. */
  expandOnRowClick?: boolean;

  // ── Column Visibility ────────────────────────────────────────────────
  /** Controlled column visibility. Keys are column IDs, values indicate visibility. */
  columnVisibility?: Record<string, boolean>;
  /** Callback when column visibility changes. */
  onColumnVisibilityChange?: (visibility: Record<string, boolean>) => void;

  // ── Striped Rows ─────────────────────────────────────────────────────
  /** Alternate row background colors. */
  striped?: boolean;
  /** Custom class for striped (alternating) rows. Overrides the default bg-gray-50. */
  stripedClassName?: string;

  // ── Density / Compact Mode ───────────────────────────────────────────
  /** Controls cell padding density. Defaults to "comfortable". */
  density?: "compact" | "comfortable" | "spacious";

  // ── Right Column Freeze ──────────────────────────────────────────────
  /** Column IDs to pin to the right side of the table. */
  pinnedRightColumns?: string[];

  // ── Export ────────────────────────────────────────────────────────────
  /** Callback triggered when export is requested. */
  onExport?: (format: "csv") => void;

  // ── Inline Cell Editing ──────────────────────────────────────────────
  /** Enable inline cell editing on double-click. */
  editable?: boolean;
  /** Column IDs that are editable. If not set, all columns are editable when `editable` is true. */
  editableColumns?: string[];
  /** Callback when a cell value is edited. */
  onCellEdit?: (rowId: string, columnId: string, value: unknown) => void;

  // ── Column Resizing ──────────────────────────────────────────────────
  /** Enable column resizing via drag handles. */
  enableColumnResizing?: boolean;
  /** Controlled column sizing state. */
  columnSizing?: ColumnSizingState;
  /** Callback when column sizing changes. */
  onColumnSizingChange?: (sizing: ColumnSizingState) => void;

  // ── Server-Side / Manual Modes ───────────────────────────────────────
  /** When true, pagination is handled server-side. */
  manualPagination?: boolean;
  /** When true, filtering is handled server-side; the table will not filter data locally. */
  manualFiltering?: boolean;

  // ── Column Reordering ────────────────────────────────────────────────
  /** Enable column reordering. */
  enableColumnReordering?: boolean;
  /** Controlled column order (array of column IDs). */
  columnOrder?: string[];
  /** Callback when column order changes. */
  onColumnOrderChange?: (order: string[]) => void;

  // ── Row Drag & Drop ──────────────────────────────────────────────────
  /** Enable row drag-and-drop reordering. */
  enableRowDragDrop?: boolean;
  /** Callback when a row is reordered. */
  onRowReorder?: (fromIndex: number, toIndex: number) => void;
  /** Place the drag handle column on the left or right side. */
  dragColumnPosition?: "left" | "right";

  // ── Footer / Summary Row ─────────────────────────────────────────────
  /** Show the table footer (tfoot). */
  showFooter?: boolean;
  /** Custom footer content rendered inside `<tfoot>`. */
  footerContent?: ReactNode;

  // ── Context Menu ─────────────────────────────────────────────────────
  /** Callback on right-click of a row. */
  onContextMenu?: (event: React.MouseEvent, row: TData) => void;

  // ── Copy to Clipboard ────────────────────────────────────────────────
  /** Enable single-click cell copy to clipboard. */
  enableCopyOnClick?: boolean;
  /** Callback after a cell value is copied. */
  onCellCopy?: (value: string, rowId: string, columnId: string) => void;

  // ── Infinite Scroll ──────────────────────────────────────────────────
  /** Enable infinite scroll loading. */
  enableInfiniteScroll?: boolean;
  /** Callback when user scrolls near the bottom. */
  onLoadMore?: () => void;
  /** Whether there is more data to load. */
  hasMore?: boolean;
  /** Whether more data is currently being loaded. */
  loadingMore?: boolean;
  /** Content shown when all data is loaded (hasMore is false). */
  infiniteEndContent?: ReactNode;

  // ── Responsive Mobile ────────────────────────────────────────────────
  /** Viewport width below which the table renders as card layout. */
  responsiveBreakpoint?: number;
  /** Render function for mobile card layout. */
  renderMobileCard?: (row: TData) => ReactNode;

  // ── Row Grouping ─────────────────────────────────────────────────────
  /** Column IDs to group rows by. */
  groupBy?: string[];
  /** Callback when group-by columns change. */
  onGroupByChange?: (groupBy: string[]) => void;

  // ── Saved Views / Presets ────────────────────────────────────────────
  /** Callback to save the current table view (sorting, filters, visibility, order). */
  onSaveView?: (view: TableView) => void;

  // ── Global Search Component ──────────────────────────────────────────
  /** Show a built-in search bar above the table. */
  showSearch?: boolean;
  /** Placeholder text for the search bar. */
  searchPlaceholder?: string;
  /** Position of the search icon. */
  searchIconPosition?: "left" | "right" | "none";

  // ── Customizable Icons / Components ─────────────────────────────────
  /** Custom checkbox component for multi-row selection. */
  CheckboxIcon?: ComponentType<{ checked: boolean; indeterminate?: boolean; className?: string }>;
  /** Simple color customization for the default checkbox. */
  checkboxColor?: string;
  /** Custom drag handle icon component. */
  DragHandleIcon?: ComponentType<IconProps>;
  /** Custom search icon component. */
  SearchIcon?: ComponentType<IconProps>;
  /** Callback when the search clear button is clicked. */
  onSearchClear?: () => void;

  // ── Infinite Scroll Customization ───────────────────────────────────
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
  isFloatingActionsHovered?: boolean;
  isPopupOpen?: boolean;
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
