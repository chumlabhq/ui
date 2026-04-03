import {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
  memo,
  forwardRef,
} from "react";
import { createPortal } from "react-dom";
import { isBrowser } from "../../utils/isBrowser";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getExpandedRowModel,
  getGroupedRowModel,
  flexRender,
  type Row,
  type Cell,
  type Header,
  type SortingState,
  type ColumnFiltersState,
  type ExpandedState,
  type ColumnDef,
  type VisibilityState,
  type RowSelectionState,
  type ColumnSizingState,
  type GroupingState,
  type ColumnOrderState,
} from "@tanstack/react-table";
import type { TableProps } from "./utils/types";
import {
  getColumnId,
  getSortDirection,
  isInteractiveElement,
  copyToClipboard,
} from "./utils";
import TableShimmer from "./TableShimmer";
import {
  PinIcon,
  SortAscIcon,
  SortDescIcon,
  SortNeutralIcon,
  ExpandIcon,
  CollapseIcon,
  DragHandleIcon,
  SearchIcon,
  FilterIcon as DefaultFilterIcon,
} from "./icons";

// Density padding map
const densityPaddingMap = {
  compact: "px-2 py-1 text-xs",
  comfortable: "px-3 py-2.5 text-sm",
  spacious: "px-5 py-4 text-base",
} as const;

