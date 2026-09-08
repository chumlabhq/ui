import type { CheckboxSize, CheckboxShape, CheckboxClasses } from "./types.js";
import { structuralOnly } from "../../../utils/classLayers.js";

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
  root: "data-[loading]:opacity-50 data-[loading]:pointer-events-none data-[disabled]:opacity-50",
  labelGroup: "flex flex-col",
  label: "text-sm font-medium text-cl-text",
  description: "text-xs text-cl-text-tertiary",
  // The checked and indeterminate fills ride on `data-state`, which is the
  // replacement ADR 002 specified when `checked`/`unchecked`/`indeterminate`
  // stopped being `classes` keys. They were deleted in 6dd1925 and the
  // replacement was never applied, so a checked box painted nothing for six
  // days: transparent background, white tick, no accent anywhere.
  //
  // `bg-cl-bg-input` is the resting fill — white in light, a 4% wash in dark —
  // which is the single token that does what `bg-white dark:bg-cl-bg-elevated`
  // used to, without a seventh `dark:` variant.
  control:
    "inline-flex items-center justify-center border-2 transition-colors cursor-pointer bg-cl-bg-input border-cl-border-input data-[state=checked]:bg-cl-accent data-[state=checked]:border-cl-border-input-focus data-[state=checked]:text-cl-on-accent data-[state=indeterminate]:bg-cl-accent data-[state=indeterminate]:border-cl-border-input-focus data-[state=indeterminate]:text-cl-on-accent data-[error]:border-cl-error has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-cl-accent has-[:focus-visible]:ring-offset-cl-bg",
  itemIndicator: "",
  message: "text-sm data-[invalid]:text-cl-error data-[valid]:text-cl-success",
};

export const UNSTYLED_CHECKBOX_CLASSES: Required<CheckboxClasses> =
  structuralOnly(DEFAULT_CHECKBOX_CLASSES);
