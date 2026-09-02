/**
 * The migration table is the input to Task 3, so it has to be internally sound
 * before a single key is renamed against it.
 *
 * The collision check existed only as a throwaway script while the amendments
 * were being written. That is exactly the shape of gate this branch keeps
 * finding and removing — a check nobody can re-run and nothing proves can fail.
 * It lives here now, with the probe.
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { splitLayers } from "../../utils/classLayers";
import { resolve } from "node:path";

interface Row {
  component: string;
  key: string;
  outcome: string;
  to: string | null;
  vocabulary?: string;
  precedent?: string;
}
const TABLE = JSON.parse(
  readFileSync(resolve(process.cwd(), "docs/adr/002-key-migration.json"), "utf8"),
) as {
  rows: Row[];
  totals: Record<string, number>;
  vocabularyAmendments: Record<string, string>;
  declaredMerges: Record<string, string[]>;
};

const constants = {
  ...(import.meta.glob("../../components/*/utils/constants.ts", { eager: true }) as Record<string, Record<string, unknown>>),
  ...(import.meta.glob("../../components/*/constants.ts", { eager: true }) as Record<string, Record<string, unknown>>),
};
const defaults: Record<string, Record<string, string>> = {};
for (const [path, module] of Object.entries(constants)) {
  const component = path.replace("../../components/", "").split("/")[0];
  for (const [name, value] of Object.entries(module)) {
    if (name.startsWith("DEFAULT_") && name.endsWith("_CLASSES")) {
      defaults[`${component}::${name}`] = value as Record<string, string>;
    }
  }
}

/** The structural half of a key's default, or null when no set declares it. */
const structuralLayer = (component: string, key: string): string[] | null => {
  const owner = component.split("/")[0];
  for (const [name, set] of Object.entries(defaults)) {
    if (name.startsWith(`${owner}::`) && key in set) return splitLayers(set[key] ?? "").structural;
  }
  return null;
};

