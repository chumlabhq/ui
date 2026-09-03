import type { MultiSelectSearchableDropdownClasses } from "./types";
import { structuralOnly } from "../../../utils/classLayers";

export const DEFAULT_MULTISELECTSEARCHABLEDROPDOWN_CLASSES: Required<MultiSelectSearchableDropdownClasses> =
  {
    root: "",
    control: "relative",
    trigger:
      "flex items-center justify-between gap-2 w-full px-3 py-2 text-left border rounded-cl-md transition-colors min-h-[42px] border-cl-border-input dark:border-cl-border bg-white dark:bg-cl-bg-elevated text-cl-text dark:text-white hover:border-cl-border-input dark:hover:border-cl-border focus:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent focus-visible:border-transparent",
    value:
      "flex-1 flex items-center gap-1.5 flex-wrap min-w-0",
    content:
      "rounded-cl-md shadow-lg overflow-hidden bg-white dark:bg-cl-bg-elevated border border-cl-border dark:border-cl-border",
    list: "max-h-60 overflow-y-auto",
    item:
      "flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed text-cl-text dark:text-cl-text hover:bg-cl-bg-hover dark:hover:bg-cl-bg-elevated first:rounded-t-cl-md last:rounded-b-cl-md",
    icon:
      "w-4 h-4 shrink-0 transition-transform duration-200 text-cl-text-tertiary dark:text-cl-text-tertiary",
    itemControl:
      "w-4 h-4 shrink-0 border rounded flex items-center justify-center border-cl-border-input dark:border-cl-border",
    itemIndicator: "w-full h-full",
    chip:
      "inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-cl-md shrink-0 max-w-[100px] bg-cl-accent/15 dark:bg-cl-text/10 text-cl-accent dark:text-cl-text",
    chipRemove:
      "w-3 h-3 shrink-0 cursor-pointer hover:text-cl-accent dark:hover:text-cl-text-secondary",
    empty:
      "px-3 py-4 text-sm text-center text-cl-text-tertiary dark:text-cl-text-tertiary",
    clearTrigger: "",
    loading:
      "px-3 py-4 text-sm text-center text-cl-text-tertiary dark:text-cl-text-tertiary",
    loadingItem:
      "px-3 py-4 text-sm text-center text-cl-text-tertiary dark:text-cl-text-tertiary",
    label:
      "block text-sm font-medium mb-1 text-cl-text dark:text-cl-text-secondary",
    message: "text-sm mt-1 text-cl-error text-cl-success",
    description: "text-xs mb-1 text-cl-text-tertiary dark:text-cl-text-tertiary",
    searchControl:
      "flex items-center gap-2 px-3 py-2 border-b border-cl-border dark:border-cl-border dark:bg-cl-bg-elevated",
    searchInput:
      "flex-1 bg-transparent outline-none flex-1 bg-transparent focus:outline-none text-cl-text dark:text-cl-text placeholder:text-cl-text-tertiary dark:placeholder:text-cl-text-tertiary",
    searchIcon: "w-4 h-4 shrink-0 text-cl-text-tertiary dark:text-cl-text-tertiary",
    count:
      "inline-flex items-center px-2 py-0.5 text-xs rounded-cl-md shrink-0 bg-cl-bg-hover dark:bg-cl-text/10 text-cl-text-secondary dark:text-cl-text-secondary",
  };

export const UNSTYLED_MULTISELECTSEARCHABLEDROPDOWN_CLASSES: Required<MultiSelectSearchableDropdownClasses> =
  structuralOnly(DEFAULT_MULTISELECTSEARCHABLEDROPDOWN_CLASSES);
