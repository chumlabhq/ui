export const isBrowser = typeof window !== "undefined";

export type Direction = "ltr" | "rtl";

export const readDirection = (node?: Element | null): Direction => {
  if (!isBrowser) return "ltr";
  const own = node?.closest("[dir=rtl i],[dir=ltr i]")?.getAttribute("dir");
  const value = own ?? (node?.isConnected ? getComputedStyle(node).direction : document.dir);
  return value?.toLowerCase() === "rtl" ? "rtl" : "ltr";
};

export const isRtl = (node?: Element | null): boolean => readDirection(node) === "rtl";
