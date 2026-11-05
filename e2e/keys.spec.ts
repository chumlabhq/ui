import type { Page } from "@playwright/test";
import { test, expect } from "./_test";
import { fixturePath, gotoFixture } from "./_nav";
import { settle } from "./_surfaces";

/**
 * The keys the docs and the WAI-ARIA Authoring Practices promise, pressed on the
 * rendered component in each engine, and where focus lands afterwards.
 *
 * Run E's audit pressed 352 rows and found these red in every engine: an outside
 * press leaving focus on `<body>` in 12 surfaces, a multi-select option dropping
 * focus while its list stayed open, Tab out of a portalled search box going
 * backwards, CascadingDropdown's documented type-ahead not existing, Breadcrumb's
 * menu ignoring the first Enter and never following an href, Pagination's arrow
 * disabling itself with focus on it, a tooltip's bubble losing focus three ways,
 * and Avatar's documented `onClick` keys doing nothing. The disabled rows were
 * green and had nothing holding them: nothing pressed an arrow across a disabled
 * item in any roving surface.
 *
 * A row reads the page, never the code under test. What each compares is named in
 * its `want`. WebKit omits links, buttons, checkboxes and radios from Tab by
 * default, as the same walk over plain native controls shows, so no row here
 * reaches a button by Tab; each focuses its start directly and Tabs only to the
 * fixtures' neighbouring inputs.
 */

type Row = { name: string; want: string; got: string; ok: boolean };

/** Rows per component, counted from run E's audit tables (artifacts/p1-tables.md): a walk pressing fewer has lost rows. */
const FLOOR: Record<string, number> = {
  Dropdown: 8,
  MultiSelectDropdown: 7,
  SearchableDropdown: 9,
  MultiSelectSearchableDropdown: 10,
  CascadingDropdown: 11,
  Breadcrumb: 4,
  Pagination: 4,
  DatePicker: 3,
  TimePicker: 4,
  InternationalPhoneInput: 1,
  Table: 2,
  Tooltip: 3,
  Avatar: 3,
  TabPanel: 2,
  RadioButton: 2,
  Accordion: 2,
  Stepper: 2,
};

/** Two frames and a macrotask: WebKit scrolls and hands focus back a frame late. */
const tick = (page: Page) =>
  page.evaluate(
    () => new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(r, 40)))),
  );

const press = async (page: Page, key: string) => {
  await page.keyboard.press(key);
  await tick(page);
};

/** Who holds focus: BODY, or role and name, with the fixture's neighbours marked. */
const focused = (page: Page) =>
  page.evaluate(() => {
    const a = document.activeElement as HTMLElement | null;
    if (!a || a === document.body || a === document.documentElement) return "BODY";
    if (a.hasAttribute("data-after")) return "AFTER";
    if (a.hasAttribute("data-before")) return "BEFORE";
    const role = a.getAttribute("role") ?? a.tagName.toLowerCase();
    return `${role}:${(a.getAttribute("aria-label") || a.textContent || "").trim().slice(0, 28)}`;
  });

/** What is current: the option an activedescendant points at, or the focused item's text. */
const current = (page: Page) =>
  page.evaluate(() => {
    const a = document.activeElement;
    const id = a?.getAttribute("aria-activedescendant");
    if (id) return document.getElementById(id)?.textContent?.trim() ?? "dangling";
    return (a?.textContent ?? "").trim();
  });

const openSurfaces = (page: Page, selector: string) =>
  page.evaluate(
    (s) => [...document.querySelectorAll(s)].filter((e) => (e as HTMLElement).getClientRects().length > 0).length,
    selector,
  );

