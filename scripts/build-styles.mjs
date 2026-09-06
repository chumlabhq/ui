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
import postcss from "postcss";

const MARKER = "cl-s";

/** Splits a selector list on commas that are not inside (), [] or escaped. */
const splitTop = (sel) => {
  const out = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < sel.length; i++) {
    const c = sel[i];
    if (c === "\\") { i++; continue; }
    if (c === "(" || c === "[") depth++;
    else if (c === ")" || c === "]") depth--;
    else if (c === "," && depth === 0) { out.push(sel.slice(start, i)); start = i + 1; }
  }
  out.push(sel.slice(start));
  return out;
};

/**
 * The marker goes on the compound that carries the utility class, NOT on the
 * selector's subject. `.space-y-4 > :not([hidden]) ~ :not([hidden])` styles the
 * CHILDREN of the element with the class, and those children are often passed in
 * by the consumer, so they carry no marker - scoping the subject would silently
 * drop spacing between them. The element holding `space-y-4` is always ours.
 */
const scopeOne = (raw) => {
  const sel = raw.trim();
  if (!sel) return raw;

  let depth = 0;
  let end = sel.length;
  let pseudoElement = -1;
  for (let i = 0; i < sel.length; i++) {
    const c = sel[i];
    if (c === "\\") { i++; continue; }
    if (c === "(" || c === "[") depth++;
    else if (c === ")" || c === "]") depth--;
    else if (depth === 0) {
      if (c === ":" && sel[i + 1] === ":" && pseudoElement === -1) pseudoElement = i;
      else if (c === " " || c === ">" || c === "+" || c === "~") { end = i; break; }
    }
  }

  const compound = sel.slice(0, end);
  // Nothing to anchor to (a bare `*` or a pseudo-element rule) - leave it alone
  // rather than guess, and let the caller report it.
  if (!/(^|[^\\])\./.test(compound)) return null;

  const at = pseudoElement !== -1 && pseudoElement < end ? pseudoElement : end;
  return `${sel.slice(0, at)}:where(.${MARKER})${sel.slice(at)}`;
};

/** Confines every utility rule to elements the library itself rendered. */
const scopeUtilities = (css) => {
  const root = postcss.parse(css);
  let scoped = 0;
  const skipped = [];
  root.walkAtRules("layer", (layer) => {
    if (!/^utilities\b/.test(layer.params)) return;
    layer.walkRules((rule) => {
      // A nested rule (`&::placeholder`, `:where(& > :not(:last-child))`) is
      // already confined by the ancestor that carries the utility class.
      if (rule.parent?.type === "rule") return;
      const parts = splitTop(rule.selector).map((p) => {
        const s = scopeOne(p);
        if (s === null) { skipped.push(p.trim()); return p; }
        scoped++;
        return s;
      });
      rule.selector = parts.join(", ");
    });
  });
  return { css: root.toString(), scoped, skipped };
};

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = resolve(root, "dist");
const TOKENS = resolve(root, "src/styles/tokens.css");
const OUT = resolve(DIST, "styles.css");

const tokens = readFileSync(TOKENS, "utf8");

// theme + utilities only - no preflight. The tokens are inlined rather than
// @import-ed so the @theme block resolves in this same compilation.
// The `dark:` variant must mirror the TOKEN logic exactly, or the two disagree
// and the result is unreadable. Tokens are dark on bare :root and flip only on
// .light / [data-theme="light"], so the variant is written the same way: dark
// applies unless the consumer has explicitly opted into light.
//
// Tailwind's default `dark:` is @media (prefers-color-scheme), which ignores the
// consumer's choice entirely - on a light-mode OS that rendered near-white text
// on a white surface (1.15:1). This is the fix for that.
const input = `
@layer theme, components, utilities;
@import "tailwindcss/theme.css" layer(theme);
@import "tailwindcss/utilities.css" layer(utilities);

@custom-variant dark (&:where(:root:not(.light):not([data-theme="light"]), :root:not(.light):not([data-theme="light"]) *));

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
const { css: confined, scoped, skipped } = scopeUtilities(css);
const compiled = optimize(confined, { minify: false }).code;

// Cascade-layer order is fixed by the first declaration the browser sees, and
// the compiler does not re-emit the statement form - it only emits the blocks
// it actually fills. That left our order as properties/theme/components/
// utilities with no `base`, so when a consumer's own Tailwind introduced `base`
// it counted as a NEW layer and sorted AFTER ours: their preflight's
// `button { padding: 0 }` beat our `.px-4`, flattening every component to zero
// padding and square corners. Declaring the full order up front - including the
// `base` slot we deliberately leave empty - keeps their reset where it belongs.
// `chumlab.tokens` first, and declared here as well as in tokens.css: this file
// inlines the token source rather than importing it, so the browser's first
// sight of the name has to be this statement or the order is whatever the
// compiler emitted. Its position in the list is not what makes a consumer's
// override win — an unlayered rule beats every layer — but a declared order is
// the difference between a deterministic cascade and an accident.
const out = `@layer chumlab.tokens, properties, theme, base, components, utilities;\n${compiled}`;

writeFileSync(OUT, out);

const rules = (out.match(/^\s*\.[a-zA-Z0-9\\:._/[\]-]+(?::where\(\.cl-s\))?[^{]*\{/gm) || []).length;
const preflighted = /\b(?:\*|::before|html|body)\s*,?\s*\{/.test(out.slice(0, 2000));

console.log(
  `✓ styles.css: ${candidates.length} candidates scanned, ${rules} rules, ${(out.length / 1024).toFixed(1)}kb`,
);
console.log(`✓ ${scoped} utility selectors confined to .${MARKER}`);
if (skipped.length) {
  console.warn(
    `  ! ${skipped.length} selector(s) left unscoped - they can still match consumer markup: ${skipped.slice(0, 5).join(", ")}`,
  );
}
if (preflighted) console.warn("  ! output looks like it contains a base reset - check preflight exclusion");
