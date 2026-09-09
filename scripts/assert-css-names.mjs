// Every name the shipped JS references must exist in the shipped CSS.
//
// `AccordionContent` set `animation-name: cl-accordion-down` inline and
// dist/styles.css contained no such keyframes: they lived in src/index.css,
// the docs site's own stylesheet, so the animation worked on the site and was
// dead for every consumer. Nothing caught it. The unit tests read inline
// styles, the visual baselines photograph the site, and `constants.contract`
// guards colour NAMESPACES rather than whether a name resolves at all.
//
// Table's shimmer reaching for `--fg` — the marketing namespace, absent from
// the package — was the same shape a fortnight earlier.
//
// So this checks resolution, in three kinds:
//   animation names   `animation-name: x`   needs  @keyframes x
//   custom properties `var(--x)` with NO fallback, and not written by the
//                     component itself      needs  --x: somewhere
//   classes           a token in a class string   needs  a .token selector
//
//   node scripts/assert-css-names.mjs
//   node scripts/assert-css-names.mjs --self-check
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(root, "dist");
const SELF_CHECK = process.argv.includes("--self-check");

if (!existsSync(join(DIST, "styles.css"))) {
  process.stderr.write("✗ dist/styles.css is missing — run `npm run build:lib` first.\n");
  process.exit(1);
}

const walk = (d) => readdirSync(d).flatMap((e) => {
  const p = join(d, e);
  return statSync(p).isDirectory() ? walk(p) : [p];
});

/** What the stylesheet defines. */
function definitions(css) {
  return {
    keyframes: new Set([...css.matchAll(/@keyframes\s+([A-Za-z0-9_-]+)/g)].map((m) => m[1])),
    props: new Set([...css.matchAll(/(--[a-z][a-zA-Z0-9-]*)\s*:/g)].map((m) => m[1])),
    classes: new Set(
      [...css.matchAll(/\.((?:\\.|[^\s.,:>+~()[\]{}])+)/g)].map((m) => m[1].replace(/\\/g, "")),
    ),
  };
}

