import type { ReactNode, HTMLAttributes } from "react";

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
  /** The line holding the page list, the rows-per-page selector and the page info. */
  row?: string;
  /** The `<ul>` of page numbers. */
  list?: string;
  /** One page-number button. */
  item?: string;
  /** Prev/next buttons */
  navTrigger?: string;
  /** Ellipsis elements */
  ellipsis?: string;
  /**
   * The rows-per-page selector's own slots. Pagination builds this markup
   * inline rather than rendering a Dropdown, so the slots are named here
   * instead of being taken from that component's classes object.
   */
  rowsPerPage?: {
    root?: string;
    positioner?: string;
    trigger?: string;
    content?: string;
    item?: string;
    icon?: string;
  };
  /** The text beside the rows-per-page selector. */
  label?: string;
  /** The chevron inside a prev or next button. */
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
  /** Visible text after the rows-per-page select ("Show 10 rows"). With the prefix, it names the select; with both empty the select is named "Rows per page". Default: `"rows"`. */
  rowsPerPageSuffix?: string;
  /** Visible text before the rows-per-page select. With the suffix, it names the select; the number is its value. Default: `"Show"`. */
  rowsPerPagePrefix?: string;
  dropdownAriaLabel?: string;
  dropdownSide?: "top" | "bottom";
  dropdownZIndex?: number;
  dropdownOffset?: number;
  /** Replaces the rows-per-page select's chevron. Rendered as given; `classes.rowsPerPage.icon` styles the default one. */
  dropdownIcon?: ReactNode;
  /** Replaces the previous-page arrow. Rendered as given; `classes.navIcon` styles the default one. */
  prevIcon?: ReactNode;
  /** Replaces the next-page arrow. Rendered as given; `classes.navIcon` styles the default one. */
  nextIcon?: ReactNode;
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
