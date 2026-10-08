import type { MultiSelectDropdownClasses } from "./types.js";
import { structuralOnly } from "../../../utils/classLayers.js";

export const DEFAULT_MULTISELECTDROPDOWN_CLASSES: Required<MultiSelectDropdownClasses> =
  {
    root: "",
    control: "relative",
    trigger:
      "flex items-center justify-between gap-2 w-full px-3 py-2 text-left border rounded-cl-md transition-colors min-h-[42px] border-cl-border-input bg-cl-bg-panel text-cl-text hover:border-cl-border-input-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent focus-visible:border-transparent cursor-pointer data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed data-[error]:border-cl-error has-[[data-error]]:border-cl-error data-[valid]:border-cl-success has-[[data-valid]]:border-cl-success",
    // Wraps rather than clipping: the clip took the remove button's negative
    // margin out of the hit area, 24x20 against a 24x24 rect, which
    // `target-size` cannot see because it reads the rect.
    value: "flex-1 flex items-center gap-1.5 flex-wrap min-w-0",
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
    chipRemove:
      "inline-flex items-center justify-center min-w-6 min-h-6 -my-1 -mr-1 shrink-0 cursor-pointer hover:bg-cl-accent-bg-hover appearance-none border-0 bg-transparent rounded-cl-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent",
    empty:
      "px-3 py-4 text-sm text-center text-cl-text-tertiary",
    clearTrigger: "inline-flex items-center justify-center min-w-6 min-h-6 shrink-0 cursor-pointer",
    label:
      "block text-sm font-medium mb-1 text-cl-text-chrome",
    message: "text-sm mt-1 data-[invalid]:text-cl-error data-[valid]:text-cl-success",
    description: "text-xs mb-1 text-cl-text-tertiary",
    // The pulse lives on the bars below, not here and not on the row: the
    // three nested and compounded to 0.125 opacity at the trough, which the
    // old opaque grey survived and a translucent skeleton does not.
    loading: "px-3 py-2 bg-cl-bg-hover",
    loadingItem:
      "px-3 py-2 bg-cl-bg-hover flex items-center gap-2",
    loadingIcon: "w-4 h-4 bg-cl-bg-skeleton rounded animate-pulse",
    loadingBar: "flex-1 h-4 bg-cl-bg-skeleton rounded animate-pulse",
    count:
      "inline-flex items-center px-2 py-0.5 text-xs rounded-cl-md shrink-0 bg-cl-bg-item-hover text-cl-text-secondary",
  };

export const UNSTYLED_MULTISELECTDROPDOWN_CLASSES: Required<MultiSelectDropdownClasses> =
  structuralOnly(DEFAULT_MULTISELECTDROPDOWN_CLASSES);
