import type { SliderClasses } from "./types";

export const DEFAULT_SLIDER_CLASSES: Required<SliderClasses> = {
  root: "flex flex-col gap-2",
  label: "text-sm font-medium text-gray-700 dark:text-gray-200",
  description: "text-xs text-gray-500 dark:text-gray-400",
  wrapper: "relative select-none touch-none",
  track: "rounded-full bg-gray-200 dark:bg-gray-700",
  range: "rounded-full bg-indigo-500 dark:bg-indigo-400",
  thumb:
    "absolute rounded-full bg-white dark:bg-gray-200 border-2 border-indigo-500 dark:border-indigo-400 shadow-md transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800 hover:shadow-lg cursor-grab",
  thumbActive: "cursor-grabbing shadow-lg ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-gray-800",
  thumbDisabled: "opacity-50 cursor-not-allowed",
  tooltip:
    "absolute px-2 py-1 text-xs font-medium text-white bg-gray-900 dark:bg-gray-700 rounded-md shadow-sm whitespace-nowrap pointer-events-none",
  mark: "",
  markDot: "rounded-full bg-white dark:bg-gray-200 border-2 border-gray-300 dark:border-gray-600",
  markDotActive: "border-indigo-500 dark:border-indigo-400 bg-white dark:bg-gray-200",
  markLabel: "text-xs text-gray-500 dark:text-gray-400",
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
