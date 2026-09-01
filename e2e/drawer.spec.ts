import { test, expect } from "@playwright/test";
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
      await trigger.click();
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

      await page.mouse.move(x, start);
      await page.mouse.down();
      // Intermediate moves, not a single jump: the drag handler reads deltas
      // between pointer events, and headless chromium delivers exactly the
      // moves that are asked for (E2E-INVENTORY.md, resizablepanel).
      for (let i = 1; i <= 8; i++) {
        await page.mouse.move(x, start + (box.height * i) / 8);
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
