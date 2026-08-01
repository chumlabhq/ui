/**
 * Guarantees the precompiled stylesheet actually carries the structural layout
 * the components depend on.
 *
 * This exists because of a real failure: the package once shipped design tokens
 * only, so every `flex` row in every component computed to `display: block` in a
 * consumer without Tailwind. The visible symptom was a dropdown's selected tick
 * sitting against its label instead of at the right edge of the row.
 *
 * A token-only stylesheet passes every other check in this repo - it imports,
 * it resolves, it has valid CSS. Only asserting the RULES are present catches
 * the regression.
 */
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = resolve(root, "dist");
const STYLES = join(DIST, "styles.css");
const TOKENS = join(DIST, "tokens.css");

const fail = (msg) => {
  console.error(`✗ ${msg}`);
  process.exitCode = 1;
};

for (const f of [STYLES, TOKENS]) {
  if (!existsSync(f)) {
    fail(`${f} is missing - the build did not emit it`);
    process.exit(1);
  }
}

const css = readFileSync(STYLES, "utf8");
const hasRule = (cls) => new RegExp(`^\\s*\\.${cls}\\s*\\{`, "m").test(css);

// The exact mechanism that puts a selected tick inline and right-aligned.
const TICK_LAYOUT = ["flex", "items-center", "justify-between"];
for (const cls of TICK_LAYOUT) {
  if (!hasRule(cls)) fail(`.${cls} has no rule - selectable rows will stack instead of sitting inline`);
}
if (!/\.flex\s*\{\s*display:\s*flex/.test(css)) fail(".flex does not declare display:flex");

// Structural utilities the rest of the library positions with.
for (const cls of ["inline-flex", "shrink-0", "w-full", "absolute", "relative", "flex-1", "truncate"]) {
  if (!hasRule(cls)) fail(`.${cls} has no rule`);
}

// Preflight would restyle the CONSUMER's headings, lists and form controls.
// Shipping it would be a worse bug than the one this file guards.
if (/box-sizing:\s*border-box/.test(css) && /^\s*\*,\s*::after/m.test(css)) {
  fail("preflight leaked into styles.css - it would reset the consumer's page");
}

// The stylesheet is useless without the values its utilities reference.
if (!/--cl-accent:/.test(css)) fail("design tokens are missing from styles.css");

// Every layout class the built components actually reference must resolve.
const LAYOUT = /\b(flex|inline-flex|grid|items-(?:center|start|end)|justify-(?:between|center|end)|ml-auto|shrink-0|flex-1)\b/g;
const referenced = new Set();
const walk = (dir) => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith(".js")) {
      for (const m of readFileSync(p, "utf8").matchAll(LAYOUT)) referenced.add(m[0]);
    }
  }
};
walk(DIST);

const unresolved = [...referenced].filter((c) => !hasRule(c));
if (unresolved.length) fail(`referenced by components but absent from styles.css: ${unresolved.join(", ")}`);

if (process.exitCode) {
  console.error("styles bundle guarantee FAILED");
  process.exit(1);
}

const rules = (css.match(/^\s*\.[a-zA-Z0-9\\:._-]+\s*\{/gm) || []).length;
console.log(`✓ styles.css carries ${rules} rules incl. the flex/align set the tick depends on`);
console.log(`✓ ${referenced.size} distinct layout classes referenced by components all resolve`);
console.log("✓ no preflight - the consumer's own page styling is untouched");
console.log("styles bundle guarantee OK");
