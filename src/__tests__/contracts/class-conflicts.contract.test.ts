/**
 * No default class string carries two utilities that fight over one property.
 *
 * Modal's positioner shipped `fixed inset-0 overflow-y-auto relative`: the
 * `container` slot's `relative z-10` default was merged onto an element that
 * already carried `fixed inset-0 overflow-y-auto`, and `relative` won. The
 * positioner stopped being bounded by the viewport, grew to its content, and a
 * dialog taller than the viewport could be neither scrolled nor reached. Two
 * commits documented the clash instead of removing it.
 *
 * The library's own `cn` is tailwind-merge with the `cl-` scale registered, so
 * it already knows which utilities conflict: any token it drops from a default
 * string is one the browser was never going to apply. Read on the AST so every
 * class string is found where it is written — a `DEFAULT_*_CLASSES` value, a
 * literal `className`, or a literal passed to `cn` or `mergeSlot`.
 */
import { describe, expect, it } from "vitest";
import ts from "typescript";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { cn } from "../../utils/cn";

/** The AST count when this was written; a walk that finds fewer has stopped reading something. */
const FLOOR = 827;

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) return entry === "__tests__" ? [] : walk(path);
    return /\.tsx?$/.test(entry) && !/\.(test|spec|stories)\.tsx?$/.test(entry) ? [path] : [];
  });

interface ClassString {
  at: string;
  value: string;
}

const literal = (node: ts.Node): string | null =>
  ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node) ? node.text : null;

function findClassStrings(root = "src/components"): ClassString[] {
  const found: ClassString[] = [];
  for (const file of walk(root)) {
    const sf = ts.createSourceFile(file, readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true, file.endsWith("x") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
    const add = (node: ts.Node, value: string) => {
      if (!value.trim()) return;
      const line = sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1;
      found.push({ at: `${relative("src", file)}:${line}`, value });
    };
    const visitDefaults = (node: ts.Node): void => {
      if (ts.isPropertyAssignment(node)) {
        const v = literal(node.initializer);
        if (v !== null) add(node.initializer, v);
      }
      ts.forEachChild(node, visitDefaults);
    };
    const visit = (node: ts.Node): void => {
      if (ts.isVariableDeclaration(node) && /^DEFAULT_\w*CLASSES$/.test(node.name.getText(sf)) && node.initializer) {
        visitDefaults(node.initializer);
        return;
      }
      if (ts.isJsxAttribute(node) && node.name.getText(sf) === "className" && node.initializer) {
        const init = node.initializer;
        const v = literal(init) ?? (ts.isJsxExpression(init) && init.expression ? literal(init.expression) : null);
        if (v !== null) add(init, v);
      }
      if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && /^(cn|mergeSlot)$/.test(node.expression.text)) {
        for (const arg of node.arguments) {
          const v = literal(arg);
          if (v !== null) add(arg, v);
        }
      }
      ts.forEachChild(node, visit);
    };
    visit(sf);
  }
  return found;
}

/** Each token `cn` drops from the string, with the later token that took its place. */
function conflictsIn(value: string): string[] {
  const tokens = value.trim().split(/\s+/);
  const kept = cn(value).split(/\s+/);
  const out: string[] = [];
  tokens.forEach((token, i) => {
    const later = tokens.slice(i + 1);
    if (later.includes(token)) {
      out.push(`"${token}" is repeated`);
      return;
    }
    if (kept.includes(token)) return;
    const winner = later.find((t) => !cn(`${token} ${t}`).split(/\s+/).includes(token));
    out.push(`"${token}" is overridden by "${winner ?? "?"}"`);
  });
  return out;
}

describe("default class strings carry no conflicting utilities", () => {
  const strings = findClassStrings();
  const conflicts = strings.flatMap((s) => conflictsIn(s.value).map((c) => `${s.at}: ${c}`));

  it("finds every class string it was written against", () => {
    console.log(`CLASS_CONFLICTS class strings checked ${strings.length} (floor ${FLOOR}), conflicts ${conflicts.length}, excused 0`);
    for (const c of conflicts) console.log(`  CLASS_CONFLICT ${c}`);
    expect(strings.length).toBeGreaterThanOrEqual(FLOOR);
  });

  it("no utility in a default string is dropped by cn", () => {
    expect(conflicts, "a class the browser never applies — remove one of the pair").toEqual([]);
  });


  it("names a planted conflict", () => {
    expect(conflictsIn("fixed inset-0 overflow-y-auto relative z-10")).toEqual([`"fixed" is overridden by "relative"`]);
  });
});
