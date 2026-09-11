/**
 * Documentation that names a prop the type does not have.
 *
 * `llms-full.txt` is the codegen product's input, so a prop documented in prose
 * and absent from the type is a prop the playground will generate and a
 * consumer will pass to nothing. It has been found by hand twice — an audit
 * turned up fourteen, and there is an abandoned `fix/phantom-props` branch
 * before that — which is the definition of something that needs a gate.
 *
 * The generated `All Props` tables and the schemas track the types. The prose
 * does not, and the repeated mistake is one shape: a `classes` slot key written
 * as though it were a top-level prop.
 *
 * Two rules:
 *
 *   1. a prop named in prose must exist on the component's type
 *   2. a sub-component exported from the package root must have a schema entry
 *
 * Rule 2's converse is deliberately not gated: a sub-component that is *not*
 * exported needs no documentation, and ADR 002's closeout settled which is
 * which — reachable from the root and rendered without its parent makes it a
 * component in its own right; never rendered alone makes it internal, and
 * `MultiSelectDropdownShimmer` was un-exported rather than documented.
 */
import { describe, expect, it } from "vitest";
import ts from "typescript";
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { execFileSync } from "node:child_process";
import index from "../../../ai/component-index.json";
import { COMPONENT_DOCS, type ComponentDoc } from "../../pages/demo/generated/componentDocs";

const SRC = "src/components";
const COMPONENTS = (index as { components: { name: string }[] }).components.map((c) => c.name);

const program = ts.createProgram(
  COMPONENTS.map((n) => `${SRC}/${n}/index.ts`).filter(existsSync),
  {
    jsx: ts.JsxEmit.ReactJSX,
    target: ts.ScriptTarget.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    module: ts.ModuleKind.ESNext,
    strict: true,
    skipLibCheck: true,
    esModuleInterop: true,
  },
);
const checker = program.getTypeChecker();

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) return walk(path);
    return /\.tsx?$/.test(entry) && !path.includes("__tests__") ? [path] : [];
  });

/** Every prop any of a component's exported types accepts, inherited included. */
function propsOf(name: string): Set<string> {
  const props = new Set<string>();
  const files = existsSync(`${SRC}/${name}`) ? walk(`${SRC}/${name}`) : [];
  for (const file of files) {
    const sf = program.getSourceFile(file);
    if (!sf) continue;
    const visit = (node: ts.Node): void => {
      if (
        (ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)) &&
        /Props$/.test(node.name.text)
      ) {
        const type = checker.getTypeAtLocation(node.name);
        const members = type.isUnion()
          ? type.types.flatMap((t) => checker.getPropertiesOfType(t))
          : checker.getPropertiesOfType(type);
        for (const sym of members) props.add(sym.getName());
      }
      ts.forEachChild(node, visit);
    };
    visit(sf);
  }
  return props;
}

