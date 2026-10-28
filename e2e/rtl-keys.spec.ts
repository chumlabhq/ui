import type { Page } from "@playwright/test";
import { test, expect } from "./_test";
import { gotoFixture, servedRtl } from "./_nav";
import { settle } from "./_surfaces";

/**
 * Every arrow key reaches the element it points at, in a left-to-right page and
 * in a right-to-left one.
 *
 * The A2 audit pressed the arrows in a page served as `<html dir="rtl">` and
 * found CascadingDropdown, DatePicker's grid, Table's grid and OtpInput moving
 * focus to the visually OPPOSITE neighbour, because each handler mapped
 * ArrowLeft to "previous" whatever the direction (cause C4). RadioGroup leaves
 * its arrows to the native radios, which disagree: chromium and firefox mirror
 * in RTL and wrap, webkit does neither, and firefox moves nothing at all in a
 * group without a `name`, which RadioGroup did not supply.
 *
 * Where an arrow should land is read off the painted page, never off the code
 * under test: the candidates' rects are sorted by x (or by y for a vertical
 * radio group), and the expected element is the visual neighbour in the
 * arrow's direction. Home and End are logical keys and land on the inline
 * start and end, which the document's direction decides — except in
 * OtpInput, whose digit row reads left to right in every page (D3), so its
 * Home is the leftmost box in both.
 *
 * What each component counts:
 * - CascadingDropdown, `closed` (submenuSide end) and `open-submenu-left`
 *   (start): the side the submenu is drawn on is measured first, from an Enter
 *   open; the arrow pointing at that side must open it there, the opposite
 *   arrow must close it from inside and open nothing from its parent.
 *   `open-submenu-left`'s wrapper is pushed to the right edge, where a
 *   right-to-left `start` submenu has no room and flips; it is centred here so
 *   the side measured is the side asked for in both directions.
 * - DatePicker, `keyboard-focus`: a mid-week day of the calendar's third row.
 * - Table, `keyboard-grid`: row 3, from a middle cell and from each end.
 * - OtpInput, `default`: the second box.
 * - InternationalPhoneInput, `default`: the number field's own direction, and
 *   the caret at a group boundary. The caret's painted position inside an
 *   `<input>` cannot be read, so its rows assert the LTR field the decision
 *   asks for and a one-digit logical move, which in an LTR field of digits and
 *   separators is the visual one. Home and End are the platform's caret keys
 *   there, not the library's, and are not counted.
 * - RadioGroup, `default` (vertical, unnamed), `horizontal` (unnamed) and
 *   `named-horizontal` (named, three enabled): every enabled radio's neighbour
 *   in both directions, wrapping at the ends, and the radio reached is the one
 *   checked. The two unnamed fixtures carry a disabled third radio, which the
 *   arrows skip.
 *
 * Every page is 1024 px wide in every project, so the submenu has room on both
 * sides and Mobile Chrome and Mobile Safari press the same rows.
 */

type Dir = "ltr" | "rtl";
type Row = { name: string; ok: boolean; detail: string };

/** Rows per component and direction, from A2c's step 0 on 844a6946. A walk that presses fewer has lost rows. */
const FLOOR = {
  CascadingDropdown: 6,
  DatePicker: 4,
  Table: 6,
  OtpInput: 4,
  InternationalPhoneInput: 3,
  RadioGroup: 12,
} as const;

type Component = keyof typeof FLOOR;

async function load(page: Page, dir: Dir, component: string, fixture: string): Promise<void> {
  await page.setViewportSize({ width: 1024, height: 800 });
  await gotoFixture(page, component, fixture);
  await settle(page, `${component}/${fixture}`);
  const painted = await page.evaluate(() => getComputedStyle(document.documentElement).direction);
  expect(painted, `${component}/${fixture} was served ${dir} and rendered ${painted}`).toBe(dir);
}

/**
 * The candidates matching `selector`, in visual order along `axis`, and which
 * of them holds focus. Indices into `order` are what every row compares.
 */
