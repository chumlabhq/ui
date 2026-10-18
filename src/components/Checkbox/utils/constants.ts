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
  group: "flex flex-col",
  label: "text-sm font-medium text-cl-text",
  description: "text-xs text-cl-text-tertiary",
  // The checked, indeterminate, error and success fills are NOT here. They were
  // — as `data-[state=checked]:bg-cl-accent` and friends — and a consumer's
  // `classes={{ control: "bg-green-500" }}` lost to them: a plain `bg-*` and a
  // variant `bg-*` are different tailwind-merge groups, so both survived the
  // merge and the variant won at paint time. Measured on the checked fixture,
  // the consumer's class present in the DOM and the box still rgb(91,155,255).
  // The demo page's own "Green theme" and "Pink theme" rendered one blue box
  // each, which is how it was found. They are resolved in `CHECKBOX_STATE_CLASSES`
  // and merged ahead of the consumer's classes instead; `data-state` stays on
  // the element, as the hook ADR 002 specified.
  //
  // `bg-cl-bg-input` is the resting fill — white in light, a 4% wash in dark —
  // which is the single token that does what `bg-white dark:bg-cl-bg-elevated`
  // used to, without a seventh `dark:` variant.
  control:
    "shrink-0 inline-flex items-center justify-center border-2 transition-colors cursor-pointer bg-cl-bg-input border-cl-border-input data-[readonly]:border-dashed data-[disabled]:cursor-not-allowed has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-cl-accent has-[:focus-visible]:ring-offset-cl-bg",
  itemIndicator: "",
  message: "text-sm data-[invalid]:text-cl-error data-[valid]:text-cl-success",
};

/**
 * What each state paints, applied as plain utilities so a consumer's own
 * `classes.control` replaces them rather than sitting beside them.
 *
 * `success` is new: the message went green and the box stayed accent, so a
 * validated field disagreed with itself. It is the same shape the error state
 * already had, which coloured the border and nothing else.
 */
export const CHECKBOX_STATE_CLASSES = {
  filled: "bg-cl-accent border-cl-border-input-focus text-cl-on-accent",
  filledSuccess: "bg-cl-success border-cl-success text-cl-on-accent",
  success: "border-cl-success",
  error: "border-cl-error",
} as const;

export const UNSTYLED_CHECKBOX_CLASSES: Required<CheckboxClasses> =
  structuralOnly(DEFAULT_CHECKBOX_CLASSES);
