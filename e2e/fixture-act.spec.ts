import { expect, test } from "@playwright/test";
import { gotoGuarded } from "./_nav.js";

/**
 * Every fixture act has to do something in a real browser.
 *
 * The acts were written against @testing-library's `fireEvent` and the fixture
 * page never ran them at all, so fifty fixtures named for an interactive state
 * rendered their base state to visual, a11y-full and the e2e specs alike. Three
 * of them were found by hand, when a visual baseline of `Table/filter-open`
 * turned out to be a table with no filter menu.
 *
 * `fixture-act.contract` keeps the jsdom import out. This is the half a type
 * cannot express: the act ran, and the document is not what it was before.
 */
/**
 * Acts that legitimately change nothing on the fixture page, each with why.
 *
 * Almost all of them only flush: `settle` exists because jsdom needs an effects
 * pass before a portal that mounts in a layout effect is in the DOM, and a
 * browser has already committed it by the time the act runs. Declaring them is
 * what keeps "no-op" meaning something for the other 35.
 */
const DECLARED = new Map([
  ...[
    "CascadingDropdown/disabled-top-level",
    "CascadingDropdown/open",
    "CascadingDropdown/open-search",
    "CascadingDropdown/open-empty",
    "CascadingDropdown/loading",
    "CascadingDropdown/async-children-initial",
    "Dropdown/async-load-default-open",
    "MultiSelectDropdown/async-load-default-open",
    "MultiSelectSearchableDropdown/async-initial-load-resolved",
    "MultiSelectSearchableDropdown/async-initial-load-empty",
    "SearchableDropdown/async-initial-load-resolved",
    "SearchableDropdown/async-initial-load-empty",
  ].map((fixture) => [fixture, "flushes effects; the browser has already committed"] as const),
  [
    "DatePicker/marker-tooltip",
    "the tooltip is already open: the calendar focuses a day on mount and the " +
      "marker tooltip now shows on focus as well as hover, so hovering it adds nothing",
  ],
  [
    "Table/pin-hover",
    ":hover is not a state script can dispatch, in any browser. The pin control " +
      "is asserted in table.spec.ts with a real page.hover()",
  ],
]);

test.describe("fixture acts", () => {
  test("every act applies in the browser", async ({ page }) => {
    test.setTimeout(180_000);
    await gotoGuarded(page, "/__fixtures", "[data-fixture-index]");
    const paths = await page.locator("li[data-has-act] a").evaluateAll((links) =>
      links.map((link) => new URL((link as HTMLAnchorElement).href).pathname),
    );

    // A guard on the guard: the index builds this list from the fixture modules,
    // so an empty one means the enumeration broke, not that the acts are gone.
    expect(paths.length).toBeGreaterThan(40);

    const failures: string[] = [];
    const declaredButApplied: string[] = [];
    for (const path of paths) {
      await page.goto(path, { waitUntil: "domcontentloaded" });
      // Wait for a terminal status, and require the element first: a fixture
      // that has not mounted yet has no `main` at all, and reading through the
      // absence reported every slow fixture as "none".
      const status = await page
        .waitForFunction(
          () => {
            const reported = document
              .querySelector("main[data-fixture-act]")
              ?.getAttribute("data-fixture-act");
            return reported && reported !== "none" && reported !== "pending" ? reported : null;
          },
          undefined,
          { timeout: 20_000 },
        )
        .then((handle) => handle.jsonValue() as Promise<string>)
        .catch(() => "never settled");

      const name = path.replace("/__fixtures/", "");
      if (status === "applied") {
        // A declared entry that starts working is a stale declaration, and a
        // stale list is how a real no-op gets waved through later.
        if (DECLARED.has(name)) declaredButApplied.push(name);
      } else if (!(status === "no-op" && DECLARED.has(name))) {
        failures.push(`${name}: ${status}`);
      }
    }

    expect(failures, `${failures.length} of ${paths.length} acts did not apply`).toEqual([]);
    expect(
      declaredButApplied,
      "these are declared as no-ops but now change the page — drop them from DECLARED",
    ).toEqual([]);
  });
});
