/**
 * A style variant keyed to an attribute nothing emits is a style that never
 * paints, and it passes every other gate: the class is in the DOM, the merge is
 * correct, the contrast of the colour it names is fine. It just never matches.
 *
 * InternationalPhoneInput shipped one. Its country list's item styled
 * `data-[focused]:` — the name ADR 002 converged onto `data-highlighted`, which
 * is what the SearchableDropdown it renders actually emits — so its highlight
 * colour was a dead declaration that nothing caught.
 *
 * So for every component this collects each attribute variant in its own
 * source and in the shared utilities it imports (`data-[x]`, `data-[x=y]`,
 * `group-data-[x]/name`, `peer-data-[x]`, `has-[[data-x]]`, `[&[data-x]]` and
 * the rest of the `*-data-[…]` family), and checks each against what that
 * component — or anything it renders — emits. Both sides come from the
 * TypeScript AST, so a comment can satisfy neither, and the emitted side is
 * derived from source rather than kept as a list: JSX attributes, quoted
 * `"data-*"` keys in object literals that are spread onto elements, and
 * `setAttribute("data-*")`.
 *
 * A value is checked as well as a name where it can be: `data-[state=open]`
 * needs some site to be able to emit `open`. Where any site's value is not a
 * literal — `data-state={checkboxState}` — the value cannot be decided from
 * source, and the variant is counted as name-checked only. The printed line
 * says how many of those there are, so the blind spot has a size.
 *
 * The same `[data-x]` inside a stylesheet the library injects is paint too, and
 * is read. Out of scope, stated so it is not mistaken for coverage:
 * `querySelector` and `closest` strings (behaviour, not paint),
 * attributes a consumer sets (`data-autofocus`), and `aria-[…]` variants.
 */
import { describe, expect, it } from "vitest";
import ts from "typescript";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

const ROOT = process.cwd();
const COMPONENTS = resolve(ROOT, "src/components");

/** The thirty, from the library's own index rather than a list kept here. */
const NAMES: string[] = (
  JSON.parse(readFileSync(resolve(ROOT, "ai/component-index.json"), "utf8")) as {
    components: { name: string }[];
  }
).components.map((component) => component.name);

export interface Variant {
  component: string;
  attribute: string;
  value: string | null;
  token: string;
  file: string;
}

export interface Analysis {
  variants: Variant[];
  unmatched: (Variant & { reason: string })[];
  components: number;
  /** Variants carrying a value that no site's literals could confirm or refute. */
  valueUndecidable: number;
}

/**
 * Every Tailwind form that keys a declaration to a `data-*` attribute.
 *
 * `data-[x]`, `data-[x=y]`, and any prefix ending in `-data-[` — `group-`,
 * `peer-`, `not-`, `in-`, `has-` — with an optional `/name`. Then the
 * arbitrary forms, where the attribute sits inside a selector of its own:
 * `has-[[data-x]]`, `[&[data-x]]`, `[[data-x]_&]`.
 */
const SHORTHAND = /(?:^|[\s:!])(?:[a-z*]+-)*data-\[([a-z][a-z0-9-]*)(?:=["']?([^\]"']+)["']?)?\]/g;
const ARBITRARY = /\[[^\s\]]*\[data-([a-z][a-z0-9-]*)(?:=["']?([^\]"']+)["']?)?\]/g;

/**
 * A plain `[data-x]` selector counts only inside a stylesheet the library
 * injects — Accordion's print rules are the one today — because that is paint.
 * The same selector in a `querySelector` or `closest` call is behaviour, and
 * often names an attribute the consumer sets.
 */
const STYLESHEET = /\[data-([a-z][a-z0-9-]*)(?:=["']?([^\]"']+)["']?)?\]/g;
const isStylesheet = (text: string) => /\{[^}]*:[^}]*\}/.test(text);

type Read = (file: string) => string;

const parse = (file: string, read: Read) =>
  ts.createSourceFile(file, read(file), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);

function resolveImport(from: string, spec: string): string | null {
  if (!spec.startsWith(".")) return null;
  const base = resolve(dirname(from), spec).replace(/\.js$/, "");
  for (const candidate of [`${base}.ts`, `${base}.tsx`, `${base}/index.ts`, `${base}/index.tsx`]) {
    if (existsSync(candidate)) return candidate;
  }
  return null;
}

