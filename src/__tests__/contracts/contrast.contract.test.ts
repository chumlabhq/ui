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
  const slice = CSS.slice(start, start + 2000);
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
];

const AA_TEXT = 4.5;

describe("contrast contract", () => {
  it("parsed both themes from the stylesheet", () => {
    for (const [name, theme] of Object.entries(THEMES)) {
      for (const token of [...TEXT_TOKENS, ...SURFACES]) {
        expect(theme[token], `${name} is missing ${token}`).toBeDefined();
      }
    }
    // The two themes must actually differ, or one block was parsed twice.
    expect(THEMES.dark["--cl-bg"]).not.toBe(THEMES.light["--cl-bg"]);
  });

  describe.each(Object.entries(THEMES))("%s", (_themeName, theme) => {
    describe.each(TEXT_TOKENS)("%s", (textToken) => {
      it.each(SURFACES)("clears 4.5:1 on %s", (surfaceToken) => {
        const surface = resolveSurface(theme, surfaceToken);
        const text = composite(parseColor(theme[textToken]), surface);
        const ratio = contrast(text, surface);
        expect(
          Number(ratio.toFixed(2)),
          `${textToken} on ${surfaceToken} is ${ratio.toFixed(2)}:1, under WCAG AA's ${AA_TEXT}:1 for text`,
        ).toBeGreaterThanOrEqual(AA_TEXT);
      });
    });
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
