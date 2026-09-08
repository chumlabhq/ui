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
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const CHECK = process.argv.includes("--check");
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
  const keys = Object.keys(schema.properties?.classes?.properties ?? {});
  if (keys.length) CLASSES_KEYS.set(dir, new Set(keys));
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
    if (ts.isAsExpression(n) || ts.isSatisfiesExpression?.(n)) { use(n.expression); return; }
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
    // Only the identifier. `\bdark\b` also matched the `dark` in `dark:bg-cl-bg`
    // and turned 168 Tailwind variant classes into `false:bg-cl-bg` — still
    // valid TypeScript, which is why the typecheck gate could not see it.
    return out.replace(/(?<![\w:-])dark(?![\w:-])/g, "false");
  };

  let code = resolvePageScope(dedent(bodyText));
  for (let i = 0; i < inlined.length; i += 1) inlined[i] = resolvePageScope(inlined[i]);
  for (let i = 0; i < hoisted.length; i += 1) hoisted[i] = resolvePageScope(hoisted[i]);
  if (missingKey) return { reason: `page styling \`c.${missingKey}\` could not be resolved` };

  code = stripUnknownClassesKeys(code, componentName);

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
  const inner = single ? code : `<>\n${code.split("\n").map((l) => (l ? `  ${l}` : l)).join("\n")}\n</>`;
  const bodyLines = [...hoisted.map((h) => `  const ${h};`), `  return (`, ...inner.split("\n").map((l) => `    ${l}`), `  );`];
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
  if (!existsSync(join(root, "dist"))) {
    process.stderr.write("✗ dist/ is missing — run `npm run build:lib` first.\n");
    process.exit(1);
  }
  const paths = {};
  for (const [key, target] of Object.entries(pkg.exports)) {
    const types = typeof target === "string" ? null : target.import?.types ?? target.types ?? null;
    if (types) paths[key.replace(/^\./, "@chumlab/ui")] = [types];
  }

  // Written where they will finally live, and checked there. Checking copies
  // under flattened names in a temp directory meant the compiler's paths did
  // not match the ones being pruned, so 78 failing snippets survived the filter
  // and only the standalone gate saw them.
  rmSync(OUT_SNIPPETS, { recursive: true, force: true });
  for (const flavour of ["react", "next"]) mkdirSync(join(OUT_SNIPPETS, flavour), { recursive: true });
  for (const [rel, content] of entries) writeFileSync(join(OUT_SNIPPETS, rel), content, "utf8");

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


if (CHECK) {
  const drifted = [];
  if (!compare(OUT_SITE, siteFile)) drifted.push(OUT_SITE);
  for (const [rel, content] of files) if (!compare(join(OUT_SNIPPETS, rel), content)) drifted.push(join(OUT_SNIPPETS, rel));
  if (drifted.length) {
    process.stderr.write(`✗ demo snippets drifted from the pages (${drifted.length} file(s)). Run: node scripts/build-demo-snippets.mjs\n`);
    process.exit(1);
  }
  process.stdout.write(`✓ demo snippets in step: ${emitted} of ${considered} sections\n`);
  process.exit(0);
}

mkdirSync(dirname(OUT_SITE), { recursive: true });
writeFileSync(OUT_SITE, siteFile, "utf8");
rmSync(OUT_SNIPPETS, { recursive: true, force: true });
for (const flavour of ["react", "next"]) mkdirSync(join(OUT_SNIPPETS, flavour), { recursive: true });
for (const [rel, content] of files) writeFileSync(join(OUT_SNIPPETS, rel), content, "utf8");

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
