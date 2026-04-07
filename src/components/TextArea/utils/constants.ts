import type { TextAreaClasses } from "./types";

export const DEFAULT_TEXTAREA_CLASSES: Required<TextAreaClasses> = {
  root: "flex flex-col",
  wrapper:
    "px-3.5 py-2.5 rounded-xl border gap-2.5 transition-all duration-150 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-white/10 bg-white dark:bg-white/4 shadow-sm shadow-gray-900/[0.04] dark:shadow-none focus-within:ring-2 focus-within:ring-indigo-500/15 dark:focus-within:ring-indigo-500/30 focus-within:border-indigo-400 dark:focus-within:border-indigo-400/50",
  label:
    "text-[13px] font-medium mb-1.5 block text-gray-700 dark:text-gray-300",
  description: "text-xs mt-1 mb-1.5 text-gray-400 dark:text-gray-500",
  textarea:
    "w-full bg-transparent outline-none text-sm resize-y text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500",
  error:
    "text-xs mt-1.5 flex items-center gap-1.5 text-red-500 dark:text-red-400",
  success:
    "text-xs mt-1.5 flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400",
  count:
    "text-[11px] mt-1 text-right tabular-nums text-gray-400 dark:text-gray-500",
};

export const UNSTYLED_TEXTAREA_CLASSES: Required<TextAreaClasses> = {
  root: "",
  wrapper: "",
  label: "",
  description: "",
  textarea: "",
  error: "",
  success: "",
  count: "",
};
