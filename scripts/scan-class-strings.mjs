#!/usr/bin/env node
/**
 * Every class-bearing string literal in a source tree, via the TypeScript AST.
 *
 * A regex scanner for `"..." | '...' | \`...\`` desynchronises on an apostrophe
 * inside a comment: `// Tooltip's default` opens a single-quoted match that
 * runs to the next apostrophe and swallows whatever literals lie between. That
 * is not hypothetical — it hid a `border-cl-border dark:border-cl-border`
 * no-op in Breadcrumb from both the codemod that was meant to delete it and the
 * contract that was meant to catch it.
 *
 * The compiler already knows what a string is. Ask it.
 */
import ts from "typescript";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

export function sourceFiles(root) {
  const out = [];
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    if (entry.name === "__tests__") continue;
    const path = join(root, entry.name);
    if (entry.isDirectory()) out.push(...sourceFiles(path));
    else if (/\.tsx?$/.test(entry.name)) out.push(path);
  }
  return out.sort();
}

/** Every string/template literal in a file, with its 1-based line. */
export function classStrings(file) {
  const text = readFileSync(file, "utf8");
  const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const out = [];
  const visit = (node) => {
    if (
      ts.isStringLiteral(node) ||
      ts.isNoSubstitutionTemplateLiteral(node) ||
      ts.isTemplateHead(node) ||
      ts.isTemplateMiddle(node) ||
      ts.isTemplateTail(node)
    ) {
      const value = node.text;
      if (value.trim()) {
        out.push({
          file,
          line: sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1,
          value,
        });
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return out;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const root = process.argv[2] ?? "src/components";
  let n = 0;
  for (const file of sourceFiles(root)) n += classStrings(file).length;
  console.log(`${n} string literals across ${sourceFiles(root).length} files`);
}