/**
 * Every non-test file a component's entry reaches. Type-only imports are not
 * followed: a type from another component's module renders nothing, and
 * following it would credit this component with everything that one emits.
 */
function graph(entry: string, read: Read): string[] {
  const seen = new Set<string>();
  const stack = [entry];
  while (stack.length) {
    const file = stack.pop()!;
    if (seen.has(file) || /__tests__|\.test\./.test(file)) continue;
    seen.add(file);
    const visit = (node: ts.Node): void => {
      if (
        (ts.isImportDeclaration(node) && !node.importClause?.isTypeOnly) ||
        (ts.isExportDeclaration(node) && !node.isTypeOnly)
      ) {
        const spec = node.moduleSpecifier;
        if (spec && ts.isStringLiteral(spec)) {
          const next = resolveImport(file, spec.text);
          if (next) stack.push(next);
        }
      }
      if (
        ts.isCallExpression(node) &&
        node.expression.kind === ts.SyntaxKind.ImportKeyword &&
        node.arguments[0] &&
        ts.isStringLiteral(node.arguments[0])
      ) {
        const next = resolveImport(file, node.arguments[0].text);
        if (next) stack.push(next);
      }
      ts.forEachChild(node, visit);
    };
    visit(parse(file, read));
  }
  return [...seen].sort();
}

/**
 * The values an initializer can produce, or `null` when that cannot be read off
 * the syntax. A boolean attribute renders as `"true"`, so `x || undefined` and
 * a bare attribute both answer `true`.
 */
function values(expr: ts.Expression | undefined): Set<string> | null {
  if (!expr) return new Set(["true"]);
  if (ts.isParenthesizedExpression(expr) || ts.isAsExpression(expr)) return values(expr.expression);
  if (ts.isStringLiteralLike(expr)) return new Set([expr.text]);
  if (expr.kind === ts.SyntaxKind.TrueKeyword) return new Set(["true"]);
  if (expr.kind === ts.SyntaxKind.NullKeyword) return new Set();
  if (ts.isIdentifier(expr) && expr.text === "undefined") return new Set();
  if (ts.isConditionalExpression(expr)) {
    const a = values(expr.whenTrue);
    const b = values(expr.whenFalse);
    return a && b ? new Set([...a, ...b]) : null;
  }
  if (ts.isBinaryExpression(expr) && expr.operatorToken.kind === ts.SyntaxKind.BarBarToken) {
    // `flag || undefined`: present as "true" or absent.
    const right = values(expr.right);
    if (right && right.size === 0) return new Set(["true"]);
  }
  return null;
}

/** name → the values it can take, `null` once any site is undecidable. */
function emitted(files: string[], read: Read): Map<string, Set<string> | null> {
  const out = new Map<string, Set<string> | null>();
  const add = (name: string, found: Set<string> | null) => {
    if (!out.has(name)) {
      out.set(name, found);
      return;
    }
    const prior = out.get(name)!;
    out.set(name, prior && found ? new Set([...prior, ...found]) : null);
  };
  for (const file of files) {
    const visit = (node: ts.Node): void => {
      if (ts.isJsxAttribute(node)) {
        const name = node.name.getText();
        if (name.startsWith("data-")) {
          const init = node.initializer;
          add(
            name,
            !init
              ? new Set(["true"])
              : ts.isStringLiteral(init)
                ? new Set([init.text])
                : ts.isJsxExpression(init)
                  ? values(init.expression)
                  : null,
          );
        }
      }
      if (ts.isPropertyAssignment(node) && ts.isStringLiteral(node.name) && node.name.text.startsWith("data-")) {
        add(node.name.text, values(node.initializer));
      }
      if (
        ts.isCallExpression(node) &&
        /setAttribute$/.test(node.expression.getText()) &&
        node.arguments[0] &&
        ts.isStringLiteral(node.arguments[0]) &&
        node.arguments[0].text.startsWith("data-")
      ) {
        add(node.arguments[0].text, values(node.arguments[1]));
      }
      ts.forEachChild(node, visit);
    };
    visit(parse(file, read));
  }
  return out;
}

