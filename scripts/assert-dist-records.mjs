/**
 * Four validation records describe `dist/`. This ties them to the artifact.
 *
 *   validation.build            "dist/ built; gzip 695kB"
 *   validation.performance      "DatePicker 10.25KB <= 12KB"
 *   validation.bundleSizes      the per-chunk table
 *   validation.npmAudit         "npm pack ships 373 files at 371.8KB gzipped"
 *
 * GATE-HONESTY 1.1: the three assert-*.mjs scripts run inside `postbuild:lib`,
 * so they cannot read a stale dist — but nothing detects drift BETWEEN runs.
 * The numbers outlive the artifact they measured, and `04-validate.md` reads
 * the record rather than the filesystem. AUDIT-GAP 7.2 caught the DatePicker
 * chunk at 12.63kb, past its hard fail, while the record still said 10.25.
 *
 * Modes:
 *   (default)      verify the recorded fingerprint against dist/. Non-zero if
 *                  it is missing or has drifted.
 *   --invalidate   clear it. `postbuild:lib` runs this: a new dist means the
 *                  recorded numbers no longer describe anything.
 *   --stamp        record the current fingerprint. Only after the four values
 *                  above have actually been re-measured.
 */
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { resolve, dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = resolve(root, "dist");
const STATE = resolve(root, "ai/system-state.json");

/** The records that describe dist/, named so a failure says what is stale. */
const DEPENDENT = [
  "validation.build",
  "validation.performance",
  "validation.npmAudit",
  "issues.high[8].evidence (the DatePicker chunk size)",
];

const fingerprint = () => {
  if (!existsSync(DIST)) return null;
  const files = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir).sort()) {
      const p = join(dir, entry);
      if (statSync(p).isDirectory()) walk(p);
      // Only what the records measure: the shipped JS, types and CSS.
      else if (/\.(js|cjs|mjs|d\.ts|css)$/.test(p)) files.push(p);
    }
  };
  walk(DIST);
  if (files.length === 0) return null;
  const h = createHash("sha256");
  for (const f of files) {
    h.update(relative(root, f));
    h.update("\0");
    h.update(readFileSync(f));
    h.update("\0");
  }
  return `sha256:${h.digest("hex").slice(0, 32)}:${files.length}`;
};

const readState = () => JSON.parse(readFileSync(STATE, "utf8"));
const writeState = (s) => writeFileSync(STATE, `${JSON.stringify(s, null, 2)}\n`, "utf8");

const mode = process.argv[2] ?? "--verify";
const current = fingerprint();
const state = readState();
const recorded = state.validation?.distFingerprint ?? null;

if (mode === "--invalidate") {
  state.validation.distFingerprint = null;
  writeState(state);
  console.log(
    `✓ dist fingerprint cleared — ${DEPENDENT.join(", ")} now read as unverified until re-measured`,
  );
  process.exit(0);
}

if (mode === "--stamp") {
  if (!current) {
    console.error("✗ no dist/ to stamp — run build:lib first");
    process.exit(1);
  }
  state.validation.distFingerprint = current;
  writeState(state);
  console.log(`✓ stamped ${current}`);
  process.exit(0);
}

if (!current) {
  console.error("✗ no dist/ — cannot verify the dist-derived records");
  process.exit(1);
}
if (!recorded) {
  console.error(
    `✗ no recorded dist fingerprint. These records describe an artifact that ` +
      `cannot be identified, so they are unverified:\n  ${DEPENDENT.join("\n  ")}\n` +
      `  Re-measure them, then: node scripts/assert-dist-records.mjs --stamp`,
  );
  process.exit(1);
}
if (recorded !== current) {
  console.error(
    `✗ dist has changed since these records were written:\n` +
      `    recorded ${recorded}\n     current ${current}\n` +
      `  Stale: ${DEPENDENT.join(", ")}`,
  );
  process.exit(1);
}
console.log(`✓ dist-derived records match dist/ (${current})`);
