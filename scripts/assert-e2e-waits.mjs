/**
 * Every `waitForTimeout` in e2e/ is on the list below, with why it has to be one.
 *
 * A fixed wait in a test is a guess at how long something takes, and it fails
 * both ways: under load the thing has not finished (toast, FD-2), and when the
 * thing never happens the guess passes in silence. 63 of them had built up by
 * 2026-11-03. 58 were replaced with a wait on a named condition or removed, or,
 * where the subject was a component timer, moved onto Playwright's clock.
 *
 * What stays is the one thing a condition cannot express: a period itself.
 * Proving that nothing happens takes watching for a while, and sampling a
 * running animation takes a sampling interval. So the list holds those, each
 * with its reason, and a new call has to argue its way on rather than arrive.
 *
 * The count is exact in both directions: over the ceiling is a new wait, and
 * under it is an entry whose wait has gone, which would otherwise leave room
 * for the next one. Calls are read off the TypeScript AST, so a comment or a
 * string naming the method is not a call. Files are every `.ts`/`.tsx` under
 * e2e/, checked against `git ls-files`, so a scan that lost a directory cannot
 * read as a clean one.
 *
 * `--self-check` plants each failure in memory and requires it to be caught.
 */
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const E2E = join(ROOT, "e2e");

/** Keyed by file and argument: a call moved within its file stays on the list, a new one does not. */
const REASONED = [
  {
    file: "e2e/default-state.spec.ts",
    ms: "300",
    count: 1,
    reason: "the focus-keeping read: Tab reached the control, and the assertion is that nothing takes focus away over a period",
  },
  {
    file: "e2e/demo-scroll.spec.ts",
    ms: "900",
    count: 1,
    reason: "the assertion is that nothing scrolls the page after it lands, and a mount effect that focuses something has no event to wait on when it does not happen",
  },
  {
    file: "e2e/disabled-acts.spec.ts",
    ms: "200",
    count: 2,
    reason: "a disabled control, clicked and keyed, reports nothing: the snapshot after a period is compared with the one before, and an absence has no event to wait on",
  },
  {
    file: "e2e/rtl-paint.spec.ts",
    ms: "90",
    count: 1,
    reason: "the sampling interval: twelve reads across a looping animation's 1 s cycle, for its farthest offset whatever phase it started in",
  },
];

/** Every `x.waitForTimeout(...)` in one file's source, as `{ ms, line }`. */
export function callsIn(source, name = "file.ts") {
  const sf = ts.createSourceFile(name, source, ts.ScriptTarget.Latest, true, name.endsWith("x") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const calls = [];
  const visit = (node) => {
    if (
      ts.isCallExpression(node) &&
      ts.isPropertyAccessExpression(node.expression) &&
      node.expression.name.text === "waitForTimeout"
    ) {
      calls.push({ ms: node.arguments[0]?.getText(sf) ?? "", line: sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1 });
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return calls;
}

/** Compares what the files hold with the list; returns every problem, each a line to print. */
export function audit(found, reasoned = REASONED) {
  const problems = [];
  const key = (file, ms) => `${file} waitForTimeout(${ms})`;
  const have = new Map();
  for (const f of found) (have.get(key(f.file, f.ms)) ?? have.set(key(f.file, f.ms), []).get(key(f.file, f.ms))).push(f);
  const allowed = new Map(reasoned.map((r) => [key(r.file, r.ms), r.count]));
  for (const [k, calls] of have) {
    const room = allowed.get(k) ?? 0;
    if (calls.length > room) {
      problems.push(`${k}: ${calls.length} call(s), ${room} reasoned (lines ${calls.map((c) => c.line).join(", ")}). Wait on a named condition; a period that is itself the measurement goes on REASONED with why.`);
    }
  }
  for (const [k, count] of allowed) {
    const n = have.get(k)?.length ?? 0;
    if (n < count) problems.push(`${k}: ${count} reasoned, ${n} found. Drop the entry so the ceiling comes down with it.`);
  }
  return problems;
}

const ceiling = (reasoned = REASONED) => reasoned.reduce((sum, r) => sum + r.count, 0);

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = join(dir, d.name);
    if (d.isDirectory()) return walk(p);
    return /\.tsx?$/.test(d.name) ? [p] : [];
  });
}

function selfCheck() {
  const expectProblem = (name, found, reasoned, fragment) => {
    const problems = audit(found, reasoned);
    if (!problems.some((p) => p.includes(fragment))) {
      console.error(`✗ self-check: ${name}: wanted a problem naming "${fragment}", got ${JSON.stringify(problems)}`);
      process.exit(1);
    }
  };
  const list = [{ file: "e2e/a.spec.ts", ms: "100", count: 1, reason: "r" }];
  const planted = { file: "e2e/a.spec.ts", ms: "100", line: 1 };
  expectProblem("a call nothing lists", [{ ...planted, file: "e2e/b.spec.ts" }, planted], list, "e2e/b.spec.ts");
  expectProblem("a second call on one entry", [planted, { ...planted, line: 2 }], list, "2 call(s), 1 reasoned");
  expectProblem("the same file with another length", [planted, { ...planted, ms: "150" }], list, "waitForTimeout(150)");
  expectProblem("an entry whose wait has gone", [], list, "1 reasoned, 0 found");
  if (audit([planted], list).length) {
    console.error("✗ self-check: an exact match reported a problem");
    process.exit(1);
  }
  const source = [
    "// await page.waitForTimeout(1);",
    'const s = "page.waitForTimeout(2)";',
    "await page.waitForTimeout(3);",
    "await frame.waitForTimeout(ms);",
  ].join("\n");
  const calls = callsIn(source);
  if (calls.map((c) => c.ms).join() !== "3,ms") {
    console.error(`✗ self-check: read ${JSON.stringify(calls)} from a source with two calls, a comment and a string`);
    process.exit(1);
  }
  console.log("✓ self-check: unlisted, over-count, other-length and stale entries are caught; a comment and a string are not calls");
}

if (process.argv.includes("--self-check")) {
  selfCheck();
} else {
  const files = walk(E2E);
  const tracked = execFileSync("git", ["ls-files", "e2e"], { cwd: ROOT, encoding: "utf8" })
    .split("\n")
    .filter((f) => /\.tsx?$/.test(f));
  const found = files.flatMap((path) =>
    callsIn(readFileSync(path, "utf8"), path).map((c) => ({ ...c, file: relative(ROOT, path) })),
  );
  const problems = audit(found);
  if (files.length < tracked.length) problems.push(`scanned ${files.length} files, and git tracks ${tracked.length} under e2e/`);
  const counts = `found ${found.length}, ceiling ${ceiling()} (the reasoned list); files ${files.length}, floor ${tracked.length} (git ls-files)`;
  if (problems.length) {
    console.error(`✗ E2E_WAITS ${counts}\n${problems.map((p) => `    ${p}`).join("\n")}`);
    process.exit(1);
  }
  console.log(`✓ E2E_WAITS ${counts}`);
}
