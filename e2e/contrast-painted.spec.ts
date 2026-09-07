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
  };
}

const recorded = JSON.parse(readFileSync(RECORDED_PATH, "utf8")) as Recorded;
const EXPECTED = new Set(recorded.paintedContrastExpectations?.findings ?? []);
/** SC 1.4.11 findings recorded with a reason; see the record's $comment_nontext. */
const EXPECTED_NON_TEXT = new Set(recorded.nonTextContrastExpectations?.findings ?? []);
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
  const parse = (value) => {
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
      if (!foreground) continue;
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
  /** The colour a focus indicator paints, out of whatever property changed. */
  const indicatorColour = (before, after) => {
    if (after.outlineStyle !== "none" && parseFloat(after.outlineWidth) > 0 &&
        (before.outlineStyle === "none" || before.outlineColor !== after.outlineColor ||
         before.outlineWidth !== after.outlineWidth)) {
      return parse(after.outlineColor);
    }
    if (after.boxShadow !== before.boxShadow && after.boxShadow !== "none") return parse(after.boxShadow);
    if (after.borderColor !== before.borderColor) return parse(after.borderColor);
    return null;
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
    const before = snapshot(el);
    const behind = el.parentElement ? backgroundOf(el.parentElement) : null;
    // focusVisible where the browser honours it: the library draws its rings
    // with focus-visible, and a programmatic focus that does not set the
    // modality reports "nothing changed" on a component that rings fine.
    el.focus({ focusVisible: true });
    const after = snapshot(el);
    const colour = indicatorColour(before, after);
    if (!behind) continue;
    if (!colour || colour[3] === 0) {
      out.push({ kind: "focus-none", key: selectorFor(el), ratio: null, detail: "nothing changed on focus" });
      continue;
    }
    const painted = over(colour, behind);
    out.push({ kind: "focus", key: selectorFor(el), ratio: Math.round(ratio(painted, behind) * 100) / 100,
               detail: "rgb(" + painted.map(Math.round).join(", ") + ") on rgb(" + behind.map(Math.round).join(", ") + ")" });
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
