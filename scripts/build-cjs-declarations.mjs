#!/usr/bin/env node
/**
 * Writes a `.d.cts` beside every emitted `.d.ts`.
 *
 * `"type": "module"` makes every `.d.ts` in `dist/` an ES module, but the
 * `require` condition resolves to `.cjs`. `attw` calls that FalseESM and
 * reported it for all 32 entrypoints: a CommonJS consumer got types that only
 * describe the dynamic-import shape of the package.
 *
 * A copy is not enough. A `.d.cts` importing `./Button.js` resolves back to
 * `Button.d.ts` — ESM again — so the relative specifiers are rewritten to
 * `.cjs`, which resolves to the `.d.cts` beside it. Nothing else changes:
 * these files declare types, and the declarations are identical either way.
 *
 * AST, not a regex, for the same reason as the source codemod.
 */
import ts from "typescript";
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist");

function declarations(dir, found = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) declarations(path, found);
    else if (entry.name.endsWith(".d.ts")) found.push(path);
  }
  return found;
}

function specifiers(source) {
  const found = [];
  const visit = (node) => {
    if (
      (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
      node.moduleSpecifier &&
      ts.isStringLiteral(node.moduleSpecifier)
    ) {
      found.push(node.moduleSpecifier);
    } else if (
      ts.isImportTypeNode(node) &&
      ts.isLiteralTypeNode(node.argument) &&
      ts.isStringLiteral(node.argument.literal)
    ) {
      found.push(node.argument.literal);
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
  return found;
}

const files = declarations(DIST);
let rewritten = 0;

for (const file of files) {
  const text = readFileSync(file, "utf8");
  const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);

  const edits = [];
  for (const literal of specifiers(source)) {
    if (!literal.text.startsWith("./") && !literal.text.startsWith("../")) continue;
    if (!literal.text.endsWith(".js")) continue;
    edits.push({
      start: literal.getStart(source),
      end: literal.getEnd(),
      text: JSON.stringify(`${literal.text.slice(0, -3)}.cjs`),
    });
  }

  let output = text;
  for (const edit of edits.sort((a, b) => b.start - a.start)) {
    output = output.slice(0, edit.start) + edit.text + output.slice(edit.end);
  }
  rewritten += edits.length;
  writeFileSync(file.replace(/\.d\.ts$/, ".d.cts"), output, "utf8");
}

process.stdout.write(`✓ d.cts: ${files.length} declaration(s), ${rewritten} specifier(s) repointed\n`);
