/**
 * Second pass for the ADR 002 codemod.
 *
 * A demo may hold its own object of class strings and pass it as a `classes`
 * bag. The checker renames the bag's keys through the contextual type, but a
 * bare `c.textarea.wrapper` read elsewhere has only the object's inferred type,
 * so nothing connects it. The compiler names those sites exactly; this rewrites
 * them from its output rather than guessing which locals are classes bags.
 */
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

const PLAN = JSON.parse(readFileSync(process.argv[2], "utf8"));
const targets = new Map();
for (const map of Object.values(PLAN)) {
  for (const [from, to] of Object.entries(map)) {
    if (!targets.has(from)) targets.set(from, new Set());
    targets.get(from).add(to);
  }
}

let out = "";
try { execSync("npx tsc --build", { encoding: "utf8" }); } catch (e) { out = e.stdout ?? ""; }

const byFile = new Map();
for (const line of out.split("\n")) {
  const m = line.match(/^(.+?)\((\d+),(\d+)\): error TS2339: Property '(\w+)' does not exist/);
  if (!m) continue;
  const [, file, ln, col, prop] = m;
  const to = targets.get(prop);
  if (!to || to.size !== 1) continue;
  if (!byFile.has(file)) byFile.set(file, []);
  byFile.get(file).push({ line: +ln, col: +col, from: prop, to: [...to][0] });
}

let fixed = 0;
for (const [file, sites] of byFile) {
  const lines = readFileSync(file, "utf8").split("\n");
  for (const s of sites.sort((a, b) => b.line - a.line || b.col - a.col)) {
    const l = lines[s.line - 1];
    if (l.slice(s.col - 1, s.col - 1 + s.from.length) !== s.from) continue;
    lines[s.line - 1] = l.slice(0, s.col - 1) + s.to + l.slice(s.col - 1 + s.from.length);
    fixed += 1;
  }
  writeFileSync(file, lines.join("\n"));
}
console.log(JSON.stringify({ files: byFile.size, fixed }));
