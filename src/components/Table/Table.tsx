import { useState, useCallback, useMemo, useRef, memo, forwardRef } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type Row,
  type Cell,
  type Header,
} from "@tanstack/react-table";
import type { TableProps } from "./utils/types";
import { getColumnId, getSortDirection, isInteractiveElement } from "./utils";
import TableShimmer from "./TableShimmer";
import { PinIcon } from "./icons";

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
    unstyled: _unstyled = false,
    style: styleProp,
    containerClassName: containerClassNameProp = "",
    tableClassName: tableClassNameProp = "",
    headerClassName: headerClassNameProp = "",
    headerRowClassName: headerRowClassNameProp = "",
    headerCellClassName: headerCellClassNameProp = "",
    headerCellHoverClassName: headerCellHoverClassNameProp = "",
    headerCellContentClassName: headerCellContentClassNameProp = "",
    PinIcon: CustomPinIcon,
    PinnedIcon: CustomPinnedIcon,
    pinIconClassName: pinIconClassNameProp = "",
    pinIconHoverClassName: pinIconHoverClassNameProp = "",
    pinnedPinIconClassName: pinnedPinIconClassNameProp = "",
    pinnedPinIconHoverClassName: pinnedPinIconHoverClassNameProp = "",
    pinButtonClassName: pinButtonClassNameProp = "",
    pinnedPinButtonClassName: pinnedPinButtonClassNameProp = "",
    bodyClassName: bodyClassNameProp = "",
    rowClassName: rowClassNameProp = "",
    cellClassName: cellClassNameProp = "",
    selectedRowClassName: selectedRowClassNameProp = "",
    pinnedContainerClassName: pinnedContainerClassNameProp = "",
    pinnedTableClassName: pinnedTableClassNameProp = "",
    unpinnedContainerClassName: unpinnedContainerClassNameProp = "",
    unpinnedTableClassName: unpinnedTableClassNameProp = "",
    emptyClassName: emptyClassNameProp = "",
    shimmerRowCount = 10,
    shimmerClassName: shimmerClassNameProp,
    shimmerRowClassName: shimmerRowClassNameProp,
    shimmerCellClassName: shimmerCellClassNameProp,
    shimmerBarClassName: shimmerBarClassNameProp,
    className,
    children,
  }: TableProps<TData>,
  ref: React.Ref<HTMLDivElement>,
) {
  // Merge classes prop with individual className props (classes takes precedence)
  const containerClassName = classesProp?.container ?? containerClassNameProp;
  const tableClassName = classesProp?.table ?? tableClassNameProp;
  const headerClassName = classesProp?.header ?? headerClassNameProp;
  const headerRowClassName = classesProp?.headerRow ?? headerRowClassNameProp;
  const headerCellClassName = classesProp?.headerCell ?? headerCellClassNameProp;
  const headerCellHoverClassName = classesProp?.headerCellHover ?? headerCellHoverClassNameProp;
  const headerCellContentClassName = classesProp?.headerCellContent ?? headerCellContentClassNameProp;
  const bodyClassName = classesProp?.body ?? bodyClassNameProp;
  const rowClassName = classesProp?.row ?? rowClassNameProp;
  const cellClassName = classesProp?.cell ?? cellClassNameProp;
  const selectedRowClassName = classesProp?.selectedRow ?? selectedRowClassNameProp;
  const pinnedContainerClassName = classesProp?.pinnedContainer ?? pinnedContainerClassNameProp;
  const pinnedTableClassName = classesProp?.pinnedTable ?? pinnedTableClassNameProp;
  const unpinnedContainerClassName = classesProp?.unpinnedContainer ?? unpinnedContainerClassNameProp;
  const unpinnedTableClassName = classesProp?.unpinnedTable ?? unpinnedTableClassNameProp;
  const emptyClassName = classesProp?.empty ?? emptyClassNameProp;
  const pinIconClassName = classesProp?.pinIcon ?? pinIconClassNameProp;
  const pinIconHoverClassName = classesProp?.pinIconHover ?? pinIconHoverClassNameProp;
  const pinnedPinIconClassName = classesProp?.pinnedPinIcon ?? pinnedPinIconClassNameProp;
  const pinnedPinIconHoverClassName = classesProp?.pinnedPinIconHover ?? pinnedPinIconHoverClassNameProp;
  const pinButtonClassName = classesProp?.pinButton ?? pinButtonClassNameProp;
  const pinnedPinButtonClassName = classesProp?.pinnedPinButton ?? pinnedPinButtonClassNameProp;
  const shimmerClassName = classesProp?.shimmer ?? shimmerClassNameProp;
  const shimmerRowClassName = classesProp?.shimmerRow ?? shimmerRowClassNameProp;
  const shimmerCellClassName = classesProp?.shimmerCell ?? shimmerCellClassNameProp;
  const shimmerBarClassName = classesProp?.shimmerBar ?? shimmerBarClassNameProp;
  const columns = columnsProp ?? COLUMNS ?? [];
  const data = dataProp ?? COLUMNS_DATA ?? [];
  const shouldShowHeader = tableHeader ?? showHeader;
  const [focusedCell, setFocusedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // TanStack React Table v8 is a stable, widely-used library compatible with React 19.
  // eslint-disable-next-line react-hooks/incompatible-library -- @tanstack/react-table@8 false positive
  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const pinnedColumnIds = useMemo(
    () => new Set(pinnedColumns),
    [pinnedColumns],
  );

  const hasPinnedColumns = pinnedColumns.length > 0;

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

  const stickyHeaderClass = stickyHeader ? "sticky top-0 z-10" : "";

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
      if (!onRowClick) return;
      if (isInteractiveElement(event.target)) return;
      event.stopPropagation();
      onRowClick(row.original);
    },
    [onRowClick],
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

  const UnpinnedIconComponent = CustomPinIcon || PinIcon;
  const PinnedIconComponent = CustomPinnedIcon || CustomPinIcon || PinIcon;

  const renderHeaderCell = useCallback(
    (header: Header<TData, unknown>, index: number) => {
      const columnId = getColumnId(
        header.column.columnDef as { accessorKey?: string; id?: string },
      );
      const isPinned = pinnedColumnIds.has(columnId);
      const isColumnPinnable =
        pinnableColumnIds.size === 0 || pinnableColumnIds.has(columnId);
      const canShowPinButton = onPinColumn && isColumnPinnable;
      const isDisabled = !isPinned && !canPinMore;

      return (
        <th
          key={header.id}
          className={`group/header ${headerCellClassName} ${headerCellHoverClassName ? `hover:${headerCellHoverClassName}` : ""}`}
          role="columnheader"
          aria-sort={getSortDirection(header.column.getIsSorted())}
          data-pinned={isPinned || undefined}
          data-column-index={index}
        >
          <div
            className={`flex items-center justify-between ${headerCellContentClassName}`}
          >
            <span className="flex-1">
              {header.isPlaceholder
                ? null
                : flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
            </span>
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
    ],
  );

  const renderCell = useCallback(
    (cell: Cell<TData, unknown>, rowIndex: number, colIndex: number) => {
      const isFocused =
        focusedCell?.row === rowIndex && focusedCell?.col === colIndex;

      return (
        <td
          key={cell.id}
          className={cellClassName}
          role="gridcell"
          tabIndex={isFocused ? 0 : -1}
          onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
          aria-selected={isFocused}
          data-focused={isFocused || undefined}
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      );
    },
    [cellClassName, focusedCell, handleKeyDown],
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

      return (
        <tr
          key={row.id}
          className={selected ? selectedRowClassName : rowClassName}
          onClick={(e) => handleRowClick(row, e)}
          onMouseEnter={(e) =>
            handleRowHover(rowIndex, { current: e.currentTarget })
          }
          onMouseLeave={() => handleRowHover(null)}
          role="row"
          aria-rowindex={rowIndex + 1}
          aria-selected={selected}
          data-selected={selected || undefined}
          data-clickable={onRowClick ? true : undefined}
        >
          {filteredCells.map((cell, colIndex) =>
            renderCell(cell, rowIndex, colIndex),
          )}
        </tr>
      );
    },
    [
      isRowSelected,
      selectedRowClassName,
      rowClassName,
      handleRowClick,
      handleRowHover,
      renderCell,
      onRowClick,
    ],
  );

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
          <table className={tableClass} role="grid" aria-label={tableAriaLabel}>
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
    ],
  );

  const handleMouseMove = useCallback(
    (event: React.MouseEvent) => {
      if (isFloatingActionsHovered || isPopupOpen) {
        return;
      }

      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

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
      <div ref={ref} className={`${containerClassName} ${className ?? ""}`.trim() || undefined} style={{ ...containerStyle, ...styleProp }}>
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

  const allColumnIds = table
    .getAllLeafColumns()
    .map((col) =>
      getColumnId(col.columnDef as { accessorKey?: string; id?: string }),
    );
  const hasUnpinnedColumns = allColumnIds.some(
    (id) => !pinnedColumnIds.has(id),
  );
  const allColumnsPinned = hasPinnedColumns && !hasUnpinnedColumns;

  const defaultUnpinnedContainerClass = hasPinnedColumns
    ? stickyHeader
      ? "min-w-0 flex-1"
      : "min-w-0 flex-1 overflow-x-auto"
    : "w-full";

  const finalPinnedContainerClass = allColumnsPinned
    ? "w-full"
    : pinnedContainerClassName || "shrink-0 sticky left-0 z-20 bg-white";

  const finalPinnedTableClass = allColumnsPinned
    ? `w-full ${pinnedTableClassName || tableClassName}`
    : pinnedTableClassName || tableClassName;

  return (
    <div
      ref={(node) => {
        (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }}
      className={`${containerClassName} ${scrollbarHideClass} ${className ?? ""}`.trim() || undefined}
      style={{ position: "relative", ...containerStyle, ...styleProp }}
      role="region"
      aria-label={ariaLabel}
      data-table-container
    >
      {children}

      <div
        className="flex w-full"
        data-testid="table-container"
        onMouseMove={onCursorPosition ? handleMouseMove : undefined}
        onMouseLeave={onCursorPosition ? handleMouseLeave : undefined}
      >
        {hasPinnedColumns &&
          renderTable(
            (columnId) => pinnedColumnIds.has(columnId),
            finalPinnedTableClass,
            finalPinnedContainerClass,
            `${ariaLabel} - Pinned columns`,
          )}

        {hasUnpinnedColumns &&
          renderTable(
            hasPinnedColumns
              ? (columnId) => !pinnedColumnIds.has(columnId)
              : undefined,
            unpinnedTableClassName || tableClassName,
            unpinnedContainerClassName || defaultUnpinnedContainerClass,
            hasPinnedColumns ? `${ariaLabel} - Scrollable columns` : ariaLabel,
          )}

        {floatingActions && (
          <div role="complementary" aria-label="Table actions">
            {floatingActions}
          </div>
        )}
      </div>

      {isEmpty &&
        (emptyContent || (
          <div className={emptyClassName}>
            <span>No data available</span>
          </div>
        ))}
    </div>
  );
}

const Table = forwardRef(TableInner) as <TData>(
  props: TableProps<TData> & { ref?: React.Ref<HTMLDivElement> },
) => React.ReactElement | null;

export default memo(Table) as typeof Table;
