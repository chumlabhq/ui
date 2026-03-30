import type { ReactNode, ComponentType, CSSProperties } from "react";
import type { ColumnDef, Table as TanstackTable } from "@tanstack/react-table";

export interface IconProps {
  className?: string;
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
}

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
  /** @deprecated Use `classes.container` instead. */
  containerClassName?: string;
  /** @deprecated Use `classes.table` instead. */
  tableClassName?: string;
  /** @deprecated Use `classes.header` instead. */
  headerClassName?: string;
  /** @deprecated Use `classes.headerRow` instead. */
  headerRowClassName?: string;
  /** @deprecated Use `classes.headerCell` instead. */
  headerCellClassName?: string;
  /** @deprecated Use `classes.headerCellHover` instead. */
  headerCellHoverClassName?: string;
  /** @deprecated Use `classes.headerCellContent` instead. */
  headerCellContentClassName?: string;
  PinIcon?: ComponentType<IconProps>;
  PinnedIcon?: ComponentType<IconProps>;
  /** @deprecated Use `classes.pinIcon` instead. */
  pinIconClassName?: string;
  /** @deprecated Use `classes.pinIconHover` instead. */
  pinIconHoverClassName?: string;
  /** @deprecated Use `classes.pinnedPinIcon` instead. */
  pinnedPinIconClassName?: string;
  /** @deprecated Use `classes.pinnedPinIconHover` instead. */
  pinnedPinIconHoverClassName?: string;
  /** @deprecated Use `classes.pinButton` instead. */
  pinButtonClassName?: string;
  /** @deprecated Use `classes.pinnedPinButton` instead. */
  pinnedPinButtonClassName?: string;
  /** @deprecated Use `classes.body` instead. */
  bodyClassName?: string;
  /** @deprecated Use `classes.row` instead. */
  rowClassName?: string;
  /** @deprecated Use `classes.cell` instead. */
  cellClassName?: string;
  /** @deprecated Use `classes.selectedRow` instead. */
  selectedRowClassName?: string;
  /** @deprecated Use `classes.pinnedContainer` instead. */
  pinnedContainerClassName?: string;
  /** @deprecated Use `classes.pinnedTable` instead. */
  pinnedTableClassName?: string;
  /** @deprecated Use `classes.unpinnedContainer` instead. */
  unpinnedContainerClassName?: string;
  /** @deprecated Use `classes.unpinnedTable` instead. */
  unpinnedTableClassName?: string;
  /** @deprecated Use `classes.empty` instead. */
  emptyClassName?: string;
  shimmerRowCount?: number;
  /** @deprecated Use `classes.shimmer` instead. */
  shimmerClassName?: string;
  /** @deprecated Use `classes.shimmerRow` instead. */
  shimmerRowClassName?: string;
  /** @deprecated Use `classes.shimmerCell` instead. */
  shimmerCellClassName?: string;
  /** @deprecated Use `classes.shimmerBar` instead. */
  shimmerBarClassName?: string;
  className?: string;
  children?: ReactNode;
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