const CLASS_SHAPE = /^!?[a-z][a-z0-9]*(?:[-:/[\]().%#][A-Za-z0-9-_.%#/[\]()]*)*$/;

/**
 * Values of the neighbouring animation longhands, which the scan window also
 * sees. `animationFillMode: "forwards"` sits a few characters after
 * `animationName`, and reading it as a keyframe name faulted a clean build.
 */
const ANIMATION_KEYWORDS = new Set([
  "none", "forwards", "backwards", "both", "infinite", "alternate", "reverse",
  "alternate-reverse", "normal", "running", "paused", "linear", "ease",
  "ease-in", "ease-out", "ease-in-out", "step-start", "step-end", "initial",
  "inherit", "unset", "revert",
]);

/** What the JS references, and from which component. */
function references(files, read) {
  const anim = new Map(), bareProp = new Map(), cls = new Map(), written = new Set();
  const add = (m, k, f) => { if (!m.has(k)) m.set(k, new Set()); m.get(k).add(f); };
  for (const f of files) {
    const text = read(f);
    const comp =
      (/components[/\\]([^/\\]+)/.exec(f) || [])[1] ||
      (/shared[/\\]([A-Za-z]+)/.exec(f) || [])[1] ||
      "(root)";

    // Scanned as an expression, not matched as a literal.
    //
    // Built output does not read `animationName: "x"`. It reads
    // `animationName: o ? t.isExpanded ? "cl-accordion-down" : "cl-accordion-up"
    // : void 0`, and a regex expecting a quoted string straight after the colon
    // finds nothing. The first version of this gate did exactly that, passed
    // its own self-check — which planted the simple form — and then failed to
    // notice when the keyframes were deleted from dist/styles.css. So the
    // window is scanned for every identifier-shaped string in the expression.
    for (const m of text.matchAll(/animationName\s*[:=]/g)) {
      const window = text.slice(m.index, m.index + 220);
      for (const q of window.matchAll(/["'`]([A-Za-z][A-Za-z0-9_-]*)["'`]/g)) {
        if (!ANIMATION_KEYWORDS.has(q[1])) add(anim, q[1], comp);
      }
    }
    for (const m of text.matchAll(/animation-name:\s*([A-Za-z][A-Za-z0-9_-]*)/g)) add(anim, m[1], comp);

    // A fallback makes an undefined property a deliberate consumer hook, not a
    // hole: `var(--switch-thumb-bg, #fff)` is meant to be undefined until
    // someone overrides it. A bare `var(--x)` that nothing defines paints
    // nothing.
    for (const m of text.matchAll(/var\(\s*(--[a-z][a-zA-Z0-9-]*)\s*([,)])/g)) {
      if (m[2] === ")") add(bareProp, m[1], comp);
    }
    for (const m of text.matchAll(/setProperty\(\s*["'`](--[a-z][a-zA-Z0-9-]*)["'`]/g)) written.add(m[1]);
    for (const m of text.matchAll(/["'`](--[a-z][a-zA-Z0-9-]*)["'`]\s*:/g)) written.add(m[1]);

    // Class strings, told apart from prose by their own contents: a real class
    // list is mostly classes the sheet defines. A validation message —
    // "possible length national prefix is optional…" — matched the token shape
    // and produced thirteen false positives before this rule.
    for (const m of text.matchAll(/["'`]([a-z][^"'`\n]{12,400})["'`]/g)) {
      const toks = m[1].split(/\s+/).filter(Boolean);
      if (toks.length < 2 || !toks.every((t) => CLASS_SHAPE.test(t))) continue;
      const known = toks.filter((t) => defined.classes.has(t.replace(/^!/, ""))).length;
      if (known / toks.length < 0.6) continue;
      for (const t of toks) {
        const base = t.replace(/^!/, "");
        if (defined.classes.has(base)) continue;
        if (base.includes(":") && defined.classes.has(base.split(":").pop())) continue;
        add(cls, base, comp);
      }
    }
  }
  return { anim, bareProp, cls, written };
}

const css = readFileSync(join(DIST, "styles.css"), "utf8");
const defined = definitions(css);
const files = walk(DIST).filter((f) => /\.(js|cjs)$/.test(f));

const audit = (refs, def) => ({
  anim: [...refs.anim].filter(([n]) => !ANIMATION_KEYWORDS.has(n) && !def.keyframes.has(n)),
  prop: [...refs.bareProp].filter(([n]) => !def.props.has(n) && !refs.written.has(n)),
  cls: [...refs.cls].filter(([n]) => !def.classes.has(n)),
});

if (SELF_CHECK) {
  // A gate never shown to fail is untested. Each kind is planted separately,
  // because they are found by three different rules.
  const planted = [
    // The shape the bundler actually emits, not a simplified one.
    ["an animation name in a ternary", 'e.style={animationName: o ? a ? "cl-planted-keyframe" : "cl-accordion-up" : void 0};', (r) => r.anim.length],
    ["an animation name by assignment", 'x.style.animationName = "cl-planted-keyframe";', (r) => r.anim.length],
    ["a bare custom property", 'x.style.color = "var(--cl-planted-prop)";', (r) => r.prop.length],
    ["an undefined class", 'x.className = "flex items-center cl-planted-class w-full";', (r) => r.cls.length],
  ];
  let ok = true;
  process.stdout.write("\n── css name resolution self-check ──────────────────────────────\n");
  for (const [label, source, count] of planted) {
    const refs = references(["planted.js"], () => source);
    const found = count(audit(refs, defined));
    process.stdout.write(`  ${found ? "caught " : "MISSED "} ${label}\n`);
    if (!found) ok = false;
  }
  // and it must not fault what is legitimate
  const clean = references(["clean.js"], () =>
    'x.style.color = "var(--cl-planted-prop, red)"; y.className = "flex items-center";');
  const noise = audit(clean, defined);
  const quiet = noise.anim.length + noise.prop.length + noise.cls.length === 0;
  process.stdout.write(`  ${quiet ? "quiet  " : "NOISY  "} a fallback var and a defined class\n`);
  if (!quiet) ok = false;
  process.stdout.write(ok ? "  RESULT: every kind bites\n" : "  RESULT: FAILED\n");
  process.stdout.write("════════════════════════════════════════════════════════════════\n");
  process.exit(ok ? 0 : 1);
}

const refs = references(files, (f) => readFileSync(f, "utf8"));
const bad = audit(refs, defined);
const total = bad.anim.length + bad.prop.length + bad.cls.length;

const w = process.stdout;
w.write(`\n── css name resolution ${"─".repeat(41)}\n`);
w.write(`  ${files.length} shipped JS file(s) against dist/styles.css\n`);
w.write(`  defines ${defined.keyframes.size} keyframes, ${defined.props.size} custom properties, ${defined.classes.size} classes\n`);

if (!total) {
  w.write(`  RESULT: every referenced name resolves\n${"═".repeat(64)}\n`);
  process.exit(0);
}
for (const [kind, rows, needs] of [
  ["animation name", bad.anim, "@keyframes"],
  ["custom property", bad.prop, "a definition"],
  ["class", bad.cls, "a rule"],
]) {
  for (const [n, comps] of rows) {
    w.write(`  ✗ ${kind} "${n}" has no ${needs} in dist/styles.css — referenced by ${[...comps].join(", ")}\n`);
  }
}
w.write(`  RESULT: FAILED — ${total} name(s) resolve to nothing for a consumer\n${"═".repeat(64)}\n`);
process.exit(1);
