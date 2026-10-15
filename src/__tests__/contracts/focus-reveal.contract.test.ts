/**
 * A focus moved with `preventScroll: true` has to bring its target into view
 * some other way, or say why it cannot be out of view.
 *
 * `preventScroll` is how a component moves focus without the page jumping, and
 * on its own it also means the target is never scrolled to. Table's grid did
 * that on every arrow key, and the focus trap behind Modal, Drawer and the
 * DatePicker calendar did it on every Tab: in all three engines the focused
 * cell or control could sit outside the region that scrolls it, which is
 * WCAG 2.4.11. Both now go through `focusAndReveal`, which keeps the
 * `preventScroll` and follows it with a `scrollIntoView` at "nearest".
 *
 * Read on the TypeScript AST so a reformatted call is still a call. Each
 * exception is keyed by file and receiver with the exact number of calls it
 * covers: a call that disappears makes its entry stale, and a new call on the
 * same receiver is not covered by an old reason.
 */
import { describe, expect, it } from "vitest";
import ts from "typescript";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOTS = ["src/components", "src/utils"];
const HELPER = "focusAndReveal";

/** The audit counted 53 `.focus()` calls; every one is still a focus move here, as a call or through the helper. */
const FLOOR = 53;

type Exception = { calls: number; reason: string };

/**
 * Targets that cannot be inside a scroll container.
 */
const OUT_OF_ANY_SCROLLER: Record<string, Exception> = {
  "components/CascadingDropdown/CascadingDropdown.tsx|menuSearchRef.current": {
    calls: 1,
    reason: "The top-level menu has no overflow by design (constants.ts, `content`) and is position: fixed; nothing scrolls around its search field.",
  },
  "components/CascadingDropdown/CascadingDropdown.tsx|item": {
    calls: 1,
    reason: "A top-level menu item, in the same uncapped fixed menu. Measured: no scrolling ancestor in any engine.",
  },
  "components/SearchableDropdown/SearchableDropdown.tsx|searchInputRef.current": {
    calls: 1,
    reason: "The search field sits above the `max-h-60 overflow-y-auto` list, in a panel whose height is not capped.",
  },
  "components/MultiSelectSearchableDropdown/MultiSelectSearchableDropdown.tsx|searchInputRef.current": {
    calls: 1,
    reason: "The search field sits above the `max-h-60 overflow-y-auto` list, in a panel whose height is not capped.",
  },
  "components/Drawer/Drawer.tsx|panel": {
    calls: 1,
    reason: "The target is the fixed panel itself.",
  },
  "components/Table/FilterPanel.tsx|el": {
    calls: 1,
    reason: "The target is the fixed filter dialog itself.",
  },
};

/**
 * Targets that can be inside a scroll container, each for a reason about the
 * moment of the call. These do not meet the rule's bar and are listed so that
 * the decision is visible rather than implicit.
 */
const RETURNS_TO_ACTIVATED: Record<string, Exception> = {
  "components/CascadingDropdown/CascadingDropdown.tsx|triggerRef.current": { calls: 1, reason: "Returns focus to the trigger that opened the menu." },
  "components/Dropdown/Dropdown.tsx|triggerNode": { calls: 2, reason: "Returns focus to the trigger that opened the menu." },
  "components/MultiSelectDropdown/MultiSelectDropdown.tsx|triggerRef.current": { calls: 2, reason: "Returns focus to the trigger after close or a chip removal." },
  "components/MultiSelectDropdown/MultiSelectDropdown.tsx|triggerNode": { calls: 1, reason: "Returns focus to the trigger that opened the menu." },
  "components/MultiSelectSearchableDropdown/MultiSelectSearchableDropdown.tsx|triggerRef.current": { calls: 2, reason: "Returns focus to the trigger after close or a chip removal." },
  "components/MultiSelectSearchableDropdown/MultiSelectSearchableDropdown.tsx|triggerNode": { calls: 1, reason: "Returns focus to the trigger that opened the menu." },
  "components/SearchableDropdown/SearchableDropdown.tsx|triggerNode": { calls: 2, reason: "Returns focus to the trigger that opened the menu." },
  "components/Drawer/Drawer.tsx|el": { calls: 1, reason: "Returns focus to the element that opened the drawer; the scroll lock held the page where it was." },
  "components/Drawer/Drawer.tsx|initialFocus.current": { calls: 1, reason: "Initial focus as the panel slides in. Not measured: a reveal during the transition is unproven." },
  "components/Drawer/Drawer.tsx|autoFocusEl": { calls: 1, reason: "Initial focus as the panel slides in. Not measured: a reveal during the transition is unproven." },
  "components/Drawer/Drawer.tsx|focusable[0]": { calls: 1, reason: "Initial focus as the panel slides in. Not measured: a reveal during the transition is unproven." },
  "components/Table/Table.tsx|editReturnRef.current": { calls: 1, reason: "Returns focus to the cell whose editor just closed, which is where the user already is." },
  "components/TimePicker/TimePicker.tsx|inputRef.current": { calls: 2, reason: "Focuses the input beside the clear button just clicked, or the input the user just opened." },
  "utils/menu/focusTriggerOnMouseDown.ts|trigger": { calls: 1, reason: "The trigger under the pointer, focused on mousedown." },
};

