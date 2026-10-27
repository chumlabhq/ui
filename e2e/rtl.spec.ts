import { test, expect } from "./_test";
import { gotoFixture } from "./_nav";

/**
 * Right-to-left placement, measured against what mirroring IS rather than what
 * the package happens to do.
 *
 * A surface anchored under its trigger aligns to the trigger's inline-start
 * edge — its left in LTR, its right in RTL — and a submenu that flips on the
 * cross axis prefers the leading side. Until A2b every positioner placed from
 * the trigger's physical left (the A2 audit, cause C1 and C2), and these tests
 * were skipped with that measurement in their reason; they now hold it. The
 * one remaining skip is Slider's, whose position math is A2d's.
 *
 * Each subject says which alignment it expects, rather than the test deciding
 * from what it measured: a surface sized to its trigger lines up on both edges
 * at once, and asserting that coincidence is what keeps it from going wrong
 * unnoticed. Every expectation is clamp-aware: where the aligned placement
 * would cross the 8 px margin, the surface belongs pushed inside it.
 *
 * Every open surface of every fixture is walked the same way in
 * rtl-surfaces.spec.ts; these are the named subjects, one per component.
 */
const WIDTH = 1024;
const MARGIN = 8;

/** Reads the anchor and the surface in one pass, in whichever direction. */
async function measure(
  page: import("@playwright/test").Page,
  anchorSelector: string,
  surfaceSelector: string,
) {
  await page.locator(surfaceSelector).first().waitFor({ state: "attached" });
  return page.evaluate(
    ([anchor, surface]) => {
      const read = (selector: string) => {
        const el = document.querySelector(selector);
        if (!el) return null;
        const box = el.getBoundingClientRect();
        return {
          left: Math.round(box.left),
          right: Math.round(box.right),
          width: Math.round(box.width),
        };
      };
      return {
        anchor: read(anchor),
        surface: read(surface),
        side: document.querySelector(surface)?.getAttribute("data-side") ?? null,
        direction: getComputedStyle(document.documentElement).direction,
        viewport: window.innerWidth,
      };
    },
    [anchorSelector, surfaceSelector] as const,
  );
}

/**
 * The surfaces that anchor under their trigger. In LTR each aligns its left
 * edge to the trigger's; the mirror of that is the right edge to the right.
 */
/**
 * - `start`: the surface's right edge is the trigger's.
 * - `both-edges`: the surface is sized to its trigger, so it lines up on both.
 * - `end-estimate`: Table's filter with less than its 220 px estimate of room
 *   toward the inline end, which aligns its END edge by that estimate. That is
 *   LTR's own branch (the recorded LTR baseline ends 40 px short of the
 *   trigger's right), mirrored rather than replaced.
 */
type Alignment = "start" | "both-edges" | "end-estimate";

const ANCHORED: Array<{ component: string; fixture: string; anchor: string; surface: string; alignment: Alignment }> = [
  {
    component: "Dropdown",
    fixture: "open-rtl",
    anchor: "[data-fixture] [role='combobox']",
    surface: "[role='listbox']",
    alignment: "both-edges",
  },
  {
    component: "SearchableDropdown",
    fixture: "open-rtl",
    anchor: "[data-fixture] [role='combobox']",
    surface: "[role='group'][data-side]",
    alignment: "start",
  },
  {
    component: "MultiSelectDropdown",
    fixture: "open-rtl",
    anchor: "[data-fixture] [role='combobox']",
    surface: "[role='listbox']",
    alignment: "both-edges",
  },
  {
    // Clock mode, measured on the dialog that is the surface and against the
    // field box it anchors to — the element holding the input, not the input:
    // the box is wider by its padding. The dropdown mode's list is sized to
    // that box and would only show the two alignments coinciding.
    component: "TimePicker",
    fixture: "open-clock-rtl",
    anchor: "[data-fixture] div:has(> input[role='combobox'])",
    surface: "[role='dialog']",
    alignment: "start",
  },
  {
    component: "DatePicker",
    fixture: "open-rtl",
    anchor: "[data-fixture] [role='combobox'],[data-fixture] button",
    surface: "[role='dialog']",
    alignment: "start",
  },
  {
    component: "Breadcrumb",
    fixture: "collapsed-open-rtl",
    anchor: "[data-fixture] button[aria-haspopup]",
    surface: "[role='menu']",
    alignment: "start",
  },
  {
    component: "Pagination",
    fixture: "rows-per-page-open-rtl",
    anchor: "[data-fixture] [aria-haspopup='listbox']",
    surface: "[role='listbox']",
    alignment: "both-edges",
  },
  {
    component: "Table",
    fixture: "filter-open-rtl",
    anchor: "[data-fixture] th button[aria-haspopup='dialog']",
    surface: "[data-table-filter-content]",
    alignment: "end-estimate",
  },
];

