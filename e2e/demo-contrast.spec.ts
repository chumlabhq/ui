import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import { MEASURE_DOCUMENT } from "./_contrast-measure";

/**
 * Contrast as painted, over the demo PAGES.
 *
 * `contrast-painted` measures the 444 fixtures and has reported 0 findings for
 * months. It is right, and it is blind to three quarters of what a reader
 * actually looks at: the pages are not built from fixtures, so every class the
 * demo authors wrote for themselves — captions, scaffolding, trigger buttons —
 * is outside its population. Toast's page had 29 of its 58 triggers painted
 * `bg-cl-bg-elevated` on a card that is also `bg-cl-bg-elevated`, and nothing
 * measured it because nothing was pointed there.
 *
 * Same measurement, different roots. `MEASURE_DOCUMENT` is the same source the
 * fixture sweep evaluates, with the scope as a parameter — the first version of
 * this scan had `[data-fixture]` baked in, walked nothing on a demo page, and
 * reported a clean sweep over zero rows.
 *
 * IT WOULD NOT HAVE CAUGHT TOAST, and that is worth stating where the gate is
 * rather than leaving it implied. Toast's 29 triggers painted `bg-cl-bg-elevated`
 * on a card of the same token failed as a CONTROL BOUNDARY, not as text: their
 * labels were `text-cl-text` at full contrast. Planted — the trigger class put
 * back exactly as it was — this gate stays green. What would catch it is a
 * boundary check, and measuring one across these pages found 91 of 3961
 * controls with neither a fill nor a border clearing 3:1, most of them text
 * links and slider tick labels that correctly have no boundary. That is a
 * number nobody could stand behind as a pass/fail, so it is not built here.
 *
 * What this DOES catch is text, and there was plenty: 746 findings on the first
 * honest run, taken to 47 by six class idioms and one library palette. Planted
 * by restoring one of those idioms — `bg-cl-success/15 text-cl-success` on the
 * Table page — it reports 390 and names them at 4.09:1.
 *
 * The denominator moves between runs — 41289 and 41429 on two runs of the same
 * tree — because the dropdown pages load their country lists over the network
 * and the rows exist only once that lands. Findings are what this asserts on;
 * `measured` is asserted only against a floor, for the case where the scan
 * walks nothing at all.
 */
const ROUTES = (readFileSync("src/App.tsx", "utf8").match(/<Route path="([^"*:]+)"/g) ?? [])
  .map((m) => m.slice(13, -1))
  .filter((r) => r !== "/" && r !== "/faq" && !r.startsWith("/blog"));

/**
 * Measured, recorded, not yet fixed — down only.
 *
 * The scan opened at 746 findings across 15 pages. Six class idioms and one
 * library palette accounted for 699 of them; these 19 selectors are the tail,
 * and they are all real by the same rule the fixture sweep applies. They are
 * listed so the number cannot grow while they are worked through, and so that
 * "43 remaining" is a set someone can read rather than a total.
 *
 * Roughly: nine are `::placeholder` at 2.29-4.41 (the fixture gate counts
 * placeholders and fails them too, and every fixture placeholder passes, so
 * these are demo inputs specifically); the rest are single semantic-token
 * labels on light surfaces — the light-mode `--cl-warning` and `--cl-success`
 * are surface colours, not text colours, which is the same fact behind the
 * bulk fixes above.
 */
const RECORDED: ReadonlySet<string> = new Set([
  "avatar dark span",
  "avatar light span",
  "breadcrumb light span",
  "loader light div.flex.items-center",
  "resizable-panel light div.text-[10px].font-mono",
  "resizable-panel light div.text-xs.font-semibold",
  "slider dark div.flex.items-center",
  "stepper light span.text-sm.font-semibold",
  "tab-panel light div.text-xs.font-medium",
  "table dark input.w-full.max-w-xs::placeholder",
  "table dark input.w-full.pl-10::placeholder",
  "table dark input.w-full.px-4::placeholder",
  "table light input.w-full.max-w-xs::placeholder",
  "table light input.w-full.pl-10::placeholder",
  "table light input.w-full.px-4::placeholder",
  "table light td.px-4.py-2",
  "time-picker light input.flex-1.min-w-0::placeholder",
  "time-picker light input.min-w-0.bg-transparent::placeholder",
  "toast light button.px-3.py-1.5",
]);

