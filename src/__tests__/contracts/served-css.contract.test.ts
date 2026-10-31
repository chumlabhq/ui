/**
 * @vitest-environment node
 */
/**
 * Every e2e gate runs against the dev server, so the CSS it serves must be the
 * CSS the library ships (FINDINGS F-3 of the A2 run). Tailwind's serve-time
 * output keeps variants nested — `.x { &:hover { @media (hover: hover) {…} } }`
 * — and WebKit does not apply an @media nested inside `&:hover`: Button's hover
 * slide moved 0px in Playwright's WebKit while dist/styles.css, flattened by
 * the build's Lightning CSS pass, moved it 4px.
 *
 * Read from a real Vite server built from the site config, in middleware mode
 * (no port), with its own cache directory and no dependency discovery, so it
 * never touches the cache of a dev server that is running.
 */
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createServer, type ViteDevServer } from "vite";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { HOVER_ANIMATION_MAP } from "../../components/Button/utils/constants.js";

interface Rule {
  selector: string;
  ancestors: string[];
}

/** Every style rule with the preludes of the blocks around it, outermost first. */
function rules(css: string): Rule[] {
  const out: Rule[] = [];
  const stack: string[] = [];
  let prelude = "";
  for (const ch of css.replace(/\/\*[\s\S]*?\*\//g, "")) {
    if (ch === "{") {
      const p = prelude.trim();
      if (!p.startsWith("@")) out.push({ selector: p, ancestors: [...stack] });
      stack.push(p);
      prelude = "";
    } else if (ch === "}") {
      stack.pop();
      prelude = "";
    } else if (ch === ";") {
      prelude = "";
    } else {
      prelude += ch;
    }
  }
  return out;
}

const escapeClass = (token: string) => token.replace(/[^a-zA-Z0-9_-]/g, (c) => `\\${c}`);

const SLIDES = ["slideEnd", "slideStart", "slideUp", "slideDown"] as const;
const HOVER_TOKENS = SLIDES.flatMap((slide) =>
  (HOVER_ANIMATION_MAP[slide] ?? "")
    .split(/\s+/)
    .filter((token) => token.includes("hover:"))
    .map((token) => ({ slide, token })),
);

describe("served CSS contract", () => {
  let server: ViteDevServer;
  let cacheDir: string;
  let served: Rule[];
  let css: string;

  beforeAll(async () => {
    cacheDir = mkdtempSync(join(tmpdir(), "chumlab-served-css-"));
    server = await createServer({
      configFile: "vite.config.ts",
      logLevel: "silent",
      appType: "custom",
      cacheDir,
      optimizeDeps: { noDiscovery: true, include: [] },
      server: { middlewareMode: true, hmr: false, ws: false },
    });
    css = (await server.transformRequest("/src/index.css?direct"))?.code ?? "";
    served = rules(css);
  });

  afterAll(async () => {
    await server?.close();
    rmSync(cacheDir, { recursive: true, force: true });
  });

  it("serves the stylesheet with no nested selector left in it", () => {
    expect(served.length).toBeGreaterThan(1000);
    const nested = served.filter((rule) => /(^|[^\\])&/.test(rule.selector));
    expect(nested.map((rule) => rule.selector)).toEqual([]);
  });

  it("finds a hover utility in every slide of HOVER_ANIMATION_MAP", () => {
    expect(new Set(HOVER_TOKENS.map((t) => t.slide))).toEqual(new Set(SLIDES));
    expect(HOVER_TOKENS.length).toBeGreaterThanOrEqual(6);
  });

  it.each(HOVER_TOKENS)("serves $slide's $token as a flat :hover rule inside a top-level @media (hover: hover)", ({ token }) => {
    const matching = served.filter((rule) => rule.selector.startsWith(`.${escapeClass(token)}`));
    expect(matching.length).toBeGreaterThan(0);
    for (const rule of matching) {
      expect(rule.selector).toMatch(/:hover/);
      expect(rule.ancestors.every((a) => a.startsWith("@"))).toBe(true);
      expect(rule.ancestors.some((a) => /^@media \(hover: ?hover\)$/.test(a))).toBe(true);
    }
  });
});