async function visual(page: Page, selector: string, axis: "x" | "y" = "x") {
  return page.evaluate(
    ([sel, ax]) => {
      const els = [...document.querySelectorAll<HTMLElement>(sel)];
      const centre = (el: HTMLElement) => {
        const r = el.getBoundingClientRect();
        return ax === "x" ? r.left + r.width / 2 : r.top + r.height / 2;
      };
      const order = els.map((el, dom) => ({ dom, at: centre(el) })).sort((a, b) => a.at - b.at).map((e) => e.dom);
      const active = document.activeElement;
      const dom = els.findIndex((el) => el === active || el.contains(active));
      return { order, focused: dom < 0 ? -1 : order.indexOf(dom) };
    },
    [selector, axis] as const,
  );
}

async function focusVisual(page: Page, selector: string, index: number, axis: "x" | "y" = "x") {
  const { order } = await visual(page, selector, axis);
  await page.locator(selector).nth(order[index]).focus();
}

const inlineStartIsLeft = (dir: Dir) => dir === "ltr";

async function cascading(page: Page, dir: Dir): Promise<Row[]> {
  const rows: Row[] = [];
  const SURFACE = "[data-cascading-submenu]";
  const parent = page.locator('[role="menuitem"]', { hasText: "Fruit" });
  const submenuSide = () =>
    page.evaluate((sel) => {
      const sub = document.querySelector(sel)?.getBoundingClientRect();
      const menu = document.querySelector('[role="menu"]')?.getBoundingClientRect();
      if (!sub || !menu) return null;
      return sub.left + sub.width / 2 < menu.left + menu.width / 2 ? "Left" : "Right";
    }, SURFACE);
  const state = async () => ({
    open: (await page.locator(SURFACE).count()) > 0,
    side: await submenuSide(),
    inSubmenu: await page.evaluate((sel) => !!document.activeElement?.closest(sel), SURFACE),
    onParent: await parent.evaluate((el) => el === document.activeElement),
  });

  for (const [fixture, asked] of [["closed", "end"], ["open-submenu-left", "start"]] as const) {
    await load(page, dir, "CascadingDropdown", fixture);
    await page.evaluate(() => {
      const wrapper = document.querySelector<HTMLElement>("[data-fixture] > div[style]");
      if (wrapper) wrapper.style.marginInline = "auto";
    });
    for (let i = 0; i < 3 && (await page.locator('[role="menu"]').count()); i++) await page.keyboard.press("Escape");
    await page.locator("[data-fixture] button[aria-haspopup]").first().focus();
    await page.keyboard.press("ArrowDown");
    await expect(parent).toBeFocused();

    await page.keyboard.press("Enter");
    await expect(page.locator(SURFACE)).toHaveCount(1);
    const side = await submenuSide();
    await page.keyboard.press("Escape");
    await expect(page.locator(SURFACE)).toHaveCount(0);
    await expect(parent).toBeFocused();
    const toward = `Arrow${side}`;
    const away = side === "Left" ? "ArrowRight" : "ArrowLeft";
    const label = `${fixture} (submenuSide ${asked}, drawn ${side?.toLowerCase()})`;

    await page.keyboard.press(toward);
    const opened = await state();
    rows.push({
      name: `${label}: ${toward} on the parent opens the submenu on its side`,
      ok: opened.open && opened.side === side && opened.inSubmenu,
      detail: JSON.stringify(opened),
    });

    if (!opened.open) await page.keyboard.press("Enter");
    await expect(page.locator(SURFACE)).toHaveCount(1);
    await page.keyboard.press(away);
    const closed = await state();
    rows.push({
      name: `${label}: ${away} inside the submenu closes it and returns to the parent`,
      ok: !closed.open && closed.onParent,
      detail: JSON.stringify(closed),
    });

    if (closed.open) await page.keyboard.press("Escape");
    await parent.focus();
    await page.keyboard.press(away);
    const stayed = await state();
    rows.push({
      name: `${label}: ${away} on the parent opens nothing`,
      ok: !stayed.open,
      detail: JSON.stringify(stayed),
    });
  }
  return rows;
}

