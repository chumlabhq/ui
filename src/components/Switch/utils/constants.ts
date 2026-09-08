import type { SwitchClasses } from "./types.js";
import { structuralOnly } from "../../../utils/classLayers.js";

export const CSS_VARS = {
  trackerChecked: "--switch-tracker-checked-bg",
  trackerUnchecked: "--switch-tracker-unchecked-bg",
  thumbBg: "--switch-thumb-bg",
  focusRing: "--switch-focus-ring",
  thumbSize: "--switch-thumb-size",
  trackerWidth: "--switch-tracker-width",
  trackerHeight: "--switch-tracker-height",
} as const;

export { CSS_VARS as SWITCH_CSS_VARS };

export const DEFAULT_SWITCH_CLASSES: Required<SwitchClasses> = {
  root: "flex flex-col",
  row: "flex items-center gap-3",
  labelGroup: "flex flex-col",
  label: "text-sm font-medium text-cl-text cursor-pointer",
  description: "text-xs text-cl-text-tertiary",
  // The track's colours and the thumb's travel, on `data-state` — the
  // replacement ADR 002 specified for `checkedTracker`, `uncheckedTracker` and
  // `checkedThumb`. All three were deleted in 6dd1925 and never re-applied, so
  // the track had no background at all and the thumb never moved: a checked
  // switch was pixel-identical to an unchecked one. `CSS_VARS` above named the
  // track colours the whole time and nothing read them.
  //
  // The off-track greys stay literal, and stay the library's one `dark:` pair
  // outside the declared six. The reason has not changed since it was first
  // written: an off-track needs a solid mid-grey and every neutral in the
  // palette is a surface or a low-alpha overlay, so there is nothing to point
  // at. `dark-variants.contract` carries it as a declared exception.
  control:
    "relative inline-flex items-center h-[var(--switch-tracker-height,1.25rem)] w-[var(--switch-tracker-width,2.25rem)] rounded-full transition-colors duration-200 motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--switch-focus-ring,var(--cl-accent))] cursor-pointer data-[state=checked]:bg-[var(--switch-tracker-checked-bg,var(--cl-accent))] data-[state=unchecked]:bg-[var(--switch-tracker-unchecked-bg,#d1d5db)] dark:data-[state=unchecked]:bg-[var(--switch-tracker-unchecked-bg,#4b5563)] data-[disabled]:opacity-50 data-[loading]:opacity-50 data-[loading]:pointer-events-none",
  thumb:
    "inline-flex items-center justify-center transform h-[var(--switch-thumb-size,1rem)] w-[var(--switch-thumb-size,1rem)] rounded-full bg-[var(--switch-thumb-bg,white)] shadow-md transition-transform duration-200 motion-reduce:transition-none data-[state=checked]:translate-x-[1.125rem]",
  message: "text-sm data-[invalid]:text-cl-error mt-2 data-[valid]:text-cl-success",
  loading: "animate-spin",
};

export const UNSTYLED_SWITCH_CLASSES: Required<SwitchClasses> =
  structuralOnly(DEFAULT_SWITCH_CLASSES);
