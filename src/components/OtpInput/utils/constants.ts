import type { OtpInputClasses } from "./types.js";
import { structuralOnly } from "../../../utils/classLayers.js";

export const DEFAULT_OTPINPUT_CLASSES: Required<OtpInputClasses> = {
  root: "",
  control: "flex w-fit items-center gap-2 data-[loading]:opacity-50 data-[loading]:pointer-events-none",
  group: "flex items-center gap-2",
  input:
    "w-10 h-10 sm:w-12 sm:h-12 text-center text-lg font-semibold border-2 rounded-cl-lg transition-all focus:outline-none bg-cl-bg-panel border-cl-border-input data-[error]:border-cl-error text-cl-text focus-visible:border-cl-border-input-focus data-[error]:focus-visible:border-cl-border-input-focus data-[valid]:border-cl-success data-[valid]:focus-visible:border-cl-border-input-focus focus-visible:ring-2 focus-visible:ring-cl-accent/20 disabled:opacity-50 disabled:cursor-not-allowed",
  label:
    "block text-sm font-medium mb-2 text-cl-text-chrome",
  message: "mt-2 data-[invalid]:text-cl-error text-sm data-[valid]:text-cl-success",
  separator: "text-lg select-none text-cl-text-secondary",
  description: "text-xs mb-2 text-cl-text-tertiary",
};

/** Pre-built styling for OtpInput — pass as the `classes` prop for a ready-made look. */
export const PRESET_OTPINPUT_CLASSES: Required<OtpInputClasses> = {
  root: "",
  control: "flex w-fit items-center gap-2",
  group: "flex items-center gap-2",
  input: "w-10 h-10 sm:w-12 sm:h-12 text-center text-lg font-semibold border-2 border-cl-border-input rounded-cl-md bg-cl-bg-panel text-cl-text transition-colors focus:outline-none focus-visible:border-cl-border-input-focus focus-visible:ring-2 focus-visible:ring-cl-accent/20 disabled:opacity-50 disabled:cursor-not-allowed",
  label: "block text-sm font-medium text-cl-text-chrome mb-2",
  message: "text-sm data-[invalid]:text-cl-error mt-2 data-[valid]:text-cl-success",
  separator: "text-cl-text-tertiary text-lg select-none",
  description: "text-xs text-cl-text-tertiary mb-2",
};

export const UNSTYLED_OTPINPUT_CLASSES: Required<OtpInputClasses> =
  structuralOnly(DEFAULT_OTPINPUT_CLASSES);
