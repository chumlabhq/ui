import { test, expect } from "@playwright/test";
import { MEASURE_DOCUMENT, underFloor } from "./_contrast-measure";
import { EXEMPT, demoPages, demoRoutes, outsideDemo } from "./_demo-routes";

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
 * The total moves between runs — 41289 and 41429 on two runs of the same tree,
 * then 47727 and 47867 once the routes were complete. That was put down to the
 * dropdown pages' country lists; measured per page it is /table alone, whose
 * server-side example fetches its rows from dummyjson.com after the page
 * renders (see MEASURED_FLOOR). Findings are what this asserts on; `measured`
 * is held per page against MEASURED_FLOOR, which catches a page measured half
 * rendered, and in total against a floor for a scan that walks nothing.
 *
 * The pages come from `_demo-routes.ts`: every route nested inside the docs
 * layout in App.tsx, read from its JSX. A one-line regex read 33 of 37 and the
 * four it missed were measured by nothing. What is left out — the site pages,
 * the fixtures, the catch-all — is printed on every run.
 */
const ROUTES = demoRoutes();

/**
 * CPU throttle, for proving the wait rather than for the gate.
 *
 * `DEMO_CONTRAST_CPU_THROTTLE=6` runs every page at 6× CPU slowdown through
 * CDP. The scan used to measure 150ms after network idle, and at 6× that read
 * /table while its Suspense fallback was still up: 47 elements against 5343.
 * Throttling is how a loaded machine is reproduced on demand, so the wait below
 * is proven against it rather than against whatever the load happened to be.
 */
const CPU_THROTTLE = Number(process.env.DEMO_CONTRAST_CPU_THROTTLE ?? 1);

/**
 * How long a page has to become ready before it fails by name.
 *
 * At 6× CPU the slowest page readied in 7108ms (/table, 2026-10-07), and
 * unthrottled none took over 1121ms. 30s is four times the throttled worst, so
 * a busy machine still measures every page, and a page that never readies
 * fails in seconds rather than being measured early or hanging the run.
 */
const READY_TIMEOUT_MS = 30_000;

/**
 * Whether a page is ready to measure, and if not, why.
 *
 * Ready is two things.
 * - The route's Suspense fallback is gone and the page's own heading is in
 *   `<main>`. Every demo page opens with a `<header><h1>` — `DocsHero` on the
 *   component pages, the same markup written out on the seven guides — inside
 *   the layout's `<Suspense>`, so the heading exists only once the page's chunk
 *   has rendered. The fallback (`DemoPageFallback`) is the `.suspense-delayed`
 *   block standing in for it. Network idle says nothing about either: a lazy
 *   chunk finishes downloading and then spends seconds of CPU rendering with no
 *   request in flight.
 * - Every `[aria-expanded="true"]` element's `aria-controls` target exists and
 *   is visible. The heading alone was not enough: at 6× CPU the "Empty State"
 *   example on /multi-select-searchable-dropdown, which is `defaultOpen`, had
 *   not shown its menu yet and the page measured 705 against a floor of 707.
 *   An expanded element with no `aria-controls`, or one naming no element, is
 *   reported rather than skipped: there is no surface to wait on, so the page
 *   never becomes ready and fails by name.
 *
 * Self-contained, because it runs in the page. `final` returns the report even
 * when not ready, so a page that times out says which condition held it.
 */
