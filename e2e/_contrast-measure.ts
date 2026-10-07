import { PORTAL_MARK } from "./_portals.js";

/**
 * Colour parsing, compositing and contrast, as page-side source.
 *
 * Exported so that a second check judging paint — `default-state.spec.ts`'s
 * highlighted option — composites with this code rather than a copy of it. Every
 * function here runs inside \`page.evaluate\`, so it is a string, embedded
 * verbatim into whatever source uses it.
 */
export const PAINT_HELPERS = `  /**
   * CSS Color 4. Tailwind v4 emits its own palette in oklch — text-gray-400 is
   * oklch(0.707 0.022 261.325) — and a parser that knows only rgb() and hex
   * returned null for it, so every element painted with a palette colour was
   * skipped in silence. That is the exact class this sweep exists to catch:
   * Table's three "Loading more" labels sat at 2.54:1 in light through every
   * green run. The self-check planted a hex, which parses, so it never noticed.
   */
  const fromOklab = (L, a, b, alpha) => {
    const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
    const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
    const s2 = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
    const linear = [
      4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s2,
      -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s2,
      -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s2,
    ];
    return linear.map((v) => {
      const c = v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(Math.max(v, 0), 1 / 2.4) - 0.055;
      return Math.min(255, Math.max(0, Math.round(c * 255)));
    }).concat(alpha);
  };
  const parseModern = (text) => {
    const m = /^okl(ab|ch)\\(([^)]+)\\)/.exec(text.trim());
    if (!m) return null;
    const parts = m[2].split(/[\\s/]+/).filter(Boolean);
    const num = (v) => (String(v).endsWith("%") ? parseFloat(v) / 100 : parseFloat(v));
    const alpha = parts.length > 3 ? num(parts[3]) : 1;
    if (m[1] === "ab") return fromOklab(num(parts[0]), num(parts[1]), num(parts[2]), alpha);
    const hue = (num(parts[2]) * Math.PI) / 180;
    return fromOklab(num(parts[0]), num(parts[1]) * Math.cos(hue), num(parts[1]) * Math.sin(hue), alpha);
  };
  const parse = (value) => {
    const modern = parseModern(String(value));
    if (modern) return modern;
    const m = /rgba?\\(([^)]+)\\)/.exec(value);
    if (!m) return null;
    const parts = m[1].split(/[,/]/).map((p) => parseFloat(p.trim()));
    return [parts[0], parts[1], parts[2], parts.length > 3 ? parts[3] : 1];
  };
  const over = (fg, bg) => [0, 1, 2].map((i) => fg[i] * fg[3] + bg[i] * (1 - fg[3]));
  const channel = (c) => {
    const v = c / 255;
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  const luminance = (rgb) =>
    0.2126 * channel(rgb[0]) + 0.7152 * channel(rgb[1]) + 0.0722 * channel(rgb[2]);
  const ratio = (a, b) => {
    const la = luminance(a), lb = luminance(b);
    return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
  };

  /** The stack behind an element, composited down to the first opaque layer. */
  const backgroundOf = (el) => {
    const layers = [];
    for (let node = el; node; node = node.parentElement) {
      const style = getComputedStyle(node);
      if (style.backgroundImage !== "none") return null;
      const colour = parse(style.backgroundColor);
      if (!colour || colour[3] === 0) continue;
      layers.push(colour);
      if (colour[3] === 1) {
        let base = [colour[0], colour[1], colour[2]];
        for (let i = layers.length - 2; i >= 0; i -= 1) base = over(layers[i], base);
        return base;
      }
    }
    // Nothing opaque above it: the canvas, which the harness paints white.
    let base = [255, 255, 255];
    for (let i = layers.length - 1; i >= 0; i -= 1) base = over(layers[i], base);
    return base;
  };

`;

/**
 * The painted-text measurement, shared.
 *
 * `contrast-painted.spec.ts` runs it over the 444 fixtures; `scan-demo-contrast.mjs`
 * runs the same source over the 37 demo pages. One copy, because the second
 * copy is the drift: the fixture sweep reported 0 findings for months while 29
 * of one demo page's 58 triggers sat at exactly 1.00:1 against the surface
 * under them, and a re-implemented scan would have been free to disagree about
 * compositing, the floors, or which elements count.
 */
