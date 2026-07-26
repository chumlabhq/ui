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

// Headings the All Props block is inserted before, in priority order, when a
// file has no All Props section yet. Falls back to appending at the end.
const INSERT_BEFORE = ["## Styling Guide", "## Patterns", "## Accessibility", "## Demo Reference", "## Troubleshooting"];

// Skipped: BrandLogo is site-only, not shipped as a public subpath.
const SKIP = new Set(["BrandLogo"]);

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

function propsTable(properties, required = []) {
  const req = new Set(required);
  const rows = Object.entries(properties).map(([name, def]) => {
    const dflt = "default" in def ? `\`${JSON.stringify(def.default)}\`` : "—";
    const flag = req.has(name) ? " **(required)**" : "";
    return `| \`${name}\`${flag} | ${renderType(def)} | ${dflt} | ${cell(def.description)} |`;
  });
  return ["| Prop | Type | Default | Description |", "|------|------|---------|-------------|", ...rows].join("\n");
}

// oneOf schemas model several distinct components (Loader → Circular/Linear/…);
// emit one titled sub-table per branch rather than a single flattened table.
function buildTable(schema) {
  if (schema.properties) return propsTable(schema.properties, schema.required);
  if (schema.oneOf) {
    return schema.oneOf
      .map((branch, i) => {
        const title = branch.title || `Variant ${i + 1}`;
        return `### ${title}\n\n${propsTable(branch.properties || {}, branch.required)}`;
      })
      .join("\n\n");
  }
  return null;
}

function generate(componentName) {
  const dir = resolve(componentsDir, componentName);
  const schemaPath = resolve(dir, `${componentName}.schema.json`);
  const aiMdPath = resolve(dir, `${componentName.toUpperCase()}.ai.md`);
  if (!existsSync(schemaPath) || !existsSync(aiMdPath)) return null;

  const schema = JSON.parse(readFileSync(schemaPath, "utf8"));
  const table = buildTable(schema);
  if (!table) return null;

  const source = readFileSync(aiMdPath, "utf8");
  const block = `${HEADING}\n\n<!-- generated from ${componentName}.schema.json — edit the schema, not this table -->\n\n${table}\n`;

  let next;
  const start = source.indexOf(HEADING);
  if (start !== -1) {
    // Replace the existing block up to the next top-level heading.
    const rest = source.indexOf("\n## ", start + HEADING.length);
    next = source.slice(0, start) + block + (rest === -1 ? "" : source.slice(rest));
  } else {
    // Insert before the first available anchor heading, else append.
    let anchor = -1;
    for (const h of INSERT_BEFORE) {
      anchor = source.indexOf(`\n${h}`);
      if (anchor !== -1) break;
    }
    const before = anchor === -1 ? source.trimEnd() : source.slice(0, anchor).trimEnd();
    // Reuse an existing trailing divider instead of stacking a second one.
    const divider = before.endsWith("---") ? "" : "\n\n---";
    const tail = anchor === -1 ? "" : `\n${source.slice(anchor + 1)}`;
    next = `${before}${divider}\n\n${block}${tail}`;
  }

  writeFileSync(aiMdPath, next);
  const count = schema.properties
    ? Object.keys(schema.properties).length
    : (schema.oneOf || []).reduce((n, b) => n + Object.keys(b.properties || {}).length, 0);
  return count;
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
  if (SKIP.has(name)) {
    console.log(`[generate-ai-md-props] ${name}: SKIPPED (${name === "RadioButton" ? "broken schema — needs rebuild" : "site-only"})`);
    continue;
  }
  const count = generate(name);
  if (count) console.log(`[generate-ai-md-props] ${name}: ${count} props`);
}
