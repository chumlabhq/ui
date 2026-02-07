import { createContext, useContext } from "react";

export interface CountryFlagGroupContextValue {
  itemClassName?: string;
}

export const CountryFlagGroupContext =
  createContext<CountryFlagGroupContextValue | null>(null);

export function useCountryFlagGroupContext(): CountryFlagGroupContextValue | null {
  return useContext(CountryFlagGroupContext);
}