const measureSource = (roots: string) => `(() => {
${PAINT_HELPERS}  const hidden = (el) => {
    if (el.closest("[aria-hidden='true']")) return true;
    if (el.closest("[disabled],[aria-disabled='true']")) return true;
    if (!el.getClientRects().length) return true;
    for (let node = el; node; node = node.parentElement) {
      const style = getComputedStyle(node);
      if (style.visibility === "hidden" || style.display === "none") return true;
      if (parseFloat(style.opacity) === 0) return true;
    }
    return false;
  };

  const paintsText = (el) =>
    [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 0);

  // The element's own text, so a row can be named by what it says as well as
  // by its selector. Not used by any verdict.
  const ownText = (el) =>
    [...el.childNodes]
      .filter((n) => n.nodeType === 3)
      .map((n) => n.textContent)
      .join("")
      .replace(/\\s+/g, " ")
      .trim()
      .slice(0, 60);

  const selectorFor = (el) => {
    const cls = el.getAttribute("class");
    return el.tagName.toLowerCase() + (cls ? "." + cls.trim().split(/\\s+/).slice(0, 2).join(".") : "");
  };

  const roots = ${roots};
  const seen = new Set();
  const out = [];

  /**
   * A placeholder is painted by ::placeholder, and \`getComputedStyle(el).color\`
   * reports the input's own text colour instead — so this sweep was blind to it
   * by construction. Table's search box shipped a 2.54:1 placeholder in light
   * and 3.04:1 in dark with every gate green.
   */
  for (const field of document.querySelectorAll("input[placeholder], textarea[placeholder]")) {
    if (hidden(field) || !field.getAttribute("placeholder")) continue;
    const background = backgroundOf(field);
    const style = getComputedStyle(field, "::placeholder");
    const foreground = parse(style.color);
    if (!background || !foreground) continue;
    const size = parseFloat(style.fontSize) || parseFloat(getComputedStyle(field).fontSize);
    const weight = Number(style.fontWeight) || 400;
    const large = size >= 24 || (size >= 18.66 && weight >= 700);
    const value = ratio(over(foreground, background), background);
    out.push({
      key: selectorFor(field) + "::placeholder",
      text: field.getAttribute("placeholder").trim().slice(0, 60),
      ratio: Math.round(value * 100) / 100,
      exact: value,
      floor: large ? 3 : 4.5,
      detail: style.color + " on rgb(" + background.map(Math.round).join(", ") + "), " + size + "px/" + weight,
    });
  }

  for (const root of roots) {
    for (const el of [root, ...root.querySelectorAll("*")]) {
      if (seen.has(el) || !paintsText(el) || hidden(el)) continue;
      seen.add(el);
      const style = getComputedStyle(el);
      const background = backgroundOf(el);
      const foreground = parse(style.color);
      if (!foreground) {
        out.push({ key: selectorFor(el), ratio: 0, detail: "unreadable colour " + style.color, unmeasurable: true });
        continue;
      }
      if (!background) {
        out.push({ key: selectorFor(el), ratio: 0, detail: "background is an image or gradient", unmeasurable: true });
        continue;
      }
      const text = over(foreground, background);
      const size = parseFloat(style.fontSize);
      const weight = Number(style.fontWeight) || 400;
      const large = size >= 24 || (size >= 18.66 && weight >= 700);
      const value = ratio(text, background);
      out.push({
        key: selectorFor(el),
        text: ownText(el),
        ratio: Math.round(value * 100) / 100,
        exact: value,
        floor: large ? 3 : 4.5,
        detail: style.color + " on rgb(" + background.map(Math.round).join(", ") + "), " + size + "px/" + weight,
      });
    }
  }
  return out;
})()`;

/**
 * The roots are a PARAMETER, not `[data-fixture]` baked in.
 *
 * It was baked in, and the first demo-page scan built on this returned zero
 * findings from zero rows: a demo page has no `[data-fixture]` element, so the
 * loop had nothing to walk and reported a clean sweep. A planted 1.5:1
 * paragraph went unseen, which is the only reason it was caught. Both callers
 * now say what they are measuring.
 */
export const MEASURE = measureSource(
  `[...document.querySelectorAll("[data-fixture]"), ...document.querySelectorAll("[${PORTAL_MARK}]")]`,
);

/** The whole document, for the demo pages, which are not built from fixtures. */
export const MEASURE_DOCUMENT = measureSource("[document.body]");

/**
 * Whether a measured pair is under its floor, decided on the unrounded ratio.
 *
 * `ratio` is rounded to two decimals, and it is for reading. Every caller used
 * to compare it, which is how the selected rows-per-page option in light passed
 * at 4.4999:1: rounded to 4.50, it met a 4.5 floor that WCAG does not let a
 * ratio meet by rounding. `exact` is for deciding. A row without one is a
 * measurement this helper refuses to guess about.
 */
export const underFloor = (row: { exact?: number }, floor: number): boolean => {
  if (typeof row.exact !== "number") {
    throw new Error(`a contrast row with no exact ratio cannot be compared: ${JSON.stringify(row)}`);
  }
  return row.exact < floor;
};
