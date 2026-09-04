#!/usr/bin/env node
/**
 * Snapshots the computed colour of every element of every fixture, in both
 * themes, so a change can be proven not to alter the render.
 *
 * Written for the `dark:` retirement. Group A is the variants whose base class
 * is the same token — `text-cl-text dark:text-cl-text` — which look like
 * obvious no-ops and mostly are. The exception is real: Tailwind emits variants
 * in a fixed order, and `.dark .text-cl-text` and `.hover\:text-cl-accent:hover`
 * have equal specificity, so a `dark:` duplicate sitting after a `hover:` rule
 * suppresses that hover in dark mode. Deleting it would then change the render
 * — arguably fixing it, but not silently.
 *
 * Reading the class strings cannot answer that. Rendering can, so this reads
 * the browser's own answer before and after.
 *
 * Scope is the colour properties, which is what group A's utilities set:
 * 111 `text-*`, 27 `border-*`, 4 `ring-*`, 2 `bg-*`, and one each of
 * `stroke-*` and `fill-*`, counted from the source.
 *
 *   node scripts/capture-theme-styles.mjs before.json
 *   ...make the change...
 *   node scripts/capture-theme-styles.mjs after.json --compare before.json
 */
import { chromium } from "@playwright/test";
import { writeFileSync, readFileSync } from "node:fs";

const BASE = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:5173";

/** Everything a colour utility can land on. */
const PROPS = [
  "color",
  "backgroundColor",
  "borderTopColor",
  "borderRightColor",
  "borderBottomColor",
  "borderLeftColor",
  "outlineColor",
  "textDecorationColor",
  "caretColor",
  "fill",
  "stroke",
  "boxShadow",
  "opacity",
];

const out = process.argv[2];
const compareTo = process.argv.includes("--compare")
  ? process.argv[process.argv.indexOf("--compare") + 1]
  : null;

if (!out) {
  process.stderr.write("usage: capture-theme-styles.mjs <out.json> [--compare <baseline.json>]\n");
  process.exit(2);
}

const browser = await chromium.launch();
const page = await browser.newPage();

await page.goto(`${BASE}/__fixtures`, { waitUntil: "domcontentloaded" });
// The index is client-rendered, so domcontentloaded is well before the list.
await page.locator("[data-fixture-index] a").first().waitFor({ timeout: 30000 });
const paths = await page
  .locator("[data-fixture-index] a")
  .evaluateAll((links) => links.map((a) => a.getAttribute("href") ?? ""));

if (paths.length === 0) {
  process.stderr.write("the fixture index listed nothing — is the dev server up?\n");
  await browser.close();
  process.exit(2);
}

/**
 * One fixture, both themes. The theme is flipped in the page rather than by
 * reloading: the same DOM answers both questions, so an element cannot drift
 * between the two snapshots and read as a difference.
 */
const snapshot = async (props) =>
  page.evaluate((properties) => {
    const root = document.querySelector("[data-fixture]");
    if (!root) return null;
    // The class list travels with the reading. A token revaluation moves
    // pixels by design, and the only question that matters afterwards is
    // whether each moved element asked for it — which is a question about the
    // classes it carries, so the answer has to be recorded alongside.
    const read = () =>
      [...root.querySelectorAll("*")].map((el) => ({
        style: properties.map((p) => getComputedStyle(el)[p]).join("|"),
        cls: typeof el.className === "string" ? el.className : String(el.getAttribute("class") ?? ""),
        tag: el.tagName.toLowerCase(),
      }));

    // Animation is frozen for the read, identically in both captures. Shimmer
    // runs `animate-pulse` forever, so its opacity is whatever frame the
    // snapshot lands on — the first comparison reported a hundred differences
    // that were nothing but two captures sampling the pulse at different
    // moments. Disabling animation and transition makes every element report
    // its settled value.
    const freeze = document.createElement("style");
    freeze.textContent = "*,*::before,*::after{animation:none!important;transition:none!important}";
    document.head.appendChild(freeze);

    // Both switches, together. The `--cl-*` tokens are declared under
    // `:root[data-theme="dark"|"light"]` while Tailwind's `dark:` variant is
    // `&:where(.dark, .dark *)` — two independent mechanisms. Flipping only the
    // class changes which utilities apply while leaving every token at its dark
    // value, which is a hybrid no user ever sees.
    const html = document.documentElement;
    const originalClass = html.className;
    const originalTheme = html.getAttribute("data-theme");

    html.classList.add("dark");
    html.setAttribute("data-theme", "dark");
    const dark = read();

    html.classList.remove("dark");
    html.setAttribute("data-theme", "light");
    const light = read();

    html.className = originalClass;
    if (originalTheme === null) html.removeAttribute("data-theme");
    else html.setAttribute("data-theme", originalTheme);
    freeze.remove();
    return { dark, light };
  }, props);

const results = {};
let captured = 0;

for (const path of paths) {
  await page.goto(`${BASE}${path}`, { waitUntil: "domcontentloaded" });
  await page.locator("[data-fixture]").waitFor({ state: "attached", timeout: 15000 }).catch(() => {});
  // Let any open transition land, so a mid-animation colour is not recorded.
  await page.waitForTimeout(120);
  const shot = await snapshot(PROPS);
  if (shot) {
    results[path] = shot;
    captured += 1;
  }
}

await browser.close();

writeFileSync(out, `${JSON.stringify({ props: PROPS, fixtures: results }, null, 2)}\n`, "utf8");
process.stdout.write(`captured ${captured} fixtures x 2 themes -> ${out}\n`);

if (!compareTo) process.exit(0);

const before = JSON.parse(readFileSync(compareTo, "utf8"));
const differences = [];

const keys = new Set([...Object.keys(before.fixtures), ...Object.keys(results)]);
for (const key of keys) {
  const a = before.fixtures[key];
  const b = results[key];
  if (!a || !b) {
    differences.push(`${key}: present in only one capture`);
    continue;
  }
  for (const theme of ["dark", "light"]) {
    if (a[theme].length !== b[theme].length) {
      differences.push(`${key} [${theme}]: element count ${a[theme].length} -> ${b[theme].length}`);
      continue;
    }
    for (let i = 0; i < a[theme].length; i++) {
      const before = typeof a[theme][i] === "string" ? a[theme][i] : a[theme][i].style;
      const after = typeof b[theme][i] === "string" ? b[theme][i] : b[theme][i].style;
      if (before !== after) {
        differences.push(`${key} [${theme}] element ${i}: ${before} -> ${after}`);
      }
    }
  }
}

if (differences.length === 0) {
  process.stdout.write(
    `\nIDENTICAL: ${keys.size} fixtures, both themes, ${PROPS.length} colour properties per element.\n`,
  );
  process.exit(0);
}

process.stdout.write(`\nDIFFERENCES: ${differences.length}\n`);
for (const d of differences.slice(0, 40)) process.stdout.write(`  ${d}\n`);
if (differences.length > 40) process.stdout.write(`  ...and ${differences.length - 40} more\n`);
process.exit(1);
