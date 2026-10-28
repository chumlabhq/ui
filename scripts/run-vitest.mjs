#!/usr/bin/env node
/**
 * Vitest, with the verdict read from the reconciliation rather than from the
 * tail of its output.
 *
 * `src/test/reconcile-reporter.ts` names every non-pass and writes a
 * machine-readable twin; a reporter cannot set vitest's exit code, so this
 * reads that file and decides. It is the same division as
 * `run-e2e-matrix.mjs` and `_reconcile-reporter.ts` on the browser side, and
 * for the same reason: a gate that scrapes its own console output breaks the
 * first time someone rewords a line.
 *
 * Every skip is held to vitest.skips.json the same way. A skipped test reads
 * as neither a pass nor a failure in every summary vitest prints, so a new
 * skip, or an old one that quietly grew, passed unnoticed: 66 tests across
 * four sites were skipped with nothing recording why.
 *
 *   node scripts/run-vitest.mjs [vitest args…]
 *   node scripts/run-vitest.mjs --self-check   plant a failure and a skip, require both named
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/**
 * How many tests a full run collects. A floor, not a target: raise it when
 * tests are added — `node scripts/run-vitest.mjs` prints the current number on
 * every run.
 *
 * Files have no constant. Each project's include globs are listed before the
 * run (`vitest list --filesOnly`, which globs and runs nothing), and every
 * matched file must report. A lost file is indistinguishable from a passing
 * one in every summary vitest prints, and a constant only noticed the loss once
 * it outgrew the slack: when a forks worker failed to start, the run reported
 * 106 of 107 files and cleared a floor of 92.
 *
 * 4749 from 2026-09-08 (032eb67f) to 2026-10-20, while the suite grew to 5497:
 * 748 tests could have stopped being collected without this noticing. Raised
 * to the measured count in G1; the per-file basis is the `unit+contracts` row
 * of docs/adr/002-gate-populations.json's `$basisChanges`. 5502 at M1-L1:
 * Toast's five Pause on Focus tests. 5514 at M2: Modal's missing-name
 * warning and CountryFlagGroup's unstyled. 5536 at A2a: the direction
 * reader, scroll-lock side and physical-direction contracts. 5558 at A2b:
 * right-to-left placement in the shared positioner, Tooltip's align and
 * Table's filter panel, which also follows its trigger on a resize.
 */
const SUITE_FLOOR = { tests: 5571 };

const args = process.argv.slice(2).filter((a) => a !== "--self-check");
const selfCheck = process.argv.includes("--self-check");

/** A path or a `-t` filter means a subset, and a subset has no floor. */
const filtered = args.some((a) => !a.startsWith("-")) || args.includes("-t");

/** Every file the projects' include globs match for these arguments, as `project:path`. */
function matchedFiles(extra) {
  const dir = mkdtempSync(join(tmpdir(), "vitest-list-"));
  const jsonPath = join(dir, "files.json");
  const result = spawnSync(
    "npx",
    // A `-t` filter narrows tests, not files, so it is left off the listing.
    ["vitest", "list", "--filesOnly", `--json=${jsonPath}`, ...extra.filter((a, i) => a !== "-t" && extra[i - 1] !== "-t")],
    { cwd: ROOT, stdio: "pipe" },
  );
  const listed = existsSync(jsonPath) ? JSON.parse(readFileSync(jsonPath, "utf8")) : null;
  rmSync(dir, { recursive: true, force: true });
  if (!listed) {
    throw new Error(`vitest list wrote no file list (exit ${result.status}):\n${result.stderr}`);
  }
  return listed.map((f) => `${f.projectName}:${f.file.replace(`${ROOT}/`, "")}`);
}

function runVitest(extra, { inherit = true } = {}) {
  const dir = mkdtempSync(join(tmpdir(), "vitest-reconcile-"));
  const jsonPath = join(dir, "reconcile.json");
  const result = spawnSync("npx", ["vitest", "run", ...extra], {
    cwd: ROOT,
    stdio: inherit ? "inherit" : "pipe",
    env: { ...process.env, VITEST_RECONCILE_JSON: jsonPath },
  });
  const report = existsSync(jsonPath) ? JSON.parse(readFileSync(jsonPath, "utf8")) : null;
  rmSync(dir, { recursive: true, force: true });
  return { report, status: result.status ?? 1 };
}

