import { test, expect, type Page } from "./_test";
import { gotoFixture } from "./_nav";

/**
 * The submenu stays in the frame, and flips when the anchor is near the edge.
 *
 * It was a `position: absolute` child of the menu item — the one floating
 * surface in the library that never went through `useAnchoredPosition`, and so
 * the one with no clamp and no flip. Measured before the move: at 1024 the
 * default fixture put it at x=1003 with a width of 220, 199px of it past the
 * right edge, and at 320 the menu fills the viewport so the submenu sat at
 * x=331 and painted nothing at all. The visual baseline recorded exactly that:
 * a sliver at one width and a blank at the other.
 *
 * jsdom reports every rect as zero, so this is the only tier that can see it.
 */
const CASES = [
  { fixture: "open-submenu", anchor: "default" },
  { fixture: "open-submenu-near-right", anchor: "near the right edge" },
  { fixture: "open-submenu-near-left", anchor: "near the left edge" },
];

const WIDTHS = [320, 1024];

/**
 * The submenu's own menu element, which exists in both shapes.
 *
 * Deliberately not the positioned root: measuring the element that carries the
 * position would make this pass trivially on a build where that element is
 * absent, and the point is that the geometry is wrong on the old one rather
 * than that a new attribute is missing.
 */
const SUBMENU = '[role="menu"][aria-label$="submenu"]';

/** The root MenuSurface positions. Only the flip assertion needs it. */
const SURFACE = "[data-cascading-submenu]";

test.describe("CascadingDropdown submenu placement", () => {
  for (const width of WIDTHS) {
    for (const { fixture, anchor } of CASES) {
      test(`${width}px, anchored ${anchor}, stays in the frame`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await gotoFixture(page, "CascadingDropdown", fixture);
        await page.locator(SUBMENU).waitFor({ state: "attached" });

        const geometry = await page.evaluate((selector) => {
          const surface = document.querySelector(selector)!;
          const item = document.querySelector(
            '[role="menuitem"][aria-expanded="true"]',
          );
          const box = surface.getBoundingClientRect();
          return {
            box: { left: box.left, right: box.right, top: box.top, bottom: box.bottom },
            viewport: { width: window.innerWidth, height: window.innerHeight },
            side: surface.getAttribute("data-side"),
            anchorRight: item?.getBoundingClientRect().right ?? null,
            // Painted, not merely positioned: a surface pushed past the edge
            // still reports a box.
            visible: !!(box.width && box.height),
          };
        }, SUBMENU);

        expect(geometry.visible, "the submenu has no box").toBe(true);
        expect(
          geometry.box.left,
          `submenu starts at ${geometry.box.left}, off the left edge`,
        ).toBeGreaterThanOrEqual(0);
        expect(
          geometry.box.right,
          `submenu ends at ${geometry.box.right} in a ${geometry.viewport.width}px viewport`,
        ).toBeLessThanOrEqual(geometry.viewport.width);
        expect(geometry.box.top).toBeGreaterThanOrEqual(0);
        expect(geometry.box.bottom).toBeLessThanOrEqual(geometry.viewport.height);
      });
    }
  }

  test("opens on the side `submenuSide` asks for when it fits", async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 900 });
    await gotoFixture(page, "CascadingDropdown", "open-submenu-left");
    await page.locator(SURFACE).waitFor({ state: "attached" });

    const placed = await page.evaluate((selector) => {
      const surface = document.querySelector(selector)!;
      const item = document.querySelector('[role="menuitem"][aria-expanded="true"]')!;
      return {
        side: surface.getAttribute("data-side"),
        surfaceRight: surface.getBoundingClientRect().right,
        anchorLeft: item.getBoundingClientRect().left,
      };
    }, SURFACE);

    expect(placed.side).toBe("left");
    expect(placed.surfaceRight).toBeLessThanOrEqual(placed.anchorLeft);
  });

  /**
   * `submenuSide` is logical: "end" is the side text runs towards, so the right
   * in LTR and the left in RTL. Both anchors have room on the side asked for,
   * so the measured edge is the resolution and not a flip.
   */
  for (const { fixture, dir, side } of [
    { fixture: "open-submenu-near-left", dir: "ltr", side: "right" },
    { fixture: "open-submenu-rtl", dir: "rtl", side: "left" },
  ]) {
    test(`"end" opens to the ${side} in ${dir}`, async ({ page }) => {
      await page.setViewportSize({ width: 1024, height: 900 });
      await gotoFixture(page, "CascadingDropdown", fixture);
      await page.locator(SURFACE).waitFor({ state: "attached" });

      const placed = await page.evaluate((selector) => {
        const surface = document.querySelector(selector)!;
        const item = document.querySelector('[role="menuitem"][aria-expanded="true"]')!;
        const box = surface.getBoundingClientRect();
        const anchor = item.getBoundingClientRect();
        return {
          direction: getComputedStyle(item).direction,
          side: surface.getAttribute("data-side"),
          surface: [box.left, box.right],
          anchor: [anchor.left, anchor.right],
        };
      }, SURFACE);

      expect(placed.direction).toBe(dir);
      expect(placed.side, `submenu at [${placed.surface}] against an item at [${placed.anchor}]`).toBe(side);
      if (side === "right") expect(placed.surface[0]).toBeGreaterThanOrEqual(placed.anchor[1]);
      else expect(placed.surface[1]).toBeLessThanOrEqual(placed.anchor[0]);
    });
  }

  test("flips to the left when the right side cannot hold it", async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 900 });
    await gotoFixture(page, "CascadingDropdown", "open-submenu-near-right");
    await page.locator(SURFACE).waitFor({ state: "attached" });

    const placed = await page.evaluate((selector) => {
      const surface = document.querySelector(selector)!;
      const item = document.querySelector('[role="menuitem"][aria-expanded="true"]')!;
      return {
        side: surface.getAttribute("data-side"),
        surfaceRight: surface.getBoundingClientRect().right,
        anchorLeft: item.getBoundingClientRect().left,
      };
    }, SURFACE);

    // The side attribute and the geometry have to agree: `data-side` is what
    // the styling hooks read, and a surface that says "left" while sitting on
    // the right is the failure this cannot allow.
    expect(placed.side).toBe("left");
    expect(placed.surfaceRight).toBeLessThanOrEqual(placed.anchorLeft);
  });
});

