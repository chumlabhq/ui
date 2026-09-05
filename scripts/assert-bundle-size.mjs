/**
 * Bundle size as a gate rather than a sentence in a JSON file.
 *
 * `validation.performance` read PASS on numbers measured 2026-04-28 and never
 * re-measured. Table went from an assumed 6.2 KB to a real 15.30 and nothing
 * failed, because the size lived in a record. The 6.2 was not even a
 * measurement — it was the worked example in `ai/07-performance.md`'s OUTPUT
 * FORMAT block, read as data.
 *
 * ── What is gated: `exclusive` ──────────────────────────────────────────────
 *
 * Three numbers exist per entry and only one of them makes a fair ceiling.
 *
 *   own        the component's own chunk. Meaningless: Rollup splits some
 *              components across siblings, so Button is 0.17 KB and Avatar
 *              0.23 KB. A ceiling you pass by moving bytes next door.
 *   closure    the eager static closure of the public entry — what
 *              `@chumlab/ui/<name>` costs imported alone. Honest, but it
 *              charges a component for composing: CountryFlag is 11.19 here
 *              and 1.59 exclusive, the difference being a Tooltip that any
 *              page using Tooltip has already paid for. A gate on this
 *              reddens when composition improves, which points it backwards.
 *   exclusive  bytes reachable from this entry and from no other — the
 *              marginal cost of adding the component to a page already using
 *              the library. GATED.
 *
 * `own` and `closure` are still reported, because the gap between them is the
 * composition story and hiding it would be the same mistake in a new place.
 *
 * ── Shape, and why it is derived ────────────────────────────────────────────
 *
 * The shape sets the ceiling, so hand-assigning it would make the ceiling a
 * matter of opinion. It is read off the built artifact, first match wins, from
 * the component's OWN chunk plus its entry — not the whole closure, or every
 * component that renders a Tooltip would inherit "overlay" from it:
 *
 *   surface   renders a two-dimensional cell grid (`"grid"` role)
 *   overlay   renders into a portal (`createPortal`)
 *   composed  pulls at least one other component's chunk
 *   control   none of the above
 *
 * ── Ceilings ────────────────────────────────────────────────────────────────
 *
 * Multiples of the library's own floor: 4.15 KB, the closure of Loader, the
 * cheapest complete shipping component. 1.5 / 2 / 2.5 / 3 by shape. Derived
 * from what a component of each shape should cost, not from what the current
 * worst costs — fitting to the breaches is what a baseline does.
 */
import { gzipSync } from "node:zlib";
import {
  readFileSync, existsSync, readdirSync, statSync,
  writeFileSync, rmSync, mkdirSync,
} from "node:fs";
import { randomBytes } from "node:crypto";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = resolve(root, "dist");

const FLOOR = 4.15;
const CEILINGS = { control: 6, composed: 8, overlay: 10, surface: 12 };

/**
 * The whole library, deduplicated: every entry's closure unioned once. Ratchets
 * DOWN only. Individual entries can each stay green while the aggregate drifts,
 * and nothing would have noticed.
 */
const LIBRARY_TOTAL_KB = 151.11;
/** Below this much under the record, the record is stale and must be lowered. */
const RATCHET_SLACK_KB = 0.5;

/** Every relative STATIC import reachable from an entry, entry included. */
const closure = (entry) => {
  const seen = new Set();
  const stack = [entry];
  while (stack.length) {
    const file = stack.pop();
    if (seen.has(file) || !existsSync(file)) continue;
    seen.add(file);
    // `import()` is not followed: CountryFlag lazy-loads one flag chunk per
    // country, and summing all 250 reports it at 349 KB — every flag at once,
    // which no consumer pays.
    for (const m of readFileSync(file, "utf8").matchAll(/from\s*["'](\.[^"']+)["']/g)) {
      stack.push(resolve(dirname(file), m[1]));
    }
  }
  return [...seen].sort();
};

const gz = (files) =>
  gzipSync(Buffer.concat(files.map((f) => readFileSync(f)))).length / 1024;

const components = () => {
  const dir = join(DIST, "components");
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((e) => statSync(join(dir, e)).isDirectory())
    .filter((e) => existsSync(join(dir, e, "index.js")))
    .sort();
};

