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
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import index from "../../../ai/component-index.json";

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
  });

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
  });

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
  });

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
});
