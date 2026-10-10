/**
 * Renamed props stay renamed.
 *
 * Slice A2a renamed the callbacks and controlled pairs that broke the library's
 * own conventions: `checked` paired with `onValueChange`, a Table callback
 * named for nothing it controls, loaders spelled as events. Nothing is
 * published, so there are no aliases and no deprecations — the old name is
 * simply gone. A name that comes back anywhere, in a type, a demo, a snippet a
 * consumer copies or the docs the codegen product reads, is a second API for
 * the same thing, and the generated code picks whichever it saw last.
 *
 * Each tombstone is scoped to the components it belonged to, in one of two ways:
 *
 *   word       no other export has a prop by that name, so the word itself is
 *              the tombstone, anywhere in the population below
 *   component  another export keeps the name — AccordionItem's own
 *              `onExpandedChange`, every field's `onValueChange`, the chip's
 *              internal `onRemove` — so a hit counts only where it is about one
 *              of the tombstone's components: their public props type, their
 *              directory, schema root, componentDocs and component-index
 *              entries, their llms-full section, and JSX attributes on their
 *              tags everywhere else
 *
 * Comments are scanned, not stripped. GATE-RULES' "strip comments first" is
 * about counting code; a tombstone is about a name, and JSDoc and prose are
 * where a consumer reads it.
 *
 * Population: src (code, tests, .ai.md, schemas, the generated componentDocs
 * and demo snippets), e2e, scripts/consumers/_app (the consumer snippets),
 * llms-full.txt and llms.txt, and the ai/ JSON indexes. Left out, because they
 * record history and are never rewritten: CHANGELOG.md, docs/ (ADRs and gate
 * rules), scripts/*.mjs (the bundle ledger's dated reasons) and the audit
 * reports at the repo root. Props passed through a spread or an object built
 * elsewhere are not attributed to a tag, so a `component` tombstone can miss
 * `<Checkbox {...props} />`; a `word` tombstone cannot.
 */
import { describe, expect, it } from "vitest";
import ts from "typescript";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import index from "../../../ai/component-index.json";
import { COMPONENT_DOCS } from "../../pages/demo/generated/componentDocs";
import { DEMO_SNIPPETS } from "../../pages/demo/generated/demoSnippets";

interface Tombstone {
  old: string;
  now: string;
  /** The exports the old name was a prop of. */
  components: string[];
  scope: "word" | "component";
}

const DROPDOWNS = ["Dropdown", "SearchableDropdown", "MultiSelectDropdown", "MultiSelectSearchableDropdown", "CascadingDropdown"];

const TOMBSTONES: Tombstone[] = [
  { old: "onValueChange", now: "onCheckedChange", components: ["Checkbox", "Switch"], scope: "component" },
  { old: "onSelectionChange", now: "onSelectedRowIdsChange", components: ["Table"], scope: "word" },
  { old: "onExpandedChange", now: "onExpandedRowIdsChange", components: ["Table"], scope: "component" },
  { old: "onPinColumn", now: "onPinnedColumnsChange", components: ["Table"], scope: "word" },
  { old: "isPopupOpen", now: "popupOpen", components: ["Table"], scope: "word" },
  { old: "onCursorPosition", now: "onCursorPositionChange", components: ["Table"], scope: "word" },
  { old: "onCursorOverHeader", now: "onHeaderHoverChange", components: ["Table"], scope: "word" },
  { old: "activeSnapPointIndex", now: "snapPointIndex", components: ["Drawer"], scope: "word" },
  { old: "onExpandedChange", now: "onValueChange", components: ["Accordion"], scope: "component" },
  { old: "AccordionExpandEvent", now: "onValueChange", components: ["Accordion"], scope: "word" },
  { old: "onLoadOptions", now: "loadOptions", components: ["Dropdown", "MultiSelectDropdown"], scope: "word" },
  { old: "onLoadInitialOptions", now: "loadInitialOptions", components: ["SearchableDropdown", "MultiSelectSearchableDropdown"], scope: "word" },
  { old: "onSearch", now: "searchOptions", components: ["SearchableDropdown", "MultiSelectSearchableDropdown"], scope: "word" },
  { old: "onLoadChildren", now: "loadChildren", components: ["CascadingDropdown"], scope: "word" },
  { old: "onMenuSearch", now: "searchMenu", components: ["CascadingDropdown"], scope: "word" },
  { old: "onSubmenuSearch", now: "searchSubmenu", components: ["CascadingDropdown"], scope: "word" },
  { old: "onRemove", now: "onDismiss", components: ["Toast"], scope: "component" },
  { old: "onPasteDetected", now: "onPasteDetect", components: ["InternationalPhoneInput"], scope: "word" },
];

