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
const SIZED_ON_PURPOSE = new Set([
  "Loader/sized",
  /**
   * `<Button loading loaderSize={40}>` — the fixture chooses 40 to photograph
   * the loader on an accent ground, which is the test SIZED_ON_PURPOSE applies:
   * someone chose the number.
   *
   * It was red from the commit that created it, 082a9fb on 2026-09-11, and was
   * never once reported, because the gate's only runs in that slice happened
   * before the fixture was written: every green run measured 307 SVGs and this
   * one is the 308th. No gate list since named this spec, so nothing measured
   * it again until the delivery audit.
   */
  "Button/loading-on-accent",
]);

/**
 * The plant, in the suite rather than in a docblock.
 *
 * This gate shipped measuring `getBoundingClientRect`, which is the rect AFTER
 * transforms, and a spinning 40px loader swept a 57px diagonal. Nobody noticed
 * for a day because the only thing that would have noticed was a person
 * running it and reading the number. A plant that runs by hand is the same as
 * no plant: `Button/loading-on-accent` was red from the commit that created it
 * and named by nothing until someone went looking.
 *
 * One page, one injected icon, ~2s — it does not re-walk the 444 fixtures.
 */
test("the measurement notices an icon that takes its size from an ancestor", async ({ page }) => {
  await page.goto("/__fixtures/Button/default", { waitUntil: "domcontentloaded" });
  await page.locator("[data-fixture]").waitFor({ state: "attached", timeout: 15000 });

  const measure = (ceiling: number) =>
    page.evaluate((c) => {
      const out: string[] = [];
      for (const svg of document.querySelectorAll<SVGElement>("[data-fixture] svg")) {
        const cs = getComputedStyle(svg);
        const w = parseFloat(cs.width);
        const h = parseFloat(cs.height);
        const rect = svg.getBoundingClientRect();
        const width = Number.isFinite(w) ? w : rect.width;
        const height = Number.isFinite(h) ? h : rect.height;
        if (width === 0 && height === 0) continue;
        if (width > c || height > c) out.push(`${Math.round(width)}x${Math.round(height)}`);
      }
      return out;
    }, ceiling);

  expect(await measure(CEILING), "the page starts with an oversize icon").toEqual([]);

  // An icon with no size of its own, stretched by its parent — the exact shape
  // the ceiling exists to find.
  await page.evaluate(() => {
    const host = document.querySelector("[data-fixture]");
    const wrap = document.createElement("div");
    wrap.style.width = "200px";
    wrap.style.height = "200px";
    wrap.innerHTML = '<svg style="width:100%;height:100%" viewBox="0 0 24 24"><path d="M0 0h24v24H0z"/></svg>';
    host?.appendChild(wrap);
  });

  expect(
    await measure(CEILING),
    "a 200px icon did not register, so this gate is measuring nothing",
  ).toEqual(["200x200"]);

  // And the transform must NOT register: a rotation is not a size.
  await page.evaluate(() => {
    const svg = document.querySelector<SVGElement>("[data-fixture] div > svg");
    if (svg) { (svg as unknown as HTMLElement).style.width = "30px"; (svg as unknown as HTMLElement).style.height = "30px"; (svg as unknown as HTMLElement).style.transform = "rotate(45deg)"; }
  });
  expect(
    await measure(CEILING),
    "a rotated 30px icon registered as oversize — the gate is reading the transformed rect again",
  ).toEqual([]);
});

