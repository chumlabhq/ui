import { isBrowser } from "./isBrowser.js";

export type AnchoredSide = "top" | "bottom" | "left" | "right";

/** A rectangle, as `getBoundingClientRect` reports one. */
export interface AnchoredRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface AnchoredViewport {
  width: number;
  height: number;
  /**
   * `visualViewport` offsets. Non-zero when the visual viewport is displaced
   * from the layout viewport — pinch-zoom, and the iOS keyboard, which slides
   * the visual viewport up while `getBoundingClientRect` keeps reporting layout
   * coordinates. Every copy of the positioning code read `visualViewport.width`
   * and `height` and none read the offsets, so a menu opened with the keyboard
   * up was placed against a viewport that had moved.
   */
  offsetTop: number;
  offsetLeft: number;
}

export interface AnchoredPositionOptions {
  /** Preferred side. Flips to the opposite side when that side cannot hold it. */
  side?: AnchoredSide;
  /** Distance between trigger and floating element. */
  gap?: number;
  /** Smallest distance kept between the floating element and a viewport edge. */
  margin?: number;
  /** Pins the side, disabling the flip. */
  forceSide?: boolean;
  /**
   * Skips the cross-axis clamp while the trigger is outside the viewport.
   *
   * Carried over from DatePicker, which is the only copy that had it: clamping
   * against an off-screen trigger detaches the floating element and parks it at
   * the viewport edge, so a picker scrolled far down the page reappears pinned
   * near the top over unrelated content.
   */
  clampOnlyWhenTriggerVisible?: boolean;
}

export interface AnchoredPosition {
  top: number;
  left: number;
  /** The trigger's width, for callers that size the floating element to it. */
  width: number;
  /** The side actually used, after any flip. */
  side: AnchoredSide;
}

const OPPOSITE: Record<AnchoredSide, AnchoredSide> = {
  top: "bottom",
  bottom: "top",
  left: "right",
  right: "left",
};

/** Reads the viewport, including the offsets no existing copy read. */
export function readViewport(): AnchoredViewport {
  if (!isBrowser) {
    // The SSR fallback three of the nine copies already used. The numbers are
    // arbitrary but must be finite: they only decide whether a flip happens on
    // a server render that is corrected on the first client measurement.
    return { width: 1024, height: 768, offsetTop: 0, offsetLeft: 0 };
  }
  const vv = window.visualViewport;
  return {
    width: vv?.width ?? window.innerWidth,
    height: vv?.height ?? window.innerHeight,
    offsetTop: vv?.offsetTop ?? 0,
    offsetLeft: vv?.offsetLeft ?? 0,
  };
}

/** Whether any part of the trigger is inside the viewport. */
const isVisible = (trigger: AnchoredRect, viewport: AnchoredViewport): boolean =>
  trigger.top + trigger.height > 0 &&
  trigger.top < viewport.height &&
  trigger.left + trigger.width > 0 &&
  trigger.left < viewport.width;

const fits = (
  side: AnchoredSide,
  trigger: AnchoredRect,
  floating: AnchoredRect,
  viewport: AnchoredViewport,
  gap: number,
): boolean => {
  switch (side) {
    case "top":
      return trigger.top - gap - floating.height >= 0;
    case "bottom":
      return trigger.top + trigger.height + gap + floating.height <= viewport.height;
    case "left":
      return trigger.left - gap - floating.width >= 0;
    case "right":
      return trigger.left + trigger.width + gap + floating.width <= viewport.width;
  }
};

/**
 * Where to put a floating element so it sits beside its trigger and stays on
 * screen.
 *
 * Pure, and separate from the hook, because this is the half jsdom can check.
 * jsdom reports every rect as zero, so the browser tier is the only place the
 * wiring can be proved — but the arithmetic is decidable from numbers alone and
 * belongs in a test that runs in milliseconds.
 *
 * Replaces nine hand-written copies that had drifted into eight different
 * behaviours. This carries the union of what each got right: the SSR guard from
 * Dropdown, the `max(trigger, floating)` width from SearchableDropdown, the
 * margin-based clamp on both axes from Pagination and Breadcrumb, the
 * off-screen-trigger exception from DatePicker, the space-comparing flip from
 * CascadingDropdown, and the `visualViewport` offsets none of them had.
 */
export function computeAnchoredPosition(
  trigger: AnchoredRect,
  floating: AnchoredRect,
  viewport: AnchoredViewport,
  options: AnchoredPositionOptions = {},
): AnchoredPosition {
  const {
    side: preferred = "bottom",
    gap = 0,
    margin = 8,
    forceSide = false,
    clampOnlyWhenTriggerVisible = false,
  } = options;

  // Flip only when the preferred side cannot hold the element AND the opposite
  // one can. Flipping into a side that is just as short trades one clipped edge
  // for another, which is what the space-comparing copies avoided.
  let side = preferred;
  if (!forceSide && !fits(preferred, trigger, floating, viewport, gap)) {
    if (fits(OPPOSITE[preferred], trigger, floating, viewport, gap)) {
      side = OPPOSITE[preferred];
    }
  }

  let top: number;
  let left: number;
  switch (side) {
    case "top":
      top = trigger.top - floating.height - gap;
      left = trigger.left;
      break;
    case "bottom":
      top = trigger.top + trigger.height + gap;
      left = trigger.left;
      break;
    case "left":
      top = trigger.top;
      left = trigger.left - floating.width - gap;
      break;
    case "right":
      top = trigger.top;
      left = trigger.left + trigger.width + gap;
      break;
  }

  // The floating element can be wider than its trigger — a menu with longer
  // labels than the control that opens it. Clamping by the trigger's width, as
  // most copies did, leaves the overhang off screen.
  const width = Math.max(trigger.width, floating.width);

  const clampAxis = (value: number, size: number, extent: number) => {
    const limit = extent - size - margin;
    // When the element is larger than the viewport, `limit` falls below
    // `margin`; pinning to `margin` keeps its start edge visible rather than
    // its end, which is where the content begins.
    return limit <= margin ? margin : Math.max(margin, Math.min(value, limit));
  };

  const clamp = !clampOnlyWhenTriggerVisible || isVisible(trigger, viewport);
  if (clamp) {
    left = clampAxis(left, width, viewport.width);
    top = clampAxis(top, floating.height, viewport.height);
  }

  // Applied last, to coordinates that are already viewport-relative. The
  // floating element is positioned in layout coordinates, and these two are the
  // difference between the visual viewport and the layout one.
  return {
    top: top + viewport.offsetTop,
    left: left + viewport.offsetLeft,
    width: trigger.width,
    side,
  };
}
