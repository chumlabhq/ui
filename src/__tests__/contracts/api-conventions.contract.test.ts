/**
 * The API conventions, held for every prop a new component will add.
 *
 * api-names.contract keeps each OLD name from coming back. This keeps a NEW
 * name from breaking the rule the old one broke: A2a–A2d renamed 145 props and
 * 17 slots to twelve conventions (docs/adr/008-api-conventions.md), and nothing
 * stopped the 146th. Seven of the twelve are mechanical enough to read off the
 * types, and each is checked here over every public props type, by the
 * compiler:
 *
 *   boolean-prefix   a boolean prop named is…, has…, enable…, disable…
 *   pascal-case      a prop whose name starts with a capital
 *   promise-callback an on… prop that returns a Promise (a loader, not an event)
 *   controlled-pair  value / checked / open without its default… and on…Change,
 *                    or an on<X>Change with no <x> it reports on
 *   physical-side    a …Position or side-like prop that takes "left" | "right"
 *   slot-vocabulary  a `classes` key outside the shared slot vocabulary
 *   component-icon   an icon prop that takes a component instead of a ReactNode
 *
 * The other five (names of field props, the size scale, className routing, ref
 * targets, one name per concept) are judgement or runtime: routing and refs have
 * their own runtime contracts, and the rest are the ADR's to argue.
 *
 * Population: every export of the 30 component directories in
 * ai/component-index.json whose call signature takes a props object — 106
 * exports, sub-components, shimmers and glyph icons included, React contexts
 * left out. Own props only: a
 * member declared outside node_modules and the TypeScript lib. Inherited DOM
 * props (`onChange`, `hidden`, `defaultValue` on a native input) are React's
 * vocabulary, not ours, and are left out on purpose.
 *
 * Exceptions are named with the rule, the prop and the reason, and one that
 * excuses nothing fails, so the list cannot outlive what it describes. Each
 * rule proves it can fail against a planted props type compiled in memory
 * below, not in src/components.
 */
import { describe, expect, it } from "vitest";
import ts from "typescript";
import { resolve } from "node:path";
import { OPTIONS, componentViews, viewsOf, type PropsView } from "../../test/propsWalk.js";

// ── What the rules read ────────────────────────────────────────────────────

const nonNull = (v: PropsView, t: ts.Type) => v.checker.getNonNullableType(t);
const members = (t: ts.Type) => (t.isUnion() ? t.types : [t]);
const isBooleanish = (v: PropsView, t: ts.Type) =>
  members(nonNull(v, t)).every((m) => (m.flags & (ts.TypeFlags.Boolean | ts.TypeFlags.BooleanLiteral)) !== 0);
const literals = (v: PropsView, t: ts.Type) =>
  members(nonNull(v, t)).filter((m) => m.isStringLiteral()).map((m) => (m as ts.StringLiteralType).value);
const isComponentLike = (v: PropsView, t: ts.Type) =>
  members(nonNull(v, t)).some((m) => m.getConstructSignatures().length > 0 || m.getCallSignatures().length > 0);
const returnsPromise = (v: PropsView, t: ts.Type) =>
  members(nonNull(v, t)).some((m) =>
    m.getCallSignatures().some((s) =>
      members(s.getReturnType()).some((r) => /^Promise</.test(v.checker.typeToString(r)) || r.getSymbol()?.name === "Promise"),
    ),
  );
const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

/**
 * The shared slot vocabulary: every `classes` key in the library after A2d,
 * read by the walk below — 435 entries on 40 exports, 127 distinct names (153
 * counted by their nested path, `countrySelect.item`, which is the audit's
 * figure; the audit's 431 entries came from a method its text does not pin
 * down, and this walk reads 435 at the audit's own commit too). A slot outside
 * it is either a synonym of one of these, which is what A2d took out, or a new
 * part, which is added here in the commit that adds it — where a reviewer sees
 * the new name next to the 127 it could have been.
 */