const SKIPS_PATH = join(ROOT, "vitest.skips.json");
const TEST_BASES = new Set(["it", "test", "describe", "suite"]);
const MODIFIERS = new Set(["skip", "skipIf", "runIf", "todo"]);
const text = (node, source) => node.getText(source).replace(/\s+/g, " ").trim();

/** `it.runIf` as ["it", "runIf"]; null unless every link is a plain property access. */
function chain(expr) {
  const names = [];
  let e = expr;
  while (ts.isPropertyAccessExpression(e)) {
    names.unshift(e.name.text);
    e = e.expression;
  }
  return ts.isIdentifier(e) ? [e.text, ...names] : null;
}

/** The nearest call that registers a test or suite: `it(…)`, `it.runIf(…)(…)`, `describe.each(…)(…)`. */
function enclosingTest(node) {
  for (let p = node.parent; p; p = p.parent) {
    if (!ts.isCallExpression(p)) continue;
    let callee = p.expression;
    while (ts.isCallExpression(callee)) callee = callee.expression;
    const c = chain(callee);
    if (c && TEST_BASES.has(c[0])) return p;
  }
  return null;
}

/**
 * Every place in these files that can skip a test, as `{ file, site, line, from, to }`.
 *
 * `from`/`to` is the span of the call that registers the tests, so a skipped
 * test's reported line (vitest's is where the test call is, not the modifier)
 * lands inside its site's span wherever the line breaks fall.
 */
