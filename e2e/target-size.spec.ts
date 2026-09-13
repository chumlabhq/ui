import { expect, test } from "@playwright/test";
import { gotoFixture } from "./_nav";

/**
 * The target a pointer can actually hit, not the one the rect declares.
 *
 * axe's `target-size` reads `getBoundingClientRect`, so a control measures
 * 24x24 whatever an ancestor then does to it. MultiSelectDropdown's chip row
 * was `overflow: hidden` at 20px tall while its remove control was 24px via a
 * negative margin: the rect said 24, axe passed, and the top and bottom 2px
 * were clipped out of the HIT AREA — hit-testing `top + 1` landed on the
 * trigger behind. The whole target-size slice passed its own gate and did not
 * land in that component.
 *
 * So this asks the only question that matters for a pointer user: from the
 * element's own centre line, how far out can you go and still hit it.
 */
const FLOOR = 24;

const CONTROLS: Array<{
  component: string;
  fixture: string;
  selector: string;
  label: string;
  /**
   * Close the panel first. `multi-value` sets `defaultOpen`, and an open
   * dropdown panel is `position: fixed, z-50` over its own trigger — measuring
   * the clear button under it reported 0x0 for a control that is a full 24x24
   * the moment the panel closes. A panel covering its trigger is what a panel
   * is; the control has to be measured in the state it is meant to be used in.
   */
  dismiss?: boolean;
}> = [
  { component: "MultiSelectDropdown", fixture: "multi-value", selector: '[aria-label^="Remove"]', label: "MSD chip remove" },
  { component: "MultiSelectSearchableDropdown", fixture: "multi-value", selector: '[aria-label^="Remove"]', label: "MSSD chip remove" },
  { component: "MultiSelectDropdown", fixture: "multi-value", selector: '[aria-label="Clear all selections"]', label: "MSD clear-all", dismiss: true },
  { component: "MultiSelectSearchableDropdown", fixture: "multi-value", selector: '[aria-label="Clear all selections"]', label: "MSSD clear-all", dismiss: true },
  { component: "Table", fixture: "selectable", selector: 'input[type="checkbox"][aria-label^="Select row"]', label: "Table row select" },
  { component: "Table", fixture: "expandable", selector: '[aria-label$=" row"]', label: "Table row expand" },
  { component: "Table", fixture: "draggable", selector: "[data-drag-handle]", label: "Table drag handle" },
  { component: "Table", fixture: "grouped", selector: 'td[data-grouped="true"] button', label: "Table group toggle" },
  { component: "Table", fixture: "search-with-value", selector: "button.absolute", label: "Table search clear" },
  // All three Button sizes. `size` paints dimensions as of v1, so the scale
  // itself is now a conformance surface: sm is the smallest control the
  // library produces by default, at 28px tall against a 24px floor.
  { component: "Button", fixture: "size-sm", selector: "button", label: "Button size=sm" },
  { component: "Button", fixture: "size-md", selector: "button", label: "Button size=md" },
  { component: "Button", fixture: "size-lg", selector: "button", label: "Button size=lg" },
  // Input and TextArea took the same scale in the same slice, and `sm` is the
  // shortest control the library now produces: 30px including its border.
  { component: "Input", fixture: "size-sm", selector: "input", label: "Input size=sm" },
  { component: "Input", fixture: "size-md", selector: "input", label: "Input size=md" },
  { component: "Input", fixture: "size-lg", selector: "input", label: "Input size=lg" },
  { component: "TextArea", fixture: "size-sm", selector: "textarea", label: "TextArea size=sm" },
  { component: "TextArea", fixture: "size-md", selector: "textarea", label: "TextArea size=md" },
  { component: "TextArea", fixture: "size-lg", selector: "textarea", label: "TextArea size=lg" },
];

/**
 * The plant, in the suite rather than in a docblock.
 *
 * The measurement is an `elementFromPoint` probe: if the probe ever stopped
 * finding the element — a portal change, a selector drift — every control
 * would report as hittable and the gate would print a clean number over
 * nothing. One page, ~2s.
 */
