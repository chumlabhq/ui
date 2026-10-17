import ts from "typescript";
import { readFileSync, readdirSync } from "node:fs";

/**
 * Which fixtures the focus-not-obscured sweep has to reach, read from source
 * without a browser.
 *
 * The sweep counted what it found and floored the count at 50. What it found
 * moved between runs (95, 94, 90 and 88 fixtures, measured 2026-10-17) because
 * it read each fixture before the fixture's act had run, and a fixture whose
 * act opens the surface with the clipper in it was swept or not by timing. A
 * floor taken from the sweep itself cannot see that: this is the other count,
 * and a fixture it names that the sweep did not reach is named in the failure.
 *
 * Two readings, kept apart:
 * - `staticFixtures` reads every `*.fixtures.tsx` the way `fixtures/index.ts`
 *   globs them: each object literal (or identifier naming one) in an array
 *   literal that has a string `name`, plus the two copies `motionOverrides(base)`
 *   adds (`_motion.ts`);
 * - `CLIPPED` says, per component, which of those render a focusable inside a
 *   clipping ancestor by the sweep's rule (`_clip.ts`): an `overflow` of
 *   hidden, auto, scroll or clip between the control and the fixture or portal
 *   root, which is itself a boundary. Each entry names the clipper in source.
 *
 * A component with a clipping style and no entry has none the rule can see:
 * Dropdown, SearchableDropdown, MultiSelectDropdown,
 * MultiSelectSearchableDropdown, InternationalPhoneInput and TimePicker clip on
 * the panel that is the portal root, and their rows are not focusable; Avatar's
 * control, Button and TextArea clip on the focusable itself; CountryFlag and
 * Loader render nothing focusable.
 */

const DIR = "src/__tests__/fixtures";

export type StaticFixture = {
  /** `Component/fixture`, as the fixture route names it. */
  id: string;
  component: string;
  props: string;
  act: string;
  render: string;
  children: string;
  wrap: string;
};

export function staticFixtures(dir = DIR): StaticFixture[] {
  const out: StaticFixture[] = [];
  for (const file of readdirSync(dir).filter((f) => f.endsWith(".fixtures.tsx")).sort()) {
    const component = file.replace(".fixtures.tsx", "").replace(/\.(?=[A-Z])/g, "/");
    const sf = ts.createSourceFile(file, readFileSync(`${dir}/${file}`, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);

    const literals = new Map<string, ts.Expression>();
    const collect = (node: ts.Node) => {
      if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.initializer) {
        literals.set(node.name.text, node.initializer);
      }
      ts.forEachChild(node, collect);
    };
    collect(sf);

    const resolve = (e: ts.Expression | undefined): ts.ObjectLiteralExpression | null => {
      if (!e) return null;
      if (ts.isObjectLiteralExpression(e)) return e;
      if (ts.isIdentifier(e)) return resolve(literals.get(e.text));
      // `motionOverrides(fixtures[0])`
      if (ts.isElementAccessExpression(e) && ts.isNumericLiteral(e.argumentExpression)) {
        const array = literals.get(e.expression.getText(sf));
        return array && ts.isArrayLiteralExpression(array) ? resolve(array.elements[Number(e.argumentExpression.text)]) : null;
      }
      return null;
    };
    const fixture = (o: ts.ObjectLiteralExpression, name?: string, extraProps = ""): StaticFixture | null => {
      const prop = (key: string) =>
        o.properties.find((p) => (ts.isPropertyAssignment(p) || ts.isMethodDeclaration(p)) && p.name.getText(sf) === key);
      const own = prop("name");
      if (!own || !ts.isPropertyAssignment(own) || !ts.isStringLiteralLike(own.initializer)) return null;
      const text = (key: string) => prop(key)?.getText(sf) ?? "";
      return {
        id: `${component}/${name ?? own.initializer.text}`,
        component,
        props: text("props") + extraProps,
        act: text("act"),
        render: text("render"),
        children: text("children"),
        wrap: text("wrap"),
      };
    };

    const visit = (node: ts.Node) => {
      if (ts.isArrayLiteralExpression(node)) {
        for (const el of node.elements) {
          if (ts.isSpreadElement(el) && ts.isCallExpression(el.expression) && el.expression.expression.getText(sf) === "motionOverrides") {
            const base = resolve(el.expression.arguments[0]);
            if (!base) continue;
            for (const [name, value] of [["reduce-motion-forced", "true"], ["reduce-motion-refused", "false"]]) {
              const f = fixture(base, name, ` reduceMotion: ${value}`);
              if (f) out.push(f);
            }
            continue;
          }
          const o = resolve(el as ts.Expression);
          const f = o && fixture(o);
          if (f) out.push(f);
        }
      }
      ts.forEachChild(node, visit);
    };
    visit(sf);
  }
  return out;
}

