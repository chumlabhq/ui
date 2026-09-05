import type { CountryFlagSize } from "./types.js";
import { SIZE_MAP } from "./constants.js";
export { isTooltipConfig } from "../../../utils/isTooltipConfig.js";

export const getPixelSize = (size: CountryFlagSize | number): number => {
  if (typeof size === "number") return size;
  return SIZE_MAP[size];
};
