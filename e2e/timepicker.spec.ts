import { test, expect } from "./_test";
import { gotoFixture } from "./_nav";

/**
 * The clock is a popup of the input, not a modal dialog.
 *
 * It declared `aria-modal="true"` and never took focus: opened by click, by
 * ArrowDown or by typing, in chromium, firefox and webkit, the active element
 * stayed the input, and Tab or Enter closed the clock rather than entering it.
 * `aria-modal` tells assistive technology that everything outside the dialog is
 * inert, so the control the user was on was declared out of reach. The input
 * already says what it opens — `aria-haspopup="dialog"`, `aria-expanded` and
 * `aria-controls` — so the clock is tied to it and claims no modality.
 */
const CLOCKS = ["open-clock", "open-clock-12h", "open-bounded"];

for (const fixture of CLOCKS) {
  test(`TimePicker/${fixture}: the open clock is non-modal and tied to the focused input`, async ({ page }) => {
    await gotoFixture(page, "TimePicker", fixture);
    const input = page.locator('[data-fixture] input[role="combobox"]');
    const clock = page.getByRole("dialog");

    const check = async (how: string) => {
      await expect(clock).toBeVisible();
      await expect(input).toBeFocused();
      const state = await clock.evaluate((el) => {
        const field = document.querySelector('[data-fixture] input[role="combobox"]')!;
        return {
          modal: el.getAttribute("aria-modal"),
          id: el.id,
          controls: field.getAttribute("aria-controls"),
          haspopup: field.getAttribute("aria-haspopup"),
          expanded: field.getAttribute("aria-expanded"),
        };
      });
      console.log(`CLOCK_MODALITY ${fixture} ${how}: ${JSON.stringify(state)}`);
      expect(state.modal, "the clock declares the focused input inert").toBeNull();
      expect(state).toMatchObject({ controls: state.id, haspopup: "dialog", expanded: "true" });
    };

    await check("defaultOpen");
    await page.keyboard.press("Escape");
    await expect(clock).toHaveCount(0);
    await input.click();
    await check("opened by click");
    await page.keyboard.press("Escape");
    await page.keyboard.press("ArrowDown");
    await check("opened by ArrowDown");
  });
}