/** The tags a component can be rendered as, so example code can be read. */
function tagsOf(name: string): Set<string> {
  const tags = new Set([name]);
  const idx = `${SRC}/${name}/index.ts`;
  if (!existsSync(idx)) return tags;
  const sf = ts.createSourceFile(idx, readFileSync(idx, "utf8"), ts.ScriptTarget.Latest, true);
  const visit = (node: ts.Node): void => {
    if (ts.isExportDeclaration(node) && node.exportClause && ts.isNamedExports(node.exportClause)) {
      if (!node.isTypeOnly) {
        for (const el of node.exportClause.elements) {
          if (el.isTypeOnly) continue;
          const n = el.name.text;
          if (/^[A-Z]/.test(n) && !/^[A-Z0-9_]+$/.test(n)) tags.add(n);
        }
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return tags;
}

/** Props the prose claims: prop tables, and attributes in example code. */
function propsClaimedInProse(name: string, tags: Set<string>) {
  const path = `${SRC}/${name}/${name.toUpperCase()}.ai.md`;
  if (!existsSync(path)) return { table: new Set<string>(), examples: new Set<string>() };
  const text = readFileSync(path, "utf8");

  // Only the prop-claiming sections. The Styling Guide's slot table has the
  // same row shape, and reading the whole file reports every `classes` key.
  // The whole first cell must be the name: `` | `href` on items | `` documents
  // a data-object field and says so.
  const sections = text
    .split(/^## /m)
    .filter((s) => /^(All Props|Prop Constraints)/.test(s))
    .join("\n");
  const table = new Set(
    [...sections.matchAll(/^\|\s*`([A-Za-z][\w-]*)`\s*\|/gm)].map((m) => m[1]),
  );

  const examples = new Set<string>();
  for (const fence of text.matchAll(/```(?:tsx|jsx)\n([\s\S]*?)```/g)) {
    const sf = ts.createSourceFile("ex.tsx", fence[1], ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const visit = (node: ts.Node): void => {
      if (ts.isJsxOpeningLikeElement(node) && tags.has(node.tagName.getText(sf))) {
        for (const attr of node.attributes.properties) {
          if (ts.isJsxAttribute(attr)) examples.add(attr.name.getText(sf));
        }
      }
      ts.forEachChild(node, visit);
    };
    visit(sf);
  }
  return { table, examples };
}

/** React's own, which no component declares. */
const BUILTIN = new Set(["key", "ref"]);

/**
 * The `classes` keys a component actually has.
 *
 * Read off the `*Classes` interfaces rather than through the checker: the maps
 * are plain interfaces of optional strings, and a nested one (`countrySelect`
 * on InternationalPhoneInput) is another component's map, whose keys are that
 * component's business.
 */
function classesKeysOf(name: string): Set<string> {
  const keys = new Set<string>();
  for (const file of existsSync(`${SRC}/${name}`) ? walk(`${SRC}/${name}`) : []) {
    if (!/types\.ts$/.test(file)) continue;
    const text = readFileSync(file, "utf8");
    for (const block of text.matchAll(/export interface \w*Classes \{([\s\S]*?)\n\}/g)) {
      for (const key of block[1].matchAll(/^\s{2}(\w+)\??:/gm)) keys.add(key[1]);
    }
  }
  return keys;
}

/**
 * Keys written into a `classes={{ … }}` in an example, which is the one place a
 * key claim is unambiguous — a slot table row has the same shape as a prop
 * table row, and reading those reported 1334 props as keys.
 */
function classesClaimedInProse(name: string): string[] {
  const path = `${SRC}/${name}/${name.toUpperCase()}.ai.md`;
  if (!existsSync(path)) return [];
  const text = readFileSync(path, "utf8");
  const claimed: string[] = [];
  for (const fence of text.matchAll(/```(?:tsx|jsx)\n([\s\S]*?)```/g)) {
    const sf = ts.createSourceFile("ex.tsx", fence[1], ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const visit = (node: ts.Node): void => {
      if (
        ts.isJsxAttribute(node) &&
        node.name.getText(sf) === "classes" &&
        node.initializer &&
        ts.isJsxExpression(node.initializer) &&
        node.initializer.expression &&
        ts.isObjectLiteralExpression(node.initializer.expression)
      ) {
        for (const property of node.initializer.expression.properties) {
          if (property.name) claimed.push(property.name.getText(sf).replace(/['"]/g, ""));
        }
      }
      ts.forEachChild(node, visit);
    };
    visit(sf);
  }
  return claimed;
}

/**
 * 120s rather than the project's 30s. These three shell out to an AST sweep of
 * the whole source, and `test:all` now runs vitest and the browser suite at the
 * same time; under that load one of them exceeded 30s and failed on a clock
 * rather than on a claim. A timeout is not an assertion.
 */
/**
 * The keys a component's own code demonstrably handles.
 *
 * A lower bound, on purpose. It reads `e.key === "Escape"` and
 * `["Enter", " "].includes(e.key)` out of the component's files and the shared
 * hooks it imports, and it cannot see three real things: a key held in a
 * variable (`TabPanel` computes `forwardKey` from the orientation), a key the
 * browser handles natively (`Space` on a `<button>`, arrow keys in a radio
 * group), and a key a nested component owns. So the gate below runs one way —
 * every key found here must be documented — and a table may list more.
 */
function keysHandledBy(name: string): Set<string> {
  const own = existsSync(`${SRC}/${name}`) ? walk(`${SRC}/${name}`) : [];
  const shared = new Set<string>();
  for (const file of own) {
    const text = readFileSync(file, "utf8");
    for (const m of text.matchAll(/from\s+"(\.\.\/[^"]*utils[^"]*)"/g)) {
      const base = join(dirname(file), m[1]).replace(/\.js$/, "");
      for (const candidate of [`${base}.ts`, `${base}.tsx`]) {
        if (existsSync(candidate)) shared.add(candidate);
      }
    }
  }

  const keys = new Set<string>();
  for (const file of [...own, ...shared]) {
    const text = readFileSync(file, "utf8");
    for (const m of text.matchAll(/(?:\b(?:e|ev|event)\.key|\bkey)\s*===\s*"([^"]+)"/g)) keys.add(m[1]);
    for (const m of text.matchAll(/\[((?:\s*"[^"]+"\s*,?)+)\]\s*\.includes\(\s*(?:e|ev|event)\.key/g)) {
      for (const k of m[1].matchAll(/"([^"]+)"/g)) keys.add(k[1]);
    }
    // `switch (e.key)`, which is how Slider, OtpInput and Table read theirs.
    // Scanned with brace depth rather than another regex: a `case "x":` inside
    // a nested switch on something else is not a key.
    for (const m of text.matchAll(/switch\s*\(\s*(?:[\w.]*\.)?key\s*\)\s*\{/g)) {
      let depth = 1;
      let i = m.index + m[0].length;
      const start = i;
      while (i < text.length && depth > 0) {
        const c = text[i];
        if (c === "{") depth += 1;
        else if (c === "}") depth -= 1;
        i += 1;
      }
      for (const c of text.slice(start, i).matchAll(/case\s+"([^"]*)"\s*:/g)) keys.add(c[1]);
    }
  }
  keys.delete("");
  return keys;
}

/** The keys a component's `## Keyboard Interactions` table names. */
function keysDocumentedBy(name: string): Set<string> {
  const path = `${SRC}/${name}/${name.toUpperCase()}.ai.md`;
  if (!existsSync(path)) return new Set();
  const body = readFileSync(path, "utf8")
    .split(/^## /m)
    .find((s) => s.startsWith("Keyboard Interactions"));
  if (!body) return new Set();
  const named = new Set<string>();
  for (const m of body.matchAll(/`([^`]+)`/g)) named.add(m[1]);
  // `Space` is how a table names the key the source writes as " ".
  if (named.has("Space")) named.add(" ");
  return named;
}

const SHELL_OUT_TIMEOUT = 120_000;
/**
 * Slots and shape members the site renders with an empty description column.
 *
 * Counted off the generated file rather than the sources, because that is what
 * the pages and `llms-full.txt` read: a description that exists in a
 * `utils/types.ts` the generator does not reach is not documentation.
 */
function blankDescriptions(docs: Record<string, ComponentDoc>): string[] {
  const blank: string[] = [];
  for (const [name, doc] of Object.entries(docs)) {
    for (const map of doc.classes) {
      for (const key of map.keys) if (!key.description) blank.push(`${name}: ${map.map}.${key.name}`);
    }
    for (const shape of doc.shapes) {
      if (!shape.description) blank.push(`${name}: ${shape.name}`);
      for (const member of shape.members) {
        if (!member.description) blank.push(`${name}: ${shape.name}.${member.name}`);
      }
    }
  }
  return blank.sort();
}

/**
 * Members left blank on purpose, by name. Nothing qualifies today — the sweep
 * that brought the count to zero found no member it could not describe — and
 * the list exists so that a future one is an argued exception rather than a
 * number quietly going up.
 *
 * Three numbers were in circulation for the size of that sweep and only one of
 * them is reproducible, so: 345 is what this gate counted at c5790e4 — 139
 * class slots, 177 shape members and 29 shape interfaces with an empty
 * `description` in `componentDocs.ts`, across 22 components — and it is the
 * figure the ceiling is set from, because `componentDocs.ts` is what the pages
 * and `llms-full.txt` actually read. 351 came from a working list that counted
 * blanks per SOURCE declaration, so a `classes` bag documented once and used by
 * two shapes was counted twice, and 29 was its count of components rather than
 * of interfaces. 395 came from a hand audit before this branch and cannot be
 * re-derived at all: the generated file had a different shape then, and every
 * version before c5790e4 fails to parse against the counter, so there is no
 * commit at which 395 can be confirmed or refuted. Neither is reconstructed
 * here — an unreproducible figure is written down as unreproducible, not
 * reverse-engineered into agreement. The defaults audit cost a slice to unpick
 * precisely because two numbers disagreed and nobody had recorded which one the
 * gate used.
 */
const DELIBERATE_BLANKS = new Set<string>([]);


describe("doc truth contract", () => {
  describe("self-check", () => {
    it("reads props out of both prose shapes", () => {
      // If either extractor silently stops matching, every assertion below
      // passes on an empty set.
      const { table, examples } = propsClaimedInProse("Dropdown", tagsOf("Dropdown"));
      expect(table.size, "no All Props rows were read").toBeGreaterThan(10);
      expect(examples.size, "no example attributes were read").toBeGreaterThan(3);
    });

    it("resolves a component's real props", () => {
      expect(propsOf("Dropdown").has("options")).toBe(true);
      expect(propsOf("Dropdown").has("notAProp")).toBe(false);
    });
  });

  it("names no `classes` key the map does not have", () => {
    // ADR 002 R8: a key ships only if something renders it. The converse rots
    // in the documentation instead — the key migration deleted or renamed
    // twenty keys and the examples kept teaching the old names, in the file
    // `llms-full.txt` is built from. A consumer following one writes a key that
    // does nothing, and cannot tell whether it is their mistake.
    const phantoms: string[] = [];
    for (const name of COMPONENTS) {
      const keys = classesKeysOf(name);
      if (keys.size === 0) continue;
      for (const claimed of new Set(classesClaimedInProse(name))) {
        if (!keys.has(claimed)) phantoms.push(`${name}.${claimed}`);
      }
    }
    expect(
      phantoms.sort(),
      "written into a `classes={{…}}` example, absent from the component's Classes map. " +
        "Either the key was renamed (see docs/adr/002-key-migration.json) or it became a " +
        "state attribute (002-state-attributes.json) — the example has to say so",
    ).toEqual([]);
  });

  it("reads examples and key maps at all", () => {
    // Both extractors, so the assertion above cannot pass on empty sets.
    expect(classesKeysOf("Dropdown").has("item"), "no Classes keys were read").toBe(true);
    expect(
      classesClaimedInProse("Dropdown").length,
      "no `classes` example keys were read",
    ).toBeGreaterThan(3);
    expect(classesKeysOf("Dropdown").has("optionSelected")).toBe(false);
  });

  it("names no prop the type does not have", () => {
    const phantoms: string[] = [];
    for (const name of COMPONENTS) {
      const props = propsOf(name);
      const tags = tagsOf(name);
      const { table, examples } = propsClaimedInProse(name, tags);
      for (const [source, claimed] of [["table", table], ["example", examples]] as const) {
        for (const prop of claimed) {
          if (BUILTIN.has(prop) || props.has(prop)) continue;
          phantoms.push(`${name}.${prop} (${source})`);
        }
      }
    }
    expect(
      phantoms.sort(),
      "documented in prose, absent from the type. `llms-full.txt` feeds codegen, so this is " +
        "a prop the product will generate against nothing. The usual cause is a `classes` " +
        "slot key written as a top-level prop",
    ).toEqual([]);
  });

  it("keeps those schema entries in step with the types", () => {
    // Generated, so the failure mode is staleness rather than absence. Without
    // this the entries are 200-odd props one edit away from being wrong, which
    // is the drift the generated All Props tables already avoid.
    expect(() =>
      execFileSync("node", ["scripts/build-subcomponent-schemas.mjs", "--check"], {
        stdio: "pipe",
      }),
    ).not.toThrow();
  }, SHELL_OUT_TIMEOUT);

  it("keeps DEMO-COVERAGE.md in step with the source", () => {
    /**
     * The record this gate exists for. `DEMO-COVERAGE.md` was written by hand,
     * had no generator, and its headline — "751 of 1135 props have no fixture,
     * 51 tier-A gaps" — was stale within two slices: the composition phase
     * added props, six sub-components were un-exported and 25 documented, and
     * nobody could re-derive the number to notice.
     *
     * It is generated now, and this is what stops it drifting again. Same
     * shape as `build-tokens.mjs --check` and the axe expectation list: shell
     * out to the generator rather than reimplement it, because a second copy
     * of the derivation is the drift it is meant to catch.
     */
    expect(() =>
      execFileSync("node", ["scripts/audit-demo-coverage.mjs", "--check"], { stdio: "pipe" }),
    ).not.toThrow();
  }, SHELL_OUT_TIMEOUT);

  /**
   * The other half of the same question: not "is the count written down" but
   * "is the unrendered part of the API growing".
   *
   * 648 props have no fixture and 151 of them put markup on screen that no
   * fixture produces — a variant, a mode, a slot, a portal. `AvatarBadge`'s
   * `variant` was one of them and carried a 3.76:1 colour pair that neither
   * contrast gate could measure, because measuring needs a render. The number
   * ratchets: it may fall, and a rise fails here.
   */
  it("keeps the unfixtured-markup count from growing", () => {
    expect(() =>
      execFileSync("node", ["scripts/audit-fixture-gap.mjs", "--check"], { stdio: "pipe" }),
    ).not.toThrow();
  }, SHELL_OUT_TIMEOUT);

  it("documents every key the component handles", () => {
    /**
     * The site's Keyboard Interactions section is this table, so a key the
     * component answers and the table omits is a key nobody can discover
     * except by pressing it. `ai/component-index.json` has carried an empty
     * `a11y.keyboard` array for all thirty components since it was generated;
     * this is the half that is actually written down.
     */
    const undocumented: string[] = [];
    for (const name of COMPONENTS) {
      const documented = keysDocumentedBy(name);
      for (const key of keysHandledBy(name)) {
        if (!documented.has(key)) undocumented.push(`${name}.${key === " " ? "Space" : key}`);
      }
    }
    expect(
      undocumented.sort(),
      "handled in the component's source, absent from its `## Keyboard Interactions` table. " +
        "The table may list more than the source handles — native behaviour and keys held in " +
        "variables are real — but never less",
    ).toEqual([]);
  });

  it("reads keys out of both sides", () => {
    // Both extractors, so the assertion above cannot pass on empty sets.
    expect(keysHandledBy("Slider").has("ArrowRight"), "no handled keys were read").toBe(true);
    expect(keysDocumentedBy("Slider").has("ArrowRight"), "no documented keys were read").toBe(true);
    expect(keysHandledBy("Slider").has("F13")).toBe(false);
  });

  it("keeps the component pages in step with the source they render from", () => {
    /**
     * The pages carried their own prop tables until this branch: 1595
     * hand-written rows, 263 of which named neither a prop, a `classes` slot
     * nor a data attribute, with 223 real props missing altogether. They read
     * `src/pages/demo/generated/componentDocs.ts` now, and this is what stops
     * that file — and the copy-paste snippets the consumer matrix compiles —
     * drifting from the schemas and .ai.md files it is built from.
     */
    expect(() =>
      execFileSync("node", ["scripts/build-component-docs.mjs", "--check"], { stdio: "pipe" }),
    ).not.toThrow();
  }, SHELL_OUT_TIMEOUT);

  it("documents every sub-component the package exports", () => {
    const rootExports = readFileSync("src/index.ts", "utf8");
    const undocumented: string[] = [];

    for (const name of COMPONENTS) {
      const schemaPath = `${SRC}/${name}/${name}.schema.json`;
      if (!existsSync(schemaPath)) continue;
      const schema = JSON.parse(readFileSync(schemaPath, "utf8")) as {
        properties?: Record<string, unknown>;
        subComponents?: Record<string, { properties?: Record<string, unknown> }>;
      };
      for (const tag of tagsOf(name)) {
        if (tag === name) continue;
        // Exported from the package root is the test for "public". A tag the
        // root does not re-export is the parent's own business.
        const exported = new RegExp(`\\b${tag}\\b`).test(rootExports);
        if (!exported) continue;
        if (!schema.subComponents?.[tag]) undocumented.push(`${name}.${tag}`);
      }
    }

    expect(
      undocumented.sort(),
      "exported from the package root with no schema entry. Either document it under " +
        "`subComponents` in the component's schema, or stop exporting it — ADR 002's " +
        "closeout un-exported MultiSelectDropdownShimmer rather than documenting it",
    ).toEqual([]);
  });

  /**
   * The description column, as a ratchet at zero.
   *
   * 345 slots and shape members across 22 components rendered an empty cell —
   * 139 class slots, 177 shape members, 29 shape interfaces — which on the site
   * is a row that says a name and nothing else, and in `llms-full.txt` is a
   * slot the product will target with no idea what it is for. Stepper alone had
   * 46. They are all written now, so the ceiling is 0 rather than a figure to
   * work down from: a blank arriving is a new one, not a leftover.
   *
   * Down-only. A member that genuinely cannot be described goes in
   * `DELIBERATE_BLANKS` by name with the reason beside it, which is a line in a
   * diff someone reviews; raising a count is not.
   */
  it("renders no empty description", () => {
    const blank = blankDescriptions(COMPONENT_DOCS).filter((entry) => !DELIBERATE_BLANKS.has(entry));
    expect(
      blank,
      "documented with a name and nothing else. The site renders this as an empty cell and " +
        "the codegen product reads it as a slot with no purpose. Describe what the slot is " +
        "FOR — restating the name (`root` as \"the root element\") is worse than blank, because " +
        "blank is at least honest. If it cannot be described, add it to DELIBERATE_BLANKS " +
        "with the reason",
    ).toEqual([]);
  });

  it("reads descriptions at all", () => {
    // Without this the assertion above passes on a shape it failed to walk —
    // the counter reporting zero because it found nothing, not because nothing
    // is blank.
    const planted: Record<string, ComponentDoc> = {
      Planted: {
        ...COMPONENT_DOCS.Switch,
        classes: [{ map: "PlantedClasses", keys: [{ name: "root", type: "string", required: false, description: "" }] }],
        shapes: [
          { name: "PlantedShape", description: "", members: [{ name: "value", type: "string", required: true, description: "" }] },
        ],
      },
    };
    expect(blankDescriptions(planted)).toEqual([
      "Planted: PlantedClasses.root",
      "Planted: PlantedShape",
      "Planted: PlantedShape.value",
    ]);
    expect(blankDescriptions({ Switch: COMPONENT_DOCS.Switch })).toEqual([]);
  });
});
