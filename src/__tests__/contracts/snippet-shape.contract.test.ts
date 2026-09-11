import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { DEMO_SNIPPETS } from "../../pages/demo/generated/demoSnippets.js";

/**
 * What a copy-paste snippet is allowed to look like.
 *
 * These are public surface in the most literal sense: a reader copies one into
 * their own file. `doc-truth.contract` asserts the prose around them is true;
 * nothing asserted anything about the code itself, and it showed — 41 snippets
 * carried an entire page styling object where a single slot belonged, because
 * `c.accordion.root` substituted the whole of `c.accordion` and left the
 * `.root` hanging off it. `DatePicker/Classes System` was 18.5 KB of the same
 * object repeated once per slot. It COMPILED, which is why the snippet
 * typecheck gate stayed green and nobody found it for months; it was noticed
 * only because someone was reading that file for an unrelated reason.
 *
 * Three rules, because the defect had three visible faces: a slot that is not
 * a slot, an object where a string belongs, and a snippet too big to be an
 * example.
 */
const SRC = "src/components";

/** The `classes` keys each component and sub-component actually declares. */
const slotsByTag = (): Map<string, Set<string>> => {
  const out = new Map<string, Set<string>>();
  const add = (tag: string, keys: string[]) => {
    if (!keys.length) return;
    out.set(tag, new Set([...(out.get(tag) ?? []), ...keys]));
  };
  for (const dir of readdirSync(SRC)) {
    const schemaPath = join(SRC, dir, `${dir}.schema.json`);
    if (!existsSync(schemaPath)) continue;
    const schema = JSON.parse(readFileSync(schemaPath, "utf8")) as {
      properties?: Record<string, { properties?: Record<string, unknown> }>;
      oneOf?: Array<{ title?: string; properties?: Record<string, { properties?: Record<string, unknown> }> }>;
      subComponents?: Record<string, { properties?: Record<string, { properties?: Record<string, unknown> }> }>;
    };
    add(dir, Object.keys(schema.properties?.classes?.properties ?? {}));
    for (const branch of schema.oneOf ?? []) {
      add(branch.title ?? dir, Object.keys(branch.properties?.classes?.properties ?? {}));
    }
    for (const [tag, sub] of Object.entries(schema.subComponents ?? {})) {
      add(tag, Object.keys(sub.properties?.classes?.properties ?? {}));
    }
  }
  return out;
};

const SLOTS = slotsByTag();
const every = Object.entries(DEMO_SNIPPETS).flatMap(([component, sections]) =>
  Object.entries(sections).map(([title, snippet]) => ({ component, title, code: snippet.react })),
);

/**
 * `classes={{ … }}` object literals in a snippet, as [tag, keys].
 *
 * Textual rather than a parse: the snippet is already valid TSX by the time it
 * is written — `build-demo-snippets.mjs` typechecks every one — so what is
 * wanted here is the shape a reader sees, and a brace-matched scan reads it
 * without dragging the compiler into a contract test.
 */
