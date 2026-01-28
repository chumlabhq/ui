import type { ReactNode, ComponentType } from "react";
import type { ColumnDef, Table as TanstackTable } from "@tanstack/react-table";

export interface IconProps {
  className?: string;
}

export interface TableProps<TData> {
  columns?: ColumnDef<TData>[];
  data?: TData[];
  COLUMNS?: ColumnDef<TData>[];
  COLUMNS_DATA?: TData[];
  isLoading?: boolean;
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
  containerClassName?: string;
  tableClassName?: string;
  headerClassName?: string;
  headerRowClassName?: string;
  headerCellClassName?: string;
  headerCellHoverClassName?: string;
  headerCellContentClassName?: string;
  PinIcon?: ComponentType<IconProps>;
  PinnedIcon?: ComponentType<IconProps>;
  pinIconClassName?: string;
  pinIconHoverClassName?: string;
  pinnedPinIconClassName?: string;
  pinnedPinIconHoverClassName?: string;
  pinButtonClassName?: string;
  pinnedPinButtonClassName?: string;
  bodyClassName?: string;
  rowClassName?: string;
  cellClassName?: string;
  selectedRowClassName?: string;
  pinnedContainerClassName?: string;
  pinnedTableClassName?: string;
  unpinnedContainerClassName?: string;
  unpinnedTableClassName?: string;
  emptyClassName?: string;
  shimmerRowCount?: number;
  shimmerClassName?: string;
  shimmerRowClassName?: string;
  shimmerCellClassName?: string;
  shimmerBarClassName?: string;
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