async function datePicker(page: Page, dir: Dir): Promise<Row[]> {
  await load(page, dir, "DatePicker", "keyboard-focus");
  const rows: Row[] = [];
  await expect(page.locator('[role="grid"]')).toBeVisible();
  const target = await thirdWeek(page);
  await expect(page.locator(target), "the calendar's third row is not a seven-day week").toHaveCount(7);
  const day =(index: number) => page.evaluate(([sel, i]) => {
    const els = [...document.querySelectorAll<HTMLElement>(sel)];
    const sorted = [...els].sort((a, b) => a.getBoundingClientRect().left - b.getBoundingClientRect().left);
    return sorted[i]?.textContent?.trim() ?? null;
  }, [target, index] as const);
  const focusedDay = () => page.evaluate(() => (document.activeElement?.getAttribute("role") === "gridcell" ? document.activeElement.textContent?.trim() ?? null : null));

  const cases: Array<[string, number, number]> = [
    ["ArrowLeft", 3, 2],
    ["ArrowRight", 3, 4],
    ["Home", 3, inlineStartIsLeft(dir) ? 0 : 6],
    ["End", 3, inlineStartIsLeft(dir) ? 6 : 0],
  ];
  for (const [key, from, to] of cases) {
    await focusVisual(page, target, from);
    const start = await focusedDay();
    const want = await day(to);
    await page.keyboard.press(key);
    const got = await focusedDay();
    rows.push({ name: `${key} from the third week's 4th day from the left (${start})`, ok: got === want, detail: `reached ${got}, the cell ${to} from the left is ${want}` });
  }
  return rows;
}

/** The seven gridcells sharing the third distinct row position of the calendar, marked for a selector. */
async function thirdWeek(page: Page): Promise<string> {
  await page.evaluate(() => {
    const cells = [...document.querySelectorAll<HTMLElement>('[role="grid"] [role="gridcell"]')];
    const tops = [...new Set(cells.map((c) => Math.round(c.getBoundingClientRect().top)))].sort((a, b) => a - b);
    for (const c of cells) if (Math.round(c.getBoundingClientRect().top) === tops[2]) c.setAttribute("data-rtl-keys-week", "");
  });
  return "[data-rtl-keys-week]";
}

async function table(page: Page, dir: Dir): Promise<Row[]> {
  await load(page, dir, "Table", "keyboard-grid");
  const rows: Row[] = [];
  const cells = "[data-fixture] tbody tr:nth-child(3) td";
  const last = (await page.locator(cells).count()) - 1;
  const cases: Array<[string, string, number, number]> = [
    ["ArrowLeft", "a middle cell", 2, 1],
    ["ArrowRight", "a middle cell", 1, 2],
    ["ArrowLeft", "the left end", 0, 0],
    ["ArrowRight", "the right end", last, last],
    ["Home", "a middle cell", 1, inlineStartIsLeft(dir) ? 0 : last],
    ["End", "a middle cell", 1, inlineStartIsLeft(dir) ? last : 0],
  ];
  for (const [key, where, from, to] of cases) {
    await focusVisual(page, cells, from);
    await page.keyboard.press(key);
    const { focused } = await visual(page, cells);
    rows.push({ name: `${key} from ${where} (cell ${from} from the left)`, ok: focused === to, detail: `reached cell ${focused} from the left, want ${to}` });
  }
  return rows;
}

async function otp(page: Page, dir: Dir): Promise<Row[]> {
  await load(page, dir, "OtpInput", "default");
  const rows: Row[] = [];
  const boxes = "[data-fixture] input";
  const last = (await page.locator(boxes).count()) - 1;
  const cases: Array<[string, number, number]> = [
    ["ArrowLeft", 1, 0],
    ["ArrowRight", 1, 2],
    ["Home", 1, 0],
    ["End", 1, last],
  ];
  for (const [key, from, to] of cases) {
    await focusVisual(page, boxes, from);
    await page.keyboard.press(key);
    const { focused } = await visual(page, boxes);
    rows.push({ name: `${key} from box ${from} from the left`, ok: focused === to, detail: `reached box ${focused} from the left, want ${to}` });
  }
  return rows;
}