/**
 * Hits that are not the old prop, each with its reason. One that excuses
 * nothing fails, so the list cannot outlive what it describes.
 */
const EXCEPTIONS: { old: string; file: string; line: RegExp; reason: string }[] = [
  {
    old: "onExpandedChange",
    file: "src/components/Table/Table.tsx",
    line: /onExpandedChange: \(updater\)/,
    reason: "TanStack Table's own option, which Table adapts into onExpandedRowIdsChange",
  },
];

/**
 * Where a `component` tombstone's directory scan would read a name another
 * export legitimately keeps. Accordion's directory documents AccordionItem's
 * `onExpandedChange(isExpanded)`, so for Accordion the scan narrows to the
 * public type, the schema root, the All Props tables, componentDocs and JSX on
 * `<Accordion>` — and `AccordionExpandEvent`, the payload type that only the
 * removed prop used, is a `word` tombstone that catches the prose about it.
 */
const SHARED_DIRECTORY = new Set(["Accordion"]);

const DIR_OF: Record<string, string> = {};
for (const { name } of (index as { components: { name: string }[] }).components) DIR_OF[name] = name;
DIR_OF.AccordionItem = "Accordion";

type Group = "library" | "demos" | "snippets" | "componentDocs" | "tests" | "aimd" | "schema" | "llms" | "ai-index";

interface Source {
  path: string;
  group: Group;
  text: string;
}

const SKIP_DIRS = new Set(["node_modules", "dist", ".git"]);
const walk = (dir: string): string[] =>
  existsSync(dir)
    ? readdirSync(dir).flatMap((entry) => {
        const path = join(dir, entry);
        if (statSync(path).isDirectory()) return SKIP_DIRS.has(entry) ? [] : walk(path);
        return [path];
      })
    : [];

function groupOf(path: string): Group | null {
  if (path.endsWith(".ai.md")) return "aimd";
  if (path.endsWith(".schema.json")) return "schema";
  if (/(^|\/)llms(-full)?\.txt$/.test(path)) return "llms";
  if (path.startsWith("ai/")) return path.endsWith(".json") ? "ai-index" : null;
  if (path === "src/pages/demo/generated/componentDocs.ts") return "componentDocs";
  if (path.startsWith("src/pages/demo/generated/") || path.startsWith("scripts/consumers/_app/")) return "snippets";
  if (!/\.(tsx?|mts|json)$/.test(path)) return null;
  if (path.includes("/__tests__/") || path.startsWith("src/test/") || path.startsWith("e2e/")) return "tests";
  if (path.startsWith("src/pages/")) return "demos";
  if (path.startsWith("src/")) return path.endsWith(".json") ? null : "library";
  return null;
}

const SOURCES: Source[] = [
  ...walk("src"),
  ...walk("e2e"),
  ...walk("scripts/consumers/_app"),
  "llms-full.txt",
  "llms.txt",
  "public/llms.txt",
  ...walk("ai").filter((p) => p.endsWith(".json")),
]
  // This file names every old name by design.
  .filter((path) => path !== "src/__tests__/contracts/api-names.contract.test.ts")
  .filter((path) => existsSync(path) && groupOf(path))
  .map((path) => ({ path, group: groupOf(path)!, text: readFileSync(path, "utf8") }));

/**
 * The two generated modules hold their code as escaped string literals, so a
 * JSX scan reads their decoded strings rather than the file.
 */
const GENERATED_STRINGS: { path: string; text: string }[] = [];
const collect = (value: unknown, path: string): void => {
  if (typeof value === "string") GENERATED_STRINGS.push({ path, text: value });
  else if (value && typeof value === "object")
    for (const [k, v] of Object.entries(value)) collect(v, `${path}.${k}`);
};
collect(COMPONENT_DOCS, "componentDocs");
collect(DEMO_SNIPPETS, "demoSnippets");
const GENERATED_FILES = new Set(["src/pages/demo/generated/componentDocs.ts", "src/pages/demo/generated/demoSnippets.ts"]);

