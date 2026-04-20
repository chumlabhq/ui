import type { HTMLAttributes } from "react";

// ─── Classes types ──────────────────────────────────────────────────────────

/** CSS class overrides for CircularLoader sub-elements. */
export interface CircularLoaderClasses {
  /** Root wrapper element. */
  root?: string;
  /** SVG element. */
  svg?: string;
  /** Background track circle. */
  track?: string;
  /** Foreground arc circle. */
  indicator?: string;
}

/** CSS class overrides for LinearLoader sub-elements. */
export interface LinearLoaderClasses {
  /** Root wrapper element. */
  root?: string;
  /** Animated bar element. */
  bar?: string;
}

/** CSS class overrides for DotLoader sub-elements. */
export interface DotLoaderClasses {
  /** Root wrapper element. */
  root?: string;
  /** Individual dot element. */
  dot?: string;
}

/** CSS class overrides for PulseLoader sub-elements. */
export interface PulseLoaderClasses {
  /** Root wrapper element. */
  root?: string;
  /** Core dot element. */
  core?: string;
  /** Ripple ring element. */
  ring?: string;
}

// ─── Props types ────────────────────────────────────────────────────────────

/**
 * Props for the CircularLoader component.
 *
 * @example
 * ```tsx
 * <CircularLoader size={24} color="white" />
 * ```
 */
export interface CircularLoaderProps extends HTMLAttributes<HTMLDivElement> {
  /** Width and height in pixels. Default: 20 */
  size?: number;
  /** Stroke width of track and arc. Default: 2 */
  thickness?: number;
  /** Animation duration in seconds (lower = faster). Default: 0.75 */
  speed?: number;
  /** Background track color. Default: currentColor at 20% opacity */
  trackColor?: string;
  /** Spinner color (applied via currentColor / className) */
  color?: string;
  /** Controls motion preferences. `"auto"` respects the user's OS setting. */
  reduceMotion?: boolean | "auto";
  /** CSS class overrides for sub-elements. */
  classes?: CircularLoaderClasses;
  /** Removes all default styling. */
  unstyled?: boolean;
}

export interface LinearLoaderProps extends HTMLAttributes<HTMLDivElement> {
  /** Height of the bar in pixels. Default: 4 */
  height?: number;
  /** Width of the bar (CSS value). Default: "100%" */
  width?: string | number;
  /** Animation duration in seconds. Default: 1.5 */
  speed?: number;
  /** Background track color */
  trackColor?: string;
  /** Border radius in pixels. Default: 9999 (pill) */
  borderRadius?: number;
  /** Controls motion preferences. `"auto"` respects the user's OS setting. */
  reduceMotion?: boolean | "auto";
  /** CSS class overrides for sub-elements. */
  classes?: LinearLoaderClasses;
  /** Removes all default styling. */
  unstyled?: boolean;
}

export interface DotLoaderProps extends HTMLAttributes<HTMLDivElement> {
  /** Diameter of each dot in pixels. Default: 8 */
  dotSize?: number;
  /** Gap between dots in pixels. Default: 4 */
  gap?: number;
  /** Number of dots. Default: 3 */
  count?: number;
  /** Full animation cycle duration in seconds. Default: 1.4 */
  speed?: number;
  /** Controls motion preferences. `"auto"` respects the user's OS setting. */
  reduceMotion?: boolean | "auto";
  /** CSS class overrides for sub-elements. */
  classes?: DotLoaderClasses;
  /** Removes all default styling. */
  unstyled?: boolean;
}

export interface PulseLoaderProps extends HTMLAttributes<HTMLDivElement> {
  /** Diameter of the circle in pixels. Default: 40 */
  size?: number;
  /** Animation duration in seconds. Default: 1.5 */
  speed?: number;
  /** Number of ripple rings. Default: 2 */
  rings?: number;
  /** Controls motion preferences. `"auto"` respects the user's OS setting. */
  reduceMotion?: boolean | "auto";
  /** CSS class overrides for sub-elements. */
  classes?: PulseLoaderClasses;
  /** Removes all default styling. */
  unstyled?: boolean;
}