const measureAll = () => {
  const names = components();
  const sets = new Map(
    names.map((n) => [n, closure(join(DIST, "components", n, "index.js"))]),
  );
  const reach = new Map();
  for (const files of sets.values())
    for (const f of files) reach.set(f, (reach.get(f) ?? 0) + 1);

  const rows = names.map((name) => {
    const files = sets.get(name);
    const entry = join(DIST, "components", name, "index.js");
    const ownPattern = new RegExp(`(^|/)${name}-[A-Za-z0-9_-]+\\.js$`);
    const ownFile = files.find((f) => ownPattern.test(f.replace(`${DIST}/`, "")));

    const ownSrc = [ownFile, entry]
      .filter(Boolean)
      .map((f) => readFileSync(f, "utf8"))
      .join("");
    const deps = [
      ...new Set(
        files
          .map((f) =>
            /(^|\/)([A-Z][A-Za-z]*)-[A-Za-z0-9_-]+\.js$/.exec(
              f.replace(`${DIST}/shared/`, ""),
            ),
          )
          .filter(Boolean)
          .map((m) => m[2])
          .filter((d) => d !== name),
      ),
    ];
    const shape = /"grid"/.test(ownSrc)
      ? "surface"
      : /createPortal/.test(ownSrc)
        ? "overlay"
        : deps.length
          ? "composed"
          : "control";

    const exclusiveFiles = files.filter((f) => reach.get(f) === 1);
    return {
      name,
      shape,
      deps,
      own: gz([ownFile ?? entry]),
      closure: gz(files),
      exclusive: exclusiveFiles.length ? gz(exclusiveFiles) : 0,
      ceiling: CEILINGS[shape],
    };
  });

  const everything = [...new Set([...sets.values()].flat())];
  return { rows, libraryTotal: everything.length ? gz(everything) : 0, files: everything.length };
};

const run = () => {
  const { rows, libraryTotal, files } = measureAll();
  rows.sort((a, b) => b.exclusive - b.ceiling - (a.exclusive - a.ceiling));

  console.log(
    `  ${"component".padEnd(30)} ${"shape".padEnd(9)} ${"own".padStart(6)} ${"closure".padStart(8)} ${"excl".padStart(7)} ceiling`,
  );
  for (const r of rows) {
    const breach = r.exclusive > r.ceiling;
    console.log(
      `  ${r.name.padEnd(30)} ${r.shape.padEnd(9)} ${r.own.toFixed(2).padStart(6)} ${r.closure
        .toFixed(2)
        .padStart(8)} ${r.exclusive.toFixed(2).padStart(7)} ${String(r.ceiling).padStart(4)}` +
        (breach ? `  BREACH +${(r.exclusive - r.ceiling).toFixed(2)}` : ""),
    );
  }

  const breaches = rows.filter((r) => r.exclusive > r.ceiling);
  console.log(
    `\n  ${rows.length} entries, ${breaches.length} over their class ceiling (gated on exclusive)`,
  );
  console.log(
    `  library total ${libraryTotal.toFixed(2)} KB across ${files} files, recorded ${LIBRARY_TOTAL_KB} KB`,
  );

  let failed = 0;
  if (breaches.length) {
    console.error(
      `\n✗ ${breaches.length} bundle(s) over the class ceiling:\n` +
        breaches
          .map(
            (r) =>
              `    ${r.name}: ${r.exclusive.toFixed(2)} KB > ${r.ceiling} KB (${r.shape})`,
          )
          .join("\n"),
    );
    failed = 1;
  }
  if (libraryTotal > LIBRARY_TOTAL_KB + 0.01) {
    console.error(
      `\n✗ the library grew: ${libraryTotal.toFixed(2)} KB > recorded ${LIBRARY_TOTAL_KB} KB.` +
        ` Every entry can stay under its ceiling while the whole gets heavier; this is that check.`,
    );
    failed = 1;
  } else if (libraryTotal < LIBRARY_TOTAL_KB - RATCHET_SLACK_KB) {
    console.error(
      `\n✗ the library shrank to ${libraryTotal.toFixed(2)} KB, under the recorded ${LIBRARY_TOTAL_KB} KB.` +
        ` Ratchet LIBRARY_TOTAL_KB down in this file — a record left above reality buys back headroom nobody agreed to.`,
    );
    failed = 1;
  }
  if (!failed) console.log("\n✓ every entry within its ceiling, library total within record");
  return failed;
};