const SLOT_VOCABULARY = new Set([
  "arrow", "body", "cancelTrigger", "cell", "chip", "chipRemoveTrigger", "clearTrigger", "clockCenter",
  "clockContent", "clockDisplay", "clockFace", "clockHand", "clockHandDot", "clockHandLine", "clockHours",
  "clockMinutes", "clockNumber", "clockSeparator", "closeIcon", "closeTrigger", "collapsedItem",
  "confirmTrigger", "content", "control", "count", "countrySelect", "description", "descriptionBar",
  "dragHandle", "ellipsis", "ellipsisTrigger", "empty", "expandTrigger", "fallback", "filterClearTrigger",
  "filterContent", "filterHeader", "filterItem", "filterItemControl", "filterLabel", "filterTrigger", "flag",
  "footer", "group", "groupLabel", "handle", "handleBar", "header", "headerCell", "headerCellText",
  "headerRow", "icon", "image", "indicator", "indicatorTrigger", "input", "item", "itemControl", "itemIcon",
  "itemIndicator", "itemRow", "itemText", "label", "link", "list", "listHeader", "listRow", "loading",
  "loadingBar", "loadingFooter", "loadingItem", "loadingItemControl", "loadingRow", "mark", "markLabel",
  "markerIndicator", "message", "mobileCard", "monthSelect", "navIcon", "navTrigger", "overlay", "pageInfo",
  "periodTrigger", "pinIcon", "pinTrigger", "pinnedList", "pinnedRegion", "pinnedEndList",
  "pinnedEndRegion", "positioner", "prefix", "presetGroup", "presetTrigger", "range", "resizeHandle",
  "resizeIndicator", "root", "row", "rowsPerPage", "scrollRegion", "searchControl", "searchIcon",
  "searchInput", "separator", "sortIcon", "status", "subContent", "subItem", "subPositioner",
  "subSearchControl", "subSearchIcon", "subSearchInput", "suffix", "surplus", "thumb", "title", "titleBar",
  "todayTrigger", "track", "trigger", "triggerActions", "triggerRow", "value", "weekNumber", "weekday",
  "yearSelect",
]);

// ── The rules ──────────────────────────────────────────────────────────────

type Rule =
  | "boolean-prefix"
  | "pascal-case"
  | "promise-callback"
  | "controlled-pair"
  | "physical-side"
  | "slot-vocabulary"
  | "component-icon";

interface Finding {
  rule: Rule;
  id: string;
  prop: string;
  detail: string;
}

/** Every `classes` key, nested bags included (`rowsPerPage.trigger`), with its path. */
function slotKeys(v: PropsView, t: ts.Type, path = ""): { key: string; path: string }[] {
  const out: { key: string; path: string }[] = [];
  for (const m of nonNull(v, t).getProperties()) {
    const mt = nonNull(v, v.checker.getTypeOfSymbolAtLocation(m, v.at));
    out.push({ key: m.name, path: `${path}${m.name}` });
    if (mt.flags & ts.TypeFlags.Object && !(mt.getCallSignatures().length)) out.push(...slotKeys(v, mt, `${path}${m.name}.`));
  }
  return out;
}

function check(views: PropsView[]): Finding[] {
  const out: Finding[] = [];
  for (const v of views) {
    const names = new Set(v.props.map((p) => p.name));
    const add = (rule: Rule, prop: string, detail: string) => out.push({ rule, id: v.id, prop, detail });
    for (const p of v.props) {
      const t = p.type;
      if (/^(is|has|enable|disable)[A-Z]/.test(p.name) && isBooleanish(v, t)) add("boolean-prefix", p.name, "boolean");
      if (/^[A-Z]/.test(p.name)) add("pascal-case", p.name, v.checker.typeToString(nonNull(v, t)));
      if (/^on[A-Z]/.test(p.name) && returnsPromise(v, t)) add("promise-callback", p.name, v.checker.typeToString(nonNull(v, t)));
      if (/(Position|^side|Side)$/.test(p.name)) {
        const lr = literals(v, t).filter((l) => l === "left" || l === "right");
        if (lr.length) add("physical-side", p.name, literals(v, t).join(" | "));
      }
      if (/Icon/.test(p.name) && !/^(render|on[A-Z])/.test(p.name) && isComponentLike(v, t))
        add("component-icon", p.name, v.checker.typeToString(nonNull(v, t)));
      if (p.name === "classes")
        for (const { key, path } of slotKeys(v, t)) if (!SLOT_VOCABULARY.has(key)) add("slot-vocabulary", `classes.${path}`, key);
    }
    for (const state of ["value", "checked", "open"]) {
      if (!names.has(state)) continue;
      const missing = [`default${cap(state)}`, `on${cap(state)}Change`].filter((n) => !names.has(n));
      if (missing.length) add("controlled-pair", state, `without ${missing.join(", ")}`);
    }
    for (const p of v.props) {
      const m = /^on([A-Z]\w*)Change$/.exec(p.name);
      if (!m) continue;
      const state = m[1][0].toLowerCase() + m[1].slice(1);
      if (!names.has(state)) add("controlled-pair", p.name, `no \`${state}\` it reports on`);
    }
  }
  return out;
}


