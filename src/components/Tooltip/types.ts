import type { ReactNode, CSSProperties } from "react";

export interface TooltipProviderProps {
  children: ReactNode;
}

export type TooltipShadowPreset = "none" | "sm" | "md" | "lg" | "xl" | "2xl";
export type TooltipShadow = TooltipShadowPreset | (string & {});

export interface TooltipProps {
  children: ReactNode;
  content?: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  alignOffset?: number;
  maxWidth?: string | number;
  delayDuration?: number;
  disableHoverableContent?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  showArrow?: boolean;
  arrowColor?: string;
  disabled?: boolean;
  truncate?: boolean;
  truncateWidth?: string;
  shadow?: TooltipShadow;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  contentStyle?: CSSProperties;
  arrowClassName?: string;
  arrowStyle?: CSSProperties;
}
