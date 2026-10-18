/**
 * Renamed props stay renamed.
 *
 * Slice A2a renamed the callbacks and controlled pairs that broke the library's
 * own conventions: `checked` paired with `onValueChange`, a Table callback
 * named for nothing it controls, loaders spelled as events. A2b renamed the
 * prefixed booleans (`enable…`, `disable…`, `is…`), the props that called a
 * mode or a layout a `variant` or a `type`, and the `left`/`right` position
 * values, which are now `start`/`end`. A2c unified concept names (one word for
 * the visible-items cap, the edge a popup opens on, its offset, keeping
 * content mounted) and turned the PascalCase icon props into camelCase
 * ReactNode props, or `render…Icon` functions where the glyph itself changes
 * with state. A2d gave the `classes` slots one vocabulary: a clickable part is
 * a `*Trigger`, and a part another component already names takes that name
 * (`range`, `value`, `mark`, `group`). A2e folded Breadcrumb's `separatorIcon`
 * into `separator`, which takes text or an icon, and A2f folded OtpInput's
 * `groupAriaLabel` into `aria-label`, which names the group. Nothing is
 * published, so there are no aliases and no deprecations — the old name is
 * simply gone. A name that comes back anywhere, in a type, a demo, a snippet a
 * consumer copies or the docs the codegen product reads, is a second API for
 * the same thing, and the generated code picks whichever it saw last.
 *
 * Each tombstone is scoped to the components it belonged to, in one of three ways:
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
 *   narrow     the old name is a word no directory scan can read — `type`,
 *              `variant`, `mode` are TypeScript keywords, HTML attributes and
 *              other components' props inside the same files — so the scan is
 *              the public type, the schema root, the All Props tables,
 *              componentDocs, component-index, JSX attributes on the
 *              component's tags in every file including its own, the
 *              component's own fixture `props`, and for Toast the options
 *              object of every `toast.*(…)` call
 *
 * Old union VALUES are tombstoned too, where the prop kept its name:
 * `iconPosition="left"`. A value hit is the literal as a JSX attribute on the
 * component's tag, as the prop's value in its fixtures, in the schema enum and
 * the generated docs' type text, and on a line of the component's own
 * directory that names the prop. The compiler then holds each renamed prop's
 * union to exactly its new members, so a value can be neither missing nor kept.
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
  scope: "word" | "component" | "narrow";
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

  // A2b
  { old: "isFloatingActionsHovered", now: "floatingActionsHovered", components: ["Table"], scope: "word" },
  { old: "enableColumnFilters", now: "filterable", components: ["Table"], scope: "word" },
  { old: "enableColumnResizing", now: "resizable", components: ["Table"], scope: "word" },
  { old: "enableRowDragDrop", now: "reorderable", components: ["Table"], scope: "word" },
  { old: "enableCopyOnClick", now: "copyOnClick", components: ["Table"], scope: "word" },
  { old: "enableInfiniteScroll", now: "infiniteScroll", components: ["Table"], scope: "word" },
  { old: "density", now: "size", components: ["Table"], scope: "component" },
  { old: "data-density", now: "data-size", components: ["Table"], scope: "word" },
  { old: "enablePasteDetection", now: "pasteDetection", components: ["InternationalPhoneInput"], scope: "word" },
  { old: "disableAnimation", now: "reduceMotion", components: ["Modal"], scope: "word" },
  { old: "disableHoverableContent", now: "hoverableContent", components: ["Tooltip"], scope: "word" },
  { old: "showLabel", now: "rowsPerPagePrefix", components: ["Pagination"], scope: "component" },
  { old: "rowsPerPageLabel", now: "rowsPerPageSuffix", components: ["Pagination"], scope: "word" },
  { old: "type", now: "variant", components: ["Toast"], scope: "narrow" },
  { old: "ToastType", now: "ToastVariant", components: ["Toast"], scope: "word" },
  { old: "data-toast-type", now: "data-variant", components: ["Toast"], scope: "word" },
  { old: "variant", now: "mode", components: ["TimePicker"], scope: "narrow" },
  { old: "TimePickerVariant", now: "TimePickerMode", components: ["TimePicker"], scope: "word" },
  { old: "variant", now: "layout", components: ["AvatarGroup"], scope: "narrow" },
  { old: "GroupVariant", now: "AvatarGroupLayout", components: ["AvatarGroup"], scope: "word" },
  { old: "type", now: "selectionMode", components: ["Accordion"], scope: "narrow" },
  { old: "AccordionType", now: "AccordionSelectionMode", components: ["Accordion"], scope: "word" },
  { old: "data-type", now: "data-selection-mode", components: ["Accordion"], scope: "word" },
  { old: "mode", now: "selectionMode", components: ["DatePicker"], scope: "narrow" },
  { old: "DatePickerMode", now: "DatePickerSelectionMode", components: ["DatePicker"], scope: "word" },
  { old: "dotSize", now: "size", components: ["DotLoader"], scope: "word" },

  // A2c
  { old: "noResultsContent", now: "emptyContent", components: DROPDOWNS, scope: "word" },
  { old: "maxDisplayedChips", now: "maxVisible", components: ["MultiSelectDropdown", "MultiSelectSearchableDropdown"], scope: "word" },
  { old: "maxVisibleItems", now: "maxVisible", components: ["Breadcrumb"], scope: "word" },
  { old: "max", now: "maxVisible", components: ["AvatarGroup", "CountryFlagGroup"], scope: "narrow" },
  { old: "searchDebounceMs", now: "searchDebounce", components: ["SearchableDropdown", "MultiSelectSearchableDropdown", "CascadingDropdown"], scope: "word" },
  { old: "duration", now: "animationDuration", components: ["Drawer"], scope: "narrow" },
  { old: "transitionDuration", now: "animationDuration", components: ["Slider", "Switch"], scope: "component" },
  { old: "speed", now: "animationDuration", components: ["CircularLoader", "LinearLoader", "DotLoader", "PulseLoader"], scope: "component" },
  { old: "dropdownPosition", now: "dropdownSide", components: [...DROPDOWNS, "DatePicker", "TimePicker", "InternationalPhoneInput", "Breadcrumb", "Pagination"], scope: "word" },
  { old: "forceDropdownPosition", now: "forceDropdownSide", components: ["DatePicker", "Dropdown", "InternationalPhoneInput", "MultiSelectDropdown", "MultiSelectSearchableDropdown", "SearchableDropdown", "TimePicker"], scope: "word" },
  { old: "tooltipPosition", now: "tooltipSide", components: ["Breadcrumb", "TabPanel"], scope: "word" },
  { old: "submenuPosition", now: "submenuSide", components: ["CascadingDropdown"], scope: "word" },
  { old: "direction", now: "side", components: ["Drawer"], scope: "narrow" },
  { old: "DrawerDirection", now: "DrawerSide", components: ["Drawer"], scope: "word" },
  { old: "DropdownPosition", now: "DropdownSide", components: ["Breadcrumb"], scope: "word" },
  { old: "dropdownGap", now: "dropdownOffset", components: ["CascadingDropdown", "DatePicker", "Dropdown", "InternationalPhoneInput", "MultiSelectDropdown", "MultiSelectSearchableDropdown", "Pagination", "SearchableDropdown", "TimePicker"], scope: "word" },
  { old: "forceMount", now: "keepMounted", components: ["AccordionContent", "TabPanel"], scope: "word" },
  { old: "unmountOnClose", now: "keepMounted", components: ["AccordionContent"], scope: "word" },
  { old: "preventOutsideClick", now: "closeOnOverlayClick", components: ["Modal"], scope: "word" },
  { old: "ariaLabel", now: "aria-label", components: ["Table"], scope: "component" },
  { old: "startIconLabel", now: "startIconAriaLabel", components: ["Input", "TextArea"], scope: "word" },
  { old: "endIconLabel", now: "endIconAriaLabel", components: ["Input", "TextArea"], scope: "word" },
  { old: "shimmerRowCount", now: "shimmerCount", components: ["Table"], scope: "word" },
  { old: "loadingText", now: "loadingContent", components: ["Button", ...DROPDOWNS], scope: "word" },
  { old: "okText", now: "confirmText", components: ["TimePicker"], scope: "word" },
  { old: "ClearIcon", now: "clearIcon", components: DROPDOWNS, scope: "narrow" },
  { old: "SearchIcon", now: "searchIcon", components: ["CascadingDropdown", "SearchableDropdown", "Table"], scope: "narrow" },
  { old: "ChevronIcon", now: "chevronIcon", components: ["Dropdown", "MultiSelectDropdown", "SearchableDropdown"], scope: "narrow" },
  { old: "CheckIcon", now: "selectedIcon", components: ["Dropdown", "SearchableDropdown"], scope: "narrow" },
  { old: "PinIcon", now: "pinIcon", components: ["Table"], scope: "narrow" },
  { old: "PinnedIcon", now: "pinnedIcon", components: ["Table"], scope: "narrow" },
  { old: "FilterIcon", now: "renderFilterIcon", components: ["Table"], scope: "narrow" },
  { old: "ExpandIcon", now: "renderExpandIcon", components: ["Table"], scope: "narrow" },
  { old: "CheckboxIcon", now: "renderCheckboxIcon", components: ["Table"], scope: "narrow" },
  { old: "DragHandleIcon", now: "dragHandleIcon", components: ["Table"], scope: "narrow" },

  // A2e
  { old: "separatorIcon", now: "separator", components: ["Breadcrumb"], scope: "word" },

  // A2f
  { old: "groupAriaLabel", now: "aria-label", components: ["OtpInput"], scope: "word" },
];

interface ValueTombstone {
  component: string;
  prop: string;
  /** Literals the prop no longer takes. */
  old: string[];
  /** The prop's whole union now, read by the compiler. */
  now: string[];
}

