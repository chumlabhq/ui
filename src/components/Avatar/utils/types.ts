import type { ReactNode, HTMLAttributes, ImgHTMLAttributes, CSSProperties } from "react";

export type TooltipSide = "top" | "right" | "bottom" | "left";
export type TooltipAlign = "start" | "center" | "end";

/** Visual shape of the avatar container. */
export type AvatarShape = "circle" | "square" | "rounded";

/** Preset or numeric pixel size for the avatar. */
export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | number;

/** Online presence status indicator. */
export type AvatarStatus = "online" | "offline" | "away" | "busy";

/** Text direction for RTL-aware layouts. */
export type Direction = "ltr" | "rtl";

/** Corner placement for status indicators and badges. */
export type CornerPosition = "top-right" | "top-left" | "bottom-right" | "bottom-left";

/** Preset sizes for badge elements. */
export type BadgeSize = "xs" | "sm" | "md" | "lg";

/** Visual style variant for badges. */
export type BadgeVariant = "solid" | "outline" | "soft";

/** Shape of the element the badge overlaps. */
export type BadgeOverlap = "rectangular" | "circular";

/** Visual style variant for the surplus count indicator. */
export type CountVariant = "solid" | "outline" | "ghost";

/** Layout mode for grouped avatars. */
export type GroupVariant = "stack" | "grid" | "inline";

/** CSS class overrides for avatar sub-elements. */
export interface AvatarClasses {
  /** Root container. */
  root?: string;
  /** Inner wrapper around image/initials/fallback. */
  inner?: string;
  /** The `<img>` element. */
  image?: string;
  /** Initials text element. */
  initials?: string;
  /** Fallback content wrapper. */
  fallback?: string;
  /** Status indicator dot. */
  status?: string;
}

/** CSS class overrides for AvatarGroup sub-elements. */
export interface AvatarGroupClasses {
  /** Group container. */
  root?: string;
  /** Individual avatar wrapper within the group. */
  item?: string;
  /** Surplus count indicator. */
  surplus?: string;
}

/** Custom color palettes for auto-colored avatars. */
export interface AvatarColors {
  /** Background color pool. */
  backgrounds?: string[];
  /** Border color pool. */
  borders?: string[];
  /** Text color pool. */
  text?: string[];
}

/** Full configuration object for avatar tooltips. */
export interface AvatarTooltipConfig {
  /** Tooltip content. */
  content: ReactNode;
  /** Side on which the tooltip appears. */
  side?: TooltipSide;
  /** Alignment along the tooltip side. */
  align?: TooltipAlign;
  /** Pixel offset from the avatar edge. */
  sideOffset?: number;
  /** Delay in ms before the tooltip appears. */
  delayDuration?: number;
  /** Custom CSS class for the tooltip. */
  className?: string;
  /** Whether to show a directional arrow. */
  showArrow?: boolean;
}

/** Full configuration object for avatar status indicators. */
export interface AvatarStatusConfig {
  /** Status type (online, offline, away, busy). */
  type: AvatarStatus;
  /** Corner position for the indicator. */
  position?: CornerPosition;
  /** Custom CSS class for the indicator. */
  className?: string;
  /** Custom color override for the indicator dot. */
  color?: string;
}

/** Advanced image loading configuration. */
export interface AvatarImageConfig {
  /** Responsive image source set. */
  srcSet?: string;
  /** Responsive image sizes descriptor. */
  sizes?: string;
  /** Image loading strategy (`"lazy"` or `"eager"`). */
  loading?: ImgHTMLAttributes<HTMLImageElement>["loading"];
  /** Image decoding hint. */
  decoding?: ImgHTMLAttributes<HTMLImageElement>["decoding"];
  /** CORS attribute for the image request. */
  crossOrigin?: ImgHTMLAttributes<HTMLImageElement>["crossOrigin"];
  /** Referrer policy for the image request. */
  referrerPolicy?: ImgHTMLAttributes<HTMLImageElement>["referrerPolicy"];
  /** Fetch priority hint. */
  fetchPriority?: "high" | "low" | "auto";
  /** Custom CSS class for the `<img>` element. */
  className?: string;
}

