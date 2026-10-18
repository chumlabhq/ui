/**
 * A disabled control acts on nothing.
 *
 * A3 found Pagination's Previous and Next working while the whole control was
 * `disabled`: the root took `pointer-events: none`, so a mouse could not reach
 * them, and a keyboard user could Tab to Next and press Enter. S4's step 0 found
 * the same shape elsewhere — a disabled CascadingDropdown parent opened its
 * submenu on hover and on the arrow key, and a disabled Slider thumb, ResizablePanel
 * handle and menu item took focus on a click. Nothing caught any of it: every
 * check of `disabled` asked whether it was painted, not whether it worked.
 *
 * So every component whose props include `disabled` (read from the generated
 * docs, not listed here) is rendered disabled, and every control on the page
 * that could act — buttons, inputs, options, tabs, sliders, separators,
 * anything focusable — is clicked with the real mouse (which honours
 * `pointer-events`) and, where it takes focus at all, pressed with the keys
 * that activate it. Items that support their own `disabled` are tested the
 * same way, item by item. After each, nothing may have changed: no value, no
 * state, no popup, no focus moved, no callback reported (through the fixture
 * page's `?spy=`). And a Tab walk through the page reaches none of them.
 */
import { expect, test } from "./_test";
import type { Page } from "@playwright/test";
import { fixturePath } from "./_nav";
import { COMPONENT_DOCS } from "../src/pages/demo/generated/componentDocs";

/** Components with a `disabled` prop of their own, when the population was first measured (S4). */
const COMPONENT_FLOOR = 22;
/** Controls clicked and keyed, across every case, at the same moment. */
const CONTROL_FLOOR = 88;

/**
 * Input takes `disabled` from the native input's attributes, which the docs'
 * props table leaves out, so the docs alone would leave it out of this check.
 */
const INHERITED_DISABLED = ["Input"];

/** Components whose own props include `disabled`, from the docs the site renders. */
const ROOT = [
  ...new Set([
    ...Object.values(COMPONENT_DOCS)
      .filter((d) => d.props.some((p) => p.name === "disabled"))
      .map((d) => d.name),
    ...INHERITED_DISABLED,
  ]),
].sort();

/**
 * Item-level `disabled`: an option, a tab, a step, a crumb, a radio, an
 * accordion item, a day. Each fixture renders at least one disabled item
 * beside enabled ones, and only the disabled ones are acted on.
 */
const ITEMS: [string, string][] = [
  ["Accordion", "single-open"],
  ["Breadcrumb", "disabled-mid"],
  ["CascadingDropdown", "disabled-top-level"],
  ["CascadingDropdown", "open-submenu"],
  ["DatePicker", "bounded-in-range"],
  ["Dropdown", "open"],
  ["MultiSelectDropdown", "open"],
  ["MultiSelectSearchableDropdown", "open"],
  ["RadioButton", "default"],
  ["SearchableDropdown", "open"],
  ["Stepper", "clickable"],
  ["TabPanel", "default"],
  ["TimePicker", "open-bounded"],
];

/**
 * Tooltip's `disabled` turns the tooltip off, not the element it describes: the
 * trigger is the consumer's own button and still takes focus. Only the tooltip
 * opening counts as acting.
 */
const TRIGGER_IS_THE_CONSUMERS = new Set(["Tooltip"]);

/** Callbacks a component reports through: every `on*` prop except the DOM passthroughs. */
const spiesFor = (component: string) =>
  [...COMPONENT_DOCS[component].props, ...COMPONENT_DOCS[component].subComponents.flatMap((s) => s.props)]
    .map((p) => p.name)
    .filter((n) => /^on[A-Z]/.test(n) && !/^on(Focus|Blur|Key|Mouse|Pointer|Hover|Cursor|RowHover|HeaderHover|Copy|Paste)/.test(n));

const CONTROL =
  'button, a[href], input:not([type=hidden]), textarea, select, [role=button], [role=option], [role=menuitem], [role=menuitemradio], [role=menuitemcheckbox], [role=tab], [role=slider], [role=separator], [role=combobox], [role=checkbox], [role=radio], [role=switch], [role=gridcell], [tabindex]:not([role=tabpanel]):not([role=dialog]), [aria-disabled="true"]';
/** Keys that move a value as well as activate: pressed only on a control that holds a value. */
const VALUE_KEYS = ["ArrowUp", "ArrowRight", "Home", "End", "PageUp", "Delete", "a"];

interface Case { component: string; fixture: string; scope: "all" | "items" }

