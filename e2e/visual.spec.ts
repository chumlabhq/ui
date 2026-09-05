import { test, expect } from "@playwright/test";
import { readdirSync, existsSync } from "node:fs";
import { gotoFixture, fixturePath } from "./_nav";

/**
 * Visual baselines, from the fixtures.
 *
 * `e2e/` contained no `toHaveScreenshot` call at all. The block named "Visual
 * Regression" asserted that a bounding box was non-zero, and ten baseline PNGs
 * sat in a snapshots directory that no assertion referenced — deleted with this
 * spec, because a baseline nothing compares against is worse than none: it
 * looks like coverage.
 *
 * Fixtures rather than demo pages. A demo page is prose around a component and
 * changes whenever the prose does; a fixture is one component in one state, and
 * the contract tier already treats it as the stable surface. A visual gate
 * pointed at demos would fail on every copy edit and be turned off within a
 * month.
 *
 * Both themes, because the `--cl-*` token work moved values in each
 * independently, and a change that only shows in dark is exactly what a
 * light-only baseline misses.
 *
 * Six widths — the ones `validation.responsive` claims coverage at. The suite's
 * five projects render four device viewports between them and none of 320,
 * 1440 or 1920, so the claim has never been checked at three of its six points.
 */
const WIDTHS = [320, 375, 768, 1024, 1440, 1920];

/**
 * One fixture per component: the plainest state each one has.
 *
 * Every fixture at every width in both themes is 330 x 6 x 2 screenshots, which
 * is a gate nobody runs. The plainest state catches the changes a visual gate
 * is for — spacing, colour, type, border radius — because those are shared
 * across a component's states.
 */
const SUBJECTS: Array<{ component: string; fixture: string }> = [
  { component: "Accordion", fixture: "single-open" },
  { component: "Avatar", fixture: "image" },
  { component: "Breadcrumb", fixture: "default" },
  { component: "Button", fixture: "default" },
  { component: "CascadingDropdown", fixture: "closed" },
  { component: "Checkbox", fixture: "default" },
  { component: "CountryFlag", fixture: "resolved" },
  { component: "DatePicker", fixture: "closed" },
  { component: "Drawer", fixture: "open" },
  { component: "Dropdown", fixture: "closed" },
  { component: "Input", fixture: "labelled" },
  { component: "InternationalPhoneInput", fixture: "default" },
  { component: "Loader", fixture: "default" },
  { component: "Modal", fixture: "open" },
  { component: "MultiSelectDropdown", fixture: "closed" },
  { component: "MultiSelectSearchableDropdown", fixture: "closed" },
  { component: "OtpInput", fixture: "default" },
  { component: "Pagination", fixture: "default" },
  { component: "RadioButton", fixture: "default" },
  { component: "ResizablePanel", fixture: "default" },
  { component: "SearchableDropdown", fixture: "closed" },
  { component: "Slider", fixture: "default" },
  { component: "Stepper", fixture: "horizontal-numbered" },
  { component: "Switch", fixture: "default" },
  { component: "TabPanel", fixture: "default" },
  { component: "Table", fixture: "default" },
  { component: "TextArea", fixture: "labelled" },
  { component: "TimePicker", fixture: "closed" },
  { component: "Toast", fixture: "default" },
  { component: "Tooltip", fixture: "open" },
];

/**
 * Both switches, together.
 *
 * The `--cl-*` tokens hang off `:root[data-theme]` while Tailwind's `dark:`
 * variant is `&:where(.dark, .dark *)`. Flipping one and not the other gives a
 * hybrid no user ever sees, which is how an earlier capture on this branch
 * reported a clean run against a render nobody would get.
 */
async function setTheme(page: import("@playwright/test").Page, theme: "light" | "dark") {
  await page.evaluate((next) => {
    const html = document.documentElement;
    html.setAttribute("data-theme", next);
    html.classList.toggle("dark", next === "dark");
  }, theme);
}