export interface AvatarProps extends Omit<HTMLAttributes<HTMLDivElement>, "onLoad" | "onError"> {
  /** User's display name, used for initials and accessible labels. */
  name?: string;
  /** Image URL for the avatar. Falls back to initials, then fallback content. */
  src?: string;
  /** Alt text for the avatar image. */
  alt?: string;
  /** Avatar size as a preset or numeric pixel value. Default: `"md"`. */
  size?: AvatarSize;
  /** Visual shape of the avatar. Default: `"circle"`. */
  shape?: AvatarShape;
  /** Maximum number of initials to show. Default: `2`. */
  maxInitials?: number;
  /** Custom fallback content when no image or name is available. */
  fallback?: ReactNode;
  /** Generates a deterministic background color from the name. */
  autoColor?: boolean;
  /** Custom color palettes for auto-colored mode. */
  colors?: AvatarColors;
  /** Adds a border ring. Pass `true` for the default color or a CSS color string. */
  bordered?: boolean | string;
  /** Presence status indicator. Pass a string for defaults or a config object. */
  status?: AvatarStatus | AvatarStatusConfig;
  /** Tooltip shown on hover. Pass a string/ReactNode for defaults or a config object. */
  tooltip?: ReactNode | AvatarTooltipConfig;
  /** Advanced image element configuration (srcSet, loading, decoding, CORS). */
  imageConfig?: AvatarImageConfig;
  /** CSS class overrides for avatar sub-elements. */
  classes?: AvatarClasses;
  /** Removes all default styling. */
  unstyled?: boolean;
  /** Inline styles for the initials text. */
  textStyle?: CSSProperties;
  /** Shows a loading shimmer placeholder. */
  loading?: boolean;
  /** Controls motion preferences. `"auto"` respects the user's OS setting. */
  reduceMotion?: boolean | "auto";
  /** Fires when the avatar image finishes loading. */
  onLoad?: () => void;
  /** Fires when the avatar image fails to load. */
  onError?: () => void;
  /** Merges avatar props onto the child element via Slot. */
  asChild?: boolean;
}

/** Props for the AvatarGroup container. */
export interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Avatar elements to group. */
  children?: ReactNode;
  /** Maximum visible avatars before showing a surplus count. */
  max?: number;
  /** Default size for all avatars in the group. */
  size?: AvatarSize;
  /** Default shape for all avatars in the group. */
  shape?: AvatarShape;
  /** Adds border rings to all avatars. */
  bordered?: boolean | string;
  /** Overlap spacing in pixels (negative for overlap). */
  spacing?: number;
  /** Border ring color for overlapping avatars. */
  ringColor?: string;
  /** Shows a tooltip with the avatar's name on hover. */
  showTooltip?: boolean;
  /** Total count for surplus calculation (when not all items are rendered). */
  total?: number;
  /** Layout variant: stacked overlap, grid, or inline. Default: `"stack"`. */
  variant?: GroupVariant;
  /** Reverses the visual stacking order. */
  reverseOrder?: boolean;
  /** Custom render function for the surplus count indicator. */
  renderSurplus?: (count: number) => ReactNode;
  /** Click handler for individual avatars within the group. */
  onAvatarClick?: (info: { index: number; name?: string }, event: React.MouseEvent) => void;
  /** Text direction for RTL-aware layouts. */
  dir?: Direction;
  /** CSS class overrides for group sub-elements. */
  classes?: AvatarGroupClasses;
  /** Merges group props onto the child element via Slot. */
  asChild?: boolean;
}

