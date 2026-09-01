import { test, expect } from "@playwright/test";
import { gotoFixture, gotoGuarded, fixturePath } from "./_nav";

/**
 * The guard's own self-check.
 *
 * hydration.contract taught this lesson: a detector nobody has seen detect
 * anything is indistinguishable from one that is broken. Its console spy saw
 * nothing until it was shown a real mismatch. So before any spec relies on
 * gotoGuarded, prove it fires — including on the exact paths the suite used to
 * navigate to.
 */
test.describe("navigation guard", () => {
  test("passes on a route that exists", async ({ page }) => {
    await gotoFixture(page, "Dropdown", "open");
    await expect(page.locator('[data-fixture="Dropdown/open"]')).toBeVisible();
  });

  test("fails on a route that redirects", async ({ page }) => {
    // Any unmatched path redirects to "/", which is what made the old
    // /demo/<name> URLs pass silently.
    const error = await gotoGuarded(page, "/no-such-route", "body").catch(
      (e: Error) => e,
    );
    expect(error, "the guard did not fire on a redirect").toBeInstanceOf(Error);
    expect(String(error)).toContain("landed on");
  });

  test.describe("the paths the suite used to use", () => {
    for (const stale of ["/demo/button", "/demo/input", "/demo/pagination"]) {
      test(`fails on ${stale}`, async ({ page }) => {
        const error = await gotoGuarded(page, stale, "body").catch(
          (e: Error) => e,
        );
        expect(
          error,
          `${stale} did not trip the guard — it silently served the home page for the whole suite`,
        ).toBeInstanceOf(Error);
        expect(String(error)).toContain(stale);
      });
    }
  });

  test("fails on a fixture name that does not exist", async ({ page }) => {
    const error = await gotoFixture(page, "Dropdown", "no-such-fixture").catch(
      (e: Error) => e,
    );
    expect(error, "a missing fixture resolved silently").toBeInstanceOf(Error);
  });

  test("builds the slug for a sub-component entry", () => {
    expect(fixturePath("RadioButton/RadioButton", "default")).toBe(
      "/__fixtures/RadioButton.RadioButton/default",
    );
  });
});