const readiness = (final: boolean) => {
  const main = document.querySelector("main");
  const heading =
    !!main && !main.querySelector(".suspense-delayed") && !!main.querySelector("header h1")?.textContent?.trim();
  const visible = (el: Element) => {
    if (!el.getClientRects().length) return false;
    for (let n: Element | null = el; n; n = n.parentElement) {
      const style = getComputedStyle(n);
      if (style.display === "none" || style.visibility === "hidden" || parseFloat(style.opacity) === 0) return false;
    }
    return true;
  };
  const expanded = [...document.querySelectorAll('[aria-expanded="true"]')];
  const pending: string[] = [];
  for (const el of expanded) {
    const name = `<${el.tagName.toLowerCase()}> "${(el.getAttribute("aria-label") ?? el.textContent ?? "").trim().slice(0, 40)}"`;
    const ids = el.getAttribute("aria-controls")?.trim().split(/\s+/).filter(Boolean) ?? [];
    if (!ids.length) pending.push(`${name} is expanded with no aria-controls`);
    for (const id of ids) {
      const target = document.getElementById(id);
      if (!target) pending.push(`${name} aria-controls="${id}" resolves to nothing`);
      else if (!visible(target)) pending.push(`${name} controls #${id}, which is not visible`);
    }
  }
  const report = { heading, expanded: expanded.length, pending };
  return final || (heading && !pending.length) ? report : null;
};

/**
 * The fewest elements each page measures when it has rendered, per route.
 *
 * The lowest count either theme reached across three clean runs on 2026-10-07
 * (load 2.5-3.2, unthrottled), recorded as read. A page under its floor was
 * measured before it finished rendering, or lost content, and fails by name —
 * the scan's total cannot say which page went short, and a half-rendered
 * /table (47 elements, its Suspense fallback) sits inside the total's normal
 * movement.
 *
 * Every page read the same count in all three runs except /table: 5343 in
 * light every time and 5482/5342/5482 in dark. The 140 are its server-side
 * example's rows, fetched from dummyjson.com in an effect after the page
 * renders: on the first visit in a browser they land after the page is ready,
 * on later visits from cache before it, and at 6× CPU after it even from
 * cache. So /table's floor is the cold count, and those rows are the one piece
 * of late content on any page that neither the ready condition nor the floor
 * waits for.
 * That remote fetch, not the dropdown pages' country lists, is what moved the
 * total between runs: the five dropdown pages measured identically all three
 * times. Pages fed by remote APIs (dummyjson.com, the country list) will fail
 * here if those APIs are down, which is the scan saying it measured less.
 */
const MEASURED_FLOOR: Readonly<Record<string, number>> = {
  "introduction": 78,
  "getting-started": 107,
  "accessibility": 92,
  "guides/styling": 109,
  "guides/theming": 93,
  "guides/animation": 93,
  "guides/ai-llm": 86,
  // A2a, 947 -> 921: the API Reference lost the root onExpandedChange row and the
  // AccordionExpandEvent shape table with the prop (26 cells, measured HEAD vs now).
  "accordion": 921,
  "avatar": 1084,
  "breadcrumb": 514,
  "button": 445,
  "cascading-dropdown": 732,
  "checkbox": 411,
  "country-flag": 454,
  "date-picker": 975,
  "drawer": 418,
  "dropdown": 746,
  "input": 530,
  "international-phone-input": 946,
  // L11, 426 -> 425: the In Context "Processing" button is now disabled while
  // it loads, and an inactive control's label is exempt from 1.4.3.
  "loader": 425,
  "modal": 495,
  "multi-select-dropdown": 684,
  "multi-select-searchable-dropdown": 707,
  "otp-input": 433,
  "pagination": 634,
  "radio-button": 476,
  "resizable-panel": 359,
  "searchable-dropdown": 755,
  "slider": 545,
  "stepper": 682,
  "switch": 423,
  "tab-panel": 677,
  "table": 5342,
  "text-area": 504,
  "time-picker": 871,
  // A2a, 564 -> 562: the API Reference lost the onRemove row (4 cells) and the
  // rewritten onDismiss(id) description gained two `id` code spans.
  "toast": 562,
  // 426 -> 423, 2026-10-08: the three gradient-with-arrow examples were removed (an arrow cannot take a gradient).
  "tooltip": 423,
};