const classesObjects = (code: string): Array<{ tag: string; keys: string[]; body: string }> => {
  const out: Array<{ tag: string; keys: string[]; body: string }> = [];
  const opening = /<([A-Z][A-Za-z0-9]*)\b/g;
  for (const match of code.matchAll(/classes=\{\s*\{/g)) {
    const start = (match.index ?? 0) + match[0].length - 1;
    let depth = 0;
    let end = start;
    for (let i = start; i < code.length; i += 1) {
      if (code[i] === "{") depth += 1;
      else if (code[i] === "}") {
        depth -= 1;
        if (depth === 0) { end = i; break; }
      }
    }
    const body = code.slice(start + 1, end);
    // Top-level keys only: a nested bag (`loading: { root: … }`) belongs to the
    // slot above it and is checked against that component's own schema entry.
    const keys: string[] = [];
    let nesting = 0;
    for (const line of body.split("\n")) {
      const key = nesting === 0 ? /^\s*["']?([A-Za-z][A-Za-z0-9]*)["']?\s*:/.exec(line) : null;
      if (key) keys.push(key[1]);
      nesting += (line.match(/[{[(]/g) ?? []).length - (line.match(/[}\])]/g) ?? []).length;
    }
    // The tag whose ATTRIBUTE LIST this is, which is not the nearest opening
    // tag before it: a render prop puts other elements in between, and
    // `<InternationalPhoneInput … renderSelectedCountry={() => <CountryFlag/>}
    // classes={{…}}>` reported three of IPI's own slots as phantoms on
    // CountryFlag. Match the brace depth, so an element nested inside a prop
    // is skipped.
    const before = code.slice(0, match.index ?? 0);
    const depthAt = (text: string) =>
      (text.match(/\{/g) ?? []).length - (text.match(/\}/g) ?? []).length;
    const target = depthAt(before);
    let tag = "";
    for (const found of before.matchAll(opening)) {
      if (depthAt(before.slice(0, found.index ?? 0)) === target) tag = found[1];
    }
    out.push({ tag, keys, body });
  }
  return out;
};

describe("snippet shape contract", () => {
  it("reads the snippets and the schemas", () => {
    // Either side coming back empty would pass every assertion below for the
    // wrong reason.
    expect(every.length, "no snippets were read").toBeGreaterThan(500);
    expect(SLOTS.size, "no schema slots were read").toBeGreaterThan(20);
    expect(SLOTS.get("Accordion")?.has("trigger")).toBe(true);
  });

  it("names only slots the component declares", () => {
    const phantom: string[] = [];
    for (const { component, title, code } of every) {
      for (const { tag, keys } of classesObjects(code)) {
        const slots = SLOTS.get(tag);
        // A tag whose schema records no `classes` properties is not checked:
        // nothing known is not the same as known to have none, which is how
        // CountryFlagGroup's two real keys were cut out of its own snippet.
        if (!slots) continue;
        for (const key of keys) {
          if (!slots.has(key)) phantom.push(`${component}/${title}: <${tag} classes={{ ${key} }}`);
        }
      }
    }
    expect(
      phantom.sort(),
      "a `classes` key the component does not declare. The snippet is what a reader pastes, " +
        "so this is a compile error in their editor — and `build-demo-snippets.mjs` drops " +
        "unknown keys, so one arriving here means a path around that dropper",
    ).toEqual([]);
  });

  it("puts a class string where a slot belongs, never a styling object", () => {
    const serialised: string[] = [];
    for (const { component, title, code } of every) {
      // `({ root: "…", item: "…" }).root` — the whole bag inlined for one slot.
      // `({ root: "…", item: "…" }).root` and its bracket form: the whole bag
      // inlined so one member can be read off it.
      if (/\}\s*\)\s*[.[]/.test(code)) {
        serialised.push(`${component}/${title}: an object literal read for one member`);
      }
      // One rule, not two. A "the same long class string appears three times"
      // proxy was tried and dropped: it flagged nine avatars sharing a
      // className, and a page bag whose own `trigger`, `content` and `chip`
      // legitimately carry one string, while adding nothing the member-access
      // test above does not already catch exactly. A rule that needs
      // exceptions carved into it is a rule that will be waived.
    }
    expect(
      serialised.sort(),
      "a page styling object serialised into a snippet. `c.accordion.root` must resolve to " +
        "that slot's string, not to the whole bag with `.root` appended — it compiles either " +
        "way, and a reader pastes the difference",
    ).toEqual([]);
  });

  it("keeps every snippet small enough to read", () => {
    /**
     * 30000 characters. The largest legitimate snippet today is
     * `Avatar/Avatar Group` at 25807, which renders nine examples in one
     * section; the median is 2308 and the 90th percentile 6042. So this is
     * about 16% above the real maximum: it leaves room for a section to gain
     * an example, and a snippet that repeats a styling object per slot lands
     * far past it — the one that prompted this rule was 18.5 KB for a section
     * whose honest size is 15.6 KB, and a larger section would have cleared
     * 30000 outright.
     *
     * The number is a backstop, not a style rule. The two assertions above
     * catch the mechanism directly; this catches whatever the next mechanism
     * turns out to be.
     */
    const CEILING = 30000;
    const oversize = every
      .filter(({ code }) => code.length > CEILING)
      .map(({ component, title, code }) => `${component}/${title}: ${code.length} chars`);
    expect(
      oversize.sort(),
      `a snippet over ${CEILING} characters. Something is being inlined that should be ` +
        "referenced, or a section is rendering more examples than one copy-paste block can carry",
    ).toEqual([]);
  });
});