// ── Each rule can fail ─────────────────────────────────────────────────────

/**
 * One props type that breaks every rule exactly once, compiled in memory at a
 * path beside this file so `react` resolves, and never written to disk.
 */
const PLANT_FILE = resolve("src/__tests__/contracts/__api_convention_plants__.tsx");
const PLANT_SOURCE = `
import type { ComponentType } from "react";
interface PlantedClasses { root?: string; plantedSlot?: string }
export interface PlantedProps {
  isPlanted?: boolean;
  PlantedProp?: string;
  onPlantedLoad?: () => Promise<string[]>;
  open?: boolean;
  plantedPosition?: "left" | "right";
  classes?: PlantedClasses;
  plantedIcon?: ComponentType<{ className?: string }>;
}
export const Planted = (props: PlantedProps) => null;
`;
const PLANTED: Record<Rule, string> = {
  "boolean-prefix": "isPlanted",
  "pascal-case": "PlantedProp",
  "promise-callback": "onPlantedLoad",
  "controlled-pair": "open",
  "physical-side": "plantedPosition",
  "slot-vocabulary": "classes.plantedSlot",
  "component-icon": "plantedIcon",
};
function plantViews(): PropsView[] {
  const host = ts.createCompilerHost(OPTIONS);
  const getSourceFile = host.getSourceFile.bind(host);
  host.getSourceFile = (name, lang, ...rest) =>
    name === PLANT_FILE ? ts.createSourceFile(name, PLANT_SOURCE, lang, true, ts.ScriptKind.TSX) : getSourceFile(name, lang, ...rest);
  const fileExists = host.fileExists.bind(host);
  host.fileExists = (name) => name === PLANT_FILE || fileExists(name);
  return viewsOf(ts.createProgram([PLANT_FILE], OPTIONS, host), [{ file: PLANT_FILE, dir: "Plant" }]);
}

// ── Named exceptions ───────────────────────────────────────────────────────

const EXCEPTIONS: { rule: Rule; id: string; prop: string; reason: string }[] = [
  { rule: "boolean-prefix", id: "Table/Table", prop: "hasMore", reason: "the infinite-scroll idiom; `more` alone does not read as a boolean" },
  { rule: "controlled-pair", id: "Accordion/AccordionItem", prop: "value", reason: "the item's identity inside Accordion's `value`, not state of its own" },
  { rule: "controlled-pair", id: "Accordion/AccordionItem", prop: "onExpandedChange", reason: "notification only: the item's expanded state is the parent Accordion's `value`" },
  { rule: "controlled-pair", id: "RadioButton/RadioButton", prop: "value", reason: "the option's identity inside RadioGroup's `value`" },
  { rule: "controlled-pair", id: "Switch/Switch", prop: "value", reason: "form data submitted when checked, like a native checkbox's `value`; the state is `checked`" },
  { rule: "controlled-pair", id: "Input/Input", prop: "onValueChange", reason: "`value` and `defaultValue` are the native input attributes, passed through; this is their string-valued companion" },
  { rule: "controlled-pair", id: "TextArea/TextArea", prop: "onValueChange", reason: "as Input: the native `value`/`defaultValue` pass through" },
  { rule: "controlled-pair", id: "InternationalPhoneInput/InternationalPhoneInput", prop: "onCountryChange", reason: "notification only: `defaultCountry` seeds the country and the number in `value` carries it after that" },
  { rule: "controlled-pair", id: "DatePicker/DatePicker", prop: "onMonthChange", reason: "notification only: the visible month is internal (api-decisions, kept)" },
  { rule: "controlled-pair", id: "Breadcrumb/Breadcrumb", prop: "onDropdownOpenChange", reason: "notification only: the overflow menu's open state is internal (api-decisions, kept)" },
  { rule: "controlled-pair", id: "Table/Table", prop: "onCursorPositionChange", reason: "notification only: a pointer position cannot be controlled" },
  { rule: "controlled-pair", id: "Table/Table", prop: "onHeaderHoverChange", reason: "notification only: hover cannot be controlled" },
  ...([["Tooltip/Tooltip", "side"], ["Breadcrumb/Breadcrumb", "tooltipSide"], ["TabPanel/TabPanel", "tooltipSide"], ["Breadcrumb/Breadcrumb", "dropdownSide"]] as const).map(
    ([id, prop]) => ({ rule: "physical-side" as const, id, prop, reason: "a floating layer's side of its anchor, one of four physical edges, as Floating UI and Radix name it" }),
  ),
];

