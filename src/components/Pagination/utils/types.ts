import type { ComponentType, ReactNode, HTMLAttributes } from "react";

export interface IconProps {
  className?: string;
}

export interface EllipsisRenderProps {
  position: "start" | "end";
  onValueChange: (page: number) => void;
  /** @deprecated Use `onValueChange` instead. */
  onPageChange: (page: number) => void;
}

export interface PageInfoRenderProps {
  value: number;
  totalPages: number;
  rowsPerPage?: number;
  /** @deprecated Use `value` instead. */
  currentPage: number;
}

export type SectionName = "selector" | "pageInfo" | "nav";

export interface PaginationClasses {
  root?: string;
  nav?: string;
  pageButtons?: string;
  pageButton?: string;
  activePageButton?: string;
  navButton?: string;
  ellipsis?: string;
  selector?: string;
  selectorButton?: string;
  selectorDropdown?: string;
  selectorDropdownWrapper?: string;
  selectorOption?: string;
  label?: string;
  dropdownIcon?: string;
  prevIcon?: string;
  nextIcon?: string;
  pageInfo?: string;
}

/**
 * Props for the Pagination component.
 *
 * @example
 * ```tsx
 * <Pagination totalPages={10} value={page} onValueChange={setPage} />
 * ```
 */
export interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, "onChange"> {
  /** Total number of pages. */
  totalPages: number;
  /** Number of page buttons shown on each side of the current page. Default: 1. */
  siblingCount?: number;
  /** Number of rows displayed per page (used by page-info display). */
  rowsPerPage?: number;
  rowOptions?: number[];
  /** Disables all pagination controls. */
  disabled?: boolean;
  /** Page change callback. Not `onChange` or `onPageChange`. */
  onValueChange?: (page: number) => void;
  /** Current page number (1-based). Not `currentPage` or `page`. */
  value?: number;
  defaultValue?: number;
  label?: ReactNode;
  /** Error state flag. Pass message via `errorMessage`, not as a string here. */
  error?: boolean;
  errorMessage?: ReactNode;
  /** Callback when rows-per-page selection changes. Not `onRowsChange`. */
  onRowsPerPageChange?: (rows: number) => void;
  /** Show the rows-per-page selector. Default: false. */
  showRowsPerPage?: boolean;
  rowsPerPageLabel?: string;
  showLabel?: string;
  dropdownAriaLabel?: string;
  dropdownPosition?: "top" | "bottom";
  dropdownZIndex?: number;
  dropdownGap?: number;
  dropdownIcon?: ComponentType<IconProps> | ReactNode;
  prevIcon?: ComponentType<IconProps> | ReactNode;
  nextIcon?: ComponentType<IconProps> | ReactNode;
  renderEllipsis?: (props: EllipsisRenderProps) => ReactNode;
  renderPageInfo?: (props: PageInfoRenderProps) => ReactNode;
  sectionOrder?: SectionName[];
  /** Controls motion preferences. `"auto"` respects the user's OS setting. */
  reduceMotion?: boolean | "auto";
  classes?: PaginationClasses;
  unstyled?: boolean;
  portalContainer?: HTMLElement | null;
  prevAriaLabel?: string;
  nextAriaLabel?: string;
  paginationAriaLabel?: string;
  pageAriaLabel?: (page: number) => string;
}
