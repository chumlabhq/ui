import type { DropdownClasses } from "./types";

export const DEFAULT_DROPDOWN_CLASSES: Required<DropdownClasses> = {
  root: "",
  wrapper: "relative",
  trigger:
    "flex items-center justify-between gap-2 w-full px-3 py-2.5 text-left border rounded-cl-md transition-colors border-cl-border-input dark:border-cl-border bg-white dark:bg-cl-bg-elevated text-cl-text dark:text-white hover:border-cl-border-input dark:hover:border-cl-border focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent",
  triggerText: "flex-1 text-left truncate",
  content:
    "rounded-cl-md shadow-lg overflow-hidden bg-white dark:bg-cl-bg-elevated border border-cl-border dark:border-cl-border",
  optionList: "max-h-60 overflow-y-auto",
  option:
    "flex items-center justify-between px-3 py-2.5 cursor-pointer transition-colors text-cl-text dark:text-cl-text hover:bg-cl-bg-hover dark:hover:bg-cl-bg-elevated first:rounded-t-cl-md last:rounded-b-cl-md",
  optionSelected: "bg-cl-accent/15 dark:bg-cl-accent/50 font-medium",
  optionFocused: "bg-cl-bg-hover dark:bg-cl-bg-elevated",
  optionDisabled: "opacity-50 cursor-not-allowed pointer-events-none",
  chevron:
    "w-4 h-4 shrink-0 transition-transform duration-200 text-cl-text-tertiary dark:text-cl-text-tertiary",
  checkIcon: "w-4 h-4 shrink-0 text-cl-accent dark:text-cl-accent",
  clearIcon:
    "absolute right-8 top-1/2 -translate-y-1/2 p-2 rounded hover:bg-cl-bg-hover dark:hover:bg-cl-bg-elevated cursor-pointer text-cl-text-tertiary dark:text-cl-text-tertiary",
  noResults:
    "px-3 py-4 text-sm text-center text-cl-text-tertiary dark:text-cl-text-tertiary",
  label:
    "block text-sm font-medium mb-1 text-cl-text dark:text-cl-text-secondary",
  error: "text-sm mt-1 text-red-500 dark:text-red-400",
  description: "text-xs mb-1 text-cl-text-tertiary dark:text-cl-text-tertiary",
  success: "text-sm mt-1 text-green-600 dark:text-green-400",
  shimmer: "",
  shimmerItem:
    "mx-2 my-1.5 h-4 rounded bg-cl-bg-hover dark:bg-cl-bg-elevated animate-pulse",
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
