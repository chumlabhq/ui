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
import { tmpdir, loadavg, freemem, totalmem, platform } from "node:os";

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

/**
 * Projects run as several shards rather than one invocation, with the reason.
 *
 * Firefox has never completed this suite green in one process. What the runs
 * actually show, across a 4-worker matrix run and three 1-worker runs:
 *
 * - At 4 workers: 11 non-passing, 8 of them 30s timeouts on `page.goto`,
 *   `waitForLoadState` or "Target page, context or browser has been closed".
 * - At 1 worker: those eleven pass, but each run still failed one or two
 *   DIFFERENT tests, always a 30s timeout, always on something trivial — one
 *   was three clicks on two switches. Every one of them passes in isolation.
 *
 * So fewer workers reduced the failure count without removing the cause, and a
 * green Firefox run has not been produced at any worker count. The failures are
 * not attributable to any test: a test that passes alone, fails once in a long
 * run, and is a different test next time is reporting on the run, not on
 * itself.
 *
 * It is not the dev server either. Chromium and Mobile Chrome ran 419/419 at
 * the same 4 workers against the same single Vite instance.
 *
 * What is left is browser lifetime. At `--workers=1` one Firefox process serves
 * all 428 tests for roughly 25 minutes; workers and lifetime are the same lever
 * at different strengths, which is why tuning workers moved the number without
 * settling it. Sharding attacks the lifetime directly: four invocations of
 * ~107 tests, each a fresh process, each reconciled on its own.
 *
 * This bounds the problem rather than hiding it. A defect that needed 300 tests
 * of accumulated process state to appear is still a defect; what sharding
 * claims is that no *test* needs more than ~107 tests of it, and the aggregate
 * below refuses to call the project green unless all four shards pass and each
 * one collected something.
 */
const SHARDS = new Map([
  ["firefox", 4],
]);

/**
 * Projects whose failures are recorded rather than blocking, with the reason.
 *
 * Empty, and the emptying is the point.
 *
 * Firefox sat here from 2026-09-05 to 2026-09-08 on this reason: "30s harness
 * timeouts, never a failed assertion". Across four attempts every Firefox
 * non-pass had been a 30-second timeout on a test that passes in isolation in
 * under three seconds, concentrated in `pagination.spec.ts`, and never a wrong
 * value or a missing element. "Never an assertion" was the whole argument for
 * calling it environmental.
 *
 * It was false, and what disproved it was a gate precise enough to disagree.
 * `wcag-layout.spec.ts` read computed style in the same tick as `.focus()`, so
 * Firefox returned the pre-transition value where Chromium returned the target,
 * and SC 2.4.7 had been passing by engine rather than by evidence. Fixing it
 * produced exactly the failed assertion the waiver said had never happened —
 * and then, with the gate able to see, a green Firefox: all four shards, twice
 * on 2026-09-08, on merit.
 *
 * Two harness fixes carried the rest: `menu-focus.spec.ts` mounts five times in
 * one test and needed the budget rather than a longer wait (`test.slow()`), and
 * the fixture index now stamps readiness so a spec cannot enumerate an empty
 * page under load. Every engine had both defects; Firefox was the slowest and
 * therefore the first to show them.
 *
 * So the reduction in coverage is over: a Firefox regression fails the matrix
 * again, like every other project. The history stays because the lesson is not
 * about Firefox — a waiver survives exactly as long as nothing is sharp enough
 * to contradict its reason, and this one survived five weeks.
 */
const KNOWN_UNSTABLE = new Map();

/**
 * What the machine had when the project started.
 *
 * Recorded because load has now been the explanation for a red matrix twice,
 * and both times it took a separate measurement afterwards to establish that —
 * by which point the machine had moved on. A run that cannot be interpreted
 * without a second run is not a record.
 *
 * Swap, not just load average. On 2026-09-08 three projects went red on a tree
 * that was green hours earlier, and the cause was 6.5 GB of 7 GB of swap in use
 * on an 8 GB machine: four Firefox workers could not launch inside 180 seconds.
 * Load average was 20, which is unremarkable for a four-worker run and said
 * nothing. Free memory said everything.
 */