/**
 * Old values on a field of an item the component takes in an array, not on a
 * prop: Breadcrumb's `items[].iconPosition`. They are read as object keys
 * (`iconPosition: "left"`) in the component's directory and fixtures, in any
 * file that renders the component, and in its generated docs and snippets.
 */
const ITEM_VALUE_TOMBSTONES = [{ component: "Breadcrumb", key: "iconPosition", old: ["left", "right"] }];

interface SlotTombstone {
  old: string;
  now: string;
  /** The exports whose `classes` had the old key. */
  components: string[];
  /**
   * `word` where no other export or file uses the name for anything else, so
   * the word anywhere in the population is the tombstone. `component` where it
   * is also English or another export's slot — TabPanel keeps its `indicator`,
   * DatePicker its `markers`, a spec its local `valueText` — so a hit counts
   * only in the component's directory, its llms-full section, its componentDocs
   * classes and component-index anatomy, and as a key of a `classes` object
   * handed to its tags (inline, or a same-file object the attribute names), to
   * a `toast(…)` call, or in its own fixtures' `props`.
   */
  scope: "word" | "component";
}

/** A2d: one vocabulary for slots. A clickable part is a `*Trigger`; the rest take the name their siblings already use. */
const SLOT_TOMBSTONES: SlotTombstone[] = [
  { old: "cancelButton", now: "cancelTrigger", components: ["TimePicker"], scope: "word" },
  { old: "confirmButton", now: "confirmTrigger", components: ["TimePicker"], scope: "word" },
  { old: "periodButton", now: "periodTrigger", components: ["TimePicker"], scope: "word" },
  { old: "navButton", now: "navTrigger", components: ["DatePicker", "Pagination"], scope: "word" },
  { old: "expandButton", now: "expandTrigger", components: ["Table"], scope: "word" },
  { old: "filterButton", now: "filterTrigger", components: ["Table"], scope: "word" },
  { old: "pinButton", now: "pinTrigger", components: ["Table"], scope: "word" },
  { old: "chipRemove", now: "chipRemoveTrigger", components: ["MultiSelectDropdown", "MultiSelectSearchableDropdown"], scope: "word" },
  // api-decisions said `loading`, the name nine others use, but MultiSelectDropdown
  // already had `loading` for the skeleton container; this is the square in each
  // skeleton row, standing in for the row's `itemControl`.
  { old: "loadingIcon", now: "loadingItemControl", components: ["MultiSelectDropdown"], scope: "word" },
  { old: "indicator", now: "range", components: ["Toast", "ToastProvider"], scope: "component" },
  { old: "valueText", now: "value", components: ["Slider"], scope: "component" },
  { old: "marker", now: "mark", components: ["Slider"], scope: "component" },
  { old: "labelGroup", now: "group", components: ["Checkbox", "Switch"], scope: "word" },
];

