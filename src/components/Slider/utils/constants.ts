import type { SliderClasses } from "./types";
import { structuralOnly } from "../../../utils/classLayers";

export const DEFAULT_SLIDER_CLASSES: Required<SliderClasses> = {
  root: "flex flex-col gap-2",
  label: "text-sm font-medium text-cl-text",
  description: "text-xs text-cl-text-tertiary",
  control: "relative select-none touch-none",
  track: "rounded-full bg-cl-bg-hover dark:bg-cl-bg-elevated",
  range: "rounded-full bg-cl-accent dark:bg-cl-accent/30",
  thumb:
    "absolute rounded-full bg-white dark:bg-cl-text shadow-md transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent focus-visible:ring-offset-2 dark:focus-visible:ring-offset-cl-bg hover:shadow-lg cursor-grab",
  valueText:
    "absolute px-2 py-1 text-xs font-medium text-white bg-cl-bg dark:bg-cl-bg-elevated rounded-cl-md shadow-sm whitespace-nowrap pointer-events-none",
  marker: "rounded-full bg-white dark:bg-cl-bg-hover border-2 border-cl-border-input dark:border-cl-border text-xs text-cl-text-tertiary",
  message: "text-sm text-cl-error mt-1 text-cl-success",
};

export const UNSTYLED_SLIDER_CLASSES: Required<SliderClasses> =
  structuralOnly(DEFAULT_SLIDER_CLASSES);