/** Where a component's `disabled` fixture disables its items rather than the component itself. */
const ROOT_FIXTURE: Record<string, string> = { Stepper: "disabled-root" };

const cases: Case[] = [
  ...ROOT.map((component) => ({ component, fixture: ROOT_FIXTURE[component] ?? "disabled", scope: "all" as const })),
  ...ITEMS.map(([component, fixture]) => ({ component, fixture, scope: "items" as const })),
];

async function open(page: Page, c: Case) {
  const spy = spiesFor(c.component).join(",");
  await page.goto(`${fixturePath(c.component, c.fixture)}${spy ? `?spy=${spy}` : ""}`, { waitUntil: "domcontentloaded" });
  await page.locator("[data-fixture]").waitFor({ state: "attached", timeout: 15000 });
  await page
    .waitForFunction(() => {
      const m = document.querySelector("main[data-fixture-act]");
      const a = m?.getAttribute("data-fixture-act");
      const s = m?.getAttribute("data-fixture-still");
      return a && a !== "pending" && s && s !== "pending";
    }, undefined, { timeout: 30000 })
    .catch(() => null);
  return page.evaluate(
    ([sel, scope]) => {
      const visible = (e: Element) => e.getClientRects().length > 0;
      const inScope = (e: Element) => Boolean(e.closest("[data-fixture]")) || !e.closest("main");
      const all = [...document.querySelectorAll(sel)].filter((e) => inScope(e) && visible(e) && !e.matches("[data-fixture]"));
      const disabledItem = (e: Element) =>
        e.matches('[aria-disabled="true"], :disabled') ||
        (e.hasAttribute("data-disabled") && !e.hasAttribute("data-fixture"));
      const picked = scope === "items" ? all.filter(disabledItem) : all;
      picked.forEach((e, i) => e.setAttribute("data-acts-probe", String(i)));
      return picked.length;
    },
    [CONTROL, c.scope] as const,
  );
}

/** Everything a user or a consumer could notice changed. */
const snapshot = (page: Page) =>
  page.evaluate(() => {
    const attrs = ["aria-expanded", "aria-selected", "aria-checked", "aria-valuenow", "aria-current", "aria-pressed", "data-state", "data-selected", "data-open", "data-highlighted"];
    const state = [...document.body.querySelectorAll("*")]
      .flatMap((e) => attrs.filter((a) => e.hasAttribute(a)).map((a) => `${a}=${e.getAttribute(a)}`))
      .join(";");
    const values = [...document.querySelectorAll("input, textarea")]
      .map((e) => {
        const i = e as HTMLInputElement;
        return i.type === "checkbox" || i.type === "radio" ? String(i.checked) : i.value;
      })
      .join(";");
    const popups = document.querySelectorAll("[role=listbox], [role=menu], [role=dialog], [role=tooltip], [role=grid]").length;
    const a = document.activeElement;
    const focus = !a || a === document.body ? "body" : `${a.tagName.toLowerCase()}${a.id ? "#" + a.id : ""}[${a.getAttribute("role") ?? ""}] ${(a.textContent ?? "").trim().slice(0, 20)}`;
    const calls = ((window as unknown as { __fixtureCalls?: string[] }).__fixtureCalls ?? []).join(",");
    // Focus counts when the control itself took it: a click inside an open
    // calendar focuses the calendar, which is the surface, not the disabled day.
    const focusOnProbe = Boolean(a?.hasAttribute("data-acts-probe"));
    const text = (document.querySelector("[data-fixture]") as HTMLElement | null)?.innerText.replace(/\s+/g, " ") ?? "";
    return { text, state, values, popups, focus, calls, focusOnProbe };
  });

type Snap = Awaited<ReturnType<typeof snapshot>>;
const changes = (a: Snap, b: Snap, ignoreFocus: boolean) =>
  (Object.keys(a) as (keyof Snap)[])
    .filter((k) => a[k] !== b[k] && !(k === "focus" && (ignoreFocus || !b.focusOnProbe)))
    .filter((k) => k !== "focusOnProbe")
    .map((k) => (k === "focus" ? `focus ${a.focus} -> ${b.focus}` : k === "calls" ? `reported ${b.calls.slice(a.calls.length).replace(/^,/, "")}` : k === "popups" ? `popups ${a.popups} -> ${b.popups}` : k));

/**
 * Clicks and keys one control, from a fresh page each time, and says what
 * changed. Exported to the self-check below, so the plant goes through the
 * same reading of the page as every real case.
 */