test.describe("right-to-left", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: WIDTH, height: 900 });
  });

  for (const subject of ANCHORED) {
    test(`${subject.component} anchors to the leading edge`, async ({ page }) => {
      await gotoFixture(page, subject.component, subject.fixture);
      const seen = await measure(page, subject.anchor, subject.surface);

      expect(seen.direction, "the fixture did not render right-to-left").toBe("rtl");
      expect(seen.anchor, "no anchor found").not.toBeNull();
      expect(seen.surface, "no surface found").not.toBeNull();

      expect(seen.surface!.left, "clamped off the left edge").toBeGreaterThanOrEqual(0);
      expect(seen.surface!.right, "clamped off the right edge").toBeLessThanOrEqual(seen.viewport);

      const placed =
        `the surface sits at [${seen.surface!.left}..${seen.surface!.right}] against a trigger at ` +
        `[${seen.anchor!.left}..${seen.anchor!.right}] in a ${seen.viewport} px viewport`;

      if (subject.alignment === "both-edges") {
        expect(Math.abs(seen.surface!.left - seen.anchor!.left), `sized to its trigger, so both edges align: ${placed}`).toBeLessThanOrEqual(2);
        expect(Math.abs(seen.surface!.right - seen.anchor!.right), `sized to its trigger, so both edges align: ${placed}`).toBeLessThanOrEqual(2);
        return;
      }

      // Aligned, then pushed inside the margin: right first, so a surface
      // wider than the viewport keeps the right margin, where the line starts.
      let right = subject.alignment === "start" ? seen.anchor!.right : seen.anchor!.left + 220;
      if (right - seen.surface!.width < MARGIN) right = MARGIN + seen.surface!.width;
      if (right > seen.viewport - MARGIN) right = seen.viewport - MARGIN;
      expect(
        Math.abs(seen.surface!.right - right),
        `in RTL the surface's right edge belongs at ${right} (${subject.alignment === "start" ? "the trigger's right edge" : "220 px past the trigger's left edge, as LTR ends it 220 px before the trigger's right"}, kept inside the ${MARGIN} px margin): ${placed}`,
      ).toBeLessThanOrEqual(2);
    });
  }

  /**
   * The one surface in the package that already flips, and the only place the
   * difference between "does not mirror" and "mirrors the wrong way" is
   * observable: a submenu prefers the leading side, which is the left in RTL.
   */
  test("CascadingDropdown opens its submenu towards the leading side", async ({ page }) => {
    await gotoFixture(page, "CascadingDropdown", "open-submenu-rtl");
    const seen = await measure(
      page,
      "[role='menuitem'][aria-expanded='true']",
      "[data-cascading-submenu]",
    );

    expect(seen.direction).toBe("rtl");
    expect(seen.surface!.left).toBeGreaterThanOrEqual(0);
    expect(seen.surface!.right).toBeLessThanOrEqual(seen.viewport);

    expect(
      seen.side,
      `the submenu opened to the ${seen.side} of an item at ` +
        `[${seen.anchor!.left}..${seen.anchor!.right}] with room on both sides; in RTL the ` +
        "leading side is the left",
    ).toBe("left");
  });

  /**
   * Layout that carries direction without being anchored. The browser mirrors
   * normal flow on its own, so these say whether anything overrides it.
   */
  test("Slider fills from the leading edge", async ({ page }) => {
    await gotoFixture(page, "Slider", "rtl");
    const seen = await page.evaluate(() => {
      const track = document.querySelector("[data-fixture] [role='slider']")?.parentElement;
      const thumb = document.querySelector("[data-fixture] [role='slider']");
      if (!track || !thumb) return null;
      const t = track.getBoundingClientRect();
      const h = thumb.getBoundingClientRect();
      return {
        // Where the thumb sits as a fraction of the track, measured from the
        // leading (right) edge in RTL.
        fromLeading: Math.round(((t.right - h.left - h.width / 2) / t.width) * 100),
        direction: getComputedStyle(document.documentElement).direction,
      };
    });
    expect(seen, "no slider found").not.toBeNull();
    expect(seen!.direction).toBe("rtl");

    test.skip(
      true,
      `RTL is not supported in 0.1.0 (ACCESSIBILITY.md). Measured: at value 25 the thumb sits ` +
        `${seen!.fromLeading}% from the leading edge, i.e. the fill is measured from the ` +
        `physical left in both directions.`,
    );

    expect(
      Math.abs(seen!.fromLeading - 25),
      `the thumb is ${seen!.fromLeading}% from the leading edge; the value is 25`,
    ).toBeLessThanOrEqual(3);
  });
});
