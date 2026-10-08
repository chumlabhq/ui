/**
 * Every text token, against every surface it is used on, in both themes.
 *
 * `--cl-text-tertiary` shipped at 4.02:1 and failed in three separate places
 * before anyone measured it: eighteen components on the axe baseline, TabPanel's
 * inactive tab, and twenty-seven demo `classes` overrides handing it back after
 * the library moved off it (E2E-TRIAGE.md). Each was found by an axe run against
 * whatever happened to be rendered, which is why it took three passes — axe only
 * reports the pairs a page puts on screen.
 *
 * This asks the question directly, of the token values rather than of a render,
 * so a regression fails here whether or not any fixture happens to show it.
 *
 * Parsed from src/index.css, not hardcoded: a test with its own copy of the
 * numbers passes while the stylesheet says something else.
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const CSS = readFileSync(resolve(process.cwd(), "src/index.css"), "utf8");

type RGB = [number, number, number];
interface Token {
  rgb: RGB;
  alpha: number;
}

const HEX = /^#([0-9a-f]{6})$/i;
const RGBA = /^rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)$/;

const parseColor = (value: string): Token => {
  const hex = HEX.exec(value.trim());
  if (hex) {
    const n = parseInt(hex[1], 16);
    return { rgb: [(n >> 16) & 255, (n >> 8) & 255, n & 255], alpha: 1 };
  }
  const rgba = RGBA.exec(value.trim());
  if (!rgba) throw new Error(`unparseable colour: ${value}`);
  return {
    rgb: [+rgba[1], +rgba[2], +rgba[3]],
    alpha: +rgba[4],
  };
};

/**
 * The `--cl-*` block for one theme. Dark is `:root`; light is the block that
 * redefines `--cl-bg` to white. Both are matched by their own declarations
 * rather than by selector, so a selector rename does not silently skip a theme.
 */
const themeBlock = (marker: string): Record<string, string> => {
  const start = CSS.indexOf(marker);
  // Thrown, not `expect`ed: this runs at module scope, where vitest refuses an
  // assertion.
  if (start < 0) throw new Error(`theme marker not found in index.css: ${marker}`);
  // To the end of the block, not a fixed 2000-character window. The window was
  // silently short: adding a comment above `--cl-error` pushed it out of range,
  // and the only reason that surfaced is that the token was on this test's own
  // list. A parser that reads less than it was pointed at is the same failure
  // this file exists to catch, one level down.
  const end = CSS.indexOf("\n}", start);
  const slice = CSS.slice(start, end < 0 ? CSS.length : end)
    // Comments carry hex values as prose — the reasoning for a token often
    // quotes the value it replaced.
    .replace(/\/\*[\s\S]*?\*\//g, "");
  const out: Record<string, string> = {};
  for (const m of slice.matchAll(/(--cl-[\w-]+):\s*([^;]+);/g)) {
    if (!(m[1] in out)) out[m[1]] = m[2].trim();
  }
  return out;
};

const THEMES = {
  dark: themeBlock("--cl-bg: #050608;"),
  light: themeBlock("--cl-bg: #ffffff;"),
};

const channel = (c: number) => {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};

const luminance = ([r, g, b]: RGB) =>
  0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);

const contrast = (fg: RGB, bg: RGB) => {
  const a = luminance(fg);
  const b = luminance(bg);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
};

/** Alpha colours are transparent: what the eye sees is the composite. */
const composite = (t: Token, bg: RGB): RGB =>
  t.rgb.map((c, i) => c * t.alpha + bg[i] * (1 - t.alpha)) as RGB;

const resolveSurface = (theme: Record<string, string>, name: string): RGB => {
  const t = parseColor(theme[name]);
  // --cl-bg-hover is a translucent wash; it renders over --cl-bg.
  return t.alpha === 1 ? t.rgb : composite(t, parseColor(theme["--cl-bg"]).rgb);
};

