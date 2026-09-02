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
import { resolve } from "node:path";

interface Row {
  component: string;
  key: string;
  outcome: string;
  to: string | null;
  vocabulary?: string;
  precedent?: string;
  structuralBefore?: string[];
}
const TABLE = JSON.parse(
  readFileSync(resolve(process.cwd(), "docs/adr/002-key-migration.json"), "utf8"),
) as {
  rows: Row[];
  totals: Record<string, number>;
  vocabularyAmendments: Record<string, string>;
  declaredMerges: Record<string, string[]>;
  coLocatedBefore: Record<string, [string, string][]>;
};

/**
 * R9's evidence is frozen into the table rather than read from the tree.
 *
 * Task 3a renames the keys and merges the class strings, so a check that read
 * the live constants would afterwards look up names that no longer exist, find
 * nothing, and pass on every row — a gate that cannot see its own evidence.
 * `structuralBefore` and `coLocatedBefore` are the pre-migration facts, read
 * from git at the moment the migration was applied.
 */
const sameElement = (component: string, a: string, b: string): boolean =>
  (TABLE.coLocatedBefore[component.split("/")[0]] ?? []).some(
    ([x, y]) => (x === a && y === b) || (x === b && y === a),
  );

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
    void component;
    const distinct = members.filter(
      (m) => !members.some((o) => o !== m && sameElement(component, m.key, o.key)),
    );
    if (distinct.length < 2) continue;
    const layers = new Set(
      distinct.map((m) => [...(m.structuralBefore ?? ["UNKNOWN"])].sort().join(" ")),
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
      const planted: Row[] = [
        { component: "Accordion", key: "root", outcome: "renamed", to: "probe", structuralBefore: ["w-full"] },
        { component: "Accordion", key: "heading", outcome: "renamed", to: "probe", structuralBefore: [] },
      ];
      expect(structuralMergeFailures(planted)).toEqual(["Accordion.probe"]);
    });

    it("does not flag two keys that sit on one element", () => {
      // `cn(classes.content, classes.contentInner)` was one div with two handles.
      const planted: Row[] = [
        { component: "Accordion", key: "content", outcome: "renamed", to: "probe", structuralBefore: [] },
        { component: "Accordion", key: "contentInner", outcome: "absorbed-into-parent", to: "probe", structuralBefore: ["overflow-hidden"] },
      ];
      expect(sameElement("Accordion", "content", "contentInner")).toBe(true);
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