test("no icon renders unbounded", async ({ page }) => {
  test.setTimeout(900_000);
  await gotoFixtureIndex(page);
  const paths = await page.locator("[data-fixture-index] li a").evaluateAll((els) =>
    els.map((e) => new URL((e as HTMLAnchorElement).href).pathname),
  );

  const oversize: string[] = [];
  const zeroBoxControls: string[] = [];
  let measured = 0;

  for (const path of paths) {
    await page.goto(path, { waitUntil: "domcontentloaded" });
    await page.locator("[data-fixture]").waitFor({ state: "attached", timeout: 15000 }).catch(() => {});
    const found = await page.evaluate((ceiling) => {
      const out: string[] = [];
      const collapsed: string[] = [];
      let n = 0;
      for (const svg of document.querySelectorAll<SVGElement>("[data-fixture] svg")) {
        /**
         * The UNTRANSFORMED box, in painted pixels.
         *
         * `getBoundingClientRect` returns the rect after transforms, and a
         * spinning loader is a square rotating about its centre: its rect
         * sweeps the diagonal, size x 1.414, whenever the animation is caught
         * off a right angle. `Button/loading-on-accent` reported 57x57 for a
         * loader the fixture sizes at 40.
         *
         * `getBBox` is NOT the fix and was briefly used as one: it returns the
         * SVG's own user units, so a 24-unit viewBox painted at 200px reports
         * 24 and the gate could never fail again. The used width and height
         * from the computed style are painted pixels and ignore the transform,
         * which is the measurement this gate has always meant.
         */
        const cs = getComputedStyle(svg);
        const usedW = parseFloat(cs.width);
        const usedH = parseFloat(cs.height);
        const rect = svg.getBoundingClientRect();
        const r = {
          width: Number.isFinite(usedW) ? usedW : rect.width,
          height: Number.isFinite(usedH) ? usedH : rect.height,
        };
        if (r.width === 0 && r.height === 0) {
          /**
           * A zero box is usually an icon nobody can see — inside a closed
           * panel, a `display: none` ancestor — and skipping those is right.
           * It is not right when the icon is the only content of a control
           * someone can tab to: TimePicker's clear button rendered 0x0 for a
           * month, its icon never sized, and this sweep skipped it as hidden.
           * So a 0x0 icon whose nearest focusable control is itself visible is
           * a collapsed control, not an absent one.
           */
          const control = svg.closest<HTMLElement>(
            "button, a[href], input, select, textarea, [role='button'], [tabindex]",
          );
          const focusable =
            !!control &&
            control.tabIndex >= 0 &&
            !control.hasAttribute("disabled") &&
            control.getAttribute("aria-disabled") !== "true" &&
            !control.closest("[inert], [aria-hidden='true']");
          if (focusable && control!.checkVisibility({ visibilityProperty: true })) {
            collapsed.push(
              `<${control!.tagName.toLowerCase()}${control!.getAttribute("aria-label") ? ` aria-label="${control!.getAttribute("aria-label")}"` : ""}> icon 0x0`,
            );
          }
          continue;
        }
        n += 1;
        // A decorative illustration would set its own size; an icon that has
        // grown past this took it from an ancestor.
        if (r.width > ceiling || r.height > ceiling) {
          out.push(`${Math.round(r.width)}x${Math.round(r.height)}`);
        }
      }
      return { out, n, collapsed };
    }, CEILING);
    measured += found.n;
    zeroBoxControls.push(...found.collapsed.map((c) => `${path.replace("/__fixtures/", "")}: ${c}`));
    const key = path.replace("/__fixtures/", "").replace(".", "/");
    if (SIZED_ON_PURPOSE.has(key)) continue;
    for (const size of found.out) oversize.push(`${key}: svg ${size}`);
  }

  console.log(
    `ICON_BOUNDS measured=${measured} ceiling=${CEILING} oversize=${oversize.length} collapsed=${zeroBoxControls.length}`,
  );
  for (const c of zeroBoxControls) console.log(`ICON_BOUNDS_COLLAPSED ${c}`);
  // A walk that measured nothing is not a pass.
  expect(measured, "no icons were measured").toBeGreaterThan(200);
  expect(
    [...new Set(oversize)],
    `an icon wider or taller than ${CEILING}px has taken its size from an ` +
      "ancestor rather than carrying one — pin it",
  ).toEqual([]);
  expect(
    [...new Set(zeroBoxControls)],
    "a focusable, visible control whose icon renders 0x0 — the control is a tab stop " +
      "with nothing to see; size the icon",
  ).toEqual([]);
});
