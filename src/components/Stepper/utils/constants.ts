import type { StepperClasses } from "./types.js";
import { structuralOnly } from "../../../utils/classLayers.js";

export const DEFAULT_STEPPER_CLASSES: Required<StepperClasses> = {
  root: "",
  list: "list-none m-0 p-0",
  item: "shrink-0 flex flex-col items-center",
  trigger: "flex items-center gap-1.5 sm:gap-2 transition-colors motion-reduce:transition-none cursor-pointer",
  // Every step's status, folded onto the surviving keys as `data-state`
  // variants — the replacement ADR 002 specified for `indicatorActive`,
  // `labelActive`, `descriptionPending`, `connectorCompleted` and the rest.
  // 6dd1925 deleted all of them and applied none, so an active step, a
  // completed step and a pending step painted identically: same circle, same
  // label colour, same connector. The default-state gate found this one; it was
  // not in the list of defects reported by eye, which is the point of having it.
  //
  // Active and completed share the accent on purpose, distinguished by the
  // indicator's content — a number against a check — rather than by hue. A
  // separate green for completed reads as a clash beside the brand accent, and
  // that was the original reasoning, kept.
  itemIndicator:
    "shrink-0 rounded-full flex items-center justify-center transition-colors motion-reduce:transition-none data-[state=active]:bg-cl-accent data-[state=active]:text-cl-on-accent data-[state=completed]:bg-cl-accent data-[state=completed]:text-cl-on-accent data-[state=inactive]:bg-cl-bg-hover data-[state=inactive]:text-cl-text-secondary data-[invalid]:bg-cl-error",
  indicatorTrigger:
    "cursor-pointer rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent focus-visible:ring-offset-2",
  itemIcon: "",
  row: "flex flex-col",
  itemText:
    "text-xs sm:text-sm font-medium leading-tight transition-colors motion-reduce:transition-none data-[state=active]:text-cl-accent data-[state=completed]:text-cl-text data-[state=inactive]:text-cl-text-tertiary data-[invalid]:text-cl-error",
  description:
    "text-[10px] sm:text-xs leading-tight transition-colors motion-reduce:transition-none data-[state=active]:text-cl-accent data-[state=completed]:text-cl-text-secondary data-[state=inactive]:text-cl-text-tertiary data-[invalid]:text-cl-error",
  // The connector's resting colour is `--cl-border`, which is the token the
  // literal `bg-black/[0.08] dark:bg-white/15` pair was reaching for and the
  // reason that pair does not come back with it.
  separator:
    "transition-colors motion-reduce:transition-none bg-cl-border data-[state=active]:bg-cl-accent/30 data-[state=completed]:bg-cl-accent",
};

export const UNSTYLED_STEPPER_CLASSES: Required<StepperClasses> =
  structuralOnly(DEFAULT_STEPPER_CLASSES);

/**
 * Per-variant indicator sizing. Lives here rather than in Stepper.tsx so it
 * takes the same structural/decorative split as every other default — `w-7 h-7`
 * is layout and survives `unstyled`, `text-xs font-medium` is not and does not.
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
