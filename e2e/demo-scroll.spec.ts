import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { expect, test } from "@playwright/test";

/**
 * A demo page lands at the top.
 *
 * `/date-picker` did not. Its "Default Open" section passed `defaultOpen`, the
 * calendar opened on mount, DatePicker focused a day cell inside it — correct
 * behaviour for a modal surface, and the focus contracts depend on it — and
 * focusing an element 7,897px down scrolled the document to it. The reader
 * landed two thirds down the page at a calendar they had not touched.
 *
 * Nothing could have caught it. The section was doing exactly what its heading
 * claimed, the component was doing exactly what its contracts require, and the
 * defect existed only in their combination on a long page. That is what makes
 * it a page-level assertion rather than a library one: one number per page,
 * asserted after everything has settled.
 */
const ROUTES = (() => {
  const app = readFileSync(resolve(process.cwd(), "src/App.tsx"), "utf8");
  const demoBlock = app.slice(app.indexOf("<Route element={<Demo />}>"));
  return [...demoBlock.matchAll(/path="([^"]+)"/g)]
    .map((m) => m[1])
    .filter((p) => !p.startsWith("/") && !p.includes(":"));
})();

test("every demo page lands at the top", async ({ page }) => {
  test.setTimeout(900_000);

  // A route list that collapsed to nothing would pass silently.
  expect(ROUTES.length, "no demo routes were derived from App.tsx").toBeGreaterThan(20);

  const scrolled: string[] = [];
  for (const route of ROUTES) {
    await page.goto(`/${route}`, { waitUntil: "domcontentloaded" });
    await page.locator("main, [data-demo-root], h1").first().waitFor({ state: "attached", timeout: 20000 }).catch(() => {});
    // Long enough for a mount effect that focuses something to have run and
    // for the browser to have scrolled to it; the DatePicker case settled and
    // stayed there rather than bouncing back.
    await page.waitForTimeout(900);
    const y = await page.evaluate(() => Math.round(window.scrollY));
    if (y > 0) scrolled.push(`${route} (y=${y})`);
  }

  console.log(`DEMO_SCROLL routes=${ROUTES.length} scrolled=${scrolled.length}`);
  expect(
    scrolled,
    "these demo pages land scrolled — something on mount moved the document, " +
      "and a reader arriving at the page starts part-way down it",
  ).toEqual([]);
});
