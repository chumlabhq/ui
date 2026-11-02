import { test, expect } from "./_test";
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

  test("fails on a route that does not exist", async ({ page }) => {
    // Unmatched paths used to redirect to "/", which is what made the old
    // /demo/<name> URLs pass silently. They render the 404 page now, so the
    // guard has to recognise that page rather than a change of URL.
    const error = await gotoGuarded(page, "/no-such-route", "body").catch(
      (e: Error) => e,
    );
    expect(error, "the guard did not fire on a missing route").toBeInstanceOf(Error);
    expect(String(error)).toContain("/no-such-route");
  });

  test.describe("the paths the suite used to use", () => {
    for (const stale of ["/demo/button", "/demo/input", "/demo/pagination"]) {
      test(`fails on ${stale}`, async ({ page }) => {
        const error = await gotoGuarded(page, stale, "body").catch(
          (e: Error) => e,
        );
        expect(
          error,
          `${stale} did not trip the guard — it silently served another page for the whole suite`,
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

  /**
   * gotoFixture returns once the fixture says it has become the fixture, not
   * after a fixed window.
   *
   * It waited out a 1.5s redirect window on every call, measured from
   * `domcontentloaded`, though the route publishes when it is done:
   * `data-fixture-act` leaves "pending" once the fixture's act has run, and is
   * "none" from the first commit of a fixture without one. Read here from the
   * page's own clock: the call has to return before that window would have
   * closed, 1.5s after `domcontentloaded`, which the old wait never could. Not
   * a bound on the time after the act: that is 182-277 ms on an idle machine
   * and reached 715 ms in a loaded full firefox run. `open-clock` has no act;
   * `Table/cell-editing` has one, which must have run before the call returns.
   */
  test("gotoFixture returns once the fixture has rendered", async ({ page }) => {
    await page.addInitScript(() => {
      new MutationObserver((_, observer) => {
        const act = document.querySelector("main[data-fixture-act]")?.getAttribute("data-fixture-act");
        if (!act || act === "pending") return;
        (window as unknown as { actAt: number }).actAt = performance.now();
        observer.disconnect();
      }).observe(document, { childList: true, subtree: true, attributes: true });
    });
    const after: number[] = [];
    const sinceLoaded: number[] = [];
    for (const [component, fixture] of [
      ["TimePicker", "open-clock"],
      ["TimePicker", "open-clock-12h"],
      ["Table", "cell-editing"],
    ]) {
      await gotoFixture(page, component, fixture);
      const { returned, loaded, act } = await page.evaluate(() => ({
        returned: performance.now() - (window as unknown as { actAt: number }).actAt,
        loaded: performance.now() - (performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming).domContentLoadedEventEnd,
        act: document.querySelector("main[data-fixture-act]")?.getAttribute("data-fixture-act"),
      }));
      after.push(Math.round(returned));
      sinceLoaded.push(Math.round(loaded));
      if (fixture === "cell-editing") expect(act, "gotoFixture returned before the fixture's act had run").toBe("applied");
    }
    console.log(`GOTO_FIXTURE_RETURNS ms after the fixture's act settled: ${after.join(", ")}; after domcontentloaded: ${sinceLoaded.join(", ")}`);
    expect(Math.max(...sinceLoaded), "gotoFixture waited out the 1.5s window after its fixture had become the fixture").toBeLessThan(1500);
  });
});
