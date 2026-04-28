import type { MultiSelectSearchableDropdownClasses } from "./types";

export const DEFAULT_MULTISELECTSEARCHABLEDROPDOWN_CLASSES: Required<MultiSelectSearchableDropdownClasses> =
  {
    root: "",
    wrapper: "relative",
    trigger:
      "flex items-center justify-between gap-2 w-full px-3 py-2 text-left border rounded-cl-md transition-colors min-h-[42px] border-cl-border-input dark:border-cl-border bg-white dark:bg-cl-bg-elevated text-cl-text dark:text-white hover:border-cl-border-input dark:hover:border-cl-border focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent",
    triggerText:
      "flex-1 flex items-center gap-1.5 flex-wrap min-w-0",
    content:
      "rounded-cl-md shadow-lg overflow-hidden bg-white dark:bg-cl-bg-elevated border border-cl-border dark:border-cl-border",
    optionList: "max-h-60 overflow-y-auto",
    option:
      "flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed text-cl-text dark:text-cl-text hover:bg-cl-bg-hover dark:hover:bg-cl-bg-elevated first:rounded-t-cl-md last:rounded-b-cl-md",
    optionSelected: "bg-cl-accent/15 dark:bg-cl-accent/50",
    optionFocused: "bg-cl-bg-hover dark:bg-cl-text/10",
    optionDisabled: "opacity-50 cursor-not-allowed pointer-events-none",
    chevron:
      "w-4 h-4 shrink-0 transition-transform duration-200 text-cl-text-tertiary dark:text-cl-text-tertiary",
    checkbox:
      "w-4 h-4 shrink-0 border rounded flex items-center justify-center border-cl-border-input dark:border-cl-border",
    checkboxChecked: "bg-cl-accent border-cl-border-input-focus text-white",
    checkboxIcon: "w-full h-full",
    chip:
      "inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-cl-md shrink-0 max-w-[100px] bg-cl-accent/15 dark:bg-cl-text/10 text-cl-accent dark:text-cl-text",
    chipRemove:
      "w-3 h-3 shrink-0 cursor-pointer hover:text-cl-accent dark:hover:text-cl-text-secondary",
    noResults:
      "px-3 py-4 text-sm text-center text-cl-text-tertiary dark:text-cl-text-tertiary",
    clearIcon: "",
    loading:
      "px-3 py-4 text-sm text-center text-cl-text-tertiary dark:text-cl-text-tertiary",
    shimmer: "",
    shimmerItem: "",
    label:
      "block text-sm font-medium mb-1 text-cl-text dark:text-cl-text-secondary",
    error: "text-sm mt-1 text-red-500 dark:text-red-400",
    description: "text-xs mb-1 text-cl-text-tertiary dark:text-cl-text-tertiary",
    success: "text-sm mt-1 text-green-600 dark:text-green-400",
    searchInput:
      "flex items-center gap-2 px-3 py-2 border-b border-cl-border dark:border-cl-border dark:bg-cl-bg-elevated",
    searchInputElement:
      "flex-1 bg-transparent focus:outline-none text-cl-text dark:text-cl-text placeholder:text-cl-text-tertiary dark:placeholder:text-cl-text-tertiary",
    searchIcon: "w-4 h-4 shrink-0 text-cl-text-tertiary dark:text-cl-text-tertiary",
    moreCount:
      "inline-flex items-center px-2 py-0.5 text-xs rounded-cl-md shrink-0 bg-cl-bg-hover dark:bg-cl-text/10 text-cl-text-secondary dark:text-cl-text-secondary",
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
