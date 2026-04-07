import type { MultiSelectSearchableDropdownClasses } from "./types";

export const DEFAULT_MULTISELECTSEARCHABLEDROPDOWN_CLASSES: Required<MultiSelectSearchableDropdownClasses> =
  {
    root: "",
    wrapper: "relative",
    trigger:
      "flex items-center justify-between gap-2 w-full px-3 py-2 text-left border rounded-lg transition-colors min-h-[42px] border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:border-gray-400 dark:hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
    triggerText:
      "flex-1 flex items-center gap-1.5 flex-wrap min-w-0",
    content:
      "rounded-lg shadow-lg overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
    optionList: "max-h-60 overflow-y-auto",
    option:
      "flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700",
    optionSelected: "bg-blue-50 dark:bg-blue-900/50",
    optionFocused: "bg-gray-100 dark:bg-gray-600",
    optionDisabled: "opacity-50 cursor-not-allowed pointer-events-none",
    chevron:
      "w-4 h-4 shrink-0 transition-transform duration-200 text-gray-500 dark:text-gray-400",
    checkbox:
      "w-4 h-4 shrink-0 border rounded flex items-center justify-center border-gray-300 dark:border-gray-500",
    checkboxChecked: "bg-blue-600 border-blue-600 text-white",
    checkboxIcon: "w-full h-full",
    chip:
      "inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-md shrink-0 max-w-[100px] bg-blue-100 dark:bg-gray-600 text-blue-800 dark:text-gray-200",
    chipRemove:
      "w-3 h-3 shrink-0 cursor-pointer hover:text-blue-600 dark:hover:text-gray-300",
    noResults:
      "px-3 py-4 text-sm text-center text-gray-500 dark:text-gray-400",
    clearIcon: "",
    loading:
      "px-3 py-4 text-sm text-center text-gray-500 dark:text-gray-400",
    shimmer: "",
    shimmerItem: "",
    label:
      "block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300",
    error: "text-sm mt-1 text-red-500 dark:text-red-400",
    description: "text-xs mb-1 text-gray-500 dark:text-gray-400",
    success: "text-sm mt-1 text-green-600 dark:text-green-400",
    searchInput:
      "flex items-center gap-2 px-3 py-2 border-b border-gray-200 dark:border-gray-700 dark:bg-gray-800",
    searchInputElement:
      "flex-1 bg-transparent focus:outline-none text-gray-900 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500",
    searchIcon: "w-4 h-4 shrink-0 text-gray-400 dark:text-gray-500",
    moreCount:
      "inline-flex items-center px-2 py-0.5 text-xs rounded-md shrink-0 bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300",
  };

export const UNSTYLED_MULTISELECTSEARCHABLEDROPDOWN_CLASSES: Required<MultiSelectSearchableDropdownClasses> =
  {
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
    checkbox: "",
    checkboxChecked: "",
    checkboxIcon: "",
    chip: "",
    chipRemove: "",
    noResults: "",
    clearIcon: "",
    loading: "",
    shimmer: "",
    shimmerItem: "",
    label: "",
    error: "",
    description: "",
    success: "",
    searchInput: "",
    searchInputElement: "",
    searchIcon: "",
    moreCount: "",
  };
