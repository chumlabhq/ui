import type { CountryFlagSize } from "./types";
import { SIZE_MAP } from "./constants";
export { isTooltipConfig } from "../../../utils/isTooltipConfig";

export const getPixelSize = (size: CountryFlagSize | number): number => {
  if (typeof size === "number") return size;
  return SIZE_MAP[size];
};
