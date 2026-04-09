import type { AvatarSize, AvatarStatus, AvatarClasses } from "./types";

export const DEFAULT_SIZE: AvatarSize = "md";
export const DEFAULT_SHAPE = "circle" as const;
export const DEFAULT_SPACING = -8;

export const DEFAULT_AVATAR_CLASSES: Required<AvatarClasses> = {
  root: "shrink-0 flex items-center justify-center font-medium select-none",
  inner: "absolute inset-0 overflow-hidden flex items-center justify-center",
  image: "w-full h-full object-cover",
  initials: "",
  fallback: "",
  status: "absolute block rounded-full",
};

export const UNSTYLED_AVATAR_CLASSES: Required<AvatarClasses> = {
  root: "",
  inner: "",
  image: "",
  initials: "",
  fallback: "",
  status: "",
};

export const SIZE_MAP: Record<Exclude<AvatarSize, number>, number> = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
};

export const FONT_SIZE_MAP: Record<Exclude<AvatarSize, number>, number> = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 20,
};

export const STATUS_SIZE_MAP: Record<Exclude<AvatarSize, number>, number> = {
  xs: 8,
  sm: 10,
  md: 12,
  lg: 14,
  xl: 16,
};

export const SHAPE_RADIUS_MAP: Record<string, string> = {
  circle: "9999px",
  square: "0px",
  rounded: "6px",
};

export const DEFAULT_STATUS_COLORS: Record<AvatarStatus, string> = {
  online: "#22c55e",
  offline: "#9ca3af",
  away: "#f59e0b",
  busy: "#ef4444",
};

export const DEFAULT_BACKGROUND_COLORS = [
  "#e0e7ff",
  "#ede9fe",
  "#cffafe",
  "#d1fae5",
  "#fef3c7",
  "#fee2e2",
  "#fce7f3",
  "#e0e7ff",
  "#ccfbf1",
  "#ffedd5",
  "#ecfccb",
  "#e0f2fe",
];

export const DEFAULT_DARK_BACKGROUND_COLORS = [
  "#312e81",
  "#3b0764",
  "#164e63",
  "#064e3b",
  "#713f12",
  "#7f1d1d",
  "#831843",
  "#312e81",
  "#134e4a",
  "#7c2d12",
  "#365314",
  "#0c4a6e",
];

export const DEFAULT_BORDER_COLORS = [
  "#a5b4fc",
  "#c4b5fd",
  "#67e8f9",
  "#6ee7b7",
  "#fcd34d",
  "#fca5a5",
  "#f9a8d4",
  "#a5b4fc",
  "#5eead4",
  "#fdba74",
  "#bef264",
  "#7dd3fc",
];

export const DEFAULT_DARK_BORDER_COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#22d3ee",
  "#34d399",
  "#fbbf24",
  "#f87171",
  "#f472b6",
  "#6366f1",
  "#2dd4bf",
  "#fb923c",
  "#a3e635",
  "#38bdf8",
];

export const DEFAULT_TEXT_COLORS = [
  "#4f46e5",
  "#7c3aed",
  "#0891b2",
  "#059669",
  "#ca8a04",
  "#dc2626",
  "#db2777",
  "#4f46e5",
  "#0d9488",
  "#ea580c",
  "#65a30d",
  "#0284c7",
];

export const DEFAULT_DARK_TEXT_COLORS = [
  "#a5b4fc",
  "#c4b5fd",
  "#67e8f9",
  "#6ee7b7",
  "#fcd34d",
  "#fca5a5",
  "#f9a8d4",
  "#a5b4fc",
  "#5eead4",
  "#fdba74",
  "#bef264",
  "#7dd3fc",
];
