// Pipeline sibling to 09-knowledge / 13-ai-index: compiles llms-full.txt from
// the per-component *.ai.md docs (the source of truth) plus the global
// preamble in ai/llms-full-preamble.md.
//
// llms-full.txt is a BUILD PRODUCT - never hand-edit it. Edit the component's
// .ai.md (or the preamble) and run: npm run build:llms
// Then reassemble the backend develop prompt: cd ../chumlab-be && npm run build:prompt
//
// Sections are included by exclusion: everything in an .ai.md ships to the
// model except the human-only sections below. The Styling Guide and the
// complete themed classes={{...}} examples are the point of this file - a
// model that has never seen a fully styled composition generates bare
// components.
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const componentsDir = path.join(repoRoot, "src", "components");
const outPath = path.join(repoRoot, "llms-full.txt");

const EXCLUDED_COMPONENTS = new Set(["BrandLogo"]);
const EXCLUDED_SECTIONS = new Set([
  "quick answer",
  "accessibility",
  "troubleshooting",
  "demo reference",
  "source map",
  "changelog",
]);

function sectionKey(heading) {
  // "Basic Usage (copy-paste ready)" -> "basic usage"
  return heading.replace(/\(.*?\)/g, "").trim().toLowerCase();
}

function compileComponent(name, source) {
  const lines = source.split("\n");
  const out = [];
  let including = true;
  let intro = true;

  for (const line of lines) {
    if (line.startsWith("# ")) {
      out.push(`## ${line.slice(2)}`);
      continue;
    }
    if (line.startsWith("## ")) {
      intro = false;
      including = !EXCLUDED_SECTIONS.has(sectionKey(line.slice(3)));
      if (including) out.push(`###${line.slice(2)}`);
      continue;
    }
    if (line.startsWith("### ") && !intro) {
      if (including) out.push(`#${line}`);
      continue;
    }
    if (intro && line.trim() === "---") continue;
    if (including) out.push(line);
  }

  // collapse the runs of blank lines that removed sections leave behind
  const text = out.join("\n").replace(/\n{3,}/g, "\n\n").trim();
  if (!text.startsWith(`## ${name}`)) {
    console.error(`${name}: .ai.md H1 does not match the directory name`);
    process.exit(1);
  }
  return text;
}

const components = readdirSync(componentsDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && !EXCLUDED_COMPONENTS.has(entry.name))
  .map((entry) => {
    const dir = path.join(componentsDir, entry.name);
    const aiDoc = readdirSync(dir).find((f) => f.endsWith(".ai.md"));
    return aiDoc ? { name: entry.name, file: path.join(dir, aiDoc) } : null;
  })
  .filter(Boolean)
  .sort((a, b) => (a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1));

if (components.length !== 30) {
  console.error(`Expected 30 published components with .ai.md docs, found ${components.length}`);
  process.exit(1);
}

const preamble = readFileSync(path.join(repoRoot, "ai", "llms-full-preamble.md"), "utf8")
  .replace(/^<!--[\s\S]*?-->\s*/, "");

const body = components
  .map(({ name, file }) => compileComponent(name, readFileSync(file, "utf8")))
  .join("\n\n---\n\n");

const output = `${preamble.trim()}\n\n---\n\n${body}\n`;
writeFileSync(outPath, output);

const bytes = Buffer.byteLength(output);
console.log(
  `llms-full.txt: ${components.length} components, ${output.split("\n").length} lines, ` +
    `${(bytes / 1024).toFixed(0)} KB, ~${Math.round(bytes / 4 / 1000)}k-${Math.round(bytes / 3.5 / 1000)}k tokens`
);
