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

export interface CountryFlagClasses {
  root?: string;
  /** R6: the skeleton's own bag. CountryFlagShimmer is a component, not a part. */
  loading?: CountryFlagShimmerClasses;
  image?: string;
  fallback?: string;
}

export interface CountryFlagGroupClasses {
  root?: string;
  item?: string;
  count?: string;
}

/**
 * Props for the CountryFlag component.
 *
 * @example
 * ```tsx
 * <CountryFlag code="US" size="md" />
 * ```
 */
export interface CountryFlagProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "onLoad" | "onError"> {
  /** ISO 3166-1 alpha-2 country code. Not `countryCode` or `country`. */
  code: string;
  size?: CountryFlagSize | number;
  aspectRatio?: number;
  alt?: string;
  fallback?: ReactNode;
  loading?: boolean;
  tooltip?: ReactNode | CountryFlagTooltipConfig;
  /**
   * Where to load the flag SVG from. Omit (the default) to use the flags
   * packaged with the library - no network request is made. Set it to fetch
   * `${basePath}/${code}.svg` from a CDN or self-hosted directory instead.
   */
  basePath?: string;
  classes?: CountryFlagClasses;
  unstyled?: boolean;
  reduceMotion?: boolean | "auto";
  onLoad?: (event: SyntheticEvent<HTMLImageElement>) => void;
  onError?: (event: SyntheticEvent<HTMLImageElement>) => void;
}

export interface CountryFlagGroupProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  max?: number;
  size?: CountryFlagSize | number;
  showCountTooltip?: boolean;
  countTooltip?: Omit<CountryFlagTooltipConfig, "content">;
  surplusTooltipContent?: ReactNode;
  renderSurplus?: (count: number) => ReactNode;
  classes?: CountryFlagGroupClasses;
}

export interface CountryFlagGroupCountProps
  extends HTMLAttributes<HTMLDivElement> {
  count: number;
  size?: CountryFlagSize | number;
  tooltip?: ReactNode | CountryFlagTooltipConfig;
}

/**
 * ADR 002: CountryFlagShimmer is root-exported and COUNTRYFLAG.ai.md:19 shows it
 * imported directly, so it is a component with its own styling route.
 */
export interface CountryFlagShimmerClasses {
  root?: string;
}

export interface CountryFlagShimmerProps
  extends HTMLAttributes<HTMLSpanElement> {
  classes?: CountryFlagShimmerClasses;
  unstyled?: boolean;
  size?: CountryFlagSize | number;
  aspectRatio?: number;
  animate?: boolean;
  reduceMotion?: boolean | "auto";
}

export interface CountryFlagGroupShimmerProps
  extends HTMLAttributes<HTMLDivElement> {
  count?: number;
  size?: CountryFlagSize | number;
  aspectRatio?: number;
  animate?: boolean;
  reduceMotion?: boolean | "auto";
  showCount?: boolean;
}