/** String literals through the compiler, so a comment is never read. */
function literals(file: string, read: Read): string[] {
  const out: string[] = [];
  const visit = (node: ts.Node): void => {
    if (
      ts.isStringLiteral(node) ||
      ts.isNoSubstitutionTemplateLiteral(node) ||
      ts.isTemplateHead(node) ||
      ts.isTemplateMiddle(node) ||
      ts.isTemplateTail(node)
    ) {
      out.push(node.text);
    }
    ts.forEachChild(node, visit);
  };
  visit(parse(file, read));
  return out;
}

/**
 * The whole check. `overlay` replaces a file's contents in memory, which is how
 * the self-check plants a dead variant without touching the tree.
 */
export function analyse(overlay: Record<string, string> = {}): Analysis {
  const read: Read = (file) => overlay[file] ?? readFileSync(file, "utf8");
  const variants: Variant[] = [];
  const unmatched: Analysis["unmatched"] = [];
  let valueUndecidable = 0;

  for (const name of NAMES) {
    const own = join(COMPONENTS, name);
    const files = graph(join(own, "index.ts"), read);
    const emits = emitted(files, read);
    // Variants are read from the component's own directory and from shared
    // utilities, never from another component it renders: that one's variants
    // are checked under its own name, against its own emissions.
    const styled = files.filter((file) => file.startsWith(`${own}/`) || !file.startsWith(`${COMPONENTS}/`));
    const seen = new Set<string>();
    for (const file of styled) {
      for (const text of literals(file, read)) {
        for (const pattern of isStylesheet(text) ? [STYLESHEET] : [SHORTHAND, ARBITRARY]) {
          for (const match of text.matchAll(pattern)) {
            const variant: Variant = {
              component: name,
              attribute: `data-${match[1]}`,
              value: match[2] ?? null,
              token: match[0].trim(),
              file: relative(ROOT, file),
            };
            const key = `${variant.attribute}=${variant.value}@${variant.file}`;
            if (seen.has(key)) continue;
            seen.add(key);
            variants.push(variant);

            if (!emits.has(variant.attribute)) {
              unmatched.push({ ...variant, reason: `nothing ${name} renders emits ${variant.attribute}` });
              continue;
            }
            const can = emits.get(variant.attribute);
            if (variant.value === null) continue;
            if (can === null) valueUndecidable += 1;
            else if (!can!.has(variant.value)) {
              unmatched.push({
                ...variant,
                reason: `${variant.attribute} is emitted as ${[...can!].map((v) => `"${v}"`).join(", ") || "nothing"}, never "${variant.value}"`,
              });
            }
          }
        }
      }
    }
  }

  return { variants, unmatched, components: NAMES.length, valueUndecidable };
}

describe("attribute variants contract", () => {
  const result = analyse();
  const withVariants = new Set(result.variants.map((v) => v.component)).size;

  it("reads a population, and says how big it is", () => {
    console.log(
      `${result.variants.length} variants across ${withVariants} components, ` +
        `${result.unmatched.length} unmatched ` +
        `(${result.valueUndecidable} with a value no literal could decide; ` +
        `${result.components - withVariants} of ${result.components} components carry none)`,
    );
    // A walker that found nothing would pass the assertion below vacuously.
    expect(result.variants.length).toBeGreaterThan(0);
    expect(withVariants).toBeGreaterThan(10);
  });

  it("styles no attribute that nothing emits", () => {
    expect(
      result.unmatched.map((v) => `${v.component}: ${v.token} in ${v.file} — ${v.reason}`),
    ).toEqual([]);
  });

  /**
   * The plant goes through `analyse` itself, on an in-memory copy of a real
   * constants file, so what is proven is the walk, the extraction and the
   * comparison together — not a re-implementation of them.
   */
  it("self-check: catches a dead variant planted in a copy of a constants file", () => {
    const file = resolve(COMPONENTS, "Dropdown/utils/constants.ts");
    const planted = `${readFileSync(file, "utf8")}\nexport const PLANTED = "data-[planted-dead]:opacity-50 group-data-[state=planted]/x:hidden";\n`;
    const caught = analyse({ [file]: planted }).unmatched.filter((v) => v.component === "Dropdown");
    expect(caught.map((v) => v.token)).toEqual(
      expect.arrayContaining(["data-[planted-dead]", "group-data-[state=planted]"]),
    );
  });
});
