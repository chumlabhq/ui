import { type CSSProperties } from "react";
import type { DrawerSide } from "./types.js";

export { getFocusableElements } from "../../../utils/focusUtils.js";
import { useReducedMotion } from "../../../utils/useReducedMotion.js";

/**
 * Kept as a named export because Drawer's call sites use it, but the
 * implementation now lives in src/utils/useReducedMotion — this file held the
 * only correct copy while two others drifted (AUDIT-GAP §2.5), and one is the
 * right number.
 */
export const usePrefersReducedMotion = useReducedMotion;

export const getSideStyles = (
  side: DrawerSide,
  size: string,
  fraction: number,
  duration: number,
): CSSProperties => {
  const easing = "cubic-bezier(0.32, 0.72, 0, 1)";
  const closedPercent = (1 - fraction) * 100;
  const transition = `transform ${duration}ms ${easing}`;

  switch (side) {
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
  side: DrawerSide,
  deltaX: number,
  deltaY: number,
): number {
  switch (side) {
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
  side: DrawerSide,
  closedPercent: number,
): string {
  switch (side) {
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

export function isHorizontalSide(side: DrawerSide): boolean {
  return side === "left" || side === "right";
}

export function getTouchAction(side: DrawerSide): string {
  return isHorizontalSide(side) ? "pan-y" : "auto";
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

export { acquireScrollLock, releaseScrollLock, resetScrollLock } from "../../../utils/scrollLock.js";