// ── The population ─────────────────────────────────────────────────────────

const VIEWS = componentViews();
const FINDINGS = check(VIEWS);

const used = new Map(EXCEPTIONS.map((e) => [e, 0]));
const excused = (f: Finding) => {
  const e = EXCEPTIONS.find((x) => x.rule === f.rule && x.id === f.id && x.prop === f.prop);
  if (e) used.set(e, used.get(e)! + 1);
  return !!e;
};
const OPEN = FINDINGS.filter((f) => !excused(f));

const RULES: Rule[] = ["boolean-prefix", "pascal-case", "promise-callback", "controlled-pair", "physical-side", "slot-vocabulary", "component-icon"];
const slotEntries = VIEWS.flatMap((v) => v.props.filter((p) => p.name === "classes").flatMap((p) => slotKeys(v, p.type)));
console.log(
  `API_CONVENTIONS exports=${VIEWS.length} props=${VIEWS.reduce((n, v) => n + v.props.length, 0)} ` +
    `slot-entries=${slotEntries.length} slot-names=${new Set(slotEntries.map((s) => s.key)).size} ` +
    `classes-exports=${VIEWS.filter((v) => v.props.some((p) => p.name === "classes")).length} findings=${FINDINGS.length} excused=${FINDINGS.length - OPEN.length} open=${OPEN.length}`,
);
for (const r of RULES) console.log(`  ${r.padEnd(18)} open=${OPEN.filter((f) => f.rule === r).length} excused=${FINDINGS.filter((f) => f.rule === r).length - OPEN.filter((f) => f.rule === r).length}`);
for (const f of FINDINGS) console.log(`  ${excused(f) ? "excused" : "OPEN   "} ${f.rule.padEnd(18)} ${f.id}.${f.prop}  ${f.detail}`);

describe("API conventions hold for every public prop", () => {
  for (const rule of RULES) {
    it(`${rule}: no prop breaks it outside a named exception`, () => {
      expect(OPEN.filter((f) => f.rule === rule).map((f) => `${f.id}.${f.prop}: ${f.detail}`)).toEqual([]);
    });
  }

  it("each rule fails on a props type that breaks it, and only that rule", () => {
    const found = check(plantViews());
    console.log(`API_CONVENTIONS_PLANTS findings=${found.length} ${found.map((f) => `${f.rule}:${f.prop}`).join(" ")}`);
    expect(Object.fromEntries(RULES.map((r) => [r, found.filter((f) => f.rule === r).map((f) => f.prop)]))).toEqual(
      Object.fromEntries(RULES.map((r) => [r, [PLANTED[r]]])),
    );
  });

  it("every exception still excuses something", () => {
    expect([...used].filter(([, n]) => n === 0).map(([e]) => `${e.rule} ${e.id}.${e.prop}: ${e.reason}`)).toEqual([]);
  });
});
