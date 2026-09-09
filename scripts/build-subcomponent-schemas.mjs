/**
 * Writes each component's `subComponents` schema block from its types.
 *
 * The schemas covered the root component only, so 25 sub-components the
 * package exports were documented by nothing — `AvatarGroup`, `AccordionItem`,
 * `ButtonGroup` and the rest. Hand-writing them would put 200-odd props one
 * edit away from drifting out of date, which is the defect this repo keeps
 * finding, so they are derived instead: prop names and types come from the
 * declaration, and the JSDoc comment supplies the description when there is
 * one.
 *
 *   node scripts/build-subcomponent-schemas.mjs [--check]
 */
import ts from "typescript";
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const SRC = "src/components";
const index = JSON.parse(readFileSync("ai/component-index.json", "utf8"));
const rootExports = readFileSync("src/index.ts", "utf8");
const check = process.argv.includes("--check");

const walk = (dir) =>
  readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) return walk(path);
    return /\.tsx?$/.test(entry) && !path.includes("__tests__") ? [path] : [];
  });

const names = index.components.map((c) => c.name).filter((n) => existsSync(`${SRC}/${n}/index.ts`));
const program = ts.createProgram(
  names.map((n) => `${SRC}/${n}/index.ts`),
  {
    jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler, module: ts.ModuleKind.ESNext,
    strict: true, skipLibCheck: true, esModuleInterop: true,
  },
);
const checker = program.getTypeChecker();

