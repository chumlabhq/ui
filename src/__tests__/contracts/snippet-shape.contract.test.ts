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
/** Every value a component's entry exports — what its snippet may legitimately name. */
function exportedTagsOf(component: string): Set<string> {
  const file = join("src/components", component, "index.ts");
  const tags = new Set([component]);
  if (!existsSync(file)) return tags;
  for (const m of readFileSync(file, "utf8").matchAll(/export\s*\{([^}]*)\}/g)) {
    for (const part of m[1].split(",")) {
      const name = (part.split(" as ").pop() ?? "").trim();
      if (/^[A-Z][A-Za-z]*$/.test(name) && !/^[A-Z0-9_]+$/.test(name)) tags.add(name);
    }
  }
  return tags;
}

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
      // The braces have to hold a STRING-valued member, which is what a class
      // bag is. `\}\s*\)\s*[.[]` alone also matched
      // `Array.from({ length: 20 }).map(…)` — an ordinary loop, and a false
      // positive that only surfaced when Drawer's body started reaching the
      // snippets. The pattern was never about the punctuation.
      if (/\{[^{}]*:\s*"[^"]*"[^{}]*\}\s*\)\s*[.[]/.test(code)) {
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

  /**
   * A snippet has to name the component its page documents.
   *
   * Trigger-driven components are written as two siblings — the button in the
   * `DemoWrapper`, the surface after it — and reading the wrapper alone gave 55
   * snippets that were a styled button and nothing else. Drawer's Form Drawer
   * taught a reader to build a button and stopped: no Drawer, no fields, no
   * sign of where the panel came from. That reads as complete, which is worse
   * than having no snippet.
   */
  it("names the component the page documents", () => {
    /**
     * Recorded by name, and the two kinds are NOT the same:
     *   EXEMPT — the snippet is right as it is, for a stated reason.
     *   UNPARSED — nobody decided; the tool could not read the page.
     */
    const EXEMPT_MISSING = new Map([
      [
        "Drawer/Directions",
        "The drawer is inside a second `.map()`. Lifting it out of the callback " +
          "leaves its loop parameter undeclared, and a copy-paste example is one " +
          "example, so the repetition is not what the snippet should carry.",
      ],
    ]);

    const missing: string[] = [];
    for (const { component, title, code } of every) {
      const tags = exportedTagsOf(component);
      if ([...tags].some((t) => new RegExp(`<${t}[\\s/>]`).test(code))) continue;
      const key = `${component}/${title}`;
      if (EXEMPT_MISSING.has(key)) continue;
      missing.push(key);
    }
    expect(
      missing.sort(),
      "the snippet under this section never names the component whose page it is on. A reader " +
        "copies it and gets the trigger without the thing the trigger opens",
    ).toEqual([]);
  });

  /**
   * A snippet may not hand-class an element the library provides.
   *
   * The demo pages keep ~300 raw `<button>`s as page harness, and that rule is
   * right for the page and wrong here: in a snippet nothing is harness, every
   * line is being shown as the way to do it. A `<button>` classed
   * `bg-cl-accent text-cl-on-accent` teaches a reader to rebuild `Button`.
   */
  it("hand-classes no element the library provides", () => {
    /** The raw element is the lesson. Each with the reason it is. */
    const EXEMPT_RAW = new Map([
      ["Drawer/Directions", "The `.map()` exclusion above; the button is the trigger inside it."],
      ["Input/InputLabel Standalone", "The section exists to pair `InputLabel` with a NATIVE field — with `Input` you pass `label` and never reach for it. The raw input is the lesson."],
      ["TextArea/TextAreaLabel Standalone", "As Input's, for `TextAreaLabel`."],
      ["Modal/Focus Trap", "Raw inputs as focus-order fodder. Borderline: `Input` is focusable too and would teach better, so this is a decision to revisit, not a principle."],
      ["Modal/Initial Focus", "As Focus Trap's."],
      ["Toast/Custom Content (content prop)", "A deliberately branded button inside a toast body, demonstrating that the content slot takes anything. Its colours are not ours."],
      ["DatePicker/Controlled Open", "The trigger is not written through the page's class bag, so the conversion tool had nothing to key on. Left pending a decision, not decided."],
      ["Drawer/Initial Focus", "A native `<input data-autofocus>`: the attribute on a plain field IS the mechanism the section demonstrates, and an `Input` would hide it behind a component."],
      ["Accordion/Composition with asChild", "`asChild` hands the trigger's behaviour to an element you supply; a raw `<button>` styled your way is that element, and a `Button` would hide the point."],
    ]);

    /**
     * NOT exempt — UNPARSED. The balanced-tag converter reported unmatched
     * openers on these two pages and was not run on them. They are unconverted
     * because the tool could not read them, and if that reads as "decided" the
     * next person will leave them alone for the wrong reason.
     */
    const UNPARSED = new Map([
      ["Dropdown/Controlled Open State", "TooltipDemo-style converter reported `unbalanced 2` on DropdownDemo.tsx."],
      ["SearchableDropdown/Controlled Open State", "Converter reported `unbalanced 2` on SearchableDropdownDemo.tsx."],
    ]);

    const TOKEN = /\b(?:bg-cl-|text-cl-|border-cl-|rounded-cl-)/;
    const PROVIDED: Array<[RegExp, string]> = [
      [/<button\b[^>]*className="[^"]*"/gs, "button"],
      [/<input\b(?![^>]*type="(?:checkbox|radio|range|file)")[^>]*className="[^"]*"/gs, "input"],
      [/<textarea\b[^>]*className="[^"]*"/gs, "textarea"],
    ];

    const handClassed: string[] = [];
    for (const { component, title, code } of every) {
      const key = `${component}/${title}`;
      if (EXEMPT_RAW.has(key) || UNPARSED.has(key)) continue;
      for (const [re, tag] of PROVIDED) {
        for (const m of code.matchAll(re)) {
          if (TOKEN.test(m[0])) { handClassed.push(`${key} (<${tag}>)`); break; }
        }
      }
    }
    expect(
      [...new Set(handClassed)].sort(),
      "a snippet dresses a raw element in the library's own tokens. In a snippet nothing is " +
        "harness — every line is being shown as the way to do it",
    ).toEqual([]);
  });
});
