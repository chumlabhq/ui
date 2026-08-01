/**
 * Compiles dist/styles.css - the precompiled stylesheet a consumer imports to
 * get working layout WITHOUT installing Tailwind.
 *
 * The components position everything with Tailwind utility classes
 * (`flex items-center justify-between` on a dropdown option row, and ~700 more).
 * Those class names ship as strings inside the JS; the rules that give them
 * meaning do not exist unless someone runs Tailwind. Shipping only the design
 * tokens left every flex row rendering as `display: block` - which is what put
 * a dropdown's selected tick against its label instead of at the right edge.
 *
 * So: scan the built dist for the classes the components actually reference,
 * generate exactly those rules, and ship them.
 *
 * PREFLIGHT IS DELIBERATELY EXCLUDED. Tailwind's base reset restyles the host
 * page's headings, lists and form controls; a component library that silently
 * did that to its consumer would be a worse bug than the one this fixes. Only
 * `theme` and `utilities` layers are emitted.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { compile, optimize } from "@tailwindcss/node";
import { Scanner } from "@tailwindcss/oxide";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = resolve(root, "dist");
const TOKENS = resolve(root, "src/styles/tokens.css");
const OUT = resolve(DIST, "styles.css");

const tokens = readFileSync(TOKENS, "utf8");

// theme + utilities only - no preflight. The tokens are inlined rather than
// @import-ed so the @theme block resolves in this same compilation.
const input = `
@layer theme, components, utilities;
@import "tailwindcss/theme.css" layer(theme);
@import "tailwindcss/utilities.css" layer(utilities);

${tokens}
`;

const compiler = await compile(input, { base: root, onDependency: () => {} });

// The candidate list comes from the BUILT output, so it reflects exactly what
// consumers receive - including classes only reachable through shared chunks.
const scanner = new Scanner({
  sources: [{ base: DIST, pattern: "**/*.{js,cjs}", negated: false }],
});
const candidates = scanner.scan();

const css = compiler.build(candidates);
const out = optimize(css, { minify: false }).code;

writeFileSync(OUT, out);

const rules = (out.match(/^\s*\.[a-zA-Z0-9\\:._-]+\s*\{/gm) || []).length;
const preflighted = /\b(?:\*|::before|html|body)\s*,?\s*\{/.test(out.slice(0, 2000));

console.log(
  `✓ styles.css: ${candidates.length} candidates scanned, ${rules} rules, ${(out.length / 1024).toFixed(1)}kb`,
);
if (preflighted) console.warn("  ! output looks like it contains a base reset - check preflight exclusion");