async function act(page: Page, c: Case, index: number): Promise<{ label: string; acted: string[] }> {
  const ignoreFocus = TRIGGER_IS_THE_CONSUMERS.has(c.component);
  const acted: string[] = [];
  await open(page, c);
  const el = page.locator(`[data-acts-probe="${index}"]`);
  const label = await el.evaluate((e) => `${e.tagName.toLowerCase()}[${e.getAttribute("role") ?? ""}] "${(e.getAttribute("aria-label") ?? e.textContent ?? "").trim().replace(/\s+/g, " ").slice(0, 24)}"`);
  let before = await snapshot(page);
  const box = await el.boundingBox();
  if (box) {
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    await page.waitForTimeout(200);
    acted.push(...changes(before, await snapshot(page), ignoreFocus).map((x) => `click: ${x}`));
  }
  await open(page, c);
  const again = page.locator(`[data-acts-probe="${index}"]`);
  const focusable = await again.evaluate((e) => {
    (e as HTMLElement).focus();
    return document.activeElement === e;
  });
  if (focusable) {
    before = await snapshot(page);
    const holdsValue = await again.evaluate((e) => e.matches("input, textarea, [role=slider], [role=separator], [role=spinbutton], [role=combobox]"));
    for (const key of ["Enter", " ", ...(holdsValue && c.scope === "all" ? VALUE_KEYS : [])]) await page.keyboard.press(key);
    await page.waitForTimeout(200);
    acted.push(...changes(before, await snapshot(page), true).map((x) => `keys: ${x}`));
  }
  return { label, acted };
}

test.describe("disabled acts on nothing", () => {
  test.setTimeout(900_000);

  test("every disabled control, clicked and keyed, changes nothing and reports nothing", async ({ page }) => {
    const found: string[] = [];
    let controls = 0;
    const missing: string[] = [];
    for (const c of cases) {
      const n = await open(page, c).catch(() => -1);
      if (n < 0) {
        missing.push(`${c.component}/${c.fixture}: no such fixture`);
        continue;
      }
      if (n === 0) console.log(`  DISABLED_ACTS_NOTHING_ACTIONABLE ${c.component}/${c.fixture}`);
      for (let i = 0; i < n; i++) {
        const { label, acted } = await act(page, c, i);
        controls += 1;
        if (acted.length) found.push(`${c.component}/${c.fixture} ${label} — ${acted.join("; ")}`);
      }
      // A Tab walk from the top of the page: nothing disabled takes a tab stop.
      await open(page, c);
      for (let t = 0; t < 30; t++) {
        await page.keyboard.press("Tab");
        const stop = await page.evaluate(() => {
          const a = document.activeElement;
          return a?.hasAttribute("data-acts-probe") ? `${a.tagName.toLowerCase()} "${(a.textContent ?? "").trim().slice(0, 20)}"` : null;
        });
        if (stop && !TRIGGER_IS_THE_CONSUMERS.has(c.component)) {
          found.push(`${c.component}/${c.fixture} ${stop} — takes a Tab stop while disabled`);
          break;
        }
      }
    }
    console.log(
      `DISABLED_ACTS components ${ROOT.length} (floor ${COMPONENT_FLOOR}), item cases ${ITEMS.length}, controls ${controls} (floor ${CONTROL_FLOOR}), acted ${found.length}`,
    );
    for (const f of found) console.log(`  DISABLED_ACTS_FOUND ${f}`);
    for (const m of missing) console.log(`  DISABLED_ACTS_MISSING ${m}`);
    expect(missing, "a disabled-capable component with no fixture to act on").toEqual([]);
    expect(ROOT.length).toBeGreaterThanOrEqual(COMPONENT_FLOOR);
    expect(controls).toBeGreaterThanOrEqual(CONTROL_FLOOR);
    expect(found, "a disabled control that acted").toEqual([]);
  });

  test("self-check: a control planted to ignore disabled is found", async ({ page }) => {
    const c: Case = { component: "Button", fixture: "disabled", scope: "all" };
    const n = await open(page, c);
    expect(n).toBeGreaterThan(0);
    // The plant runs on every load: a disabled button that is not disabled at
    // all, and writes to the page when it is pressed.
    await page.addInitScript(() => {
      new MutationObserver(() => {
        const b = document.querySelector("[data-fixture] button");
        if (!b || b.hasAttribute("data-planted")) return;
        b.setAttribute("data-planted", "");
        b.removeAttribute("disabled");
        b.addEventListener("click", () => {
          b.textContent = "pressed";
        });
      }).observe(document, { childList: true, subtree: true });
    });
    const { acted } = await act(page, c, 0);
    expect(acted.join("; ")).toMatch(/click: text/);
  });
});
