import type { SwitchClasses } from "./types";

export const CSS_VARS = {
  trackerChecked: "--switch-tracker-checked-bg",
  trackerUnchecked: "--switch-tracker-unchecked-bg",
  thumbBg: "--switch-thumb-bg",
  focusRing: "--switch-focus-ring",
  thumbSize: "--switch-thumb-size",
  trackerWidth: "--switch-tracker-width",
  trackerHeight: "--switch-tracker-height",
} as const;

export { CSS_VARS as SWITCH_CSS_VARS };

export const DEFAULT_SWITCH_CLASSES: Required<SwitchClasses> = {
  root: "flex flex-col",
  innerRow: "flex items-center gap-3",
  labelContainer: "flex flex-col",
  label: "text-sm font-medium text-cl-text dark:text-cl-text cursor-pointer",
  disabledLabel: "text-cl-text-tertiary dark:text-cl-text-tertiary cursor-not-allowed",
  description: "text-xs text-cl-text-tertiary dark:text-cl-text-tertiary",
  tracker:
    "relative inline-flex items-center h-[var(--switch-tracker-height,1.25rem)] w-[var(--switch-tracker-width,2.25rem)] rounded-full transition-colors duration-200 motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--switch-focus-ring,#3b82f6)] cursor-pointer",
  disabledTracker: "opacity-50 cursor-not-allowed",
  thumb:
    "inline-flex items-center justify-center transform h-[var(--switch-thumb-size,1rem)] w-[var(--switch-thumb-size,1rem)] rounded-full bg-[var(--switch-thumb-bg,white)] shadow-md transition-transform duration-200 motion-reduce:transition-none",
  checkedTracker: "bg-[var(--switch-tracker-checked-bg,#2563eb)]",
  uncheckedTracker: "bg-[var(--switch-tracker-unchecked-bg,#d1d5db)] dark:bg-[var(--switch-tracker-unchecked-bg,#4b5563)]",
  checkedThumb: "translate-x-4.5",
  uncheckedThumb: "translate-x-0.5",
  error: "text-sm text-red-500 dark:text-red-400 mt-2",
  success: "text-sm text-green-600 dark:text-green-400 mt-2",
  loading: "",
};

export const UNSTYLED_SWITCH_CLASSES: Required<SwitchClasses> = {
  root: "",
  innerRow: "",
  labelContainer: "",
  label: "",
  disabledLabel: "",
  description: "",
  tracker: "",
  disabledTracker: "",
  thumb: "",
  checkedTracker: "",
  uncheckedTracker: "",
  checkedThumb: "",
  uncheckedThumb: "",
  error: "",
  success: "",
  loading: "",
};