function machine() {
  const mb = (bytes) => Math.round(bytes / 1048576);
  const snapshot = {
    load1: Number(loadavg()[0].toFixed(2)),
    freeMb: mb(freemem()),
    totalMb: mb(totalmem()),
    swapUsedMb: null,
    swapFreeMb: null,
  };

  if (platform() === "darwin") {
    const out = spawnSync("sysctl", ["-n", "vm.swapusage"], { encoding: "utf8" }).stdout ?? "";
    const used = /used = ([\d.]+)M/.exec(out);
    const free = /free = ([\d.]+)M/.exec(out);
    if (used) snapshot.swapUsedMb = Math.round(Number(used[1]));
    if (free) snapshot.swapFreeMb = Math.round(Number(free[1]));
  }

  return snapshot;
}

/** One line, for the table's own column and for the per-project header. */
function machineLine(m) {
  if (!m) return "";
  const swap = m.swapFreeMb == null ? "" : `, swap free ${m.swapFreeMb}MB`;
  return `load ${m.load1}, free ${m.freeMb}MB of ${m.totalMb}MB${swap}`;
}

/** One `playwright test` invocation, reconciled on its own. */
function runInvocation(name, extraArgs, label) {
  const dir = mkdtempSync(join(tmpdir(), "e2e-matrix-"));
  const jsonPath = join(dir, "reconcile.json");
  const before = machine();
  process.stdout.write(`\n▸ ${label}   [${machineLine(before)}]\n`);

  const started = Date.now();
  const result = spawnSync(
    "npx",
    ["playwright", "test", `--project=${name}`, ...extraArgs],
    {
      stdio: "inherit",
      env: { ...process.env, PLAYWRIGHT_BROWSERS_PATH: "0", E2E_RECONCILE_JSON: jsonPath },
    },
  );
  const seconds = Math.round((Date.now() - started) / 1000);

  let report = null;
  if (existsSync(jsonPath)) report = JSON.parse(readFileSync(jsonPath, "utf8"));
  rmSync(dir, { recursive: true, force: true });

  // No report at all means the run died before the reporter ran — killed,
  // crashed, or the config failed to load. That is not a pass.
  if (!report) {
    return {
      ok: false,
      seconds,
      machine: before,
      collected: 0,
      executed: 0,
      reason: `no reconciliation was written (exit ${result.status ?? "signal " + result.signal})`,
    };
  }

  const passed = report.reconciled && report.collected > 0 && (result.status ?? 1) === 0;
  return {
    ok: passed,
    seconds,
    machine: before,
    collected: report.collected,
    executed: report.executed,
    byStatus: report.byStatus,
    // Carried through to the summary: the table says how many did not pass, and
    // the thing you need is which.
    notPassedTests: report.notPassedTests ?? [],
    exit: result.status,
    reason: passed
      ? null
      : report.collected === 0
        ? "collected nothing"
        : `${report.notPassed} test(s) did not pass`,
  };
}

