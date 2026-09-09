/**
 * No raw colour in a style object or an SVG paint attribute.
 *
 * Every colour gate on this branch reads classes: `constants.contract` counts
 * literal class strings, the raw-palette sweep greps for `bg-gray-200`, the
 * `dark:` retirement counts variants, and `contrast-painted.spec.ts` measures
 * what a fixture renders. A colour written as `style={{ backgroundColor:
 * "white" }}` or `stroke="white"` is invisible to all of them by construction.
 *
 * Three of the five theme assumptions found by hand were exactly that shape,
 * and one of them was a core form control: `RadioButton`'s checked dot was
 * `backgroundColor: "white"` inside a transparent ring, so a selected radio
 * painted nothing at all on a light background. It passed every gate in the
 * package.
 *
 * The rule is the same one ADR 001 states for classes: a colour is a token
 * decision, so the value at the call site has to be `var(--cl-*)` or a prop the
 * consumer supplies — never a literal.
 */
import { describe, expect, it } from "vitest";
import ts from "typescript";
import { mkdtempSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

/** Marketing and docs-only files; not part of the published package. */
const NOT_SHIPPED =
  /(CatalogSection|ChumlabComparison|GetStarted|SiteHeader|SiteFooter|BuyMeCoffee|WhyChumlab|Typographic|UserMenu|Announcement|FaqLogo|Reveal|BrandLogo|AIPlayground|\/ui\/|__tests__)/;

/**
 * Country flags are colour data, not styling: the fills ARE the flag. They are
 * generated SVG strings under `flags/`, and holding them to a token would be
 * asking Chad's flag to follow the theme.
 */
const NOT_A_DECISION = /\/flags\//;

/** CSS properties whose value is a colour. */
const COLOUR_PROPERTIES = new Set([
  "color",
  "background",
  "backgroundColor",
  "borderColor",
  "borderTopColor",
  "borderRightColor",
  "borderBottomColor",
  "borderLeftColor",
  "border",
  "borderTop",
  "borderRight",
  "borderBottom",
  "borderLeft",
  "outline",
  "outlineColor",
  "boxShadow",
  "textShadow",
  "textDecorationColor",
  "caretColor",
  "accentColor",
  "columnRuleColor",
  "fill",
  "stroke",
  "stopColor",
  "floodColor",
  "lightingColor",
]);

/** SVG presentation attributes that take a paint value. */
const PAINT_ATTRIBUTES = new Set([
  "fill",
  "stroke",
  "color",
  "stopColor",
  "floodColor",
  "lightingColor",
]);

/**
 * Values that name no colour of their own. `currentColor` inherits one,
 * `var(...)` names a token, and the keywords paint nothing.
 */
const NOT_A_COLOUR = /^(none|transparent|currentColor|inherit|initial|unset|revert|auto)$/i;

/**
 * A literal colour: hex, a functional notation, or one of CSS's named colours.
 *
 * The named list is the full CSS set rather than the handful the package uses —
 * `white` and `black` were the two that shipped, and a gate that only knows the
 * two it has seen is the shape this file exists to replace.
 */
const NAMED = new Set([
  "aliceblue", "antiquewhite", "aqua", "aquamarine", "azure", "beige", "bisque", "black",
  "blanchedalmond", "blue", "blueviolet", "brown", "burlywood", "cadetblue", "chartreuse",
  "chocolate", "coral", "cornflowerblue", "cornsilk", "crimson", "cyan", "darkblue",
  "darkcyan", "darkgoldenrod", "darkgray", "darkgreen", "darkgrey", "darkkhaki",
  "darkmagenta", "darkolivegreen", "darkorange", "darkorchid", "darkred", "darksalmon",
  "darkseagreen", "darkslateblue", "darkslategray", "darkslategrey", "darkturquoise",
  "darkviolet", "deeppink", "deepskyblue", "dimgray", "dimgrey", "dodgerblue", "firebrick",
  "floralwhite", "forestgreen", "fuchsia", "gainsboro", "ghostwhite", "gold", "goldenrod",
  "gray", "green", "greenyellow", "grey", "honeydew", "hotpink", "indianred", "indigo",
  "ivory", "khaki", "lavender", "lavenderblush", "lawngreen", "lemonchiffon", "lightblue",
  "lightcoral", "lightcyan", "lightgoldenrodyellow", "lightgray", "lightgreen", "lightgrey",
  "lightpink", "lightsalmon", "lightseagreen", "lightskyblue", "lightslategray",
  "lightslategrey", "lightsteelblue", "lightyellow", "lime", "limegreen", "linen", "magenta",
  "maroon", "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple",
  "mediumseagreen", "mediumslateblue", "mediumspringgreen", "mediumturquoise",
  "mediumvioletred", "midnightblue", "mintcream", "mistyrose", "moccasin", "navajowhite",
  "navy", "oldlace", "olive", "olivedrab", "orange", "orangered", "orchid", "palegoldenrod",
  "palegreen", "paleturquoise", "palevioletred", "papayawhip", "peachpuff", "peru", "pink",
  "plum", "powderblue", "purple", "rebeccapurple", "red", "rosybrown", "royalblue",
  "saddlebrown", "salmon", "sandybrown", "seagreen", "seashell", "sienna", "silver",
  "skyblue", "slateblue", "slategray", "slategrey", "snow", "springgreen", "steelblue",
  "tan", "teal", "thistle", "tomato", "turquoise", "violet", "wheat", "white", "whitesmoke",
  "yellow", "yellowgreen",
]);

const FUNCTIONAL = /\b(rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\s*\(/i;
const HEX = /#[0-9a-f]{3,8}\b/i;

/** Whether a value string names a colour of its own. */
function rawColourIn(value: string): string | null {
  const trimmed = value.trim();
  if (NOT_A_COLOUR.test(trimmed)) return null;
  if (HEX.test(trimmed)) return HEX.exec(trimmed)![0];
  if (FUNCTIONAL.test(trimmed)) return FUNCTIONAL.exec(trimmed)![0].replace(/\s*\($/, "()");
  // A named colour, as a whole word: `2px solid white` counts, `whitespace` and
  // a `var(--cl-bg)` fallback chain do not.
  for (const word of trimmed.toLowerCase().split(/[^a-z]+/)) {
    if (NAMED.has(word)) return word;
  }
  return null;
}

/** CSS properties that are never a variant name, used to recognise the object. */
const LAYOUT_PROPERTIES = new Set([
  "width", "height", "minWidth", "minHeight", "maxWidth", "maxHeight", "position", "display",
  "top", "right", "bottom", "left", "inset", "margin", "marginTop", "marginRight",
  "marginBottom", "marginLeft", "padding", "paddingTop", "paddingRight", "paddingBottom",
  "paddingLeft", "borderRadius", "borderWidth", "transform", "opacity", "zIndex", "flex",
  "gap", "fontSize", "fontWeight", "lineHeight", "pointerEvents", "overflow", "transition",
  "visibility", "cursor", "gridTemplateColumns", "strokeWidth", "strokeDasharray",
]);

/** Whether an object literal is a style object rather than a map that shares a key. */
function isStyleObject(object: ts.ObjectLiteralExpression, source: ts.SourceFile): boolean {
  const keys = object.properties
    .filter(ts.isPropertyAssignment)
    .map((p) => (ts.isIdentifier(p.name) || ts.isStringLiteral(p.name) ? p.name.text : ""));
  if (keys.some((k) => LAYOUT_PROPERTIES.has(k))) return true;
  for (let node: ts.Node | undefined = object.parent; node; node = node.parent) {
    if (ts.isJsxAttribute(node)) return node.name.getText(source) === "style";
    if (ts.isPropertyAssignment(node) || ts.isVariableDeclaration(node) || ts.isParameter(node)) {
      return /style/i.test(node.name.getText(source));
    }
    if (ts.isReturnStatement(node) || ts.isArrowFunction(node) || ts.isFunctionDeclaration(node)) {
      continue;
    }
  }
  return false;
}

interface Finding {
  file: string;
  line: number;
  where: string;
  value: string;
  colour: string;
}

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) return walk(path);
    return /\.tsx?$/.test(entry) ? [path] : [];
  });
}