const CLIPPED: Record<string, { clipper: string; swept: (f: StaticFixture) => boolean }> = {
  Accordion: {
    clipper: "overflow-hidden on the bordered and separated variants (Accordion/utils/constants.ts:64,70)",
    swept: (f) => /variant: "(bordered|separated)"/.test(f.props),
  },
  Breadcrumb: {
    clipper: "the tooltip trigger's `truncate` around each link (Tooltip/utils/constants.ts:40)",
    swept: (f) => /showTooltips: true/.test(f.props),
  },
  CascadingDropdown: {
    clipper: "the submenu's overflow-y-auto (CascadingDropdown/utils/constants.ts:18), inside the menu's portal root; only the submenu search is focusable",
    swept: (f) => /showSubmenuSearch: true/.test(f.props) && /^act: (openSubmenu|searchSubmenu)$/.test(f.act),
  },
  DatePicker: {
    clipper: "the month menu's overflow-auto (DatePicker/constants.ts:33), open only after the act",
    swept: (f) => /Select month/.test(f.act),
  },
  Drawer: {
    clipper: "the panel's overflow-y-auto (Drawer/utils/constants.ts:20), around an open drawer's close button or content",
    swept: (f) => (/open: true/.test(f.props) && /<DrawerCloseButton/.test(f.children)) || /<TallDrawer/.test(f.render),
  },
  Modal: {
    clipper: "the panel's overflow-hidden (Modal/utils/constants.ts:11), around the header's close button",
    swept: (f) => /(open|keepMounted): true/.test(f.props) && !/show(CloseButton|Header): false/.test(f.props),
  },
  Pagination: {
    clipper: "the page list's overflowX auto when the row cannot fit its pages (Pagination.tsx:487)",
    swept: (f) => /width: \d+/.test(f.wrap),
  },
  Stepper: {
    clipper: "the horizontal list's overflow-x-auto (Stepper.tsx:763), around any step that is not disabled",
    swept: (f) => !/orientation: "vertical"/.test(f.props) && !/disabled: true/.test(f.props),
  },
  TabPanel: {
    clipper: "the tab strip's overflow-x-auto (TabPanel/utils/constants.ts:7)",
    swept: () => true,
  },
  Table: {
    clipper: "the scroll region's overflow-x-auto (Table/constants.ts:52), or the mobile container's inline overflow (Table.tsx:1909) around its search",
    swept: (f) =>
      f.render
        ? /<CheckboxPair/.test(f.render)
        : !/data: \[\]/.test(f.props) && (!/renderMobileCard/.test(f.props) || /showSearch: true/.test(f.props)),
  },
  Toast: {
    clipper: "the root's overflow-hidden (Toast/utils/constants.ts:45), around the close button",
    swept: (f) => !/showCloseButton: false/.test(f.props),
  },
  Tooltip: {
    clipper: "the trigger's `truncate` (Tooltip/utils/constants.ts:40) around an element child; a disabled tooltip renders the child bare",
    swept: (f) => /<button/.test(f.children + f.render) && !/disabled: true/.test(f.props),
  },
};

/** The fixtures the sweep must reach, by id. */
export const clippedFixtures = (dir = DIR): string[] =>
  staticFixtures(dir)
    .filter((f) => CLIPPED[f.component]?.swept(f))
    .map((f) => f.id);
