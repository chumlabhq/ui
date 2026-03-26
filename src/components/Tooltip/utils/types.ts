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

export interface TooltipProps {
  children: ReactNode;
  content?: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  alignOffset?: number;
  maxWidth?: string | number;
  wordWrap?: TooltipWordWrap;
  delayDuration?: number;
  hideDelayDuration?: number;
  disableHoverableContent?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
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
