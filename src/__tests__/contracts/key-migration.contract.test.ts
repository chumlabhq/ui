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
}
const TABLE = JSON.parse(
  readFileSync(resolve(process.cwd(), "docs/adr/002-key-migration.json"), "utf8"),
) as {
  rows: Row[];
  totals: Record<string, number>;
  vocabularyAmendments: Record<string, string>;
};

/**
 * Names where two source keys collapsing onto one part is the intended outcome —
 * two states of one element, or the same element spelled twice. Anything else
 * sharing a name is two different elements fighting over one key, which Task 3
 * would resolve by silently overwriting one of them.
 */
const DECLARED_MERGES = new Set([
  "message",
  "icon",
  "navIcon",
  "item",
  "fallback",
  "ellipsis",
  "list",
  "loading",
  "presetTrigger",
  "pinButton",
  "clockHand",
  "searchInput",
  "itemIndicator",
  "content",
]);

const collisions = (rows: Row[]): string[] => {
  const claims = new Map<string, string[]>();
  for (const r of rows) {
    if (r.outcome !== "renamed" && r.outcome !== "unchanged") continue;
    if (!r.to) continue;
    const k = `${r.component} ${r.to}`;
    claims.set(k, [...(claims.get(k) ?? []), r.key]);
  }
  return [...claims.entries()]
    .filter(([k, keys]) => keys.length > 1 && !DECLARED_MERGES.has(k.split(" ")[1]))
    .map(([k, keys]) => `${k.replace(" ", ".")} <- ${keys.join(", ")}`);
};

describe("key migration contract", () => {
  describe("self-check", () => {
    it("catches two different keys claiming one undeclared name", () => {
      const planted: Row[] = [
        { component: "Probe", key: "wrapper", outcome: "renamed", to: "somewhereNew" },
        { component: "Probe", key: "inner", outcome: "renamed", to: "somewhereNew" },
      ];
      expect(collisions(planted)).toEqual(["Probe.somewhereNew <- wrapper, inner"]);
    });

    it("does not flag a declared merge", () => {
      const merged: Row[] = [
        { component: "Probe", key: "error", outcome: "renamed", to: "message" },
        { component: "Probe", key: "success", outcome: "renamed", to: "message" },
      ];
      expect(collisions(merged)).toEqual([]);
    });
  });

  it("no two surviving keys in a component claim the same part", () => {
    expect(
      collisions(TABLE.rows),
      "two different elements would share one key",
    ).toEqual([]);
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

  it("covers every key exactly once", () => {
    expect(TABLE.rows.length).toBe(TABLE.totals.keysBefore);
    const seen = new Set(TABLE.rows.map((r) => `${r.component}.${r.key}`));
    expect(seen.size).toBe(TABLE.rows.length);
  });
});
