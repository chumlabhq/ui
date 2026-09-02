import type { CheckboxSize, CheckboxShape, CheckboxClasses } from "./types";
import { structuralOnly } from "../../../utils/classLayers";

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
  labelGroup: "flex flex-col",
  label: "text-sm font-medium text-cl-text dark:text-cl-text",
  description: "text-xs text-cl-text-tertiary dark:text-cl-text-tertiary",
  control: "inline-flex items-center justify-center border-2 transition-colors cursor-pointer",
  itemIndicator: "",
  message: "text-sm text-cl-error text-cl-success",
};

export const UNSTYLED_CHECKBOX_CLASSES: Required<CheckboxClasses> =
  structuralOnly(DEFAULT_CHECKBOX_CLASSES);
