import ts from "typescript";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

/**
 * The examples `/preview/<Component>/<example>` can render, read from
 * `src/pages/demo/previews/<Component>.preview.tsx`: the functions each one
 * exports, `LongSheet` being the example `long-sheet`.
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
      if (!ts.isFunctionDeclaration(st) || !st.name) continue;
      if (!st.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)) continue;
      ids.add(st.name.text.replace(/[A-Z]/g, (letter, at: number) => `${at ? "-" : ""}${letter.toLowerCase()}`));
    }
    out.set(file.replace(/\.preview\.tsx$/, ""), ids);
  }
  return out;
}

/** Every preview route, `/preview/<Component>/<example>`. */
export const previewRoutes = (root?: string): string[] =>
  [...previewExamples(root)].flatMap(([component, ids]) => [...ids].map((id) => `/preview/${component}/${id}`));