/** Every raw colour a style object, a paint attribute or a colour default holds. */
export function scanColours(files: string[]): Finding[] {
  const findings: Finding[] = [];

  for (const file of files) {
    if (NOT_SHIPPED.test(file) || NOT_A_DECISION.test(file)) continue;
    const text = readFileSync(file, "utf8");
    const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);

    const report = (node: ts.Node, where: string, value: string) => {
      const colour = rawColourIn(value);
      if (!colour) return;
      const { line } = source.getLineAndCharacterOfPosition(node.getStart());
      findings.push({ file, line: line + 1, where, value, colour });
    };

    const visit = (node: ts.Node) => {
      // `{ backgroundColor: "white" }` — wherever the object is written, because
      // a style object is as often a `const` in a helper as it is inline.
      //
      // "Is this a style object" is decided structurally rather than by the
      // property name alone: `outline` and `background` are CSS properties AND
      // plausible variant names, and `AvatarGroupCount`'s class map has a key
      // called `outline` whose value mentions `border-gray-300`. So the object
      // has to look like a style object — sat in a `style` attribute, named for
      // one, or carrying another CSS property beside the colour.
      if (ts.isPropertyAssignment(node) && ts.isObjectLiteralExpression(node.parent)) {
        const name = ts.isIdentifier(node.name) || ts.isStringLiteral(node.name) ? node.name.text : null;
        if (name && COLOUR_PROPERTIES.has(name) && ts.isStringLiteralLike(node.initializer)) {
          if (isStyleObject(node.parent, source)) {
            report(node, `style property \`${name}\``, node.initializer.text);
          }
        }
      }

      // `stroke="white"` on an SVG element.
      if (ts.isJsxAttribute(node) && node.name && ts.isIdentifier(node.name)) {
        const name = node.name.text;
        if (PAINT_ATTRIBUTES.has(name) && node.initializer && ts.isStringLiteralLike(node.initializer)) {
          report(node, `paint attribute \`${name}\``, node.initializer.text);
        }
      }

      /**
       * A default whose name says it is a colour: `ringColor = "white"` reaches
       * a style object one call later, where the value is an identifier and the
       * rule above cannot see it.
       */
      const named = (declarationName: ts.Node, initializer: ts.Node | undefined) => {
        if (!initializer || !ts.isStringLiteralLike(initializer)) return;
        if (!ts.isIdentifier(declarationName)) return;
        if (!/colou?r$/i.test(declarationName.text)) return;
        report(declarationName, `colour default \`${declarationName.text}\``, initializer.text);
      };
      if (ts.isBindingElement(node)) named(node.name, node.initializer);
      if (ts.isParameter(node) && ts.isIdentifier(node.name)) named(node.name, node.initializer);
      if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name)) named(node.name, node.initializer);

      ts.forEachChild(node, visit);
    };
    visit(source);
  }

  return findings;
}

