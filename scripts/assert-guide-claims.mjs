// The guide pages have to describe the library that exists.
//
// The seven guide pages are prose, so nothing typechecked them. They drifted:
// three component names that were never exported (`MultiSelect`, `Cascading`,
// `OTPInput`), two components missing from the catalogue, a "30+" where the
// number is 30, a WCAG level the README had already been corrected away from,
// a manual screen-reader sweep that RELEASE-READINESS.md says has never once
// happened, and an `animation="none"` prop no component has ever had.
//
// Every one of those is a claim with a source in this repo. This checks the
// ones that are: names against the real exports, subpaths against
// `package.json`, prop assignments against the real prop names, the WCAG level
// against ACCESSIBILITY.md, and the component count against the export list.
//
// What it cannot check is in `docs/guide-claims-ungated.md` with a reason each.
//
//   node scripts/assert-guide-claims.mjs
//   node scripts/assert-guide-claims.mjs --self-check
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const GUIDES = ["Accessibility", "AiLlm", "Animation", "GettingStarted", "Introduction", "Styling", "Theming"];
const SELF_CHECK = process.argv.includes("--self-check");

const read = (f) => readFileSync(join(root, f), "utf8");
const decode = (s) =>
  s
    .replace(/&quot;/g, '"').replace(/&rsquo;/g, "’").replace(/&lsquo;/g, "‘")
    .replace(/&mdash;/g, "—").replace(/&ndash;/g, "–").replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");

/**
 * Prose and inline `<code>` kept apart.
 *
 * A claim in running text ("Modal, Drawer, Tooltip") is a name; a claim inside
 * inline code is an API surface, and `animation="none"` only reads as a prop
 * assignment because of the tag it sits in. Fenced CodeBlock snippets are
 * excluded deliberately — they are passed as a `code` string prop rather than
 * as JSX children, so they never reach this walker, and they are covered by
 * the demo-snippet typecheck instead.
 */
const extract = (file) => {
  const src = read(file);
  const sf = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const prose = [];
  const code = [];
  const visit = (n, inCode) => {
    let here = inCode;
    if (ts.isJsxElement(n)) {
      const tag = n.openingElement.tagName.getText(sf);
      if (tag === "code") here = true;
    }
    if (ts.isJsxText(n)) {
      const t = decode(n.getText(sf)).trim();
      if (t) (here ? code : prose).push(t);
    }
    // Section's `title` and `description` are prose too, and a good deal of
    // each page's claims live there rather than in children.
    if (ts.isJsxAttribute(n) && /^(title|description|label)$/.test(n.name.getText(sf))) {
      const v = n.initializer;
      if (v && ts.isStringLiteral(v)) prose.push(decode(v.text));
    }
    ts.forEachChild(n, (c) => visit(c, here));
  };
  visit(sf, false);
  return { prose: prose.join(" ").replace(/\s+/g, " "), code };
};

// ── the sources every claim is checked against ────────────────────────────
const pkg = JSON.parse(read("package.json"));
const SUBPATHS = new Set(Object.keys(pkg.exports).map((k) => k.replace(/^\./, "@chumlab/ui")));
const COMPONENT_DIRS = readdirSync(join(root, "src/components")).filter((d) => {
  try { return readdirSync(join(root, "src/components", d)).includes("index.ts"); } catch { return false; }
});
const COMPONENT_COUNT = Object.keys(pkg.exports).filter((k) => k !== "." && !k.endsWith(".css") && k !== "./phone-validators").length;

const EXPORTED = new Set(COMPONENT_DIRS);
for (const m of read("src/index.ts").matchAll(/\b([A-Z][A-Za-z0-9]+)\b/g)) EXPORTED.add(m[1]);

const PROPS = new Set();
for (const c of COMPONENT_DIRS) {
  const f = `src/components/${c}/utils/types.ts`;
  if (!existsSync(join(root, f))) continue;
  for (const m of read(f).matchAll(/^\s{2}([a-z][A-Za-z0-9]*)\??:/gm)) PROPS.add(m[1]);
}

