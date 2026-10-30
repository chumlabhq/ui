/**
 * No physical left/right in a class string or an inline style unless it is
 * listed here with its reason.
 *
 * The RTL audit (A2, cause C6) found `text-left` in ten constants files, `right-8`
 * clear buttons, Modal's `ml-auto`, Accordion's `mr-2`/`ml-2`, TextArea's `pr`,
 * Table's search padding and divider, counters' `text-right` and Stepper's
 * connector `marginLeft`: each one correct in a left-to-right page and on the
 * wrong side in a right-to-left one. The logical form (`text-start`, `ms-`,
 * `pe-`, `start-`/`end-`, `marginInlineStart`) is the same pixels in LTR and the
 * mirror in RTL, so anything still physical is either physical on purpose or
 * owned by a later A2 slice, and says which.
 *
 * Read on the AST: every string and template piece is split into tokens and
 * each token's base utility (variants and `!` stripped) is matched; every
 * object-literal key and `.style.` property is matched as an inline style; and
 * a string literal that IS a physical property name (`"paddingRight"`) counts
 * too, because a computed `style[side]` is still a physical write. `space-x` is
 * not listed: Tailwind 4 compiles it to `margin-inline-*`.
 */
import { describe, expect, it } from "vitest";
import ts from "typescript";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

/** The site's own files, which the library does not ship — the scope `constants.contract` uses. */
const NOT_SHIPPED =
  /(CatalogSection|ChumlabComparison|GetStarted|SiteHeader|SiteFooter|BuyMeCoffee|WhyChumlab|Typographic|UserMenu|Announcement|FaqLogo|Reveal|\/ui\/|BrandLogo|__tests__)/;

/** Files the walk read when this was written; fewer means it stopped reading something. */
const FLOOR = 492;

const PHYSICAL_TOKEN = [
  /^text-(left|right)$/,
  /^-?m[lr]-/,
  /^-?p[lr]-/,
  /^-?(left|right)-(\d|px|full|auto|\[|\(|1\/2)/,
  /^rounded-(l|r|tl|tr|bl|br)(-|$)/,
  /^border-(l|r)(-|$)/,
  /^-?translate-x-/,
  /^(float|clear)-(left|right)$/,
  /^origin-(left|right|top-left|top-right|bottom-left|bottom-right)$/,
  /^-?scroll-[mp][lr]-/,
];

const PHYSICAL_STYLE =
  /^(marginLeft|marginRight|paddingLeft|paddingRight|left|right|borderLeft\w*|borderRight\w*|border(Top|Bottom)(Left|Right)Radius|(margin|padding|border)-(left|right)[\w-]*)$/;

/** A string that names a physical property, as a computed `style[side]` write does. */
const PHYSICAL_STYLE_NAME =
  /^(marginLeft|marginRight|paddingLeft|paddingRight|borderLeft\w*|borderRight\w*|border(Top|Bottom)(Left|Right)Radius|(margin|padding|border)-(left|right)[\w-]*)$/;

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) return entry === "__tests__" ? [] : walk(path);
    return /\.tsx?$/.test(entry) && !/\.(test|spec|stories)\.tsx?$|\.d\.ts$/.test(entry) ? [path] : [];
  });

const baseUtility = (token: string) => token.slice(token.lastIndexOf(":") + 1).replace(/^!/, "");

