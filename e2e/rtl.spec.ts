import { test, expect } from "@playwright/test";
import { gotoFixture } from "./_nav";

/**
 * Right-to-left, which nothing in this package has ever rendered.
 *
 * `useAnchoredPosition` decides a left coordinate, clamps it against the
 * viewport's left and right edges, and flips a surface to the opposite side
 * when the preferred one cannot hold it — all of it on the horizontal axis, and
 * none of it aware of the writing direction. Breadcrumb, Pagination, Stepper
 * and Slider carry direction in their layout as well.
 *
 * The assertions here state what mirroring IS, not what the package currently
 * does: a surface anchored under its trigger aligns to the trigger's leading
 * edge, which is the left in LTR and the right in RTL, and a surface that flips
 * on the cross axis prefers the leading side. Where the package does not do
 * that, this fails and names the number — a defect recorded rather than a
 * behaviour blessed.
 */
const WIDTH = 1024;

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
const ANCHORED = [
  {
    component: "Dropdown",
    fixture: "open-rtl",
    anchor: "[data-fixture] [role='combobox']",
    surface: "[role='listbox']",
  },
  {
    component: "SearchableDropdown",
    fixture: "open-rtl",
    anchor: "[data-fixture] [role='combobox']",
    surface: "[role='listbox']",
  },
  {
    component: "MultiSelectDropdown",
    fixture: "open-rtl",
    anchor: "[data-fixture] [role='combobox']",
    surface: "[role='listbox']",
  },
  {
    component: "TimePicker",
    fixture: "open-rtl",
    anchor: "[data-fixture] [role='combobox'],[data-fixture] input",
    surface: "[role='listbox']",
  },
  {
    component: "DatePicker",
    fixture: "open-rtl",
    anchor: "[data-fixture] [role='combobox'],[data-fixture] button",
    surface: "[role='dialog']",
  },
  {
    component: "Breadcrumb",
    fixture: "collapsed-open-rtl",
    anchor: "[data-fixture] button",
    surface: "[role='menu']",
  },
  {
    component: "Pagination",
    fixture: "rows-per-page-open-rtl",
    anchor: "[data-fixture] [aria-haspopup='listbox']",
    surface: "[role='listbox']",
  },
  {
    component: "Table",
    fixture: "filter-open-rtl",
    anchor: "[data-fixture] th button",
    surface: "[data-table-filter-content]",
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

      // Still on screen, whatever the direction. This half already holds: the
      // clamp is symmetrical because it works from both viewport edges.
      expect(seen.surface!.left, "clamped off the left edge").toBeGreaterThanOrEqual(0);
      expect(seen.surface!.right, "clamped off the right edge").toBeLessThanOrEqual(seen.viewport);

      // A surface sized to its trigger aligns on both edges at once and says
      // nothing either way; every other width has a leading edge to align to.
      test.skip(
        Math.abs(seen.surface!.width - seen.anchor!.width) <= 2,
        "surface is exactly as wide as its trigger — the two alignments coincide",
      );

      expect(
        Math.abs(seen.surface!.right - seen.anchor!.right),
        `in RTL the surface should align to the trigger's right edge: trigger ends at ` +
          `${seen.anchor!.right}, surface at ${seen.surface!.right} (surface starts at ` +
          `${seen.surface!.left}, trigger at ${seen.anchor!.left})`,
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
    expect(
      Math.abs(seen!.fromLeading - 25),
      `the thumb is ${seen!.fromLeading}% from the leading edge; the value is 25`,
    ).toBeLessThanOrEqual(3);
  });
});
