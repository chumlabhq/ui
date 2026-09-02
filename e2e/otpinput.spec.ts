import { test, expect } from "@playwright/test";
import { injectAxe, checkA11y } from "axe-playwright";
import { gotoFixture } from "./_nav";

/**
 * Five of otpinput.spec.ts's thirty-nine tests (E2E-TRIAGE.md, Appendix B).
 *
 * The other thirty-four duplicated OtpInput.test.tsx — every arrow key, every
 * paste path, the disabled state, the ARIA wiring — or measured the dev
 * server's speed. What is left needs a real browser: axe, a viewport, a touch,
 * and where focus actually lands.
 */

const INPUTS = "[data-fixture] input";

test.describe("OtpInput (fixtures)", () => {
  test("passes an axe audit", async ({ page }) => {
    await gotoFixture(page, "OtpInput", "labelled");
    await injectAxe(page);
    // `color-contrast` off, and only that: OtpInput is on the
    // `--cl-text-tertiary` baseline in docs/adr/002-unrenderable-keys.json,
    // one token awaiting a design decision and already ratcheted by
    // accessibility.spec.ts.
    await checkA11y(page, "[data-fixture]", {
      detailedReport: true,
      axeOptions: { rules: { "color-contrast": { enabled: false } } },
    });
  });

  test("fits every slot inside a 375px viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await gotoFixture(page, "OtpInput", "default");

    const inputs = page.locator(INPUTS);
    const count = await inputs.count();
    expect(count).toBe(4);

    for (let i = 0; i < count; i++) {
      const box = (await inputs.nth(i).boundingBox())!;
      expect(box.x, `slot ${i} starts off-screen`).toBeGreaterThanOrEqual(-1);
      expect(box.x + box.width, `slot ${i} overflows 375px`).toBeLessThanOrEqual(376);
    }
  });

  test("accepts a digit from a touch", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await gotoFixture(page, "OtpInput", "default");

    // Dispatched rather than `tap()`: `hasTouch` is off in the desktop
    // projects and `tap()` throws there instead of degrading.
    const first = page.locator(INPUTS).first();
    await first.dispatchEvent("touchstart");
    await first.dispatchEvent("touchend");
    await first.click();
    await page.keyboard.type("7");

    await expect(first).toHaveValue("7");
  });

  test("keeps each slot at a usable touch target size", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await gotoFixture(page, "OtpInput", "default");

    // WCAG 2.5.5 asks for 44px; the library ships smaller slots so six fit on a
    // narrow screen. 32px is the line below which the control is unusable by
    // thumb, and it is what this asserts rather than the standard.
    const box = (await page.locator(INPUTS).first().boundingBox())!;
    expect(box.width).toBeGreaterThanOrEqual(32);
    expect(box.height).toBeGreaterThanOrEqual(32);
  });

  test("advances real focus as digits are typed", async ({ page }) => {
    await gotoFixture(page, "OtpInput", "default");

    const inputs = page.locator(INPUTS);
    await inputs.first().click();
    await page.keyboard.type("12");

    // `document.activeElement`, not a handler spy: the jsdom equivalent asserts
    // the component called focus(), which is not the same as the browser
    // honouring it.
    await expect(inputs.nth(2)).toBeFocused();
  });
});
