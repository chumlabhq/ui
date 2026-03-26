import type { Ref } from "react";
import { mergeRefs } from "../../../utils/mergeRefs";
import { INTERACTIVE_TAGS, INTERACTIVE_QUERY } from "./constants";

export function mergeTooltipRefs<T>(
  ...refs: (Ref<T> | undefined | null)[]
): ReturnType<typeof mergeRefs<T>> {
  return mergeRefs(...refs.filter((r): r is Ref<T> | undefined => r !== null));
}

// ─── Interactive child detection ────────────────────────────────

export const hasInteractiveChild = (wrapper: HTMLElement): boolean => {
  for (let i = 0; i < wrapper.children.length; i++) {
    const child = wrapper.children[i] as HTMLElement;
    if (INTERACTIVE_TAGS.has(child.tagName.toLowerCase())) return true;
    if (
      child.hasAttribute("tabindex") &&
      child.getAttribute("tabindex") !== "-1"
    )
      return true;
    if (child.querySelector(INTERACTIVE_QUERY)) return true;
  }
  return false;
};

// ─── Position calculation (merged from positionUtils.ts) ────────

export interface Position {
  top: number;
  left: number;
  arrowTop?: number;
  arrowLeft?: number;
  arrowRotation?: number;
  resolvedSide?: "top" | "right" | "bottom" | "left";
}

const OPPOSITE_SIDE: Record<string, "top" | "right" | "bottom" | "left"> = {
  top: "bottom",
  bottom: "top",
  left: "right",
  right: "left",
};

export const computeForSide = (
  triggerRect: DOMRect,
  tooltipRect: DOMRect,
  side: "top" | "right" | "bottom" | "left",
  align: "start" | "center" | "end",
  sideOffset: number,
  alignOffset: number,
): { top: number; left: number; arrowTop?: number; arrowLeft?: number; arrowRotation: number } => {
  let top = 0;
  let left = 0;
  let arrowTop: number | undefined;
  let arrowLeft: number | undefined;
  let arrowRotation = 0;

  switch (side) {
    case "top":
      top = triggerRect.top - tooltipRect.height - sideOffset;
      arrowRotation = 180;
      break;
    case "bottom":
      top = triggerRect.bottom + sideOffset;
      arrowRotation = 0;
      break;
    case "left":
      left = triggerRect.left - tooltipRect.width - sideOffset;
      arrowRotation = 90;
      break;
    case "right":
      left = triggerRect.right + sideOffset;
      arrowRotation = -90;
      break;
  }

  if (side === "top" || side === "bottom") {
    switch (align) {
      case "start":
        left = triggerRect.left + alignOffset;
        break;
      case "center":
        left =
          triggerRect.left +
          (triggerRect.width - tooltipRect.width) / 2 +
          alignOffset;
        break;
      case "end":
        left = triggerRect.right - tooltipRect.width + alignOffset;
        break;
    }
    arrowLeft = triggerRect.left + triggerRect.width / 2 - left;
  }

  if (side === "left" || side === "right") {
    switch (align) {
      case "start":
        top = triggerRect.top + alignOffset;
        break;
      case "center":
        top =
          triggerRect.top +
          (triggerRect.height - tooltipRect.height) / 2 +
          alignOffset;
        break;
      case "end":
        top = triggerRect.bottom - tooltipRect.height + alignOffset;
        break;
    }
    arrowTop = triggerRect.top + triggerRect.height / 2 - top;
  }

  return { top, left, arrowTop, arrowLeft, arrowRotation };
};

export const wouldOverflow = (
  top: number,
  left: number,
  tooltipRect: DOMRect,
  viewportWidth: number,
  viewportHeight: number,
  padding: number,
): boolean => {
  return (
    left < padding ||
    left + tooltipRect.width > viewportWidth - padding ||
    top < padding ||
    top + tooltipRect.height > viewportHeight - padding
  );
};

function getViewportSize(): { width: number; height: number } {
  if (typeof window === "undefined") return { width: 0, height: 0 };
  const vv = window.visualViewport;
  if (vv) return { width: vv.width, height: vv.height };
  return { width: window.innerWidth, height: window.innerHeight };
}

export const calculatePosition = (
  triggerRect: DOMRect,
  tooltipRect: DOMRect,
  side: "top" | "right" | "bottom" | "left",
  align: "start" | "center" | "end",
  sideOffset: number,
  alignOffset: number,
): Position => {
  const { width: viewportWidth, height: viewportHeight } = getViewportSize();
  const padding = 8;

  let result = computeForSide(triggerRect, tooltipRect, side, align, sideOffset, alignOffset);
  let resolvedSide = side;

  if (wouldOverflow(result.top, result.left, tooltipRect, viewportWidth, viewportHeight, padding)) {
    const flipped = OPPOSITE_SIDE[side];
    const flippedResult = computeForSide(triggerRect, tooltipRect, flipped, align, sideOffset, alignOffset);

    if (!wouldOverflow(flippedResult.top, flippedResult.left, tooltipRect, viewportWidth, viewportHeight, padding)) {
      result = flippedResult;
      resolvedSide = flipped;
    }
  }

  let { top, left, arrowTop, arrowLeft } = result;
  const { arrowRotation } = result;

  if (left < padding) {
    const adjustment = padding - left;
    left = padding;
    if (arrowLeft !== undefined) arrowLeft -= adjustment;
  } else if (left + tooltipRect.width > viewportWidth - padding) {
    const adjustment =
      left + tooltipRect.width - (viewportWidth - padding);
    left = viewportWidth - padding - tooltipRect.width;
    if (arrowLeft !== undefined) arrowLeft += adjustment;
  }

  if (top < padding) {
    const adjustment = padding - top;
    top = padding;
    if (arrowTop !== undefined) arrowTop -= adjustment;
  } else if (top + tooltipRect.height > viewportHeight - padding) {
    const adjustment =
      top + tooltipRect.height - (viewportHeight - padding);
    top = viewportHeight - padding - tooltipRect.height;
    if (arrowTop !== undefined) arrowTop += adjustment;
  }

  if (arrowLeft !== undefined) {
    arrowLeft = Math.max(12, Math.min(tooltipRect.width - 12, arrowLeft));
  }
  if (arrowTop !== undefined) {
    arrowTop = Math.max(12, Math.min(tooltipRect.height - 12, arrowTop));
  }

  return { top, left, arrowTop, arrowLeft, arrowRotation, resolvedSide };
};
