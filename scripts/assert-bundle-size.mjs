/**
 * Bundle size as a gate rather than a sentence in a JSON file.
 *
 * `validation.performance` in ai/system-state.json read PASS on numbers measured
 * 2026-04-28 and never re-measured. In that time Table grew from 6.2 KB to
 * 15.30 KB against a 10 KB ceiling and DatePicker crossed its 12 KB hard fail,
 * and nothing failed, because the size lived in a record. AUDIT-GAP 7.2 caught
 * DatePicker at 12.63 KB and the record still said 10.25.
 *
 * What it measures: the transitive closure of a component's public entry,
 * `dist/components/<Name>/index.js`, following relative imports only — the bytes
 * a consumer downloads for `@chumlab/ui/<name>` and nothing else. Externals
 * (react, @tanstack/react-table, date-fns, clsx, tailwind-merge — see
 * vite.config.ts) are bare specifiers and are not followed.
 *
 * Two ways to get this wrong, both of which have already happened here:
 *   - measuring `dist/components/<Name>/**` sweeps in sibling ENTRIES. IPI's
 *     ./phone-validators lives there and carries libphonenumber on purpose;
 *     counting it reports IPI at 52.58 KB, a number no consumer ever pays.
 *   - measuring one `dist/shared/<Name>-<hash>.js` chunk undercounts, because an
 *     entry usually pulls more than one shared chunk.
 *
 * Ceilings are per class, described in ai/07-performance.md. They live here now:
 * this file is the gate, and a threshold in prose is what failed last time.
 */
import { gzipSync } from "node:zlib";
import { readFileSync, existsSync, readdirSync, statSync, writeFileSync, rmSync, mkdirSync } from "node:fs";
import { randomBytes } from "node:crypto";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = resolve(root, "dist");

/** kb gzipped. `hard` fails this gate; `target` is reported, not enforced. */
const CLASSES = {
  leaf: { target: 5, hard: 10 },
  date: { target: 10, hard: 12 },
  locale: { target: 10, hard: 12 },
  composite: { target: 10, hard: 12 },
};

/** Anything not listed is a leaf. */
const COMPONENT_CLASS = {
  DatePicker: "date",
  TimePicker: "date",
  InternationalPhoneInput: "locale",
  CascadingDropdown: "composite",
  MultiSelectDropdown: "composite",
  MultiSelectSearchableDropdown: "composite",
  SearchableDropdown: "composite",
};

/**
 * Every relative STATIC import reachable from an entry, entry included.
 *
 * `import()` is deliberately not followed. CountryFlag and
 * InternationalPhoneInput lazy-load one flag chunk per country on demand;
 * summing all 250 reports them at 350 KB and 366 KB, which is the cost of every
 * flag at once and a thing no consumer ever pays. The eager closure is what
 * lands in the initial download.
 */
const closure = (entry) => {
  const seen = new Set();
  const stack = [entry];
  while (stack.length) {
    const file = stack.pop();
    if (seen.has(file) || !existsSync(file)) continue;
    seen.add(file);
    const src = readFileSync(file, "utf8");
    for (const m of src.matchAll(/from\s*["'](\.[^"']+)["']/g)) {
      stack.push(resolve(dirname(file), m[1]));
    }
  }
  return [...seen].sort();
};

/**
 * Two numbers, because they answer different questions and only one of them can
 * be compared to the recorded ceilings.
 *
 *   own      the component's own chunk, `shared/<Name>-<hash>.js`. This is the
 *            basis the ceilings in ai/07-performance.md were set against, so it
 *            is what this gate enforces — comparing a stricter measure to an
 *            older threshold would report seven components as regressions
 *            without one byte having changed.
 *   closure  the eager static closure of the public entry: what a consumer
 *            actually downloads for `@chumlab/ui/<name>`. Reported, not
 *            enforced. It is the honest consumer-facing number and the one the
 *            next ceiling decision should be made against.
 *
 * InternationalPhoneInput is the clearest gap between them: own 10.46 KB,
 * closure 27.58 KB, because the entry pulls SearchableDropdown, Tooltip and
 * CountryFlag whole.
 */
const measure = (name) => {
  const entry = join(DIST, "components", name, "index.js");
  if (!existsSync(entry)) return null;
  const files = closure(entry);
  const bytes = Buffer.concat(files.map((f) => readFileSync(f)));
  const ownPattern = new RegExp(`(^|/)${name}-[A-Za-z0-9_-]+\\.js$`);
  const ownFile = files.find((f) => ownPattern.test(f.replace(`${DIST}/`, "")));
  const own = ownFile ? gzipSync(readFileSync(ownFile)).length / 1024 : null;
  return {
    own: own ?? gzipSync(readFileSync(entry)).length / 1024,
    closure: gzipSync(bytes).length / 1024,
    files: files.length,
  };
};

const components = () => {
  const dir = join(DIST, "components");
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((e) => statSync(join(dir, e)).isDirectory())
    .filter((e) => existsSync(join(dir, e, "index.js")))
    .sort();
};

