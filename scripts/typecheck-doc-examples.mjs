// Typecheck every code example a consumer reads against the built package.
//
// `typecheck-demo-snippets.mjs` holds the snippets generated from the demo
// pages. Nothing held the ones written by hand: the README's, each component's
// .ai.md, llms-full.txt (which is what a model generates from), and the docs
// pages' code blocks. A prop renamed in the library left those examples wrong
// with every gate green.
//
// Most of them are fragments, `<Dropdown options={options} />` with no import,
// because that is how documentation reads. So a fragment is completed before it
// is checked: what it leaves undeclared is imported if the package or React
// exports that name, and declared `any` otherwise, standing in for the reader's
// own `options`. What that checks is everything the example says about the
// library: subpaths, component names, prop names, slot keys, and the types of
// literal values. What it leaves out is the type of the reader's own values, and
// fragments are compiled without noImplicitAny, since a callback passed to one
// of those stand-ins has nothing to infer from. An example that imports what it
// uses is compiled strict, as the demo snippets are.
//
// Sources and what each floor counts, none of it through the extractor:
//   README, CHANGELOG, .ai.md, llms-full.txt, the llms preamble
//                     a plain count of lines opening a code fence.
//   docs pages        a plain count of `<CodeBlock`. Their blocks name no
//                     language: CSS, HTML and shell ones are counted and not
//                     compiled, and printed as "other".
//   schema examples   a plain count of `"examples"` keys. There are none today;
//                     the source is listed so that the first one is checked.
// A fence naming css, bash or html is left out of the floor, and of the count.
// So is a fence naming nothing, which in these files is a directory tree or
// a line of output; those are printed as "unnamed".
//
//   node scripts/typecheck-doc-examples.mjs [--self-check]
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import ts from "typescript";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const CODE_FENCE = /^\s*```(tsx|ts|typescript|jsx|js|javascript)\s*$/;

/** Examples run D2 corrected at their source on 2026-11-03; llms-full.txt carries most of them again. */
const FIXED = 24;

/**
 * Examples that are meant not to compile, or that name a package the library
 * does not depend on. Keyed by the example's first line, since llms-full.txt
 * carries most .ai.md examples again.
 */
const REASONED = [
  {
    first: "// ❌ DON'T: Combine value + defaultValue",
    reason: "a list of what not to write: Accordion's misuses, each line a wrong call on purpose",
  },
  {
    first: '// ❌ DON\'T: Use as="a" without href',
    reason: "a list of what not to write: that this one does not compile is the point it makes",
  },
  {
    first: 'import { LogoMark, LogoWordmark, LogoFull } from "../../components/BrandLogo";',
    reason: "BrandLogo is this site's own logo: not a published entry, and left out of llms-full.txt; the path is the repo's",
  },
];

/** Packages an example may name that this package does not install; they are stubbed `any`. */
const FOREIGN = ["framer-motion"];

function fences(text) {
  const out = [];
  const lines = text.split("\n");
  let unnamed = 0;
  for (let i = 0; i < lines.length; i += 1) {
    const open = /^\s*```(\S*)\s*$/.exec(lines[i]);
    if (!open) continue;
    let end = i + 1;
    while (end < lines.length && !/^\s*```\s*$/.test(lines[end])) end += 1;
    if (!open[1]) unnamed += 1;
    if (CODE_FENCE.test(lines[i])) out.push({ line: i + 1, lang: open[1], code: lines.slice(i + 1, end).join("\n") });
    i = end;
  }
  return { examples: out, unnamed };
}

/** Whether a docs page's block is code this compiler reads, rather than CSS, HTML or a shell line. */
function looksLikeCode(code) {
  const text = code.trim();
  if (/^(npm|npx|yarn|pnpm|bun)\s/.test(text)) return false;
  if (/^(@import|@keyframes|@media|@source|@theme|:root|\[data-|\.[a-z-]+\s*\{)/.test(text)) return false;
  if (/^\/\*[^]*?\*\/\s*(@|:root|\[|\.[a-z])/.test(text)) return false;
  if (/^<(html|!doctype|head|body|div|style|script)\b/i.test(text)) return false;
  return true;
}

function pageBlocks(file) {
  const text = readFileSync(file, "utf8");
  const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const consts = new Map();
  const blocks = [];
  const literal = (e) => (e && (ts.isStringLiteral(e) || ts.isNoSubstitutionTemplateLiteral(e)) ? e.text : null);
  const visit = (n) => {
    if (ts.isVariableDeclaration(n) && ts.isIdentifier(n.name) && literal(n.initializer) !== null) consts.set(n.name.text, literal(n.initializer));
    if ((ts.isJsxSelfClosingElement(n) || ts.isJsxOpeningElement(n)) && n.tagName.getText(sf) === "CodeBlock") {
      const attr = n.attributes.properties.find((p) => ts.isJsxAttribute(p) && p.name.getText(sf) === "code");
      const init = attr?.initializer;
      const expr = init && ts.isJsxExpression(init) ? init.expression : init;
      let code = literal(expr);
      if (code === null && expr && ts.isIdentifier(expr)) code = consts.get(expr.text) ?? null;
      blocks.push({ line: sf.getLineAndCharacterOfPosition(n.getStart(sf)).line + 1, lang: "page", code, opaque: code === null });
    }
    ts.forEachChild(n, visit);
  };
  visit(sf);
  return blocks;
}

/** Every source, each `{ source, examples, floor, unnamed, other }`. */
function collect() {
  const sources = [];
  const md = (path) => {
    const text = readFileSync(join(root, path), "utf8");
    const { examples, unnamed } = fences(text);
    const floor = text.split("\n").filter((l) => CODE_FENCE.test(l)).length;
    sources.push({ source: path, examples, floor, unnamed, other: 0 });
  };
  for (const f of ["README.md", "CHANGELOG.md", "llms-full.txt", "ai/llms-full-preamble.md"]) md(f);
  const components = join(root, "src/components");
  for (const dir of readdirSync(components, { withFileTypes: true })) {
    if (!dir.isDirectory()) continue;
    for (const f of readdirSync(join(components, dir.name))) if (f.endsWith(".ai.md")) md(`src/components/${dir.name}/${f}`);
  }
  const pages = join(root, "src/pages/demo");
  for (const f of readdirSync(pages)) {
    if (!f.endsWith(".tsx")) continue;
    const path = join(pages, f);
    const floor = (readFileSync(path, "utf8").match(/<CodeBlock\b/g) ?? []).length;
    if (!floor) continue;
    const blocks = pageBlocks(path);
    const examples = blocks.filter((b) => b.opaque || looksLikeCode(b.code));
    sources.push({ source: `src/pages/demo/${f}`, examples, floor, unnamed: 0, other: blocks.length - examples.length, blocks: blocks.length });
  }
  let schemaFloor = 0;
  const schemaExamples = [];
  for (const dir of readdirSync(components, { withFileTypes: true })) {
    if (!dir.isDirectory()) continue;
    for (const f of readdirSync(join(components, dir.name))) {
      if (!f.endsWith(".schema.json")) continue;
      const text = readFileSync(join(components, dir.name, f), "utf8");
      schemaFloor += (text.match(/"examples"\s*:/g) ?? []).length;
      const walk = (o) => {
        if (Array.isArray(o)) o.forEach(walk);
        else if (o && typeof o === "object") {
          for (const [k, v] of Object.entries(o)) {
            if (k === "examples" && Array.isArray(v)) v.filter((x) => typeof x === "string" && x.includes("<")).forEach((code) => schemaExamples.push({ line: 0, lang: "schema", code }));
            walk(v);
          }
        }
      };
      walk(JSON.parse(text));
    }
  }
  sources.push({ source: "*.schema.json", examples: schemaExamples, floor: schemaFloor, unnamed: 0, other: schemaFloor - schemaExamples.length });
  return sources;
}

const parseErrors = (name, text) =>
  ts.createSourceFile(name, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX).parseDiagnostics;

/** The example as a compilable module: a run of JSX is wrapped so its siblings have a parent. */
export function asModule(code) {
  if (!parseErrors("e.tsx", code).length) return code;
  const wrapped = `const __example = (<>\n${code}\n</>);`;
  return parseErrors("e.tsx", wrapped).length ? code : wrapped;
}

const OPTIONS = {
  target: ts.ScriptTarget.ES2022,
  lib: ["lib.es2022.d.ts", "lib.dom.d.ts", "lib.dom.iterable.d.ts"],
  jsx: ts.JsxEmit.ReactJSX,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  strict: true,
  noEmit: true,
  skipLibCheck: true,
  esModuleInterop: true,
  allowSyntheticDefaultImports: true,
  baseUrl: root,
  typeRoots: [join(root, "node_modules/@types")],
};

function compile(files, paths, noImplicitAny) {
  const program = ts.createProgram(files, { ...OPTIONS, paths, noImplicitAny });
  return ts.getPreEmitDiagnostics(program).filter((d) => d.file && files.includes(d.file.fileName));
}

function publishedPaths() {
  const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
  const paths = {};
  for (const [key, target] of Object.entries(pkg.exports)) {
    const types = typeof target === "string" ? null : (target.import?.types ?? target.types ?? null);
    if (types) paths[key.replace(/^\./, "@chumlab/ui")] = [types.replace(/^\.\//, "./")];
  }
  // The temporary directory has no node_modules above it; this resolves what a
  // reader's project has installed beside the package.
  paths["*"] = ["node_modules/@types/*", "node_modules/*"];
  return paths;
}

function exportsOf(file) {
  const program = ts.createProgram([file], { ...OPTIONS, paths: {} });
  const checker = program.getTypeChecker();
  const sf = program.getSourceFile(file);
  return new Set(checker.getExportsOfModule(checker.getSymbolAtLocation(sf)).map((s) => s.name));
}

/**
 * Names a reader's example means as its own that the DOM already declares, so the
 * first compile finds them and calls `open` a function. `window.open` is not what
 * `<Modal open={open}>` is about.
 */
const DOM_GLOBALS = new Set(["close", "event", "focus", "history", "length", "location", "name", "open", "origin", "parent", "status", "top"]);

/** Identifiers read as values and declared nowhere in the example. */
function shadowedGlobals(body) {
  const sf = ts.createSourceFile("e.tsx", body, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const declared = new Set();
  const read = new Set();
  const visit = (n) => {
    if ((ts.isVariableDeclaration(n) || ts.isParameter(n) || ts.isBindingElement(n) || ts.isFunctionDeclaration(n)) && n.name) {
      const names = (x) => (ts.isIdentifier(x) ? declared.add(x.text) : ts.forEachChild(x, names));
      names(n.name);
    }
    if (ts.isImportSpecifier(n) || ts.isImportClause(n)) if (n.name) declared.add(n.name.text);
    if (ts.isIdentifier(n) && DOM_GLOBALS.has(n.text)) {
      const p = n.parent;
      const isName =
        (ts.isPropertyAccessExpression(p) && p.name === n) ||
        (ts.isPropertyAssignment(p) && p.name === n) ||
        ts.isJsxAttribute(p);
      if (!isName) read.add(n.text);
    }
    ts.forEachChild(n, visit);
  };
  visit(sf);
  return [...read].filter((x) => !declared.has(x));
}

const REACT_NAMES = new Set(["useState", "useEffect", "useRef", "useMemo", "useCallback", "useId", "useReducer", "useContext", "createContext", "forwardRef", "memo", "Fragment", "Suspense", "lazy", "ReactNode"]);

/** Completes a fragment from the names the first compile could not find. */
export function complete(body, missing, library) {
  const fromLibrary = [...missing].filter((n) => library.has(n));
  const fromReact = [...missing].filter((n) => !library.has(n) && REACT_NAMES.has(n));
  const stands = [...missing].filter((n) => !library.has(n) && !REACT_NAMES.has(n));
  const head = [
    fromLibrary.length ? `import { ${fromLibrary.join(", ")} } from "@chumlab/ui";` : "",
    fromReact.length ? `import { ${fromReact.join(", ")} } from "react";` : "",
    ...stands.map((n) => `declare const ${n}: any; type ${n} = any;`),
  ].filter(Boolean).join(" ");
  // On the first line, so an error's line still reads against the example.
  return `${head} ${body}\nexport {};\n`;
}

function selfCheck() {
  const fence = fences("x\n```tsx\n<A />\n```\n```css\na{}\n```\n```\ntree\n```\n");
  if (fence.examples.length !== 1 || fence.unnamed !== 1) throw new Error(`fences read ${JSON.stringify(fence)}`);
  if (asModule("<A />\n<B />").indexOf("<>") < 0) throw new Error("two adjacent elements were not wrapped");
  if (asModule("<A />").indexOf("<>") >= 0) throw new Error("one element was wrapped");
  if (looksLikeCode("npm install x") || looksLikeCode("@import 'a';") || !looksLikeCode("<Button />")) throw new Error("a docs block was misread");
  const completed = complete("<Button x={y} />", new Set(["Button", "y"]), new Set(["Button"]));
  if (!completed.includes('import { Button } from "@chumlab/ui"') || !completed.includes("declare const y: any")) throw new Error(`completed as ${completed}`);
  return run({ plants: true });
}

function run({ plants = false } = {}) {
  if (!existsSync(join(root, "dist/index.d.ts"))) {
    process.stderr.write("✗ dist/ is missing — run `npm run build:lib` first. Examples are checked against the built types, not the source.\n");
    process.exit(1);
  }
  const sources = plants
    ? [{
        source: "plants",
        floor: 3,
        unnamed: 0,
        other: 0,
        examples: [
          { line: 1, lang: "tsx", code: '<Button notAProp="x">Save</Button>' },
          { line: 2, lang: "tsx", code: 'import { Button } from "@chumlab/ui/no-such-subpath";\n<Button />;' },
          { line: 3, lang: "tsx", code: "<Button>Save</Button>" },
        ],
      }]
    : collect();
  const paths = publishedPaths();
  const library = exportsOf(join(root, "dist/index.d.ts"));
  const dir = mkdtempSync(join(tmpdir(), "doc-examples-"));
  const byHash = new Map();
  let n = 0;
  for (const s of sources) {
    for (const ex of s.examples) {
      if (ex.opaque) continue;
      const body = asModule(ex.code);
      const hash = createHash("sha1").update(body).digest("hex");
      if (!byHash.has(hash)) {
        n += 1;
        byHash.set(hash, { file: join(dir, `example-${n}.tsx`), body, syntax: parseErrors("e.tsx", body).length > 0 });
      }
      ex.unit = byHash.get(hash);
    }
  }
  const units = [...byHash.values()];
  const stubs = join(dir, "foreign.d.ts");
  writeFileSync(stubs, FOREIGN.map((m) => `declare module "${m}" { const x: any; export default x; export const motion: any; export const AnimatePresence: any; }`).join("\n") || "export {};\n");
  writeFileSync(join(dir, "react-ambient.d.ts"), "/// <reference types=\"react\" />\n/// <reference types=\"react-dom\" />\n");
  for (const u of units) writeFileSync(u.file, `${u.body}\nexport {};\n`);
  const ambient = [stubs, join(dir, "react-ambient.d.ts")];

  // First pass: what each example leaves undeclared. TS2304, TS2503 and TS2552
  // are the "cannot find name" family; 18004 is the shorthand property's.
  const names = new Map(units.map((u) => [u.file, new Set()]));
  for (const d of compile([...units.map((u) => u.file), ...ambient], paths, false)) {
    if (![2304, 2503, 2552, 18004].includes(d.code)) continue;
    const text = d.file.text.slice(d.start, d.start + d.length);
    names.get(d.file.fileName)?.add(text);
  }
  const strict = [];
  const fragments = [];
  for (const u of units) {
    const missing = names.get(u.file);
    for (const name of shadowedGlobals(u.body)) missing.add(name);
    if (missing.size) {
      writeFileSync(u.file, complete(u.body, missing, library));
      fragments.push(u.file);
    } else strict.push(u.file);
  }
  const errors = new Map();
  const record = (d) => {
    if (!errors.has(d.file.fileName)) errors.set(d.file.fileName, []);
    errors.get(d.file.fileName).push(`TS${d.code} ${ts.flattenDiagnosticMessageText(d.messageText, " ").slice(0, 200)}`);
  };
  compile([...strict, ...ambient], paths, true).forEach(record);
  compile([...fragments, ...ambient], paths, false).forEach(record);
  rmSync(dir, { recursive: true, force: true });

  const firstLine = (ex) => (ex.code ?? "").split("\n").find((l) => l.trim())?.trim() ?? "";
  const reasoned = new Map(REASONED.map((r) => [r.first, r]));
  const used = new Set();
  const rows = [];
  const failures = [];
  const totals = { found: 0, floor: 0, typechecked: 0, failed: 0, reasoned: 0, other: 0, unnamed: 0, opaque: 0 };
  for (const s of sources) {
    let failed = 0;
    let checked = 0;
    let excused = 0;
    let opaque = 0;
    for (const ex of s.examples) {
      if (ex.opaque) {
        opaque += 1;
        failures.push(`${s.source}:${ex.line} a CodeBlock whose code is not a literal: nothing could read it`);
        continue;
      }
      checked += 1;
      const problems = errors.get(ex.unit.file) ?? (ex.unit.syntax ? ["does not parse"] : null);
      if (!problems) continue;
      const key = firstLine(ex);
      if (reasoned.has(key)) {
        excused += 1;
        used.add(key);
        continue;
      }
      failed += 1;
      failures.push(`${s.source}:${ex.line} ${firstLine(ex).slice(0, 60)}\n      ${problems.slice(0, 3).join("\n      ")}`);
    }
    const found = s.blocks ?? s.examples.length;
    const short = found < s.floor ? ` BELOW FLOOR` : "";
    if (found < s.floor) failures.push(`${s.source}: extracted ${found}, a plain count reads ${s.floor}`);
    rows.push(`  ${s.source.padEnd(62)} found ${String(found).padStart(3)} floor ${String(s.floor).padStart(3)} typechecked ${String(checked).padStart(3)} failed ${String(failed).padStart(2)}${excused ? ` reasoned ${excused}` : ""}${s.other ? ` other ${s.other}` : ""}${s.unnamed ? ` unnamed ${s.unnamed}` : ""}${short}`);
    totals.found += found;
    totals.floor += s.floor;
    totals.typechecked += checked;
    totals.failed += failed + opaque;
    totals.reasoned += excused;
    totals.other += s.other ?? 0;
    totals.unnamed += s.unnamed ?? 0;
  }
  for (const key of reasoned.keys()) if (!used.has(key) && !plants) failures.push(`${key}: reasoned, and it compiles or is gone. Drop the entry.`);
  if (plants) {
    const hit = (line) => failures.some((f) => f.startsWith(`plants:${line} `));
    if (!hit(1) || !hit(2) || hit(3)) {
      process.stderr.write(`✗ self-check: wanted plants 1 and 2 to fail and 3 to pass, got:\n${failures.join("\n")}\n`);
      process.exit(1);
    }
    process.stdout.write("✓ self-check: an unknown prop and an unpublished subpath fail, a fragment with an import to complete passes\n");
    return 0;
  }
  const line = `DOC_EXAMPLES found ${totals.found} (floor ${totals.floor}, plain count), distinct ${units.length}, typechecked ${totals.typechecked}, failed ${totals.failed}, fixed ${FIXED}, reasoned ${totals.reasoned}; other ${totals.other}, unnamed ${totals.unnamed}`;
  const shown = process.argv.includes("--all") || failures.length ? rows : rows.filter((r) => !r.includes("src/components/"));
  process.stdout.write(`${shown.join("\n")}\n`);
  if (failures.length) {
    process.stderr.write(`\n${failures.join("\n")}\n\n✗ ${line}\n`);
    return 1;
  }
  process.stdout.write(`✓ ${line}\n`);
  return 0;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  process.exit(process.argv.includes("--self-check") ? selfCheck() : run());
}
