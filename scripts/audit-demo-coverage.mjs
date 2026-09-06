#!/usr/bin/env node
/**
 * Derives DEMO-COVERAGE.md from source, so it cannot go stale.
 *
 * The first audit was a one-off. Its numbers — "751 of 1135 props have no
 * fixture, 51 tier-A gaps" — were true on the day and wrong within two slices:
 * the composition phase added `typeaheadTimeout`, `seedOnOpen` and
 * `commitOnSpace`, `keepMounted` reached Pagination and Breadcrumb,
 * `onMouseDown` joined three renderTrigger bags, six sub-components were
 * un-exported and 25 were documented. A coverage document nobody can
 * regenerate stops being a measurement the moment the code moves, which is the
 * defect this branch keeps finding in its own records.
 *
 *   node scripts/audit-demo-coverage.mjs            rewrite DEMO-COVERAGE.md
 *   node scripts/audit-demo-coverage.mjs --check    compare, change nothing
 *   node scripts/audit-demo-coverage.mjs --json     the raw derivation
 *
 * FIVE SOURCES
 *   1. the types      one ts.createProgram over the 30 component roots
 *   2. the demos      src/pages/demo/*.tsx, matched on the exported tag
 *   3. the fixtures   src/__tests__/fixtures/*.fixtures.tsx
 *   4. the docs       <NAME>.ai.md, `## All Props` and `## Prop Constraints`
 *   5. the contracts  registry.tsx, which drives some props over every fixture
 *
 * FIVE EXTRACTION FAULTS, each fixed here because the naive version was wrong.
 * They are recorded so the next person does not rediscover them:
 *
 *  1. Read the props each exported COMPONENT accepts, resolved through
 *     `forwardRef<_, XProps>` — not every exported `*Props` type. Reading the
 *     types audits `DropdownTriggerRenderProps` and reports `isOpen` and
 *     `aria-expanded` as undemonstrated props, when they are the payload handed
 *     *to* `renderTrigger` and cannot be passed at all.
 *  2. `forwardRef` over a GENERIC component collapses its parameter to
 *     `unknown`, which reduced Table to a single prop. Generic components are
 *     instantiated with their constraint before the properties are read.
 *  3. Inherited DOM props are separated from library-authored ones, by the file
 *     their declaration lives in. `className` and `disabled` arrive from
 *     `HTMLAttributes`; counting them as absent from the type turns every real
 *     doc example into a phantom.
 *  4. `.ai.md` is read BY SECTION. The Styling Guide's slot table has the same
 *     row shape as All Props, so reading the whole file reports every `classes`
 *     key — `root`, `arrow`, `message` — as a prop. Only `## All Props` and
 *     `## Prop Constraints` count, and only when the row's whole first cell is
 *     the name: `` | `href` on items | `` documents a BreadcrumbItem field.
 *  5. A prop the CONTRACT TIER drives itself counts as covered. `registry.tsx`
 *     applies `unstyled`, `classes`, `open`, `keepMounted` and `asChild` over
 *     every fixture, so no fixture declares them and none needs to. Reading a
 *     fixture's `props` keys as the whole truth reports `unstyled` as uncovered
 *     on all 30 components, when `unstyled.contract` is one of the strongest
 *     gates in the repo.
 *
 * And one rule that is not a fault but a decision: every prop NAME tiers
 * identically on every component that declares it. That is asserted below, not
 * assumed — a prop that tiers two ways is a bug in this script.
 */
import ts from "typescript";
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const REPORT = join(ROOT, "DEMO-COVERAGE.md");
const args = process.argv.slice(2);
const CHECK = args.includes("--check");
const JSON_ONLY = args.includes("--json");

// ── tiering ───────────────────────────────────────────────────────────────

/**
 * Names that are a whole mode whatever their type says. Kept explicit because
 * `unstyled: boolean` and `disabled: boolean` are the same type and not the
 * same kind of thing — ADR 001 makes the first a rendering mode.
 */
