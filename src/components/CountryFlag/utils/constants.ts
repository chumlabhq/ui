import type { CountryFlagSize, CountryFlagClasses, CountryFlagGroupClasses } from "./types";

// Opt-in CDN for consumers who would rather serve flags over the network than
// use the packaged SVGs: <CountryFlag basePath={CHUMLAB_FLAG_CDN} />. Not a
// default - by default nothing leaves the app.
export const CHUMLAB_FLAG_CDN = "https://chumflagscdn.s3.ap-south-1.amazonaws.com/flags";

/** @deprecated Renamed to CHUMLAB_FLAG_CDN. No longer the default base path. */
export const DEFAULT_FLAG_BASE_PATH = CHUMLAB_FLAG_CDN;
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
  // Hairline border around the flag so mostly-white or mostly-light flags
  // (e.g. British Indian Ocean Territory, Argentina, Cyprus) don't visually
  // dissolve into a light page background. The token is theme-aware, so
  // the border is barely-visible in dark mode and clearly defined in
  // light mode where the contrast issue actually exists.
  root: "inline-flex items-center justify-center shrink-0 overflow-hidden border border-cl-border",
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
  // Surplus chip — sits next to the flag stack with the same surface +
  // hairline outline as the flag tiles, so the count badge reads as a
  // peer of the flags rather than a stray dark rectangle.
  count:
    "shrink-0 inline-flex items-center justify-center rounded-cl-sm border border-cl-border bg-cl-bg-elevated text-cl-text-secondary text-[10px] font-medium tabular-nums select-none",
};

export const UNSTYLED_COUNTRYFLAG_GROUP_CLASSES: Required<CountryFlagGroupClasses> = {
  root: "",
  item: "",
  count: "",
};
