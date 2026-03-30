import type { CheckboxSize, CheckboxShape, CheckboxClasses } from "./types";

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

export const DEFAULT_CHECKBOX_CLASSES: Required<CheckboxClasses> = {
  root: "",
  labelContainer: "flex flex-col",
  label: "text-sm font-medium text-gray-700",
  description: "text-xs text-gray-500",
  checkbox: "inline-flex items-center justify-center border-2 transition-colors cursor-pointer focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2",
  checked: "bg-blue-600 border-blue-600 text-white",
  unchecked: "bg-white border-gray-300",
  indeterminate: "bg-blue-600 border-blue-600 text-white",
  icon: "",
  error: "text-sm text-red-500 dark:text-red-400",
  success: "text-sm text-green-600 dark:text-green-400",
};

export const UNSTYLED_CHECKBOX_CLASSES: Required<CheckboxClasses> = {
  root: "",
  labelContainer: "",
  label: "",
  description: "",
  checkbox: "",
  checked: "",
  unchecked: "",
  indeterminate: "",
  icon: "",
  error: "",
  success: "",
};
