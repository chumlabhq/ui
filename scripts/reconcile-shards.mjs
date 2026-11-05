/**
 * The e2e matrix, one project per job and several shards per project, read back
 * as one run: every shard reported, and between them they ran every test.
 *
 * A shard that never ran, or a project that lost tests to a filter, leaves every
 * other job green. So this sums what each shard's reconcile reporter wrote and
 * holds the sum to `playwright test --list`, which knows nothing of the shards.
 * How many shards each project has is read from release-gates.yml.
 *
 *   node scripts/reconcile-shards.mjs <dir of reconcile-<job>-<shard>/reconcile.json>
 *   node scripts/reconcile-shards.mjs --self-check
 */
import { execSync } from "node:child_process";
import { existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/** Each matrix job's id, its project and how many shards it declares. */
export function declaredJobs(workflow) {
  const jobs = [];
  for (const block of workflow.split(/^(?=  [a-z0-9-]+:\s*$)/m)) {
    const id = /^  ([a-z0-9-]+):/.exec(block)?.[1];
    const project = /playwright test --project="([^"]+)"/.exec(block)?.[1];
    if (!id?.startsWith("e2e-") || !project) continue;
    const shards = Number(/--shard=\$\{\{ matrix\.shard \}\}\/(\d+)/.exec(block)?.[1] ?? 1);
    jobs.push({ id, project, shards });
  }
  return jobs;
}

/** What is wrong with the shards under `dir`, and one line per project. */
export function reconcile(jobs, dir, listed) {
  const problems = [];
  const lines = [];
  for (const { id, project, shards } of jobs) {
    let collected = 0;
    let passed = 0;
    let skipped = 0;
    let failed = 0;
    let reported = 0;
    for (let shard = 1; shard <= shards; shard++) {
      const file = join(dir, `reconcile-${id}-${shard}`, "reconcile.json");
      if (!existsSync(file)) {
        problems.push(`${project}: shard ${shard}/${shards} reported nothing (${id})`);
        continue;
      }
      const shardReport = JSON.parse(readFileSync(file, "utf8"));
      reported++;
      collected += shardReport.collected;
      passed += shardReport.byStatus.passed ?? 0;
      skipped += shardReport.byStatus.skipped ?? 0;
      failed += shardReport.notPassed ?? 0;
      if (!shardReport.reconciled) problems.push(`${project}: shard ${shard}/${shards} did not reconcile (${shardReport.playwrightStatus})`);
    }
    const want = listed[project];
    if (!want) problems.push(`${project}: --list found no tests, so nothing can be checked`);
    if (collected !== want) problems.push(`${project}: shards collected ${collected}, --list has ${want}`);
    lines.push(`RECONCILE ${project}: shards ${reported}/${shards}, collected ${collected} of ${want}, passed ${passed}, skipped ${skipped}, not passed ${failed}`);
  }
  return { problems, lines };
}

function listCount(project) {
  const out = execSync(`npx playwright test --list --reporter=list --project="${project}"`, { cwd: ROOT, encoding: "utf8", maxBuffer: 1 << 28, stdio: ["ignore", "pipe", "ignore"] });
  const total = /Total: (\d+) tests?/.exec(out)?.[1];
  if (!total) throw new Error(`playwright --list for ${project} printed no total`);
  return Number(total);
}

function selfCheck() {
  const dir = mkdtempSync(join(tmpdir(), "reconcile-shards-"));
  const jobs = [{ id: "e2e-a", project: "a", shards: 2 }];
  const write = (shard, collected, reconciled = true) => {
    mkdirSync(join(dir, `reconcile-e2e-a-${shard}`), { recursive: true });
    writeFileSync(
      join(dir, `reconcile-e2e-a-${shard}`, "reconcile.json"),
      JSON.stringify({ collected, byStatus: { passed: collected }, notPassed: 0, reconciled, playwrightStatus: reconciled ? "passed" : "failed" }),
    );
  };
  const cases = [];
  write(1, 5);
  cases.push(["a shard missing", reconcile(jobs, dir, { a: 10 }).problems.join(), /shard 2\/2 reported nothing/]);
  write(2, 4);
  cases.push(["a shard short", reconcile(jobs, dir, { a: 10 }).problems.join(), /collected 9, --list has 10/]);
  write(2, 5, false);
  cases.push(["a shard that failed to reconcile", reconcile(jobs, dir, { a: 10 }).problems.join(), /did not reconcile/]);
  write(2, 5);
  const clean = reconcile(jobs, dir, { a: 10 }).problems;
  rmSync(dir, { recursive: true, force: true });
  const missed = cases.filter(([, got, want]) => !want.test(got)).map(([name]) => name);
  if (missed.length || clean.length) {
    console.error(`✗ self-check: missed ${missed.join(", ") || "nothing"}; a clean set said ${clean.join("; ") || "nothing"}`);
    process.exit(1);
  }
  console.log(`✓ self-check: ${cases.length} of ${cases.length} planted defects red, a clean set green`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  if (process.argv.includes("--self-check")) selfCheck();
  else {
    const dir = resolve(process.argv[2] ?? "shards");
    const jobs = declaredJobs(readFileSync(join(ROOT, ".github/workflows/release-gates.yml"), "utf8"));
    if (jobs.length < 7) {
      console.error(`✗ read ${jobs.length} matrix jobs from release-gates.yml, and playwright.config.ts has 7 projects: the read is wrong`);
      process.exit(1);
    }
    const listed = Object.fromEntries(jobs.map(({ project }) => [project, listCount(project)]));
    const { problems, lines } = reconcile(jobs, dir, listed);
    console.log(lines.join("\n"));
    if (problems.length) {
      console.error(`✗ ${problems.length} problem(s) across ${jobs.length} projects:\n${problems.map((p) => `    ${p}`).join("\n")}`);
      process.exit(1);
    }
    console.log(`✓ ${jobs.length} projects: every shard reported and the shards ran every listed test`);
  }
}
