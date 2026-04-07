import type { RadioButtonSize, RadioButtonClasses, RadioGroupClasses } from "./types";

export const SIZE_MAP: Record<Exclude<RadioButtonSize, number>, number> = {
  xs: 14,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 28,
};

export const ICON_SIZE_MAP: Record<Exclude<RadioButtonSize, number>, number> = {
  xs: 6,
  sm: 8,
  md: 10,
  lg: 12,
  xl: 14,
};

export const DEFAULT_RADIO_CLASSES: Required<RadioButtonClasses> = {
  root: "flex items-start gap-2 cursor-pointer",
  label: "text-sm font-medium text-gray-700 dark:text-gray-200",
  description: "text-xs text-gray-500 dark:text-gray-400",
  radio: "shrink-0 flex items-center justify-center rounded-full border-2 border-gray-300 dark:border-gray-600 transition-colors",
  checked: "border-blue-600 bg-blue-600",
  unchecked: "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800",
  icon: "",
  error: "text-xs text-red-500 mt-1",
  success: "text-xs text-emerald-600 mt-1",
};

export const UNSTYLED_RADIO_CLASSES: Required<RadioButtonClasses> = {
  root: "",
  label: "",
  description: "",
  radio: "",
  checked: "",
  unchecked: "",
  icon: "",
  error: "",
  success: "",
};

export const DEFAULT_RADIO_GROUP_CLASSES: Required<RadioGroupClasses> = {
  root: "",
  label: "text-sm font-medium mb-2 block",
  description: "text-xs text-gray-500 mb-3",
  error: "text-xs text-red-500 mt-2",
  success: "text-xs text-emerald-600 mt-2",
};

export const UNSTYLED_RADIO_GROUP_CLASSES: Required<RadioGroupClasses> = {
  root: "",
  label: "",
  description: "",
  error: "",
  success: "",
};
