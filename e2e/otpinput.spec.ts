import { test, expect } from "./_test";
import { activateByTouch, skipWithoutTouchEvents } from "./_helpers";
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
    await checkA11y(page, "[data-fixture]", { detailedReport: true });
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
    await skipWithoutTouchEvents(test, page);

    await page.setViewportSize({ width: 375, height: 667 });
    await gotoFixture(page, "OtpInput", "default");

    const first = page.locator(INPUTS).first();
    await activateByTouch(page, first);
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

  /**
   * L21. The cell selects its digit on focus, and WebKit then places its own
   * click caret after the click event — a late `selectionchange` collapsed
   * the selection from 0–1 to 1–1, so with `maxLength={1}` the typed digit was
   * refused and focus stayed put. Chromium and Firefox kept the selection.
   */
  test("replaces a filled cell's digit when it is clicked and typed into", async ({ page }) => {
    await gotoFixture(page, "OtpInput", "with-value");

    const inputs = page.locator(INPUTS);
    await expect(inputs.nth(1)).toHaveValue("2");
    await inputs.nth(1).click();
    await page.keyboard.type("9");

    await expect(inputs.nth(1)).toHaveValue("9");
    await expect(inputs.nth(0)).toHaveValue("1");
    await expect(inputs.nth(2)).toBeFocused();
  });
});
