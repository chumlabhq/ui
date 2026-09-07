import { test, expect } from "@playwright/test";
import { gotoGuarded } from "./_nav";
import { markPortalRoots, PORTAL_MARK } from "./_portals.js";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Contrast as painted, over every fixture, in both themes.
 *
 * `contrast.contract` checks the `--cl-*` scale: every text token against every
 * surface token, parsed from the stylesheet. That is a design constraint and it
 * holds — and it is structurally blind to a component that does not use the
 * tokens. Four contrast defects shipped inside two of them while it reported
 * the scale green: `Table`'s filter menu wrote `text-gray-500` and
 * `text-gray-700`, and `Pagination`'s selected option painted `bg-cl-accent/15`
 * with a `dark:` override at `/60` — an alpha of the foreground colour, which
 * is a background no token names.
 *
 * A gate that can only see the values it was told about is the same shape as a
 * scope that excluded every portal. This one reads what the browser computed:
 * the foreground, the background stack composited down to the first opaque
 * layer, and the ratio between them. Both gates are kept. They fail for
 * different reasons — the token check fails when the palette moves, this one
 * fails when a component writes a colour that is not in it.
 *
 * Both themes, because the axe sweep audits whichever one the page loads in and
 * a raw grey cannot follow the surface: `text-gray-500` measured 4.02:1 on the
 * dark panel and would have passed on the light one.
 */

/** WCAG 1.4.3: 4.5:1 for text, 3:1 for large text. */
const AA_TEXT = 4.5;
const AA_LARGE = 3;

/** SC 1.4.11: a focus indicator or a meaningful graphical object. */
const AA_NON_TEXT = 3;

/**
 * Findings this gate accepts, with the reason. Ratchets down only.
 *
 * Every entry is a component writing a colour the token scale does not own.
 * They are recorded rather than fixed here because each is a design decision
 * about a shipped default, not a mechanical substitution — and recording them
 * with a measured ratio is what makes the next one visible.
 */
const RECORDED_PATH = resolve(process.cwd(), "docs/adr/002-unrenderable-keys.json");

interface Recorded {
  paintedContrastExpectations: {
    reason: string;
    recordedOn: string;
    fixtures: number;
    findings: string[];
  };
  nonTextContrastExpectations: {
    reason: string;
    recordedOn: string;
    findings: string[];
    unindicated: string[];
    unindicatedReason: string;
  };
}

const recorded = JSON.parse(readFileSync(RECORDED_PATH, "utf8")) as Recorded;
const EXPECTED = new Set(recorded.paintedContrastExpectations?.findings ?? []);
/** SC 1.4.11 findings recorded with a reason; see the record's $comment_nontext. */
const EXPECTED_NON_TEXT = new Set(recorded.nonTextContrastExpectations?.findings ?? []);
/** Focusable elements with no indicator anywhere in their chain — SC 2.4.7. */
const EXPECTED_UNINDICATED = new Set(recorded.nonTextContrastExpectations?.unindicated ?? []);
const RERECORD = process.env.CONTRAST_RERECORD === "1";

interface Finding {
  fixture: string;
  theme: string;
  key: string;
  ratio: number;
  detail: string;
}

/**
 * Runs in the page: every element that paints text of its own, against the
 * background actually behind it.
 *
 * The rules it applies are the ones a checker applies, and each exclusion is a
 * WCAG one rather than a convenience:
 *  - invisible elements paint nothing;
 *  - `aria-hidden` and inactive controls are exempt under 1.4.3;
 *  - a background image or gradient has no single colour to measure, so it is
 *    reported as unmeasurable rather than guessed at.
 */
const MEASURE = `(() => {
  /**
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

  const hidden = (el) => {
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

  const selectorFor = (el) => {
    const cls = el.getAttribute("class");
    return el.tagName.toLowerCase() + (cls ? "." + cls.trim().split(/\\s+/).slice(0, 2).join(".") : "");
  };

  const roots = [
    ...document.querySelectorAll("[data-fixture]"),
    ...document.querySelectorAll("[${PORTAL_MARK}]"),
  ];
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
      ratio: Math.round(value * 100) / 100,
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
        ratio: Math.round(value * 100) / 100,
        floor: large ? 3 : 4.5,
        detail: style.color + " on rgb(" + background.map(Math.round).join(", ") + "), " + size + "px/" + weight,
      });
    }
  }
  return out;
})()`;