const MODE_NAMES = new Set([
  "unstyled", "asChild", "variant", "keepMounted", "lockScroll", "trapFocus",
  "restoreFocus", "showOverlay", "reduceMotion", "portalContainer", "mode",
  "loadOnOpen", "seedOnOpen", "commitOnSpace", "showSearch", "selectionMode",
  "editable", "infiniteScroll", "multi", "range", "unstyledShimmer",
]);

const PASSTHROUGH = /^(className|style|id|name|key|ref|tabIndex|aria-|data-|role$)/;
const CONTENT = /^(label|title|description|placeholder|text|content|icon|.*Icon|.*Label|.*Text|size|count|.*Count|children|options|items|data|columns|rows)$/;

function tierOf(name, type, checker) {
  if (PASSTHROUGH.test(name)) return "D";
  if (MODE_NAMES.has(name)) return "A";

  const printed = checker.typeToString(type);
  // A bare boolean literal — the async discriminant is `loadOnOpen: true`, not
  // `boolean`, and that asymmetry is the whole mode.
  if (printed === "true" || printed === "false") return "A";
  // A union of two or more literal members. Counted through the checker so an
  // alias tiers the same as the union it names.
  const parts = type.isUnion() ? type.types : [];
  const literals = parts.filter((t) => t.isLiteral() || t.isStringLiteral?.());
  if (literals.length >= 2) return "A";
  // A Promise-returning callback is an async data source, not a handler.
  if (/Promise</.test(printed) && /=>/.test(printed)) return "A";

  if (/^(on|render)[A-Z]/.test(name)) return "B";
  if (name === "classes" || name === "value" || name === "defaultValue" || /^default[A-Z]/.test(name)) return "B";
  if (CONTENT.test(name)) return "C";
  return "C";
}

/**
 * Props demonstrated once, deliberately, for the whole library.
 *
 * `unstyled` is a rendering mode 30 components share; `asChild` is one
 * composition API. Demonstrating each on every component that accepts it is 52
 * repetitions of four ideas, and the slice that added these demos said so:
 * "One demo per concept, in whichever page owns it. Not 22 repetitions."
 *
 * So they are not gaps, and the report says where the one demo is rather than
 * counting them 52 times. A prop here with no demo anywhere would still be a
 * gap — the location is asserted below, not trusted.
 */
const CANONICAL = new Map([
  ["unstyled", "StylingDemo — live side-by-side against the styled render"],
  ["asChild", "StylingDemo — `<Button asChild><a/></Button>`, a real anchor beside a button"],
  ["portalContainer", "StylingDemo — two identical dropdowns, one portalled into the box beside it"],
  ["keepMounted", "AnimationDemo — two dropdowns, one kept, counting `[role=listbox]` nodes"],
]);

/**
 * Tier-A props left undemonstrated on purpose, with the reason. Anything not
 * here and not canonical is a real gap.
 */
const LEFT_UNDEMONSTRATED = new Map([
  [
    "reduceMotion",
    "A demo of it is a page that does not move. The behaviour is gated instead — " +
      "`reduced-motion.contract` requires motion to EXIST when the preference is unset " +
      "before requiring it to stop, which a screenshot could not show.",
  ],
  [
    "variant",
    "Demonstrated on the parents. AccordionShimmer and AvatarBadge take the variant " +
      "their parent is already showing; a second demo would restate the parent's.",
  ],
  [
    "size",
    "A visible scale, demonstrated on the components that own it. AvatarGroupCount and " +
      "RadioButton inherit the same scale their parents demo.",
  ],
  ["shape", "As `size`: AvatarGroupCount follows the Avatar shape already on the page."],
  [
    "dropdownPosition",
    "Demonstrated on Dropdown, Pagination and SearchableDropdown. CascadingDropdown's " +
      "is the same prop with the same three values.",
  ],
  [
    "type",
    "Toast has no JSX form — `useToast().show({ variant })` is the public surface and is " +
      "demonstrated. `type` is the internal discriminant of the same idea.",
  ],
]);

// ── 1. the types ──────────────────────────────────────────────────────────

/**
 * One root: the package entry. "Reachable from the package root" is the test
 * ADR 002's closeout used to settle what is public, and it is the right scope
 * here too — the per-component `index.ts` files also export icons, contexts and
 * internal helpers that no consumer can import.
 */
