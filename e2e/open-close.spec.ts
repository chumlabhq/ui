import { test, expect, type Page } from "./_test";

/**
 * Opening and closing a popup never move the page by themselves.
 *
 * Every popup in the library, 3,000 px below the fold on
 * `/__fixtures/open-close/<Component>`:
 *
 *   - mounted with `defaultOpen`, the page does not scroll and focus stays on
 *     <body>, as it does for a native <select> or a <dialog open>. Modal and a
 *     modal Drawer are dialogs and take focus, as the APG dialog pattern says
 *     they must, but they still do not scroll the page behind them;
 *   - closed by pointer outside, Escape and selection with its trigger off
 *     screen, the page does not scroll. Every focus return uses `preventScroll`;
 *     no close path in the library reveals the trigger.
 *
 * Two ways to have the trigger off screen while the popup is open: mounted open
 * with the page at the top, and opened by a click, then 3,000 px inserted above
 * the component (`__pushSubjectDown`), because most popups close on scroll.
 *
 * "page moved" counts both: a scroll, and a focus taken on mount. L24 step 0
 * measured, at c03c0f93 in Chromium: DatePicker's mount scrolled 2,791 px,
 * CascadingDropdown's close 2,789 px (13,210 px on its docs page), Modal's and
 * Table's 2,756 and 2,767; SearchableDropdown, MultiSelectSearchableDropdown,
 * TimePicker, DatePicker and CascadingDropdown's menu search took focus on
 * mount. Run against c03c0f93 this read page moved 26 in Chromium, 26 in
 * Firefox and 19 in WebKit.
 */

/** Set by `OpenCloseRoute`. */
declare global {
  interface Window {
    __mountSubject?: (open: boolean) => void;
    __pushSubjectDown?: () => void;
  }
}

type Path = "pointer-outside" | "Escape" | "selection";

interface Subject {
  name: string;
  defaultOpen: boolean;
  /** A dialog: takes focus when it mounts open. */
  modal?: boolean;
  /** The element that opens it, inside `[data-subject]`. */
  trigger: string;
  /** The open popup, anywhere in the document (most are portalled). */
  surface: string;
  /** What a selection is, in the surface; null when the popup has none. */
  select: string | null;
  /** Paths that leave it open by design: a multi-select stays open on a selection; a tooltip ignores a click elsewhere. */
  stays?: Path[];
  /** Opened by the reader and then pushed off screen. Not a tooltip: it hides once its trigger leaves the pointer, and returns no focus. */
  pushed?: false;
  /**
   * Paths after which WebKit itself scrolls to the focused text field. WebKit
   * reveals a focused <input> whenever its width changes, measured on bare
   * markup (L24 step 0; Chromium and Firefox do not), and TimePicker's input
   * narrows when a chosen time brings its clear button in. The library makes
   * no call; the field the reader is typing in is brought into view.
   */
  webkitRevealsField?: Path[];
}

const LIST = { surface: "[role=listbox]", select: '[role=option]:not([aria-disabled="true"])' };

const SUBJECTS: Subject[] = [
  { name: "Dropdown", defaultOpen: true, trigger: "[role=combobox]", ...LIST },
  { name: "SearchableDropdown", defaultOpen: true, trigger: "[role=combobox]", ...LIST },
  { name: "MultiSelectDropdown", defaultOpen: true, trigger: "[role=combobox]", ...LIST, stays: ["selection"] },
  { name: "MultiSelectSearchableDropdown", defaultOpen: true, trigger: "[role=combobox]", ...LIST, stays: ["selection"] },
  { name: "CascadingDropdown", defaultOpen: true, trigger: "button[aria-haspopup]", surface: "[role=menu]", select: "cascade" },
  { name: "DatePicker", defaultOpen: true, trigger: "[role=combobox]", surface: "[role=grid]", select: '[role=gridcell]:not([disabled])' },
  { name: "TimePicker", defaultOpen: true, trigger: "input[role=combobox]", ...LIST, webkitRevealsField: ["selection"] },
  { name: "Tooltip", defaultOpen: true, trigger: "button", surface: "[role=tooltip]", select: null, stays: ["pointer-outside"], pushed: false },
  { name: "Modal", defaultOpen: true, modal: true, trigger: "button[aria-haspopup=dialog]", surface: "[role=dialog]", select: '[role=dialog] button[aria-label^="Close"]' },
  { name: "Drawer", defaultOpen: true, modal: true, trigger: "button[aria-haspopup=dialog]", surface: "[role=dialog]", select: '[role=dialog] button[aria-label^="Close"]' },
  { name: "InternationalPhoneInput", defaultOpen: false, trigger: '[aria-label="Select country"]', ...LIST },
  { name: "Pagination", defaultOpen: false, trigger: "[aria-haspopup=listbox]", ...LIST },
  { name: "Breadcrumb", defaultOpen: false, trigger: "[aria-haspopup=menu]", surface: "[role=menu]", select: "[role=menuitem]" },
  { name: "Table", defaultOpen: false, trigger: 'button[aria-label="Filter role"]', surface: "[data-table-filter-content]", select: null },
];

