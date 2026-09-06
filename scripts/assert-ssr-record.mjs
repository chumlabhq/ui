/**
 * `ai/component-index.json` records `"ssr": "safe"` for every component. It was
 * asserted, never measured, and it was false: Toast mismatched on hydration in
 * all three server-rendered frameworks, and Modal and Drawer did the same as
 * soon as they were open at first paint.
 *
 * So the field is derived now, the way the dist-derived records are. The
 * consumer matrix writes `docs/adr/003-ssr-hydration.json` from what it
 * measured — every route, in three frameworks, through React 19's own
 * recoverable-error channel — and this gate holds the index to it.
 *
 * Three ways it fails:
 *   - the index claims something the record does not say
 *   - the record does not cover a component the index ships
 *   - the source has changed since the record was written, so it describes
 *     code that no longer exists
 *
 * The last one is the dist-record lesson (GATE-HONESTY 1.1): numbers outlive
 * the artifact they measured unless something ties them to it.
 *
 *   node scripts/assert-ssr-record.mjs               verify
 *   node scripts/assert-ssr-record.mjs --self-check  plant the three failures
 */
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const RECORD = join(ROOT, "docs", "adr", "003-ssr-hydration.json");
const INDEX = join(ROOT, "ai", "component-index.json");

/**
 * The shipped source, and only that: tests, demos and the marketing pages
 * cannot change how a component hydrates, and invalidating the record on every
 * test edit would train people to re-stamp it without reading it.
 */
export function sourceFingerprint() {
  const files = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir).sort()) {
      const path = join(dir, entry);
      if (entry === "__tests__") continue;
      if (statSync(path).isDirectory()) walk(path);
      else if (/\.tsx?$/.test(path)) files.push(path);
    }
  };
  walk(join(ROOT, "src", "components"));
  walk(join(ROOT, "src", "utils"));
  const hash = createHash("sha256");
  for (const file of files) {
    hash.update(relative(ROOT, file));
    hash.update("\0");
    hash.update(readFileSync(file));
    hash.update("\0");
  }
  return `sha256:${hash.digest("hex").slice(0, 32)}:${files.length}`;
}

/** Every failure the gate can report, as a list, so a self-check can plant one. */
export function check({ record, index, fingerprint }) {
  const failures = [];
  if (!record) {
    return [
      "no SSR record. `npm run verify:consumers` writes docs/adr/003-ssr-hydration.json " +
        "when it packs its own tarball; nothing else may write it.",
    ];
  }

  if (record.sourceFingerprint !== fingerprint) {
    failures.push(
      `the record describes source that has changed:\n    recorded ${record.sourceFingerprint}\n` +
        `     current ${fingerprint}\n  Re-run: npm run verify:consumers`,
    );
  }

  const shipped = index.components.map((component) => component.name);
  const measured = Object.keys(record.components);
  const unmeasured = shipped.filter((name) => !measured.includes(name));
  const orphaned = measured.filter((name) => !shipped.includes(name));
  if (unmeasured.length) failures.push(`no evidence for: ${unmeasured.join(", ")}`);
  if (orphaned.length) failures.push(`record names components that do not ship: ${orphaned.join(", ")}`);

  for (const component of index.components) {
    const evidence = record.components[component.name];
    if (!evidence) continue;
    if (component.ssr !== evidence.ssr) {
      failures.push(
        `${component.name}: index says "${component.ssr}", the matrix measured ` +
          `"${evidence.ssr}" across ${evidence.routes.join(", ")}`,
      );
    }
  }
  return failures;
}

const read = (path) => (existsSync(path) ? JSON.parse(readFileSync(path, "utf8")) : null);

// The matrix imports `RECORD` and `sourceFingerprint` from here to WRITE the
// record; only a direct invocation verifies it.
const invoked = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (invoked && process.argv[2] === "--self-check") {
  const index = read(INDEX);
  const record = read(RECORD);
  const fingerprint = sourceFingerprint();
  const outcomes = [
    {
      plant: "no record at all",
      caught: check({ record: null, index, fingerprint }).length > 0,
    },
    {
      plant: "a verdict the index contradicts",
      caught: check({
        record: {
          ...record,
          components: {
            ...record.components,
            Toast: { ...record.components?.Toast, ssr: "mismatch" },
          },
        },
        index,
        fingerprint,
      }).some((failure) => failure.startsWith("Toast:")),
    },
    {
      plant: "a record written against different source",
      caught: check({
        record: { ...record, sourceFingerprint: "sha256:stale:0" },
        index,
        fingerprint,
      }).some((failure) => failure.includes("source that has changed")),
    },
    {
      plant: "a component the record never measured",
      caught: check({
        record: {
          ...record,
          components: Object.fromEntries(
            Object.entries(record?.components ?? {}).filter(([name]) => name !== "Drawer"),
          ),
        },
        index,
        fingerprint,
      }).some((failure) => failure.includes("no evidence for: Drawer")),
    },
  ];
  for (const outcome of outcomes) {
    console.log(`  ${outcome.caught ? "caught" : "NOT CAUGHT"}  ${outcome.plant}`);
  }
  const ok = outcomes.every((outcome) => outcome.caught);
  console.log(ok ? `✓ all ${outcomes.length} plants were caught` : "✗ a planted defect passed");
  process.exit(ok ? 0 : 1);
}

if (invoked) {
  const failures = check({
    record: read(RECORD),
    index: read(INDEX),
    fingerprint: sourceFingerprint(),
  });

  if (failures.length) {
    console.error(
      `✗ the SSR record and ai/component-index.json disagree:\n  ${failures.join("\n  ")}`,
    );
    process.exit(1);
  }
  console.log(
    `✓ every component's "ssr" is what the consumer matrix measured ` +
      `(${read(RECORD).generatedAt}, ${read(RECORD).templates.join(", ")})`,
  );
}