/**
 * DOM focus follows the keyboard into a submenu and back out.
 *
 * The submenu's items carried a roving `tabIndex` and `data-highlighted`, and
 * nothing ever focused one: ArrowRight, Enter and Space opened the submenu and
 * moved the highlight while focus stayed on the parent item, so the item a
 * screen reader announced was not the item the arrows were moving. Measured in
 * chromium, firefox and webkit before the fix: after ArrowRight the active
 * element was still "Fruit", and "Fruit" and "Apple" were both tab stops.
 *
 * APG menu pattern: Enter, Space and ArrowRight on an item with a submenu open
 * it and move focus to its first item; ArrowLeft and Escape close it and
 * return focus to the parent item. Pointer hover moves no DOM focus.
 */
test.describe("CascadingDropdown submenu keyboard focus", () => {
  const active = (page: Page) =>
    page.evaluate(() => {
      const el = document.activeElement;
      return {
        label: (el?.textContent ?? "").trim(),
        inSubmenu: !!el?.closest("[data-cascading-submenu]"),
        stops: [...document.querySelectorAll('[role^="menuitem"][tabindex="0"]')].map((s) => (s.textContent ?? "").trim()),
      };
    });

  for (const key of ["ArrowRight", "Enter", "Space"]) {
    test(`${key} on a parent moves focus to the submenu's first item; ArrowLeft and Escape return it`, async ({ page }) => {
      await gotoFixture(page, "CascadingDropdown", "closed");
      await page.locator("[data-fixture] button[aria-haspopup]").first().focus();
      await page.keyboard.press("ArrowDown");
      await expect(page.locator('[role="menuitem"]', { hasText: "Fruit" })).toBeFocused();

      await page.keyboard.press(key);
      const entered = await active(page);
      console.log(`SUBMENU_FOCUS ${key}: "${entered.label}" inSubmenu=${entered.inSubmenu} stops=${JSON.stringify(entered.stops)}`);
      await expect(page.locator(`${SURFACE} [role^="menuitem"]`, { hasText: "Apple" })).toBeFocused();
      expect(entered.stops, "exactly one tab stop, on the focused item").toEqual(["Apple"]);

      await page.keyboard.press("ArrowLeft");
      await expect(page.locator(SURFACE)).toHaveCount(0);
      await expect(page.locator('[role="menuitem"]', { hasText: "Fruit" })).toBeFocused();
      const left = await active(page);
      console.log(`SUBMENU_FOCUS ${key} then ArrowLeft: "${left.label}" stops=${JSON.stringify(left.stops)}`);
      expect(left.stops).toEqual(["Fruit"]);

      await page.keyboard.press(key);
      await expect(page.locator(`${SURFACE} [role^="menuitem"]`, { hasText: "Apple" })).toBeFocused();
      await page.keyboard.press("Escape");
      await expect(page.locator(SURFACE)).toHaveCount(0);
      await expect(page.locator('[role="menu"]').first(), "Escape in the submenu closed the whole menu").toBeVisible();
      await expect(page.locator('[role="menuitem"]', { hasText: "Fruit" })).toBeFocused();
      console.log(`SUBMENU_FOCUS ${key} then Escape: "${(await active(page)).label}"`);
    });
  }

  test("pointer hover opens the submenu and moves no DOM focus into it", async ({ page }) => {
    await gotoFixture(page, "CascadingDropdown", "closed");
    await page.locator("[data-fixture] button[aria-haspopup]").first().click();
    await page.locator('[role="menuitem"]', { hasText: "Fruit" }).hover();
    const apple = page.locator(`${SURFACE} [role^="menuitem"]`, { hasText: "Apple" });
    await apple.hover();
    await expect(apple).toHaveAttribute("data-highlighted");
    const hovered = await active(page);
    console.log(`SUBMENU_FOCUS hover: "${hovered.label}" inSubmenu=${hovered.inSubmenu}`);
    expect(hovered.inSubmenu, "hover moved DOM focus into the submenu").toBe(false);
  });
});
