import type { ComponentType, ReactNode, HTMLAttributes } from "react";

export interface IconProps {
  className?: string;
}

export interface EllipsisRenderProps {
  position: "start" | "end";
  onPageChange: (page: number) => void;
}

export interface PageInfoRenderProps {
  currentPage: number;
  totalPages: number;
  rowsPerPage?: number;
}

export type SectionName = "selector" | "pageInfo" | "nav";

export interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, "onChange"> {
  currentPage: number;
  totalPages: number;
  siblingCount?: number;
  rowsPerPage?: number;
  rowOptions?: number[];
  onPageChange: (page: number) => void;
  onRowsPerPageChange?: (rows: number) => void;
  showRowsPerPage?: boolean;
  rowsPerPageLabel?: string;
  showLabel?: string;
  dropdownAriaLabel?: string;
  dropdownDirection?: "up" | "down";
  dropdownIcon?: ComponentType<IconProps> | ReactNode;
  prevIcon?: ComponentType<IconProps> | ReactNode;
  nextIcon?: ComponentType<IconProps> | ReactNode;
  renderEllipsis?: (props: EllipsisRenderProps) => ReactNode;
  renderPageInfo?: (props: PageInfoRenderProps) => ReactNode;
  sectionOrder?: SectionName[];
  containerClassName?: string;
  rowSelectorClassName?: string;
  rowSelectorButtonClassName?: string;
  rowSelectorDropdownClassName?: string;
  rowSelectorDropdownWrapperClassName?: string;
  rowSelectorOptionClassName?: string;
  pageButtonClassName?: string;
  activePageButtonClassName?: string;
  navButtonClassName?: string;
  navContainerClassName?: string;
  pageButtonsContainerClassName?: string;
  ellipsisClassName?: string;
  labelClassName?: string;
  dropdownIconClassName?: string;
  prevIconClassName?: string;
  nextIconClassName?: string;
  pageInfoClassName?: string;
}
