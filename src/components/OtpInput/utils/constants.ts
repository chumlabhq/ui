import type { OtpInputClasses } from "./types";

export const DEFAULT_OTPINPUT_CLASSES: Required<OtpInputClasses> = {
  root: "",
  wrapper: "",
  group: "",
  input: "",
  inputFocused: "",
  label: "",
  error: "",
  separator: "",
  description: "",
  success: "",
};

/** Pre-built styling for OtpInput — pass as the `classes` prop for a ready-made look. */
export const PRESET_OTPINPUT_CLASSES: Required<OtpInputClasses> = {
  root: "",
  wrapper: "flex items-center gap-2",
  group: "flex items-center gap-2",
  input: "w-12 h-12 text-center text-lg font-semibold border-2 border-gray-300 rounded-lg bg-white transition-colors focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed",
  inputFocused: "",
  label: "block text-sm font-medium text-gray-700 mb-2",
  error: "text-sm text-red-500 dark:text-red-400 mt-2",
  separator: "text-gray-400 text-lg select-none",
  description: "text-xs text-gray-500 mb-2",
  success: "text-sm text-green-600 dark:text-green-400 mt-2",
};

export const UNSTYLED_OTPINPUT_CLASSES: Required<OtpInputClasses> = {
  root: "",
  wrapper: "",
  group: "",
  input: "",
  inputFocused: "",
  label: "",
  error: "",
  separator: "",
  description: "",
  success: "",
};
