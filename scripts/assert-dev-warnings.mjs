// Every development warning the library writes must reach a consumer's
// development build. Run after `build:lib`.
//
// Five warnings were guarded by `import.meta.env.DEV`. Vite's library build
// replaces that with `false` when it builds the package, so all five were
// compiled out of dist/ before any consumer's bundler saw them: the accessible
// name warning shipped as an empty effect, and no .js or .cjs file in the
// package contained `console.warn`. CHANGELOG, ACCESSIBILITY.md and the .ai.md
// files promised those warnings to consumers, and every test that asserted them
// passed, because the tests run the source, where the flag is true.
//
// The guard is now `process.env.NODE_ENV`, which the library build leaves
// alone and the consumer's bundler replaces — kept in their development build,
// dropped from their production one.
//
// What this measures, against dist/**/*.js (ESM) and dist/**/*.cjs (CJS),
// .d.ts excluded:
//   (a) every expected message is present in at least one ESM and one CJS file;
//   (b) no `import.meta.env` read remains in shipped code;
//   (c) every file carrying a message also reads `process.env.NODE_ENV`, so a
//       message that ships unguarded fails rather than passing as "shipped".
//       Forwarded messages are the one exception, stated in (d): their text
//       lives in the caller's chunk and their guard in the forwarder's;
//   (d) each format carries at least as many `console.*` calls as the source,
//       and every file with one reads `process.env.NODE_ENV`. This is what sees
//       a forwarder compiled out, and what saw all five calls go in 775be37's
//       dist while their text, passed as arguments, still shipped.
//
// The expected messages are derived from source, never listed by hand: every
// `console.*` call in the files the library build compiles. Both source and
// dist are read through the TypeScript AST, so a message quoted in a comment
// neither counts as expected nor as shipped — the build keeps comments.
//
//   node scripts/assert-dev-warnings.mjs               the gate
//   node scripts/assert-dev-warnings.mjs --self-check  prove it can fail
import ts from "typescript";
import { readFileSync, readdirSync, statSync, existsSync, cpSync, rmSync, writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve, dirname, join, relative, basename, extname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(root, "dist");

/**
 * Shortest literal run accepted as a message's signature. A message's text is
 * matched by its longest literal run — the text between interpolations — and a
 * run this long is specific to one message: the shortest in use today is
 * Modal's 30. Below it, runs like ": " would match any file in the package, so
 * a call whose message has no run this long is treated as a forwarder and its
 * messages are read from its callers instead (useInertPropWarning).
 */
const MIN_SIGNATURE = 20;

/**
 * The files the library build compiles: tsconfig.lib.json's own include and
 * exclude, so the site-only components it excludes are left out here by the
 * same rule. src/jsx is added because it is not in that config — it is the JSX
 * runtime vite compiles the library against, and it ships in every chunk.
 */
function shippedSource() {
  const parsed = ts.getParsedCommandLineOfConfigFile(
    join(root, "tsconfig.lib.json"),
    {},
    { ...ts.sys, onUnRecoverableConfigFileDiagnostic: (d) => { throw new Error(ts.flattenDiagnosticMessageText(d.messageText, "\n")); } },
  );
  const jsx = readdirSync(join(root, "src/jsx")).map((f) => join(root, "src/jsx", f));
  return [...parsed.fileNames, ...jsx].filter((f) => /\.tsx?$/.test(f) && !f.endsWith(".d.ts"));
}

const parse = (file, text) =>
  ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true,
    file.endsWith(".tsx") ? ts.ScriptKind.TSX : file.endsWith(".ts") ? ts.ScriptKind.TS : ts.ScriptKind.JS);

const walk = (node, visit) => { visit(node); ts.forEachChild(node, (n) => walk(n, visit)); };

/** Cooked text of every literal run in an expression, in source order. */
function literalRuns(expr) {
  const runs = [];
  walk(expr, (n) => {
    if (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n)) runs.push(n.text);
    else if (ts.isTemplateHead(n) || ts.isTemplateMiddle(n) || ts.isTemplateTail(n)) runs.push(n.text);
  });
  return runs;
}