/**
 * Measured, recorded, not yet fixed — down only.
 *
 * The scan opened at 746 findings across 15 pages. Six class idioms and one
 * library palette accounted for 699 of them; these selectors are the tail,
 * and they are all real by the same rule the fixture sweep applies. They are
 * listed so the number cannot grow while they are worked through, and so that
 * "32 remaining" is a set someone can read rather than a total. T4 retired two
 * keys and four findings: Avatar's fallback initials took the accent token in
 * place of a hard-coded indigo (its dark key; the light key still covers the
 * page's red-on-red palette spans), and Table's footer band, a 50% text tint in
 * light only, became the subtle surface the dark theme already had.
 *
 * Roughly: one is a `::placeholder` (the fixture gate counts placeholders and
 * fails them too, and every fixture placeholder passes, so this is a demo input
 * specifically; T3 moved the Table and unstyled TimePicker placeholders to
 * --cl-text-tertiary and retired seven entries, 43 -> 36); the rest are single
 * semantic-token labels on light surfaces — the light-mode `--cl-warning` and `--cl-success`
 * are surface colours, not text colours, which is the same fact behind the
 * bulk fixes above.
 */
const RECORDED: ReadonlySet<string> = new Set([
  "avatar light span",
  "breadcrumb light span",
  "loader light div.flex.items-center",
  "resizable-panel light div.text-[10px].font-mono",
  "resizable-panel light div.text-xs.font-semibold",
  "slider dark div.flex.items-center",
  "stepper light span.text-sm.font-semibold",
  "tab-panel light div.text-xs.font-medium",
  "time-picker light input.flex-1.min-w-0::placeholder",
  // Same pair, renamed: white on the warning amber at 3.19:1. It was
  // `button.px-3.py-1.5` until the demo's triggers became `<Button>`, which puts
  // the label in the component's `itemText` span. The colours did not move.
  "toast light span.inline-flex.items-center",
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
      key: string; ratio: number; exact?: number; floor?: number; detail: string; unmeasurable?: boolean;
    }>;
    return rows.filter((r) => !r.unmeasurable && underFloor(r, r.floor ?? 4.5));
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

/**
 * The floor is decided on the unrounded ratio, in both directions.
 *
 * The lower pair is the one that shipped: `--cl-accent` text on `--cl-accent-bg`
 * over white, 4.4999:1, which every caller passed because it compared the
 * two-decimal `ratio` (4.50). The upper pair also rounds to 4.50 and sits just
 * over the floor, so a fix that over-corrected would fail it. Colours chosen by
 * computation; which side of the floor they fall on is MEASURE's answer.
 */
test("decides the text floor on the unrounded ratio, both directions", async ({ page }) => {
  await page.setContent(`
    <style>p { font: 16px sans-serif; background: rgba(37, 99, 235, 0.1); margin: 8px; }</style>
    <p class="plant-below" style="color: rgb(37, 99, 235)">below</p>
    <p class="plant-above" style="color: rgb(46, 98, 235)">above</p>`);
  const rows = (await page.evaluate(MEASURE_DOCUMENT)) as Array<{
    key: string; ratio: number; exact?: number; floor?: number; unmeasurable?: boolean;
  }>;
  const below = rows.find((r) => r.key === "p.plant-below");
  const above = rows.find((r) => r.key === "p.plant-above");
  expect(below?.ratio, "the lower pair should round to the floor, or it tests nothing").toBe(4.5);
  expect(above?.ratio, "the upper pair should round to the floor, or it tests nothing").toBe(4.5);
  expect(below && underFloor(below, 4.5), `4.4999:1 must fail: ${JSON.stringify(below)}`).toBe(true);
  expect(above && underFloor(above, 4.5), `4.5001:1 must pass: ${JSON.stringify(above)}`).toBe(false);
});

/**
 * Whether the page now measures `floor` elements, for the re-read to wait on.
 *
 * A function rather than the expression string: Playwright evaluates a string
 * predicate with `eval` inside the page, which the site's CSP refuses
 * (`script-src` has no 'unsafe-eval'). The refusal rejects the wait at
 * once, so the first planted delay read "re-read also short" instead of
 * naming the element.
 */
const measuresAtLeast = new Function(
  "floor",
  `return ${MEASURE_DOCUMENT}.filter((r) => !r.unmeasurable).length >= floor;`,
) as (floor: number) => boolean;

type Row = {
  key: string;
  text?: string;
  ratio: number;
  exact?: number;
  floor?: number;
  detail: string;
  unmeasurable?: boolean;
};

test("every demo page clears AA on the text it paints", async ({ page }) => {
  // Scaled with the throttle: the run is CPU-bound, 55s unthrottled, 2m at 6×.
  test.setTimeout(600_000 * CPU_THROTTLE);
  await page.setViewportSize({ width: 1280, height: 1200 });
  if (CPU_THROTTLE !== 1) {
    const cdp = await page.context().newCDPSession(page);
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: CPU_THROTTLE });
  }

  /**
   * Coverage, from a source the route walk does not read: the page files.
   * Every `src/pages/demo/*Demo.tsx` has a route this scan measures, or an
   * exemption in `_demo-routes.ts` that says why. Checked before anything is
   * measured, because a scan over the wrong pages has nothing to say.
   */
  const pages = demoPages();
  const uncovered = pages
    .filter((p) => !EXEMPT[p.file] && !p.routes.some((r) => ROUTES.includes(r)))
    .map((p) => `${p.file} (routes: ${p.routes.join(", ") || "none"})`);
  const staleExemptions = pages
    .filter((p) => EXEMPT[p.file] && p.routes.some((r) => ROUTES.includes(r)))
    .map((p) => p.file);
  const covered = pages.length - Object.keys(EXEMPT).length;
  console.log(
    `DEMO_CONTRAST_COVERAGE routes=${ROUTES.length} page-files=${pages.length} ` +
      `exempt=${Object.keys(EXEMPT).join(",")} pages-to-cover=${covered} uncovered=${uncovered.length}`,
  );
  console.log(
    `DEMO_CONTRAST_LEFT_OUT ${outsideDemo().map((o) => `${o.path} (${o.reason})`).join("; ")}`,
  );
  expect(uncovered, "demo pages no measured route renders — the route list missed them").toEqual([]);
  expect(staleExemptions, "exempt from coverage and measured anyway — delete the exemption").toEqual([]);

  const findings: Array<{ route: string; theme: string; key: string; ratio: number; detail: string }> = [];
  const short: Array<{ route: string; theme: string; measured: number; floor: number; named: string[] }> = [];

  /**
   * What a read under its floor was missing, by selector, text and paint.
   *
   * It never decides anything: the page has already failed its floor, and it
   * still fails whatever this finds. It reloads the page, waits for it to be
   * ready and then for it to measure its floor, inside the same
   * READY_TIMEOUT_MS, and names every element the re-read has that the short
   * read did not. /avatar read 1082 against 1084 once at 6× CPU and nothing
   * could say which two elements were absent.
   */
  const missingFrom = async (route: string, floor: number, shortRows: Row[]): Promise<string[]> => {
    await page.goto(`/${route}`, { waitUntil: "networkidle" });
    const deadline = Date.now() + READY_TIMEOUT_MS;
    const left = () => ({ timeout: Math.max(1, deadline - Date.now()) });
    const reached = await page
      .waitForFunction(readiness, false, left())
      .then(() =>
        page.waitForFunction(measuresAtLeast, floor, left()),
      )
      .then(() => true, () => false);
    const again = ((await page.evaluate(MEASURE_DOCUMENT)) as Row[]).filter((r) => !r.unmeasurable);
    if (!reached || again.length < floor) {
      return [`re-read also short: ${again.length}/${floor}, missing elements unnamed`];
    }
    const id = (r: Row) => `${r.key} "${r.text ?? ""}" ${r.detail}`;
    const unmatched = new Map<string, number>();
    for (const r of shortRows) if (!r.unmeasurable) unmatched.set(id(r), (unmatched.get(id(r)) ?? 0) + 1);
    const missing: string[] = [];
    for (const r of again) {
      const n = unmatched.get(id(r)) ?? 0;
      if (n > 0) unmatched.set(id(r), n - 1);
      else missing.push(id(r));
    }
    return [`${missing.length} named`, ...missing];
  };
  const notReady: string[] = [];
  const perPage: Array<{ route: string; theme: string; measured: number; readyMs: number; expanded: number }> = [];
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
      const started = Date.now();
      await page.goto(`/${route}`, { waitUntil: "networkidle" });
      const ready = await page
        .waitForFunction(readiness, false, { timeout: READY_TIMEOUT_MS })
        .then((handle) => handle.jsonValue() as Promise<{ expanded: number }>, () => null);
      const readyMs = Date.now() - started;
      if (!ready) {
        const report = await page.evaluate(readiness, true);
        const why = [
          ...(report?.heading ? [] : ["no page heading in <main>, or the Suspense fallback still up"]),
          ...(report?.pending ?? []),
        ];
        notReady.push(`${route} (${theme}) not ready after ${READY_TIMEOUT_MS}ms: ${why.join("; ")}`);
        continue;
      }
      const rows = (await page.evaluate(MEASURE_DOCUMENT)) as Row[];
      let onPage = 0;
      for (const row of rows) {
        if (row.unmeasurable) continue;
        onPage += 1;
        if (underFloor(row, row.floor ?? 4.5)) findings.push({ route, theme, ...row });
      }
      measured += onPage;
      perPage.push({ route, theme, measured: onPage, readyMs, expanded: ready.expanded });
      const floor = MEASURED_FLOOR[route];
      if (floor !== undefined && onPage < floor) {
        short.push({ route, theme, measured: onPage, floor, named: await missingFrom(route, floor, rows) });
      }
    }
  }

  console.log(
    `DEMO_CONTRAST pages=${ROUTES.length} measured=${measured} findings=${findings.length} ` +
      `| page-files=${pages.length} exempt=${Object.keys(EXEMPT).length} covered=${covered - uncovered.length}/${covered}` +
      (CPU_THROTTLE !== 1 ? ` cpu-throttle=${CPU_THROTTLE}x` : ""),
  );
  for (const p of perPage) {
    console.log(
      `DEMO_CONTRAST_PAGE ${p.route} ${p.theme} measured=${p.measured} ` +
        `expanded-waited=${p.expanded} ready=${p.readyMs}ms`,
    );
  }
  for (const f of findings.slice(0, 1200)) {
    console.log(`DEMO_CONTRAST_FINDING ${f.route} ${f.theme} ${f.ratio} ${f.key} :: ${f.detail}`);
  }

  expect(notReady, "pages that never became ready, so were not measured").toEqual([]);

  for (const s of short) {
    console.log(`DEMO_CONTRAST_SHORT ${s.route} ${s.theme} measured=${s.measured} floor=${s.floor} — ${s.named[0]}`);
    for (const m of s.named.slice(1)) console.log(`DEMO_CONTRAST_MISSING ${s.route} ${s.theme} ${m}`);
  }
  expect(
    short.map((s) => `${s.route} (${s.theme}): measured ${s.measured}, floor ${s.floor}; ${s.named.join(" | ")}`),
    "pages measured under their floor — rendered partly, or lost content",
  ).toEqual([]);
  expect(
    ROUTES.filter((r) => MEASURED_FLOOR[r] === undefined),
    "routes with no recorded floor — record the count a clean run reads",
  ).toEqual([]);
  expect(
    Object.keys(MEASURED_FLOOR).filter((r) => !ROUTES.includes(r)),
    "floors recorded for routes the scan no longer has — delete them",
  ).toEqual([]);
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
