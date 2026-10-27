import type { Page } from "@playwright/test";
import { test, expect } from "./_test";
import { gotoFixture, gotoFixtureIndex } from "./_nav";
import { openSurfaces, settle, type Surface } from "./_surfaces";

/**
 * Every open popup lies inside the viewport and holds its own content, at
 * phone widths.
 *
 * The anchored positioner has clamped a surface's position by its width since
 * L24, and never its width. A surface wider than the viewport was pinned to the
 * left margin and ran off the right: InternationalPhoneInput's country list is a
 * fixed `w-72`, 288 px, and ended 16 px past a 280 px viewport; DatePicker's
 * calendar, 298 px of fixed cells, 58 px past it; Drawer's 300 px side sheets
 * 20 px. Capping the width moves the question inside: a capped surface whose
 * content cannot shrink spills out of it instead, which reads as a fix and is
 * not one. So each surface is held to both.
 *
 * Each fixture is opened at 280, 320 and 360 px — 320 is the README's floor,
 * 360 the docs' phone frame, 280 the margin below both — inside the phone
 * frame's 16 px gutter, with motion off so a sheet is read where it lands
 * rather than where its slide is. A surface is any visible element the
 * fixture portals out, outermost first, or an in-place one with a popup role.
 *
 * What it leaves out, and why:
 * - A scrim: an element exactly the viewport's size with no popup role is the
 *   backdrop the surface sits in, not the surface. The role matters: a
 *   Drawer side sheet capped at a 280 px viewport is exactly the viewport too,
 *   and is a dialog.
 * - A surface under `aria-hidden` or `inert`: a Drawer kept mounted while
 *   closed parks its panel off screen on purpose. An open surface carries
 *   neither, and one that did would fail an audit on its own.
 * - The gutter: a menu keeps 8 px from each edge and an edge-attached sheet
 *   keeps none, so the edges are asserted against the viewport itself.
 * - The vertical axis. A tall Modal or Drawer is meant to run past a 640 px
 *   viewport and scroll, so "inside" is a horizontal statement here. Where a
 *   surface sits against its trigger is the visual baselines' question: they
 *   caught A1b's own regression, a capped surface drawn at the top of the
 *   viewport over its trigger, which every edge read here passed.
 */

const WIDTHS = [280, 320, 360] as const;

/**
 * Fixtures with an open surface, in every engine; a walk that reaches fewer has
 * lost surfaces. 154 was step 0 of A1b, read before its fixes; A1b (684ea8a1)
 * shipped at 155 and no fixture or spec has changed since. Raised to 155 in V1,
 * read in chromium, firefox and webkit on the same tree.
 */
const FLOOR = 155;

/**
 * In the document before it loads, not added once the fixture has opened:
 * injected after, the gutter's layout shift scrolled an RTL page, and
 * Pagination and Breadcrumb close their lists on any scroll — the open-rtl
 * fixture was read with nothing open, in Chromium, on every run.
 */
const FRAME =
  "main[data-fixture-act] { padding: 16px !important; } " +
  "*, *::before, *::after { animation: none !important; transition: none !important; }";

const framed = (page: Page) =>
  page.addInitScript((css) => {
    const style = document.createElement("style");
    style.textContent = css;
    document.documentElement.appendChild(style);
  }, FRAME);

/** What is wrong with one surface, or nothing. Both are integers off one layout, so neither has rounding slack. */
const problems = (s: Surface): string[] => [
  ...(s.left < 0 ? [`starts ${-s.left} px before the left edge`] : []),
  ...(s.right > s.viewport ? [`ends ${Math.round((s.right - s.viewport) * 10) / 10} px past the right edge`] : []),
  ...(s.scroll > s.client ? [`its content is ${s.scroll} px in ${s.client}`] : []),
];

