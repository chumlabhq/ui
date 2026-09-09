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
  /** The skeleton's own bag — `CountryFlagShimmer` is a component, not a part. */
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
  /** Content rendered inside this element. */
  children: ReactNode;
  /** How many flags to show before the rest are collapsed into a surplus count. */
  max?: number;
  /** Flag size for every member of the group. */
  size?: CountryFlagSize | number;
  /** Shows a tooltip on the surplus count listing the hidden countries. */
  showCountTooltip?: boolean;
  /** Tooltip settings for the surplus count. Its content comes from `surplusTooltipContent`. */
  countTooltip?: Omit<CountryFlagTooltipConfig, "content">;
  /** Content for the surplus count's tooltip, replacing the generated country list. */
  surplusTooltipContent?: ReactNode;
  /** Renders the surplus indicator yourself, given the number of hidden flags. */
  renderSurplus?: (count: number) => ReactNode;
  /** Class overrides for this component's slots. */
  classes?: CountryFlagGroupClasses;
}

export interface CountryFlagGroupCountProps
  extends HTMLAttributes<HTMLDivElement> {
  count: number;
  size?: CountryFlagSize | number;
  tooltip?: ReactNode | CountryFlagTooltipConfig;
}

/**
 * Class slots for `CountryFlagShimmer`, which is a component you render
 * yourself rather than a part of `CountryFlag`, so it carries its own bag.
 */
export interface CountryFlagShimmerClasses {
  root?: string;
}

export interface CountryFlagShimmerProps
  extends HTMLAttributes<HTMLSpanElement> {
  /** Class overrides for this component's slots. */
  classes?: CountryFlagShimmerClasses;
  /** Drops the decorative default classes and keeps the structural ones, along with focus, keyboard and ARIA wiring. */
  unstyled?: boolean;
  /** Matches the flag size the placeholder stands in for. */
  size?: CountryFlagSize | number;
  /** Width-to-height ratio of the placeholder, matching the flag it stands in for. */
  aspectRatio?: number;
  /** Whether the placeholder pulses. Set false for a still skeleton. */
  animate?: boolean;
  /** Whether to stop the shimmer animation. `"auto"` follows the OS reduced-motion setting. */
  reduceMotion?: boolean | "auto";
}

export interface CountryFlagGroupShimmerProps
  extends HTMLAttributes<HTMLDivElement> {
  /** How many placeholder flags to draw. */
  count?: number;
  /** Matches the flag size the placeholder stands in for. */
  size?: CountryFlagSize | number;
  /** Width-to-height ratio of each placeholder. */
  aspectRatio?: number;
  /** Whether the placeholders pulse. Set false for a still skeleton. */
  animate?: boolean;
  /** Whether to stop the shimmer animation. `"auto"` follows the OS reduced-motion setting. */
  reduceMotion?: boolean | "auto";
  /** Also draws a placeholder for the surplus count. */
  showCount?: boolean;
}
