import { test, expect } from "@playwright/test";
import { readdirSync, existsSync, readFileSync, statSync } from "node:fs";
import { gotoFixture, fixturePath } from "./_nav";
import { decodePng, inkOf } from "./_png";

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
 * One fixture per component: the plainest state that actually renders it.
 *
 * Every fixture at every width in both themes is 330 x 6 x 2 screenshots, which
 * is a gate nobody runs. The plainest state catches the changes a visual gate
 * is for — spacing, colour, type, border radius — because those are shared
 * across a component's states.
 *
 * "Plainest" alone picked five subjects that render almost nothing, and one —
 * Avatar's `image`, whose src is an unreachable URL — that rendered a single
 * flat colour: 0 pixels of content, held steady forever. The five were chosen
 * by measuring the painted pixels of every fixture (see MIN_INK below), not by
 * reading the fixture names.
 */
const SUBJECTS: Array<{ component: string; fixture: string }> = [
  { component: "Accordion", fixture: "single-open" },
  { component: "Avatar", fixture: "in-group" },
  { component: "Breadcrumb", fixture: "default" },
  { component: "Button", fixture: "with-icons" },
  { component: "CascadingDropdown", fixture: "closed" },
  { component: "Checkbox", fixture: "labelled" },
  { component: "CountryFlag", fixture: "resolved" },
  { component: "DatePicker", fixture: "closed" },
  { component: "Drawer", fixture: "open" },
  { component: "Dropdown", fixture: "closed" },
  { component: "Input", fixture: "labelled" },
  { component: "InternationalPhoneInput", fixture: "default" },
  { component: "Loader", fixture: "sized" },
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
  { component: "Switch", fixture: "labelled" },
  { component: "TabPanel", fixture: "default" },
  { component: "Table", fixture: "default" },
  { component: "TextArea", fixture: "labelled" },
  { component: "TimePicker", fixture: "closed" },
  { component: "Toast", fixture: "default" },
  { component: "Tooltip", fixture: "open" },
];

/**
 * The surfaces, open.
 *
 * 30 of 364 fixtures had a baseline and every one of them was a resting state:
 * a closed trigger, a bare control. The panels — every dropdown menu, the
 * calendar, the clock face, the overflow menu, the column filter — had none,
 * and they are the exact code the composition phase rewrote onto MenuSurface.
 * A visual gate that photographs the triggers and never the menus is watching
 * the part that did not change.
 *
 * `open-submenu` and `open-clock` rather than `open`: the submenu and the clock
 * are separate surfaces from the menu that reveals them, and a baseline of the
 * first level would not move if either broke.
 */
const OPEN_SUBJECTS: Array<{
  component: string;
  fixture: string;
  surface?: string;
}> = [
  { component: "Dropdown", fixture: "open" },
  { component: "SearchableDropdown", fixture: "open" },
  { component: "MultiSelectDropdown", fixture: "open" },
  { component: "MultiSelectSearchableDropdown", fixture: "open" },
  { component: "CascadingDropdown", fixture: "open-submenu" },
  // `open-with-value`, not `open`. `open` passes no value, so the calendar
  // renders the CURRENT month with a ring on today — a baseline that fails at
  // every midnight, and did: this one was recorded on the 5th and reported 410
  // differing pixels on the 6th, the ring one cell to the right. It is the same
  // defect the clock face had, found the same way, and the same remedy applies.
  // The fixture itself stays as it is: "open with nothing selected" is a state
  // the contract tier needs, and it is the subject that has to move.
  { component: "DatePicker", fixture: "open-with-value" },
  { component: "TimePicker", fixture: "open" },
  // The clock face was left out on the first pass: `open-clock` passed no
  // `defaultValue`, so the dial rendered the CURRENT time and the hand sat at a
  // different angle every run — 96 to 295 differing pixels at both widths. The
  // fixture now pins 09:30. Widening `maxDiffPixels` instead would also have
  // swallowed every real change to the dial around the hand.
  { component: "TimePicker", fixture: "open-clock" },
  { component: "Breadcrumb", fixture: "collapsed-open" },
  { component: "Pagination", fixture: "rows-per-page-open" },
  {
    component: "Table",
    fixture: "filter-open",
    // Table's column filter menu was a plain portalled `div` with no `role`,
    // so the role-based wait every other surface uses could not see it. It has
    // `role="menu"` now, but the attribute selector is kept: it is the one
    // surface whose wait should not depend on semantics this branch added.
    surface: "[data-table-filter-content]",
  },
];