/**
 * Raw colours that are deliberate, each with the reason it is not a token.
 *
 * The bar is that the colour cannot follow the theme because it is not a theme
 * decision — an overlay that dims the page is black in both, and a flag is its
 * own colours.
 */
const DECLARED = new Map<string, string>([
  [
    "Modal/Modal.tsx:overlayColor",
    "The scrim that dims the page behind a modal. It is black in both themes by " +
      "design — the class form beside it is `bg-black/60 dark:bg-black/70` — and " +
      "the prop is the consumer's override.",
  ],
  [
    "Drawer/utils/constants.ts:DEFAULT_OVERLAY_COLOR",
    "Same scrim, same reason: a dimming layer is not a surface.",
  ],
]);

// `src/utils` too: `MenuSurface`, the anchored positioner and the shared style
// helpers write style objects for every floating surface in the package, and a
// colour there would reach nine components at once.
const files = [...walk("src/components"), ...walk("src/utils")];
const findings = scanColours(files);
const key = (f: Finding) => `${f.file.replace("src/components/", "").replace("src/utils/", "utils/")}:${f.where.replace(/.*`(.+)`.*/, "$1")}`;

/**
 * Counted, not assumed. A self-check proves the predicate can fail; this
 * proves it was pointed at something.
 */
const asserted = { n: 0 };

