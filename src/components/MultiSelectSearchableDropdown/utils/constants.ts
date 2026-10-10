import type { MultiSelectSearchableDropdownClasses } from "./types.js";
import { structuralOnly } from "../../../utils/classLayers.js";

export const DEFAULT_MULTISELECTSEARCHABLEDROPDOWN_CLASSES: Required<MultiSelectSearchableDropdownClasses> =
  {
    root: "",
    control: "relative",
    trigger:
      "flex items-center justify-between gap-2 w-full px-3 py-2 text-left border rounded-cl-md transition-colors min-h-[42px] border-cl-border-input bg-cl-bg-panel text-cl-text hover:border-cl-border-input-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent focus-visible:border-transparent cursor-pointer data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed data-[error]:border-cl-error has-[[data-error]]:border-cl-error data-[valid]:border-cl-success has-[[data-valid]]:border-cl-success",
    value:
      "flex-1 flex items-center gap-1.5 flex-wrap min-w-0",
    content:
      "rounded-cl-md shadow-lg overflow-hidden bg-cl-bg-panel border border-cl-border",
    list: "max-h-60 overflow-y-auto",
    item:
      "flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed text-cl-text hover:bg-cl-bg-hover first:rounded-t-cl-md last:rounded-b-cl-md data-[highlighted]:bg-cl-bg-hover",
    icon:
      "w-4 h-4 shrink-0 transition-transform duration-200 text-cl-text-tertiary",
    itemControl:
      "w-4 h-4 shrink-0 border rounded flex items-center justify-center border-cl-border-input",
    itemIndicator: "w-full h-full",
    chip:
      "inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-cl-md shrink-0 max-w-[100px] bg-cl-accent-bg text-cl-accent-hover",
    chipRemoveTrigger:
      "inline-flex items-center justify-center min-w-6 min-h-6 -my-1 -mr-1 shrink-0 cursor-pointer hover:bg-cl-accent-bg-hover rounded-cl-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent",
    empty:
      "px-3 py-4 text-sm text-center text-cl-text-tertiary",
    clearTrigger: "inline-flex items-center justify-center min-w-6 min-h-6 shrink-0 cursor-pointer",
    loading:
      "px-3 py-4 text-sm text-center text-cl-text-tertiary",
    loadingItem:
      "mx-2 my-1.5 h-4 rounded bg-cl-bg-skeleton animate-pulse",
    label:
      "block text-sm font-medium mb-1 text-cl-text-chrome",
    message: "text-sm mt-1 data-[invalid]:text-cl-error data-[valid]:text-cl-success",
    description: "text-xs mb-1 text-cl-text-tertiary",
    searchControl:
      "flex items-center gap-2 px-3 py-2 border-b border-cl-border bg-cl-bg-recessed",
    searchInput:
      "flex-1 bg-transparent focus:outline-none text-cl-text placeholder:text-cl-text-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent rounded-cl-sm",
    searchIcon: "w-4 h-4 shrink-0 text-cl-text-tertiary",
    count:
      "inline-flex items-center px-2 py-0.5 text-xs rounded-cl-md shrink-0 bg-cl-bg-item-hover text-cl-text-secondary",
  };

export const UNSTYLED_MULTISELECTSEARCHABLEDROPDOWN_CLASSES: Required<MultiSelectSearchableDropdownClasses> =
  structuralOnly(DEFAULT_MULTISELECTSEARCHABLEDROPDOWN_CLASSES);