/** The value exports of a component's barrel that look like components. */
function exportedTags(name) {
  const idx = `${SRC}/${name}/index.ts`;
  const sf = ts.createSourceFile(idx, readFileSync(idx, "utf8"), ts.ScriptTarget.Latest, true);
  const tags = [];
  const visit = (node) => {
    if (ts.isExportDeclaration(node) && node.exportClause && ts.isNamedExports(node.exportClause) && !node.isTypeOnly) {
      for (const el of node.exportClause.elements) {
        if (el.isTypeOnly) continue;
        const t = el.name.text;
        if (/^[A-Z]/.test(t) && !/^[A-Z0-9_]+$/.test(t) && t !== name) tags.push(t);
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return tags;
}

/** Own props of `<Tag>Props`, inherited DOM attributes excluded. */
function propsOfType(typeName, files) {
  for (const file of files) {
    const sf = program.getSourceFile(file);
    if (!sf) continue;
    let found = null;
    const visit = (node) => {
      if ((ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)) && node.name.text === typeName) {
        found = node;
      }
      ts.forEachChild(node, visit);
    };
    visit(sf);
    if (!found) continue;

    const type = checker.getTypeAtLocation(found.name);
    const members = type.isUnion()
      ? [...new Map(type.types.flatMap((t) => checker.getPropertiesOfType(t)).map((s) => [s.getName(), s])).values()]
      : checker.getPropertiesOfType(type);

    const props = {};
    for (const sym of members) {
      const decl = sym.declarations?.[0];
      if (!decl) continue;
      const from = decl.getSourceFile().fileName;
      // Inherited React and DOM attributes are not this component's API.
      if (from.includes("node_modules") || from.includes("typescript/lib")) continue;
      const text = checker.typeToString(checker.getTypeOfSymbolAtLocation(sym, decl)).replace(/\s+/g, " ");
      const doc = ts.displayPartsToString(sym.getDocumentationComment(checker)).replace(/\s+/g, " ").trim();
      props[sym.getName()] = { type: text, ...(doc ? { description: doc } : {}) };
    }
    if (Object.keys(props).length) return props;
  }
  return null;
}

/**
 * `const NAME = <literal>` across a component, so a default written as
 * `animationDuration = DEFAULT_ANIMATION_DURATION` resolves to 300 rather than
 * to the identifier's name.
 */
function constantsOf(files) {
  const consts = new Map();
  for (const file of files) {
    const sf = program.getSourceFile(file);
    if (!sf) continue;
    const visit = (node) => {
      if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.initializer) {
        const value = literalOf(node.initializer);
        if (value !== undefined) consts.set(node.name.text, value);
      }
      ts.forEachChild(node, visit);
    };
    visit(sf);
  }
  return consts;
}

/** A literal's JS value, or undefined for anything that is not one. */
function literalOf(node) {
  if (ts.isAsExpression(node) || ts.isParenthesizedExpression(node)) return literalOf(node.expression);
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  if (ts.isNumericLiteral(node)) return Number(node.text);
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (node.kind === ts.SyntaxKind.NullKeyword) return null;
  // `options = []` and `classes = {}` are real defaults worth showing; a
  // non-empty literal is data rather than a default anyone should read here.
  if (ts.isArrayLiteralExpression(node) && node.elements.length === 0) return [];
  if (ts.isObjectLiteralExpression(node) && node.properties.length === 0) return {};
  if (ts.isPrefixUnaryExpression(node) && node.operator === ts.SyntaxKind.MinusToken) {
    const inner = literalOf(node.operand);
    return typeof inner === "number" ? -inner : undefined;
  }
  return undefined;
}

/**
 * The destructuring defaults in the declaration that renders `<Tag>`.
 *
 * The schemas carried no `default` for a sub-component prop at all, so all 198
 * of them rendered "-" on the component pages — 120 of which do have one in the
 * source. Read here rather than patched into the generated page, so the number
 * cannot go back out of step the next time this runs.
 */
function defaultsOfTag(tag, files, consts) {
  // A literal where there is one, otherwise the expression itself. `ChevronIcon
  // = ChevronDownIcon` and `zIndex = LAYERS.toast` have defaults a reader wants
  // to know about; rendering them as "-" says the prop has none.
  const resolve = (node, sf) => {
    const direct = literalOf(node);
    if (direct !== undefined) return { value: direct };
    if (ts.isIdentifier(node) && consts.has(node.text)) return { value: consts.get(node.text) };
    const text = node.getText(sf).replace(/\s+/g, " ").trim();
    if (!text || text.length > 32) return undefined;
    return { source: text };
  };
  for (const file of files) {
    const sf = program.getSourceFile(file);
    if (!sf) continue;
    let out = null;
    const visit = (node) => {
      const isTag =
        (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.name.text === tag) ||
        (ts.isFunctionDeclaration(node) && node.name?.text === tag);
      if (isTag) {
        const found = {};
        const destructured = new Set();
        const scan = (inner) => {
          if (ts.isBindingElement(inner) && ts.isIdentifier(inner.name)) {
            destructured.add(inner.name.text);
            if (inner.initializer) {
              const resolved = resolve(inner.initializer, sf);
              if (resolved !== undefined) found[inner.name.text] = resolved;
            }
          }
          ts.forEachChild(inner, scan);
        };
        scan(node);

        // A default resolved in the body rather than in the destructuring:
        // `const effectiveShape = shape ?? DEFAULT_SHAPE`. Only the binding
        // elements were read, so `AvatarGroup`'s `shape` and `spacing` — which
        // do have defaults — rendered "-", and hand-writing them into the
        // schema did not survive the next run of this script.
        const fallbacks = (inner) => {
          if (
            ts.isVariableDeclaration(inner) &&
            inner.initializer &&
            ts.isBinaryExpression(inner.initializer) &&
            inner.initializer.operatorToken.kind === ts.SyntaxKind.QuestionQuestionToken &&
            ts.isIdentifier(inner.initializer.left) &&
            destructured.has(inner.initializer.left.text) &&
            found[inner.initializer.left.text] === undefined
          ) {
            const resolved = resolve(inner.initializer.right, sf);
            if (resolved !== undefined) found[inner.initializer.left.text] = resolved;
          }
          ts.forEachChild(inner, fallbacks);
        };
        fallbacks(node);
        if (Object.keys(found).length) { out = found; return; }
      }
      ts.forEachChild(node, visit);
    };
    visit(sf);
    if (out) return out;
  }
  return {};
}

/** A literal goes in `default`; an expression goes in `x-defaultSource`. */
function applyDefault(value, resolved) {
  if (!resolved) return;
  if (value.default !== undefined || value["x-defaultSource"] !== undefined) return;
  if ("value" in resolved) value.default = resolved.value;
  else value["x-defaultSource"] = resolved.source;
}

let changed = 0;
const stale = [];
for (const name of names) {
  const schemaPath = `${SRC}/${name}/${name}.schema.json`;
  if (!existsSync(schemaPath)) continue;
  const files = walk(`${SRC}/${name}`);
  const consts = constantsOf(files);
  const subs = {};
  for (const tag of exportedTags(name)) {
    if (!new RegExp(`\\b${tag}\\b`).test(rootExports)) continue;
    const props = propsOfType(`${tag}Props`, files) ?? {};
    const defaults = defaultsOfTag(tag, files, consts);
    for (const [prop, value] of Object.entries(props)) applyDefault(value, defaults[prop]);
    subs[tag] = { type: "object", properties: props };
  }

  const schema = JSON.parse(readFileSync(schemaPath, "utf8"));
  // Snapshotted before the root defaults are filled in below. `schema` is
  // mutated in place, so comparing it afterwards compares the new value with
  // itself and every root-default fill is silently dropped.
  const schemaBefore = JSON.stringify(schema);

  // The root's own defaults, filled from the same source. A prop assigned from
  // a named constant had no `default` in the hand-written schema and rendered
  // "-", which reads as "this prop has no default" rather than "nobody wrote
  // the number down".

  // JSON Schema has one word for every shape that is not a string, a number or
  // a boolean, so `classes` and `children` both rendered as "object" on the
  // root while the sub-component tables — read from the types — said
  // `AccordionClasses` and `ReactNode`. One of those tells a reader what to
  // import. Recorded as an extension keyword so the schema stays valid, and
  // only where the schema's own word carries nothing.
  // A component whose schema is a discriminated union has no top-level
  // `properties` at all — RadioButton's is a `oneOf` of RadioButton and
  // RadioGroup — so its branches are treated as roots of their own.
  const roots = [
    [name, schema.properties],
    ...(schema.oneOf ?? []).map((branch) => [branch.title ?? name, branch.properties]),
  ].filter(([, properties]) => properties);

  for (const [tag, properties] of roots) {
  const rootTsProps = propsOfType(`${tag}Props`, files) ?? {};
  for (const [prop, value] of Object.entries(properties)) {
    // A `oneOf` of object branches renders as "object" too — `tooltip` is
    // `ReactNode | TooltipConfig` and both branches carry the same one word.
    const bare =
      !value.enum &&
      (value.type === "object" ||
        (Array.isArray(value.oneOf) && value.oneOf.every((b) => b.type === "object" && !b.enum)));
    const tsType = rootTsProps[prop]?.type;
    if (bare && tsType) value["x-tsType"] = tsType;
    else if (!bare && value["x-tsType"]) delete value["x-tsType"];
  }
  for (const [prop, value] of Object.entries(properties)) applyDefault(value, defaultsOfTag(tag, files, consts)[prop]);
  }

  const next = Object.keys(subs).length ? { ...schema, subComponents: subs } : schema;
  // The same table in prose, because `llms-full.txt` is built from the .ai.md
  // files and the codegen product reads that, not the schemas.
  const docPath = `${SRC}/${name}/${name.toUpperCase()}.ai.md`;
  let doc = existsSync(docPath) ? readFileSync(docPath, "utf8") : null;
  let nextDoc = doc;
  if (doc !== null) {
    const section = Object.keys(subs).length
      ? "## Sub-component Props\n\n" +
        "Generated from the types by `scripts/build-subcomponent-schemas.mjs`.\n\n" +
        Object.entries(subs)
          .map(([tag, entry]) => {
            const rows = Object.entries(entry.properties)
              .map(([prop, meta]) =>
                `| \`${prop}\` | \`${meta.type.replace(/\|/g, "\\|")}\` | ${meta.description ?? "—"} |`)
              .join("\n");
            return `### ${tag}\n\n| Prop | Type | Description |\n| --- | --- | --- |\n${rows}\n`;
          })
          .join("\n") +
        "\n---\n\n"
      : "";
    // Consume lines up to the next `## ` heading. `\Z` is not a JavaScript
    // anchor — it matches a literal Z, which truncated the section at the first
    // one and made this script non-idempotent.
    const existing = /^## Sub-component Props\n(?:(?!^## )[\s\S])*/m;
    nextDoc = existing.test(doc)
      ? doc.replace(existing, section)
      : section
        ? doc.replace(/^## Styling Guide/m, section + "## Styling Guide")
        : doc;
  }

  const before = schemaBefore + (doc ?? "");
  const after = JSON.stringify(next) + (nextDoc ?? "");
  if (before === after) continue;
  if (check) { stale.push(name); continue; }
  writeFileSync(schemaPath, JSON.stringify(next, null, 2) + "\n");
  if (nextDoc !== null && nextDoc !== doc) writeFileSync(docPath, nextDoc);
  changed += 1;
}

if (check) {
  if (stale.length) {
    console.error(`✗ ${stale.length} schema(s) out of date with their types: ${stale.join(", ")}`);
    console.error("  run: node scripts/build-subcomponent-schemas.mjs");
    process.exit(1);
  }
  console.log("✓ every subComponents block matches its types");
} else {
  console.log(`wrote subComponents into ${changed} schema(s)`);
}
