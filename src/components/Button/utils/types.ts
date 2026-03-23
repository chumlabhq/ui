import type {
  ButtonHTMLAttributes,
  AnchorHTMLAttributes,
  ReactNode,
  CSSProperties,
  HTMLAttributes,
} from "react";

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

interface ButtonSharedProps {
  children?: ReactNode;
  disabled?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  loading?: boolean;
  loadingText?: ReactNode;
  loaderPosition?: "left" | "right";
  loaderSize?: number;
  loader?: ReactNode;
  fullWidth?: boolean;
  contentClassName?: string;
  iconAnimation?: IconAnimation;
  animateOnHover?: boolean;
  animateIcon?: "leading" | "trailing" | "both";
  tooltip?: ReactNode;
  tooltipProps?: ButtonTooltipProps;
}

export interface ButtonAsButtonProps
  extends ButtonSharedProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  as?: "button";
  asChild?: false;
  href?: never;
  target?: never;
  rel?: never;
}

export interface ButtonAsAnchorProps
  extends ButtonSharedProps,
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children"> {
  as: "a";
  asChild?: false;
  href: string;
}

export interface ButtonAsSpanProps
  extends ButtonSharedProps,
    Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  as: "span";
  asChild?: false;
  href?: never;
  target?: never;
  rel?: never;
}

export interface ButtonAsChildProps extends ButtonSharedProps {
  asChild: true;
  as?: never;
  href?: never;
  target?: never;
  rel?: never;
  className?: string;
  style?: CSSProperties;
  onClick?: (...args: unknown[]) => void;
}

export type ButtonProps =
  | ButtonAsButtonProps
  | ButtonAsAnchorProps
  | ButtonAsSpanProps
  | ButtonAsChildProps;

export interface ButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}
