import { test, expect } from "@playwright/test";
import { injectAxe, checkA11y } from "axe-playwright";
import { gotoFixture } from "./_nav";
import { watchClicks, skipWithoutTouchEvents } from "./_helpers";

/**
 * Nine of textarea.spec.ts's thirty-five tests (E2E-TRIAGE.md, Appendix B).
 *
 * Twenty duplicated TextArea.test.tsx, three moved there as unit tests
 * (multiline, Enter for newlines, label-click focus) and two measured the dev
 * server. What is left is tab order, native key activation, axe and geometry.
 */

const TEXTAREA = "[data-fixture] textarea";

const tabTo = async (page: import("@playwright/test").Page, locator: import("@playwright/test").Locator) => {
  for (let i = 0; i < 10; i++) {
    await page.keyboard.press("Tab");
    if (await locator.evaluate((el) => document.activeElement === el)) return;
  }
};

test.describe("TextArea (fixtures)", () => {
  test.describe("Keyboard", () => {
    test("is reachable by Tab", async ({ page }) => {
      await gotoFixture(page, "TextArea", "labelled");

      const textarea = page.locator(TEXTAREA);
      await tabTo(page, textarea);
      await expect(textarea).toBeFocused();
    });

    test("accepts typing once Tab reaches it", async ({ page }) => {
      await gotoFixture(page, "TextArea", "labelled");

      const textarea = page.locator(TEXTAREA);
      await tabTo(page, textarea);
      await page.keyboard.type("typed after tab");

      await expect(textarea).toHaveValue("typed after tab");
    });

    test("moves between two textareas in document order", async ({ page }) => {
      await gotoFixture(page, "TextArea", "siblings");

      const all = page.locator(TEXTAREA);
      await expect(all).toHaveCount(2);

      await tabTo(page, all.first());
      await expect(all.first()).toBeFocused();
      await page.keyboard.press("Tab");
      await expect(all.nth(1)).toBeFocused();
    });

    for (const key of ["Enter", "Space"] as const) {
      test(`activates an icon button on ${key}`, async ({ page }) => {
        await gotoFixture(page, "TextArea", "with-icon-buttons");

        const button = page.getByRole("button", { name: "Format" });
        await expect(button).toBeVisible();
        const clicks = await watchClicks(page);

        await button.focus();
        await page.keyboard.press(key);

        // jsdom never synthesises a click from a key on a <button>, so this is
        // the assertion that cannot move to the unit tier.
        expect(await clicks()).toBeGreaterThan(0);
      });
    }
  });

  test.describe("Accessibility", () => {
    test("passes an axe audit", async ({ page }) => {
      await gotoFixture(page, "TextArea", "labelled");
      await injectAxe(page);
      await checkA11y(page, "[data-fixture]", { detailedReport: true });
    });
  });

  test.describe("Layout", () => {
    test("fits inside a 375px viewport", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await gotoFixture(page, "TextArea", "labelled");

      const box = (await page.locator(TEXTAREA).boundingBox())!;
      expect(box.x).toBeGreaterThanOrEqual(-1);
      expect(box.x + box.width).toBeLessThanOrEqual(376);
    });

    test("spans its container when fullWidth", async ({ page }) => {
      await gotoFixture(page, "TextArea", "full-width");

      const box = (await page.locator(TEXTAREA).boundingBox())!;
      const container = (await page
        .locator("[data-fixture] > div")
        .first()
        .boundingBox())!;

      // The unit tier asserts the `w-full` class; only a browser resolves that
      // into an actual width.
      expect(box.width).toBeGreaterThan(container.width * 0.9);
    });
  });

  test.describe("Mobile", () => {
    test("accepts typing from a touch", async ({ page }) => {
    await skipWithoutTouchEvents(test, page);

      await page.setViewportSize({ width: 375, height: 667 });
      await gotoFixture(page, "TextArea", "labelled");

      // Dispatched rather than `tap()`: `hasTouch` is off in the desktop
      // projects and `tap()` throws there instead of degrading.
      const textarea = page.locator(TEXTAREA);
      await textarea.dispatchEvent("touchstart");
      await textarea.dispatchEvent("touchend");
      await textarea.click();
      await page.keyboard.type("tapped");

      await expect(textarea).toHaveValue("tapped");
    });
  });
});
