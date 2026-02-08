import type {
  ComponentType,
  ReactNode,
  CSSProperties,
  ReactElement,
} from "react";
import type { TooltipShadow } from "../../Tooltip";

export type StepStatus = "pending" | "active" | "completed" | "error";

export interface IconProps {
  className?: string;
}

export interface StepTooltipConfig {
  content: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  alignOffset?: number;
  maxWidth?: string | number;
  delayDuration?: number;
  showArrow?: boolean;
  arrowColor?: string;
  shadow?: TooltipShadow;
  contentClassName?: string;
  contentStyle?: CSSProperties;
  arrowClassName?: string;
  arrowStyle?: CSSProperties;
}

export interface Step {
  id: string | number;
  label?: ReactNode;
  description?: ReactNode;
  icon?: ComponentType<IconProps> | ReactNode;
  completedIcon?: ComponentType<IconProps> | ReactNode;
  errorIcon?: ComponentType<IconProps> | ReactNode;
  disabled?: boolean;
  tooltip?: ReactNode | StepTooltipConfig;
}

export interface StepperClasses {
  root?: string;
  list?: string;
  stepContainer?: string;
  step?: string;
  indicator?: string;
  indicatorIcon?: string;
  labelWrapper?: string;
  label?: string;
  description?: string;
  connector?: string;
}

export interface StepperTooltipDefaults {
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  alignOffset?: number;
  maxWidth?: string | number;
  delayDuration?: number;
  showArrow?: boolean;
  arrowColor?: string;
  shadow?: TooltipShadow;
  contentClassName?: string;
  contentStyle?: CSSProperties;
  arrowClassName?: string;
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

export interface StepperProps {
  steps: Step[];
  value?: string | number;
  defaultValue?: string | number;
  onValueChange?: (stepId: string | number) => void;
  beforeStepChange?: (
    nextStepId: string | number,
    currentStepId: string | number,
  ) => boolean;
  orientation?: "horizontal" | "vertical";
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
  labelPosition?: "bottom" | "right";
  completedIcon?: ComponentType<IconProps> | ReactNode;
  errorIcon?: ComponentType<IconProps> | ReactNode;
  fullWidth?: boolean;
  "aria-label"?: string;
  showTooltips?: boolean;
  tooltipDefaults?: StepperTooltipDefaults;
  classes?: StepperClasses;
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