/** Every popup component in the library, as step 0 enumerated them: 10 with defaultOpen, 4 without. */
const FLOOR = 14;

/** Two frames and a beat: DatePicker and Modal focus from a 10 ms timer, Drawer from a frame, WebKit scrolls a frame late. */
const settle = (page: Page) =>
  page.evaluate(() => new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(r, 150)))));

const where = (page: Page) =>
  page.evaluate(() => {
    const a = document.activeElement;
    const name = !a || a === document.body ? "body" : `${a.tagName.toLowerCase()}${a.getAttribute("role") ? `[role=${a.getAttribute("role")}]` : ""}${a.getAttribute("aria-label") ? `[aria-label="${a.getAttribute("aria-label")}"]` : ""}`;
    return { y: Math.round(scrollY), focus: name, inDialog: !!a?.closest("[role=dialog]") };
  });

const isOpen = (page: Page, s: Subject) =>
  page.evaluate(({ trigger, surface }) => {
    const t = document.querySelector(`[data-subject] ${trigger}`);
    const expanded = t?.getAttribute("aria-expanded");
    if (expanded === "true" || expanded === "false") return expanded === "true";
    return !!document.querySelector(surface);
  }, s);

const triggerOffScreen = (page: Page, s: Subject) =>
  page.evaluate((trigger) => {
    const r = document.querySelector(`[data-subject] ${trigger}`)?.getBoundingClientRect();
    return !r || r.bottom < 0 || r.top > innerHeight;
  }, s.trigger);

/** Straight to the marker: `gotoGuarded` waits 1.5 s on every load for a redirect this route never makes. */
async function visit(page: Page, s: Subject) {
  await page.goto(`/__fixtures/open-close/${s.name}`, { waitUntil: "domcontentloaded" });
  await expect(page.locator(`[data-open-close="${s.name}"]`), `${s.name}: the open-close page did not render`).toBeAttached();
}

async function load(page: Page, s: Subject, open: boolean) {
  await visit(page, s);
  await page.evaluate((open) => window.__mountSubject!(open), open);
  await settle(page);
}

/** Selection by the popup's own control, dispatched where it is: beside an off-screen trigger it is off screen too. */
const select = (page: Page, s: Subject) =>
  page.evaluate(async ({ surface, select }) => {
    const fire = (el: Element) => {
      const r = el.getBoundingClientRect();
      const o = { bubbles: true, cancelable: true, composed: true, clientX: r.left + r.width / 2, clientY: r.top + r.height / 2, button: 0, pointerType: "mouse", isPrimary: true };
      el.dispatchEvent(new PointerEvent("pointerdown", o));
      el.dispatchEvent(new MouseEvent("mousedown", o));
      el.dispatchEvent(new PointerEvent("pointerup", o));
      el.dispatchEvent(new MouseEvent("mouseup", o));
      el.dispatchEvent(new MouseEvent("click", o));
    };
    if (select === "cascade") {
      const parent = [...document.querySelectorAll(`${surface} [role^=menuitem]`)].find((m) => m.textContent?.includes("Fruit"));
      if (!parent) return "no parent item";
      fire(parent);
      await new Promise((r) => setTimeout(r, 300));
      const child = [...document.querySelectorAll("[data-cascading-submenu] [role^=menuitem]")].find((m) => m.textContent?.trim() === "Apple");
      if (!child) return "no child item";
      fire(child);
      return "Apple";
    }
    const el = document.querySelector(select!.startsWith("[role=dialog]") ? select! : `${surface} ${select}`);
    if (!el) return `nothing matches ${select}`;
    fire(el);
    return el.textContent?.trim().slice(0, 20) || el.getAttribute("aria-label") || "?";
  }, s);

/**
 * Escape goes to the focused element. A popup mounted open holds no focus, so
 * where Escape on <body> does nothing the reader is taken to have clicked into
 * it first: its search field or a button in it, or else its combobox, which
 * keeps DOM focus while its list is open.
 */
async function escape(page: Page, s: Subject) {
  await page.keyboard.press("Escape");
  await settle(page);
  if (!(await isOpen(page, s))) return "Escape";
  await page.evaluate(({ surface, trigger }) => {
    const root = document.querySelector(surface)?.closest("[data-cascading-submenu], [role=group], [role=dialog]") ?? document.querySelector(surface);
    const target = root?.querySelector<HTMLElement>("input, button") ?? document.querySelector<HTMLElement>(`[data-subject] ${trigger}`);
    target?.focus({ preventScroll: true });
  }, s);
  await page.keyboard.press("Escape");
  return "Escape from inside the popup";
}

