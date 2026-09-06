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
          // The surface is the portalled panel, not the listbox inside it. The
          // search field moved out of the listbox when a `listbox` was made to
          // own options and nothing else, so "focus is inside the listbox" is
          // no longer the same question as "focus is inside the popup".
          await page.evaluate((selector) => {
            const target = document.querySelector(selector);
            const surface = [...document.body.children].find(
              (child) => child.id !== "root" && target && child.contains(target),
            );
            const active = document.activeElement;
            return !!(surface && active && active === target && surface.contains(active));
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

/**
 * Every surface, after a mouse open. One row per component, because the defect
 * this guards was engine-specific and only one component had a test.
 *
 * WebKit does not leave focus on a clicked `<button>`. Three components kept
 * focus on their trigger and pointed at the highlighted option with
 * `aria-activedescendant`, so in Safari they described that option to `<body>`;
 * a fourth read `relatedTarget` on blur to decide whether to dismiss, and a
 * `null` from the unfocusable trigger closed the surface which the same click
 * then reopened. Chromium focuses the button and masked all four.
 *
 * `focus` is where the component intends focus to be, not where it happens to
 * land — `trigger` and `surface` are both correct answers and the row says
 * which one this component promises. `<body>` is never a correct answer, and it
 * is the one thing every row rules out.
 */
const SURFACES = [
  { component: "Dropdown", fixture: "closed", trigger: "[role='combobox']", focus: "trigger", secondClick: "closes" },
  { component: "MultiSelectDropdown", fixture: "closed", trigger: "[role='combobox']", focus: "trigger", secondClick: "closes" },
  { component: "CascadingDropdown", fixture: "closed", trigger: "[role='combobox'],button", focus: "trigger", secondClick: "closes" },
  { component: "SearchableDropdown", fixture: "closed", trigger: "[role='combobox']", focus: "surface", secondClick: "closes" },
  { component: "MultiSelectSearchableDropdown", fixture: "closed", trigger: "[role='combobox']", focus: "surface", secondClick: "closes" },
  { component: "DatePicker", fixture: "closed", trigger: "[role='combobox'],button", focus: "surface", secondClick: "closes" },
  { component: "Pagination", fixture: "rows-per-page", trigger: "[aria-haspopup='listbox']", focus: "surface", secondClick: "closes" },
  { component: "Breadcrumb", fixture: "collapsed", trigger: "button", focus: "surface", secondClick: "closes" },
  {
    component: "TimePicker",
    fixture: "closed",
    trigger: "[role='combobox'],button",
    focus: "trigger",
    // Deliberate, and the reason this row is here rather than absent: the input
    // stops the click propagating to the toggling wrapper and only ever opens,
    // because a click into a field you are typing in must not close the picker.
    // Identical in every engine.
    secondClick: "stays-open",
  },
] as const;

const SURFACE_SELECTOR = "[role='listbox'],[role='menu'],[role='dialog']";

test.describe("a mouse open leaves focus somewhere real", () => {
  for (const surface of SURFACES) {
    test(`${surface.component}`, async ({ page }) => {
      await gotoFixture(page, surface.component, surface.fixture);
      const trigger = page.locator(`[data-fixture] ${surface.trigger}`).first();

      await trigger.click();
      await page.locator(SURFACE_SELECTOR).first().waitFor({ state: "attached" });

      // Settled, not sampled. The surface being attached does not mean focus has
      // moved yet — the components that move it do so in an effect after the
      // measuring frame, so reading `activeElement` right here catches the tick
      // before, when focus is still on the trigger. Firefox lost this race once
      // in 428 tests and passed it 3 times out of 3 in isolation, which is what
      // a sampled assertion looks like from the outside.
      await page
        .waitForFunction(
          ({ selector, wantsTrigger }) => {
            const active = document.activeElement;
            if (!active || active === document.body) return false;
            const inSurface = [...document.body.children].some(
              (child) => child.id !== "root" && child.contains(active),
            );
            const element = document.querySelector(`[data-fixture] ${selector}`);
            return wantsTrigger ? active === element : inSurface;
          },
          { selector: surface.trigger, wantsTrigger: surface.focus === "trigger" },
          { timeout: 5000 },
        )
        // Swallowed so the assertions below report what focus actually is. A
        // bare timeout here would say "waitForFunction timed out" and nothing
        // about where focus went, which is the whole question.
        .catch(() => {});

      const landed = await page.evaluate((selector) => {
        const active = document.activeElement as HTMLElement | null;
        const element = document.querySelector(`[data-fixture] ${selector}`);
        return {
          onBody: active === document.body || active === null,
          onTrigger: active === element,
          // Inside the portalled panel, which is what "the surface" means: the
          // panel holds the search field beside the listbox rather than inside
          // it, so a listbox-scoped check would call a landing in the search
          // field a miss.
          inSurface: !!active && [...document.body.children].some(
            (child) => child.id !== "root" && child.contains(active),
          ),
          tag: active?.tagName ?? "none",
        };
      }, surface.trigger);

      expect(
        landed.onBody,
        `${surface.component}: focus is on <body> after a mouse open. Anything ` +
          "the trigger says with aria-activedescendant is being said to nothing.",
      ).toBe(false);

      const held = surface.focus === "trigger" ? landed.onTrigger : landed.inSurface;
      expect(
        held,
        `${surface.component} promises focus on its ${surface.focus} after opening; ` +
          `it landed on <${landed.tag.toLowerCase()}>`,
      ).toBe(true);

      await trigger.click();
      await page.waitForTimeout(150);
      expect(
        await page.locator(SURFACE_SELECTOR).count(),
        `${surface.component}: a second click on the trigger should leave the ` +
          `surface ${surface.secondClick === "closes" ? "closed" : "open"}`,
      ).toBe(surface.secondClick === "closes" ? 0 : 1);
    });
  }
});
