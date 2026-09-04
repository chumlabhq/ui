import type { TextAreaClasses } from "./types";
import { structuralOnly } from "../../../utils/classLayers";

export const DEFAULT_TEXTAREA_CLASSES: Required<TextAreaClasses> = {
  root: "flex flex-col",
  control:
    "px-3.5 py-2.5 rounded-cl-lg border gap-2.5 transition-all duration-150 text-cl-text dark:text-cl-text-secondary border-cl-border dark:border-cl-text/10 bg-white dark:bg-cl-text/4 shadow-sm shadow-black/[0.04] dark:shadow-none focus-within:ring-2 focus-within:ring-cl-accent/15 dark:focus-within:ring-cl-accent/30 focus-within:border-cl-border-input-focus dark:focus-within:border-cl-border-input-focus/50",
  label:
    "text-[13px] font-medium mb-1.5 block text-cl-text dark:text-cl-text-secondary",
  description: "text-xs mt-1 mb-1.5 text-cl-text-tertiary",
  input:
    "flex-1 min-w-0 w-full bg-transparent outline-none text-sm resize-y text-cl-text placeholder:text-cl-text-tertiary",
  message:
    "text-xs mt-1.5 flex items-center gap-1.5 text-cl-error text-cl-success",
  count:
    "text-[11px] mt-1 text-right tabular-nums text-cl-text-tertiary",
};

export const UNSTYLED_TEXTAREA_CLASSES: Required<TextAreaClasses> =
  structuralOnly(DEFAULT_TEXTAREA_CLASSES);