/** Props for the standalone surplus count indicator. */
export interface AvatarGroupCountProps extends HTMLAttributes<HTMLDivElement> {
  /** Number of additional (hidden) avatars. */
  count: number;
  /** Size matching the group's avatar size. */
  size?: AvatarSize;
  /** Shape matching the group's avatar shape. */
  shape?: AvatarShape;
  /** Maximum count before showing `max+`. */
  max?: number;
  /** Whether to show a `+` prefix. Default: `true`. */
  showPlus?: boolean;
  /** Custom format function for the count display. */
  format?: (count: number) => string;
  /** Visual style variant. */
  variant?: CountVariant;
  /** Tooltip shown on hover. */
  tooltip?: ReactNode | AvatarTooltipConfig;
  /** Adds a border ring. */
  bordered?: boolean | string;
  /** CSS class for the count text. */
  textClassName?: string;
  /** Inline styles for the count text. */
  textStyle?: CSSProperties;
  /** ARIA live region behavior for screen readers. */
  "aria-live"?: "polite" | "assertive" | "off";
  /** Merges count props onto the child element via Slot. */
  asChild?: boolean;
  /** Custom content replacing the default count display. */
  children?: ReactNode;
}

/** Pixel offset for badge positioning. */
export interface BadgeOffset {
  /** Horizontal offset in pixels. */
  x?: number;
  /** Vertical offset in pixels. */
  y?: number;
}

/** Props for notification badges overlaying avatars. */
export interface AvatarBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Notification count displayed in the badge. */
  count?: number;
  /** Maximum count before showing `max+`. */
  max?: number;
  /** Shows the badge even when count is zero. Default: `false`. */
  showZero?: boolean;
  /** Renders a small dot instead of a count. */
  dot?: boolean;
  /** Corner position for the badge. Default: `"top-right"`. */
  position?: CornerPosition;
  /** Pixel offset from the default corner position. */
  offset?: BadgeOffset;
  /** Background color of the badge. */
  color?: string;
  /** Badge size preset. Default: `"sm"`. */
  size?: BadgeSize;
  /** Visual style variant. Default: `"solid"`. */
  variant?: BadgeVariant;
  /** Shape of the element the badge overlaps. */
  overlap?: BadgeOverlap;
  /** Adds a pulsing animation to the badge. */
  pulse?: boolean;
  /** Hides the badge while preserving its DOM presence. */
  invisible?: boolean;
  /** ARIA live region behavior for screen readers. */
  "aria-live"?: "polite" | "assertive" | "off";
  /** Merges badge props onto the child element via Slot. */
  asChild?: boolean;
}

/** Props for the avatar loading placeholder. */
export interface AvatarShimmerProps extends HTMLAttributes<HTMLDivElement> {
  /** Shimmer size matching the avatar size. */
  size?: AvatarSize;
  /** Shimmer shape matching the avatar shape. */
  shape?: AvatarShape;
  /** Enables the shimmer animation. Default: `true`. */
  animate?: boolean;
  /** Controls motion preferences. `"auto"` respects the user's OS setting. */
  reduceMotion?: boolean | "auto";
  /** Merges shimmer props onto the child element via Slot. */
  asChild?: boolean;
}

/** Props for the avatar group loading placeholder. */
export interface AvatarGroupShimmerProps extends HTMLAttributes<HTMLDivElement> {
  /** Number of shimmer placeholders to render. Default: `3`. */
  count?: number;
  /** Shimmer size matching the group's avatar size. */
  size?: AvatarSize;
  /** Shimmer shape matching the group's avatar shape. */
  shape?: AvatarShape;
  /** Overlap spacing in pixels. */
  spacing?: number;
  /** Border ring color. */
  ringColor?: string;
  /** Enables the shimmer animation. Default: `true`. */
  animate?: boolean;
  /** Shows a shimmer placeholder for the surplus count. */
  showCount?: boolean;
  /** Controls motion preferences. `"auto"` respects the user's OS setting. */
  reduceMotion?: boolean | "auto";
  /** Merges shimmer props onto the child element via Slot. */
  asChild?: boolean;
}
