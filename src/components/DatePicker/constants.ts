import type { DatePickerClasses } from "./utils/types";
import { structuralOnly } from "../../utils/classLayers";

export const DEFAULT_DATEPICKER_CLASSES: Required<DatePickerClasses> = {
  root: "",
  trigger: "flex items-center gap-2 w-full px-3 py-2.5 border border-cl-border-input dark:border-cl-border rounded-cl-md bg-white dark:bg-cl-bg-elevated hover:border-cl-border-input dark:hover:border-cl-border focus:ring-2 focus:ring-cl-accent dark:focus:ring-cl-accent focus:border-transparent cursor-pointer transition-all text-sm text-cl-text dark:text-cl-text data-[loading]:opacity-50 data-[loading]:pointer-events-none",
  input: "flex-1 text-left truncate",
  triggerActions: "flex items-center gap-1",
  icon: "w-5 h-5 shrink-0 text-cl-text-tertiary dark:text-cl-text-tertiary",
  clearTrigger: "p-2 rounded-full hover:bg-cl-bg-hover dark:hover:bg-cl-bg-elevated text-cl-text-tertiary hover:text-cl-text-secondary dark:hover:text-cl-text-secondary transition-colors shrink-0",
  label: "block text-sm font-medium text-cl-text dark:text-cl-text-secondary mb-1.5",
  message: "text-sm text-cl-error mt-1.5 text-cl-success",
  description: "text-xs text-cl-text-tertiary dark:text-cl-text-tertiary mb-1.5",
  content: "bg-white dark:bg-cl-bg-elevated border border-cl-border dark:border-cl-border rounded-cl-lg shadow-xl p-2 sm:p-4",
  header: "flex items-center justify-between mb-4",
  row: "flex items-center gap-1",
  navButton: "p-1.5 rounded-cl-md hover:bg-cl-bg-hover dark:hover:bg-cl-bg-elevated transition-colors text-cl-text-secondary dark:text-cl-text-tertiary hover:text-cl-text dark:hover:text-white",
  listRow: "flex gap-8",
  list: "",
  listHeader: "grid grid-cols-7 mb-2",
  weekday: "text-xs font-semibold text-cl-text-tertiary dark:text-cl-text-tertiary text-center py-2 uppercase tracking-wide",
  item: "relative w-10 h-10 flex items-center justify-center text-sm font-medium rounded-full cursor-pointer transition-all text-cl-text dark:text-cl-text hover:bg-cl-bg-hover dark:hover:bg-cl-bg-elevated focus:outline-none focus:ring-2 focus:ring-cl-accent focus:ring-offset-1 dark:focus:ring-offset-cl-bg",
  weekNumber: "text-xs text-cl-text-tertiary dark:text-cl-text-tertiary flex items-center justify-center",
  presetGroup: "flex flex-wrap gap-2 pb-4 mb-4 border-b border-cl-border dark:border-cl-border",
  presetTrigger: "px-3 py-1.5 text-xs font-semibold rounded-full bg-cl-bg-hover dark:bg-cl-bg-elevated text-cl-text dark:text-cl-text-secondary hover:bg-cl-bg-hover dark:hover:bg-cl-text/10 transition-all",
  footer: "flex justify-center pt-4 mt-4 border-t border-cl-border dark:border-cl-border",
  todayTrigger: "flex items-center gap-2 px-4 py-2 text-sm font-semibold text-cl-accent dark:text-cl-accent hover:bg-cl-accent/15 dark:hover:bg-cl-accent/20 rounded-cl-md transition-all",
  markerIndicator: "w-1 h-1 rounded-full bg-cl-accent absolute bottom-1 left-1/2 -translate-x-1/2",
  markerTooltip: "absolute z-50 px-3 py-2 text-xs bg-cl-bg dark:bg-cl-bg-elevated text-white rounded-cl-md shadow-lg max-w-[200px]",
  monthSelect: "flex items-center gap-1 px-2 py-1.5 text-sm font-semibold bg-transparent border-none cursor-pointer text-cl-text dark:text-cl-text hover:bg-cl-bg-hover dark:hover:bg-cl-bg-elevated rounded-cl-md transition-colors",
  yearSelect: "flex items-center gap-1 px-2 py-1.5 text-sm font-semibold bg-transparent border-none cursor-pointer text-cl-text dark:text-cl-text hover:bg-cl-bg-hover dark:hover:bg-cl-bg-elevated rounded-cl-md transition-colors",
  subContent: "absolute z-[60] mt-1 max-h-60 overflow-auto rounded-cl-md bg-white dark:bg-cl-bg-elevated shadow-lg border border-cl-border dark:border-cl-border py-1 min-w-[120px] sm:min-w-[140px]",
  subItem: "flex items-center justify-between w-full px-3 py-2 text-sm text-left text-cl-text dark:text-cl-text hover:bg-cl-bg-hover dark:hover:bg-cl-bg-elevated cursor-pointer",
};

export const UNSTYLED_DATEPICKER_CLASSES: Required<DatePickerClasses> =
  structuralOnly(DEFAULT_DATEPICKER_CLASSES);