/**
 * The plant, in the suite rather than in a docblock.
 *
 * This scan's first version had `[data-fixture]` baked into its roots, walked
 * nothing on a demo page and reported a clean sweep over zero rows. That was
 * caught by a planted 1.5:1 paragraph run by hand. Running it here means the
 * next time the roots, the theme setup or `MEASURE_DOCUMENT` stops reaching
 * the page, the gate says so instead of printing a tick. One page, ~3s.
 */
test("the scan notices text under AA", async ({ page }) => {
  await page.goto("/button", { waitUntil: "networkidle" });

  const findings = async () => {
    const rows = (await page.evaluate(MEASURE_DOCUMENT)) as Array<{
      key: string; ratio: number; floor?: number; detail: string; unmeasurable?: boolean;
    }>;
    return rows.filter((r) => !r.unmeasurable && r.ratio < (r.floor ?? 4.5));
  };

  const before = await findings();

  await page.evaluate(() => {
    const p = document.createElement("p");
    p.textContent = "planted, deliberately illegible";
    p.style.color = "#8a8a8a";
    p.style.background = "#7a7a7a";
    p.style.fontSize = "14px";
    p.id = "planted-low-contrast";
    document.body.appendChild(p);
  });

  const after = await findings();
  expect(
    after.length,
    "a paragraph planted at roughly 1.1:1 was not reported, so this scan is walking nothing",
  ).toBeGreaterThan(before.length);
});

test("every demo page clears AA on the text it paints", async ({ page }) => {
  test.setTimeout(600_000);
  await page.setViewportSize({ width: 1280, height: 1200 });

  const findings: Array<{ route: string; theme: string; key: string; ratio: number; detail: string }> = [];
  let measured = 0;

  for (const route of ROUTES) {
    for (const theme of ["light", "dark"] as const) {
      /**
       * Set the way a user sets it, then load.
       *
       * Poking `data-theme` on an already-rendered page leaves it half
       * repainted: the site's provider toggles a `light` AND a `dark` class and
       * writes localStorage, so an attribute on its own flipped the surfaces
       * and left the text. That produced 4787 "findings" whose detail read
       * `rgb(237,239,244) on rgb(250,250,247)` — the dark foreground on the
       * light page, a state no reader can reach.
       */
      await page.addInitScript(
        ([key, value]) => window.localStorage.setItem(key, value),
        ["chumlab-theme", theme] as const,
      );
      await page.goto(`/${route.replace(/^\//, "")}`, { waitUntil: "networkidle" });
      await page.waitForTimeout(150);
      const rows = (await page.evaluate(MEASURE_DOCUMENT)) as Array<{
        key: string;
        ratio: number;
        floor?: number;
        detail: string;
        unmeasurable?: boolean;
      }>;
      for (const row of rows) {
        if (row.unmeasurable) continue;
        measured += 1;
        if (row.ratio < (row.floor ?? 4.5)) findings.push({ route, theme, ...row });
      }
    }
  }

  console.log(
    `DEMO_CONTRAST pages=${ROUTES.length} measured=${measured} findings=${findings.length}`,
  );
  for (const f of findings.slice(0, 1200)) {
    console.log(`DEMO_CONTRAST_FINDING ${f.route} ${f.theme} ${f.ratio} ${f.key} :: ${f.detail}`);
  }

  expect(measured, "nothing was measured — the scan walked no elements").toBeGreaterThan(2000);

  const key = (f: { route: string; theme: string; key: string }) => `${f.route} ${f.theme} ${f.key}`;
  const fresh = findings.filter((f) => !RECORDED.has(key(f)));
  expect(
    fresh.map((f) => `${f.route} ${f.theme} ${f.ratio}:1 ${f.key} (${f.detail})`).sort(),
    "painted under AA on a demo page. The pages are not fixtures, so this is the only thing " +
      "measuring the classes the demo authors wrote for themselves",
  ).toEqual([]);

  // Down only: a recorded selector that no longer fails is deleted, not left
  // standing, or the list becomes a place where fixed things hide.
  const stale = [...RECORDED].filter((k) => !findings.some((f) => key(f) === k));
  expect(stale.sort(), "recorded as failing and no longer failing — delete the entry").toEqual([]);
});
