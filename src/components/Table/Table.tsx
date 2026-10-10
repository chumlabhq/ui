import {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
  useId,
  memo,
  forwardRef,
  Fragment,
  isValidElement,
} from "react";
import { createPortal } from "react-dom";
import { isBrowser } from "../../utils/isBrowser.js";
import { useIsomorphicLayoutEffect } from "../../utils/useIsomorphicLayoutEffect.js";
import { useLazyComponent } from "../../utils/useLazyComponent.js";
import { cn } from "../../utils/scopedCn.js";
import { mergeSlot } from "../../utils/mergeSlot.js";
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
import type { TableProps } from "./utils/types.js";
import {
  getColumnId,
  getSortDirection,
  isInteractiveElement,
  copyToClipboard,
} from "./utils.js";
import TableShimmer from "./TableShimmer.js";
import type { FilterPanelProps } from "./FilterPanel.js";
import {
  DEFAULT_TABLE_CLASSES,
  UNSTYLED_TABLE_CLASSES,
  TABLE_HIT_AREA,
  TABLE_DRAG_HANDLE,
  TABLE_CHECKBOX_SIZE,
  TABLE_EXPAND_ICON_SIZE,
  TABLE_FILTER_ICON_SIZE,
  TABLE_CUSTOM_CHECKBOX,
  TABLE_CUSTOM_CHECKBOX_DISABLED,
  TABLE_CUSTOM_CHECKBOX_INPUT,
  TABLE_CUSTOM_CHECKBOX_ICON,
} from "./constants.js";
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
} from "./icons.js";

const EMPTY_DATA: unknown[] = [];

const sizePaddingMap = {
  sm: "px-2 py-1 text-xs",
  md: "px-3 py-2.5 text-sm",
  lg: "px-5 py-4 text-base",
} as const;

/** What a server assumes, and therefore what the first client render must say. */
const SERVER_VIEWPORT_WIDTH = 1024;

/**
 * Viewport width for the responsive breakpoint.
 *
 * Seeded with the server's assumption rather than the real width: a
 * `window.innerWidth` read in the initializer runs during hydration, and with
 * `responsiveBreakpoint` and `renderMobileCard` set it decides between a table
 * and a list of cards — two different trees for one page. Measured in a layout
 * effect instead, so the correction lands before paint.
 */
function useViewportWidth(): number {
  const [width, setWidth] = useState(SERVER_VIEWPORT_WIDTH);
  const rafId = useRef(0);
  useIsomorphicLayoutEffect(() => {
    if (!isBrowser) return;
    setWidth(window.innerWidth);
    const handler = () => {
      cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => {
        setWidth(window.innerWidth);
      });
    };
    window.addEventListener("resize", handler);
    return () => {
      cancelAnimationFrame(rafId.current);
      window.removeEventListener("resize", handler);
    };
  }, []);
  return width;
}

/** Module-scope constant: an inline arrow would miss the cache every render. */
const loadFilterPanel = () =>
  import("./FilterPanel.js").then((m) => m.default);

const FALLBACK_COLUMNS: never[] = [];
const FALLBACK_DATA: never[] = [];

/**
 * Only `<tr>`s: one, a fragment of them, or an array — what `<tfoot>` takes
 * directly. A footer of rows renders as it is; wrapping it in our own full-width
 * row nested each `<tr>` in a `<td>`, which the browser reports on load and the
 * HTML parser rearranges, so server markup and the client disagree.
 */
const isRows = (node: React.ReactNode): boolean =>
  Array.isArray(node)
    ? node.length > 0 && node.every(isRows)
    : isValidElement<{ children?: React.ReactNode }>(node) &&
      (node.type === "tr" || (node.type === Fragment && isRows(node.props.children)));

/**
 * Component: Table
 *
 * Purpose:
 * Feature-rich data table with sorting, filtering, selection, pinned columns,
 * row expansion, drag-and-drop, inline editing, column resizing, infinite scroll,
 * search, CSV export, and full style customization. Built on TanStack Table.
 *
 * AI Usage Guidelines:
 * - Minimum: `<Table columns={[...]} data={[...]} />`
 * - Use `sortable` for column sorting, `selectable` for row selection
 * - Use `pinnedColumns` for fixed columns, `expandable` for row details
 * - Pair with `<Pagination>` for paged data display
 *
 * Behavior:
 * - Horizontal scroll via `overflow-x-auto` on unpinned container
 * - Pinned columns stay fixed while scrollable columns scroll
 * - Supports sticky header with `stickyHeader` + `maxHeight`
 *
 * Reference:
 * - TABLE.ai.md (this directory) — full AI knowledge doc
 * - src/pages/demo/TableDemo.tsx — live demo
 */
