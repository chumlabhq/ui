import type { CSSProperties } from "react";
import type { AvatarSize, AvatarColors, AvatarStatus, CornerPosition, BadgeSize, BadgeOverlap, BadgeOffset } from "./types";
import {
  SIZE_MAP,
  FONT_SIZE_MAP,
  STATUS_SIZE_MAP,
  DEFAULT_BACKGROUND_COLORS,
  DEFAULT_DARK_BACKGROUND_COLORS,
  DEFAULT_BORDER_COLORS,
  DEFAULT_DARK_BORDER_COLORS,
  DEFAULT_TEXT_COLORS,
  DEFAULT_DARK_TEXT_COLORS,
  DEFAULT_STATUS_COLORS,
  SHAPE_RADIUS_MAP,
} from "./constants";

export const getInitials = (name?: string, maxInitials: number = 2): string => {
  if (!name) return "";

  const cleanName = name.trim().toUpperCase();
  if (cleanName.length === 0) return "";

  if (cleanName.includes(" ")) {
    return cleanName
      .split(" ")
      .filter((word) => word.length > 0)
      .map((word) => word[0])
      .join("")
      .slice(0, maxInitials);
  }

  // Single-word name: return just the first letter (industry standard)
  return cleanName[0];
};

export const getNumericSize = (size: AvatarSize): number => {
  if (typeof size === "number") return size;
  return SIZE_MAP[size] ?? SIZE_MAP.md;
};

export const getFontSize = (size: AvatarSize): number => {
  if (typeof size === "number") {
    return Math.max(10, Math.floor(size * 0.35));
  }
  return FONT_SIZE_MAP[size] ?? FONT_SIZE_MAP.md;
};

export const getStatusSize = (size: AvatarSize): number => {
  if (typeof size === "number") {
    return Math.max(8, Math.floor(size * 0.25));
  }
  return STATUS_SIZE_MAP[size] ?? STATUS_SIZE_MAP.md;
};

export const getBorderRadius = (shape: string): string => {
  return SHAPE_RADIUS_MAP[shape] ?? SHAPE_RADIUS_MAP.circle;
};

const hashString = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
};

export const generateColors = (
  name: string | undefined,
  colors?: AvatarColors
): { background: string; border: string; text: string; darkBackground: string; darkBorder: string; darkText: string } => {
  if (!name) {
    return {
      background: DEFAULT_BACKGROUND_COLORS[0],
      border: DEFAULT_BORDER_COLORS[0],
      text: DEFAULT_TEXT_COLORS[0],
      darkBackground: DEFAULT_DARK_BACKGROUND_COLORS[0],
      darkBorder: DEFAULT_DARK_BORDER_COLORS[0],
      darkText: DEFAULT_DARK_TEXT_COLORS[0],
    };
  }

  const backgrounds = colors?.backgrounds?.length
    ? colors.backgrounds
    : DEFAULT_BACKGROUND_COLORS;

  const borders = colors?.borders?.length
    ? colors.borders
    : DEFAULT_BORDER_COLORS;

  const textColors = colors?.text?.length
    ? colors.text
    : DEFAULT_TEXT_COLORS;

  const hash = hashString(name.toLowerCase().trim());

  // Use same index across all arrays for consistent palette mapping
  const index = hash % Math.max(backgrounds.length, borders.length, textColors.length);

  return {
    background: backgrounds[index % backgrounds.length],
    border: borders[index % borders.length],
    text: textColors[index % textColors.length],
    darkBackground: DEFAULT_DARK_BACKGROUND_COLORS[index % DEFAULT_DARK_BACKGROUND_COLORS.length],
    darkBorder: DEFAULT_DARK_BORDER_COLORS[index % DEFAULT_DARK_BORDER_COLORS.length],
    darkText: DEFAULT_DARK_TEXT_COLORS[index % DEFAULT_DARK_TEXT_COLORS.length],
  };
};

export const getStatusColor = (status: AvatarStatus, customColor?: string): string => {
  return customColor ?? DEFAULT_STATUS_COLORS[status];
};

export const getStatusPosition = (
  position: CornerPosition,
  statusSize: number
): CSSProperties => {
  const offset = Math.floor(statusSize * 0.15);
  const positions: Record<CornerPosition, CSSProperties> = {
    "top-right": { top: offset, right: offset },
    "top-left": { top: offset, left: offset },
    "bottom-right": { bottom: offset, right: offset },
    "bottom-left": { bottom: offset, left: offset },
  };
  return positions[position];
};

export const getBadgePosition = (
  position: CornerPosition,
  overlap: BadgeOverlap = "circular",
  offset?: BadgeOffset
): CSSProperties => {
  const baseOffset = overlap === "rectangular" ? "0%" : "14.6%";
  const offsetX = offset?.x ?? 0;
  const offsetY = offset?.y ?? 0;

  const positions: Record<CornerPosition, CSSProperties> = {
    "top-right": {
      top: `calc(${baseOffset} + ${offsetY}px)`,
      right: `calc(${baseOffset} + ${offsetX}px)`,
      transform: "translate(50%, -50%)",
    },
    "top-left": {
      top: `calc(${baseOffset} + ${offsetY}px)`,
      left: `calc(${baseOffset} - ${offsetX}px)`,
      transform: "translate(-50%, -50%)",
    },
    "bottom-right": {
      bottom: `calc(${baseOffset} - ${offsetY}px)`,
      right: `calc(${baseOffset} + ${offsetX}px)`,
      transform: "translate(50%, 50%)",
    },
    "bottom-left": {
      bottom: `calc(${baseOffset} - ${offsetY}px)`,
      left: `calc(${baseOffset} - ${offsetX}px)`,
      transform: "translate(-50%, 50%)",
    },
  };
  return positions[position];
};

export const getBadgeSizeClasses = (
  size: BadgeSize | undefined,
  dot: boolean
): { minWidth: string; height: string; fontSize?: string; lineHeight?: number } => {
  if (dot) {
    const dotSizes: Record<BadgeSize, { size: string }> = {
      xs: { size: "6px" },
      sm: { size: "8px" },
      md: { size: "10px" },
      lg: { size: "12px" },
    };
    const s = dotSizes[size || "md"];
    return { minWidth: s.size, height: s.size };
  }

  // Badge dimensions plus an explicit fontSize so the count inside the
  // bubble doesn't inherit the parent Avatar's larger initial font size.
  // The font scales roughly to 0.55 × badge height.
  const countSizes: Record<
    BadgeSize,
    { minWidth: string; height: string; fontSize: string }
  > = {
    xs: { minWidth: "14px", height: "14px", fontSize: "8px" },
    sm: { minWidth: "18px", height: "18px", fontSize: "10px" },
    md: { minWidth: "20px", height: "20px", fontSize: "11px" },
    lg: { minWidth: "24px", height: "24px", fontSize: "12px" },
  };
  const s = countSizes[size || "md"];
  return { minWidth: s.minWidth, height: s.height, fontSize: s.fontSize, lineHeight: 1 };
};

export const parseBorder = (
  bordered: boolean | string | undefined,
  generatedBorderColor?: string
): string | undefined => {
  if (!bordered) return undefined;
  if (typeof bordered === "string") return bordered;
  return `2px solid ${generatedBorderColor || "white"}`;
};