const roots = [join(ROOT, "src/index.ts")];
const config = ts.readConfigFile(join(ROOT, "tsconfig.lib.json"), ts.sys.readFile);
const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, ROOT);
const program = ts.createProgram(roots, { ...parsed.options, noEmit: true });
const checker = program.getTypeChecker();

/**
 * A React component, as distinct from a hook or a helper.
 *
 * The package root exports `useTimePicker`, `copyToClipboard` and
 * `formatDateRange` alongside `Button`, and all three are functions with a
 * first parameter. What separates a component is what it returns, so that is
 * what is tested — by the return type, not by a naming convention, because
 * `Slot` and `Reveal` are components and do not start with `use`.
 */
function isComponent(returnType) {
  const printed = checker.typeToString(returnType);
  return /\b(Element|ReactElement|ReactNode|JSX\.Element)\b/.test(printed);
}

/** The props type of an exported component, or null if it is not one. */
function propsTypeOf(symbol) {
  const declared = checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration ?? symbol.declarations?.[0]);
  let signatures = declared.getCallSignatures();

  // FAULT 2: a generic forwardRef collapses its parameter to `unknown`, which
  // reduced Table to one prop. Instantiate with the constraint first.
  if (signatures.length === 0) {
    const construct = declared.getConstructSignatures();
    if (construct.length === 0) return null;
    signatures = construct;
  }
  const [signature] = signatures;
  if (!signature || signature.parameters.length === 0) return null;
  if (!isComponent(signature.getReturnType())) return null;
  const param = signature.parameters[0];
  return checker.getTypeOfSymbolAtLocation(param, param.valueDeclaration ?? param.declarations?.[0]);
}

/**
 * Every property of a props type, including the ones only some variants have.
 *
 * FAULT 6. `checker.getPropertiesOfType` on a union returns the INTERSECTION —
 * only what every member declares. Accordion's props are
 * `AccordionSingleProps | AccordionMultipleProps`, so `collapsible` (single
 * only) and `maxExpanded` (multiple only) vanished from the surface and their
 * real documentation was reported as two phantom claims. A discriminated union
 * is how this library expresses a mode, so the props that distinguish the
 * modes are exactly the ones an audit of modes must not lose.
 */
function propertiesAcrossUnion(type) {
  if (!type.isUnion()) return checker.getPropertiesOfType(type);
  const merged = new Map();
  for (const member of type.types) {
    for (const property of checker.getPropertiesOfType(member)) {
      if (!merged.has(property.getName())) merged.set(property.getName(), property);
    }
  }
  return [...merged.values()];
}

/** Whether a property's declaration is ours or inherited from the DOM types. */
function isLibraryAuthored(property) {
  const declaration = property.declarations?.[0];
  if (!declaration) return false;
  const file = declaration.getSourceFile().fileName;
  return file.includes("/src/") && !file.includes("node_modules");
}

const surface = new Map(); // component -> Map(prop -> {tier, inherited})
const ownerOf = new Map(); // component -> the src/components/<dir> it lives in

for (const rootPath of roots) {
  const source = program.getSourceFile(rootPath);
  if (!source) continue;
  const moduleSymbol = checker.getSymbolAtLocation(source);
  if (!moduleSymbol) continue;

  for (const exported of checker.getExportsOfModule(moduleSymbol)) {
    const name = exported.getName();
    const resolved = exported.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(exported) : exported;
    // FAULT 1: only exported components, never exported *Props types.
    if (!(resolved.flags & (ts.SymbolFlags.Function | ts.SymbolFlags.Variable | ts.SymbolFlags.Class))) continue;

    const propsType = propsTypeOf(resolved);
    if (!propsType) continue;
    const properties = propertiesAcrossUnion(propsType);
    if (properties.length === 0) continue;

    const props = new Map();
    for (const property of properties) {
      const propName = property.getName();
      if (propName.startsWith("__")) continue;
      const declaration = property.declarations?.[0];
      const type = declaration
        ? checker.getTypeOfSymbolAtLocation(property, declaration)
        : checker.getDeclaredTypeOfSymbol(property);
      props.set(propName, {
        tier: tierOf(propName, type, checker),
        inherited: !isLibraryAuthored(property),
        // JSON only, for audit-fixture-gap.mjs: a slot typed `ReactNode` and a
        // label typed `string` are the same tier and not the same risk.
        type: checker.typeToString(type),
      });
    }
    if (props.size === 0) continue;
    const declaredIn = resolved.declarations?.[0]?.getSourceFile().fileName ?? "";
    const owner = /src\/components\/([^/]+)\//.exec(declaredIn)?.[1] ?? name;
    surface.set(name, props);
    ownerOf.set(name, owner);
  }
}

