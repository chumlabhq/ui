import type { CheckboxSize, CheckboxShape } from "./types";

export const SIZE_MAP: Record<Exclude<CheckboxSize, number>, number> = {
  xs: 14,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
};

export const ICON_SIZE_MAP: Record<Exclude<CheckboxSize, number>, number> = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 18,
  xl: 24,
};

export const SHAPE_CLASS_MAP: Record<CheckboxShape, string> = {
  square: "rounded-none",
  rounded: "rounded",
  circle: "rounded-full",
};

export const defaultCheckboxStyles = {
  base: "inline-flex items-center justify-center border transition-colors focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2",
  checked: "bg-blue-600 border-blue-600 text-white",
  unchecked: "bg-white border-gray-300 dark:bg-gray-800 dark:border-gray-600",
  indeterminate: "bg-blue-600 border-blue-600 text-white",
};
