import type { PaginationClasses } from "./types";

export const DEFAULT_ROW_OPTIONS = [5, 10, 25, 50, 100] as const;

export const DEFAULT_VISIBLE_PAGE_COUNT = 3;

export const DEFAULT_PAGINATION_CLASSES: Required<PaginationClasses> = {
  root: "",
  nav: "",
  pageButtons: "",
  pageButton: "",
  activePageButton: "",
  navButton: "",
  ellipsis: "",
  selector: "",
  selectorButton: "",
  selectorDropdown: "",
  selectorDropdownWrapper: "",
  selectorOption: "",
  label: "",
  dropdownIcon: "",
  prevIcon: "",
  nextIcon: "",
  pageInfo: "",
};

export const UNSTYLED_PAGINATION_CLASSES: Required<PaginationClasses> = {
  root: "",
  nav: "",
  pageButtons: "",
  pageButton: "",
  activePageButton: "",
  navButton: "",
  ellipsis: "",
  selector: "",
  selectorButton: "",
  selectorDropdown: "",
  selectorDropdownWrapper: "",
  selectorOption: "",
  label: "",
  dropdownIcon: "",
  prevIcon: "",
  nextIcon: "",
  pageInfo: "",
};
