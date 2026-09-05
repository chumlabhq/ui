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

let changed = 0;
const stale = [];
for (const name of names) {
  const schemaPath = `${SRC}/${name}/${name}.schema.json`;
  if (!existsSync(schemaPath)) continue;
  const files = walk(`${SRC}/${name}`);
  const subs = {};
  for (const tag of exportedTags(name)) {
    if (!new RegExp(`\\b${tag}\\b`).test(rootExports)) continue;
    const props = propsOfType(`${tag}Props`, files);
    subs[tag] = { type: "object", properties: props ?? {} };
  }

  const schema = JSON.parse(readFileSync(schemaPath, "utf8"));
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

  const before = JSON.stringify(schema) + (doc ?? "");
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
