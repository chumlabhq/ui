import type { InputClasses } from "./types.js";
import { structuralOnly } from "../../../utils/classLayers.js";

export const DEFAULT_INPUT_CLASSES: Required<InputClasses> = {
  root: "flex flex-col",
  control:
    "px-3.5 py-2.5 rounded-cl-lg border gap-2.5 transition-all duration-150 text-cl-text-chrome border-cl-border bg-cl-bg-input shadow-sm shadow-black/[0.04] dark:shadow-none focus-within:ring-2 focus-within:ring-cl-accent focus-within:border-cl-border-input-focus",
  label:
    "text-[13px] font-medium mb-1.5 block text-cl-text-chrome",
  description: "text-xs mt-1 mb-1.5 text-cl-text-tertiary",
  input:
    "flex-1 min-w-0 w-full bg-transparent outline-none text-sm text-cl-text placeholder:text-cl-text-tertiary",
  prefix: "text-sm select-none text-cl-text-tertiary",
  suffix: "text-sm select-none text-cl-text-tertiary",
  message:
    "text-xs mt-1.5 flex items-center gap-1.5 data-[invalid]:text-cl-error data-[valid]:text-cl-success",
  count:
    "text-[11px] mt-1 text-right tabular-nums text-cl-text-tertiary",
};

export const UNSTYLED_INPUT_CLASSES: Required<InputClasses> =
  structuralOnly(DEFAULT_INPUT_CLASSES);