const signatureOf = (expr) =>
  literalRuns(expr).reduce((best, run) => (run.length > best.length ? run : best), "");

const isConsoleCall = (n) =>
  ts.isCallExpression(n) && ts.isPropertyAccessExpression(n.expression) &&
  ts.isIdentifier(n.expression.expression) && n.expression.expression.text === "console";

const where = (sf, node) => `${relative(root, sf.fileName)}:${sf.getLineAndCharacterOfPosition(node.getStart()).line + 1}`;

/**
 * One signature per message. A call whose message is all interpolation is a
 * forwarder: its function's parameters carry the text, so the signatures are
 * read from the literal arguments at every call of that function.
 */
export function expectedMessages() {
  const files = shippedSource().map((f) => parse(f, readFileSync(f, "utf8")));
  const messages = [];
  const unresolved = [];
  let consoleCallCount = 0;

  const callsOf = (fnName, index) => {
    const found = [];
    for (const sf of files) {
      walk(sf, (n) => {
        if (ts.isCallExpression(n) && ts.isIdentifier(n.expression) && n.expression.text === fnName && n.arguments[index]) {
          found.push({ sf, node: n, arg: n.arguments[index] });
        }
      });
    }
    return found;
  };

  for (const sf of files) {
    walk(sf, (n) => {
      if (!isConsoleCall(n)) return;
      const arg = n.arguments[0];
      const site = where(sf, n);
      const direct = arg ? signatureOf(arg) : "";
      consoleCallCount += 1;
      if (direct.length >= MIN_SIGNATURE) {
        messages.push({ site, text: direct, forwarded: false });
        return;
      }
      let fn = n.parent;
      while (fn && !ts.isFunctionDeclaration(fn)) fn = fn.parent;
      const params = fn?.parameters.map((p) => p.name.getText(sf)) ?? [];
      const forwarded = new Set();
      if (arg) walk(arg, (id) => { if (ts.isIdentifier(id) && params.includes(id.text)) forwarded.add(params.indexOf(id.text)); });
      const calls = fn?.name ? [...forwarded].flatMap((i) => callsOf(fn.name.text, i)) : [];
      const resolved = calls
        .map((c) => ({ site: `${where(c.sf, c.node)} via ${site}`, text: signatureOf(c.arg), forwarded: true }))
        .filter((m) => m.text.length >= MIN_SIGNATURE);
      if (resolved.length) messages.push(...resolved);
      else unresolved.push(site);
    });
  }
  return { files: files.length, calls: consoleCallCount, messages, unresolved };
}

function distFiles(dir) {
  const out = [];
  const visit = (d) => {
    for (const name of readdirSync(d)) {
      const p = join(d, name);
      if (statSync(p).isDirectory()) visit(p);
      else if (p.endsWith(".js") || p.endsWith(".cjs")) out.push(p);
    }
  };
  visit(dir);
  return out.sort();
}

const isNodeEnv = (n) =>
  ts.isPropertyAccessExpression(n) && n.name.text === "NODE_ENV" &&
  ts.isPropertyAccessExpression(n.expression) && n.expression.name.text === "env" &&
  ts.isIdentifier(n.expression.expression) && n.expression.expression.text === "process";

const isImportMetaEnv = (n) =>
  ts.isPropertyAccessExpression(n) && n.name.text === "env" &&
  ts.isMetaProperty(n.expression) && n.expression.keywordToken === ts.SyntaxKind.ImportKeyword;

/**
 * The real measurement, shared by the gate and every plant. A file is parsed
 * only when its raw text could hold something that matters: most of the
 * package is flag SVGs and class tables.
 */
