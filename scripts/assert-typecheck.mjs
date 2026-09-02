/**
 * The typecheck gate, and proof that it can fail.
 *
 * `tsc --noEmit` and `tsc --noEmit -p tsconfig.json` both reported zero errors
 * on every file in this repo, always. The root tsconfig.json is a solution
 * file — `{"files": [], "references": [...]}` — so those commands compile the
 * empty set and exit 0 no matter what the source says. Every "typescript: PASS"
 * in ai/system-state.json was written on that reading.
 *
 * So the gate is `tsc --build`, and running it is only half the job: this
 * script first plants a deliberate type error and requires the gate to catch
 * it, the way hydration.contract requires `onRecoverableError` to fire before
 * it will believe a clean hydration.
 */
import { execFileSync } from "node:child_process";
import { writeFileSync, rmSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PROBE = resolve(root, "src/__typecheck-probe.ts");

/** Exit code, not output: a gate is only a gate if a failure is non-zero. */
const typecheck = () => {
  try {
    execFileSync("npx", ["tsc", "--build", "--force"], {
      cwd: root,
      stdio: "pipe",
    });
    return { code: 0, out: "" };
  } catch (e) {
    return { code: e.status ?? 1, out: `${e.stdout ?? ""}${e.stderr ?? ""}` };
  }
};

const fail = (msg) => {
  console.error(`✗ ${msg}`);
  rmSync(PROBE, { force: true });
  process.exit(1);
};

if (existsSync(PROBE)) fail(`${PROBE} already exists — refusing to overwrite`);

// A type error nothing else could produce, so a pass here cannot be a
// coincidence of some other file being broken.
writeFileSync(
  PROBE,
  'export const typecheckProbe: number = "not a number";\n',
  "utf8",
);

const withProbe = typecheck();
rmSync(PROBE, { force: true });

if (withProbe.code === 0) {
  fail(
    "the typecheck gate passed with a deliberate type error in src/ — it is " +
      "not checking anything. This is what tsc --noEmit did for the whole repo.",
  );
}
if (!withProbe.out.includes("__typecheck-probe")) {
  fail(
    "the gate failed, but not on the probe — something else is broken, so " +
      `this run proves nothing:\n${withProbe.out.slice(0, 2000)}`,
  );
}
console.log("✓ gate rejects a deliberate type error");

const clean = typecheck();
if (clean.code !== 0) {
  console.error(clean.out);
  fail("typecheck failed");
}
console.log("✓ typecheck clean");