async function phone(page: Page, dir: Dir): Promise<Row[]> {
  await load(page, dir, "InternationalPhoneInput", "default");
  const rows: Row[] = [];
  const field = page.locator('[data-fixture] input[type="tel"]');
  await field.focus();
  await page.keyboard.type("2071234567");
  const value = await field.inputValue();
  const direction = await field.evaluate((el) => getComputedStyle(el).direction);
  rows.push({ name: `the number field lays "${value}" out left to right`, ok: direction === "ltr", detail: `direction ${direction}` });

  const group = /\d\D+(?=\d)/.exec(value);
  const boundary = group ? group.index + group[0].length : -1;
  for (const [key, step] of [["ArrowLeft", -1], ["ArrowRight", 1]] as const) {
    await field.evaluate((el: HTMLInputElement, at) => el.setSelectionRange(at, at), boundary);
    await page.keyboard.press(key);
    const caret = await field.evaluate((el: HTMLInputElement) => el.selectionStart);
    rows.push({
      name: `${key} at the start of the second group (offset ${boundary}) moves one character`,
      ok: caret === boundary + step,
      detail: `caret at ${caret}, want ${boundary + step}`,
    });
  }
  return rows;
}

async function radio(page: Page, dir: Dir): Promise<Row[]> {
  const rows: Row[] = [];
  const radios = '[data-fixture] input[type="radio"]:not(:disabled)';
  const fixtures = [
    ["default", "y", ["ArrowUp", "ArrowDown"]],
    ["horizontal", "x", ["ArrowLeft", "ArrowRight"]],
    ["named-horizontal", "x", ["ArrowLeft", "ArrowRight"]],
  ] as const;
  for (const [fixture, axis, [back, forward]] of fixtures) {
    await load(page, dir, "RadioButton", fixture);
    const name = await page.locator(radios).first().getAttribute("name");
    const count = await page.locator(radios).count();
    const last = count - 1;
    const cases: Array<[string, number, number]> = [
      [forward, 0, 1],
      [back, last, last - 1],
      [forward, last, 0],
      [back, 0, last],
    ];
    for (const [key, from, to] of cases) {
      await focusVisual(page, radios, from, axis);
      await page.keyboard.press(key);
      const { focused } = await visual(page, radios, axis);
      const { order } = await visual(page, radios, axis);
      const checked = focused >= 0 && (await page.locator(radios).nth(order[focused]).isChecked());
      rows.push({
        name: `${fixture} (name ${name === null ? "none" : JSON.stringify(name)}): ${key} from radio ${from} of ${count} along ${axis}`,
        ok: focused === to && checked,
        detail: `reached radio ${focused}${checked ? ", checked" : ", NOT checked"}, want ${to}`,
      });
    }
  }
  return rows;
}

const WALKS: Record<Component, (page: Page, dir: Dir) => Promise<Row[]>> = {
  CascadingDropdown: cascading,
  DatePicker: datePicker,
  Table: table,
  OtpInput: otp,
  InternationalPhoneInput: phone,
  RadioGroup: radio,
};

for (const dir of ["ltr", "rtl"] as const) {
  for (const component of Object.keys(WALKS) as Component[]) {
    test(`${component} in a ${dir} page: every arrow reaches the element it points at`, async ({ page }, info) => {
      if (dir === "rtl") await servedRtl(page);
      const rows = await WALKS[component](page, dir);
      const wrong = rows.filter((r) => !r.ok);
      console.log(
        `RTL_KEYS ${info.project.name} ${dir} ${component}: rows ${rows.length} (floor ${FLOOR[component]}), ` +
          `wrong ${wrong.length} -> ${wrong.length ? "RED" : "GREEN"}`,
      );
      for (const r of rows) console.log(`RTL_KEYS_ROW ${info.project.name} ${dir} ${component} ${r.ok ? "ok   " : "WRONG"} ${r.name}: ${r.detail}`);
      expect(rows.length, "fewer rows than step 0 pressed: the walk lost rows").toBeGreaterThanOrEqual(FLOOR[component]);
      expect(wrong.map((r) => `${r.name}: ${r.detail}`)).toEqual([]);
    });
  }
}
