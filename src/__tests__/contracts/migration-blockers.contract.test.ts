/**
 * ADR 002 Task 3a stopped here.
 *
 * Amendment C's rule is that a key whose element carries structural utilities
 * may not be absorbed into a parent — absorbing it is precisely the defect
 * ADR 001 exists to prevent, because the consumer loses the only handle on the
 * box's participation in layout. Amendment C recorded 53 promotions on that
 * basis and the migration table was taken as clean afterwards.
 *
 * It was not. The promotion pass never examined a single R6-nested target
 * (0 of its 53 rows have a dotted `to`), so sixteen nested absorbs were never
 * tested, and three more carry a written note asserting "this element carries
 * no structural utility" while carrying `flex-1`.
 *
 * The same defect also hides behind a rename: when two surviving keys claim one
 * target, the elements merge just as surely as an absorb, and eight of those
 * pairs have different structural layers. `002-key-migration.json` labels them
 * `renamed`, so no absorb check would ever look at them.
 *
 * `002-migration-blockers.json` records what is known-broken today. This suite
 * derives the same two sets from the real constants and fails on anything the
 * file does not already list, so the table cannot acquire a new one while it is
 * being repaired.
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { splitLayers } from "../../utils/classLayers";

const modules = {
  ...(import.meta.glob("../../components/*/utils/constants.ts", { eager: true }) as Record<
    string,
    Record<string, unknown>
  >),
  ...(import.meta.glob("../../components/*/constants.ts", { eager: true }) as Record<
    string,
    Record<string, unknown>
  >),
};

const defaults: Record<string, Record<string, string>> = {};
for (const [path, module] of Object.entries(modules)) {
  const component = path.replace("../../components/", "").split("/")[0];
  for (const [name, value] of Object.entries(module)) {
    if (name.startsWith("DEFAULT_") && name.endsWith("_CLASSES")) {
      defaults[`${component}::${name}`] = value as Record<string, string>;
    }
  }
}

/** The structural layer of a key's default, or null when no set declares it. */
const structuralLayer = (component: string, key: string): string[] | null => {
  const owner = component.split("/")[0];
  for (const [name, set] of Object.entries(defaults)) {
    if (name.startsWith(`${owner}::`) && key in set) return splitLayers(set[key] ?? "").structural;
  }
  return null;
};

interface Row {
  component: string;
  key: string;
  outcome: string;
  to: string | null;
}
const read = <T,>(file: string): T =>
  JSON.parse(readFileSync(resolve(process.cwd(), file), "utf8")) as T;

const TABLE = read<{ rows: Row[] }>("docs/adr/002-key-migration.json");
const RECORDED = read<{
  structuralAbsorbs: { component: string; key: string }[];
  lossyMerges: { component: string; to: string }[];
}>("docs/adr/002-migration-blockers.json");

/** Absorbs whose element still carries a structural utility, or has no default at all. */
const structuralAbsorbs = (rows: Row[]): string[] =>
  rows
    .filter((r) => r.outcome === "absorbed-into-parent")
    .filter((r) => {
      const layer = structuralLayer(r.component, r.key);
      return layer === null || layer.length > 0;
    })
    .map((r) => `${r.component}.${r.key}`);

/**
 * Targets claimed by two surviving keys whose structural layers differ. Equal
 * layers merge harmlessly — `Pagination.navIcon` folds two `w-5 h-5` icons — so
 * only a genuine difference loses a handle.
 *
 * `message` is excluded: Amendment B's collapse is a known, separately recorded
 * blocker that needs `data-invalid`/`data-valid` on the element first.
 */
const lossyMerges = (rows: Row[]): string[] => {
  const groups = new Map<string, Row[]>();
  for (const row of rows) {
    if (row.outcome !== "renamed" && row.outcome !== "unchanged") continue;
    const id = `${row.component}|${row.to}`;
    groups.set(id, [...(groups.get(id) ?? []), row]);
  }
  const found: string[] = [];
  for (const [id, sources] of groups) {
    const [component, to] = id.split("|");
    if (sources.length < 2 || to === "message") continue;
    const layers = new Set(
      sources.map((s) => [...(structuralLayer(component, s.key) ?? [])].sort().join(" ")),
    );
    if (layers.size > 1) found.push(`${component}.${to}`);
  }
  return found.sort();
};

describe("migration blockers contract", () => {
  describe("self-check", () => {
    it("sees a structural absorb", () => {
      expect(
        structuralAbsorbs([
          { component: "Accordion", key: "trigger", outcome: "absorbed-into-parent", to: "item" },
        ]),
      ).toEqual(["Accordion.trigger"]);
    });

    it("does not flag an absorb whose element is purely decorative", () => {
      expect(
        structuralAbsorbs([
          { component: "Accordion", key: "heading", outcome: "absorbed-into-parent", to: "item" },
        ]),
      ).toEqual([]);
    });

    it("sees two keys with different structural layers claiming one target", () => {
      expect(
        lossyMerges([
          { component: "Accordion", key: "root", outcome: "renamed", to: "x" },
          { component: "Accordion", key: "heading", outcome: "renamed", to: "x" },
        ]),
      ).toEqual(["Accordion.x"]);
    });

    it("does not flag a merge whose sources share a structural layer", () => {
      expect(
        lossyMerges([
          { component: "Pagination", key: "prevIcon", outcome: "renamed", to: "x" },
          { component: "Pagination", key: "nextIcon", outcome: "renamed", to: "x" },
        ]),
      ).toEqual([]);
    });
  });

  it("acquires no absorb that strands a structural utility", () => {
    const known = new Set(RECORDED.structuralAbsorbs.map((a) => `${a.component}.${a.key}`));
    expect(
      structuralAbsorbs(TABLE.rows).filter((a) => !known.has(a)),
      "a new absorb would take the consumer's only handle on layout with it",
    ).toEqual([]);
  });

  it("acquires no merge that strands a structural utility", () => {
    const known = new Set(RECORDED.lossyMerges.map((m) => `${m.component}.${m.to}`));
    expect(
      lossyMerges(TABLE.rows).filter((m) => !known.has(m)),
      "two elements with different layout roles would share one key",
    ).toEqual([]);
  });
});
