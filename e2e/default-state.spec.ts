import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { expect, test } from "@playwright/test";
import { gotoFixture, gotoFixtureIndex } from "./_nav";

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
  // Re-deletes what 6dd1925 deleted, in the browser: strip the `data-[state=…]`
  // variants off the checkbox's control and require the comparison to call the
  // two states identical again. Without this the gate could be measuring
  // nothing and reporting nothing, which is the same output as passing.
  await page.goto("/__fixtures/Checkbox/checked", { waitUntil: "domcontentloaded" });
  await page.locator("[data-fixture]").waitFor({ state: "attached", timeout: 15000 });

  const paint = (sel: string) =>
    page.evaluate((s) => {
      const el = [...document.querySelectorAll<HTMLElement>(`[data-fixture] ${s}`)]
        .find((e) => parseFloat(getComputedStyle(e).borderTopWidth) > 0);
      if (!el) return "none";
      const c = getComputedStyle(el);
      return [c.backgroundColor, c.borderTopColor, c.color].join("~");
    }, sel);

  const before = await paint('[data-state="checked"]');
  expect(before, "the checked control paints nothing to begin with").not.toBe("none");

  // Flip the attribute rather than strip the class: React owns `className` and
  // puts it straight back, so a class edit measures nothing. Moving the element
  // out of the state is the same question asked from the other side — if the
  // library still paints `checked`, the paint has to follow the attribute.
  await page.evaluate(() => {
    for (const el of document.querySelectorAll('[data-fixture] [data-state="checked"]')) {
      el.setAttribute("data-state", "unchecked");
    }
  });

  // The control carries `transition-colors`, so the value read in the tick the
  // attribute changes is still the old one animating away. Waited on the
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

  const after = await paint('[data-state="unchecked"]');
  expect(after, "the paint did not follow the state attribute, so the gate is measuring nothing").not.toBe(before);
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
 * A highlighted option has to look highlighted.
 *
 * The five dropdowns emitted `data-highlighted` on the active option and styled
 * it in none of their `item` slots, so arrowing through any of them moved a
 * highlight that painted nothing — SC 2.4.7 for the `aria-activedescendant`
 * pattern, where DOM focus never leaves the control and the attribute IS the
 * indicator. It shipped that way from 2026-09-02, when the attribute was
 * converged onto `data-highlighted`, to 2026-09-10: eight days.
 *
 * Found by planting against a visual subject that was then withdrawn for being
 * unable to fail, which is exactly why this is a conformance check and not a
 * picture. Same reason it is in e2e as the rest of this file: jsdom applies no
 * stylesheet, so `data-[highlighted]:bg-cl-bg-hover` resolves to nothing there.
 */
const HIGHLIGHT_COMPONENTS = [
  "Dropdown",
  "SearchableDropdown",
  "MultiSelectDropdown",
  "MultiSelectSearchableDropdown",
  "CascadingDropdown",
];

test("a highlighted option paints differently from its siblings", async ({ page }) => {
  test.setTimeout(300_000);
  const unpainted: string[] = [];
  const checked: string[] = [];

  for (const component of HIGHLIGHT_COMPONENTS) {
    const fixture = component === "CascadingDropdown" ? "open-submenu" : "open";
    await gotoFixture(page, component, fixture);
    await page.locator("[data-fixture]").waitFor({ state: "attached", timeout: 15000 }).catch(() => {});

    const control = page.locator("[role='listbox'],[role='combobox'],[role='menu']").first();
    await control.waitFor({ state: "visible", timeout: 15000 }).catch(() => {});
    await control.evaluate((n: HTMLElement) => n.focus());
    await page.keyboard.press("ArrowDown");
    await page.waitForTimeout(150);

    const r = await page.evaluate(() => {
      const opts = [...document.querySelectorAll<HTMLElement>("[role='option'],[role='menuitem']")];
      const hot = opts.find((o) => o.hasAttribute("data-highlighted"));
      if (!hot) return { marked: false, same: false };
      const paint = (e: HTMLElement) => {
        const c = getComputedStyle(e);
        return [c.backgroundColor, c.color, c.borderTopColor, c.outlineColor, c.textDecorationLine].join("~");
      };
      // Against a sibling that is NOT highlighted, so this cannot pass because
      // every option happens to share one colour.
      const cold = opts.find((o) => o !== hot && !o.hasAttribute("data-highlighted") && !o.hasAttribute("data-disabled"));
      return { marked: true, same: cold ? paint(hot) === paint(cold) : false, hadSibling: Boolean(cold) };
    });

    if (!r.marked) continue;
    checked.push(component);
    if (r.same) unpainted.push(component);
  }

  console.log(`HIGHLIGHT_STATE checked=${checked.length} unpainted=${unpainted.length}`);
  expect(checked.length, "no dropdown reported a highlighted option").toBeGreaterThan(3);
  expect(
    unpainted,
    "these mark an option `data-highlighted` and paint it exactly like an " +
      "unhighlighted sibling — with activedescendant, the attribute is the only " +
      "indicator a keyboard user gets",
  ).toEqual([]);
});
