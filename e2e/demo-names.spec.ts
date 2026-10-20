import { test, expect } from "./_test";
import { EXEMPT, LATE_SECTIONS, demoPages, demoPreviewRoutes, demoRoutes, paintPending } from "./_demo-routes";

/**
 * No demo page renders a field with no accessible name.
 *
 * Every form control in the library calls `useAccessibleNameWarning`, which
 * warns in development once per instance mounted with no `label`, `aria-label`
 * or `aria-labelledby`. The warning worked; the pages ignored it. At 684ea8a1
 * /searchable-dropdown logged it 48 times, once for each of the 48 of its 60
 * dropdowns that passed none of the three, "Basic usage" first. A demo is the
 * code readers copy, so the page taught the unlabelled form.
 *
 * This loads every demo page and every phone-width preview, in its own frame,
 * and fails on any warning. The warning is read where it is logged: an init
 * script wraps `console.warn` in every frame and keeps, per frame, the
 * messages that are this hook's, by its fixed text. Only the main frame is
 * read, so a docs page's preview iframe, which loads lazily and so sometimes,
 * is counted once, on its own route.
 *
 * The floor comes from the page files, not the route walk: every
 * `src/pages/demo/*Demo.tsx` that is not the layout has a route scanned here.
 */

const ROUTES = [...demoRoutes(), ...demoPreviewRoutes()];
const NO_NAME = ": rendered with no accessible name.";
const READY_TIMEOUT_MS = 30_000;

/**
 * Whether the route has rendered its content. A docs page has its `<h1>` in
 * `<main>` once its chunk has rendered and the layout's Suspense fallback
 * (`.suspense-delayed`) is gone. A preview's `<h1>` is in its shell from the
 * start, and its example arrives behind a `fallback={null}` Suspense, so it is
 * ready once its `<main>` holds something besides that heading (React hoists
 * its `<meta>` to `<head>`, so that is not counted either way).
 */
const rendered = () => {
  const preview = document.querySelector("main[data-preview]");
  if (preview) return [...preview.children].some((c) => c.tagName !== "HEADER" && c.tagName !== "META");
  const main = document.querySelector("main");
  return !!main && !main.querySelector(".suspense-delayed") && !!main.querySelector("header h1")?.textContent?.trim();
};

const painted = new Function("section", `return (${paintPending})(section).length === 0;`) as (
  section: string | null,
) => boolean;

declare global {
  interface Window {
    __accessibleNameWarnings?: string[];
  }
}

// One test that walks 57 routes: a video of it is minutes long and shows
// nothing the per-route lines do not.
test.use({ video: "off" });

test("no demo page renders an unnamed field", async ({ page }) => {
  test.setTimeout(600_000);

  const pages = demoPages().filter((p) => !EXEMPT[p.file]);
  const floor = pages.length;
  const scannedPages = pages.filter((p) => p.routes.some((r) => ROUTES.includes(r)));

  await page.addInitScript((marker) => {
    const kept: string[] = [];
    window.__accessibleNameWarnings = kept;
    const warn = console.warn.bind(console);
    console.warn = (...args: unknown[]) => {
      if (typeof args[0] === "string" && args[0].includes(marker)) kept.push(args[0]);
      warn(...args);
    };
  }, NO_NAME);

  const perRoute: Array<{ route: string; byComponent: Record<string, number>; total: number }> = [];
  const notReady: string[] = [];

  for (const route of ROUTES) {
    await page.goto(`/${route}`, { waitUntil: "networkidle" });
    const section = LATE_SECTIONS[route] ?? null;
    const ready = await page
      .waitForFunction(rendered, null, { timeout: READY_TIMEOUT_MS })
      .then(() => page.waitForFunction(painted, section, { timeout: READY_TIMEOUT_MS }))
      .then(() => true)
      .catch(() => false);
    if (!ready) {
      notReady.push(`${route}: ${(await page.evaluate(paintPending, section)).join("; ") || "suspense fallback still up"}`);
      continue;
    }
    await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
    const warnings = await page.evaluate(() => [...(window.__accessibleNameWarnings ?? [])]);
    const byComponent: Record<string, number> = {};
    for (const w of warnings) {
      const name = w.slice(0, w.indexOf(NO_NAME));
      byComponent[name] = (byComponent[name] ?? 0) + 1;
    }
    perRoute.push({ route, byComponent, total: warnings.length });
  }

  const total = perRoute.reduce((n, r) => n + r.total, 0);
  const pagesRead = pages.filter((p) => p.routes.some((r) => perRoute.some((read) => read.route === r))).length;
  for (const r of perRoute.filter((p) => p.total > 0)) {
    console.log(
      `DEMO_NAMES_PAGE ${r.route} warnings=${r.total} ` +
        Object.entries(r.byComponent).map(([c, n]) => `${c}=${n}`).join(" "),
    );
  }
  console.log(
    `DEMO_NAMES routes=${ROUTES.length} read=${perRoute.length} pages=${pagesRead} floor=${floor} ` +
      `previews=${demoPreviewRoutes().length} warnings=${total} ` +
      `pages-warning=${perRoute.filter((p) => p.total > 0).length}`,
  );

  expect(notReady, "routes that never became ready, so were not read").toEqual([]);
  expect(
    pages.filter((p) => !scannedPages.includes(p)).map((p) => p.file),
    "demo page files no scanned route renders",
  ).toEqual([]);
  expect(pagesRead, "demo pages read, against the page files").toBeGreaterThanOrEqual(floor);
  expect(
    perRoute.filter((p) => p.total > 0).map((p) => `${p.route}: ${JSON.stringify(p.byComponent)}`),
    "demo pages that render a field with no accessible name — give it a label from the example's heading",
  ).toEqual([]);
});
