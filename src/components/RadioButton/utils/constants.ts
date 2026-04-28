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
  label: "text-sm font-medium text-cl-text dark:text-cl-text",
  description: "text-xs text-cl-text-tertiary dark:text-cl-text-tertiary",
  radio: "shrink-0 flex items-center justify-center rounded-full border-2 border-cl-border-input dark:border-cl-border transition-colors",
  checked: "border-cl-border-input-focus bg-cl-accent",
  unchecked: "border-cl-border-input dark:border-cl-border bg-white dark:bg-cl-bg-elevated",
  icon: "",
  error: "text-xs text-red-500 dark:text-red-400 mt-1",
  success: "text-xs text-emerald-600 dark:text-emerald-400 mt-1",
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
  label: "text-sm font-medium mb-2 block text-cl-text dark:text-white",
  description: "text-xs text-cl-text-tertiary dark:text-cl-text-tertiary mb-3",
  error: "text-xs text-red-500 dark:text-red-400 mt-2",
  success: "text-xs text-emerald-600 dark:text-emerald-400 mt-2",
};

export const UNSTYLED_RADIO_GROUP_CLASSES: Required<RadioGroupClasses> = {
  root: "",
  label: "",
  description: "",
  error: "",
  success: "",
};
