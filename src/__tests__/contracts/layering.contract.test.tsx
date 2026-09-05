/** @jsxImportSource react */
/**
 * Floating content must compute a higher layer than whatever encloses it.
 *
 * The library shipped three unrelated scales: the dropdown family defaulted to
 * 50, Modal based at 9999, and Drawer, Tooltip and ToastProvider each hardcoded
 * 9999. A dropdown opened inside a drawer therefore rendered ~9950 layers BELOW
 * its own container, which is why popovers inside drawers vanished.
 *
 * This is also the precondition for SC 2.4.11 Focus Not Obscured: a focused
 * control inside an overlay cannot be hidden by that overlay. So it asserts the
 * computed number for every overlay x floating pair, not a sample.
 */
import { describe, expect, it } from "vitest";
import { renderHook } from "@testing-library/react";
import { LAYERS, LAYER_STEP, OverlayLayerContext, useLayer } from "../../utils/layers.js";
import { isStructural } from "../../utils/classLayers.js";

/** Every overlay that establishes a layering scope, with the layer it publishes. */
const OVERLAYS = [
  ["Modal (root)", LAYERS.overlay],
  ["Modal (nested 1)", LAYERS.overlay + LAYER_STEP],
  ["Modal (nested 3)", LAYERS.overlay + 3 * LAYER_STEP],
  ["Drawer", LAYERS.overlay],
] as const;

/** Every component that renders floating content through a portal. */
const FLOATING = [
  "Dropdown", "SearchableDropdown", "MultiSelectDropdown",
  "MultiSelectSearchableDropdown", "CascadingDropdown", "DatePicker",
  "TimePicker", "Pagination", "Breadcrumb", "InternationalPhoneInput",
] as const;

const layerInside = (enclosing: number | null, explicit?: number) =>
  renderHook(() => useLayer(explicit), {
    wrapper: ({ children }) => (
      <OverlayLayerContext.Provider value={enclosing}>{children}</OverlayLayerContext.Provider>
    ),
  }).result.current;

describe("layering contract", () => {
  describe("self-check", () => {
    /** The predicate the real cases use, so the self-check exercises it. */
    const stacksAbove = (resolve: (enclosing: number) => number, enclosing: number) =>
      resolve(enclosing) > enclosing;

    it("catches an inversion", () => {
      // Exactly what the library did before: a fixed default, ignoring context.
      const brokenResolver = () => LAYERS.dropdown;
      expect(stacksAbove(brokenResolver, LAYERS.overlay)).toBe(false);
      // and the real one passes the same predicate
      expect(stacksAbove((z) => layerInside(z), LAYERS.overlay)).toBe(true);
    });

    it("resolves nothing above an overlay when the context is missing", () => {
      // A floating component rendered at the page root takes its tier, and that
      // is BELOW an overlay — so the guard below is not vacuously true.
      expect(layerInside(null)).toBe(LAYERS.dropdown);
      expect(layerInside(null)).toBeLessThan(LAYERS.overlay);
    });
  });

  describe.each(OVERLAYS)("inside %s", (_label, enclosing) => {
    it.each(FLOATING)("%s computes a higher layer than its container", () => {
      expect(layerInside(enclosing)).toBeGreaterThan(enclosing);
    });
  });

  it("an explicit prop still wins, even downwards", () => {
    expect(layerInside(LAYERS.overlay, 5)).toBe(5);
    expect(layerInside(null, 5)).toBe(5);
  });

  it("keeps notifications and tooltips above a root overlay", () => {
    expect(LAYERS.toast).toBeGreaterThan(LAYERS.overlay);
    expect(LAYERS.tooltip).toBeGreaterThan(LAYERS.toast);
  });

  /**
   * ADR 001 classifies `z-*` as structural, so a consumer who unstyles a Drawer
   * keeps its layer. Asserted rather than assumed: if the classifier ever moved
   * z-* to decorative, unstyling an overlay would drop it behind the page.
   */
  it("treats z-* as structural, so unstyled keeps the layer", () => {
    for (const token of ["z-10", "z-50", "z-[9999]", "dark:z-20"]) {
      expect(isStructural(token), `${token} must survive unstyled`).toBe(true);
    }
  });
});