function runProject(name) {
  const shards = SHARDS.get(name);
  if (!shards) return runInvocation(name, [], name);

  const results = [];
  for (let shard = 1; shard <= shards; shard += 1) {
    results.push(runInvocation(name, [`--shard=${shard}/${shards}`], `${name} ${shard}/${shards}`));
  }

  // Every shard, not the sum. A sharded project that passed three of four is
  // not three-quarters green, and a shard that collected nothing has the same
  // failure mode the whole-project check already refuses — a filter that
  // matches nothing is not a pass.
  const empty = results.filter((r) => r.collected === 0).length;
  const failed = results.filter((r) => !r.ok).length;
  const byStatus = {};
  for (const result of results) {
    for (const [status, count] of Object.entries(result.byStatus ?? {})) {
      byStatus[status] = (byStatus[status] ?? 0) + count;
    }
  }

  // The tightest moment any shard saw, not the first: a project is red because
  // of its worst minute, and averaging that away is how the evidence is lost.
  const machines = results.map((r) => r.machine).filter(Boolean);
  const worst = machines.length
    ? machines.reduce((a, b) => (b.freeMb < a.freeMb ? b : a))
    : null;

  return {
    ok: failed === 0,
    machine: worst,
    notPassedTests: results.flatMap((r) => r.notPassedTests ?? []),
    shards: results.map((r, i) => ({ shard: `${i + 1}/${shards}`, ...r })),
    seconds: results.reduce((total, r) => total + r.seconds, 0),
    collected: results.reduce((total, r) => total + r.collected, 0),
    executed: results.reduce((total, r) => total + r.executed, 0),
    byStatus,
    reason:
      failed === 0
        ? null
        : empty > 0
          ? `${empty} of ${shards} shard(s) collected nothing`
          : `${failed} of ${shards} shard(s) did not pass`,
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
    const unstable = KNOWN_UNSTABLE.get(name);
    if (!record.ok && !unstable) allOk = false;
    rows.push([
      name,
      record.ok ? "pass" : unstable ? "unstable" : "FAIL",
      String(record.collected),
      String(record.executed),
      // "not blocking" only when something actually waives it. The suffix used
      // to be unconditional, so a failing project read as tolerated in the one
      // table anyone reads, while RESULT below correctly said FAILED. It went
      // unnoticed while Firefox was the only failing project and was waived.
      record.ok
        ? `${record.seconds}s`
        : unstable
          ? `${record.reason} — recorded, not blocking`
          : record.reason,
    ]);
    // A sharded project reports its shards too. "3 of 4 shards did not pass"
    // names the count and not which, and which is the thing you need.
    for (const shard of record.shards ?? []) {
      rows.push([
        `  └ ${shard.shard}`,
        shard.ok ? "pass" : "FAIL",
        String(shard.collected),
        String(shard.executed),
        shard.reason ?? `${shard.seconds}s`,
      ]);
    }
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
  // The machine each project ran on, printed whether or not anything failed.
  // A green run's figures are what a later red one is read against, so they are
  // only useful if they are always there.
  const machines = names
    .map((name) => [name, state.projects[name]?.machine])
    .filter(([, m]) => m);
  if (machines.length) {
    process.stdout.write("\n  machine at each project's start:\n");
    const width = Math.max(...machines.map(([name]) => name.length));
    for (const [name, m] of machines) {
      process.stdout.write(`    ${name.padEnd(width)}  ${machineLine(m)}\n`);
    }
    // Lowest swap, not lowest free memory. The first cut of this warning picked
    // the project with the least free RAM and then read ITS swap figure, which
    // is a different project — so the run whose swap fell to 846MB printed no
    // warning at all. A gate that reports the wrong row is the thing this file
    // exists to prevent.
    const swaps = machines.filter(([, m]) => m.swapFreeMb != null);
    const tightest = swaps.length
      ? swaps.reduce((a, b) => (b[1].swapFreeMb < a[1].swapFreeMb ? b : a))
      : null;
    if (tightest && tightest[1].swapFreeMb < 1024) {
      process.stdout.write(
        `\n  Swap fell to ${tightest[1].swapFreeMb}MB during ${tightest[0]}. A browser that\n` +
          `  cannot launch inside its timeout fails tests that have nothing wrong with them —\n` +
          `  read any non-pass against this before reading it as a defect.\n`,
      );
    }
  }

  // Which, not how many. Printed after the table so the last thing on screen
  // before the verdict is the list of tests to open.
  for (const name of names) {
    const record = state.projects[name];
    for (const test of record?.notPassedTests ?? []) {
      process.stdout.write(
        `\n  ${name}: ${test.status} ${test.where}  ${test.title}` +
          (test.project && test.project !== name ? `  [${test.project}]` : ""),
      );
    }
  }
  if (names.some((n) => (state.projects[n]?.notPassedTests ?? []).length > 0)) {
    process.stdout.write("\n");
  }

  const unstableRan = names.filter(
    (n) => KNOWN_UNSTABLE.has(n) && state.projects[n] && !state.projects[n].ok,
  );
  for (const name of unstableRan) {
    process.stdout.write(`\n  ${name} is recorded as known-unstable and did not gate this run:\n    ${KNOWN_UNSTABLE.get(name)}\n`);
  }
  process.stdout.write(
    allOk
      ? unstableRan.length > 0
        ? `  RESULT: every gating project passed (${unstableRan.join(", ")} unstable, recorded)\n`
        : "  RESULT: every project ran and passed\n"
      : "  RESULT: FAILED — the matrix is not green\n",
  );
  process.stdout.write("════════════════════════════════════════════════════════════════\n");
  return allOk;
}

/**
 * Plants a failure and a timeout, and requires the reconciliation to name both.
 *
 * The summary reported `timedOut=1` and nothing else, which cost two full suite
 * re-runs to answer — and the second one deleted the artifacts the first had
 * written. A reporter that can name a non-pass has to be shown naming one.
 */
function selfCheck() {
  const spec = resolve(ROOT, "e2e/planted-non-pass.spec.ts");
  const dir = mkdtempSync(join(tmpdir(), "e2e-selfcheck-"));
  const jsonPath = join(dir, "reconcile.json");
  writeFileSync(
    spec,
    [
      'import { test, expect } from "@playwright/test";',
      "",
      'test("planted failure", async () => {',
      "  expect(1, \"planted\").toBe(2);",
      "});",
      "",
      'test("planted timeout", async () => {',
      "  test.setTimeout(1200);",
      "  await new Promise(() => {});",
      "});",
      "",
    ].join("\n"),
    "utf8",
  );

  try {
    spawnSync("npx", ["playwright", "test", "--project=chromium", spec, "--workers=2"], {
      stdio: "inherit",
      env: { ...process.env, PLAYWRIGHT_BROWSERS_PATH: "0", E2E_RECONCILE_JSON: jsonPath },
    });
    const report = existsSync(jsonPath) ? JSON.parse(readFileSync(jsonPath, "utf8")) : null;
    const named = report?.notPassedTests ?? [];
    const outcomes = [
      {
        plant: "a failing test",
        caught: named.some(
          (t) =>
            t.status === "failed" &&
            t.title === "planted failure" &&
            /planted-non-pass\.spec\.ts:\d+$/.test(t.where),
        ),
      },
      {
        plant: "a timing-out test",
        caught: named.some(
          (t) =>
            t.status === "timedOut" &&
            t.title === "planted timeout" &&
            /planted-non-pass\.spec\.ts:\d+$/.test(t.where),
        ),
      },
    ];

    // The message has to survive the process, not just reach stdout. A killed
    // matrix left 23 failure directories and no reason, three times.
    const log = join(ROOT, "test-results", "non-passes.log");
    const logged = existsSync(log) ? readFileSync(log, "utf8") : "";
    outcomes.push({
      plant: "the failure's message on disk",
      caught: /planted/.test(logged) && /planted failure/.test(logged),
    });
    const failureFiles = existsSync(join(ROOT, "test-results"))
      ? readdirSync(join(ROOT, "test-results"))
          .filter((d) => /planted/.test(d))
          .map((d) => join(ROOT, "test-results", d, "failure.md"))
          .filter((f) => existsSync(f))
      : [];
    outcomes.push({
      plant: "a failure.md beside the artifacts",
      caught: failureFiles.some((f) => /planted/.test(readFileSync(f, "utf8"))),
    });

    process.stdout.write("\n══ reconciliation self-check ═══════════════════════════════════\n");
    for (const outcome of outcomes) {
      if (outcome.plant.startsWith("the failure's") || outcome.plant.startsWith("a failure.md")) {
        process.stdout.write(`  ${outcome.caught ? "written" : "MISSING  "}  ${outcome.plant}\n`);
        continue;
      }
      const row = named.find((t) => t.title.includes(outcome.plant.includes("failing") ? "failure" : "timeout"));
      process.stdout.write(
        `  ${outcome.caught ? "named " : "NOT NAMED"}  ${outcome.plant}` +
          (row ? `  →  ${row.status} ${row.where}  ${row.title}` : "  →  absent from the report") +
          "\n",
      );
    }
    const ok = outcomes.every((o) => o.caught);
    process.stdout.write(
      ok
        ? "  RESULT: every non-pass named its spec, line and title, and left its message on disk\n"
        : "  RESULT: FAILED — a non-pass was reported without naming it\n",
    );
    process.stdout.write("════════════════════════════════════════════════════════════════\n");
    return ok;
  } finally {
    rmSync(spec, { force: true });
    rmSync(dir, { recursive: true, force: true });
  }
}

const args = process.argv.slice(2);
const names = projectNames();
const only = args.includes("--project") ? args[args.indexOf("--project") + 1] : null;
const reportOnly = args.includes("--report");
const fresh = args.includes("--fresh");

if (args.includes("--self-check")) process.exit(selfCheck() ? 0 : 1);

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
