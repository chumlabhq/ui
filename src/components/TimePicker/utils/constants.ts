import type { TimePickerClasses } from "./types";

export const DEFAULT_TIMEPICKER_CLASSES: Required<TimePickerClasses> = {
  root: "inline-flex flex-col gap-1 text-cl-text dark:text-cl-text",
  label:
    "block text-sm font-medium mb-1 text-cl-text dark:text-cl-text-secondary",
  wrapper: "relative",
  trigger:
    "flex items-center gap-2 w-full sm:w-56 px-3 py-2 border rounded-cl-md transition-colors cursor-text border-cl-border-input dark:border-cl-border bg-white dark:bg-cl-bg-elevated hover:border-cl-border-input dark:hover:border-cl-border focus-within:ring-2 focus-within:ring-cl-accent focus-within:border-transparent",
  input:
    "flex-1 min-w-0 bg-transparent outline-none text-sm placeholder:text-cl-text-tertiary text-cl-text dark:text-cl-text",
  endIcon:
    "w-4 h-4 shrink-0 transition-transform duration-200 text-cl-text-tertiary",
  clearIcon:
    "shrink-0 cursor-pointer text-cl-text-tertiary hover:text-cl-text-secondary dark:hover:text-cl-text",
  dropdown:
    "border rounded-cl-md shadow-lg overflow-hidden bg-white dark:bg-cl-bg-elevated border-cl-border dark:border-cl-border",
  optionList: "max-h-60 overflow-y-auto",
  option:
    "flex items-center justify-between px-3 py-2 cursor-pointer text-sm text-cl-text dark:text-cl-text hover:bg-cl-bg-hover dark:hover:bg-cl-bg-elevated",
  optionSelected: "bg-cl-accent/15 dark:bg-cl-accent/40 font-medium",
  optionFocused: "bg-cl-bg-hover dark:bg-cl-bg-elevated",
  selectedIcon: "w-4 h-4 shrink-0 text-cl-accent dark:text-cl-accent",
  noResults:
    "px-3 py-4 text-sm text-center text-cl-text-tertiary dark:text-cl-text-tertiary",
  error: "text-sm mt-1 text-cl-error",
  description: "text-xs mb-1 text-cl-text-tertiary dark:text-cl-text-tertiary",
  success: "text-sm mt-1 text-cl-success",
  clockContainer:
    "p-3 sm:p-4 border rounded-cl-lg shadow-lg bg-white dark:bg-cl-bg-elevated border-cl-border dark:border-cl-border",
  clockDisplay: "flex items-center justify-center gap-1 mb-4",
  clockDisplayHours:
    "px-3 py-2 text-2xl font-semibold rounded-cl-md cursor-pointer transition-colors text-cl-text-secondary dark:text-cl-text-secondary hover:bg-cl-bg-hover dark:hover:bg-cl-bg-elevated",
  clockDisplayMinutes:
    "px-3 py-2 text-2xl font-semibold rounded-cl-md cursor-pointer transition-colors text-cl-text-secondary dark:text-cl-text-secondary hover:bg-cl-bg-hover dark:hover:bg-cl-bg-elevated",
  clockDisplayActive:
    "bg-cl-accent dark:bg-cl-accent text-cl-on-accent hover:bg-cl-accent dark:hover:bg-cl-accent",
  clockDisplaySeparator:
    "text-2xl font-semibold text-cl-text-tertiary dark:text-cl-text-tertiary",
  clockFace:
    "relative w-44 h-44 sm:w-52 sm:h-52 mx-auto rounded-full bg-cl-bg-hover dark:bg-cl-bg-elevated",
  clockHand: "absolute inset-0",
  clockHandLine: "stroke-cl-accent dark:stroke-cl-accent",
  clockHandDot:
    "w-3 h-3 rounded-full bg-cl-accent dark:bg-cl-accent/30",
  clockNumber:
    "absolute text-sm font-medium cursor-pointer select-none transition-colors text-cl-text-secondary dark:text-cl-text-secondary hover:text-cl-text dark:hover:text-white",
  clockNumberSelected:
    "text-cl-on-accent font-bold bg-cl-accent dark:bg-cl-accent rounded-full w-8 h-8 flex items-center justify-center",
  clockNumberInner: "text-xs text-cl-text-tertiary dark:text-cl-text-tertiary",
  clockNumberDisabled:
    "opacity-30 cursor-not-allowed text-cl-text-secondary dark:text-cl-text-secondary",
  clockCenter: "fill-cl-accent dark:fill-cl-accent",
  clockActions: "flex items-center justify-end gap-2 mt-4",
  clockCancelButton:
    "px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors text-cl-text-secondary dark:text-cl-text-secondary hover:bg-black/5 dark:hover:bg-white/10",
  clockOkButton:
    "px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors bg-cl-accent dark:bg-cl-accent text-cl-on-accent hover:bg-cl-accent dark:hover:bg-cl-accent",
  clockPeriodToggle: "flex flex-col gap-1 ml-3",
  clockPeriodButton:
    "px-2 py-1 text-xs font-medium rounded-cl-md cursor-pointer transition-colors text-cl-text-tertiary dark:text-cl-text-tertiary hover:bg-black/5 dark:hover:bg-white/10",
  clockPeriodActive:
    "bg-cl-accent dark:bg-cl-accent text-cl-on-accent",
};

export const UNSTYLED_TIMEPICKER_CLASSES: Required<TimePickerClasses> = {
  root: "",
  label: "",
  wrapper: "",
  trigger: "",
  input: "",
  endIcon: "",
  clearIcon: "",
  dropdown: "",
  optionList: "",
  option: "",
  optionSelected: "",
  optionFocused: "",
  selectedIcon: "",
  noResults: "",
  error: "",
  description: "",
  success: "",
  clockContainer: "",
  clockDisplay: "",
  clockDisplayHours: "",
  clockDisplayMinutes: "",
  clockDisplayActive: "",
  clockDisplaySeparator: "",
  clockFace: "",
  clockHand: "",
  clockHandLine: "",
  clockHandDot: "",
  clockNumber: "",
  clockNumberSelected: "",
  clockNumberInner: "",
  clockNumberDisabled: "",
  clockCenter: "",
  clockActions: "",
  clockCancelButton: "",
  clockOkButton: "",
  clockPeriodToggle: "",
  clockPeriodButton: "",
  clockPeriodActive: "",
};