const run = () => {
  const names = components();
  if (names.length === 0) {
    console.error(
      "✗ no library build in dist/. This gate measures the packaged entries — run `npm run build:lib` first.",
    );
    process.exit(1);
  }

  const rows = [];
  for (const name of names) {
    const m = measure(name);
    if (!m) continue;
    const cls = COMPONENT_CLASS[name] ?? "leaf";
    const { target, hard } = CLASSES[cls];
    rows.push({ name, cls, target, hard, ...m });
  }
  rows.sort((a, b) => b.own - a.own);

  const breaches = rows.filter((r) => r.own > r.hard);
  const overTarget = rows.filter((r) => r.own <= r.hard && r.own > r.target);

  console.log(
    `  ${"component".padEnd(32)} ${"own".padStart(6)} ${"closure".padStart(8)}  class      ceiling`,
  );
  for (const r of rows.slice(0, 12)) {
    const state = r.own > r.hard ? "HARD FAIL" : r.own > r.target ? "over target" : "ok";
    console.log(
      `  ${r.name.padEnd(32)} ${r.own.toFixed(2).padStart(6)} ${r.closure.toFixed(2).padStart(8)}  ${r.cls.padEnd(10)}` +
        ` ${String(r.target).padStart(2)}/${String(r.hard).padStart(2)}  ${state}`,
    );
  }
  console.log(
    `\n  ${rows.length} entries measured, ${overTarget.length} over target, ${breaches.length} over hard fail (measured on own-chunk)`,
  );
  const closureBreaches = rows.filter((r) => r.closure > r.hard).length;
  console.log(
    `  for reference, ${closureBreaches} entries exceed their ceiling on closure - the consumer-facing number the ceilings predate`,
  );

  if (breaches.length) {
    console.error(
      `\n✗ ${breaches.length} bundle(s) over the class hard fail:\n` +
        breaches
          .map((r) => `    ${r.name}: ${r.own.toFixed(2)} KB > ${r.hard} KB (${r.cls})`)
          .join("\n"),
    );
    return 1;
  }
  console.log("✓ every entry is within its class hard fail");
  return 0;
};

/**
 * Proof the gate can fail: plant a chunk that busts the smallest ceiling and
 * require it to be caught. Without this, "0 breaches" and "the walk found
 * nothing" are the same output — which is how the record it replaces passed.
 */
const selfCheck = () => {
  const probeDir = join(DIST, "components", "__CeilingProbe");
  if (existsSync(probeDir)) {
    console.error(`✗ ${probeDir} already exists — refusing to overwrite`);
    process.exit(1);
  }
  // Random, not repeated: 400k identical characters gzip to under half a KB,
  // and the first draft of this self-check said so.
  const filler = `export const probe = "${randomBytes(24_000).toString("hex")}";\n`;
  try {
    // Named `<Name>-<hash>.js` so it is picked up as the probe's OWN chunk,
    // which is what the gate measures.
    writeFileSync(join(DIST, "shared", "__CeilingProbe-probe01.js"), filler, "utf8");
    mkdirSync(probeDir, { recursive: true });
    writeFileSync(
      join(probeDir, "index.js"),
      'export { probe } from "../../shared/__CeilingProbe-probe01.js";\n',
      "utf8",
    );
    const m = measure("__CeilingProbe");
    if (!m) {
      console.error("✗ self-check: the probe entry was not measured at all");
      process.exit(1);
    }
    if (m.own <= CLASSES.leaf.hard) {
      console.error(
        `✗ self-check: the probe measured ${m.own.toFixed(2)} KB, under the ${CLASSES.leaf.hard} KB leaf ceiling — it is not a ceiling-buster`,
      );
      process.exit(1);
    }
    if (m.files !== 2) {
      console.error(
        `✗ self-check: the closure walk found ${m.files} files, expected 2 — it is not following relative imports`,
      );
      process.exit(1);
    }
    console.log(
      `✓ self-check: a ${m.own.toFixed(2)} KB entry is caught against the ${CLASSES.leaf.hard} KB leaf ceiling, across ${m.files} files`,
    );
  } finally {
    rmSync(probeDir, { recursive: true, force: true });
    rmSync(join(DIST, "shared", "__CeilingProbe-probe01.js"), { force: true });
  }
};

/** `--explain <Name>`: per-file contribution, for diagnosing a breach. */
const explain = (name) => {
  const entry = join(DIST, "components", name, "index.js");
  if (!existsSync(entry)) {
    console.error(`✗ no entry for ${name}`);
    process.exit(1);
  }
  const files = closure(entry);
  const rows = files
    .map((f) => ({
      file: f.replace(`${DIST}/`, ""),
      raw: statSync(f).size / 1024,
      // Gzipped alone: chunks share a dictionary when concatenated, so these
      // sum to more than the total. Useful for ranking, not for arithmetic.
      gz: gzipSync(readFileSync(f)).length / 1024,
    }))
    .sort((a, b) => b.gz - a.gz);
  const total = gzipSync(Buffer.concat(files.map((f) => readFileSync(f)))).length / 1024;
  console.log(`${name}: ${total.toFixed(2)} KB gzipped across ${files.length} files\n`);
  console.log(`  ${"file".padEnd(52)} ${"raw KB".padStart(8)} ${"gz KB".padStart(7)}`);
  for (const r of rows) {
    console.log(`  ${r.file.padEnd(52)} ${r.raw.toFixed(1).padStart(8)} ${r.gz.toFixed(2).padStart(7)}`);
  }
};

if (process.argv[2] === "--explain") {
  explain(process.argv[3]);
  process.exit(0);
}

if (components().length === 0) {
  console.error(
    "✗ no library build in dist/. This gate measures the packaged entries — run `npm run build:lib` first.",
  );
  process.exit(1);
}
selfCheck();
process.exit(run());
