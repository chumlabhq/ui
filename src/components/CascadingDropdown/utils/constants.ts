import type { CascadingDropdownClasses } from "./types.js";
import { structuralOnly } from "../../../utils/classLayers.js";

export const DEFAULT_CASCADINGDROPDOWN_CLASSES: Required<CascadingDropdownClasses> = {
  root: "relative",
  control: "relative",
  trigger:
    "flex items-center justify-between gap-2 w-full px-3 py-2 text-left border rounded-cl-md transition-colors border-cl-border-input bg-cl-bg-panel text-cl-text hover:border-cl-border-input-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent focus-visible:border-transparent cursor-pointer data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed data-[error]:border-cl-error has-[[data-error]]:border-cl-error data-[valid]:border-cl-success has-[[data-valid]]:border-cl-success",
  value: "flex-1 text-left truncate",
  content: "sm:min-w-[200px] overflow-y-auto rounded-cl-md shadow-lg bg-cl-bg-panel border border-cl-border",
  // first:rounded-t / last:rounded-b so the hover/selected/focused bg
  // tucks under the menu's rounded corners on the top and bottom items
  // — without these, hover paints into the corner gap and looks like a
  // square highlight escaping the rounded card.
  item:
    "flex items-center justify-between px-3 py-2 cursor-pointer transition-colors data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed text-cl-text hover:bg-cl-bg-hover first:rounded-t-cl-md last:rounded-b-cl-md data-[highlighted]:bg-cl-bg-hover",
  subContent:
    "min-w-full sm:min-w-[180px] max-h-[320px] overflow-y-auto rounded-cl-md shadow-lg bg-cl-bg-panel border border-cl-border",
  subPositioner: "z-[9999]",
  subItem:
    "flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed text-cl-text hover:bg-cl-bg-hover first:rounded-t-cl-md last:rounded-b-cl-md",
  label:
    "block text-sm font-medium mb-1 text-cl-text-chrome",
  message: "text-sm mt-1 data-[invalid]:text-cl-error data-[valid]:text-cl-success",
  description: "text-xs mb-1 text-cl-text-tertiary",
  icon:
    "w-4 h-4 shrink-0 transition-transform duration-200 text-cl-text-tertiary",
  itemIcon: "w-4 h-4 shrink-0 text-cl-text-tertiary",
  itemIndicator: "w-4 h-4 shrink-0 text-cl-accent",
  itemControl:
    "w-4 h-4 shrink-0 flex items-center justify-center rounded border border-cl-border-input",
  empty:
    "px-3 py-4 text-sm text-center text-cl-text-tertiary",
  clearTrigger:
    "absolute right-8 top-1/2 -translate-y-1/2 p-2 rounded hover:bg-cl-bg-hover cursor-pointer text-cl-text-tertiary",
  loading:
    "px-3 py-4 text-sm text-center text-cl-text-tertiary",
  loadingItem:
    "mx-2 my-1.5 h-4 rounded bg-cl-bg-skeleton animate-pulse",
  searchControl:
    "flex items-center gap-2 px-3 py-2 border-b border-cl-border",
  searchInput:
    "flex-1 bg-transparent text-sm text-cl-text placeholder:text-cl-text-tertiary focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent rounded-cl-sm",
  searchIcon: "w-4 h-4 shrink-0 text-cl-text-tertiary",
  subSearchControl: "",
  subSearchInput: "",
  subSearchIcon: "",
};

export const UNSTYLED_CASCADINGDROPDOWN_CLASSES: Required<CascadingDropdownClasses> =
  structuralOnly(DEFAULT_CASCADINGDROPDOWN_CLASSES);