/**
 * Text tokens that carry content. `--cl-text-disabled` is deliberately absent:
 * WCAG 1.4.3 exempts inactive controls, and holding it to 4.5:1 would make
 * "disabled" indistinguishable from enabled.
 */
const TEXT_TOKENS = [
  "--cl-text",
  "--cl-text-secondary",
  "--cl-text-tertiary",
  // Minted by ADR 007 for the twenty-three sites that wrote the primary step
  // in light and one step down in dark by hand. Added HERE FIRST, before any
  // site migrated onto them: a token nothing measures is where this class of
  // defect lives, and the `dark:` pair they replace was never measured either.
  "--cl-text-chrome",
  "--cl-text-chrome-quiet",
  // The semantic pair, added after the painted sweep found `--cl-success` at
  // 3.30:1 on white — on fifteen components at once, because every `message`
  // key wrote both colours unconditionally and the last one won. They carry
  // content, so they belong here; `--cl-warning` does not, because nothing in
  // the package paints text with it.
  "--cl-error",
  "--cl-success",
];

/** Surfaces a component can put text on. */
const SURFACES = [
  "--cl-bg",
  "--cl-bg-elevated",
  "--cl-bg-hover",
  "--cl-bg-input",
  // Minted by ADR 004 for the panel role. A surface token that text sits on
  // belongs in this list the moment it exists, or the gate covers four of five.
  "--cl-bg-panel",
  // Minted by ADR 006 for the hovered-item surface. Translucent, so
  // `resolveSurface` composites it over `--cl-bg` before measuring.
  "--cl-bg-item-hover",
  // Minted by ADR 007 for the search bar inside a menu panel.
  "--cl-bg-recessed",
];

/**
 * Pairs that are not text-token × surface: a label on a tint or a solid of its
 * own family.
 *
 * Selected rows paint `--cl-accent-bg` and write on it in the accent, and the
 * highlighted one deepens to `--cl-accent-hover` — Pagination's list is the
 * first to use both, after its selected option shipped as `bg-cl-accent/15`
 * with a `dark:` override at `/60`. An alpha of the foreground colour is not a
 * token, so this gate could not see it and axe measured the result at 2.2:1.
 *
 * The tints are translucent and appear inside panels, so each is measured over
 * `--cl-bg-panel` as well as `--cl-bg`.
 */
const ACCENT_PAIRS: Array<[string, string]> = [
  // T2, added before any site uses them: each tint with the text it is for.
  // `--cl-success` text is NOT listed on `--cl-success-bg`: 3.9:1 in light,
  // under AA, and its intent line says so.
  ["--cl-text", "--cl-accent-surface"],
  ["--cl-accent-hover", "--cl-accent-surface"],
  ["--cl-text", "--cl-success-bg"],
  // NOT listed, on purpose: `--cl-accent` on `--cl-accent-bg`. It FAILS AA in
  // light at 4.4999:1 over both `--cl-bg` and `--cl-bg-panel`, and was only
  // ever listed here because this contract compared `ratio.toFixed(2)` and read
  // it as 4.50. Nothing in the library paints it any more — Pagination's
  // selected option, both multi-select chips and Table's selected filter item
  // moved their text to `--cl-accent-hover` — and a pair nothing paints is not
  // one this contract can assert. The note is the guard: accent text on the
  // accent tint is a combination to deepen, not to add back to this list.
  // ADR 007 records the same.
  ["--cl-accent-hover", "--cl-accent-bg"],
  // The hovered tint, and why the text deepens on it: `--cl-accent` on
  // `--cl-accent-bg-hover` is 4.20:1 in light — the value DatePicker's today
  // button painted before ADR 007 — while `--cl-accent-hover` on it is 5.28:1.
  ["--cl-accent-hover", "--cl-accent-bg-hover"],
  // The error surface, minted for AvatarBadge's count pill. `--cl-error` is
  // opaque, so compositing it over a base returns the colour itself and the
  // pair is measured as written.
  ["--cl-error", "--cl-error-bg"],
  ["--cl-on-error", "--cl-error"],
];