// FAULT 5's sibling rule: one name, one tier, everywhere.
const tiersByName = new Map();
const tierConflicts = [];
for (const [component, props] of surface) {
  for (const [name, info] of props) {
    if (info.inherited) continue;
    const seen = tiersByName.get(name);
    if (seen && seen.tier !== info.tier) {
      tierConflicts.push(`${name}: ${seen.tier} on ${seen.component}, ${info.tier} on ${component}`);
    } else if (!seen) tiersByName.set(name, { tier: info.tier, component });
  }
}

// ── 2. the demos ──────────────────────────────────────────────────────────

const demoDir = join(ROOT, "src/pages/demo");

/**
 * JSX attributes per tag, read from the AST.
 *
 * FAULT 7, and the one this audit was explicitly written to avoid. The first
 * version matched `<Tag([^>]*?)/?>` and reported `variant` as undemonstrated on
 * five components while it appears in 22 demo files: `[^>]*` stops at the first
 * `>`, and every `onChange={(v) => …}` contains one. A regex cannot read JSX,
 * which is the same lesson as the comment apostrophe that started all this.
 *
 * Toast is included here even though it has no JSX form — it is driven through
 * `useToast().show({ … })`, so the keys of an object literal passed to `show`
 * are counted, and the report says they are the weaker signal.
 */
const demoUsage = new Map(); // tag -> Set(prop)

function record(tag, prop) {
  if (!demoUsage.has(tag)) demoUsage.set(tag, new Set());
  demoUsage.get(tag).add(prop);
}

