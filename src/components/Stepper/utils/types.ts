import type {
  ReactNode,
  CSSProperties,
  ReactElement,
} from "react";
import type { TooltipShadow } from "../../Tooltip/index.js";

export type StepStatus = "pending" | "active" | "completed" | "error";

export interface IconProps {
  className?: string;
}

/**
 * Per-step tooltip options, for when a step needs more than the text a bare `tooltip` string gives.
 */
export interface StepTooltipConfig {
  /** What the tooltip says. Omitting it renders no tooltip at all. */
  content: ReactNode;
  /** Which side of the anchor to prefer. Flips to the opposite side when there is not room. */
  side?: "top" | "right" | "bottom" | "left";
  /** Where along that side the tooltip lines up with the anchor. */
  align?: "start" | "center" | "end";
  /** Gap in pixels between the anchor and the tooltip, along the side axis. */
  sideOffset?: number;
  /** Shift in pixels along the alignment axis, for nudging off a corner. */
  alignOffset?: number;
  /** Width at which the tooltip wraps rather than growing along the row. */
  maxWidth?: string | number;
  /** How long a pointer must rest before the tooltip opens, in milliseconds. Keyboard focus opens it immediately. */
  delayDuration?: number;
  /** Draws the arrow pointing at the anchor. */
  showArrow?: boolean;
  /** Overrides the arrow's fill when the content background is not the default. */
  arrowColor?: string;
  /** Elevation preset for the tooltip surface. */
  shadow?: TooltipShadow;
  /** Classes for the tooltip surface. */
  contentClassName?: string;
  /** Inline styles for the tooltip surface. */
  contentStyle?: CSSProperties;
  /** Classes for the arrow. */
  arrowClassName?: string;
  /** Inline styles for the arrow. */
  arrowStyle?: CSSProperties;
}

/**
 * One step in the sequence. Steps are addressed by `id`, so reordering the array does not change which step `value` refers to.
 */
export interface Step {
  /** Identifies the step. `value` and `onValueChange` carry this, not the index. */
  id: string | number;
  /** The step's name, shown beside or beneath its indicator. */
  label?: ReactNode;
  /** A second line under the label, for detail that does not fit the name. */
  description?: ReactNode;
  /** Replaces the number in the indicator while the step is pending or active. Rendered as given. */
  icon?: ReactNode;
  /** Replaces the default check once the step is complete. Rendered as given. */
  completedIcon?: ReactNode;
  /** Replaces the indicator's content when the step reports an error. Rendered as given. */
  errorIcon?: ReactNode;
  /** Blocks navigation to this step and drops it from the tab order. */
  disabled?: boolean;
  /** Text, or a config, shown when the step's indicator is hovered or focused. */
  tooltip?: ReactNode | StepTooltipConfig;
}

export interface StepperClasses {
  /** Root navigation container */
  root?: string;
  /** The <ol> list wrapping all steps */
  list?: string;
  /** The `<li>` wrapping one step: indicator, text and the separator that follows it. */
  item?: string;
  /** The clickable region of a step — indicator and text together — when the step is navigable. */
  trigger?: string;
  /** The numbered or icon-bearing circle. */
  itemIndicator?: string;
  /** The indicator when it is its own button, which is the `dot` and `icon` variants. */
  indicatorTrigger?: string;
  /** The icon inside the indicator, when one replaces the number. */
  itemIcon?: string;
  /** The flex row holding the indicator beside its text, for the horizontal orientations. */
  row?: string;
  /** Label and description together, so they can be aligned as one block. */
  itemText?: string;
  /** Step description text */
  description?: string;
  /** The connector drawn between one step and the next. */
  separator?: string;
}

/**
 * Tooltip options applied to every step that does not set its own, so a Stepper can place all its tooltips once.
 */
export interface StepperTooltipDefaults {
  /** Which side of the anchor to prefer. Flips to the opposite side when there is not room. */
  side?: "top" | "right" | "bottom" | "left";
  /** Where along that side the tooltip lines up with the anchor. */
  align?: "start" | "center" | "end";
  /** Gap in pixels between the anchor and the tooltip, along the side axis. */
  sideOffset?: number;
  /** Shift in pixels along the alignment axis, for nudging off a corner. */
  alignOffset?: number;
  /** Width at which the tooltip wraps rather than growing along the row. */
  maxWidth?: string | number;
  /** How long a pointer must rest before the tooltip opens, in milliseconds. Keyboard focus opens it immediately. */
  delayDuration?: number;
  /** Draws the arrow pointing at the anchor. */
  showArrow?: boolean;
  /** Overrides the arrow's fill when the content background is not the default. */
  arrowColor?: string;
  /** Elevation preset for the tooltip surface. */
  shadow?: TooltipShadow;
  /** Classes for the tooltip surface. */
  contentClassName?: string;
  /** Inline styles for the tooltip surface. */
  contentStyle?: CSSProperties;
  /** Classes for the arrow. */
  arrowClassName?: string;
  /** Inline styles for the arrow. */
  arrowStyle?: CSSProperties;
}

export interface StepRenderProps {
  step: Step;
  index: number;
  status: StepStatus;
  isClickable: boolean;
  isDisabled: boolean;
  nextStepStatus?: StepStatus;
}

/**
 * Props for the Stepper component.
 *
 * @example
 * ```tsx
 * <Stepper steps={[{ id: 1, label: "Account" }]} value={1} onValueChange={setStep} />
 * ```
 */
export interface StepperProps {
  /** Array of step definitions. Each step must have a unique `id`. */
  steps: Step[];
  /** Active step id. Not `activeStep` or `currentStep`. */
  value?: string | number;
  defaultValue?: string | number;
  /** Step change callback. Not `onChange` or `onStepChange`. */
  onValueChange?: (stepId: string | number) => void;
  beforeStepChange?: (
    nextStepId: string | number,
    currentStepId: string | number,
  ) => boolean;
  /** Layout direction. Default: "horizontal". */
  orientation?: "horizontal" | "vertical";
  /** Visual style of step indicators. Default: "numbered". */
  variant?: "numbered" | "icon" | "dot";
  activationMode?: "automatic" | "manual";
  isStepClickable?: (stepId: string | number, status: StepStatus) => boolean;
  getStepStatus?: (
    stepId: string | number,
    index: number,
    activeIndex: number,
  ) => StepStatus;
  showLabels?: boolean;
  showDescriptions?: boolean;
  showConnectors?: boolean;
  /** Where each step's label sits: under its indicator, or after it (`end`). */
  labelPosition?: "bottom" | "end";
  /** Replaces every step's completed check. Rendered as given; a step's own `completedIcon` wins. */
  completedIcon?: ReactNode;
  /** Replaces every step's error mark. Rendered as given; a step's own `errorIcon` wins. */
  errorIcon?: ReactNode;
  fullWidth?: boolean;
  "aria-label"?: string;
  showTooltips?: boolean;
  tooltipDefaults?: StepperTooltipDefaults;
  /** Override indicator size in pixels for connector alignment. Defaults: dot=12, icon=40, numbered=32. */
  indicatorSize?: number;
  /** Controls motion preferences. `"auto"` respects the user's OS setting. */
  reduceMotion?: boolean | "auto";
  classes?: StepperClasses;
  unstyled?: boolean;
  className?: string;
  style?: CSSProperties;
  id?: string;
  disabled?: boolean;
  loop?: boolean;
  renderStep?: (
    props: StepRenderProps,
    defaultElement: ReactElement,
  ) => ReactNode;
}