const wordRe = (name: string) => new RegExp(`(?<![\\w$])${name}(?![\\w$])`, "g");

/** Line numbers, 1-based, of each whole-word occurrence. */
function wordHits(text: string, name: string): number[] {
  const lines: number[] = [];
  for (const m of text.matchAll(wordRe(name))) lines.push(text.slice(0, m.index).split("\n").length);
  return lines;
}

/**
 * The attribute names written on each `<Tag …>` in a text: code, a markdown
 * code block, or prose quoting JSX. Only depth-0 text counts, so a name inside
 * an attribute's expression (`onChange={() => x.onValueChange}`) is not an
 * attribute of the tag.
 */
function jsxAttributes(text: string, tag: string): { attrs: string[]; line: number }[] {
  const out: { attrs: string[]; line: number }[] = [];
  for (const m of text.matchAll(new RegExp(`<${tag}(?![\\w.])`, "g"))) {
    let i = m.index! + m[0].length;
    if (text[i] === "<") {
      let angle = 0;
      for (; i < text.length; i++) {
        if (text[i] === "<") angle++;
        else if (text[i] === ">" && --angle === 0) { i++; break; }
      }
    }
    let depth = 0;
    let top = "";
    let quote: string | null = null;
    for (; i < text.length; i++) {
      const c = text[i];
      if (quote) {
        if (c === quote) quote = null;
        if (depth === 0) top += " ";
        continue;
      }
      if (depth > 0) {
        if (c === "{") depth++;
        else if (c === "}") depth--;
        else if (c === '"' || c === "'" || c === "`") quote = c;
        continue;
      }
      if (c === "{") { depth++; top += " "; continue; }
      if ((c === '"' || c === "'") && /=\s*$/.test(top)) { quote = c; top += " "; continue; }
      if (c === ">" || c === "<") break;
      top += c;
    }
    const attrs = [...top.matchAll(/(?:^|\s)([A-Za-z_$][\w$-]*)(?=\s*=|\s|\/|$)/g)].map((a) => a[1]);
    out.push({ attrs, line: text.slice(0, m.index).split("\n").length });
  }
  return out;
}

// ── Public props types, by the compiler ────────────────────────────────────

