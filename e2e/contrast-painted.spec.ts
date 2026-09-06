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
}

const recorded = JSON.parse(readFileSync(RECORDED_PATH, "utf8")) as Recorded;
const EXPECTED = new Set(recorded.paintedContrastExpectations?.findings ?? []);
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
        for (const m of measured) {
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
        `unmeasurable=${unmeasurable.length} floors=${AA_TEXT}/${AA_LARGE} seconds=${seconds}`,
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
});
