import type { ToggleClasses, ToggleSize } from "./types";

export const DEFAULT_TOGGLE_CLASSES: Required<ToggleClasses> = {
  root: "inline-flex items-center justify-center rounded-lg border border-gray-200 bg-transparent transition-colors hover:bg-gray-100 data-[pressed=true]:bg-gray-200 data-[pressed=true]:border-gray-300 disabled:opacity-50 disabled:pointer-events-none",
  content: "inline-flex items-center justify-center gap-2",
  icon: "inline-flex shrink-0",
};

export const UNSTYLED_TOGGLE_CLASSES: Required<ToggleClasses> = {
  root: "",
  content: "",
  icon: "",
};

export const SIZE_MAP: Record<ToggleSize, string> = {
  sm: "h-8 w-8 text-sm",
  md: "h-10 w-10",
  lg: "h-12 w-12 text-lg",
};
