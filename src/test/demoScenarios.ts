/**
 * The demo pages' scenario index, read from their AST.
 *
 * `docs/demo-scenarios.json` says, for each of the 30 public components and
 * each of 22 scenarios, where a reader can see the scenario, why it does not
 * apply, or which slice owes it. This module is what makes those claims
 * checkable: an index of every `<Section>` on the demo pages with the
 * components rendered inside it and their attributes, one predicate per
 * scenario over that index, and one probe per n/a reason over the props walk.
 *
 * D12 built the first matrix by a scanner and hand grading, from a scratch
 * script that did not survive; nothing kept it true afterwards. The predicates
 * here are the scanner made strict enough to be a gate.
 */
import ts from "typescript";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { OPTIONS, viewsOf, type PropsView } from "./propsWalk.js";
import { COMPONENT_DOCS } from "../pages/demo/generated/componentDocs.js";
import { FORM_FIXTURES } from "../__tests__/fixtures/_forms.js";
import { previewExamples } from "./previewExamples.js";

const ROOT = process.cwd();
const DEMO_DIR = join(ROOT, "src/pages/demo");

export const SCENARIOS = [
  "default", "variants", "disabled", "readOnly", "error", "success",
  "controlled", "uncontrolled",
  "submit", "reset", "required", "validation",
  "loading", "empty", "failing",
  "longContent", "phoneWidth", "composition",
  "keyboard", "theming", "darkMode", "ssr",
] as const;
export type Scenario = (typeof SCENARIOS)[number];

export const PROBES = ["no-prop", "no-name", "no-async", "imperative", "overlay-content", "not-focusable", "inline-fixed"] as const;

// ── the components, from the barrels ──────────────────────────────────────

export interface Component {
  /** The `src/components/<dir>` the package root re-exports from. */
  dir: string;
  /** Its public component exports: the JSX tags that are this component. */
  tags: string[];
  /** Every prop the library declares on any of them. */
  props: Set<string>;
}

/**
 * The public components: every `src/components/<dir>` the package root
 * re-exports from, with the component exports of that directory the root
 * makes public. Read from `src/index.ts`, not from `ai/component-index.json`,
 * which is written by hand.
 */
export function publicViews(): { dirs: string[]; views: PropsView[] } {
  const rootFile = join(ROOT, "src/index.ts");
  const root = readFileSync(rootFile, "utf8");
  const dirs = [...new Set([...root.matchAll(/from "\.\/components\/([A-Za-z]+)[/"]/g)].map((m) => m[1]))].sort();
  const files = dirs.map((dir) => ({ file: join(ROOT, `src/components/${dir}/index.ts`), dir }));
  const program = ts.createProgram([rootFile, ...files.map((f) => f.file)], OPTIONS);
  const checker = program.getTypeChecker();
  const exported = new Set(
    checker.getExportsOfModule(checker.getSymbolAtLocation(program.getSourceFile(rootFile)!)!).map((s) => s.name),
  );
  return { dirs, views: viewsOf(program, files).filter((v) => exported.has(v.id.split("/")[1])) };
}

export function publicComponents(): Component[] {
  const { dirs, views } = publicViews();
  return dirs.map((dir) => {
    const own = views.filter((v) => v.id.startsWith(`${dir}/`));
    return {
      dir,
      tags: own.map((v) => v.id.split("/")[1]),
      props: new Set(own.flatMap((v) => v.props.map((p) => p.name))),
    };
  });
}

// ── the section index ─────────────────────────────────────────────────────

export interface Element {
  tag: string;
  /** Attribute name → initializer text ("" for a bare attribute). */
  attrs: Map<string, string>;
  node: ts.Node;
}

export interface Section {
  page: string;
  title: string;
  line: number;
  endLine: number;
  /** Set for the sections a shared block renders: `ComponentDocs`, `CopyPasteBlock`. */
  block?: { kind: "ComponentDocs" | "CopyPasteBlock"; name: string };
  elements: Element[];
  /** `<form>` elements inside the section. */
  forms: ts.JsxElement[];
  node: ts.Node;
  source: ts.SourceFile;
  /** `useState` setter → state name, for the whole page. */
  setters: Map<string, string>;
  /** Top-level and local declarations on the page, by name. */
  declarations: Map<string, ts.Node>;
}

const TOAST_METHODS = /^(show|toast|success|error|warning|info)$/;

