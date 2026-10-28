/**
 * Direction is read in one place.
 *
 * The RTL audit (A2, cause C3) found four components reading direction four
 * ways — `getComputedStyle(...).direction` in Stepper and TabPanel, a `dir`
 * prop compared to `"rtl"` in AccordionTrigger, and `closest("[dir]")` with a
 * `document.dir` fallback in CascadingDropdown — and two that wrote a direction
 * nobody asked for: Accordion and AvatarGroup defaulted `dir` to `"ltr"` and
 * rendered it, so both laid themselves out left-to-right inside a right-to-left
 * page. `readDirection` and `isRtl` in `src/utils/isBrowser.ts` are the one
 * reader now (nearest `dir`, the computed direction, then the document's),
 * called at the moment direction matters, so nothing caches a stale one. They
 * live in that module, not their own, so Rollup ships them in the chunk every
 * entry already loads instead of a new one.
 *
 * Read on the AST, not by grep, so a comment that mentions `document.dir` is
 * not a finding and a reader spelled differently is. Flagged anywhere in the
 * shipped components and utils except the helper itself:
 *   - `.direction` read off `getComputedStyle(...)`;
 *   - `document.dir` or `documentElement.dir`;
 *   - a selector or attribute name naming `dir` (`"[dir]"`, `getAttribute("dir")`);
 *   - a comparison against `"rtl"` or `"ltr"`;
 *   - a hard-coded direction written out: a `dir` JSX attribute whose value is
 *     a literal, a `dir` prop with a default, or a constant initialised to one.
 */
import { describe, expect, it } from "vitest";
import ts from "typescript";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

/** The site's own files, which the library does not ship — the scope `constants.contract` uses. */
const NOT_SHIPPED =
  /(CatalogSection|ChumlabComparison|GetStarted|SiteHeader|SiteFooter|BuyMeCoffee|WhyChumlab|Typographic|UserMenu|Announcement|FaqLogo|Reveal|\/ui\/|BrandLogo|__tests__)/;

const HELPER = /^utils\/isBrowser\.ts$/;

/** Files the walk read when this was written; fewer means it stopped reading something. */
const FLOOR = 491;

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) return entry === "__tests__" ? [] : walk(path);
    return /\.tsx?$/.test(entry) && !/\.(test|spec|stories)\.tsx?$|\.d\.ts$/.test(entry) ? [path] : [];
  });

const DIRECTION_LITERAL = /^(rtl|ltr)$/i;

/**
 * Written directions that are a decision, not a default. Each is matched by
 * file and finding without its line number, must still be found, and says
 * why. Decision D3 (A2c): a digit row reads left to right in Arabic and
 * Hebrew interfaces too, so OtpInput's boxes keep that order in a
 * right-to-left page and their arrow keys follow the row they paint. The
 * phone input's number field needs no entry: every engine already lays out
 * type="tel" left to right, which rtl-keys pins.
 */
const DECIDED: Array<{ file: string; finding: string; reason: string }> = [
  { file: "components/OtpInput/OtpInput.tsx", finding: 'renders a hard-coded dir="ltr"', reason: "D3: the code's boxes are one digit row, entered and read left to right in every script." },
];

const decided = (finding: string) =>
  DECIDED.find((d) => finding.startsWith(`${d.file}:`) && finding.replace(/^[^ ]+ /, "") === d.finding);

