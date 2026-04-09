import type { PaginationClasses } from "./types";

export const DEFAULT_ROW_OPTIONS = [5, 10, 25, 50, 100] as const;

export const DEFAULT_VISIBLE_PAGE_COUNT = 3;

export const DEFAULT_PAGINATION_CLASSES: Required<PaginationClasses> = {
  root: "flex flex-wrap items-center gap-2",
  nav: "flex items-center gap-2",
  pageButtons: "flex flex-wrap items-center gap-2",
  pageButton:
    "px-3 py-1 rounded-lg border transition-colors cursor-pointer border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300",
  activePageButton:
    "px-3 py-1 rounded-lg bg-blue-600 text-white border border-blue-600",
  navButton:
    "p-2 rounded-lg border transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300",
  ellipsis: "px-2 select-none text-gray-400 dark:text-gray-500",
  selector: "flex items-center gap-2",
  selectorButton:
    "flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors cursor-pointer border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200",
  selectorDropdown:
    "rounded-lg shadow-lg py-1 border min-w-[64px] bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600",
  selectorDropdownWrapper: "",
  selectorOption:
    "px-4 py-1.5 w-full text-left cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-600 data-[selected]:bg-blue-50 dark:data-[selected]:bg-blue-900/60 data-[selected]:text-blue-700 dark:data-[selected]:text-blue-300 data-[highlighted]:bg-gray-100 dark:data-[highlighted]:bg-gray-600 text-gray-700 dark:text-gray-200",
  label: "text-sm text-gray-600 dark:text-gray-400",
  dropdownIcon:
    "w-4 h-4 transition-transform text-gray-500 dark:text-gray-400",
  prevIcon: "w-5 h-5 text-gray-600 dark:text-gray-400",
  nextIcon: "w-5 h-5 text-gray-600 dark:text-gray-400",
  pageInfo: "flex items-center",
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
