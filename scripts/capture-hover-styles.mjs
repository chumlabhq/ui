#!/usr/bin/env node
/**
 * Snapshots the *hovered* colour of every element carrying a `hover:` colour
 * utility, in both themes.
 *
 * `capture-theme-styles.mjs` reads the resting state, which leaves a whole
 * class of change unmeasured: 37 of the 85 `dark:` collapses in ADR 004 target
 * `--cl-bg-hover` and 28 of those are `hover:`-scoped, so only 6 of the 85 ever
 * showed as moved elements there.
 *
 * The state is forced through CDP rather than by moving a real mouse.
 * `locator.hover()` fails on anything scrolled out of view or covered by
 * another element, so the elements hardest to reach would be exactly the ones
 * silently dropped from the measurement — and the remainder reported as clean.
 *
 *   node scripts/capture-hover-styles.mjs out.json
 */
import { chromium } from "@playwright/test";
import { writeFileSync } from "node:fs";

const BASE = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:5173";
const out = process.argv[2];
if (!out) {
  process.stderr.write("usage: capture-hover-styles.mjs <out.json>\n");
  process.exit(2);
}

const PROPS = ["backgroundColor", "color", "borderTopColor"];
const HOVER_UTILITY = /(^|\s)(dark:)?hover:(bg|text|border)-/;

const browser = await chromium.launch();
const page = await browser.newPage();
const cdp = await page.context().newCDPSession(page);
await cdp.send("DOM.enable");
await cdp.send("CSS.enable");

await page.goto(`${BASE}/__fixtures`, { waitUntil: "domcontentloaded" });
await page.locator("[data-fixture-index] a").first().waitFor({ timeout: 30000 });
const paths = await page
  .locator("[data-fixture-index] a")
  .evaluateAll((links) => links.map((a) => a.getAttribute("href") ?? ""));

/** Reads one probe under a forced :hover, then clears the force. */
async function readHovered(index, props) {
  const { result } = await cdp.send("Runtime.evaluate", {
    expression: `document.querySelector('[data-hover-probe="${index}"]')`,
  });
  if (!result.objectId) return null;
  const { nodeId } = await cdp.send("DOM.requestNode", { objectId: result.objectId });
  if (!nodeId) return null;

  await cdp.send("CSS.forcePseudoState", { nodeId, forcedPseudoClasses: ["hover"] });
  const { result: read } = await cdp.send("Runtime.callFunctionOn", {
    objectId: result.objectId,
    functionDeclaration: `function (props) {
      const cs = getComputedStyle(this);
      return JSON.stringify({
        style: props.map((p) => cs[p]).join("|"),
        cls: typeof this.className === "string" ? this.className : String(this.getAttribute("class") ?? ""),
        tag: this.tagName.toLowerCase(),
      });
    }`,
    arguments: [{ value: props }],
    returnByValue: true,
  });
  await cdp.send("CSS.forcePseudoState", { nodeId, forcedPseudoClasses: [] });
  return JSON.parse(read.value);
}

const results = {};
const unreachable = [];
let measured = 0;

for (const path of paths) {
  await page.goto(`${BASE}${path}`, { waitUntil: "domcontentloaded" });
  await page.locator("[data-fixture]").waitFor({ state: "attached", timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(80);

  const marked = await page.evaluate((pattern) => {
    const root = document.querySelector("[data-fixture]");
    if (!root) return 0;
    const re = new RegExp(pattern);
    let n = 0;
    for (const el of root.querySelectorAll("*")) {
      const cls = typeof el.className === "string" ? el.className : String(el.getAttribute("class") ?? "");
      if (re.test(cls)) {
        el.setAttribute("data-hover-probe", String(n));
        n += 1;
      }
    }
    const freeze = document.createElement("style");
    freeze.textContent = "*,*::before,*::after{animation:none!important;transition:none!important}";
    document.head.appendChild(freeze);
    return n;
  }, HOVER_UTILITY.source);
  if (!marked) continue;

  // CDP's node map is empty until the document is requested for this
  // navigation; without it every `DOM.requestNode` returns nodeId 0 and every
  // probe reads as unreachable.
  await cdp.send("DOM.getDocument", { depth: -1 });

  const perTheme = {};
  for (const theme of ["dark", "light"]) {
    await page.evaluate((t) => {
      const h = document.documentElement;
      h.setAttribute("data-theme", t);
      h.classList.toggle("dark", t === "dark");
    }, theme);

    const rows = [];
    for (let i = 0; i < marked; i += 1) {
      const row = await readHovered(i, PROPS);
      if (row) rows.push(row);
      else unreachable.push(`${path} probe ${i} [${theme}]`);
    }
    perTheme[theme] = rows;
  }
  results[path] = perTheme;
  measured += marked;
}

await browser.close();
writeFileSync(out, JSON.stringify({ props: PROPS, fixtures: results, unreachable }, null, 2));
process.stdout.write(
  `hovered ${measured} elements across ${Object.keys(results).length} fixtures -> ${out}\n`,
);
if (unreachable.length) {
  process.stdout.write(`UNREACHABLE probes: ${unreachable.length}\n`);
  for (const u of unreachable.slice(0, 10)) process.stdout.write(`  ${u}\n`);
}