const SRC = "src/components";
const program = ts.createProgram(
  [...new Set(Object.values(DIR_OF))].map((d) => `${SRC}/${d}/index.ts`).filter(existsSync),
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

/** The props type of an export: its call signature's first parameter. */
function propsTypeOf(exportName: string): { type: ts.Type; at: ts.Node } {
  const sf = program.getSourceFile(`${SRC}/${DIR_OF[exportName]}/index.ts`);
  if (!sf) throw new Error(`${exportName}: no index.ts`);
  const exp = checker.getExportsOfModule(checker.getSymbolAtLocation(sf)!).find((s) => s.name === exportName);
  if (!exp) throw new Error(`${exportName} is not exported from ${DIR_OF[exportName]}`);
  const sym = exp.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(exp) : exp;
  const at = (sym.valueDeclaration ?? sym.declarations![0])!;
  const sig = checker.getTypeOfSymbolAtLocation(sym, at).getCallSignatures()[0];
  return { type: checker.getTypeOfSymbolAtLocation(sig.getParameters()[0], at), at };
}

function propNames(exportName: string): Set<string> {
  const { type } = propsTypeOf(exportName);
  const members = type.isUnion() ? type.types.flatMap((t) => checker.getPropertiesOfType(t)) : checker.getPropertiesOfType(type);
  return new Set(members.map((s) => s.getName()));
}

/** The first parameter of a callback prop, as the checker prints it, or why there is none. */
function firstParam(exportName: string, prop: string): string {
  const { type, at } = propsTypeOf(exportName);
  const members = type.isUnion() ? type.types.map((t) => t.getProperty(prop)).filter(Boolean) : [type.getProperty(prop)];
  const sym = members[0];
  if (!sym) return "(no such prop)";
  const fn = checker.getNonNullableType(checker.getTypeOfSymbolAtLocation(sym, at));
  const sig = fn.getCallSignatures()[0];
  if (!sig) return "(not a function)";
  const p = sig.getParameters()[0];
  return p ? checker.typeToString(checker.getTypeOfSymbolAtLocation(p, at)) : "(no parameter)";
}

// ── The scan ───────────────────────────────────────────────────────────────

interface Hit {
  old: string;
  components: string;
  where: string;
  group: Group | "types" | "componentDocs" | "ai-index";
}

const excused = new Map<(typeof EXCEPTIONS)[number], number>(EXCEPTIONS.map((e) => [e, 0]));

function isExcused(old: string, path: string, text: string, line: number): boolean {
  for (const e of EXCEPTIONS) {
    if (e.old !== old || e.file !== path) continue;
    if (e.line.test(text.split("\n")[line - 1] ?? "")) {
      excused.set(e, excused.get(e)! + 1);
      return true;
    }
  }
  return false;
}

/** `## Name` through the next `## `, out of llms-full.txt. */
function llmsSection(component: string): string {
  const llms = SOURCES.find((s) => s.path === "llms-full.txt")?.text ?? "";
  return llms.split(/^## /m).find((s) => s.startsWith(`${component}\n`)) ?? "";
}

/** A markdown section by heading text, up to the next heading of the same or higher level. */
function mdSection(text: string, heading: RegExp): string {
  const lines = text.split("\n");
  const start = lines.findIndex((l) => heading.test(l));
  if (start < 0) return "";
  const level = /^#+/.exec(lines[start])![0].length;
  const end = lines.findIndex((l, i) => i > start && /^#+ /.test(l) && /^#+/.exec(l)![0].length <= level);
  return lines.slice(start, end < 0 ? undefined : end).join("\n");
}

function scan(): Hit[] {
  const hits: Hit[] = [];
  const indexEntries = (index as { components: { name: string; props?: string[] }[] }).components;

  for (const t of TOMBSTONES) {
    const label = t.components.join(", ");
    const add = (where: string, group: Hit["group"]) => hits.push({ old: t.old, components: label, where, group });

    for (const c of t.components) if (propNames(c).has(t.old)) add(`${c} props type`, "types");

    if (t.scope === "word") {
      for (const s of SOURCES)
        for (const line of wordHits(s.text, t.old))
          if (!isExcused(t.old, s.path, s.text, line)) add(`${s.path}:${line}`, s.group);
      continue;
    }

    const dirs = new Set(t.components.map((c) => `${SRC}/${DIR_OF[c]}/`));
    const own = (path: string) => [...dirs].some((d) => path.startsWith(d));

    for (const c of t.components) {
      const dir = DIR_OF[c];
      const schemaPath = `${SRC}/${dir}/${dir}.schema.json`;
      if (existsSync(schemaPath) && t.old in (JSON.parse(readFileSync(schemaPath, "utf8")).properties ?? {}))
        add(`${schemaPath} properties`, "schema");
      if (COMPONENT_DOCS[c]?.props.some((p) => p.name === t.old)) add(`componentDocs ${c}.props`, "componentDocs");
      if (indexEntries.find((e) => e.name === c)?.props?.includes(t.old)) add(`ai/component-index.json ${c}.props`, "ai-index");

      if (SHARED_DIRECTORY.has(dir)) {
        const aimd = SOURCES.find((s) => s.group === "aimd" && s.path.startsWith(`${SRC}/${dir}/`));
        if (aimd && wordHits(mdSection(aimd.text, /^## All Props/), t.old).length) add(`${aimd.path} All Props`, "aimd");
        if (wordHits(mdSection(llmsSection(c), /^### All Props/), t.old).length) add(`llms-full.txt ${c} All Props`, "llms");
      } else {
        for (const line of wordHits(llmsSection(c), t.old)) add(`llms-full.txt ## ${c} +${line}`, "llms");
      }
    }

    for (const s of SOURCES) {
      if (own(s.path)) {
        if ([...dirs].some((d) => SHARED_DIRECTORY.has(d.slice(SRC.length + 1, -1)))) continue;
        for (const line of wordHits(s.text, t.old))
          if (!isExcused(t.old, s.path, s.text, line)) add(`${s.path}:${line}`, s.group);
        continue;
      }
      if (GENERATED_FILES.has(s.path) || s.path === "llms-full.txt") continue;
      for (const c of t.components)
        for (const { attrs, line } of jsxAttributes(s.text, c))
          if (attrs.includes(t.old)) add(`${s.path}:${line} <${c}>`, s.group);
    }
    for (const g of GENERATED_STRINGS)
      for (const c of t.components)
        for (const { attrs } of jsxAttributes(g.text, c))
          if (attrs.includes(t.old)) add(`${g.path} <${c}>`, g.path.startsWith("componentDocs") ? "componentDocs" : "snippets");
    const llms = SOURCES.find((s) => s.path === "llms-full.txt");
    if (llms)
      for (const c of t.components)
        for (const { attrs, line } of jsxAttributes(llms.text, c))
          if (attrs.includes(t.old)) add(`llms-full.txt:${line} <${c}>`, "llms");
  }
  return hits;
}

const HITS = scan();

const GROUPS = ["types", "library", "demos", "snippets", "componentDocs", "tests", "aimd", "schema", "llms", "ai-index"] as const;
const count = (hits: Hit[]) => GROUPS.map((g) => `${g}=${hits.filter((h) => h.group === g).length}`).join(" ");
console.log(
  `API_NAMES tombstones=${TOMBSTONES.length} files=${SOURCES.length} generated-strings=${GENERATED_STRINGS.length} hits=${HITS.length}  ${count(HITS)}`,
);
for (const t of TOMBSTONES) {
  const mine = HITS.filter((h) => h.old === t.old && h.components === t.components.join(", "));
  console.log(`  ${t.old.padEnd(22)} → ${t.now.padEnd(24)} ${t.components.join(", ").padEnd(48)} ${t.scope.padEnd(9)} hits=${mine.length}`);
}

describe("API names: A2a's old names are gone", () => {
  it("reads attributes on the named tag only, outside expressions", () => {
    const text = `<Checkbox checked onValueChange={set} /> <CheckboxGroup onValueChange={x} />
      <Switch onCheckedChange={() => ({ onValueChange: 1 })} label="a > b" />`;
    expect(jsxAttributes(text, "Checkbox")).toEqual([{ attrs: ["checked", "onValueChange"], line: 1 }]);
    expect(jsxAttributes(text, "Switch")[0].attrs).toEqual(["onCheckedChange", "label"]);
  });

  it("no tombstone hits", () => {
    expect(HITS.map((h) => `${h.old} (${h.components}): ${h.where}`)).toEqual([]);
  });

  it("every exception still excuses something", () => {
    expect([...excused].filter(([, n]) => n === 0).map(([e]) => `${e.file}: ${e.reason}`)).toEqual([]);
  });

  it("every new name is a prop of its components", () => {
    const missing = TOMBSTONES.filter((t) => !/^[A-Z]/.test(t.old)).flatMap((t) =>
      t.components.filter((c) => !propNames(c).has(t.now)).map((c) => `${c}.${t.now}`),
    );
    expect(missing).toEqual([]);
  });

  /**
   * The renames that changed what a callback receives. A forwarded event must
   * be the real one, so its type is the event type, not `() => void`.
   */
  const SIGNATURES: [component: string, prop: string, first: RegExp][] = [
    ["Checkbox", "onCheckedChange", /^boolean$/],
    ["Switch", "onCheckedChange", /^boolean$/],
    ["Table", "onPinnedColumnsChange", /^string\[\]$/],
    ...DROPDOWNS.flatMap((c): [string, string, RegExp][] => [
      [c, "onFocus", /^FocusEvent</],
      [c, "onBlur", /^FocusEvent</],
    ]),
    ["TimePicker", "onBlur", /^FocusEvent</],
    ["Input", "onStartIconClick", /^MouseEvent</],
    ["Input", "onEndIconClick", /^MouseEvent</],
    ["TextArea", "onStartIconClick", /^MouseEvent</],
    ["TextArea", "onEndIconClick", /^MouseEvent</],
    ["Avatar", "onLoad", /^SyntheticEvent<HTMLImageElement/],
    ["Avatar", "onError", /^SyntheticEvent<HTMLImageElement/],
    ["Toast", "onDismiss", /^string$/],
  ];

  it("callbacks receive what their names promise", () => {
    const rows = SIGNATURES.map(([c, p, re]) => ({ c, p, first: firstParam(c, p), ok: re.test(firstParam(c, p)) }));
    console.log(`API_SIGNATURES checked=${rows.length} wrong=${rows.filter((r) => !r.ok).length}`);
    for (const r of rows) console.log(`  ${r.ok ? "ok   " : "WRONG"} ${`${r.c}.${r.p}`.padEnd(44)} (${r.first})`);
    expect(rows.filter((r) => !r.ok).map((r) => `${r.c}.${r.p}(${r.first})`)).toEqual([]);
  });
});
