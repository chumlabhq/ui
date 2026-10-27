/**
 * One anchored-position implementation, asserted by hashing the source.
 *
 * `computeDropdownCoords` existed in nine copies across eight distinct
 * behaviours. They were not stylistically different: five threw on SSR, four
 * clamped the right edge by the trigger's width so a wider menu hung off
 * screen, five never clamped a negative left, one pinned its menu near the left
 * edge regardless of the trigger, and none read the `visualViewport` offsets.
 *
 * Copy-paste is how that happened, and nothing failed while it did — positioning
 * is invisible to every other gate in this tier, because jsdom reports every
 * rect as zero. So the gate is structural: it counts the implementations rather
 * than testing their output, and any new one has to be declared here.
 */
import { describe, expect, it } from "vitest";
import ts from "typescript";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";

/**
 * Positioners that are allowed to exist outside `useAnchoredPosition`, each for
 * a reason that is about the call site rather than about the maths.
 *
 * Both estimate the floating element's size instead of measuring it, so neither
 * can be converted without first restructuring it to measure after render —
 * a change that needs its own browser-tier proof at its own call site.
 */
const DECLARED = new Map([
  [
    "DatePicker/DatePicker.tsx:handleMouseEnter",
    "DatePicker's marker tooltip. Anchors to the cell under the pointer, read " +
      "from the mouse event, and guesses a 100px tooltip height because the " +
      "tooltip does not exist yet when the position is computed.",
  ],
  [
    "Table/FilterPanel.tsx:placeFilterPanel",
    "The column-filter menu, positioned from its trigger with a hardcoded " +
      "220px width estimate, then corrected by its measured width. It moved " +
      "here from Table's click handler in A2b so a resize places it again.",
  ],
]);

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) return walk(path);
    return /\.tsx?$/.test(entry) && !path.includes("__tests__") ? [path] : [];
  });

interface Positioner {
  id: string;
  hash: string;
}

/** Every function that measures a trigger and yields a top/left pair. */
function findPositioners(root = "src/components"): Positioner[] {
  const found: Positioner[] = [];
  for (const file of walk(root)) {
    const text = readFileSync(file, "utf8");
    if (!text.includes("getBoundingClientRect")) continue;
    const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);

    const visit = (node: ts.Node): void => {
      const isFn =
        ts.isFunctionDeclaration(node) ||
        ts.isArrowFunction(node) ||
        ts.isFunctionExpression(node);
      if (isFn && node.body) {
        const body = node.body.getText(sf);
        if (/getBoundingClientRect/.test(body)) {
          // Yields coordinates: an object literal carrying both `top` and a
          // horizontal offset. Read from the AST because the returns use
          // shorthand, which no key-colon pattern matches. The horizontal one
          // is `left` or its logical form: A2b made Table's filter yield
          // `inlineStart`, and a scanner that only knew `left` lost it and
          // called its DECLARED entry stale while the positioner was still there.
          let yieldsCoords = false;
          const scan = (n: ts.Node): void => {
            if (yieldsCoords) return;
            if (ts.isObjectLiteralExpression(n)) {
              const keys = n.properties.map((p) => p.name?.getText(sf));
              if (keys.includes("top") && keys.some((k) => k === "left" || k === "inlineStart" || k === "insetInlineStart")) {
                yieldsCoords = true;
                return;
              }
            }
            // A nested function's coordinates are its own.
            if (
              n !== node &&
              (ts.isFunctionDeclaration(n) || ts.isArrowFunction(n) || ts.isFunctionExpression(n))
            ) {
              return;
            }
            ts.forEachChild(n, scan);
          };
          scan(node.body);

          // A component returns markup; a positioner returns numbers.
          let rendersJsx = false;
          const jsxScan = (n: ts.Node): void => {
            if (rendersJsx) return;
            if (ts.isJsxElement(n) || ts.isJsxSelfClosingElement(n) || ts.isJsxFragment(n)) {
              rendersJsx = true;
              return;
            }
            ts.forEachChild(n, jsxScan);
          };
          jsxScan(node.body);

          if (yieldsCoords && !rendersJsx) {
            // Walk out to whatever the function is bound to. A `useCallback`
            // argument has no name of its own, and reporting three of them as
            // `<anonymous>` makes the declared list impossible to read.
            let name = node.name?.getText(sf);
            if (!name) {
              let parent: ts.Node | undefined = node.parent;
              while (parent && !ts.isVariableDeclaration(parent) && !ts.isFunctionDeclaration(parent)) {
                parent = parent.parent;
              }
              name = parent && parent.name ? parent.name.getText(sf) : "<anonymous>";
            }
            // Comments stripped before whitespace is collapsed: the other order
            // puts a `//` comment and the whole body on one line, and removing
            // it then deletes the function.
            const normalised = body
              .replace(/\/\*[\s\S]*?\*\//g, "")
              .replace(/\/\/[^\n]*/g, "")
              .replace(/\s+/g, " ")
              .trim();
            found.push({
              id: `${file.replace("src/components/", "")}:${name}`,
              hash: createHash("sha256").update(normalised).digest("hex").slice(0, 12),
            });
          }
        }
      }
      ts.forEachChild(node, visit);
    };
    visit(sf);
  }
  return found;
}

describe("anchored position contract", () => {
  const positioners = findPositioners();

  describe("self-check", () => {
    it("finds the positioners that are supposed to be there", () => {
      // If the scanner silently stops matching, every assertion below passes on
      // an empty list — which is how a duplicate-detection gate becomes a no-op.
      expect(positioners.length).toBeGreaterThan(0);
    });

    it("would report two identical implementations as duplicates", () => {
      const planted = [
        { id: "A/a.tsx:f", hash: "same" },
        { id: "B/b.tsx:g", hash: "same" },
        { id: "C/c.tsx:h", hash: "other" },
      ];
      const byHash = new Map<string, string[]>();
      for (const p of planted) byHash.set(p.hash, [...(byHash.get(p.hash) ?? []), p.id]);
      const dupes = [...byHash.values()].filter((ids) => ids.length > 1);
      expect(dupes).toEqual([["A/a.tsx:f", "B/b.tsx:g"]]);
    });
  });

  it("has no two positioners sharing an implementation", () => {
    const byHash = new Map<string, string[]>();
    for (const p of positioners) {
      byHash.set(p.hash, [...(byHash.get(p.hash) ?? []), p.id]);
    }
    const duplicates = [...byHash.entries()]
      .filter(([, ids]) => ids.length > 1)
      .map(([, ids]) => ids.join(" == "));
    expect(
      duplicates,
      "a positioning implementation was copied rather than shared; use useAnchoredPosition",
    ).toEqual([]);
  });

  it("declares every positioner that is not useAnchoredPosition", () => {
    const undeclared = positioners.map((p) => p.id).filter((id) => !DECLARED.has(id));
    expect(
      undeclared,
      "a new hand-written positioner appeared. Use `useAnchoredPosition`, or " +
        "add it to DECLARED with the reason it cannot",
    ).toEqual([]);
  });

  it("keeps the declared list honest", () => {
    // An entry that no longer matches anything is a licence nobody is using,
    // and it would quietly re-permit a copy that came back under the same name.
    const ids = new Set(positioners.map((p) => p.id));
    const stale = [...DECLARED.keys()].filter((id) => !ids.has(id));
    expect(stale, "remove these from DECLARED — they no longer exist").toEqual([]);
  });
});
