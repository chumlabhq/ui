import type { MultiSelectDropdownClasses } from "./types";
import { structuralOnly } from "../../../utils/classLayers";

export const DEFAULT_MULTISELECTDROPDOWN_CLASSES: Required<MultiSelectDropdownClasses> =
  {
    root: "",
    control: "relative",
    trigger:
      "flex items-center justify-between gap-2 w-full px-3 py-2 text-left border rounded-cl-md transition-colors min-h-[42px] border-cl-border-input bg-cl-bg-panel text-cl-text dark:text-white hover:border-cl-border-input focus:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent focus-visible:border-transparent",
    value:
      "flex-1 flex items-center gap-1 min-w-0 overflow-hidden",
    content:
      "rounded-cl-md shadow-lg overflow-hidden bg-cl-bg-panel border border-cl-border",
    list: "max-h-60 overflow-y-auto",
    item:
      "flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed text-cl-text hover:bg-cl-bg-hover first:rounded-t-cl-md last:rounded-b-cl-md",
    icon:
      "w-4 h-4 shrink-0 transition-transform duration-200 text-cl-text-tertiary",
    itemControl:
      "w-4 h-4 shrink-0 border rounded flex items-center justify-center border-cl-border-input",
    itemIndicator: "w-full h-full",
    chip:
      "inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-cl-md shrink-0 max-w-[100px] bg-cl-accent/15 dark:bg-cl-text/10 text-cl-accent dark:text-cl-text",
    chipRemove:
      "w-4 h-4 p-0.5 shrink-0 cursor-pointer hover:text-cl-accent dark:hover:text-cl-text-secondary appearance-none border-none bg-transparent",
    empty:
      "px-3 py-4 text-sm text-center text-cl-text-tertiary",
    clearTrigger: "",
    label:
      "block text-sm font-medium mb-1 text-cl-text dark:text-cl-text-secondary",
    message: "text-sm mt-1 text-cl-error text-cl-success",
    description: "text-xs mb-1 text-cl-text-tertiary",
    loading: "px-3 py-2 bg-cl-bg-hover animate-pulse",
    loadingItem:
      "px-3 py-2 bg-cl-bg-hover animate-pulse flex items-center gap-2",
    loadingIcon: "w-4 h-4 bg-gray-200 rounded animate-pulse",
    loadingBar: "flex-1 h-4 bg-gray-200 rounded animate-pulse",
    count:
      "inline-flex items-center px-2 py-0.5 text-xs rounded-cl-md shrink-0 bg-cl-bg-hover dark:bg-cl-text/10 text-cl-text-secondary",
  };

export const UNSTYLED_MULTISELECTDROPDOWN_CLASSES: Required<MultiSelectDropdownClasses> =
  structuralOnly(DEFAULT_MULTISELECTDROPDOWN_CLASSES);
