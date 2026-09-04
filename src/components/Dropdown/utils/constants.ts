import type { DropdownClasses } from "./types";
import { structuralOnly } from "../../../utils/classLayers";

export const DEFAULT_DROPDOWN_CLASSES: Required<DropdownClasses> = {
  root: "",
  control: "relative",
  trigger:
    "flex items-center justify-between gap-2 w-full px-3 py-2.5 text-left border rounded-cl-md transition-colors border-cl-border-input dark:border-cl-border bg-white dark:bg-cl-bg-elevated text-cl-text dark:text-white hover:border-cl-border-input dark:hover:border-cl-border focus:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent focus-visible:border-transparent",
  value: "flex-1 text-left truncate",
  content:
    "rounded-cl-md shadow-lg overflow-hidden bg-white dark:bg-cl-bg-elevated border border-cl-border",
  list: "max-h-60 overflow-y-auto",
  item:
    "flex items-center justify-between px-3 py-2.5 cursor-pointer transition-colors text-cl-text hover:bg-cl-bg-hover dark:hover:bg-cl-bg-elevated first:rounded-t-cl-md last:rounded-b-cl-md",
  icon:
    "w-4 h-4 shrink-0 transition-transform duration-200 text-cl-text-tertiary",
  itemIndicator: "w-4 h-4 shrink-0 text-cl-accent",
  clearTrigger:
    "absolute right-8 top-1/2 -translate-y-1/2 p-2 rounded hover:bg-cl-bg-hover dark:hover:bg-cl-bg-elevated cursor-pointer text-cl-text-tertiary",
  empty:
    "px-3 py-4 text-sm text-center text-cl-text-tertiary",
  label:
    "block text-sm font-medium mb-1 text-cl-text dark:text-cl-text-secondary",
  message: "text-sm mt-1 text-cl-error text-cl-success",
  description: "text-xs mb-1 text-cl-text-tertiary",
  loading: "",
  loadingItem:
    "mx-2 my-1.5 h-4 rounded bg-cl-bg-hover dark:bg-cl-bg-elevated animate-pulse",
};

export const UNSTYLED_DROPDOWN_CLASSES: Required<DropdownClasses> =
  structuralOnly(DEFAULT_DROPDOWN_CLASSES);
