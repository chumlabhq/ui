import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { expect, test } from "@playwright/test";
import { gotoFixture, gotoFixtureIndex } from "./_nav";
import { PAINT_HELPERS } from "./_contrast-measure";
import { componentNames, emittedBy } from "../src/test/emittedAttributes";

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