const ACCENT_BASES = ["--cl-bg", "--cl-bg-panel"];

const AA_TEXT = 4.5;

/**
 * SC 1.4.11 Non-text Contrast: 3:1 for a focus indicator, a control boundary or
 * a graphical object that carries meaning.
 *
 * `--cl-accent` is the graphical fill — Slider's range, TabPanel's active
 * indicator, TimePicker's clock dot — and `--cl-border-input-focus` is the
 * focus border. Both shipped softened in dark (30% and 50%), at 1.65:1 and
 * 2.54:1, until ADR 007.
 */
const AA_NON_TEXT = 3;

/**
 * A floor is met by the unrounded ratio. WCAG does not round a ratio up to its
 * threshold, and a rounded comparison is a tolerance nobody chose.
 */
const meetsFloor = (ratio: number, floor: number) => ratio >= floor;

const NON_TEXT_TOKENS = ["--cl-accent", "--cl-border-input-focus"];

/** The surfaces those paints sit on. Not `--cl-bg-item-hover`: nothing paints
 *  a focus ring or a fill on top of a hovered item's wash. */
const NON_TEXT_SURFACES = ["--cl-bg", "--cl-bg-elevated", "--cl-bg-panel", "--cl-bg-input"];

describe("contrast contract", () => {
  it("parsed both themes from the stylesheet", () => {
    for (const [name, theme] of Object.entries(THEMES)) {
      for (const token of [
        ...TEXT_TOKENS,
        ...SURFACES,
        ...ACCENT_PAIRS.flat(),
        ...ACCENT_BASES,
      ]) {
        expect(theme[token], `${name} is missing ${token}`).toBeDefined();
      }
    }
    // The two themes must actually differ, or one block was parsed twice.
    expect(THEMES.dark["--cl-bg"]).not.toBe(THEMES.light["--cl-bg"]);
  });

  /**
   * The floor is met by the ratio, not by the ratio rounded.
   *
   * Every assertion here compared `Number(ratio.toFixed(2))`, so a pair at
   * 4.4999:1 read as 4.50 and passed a floor WCAG does not let rounding meet —
   * the shape that let `--cl-accent` on `--cl-accent-bg` through at exactly that
   * ratio. Planted both ways with pairs that each round to the floor: the lower
   * must fail, and the upper must pass so the fix cannot over-correct.
   */
  it("decides each floor on the unrounded ratio, both directions", () => {
    const white: RGB = [255, 255, 255];
    const tint = composite(parseColor("rgba(37, 99, 235, 0.1)"), white);
    const textBelow = contrast(composite(parseColor("#2563eb"), tint), tint);
    const textAbove = contrast(composite(parseColor("#2e62eb"), tint), tint);
    const nonTextBelow = contrast(composite(parseColor("#9e938b"), white), white);
    const nonTextAbove = contrast(composite(parseColor("#849a8f"), white), white);

    for (const r of [textBelow, textAbove]) expect(Number(r.toFixed(2)), "a text plant that does not round to 4.50 tests nothing").toBe(AA_TEXT);
    for (const r of [nonTextBelow, nonTextAbove]) expect(Number(r.toFixed(2)), "a non-text plant that does not round to 3.00 tests nothing").toBe(AA_NON_TEXT);

    expect(meetsFloor(textBelow, AA_TEXT), `${textBelow}:1 must not meet ${AA_TEXT}`).toBe(false);
    expect(meetsFloor(textAbove, AA_TEXT), `${textAbove}:1 must meet ${AA_TEXT}`).toBe(true);
    expect(meetsFloor(nonTextBelow, AA_NON_TEXT), `${nonTextBelow}:1 must not meet ${AA_NON_TEXT}`).toBe(false);
    expect(meetsFloor(nonTextAbove, AA_NON_TEXT), `${nonTextAbove}:1 must meet ${AA_NON_TEXT}`).toBe(true);
  });

  describe.each(Object.entries(THEMES))("%s", (_themeName, theme) => {
    describe.each(TEXT_TOKENS)("%s", (textToken) => {
      it.each(SURFACES)("clears 4.5:1 on %s", (surfaceToken) => {
        const surface = resolveSurface(theme, surfaceToken);
        const text = composite(parseColor(theme[textToken]), surface);
        const ratio = contrast(text, surface);
        expect(
          meetsFloor(ratio, AA_TEXT),
          `${textToken} on ${surfaceToken} is ${ratio.toFixed(4)}:1, under WCAG AA's ${AA_TEXT}:1 for text`,
        ).toBe(true);
      });
    });
  });

  describe.each(Object.entries(THEMES))("%s accent pairs", (_themeName, theme) => {
    for (const [textToken, tintToken] of ACCENT_PAIRS) {
      it.each(ACCENT_BASES)(`${textToken} clears 4.5:1 on ${tintToken} over %s`, (baseToken) => {
        const base = resolveSurface(theme, baseToken);
        const surface = composite(parseColor(theme[tintToken]), base);
        const text = composite(parseColor(theme[textToken]), surface);
        const ratio = contrast(text, surface);
        expect(
          meetsFloor(ratio, AA_TEXT),
          `${textToken} on ${tintToken} over ${baseToken} is ${ratio.toFixed(4)}:1, under WCAG AA's ${AA_TEXT}:1 for text`,
        ).toBe(true);
      });
    }
  });

  /**
   * SC 1.4.11, at the token level.
   *
   * The criterion was not among the ten this package gated, which is how a
   * focus ring at 1.60:1 shipped — see ADR 007 §1(c). The browser tier measures
   * what is actually painted, over the fixtures; this measures the values those
   * paints come from, so a token revaluation cannot quietly take the ring or a
   * graphical fill under the floor between two browser runs.
   */
  describe.each(Object.entries(THEMES))("%s non-text contrast", (_themeName, theme) => {
    for (const token of NON_TEXT_TOKENS) {
      it.each(NON_TEXT_SURFACES)(`${token} clears 3:1 against %s`, (surfaceToken) => {
        const surface = resolveSurface(theme, surfaceToken);
        const paint = composite(parseColor(theme[token]), surface);
        const ratio = contrast(paint, surface);
        expect(
          meetsFloor(ratio, AA_NON_TEXT),
          `${token} on ${surfaceToken} is ${ratio.toFixed(4)}:1, under WCAG AA's ${AA_NON_TEXT}:1 ` +
            `for a focus indicator or a graphical object`,
        ).toBe(true);
      });
    }
  });

  /**
   * Legality alone would be satisfied by collapsing the scale onto one value.
   * The step between adjacent tokens is the other half of the requirement, and
   * it is what stopped `tertiary` simply being raised to meet `secondary`.
   */
  describe.each(Object.entries(THEMES))("%s scale separation", (_themeName, theme) => {
    const lstar = (rgb: RGB) => {
      const y = luminance(rgb);
      return y > 0.008856 ? 116 * Math.cbrt(y) - 16 : 903.3 * y;
    };

    it("keeps secondary and tertiary visually distinct", () => {
      const bg = resolveSurface(theme, "--cl-bg");
      const step = Math.abs(
        lstar(composite(parseColor(theme["--cl-text-secondary"]), bg)) -
          lstar(composite(parseColor(theme["--cl-text-tertiary"]), bg)),
      );
      // The scale shipped at dL* 18-19 before the contrast fix; 12 is the floor
      // below which the two read as the same weight.
      expect(
        Number(step.toFixed(1)),
        `secondary and tertiary are only dL* ${step.toFixed(1)} apart`,
      ).toBeGreaterThanOrEqual(12);
    });
  });
});
