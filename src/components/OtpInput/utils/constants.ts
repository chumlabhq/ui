import type { OtpInputClasses } from "./types";
import { structuralOnly } from "../../../utils/classLayers";

export const DEFAULT_OTPINPUT_CLASSES: Required<OtpInputClasses> = {
  root: "",
  control: "flex items-center gap-2",
  group: "flex items-center gap-2",
  input:
    "w-10 h-10 sm:w-12 sm:h-12 text-center text-lg font-semibold border-2 rounded-cl-lg transition-all focus:outline-none bg-white dark:bg-cl-bg-elevated border-cl-border-input dark:border-cl-border text-cl-text dark:text-cl-text focus-visible:border-cl-border-input-focus dark:focus-visible:border-cl-border-input-focus focus-visible:ring-2 focus-visible:ring-cl-accent/20 dark:focus-visible:ring-cl-accent/20 disabled:opacity-50 disabled:cursor-not-allowed",
  inputFocused: "",
  label:
    "block text-sm font-medium mb-2 text-cl-text dark:text-cl-text-secondary",
  message: "text-xs mt-2 text-cl-error text-sm text-cl-success",
  separator: "text-lg select-none text-cl-text-secondary dark:text-cl-text-secondary",
  description: "text-xs mb-2 text-cl-text-tertiary dark:text-cl-text-tertiary",
};

/** Pre-built styling for OtpInput — pass as the `classes` prop for a ready-made look. */
export const PRESET_OTPINPUT_CLASSES: Required<OtpInputClasses> = {
  root: "",
  control: "flex items-center gap-2",
  group: "flex items-center gap-2",
  input: "w-10 h-10 sm:w-12 sm:h-12 text-center text-lg font-semibold border-2 border-cl-border-input dark:border-cl-border rounded-cl-md bg-white dark:bg-cl-bg-elevated text-cl-text dark:text-cl-text transition-colors focus:outline-none focus-visible:border-cl-border-input-focus dark:focus-visible:border-cl-border-input-focus focus-visible:ring-2 focus-visible:ring-cl-accent/20 dark:focus-visible:ring-cl-accent/20 disabled:opacity-50 disabled:cursor-not-allowed",
  inputFocused: "",
  label: "block text-sm font-medium text-cl-text dark:text-cl-text-secondary mb-2",
  message: "text-sm text-cl-error mt-2 text-cl-success",
  separator: "text-cl-text-tertiary dark:text-cl-text-tertiary text-lg select-none",
  description: "text-xs text-cl-text-tertiary dark:text-cl-text-tertiary mb-2",
};

export const UNSTYLED_OTPINPUT_CLASSES: Required<OtpInputClasses> =
  structuralOnly(DEFAULT_OTPINPUT_CLASSES);