const EXCEPTIONS: Record<string, Exception> = { ...OUT_OF_ANY_SCROLLER, ...RETURNS_TO_ACTIVATED };

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) return entry === "__tests__" ? [] : walk(path);
    return /\.tsx?$/.test(entry) && !/\.(test|spec|stories)\.tsx?$/.test(entry) ? [path] : [];
  });

const hasPreventScroll = (call: ts.CallExpression): boolean =>
  call.arguments.some(
    (arg) =>
      ts.isObjectLiteralExpression(arg) &&
      arg.properties.some(
        (p) =>
          ts.isPropertyAssignment(p) &&
          p.name.getText() === "preventScroll" &&
          p.initializer.kind === ts.SyntaxKind.TrueKeyword,
      ),
  );

/** A later statement in the same block that calls `scrollIntoView` on the same receiver. */
const revealedAfter = (call: ts.CallExpression, receiver: string): boolean => {
  let stmt: ts.Node = call;
  while (stmt.parent && !ts.isBlock(stmt.parent) && !ts.isSourceFile(stmt.parent)) stmt = stmt.parent;
  const block = stmt.parent as ts.Block | ts.SourceFile | undefined;
  if (!block) return false;
  const later = block.statements.slice(block.statements.indexOf(stmt as ts.Statement) + 1);
  return later.some((s) => new RegExp(`${receiver.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\??\\.scrollIntoView\\(`).test(s.getText()));
};

interface FocusScan {
  focusMoves: number;
  helperCalls: number;
  unrevealed: Map<string, string[]>;
}

function scanFocusReveal(roots = ROOTS, base = "src"): FocusScan {
  let focusMoves = 0;
  let helperCalls = 0;
  const unrevealed = new Map<string, string[]>();
  for (const file of roots.flatMap(walk)) {
    const rel = relative(base, file);
    if (rel === `utils/${HELPER}.ts`) continue;
    const sf = ts.createSourceFile(file, readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true, file.endsWith("x") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
    const visit = (node: ts.Node): void => {
      if (ts.isCallExpression(node)) {
        const e = node.expression;
        if (ts.isIdentifier(e) && e.text === HELPER) {
          focusMoves += 1;
          helperCalls += 1;
        } else if (ts.isPropertyAccessExpression(e) && e.name.text === "focus") {
          focusMoves += 1;
          const receiver = e.expression.getText(sf).replace(/\?$/, "");
          if (hasPreventScroll(node) && !revealedAfter(node, receiver)) {
            const key = `${rel}|${receiver}`;
            const line = sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1;
            unrevealed.set(key, [...(unrevealed.get(key) ?? []), `${rel}:${line}`]);
          }
        }
      }
      ts.forEachChild(node, visit);
    };
    visit(sf);
  }
  return { focusMoves, helperCalls, unrevealed };
}

describe("a focus moved with preventScroll is brought into view", () => {
  const scan = scanFocusReveal();

  it("checks every focus move the audit found", () => {
    const unrevealed = [...scan.unrevealed.values()].flat().length;
    console.log(
      `FOCUS_REVEAL focus-moves=${scan.focusMoves} (floor ${FLOOR}) through-helper=${scan.helperCalls} ` +
        `preventScroll-unrevealed=${unrevealed} excepted=${Object.keys(EXCEPTIONS).length} keys ` +
        `(${Object.keys(OUT_OF_ANY_SCROLLER).length} out of any scroller, ${Object.keys(RETURNS_TO_ACTIVATED).length} return to what was activated)`,
    );
    expect(scan.focusMoves).toBeGreaterThanOrEqual(FLOOR);
    expect(scan.helperCalls, "the helper has callers").toBeGreaterThan(0);
  });

  it("every preventScroll focus reveals its target or names why it cannot be hidden", () => {
    const undeclared = [...scan.unrevealed].filter(([key]) => !EXCEPTIONS[key]).flatMap(([, at]) => at);
    expect(undeclared, `route these through ${HELPER}, or follow them with scrollIntoView`).toEqual([]);
  });

  it("every exception still matches exactly the calls it was written for", () => {
    const wrong = Object.entries(EXCEPTIONS)
      .map(([key, { calls }]) => ({ key, calls, found: scan.unrevealed.get(key)?.length ?? 0 }))
      .filter((e) => e.found !== e.calls)
      .map((e) => `${e.key}: declared ${e.calls}, found ${e.found}`);
    expect(wrong, "a stale or outgrown exception").toEqual([]);
  });
});