function attrsOf(opening: ts.JsxOpeningLikeElement, sf: ts.SourceFile): Map<string, string> {
  const attrs = new Map<string, string>();
  for (const a of opening.attributes.properties) {
    if (ts.isJsxAttribute(a)) attrs.set(a.name.getText(sf), a.initializer ? a.initializer.getText(sf) : "");
  }
  return attrs;
}

/**
 * Every component rendered inside `node`. A `toast.*()` call counts as a Toast
 * element: Toast has no JSX form a page renders, and the keys of the object it
 * is handed, in any argument position, are its props.
 */
/**
 * The demo helpers that render a real `<form>` around what they are given,
 * by tag, with the source of the form they render.
 *
 * FormDemo puts every form field's "In a form" section in one `<form>` with a
 * Submit and a Reset; the page's own AST shows `<FormDemo>`, not `<form>`. So
 * a helper counts as a form only when its own JSX renders one — read from
 * src/pages/demo/components, not listed — and the submit, reset and
 * validation predicates read that form's source together with what the page
 * puts inside it.
 */
let FORM_HELPERS: Map<string, string> | null = null;
export function formHelpers(): Map<string, string> {
  if (FORM_HELPERS) return FORM_HELPERS;
  FORM_HELPERS = new Map();
  const dir = join(ROOT, "src/pages/demo/components");
  for (const file of readdirSync(dir).filter((f) => f.endsWith(".tsx"))) {
    const sf = ts.createSourceFile(file, readFileSync(join(dir, file), "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    for (const st of sf.statements) {
      if (!ts.isFunctionDeclaration(st) || !st.name || !st.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)) continue;
      let form: ts.JsxElement | null = null;
      const v = (n: ts.Node) => { if (!form && ts.isJsxElement(n) && n.openingElement.tagName.getText(sf) === "form") form = n; ts.forEachChild(n, v); };
      v(st);
      if (form) FORM_HELPERS.set(st.name.text, (form as ts.JsxElement).getText(sf));
    }
  }
  return FORM_HELPERS;
}

function elementsIn(node: ts.Node, sf: ts.SourceFile): { elements: Element[]; forms: ts.JsxElement[] } {
  const elements: Element[] = [];
  const forms: ts.JsxElement[] = [];
  const visit = (n: ts.Node) => {
    if (ts.isJsxOpeningElement(n) || ts.isJsxSelfClosingElement(n)) {
      const tag = n.tagName.getText(sf);
      if ((tag === "form" || formHelpers().has(tag)) && ts.isJsxOpeningElement(n)) forms.push(n.parent);
      elements.push({ tag, attrs: attrsOf(n, sf), node: ts.isJsxOpeningElement(n) ? n.parent : n });
    }
    if (ts.isCallExpression(n)) {
      const callee = n.expression;
      const method = ts.isPropertyAccessExpression(callee) ? callee.name.getText(sf) : ts.isIdentifier(callee) ? callee.text : "";
      const receiver = ts.isPropertyAccessExpression(callee) ? callee.expression.getText(sf) : "";
      if (TOAST_METHODS.test(method) && (/toast/i.test(receiver) || method === "toast")) {
        const attrs = new Map<string, string>();
        if (/^(success|error|warning|info)$/.test(method)) attrs.set("variant", JSON.stringify(method));
        for (const arg of n.arguments) {
          if (!ts.isObjectLiteralExpression(arg)) continue;
          for (const p of arg.properties) {
            if (p.name) attrs.set(p.name.getText(sf), ts.isPropertyAssignment(p) ? p.initializer.getText(sf) : "");
          }
        }
        elements.push({ tag: "Toast", attrs, node: n });
      }
    }
    ts.forEachChild(n, visit);
  };
  visit(node);
  return { elements, forms };
}

function declarationsOf(sf: ts.SourceFile): Map<string, ts.Node> {
  const out = new Map<string, ts.Node>();
  const visit = (n: ts.Node) => {
    if (ts.isVariableDeclaration(n) && ts.isIdentifier(n.name) && n.initializer && !out.has(n.name.text)) out.set(n.name.text, n.initializer);
    if (ts.isFunctionDeclaration(n) && n.name && !out.has(n.name.text)) out.set(n.name.text, n);
    ts.forEachChild(n, visit);
  };
  visit(sf);
  return out;
}