describe("inline colour contract", () => {
  describe("self-check", () => {
    it("reads a named colour, a hex and a functional notation as colours", () => {
      expect(rawColourIn("white")).toBe("white");
      expect(rawColourIn("2px solid white")).toBe("white");
      expect(rawColourIn("#fff")).toBe("#fff");
      expect(rawColourIn("rgba(0, 0, 0, 0.5)")).toBe("rgba()");
      expect(rawColourIn("0 1px 2px rgb(0 0 0 / 10%)")).toBe("rgb()");
    });

    it("reads a token, a keyword and an inherited colour as not colours", () => {
      expect(rawColourIn("var(--cl-text)")).toBeNull();
      expect(rawColourIn("currentColor")).toBeNull();
      expect(rawColourIn("transparent")).toBeNull();
      expect(rawColourIn("none")).toBeNull();
      // A word that merely contains a colour name is not one.
      expect(rawColourIn("whitespace")).toBeNull();
    });

    /**
     * Planted through the scanner, not through the predicates: the three shapes
     * that shipped were a style object, an SVG paint attribute and a colour
     * default, and the question is whether the walk finds each one where it is
     * actually written.
     */
    it("catches a style property, a paint attribute and a colour default", () => {
      const planted = join(mkdtempSync(join(tmpdir(), "colour-")), "Planted.tsx");
      writeFileSync(
        planted,
        `const ringColor = "white";\n` +
          `const dotStyle = { width: 10, backgroundColor: "#ff0000" };\n` +
          `export const Icon = () => <svg><path stroke="black" /></svg>;\n` +
          `export { ringColor, dotStyle };\n`,
        "utf8",
      );
      const caught = scanColours([planted]);
      expect(caught.map((f) => f.where).sort()).toEqual([
        "colour default `ringColor`",
        "paint attribute `stroke`",
        "style property `backgroundColor`",
      ]);
      expect(caught.map((f) => f.colour).sort()).toEqual(["#ff0000", "black", "white"]);
    });

    it("does not fault the same shapes written with a token", () => {
      const clean = join(mkdtempSync(join(tmpdir(), "colour-")), "Clean.tsx");
      writeFileSync(
        clean,
        `const ringColor = "var(--cl-bg)";\n` +
          `const dotStyle = { width: 10, backgroundColor: "var(--cl-text)" };\n` +
          `export const Icon = () => <svg><path stroke="currentColor" /></svg>;\n` +
          `export { ringColor, dotStyle };\n`,
        "utf8",
      );
      expect(scanColours([clean])).toEqual([]);
    });
  });

  it("finds no raw colour outside the declared list", () => {
    asserted.n += 1;
    const undeclared = findings
      .filter((f) => !DECLARED.has(key(f)))
      .map((f) => `${f.file}:${f.line} ${f.where} = ${JSON.stringify(f.value)} (${f.colour})`);
    expect(
      [...new Set(undeclared)],
      "a colour written where a gate cannot see it — use var(--cl-*), or declare why it is not a theme decision",
    ).toEqual([]);
  });

  it("keeps the declared list honest", () => {
    const seen = new Set(findings.map(key));
    const stale = [...DECLARED.keys()].filter((k) => !seen.has(k));
    expect(stale, "these no longer exist — remove them").toEqual([]);
  });

  it("asserted on a real number of package-wide scans", () => {
    console.log(`INLINE_COLOUR asserted on ${asserted.n} package-wide scans`);
    expect(asserted.n, "this contract iterated nothing").toBeGreaterThan(0);
  });
});
