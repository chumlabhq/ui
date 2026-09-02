/**
 * Classify every call-site class literal, using the AST.
 *
 * Regex classification kept mis-reading the false branch of a ternary as
 * unconditional; removing one of those broke the expression. "Conditional"
 * means the literal has a ConditionalExpression or a &&/|| ancestor inside the
 * className, which only the tree can tell you.
 */
import ts from "typescript";
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = "/Users/adityaagarwal/Developer/chumlab/chumlab-fe";
const BASE = join(ROOT, "src/components");
const NOT_SHIPPED = /(CatalogSection|ChumlabComparison|GetStarted|SiteHeader|SiteFooter|BuyMeCoffee|WhyChumlab|Typographic|UserMenu|Announcement|FaqLogo|Reveal|\/ui\/|BrandLogo|__tests__)/;
const UTIL = /^[a-z![]/;
const ACCESSOR = /^(classes|classesProp|mergedClasses|baseClasses|base|cls|mc|merged|classNames|config)$/;

const files = [];
(function walk(dir) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p);
    else if (p.endsWith(".tsx") && !NOT_SHIPPED.test(p)) files.push(p);
  }
})(BASE);

const out = {};
for (const path of files) {
  const text = readFileSync(path, "utf8");
  const sf = ts.createSourceFile(path, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const file = relative(BASE, path);

  const visit = (node) => {
    if (ts.isJsxAttribute(node) && node.name.getText(sf) === "className" && node.initializer) {
      const root = node.initializer;
      // which classes key(s) this className already applies
      const keys = [];
      const findKeys = (n) => {
        if (ts.isPropertyAccessExpression(n) && ACCESSOR.test(n.expression.getText(sf).split(".").pop() ?? ""))
          keys.push(n.name.getText(sf));
        if (ts.isIdentifier(n)) {
          const m = n.getText(sf).match(/^(\w+)ClassName$/);
          if (m) keys.push(m[1]);
        }
        ts.forEachChild(n, findKeys);
      };
      findKeys(root);

      const collect = (n) => {
        const push = (value, at, form) => {
          const v = value.trim();
          if (!v || !UTIL.test(v)) return;
          let conditional = false;
          for (let p = at; p && p !== root; p = p.parent) {
            if (ts.isConditionalExpression(p)) { conditional = true; break; }
            if (ts.isBinaryExpression(p) &&
                (p.operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken ||
                 p.operatorToken.kind === ts.SyntaxKind.BarBarToken)) { conditional = true; break; }
          }
          (out[file] ||= []).push({
            line: sf.getLineAndCharacterOfPosition(at.getStart(sf)).line + 1,
            // exact span, so a remover never has to search for the text: two
            // call sites can carry the same literal and the first is not it
            start: at.getStart(sf),
            end: at.getEnd(),
            value: v,
            form,
            bucket: conditional ? "conditional" : keys.length ? "absorb-into-key" : "unkeyed",
            key: keys[0] ?? null,
          });
        };
        if (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n)) push(n.text, n, "literal");
        else if (ts.isTemplateExpression(n)) {
          // The span of a template's static text is the whole template node, so
          // a remover working from it deletes the interpolations too. Marked
          // `template` and left to a human.
          push(n.head.text, n, "template");
          for (const span of n.templateSpans) push(span.literal.text, n, "template");
        }
        ts.forEachChild(n, collect);
      };
      collect(root);
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
}
const tally = {};
let total = 0;
for (const v of Object.values(out)) for (const e of v) { tally[e.bucket] = (tally[e.bucket] ?? 0) + 1; total += 1; }
writeFileSync(process.argv[2], JSON.stringify(out, null, 1));
console.log(JSON.stringify({ total, ...tally }));
