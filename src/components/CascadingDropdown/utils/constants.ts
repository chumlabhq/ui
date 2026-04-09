import type { CascadingDropdownClasses } from "./types";

export const DEFAULT_CASCADINGDROPDOWN_CLASSES: Required<CascadingDropdownClasses> = {
  root: "",
  wrapper: "relative",
  trigger:
    "flex items-center justify-between gap-2 w-full px-3 py-2 text-left border rounded-lg transition-colors border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:border-gray-400 dark:hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
  menu: "min-w-full sm:min-w-[200px] rounded-lg shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
  menuItem:
    "flex items-center justify-between px-3 py-2 cursor-pointer transition-colors text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700",
  menuItemSelected: "bg-blue-50 dark:bg-blue-900/50 font-medium",
  menuItemFocused: "bg-gray-100 dark:bg-gray-700",
  menuItemDisabled: "opacity-50 cursor-not-allowed pointer-events-none",
  submenu:
    "min-w-full sm:min-w-[180px] rounded-lg shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
  submenuContainer: "z-[9999]",
  submenuItem:
    "flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700",
  submenuItemSelected: "bg-blue-50 dark:bg-blue-900/50 font-medium",
  submenuItemFocused: "bg-gray-100 dark:bg-gray-700",
  label:
    "block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300",
  error: "text-sm mt-1 text-red-500 dark:text-red-400",
  description: "text-xs mb-1 text-gray-500 dark:text-gray-400",
  success: "text-sm mt-1 text-green-600 dark:text-green-400",
  chevron:
    "w-4 h-4 shrink-0 transition-transform duration-200 text-gray-500 dark:text-gray-400",
  submenuChevron: "w-4 h-4 shrink-0 text-gray-500 dark:text-gray-400",
  checkIcon: "w-4 h-4 shrink-0 text-blue-600 dark:text-blue-400",
  checkbox:
    "w-4 h-4 shrink-0 flex items-center justify-center rounded border border-gray-300 dark:border-gray-600",
  checkboxChecked:
    "bg-blue-600 dark:bg-blue-500 border-blue-600 dark:border-blue-500 text-white",
  noResults:
    "px-3 py-4 text-sm text-center text-gray-500 dark:text-gray-400",
  clearIcon:
    "absolute right-8 top-1/2 -translate-y-1/2 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer text-gray-500 dark:text-gray-400",
  loading:
    "px-3 py-4 text-sm text-center text-gray-500 dark:text-gray-400",
  shimmer: "",
  shimmerItem:
    "mx-2 my-1.5 h-4 rounded bg-gray-200 dark:bg-gray-700 animate-pulse",
  searchInput:
    "flex items-center gap-2 px-3 py-2 border-b border-gray-200 dark:border-gray-700",
  searchInputElement:
    "flex-1 bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none",
  searchIcon: "w-4 h-4 shrink-0 text-gray-400 dark:text-gray-500",
  submenuSearchInput: "",
  submenuSearchInputElement: "",
  submenuSearchIcon: "",
  content:
    "rounded-lg shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
  option:
    "flex items-center justify-between px-3 py-2 cursor-pointer transition-colors text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700",
  optionSelected: "bg-blue-50 dark:bg-blue-900/50 font-medium",
  optionFocused: "bg-gray-100 dark:bg-gray-700",
  optionDisabled: "opacity-50 cursor-not-allowed pointer-events-none",
};

export const UNSTYLED_CASCADINGDROPDOWN_CLASSES: Required<CascadingDropdownClasses> = {
  root: "",
  wrapper: "",
  trigger: "",
  menu: "",
  menuItem: "",
  menuItemSelected: "",
  menuItemFocused: "",
  menuItemDisabled: "",
  submenu: "",
  submenuContainer: "",
  submenuItem: "",
  submenuItemSelected: "",
  submenuItemFocused: "",
  label: "",
  error: "",
  description: "",
  success: "",
  chevron: "",
  submenuChevron: "",
  checkIcon: "",
  checkbox: "",
  checkboxChecked: "",
  noResults: "",
  clearIcon: "",
  loading: "",
  shimmer: "",
  shimmerItem: "",
  searchInput: "",
  searchInputElement: "",
  searchIcon: "",
  submenuSearchInput: "",
  submenuSearchInputElement: "",
  submenuSearchIcon: "",
  content: "",
  option: "",
  optionSelected: "",
  optionFocused: "",
  optionDisabled: "",
};
