/**
 * ADR 002 R6, IPI: fold the flat `countrySelect*` keys of a consumer's classes
 * bag into the nested `countrySelect` object the prop now takes.
 *
 * AST rather than line matching: the values are multi-line template literals and
 * two line-based attempts spliced the file.
 */
import ts from "typescript";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = "/Users/adityaagarwal/Developer/chumlab/chumlab-fe";
const NEST = {
  countrySelectTrigger: "trigger", countrySelectDropdown: "content",
  countrySelectSearchInput: "searchControl", countrySelectSearchInputElement: "searchInput",
  countrySelectOption: "item", countrySelectOptionList: "list", countrySelectChevron: "icon",
  countrySelectCheckIcon: "itemIndicator", countrySelectSearchIcon: "searchIcon",
  countrySelectNoResults: "empty",
};
const OWN = { countryOptionRow: "itemRow", countryOptionFlag: "itemIcon", countryOptionLabel: "itemText" };
const DROPPED = new Set(["countrySelectOptionSelected"]);

const file = resolve(ROOT, process.argv[2]);
const text = readFileSync(file, "utf8");
const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);

const edits = [];
const visit = (node) => {
  if (ts.isObjectLiteralExpression(node)) {
    const nested = [], own = [], drop = [];
    for (const p of node.properties) {
      if (!ts.isPropertyAssignment(p) || !ts.isIdentifier(p.name)) continue;
      const n = p.name.text;
      if (NEST[n]) nested.push([p, NEST[n]]);
      else if (OWN[n]) own.push([p, OWN[n]]);
      else if (DROPPED.has(n)) drop.push(p);
    }
    if (nested.length || own.length || drop.length) {
      const indent = " ".repeat(node.getStart(sf) - text.lastIndexOf("\n", node.getStart(sf)) - 1);
      for (const [p, to] of own) edits.push({ start: p.name.getStart(sf), end: p.name.getEnd(), text: to });
      for (const p of drop) {
        let e = p.getEnd();
        while (e < text.length && /[\s,]/.test(text[e]) && text[e] !== "\n") e += 1;
        edits.push({ start: p.getFullStart(), end: e, text: "" });
      }
      if (nested.length) {
        const body = nested
          .map(([p, to]) => `${indent}    ${to}: ${text.slice(p.initializer.getStart(sf), p.initializer.getEnd())},`)
          .join("\n");
        const first = nested[0][0];
        edits.push({ start: first.getFullStart(), end: first.getEnd(), text: `\n${indent}  countrySelect: {\n${body}\n${indent}  }` });
        for (const [p] of nested.slice(1)) {
          let e = p.getEnd();
          while (e < text.length && /[\s,]/.test(text[e]) && text[e] !== "\n") e += 1;
          edits.push({ start: p.getFullStart(), end: e, text: "" });
        }
      }
    }
  }
  ts.forEachChild(node, visit);
};
visit(sf);

let out = text;
for (const e of edits.sort((a, b) => b.start - a.start)) out = out.slice(0, e.start) + e.text + out.slice(e.end);
writeFileSync(file, out);
console.log(JSON.stringify({ edits: edits.length }));