/**
 * SC 1.4.11 Non-text Contrast, over the same fixtures.
 *
 * The criterion was not among the ten this package gates, and that is how a
 * focus ring at 1.60:1 and an accent fill at 1.65:1 shipped — ADR 007 §1. Two
 * things are measured, both against what sits behind them, both at 3:1:
 *
 *   - the FOCUS INDICATOR: whatever outline, ring or border changes when an
 *     element is focused. Read as a diff, so it does not need to know how any
 *     particular component draws one.
 *   - a GRAPHICAL FILL in the accent: Slider's range, TabPanel's active
 *     indicator, TimePicker's clock dot. Identified by solving for the alpha
 *     that composites the accent onto the element's own background — an alpha
 *     of the accent is still the accent, which is precisely the shape that
 *     softened those three to 1.65:1.
 */
const MEASURE_NONTEXT = `(() => {
  /**
   * CSS Color 4, because Tailwind v4 emits it. A ring-white/80 computes to
   * "oklab(0.999994 0.0000455677 0.0000200868 / 0.8)", and a parser that knows
   * only rgb() and hex returns null for it — which this pass then reads as "no
   * focus indicator". Toast's close button rings perfectly well and was
   * reported unindicated in twelve fixture/theme pairs because of this.
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
    const encoded = linear.map((v) => {
      const c = v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(Math.max(v, 0), 1 / 2.4) - 0.055;
      return Math.min(255, Math.max(0, Math.round(c * 255)));
    });
    return [encoded[0], encoded[1], encoded[2], alpha];
  };
  const parseModern = (text) => {
    const m = /^okl(ab|ch)\\(([^)]+)\\)/.exec(text);
    if (!m) return null;
    const parts = m[2].split(/[\\s/]+/).filter(Boolean);
    const num = (v) => (String(v).endsWith("%") ? parseFloat(v) / 100 : parseFloat(v));
    const alpha = parts.length > 3 ? num(parts[3]) : 1;
    if (m[1] === "ab") return fromOklab(num(parts[0]), num(parts[1]), num(parts[2]), alpha);
    const hue = (num(parts[2]) * Math.PI) / 180;
    return fromOklab(num(parts[0]), num(parts[1]) * Math.cos(hue), num(parts[1]) * Math.sin(hue), alpha);
  };
  const parse = (value) => {
    const text = String(value).trim();
    // Hex as well as rgb(): the tokens are written as hex in the stylesheet, and
    // reading --cl-accent through getPropertyValue returns it verbatim. Without
    // this the accent was null and the fill scan matched nothing at all, which
    // is why the count is asserted rather than trusted.
    const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(text);
    if (hex) {
      const d = hex[1].length === 3 ? [...hex[1]].map((c) => c + c).join("") : hex[1];
      return [parseInt(d.slice(0, 2), 16), parseInt(d.slice(2, 4), 16), parseInt(d.slice(4, 6), 16), 1];
    }
    const modern = parseModern(text);
    if (modern) return modern;
    const m = /rgba?\\(([^)]+)\\)/.exec(text);
    if (!m) return null;
    const parts = m[1].split(/[ ,/]+/).filter(Boolean).map(Number);
    return [parts[0], parts[1], parts[2], parts.length > 3 ? parts[3] : 1];
  };
  const over = (fg, bg) => {
    const a = fg[3];
    return [0, 1, 2].map((i) => fg[i] * a + bg[i] * (1 - a));
  };
  const channel = (c) => { const v = c / 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  const lum = ([r, g, b]) => 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
  const ratio = (a, b) => { const x = lum(a), y = lum(b); const hi = Math.max(x, y), lo = Math.min(x, y); return (hi + 0.05) / (lo + 0.05); };
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
    let base = [255, 255, 255];
    for (let i = layers.length - 1; i >= 0; i -= 1) base = over(layers[i], base);
    return base;
  };
  const hidden = (el) => {
    if (el.closest("[aria-hidden='true']")) return true;
    if (!el.getClientRects().length) return true;
    for (let node = el; node; node = node.parentElement) {
      const style = getComputedStyle(node);
      if (style.visibility === "hidden" || style.display === "none") return true;
      if (parseFloat(style.opacity) === 0) return true;
    }
    return false;
  };
  const selectorFor = (el) => {
    const cls = el.getAttribute("class");
    return el.tagName.toLowerCase() + (cls ? "." + cls.trim().split(/\\s+/).slice(0, 2).join(".") : "");
  };
  const accent = parse(getComputedStyle(document.documentElement).getPropertyValue("--cl-accent"));
  /** Is the paint the accent at some alpha over the base? Solved per channel. */
  const isAccentAtAnyAlpha = (paint, base) => {
    if (!accent) return false;
    let alpha = null;
    for (let i = 0; i < 3; i += 1) {
      const denominator = accent[i] - base[i];
      if (Math.abs(denominator) < 8) continue;
      const a = (paint[i] - base[i]) / denominator;
      if (a < 0.05 || a > 1.02) return false;
      if (alpha === null) alpha = a;
      else if (Math.abs(alpha - a) > 0.08) return false;
    }
    return alpha !== null;
  };
  /**
   * The colours a focus indicator paints, out of whatever property changed.
   *
   * Plural, and that is the fix: a Tailwind v4 ring computes to
   * "rgba(0,0,0,0) 0px 0px 0px 0px, rgba(0,0,0,0) 0px 0px 0px 0px,
   *  rgb(5,6,8) 0px 0px 0px 2px, rgb(91,155,255) 0px 0px 0px 4px" —
   * two transparent placeholders, then the offset ring in the page colour, then
   * the accent ring. Reading the FIRST colour out of that string returns
   * rgba(0,0,0,0), which reads as "this element has no focus indicator". That
   * one line reported 757 elements as unindicated; 654 of them ring perfectly
   * well. An indicator made of layers is visible if any layer is, so every
   * layer is measured and the best one is the verdict.
   */
  const indicatorColours = (before, after) => {
    const out = [];
    if (after.outlineStyle !== "none" && parseFloat(after.outlineWidth) > 0 &&
        (before.outlineStyle === "none" || before.outlineColor !== after.outlineColor ||
         before.outlineWidth !== after.outlineWidth)) {
      const outline = parse(after.outlineColor);
      if (outline) out.push(outline);
    }
    if (after.boxShadow !== before.boxShadow && after.boxShadow !== "none") {
      for (const m of after.boxShadow.matchAll(/(rgba?|oklab|oklch)\\([^)]+\\)/g)) {
        const colour = parse(m[0]);
        if (colour && colour[3] > 0) out.push(colour);
      }
    }
    if (after.borderColor !== before.borderColor) {
      const border = parse(after.borderColor);
      if (border) out.push(border);
    }
    return out.filter((colour) => colour[3] > 0);
  };
  const snapshot = (el) => {
    const s = getComputedStyle(el);
    return { outlineStyle: s.outlineStyle, outlineColor: s.outlineColor, outlineWidth: s.outlineWidth,
             boxShadow: s.boxShadow, borderColor: s.borderColor };
  };

  const roots = [...document.querySelectorAll("[data-fixture]"), ...document.querySelectorAll("[${PORTAL_MARK}]")];
  const out = [];
  const seen = new Set();

  for (const root of roots) {
    for (const el of [root, ...root.querySelectorAll("*")]) {
      if (seen.has(el) || hidden(el)) continue;
      seen.add(el);

      // a graphical fill in the accent
      const own = parse(getComputedStyle(el).backgroundColor);
      const box = el.getBoundingClientRect();
      // Any descendant text, not just a direct child: SC 1.4.11 exempts a
      // graphical object whose information is also available in text, and a
      // chip painted in the accent tint says what it is in its own label. The
      // three fills this rule is for — a slider range, a tab indicator, a clock
      // dot — contain no text at any depth.
      const hasText = el.textContent.trim().length > 0;
      if (own && own[3] > 0 && !hasText && box.width >= 2 && box.height >= 2) {
        const behind = el.parentElement ? backgroundOf(el.parentElement) : null;
        const painted = behind ? over(own, behind) : null;
        if (behind && painted && isAccentAtAnyAlpha(painted, behind)) {
          out.push({ kind: "fill", key: selectorFor(el), ratio: Math.round(ratio(painted, behind) * 100) / 100,
                     detail: getComputedStyle(el).backgroundColor + " over rgb(" + behind.map(Math.round).join(", ") + ")" });
        }
      }
    }
  }

  // the focus indicator, one focusable element at a time
  const focusable = [];
  for (const root of roots) {
    for (const el of root.querySelectorAll(
      "a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex='-1'])",
    )) {
      if (!hidden(el) && !el.closest("[disabled],[aria-disabled='true']")) focusable.push(el);
    }
  }
  const active = document.activeElement;
  for (const el of focusable.slice(0, 8)) {
    // Blurred first, so "before" is a genuinely unfocused baseline. Several of
    // these are already focused when their fixture opens — a combobox with its
    // panel open, a slider thumb the fixture's act pointer-downed — and the ring
    // was in both snapshots, so the diff saw no change and called it no ring.
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    // The element and the ancestors that might draw for it: focus-within puts
    // the ring on the control wrapping an input, which is what
    // wcag-layout.spec.ts already accepts for 2.4.7 — "the indicator need not
    // sit on the focused node". Reading only the node reported 150 elements as
    // unindicated whose component rings perfectly well.
    const chain = [el];
    for (let node = el.parentElement, i = 0; node && i < 4 && !node.hasAttribute("data-fixture"); node = node.parentElement, i += 1) {
      chain.push(node);
    }
    const before = chain.map(snapshot);
    const behind = el.parentElement ? backgroundOf(el.parentElement) : null;
    // focusVisible where the browser honours it: the library draws its rings
    // with focus-visible, and a programmatic focus that does not set the
    // modality reports "nothing changed" on a component that rings fine.
    el.focus({ focusVisible: true });
    const colours = [];
    let drawnOn = null;
    chain.forEach((node, i) => {
      if (colours.length) return;
      const found = indicatorColours(before[i], snapshot(node));
      if (found.length) {
        colours.push(...found);
        drawnOn = node === el ? "self" : "ancestor";
      }
    });
    if (!behind) continue;
    if (colours.length === 0) {
      out.push({ kind: "focus-none", key: selectorFor(el), ratio: null, detail: "nothing changed on focus" });
      continue;
    }
    let best = null;
    for (const colour of colours) {
      const painted = over(colour, behind);
      const value = ratio(painted, behind);
      if (!best || value > best.value) best = { value, painted };
    }
    out.push({ kind: "focus", key: selectorFor(el), ratio: Math.round(best.value * 100) / 100,
               detail: drawnOn + ", " + colours.length + " layer(s), best rgb(" +
                 best.painted.map(Math.round).join(", ") + ") on rgb(" + behind.map(Math.round).join(", ") + ")" });
  }
  if (active instanceof HTMLElement) active.focus(); else document.activeElement?.blur?.();
  return out;
})()`;

