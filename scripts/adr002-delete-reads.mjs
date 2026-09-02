/**
 * Second pass for the Task 3b deletion: remove the reads the first pass leaves.
 *
 * The compiler names every position, which beats any pattern I could write. The
 * removal itself is deliberately LINE based. An AST version that deleted from
 * `getFullStart()` swallowed the leading comment attached as trivia to the next
 * cn() argument and spliced six files, so this only deletes a line that holds
 * nothing but the dead read, and reports anything else for a human.
 */
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

const ACCESSOR = "(?:classes|classesProp|mergedClasses|baseClasses|base|cls|mc|merged|classNames)";
const DELETED = new Set(Object.values(JSON.parse(readFileSync(process.argv[2], "utf8"))).flat());

let out = "";
try { execSync("npx tsc --build", { encoding: "utf8" }); } catch (e) { out = e.stdout ?? ""; }

const byFile = new Map();
for (const line of out.split("\n")) {
  const m = line.match(/^(.+?)\((\d+),\d+\): error TS(?:2339|2551): Property '(\w+)' does not exist/);
  if (!m) continue;
  const [, file, ln, prop] = m;
  if (!byFile.has(file)) byFile.set(file, new Map());
  byFile.get(file).set(+ln, prop);
}

let removed = 0;
const manual = [];
for (const [file, sites] of byFile) {
  const lines = readFileSync(file, "utf8").split("\n");
  for (const [ln, prop] of [...sites].sort((a, b) => b[0] - a[0])) {
    const text = lines[ln - 1];
    // A line is safe to drop when it is one cn()/array argument and EVERY class
    // it reads is a deleted key: `cond && classes.dead,` or the ternary form
    // `isActive ? classNames.deadA : classNames.deadB,`. If it also reads a
    // surviving key, dropping the line would take that with it.
    const reads = [...text.matchAll(new RegExp(`${ACCESSOR}\\??\\.(\\w+)`, "g"))].map((m) => m[1]);
    const isArgument = /,\s*$/.test(text) || /^\s*[\w.?!()=== ]+&&/.test(text);
    const allDead = reads.length > 0 && reads.every((r) => DELETED.has(r));
    if (allDead && isArgument && text.includes(prop)) { lines.splice(ln - 1, 1); removed += 1; }
    else manual.push(`${file}:${ln}  ${text.trim().slice(0, 90)}`);
  }
  writeFileSync(file, lines.join("\n"));
}
console.log(JSON.stringify({ files: byFile.size, removed, needsHand: manual.length }));
for (const m of manual.slice(0, 40)) console.log("  HAND " + m);
