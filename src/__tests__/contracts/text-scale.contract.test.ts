/**
 * The marketing site's text scale, against every ground it is painted on.
 *
 * `contrast.contract` does this for the library's `--cl-*` tokens. The site's
 * own `--text-*` scale had no such gate, and it drifted the same way: an axe
 * pass over six routes found 33 nodes below AA, all of them `--text-tertiary`
 * at 3.37:1 and `--text-muted` at 2.36:1. Neither was reachable by stepping up
 * a level, because the steps are alpha stops on one ink and the whole lower
 * half of the scale sat under the threshold.
 *
 * Asked of the token values rather than of a render, so a regression fails here
 * whether or not a page happens to put the pair on screen — which is the
 * difference between this and the axe run that found it.
 *
 * Parsed from src/index.css: a test carrying its own copy of the numbers passes
 * while the stylesheet says something else.
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
    rgb: [Number(rgba[1]), Number(rgba[2]), Number(rgba[3])],
    alpha: Number(rgba[4]),
  };
};

/** Every `--text-*` / `--bg-*` declaration in the block that starts at `marker`. */
const block = (marker: string, from = 0): Record<string, string> => {
  const start = CSS.indexOf(marker, from);
  if (start < 0) throw new Error(`marker not found in index.css: ${marker}`);
  const end = CSS.indexOf("\n}", start);
  const slice = CSS.slice(start, end < 0 ? CSS.length : end)
    // A token's reasoning often quotes the value it replaced.
    .replace(/\/\*[\s\S]*?\*\//g, "");
  const out: Record<string, string> = {};
  for (const m of slice.matchAll(/(--(?:text|bg)-[\w-]+):\s*([^;]+);/g)) {
    if (!(m[1] in out)) out[m[1]] = m[2].trim();
  }
  return { start: String(start), ...out } as Record<string, string>;
};

const THEMES = {
  dark: block("--bg-base: #050608;"),
  light: block("--bg-base: #fafaf7;"),
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
const composite = (t: Token, bg: RGB): RGB =>
  t.rgb.map((c, i) => Math.round(t.alpha * c + (1 - t.alpha) * bg[i])) as RGB;
const lstar = (rgb: RGB) => {
  const y = luminance(rgb);
  return y > 0.008856 ? 116 * Math.cbrt(y) - 16 : 903.3 * y;
};

/** Every step of the scale, brightest first. */
const STEPS = ["--text-primary", "--text-secondary", "--text-tertiary", "--text-muted"];
/** Every surface the scale is painted on. */
const GROUNDS = ["--bg-base", "--bg-elevated", "--bg-overlay"];

const AA_TEXT = 4.5;
/**
 * The floor below which two adjacent steps read as one weight. The scale ships
 * at 23.4 / 13.2 / 7.3 in dark and 18.5 / 14.4 / 11.8 in light; the tightest
 * pair is tertiary and muted, which is where a future raise would collapse
 * first.
 */
const MIN_STEP_LSTAR = 6;

describe("site text scale contract", () => {
  it("parsed both themes from the stylesheet", () => {
    // Without this every assertion below passes on an empty object.
    for (const [name, theme] of Object.entries(THEMES)) {
      for (const key of [...STEPS, ...GROUNDS]) {
        expect(theme[key], `${name} is missing ${key}`).toBeDefined();
      }
    }
    expect(THEMES.dark["--text-muted"]).not.toBe(THEMES.light["--text-muted"]);
  });

  for (const [name, theme] of Object.entries(THEMES)) {
    describe(name, () => {
      it("clears AA on every ground, at every step", () => {
        const failures: string[] = [];
        for (const step of STEPS) {
          for (const ground of GROUNDS) {
            const bg = parseColor(theme[ground]).rgb;
            const ratio = contrast(composite(parseColor(theme[step]), bg), bg);
            if (ratio < AA_TEXT) {
              failures.push(`${step} on ${ground}: ${ratio.toFixed(2)}:1`);
            }
          }
        }
        expect(
          failures,
          "below 4.5:1. The scale is alpha stops on one ink, so a step that " +
            "fails cannot be fixed by using the step above it — raise the scale " +
            "as a unit and re-measure the L* gaps",
        ).toEqual([]);
      });

      it("keeps its four steps distinct", () => {
        const bg = parseColor(theme["--bg-base"]).rgb;
        const ls = STEPS.map((s) => lstar(composite(parseColor(theme[s]), bg)));
        const gaps = ls.slice(1).map((l, i) => Math.abs(ls[i] - l));
        const tight = gaps
          .map((g, i) => ({ g, pair: `${STEPS[i]} → ${STEPS[i + 1]}` }))
          .filter(({ g }) => g < MIN_STEP_LSTAR);
        expect(
          tight.map(({ pair, g }) => `${pair}: ΔL* ${g.toFixed(1)}`),
          "two steps this close read as one weight — the scale would clear AA " +
            "while losing the hierarchy it exists for",
        ).toEqual([]);
      });

      it("darkens monotonically", () => {
        const bg = parseColor(theme["--bg-base"]).rgb;
        const ratios = STEPS.map((s) =>
          contrast(composite(parseColor(theme[s]), bg), bg),
        );
        for (let i = 1; i < ratios.length; i += 1) {
          expect(
            ratios[i],
            `${STEPS[i]} has more contrast than ${STEPS[i - 1]}`,
          ).toBeLessThan(ratios[i - 1]);
        }
      });
    });
  }

  it("keeps every copy of the light scale in step", () => {
    /**
     * The light values are declared three times: the theme block, and the two
     * scoped surfaces that reproduce it (`.demo-light`, and the docs surface's
     * own copy). A raise applied to one of them is the drift this catches.
     */
    const copies: Record<string, string>[] = [];
    let from = 0;
    for (;;) {
      const at = CSS.indexOf("--text-secondary: rgba(10, 13, 18", from);
      if (at < 0) break;
      const start = CSS.lastIndexOf("{", at);
      copies.push(block("--text-primary: #0a0d12;", CSS.lastIndexOf("\n", start)));
      from = at + 1;
    }
    expect(copies.length, "the light scale should be declared more than once").toBeGreaterThan(1);
    const canonical = STEPS.map((s) => copies[0][s]).join(" | ");
    for (const copy of copies.slice(1)) {
      expect(STEPS.map((s) => copy[s]).join(" | "), "a copy of the light scale drifted").toBe(
        canonical,
      );
    }
  });
});
