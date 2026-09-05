#!/usr/bin/env node
/**
 * Puts an explicit `.js` on every relative import in `src/`.
 *
 * `attw` found 240 InternalResolutionErrors in the published declarations: the
 * emitted `.d.ts` files import `./components/Accordion/Accordion`, which
 * `moduleResolution: node16` will not resolve. This repo could not see it —
 * every one of its tsconfigs uses `bundler`, which is happy either way.
 *
 * The fix is at source, not in the emitted output. An extension is correct
 * under node16, bundler and legacy node alike, tsc copies the specifier into
 * the declaration verbatim, and there is no rewritten artefact for a later
 * slice to find unvalidated.
 *
 * AST, not a regex. A regex over import statements has already desynchronised
 * on a comment apostrophe on this branch, and the specifiers here appear in
 * five different node types.
 *
 *   node scripts/add-import-extensions.mjs           rewrite src/
 *   node scripts/add-import-extensions.mjs --check   report, change nothing
 */
import ts from "typescript";
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "src");
const check = process.argv.includes("--check");
const only = process.argv.includes("--dir") ? process.argv[process.argv.indexOf("--dir") + 1] : null;

/** Already-explicit specifiers, including every asset kind the app imports. */
const EXTENSIONS = /\.(js|jsx|mjs|cjs|ts|tsx|json|css|svg|png|jpg|jpeg|webp|woff2?|txt|md)$/;

function sources(dir, found = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) sources(path, found);
    else if (/\.tsx?$/.test(entry.name) && !entry.name.endsWith(".d.ts")) found.push(path);
  }
  return found;
}

/**
 * What the specifier should become, or null if it is already fine.
 *
 * The candidate order is TypeScript's own: a file beats a directory, so
 * `./utils` next to both `utils.ts` and `utils/index.ts` resolves to the file
 * — getting that backwards would silently repoint an import.
 */
function resolveSpecifier(fromFile, specifier) {
  if (!specifier.startsWith("./") && !specifier.startsWith("../")) return null;
  if (EXTENSIONS.test(specifier)) return null;

  const base = join(dirname(fromFile), specifier);
  for (const extension of [".ts", ".tsx", ".d.ts"]) {
    if (existsSync(base + extension)) return `${specifier}.js`;
  }
  for (const extension of [".ts", ".tsx", ".d.ts"]) {
    if (existsSync(join(base, `index${extension}`))) return `${specifier}/index.js`;
  }
  return { unresolved: true };
}

/** Every node type that can hold a module specifier, collected in one walk. */
function specifiers(source) {
  const found = [];
  const visit = (node) => {
    if (
      (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
      node.moduleSpecifier &&
      ts.isStringLiteral(node.moduleSpecifier)
    ) {
      found.push(node.moduleSpecifier);
    } else if (ts.isImportTypeNode(node) && ts.isLiteralTypeNode(node.argument) && ts.isStringLiteral(node.argument.literal)) {
      found.push(node.argument.literal);
    } else if (
      ts.isCallExpression(node) &&
      (node.expression.kind === ts.SyntaxKind.ImportKeyword ||
        (ts.isIdentifier(node.expression) && node.expression.text === "require")) &&
      node.arguments.length > 0 &&
      ts.isStringLiteral(node.arguments[0])
    ) {
      found.push(node.arguments[0]);
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
  return found;
}

const files = sources(only ? join(SRC, only) : SRC);
let rewritten = 0;
let touched = 0;
const unresolved = [];

for (const file of files) {
  const text = readFileSync(file, "utf8");
  const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);

  const edits = [];
  for (const literal of specifiers(source)) {
    const next = resolveSpecifier(file, literal.text);
    if (!next) continue;
    if (next.unresolved) {
      unresolved.push(`${file.slice(ROOT.length + 1)}: "${literal.text}"`);
      continue;
    }
    // The quotes are part of the literal's span, so the replacement carries
    // them; taking `getStart() + 1` would break on a specifier that needs
    // escaping.
    edits.push({ start: literal.getStart(source), end: literal.getEnd(), text: JSON.stringify(next) });
  }
  if (edits.length === 0) continue;

  touched += 1;
  rewritten += edits.length;
  if (check) continue;

  let output = text;
  for (const edit of edits.sort((a, b) => b.start - a.start)) {
    output = output.slice(0, edit.start) + edit.text + output.slice(edit.end);
  }
  writeFileSync(file, output, "utf8");
}

for (const line of unresolved) process.stdout.write(`  unresolved: ${line}\n`);
process.stdout.write(
  `${check ? "would rewrite" : "rewrote"} ${rewritten} specifier(s) in ${touched} of ${files.length} file(s)` +
    `${unresolved.length ? `, ${unresolved.length} unresolved` : ""}\n`,
);
process.exit(check && rewritten > 0 ? 1 : 0);
