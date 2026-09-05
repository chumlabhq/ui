// AI Knowledge: See AVATAR.ai.md in this directory for full usage guide, props, styling, and patterns.

export { Avatar } from "./Avatar.js";
export { AvatarGroup } from "./components/AvatarGroup.js";
export { AvatarGroupCount } from "./components/AvatarGroupCount.js";
export { AvatarBadge } from "./components/AvatarBadge.js";
export { AvatarShimmer, AvatarGroupShimmer } from "./components/AvatarShimmer.js";
export { useAvatarGroupContext } from "./utils/context.js";
export { DEFAULT_AVATAR_CLASSES, UNSTYLED_AVATAR_CLASSES } from "./utils/constants.js";
export type { AvatarGroupContextValue } from "./utils/context.js";
export type {
  AvatarProps,
  AvatarGroupProps,
  AvatarGroupCountProps,
  AvatarBadgeProps,
  AvatarShimmerProps,
  AvatarGroupShimmerProps,
  AvatarTooltipConfig,
  AvatarStatusConfig,
  AvatarImageConfig,
  AvatarColors,
  AvatarClasses,
  AvatarGroupClasses,
  BadgeOffset,
  TooltipSide,
  TooltipAlign,
  AvatarShape,
  AvatarSize,
  AvatarStatus,
  Direction,
  CornerPosition,
  BadgeSize,
  BadgeVariant,
  BadgeOverlap,
  CountVariant,
  GroupVariant,
} from "./utils/types.js";
