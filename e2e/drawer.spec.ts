import { test, expect } from "./_test";
import { injectAxe, checkA11y } from "axe-playwright";
import { gotoFixture } from "./_nav";

/**
 * Repointed from /drawer to fixture pages, then cut to what needs a browser.
 *
 * Every test here used to open the drawer via
 * `getByRole("button", { name: "Navigation Menu" })`. That label, and five
 * others the spec relied on, had been gone from the demo for some time — all 18
 * tests failed on the same timeout (E2E-INVENTORY.md). Ten of the eighteen then
 * turned out to duplicate Drawer.test.tsx and were deleted rather than
 * repointed (E2E-TRIAGE.md); what is left is focus, geometry, gesture and axe.
 */

const DIALOG = '[role="dialog"]';

test.describe("Drawer", () => {
  test.describe("Focus Management", () => {
    test("restores focus to the trigger on close", async ({ page }) => {
      await gotoFixture(page, "Drawer", "with-trigger");
      const trigger = page.locator("[data-harness-trigger]");

      // Opened from the keyboard, not a click. WebKit does not focus a button
      // on click unless Full Keyboard Access is on, so on that engine a click
      // leaves `document.activeElement` on <body> and there is no prior focus
      // for the drawer to restore — the assertion would be about the platform
      // rather than the component. Verified: focus, Enter, Escape returns focus
      // to the trigger in webkit. This is also the path SC 2.4.3 is about.
      await trigger.focus();
      await page.keyboard.press("Enter");
      await expect(page.locator(DIALOG)).toBeVisible();

      await page.keyboard.press("Escape");
      await expect(page.locator(DIALOG)).not.toBeVisible();
      await expect(trigger).toBeFocused();
    });

    test("traps Tab within the drawer", async ({ page }) => {
      await gotoFixture(page, "Drawer", "with-trigger");
      await page.locator("[data-harness-trigger]").click();
      await expect(page.locator(DIALOG)).toBeVisible();

      for (let i = 0; i < 6; i++) await page.keyboard.press("Tab");

      const inside = await page.evaluate(
        () => !!document.activeElement?.closest('[role="dialog"]'),
      );
      expect(inside, "Tab escaped the drawer").toBe(true);
    });
  });

  test.describe("Gestures", () => {
    test("dismisses a bottom sheet on a downward swipe", async ({ page }) => {
      await gotoFixture(page, "Drawer", "swipeable-bottom");
      const dialog = page.locator(DIALOG);
      await expect(dialog).toBeVisible();

      const box = (await dialog.boundingBox())!;
      const x = box.x + box.width / 2;
      const start = box.y + 12;
      // Kept inside the viewport. The drag used to end at `box.y + box.height`,
      // which on a 1280x720 desktop viewport is below the bottom edge; Chromium
      // still reports pointer events there and Firefox does not deliver them at
      // all — not even on `window` — so the sheet never saw the end of the drag
      // and never dismissed. The travel below is still well past the dismissal
      // threshold, so the assertion is unchanged in substance.
      const viewport = page.viewportSize()!;
      const finish = Math.min(start + box.height, viewport.height - 2);

      await page.mouse.move(x, start);
      await page.mouse.down();
      // Intermediate moves, not a single jump: the drag handler reads deltas
      // between pointer events, and headless chromium delivers exactly the
      // moves that are asked for (E2E-INVENTORY.md, resizablepanel).
      for (let i = 1; i <= 8; i++) {
        await page.mouse.move(x, start + ((finish - start) * i) / 8);
      }
      await page.mouse.up();

      await expect(dialog).not.toBeVisible();
    });

    test("raises the panel when the snap point index rises", async ({ page }) => {
      await gotoFixture(page, "Drawer", "snap-points");
      const dialog = page.locator(DIALOG);
      await expect(dialog).toBeVisible();

      // A snap point moves the panel, it does not resize it: the fraction
      // becomes a `translateY` percentage, so the observable is the top edge.
      const topAt = async (index: number) => {
        await page.locator(`[data-harness-index="${index}"]`).click();
        await page.waitForTimeout(500);
        return (await dialog.boundingBox())!.y;
      };

      const low = await topAt(0);
      const high = await topAt(2);
      expect(high).toBeLessThan(low);
    });
  });

  /**
   * A top or bottom sheet scrolls by touch, and dismisses from its handle.
   *
   * Both sheets carried `touch-action: pan-x`, which hands every vertical
   * gesture to the page: a finger in the content of a tall bottom sheet
   * scrolled nothing (scrollTop 0 after a 150px drag), and on a top sheet,
   * where "more content" and "dismiss" are the same direction, every vertical
   * drag closed it. Measured with real touch input in Mobile Chrome.
   *
   * The browser decides touch-action at touchstart, before the page knows the
   * direction or the scroll position, and a pan it has started cannot be taken
   * back — so the sheet leaves its content to the browser and starts the
   * dismiss drag only from the handle or the header, which take
   * `touch-action: none`.
   */
  test.describe("Sheet touch", () => {
    for (const side of ["top", "bottom"] as const) {
      const fixture = `tall-swipeable-${side}`;
      const dismiss = side === "bottom" ? 1 : -1;

      test(`${fixture}: a touch drag in the content scrolls it, and one on the handle dismisses`, async ({ page }, info) => {
        test.skip(info.project.name !== "Mobile Chrome", "real touch input through CDP");
        await gotoFixture(page, "Drawer", fixture);
        const panel = page.locator(DIALOG);
        await expect(panel).toBeVisible();
        await page.waitForFunction(() => getComputedStyle(document.querySelector("[data-drawer-panel]")!).transform === "matrix(1, 0, 0, 1, 0, 0)", undefined, { polling: "raf" });
        const cdp = await page.context().newCDPSession(page);
        const drag = async (x: number, y: number, dy: number) => {
          await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] });
          for (let i = 1; i <= 12; i++) await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x, y: y + (dy * i) / 12 }] });
          await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
        };

        const box = (await panel.boundingBox())!;
        const x = box.x + box.width / 2;
        // Finger up: toward more content on both sheets.
        await drag(x, box.y + box.height / 2, -150);
        await expect.poll(() => panel.evaluate((p) => p.scrollTop), { message: "a drag in the content did not scroll it" }).toBeGreaterThan(0);
        const scrolled = await panel.evaluate((p) => Math.round(p.scrollTop));
        await expect(panel, "a drag in the content dismissed the sheet").toBeVisible();

        const handle = (await panel.locator("[data-drawer-handle]").boundingBox())!;
        await drag(x, handle.y + handle.height / 2, 150 * dismiss);
        console.log(`SHEET_TOUCH ${fixture}: content drag scrollTop=${scrolled}, open after; handle drag dismissed`);
        await expect(panel, "a drag on the handle did not dismiss the sheet").toHaveCount(0);
      });

      test(`${fixture}: content takes touch, the handle and header start the drag`, async ({ page }) => {
        await gotoFixture(page, "Drawer", fixture);
        const panel = page.locator(DIALOG);
        await expect(panel).toBeVisible();
        const actions = await panel.evaluate((p) => ({
          panel: getComputedStyle(p).touchAction,
          handle: getComputedStyle(p.querySelector("[data-drawer-handle]")!).touchAction,
          header: getComputedStyle(p.querySelector("[data-drawer-header]")!).touchAction,
        }));
        expect(actions).toEqual({ panel: "auto", handle: "none", header: "none" });

        // The drag-start rule, through synthetic touch pointers: the engines
        // differ in how they deliver real touch, the rule does not. Capture is
        // a no-op because a synthetic pointer is not an active one.
        const dragFrom = (selector: string) =>
          panel.evaluate((p, { selector, dy }) => {
            Element.prototype.setPointerCapture = () => {};
            Element.prototype.releasePointerCapture = () => {};
            const el = p.querySelector(selector)!;
            const r = el.getBoundingClientRect();
            const at = (type: string, y: number, buttons: number) =>
              el.dispatchEvent(new PointerEvent(type, { bubbles: true, pointerId: 7, pointerType: "touch", isPrimary: true, button: 0, buttons, clientX: r.left + 20, clientY: y }));
            const y0 = r.top + Math.min(10, r.height / 2);
            at("pointerdown", y0, 1);
            for (let i = 1; i <= 6; i++) at("pointermove", y0 + (dy * i) / 6, 1);
            at("pointerup", y0 + dy, 0);
          }, { selector, dy: 200 * dismiss });

        await dragFrom("p");
        await expect(panel, "a touch drag that started in the content dismissed the sheet").toBeVisible();
        await dragFrom("[data-drawer-header]");
        await expect(panel, "a touch drag on the header did not dismiss the sheet").toHaveCount(0);
        console.log(`SHEET_RULE ${fixture}: ${JSON.stringify(actions)}; content drag kept it open, header drag dismissed`);
      });
    }
  });

  test.describe("Accessibility", () => {
    test("passes an axe audit", async ({ page }) => {
      await gotoFixture(page, "Drawer", "open");
      await injectAxe(page);
      await checkA11y(page, DIALOG, { detailedReport: true });
    });
  });

  test.describe("Mobile", () => {
    test("renders within the viewport at 375px", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await gotoFixture(page, "Drawer", "open");

      const dialog = page.locator(DIALOG);
      await expect(dialog).toBeVisible();
      const box = (await dialog.boundingBox())!;
      expect(box.width).toBeLessThanOrEqual(375);
    });

    test("opens from a tap", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await gotoFixture(page, "Drawer", "with-trigger");
      await page.locator("[data-harness-trigger]").click();
      await expect(page.locator(DIALOG)).toBeVisible();
    });
  });

  test.describe("Visual Stability", () => {
    test("does not shift the page when it opens", async ({ page }) => {
      await gotoFixture(page, "Drawer", "with-trigger");
      const before = await page.evaluate(() => document.body.scrollWidth);

      await page.locator("[data-harness-trigger]").click();
      await expect(page.locator(DIALOG)).toBeVisible();

      const after = await page.evaluate(() => document.body.scrollWidth);
      expect(after).toBe(before);
    });
  });
});
