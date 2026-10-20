/**
 * Bundle guarantee: the dev-only fixture harness must never reach the package,
 * and never reach the production site.
 *
 * src/__tests__/fixtures and the contract registry exist so e2e can drive
 * components without demo prose (E2E-INVENTORY.md). They import
 * @testing-library/react and ai/component-index.json — neither belongs in a
 * consumer's bundle, and both would arrive silently, since an unused chunk
 * produces no error and no warning.
 *
 * The site carries the same harness by a different route. App.tsx reaches the
 * fixture routes through a ternary on import.meta.env.DEV, and that ternary is
 * the only thing keeping /__fixtures and the `?classes=` and `?spy=` readers
 * out of the deployed site. Nothing checked it: this scanned dist/ alone.
 * `--site` scans dist-site/, and `postbuild` runs it after every `npm run build`.
 *
 * Usage: node scripts/assert-fixture-bundle.mjs [--site] [--dir <build>] [--self-check]
 *
 *   (default)     dist/, after `build:lib`
 *   --site        dist-site/, after `npm run build`
 *   --dir         another build of the same kind, e.g. a scratch copy
 *   --self-check  plants each marker, one at a time, into a scratch copy of the
 *                 build and requires the scan to fail every one; then requires
 *                 an empty build to fail the floor
 */
import { readFileSync, readdirSync, existsSync, statSync, cpSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { resolve, dirname, join, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const SITE = args.includes("--site");
const SELF_CHECK = args.includes("--self-check");
const dirArg = args.indexOf("--dir");
const DIR = resolve(root, dirArg === -1 ? (SITE ? "dist-site" : "dist") : args[dirArg + 1]);
const TARGET = SITE ? "site" : "dist";

// Markers that only the harness carries. `data-fixture` is the attribute the
// navigation guard asserts on, so its presence in a build means a fixture page
// was bundled.
//
// The site is minified, so a function name such as `classesFromQuery` or
// `fixturesFor` is mangled away there and cannot be the marker: the readers are
// found by the string literals they pass, which survive. A site build with the
// DEV branch forced on carries `__fixtures`, `data-fixture`, `__fixtureCalls`,
// `.get("classes")` and `.get("spy")`, and none of them appear in the
// production build.
//
// `@testing-library` is not a site marker. The site bundles its dependencies,
// so a bundled copy carries no package name, and the one occurrence in every
// site build, with the DEV branch on or off, is the FAQ's prose recommending it.
const FORBIDDEN = [
  { marker: "data-fixture", what: "the fixture route", in: ["dist", "site"] },
  { marker: "__fixtures", what: "the fixture route path", in: ["dist", "site"] },
  { marker: "@testing-library", what: "a test-only dependency", in: ["dist"] },
  { marker: "component-index.json", what: "the AI component index", in: ["dist", "site"] },
  { marker: "fixturesFor", what: "the fixture registry", in: ["dist", "site"] },
  { marker: "__fixtureCalls", what: "the ?spy= reader's call log", in: ["dist", "site"] },
  { marker: '.get("spy")', what: "the ?spy= reader", in: ["dist", "site"] },
  { marker: '.get("classes")', what: "the ?classes= reader", in: ["dist", "site"] },
].filter((f) => f.in.includes(TARGET));

// Binary output the scan cannot read as text; every other file in the site is
// read, the HTML and the CSS included.
const BINARY = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp", ".ico", ".woff", ".woff2", ".ttf", ".otf", ".mp4", ".webm", ".zip"]);
const scanned = (p) => (SITE ? !BINARY.has(extname(p).toLowerCase()) : /\.(js|cjs|d\.ts)$/.test(p));

/**
 * The fewest files a complete build can hold, counted from source rather than
 * from the build, so a walk of a half-written or empty directory fails here
 * instead of finding nothing to object to.
 *
 *   dist  every `.js`, `.cjs` and `.d.ts` target package.json's exports name
 *   site  one chunk per lazy route import in src/App.tsx, plus index.html
 */
const floor = () => {
  if (SITE) {
    const app = readFileSync(join(root, "src/App.tsx"), "utf8");
    return (app.match(/lazy\(\(\) => import\("/g) ?? []).length + 1;
  }
  const targets = new Set();
  const collect = (v) => {
    if (typeof v === "string") { if (scanned(v)) targets.add(v); }
    else if (v && typeof v === "object") Object.values(v).forEach(collect);
  };
  collect(JSON.parse(readFileSync(join(root, "package.json"), "utf8")).exports);
  return targets.size;
};

const walk = (dir, out = []) => {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (scanned(p)) out.push(p);
  }
  return out;
};

const scan = (dir) => {
  const files = walk(dir);
  const leaks = [];
  for (const file of files) {
    const source = readFileSync(file, "utf8");
    for (const { marker, what } of FORBIDDEN) {
      if (source.includes(marker)) leaks.push({ file: file.replace(dir + "/", ""), marker, what });
    }
  }
  return { files: files.length, leaks };
};

const FLOOR = floor();
const label = SITE ? "site" : "built";

if (!existsSync(DIR)) {
  console.error(`✗ ${DIR.replace(root + "/", "")}/ is missing — run ${SITE ? "`npm run build`" : "build:lib"} first`);
  process.exit(1);
}

if (SELF_CHECK) {
  const scratch = mkdtempSync(join(tmpdir(), "fixture-bundle-selfcheck-"));
  const copy = join(scratch, "build");
  let ok = true;
  try {
    for (const { marker } of FORBIDDEN) {
      rmSync(copy, { recursive: true, force: true });
      cpSync(DIR, copy, { recursive: true });
      writeFileSync(join(copy, "planted.js"), `export const planted = (u) => u${marker.startsWith(".") ? marker : `["${marker}"]`};\n`);
      const caught = scan(copy).leaks.some((l) => l.file === "planted.js" && l.marker === marker);
      console.log(`  ${caught ? "caught" : "MISSED"}  ${marker}`);
      if (!caught) ok = false;
    }
    rmSync(copy, { recursive: true, force: true });
    cpSync(DIR, copy, { recursive: true, filter: (p) => statSync(p).isDirectory() });
    const empty = scan(copy);
    const caught = empty.files < FLOOR;
    console.log(`  ${caught ? "caught" : "MISSED"}  an empty build (${empty.files} files, floor ${FLOOR})`);
    if (!caught) ok = false;
  } finally {
    rmSync(scratch, { recursive: true, force: true });
  }
  console.log(ok
    ? `✓ self-check: ${FORBIDDEN.length} planted ${TARGET} markers and an empty build were all caught`
    : "✗ self-check FAILED");
  process.exit(ok ? 0 : 1);
}

const { files, leaks } = scan(DIR);
for (const { file, marker, what } of leaks) {
  console.error(`✗ ${what} leaked into ${file} (found "${marker}")`);
}
if (files < FLOOR) {
  console.error(`✗ scanned ${files} ${label} files, under the floor of ${FLOOR} — a scan of an incomplete build finds nothing`);
}
if (leaks.length || files < FLOOR) {
  console.error(`fixture bundle guarantee FAILED (${files} ${label} files scanned, floor ${FLOOR}, ${leaks.length} leak(s))`);
  process.exit(1);
}

console.log(`✓ ${files} ${label} files carry no fixture-harness code (floor ${FLOOR}, ${FORBIDDEN.length} markers)`);
