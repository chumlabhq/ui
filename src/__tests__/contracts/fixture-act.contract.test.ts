/**
 * Fixture acts stay runnable in a browser.
 *
 * Every act imported `fireEvent` from @testing-library, and the fixture page —
 * the one visual, a11y-full and every e2e spec drive — never called `act` at
 * all. Fifty fixtures named for a state they reach by interaction rendered
 * their base state to all three suites, and nothing failed, because a closed
 * dropdown is a perfectly valid render. The gap was found by hand, three
 * fixtures at a time.
 *
 * Two halves close it. `ActTools` is the typed half: an act receives its
 * gestures rather than importing them, so there is no jsdom API in scope. This
 * is the other half — an import is not something a type can forbid, so the
 * import list is checked here.
 *
 * `fixture-act.spec.ts` covers the third failure mode, an act that runs and
 * changes nothing.
 */
import { describe, expect, it } from "vitest";
import ts from "typescript";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const FIXTURES = "src/__tests__/fixtures";

/**
 * The one module allowed to reach for the test library: it supplies the
 * contract tier's `ActTools`, and nothing the fixture page loads imports it.
 */
const CONTRACT_TIER = "_act.contract.ts";

/** Module specifiers that exist in jsdom and vitest but not in a browser page. */
const NOT_IN_A_BROWSER = [/^@testing-library\//, /^vitest$/, /^node:/, /^jsdom$/];

const fixtureModules = () =>
  readdirSync(FIXTURES).filter((file) => /\.tsx?$/.test(file) && file !== CONTRACT_TIER);

/** Every module specifier a file imports, including type-only imports. */
function importsOf(text: string, file: string): string[] {
  const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const found: string[] = [];
  const visit = (node: ts.Node) => {
    if (
      (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
      node.moduleSpecifier &&
      ts.isStringLiteral(node.moduleSpecifier)
    ) {
      found.push(node.moduleSpecifier.text);
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
  return found;
}

const offending = (text: string, file: string) =>
  importsOf(text, file).filter((specifier) =>
    NOT_IN_A_BROWSER.some((pattern) => pattern.test(specifier)),
  );

/**
 * Counted, not assumed. A self-check proves the predicate can fail; this
 * proves it was pointed at something. `overrides.contract` had a working
 * shape and ran it over 3 of 340 slots for months.
 */
const asserted = { n: 0 };

describe("fixture act contract", () => {
  it.each(fixtureModules())("%s imports nothing a browser cannot load", (file) => {
    const text = readFileSync(join(FIXTURES, file), "utf8");
    expect(offending(text, file)).toEqual([]);
  });

  it("catches the import it exists to catch", () => {
    const planted = 'import { fireEvent } from "@testing-library/react";\nexport const x = fireEvent;\n';
    expect(offending(planted, "planted.fixtures.tsx")).toEqual(["@testing-library/react"]);
  });

  /**
   * The type is the primary guard, so it is worth stating what it guards: an
   * act with the old one-parameter shape still compiles, and would then have no
   * route to a gesture at all.
   */
  it("gives every act the tools as its second parameter", () => {
    const withAct = fixtureModules().filter((file) => file.endsWith(".fixtures.tsx"));
    const missing: string[] = [];
    for (const file of withAct) {
      asserted.n += 1;
      const text = readFileSync(join(FIXTURES, file), "utf8");
      const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
      const visit = (node: ts.Node) => {
        if (
          ts.isPropertyAssignment(node) &&
          node.name.getText(source) === "act" &&
          (ts.isArrowFunction(node.initializer) || ts.isFunctionExpression(node.initializer)) &&
          node.initializer.parameters.length < 2
        ) {
          missing.push(`${file}: ${node.initializer.getText(source).split("\n")[0]}`);
        }
        ts.forEachChild(node, visit);
      };
      visit(source);
    }
    expect(missing).toEqual([]);
  });

  it("asserted on a real number of fixture modules", () => {
    console.log(`FIXTURE_ACT asserted on ${asserted.n} fixture modules`);
    expect(asserted.n, "this contract iterated nothing").toBeGreaterThan(20);
  });
});
