import type { DropdownClasses } from "./types";

export const DEFAULT_DROPDOWN_CLASSES: Required<DropdownClasses> = {
  root: "",
  wrapper: "relative",
  trigger:
    "flex items-center justify-between gap-2 w-full px-3 py-2.5 text-left border rounded-lg transition-colors border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:border-gray-400 dark:hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
  triggerText: "flex-1 text-left truncate",
  content:
    "rounded-lg shadow-lg overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
  optionList: "max-h-60 overflow-y-auto",
  option:
    "flex items-center justify-between px-3 py-2.5 cursor-pointer transition-colors text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700",
  optionSelected: "bg-blue-50 dark:bg-blue-900/50 font-medium",
  optionFocused: "bg-gray-100 dark:bg-gray-700",
  optionDisabled: "opacity-50 cursor-not-allowed pointer-events-none",
  chevron:
    "w-4 h-4 shrink-0 transition-transform duration-200 text-gray-500 dark:text-gray-400",
  checkIcon: "w-4 h-4 shrink-0 text-blue-600 dark:text-blue-400",
  clearIcon:
    "absolute right-8 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer text-gray-500 dark:text-gray-400",
  noResults:
    "px-3 py-4 text-sm text-center text-gray-500 dark:text-gray-400",
  label:
    "block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300",
  error: "text-sm mt-1 text-red-500 dark:text-red-400",
  description: "text-xs mb-1 text-gray-500 dark:text-gray-400",
  success: "text-sm mt-1 text-green-600 dark:text-green-400",
  shimmer: "",
  shimmerItem:
    "mx-2 my-1.5 h-4 rounded bg-gray-200 dark:bg-gray-700 animate-pulse",
};

export const UNSTYLED_DROPDOWN_CLASSES: Required<DropdownClasses> = {
  root: "",
  wrapper: "",
  trigger: "",
  triggerText: "",
  content: "",
  optionList: "",
  option: "",
  optionSelected: "",
  optionFocused: "",
  optionDisabled: "",
  chevron: "",
  checkIcon: "",
  clearIcon: "",
  noResults: "",
  label: "",
  error: "",
  description: "",
  success: "",
  shimmer: "",
  shimmerItem: "",
};