test.describe("painted contrast", () => {
  test.setTimeout(30 * 60_000);

  test("every fixture clears AA in both themes", async ({ page }) => {
    const started = Date.now();
    await gotoGuarded(page, "/__fixtures", "[data-fixture-index]");
    const paths = await page
      .locator("[data-fixture-index] a")
      .evaluateAll((links) => links.map((a) => (a as HTMLAnchorElement).getAttribute("href") ?? ""));
    expect(paths.length, "the fixture index listed nothing").toBeGreaterThan(200);

    const findings: Finding[] = [];
    const unmeasurable: string[] = [];
    let audited = 0;
    // Counted and reported: this pass found nothing on its first run because it
    // was measuring nothing, and "0 findings" reads identically either way.
    let placeholders = 0;
    const nonTextFindings: Finding[] = [];
    const unindicated: string[] = [];
    let indicators = 0;
    let fills = 0;

    for (const path of paths) {
      const [, , component, fixture] = path.split("/");
      await page.goto(path, { waitUntil: "domcontentloaded" });
      await page
        .waitForFunction(
          () => {
            const reported = document
              .querySelector("main[data-fixture-act]")
              ?.getAttribute("data-fixture-act");
            return reported && reported !== "pending" ? reported : null;
          },
          undefined,
          { timeout: 20000 },
        )
        .catch(() => null);

      // Transitions off before anything is read. `transition-colors` is on
      // every option row in the package, so a colour sampled just after a theme
      // flip is a frame of the animation between the two themes — which is how
      // an earlier attempt at this measured the dark palette and called it
      // light.
      await page.addStyleTag({
        content: "*,*::before,*::after{transition:none!important;animation:none!important}",
      });
      await markPortalRoots(page);
      audited += 1;

      for (const theme of ["dark", "light"] as const) {
        await page.evaluate((next) => {
          const html = document.documentElement;
          html.setAttribute("data-theme", next);
          html.classList.toggle("dark", next === "dark");
        }, theme);

        const measured = (await page.evaluate(MEASURE)) as Array<{
          key: string;
          ratio: number;
          floor?: number;
          detail: string;
          unmeasurable?: boolean;
        }>;
        const nonText = (await page.evaluate(MEASURE_NONTEXT)) as Array<{
          kind: string;
          key: string;
          ratio: number | null;
          detail: string;
        }>;
        for (const m of nonText) {
          if (m.kind === "focus-none") {
            unindicated.push(`${component}/${fixture} ${theme}: ${m.key}`);
            continue;
          }
          if (m.kind === "fill") fills += 1;
          else indicators += 1;
          if (m.ratio !== null && m.ratio < AA_NON_TEXT) {
            nonTextFindings.push({
              fixture: `${component}/${fixture}`,
              theme,
              key: `${component}/${fixture} ${theme}: ${m.key} (${m.kind})`,
              ratio: m.ratio,
              detail: m.detail,
            });
          }
        }

        for (const m of measured) {
          if (m.key.endsWith("::placeholder")) placeholders += 1;
          if (m.unmeasurable) {
            unmeasurable.push(`${component}/${fixture} ${theme}: ${m.key}`);
            continue;
          }
          if (m.ratio >= (m.floor ?? AA_TEXT)) continue;
          findings.push({
            fixture: `${component}/${fixture}`,
            theme,
            key: `${component}/${fixture} ${theme}: ${m.key}`,
            ratio: m.ratio,
            detail: m.detail,
          });
        }
      }
    }

    const seconds = Math.round((Date.now() - started) / 1000);
    console.log(
      `CONTRAST_PAINTED fixtures=${audited} findings=${findings.length} ` +
        `placeholders=${placeholders} unmeasurable=${unmeasurable.length} ` +
        `floors=${AA_TEXT}/${AA_LARGE} seconds=${seconds}`,
    );
    console.log(
      `CONTRAST_NONTEXT_UNINDICATED ${JSON.stringify([...new Set(unindicated)].slice(0, 40))}`,
    );
    console.log(
      `CONTRAST_NONTEXT indicators=${indicators} fills=${fills} ` +
        `findings=${nonTextFindings.length} no-indicator=${unindicated.length} floor=${AA_NON_TEXT}`,
    );
    for (const f of findings) {
      console.log(`CONTRAST_FINDING ${f.key} — ${f.ratio}:1 (${f.detail})`);
    }

    if (RERECORD) {
      recorded.paintedContrastExpectations = {
        ...recorded.paintedContrastExpectations,
        recordedOn: new Date().toISOString().slice(0, 10),
        fixtures: audited,
        findings: [...new Set(findings.map((f) => f.key))].sort(),
      };
      const { writeFileSync } = await import("node:fs");
      writeFileSync(RECORDED_PATH, `${JSON.stringify(recorded, null, 2)}\n`, "utf8");
      console.log(`CONTRAST_RERECORDED ${findings.length} findings from ${audited} fixtures`);
      return;
    }

    expect(
      audited,
      `the recorded list was derived from ${recorded.paintedContrastExpectations.fixtures} ` +
        `fixtures and this run audited ${audited}`,
    ).toBe(recorded.paintedContrastExpectations.fixtures);

    const unexpected = [...new Set(findings.map((f) => `${f.key} — ${f.ratio}:1`))].filter(
      (line) => !EXPECTED.has(line.split(" — ")[0]),
    );
    expect(
      unexpected,
      "text painted under WCAG AA — fix it, or record it with a reason in " +
        "docs/adr/002-unrenderable-keys.json",
    ).toEqual([]);

    const stale = [...EXPECTED].filter(
      (key) => !findings.some((f) => f.key === key),
    );
    expect(stale, "these no longer report — remove them from the record").toEqual([]);

    for (const f of nonTextFindings) {
      console.log(`CONTRAST_NONTEXT_FINDING ${f.key} — ${f.ratio}:1 (${f.detail})`);
    }
    // Both halves have to be non-empty, or a scan that matched nothing would
    // report a clean sweep: the fills and the focus indicators are counted, and
    // the fixtures certainly contain both.
    expect(indicators, "no focus indicator was measured at all").toBeGreaterThan(20);
    expect(fills, "no accent fill was measured at all").toBeGreaterThan(5);
    const unexpectedNonText = nonTextFindings.filter(
      (f) => !EXPECTED_NON_TEXT.has(f.key.replace(/ — .*/, "")),
    );
    expect(
      unexpectedNonText.map((f) => `${f.key} — ${f.ratio}:1`),
      "painted under WCAG AA's 3:1 for a focus indicator or a graphical object — SC 1.4.11. " +
        "Fix it, or record it with a reason in docs/adr/002-unrenderable-keys.json",
    ).toEqual([]);

    const staleNonText = [...EXPECTED_NON_TEXT].filter(
      (key) => !nonTextFindings.some((f) => f.key === key),
    );
    expect(staleNonText, "these no longer report — remove them from the record").toEqual([]);

    // SC 2.4.7, asserted rather than counted. The number this reports was 757
    // when the pass was written and 654 of those were rings it could not read —
    // a transparent placeholder layer, a baseline taken while the element was
    // already focused, an indicator drawn by `focus-within` on an ancestor. It
    // is an assertion now because a count nobody asserts is a count that moves.
    const unexpectedUnindicated = unindicated.filter((key) => !EXPECTED_UNINDICATED.has(key));
    expect(
      unexpectedUnindicated,
      "focusable, and nothing in its chain paints an indicator — SC 2.4.7. Give it the " +
        "library's ring, or record it with a reason in docs/adr/002-unrenderable-keys.json",
    ).toEqual([]);
    const staleUnindicated = [...EXPECTED_UNINDICATED].filter((key) => !unindicated.includes(key));
    expect(staleUnindicated, "these now show an indicator — remove them from the record").toEqual([]);
  });

  /**
   * The plant, on a component the token gate calls clean.
   *
   * `Button/default` writes only `--cl-*`, so `contrast.contract` has nothing to
   * fault and never will: it reads the stylesheet's tokens, and a raw palette
   * class is not one. This paints Tailwind's `text-gray-500` on the button's own
   * surface and requires the painted check to report it — which is the whole
   * difference between the two gates.
   */
  test("catches a raw-palette grey the token gate cannot see", async ({ page }) => {
    await page.goto("/__fixtures/Button/default", { waitUntil: "domcontentloaded" });
    await page.locator("[data-fixture]").waitFor({ state: "attached" });
    await markPortalRoots(page);

    const clean = (await page.evaluate(MEASURE)) as Array<{ ratio: number; floor?: number }>;
    expect(
      clean.filter((m) => m.ratio < (m.floor ?? AA_TEXT)),
      "Button/default is not clean to start with, so the plant proves nothing",
    ).toEqual([]);

    // The class form first, which is how it actually ships: Tailwind v4 computes
    // its palette to oklch, and a parser that read only rgb() and hex skipped
    // every element painted that way in silence.
    await page.evaluate(() => {
      const classed = document.createElement("span");
      classed.className = "planted-oklch text-gray-400 cl-s";
      classed.textContent = "planted";
      document.querySelector("[data-fixture]")!.append(classed);
    });
    const viaClass = (await page.evaluate(MEASURE)) as Array<{ key: string; ratio: number; detail: string }>;
    const oklch = viaClass.find((m) => m.key.startsWith("span.planted-oklch"));
    expect(oklch, "a Tailwind palette class was not measured at all").toBeDefined();
    expect(
      oklch!.detail,
      "the palette colour was not resolved — Tailwind v4 emits oklch()",
    ).toContain("oklch");
    await page.evaluate(() => document.querySelector(".planted-oklch")?.remove());

    await page.evaluate(() => {
      const planted = document.createElement("span");
      planted.className = "planted-grey cl-s";
      // Painted, not classed. Tailwind generates only the utilities it finds in
      // the source, and `text-gray-500` is no longer written anywhere — the
      // class would have inherited its parent's colour and proved nothing. The
      // value is Tailwind's grey-500, which is what the two components that
      // failed were writing.
      planted.style.color = "#6a7282";
      planted.textContent = "planted";
      document.querySelector("[data-fixture]")!.append(planted);
    });

    const planted = (await page.evaluate(MEASURE)) as Array<{
      key: string;
      ratio: number;
      floor?: number;
      detail: string;
    }>;
    const caught = planted.filter((m) => m.ratio < (m.floor ?? AA_TEXT));
    expect(
      caught.map((m) => m.key),
      "the painted check did not report a raw-palette grey on the fixture surface",
    ).toContain("span.planted-grey.cl-s");
    // Measured, not merely flagged: grey-500 on the dark page ground.
    expect(caught.find((m) => m.key === "span.planted-grey.cl-s")!.ratio).toBeLessThan(AA_TEXT);
  });

  /**
   * The second plant, for the second blind spot.
   *
   * The sweep read `getComputedStyle(el).color`, which is the input's own text
   * colour, so a placeholder — painted by `::placeholder` — was invisible to it.
   * Table's search box shipped at 2.54:1 in light and 3.04:1 in dark with every
   * gate green. A pass that reports zero findings has to be shown to be reading
   * something, or zero means nothing.
   */
  test("catches a placeholder the element's own colour hides", async ({ page }) => {
    // Table's search box: the component this blind spot was found on.
    await page.goto("/__fixtures/Table/with-search", { waitUntil: "domcontentloaded" });
    await page.locator("[data-fixture]").waitFor({ state: "attached" });
    await markPortalRoots(page);

    const measured = (await page.evaluate(MEASURE)) as Array<{ key: string; ratio: number }>;
    const placeholders = measured.filter((m) => m.key.endsWith("::placeholder"));
    expect(
      placeholders.length,
      "the placeholder pass measured nothing on a fixture that has one",
    ).toBeGreaterThan(0);

    await page.evaluate(() => {
      // In light, where Table's placeholder measured 2.54:1. The fixture page
      // renders dark by default and grey-400 is legible there, so the theme has
      // to be the one the defect was in.
      const html = document.documentElement;
      html.setAttribute("data-theme", "light");
      html.classList.remove("dark");
      const style = document.createElement("style");
      // Tailwind's grey-400, which is what Table's search box wrote. The input's
      // own `color` stays legible, which is exactly how this shipped unnoticed.
      style.textContent = "[data-fixture] input::placeholder { color: #99a1af; }";
      document.head.append(style);
    });

    const planted = (await page.evaluate(MEASURE)) as Array<{
      key: string;
      ratio: number;
      floor?: number;
    }>;
    const caught = planted.filter(
      (m) => m.key.endsWith("::placeholder") && m.ratio < (m.floor ?? AA_TEXT),
    );
    expect(
      caught.length,
      "the sweep did not report a placeholder painted under AA",
    ).toBeGreaterThan(0);
  });
});
