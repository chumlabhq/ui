import type { CSSProperties } from "react";

export const isBrowser = typeof window !== "undefined";

export type Direction = "ltr" | "rtl";

export const readDirection = (node?: Element | null): Direction => {
  if (!isBrowser) return "ltr";
  const own = node?.closest("[dir=rtl i],[dir=ltr i]")?.getAttribute("dir");
  const value = own ?? (node?.isConnected ? getComputedStyle(node).direction : document.dir);
  return value?.toLowerCase() === "rtl" ? "rtl" : "ltr";
};

export const isRtl = (node?: Element | null): boolean => readDirection(node) === "rtl";

export const MIRROR_IN_RTL = "rtl:-scale-x-100";

export const MIRROR_IN_LTR = "-scale-x-100 rtl:scale-x-100";

export const INLINE_SIGN = "rtl:[--cl-inline-sign:-1]";

export const inlineSigned = (length: string): string => `calc(var(--cl-inline-sign, 1) * ${length})`;

export const TEXT_DIRECTION_FROM_CONTENT = "[unicode-bidi:plaintext] placeholder:[unicode-bidi:plaintext]";

export type PhysicalSide = "top" | "right" | "bottom" | "left";

const SIDES: readonly PhysicalSide[] = ["top", "right", "bottom", "left"];

export const oppositeSide = (side: PhysicalSide): PhysicalSide => SIDES[(SIDES.indexOf(side) + 2) % 4];

export const readLayoutWidth = (): number => document.documentElement.clientWidth || window.innerWidth;

export const toInlineStart = (left: number, width: number, rtl: boolean, layoutWidth: number): number =>
  rtl ? layoutWidth - left - width : left;

const PRESS_TAKES_FOCUS =
  "a[href],button,input,select,textarea,summary,[tabindex],[contenteditable]";

/**
 * Puts focus back on `trigger` after a mouse press outside its surface.
 *
 * Call it from the press handler that closes the surface. A press on nothing
 * focusable moves focus to `<body>` once the handler returns, so the return runs
 * after that default. A press on a focusable element keeps its focus, a touch is
 * left alone because focusing a field on a tap raises the on-screen keyboard, and
 * a trigger scrolled out of view is left alone because the press must not move the page.
 */
export function returnFocusAfterOutsidePress(
  trigger: HTMLElement | null | undefined,
  event: Event,
): void {
  if (!trigger || event.type !== "mousedown") return;
  const target = event.target;
  if (target instanceof Element && target.closest(PRESS_TAKES_FOCUS)) return;
  setTimeout(() => {
    const doc = trigger.ownerDocument;
    if (!trigger.isConnected) return;
    if (doc.activeElement && doc.activeElement !== doc.body) return;
    const { top, bottom } = trigger.getBoundingClientRect();
    if (bottom < 0 || top > doc.documentElement.clientHeight) return;
    trigger.focus({ preventScroll: true });
    trigger.scrollIntoView({ block: "nearest", inline: "nearest" });
  });
}

let pointerX: number | undefined;
let pointerY: number | undefined;
let pointerTravelled = false;
let pointerTracked = false;

export const trackPointer = (): void => {
  if (pointerTracked || !isBrowser) return;
  pointerTracked = true;
  document.addEventListener(
    "mousemove",
    (event) => {
      pointerTravelled = pointerX === undefined ? event.movementX !== 0 || event.movementY !== 0 : event.clientX !== pointerX || event.clientY !== pointerY;
      pointerX = event.clientX;
      pointerY = event.clientY;
    },
    { capture: true, passive: true },
  );
};

export const pointerMoved = (): boolean => pointerTravelled;

export const TRIGGER_STACK = "grid grid-cols-[minmax(0,1fr)] [&>*]:[grid-area:1/1]";

export const CHIP_LAYER_STYLE: CSSProperties = {
  pointerEvents: "none",
  background: "transparent",
  borderColor: "transparent",
  boxShadow: "none",
};

export const CHIP_REMOVE_STYLE: CSSProperties = { pointerEvents: "auto" };

export const SR_ONLY_STYLE: CSSProperties = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clipPath: "inset(50%)",
  whiteSpace: "nowrap",
  border: 0,
};