export function physicalUses(file: string, source: string): Array<{ file: string; line: number; match: string }> {
  const sf = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, file.endsWith("x") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const found: Array<{ file: string; line: number; match: string }> = [];
  const add = (node: ts.Node, match: string) =>
    found.push({ file, line: sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1, match });
  const visit = (node: ts.Node): void => {
    const text =
      ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node) || ts.isTemplateHead(node) || ts.isTemplateMiddle(node) || ts.isTemplateTail(node)
        ? node.text
        : null;
    if (text !== null) {
      for (const token of text.split(/\s+/).filter(Boolean)) {
        if (PHYSICAL_TOKEN.some((re) => re.test(baseUtility(token)))) add(node, token);
      }
      if (ts.isStringLiteral(node) && PHYSICAL_STYLE_NAME.test(node.text) && !(ts.isPropertyAssignment(node.parent) && node.parent.name === node)) {
        add(node, `"${node.text}"`);
      }
    }
    if ((ts.isPropertyAssignment(node) || ts.isShorthandPropertyAssignment(node)) && (ts.isIdentifier(node.name) || ts.isStringLiteral(node.name)) && PHYSICAL_STYLE.test(node.name.text)) {
      add(node, `style.${node.name.text}`);
    }
    if (ts.isPropertyAccessExpression(node) && PHYSICAL_STYLE.test(node.name.text) && /\.style$/.test(node.expression.getText(sf))) {
      add(node, `style.${node.name.text}`);
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return found;
}

interface Allowed {
  file: string;
  match: string;
  count: number;
  slice: "A2d2" | "by design";
  reason: string;
}

const ALLOWLIST: Allowed[] = [
  { file: "components/Avatar/utils/helpers.ts", match: "style.left", count: 4, slice: "A2d2", reason: "Badge corners follow the `position` prop, whose values name physical corners (top-right, bottom-left). Mirroring them is decision D1, physical-by-name props." },
  { file: "components/Avatar/utils/helpers.ts", match: "style.right", count: 4, slice: "A2d2", reason: "Badge corners follow the `position` prop, whose values name physical corners (top-right, bottom-left). Mirroring them is decision D1, physical-by-name props." },
  { file: "components/Button/utils/constants.ts", match: "group-hover:-translate-x-1", count: 1, slice: "A2d2", reason: "The slideLeft hover animation, named for its physical direction. Decision D1, physical-by-name props." },
  { file: "components/Button/utils/constants.ts", match: "group-hover:translate-x-1", count: 1, slice: "A2d2", reason: "The slideRight hover animation, named for its physical direction. Decision D1, physical-by-name props." },
  { file: "components/DatePicker/constants.ts", match: "-translate-x-1/2", count: 1, slice: "by design", reason: "Centred with left-1/2 and -translate-x-1/2: the same point in either direction, so the physical pair is correct in both. (the marked-day dot under a day number)" },
  { file: "components/DatePicker/constants.ts", match: "left-1/2", count: 1, slice: "by design", reason: "Centred with left-1/2 and -translate-x-1/2: the same point in either direction, so the physical pair is correct in both. (the marked-day dot under a day number)" },
  { file: "components/DatePicker/DatePicker.tsx", match: "style.left", count: 1, slice: "by design", reason: "The marker tooltip's centre point: the day cell's centre, kept 10 px from each viewport edge by a symmetric clamp, and drawn by MarkerTooltip with translateX(-50%). Centred on its anchor, so the same point in either direction (the RTL audit measured it correct); the pair is physical on purpose, like the marked-day dot above." },
  { file: "components/DatePicker/MarkerTooltip.tsx", match: "style.left", count: 1, slice: "by design", reason: "Pairs with translateX(-50%) to centre the tooltip on the day cell: the same point in either direction, so the physical pair is correct in both (the RTL audit measured it correct)." },
  { file: "components/Drawer/utils/helpers.ts", match: "style.left", count: 3, slice: "A2d2", reason: "The panel's edge comes from the `side` prop, whose values name physical edges. Decision D1, physical-by-name props." },
  { file: "components/Drawer/utils/helpers.ts", match: "style.right", count: 1, slice: "A2d2", reason: "The panel's edge comes from the `side` prop, whose values name physical edges. Decision D1, physical-by-name props." },
  { file: "components/ResizablePanel/ResizablePanel.tsx", match: "-left-1", count: 1, slice: "A2d2", reason: "The handle's edge follows `resizeDirection`, physical by name. Decision D2 (start/end values) and position math, cause C5." },
  { file: "components/ResizablePanel/ResizablePanel.tsx", match: "-right-1", count: 1, slice: "A2d2", reason: "The handle's edge follows `resizeDirection`, physical by name. Decision D2 (start/end values) and position math, cause C5." },
  { file: "components/ResizablePanel/ResizablePanel.tsx", match: "left-0", count: 1, slice: "A2d2", reason: "The handle's edge follows `resizeDirection`, physical by name. Decision D2 (start/end values) and position math, cause C5." },
  { file: "components/Slider/Slider.tsx", match: "style.left", count: 3, slice: "by design", reason: "Centred with left 50% and translate(-50%): the value tooltip over a horizontal thumb, and a vertical slider's thumb and mark dots across its track. The same point in either direction; everything placed along the inline axis is logical (A2d)." },
  { file: "components/Switch/utils/constants.ts", match: "data-[state=checked]:translate-x-[1.125rem]", count: 1, slice: "by design", reason: "The checked thumb's travel toward the inline end. A translate has no logical form, so it is a pair: this one in LTR, the rtl: one below in RTL (A2d)." },
  { file: "components/Switch/utils/constants.ts", match: "rtl:data-[state=checked]:-translate-x-[1.125rem]", count: 1, slice: "by design", reason: "The RTL half of the pair above: the thumb starts at the inline start, the right, and travels left, where the A2 audit measured it painted 18px past the track (A2d)." },
  { file: "components/Table/utils.ts", match: "style.left", count: 1, slice: "by design", reason: "The copy fallback's offscreen textarea: position fixed at -9999px and removed in the same task. A fixed box adds no scroll range in either direction." },
  { file: "components/TimePicker/ClockFace.tsx", match: "style.left", count: 2, slice: "by design", reason: "Numbers and hand on the clock dial, placed by angle. A clock reads clockwise in every script, so the dial does not mirror." },
  { file: "components/Toast/utils/constants.ts", match: "-translate-x-1/2", count: 2, slice: "A2d2", reason: "The top-center and bottom-center `position` values, centred. They sit beside the physical corner positions (D1, physical-by-name props) and move with them." },
  { file: "components/Toast/utils/constants.ts", match: "left-1/2", count: 2, slice: "A2d2", reason: "The top-center and bottom-center `position` values, centred. They sit beside the physical corner positions (D1, physical-by-name props) and move with them." },
  { file: "components/Toast/utils/constants.ts", match: "left-4", count: 2, slice: "A2d2", reason: "The top-left and bottom-left `position` values, named for physical corners. Decision D1, physical-by-name props." },
  { file: "components/Toast/utils/constants.ts", match: "right-4", count: 2, slice: "A2d2", reason: "The top-right and bottom-right `position` values, named for physical corners. Decision D1, physical-by-name props." },
  { file: "utils/menu/measuringStyle.ts", match: "style.left", count: 1, slice: "by design", reason: "The offscreen measuring copy of a menu, at left 0 with visibility hidden; only its size is read, so the side is irrelevant." },
  { file: "utils/scrollLock.ts", match: "\"paddingLeft\"", count: 3, slice: "by design", reason: "The scroll lock pads the side the scrollbar gutter is measured on (a fixed probe at left 0 sits past a left-hand gutter): physical by measurement, correct in either direction." },
  { file: "utils/scrollLock.ts", match: "\"paddingRight\"", count: 5, slice: "by design", reason: "The scroll lock pads the side the scrollbar gutter is measured on (a fixed probe at left 0 sits past a left-hand gutter): physical by measurement, correct in either direction." },
];

describe("physical-direction contract", () => {
  const files = [...walk("src/components"), ...walk("src/utils")]
    .map((path) => ({ path, rel: relative("src", path) }))
    .filter(({ rel }) => !NOT_SHIPPED.test(rel));
  const found = files.flatMap(({ path, rel }) => physicalUses(rel, readFileSync(path, "utf8")));
  const counts = new Map<string, number>();
  for (const f of found) counts.set(`${f.file} ${f.match}`, (counts.get(`${f.file} ${f.match}`) ?? 0) + 1);
  const allowed = new Map(ALLOWLIST.map((a) => [`${a.file} ${a.match}`, a]));

  it("uses no physical direction outside the allowlist", () => {
    const open = found.filter((f) => !allowed.has(`${f.file} ${f.match}`) || counts.get(`${f.file} ${f.match}`)! > allowed.get(`${f.file} ${f.match}`)!.count);
    const listed = ALLOWLIST.reduce((n, a) => n + a.count, 0);
    console.log(`PHYSICAL_DIRECTION files ${files.length} (floor ${FLOOR}), found ${found.length}, allowlisted ${listed}, open ${open.length}`);
    for (const f of open) console.log(`  PHYSICAL ${f.file}:${f.line} ${f.match}`);
    expect(files.length, "the walk read fewer files than when this was written").toBeGreaterThanOrEqual(FLOOR);
    expect(open.map((f) => `${f.file}:${f.line} ${f.match}`)).toEqual([]);
  });

  it("lists nothing the source no longer has, and every entry says why and whose", () => {
    const stale = ALLOWLIST.filter((a) => (counts.get(`${a.file} ${a.match}`) ?? 0) !== a.count).map(
      (a) => `${a.file} ${a.match}: listed ${a.count}, found ${counts.get(`${a.file} ${a.match}`) ?? 0}`,
    );
    expect(stale).toEqual([]);
    expect(ALLOWLIST.filter((a) => a.reason.length < 20)).toEqual([]);
  });

  it("finds a planted text-left, and leaves the logical form alone", () => {
    expect(physicalUses("planted.ts", 'export const C = { trigger: "flex text-left" };').map((f) => f.match)).toEqual(["text-left"]);
    expect(physicalUses("planted.ts", 'export const C = { trigger: "flex text-start ms-2 pe-3 start-0 -space-x-2" };')).toEqual([]);
  });
});
