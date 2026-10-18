/**
 * Every attribute a component emits is documented, and every one it documents
 * is emitted.
 *
 * `e2e/default-state.spec.ts`'s STATE_PAINT asks whether each state paints, and
 * until S3 it read its population from the `.ai.md` bullets alone. That made
 * the docs the ceiling of the gate: A3 counted 296 attributes the code emits,
 * 136 of them in no doc, so a state nobody wrote down was a state nobody
 * checked — a dragged Slider thumb and an active DatePicker preset painted
 * nothing, and the gate never looked. The other direction was as blind: a
 * documented attribute nothing emits (MultiSelectDropdown's `data-placeholder`)
 * was counted "unrendered" and passed.
 *
 * Both sides are read the way the paint gate reads them, so the two cannot
 * disagree about the population: the emitted side is `emittedBy()` over the
 * TypeScript AST, the documented side is every `data-*` name in the
 * `## Data Attributes` section of the component's `.ai.md`.
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { componentNames, documentedAttributes, emittedBy, type Read } from "../../test/emittedAttributes.js";

const NAMES = componentNames();

/** The union when S3 first checked it: 296 attributes across the thirty, every one both emitted and documented. */
const FLOOR = 296;

function analyse(overlay: Record<string, string> = {}) {
  const read: Read = (file) => overlay[file] ?? readFileSync(file, "utf8");
  const undocumented: string[] = [];
  const unemitted: string[] = [];
  let population = 0;
  for (const name of NAMES) {
    const emitted = emittedBy(name, read);
    const documented = documentedAttributes(name, read);
    population += new Set([...emitted.keys(), ...documented]).size;
    for (const a of [...emitted.keys()].sort())
      if (!documented.has(a)) undocumented.push(`${name} ${a}: emitted, and not in its .ai.md "## Data Attributes"`);
    for (const a of [...documented].sort())
      if (!emitted.has(a)) unemitted.push(`${name} ${a}: documented, and nothing ${name} renders emits it`);
  }
  return { population, undocumented, unemitted };
}

describe("state docs: emitted and documented attributes are the same set", () => {
  const result = analyse();

  it(`reads the whole population, at least the ${FLOOR} it had when first checked`, () => {
    console.log(
      `STATE_DOCS components ${NAMES.length}, attributes ${result.population} (floor ${FLOOR}), ` +
        `undocumented ${result.undocumented.length}, unemitted ${result.unemitted.length}`,
    );
    expect(result.population).toBeGreaterThanOrEqual(FLOOR);
  });

  it("documents every attribute a component emits", () => {
    expect(result.undocumented).toEqual([]);
  });

  it("emits every attribute a component documents", () => {
    expect(result.unemitted).toEqual([]);
  });

  it("self-check: names an attribute planted in a copy of a component, and one planted in its doc", () => {
    const source = resolve(process.cwd(), "src/components/Switch/Switch.tsx");
    const doc = resolve(process.cwd(), "src/components/Switch/SWITCH.ai.md");
    const planted = analyse({
      [source]: readFileSync(source, "utf8").replace("data-checked=", "data-planted-undocumented data-checked="),
      [doc]: readFileSync(doc, "utf8").replace("## Data Attributes", "## Data Attributes\n\n- `data-planted-ghost` — planted"),
    });
    expect(planted.undocumented).toContain(
      'Switch data-planted-undocumented: emitted, and not in its .ai.md "## Data Attributes"',
    );
    expect(planted.unemitted).toContain("Switch data-planted-ghost: documented, and nothing Switch renders emits it");
  });
});