const VALUE_TOMBSTONES: ValueTombstone[] = [
  { component: "AccordionTrigger", prop: "iconPosition", old: ["left", "right"], now: ["start", "end", "none"] },
  { component: "TabPanel", prop: "iconPosition", old: ["left", "right"], now: ["start", "end"] },
  { component: "Button", prop: "loaderPosition", old: ["left", "right"], now: ["start", "end"] },
  { component: "Table", prop: "expandColumnPosition", old: ["left", "right"], now: ["start", "end"] },
  { component: "Table", prop: "dragColumnPosition", old: ["left", "right"], now: ["start", "end"] },
  { component: "Table", prop: "searchIconPosition", old: ["left", "right"], now: ["start", "end", "none"] },
  { component: "Stepper", prop: "labelPosition", old: ["right"], now: ["end", "bottom"] },
  { component: "Table", prop: "size", old: ["compact", "comfortable", "spacious"], now: ["sm", "md", "lg"] },
  { component: "TimePicker", prop: "mode", old: [], now: ["dropdown", "clock"] },
  { component: "AvatarGroup", prop: "layout", old: [], now: ["stack", "grid", "inline"] },
  { component: "Accordion", prop: "selectionMode", old: [], now: ["single", "multiple"] },
  { component: "DatePicker", prop: "selectionMode", old: [], now: ["single", "range", "multiple"] },
  { component: "Toast", prop: "variant", old: [], now: ["success", "warning", "error", "info"] },
  { component: "Drawer", prop: "side", old: [], now: ["left", "right", "top", "bottom"] },
  { component: "CascadingDropdown", prop: "submenuSide", old: ["left", "right"], now: ["start", "end"] },
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
  ...["src/components/Avatar/AVATAR.ai.md", "llms-full.txt"].map((file) => ({
    old: "max",
    file,
    line: /Maximum count before showing `max\+`\. Inside an `AvatarGroup`/,
    reason: "AvatarGroupCount's own max, a 99+ cap that stays max; its description names the AvatarGroup it sits in",
  })),
  ...["src/components/Switch/Switch.tsx", "src/components/Switch/__tests__/Switch.test.tsx"].map((file) => ({
    old: "transitionDuration",
    file,
    line: /transitionDuration: |style\.transitionDuration/,
    reason: "the CSS property of that name, which animationDuration sets on the thumb",
  })),
  ...(["forceMount", "unmountOnClose"] as const).map((old) => ({
    old,
    file: "src/components/Accordion/__tests__/Accordion.test.tsx",
    line: new RegExp(`${old}(: |=\\$)|\`${old}\`|forceMount wins|keeps every old`),
    reason: "the merge's own test: each old combination, mapped to keepMounted, against the mount states HEAD produced for it",
  })),
  {
    old: "forceMount",
    file: "src/components/TabPanel/__tests__/TabPanel.test.tsx",
    line: /forceMount(: |=\$)|`forceMount`|keeps every old/,
    reason: "the merge's own test: each old combination, mapped to keepMounted, against the mount states HEAD produced for it",
  },
  {
    old: "chipRemove",
    file: "ai/system-state.json",
    line: /"description": "Increased MultiSelectDropdown chipRemove from w-3 h-3/,
    reason: "the fix log's dated record of FIX-RESP-CHIP, which names the slot as it was called then",
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
for (const [exp, dir] of Object.entries({
  AccordionItem: "Accordion",
  AccordionTrigger: "Accordion",
  AvatarGroup: "Avatar",
  DotLoader: "Loader",
  CircularLoader: "Loader",
  LinearLoader: "Loader",
  PulseLoader: "Loader",
  AccordionContent: "Accordion",
  CountryFlagGroup: "CountryFlag",
  ToastProvider: "Toast",
})) DIR_OF[exp] = dir;

/** The fixture file for an export: `<Dir>.fixtures.tsx`, or `<Dir>.<Export>.fixtures.tsx` for a sub-export. */
const fixtureFileOf = (exp: string) =>
  `src/__tests__/fixtures/${DIR_OF[exp] === exp ? exp : `${DIR_OF[exp]}.${exp}`}.fixtures.tsx`;

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
function jsxAttributes(text: string, tag: string): { attrs: string[]; line: number; raw: string }[] {
  const out: { attrs: string[]; line: number; raw: string }[] = [];
  for (const m of text.matchAll(new RegExp(`<${tag}(?![\\w.])`, "g"))) {
    let i = m.index! + m[0].length;
    const start = i;
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
    out.push({ attrs, line: text.slice(0, m.index).split("\n").length, raw: text.slice(start, i) });
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

/** The other component exports of a component's directory. */
function siblingsOf(exportName: string): string[] {
  const sf = program.getSourceFile(`${SRC}/${DIR_OF[exportName]}/index.ts`);
  if (!sf) return [];
  return checker
    .getExportsOfModule(checker.getSymbolAtLocation(sf)!)
    .map((s) => s.name)
    .filter((n) => n !== exportName && /^[A-Z]/.test(n) && !/Context$|Icon$/.test(n))
    .filter((n) => {
      try {
        DIR_OF[n] ??= DIR_OF[exportName];
        propsTypeOf(n);
        return true;
      } catch {
        return false;
      }
    });
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

/** Whether a line is a named exception for `old` in `path`; counts the use. */
function excuseLine(old: string, path: string, line: string): boolean {
  for (const e of EXCEPTIONS) {
    if (e.old === old && e.file === path && e.line.test(line)) {
      excused.set(e, excused.get(e)! + 1);
      return true;
    }
  }
  return false;
}

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

/**
 * A component's documented props in its schema: the root's `properties` and
 * every `oneOf` branch (Accordion, DatePicker and Loader document their
 * discriminated unions as branches), or for a sub-export its `subComponents`
 * entry and the branch titled with its name.
 */
function schemaPropsOf(exp: string): Record<string, unknown> | null {
  const dir = DIR_OF[exp];
  const path = `${SRC}/${dir}/${dir}.schema.json`;
  if (!existsSync(path)) return null;
  const schema = JSON.parse(readFileSync(path, "utf8"));
  const branches: { title?: string; properties?: Record<string, unknown> }[] = schema.oneOf ?? [];
  const parts =
    exp === dir
      ? [schema.properties, ...branches.filter((b) => !b.title || b.title === exp).map((b) => b.properties)]
      : [schema.subComponents?.[exp]?.properties, ...branches.filter((b) => b.title === exp).map((b) => b.properties)];
  const present = parts.filter(Boolean) as Record<string, unknown>[];
  return present.length ? Object.assign({}, ...present) : null;
}

function docPropsOf(exp: string): { name: string; type: string }[] | null {
  const doc = COMPONENT_DOCS[DIR_OF[exp]];
  if (!doc) return null;
  return exp === DIR_OF[exp] ? doc.props : (doc.subComponents.find((s) => s.name === exp)?.props ?? null);
}

/**
 * Lines where a fixture's `props: { … }` object names `key` (with `value`, when
 * given). The object is read to its balanced closing brace, since props carry
 * nested objects (`tabs: TABS.map((t) => ({ ...t, icon }))`).
 */
function propsKeyHits(text: string, key: string, value?: string): number[] {
  const lines: number[] = [];
  const keyRe = new RegExp(`(?<![\\w$.])${key}\\s*:${value === undefined ? "" : `\\s*["']${value}["']`}`, "g");
  for (const m of text.matchAll(/props:\s*\{/g)) {
    const open = m.index! + m[0].length - 1;
    let depth = 0;
    let i = open;
    for (; i < text.length; i++) {
      if (text[i] === "{") depth++;
      else if (text[i] === "}" && --depth === 0) break;
    }
    for (const k of text.slice(open, i).matchAll(keyRe)) lines.push(text.slice(0, open + k.index!).split("\n").length);
  }
  return lines;
}

/**
 * Lines where a call into the toast API carries the key in its arguments: every
 * `ToastContextValue` method on a toast-named object (`toast.toast(…)`,
 * `toastApi.info(…)`), the provider's own `addToast(…)`, and — in a file that
 * calls `useToast()` — the methods destructured out of it (`info(…)`).
 */
function toastCallKeyHits(text: string, key: string): number[] {
  const lines: number[] = [];
  const keyRe = new RegExp(`(?<![\\w$.])${key}\\s*:`);
  const calls = /useToast\(/.test(text)
    ? /(?<![\w$.])(?:addToast|toast|success|warning|error|info|\w*[tT]oast\w*\.(?:toast|success|warning|error|info))\s*\(/g
    : /(?<![\w$.])(?:addToast|\w*[tT]oast\w*\.(?:toast|success|warning|error|info))\s*\(/g;
  for (const m of text.matchAll(calls)) {
    let depth = 0;
    let i = m.index! + m[0].length - 1;
    for (; i < text.length; i++) {
      if (text[i] === "(") depth++;
      else if (text[i] === ")" && --depth === 0) break;
    }
    if (keyRe.test(text.slice(m.index!, i))) lines.push(text.slice(0, m.index).split("\n").length);
  }
  return lines;
}

/** The literal members of a prop's union, as the checker reads them; empty when it is not a literal union. */
function literalsOf(exportName: string, prop: string): string[] | null {
  const { type, at } = propsTypeOf(exportName);
  const members = type.isUnion() ? type.types.map((t) => t.getProperty(prop)).filter(Boolean) : [type.getProperty(prop)];
  if (!members[0]) return null;
  const values = new Set<string>();
  for (const sym of members) {
    const pt = checker.getNonNullableType(checker.getTypeOfSymbolAtLocation(sym!, at));
    for (const u of pt.isUnion() ? pt.types : [pt]) if (u.isStringLiteral()) values.add(u.value);
  }
  return [...values].sort();
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

    const narrow = t.scope === "narrow";
    for (const c of t.components) {
      const dir = DIR_OF[c];
      if (schemaPropsOf(c) && t.old in schemaPropsOf(c)!) add(`${dir}.schema.json ${c} properties`, "schema");
      if (docPropsOf(c)?.some((p) => p.name === t.old)) add(`componentDocs ${c}.props`, "componentDocs");
      if (indexEntries.find((e) => e.name === c)?.props?.includes(t.old)) add(`ai/component-index.json ${c}.props`, "ai-index");

      if (narrow) {
        const fixtures = SOURCES.find((s) => s.path === fixtureFileOf(c));
        if (fixtures)
          for (const line of propsKeyHits(fixtures.text, t.old)) add(`${fixtures.path}:${line} props.${t.old}`, "tests");
      }

      if (SHARED_DIRECTORY.has(dir) || narrow) {
        // The name in backticks — a table row or prose — anywhere in the
        // component's doc; bare, `mode` and `type` are also English. Shared
        // directories keep the old name on a sibling, so only All Props there.
        // A sibling export that keeps the name (AvatarBadge's `variant` beside
        // AvatarGroup's) narrows it to the lines that name this component.
        const keptBySibling = siblingsOf(c).some((s) => propNames(s).has(t.old));
        const named = (text: string, file: string) =>
          text
            .split("\n")
            .filter((l) => !keptBySibling || new RegExp(`(?<![\\w$])${c}(?![\\w$])`).test(l))
            .filter((l) => !excuseLine(t.old, file, l))
            .reduce((n, l) => n + [...l.matchAll(new RegExp(`\`${t.old}\``, "g"))].length, 0);
        const aimd = SOURCES.find((s) => s.group === "aimd" && s.path.startsWith(`${SRC}/${dir}/`));
        const docText = (text: string, heading: RegExp) => (narrow ? text : mdSection(text, heading));
        if (aimd && named(docText(aimd.text, /^## All Props/), aimd.path)) add(`${aimd.path} \`${t.old}\` ×${named(docText(aimd.text, /^## All Props/), aimd.path)}`, "aimd");
        const llms = docText(llmsSection(dir), /^### All Props/);
        if (named(llms, "llms-full.txt")) add(`llms-full.txt ${c} \`${t.old}\` ×${named(llms, "llms-full.txt")}`, "llms");
      } else {
        for (const line of wordHits(llmsSection(c), t.old)) add(`llms-full.txt ## ${c} +${line}`, "llms");
      }
    }

    if (narrow && t.components.includes("Toast"))
      for (const s of SOURCES)
        if (!GENERATED_FILES.has(s.path))
          for (const line of toastCallKeyHits(s.text, t.old)) add(`${s.path}:${line} toast(…{ ${t.old} })`, s.group);
    if (narrow && t.components.includes("Toast"))
      for (const g of GENERATED_STRINGS)
        if (toastCallKeyHits(g.text, t.old).length) add(`${g.path} toast(…{ ${t.old} })`, g.path.startsWith("componentDocs") ? "componentDocs" : "snippets");

    for (const s of SOURCES) {
      if (own(s.path) && !narrow) {
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

  for (const v of VALUE_TOMBSTONES) {
    const dir = DIR_OF[v.component];
    for (const old of v.old) {
      const label = `${v.prop}="${old}"`;
      const add = (where: string, group: Hit["group"]) => hits.push({ old: label, components: v.component, where, group });
      const quoted = new RegExp(`\\\\?["']${old}\\\\?["']`);
      const attr = new RegExp(`(?:^|\\s)${v.prop}\\s*=\\s*(?:"${old}"|'${old}'|\\{\\s*["']${old}["']\\s*\\})`);

      const schemaEntry = schemaPropsOf(v.component)?.[v.prop];
      if (schemaEntry && quoted.test(JSON.stringify(schemaEntry))) add(`${dir}.schema.json ${v.component}.${v.prop}`, "schema");
      const docEntry = docPropsOf(v.component)?.find((p) => p.name === v.prop);
      if (docEntry && quoted.test(docEntry.type)) add(`componentDocs ${v.component}.${v.prop}`, "componentDocs");

      const fixtures = SOURCES.find((s) => s.path === fixtureFileOf(v.component));
      if (fixtures)
        for (const line of propsKeyHits(fixtures.text, v.prop, old)) add(`${fixtures.path}:${line} props.${label}`, "tests");

      for (const s of SOURCES) {
        if (s.path.startsWith(`${SRC}/${dir}/`) || s.path === "llms-full.txt") {
          const text = s.path === "llms-full.txt" ? llmsSection(dir) : s.text;
          text.split("\n").forEach((l, i) => {
            if (wordRe(v.prop).test(l) && quoted.test(l)) add(`${s.path === "llms-full.txt" ? `llms-full.txt ## ${dir}` : s.path}:${i + 1}`, s.group);
          });
        }
        if (GENERATED_FILES.has(s.path) || s.path === "llms-full.txt") continue;
        for (const { raw, line } of jsxAttributes(s.text, v.component)) if (attr.test(raw)) add(`${s.path}:${line} <${v.component} ${label}>`, s.group);
      }
      for (const g of GENERATED_STRINGS)
        for (const { raw } of jsxAttributes(g.text, v.component))
          if (attr.test(raw)) add(`${g.path} <${v.component} ${label}>`, g.path.startsWith("componentDocs") ? "componentDocs" : "snippets");
    }
  }
  for (const v of ITEM_VALUE_TOMBSTONES) {
    const dir = DIR_OF[v.component];
    const subpath = `@chumlab/ui/${dir.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase()}`;
    for (const old of v.old) {
      const label = `${v.component} items[].${v.key}="${old}"`;
      const add = (where: string, group: Hit["group"]) => hits.push({ old: label, components: v.component, where, group });
      const re = new RegExp(`(?<![\\w$.])${v.key}\\s*:\\s*\\\\?["']${old}\\\\?["']`);
      for (const s of SOURCES) {
        if (GENERATED_FILES.has(s.path)) continue;
        const text = s.path === "llms-full.txt" ? llmsSection(dir) : s.text;
        const inScope =
          s.path.startsWith(`${SRC}/${dir}/`) || s.path === fixtureFileOf(v.component) || s.path === "llms-full.txt" ||
          new RegExp(`<${v.component}(?![\\w.])`).test(text);
        if (!inScope) continue;
        text.split("\n").forEach((l, i) => { if (re.test(l)) add(`${s.path}:${i + 1}`, s.group); });
      }
      for (const g of GENERATED_STRINGS)
        if ((g.text.includes(subpath) || g.path.startsWith(`componentDocs.${dir}.`)) && re.test(g.text))
          add(g.path, g.path.startsWith("componentDocs") ? "componentDocs" : "snippets");
    }
  }
  for (const t of SLOT_TOMBSTONES) {
    const label = `classes.${t.old}`;
    const add = (where: string, group: Hit["group"]) => hits.push({ old: label, components: t.components.join(", "), where, group });

    for (const c of t.components) if (classKeysOf(c)?.has(t.old)) add(`${c} classes type`, "types");
    for (const dir of new Set(t.components.map((c) => DIR_OF[c]))) {
      if (COMPONENT_DOCS[dir]?.classes.some((m) => m.keys.some((k) => k.name === t.old))) add(`componentDocs ${dir}.classes`, "componentDocs");
      const entry = indexEntries.find((e) => e.name === dir) as { anatomy?: unknown } | undefined;
      if (entry && new RegExp(`"${t.old}":`).test(JSON.stringify(entry.anatomy ?? {}))) add(`ai/component-index.json ${dir}.anatomy`, "ai-index");
    }

    if (t.scope === "word") {
      for (const s of SOURCES)
        for (const line of wordHits(s.text, t.old))
          if (!isExcused(t.old, s.path, s.text, line)) add(`${s.path}:${line}`, s.group);
      continue;
    }

    const dirs = [...new Set(t.components.map((c) => `${SRC}/${DIR_OF[c]}/`))];
    for (const s of SOURCES) {
      if (dirs.some((d) => s.path.startsWith(d))) {
        for (const line of wordHits(s.text, t.old))
          if (!isExcused(t.old, s.path, s.text, line)) add(`${s.path}:${line}`, s.group);
        continue;
      }
      if (GENERATED_FILES.has(s.path)) continue;
      if (s.path === "llms-full.txt") {
        for (const dir of new Set(t.components.map((c) => DIR_OF[c])))
          for (const line of wordHits(llmsSection(dir), t.old)) add(`llms-full.txt ## ${dir} +${line}`, "llms");
        continue;
      }
      for (const line of classesKeyHits(s.text, t.components, t.old)) add(`${s.path}:${line} classes`, s.group);
      // A fixture hands `classes` through its `props` object, not a tag.
      if (t.components.some((c) => s.path === fixtureFileOf(c)))
        for (const m of s.text.matchAll(/(?<![\w$.])classes\s*:\s*\{/g))
          for (const k of braced(s.text, m.index! + m[0].length - 1).matchAll(new RegExp(`(?<![\\w$.])["']?${t.old}["']?\\s*:`, "g")))
            add(`${s.path}:${s.text.slice(0, m.index! + m[0].length - 1 + k.index!).split("\n").length} fixture classes`, s.group);
      if (t.components.includes("Toast"))
        for (const line of toastCallKeyHits(s.text, t.old)) add(`${s.path}:${line} toast(…{ ${t.old} })`, s.group);
    }
    for (const g of GENERATED_STRINGS)
      if (classesKeyHits(g.text, t.components, t.old).length || (t.components.includes("Toast") && toastCallKeyHits(g.text, t.old).length))
        add(`${g.path} classes`, g.path.startsWith("componentDocs") ? "componentDocs" : "snippets");
  }
  return hits;
}

/** The keys of a component's `classes` prop, by the compiler; null when it has none. */
function classKeysOf(exportName: string): Set<string> | null {
  const { type, at } = propsTypeOf(exportName);
  const members = type.isUnion() ? type.types.map((t) => t.getProperty("classes")).filter(Boolean) : [type.getProperty("classes")];
  if (!members[0]) return null;
  const classes = checker.getNonNullableType(checker.getTypeOfSymbolAtLocation(members[0]!, at));
  return new Set(checker.getPropertiesOfType(classes).map((s) => s.getName()));
}

/** The balanced `{…}` starting at `open`, as text. */
function braced(text: string, open: number): string {
  let depth = 0;
  for (let i = open; i < text.length; i++) {
    if (text[i] === "{") depth++;
    else if (text[i] === "}" && --depth === 0) return text.slice(open, i + 1);
  }
  return text.slice(open);
}

/**
 * Lines where `key` is a key of a `classes` object handed to one of the
 * components' tags: written inline (`classes={{ key: … }}`), or a same-file
 * object the attribute names (`classes={sliderClasses}`,
 * `classes={{ ...base, … }}`, `classes={dark ? a : b}`), followed one level.
 */
function classesKeyHits(text: string, components: string[], key: string): number[] {
  const keyRe = new RegExp(`(?<![\\w$.])["']?${key}["']?\\s*:`, "g");
  const lines = new Set<number>();
  const scanObject = (open: number) => {
    for (const k of braced(text, open).matchAll(keyRe)) lines.add(text.slice(0, open + k.index!).split("\n").length);
  };
  for (const c of components)
    for (const m of text.matchAll(new RegExp(`<${c}(?![\\w.])`, "g"))) {
      const start = m.index! + m[0].length;
      const { raw, attrs } = jsxAttributes(text.slice(m.index!), c)[0];
      const attr = /(?:^|\s)classes\s*=\s*\{/.exec(raw);
      if (!attrs.includes("classes") || !attr) continue;
      const open = start + attr.index + attr[0].length - 1;
      scanObject(open);
      for (const id of new Set(braced(text, open).match(/[A-Za-z_$][\w$]*/g) ?? []))
        for (const decl of text.matchAll(new RegExp(`(?<![\\w$.])${id.replace(/\$/g, "\\$")}\\s*(?::[^=;{]+)?=\\s*\\{`, "g")))
          scanObject(decl.index! + decl[0].length - 1);
    }
  return [...lines];
}

const HITS = scan();

const GROUPS = ["types", "library", "demos", "snippets", "componentDocs", "tests", "aimd", "schema", "llms", "ai-index"] as const;
const count = (hits: Hit[]) => GROUPS.map((g) => `${g}=${hits.filter((h) => h.group === g).length}`).join(" ");
console.log(
  `API_NAMES tombstones=${TOMBSTONES.length} files=${SOURCES.length} generated-strings=${GENERATED_STRINGS.length} hits=${HITS.length}  ${count(HITS)}`,
);
for (const t of TOMBSTONES) {
  const mine = HITS.filter((h) => h.old === t.old && h.components === t.components.join(", "));
  console.log(`  ${t.old.padEnd(24)} → ${t.now.padEnd(24)} ${t.components.join(", ").padEnd(48)} ${t.scope.padEnd(9)} hits=${mine.length}`);
}
console.log(`API_VALUES props=${VALUE_TOMBSTONES.length} old-values=${VALUE_TOMBSTONES.reduce((n, v) => n + v.old.length, 0)}`);
for (const v of VALUE_TOMBSTONES)
  for (const old of v.old) {
    const mine = HITS.filter((h) => h.old === `${v.prop}="${old}"` && h.components === v.component);
    console.log(`  ${`${v.component}.${v.prop}="${old}"`.padEnd(44)} hits=${mine.length}`);
  }
console.log(`API_SLOTS tombstones=${SLOT_TOMBSTONES.length} owners=${SLOT_TOMBSTONES.reduce((n, t) => n + t.components.length, 0)}`);
for (const t of SLOT_TOMBSTONES) {
  const mine = HITS.filter((h) => h.old === `classes.${t.old}` && h.components === t.components.join(", "));
  console.log(`  ${t.old.padEnd(24)} → ${t.now.padEnd(24)} ${t.components.join(", ").padEnd(48)} ${t.scope.padEnd(9)} hits=${mine.length}`);
}

describe("API names: A2a's to A2e's old names and values are gone", () => {
  it("reads attributes on the named tag only, outside expressions", () => {
    const text = `<Checkbox checked onValueChange={set} /> <CheckboxGroup onValueChange={x} />
      <Switch onCheckedChange={() => ({ onValueChange: 1 })} label="a > b" />`;
    expect(jsxAttributes(text, "Checkbox").map(({ attrs, line }) => ({ attrs, line }))).toEqual([{ attrs: ["checked", "onValueChange"], line: 1 }]);
    expect(jsxAttributes(text, "Switch")[0].attrs).toEqual(["onCheckedChange", "label"]);
  });

  it("no tombstone hits", () => {
    expect(HITS.map((h) => `${h.old} (${h.components}): ${h.where}`)).toEqual([]);
  });

  it("every exception still excuses something", () => {
    expect([...excused].filter(([, n]) => n === 0).map(([e]) => `${e.file}: ${e.reason}`)).toEqual([]);
  });

  it("every new name is a prop of its components", () => {
    // Type names and data attributes are not props.
    const missing = TOMBSTONES.filter((t) => !/^[A-Z]|-/.test(t.old)).flatMap((t) =>
      t.components.filter((c) => !propNames(c).has(t.now)).map((c) => `${c}.${t.now}`),
    );
    expect(missing).toEqual([]);
  });

  it("every renamed slot is a key of its components' classes, and the old key is not", () => {
    const wrong = SLOT_TOMBSTONES.flatMap((t) =>
      t.components.flatMap((c) => {
        const keys = classKeysOf(c);
        return [
          ...(keys?.has(t.now) ? [] : [`${c}.classes.${t.now} missing`]),
          ...(keys?.has(t.old) ? [`${c}.classes.${t.old} still there`] : []),
        ];
      }),
    );
    console.log(`API_SLOT_KEYS checked=${SLOT_TOMBSTONES.reduce((n, t) => n + t.components.length, 0)} wrong=${wrong.length}`);
    expect(wrong).toEqual([]);
  });

  it("reads a slot key off the classes object a tag is handed, and no other", () => {
    const text = `const dark = { indicator: "a" };
      const tabs = { indicator: "b" };
      <Toast classes={{ ...dark, title: "c" }} /> <TabPanel classes={tabs} />
      <Toast classes={{ indicator: "d" }} />`;
    expect(classesKeyHits(text, ["Toast"], "indicator").sort()).toEqual([1, 4]);
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

  it("every renamed prop's union is exactly its new values", () => {
    const rows = VALUE_TOMBSTONES.map((v) => ({ v, got: literalsOf(v.component, v.prop) }));
    const wrong = rows.filter(({ v, got }) => JSON.stringify(got) !== JSON.stringify([...v.now].sort()));
    console.log(`API_UNIONS checked=${rows.length} wrong=${wrong.length}`);
    for (const { v, got } of rows) console.log(`  ${`${v.component}.${v.prop}`.padEnd(32)} ${got ? got.join(" | ") : "(no such prop)"}`);
    expect(wrong.map(({ v, got }) => `${v.component}.${v.prop}: ${got ? got.join("|") : "missing"}, want ${v.now.join("|")}`)).toEqual([]);
  });

  it("the booleans that lost their prefix are booleans", () => {
    const BOOLEANS: [string, string][] = [
      ["Table", "floatingActionsHovered"], ["Table", "filterable"], ["Table", "resizable"], ["Table", "reorderable"],
      ["Table", "copyOnClick"], ["Table", "infiniteScroll"], ["InternationalPhoneInput", "pasteDetection"], ["Tooltip", "hoverableContent"],
    ];
    const wrong = BOOLEANS.filter(([c, p]) => {
      const { type, at } = propsTypeOf(c);
      const sym = type.getProperty(p);
      return !sym || checker.typeToString(checker.getNonNullableType(checker.getTypeOfSymbolAtLocation(sym, at))) !== "boolean";
    });
    expect(wrong.map(([c, p]) => `${c}.${p}`)).toEqual([]);
  });

  /** An exported type's member, by the compiler: `Step.icon`, `BreadcrumbItem.iconPosition`. */
  const memberType = (dir: string, typeName: string, member: string): ts.Type | null => {
    const sf = program.getSourceFile(`${SRC}/${dir}/index.ts`)!;
    const exp = checker.getExportsOfModule(checker.getSymbolAtLocation(sf)!).find((s) => s.name === typeName);
    if (!exp) return null;
    const sym = exp.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(exp) : exp;
    const prop = checker.getDeclaredTypeOfSymbol(sym).getProperty(member);
    return prop ? checker.getNonNullableType(checker.getTypeOfSymbolAtLocation(prop, sf)) : null;
  };
  const propType = (c: string, p: string): ts.Type | null => {
    const { type, at } = propsTypeOf(c);
    const members = type.isUnion() ? type.types.map((x) => x.getProperty(p)).filter(Boolean) : [type.getProperty(p)];
    return members[0] ? checker.getNonNullableType(checker.getTypeOfSymbolAtLocation(members[0], at)) : null;
  };
  const show = (x: ts.Type | null) => (x ? checker.typeToString(x, undefined, ts.TypeFormatFlags.NoTruncation) : "(missing)");
  /** ReactNode, as the checker prints it — read off a prop known to be one. */
  const REACT_NODE = show(propType("Button", "startIcon"));
  /** A member that can be rendered as a component: a ComponentType in any form. */
  const isComponentLike = (x: ts.Type): boolean =>
    (x.isUnion() ? x.types : [x]).some((m) => m.getConstructSignatures().length > 0 || m.getCallSignatures().length > 0);

  /** Each icon prop A2c touched, and its shape: rendered as given, or a render function of its state. */
  const ICON_SHAPES: [component: string, prop: string, shape: "node" | string[]][] = [
    ...DROPDOWNS.map((c): [string, string, "node"] => [c, "clearIcon", "node"]),
    ["CascadingDropdown", "searchIcon", "node"], ["SearchableDropdown", "searchIcon", "node"], ["Table", "searchIcon", "node"],
    ["Dropdown", "chevronIcon", "node"], ["MultiSelectDropdown", "chevronIcon", "node"], ["SearchableDropdown", "chevronIcon", "node"],
    ["Dropdown", "selectedIcon", "node"], ["SearchableDropdown", "selectedIcon", "node"],
    ["Table", "pinIcon", "node"], ["Table", "pinnedIcon", "node"], ["Table", "dragHandleIcon", "node"],
    ["Table", "renderFilterIcon", ["active", "className"]],
    ["Table", "renderExpandIcon", ["expanded", "className"]],
    ["Table", "renderCheckboxIcon", ["checked", "indeterminate", "className"]],
    ["Breadcrumb", "separator", "node"], ["Breadcrumb", "ellipsisIcon", "node"],
    ["Pagination", "prevIcon", "node"], ["Pagination", "nextIcon", "node"], ["Pagination", "dropdownIcon", "node"],
    ["Stepper", "completedIcon", "node"], ["Stepper", "errorIcon", "node"],
  ];

  it("each icon prop is a ReactNode, or a render function of the state it shows", () => {
    const wrong = ICON_SHAPES.flatMap(([c, p, shape]) => {
      const x = propType(c, p);
      if (!x) return [`${c}.${p}: missing`];
      if (shape === "node") return show(x) === REACT_NODE ? [] : [`${c}.${p}: ${show(x)}, want ReactNode`];
      const sig = x.getCallSignatures()[0];
      const arg = sig?.getParameters()[0];
      const argType = arg && checker.getTypeOfSymbolAtLocation(arg, propsTypeOf(c).at);
      const missing = shape.filter((k) => !argType?.getProperty(k));
      return sig && !missing.length ? [] : [`${c}.${p}: ${show(x)}, want (state: { ${shape.join(", ")} }) => ReactNode`];
    });
    const stepItems = ["icon", "completedIcon", "errorIcon"]
      .map((m) => [m, show(memberType("Stepper", "Step", m))] as const)
      .filter(([, s]) => s !== REACT_NODE)
      .map(([m, s]) => `Step.${m}: ${s}, want ReactNode`);
    console.log(`API_ICONS checked=${ICON_SHAPES.length + 3} wrong=${wrong.length + stepItems.length} (ReactNode is ${REACT_NODE.slice(0, 40)}…)`);
    expect([...wrong, ...stepItems]).toEqual([]);
  });

  it("no icon prop on any export still takes a component", () => {
    const offenders: string[] = [];
    for (const dir of [...new Set(Object.values(DIR_OF))]) {
      const sf = program.getSourceFile(`${SRC}/${dir}/index.ts`);
      if (!sf) continue;
      for (const exp of checker.getExportsOfModule(checker.getSymbolAtLocation(sf)!)) {
        if (!/^[A-Z]/.test(exp.name)) continue;
        DIR_OF[exp.name] ??= dir;
        let props: Set<string>;
        try {
          props = propNames(exp.name);
        } catch {
          continue;
        }
        for (const p of props) {
          // Callbacks named for an icon (`onStartIconClick`) are events, not icons.
          if (!/Icon/.test(p) || /^(render|on[A-Z])/.test(p)) continue;
          const x = propType(exp.name, p);
          if (x && isComponentLike(x)) offenders.push(`${exp.name}.${p}: ${show(x)}`);
        }
      }
    }
    console.log(`API_NO_COMPONENT_ICONS offenders=${offenders.length}`);
    expect(offenders).toEqual([]);
  });

  it("Breadcrumb items take start or end", () => {
    const x = memberType("Breadcrumb", "BreadcrumbItem", "iconPosition");
    const values = x ? (x.isUnion() ? x.types : [x]).filter((u) => u.isStringLiteral()).map((u) => (u as ts.StringLiteralType).value).sort() : [];
    expect(values).toEqual(["end", "start"]);
  });

  it("the unified concept props have the types they promise", () => {
    const EXPECT: [string, string, string][] = [
      ...["MultiSelectDropdown", "MultiSelectSearchableDropdown", "Breadcrumb", "AvatarGroup", "CountryFlagGroup"].map((c): [string, string, string] => [c, "maxVisible", "number"]),
      ...["SearchableDropdown", "MultiSelectSearchableDropdown", "CascadingDropdown"].map((c): [string, string, string] => [c, "searchDebounce", "number"]),
      ...["Drawer", "Slider", "Switch", "CircularLoader", "LinearLoader", "DotLoader", "PulseLoader"].map((c): [string, string, string] => [c, "animationDuration", "number"]),
      ["AccordionContent", "keepMounted", 'boolean | "visited"'],
      ["TabPanel", "keepMounted", 'boolean | "visited"'],
      ["Modal", "closeOnOverlayClick", "boolean"],
    ];
    const wrong = EXPECT.filter(([c, p, want]) => show(propType(c, p)) !== want).map(([c, p, want]) => `${c}.${p}: ${show(propType(c, p))}, want ${want}`);
    console.log(`API_CONCEPT_TYPES checked=${EXPECT.length} wrong=${wrong.length}`);
    expect(wrong).toEqual([]);
  });

  it("callbacks receive what their names promise", () => {
    const rows = SIGNATURES.map(([c, p, re]) => ({ c, p, first: firstParam(c, p), ok: re.test(firstParam(c, p)) }));
    console.log(`API_SIGNATURES checked=${rows.length} wrong=${rows.filter((r) => !r.ok).length}`);
    for (const r of rows) console.log(`  ${r.ok ? "ok   " : "WRONG"} ${`${r.c}.${r.p}`.padEnd(44)} (${r.first})`);
    expect(rows.filter((r) => !r.ok).map((r) => `${r.c}.${r.p}(${r.first})`)).toEqual([]);
  });
});

/**
 * The docs a consumer reads name no old API.
 *
 * The scan above reads prose in llms-full.txt and llms.txt, but attributes a
 * `component` or `narrow` name only through a JSX attribute or the component's
 * own section, so a sentence such as "Checkbox and Switch report through
 * onValueChange" passed; and README, ACCESSIBILITY, VERSIONING, the llms
 * preamble and the site's public/llms.txt were outside it.
 *
 * Population: what `npm pack` ships (README, ACCESSIBILITY, VERSIONING,
 * CHANGELOG, llms.txt, llms-full.txt), the sources they are built from (every
 * `.ai.md`, ai/llms-full-preamble.md), the site's public/llms.txt, its FAQ
 * (faqData.ts) and the seven guide pages guide-claims reads. CHANGELOG names old
 * APIs on purpose in its rename tables and Removed sections, so those lines
 * are skipped and the rest is read.
 *
 * A `word` name is a hit anywhere. A `component` or `narrow` name is a hit
 * where it reads as code (in backticks, as an attribute or a key with a value,
 * or as shorthand opening an object) and that sentence or the one before it,
 * the heading it sits under, or the `.ai.md` it is in names one of its
 * components: "the value callback is always `onValueChange`. A `checked` prop
 * (Checkbox, Switch) pairs with `onCheckedChange`" names Checkbox only after. A slot reads the same way, and an old value is a hit as
 * `prop="old"` or `prop: "old"` where one of its components is named.
 */
const ROOT_DIR = ".";
const GUIDE_PAGES = ["Accessibility", "AiLlm", "Animation", "GettingStarted", "Introduction", "Styling", "Theming"].map(
  (g) => `src/pages/demo/${g}Demo.tsx`,
);
const AI_MD = (() => {
  const out: string[] = [];
  const walk = (dir: string) => {
    for (const f of readdirSync(join(ROOT_DIR, dir))) {
      const p = `${dir}/${f}`;
      if (statSync(join(ROOT_DIR, p)).isDirectory()) walk(p);
      else if (f.endsWith(".ai.md")) out.push(p);
    }
  };
  walk("src/components");
  return out.sort();
})();
const SHIPPED_DOCS = [
  "README.md", "ACCESSIBILITY.md", "VERSIONING.md", "CHANGELOG.md", "llms.txt", "llms-full.txt",
  "ai/llms-full-preamble.md", "public/llms.txt", "src/pages/faqData.ts", ...GUIDE_PAGES, ...AI_MD,
];
/** Step 0 of DT1: the docs above when the scan was added. */
const DOC_FLOOR = 47;

/** Doc lines that use a tombstoned name for something it still is, each with its reason. */
const DOC_EXCEPTIONS: { old: string; file: string; line: RegExp; reason: string }[] = [
  ...["src/components/Accordion/ACCORDION.ai.md", "llms-full.txt"].map((file) => ({
    old: "onExpandedChange",
    file,
    line: /^\| `onExpandedChange` \| `\(\(isExpanded: boolean\) => void\)/,
    reason: "AccordionItem's own onExpandedChange, in its props table; Accordion's became onValueChange",
  })),
];
const docExcused = new Map(DOC_EXCEPTIONS.map((e) => [e, 0]));

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
/** The name as code: in backticks, or as an attribute or a key with a value, or shorthand in an object. */
const asCode = (old: string) =>
  new RegExp(
    `\`${esc(old)}\`|(?<![\\w-])${esc(old)}\\s*=\\s*["'{]|(?<![\\w-])${esc(old)}\\??\\s*:\\s*["'\`{[(]|\\{\\s*${esc(old)}\\s*[,}]`,
  );
const named = (text: string, components: string[]) => components.some((c) => new RegExp(`(?<![\\w-])${esc(c)}(?![\\w])`).test(text));

/** Lines of CHANGELOG.md that record old names on purpose: rename tables and Removed sections. */
function changelogRecordLines(lines: string[]): Set<number> {
  const skip = new Set<number>();
  let section = "";
  let apiNames = false;
  lines.forEach((line, i) => {
    if (/^#{2,3} /.test(line)) { section = line; apiNames = false; }
    if (/^#### API names/.test(line)) apiNames = true;
    if (/^### Removed/.test(section) || (apiNames && /^\s*\|/.test(line))) skip.add(i);
  });
  return skip;
}

function docHits(file: string, text: string): string[] {
  const lines = text.split("\n");
  const skip = file === "CHANGELOG.md" ? changelogRecordLines(lines) : new Set<number>();
  const owner = file.endsWith(".ai.md") ? file.split("/")[2] : null;
  const headings: string[] = [];
  const hits: string[] = [];
  lines.forEach((line, i) => {
    const h = /^(#{1,6})\s+(.*)/.exec(line);
    if (h) headings.splice(h[1].length - 1, headings.length, h[2]);
    if (skip.has(i)) return;
    const sentences = line.split(/(?<=[.!?])\s+(?=[A-Z`*])/);
    const outer = [...headings, owner ?? ""].join(" ");
    const about = (pattern: RegExp, components: string[]) =>
      sentences.some((s, k) => pattern.test(s) && named(`${sentences[k - 1] ?? ""} ${s} ${outer}`, components));
    const at = `${file}:${i + 1}`;
    const excused = (old: string) => {
      const e = DOC_EXCEPTIONS.find((x) => x.old === old && x.file === file && x.line.test(line));
      if (e) docExcused.set(e, docExcused.get(e)! + 1);
      return !!e || EXCEPTIONS.some((x) => x.old === old && x.file === file && x.line.test(line));
    };
    for (const t of TOMBSTONES) {
      if (excused(t.old)) continue;
      const hit = t.scope === "word" ? new RegExp(`(?<![\\w-])${esc(t.old)}(?![\\w-])`).test(line) : about(asCode(t.old), t.components);
      if (hit) hits.push(`${at} ${t.old} (${t.components.join(", ")}) → ${t.now}`);
    }
    for (const t of SLOT_TOMBSTONES) {
      const hit = t.scope === "word" ? new RegExp(`(?<![\\w-])${esc(t.old)}(?![\\w-])`).test(line) : about(asCode(t.old), t.components);
      if (hit) hits.push(`${at} classes.${t.old} (${t.components.join(", ")}) → ${t.now}`);
    }
    for (const v of [...VALUE_TOMBSTONES, ...ITEM_VALUE_TOMBSTONES.map((x) => ({ component: x.component, prop: x.key, old: x.old }))])
      for (const old of v.old) {
        const lit = new RegExp(`(?<![\\w-])${esc(v.prop)}\\s*(?:=\\{?\\s*|:\\s*)["'\`]${esc(old)}["'\`]`);
        if (about(lit, [v.component])) hits.push(`${at} ${v.component}.${v.prop}="${old}"`);
      }
  });
  return hits;
}

describe("shipped docs: no doc a consumer reads names an old API", () => {
  it("catches a planted old name in each scope", () => {
    const planted = [
      "Checkbox reports through `onValueChange`.",
      "Use `enableColumnFilters` on the table.",
      '<AccordionTrigger iconPosition="left">',
      "Style the thumb with `classes.labelGroup`.",
      "## Drawer\n\nSet `direction` to choose the edge.",
    ];
    expect(planted.map((p) => docHits("README.md", p).length)).toEqual([1, 1, 1, 1, 1]);
    expect(docHits("README.md", "Accordion reports through `onValueChange`.")).toEqual([]);
    expect(docHits("README.md", "The value callback is `onValueChange`. Checkbox pairs `checked` with `onCheckedChange`.")).toEqual([]);
    expect(docHits("README.md", "DatePicker: Selection mode: single date or a range.")).toEqual([]);
    expect(docHits("README.md", "Compose `Accordion` > `AccordionItem`. Set `type=\"single\"` for one.")).toHaveLength(1);
  });

  it("the site serves the llms.txt the package ships", () => {
    expect(readFileSync(join(ROOT_DIR, "public/llms.txt"), "utf8"), "public/llms.txt drifted from llms.txt").toBe(
      readFileSync(join(ROOT_DIR, "llms.txt"), "utf8"),
    );
  });

  it(`reads at least the ${DOC_FLOOR} docs step 0 listed, and none names an old API`, () => {
    const missing = SHIPPED_DOCS.filter((f) => !existsSync(join(ROOT_DIR, f)));
    const hits = SHIPPED_DOCS.filter((f) => !missing.includes(f)).flatMap((f) => docHits(f, readFileSync(join(ROOT_DIR, f), "utf8")));
    console.log(`DOC_TOMBSTONES docs ${SHIPPED_DOCS.length - missing.length} (floor ${DOC_FLOOR}), hits ${hits.length}`);
    for (const h of hits) console.log(`  DOC_TOMBSTONE ${h}`);
    expect(missing).toEqual([]);
    expect(SHIPPED_DOCS.length).toBeGreaterThanOrEqual(DOC_FLOOR);
    expect(hits).toEqual([]);
    expect([...docExcused].filter(([, n]) => n === 0).map(([e]) => `${e.file}: ${e.reason}`), "a doc exception that excuses nothing").toEqual([]);
  });
});
