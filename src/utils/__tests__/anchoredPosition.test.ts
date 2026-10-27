import { describe, expect, it } from "vitest";
import {
  computeAnchoredPosition,
  type AnchoredRect,
  type AnchoredViewport,
} from "../anchoredPosition.js";

const VIEWPORT: AnchoredViewport = { width: 1000, height: 800, offsetTop: 0, offsetLeft: 0 };

const rect = (p: Partial<AnchoredRect>): AnchoredRect => ({
  top: 0,
  left: 0,
  width: 100,
  height: 40,
  ...p,
});

describe("computeAnchoredPosition", () => {
  describe("default placement", () => {
    it("sits below the trigger, left edges aligned", () => {
      const r = computeAnchoredPosition(
        rect({ top: 100, left: 200 }),
        rect({ width: 100, height: 200 }),
        VIEWPORT,
        { gap: 4 },
      );
      expect(r).toEqual({ top: 144, inlineStart: 200, width: 100, side: "bottom", maxWidth: 984 });
    });

    it("sits above the trigger when asked", () => {
      const r = computeAnchoredPosition(
        rect({ top: 400, left: 200 }),
        rect({ width: 100, height: 200 }),
        VIEWPORT,
        { side: "top", gap: 4 },
      );
      expect(r.top).toBe(400 - 200 - 4);
      expect(r.side).toBe("top");
    });

    it("sits beside the trigger for the horizontal sides", () => {
      const left = computeAnchoredPosition(
        rect({ top: 100, left: 400, width: 100 }),
        rect({ width: 150, height: 100 }),
        VIEWPORT,
        { side: "left", gap: 4 },
      );
      expect(left).toMatchObject({ top: 100, inlineStart: 400 - 150 - 4, side: "left" });

      const right = computeAnchoredPosition(
        rect({ top: 100, left: 400, width: 100 }),
        rect({ width: 150, height: 100 }),
        VIEWPORT,
        { side: "right", gap: 4 },
      );
      expect(right).toMatchObject({ top: 100, inlineStart: 400 + 100 + 4, side: "right" });
    });
  });

  describe("flipping", () => {
    it("flips to the top when the bottom cannot hold it", () => {
      const r = computeAnchoredPosition(
        rect({ top: 700, left: 0, height: 40 }),
        rect({ height: 300 }),
        VIEWPORT,
        { gap: 4 },
      );
      expect(r.side).toBe("top");
      expect(r.top).toBe(700 - 300 - 4);
    });

    it("flips to the bottom when the top cannot hold it", () => {
      const r = computeAnchoredPosition(
        rect({ top: 20, left: 0 }),
        rect({ height: 300 }),
        VIEWPORT,
        { side: "top", gap: 4 },
      );
      expect(r.side).toBe("bottom");
    });

    it("flips on the horizontal axis too", () => {
      // Every copy that offered `left`/`right` — only Breadcrumb did — flipped
      // on neither axis, so a left-placed menu near the left edge was clamped
      // over its own trigger rather than moved to the other side.
      const r = computeAnchoredPosition(
        rect({ top: 100, left: 40, width: 100 }),
        rect({ width: 200, height: 100 }),
        VIEWPORT,
        { side: "left", gap: 4 },
      );
      expect(r.side).toBe("right");
      expect(r.inlineStart).toBe(40 + 100 + 4);
    });

    it("stays put when neither side can hold it", () => {
      // Flipping into a side that is equally short trades one clipped edge for
      // another and moves the element for nothing.
      const r = computeAnchoredPosition(
        rect({ top: 380, left: 0, height: 40 }),
        rect({ height: 700 }),
        VIEWPORT,
        { gap: 4 },
      );
      expect(r.side).toBe("bottom");
    });

    it("does not flip when the side is forced", () => {
      const r = computeAnchoredPosition(
        rect({ top: 700, left: 0 }),
        rect({ height: 300 }),
        VIEWPORT,
        { gap: 4, forceSide: true },
      );
      expect(r.side).toBe("bottom");
    });
  });

  describe("clamping", () => {
    it("pulls the element back from the right edge", () => {
      const r = computeAnchoredPosition(
        rect({ top: 100, left: 950, width: 40 }),
        rect({ width: 200, height: 100 }),
        VIEWPORT,
        { margin: 8 },
      );
      expect(r.inlineStart).toBe(1000 - 200 - 8);
    });

    it("pulls the element back from the left edge", () => {
      // The gap five copies shared: they only corrected an overflow on the
      // right, so a trigger at a negative left placed the menu off screen and
      // left it there.
      const r = computeAnchoredPosition(
        rect({ top: 100, left: -60, width: 100 }),
        rect({ width: 200, height: 100 }),
        VIEWPORT,
        { margin: 8 },
      );
      expect(r.inlineStart).toBe(8);
    });

    it("clamps the vertical axis as well", () => {
      const r = computeAnchoredPosition(
        rect({ top: -100, left: 100, height: 40 }),
        rect({ width: 100, height: 100 }),
        VIEWPORT,
        { side: "top", margin: 8, forceSide: true },
      );
      expect(r.top).toBe(8);
    });

    it("clamps by the floating width when the menu is wider than its trigger", () => {
      // Only SearchableDropdown did this. The others clamped by the trigger's
      // width, so the overhang stayed off screen — the variable was even named
      // `dropdownWidth` and assigned `rect.width`.
      const r = computeAnchoredPosition(
        rect({ top: 100, left: 880, width: 100 }),
        rect({ width: 300, height: 100 }),
        VIEWPORT,
        { margin: 8 },
      );
      expect(r.inlineStart).toBe(1000 - 300 - 8);
    });

    it("clamps a side placement by its own width, not its anchor's", () => {
      // CascadingDropdown's submenu at 375 px, measured in L24: a 70 px submenu
      // beside a 238 px item fits on the right, and was pulled back to x 129,
      // over its item, because the clamp used the item's width.
      const r = computeAnchoredPosition(
        rect({ top: 538, left: 25, width: 238 }),
        rect({ width: 70, height: 100 }),
        { width: 375, height: 667, offsetTop: 0, offsetLeft: 0 },
        { side: "right", gap: 4, margin: 8 },
      );
      expect(r.side).toBe("right");
      expect(r.inlineStart).toBe(25 + 238 + 4);
    });

    it("keeps the leading edge visible when the element exceeds the viewport", () => {
      const r = computeAnchoredPosition(
        rect({ top: 100, left: 100 }),
        rect({ width: 1200, height: 100 }),
        VIEWPORT,
        { margin: 8 },
      );
      expect(r.inlineStart).toBe(8);
    });

    it("leaves an off-screen trigger alone when asked", () => {
      // DatePicker's exception, and the only copy that had it: clamping against
      // a trigger scrolled out of view parks the calendar at the viewport edge,
      // floating over content it has nothing to do with.
      // `forceSide` isolates the clamp from the flip: a trigger below the fold
      // still has room above it, so the flip fires on its own terms and would
      // otherwise mask what this option governs.
      const off = rect({ top: 2000, left: 100 });
      const opts = { forceSide: true } as const;
      const clamped = computeAnchoredPosition(off, rect({ height: 200 }), VIEWPORT, opts);
      const unclamped = computeAnchoredPosition(off, rect({ height: 200 }), VIEWPORT, {
        ...opts,
        clampOnlyWhenTriggerVisible: true,
      });
      expect(clamped.top).toBe(800 - 200 - 8);
      expect(unclamped.top).toBe(2040);
    });
  });

  describe("visual viewport offsets", () => {
    it("shifts by the visual viewport offset", () => {
      // No copy read these. With the iOS keyboard up the visual viewport slides
      // while `getBoundingClientRect` keeps reporting layout coordinates, so a
      // menu was placed against a viewport that had moved out from under it.
      const shifted: AnchoredViewport = { width: 1000, height: 400, offsetTop: 150, offsetLeft: 20 };
      const r = computeAnchoredPosition(
        rect({ top: 100, left: 200 }),
        rect({ width: 100, height: 120 }),
        shifted,
        { gap: 4 },
      );
      expect(r.top).toBe(144 + 150);
      expect(r.inlineStart).toBe(200 + 20);
    });

    it("adds the offset after clamping, not before", () => {
      // Clamping happens in viewport coordinates; the offset converts the
      // result to layout coordinates. Applying it first would clamp against the
      // wrong edge.
      const shifted: AnchoredViewport = { width: 1000, height: 800, offsetTop: 100, offsetLeft: 0 };
      const r = computeAnchoredPosition(
        rect({ top: 100, left: 950, width: 40 }),
        rect({ width: 200, height: 100 }),
        shifted,
        { margin: 8 },
      );
      expect(r.inlineStart).toBe(1000 - 200 - 8);
    });
  });

  describe("fit: a surface taller than the viewport", () => {
    // A 960px menu in an 800px viewport fits neither side. Unfitted, it is
    // pinned to the top margin, over its own trigger, with its end off screen.
    it("opens below when there is more room below, capped to that room", () => {
      const r = computeAnchoredPosition(rect({ top: 100 }), rect({ height: 960 }), VIEWPORT, { gap: 4, margin: 8, fit: true });
      expect(r).toEqual({ top: 144, inlineStart: 8, width: 100, side: "bottom", maxHeight: 648, maxWidth: 984 });
    });

    it("opens above when there is more room above, ending at the trigger", () => {
      const r = computeAnchoredPosition(rect({ top: 600 }), rect({ height: 960 }), VIEWPORT, { gap: 4, margin: 8, fit: true });
      expect(r).toEqual({ top: 8, inlineStart: 8, width: 100, side: "top", maxHeight: 588, maxWidth: 984 });
      expect(r.top + r.maxHeight!).toBe(600 - 4);
    });

    it("leaves a surface that fits where it was", () => {
      const fitted = computeAnchoredPosition(rect({ top: 100, left: 200 }), rect({ height: 200 }), VIEWPORT, { gap: 4, fit: true });
      const plain = computeAnchoredPosition(rect({ top: 100, left: 200 }), rect({ height: 200 }), VIEWPORT, { gap: 4 });
      expect({ ...fitted, maxHeight: undefined }).toEqual({ ...plain, maxHeight: undefined });
      expect(fitted.maxHeight).toBe(800 - 140 - 4 - 8);
    });
  });

  describe("width cap: a surface wider than the viewport", () => {
    it("caps the width at the viewport inside its margin on both sides", () => {
      const r = computeAnchoredPosition(
        rect({ top: 100, left: 24, width: 232 }),
        rect({ width: 288, height: 100 }),
        { width: 280, height: 640, offsetTop: 0, offsetLeft: 0 },
        { margin: 8 },
      );
      expect(r.maxWidth).toBe(264);
    });

    it("places the capped width, so the surface ends inside the right margin", () => {
      const viewport = { width: 280, height: 640, offsetTop: 0, offsetLeft: 0 };
      const r = computeAnchoredPosition(rect({ top: 100, left: 24, width: 232 }), rect({ width: 288, height: 100 }), viewport, { margin: 8 });
      expect(r.inlineStart).toBe(8);
      expect(r.inlineStart + r.maxWidth).toBe(viewport.width - 8);
    });

    it("reads a measured rect whose fields are getters, as a DOMRect's are", () => {
      class Measured {
        get top() { return 0; }
        get left() { return 0; }
        get width() { return 288; }
        get height() { return 100; }
      }
      const viewport = { width: 280, height: 640, offsetTop: 0, offsetLeft: 0 };
      const r = computeAnchoredPosition(rect({ top: 100, left: 24, width: 232 }), new Measured(), viewport, { gap: 4, margin: 8 });
      expect(r.top).toBe(100 + 40 + 4);
      expect(r.inlineStart).toBe(8);
    });

    it("leaves a surface that fits its measured width", () => {
      const r = computeAnchoredPosition(rect({ top: 100, left: 880, width: 100 }), rect({ width: 300, height: 100 }), VIEWPORT, { margin: 8 });
      expect(r.inlineStart).toBe(1000 - 300 - 8);
      expect(r.maxWidth).toBe(984);
    });
  });

  it("reports the trigger width, not the clamping width", () => {
    // Callers size the floating element to the trigger; the wider value is only
    // used to decide where the right edge lands.
    const r = computeAnchoredPosition(
      rect({ top: 100, left: 100, width: 120 }),
      rect({ width: 400, height: 100 }),
      VIEWPORT,
      {},
    );
    expect(r.width).toBe(120);
  });
});

