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
 * ── Shape, and why it is derived from SOURCE ───────────────────────────────
 *
 * The shape sets the ceiling, so hand-assigning it would make the ceiling a
 * matter of opinion. It is derived, first match wins — and it is derived from
 * `src/components/<name>`, not from the built artifact.
 *
 * It used to read the built chunk, which measured a proxy. "Does this component
 * portal?" is a fact about its source; which chunk the `createPortal` call ends
 * up in is a fact about Rollup. When the menu surfaces were extracted behind
 * `MenuSurface`, the call moved into a shared chunk and eight components lost
 * their overlay classification — their ceilings fell 2-4 KB because they got
 * smaller. Three more (Modal, Drawer, Toast) had been misread the same way for
 * longer, their own chunks being too small to hold the call.
 *
 * Reading the whole closure instead would swap one proxy for another: every
 * component that renders a Tooltip would inherit "overlay" from it. Source is
 * the level the question is actually asked at.
 *
 *   surface   renders a two-dimensional cell grid (`role="grid"`)
 *   overlay   renders into a portal — `createPortal`, or `MenuSurface`, which
 *             is the shared surface that portals on its behalf
 *   composed  EITHER ships sub-components of its own — a named export the
 *             package root re-exports from this component's directory, with a
 *             `<Tag>Props` type of its own, which is the same derivation
 *             `build-subcomponent-schemas.mjs` uses — OR imports another
 *             component, resolved by path rather than matched by name:
 *             `../CircularLoader` from inside Loader is Loader's own file, and
 *             a chunk called `AccordionShimmer-*.js` is not evidence that
 *             Accordion depends on something else
 *   control   none of the above
 *
 * The positive half was added because "else control" is a default, not a
 * classification. Accordion portals nothing and imports no sibling, so it fell
 * to control by elimination and was measured against a Button's ceiling while
 * shipping four sub-components and 27 props. A component that ships its own
 * composition is composed on any reading of the ladder; that it also has to be
 * caught by an import was an artefact of there being only one test.
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
const LIBRARY_TOTAL_KB = 146.65;

/**
 * Breaches that are recorded rather than fixed, each with the reason and the
 * number it may not exceed. Down-only, like every other ratchet on this branch:
 * a declared entry that shrinks must be re-recorded, and one that falls under
 * its ceiling must be deleted. A breach that is not here fails the gate.
 *
 * A ceiling is never raised to accommodate a component, and no component is
 * split to satisfy a number.
 */
const DECLARED_BREACHES = new Map([
  [
    "Table",
    {
      kb: 15.79,
      why: "16.76 until the column-filter dialog moved into a chunk of its own " +
        "(FilterPanel), with the popup behaviour that reads its element — focus " +
        "in, reposition, close on an outside click. It is the only part of " +
        "Table that exists after an interaction rather than at the first paint, " +
        "which is what ADR 003 allows to arrive late. Every other feature is " +
        "gated by a prop the consumer sets before the first render — resize " +
        "handles, filter triggers, the search bar, the mobile cards — so a " +
        "chunk arriving a frame later would widen a header or swap the tree " +
        "after paint. Measured, not assumed: deferring all of those anyway " +
        "reaches 14.67, and 11.64 arrives only when renderHeaderCell, " +
        "renderCell, renderRow and renderTable go too. The residue is the grid. " +
        "Its props, state, TanStack config and 45 class slots cost 11.64 with " +
        "every cell stubbed out — 97% of a surface's ceiling before anything is " +
        "drawn. Subpath entries do not help: they split what a consumer imports " +
        "separately, and these are props on one component. The one exception is " +
        "`exportTableToCSV` at 0.40 KB, which the component never calls and any " +
        "consumer's tree-shaker already drops.",
    },
  ],
  [
    "InternationalPhoneInput",
    {
      kb: 8.69,
      why: "10.65 until the 193 countries were packed into a delimited string " +
        "parsed at module load: 4.06 KB gzipped of object literals became 1.90, " +
        "and four fifths of what was there was structure rather than " +
        "information — five repeated keys a bundler cannot dedupe, plus `flag` " +
        "and `label`, which are derivable from the other three in all 193 rows. " +
        "The remaining 0.69 over is the data itself, which cannot be deferred: " +
        "`selectedCountry` resolves out of it during the first render to paint " +
        "the trigger's flag and dial code, so deferring it is a blank trigger " +
        "on first paint. The parse is 0.036 ms, once per module load.",
    },
  ],
  [
    "DatePicker",
    {
      kb: 12.03,
      why: "12.59 before its optional halves moved into chunks of their own: " +
        "the presets panel with the default-preset helper it now resolves, and " +
        "the marker tooltip's subtree. 0.03 over, and the last 0.18 KB of it is " +
        "comment text — this gate measures the unminified dist, which a " +
        "consumer's bundler strips. Week numbers were the third candidate and " +
        "are not one: the rendering is fourteen lines interleaved in the day " +
        "grid, and a column that arrives with a chunk would reflow the grid " +
        "after paint.",
    },
  ],
  [
    "Accordion",
    {
      kb: 9.16,
      why: "Composed, and still 1.16 over. Its own chunk is 0.52 KB; the rest " +
        "is AccordionContent and useAccordionStateManager in sibling chunks " +
        "nothing else reaches. It shipped four sub-components against a " +
        "Button's 6 KB ceiling until the shape rule gained a positive test for " +
        "composed — the 8 KB it is measured against now is the one it earns, " +
        "and it is over that too. Nothing here is optional behind a prop: an " +
        "item, a trigger and a content panel are what an accordion is.",
    },
  ],
]);

