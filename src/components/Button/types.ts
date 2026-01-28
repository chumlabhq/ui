import type { ButtonHTMLAttributes, ReactNode, CSSProperties } from "react";

export type IconAnimation =
  | "none"
  | "slideRight"
  | "slideLeft"
  | "slideUp"
  | "slideDown"
  | "bounce"
  | "pulse"
  | "spin";

export type TooltipSide = "top" | "right" | "bottom" | "left";
export type TooltipAlign = "start" | "center" | "end";

export interface ButtonTooltipProps {
  side?: TooltipSide;
  align?: TooltipAlign;
  sideOffset?: number;
  maxWidth?: string | number;
  delayDuration?: number;
  showArrow?: boolean;
  contentClassName?: string;
  contentStyle?: CSSProperties;
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  isLoading?: boolean;
  loadingText?: ReactNode;
  loaderPosition?: "left" | "right";
  loaderSize?: number;
  loader?: ReactNode;
  fullWidth?: boolean;
  asChild?: boolean;
  contentClassName?: string;
  as?: "button" | "a" | "span";
  href?: string;
  target?: string;
  rel?: string;
  iconAnimation?: IconAnimation;
  animateOnHover?: boolean;
  animateIcon?: "leading" | "trailing" | "both";
  tooltip?: ReactNode;
  tooltipProps?: ButtonTooltipProps;
}

export interface ButtonGroupProps {
  children: ReactNode;
  className?: string;
}
