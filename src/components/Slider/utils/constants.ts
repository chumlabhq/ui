import type { SliderClasses } from "./types";

export const DEFAULT_SLIDER_CLASSES: Required<SliderClasses> = {
  root: "flex flex-col gap-2",
  label: "text-sm font-medium",
  description: "text-xs text-gray-500",
  wrapper: "relative select-none touch-none",
  track: "rounded-full bg-gray-200",
  range: "rounded-full bg-indigo-500",
  thumb:
    "absolute rounded-full bg-white border-2 border-indigo-500 shadow-md transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 hover:shadow-lg cursor-grab",
  thumbActive: "cursor-grabbing shadow-lg ring-2 ring-indigo-500 ring-offset-2",
  thumbDisabled: "opacity-50 cursor-not-allowed",
  tooltip:
    "absolute px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded-md shadow-sm whitespace-nowrap pointer-events-none",
  mark: "",
  markDot: "rounded-full bg-white border-2 border-gray-300",
  markDotActive: "border-indigo-500 bg-white",
  markLabel: "text-xs text-gray-500",
  error: "text-sm text-red-500 mt-1",
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
};
