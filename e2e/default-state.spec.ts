import { readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import ts from "typescript";
import { expect, test } from "./_test";
import { gotoFixture, gotoFixtureIndex } from "./_nav";
import { PAINT_HELPERS } from "./_contrast-measure";
import { BUTTON_SIZE_CLASSES } from "../src/components/Button/utils/constants";
import { componentNames, documentedAttributes, emittedBy, itemSitesOf, loadingRowSitesOf, pressedToggleSitesOf } from "../src/test/emittedAttributes";

/**
 * A state the component reports has to be a state the component shows.
 *
 * `state-replacement.contract` proves the other half of this and says so in its
 * own docblock: that a CONSUMER can still style a state after its `classes` key
 * was deleted. Nobody asked whether the library still styles it. Commit
 * 6dd1925 deleted 104 state keys and the default styling with them —
 * Checkbox's `checked`, RadioButton's `checked`, the Switch's `checkedTracker`,
 * `uncheckedTracker` and `checkedThumb` — and folded none of it onto the
 * surviving keys. For six days a checked checkbox painted a transparent box, a
 * selected radio painted a transparent circle, and a checked switch was
 * pixel-identical to an unchecked one. The contract that authorised the
 * deletion passed throughout, because it was answering the other question.
 *
 * Nothing else could have caught it either. The visual baselines photograph 40
 * resting subjects, so no `checked` state is in a picture at all — and the
 * baselines were recorded on 2026-09-05, two days after the deletion, so they
 * would have been pictures of the regression regardless. axe does not read
 * colour, and the painted-contrast gate measures the contrast of what IS
 * painted rather than asking whether anything should be.
 *
 * So: render the fixtures, find elements that differ only by their state
 * attribute, and require at least one of background, border, colour or
 * transform to differ between them. In a browser, against the real stylesheet —
 * jsdom applies none, and a computed-style comparison there passes for
 * everything.
 *
 * Driven by the migration table rather than a list kept here, so it cannot
 * quietly cover fewer states than it claims: every `deleted-as-state` row whose
 * replacement attribute carries values is a case, and a row added there becomes
 * a case without anyone remembering to add it.
 */

interface Row { component: string; key: string; outcome: string; to: string | null; note: string }
interface Requirement { component: string; part: string; attribute: string; values: string[] | null; fromKeys: string[] }

const read = <T,>(f: string): T => JSON.parse(readFileSync(resolve(process.cwd(), f), "utf8")) as T;

/**
 * Where each part lives in the DOM, shared with the jsdom contracts rather than
 * written again here — a second copy would drift, and a wrong selector in a
 * gate like this reports a false failure rather than staying silent.
 */
const PART_SELECTOR: Record<string, string> = JSON.parse(
  readFileSync(resolve(process.cwd(), "docs/adr/002-part-selectors.json"), "utf8"),
) as Record<string, string>;
const TABLE = read<{ rows: Row[] }>("docs/adr/002-key-migration.json");
const SPEC = read<{ requirements: Requirement[] }>("docs/adr/002-state-attributes.json");

/**
 * The states worth comparing: an attribute with at least two values, so there
 * is a resting value to compare against. A bare `data-disabled` has nothing to
 * contrast with inside one fixture and is left to the visual baselines — see
 * `disabled shows itself` below, which closes exactly that gap. The baselines
 * did not catch it: `Input/disabled` is an empty near-white field on a
 * near-white page, so halving its opacity moves fewer pixels than the diff
 * budget, and the picture passed while the state painted nothing.
 */
const CASES = [
  ...new Map(
    TABLE.rows
      .filter((r) => r.outcome === "deleted-as-state")
      .map((r) => SPEC.requirements.find((q) => q.component === r.component && q.fromKeys.includes(r.key)))
      .filter((q): q is Requirement => Boolean(q?.values && q.values.length > 1))
      .map((q) => [`${q.component}|${q.attribute}`, q]),
  ).values(),
];

test("the migration table still has states to check", () => {
  // A filter that matches nothing is not a pass. If the table is renamed or
  // emptied this fails rather than reporting zero problems.
  expect(CASES.length, "no state cases derived from the migration table").toBeGreaterThan(5);
});

test("the comparison notices a state that stops painting", async ({ page }) => {
  /**
   * Re-deletes what 6dd1925 deleted, in the browser, and requires the paint to
   * follow.
   *
   * This used to flip `data-state` from `checked` to `unchecked` on the
   * element. That stopped proving anything when the cause-5 sweep moved
   * Checkbox's checked, indeterminate, error and success fills OUT of the
   * class string and into a record resolved in JS and merged ahead of the
   * consumer's classes — so `bg-cl-accent` is now on the element unconditionally
   * and flipping the attribute correctly changes nothing. The self-check failed
   * for six runs saying "the paint did not follow the state attribute", which
   * was true and no longer the question.
   *
   * Removing the paint classes from the element asks it the right way round,
   * and works whichever way the state is resolved: if the library still paints
   * `checked`, the classes that do it are on the element, and taking them off
   * has to change what it renders.
   */
  await page.goto("/__fixtures/Checkbox/checked", { waitUntil: "domcontentloaded" });
  await page.locator("[data-fixture]").waitFor({ state: "attached", timeout: 15000 });

  const CONTROL = "[data-fixture] [data-state]";
  const paint = () =>
    page.evaluate((sel) => {
      const el = [...document.querySelectorAll<HTMLElement>(sel)]
        .find((e) => parseFloat(getComputedStyle(e).borderTopWidth) > 0 || getComputedStyle(e).backgroundColor !== "rgba(0, 0, 0, 0)");
      if (!el) return "none";
      const c = getComputedStyle(el);
      return [c.backgroundColor, c.borderTopColor, c.color].join("~");
    }, CONTROL);

  const before = await paint();
  expect(before, "the checked control paints nothing to begin with").not.toBe("none");

  const removed = await page.evaluate((sel) => {
    const el = [...document.querySelectorAll<HTMLElement>(sel)]
      .find((e) => parseFloat(getComputedStyle(e).borderTopWidth) > 0);
    if (!el) return [];
    const gone = [...el.classList].filter((x) => /(^|:)(bg|border)-/.test(x));
    gone.forEach((x) => el.classList.remove(x));
    return gone;
  }, CONTROL);
  expect(removed.length, "no paint classes found on the control to remove").toBeGreaterThan(0);

  // The control carries `transition-colors`, so the value read in the tick the
  // classes change is still the old one animating away. Waited on the
  // transitions themselves rather than slept — the same mistake SC 2.4.7's gate
  // made, where reading in the same tick as `.focus()` had it passing by engine
  // rather than by evidence.
  await page.evaluate(async () => {
    const finite = document
      .querySelectorAll("[data-fixture]")[0]
      .getAnimations({ subtree: true })
      .filter((a) => Number.isFinite(a.effect?.getComputedTiming().endTime ?? Infinity))
      .map((a) => a.finished.catch(() => undefined));
    await Promise.race([Promise.all(finite), new Promise((r) => setTimeout(r, 1000))]);
  });

  const after = await paint();
  expect(after, "the paint did not follow the classes, so the gate is measuring nothing").not.toBe(before);
});

test("every reported state is a visible state", async ({ page }) => {
  test.setTimeout(600_000);
  await gotoFixtureIndex(page);
  const paths = await page.locator("[data-fixture-index] li a").evaluateAll((els) =>
    els.map((e) => new URL((e as HTMLAnchorElement).href).pathname),
  );

  const byComponent = new Map<string, string[]>();
  for (const path of paths) {
    const component = path.split("/")[2];
    if (!byComponent.has(component)) byComponent.set(component, []);
    byComponent.get(component)!.push(path);
  }

  const invisible: string[] = [];
  const compared: string[] = [];

  for (const cse of CASES) {
    for (const path of byComponent.get(cse.component) ?? []) {
      await page.goto(path, { waitUntil: "domcontentloaded" });
      await page.locator("[data-fixture]").waitFor({ state: "attached", timeout: 15000 }).catch(() => {});

      const result = await page.evaluate(
        ([attribute, values, partSelector]) => {
          // Scoped to the part the migration names. Without it every wrapper
          // that merely carries the attribute — Stepper's `<li>`, its layout
          // `<div>` — is compared, and those legitimately look identical
          // because the state is drawn on a child. That produced 90 failures
          // and not one of them was real.
          const scope = [...document.querySelectorAll<HTMLElement>(`[data-fixture] :is(${partSelector})`)];
          const inScope = scope.filter((el) => el.hasAttribute(attribute));

          const paint = (el: HTMLElement) => {
            const c = getComputedStyle(el);
            return [c.backgroundColor, c.borderTopColor, c.borderTopWidth, c.color, c.transform, c.translate, c.opacity].join("~");
          };

          // One element per state value, compared against each other. Not
          // grouped by class: a component may draw a state with a different
          // class rather than a variant, and grouping by class would put the
          // two states in separate groups and compare neither.
          const seen = new Map<string, { paint: string; tag: string }>();
          for (const el of inScope) {
            const v = el.getAttribute(attribute) ?? "";
            if (!values!.includes(v)) continue;
            if (!seen.has(v)) seen.set(v, { paint: paint(el), tag: el.tagName.toLowerCase() });
          }
          if (seen.size < 2) return [];
          const painted = [...seen.values()].map((x) => x.paint);
          return [{
            group: [...seen.values()][0].tag,
            states: [...seen.keys()],
            identical: new Set(painted).size === 1,
          }];
        },
        [cse.attribute, cse.values, PART_SELECTOR[cse.part] ?? "*"] as const,
      );

      for (const r of result) {
        const label = `${cse.component} ${cse.attribute} ${r.states.join(" vs ")} on <${r.group.toLowerCase()}>`;
        compared.push(label);
        if (r.identical) invisible.push(`${label} — ${path}`);
      }
    }
  }

  console.log(`DEFAULT_STATE compared=${compared.length} cases=${CASES.length} invisible=${invisible.length}`);

  // A comparison set that collapses to nothing would pass silently.
  expect(compared.length, "no state pairs were found to compare").toBeGreaterThan(10);
  expect(
    [...new Set(invisible)],
    "these states report themselves in the DOM and paint exactly like their resting state",
  ).toEqual([]);
});

/**
 * A disabled control has to look disabled.
 *
 * A conformance check, not a comparison: it asks whether the element the
 * component itself marks disabled carries any of the three affordances the
 * library uses — reduced opacity, `not-allowed`, or `pointer-events: none` —
 * rather than diffing a disabled fixture against an enabled one. That matters.
 * The comparison version of this, run over five components, found two; asked
 * absolutely across all of them it found **eleven** painting nothing and
 * **eleven** keeping `cursor: pointer` while disabled, which tells a pointer
 * user the control is live. Diffing two fixtures conflates "this state paints
 * nothing" with "these two fixtures differ for other reasons": `Dropdown` read
 * zero differing properties against `closed` and six against `labelled`, and
 * only one of those numbers was about being disabled.
 *
 * In a browser for the same reason the rest of this file is: jsdom applies no
 * stylesheet, so every `data-[disabled]:opacity-50` in the library resolves to
 * nothing there and a computed-style check passes for everyone.
 */
const DISABLED_EXEMPT: Record<string, string> = {
  "CascadingDropdown/disabled-top-level":
    "Disables a menu ITEM, not the trigger, and items do not exist until the " +
    "menu opens. Nothing is marked in the closed fixture this walk sees. The " +
    "open case belongs to cascading-submenu.spec.ts.",
  "Tooltip/disabled":
    "`disabled` suppresses the tooltip rather than styling anything — there is " +
    "no disabled surface to paint, and the trigger stays fully interactive.",
};

test("disabled shows itself", async ({ page }) => {
  test.setTimeout(600_000);
  await gotoFixtureIndex(page);
  const paths = await page.locator("[data-fixture-index] li a").evaluateAll((els) =>
    els.map((e) => new URL((e as HTMLAnchorElement).href).pathname),
  );

  const seen: string[] = [];
  const unpainted: string[] = [];
  const lying: string[] = [];

  for (const path of paths) {
    const [, , component, fixture] = path.split("/");
    if (!/disabled/i.test(fixture ?? "")) continue;
    const key = `${component.replace(".", "/")}/${fixture}`;
    if (key in DISABLED_EXEMPT) continue;

    await page.goto(path, { waitUntil: "domcontentloaded" });
    await page.locator("[data-fixture]").waitFor({ state: "attached", timeout: 15000 }).catch(() => {});

    const r = await page.evaluate(() => {
      const marked = [...document.querySelectorAll<HTMLElement>("[data-fixture] *")].filter(
        (e) =>
          e.hasAttribute("data-disabled") ||
          e.hasAttribute("disabled") ||
          e.getAttribute("aria-disabled") === "true",
      );
      const sub = (m: HTMLElement) => [m, ...m.querySelectorAll<HTMLElement>("*")];
      const affords = (e: HTMLElement) => {
        const c = getComputedStyle(e);
        return parseFloat(c.opacity) < 1 || c.cursor === "not-allowed" || c.pointerEvents === "none";
      };
      // A cursor under `pointer-events: none` never reaches a user, so it is
      // not a lie — Pagination dims the whole nav that way.
      const reachable = (e: HTMLElement) => {
        let n: HTMLElement | null = e;
        while (n) { if (getComputedStyle(n).pointerEvents === "none") return false; n = n.parentElement; }
        return true;
      };
      return {
        marked: marked.length,
        affordance: marked.some((m) => sub(m).some(affords)),
        lies: marked.some((m) => sub(m).some((e) => getComputedStyle(e).cursor === "pointer" && reachable(e))),
      };
    });

    if (r.marked === 0) continue;
    seen.push(key);
    if (!r.affordance) unpainted.push(key);
    if (r.lies) lying.push(`${key} (cursor: pointer)`);
  }

  console.log(`DISABLED_STATE checked=${seen.length} unpainted=${unpainted.length} lying=${lying.length}`);

  // A walk that matched nothing is not a pass.
  expect(seen.length, "no disabled fixture was found to check").toBeGreaterThan(15);
  expect(
    unpainted,
    "these mark an element disabled and paint it no differently — reduced opacity, " +
      "`not-allowed` or `pointer-events: none`, any one of them",
  ).toEqual([]);
  expect(
    lying,
    "these keep `cursor: pointer` on something they have marked disabled, which " +
      "tells a pointer user the control is live",
  ).toEqual([]);
});

/**
 * A success state has to paint where the error state does.
 *
 * `data-valid` was emitted by fifteen components and styled by one: every
 * field coloured its border for an error and only its message for a success.
 * The migration-table comparison above cannot see that — `data-valid` is
 * present or absent, so one fixture holds no resting value to compare against,
 * the gap `disabled shows itself` closes for `data-disabled`.
 *
 * Derived rather than listed: a component is held to it when its own `error`
 * fixture paints a border in `--cl-error`. Slider and Switch colour only the
 * message for both states, so they are compared and not required — no
 * exemption to keep in step with the code.
 */
test("success paints where error does", async ({ page }) => {
  test.setTimeout(600_000);
  await gotoFixtureIndex(page);
  const paths = await page.locator("[data-fixture-index] li a").evaluateAll((els) =>
    els.map((e) => new URL((e as HTMLAnchorElement).href).pathname),
  );

  /** Elements in the fixture with a visible border in the given token. */
  const bordersIn = async (path: string, token: string) => {
    await page.goto(path, { waitUntil: "domcontentloaded" });
    await page.locator("[data-fixture]").waitFor({ state: "attached", timeout: 15000 });
    await page.addStyleTag({ content: "*,*::before,*::after{transition:none!important;animation:none!important}" });
    return page.evaluate((name) => {
      const probe = document.createElement("div");
      probe.style.color = `var(${name})`;
      document.body.append(probe);
      const colour = getComputedStyle(probe).color;
      probe.remove();
      return [...document.querySelectorAll<HTMLElement>("[data-fixture] *")].filter((e) => {
        const c = getComputedStyle(e);
        return parseFloat(c.borderTopWidth) > 0 && c.borderTopStyle !== "none" && c.borderTopColor === colour;
      }).length;
    }, token);
  };

  const compared: string[] = [];
  const required: string[] = [];
  const unpainted: string[] = [];
  for (const path of paths.filter((p) => p.endsWith("/success"))) {
    const errorPath = path.replace(/\/success$/, "/error");
    if (!paths.includes(errorPath)) continue;
    const key = path.split("/")[2].replace(".", "/");
    compared.push(key);
    if ((await bordersIn(errorPath, "--cl-error")) === 0) continue;
    required.push(key);
    if ((await bordersIn(path, "--cl-success")) === 0) unpainted.push(key);
  }

  console.log(`SUCCESS_STATE compared=${compared.length} required=${required.length} unpainted=${unpainted.length}`);

  // A walk that matched nothing is not a pass.
  expect(required.length, "no success fixture whose error state paints a border was found").toBeGreaterThan(10);
  expect(
    unpainted,
    "these paint a border in --cl-error for an error and none in --cl-success for a success",
  ).toEqual([]);
});

/**
 * A keyboard-highlighted item has to look highlighted, as painted, in both themes.
 *
 * The five dropdowns emitted `data-highlighted` on the active option and styled
 * it in none of their `item` slots, so arrowing through any of them moved a
 * highlight that painted nothing — SC 2.4.7 for the `aria-activedescendant`
 * pattern, where DOM focus never leaves the control and the attribute IS the
 * indicator. It shipped that way from 2026-09-02 to 2026-09-10: eight days.
 *
 * The check that closed it compared computed colour STRINGS — background,
 * colour, border, outline — in one theme, over a list of five kept here. In dark
 * a highlighted option was `rgb(10, 13, 18)` and a plain one `transparent` over
 * a `rgb(10, 13, 18)` panel: different strings, identical pixels, green. And the
 * list left out the four other components that highlight by keyboard, one of
 * which, TimePicker, styled its highlight in neither theme.
 *
 * So now:
 * - the population is read from the code — every component whose render emits
 *   `data-highlighted`, through `emittedBy`, which `attribute-variants.contract`
 *   also uses — and a component in it with no recipe below fails rather than
 *   being skipped;
 * - each side is composited down to what is actually behind it, with
 *   `contrast-painted`'s own helpers, and the two results are compared;
 * - each theme gets its own fresh load, as `contrast-painted` does.
 *
 * Where DOM focus moves onto the highlighted item — a roving grid or menu — the
 * focus ring is the indicator, and `contrast-painted`'s focus pass is what judges
 * it. Those are measured and printed here but not judged on background.
 */
const HIGHLIGHTERS = componentNames().filter((name) => emittedBy(name).has("data-highlighted"));

/**
 * How to put each one into a keyboard highlight on an item that is neither
 * selected nor disabled, so the comparison is the highlight alone.
 */
const RECIPES: Record<string, { fixture: string; focus?: string; key?: string }> = {
  Dropdown: { fixture: "open-keyboard-focus" },
  SearchableDropdown: { fixture: "open-keyboard-focus" },
  MultiSelectDropdown: { fixture: "open-keyboard-focus" },
  MultiSelectSearchableDropdown: { fixture: "open-keyboard-focus" },
  TimePicker: { fixture: "open-keyboard-focus" },
  // Its list opens on the fixture's act; the search field drives the highlight.
  InternationalPhoneInput: { fixture: "country-open", focus: "[data-side] input", key: "ArrowDown" },
  // The highlighted row is not the selected one here, unlike rows-per-page-open.
  Pagination: { fixture: "rows-per-page-open-unhighlighted" },
  CascadingDropdown: { fixture: "open", focus: "button[aria-haspopup]", key: "ArrowDown" },
  DatePicker: { fixture: "keyboard-focus" },
  Table: { fixture: "default", focus: "td[tabindex='0']", key: "ArrowDown" },
};

/**
 * The smallest contrast a highlighted item's painted background may have against
 * a plain item's, compared unrounded.
 *
 * 1.08 is the faintest highlight the library ships as visible: 1.0853443:1, a
 * `--cl-bg-hover` row over white in light, measured identically in all six
 * components that paint one. "Differ at all" would pass 1.001:1, which nobody can
 * see. WCAG 1.4.11's 3:1 is deliberately not applied: every highlight in the
 * library sits under it in both themes, and adopting it is a post-0.1.0 decision.
 */
const HIGHLIGHT_MIN_RATIO = 1.08;

/** The two items and what each paints, measured in the page with the shared helpers. */
const MEASURE_HIGHLIGHT = `(() => {
${PAINT_HELPERS}
  const hot = document.querySelector("[data-highlighted]");
  if (!hot) return { error: "no item carries data-highlighted" };
  const role = hot.getAttribute("role");
  const plain = (el) =>
    !["data-highlighted", "data-selected", "data-disabled", "data-today", "data-outside", "data-range", "data-marked"]
      .some((a) => el.hasAttribute(a)) &&
    el.getAttribute("aria-selected") !== "true" &&
    el.getAttribute("aria-checked") !== "true" &&
    el.getAttribute("aria-disabled") !== "true";
  const cold = [...document.querySelectorAll(role ? "[role='" + role + "']" : hot.tagName)].find(
    (el) => el !== hot && plain(el) && el.getClientRects().length > 0,
  );
  if (!cold) return { error: "no plain " + (role || hot.tagName) + " beside the highlighted one" };
  const a = backgroundOf(hot), b = backgroundOf(cold);
  if (!a || !b) return { error: "a background is an image or gradient" };
  return {
    highlighted: "rgb(" + a.map((v) => v.toFixed(2)).join(", ") + ")",
    plain: "rgb(" + b.map((v) => v.toFixed(2)).join(", ") + ")",
    ratio: ratio(a, b),
    focusHeld: document.activeElement === hot,
    label: (hot.textContent || "").trim().slice(0, 20),
  };
})()`;

test("a keyboard-highlighted item paints differently from a plain one, in both themes", async ({ page }) => {
  test.setTimeout(600_000);
  expect(HIGHLIGHTERS.length, "no component emits data-highlighted — the derivation read nothing").toBeGreaterThan(0);
  expect(HIGHLIGHTERS, "InternationalPhoneInput highlights through its SearchableDropdown").toContain(
    "InternationalPhoneInput",
  );

  const noRecipe = HIGHLIGHTERS.filter((name) => !RECIPES[name]);
  const unmeasured: string[] = [];
  const indistinct: string[] = [];
  const focusHeld: string[] = [];

  for (const name of HIGHLIGHTERS) {
    const recipe = RECIPES[name];
    if (!recipe) continue;
    for (const theme of ["dark", "light"] as const) {
      await gotoFixture(page, name, recipe.fixture);
      await page
        .waitForFunction(
          () => {
            const main = document.querySelector("main[data-fixture-act]");
            const act = main?.getAttribute("data-fixture-act");
            const still = main?.getAttribute("data-fixture-still");
            return act && act !== "pending" && still && still !== "pending" ? act : null;
          },
          undefined,
          { timeout: 30000 },
        )
        .catch(() => null);
      await page.addStyleTag({
        content: "*,*::before,*::after{transition:none!important;animation:none!important}",
      });
      await page.evaluate((next) => {
        const html = document.documentElement;
        html.setAttribute("data-theme", next);
        html.classList.toggle("dark", next === "dark");
      }, theme);
      if (recipe.focus && recipe.key) {
        for (let press = 0; press < 3 && (await page.locator("[data-highlighted]").count()) === 0; press += 1) {
          await page.locator(recipe.focus).first().focus();
          await page.keyboard.press(recipe.key);
        }
      }

      const m = (await page.evaluate(MEASURE_HIGHLIGHT)) as {
        error?: string;
        highlighted?: string;
        plain?: string;
        ratio?: number;
        focusHeld?: boolean;
        label?: string;
      };
      const at = `${name}/${recipe.fixture} ${theme}`;
      if (m.error) {
        unmeasured.push(`${at}: ${m.error}`);
        console.log(`HIGHLIGHT ${at}: UNMEASURED — ${m.error}`);
        continue;
      }
      const distinct = m.ratio! >= HIGHLIGHT_MIN_RATIO;
      const verdict = m.focusHeld ? "focus-held (judged by contrast-painted)" : distinct ? "distinct" : "INDISTINCT";
      console.log(
        `HIGHLIGHT ${at}: "${m.label}" ${m.highlighted} vs plain ${m.plain} = ${m.ratio}:1 → ${verdict}`,
      );
      if (m.focusHeld) focusHeld.push(at);
      else if (!distinct) indistinct.push(`${at}: ${m.highlighted} vs ${m.plain} (${m.ratio}:1)`);
    }
  }

  console.log(
    `HIGHLIGHT_PAINT ${HIGHLIGHTERS.length} components × 2 themes, ${indistinct.length} indistinct ` +
      `(${focusHeld.length} focus-held, ${unmeasured.length} unmeasured, ${noRecipe.length} without a recipe)`,
  );
  expect(noRecipe, "these highlight by keyboard and nothing here says how to reach it").toEqual([]);
  expect(unmeasured, "a recipe that no longer reaches a highlighted item measures nothing").toEqual([]);
  expect(
    indistinct,
    "these mark an item `data-highlighted` and paint it the same as a plain item — with " +
      "aria-activedescendant, that paint is the only indicator a keyboard user gets",
  ).toEqual([]);
});

/**
 * A disabled item has to look disabled beside an enabled one, as painted, in
 * both themes.
 *
 * Dropdown, SearchableDropdown and CascadingDropdown marked a disabled option
 * `data-disabled` and `aria-disabled` and styled it in none of their `item`
 * slots, so it painted exactly like the option above it — while
 * MultiSelectDropdown and MultiSelectSearchableDropdown, built from the same
 * pattern, dimmed theirs. `disabled shows itself` above walks closed fixtures,
 * where no item exists, and exempts CascadingDropdown's open case by name; the
 * docs page was where it showed.
 *
 * - The population is read from the code: every item site a component's render
 *   graph puts `data-disabled` on (`itemSitesOf`), submenus included. It was
 *   once one entry per component, and CascadingDropdown's submenu item shipped
 *   undimmed while its top-level item passed. One with no recipe fails rather
 *   than being skipped.
 * - Each item's text is composited the way it reaches the screen: its colour
 *   over the item's own background, then the item's opacity against what is
 *   behind it. `contrast-painted`'s helpers do the compositing; they read no
 *   `opacity`, which is the property the library dims with, so that step is
 *   applied here.
 * - Each theme gets its own fresh load.
 */
const ITEM_DISABLERS = componentNames().flatMap((name) =>
  [...new Set(itemSitesOf(name, "data-disabled").map((s) => s.site))].map((site) => `${name}: ${site}`),
);

/**
 * Per item site, a fixture whose open surface holds a disabled item beside an
 * enabled, unselected one. `item` narrows the search to that site's elements
 * where the surface holds more than one kind, or where the item has no role.
 */
const DISABLED_ITEM_RECIPES: Record<string, { fixture: string; item?: string } | { unreachable: string }> = {
  "Dropdown: Dropdown.tsx › DropdownOptionItem": { fixture: "open" },
  "SearchableDropdown: SearchableDropdownOption.tsx › SearchableDropdownOption": { fixture: "open" },
  "MultiSelectDropdown: MultiSelectDropdownOption.tsx › MultiSelectDropdownOption": { fixture: "open" },
  "MultiSelectSearchableDropdown: MultiSelectSearchableDropdown.tsx › OptionItem": { fixture: "open" },
  "CascadingDropdown: CascadingDropdown.tsx › MenuItem": {
    fixture: "disabled-top-level",
    item: "[role='menuitem'], [role='menuitemradio']",
  },
  "CascadingDropdown: CascadingDropdown.tsx › SubmenuItem": {
    fixture: "open-submenu",
    item: "[role='menuitemcheckbox']",
  },
  "Breadcrumb: Breadcrumb.tsx › button": { fixture: "collapsed-open" },
  "DatePicker: DatePicker.tsx › DayCell": { fixture: "bounded-in-range" },
  "TimePicker: ClockFace.tsx › renderNumber": { fixture: "open-bounded", item: "[role='slider'] > div" },
  "InternationalPhoneInput: SearchableDropdownOption.tsx › SearchableDropdownOption": {
    unreachable:
      "Its country list renders SearchableDropdown's option, which can carry data-disabled, " +
      "but the options it builds (InternationalPhoneInput.tsx `dropdownOptions`) never set " +
      "`disabled`, so no props reach a disabled item.",
  },
};

/**
 * How far, per 8-bit channel, a correctly dimmed item may land from the colour
 * this check expects of it: 0.5 because every colour the browser reports is
 * stored to the nearest of 256 levels, plus 0.5 because the browser rounds again
 * when it composites a translucent layer onto what is behind it.
 *
 * The rule it serves is relative. `expected` is the enabled sibling's own
 * painted text at half opacity over the background measured behind it — the
 * library's disabled treatment applied to that site's colour — and a disabled
 * item must sit at least as far from the enabled one as `expected` does, less
 * what this tolerance can move `expected` by.
 *
 * It replaced a fixed 3.5:1 floor. That number was what MultiSelectDropdown's
 * `opacity-50` measured on full-strength option text, 3.536423678219509:1 in
 * dark and 5.3175872961655255:1 in light (2026-10-07), and it was right only
 * for text that strong. TimePicker's clock numbers start at tertiary text,
 * 4.73:1 against the face in dark, so the same half opacity measured 2.14:1
 * there and the fixed floor demanded opacity 0.2 — numbers nobody could read.
 * Relative to each site's own colour, one rule holds the library's treatment
 * everywhere and still fails an undimmed item (1:1) or a lighter dimming.
 */
const DISABLED_ITEM_CHANNEL_TOLERANCE = 1;

/** The disabled item's text and an enabled sibling's, each as it reaches the screen. */
const MEASURE_DISABLED_ITEM = `(() => {
${PAINT_HELPERS}
  const ITEM = __ITEM__ || "[role='option'], [role^='menuitem'], [role='gridcell']";
  // Apart from being disabled, both sides carry no other state, so the
  // comparison is the disabled paint alone: a day outside the month or an
  // option already selected paints for its own reason.
  const otherwisePlain = (el) =>
    !["data-highlighted", "data-selected", "data-today", "data-outside", "data-range", "data-marked"]
      .some((a) => el.hasAttribute(a)) &&
    !["aria-selected", "aria-checked"].some((a) => el.getAttribute(a) === "true") &&
    document.activeElement !== el &&
    el.getClientRects().length > 0;
  const disabled = (el) =>
    el.hasAttribute("data-disabled") || el.hasAttribute("disabled") || el.getAttribute("aria-disabled") === "true";
  /** The first element at or under the item that paints its own text. */
  const textOf = (item) =>
    [item, ...item.querySelectorAll("*")].find((el) =>
      [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()),
    );
  // Both sides must paint text: a TimePicker clock face also holds the hand's
  // dot, a textless sibling of the numbers.
  const dead = [...document.querySelectorAll(ITEM)].find(
    (el) => el.hasAttribute("data-disabled") && otherwisePlain(el) && textOf(el),
  );
  if (!dead) return { error: "no visible item carries data-disabled and no other state" };
  const role = dead.getAttribute("role");
  const live = [...document.querySelectorAll(ITEM)].find(
    (el) => el !== dead && el.getAttribute("role") === role && !disabled(el) && otherwisePlain(el) && textOf(el),
  );
  if (!live) return { error: "no enabled, unselected " + (role ?? "item") + " beside the disabled one" };
  const painted = (item) => {
    const el = textOf(item);
    if (!el) return null;
    const fg = parse(getComputedStyle(el).color);
    const inner = backgroundOf(el);
    const behind = item.parentElement ? backgroundOf(item.parentElement) : [255, 255, 255];
    if (!fg || !inner || !behind) return null;
    let opacity = 1;
    for (let n = el; n; n = n.parentElement) {
      opacity *= parseFloat(getComputedStyle(n).opacity);
      if (n === item) break;
    }
    const text = over(fg, inner);
    return { rgb: over([...text, opacity], behind), text, behind, opacity, label: (el.textContent || "").trim().slice(0, 20) };
  };
  const a = painted(dead), b = painted(live);
  if (!a || !b) return { error: "an item's text or background could not be read" };
  // The library's treatment applied to this site's own colour: the enabled
  // item's painted text at half opacity over what is behind it.
  const expected = over([...b.text, 0.5], b.behind);
  // The tolerance moves \`expected\` toward the enabled colour, channel by channel.
  const tol = __TOL__;
  const nudged = expected.map((v, i) => (v > b.rgb[i] ? Math.max(b.rgb[i], v - tol) : Math.min(b.rgb[i], v + tol)));
  const fmt = (c) => "rgb(" + c.map((v) => v.toFixed(2)).join(", ") + ")";
  return {
    disabled: fmt(a.rgb) + " @" + a.opacity + ' "' + a.label + '"',
    enabled: fmt(b.rgb) + " @" + b.opacity + ' "' + b.label + '"',
    expected: fmt(expected),
    ratio: ratio(a.rgb, b.rgb),
    expectedRatio: ratio(expected, b.rgb),
    floor: ratio(nudged, b.rgb),
  };
})()`;

test("a disabled item paints differently from an enabled one, in both themes", async ({ page }) => {
  test.setTimeout(600_000);
  expect(ITEM_DISABLERS.length, "no component marks an item data-disabled — the derivation read nothing").toBeGreaterThan(0);
  const stale = Object.keys(DISABLED_ITEM_RECIPES).filter((name) => !ITEM_DISABLERS.includes(name));
  expect(stale, "these have a recipe but no longer mark an item data-disabled").toEqual([]);

  const noRecipe = ITEM_DISABLERS.filter((name) => !DISABLED_ITEM_RECIPES[name]);
  const unmeasured: string[] = [];
  const indistinct: string[] = [];

  console.log(`DISABLED_ITEM population ${ITEM_DISABLERS.length} item sites: ${ITEM_DISABLERS.join("; ")}`);
  for (const name of ITEM_DISABLERS) {
    const recipe = DISABLED_ITEM_RECIPES[name];
    if (!recipe) continue;
    if ("unreachable" in recipe) {
      console.log(`DISABLED_ITEM ${name}: not measured — ${recipe.unreachable}`);
      continue;
    }
    const component = name.split(":")[0];
    for (const theme of ["dark", "light"] as const) {
      await gotoFixture(page, component, recipe.fixture);
      await page
        .waitForFunction(
          () => {
            const main = document.querySelector("main[data-fixture-act]");
            const act = main?.getAttribute("data-fixture-act");
            const still = main?.getAttribute("data-fixture-still");
            return act && act !== "pending" && still && still !== "pending" ? act : null;
          },
          undefined,
          { timeout: 30000 },
        )
        .catch(() => null);
      await page.addStyleTag({
        content: "*,*::before,*::after{transition:none!important;animation:none!important}",
      });
      await page.evaluate((next) => {
        const html = document.documentElement;
        html.setAttribute("data-theme", next);
        html.classList.toggle("dark", next === "dark");
      }, theme);

      const m = (await page.evaluate(
        MEASURE_DISABLED_ITEM.replace("__ITEM__", JSON.stringify(recipe.item ?? "")).replace(
          "__TOL__",
          String(DISABLED_ITEM_CHANNEL_TOLERANCE),
        ),
      )) as {
        error?: string;
        disabled?: string;
        enabled?: string;
        expected?: string;
        ratio?: number;
        expectedRatio?: number;
        floor?: number;
      };
      const at = `${name} /${recipe.fixture} ${theme}`;
      if (m.error) {
        unmeasured.push(`${at}: ${m.error}`);
        console.log(`DISABLED_ITEM ${at}: UNMEASURED — ${m.error}`);
        continue;
      }
      const margin = m.ratio! - m.floor!;
      const distinct = margin >= 0;
      console.log(
        `DISABLED_ITEM ${at}: enabled ${m.enabled}, expected ${m.expected}, disabled ${m.disabled}; ` +
          `disabled:enabled ${m.ratio}:1, expected:enabled ${m.expectedRatio}:1, floor ${m.floor}:1, ` +
          `margin ${margin} → ${distinct ? "dimmed" : "UNDER-DIMMED"}`,
      );
      if (!distinct) indistinct.push(`${at}: ${m.disabled} vs ${m.enabled} (${m.ratio}:1, floor ${m.floor}:1)`);
    }
  }

  console.log(
    `DISABLED_ITEM_PAINT ${ITEM_DISABLERS.length} item sites × 2 themes, ${indistinct.length} indistinct ` +
      `(${unmeasured.length} unmeasured, ${noRecipe.length} without a recipe)`,
  );
  expect(noRecipe, "these mark an item disabled and nothing here says how to reach one").toEqual([]);
  expect(unmeasured, "a recipe that no longer reaches a disabled item measures nothing").toEqual([]);
  expect(
    indistinct,
    "these mark an item `data-disabled` and `aria-disabled` and paint it like an enabled one, " +
      "so a sighted user reaches for an option that will not respond",
  ).toEqual([]);
});

/**
 * The pressed toggle in a group has to look pressed beside its siblings, as
 * painted, in both themes.
 *
 * TimePicker's clock marks the selected hours/minutes field and the selected
 * AM/PM button `aria-pressed` and `data-active`, and its `clockHours`,
 * `clockMinutes` and `periodTrigger` slots styled neither: both buttons in each
 * pair measured 1:1, so only a screen reader could tell AM from PM.
 *
 * - The population is read from the code: every element a render graph puts
 *   both `aria-pressed` and `data-active` on (`pressedToggleSitesOf`). One with
 *   no recipe fails rather than being skipped.
 * - In the page, toggles are grouped by their parent, and each group's pressed
 *   button is compared with an unpressed sibling, backgrounds composited with
 *   `contrast-painted`'s helpers.
 * - The floor is the treatment the library already ships for a selected button
 *   among siblings: Pagination's active page item, `bg-cl-accent-bg` (measured
 *   1.1461133894234306:1 light, 1.1370989146355865:1 dark against an inactive
 *   page on its fixture, 2026-10-07). Rather than carry that ratio onto a
 *   different surface, the check applies the same token here: `--cl-accent-bg`
 *   composited over the unpressed sibling's own background is what the pressed
 *   one must at least reach, less DISABLED_ITEM_CHANNEL_TOLERANCE for the same
 *   8-bit rounding.
 */
const TOGGLERS = componentNames().filter((name) => pressedToggleSitesOf(name).length > 0);

const TOGGLE_RECIPES: Record<string, { fixture: string }> = {
  // The 12-hour clock is the one that has both groups: hours/minutes and AM/PM.
  TimePicker: { fixture: "open-clock-12h" },
};

const MEASURE_TOGGLES = `(() => {
${PAINT_HELPERS}
  const tol = __TOL__;
  const probe = document.createElement("div");
  probe.style.backgroundColor = "var(--cl-accent-bg)";
  document.body.appendChild(probe);
  const accent = parse(getComputedStyle(probe).backgroundColor);
  probe.remove();
  const fmt = (c) => "rgb(" + c.map((v) => v.toFixed(2)).join(", ") + ")";
  const groups = new Map();
  for (const el of document.querySelectorAll("[aria-pressed]")) {
    if (!el.getClientRects().length) continue;
    if (!groups.has(el.parentElement)) groups.set(el.parentElement, []);
    groups.get(el.parentElement).push(el);
  }
  return [...groups.values()].map((members) => {
    const on = members.find((el) => el.getAttribute("aria-pressed") === "true");
    const off = members.find((el) => el.getAttribute("aria-pressed") === "false");
    const names = members.map((el) => (el.textContent || "").trim()).join("/");
    if (!on || !off) return { group: names, error: "no pressed and unpressed pair" };
    const a = backgroundOf(on), b = backgroundOf(off);
    if (!a || !b || !accent) return { group: names, error: "a background is an image or gradient" };
    const expected = over(accent, b);
    const nudged = expected.map((v, i) => (v > b[i] ? Math.max(b[i], v - tol) : Math.min(b[i], v + tol)));
    return {
      group: names,
      pressed: '"' + on.textContent.trim() + '" ' + fmt(a) + " text " + getComputedStyle(on).color,
      unpressed: '"' + off.textContent.trim() + '" ' + fmt(b) + " text " + getComputedStyle(off).color,
      expected: fmt(expected),
      ratio: ratio(a, b),
      floor: ratio(nudged, b),
    };
  });
})()`;

test("a pressed toggle paints differently from its unpressed sibling, in both themes", async ({ page }) => {
  test.setTimeout(300_000);
  expect(TOGGLERS.length, "no component marks a toggle aria-pressed and data-active — the derivation read nothing").toBeGreaterThan(0);
  const noRecipe = TOGGLERS.filter((name) => !TOGGLE_RECIPES[name]);
  const unmeasured: string[] = [];
  const indistinct: string[] = [];
  let groups = 0;

  for (const name of TOGGLERS) {
    const recipe = TOGGLE_RECIPES[name];
    if (!recipe) continue;
    for (const theme of ["dark", "light"] as const) {
      await gotoFixture(page, name, recipe.fixture);
      await page
        .waitForFunction(
          () => {
            const main = document.querySelector("main[data-fixture-act]");
            const still = main?.getAttribute("data-fixture-still");
            return still && still !== "pending" ? still : null;
          },
          undefined,
          { timeout: 30000 },
        )
        .catch(() => null);
      await page.addStyleTag({
        content: "*,*::before,*::after{transition:none!important;animation:none!important}",
      });
      await page.evaluate((next) => {
        const html = document.documentElement;
        html.setAttribute("data-theme", next);
        html.classList.toggle("dark", next === "dark");
      }, theme);
      const results = (await page.evaluate(
        MEASURE_TOGGLES.replace("__TOL__", String(DISABLED_ITEM_CHANNEL_TOLERANCE)),
      )) as Array<{ group: string; error?: string; pressed?: string; unpressed?: string; expected?: string; ratio?: number; floor?: number }>;
      if (!results.length) unmeasured.push(`${name}/${recipe.fixture} ${theme}: no aria-pressed toggle on the page`);
      for (const m of results) {
        const at = `${name}/${recipe.fixture} ${theme} [${m.group}]`;
        if (m.error) {
          unmeasured.push(`${at}: ${m.error}`);
          console.log(`TOGGLE ${at}: UNMEASURED — ${m.error}`);
          continue;
        }
        groups += 1;
        const distinct = m.ratio! >= m.floor!;
        console.log(
          `TOGGLE ${at}: pressed ${m.pressed} vs ${m.unpressed} = ${m.ratio}:1; ` +
            `expected ${m.expected}, floor ${m.floor}:1, margin ${m.ratio! - m.floor!} → ${distinct ? "distinct" : "INDISTINCT"}`,
        );
        if (!distinct) indistinct.push(`${at}: ${m.ratio}:1 under floor ${m.floor}:1`);
      }
    }
  }

  console.log(
    `TOGGLE_PAINT ${TOGGLERS.length} components, ${groups} groups measured, ${indistinct.length} indistinct ` +
      `(${unmeasured.length} unmeasured, ${noRecipe.length} without a recipe)`,
  );
  expect(noRecipe, "these mark a toggle aria-pressed and nothing here says which fixture shows it").toEqual([]);
  expect(unmeasured, "a recipe that reaches no pressed/unpressed pair measures nothing").toEqual([]);
  expect(
    indistinct,
    "these mark the pressed toggle aria-pressed and data-active and paint it like its sibling, " +
      "so only a screen reader can tell which one is on",
  ).toEqual([]);
});

/**
 * A loading row has to paint a skeleton: a fill that differs from the surface
 * behind it, in both themes.
 *
 * MultiSelectSearchableDropdown rendered `shimmerCount` loading rows under its
 * status text and styled its `loadingItem` slot with text classes only, so each
 * "shimmer" row was an empty, transparent box. The status line said Loading;
 * nothing on screen moved or filled. Its four siblings shipped a skeleton.
 *
 * - The population is read from the code: every placeholder repeat a render
 *   graph draws inside a listbox or menu (`loadingRowSitesOf`). One with no
 *   recipe fails rather than being skipped.
 * - In the page, the rows are a group of two or more textless siblings with one
 *   class list, searched across the document because the surfaces are
 *   portalled. Each row's fill is the strongest of its own composited
 *   background and its descendants', against what is composited behind it.
 * - The floor is the skeleton the family already ships: Dropdown's
 *   `loadingItem`, `bg-cl-bg-skeleton`, the same class SearchableDropdown and
 *   CascadingDropdown use. The check applies that token over the measured
 *   surface, as the toggle check applies `--cl-accent-bg`, and a row must at
 *   least reach it, less DISABLED_ITEM_CHANNEL_TOLERANCE for 8-bit rounding.
 *   Animations are off, so the pulse is measured at full strength.
 */
const LOADING_ROW_SITES = componentNames().flatMap((name) =>
  [...new Set(loadingRowSitesOf(name).map((s) => s.site))].map((site) => `${name}: ${site}`),
);

const LOADING_ROW_RECIPES: Record<string, { fixture: string } | { unreachable: string }> = {
  "Dropdown: DropdownShimmer.tsx › DropdownShimmer": { fixture: "loading" },
  "SearchableDropdown: SearchableDropdownShimmer.tsx › SearchableDropdownShimmer": { fixture: "loading" },
  "MultiSelectDropdown: MultiSelectDropdownShimmer.tsx › MultiSelectDropdownShimmer": { fixture: "loading" },
  "MultiSelectSearchableDropdown: MultiSelectSearchableDropdown.tsx › MultiSelectSearchableDropdown": {
    fixture: "loading",
  },
  "CascadingDropdown: CascadingDropdown.tsx › CascadingDropdown": { fixture: "loading" },
  "InternationalPhoneInput: SearchableDropdownShimmer.tsx › SearchableDropdownShimmer": {
    unreachable:
      "Its country list is a SearchableDropdown, and the props it passes " +
      "(InternationalPhoneInput.tsx, the <SearchableDropdown> call) include no `loading`, " +
      "`searchOptions` or `loadOptions`, so its list never loads.",
  },
};

const MEASURE_LOADING_ROWS = `(() => {
${PAINT_HELPERS}
  const tol = __TOL__;
  const probe = document.createElement("div");
  probe.style.backgroundColor = "var(--cl-bg-skeleton)";
  document.body.appendChild(probe);
  const skeleton = parse(getComputedStyle(probe).backgroundColor);
  probe.remove();
  if (!skeleton) return { error: "--cl-bg-skeleton did not resolve" };
  const textless = (el) => !(el.textContent || "").trim();
  const groups = [...document.querySelectorAll("body *")].filter((parent) => {
    const kids = [...parent.children];
    return (
      kids.length >= 2 &&
      kids.every((k) => textless(k) && k.tagName === kids[0].tagName && k.className === kids[0].className) &&
      !parent.closest("svg")
    );
  });
  const rows = groups.flatMap((g) => [...g.children]);
  if (!rows.length) return { error: "no group of textless sibling rows on the page" };
  const fmt = (c) => "rgb(" + c.map((v) => v.toFixed(2)).join(", ") + ")";
  const results = rows.map((row) => {
    const box = row.getBoundingClientRect();
    const behind = backgroundOf(row.parentElement);
    if (!behind) return { error: "the surface behind a row is an image or gradient" };
    let best = behind, bestRatio = 1;
    for (const el of [row, ...row.querySelectorAll("*")]) {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) continue;
      const fill = backgroundOf(el);
      if (!fill) continue;
      const q = ratio(fill, behind);
      if (q > bestRatio) { best = fill; bestRatio = q; }
    }
    const expected = over(skeleton, behind);
    const nudged = expected.map((v, i) => (v > behind[i] ? Math.max(behind[i], v - tol) : Math.min(behind[i], v + tol)));
    return {
      size: Math.round(box.width) + "x" + Math.round(box.height),
      fill: fmt(best),
      behind: fmt(behind),
      expected: fmt(expected),
      ratio: bestRatio,
      floor: ratio(nudged, behind),
    };
  });
  return { rows: results };
})()`;

test("a loading row paints a skeleton, in both themes", async ({ page }) => {
  test.setTimeout(300_000);
  expect(LOADING_ROW_SITES.length, "no component draws loading rows in a surface — the derivation read nothing").toBeGreaterThan(0);
  const stale = Object.keys(LOADING_ROW_RECIPES).filter((name) => !LOADING_ROW_SITES.includes(name));
  expect(stale, "these have a recipe but no longer draw loading rows").toEqual([]);

  const noRecipe = LOADING_ROW_SITES.filter((name) => !LOADING_ROW_RECIPES[name]);
  const unmeasured: string[] = [];
  const blank: string[] = [];
  let measured = 0;

  console.log(`LOADING_ROW population ${LOADING_ROW_SITES.length} sites: ${LOADING_ROW_SITES.join("; ")}`);
  for (const name of LOADING_ROW_SITES) {
    const recipe = LOADING_ROW_RECIPES[name];
    if (!recipe) continue;
    if ("unreachable" in recipe) {
      console.log(`LOADING_ROW ${name}: not measured — ${recipe.unreachable}`);
      continue;
    }
    const component = name.split(":")[0];
    for (const theme of ["dark", "light"] as const) {
      await gotoFixture(page, component, recipe.fixture);
      await page
        .waitForFunction(
          () => {
            const main = document.querySelector("main[data-fixture-act]");
            const act = main?.getAttribute("data-fixture-act");
            const still = main?.getAttribute("data-fixture-still");
            return act && act !== "pending" && still && still !== "pending" ? act : null;
          },
          undefined,
          { timeout: 30000 },
        )
        .catch(() => null);
      await page.addStyleTag({
        content: "*,*::before,*::after{transition:none!important;animation:none!important}",
      });
      await page.evaluate((next) => {
        const html = document.documentElement;
        html.setAttribute("data-theme", next);
        html.classList.toggle("dark", next === "dark");
      }, theme);

      const m = (await page.evaluate(
        MEASURE_LOADING_ROWS.replace("__TOL__", String(DISABLED_ITEM_CHANNEL_TOLERANCE)),
      )) as {
        error?: string;
        rows?: Array<{ error?: string; size?: string; fill?: string; behind?: string; expected?: string; ratio?: number; floor?: number }>;
      };
      const at = `${name} /${recipe.fixture} ${theme}`;
      if (m.error) {
        unmeasured.push(`${at}: ${m.error}`);
        console.log(`LOADING_ROW ${at}: UNMEASURED — ${m.error}`);
        continue;
      }
      const rows = m.rows!;
      const bad = rows.filter((r) => r.error || r.ratio! < r.floor!);
      const first = rows[0];
      measured += rows.length;
      console.log(
        `LOADING_ROW ${at}: ${rows.length} rows ${first.size}, fill ${first.fill} on ${first.behind} = ${first.ratio}:1; ` +
          `expected ${first.expected}, floor ${first.floor}:1, margin ${first.ratio! - first.floor!} → ` +
          `${bad.length ? `${bad.length} BLANK` : "skeleton"}`,
      );
      if (bad.length) blank.push(`${at}: ${bad.length} of ${rows.length} rows at ${bad[0].ratio}:1 under floor ${bad[0].floor}:1`);
    }
  }

  console.log(
    `LOADING_ROW_PAINT ${LOADING_ROW_SITES.length} sites × 2 themes, ${measured} rows measured, ${blank.length} blank ` +
      `(${unmeasured.length} unmeasured, ${noRecipe.length} without a recipe)`,
  );
  expect(noRecipe, "these draw loading rows and nothing here says which fixture shows them").toEqual([]);
  expect(unmeasured, "a recipe that reaches no loading rows measures nothing").toEqual([]);
  expect(
    blank,
    "these draw loading rows that paint the surface's own colour, so the loading state shows " +
      "empty boxes where a skeleton should be",
  ).toEqual([]);
});

/**
 * A Button stands as tall as its size, whatever it holds, in both themes.
 *
 * The content span is `inline-flex` inside a root that sets no display (the
 * `<button>` default, `inline-block`; Tooltip `asChild` appends `block`). It
 * sat on the line's text baseline, and an inline-flex box whose first item is
 * an SVG takes that item's bottom edge as its baseline, so the line's descent
 * was added beneath it: 15 of 28 icon Buttons on /button measured about 3px
 * taller than their size, and TabPanel's "Remove this tab" 45 against md's 42.
 *
 * - The sizes are read from `BUTTON_SIZE_CLASSES`, and every one renders text
 *   alone, a leading icon, a trailing icon, an icon alone and the loader in the
 *   `height-matrix` fixture. A missing combination fails rather than shrinking
 *   the check.
 * - The floor is the size's own text-only Button on the same page: what `size`
 *   promises, measured rather than restated.
 */
const BUTTON_SIZES = Object.keys(BUTTON_SIZE_CLASSES);
const BUTTON_CONTENTS = ["text", "startIcon", "endIcon", "iconOnly", "loading"] as const;
/** Sub-pixel layout rounds to a quarter pixel; anything past that is a different line box. */
const BUTTON_HEIGHT_TOLERANCE = 0.25;

test("a Button stands as tall as its size whatever it holds, in both themes", async ({ page }) => {
  test.setTimeout(120_000);
  expect(BUTTON_SIZES.length, "BUTTON_SIZE_CLASSES read nothing").toBeGreaterThan(0);
  const wrong: string[] = [];
  const missing: string[] = [];
  let measured = 0;

  for (const theme of ["dark", "light"] as const) {
    await gotoFixture(page, "Button", "height-matrix");
    await page.addStyleTag({
      content: "*,*::before,*::after{transition:none!important;animation:none!important}",
    });
    await page.evaluate((next) => {
      const html = document.documentElement;
      html.setAttribute("data-theme", next);
      html.classList.toggle("dark", next === "dark");
    }, theme);
    const heights = (await page.evaluate(() =>
      Object.fromEntries(
        [...document.querySelectorAll("[data-matrix]")].map((el) => [
          el.getAttribute("data-matrix"),
          el.getBoundingClientRect().height,
        ]),
      ),
    )) as Record<string, number>;

    for (const size of BUTTON_SIZES) {
      const floor = heights[`${size}|text`];
      const row = BUTTON_CONTENTS.map((content) => {
        const h = heights[`${size}|${content}`];
        if (h === undefined) {
          missing.push(`${size}|${content}`);
          return `${content} —`;
        }
        measured += 1;
        const off = floor === undefined ? NaN : h - floor;
        if (!(Math.abs(off) <= BUTTON_HEIGHT_TOLERANCE)) {
          wrong.push(`${theme} ${size} ${content}: ${h}px against text-only ${floor}px (${off > 0 ? "+" : ""}${off})`);
        }
        return `${content} ${h}`;
      });
      console.log(`BUTTON_HEIGHT ${theme} ${size}: ${row.join(", ")}`);
    }
  }

  console.log(
    `BUTTON_HEIGHT_PAINT ${BUTTON_SIZES.length} sizes × ${BUTTON_CONTENTS.length} contents × 2 themes, ` +
      `${measured} measured, ${wrong.length} off their size (${missing.length} missing)`,
  );
  expect(missing, "the height-matrix fixture no longer renders these, so they are not checked").toEqual([]);
  expect(
    wrong,
    "these Buttons stand taller or shorter than their size's text-only Button, so a row of " +
      "mixed Buttons does not line up and `size` does not mean one height",
  ).toEqual([]);
});

/**
 * A custom checkbox icon is a checkbox a keyboard can use, like the default.
 *
 * With `CheckboxIcon` set, Table rendered the icon inside `<span
 * role="checkbox">` with a click handler and nothing else: no tab stop, no key
 * handler, so the select-all and every row checkbox could not be reached or
 * toggled from the keyboard, and a click on a row's icon also counted as a
 * row click. TableDemo's star checkbox only worked because its own icon
 * rendered a `<button>`, nesting interactive content inside the checkbox.
 *
 * Real focus, not jsdom: in jsdom the grid's focus-follow effect takes focus
 * from the default row checkbox too, which Chromium does not, so a jsdom check
 * failed the default it is meant to be compared with.
 *
 * - The population is read from Table.tsx: the renderers (`header`, `cell`)
 *   of the column whose `id` is `"__selection"`, each of which draws a
 *   checkbox. A site with no recipe fails, and so does a recipe whose site is
 *   gone.
 * - The `custom-checkbox` fixture renders the default and the custom icon side
 *   by side, and each check runs on both. Enter is compared, not asserted.
 *   Its icon is written inline, a new component every render, as consumers
 *   write it: as a column dependency that rebuilt the columns on each
 *   selection and remounted the focused checkbox, so focus is read again after
 *   Space.
 */
const CUSTOM_CHECKBOX_SITES = (() => {
  const file = resolve(process.cwd(), "src/components/Table/Table.tsx");
  const sf = ts.createSourceFile(file, readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const found: string[] = [];
  const visit = (node: ts.Node): void => {
    // The selection column: the object literal with `id: "__selection"`. Each
    // of its renderers draws a checkbox, the custom icon's or the default's.
    if (
      ts.isObjectLiteralExpression(node) &&
      node.properties.some(
        (p) => ts.isPropertyAssignment(p) && p.name.getText(sf) === "id" && p.initializer.getText(sf) === '"__selection"',
      )
    ) {
      for (const p of node.properties) {
        if (ts.isPropertyAssignment(p) && ["header", "cell"].includes(p.name.getText(sf))) found.push(p.name.getText(sf));
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return found;
})();

const CUSTOM_CHECKBOX_RECIPES: Record<string, { label: string; mixed: boolean; rowClick: boolean }> = {
  header: { label: "Select all rows", mixed: true, rowClick: false },
  cell: { label: "Select row 2", mixed: false, rowClick: true },
};

/** Everything a check reads off one checkbox, in the page. */
const READ_CHECKBOX = `((variant, label) => {
  const root = document.querySelector('[data-table-variant="' + variant + '"]');
  const boxes = [...root.querySelectorAll('[aria-label="' + label + '"]')].filter((el) =>
    el.matches('input[type="checkbox"], [role="checkbox"]'));
  const el = boxes[0];
  if (!el) return { found: 0 };
  const checked = el instanceof HTMLInputElement ? el.checked : el.getAttribute("aria-checked") === "true";
  const mixed = el instanceof HTMLInputElement ? el.indeterminate : el.getAttribute("aria-checked") === "mixed";
  const control = el.closest("label") || el;
  const nested = [...control.querySelectorAll("button, a[href], input, select, textarea, [tabindex], [role='button'], [role='checkbox'], [role='link']")]
    .filter((n) => n !== el).map((n) => n.tagName.toLowerCase());
  return {
    found: boxes.length, checked, mixed, nested,
    focused: document.activeElement === el,
    selected: Number(root.getAttribute("data-selected")),
    rowClicks: Number(root.getAttribute("data-row-clicks")),
  };
})`;

test("a custom checkbox icon is a keyboard checkbox like the default", async ({ page }) => {
  test.setTimeout(120_000);
  console.log(`CUSTOM_CHECKBOX sites=${CUSTOM_CHECKBOX_SITES.length}: ${CUSTOM_CHECKBOX_SITES.join(", ")}`);
  expect(CUSTOM_CHECKBOX_SITES.length, "Table.tsx renders no custom checkbox — the derivation read nothing").toBeGreaterThan(0);
  expect(CUSTOM_CHECKBOX_SITES.filter((s) => !CUSTOM_CHECKBOX_RECIPES[s]), "these render a custom checkbox and nothing here says how to reach it").toEqual([]);
  expect(Object.keys(CUSTOM_CHECKBOX_RECIPES).filter((s) => !CUSTOM_CHECKBOX_SITES.includes(s)), "these recipes name a site Table.tsx no longer renders").toEqual([]);

  const failures: string[] = [];
  for (const site of CUSTOM_CHECKBOX_SITES) {
    const recipe = CUSTOM_CHECKBOX_RECIPES[site];
    const outcome: Record<string, Record<string, unknown>> = {};
    for (const variant of ["default", "custom"] as const) {
      await gotoFixture(page, "Table", "custom-checkbox");
      const read = () => page.evaluate(`${READ_CHECKBOX}(${JSON.stringify(variant)}, ${JSON.stringify(recipe.label)})`) as Promise<{
        found: number; checked: boolean; mixed: boolean; nested: string[]; focused: boolean; selected: number; rowClicks: number;
      }>;
      const o: Record<string, unknown> = {};
      const first = await read();
      o.named = first.found === 1;
      o.nested = first.nested ?? [];

      // Tab order: Tab from just before this table until the checkbox is focused.
      await page.evaluate((v) => {
        const root = document.querySelector(`[data-table-variant="${v}"]`) as HTMLElement;
        const marker = document.createElement("button");
        marker.id = "tab-start";
        marker.textContent = "start";
        root.before(marker);
        marker.focus();
      }, variant);
      let reached = false;
      for (let i = 0; i < 12 && !reached; i += 1) {
        await page.keyboard.press("Tab");
        reached = (await read()).focused;
      }
      o.tabbable = reached;
      if (reached) {
        await page.waitForTimeout(300);
        o.keepsFocus = (await read()).focused;
        o.focusRing = await page.evaluate((label) => {
          const el = document.activeElement as HTMLElement;
          if (el.getAttribute("aria-label") !== label) return false;
          const painted = (n: Element | null) => {
            if (!n) return false;
            const cs = getComputedStyle(n);
            return (cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) > 0) || cs.boxShadow !== "none";
          };
          return painted(el) || painted(el.nextElementSibling);
        }, recipe.label);
        const before = (await read()).checked;
        await page.keyboard.press("Space");
        await page.waitForTimeout(150);
        const afterSpaceRead = await read();
        const afterSpace = afterSpaceRead.checked;
        o.keepsFocusAfterSpace = afterSpaceRead.focused;
        await page.keyboard.press("Space");
        o.space = afterSpace !== before && (await read()).checked === before;
        await page.keyboard.press("Enter");
        const afterEnter = (await read()).checked;
        o.enterToggles = afterEnter !== before;
        if (afterEnter !== before) await page.keyboard.press("Space");
      }

      if (recipe.mixed) {
        await page.locator(`[data-table-variant="${variant}"] [aria-label="Select row 2"]`).first().click({ force: true });
        o.mixed = (await read()).mixed;
        await page.locator(`[data-table-variant="${variant}"] [aria-label="Select row 2"]`).first().click({ force: true });
      }

      // A click on the visible control: the icon for custom, the input for default.
      const clicksBefore = (await read()).rowClicks;
      const checkedBefore = (await read()).checked;
      const target =
        variant === "custom"
          ? page
              .locator(
                `[data-table-variant="custom"] :is(label:has(> [aria-label="${recipe.label}"]), [role="checkbox"][aria-label="${recipe.label}"]) svg`,
              )
              .first()
          : page.locator(`[data-table-variant="default"] [aria-label="${recipe.label}"]`).first();
      await target.click();
      const afterClick = await read();
      o.clickToggles = afterClick.checked !== checkedBefore;
      o.clickIsRowClick = afterClick.rowClicks !== clicksBefore;

      outcome[variant] = o;
      console.log(`CUSTOM_CHECKBOX ${site} ${variant}: ${JSON.stringify(o)}`);
    }

    const d = outcome.default, c = outcome.custom;
    if (!c.named) failures.push(`${site}: no single checkbox named "${recipe.label}"`);
    if (!c.tabbable) failures.push(`${site}: not reachable with Tab`);
    if (c.tabbable && !c.keepsFocus) failures.push(`${site}: loses focus after Tab`);
    if (c.tabbable && !c.focusRing) failures.push(`${site}: keyboard focus paints no indicator`);
    if (c.tabbable && !c.space) failures.push(`${site}: Space does not toggle it`);
    if (c.tabbable && c.keepsFocusAfterSpace !== d.keepsFocusAfterSpace) failures.push(`${site}: ${c.keepsFocusAfterSpace ? "keeps" : "loses"} focus after Space, unlike the default`);
    if (c.tabbable && c.enterToggles !== d.enterToggles) failures.push(`${site}: Enter ${c.enterToggles ? "toggles" : "does not toggle"} it, unlike the default`);
    if (recipe.mixed && !c.mixed) failures.push(`${site}: a partial selection does not report mixed`);
    if ((c.nested as string[]).length) failures.push(`${site}: nests ${(c.nested as string[]).join(", ")} inside the checkbox`);
    if (!c.clickToggles) failures.push(`${site}: a click on the icon does not toggle it`);
    if (recipe.rowClick && c.clickIsRowClick !== d.clickIsRowClick) failures.push(`${site}: a click on the icon ${c.clickIsRowClick ? "also fires" : "does not fire"} onRowClick, unlike the default`);
  }
  console.log(`CUSTOM_CHECKBOX_KEYBOARD ${CUSTOM_CHECKBOX_SITES.length} sites, ${failures.length} failures`);
  expect(failures, "a custom checkbox icon has to behave like the default checkbox at the same site").toEqual([]);
});

/**
 * A field or selection control shows a resting boundary of at least 3:1 against
 * every library surface it can sit on, in both themes (WCAG 1.4.11).
 *
 * Their fill is the surface's own colour or close to it, so the border is what
 * says "here is a field". `--cl-border-input` was 8% white in dark and 15%
 * ink in light: 1.18:1 and 1.23:1, and Input, TextArea and Pagination's
 * rows-per-page trigger drew theirs with `--cl-border`, the divider token.
 * CONTRAST_NONTEXT never saw it: it measures focus indicators and accent
 * fills, never a resting boundary.
 *
 * - Population from code: every DEFAULT_*_CLASSES slot named trigger, control,
 *   input, itemControl or filterItemControl that draws a border, plus a
 *   control whose boundary is its unchecked fill (Switch's track), plus any
 *   library `<input>` whose call site draws its own border. One with no
 *   recipe fails.
 * - Measured on the real fixture: the element's computed border and fill,
 *   composited onto each surface token, read from the page. A text-labelled
 *   button is out of scope: its text identifies it.
 * - Error and valid states are held to the same floor. Disabled controls are
 *   printed and exempt: 1.4.11 excludes inactive components. Focus is
 *   CONTRAST_NONTEXT's focus-indicator pass.
 */
const BOUNDARY_SLOTS = new Set(["trigger", "control", "input", "itemControl", "filterItemControl"]);
const BOUNDARY_FLOOR = 3;

interface BoundarySite { key: string; component: string; slot: string; classes: string; kind: "border" | "fill" }

const BOUNDARY_SITES: BoundarySite[] = (() => {
  const sites: BoundarySite[] = [];
  for (const component of componentNames()) {
    const dir = resolve(process.cwd(), "src/components", component);
    const files = [`${dir}/utils/constants.ts`, `${dir}/constants.ts`].filter((f) => {
      try { readFileSync(f); return true; } catch { return false; }
    });
    for (const file of files) {
      const text = readFileSync(file, "utf8");
      for (const block of text.matchAll(/export const DEFAULT_\w+_CLASSES[^=]*=\s*\{([\s\S]*?)\n\s*\};/g)) {
        for (const m of block[1].matchAll(/\b(\w+)\s*:\s*\n?\s*(["`])([^"`]*)\2/g)) {
          const [, slot, , classes] = m;
          if (!BOUNDARY_SLOTS.has(slot)) continue;
          const base = classes.split(/\s+/).filter((t) => !t.includes(":"));
          const kind = base.some((t) => /^border(-[0-9])?$/.test(t))
            ? "border"
            : slot === "control" && /data-\[state=unchecked\]:bg-/.test(classes) ? "fill" : null;
          if (kind) sites.push({ key: `${component}.${slot}`, component, slot, classes, kind });
        }
      }
    }
    // A library <input> whose call site draws its own border, read from the syntax tree.
    const tsxFiles = readdirSync(dir).filter((f) => f.endsWith(".tsx")).map((f) => join(dir, f));
    for (const file of tsxFiles) {
      let n = 0;
      const base = file.split("/").pop();
      const sf = ts.createSourceFile(file, readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
      const visit = (node: ts.Node): void => {
        if ((ts.isJsxSelfClosingElement(node) || ts.isJsxOpeningElement(node)) && node.tagName.getText(sf) === "input") {
          const cls = node.attributes.properties.find(
            (a): a is ts.JsxAttribute => ts.isJsxAttribute(a) && a.name.getText(sf) === "className",
          )?.initializer;
          const literal = cls && ts.isJsxExpression(cls) && cls.expression && ts.isTemplateExpression(cls.expression)
            ? [cls.expression.head.text, ...cls.expression.templateSpans.map((t) => t.literal.text)].join(" ")
            : cls && ts.isStringLiteral(cls) ? cls.text : "";
          if (literal.split(/\s+/).includes("border")) {
            n += 1;
            sites.push({ key: `${component}.${base}<input>#${n}`, component, slot: "<input>", classes: literal, kind: "border" });
          }
        }
        ts.forEachChild(node, visit);
      };
      visit(sf);
    }
  }
  return sites;
})();

/** Which fixture renders each site at rest, and the state fixtures beside it. */
const BOUNDARY_RECIPES: Record<string, { rest: string; states?: string[] } | { unreachable: string }> = {
  "Input.control": { rest: "default", states: ["error", "success", "disabled"] },
  "TextArea.control": { rest: "default", states: ["error", "success", "disabled"] },
  "Checkbox.control": { rest: "default", states: ["error", "success", "disabled"] },
  "RadioButton.control": { rest: "default", states: ["error", "success", "disabled"] },
  "Switch.control": { rest: "default", states: ["error", "success", "disabled"] },
  "OtpInput.input": { rest: "default", states: ["error", "success", "disabled"] },
  "Dropdown.trigger": { rest: "closed", states: ["error", "success", "disabled"] },
  "SearchableDropdown.trigger": { rest: "closed", states: ["error", "success", "disabled"] },
  "MultiSelectDropdown.trigger": { rest: "closed", states: ["error", "success", "disabled"] },
  "MultiSelectDropdown.itemControl": { rest: "open" },
  "MultiSelectSearchableDropdown.trigger": { rest: "closed", states: ["error", "success", "disabled"] },
  "MultiSelectSearchableDropdown.itemControl": { rest: "open" },
  "CascadingDropdown.trigger": { rest: "closed", states: ["error", "success", "disabled"] },
  "CascadingDropdown.itemControl": { rest: "open-multi" },
  "DatePicker.trigger": { rest: "closed", states: ["error", "success", "disabled"] },
  "TimePicker.trigger": { rest: "closed", states: ["error", "success", "disabled"] },
  "InternationalPhoneInput.input": { rest: "default", states: ["error", "success", "disabled"] },
  "InternationalPhoneInput.trigger": { rest: "default", states: ["disabled"] },
  "Pagination.trigger": { rest: "rows-per-page" },
  "Table.filterItemControl": { rest: "filter-open" },
  // Table.tsx's own inputs, in source order: the inline cell editor (open,
  // and so focused, once the act's double-click lands), then the mobile and
  // desktop search fields.
  "Table.Table.tsx<input>#1": { rest: "editing-cell" },
  "Table.Table.tsx<input>#2": { rest: "mobile-search" },
  "Table.Table.tsx<input>#3": { rest: "search-with-value" },
};

/** Per element: its boundary against each surface token, as the eye gets it. */
const MEASURE_BOUNDARY = `((signature) => { ${PAINT_HELPERS}
  const probe = (v) => { const d = document.createElement("div"); d.style.backgroundColor = "var(" + v + ")"; document.body.appendChild(d); const c = parse(getComputedStyle(d).backgroundColor); d.remove(); return c; };
  const SURFACES = { bg: probe("--cl-bg"), panel: probe("--cl-bg-panel"), elevated: probe("--cl-bg-elevated") };
  const toks = signature.split(/\\s+/).filter(Boolean);
  const els = [...document.querySelectorAll("*")].filter((el) => el.classList && toks.every((t) => el.classList.contains(t)) && el.getClientRects().length);
  return els.map((el) => {
    const cs = getComputedStyle(el);
    const bw = parseFloat(cs.borderTopWidth);
    const border = bw > 0 ? parse(cs.borderTopColor) : null;
    const fill = parse(cs.backgroundColor) || [0, 0, 0, 0];
    const per = {};
    for (const [name, s] of Object.entries(SURFACES)) {
      const surface = [s[0], s[1], s[2]];
      const filled = over(fill, surface);
      const rimmed = border ? over(border, filled) : filled;
      per[name] = Math.max(ratio(rimmed, surface), ratio(filled, surface));
    }
    return { per, border: border ? cs.borderTopColor : "none", fill: cs.backgroundColor, disabled: !!el.closest("[data-disabled],[disabled],[aria-disabled='true']") };
  });
})`;

test("a field or selection control's resting boundary clears 3:1 on every library surface", async ({ page }) => {
  test.setTimeout(600_000);
  const perComponent = BOUNDARY_SITES.reduce((m: Record<string, number>, s) => ((m[s.component] = (m[s.component] ?? 0) + 1), m), {});
  console.log(`CONTROL_BOUNDARY population ${BOUNDARY_SITES.length}: ${Object.entries(perComponent).map(([c, n]) => `${c} ${n}`).join(", ")}`);
  console.log(`CONTROL_BOUNDARY sites: ${BOUNDARY_SITES.map((s) => `${s.key}(${s.kind})`).join(", ")}`);
  expect(BOUNDARY_SITES.length, "no control boundary was found in the constants — the derivation read nothing").toBeGreaterThan(0);
  const noRecipe = BOUNDARY_SITES.filter((s) => !BOUNDARY_RECIPES[s.key]).map((s) => s.key);
  const stale = Object.keys(BOUNDARY_RECIPES).filter((k) => !BOUNDARY_SITES.some((s) => s.key === k));
  const under: string[] = [];
  const unmeasured: string[] = [];
  let measured = 0;

  for (const site of BOUNDARY_SITES) {
    const recipe = BOUNDARY_RECIPES[site.key];
    if (!recipe) continue;
    if ("unreachable" in recipe) { console.log(`CONTROL_BOUNDARY ${site.key}: not measured — ${recipe.unreachable}`); continue; }
    // Layout tokens only: a state can swap a colour class out through
    // tailwind-merge, and the element is still this slot.
    const signature = site.classes
      .split(/\s+/)
      .filter((t) => t && !/[:[/]/.test(t) && !/^(cl-|bg-|text-|border-cl|ring|shadow|placeholder|transition|duration|outline|cursor|font-|select-)/.test(t))
      .join(" ");
    for (const fixture of [recipe.rest, ...(recipe.states ?? [])]) {
      for (const theme of ["dark", "light"] as const) {
        await gotoFixture(page, site.component, fixture);
        await page.addStyleTag({ content: "*,*::before,*::after{transition:none!important;animation:none!important}" });
        await page.evaluate((next) => {
          const html = document.documentElement;
          html.setAttribute("data-theme", next);
          html.classList.toggle("dark", next === "dark");
        }, theme);
        type Row = { per: Record<string, number>; border: string; fill: string; disabled: boolean };
        let rows: Row[] = [];
        // Popups and lazy chunks arrive late; wait for the slot, then read it.
        for (let i = 0; i < 25 && !rows.length; i += 1) {
          rows = (await page.evaluate(`${MEASURE_BOUNDARY}(${JSON.stringify(signature)})`)) as Row[];
          if (!rows.length) await page.waitForTimeout(200);
        }
        const at = `${site.key} /${fixture} ${theme}`;
        if (!rows.length) { unmeasured.push(at); console.log(`CONTROL_BOUNDARY ${at}: UNMEASURED — no element carries the slot's classes`); continue; }
        measured += rows.length;
        const worst = rows.reduce((w, r) => (Math.min(...Object.values(r.per)) < Math.min(...Object.values(w.per)) ? r : w));
        const exempt = fixture === "disabled";
        const lows = Object.entries(worst.per).filter(([, v]) => v < BOUNDARY_FLOOR);
        console.log(
          `CONTROL_BOUNDARY ${at}: ${rows.length} el, border ${worst.border} fill ${worst.fill} → ` +
            Object.entries(worst.per).map(([s, v]) => `${s} ${v.toFixed(3)}`).join(", ") +
            (exempt ? " (disabled: exempt)" : lows.length ? " UNDER" : ""),
        );
        if (!exempt && lows.length) under.push(`${at}: ${lows.map(([s, v]) => `${s} ${v.toFixed(3)}:1`).join(", ")}`);
      }
    }
  }
  console.log(`CONTROL_BOUNDARY_PAINT ${BOUNDARY_SITES.length} sites × 2 themes, ${measured} elements, ${under.length} under ${BOUNDARY_FLOOR}:1 (${unmeasured.length} unmeasured, ${noRecipe.length} without a recipe)`);
  expect(noRecipe, "these draw a control boundary and nothing here says which fixture renders it").toEqual([]);
  expect(stale, "these recipes name a site the constants no longer have").toEqual([]);
  expect(unmeasured, "a recipe that no longer reaches its control measures nothing").toEqual([]);
  expect(under, "a field or selection control's resting boundary under 3:1 against a library surface (WCAG 1.4.11)").toEqual([]);
});

/**
 * Every state a component emits or documents paints.
 *
 * `every reported state is a visible state` above compares two values of one
 * attribute inside a fixture, so it covers the states that have values
 * (`data-state="checked"` against `"unchecked"`) and leaves out every bare
 * presence attribute. That was the hole: 6dd1925 deleted DatePicker's
 * `daySelected`, `dayRangeStart`, `dayRangeMiddle`, `dayRangeEnd`,
 * `dayOutside` and `dayToday` keys with their styling, the day cell reported
 * the same states as `data-selected`, `data-range`, `data-outside` and
 * `data-today`, and nothing painted them — a selected day, a range and the
 * adjacent month all looked like any other day from 2026-09-03 until L28.
 *
 * L28 asked the question of the docs. S3 asks it of the code as well: the
 * population is every `data-*` attribute a component's render graph emits and
 * every one its `.ai.md` documents. Each, on every element that carries it in
 * any fixture, is removed and put back, and the element, something inside it
 * or one of the ancestors a `has-[…]` variant reaches has to render
 * differently without it — background, border colour, width and style,
 * colour, outline, opacity, text decoration, shadow, weight or transform. Or a
 * peer of the same kind (tag, role, slot, parent and most of its classes) in
 * the same other states paints or shows something different, or two values
 * paint differently. A state no fixture renders is listed with its reason, or
 * fails.
 *
 * Hooks are not measured; every other unpainted attribute is excused below by
 * name, with a reason; an excuse that stops excusing anything fails.
 */
const STATE_PAINT_EXEMPT: Record<string, string> = {};
const exempt = (components: string[], attribute: string, reason: string) => {
  for (const c of components) STATE_PAINT_EXEMPT[`${c} ${attribute}`] = reason;
};

/**
 * Hooks: attributes that name or place an element — an id, a slot, a part
 * marker, an index, the side a surface landed on. They are not states, so they
 * are not measured, and they never tell two elements apart: an option's
 * `data-value` is unique to it, and kept in the comparison it left every
 * selected option without a peer to be compared with.
 */
const STATE_PAINT_HOOKS: Record<string, string[]> = {
  Accordion: ["data-value"],
  Breadcrumb: ["data-breadcrumb-dropdown-id", "data-position", "data-side"],
  CascadingDropdown: ["data-cascading-submenu", "data-side"],
  CountryFlag: ["data-code"],
  DatePicker: ["data-marker-type", "data-side"],
  Drawer: ["data-drawer-overlay", "data-drawer-panel", "data-drawer-handle", "data-drawer-header", "data-drawer-body", "data-drawer-footer", "data-drawer-close", "data-side"],
  Dropdown: ["data-dropdown-id", "data-position", "data-side", "data-value"],
  Input: ["data-slot"],
  InternationalPhoneInput: ["data-code", "data-dropdown-id", "data-position", "data-side", "data-slot", "data-value"],
  Modal: ["data-modal-root", "data-modal-overlay", "data-modal-container", "data-modal-content", "data-modal-header", "data-modal-body", "data-modal-footer", "data-nesting-level"],
  MultiSelectDropdown: ["data-dropdown-id", "data-position", "data-side"],
  MultiSelectSearchableDropdown: ["data-dropdown-id", "data-position", "data-side"],
  OtpInput: ["data-group", "data-index"],
  Pagination: ["data-direction", "data-side"],
  RadioButton: ["data-value"],
  ResizablePanel: ["data-direction"],
  SearchableDropdown: ["data-dropdown-id", "data-position", "data-side", "data-value"],
  Slider: ["data-index"],
  Stepper: ["data-align", "data-next-status"],
  Table: ["data-column-index", "data-drag-handle", "data-edit-input", "data-expanded-content", "data-interactive", "data-mobile-card", "data-resize-handle",
    "data-side", "data-table-container", "data-table-filter-content", "data-table-footer", "data-table-search", "data-testid", "data-loading-more"],
  TextArea: ["data-slot"],
  TimePicker: ["data-position", "data-side"],
  Toast: ["data-toast-id"],
};
const isHook = (dir: string, attribute: string) => (STATE_PAINT_HOOKS[dir] ?? []).includes(attribute);

const ECHO = "reports a prop whose paint the component resolves from the prop itself, so removing the attribute changes nothing: the attribute echoes the configuration, it does not cause it";
for (const [attribute, components] of [
  ["data-orientation", ["Accordion", "Button"]], ["data-shape", ["Avatar", "Checkbox"]],
  ["data-size", ["Accordion", "Button", "Checkbox", "Input", "Table", "TextArea"]],
  ["data-full-width", ["Button", "CascadingDropdown", "Dropdown", "InternationalPhoneInput", "MultiSelectDropdown", "MultiSelectSearchableDropdown", "SearchableDropdown"]],
  ["data-centered", ["Modal"]], ["data-fullscreen", ["Modal"]], ["data-mobile-view", ["Table"]],
] as const) exempt([...components], attribute, ECHO);
const AFFORDANCE = "reports that a click handler is set; the element is a button, or takes the pointer cursor and hover paint, and at rest looks like its peers by design";
for (const [attribute, components] of [["data-clickable", ["Breadcrumb", "Stepper", "Table"]]] as const) exempt([...components], attribute, AFFORDANCE);
exempt(["Accordion"], "data-accordion-expand-print", "paints only in print media: the injected print stylesheet opens every panel when the page is printed");
exempt(["Checkbox", "DatePicker", "Loader", "Modal", "Pagination", "RadioButton", "ResizablePanel", "Stepper", "Switch", "TabPanel"], "data-reduce-motion", "governs motion, not paint; `reduced-motion.contract` holds it");

exempt(["Checkbox", "Switch"], "data-checked", "the presence-only companion of `data-state`, which is the attribute that paints and is compared by value");
exempt(["Checkbox"], "data-indeterminate", "the presence-only companion of `data-state=\"indeterminate\"`, which paints");
for (const a of ["data-range-start", "data-range-end"])
  exempt(["DatePicker"], a, "a boolean companion of `data-range`, which paints (accent fill at the ends, accent text in the middle) and is the documented attribute to style");

exempt(["Button", "OtpInput"], "data-disabled", "painted from the native `disabled` and classes resolved from the prop; `disabled shows itself` above asserts the affordance absolutely");
exempt(["Checkbox", "Switch"], "data-error", "painted by classes resolved from `error`; `success paints where error does` above holds the error paint");

/**
 * Shown, not painted: the state is drawn by something the attribute does not
 * style — a child it renders, the surface it opens, a region it moves to, the
 * focus ring. Each reason names what a reader sees.
 */
const SHOWN = "shown rather than painted:";
const OPEN = `${SHOWN} the open surface is the state; the trigger it belongs to keeps its resting paint`;
for (const c of ["CascadingDropdown", "InternationalPhoneInput", "MultiSelectSearchableDropdown", "TimePicker"])
  exempt([c], "data-open", OPEN);
exempt(["Dropdown", "InternationalPhoneInput", "SearchableDropdown"], "data-state", `${SHOWN} on the listbox surface, \`open\` while it is showing; the surface is the state`);
exempt(["Breadcrumb"], "data-dropdown-open", `${SHOWN} the collapsed-items menu is open`);
exempt(["Breadcrumb"], "data-truncated", `${SHOWN} the hidden crumbs are replaced by the ellipsis item`);
exempt(["CascadingDropdown"], "data-has-submenu", `${SHOWN} the item renders a chevron`);
exempt(["DatePicker"], "data-marked", `${SHOWN} the marked day renders its marker dot, a child`);
exempt(["DatePicker", "Table"], "data-highlighted", "the roving keyboard position; it is drawn by the focus ring whenever focus is in the grid, which CONTRAST_NONTEXT measures");
exempt(["Table"], "data-expanded", `${SHOWN} the expand control changes its icon and its label, not its paint`);
exempt(["Table"], "data-editing", `${SHOWN} the cell holds the edit input in place of its text`);
exempt(["Table"], "data-group-row", `${SHOWN} the row holds the group's label, count and toggle in place of a record`);
exempt(["Table"], "data-pinned", `${SHOWN} a pinned column's header and cells move into the pinned region`);
exempt(["OtpInput"], "data-filled", `${SHOWN} a filled cell shows its digit`);
exempt(["Avatar"], "data-has-image", `${SHOWN} the avatar renders the image instead of its initials`);
exempt(["Stepper"], "data-status", `${SHOWN} the active step's indicator paints the accent fill`);
exempt(["Stepper"], "data-invalid", `${SHOWN} an invalid step's indicator paints differently from a valid one`);
exempt(["Button", "OtpInput"], "data-loading", `${SHOWN} a spinner renders, and the control is disabled`);
exempt(["CountryFlag"], "data-error", `${SHOWN} the fallback renders in place of the flag`);
exempt(["Slider"], "data-error", `${SHOWN} the error message renders below, and paints \`text-cl-error\` on \`data-invalid\``);

/**
 * States no fixture can render, each with the reason. A reason that stops
 * being true — the state renders after all — fails as stale.
 */
const STATE_PAINT_UNRENDERED: Record<string, string> = {
  "Accordion data-accordion-print-styles": "on the print <style> element Accordion adds to <head>, not on anything in the body",
  "Accordion data-pending": "set only while a click's close waits out `preventCloseTimeout`, a window no fixture holds open",
  "Avatar data-chumlab": "on the <style> element Avatar adds to <head>, not on anything in the body",
  "Button data-reduce-motion": "on Button's spinner, which follows only the OS setting; fixture pages do not emulate it",
  "Input data-reduce-motion": "on the field's spinner, which follows only the OS setting; fixture pages do not emulate it",
  "InternationalPhoneInput data-reduce-motion": "on the number's spinner, which follows only the OS setting; fixture pages do not emulate it",
  "TextArea data-reduce-motion": "on the field's spinner, which follows only the OS setting; fixture pages do not emulate it",
  "CountryFlag data-loading": "set while the packaged flag image is in flight, which resolves before a fixture page settles",
  "InternationalPhoneInput data-placeholder": "a country is always chosen (`defaultCountry`), so the country trigger never shows its placeholder",
  "Table data-dragging": "set by an HTML drag-and-drop, which the fixture act tools do not perform",
  "Table data-resizing": "set by TanStack during a mouse drag on the resize handle, which the fixture act tools do not perform",
};

/** Every attribute emitted or documented when the population became the union (S3). */
const STATE_PAINT_FLOOR = 296;

/**
 * The population: every attribute a component's render graph emits, read from
 * the AST, and every one its `.ai.md` documents. Until S3 it was the doc
 * bullets alone, which made the docs the ceiling of the gate — 136 emitted
 * attributes were in no doc, and a dragged Slider thumb that painted nothing
 * was never asked. `state-docs.contract` holds the two sides equal.
 */
/** Attributes written together with another that means the same, `[mirror, attribute]`. */
const STATE_MIRRORS: [string, string][] = [
  ["data-checked", "data-state"], ["data-indeterminate", "data-state"], ["data-active", "data-state"], ["data-dragging", "data-state"],
  ["data-range-start", "data-range"], ["data-range-end", "data-range"], ["data-in-range", "data-range"],
  ["data-range-start", "data-in-range"], ["data-range-end", "data-in-range"], ["data-open", "data-state"], ["data-expanded", "data-state"],
];

const stateAttributes = () =>
  componentNames().flatMap((dir) =>
    [...new Set([...emittedBy(dir).keys(), ...documentedAttributes(dir)])].sort().map((attribute) => ({ dir, attribute })),
  );

test("every state a component emits or documents paints", async ({ page }) => {
  test.setTimeout(1_200_000);
  const states = stateAttributes();
  await gotoFixtureIndex(page);
  const paths = await page.locator("[data-fixture-index] li a").evaluateAll((els) =>
    els.map((e) => new URL((e as HTMLAnchorElement).href).pathname),
  );
  type Seen = { path: string; kin: string; tokens: string[]; others: string; value: string | null; paint: string; toggled: boolean };
  const seen = new Map<string, Seen[]>();
  const dirs = [...new Set(states.map((s) => s.dir))];
  for (const dir of dirs) {
    const attributes = states.filter((s) => s.dir === dir).map((s) => s.attribute);
    for (const path of paths.filter((p) => p.split("/")[2].split(".")[0] === dir)) {
      await page.goto(path, { waitUntil: "domcontentloaded" });
      await page.locator("[data-fixture]").waitFor({ state: "attached", timeout: 15000 }).catch(() => {});
      // The state an act reaches exists only once the act has run: until S3
      // this read the page two frames after mount, so a dragged Slider thumb
      // was measured before the drag and counted as never rendered.
      await page
        .waitForFunction(
          () => {
            const main = document.querySelector("main[data-fixture-act]");
            const act = main?.getAttribute("data-fixture-act");
            const still = main?.getAttribute("data-fixture-still");
            return act && act !== "pending" && still && still !== "pending" ? act : null;
          },
          undefined,
          { timeout: 30000 },
        )
        .catch(() => null);
      await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
      const found = await page.evaluate(([attrs, mirrors, hooks]) => {
        const freeze = document.createElement("style");
        freeze.textContent = "*,*::before,*::after{transition:none!important;animation:none!important}";
        document.head.append(freeze);
        const props = (el: Element) => {
          const c = getComputedStyle(el);
          const a = getComputedStyle(el, "::after");
          return [c.backgroundColor, c.borderTopColor, c.borderTopWidth, c.borderTopStyle, c.color, c.outlineStyle, c.outlineColor, c.opacity,
            c.textDecorationLine, c.textDecorationColor, c.boxShadow, c.fontWeight, c.transform, c.translate, c.scale, a.content, a.backgroundColor].join("~");
        };
        // What the element shows as well as how: a state drawn by a child (a
        // check icon, a spinner, a digit) differs from its peer in what is
        // inside it, which no property of its own reports.
        const shape = (el: Element) =>
          `${el.querySelectorAll("svg").length}/${el.querySelectorAll("*").length}/${(el.textContent ?? "").trim() ? 1 : 0}`;
        const paint = (el: Element) => `${props(el)}#${shape(el)}`;
        // The element, what is inside it, and the few ancestors a `has-[…]`
        // variant can draw it on: Input's readonly border is on the control
        // that holds the <input>, which is what carries `data-readonly`.
        const around = (el: Element) => {
          const up: Element[] = [];
          for (let n = el.parentElement; n && up.length < 3 && !n.hasAttribute("data-fixture"); n = n.parentElement) up.push(n);
          return [...up, el, ...el.querySelectorAll("*")].map(props).join("|");
        };
        // What kind of element it is: tag, role and slot, and the parent it
        // sits in. A preset is compared with the other presets, not with the
        // month-navigation button that is also a role-less <button> — which
        // is how an active preset that painted nothing passed until S3.
        const sig = (el: Element) => `${el.tagName.toLowerCase()}|${el.getAttribute("role") ?? ""}|${el.getAttribute("data-slot") ?? ""}`;
        const kin = (el: Element) => `${sig(el)}^${el.parentElement?.tagName ?? ""}.${el.parentElement?.getAttribute("class") ?? ""}`;
        const tokens = (el: Element) => (el.getAttribute("class") ?? "").split(/\s+/).filter(Boolean);
        // Every other state the element is in, and focus, so it is compared
        // only with a peer that differs by the one attribute.
        // A mirror is written with the attribute and means the same thing, so
        // it never tells two elements apart: a checked control always has both
        // `data-state="checked"` and `data-checked`, an unchecked one neither.
        const mirrored = (a: string, b: string) => mirrors.some(([x, y]) => (x === a && y === b) || (x === b && y === a));
        const others = (el: Element, attribute: string) =>
          [...attrs.filter((a) => a !== attribute && !mirrored(a, attribute) && !hooks.includes(a) && el.hasAttribute(a)).map((a) => `${a}=${el.getAttribute(a)}`), el === document.activeElement ? ":focus" : ""].join(" ");
        const out: Record<string, { kin: string; tokens: string[]; others: string; value: string | null; paint: string; toggled: boolean }[]> = {};
        for (const attribute of attrs) {
          // Every element that carries it, not only the innermost: a radio's
          // label dims on `data-disabled` while the circle inside it carries
          // the same attribute and paints nothing of its own, and Table's
          // filter button shows `data-active` while the icon inside it does not.
          const carriers = [...document.body.querySelectorAll(`[${attribute}]`)];
          const kins = new Set(carriers.map(kin));
          const rows = carriers.map((el) => {
            const value = el.getAttribute(attribute)!;
            const before = around(el);
            el.removeAttribute(attribute);
            const toggled = around(el) !== before;
            el.setAttribute(attribute, value);
            return { kin: kin(el), tokens: tokens(el), others: others(el, attribute), value, paint: paint(el), toggled };
          });
          const peers = [...document.body.querySelectorAll("*")]
            .filter((el) => !el.hasAttribute(attribute) && kins.has(kin(el)))
            .map((el) => ({ kin: kin(el), tokens: tokens(el), others: others(el, attribute), value: null, paint: paint(el), toggled: false }));
          out[attribute] = [...rows, ...peers];
        }
        freeze.remove();
        return out;
      }, [attributes, STATE_MIRRORS, STATE_PAINT_HOOKS[dir] ?? []] as const);
      for (const [attribute, rows] of Object.entries(found)) {
        const key = `${dir} ${attribute}`;
        seen.set(key, [...(seen.get(key) ?? []), ...rows.map((r) => ({ ...r, path }))]);
      }
    }
  }
  /** Two elements of one kind share most of their classes as well as their parent. */
  const alike = (a: Seen, b: Seen) => {
    const A = new Set(a.tokens);
    const B = new Set(b.tokens);
    const shared = [...A].filter((t) => B.has(t)).length;
    return A.size + B.size === 0 || shared / (A.size + B.size - shared) >= 0.5;
  };
  /**
   * Painted when the element renders differently without the state, all else
   * equal: removing the attribute changes it or something inside it (a state on
   * a root is often drawn on a child); or a peer of the same kind, in the same
   * other states and focus, that lacks the attribute paints or shows something
   * different — in the same fixture where there is one, since another fixture
   * can differ for reasons of its own; or, for an attribute that always carries
   * a value, two values on otherwise-equal elements paint differently. A
   * selected day that is also the focused one is not compared with a resting
   * day: the focus ring would answer for it.
   */
  const painted = (rows: Seen[]) => {
    const carriers = rows.filter((r) => r.value !== null);
    if (carriers.some((r) => r.toggled)) return true;
    for (const c of carriers) {
      const peers = rows.filter((r) => r.value === null && r.kin === c.kin && r.others === c.others && alike(r, c));
      const local = peers.filter((r) => r.path === c.path);
      if ((local.length ? local : peers).some((r) => r.paint !== c.paint)) return true;
    }
    const groups = new Map<string, Map<string, string>>();
    for (const c of carriers) {
      const g = `${c.kin}#${c.others}`;
      if (!groups.has(g)) groups.set(g, new Map());
      groups.get(g)!.set(c.value!, c.paint);
    }
    return [...groups.values()].some((v) => v.size > 1 && new Set(v.values()).size > 1);
  };
  const all = states.map((s) => `${s.dir} ${s.attribute}`);
  const hooks = states.filter((s) => isHook(s.dir, s.attribute)).map((s) => `${s.dir} ${s.attribute}`);
  const keys = all.filter((k) => !hooks.includes(k));
  const rendered = (k: string) => Boolean(seen.get(k)?.some((r) => r.value !== null));
  const unrendered = keys.filter((k) => !rendered(k));
  const unreasoned = unrendered.filter((k) => !STATE_PAINT_UNRENDERED[k]);
  const unpainted = keys.filter((k) => rendered(k) && !painted(seen.get(k)!) && !STATE_PAINT_EXEMPT[k]);
  const stale = [
    ...Object.keys(STATE_PAINT_EXEMPT).filter((k) => !keys.includes(k) || !rendered(k) || painted(seen.get(k)!)),
    ...Object.entries(STATE_PAINT_HOOKS).flatMap(([c, as]) => as.map((a) => `${c} ${a}`)).filter((k) => !all.includes(k) || !rendered(k)),
    ...Object.keys(STATE_PAINT_UNRENDERED).filter((k) => !keys.includes(k) || rendered(k)),
  ];
  const example = (k: string) => seen.get(k)!.find((r) => r.value !== null)!.path;
  console.log(
    `STATE_PAINT states ${all.length} (floor ${STATE_PAINT_FLOOR}), hooks ${hooks.length}, measured ${keys.length - unrendered.length}, ` +
      `unpainted ${unpainted.length}, exempt ${Object.keys(STATE_PAINT_EXEMPT).length}, unrendered ${unrendered.length} (reasoned ${unrendered.length - unreasoned.length})`,
  );
  for (const k of unpainted) console.log(`  STATE_PAINT_UNPAINTED ${k} — e.g. ${example(k)}`);
  for (const k of unreasoned) console.log(`  STATE_PAINT_UNRENDERED ${k}`);
  for (const k of stale) console.log(`  STATE_PAINT_STALE_EXEMPTION ${k}`);
  expect(all.length).toBeGreaterThanOrEqual(STATE_PAINT_FLOOR);
  expect(unpainted, "a state renders exactly like the same element at rest").toEqual([]);
  expect(unreasoned, "a state no fixture renders, with no reason given").toEqual([]);
  expect(stale, "an exemption or a reason that excuses nothing").toEqual([]);
});
