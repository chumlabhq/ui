import { createContext, useContext } from "react";
import type { CountryFlagSize } from "./types";

export interface CountryFlagGroupContextValue {
  itemClassName?: string;
  size?: CountryFlagSize | number;
}

export const CountryFlagGroupContext =
  createContext<CountryFlagGroupContextValue | null>(null);

export function useCountryFlagGroupContext(): CountryFlagGroupContextValue | null {
  return useContext(CountryFlagGroupContext);
}
