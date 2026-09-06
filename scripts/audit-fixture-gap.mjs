/**
 * Which un-fixtured props put markup on screen that no gate has ever seen.
 *
 * DEMO-COVERAGE.md counts props with no fixture — 713 of 1136 — and that number
 * on its own says nothing about risk: a handler, a label string and a
 * `className` passthrough are all in it, and none of them renders anything a
 * gate would look at. `AvatarBadge`'s `variant` was also in it, and it selected
 * between three colour pairs, one of which shipped at 3.76:1 with nothing able
 * to measure it, because measuring needs a render.
 *
 * So this classifies the list by what the prop DOES, read from the AST rather
 * than from its name. `onFormat` renders a subtree; `variant` sometimes renders
 * nothing but a border radius. The ranking is by the gate that would have
 * caught the difference: a portal, a role, an interactive element, a colour
 * pair, then everything that only moves an attribute.
 *
 * Reads the un-fixtured list from `audit-demo-coverage.mjs --json`, so both
 * scripts share one definition of "has no fixture".
 *
 * Usage: node scripts/audit-fixture-gap.mjs [--json]
 */
import ts from "typescript";
import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const JSON_ONLY = process.argv.includes("--json");
/** `--explain Component.prop` prints every reference site and how it was read. */
const EXPLAIN = (process.argv.find((a) => a.startsWith("--explain=")) ?? "").split("=")[1] ?? null;

const coverage = JSON.parse(
  execFileSync("node", [join(ROOT, "scripts/audit-demo-coverage.mjs"), "--json"], {
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  }),
);

/** Every source file under src/components, minus the tests. */
function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) return path.includes("__tests__") ? [] : walk(path);
    return /\.tsx?$/.test(entry) ? [path] : [];
  });
}

const files = walk(join(ROOT, "src/components"));
const sources = new Map(
  files.map((file) => [
    file,
    ts.createSourceFile(file, readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX),
  ]),
);

/** Interactive by tag, without asking what a role attribute says. */
const INTERACTIVE_TAGS = new Set(["button", "input", "select", "textarea", "a", "summary"]);
/** A class token that paints a colour — the pairs contrast gates measure. */
const COLOUR_CLASS = /(^|:)(bg|text|border|ring|fill|stroke|from|via|to|shadow)-(?!none|transparent|current|inherit|\[)/;

const declarationName = (node) => {
  if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name)) return node.name.text;
  if (ts.isFunctionDeclaration(node) && node.name) return node.name.text;
  return null;
};

/** The function that takes the props: through `forwardRef` and `memo` wrappers. */
function componentFunction(initializer) {
  let node = initializer;
  for (let depth = 0; node && depth < 4; depth += 1) {
    if (ts.isArrowFunction(node) || ts.isFunctionExpression(node)) return node;
    if (ts.isCallExpression(node) && node.arguments.length) {
      node = node.arguments[0];
      continue;
    }
    return null;
  }
  return null;
}

/**
 * Every function in the tree, indexed by the props it destructures.
 *
 * Not "the component's own file": `Table.tsx` threads its props into
 * `TableHeader`, and the dropdowns hand theirs to a `Content` child declared
 * beside them. A prop is followed wherever it is destructured inside the
 * component's own directory, which is the boundary the package already uses.
 */
function indexFunctions() {
  const byDirectory = new Map();
  for (const [file, source] of sources) {
    const directory = /src\/components\/([^/]+)\//.exec(file)?.[1];
    if (!directory) continue;
    const visit = (node) => {
      const fn =
        ts.isFunctionDeclaration(node) || ts.isArrowFunction(node) || ts.isFunctionExpression(node)
          ? node
          : null;
      if (fn && fn.parameters.length) {
        const list = byDirectory.get(directory) ?? [];
        list.push({ file, source, fn });
        byDirectory.set(directory, list);
      }
      ts.forEachChild(node, visit);
    };
    visit(source);
  }
  return byDirectory;
}

