import type { ReactNode, HTMLAttributes, ImgHTMLAttributes, CSSProperties } from "react";

export type TooltipSide = "top" | "right" | "bottom" | "left";
export type TooltipAlign = "start" | "center" | "end";
export type AvatarShape = "circle" | "square" | "rounded";
export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | number;
export type AvatarStatus = "online" | "offline" | "away" | "busy";
export type Direction = "ltr" | "rtl";
export type CornerPosition = "top-right" | "top-left" | "bottom-right" | "bottom-left";
export type BadgeSize = "xs" | "sm" | "md" | "lg";
export type BadgeVariant = "solid" | "outline" | "soft";
export type BadgeOverlap = "rectangular" | "circular";
export type CountVariant = "solid" | "outline" | "ghost";
export type GroupVariant = "stack" | "grid" | "inline";

export interface AvatarColors {
  backgrounds?: string[];
  borders?: string[];
  text?: string[];
}

export interface AvatarTooltipConfig {
  content: ReactNode;
  side?: TooltipSide;
  align?: TooltipAlign;
  sideOffset?: number;
  delayDuration?: number;
  className?: string;
  showArrow?: boolean;
}

export interface AvatarStatusConfig {
  type: AvatarStatus;
  position?: CornerPosition;
  className?: string;
  color?: string;
}

export interface AvatarImageConfig {
  srcSet?: string;
  sizes?: string;
  loading?: ImgHTMLAttributes<HTMLImageElement>["loading"];
  decoding?: ImgHTMLAttributes<HTMLImageElement>["decoding"];
  crossOrigin?: ImgHTMLAttributes<HTMLImageElement>["crossOrigin"];
  referrerPolicy?: ImgHTMLAttributes<HTMLImageElement>["referrerPolicy"];
  fetchPriority?: "high" | "low" | "auto";
  className?: string;
}

export interface AvatarProps extends Omit<HTMLAttributes<HTMLDivElement>, "onLoad" | "onError"> {
  name?: string;
  src?: string;
  alt?: string;
  size?: AvatarSize;
  shape?: AvatarShape;
  maxInitials?: number;
  fallback?: ReactNode;
  autoColor?: boolean;
  colors?: AvatarColors;
  bordered?: boolean | string;
  status?: AvatarStatus | AvatarStatusConfig;
  tooltip?: ReactNode | AvatarTooltipConfig;
  imageConfig?: AvatarImageConfig;
  textClassName?: string;
  textStyle?: CSSProperties;
  statusClassName?: string;
  loading?: boolean;
  onLoad?: () => void;
  onError?: () => void;
  asChild?: boolean;
}

export interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  max?: number;
  size?: AvatarSize;
  shape?: AvatarShape;
  bordered?: boolean | string;
  spacing?: number;
  gap?: number;
  ringColor?: string;
  showTooltip?: boolean;
  total?: number;
  variant?: GroupVariant;
  reverseOrder?: boolean;
  renderSurplus?: (count: number) => ReactNode;
  onAvatarClick?: (index: number, event: React.MouseEvent) => void;
  dir?: Direction;
  asChild?: boolean;
}

export interface AvatarGroupCountProps extends HTMLAttributes<HTMLDivElement> {
  count: number;
  size?: AvatarSize;
  shape?: AvatarShape;
  max?: number;
  showPlus?: boolean;
  format?: (count: number) => string;
  variant?: CountVariant;
  tooltip?: ReactNode | AvatarTooltipConfig;
  bordered?: boolean | string;
  textClassName?: string;
  textStyle?: CSSProperties;
  "aria-live"?: "polite" | "assertive" | "off";
  asChild?: boolean;
  children?: ReactNode;
}

export interface BadgeOffset {
  x?: number;
  y?: number;
}

export interface AvatarBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  count?: number;
  max?: number;
  showZero?: boolean;
  dot?: boolean;
  position?: CornerPosition;
  offset?: BadgeOffset;
  color?: string;
  size?: BadgeSize;
  variant?: BadgeVariant;
  overlap?: BadgeOverlap;
  pulse?: boolean;
  invisible?: boolean;
  "aria-live"?: "polite" | "assertive" | "off";
  asChild?: boolean;
}

export interface AvatarShimmerProps extends HTMLAttributes<HTMLDivElement> {
  size?: AvatarSize;
  shape?: AvatarShape;
  animate?: boolean;
  asChild?: boolean;
}

export interface AvatarGroupShimmerProps extends HTMLAttributes<HTMLDivElement> {
  count?: number;
  size?: AvatarSize;
  shape?: AvatarShape;
  spacing?: number;
  ringColor?: string;
  animate?: boolean;
  showCount?: boolean;
  asChild?: boolean;
}