export function measure(dir, messages) {
  const files = distFiles(dir);
  const found = messages.map(() => ({ esm: [], cjs: [] }));
  const envReads = [];
  const unguarded = [];
  const consoleCalls = { esm: 0, cjs: 0 };
  // The prefilter reads raw text, where the build may have escaped a backtick,
  // a quote or a non-ASCII character; it keys on the longest run with none.
  const probes = messages.map((m) =>
    m.text.split(/[`'"\\\n\r\t\u0080-￿]/).reduce((a, b) => (b.length > a.length ? b : a), ""));
  for (const file of files) {
    const text = readFileSync(file, "utf8");
    const candidates = probes.map((p, i) => (text.includes(p) ? i : -1)).filter((i) => i >= 0);
    const mayReadMeta = text.includes("import.meta");
    const mayLog = text.includes("console");
    if (!candidates.length && !mayReadMeta && !mayLog) continue;

    const sf = parse(file, text);
    const runs = [];
    let readsNodeEnv = false;
    let logs = 0;
    walk(sf, (n) => {
      if (isConsoleCall(n)) logs += 1;
      if (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n) || ts.isTemplateHead(n) ||
          ts.isTemplateMiddle(n) || ts.isTemplateTail(n)) runs.push(n.text);
      if (isNodeEnv(n)) readsNodeEnv = true;
      if (isImportMetaEnv(n)) envReads.push(`${relative(dir, file)}:${sf.getLineAndCharacterOfPosition(n.getStart()).line + 1}`);
    });
    const rel = relative(dir, file);
    const format = file.endsWith(".cjs") ? "cjs" : "esm";
    let carries = false;
    for (const i of candidates) {
      if (!runs.some((r) => r.includes(messages[i].text))) continue;
      if (!messages[i].forwarded) carries = true;
      found[i][format].push(rel);
    }
    consoleCalls[format] += logs;
    if ((carries || logs) && !readsNodeEnv) unguarded.push(rel);
  }
  return { files: files.length, found, envReads, unguarded, consoleCalls };
}

/** `shared/useInertPropWarning-D3FdD2Ey.js` -> `shared/useInertPropWarning`. */
const stem = (rel) => join(dirname(rel), basename(rel, extname(rel)).replace(/-[A-Za-z0-9_-]{8}$/, ""));

function failures(report, messages, dir, calls) {
  const out = [];
  for (const [format, key] of [["ESM", "esm"], ["CJS", "cjs"]]) {
    if (report.consoleCalls[key] < calls) {
      out.push(`${format} carries ${report.consoleCalls[key]} console calls; the source has ${calls}`);
    }
  }
  const all = distFiles(dir).map((f) => relative(dir, f));
  const counterpart = (rel, ext) => all.filter((f) => f.endsWith(ext) && stem(f) === stem(rel));
  messages.forEach((m, i) => {
    const { esm, cjs } = report.found[i];
    for (const [format, have, other, ext] of [["ESM", esm, cjs, ".js"], ["CJS", cjs, esm, ".cjs"]]) {
      if (have.length) continue;
      const expectedIn = other.flatMap((f) => counterpart(f, ext));
      out.push(
        `missing from ${format}: "${m.text}" (${m.site})` +
          (other.length ? `\n      present in ${other.join(", ")}; expected in ${expectedIn.join(", ") || `a ${ext} counterpart of it`}`
            : "\n      in neither format"),
      );
    }
  });
  for (const r of report.envReads) out.push(`import.meta.env read in shipped code: ${r}`);
  for (const f of report.unguarded) out.push(`carries a warning or console call but never reads process.env.NODE_ENV: ${f}`);
  return out;
}

function gate() {
  const { files, calls, messages, unresolved } = expectedMessages();
  if (!existsSync(DIST) || !distFiles(DIST).length) {
    console.error("✗ no built .js/.cjs under dist/ — run build:lib first");
    process.exit(1);
  }
  if (unresolved.length) {
    console.error(`✗ no message signature of ${MIN_SIGNATURE}+ characters could be derived for:\n  ${unresolved.join("\n  ")}`);
    process.exit(1);
  }
  if (!messages.length) {
    console.error(`✗ derived 0 expected messages from ${files} source files — the derivation is broken, not the package`);
    process.exit(1);
  }
  const report = measure(DIST, messages);
  const fails = failures(report, messages, DIST, calls);
  const n = messages.length;
  const esm = report.found.filter((f) => f.esm.length).length;
  const cjs = report.found.filter((f) => f.cjs.length).length;
  const summary = `${esm} of ${n} messages shipped in ESM, ${cjs} of ${n} in CJS, ` +
    `${report.consoleCalls.esm}/${report.consoleCalls.cjs} of ${calls} console calls (ESM/CJS), ` +
    `${report.envReads.length} import.meta.env reads, across ${report.files} .js/.cjs dist files (${files} source files)`;
  if (fails.length) {
    for (const f of fails) console.error(`✗ ${f}`);
    console.error(`dev warnings FAILED: ${summary}`);
    process.exit(1);
  }
  console.log(`✓ dev warnings: ${summary}`);
}

/**
 * Plants run `measure` and `failures` — the gate's own code — against a copy of
 * dist/. Each plant must fail AND name the file it planted in: a gate that goes
 * red for the wrong reason proves as little as one that stays green.
 */
function selfCheck() {
  const { calls, messages } = expectedMessages();
  if (!messages.length) { console.error("✗ derived 0 messages; nothing to plant against"); process.exit(1); }

  const withCopy = (plant) => {
    const dir = mkdtempSync(join(tmpdir(), "chumlab-dev-warnings-"));
    try {
      cpSync(DIST, dir, { recursive: true });
      const target = plant(dir);
      return { target, fails: failures(measure(dir, messages), messages, dir, calls) };
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  };

  const baseline = withCopy(() => null);
  if (baseline.fails.length) {
    console.error("✗ the unplanted copy of dist/ already fails, so no plant can prove anything:");
    for (const f of baseline.fails) console.error(`    ${f}`);
    process.exit(1);
  }

  const report = measure(DIST, messages);
  const guard = /process\.env\.NODE_ENV\s*(!==|===)\s*"production"/g;
  // What Vite did to import.meta.env.DEV: the development condition becomes a constant.
  const compileOut = (s) => s.replace(guard, (_, op) => (op === "!==" ? "false" : "true"));
  const edit = (dir, rel, fn) => {
    const p = join(dir, rel);
    const before = readFileSync(p, "utf8");
    const after = fn(before);
    if (after === before) throw new Error(`plant did not change ${rel}`);
    writeFileSync(p, after);
  };
  const pick = (format, skip = -1) => {
    const i = report.found.findIndex((f, j) => j !== skip && f[format].length);
    if (i < 0) throw new Error(`no ${format} file carries a message to plant in`);
    return i;
  };

  const first = pick("esm");
  const second = pick("cjs", first);
  const plants = [
    ["an ESM warning chunk compiled out: guard -> constant, message dropped", (dir) => {
      const rel = report.found[first].esm[0];
      edit(dir, rel, (s) => compileOut(s).split(messages[first].text).join(""));
      return rel;
    }],
    ["one message deleted from the CJS side only", (dir) => {
      for (const rel of report.found[second].cjs) edit(dir, rel, (s) => s.split(messages[second].text).join(""));
      return report.found[second].cjs[0];
    }],
    ["an import.meta.env read left in an ESM chunk", (dir) => {
      const rel = report.found[first].esm[0];
      edit(dir, rel, (s) => `${s}\nexport const __planted = import.meta.env.DEV;\n`);
      return rel;
    }],
    ["a CJS warning shipped with its guard gone", (dir) => {
      const rel = report.found[second].cjs[0];
      edit(dir, rel, compileOut);
      return rel;
    }],
  ];

  let ok = true;
  for (const [name, plant] of plants) {
    const { target, fails } = withCopy(plant);
    const named = fails.some((f) => f.includes(target));
    if (fails.length && named) {
      console.log(`✓ caught: ${name} (${target})`);
      for (const f of fails) console.log(`    ${f.replace(/\n\s*/g, " — ")}`);
    } else {
      ok = false;
      console.error(`✗ not caught: ${name} (${target}) — ${fails.length ? "failed without naming the file" : "passed"}`);
      for (const f of fails) console.error(`    ${f}`);
    }
  }
  if (!ok) process.exit(1);
  console.log(`self-check OK: ${plants.length} of ${plants.length} plants caught against ${messages.length} messages`);
}

if (process.argv.includes("--self-check")) selfCheck();
else gate();
