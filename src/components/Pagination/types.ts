import type { ComponentType, ReactNode } from "react";

export interface IconProps {
  className?: string;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  rowsPerPage?: number;
  rowOptions?: number[];
  onPageChange: (page: number) => void;
  onRowsPerPageChange?: (rows: number) => void;
  showRowsPerPage?: boolean;
  rowsPerPageLabel?: string;
  dropdownIcon?: ComponentType<IconProps> | ReactNode;
  prevIcon?: ComponentType<IconProps> | ReactNode;
  nextIcon?: ComponentType<IconProps> | ReactNode;
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
}