/** Animation frozen identically in every capture, or the diff is the frame. */
async function freeze(page: import("@playwright/test").Page) {
  await page.addStyleTag({
    content: "*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}",
  });
  await page.evaluate(() => document.fonts?.ready);
}

test.describe("visual baselines", () => {
  for (const width of WIDTHS) {
    test.describe(`${width}px`, () => {
      for (const { component, fixture } of SUBJECTS) {
        test(`${component} renders as recorded`, async ({ page }) => {
          await page.setViewportSize({ width, height: 900 });
          await gotoFixture(page, component, fixture);
          const subject = page.locator("[data-fixture]");
          // Attached, not visible: Modal and Drawer portal everything, leaving
          // a host element with no box of its own.
          await subject.waitFor({ state: "attached" });
          await freeze(page);

          for (const theme of ["light", "dark"] as const) {
            await setTheme(page, theme);
            // A portalled surface is outside `[data-fixture]`, so an open
            // overlay is captured from the page rather than the host.
            const portalled = await page
              .locator("[role='dialog'],[role='listbox'],[role='menu'],[role='tooltip']")
              .count();
            const target = portalled > 0 ? page : subject;
            await expect(target).toHaveScreenshot(
              `${component}-${fixture}-${theme}-${width}.png`,
              {
                animations: "disabled",
                // An absolute budget, not a ratio. `maxDiffPixelRatio: 0.01`
                // scales with the screenshot, so on a wide capture it allowed
                // ~2000 differing pixels — enough to swallow every rounded
                // corner on a button, which is what a planted radius change
                // proved. Thirty pixels absorbs antialiasing and nothing else.
                maxDiffPixels: 30,
              },
            );
          }
        });
      }
    });
  }

  test("the baseline set is the size it should be", async () => {
    /**
     * The guard against passing on nothing.
     *
     * A per-snapshot miss already fails, but that only covers snapshots the
     * suite still asks for. Empty `SUBJECTS` and the suite collects one test
     * and reports green; delete the directory and there is nothing to compare
     * against at all. Two gates on this branch have been caught passing on an
     * empty set, so the count is asserted rather than assumed.
     */
    // `updateSnapshots` defaults to "missing", not "none" — guarding on
    // `!== "none"` skipped this on every ordinary run, so the guard against a
    // gate that passes on nothing was itself a gate that never ran. Only the
    // explicit `--update-snapshots` flag sets "all".
    test.skip(
      test.info().config.updateSnapshots === "all",
      "baselines are being rewritten, so counting them proves nothing",
    );

    const dir = "e2e/visual.spec.ts-snapshots";
    expect(existsSync(dir), `${dir} is missing — the baselines were never generated`).toBe(true);

    const pngs = readdirSync(dir).filter((f) => f.endsWith(".png"));
    const expected = SUBJECTS.length * WIDTHS.length * 2;
    expect(
      pngs.length,
      `expected ${expected} baselines (${SUBJECTS.length} subjects x ${WIDTHS.length} widths x 2 themes)`,
    ).toBe(expected);
  });

  test("every subject resolves to a real fixture", async ({ page }) => {
    // A mistyped fixture name renders a diagnostic page, which screenshots
    // perfectly happily and would be baselined as though it were the component.
    const missing: string[] = [];
    for (const { component, fixture } of SUBJECTS) {
      await page.goto(fixturePath(component, fixture));
      // Wait for the route to resolve to one or the other. Counting straight
      // after `goto` reads a page that has not rendered yet and finds nothing
      // wrong with any of them — this check passed on three broken subjects
      // before the wait was added.
      await page
        .locator("[data-fixture], [data-fixture-error]")
        .first()
        .waitFor({ state: "attached", timeout: 10000 });
      if (await page.locator("[data-fixture-error]").count()) {
        missing.push(`${component}/${fixture}`);
      }
    }
    expect(missing, "these subjects name a fixture that does not exist").toEqual([]);
  });
});
