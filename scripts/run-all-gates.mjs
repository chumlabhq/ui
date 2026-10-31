// Every gate in the repo, in one command.
//
// The gate lists in this branch's prompts were assembled by hand, and that is
// how `Button/loading-on-accent` stayed red for four committed slices: the gate
// existed, the fixture existed, and no list named the spec. A hand-maintained
// list here would reintroduce exactly that, so the registry below is CHECKED
// AGAINST THE REPO — a spec or an assert script that nothing claims fails this
// command before any gate runs.
//
//   npm run gates          everything
//   npm run gates:fast     the fifteen that finish in under ~90s each
//   npm run gates:record   update the population record
//
// THE SPLIT, because the full run is too long to sit through:
//
//   per slice   `npm run gates:fast` — ~2 minutes, fifteen gates. It catches
//               every drift class that does not need a browser: types,
//               generated files out of step, docs naming something that does
//               not exist, a schema default that is not the code's, a
//               population that fell. Run it as often as you like.
//
//   per commit  `npm run gates` — the full set. The browser gates are where
//               the expensive truths live: what is painted, what is hittable,
//               what is measurable, what moved by a pixel. None of them is
//               optional before a commit, and skipping them by hand is how
//               `Button/loading-on-accent` stayed red through four of them.
//
// The one thing `--fast` does NOT weaken is the discovery check: a gate the
// repo has and this script does not run fails both modes, immediately, before
// anything else runs.
//
// Populations are printed and recorded because a gate that walks fewer subjects
// than last time is the failure that looks like a pass: 307 where 308 is right
// is the whole of the finding above. Each one carries its UNIT in the record's
// `$units`, because fall-detection compares integers and cannot see that a gate
// has changed what it counts: `e2e:demo-contrast` moved from colour pairs to
// pages walked and went 41585 to 33, which is a basis change wearing the shape
// of a catastrophic regression. A population with no unit beside it is a number
// two people will read differently.
//
// WHAT THE FULL RUN NEEDS TO COMPLETE, which is a real constraint and not a
// footnote. The browser half runs three playwright projects over ~445 fixtures
// and the consumer matrix builds ten real apps; the peak is `e2e:visual` and
// `e2e:icon-bounds`, each holding a browser plus its screenshot buffers. On
// 2026-09-13 the OS killed this command TWICE in one sitting for low memory —
// once at the summary, once inside `e2e:rest` with the other seventeen gates
// green. The kill is not the first symptom. Under pressure the gates run 3-8x
// their recorded times (`e2e:visual` 296s to 926s, `e2e:demo-contrast` 70s to
// 624s) and START FAILING on timeouts that look like real regressions: that
// first killed run reported six failures and every one of them was green on the
// next run. So:
//
//   - Watch swap, not free pages. Free memory sits near zero on a healthy macOS
//     box and tells you nothing; sustained swap-out during the e2e half is the
//     number that predicts the kill. `vm_stat 5` in another shell, or
//     `sysctl vm.swapusage`.
//   - Before starting, close the browser and the editor's language server —
//     between them they are typically 1-2 GB, which is the margin. A dev server
//     on 5173 can stay: the gates start their own preview.
//   - If it is killed anyway, the failures in that run are not evidence.
//     Re-run before diagnosing anything, and compare the timings above first.
//   - The fallback is series, not a smaller suite: run `npm run gates:fast`,
//     then each browser gate on its own (`--project=visual`, then
//     `e2e/icon-bounds.spec.ts`, then `e2e/demo-contrast.spec.ts`, then the
//     `e2e:rest` list). Same coverage, one browser resident at a time. Say in
//     the commit that it was run in pieces, because a run split across
//     invocations is not the same evidence as one that completed.
//
// A 35-minute command that gets killed twice is a command people stop running,
// which is why this is here rather than in someone's memory.
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { resolve, dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const FAST = process.argv.includes("--fast");
const RECORD = process.argv.includes("--record");
const POPULATIONS = join(root, "docs/adr/002-gate-populations.json");
/**
 * Failing gates' full output. Not `test-results/`: Playwright owns that
 * directory and empties it at the start of every run, so a log written there
 * lasted only until the next browser gate began.
 */
const LOG_DIR = join(root, "gate-logs");

const pw = (args) => `PLAYWRIGHT_BROWSERS_PATH=0 npx playwright test ${args}`;

/**
 * `slow` is wall-clock over ~90s, measured, and is what `--fast` drops.
 * `pop` pulls the population out of the gate's own output: the number that says
 * how much it looked at, not whether it liked what it saw.
 */
const GATES = [
  // ── cheap: seconds ────────────────────────────────────────────────────
  { id: "typecheck", claims: { script: "assert-typecheck.mjs" }, cmd: "npm run typecheck" },
  /**
   * CI's static job runs `npm run lint` and no gate here did, so a slice was
   * green locally while every push was red on lint from 2026-10-11 on: an
   * unused import and a component created during render, neither visible to tsc.
   */
  { id: "lint", cmd: "npm run lint", claims: {} },
  // The CI failures no local run can reproduce: the runner OS a workflow asks
  // for, and a job that launches a browser it never installed. See the script.
  { id: "ci-runners", cmd: "node scripts/assert-ci-runners.mjs",
    claims: { script: "assert-ci-runners.mjs" }, pop: /✓ (\d+) Playwright job/ },
  { id: "doc-truth", claims: { vitest: "contracts" },
    cmd: "npx vitest run --project=contracts src/__tests__/contracts/doc-truth.contract.test.ts",
    pop: /collected (\d+)/ },
  { id: "demo-coverage", cmd: "node scripts/audit-demo-coverage.mjs --check",
    claims: { script: "audit-demo-coverage.mjs" }, pop: /\((\d+) props/ },
  { id: "demo-scenarios", claims: { vitest: "contracts" },
    cmd: "npx vitest run --project=contracts src/__tests__/contracts/demo-scenarios.contract.test.ts",
    pop: /DEMO_SCENARIOS cells (\d+)/ },
  // Every page's skeleton, and every page's anatomy against the types.
  { id: "demo-skeleton", claims: { vitest: "contracts" },
    cmd: "npx vitest run --project=contracts src/__tests__/contracts/demo-skeleton.contract.test.tsx src/__tests__/contracts/demo-anatomy.contract.test.tsx",
    pop: /DEMO_SKELETON pages (\d+)/ },
  { id: "fixture-gap", cmd: "node scripts/audit-fixture-gap.mjs --check",
    claims: { script: "audit-fixture-gap.mjs" }, pop: /holds at (\d+) props/ },
  { id: "component-docs", cmd: "node scripts/build-component-docs.mjs --check",
    claims: { script: "build-component-docs.mjs" }, pop: /(\d+) components/ },
  { id: "subcomponent-schemas", cmd: "node scripts/build-subcomponent-schemas.mjs --check",
    claims: { script: "build-subcomponent-schemas.mjs" } },
  { id: "guide-claims", cmd: "npm run verify:guide-claims",
    claims: { script: "assert-guide-claims.mjs" } },
  { id: "ssr-record", cmd: "npm run verify:ssr-record",
    claims: { script: "assert-ssr-record.mjs" } },
  /**
   * `npm run build` runs `prebuild` (`npm run build:lib`) before the site, so
   * this is the gate that puts a CURRENT `dist/` and `dist-site/` on disk.
   *
   * The two gates after it read those directories, and both used to run above
   * it. On a fresh checkout they failed; in a working tree they passed by
   * reading whatever build an earlier run had left behind — green because of
   * local state, which is the failure this command exists to stop. `needs` and
   * `provides` are checked against this list before anything runs, so moving
   * one of them back above its build fails there rather than passing on a
   * stale directory.
   */
  { id: "site-build", cmd: "npm run build", claims: {}, provides: ["dist", "dist-site"] },
  { id: "snippet-shape", cmd: "node scripts/build-demo-snippets.mjs --check", needs: ["dist"],
    claims: { script: "build-demo-snippets.mjs" }, pop: /(\d+) of \d+ sections/ },
  { id: "playground-removed", cmd: "npm run verify:playground-removed", needs: ["dist-site"],
    claims: { script: "assert-playground-removed.mjs" } },

  // ── medium ────────────────────────────────────────────────────────────
  { id: "library-build+bundle", slow: true, provides: ["dist"],
    cmd: "npm run build:lib && node scripts/assert-bundle-size.mjs",
    claims: { script: ["assert-bundle-size.mjs", "assert-css-names.mjs", "assert-dev-warnings.mjs", "assert-dist-records.mjs",
      "assert-fixture-bundle.mjs", "assert-flag-bundle.mjs", "assert-packaging.mjs",
      "assert-phone-bundle.mjs", "assert-styles-bundle.mjs"] },
    pop: /(\d+) built files/ },
  // `snippets` mounts every copy-paste snippet against dist/, so this reads the
  // build the entry above provides. One run of vitest runs all three projects;
  // a separate entry for the mount gate would run it twice.
  { id: "unit+contracts", slow: true, cmd: "node scripts/run-vitest.mjs", needs: ["dist"],
    claims: { vitest: ["unit", "contracts", "snippets"] }, pop: /collected (\d+)/ },

  // ── e2e ───────────────────────────────────────────────────────────────
  { id: "e2e:a11y-full", slow: true, cmd: pw("--project=a11y-full"),
    claims: { spec: ["accessibility-full.spec.ts", "contrast-painted.spec.ts", "default-state.spec.ts"] },
    pop: /collected (\d+)/ },
  { id: "e2e:visual", slow: true, cmd: pw("--project=visual"),
    claims: { spec: ["visual.spec.ts"] }, pop: /collected (\d+)/ },
  { id: "e2e:icon-bounds", slow: true, cmd: pw("e2e/icon-bounds.spec.ts --project=chromium"),
    claims: { spec: ["icon-bounds.spec.ts"] }, pop: /ICON_BOUNDS measured=(\d+)/ },
  { id: "e2e:pointer-affordance", slow: true, cmd: pw("e2e/pointer-affordance.spec.ts --project=chromium"),
    claims: { spec: ["pointer-affordance.spec.ts"] }, pop: /POINTER_AFFORDANCE checked=(\d+)/ },
  { id: "e2e:demo-contrast", slow: true, cmd: pw("e2e/demo-contrast.spec.ts --project=chromium"),
    claims: { spec: ["demo-contrast.spec.ts"] },
    /**
     * PAGES, not rows. The row count moves between runs on the same tree —
     * 41289, 41429, 41445, 41585 observed — because the dropdown pages fetch
     * their country lists over the network and the rows exist only once that
     * lands. The spec's own docblock says so. A ratchet on it fails on network
     * timing; a ratchet on the pages walked fails when the scan covers less,
     * which is the question being asked.
     */
    pop: /DEMO_CONTRAST pages=(\d+)/ },
  /**
   * Every other spec, by running the chromium project rather than naming them.
   * A spec added tomorrow is run tomorrow: playwright routes it here by
   * default, and the discovery check above catches the one case where it would
   * not — a name matching another project's `testMatch`.
   */
  /**
   * The chromium project MINUS the specs another gate already claims.
   *
   * `--project=chromium` alone re-ran `icon-bounds` and `demo-contrast` a
   * second time — eight minutes of duplicated work, and it was the duplicate,
   * running under the load of 31 other specs, that failed while the dedicated
   * gate passed in the same run. A gate that reports a spec twice can report it
   * green and red at once, which is worse than either.
   */
  { id: "e2e:rest", slow: true, claims: { spec: "REST" },
    cmd: () => pw(`--project=chromium ${restSpecs.map((s) => `e2e/${s}`).join(" ")}`),
    pop: /collected (\d+)/ },
];

/** ── the anti-hand-list half ──────────────────────────────────────────── */
const claimed = { spec: new Set(), script: new Set(), vitest: new Set() };
let restClaimsSpecs = false;
for (const g of GATES) {
  for (const [kind, value] of Object.entries(g.claims ?? {})) {
    for (const v of [value].flat()) {
      if (kind === "spec" && v === "REST") { restClaimsSpecs = true; continue; }
      claimed[kind].add(v);
    }
  }
}

/** Scripts that run inside another gate rather than on their own. */
const RUN_BY_ANOTHER = new Set([
  "add-import-extensions.mjs", // a codemod, not a gate
  "build-tokens.mjs",          // runs inside build:lib
]);

const specs = readdirSync(join(root, "e2e")).filter((f) => f.endsWith(".spec.ts"));
const scripts = readdirSync(join(root, "scripts"))
  .filter((f) => /^(assert|audit)-.*\.mjs$/.test(f) || (/^build-.*\.mjs$/.test(f) && hasCheck(f)));
function hasCheck(f) {
  return readFileSync(join(root, "scripts", f), "utf8").includes('"--check"');
}
const vitestProjects = [...readFileSync(join(root, "vitest.config.ts"), "utf8")
  .matchAll(/name: "([a-z]+)"/g)].map((m) => m[1]);

/**
 * A spec `e2e:rest` cannot reach.
 *
 * `e2e:rest` runs the chromium project, which picks up any new spec by
 * default — so a new component spec needs no entry here and is run the day it
 * lands. The exception is a spec whose NAME matches another project's
 * `testMatch`: playwright routes it out of chromium, and if no entry claims it,
 * nothing runs it at all. That is invisible in exactly the way this command
 * exists to prevent, so it is checked against the config rather than assumed.
 */
const config = readFileSync(join(root, "playwright.config.ts"), "utf8");
const routedAway = [...config.matchAll(/testMatch: \/\(?([^,\n]+?)\)?\\\.spec\\\.ts\//g)]
  .flatMap((m) => m[1].split("|"))
  .map((n) => `${n.replace(/[()]/g, "")}.spec.ts`);

const unclaimed = [];
for (const s of specs) {
  if (claimed.spec.has(s)) continue;
  if (routedAway.includes(s)) { unclaimed.push(`e2e/${s} (routed out of chromium by playwright.config.ts, and nothing claims it)`); continue; }
  if (!restClaimsSpecs) unclaimed.push(`e2e/${s}`);
}
for (const s of scripts) if (!claimed.script.has(s) && !RUN_BY_ANOTHER.has(s)) unclaimed.push(`scripts/${s}`);
for (const p of vitestProjects) if (!claimed.vitest.has(p)) unclaimed.push(`vitest project ${p}`);

if (unclaimed.length) {
  process.stderr.write(
    `✗ ${unclaimed.length} gate(s) exist in the repo and no entry in this script runs them.\n` +
      "  A gate nothing here runs is a gate no slice will run — that is the hole this command exists to close.\n" +
      "  Add it to GATES, or to RUN_BY_ANOTHER with the gate that runs it:\n" +
      unclaimed.map((u) => `    ${u}\n`).join(""),
  );
  process.exit(1);
}

/** The specs `e2e:rest` is responsible for, named so the report can show them. */
const restSpecs = specs.filter((s) => !claimed.spec.has(s));

/**
 * A gate that reads a build runs after the gate that makes it, in this run.
 *
 * Checked in the mode being run, because `--fast` drops slow gates and a
 * dependency that holds in the full list can be missing from the fast one.
 */
{
  const built = new Set();
  const misordered = [];
  for (const g of GATES) {
    if (FAST && g.slow) continue;
    for (const need of g.needs ?? []) {
      if (!built.has(need)) misordered.push(`${g.id} reads ${need}/, and no gate before it in this run builds it`);
    }
    for (const made of g.provides ?? []) built.add(made);
  }
  if (misordered.length) {
    process.stderr.write(
      `✗ ${misordered.length} gate(s) would read a build this run did not make:\n` +
        misordered.map((m) => `    ${m}\n`).join("") +
        "  A gate that reads a leftover build passes or fails on local state. Move it below the gate that provides it.\n",
    );
    process.exit(1);
  }
}

/** ── run ──────────────────────────────────────────────────────────────── */
const record = existsSync(POPULATIONS) ? JSON.parse(readFileSync(POPULATIONS, "utf8")) : { populations: {} };

/**
 * Every recorded population states what it counts, and the two cannot drift.
 *
 * A unit map that is allowed to fall behind is worse than none: it reads as
 * authoritative for the entries it still covers and is silent about the one
 * that changed, which is the case it exists for. Checked here rather than in a
 * contract because this is the only thing that reads the file.
 */
{
  const pops = Object.keys(record.populations ?? {});
  const units = Object.keys(record.$units ?? {});
  const missing = pops.filter((k) => !units.includes(k));
  const orphaned = units.filter((k) => !pops.includes(k));
  if (missing.length || orphaned.length) {
    process.stderr.write(
      `✗ ${relative(root, POPULATIONS)}: $units and populations disagree\n` +
        missing.map((k) => `    population with no unit: ${k}\n`).join("") +
        orphaned.map((k) => `    unit for no population: ${k}\n`).join("") +
        "  A population is an integer until something says what it counts.\n",
    );
    process.exit(1);
  }
}
const results = [];
const started = Date.now();
// Logs describe this run only. One left from an earlier run names a gate that
// may pass now, next to a summary that says otherwise.
rmSync(LOG_DIR, { recursive: true, force: true });

for (const g of GATES) {
  if (FAST && g.slow) { results.push({ id: g.id, status: "skipped", ms: 0, pop: null }); continue; }
  const t0 = Date.now();
  let out = "";
  let status = "pass";
  try {
    out = execSync(typeof g.cmd === "function" ? g.cmd() : g.cmd, { cwd: root, encoding: "utf8", stdio: "pipe", maxBuffer: 256 * 1024 * 1024 });
  } catch (e) {
    status = "FAIL";
    out = `${e.stdout ?? ""}${e.stderr ?? ""}`;
  }
  const ms = Date.now() - t0;
  // Flushed per gate: this command runs for tens of minutes, and a progress
  // line that only appears at the end is a progress line nobody sees.
  const m = g.pop ? out.match(g.pop) : null;
  const pop = m ? Number(m[1]) : null;
  results.push({ id: g.id, status, ms, pop, out });
  const mark = status === "pass" ? "✓" : "✗";
  process.stdout.write(`${mark} ${g.id.padEnd(24)} ${String(Math.round(ms / 1000)).padStart(4)}s  population ${pop ?? "—"}\n`);
  if (status === "FAIL") {
    // Written here, not in the summary. A 30-minute run that the OS kills for
    // memory never reaches the summary, and the first attempt at this wrote the
    // logs there — so the one run that most needed reading left nothing at all.
    // The second attempt fixed the timing and kept the location: the logs went
    // to test-results/, which Playwright empties when each browser gate starts,
    // so every failure before e2e:a11y-full was deleted by it. See LOG_DIR.
    writeFileSync(gateLog(g.id), out);
    process.stdout.write(`   └─ ${typeof g.cmd === "function" ? g.cmd() : g.cmd}\n`);
    process.stdout.write(`   └─ full output: ${relative(root, gateLog(g.id))}\n`);
  }
}

/** Where a failing gate's whole output goes, so it outlives the run. */
function gateLog(id) {
  if (!existsSync(LOG_DIR)) mkdirSync(LOG_DIR, { recursive: true });
  return join(LOG_DIR, `gate-${id.replace(/[^a-z0-9]+/gi, "-")}.log`);
}

const failedSoFar = () => results.some((r) => r.status === "FAIL");

/** ── populations: a fall is the failure that looks like a pass ────────── */
/**
 * The pressure check: a gate running far over its recorded time.
 *
 * Two full runs were killed by the OS for memory, and both times the FIRST
 * symptom was not the kill — it was gates running three to nine times their
 * recorded wall-clock and then failing on timeouts that looked like real
 * regressions. One killed run reported six failures and every one was green on
 * the next. That signal was sitting in the timing column and nobody read it,
 * three separate runs in a row, so the runner reads it.
 *
 * The multiple is derived in the record's `$secondsNote`, not picked: the
 * widest healthy spread measured for a single gate is 1.69, the mildest
 * pressure 2.17, and 2.0 is the only round number between them. It warns and
 * does not fail — a slow green gate is still a green gate, and the thing worth
 * saying is that the run's failures may not be about the code.
 */
const SLOWDOWN_FACTOR = 2.0;
const SLOWDOWN_FLOOR_S = 10;
const slow = [];
for (const r of results) {
  if (r.status === "skipped") continue;
  const was = record.seconds?.[r.id];
  const now = r.ms / 1000;
  if (typeof was !== "number" || was < SLOWDOWN_FLOOR_S) continue;
  if (now > was * SLOWDOWN_FACTOR) {
    slow.push(`${r.id}: ${Math.round(now)}s against a recorded ${was}s (${(now / was).toFixed(1)}x)`);
  }
}

const fell = [];
for (const r of results) {
  if (r.pop === null || r.status === "skipped") continue;
  const was = record.populations?.[r.id];
  if (typeof was === "number" && r.pop < was) fell.push(`${r.id}: ${was} → ${r.pop}`);
}
if (RECORD) {
  const next = { ...record.populations };
  const nextSeconds = { ...(record.seconds ?? {}) };
  for (const r of results) if (r.pop !== null && r.status === "pass") next[r.id] = r.pop;
  // Times only from gates that passed, and only when the run was not itself
  // under pressure — recording a pressured number as the baseline is how the
  // check above stops being able to fire.
  if (!slow.length) {
    for (const r of results) if (r.status === "pass") nextSeconds[r.id] = Math.round(r.ms / 1000);
  }
  /**
   * Provenance with the numbers.
   *
   * The first version of this file was seeded by hand from a run that had a
   * failure in it, and nothing in the file said so. A record that does not say
   * what measured it is the thing this whole command exists to stop.
   */
  const skipped = results.filter((r) => r.status === "skipped").length;
  writeFileSync(POPULATIONS, `${JSON.stringify({
    $comment: "How much each gate looked at, last time it passed. A FALL fails `run-all-gates`: a walk that covers fewer subjects than before is the failure that prints a tick. Re-record with `npm run gates:record` when the drop is intended, and say why in the commit.",
    $measuredBy: (skipped
      ? `a --fast run, ${skipped} gate(s) skipped — partial, and the skipped gates keep whatever they were recorded at`
      : "a full run of every gate") +
      ". Read `$units` before comparing any number here to a new one: fall-detection compares integers and cannot see that a gate has changed WHAT it counts.",
    // Carried, not regenerated. These are written by a person and a writer that
    // rebuilt this object from scratch would delete them on the next --record —
    // which is the same class of hole as the record they annotate.
    $units: record.$units ?? {},
    $basisChanges: record.$basisChanges ?? [],
    $secondsNote: record.$secondsNote ?? "",
    // Ratchets are lowered by hand in the change that earns it, and checked by
    // the gate that owns each one; a re-record must not reset or drop them.
    ratchets: record.ratchets ?? {},
    $runWas: failedSoFar() ? "NOT green — some gates failed and were not recorded" : "green",
    recordedOn: new Date().toISOString().slice(0, 10),
    tookMinutes: Number(((Date.now() - started) / 60000).toFixed(1)),
    populations: next,
    seconds: nextSeconds,
  }, null, 2)}\n`);
  process.stdout.write(`\nrecorded ${Object.keys(next).length} populations\n`);
}

const failed = results.filter((r) => r.status === "FAIL");
const mins = ((Date.now() - started) / 60000).toFixed(1);
process.stdout.write(`\n── ${results.length} gates, ${mins} min ──\n`);
process.stdout.write(`   e2e:rest covers ${restSpecs.length} specs: ${restSpecs.join(" ")}\n`);

if (fell.length) {
  process.stderr.write(`\n✗ ${fell.length} population(s) fell — the gate looked at less than last time:\n` +
    fell.map((f) => `    ${f}\n`).join("") +
    "  Re-record with --record only when the drop is intended.\n");
}
if (slow.length) {
  process.stderr.write(
    `\n! ${slow.length} gate(s) ran over ${SLOWDOWN_FACTOR}x their recorded time — the machine was under pressure:\n` +
      slow.map((l) => `    ${l}\n`).join("") +
      "  Failures in this run are suspect. Re-run before diagnosing any of them,\n" +
      "  and see the memory notes at the top of this file.\n",
  );
}
if (failed.length) {
  process.stderr.write(`\n✗ ${failed.length} gate(s) failed: ${failed.map((f) => f.id).join(", ")}\n`);
  /**
   * The excerpt is a reading convenience; the file is the record.
   *
   * This printed the last 25 lines and dropped the rest, which is how
   * `focus-not-obscured` failed three times without once being diagnosed: the
   * spec routes its findings to stdout precisely so they outlive playwright's
   * `test-results/`, and they were captured here and discarded a line later.
   * A gate whose failure cannot be read after the fact gets re-run instead.
   */
  for (const f of failed) {
    process.stderr.write(`\n── ${f.id} ──\n${f.out.split("\n").slice(-25).join("\n")}\n  full output: ${relative(root, gateLog(f.id))}\n`);
  }
}
process.exit(failed.length || fell.length ? 1 : 0);
