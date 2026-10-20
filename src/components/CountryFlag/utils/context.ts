import { createContext, useContext } from "react";
import type { CountryFlagShimmerProps, CountryFlagSize } from "./types.js";

/**
 * What `CountryFlagGroup` imposes on the flags inside it, so a row cannot end up with mismatched sizes.
 */
export interface CountryFlagGroupContextValue extends Pick<CountryFlagShimmerProps, "unstyled"> {
  /** The group's per-flag classes, applied by each child rather than by the row. */
  itemClassName?: string;
  /** The size the group imposes, so the flags in a row cannot disagree. */
  size?: CountryFlagSize | number;
}

export const CountryFlagGroupContext =
  createContext<CountryFlagGroupContextValue | null>(null);

export function useCountryFlagGroupContext(): CountryFlagGroupContextValue | null {
  return useContext(CountryFlagGroupContext);
}
