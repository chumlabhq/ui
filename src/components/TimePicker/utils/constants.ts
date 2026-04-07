import type { TimePickerClasses } from "./types";

export const DEFAULT_TIMEPICKER_CLASSES: Required<TimePickerClasses> = {
  root: "inline-flex flex-col gap-1 text-gray-900 dark:text-gray-200",
  label:
    "block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300",
  wrapper: "relative",
  trigger:
    "flex items-center gap-2 w-56 px-3 py-2 border rounded-lg transition-colors cursor-text border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent",
  input:
    "flex-1 min-w-0 bg-transparent outline-none text-sm placeholder:text-gray-400 text-gray-900 dark:text-gray-100",
  endIcon:
    "w-4 h-4 shrink-0 transition-transform duration-200 text-gray-400",
  clearIcon:
    "shrink-0 cursor-pointer text-gray-400 hover:text-gray-600 dark:hover:text-gray-200",
  dropdown:
    "border rounded-lg shadow-lg overflow-hidden bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700",
  optionList: "max-h-60 overflow-y-auto",
  option:
    "flex items-center justify-between px-3 py-2 cursor-pointer text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700",
  optionSelected: "bg-blue-50 dark:bg-blue-900/40 font-medium",
  optionFocused: "bg-gray-100 dark:bg-gray-700",
  selectedIcon: "w-4 h-4 shrink-0 text-blue-600 dark:text-blue-400",
  noResults:
    "px-3 py-4 text-sm text-center text-gray-400 dark:text-gray-500",
  error: "text-sm mt-1 text-red-500 dark:text-red-400",
  description: "text-xs mb-1 text-gray-500 dark:text-gray-400",
  success: "text-sm mt-1 text-green-600 dark:text-green-400",
  clockContainer:
    "p-4 border rounded-xl shadow-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700",
  clockDisplay: "flex items-center justify-center gap-1 mb-4",
  clockDisplayHours:
    "px-3 py-2 text-2xl font-semibold rounded-lg cursor-pointer transition-colors text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700",
  clockDisplayMinutes:
    "px-3 py-2 text-2xl font-semibold rounded-lg cursor-pointer transition-colors text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700",
  clockDisplayActive:
    "bg-indigo-500 dark:bg-indigo-600 text-white hover:bg-indigo-500 dark:hover:bg-indigo-600",
  clockDisplaySeparator:
    "text-2xl font-semibold text-gray-400 dark:text-gray-500",
  clockFace:
    "relative w-52 h-52 mx-auto rounded-full bg-gray-100 dark:bg-gray-700",
  clockHand: "absolute inset-0",
  clockHandLine: "stroke-indigo-500 dark:stroke-indigo-400",
  clockHandDot:
    "w-3 h-3 rounded-full bg-indigo-500 dark:bg-indigo-400",
  clockNumber:
    "absolute text-sm font-medium cursor-pointer select-none transition-colors text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white",
  clockNumberSelected:
    "text-white font-bold bg-indigo-500 rounded-full w-8 h-8 flex items-center justify-center",
  clockNumberInner: "text-xs text-gray-400 dark:text-gray-500",
  clockNumberDisabled:
    "opacity-30 cursor-not-allowed text-gray-300 dark:text-gray-600",
  clockCenter: "fill-indigo-500 dark:fill-indigo-400",
  clockActions: "flex items-center justify-end gap-2 mt-4",
  clockCancelButton:
    "px-3 py-1.5 text-xs font-medium rounded-lg transition-colors text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700",
  clockOkButton:
    "px-3 py-1.5 text-xs font-medium rounded-lg transition-colors bg-indigo-500 text-white hover:bg-indigo-600",
  clockPeriodToggle: "flex flex-col gap-1 ml-3",
  clockPeriodButton:
    "px-2 py-1 text-xs font-medium rounded-md cursor-pointer transition-colors text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700",
  clockPeriodActive:
    "bg-indigo-500 dark:bg-indigo-600 text-white",
};

export const UNSTYLED_TIMEPICKER_CLASSES: Required<TimePickerClasses> = {
  root: "",
  label: "",
  wrapper: "",
  trigger: "",
  input: "",
  endIcon: "",
  clearIcon: "",
  dropdown: "",
  optionList: "",
  option: "",
  optionSelected: "",
  optionFocused: "",
  selectedIcon: "",
  noResults: "",
  error: "",
  description: "",
  success: "",
  clockContainer: "",
  clockDisplay: "",
  clockDisplayHours: "",
  clockDisplayMinutes: "",
  clockDisplayActive: "",
  clockDisplaySeparator: "",
  clockFace: "",
  clockHand: "",
  clockHandLine: "",
  clockHandDot: "",
  clockNumber: "",
  clockNumberSelected: "",
  clockNumberInner: "",
  clockNumberDisabled: "",
  clockCenter: "",
  clockActions: "",
  clockCancelButton: "",
  clockOkButton: "",
  clockPeriodToggle: "",
  clockPeriodButton: "",
  clockPeriodActive: "",
};
