#!/usr/bin/env node
/**
 * The e2e release gate: every Playwright project, each as its own invocation.
 *
 * `playwright test` across all six projects is roughly forty minutes, which
 * exceeds the task limit of at least one environment this repo is developed in
 * — two attempts were killed partway, at 418 and 384 of 2076 tests. A gate that
 * cannot be run is worse than no gate, because the record says it passed and
 * nobody can check.
 *
 * So the matrix is a sequence of independent runs whose verdicts persist. Each
 * project is one `playwright test --project=<name>`, reconciled on its own by
 * `e2e/_reconcile-reporter.ts` and recorded to disk as it finishes. Run the
 * whole thing if the environment allows; run `--project` one at a time if it
 * does not; then `--report` aggregates. The aggregate verdict is the gate.
 *
 * Two rules keep the persistence from becoming a scoreboard:
 *
 * - A recorded verdict is tied to a fingerprint of `src/` and `e2e/`. Change
 *   either and that verdict is stale, and stale verdicts do not count.
 * - A project that collected zero tests fails. A filter that matches nothing
 *   is not a pass, and that is exactly how a suite stops being a gate.
 */
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, existsSync, readdirSync, mkdtempSync, rmSync } from "node:fs";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";

const ROOT = process.cwd();
const STATE = resolve(ROOT, "e2e/.matrix-state.json");

/** Projects, in the order they run. Read from the config so it cannot drift. */
function projectNames() {
  const config = readFileSync(resolve(ROOT, "playwright.config.ts"), "utf8");
  const names = [...config.matchAll(/^\s*name:\s*"([^"]+)"/gm)].map((m) => m[1]);
  if (names.length === 0) throw new Error("no projects found in playwright.config.ts");
  return names;
}

/**
 * Fingerprint of everything a run's verdict depends on.
 *
 * Content, not mtime. mtime is cheaper and answers "did anything change", but
 * it also answers yes to an edit that was reverted, to a `git checkout`, and to
 * an editor that rewrites on save — each of which would throw away a
 * forty-minute matrix for nothing. Hashing the bytes of `src/` and `e2e/` is
 * 865 files and 45 MB, which measures at 0.2s: free, next to the suite it
 * guards.
 */
function fingerprint() {
  const hash = createHash("sha256");
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true }).sort((a, b) =>
      a.name < b.name ? -1 : 1,
    )) {
      if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
      const path = join(dir, entry.name);
      if (entry.isDirectory()) walk(path);
      else {
        hash.update(path);
        hash.update(readFileSync(path));
      }
    }
  };
  walk(resolve(ROOT, "src"));
  walk(resolve(ROOT, "e2e"));
  hash.update(readFileSync(resolve(ROOT, "playwright.config.ts")));
  return hash.digest("hex").slice(0, 16);
}

function loadState() {
  if (!existsSync(STATE)) return { fingerprint: null, projects: {} };
  try {
    return JSON.parse(readFileSync(STATE, "utf8"));
  } catch {
    return { fingerprint: null, projects: {} };
  }
}

function saveState(state) {
  writeFileSync(STATE, `${JSON.stringify(state, null, 2)}\n`, "utf8");
}

function runProject(name) {
  const dir = mkdtempSync(join(tmpdir(), "e2e-matrix-"));
  const jsonPath = join(dir, "reconcile.json");
  process.stdout.write(`\n▸ ${name}\n`);

  const started = Date.now();
  const result = spawnSync(
    "npx",
    ["playwright", "test", `--project=${name}`],
    {
      stdio: "inherit",
      env: { ...process.env, PLAYWRIGHT_BROWSERS_PATH: "0", E2E_RECONCILE_JSON: jsonPath },
    },
  );
  const seconds = Math.round((Date.now() - started) / 1000);

  let report = null;
  if (existsSync(jsonPath)) {
    report = JSON.parse(readFileSync(jsonPath, "utf8"));
  }
  rmSync(dir, { recursive: true, force: true });

  // No report at all means the run died before the reporter ran — killed,
  // crashed, or the config failed to load. That is not a pass.
  if (!report) {
    return {
      ok: false,
      seconds,
      collected: 0,
      executed: 0,
      reason: `no reconciliation was written (exit ${result.status ?? "signal " + result.signal})`,
    };
  }

  const passed =
    report.reconciled && report.collected > 0 && (result.status ?? 1) === 0;
  return {
    ok: passed,
    seconds,
    collected: report.collected,
    executed: report.executed,
    byStatus: report.byStatus,
    exit: result.status,
    reason: passed
      ? null
      : report.collected === 0
        ? "collected nothing"
        : `${report.notPassed} test(s) did not pass`,
  };
}

function printReport(state, names) {
  const current = fingerprint();
  const rows = [];
  let allOk = true;
  let totalCollected = 0;
  let totalExecuted = 0;
  const totals = {};

  for (const name of names) {
    const record = state.projects[name];
    const stale = record && state.fingerprint !== current;

    if (!record) {
      rows.push([name, "NOT RUN", "-", "-", "-"]);
      allOk = false;
      continue;
    }
    if (stale) {
      rows.push([name, "STALE", String(record.collected), String(record.executed), "src or e2e changed since"]);
      allOk = false;
      continue;
    }
    totalCollected += record.collected;
    totalExecuted += record.executed;
    for (const [k, v] of Object.entries(record.byStatus ?? {})) {
      totals[k] = (totals[k] ?? 0) + v;
    }
    if (!record.ok) allOk = false;
    rows.push([
      name,
      record.ok ? "pass" : "FAIL",
      String(record.collected),
      String(record.executed),
      record.reason ?? `${record.seconds}s`,
    ]);
  }

  const widths = [0, 1, 2, 3, 4].map((i) =>
    Math.max(...rows.map((r) => r[i].length), ["project", "verdict", "collected", "executed", "note"][i].length),
  );
  const line = (cells) => cells.map((c, i) => c.padEnd(widths[i])).join("  ");

  process.stdout.write("\n══ e2e matrix ══════════════════════════════════════════════════\n");
  process.stdout.write(`  ${line(["project", "verdict", "collected", "executed", "note"])}\n`);
  for (const row of rows) process.stdout.write(`  ${line(row)}\n`);
  process.stdout.write(
    `\n  totals: collected ${totalCollected}  executed ${totalExecuted}  ` +
      `${Object.entries(totals).sort().map(([k, v]) => `${k}=${v}`).join(" ")}\n`,
  );
  process.stdout.write(
    allOk
      ? "  RESULT: every project ran and passed\n"
      : "  RESULT: FAILED — the matrix is not green\n",
  );
  process.stdout.write("════════════════════════════════════════════════════════════════\n");
  return allOk;
}

const args = process.argv.slice(2);
const names = projectNames();
const only = args.includes("--project") ? args[args.indexOf("--project") + 1] : null;
const reportOnly = args.includes("--report");
const fresh = args.includes("--fresh");

if (only && !names.includes(only)) {
  process.stderr.write(`unknown project "${only}". Known: ${names.join(", ")}\n`);
  process.exit(2);
}

let state = loadState();
const current = fingerprint();

// Any change to src/ or e2e/ invalidates every recorded verdict at once —
// a matrix half-measured against two different trees is not a matrix.
if (fresh || state.fingerprint !== current) {
  if (!reportOnly) state = { fingerprint: current, projects: {} };
}

if (!reportOnly) {
  for (const name of only ? [only] : names) {
    const record = runProject(name);
    state.projects[name] = record;
    state.fingerprint = current;
    saveState(state);
  }
}

process.exit(printReport(state, names) ? 0 : 1);
