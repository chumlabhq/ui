import { type CSSProperties, useState, useEffect } from "react";
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

export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
}

export function usePrefersReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mql.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return prefersReduced;
}

export const getDirectionStyles = (
  direction: DrawerDirection,
  size: string,
  fraction: number,
  duration: number,
): CSSProperties => {
  const baseTransition = `transform ${duration}ms cubic-bezier(0.32, 0.72, 0, 1)`;
  const closedPercent = (1 - fraction) * 100;

  const styles: Record<DrawerDirection, CSSProperties> = {
    left: {
      top: 0,
      left: 0,
      height: "100dvh",
      width: size,
      transform: `translateX(${-closedPercent}%)`,
      transition: baseTransition,
    },
    right: {
      top: 0,
      right: 0,
      height: "100dvh",
      width: size,
      transform: `translateX(${closedPercent}%)`,
      transition: baseTransition,
    },
    top: {
      top: 0,
      left: 0,
      width: "100vw",
      height: size,
      transform: `translateY(${-closedPercent}%)`,
      transition: baseTransition,
    },
    bottom: {
      bottom: 0,
      left: 0,
      width: "100vw",
      height: size,
      transform: `translateY(${closedPercent}%)`,
      transition: baseTransition,
    },
  };

  return styles[direction];
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
