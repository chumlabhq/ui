import type {
  ComponentType,
  ReactNode,
  HTMLAttributes,
  CSSProperties,
} from "react";
import type { TooltipShadow } from "../Tooltip";

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

export interface StepperProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "onChange"
> {
  steps: Step[];
  activeStep?: string | number;
  orientation?: "horizontal" | "vertical";
  variant?: "numbered" | "icon" | "dot";
  onChange?: (stepId: string | number) => void;
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
  showTooltips?: boolean;
  tooltipSide?: "top" | "right" | "bottom" | "left";
  tooltipAlign?: "start" | "center" | "end";
  tooltipSideOffset?: number;
  tooltipAlignOffset?: number;
  tooltipMaxWidth?: string | number;
  tooltipDelayDuration?: number;
  tooltipShowArrow?: boolean;
  tooltipArrowColor?: string;
  tooltipShadow?: TooltipShadow;
  tooltipContentClassName?: string;
  tooltipContentStyle?: CSSProperties;
  tooltipArrowClassName?: string;
  tooltipArrowStyle?: CSSProperties;
  className?: string;
  containerClassName?: string;
  stepContainerClassName?: string;
  stepClassName?: string;
  stepActiveClassName?: string;
  stepCompletedClassName?: string;
  stepPendingClassName?: string;
  stepErrorClassName?: string;
  stepDisabledClassName?: string;
  indicatorClassName?: string;
  indicatorActiveClassName?: string;
  indicatorCompletedClassName?: string;
  indicatorPendingClassName?: string;
  indicatorErrorClassName?: string;
  indicatorIconClassName?: string;
  labelClassName?: string;
  labelActiveClassName?: string;
  labelCompletedClassName?: string;
  labelPendingClassName?: string;
  labelErrorClassName?: string;
  descriptionClassName?: string;
  descriptionActiveClassName?: string;
  descriptionCompletedClassName?: string;
  descriptionPendingClassName?: string;
  descriptionErrorClassName?: string;
  connectorClassName?: string;
  connectorActiveClassName?: string;
  connectorCompletedClassName?: string;
  connectorPendingClassName?: string;
  connectorErrorClassName?: string;
}

export interface StepItemProps {
  step: Step;
  index: number;
  status: StepStatus;
  isClickable: boolean;
  isFirst?: boolean;
  isLast: boolean;
  variant: "numbered" | "icon" | "dot";
  orientation: "horizontal" | "vertical";
  labelPosition: "bottom" | "right";
  showLabels: boolean;
  showDescriptions: boolean;
  showConnectors: boolean;
  completedIcon?: ComponentType<IconProps> | ReactNode;
  errorIcon?: ComponentType<IconProps> | ReactNode;
  onClick: () => void;
  showTooltips: boolean;
  tooltipSide?: "top" | "right" | "bottom" | "left";
  tooltipAlign?: "start" | "center" | "end";
  tooltipSideOffset?: number;
  tooltipAlignOffset?: number;
  tooltipMaxWidth?: string | number;
  tooltipDelayDuration?: number;
  tooltipShowArrow?: boolean;
  tooltipArrowColor?: string;
  tooltipShadow?: TooltipShadow;
  tooltipContentClassName?: string;
  tooltipContentStyle?: CSSProperties;
  tooltipArrowClassName?: string;
  tooltipArrowStyle?: CSSProperties;
  stepContainerClassName: string;
  stepClassName: string;
  stepActiveClassName: string;
  stepCompletedClassName: string;
  stepPendingClassName: string;
  stepErrorClassName: string;
  stepDisabledClassName: string;
  indicatorClassName: string;
  indicatorActiveClassName: string;
  indicatorCompletedClassName: string;
  indicatorPendingClassName: string;
  indicatorErrorClassName: string;
  indicatorIconClassName: string;
  labelClassName: string;
  labelActiveClassName: string;
  labelCompletedClassName: string;
  labelPendingClassName: string;
  labelErrorClassName: string;
  descriptionClassName: string;
  descriptionActiveClassName: string;
  descriptionCompletedClassName: string;
  descriptionPendingClassName: string;
  descriptionErrorClassName: string;
  connectorClassName: string;
  connectorActiveClassName: string;
  connectorCompletedClassName: string;
  connectorPendingClassName: string;
  connectorErrorClassName: string;
}