const WCAG_LEVEL = (() => {
  // The heading line, not the historical note recording that the README once
  // said 2.1 — matching the first "WCAG x.y" in the file would read the note.
  const hits = [...read("ACCESSIBILITY.md").matchAll(/WCAG (\d\.\d) (?:Level )?AA/g)].map((m) => m[1]);
  const counts = new Map();
  for (const h of hits) counts.set(h, (counts.get(h) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
})();

/**
 * Proper nouns that look like identifiers but are words. Each is here because
 * it is a real English or industry term, not because the check was noisy.
 */
const NOT_IDENTIFIERS = new Set([
  "APIs", "JavaScript", "JSDoc", "LLMs", "TypeScript", "UIs", "VoiceOver",
  "NVDA", "JAWS", "MIT", "CDN", "NPM", "IDE", "ARIA", "OS", "DOM", "CSS",
  "HTML", "Figma", "Tailwind", "React", "Chumlab", "WCAG",
]);
// CamelCase, or an ALLCAPS run welded into a word: prose does not look like
// this, so a token of this shape is claiming to name something real.
const IDENTIFIER_SHAPE = /^([A-Z][a-z0-9]+){2,}$|^[A-Z]{2,}[a-z][A-Za-z]*$/;

// DOM attributes that legitimately appear in an inline prop assignment.
const DOM_ATTRS = new Set(["class", "className", "style", "href", "target", "rel", "id", "type", "role", "lang", "dir", "src", "alt", "width", "height", "name", "value"]);
/**
 * Single lowerCamelCase words in inline code that are not prop claims: a token
 * name, an `aria-live` value, and two DOM properties. Everything else of that
 * shape on these pages is a prop, which is why the bare form is checked at all.
 * Add to this only for something that is genuinely not a prop — an entry here
 * is a claim the gate stops checking.
 */
const NOT_PROPS = new Set(["accent", "assertive", "localStorage", "scrollHeight"]);

// ── the rules ─────────────────────────────────────────────────────────────
const failures = [];
const fail = (rule, where, msg) => failures.push({ rule, where, msg });
// Per rule, not one total: a rule whose pattern stops matching checks nothing
// and reports nothing, which is indistinguishable from a rule that passes. The
// total hides that; five separate counts do not.
const checks = { export: 0, subpath: 0, prop: 0, wcag: 0, count: 0 };

const pages = new Map(GUIDES.map((g) => [g, extract(`src/pages/demo/${g}Demo.tsx`)]));

if (SELF_CHECK) {
  // A gate never shown to fail is untested. Plant one violation per rule and
  // require every rule to bite; a rule that stops matching goes silent
  // otherwise, which reads exactly like a pass.
  pages.set("Planted", {
    prose: `The MultiSelect primitive imports from @chumlab/ui/multi-select and targets WCAG 9.9 AA with 99 primitives.`,
    code: ['animation="none"', "@chumlab/ui/does-not-exist"],
  });
}

for (const [name, { prose, code }] of pages) {
  // 1. every identifier-shaped word in prose names something exported
  for (const m of new Set([...prose.matchAll(/\b[A-Z][A-Za-z]{2,}\b/g)].map((x) => x[0]))) {
    if (!IDENTIFIER_SHAPE.test(m) || NOT_IDENTIFIERS.has(m)) continue;
    checks.export++;
    if (!EXPORTED.has(m)) fail("export", name, `"${m}" is not exported by the library`);
  }

  // 2. every @chumlab/ui subpath resolves
  for (const text of [prose, ...code]) {
    for (const m of text.matchAll(/@chumlab\/ui(?:\/[a-z0-9-]+(?:\.css)?)?/g)) {
      checks.subpath++;
      if (!SUBPATHS.has(m[0])) fail("subpath", name, `"${m[0]}" is not a published export`);
    }
  }

  // 3. every prop named in inline code is a real prop — both the assignment
  //    form (`animation="none"`) and the bare name (`disableAnimation`), since
  //    a page can fabricate a prop either way.
  for (const text of code) {
    const t = text.trim();
    const m = /^([a-z][A-Za-z0-9]*)=/.exec(t) ?? /^([a-z][a-z0-9]*[A-Z][A-Za-z0-9]*|classes|unstyled|label)$/.exec(t);
    if (!m || NOT_PROPS.has(m[1])) continue;
    checks.prop++;
    if (!PROPS.has(m[1]) && !DOM_ATTRS.has(m[1])) fail("prop", name, `no component has a "${m[1]}" prop`);
  }

  // 4. the WCAG level matches ACCESSIBILITY.md
  for (const m of prose.matchAll(/WCAG (\d\.\d)/g)) {
    checks.wcag++;
    if (WCAG_LEVEL && m[1] !== WCAG_LEVEL) fail("wcag", name, `claims WCAG ${m[1]}, ACCESSIBILITY.md says ${WCAG_LEVEL}`);
  }

  // 5. a component count matches the export list
  // A number, any adjectives it is wearing, then the noun. Tied to the phrasing
  // rather than the number, so rewording the sentence keeps it checked.
  for (const m of prose.matchAll(/\b(\d+)(\+?)\s+(?:[a-z][a-z-]*,?\s+){0,4}(?:primitives|components)\b/g)) {
    const n = Number(m[1]);
    checks.count++;
    if (n !== COMPONENT_COUNT) fail("count", name, `claims ${m[0].trim()}, the package exports ${COMPONENT_COUNT}`);
    if (/\d\+/.test(m[0])) fail("count", name, `"${m[0].trim()}" is open-ended; the number is exactly ${COMPONENT_COUNT}`);
  }
}

// ── report ────────────────────────────────────────────────────────────────
const w = process.stdout;
w.write(`\n── guide claims ${"─".repeat(48)}\n`);
const total = Object.values(checks).reduce((a, b) => a + b, 0);
w.write(`  ${pages.size} page(s), ${total} claim(s) checked against source\n`);
w.write(`  ${Object.entries(checks).map(([k, v]) => `${k} ${v}`).join(", ")}\n`);
w.write(`  sources: ${SUBPATHS.size} subpaths, ${EXPORTED.size} exports, ${PROPS.size} prop names, WCAG ${WCAG_LEVEL}, ${COMPONENT_COUNT} components\n`);

const silent = Object.entries(checks).filter(([, v]) => v === 0).map(([k]) => k);
if (silent.length) {
  w.write(`  RESULT: FAILED — these rules matched nothing at all: ${silent.join(", ")}\n${"═".repeat(64)}\n`);
  process.exit(1);
}

if (SELF_CHECK) {
  const bit = new Set(failures.filter((f) => f.where === "Planted").map((f) => f.rule));
  const want = ["export", "subpath", "prop", "wcag", "count"];
  const missed = want.filter((r) => !bit.has(r));
  const real = failures.filter((f) => f.where !== "Planted");
  for (const f of real) w.write(`  ${f.where}: ${f.msg}\n`);
  w.write(`  planted violations caught: ${want.length - missed.length}/${want.length}\n`);
  if (missed.length) {
    w.write(`  RESULT: FAILED — these rules did not fire on a planted violation: ${missed.join(", ")}\n${"═".repeat(64)}\n`);
    process.exit(1);
  }
  w.write(`  RESULT: every rule bites${real.length ? ` (${real.length} real failure(s) above)` : ""}\n${"═".repeat(64)}\n`);
  process.exit(real.length ? 1 : 0);
}

if (failures.length === 0) {
  w.write(`  RESULT: every checkable claim matches its source\n${"═".repeat(64)}\n`);
  process.exit(0);
}
for (const f of failures) w.write(`  ${f.where.padEnd(16)} [${f.rule}] ${f.msg}\n`);
w.write(`  RESULT: FAILED — ${failures.length} claim(s) disagree with source\n${"═".repeat(64)}\n`);
process.exit(1);