/** A point in the viewport clear of the open popup: the corners first, since a Drawer fills one side and a Modal the middle. */
const outside = (page: Page, s: Subject) =>
  page.evaluate((surface) => {
    const boxes = [...document.querySelectorAll(`${surface}, [role=dialog]`)].map((e) => e.getBoundingClientRect());
    const points = [{ x: 40, y: 60 }, { x: innerWidth - 40, y: 60 }, { x: 40, y: innerHeight - 40 }, { x: innerWidth - 40, y: innerHeight - 40 }];
    return points.find((p) => !boxes.some((r) => p.x >= r.left && p.x <= r.right && p.y >= r.top && p.y <= r.bottom)) ?? points[0];
  }, s.surface);

test("opening and closing a popup never moves the page", async ({ page, browserName }) => {
  test.setTimeout(600_000);
  await page.setViewportSize({ width: 1280, height: 800 });
  const problems: string[] = [];
  let components = 0;
  let moved = 0;
  let revealed = 0;

  for (const s of SUBJECTS) {
    components += 1;
    const started = Date.now();
    const lines: string[] = [];

    if (s.defaultOpen) {
      await visit(page, s);
      const before = await where(page);
      await page.evaluate(() => window.__mountSubject!(true));
      await settle(page);
      const after = await where(page);
      const open = await isOpen(page, s);
      lines.push(`mount scrollY ${before.y}->${after.y} focus ${after.focus}`);
      if (!open) problems.push(`${s.name}: defaultOpen did not mount it open`);
      if (after.y !== before.y) {
        moved += 1;
        problems.push(`${s.name}: defaultOpen scrolled the page ${before.y} -> ${after.y}`);
      }
      if (s.modal ? !after.inDialog : after.focus !== "body") {
        moved += 1;
        problems.push(`${s.name}: defaultOpen ${s.modal ? "left focus outside the dialog" : `moved focus to ${after.focus}`}`);
      }
    }

    const starts = [...(s.defaultOpen ? (["mounted open"] as const) : []), ...(s.pushed === false ? [] : (["opened by click"] as const))];
    for (const start of starts) {
      for (const path of ["pointer-outside", "Escape", "selection"] as Path[]) {
        if (path === "selection" && s.select === null) continue;
        if (start === "mounted open") {
          await load(page, s, true);
          await page.evaluate(() => window.scrollTo(0, 0));
          await settle(page);
        } else {
          await load(page, s, false);
          const trigger = page.locator(`[data-subject] ${s.trigger}`).first();
          await trigger.scrollIntoViewIfNeeded();
          await trigger.click();
          await settle(page);
          await page.evaluate(() => window.__pushSubjectDown!());
          await settle(page);
        }
        const label = `${start}, ${path}`;
        if (!(await isOpen(page, s))) {
          problems.push(`${s.name} (${label}): not open before closing`);
          continue;
        }
        if (!(await triggerOffScreen(page, s))) {
          problems.push(`${s.name} (${label}): the trigger is on screen, so this proves nothing`);
          continue;
        }
        const before = await where(page);
        let did: string = path;
        if (path === "pointer-outside") {
          const at = await outside(page, s);
          await page.mouse.click(at.x, at.y);
        }
        else if (path === "Escape") did = await escape(page, s);
        else did = `selection of ${await select(page, s)}`;
        const stays = s.stays?.includes(path) ?? false;
        // A closing overlay stays in the DOM through its exit transition.
        if (!stays) await expect.poll(() => isOpen(page, s), { timeout: 3000 }).toBe(false).catch(() => {});
        await settle(page);
        const after = await where(page);
        const open = await isOpen(page, s);
        lines.push(`${label}: scrollY ${before.y}->${after.y} ${open ? "open" : "closed"} focus ${after.focus}`);
        if (!stays && open) problems.push(`${s.name} (${label}): ${did} did not close it`);
        const reveal = browserName === "webkit" && start === "opened by click" && (s.webkitRevealsField?.includes(path) ?? false);
        if (after.y !== before.y && reveal && !(await triggerOffScreen(page, s))) {
          revealed += 1;
          lines.push(`${label}: WebKit revealed the focused field`);
        } else if (after.y !== before.y) {
          moved += 1;
          problems.push(`${s.name} (${label}): ${did} scrolled the page ${before.y} -> ${after.y}, focus now ${after.focus}`);
        }
      }
    }
    console.log(`OPEN_CLOSE_COMPONENT ${s.name} (${((Date.now() - started) / 1000).toFixed(1)} s) | ${lines.join(" | ")}`);
  }

  if (revealed) console.log(`OPEN_CLOSE_WEBKIT_FIELD_REVEALS ${revealed} (WebKit scrolls to a focused input whose width changes; no library call)`);
  console.log(`OPEN_CLOSE components ${components} (floor ${FLOOR}), page moved ${moved}`);
  expect(components).toBeGreaterThanOrEqual(FLOOR);
  expect(problems).toEqual([]);
});