/**
 * Two widths, not six.
 *
 * The six in `WIDTHS` exist to check that the page reflows — a floating surface
 * does not take part in that. It is portalled out of the document flow,
 * positioned against its anchor and clamped to the viewport, so the only
 * question a width can answer about it is whether it has room. 320 is the
 * tightest clamp the responsive claim covers and 1024 is the first width where
 * every surface has its natural size; 375 and 768 clamp the same way as 320,
 * and 1440 and 1920 are the same natural size as 1024.
 *
 * Six widths here would be 144 baselines to answer a two-valued question.
 */
const OPEN_WIDTHS = [320, 1024];

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
    const resting = SUBJECTS.length * WIDTHS.length * 2;
    const open = OPEN_SUBJECTS.length * OPEN_WIDTHS.length * 2;
    expect(
      pngs.length,
      `expected ${resting + open} baselines — ${SUBJECTS.length} resting subjects x ` +
        `${WIDTHS.length} widths x 2 themes, plus ${OPEN_SUBJECTS.length} open surfaces x ` +
        `${OPEN_WIDTHS.length} widths x 2 themes`,
    ).toBe(resting + open);
  });

  /**
   * Floors, not thresholds. Their job is to separate "renders nothing" from
   * "renders a small thing", and each is set below the weakest baseline that
   * legitimately passes rather than at a round number:
   *
   *   ink     253  ResizablePanel — a 24px divider is the smallest real render
   *   colours  47  CountryFlag/resolved
   *
   * At 150 the ink floor also fails both subjects this spec replaced —
   * Avatar/image at 0 and Loader/default at 127 — which is the point: a floor
   * that would have passed them is a floor that permits the defect it exists
   * to catch.
   *
   * File size decides nothing about blankness, and the first run of this guard
   * is the proof: a 400-byte floor failed Slider, whose 366-byte baseline
   * paints 1789 pixels, because a flat track compresses to almost nothing.
   * Avatar's blank frames ran 204 to 409 bytes, straddling it. The two
   * populations overlap, so the byte check is only ever a truncated-file
   * check, and it is set where it can serve that and nothing else.
   */
  const MIN_INK = 150;
  const MIN_COLOURS = 12;
  const MIN_BYTES = 100;

  test("no baseline is a picture of nothing", () => {
    /**
     * A screenshot assertion compares a baseline against a render. It has
     * nothing to say about whether the baseline was worth recording, so a
     * component that renders an empty box passes forever at full confidence —
     * which is what Avatar did for 12 baselines: one colour, zero pixels of
     * content, and a green run every time.
     */
    // Skipped while snapshots are being rewritten, for the same reason as the
    // count: files are landing on disk underneath the read. In an ordinary run
    // nothing is written at all, and a run that IS writing has already failed
    // on the missing snapshots.
    test.skip(
      test.info().config.updateSnapshots === "all",
      "baselines are being rewritten, so reading them proves nothing",
    );

    const dir = "e2e/visual.spec.ts-snapshots";
    const blank: string[] = [];

    for (const file of readdirSync(dir).filter((f) => f.endsWith(".png"))) {
      const path = `${dir}/${file}`;
      const bytes = statSync(path).size;
      if (bytes < MIN_BYTES) {
        blank.push(`${file}: ${bytes} bytes — truncated`);
        continue;
      }
      const { colours, ink } = inkOf(decodePng(readFileSync(path)));
      if (ink < MIN_INK || colours < MIN_COLOURS) {
        blank.push(`${file}: ${ink} painted pixels in ${colours} colours`);
      }
    }

    expect(
      blank,
      "these baselines record an empty frame — pick a fixture that renders the component",
    ).toEqual([]);
  });

  test("every subject resolves to a real fixture", async ({ page }) => {
    // 41 navigations, each waiting for a client render. The default 30s was
    // enough for 30 and is not for 41.
    test.setTimeout(120_000);
    // A mistyped fixture name renders a diagnostic page, which screenshots
    // perfectly happily and would be baselined as though it were the component.
    const missing: string[] = [];
    for (const { component, fixture } of [...SUBJECTS, ...OPEN_SUBJECTS]) {
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

/**
 * No baseline may depend on the wall clock.
 *
 * Two subjects did, and both were found by accident. The clock face renders the
 * CURRENT time, so `open-clock` was left without a baseline after failing by
 * 96-295 pixels on every run. `DatePicker/open` renders the CURRENT month with
 * a ring on today, so its baseline failed by 410 pixels the first time a run
 * crossed midnight — recorded on the 5th, read on the 6th, the ring one cell
 * along. Both were fixed by pinning the fixture; neither was caught by a gate.
 *
 * This is that gate. Every subject renders twice, 26 hours apart on a faked
 * clock, and the markup has to be identical. It compares HTML rather than
 * pixels because that is what makes the failure legible: the diff names the
 * attribute that moved.
 *
 * Verified by planting both defects back: unpinning `open-clock` and pointing
 * the DatePicker subject at `open` again fails exactly those two and nothing
 * else.
 */
test.describe("baseline determinism", () => {
  const FIXED = new Date("2026-03-11T14:07:00Z");
  const LATER = new Date(FIXED.getTime() + 26 * 60 * 60 * 1000);

  const renderAt = async (page: import("@playwright/test").Page, at: Date, path: string) => {
    // `setFixedTime`, not `install`. `install` also takes over the timers, so a
    // debounce or a mount transition never fires and the difference the test
    // reports is the frozen animation rather than the date. Only `Date.now()`
    // needs to move here.
    await page.clock.setFixedTime(at);
    await page.goto(path);
    await page
      .locator("main[data-fixture-act='applied'], main[data-fixture-act='none']")
      .waitFor({ state: "attached" });
    // Settled means "stopped changing", not "waited a while". Portals mount in
    // a layout effect, several fixtures animate on entry and CountryFlag
    // resolves its flag asynchronously, so a fixed delay reported a different
    // handful of subjects on every run — none of which reads the clock at all.
    await freeze(page);
    // The fixture and its portals, not the whole document. The dev page loads a
    // third-party checkout script that stamps a fresh session id into an iframe
    // on every navigation, and comparing `documentElement` reported all 41
    // subjects as non-deterministic on the strength of that one URL.
    const capture = () =>
      page.evaluate(() => {
        const main = document.querySelector("main")?.outerHTML ?? "";
        const portals = [...document.body.children]
          .filter(
            (child) =>
              child.id !== "root" &&
              !/^(SCRIPT|STYLE|LINK|NOSCRIPT|TEMPLATE)$/.test(child.tagName) &&
              !child.className.toString().includes("razorpay"),
          )
          .map((child) => child.outerHTML);
        return (
          [main, ...portals]
            .join("\n")
            // A positioner measures its trigger's box, and that measurement
            // lands half a subpixel apart between two loads — Breadcrumb's menu
            // reported left: 102.25px against 101.703px. Where a surface sits is
            // not what this gate is about, and the surfaces that DO read the
            // clock say so in their content or their transform, neither of which
            // is stripped.
            .replace(/(?:top|left):\s*-?[\d.]+px;?/g, "")
        );
      });

    let previous = await capture();
    for (let attempt = 0; attempt < 10; attempt++) {
      await page.waitForTimeout(150);
      const next = await capture();
      if (next === previous) return next;
      previous = next;
    }
    return previous;
  };

  for (const { component, fixture } of [...SUBJECTS, ...OPEN_SUBJECTS]) {
    test(`${component}/${fixture} renders the same on a different day`, async ({ page }) => {
      const path = fixturePath(component, fixture);
      const first = await renderAt(page, FIXED, path);
      const second = await renderAt(page, LATER, path);
      expect(
        second,
        `${component}/${fixture} renders differently 26 hours later, so its baseline ` +
          `expires. Pin the fixture — a defaultValue or a value — rather than widening ` +
          `maxDiffPixels, which would swallow real changes to the same surface.`,
      ).toBe(first);
    });
  }
});

test.describe("open surfaces", () => {
  for (const width of OPEN_WIDTHS) {
    test.describe(`${width}px`, () => {
      for (const { component, fixture, surface } of OPEN_SUBJECTS) {
        test(`${component} ${fixture} renders as recorded`, async ({ page }) => {
          await page.setViewportSize({ width, height: 900 });
          await gotoFixture(page, component, fixture);
          await page.locator("[data-fixture]").waitFor({ state: "attached" });
          // Three of these open from their fixture's `act`, which the fixture
          // page runs itself. It did not until _act.ts, and they were captured
          // through an explicit trigger click instead — a workaround that hid
          // the fact that the act was doing nothing.
          await page
            .locator("main[data-fixture-act='applied'], main[data-fixture-act='none']")
            .waitFor({ state: "attached" });

          // The surface itself, not the host. Every one of these is portalled,
          // so `[data-fixture]` is an empty box and the panel is elsewhere in
          // the document — which is why the resting-state capture rule already
          // falls back to the page when it finds one.
          await page
            .locator(surface ?? "[role='listbox'],[role='menu'],[role='dialog'],[role='tooltip']")
            .first()
            .waitFor({ state: "visible" });
          await freeze(page);

          for (const theme of ["light", "dark"] as const) {
            await setTheme(page, theme);
            await expect(page).toHaveScreenshot(
              `open-${component}-${fixture}-${theme}-${width}.png`,
              { animations: "disabled", maxDiffPixels: 30 },
            );
          }
        });
      }
    });
  }
});
