import type { CountryFlagSize } from "./types";

export const DEFAULT_FLAG_BASE_PATH = "/flags";
export const DEFAULT_ASPECT_RATIO = 0.75;
export const DEFAULT_SHIMMER_CLASS_NAME = "bg-gray-200 dark:bg-gray-700";

export const SIZE_MAP: Record<CountryFlagSize, number> = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  "2xl": 40,
};
