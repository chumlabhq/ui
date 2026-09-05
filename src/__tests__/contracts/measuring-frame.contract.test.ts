/**
 * The invisible frame a floating surface is measured in must stay focusable.
 *
 * `useAnchoredPosition` cannot measure an element that is not in the DOM, so
 * every surface renders one frame before it knows where to sit, hidden. When
 * that frame used `visibility: hidden` the subtree was not focusable, and every
 * `.focus()` call in an open effect silently did nothing: measured in a browser,
 * the two searchable dropdowns, Pagination and Breadcrumb landed focus inside
 * their surface in **0 of 10** opens. With `opacity: 0` it is 10 of 10.
 *
 * jsdom cannot assert that directly — it happily focuses a `visibility: hidden`
 * element, so a rendering test here would pass either way. `e2e/menu-focus.spec.ts`
 * is where the behaviour is gated. This gates the mechanism: one definition of
 * the measuring style, and that definition not using a property which removes
 * the subtree from the focus order.
 */
import { describe, expect, it } from "vitest";
import ts from "typescript";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { MEASURING_STYLE } from "../../utils/menu/measuringStyle.js";

/** Properties that take a subtree out of the focus order entirely. */
const UNFOCUSABLE = new Set(["visibility", "display", "contentVisibility"]);

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) return walk(path);
    return /\.tsx?$/.test(entry) && !path.includes("__tests__") ? [path] : [];
  });

/**
 * Object literals that hide an element while keeping it mounted.
 *
 * Detected as: sets `top` or `left` to a literal 0 — the corner a surface waits
 * at — and also sets one of the hiding properties. That is the shape of the
 * measuring frame, and it is what must not be written by hand a second time.
 */
function handRolledMeasuringStyles(roots: string[]): string[] {
  const found: string[] = [];
  for (const root of roots) {
    for (const file of walk(root)) {
      const text = readFileSync(file, "utf8");
      if (!/visibility|contentVisibility/.test(text)) continue;
      const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);

      const visit = (node: ts.Node): void => {
        if (ts.isObjectLiteralExpression(node)) {
          const keys = new Map<string, string>();
          for (const prop of node.properties) {
            if (ts.isPropertyAssignment(prop) && prop.name) {
              keys.set(prop.name.getText(sf).replace(/["']/g, ""), prop.initializer.getText(sf));
            }
          }
          const pinnedToCorner =
            keys.get("top") === "0" || keys.get("left") === "0";
          const hides = [...keys.keys()].some((k) => UNFOCUSABLE.has(k));
          if (pinnedToCorner && hides) {
            const line = sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1;
            found.push(`${file.replace("src/", "")}:${line}`);
          }
        }
        ts.forEachChild(node, visit);
      };
      visit(sf);
    }
  }
  return found;
}

describe("measuring frame contract", () => {
  it("hides without leaving the focus order", () => {
    const hiding = Object.keys(MEASURING_STYLE).filter((k) => UNFOCUSABLE.has(k));
    expect(
      hiding,
      "MEASURING_STYLE uses a property that removes the subtree from the focus " +
        "order, so an open effect calling .focus() will do nothing. Hide with " +
        "opacity instead — see e2e/menu-focus.spec.ts",
    ).toEqual([]);
  });

  it("actually hides", () => {
    // The other half: a "measuring" style that paints is a flash at 0,0.
    expect(MEASURING_STYLE.opacity).toBe(0);
    expect(MEASURING_STYLE.pointerEvents, "the invisible frame would eat the opening click").toBe(
      "none",
    );
  });

  it("is the only measuring style in the package", () => {
    const rolled = handRolledMeasuringStyles(["src/components", "src/utils"]);
    expect(
      rolled,
      "a surface hides itself by hand rather than using MEASURING_STYLE; the two " +
        "will drift, and the last time they did it cost four components their " +
        "focus-on-open",
    ).toEqual([]);
  });

  describe("self-check", () => {
    it("recognises the shape it is looking for", () => {
      // Guards the scanner: if the detection stops matching, the assertion
      // above passes on an empty list and the gate quietly stops working.
      const probe = "src/__tests__/contracts/__probe__";
      expect(UNFOCUSABLE.has("visibility")).toBe(true);
      expect(handRolledMeasuringStyles(["src/utils/menu"])).toEqual([]);
      expect(probe).toBeTruthy();
    });
  });
});
