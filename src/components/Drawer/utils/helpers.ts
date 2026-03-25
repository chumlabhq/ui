import { type CSSProperties, useSyncExternalStore } from "react";
import type { DrawerDirection } from "./types";

const FOCUSABLE_SELECTOR = [
  'a[href]:not([tabindex="-1"])',
  'button:not([disabled]):not([tabindex="-1"])',
  'input:not([disabled]):not([tabindex="-1"])',
  'select:not([disabled]):not([tabindex="-1"])',
  'textarea:not([disabled]):not([tabindex="-1"])',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable]:not([tabindex="-1"])',
].join(",");

function isVisible(el: HTMLElement): boolean {
  if (el.closest("[hidden], [inert], [aria-hidden='true']")) return false;
  try {
    const computed = getComputedStyle(el);
    return computed.display !== "none" && computed.visibility !== "hidden";
  } catch {
    return el.style.display !== "none" && el.style.visibility !== "hidden";
  }
}

export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
  ).filter(isVisible);
}

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(callback: () => void): () => void {
  const mql = window.matchMedia(REDUCED_MOTION_QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getReducedMotionSnapshot(): boolean {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribeReducedMotion, getReducedMotionSnapshot, () => false);
}

export const getDirectionStyles = (
  direction: DrawerDirection,
  size: string,
  fraction: number,
  duration: number,
): CSSProperties => {
  const easing = "cubic-bezier(0.32, 0.72, 0, 1)";
  const closedPercent = (1 - fraction) * 100;
  const transition = `transform ${duration}ms ${easing}`;

  switch (direction) {
    case "left":
      return { top: 0, left: 0, height: "100vh", width: size, transform: `translateX(${-closedPercent}%)`, transition };
    case "right":
      return { top: 0, right: 0, height: "100vh", width: size, transform: `translateX(${closedPercent}%)`, transition };
    case "top":
      return { top: 0, left: 0, width: "100vw", height: size, transform: `translateY(${-closedPercent}%)`, transition };
    case "bottom":
      return { bottom: 0, left: 0, width: "100vw", height: size, transform: `translateY(${closedPercent}%)`, transition };
  }
};

export function getClosingDelta(
  direction: DrawerDirection,
  deltaX: number,
  deltaY: number,
): number {
  switch (direction) {
    case "bottom":
      return deltaY;
    case "top":
      return -deltaY;
    case "left":
      return -deltaX;
    case "right":
      return deltaX;
  }
}

export function getTransformString(
  direction: DrawerDirection,
  closedPercent: number,
): string {
  switch (direction) {
    case "left":
      return `translateX(${-closedPercent}%)`;
    case "right":
      return `translateX(${closedPercent}%)`;
    case "top":
      return `translateY(${-closedPercent}%)`;
    case "bottom":
      return `translateY(${closedPercent}%)`;
  }
}

export function isHorizontalDirection(direction: DrawerDirection): boolean {
  return direction === "left" || direction === "right";
}

export function getTouchAction(direction: DrawerDirection): string {
  return isHorizontalDirection(direction) ? "pan-y" : "pan-x";
}

const drawerStack: string[] = [];

export function pushDrawer(id: string) {
  const idx = drawerStack.indexOf(id);
  if (idx !== -1) drawerStack.splice(idx, 1);
  drawerStack.push(id);
}

export function popDrawer(id: string) {
  const idx = drawerStack.indexOf(id);
  if (idx !== -1) drawerStack.splice(idx, 1);
}

export function isTopDrawer(id: string): boolean {
  return drawerStack.length > 0 && drawerStack[drawerStack.length - 1] === id;
}

let scrollLockCount = 0;
let savedHtmlOverflow = "";
let savedBodyOverflow = "";
let savedPaddingRight = "";

export function acquireScrollLock() {
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
  scrollLockCount = 0;
  document.documentElement.style.overflow = "";
  document.body.style.overflow = "";
  document.body.style.paddingRight = "";
  savedHtmlOverflow = "";
  savedBodyOverflow = "";
  savedPaddingRight = "";
}