/** How far under its record a declared breach may drift before it is stale. */
const DECLARED_SLACK_KB = 0.25;

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

const SRC_COMPONENTS = resolve(root, "src/components");

/** Every source file of one component, tests excluded. */
const sourceFilesOf = (name) => {
  const base = join(SRC_COMPONENTS, name);
  if (!existsSync(base)) return [];
  const walk = (dir) =>
    readdirSync(dir).flatMap((entry) => {
      const path = join(dir, entry);
      if (statSync(path).isDirectory()) return walk(path);
      return /\.tsx?$/.test(entry) && !path.includes("__tests__") ? [path] : [];
    });
  return walk(base);
};

/** The component directory a resolved path belongs to, or null if outside. */
const componentOwning = (absolute) => {
  const rel = absolute.slice(SRC_COMPONENTS.length + 1);
  if (absolute.slice(0, SRC_COMPONENTS.length) !== SRC_COMPONENTS) return null;
  const first = rel.split("/")[0];
  return first || null;
};

/**
 * The four tests, first match wins, over a component's own source.
 *
 * Separated from the file walk so the self-check can put synthetic sources
 * through the same function the gate uses.
 */
const shapeOf = (text, deps, ships = []) =>
  /role=["']grid["']|role:\s*["']grid["']/.test(text)
    ? "surface"
    : /\bcreatePortal\b|\bMenuSurface\b/.test(text)
      ? "overlay"
      : deps.size || ships.length
        ? "composed"
        : "control";

/**
 * Sub-components a component ships: a value export the package root re-exports
 * from this component's directory, which also declares a `<Tag>Props` type.
 *
 * Both halves matter. The root export is what makes it shipped rather than an
 * internal file — `TabButton` is exported from TabPanel's own index and not
 * from the package, so a consumer cannot compose with it. The props type is
 * what makes it a component rather than an icon: every component's index
 * exports `ChevronDownIcon` and friends, and none of them is composition.
 * This is the derivation `build-subcomponent-schemas.mjs` already uses to
 * decide what to write a schema for.
 */
const shipsSubComponents = (name, ownSource) => {
  const rootExports = readFileSync(join(SRC_COMPONENTS, "..", "index.ts"), "utf8");
  const tags = new Set();
  for (const m of rootExports.matchAll(
    /export\s*(type\s*)?\{([^}]*)\}\s*from\s*["']\.\/components\/([^/"']+)/g,
  )) {
    if (m[1] || m[3] !== name) continue;
    for (const part of m[2].split(",")) {
      const tag = part.trim().replace(/^type\s+/, "").split(/\s+as\s+/).pop()?.trim();
      if (!tag || tag === name) continue;
      if (!/^[A-Z][A-Za-z0-9]*$/.test(tag) || /^[A-Z0-9_]+$/.test(tag)) continue;
      if (new RegExp(`(interface|type)\\s+${tag}Props\\b`).test(ownSource)) tags.add(tag);
    }
  }
  return [...tags];
};

/** A component's shape, read from `src/components/<name>`. */
const shapeFromSource = (name) => {
  const files = sourceFilesOf(name);
  if (files.length === 0) return { shape: "control", deps: [], ships: [] };
  let text = "";
  const deps = new Set();
  for (const file of files) {
    const body = readFileSync(file, "utf8");
    text += body + "\n";
    for (const m of body.matchAll(/from\s*["']([^"']+)["']/g)) {
      if (!m[1].startsWith(".")) continue;
      const owner = componentOwning(resolve(dirname(file), m[1]));
      if (owner && owner !== name) deps.add(owner);
    }
  }
  const ships = shipsSubComponents(name, text);
  return { shape: shapeOf(text, deps, ships), deps: [...deps], ships };
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
    // Read from source, not from `ownSrc`: which chunk a call lands in is
    // Rollup's decision, and it moved eight ceilings when the surfaces were
    // shared. `deps` above stays for the report; the shape uses the resolved
    // source imports instead.
    const { shape } = shapeFromSource(name);

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

  const undeclared = breaches.filter((r) => !DECLARED_BREACHES.has(r.name));
  const grew = breaches.filter(
    (r) => DECLARED_BREACHES.has(r.name) && r.exclusive > DECLARED_BREACHES.get(r.name).kb + 0.01,
  );
  const shrank = breaches.filter(
    (r) =>
      DECLARED_BREACHES.has(r.name) &&
      r.exclusive < DECLARED_BREACHES.get(r.name).kb - DECLARED_SLACK_KB,
  );
  const cleared = [...DECLARED_BREACHES.keys()].filter((name) => {
    const row = rows.find((r) => r.name === name);
    return row && row.exclusive <= row.ceiling;
  });
  const missing = [...DECLARED_BREACHES.keys()].filter(
    (name) => !rows.some((r) => r.name === name),
  );

  if (breaches.length) {
    console.log(
      `\n  ${breaches.length - undeclared.length} declared breach(es):\n` +
        breaches
          .filter((r) => DECLARED_BREACHES.has(r.name))
          .map(
            (r) =>
              `    ${r.name}: ${r.exclusive.toFixed(2)} KB > ${r.ceiling} KB (${r.shape}), recorded ${DECLARED_BREACHES.get(r.name).kb}`,
          )
          .join("\n"),
    );
  }

  if (undeclared.length) {
    console.error(
      `\n✗ ${undeclared.length} bundle(s) over the class ceiling and not declared:\n` +
        undeclared
          .map(
            (r) =>
              `    ${r.name}: ${r.exclusive.toFixed(2)} KB > ${r.ceiling} KB (${r.shape})`,
          )
          .join("\n"),
    );
    failed = 1;
  }

  if (grew.length) {
    console.error(
      `\n✗ ${grew.length} declared breach(es) grew past their record:\n` +
        grew
          .map(
            (r) =>
              `    ${r.name}: ${r.exclusive.toFixed(2)} KB > recorded ${DECLARED_BREACHES.get(r.name).kb} KB`,
          )
          .join("\n") +
        `\n  A declared breach is a number held still, not a licence to grow.`,
    );
    failed = 1;
  }

  if (shrank.length) {
    console.error(
      `\n✗ ${shrank.length} declared breach(es) are now smaller than recorded:\n` +
        shrank
          .map(
            (r) =>
              `    ${r.name}: ${r.exclusive.toFixed(2)} KB, recorded ${DECLARED_BREACHES.get(r.name).kb} KB — lower it`,
          )
          .join("\n") +
        `\n  A record left above reality buys back headroom nobody agreed to.`,
    );
    failed = 1;
  }

  if (cleared.length) {
    console.error(
      `\n✗ ${cleared.length} declared breach(es) are now under their ceiling: ${cleared.join(", ")}.` +
        ` Remove them from DECLARED_BREACHES — an entry nobody needs is a licence left lying about.`,
    );
    failed = 1;
  }

  if (missing.length) {
    console.error(
      `\n✗ DECLARED_BREACHES names entries that were not measured: ${missing.join(", ")}`,
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
  if (!failed)
    console.log(
      "\n✓ no undeclared breach, every declared breach held at its record, library total within record",
    );
  return failed;
};

/**
 * Proof both gates can fail: plant an entry that busts the smallest ceiling and
 * require it to be caught, and require it to move the library total too.
 * Without this, "0 breaches" and "the walk found nothing" are the same output —
 * which is how the record this replaces passed for four months.
 */
/**
 * The shape must be a fact about source, not about bundling.
 *
 * Two directions, because the bug had two halves: a portal call that moves
 * between chunks must not change a component's shape, and a component that
 * stops portalling must actually lose it. The first is what cost eight
 * components 2-4 KB of ceiling for getting smaller.
 */
const shapeSelfCheck = () => {
  const fail = (message) => {
    console.error(`✗ self-check: ${message}`);
    process.exit(1);
  };

  const none = new Set();
  if (shapeOf('createPortal(<div />, document.body)', none) !== "overlay")
    fail("a direct createPortal is not read as an overlay");
  if (shapeOf('<MenuSurface trigger={ref} isOpen>x</MenuSurface>', none) !== "overlay")
    fail("portalling through MenuSurface is not read as an overlay");
  if (shapeOf('<div>plain</div>', none) !== "control")
    fail("a component that portals nothing is still read as an overlay");
  if (shapeOf('<div role="grid" />', none) !== "surface")
    fail("a grid is not read as a surface");
  if (shapeOf('<div />', new Set(["Tooltip"])) !== "composed")
    fail("a component importing another is not read as composed");
  if (shapeOf('<div />', none, ["AccordionItem"]) !== "composed")
    fail("a component shipping a sub-component is not read as composed");
  if (shapeOf('<div />', none, []) !== "control")
    fail("a component shipping nothing and importing nothing is not read as control");
  // Against the real tree, both directions: Accordion ships four sub-components
  // and imports no sibling — it is the component the positive test was added
  // for — and Checkbox ships none and must stay a control.
  const accordion = shapeFromSource("Accordion");
  if (accordion.shape !== "composed" || accordion.ships.length === 0)
    fail(`Accordion reads as ${accordion.shape}; it ships ${accordion.ships.length} sub-component(s)`);
  if (shapeFromSource("Checkbox").shape !== "control")
    fail("Checkbox ships no sub-component and must still read as a control");

  // The regression itself, against the real tree: Dropdown portals through
  // MenuSurface, so its own built chunk contains no `createPortal` at all. If
  // the shape ever goes back to reading the artifact, this is what fails.
  const dropdown = shapeFromSource("Dropdown");
  if (dropdown.shape !== "overlay")
    fail(`Dropdown reads as ${dropdown.shape}; it portals through MenuSurface and is an overlay`);
  const ownChunk = join(DIST, "components", "Dropdown", "index.js");
  if (existsSync(ownChunk) && /createPortal/.test(readFileSync(ownChunk, "utf8")))
    console.warn("  note: Dropdown's entry now contains createPortal directly — the check above is weaker than it was");

  console.log(
    "✓ self-check: shape survives the call moving chunks, is lost when the call goes, " +
      "and composed has a positive test",
  );
};

const selfCheck = () => {
  const probeDir = join(DIST, "components", "__CeilingProbe");
  const probeChunk = join(DIST, "shared", "__CeilingProbe-probe01.js");
  if (existsSync(probeDir) || existsSync(probeChunk)) {
    console.error(`✗ a previous probe was left behind — remove ${probeDir}`);
    process.exit(1);
  }
  shapeSelfCheck();
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
