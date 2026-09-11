import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import ts from "typescript";

/**
 * No two instances of one component on a demo page share a piece of state.
 *
 * DatePicker's page had twelve pickers driven by three variables: `singleDate`
 * fed five sections, `rangeValue` five, `controlledDate` two. Picking a date in
 * Basic Usage moved Date Markers, Events Calendar, Custom Presets and Event
 * Callbacks with it, so the moment a reader touched anything, no section was
 * showing the thing its heading claimed. Nothing caught it: the page compiles,
 * renders, and every gate passes, because sharing state is not an error — it is
 * only wrong when the sections are meant to be independent illustrations.
 *
 * Source-level and exact, so it costs nothing: find `value={x}` on a component,
 * group by the identifier, and fail where one identifier feeds the same
 * component twice.
 */
const DEMO_DIR = "src/pages/demo";

interface Sharing {
  page: string;
  component: string;
  state: string;
  count: number;
}

const findSharing = (): Sharing[] => {
  const out: Sharing[] = [];
  for (const file of readdirSync(DEMO_DIR).filter((f) => f.endsWith("Demo.tsx"))) {
    const path = join(DEMO_DIR, file);
    const sf = ts.createSourceFile(path, readFileSync(path, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    // component -> state identifier -> how many instances read it
    const seen = new Map<string, Map<string, number>>();

    const visit = (node: ts.Node): void => {
      if (ts.isJsxSelfClosingElement(node) || ts.isJsxOpeningElement(node)) {
        const tag = node.tagName.getText(sf);
        // Library components only: a lowercase tag is a DOM element, and a
        // page's own wrapper is not what this is about.
        if (/^[A-Z]/.test(tag)) {
          for (const attr of node.attributes.properties) {
            if (!ts.isJsxAttribute(attr)) continue;
            if (attr.name.getText(sf) !== "value") continue;
            const init = attr.initializer;
            if (!init || !ts.isJsxExpression(init) || !init.expression) continue;
            const expr = init.expression;
            // `value={x}` only. `value={x ?? y}` or a call is a derived value,
            // not a shared store, and reads independently.
            if (!ts.isIdentifier(expr)) continue;
            const byState = seen.get(tag) ?? new Map<string, number>();
            byState.set(expr.text, (byState.get(expr.text) ?? 0) + 1);
            seen.set(tag, byState);
          }
        }
      }
      ts.forEachChild(node, visit);
    };
    visit(sf);

    for (const [component, byState] of seen) {
      for (const [state, count] of byState) {
        if (count > 1) out.push({ page: file, component, state, count });
      }
    }
  }
  return out;
};

/**
 * The other shape of the same defect: one state read by two SECTIONS.
 *
 * The rule above groups by component and by `value`, so it only sees a control
 * driven twice. Breadcrumb's page had neither — `clickedItem` was a result
 * line, written by the Per-Item Click Handlers example and by the
 * `onDropdownOpenChange` example, and rendered under both. Opening the ellipsis
 * anywhere on the page put "Dropdown closed" under the section that reports
 * which ITEM was clicked, which is what it showed on arrival, before anything
 * had been clicked at all.
 *
 * An allowlist rather than a count: each entry is a page and a state someone
 * has to argue for, and a new one is a line in a diff. The fourteen below were
 * measured when this was written and are not endorsed — Pagination drives
 * twenty sections from one `value` and Drawer seventeen from one `open`, so
 * touching either page's first example moves every example under it. They are
 * listed so the number cannot grow while they are unpicked.
 */
const SHARED_ACROSS_SECTIONS = new Set([
  "ButtonDemo.tsx:loading",
  "DrawerDemo.tsx:open",
  "InputDemo.tsx:search",
  "InputDemo.tsx:showPw",
  "PaginationDemo.tsx:value",
  "PaginationDemo.tsx:rowsPerPage",
  "SliderDemo.tsx:range",
  "SliderDemo.tsx:opacity",
  "SliderDemo.tsx:price",
  "TableDemo.tsx:selectedRowId",
  "TableDemo.tsx:isFloatingActionsHovered",
  "TableDemo.tsx:rowsPerPage",
  "TableDemo.tsx:expandedRowIds",
  "TableDemo.tsx:density",
]);

/**
 * Identifier -> the state it belongs to, for both halves of the pair.
 *
 * The SETTER counts. Breadcrumb's two sections did not both read
 * `clickedItem`: one read it and the other only called `setClickedItem`, which
 * is the write that put the wrong line under the first one. A rule that watches
 * reads alone passes that untouched — it did, when this gate was planted with
 * the original defect.
 */
const stateNames = (sf: ts.SourceFile): Map<string, string> => {
  const out = new Map<string, string>();
  const visit = (n: ts.Node): void => {
    if (
      ts.isVariableDeclaration(n) &&
      n.initializer &&
      ts.isCallExpression(n.initializer) &&
      n.initializer.expression.getText(sf) === "useState" &&
      ts.isArrayBindingPattern(n.name)
    ) {
      const [value, setter] = n.name.elements;
      if (value && ts.isBindingElement(value) && ts.isIdentifier(value.name)) {
        const state = value.name.text;
        out.set(state, state);
        if (setter && ts.isBindingElement(setter) && ts.isIdentifier(setter.name)) {
          out.set(setter.name.text, state);
        }
      }
    }
    ts.forEachChild(n, visit);
  };
  visit(sf);
  return out;
};

/** `page:state` for every state any two `<Section>` subtrees both mention. */
const findCrossSectionState = (): string[] => {
  const out: string[] = [];
  for (const file of readdirSync(DEMO_DIR).filter((f) => f.endsWith("Demo.tsx"))) {
    const path = join(DEMO_DIR, file);
    const sf = ts.createSourceFile(path, readFileSync(path, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const states = stateNames(sf);
    const sections = new Map<string, Set<string>>();
    const visit = (node: ts.Node): void => {
      if (ts.isJsxElement(node) && node.openingElement.tagName.getText(sf) === "Section") {
        const used = new Set<string>();
        const scan = (n: ts.Node): void => {
          const state = ts.isIdentifier(n) ? states.get(n.text) : undefined;
          if (state) used.add(state);
          ts.forEachChild(n, scan);
        };
        scan(node);
        const title = String(sections.size);
        for (const u of used) {
          const where = sections.get(u) ?? new Set<string>();
          where.add(`${node.getStart(sf)}`);
          sections.set(u, where);
        }
        void title;
      }
      ts.forEachChild(node, visit);
    };
    visit(sf);
    for (const [state, where] of sections) if (where.size > 1) out.push(`${file}:${state}`);
  }
  return out.sort();
};

describe("demo state contract", () => {
  it("reads the demo pages", () => {
    // A walk that finds no pages is not a pass.
    expect(readdirSync(DEMO_DIR).filter((f) => f.endsWith("Demo.tsx")).length).toBeGreaterThan(20);
  });

  it("keeps one section's state out of another section", () => {
    const found = findCrossSectionState();
    expect(
      found.filter((f) => !SHARED_ACROSS_SECTIONS.has(f)),
      "a state two sections both read. Acting in one changes what the other shows, and " +
        "on arrival a section can already be displaying the result of a section further " +
        "down the page. Give each section its own; if it genuinely has to be shared, add " +
        "it to SHARED_ACROSS_SECTIONS with the reason",
    ).toEqual([]);
    // Down-only: an entry that has been unpicked is removed, not left standing.
    expect(
      [...SHARED_ACROSS_SECTIONS].filter((f) => !found.includes(f)),
      "listed as shared and no longer shared — delete the entry",
    ).toEqual([]);
  });

  it("reads state and sections at all", () => {
    // The walk returning nothing would pass the assertion above for the wrong
    // reason, which is how a gate ends up pointed at an empty set.
    expect(findCrossSectionState().length, "no shared state found anywhere").toBeGreaterThan(5);
  });

  it("gives every instance of a component its own state", () => {
    const shared = findSharing();
    expect(
      shared.map((s) => `${s.page}: ${s.count} <${s.component}> share \`${s.state}\``),
      "two sections illustrating different props cannot share a value — acting in " +
        "one moves the other, and neither shows what its heading claims",
    ).toEqual([]);
  });
});
