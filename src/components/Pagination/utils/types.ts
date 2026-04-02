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

export interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, "onChange"> {
  totalPages: number;
  siblingCount?: number;
  rowsPerPage?: number;
  rowOptions?: number[];
  disabled?: boolean;
  onValueChange?: (page: number) => void;
  value?: number;
  defaultValue?: number;
  label?: ReactNode;
  error?: boolean;
  errorMessage?: ReactNode;
  onRowsPerPageChange?: (rows: number) => void;
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
