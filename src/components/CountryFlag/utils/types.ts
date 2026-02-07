import type { HTMLAttributes, ReactNode, SyntheticEvent } from "react";

export type CountryFlagSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

export interface CountryFlagTooltipConfig {
  content: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  delayDuration?: number;
  className?: string;
  showArrow?: boolean;
}

export interface CountryFlagProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "onLoad" | "onError"> {
  code: string;
  size?: CountryFlagSize | number;
  /** Aspect ratio (height / width). Defaults to 0.75 (4:3). */
  aspectRatio?: number;
  alt?: string;
  fallback?: ReactNode;
  /** Show a shimmer placeholder instead of the flag. */
  loading?: boolean;
  tooltip?: ReactNode | CountryFlagTooltipConfig;
  basePath?: string;
  onLoad?: (event: SyntheticEvent<HTMLImageElement>) => void;
  onError?: (event: SyntheticEvent<HTMLImageElement>) => void;
}

export interface CountryFlagGroupProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  max?: number;
  /** Size used for the surplus count badge. Should match the size of child flags. */
  size?: CountryFlagSize | number;
  showCountTooltip?: boolean;
  countTooltip?: Omit<CountryFlagTooltipConfig, "content">;
  /** Explicit tooltip content for the surplus badge. Overrides auto-generated content from showCountTooltip. */
  surplusTooltipContent?: ReactNode;
  /** Custom render function for the surplus indicator. Replaces the default count badge. */
  renderSurplus?: (count: number) => ReactNode;
  itemClassName?: string;
  countClassName?: string;
}

export interface CountryFlagGroupCountProps
  extends HTMLAttributes<HTMLDivElement> {
  count: number;
  size?: CountryFlagSize | number;
  tooltip?: ReactNode | CountryFlagTooltipConfig;
}

export interface CountryFlagShimmerProps
  extends HTMLAttributes<HTMLSpanElement> {
  size?: CountryFlagSize | number;
  aspectRatio?: number;
  animate?: boolean;
}

export interface CountryFlagGroupShimmerProps
  extends HTMLAttributes<HTMLDivElement> {
  count?: number;
  size?: CountryFlagSize | number;
  aspectRatio?: number;
  animate?: boolean;
  showCount?: boolean;
}
