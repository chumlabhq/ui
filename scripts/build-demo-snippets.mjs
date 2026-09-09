// Copy-paste code for every demo on a component page, extracted from the page.
//
// The pages render eight to forty examples each and only Basic Usage carried a
// copy block, which reads as "the rest are not available". These snippets come
// out of the demo page's own JSX at build time, so the code shown is the code
// rendering above it and drift is impossible by construction. Basic Usage keeps
// its .ai.md source in `build-component-docs.mjs` — that one is also the
// codegen input and is compiled by the consumer matrix.
//
// A demo section is only worth a copy button if what it renders can be pasted
// and run. The extractor therefore resolves every free identifier in the
// section against the page, and emits nothing when it cannot:
//
//   library / react import  → an import in the snippet
//   pure const declaration  → inlined ahead of the component, transitively
//   `useState` pair         → hoisted into the snippet's body
//   `c.*` page styling      → the resolved class string, light theme
//   anything else           → no snippet, with the reason recorded
//
// The last line is the point. A snippet that references a handler defined
// three sections up compiles here and fails in the consumer's editor, which is
// worse than no copy button.
//
//   node scripts/build-demo-snippets.mjs           write
//   node scripts/build-demo-snippets.mjs --check   fail if the output drifted
import { readFileSync, writeFileSync, existsSync, mkdirSync, rmSync, readdirSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { resolve, dirname, join } from "node:path";
import { rmOwnedDir, writeOwnedManifest } from "./rm-owned-dir.mjs";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const CHECK = process.argv.includes("--check");
const SELF_CHECK = process.argv.includes("--self-check");
const DEMOS = join(root, "src/pages/demo");
const OUT_SITE = join(root, "src/pages/demo/generated/demoSnippets.ts");
const OUT_SNIPPETS = join(root, "scripts/consumers/_app/snippets/demo");

const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
const kebab = (name) => name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

/**
 * The `classes` keys each component actually has, from its schema.
 *
 * The demo pages' styling objects carry keys the components ignore — dead
 * styling that has never applied. It is invisible on the page because
 * `classes={c.accordion}` is a variable, and TypeScript only excess-property
 * checks an object literal; inlining the object into a snippet is what makes
 * it visible. Fourteen distinct keys across the pages, `wrapper` on eight
 * components alone.
 *
 * They are dropped from the snippet rather than copied into it. A snippet is
 * teaching material, and `doc-truth.contract` already forbids a `classes`
 * example naming a key the component does not have — emitting one here would
 * be the same defect in a new place, and it would not compile for whoever
 * pasted it. `demoSnippets.skipped.json` records every one that was dropped.
 */
const CLASSES_KEYS = new Map();
for (const dir of readdirSync(join(root, "src/components"))) {
  const schemaPath = join(root, "src/components", dir, `${dir}.schema.json`);
  if (!existsSync(schemaPath)) continue;
  const schema = JSON.parse(readFileSync(schemaPath, "utf8"));
  // `oneOf` schemas keep their props in branches. Reading only the root meant
  // RadioButton and Loader were never validated at all, which is why seven
  // dead `classes` keys survived this check and only `satisfies` found them.
  const branches = [schema, ...(schema.oneOf ?? [])];
  for (const branch of branches) {
    const keys = Object.keys(branch.properties?.classes?.properties ?? {});
    if (!keys.length) continue;
    const target = branch.title && branch !== schema ? branch.title : dir;
    CLASSES_KEYS.set(target, new Set([...(CLASSES_KEYS.get(target) ?? []), ...keys]));
  }
}
const droppedKeys = [];

/** Same rule as build-component-docs.mjs: match on the component's own name. */
function subpathOf(name) {
  const wanted = `./${kebab(name)}`;
  if (pkg.exports[wanted]) return `@chumlab/ui/${kebab(name)}`;
  for (const key of Object.keys(pkg.exports)) {
    const target = pkg.exports[key];
    const file = typeof target === "string" ? target : target.import?.default ?? target.default ?? "";
    if (new RegExp(`components/${name}/index`).test(String(file))) return key.replace(/^\./, "@chumlab/ui");
  }
  return null;
}

/** Peer dependencies: present in any app that uses the component needing them. */
const PEERS = new Set(Object.keys(pkg.peerDependencies ?? {}));

/** Names a snippet may use without importing or declaring them. */
const GLOBALS = new Set([
  "console", "window", "document", "navigator", "Math", "Date", "JSON", "Object", "Array",
  "String", "Number", "Boolean", "Set", "Map", "WeakMap", "Promise", "Error", "RegExp",
  "setTimeout", "clearTimeout", "setInterval", "clearInterval", "requestAnimationFrame",
  "undefined", "NaN", "Infinity", "React", "Fragment", "isNaN", "parseInt", "parseFloat", "alert", "prompt", "confirm",
]);

/** React hooks a snippet can carry itself. Anything else is page machinery. */
const PORTABLE_HOOKS = new Set(["useState", "useMemo", "useCallback", "useRef", "useEffect", "useId"]);

/**
 * Free identifiers of a node: what it uses and does not itself bind.
 *
 * JSX makes this fiddly in three specific ways, each of which produced a wrong
 * number while this was being written: lowercase tags are intrinsic elements
 * rather than references, attribute NAMES are not identifiers, and the right
 * side of a property access is a member name rather than a binding.
 */
function freeIdentifiers(nodes, sf, usedTypes = new Set()) {
  const bound = new Set();
  const used = new Set();

  const bind = (n) => {
    if (ts.isParameter(n) || ts.isVariableDeclaration(n) || ts.isBindingElement(n)) {
      const name = (nm) => {
        if (!nm) return;
        if (ts.isIdentifier(nm)) bound.add(nm.text);
        else if (ts.isObjectBindingPattern(nm) || ts.isArrayBindingPattern(nm)) {
          nm.elements.forEach((e) => !ts.isOmittedExpression(e) && name(e.name));
        }
      };
      name(n.name);
    }
    ts.forEachChild(n, bind);
  };

  const use = (n) => {
    if (ts.isJsxSelfClosingElement(n) || ts.isJsxOpeningElement(n)) {
      const tag = n.tagName.getText(sf);
      if (/^[A-Z]/.test(tag)) used.add(tag.split(".")[0]);
      n.attributes.properties.forEach((p) => {
        if (ts.isJsxAttribute(p)) { if (p.initializer) use(p.initializer); }
        else if (ts.isJsxSpreadAttribute(p)) use(p.expression);
      });
      return;
    }
    if (ts.isJsxClosingElement(n)) return;
    if (ts.isCallExpression(n) || ts.isNewExpression(n)) {
      n.typeArguments?.forEach((t) => use(t));
      use(n.expression);
      n.arguments?.forEach((a) => use(a));
      return;
    }
    // Type positions are not value references. `as const` puts an identifier
    // named `const` in one, and `Record` and `SVGProps` are types a snippet
    // never has to import. A type the page imported from the library is a
    // different matter — the snippet still names it, so it still needs the
    // import — and those are collected here rather than as values.
    if (ts.isTypeNode(n)) {
      const typeNames = (t) => {
        if (ts.isTypeReferenceNode(t)) usedTypes.add(t.typeName.getText(sf).split(".")[0]);
        ts.forEachChild(t, typeNames);
      };
      typeNames(n);
      return;
    }
    // `x as StepTooltipConfig` — the expression AND the type it names, which
    // the snippet still has to import.
    if (ts.isAsExpression(n) || ts.isSatisfiesExpression?.(n)) { use(n.expression); if (n.type) use(n.type); return; }
    if (ts.isPropertyAccessExpression(n)) { use(n.expression); return; }
    if (ts.isPropertyAssignment(n) && !ts.isComputedPropertyName(n.name)) { use(n.initializer); return; }
    if (ts.isIdentifier(n)) { used.add(n.text); return; }
    ts.forEachChild(n, use);
  };

  nodes.forEach(bind);
  nodes.forEach(use);
  return [...used].filter((id) => !bound.has(id) && !GLOBALS.has(id));
}

/** The page's declarations, wherever they sit, plus how each may be reused. */
function pageSymbols(sf) {
  const imports = new Map();   // name → module specifier, already public
  const decls = new Map();     // name → { kind, node, text }
  const stateOf = new Map();   // value or setter name → the whole declaration

  for (const st of sf.statements) {
    if (!ts.isImportDeclaration(st) || !st.importClause) continue;
    const raw = st.moduleSpecifier.getText(sf).slice(1, -1);
    let spec = null;
    if (raw === "react") spec = "react";
    // A declared peer dependency is something the consumer already has —
    // `ColumnDef` comes from @tanstack/react-table, which anyone using Table
    // has installed. Treating it as unavailable cost 18 Table snippets.
    else if (PEERS.has(raw)) spec = raw;
    else {
      const m = /components\/([A-Za-z0-9]+)\/index/.exec(raw);
      if (m) spec = subpathOf(m[1]);
    }
    if (!spec) continue;
    const nb = st.importClause.namedBindings;
    if (nb && ts.isNamedImports(nb)) nb.elements.forEach((e) => imports.set(e.name.text, spec));
    if (st.importClause.name) imports.set(st.importClause.name.text, spec);
  }

  const record = (node, kind) => {
    node.declarationList?.declarations.forEach((d) => {
      if (ts.isIdentifier(d.name)) {
        decls.set(d.name.text, { kind, node: d, text: d.getText(sf) });
        return;
      }
      // `const [value, setValue] = useState(…)` — both names point at the pair.
      if (ts.isArrayBindingPattern(d.name) && d.initializer && ts.isCallExpression(d.initializer)) {
        const callee = d.initializer.expression.getText(sf);
        if (!PORTABLE_HOOKS.has(callee)) return;
        d.name.elements.forEach((e) => {
          if (!ts.isOmittedExpression(e) && ts.isIdentifier(e.name)) {
            stateOf.set(e.name.text, { kind: "state", node: d, text: d.getText(sf), hook: callee });
          }
        });
      }
    });
  };

  for (const st of sf.statements) {
    if (ts.isVariableStatement(st)) record(st, "module");
    // `function getTableClasses(…)` and `function useDrawerState(…)` are
    // declarations too. Only variable statements were recorded at first, which
    // is why 36 sections were reported as depending on something "not declared
    // on the page" when it was declared twenty lines above them.
    if (ts.isFunctionDeclaration(st) && st.name) {
      decls.set(st.name.text, { kind: "function", node: st, text: st.getText(sf), whole: true });
    }
    // `interface User { … }` — a shape the example's data is typed with. The
    // snippet carries it or it does not compile.
    if ((ts.isInterfaceDeclaration(st) || ts.isTypeAliasDeclaration(st)) && st.name) {
      decls.set(st.name.text, { kind: "type", node: st, text: st.getText(sf), whole: true });
    }
  }

  // Declarations inside the page component, which is where state and the `c`
  // styling object live.
  const walkFn = (node) => {
    if (ts.isVariableStatement(node)) record(node, "component");
    ts.forEachChild(node, walkFn);
  };
  for (const st of sf.statements) {
    if (ts.isFunctionDeclaration(st) && st.body) walkFn(st.body);
    if (ts.isVariableStatement(st)) {
      st.declarationList.declarations.forEach((d) => {
        if (d.initializer && (ts.isArrowFunction(d.initializer) || ts.isFunctionExpression(d.initializer)) && d.initializer.body) {
          walkFn(d.initializer.body);
        }
      });
    }
  }

  return { imports, decls, stateOf };
}

/**
 * `c.label` and friends: the page's own caption styling, `getClasses(dark)`.
 *
 * Resolved to the light-theme string so the markup the snippet carries is the
 * markup on the page. Reading the object rather than dropping the wrapper
 * elements keeps the example's layout, which is usually the thing the section
 * is demonstrating.
 */
function classTable(sf) {
  const table = new Map();
  const referencesDark = (node) => {
    let found = false;
    const walk = (n) => {
      if (found) return;
      if (ts.isIdentifier(n) && n.text === "dark") { found = true; return; }
      ts.forEachChild(n, walk);
    };
    walk(node);
    return found;
  };

  /** The node's text with every `dark ? a : b` collapsed to `b`. */
  const resolveDark = (node) => {
    const edits = [];
    const walk = (n) => {
      if (ts.isConditionalExpression(n) && n.condition.getText(sf).trim() === "dark") {
        edits.push({ start: n.getStart(sf), end: n.getEnd(), text: resolveDark(n.whenFalse) ?? "" });
        return;
      }
      ts.forEachChild(n, walk);
    };
    walk(node);
    let text = node.getText(sf);
    const base = node.getStart(sf);
    for (const e of edits.sort((a, b) => b.start - a.start)) {
      text = text.slice(0, e.start - base) + e.text + text.slice(e.end - base);
    }
    return referencesDarkText(text) ? null : text;
  };
  const referencesDarkText = (text) => /(^|[^\w.:-])dark($|[^\w:-])/.test(text);
  const fromObject = (obj) => {
    obj.properties.forEach((p) => {
      if (!ts.isPropertyAssignment(p) || ts.isComputedPropertyName(p.name)) return;
      const key = p.name.getText(sf).replace(/["']/g, "");
      // `dark ? a : b` — the page renders light by default here.
      let init = p.initializer;
      if (ts.isConditionalExpression(init)) init = init.whenFalse;
      // `{ … } satisfies TextAreaClasses` — keep the literal, drop the
      // annotation. The literal is what makes the call site excess-property
      // check, which is where the dead `classes` keys show up; the annotation
      // would only drag a type import into every snippet.
      while (ts.isSatisfiesExpression?.(init) || ts.isAsExpression(init) || ts.isParenthesizedExpression(init)) {
        init = init.expression;
      }
      // A plain string becomes a string; anything else (a palette object, an
      // array of hexes) is inlined as the expression the page itself wrote.
      if (ts.isStringLiteral(init) || ts.isNoSubstitutionTemplateLiteral(init)) {
        table.set(key, { literal: init.text });
      } else {
        // Not a substring test: `dark:bg-cl-bg` is a Tailwind variant, not a
        // reference to the page's `dark` flag, and testing the text rejected
        // every `classes` object on the page. A real `dark ? … : …` inside the
        // value is resolved to its light branch, at any depth — that is what
        // the page renders by default and what the snippet should carry.
        const resolved = resolveDark(init);
        if (resolved !== null) table.set(key, { expression: resolved });
      }
    });
  };
  // `const base = "…"` inside `getClasses`, used by the values it returns.
  // Substituted in, because a snippet cannot reach into that scope.
  const locals = new Map();
  const collectLocals = (body) => {
    const walk = (n) => {
      if (ts.isVariableDeclaration(n) && ts.isIdentifier(n.name) && n.initializer) {
        locals.set(n.name.text, n.initializer.getText(sf));
      }
      ts.forEachChild(n, walk);
    };
    if (body) walk(body);
  };

  // Module-level consts count as locals too: `const base = "…"` sits beside
  // `getClasses` rather than inside it on several pages, and a value that
  // interpolates it is not self-contained until both are resolved.
  for (const st of sf.statements) {
    if (!ts.isVariableStatement(st)) continue;
    for (const d of st.declarationList.declarations) {
      if (ts.isIdentifier(d.name) && d.initializer && !ts.isArrowFunction(d.initializer) && !ts.isFunctionExpression(d.initializer)) {
        locals.set(d.name.text, d.initializer.getText(sf));
      }
    }
  }

  const visit = (node) => {
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.name.text === "getClasses") {
      const fn = node.initializer;
      const body = fn && (ts.isArrowFunction(fn) || ts.isFunctionExpression(fn)) ? fn.body : null;
      collectLocals(body);
      if (body && ts.isParenthesizedExpression(body) && ts.isObjectLiteralExpression(body.expression)) fromObject(body.expression);
      else if (body && ts.isObjectLiteralExpression(body)) fromObject(body);
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);

  for (const [key, entry] of table) {
    if (!entry || !("expression" in entry)) continue;
    let text = entry.expression;
    for (let pass = 0; pass < 3; pass += 1) {
      const before = text;
      for (const [name, value] of locals) {
        text = text.replace(new RegExp(`(?<![\\w.$])${name}(?![\\w$])`, "g"), `(${value})`);
      }
      if (text === before) break;
    }
    table.set(key, { expression: text });
  }
  return table;
}

/**
 * `dark` → `false`, as an identifier and nowhere else.
 *
 * Two textual attempts got this wrong in ways that only differ in whether the
 * compiler notices. `\bdark\b` rewrote the `dark` inside `dark:bg-cl-bg`,
 * turning 168 Tailwind variant classes into `false:bg-cl-bg` — valid
 * TypeScript, silently wrong output. Excluding `:` and `-` fixed that and then
 * hit `<StatusBadge dark={dark} />`, rewriting the ATTRIBUTE NAME to
 * `false={false}` — a syntax error, and the cause of all seventeen Table
 * snippets that would not parse.
 *
 * So it is done on the tree: identifiers only, never a JSX attribute name,
 * never anything inside a string.
 */
/**
 * `false ? a : b` is `b`.
 *
 * `dark` becomes the literal `false` on the way into a snippet, which leaves
 * 192 dead ternaries across 58 files — `className={false ? "text-cl-accent" :
 * "text-cl-accent"}` in pasteable code. Folded here rather than in the printer
 * because it also has to reach the inlined helper declarations, which are not
 * JSX and never pass through it.
 */
function foldConstantConditionals(text) {
  for (let pass = 0; pass < 5; pass += 1) {
    const sf = ts.createSourceFile("fold.tsx", text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const cuts = [];
    const walk = (n) => {
      if (ts.isConditionalExpression(n)) {
        const kind = n.condition.kind;
        const taken =
          kind === ts.SyntaxKind.FalseKeyword ? n.whenFalse
          : kind === ts.SyntaxKind.TrueKeyword ? n.whenTrue
          : null;
        if (taken) {
          cuts.push({ start: n.getStart(sf), end: n.getEnd(), text: taken.getText(sf) });
          return;
        }
      }
      ts.forEachChild(n, walk);
    };
    walk(sf);
    if (!cuts.length) return text;
    for (const c of cuts.sort((a, b) => b.start - a.start)) {
      text = text.slice(0, c.start) + c.text + text.slice(c.end);
    }
  }
  return text;
}

/**
 * A backtick with nothing to substitute is a string.
 *
 * The demo pages write their class strings as template literals because most of
 * them interpolate a theme value; once `dark` is resolved away, 4520 of them
 * across 422 snippets hold nothing but text. Same shape as the wrapped literals
 * already folded, and the same reason: a reader is meant to paste this.
 *
 * Single-line only. A multi-line template would come back with `\n` escapes in
 * it, which is worse to read than the backticks.
 */
function foldConstantTemplates(text) {
  const sf = ts.createSourceFile("tpl.tsx", text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const cuts = [];
  const walk = (n) => {
    if (
      ts.isNoSubstitutionTemplateLiteral(n) &&
      !n.text.includes("\n") &&
      !ts.isTaggedTemplateExpression(n.parent)
    ) {
      cuts.push({ start: n.getStart(sf), end: n.getEnd(), text: JSON.stringify(n.text) });
      return;
    }
    ts.forEachChild(n, walk);
  };
  walk(sf);
  for (const c of cuts.sort((a, b) => b.start - a.start)) {
    text = text.slice(0, c.start) + c.text + text.slice(c.end);
  }
  return text;
}

function replaceDarkIdentifier(text) {
  // Parsed as-is, not wrapped in a fragment: this runs over inlined `const`
  // declarations as well as JSX bodies, and wrapping a declaration in `<>…</>`
  // produced a parse with no identifiers in it at all, so `dark` survived in
  // six snippets. The parse only has to locate identifiers; it does not have
  // to be a valid program.
  const sf = ts.createSourceFile("frag.tsx", text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const offset = 0;
  const cuts = [];
  /**
   * A reference, not a name. `dark` appears in the inlined page components as
   * a destructured parameter and as a member of its props type
   * (`{ status, dark = false }: { dark?: boolean }`), and rewriting those
   * produced `false = false` — the parse error behind the seventeen Table
   * snippets. The same guards `freeIdentifiers` uses, for the same reason.
   */
  const isDeclarationName = (n) => {
    const p = n.parent;
    if (!p) return false;
    if ((ts.isBindingElement(p) || ts.isParameter(p) || ts.isVariableDeclaration(p)) && p.name === n) return true;
    if (ts.isBindingElement(p) && p.propertyName === n) return true;
    if ((ts.isPropertySignature(p) || ts.isPropertyDeclaration(p)) && p.name === n) return true;
    if (ts.isPropertyAssignment(p) && p.name === n) return true;
    if (ts.isShorthandPropertyAssignment(p)) return true;
    if (ts.isPropertyAccessExpression(p) && p.name === n) return true;
    if ((ts.isFunctionDeclaration(p) || ts.isMethodDeclaration(p)) && p.name === n) return true;
    return false;
  };

  const walk = (n) => {
    if (ts.isJsxAttribute(n)) {
      // The attribute name is not a reference; its value is.
      if (n.initializer) walk(n.initializer);
      return;
    }
    if (ts.isIdentifier(n) && n.text === "dark") {
      if (!isDeclarationName(n)) cuts.push({ start: n.getStart(sf) - offset, end: n.getEnd() - offset });
      return;
    }
    ts.forEachChild(n, walk);
  };
  walk(sf);
  let out = text;
  for (const cut of cuts.sort((a, b) => b.start - a.start)) {
    out = out.slice(0, cut.start) + "false" + out.slice(cut.end);
  }
  return out;
}


/** ── printing JSX from its own tree ───────────────────────────────────── */
/**
 * A snippet has to agree with its own tree.
 *
 * `printBody` decides every line's depth from nesting, so re-reading an emitted
 * snippet and printing it again must produce the same text. Anything else means
 * the file on disk was not printed from its tree — hand-edited, or emitted by a
 * generator that computed depth some other way, which is the defect this
 * replaced. Checked as a fixpoint rather than by re-deriving a rule, so the
 * assertion cannot drift from the printer.
 */
function indentationDrift(code) {
  const sf = ts.createSourceFile("check.tsx", code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  // The exported component's return, not the first one in the file. A snippet
  // may inline a helper that itself returns JSX, and that helper's JSX sits at
  // its own depth inside its own function, not at the component's.
  const exported = sf.statements.find(
    (st) =>
      ts.isFunctionDeclaration(st) &&
      st.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword),
  );
  if (!exported?.body) return null;
  let ret = null;
  const find = (n) => {
    if (ret) return;
    if (ts.isReturnStatement(n) && n.expression) { ret = n.expression; return; }
    // Not into a nested function: its returns are not the component's.
    if (ts.isFunctionDeclaration(n) || ts.isFunctionExpression(n) || ts.isArrowFunction(n)) return;
    ts.forEachChild(n, find);
  };
  exported.body.statements.forEach(find);
  if (!ret) return null;

  const body = unwrap(ret);
  // Only a JSX body has a tree to be indented against.
  if (!ts.isJsxElement(body) && !ts.isJsxFragment(body) && !ts.isJsxSelfClosingElement(body)) return null;
  // Printed at the depth it occupies in the file, so the comparison is against
  // the bytes on disk rather than against a normalised version of them.
  const printed = printJsxNode(body, sf, 2).join("\n").replace(/\n{3,}/g, "\n\n");

  // From the start of the line the expression opens on, so its own indent is
  // included rather than skipped by `getStart`.
  const lineStart = code.lastIndexOf("\n", body.getStart(sf)) + 1;
  const onDisk = code.slice(lineStart, body.getEnd());

  const tidy = (t) => t.split("\n").map((l) => l.replace(/\s+$/, "")).join("\n").trimEnd();
  return tidy(onDisk) === tidy(printed) ? null : { printed: tidy(printed), onDisk: tidy(onDisk) };
}


/**
 * Emit JSX at two spaces per level of nesting, taken from the tree.
 *
 * What this replaces derived depth from text: it took `node.getText()` out of
 * the demo page, then stripped the smallest indent any line happened to have.
 * That is only correct when every line kept the depth it had on the page — and
 * the extractor rewrites lines, so a parent that had been re-based to column 6
 * kept a child sitting at column 20, fourteen further in than its own opener.
 * 403 of 626 snippets had a jump of that shape.
 *
 * Depth here is the distance from the root of the tree being printed, so there
 * is nothing computed after the fact that can disagree with the structure.
 * `assertIndentation` re-reads the emitted text and checks it against the same
 * rule, so a snippet that drifts from its own tree fails `--check`.
 */
const PRINT_WIDTH = 96;
const pad = (depth) => "  ".repeat(depth);

/** A template literal whose every substitution is itself constant is a string. */
function foldConstantTemplate(expr) {
  if (ts.isStringLiteral(expr) || ts.isNoSubstitutionTemplateLiteral(expr)) return expr.text;
  if (!ts.isTemplateExpression(expr)) return null;
  let out = expr.head.text;
  for (const span of expr.templateSpans) {
    let inner = span.expression;
    while (ts.isParenthesizedExpression(inner)) inner = inner.expression;
    const folded = foldConstantTemplate(inner);
    if (folded === null) return null;
    out += folded + span.literal.text;
  }
  return out;
}

/** The expression a container holds, with parentheses and folding applied. */
function unwrap(expr) {
  let e = expr;
  while (ts.isParenthesizedExpression(e)) e = e.expression;
  return e;
}

/**
 * One attribute, at its own depth, absolutely padded.
 *
 * Every line this returns is final: the caller appends them verbatim. Returning
 * a mix of padded and unpadded lines is what put a `colors={` object two levels
 * deeper than its own attribute.
 */
function printAttribute(attr, sfx, depth) {
  const P = pad(depth);
  if (ts.isJsxSpreadAttribute(attr)) return [`${P}{...${attr.expression.getText(sfx)}}`];
  const name = attr.name.getText(sfx);
  if (!attr.initializer) return [P + name];
  // The source's own quoting, not a re-encoding of it: `.text` hands back
  // `\\u00e9` as five characters, and JSON.stringify then escapes the backslash.
  if (ts.isStringLiteral(attr.initializer)) return [`${P}${name}=${attr.initializer.getText(sfx)}`];
  if (!ts.isJsxExpression(attr.initializer)) return [`${P}${name}=${attr.initializer.getText(sfx)}`];

  const inner = unwrap(attr.initializer.expression);
  if (!inner) return [P + name];

  // `className={(`${("a b c")}`)}` is a string that survived three wrappers on
  // its way through the substitution pass. A reader is meant to paste this.
  if (ts.isStringLiteral(inner)) return [`${P}${name}=${inner.getText(sfx)}`];
  const folded = foldConstantTemplate(inner);
  if (folded !== null) return [`${P}${name}=${JSON.stringify(folded)}`];

  if (containsJsx(inner)) {
    const lines = printExpression(inner, sfx, depth + 1);
    if (lines.length === 1) return [`${P}${name}={${lines[0].trim()}}`];
    return [`${P}${name}={`, ...lines, `${P}}`];
  }
  const text = inner.getText(sfx);
  if (!text.includes("\n")) return [`${P}${name}={${text}}`];
  return [`${P}${name}={`, ...reindentBlock(text, depth + 1), `${P}}`];
}

/** True when a node has JSX anywhere inside it. */
function containsJsx(node) {
  let found = false;
  const walk = (n) => {
    if (found) return;
    if (ts.isJsxElement(n) || ts.isJsxSelfClosingElement(n) || ts.isJsxFragment(n)) { found = true; return; }
    ts.forEachChild(n, walk);
  };
  walk(node);
  return found;
}

/**
 * A pure-JavaScript block, moved to `depth` while keeping its own internal
 * shape. Its relative indentation is its own and is already consistent — it
 * came from one contiguous region of one file — so only the base moves.
 */
function reindentBlock(text, depth) {
  const lines = text.replace(/\t/g, "  ").split("\n");
  const rest = lines.slice(1).filter((l) => l.trim());
  const base = rest.length ? Math.min(...rest.map((l) => l.match(/^ */)[0].length)) : 0;
  return lines.map((l, i) => (i === 0 ? pad(depth) + l.trim() : l.trim() ? pad(depth) + l.slice(base) : ""));
}

function printOpening(el, sfx, depth, selfClosing) {
  const tag = el.tagName.getText(sfx);
  const attrs = el.attributes.properties.map((a) => printAttribute(a, sfx, depth + 1));
  const flat = attrs.map((a) => a.map((l) => l.trim()).join(" "));
  const oneLine = `<${tag}${flat.length ? " " + flat.join(" ") : ""}${selfClosing ? " />" : ">"}`;
  if (!attrs.some((a) => a.length > 1) && pad(depth).length + oneLine.length <= PRINT_WIDTH) {
    return [pad(depth) + oneLine];
  }
  const out = [pad(depth) + `<${tag}`];
  for (const attr of attrs) out.push(...attr);
  out.push(pad(depth) + (selfClosing ? "/>" : ">"));
  return out;
}

/** An expression inside `{ … }`, printed so nested JSX keeps structural depth. */
function printExpression(expr, sfx, depth) {
  const e = unwrap(expr);

  if (ts.isJsxElement(e) || ts.isJsxSelfClosingElement(e) || ts.isJsxFragment(e)) {
    return printJsxNode(e, sfx, depth);
  }

  // `items.map((item) => ( <X/> ))` — the callback's JSX is the part whose
  // depth matters, so it is printed rather than carried as text.
  if (ts.isCallExpression(e) && e.arguments.length === 1) {
    const [arg] = e.arguments;
    if (ts.isArrowFunction(arg) && containsJsx(arg.body)) {
      // The callee can be an inline array literal spanning lines, and its own
      // indentation is the demo page's. Re-based like any other JS block.
      const calleeText = e.expression.getText(sfx);
      const head = calleeText.includes("\n")
        ? reindentBlock(calleeText, depth)
        : [pad(depth) + calleeText];
      const params = arg.parameters.map((p) => p.getText(sfx)).join(", ");
      const inner = printExpression(unwrap(arg.body), sfx, depth + 1);
      head[head.length - 1] += `((${params}) => (`;
      return [...head, ...inner, `${pad(depth)}))`];
    }
  }

  if (ts.isConditionalExpression(e) && containsJsx(e)) {
    const cond = e.condition.getText(sfx);
    return [
      `${pad(depth)}${cond} ? (`,
      ...printExpression(e.whenTrue, sfx, depth + 1),
      `${pad(depth)}) : (`,
      ...printExpression(e.whenFalse, sfx, depth + 1),
      `${pad(depth)})`,
    ];
  }

  if (ts.isBinaryExpression(e) && e.operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken && containsJsx(e.right)) {
    return [
      `${pad(depth)}${e.left.getText(sfx)} && (`,
      ...printExpression(e.right, sfx, depth + 1),
      `${pad(depth)})`,
    ];
  }

  const text = e.getText(sfx);
  return text.includes("\n") ? reindentBlock(text, depth) : [pad(depth) + text];
}

function printJsxNode(node, sfx, depth) {
  if (ts.isJsxSelfClosingElement(node)) return printOpening(node, sfx, depth, true);

  if (ts.isJsxText(node)) {
    const text = node.text.replace(/\s+/g, " ").trim();
    return text ? [pad(depth) + text] : [];
  }

  if (ts.isJsxExpression(node)) {
    if (!node.expression) return [];
    const inner = printExpression(node.expression, sfx, depth + 1);
    if (inner.length === 1) return [pad(depth) + `{${inner[0].trim()}}`];
    return [pad(depth) + "{", ...inner, pad(depth) + "}"];
  }

  // Anything that is not JSX is carried as its own text rather than guessed at.
  if (!ts.isJsxElement(node) && !ts.isJsxFragment(node)) {
    const text = node.getText(sfx);
    return text.includes("\n") ? reindentBlock(text, depth) : [pad(depth) + text];
  }

  const isFragment = ts.isJsxFragment(node);
  const open = isFragment
    ? [pad(depth) + "<>"]
    : printOpening(node.openingElement, sfx, depth, false);
  const close = isFragment
    ? pad(depth) + "</>"
    : pad(depth) + `</${node.closingElement.tagName.getText(sfx)}>`;

  const children = node.children.flatMap((c) => printJsxNode(c, sfx, depth + 1));

  // `<Tag>text</Tag>` stays on one line when it all fits and holds one string.
  if (
    children.length === 1 &&
    open.length === 1 &&
    !children[0].trimStart().startsWith("<") &&
    !children[0].trimStart().startsWith("{") &&
    open[0].length + children[0].trim().length + close.trim().length <= PRINT_WIDTH
  ) {
    return [open[0] + children[0].trim() + close.trim()];
  }
  return [...open, ...children, close];
}

/**
 * The whole body, printed from the tree it was parsed into, at the depth it
 * will finally occupy.
 *
 * Not at depth 0 with the caller shifting afterwards: every decision about
 * whether a line fits is made against its real column, and a uniform shift
 * applied later moves lines past the width they were measured at. That made the
 * printer non-idempotent — re-printing an emitted snippet broke lines the first
 * pass had kept whole.
 */
function printBody(code, baseDepth) {
  const wrapped = ts.createSourceFile("snippet.tsx", `<>\n${code}\n</>`, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  let fragment = null;
  const find = (n) => {
    if (fragment) return;
    if (ts.isJsxFragment(n)) { fragment = n; return; }
    ts.forEachChild(n, find);
  };
  find(wrapped);
  if (!fragment) return code;
  const lines = fragment.children.flatMap((c) => printJsxNode(c, wrapped, baseDepth));
  return lines.join("\n").replace(/\n{3,}/g, "\n\n").replace(/\s+$/, "");
}

/** Strip the common indent so a pasted snippet is not stair-stepped. */
function dedent(text) {
  const lines = text.replace(/\t/g, "  ").split("\n");
  const indents = lines.filter((l) => l.trim()).map((l) => l.match(/^ */)[0].length);
  const cut = indents.length ? Math.min(...indents) : 0;
  return lines.map((l) => l.slice(cut)).join("\n").trim();
}

/**
 * Remove `classes` keys the component does not have, from the emitted snippet.
 *
 * Parses what is about to be written rather than the page, because the object
 * only becomes a literal once `c.accordion` has been substituted in — before
 * that there is nothing for a checker to look at.
 */
function stripUnknownClassesKeys(code, componentName) {
  const sf = ts.createSourceFile("snippet.tsx", `<>${code}</>`, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const offset = 2;  // the `<>` added to make the fragment parseable
  const cuts = [];

  const visit = (node) => {
    if (ts.isJsxAttribute(node) && node.name.getText(sf) === "classes" && node.initializer &&
        ts.isJsxExpression(node.initializer) && node.initializer.expression) {
      let expr = node.initializer.expression;
      while (ts.isParenthesizedExpression(expr)) expr = expr.expression;
      const owner = node.parent.parent;
      const tag = ts.isJsxSelfClosingElement(owner) ? owner.tagName.getText(sf) : owner.tagName?.getText(sf);
      const valid = CLASSES_KEYS.get(componentName) ?? CLASSES_KEYS.get(tag);
      if (valid && ts.isObjectLiteralExpression(expr)) {
        for (const prop of expr.properties) {
          if (!ts.isPropertyAssignment(prop) || ts.isComputedPropertyName(prop.name)) continue;
          const key = prop.name.getText(sf).replace(/["']/g, "");
          if (valid.has(key)) continue;
          let end = prop.getEnd();
          if (sf.text[end] === ",") end += 1;
          cuts.push({ start: prop.getStart(sf), end, key, tag: tag ?? componentName });
        }
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);

  let out = code;
  for (const cut of cuts.sort((a, b) => b.start - a.start)) {
    out = out.slice(0, cut.start - offset) + out.slice(cut.end - offset);
    droppedKeys.push(`${cut.tag}.${cut.key}`);
  }
  // Whatever the cuts left behind: empty lines and a dangling comma.
  return out.replace(/,(\s*[}\]])/g, "$1").replace(/\n[ \t]*\n[ \t]*\n/g, "\n\n");
}

/** ── extraction ───────────────────────────────────────────────────────── */

function sectionsOf(sf) {
  const out = [];
  const visit = (node) => {
    if (ts.isJsxElement(node) && node.openingElement.tagName.getText(sf) === "Section") {
      const titleAttr = node.openingElement.attributes.properties.find(
        (p) => ts.isJsxAttribute(p) && p.name.getText(sf) === "title",
      );
      const title =
        titleAttr && titleAttr.initializer && ts.isStringLiteral(titleAttr.initializer)
          ? titleAttr.initializer.text
          : null;
      const wrapper = node.children.find(
        (ch) => ts.isJsxElement(ch) && /^Demo(Wrapper|Block)$/.test(ch.openingElement.tagName.getText(sf)),
      );
      if (title && wrapper) out.push({ title, body: wrapper.children.filter((c) => !ts.isJsxText(c) || c.getText(sf).trim()) });
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return out;
}

/**
 * Resolve a section's dependencies, or explain why it has none worth shipping.
 * Returns { code, needsClient } or { reason }.
 */
function build(section, sf, symbols, classes, componentName) {
  const { imports, decls, stateOf } = symbols;

  /**
   * `<DemoLabel>Small</DemoLabel>` is the page's caption for an example, not
   * part of using the component — a reader copying an Accordion example wants
   * the Accordion. It is stripped wherever it appears, which is usually nested
   * inside a layout `div` rather than at the top of the demo.
   *
   * Stripped from the text, and the text is then re-parsed for the identifier
   * analysis. Filtering the nodes instead left the analysis looking at markup
   * the snippet would not carry, and 44 sections were rejected for depending
   * on a component that had already been removed from them.
   */
  const labelCuts = [];
  const findLabels = (n) => {
    const tag =
      ts.isJsxElement(n) ? n.openingElement.tagName.getText(sf) :
      ts.isJsxSelfClosingElement(n) ? n.tagName.getText(sf) : null;
    if (tag === "DemoLabel") { labelCuts.push({ start: n.getStart(sf), end: n.getEnd() }); return; }
    ts.forEachChild(n, findLabels);
  };
  section.body.forEach(findLabels);

  let bodyText = section.body.map((n) => n.getText(sf)).join("\n");
  if (labelCuts.length) {
    const base = section.body[0].getStart(sf);
    const pieces = section.body.map((n) => ({ start: n.getStart(sf), text: n.getText(sf) }));
    bodyText = pieces
      .map(({ start, text }) => {
        let t = text;
        for (const cut of labelCuts.filter((c) => c.start >= start && c.end <= start + text.length).sort((a, b) => b.start - a.start)) {
          t = t.slice(0, cut.start - start) + t.slice(cut.end - start);
        }
        return t;
      })
      .join("\n");
    void base;
  }

  // Analyse what will actually be emitted.
  const analysed = ts.createSourceFile("body.tsx", `<>${bodyText}</>`, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const fragment = analysed.statements[0];
  const analysedBody =
    fragment && ts.isExpressionStatement(fragment) && ts.isJsxFragment(fragment.expression)
      ? [...fragment.expression.children]
      : section.body;
  const analysedSf = analysedBody === section.body ? sf : analysed;

  const typeNames = new Set();
  const needed = freeIdentifiers(analysedBody, analysedSf, typeNames);
  // Types are resolved after the value queue, since inlined declarations add
  // their own annotations to the set as they are pulled in.
  const importsUsed = new Map();     // spec → Set(names)
  const inlined = [];                // declaration text, in dependency order
  const hoisted = [];                // useState lines
  const seen = new Set();
  const queue = [...needed];

  while (queue.length) {
    const id = queue.shift();
    if (seen.has(id)) continue;
    seen.add(id);

    if (id === "c") continue;          // resolved by `resolvePageScope`
    if (id === "dark") continue;                       // resolved to the light theme

    if (imports.has(id)) {
      const spec = imports.get(id);
      if (!importsUsed.has(spec)) importsUsed.set(spec, new Set());
      importsUsed.get(spec).add(id);
      continue;
    }

    if (stateOf.has(id)) {
      const st = stateOf.get(id);
      if (!hoisted.includes(st.text)) {
        hoisted.push(st.text);
        // The annotation counts too: `useState<CascadingValue[]>([])` names a
        // library type the snippet has to import.
        const stateTypes = new Set();
        freeIdentifiers([st.node], sf, stateTypes).forEach((d) => queue.push(d));
        stateTypes.forEach((t) => typeNames.add(t));
      }
      // The hook itself has to come from react.
      if (!importsUsed.has("react")) importsUsed.set("react", new Set());
      importsUsed.get("react").add(st.hook);
      continue;
    }

    if (decls.has(id)) {
      const d = decls.get(id);
      const declTypes = new Set();
      const deps = freeIdentifiers([d.node], sf, declTypes);
      declTypes.forEach((t) => typeNames.add(t));
      // A declaration that closes over state or a hook is page machinery, not
      // an example fixture — inlining it would paste a broken reference.
      if (deps.some((x) => stateOf.has(x))) return { reason: `\`${id}\` closes over page state` };
      deps.forEach((x) => queue.push(x));
      // `const basic = useDrawerState()` cannot sit at module scope — a hook
      // call only runs inside a component. Whole function declarations go out
      // to module scope; everything else follows the page's own placement.
      const callsHook =
        d.node.initializer &&
        ts.isCallExpression(d.node.initializer) &&
        /^use[A-Z]/.test(d.node.initializer.expression.getText(sf));
      if (callsHook) {
        if (!hoisted.includes(d.text)) hoisted.unshift(d.text);
        continue;
      }
      const text = d.whole ? d.text : `const ${d.text};`;
      if (!inlined.includes(text)) inlined.unshift(text);
      continue;
    }

    return { reason: `\`${id}\` is not declared on the page` };
  }

  for (const t of typeNames) {
    if (imports.has(t)) {
      const spec = imports.get(t);
      if (!importsUsed.has(spec)) importsUsed.set(spec, new Set());
      importsUsed.get(spec).add(t);
      continue;
    }
    const d = decls.get(t);
    if (d?.kind === "type" && !inlined.includes(d.text)) {
      inlined.unshift(d.text);
      const nested = new Set();
      freeIdentifiers([d.node], sf, nested);
      for (const n of nested) {
        const nd = decls.get(n);
        if (nd?.kind === "type" && !inlined.includes(nd.text)) inlined.unshift(nd.text);
      }
    }
  }

  /**
   * The two page-scope values a snippet cannot reach, resolved to what the page
   * renders: the styling object and the theme flag.
   *
   * Applied to the inlined declarations and hoisted state as well as the body.
   * Substituting only the body left `const s = getTableClasses(dark)` sitting
   * above a snippet that had no `dark`, and 24 otherwise-good snippets were
   * dropped for it.
   */
  let missingKey = null;
  const resolvePageScope = (text) => {
    let out = text.replace(/\bc\.([A-Za-z0-9_]+)/g, (_m, key) => {
      const entry = classes.get(key);
      if (!entry) { missingKey = key; return _m; }
      return "literal" in entry ? JSON.stringify(entry.literal) : `(${entry.expression})`;
    });
    return foldConstantTemplates(foldConstantConditionals(replaceDarkIdentifier(out)));
  };

  let code = resolvePageScope(dedent(bodyText));
  for (let i = 0; i < inlined.length; i += 1) inlined[i] = resolvePageScope(inlined[i]);
  for (let i = 0; i < hoisted.length; i += 1) hoisted[i] = resolvePageScope(hoisted[i]);
  if (missingKey) return { reason: `page styling \`c.${missingKey}\` could not be resolved` };

  code = stripUnknownClassesKeys(code, componentName);

  // Last: re-read what every earlier pass produced and print it from its own
  // tree. Everything above edits text — label cuts by offset, `c.foo`
  // substitution, dead `classes` keys removed — and text edits do not keep
  // indentation true to structure. This is the only place depth is decided.
  const rawBody = code;

  const importLines = [...importsUsed.entries()]
    .sort(([a], [b]) => (a === "react" ? -1 : b === "react" ? 1 : a.localeCompare(b)))
    .map(([spec, names]) => `import { ${[...names].sort().join(", ")} } from "${spec}";`);

  // A snippet needs a client boundary in Next when it holds state or wires a
  // handler — derived from this snippet, not from the component.
  const needsClient =
    hoisted.length > 0 ||
    /\bon[A-Z][A-Za-z]*\s*=\s*\{/.test(code) ||
    /\buse[A-Z][A-Za-z]*\s*\(/.test(code);

  const parts = [];
  if (importLines.length) parts.push(importLines.join("\n"));
  if (inlined.length) parts.push(inlined.join("\n\n"));
  // A fragment unless the body is a single element. A lone `{items.map(…)}` is
  // a JSX child, not an expression, so returning it bare is a syntax error.
  const single =
    section.body.length === 1 &&
    (ts.isJsxElement(section.body[0]) || ts.isJsxSelfClosingElement(section.body[0]));
  // Printed straight into its final column: the root sits at depth 2, and a
  // fragment puts its children at depth 3.
  const inner = single
    ? printBody(rawBody, 2)
    : `${pad(2)}<>\n${printBody(rawBody, 3)}\n${pad(2)}</>`;
  const bodyLines = [...hoisted.map((h) => `  const ${h};`), `  return (`, ...inner.split("\n"), `  );`];
  parts.push(`export default function ${componentName}Example() {\n${bodyLines.join("\n")}\n}`);

  return { code: `${parts.join("\n\n")}\n`, needsClient };
}

/** ── run ──────────────────────────────────────────────────────────────── */

const pages = readdirSync(DEMOS).filter((f) => f.endsWith("Demo.tsx") && f !== "Demo.tsx");
const result = {};
const skipped = [];
let considered = 0;
let emitted = 0;

for (const file of pages) {
  const componentName = file.replace(/Demo\.tsx$/, "");
  const sf = ts.createSourceFile(file, readFileSync(join(DEMOS, file), "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const symbols = pageSymbols(sf);
  const classes = classTable(sf);

  for (const section of sectionsOf(sf)) {
    considered += 1;
    const built = build(section, sf, symbols, classes, componentName);
    if (built.reason) {
      skipped.push({ component: componentName, title: section.title, reason: built.reason });
      continue;
    }
    emitted += 1;
    result[componentName] ??= {};
    result[componentName][section.title] = {
      react: built.code,
      next: built.needsClient ? `"use client";\n\n${built.code}` : built.code,
      needsClientBoundary: built.needsClient,
    };
  }
}

/** ── output ───────────────────────────────────────────────────────────── */

const header = `// GENERATED by scripts/build-demo-snippets.mjs — do not edit.
//
// One copy-paste snippet per rendered demo section, extracted from the demo
// page's own JSX. The code here is the code rendering above it on the page.
//
// Regenerate: node scripts/build-demo-snippets.mjs
`;

const siteFileOf = () => `${header}
export interface DemoSnippet {
  react: string;
  next: string;
  needsClientBoundary: boolean;
}

export const DEMO_SNIPPETS: Record<string, Record<string, DemoSnippet>> = ${JSON.stringify(result, null, 2)};
`;

const slug = (title) => title.replace(/[^A-Za-z0-9]+/g, "-").replace(/^-|-$/g, "");
const files = [];
for (const [component, sections] of Object.entries(result)) {
  for (const [title, snip] of Object.entries(sections)) {
    files.push([join("react", `${component}__${slug(title)}.tsx`), snip.react]);
    files.push([join("next", `${component}__${slug(title)}.tsx`), snip.next]);
  }
}

/**
 * Prune to a fixpoint, not in one pass.
 *
 * TypeScript reports syntax errors and then skips semantic checking for the
 * whole program, so a first run over a set containing one unparseable snippet
 * returns only the parse errors. That pass dropped 17 sections and declared
 * the rest clean, while the standalone gate — running afterwards on a
 * syntactically valid set — found 78 more files with type errors. Looping until
 * a run comes back clean is what makes the generator's guarantee the same one
 * the gate checks.
 */
for (let pass = 1; pass <= 6; pass += 1) {
  const failures = failingSnippets(files);
  if (!failures.size) break;
  for (const [rel, message] of failures) {
    const m = /^(react|next)[\\/](.+?)__(.+)\.tsx$/.exec(rel);
    if (!m) continue;
    const [, , component, titleSlug] = m;
    const sections = result[component];
    if (!sections) continue;
    const title = Object.keys(sections).find((t) => slug(t) === titleSlug);
    if (!title) continue;
    delete sections[title];
    if (!Object.keys(sections).length) delete result[component];
    skipped.push({ component, title, reason: `does not typecheck: ${message}` });
  }
  const kept = files.filter(([rel]) => {
    const m = /^(react|next)[\\/](.+?)__(.+)\.tsx$/.exec(rel);
    if (!m) return true;
    return result[m[2]] && Object.keys(result[m[2]]).some((t) => slug(t) === m[3]);
  });
  files.length = 0;
  files.push(...kept);
}
emitted = Object.values(result).reduce((n, sections) => n + Object.keys(sections).length, 0);

const siteFile = siteFileOf();

function compare(path, content) {
  return existsSync(path) && readFileSync(path, "utf8") === content;
}

/**
 * Drop anything that does not compile, before it can reach a copy button.
 *
 * This is the same rule as the sections that carry no button at all: a snippet
 * that will not typecheck against the published types is worse than an absent
 * one, because the reader only finds out after pasting it. Running the check
 * here rather than only in the gate means the button and the guarantee ship
 * together.
 */
function failingSnippets(entries) {
  const paths = {};
  for (const [key, target] of Object.entries(pkg.exports)) {
    const types = typeof target === "string" ? null : target.import?.types ?? target.types ?? null;
    if (types) paths[key.replace(/^\./, "@chumlab/ui")] = [types];
  }

  // Not `existsSync("dist")`. `npm run build` used to write the site there too,
  // so the directory existed, every subpath resolved to nothing, all but 35 of
  // 626 snippets failed to compile, and this script dutifully pruned them and
  // reported success. The site has its own outDir now; this checks the thing
  // that actually matters anyway — that the declarations are really there.
  const missing = Object.entries(paths)
    .filter(([, [types]]) => !existsSync(resolve(root, types)))
    .map(([subpath]) => subpath);
  if (missing.length) {
    process.stderr.write(
      `✗ the built library is not in dist/: ${missing.length} of ${Object.keys(paths).length} ` +
        `subpath(s) resolve to no declaration file (${missing.slice(0, 3).join(", ")}…).\n` +
        "  Run `npm run build:lib`. Typechecking snippets against a missing library " +
        "fails every one of them and would silently empty this set.\n",
    );
    process.exit(1);
  }

  // Written where they will finally live, and checked there. Checking copies
  // under flattened names in a temp directory meant the compiler's paths did
  // not match the ones being pruned, so 78 failing snippets survived the filter
  // and only the standalone gate saw them.
  rmOwnedDir(OUT_SNIPPETS, {
    owner: "build-demo-snippets",
    owns: entries.map(([rel]) => rel),
  });
  for (const flavour of ["react", "next"]) mkdirSync(join(OUT_SNIPPETS, flavour), { recursive: true });
  for (const [rel, content] of entries) writeFileSync(join(OUT_SNIPPETS, rel), content, "utf8");
  writeOwnedManifest(OUT_SNIPPETS, "build-demo-snippets", entries.map(([rel]) => rel));

  const dir = mkdtempSync(join(tmpdir(), "demo-snippets-build-"));
  const configPath = join(dir, "tsconfig.json");
  writeFileSync(configPath, JSON.stringify({
    compilerOptions: {
      target: "ES2022", lib: ["ES2022", "DOM", "DOM.Iterable"], jsx: "react-jsx",
      module: "ESNext", moduleResolution: "bundler", strict: true, noEmit: true,
      skipLibCheck: true, esModuleInterop: true, baseUrl: root, paths,
      typeRoots: [join(root, "node_modules/@types")],
    },
    files: entries.map(([rel]) => join(OUT_SNIPPETS, rel)),
  }, null, 2), "utf8");

  const run = spawnSync("npx", ["tsc", "-p", configPath], {
    cwd: root,
    encoding: "utf8",
    // The default 1MB truncated the compiler's output, so this saw 34 of
    // the 78 failing files and let the rest through as passing.
    maxBuffer: 64 * 1024 * 1024,
  });
  const out = `${run.stdout ?? ""}${run.stderr ?? ""}`;
  rmSync(dir, { recursive: true, force: true });

  const bad = new Map();
  for (const line of out.split("\n")) {
    const m = /^(.*?)\((\d+),(\d+)\): error (TS\d+): (.*)$/.exec(line);
    if (!m) continue;
    const rel = m[1].replace(`${root}/`, "").replace("scripts/consumers/_app/snippets/demo/", "");
    if (!bad.has(rel)) bad.set(rel, `${m[4]} ${m[5]}`);
  }
  return bad;
}


if (SELF_CHECK) {
  // A snippet that is correct, and the same snippet with one child pushed in
  // four spaces. The first must pass and the second must fail: a check that
  // only ever sees well-formed input is not shown to be checking anything.
  const good = [
    'export default function Example() {',
    '  return (',
    '    <div className="wrap">',
    '      <span>ok</span>',
    '    </div>',
    '  );',
    '}',
  ].join("\n");
  const planted = good.replace('      <span>ok</span>', '          <span>ok</span>');

  const goodDrift = indentationDrift(good);
  const plantedDrift = indentationDrift(planted);

  process.stdout.write("\n── snippet indentation self-check ──────────────────────────────\n");
  process.stdout.write(`  well-formed snippet: ${goodDrift ? "REPORTED AS DRIFTED" : "accepted"}\n`);
  process.stdout.write(`  child pushed in 4:   ${plantedDrift ? "caught" : "PASSED — the check is blind"}\n`);
  if (plantedDrift) {
    process.stdout.write(`      on disk: ${JSON.stringify(plantedDrift.onDisk.split("\n")[1] ?? "")}\n`);
    process.stdout.write(`      printed: ${JSON.stringify(plantedDrift.printed.split("\n")[1] ?? "")}\n`);
  }
  const ok = !goodDrift && Boolean(plantedDrift);
  process.stdout.write(
    ok
      ? "  RESULT: the check accepts a tree-indented snippet and refuses a mis-indented one\n"
      : "  RESULT: FAILED\n",
  );
  process.stdout.write("════════════════════════════════════════════════════════════════\n");
  process.exit(ok ? 0 : 1);
}

if (CHECK) {
  const drifted = [];
  if (!compare(OUT_SITE, siteFile)) drifted.push(OUT_SITE);
  for (const [rel, content] of files) if (!compare(join(OUT_SNIPPETS, rel), content)) drifted.push(join(OUT_SNIPPETS, rel));
  if (drifted.length) {
    process.stderr.write(`✗ demo snippets drifted from the pages (${drifted.length} file(s)). Run: node scripts/build-demo-snippets.mjs\n`);
    process.exit(1);
  }
  // Drift from the pages is one failure; drift from its own tree is another.
  // A snippet can match what the generator last wrote and still be indented
  // wrongly, which is exactly the state 403 of these were in.
  const misindented = [];
  for (const [rel, content] of files) {
    const drift = indentationDrift(content);
    if (drift) misindented.push({ rel, drift });
  }
  if (misindented.length) {
    process.stderr.write(
      `✗ ${misindented.length} snippet(s) are not indented to their own tree:\n`,
    );
    for (const { rel, drift } of misindented.slice(0, 5)) {
      process.stderr.write(`    ${rel}\n`);
      const a = drift.onDisk.split("\n");
      const b = drift.printed.split("\n");
      for (let i = 0; i < Math.max(a.length, b.length); i += 1) {
        if (a[i] === b[i]) continue;
        process.stderr.write(`      on disk: ${JSON.stringify(a[i] ?? "")}\n`);
        process.stderr.write(`      printed: ${JSON.stringify(b[i] ?? "")}\n`);
        break;
      }
    }
    if (misindented.length > 5) process.stderr.write(`    … and ${misindented.length - 5} more\n`);
    process.exit(1);
  }

  process.stdout.write(
    `✓ demo snippets in step: ${emitted} of ${considered} sections, each indented to its own tree\n`,
  );
  process.exit(0);
}

mkdirSync(dirname(OUT_SITE), { recursive: true });
writeFileSync(OUT_SITE, siteFile, "utf8");
rmOwnedDir(OUT_SNIPPETS, { owner: "build-demo-snippets", owns: files.map(([rel]) => rel) });
for (const flavour of ["react", "next"]) mkdirSync(join(OUT_SNIPPETS, flavour), { recursive: true });
for (const [rel, content] of files) writeFileSync(join(OUT_SNIPPETS, rel), content, "utf8");
writeOwnedManifest(OUT_SNIPPETS, "build-demo-snippets", files.map(([rel]) => rel));

/**
 * A collapsed set is a failure, not a pass.
 *
 * Everything above prunes: a section without a button, a snippet that will not
 * compile. Pruning is normal, and pruning EVERYTHING is the failure this gate
 * exists to catch — it has no floor of its own, so a run that emitted 35 of 626
 * rewrote the record down to 35 and printed a tick. The floor is a fraction of
 * the recorded count rather than the count itself, so ordinary churn passes and
 * a collapse cannot.
 */
const SNIPPET_FLOOR = 590;
if (emitted < SNIPPET_FLOOR) {
  process.stderr.write(
    `✗ only ${emitted} snippet(s) survived, against a floor of ${SNIPPET_FLOOR}.\n` +
      `  ${skipped.length} section(s) were dropped. A drop this size is a broken input, not churn —\n` +
      "  check that dist/ holds the library build and not the site.\n",
  );
  const byReason = new Map();
  for (const s of skipped) {
    const key = s.reason.replace(/`[^`]+`/g, "`…`");
    byReason.set(key, (byReason.get(key) ?? 0) + 1);
  }
  for (const [reason, n] of [...byReason.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5)) {
    process.stderr.write(`    ${String(n).padStart(4)}  ${reason}\n`);
  }
  process.exit(1);
}

process.stdout.write(`✓ ${emitted} snippet(s) from ${considered} demo section(s) across ${pages.length} pages\n`);
process.stdout.write(`  ${skipped.length} section(s) carry no copy button\n`);
const byReason = new Map();
for (const s of skipped) {
  const key = s.reason.replace(/`[^`]+`/g, "`…`");
  byReason.set(key, (byReason.get(key) ?? 0) + 1);
}
for (const [reason, n] of [...byReason.entries()].sort((a, b) => b[1] - a[1])) {
  process.stdout.write(`    ${String(n).padStart(4)}  ${reason}\n`);
}
if (droppedKeys.length) {
  const tally = new Map();
  droppedKeys.forEach((k) => tally.set(k, (tally.get(k) ?? 0) + 1));
  process.stdout.write(`\n  ${tally.size} \`classes\` key(s) the components do not have, dropped from the snippets:\n`);
  for (const [k, n] of [...tally.entries()].sort((a, b) => b[1] - a[1])) {
    process.stdout.write(`    ${String(n).padStart(4)}  ${k}\n`);
  }
  process.stdout.write("  These are dead styling on the demo pages themselves — they render nothing there either.\n");
}
writeFileSync(
  join(root, "src/pages/demo/generated/demoSnippets.skipped.json"),
  `${JSON.stringify({ sections: skipped, droppedClassesKeys: [...new Set(droppedKeys)].sort() }, null, 2)}\n`,
  "utf8",
);
