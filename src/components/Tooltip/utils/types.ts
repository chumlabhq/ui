import type { ReactNode, CSSProperties } from "react";

export type TooltipShadowPreset = "none" | "sm" | "md" | "lg" | "xl" | "2xl";
export type TooltipShadow = TooltipShadowPreset | (string & {});

export type TooltipWordWrap = "normal" | "break-word" | "nowrap";

export interface TooltipClasses {
  trigger?: string;
  content?: string;
  arrow?: string;
  baseArrow?: string;
}

/**
 * Props for the Tooltip component.
 *
 * @example
 * ```tsx
 * <Tooltip content="Help text" side="top"><button>Hover</button></Tooltip>
 * ```
 */
export interface TooltipProps {
  children: ReactNode;
  /** Tooltip content (string or ReactNode). Not `title` or `text`. */
  content?: ReactNode;
  /** Tooltip position relative to trigger. Not `placement` or `position`. */
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  alignOffset?: number;
  maxWidth?: string | number;
  wordWrap?: TooltipWordWrap;
  /** Delay in ms before the tooltip appears. Default: 700. */
  delayDuration?: number;
  hideDelayDuration?: number;
  disableHoverableContent?: boolean;
  /** Controlled open state. Use with `onOpenChange`. */
  open?: boolean;
  defaultOpen?: boolean;
  /** Callback when open state changes. Not `onVisibleChange`. */
  onOpenChange?: (open: boolean) => void;
  /** Show a small arrow pointing at the trigger. Default: true. */
  showArrow?: boolean;
  arrowSize?: number;
  arrowColor?: string;
  disabled?: boolean;
  truncate?: boolean;
  truncateWidth?: number | string;
  shadow?: TooltipShadow;
  zIndex?: number;
  portal?: boolean;
  portalContainer?: HTMLElement | null;
  asChild?: boolean;
  triggerDisplay?: CSSProperties["display"];
  className?: string;
  classes?: TooltipClasses;
  unstyled?: boolean;
  contentStyle?: CSSProperties;
  arrowStyle?: CSSProperties;
  baseArrowStyle?: CSSProperties;
}
