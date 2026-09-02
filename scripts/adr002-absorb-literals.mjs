/**
 * ADR 002 Task 3c: move a call-site literal into the key already applied to the
 * same element.
 *
 * Only the unconditional literals on a keyed element are handled here. A
 * conditional one is a state and belongs in an R4 data-variant, not a static
 * default; a literal on an unkeyed element needs a key, which is public API and
 * goes through the migration's gates.
 */
import ts from "typescript";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = "/Users/adityaagarwal/Developer/chumlab/chumlab-fe";
const [, , plan, only] = process.argv;
const LITERALS = JSON.parse(readFileSync(plan, "utf8"));

const constantsOf = (component) => {
  for (const p of [`src/components/${component}/utils/constants.ts`, `src/components/${component}/constants.ts`]) {
    try { readFileSync(resolve(ROOT, p)); return resolve(ROOT, p); } catch { /* next */ }
  }
  return null;
};

let moved = 0, skipped = 0;
for (const [file, entries] of Object.entries(LITERALS)) {
  const component = file.split("/")[0];
  if (only && component !== only) continue;
  const wanted = entries.filter((e) => e.bucket === "absorb-into-key" && e.key && e.form === "literal");
  if (!wanted.length) continue;
  const src = resolve(ROOT, "src/components", file);
  const cpath = constantsOf(component);
  if (!cpath) { skipped += wanted.length; continue; }

  let source = readFileSync(src, "utf8");
  let constants = readFileSync(cpath, "utf8");
  const edits = [];

  for (const e of wanted) {
    // append the tokens to the key's default, without repeating one
    const re = new RegExp(`(^  ${e.key}:\\s*\\n?\\s*")([^"]*)(")`, "m");
    const m = constants.match(re);
    if (!m) { skipped += 1; continue; }
    const have = new Set(m[2].split(/\s+/).filter(Boolean));
    const add = e.value.split(/\s+/).filter((t) => t && !have.has(t));
    // remove at the recorded span; searching for the text removed the wrong one
    if (e.start === undefined) { skipped += 1; continue; }
    edits.push({ start: e.start, end: e.end });
    if (add.length) constants = constants.replace(re, `$1${[...have, ...add].join(" ")}$3`);
    moved += 1;
  }
  for (const ed of edits.sort((a, b) => b.start - a.start)) {
    let { start, end } = ed;
    // take a trailing comma and the whitespace that held the argument
    while (end < source.length && /[ \t]/.test(source[end])) end += 1;
    if (source[end] === ",") end += 1;
    while (start > 0 && /[ \t]/.test(source[start - 1])) start -= 1;
    if (source[start - 1] === "\n" && source[end] === "\n") start -= 1;
    source = source.slice(0, start) + source.slice(end);
  }
  writeFileSync(src, source);
  writeFileSync(cpath, constants);
}
console.log(JSON.stringify({ moved, skipped }));
