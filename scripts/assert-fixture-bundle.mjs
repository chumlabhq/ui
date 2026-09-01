/**
 * Bundle guarantee: the dev-only fixture harness must never reach the package.
 *
 * src/__tests__/fixtures and the contract registry exist so e2e can drive
 * components without demo prose (E2E-INVENTORY.md). They import
 * @testing-library/react and ai/component-index.json — neither belongs in a
 * consumer's bundle, and both would arrive silently, since an unused chunk
 * produces no error and no warning.
 *
 * Run after `build:lib`.
 */
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = resolve(root, "dist");

const fail = (msg) => {
  console.error(`✗ ${msg}`);
  process.exitCode = 1;
};

if (!existsSync(DIST)) {
  fail("dist/ is missing — run build:lib first");
  process.exit(1);
}

const files = [];
const walk = (dir) => {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(js|cjs|d\.ts)$/.test(p)) files.push(p);
  }
};
walk(DIST);

// Markers that only the harness carries. `data-fixture` is the attribute the
// navigation guard asserts on, so its presence in dist means a fixture page
// was bundled.
const FORBIDDEN = [
  ["data-fixture", "the fixture route"],
  ["__fixtures", "the fixture route path"],
  ["@testing-library", "a test-only dependency"],
  ["component-index.json", "the AI component index"],
  ["fixturesFor", "the fixture registry"],
];

for (const file of files) {
  const source = readFileSync(file, "utf8");
  for (const [marker, what] of FORBIDDEN) {
    if (source.includes(marker)) {
      fail(`${what} leaked into ${file.replace(root + "/", "")} (found "${marker}")`);
    }
  }
}

if (process.exitCode) {
  console.error("fixture bundle guarantee FAILED");
  process.exit(1);
}

console.log(`✓ ${files.length} built files carry no fixture-harness code`);
