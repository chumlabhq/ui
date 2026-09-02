/**
 * ADR 002 Task 3b — delete the keys whose replacement route is proven.
 *
 * Same reason as the rename codemod for using the checker: an object literal is
 * only a `classes` bag if its contextual type says so, and `error`/`content`
 * appear as ordinary property names all over the tree.
 *
 * Interface members and bag properties go here; the leftover reads are removed
 * by the second pass, driven by the compiler's own error positions.
 */
import ts from "typescript";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = "/Users/adityaagarwal/Developer/chumlab/chumlab-fe";
const PLAN = JSON.parse(readFileSync(process.argv[2], "utf8")); // { IfaceName: [key, ...] }
const DROP = Object.fromEntries(Object.entries(PLAN).map(([k, v]) => [k, new Set(v)]));

const cfg = ts.parseJsonConfigFileContent(
  ts.readConfigFile(resolve(ROOT, "tsconfig.app.json"), ts.sys.readFile).config, ts.sys, ROOT);
const testCfg = ts.parseJsonConfigFileContent(
  JSON.parse(readFileSync(resolve(ROOT, "tsconfig.test.json"), "utf8")), ts.sys, ROOT);
const program = ts.createProgram(
  [...new Set([...cfg.fileNames, ...testCfg.fileNames])], { ...cfg.options, noEmit: true });
const checker = program.getTypeChecker();

const classesNameOf = (type) => {
  if (!type) return null;
  for (const t of type.isUnion() ? type.types : [type]) {
    const n = (t.aliasSymbol ?? t.getSymbol())?.getName();
    if (n && DROP[n]) return n;
    for (const a of t.aliasTypeArguments ?? []) {
      const an = (a.aliasSymbol ?? a.getSymbol())?.getName();
      if (an && DROP[an]) return an;
    }
  }
  return null;
};

const endOfMember = (sf, node) => {
  const text = sf.getFullText();
  let i = node.getEnd();
  while (i < text.length && /\s/.test(text[i]) && text[i] !== "\n") i += 1;
  if (text[i] === "," || text[i] === ";") i += 1;
  return i;
};

const edits = new Map();
const push = (f, start, end) => {
  if (!edits.has(f)) edits.set(f, []);
  edits.get(f).push({ start, end });
};
let iface = 0, literal = 0;

for (const sf of program.getSourceFiles()) {
  if (sf.isDeclarationFile || !sf.fileName.startsWith(resolve(ROOT, "src"))) continue;
  const visit = (node) => {
    if (ts.isInterfaceDeclaration(node) && DROP[node.name.text]) {
      for (const m of node.members) {
        if (ts.isPropertySignature(m) && m.name && ts.isIdentifier(m.name) && DROP[node.name.text].has(m.name.text)) {
          push(sf.fileName, m.getFullStart(), endOfMember(sf, m)); iface += 1;
        }
      }
    }
    // `Pick<XClasses, "a" | "b">` names keys as string literal types.
    if (ts.isLiteralTypeNode(node) && ts.isStringLiteral(node.literal)) {
      let ref = node.parent;
      while (ref && !ts.isTypeReferenceNode(ref)) ref = ref.parent;
      const arg = ref?.typeArguments?.[0];
      const owner = arg && classesNameOf(checker.getTypeFromTypeNode(arg));
      if (owner && DROP[owner].has(node.literal.text)) {
        const t = sf.getFullText();
        let start = node.getStart(sf), end = node.getEnd();
        let i = start - 1;
        while (i >= 0 && /\s/.test(t[i])) i -= 1;
        if (t[i] === "|") start = i;            // take the leading union bar
        push(sf.fileName, start, end); literal += 1;
      }
    }
    if (ts.isObjectLiteralExpression(node)) {
      let owner = classesNameOf(checker.getContextualType(node));
      if (!owner) {
        for (let p = node.parent; p && !ts.isBlock(p); p = p.parent) {
          if (ts.isVariableDeclaration(p) && p.type) { owner = classesNameOf(checker.getTypeFromTypeNode(p.type)); break; }
        }
      }
      if (owner) {
        for (const prop of node.properties) {
          if (prop.name && (ts.isIdentifier(prop.name) || ts.isStringLiteral(prop.name)) && DROP[owner].has(prop.name.text)) {
            push(sf.fileName, prop.getFullStart(), endOfMember(sf, prop)); literal += 1;
          }
        }
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
}

for (const [file, list] of edits) {
  let text = readFileSync(file, "utf8");
  const sorted = list
    .filter((e, i) => !list.some((o, j) => j !== i && e.start >= o.start && e.end <= o.end && (o.end - o.start) > (e.end - e.start)))
    .sort((a, b) => b.start - a.start);
  for (const e of sorted) text = text.slice(0, e.start) + text.slice(e.end);
  writeFileSync(file, text);
}
console.log(JSON.stringify({ files: edits.size, iface, literal }));