describe("computeAnchoredPosition in right-to-left", () => {
  const surface = (
    r: { inlineStart: number },
    width: number,
    viewport: AnchoredViewport,
    rtlFrame: boolean,
  ) => {
    const extent = viewport.layoutWidth ?? viewport.width;
    const left = rtlFrame ? extent - r.inlineStart - width : r.inlineStart;
    return { left, right: left + width };
  };

  it("sits below the trigger with the right edges aligned", () => {
    const r = computeAnchoredPosition(rect({ top: 100, left: 600, width: 100 }), rect({ width: 300, height: 200 }), VIEWPORT, { gap: 4, rtl: true });
    expect(r.side).toBe("bottom");
    expect(r.top).toBe(144);
    expect(surface(r, 300, VIEWPORT, true)).toEqual({ left: 400, right: 700 });
  });

  it("sits above the trigger with the right edges aligned", () => {
    const r = computeAnchoredPosition(rect({ top: 400, left: 600, width: 100 }), rect({ width: 300, height: 200 }), VIEWPORT, { side: "top", gap: 4, rtl: true });
    expect(r.side).toBe("top");
    expect(r.top).toBe(400 - 200 - 4);
    expect(surface(r, 300, VIEWPORT, true)).toEqual({ left: 400, right: 700 });
  });

  it("aligns a surface narrower than its trigger to the trigger's right edge", () => {
    const r = computeAnchoredPosition(rect({ top: 100, left: 24, width: 952 }), rect({ width: 244, height: 160 }), VIEWPORT, { gap: 4, rtl: true });
    expect(surface(r, 244, VIEWPORT, true)).toEqual({ left: 976 - 244, right: 976 });
  });

  it("pushes a surface that would cross the left edge back inside the margin", () => {
    const r = computeAnchoredPosition(rect({ top: 100, left: 50, width: 100 }), rect({ width: 300, height: 200 }), VIEWPORT, { gap: 4, rtl: true });
    expect(surface(r, 300, VIEWPORT, true)).toEqual({ left: 8, right: 308 });
  });

  it("pins a box wider than the viewport to the right margin, where the line starts", () => {
    const r = computeAnchoredPosition(rect({ top: 100, left: -50, width: 1100 }), rect({ width: 300, height: 200 }), VIEWPORT, { gap: 4, rtl: true });
    expect(surface(r, 300, VIEWPORT, true)).toEqual({ left: 1000 - 8 - 300, right: 1000 - 8 });
    const ltr = computeAnchoredPosition(rect({ top: 100, left: -50, width: 1100 }), rect({ width: 300, height: 200 }), VIEWPORT, { gap: 4 });
    expect(surface(ltr, 300, VIEWPORT, false)).toEqual({ left: 8, right: 308 });
  });

  it("still flips to the side that can hold it, keeping the right edges aligned", () => {
    const r = computeAnchoredPosition(rect({ top: 700, left: 600, width: 100, height: 40 }), rect({ width: 300, height: 200 }), VIEWPORT, { gap: 4, rtl: true });
    expect(r.side).toBe("top");
    expect(r.top).toBe(700 - 200 - 4);
    expect(surface(r, 300, VIEWPORT, true)).toEqual({ left: 400, right: 700 });
  });

  it("leaves the physical sides where they were", () => {
    const options = { side: "left" as const, gap: 4 };
    const ltr = computeAnchoredPosition(rect({ top: 100, left: 400 }), rect({ width: 150, height: 100 }), VIEWPORT, options);
    const rtl = computeAnchoredPosition(rect({ top: 100, left: 400 }), rect({ width: 150, height: 100 }), VIEWPORT, { ...options, rtl: true, surfaceRtl: false });
    expect(rtl).toEqual(ltr);
    expect(surface(rtl, 150, VIEWPORT, false)).toEqual({ left: 246, right: 396 });
  });

  it("writes the offset in the surface's own direction when it differs from the trigger's", () => {
    const trigger = rect({ top: 100, left: 600, width: 100 });
    const floating = rect({ width: 300, height: 200 });
    const rtlInLtr = computeAnchoredPosition(trigger, floating, VIEWPORT, { rtl: true, surfaceRtl: false });
    expect(surface(rtlInLtr, 300, VIEWPORT, false)).toEqual({ left: 400, right: 700 });
    const ltrInRtl = computeAnchoredPosition(trigger, floating, VIEWPORT, { rtl: false, surfaceRtl: true });
    expect(surface(ltrInRtl, 300, VIEWPORT, true)).toEqual({ left: 600, right: 900 });
  });

  it("measures a right-to-left offset from the layout viewport while the visual one is zoomed", () => {
    const viewport: AnchoredViewport = { width: 500, height: 400, offsetTop: 0, offsetLeft: 100, layoutWidth: 1000 };
    const r = computeAnchoredPosition(rect({ top: 50, left: 300, width: 100 }), rect({ width: 200, height: 100 }), viewport, { gap: 4, rtl: true });
    expect(surface(r, 200, viewport, true)).toEqual({ left: 300, right: 500 });
  });
});