test("the probe notices a target smaller than the floor", async ({ page }) => {
  await page.goto("/__fixtures/Button/default", { waitUntil: "domcontentloaded" });
  await page.locator("[data-fixture]").waitFor({ state: "attached", timeout: 15000 });

  const hit = () =>
    page.evaluate(() => {
      const el = document.querySelector<HTMLElement>("[data-fixture] button");
      if (!el) return null;
      const a = el.getBoundingClientRect();
      return [Math.round(a.width), Math.round(a.height)] as const;
    });

  const before = await hit();
  expect(before, "no button on the page to measure").not.toBeNull();
  expect(before![1], "the button is already under the floor").toBeGreaterThanOrEqual(FLOOR);

  await page.evaluate(() => {
    const el = document.querySelector<HTMLElement>("[data-fixture] button");
    if (el) { el.style.height = "12px"; el.style.minHeight = "12px"; el.style.padding = "0"; }
  });

  const after = await hit();
  expect(
    after![1],
    "shrinking the target to 12px did not change what the probe measures",
  ).toBeLessThan(FLOOR);
});

test("every target is hittable at its declared size", async ({ page }) => {
  test.setTimeout(600_000);
  const rows: string[] = [];
  const undersized: string[] = [];

  for (const { component, fixture, selector, label, dismiss } of CONTROLS) {
    await gotoFixture(page, component, fixture);
    await page.locator("[data-fixture]").waitFor({ state: "attached", timeout: 15000 }).catch(() => {});
    if (dismiss) {
      await page.keyboard.press("Escape");
      await page.waitForTimeout(250);
    }
    const r = await page.evaluate(
      ([sel]) => {
        const el = document.querySelector<HTMLElement>(`[data-fixture] ${sel}`);
        if (!el) return null;
        const a = el.getBoundingClientRect();
        const cx = a.left + a.width / 2;
        const cy = a.top + a.height / 2;
        const hits = (x: number, y: number) => {
          const t = document.elementFromPoint(x, y);
          return t !== null && (t === el || el.contains(t));
        };
        // Walk out from the centre until the element stops answering. An
        // ancestor's clip shows up here and nowhere in the rect.
        const edge = (dx: number, dy: number, limit: number) => {
          let n = 0;
          while (n < limit && hits(cx + dx * (n + 1), cy + dy * (n + 1))) n += 1;
          return n;
        };
        const half = Math.ceil(Math.max(a.width, a.height));
        // The centre has to hit before the walk means anything: an element
        // covered by a sibling answers nowhere, and counting the centre as a
        // hit by construction reported that as 1x1 rather than 0x0.
        if (!hits(cx, cy)) return { rect: [Math.round(a.width), Math.round(a.height)], hit: [0, 0] };
        const w = edge(-1, 0, half) + edge(1, 0, half) + 1;
        const h = edge(0, -1, half) + edge(0, 1, half) + 1;
        return { rect: [Math.round(a.width), Math.round(a.height)], hit: [w, h] };
      },
      [selector] as const,
    );
    if (!r) { rows.push(`${label}: NOT FOUND`); continue; }
    const line = `${label.padEnd(22)} rect ${r.rect[0]}x${r.rect[1]}  effective ${r.hit[0]}x${r.hit[1]}`;
    rows.push(line);
    if (r.hit[0] < FLOOR || r.hit[1] < FLOOR) undersized.push(`${label}: effective ${r.hit[0]}x${r.hit[1]} (rect ${r.rect[0]}x${r.rect[1]})`);
  }

  console.log("TARGET_SIZE_EFFECTIVE");
  for (const line of rows) console.log(`  TSE ${line}`);
  expect(rows.length, "no controls were measured").toBe(CONTROLS.length);
  expect(
    undersized,
    `these declare ${FLOOR}px or more and cannot be hit across it — an ancestor ` +
      "clips the target out of the box its rect reports",
  ).toEqual([]);
});
