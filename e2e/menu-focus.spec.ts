import { test, expect } from "@playwright/test";
import { gotoFixture } from "./_nav";

/**
 * Focus reaching the inside of a floating surface when it opens.
 *
 * This is the browser half of `measuring-frame.contract`. The surface renders
 * one invisible frame first, because `useAnchoredPosition` cannot measure an
 * element that is not in the DOM — and while that frame used
 * `visibility: hidden` the subtree was not focusable, so every `.focus()` in an
 * open effect did nothing. Measured over ten opens, four components landed
 * focus inside their surface exactly zero times.
 *
 * jsdom cannot catch that: it focuses a `visibility: hidden` element happily.
 * The contract asserts the mechanism; this asserts the behaviour, and it is the
 * one that would fail if the mechanism were changed to something else that also
 * removes the subtree from the focus order.
 *
 * Repeated, because the bug it guards was intermittent before it was constant —
 * a `setTimeout(…, 10)` racing the same frame landed focus one open in ten.
 */
const OPENS = 5;

const CASES = [
  { component: "SearchableDropdown", fixture: "closed", trigger: "[role='combobox']", lands: "input" },
  { component: "MultiSelectSearchableDropdown", fixture: "closed", trigger: "[role='combobox']", lands: "input" },
  { component: "Pagination", fixture: "rows-per-page", trigger: "[aria-haspopup='listbox']", lands: "[role='listbox']" },
  { component: "Breadcrumb", fixture: "collapsed", trigger: "button", lands: "[role='menuitem']" },
];

test.describe("menu focus on open", () => {
  for (const testCase of CASES) {
    test(`${testCase.component} moves focus into its surface, every open`, async ({ page }) => {
      const landings: boolean[] = [];

      for (let open = 0; open < OPENS; open += 1) {
        await gotoFixture(page, testCase.component, testCase.fixture);
        await page.locator(`[data-fixture] ${testCase.trigger}`).first().click();
        await page.locator(testCase.lands).first().waitFor({ state: "attached" });

        landings.push(
          await page.evaluate((selector) => {
            const surface = document.querySelector("[role='listbox'],[role='menu']");
            const target = document.querySelector(selector);
            const active = document.activeElement;
            return !!(surface && active && surface.contains(active) && active === target);
          }, testCase.lands),
        );
      }

      expect(
        landings.filter(Boolean).length,
        `${testCase.component} lost focus into the measuring frame on ` +
          `${landings.filter((l) => !l).length} of ${OPENS} opens`,
      ).toBe(OPENS);
    });
  }

  test("Dropdown keeps focus on its trigger", async ({ page }) => {
    // The other direction. A combobox that does not move focus is not broken —
    // it points at the active option with `aria-activedescendant` — so a fix
    // that pulled focus into every surface would be wrong here.
    await gotoFixture(page, "Dropdown", "closed");
    const trigger = page.locator("[data-fixture] [role='combobox']").first();
    await trigger.click();
    await page.locator("[role='listbox']").waitFor({ state: "attached" });

    expect(
      await page.evaluate(
        () => document.activeElement?.getAttribute("role") === "combobox",
      ),
    ).toBe(true);
  });
});
