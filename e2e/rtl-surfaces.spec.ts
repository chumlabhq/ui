import type { Page } from "@playwright/test";
import { test, expect } from "./_test";
import { gotoFixture, gotoFixtureIndex } from "./_nav";
import { openSurfaces, settle, type Surface } from "./_surfaces";

/**
 * Every open surface in a right-to-left page sits against its trigger's
 * inline-start edge, which is the right edge, or is pushed inside the viewport.
 *
 * The A2 audit measured this by hand: 155 open-surface fixtures served as
 * `<html dir="rtl">`, 46 of them at 1024 px placed from the trigger's LEFT edge
 * exactly as in LTR — SearchableDropdown 15, DatePicker 20, the phone input's
 * country list 3, TimePicker's clock 3, Breadcrumb 2, Table's filter 3 — every
 * one through a positioner that had no direction input (A2b, causes C1 and C2).
 * This walk is that measurement kept: A2b's step 0 read the same 46 at 1024 and
 * 46 at 360 on e0a478eb, and the fix reads 0.
 *
 * The page is made right-to-left the way a consumer's is: the served document
 * is rewritten to `<html dir="rtl">` before it parses. The audit's first
 * attempt set `dir` from a script and 143 of 155 fixtures rendered
 * left-to-right anyway, so the direction is checked on every page read.
 *
 * Where a surface should be is computed here, from the trigger and the
 * surface's own width, not read back from the code under test:
 * - above or below its trigger, the surface's right edge is the trigger's;
 *   if that would cross the left margin (8 px) it is pushed right until it
 *   does not, and one wider than the viewport ends at the right margin, where
 *   the line starts;
 * - Table's filter is the one exception, and it is LTR's own: with less than
 *   its 220 px estimate of room toward the inline end it aligns its END edge
 *   by that estimate (in LTR its 180 px panel ends 40 px short of the trigger's
 *   right, in the recorded baseline). RTL mirrors that rather than inventing a
 *   placement LTR does not have, so it is counted as its own verdict;
 * - a tooltip centred on its trigger is centred in either direction;
 * - beside its trigger (a submenu), or with no anchor (Modal, Drawer), there
 *   is no inline edge to align and the surface is only counted.
 *
 * Both widths are read from one load, as surface-fit reads its three: loaded at
 * 1024, resized to 360, and reloaded only when the resize closed something (a
 * resize scrolls an RTL page, and Pagination and Breadcrumb close on scroll).
 */

const WIDTHS = [1024, 360] as const;
const MARGIN = 8;
const TOLERANCE = 1.5;
const FILTER_ESTIMATE = 220;

/**
 * Floors from A2b's step 0, read in chromium on HEAD before the fix: 156
 * fixtures with an open surface (the audit's 155 plus A2a's Modal `open-rtl`)
 * and 246 reads above or below an anchor (123 per width). A walk that reaches
 * fewer has lost surfaces, and a gate over fewer surfaces is a weaker gate.
 */
const FLOOR = { fixtures: 156, anchored: 246 };

type Verdict = "start" | "both-edges" | "clamped" | "end-estimate" | "centred" | "beside" | "unanchored" | "wrong";

/** Where `s` should be in a right-to-left page, and whether it is there. */
function verdict(s: Surface): { verdict: Verdict; expected?: number } {
  const t = s.anchor;
  if (!t) return { verdict: "unanchored" };
  const below = s.top >= t.bottom - 1;
  const above = s.bottom <= t.top + 1;
  if (!below && !above) return { verdict: "beside" };
  if (s.role === "tooltip" && Math.abs((s.left + s.right) / 2 - (t.left + t.right) / 2) <= TOLERANCE) {
    return { verdict: "centred" };
  }
  const width = s.right - s.left;
  const filter = s.el.includes("[data-table-filter-content]") && t.right < FILTER_ESTIMATE;
  let right = filter ? t.left + FILTER_ESTIMATE : t.right;
  if (right - width < MARGIN) right = MARGIN + width;
  if (right > s.viewport - MARGIN) right = s.viewport - MARGIN;
  if (Math.abs(s.right - right) > TOLERANCE) return { verdict: "wrong", expected: right };
  if (filter) return { verdict: "end-estimate" };
  if (Math.abs(s.right - t.right) > TOLERANCE) return { verdict: "clamped" };
  return { verdict: Math.abs(s.left - t.left) <= TOLERANCE ? "both-edges" : "start" };
}

/** Serves every fixture document as `<html dir="rtl">`; everything else falls through to the harness's routes. */
async function servedRtl(page: Page): Promise<void> {
  await page.route(/\/__fixtures(\/|$)/, async (route) => {
    if (route.request().resourceType() !== "document") return route.fallback();
    const response = await route.fetch();
    const body = (await response.text()).replace(/<html([^>]*)>/, '<html$1 dir="rtl">');
    await route.fulfill({ response, body });
  });
  await page.addInitScript(() => {
    const style = document.createElement("style");
    style.textContent = "*, *::before, *::after { animation: none !important; transition: none !important; }";
    document.documentElement.appendChild(style);
  });
}

