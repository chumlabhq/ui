/**
 * ADR 002 Task 3a codemod.
 *
 * Uses the TypeScript checker rather than text matching: a `classes` bag inside
 * <Button> may belong to Tooltip, and only the contextual type knows which.
 */
import ts from "typescript";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = "/Users/adityaagarwal/Developer/chumlab/chumlab-fe";
const [, , planPath] = process.argv;
const PLAN = JSON.parse(readFileSync(planPath, "utf8")); // { "IfaceName": { old: new, ... } }

const configPath = resolve(ROOT, "tsconfig.app.json");
const parsed = ts.parseJsonConfigFileContent(
  ts.readConfigFile(configPath, ts.sys.readFile).config,
  ts.sys,
  ROOT,
);
// The app project excludes tests and fixtures; add them so their bags migrate too.
const extra = JSON.parse(readFileSync(resolve(ROOT, "tsconfig.test.json"), "utf8"));
const testParsed = ts.parseJsonConfigFileContent(extra, ts.sys, ROOT);
const fileNames = [...new Set([...parsed.fileNames, ...testParsed.fileNames])];

const program = ts.createProgram(fileNames, { ...parsed.options, noEmit: true });
const checker = program.getTypeChecker();

/** Which Classes interface a type resolves to, if any. */
const classesNameOf = (type) => {
  if (!type) return null;
  const types = type.isUnion() ? type.types : [type];
  for (const t of types) {
    const s = t.aliasSymbol ?? t.getSymbol();
    const n = s?.getName();
    if (n && PLAN[n]) return n;
    // Required<XClasses> / Partial<XClasses> keep the target in aliasTypeArguments
    for (const a of t.aliasTypeArguments ?? []) {
      const an = (a.aliasSymbol ?? a.getSymbol())?.getName();
      if (an && PLAN[an]) return an;
    }
    if (t.target) {
      for (const a of checker.getTypeArguments(t) ?? []) {
        const an = (a.aliasSymbol ?? a.getSymbol())?.getName();
        if (an && PLAN[an]) return an;
      }
    }
  }
  return null;
};

/** Deleting a member must take its separator, or the next one becomes a hole. */
const endOfMember = (sf, node) => {
  const text = sf.getFullText();
  let i = node.getEnd();
  while (i < text.length && /\s/.test(text[i]) && text[i] !== "\n") i += 1;
  if (text[i] === "," || text[i] === ";") i += 1;
  return i;
};

const edits = new Map(); // file -> [{start, end, text}]
const push = (file, start, end, text) => {
  if (!edits.has(file)) edits.set(file, []);
  edits.get(file).push({ start, end, text });
};

let counts = { iface: 0, access: 0, literal: 0, dropped: 0 };

