import type { ComponentType, ReactNode, HTMLAttributes } from "react";

export interface IconProps {
  className?: string;
}

export interface EllipsisRenderProps {
  position: "start" | "end";
  onValueChange: (page: number) => void;
}

export interface PageInfoRenderProps {
  value: number;
  totalPages: number;
  rowsPerPage?: number;
}

export type SectionName = "selector" | "pageInfo" | "nav";

export interface PaginationClasses {
  /** Outer nav container */
  root?: string;
  row?: string;
  list?: string;
  item?: string;
  /** Prev/next buttons */
  navButton?: string;
  /** Ellipsis elements */
  ellipsis?: string;
  /**
   * ADR 002 R6: the rows-per-page selector is a dropdown's anatomy, so its key
   * carries that whole shape. Unlike InternationalPhoneInput's `countrySelect`
   * this is not a rendered child component — Pagination builds the markup
   * inline — so the object is namespaced here rather than imported from one.
   */
  rowsPerPage?: {
    root?: string;
    positioner?: string;
    trigger?: string;
    content?: string;
    item?: string;
    icon?: string;
  };
  label?: string;
  navIcon?: string;
  /** Page info section wrapper */
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
  /** Keeps the rows-per-page menu mounted while closed. */
  keepMounted?: boolean;
  prevAriaLabel?: string;
  nextAriaLabel?: string;
  paginationAriaLabel?: string;
  pageAriaLabel?: (page: number) => string;
}
