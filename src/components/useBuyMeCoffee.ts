import { createContext, useContext } from "react";

/**
 * Context + hook pair for the "Buy us a coffee" flow. Lives in its own file
 * so the provider file stays component-only (satisfies React Fast Refresh).
 * The provider is defined in `BuyMeCoffee.tsx` and supplies `{ open }` here.
 */

export interface BuyMeCoffeeContextValue {
  open: () => void;
}

export const BuyMeCoffeeContext =
  createContext<BuyMeCoffeeContextValue | null>(null);

export function useBuyMeCoffee() {
  const ctx = useContext(BuyMeCoffeeContext);
  if (!ctx) {
    throw new Error("useBuyMeCoffee must be used inside <BuyMeCoffeeProvider>");
  }
  return ctx;
}
