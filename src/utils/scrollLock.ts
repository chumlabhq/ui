import { isBrowser } from "./isBrowser";

let scrollLockCount = 0;
let savedBodyOverflow = "";
let savedPaddingRight = "";

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
    savedPaddingRight = body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - html.clientWidth;
    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }
  }
  scrollLockCount++;
}

export function releaseScrollLock() {
  if (!isBrowser) return;
  scrollLockCount = Math.max(0, scrollLockCount - 1);
  if (scrollLockCount === 0) {
    document.body.style.overflow = savedBodyOverflow;
    document.body.style.paddingRight = savedPaddingRight;
    savedBodyOverflow = "";
    savedPaddingRight = "";
  }
}

export function resetScrollLock() {
  if (!isBrowser) return;
  scrollLockCount = 0;
  document.body.style.overflow = "";
  document.body.style.paddingRight = "";
  savedBodyOverflow = "";
  savedPaddingRight = "";
}
