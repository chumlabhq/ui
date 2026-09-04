#!/usr/bin/env node
/**
 * After a token revaluation: which elements moved, and did they ask to?
 *
 * Every other use of `capture-theme-styles.mjs` asserts a render is unchanged.
 * Revaluing a token moves pixels on purpose, so "identical" is the wrong shape
 * of proof. The right question is whether the movement is confined to the call
 * sites that were overriding the token — because an element that moves without
 * having overridden it is a place where the old value was also wrong, and that
 * is blast radius nobody asked for.
 *
 *   node scripts/analyse-token-blast-radius.mjs before.json after.json overrides.json
 *
 * `overrides.json` is the list of classes this change removed, so an element
 * can be asked whether it carried one.
 */
import { readFileSync } from "node:fs";

const [, , beforePath, afterPath, overridesPath] = process.argv;
const before = JSON.parse(readFileSync(beforePath, "utf8")).fixtures;
const after = JSON.parse(readFileSync(afterPath, "utf8")).fixtures;
const removed = JSON.parse(readFileSync(overridesPath, "utf8"));

const asked = [];
const collateral = [];
let compared = 0;

for (const key of Object.keys(before)) {
  if (!after[key]) continue;
  for (const theme of ["dark", "light"]) {
    const a = before[key][theme];
    const b = after[key][theme];
    if (!a || !b || a.length !== b.length) {
      collateral.push({ key, theme, note: `element count ${a?.length} -> ${b?.length}` });
      continue;
    }
    for (let i = 0; i < a.length; i++) {
      compared += 1;
      if (a[i].style === b[i].style) continue;
      // Did this element carry one of the classes the change removed?
      const carried = removed.filter((cls) => a[i].cls.split(/\s+/).includes(cls));
      const record = {
        key, theme, index: i, tag: a[i].tag,
        from: a[i].style, to: b[i].style,
        classes: a[i].cls.slice(0, 160),
        carried,
      };
      if (carried.length) asked.push(record);
      else collateral.push(record);
    }
  }
}

const line = "─".repeat(64);
process.stdout.write(`\n${line}\n  token revaluation — blast radius\n${line}\n`);
process.stdout.write(`  elements compared:            ${compared}\n`);
process.stdout.write(`  changed, carried an override: ${asked.length}\n`);
process.stdout.write(`  changed, carried none:        ${collateral.length}\n`);

if (collateral.length) {
  process.stdout.write(`\n  UNASKED-FOR CHANGES — these elements never overrode the token:\n`);
  const seen = new Map();
  for (const c of collateral) {
    const sig = `${c.key.split("/").slice(0, 3).join("/")}|${c.tag}|${c.from}|${c.to}`;
    if (!seen.has(sig)) seen.set(sig, { ...c, count: 0 });
    seen.get(sig).count += 1;
  }
  for (const c of [...seen.values()].slice(0, 25)) {
    process.stdout.write(`   x${String(c.count).padStart(3)}  ${c.key} [${c.theme}] <${c.tag}>\n`);
    process.stdout.write(`         ${c.from}\n      -> ${c.to}\n`);
    process.stdout.write(`         class: ${c.classes}\n`);
  }
  if (seen.size > 25) process.stdout.write(`   ...and ${seen.size - 25} more distinct signatures\n`);
}
process.stdout.write(`${line}\n`);
process.exit(collateral.length ? 1 : 0);
