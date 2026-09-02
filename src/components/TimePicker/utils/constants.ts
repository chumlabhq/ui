import type { TimePickerClasses } from "./types";
import { structuralOnly } from "../../../utils/classLayers";

export const DEFAULT_TIMEPICKER_CLASSES: Required<TimePickerClasses> = {
  root: "inline-flex flex-col gap-1 text-cl-text dark:text-cl-text",
  label:
    "block text-sm font-medium mb-1 text-cl-text dark:text-cl-text-secondary",
  control: "relative",
  trigger:
    "flex items-center gap-2 w-full sm:w-56 px-3 py-2 border rounded-cl-md transition-colors cursor-text border-cl-border-input dark:border-cl-border bg-white dark:bg-cl-bg-elevated hover:border-cl-border-input dark:hover:border-cl-border focus-within:ring-2 focus-within:ring-cl-accent focus-within:border-transparent",
  input:
    "flex-1 min-w-0 bg-transparent outline-none text-sm placeholder:text-cl-text-tertiary text-cl-text dark:text-cl-text",
  icon:
    "w-4 h-4 shrink-0 transition-transform duration-200 text-cl-text-tertiary",
  clearTrigger:
    "shrink-0 cursor-pointer text-cl-text-tertiary hover:text-cl-text-secondary dark:hover:text-cl-text",
  content:
    "border rounded-cl-md shadow-lg overflow-hidden bg-white dark:bg-cl-bg-elevated border-cl-border dark:border-cl-border",
  list: "max-h-60 overflow-y-auto",
  item:
    "flex items-center justify-between px-3 py-2 cursor-pointer text-sm text-cl-text dark:text-cl-text hover:bg-cl-bg-hover dark:hover:bg-cl-bg-elevated",
  itemIndicator: "w-4 h-4 shrink-0 text-cl-accent dark:text-cl-accent",
  empty:
    "px-3 py-4 text-sm text-center text-cl-text-tertiary dark:text-cl-text-tertiary",
  message: "text-sm mt-1 text-cl-error text-cl-success",
  description: "text-xs mb-1 text-cl-text-tertiary dark:text-cl-text-tertiary",
  clockContent:
    "p-3 sm:p-4 border rounded-cl-lg shadow-lg bg-white dark:bg-cl-bg-elevated border-cl-border dark:border-cl-border",
  clockDisplay: "flex items-center justify-center gap-1 mb-4",
  clockHours:
    "px-3 py-2 text-2xl font-semibold rounded-cl-md cursor-pointer transition-colors text-cl-text-secondary dark:text-cl-text-secondary hover:bg-cl-bg-hover dark:hover:bg-cl-bg-elevated",
  clockMinutes:
    "px-3 py-2 text-2xl font-semibold rounded-cl-md cursor-pointer transition-colors text-cl-text-secondary dark:text-cl-text-secondary hover:bg-cl-bg-hover dark:hover:bg-cl-bg-elevated",
  clockSeparator:
    "text-2xl font-semibold text-cl-text-tertiary dark:text-cl-text-tertiary",
  clockFace:
    "relative w-44 h-44 sm:w-52 sm:h-52 mx-auto rounded-full bg-cl-bg-hover dark:bg-cl-bg-elevated",
  clockHand: "absolute inset-0",
  clockHandLine: "stroke-cl-accent dark:stroke-cl-accent",
  clockHandDot:
    "w-3 h-3 rounded-full bg-cl-accent dark:bg-cl-accent/30",
  clockNumber:
    "absolute text-sm font-medium cursor-pointer select-none transition-colors text-cl-text-secondary dark:text-cl-text-secondary hover:text-cl-text dark:hover:text-white text-xs text-cl-text-tertiary dark:text-cl-text-tertiary",
  clockCenter: "fill-cl-accent dark:fill-cl-accent",
  footer: "flex items-center justify-end gap-2 mt-4",
  cancelButton:
    "px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors text-cl-text-secondary dark:text-cl-text-secondary hover:bg-black/5 dark:hover:bg-white/10",
  confirmButton:
    "px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors bg-cl-accent dark:bg-cl-accent text-cl-on-accent hover:bg-cl-accent dark:hover:bg-cl-accent",
  row: "flex flex-col gap-1 ml-3",
  periodButton:
    "px-2 py-1 text-xs font-medium rounded-cl-md cursor-pointer transition-colors text-cl-text-tertiary dark:text-cl-text-tertiary hover:bg-black/5 dark:hover:bg-white/10",
};

export const UNSTYLED_TIMEPICKER_CLASSES: Required<TimePickerClasses> =
  structuralOnly(DEFAULT_TIMEPICKER_CLASSES);
