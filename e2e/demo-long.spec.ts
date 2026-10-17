import { test, expect, type Page } from "./_test";

/**
 * Every "Long labels" section shows what the component does with long text.
 *
 * The demo-scenarios contract proves from the AST that long text is there;
 * this measures what it does, at the desktop width and at a 360 px viewport:
 *
 *   - the page does not scroll sideways;
 *   - every label of 25 characters or more is either fully visible (wrapped,
 *     inside the example's box, or in a row that scrolls sideways, as Stepper
 *     and TabPanel document) or truncated with its full text available, in a
 *     `title` or a tooltip;
 *   - a control beside a long label keeps the size the same control has
 *     elsewhere on the page.
 *
 * Where the component visibly fails, the finding is named below with the
 * library slice that owes the fix, and the page says so in its line; the
 * scenario stays a gap until then. A finding not listed fails, and a listed
 * one that no longer happens fails as stale.
 */

const PAGES = [
  "accordion", "button", "checkbox", "date-picker", "international-phone-input", "radio-button",
  "resizable-panel", "stepper", "switch", "tab-panel", "time-picker", "toast",
];

/**
 * Findings the library owes, by page: the control that shrinks beside a long
 * label. Empty since L25 gave Checkbox's box and Switch's track `shrink-0`.
 */
const EXPECTED_FINDINGS: Record<string, { slice: string; what: RegExp }> = {};

interface Measure {
  pageOverflow: number;
  labels: number;
  hidden: string[];
  controls: string[];
}

/** Runs in the page: what the section's long labels and controls do. */
const measure = (page: Page, route: string) =>
  page.evaluate((route): Measure => {
    const heading = [...document.querySelectorAll("main section h2")].find((h) => h.textContent?.trim() === "Long labels");
    const section = heading!.closest("section")!;
    const box = section.querySelector(".rounded-cl-lg.border") ?? section;
    const wrap = box.getBoundingClientRect();
    const roots: Element[] = [section, ...(route === "toast" ? [document.querySelector('[aria-label="Notifications"]')!] : [])];
    const hidden: string[] = [];
    let labels = 0;
    for (const root of roots) {
      for (const el of root.querySelectorAll("*")) {
        const own = [...el.childNodes].filter((n) => n.nodeType === Node.TEXT_NODE).map((n) => n.textContent).join("").trim();
        if (own.length < 25 || el.closest("h2") || box.contains(el) === false && root === section) continue;
        const rect = el.getBoundingClientRect();
        if (rect.width <= 1 || rect.height <= 1) continue; // visually hidden: a live region
        labels += 1;
        const style = getComputedStyle(el);
        const clipped = el.scrollWidth > el.clientWidth + 1 && (/hidden|clip/.test(style.overflowX) || style.textOverflow === "ellipsis");
        const titled = !!el.closest("[title]") || !!el.closest("[aria-describedby]");
        // Inside a row that scrolls sideways (Stepper, TabPanel): reachable by scrolling.
        let scroller: Element | null = null;
        for (let n = el.parentElement; n && n !== box; n = n.parentElement) {
          if (/auto|scroll/.test(getComputedStyle(n).overflowX) && n.scrollWidth > n.clientWidth + 1) scroller = n;
        }
        const within = root !== section || scroller !== null || (rect.left >= wrap.left - 1 && rect.right <= wrap.right + 1);
        if ((clipped && !titled) || !within) {
          hidden.push(`"${own.slice(0, 40)}" ${clipped ? "is clipped with no title" : `lies at x ${Math.round(rect.left)}..${Math.round(rect.right)}, outside its box ${Math.round(wrap.left)}..${Math.round(wrap.right)}`}`);
        }
      }
    }
    // A control beside a long label, against the same control elsewhere on the page.
    const controlOf = (el: Element) => (el.matches("[role=switch]") ? el : el.parentElement!);
    const controls: string[] = [];
    for (const sel of ["input[type=checkbox]", "input[type=radio]", "[role=switch]"]) {
      const inside = [...section.querySelectorAll(sel)].map(controlOf);
      const reference = [...document.querySelectorAll(sel)].map(controlOf).find((c) => !section.contains(c) && c.getBoundingClientRect().width > 0);
      if (!inside.length || !reference) continue;
      const want = reference.getBoundingClientRect();
      for (const c of inside) {
        const got = c.getBoundingClientRect();
        if (got.width < want.width - 1 || got.height < want.height - 1) {
          controls.push(`the control narrows from ${Math.round(want.width)}px to ${got.width.toFixed(1)}px (${want.width.toFixed(1)} x ${want.height.toFixed(1)} elsewhere on the page)`);
        }
      }
    }
    return { pageOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth, labels, hidden, controls };
  }, route);

test("every Long labels section keeps long text visible or available", async ({ page }) => {
  test.setTimeout(240_000);
  const found = new Map<string, string[]>();
  let sections = 0;
  let ok = 0;
  const problems: string[] = [];

  for (const route of PAGES) {
    const seen: string[] = [];
    for (const width of [1280, 360]) {
      await page.setViewportSize({ width, height: 800 });
      await page.goto(`/${route}`, { waitUntil: "networkidle" });
      const section = page.locator("section").filter({ has: page.getByRole("heading", { name: "Long labels", exact: true }) });
      await expect(section, `${route}: no Long labels section`).toHaveCount(1);
      await section.scrollIntoViewIfNeeded();
      if (route === "toast") {
        await section.getByRole("button", { name: "Show a long toast" }).click();
        await expect(page.locator('[aria-label="Notifications"]').getByText(/Your export of 12,480 rows/)).toBeVisible();
      }
      const m = await measure(page, route);
      if (m.pageOverflow > 0) problems.push(`${route} @${width}: the page scrolls sideways by ${m.pageOverflow}px`);
      if (m.labels === 0) problems.push(`${route} @${width}: no long label measured`);
      for (const h of m.hidden) problems.push(`${route} @${width}: ${h}`);
      for (const c of m.controls) seen.push(c);
      console.log(`DEMO_LONG_SECTION /${route} @${width} labels=${m.labels} hidden=${m.hidden.length} page-overflow=${m.pageOverflow} controls=${m.controls.length ? m.controls.join("; ") : "kept"}`);
    }
    sections += 1;
    if (seen.length) found.set(route, seen);
    else if (!problems.some((p) => p.startsWith(`${route} `))) ok += 1;
  }

  const unlisted = [...found].filter(([route, f]) => !EXPECTED_FINDINGS[route] || !f.every((x) => EXPECTED_FINDINGS[route].what.test(x)));
  const stale = Object.keys(EXPECTED_FINDINGS).filter((route) => !found.has(route));
  for (const [route, f] of found) console.log(`DEMO_LONG_FINDING /${route} (${EXPECTED_FINDINGS[route]?.slice ?? "unlisted"}): ${f[0]}`);
  console.log(`DEMO_LONG sections ${sections}, ok ${ok}, findings ${found.size}`);
  expect(problems).toEqual([]);
  expect(unlisted.map(([route, f]) => `${route}: ${f.join("; ")}`), "a long label breaks a control and no slice owns it").toEqual([]);
  expect(stale, "a listed finding no longer happens: the library fixed it; flip the scenario and delete the entry").toEqual([]);
  expect(ok + found.size).toBe(sections);
});
