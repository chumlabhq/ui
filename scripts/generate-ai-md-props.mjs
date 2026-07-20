// Generates the "## All Props" section of a component's .ai.md from its
// schema.json. The schema is the prop-complete source of truth; the hand-written
// .ai.md tables had drifted badly (Table documented 20 of 105 props), and .ai.md
// is what the codegen prompt reads — so drift there ships broken generated code.
//
//   node scripts/generate-ai-md-props.mjs Table
//   node scripts/generate-ai-md-props.mjs --all
//
// Rewrites only the block between the "## All Props" heading and the next
// "## " heading, so hand-written prose elsewhere in the file is untouched.

import { readFileSync, writeFileSync, readdirSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const componentsDir = resolve(root, "src/components");
const HEADING = "## All Props";

function renderType(schema) {
  if (!schema) return "—";
  if (schema.enum) return schema.enum.map((v) => `\`${JSON.stringify(v)}\``).join(" \\| ");
  if (schema.const !== undefined) return `\`${JSON.stringify(schema.const)}\``;
  if (schema.oneOf) {
    const parts = schema.oneOf.map(renderType).filter((t) => t !== "—");
    return parts.length ? [...new Set(parts)].join(" \\| ") : "—";
  }
  if (Array.isArray(schema.type)) return schema.type.join(" \\| ");
  return schema.type || "—";
}

// Pipes and newlines would break the markdown table this lands in.
function cell(text) {
  return String(text ?? "").replace(/\|/g, "\\|").replace(/\s*\n\s*/g, " ").trim();
}

function buildTable(schema) {
  const props = schema.properties || {};
  const required = new Set(schema.required || []);
  const rows = Object.entries(props).map(([name, def]) => {
    const dflt = "default" in def ? `\`${JSON.stringify(def.default)}\`` : "—";
    const req = required.has(name) ? " **(required)**" : "";
    return `| \`${name}\`${req} | ${renderType(def)} | ${dflt} | ${cell(def.description)} |`;
  });
  return [
    "| Prop | Type | Default | Description |",
    "|------|------|---------|-------------|",
    ...rows,
  ].join("\n");
}

function generate(componentName) {
  const dir = resolve(componentsDir, componentName);
  const schemaPath = resolve(dir, `${componentName}.schema.json`);
  const aiMdPath = resolve(dir, `${componentName.toUpperCase()}.ai.md`);
  if (!existsSync(schemaPath) || !existsSync(aiMdPath)) return null;

  const schema = JSON.parse(readFileSync(schemaPath, "utf8"));
  if (!schema.properties) return null;

  const table = buildTable(schema);
  const source = readFileSync(aiMdPath, "utf8");
  const block = `${HEADING}\n\n<!-- generated from ${componentName}.schema.json — edit the schema, not this table -->\n\n${table}\n`;

  let next;
  const start = source.indexOf(HEADING);
  if (start === -1) {
    // No section yet — insert before Styling Guide, else append.
    const anchor = source.indexOf("\n## Styling Guide");
    next =
      anchor === -1
        ? `${source.trimEnd()}\n\n---\n\n${block}`
        : `${source.slice(0, anchor)}\n\n---\n\n${block}\n${source.slice(anchor + 1)}`;
  } else {
    const rest = source.indexOf("\n## ", start + HEADING.length);
    next = source.slice(0, start) + block + (rest === -1 ? "" : source.slice(rest));
  }

  writeFileSync(aiMdPath, next);
  return Object.keys(schema.properties).length;
}

const args = process.argv.slice(2);
const targets = args.includes("--all")
  ? readdirSync(componentsDir, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name)
  : args;

if (!targets.length) {
  console.error("usage: generate-ai-md-props.mjs <Component> | --all");
  process.exit(1);
}

for (const name of targets) {
  const count = generate(name);
  if (count) console.log(`[generate-ai-md-props] ${name}: ${count} props`);
}