/**
 * Proof both gates can fail: plant an entry that busts the smallest ceiling and
 * require it to be caught, and require it to move the library total too.
 * Without this, "0 breaches" and "the walk found nothing" are the same output —
 * which is how the record this replaces passed for four months.
 */
const selfCheck = () => {
  const probeDir = join(DIST, "components", "__CeilingProbe");
  const probeChunk = join(DIST, "shared", "__CeilingProbe-probe01.js");
  if (existsSync(probeDir) || existsSync(probeChunk)) {
    console.error(`✗ a previous probe was left behind — remove ${probeDir}`);
    process.exit(1);
  }
  const before = measureAll();
  try {
    // Random, not repeated: 400k identical characters gzip to under half a KB,
    // and the first draft of this self-check said so.
    writeFileSync(
      probeChunk,
      `export const probe = "${randomBytes(24_000).toString("hex")}";\n`,
      "utf8",
    );
    mkdirSync(probeDir, { recursive: true });
    writeFileSync(
      join(probeDir, "index.js"),
      'export { probe } from "../../shared/__CeilingProbe-probe01.js";\n',
      "utf8",
    );

    const after = measureAll();
    const probe = after.rows.find((r) => r.name === "__CeilingProbe");
    if (!probe) {
      console.error("✗ self-check: the probe entry was not measured at all");
      process.exit(1);
    }
    if (probe.exclusive <= probe.ceiling) {
      console.error(
        `✗ self-check: the probe measured ${probe.exclusive.toFixed(2)} KB exclusive, under its ${probe.ceiling} KB ceiling — not a ceiling-buster`,
      );
      process.exit(1);
    }
    const growth = after.libraryTotal - before.libraryTotal;
    if (growth <= 0.5) {
      console.error(
        `✗ self-check: the library total moved only ${growth.toFixed(2)} KB — the aggregate gate would not see a regression`,
      );
      process.exit(1);
    }
    console.log(
      `✓ self-check: a ${probe.exclusive.toFixed(2)} KB entry breaches its ${probe.ceiling} KB ceiling, and moves the library total by ${growth.toFixed(2)} KB`,
    );
  } finally {
    rmSync(probeDir, { recursive: true, force: true });
    rmSync(probeChunk, { force: true });
  }
};

if (process.argv[2] === "--explain") {
  const name = process.argv[3];
  const entry = join(DIST, "components", name, "index.js");
  if (!existsSync(entry)) {
    console.error(`✗ no entry for ${name}`);
    process.exit(1);
  }
  const files = closure(entry);
  const { rows } = measureAll();
  const row = rows.find((r) => r.name === name);
  console.log(
    `${name}: shape=${row.shape} own=${row.own.toFixed(2)} closure=${row.closure.toFixed(2)} exclusive=${row.exclusive.toFixed(2)} ceiling=${row.ceiling}`,
  );
  console.log(`composes: ${row.deps.join(", ") || "-"}\n`);
  console.log(`  ${"file".padEnd(52)} ${"raw KB".padStart(8)} ${"gz KB".padStart(7)}`);
  for (const f of files
    .map((f) => ({ f, raw: statSync(f).size / 1024, g: gz([f]) }))
    .sort((a, b) => b.g - a.g)) {
    console.log(
      `  ${f.f.replace(`${DIST}/`, "").padEnd(52)} ${f.raw.toFixed(1).padStart(8)} ${f.g.toFixed(2).padStart(7)}`,
    );
  }
  process.exit(0);
}

if (components().length === 0) {
  console.error(
    "✗ no library build in dist/. This gate measures the packaged entries — run `npm run build:lib` first.",
  );
  process.exit(1);
}
console.log(`  floor ${FLOOR} KB (Loader) → control 6, composed 8, overlay 10, surface 12\n`);
selfCheck();
process.exit(run());
