import type { DatePickerClasses } from "./utils/types.js";
import { structuralOnly } from "../../utils/classLayers.js";

export const DEFAULT_DATEPICKER_CLASSES: Required<DatePickerClasses> = {
  root: "",
  trigger: "flex items-center gap-2 w-full px-3 py-2.5 border border-cl-border-input rounded-cl-md bg-cl-bg-panel hover:border-cl-border-input-hover focus:ring-2 focus:ring-cl-accent focus:border-transparent cursor-pointer transition-all text-sm text-cl-text data-[loading]:opacity-50 data-[loading]:pointer-events-none data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed data-[error]:border-cl-error has-[[data-error]]:border-cl-error data-[valid]:border-cl-success has-[[data-valid]]:border-cl-success",
  input: "flex-1 text-left truncate",
  triggerActions: "flex items-center gap-1",
  icon: "w-5 h-5 shrink-0 text-cl-text-tertiary",
  clearTrigger: "p-2 rounded-full hover:bg-cl-bg-hover text-cl-text-tertiary hover:text-cl-text-secondary transition-colors shrink-0 cursor-pointer",
  label: "block text-sm font-medium text-cl-text-chrome mb-1.5",
  message: "text-sm data-[invalid]:text-cl-error mt-1.5 data-[valid]:text-cl-success",
  description: "text-xs text-cl-text-tertiary mb-1.5",
  content: "bg-cl-bg-panel border border-cl-border rounded-cl-lg shadow-xl p-2 sm:p-4",
  header: "flex items-center justify-between mb-4",
  row: "flex items-center gap-1",
  navTrigger: "p-1.5 rounded-cl-md hover:bg-cl-bg-hover transition-colors text-cl-text-chrome-quiet hover:text-cl-text cursor-pointer",
  listRow: "flex gap-8",
  list: "",
  listHeader: "grid grid-cols-7 mb-2",
  weekday: "text-xs font-semibold text-cl-text-tertiary text-center py-2 uppercase tracking-wide",
  item: "relative w-10 h-10 flex items-center justify-center text-sm font-medium rounded-full cursor-pointer transition-all data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed text-cl-text hover:bg-cl-bg-hover focus:outline-none focus:ring-2 focus:ring-cl-accent focus:ring-offset-1 focus:ring-offset-cl-bg",
  weekNumber: "text-xs text-cl-text-tertiary flex items-center justify-center",
  presetGroup: "flex flex-wrap gap-2 pb-4 mb-4 border-b border-cl-border",
  presetTrigger: "px-3 py-1.5 text-xs font-semibold rounded-full bg-cl-bg-hover text-cl-text-chrome hover:bg-cl-bg-item-hover transition-all cursor-pointer",
  footer: "flex justify-center pt-4 mt-4 border-t border-cl-border",
  todayTrigger: "flex items-center gap-2 px-4 py-2 text-sm font-semibold text-cl-accent hover:bg-cl-accent-bg-hover hover:text-cl-accent-hover rounded-cl-md transition-all cursor-pointer",
  markerIndicator: "w-1 h-1 rounded-full bg-cl-accent absolute bottom-1 left-1/2 -translate-x-1/2",
  // Same defect as Slider's value tooltip: white text on the panel token, which
  // is white in the light theme.
  monthSelect: "flex items-center gap-1 px-2 py-1.5 text-sm font-semibold bg-transparent border-0 cursor-pointer text-cl-text hover:bg-cl-bg-hover rounded-cl-md transition-colors",
  yearSelect: "flex items-center gap-1 px-2 py-1.5 text-sm font-semibold bg-transparent border-0 cursor-pointer text-cl-text hover:bg-cl-bg-hover rounded-cl-md transition-colors",
  subContent: "absolute z-[60] mt-1 max-h-60 overflow-auto rounded-cl-md bg-cl-bg-panel shadow-lg border border-cl-border py-1 min-w-[120px] sm:min-w-[140px]",
  subItem: "flex items-center justify-between w-full px-3 py-2 text-sm text-left text-cl-text hover:bg-cl-bg-hover cursor-pointer",
};

export const UNSTYLED_DATEPICKER_CLASSES: Required<DatePickerClasses> =
  structuralOnly(DEFAULT_DATEPICKER_CLASSES);
