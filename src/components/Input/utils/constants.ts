import type { InputClasses } from "./types";

export const DEFAULT_INPUT_CLASSES: Required<InputClasses> = {
  root: "flex flex-col",
  wrapper:
    "px-3.5 py-2.5 rounded-cl-lg border gap-2.5 transition-all duration-150 text-cl-text dark:text-cl-text-secondary border-cl-border dark:border-cl-text/10 bg-white dark:bg-cl-text/4 shadow-sm shadow-black/[0.04] dark:shadow-none focus-within:ring-2 focus-within:ring-cl-accent/15 dark:focus-within:ring-cl-accent/30 focus-within:border-cl-border-input-focus dark:focus-within:border-cl-border-input-focus/50",
  label:
    "text-[13px] font-medium mb-1.5 block text-cl-text dark:text-cl-text-secondary",
  description: "text-xs mt-1 mb-1.5 text-cl-text-tertiary dark:text-cl-text-tertiary",
  input:
    "w-full bg-transparent outline-none text-sm text-cl-text dark:text-white placeholder:text-cl-text-tertiary dark:placeholder:text-cl-text-tertiary",
  prefix: "text-sm select-none text-cl-text-tertiary dark:text-cl-text-tertiary",
  suffix: "text-sm select-none text-cl-text-tertiary dark:text-cl-text-tertiary",
  error:
    "text-xs mt-1.5 flex items-center gap-1.5 text-red-500 dark:text-red-400",
  success:
    "text-xs mt-1.5 flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400",
  count:
    "text-[11px] mt-1 text-right tabular-nums text-cl-text-tertiary dark:text-cl-text-tertiary",
};

export const UNSTYLED_INPUT_CLASSES: Required<InputClasses> = {
  root: "",
  wrapper: "",
  label: "",
  description: "",
  input: "",
  prefix: "",
  suffix: "",
  error: "",
  success: "",
  count: "",
};
