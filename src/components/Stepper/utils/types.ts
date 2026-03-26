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
  stepInteractive?: string;
  stepDisabled?: string;
  indicator?: string;
  indicatorButton?: string;
  indicatorIcon?: string;
  indicatorActive?: string;
  indicatorCompleted?: string;
  indicatorPending?: string;
  indicatorError?: string;
  labelWrapper?: string;
  labelWrapperBottom?: string;
  label?: string;
  labelActive?: string;
  labelCompleted?: string;
  labelPending?: string;
  labelError?: string;
  description?: string;
  descriptionActive?: string;
  descriptionCompleted?: string;
  descriptionPending?: string;
  descriptionError?: string;
  connector?: string;
  connectorHorizontal?: string;
  connectorVertical?: string;
  connectorActive?: string;
  connectorCompleted?: string;
  connectorPending?: string;
  connectorError?: string;
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
  /** Override indicator size in pixels for connector alignment. Defaults: dot=12, icon=40, numbered=32. */
  indicatorSize?: number;
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

