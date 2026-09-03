/**
 * Two keys must not read one `classesProp` entry.
 *
 * `key-uniqueness.contract` catches one key applied to two elements. This is the
 * mirror image: two DIFFERENT keys wired to the same source, so one of them can
 * never be overridden independently — whatever the consumer passes for it is
 * discarded before it reaches the DOM.
 *
 * Table had two of these. `headerRowClassName` and `headerClassName` both read
 * `classesProp?.header`, and `searchBarClassName` and `searchInputClassName`
 * both read `classesProp?.searchInput`, so `headerRow` and `searchControl`
 * existed as names with no way in. Neither the migration table nor a render
 * shows it: the shape is in the wiring.
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * A declared merge is allowed to share a source: the merge IS two elements
 * taking one key, so two locals reading it is the intended wiring. Anything
 * else is a key with no way in.
 */
const TABLE = JSON.parse(
  readFileSync(resolve(process.cwd(), "docs/adr/002-key-migration.json"), "utf8"),
) as {
  declaredMerges: Record<string, string[]>;
  rows: { component: string; outcome: string; to: string | null }[];
};
const DECLARED = new Set([
  ...Object.keys(TABLE.declaredMerges),
  // An absorbed key reads its parent by design: that is what the absorb means.
  ...TABLE.rows
    .filter((r) => r.outcome === "absorbed-into-parent" && r.to)
    .map((r) => `${r.component}.${r.to}`),
]);

const sources = import.meta.glob("../../components/**/*.tsx", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

/** `const fooClassName = classesProp?.bar ?? base.bar;` -> [foo, bar] */
const READ = /const\s+(\w+)ClassName\s*=\s*classesProp\?\.(\w+)/g;

interface Wire { local: string; key: string }

const wiring = (): Record<string, Wire[]> => {
  const out: Record<string, Wire[]> = {};
  for (const [path, source] of Object.entries(sources)) {
    if (/__tests__|\/ui\//.test(path)) continue;
    const file = path.replace("../../components/", "");
    for (const m of source.matchAll(READ)) {
      (out[file] ||= []).push({ local: m[1], key: m[2] });
    }
  }
  return out;
};

/** Keys read by more than one differently-named local. */
const shared = (wires: Record<string, Wire[]>, declared: Set<string> = DECLARED): string[] => {
  const found: string[] = [];
  for (const [file, list] of Object.entries(wires)) {
    const byKey = new Map<string, Set<string>>();
    for (const w of list) {
      byKey.set(w.key, new Set([...(byKey.get(w.key) ?? []), w.local]));
    }
    for (const [key, locals] of byKey) {
      const component = file.split("/")[0];
      if (locals.size > 1 && !declared.has(`${component}.${key}`)) {
        found.push(`${file}: ${[...locals].join(", ")} all read classesProp.${key}`);
      }
    }
  }
  return found.sort();
};

describe("key source contract", () => {
  describe("self-check", () => {
    it("catches two locals reading one key", () => {
      expect(
        shared({ "X.tsx": [{ local: "header", key: "header" }, { local: "headerRow", key: "header" }] }, new Set()),
      ).toEqual(["X.tsx: header, headerRow all read classesProp.header"]);
    });

    it("does not flag one local per key", () => {
      expect(
        shared({ "X.tsx": [{ local: "header", key: "header" }, { local: "headerRow", key: "headerRow" }] }, new Set()),
      ).toEqual([]);

    });

    it("allows a declared merge to share a source", () => {
      expect(
        shared(
          { "Table/Table.tsx": [{ local: "cell", key: "cell" }, { local: "checkboxCell", key: "cell" }] },
          new Set(["Table.cell"]),
        ),
      ).toEqual([]);
    });
  });

  it("reads component source", () => {
    expect(Object.keys(sources).length).toBeGreaterThan(50);
  });

  it("wires every key to exactly one local", () => {
    const offenders = shared(wiring());
    expect(
      offenders,
      "one of these keys can never be overridden independently:\n" + offenders.join("\n"),
    ).toEqual([]);
  });
});
