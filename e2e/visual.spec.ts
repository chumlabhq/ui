import { test, expect } from "./_test";
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
  // The surplus is the one member of a group that is not an Avatar, and it was
  // in no baseline: `in-group` has no `max`, so nothing ever photographed the
  // count's circle, ring or overlap. Its geometry regressed three times.
  { component: "Avatar", fixture: "group-surplus" },
  // The flag surplus, for the reason the avatar one is here: its geometry is
  // the thing that regresses. It grew with its count and sat outside the row's
  // overlap until this slice, which is the defect AvatarGroup's surplus had
  // three times — and nothing photographed the flag version, so the fix landed
  // against no picture at all. Planted by restoring the break-out geometry:
  // 122 pixels against a budget of 1, at every width.
  { component: "CountryFlag/CountryFlagGroup", fixture: "capped" },
  { component: "Breadcrumb", fixture: "default" },
  // DELETED — Button/with-icons. Button ships no colour of its own: it has a
  // `size` prop and no `variant`, and every painted button in this repo is
  // painted by the consumer's `className`. The baseline was the words "L Save
  // R" in the page's own type, and no plant could fail it — emptying the icon
  // slot changed nothing. A picture of it is a picture of the consumer's CSS.
  { component: "CascadingDropdown", fixture: "closed" },
  { component: "Checkbox", fixture: "labelled" },
  // The checked state, for the same reason as RadioButton above.
  { component: "Checkbox", fixture: "checked" },
  { component: "CountryFlag", fixture: "resolved" },
  { component: "DatePicker", fixture: "closed" },
  { component: "Drawer", fixture: "open" },
  /**
   * The only swipeable subject, and it exists for the grab handle.
   *
   * `Drawer/open` is not swipeable, so the handle rendered in no picture at
   * all: its paint could have been removed and nothing would have counted a
   * pixel. Plant margin measured on the way in: removing the bar's fill
   * (`bg-cl-border-input`) moves 132 pixels against a `maxDiffPixels: 1`
   * budget, at every width.
   */
  { component: "Drawer", fixture: "swipeable-bottom" },
  { component: "Dropdown", fixture: "closed" },
  { component: "Input", fixture: "labelled" },
  { component: "InternationalPhoneInput", fixture: "default" },
  { component: "Loader", fixture: "sized" },
  { component: "Modal", fixture: "open" },
  { component: "MultiSelectDropdown", fixture: "closed" },
  { component: "MultiSelectSearchableDropdown", fixture: "closed" },
  { component: "OtpInput", fixture: "default" },
  { component: "Pagination", fixture: "default" },
  // `with-value`, not `default`: the resting subject has nothing selected, so
  // when 6dd1925 deleted the checked fill this baseline did not move and could
  // not have. A selected radio had never been in a picture.
  { component: "RadioButton", fixture: "with-value" },
  // DELETED — ResizablePanel/default. Its root is `relative` and its handle is
  // absolutely positioned and transparent until interacted with, so the resting
  // baseline was the word "Panel" and nothing else. Removing the handle's
  // positioning moved zero pixels. The component's paint is a focus ring, which
  // `contrast-painted` measures.
  { component: "SearchableDropdown", fixture: "closed" },
  { component: "Slider", fixture: "default" },
  { component: "Stepper", fixture: "horizontal-numbered" },
  { component: "Switch", fixture: "labelled" },
  { component: "TabPanel", fixture: "default" },
  // `iconPosition` had never been rendered by a fixture, so it had never been
  // photographed and had never worked.
  { component: "TabPanel", fixture: "icon-left" },
  { component: "Table", fixture: "default" },
  // A loading state, because none of the other subjects is one: every skeleton
  // in the library changed fill and not a single baseline moved, which is how a
  // fixed grey went on painting 16:1 against a dark page unphotographed.
  { component: "Table", fixture: "loading" },
  { component: "TextArea", fixture: "labelled" },
  { component: "TimePicker", fixture: "closed" },
  { component: "Toast", fixture: "default" },
  { component: "Tooltip", fixture: "open" },
  // The arrow on a rotated side. `open` is top-placed, so the left/right
  // geometry — which is the half that was wrong, the arrow landing 3px onto
  // the bubble with its outline showing — was in no baseline at all. Planted by
  // restoring the un-inset offset: 26 pixels against a budget of 1, at every
  // width.
  { component: "Tooltip", fixture: "open-right-with-arrow" },

  /**
   * Non-resting states. Everything above this line is a component sitting
   * still, which is why a checked checkbox painted white for six days and why
   * every skeleton in the library changed fill with 94 tests passing unchanged:
   * `disabled`, `error` and `focused` had zero subjects across 23, 17 and 7
   * components respectively.
   *
   * Five representatives per state rather than one per component. The styling
   * is shared through tokens, so the same defect surfaces in all of them at
   * once; photographing each would cost 180 baselines to catch it a second
   * time. These are picked for distinct anatomy, not for symmetry.
   */

  // Already broken once. Both were among the 104 state keys 6dd1925 deleted,
  // and a checked switch was pixel-identical to an unchecked one for six days.
  { component: "Switch", fixture: "checked" },
  { component: "RadioButton/RadioButton", fixture: "checked" },
  // The shimmer whose ring vanished under the pulse. A circular skeleton, which
  // `Table/loading` does not cover.
  { component: "Avatar", fixture: "loading" },
  // The canonical surfaces of the two token families with no coverage at all.
  { component: "Input", fixture: "error" },
  { component: "Input", fixture: "disabled" },

  // Distinct anatomies of the same states.
  { component: "Checkbox", fixture: "disabled" },   // disabled that must still show its check
  { component: "Button", fixture: "disabled" },     // the opacity + pointer-events idiom
  // The loader ON a filled button. `Button/loading` sits on the page, where an
  // accent spinner reads fine; the defect only exists where the button is
  // painted, and the library never paints one. The spinner measured 1.00:1
  // against a consumer's accent background — the same value, exactly — so the
  // two demo captions that exist to show `loaderPosition` were the only two
  // with no visible loader. Not a 1.4.11 failure (the state is announced in
  // text by the `role=status` span, which exempts the graphic), so no contrast
  // gate can hold it: it is a picture or it is nothing.
  { component: "Button", fixture: "loading-on-accent" },
  // The size scale, which is public API as of v1 and was a prop that painted
  // nothing before it. Both ends, not one: the two failure modes are a step
  // that stops stepping and a step that moves, and a single subject at `lg`
  // would photograph the second only. `md` is deliberately absent — it is what
  // `Button/default` and `Button/disabled` already photograph.
  //
  // Planted by collapsing the scale so all three render `md`: both fail on the
  // image DIMENSIONS (28 and 52 against 40) before the pixel budget is
  // consulted at all, and 204 and 212 pixels differ against a budget of 30.
  // The one subject in this list that could not fail at its natural size is
  // `loading-on-accent` above, and it says why.
  { component: "Button", fixture: "size-sm" },
  { component: "Button", fixture: "size-lg" },
  // Input and TextArea took the same scale in the same slice, for the same
  // reason — `size` emitted `data-size` and painted nothing in all three. Ends
  // only, again: `md` is what `Input/labelled` and `TextArea/labelled` already
  // photograph, and they render identically to `size-md` because an unset prop
  // paints `md`.
  { component: "Input", fixture: "size-sm" },
  { component: "Input", fixture: "size-lg" },
  { component: "TextArea", fixture: "size-sm" },
  { component: "TextArea", fixture: "size-lg" },
  { component: "OtpInput", fixture: "error" },      // error across sibling boxes, not one field
  { component: "MultiSelectDropdown", fixture: "loading" }, // three nested pulses, un-nested
  { component: "Dropdown", fixture: "disabled" },   // a trigger surface, not a form field

  // Never photographed at all.
  { component: "Avatar/AvatarBadge", fixture: "count-solid" }, // the palette that just changed default
  { component: "Slider", fixture: "disabled" },     // a two-part track and thumb
  { component: "Pagination", fixture: "disabled" }, // disabled arrows, a common real state
  // Toast/default was already a subject. `success` is not, and neither is any
  // other picture of `--cl-success` — the status family has the same total
  // absence of coverage that `--cl-error` had.
  { component: "Toast", fixture: "success" },
  // `all-statuses`, not `with-error`: the latter sets `status` on the step
  // object, which is not the route — `getStepStatus` is, as that fixture's own
  // note says. `with-error` renders no error at all, and this one paints
  // completed, error and pending together.
  { component: "Stepper", fixture: "all-statuses" },

  /**
   * The four control families the target-size fix changed the geometry of.
   * They already fed the a11y sweep, the contrast gate and the classes
   * contracts — what none of those can see is a glyph that grew: axe does not
   * call a 300x300 icon a violation, and `MultiSelectSearchableDropdown`'s did
   * exactly that when its parent changed. These are the pictures.
   */
  { component: "MultiSelectDropdown", fixture: "multi-value" },        // chip remove + clear-all
  { component: "Table", fixture: "selectable" },                       // row select
  { component: "Table", fixture: "expandable" },                       // row expand
  { component: "Table", fixture: "draggable" },                        // drag handle
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
    // so the role-based wait every other surface uses could not see it. It is
    // `role="dialog"` now — a non-modal popup of toggles, not a menu — but the
    // attribute selector is kept: it is the one surface whose wait should not
    // depend on semantics this branch added.
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
 * Right-to-left, one subject per component the A2a slice made follow the page's
 * direction: Accordion and AvatarGroup, which wrote `dir="ltr"` on themselves
 * and so rendered left-to-right in an RTL page, and five whose physical classes
 * became logical ones (Modal's close button, Dropdown's clear button, TextArea's
 * counter, Table's search and pinned divider, Stepper's vertical connector).
 *
 * Then one open surface per positioner A2b made follow the direction: the
 * shared one (SearchableDropdown, the phone input's country list, DatePicker,
 * TimePicker's clock, Breadcrumb's overflow menu) and the two of their own
 * (Table's filter, Tooltip with `align="start"`). Each sits against its
 * trigger's right edge, or, for Table's filter, mirrors LTR's own placement.
 *
 * Then OtpInput, the one paint A2c changed: decision D3 keeps its digit row
 * left to right in a right-to-left page, at the start of the line, under a
 * label that sits at the right. Plant margin measured on the way in:
 * removing the row's `dir="ltr"` puts the two digits in each other's boxes,
 * 132 pixels different at both widths (light, the first theme compared)
 * against the budget of 1. The phone input's number field needs no
 * subject of its own: chromium, firefox and webkit already computed a
 * `type="tel"` field's direction as ltr in a right-to-left page (A2c's step
 * 0), and `country-open-rtl` above, which includes the field, holds it.
 *
 * Then A2d's: the paints that place a value or point along the inline axis.
 * Slider's thumb and fill from the right, a checked Switch's thumb at the left
 * of its track (it painted past the track's right edge before), Table's resize
 * handles on each column's left edge and a collapsed row's expand icon
 * pointing left, Pagination's previous and next chevrons and
 * CascadingDropdown's submenu chevron mirrored. DatePicker's month and year
 * arrows and Breadcrumb's separators mirror inside `open-rtl` and
 * `collapsed-open-rtl` above, whose baselines A2d rewrote.
 *
 * Then A2d2's: the props that named a side, now start and end — Drawer's
 * `side` both ways, ToastProvider's default bottom-end corner, AvatarBadge's
 * top-end corner with its `99+` cap, and ResizablePanel's default end handle
 * between the panes. The text the library writes reads in its own order inside
 * `with-surplus-rtl`, `country-open-rtl`, `open-clock-rtl`, and the "Search…"
 * fields in `open-rtl`, `open-submenu-rtl` and `search-pinned-rtl` above, and
 * Tooltip's arrow sits on its anchor in `align-start-rtl`; A2d2 rewrote those.
 *
 * Each is an `-rtl` fixture, which sets `dir="rtl"` on the document the way a
 * consumer's page does. Two widths, as for the open surfaces: mirroring does
 * not depend on reflow, and 320 and 1024 are the narrowest and the first
 * natural size.
 */
const RTL_SUBJECTS: Array<{ component: string; fixture: string }> = [
  { component: "Accordion", fixture: "single-open-rtl" },
  { component: "Avatar/AvatarGroup", fixture: "with-surplus-rtl" },
  { component: "Modal", fixture: "open-rtl" },
  { component: "Dropdown", fixture: "selected-clearable-rtl" },
  { component: "TextArea", fixture: "with-counter-rtl" },
  { component: "Table", fixture: "search-pinned-rtl" },
  { component: "Stepper", fixture: "vertical-rtl" },
  { component: "SearchableDropdown", fixture: "open-rtl" },
  { component: "InternationalPhoneInput", fixture: "country-open-rtl" },
  { component: "DatePicker", fixture: "open-rtl" },
  { component: "TimePicker", fixture: "open-clock-rtl" },
  { component: "Breadcrumb", fixture: "collapsed-open-rtl" },
  { component: "Table", fixture: "filter-open-rtl" },
  { component: "Tooltip", fixture: "align-start-rtl" },
  { component: "OtpInput", fixture: "with-value-rtl" },
  { component: "Slider", fixture: "rtl" },
  { component: "Switch", fixture: "checked-rtl" },
  { component: "Table", fixture: "resizable-rtl" },
  { component: "Table", fixture: "expandable-rtl" },
  { component: "Pagination", fixture: "default-rtl" },
  { component: "CascadingDropdown", fixture: "open-submenu-rtl" },
  { component: "Drawer", fixture: "open-rtl" },
  { component: "Drawer", fixture: "open-end-rtl" },
  { component: "Toast", fixture: "provider-rtl" },
  { component: "Avatar/AvatarBadge", fixture: "count-overflow-rtl" },
  { component: "ResizablePanel", fixture: "default-rtl" },
];

const RTL_WIDTHS = OPEN_WIDTHS;

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

/**
 * Focused, not resting.
 *
 * `contrast-painted` already measures focus indicators against 3:1 and has
 * caught two regressions. What it cannot see is whether the ring reaches the
 * screen: it reads computed colour before and after focus, so a ring clipped by
 * an ancestor's `overflow`, drawn under a sibling, or offset onto its
 * neighbour all change the same computed values and all pass. Demonstrated —
 * adding `overflow-hidden` to Input's root clips the ring away entirely and the
 * gate still reports `findings=0`.
 *
 * One subject per failure mode, not one per focusable component.
 */
const FOCUS_SUBJECTS: Array<{
  component: string;
  fixture: string;
  target: string;
  /** A key to press after focusing, for a control that moves a highlight rather than focus. */
  drive?: string;
  catches: string;
}> = [
  {
    component: "Input",
    fixture: "labelled",
    target: "input",
    catches: "a ring clipped by an ancestor's overflow",
  },
  // WITHDRAWN — Dropdown's active option. It could not be made to fail: with
  // `data-[highlighted]:bg-cl-bg-hover` deleted the DOM measures transparent,
  // but the screenshot is unchanged, so something between driving the highlight
  // and capturing it loses the state. A subject that cannot fail reads as
  // coverage and is worse than none, so it is not shipped. The defect it found
  // on the way in — five dropdowns emitting `data-highlighted` and styling it
  // nowhere — is fixed and covered by measurement, not by this picture.
  {
    component: "OtpInput",
    fixture: "default",
    target: "input",
    catches: "a ring offset onto the box beside it",
  },
];

test.describe("focus baselines", () => {
  for (const width of WIDTHS) {
    test.describe(`${width}px`, () => {
      for (const { component, fixture, target, drive } of FOCUS_SUBJECTS) {
        test(`${component}/${fixture} focused renders as recorded`, async ({ page }) => {
          await page.setViewportSize({ width, height: 900 });
          await gotoFixture(page, component, fixture);
          await page.locator("[data-fixture]").waitFor({ state: "attached" });
          await freeze(page);

          const el = page.locator(target).first();
          await el.waitFor({ state: "visible" });

          for (const theme of ["light", "dark"] as const) {
            // Theme first, then focus. `setTheme` re-renders through the theme
            // context, and a component holding its highlight in state loses it
            // — Dropdown's `data-highlighted` survived the keypress and was
            // gone by the screenshot, so the subject photographed an open panel
            // with nothing active and its plant could not fail.
            await setTheme(page, theme);
            // `.focus()`, not a click: a click on an option closes the panel,
            // and a pointer focus does not raise `:focus-visible` in Chromium,
            // which is the state every ring in this library is keyed on.
            await el.evaluate((node: HTMLElement) => node.focus());
            if (drive) {
              await page.keyboard.press(drive);
              await page.waitForTimeout(120);
            }
            await expect(page).toHaveScreenshot(
              `focus-${component}-${fixture}-${theme}-${width}.png`,
              { animations: "disabled", maxDiffPixels: 1, threshold: 0.05 },
            );
          }
        });
      }
    });
  }
});

test.describe("visual baselines", () => {
  for (const width of WIDTHS) {
    test.describe(`${width}px`, () => {
      for (const { component, fixture } of SUBJECTS) {
        // The fixture is in the title because a component can have more than one
        // subject now — `Checkbox/labelled` and `Checkbox/checked`. Snapshot
        // filenames already carried it, so no baseline is renamed by this.
        test(`${component}/${fixture} renders as recorded`, async ({ page }) => {
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
                // proved.
                //
                // One, measured rather than chosen. The whole suite run at
                // `maxDiffPixels: 0` reported 437 of 437 comparisons differing
                // by exactly zero — the apparent exception,
                // `InternationalPhoneInput/default` at 6 pixels, was a STALE
                // BASELINE rather than noise and passed twice at zero once
                // re-recorded. So the floor is 0, and 1 is the whole of the
                // insurance this suite needs.
                //
                // It replaced 30, which was slack wide enough to hide a whole
                // subject: 37 subjects photograph something whose smallest
                // painted element is 400px² or less — a 14x14 check glyph, a
                // 10x10 radio dot, a 16x16 chevron — and a 20px loader
                // recoloured against its own background moved fewer than 30
                // pixels, so that subject passed its own plant. All 37 were
                // re-planted at 1 by hiding their smallest painted element
                // with a stylesheet rule: 33 fail, from 2 pixels
                // (`Table/expandable`) to 843 (`Stepper/horizontal-numbered`).
                //
                // THE OTHER AXIS OF THE SAME BLIND SPOT: a change too small
                // per pixel, rather than too small in area, is invisible to
                // any budget, because no pixel is counted in the first place.
                // Pagination's open rows-per-page menu (`Pagination
                // rows-per-page-open`) had its highlighted row's tint deepen
                // from rgb(233, 239, 253) to rgb(223, 232, 252) in light:
                // 2,161 pixels, ΔE76 about 4, visible side by side. The picture
                // PASSED before it was re-recorded, because each pixel's YIQ
                // delta was 0.0295 in light and 0.0316 in dark, against the
                // 0.05 `threshold` below. Zero pixels counted, so
                // `maxDiffPixels: 1` never came into it. The note above covers
                // what the budget cannot see; this is what the threshold
                // cannot: a tint step under 0.05 per pixel, over any area.
                // Measured 2026-09-14 by decoding both PNGs and applying
                // pixelmatch's own YIQ formula.
                //
                // FOUR STILL CANNOT FAIL, and the reason is the comparator
                // rather than this number: `MultiSelectDropdown/closed`,
                // `MultiSelectSearchableDropdown/closed`, `TimePicker/closed`
                // and `MultiSelectDropdown/loading`. All four photograph a
                // 16x16 chevron stroked in a mid-grey, and pixelmatch excludes
                // antialiased pixels by design — decoding the two PNGs and
                // comparing them byte by byte counts 28 differing pixels where
                // Playwright counts 1. No budget reaches that; only a
                // different comparator does. `ssim-cie94` sees all four (26-52
                // px) and is not a drop-in: on a clean run it failed
                // `Slider/disabled` and `CascadingDropdown/open-submenu` at
                // 1110 to 29918 pixels, so adopting it means recording all 437
                // baselines again and calibrating a budget in a different
                // space. That is its own slice, not a number change here.
                maxDiffPixels: 1,
                // Playwright's default per-pixel tolerance is 0.2 YIQ, which is
                // wider than the whole skeleton fill: removing `bg-cl-bg-skeleton`
                // outright — every bar in Table/loading losing its paint — moved
                // zero *counted* pixels, so three loading subjects could not
                // fail for the state they exist to capture. A fill deliberately
                // kept at 1.35:1 needs a tolerance under it.
                threshold: 0.05,
              },
            );
          }
        });
      }
    });
  }

  for (const width of RTL_WIDTHS) {
    test.describe(`${width}px right-to-left`, () => {
      for (const { component, fixture } of RTL_SUBJECTS) {
        test(`${component}/${fixture} renders as recorded`, async ({ page }) => {
          await page.setViewportSize({ width, height: 900 });
          await gotoFixture(page, component, fixture);
          const subject = page.locator("[data-fixture]");
          await subject.waitFor({ state: "attached" });
          expect(await page.evaluate(() => document.documentElement.dir), "the fixture did not set the page right-to-left").toBe("rtl");
          await freeze(page);

          for (const theme of ["light", "dark"] as const) {
            await setTheme(page, theme);
            const portalled = await page
              .locator("[role='dialog'],[role='listbox'],[role='menu'],[role='tooltip']")
              .count();
            // A subject whose whole render is portalled (ToastProvider's region)
            // leaves `[data-fixture]` with no box to photograph, so the page is.
            const empty = await subject.evaluate((el) => {
              const r = el.getBoundingClientRect();
              return r.width === 0 || r.height === 0;
            });
            const target = portalled > 0 || empty ? page : subject;
            // The budget and the threshold of the resting subjects above, for
            // the reasons given there.
            await expect(target).toHaveScreenshot(`${component}-${fixture}-${theme}-${width}.png`, {
              animations: "disabled",
              maxDiffPixels: 1,
              threshold: 0.05,
            });
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
    const focus = FOCUS_SUBJECTS.length * WIDTHS.length * 2;
    const rtl = RTL_SUBJECTS.length * RTL_WIDTHS.length * 2;
    expect(
      pngs.length,
      `expected ${resting + open + focus + rtl} baselines — ${SUBJECTS.length} resting subjects x ` +
        `${WIDTHS.length} widths x 2 themes, plus ${OPEN_SUBJECTS.length} open surfaces x ` +
        `${OPEN_WIDTHS.length} widths x 2 themes, plus ${FOCUS_SUBJECTS.length} focus subjects x ` +
        `${WIDTHS.length} widths x 2 themes, plus ${RTL_SUBJECTS.length} right-to-left subjects x ` +
        `${RTL_WIDTHS.length} widths x 2 themes`,
    ).toBe(resting + open + focus + rtl);
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
 * Reads until two reads agree.
 *
 * Portals mount in a layout effect, several fixtures animate on entry and
 * CountryFlag resolves its flag asynchronously, so a fixed delay reported a
 * different handful of subjects on every run. Returning the last unsettled read
 * instead of failing was worse than either: the comparison downstream then
 * reported "renders differently 26 hours later" about a subject that had simply
 * not finished rendering once.
 */
async function settle(read: () => Promise<string>, unsettled: string): Promise<string> {
  let previous = await read();
  for (let attempt = 0; attempt < 20; attempt += 1) {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const next = await read();
    if (next === previous) return next;
    previous = next;
  }
  throw new Error(unsettled);
}

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
/**
 * The budget, shown to fail.
 *
 * `maxDiffPixels` is the one number in this file that decides whether every
 * other assertion means anything, and it was 30 for months — wide enough that
 * a 20px loader could be recoloured into its own background and pass. A number
 * that has never been shown to bite is a number nobody has tested.
 *
 * `Checkbox/checked` is the case to hold it against: its check glyph is 14x14,
 * the state `6dd1925` deleted library-wide, and hiding it moves 8 pixels.
 * Eight is over 1 and under 30, so this test passes today and would have
 * failed at the old budget — which is exactly the regression it guards. It
 * also guards the comparator: if a Playwright upgrade makes pixelmatch blinder
 * to thin glyphs, this goes red rather than the suite going quietly weak.
 */
test("the budget is tight enough to see a 14x14 glyph disappear", async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 900 });
  await gotoFixture(page, "Checkbox", "checked");
  await freeze(page);
  await setTheme(page, "light");
  const subject = page.locator("[data-fixture]");
  // A stylesheet rule, not an inline style: several fixtures re-render after
  // the mutation and React restores the element, which reported seven subjects
  // as unfailable when this was first measured.
  await page.addStyleTag({ content: "[data-fixture] svg{visibility:hidden!important}" });
  let failed = false;
  try {
    await expect(subject).toHaveScreenshot("Checkbox-checked-light-1024.png", {
      animations: "disabled",
      maxDiffPixels: 1,
      threshold: 0.05,
      timeout: 5000,
    });
  } catch {
    failed = true;
  }
  expect(
    failed,
    "hiding the check glyph did not fail the baseline — the budget or the comparator " +
      "has stopped seeing changes this size, and every small-subject baseline in this " +
      "file is weaker than it reads",
  ).toBe(true);
});

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
        /**
         * Attribute order is normalised; nothing is dropped.
         *
         * `outerHTML` serialises attributes in the order they were first
         * written, which the DOM itself treats as unordered and no screenshot
         * can see. `CountryFlag/resolved` fades its flag in on load, so the
         * inline `style` lands after `src` on the cold first render and before
         * it on the second, when the image is already in the HTTP cache — the
         * same names, the same values, a different order, reported as "renders
         * differently 26 hours later".
         *
         * This is not the `top`/`left` stripping below: every attribute name
         * and value is still compared, so a real difference still fails and
         * still names the attribute.
         */
        const canonical = (node: Node): string => {
          if (node.nodeType === Node.TEXT_NODE) return node.nodeValue ?? "";
          if (node.nodeType === Node.COMMENT_NODE) return `<!--${node.nodeValue ?? ""}-->`;
          if (!(node instanceof Element)) return "";
          const tag = node.tagName.toLowerCase();
          const attrs = [...node.attributes]
            .map((a) => `${a.name}="${a.value}"`)
            .sort()
            .join(" ");
          const children = [...node.childNodes].map(canonical).join("");
          return `<${tag}${attrs ? ` ${attrs}` : ""}>${children}</${tag}>`;
        };

        const mainEl = document.querySelector("main");
        const main = mainEl ? canonical(mainEl) : "";
        const portals = [...document.body.children]
          .filter(
            (child) =>
              child.id !== "root" &&
              !/^(SCRIPT|STYLE|LINK|NOSCRIPT|TEMPLATE)$/.test(child.tagName) &&
              !child.className.toString().includes("razorpay"),
          )
          .map((child) => canonical(child));
        // `top` and `left` are compared, not stripped. They were stripped
        // because Breadcrumb's menu reported `left: 102.25px` against
        // `101.703px` between two loads, and that half-pixel was not noise: the
        // trigger moves when a web font replaces the fallback, and
        // `useAnchoredPosition` had no reason to re-measure, so the surface
        // stayed at the stale coordinate. Stripping the difference hid the
        // defect for two slices and cost a baseline nobody could reproduce.
        return [main, ...portals].join("\n");
      });

    return settle(capture, `${path} never stopped changing`);
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

/**
 * A surface anchored on a cold font cache lands where it lands on a warm one.
 *
 * `Breadcrumb/collapsed-open`'s baseline could not be reproduced: 123 pixels
 * apart at both widths, with every source change stashed and on a fresh dev
 * server, and stable at that. The cause was not the render — it was WHEN the
 * render was measured. Geist arrives from a stylesheet on another origin, and
 * when it lands after the menu has opened it re-lays out the crumbs ahead of
 * the ellipsis trigger: the trigger moved 0.55px left, the menu kept the
 * coordinate measured before the font, and its three labels sat half a pixel
 * off. Delaying the font file by 900ms reproduces the recorded baseline
 * byte-for-byte, which is what identified it.
 *
 * The 26-hour gate above could not see this: both of its renders share one
 * browser context and the font is cached by the second. So this is the other
 * axis — the same subject, once with the font late and once with it cached.
 *
 * Only the open surfaces. Every one of them is positioned from a measured
 * trigger rect, which is the thing a late font moves; the resting subjects are
 * in the document flow and reflow with it.
 */
test.describe("anchored surfaces settle after a late font", () => {
  // The site's own font files. They were fonts.gstatic.com until the fonts were
  // self-hosted under /fonts/, and a pattern left pointing there would match
  // nothing, hold nothing, and compare warm against warm — so the test below
  // also counts what it held.
  const FONT_FILES = /\/fonts\/[^/?]+\.woff2(\?|$)/;

  const markup = async (page: import("@playwright/test").Page, path: string) => {
    await page.goto(path);
    await page
      .locator("main[data-fixture-act='applied'], main[data-fixture-act='none']")
      .waitFor({ state: "attached" });
    await freeze(page);
    return settle(
      () =>
        page.evaluate(() => {
          const portals = [...document.body.children]
            .filter(
              (child) =>
                child.id !== "root" &&
                !/^(SCRIPT|STYLE|LINK|NOSCRIPT|TEMPLATE)$/.test(child.tagName) &&
                !child.className.toString().includes("razorpay"),
            )
            .map((child) => child.getAttribute("style") ?? "");
          return portals.join("\n");
        }),
      `${path} never stopped moving`,
    );
  };

  for (const { component, fixture } of OPEN_SUBJECTS) {
    test(`${component}/${fixture} anchors to the same coordinates`, async ({ page }) => {
      const path = fixturePath(component, fixture);

      // Cold first, and slowly enough that the surface is already open when the
      // font lands. 900ms is the measured margin: the fixture page waits for
      // 120ms of quiet before it runs the act at all.
      let held = 0;
      await page.route(FONT_FILES, async (route) => {
        held += 1;
        await new Promise((resolve) => setTimeout(resolve, 900));
        await route.continue();
      });
      const cold = await markup(page, path);
      expect(held, `${path}: no font file was held, so this compared a warm render with a warm render`).toBeGreaterThan(0);

      await page.unroute(FONT_FILES);
      const warm = await markup(page, path);

      expect(
        cold,
        `${component}/${fixture} is positioned differently when the font arrives late. ` +
          "The surface was measured against a trigger that then moved, and nothing " +
          "re-measured it — see useAnchoredPosition's `loadingdone` subscription.",
      ).toBe(warm);
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
              // Same basis as the resting comparison above, stated again rather
              // than inherited: this call site kept Playwright's 0.2 default
              // for a slice after the other one was tightened, so the fourteen
              // open surfaces were still comparing on the tool's number.
              { animations: "disabled", maxDiffPixels: 1, threshold: 0.05 },
            );
          }
        });
      }
    });
  }
});
