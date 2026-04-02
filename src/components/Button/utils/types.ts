import type {
  ButtonHTMLAttributes,
  AnchorHTMLAttributes,
  ReactNode,
  CSSProperties,
  HTMLAttributes,
} from "react";

/** Animation type applied to leading/trailing icons. */
export type IconAnimation =
  | "none"
  | "slideRight"
  | "slideLeft"
  | "slideUp"
  | "slideDown"
  | "bounce"
  | "pulse"
  | "spin";

/** Preset size variant for the button. */
export type ButtonSize = "sm" | "md" | "lg";

/** Side on which the tooltip appears relative to the button. */
export type TooltipSide = "top" | "right" | "bottom" | "left";

/** Alignment of the tooltip relative to the button edge. */
export type TooltipAlign = "start" | "center" | "end";

/** Configuration for the button's built-in tooltip. */
export interface ButtonTooltipProps {
  /** Side on which the tooltip appears. */
  side?: TooltipSide;
  /** Alignment along the tooltip side. */
  align?: TooltipAlign;
  /** Pixel offset from the button edge. */
  sideOffset?: number;
  /** Maximum width of the tooltip content. */
  maxWidth?: string | number;
  /** Delay in ms before the tooltip appears. */
  delayDuration?: number;
  /** Whether to show a directional arrow on the tooltip. */
  showArrow?: boolean;
  /** Custom CSS class for the tooltip content container. */
  contentClassName?: string;
  /** Inline styles for the tooltip content container. */
  contentStyle?: CSSProperties;
}

/** CSS class overrides for button sub-elements. */
export interface ButtonClasses {
  /** Root button/anchor/span element. */
  root?: string;
  /** Inner content wrapper. */
  content?: string;
  /** Leading icon wrapper. */
  startIcon?: string;
  /** Trailing icon wrapper. */
  endIcon?: string;
  /** Loader/spinner wrapper. */
  loader?: string;
}

interface ButtonSharedProps {
  /** Button content. */
  children?: ReactNode;
  /** Size variant. Emits `data-size` on the root element. Default: `"md"`. */
  size?: ButtonSize;
  /** Disables interaction and applies disabled styling. */
  disabled?: boolean;
  /** Icon rendered before the button label. */
  startIcon?: ReactNode;
  /** Icon rendered after the button label. */
  endIcon?: ReactNode;
  /** Shows a loading spinner and disables interaction. */
  loading?: boolean;
  /** Text displayed alongside the loading spinner. */
  loadingText?: ReactNode;
  /** Which side of the label the loader appears on. */
  loaderPosition?: "left" | "right";
  /** Pixel size of the loading spinner. */
  loaderSize?: number;
  /** Custom loader element replacing the default spinner. */
  loader?: ReactNode;
  /** Stretches the button to fill its container width. */
  fullWidth?: boolean;
  /** CSS class overrides for button sub-elements. */
  classes?: ButtonClasses;
  /** Removes all default styling, rendering a plain element. */
  unstyled?: boolean;
  /** Animation applied to icons on hover. */
  iconAnimation?: IconAnimation;
  /** Enables icon animation on hover. Default: `false`. */
  animateOnHover?: boolean;
  /** Which icon(s) to animate: leading, trailing, or both. */
  animateIcon?: "leading" | "trailing" | "both";
  /** Controls motion preferences. `"auto"` respects the user's OS setting. */
  reduceMotion?: boolean | "auto";
  /** Tooltip content shown on hover. */
  tooltip?: ReactNode;
  /** Configuration for tooltip positioning and appearance. */
  tooltipProps?: ButtonTooltipProps;
}

/** Props when rendering as a native `<button>` element (default). */
export interface ButtonAsButtonProps
  extends ButtonSharedProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** Render as a `<button>` element. */
  as?: "button";
  asChild?: false;
  href?: never;
  target?: never;
  rel?: never;
}

/** Props when rendering as an `<a>` element. */
export interface ButtonAsAnchorProps
  extends ButtonSharedProps,
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children"> {
  /** Render as an `<a>` element. */
  as: "a";
  asChild?: false;
  /** Link destination (required for anchor buttons). */
  href: string;
}

/** Props when rendering as a `<span>` element. */
export interface ButtonAsSpanProps
  extends ButtonSharedProps,
    Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  /** Render as a `<span>` element. */
  as: "span";
  asChild?: false;
  href?: never;
  target?: never;
  rel?: never;
}

/** Props when using the Slot composition pattern to merge with a child element. */
export interface ButtonAsChildProps extends ButtonSharedProps {
  /** Merges button props onto the child element via Slot. */
  asChild: true;
  as?: never;
  href?: never;
  target?: never;
  rel?: never;
  className?: string;
  style?: CSSProperties;
  onClick?: (...args: unknown[]) => void;
}

/**
 * Polymorphic button props. Renders as `<button>`, `<a>`, `<span>`,
 * or merges into a child element via `asChild`.
 */
export type ButtonProps =
  | ButtonAsButtonProps
  | ButtonAsAnchorProps
  | ButtonAsSpanProps
  | ButtonAsChildProps;

/** Props for the ButtonGroup layout container. */
export interface ButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Button elements to group together. */
  children: ReactNode;
  /** Stack direction. Default: `"horizontal"`. */
  orientation?: "horizontal" | "vertical";
}