for (const sf of program.getSourceFiles()) {
  if (sf.isDeclarationFile || !sf.fileName.startsWith(resolve(ROOT, "src"))) continue;

  const visit = (node) => {
    if (ts.isInterfaceDeclaration(node) && PLAN[node.name.text]) {
      const map = PLAN[node.name.text];
      const taken = new Set();
      for (const m of node.members) {
        if (!ts.isPropertySignature(m) || !m.name || !ts.isIdentifier(m.name)) continue;
        const from = m.name.text;
        const to = map[from] ?? from;
        if (taken.has(to)) {
          // An absorb or a declared merge: the part keeps one property.
          push(sf.fileName, m.getFullStart(), endOfMember(sf, m), "");
          counts.dropped += 1;
          continue;
        }
        taken.add(to);
        if (to !== from) {
          push(sf.fileName, m.name.getStart(sf), m.name.getEnd(), to);
          counts.iface += 1;
        }
      }
    }
    // 2. member access on a value whose type is a Classes bag
    if (ts.isPropertyAccessExpression(node) && ts.isIdentifier(node.name)) {
      const owner = classesNameOf(checker.getTypeAtLocation(node.expression));
      const to = owner && PLAN[owner][node.name.text];
      if (to && to !== node.name.text) {
        push(sf.fileName, node.name.getStart(sf), node.name.getEnd(), to);
        counts.access += 1;
      }
    }
    // 3. string literals naming a key inside Pick<XClasses, ...> / Omit<...>
    if (ts.isLiteralTypeNode(node) && ts.isStringLiteral(node.literal)) {
      let ref = node.parent;
      while (ref && !ts.isTypeReferenceNode(ref)) ref = ref.parent;
      const arg = ref?.typeArguments?.[0];
      if (arg) {
        const owner = classesNameOf(checker.getTypeFromTypeNode(arg));
        const to = owner && PLAN[owner][node.literal.text];
        if (to && to !== node.literal.text) {
          push(sf.fileName, node.literal.getStart(sf), node.literal.getEnd(), `"${to}"`);
          counts.literal += 1;
        }
      }
    }
    // 4. object-literal keys whose contextual type is a Classes bag
    if (ts.isObjectLiteralExpression(node)) {
      // `const merged: Required<XClasses> = useMemo(() => ({...}))` gives the
      // literal its own inferred shape as the contextual type, because useMemo's
      // generic is inferred from the callback. Fall back to the annotation.
      let owner = classesNameOf(checker.getContextualType(node));
      if (!owner) {
        for (let p = node.parent; p && !ts.isBlock(p); p = p.parent) {
          if (ts.isVariableDeclaration(p) && p.type) {
            owner = classesNameOf(checker.getTypeFromTypeNode(p.type));
            break;
          }
          if (ts.isPropertyAssignment(p) || ts.isReturnStatement(p)) continue;
        }
      }
      if (owner) {
        const map = PLAN[owner];
        // Group first, then emit once per surviving name. Emitting as we walk
        // pushed two edits at the same range for a three-way merge
        // (Slider mark/markDot/markLabel -> marker) and spliced the file.
        const groups = new Map();
        for (const prop of node.properties) {
          if (!prop.name || !(ts.isIdentifier(prop.name) || ts.isStringLiteral(prop.name))) continue;
          const to = map[prop.name.text] ?? prop.name.text;
          if (!groups.has(to)) groups.set(to, []);
          groups.get(to).push(prop);
        }
        for (const [to, props] of groups) {
          const [first, ...rest] = props;
          if (first.name.text !== to) {
            const quoted = ts.isStringLiteral(first.name);
            push(sf.fileName, first.name.getStart(sf), first.name.getEnd(), quoted ? `"${to}"` : to);
            counts.literal += 1;
          }
          if (!rest.length) continue;
          const strings = props.filter(
            (p) => ts.isPropertyAssignment(p) && ts.isStringLiteralLike(p.initializer),
          );
          if (strings.length === props.length) {
            // Two or more class strings folding into one part: keep every
            // utility, in order, without repeating a token.
            const merged = [...new Set(
              strings.map((p) => p.initializer.text).join(" ").split(/\s+/).filter(Boolean),
            )].join(" ");
            push(sf.fileName, first.initializer.getStart(sf), first.initializer.getEnd(), `"${merged}"`);
          }
          for (const p of rest) {
            push(sf.fileName, p.getFullStart(), endOfMember(sf, p), "");
            counts.dropped += 1;
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
  // A dropped property may contain renames in its own initializer
  // (`ring: classesProp?.range ?? baseClasses.range` absorbed into `range`).
  // The deletion subsumes them; anything else overlapping is a bug.
  const deletions = list.filter((e) => e.text === "");
  const sorted = list
    .filter((e) => e.text === "" || !deletions.some((d) => d !== e && e.start >= d.start && e.end <= d.end))
    .sort((a, b) => b.start - a.start);
  for (let i = 1; i < sorted.length; i += 1) {
    if (sorted[i].end > sorted[i - 1].start) {
      throw new Error(`overlapping edits in ${file} at ${sorted[i].start}..${sorted[i].end}`);
    }
  }
  for (const e of sorted) {
    text = text.slice(0, e.start) + e.text + text.slice(e.end);
  }
  writeFileSync(file, text);
}
console.log(JSON.stringify({ files: edits.size, ...counts }));
