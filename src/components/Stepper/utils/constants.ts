import type { StepperClasses } from "./types";
import { structuralOnly } from "../../../utils/classLayers";

export const DEFAULT_STEPPER_CLASSES: Required<StepperClasses> = {
  root: "",
  list: "list-none m-0 p-0",
  item: "",
  trigger: "flex items-center gap-1.5 sm:gap-2 transition-colors motion-reduce:transition-none",
  itemIndicator:
    "shrink-0 rounded-full flex items-center justify-center transition-colors motion-reduce:transition-none",
  indicatorTrigger:
    "cursor-pointer rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent focus-visible:ring-offset-2",
  itemIcon: "",
  row: "flex flex-col",
  itemText: "text-xs sm:text-sm font-medium leading-tight transition-colors motion-reduce:transition-none",
  description: "text-[10px] sm:text-xs leading-tight transition-colors motion-reduce:transition-none",
  separator: "transition-colors motion-reduce:transition-none",
};

export const UNSTYLED_STEPPER_CLASSES: Required<StepperClasses> =
  structuralOnly(DEFAULT_STEPPER_CLASSES);

/**
 * Per-variant indicator sizing. Lives here rather than in Stepper.tsx so it
 * takes the ADR 001 structural/decorative split with every other default —
 * `w-7 h-7` is layout and must survive `unstyled`, `text-xs font-medium` is not.
 */
export const INDICATOR_SIZE: Record<string, string> = {
  dot: "w-2.5 h-2.5 sm:w-3 sm:h-3",
  icon: "w-8 h-8 sm:w-10 sm:h-10",
  numbered: "w-7 h-7 text-xs sm:w-8 sm:h-8 sm:text-sm font-medium",
};

export const ICON_SIZE: Record<string, string> = {
  dot: "w-full h-full",
  icon: "w-4 h-4 sm:w-5 sm:h-5",
  numbered: "w-3.5 h-3.5 sm:w-4 sm:h-4",
};
