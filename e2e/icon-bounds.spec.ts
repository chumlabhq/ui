import { expect, test } from "@playwright/test";
import { gotoFixtureIndex } from "./_nav";

/**
 * No icon renders unbounded.
 *
 * `MultiSelectSearchableDropdown`'s chip X was `w-full h-full` with no size of
 * its own, so it took whatever its parent chain allowed. That was harmless
 * while the parent was 12px and became a 300x300 glyph the moment the parent
 * changed — found by measuring chip proportions afterwards, not by any gate.
 * axe cannot see it (a huge icon is not a violation), and no baseline covered
 * the fixture it happened in.
 *
 * A source scan finds the shape but not the defect: all seven relatively-sized
 * icons in the tree have pinned parents today, so a static list would record
 * seven safe sites and still miss the eighth written tomorrow. This asks the
 * question that actually matters — what did it render at — which is only
 * answerable in a browser.
 */
/**
 * Derived, not picked. Measured across all 307 icons every fixture renders:
 * min 12, p50 16, p90 20, p99 22, and the only things above 22 are Loader —
 * 28 for its default and 67 for `sized`, whose whole subject is the `size`
 * prop and which is exempt below. So 28 is the largest an icon in this library
 * is ever deliberately drawn, and 32 is the first round number clear of it.
 *
 * 64 was the first value here and it was a number that passed, not a number
 * anyone chose. It would have let an icon that took its size from a 40px
 * parent through; this will not. If a component ever legitimately draws an
 * icon above 32 it belongs in SIZED_ON_PURPOSE with its reason, which is the
 * point of naming them rather than widening this.
 */
const CEILING = 32;

/**
 * Fixtures that size an SVG on purpose. Named, not pattern-matched: "it is big"
 * and "it grew" look identical from the outside, and the difference is whether
 * anyone chose the number.
 */
const SIZED_ON_PURPOSE = new Set(["Loader/sized"]);

test("no icon renders unbounded", async ({ page }) => {
  test.setTimeout(900_000);
  await gotoFixtureIndex(page);
  const paths = await page.locator("[data-fixture-index] li a").evaluateAll((els) =>
    els.map((e) => new URL((e as HTMLAnchorElement).href).pathname),
  );

  const oversize: string[] = [];
  let measured = 0;

  for (const path of paths) {
    await page.goto(path, { waitUntil: "domcontentloaded" });
    await page.locator("[data-fixture]").waitFor({ state: "attached", timeout: 15000 }).catch(() => {});
    const found = await page.evaluate((ceiling) => {
      const out: string[] = [];
      let n = 0;
      for (const svg of document.querySelectorAll<SVGElement>("[data-fixture] svg")) {
        const r = svg.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) continue;
        n += 1;
        // A decorative illustration would set its own size; an icon that has
        // grown past this took it from an ancestor.
        if (r.width > ceiling || r.height > ceiling) {
          out.push(`${Math.round(r.width)}x${Math.round(r.height)}`);
        }
      }
      return { out, n };
    }, CEILING);
    measured += found.n;
    const key = path.replace("/__fixtures/", "").replace(".", "/");
    if (SIZED_ON_PURPOSE.has(key)) continue;
    for (const size of found.out) oversize.push(`${key}: svg ${size}`);
  }

  console.log(`ICON_BOUNDS measured=${measured} ceiling=${CEILING} oversize=${oversize.length}`);
  // A walk that measured nothing is not a pass.
  expect(measured, "no icons were measured").toBeGreaterThan(200);
  expect(
    [...new Set(oversize)],
    `an icon wider or taller than ${CEILING}px has taken its size from an ` +
      "ancestor rather than carrying one — pin it",
  ).toEqual([]);
});