const functionsByDirectory = indexFunctions();

/**
 * Local binding for a prop: `{ variant = "solid" }`, `{ "aria-live": ariaLive }`
 * or, when the parameter is a plain identifier, `props.variant`.
 */
function bindingFor(fn, prop) {
  const [parameter] = fn.parameters;
  if (!parameter) return null;
  if (ts.isObjectBindingPattern(parameter.name)) {
    for (const element of parameter.name.elements) {
      const source = element.propertyName ?? element.name;
      const named = ts.isIdentifier(source) || ts.isStringLiteral(source) ? source.text : null;
      if (named === prop && ts.isIdentifier(element.name)) {
        return { kind: "local", name: element.name.text };
      }
    }
    // Rest element: `...rest` spreads it onto an element, which is an attribute
    // change rather than new markup.
    return parameter.name.elements.some((e) => e.dotDotDotToken) ? { kind: "rest" } : null;
  }
  // A plain identifier parameter is the props object only when it is named
  // like one. Accepting any identifier made `option` in a helper the props of
  // whatever component was being classified, and every `option.value` in the
  // file counted as a reference to it.
  if (ts.isIdentifier(parameter.name) && /^(props|allProps|componentProps)$/.test(parameter.name.text)) {
    // `const { id, placeholder } = props` in the body, which is how the six
    // largest components are written. Reading only `props.id` reported every
    // one of their props as unread.
    const object = parameter.name.text;
    let local = null;
    const visit = (node) => {
      if (
        ts.isVariableDeclaration(node) &&
        ts.isObjectBindingPattern(node.name) &&
        node.initializer &&
        ts.isIdentifier(node.initializer) &&
        node.initializer.text === object
      ) {
        for (const element of node.name.elements) {
          const source = element.propertyName ?? element.name;
          const named = ts.isIdentifier(source) || ts.isStringLiteral(source) ? source.text : null;
          if (named === prop && ts.isIdentifier(element.name)) local = element.name.text;
        }
      }
      ts.forEachChild(node, visit);
    };
    if (fn.body) visit(fn.body);
    if (local) return { kind: "local", name: local };
    return { kind: "member", object, prop };
  }
  return null;
}

