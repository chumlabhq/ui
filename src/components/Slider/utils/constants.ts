import type { SliderClasses } from "./types";

export const DEFAULT_SLIDER_CLASSES: Required<SliderClasses> = {
  root: "flex flex-col gap-2",
  label: "text-sm font-medium text-cl-text dark:text-cl-text",
  description: "text-xs text-cl-text-tertiary dark:text-cl-text-tertiary",
  wrapper: "relative select-none touch-none",
  track: "rounded-full bg-cl-bg-hover dark:bg-cl-bg-elevated",
  range: "rounded-full bg-cl-accent dark:bg-cl-accent/30",
  thumb:
    "absolute rounded-full bg-white dark:bg-cl-text shadow-md transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent focus-visible:ring-offset-2 dark:focus-visible:ring-offset-cl-bg hover:shadow-lg cursor-grab",
  thumbActive: "cursor-grabbing shadow-lg ring-2 ring-cl-accent ring-offset-2 dark:ring-offset-cl-bg",
  thumbDisabled: "opacity-50 cursor-not-allowed",
  tooltip:
    "absolute px-2 py-1 text-xs font-medium text-white bg-cl-bg dark:bg-cl-bg-elevated rounded-cl-md shadow-sm whitespace-nowrap pointer-events-none",
  mark: "",
  markDot: "rounded-full bg-white dark:bg-cl-bg-hover border-2 border-cl-border-input dark:border-cl-border",
  markDotActive: "border-cl-border-input-focus dark:border-cl-border-input-focus bg-white dark:bg-cl-bg-hover",
  markLabel: "text-xs text-cl-text-tertiary dark:text-cl-text-tertiary",
  error: "text-sm text-red-500 dark:text-red-400 mt-1",
  success: "text-sm text-green-600 dark:text-green-400 mt-1",
};

export const UNSTYLED_SLIDER_CLASSES: Required<SliderClasses> = {
  root: "",
  label: "",
  description: "",
  wrapper: "",
  track: "",
  range: "",
  thumb: "",
  thumbActive: "",
  thumbDisabled: "",
  tooltip: "",
  mark: "",
  markDot: "",
  markDotActive: "",
  markLabel: "",
  error: "",
  success: "",
};