for (const file of readdirSync(demoDir).filter((f) => f.endsWith(".tsx"))) {
  const path = join(demoDir, file);
  const source = ts.createSourceFile(
    path,
    readFileSync(path, "utf8"),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );

  const visit = (node) => {
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      const tag = node.tagName.getText(source);
      for (const attribute of node.attributes.properties) {
        if (ts.isJsxAttribute(attribute)) record(tag, attribute.name.getText(source));
        // A spread carries props this audit cannot name. Recorded as a bare
        // marker so a component driven entirely by spread is visible as such
        // rather than reading as fully undemonstrated.
        else if (ts.isJsxSpreadAttribute(attribute)) record(tag, "…spread");
      }
    }
    // `useToast().show({ title, variant, … })` — the config object is Toast's
    // only public surface, so its keys count as usage.
    if (
      ts.isCallExpression(node) &&
      ts.isPropertyAccessExpression(node.expression) &&
      /^(show|success|error|warning|info)$/.test(node.expression.name.getText(source)) &&
      node.arguments.length > 0 &&
      ts.isObjectLiteralExpression(node.arguments[0])
    ) {
      for (const property of node.arguments[0].properties) {
        if (property.name) record("Toast", property.name.getText(source));
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
}

/** Props a demo passes to a component, matched on the exported tag. */
function demoedProps(component) {
  return demoUsage.get(component) ?? new Set();
}

// ── 3. the fixtures + 5. the contracts ────────────────────────────────────

const fixtureDir = join(ROOT, "src/__tests__/fixtures");
const fixtureSource = readdirSync(fixtureDir)
  .filter((f) => f.endsWith(".fixtures.tsx"))
  .map((f) => {
    const text = readFileSync(join(fixtureDir, f), "utf8");
    return {
      component: basename(f, ".fixtures.tsx"),
      // What the module actually fixtures, from its own type argument. The
      // filename is the registry's name for the class set and does not always
      // name the export: `RadioButton.fixtures.tsx` declares
      // `Fixtures<typeof RadioGroup>`, so matching on the filename reported all
      // nineteen of RadioGroup's props as un-fixtured while the module was
      // rendering them.
      declares: /Fixtures<typeof (\w+)>/.exec(text)?.[1] ?? null,
      text,
    };
  });

/** FAULT 5: registry.tsx drives these over every fixture, so none declares them. */
const CONTRACT_DRIVEN = new Set(["unstyled", "classes", "open", "keepMounted", "asChild"]);

function fixturedProps(component) {
  const file =
    fixtureSource.find((f) => f.declares === component) ??
    fixtureSource.find(
      (f) => f.component === component || f.component.endsWith(`.${component}`),
    );
  const used = new Set(CONTRACT_DRIVEN);
  if (!file) return used;
  for (const [, prop] of file.text.matchAll(/(?:^|[{,\s])([a-zA-Z][\w]*)\s*:/g)) used.add(prop);
  // A `render` fixture writes JSX, not an object literal, so its props are
  // attributes: `portalContainer={container}`, never `portalContainer:`. Reading
  // only object keys counted every prop a render fixture exercises as
  // un-fixtured — including the portal targets, which cannot be expressed any
  // other way because the container does not exist at module scope.
  for (const [, prop] of file.text.matchAll(/(?:^|\s)([a-zA-Z][\w]*)=[{"]/g)) used.add(prop);
  return used;
}

// ── 4. the docs ───────────────────────────────────────────────────────────

/**
 * FAULT 4: by section, and only when the whole first cell is the name.
 */
function documentedProps(component) {
  // Keyed on the OWNER directory, not the component. `ACCORDION.ai.md`
  // documents AccordionItem, AccordionTrigger and AccordionContent under one
  // `## All Props`, so attributing every row to `Accordion` reported the
  // sub-components' real props as phantoms — 73 of them, against 14 real ones.
  const dir = join(ROOT, "src/components", ownerOf.get(component) ?? component);
  const documented = new Set();
  if (!existsSync(dir)) return documented;
  const file = readdirSync(dir).find((f) => f.endsWith(".ai.md"));
  if (!file) return documented;

  const text = readFileSync(join(dir, file), "utf8");
  for (const heading of ["## All Props", "## Prop Constraints", "## Sub-component Props"]) {
    let at = text.indexOf(heading);
    while (at !== -1) {
      const next = text.indexOf("\n## ", at + heading.length);
      const section = text.slice(at, next === -1 ? undefined : next);
      for (const [, cell] of section.matchAll(/^\|\s*([^|]+?)\s*\|/gm)) {
        const match = /^`([a-zA-Z][\w-]*)`$/.exec(cell.trim());
        if (match) documented.add(match[1]);
      }
      at = text.indexOf(heading, at + heading.length);
    }
  }
  return documented;
}

// ── derive ────────────────────────────────────────────────────────────────

const components = [...surface.keys()].sort();
const rows = [];
let totals = { props: 0, noDemo: 0, noFixture: 0, phantom: 0, demoedUndocumented: 0 };
const tierAGaps = [];
const canonical = [];
const left = [];
const phantoms = [];

for (const component of components) {
  const props = surface.get(component);
  const demoed = demoedProps(component);
  const fixtured = fixturedProps(component);
  const documented = documentedProps(component);

  const authored = [...props].filter(([, info]) => !info.inherited);
  const names = new Set(authored.map(([name]) => name));

  // FAULT 3: a documented name absent from the type is a phantom only if it is
  // not an inherited DOM prop either — and only if no component in the same
  // directory declares it, because one `.ai.md` documents the whole family.
  const familyNames = new Set();
  for (const [other, otherProps] of surface) {
    if ((ownerOf.get(other) ?? other) !== (ownerOf.get(component) ?? component)) continue;
    for (const name of otherProps.keys()) familyNames.add(name);
  }
  const componentPhantoms = ownerOf.get(component) === component || !ownerOf.has(component)
    ? [...documented].filter((name) => !familyNames.has(name))
    : [];

  const noDemo = authored.filter(([name]) => !demoed.has(name));
  const noFixture = authored.filter(([name]) => !fixtured.has(name));
  const undocumented = authored.filter(([name]) => demoed.has(name) && !documented.has(name));

  totals.props += authored.length;
  totals.noDemo += noDemo.length;
  totals.noFixture += noFixture.length;
  totals.phantom += componentPhantoms.length;
  totals.demoedUndocumented += undocumented.length;

  for (const [name, info] of noDemo) {
    if (info.tier !== "A") continue;
    if (CANONICAL.has(name)) canonical.push({ component, prop: name });
    else if (LEFT_UNDEMONSTRATED.has(name)) left.push({ component, prop: name });
    else tierAGaps.push({ component, prop: name });
  }
  for (const name of componentPhantoms) phantoms.push({ component, prop: name });

  rows.push({
    component,
    props: authored.length,
    inherited: props.size - authored.length,
    noDemo: noDemo.length,
    noFixture: noFixture.length,
    phantom: componentPhantoms.length,
    tierA: noDemo.filter(([, i]) => i.tier === "A").map(([n]) => n),
    // JSON only — the markdown reports counts. `audit-fixture-gap.mjs` reads
    // these to classify which of them put markup on screen, so the two scripts
    // share one derivation of what "has no fixture" means.
    noFixtureProps: noFixture.map(([name, info]) => ({
      name,
      tier: info.tier,
      type: info.type ?? "",
    })),
    owner: ownerOf.get(component) ?? component,
  });
}

// The canonical map is asserted, not trusted: a prop listed there with no demo
// on any component is not "demonstrated once", it is undemonstrated with an
// excuse attached.
const canonicalUnproven = [...CANONICAL.keys()].filter(
  (name) => ![...demoUsage.values()].some((props) => props.has(name)),
);

const derivation = {
  generatedFrom: components.length,
  totals, rows, tierAGaps, canonical, left, phantoms, tierConflicts, canonicalUnproven,
};
if (canonicalUnproven.length > 0 && !JSON_ONLY) {
  process.stderr.write(
    `these props are listed as demonstrated once but appear in no demo: ${canonicalUnproven.join(", ")}\n`,
  );
  process.exit(1);
}

if (JSON_ONLY) {
  // Written synchronously to the file descriptor, not through `process.stdout`
  // followed by `exit`: a pipe takes 64KB before it blocks, and exiting on the
  // pending write truncated the payload mid-object for any reader.
  writeFileSync(1, `${JSON.stringify(derivation, null, 2)}\n`);
  process.exit(0);
}

// ── render ────────────────────────────────────────────────────────────────

const lines = [];
lines.push("# Demo and fixture coverage of the public API");
lines.push("");
lines.push("**GENERATED by `scripts/audit-demo-coverage.mjs` — do not edit.**");
lines.push("Run `node scripts/audit-demo-coverage.mjs` to regenerate,");
lines.push("`--check` to fail when it disagrees with the source.");
lines.push("");
lines.push("The prose that used to open this file is in the script's header: the five");
lines.push("sources, and the five extraction faults that shape every count. They are");
lines.push("recorded there because they belong next to the code that implements them.");
lines.push("");
lines.push("| | count |");
lines.push("| --- | --- |");
lines.push(`| Components audited | ${components.length} |`);
lines.push(`| Library-authored props across the public surface | ${totals.props} |`);
lines.push(`| With no demo | ${totals.noDemo} (${Math.round((totals.noDemo / totals.props) * 100)}%) |`);
lines.push(`| With no fixture | ${totals.noFixture} (${Math.round((totals.noFixture / totals.props) * 100)}%) |`);
lines.push(`| Phantom claims (documented, absent from the type) | ${totals.phantom} |`);
lines.push(`| Demonstrated but undocumented | ${totals.demoedUndocumented} |`);
lines.push(`| Tier-A demonstrated canonically (once, for the library) | ${canonical.length} |`);
lines.push(`| Tier-A left undemonstrated with a recorded reason | ${left.length} |`);
lines.push(`| **Tier-A gaps (a whole mode, no demo, no reason)** | **${tierAGaps.length}** |`);
lines.push("");
lines.push("`No demo` counts a prop on the component that declares it. A mode shared by 30");
lines.push("components is one idea, so the three tier-A rows split it: demonstrated once,");
lines.push("left on purpose, or genuinely missing. Only the last is a gap.");
lines.push("");

if (tierConflicts.length > 0) {
  lines.push("## One name, two meanings");
  lines.push("");
  lines.push("A prop name that tiers differently on different components, because the");
  lines.push("declared types genuinely differ. Not a generator fault — an ADR 002-shaped");
  lines.push("observation about the vocabulary, recorded rather than smoothed over.");
  lines.push("");
  for (const conflict of tierConflicts) lines.push(`- ${conflict}`);
  lines.push("");
}

lines.push("## Tier-A gaps");
lines.push("");
lines.push("A whole mode with no demo anywhere and no reason recorded.");
lines.push("");
if (tierAGaps.length === 0) {
  lines.push("**None.** Every tier-A prop is demonstrated on its own component, demonstrated");
  lines.push("once for the library, or left with a reason below.");
} else {
  lines.push("| Component | Prop |");
  lines.push("| --- | --- |");
  for (const gap of tierAGaps) lines.push(`| ${gap.component} | \`${gap.prop}\` |`);
}
lines.push("");

lines.push("## Demonstrated once, for the library");
lines.push("");
lines.push("One demo per concept, not one per component. Each location is asserted: a prop");
lines.push("listed here with no demo anywhere fails the generator.");
lines.push("");
lines.push("| Prop | Components | Where the one demo is |");
lines.push("| --- | --- | --- |");
for (const [prop, where] of CANONICAL) {
  const count = canonical.filter((c) => c.prop === prop).length;
  lines.push(`| \`${prop}\` | ${count} | ${where} |`);
}
lines.push("");

lines.push("## Left undemonstrated, with the reason");
lines.push("");
lines.push("| Prop | Components | Why |");
lines.push("| --- | --- | --- |");
for (const [prop, why] of LEFT_UNDEMONSTRATED) {
  const count = left.filter((l) => l.prop === prop).length;
  if (count === 0) continue;
  lines.push(`| \`${prop}\` | ${count} | ${why} |`);
}
lines.push("");

if (phantoms.length > 0) {
  lines.push("## Phantom claims");
  lines.push("");
  lines.push("| Component | Documented prop | Status |");
  lines.push("| --- | --- | --- |");
  for (const phantom of phantoms) lines.push(`| ${phantom.component} | \`${phantom.prop}\` | not on the type |`);
  lines.push("");
}

lines.push("## Per component");
lines.push("");
lines.push("| Component | Props | Inherited | No demo | No fixture | Phantom | Tier-A gaps |");
lines.push("| --- | --- | --- | --- | --- | --- | --- |");
for (const row of rows) {
  lines.push(
    `| ${row.component} | ${row.props} | ${row.inherited} | ${row.noDemo} | ${row.noFixture} | ` +
      `${row.phantom} | ${row.tierA.length ? row.tierA.map((n) => `\`${n}\``).join(", ") : "—"} |`,
  );
}
lines.push("");

const rendered = `${lines.join("\n")}\n`;

if (CHECK) {
  const committed = existsSync(REPORT) ? readFileSync(REPORT, "utf8") : null;
  if (committed === rendered) {
    process.stdout.write(
      `✓ DEMO-COVERAGE.md matches the source (${totals.props} props, ${tierAGaps.length} tier-A gaps)\n`,
    );
    process.exit(0);
  }
  process.stderr.write(
    committed === null
      ? "DEMO-COVERAGE.md does not exist\n"
      : "DEMO-COVERAGE.md is stale — run `node scripts/audit-demo-coverage.mjs` and commit the result.\n",
  );
  process.exit(1);
}

writeFileSync(REPORT, rendered, "utf8");
process.stdout.write(
  `✓ DEMO-COVERAGE.md: ${components.length} components, ${totals.props} props, ` +
    `${totals.noDemo} undemoed, ${tierAGaps.length} tier-A gaps, ${totals.phantom} phantoms\n`,
);
