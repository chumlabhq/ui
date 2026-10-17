import { test, expect, type Page } from "./_test";

/**
 * A fixed-size control keeps its size beside a long label.
 *
 * Every component that draws a fixed-size visual in a row beside text the
 * reader writes, on `/__fixtures/control-size/<Component>`: rendered with every
 * label at "Accept" and again at 200 characters, in a 384 px column at 1280 and
 * at a 360 px viewport. Each fixed-size visual — an `<svg>`, or an element
 * whose own class or inline style sets its width or height — must measure the
 * same beside the long label as beside the short one. The short render is the
 * intended size; the visual is matched by its path in the DOM.
 *
 * A wrapper whose width follows its column is not a fixed-size visual and is
 * not read: Table's select-all cell narrows beside long headers while the
 * checkbox in it stays 24 x 24.
 *
 * L25 step 0 measured, at e88eab8f, in all three engines: Checkbox's box 20 ->
 * 18 px and Switch's track 36 -> 16 px, in both layouts, because neither
 * `control` class had `shrink-0` (RadioButton's had). Every other visual held.
 */

const COMPONENTS = [
  "Checkbox", "Switch", "RadioButton", "Accordion", "Button", "Stepper", "TabPanel", "Toast", "Dropdown",
  "SearchableDropdown", "MultiSelectDropdown", "MultiSelectSearchableDropdown", "CascadingDropdown", "DatePicker",
  "TimePicker", "InternationalPhoneInput", "Modal", "Drawer", "Breadcrumb", "Table",
];

/** The components step 0 measured. */
const FLOOR = 20;

const LAYOUTS = [
  { name: "384 px column", viewport: 1280, width: "384" },
  { name: "360 px viewport", viewport: 360, width: "full" },
];

type Box = { w: number; h: number; what: string };

const visuals = (page: Page) =>
  page.evaluate(() => {
    const FIXED = /(^|\s)([a-z]+:)?(w|h|size)-(\d|\[)/;
    const out: Record<string, Box> = {};
    for (const el of document.body.querySelectorAll<HTMLElement | SVGElement>("*")) {
      const svg = el.tagName.toLowerCase() === "svg";
      if (!svg && el.closest("svg")) continue;
      const fixed = svg || FIXED.test(el.getAttribute("class") ?? "") || !!(el as HTMLElement).style?.width || !!(el as HTMLElement).style?.height;
      if (!fixed || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) continue;
      if ((el.textContent ?? "").trim().length > 3) continue;
      const r = el.getBoundingClientRect();
      if (r.width < 1 || r.height < 1 || r.width > 64 || r.height > 64) continue;
      const path: number[] = [];
      for (let n: Element | null = el; n && n !== document.body; n = n.parentElement) path.unshift([...n.parentElement!.children].indexOf(n));
      out[path.join(".")] = { w: +r.width.toFixed(1), h: +r.height.toFixed(1), what: `${el.tagName.toLowerCase()} "${(el.getAttribute("class") ?? "").slice(0, 60)}"` };
    }
    return out;
  });

async function render(page: Page, component: string, text: "short" | "long", width: string) {
  await page.goto(`/__fixtures/control-size/${component}?text=${text}&width=${width}`, { waitUntil: "domcontentloaded" });
  await expect(page.locator(`[data-control-size="${component}"]`), `${component}: the control-size page did not render`).toBeAttached();
  await page.addStyleTag({ content: "*,*::before,*::after{transition:none!important;animation:none!important}" });
  await page.evaluate(() => new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(r, 150)))));
  return visuals(page);
}

test("a fixed-size control keeps its size beside a long label", async ({ page }) => {
  test.setTimeout(300_000);
  const shrunk: string[] = [];
  let controls = 0;
  let measured = 0;

  for (const component of COMPONENTS) {
    controls += 1;
    for (const layout of LAYOUTS) {
      await page.setViewportSize({ width: layout.viewport, height: 900 });
      const short = await render(page, component, "short", layout.width);
      const long = await render(page, component, "long", layout.width);
      const keys = Object.keys(short).filter((k) => long[k]);
      measured += keys.length;
      const changed = keys.filter((k) => Math.abs(long[k].w - short[k].w) > 0.5 || Math.abs(long[k].h - short[k].h) > 0.5);
      for (const k of changed) {
        shrunk.push(`${component} @ ${layout.name}: ${short[k].what} ${short[k].w} x ${short[k].h} -> ${long[k].w} x ${long[k].h}`);
      }
      console.log(`CONTROL_SIZE_COMPONENT ${component} @ ${layout.name}: visuals ${keys.length}, changed ${changed.length}`);
    }
  }

  for (const line of shrunk) console.log(`CONTROL_SIZE_SHRUNK ${line}`);
  console.log(`CONTROL_SIZE controls ${controls} (floor ${FLOOR}), visuals ${measured}, shrunk ${shrunk.length}`);
  expect(controls).toBeGreaterThanOrEqual(FLOOR);
  expect(shrunk, "a fixed-size visual gave up size to the label beside it").toEqual([]);
});
