import type { CSSProperties, ReactNode } from "react";

export type CountryFlagSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

export interface CountryFlagProps {
  code: string;
  size?: CountryFlagSize | number;
  className?: string;
  alt?: string;
  style?: CSSProperties;
  fallback?: ReactNode;
  tooltipContent?: ReactNode;
  tooltipSide?: "top" | "right" | "bottom" | "left";
  tooltipAlign?: "start" | "center" | "end";
  tooltipSideOffset?: number;
  tooltipDelayDuration?: number;
  tooltipClassName?: string;
  showTooltipArrow?: boolean;
}

export interface CountryFlagGroupProps {
  children: ReactNode;
  max?: number;
  showCountTooltip?: boolean;
  countTooltipSide?: "top" | "right" | "bottom" | "left";
  countTooltipAlign?: "start" | "center" | "end";
  countTooltipClassName?: string;
  className?: string;
  itemClassName?: string;
  countClassName?: string;
}

export interface CountryFlagGroupCountProps {
  count: number;
  size?: number;
  className?: string;
  tooltipContent?: ReactNode;
  tooltipSide?: "top" | "right" | "bottom" | "left";
  tooltipAlign?: "start" | "center" | "end";
  tooltipClassName?: string;
}
