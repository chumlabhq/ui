import type { CountryFlagSize, CountryFlagClasses, CountryFlagGroupClasses } from "./types";

export const DEFAULT_FLAG_BASE_PATH = "/flags";
export const DEFAULT_ASPECT_RATIO = 0.75;

export const SIZE_MAP: Record<CountryFlagSize, number> = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  "2xl": 40,
};

export const DEFAULT_COUNTRYFLAG_CLASSES: Required<CountryFlagClasses> = {
  root: "inline-flex items-center justify-center shrink-0 overflow-hidden",
  image: "w-full h-full object-cover",
  fallback: "",
};

export const UNSTYLED_COUNTRYFLAG_CLASSES: Required<CountryFlagClasses> = {
  root: "",
  image: "",
  fallback: "",
};

export const DEFAULT_COUNTRYFLAG_GROUP_CLASSES: Required<CountryFlagGroupClasses> = {
  root: "flex items-center -space-x-1.5",
  item: "",
  count: "shrink-0 flex items-center justify-center rounded-sm text-[11px] font-semibold bg-gray-100 text-gray-500 select-none",
};

export const UNSTYLED_COUNTRYFLAG_GROUP_CLASSES: Required<CountryFlagGroupClasses> = {
  root: "",
  item: "",
  count: "",
};
