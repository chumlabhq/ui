import type { MultiSelectDropdownClasses } from "./types";

export const DEFAULT_MULTISELECTDROPDOWN_CLASSES: Required<MultiSelectDropdownClasses> =
  {
    root: "",
    wrapper: "relative",
    trigger:
      "flex items-center justify-between gap-2 w-full px-3 py-2 text-left border rounded-cl-md transition-colors min-h-[42px] border-cl-border-input dark:border-cl-border bg-white dark:bg-cl-bg-elevated text-cl-text dark:text-white hover:border-cl-border-input dark:hover:border-cl-border focus:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent focus-visible:border-transparent",
    triggerText:
      "flex-1 flex items-center gap-1 min-w-0 overflow-hidden",
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
    checkboxChecked: "bg-cl-accent dark:bg-cl-accent border-cl-border-input-focus dark:border-cl-border-input-focus text-cl-on-accent",
    checkboxIcon: "w-full h-full",
    chip:
      "inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-cl-md shrink-0 max-w-[100px] bg-cl-accent/15 dark:bg-cl-text/10 text-cl-accent dark:text-cl-text",
    chipRemove:
      "w-4 h-4 p-0.5 shrink-0 cursor-pointer hover:text-cl-accent dark:hover:text-cl-text-secondary appearance-none border-none bg-transparent",
    noResults:
      "px-3 py-4 text-sm text-center text-cl-text-tertiary dark:text-cl-text-tertiary",
    clearIcon: "",
    label:
      "block text-sm font-medium mb-1 text-cl-text dark:text-cl-text-secondary",
    error: "text-sm mt-1 text-cl-error",
    description: "text-xs mb-1 text-cl-text-tertiary dark:text-cl-text-tertiary",
    success: "text-sm mt-1 text-cl-success",
    shimmer: "",
    shimmerItem:
      "px-3 py-2 bg-cl-bg-hover dark:bg-cl-bg-elevated animate-pulse",
    moreCount:
      "inline-flex items-center px-2 py-0.5 text-xs rounded-cl-md shrink-0 bg-cl-bg-hover dark:bg-cl-text/10 text-cl-text-secondary dark:text-cl-text-secondary",
  };

export const UNSTYLED_MULTISELECTDROPDOWN_CLASSES: Required<MultiSelectDropdownClasses> =
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
    label: "",
    error: "",
    description: "",
    success: "",
    shimmer: "",
    shimmerItem: "",
    moreCount: "",
  };