const go = async (page: Page, component: string, fixture: string, spy?: string) => {
  await page.setViewportSize({ width: 1024, height: 800 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  if (spy) await page.goto(`${fixturePath(component, fixture)}?spy=${spy}`, { waitUntil: "domcontentloaded" });
  else await gotoFixture(page, component, fixture);
  await settle(page, `${component}/${fixture}`);
  await page.addStyleTag({ content: "*{transition:none!important;animation:none!important}" });
  // The pointer left over from the last row: Firefox fires mouseenter on a list
  // that opens under a resting pointer, and that highlights what is beneath it.
  await page.mouse.move(1010, 790);
};

const focusOn = async (page: Page, selector: string) => {
  await page.locator(selector).first().focus();
  await tick(page);
};

/** The page's far corner: nothing focusable there, and outside every surface. */
const pressBlank = async (page: Page) => {
  await page.mouse.click(1010, 790);
  await tick(page);
};

const row = (name: string, want: string, got: string): Row => ({ name, want, got, ok: got === want });

const COMBO = '[data-fixture] [role="combobox"]';
const MENU_TRIGGER = "[data-fixture] button[aria-haspopup]";

/** Disabled at both ends and in the middle; every listbox of the family skips all three. */
async function listboxSkips(page: Page, c: string): Promise<Row[]> {
  const rows: Row[] = [];
  const open = async () => {
    await go(page, c, "keys");
    await focusOn(page, COMBO);
    await press(page, "ArrowDown");
  };
  await open();
  rows.push(row("ArrowDown opens on the first enabled option", "Banana", await current(page)));
  await press(page, "ArrowDown");
  rows.push(row("ArrowDown steps over the disabled middle", "Damson", await current(page)));
  await press(page, "ArrowDown");
  rows.push(row("ArrowDown wraps over the disabled last and first", "Banana", await current(page)));
  return rows;
}

async function outsidePress(page: Page, c: string, fixture: string, trigger: string, surface: string, open = "Enter"): Promise<Row[]> {
  await go(page, c, fixture);
  await focusOn(page, trigger);
  const before = await focused(page);
  await press(page, open);
  await tick(page);
  const opened = await openSurfaces(page, surface);
  await pressBlank(page);
  return [
    row("a press on the page closes the surface", `opened 1, then 0`, `opened ${opened}, then ${await openSurfaces(page, surface)}`),
    row("a press on the page hands focus back to the trigger", before, await focused(page)),
  ];
}

async function tabMovesOn(page: Page, c: string, trigger: string, surface: string): Promise<Row[]> {
  await go(page, c, "keys");
  await focusOn(page, trigger);
  await press(page, "ArrowDown");
  await tick(page);
  await press(page, "Tab");
  return [row("Tab from the open surface goes on to the next field", "AFTER 0", `${await focused(page)} ${await openSurfaces(page, surface)}`)];
}

async function optionKeepsFocus(page: Page, c: string): Promise<Row[]> {
  await go(page, c, "keys");
  await page.locator(COMBO).first().click();
  await tick(page);
  await page.getByRole("option", { name: "Banana" }).click();
  await tick(page);
  const got = await focused(page);
  return [
    { name: "a press on an option keeps focus in the widget while the list stays open", want: "not BODY, list open", got, ok: got !== "BODY" && (await openSurfaces(page, '[role="listbox"]')) === 1 },
  ];
}

async function printableOpens(page: Page, c: string): Promise<Row[]> {
  await go(page, c, "keys");
  await focusOn(page, COMBO);
  await press(page, "d");
  const value = await page.evaluate(() => (document.activeElement as HTMLInputElement).value ?? null);
  return [row("a printable key on the closed trigger opens it and starts the search", "d 1", `${value} ${await openSurfaces(page, '[role="listbox"]')}`)];
}

/** A chip's Remove button is its own control, after the combobox: by key and by pointer. */
async function chipsRemovable(page: Page, c: string): Promise<Row[]> {
  await go(page, c, "multi-value");
  await focusOn(page, COMBO);
  await page.getByRole("button", { name: /^Remove / }).first().focus();
  await tick(page);
  const before = await page.getByRole("button", { name: /^Remove / }).count();
  await press(page, "Enter");
  const afterKey = await page.getByRole("button", { name: /^Remove / }).count();
  await page.getByRole("button", { name: /^Remove / }).first().click();
  await tick(page);
  const afterPointer = await page.getByRole("button", { name: /^Remove / }).count();
  return [
    row("Enter on a chip's Remove button removes it", String(before - 1), String(afterKey)),
    row("a press on a chip's Remove button removes it", String(afterKey - 1), String(afterPointer)),
  ];
}

const highlighted = (page: Page) =>
  page.evaluate(() => document.querySelector('[role^="option"][data-highlighted], [role^="menuitem"][data-highlighted]')?.textContent?.trim() ?? "none");

/**
 * Run E's F-2: a list that opens under a pointer at rest. Engines send mouse
 * events to whatever appears beneath it with no movement at all, so the option
 * there took the highlight from the keyboard. Only movement may.
 */
async function restingPointer(page: Page, c: string, fixture: string, trigger: string): Promise<Row[]> {
  await go(page, c, fixture);
  await focusOn(page, trigger);
  await press(page, "ArrowDown");
  const fromKeyboard = await highlighted(page);
  const items = page.locator('[role^="option"]:not([aria-disabled="true"]), [role^="menuitem"]:not([aria-disabled="true"])');
  const other = items.filter({ hasNotText: fromKeyboard }).first();
  const item = (await other.textContent())?.trim() ?? "";
  const box = (await other.boundingBox())!;
  await press(page, "Escape");
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  await page.mouse.move(x, y);
  await tick(page);
  await focusOn(page, trigger);
  await press(page, "ArrowDown");
  const atRest = await highlighted(page);
  await page.mouse.move(x + 4, y);
  await tick(page);
  return [
    row("a list opening under a resting pointer keeps the keyboard's highlight", fromKeyboard, atRest),
    row("a real movement of the pointer takes the highlight", item, await highlighted(page)),
  ];
}

const SUITES: Record<string, (page: Page) => Promise<Row[]>> = {
  Dropdown: async (page) => [
    ...(await restingPointer(page, "Dropdown", "keys", COMBO)),
    ...(await outsidePress(page, "Dropdown", "keys", COMBO, '[role="listbox"]')),
    ...(await listboxSkips(page, "Dropdown")),
    await (async () => {
      await go(page, "Dropdown", "keys");
      await focusOn(page, COMBO);
      await press(page, "ArrowDown");
      await press(page, "c");
      return { name: "type-ahead does not land on a disabled option", want: "not Cherry", got: await current(page), ok: !/Cherry/.test(await current(page)) };
    })(),
  ],
  MultiSelectDropdown: async (page) => [
    ...(await restingPointer(page, "MultiSelectDropdown", "keys", COMBO)),
    ...(await chipsRemovable(page, "MultiSelectDropdown")),
    ...(await outsidePress(page, "MultiSelectDropdown", "keys", COMBO, '[role="listbox"]')).slice(1),
    ...(await optionKeepsFocus(page, "MultiSelectDropdown")),
    ...(await listboxSkips(page, "MultiSelectDropdown")).slice(1, 2),
  ],
  SearchableDropdown: async (page) => {
    const rows = [
      ...(await restingPointer(page, "SearchableDropdown", "keys", COMBO)),
      ...(await outsidePress(page, "SearchableDropdown", "keys", COMBO, '[role="listbox"]')).slice(1),
      ...(await tabMovesOn(page, "SearchableDropdown", COMBO, '[role="listbox"]')),
      ...(await printableOpens(page, "SearchableDropdown")),
      ...(await listboxSkips(page, "SearchableDropdown")).slice(1, 2),
    ];
    for (const key of ["Backspace", "Delete"]) {
      await go(page, "SearchableDropdown", "keys-clearable");
      await focusOn(page, COMBO);
      await press(page, "Enter");
      await tick(page);
      await press(page, key);
      await press(page, "Escape");
      rows.push({
        name: `${key} in the empty search box clears the selection`,
        want: "no Banana on the trigger",
        got: (await page.locator(COMBO).first().textContent()) ?? "",
        ok: !/Banana/.test((await page.locator(COMBO).first().textContent()) ?? ""),
      });
    }
    await go(page, "SearchableDropdown", "keys");
    await focusOn(page, COMBO);
    await press(page, "Enter");
    await tick(page);
    await press(page, "Space");
    rows.push(row("Space in the search box types a space", `" "`, JSON.stringify(await page.evaluate(() => (document.activeElement as HTMLInputElement).value))));
    return rows;
  },
  MultiSelectSearchableDropdown: async (page) => [
    ...(await restingPointer(page, "MultiSelectSearchableDropdown", "keys", COMBO)),
    ...(await chipsRemovable(page, "MultiSelectSearchableDropdown")),
    ...(await outsidePress(page, "MultiSelectSearchableDropdown", "keys", COMBO, '[role="listbox"]')).slice(1),
    ...(await tabMovesOn(page, "MultiSelectSearchableDropdown", COMBO, '[role="listbox"]')),
    ...(await printableOpens(page, "MultiSelectSearchableDropdown")),
    ...(await optionKeepsFocus(page, "MultiSelectSearchableDropdown")),
    ...(await listboxSkips(page, "MultiSelectSearchableDropdown")).slice(1, 2),
    await (async () => {
      await go(page, "MultiSelectSearchableDropdown", "keys");
      await page.locator(COMBO).first().click();
      await tick(page);
      await page.locator(COMBO).first().click({ force: true });
      await tick(page);
      const got = await focused(page);
      return { name: "a second press on the trigger closes it with focus on the trigger", want: "combobox", got, ok: got.startsWith("combobox") };
    })(),
  ],
  CascadingDropdown: async (page) => {
    const c = "CascadingDropdown";
    const menus = () => openSurfaces(page, '[role="menu"]');
    const onFruit = async () => {
      await go(page, c, "keys");
      await focusOn(page, MENU_TRIGGER);
      await press(page, "Enter");
    };
    const rows: Row[] = [...(await restingPointer(page, c, "keys", MENU_TRIGGER)), ...(await outsidePress(page, c, "keys", MENU_TRIGGER, '[role="menu"]')).slice(1), ...(await tabMovesOn(page, c, MENU_TRIGGER, '[role="menu"]'))];
    await onFruit();
    rows.push(row("Enter on the trigger lands on the first item", "Fruit", await current(page)));
    await press(page, "ArrowDown");
    rows.push(row("ArrowDown steps over the disabled Veg", "Leaf", await current(page)));
    await onFruit();
    await press(page, "n");
    rows.push(row("type-ahead jumps at the top level", "Nuts", await current(page)));
    await onFruit();
    await press(page, "v");
    rows.push(row("type-ahead does not land on the disabled Veg", "Fruit", await current(page)));
    await onFruit();
    await press(page, "ArrowRight");
    rows.push(row("ArrowRight from a parent opens its submenu on the first enabled item", "2 Banana", `${await menus()} ${await current(page)}`));
    await press(page, "d");
    rows.push(row("type-ahead jumps inside the submenu", "Damson", await current(page)));
    await press(page, "ArrowLeft");
    rows.push(row("ArrowLeft closes the submenu and returns to its parent", "1 Fruit", `${await menus()} ${await current(page)}`));
    await onFruit();
    await press(page, "ArrowRight");
    await pressBlank(page);
    rows.push(row("a press outside from a submenu closes everything, focus on the trigger", "0 button", `${await menus()} ${(await focused(page)).split(":")[0]}`));
    return rows;
  },
  Breadcrumb: async (page) => {
    const c = "Breadcrumb";
    const ellipsis = "[data-fixture] button[aria-haspopup]";
    const rows = (await outsidePress(page, c, "keys", ellipsis, '[role="menu"]')).slice(1);
    for (const key of ["Enter", "Space"]) {
      await go(page, c, "keys");
      await focusOn(page, ellipsis);
      const before = await focused(page);
      await press(page, "Enter");
      await press(page, key);
      rows.push(row(`${key} as the first key follows the focused item and hands focus to the ellipsis`, `two ${before}`, `${new URL(page.url()).hash.slice(1)} ${await focused(page)}`));
    }
    await go(page, c, "keys");
    await focusOn(page, ellipsis);
    await press(page, "Enter");
    await press(page, "ArrowDown");
    rows.push(row("ArrowDown steps over the disabled item", "Four", await current(page)));
    return rows;
  },
  Pagination: async (page) => {
    const resting = await restingPointer(page, "Pagination", "rows-per-page", '[data-fixture] [aria-haspopup="listbox"]');
    const rows = (await outsidePress(page, "Pagination", "rows-per-page", '[data-fixture] [aria-haspopup="listbox"]', '[role="listbox"]')).slice(1);
    await go(page, "Pagination", "default");
    const next = page.getByRole("button", { name: /next/i });
    await next.focus();
    for (let i = 0; i < 12 && !(await next.isDisabled()); i += 1) await press(page, "Enter");
    const got = await page.evaluate(() => document.activeElement?.getAttribute("aria-current") ?? document.activeElement?.tagName ?? "none");
    rows.push(...resting);
    rows.push(row("Next disabling itself hands focus to the current page", "page", got));
    return rows;
  },
  DatePicker: async (page) => [
    ...(await outsidePress(page, "DatePicker", "closed", '[data-fixture] button[aria-haspopup]', '[role="grid"]')).slice(1),
    await (async () => {
      await go(page, "DatePicker", "open");
      await focusOn(page, '[role="gridcell"][tabindex="0"]');
      for (let day = 0; day < 16; day++) await press(page, "ArrowRight");
      return row("an arrow paging a defaultOpen calendar keeps focus on a day", "gridcell", (await focused(page)).split(":")[0]);
    })(),
    await (async () => {
      await go(page, "DatePicker", "open-with-value");
      await page.getByRole("button", { name: "Next month" }).click();
      await tick(page);
      await press(page, "Escape");
      return row("Escape closes the calendar after a press on Next month", "0", String(await openSurfaces(page, '[role="grid"]')));
    })(),
  ],
  TimePicker: async (page) => {
    const input = "[data-fixture] input";
    const resting = await restingPointer(page, "TimePicker", "closed", input);
    const rows = (await outsidePress(page, "TimePicker", "closed", input, '[role="listbox"]', "ArrowDown")).slice(1);
    await go(page, "TimePicker", "closed");
    await focusOn(page, input);
    await press(page, "ArrowUp");
    const last = (await page.getByRole("option").last().textContent())?.trim() ?? "";
    rows.push(row("ArrowUp opens the closed list on its last time", last, await current(page)));
    rows.push(...resting);
    return rows;
  },
  InternationalPhoneInput: async (page) => (await outsidePress(page, "InternationalPhoneInput", "default", "[data-fixture] [aria-haspopup]", '[role="listbox"]')).slice(1),
  Table: async (page) => {
    const filter = '[data-fixture] thead [aria-haspopup], [data-fixture] thead [aria-label*="ilter" i]';
    const rows = (await outsidePress(page, "Table", "filterable", filter, "[data-table-filter-content]")).slice(1);
    await go(page, "Table", "filterable");
    await focusOn(page, filter);
    await press(page, "Enter");
    await tick(page);
    let body = 0;
    for (let i = 0; i < 12 && (await openSurfaces(page, "[data-table-filter-content]")) > 0; i += 1) {
      await press(page, "Tab");
      if ((await focused(page)) === "BODY") body += 1;
    }
    rows.push(row("Tab through the filter dialog closes it past the end, never on body", "0 0", `${body} ${await openSurfaces(page, "[data-table-filter-content]")}`));
    return rows;
  },
  Tooltip: async (page) => {
    const c = "Tooltip";
    const trigger = "[data-fixture] button";
    const tip = () => openSurfaces(page, '[role="tooltip"]');
    const inside = async () => {
      await go(page, c, "focusable-bubble");
      await page.locator(trigger).hover();
      await page.locator('[role="tooltip"] a').hover();
      await page.locator('[role="tooltip"] a').focus();
      await tick(page);
    };
    await inside();
    await press(page, "Escape");
    const rows = [row("Escape from inside the bubble closes it, focus on the trigger", "0 button:Trigger", `${await tip()} ${await focused(page)}`)];
    await inside();
    await press(page, "Tab");
    await tick(page);
    rows.push(row("Tab past the bubble's end goes on from the trigger", "AFTER", await focused(page)));
    await inside();
    await page.mouse.move(1010, 790);
    await page.evaluate(() => new Promise((r) => setTimeout(r, 200)));
    await tick(page);
    rows.push(row("the pointer leaving keeps the bubble while focus is in it", "1 link:Inside", `${await tip()} ${(await focused(page)).replace(/^a:/, "link:")}`));
    return rows;
  },
  Avatar: async (page) => {
    const rows: Row[] = [];
    await go(page, "Avatar", "keys");
    await focusOn(page, "[data-before]");
    await press(page, "Tab");
    rows.push(row("Tab reaches an avatar with onClick", "button:Ada Lovelace", await focused(page)));
    for (const key of ["Enter", "Space"]) {
      await go(page, "Avatar", "keys", "onClick");
      await focusOn(page, "[data-before]");
      await press(page, "Tab");
      await press(page, key);
      rows.push(row(`${key} fires its onClick`, "onClick", (await page.evaluate(() => (window as unknown as { __fixtureCalls?: string[] }).__fixtureCalls ?? [])).join()));
    }
    return rows;
  },
  TabPanel: async (page) => {
    const rows: Row[] = [];
    await go(page, "TabPanel", "keys");
    await page.getByRole("tab", { name: "First" }).focus();
    await press(page, "ArrowRight");
    rows.push(row("ArrowRight steps over the disabled tab", "tab:Third", await focused(page)));
    await press(page, "ArrowLeft");
    rows.push(row("ArrowLeft steps back over it", "tab:First", await focused(page)));
    return rows;
  },
  RadioButton: async (page) => {
    const value = () => page.evaluate(() => { const a = document.activeElement as HTMLInputElement; return `${a.value} ${a.checked}`; });
    const rows: Row[] = [];
    await go(page, "RadioButton", "keys");
    await page.getByRole("radio", { name: "Banana" }).focus();
    await press(page, "ArrowDown");
    rows.push(row("ArrowDown steps over the disabled radio and checks the next", "d true", await value()));
    await press(page, "ArrowUp");
    rows.push(row("ArrowUp steps back over it", "b true", await value()));
    return rows;
  },
  Stepper: async (page) => {
    await go(page, "Stepper", "keys");
    await page.getByRole("button", { name: "One" }).focus();
    await tick(page);
    await press(page, "ArrowRight");
    const skipped = row("ArrowRight steps over the disabled step", "button:Three", (await focused(page)).replace(/^button:.*Three.*$/, "button:Three"));
    await press(page, "ArrowLeft");
    return [skipped, row("ArrowLeft steps back over it", "button:One", (await focused(page)).replace(/^button:.*One.*$/, "button:One"))];
  },
  Accordion: async (page) => {
    const rows: Row[] = [];
    await go(page, "Accordion", "keys");
    await page.getByRole("button", { name: "One" }).focus();
    await press(page, "ArrowDown");
    rows.push(row("ArrowDown steps over the disabled item", "button:Three", (await focused(page)).replace(/Three.*/, "Three")));
    await press(page, "ArrowUp");
    rows.push(row("ArrowUp steps back over it", "button:One", (await focused(page)).replace(/One.*/, "One")));
    return rows;
  },
};

test.describe("documented keys", () => {
  test("the floor names every component this spec presses", () => {
    expect(Object.keys(FLOOR).sort()).toEqual(Object.keys(SUITES).sort());
  });

  for (const [component, run] of Object.entries(SUITES)) {
    test(`${component}: every row does what it says`, async ({ page }) => {
      test.slow();
      const rows = await run(page);
      const failed = rows.filter((r) => !r.ok);
      console.log(`KEYS ${component} rows ${rows.length}, floor ${FLOOR[component]}, failed ${failed.length}`);
      expect(rows.length, `${component} pressed fewer rows than the audit found`).toBeGreaterThanOrEqual(FLOOR[component]);
      expect(failed.map((r) => `${r.name}: want ${r.want}, got ${r.got}`)).toEqual([]);
    });
  }
});
