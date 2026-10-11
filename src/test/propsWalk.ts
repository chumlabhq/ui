/**
 * Every component export's props, read by the TypeScript compiler.
 *
 * api-conventions.contract checks its naming rules over these views, and
 * `capabilities.global.ts` reads the contracts' capability flags (`asChild`,
 * `open`, `keepMounted`, …) from them, so a flag is what the type declares
 * rather than what the hand-written ai/component-index.json lists. One walk,
 * so the two cannot disagree about what a component accepts.
 */
import ts from "typescript";
import { existsSync } from "node:fs";
import index from "../../ai/component-index.json";

export const SRC = "src/components";
export const DIRS = (index as { components: { name: string }[] }).components.map((c) => c.name);

export const OPTIONS: ts.CompilerOptions = {
  jsx: ts.JsxEmit.ReactJSX,
  target: ts.ScriptTarget.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  module: ts.ModuleKind.ESNext,
  strict: true,
  skipLibCheck: true,
  esModuleInterop: true,
};

export interface Prop {
  name: string;
  type: ts.Type;
}

export interface PropsView {
  /** `Dir/Export`, so two directories' `CheckIcon` stay apart. */
  id: string;
  props: Prop[];
  checker: ts.TypeChecker;
  at: ts.Node;
}

/** Own props of every component export of the given index files. */
export function viewsOf(program: ts.Program, files: { file: string; dir: string }[]): PropsView[] {
  const checker = program.getTypeChecker();
  const views: PropsView[] = [];
  for (const { file, dir } of files) {
    const sf = program.getSourceFile(file);
    if (!sf) throw new Error(`${file} is not in the program`);
    for (const exp of checker.getExportsOfModule(checker.getSymbolAtLocation(sf)!)) {
      // A React context is callable in React 19's types, but it is a provider,
      // not a component with a props API of ours.
      if (!/^[A-Z]/.test(exp.name) || /Context$/.test(exp.name)) continue;
      const sym = exp.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(exp) : exp;
      const at = sym.valueDeclaration ?? sym.declarations?.[0];
      if (!at) continue;
      const sig = checker.getTypeOfSymbolAtLocation(sym, at).getCallSignatures()[0];
      const param = sig?.getParameters()[0];
      if (!param) continue;
      const propsType = checker.getTypeOfSymbolAtLocation(param, at);
      const members = propsType.isUnion()
        ? propsType.types.flatMap((t) => checker.getPropertiesOfType(t))
        : checker.getPropertiesOfType(propsType);
      const seen = new Map<string, Prop>();
      for (const m of members) {
        if (seen.has(m.name)) continue;
        const own = (m.declarations ?? []).some((d) => {
          const path = d.getSourceFile().fileName;
          return !path.includes("/node_modules/") && !program.isSourceFileDefaultLibrary(d.getSourceFile());
        });
        if (!own) continue;
        seen.set(m.name, { name: m.name, type: checker.getTypeOfSymbolAtLocation(m, at) });
      }
      views.push({ id: `${dir}/${exp.name}`, props: [...seen.values()], checker, at });
    }
  }
  return views;
}

/** Every directory in the index that has a barrel, as the program's roots. */
export const componentFiles = () =>
  DIRS.map((dir) => ({ file: `${SRC}/${dir}/index.ts`, dir })).filter((f) => existsSync(f.file));

/** The views of every component export in the library. */
export const componentViews = (): PropsView[] => {
  const files = componentFiles();
  return viewsOf(ts.createProgram(files.map((f) => f.file), OPTIONS), files);
};
