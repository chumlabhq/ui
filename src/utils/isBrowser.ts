export const isBrowser = typeof window !== "undefined";

export type Direction = "ltr" | "rtl";

export const readDirection = (node?: Element | null): Direction => {
  if (!isBrowser) return "ltr";
  const own = node?.closest("[dir=rtl i],[dir=ltr i]")?.getAttribute("dir");
  const value = own ?? (node?.isConnected ? getComputedStyle(node).direction : document.dir);
  return value?.toLowerCase() === "rtl" ? "rtl" : "ltr";
};

export const isRtl = (node?: Element | null): boolean => readDirection(node) === "rtl";

export type PhysicalSide = "top" | "right" | "bottom" | "left";

const SIDES: readonly PhysicalSide[] = ["top", "right", "bottom", "left"];

export const oppositeSide = (side: PhysicalSide): PhysicalSide => SIDES[(SIDES.indexOf(side) + 2) % 4];

export const readLayoutWidth = (): number => document.documentElement.clientWidth || window.innerWidth;

export const toInlineStart = (left: number, width: number, rtl: boolean, layoutWidth: number): number =>
  rtl ? layoutWidth - left - width : left;
