// Backfills "default" keys in <Component>.schema.json from the component's
// actual code, so the generated .ai.md prop tables show real defaults instead
// of "—". Defaults are read from destructuring in the component's .tsx and hook
// files — the runtime source of truth — never invented.
//
//   node scripts/backfill-schema-defaults.mjs Slider
//   node scripts/backfill-schema-defaults.mjs --all
//
// Rules:
//   - Only literal defaults (string / number / boolean) are extracted.
//   - A default is applied only to a name that is already a schema prop.
//   - Existing schema defaults are NEVER overwritten or removed. A disagreement
//     between an existing default and the extracted one is reported, not applied.
//   - Complex defaults (objects, functions, computed) are left as-is (no key).

import { readFileSync, writeFileSync, readdirSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const componentsDir = resolve(root, "src/components");

// `name = "str" | 'str' | 123 | true | false ,` inside a destructuring block.
const LITERAL = /^\s{2,}([a-zA-Z][a-zA-Z0-9]*)\s*=\s*("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|true|false|-?\d+(?:\.\d+)?)\s*,/;

function sourceFiles(compDir) {
  const files = [];
  for (const name of readdirSync(compDir, { withFileTypes: true })) {
    if (name.isFile() && (name.name.endsWith(".tsx") || /^use.*\.ts$/.test(name.name))) {
      files.push(resolve(compDir, name.name));
    }
    if (name.isDirectory() && name.name === "utils") {
      const utils = resolve(compDir, "utils");
      for (const u of readdirSync(utils)) {
        if (/^use.*\.ts$/.test(u)) files.push(resolve(utils, u));
      }
    }
  }
  return files;
}

function parseLiteral(raw) {
  if (raw === "true") return true;
  if (raw === "false") return false;
  if (/^-?\d/.test(raw)) return raw.includes(".") ? parseFloat(raw) : parseInt(raw, 10);
  return raw.slice(1, -1); // strip quotes
}

function extractDefaults(compDir) {
  const found = {};
  for (const f of sourceFiles(compDir)) {
    for (const line of readFileSync(f, "utf8").split("\n")) {
      const m = LITERAL.exec(line);
      if (m && !(m[1] in found)) found[m[1]] = parseLiteral(m[2]);
    }
  }
  return found;
}

function backfill(componentName) {
  const compDir = resolve(componentsDir, componentName);
  const schemaPath = resolve(compDir, `${componentName}.schema.json`);
  if (!existsSync(schemaPath)) return null;
  const schema = JSON.parse(readFileSync(schemaPath, "utf8"));
  if (!schema.properties) return { skipped: "non-flat schema" };

  const defaults = extractDefaults(compDir);
  let added = 0;
  const conflicts = [];
  const uncovered = [];

  for (const [name, def] of Object.entries(schema.properties)) {
    if ("default" in def) {
      if (name in defaults && JSON.stringify(defaults[name]) !== JSON.stringify(def.default)) {
        conflicts.push(`${name}: schema=${JSON.stringify(def.default)} code=${JSON.stringify(defaults[name])}`);
      }
      continue;
    }
    if (name in defaults) {
      def.default = defaults[name];
      added++;
    } else {
      uncovered.push(name);
    }
  }

  if (added) {
    writeFileSync(schemaPath, JSON.stringify(schema, null, 2) + "\n");
  }
  return { added, conflicts, uncovered };
}

const args = process.argv.slice(2);
const targets = args.includes("--all")
  ? readdirSync(componentsDir, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name)
  : args;

if (!targets.length) {
  console.error("usage: backfill-schema-defaults.mjs <Component> | --all");
  process.exit(1);
}

let hadConflict = false;
for (const name of targets) {
  const r = backfill(name);
  if (!r || r.skipped) continue;
  console.log(`[backfill] ${name}: +${r.added} defaults, ${r.uncovered.length} still uncovered`);
  if (r.conflicts.length) {
    hadConflict = true;
    console.error(`  ⚠ CONFLICTS (not applied): ${r.conflicts.join("; ")}`);
  }
}
if (hadConflict) process.exit(2);