export function directionReads(file: string, source: string): string[] {
  const sf = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, file.endsWith("x") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const found: string[] = [];
  const at = (node: ts.Node, what: string) =>
    found.push(`${file}:${sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1} ${what}`);
  const isDirectionLiteral = (node: ts.Node | undefined) =>
    !!node && (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) && DIRECTION_LITERAL.test(node.text);
  const hasDirectionLiteral = (node: ts.Node): boolean =>
    isDirectionLiteral(node) || (ts.forEachChild(node, (child) => (hasDirectionLiteral(child) ? true : undefined)) ?? false);

  const visit = (node: ts.Node): void => {
    if (ts.isPropertyAccessExpression(node)) {
      const name = node.name.text;
      const target = node.expression;
      if (name === "direction" && ts.isCallExpression(target) && /getComputedStyle$/.test(target.expression.getText(sf))) {
        at(node, "reads getComputedStyle(...).direction");
      }
      if (name === "dir" && /^(document|document\.documentElement|[\w.]*documentElement)$/.test(target.getText(sf))) {
        at(node, `reads ${node.getText(sf)}`);
      }
    }
    if ((ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) && /\[dir\b/.test(node.text)) {
      at(node, `selects on dir: "${node.text}"`);
    }
    if (ts.isCallExpression(node) && /\.(get|has)Attribute$/.test(node.expression.getText(sf)) && node.arguments[0] && ts.isStringLiteral(node.arguments[0]) && node.arguments[0].text === "dir") {
      at(node, "reads the dir attribute");
    }
    if (ts.isBinaryExpression(node) && [ts.SyntaxKind.EqualsEqualsEqualsToken, ts.SyntaxKind.ExclamationEqualsEqualsToken, ts.SyntaxKind.EqualsEqualsToken, ts.SyntaxKind.ExclamationEqualsToken].includes(node.operatorToken.kind) && (isDirectionLiteral(node.left) || isDirectionLiteral(node.right))) {
      at(node, `compares a direction: ${node.getText(sf)}`);
    }
    if (ts.isJsxAttribute(node) && node.name.getText(sf) === "dir" && node.initializer && hasDirectionLiteral(node.initializer)) {
      at(node, `renders a hard-coded ${node.getText(sf)}`);
    }
    if (ts.isBindingElement(node) && (node.propertyName ?? node.name).getText(sf) === "dir" && node.initializer) {
      at(node, `defaults the dir prop: ${node.getText(sf)}`);
    }
    if (ts.isVariableDeclaration(node) && /DIRECTION/i.test(node.name.getText(sf)) && node.initializer && hasDirectionLiteral(node.initializer)) {
      at(node, `hard-codes a direction: ${node.getText(sf)}`);
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return found;
}

describe("direction-reads contract", () => {
  const files = [...walk("src/components"), ...walk("src/utils")]
    .map((path) => ({ path, rel: relative("src", path) }))
    .filter(({ rel }) => !NOT_SHIPPED.test(rel) && !HELPER.test(rel));

  it("reads direction only through readDirection/isRtl and writes none by default", () => {
    const all = files.flatMap(({ path, rel }) => directionReads(rel, readFileSync(path, "utf8")));
    const findings = all.filter((f) => !decided(f));
    console.log(`DIRECTION_READS files ${files.length} (floor ${FLOOR}), findings ${findings.length}, decided ${all.length - findings.length} of ${DECIDED.length}`);
    for (const f of findings) console.log(`  DIRECTION_READ ${f}`);
    expect(files.length, "the walk read fewer files than when this was written").toBeGreaterThanOrEqual(FLOOR);
    expect(findings).toEqual([]);
  });

  it("lists no decided direction the source no longer writes, and each says why", () => {
    const all = files.flatMap(({ path, rel }) => directionReads(rel, readFileSync(path, "utf8")));
    const stale = DECIDED.filter((d) => all.filter((f) => decided(f) === d).length !== 1).map((d) => `${d.file} ${d.finding}`);
    expect(stale, "a decided direction that is gone, or written more than once").toEqual([]);
    expect(DECIDED.filter((d) => d.reason.length < 20)).toEqual([]);
  });

  it("finds each kind of read when one is planted", () => {
    const planted = [
      'const a = getComputedStyle(el).direction;',
      'const b = document.dir;',
      'const c = el.closest("[dir]");',
      'const d = el.getAttribute("dir");',
      'const e = x === "rtl";',
      'const f = <div dir="ltr" />;',
      'function G({ dir = "ltr" }) { return dir; }',
      'const DEFAULT_DIRECTION = "ltr";',
    ];
    const hits = planted.map((line) => directionReads("planted.tsx", line).length);
    expect(hits).toEqual([1, 1, 1, 1, 1, 1, 1, 1]);
    expect(directionReads("planted.tsx", 'const ok = isRtl(el); const side = "right";')).toEqual([]);
  });
});