/** Hook to track viewport width for responsive breakpoint. */
function useViewportWidth(): number {
  const [width, setWidth] = useState(() =>
    isBrowser ? window.innerWidth : 1024,
  );
  useEffect(() => {
    if (!isBrowser) return;
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return width;
}

const FALLBACK_COLUMNS: never[] = [];
const FALLBACK_DATA: never[] = [];

function TableInner<TData>(
  {
    columns: columnsProp,
    data: dataProp,
    COLUMNS,
    COLUMNS_DATA,
    loading = false,
    showHeader = true,
    tableHeader,
    pinnedColumns = [],
    onPinColumn,
    pinnableColumns,
    maxPinnedColumns = 3,
    onCursorPosition,
    onCursorOverHeader,
    emptyContent,
    ariaLabel = "Data table",
    getRowId,
    selectedRowId,
    onRowClick,
    onRowHover,
    floatingActions,
    isFloatingActionsHovered = false,
    isPopupOpen = false,
    maxWidth,
    maxHeight,
    minHeight,
    hideVerticalScrollbar = false,
    hideHorizontalScrollbar = false,
    stickyHeader = false,
    classes: classesProp,
    unstyled = false,
    style: styleProp,
    PinIcon: CustomPinIcon,
    PinnedIcon: CustomPinnedIcon,
    shimmerRowCount = 10,
    className,
    children,

    // Sorting
    sortable = false,
    onSortingChange,
    sorting: sortingProp,
    manualSorting = false,

    // Selection
    selectionMode = "none",
    selectedRowIds: selectedRowIdsProp,
    onSelectionChange,
    selectAllMode = "page",

    // Global filter
    globalFilter: globalFilterProp,
    onGlobalFilterChange,

    // Column filters
    columnFilters: columnFiltersProp,
    onColumnFiltersChange,
    enableColumnFilters = false,
    filterableColumns,
    FilterIcon: CustomFilterIcon,
    renderColumnFilter,

    // Expansion
    expandable = false,
    expandedRowIds: expandedRowIdsProp,
    onExpandedChange,
    renderExpandedRow,
    ExpandIcon: CustomExpandIcon,
    expandColumnPosition = "left",
    expandOnRowClick = false,

    // Column visibility
    columnVisibility: columnVisibilityProp,
    onColumnVisibilityChange,

    // Striped
    striped = false,
    stripedClassName: stripedClassNameProp,

    // Density
    density = "comfortable",

    // Right pinned
    pinnedRightColumns = [],

    // ── Batch 2 props ────────────────────────────────────────────────────
    onExport,

    editable = false,
    editableColumns,
    onCellEdit,

    enableColumnResizing = false,
    columnSizing: columnSizingProp,
    onColumnSizingChange,

    manualPagination = false,
    manualFiltering = false,

    enableColumnReordering = false,
    columnOrder: columnOrderProp,
    onColumnOrderChange,

    enableRowDragDrop = false,
    onRowReorder,
    dragColumnPosition = "left",

    showFooter = false,
    footerContent,

    onContextMenu,

    enableCopyOnClick = false,
    onCellCopy,

    enableInfiniteScroll = false,
    onLoadMore,
    hasMore = false,
    loadingMore = false,
    infiniteEndContent,

    responsiveBreakpoint,
    renderMobileCard,

    groupBy: groupByProp,
    onGroupByChange,

    onSaveView,

    showSearch = false,
    searchPlaceholder = "Search...",
    searchIconPosition = "left",

    // Customizable icons / components
    CheckboxIcon: CustomCheckboxIcon,
    checkboxColor,
    DragHandleIcon: CustomDragHandleIcon,
    SearchIcon: CustomSearchIcon,
    onSearchClear,
    loadingMoreContent,
  }: TableProps<TData>,
  ref: React.Ref<HTMLDivElement>,
) {
  // Resolve classes from the `classes` prop
  // Passthrough props — consumed by external integrations, not used internally
  void unstyled; void onExport; void enableColumnReordering; void onSaveView;

  const containerClassName = classesProp?.container ?? "";
  const tableClassName = classesProp?.table ?? "";
  const headerClassName = classesProp?.header ?? "";
  const headerRowClassName = classesProp?.headerRow ?? "";
  const headerCellClassName = classesProp?.headerCell ?? "";
  const headerCellHoverClassName = classesProp?.headerCellHover ?? "";
  const headerCellContentClassName = classesProp?.headerCellContent ?? "";
  const bodyClassName = classesProp?.body ?? "";
  const rowClassName = classesProp?.row ?? "";
  const cellClassName = classesProp?.cell ?? "";
  const selectedRowClassName = classesProp?.selectedRow ?? "";
  const pinnedContainerClassName = classesProp?.pinnedContainer ?? "";
  const pinnedTableClassName = classesProp?.pinnedTable ?? "";
  const unpinnedContainerClassName = classesProp?.unpinnedContainer ?? "";
  const unpinnedTableClassName = classesProp?.unpinnedTable ?? "";
  const emptyClassName = classesProp?.empty ?? "";
  const pinIconClassName = classesProp?.pinIcon ?? "";
  const pinIconHoverClassName = classesProp?.pinIconHover ?? "";
  const pinnedPinIconClassName = classesProp?.pinnedPinIcon ?? "";
  const pinnedPinIconHoverClassName = classesProp?.pinnedPinIconHover ?? "";
  const pinButtonClassName = classesProp?.pinButton ?? "";
  const pinnedPinButtonClassName = classesProp?.pinnedPinButton ?? "";
  const shimmerClassName = classesProp?.shimmer ?? "";
  const shimmerRowClassName = classesProp?.shimmerRow ?? "";
  const shimmerCellClassName = classesProp?.shimmerCell ?? "";
  const shimmerBarClassName = classesProp?.shimmerBar ?? "";
  const checkboxClassName = classesProp?.checkbox ?? "";
  const checkboxCellClassName = classesProp?.checkboxCell ?? "";
  const sortIconClassName = classesProp?.sortIcon ?? "";
  const expandIconClassName = classesProp?.expandIcon ?? "";
  const expandedRowClassName = classesProp?.expandedRow ?? "";
  const pinnedRightContainerClassName = classesProp?.pinnedRightContainer ?? "";
  const pinnedRightTableClassName = classesProp?.pinnedRightTable ?? "";
  const editInputClassName = classesProp?.editInput ?? "";
  const dragHandleClassName = classesProp?.dragHandle ?? "";
  const footerClassName = classesProp?.footer ?? "";
  const searchBarClassName = classesProp?.searchBar ?? "";
  const mobileCardClassName = classesProp?.mobileCard ?? "";
  const groupHeaderClassName = classesProp?.groupHeader ?? "";
  const resizeHandleClassName = classesProp?.resizeHandle ?? "";
  const filterIconClassName = classesProp?.filterIcon ?? "";
  const filterDropdownClassName = classesProp?.filterDropdown ?? "";
  const loadingMoreClassName = classesProp?.loadingMore ?? "";
  const searchInputClassName = classesProp?.searchInput ?? "";

  const columns = columnsProp ?? COLUMNS ?? FALLBACK_COLUMNS;
  const data = dataProp ?? COLUMNS_DATA ?? FALLBACK_DATA;
  const shouldShowHeader = tableHeader ?? showHeader;
  const [focusedCell, setFocusedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // ── Editing state ──────────────────────────────────────────────────────
  const [editingCell, setEditingCell] = useState<{
    rowId: string;
    columnId: string;
  } | null>(null);
  const [editValue, setEditValue] = useState<string>("");

  // ── Drag & drop state ──────────────────────────────────────────────────
  const [dragRowIndex, setDragRowIndex] = useState<number | null>(null);

  // ── Column filter dropdown state ──────────────────────────────────────
  const [filterDropdownState, setFilterDropdownState] = useState<{
    columnId: string;
    top: number;
    left: number;
  } | null>(null);
  const openFilterColumn = filterDropdownState?.columnId ?? null;
  const filterDropdownRef = useRef<HTMLDivElement>(null);

  // The filter icon button ref for repositioning
  const filterTriggerRef = useRef<HTMLButtonElement | null>(null);

  // Close filter dropdown on click outside; close on any scroll.
  // Tolerates portals spawned from within the filter content (e.g. nested dropdowns)
  // by checking for the data-table-filter-content attribute on ancestors.
  useEffect(() => {
    if (!filterDropdownState) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      // Click inside the filter dropdown itself
      if (filterDropdownRef.current?.contains(target)) return;
      // Click on the trigger button
      if (filterTriggerRef.current?.contains(target)) return;
      // Click inside a portal spawned from within the filter content (e.g. MultiSelectSearchableDropdown
      // renders its own portal with data-dropdown-id). Check for our marker OR any dropdown portal.
      if (target instanceof HTMLElement || target instanceof SVGElement) {
        const el = (target as Element).closest("[data-table-filter-content], [data-dropdown-id]");
        if (el) return;
      }
      setFilterDropdownState(null);
    };

    // Close on scroll, but NOT when scrolling inside the dropdown or its child portals
    const handleScroll = (e: Event) => {
      const target = e.target as Node;
      if (filterDropdownRef.current?.contains(target)) return;
      if (target instanceof HTMLElement && target.closest("[data-table-filter-content], [data-dropdown-id]")) return;
      setFilterDropdownState(null);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [filterDropdownState]);

  // After the filter dropdown portal renders, check if it overflows the viewport
  // and adjust position if needed (more accurate than the estimated width above).
  useEffect(() => {
    if (!filterDropdownState || !filterDropdownRef.current) return;
    const el = filterDropdownRef.current;
    const rect = el.getBoundingClientRect();
    const vw = window.innerWidth;
    if (rect.right > vw - 8) {
      // Shift left so it stays within viewport with 8px padding
      const shift = rect.right - vw + 8;
      el.style.left = `${filterDropdownState.left - shift}px`;
    }
  }, [filterDropdownState]);

  // Internal sorting state (uncontrolled mode)
  const [internalSorting, setInternalSorting] = useState<SortingState>([]);
  const sorting = sortingProp ?? internalSorting;

  // Internal column filters state (uncontrolled mode)
  const [internalColumnFilters, setInternalColumnFilters] =
    useState<ColumnFiltersState>([]);
  const columnFilters = columnFiltersProp ?? internalColumnFilters;

  // Helper to get/set filter values for a column
  const getColumnFilterValues = useCallback(
    (colId: string): string[] => {
      const filter = columnFilters.find((f) => f.id === colId);
      if (!filter) return [];
      return Array.isArray(filter.value)
        ? (filter.value as string[])
        : [filter.value as string];
    },
    [columnFilters],
  );

  const setColumnFilterValues = useCallback(
    (colId: string, values: string[]) => {
      const newFilters = columnFilters.filter((f) => f.id !== colId);
      if (values.length > 0) {
        newFilters.push({ id: colId, value: values });
      }
      setInternalColumnFilters(newFilters);
      onColumnFiltersChange?.(newFilters);
    },
    [columnFilters, onColumnFiltersChange],
  );

  // Internal global filter state (uncontrolled mode)
  const [internalGlobalFilter, setInternalGlobalFilter] = useState<string>("");
  const globalFilter = globalFilterProp ?? internalGlobalFilter;

  // Internal column visibility state (uncontrolled mode)
  const [internalColumnVisibility, setInternalColumnVisibility] =
    useState<VisibilityState>({});
  const columnVisibility = columnVisibilityProp ?? internalColumnVisibility;

  // Internal column sizing state
  const [internalColumnSizing, setInternalColumnSizing] =
    useState<ColumnSizingState>({});
  const columnSizing = columnSizingProp ?? internalColumnSizing;

  // Internal column order state
  const [internalColumnOrder, setInternalColumnOrder] =
    useState<ColumnOrderState>([]);
  const columnOrder = columnOrderProp ?? internalColumnOrder;

  // Grouping state
  const grouping: GroupingState = useMemo(
    () => groupByProp ?? [],
    [groupByProp],
  );

  // Internal expanded state
  const expandedState: ExpandedState = useMemo(() => {
    if (!expandedRowIdsProp) return {};
    const result: Record<string, boolean> = {};
    for (const id of expandedRowIdsProp) {
      result[id] = true;
    }
    return result;
  }, [expandedRowIdsProp]);
  const [internalExpanded, setInternalExpanded] = useState<ExpandedState>({});
  const expanded = expandedRowIdsProp ? expandedState : internalExpanded;

  // Internal row selection state
  const rowSelectionState: RowSelectionState = useMemo(() => {
    if (!selectedRowIdsProp) return {};
    const result: Record<string, boolean> = {};
    for (const id of selectedRowIdsProp) {
      result[id] = true;
    }
    return result;
  }, [selectedRowIdsProp]);
  const [internalRowSelection, setInternalRowSelection] =
    useState<RowSelectionState>({});
  const rowSelection = selectedRowIdsProp
    ? rowSelectionState
    : internalRowSelection;

  // Editable column set
  const editableColumnSet = useMemo(
    () => (editableColumns ? new Set(editableColumns) : null),
    [editableColumns],
  );

  // Build augmented columns with checkbox, expand, and drag handle columns
  const augmentedColumns = useMemo(() => {
    const cols: ColumnDef<TData, unknown>[] = [];

    // Drag handle column
    const DragHandleIconComponent = CustomDragHandleIcon || DragHandleIcon;
    const dragCol: ColumnDef<TData, unknown> | null = enableRowDragDrop
      ? ({
          id: "__dragHandle",
          header: () => null,
          cell: () => (
            <span
              className={`cursor-grab select-none ${dragHandleClassName}`}
              data-drag-handle
              aria-label="Drag to reorder"
            >
              <DragHandleIconComponent className="w-4 h-4" />
            </span>
          ),
          size: 40,
          enableSorting: false,
          enableColumnFilter: false,
          enableResizing: false,
        } as ColumnDef<TData, unknown>)
      : null;

    if (dragCol && dragColumnPosition === "left") {
      cols.push(dragCol);
    }

    // Checkbox column for multi-select
    if (selectionMode === "multiple") {
      cols.push({
        id: "__selection",
        header: ({ table: t }) => {
          const checked = selectAllMode === "all" ? t.getIsAllRowsSelected() : t.getIsAllPageRowsSelected();
          const indeterminate = selectAllMode === "all" ? t.getIsSomeRowsSelected() : t.getIsSomePageRowsSelected();
          const toggleHandler = selectAllMode === "all" ? t.getToggleAllRowsSelectedHandler() : t.getToggleAllPageRowsSelectedHandler();
          if (CustomCheckboxIcon) {
            return (
              <span
                onClick={toggleHandler}
                role="checkbox"
                aria-checked={indeterminate ? "mixed" : checked}
                aria-label="Select all rows"
                className="cursor-pointer"
              >
                <CustomCheckboxIcon
                  checked={checked}
                  indeterminate={indeterminate}
                  className={checkboxClassName}
                />
              </span>
            );
          }
          return (
            <input
              type="checkbox"
              className={checkboxClassName}
              style={checkboxColor ? { accentColor: checkboxColor } : undefined}
              checked={checked}
              ref={(el) => {
                if (el) {
                  el.indeterminate = indeterminate;
                }
              }}
              onChange={toggleHandler}
              aria-label="Select all rows"
            />
          );
        },
        cell: ({ row }) => {
          const checked = row.getIsSelected();
          if (CustomCheckboxIcon) {
            return (
              <span
                onClick={row.getToggleSelectedHandler()}
                role="checkbox"
                aria-checked={checked}
                aria-label={`Select row ${row.id}`}
                className="cursor-pointer"
              >
                <CustomCheckboxIcon
                  checked={checked}
                  className={checkboxClassName}
                />
              </span>
            );
          }
          return (
            <input
              type="checkbox"
              className={checkboxClassName}
              style={checkboxColor ? { accentColor: checkboxColor } : undefined}
              checked={checked}
              disabled={!row.getCanSelect()}
              onChange={row.getToggleSelectedHandler()}
              aria-label={`Select row ${row.id}`}
            />
          );
        },
        size: 40,
        maxSize: 40,
        minSize: 40,
        enableSorting: false,
        enableColumnFilter: false,
        enableResizing: false,
      } as ColumnDef<TData, unknown>);
    }

    // Expand column
    const expandCol: ColumnDef<TData, unknown> | null = expandable
      ? ({
          id: "__expand",
          header: () => null,
          cell: ({ row }) => {
            const isExpanded = row.getIsExpanded();
            return (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  row.toggleExpanded();
                }}
                className={`shrink-0 transition-transform cursor-pointer ${expandIconClassName}`}
                aria-label={isExpanded ? "Collapse row" : "Expand row"}
                data-expanded={isExpanded || undefined}
              >
                {CustomExpandIcon ? (
                  <CustomExpandIcon expanded={isExpanded} className="w-4 h-4" />
                ) : isExpanded ? (
                  <CollapseIcon className="w-4 h-4" />
                ) : (
                  <ExpandIcon className="w-4 h-4" />
                )}
              </button>
            );
          },
          size: 40,
          enableSorting: false,
          enableColumnFilter: false,
          enableResizing: false,
        } as ColumnDef<TData, unknown>)
      : null;

    if (expandCol && expandColumnPosition === "left") {
      cols.push(expandCol);
    }

    // Push user columns, setting filterFn for filterable columns
    const userCols = (columns as ColumnDef<TData, unknown>[]).map((col) => {
      if (!filterableColumns) return col;
      const colId =
        (col as { accessorKey?: string; id?: string }).accessorKey ??
        (col as { id?: string }).id;
      if (colId && filterableColumns[colId]) {
        return { ...col, filterFn: "multiValue" as const };
      }
      return col;
    });
    cols.push(...(userCols as unknown as typeof cols));

    if (expandCol && expandColumnPosition === "right") {
      cols.push(expandCol);
    }

    if (dragCol && dragColumnPosition === "right") {
      cols.push(dragCol);
    }

    return cols;
  }, [
    columns,
    selectionMode,
    expandable,
    checkboxClassName,
    expandIconClassName,
    enableRowDragDrop,
    dragHandleClassName,
    CustomCheckboxIcon,
    checkboxColor,
    CustomDragHandleIcon,
    CustomExpandIcon,
    expandColumnPosition,
    dragColumnPosition,
    filterableColumns,
    selectAllMode,
  ]);

  // Density padding class
  const densityClass = densityPaddingMap[density] || "";

  // Determine if we need filtering model
  const needsFiltering =
    globalFilter !== undefined ||
    enableColumnFilters ||
    showSearch ||
    !!filterableColumns;

  const table = useReactTable({
    data: data ?? [],
    columns: augmentedColumns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination,
    // Custom filter function for multi-value column filters
    filterFns: {
      multiValue: (row, columnId, filterValue) => {
        if (!Array.isArray(filterValue) || filterValue.length === 0)
          return true;
        const cellValue = String(row.getValue(columnId)).toLowerCase();
        return filterValue.some((v: string) => cellValue === v.toLowerCase());
      },
    },
    ...(filterableColumns ? { enableColumnFilters: true } : {}),

    // Sorting
    ...(sortable
      ? {
          getSortedRowModel: manualSorting ? undefined : getSortedRowModel(),
          manualSorting,
          onSortingChange: (updater) => {
            const newSorting =
              typeof updater === "function" ? updater(sorting) : updater;
            setInternalSorting(newSorting);
            onSortingChange?.(newSorting);
          },
        }
      : {}),
    state: {
      ...(sortable ? { sorting } : {}),
      ...(needsFiltering ? { globalFilter, columnFilters } : {}),
      ...(expandable ? { expanded } : {}),
      columnVisibility,
      ...(selectionMode !== "none" ? { rowSelection } : {}),
      ...(enableColumnResizing ? { columnSizing } : {}),
      ...(columnOrder.length > 0 ? { columnOrder } : {}),
      ...(grouping.length > 0 ? { grouping } : {}),
    },

    // Filtering
    ...(needsFiltering
      ? {
          getFilteredRowModel: manualFiltering
            ? undefined
            : getFilteredRowModel(),
          manualFiltering,
          onGlobalFilterChange: (updater) => {
            const newFilter =
              typeof updater === "function" ? updater(globalFilter) : updater;
            setInternalGlobalFilter(newFilter);
            onGlobalFilterChange?.(newFilter);
          },
          onColumnFiltersChange: (updater) => {
            const newFilters =
              typeof updater === "function" ? updater(columnFilters) : updater;
            setInternalColumnFilters(newFilters);
            onColumnFiltersChange?.(newFilters);
          },
          enableColumnFilters,
        }
      : {}),

    // Expansion
    ...(expandable
      ? {
          getExpandedRowModel: getExpandedRowModel(),
          onExpandedChange: (updater) => {
            const newExpanded =
              typeof updater === "function" ? updater(expanded) : updater;
            setInternalExpanded(newExpanded);
            if (onExpandedChange && typeof newExpanded === "object") {
              onExpandedChange(
                Object.keys(newExpanded).filter(
                  (k) => (newExpanded as Record<string, boolean>)[k],
                ),
              );
            }
          },
          getRowCanExpand: () => true,
        }
      : {}),

    // Column visibility
    onColumnVisibilityChange: (updater) => {
      const newVisibility =
        typeof updater === "function" ? updater(columnVisibility) : updater;
      setInternalColumnVisibility(newVisibility);
      onColumnVisibilityChange?.(newVisibility);
    },

    // Row selection
    ...(selectionMode !== "none"
      ? {
          enableRowSelection: true,
          enableMultiRowSelection: selectionMode === "multiple",
          onRowSelectionChange: (updater) => {
            const newSelection =
              typeof updater === "function" ? updater(rowSelection) : updater;
            setInternalRowSelection(newSelection);
            onSelectionChange?.(
              Object.keys(newSelection).filter((k) => newSelection[k]),
            );
          },
        }
      : {}),

    // Row ID
    ...(getRowId ? { getRowId: (row: TData) => getRowId(row) } : {}),

    // Column resizing
    ...(enableColumnResizing
      ? {
          enableColumnResizing: true,
          columnResizeMode: "onChange" as const,
          onColumnSizingChange: (updater) => {
            const newSizing =
              typeof updater === "function" ? updater(columnSizing) : updater;
            setInternalColumnSizing(newSizing);
            onColumnSizingChange?.(newSizing);
          },
        }
      : {}),

    // Column order
    ...(columnOrder.length > 0
      ? {
          onColumnOrderChange: (updater) => {
            const newOrder =
              typeof updater === "function" ? updater(columnOrder) : updater;
            setInternalColumnOrder(newOrder);
            onColumnOrderChange?.(newOrder);
          },
        }
      : {}),

    // Grouping
    ...(grouping.length > 0
      ? {
          getGroupedRowModel: getGroupedRowModel(),
          enableGrouping: true,
          onGroupingChange: (updater) => {
            const newGrouping = typeof updater === "function" ? updater(grouping) : updater;
            onGroupByChange?.(newGrouping);
          },
        }
      : {}),
  });

  const pinnedColumnIds = useMemo(
    () => new Set(pinnedColumns),
    [pinnedColumns],
  );

  const pinnedRightColumnIds = useMemo(
    () => new Set(pinnedRightColumns),
    [pinnedRightColumns],
  );

  const hasPinnedColumns = pinnedColumns.length > 0;
  const hasPinnedRightColumns = pinnedRightColumns.length > 0;

  const containerStyle = useMemo(() => {
    const style: React.CSSProperties & {
      scrollbarWidth?: string;
      msOverflowStyle?: string;
      WebkitOverflowScrolling?: string;
    } = {};

    if (maxWidth) {
      style.maxWidth =
        typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth;
      style.overflowX = "auto";
    }

    if (maxHeight) {
      style.maxHeight =
        typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight;
      style.overflowY = "auto";
    }

    if (minHeight) {
      style.minHeight =
        typeof minHeight === "number" ? `${minHeight}px` : minHeight;
    }

    // Hide scrollbars while keeping scroll functionality
    // Firefox
    if (hideVerticalScrollbar || hideHorizontalScrollbar) {
      style.scrollbarWidth = "none";
      // IE and Edge
      style.msOverflowStyle = "none";
      // Smooth scrolling on iOS
      style.WebkitOverflowScrolling = "touch";
    }

    return style;
  }, [
    maxWidth,
    maxHeight,
    minHeight,
    hideVerticalScrollbar,
    hideHorizontalScrollbar,
  ]);

  const scrollbarHideClass = useMemo(() => {
    if (hideVerticalScrollbar && hideHorizontalScrollbar) {
      return "[&::-webkit-scrollbar]:hidden";
    }
    if (hideVerticalScrollbar) {
      return "[&::-webkit-scrollbar:vertical]:w-0 [&::-webkit-scrollbar:vertical]:bg-transparent";
    }
    if (hideHorizontalScrollbar) {
      return "[&::-webkit-scrollbar:horizontal]:h-0 [&::-webkit-scrollbar:horizontal]:bg-transparent";
    }
    return "";
  }, [hideVerticalScrollbar, hideHorizontalScrollbar]);

  const stickyHeaderClass = stickyHeader ? "sticky top-0 z-20" : "";

  // ── Responsive breakpoint ─────────────────────────────────────────────
  const viewportWidth = useViewportWidth();
  const isMobileView =
    responsiveBreakpoint !== undefined && viewportWidth < responsiveBreakpoint;

  // ── Infinite scroll ───────────────────────────────────────────────────
  // scrollSentinelRef removed - using scroll event listener instead
  // ── Infinite scroll via scroll event (more reliable than IntersectionObserver) ──
  const loadingMoreRef = useRef(loadingMore);
  loadingMoreRef.current = loadingMore;
  const hasMoreRef = useRef(hasMore);
  hasMoreRef.current = hasMore;
  const onLoadMoreRef = useRef(onLoadMore);
  onLoadMoreRef.current = onLoadMore;

  useEffect(() => {
    if (!enableInfiniteScroll) return;

    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (
        !hasMoreRef.current ||
        loadingMoreRef.current ||
        !onLoadMoreRef.current
      )
        return;

      const { scrollTop, scrollHeight, clientHeight } = container;
      // Trigger when user is within 100px of the bottom
      if (scrollHeight - scrollTop - clientHeight < 100) {
        onLoadMoreRef.current();
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [enableInfiniteScroll]);

  const handleRowHover = useCallback(
    (
      rowIndex: number | null,
      rowRef?: React.RefObject<HTMLTableRowElement>,
    ) => {
      if ((isFloatingActionsHovered || isPopupOpen) && rowIndex === null) {
        return;
      }
      onRowHover?.(rowIndex, rowRef);
    },
    [onRowHover, isFloatingActionsHovered, isPopupOpen],
  );

  const handleRowClick = useCallback(
    (row: Row<TData>, event: React.MouseEvent) => {
      if (isInteractiveElement(event.target)) return;
      if (expandOnRowClick && expandable) {
        event.stopPropagation();
        row.toggleExpanded();
        return;
      }
      if (!onRowClick) return;
      event.stopPropagation();
      onRowClick(row.original);
    },
    [onRowClick, expandOnRowClick, expandable],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent, rowIndex: number, colIndex: number) => {
      const totalRows = table.getRowModel().rows.length;
      const totalCols = table.getAllLeafColumns().length;

      switch (event.key) {
        case "ArrowRight":
          event.preventDefault();
          if (colIndex < totalCols - 1) {
            setFocusedCell({ row: rowIndex, col: colIndex + 1 });
          }
          break;
        case "ArrowLeft":
          event.preventDefault();
          if (colIndex > 0) {
            setFocusedCell({ row: rowIndex, col: colIndex - 1 });
          }
          break;
        case "ArrowDown":
          event.preventDefault();
          if (rowIndex < totalRows - 1) {
            setFocusedCell({ row: rowIndex + 1, col: colIndex });
          }
          break;
        case "ArrowUp":
          event.preventDefault();
          if (rowIndex > 0) {
            setFocusedCell({ row: rowIndex - 1, col: colIndex });
          }
          break;
        case "Escape":
          event.preventDefault();
          handleRowHover(null);
          setFocusedCell(null);
          break;
      }
    },
    [table, handleRowHover],
  );

  const isRowSelected = useCallback(
    (row: Row<TData>) => {
      if (!getRowId || !selectedRowId) return false;
      return getRowId(row.original) === selectedRowId;
    },
    [getRowId, selectedRowId],
  );

  const pinnableColumnIds = useMemo(
    () => new Set(pinnableColumns ?? []),
    [pinnableColumns],
  );

  const effectiveMaxPinnedColumns = Math.min(Math.max(maxPinnedColumns, 1), 5);
  const canPinMore = pinnedColumns.length < effectiveMaxPinnedColumns;

  const handlePinClick = useCallback(
    (columnId: string, isPinned: boolean, event: React.MouseEvent) => {
      event.stopPropagation();
      if (!isPinned && !canPinMore) {
        return;
      }
      onPinColumn?.(columnId, !isPinned);
    },
    [onPinColumn, canPinMore],
  );

  // ── Inline editing handlers ───────────────────────────────────────────
  const handleCellDoubleClick = useCallback(
    (rowId: string, columnId: string, currentValue: unknown) => {
      if (!editable) return;
      if (editableColumnSet && !editableColumnSet.has(columnId)) return;
      setEditingCell({ rowId, columnId });
      setEditValue(currentValue != null ? String(currentValue) : "");
    },
    [editable, editableColumnSet],
  );

  const commitEdit = useCallback(() => {
    if (editingCell && onCellEdit) {
      onCellEdit(editingCell.rowId, editingCell.columnId, editValue);
    }
    setEditingCell(null);
    setEditValue("");
  }, [editingCell, editValue, onCellEdit]);

  const cancelEdit = useCallback(() => {
    setEditingCell(null);
    setEditValue("");
  }, []);

  // ── Cell copy handler ─────────────────────────────────────────────────
  const handleCellClick = useCallback(
    async (cellText: string, rowId: string, columnId: string) => {
      if (!enableCopyOnClick) return;
      await copyToClipboard(cellText);
      onCellCopy?.(cellText, rowId, columnId);
    },
    [enableCopyOnClick, onCellCopy],
  );

  // ── Drag & drop handlers ──────────────────────────────────────────────
  const handleDragStart = useCallback(
    (e: React.DragEvent, rowIndex: number) => {
      setDragRowIndex(rowIndex);
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", String(rowIndex));
    },
    [],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, targetIndex: number) => {
      e.preventDefault();
      if (dragRowIndex !== null && dragRowIndex !== targetIndex) {
        onRowReorder?.(dragRowIndex, targetIndex);
      }
      setDragRowIndex(null);
    },
    [dragRowIndex, onRowReorder],
  );

  const handleDragEnd = useCallback(() => {
    setDragRowIndex(null);
  }, []);

  // ── Search bar handler ────────────────────────────────────────────────
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInternalGlobalFilter(value);
      onGlobalFilterChange?.(value);
      table.setGlobalFilter(value);
    },
    [onGlobalFilterChange, table],
  );

  const UnpinnedIconComponent = CustomPinIcon || PinIcon;
  const PinnedIconComponent = CustomPinnedIcon || CustomPinIcon || PinIcon;

  const renderHeaderCell = useCallback(
    (header: Header<TData, unknown>, index: number) => {
      if (header.isPlaceholder) {
        return (
          <th
            key={header.id}
            colSpan={header.colSpan}
            className={`${headerCellClassName} ${densityClass}`}
            role="columnheader"
            data-column-index={index}
          />
        );
      }

      const columnId = getColumnId(
        header.column.columnDef as { accessorKey?: string; id?: string },
      );
      const isPinned = pinnedColumnIds.has(columnId);
      const isColumnPinnable =
        pinnableColumnIds.size === 0 || pinnableColumnIds.has(columnId);
      const canShowPinButton = onPinColumn && isColumnPinnable;
      const isDisabled = !isPinned && !canPinMore;

      const isSortableColumn = sortable && header.column.getCanSort();
      const sortDir = header.column.getIsSorted();

      const isCheckboxColumn = columnId === "__selection";
      const isExpandColumn = columnId === "__expand";
      const isDragColumn = columnId === "__dragHandle";

      const headerStyle: React.CSSProperties = {};
      const hasFilter = filterableColumns && filterableColumns[columnId];
      if (enableColumnResizing && header.column.getCanResize()) {
        const size = header.getSize();
        headerStyle.width = size;
        headerStyle.minWidth = size;
        headerStyle.maxWidth = size;
      }
      if ((enableColumnResizing && header.column.getCanResize()) || hasFilter) {
        headerStyle.position = "relative";
      }

      return (
        <th
          key={header.id}
          colSpan={header.colSpan > 1 ? header.colSpan : undefined}
          className={`group/header ${headerCellClassName} ${isCheckboxColumn || isExpandColumn || isDragColumn ? checkboxCellClassName : ""} ${headerCellHoverClassName ? `hover:${headerCellHoverClassName}` : ""} ${densityClass}`}
          role="columnheader"
          aria-sort={getSortDirection(header.column.getIsSorted())}
          data-pinned={isPinned || undefined}
          data-column-index={index}
          data-sorted={sortDir || undefined}
          style={Object.keys(headerStyle).length > 0 ? headerStyle : undefined}
        >
          <div
            className={`flex items-center ${enableColumnResizing ? "overflow-hidden pr-3" : ""} ${headerCellContentClassName}`}
          >
            <span
              className={`flex items-center gap-1 ${enableColumnResizing ? "truncate" : ""}`}
            >
              {flexRender(header.column.columnDef.header, header.getContext())}
              {/* Sort indicator - click only on icon to sort */}
              {isSortableColumn && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    header.column.toggleSorting();
                  }}
                  className={`shrink-0 cursor-pointer select-none rounded p-0.5 transition-colors hover:bg-black/5 dark:hover:bg-white/60 ${sortIconClassName}`}
                  aria-label={`Sort by ${columnId}`}
                  title={
                    sortDir === "asc"
                      ? "Sorted ascending"
                      : sortDir === "desc"
                        ? "Sorted descending"
                        : "Sort column"
                  }
                >
                  {sortDir === "asc" ? (
                    <SortAscIcon className="w-4 h-4" />
                  ) : sortDir === "desc" ? (
                    <SortDescIcon className="w-4 h-4" />
                  ) : (
                    <SortNeutralIcon className="w-4 h-4 opacity-50" />
                  )}
                </button>
              )}
            </span>
            <span className="flex-1" />

            {/* Column filter icon */}
            {filterableColumns && filterableColumns[columnId] && (
              <button
                ref={
                  openFilterColumn === columnId ? filterTriggerRef : undefined
                }
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (openFilterColumn === columnId) {
                    setFilterDropdownState(null);
                  } else {
                    const rect = e.currentTarget.getBoundingClientRect();
                    filterTriggerRef.current = e.currentTarget;
                    // Check if dropdown would overflow viewport on the right.
                    // If so, align to the right edge of the trigger instead.
                    const dropdownWidth = 220; // estimated min-w
                    const spaceRight = window.innerWidth - rect.left;
                    const left = spaceRight < dropdownWidth
                      ? rect.right - dropdownWidth
                      : rect.left;
                    setFilterDropdownState({
                      columnId,
                      top: rect.bottom + 4,
                      left: Math.max(8, left), // keep 8px minimum from left edge
                    });
                  }
                }}
                className={`shrink-0 ml-1 cursor-pointer transition-opacity opacity-50 hover:opacity-100 ${filterIconClassName} ${getColumnFilterValues(columnId).length > 0 ? "opacity-100" : ""}`}
                aria-label={`Filter ${columnId}`}
                title="Filter column"
              >
                {CustomFilterIcon ? (
                  <CustomFilterIcon
                    active={getColumnFilterValues(columnId).length > 0}
                    className="w-3.5 h-3.5"
                  />
                ) : (
                  <DefaultFilterIcon
                    active={getColumnFilterValues(columnId).length > 0}
                    className="w-3.5 h-3.5"
                  />
                )}
              </button>
            )}

            {canShowPinButton && (
              <button
                type="button"
                onClick={(e) => handlePinClick(columnId, isPinned, e)}
                disabled={isDisabled}
                className={`shrink-0 transition-all ${
                  isPinned
                    ? `opacity-100 ${pinnedPinButtonClassName} ${pinnedPinIconHoverClassName ? `hover:${pinnedPinIconHoverClassName}` : ""}`
                    : `opacity-0 group-hover/header:opacity-100 ${pinButtonClassName} ${pinIconHoverClassName ? `hover:${pinIconHoverClassName}` : ""} ${isDisabled ? "cursor-not-allowed opacity-50" : ""}`
                }`}
                aria-label={
                  isPinned
                    ? `Unpin ${columnId} column`
                    : isDisabled
                      ? `Cannot pin more columns (max ${effectiveMaxPinnedColumns})`
                      : `Pin ${columnId} column`
                }
                title={
                  isPinned
                    ? "Unpin column"
                    : isDisabled
                      ? `Max ${effectiveMaxPinnedColumns} columns can be pinned`
                      : "Pin column"
                }
              >
                {isPinned ? (
                  <PinnedIconComponent
                    className={`w-4 h-4 ${pinnedPinIconClassName}`}
                  />
                ) : (
                  <UnpinnedIconComponent
                    className={`w-4 h-4 ${pinIconClassName}`}
                  />
                )}
              </button>
            )}
          </div>
          {/* Column resize handle - positioned inside th, outside content div */}
          {enableColumnResizing && header.column.getCanResize() && (
            <div
              onMouseDown={header.getResizeHandler()}
              onTouchStart={header.getResizeHandler()}
              className={`absolute right-0 top-0 h-full w-4 cursor-col-resize select-none touch-none z-10 flex items-center justify-center group/resize ${resizeHandleClassName}`}
              data-resize-handle
              role="separator"
              aria-orientation="vertical"
            >
              <div
                className={`w-0.5 h-3/5 rounded-full transition-colors ${
                  header.column.getIsResizing()
                    ? "bg-blue-500"
                    : "bg-transparent group-hover/resize:bg-gray-400 dark:group-hover/resize:bg-gray-500"
                }`}
              />
            </div>
          )}
        </th>
      );
    },
    [
      headerCellClassName,
      headerCellHoverClassName,
      headerCellContentClassName,
      pinnedColumnIds,
      pinnableColumnIds,
      onPinColumn,
      handlePinClick,
      pinIconClassName,
      pinIconHoverClassName,
      pinnedPinIconClassName,
      pinnedPinIconHoverClassName,
      pinButtonClassName,
      pinnedPinButtonClassName,
      canPinMore,
      effectiveMaxPinnedColumns,
      UnpinnedIconComponent,
      PinnedIconComponent,
      sortable,
      sortIconClassName,
      checkboxCellClassName,
      densityClass,
      enableColumnResizing,
      resizeHandleClassName,
      filterableColumns,
      CustomFilterIcon,
      filterIconClassName,
      openFilterColumn,
      getColumnFilterValues,
    ],
  );

  const renderCell = useCallback(
    (cell: Cell<TData, unknown>, rowIndex: number, colIndex: number) => {
      const isFocused =
        focusedCell?.row === rowIndex && focusedCell?.col === colIndex;
      const columnId = getColumnId(
        cell.column.columnDef as { accessorKey?: string; id?: string },
      );
      const isCheckboxColumn = columnId === "__selection";
      const isExpandColumn = columnId === "__expand";
      const isDragColumn = columnId === "__dragHandle";
      const isSyntheticColumn =
        isCheckboxColumn || isExpandColumn || isDragColumn;

      // Check for rowSpan/colSpan in column meta
      const meta = cell.column.columnDef.meta as
        | { rowSpan?: number; colSpan?: number }
        | undefined;
      const rowSpan = meta?.rowSpan;
      const colSpan = meta?.colSpan;

      // Inline editing
      const rowId = cell.row.id;
      const isEditing =
        editingCell?.rowId === rowId && editingCell?.columnId === columnId;
      const canEdit =
        editable &&
        !isSyntheticColumn &&
        (!editableColumnSet || editableColumnSet.has(columnId));

      // Column sizing
      const cellStyle: React.CSSProperties = {};
      if (enableColumnResizing) {
        const size = cell.column.getSize();
        cellStyle.width = size;
        cellStyle.minWidth = size;
        cellStyle.maxWidth = size;
      }

      // Grouped cell rendering
      const isGrouped = cell.getIsGrouped();
      const isAggregated = cell.getIsAggregated();
      const isPlaceholder = cell.getIsPlaceholder();

      if (isPlaceholder) {
        return (
          <td
            key={cell.id}
            className={`${cellClassName} ${densityClass}`}
            role="gridcell"
            style={Object.keys(cellStyle).length > 0 ? cellStyle : undefined}
          />
        );
      }

      const cellContent = isEditing ? (
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={commitEdit}
          onKeyDown={(e) => {
            if (e.key === "Enter") commitEdit();
            if (e.key === "Escape") cancelEdit();
          }}
          className={`w-full border rounded px-1 py-0.5 ${editInputClassName}`}
          data-edit-input
          autoFocus
        />
      ) : isGrouped ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            cell.row.toggleExpanded();
          }}
          className="flex items-center gap-1"
        >
          {cell.row.getIsExpanded() ? (
            <CollapseIcon className="w-4 h-4" />
          ) : (
            <ExpandIcon className="w-4 h-4" />
          )}
          {flexRender(cell.column.columnDef.cell, cell.getContext())} (
          {cell.row.subRows.length})
        </button>
      ) : isAggregated ? (
        flexRender(
          cell.column.columnDef.aggregatedCell ?? cell.column.columnDef.cell,
          cell.getContext(),
        )
      ) : (
        flexRender(cell.column.columnDef.cell, cell.getContext())
      );

      // Get text content for copy
      const cellTextValue = cell.getValue();
      const cellText = cellTextValue != null ? String(cellTextValue) : "";

      return (
        <td
          key={cell.id}
          className={`${cellClassName} ${isSyntheticColumn ? checkboxCellClassName : ""} ${densityClass}`}
          role="gridcell"
          tabIndex={isFocused ? 0 : -1}
          onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
          aria-selected={isFocused}
          data-focused={isFocused || undefined}
          data-editing={isEditing || undefined}
          data-grouped={isGrouped || undefined}
          onDoubleClick={
            canEdit
              ? () => handleCellDoubleClick(rowId, columnId, cell.getValue())
              : undefined
          }
          onClick={
            enableCopyOnClick && !isSyntheticColumn
              ? () => handleCellClick(cellText, rowId, columnId)
              : undefined
          }
          style={Object.keys(cellStyle).length > 0 ? cellStyle : undefined}
          rowSpan={rowSpan}
          colSpan={colSpan}
        >
          {cellContent}
        </td>
      );
    },
    [
      cellClassName,
      focusedCell,
      handleKeyDown,
      checkboxCellClassName,
      densityClass,
      editingCell,
      editValue,
      editable,
      editableColumnSet,
      handleCellDoubleClick,
      commitEdit,
      cancelEdit,
      editInputClassName,
      enableCopyOnClick,
      handleCellClick,
      enableColumnResizing,
    ],
  );

  const renderRow = useCallback(
    (
      row: Row<TData>,
      rowIndex: number,
      filterFn?: (columnId: string) => boolean,
    ) => {
      const selected = isRowSelected(row);
      const cells = row.getVisibleCells();
      const filteredCells = filterFn
        ? cells.filter((cell) => {
            const columnId = getColumnId(
              cell.column.columnDef as { accessorKey?: string; id?: string },
            );
            return filterFn(columnId);
          })
        : cells;

      const isStriped = striped && rowIndex % 2 === 1;
      const isExpanded = expandable && row.getIsExpanded();
      const totalCols = filteredCells.length;

      // Check if this is a group header row
      const isGroupRow = grouping.length > 0 && row.getIsGrouped();

      const rowDragProps = enableRowDragDrop
        ? {
            draggable: true,
            onDragStart: (e: React.DragEvent<HTMLTableRowElement>) =>
              handleDragStart(e, rowIndex),
            onDragOver: handleDragOver,
            onDrop: (e: React.DragEvent<HTMLTableRowElement>) =>
              handleDrop(e, rowIndex),
            onDragEnd: handleDragEnd,
          }
        : {};

      return (
        <React.Fragment key={row.id}>
          <tr
            className={`${selected ? selectedRowClassName : rowClassName} ${isStriped ? stripedClassNameProp || "bg-gray-50 dark:bg-white/[0.02]" : ""} ${isGroupRow ? groupHeaderClassName : ""} ${dragRowIndex === rowIndex ? "opacity-50" : ""} ${expandOnRowClick && expandable ? "cursor-pointer" : ""}`}
            onClick={(e) => handleRowClick(row, e)}
            onMouseEnter={(e) =>
              handleRowHover(rowIndex, { current: e.currentTarget })
            }
            onMouseLeave={() => handleRowHover(null)}
            onContextMenu={
              onContextMenu
                ? (e) => {
                    e.preventDefault();
                    onContextMenu(e, row.original);
                  }
                : undefined
            }
            role="row"
            aria-rowindex={rowIndex + 1}
            aria-selected={selected}
            data-selected={selected || undefined}
            data-clickable={onRowClick ? true : undefined}
            data-striped={isStriped || undefined}
            data-expanded={isExpanded || undefined}
            data-group-row={isGroupRow || undefined}
            data-dragging={dragRowIndex === rowIndex || undefined}
            {...rowDragProps}
          >
            {filteredCells.map((cell, colIndex) =>
              renderCell(cell, rowIndex, colIndex),
            )}
          </tr>
          {isExpanded && renderExpandedRow && !isGroupRow && (
            <tr data-expanded-content role="row">
              <td colSpan={totalCols} className={expandedRowClassName}>
                {renderExpandedRow(row.original)}
              </td>
            </tr>
          )}
        </React.Fragment>
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps -- React (Fragment) is a stable module import
    [
      isRowSelected,
      selectedRowClassName,
      rowClassName,
      handleRowClick,
      handleRowHover,
      renderCell,
      onRowClick,
      striped,
      expandable,
      renderExpandedRow,
      expandedRowClassName,
      enableRowDragDrop,
      handleDragStart,
      handleDragOver,
      handleDrop,
      handleDragEnd,
      dragRowIndex,
      onContextMenu,
      grouping,
      groupHeaderClassName,
      expandOnRowClick,
      stripedClassNameProp,
    ],
  );

  // Need React in scope for Fragment
  const React = { Fragment: __Fragment };

  const renderTable = useCallback(
    (
      filterFn: ((columnId: string) => boolean) | undefined,
      tableClass: string,
      containerClass: string,
      tableAriaLabel: string,
    ) => {
      const headerGroups = table.getHeaderGroups();
      const rows = table.getRowModel().rows;

      return (
        <div className={containerClass}>
          <table
            className={`${enableColumnResizing ? "table-fixed min-w-full" : "w-full"} ${tableClass}`}
            role="grid"
            aria-label={tableAriaLabel}
            style={
              enableColumnResizing
                ? {
                    width: Math.max(table.getCenterTotalSize(), 0) || undefined,
                  }
                : undefined
            }
          >
            {shouldShowHeader && (
              <thead
                className={`${headerClassName} ${stickyHeaderClass}`.trim()}
                role="rowgroup"
              >
                {headerGroups.map((headerGroup) => (
                  <tr
                    key={headerGroup.id}
                    className={headerRowClassName}
                    role="row"
                  >
                    {headerGroup.headers
                      .filter((header) => {
                        if (!filterFn) return true;
                        const columnId = getColumnId(
                          header.column.columnDef as {
                            accessorKey?: string;
                            id?: string;
                          },
                        );
                        return filterFn(columnId);
                      })
                      .map((header, index) => renderHeaderCell(header, index))}
                  </tr>
                ))}
              </thead>
            )}
            <tbody className={bodyClassName} role="rowgroup">
              {rows.map((row, index) => renderRow(row, index, filterFn))}
            </tbody>
            {/* Footer */}
            {showFooter && (
              <tfoot
                className={footerClassName}
                role="rowgroup"
                data-table-footer
              >
                {footerContent
                  ? footerContent
                  : table.getFooterGroups().map((footerGroup) => (
                      <tr key={footerGroup.id} role="row">
                        {footerGroup.headers
                          .filter((header) => {
                            if (!filterFn) return true;
                            const columnId = getColumnId(
                              header.column.columnDef as {
                                accessorKey?: string;
                                id?: string;
                              },
                            );
                            return filterFn(columnId);
                          })
                          .map((header) => (
                            <td
                              key={header.id}
                              colSpan={
                                header.colSpan > 1 ? header.colSpan : undefined
                              }
                            >
                              {header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.footer,
                                    header.getContext(),
                                  )}
                            </td>
                          ))}
                      </tr>
                    ))}
              </tfoot>
            )}
          </table>
        </div>
      );
    },
    [
      table,
      shouldShowHeader,
      headerClassName,
      stickyHeaderClass,
      headerRowClassName,
      bodyClassName,
      renderHeaderCell,
      renderRow,
      showFooter,
      footerContent,
      footerClassName,
      enableColumnResizing,
    ],
  );

  const handleMouseMove = useCallback(
    (event: React.MouseEvent) => {
      if (isFloatingActionsHovered || isPopupOpen) {
        return;
      }

      const rect = (
        event as unknown as { currentTarget: Element }
      ).currentTarget.getBoundingClientRect();
      const x = (event as unknown as { clientX: number }).clientX - rect.left;
      const y = (event as unknown as { clientY: number }).clientY - rect.top;

      const isOverHeader = shouldShowHeader && y < 60;
      onCursorOverHeader?.(isOverHeader);
      onCursorPosition?.({ x, y });
    },
    [
      onCursorPosition,
      isFloatingActionsHovered,
      isPopupOpen,
      shouldShowHeader,
      onCursorOverHeader,
    ],
  );

  const handleMouseLeave = useCallback(() => {
    onRowHover?.(null);
    if (!isFloatingActionsHovered && !isPopupOpen) {
      onCursorPosition?.(null);
      onCursorOverHeader?.(false);
    }
  }, [
    onRowHover,
    isFloatingActionsHovered,
    isPopupOpen,
    onCursorPosition,
    onCursorOverHeader,
  ]);

  if (loading) {
    return (
      <div
        ref={ref}
        className={
          `${containerClassName} ${className ?? ""}`.trim() || undefined
        }
        style={{ overflow: "hidden", ...containerStyle, ...styleProp }}
      >
        <TableShimmer
          rowCount={shimmerRowCount}
          className={shimmerClassName}
          rowClassName={shimmerRowClassName}
          cellClassName={shimmerCellClassName}
          shimmerClassName={shimmerBarClassName}
        />
      </div>
    );
  }

  const rows = table.getRowModel().rows;
  const isEmpty = rows.length === 0;

  // ── Mobile card view ──────────────────────────────────────────────────
  if (isMobileView && renderMobileCard) {
    return (
      <div
        ref={(node) => {
          (
            containerRef as React.MutableRefObject<HTMLDivElement | null>
          ).current = node;
          if (typeof ref === "function") ref(node);
          else if (ref)
            (ref as React.MutableRefObject<HTMLDivElement | null>).current =
              node;
        }}
        className={
          `${containerClassName} ${className ?? ""}`.trim() || undefined
        }
        style={{ overflow: "hidden", ...containerStyle, ...styleProp }}
        role="region"
        aria-label={ariaLabel}
        data-table-container
        data-mobile-view
      >
        {/* Search bar for mobile */}
        {showSearch && (
          <div className={`mb-2 ${searchBarClassName}`} data-table-search>
            <div className="relative">
              {CustomSearchIcon ? (
                <CustomSearchIcon className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              ) : (
                <SearchIcon className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              )}
              <input
                type="text"
                value={globalFilter ?? ""}
                onChange={handleSearchChange}
                placeholder={searchPlaceholder}
                className={`w-full pl-8 pr-8 py-2 border rounded bg-inherit text-inherit border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 ${searchInputClassName}`}
                aria-label="Search table"
              />
              {globalFilter && (
                <button
                  type="button"
                  onClick={() => {
                    setInternalGlobalFilter("");
                    onGlobalFilterChange?.("");
                    table.setGlobalFilter("");
                    onSearchClear?.();
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  aria-label="Clear search"
                >
                  <svg
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="w-3.5 h-3.5"
                  >
                    <path d="M4.646 4.646a.5.5 0 01.708 0L8 7.293l2.646-2.647a.5.5 0 01.708.708L8.707 8l2.647 2.646a.5.5 0 01-.708.708L8 8.707l-2.646 2.647a.5.5 0 01-.708-.708L7.293 8 4.646 5.354a.5.5 0 010-.708z" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        )}
        {children}
        {isEmpty
          ? emptyContent || (
              <div className={emptyClassName}>
                <span>No data available</span>
              </div>
            )
          : rows.map((row) => (
              <div
                key={row.id}
                className={mobileCardClassName}
                data-mobile-card
                onClick={(e) => {
                  if (onRowClick && !isInteractiveElement(e.target)) {
                    onRowClick(row.original);
                  }
                }}
                onContextMenu={
                  onContextMenu
                    ? (e) => {
                        e.preventDefault();
                        onContextMenu(e, row.original);
                      }
                    : undefined
                }
              >
                {renderMobileCard(row.original)}
              </div>
            ))}
        {/* Infinite scroll loading for mobile */}
        {enableInfiniteScroll && loadingMore && (
          <div
            className={`text-center flex items-center justify-center py-3 text-gray-400 ${loadingMoreClassName}`}
            data-loading-more
          >
            {loadingMoreContent ?? "Loading more..."}
          </div>
        )}
      </div>
    );
  }

  const allColumnIds = table
    .getAllLeafColumns()
    .map((col) =>
      getColumnId(col.columnDef as { accessorKey?: string; id?: string }),
    );

  // Synthetic columns (__selection, __expand, __dragHandle) should always appear in the unpinned/main section
  const syntheticColumnIds = new Set([
    "__selection",
    "__expand",
    "__dragHandle",
  ]);

  const hasUnpinnedColumns = allColumnIds.some(
    (id) => !pinnedColumnIds.has(id) && !pinnedRightColumnIds.has(id),
  );
  const allColumnsPinned =
    hasPinnedColumns && !hasUnpinnedColumns && !hasPinnedRightColumns;

  const defaultUnpinnedContainerClass =
    hasPinnedColumns || hasPinnedRightColumns
      ? stickyHeader
        ? "min-w-0 flex-1 overflow-x-auto"
        : "min-w-0 flex-1 overflow-x-auto"
      : "w-full min-w-0 overflow-x-auto";

  const finalPinnedContainerClass = allColumnsPinned
    ? "w-full"
    : pinnedContainerClassName || "shrink-0 sticky left-0 z-20 bg-inherit";

  const finalPinnedTableClass = allColumnsPinned
    ? `w-full ${pinnedTableClassName || tableClassName}`
    : pinnedTableClassName || tableClassName;

  const finalPinnedRightContainerClass =
    pinnedRightContainerClassName || "shrink-0 sticky right-0 z-20 bg-inherit";

  const finalPinnedRightTableClass =
    pinnedRightTableClassName || tableClassName;

  return (
    <div
      ref={(node) => {
        (
          containerRef as React.MutableRefObject<HTMLDivElement | null>
        ).current = node;
        if (typeof ref === "function") ref(node);
        else if (ref)
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }}
      className={
        `${containerClassName} ${scrollbarHideClass} ${className ?? ""}`.trim() ||
        undefined
      }
      style={{ overflow: "hidden", ...containerStyle, ...styleProp }}
      role="region"
      aria-label={ariaLabel}
      data-table-container
      data-striped={striped || undefined}
      data-density={density}
    >
      {/* Search bar */}
      {showSearch &&
        (() => {
          const iconPos = searchIconPosition;
          const showIcon = iconPos !== "none";
          const iconLeft = iconPos === "left";
          const IconComponent = CustomSearchIcon || SearchIcon;
          const inputPl = showIcon && iconLeft ? "pl-8" : "pl-3";
          const inputPr = globalFilter
            ? "pr-8"
            : showIcon && !iconLeft
              ? "pr-8"
              : "pr-3";

          return (
            <div className={`mb-2 ${searchBarClassName}`} data-table-search>
              <div className="relative">
                {showIcon && (
                  <IconComponent
                    className={`w-4 h-4 absolute top-1/2 -translate-y-1/2 text-gray-400 ${iconLeft ? "left-2.5" : "right-2.5"}`}
                  />
                )}
                <input
                  type="text"
                  value={globalFilter ?? ""}
                  onChange={handleSearchChange}
                  placeholder={searchPlaceholder}
                  className={`w-full ${inputPl} ${inputPr} py-2 border rounded bg-inherit text-inherit border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 ${searchInputClassName}`}
                  aria-label="Search table"
                />
                {globalFilter && (
                  <button
                    type="button"
                    onClick={() => {
                      setInternalGlobalFilter("");
                      onGlobalFilterChange?.("");
                      table.setGlobalFilter("");
                      onSearchClear?.();
                    }}
                    className={`absolute top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 ${showIcon && !iconLeft ? "right-8" : "right-2.5"}`}
                    aria-label="Clear search"
                  >
                    <svg
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="w-3.5 h-3.5"
                    >
                      <path d="M4.646 4.646a.5.5 0 01.708 0L8 7.293l2.646-2.647a.5.5 0 01.708.708L8.707 8l2.647 2.646a.5.5 0 01-.708.708L8 8.707l-2.646 2.647a.5.5 0 01-.708-.708L7.293 8 4.646 5.354a.5.5 0 010-.708z" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          );
        })()}

      {children}

      <div
        className={`flex w-full min-w-0 overflow-hidden ${floatingActions ? "relative" : ""}`}
        data-testid="table-container"
        onMouseMove={onCursorPosition ? handleMouseMove : undefined}
        onMouseLeave={onCursorPosition ? handleMouseLeave : undefined}
      >
        {hasPinnedColumns &&
          renderTable(
            (columnId) =>
              pinnedColumnIds.has(columnId) &&
              !syntheticColumnIds.has(columnId),
            finalPinnedTableClass,
            finalPinnedContainerClass,
            `${ariaLabel} - Pinned columns`,
          )}

        {hasUnpinnedColumns &&
          renderTable(
            hasPinnedColumns || hasPinnedRightColumns
              ? (columnId) =>
                  !pinnedColumnIds.has(columnId) &&
                  !pinnedRightColumnIds.has(columnId)
              : undefined,
            unpinnedTableClassName || tableClassName,
            unpinnedContainerClassName || defaultUnpinnedContainerClass,
            hasPinnedColumns || hasPinnedRightColumns
              ? `${ariaLabel} - Scrollable columns`
              : ariaLabel,
          )}

        {hasPinnedRightColumns &&
          renderTable(
            (columnId) =>
              pinnedRightColumnIds.has(columnId) &&
              !syntheticColumnIds.has(columnId),
            finalPinnedRightTableClass,
            finalPinnedRightContainerClass,
            `${ariaLabel} - Right pinned columns`,
          )}

        {floatingActions && (
          <div
            role="complementary"
            aria-label="Table actions"
            className="absolute inset-0 pointer-events-none overflow-hidden"
          >
            <div className="pointer-events-auto">{floatingActions}</div>
          </div>
        )}
      </div>

      {/* Infinite scroll loading indicator */}
      {enableInfiniteScroll && loadingMore && (
        <div
          className={`w-full text-center flex items-center justify-center py-3 text-gray-400 ${loadingMoreClassName}`}
          data-loading-more
        >
          {loadingMoreContent ?? "Loading more..."}
        </div>
      )}
      {enableInfiniteScroll && !hasMore && infiniteEndContent !== undefined && (
        <div
          className={`w-full text-center py-3 text-gray-500 text-sm ${loadingMoreClassName}`}
        >
          {infiniteEndContent}
        </div>
      )}

      {isEmpty &&
        (emptyContent || (
          <div className={emptyClassName}>
            <span>No data available</span>
          </div>
        ))}

      {/* Column filter dropdown portal */}
      {filterDropdownState &&
        filterableColumns &&
        filterableColumns[filterDropdownState.columnId] &&
        createPortal(
          <div
            ref={filterDropdownRef}
            data-table-filter-content
            className={`fixed rounded-lg border shadow-xl overflow-hidden min-w-[180px] z-[9999] ${renderColumnFilter ? "" : "max-h-[250px] overflow-y-auto"} ${filterDropdownClassName || "bg-white dark:bg-gray-900 border-gray-200 dark:border-white/[0.08]"}`}
            style={{
              top: filterDropdownState.top,
              left: filterDropdownState.left,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {renderColumnFilter ? (
              renderColumnFilter(
                filterDropdownState.columnId,
                getColumnFilterValues(filterDropdownState.columnId),
                (values) =>
                  setColumnFilterValues(filterDropdownState.columnId, values),
              )
            ) : (
              <>
                <div className="px-3 py-2 border-b border-gray-100 dark:border-white/[0.06] flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Filter {filterDropdownState.columnId}
                  </span>
                  {getColumnFilterValues(filterDropdownState.columnId).length >
                    0 && (
                    <button
                      type="button"
                      onClick={() =>
                        setColumnFilterValues(filterDropdownState.columnId, [])
                      }
                      className="text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
                {filterableColumns[filterDropdownState.columnId].options.map(
                  (opt) => {
                    const currentVals = getColumnFilterValues(
                      filterDropdownState.columnId,
                    );
                    const isSelected = currentVals.includes(opt.value);
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm cursor-pointer transition-colors ${isSelected ? "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300" : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.04]"}`}
                        onClick={() => {
                          if (
                            filterableColumns[filterDropdownState.columnId]
                              .multi !== false
                          ) {
                            setColumnFilterValues(
                              filterDropdownState.columnId,
                              isSelected
                                ? currentVals.filter((v) => v !== opt.value)
                                : [...currentVals, opt.value],
                            );
                          } else {
                            setColumnFilterValues(
                              filterDropdownState.columnId,
                              isSelected ? [] : [opt.value],
                            );
                            setFilterDropdownState(null);
                          }
                        }}
                      >
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${isSelected ? "bg-blue-500 border-blue-500 dark:bg-blue-600 dark:border-blue-600" : "border-gray-300 dark:border-gray-600"}`}
                        >
                          {isSelected && (
                            <svg
                              width="10"
                              height="10"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="white"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        {opt.label}
                      </button>
                    );
                  },
                )}
              </>
            )}
          </div>,
          document.body,
        )}
    </div>
  );
}

// Import Fragment for use inside renderRow
import { Fragment as __Fragment } from "react";

const Table = forwardRef(TableInner) as <TData>(
  props: TableProps<TData> & { ref?: React.Ref<HTMLDivElement> },
) => React.ReactElement | null;

export default memo(Table) as typeof Table;
