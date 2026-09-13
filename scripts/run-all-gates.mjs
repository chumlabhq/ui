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
//   npm run gates:fast     the eleven that finish in under ~90s each
//   npm run gates:record   update the population record
//
// THE SPLIT, because the full run is too long to sit through:
//
//   per slice   `npm run gates:fast` — ~2 minutes, eleven gates. It catches
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
// is the whole of the finding above.
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const FAST = process.argv.includes("--fast");
const RECORD = process.argv.includes("--record");
const POPULATIONS = join(root, "docs/adr/002-gate-populations.json");

const pw = (args) => `PLAYWRIGHT_BROWSERS_PATH=0 npx playwright test ${args}`;

/**
 * `slow` is wall-clock over ~90s, measured, and is what `--fast` drops.
 * `pop` pulls the population out of the gate's own output: the number that says
 * how much it looked at, not whether it liked what it saw.
 */
const GATES = [
  // ── cheap: seconds ────────────────────────────────────────────────────
  { id: "typecheck", claims: { script: "assert-typecheck.mjs" }, cmd: "npm run typecheck" },
  { id: "doc-truth", claims: { vitest: "contracts" },
    cmd: "npx vitest run --project=contracts src/__tests__/contracts/doc-truth.contract.test.ts",
    pop: /collected (\d+)/ },
  { id: "snippet-shape", cmd: "node scripts/build-demo-snippets.mjs --check",
    claims: { script: "build-demo-snippets.mjs" }, pop: /(\d+) of \d+ sections/ },
  { id: "demo-coverage", cmd: "node scripts/audit-demo-coverage.mjs --check",
    claims: { script: "audit-demo-coverage.mjs" }, pop: /\((\d+) props/ },
  { id: "fixture-gap", cmd: "node scripts/audit-fixture-gap.mjs --check",
    claims: { script: "audit-fixture-gap.mjs" }, pop: /holds at (\d+) props/ },
  { id: "component-docs", cmd: "node scripts/build-component-docs.mjs --check",
    claims: { script: "build-component-docs.mjs" }, pop: /(\d+) components/ },
  { id: "subcomponent-schemas", cmd: "node scripts/build-subcomponent-schemas.mjs --check",
    claims: { script: "build-subcomponent-schemas.mjs" } },
  { id: "guide-claims", cmd: "npm run verify:guide-claims",
    claims: { script: "assert-guide-claims.mjs" } },
  { id: "playground-removed", cmd: "npm run verify:playground-removed",
    claims: { script: "assert-playground-removed.mjs" } },
  { id: "ssr-record", cmd: "npm run verify:ssr-record",
    claims: { script: "assert-ssr-record.mjs" } },
  { id: "site-build", cmd: "npm run build", claims: {} },

  // ── medium ────────────────────────────────────────────────────────────
  { id: "library-build+bundle", slow: true,
    cmd: "npm run build:lib && node scripts/assert-bundle-size.mjs",
    claims: { script: ["assert-bundle-size.mjs", "assert-css-names.mjs", "assert-dist-records.mjs",
      "assert-fixture-bundle.mjs", "assert-flag-bundle.mjs", "assert-packaging.mjs",
      "assert-phone-bundle.mjs", "assert-styles-bundle.mjs"] },
    pop: /(\d+) built files/ },
  { id: "unit+contracts", slow: true, cmd: "node scripts/run-vitest.mjs",
    claims: { vitest: ["unit", "contracts"] }, pop: /collected (\d+)/ },

  // ── e2e ───────────────────────────────────────────────────────────────
  { id: "e2e:a11y-full", slow: true, cmd: pw("--project=a11y-full"),
    claims: { spec: ["accessibility-full.spec.ts", "contrast-painted.spec.ts", "default-state.spec.ts"] },
    pop: /collected (\d+)/ },
  { id: "e2e:visual", slow: true, cmd: pw("--project=visual"),
    claims: { spec: ["visual.spec.ts"] }, pop: /collected (\d+)/ },
  { id: "e2e:icon-bounds", slow: true, cmd: pw("e2e/icon-bounds.spec.ts --project=chromium"),
    claims: { spec: ["icon-bounds.spec.ts"] }, pop: /ICON_BOUNDS measured=(\d+)/ },
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

/** ── run ──────────────────────────────────────────────────────────────── */
const record = existsSync(POPULATIONS) ? JSON.parse(readFileSync(POPULATIONS, "utf8")) : { populations: {} };
const results = [];
const started = Date.now();

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
  if (status === "FAIL") process.stdout.write(`   └─ ${typeof g.cmd === "function" ? g.cmd() : g.cmd}\n`);
}

const failedSoFar = () => results.some((r) => r.status === "FAIL");

/** ── populations: a fall is the failure that looks like a pass ────────── */
const fell = [];
for (const r of results) {
  if (r.pop === null || r.status === "skipped") continue;
  const was = record.populations?.[r.id];
  if (typeof was === "number" && r.pop < was) fell.push(`${r.id}: ${was} → ${r.pop}`);
}
if (RECORD) {
  const next = { ...record.populations };
  for (const r of results) if (r.pop !== null && r.status === "pass") next[r.id] = r.pop;
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
    $measuredBy: skipped
      ? `a --fast run, ${skipped} gate(s) skipped — partial, and the skipped gates keep whatever they were recorded at`
      : "a full run of every gate",
    $runWas: failedSoFar() ? "NOT green — some gates failed and were not recorded" : "green",
    recordedOn: new Date().toISOString().slice(0, 10),
    tookMinutes: Number(((Date.now() - started) / 60000).toFixed(1)),
    populations: next,
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
if (failed.length) {
  process.stderr.write(`\n✗ ${failed.length} gate(s) failed: ${failed.map((f) => f.id).join(", ")}\n`);
  for (const f of failed) {
    process.stderr.write(`\n── ${f.id} ──\n${f.out.split("\n").slice(-25).join("\n")}\n`);
  }
}
process.exit(failed.length || fell.length ? 1 : 0);
