import { test, expect } from "./_test";
import { gotoFixtureIndex } from "./_nav";
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
    /** The fixtures this list was derived from, not how many. See the guard. */
    fixtures: string[];
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
import { MEASURE, underFloor } from "./_contrast-measure";


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
      // Only a layer that is new on focus AND paints. A ring at 0px spread with
      // no blur and no offset changes the computed string and draws nothing:
      // \`focus-within:ring-0\` brings the ring colour in at zero width. Counting
      // every colour in the changed string credited that as a 4.9:1 indicator
      // on an Input whose focus showed nothing at all, and a plant that removed
      // its only real indicator passed.
      const layers = (value) => value === "none" ? [] : value.split(/,(?![^(]*\\))/).map((l) => l.trim());
      const was = new Set(layers(before.boxShadow));
      for (const layer of layers(after.boxShadow)) {
        if (was.has(layer)) continue;
        const m = layer.match(/(rgba?|oklab|oklch)\\([^)]+\\)/);
        if (!m) continue;
        const lengths = layer.replace(m[0], "").match(/-?[\\d.]+px/g) ?? [];
        if (lengths.every((len) => parseFloat(len) === 0)) continue;
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
          const value = ratio(painted, behind);
          out.push({ kind: "fill", key: selectorFor(el), ratio: Math.round(value * 100) / 100, exact: value,
                     detail: getComputedStyle(el).backgroundColor + " over rgb(" + behind.map(Math.round).join(", ") + ")" });
        }
      }
    }
  }

  // a calendar day's state marks. The fill rule above exempts an element with
  // text, which suits a chip that names itself, but a day's number says
  // nothing about whether it is selected, in a range or today: the mark is the
  // only thing that does, so each cue is held to 3:1 against what it sits on.
  for (const root of roots) {
    for (const el of root.querySelectorAll("[role=gridcell]:is([data-selected],[data-today],[data-range])")) {
      if (hidden(el)) continue;
      const cs = getComputedStyle(el);
      const behind = el.parentElement ? backgroundOf(el.parentElement) : null;
      if (!behind) continue;
      const own = parse(cs.backgroundColor);
      const ground = own && own[3] > 0 ? over(own, behind) : behind;
      const mark = (what, colour, against, detail) => {
        const value = ratio(colour, against);
        out.push({ kind: "mark", key: selectorFor(el) + " " + what, ratio: Math.round(value * 100) / 100, exact: value, detail });
      };
      if (own && own[3] > 0) mark("fill", ground, behind, cs.backgroundColor + " over rgb(" + behind.map(Math.round).join(", ") + ")");
      const deco = parse(cs.textDecorationColor);
      if (cs.textDecorationLine.includes("underline") && deco) mark("underline", over(deco, ground), ground, cs.textDecorationColor + " on the cell");
      const text = parse(cs.color);
      if (el.hasAttribute("data-range") && text) mark("text", over(text, ground), ground, cs.color + " on the cell");
    }
  }

  // the other state marks S3 added, each the only thing that shows its state:
  // an active preset's fill, an in-range mark's ring, a resizing handle's bar.
  // A tint (a fill under full opacity) is not the cue where it appears —
  // TimePicker's and Pagination's active buttons draw it with their border and
  // text — so only an opaque fill is held here. A dragged thumb grows rather
  // than taking a colour, so it has no cue to hold to a ratio: it took a ring
  // first, which was the focus ring again and hid focus during a drag.
  for (const root of roots) {
    const cue = (el, what, colour, detail) => {
      const behind = el.parentElement ? backgroundOf(el.parentElement) : null;
      if (!behind || !colour) return;
      const value = ratio(over(colour, behind), behind);
      out.push({ kind: "mark", key: selectorFor(el) + " " + what, ratio: Math.round(value * 100) / 100, exact: value, detail });
    };
    for (const el of root.querySelectorAll("button[data-active],[role=separator][data-resizing]")) {
      if (hidden(el)) continue;
      const fill = parse(getComputedStyle(el).backgroundColor);
      if (fill && fill[3] === 1) cue(el, "fill", fill, getComputedStyle(el).backgroundColor);
    }
    // A Slider's mark: active inside the range, in the control that holds the thumbs.
    for (const el of root.querySelectorAll("[data-state=active]:not([role])")) {
      if (hidden(el) || !el.closest("[data-orientation]")?.querySelector("[role=slider]")) continue;
      const cs = getComputedStyle(el);
      if (parseFloat(cs.borderTopWidth) > 0) cue(el, "border", parse(cs.borderTopColor), cs.borderTopColor);
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
  // Every focusable element, not the first eight. The cap made the empty
  // unindicated list a claim about at most 8 elements per fixture, and the
  // truncation fell entirely on DatePicker: of 433 fixtures only 18 hold more
  // than 8 focusable elements, all of them open calendars with 39-54 day
  // cells — exactly where a missing indicator would hide, and exactly what was
  // never looked at. Measured cost of lifting it is in the slice report.
  for (const el of focusable) {
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
    out.push({ kind: "focus", key: selectorFor(el), ratio: Math.round(best.value * 100) / 100, exact: best.value,
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
    await gotoFixtureIndex(page);
    const paths = await page
      .locator("[data-fixture-index] a")
      .evaluateAll((links) => links.map((a) => (a as HTMLAnchorElement).getAttribute("href") ?? ""));
    expect(paths.length, "the fixture index listed nothing").toBeGreaterThan(200);

    const findings: Finding[] = [];
    const unmeasurable: string[] = [];
    let audited = 0;
    const auditedFixtures: string[] = [];
    // Counted and reported: this pass found nothing on its first run because it
    // was measuring nothing, and "0 findings" reads identically either way.
    let placeholders = 0;
    const nonTextFindings: Finding[] = [];
    const unindicated: string[] = [];
    let indicators = 0;
    let fills = 0;
    let marks = 0;

    for (const path of paths) {
      const [, , component, fixture] = path.split("/");
      audited += 1;
      auditedFixtures.push(path.replace("/__fixtures/", ""));

      /**
       * Each theme is measured on its own fresh load of the fixture.
       *
       * Both themes used to share one load, and the non-text pass between them
       * focuses every focusable element in turn, which changed the page under
       * the light pass. The three `Pagination/rows-per-page-open*` fixtures
       * had their menu closed by it — six options measured in dark, none in
       * light — and six tooltip fixtures, `Tooltip/closed` among them, had a
       * tooltip opened by focus that their named state does not have. Light
       * was measured on a page the fixture is not, which is how the selected
       * rows-per-page option, under AA only in light at 4.4999:1, stayed
       * unseen even after a fixture rendered it.
       */
      for (const theme of ["dark", "light"] as const) {
        await page.goto(path, { waitUntil: "domcontentloaded" });
        // The act, and then the harness's holds-still answer, as the
        // pointer-affordance sweep waits: a fixture with no act reports a
        // terminal act status at mount, before its surface has finished
        // rendering. 30s is the 20s act wait plus the harness's 1.5s quiet cap
        // and 3s holds-still deadline, with margin.
        await page
          .waitForFunction(
            () => {
              const main = document.querySelector("main[data-fixture-act]");
              const act = main?.getAttribute("data-fixture-act");
              const still = main?.getAttribute("data-fixture-still");
              return act && act !== "pending" && still && still !== "pending" ? act : null;
            },
            undefined,
            { timeout: 30000 },
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

        await page.evaluate((next) => {
          const html = document.documentElement;
          html.setAttribute("data-theme", next);
          html.classList.toggle("dark", next === "dark");
        }, theme);

        const measured = (await page.evaluate(MEASURE)) as Array<{
          key: string;
          ratio: number;
          exact?: number;
          floor?: number;
          detail: string;
          unmeasurable?: boolean;
        }>;
        const nonText = (await page.evaluate(MEASURE_NONTEXT)) as Array<{
          kind: string;
          key: string;
          ratio: number | null;
          exact?: number;
          detail: string;
        }>;
        for (const m of nonText) {
          if (m.kind === "focus-none") {
            unindicated.push(`${component}/${fixture} ${theme}: ${m.key}`);
            continue;
          }
          if (m.kind === "fill") fills += 1;
          else if (m.kind === "mark") marks += 1;
          else indicators += 1;
          if (m.ratio !== null && underFloor(m, AA_NON_TEXT)) {
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
          if (!underFloor(m, m.floor ?? AA_TEXT)) continue;
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
      `CONTRAST_NONTEXT indicators=${indicators} fills=${fills} marks=${marks} ` +
        `findings=${nonTextFindings.length} no-indicator=${unindicated.length} floor=${AA_NON_TEXT}`,
    );
    for (const f of findings) {
      console.log(`CONTRAST_FINDING ${f.key} — ${f.ratio}:1 (${f.detail})`);
    }

    if (RERECORD) {
      // Re-read before writing: `accessibility-full` re-records into this same
      // file concurrently, and writing the import-time copy puts back whatever
      // it had just written. See the matching note in that spec.
      const { writeFileSync, readFileSync: readNow } = await import("node:fs");
      const onDisk = JSON.parse(readNow(RECORDED_PATH, "utf8")) as typeof recorded;
      onDisk.paintedContrastExpectations = {
        ...recorded.paintedContrastExpectations,
        recordedOn: new Date().toISOString().slice(0, 10),
        fixtures: [...auditedFixtures].sort(),
        findings: [...new Set(findings.map((f) => f.key))].sort(),
      };
      writeFileSync(RECORDED_PATH, `${JSON.stringify(onDisk, null, 2)}\n`, "utf8");
      console.log(`CONTRAST_RERECORDED ${findings.length} findings from ${audited} fixtures`);
      return;
    }

    /**
     * Keyed per fixture, not by a total — the same change as the axe list.
     * A count made every fixture's verdict depend on every other fixture's
     * existence, so adding two invalidated a record covering 429 unrelated
     * ones. Only a fixture the list names and that no longer exists makes the
     * list stale; a new fixture is caught by the unexpected check below.
     */
    const auditedNow = new Set(auditedFixtures);
    const vanished = (recorded.paintedContrastExpectations.fixtures ?? []).filter(
      (f) => !auditedNow.has(f),
    );
    expect(
      vanished,
      `the recorded contrast list names ${vanished.length} fixture(s) that no longer exist — ` +
        "re-derive it with `CONTRAST_RERECORD=1`",
    ).toEqual([]);

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
  /**
   * The floor is decided on the unrounded ratio, in both directions.
   *
   * Two focus rings either side of 3:1, both of which round to 3.00. Under the
   * old comparison the lower one passed; a fix that over-corrected — comparing
   * with `>` or on a truncated value — would fail the upper one. The colours
   * were chosen by computation to sit there; whether they do is this spec's own
   * MEASURE_NONTEXT's answer, not the computation's.
   */
  test("decides the non-text floor on the unrounded ratio, both directions", async ({ page }) => {
    await page.setContent(`
      <style>
        button { border: 0; background: transparent; outline: none; font: 16px sans-serif; }
        .nt-below:focus-visible { outline: 2px solid rgb(158, 147, 139); }
        .nt-above:focus-visible { outline: 2px solid rgb(132, 154, 143); }
      </style>
      <div data-fixture="plant/non-text-floor">
        <button class="nt-below">below</button>
        <button class="nt-above">above</button>
      </div>`);
    const rows = (await page.evaluate(MEASURE_NONTEXT)) as Array<{
      kind: string; key: string; ratio: number | null; exact?: number;
    }>;
    const below = rows.find((r) => r.kind === "focus" && r.key.startsWith("button.nt-below"));
    const above = rows.find((r) => r.kind === "focus" && r.key.startsWith("button.nt-above"));
    expect(below?.ratio, "the lower ring should round to the floor, or it tests nothing").toBe(3);
    expect(above?.ratio, "the upper ring should round to the floor, or it tests nothing").toBe(3);
    expect(below && underFloor(below, AA_NON_TEXT), `2.9999:1 must fail: ${JSON.stringify(below)}`).toBe(true);
    expect(above && underFloor(above, AA_NON_TEXT), `3.0000:1 must pass: ${JSON.stringify(above)}`).toBe(false);
  });

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