const describe = (id: string, width: number, s: Surface, why: { verdict: Verdict; expected?: number }) =>
  `${id} at ${width}px: ${s.el} at [${s.left}..${s.right}] against an anchor at ` +
  `[${s.anchor!.left}..${s.anchor!.right}] (${s.anchor!.how}); its right edge belongs at ${why.expected}`;

test("every open surface in a right-to-left page aligns to its trigger's inline-start edge or is pushed inside", async ({ page }) => {
  test.setTimeout(1_800_000);
  await gotoFixtureIndex(page);
  const paths = await page.locator("[data-fixture-index] li a").evaluateAll((els) =>
    els.map((e) => new URL((e as HTMLAnchorElement).href).pathname),
  );

  await servedRtl(page);
  const fixtures = new Set<string>();
  const counts: Record<Verdict, number> = { start: 0, "both-edges": 0, clamped: 0, "end-estimate": 0, centred: 0, beside: 0, unanchored: 0, wrong: 0 };
  const wrong: string[] = [];
  const ltr: string[] = [];
  let reopened = 0;
  const load = async (path: string, id: string, width: number) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(path, { waitUntil: "domcontentloaded" });
    await settle(page, id);
  };
  for (const path of paths) {
    const id = path.replace("/__fixtures/", "");
    await load(path, id, WIDTHS[0]);
    let first = -1;
    for (const width of WIDTHS) {
      await page.setViewportSize({ width, height: 900 });
      let surfaces = await openSurfaces(page);
      if (first >= 0 && surfaces.length < first) {
        reopened += 1;
        await load(path, id, width);
        surfaces = await openSurfaces(page);
      }
      if (first < 0) first = surfaces.length;
      if (surfaces.length && (await page.evaluate(() => getComputedStyle(document.documentElement).direction)) !== "rtl") {
        ltr.push(`${id} at ${width}px`);
        continue;
      }
      for (const s of surfaces) {
        fixtures.add(id);
        const why = verdict(s);
        counts[why.verdict] += 1;
        if (why.verdict === "wrong") wrong.push(describe(id, width, s, why));
      }
    }
  }

  const anchored = counts.start + counts["both-edges"] + counts.clamped + counts["end-estimate"] + counts.wrong;
  console.log(
    `RTL_SURFACES fixtures with an open surface ${fixtures.size} (floor ${FLOOR.fixtures}), ` +
      `reads above or below an anchor ${anchored} (floor ${FLOOR.anchored}): start ${counts.start}, ` +
      `both edges ${counts["both-edges"]}, pushed inside ${counts.clamped}, Table's end estimate ${counts["end-estimate"]}, ` +
      `wrong ${counts.wrong}; also centred tooltips ${counts.centred}, beside ${counts.beside}, unanchored ${counts.unanchored}; ` +
      `reopened after a resize ${reopened}, of ${paths.length} fixtures x ${WIDTHS.length} widths`,
  );
  for (const w of wrong) console.log(`RTL_SURFACES_FINDING ${w}`);
  expect(ltr, "pages that rendered left-to-right although the document was served dir=rtl").toEqual([]);
  expect(fixtures.size, "fewer fixtures with an open surface than step 0 counted: the walk lost surfaces").toBeGreaterThanOrEqual(FLOOR.fixtures);
  expect(anchored, "fewer anchored reads than step 0 counted: the walk lost surfaces or their anchors").toBeGreaterThanOrEqual(FLOOR.anchored);
  expect(wrong, "a surface placed from the wrong edge of its trigger in a right-to-left page").toEqual([]);
});

/**
 * The plant goes through a real surface, the real read and the real verdict:
 * SearchableDropdown's list in a right-to-left page, read as placed, then moved
 * to where every positioner put it before A2b — its left edge on the trigger's
 * left edge, written as a physical `left`. Placed, it must read `start`;
 * planted, `wrong`, with the right edge it belongs at.
 */
test("the check reports a surface placed from the trigger's physical left", async ({ page }) => {
  await servedRtl(page);
  await page.setViewportSize({ width: WIDTHS[0], height: 900 });
  await gotoFixture(page, "SearchableDropdown", "open-rtl");
  await settle(page, "SearchableDropdown/open-rtl");

  const placed = await openSurfaces(page);
  expect(placed.length, "the surface was not read at all").toBe(1);
  expect(placed[0].anchor?.how, "the surface's anchor was not read from its component").toBe("prop");

  await page.evaluate((left) => {
    const surface = document.querySelector<HTMLElement>("[role='group'][data-side]")!;
    surface.style.insetInlineStart = "";
    surface.style.left = `${left}px`;
  }, placed[0].anchor!.left);
  const planted = await openSurfaces(page);

  console.log(`RTL_SURFACES_SELF_CHECK placed ${JSON.stringify(placed[0])} -> ${verdict(placed[0]).verdict}; planted ${JSON.stringify(planted[0])} -> ${JSON.stringify(verdict(planted[0]))}`);
  expect(verdict(placed[0]).verdict).toBe("start");
  expect(planted[0].left, "the plant did not move the surface").toBe(placed[0].anchor!.left);
  expect(verdict(planted[0])).toEqual({ verdict: "wrong", expected: placed[0].anchor!.right });
});
