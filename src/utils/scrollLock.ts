import { isBrowser } from "./isBrowser.js";

let scrollLockCount = 0;
let savedBodyOverflow = "";
let savedPadding = "";
let paddedSide: "paddingLeft" | "paddingRight" = "paddingRight";

const gutterSide = (): "paddingLeft" | "paddingRight" => {
  const probe = document.createElement("div");
  probe.style.cssText = "position:fixed;top:0;left:0;width:0;height:0;visibility:hidden";
  document.body.appendChild(probe);
  const onLeft = probe.getBoundingClientRect().left > 0;
  probe.remove();
  return onLeft ? "paddingLeft" : "paddingRight";
};

// Locks body — not html — because flipping html.style.overflow forces a
// layout/scroll-anchoring recompute on inner overflow:auto containers
// (the docs sidebar's nav, the docs main scroller), causing visible jumps
// when an overlay opens.
export function acquireScrollLock() {
  if (!isBrowser) return;
  if (scrollLockCount === 0) {
    const html = document.documentElement;
    const body = document.body;
    savedBodyOverflow = body.style.overflow;
    const scrollbarWidth = window.innerWidth - html.clientWidth;
    paddedSide = scrollbarWidth > 0 ? gutterSide() : "paddingRight";
    savedPadding = body.style[paddedSide];
    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      body.style[paddedSide] = `${scrollbarWidth}px`;
    }
  }
  scrollLockCount++;
}

export function releaseScrollLock() {
  if (!isBrowser) return;
  scrollLockCount = Math.max(0, scrollLockCount - 1);
  if (scrollLockCount === 0) {
    document.body.style.overflow = savedBodyOverflow;
    document.body.style[paddedSide] = savedPadding;
    savedBodyOverflow = "";
    savedPadding = "";
  }
}

export function resetScrollLock() {
  if (!isBrowser) return;
  scrollLockCount = 0;
  document.body.style.overflow = "";
  document.body.style[paddedSide] = "";
  savedBodyOverflow = "";
  savedPadding = "";
}
