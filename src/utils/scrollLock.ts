import { isBrowser } from "./isBrowser";

let scrollLockCount = 0;
let savedHtmlOverflow = "";
let savedBodyOverflow = "";
let savedPaddingRight = "";

export function acquireScrollLock() {
  if (!isBrowser) return;
  if (scrollLockCount === 0) {
    const html = document.documentElement;
    const body = document.body;
    savedHtmlOverflow = html.style.overflow;
    savedBodyOverflow = body.style.overflow;
    savedPaddingRight = body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - html.clientWidth;
    html.style.overflow = "hidden";
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
    document.documentElement.style.overflow = savedHtmlOverflow;
    document.body.style.overflow = savedBodyOverflow;
    document.body.style.paddingRight = savedPaddingRight;
    savedHtmlOverflow = "";
    savedBodyOverflow = "";
    savedPaddingRight = "";
  }
}

export function resetScrollLock() {
  if (!isBrowser) return;
  scrollLockCount = 0;
  document.documentElement.style.overflow = "";
  document.body.style.overflow = "";
  document.body.style.paddingRight = "";
  savedHtmlOverflow = "";
  savedBodyOverflow = "";
  savedPaddingRight = "";
}
