import type { BreadcrumbClasses } from "./types";

export const DEFAULT_BREADCRUMB_CLASSES: Required<BreadcrumbClasses> = {
  root: "",
  list: "flex flex-wrap items-center gap-1",
  item: "flex items-center gap-1 px-2 py-1 text-sm transition-colors cursor-pointer bg-transparent border-none text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 dark:focus-visible:ring-offset-gray-900",
  itemActive: "flex items-center gap-1 px-2 py-1 text-sm font-medium bg-transparent border-none cursor-default text-gray-900 dark:text-white",
  itemDisabled: "opacity-40 cursor-not-allowed hover:bg-transparent hover:text-gray-500 dark:hover:text-gray-400",
  link: "flex items-center gap-1 px-2 py-1 text-sm rounded transition-colors text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 dark:focus-visible:ring-offset-gray-900",
  separator: "text-gray-400 dark:text-gray-600",
  icon: "shrink-0",
  ellipsis: "",
  ellipsisButton: "flex items-center justify-center w-10 h-10 rounded-md transition-colors cursor-pointer bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 dark:focus-visible:ring-offset-gray-900",
  dropdown: "min-w-40 rounded-lg shadow-lg py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
  dropdownItem: "flex items-center gap-2 px-3 py-2 text-sm cursor-pointer w-full text-left bg-transparent border-none text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500",
  dropdownItemDisabled: "opacity-50 cursor-not-allowed",
};

export const UNSTYLED_BREADCRUMB_CLASSES: Required<BreadcrumbClasses> = {
  root: "",
  list: "",
  item: "",
  itemActive: "",
  itemDisabled: "",
  link: "",
  separator: "",
  icon: "",
  ellipsis: "",
  ellipsisButton: "",
  dropdown: "",
  dropdownItem: "",
  dropdownItemDisabled: "",
};
