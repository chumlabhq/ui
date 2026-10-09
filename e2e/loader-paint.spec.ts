import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { test, expect } from "@playwright/test";
import { gotoFixture } from "./_nav";

/**
 * Every Loader indicator shows: against its track and against the surface,
 * 3:1 or more (WCAG 1.4.11, a graphic needed to understand state), in both
 * themes, with and without a custom track colour.
 *
 * LinearLoader did not. With no `trackColor` its root carried `opacity: 0.2`,
 * and the bar is inside the root, so the bar faded with the track: 1:1, a grey
 * strip with nothing moving in it, on the demo's own Basic Usage.
 *
 * The population is Loader's own exports, read from its index, and the
 * fixtures that render them. A variant exported and never measured fails, and
 * so does a variant that takes `trackColor` but is measured only one way.
 */
const LOADER_INDEX = resolve(process.cwd(), "src/components/Loader/index.ts");
const LOADER_TYPES = resolve(process.cwd(), "src/components/Loader/utils/types.ts");
const FIXTURES = resolve(process.cwd(), "src/__tests__/fixtures/Loader.fixtures.tsx");

const EXPORTED = [...readFileSync(LOADER_INDEX, "utf8").matchAll(/export \{ default as (\w+) \}/g)].map((m) => m[1]);
/** Variants whose props declare `trackColor`, read from the props interfaces. */
const WITH_TRACK = [...readFileSync(LOADER_TYPES, "utf8").matchAll(/export interface (\w+)Props\b[^{]*\{([\s\S]*?)\n\}/g)]
  .filter((m) => /\btrackColor\?/.test(m[2]))
  .map((m) => m[1]);
const FIXTURE_NAMES = [...readFileSync(FIXTURES, "utf8").matchAll(/name: "([\w-]+)"/g)].map((m) => m[1]);

const FLOOR = 3;

test("every Loader indicator shows against its track and the surface, both themes", async ({ page }) => {
  const rows: Array<{ fixture: string; theme: string; variant: string; customTrack: boolean; vsTrack: number | null; vsSurface: number; detail: string }> = [];
  for (const fixture of FIXTURE_NAMES) {
    await gotoFixture(page, "Loader", fixture);
    await page.addStyleTag({ content: "*{animation:none!important;transition:none!important}" });
    for (const theme of ["light", "dark"] as const) {
      await page.evaluate((t) => {
        document.documentElement.setAttribute("data-theme", t);
        document.documentElement.classList.toggle("dark", t === "dark");
      }, theme);
      await page.waitForTimeout(50);
      const r = await page.evaluate(() => {
        const cv = document.createElement("canvas"); cv.width = cv.height = 1;
        const cx = cv.getContext("2d", { willReadFrequently: true })!;
        const over = (paint: string, under: number[], alpha = 1) => {
          cx.clearRect(0, 0, 1, 1); cx.globalAlpha = 1;
          cx.fillStyle = `rgb(${under.join(",")})`; cx.fillRect(0, 0, 1, 1);
          cx.globalAlpha = alpha; cx.fillStyle = paint; cx.fillRect(0, 0, 1, 1); cx.globalAlpha = 1;
          return [...cx.getImageData(0, 0, 1, 1).data].slice(0, 3);
        };
        const solid = (el: Element | null): number[] => {
          for (let e = el; e; e = e.parentElement) {
            const bg = getComputedStyle(e).backgroundColor;
            cx.clearRect(0, 0, 1, 1); cx.fillStyle = "rgba(0,0,0,0)"; cx.fillStyle = bg; cx.fillRect(0, 0, 1, 1);
            if (cx.getImageData(0, 0, 1, 1).data[3] === 255) return over(bg, [0, 0, 0]);
          }
          return [255, 255, 255];
        };
        const lum = ([r, g, b]: number[]) => { const f = (v: number) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
        const cr = (a: number[], b: number[]) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return +((x + 0.05) / (y + 0.05)).toFixed(3); };
        const op = (el: Element, stop: Element) => { let o = 1; for (let e: Element | null = el; e && e !== stop.parentElement; e = e.parentElement) o *= +getComputedStyle(e).opacity; return o; };
        const root = document.querySelector("[data-fixture] [role=status]")!;
        const surface = solid(root.parentElement);
        const circles = root.querySelectorAll("circle");
        if (circles.length === 2) {
          const [track, arc] = [...circles];
          const t = over(getComputedStyle(track).stroke, surface, op(track, root));
          const a = over(getComputedStyle(arc).stroke, surface, op(arc, root));
          return { variant: "CircularLoader", customTrack: !/currentcolor/i.test((root as HTMLElement).style.getPropertyValue("--loader-track")), vsTrack: cr(a, t), vsSurface: cr(a, surface), detail: `arc rgb(${a}) track rgb(${t}) surface rgb(${surface})` };
        }
        const spans = [...root.querySelectorAll("span")];
        const bar = root.querySelector(":scope > div");
        if (bar) {
          const rs = getComputedStyle(root);
          const t = over(rs.backgroundColor, surface, +rs.opacity);
          const b = over(getComputedStyle(bar).backgroundColor, surface, op(bar, root));
          return { variant: "LinearLoader", customTrack: !/currentcolor/i.test((root as HTMLElement).style.backgroundColor), vsTrack: cr(b, t), vsSurface: cr(b, surface), detail: `bar rgb(${b}) track rgb(${t}) surface rgb(${surface})` };
        }
        const ringed = spans.some((s) => (s as HTMLElement).style.border);
        const dot = ringed ? spans[0] : spans[0];
        const d = over(getComputedStyle(dot).backgroundColor, surface, op(dot, root));
        return { variant: ringed ? "PulseLoader" : "DotLoader", customTrack: false, vsTrack: null, vsSurface: cr(d, surface), detail: `${ringed ? "core" : "dot"} rgb(${d}) surface rgb(${surface})` };
      });
      rows.push({ fixture, theme, ...r });
    }
  }

  const failing = rows.filter((r) => r.vsSurface < FLOOR || (r.vsTrack !== null && r.vsTrack < FLOOR));
  const measured = [...new Set(rows.map((r) => r.variant))].sort();
  const trackWays = WITH_TRACK.filter((v) => {
    const ways = new Set(rows.filter((r) => r.variant === v).map((r) => r.customTrack));
    return ways.size < 2;
  });
  console.log(
    `LOADER_PAINT exported=${EXPORTED.length} measured=${measured.length} fixtures=${FIXTURE_NAMES.length} rows=${rows.length} failing=${failing.length} floor=${FLOOR}`,
  );
  for (const r of rows) {
    console.log(`  ${r.variant.padEnd(14)} ${r.fixture.padEnd(16)} ${r.theme.padEnd(5)} track=${r.customTrack ? "custom " : "default"} vsTrack=${r.vsTrack ?? "-"} vsSurface=${r.vsSurface}  ${r.detail}`);
  }
  expect(measured, "an exported Loader variant has no fixture, so it was never measured").toEqual([...EXPORTED].sort());
  expect(trackWays, "a variant that takes trackColor is measured with or without one, not both").toEqual([]);
  expect(failing.map((r) => `${r.variant} ${r.fixture} ${r.theme}: vsTrack ${r.vsTrack}, vsSurface ${r.vsSurface} (${r.detail})`)).toEqual([]);
});