function settersOf(sf: ts.SourceFile): Map<string, string> {
  const setters = new Map<string, string>();
  const visit = (n: ts.Node) => {
    if (
      ts.isVariableDeclaration(n) && ts.isArrayBindingPattern(n.name) && n.initializer &&
      ts.isCallExpression(n.initializer) && /useState$/.test(n.initializer.expression.getText(sf))
    ) {
      const [state, setter] = n.name.elements;
      if (state && setter && ts.isBindingElement(state) && ts.isBindingElement(setter)) {
        setters.set(setter.name.getText(sf), state.name.getText(sf));
      }
    }
    ts.forEachChild(n, visit);
  };
  visit(sf);
  return setters;
}

const literalText = (n: ts.Node | undefined, sf: ts.SourceFile): string => {
  if (!n) return "";
  if (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n)) return n.text;
  if (ts.isJsxExpression(n)) return literalText(n.expression, sf);
  return n.getText(sf);
};

export function sectionIndex(dir = DEMO_DIR): Section[] {
  const out: Section[] = [];
  for (const page of readdirSync(dir).filter((f) => f.endsWith(".tsx")).sort()) {
    const path = join(dir, page);
    const sf = ts.createSourceFile(path, readFileSync(path, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const setters = settersOf(sf);
    const declarations = declarationsOf(sf);
    const lineOf = (pos: number) => sf.getLineAndCharacterOfPosition(pos).line + 1;
    const visit = (n: ts.Node) => {
      const opening = ts.isJsxElement(n) ? n.openingElement : ts.isJsxSelfClosingElement(n) ? n : null;
      const tag = opening?.tagName.getText(sf);
      if (opening && tag === "Section" && ts.isJsxElement(n)) {
        const title = opening.attributes.properties.find(
          (a): a is ts.JsxAttribute => ts.isJsxAttribute(a) && a.name.getText(sf) === "title",
        );
        out.push({
          page, title: literalText(title?.initializer, sf), line: lineOf(n.getStart(sf)), endLine: lineOf(n.getEnd()),
          ...elementsIn(n, sf), node: n, source: sf, setters, declarations,
        });
      }
      // The shared blocks render sections of their own, with fixed titles.
      if (opening && (tag === "ComponentDocs" || tag === "CopyPasteBlock")) {
        const name = literalText(attrsOf(opening, sf).has("name")
          ? opening.attributes.properties.find((a): a is ts.JsxAttribute => ts.isJsxAttribute(a) && a.name.getText(sf) === "name")?.initializer
          : undefined, sf);
        const titles = tag === "ComponentDocs" ? ["Keyboard Interactions", "Accessibility"] : ["Copy and paste"];
        for (const title of titles) {
          out.push({
            page, title, line: lineOf(n.getStart(sf)), endLine: lineOf(n.getEnd()),
            block: { kind: tag, name }, elements: [], forms: [], node: n, source: sf, setters, declarations,
          });
        }
      }
      ts.forEachChild(n, visit);
    };
    visit(sf);
  }
  return out;
}

// ── the predicates ────────────────────────────────────────────────────────

const own = (s: Section, c: Component) => s.elements.filter((e) => c.tags.includes(e.tag));

/**
 * What a section reaches: its own subtree, and the declarations of the
 * identifiers its elements' attributes name, two levels deep. Options arrays,
 * status functions and column definitions are declared above the section and
 * are part of what it renders.
 */
const reached = new WeakMap<Section, ts.Node[]>();
function reach(s: Section): ts.Node[] {
  const hit = reached.get(s);
  if (hit) return hit;
  const nodes: ts.Node[] = [s.node];
  const seen = new Set<string>();
  const follow = (n: ts.Node, depth: number) => {
    const visit = (m: ts.Node) => {
      if (ts.isIdentifier(m) && !seen.has(m.text) && s.declarations.has(m.text)) {
        const decl = s.declarations.get(m.text)!;
        // Only declarations outside the section: inside, they are already read.
        if (!(decl.pos >= s.node.pos && decl.end <= s.node.end)) {
          seen.add(m.text);
          nodes.push(decl);
          if (depth > 1) follow(decl, depth - 1);
        }
      }
      ts.forEachChild(m, visit);
    };
    visit(n);
  };
  for (const e of s.elements) {
    if (e.node.kind === ts.SyntaxKind.CallExpression) continue;
    const opening = ts.isJsxElement(e.node) ? e.node.openingElement : e.node;
    if (ts.isJsxOpeningElement(opening) || ts.isJsxSelfClosingElement(opening)) {
      for (const a of opening.attributes.properties) if (ts.isJsxAttribute(a) && a.initializer) follow(a.initializer, 2);
    }
  }
  reached.set(s, nodes);
  return nodes;
}
const reachText = (s: Section) => reach(s).map((n) => n.getText(s.source)).join("\n");

/** The component's own elements, and the declarations their attributes name. */
function ownReach(s: Section, c: Component): ts.Node[] {
  const mine = s.elements.filter((e) => c.tags.includes(e.tag));
  const nodes: ts.Node[] = mine.map((e) => e.node);
  for (const e of mine) {
    const visit = (m: ts.Node) => {
      if (ts.isIdentifier(m) && s.declarations.has(m.text)) {
        const decl = s.declarations.get(m.text)!;
        nodes.push(decl);
        ts.forEachChild(decl, (d) => { if (ts.isIdentifier(d) && s.declarations.has(d.text)) nodes.push(s.declarations.get(d.text)!); });
      }
      ts.forEachChild(m, visit);
    };
    visit(e.node);
  }
  const collect: ts.Node[] = [];
  for (const n of nodes) {
    const walk = (m: ts.Node) => { collect.push(m); ts.forEachChild(m, walk); };
    walk(n);
  }
  return collect;
}
/** Elements in the section and in what it reaches. */
const reachedElements = (s: Section) => [s.elements, ...reach(s).slice(1).map((n) => elementsIn(n, s.source).elements)].flat();
const hasAttr = (els: Element[], re: RegExp) => els.some((e) => [...e.attrs.keys()].some((k) => re.test(k)));
const attrValue = (els: Element[], re: RegExp, value: RegExp) =>
  els.some((e) => [...e.attrs].some(([k, v]) => re.test(k) && value.test(v)));
const text = (s: Section) => s.node.getText(s.source);

/** Object-literal keys in what the section reaches: items carry `disabled`, steps carry `status`. */
const objectKey = (s: Section, re: RegExp, value?: RegExp) => {
  let found = false;
  const visit = (n: ts.Node) => {
    if (found) return;
    if (ts.isPropertyAssignment(n) && re.test(n.name.getText(s.source)) && (!value || value.test(n.initializer.getText(s.source)))) found = true;
    ts.forEachChild(n, visit);
  };
  for (const n of reach(s)) visit(n);
  return found;
};

/**
 * `a` is a direct JSX child of `b`: `<Tooltip><Button/></Tooltip>`, or
 * `<Button><CircularLoader/></Button>`. A toast fired from a Button's onClick,
 * or a "Remove this tab" Button inside a tab's render function, is a demo
 * control and not the two composing.
 */
const directChild = (a: Element, b: Element) => ts.isJsxElement(b.node) && a.node.parent === b.node;
const nested = (a: Element, b: Element) => directChild(a, b) || directChild(b, a);

/** Props a component takes as a controlled pair: `x` beside `onXChange`. */
const controlledProps = (c: Component) =>
  [...c.props].filter((p) => c.props.has(`on${p[0].toUpperCase()}${p.slice(1)}Change`));

const PHONE_WIDTH = /max-w-\[3[0-7]\dpx\]|\bw-\[3[0-7]\dpx\]|(maxWidth|width):\s*["']?3[0-7]\d(px)?\b/;

/**
 * A `PhoneFrame` in the section whose route names the component and an
 * example its preview file renders. The frame loads that route in a 360 px
 * iframe; a route naming no example would show the not-found page.
 */
let PREVIEWS: Map<string, Set<string>> | null = null;
const framed = (s: Section, c: Component) =>
  s.elements.some((e) => {
    if (e.tag !== "PhoneFrame") return false;
    const [, component, example] = /^["'{`]*\/preview\/([A-Za-z]+)\/([a-z0-9-]+)["'}`]*$/.exec(e.attrs.get("route") ?? "") ?? [];
    return component === c.dir && !!(PREVIEWS ??= previewExamples()).get(component)?.has(example);
  });

/**
 * The forms the component takes part in: one that encloses it, or, for an
 * overlay, one inside it — a form in a drawer is the drawer's form scenario.
 */
const enclosingForms = (s: Section, c: Component) =>
  s.forms.filter((f) => own(s, c).some((e) =>
    (e.node.pos >= f.pos && e.node.end <= f.end) || (isOverlay(c) && f.pos >= e.node.pos && f.end <= e.node.end)));

const formHas = (s: Section, form: ts.JsxElement, re: RegExp) =>
  re.test(form.getText(s.source) + (formHelpers().get(form.openingElement.tagName.getText(s.source)) ?? ""));

const SUBMIT = /type=["{]?["']?submit|onSubmit=|requestSubmit\(/;
const CONSTRAINT = /^(required|pattern|minLength|maxLength|min|max)$/;
const RESET = /type=["{]?["']?reset|onReset=|\.reset\(\)/;

/** Every other public component's tags, for composition. */
let ALL: Component[] = [];

export const PREDICATES: Record<Scenario, (s: Section, c: Component) => boolean> = {
  default: (s, c) => !s.block && own(s, c).length > 0,
  variants: (s, c) =>
    hasAttr(own(s, c), /^(variant|size|shape|side|direction|orientation|labelPosition|selectionMode|mode|resizeDirection|fullScreen|maxWidth)$/),
  disabled: (s, c) => own(s, c).length > 0 && (hasAttr(own(s, c), /^(disabled|isDisabled)$/) || objectKey(s, /^disabled$/, /true/)),
  readOnly: (s, c) => hasAttr(own(s, c), /^readOnly$/),
  error: (s, c) =>
    hasAttr(own(s, c), /^(error|errorMessage|invalid)$/) ||
    (hasAttr(own(s, c), /^getStepStatus$/) && /["']error["']/.test(reachText(s))) ||
    (own(s, c).length > 0 && objectKey(s, /^status$/, /"error"/)),
  success: (s, c) =>
    hasAttr(own(s, c), /^(success|successMessage)$/) || (own(s, c).length > 0 && objectKey(s, /^status$/, /"(success|completed)"/)),
  controlled: (s, c) => hasAttr(own(s, c), /^(value|checked|open|expanded|sorting|pagination|selectedRowIds|activeStep)$/),
  uncontrolled: (s, c) => {
    if (hasAttr(own(s, c), /^default(Value|Checked|Open)$/)) return true;
    // A component with no `default*` prop is uncontrolled when its controlled
    // props are left off: Table sorts and pages on its own state.
    if ([...c.props].some((p) => /^default[A-Z]/.test(p))) return false;
    const pairs = controlledProps(c);
    return pairs.length > 0 && own(s, c).some((e) => pairs.every((p) => !e.attrs.has(p)));
  },
  // For a form field, submitting means its value is in the FormData, so the
  // field inside the form carries a `name`. Checkbox's unnamed "Remember me"
  // in the login form submits nothing.
  submit: (s, c) =>
    enclosingForms(s, c).some((f) => formHas(s, f, SUBMIT) &&
      (!FIELDS.has(c.dir) || own(s, c).some((e) => e.attrs.has("name") && e.node.pos >= f.pos && e.node.end <= f.end))),
  reset: (s, c) => enclosingForms(s, c).some((f) => formHas(s, f, RESET)),
  required: (s, c) =>
    enclosingForms(s, c).some((f) => own(s, c).some((e) => e.attrs.has("required") && e.node.pos >= f.pos && e.node.end <= f.end)),
  validation: (s, c) =>
    enclosingForms(s, c).some((f) => {
      if (formHas(s, f, /checkValidity|reportValidity|setCustomValidity|validity\./)) return true;
      // The browser's own constraint validation: a constrained field in a form
      // that submits and does not opt out with noValidate.
      const inside = own(s, c).filter((e) => e.node.pos >= f.pos && e.node.end <= f.end);
      return formHas(s, f, SUBMIT) && !formHas(s, f, /noValidate/) &&
        inside.some((e) => [...e.attrs.keys()].some((k) => CONSTRAINT.test(k)) || /^["{]?["']?(email|url|number)/.test(e.attrs.get("type") ?? ""));
    }),
  loading: (s, c) => hasAttr(own(s, c), /^(loading|isLoading|loadingContent|shimmerCount)$/) || own(s, c).some((e) => /Shimmer$/.test(e.tag)),
  empty: (s, c) => hasAttr(own(s, c), /^(emptyContent|emptyMessage|emptyState)$/) || attrValue(own(s, c), /^(data|options|items|totalPages)$/, /^\{\s*(\[\s*\]|0)\s*\}$/),
  // A failure a reader can see on demand: a loader that rejects, or an image
  // source that cannot load with the fallback it falls back to. A real fetch
  // that fails only when the network does is not one.
  failing: (s, c) =>
    own(s, c).length > 0 &&
    (/Promise\.reject|\breject\(|throw new Error/.test(reachText(s)) ||
      own(s, c).some((e) => /invalid|"xx"|"zz"/.test(`${e.attrs.get("src") ?? ""}${e.attrs.get("code") ?? ""}`) &&
        (e.attrs.has("fallback") || e.attrs.has("onError") || e.attrs.has("name")))),
  // "Scroll" is not in the title rule: both "Scroll Behavior" sections are
  // about lockScroll, the page behind an open popup.
  longContent: (s, c) =>
    own(s, c).length > 0 &&
    (/\b(long|overflow\w*|truncat\w*|many|text wrap\w*)\b/i.test(s.title) ||
      hasAttr(own(s, c), /^(maxVisible|truncate|maxHeight|maxLines|autoResize|maxRows)$/) ||
      // Ten or more of something, inside the component or handed to it: its
      // own generated rows, or an options list. Another component's rows in
      // the same section are not this one's content.
      ownReach(s, c).some((n) =>
        /Array\.from\(\{\s*length:\s*[1-9]\d+\s*\}\)/.test(n.getText(s.source)) ||
        (ts.isArrayLiteralExpression(n) && n.elements.length >= 10))),
  // A frame at phone width around the component: an enclosing element held to
  // 300-379px. The component's own width is not a phone, it is a narrow input.
  // Or a PhoneFrame, whose iframe gives the component a 360 px viewport.
  phoneWidth: (s, c) =>
    framed(s, c) ||
    s.elements.some((frame) => !c.tags.includes(frame.tag) &&
      PHONE_WIDTH.test(`${frame.attrs.get("className") ?? ""} ${frame.attrs.get("style") ?? ""}`) &&
      own(s, c).some((e) => e !== frame && e.node.pos >= frame.node.pos && e.node.end <= frame.node.end)),
  // Another public component working with this one. A Button counts only when
  // the two nest, either way round: a Button that only opens a demo is a demo
  // control, not composition.
  composition: (s, c) => {
    const mine = own(s, c);
    if (mine.length === 0) return false;
    const all = reachedElements(s);
    return ALL.some((o) => {
      if (o.dir === c.dir) return false;
      const theirs = all.filter((e) => o.tags.includes(e.tag));
      if (theirs.length === 0) return false;
      if (o.dir !== "Button" && c.dir !== "Button") return true;
      return theirs.some((t) => mine.some((m) => nested(m, t))) ||
        // Options content is rendered inside the component that takes it.
        theirs.some((t) => !(t.node.pos >= s.node.pos && t.node.end <= s.node.end));
    });
  },
  keyboard: (s, c) => s.block?.kind === "ComponentDocs" && s.title === "Keyboard Interactions" &&
    s.block.name === c.dir && (COMPONENT_DOCS[c.dir]?.keyboard?.rows.length ?? 0) > 0,
  theming: (s, c) =>
    hasAttr(own(s, c), /^(classes|unstyled)$/) ||
    // Or by a className that applies the library's tokens: Loader draws in
    // currentColor, so `text-cl-accent` is how it is themed.
    (hasAttr(own(s, c), /^className$/) && /\b(text|bg|border|fill|stroke)-cl-|var\(--cl-/.test(reachText(s))) ||
    (own(s, c).length > 0 && /--cl-[a-z-]+["']?\s*:/.test(text(s))),
  darkMode: (s) => /dark/i.test(s.title) && /data-theme|\.dark\b|"dark"/.test(text(s)),
  ssr: (s, c) => s.block?.kind === "CopyPasteBlock" && s.block.name === c.dir && !!COMPONENT_DOCS[c.dir]?.snippets,
};

/** Overlays: their content is shown only once something sets `open`. */
export const isOverlay = (c: Component) => c.props.has("open") && c.props.has("onOpenChange") && c.props.has("children") && !c.props.has("content");

/** A trigger in the same section that sets the overlay's open state. */
export function hasTrigger(s: Section, c: Component): boolean {
  const states = own(s, c).map((e) => e.attrs.get("open")?.replace(/^\{|\}$/g, "").trim()).filter(Boolean) as string[];
  if (states.length === 0) return false;
  // `open={flag}` from useState is set by its setter; `open={drawer.open}` from
  // a hook object is set by the same object's handlers.
  const setters = [
    ...[...s.setters].filter(([, state]) => states.includes(state)).map(([setter]) => setter),
    ...states.filter((st) => st.includes(".")).map((st) => `${st.split(".")[0]}\\.`),
  ];
  let found = false;
  const visit = (n: ts.Node) => {
    if (found) return;
    if (ts.isJsxAttribute(n) && /^on[A-Z]/.test(n.name.getText(s.source)) && n.initializer) {
      const body = n.initializer.getText(s.source);
      if (setters.some((set) => new RegExp(`\\b${set}`).test(body))) found = true;
    }
    ts.forEachChild(n, visit);
  };
  visit(s.node);
  return found;
}

export function holds(scenario: Scenario, s: Section, c: Component): boolean {
  if (!PREDICATES[scenario](s, c)) return false;
  // A framed preview opens its overlay itself, and has a button behind it to
  // open it again; demo-phone.spec opens and reaches it in the frame.
  if (isOverlay(c) && !s.block && scenario !== "darkMode" && !framed(s, c) && !hasTrigger(s, c)) return false;
  return true;
}

export function setAll(components: Component[]) {
  ALL = components;
}

// ── the n/a probes ────────────────────────────────────────────────────────

/** A data source: something that loads, searches or reports a failure. `loading` alone is a spinner state. */
const ASYNC = /^(loadOptions|loadChildren|searchOptions|searchMenu|searchSubmenu|loadInitialOptions|onLoadError|emptyContent|onLoadMore|hasMore)$/;
const FIELDS = new Set(FORM_FIXTURES.map((f) => f.id.split("/")[0]));

/** Whether an n/a probe still holds for a component. */
export function probeHolds(probe: string, c: Component): { ok: boolean; why: string } {
  const [kind, arg] = probe.split(":");
  const names = (arg ?? "").split(",").filter(Boolean);
  switch (kind) {
    case "no-prop": {
      if (names.length === 0) return { ok: false, why: "no-prop names no prop" };
      const present = names.filter((n) => c.props.has(n));
      return { ok: present.length === 0, why: `declares ${present.join(", ")}` };
    }
    case "no-name":
      return { ok: !FIELDS.has(c.dir), why: "is a form field (FORM_FIXTURES)" };
    case "no-async": {
      const present = [...c.props].filter((p) => ASYNC.test(p));
      return { ok: present.length === 0, why: `declares ${present.join(", ")}` };
    }
    case "imperative": {
      const present = [...c.props].filter((p) => /^(value|defaultValue|checked|open|defaultOpen)$/.test(p));
      return { ok: present.length === 0, why: `declares ${present.join(", ")}` };
    }
    case "overlay-content":
      return { ok: isOverlay(c), why: "is not an overlay whose content is the consumer's (open, onOpenChange, children)" };
    case "not-focusable":
      return { ok: (COMPONENT_DOCS[c.dir]?.keyboard?.rows.length ?? 0) === 0, why: "its docs list keyboard rows" };
    case "inline-fixed": {
      // No surface of its own beside the page: nothing to place against the
      // viewport. Filling its container is still inline.
      const present = [...c.props].filter((p) => /^(portalContainer|open)$/.test(p));
      return { ok: present.length === 0, why: `declares ${present.join(", ")}` };
    }
    default:
      return { ok: false, why: `"${kind}" is not in the probe vocabulary` };
  }
}

// ── the matrix, checked ───────────────────────────────────────────────────

export type Cell =
  | { shown: { page: string; section: string } }
  | { na: { probe: string; reason: string } }
  | { gap: { reason: string; slice: string } };

export interface Matrix {
  components: Record<string, Record<string, Cell>>;
}

export interface Context {
  components: Component[];
  index: Section[];
  /** `ratchets["demo-scenarios-gap"].value` in docs/adr/002-gate-populations.json. */
  gapRatchet: number;
}

/** The D12 demo slices, or a library slice (`L24`) for a gap a demo cannot close until the library changes. */
export const SLICES = /^(D12[a-e]|L\d+)$/;

/**
 * Every rule of `docs/demo-scenarios.json`, as the list of what breaks it.
 *
 *   a. completeness: exactly the public components, exactly the 22 scenarios,
 *      and exactly one of shown, na or gap in every cell;
 *   b. a shown cell names a section that exists on that page with that title,
 *      and the scenario's predicate holds on it — for an overlay, with a
 *      trigger in the same section that sets its open state;
 *   c. an n/a cell names a probe from the vocabulary, and the probe still
 *      holds against the props walk;
 *   d. a gap cell names its reason and its slice, its predicate holds on no
 *      section of the component's own page (any page, for composition), and
 *      the count of gaps is the recorded ratchet.
 */
export function checkMatrix(matrix: Matrix, ctx: Context) {
  setAll(ctx.components);
  const errors: string[] = [];
  const tally = { shown: 0, na: 0, gap: 0 };
  const dirs = ctx.components.map((c) => c.dir);
  const cells = matrix.components ?? {};

  for (const dir of dirs) if (!(dir in cells)) errors.push(`missing component: ${dir}`);
  for (const dir of Object.keys(cells)) if (!dirs.includes(dir)) errors.push(`not a public component: ${dir}`);

  for (const c of ctx.components) {
    const row = cells[c.dir];
    if (!row) continue;
    for (const s of SCENARIOS) if (!(s in row)) errors.push(`missing cell: ${c.dir}.${s}`);
    for (const s of Object.keys(row)) if (!(SCENARIOS as readonly string[]).includes(s)) errors.push(`not a scenario: ${c.dir}.${s}`);

    for (const scenario of SCENARIOS) {
      const cell = row[scenario] as Record<string, unknown> | undefined;
      if (!cell) continue;
      const id = `${c.dir}.${scenario}`;
      const kinds = Object.keys(cell);
      if (kinds.length !== 1 || !["shown", "na", "gap"].includes(kinds[0])) {
        errors.push(`${id}: a cell holds exactly one of shown, na or gap, not ${JSON.stringify(kinds)}`);
        continue;
      }

      if ("shown" in cell) {
        tally.shown += 1;
        const { page, section } = (cell as { shown: { page: string; section: string } }).shown;
        const titled = ctx.index.filter((s) => s.page === page && s.title === section);
        if (titled.length === 0) {
          errors.push(`${id}: cites "${section}" on ${page}, and no section there has that title`);
        } else if (!titled.some((s) => PREDICATES[scenario](s, c))) {
          errors.push(`${id}: "${section}" on ${page} exists, and the ${scenario} predicate does not hold on it`);
        } else if (!titled.some((s) => holds(scenario, s, c))) {
          errors.push(`${id}: "${section}" on ${page} renders the overlay with no trigger in the section that sets its open state`);
        }
      } else if ("na" in cell) {
        tally.na += 1;
        const { probe, reason } = (cell as { na: { probe?: unknown; reason?: unknown } }).na;
        if (typeof probe !== "string" || !(PROBES as readonly string[]).includes(probe.split(":")[0])) {
          errors.push(`${id}: n/a needs a probe from ${PROBES.join(", ")}; ${JSON.stringify(probe ?? reason ?? null)} is free text`);
        } else if (typeof reason !== "string" || reason.trim() === "") {
          errors.push(`${id}: n/a needs a reason beside its probe`);
        } else {
          const result = probeHolds(probe, c);
          if (!result.ok) errors.push(`${id}: the n/a probe ${probe} is stale: ${c.dir} ${result.why}`);
        }
      } else {
        tally.gap += 1;
        const { reason, slice } = (cell as { gap: { reason?: unknown; slice?: unknown } }).gap;
        if (typeof reason !== "string" || reason.trim() === "") errors.push(`${id}: a gap needs a reason`);
        if (typeof slice !== "string" || !SLICES.test(slice)) errors.push(`${id}: a gap needs a slice, D12a to D12e or a library slice Ln, not ${JSON.stringify(slice ?? null)}`);
        // Searched on the component's own page, where its scenarios are
        // demonstrated; composition is by nature on any page. A section on
        // another page that merely contains it — a Button inside a tooltip's
        // "Text Wrapping" — does not show this component's long content.
        const scope = scenario === "composition" ? ctx.index : ctx.index.filter((s) => s.page === `${c.dir}Demo.tsx`);
        const passing = scope.find((s) => holds(scenario, s, c));
        if (passing) errors.push(`${id}: recorded as a gap, and "${passing.title}" on ${passing.page} shows it — record it as shown`);
      }
    }
  }

  if (tally.gap > ctx.gapRatchet) {
    errors.push(`gaps rose: ${tally.gap} cells are gaps, recorded ${ctx.gapRatchet}. A scenario that applies is shown or owed, never dropped.`);
  } else if (tally.gap < ctx.gapRatchet) {
    errors.push(`gaps fell to ${tally.gap} and the record still says ${ctx.gapRatchet}: lower ratchets["demo-scenarios-gap"].value in docs/adr/002-gate-populations.json in this change.`);
  }
  return { errors, tally, cells: Object.values(cells).reduce((n, row) => n + Object.keys(row).length, 0) };
}