function scanSkipSites(files) {
  const sites = [];
  for (const file of files) {
    const source = ts.createSourceFile(file, readFileSync(join(ROOT, file), "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const lineOf = (pos) => source.getLineAndCharacterOfPosition(pos).line + 1;
    const add = (site, at, span) =>
      sites.push({ file, site, line: lineOf(at.getStart(source)), from: lineOf(span.getStart(source)), to: lineOf(span.getEnd()) });
    const visit = (node) => {
      if (ts.isCallExpression(node)) {
        const c = chain(node.expression);
        const first = node.arguments[0] ? text(node.arguments[0], source) : "";
        if (c && TEST_BASES.has(c[0]) && c.slice(1).some((m) => MODIFIERS.has(m))) {
          let span = node;
          while (span.parent && (ts.isCallExpression(span.parent) || ts.isPropertyAccessExpression(span.parent)) && span.parent.expression === span) span = span.parent;
          add(`${c.join(".")}(${first})`, node, span);
        } else if (c && TEST_BASES.has(c[0])) {
          const option = node.arguments.find((a) => ts.isObjectLiteralExpression(a) && a.properties.some((p) => p.name && ["skip", "todo"].includes(p.name.getText(source))));
          if (option) add(`${c.join(".")}(${first}, ${text(option, source)})`, node, node);
        } else if (c && c[c.length - 1] === "skip" && (c.length === 1 || !TEST_BASES.has(c[0]))) {
          const test = enclosingTest(node);
          if (test) add(`${c.join(".")}(${first})`, node, test);
        }
      }
      ts.forEachChild(node, visit);
    };
    visit(source);
  }
  return sites;
}

/**
 * Holds the run's skips to the list. `files` is what this run covers; an entry
 * for a file outside it is checked only on a full run. Counts, names and the
 * CAPABILITY derivation are held only on a full run, because a filter changes
 * them.
 */
function auditSkips({ files, list, report, full }) {
  const problems = [];
  const sites = scanSkipSites(files);
  const key = (f, site) => `${f}\u0000${site}`;
  const listed = new Map(list.sites.map((e) => [key(e.file, e.site), e]));
  const seen = new Map();
  for (const site of sites) {
    const k = key(site.file, site.site);
    if (seen.has(k)) problems.push(`two skip sites with the same text, so neither can be listed: ${site.file}:${site.line} ${site.site}`);
    seen.set(k, site);
    if (!listed.has(k)) problems.push(`unlisted skip site ${site.file}:${site.line}  ${site.site}  — add it to vitest.skips.json with its reason`);
  }
  const covered = new Set(files);
  for (const entry of list.sites) {
    if ((full || covered.has(entry.file)) && !seen.has(key(entry.file, entry.site))) {
      problems.push(`stale vitest.skips.json entry: ${entry.file}  ${entry.site} is no longer in the source`);
    }
  }
  const measured = new Map();
  let audited = 0;
  const skippedTests = report?.skippedTests ?? [];
  for (const t of skippedTests) {
    const owner = sites
      .filter((s) => s.file === t.file && t.line !== null && s.from <= t.line && t.line <= s.to)
      .sort((a, b) => a.to - a.from - (b.to - b.from))[0];
    if (!owner) {
      problems.push(`skipped test ${t.file}:${t.line ?? "?"} "${t.title}" comes from no site the scan found`);
      continue;
    }
    const k = key(owner.file, owner.site);
    measured.set(k, [...(measured.get(k) ?? []), t]);
    if (listed.has(k)) audited += 1;
  }
  if (full && report) {
    for (const entry of list.sites) {
      const k = key(entry.file, entry.site);
      const tests = measured.get(k) ?? [];
      const at = `${entry.file}:${seen.get(k)?.line ?? "?"} ${entry.site}`;
      if (tests.length !== entry.count) problems.push(`skip count moved at ${at}: listed ${entry.count}, skipped ${tests.length}`);
      if (entry.names) {
        const names = tests.map((t) => /'([^']+)'/.exec(t.title)?.[1] ?? t.title).sort();
        if (JSON.stringify(names) !== JSON.stringify([...entry.names].sort())) {
          problems.push(`skipped names moved at ${at}: listed ${entry.names.join(", ")}; skipped ${names.join(", ")}`);
        }
      }
      if (entry.capability) {
        const lines = (report.capabilities ?? []).filter((c) => c.name === entry.capability);
        if (lines.length !== 1) {
          problems.push(`expected one CAPABILITY ${entry.capability} line for ${at}, found ${lines.length}`);
        } else {
          const [c] = lines;
          const derived = c.expected === null ? c.skipped : c.ran + c.skipped - c.expected;
          if (derived !== entry.count) {
            problems.push(`CAPABILITY ${entry.capability} gives ${derived} skipped (population ${c.ran + c.skipped}${c.expected === null ? "" : ` minus declared ${c.expected}`}), listed ${entry.count}`);
          }
        }
      }
    }
  }
  return { problems, skipped: skippedTests.length, audited, sites: sites.length };
}

const skipList = () => JSON.parse(readFileSync(SKIPS_PATH, "utf8"));

if (selfCheck) {
  const spec = join(ROOT, "src", "__tests__", "planted-non-pass.test.ts");
  writeFileSync(
    spec,
    [
      'import { describe, expect, it } from "vitest";',
      "",
      'describe("planted", () => {',
      '  it("planted failure", () => {',
      "    expect(1, \"planted\").toBe(2);",
      "  });",
      '  it.skip("planted skip", () => {});',
      "});",
      "",
    ].join("\n"),
    "utf8",
  );
  let ok = false;
  try {
    const { report } = runVitest([spec, "--project=unit"]);
    const named = (report?.notPassedTests ?? []).find(
      (t) =>
        t.state === "failed" &&
        t.title.includes("planted failure") &&
        /planted-non-pass\.test\.ts$/.test(t.file) &&
        typeof t.line === "number",
    );
    const relSpec = spec.replace(`${ROOT}/`, "");
    const list = skipList();
    const planted = auditSkips({ files: [relSpec], list, report, full: false });
    const plantedSkip = planted.problems.find((p) => p.startsWith(`unlisted skip site ${relSpec}:`) && p.includes('it.skip("planted skip")'));
    const listedFiles = [...new Set(list.sites.map((e) => e.file))];
    const clean = auditSkips({ files: listedFiles, list, report: null, full: false });
    const [removed, ...rest] = list.sites;
    const deleted = auditSkips({ files: listedFiles, list: { ...list, sites: rest }, report: null, full: false });
    const deletedNamed = deleted.problems.find((p) => p.startsWith(`unlisted skip site ${removed.file}:`) && p.includes(removed.site));
    process.stdout.write("\n══ vitest reconciliation self-check ════════════════════════════\n");
    process.stdout.write(
      named
        ? `  named   a failing test  →  ${named.file}:${named.line}  ${named.title}\n`
        : "  NOT NAMED  a failing test — a failure was counted and not named\n",
    );
    process.stdout.write(
      plantedSkip
        ? `  named   a planted it.skip  →  ${plantedSkip}  (skipped ${planted.skipped}, audited ${planted.audited})\n`
        : "  NOT NAMED  a planted it.skip\n",
    );
    process.stdout.write(
      clean.problems.length === 0
        ? `  clean   the list as committed: ${clean.sites} sites found, ${list.sites.length} listed, 0 problems\n`
        : `  NOT CLEAN  the list as committed:\n${clean.problems.map((p) => `    ${p}\n`).join("")}`,
    );
    process.stdout.write(
      deletedNamed
        ? `  named   a deleted list entry  →  ${deletedNamed}\n`
        : `  NOT NAMED  a deleted list entry (${removed.site})\n`,
    );
    ok = Boolean(named) && Boolean(plantedSkip) && clean.problems.length === 0 && Boolean(deletedNamed);
    process.stdout.write(
      ok
        ? "  RESULT: a non-pass names its file, line and title; an unlisted skip site fails the run\n"
        : "  RESULT: FAILED\n",
    );
    process.stdout.write("════════════════════════════════════════════════════════════════\n");
  } finally {
    // Before the exit, not after: `process.exit` inside the `try` skips this,
    // and the planted spec was left behind for the next full run to collect.
    rmSync(spec, { force: true });
  }
  process.exit(ok ? 0 : 1);
}

const expected = matchedFiles(args);
const { report, status } = runVitest(args);
const problems = [];
const skips = auditSkips({
  files: [...new Set(expected.map((f) => f.slice(f.indexOf(":") + 1)))],
  list: skipList(),
  report,
  full: !filtered,
});
/** Matched files that reported no test: never loaded, or loaded and collected nothing. */
const reported = new Set(
  (report?.modules ?? []).filter((m) => m.tests > 0).map((m) => `${m.project}:${m.file}`),
);
const missing = expected.filter((f) => !reported.has(f));

if (!report) {
  problems.push(`no reconciliation was written (vitest exited ${status})`);
} else {
  if (report.notPassed > 0) problems.push(`${report.notPassed} test(s) did not pass`);
  if (report.executed !== report.collected) {
    problems.push(
      `${report.collected - report.executed} collected test(s) never reported a result`,
    );
  }
  if (missing.length > 0) {
    problems.push(
      `${missing.length} matched file(s) reported no result — a file that stops reporting ` +
        "reads exactly like a file whose tests all passed:",
      ...missing.map((f) => `    ${f}`),
    );
  }
  if (!filtered && report.collected < SUITE_FLOOR.tests) {
    problems.push(`collected ${report.collected} tests, floor ${SUITE_FLOOR.tests}`);
  }
  problems.push(...skips.problems);
  if (skips.skipped !== skips.audited && skips.problems.length === 0) {
    problems.push(`skipped ${skips.skipped}, audited ${skips.audited}: a skip no listed site accounts for`);
  }
  if (status !== 0 && problems.length === 0) {
    problems.push(`vitest exited ${status} with nothing in the reconciliation to explain it`);
  }
}

process.stdout.write("\n══ vitest ══════════════════════════════════════════════════════\n");
if (report) {
  process.stdout.write(
    `  files ${report.files}  collected ${report.collected}  executed ${report.executed}  ` +
      `${Object.entries(report.byState).sort().map(([k, v]) => `${k}=${v}`).join(" ")}` +
      `${filtered ? "  (subset — test floor not applied)" : `  test floor ${SUITE_FLOOR.tests}`}\n`,
  );
}
process.stdout.write(
  `  files expected ${expected.length}, reported ${expected.length - missing.length}, missing ${missing.length}\n`,
);
for (const problem of problems) process.stdout.write(`  ${problem}\n`);
const skipLine = `skipped ${skips.skipped}, audited ${skips.audited} (${skips.sites} sites)${filtered ? ", counts not held on a subset" : ""}`;
process.stdout.write(
  problems.length === 0
    ? `  RESULT: every collected test ran and passed; ${skipLine}\n`
    : `  RESULT: FAILED; ${skipLine}\n`,
);
process.stdout.write("════════════════════════════════════════════════════════════════\n");
process.exit(problems.length === 0 ? 0 : 1);
