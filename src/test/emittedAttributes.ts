/**
 * What each component emits, read from source: the import graph from its entry,
 * and every `data-*` attribute that graph puts on an element — JSX attributes,
 * quoted `"data-*"` keys in object literals spread onto elements, and
 * `setAttribute("data-*")`.
 *
 * Shared by `attribute-variants.contract` (a variant keyed to an attribute
 * nothing emits) and `e2e/default-state.spec.ts` (which components highlight an
 * item), so both derive their population from the same reading of the code
 * rather than from two lists that can drift. Test code only.
 */
import ts from "typescript";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

export type Read = (file: string) => string;

export const parse = (file: string, read: Read) =>
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
export function graph(entry: string, read: Read): string[] {
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
export function emitted(files: string[], read: Read): Map<string, Set<string> | null> {
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

/** The thirty, from the library's own index rather than a list kept here. */
export const componentNames = (root = process.cwd()): string[] =>
  (
    JSON.parse(readFileSync(resolve(root, "ai/component-index.json"), "utf8")) as {
      components: { name: string }[];
    }
  ).components.map((component) => component.name);

/**
 * Where a component's render graph puts `attribute` on an ITEM: an element that
 * also carries `data-highlighted`, or whose role is an option, a menu item or a
 * grid cell. `emittedBy` answers for the whole component, and nearly every one
 * marks its root `data-disabled`, so it cannot say which ones mark an item.
 * Returns `file:line` for each site, empty when there is none.
 */
export function itemSitesOf(
  name: string,
  attribute: string,
  read: Read = (file) => readFileSync(file, "utf8"),
): string[] {
  const root = process.cwd();
  const sites: string[] = [];
  for (const file of graph(join(resolve(root, "src/components", name), "index.ts"), read)) {
    const sf = parse(file, read);
    const visit = (node: ts.Node): void => {
      if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
        const attrs = node.attributes.properties.filter(ts.isJsxAttribute);
        const names = attrs.map((a) => a.name.getText(sf));
        const role = attrs.find((a) => a.name.getText(sf) === "role")?.initializer?.getText(sf) ?? "";
        if (names.includes(attribute) && (names.includes("data-highlighted") || /option|menuitem|gridcell/.test(role))) {
          sites.push(`${file.slice(root.length + 1)}:${sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1}`);
        }
      }
      ts.forEachChild(node, visit);
    };
    visit(sf);
  }
  return sites;
}

/** Everything one component, and anything it renders, emits. */
export const emittedBy = (name: string, read: Read = (file) => readFileSync(file, "utf8")) =>
  emitted(graph(join(resolve(process.cwd(), "src/components", name), "index.ts"), read), read);
