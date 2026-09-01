import { test, expect } from "@playwright/test";
import { injectAxe, checkA11y } from "axe-playwright";
import { gotoFixture } from "./_nav";

/**
 * Repointed from /drawer to fixture pages.
 *
 * Every test here used to open the drawer via
 * `getByRole("button", { name: "Navigation Menu" })`. That label, and five
 * others the spec relied on, had been gone from the demo for some time — all 18
 * tests failed on the same timeout (E2E-INVENTORY.md). The behaviour under test
 * is unchanged; what it renders against is a fixture with no prose to drift.
 */

const DIALOG = '[role="dialog"]';

test.describe("Drawer", () => {
  test.describe("Basic Functionality", () => {
    test("opens on trigger click", async ({ page }) => {
      await gotoFixture(page, "Drawer", "with-trigger");
      await expect(page.locator(DIALOG)).toHaveCount(0);

      await page.locator("[data-harness-trigger]").click();

      const dialog = page.locator(DIALOG);
      await expect(dialog).toBeVisible();
      await expect(dialog).toHaveAttribute("aria-modal", "true");
    });

    test("closes on Escape", async ({ page }) => {
      await gotoFixture(page, "Drawer", "with-trigger");
      await page.locator("[data-harness-trigger]").click();
      await expect(page.locator(DIALOG)).toBeVisible();

      await page.keyboard.press("Escape");
      await expect(page.locator(DIALOG)).not.toBeVisible();
    });

    test("closes on overlay click", async ({ page }) => {
      await gotoFixture(page, "Drawer", "with-trigger");
      await page.locator("[data-harness-trigger]").click();
      await expect(page.locator(DIALOG)).toBeVisible();

      // Let the open transition settle before clicking: the overlay animates
      // its opacity, so a click that races it either misses or waits out the
      // actionability check.
      await page.locator("[data-drawer-overlay]").waitFor({ state: "visible" });
      await page.waitForTimeout(400);
      await page.mouse.click(5, 5);
      await expect(page.locator(DIALOG)).not.toBeVisible();
    });

    test("closes via the close button", async ({ page }) => {
      await gotoFixture(page, "Drawer", "with-trigger");
      await page.locator("[data-harness-trigger]").click();
      const dialog = page.locator(DIALOG);
      await expect(dialog).toBeVisible();

      const close = dialog.locator("[data-drawer-close]");
      await expect(close).toBeVisible();
      await close.click();
      await expect(dialog).not.toBeVisible();
    });
  });

  test.describe("Directions", () => {
    for (const [fixture, direction] of [
      ["open", "right"],
      ["open-left", "left"],
    ] as const) {
      test(`renders the ${direction} drawer`, async ({ page }) => {
        await gotoFixture(page, "Drawer", fixture);
        const dialog = page.locator(DIALOG);
        await expect(dialog).toBeVisible();
        await expect(dialog).toHaveAttribute("aria-modal", "true");
      });
    }
  });

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

  test.describe("Non-Modal Drawer", () => {
    test("opens without aria-modal", async ({ page }) => {
      await gotoFixture(page, "Drawer", "with-trigger-non-modal");
      await page.locator("[data-harness-trigger]").click();

      const dialog = page.locator(DIALOG);
      await expect(dialog).toBeVisible();
      await expect(dialog).not.toHaveAttribute("aria-modal", "true");
    });

    test("leaves the page behind it interactive", async ({ page }) => {
      await gotoFixture(page, "Drawer", "with-trigger-non-modal");
      const trigger = page.locator("[data-harness-trigger]");
      await trigger.click();
      await expect(page.locator(DIALOG)).toBeVisible();

      await expect(trigger).toBeEnabled();
    });
  });

  test.describe("Keep Mounted", () => {
    test("keeps the panel in the DOM while closed", async ({ page }) => {
      await gotoFixture(page, "Drawer", "closed-kept-mounted");
      const dialog = page.locator(DIALOG);
      await expect(dialog).toBeAttached();

      // `keepMounted` parks the panel off-screen rather than unmounting it, so
      // "not visible" is the wrong question — Playwright counts an element with
      // a box as visible wherever it sits.
      const box = (await dialog.boundingBox())!;
      expect(box.x + box.width).toBeLessThanOrEqual(0);
    });
  });

  test.describe("Accessibility", () => {
    test("has a dialog role and a label", async ({ page }) => {
      await gotoFixture(page, "Drawer", "open");
      const dialog = page.locator(DIALOG);
      await expect(dialog).toBeVisible();

      const labelled = await dialog.evaluate(
        (el) =>
          el.hasAttribute("aria-label") || el.hasAttribute("aria-labelledby"),
      );
      expect(labelled, "the dialog has no accessible name").toBe(true);
    });

    test("passes an axe audit", async ({ page }) => {
      await gotoFixture(page, "Drawer", "open");
      await injectAxe(page);
      await checkA11y(page, DIALOG, { detailedReport: true });
    });

    test("respects prefers-reduced-motion", async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await gotoFixture(page, "Drawer", "open");

      const dialog = page.locator(DIALOG);
      await expect(dialog).toBeVisible();
      const classes = (await dialog.getAttribute("class")) ?? "";
      expect(
        classes.split(/\s+/).filter((c) => /^(transition|duration|animate)-/.test(c)),
        "the drawer animated under prefers-reduced-motion",
      ).toEqual([]);
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
