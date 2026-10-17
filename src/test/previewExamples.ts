import ts from "typescript";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

/**
 * The examples `/preview/<Component>/<example>` can render, read from
 * `src/pages/demo/previews/<Component>.preview.tsx`: the keys of the object
 * each one exports by default.
 *
 * Read from source rather than imported, so the demo-scenarios contract and
 * the e2e specs agree on the list without loading the components.
 */
export function previewExamples(root = process.cwd()): Map<string, Set<string>> {
  const out = new Map<string, Set<string>>();
  const dir = join(root, "src/pages/demo/previews");
  for (const file of readdirSync(dir).filter((f) => f.endsWith(".preview.tsx")).sort()) {
    const sf = ts.createSourceFile(file, readFileSync(join(dir, file), "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const ids = new Set<string>();
    for (const st of sf.statements) {
      if (!ts.isExportAssignment(st)) continue;
      let e: ts.Expression = st.expression;
      while (ts.isSatisfiesExpression(e) || ts.isAsExpression(e) || ts.isParenthesizedExpression(e)) e = e.expression;
      if (!ts.isObjectLiteralExpression(e)) continue;
      for (const prop of e.properties) {
        if (prop.name && (ts.isIdentifier(prop.name) || ts.isStringLiteral(prop.name))) ids.add(prop.name.text);
      }
    }
    out.set(file.replace(/\.preview\.tsx$/, ""), ids);
  }
  return out;
}

/** Every preview route, `/preview/<Component>/<example>`. */
export const previewRoutes = (root?: string): string[] =>
  [...previewExamples(root)].flatMap(([component, ids]) => [...ids].map((id) => `/preview/${component}/${id}`));
