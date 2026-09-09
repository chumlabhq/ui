// One source for the component pages.
//
// The site's pages were demos with hand-written prop tables beside them: 1595
// `<PropRow>`s, of which 263 named neither a prop, a `classes` slot nor a data
// attribute, and 223 real props had no row at all. The .ai.md files do not
// drift like that — `All Props` is generated from the schema and
// `doc-truth.contract` fails on a prop the type does not have — so the pages
// read from the same place now rather than from a second copy.
//
// What it emits:
//   src/pages/demo/generated/componentDocs.ts   the site's four doc sections
//   scripts/consumers/_app/snippets/{react,next}/*.tsx   the copy-paste code,
//                                               compiled by the consumer matrix
//
// Sources, per component:
//   <Name>.schema.json          props and sub-component props (API reference)
//   <NAME>.ai.md  Basic Usage   the copy-paste snippet, and the anatomy derived
//                               from its element tree
//   <NAME>.ai.md  Accessibility  the accessibility notes
//   <NAME>.ai.md  Keyboard Interactions  the key table
//
// Anatomy is derived rather than written: it is the Basic Usage example's tree
// of library tags with attributes and text removed, so it cannot describe a
// composition the example does not actually use.
//
//   node scripts/build-component-docs.mjs           write
//   node scripts/build-component-docs.mjs --check   fail if the output drifted
import { readFileSync, writeFileSync, existsSync, mkdirSync, rmSync, readdirSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const CHECK = process.argv.includes("--check");
const SELF_CHECK = process.argv.includes("--self-check");
const RECORD_SECTIONS = process.argv.includes("--record-sections");
const SRC = join(root, "src/components");
const OUT_SITE = join(root, "src/pages/demo/generated/componentDocs.ts");
const OUT_SNIPPETS = join(root, "scripts/consumers/_app/snippets");

const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
const index = JSON.parse(readFileSync(join(root, "ai/component-index.json"), "utf8"));
const COMPONENTS = index.components.map((c) => c.name);

const kebab = (name) => name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

/** The public subpath, matched on the component's own name rather than on the
 *  first export that points into its directory — `phone-validators` lives in
 *  InternationalPhoneInput's folder and is a different entry. */
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

const aiPath = (name) => join(SRC, name, `${name.toUpperCase()}.ai.md`);

function section(text, heading) {
  const parts = text.split(/^## /m);
  const found = parts.find((s) => s.startsWith(heading));
  return found ? found.slice(found.indexOf("\n") + 1).trim() : null;
}

/** ── the copy-paste snippet ───────────────────────────────────────────── */

function basicUsage(name) {
  const body = section(readFileSync(aiPath(name), "utf8"), "Basic Usage");
  if (!body) return null;
  const fence = /```tsx\n([\s\S]*?)```/.exec(body);
  return fence ? fence[1].trimEnd() : null;
}

/**
 * Whether the consumer's own file needs `"use client"`.
 *
 * Not "is this component interactive": every one of the thirty entries already
 * ships the directive, propagated up the import graph by the build (see
 * `useClientDirective` in vite.config.ts), so importing one never obliges the
 * consumer to declare a boundary. What obliges them is their own code — a
 * hook or an event handler in the file they paste.
 */
function needsClientBoundary(code) {
  const sf = ts.createSourceFile("s.tsx", code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  let needs = false;
  const visit = (node) => {
    if (needs) return;
    if (ts.isCallExpression(node) && /^use[A-Z]/.test(node.expression.getText(sf))) needs = true;
    if (ts.isJsxAttribute(node) && /^on[A-Z]/.test(node.name.getText(sf))) needs = true;
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return needs;
}

/** ── anatomy, from the example's element tree ─────────────────────────── */

function anatomyOf(code, tags) {
  const sf = ts.createSourceFile("s.tsx", code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const roots = [];

  const collect = (node, into) => {
    let target = into;
    const element =
      ts.isJsxElement(node) ? node.openingElement : ts.isJsxSelfClosingElement(node) ? node : null;
    if (element) {
      const tag = element.tagName.getText(sf);
      if (tags.has(tag)) {
        const entry = { tag, children: [] };
        into.push(entry);
        target = entry.children;
      }
    }
    ts.forEachChild(node, (child) => collect(child, target));
  };
  collect(sf, roots);

  // Repeated siblings are one line: three <AccordionItem>s in an example are
  // one part in an anatomy.
  const dedupe = (nodes) => {
    const seen = new Map();
    for (const node of nodes) {
      const existing = seen.get(node.tag);
      if (existing) existing.children.push(...node.children);
      else seen.set(node.tag, { ...node, children: [...node.children] });
    }
    return [...seen.values()].map((n) => ({ ...n, children: dedupe(n.children) }));
  };

  const render = (nodes, depth = 0) =>
    nodes.flatMap((node) => {
      const pad = "  ".repeat(depth);
      if (node.children.length === 0) return [`${pad}<${node.tag} />`];
      return [`${pad}<${node.tag}>`, ...render(node.children, depth + 1), `${pad}</${node.tag}>`];
    });

  const tree = dedupe(roots);
  return tree.length ? render(tree).join("\n") : null;
}

/** Every tag a component's entry exports as a value, which is what an example
 *  can render and therefore what an anatomy may name. */
function tagsOf(name) {
  const tags = new Set([name]);
  const file = join(SRC, name, "index.ts");
  if (!existsSync(file)) return tags;
  const sf = ts.createSourceFile(file, readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true);
  const visit = (node) => {
    if (ts.isExportDeclaration(node) && node.exportClause && ts.isNamedExports(node.exportClause) && !node.isTypeOnly) {
      for (const el of node.exportClause.elements) {
        if (el.isTypeOnly) continue;
        const n = el.name.text;
        if (/^[A-Z]/.test(n) && !/^[A-Z0-9_]+$/.test(n)) tags.add(n);
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return tags;
}

/** ── the API reference, from the schema ───────────────────────────────── */

/**
 * `| undefined` is what the required column already says, and carrying it in
 * the type made one prop render two ways: `unstyled` was `boolean` on a root
 * and `boolean | undefined` on a sub-component, for no difference a reader
 * could act on.
 */
const dropUndefined = (type) =>
  type
    .split("|")
    .map((part) => part.trim())
    .filter((part) => part !== "undefined")
    .join(" | ") || type;

function renderType(schema) {
  // The types carry a name where JSON Schema only has "object".
  if (schema["x-tsType"]) return dropUndefined(schema["x-tsType"]);
  if (!schema) return "—";
  if (schema.enum) return schema.enum.map((v) => JSON.stringify(v)).join(" | ");
  if (schema.const !== undefined) return JSON.stringify(schema.const);
  if (schema.oneOf) {
    const parts = schema.oneOf.map(renderType).filter((t) => t !== "—");
    return parts.length ? [...new Set(parts)].join(" | ") : "—";
  }
  if (Array.isArray(schema.type)) return schema.type.join(" | ");
  return schema.type ?? "—";
}

/**
 * ARIA attributes are not rows.
 *
 * Six of them had rows — `aria-label`, `aria-live`, `aria-describedby`,
 * `aria-labelledby`, `aria-busy`, `aria-valuetext` — purely because those
 * components happened to declare them explicitly, while every component
 * forwards the whole set. A table that lists six of fifty teaches a reader that
 * `aria-label` is supported and `aria-pressed` is not, which is false. The
 * forwarding is stated once per component instead.
 */
const isAriaAttribute = (prop) => /^aria-/.test(prop);

function propsFrom(properties = {}, required = []) {
  const req = new Set(required);
  return Object.entries(properties)
    .filter(([prop]) => !isAriaAttribute(prop))
    .map(([prop, value]) => ({
    name: prop,
    type: dropUndefined(renderType(value)),
    required: req.has(prop),
    default:
      value.default !== undefined
        ? JSON.stringify(value.default)
        : (value["x-defaultSource"] ?? null),
    description: (value.description ?? "").replace(/\s*\n\s*/g, " ").trim(),
  }));
}

/** ── accessibility and keyboard, from the prose ───────────────────────── */

function accessibilityOf(name) {
  const body = section(readFileSync(aiPath(name), "utf8"), "Accessibility");
  if (!body) return [];
  return body
    .split(/\n(?=- )/)
    .map((line) => line.replace(/^- /, "").replace(/\s*\n\s*/g, " ").replace(/-{3,}$/, "").trim())
    .filter((line) => line && !line.startsWith("|") && !line.startsWith("```"));
}

function keyboardOf(name) {
  const body = section(readFileSync(aiPath(name), "utf8"), "Keyboard Interactions");
  if (!body) return null;

  // Cells first, then decide what each row is. The previous version tried to
  // skip the `| Key | Behaviour |` header with a `(?!Key\b)` lookahead placed
  // after `\s*`, and `\s*` backtracks to zero length — which moves the lookahead
  // to the space BEFORE `Key`, where it passes. Every one of the 28 tables
  // carried its own header as its first data row. The separator was dropped
  // correctly, because there is no whitespace in front of `-` to backtrack
  // through, so only the header survived. Judging a trimmed cell cannot fail
  // that way.
  const cells = (line) =>
    line
      .replace(/^\||\|\s*$/g, "")
      .split(/(?<!\\)\|/)
      .map((c) => c.replace(/\\\|/g, "|").trim());

  const rows = body
    .split("\n")
    .filter((l) => /^\s*\|/.test(l))
    .map((l) => cells(l.trim()))
    .filter((c) => c.length === 2 && c[0])
    .filter((c) => !c.every((x) => /^:?-{2,}:?$/.test(x)))
    .filter((c) => !(/^keys?$/i.test(c[0]) && /^(behaviour|behavior|action|description)$/i.test(c[1])))
    .map(([keys, description]) => ({ keys, description }));

  const note = body.split(/\n\|/)[0].trim();
  return { note: note.startsWith("|") ? "" : note, rows };
}

/** ── the three reference tables, derived from the source ──────────────── */

const walkSource = (dir) =>
  existsSync(dir)
    ? readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const path = join(dir, entry.name);
        if (entry.isDirectory()) return path.includes("__tests__") ? [] : walkSource(path);
        return /\.tsx?$/.test(entry.name) && !path.includes("__tests__") ? [path] : [];
      })
    : [];

const parse = (file) =>
  ts.createSourceFile(
    file,
    readFileSync(file, "utf8"),
    ts.ScriptTarget.Latest,
    true,
    /\.tsx$/.test(file) ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );

/** The JSDoc text on a declaration, as one line, or "". */
function docOf(node) {
  const jsDoc = node.jsDoc?.[node.jsDoc.length - 1];
  const comment = jsDoc?.comment;
  const text = typeof comment === "string" ? comment : (comment ?? []).map((c) => c.text).join("");
  return text.replace(/\s*\n\s*/g, " ").trim();
}

function membersOf(decl, sf) {
  const members = ts.isInterfaceDeclaration(decl)
    ? decl.members
    : ts.isTypeLiteralNode(decl.type ?? {})
      ? decl.type.members
      : [];
  return [...members]
    .filter((m) => m.name)
    .map((m) => ({
      name: m.name.getText(sf).replace(/^["']|["']$/g, ""),
      type: m.type ? m.type.getText(sf).replace(/\s*\n\s*/g, " ") : "unknown",
      required: !m.questionToken,
      description: docOf(m),
    }));
}

/**
 * Every `*Classes` interface a component declares.
 *
 * The same derivation `doc-truth.contract` reads its key names from, with the
 * JSDoc on each key carried through — so a slot's description lives on the type
 * that owns it rather than in a table beside it. A key with no JSDoc renders
 * with an empty description, which is the honest state and says where to fix it.
 */
function classesOf(name) {
  const maps = [];
  for (const file of walkSource(join(SRC, name))) {
    if (!/types\.tsx?$/.test(file)) continue;
    const sf = parse(file);
    ts.forEachChild(sf, (node) => {
      if (!ts.isInterfaceDeclaration(node) || !/Classes$/.test(node.name.text)) return;
      maps.push({ map: node.name.text, keys: membersOf(node, sf) });
    });
  }
  return maps.sort((a, b) => a.map.localeCompare(b.map));
}

/**
 * The data shapes a consumer has to build: an exported interface or type alias
 * a prop's own type names, which is not a props bag and not a class map.
 *
 * Reached by name from the props rather than listed: `Tab` is documentation
 * because `tabs: Tab[]` asks for one, and `DropdownTriggerRenderProps` is not
 * because nothing takes it as input.
 *
 * The names come from the TypeScript props interfaces, not from the schema:
 * the schema renders `tabs: Tab[]` as `array`, so nothing there says `Tab`.
 */
function shapesOf(name) {
  const declared = new Map();
  for (const file of walkSource(join(SRC, name))) {
    const sf = parse(file);
    ts.forEachChild(sf, (node) => {
      const isExported = node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword);
      if (!isExported) return;
      if (ts.isInterfaceDeclaration(node)) declared.set(node.name.text, { node, sf });
      else if (ts.isTypeAliasDeclaration(node) && ts.isTypeLiteralNode(node.type))
        declared.set(node.name.text, { node, sf });
    });
  }

  const namesIn = (value) => {
    const text = typeof value === "string" ? value : "";
    const out = [];
    for (const m of text.matchAll(/\b([A-Z][A-Za-z0-9]*)\b/g)) {
      if (/Props$|Classes$/.test(m[1])) continue;
      if (declared.has(m[1])) out.push(m[1]);
    }
    return out;
  };

  const wanted = new Set();
  for (const file of walkSource(join(SRC, name))) {
    const sf = parse(file);
    ts.forEachChild(sf, (node) => {
      // The props bags a consumer fills in.
      if (
        (ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)) &&
        /Props$/.test(node.name.text)
      ) {
        for (const tag of namesIn(node.getText(sf))) wanted.add(tag);
      }
      // What an exported hook hands back — `useToast()` returns the object the
      // "useToast Methods" table used to describe by hand.
      const decl = ts.isVariableStatement(node) ? node.declarationList.declarations[0] : node;
      const isHook =
        decl?.name &&
        /^use[A-Z]/.test(decl.name.getText?.(sf) ?? "") &&
        node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword);
      if (isHook) {
        const returns =
          decl.type?.getText(sf) ??
          (ts.isVariableDeclaration(decl) && decl.initializer?.type?.getText?.(sf)) ??
          "";
        for (const tag of namesIn(returns)) wanted.add(tag);
      }
    });
  }

  // A shape can name another — `Step.tooltip` is a `StepTooltipConfig` — so
  // follow the references until nothing new appears.
  for (let added = true; added; ) {
    added = false;
    for (const tag of [...wanted]) {
      const entry = declared.get(tag);
      for (const next of namesIn(entry.node.getText(entry.sf))) {
        if (!wanted.has(next)) {
          wanted.add(next);
          added = true;
        }
      }
    }
  }

  // Public is the same test doc-truth uses: re-exported from the component's
  // own entry. An internal helper type a prop happens to name is the
  // component's business, not the consumer's.
  const entryFile = join(SRC, name, "index.ts");
  const entry = existsSync(entryFile) ? readFileSync(entryFile, "utf8") : "";

  return [...wanted]
    .filter((tag) => new RegExp(`\\b${tag}\\b`).test(entry))
    .sort()
    .map((tag) => {
      const { node, sf } = declared.get(tag);
      return { name: tag, description: docOf(node), members: membersOf(node, sf) };
    })
    .filter((shape) => shape.members.length > 0);
}

/**
 * Every `data-*` attribute the component renders, and when.
 *
 * Read off the JSX rather than out of a record: `002-state-attribute-catalogue`
 * classifies the eighty-six attribute NAMES the library emits, which is a
 * different question from which of them this component puts on the page. The
 * two emission shapes carry their own answer — `x || undefined` is present
 * while `x` holds, and a ternary of two literals is an enumerated value — and
 * anything else reports as always present rather than being guessed at.
 */
function dataAttributesOf(name) {
  const found = new Map();
  for (const file of walkSource(join(SRC, name))) {
    if (!/\.tsx$/.test(file)) continue;
    const sf = parse(file);
    const visit = (node) => {
      if (ts.isJsxAttribute(node) && /^data-/.test(node.name.getText(sf))) {
        const attribute = node.name.getText(sf);
        const init = node.initializer;
        let values = [];
        let when = "always";
        if (init && ts.isJsxExpression(init) && init.expression) {
          const expr = init.expression;
          if (ts.isConditionalExpression(expr)) {
            const whenTrue = expr.whenTrue.getText(sf);
            const whenFalse = expr.whenFalse.getText(sf);
            const literals = [whenTrue, whenFalse].filter((t) => /^["'].*["']$/.test(t));
            if (literals.length === 2) values = literals.map((t) => t.slice(1, -1));
            else if (whenFalse === "undefined") when = `when ${expr.condition.getText(sf)}`;
          } else if (
            ts.isBinaryExpression(expr) &&
            expr.operatorToken.kind === ts.SyntaxKind.BarBarToken &&
            expr.right.getText(sf) === "undefined"
          ) {
            when = `when ${expr.left.getText(sf)}`;
          }
        } else if (init && ts.isStringLiteral(init)) {
          values = [init.text];
        }
        const existing = found.get(attribute);
        const merged = {
          name: attribute,
          values: [...new Set([...(existing?.values ?? []), ...values])].sort(),
          when: existing && existing.when !== when ? "varies" : when,
        };
        found.set(attribute, merged);
      }
      ts.forEachChild(node, visit);
    };
    visit(sf);
  }
  return [...found.values()].sort((a, b) => a.name.localeCompare(b.name));
}

/** CSS custom properties the component sets on its own elements. */
function cssVariablesOf(name) {
  const found = new Set();
  for (const file of walkSource(join(SRC, name))) {
    for (const m of readFileSync(file, "utf8").matchAll(/["'](--[a-z][a-z0-9-]*)["']\s*:/g)) {
      found.add(m[1]);
    }
  }
  return [...found].sort();
}

/** ── assembly ─────────────────────────────────────────────────────────── */

const docs = [];
const problems = [];

for (const name of COMPONENTS) {
  if (!existsSync(aiPath(name))) {
    problems.push(`${name}: no ${name.toUpperCase()}.ai.md`);
    continue;
  }
  const subpath = subpathOf(name);
  if (!subpath) problems.push(`${name}: no public subpath in package.json exports`);

  const schemaPath = join(SRC, name, `${name}.schema.json`);
  const schema = existsSync(schemaPath) ? JSON.parse(readFileSync(schemaPath, "utf8")) : {};
  const text = readFileSync(aiPath(name), "utf8");
  const summary = (/^>\s*(.+)$/m.exec(text)?.[1] ?? schema.description ?? "").trim();

  const code = basicUsage(name);
  if (!code) problems.push(`${name}: no Basic Usage tsx block`);

  const anatomy = code ? anatomyOf(code, tagsOf(name)) : null;
  if (!anatomy) problems.push(`${name}: the Basic Usage example renders no library tag`);

  const keyboard = keyboardOf(name);
  if (!keyboard) problems.push(`${name}: no "## Keyboard Interactions" section`);

  /**
   * A `oneOf` schema documents its props in branches, not at the root.
   *
   * Four components are shaped that way — Accordion, BrandLogo, Loader and
   * RadioButton — and reading only `schema.properties` showed the site an
   * empty API table for the two that have no flat root: `RadioButton`'s own
   * nine props, `classes` among them, were documented in the schema and
   * displayed nowhere. The branch named for the component is its root; any
   * other branch is a component in its own right, so it joins the
   * sub-component tables unless one is already there.
   */
  const branches = schema.oneOf ?? [];
  const ownBranch = branches.find((b) => b.title === name);
  const props = propsFrom(
    { ...(ownBranch?.properties ?? {}), ...(schema.properties ?? {}) },
    [...(ownBranch?.required ?? []), ...(schema.required ?? [])],
  );
  const subComponents = Object.entries(schema.subComponents ?? {}).map(([tag, sub]) => ({
    name: tag,
    props: propsFrom(sub.properties, sub.required),
  }));
  for (const branch of branches) {
    if (!branch.title || branch.title === name) continue;
    if (subComponents.some((sc) => sc.name === branch.title)) continue;
    subComponents.push({ name: branch.title, props: propsFrom(branch.properties, branch.required) });
  }

  docs.push({
    name,
    subpath,
    summary,
    anatomy,
    props,
    subComponents,
    classes: classesOf(name),
    shapes: shapesOf(name),
    dataAttributes: dataAttributesOf(name),
    cssVariables: cssVariablesOf(name),
    accessibility: accessibilityOf(name),
    keyboard,
    snippets: code
      ? {
          react: code,
          next: needsClientBoundary(code) ? `"use client";\n\n${code}` : code,
          needsClientBoundary: needsClientBoundary(code),
        }
      : null,
  });
}

/** ── output ───────────────────────────────────────────────────────────── */

const siteFile = `// GENERATED by scripts/build-component-docs.mjs — do not edit.
//
// The component pages' Anatomy, API Reference, Accessibility and Keyboard
// Interactions, plus the copy-paste snippets, read out of the same schemas and
// .ai.md files that \`doc-truth.contract\` gates. Editing this file by hand puts
// the site back where it was: a second copy that drifts.
//
// Regenerate: node scripts/build-component-docs.mjs

export interface PropDoc {
  name: string;
  type: string;
  required: boolean;
  default: string | null;
  description: string;
}

export interface KeyboardRow {
  keys: string;
  description: string;
}

export interface MemberDoc {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

export interface DataAttributeDoc {
  name: string;
  /** The literal values it takes, when the source enumerates them. */
  values: string[];
  /** \`always\`, \`when <expression>\`, or \`varies\` where sites disagree. */
  when: string;
}

export interface ComponentDoc {
  name: string;
  subpath: string;
  summary: string;
  anatomy: string;
  props: PropDoc[];
  subComponents: { name: string; props: PropDoc[] }[];
  classes: { map: string; keys: MemberDoc[] }[];
  shapes: { name: string; description: string; members: MemberDoc[] }[];
  dataAttributes: DataAttributeDoc[];
  cssVariables: string[];
  accessibility: string[];
  keyboard: { note: string; rows: KeyboardRow[] } | null;
  snippets: { react: string; next: string; needsClientBoundary: boolean } | null;
}

export const COMPONENT_DOCS: Record<string, ComponentDoc> = ${JSON.stringify(
  Object.fromEntries(docs.map((d) => [d.name, d])),
  null,
  2,
)};

export const documentedComponents = Object.keys(COMPONENT_DOCS);
`;

const snippetFiles = new Map();
for (const doc of docs) {
  if (!doc.snippets) continue;
  snippetFiles.set(`react/${doc.name}.tsx`, `${doc.snippets.react}\n`);
  snippetFiles.set(`next/${doc.name}.tsx`, `${doc.snippets.next}\n`);
}
// An index per flavour so the bundler compiles them, not only tsc.
for (const flavour of ["react", "next"]) {
  const names = docs.filter((d) => d.snippets).map((d) => d.name);
  snippetFiles.set(
    `${flavour}/index.ts`,
    `// GENERATED by scripts/build-component-docs.mjs — do not edit.\n` +
      `// Every copy-paste snippet the site offers, so the matrix compiles them.\n` +
      // Extensionless, unlike the repo's own imports: this file is scaffolded
      // into consumer apps, and Next resolves "./Accordion.js" literally
      // rather than mapping it to the .tsx the way tsc does.
      names.map((n) => `export { default as ${n} } from "./${n}";`).join("\n") +
      `\n`,
  );
}

function compare(path, content) {
  const existing = existsSync(path) ? readFileSync(path, "utf8") : null;
  if (existing === content) return true;
  if (CHECK) return false;
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content, "utf8");
  return true;
}

let drifted = [];
if (!compare(OUT_SITE, siteFile)) drifted.push(OUT_SITE);
for (const [rel, content] of snippetFiles) {
  if (!compare(join(OUT_SNIPPETS, rel), content)) drifted.push(join(OUT_SNIPPETS, rel));
}
if (!CHECK) {
  // A component that loses its snippet must lose its file too.
  for (const flavour of ["react", "next"]) {
    const dir = join(OUT_SNIPPETS, flavour);
    if (!existsSync(dir)) continue;
    for (const file of readdirSync(dir)) {
      if (!snippetFiles.has(`${flavour}/${file}`)) rmSync(join(dir, file));
    }
  }
}


/** ── what `--check` asserts beyond "the output matches its source" ───────
 *
 * `--check` regenerated the file and diffed it, so every defect that lived in
 * the source was reproduced faithfully and reported as being in step. It
 * passed on all seven of these:
 *
 *   1  32 hand-written Accessibility sections beside the generated one
 *   2  28 keyboard tables carrying their own header as row 1
 *   3  markdown that reached the page as literal asterisks and backticks
 *   4  internal rule numbers and ADR citations in the shipped types
 *   5  158 props showing "-" for a default the source defines
 *   6  one prop rendering two ways, and six of fifty ARIA attributes as rows
 *   7  RTL claims days after RTL was recorded unsupported
 *   8  (a section silently disappearing — a guard, not something observed)
 */

const SECTION_RECORD = join(root, "docs/adr/002-doc-sections.json");
const GENERATED_SECTION_TITLES = [
  "Anatomy", "API Reference", "Class overrides", "Data attributes", "Types",
  "CSS custom properties", "Accessibility", "Keyboard Interactions",
  "Copy and paste", "Setup",
];
const INTERNAL_VOCABULARY =
  /\bADR\b|\bR\d+\b|precedent ledger|ancestor clause|migration table|part selector|waived key|\bNOVEL\b|\bVERIFIED\b|src\/__tests__|\.contract\b/;
/** What `Inline` renders. Anything else is markdown the reader will see raw. */
const RENDERED_MARKDOWN = /\*\*[^*]+\*\*|`[^`]+`/g;

/** The section set each component is expected to carry. */
const sectionsOf = (doc) => [
  "Anatomy",
  ...(doc.props.length || doc.subComponents.length ? ["API Reference"] : []),
  ...(doc.classes.length ? ["Class overrides"] : []),
  ...(doc.dataAttributes.length ? ["Data attributes"] : []),
  ...(doc.shapes.length ? ["Types"] : []),
  ...(doc.cssVariables.length ? ["CSS custom properties"] : []),
  ...(doc.accessibility.length ? ["Accessibility"] : []),
  ...(doc.keyboard ? ["Keyboard Interactions"] : []),
];

/** Every description a reader sees, labelled by where it is. */
const everyText = (doc) => {
  const out = [];
  for (const p of doc.props) out.push([`prop ${p.name}`, p.description]);
  for (const sc of doc.subComponents)
    for (const p of sc.props) out.push([`${sc.name}.${p.name}`, p.description]);
  for (const c of doc.classes)
    for (const k of c.keys) out.push([`${c.map}.${k.name}`, k.description]);
  for (const sh of doc.shapes) {
    out.push([`shape ${sh.name}`, sh.description]);
    for (const m of sh.members) out.push([`${sh.name}.${m.name}`, m.description]);
  }
  for (const a of doc.accessibility) out.push(["accessibility", a]);
  if (doc.keyboard) {
    out.push(["keyboard note", doc.keyboard.note]);
    for (const r of doc.keyboard.rows) out.push([`keyboard ${r.keys}`, r.description]);
  }
  return out.filter(([, t]) => t);
};

/** Destructuring defaults inside the declaration named `tag`. */
function sourceDefaults(tag, files) {
  for (const file of files) {
    const sf = parse(file);
    let out = null;
    const visit = (node) => {
      const isTag =
        (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.name.text === tag) ||
        (ts.isFunctionDeclaration(node) && node.name?.text === tag);
      if (isTag) {
        const found = new Set();
        const scan = (inner) => {
          if (ts.isBindingElement(inner) && ts.isIdentifier(inner.name) && inner.initializer)
            found.add(inner.name.text);
          ts.forEachChild(inner, scan);
        };
        scan(node);
        if (found.size) { out = found; return; }
      }
      ts.forEachChild(node, visit);
    };
    visit(sf);
    if (out) return out;
  }
  return new Set();
}

function auditDocs(docs, opts = {}) {
  const found = [];
  const add = (n, where, msg) => found.push({ n, where, msg });
  const pageTitles = opts.pageTitles ?? readPageTitles();
  const rtlUnsupported = opts.rtlUnsupported ?? /RTL is not supported/i.test(
    existsSync(join(root, "RELEASE-READINESS.md"))
      ? readFileSync(join(root, "RELEASE-READINESS.md"), "utf8")
      : "",
  );
  const record = opts.record ?? (existsSync(SECTION_RECORD)
    ? JSON.parse(readFileSync(SECTION_RECORD, "utf8"))
    : null);

  for (const doc of docs) {
    // 1. a page may not hand-write a section the generator emits
    for (const title of pageTitles.get(doc.name) ?? [])
      if (GENERATED_SECTION_TITLES.includes(title))
        add(1, doc.name, `the demo page hand-writes a "${title}" section the generator already emits`);

    // 2. a table row may not be its own header
    for (const row of doc.keyboard?.rows ?? [])
      if (/^keys?$/i.test(row.keys.trim()))
        add(2, doc.name, `the keyboard table carries its header as a data row ("${row.keys} | ${row.description}")`);

    for (const [where, text] of everyText(doc)) {
      // 3. markdown the renderer does not render
      const leftover = text.replace(RENDERED_MARKDOWN, "");
      if (/\*\*|`/.test(leftover))
        add(3, doc.name, `${where} carries markdown that will render literally: ${JSON.stringify(text.slice(0, 60))}`);

      // 4. internal vocabulary in something a consumer reads
      if (INTERNAL_VOCABULARY.test(text))
        add(4, doc.name, `${where} cites internal vocabulary: ${JSON.stringify(text.slice(0, 60))}`);

      // 7. a claim the release record contradicts
      if (rtlUnsupported && /\bfull RTL\b|\bRTL support\b|RTL-aware/i.test(text))
        add(7, doc.name, `${where} claims RTL support, which RELEASE-READINESS.md records as unsupported`);
    }

    // 5. "-" where the source defines a default
    const dir = join(SRC, doc.name);
    if (existsSync(dir)) {
      const files = walkSource(dir);
      const groups = [[doc.name, doc.props], ...doc.subComponents.map((sc) => [sc.name, sc.props])];
      for (const [tag, props] of groups) {
        const defaults = sourceDefaults(tag, files);
        for (const p of props)
          if (p.default === null && !p.required && defaults.has(p.name))
            add(5, doc.name, `${tag}.${p.name} renders "-" but the source assigns it a default`);
      }
    }

    // 6. one vocabulary for types, and no ARIA rows.
    //
    // Not "one rendering per prop name": two components may genuinely take
    // different types for a `size`, and flagging that would be noise. What made
    // one prop render two ways was a vocabulary split — root rows came from the
    // JSON schema and said `object`, sub-component rows came from the types and
    // said `ReactNode` — plus a `| undefined` the required column already
    // carries. Both are objective and neither fires on a real difference.
    const groups = [["", doc.props], ...doc.subComponents.map((sc) => [sc.name, sc.props])];
    for (const [sub, props] of groups)
      for (const p of props) {
        const at = `${sub ? sub + "." : ""}${p.name}`;
        if (/^aria-/.test(p.name)) add(6, doc.name, `${at} is documented as a prop row`);
        if (p.type === "object")
          add(6, doc.name, `${at} renders as "object" — a JSON-Schema word that names nothing a reader can import`);
        // Only a top-level `| undefined`, which is what the renderer strips.
        // A nested one inside a function or component type is part of that
        // type's own shape and is not this rule's business.
        if (dropUndefined(p.type) !== p.type)
          add(6, doc.name, `${at} renders "${p.type}"; the required column already says it is optional`);
      }

    // 8. a section the record says this component carries has gone
    if (record?.[doc.name]) {
      const now = new Set(sectionsOf(doc));
      for (const section of record[doc.name])
        if (!now.has(section)) add(8, doc.name, `has lost its "${section}" section`);
    }
  }

  return found;
}

/** Hand-written `<Section title="...">` titles, per demo page. */
function readPageTitles() {
  const titles = new Map();
  const dir = join(root, "src/pages/demo");
  if (!existsSync(dir)) return titles;
  for (const file of readdirSync(dir)) {
    const m = /^(.+)Demo\.tsx$/.exec(file);
    if (!m) continue;
    const text = readFileSync(join(dir, file), "utf8");
    titles.set(m[1], [...text.matchAll(/title="([^"]+)"/g)].map((x) => x[1]));
  }
  return titles;
}


/**
 * Each assertion, shown failing on a planted violation. A rule that stops
 * matching reports nothing, which reads exactly like a clean run — and this
 * whole audit exists because a check that only diffed its own output read
 * exactly like a clean run for seven real defects.
 */
function auditSelfCheck() {
  const base = {
    name: "Planted", subpath: "@chumlab/ui/planted", summary: "", anatomy: "",
    props: [], subComponents: [], classes: [], shapes: [], dataAttributes: [],
    cssVariables: [], accessibility: [], keyboard: null, snippets: null,
  };
  const run = (doc, opts) =>
    new Set(auditDocs([{ ...base, ...doc }], { pageTitles: new Map(), rtlUnsupported: true, record: null, ...opts }).map((f) => f.n));

  const bit = new Set();
  for (const n of run({}, { pageTitles: new Map([["Planted", ["Accessibility"]]]) })) bit.add(n);
  for (const n of run({ keyboard: { note: "", rows: [{ keys: "Key", description: "Behaviour" }] } })) bit.add(n);
  for (const n of run({ accessibility: ["a *lone* asterisk and an unclosed ` backtick"] })) bit.add(n);
  for (const n of run({ accessibility: ["ADR 002 R9 ancestor clause"] })) bit.add(n);
  for (const n of run({ props: [{ name: "aria-label", type: "string", required: false, default: null, description: "x" }] })) bit.add(n);
  for (const n of run({ accessibility: ["Full RTL support with reversed keyboard navigation"] })) bit.add(n);
  for (const n of run({}, { record: { Planted: ["Anatomy", "Keyboard Interactions"] } })) bit.add(n);
  // 5 needs a real component: Accordion's own source assigns `loop`.
  const five = auditDocs(
    [{ ...base, name: "Accordion", props: [{ name: "loop", type: "boolean", required: false, default: null, description: "x" }] }],
    { pageTitles: new Map(), rtlUnsupported: true, record: null },
  ).map((f) => f.n);
  for (const n of five) bit.add(n);

  const missed = [1, 2, 3, 4, 5, 6, 7, 8].filter((n) => !bit.has(n));
  if (missed.length) {
    console.error(`✗ self-check: assertion(s) ${missed.join(", ")} did not fire on a planted violation`);
    process.exit(1);
  }
  console.log("✓ self-check: all eight assertions bite");
}

if (RECORD_SECTIONS) {
  const record = Object.fromEntries(docs.map((d) => [d.name, sectionsOf(d)]));
  writeFileSync(SECTION_RECORD, `${JSON.stringify(record, null, 2)}\n`, "utf8");
  console.log(`✓ recorded the section set for ${docs.length} component(s)`);
}

if (SELF_CHECK) auditSelfCheck();

const audit = auditDocs(docs);
if (audit.length) {
  const byRule = new Map();
  for (const f of audit) byRule.set(f.n, (byRule.get(f.n) ?? 0) + 1);
  console.error(`✗ ${audit.length} documentation defect(s) the generated file reproduces faithfully:`);
  for (const [n, count] of [...byRule.entries()].sort((a, b) => a[0] - b[0]))
    console.error(`    assertion ${n}: ${count}`);
  for (const f of audit.slice(0, 20)) console.error(`    [${f.n}] ${f.where}: ${f.msg}`);
  if (audit.length > 20) console.error(`    … and ${audit.length - 20} more`);
  process.exit(1);
}

if (problems.length) {
  console.error(`✗ ${problems.length} component(s) cannot be documented from their source:`);
  for (const p of problems) console.error(`    ${p}`);
  process.exit(1);
}

if (CHECK && drifted.length) {
  console.error(
    `✗ ${drifted.length} generated file(s) are out of date. Run \`node scripts/build-component-docs.mjs\`:\n` +
      drifted.map((f) => `    ${f.replace(`${root}/`, "")}`).join("\n"),
  );
  process.exit(1);
}

console.log(
  CHECK
    ? `✓ component docs in step: ${docs.length} components, ${snippetFiles.size - 2} snippets`
    : `✓ wrote docs for ${docs.length} components and ${snippetFiles.size - 2} snippets`,
);
