import type { Ref } from "react";
import { mergeRefs } from "../../../utils/mergeRefs.js";
import { INTERACTIVE_TAGS, INTERACTIVE_QUERY } from "./constants.js";
import { isBrowser, oppositeSide, readLayoutWidth, toInlineStart } from "../../../utils/isBrowser.js";

export function mergeTooltipRefs<T>(
  ...refs: (Ref<T> | undefined | null)[]
): ReturnType<typeof mergeRefs<T>> {
  return mergeRefs(...refs.filter((r): r is Ref<T> | undefined => r !== null));
}

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

export interface Position {
  top: number;
  inlineStart: number;
  arrowTop?: number;
  arrowLeft?: number;
  arrowRotation?: number;
  resolvedSide?: "top" | "right" | "bottom" | "left";
}

export const computeForSide = (
  triggerRect: DOMRect,
  tooltipRect: DOMRect,
  side: "top" | "right" | "bottom" | "left",
  align: "start" | "center" | "end",
  sideOffset: number,
  alignOffset: number,
  rtl = false,
): { top: number; x: number; arrowTop?: number; arrowLeft?: number; arrowRotation: number } => {
  let top = 0;
  let x = 0;
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
      x = triggerRect.left - tooltipRect.width - sideOffset;
      arrowRotation = 90;
      break;
    case "right":
      x = triggerRect.right + sideOffset;
      arrowRotation = -90;
      break;
  }

  if (side === "top" || side === "bottom") {
    const offset = rtl ? -alignOffset : alignOffset;
    const startX = rtl ? triggerRect.right - tooltipRect.width : triggerRect.left;
    const endX = rtl ? triggerRect.left : triggerRect.right - tooltipRect.width;
    switch (align) {
      case "start":
        x = startX + offset;
        break;
      case "center":
        x =
          triggerRect.left +
          (triggerRect.width - tooltipRect.width) / 2 +
          offset;
        break;
      case "end":
        x = endX + offset;
        break;
    }
    arrowLeft = triggerRect.left + triggerRect.width / 2 - x;
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

  return { top, x, arrowTop, arrowLeft, arrowRotation };
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

function getViewportSize(): { width: number; height: number; layoutWidth: number } {
  if (!isBrowser) return { width: 0, height: 0, layoutWidth: 0 };
  const vv = window.visualViewport;
  const layoutWidth = readLayoutWidth();
  if (vv) return { width: vv.width, height: vv.height, layoutWidth };
  return { width: window.innerWidth, height: window.innerHeight, layoutWidth };
}

export const calculatePosition = (
  triggerRect: DOMRect,
  tooltipRect: DOMRect,
  side: "top" | "right" | "bottom" | "left",
  align: "start" | "center" | "end",
  sideOffset: number,
  alignOffset: number,
  rtl = false,
  surfaceRtl = rtl,
): Position => {
  const { width: viewportWidth, height: viewportHeight, layoutWidth } = getViewportSize();
  const padding = 8;

  let result = computeForSide(triggerRect, tooltipRect, side, align, sideOffset, alignOffset, rtl);
  let resolvedSide = side;

  if (wouldOverflow(result.top, result.x, tooltipRect, viewportWidth, viewportHeight, padding)) {
    const flipped = oppositeSide(side);
    const flippedResult = computeForSide(triggerRect, tooltipRect, flipped, align, sideOffset, alignOffset, rtl);

    if (!wouldOverflow(flippedResult.top, flippedResult.x, tooltipRect, viewportWidth, viewportHeight, padding)) {
      result = flippedResult;
      resolvedSide = flipped;
    }
  }

  let { top, x, arrowTop, arrowLeft } = result;
  const { arrowRotation } = result;

  if (x < padding) {
    const adjustment = padding - x;
    x = padding;
    if (arrowLeft !== undefined) arrowLeft -= adjustment;
  } else if (x + tooltipRect.width > viewportWidth - padding) {
    const adjustment =
      x + tooltipRect.width - (viewportWidth - padding);
    x = viewportWidth - padding - tooltipRect.width;
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

  return { top, inlineStart: toInlineStart(x, tooltipRect.width, surfaceRtl, layoutWidth), arrowTop, arrowLeft, arrowRotation, resolvedSide };
};
