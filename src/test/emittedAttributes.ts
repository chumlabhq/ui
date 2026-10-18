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
import { existsSync, readdirSync, readFileSync } from "node:fs";
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

/** The component directory a file sits in, or `null` outside `src/components`. */
const componentDirOf = (file: string): string | null => /[\\/]src[\\/]components[\\/]([^\\/]+)[\\/]/.exec(file)?.[1] ?? null;

/** The leftmost identifier of every JSX tag a file renders and every function it calls. */
function usedNames(sf: ts.SourceFile): Set<string> {
  const out = new Set<string>();
  const leftmost = (e: ts.Node): string | null =>
    ts.isIdentifier(e)
      ? e.text
      : ts.isPropertyAccessExpression(e) || ts.isPropertyAccessChain(e)
        ? leftmost(e.expression)
        : null;
  const visit = (node: ts.Node): void => {
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      const name = leftmost(node.tagName);
      if (name) out.add(name);
    }
    if (ts.isCallExpression(node)) {
      const name = leftmost(node.expression);
      if (name) out.add(name);
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return out;
}

/** The local names an import declaration binds. */
const boundNames = (node: ts.ImportDeclaration): string[] => {
  const clause = node.importClause;
  if (!clause) return [];
  const names = clause.name ? [clause.name.text] : [];
  const bindings = clause.namedBindings;
  if (bindings && ts.isNamespaceImport(bindings)) names.push(bindings.name.text);
  if (bindings && ts.isNamedImports(bindings))
    for (const el of bindings.elements) if (!el.isTypeOnly) names.push(el.name.text);
  return names;
};

/**
 * Every non-test file a component's entry reaches. Type-only imports are not
 * followed: a type from another component's module renders nothing, and
 * following it would credit this component with everything that one emits.
 *
 * Nor is an import into ANOTHER component's directory followed unless this
 * file renders or calls something it binds, and a re-export across components
 * never is. Table re-exported two of Pagination's constants, and following that
 * line credited Table with everything Pagination, its Dropdown and their
 * Checkbox emit: `data-direction`, `data-disabled`, `data-reduce-motion`.
 */
export function graph(entry: string, read: Read): string[] {
  const seen = new Set<string>();
  const stack = [entry];
  while (stack.length) {
    const file = stack.pop()!;
    if (seen.has(file) || /__tests__|\.test\./.test(file)) continue;
    seen.add(file);
    const sf = parse(file, read);
    let used: Set<string> | null = null;
    const crosses = (next: string) => {
      const dir = componentDirOf(next);
      return dir !== null && dir !== componentDirOf(file);
    };
    const visit = (node: ts.Node): void => {
      if (
        (ts.isImportDeclaration(node) && !node.importClause?.isTypeOnly) ||
        (ts.isExportDeclaration(node) && !node.isTypeOnly)
      ) {
        const spec = node.moduleSpecifier;
        if (spec && ts.isStringLiteral(spec)) {
          const next = resolveImport(file, spec.text);
          if (next && crosses(next)) {
            used ??= usedNames(sf);
            const names = ts.isImportDeclaration(node) ? boundNames(node) : [];
            if (names.some((n) => used!.has(n))) stack.push(next);
          } else if (next) stack.push(next);
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
    visit(sf);
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

/** The name of the nearest named function or variable a node sits inside. */
const ownerOf = (node: ts.Node, sf: ts.SourceFile): string => {
  for (let n = node.parent; n; n = n.parent) {
    if ((ts.isVariableDeclaration(n) || ts.isFunctionDeclaration(n)) && n.name && ts.isIdentifier(n.name)) {
      return n.name.text;
    }
    if (ts.isPropertyAssignment(n) || ts.isMethodDeclaration(n)) return n.name.getText(sf);
  }
  return "(module)";
};

/** One element in a render graph that puts an attribute on an item. */
export interface ItemSite {
  /** `file › owner`: stable across edits that only move lines, unlike `at`. */
  site: string;
  /** `file:line`, for reading the source. */
  at: string;
}

/**
 * Where a component's render graph puts `attribute` on an ITEM: an element
 * repeated once per entry of an open surface. It is read as one that also
 * carries `data-highlighted`, an option / menu item / grid cell role, or a list
 * `key`. The key is what finds a TimePicker clock number, which is mapped from
 * the hour or minute list and carries no role at all. `emittedBy` answers for
 * the whole component, and nearly every one marks its root `data-disabled`, so
 * it cannot say which ones mark an item.
 *
 * Every site is returned, not just whether one exists. CascadingDropdown has
 * two — the top-level item and the submenu's — and a check keyed by component
 * measured the first and called the component done while the second shipped
 * undimmed.
 */
export function itemSitesOf(
  name: string,
  attribute: string,
  read: Read = (file) => readFileSync(file, "utf8"),
): ItemSite[] {
  const root = process.cwd();
  const sites: ItemSite[] = [];
  for (const file of graph(join(resolve(root, "src/components", name), "index.ts"), read)) {
    const sf = parse(file, read);
    const rel = file.slice(root.length + 1);
    const visit = (node: ts.Node): void => {
      if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
        const attrs = node.attributes.properties.filter(ts.isJsxAttribute);
        const names = attrs.map((a) => a.name.getText(sf));
        const role = attrs.find((a) => a.name.getText(sf) === "role")?.initializer?.getText(sf) ?? "";
        if (
          names.includes(attribute) &&
          (names.includes("data-highlighted") || names.includes("key") || /option|menuitem|gridcell/.test(role))
        ) {
          sites.push({
            site: `${rel.split("/").pop()} › ${ownerOf(node, sf)}`,
            at: `${rel}:${sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1}`,
          });
        }
      }
      ts.forEachChild(node, visit);
    };
    visit(sf);
  }
  return sites;
}

/**
 * Where a component's render graph puts `aria-pressed` and `data-active` on the
 * same element: a toggle in a group, reporting which of its siblings is on. The
 * attribute pair is what a slot's `data-[active]:` token styles, so a site found
 * here with nothing painting it is a toggle whose state only a screen reader sees.
 */
export function pressedToggleSitesOf(
  name: string,
  read: Read = (file) => readFileSync(file, "utf8"),
): ItemSite[] {
  const root = process.cwd();
  const sites: ItemSite[] = [];
  for (const file of graph(join(resolve(root, "src/components", name), "index.ts"), read)) {
    const sf = parse(file, read);
    const rel = file.slice(root.length + 1);
    const visit = (node: ts.Node): void => {
      if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
        const names = node.attributes.properties.filter(ts.isJsxAttribute).map((a) => a.name.getText(sf));
        if (names.includes("aria-pressed") && names.includes("data-active")) {
          sites.push({
            site: `${rel.split("/").pop()} › ${ownerOf(node, sf)}`,
            at: `${rel}:${sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1}`,
          });
        }
      }
      ts.forEachChild(node, visit);
    };
    visit(sf);
  }
  return sites;
}

/**
 * Where a component's render graph draws loading rows inside an open surface:
 * an element mapped from `Array.from({ length })` (a placeholder repeat, with no
 * data behind it), in a file that renders a `listbox` or `menu`, or is imported
 * by one that does. The second half is what separates a dropdown's shimmer from
 * the in-flow skeletons Table, Avatar and CountryFlag draw, which have no
 * surface to sit in.
 */
export function loadingRowSitesOf(
  name: string,
  read: Read = (file) => readFileSync(file, "utf8"),
): ItemSite[] {
  const root = process.cwd();
  const files = graph(join(resolve(root, "src/components", name), "index.ts"), read);
  const SURFACE = /role=["{]?["'](listbox|menu)["']/;
  const importersOf = (target: string) =>
    files.filter((file) => {
      let hit = false;
      const visit = (node: ts.Node): void => {
        if (ts.isImportDeclaration(node) && !node.importClause?.isTypeOnly && ts.isStringLiteral(node.moduleSpecifier)) {
          if (resolveImport(file, node.moduleSpecifier.text) === target) hit = true;
        }
        ts.forEachChild(node, visit);
      };
      visit(parse(file, read));
      return hit;
    });
  const sites: ItemSite[] = [];
  for (const file of files) {
    const sf = parse(file, read);
    const rel = file.slice(root.length + 1);
    const inSurface = () => SURFACE.test(sf.text) || importersOf(file).some((f) => SURFACE.test(read(f)));
    const visit = (node: ts.Node): void => {
      if (
        ts.isCallExpression(node) &&
        ts.isPropertyAccessExpression(node.expression) &&
        node.expression.name.text === "map" &&
        ts.isCallExpression(node.expression.expression) &&
        node.expression.expression.expression.getText(sf) === "Array.from" &&
        node.expression.expression.arguments[0] &&
        ts.isObjectLiteralExpression(node.expression.expression.arguments[0]) &&
        inSurface()
      ) {
        sites.push({
          site: `${rel.split("/").pop()} › ${ownerOf(node, sf)}`,
          at: `${rel}:${sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1}`,
        });
      }
      ts.forEachChild(node, visit);
    };
    visit(sf);
  }
  return sites;
}

/**
 * Every `data-*` attribute a component's `.ai.md` names in its
 * `## Data Attributes` section — the bullets and the names written mid-line,
 * since a section that lists `data-disabled`, `data-error`, `data-valid` on one
 * line documents all three. Variant syntax (`data-[state=open]:`) is not a name.
 */
export function documentedAttributes(
  name: string,
  read: Read = (file) => readFileSync(file, "utf8"),
  root = process.cwd(),
): Set<string> {
  const dir = resolve(root, "src/components", name);
  const docs = readdirSync(dir).filter((f) => f.endsWith(".ai.md")).map((f) => read(join(dir, f)));
  const out = new Set<string>();
  for (const doc of docs) {
    const section = /^## Data Attributes[^\n]*\n([\s\S]*?)(?=^## |(?![\s\S]))/m.exec(doc)?.[1] ?? "";
    for (const m of section.matchAll(/(?<![\w[-])data-[a-z][a-z-]*[a-z]/g)) out.add(m[0]);
  }
  return out;
}

/** Everything one component, and anything it renders, emits. */
export const emittedBy = (name: string, read: Read = (file) => readFileSync(file, "utf8")) =>
  emitted(graph(join(resolve(process.cwd(), "src/components", name), "index.ts"), read), read);