function TableInner<TData>(
  {
    columns: columnsProp,
    data: dataProp,
    loading = false,
    showHeader = true,
    pinnedColumns = [],
    onPinnedColumnsChange,
    pinnableColumns,
    maxPinnedColumns = 3,
    onCursorPositionChange,
    onHeaderHoverChange,
    emptyContent,
    "aria-label": tableLabel = "Data table",
    caption,
    getRowId,
    selectedRowId,
    onRowClick,
    onRowHover,
    floatingActions,
    floatingActionsHovered = false,
    popupOpen = false,
    maxWidth,
    maxHeight,
    minHeight,
    hideVerticalScrollbar = false,
    hideHorizontalScrollbar = false,
    stickyHeader = false,
    classes: classesProp,
    unstyled = false,
    style: styleProp,
    pinIcon,
    pinnedIcon,
    shimmerCount = 10,
    className,
    children,

    sortable = false,
    onSortingChange,
    sorting: sortingProp,
    manualSorting = false,

    selectionMode = "none",
    selectedRowIds: selectedRowIdsProp,
    onSelectedRowIdsChange,
    selectAllMode = "page",

    globalFilter: globalFilterProp,
    onGlobalFilterChange,

    columnFilters: columnFiltersProp,
    onColumnFiltersChange,
    filterable = false,
    filterableColumns,
    renderFilterIcon,
    renderColumnFilter,

    expandable = false,
    expandedRowIds: expandedRowIdsProp,
    onExpandedRowIdsChange,
    renderExpandedRow,
    renderExpandIcon,
    expandColumnPosition = "start",
    expandOnRowClick = false,

    columnVisibility: columnVisibilityProp,
    onColumnVisibilityChange,

    striped = false,
    stripedClassName: stripedClassNameProp,

    size = "md",

    pinnedRightColumns = [],

    editable = false,
    editableColumns,
    onCellEdit,

    resizable = false,
    columnSizing: columnSizingProp,
    onColumnSizingChange,

    manualPagination = false,
    manualFiltering = false,

    columnOrder: columnOrderProp,
    onColumnOrderChange,

    reorderable = false,
    onRowReorder,
    dragColumnPosition = "start",

    showFooter = false,
    footerContent,

    onContextMenu,

    copyOnClick = false,
    onCellCopy,

    infiniteScroll = false,
    onLoadMore,
    hasMore = false,
    loadingMore = false,
    infiniteEndContent,

    responsiveBreakpoint,
    renderMobileCard,

    groupBy: groupByProp,
    onGroupByChange,

    showSearch = false,
    searchPlaceholder = "Search...",
    searchIconPosition = "start",

    renderCheckboxIcon,
    checkboxColor,
    dragHandleIcon,
    searchIcon,
    onSearchClear,
    loadingMoreContent,
  }: TableProps<TData>,
  ref: React.Ref<HTMLDivElement>,
) {
  const prefersReducedMotion = useReducedMotion();
  const baseRaw = unstyled ? UNSTYLED_TABLE_CLASSES : DEFAULT_TABLE_CLASSES;
  const base = motionSafeClasses(baseRaw, prefersReducedMotion);

  const containerClassName = mergeSlot(base.root, classesProp?.root);
  const tableClassName = mergeSlot(base.list, classesProp?.list);
  const headerClassName = mergeSlot(base.header, classesProp?.header);
  const headerRowClassName = mergeSlot(base.headerRow, classesProp?.headerRow);
  const headerCellClassName = mergeSlot(base.headerCell, classesProp?.headerCell);
  const headerCellContentClassName = mergeSlot(base.headerCellText, classesProp?.headerCellText);
  const bodyClassName = mergeSlot(base.body, classesProp?.body);
  const rowClassName = mergeSlot(base.item, classesProp?.item);
  const cellClassName = mergeSlot(base.cell, classesProp?.cell);
  const pinnedContainerClassName = mergeSlot(base.pinnedRegion, classesProp?.pinnedRegion);
  const pinnedTableClassName = mergeSlot(base.pinnedList, classesProp?.pinnedList);
  const unpinnedContainerClassName = mergeSlot(base.scrollRegion, classesProp?.scrollRegion);
  const unpinnedTableClassName = mergeSlot(base.list, classesProp?.list);
  const emptyClassName = mergeSlot(base.empty, classesProp?.empty);
  const pinIconClassName = mergeSlot(base.pinIcon, classesProp?.pinIcon);
  const pinButtonClassName = mergeSlot(base.pinTrigger, classesProp?.pinTrigger);
  const shimmerClassName = mergeSlot(base.loading, classesProp?.loading);
  const shimmerRowClassName = mergeSlot(base.loadingRow, classesProp?.loadingRow);
  const shimmerCellClassName = mergeSlot(base.loadingItem, classesProp?.loadingItem);
  const shimmerBarClassName = mergeSlot(base.loadingBar, classesProp?.loadingBar);
  const checkboxClassName = mergeSlot(base.control, classesProp?.control);
  const checkboxCellClassName = mergeSlot(base.cell, classesProp?.cell);
  const sortIconClassName = mergeSlot(base.sortIcon, classesProp?.sortIcon);
  const expandIconClassName = mergeSlot(base.expandTrigger, classesProp?.expandTrigger);
  const pinnedRightContainerClassName = mergeSlot(base.pinnedRightRegion, classesProp?.pinnedRightRegion);
  const pinnedRightTableClassName = mergeSlot(base.pinnedRightList, classesProp?.pinnedRightList);
  const editInputClassName = mergeSlot(base.input, classesProp?.input);
  const dragHandleClassName = mergeSlot(base.dragHandle, classesProp?.dragHandle);
  const footerClassName = mergeSlot(base.footer, classesProp?.footer);
  const searchBarClassName = mergeSlot(base.searchControl, classesProp?.searchControl);
  const mobileCardClassName = mergeSlot(base.mobileCard, classesProp?.mobileCard);
  const groupHeaderClassName = mergeSlot(base.groupLabel, classesProp?.groupLabel);
  const resizeHandleClassName = mergeSlot(base.resizeHandle, classesProp?.resizeHandle);
  const resizeIndicatorClassName = mergeSlot(base.resizeIndicator, classesProp?.resizeIndicator);
  const filterIconClassName = mergeSlot(base.filterTrigger, classesProp?.filterTrigger);
  const filterDropdownClassName = mergeSlot(base.filterContent, classesProp?.filterContent);
  const loadingMoreClassName = mergeSlot(base.loadingFooter, classesProp?.loadingFooter);
  const searchInputClassName = mergeSlot(base.searchInput, classesProp?.searchInput);
  const searchIconClassName = mergeSlot(base.searchIcon, classesProp?.searchIcon);
  const filterHeaderClassName = mergeSlot(base.filterHeader, classesProp?.filterHeader);
  const filterLabelClassName = mergeSlot(base.filterLabel, classesProp?.filterLabel);
  const filterClearTriggerClassName = mergeSlot(base.filterClearTrigger, classesProp?.filterClearTrigger);
  const filterItemClassName = mergeSlot(base.filterItem, classesProp?.filterItem);
  const filterItemControlClassName = mergeSlot(base.filterItemControl, classesProp?.filterItemControl);
  const clearTriggerClassName = mergeSlot(base.clearTrigger, classesProp?.clearTrigger);

  const filterPanelClasses = useMemo(
    () => ({
      content: filterDropdownClassName,
      header: filterHeaderClassName,
      label: filterLabelClassName,
      clearTrigger: filterClearTriggerClassName,
      item: filterItemClassName,
      itemControl: filterItemControlClassName,
    }),
    [
      filterDropdownClassName,
      filterHeaderClassName,
      filterLabelClassName,
      filterClearTriggerClassName,
      filterItemClassName,
      filterItemControlClassName,
    ],
  );

  const columns = columnsProp ?? FALLBACK_COLUMNS;
  const data = dataProp ?? FALLBACK_DATA;
  const shouldShowHeader = showHeader;
  const [focusedCell, setFocusedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [editingCell, setEditingCell] = useState<{
    rowId: string;
    columnId: string;
  } | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  // The cell an Enter or Escape left, focused again once the editor is gone.
  const editReturnRef = useRef<HTMLElement | null>(null);

  const [dragRowIndex, setDragRowIndex] = useState<number | null>(null);

  const [filterDropdownState, setFilterDropdownState] = useState<{
    columnId: string;
    top: number;
    left: number;
  } | null>(null);
  const openFilterColumn = filterDropdownState?.columnId ?? null;
  const filterDropdownId = `${useId()}-column-filter`;
  // The filter icon button, so the panel can tell its own trigger from an
  // outside click.
  const filterTriggerRef = useRef<HTMLButtonElement | null>(null);

  const FilterPanel = useLazyComponent<FilterPanelProps>(
    filterDropdownState !== null,
    loadFilterPanel,
  );

  // Stable: the panel subscribes its outside-click and scroll listeners to
  // this, and a new identity every render would re-subscribe both on every
  // hover the table re-renders for.
  const closeFilterPanel = useCallback(() => {
    setFilterDropdownState(null);
    filterTriggerRef.current?.focus();
  }, []);

  const [internalSorting, setInternalSorting] = useState<SortingState>([]);
  const sorting = sortingProp ?? internalSorting;

  const [internalColumnFilters, setInternalColumnFilters] =
    useState<ColumnFiltersState>([]);
  const columnFilters = columnFiltersProp ?? internalColumnFilters;

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

  const [internalGlobalFilter, setInternalGlobalFilter] = useState<string>("");
  const globalFilter = globalFilterProp ?? internalGlobalFilter;

  const [internalColumnVisibility, setInternalColumnVisibility] =
    useState<VisibilityState>({});
  const columnVisibility = columnVisibilityProp ?? internalColumnVisibility;

  const [internalColumnSizing, setInternalColumnSizing] =
    useState<ColumnSizingState>({});
  const columnSizing = columnSizingProp ?? internalColumnSizing;

  const [internalColumnOrder, setInternalColumnOrder] =
    useState<ColumnOrderState>([]);
  const columnOrder = columnOrderProp ?? internalColumnOrder;

  const grouping: GroupingState = useMemo(
    () => groupByProp ?? [],
    [groupByProp],
  );

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

  const editableColumnSet = useMemo(
    () => (editableColumns ? new Set(editableColumns) : null),
    [editableColumns],
  );

  // Read at render time: an inline icon as a column dependency remounted the focused checkbox.
  // The expand and drag-handle icons are inline elements and functions too, so the same applies.
  const checkboxIconRef = useRef(renderCheckboxIcon);
  checkboxIconRef.current = renderCheckboxIcon;
  const hasCustomCheckboxIcon = Boolean(renderCheckboxIcon);
  const expandIconRef = useRef(renderExpandIcon);
  expandIconRef.current = renderExpandIcon;
  const hasCustomExpandIcon = Boolean(renderExpandIcon);
  const dragHandleIconRef = useRef(dragHandleIcon);
  dragHandleIconRef.current = dragHandleIcon;
  const hasCustomDragHandleIcon = dragHandleIcon != null;

  const augmentedColumns = useMemo(() => {
    const cols: ColumnDef<TData, unknown>[] = [];

    const dragCol: ColumnDef<TData, unknown> | null = reorderable
      ? ({
          id: "__dragHandle",
          header: () => null,
          // SC 2.5.7: a button that moves the row with the arrow keys is the
          // alternative the criterion asks for — a route that is not a drag,
          // rather than a larger drag target.
          cell: ({ row }) => (
            <button
              type="button"
              className={`${TABLE_DRAG_HANDLE} ${dragHandleClassName}`}
              data-drag-handle
              aria-label={`Reorder row ${row.index + 1}. Use the arrow keys to move it.`}
              onKeyDown={(e) => {
                const to =
                  e.key === "ArrowUp"
                    ? row.index - 1
                    : e.key === "ArrowDown"
                      ? row.index + 1
                      : null;
                if (to === null) return;
                e.preventDefault();
                if (to < 0 || to >= data.length) return;
                onRowReorder?.(row.index, to);
              }}
            >
              {hasCustomDragHandleIcon ? dragHandleIconRef.current : <DragHandleIcon className="w-4 h-4" />}
            </button>
          ),
          size: 40,
          enableSorting: false,
          enableColumnFilter: false,
          enableResizing: false,
        } as ColumnDef<TData, unknown>)
      : null;

    if (dragCol && dragColumnPosition === "start") {
      cols.push(dragCol);
    }

    if (selectionMode === "multiple") {
      // The default checkbox, every time. With a custom icon the same input is
      // visually hidden inside a label beside the icon, which is presentational.
      const selectBox = (
        checked: boolean,
        indeterminate: boolean,
        disabled: boolean,
        onChange: (event: unknown) => void,
        label: string,
        iconClassName?: string,
      ) => {
        const renderIcon = hasCustomCheckboxIcon ? checkboxIconRef.current : undefined;
        const input = (
          <input
            type="checkbox"
            className={renderIcon ? TABLE_CUSTOM_CHECKBOX_INPUT : `${TABLE_CHECKBOX_SIZE} ${checkboxClassName ?? ""}`}
            style={!renderIcon && checkboxColor ? { accentColor: checkboxColor } : undefined}
            checked={checked}
            ref={(el) => {
              if (el) {
                el.indeterminate = indeterminate;
              }
            }}
            disabled={disabled}
            onChange={onChange}
            aria-label={label}
          />
        );
        if (!renderIcon) return input;
        return (
          <label data-interactive className={cn(TABLE_CUSTOM_CHECKBOX, disabled && TABLE_CUSTOM_CHECKBOX_DISABLED)}>
            {input}
            <span aria-hidden="true" className={TABLE_CUSTOM_CHECKBOX_ICON}>
              {renderIcon({ checked, indeterminate, className: iconClassName })}
            </span>
          </label>
        );
      };
      cols.push({
        id: "__selection",
        header: ({ table: t }) =>
          selectBox(
            selectAllMode === "all" ? t.getIsAllRowsSelected() : t.getIsAllPageRowsSelected(),
            selectAllMode === "all" ? t.getIsSomeRowsSelected() : t.getIsSomePageRowsSelected(),
            false,
            selectAllMode === "all" ? t.getToggleAllRowsSelectedHandler() : t.getToggleAllPageRowsSelectedHandler(),
            "Select all rows",
            `${TABLE_CHECKBOX_SIZE} ${checkboxClassName ?? ""}`,
          ),
        cell: ({ row }) =>
          selectBox(
            row.getIsSelected(),
            false,
            !row.getCanSelect(),
            row.getToggleSelectedHandler(),
            `Select row ${row.id}`,
            checkboxClassName,
          ),
        size: 40,
        maxSize: 40,
        minSize: 40,
        enableSorting: false,
        enableColumnFilter: false,
        enableResizing: false,
      } as ColumnDef<TData, unknown>);
    }

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
                className={`${TABLE_HIT_AREA} shrink-0 transition-transform cursor-pointer ${expandIconClassName}`}
                aria-label={isExpanded ? "Collapse row" : "Expand row"}
                data-expanded={isExpanded || undefined}
              >
                {hasCustomExpandIcon && expandIconRef.current ? (
                  expandIconRef.current({ expanded: isExpanded, className: TABLE_EXPAND_ICON_SIZE })
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

    if (expandCol && expandColumnPosition === "start") {
      cols.push(expandCol);
    }

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

    if (expandCol && expandColumnPosition === "end") {
      cols.push(expandCol);
    }

    if (dragCol && dragColumnPosition === "end") {
      cols.push(dragCol);
    }

    return cols;
  }, [
    // The drag handle's keyboard reorder closes over both; without them the
    // memoised column would keep calling the first `onRowReorder` it saw.
    data.length,
    onRowReorder,
    columns,
    selectionMode,
    expandable,
    checkboxClassName,
    expandIconClassName,
    reorderable,
    dragHandleClassName,
    hasCustomCheckboxIcon,
    checkboxColor,
    hasCustomDragHandleIcon,
    hasCustomExpandIcon,
    expandColumnPosition,
    dragColumnPosition,
    filterableColumns,
    selectAllMode,
  ]);

  const sizeClass = sizePaddingMap[size] || "";

  const needsFiltering =
    globalFilter !== undefined ||
    filterable ||
    showSearch ||
    !!filterableColumns;

  const table = useReactTable({
    data: data ?? (EMPTY_DATA as TData[]),
    columns: augmentedColumns,
    getCoreRowModel: getCoreRowModel(),
    autoResetPageIndex: false,
    manualPagination,
    filterFns: {
      multiValue: (row, columnId, filterValue) => {
        if (!Array.isArray(filterValue) || filterValue.length === 0)
          return true;
        const cellValue = String(row.getValue(columnId)).toLowerCase();
        return filterValue.some((v: string) => cellValue === v.toLowerCase());
      },
    },
    ...(filterableColumns ? { filterable: true } : {}),

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
      // Grouping also renders expandable group rows; without `expanded`
      // in state, clicking a group's toggle does nothing because tanstack
      // can't track which groups are open.
      ...(expandable || grouping.length > 0 ? { expanded } : {}),
      columnVisibility,
      ...(selectionMode !== "none" ? { rowSelection } : {}),
      ...(resizable ? { columnSizing } : {}),
      ...(columnOrder.length > 0 ? { columnOrder } : {}),
      ...(grouping.length > 0 ? { grouping } : {}),
    },

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
          filterable,
        }
      : {}),

    // Expansion (also required by grouping — group rows are expandable
    // and their sub-rows only render when `getExpandedRowModel` is set).
    ...(expandable || grouping.length > 0
      ? {
          getExpandedRowModel: getExpandedRowModel(),
          onExpandedChange: (updater) => {
            const newExpanded =
              typeof updater === "function" ? updater(expanded) : updater;
            setInternalExpanded(newExpanded);
            if (onExpandedRowIdsChange && typeof newExpanded === "object") {
              onExpandedRowIdsChange(
                Object.keys(newExpanded).filter(
                  (k) => (newExpanded as Record<string, boolean>)[k],
                ),
              );
            }
          },
          getRowCanExpand: () => true,
        }
      : {}),

    onColumnVisibilityChange: (updater) => {
      const newVisibility =
        typeof updater === "function" ? updater(columnVisibility) : updater;
      setInternalColumnVisibility(newVisibility);
      onColumnVisibilityChange?.(newVisibility);
    },

    ...(selectionMode !== "none"
      ? {
          enableRowSelection: true,
          enableMultiRowSelection: selectionMode === "multiple",
          onRowSelectionChange: (updater) => {
            const newSelection =
              typeof updater === "function" ? updater(rowSelection) : updater;
            setInternalRowSelection(newSelection);
            onSelectedRowIdsChange?.(
              Object.keys(newSelection).filter((k) => newSelection[k]),
            );
          },
        }
      : {}),

    ...(getRowId ? { getRowId: (row: TData) => getRowId(row) } : {}),

    ...(resizable
      ? {
          resizable: true,
          columnResizeMode: "onChange" as const,
          onColumnSizingChange: (updater) => {
            const newSizing =
              typeof updater === "function" ? updater(columnSizing) : updater;
            setInternalColumnSizing(newSizing);
            onColumnSizingChange?.(newSizing);
          },
        }
      : {}),

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

    // When sticky-thead OR sticky-tfoot is in play, all overflow + size
    // constraints move to the inner flex/grid wrapper so the sticky
    // element has a real scroll ancestor. Any overflow-* on the outer
    // would create a closer scroll context and intercept the stick (CSS
    // spec computes the other axis to `auto` if one is non-visible).
    const hoistScroll =
      !!maxHeight &&
      (stickyHeader ||
        (showFooter && /\bsticky\b/.test(footerClassName ?? "")));
    if (maxWidth) {
      style.maxWidth =
        typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth;
      if (!hoistScroll) {
        style.overflowX = "auto";
      }
    }

    if (maxHeight && !hoistScroll) {
      style.maxHeight =
        typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight;
      style.overflowY = "auto";
    }

    if (minHeight) {
      style.minHeight =
        typeof minHeight === "number" ? `${minHeight}px` : minHeight;
    }

    if (hideVerticalScrollbar || hideHorizontalScrollbar) {
      style.scrollbarWidth = "none";
      style.msOverflowStyle = "none";
      style.WebkitOverflowScrolling = "touch";
    }

    return style;
  }, [
    maxWidth,
    maxHeight,
    minHeight,
    hideVerticalScrollbar,
    hideHorizontalScrollbar,
    stickyHeader,
    showFooter,
    footerClassName,
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

  // Detect "sticky footer" via the user-supplied footer class. The same
  // scroll-hoisting we do for stickyHeader is needed for sticky tfoot:
  // without it, the inner overflow-x-auto creates a closer scroll
  // ancestor and the footer never sticks to the visible viewport bottom.
  const hasStickyFooter =
    showFooter && /\bsticky\b/.test(footerClassName ?? "");
  const needsHoistedScroll =
    !!maxHeight && (stickyHeader || hasStickyFooter);

  const viewportWidth = useViewportWidth();
  const isMobileView =
    responsiveBreakpoint !== undefined && viewportWidth < responsiveBreakpoint;

  const loadingMoreRef = useRef(loadingMore);
  loadingMoreRef.current = loadingMore;
  const hasMoreRef = useRef(hasMore);
  hasMoreRef.current = hasMore;
  const onLoadMoreRef = useRef(onLoadMore);
  onLoadMoreRef.current = onLoadMore;

  useEffect(() => {
    if (!infiniteScroll) return;

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
      if (scrollHeight - scrollTop - clientHeight < 100) {
        onLoadMoreRef.current();
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [infiniteScroll]);

  const handleRowHover = useCallback(
    (
      rowIndex: number | null,
      rowRef?: React.RefObject<HTMLTableRowElement>,
    ) => {
      if ((floatingActionsHovered || popupOpen) && rowIndex === null) {
        return;
      }
      onRowHover?.(rowIndex, rowRef);
    },
    [onRowHover, floatingActionsHovered, popupOpen],
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
        case "Home":
        case "End": {
          // APG grid: the first or last cell in the row, or with Ctrl the
          // first or last cell in the grid.
          event.preventDefault();
          const col = event.key === "Home" ? 0 : totalCols - 1;
          setFocusedCell({ row: event.ctrlKey ? (col ? totalRows - 1 : 0) : rowIndex, col });
          break;
        }
        case "Escape":
          // Not marked: this only resets the roving tab stop and tells the
          // consumer no row is hovered. Nothing closes, so the key is still
          // free for a toast or an enclosing dialog.
          handleRowHover(null);
          setFocusedCell(null);
          break;
      }
    },
    [table, handleRowHover],
  );

  // Arrow keys move `focusedCell`, but DOM focus has to follow or the
  // roving tabindex never actually moves the caret for keyboard users.
  // Not when focus is already inside the cell: the inline editor's own focus
  // bubbles to the cell's onFocus and moves focusedCell, and taking focus back
  // blurred the editor, which commits and closes it in the frame it opened.
  useEffect(() => {
    if (!focusedCell) return;
    const td = containerRef.current?.querySelector<HTMLElement>(
      'td[data-highlighted="true"]',
    );
    if (!td?.contains(document.activeElement)) td?.focus({ preventScroll: true });
  }, [focusedCell]);

  const isRowSelected = useCallback(
    (row: Row<TData>) => {
      // Checkbox selection lives in TanStack's row model; `selectedRowId` is
      // the separate single-row highlight. A row is selected under either.
      if (row.getIsSelected()) return true;
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
      onPinnedColumnsChange?.(
        isPinned ? pinnedColumns.filter((id) => id !== columnId) : [...pinnedColumns, columnId],
      );
    },
    [onPinnedColumnsChange, canPinMore, pinnedColumns],
  );

  const startEdit = useCallback(
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

  useEffect(() => {
    if (editingCell) return;
    editReturnRef.current?.focus({ preventScroll: true });
    editReturnRef.current = null;
  }, [editingCell]);

  const handleCellClick = useCallback(
    async (cellText: string, rowId: string, columnId: string) => {
      if (!copyOnClick) return;
      await copyToClipboard(cellText);
      onCellCopy?.(cellText, rowId, columnId);
    },
    [copyOnClick, onCellCopy],
  );

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

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInternalGlobalFilter(value);
      onGlobalFilterChange?.(value);
      table.setGlobalFilter(value);
    },
    [onGlobalFilterChange, table],
  );


  /**
   * Keyboard resizing for a column, so the function is not drag-only.
   *
   * SC 2.5.7 Dragging Movements asks for a single-pointer alternative that is
   * not a drag; a keyboard route satisfies it and serves more people than a
   * click target would. The step and the Shift multiplier match
   * ResizablePanel's separator, which is the other resize surface in the
   * package, so the two behave the same way.
   */
  const handleResizeKeyDown = useCallback(
    (event: React.KeyboardEvent, columnId: string) => {
      const step = event.shiftKey ? COLUMN_RESIZE_STEP * 5 : COLUMN_RESIZE_STEP;
      const current =
        columnSizing[columnId] ??
        table.getColumn(columnId)?.getSize() ??
        COLUMN_MIN_WIDTH;

      let next: number | undefined;
      switch (event.key) {
        case "ArrowLeft":
          next = current - step;
          break;
        case "ArrowRight":
          next = current + step;
          break;
        case "Home":
          next = COLUMN_MIN_WIDTH;
          break;
        case "End":
          next = COLUMN_MAX_WIDTH;
          break;
        default:
          return;
      }

      event.preventDefault();
      const clamped = Math.max(COLUMN_MIN_WIDTH, Math.min(COLUMN_MAX_WIDTH, next));
      const updated = { ...columnSizing, [columnId]: clamped };
      setInternalColumnSizing(updated);
      onColumnSizingChange?.(updated);
    },
    [columnSizing, onColumnSizingChange, table],
  );

  const renderHeaderCell = useCallback(
    (header: Header<TData, unknown>, index: number) => {
      if (header.isPlaceholder) {
        return (
          <th
            key={header.id}
            colSpan={header.colSpan}
            className={`${headerCellClassName} ${sizeClass}`}
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
      const canShowPinButton = onPinnedColumnsChange && isColumnPinnable;
      const isDisabled = !isPinned && !canPinMore;

      const isSortableColumn = sortable && header.column.getCanSort();
      const sortDir = header.column.getIsSorted();

      const isCheckboxColumn = columnId === "__selection";
      const isExpandColumn = columnId === "__expand";
      const isDragColumn = columnId === "__dragHandle";

      const headerStyle: React.CSSProperties = {};
      const hasFilter = filterableColumns && filterableColumns[columnId];
      if (resizable && header.column.getCanResize()) {
        const size = header.getSize();
        headerStyle.width = size;
        headerStyle.minWidth = size;
        headerStyle.maxWidth = size;
      }
      if ((resizable && header.column.getCanResize()) || hasFilter) {
        headerStyle.position = "relative";
      }

      return (
        <th
          key={header.id}
          colSpan={header.colSpan > 1 ? header.colSpan : undefined}
          className={`group/header ${headerCellClassName} ${isCheckboxColumn || isExpandColumn || isDragColumn ? checkboxCellClassName : ""} ${sizeClass}`}
          role="columnheader"
          aria-sort={getSortDirection(header.column.getIsSorted())}
          data-pinned={isPinned || undefined}
          data-column-index={index}
          data-sorted={sortDir || undefined}
          style={Object.keys(headerStyle).length > 0 ? headerStyle : undefined}
        >
          <div
            className={`${resizable ? "overflow-hidden pr-3" : ""} ${headerCellContentClassName}`}
          >
            <span
              className={`flex items-center gap-1 ${resizable ? "truncate" : ""}`}
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
                  className={sortIconClassName}
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
                className={filterIconClassName}
                data-active={getColumnFilterValues(columnId).length > 0 || undefined}
                aria-label={`Filter ${columnId}`}
                aria-haspopup="dialog"
                aria-expanded={openFilterColumn === columnId}
                aria-controls={
                  openFilterColumn === columnId && FilterPanel
                    ? filterDropdownId
                    : undefined
                }
                title="Filter column"
              >
                {renderFilterIcon ? (
                  renderFilterIcon({
                    active: getColumnFilterValues(columnId).length > 0,
                    className: TABLE_FILTER_ICON_SIZE,
                  })
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
                data-state={isPinned ? "active" : undefined}
                onClick={(e) => handlePinClick(columnId, isPinned, e)}
                disabled={isDisabled}
                className={`${
                  isPinned
                    ? `opacity-100 ${pinButtonClassName}`
                    : `opacity-0 group-hover/header:opacity-100 ${pinButtonClassName} ${isDisabled ? "cursor-not-allowed opacity-50" : ""}`
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
                {isPinned
                  ? (pinnedIcon ?? pinIcon ?? <PinIcon className={cn( pinIconClassName)} />)
                  : (pinIcon ?? <PinIcon className={cn( pinIconClassName)} />)}
              </button>
            )}
          </div>
          {/* Column resize handle - positioned inside th, outside content div */}
          {resizable && header.column.getCanResize() && (
            <div
              onMouseDown={header.getResizeHandler()}
              onTouchStart={header.getResizeHandler()}
              onKeyDown={(e) => handleResizeKeyDown(e, header.column.id)}
              className={`absolute right-0 top-0 h-full w-4 cursor-col-resize select-none touch-none z-10 flex items-center justify-center group/resize ${resizeHandleClassName}`}
              data-resize-handle
              role="separator"
              aria-orientation="vertical"
              // SC 2.5.7: a keyboard route to the same resize, which is what
              // the criterion asks for rather than a bigger drag target.
              tabIndex={0}
              aria-label={`Resize ${typeof header.column.columnDef.header === "string" ? header.column.columnDef.header : header.column.id} column`}
              aria-valuenow={Math.round(header.getSize())}
              aria-valuemin={COLUMN_MIN_WIDTH}
              aria-valuemax={COLUMN_MAX_WIDTH}
              aria-valuetext={`${Math.round(header.getSize())} pixels`}
            >
              <div
                className={resizeIndicatorClassName}
                data-resizing={header.column.getIsResizing() || undefined}
              />
            </div>
          )}
        </th>
      );
    },
    [
      handleResizeKeyDown,
      headerCellClassName,
      headerCellContentClassName,
      pinnedColumnIds,
      pinnableColumnIds,
      onPinnedColumnsChange,
      handlePinClick,
      pinIconClassName,
      pinButtonClassName,
      canPinMore,
      effectiveMaxPinnedColumns,
      pinIcon,
      pinnedIcon,
      sortable,
      sortIconClassName,
      checkboxCellClassName,
      sizeClass,
      resizable,
      resizeHandleClassName,
      filterableColumns,
      renderFilterIcon,
      filterIconClassName,
      openFilterColumn,
      getColumnFilterValues,
      FilterPanel,
    ],
  );

  const renderCell = useCallback(
    (cell: Cell<TData, unknown>, rowIndex: number, colIndex: number) => {
      const isFocused =
        focusedCell?.row === rowIndex && focusedCell?.col === colIndex;
      // Roving tabindex needs an entry point before anything has been
      // focused, otherwise every cell is -1 and the grid is unreachable.
      const isTabStop = focusedCell
        ? isFocused
        : rowIndex === 0 && colIndex === 0;
      const columnId = getColumnId(
        cell.column.columnDef as { accessorKey?: string; id?: string },
      );
      const isCheckboxColumn = columnId === "__selection";
      const isExpandColumn = columnId === "__expand";
      const isDragColumn = columnId === "__dragHandle";
      const isSyntheticColumn =
        isCheckboxColumn || isExpandColumn || isDragColumn;

      const meta = cell.column.columnDef.meta as
        | { rowSpan?: number; colSpan?: number }
        | undefined;
      const rowSpan = meta?.rowSpan;
      const colSpan = meta?.colSpan;

      const rowId = cell.row.id;
      const isEditing =
        editingCell?.rowId === rowId && editingCell?.columnId === columnId;
      const canEdit =
        editable &&
        !isSyntheticColumn &&
        (!editableColumnSet || editableColumnSet.has(columnId));
      const edit = canEdit
        ? () => startEdit(rowId, columnId, cell.getValue())
        : undefined;

      const cellStyle: React.CSSProperties = {};
      if (resizable) {
        const size = cell.column.getSize();
        cellStyle.width = size;
        cellStyle.minWidth = size;
        cellStyle.maxWidth = size;
      }

      const isGrouped = cell.getIsGrouped();
      const isAggregated = cell.getIsAggregated();
      const isPlaceholder = cell.getIsPlaceholder();

      if (isPlaceholder) {
        return (
          <td
            key={cell.id}
            className={`${cellClassName} ${sizeClass}`}
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
            // The editor's keys are its own: grid navigation would take the
            // caret's arrows, and its Escape would drop the roving tab stop.
            e.stopPropagation();
            if (e.key === "Enter" || e.key === "Escape") {
              e.preventDefault();
              editReturnRef.current = e.currentTarget.parentElement;
              if (e.key === "Enter") commitEdit();
              else cancelEdit();
            }
          }}
          className={`w-full border rounded px-1 py-0.5 ${editInputClassName}`}
          aria-label={`Edit ${columnId}`}
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
          className="flex items-center gap-1 cursor-pointer min-h-6"
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

      const cellTextValue = cell.getValue();
      const cellText = cellTextValue != null ? String(cellTextValue) : "";

      return (
        <td
          key={cell.id}
          className={`${cellClassName} ${isSyntheticColumn ? checkboxCellClassName : ""} ${sizeClass}`}
          role="gridcell"
          // While it edits, the editor holds the tab stop: a focusable cell under
          // it is a target the editor obscures (axe target-size).
          tabIndex={isTabStop && !isEditing ? 0 : -1}
          onKeyDown={(e) => {
            // Enter and F2 open the editor from the cell itself, the keyboard
            // equal of the double-click (APG grid, SC 2.1.1).
            if (edit && e.target === e.currentTarget && (e.key === "Enter" || e.key === "F2")) {
              e.preventDefault();
              edit();
            } else handleKeyDown(e, rowIndex, colIndex);
          }}
          onFocus={() =>
            setFocusedCell((prev) =>
              prev?.row === rowIndex && prev?.col === colIndex
                ? prev
                : { row: rowIndex, col: colIndex },
            )
          }
          data-highlighted={isFocused || undefined}
          data-editing={isEditing || undefined}
          data-grouped={isGrouped || undefined}
          onDoubleClick={edit}
          onClick={
            copyOnClick && !isSyntheticColumn
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
      sizeClass,
      editingCell,
      editValue,
      editable,
      editableColumnSet,
      startEdit,
      commitEdit,
      cancelEdit,
      editInputClassName,
      copyOnClick,
      handleCellClick,
      resizable,
    ],
  );

  const renderRow = useCallback(
    (
      row: Row<TData>,
      rowIndex: number,
      filterFn?: (columnId: string) => boolean,
      colOffset = 0,
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

      const isGroupRow = grouping.length > 0 && row.getIsGrouped();

      const rowDragProps = reorderable
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

      const rowIsActionable = Boolean(onRowClick) || Boolean(expandOnRowClick && expandable);

      return (
        <React.Fragment key={row.id}>
          <tr
            className={`${rowClassName} ${isStriped ? stripedClassNameProp || "bg-cl-bg-item-hover" : ""} ${isGroupRow ? groupHeaderClassName : ""} ${dragRowIndex === rowIndex ? "opacity-50" : ""} ${rowIsActionable ? "cursor-pointer" : ""}`}
            // Bound only when the row actually does something. It used to be
            // bound always and early-return inside, so every row in every table
            // looked clickable to anything reading handlers — and the rows that
            // WERE clickable via `onRowClick` still showed the default cursor,
            // because only the expand case carried one.
            onClick={rowIsActionable ? (e) => handleRowClick(row, e) : undefined}
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
            data-state={isExpanded ? "open" : "closed"}
            data-group-row={isGroupRow || undefined}
            data-dragging={dragRowIndex === rowIndex || undefined}
            {...rowDragProps}
          >
            {filteredCells.map((cell, colIndex) =>
              renderCell(cell, rowIndex, colOffset + colIndex),
            )}
          </tr>
          {isExpanded && renderExpandedRow && !isGroupRow && (
            <tr data-expanded-content role="row">
              <td colSpan={totalCols} className={""}>
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
      rowClassName,
      handleRowClick,
      handleRowHover,
      renderCell,
      onRowClick,
      striped,
      expandable,
      renderExpandedRow,
      reorderable,
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

  // The automatic JSX runtime leaves React out of scope, but keyed
  // multi-element rows below are emitted as <React.Fragment key=…>.
  const React = { Fragment: __Fragment };

  const renderTable = useCallback(
    (
      filterFn: ((columnId: string) => boolean) | undefined,
      tableClass: string,
      containerClass: string,
      tableAriaLabel: string,
      colOffset?: number,
    ) => {
      const headerGroups = table.getHeaderGroups();
      const rows = table.getRowModel().rows;

      return (
        <div className={containerClass}>
          <table
            className={`${resizable ? "table-fixed min-w-full" : "w-full"} ${tableClass}`}
            role="grid"
            aria-label={tableAriaLabel}
            style={
              resizable
                ? {
                    width: Math.max(table.getCenterTotalSize(), 0) || undefined,
                  }
                : undefined
            }
          >
            {caption && (
              <caption
                style={{
                  position: "absolute",
                  width: 1,
                  height: 1,
                  padding: 0,
                  margin: -1,
                  overflow: "hidden",
                  clip: "rect(0, 0, 0, 0)",
                  whiteSpace: "nowrap",
                  border: 0,
                }}
              >
                {caption}
              </caption>
            )}
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
              {rows.map((row, index) => renderRow(row, index, filterFn, colOffset))}
            </tbody>
            {showFooter && (
              <tfoot
                className={footerClassName}
                role="rowgroup"
                data-table-footer
              >
                {footerContent ? (
                  isRows(footerContent) ? (
                    footerContent
                  ) : (
                    // A text node cannot be a child of <tfoot>: the parser hoists
                    // it out of the table, so the server's markup and the client's
                    // first render disagree and hydration reports a mismatch.
                    <tr role="row">
                      <td colSpan={table.getVisibleLeafColumns().length}>
                        {footerContent}
                      </td>
                    </tr>
                  )
                ) : (
                  table.getFooterGroups().map((footerGroup) => (
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
                  ))
                )}
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
      resizable,
      caption,
    ],
  );

  const handleMouseMove = useCallback(
    (event: React.MouseEvent) => {
      if (floatingActionsHovered || popupOpen) {
        return;
      }

      const rect = (
        event as unknown as { currentTarget: Element }
      ).currentTarget.getBoundingClientRect();
      const x = (event as unknown as { clientX: number }).clientX - rect.left;
      const y = (event as unknown as { clientY: number }).clientY - rect.top;

      const isOverHeader = shouldShowHeader && y < 60;
      onHeaderHoverChange?.(isOverHeader);
      onCursorPositionChange?.({ x, y });
    },
    [
      onCursorPositionChange,
      floatingActionsHovered,
      popupOpen,
      shouldShowHeader,
      onHeaderHoverChange,
    ],
  );

  const handleMouseLeave = useCallback(() => {
    onRowHover?.(null);
    if (!floatingActionsHovered && !popupOpen) {
      onCursorPositionChange?.(null);
      onHeaderHoverChange?.(false);
    }
  }, [
    onRowHover,
    floatingActionsHovered,
    popupOpen,
    onCursorPositionChange,
    onHeaderHoverChange,
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
          rowCount={shimmerCount}
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
        aria-label={tableLabel}
        data-table-container
        data-mobile-view
      >
        {/* Search bar for mobile */}
        {showSearch && (
          <div className={`mb-2 ${searchBarClassName}`} data-table-search>
            <div className="relative group/search" data-side="start">
              {searchIcon != null ? (
                <span className={searchIconClassName || undefined}>{searchIcon}</span>
              ) : (
                <SearchIcon className={searchIconClassName} />
              )}
              <input
                type="text"
                value={globalFilter ?? ""}
                onChange={handleSearchChange}
                placeholder={searchPlaceholder}
                className={`w-full pl-8 pr-8 py-2 border rounded bg-cl-bg-input text-cl-text border-cl-border-input placeholder:text-cl-text-tertiary ${searchInputClassName}`}
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
                  className={clearTriggerClassName}
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
        {infiniteScroll && loadingMore && (
          <div
            className={`text-center flex items-center justify-center py-3 ${loadingMoreClassName}`}
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

  const syntheticColumnIds = new Set([
    "__selection",
    "__expand",
    "__dragHandle",
  ]);

  // Pinned columns are tables of their own, but the body is one grid: each
  // part's cells continue the column index where the part before it stopped,
  // so there is one tab stop and the keys cross from one part into the next.
  const visibleColumnIds = table
    .getVisibleLeafColumns()
    .map((col) => getColumnId(col.columnDef as { accessorKey?: string; id?: string }));
  const pinnedCount = visibleColumnIds.filter(
    (id) => pinnedColumnIds.has(id) && !syntheticColumnIds.has(id),
  ).length;
  const unpinnedCount = visibleColumnIds.filter(
    (id) => !pinnedColumnIds.has(id) && !pinnedRightColumnIds.has(id),
  ).length;

  const hasUnpinnedColumns = allColumnIds.some(
    (id) => !pinnedColumnIds.has(id) && !pinnedRightColumnIds.has(id),
  );
  const allColumnsPinned =
    hasPinnedColumns && !hasUnpinnedColumns && !hasPinnedRightColumns;

  // When the inner flex/grid wrapper is the scroll container (sticky
  // thead or sticky tfoot mode), horizontal scrolling is delegated up to
  // it. Keeping overflow-x-auto here would create an inner scroll
  // context that intercepts position: sticky, breaking the stick.
  const defaultUnpinnedContainerClass =
    hasPinnedColumns || hasPinnedRightColumns
      ? needsHoistedScroll
        ? "min-w-0 flex-1"
        : "min-w-0 flex-1 overflow-x-auto"
      : needsHoistedScroll
        ? "w-full min-w-0"
        : "w-full min-w-0 overflow-x-auto";

  // User-supplied container classes may include overflow-* utilities for the
  // non-sticky case. In hoisted-scroll mode they would re-introduce the inner
  // scroll context we just removed, so strip them here.
  const stripOverflow = (cls: string) =>
    needsHoistedScroll
      ? cls
          .replace(
            /\b(overflow|overflow-x|overflow-y)-(auto|scroll|hidden|clip)\b/g,
            "",
          )
          .replace(/\s+/g, " ")
          .trim()
      : cls;

  const finalPinnedContainerClass = allColumnsPinned
    ? "w-full"
    : stripOverflow(
        pinnedContainerClassName || "shrink-0 sticky left-0 z-20 bg-inherit",
      );

  const finalPinnedTableClass = allColumnsPinned
    ? `w-full ${pinnedTableClassName || tableClassName}`
    : pinnedTableClassName || tableClassName;

  const finalPinnedRightContainerClass = stripOverflow(
    pinnedRightContainerClassName || "shrink-0 sticky right-0 z-20 bg-inherit",
  );

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
      aria-label={tableLabel}
      data-table-container
      data-striped={striped || undefined}
      data-size={size}
    >
      {/* Search bar */}
      {showSearch &&
        (() => {
          const iconPos = searchIconPosition;
          const showIcon = iconPos !== "none";
          const iconAtStart = iconPos === "start";
          const inputPl = showIcon && iconAtStart ? "pl-9" : "pl-3";
          const inputPr = globalFilter
            ? showIcon && !iconAtStart
              ? "pr-16"
              : "pr-9"
            : showIcon && !iconAtStart
              ? "pr-9"
              : "pr-3";

          return (
            <div className={`mb-3 ${searchBarClassName}`} data-table-search>
              <div
                className="relative group/search"
                data-side={showIcon ? (iconAtStart ? "start" : "end") : undefined}
              >
                {showIcon &&
                  (searchIcon != null ? (
                    <span className={searchIconClassName || undefined}>{searchIcon}</span>
                  ) : (
                    <SearchIcon className={searchIconClassName} />
                  ))}
                <input
                  type="text"
                  value={globalFilter ?? ""}
                  onChange={handleSearchChange}
                  placeholder={searchPlaceholder}
                  className={`w-full ${inputPl} ${inputPr} py-2 text-sm rounded-cl-md border bg-cl-bg-elevated text-cl-text border-cl-border-input placeholder:text-cl-text-tertiary focus:outline-none focus:ring-2 focus:ring-cl-accent/30 focus:border-cl-border-input-focus ${searchInputClassName}`}
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
                    className={clearTriggerClassName}
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
        // Layout decisions:
        // - GRID whenever pinned columns are present so all sections
        //   (pinned / unpinned / right-pinned) stretch to the same
        //   row-track height. Without this, multi-line cells in the
        //   unpinned table make those rows taller than the corresponding
        //   pinned rows, so the pinned column drifts out of vertical
        //   alignment with the rest.
        // - OVERFLOW: AUTO + maxHeight on this wrapper when sticky-thead
        //   or sticky-tfoot is in play, so the sticky element has a real
        //   scroll ancestor.
        // - overflow-clip (non-sticky path) clips visually without
        //   creating a scroll context.
        className={`${
          hasPinnedColumns || hasPinnedRightColumns
            ? "grid"
            : "flex"
        } w-full min-w-0 ${needsHoistedScroll ? "" : "overflow-clip"} ${floatingActions ? "relative" : ""}`}
        style={
          hasPinnedColumns || hasPinnedRightColumns
            ? {
                gridTemplateColumns: [
                  hasPinnedColumns ? "auto" : null,
                  hasUnpinnedColumns ? "minmax(0,1fr)" : null,
                  hasPinnedRightColumns ? "auto" : null,
                ]
                  .filter(Boolean)
                  .join(" "),
                ...(needsHoistedScroll
                  ? {
                      maxHeight:
                        typeof maxHeight === "number"
                          ? `${maxHeight}px`
                          : maxHeight,
                      overflow: "auto",
                      // `none` (not `contain`) is needed here: `contain`
                      // only blocks scroll chaining, but the inner
                      // container can still rubber-band on macOS
                      // Chrome, which visibly displaces the sticky
                      // <thead> at the end of scroll.
                      overscrollBehavior: "none",
                    }
                  : {}),
              }
            : needsHoistedScroll
              ? {
                  maxHeight:
                    typeof maxHeight === "number"
                      ? `${maxHeight}px`
                      : maxHeight,
                  overflow: "auto",
                  overscrollBehavior: "none",
                }
              : undefined
        }
        data-testid="table-container"
        onMouseMove={onCursorPositionChange ? handleMouseMove : undefined}
        onMouseLeave={onCursorPositionChange ? handleMouseLeave : undefined}
      >
        {hasPinnedColumns &&
          renderTable(
            (columnId) =>
              pinnedColumnIds.has(columnId) &&
              !syntheticColumnIds.has(columnId),
            finalPinnedTableClass,
            finalPinnedContainerClass,
            `${tableLabel} - Pinned columns`,
          )}

        {hasUnpinnedColumns &&
          renderTable(
            hasPinnedColumns || hasPinnedRightColumns
              ? (columnId) =>
                  !pinnedColumnIds.has(columnId) &&
                  !pinnedRightColumnIds.has(columnId)
              : undefined,
            unpinnedTableClassName || tableClassName,
            stripOverflow(
              unpinnedContainerClassName || defaultUnpinnedContainerClass,
            ),
            hasPinnedColumns || hasPinnedRightColumns
              ? `${tableLabel} - Scrollable columns`
              : tableLabel,
            pinnedCount,
          )}

        {hasPinnedRightColumns &&
          renderTable(
            (columnId) =>
              pinnedRightColumnIds.has(columnId) &&
              !syntheticColumnIds.has(columnId),
            finalPinnedRightTableClass,
            finalPinnedRightContainerClass,
            `${tableLabel} - Right pinned columns`,
            pinnedCount + unpinnedCount,
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
      {infiniteScroll && loadingMore && (
        <div
          className={`w-full text-center flex items-center justify-center py-3 ${loadingMoreClassName}`}
          data-loading-more
        >
          {loadingMoreContent ?? "Loading more..."}
        </div>
      )}
      {infiniteScroll && !hasMore && infiniteEndContent !== undefined && (
        <div
          className={`w-full text-center py-3 text-sm ${loadingMoreClassName}`}
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

      {/* Column filter dialog — its own chunk; see FilterPanel. */}
      {filterDropdownState &&
        filterableColumns &&
        filterableColumns[filterDropdownState.columnId] &&
        FilterPanel &&
        createPortal(
          // Module-cached identity — see `useLazyComponent`.
          <FilterPanel
            triggerRef={filterTriggerRef}
            id={filterDropdownId}
            columnId={filterDropdownState.columnId}
            top={filterDropdownState.top}
            left={filterDropdownState.left}
            options={filterableColumns[filterDropdownState.columnId].options}
            multi={filterableColumns[filterDropdownState.columnId].multi}
            values={getColumnFilterValues(filterDropdownState.columnId)}
            onValuesChange={(values) =>
              setColumnFilterValues(filterDropdownState.columnId, values)
            }
            onClose={closeFilterPanel}
            renderColumnFilter={renderColumnFilter}
            classes={filterPanelClasses}
          />,
          document.body,
        )}
    </div>
  );
}

import { Fragment as __Fragment } from "react";

import { motionSafeClasses } from "../../utils/classLayers.js";
import { useReducedMotion } from "../../utils/useReducedMotion.js";
/** Bounds and step for keyboard column resizing (SC 2.5.7). */
const COLUMN_MIN_WIDTH = 40;
const COLUMN_MAX_WIDTH = 800;
const COLUMN_RESIZE_STEP = 8;

const Table = forwardRef(TableInner) as <TData>(
  props: TableProps<TData> & { ref?: React.Ref<HTMLDivElement> },
) => React.ReactElement | null;

(Table as { displayName?: string }).displayName = "Table";

export default memo(Table) as typeof Table;
