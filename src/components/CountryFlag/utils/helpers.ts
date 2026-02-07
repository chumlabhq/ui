import type { CountryFlagSize, CountryFlagTooltipConfig } from "./types";
import { SIZE_MAP } from "./constants";

export const getPixelSize = (size: CountryFlagSize | number): number => {
  if (typeof size === "number") return size;
  return SIZE_MAP[size];
};

export const isTooltipConfig = (
  tooltip: unknown,
): tooltip is CountryFlagTooltipConfig => {
  return (
    typeof tooltip === "object" &&
    tooltip !== null &&
    !Array.isArray(tooltip) &&
    "content" in tooltip &&
    !("$$typeof" in tooltip)
  );
};
