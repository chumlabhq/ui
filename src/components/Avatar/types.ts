import type { CSSProperties, ReactNode } from "react";

export type TooltipSide = "top" | "right" | "bottom" | "left";
export type TooltipAlign = "start" | "center" | "end";

export interface AvatarTooltipProps {
  tooltipContent?: ReactNode;
  tooltipSide?: TooltipSide;
  tooltipAlign?: TooltipAlign;
  tooltipSideOffset?: number;
  tooltipDelayDuration?: number;
  tooltipClassName?: string;
  showTooltipArrow?: boolean;
}

export interface AvatarProps extends AvatarTooltipProps {
  text?: string;
  src?: string;
  alt?: string;
  maxChars?: number;
  size?: number;
  isLoading?: boolean;
  className?: string;
  imgClassName?: string;
  style?: CSSProperties;
  shimmerClassName?: string;
}

export interface AvatarGroupProps {
  children?: ReactNode;
  max?: number;
  size?: number;
  isLoading?: boolean;
  shimmerCount?: number;
  showCountTooltip?: boolean;
  countTooltipSide?: TooltipSide;
  countTooltipAlign?: TooltipAlign;
  className?: string;
  itemClassName?: string;
  countClassName?: string;
  countTooltipClassName?: string;
  shimmerClassName?: string;
  shimmerItemClassName?: string;
}

export interface AvatarGroupCountProps {
  count: number;
  size?: number;
  className?: string;
  tooltipContent?: ReactNode;
  tooltipSide?: TooltipSide;
  tooltipAlign?: TooltipAlign;
  tooltipClassName?: string;
}

export interface AvatarShimmerProps {
  size?: number;
  className?: string;
}

export interface AvatarGroupShimmerProps {
  count?: number;
  size?: number;
  className?: string;
  itemClassName?: string;
}