const sources = import.meta.glob("../../components/**/*.tsx", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

/**
 * Keys written into one `className` expression sit on one element, so they can
 * never be "two elements sharing a key" however the table routes them. Without
 * this the structural test reports `Accordion.contentInner` — which is
 * `cn(classes.content, classes.contentInner)` on a single div — as a merge.
 */
const coLocated = new Map<string, Set<string>>();
for (const [path, source] of Object.entries(sources)) {
  if (path.includes("__tests__")) continue;
  const component = path.replace("../../components/", "").split("/")[0];
  for (const match of source.matchAll(/className=\{/g)) {
    const start = (match.index ?? 0) + match[0].length - 1;
    let depth = 0;
    let i = start;
    for (; i < source.length; i += 1) {
      const ch = source[i];
      if (ch === '"' || ch === "'" || ch === "`") {
        const quote = ch;
        i += 1;
        while (i < source.length && source[i] !== quote) i += source[i] === "\\" ? 2 : 1;
      } else if (ch === "{") {
        depth += 1;
      } else if (ch === "}") {
        depth -= 1;
        if (depth === 0) break;
      }
    }
    const keys = new Set<string>();
    const pattern = /(?:classes|cls|base|merged|mergedClasses)\??\.(\w+)|\b(\w+)ClassName\b/g;
    for (const [, dotted, suffixed] of source.slice(start, i + 1).matchAll(pattern)) {
      if (dotted) keys.add(dotted);
      else if (suffixed) keys.add(suffixed[0].toLowerCase() + suffixed.slice(1));
    }
    if (keys.size < 2) continue;
    for (const key of keys) {
      const id = `${component}.${key}`;
      coLocated.set(id, new Set([...(coLocated.get(id) ?? []), ...keys]));
    }
  }
}
const sameElement = (component: string, a: string, b: string): boolean =>
  coLocated.get(`${component.split("/")[0]}.${a}`)?.has(b) ?? false;

/** Targets claimed by more than one surviving key. */
/** Rows claiming `unchanged` while naming a different target. */
const mislabelledUnchanged = (rows: Row[]): string[] =>
  rows
    .filter((r) => r.outcome === "unchanged" && r.to !== r.key)
    .map((r) => `${r.component}.${r.key} -> ${r.to}`);

const sharedTargets = (rows: Row[]): string[] => {
  const claims = new Map<string, number>();
  for (const row of rows) {
    if (row.outcome !== "renamed" && row.outcome !== "unchanged") continue;
    const id = `${row.component}.${row.to}`;
    claims.set(id, (claims.get(id) ?? 0) + 1);
  }
  return [...claims.entries()].filter(([, n]) => n > 1).map(([id]) => id).sort();
};

/**
 * Amendment F's rule, generalised from Amendment C's: any element that ends up
 * sharing a key with a DIFFERENT element must not merge differing structural
 * layers. Amendment C tested only the 53 rows it was rewriting and never looked
 * at an R6-nested target; running the same test over absorbs, shared rename
 * targets and nesting alike found 30 more groups.
 */
const structuralMergeFailures = (rows: Row[]): string[] => {
  const groups = new Map<string, Row[]>();
  for (const row of rows) {
    if (row.outcome === "deleted-as-state" || row.outcome === "deleted-as-dead") continue;
    const id = `${row.component}|${row.to}`;
    groups.set(id, [...(groups.get(id) ?? []), row]);
  }
  const failures: string[] = [];
  for (const [id, members] of groups) {
    if (members.length < 2) continue;
    const [component, to] = id.split("|");
    const distinct = members.filter(
      (m) => !members.some((o) => o !== m && sameElement(component, m.key, o.key)),
    );
    if (distinct.length < 2) continue;
    const layers = new Set(
      distinct.map((m) => [...(structuralLayer(component, m.key) ?? ["UNKNOWN"])].sort().join(" ")),
    );
    if (layers.size > 1) failures.push(`${component}.${to}`);
  }
  return failures.sort();
};

/** `totals` keys that are a straight count of rows by outcome. */
const OUTCOME_TOTALS: Record<string, string> = {
  renamed: "renamed",
  unchanged: "unchanged",
  absorbedIntoParent: "absorbed-into-parent",
  deletedAsState: "deleted-as-state",
  deletedAsDead: "deleted-as-dead",
};

describe("key migration contract", () => {
  describe("self-check", () => {
    it("catches a rename labelled unchanged", () => {
      const planted: Row[] = [
        { component: "Probe", key: "wrapper", outcome: "unchanged", to: "control" },
      ];
      expect(mislabelledUnchanged(planted)).toEqual(["Probe.wrapper -> control"]);
    });

    it("catches an undeclared shared target", () => {
      const planted: Row[] = [
        { component: "Probe", key: "wrapper", outcome: "renamed", to: "somewhereNew" },
        { component: "Probe", key: "inner", outcome: "renamed", to: "somewhereNew" },
      ];
      expect(sharedTargets(planted)).toEqual(["Probe.somewhereNew"]);
    });

    it("catches a merge that combines differing structural layers", () => {
      // Accordion.root is `w-full`, Accordion.heading is empty: different layers,
      // different elements.
      const planted: Row[] = [
        { component: "Accordion", key: "root", outcome: "renamed", to: "probe" },
        { component: "Accordion", key: "heading", outcome: "renamed", to: "probe" },
      ];
      expect(structuralMergeFailures(planted)).toEqual(["Accordion.probe"]);
    });

    it("does not flag two keys that sit on one element", () => {
      const planted: Row[] = [
        { component: "Accordion", key: "content", outcome: "renamed", to: "probe" },
        { component: "Accordion", key: "contentInner", outcome: "absorbed-into-parent", to: "probe" },
      ];
      expect(structuralMergeFailures(planted)).toEqual([]);
    });
  });

  it("every absorb or state target is itself a surviving part", () => {
    const survivors = new Map<string, Set<string>>();
    for (const r of TABLE.rows) {
      if ((r.outcome === "renamed" || r.outcome === "unchanged") && r.to) {
        const s = survivors.get(r.component) ?? new Set<string>();
        s.add(r.to);
        survivors.set(r.component, s);
      }
    }
    const dangling: string[] = [];
    for (const r of TABLE.rows) {
      if (r.outcome !== "absorbed-into-parent" && r.outcome !== "deleted-as-state") continue;
      // R6 nesting targets are owned by the child component, not this one.
      if (!r.to || r.to.includes(".")) continue;
      if (!survivors.get(r.component)?.has(r.to)) {
        dangling.push(`${r.component}.${r.key} -> ${r.to}`);
      }
    }
    expect(dangling, "absorbed into a part that does not exist").toEqual([]);
  });

  it("every name outside R2 carries a precedent or is marked NOVEL", () => {
    const undocumented = TABLE.rows
      .filter((r) => r.vocabulary === "amendment")
      .filter((r) => !r.precedent || r.precedent === "UNDOCUMENTED")
      .map((r) => `${r.component}.${r.key} -> ${r.to}`);
    expect(undocumented, "an amendment term with no precedent recorded").toEqual([]);
  });

  /**
   * 24 rows shipped as `unchanged` while naming a different target. They were
   * renames counted as no-ops, which is why the recorded rename total was 176
   * against a real 200 — and why Task 3a's first pass would have skipped them.
   * `unchanged` has to mean the name did not change.
   */
  it("every unchanged row keeps its own name", () => {
    expect(
      mislabelledUnchanged(TABLE.rows),
      "an outcome of `unchanged` on a row that renames the key",
    ).toEqual([]);
  });

  /** The totals were read straight into a task brief; nothing derived them. */
  it("every total is a count over the rows", () => {
    const drift: string[] = [];
    for (const [field, outcome] of Object.entries(OUTCOME_TOTALS)) {
      const actual = TABLE.rows.filter((r) => r.outcome === outcome).length;
      if (TABLE.totals[field] !== actual) {
        drift.push(`${field}: recorded ${TABLE.totals[field]}, rows say ${actual}`);
      }
    }
    const after = new Set(
      TABLE.rows.filter((r) => r.outcome === "renamed" || r.outcome === "unchanged")
        .map((r) => `${r.component}.${r.to}`),
    );
    if (TABLE.totals.keysAfter !== after.size) {
      drift.push(`keysAfter: recorded ${TABLE.totals.keysAfter}, rows say ${after.size}`);
    }
    expect(drift, "a recorded total nothing derives from the rows").toEqual([]);
  });

  /** A shared target has to be a decision somebody wrote down, not a coincidence. */
  it("every shared target is a declared merge", () => {
    const declared = new Set(Object.keys(TABLE.declaredMerges));
    expect(
      sharedTargets(TABLE.rows).filter((t) => !declared.has(t)),
      "two elements would claim one key with nothing recording that as intentional",
    ).toEqual([]);
  });

  it("no merge combines differing structural layers", () => {
    expect(
      structuralMergeFailures(TABLE.rows),
      "merging these strands a consumer's only handle on the box's layout",
    ).toEqual([]);
  });

  it("covers every key exactly once", () => {
    expect(TABLE.rows.length).toBe(TABLE.totals.keysBefore);
    const seen = new Set(TABLE.rows.map((r) => `${r.component}.${r.key}`));
    expect(seen.size).toBe(TABLE.rows.length);
  });
});
