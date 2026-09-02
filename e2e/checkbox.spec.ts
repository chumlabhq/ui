import { test, expect } from "@playwright/test";
import { injectAxe, checkA11y } from "axe-playwright";
import { gotoFixture } from "./_nav";

/**
 * Six of checkbox.spec.ts's thirty-one tests (E2E-TRIAGE.md, Appendix B).
 *
 * Twenty-three duplicated Checkbox.test.tsx — every state, every ARIA link,
 * Space activation, id generation — and two measured the dev server. What is
 * left is tab order, where focus lands after a click, axe and a viewport.
 */

const BOX = '[data-fixture] input[type="checkbox"]';

test.describe("Checkbox (fixtures)", () => {
  test("moves between checkboxes in document order", async ({ page }) => {
    await gotoFixture(page, "Checkbox", "siblings");

    const boxes = page.locator(BOX);
    await expect(boxes).toHaveCount(3);

    for (let i = 0; i < 10; i++) {
      await page.keyboard.press("Tab");
      if (await boxes.first().evaluate((el) => document.activeElement === el)) break;
    }
    await expect(boxes.first()).toBeFocused();

    await page.keyboard.press("Tab");
    // Straight to the third: the middle one is disabled, and skipping it is
    // the browser's own sequential-navigation rule, not the component's.
    await expect(boxes.nth(2)).toBeFocused();
  });

  test("does not give a disabled checkbox focus", async ({ page }) => {
    await gotoFixture(page, "Checkbox", "siblings");

    const disabled = page.locator(BOX).nth(1);
    await expect(disabled).toBeDisabled();

    for (let i = 0; i < 10; i++) await page.keyboard.press("Tab");

    const focusedDisabled = await disabled.evaluate(
      (el) => document.activeElement === el,
    );
    expect(focusedDisabled, "Tab landed on the disabled checkbox").toBe(false);
  });

  test("keeps focus on the checkbox after a click", async ({ page }) => {
    await gotoFixture(page, "Checkbox", "labelled");

    const box = page.locator(BOX);
    await box.click();

    await expect(box).toBeChecked();
    // Where the browser puts focus after a click, which the onFocus/onBlur
    // handler tests in jsdom cannot answer.
    await expect(box).toBeFocused();
  });

  test("passes an axe audit", async ({ page }) => {
    await gotoFixture(page, "Checkbox", "labelled");
    await injectAxe(page);
    await checkA11y(page, "[data-fixture]", { detailedReport: true });
  });

  test("fits inside a 375px viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await gotoFixture(page, "Checkbox", "labelled");

    const control = page.locator("[data-fixture]").first();
    const box = (await control.boundingBox())!;
    expect(box.x).toBeGreaterThanOrEqual(-1);
    expect(box.x + box.width).toBeLessThanOrEqual(376);
  });

  test("toggles from a touch", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await gotoFixture(page, "Checkbox", "labelled");

    // Dispatched rather than `tap()`: `hasTouch` is off in the desktop
    // projects and `tap()` throws there instead of degrading.
    const box = page.locator(BOX);
    await box.dispatchEvent("touchstart");
    await box.dispatchEvent("touchend");
    await box.click();

    await expect(box).toBeChecked();
  });
});
