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
import { writeFileSync, readFileSync, rmSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PROBE = resolve(root, "src/__typecheck-probe.ts");

/**
 * The file the node16 phase plants in. Any lib file with a relative import
 * would do; Button is the smallest one that has several.
 */
const NODE16_PROBE = resolve(root, "src/components/Button/Button.tsx");

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

/**
 * Phase two: the same source under `moduleResolution: node16`.
 *
 * Every tsconfig above uses `bundler`, which resolves `./Slot` and `./Slot.js`
 * alike. A `node16` consumer resolves only the second, and 240 relative
 * imports in the published declarations were of the first kind — invisible
 * here until `attw` read the tarball from outside the repo.
 *
 * Planted first, for the same reason as the probe above: this config compiles
 * a subset of `src`, and a subset can be empty.
 */
const node16 = () => {
  try {
    execFileSync("npx", ["tsc", "-p", "tsconfig.node16.json"], { cwd: root, stdio: "pipe" });
    return { code: 0, out: "" };
  } catch (e) {
    return { code: e.status ?? 1, out: `${e.stdout ?? ""}${e.stderr ?? ""}` };
  }
};

const original = readFileSync(NODE16_PROBE, "utf8");
const extensionless = original.replace('from "../../utils/Slot.js"', 'from "../../utils/Slot"');
if (extensionless === original) {
  fail(`${NODE16_PROBE} no longer imports "../../utils/Slot.js" — the node16 probe plants nothing`);
}

writeFileSync(NODE16_PROBE, extensionless, "utf8");
const withExtensionless = node16();
writeFileSync(NODE16_PROBE, original, "utf8");

if (withExtensionless.code === 0) {
  fail(
    "the node16 gate passed with an extensionless relative import — it is not " +
      "checking resolution, which is the one thing it exists for.",
  );
}
if (!withExtensionless.out.includes("TS2835")) {
  fail(
    "the node16 gate failed, but not on the planted import:\n" +
      withExtensionless.out.slice(0, 2000),
  );
}
console.log("✓ node16 gate rejects an extensionless relative import");

const node16Clean = node16();
if (node16Clean.code !== 0) {
  console.error(node16Clean.out);
  fail("typecheck failed under moduleResolution: node16");
}
console.log("✓ node16 resolution clean");