/** Every reference to the prop inside the component's own file. */
function referencesTo(source, binding) {
  const out = [];
  const visit = (node) => {
    if (binding.kind === "local" && ts.isIdentifier(node) && node.text === binding.name) {
      const parent = node.parent;
      const isDeclarationSite =
        (ts.isBindingElement(parent) && parent.name === node) ||
        (ts.isPropertyAssignment(parent) && parent.name === node);
      if (!isDeclarationSite) out.push(node);
    }
    if (
      binding.kind === "member" &&
      ts.isPropertyAccessExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === binding.object &&
      node.name.text === binding.prop
    ) {
      out.push(node);
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
  return out;
}

const ancestors = (node) => {
  const chain = [];
  for (let cur = node.parent; cur; cur = cur.parent) chain.push(cur);
  return chain;
};

/** What a subtree would show a gate that has never rendered it. */
function signalsIn(node, source) {
  const signals = new Set();
  const visit = (child) => {
    if (ts.isCallExpression(child)) {
      const callee = child.expression.getText(source);
      if (/createPortal$/.test(callee)) signals.add("portal");
    }
    if (ts.isJsxSelfClosingElement(child) || ts.isJsxOpeningElement(child)) {
      const tag = child.tagName.getText(source);
      if (INTERACTIVE_TAGS.has(tag)) signals.add("interactive");
      if (/^[A-Z]/.test(tag)) signals.add("component");
      for (const attribute of child.attributes.properties) {
        if (!ts.isJsxAttribute(attribute) || !attribute.name) continue;
        const name = attribute.name.getText(source);
        if (name === "role") signals.add("role");
        if (/^(aria-|tabIndex$)/.test(name)) signals.add("aria");
        if (/^on[A-Z]/.test(name)) signals.add("interactive");
        if (name === "className") {
          const text = attribute.initializer?.getText(source) ?? "";
          if (COLOUR_CLASS.test(text)) signals.add("colour");
          if (/classes\./.test(text)) signals.add("classes-key");
        }
      }
      signals.add("markup");
    }
    if (ts.isStringLiteral(child) && COLOUR_CLASS.test(child.text)) signals.add("colour");
    ts.forEachChild(child, visit);
  };
  visit(node);
  return signals;
}

/**
 * What one reference does. The question is only ever "does this put markup on
 * screen", so a reference is followed up its ancestors until it lands in one of
 * the shapes that can.
 */
function classifyReference(node, source) {
  const chain = ancestors(node);
  for (const parent of chain) {
    // `variantStyles[variant]` and `SIZE[size]` — the prop picks a class string.
    if (ts.isElementAccessExpression(parent) && parent.argumentExpression) {
      const inIndex = parent.argumentExpression.getStart() <= node.getStart() &&
        parent.argumentExpression.getEnd() >= node.getEnd();
      if (inIndex) {
        const table = parent.expression.getText(source);
        return { kind: "selects", detail: table };
      }
    }
    // The CONDITION of a ternary or a `&&`, never the branch it renders. The
    // first version walked up from any reference and took the first shape that
    // matched, so a prop used inside a guarded subtree — `onBlur` on a button
    // inside `{open && <div…>}` — was reported as guarding the whole thing.
    const within = (region) =>
      region && region.getStart() <= node.getStart() && region.getEnd() >= node.getEnd();
    if (ts.isConditionalExpression(parent) && within(parent.condition)) {
      const signals = new Set();
      for (const branch of [parent.whenTrue, parent.whenFalse]) {
        for (const s of signalsIn(branch, source)) signals.add(s);
      }
      if (signals.has("markup") || signals.has("portal")) {
        return { kind: "guards", signals: [...signals] };
      }
      // No markup, but a class string: the prop switches a colour rather than
      // adding an element, which is still a pair no fixture has painted.
      const painted = [parent.whenTrue, parent.whenFalse].some((branch) =>
        COLOUR_CLASS.test(branch.getText(source)),
      );
      if (painted) return { kind: "guards", signals: ["colour"] };
    }
    if (
      ts.isBinaryExpression(parent) &&
      (parent.operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken ||
        parent.operatorToken.kind === ts.SyntaxKind.BarBarToken) &&
      within(parent.left)
    ) {
      const signals = signalsIn(parent.right, source);
      if (signals.has("markup") || signals.has("portal")) {
        return { kind: "guards", signals: [...signals] };
      }
      if (COLOUR_CLASS.test(parent.right.getText(source))) {
        return { kind: "guards", signals: ["colour"] };
      }
    }
    // `if (!forceMount && !isOpen) return null` — the prop decides whether the
    // component renders at all, which no JSX guard shows. Reading only JSX
    // conditions called `forceMount` logic.
    if (ts.isIfStatement(parent) && within(parent.expression)) {
      const returns = new Set();
      const scan = (statement) => {
        if (!statement) return;
        const visit = (child) => {
          if (ts.isReturnStatement(child)) {
            if (!child.expression) returns.add("nothing");
            else if (child.expression.kind === ts.SyntaxKind.NullKeyword) returns.add("nothing");
            else for (const s of signalsIn(child.expression, source)) returns.add(s);
          }
          ts.forEachChild(child, visit);
        };
        visit(statement);
      };
      scan(parent.thenStatement);
      scan(parent.elseStatement);
      if (returns.size) {
        const signals = [...returns].filter((s) => s !== "nothing");
        // Returning `null` and nothing else: the prop decides whether the
        // component exists, which is a different risk from a subtree inside it.
        return { kind: "guards", signals: signals.length ? signals : ["absent"] };
      }
    }
    if (ts.isJsxExpression(parent)) {
      const holder = parent.parent;
      // A child expression: the prop's own value is rendered.
      if (holder && (ts.isJsxElement(holder) || ts.isJsxFragment(holder))) {
        return { kind: "renders-value" };
      }
      if (holder && ts.isJsxAttribute(holder)) {
        const name = holder.name.getText(source);
        if (/^on[A-Z]/.test(name)) return { kind: "handler" };
        if (name === "className") return { kind: "class" };
        if (name === "style") return { kind: "style" };
        if (/^(aria-|data-|role|tabIndex|id|htmlFor|title|placeholder|alt|href|type|disabled|checked|value)/.test(name)) {
          return { kind: "attribute", detail: name };
        }
        const tag = holder.parent.parent?.tagName?.getText(source) ?? "";
        return { kind: /^[A-Z]/.test(tag) ? "passes-to-component" : "attribute", detail: name };
      }
    }
    if (ts.isJsxAttribute(parent)) return { kind: "attribute", detail: parent.name.getText(source) };
    // Inside a hook body or a callback that is not JSX: no markup of its own.
    if (ts.isFunctionDeclaration(parent) || ts.isMethodDeclaration(parent)) break;
  }
  return { kind: "other" };
}

const RANK = [
  ["portal", "a portalled surface"],
  ["slot", "a slot the fixtures never fill"],
  ["role", "a new role"],
  ["interactive", "a new interactive element"],
  ["colour", "a new colour pair"],
  ["classes-key", "a classes key"],
  ["aria", "an ARIA attribute"],
  ["markup", "markup with none of the above"],
  ["absent", "the component itself, present or absent"],
];

function rankOf(signals) {
  for (const [signal, label] of RANK) if (signals.includes(signal)) return label;
  return "markup with none of the above";
}

const results = [];
const unresolved = [];

/** A prop whose value is markup rather than text. */
const SLOT_TYPE = /(ReactNode|ReactElement|JSX\.Element|=>\s*(React)?Node)/;

for (const row of coverage.rows) {
  const candidates = functionsByDirectory.get(row.owner) ?? [];
  if (!candidates.length) {
    for (const prop of row.noFixtureProps) {
      unresolved.push({ component: row.component, prop: prop.name, why: `no functions found under src/components/${row.owner}` });
    }
    continue;
  }

  for (const { name, tier, type } of row.noFixtureProps) {
    const sites = [];
    for (const candidate of candidates) {
      const binding = bindingFor(candidate.fn, name);
      if (!binding || binding.kind === "rest") continue;
      for (const node of referencesTo(candidate.source, binding)) {
        sites.push({ node, source: candidate.source });
      }
    }

    /**
     * One hop, no more. A prop rarely reaches JSX directly: `disabledDates`
     * becomes `isDisabled`, `presets` becomes `resolvedPresets`, and stopping at
     * the first reference called all of them logic. Following the variable a
     * reference initialises catches the common shape; anything threaded through
     * two variables or a `useMemo` returning an object is still undercounted,
     * and the report says so.
     */
    for (const { node, source } of [...sites]) {
      for (let cur = node.parent; cur; cur = cur.parent) {
        if (ts.isVariableDeclaration(cur) && ts.isIdentifier(cur.name)) {
          for (const derived of referencesTo(source, { kind: "local", name: cur.name.text })) {
            if (derived !== cur.name) sites.push({ node: derived, source, derived: true });
          }
          break;
        }
        if (ts.isReturnStatement(cur) || ts.isJsxElement(cur) || ts.isJsxExpression(cur)) break;
      }
    }

    const push = (verdict, extra = {}) =>
      results.push({ component: row.component, prop: name, tier, type, verdict, rank: null, ...extra });

    if (!sites.length) {
      // Destructured nowhere in the directory: either it only reaches the DOM
      // through a rest spread, or nothing reads it.
      const spread = candidates.some((c) => bindingFor(c.fn, name)?.kind === "rest");
      push(spread ? "spread-to-dom" : "unread");
      continue;
    }

    const kinds = sites.map(({ node, source }) => classifyReference(node, source));
    if (EXPLAIN === `${row.component}.${name}`) {
      for (const [index, { node, source }] of sites.entries()) {
        const { line } = source.getLineAndCharacterOfPosition(node.getStart());
        console.log(
          `${source.fileName.split("/").pop()}:${line + 1}  ${JSON.stringify(kinds[index])}\n    ${node.parent.getText(source).slice(0, 120).replace(/\s+/g, " ")}`,
        );
      }
    }
    const guarding = kinds.filter((k) => k.kind === "guards");
    const selecting = kinds.filter((k) => k.kind === "selects");

    if (guarding.length) {
      const signals = [...new Set(guarding.flatMap((k) => k.signals))];
      push("renders-markup", { rank: rankOf(signals), signals });
      continue;
    }
    if (selecting.length) {
      const tables = [...new Set(selecting.map((k) => k.detail))];
      const paints = tables.some((table) =>
        sites.some(({ source }) => {
          const declaration = findTable(source, table);
          return declaration ? COLOUR_CLASS.test(declaration) : false;
        }),
      );
      if (paints) push("renders-markup", { rank: "a new colour pair", signals: ["colour"], detail: tables.join(", ") });
      else push("attribute-only", { detail: tables.join(", ") });
      continue;
    }

    const kindSet = new Set(kinds.map((k) => k.kind));
    if (kindSet.has("renders-value")) {
      // `{icon}` puts whatever the consumer passes on screen; `{label}` puts a
      // string in a node that already exists.
      if (SLOT_TYPE.test(type)) push("renders-markup", { rank: "a slot the fixtures never fill", signals: ["slot"] });
      else push("renders-content");
      continue;
    }
    if (kindSet.has("passes-to-component")) {
      push(SLOT_TYPE.test(type) ? "renders-markup" : "passes-through", SLOT_TYPE.test(type) ? { rank: "a slot the fixtures never fill", signals: ["slot"] } : {});
      continue;
    }
    if (kindSet.has("class") || kindSet.has("style")) { push("styling-passthrough"); continue; }
    if (kindSet.has("attribute")) { push("attribute-only"); continue; }
    if (kindSet.has("handler")) { push("handler"); continue; }
    push("logic-only");
  }
}

/** The source text of an object literal the prop indexes, for the colour test. */
function findTable(source, name) {
  let text = null;
  const visit = (node) => {
    if (
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.name.text === name.split(/[.[]/)[0] &&
      node.initializer
    ) {
      text = node.initializer.getText(source);
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
  return text;
}

const byVerdict = new Map();
for (const r of results) byVerdict.set(r.verdict, (byVerdict.get(r.verdict) ?? 0) + 1);

const renders = results.filter((r) => r.verdict === "renders-markup");
const byRank = new Map();
for (const r of renders) byRank.set(r.rank, (byRank.get(r.rank) ?? 0) + 1);

if (JSON_ONLY) {
  console.log(JSON.stringify({ total: results.length, byVerdict: Object.fromEntries(byVerdict), byRank: Object.fromEntries(byRank), renders, results, unresolved }, null, 2));
} else {
  console.log(`props with no fixture: ${results.length}${unresolved.length ? ` (+${unresolved.length} unresolved)` : ""}`);
  console.log("\nby verdict");
  for (const [verdict, count] of [...byVerdict].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${String(count).padStart(4)}  ${verdict}`);
  }
  console.log("\nrenders markup, by what a gate would have caught");
  for (const [, label] of RANK) {
    const rows = renders.filter((r) => r.rank === label);
    if (!rows.length) continue;
    console.log(`\n  ${label} — ${rows.length}`);
    for (const r of rows) console.log(`    ${r.component}.${r.prop}`);
  }
  for (const r of unresolved) console.log(`UNRESOLVED ${r.component}.${r.prop}: ${r.why}`);
}