test("every open surface lies inside the viewport and holds its content", async ({ page }) => {
  test.setTimeout(1_800_000);
  await gotoFixtureIndex(page);
  const paths = await page.locator("[data-fixture-index] li a").evaluateAll((els) =>
    els.map((e) => new URL((e as HTMLAnchorElement).href).pathname),
  );

  await framed(page);
  const open = new Set<string>();
  const outside: string[] = [];
  let reads = 0;
  let reopened = 0;
  const load = async (path: string, id: string, width: number) => {
    await page.setViewportSize({ width, height: 640 });
    await page.goto(path, { waitUntil: "domcontentloaded" });
    await settle(page, id);
  };
  for (const path of paths) {
    const id = path.replace("/__fixtures/", "");
    await load(path, id, WIDTHS[0]);
    let first = -1;
    for (const width of WIDTHS) {
      await page.setViewportSize({ width, height: 640 });
      let surfaces = await openSurfaces(page);
      // A resize scrolls an RTL page, and a list that closes on scroll closes:
      // opened again at this width, not read as having nothing open.
      if (first >= 0 && surfaces.length < first) {
        reopened += 1;
        await load(path, id, width);
        surfaces = await openSurfaces(page);
      }
      if (first < 0) first = surfaces.length;
      for (const s of surfaces) {
        reads += 1;
        open.add(id);
        const wrong = problems(s);
        if (wrong.length) outside.push(`${id} at ${width}px: ${s.el} at ${s.left}..${s.right} — ${wrong.join("; ")}`);
      }
    }
  }

  console.log(
    `SURFACE_FIT fixtures with an open surface ${open.size} (floor ${FLOOR}), reads ${reads} (reopened after a resize ${reopened}), ` +
      `of ${paths.length} fixtures x ${WIDTHS.length} widths, outside ${outside.length}`,
  );
  for (const o of outside) console.log(`SURFACE_FIT_FINDING ${o}`);
  expect(open.size, "fewer fixtures with an open surface than step 0 counted: the walk lost surfaces").toBeGreaterThanOrEqual(FLOOR);
  expect(outside, "a surface past the viewport, or one whose content spills out of it").toEqual([]);
});

/**
 * The plant goes through a real surface and the real read: SearchableDropdown's
 * list, which sizes to its content, given a fixed 400 px width through its
 * `classes`. Capped, it must land inside; with a 400 px minimum the cap cannot
 * win, and it must be reported. Not Dropdown: its list is held to the
 * trigger's width inline, so a width class there plants nothing. And a
 * dialog: Drawer's panel held to 400 px, so the scrim rule's exception for a
 * viewport-sized element is shown not to swallow a dialog that overflows.
 */
test("the check reports a surface wider than the viewport, and the cap brings a fixed width inside", async ({ page }) => {
  await framed(page);
  const at = async (component: string, fixture: string, content: string) => {
    await page.setViewportSize({ width: WIDTHS[0], height: 640 });
    await gotoFixture(page, component, fixture, { classes: { content } });
    await settle(page, `${component}/${fixture}`);
    return openSurfaces(page);
  };

  const floor = await at("SearchableDropdown", "open", "min-w-[400px]");
  const fixed = await at("SearchableDropdown", "open", "w-[400px]");
  const dialog = await at("Drawer", "open", "min-w-[400px]");
  console.log(`SURFACE_FIT_SELF_CHECK min-width ${JSON.stringify(floor)}; fixed width ${JSON.stringify(fixed)}; dialog ${JSON.stringify(dialog)}`);
  expect(floor.length, "the planted surface was not read at all").toBe(1);
  expect(problems(floor[0]), "a 400 px surface in a 280 px viewport was not reported").not.toEqual([]);
  expect(fixed.length, "the capped surface was not read at all").toBe(1);
  expect(problems(fixed[0]), "a fixed 400 px width was not brought inside the viewport").toEqual([]);
  expect(dialog.length, "the planted dialog was not read at all").toBe(1);
  expect(problems(dialog[0]), "a 400 px dialog in a 280 px viewport was not reported").not.toEqual([]);
});
