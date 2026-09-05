/**
 * One portal implementation for anchored surfaces.
 *
 * `createPortal` is not the problem; portalling a surface *and* positioning it
 * against a trigger, by hand, is. That pairing existed in nine components, and
 * the positioners it sat beside had drifted into eight different behaviours
 * without anyone noticing — CascadingDropdown pinned its menu at the left edge
 * regardless of the trigger, and only measuring found it.
 *
 * So this counts the pairing rather than the call. A component that portals
 * something anchored has to do it through `MenuSurface`, or be declared here
 * with the reason it cannot.
 */
import { describe, expect, it } from "vitest";
import ts from "typescript";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

/**
 * Portals that are allowed to stay hand-written, each because what it portals
 * is not anchored to a trigger.
 */
const DECLARED = new Map([
  [
    "Modal/Modal.tsx",
    "A centred overlay. It has no trigger to anchor to and always portals to " +
      "document.body.",
  ],
  [
    "Drawer/Drawer.tsx",
    "Edge-anchored to the viewport, not to a trigger — `side` means the screen " +
      "edge it slides from.",
  ],
  [
    "Toast/components/ToastProvider.tsx",
    "A viewport-corner region holding a stack. Its position comes from " +
      "`position`, not from any element.",
  ],
  [
    "Tooltip/Tooltip.tsx",
    "Anchored, but not a menu: no surface state, no roving list, and it owns a " +
      "hover/focus lifecycle MenuSurface has no notion of. A candidate for a " +
      "later slice, not a free win.",
  ],
  [
    "Table/Table.tsx",
    "The column-filter menu, positioned from a click handler with a hardcoded " +
      "220px width estimate rather than a measured element. Already declared in " +
      "`anchored-position.contract` for the same reason.",
  ],
  [
    "DatePicker/DatePicker.tsx",
    "The marker tooltip, which anchors to the cell under the pointer read from " +
      "a mouse event and guesses its own height. Also declared in " +
      "`anchored-position.contract`. The calendar panel beside it is on " +
      "MenuSurface.",
  ],
]);

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) return walk(path);
    return /\.tsx?$/.test(entry) && !path.includes("__tests__") ? [path] : [];
  });

/** Files that call `createPortal` themselves. */
function handRolledPortals(root = "src/components"): string[] {
  const found: string[] = [];
  for (const file of walk(root)) {
    const text = readFileSync(file, "utf8");
    if (!text.includes("createPortal")) continue;
    const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);

    let calls = false;
    const visit = (node: ts.Node): void => {
      if (
        ts.isCallExpression(node) &&
        node.expression.getText(sf).replace(/^.*\./, "") === "createPortal"
      ) {
        calls = true;
      }
      ts.forEachChild(node, visit);
    };
    visit(sf);
    if (calls) found.push(file.replace("src/components/", ""));
  }
  return found.sort();
}

describe("anchored portal contract", () => {
  const portals = handRolledPortals();

  describe("self-check", () => {
    it("finds the portals that are supposed to be there", () => {
      // An empty list would make every assertion below pass on nothing, which
      // is how a structural gate stops being one.
      expect(portals.length).toBeGreaterThan(0);
    });

    it("distinguishes a call from an import", () => {
      // The scan is AST-based: a file that imports `createPortal` without
      // calling it must not be reported, or the allowlist fills with entries
      // nobody can act on.
      expect(portals).not.toContain("Pagination/Pagination.tsx");
      expect(portals).not.toContain("Breadcrumb/Breadcrumb.tsx");
    });
  });

  it("declares every hand-written portal", () => {
    const undeclared = portals.filter((file) => !DECLARED.has(file));
    expect(
      undeclared,
      "a component portals a surface itself. If it is anchored to a trigger, " +
        "render it through `MenuSurface`; if it is not, add it to DECLARED with " +
        "the reason",
    ).toEqual([]);
  });

  it("keeps the declared list honest", () => {
    const stale = [...DECLARED.keys()].filter((file) => !portals.includes(file));
    expect(
      stale,
      "these no longer call createPortal — remove them from DECLARED rather " +
        "than leaving a licence nobody is using",
    ).toEqual([]);
  });

  it("gives a reason for every entry", () => {
    const thin = [...DECLARED.entries()]
      .filter(([, reason]) => reason.trim().length < 40)
      .map(([file]) => file);
    expect(thin, "an allowlist entry without a reason is just a list").toEqual([]);
  });
});
