import type { RadioButtonSize, RadioButtonClasses, RadioGroupClasses } from "./types";
import { structuralOnly } from "../../../utils/classLayers";

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
  root: "flex items-start gap-2 cursor-pointer data-[disabled]:opacity-50 data-[loading]:opacity-50 data-[loading]:pointer-events-none",
  label: "text-sm font-medium text-cl-text",
  description: "text-xs text-cl-text-tertiary",
  control: "shrink-0 flex items-center justify-center rounded-full border-2 border-cl-border-input transition-colors data-[error]:border-cl-error has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-cl-accent has-[:focus-visible]:ring-offset-cl-bg",
  itemIndicator: "",
};

export const UNSTYLED_RADIO_CLASSES: Required<RadioButtonClasses> =
  structuralOnly(DEFAULT_RADIO_CLASSES);

export const DEFAULT_RADIO_GROUP_CLASSES: Required<RadioGroupClasses> = {
  root: "",
  label: "text-sm font-medium mb-2 block text-cl-text dark:text-white",
  description: "text-xs text-cl-text-tertiary mb-3",
  message: "text-xs text-cl-error mt-2 text-cl-success",
};

export const UNSTYLED_RADIO_GROUP_CLASSES: Required<RadioGroupClasses> =
  structuralOnly(DEFAULT_RADIO_GROUP_CLASSES);
