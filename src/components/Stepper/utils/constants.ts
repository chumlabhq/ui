import type { StepperClasses } from "./types";
import { structuralOnly } from "../../../utils/classLayers";

export const DEFAULT_STEPPER_CLASSES: Required<StepperClasses> = {
  root: "",
  list: "list-none m-0 p-0",
  stepContainer: "",
  stepContainerVertical: "flex flex-col",
  stepContainerHorizontal: "shrink-0",
  step: "flex items-center gap-1.5 sm:gap-2 transition-colors motion-reduce:transition-none",
  stepInteractive:
    "cursor-pointer rounded-cl-md px-1.5 py-1 sm:px-2 sm:py-1.5 hover:bg-cl-bg-hover dark:hover:bg-cl-bg-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent focus-visible:ring-offset-2 dark:focus-visible:ring-offset-cl-bg",
  stepDisabled: "opacity-50 cursor-not-allowed",
  indicator:
    "shrink-0 rounded-full flex items-center justify-center transition-colors motion-reduce:transition-none",
  indicatorButton:
    "cursor-pointer rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent focus-visible:ring-offset-2",
  indicatorIcon: "",
  // Active and Completed both use the brand accent — distinguishing them
  // with the indicator content (number vs check icon) and weight, not
  // hue. A separate green for "completed" reads as a clash against the
  // muted brand-blue accent in dark mode and adds visual noise.
  indicatorActive: "bg-cl-accent text-cl-on-accent",
  indicatorCompleted: "bg-cl-accent text-cl-on-accent",
  // Pending uses a text-tinted translucent wash so it stays visible on
  // any surface — bg-cl-bg-elevated alone would disappear inside an
  // already-elevated demo card in dark mode.
  indicatorPending: "bg-black/[0.06] dark:bg-white/10 text-cl-text-secondary",
  indicatorError: "bg-cl-error text-white",
  labelWrapper: "flex flex-col",
  labelWrapperBottom: "items-center",
  label: "text-xs sm:text-sm font-medium leading-tight transition-colors motion-reduce:transition-none",
  labelActive: "text-cl-accent",
  labelCompleted: "text-cl-text",
  labelPending: "text-cl-text-tertiary",
  labelError: "text-cl-error",
  description: "text-[10px] sm:text-xs leading-tight transition-colors motion-reduce:transition-none",
  descriptionActive: "text-cl-accent",
  descriptionCompleted: "text-cl-text-secondary",
  descriptionPending: "text-cl-text-tertiary",
  descriptionError: "text-cl-error",
  connector: "transition-colors motion-reduce:transition-none",
  // Same reasoning as indicatorPending — bg-cl-bg-elevated would vanish
  // inside an elevated container.
  connectorHorizontal: "w-full h-0.5 bg-black/[0.08] dark:bg-white/15",
  connectorVertical: "w-0.5 h-6 bg-black/[0.08] dark:bg-white/15",
  connectorActive: "bg-cl-accent/30",
  connectorCompleted: "bg-cl-accent",
  connectorPending: "",
  connectorError: "",
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
