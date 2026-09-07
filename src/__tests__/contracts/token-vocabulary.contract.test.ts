/**
 * ADR 005 T2/T3 — a token's name must stay true of its value.
 *
 * ADR 004 revalued `--cl-bg-elevated`'s light value to `#ffffff`. `--cl-bg` in
 * light is already `#ffffff`, so a token named *elevated* became identical to
 * the surface it claims to sit above, and 51 elements that never asked for it
 * lost their tint. Nothing failed. This is the gate that would have failed.
 *
 * Only names that assert a relationship are checkable. `--cl-bg-panel` may equal
 * `--cl-bg` because "panel" claims nothing about the base surface; `elevated`
 * cannot, because it does. So the two groups are enumerated separately and every
 * token must be in exactly one — a token added without being classified fails
 * here rather than slipping through unexamined.
 *
 * Text-scale separation lives in `contrast.contract`, which asserts a dL* floor
 * rather than mere inequality, and is not duplicated.
 */
import { describe, expect, it } from "vitest";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const CSS = readFileSync(resolve(process.cwd(), "src/index.css"), "utf8");

/**
 * A theme's declarations, delimited by brace matching rather than a fixed
 * window. A byte-count slice silently truncates the moment a theme grows, and a
 * truncated theme makes every assertion below pass on the tokens it still has.
 */
function declarationsAt(open: number): Record<string, string> {
  let depth = 0;
  let end = -1;
  for (let i = open; i < CSS.length; i += 1) {
    if (CSS[i] === "{") depth += 1;
    else if (CSS[i] === "}") {
      depth -= 1;
      if (depth === 0) { end = i; break; }
    }
  }
  if (end < 0) throw new Error("unbalanced braces in index.css");
  const out: Record<string, string> = {};
  for (const m of CSS.slice(open, end).matchAll(/(--cl-[\w-]+):\s*([^;]+);/g)) {
    out[m[1]] = m[2].trim();
  }
  return out;
}

/**
 * A theme's declarations, delimited by brace matching and identified by content.
 *
 * The selector appears more than once: `:root[data-theme="light"]` is also one
 * of three grouped selectors inside a `@media (max-width: 639px)` block that
 * sets header sizing and no `--cl-*` at all. Taking the first match parsed that
 * block, found nothing, and every assertion below then compared `undefined` to
 * `undefined` and passed. So the block is chosen by the tokens it actually
 * declares, and two candidates are an error rather than a coin toss.
 */
function themeBlock(selector: string): Record<string, string> {
  const candidates: Record<string, string>[] = [];
  let from = 0;
  for (;;) {
    const start = CSS.indexOf(selector, from);
    if (start < 0) break;
    from = start + selector.length;
    const open = CSS.indexOf("{", start);
    if (open < 0) continue;
    const declarations = declarationsAt(open);
    if (Object.keys(declarations).length > 0) candidates.push(declarations);
  }
  if (candidates.length === 0) {
    throw new Error(`no block declaring --cl-* tokens for ${selector}`);
  }
  if (candidates.length > 1) {
    throw new Error(`${candidates.length} blocks declare --cl-* tokens for ${selector}`);
  }
  return candidates[0];
}

const THEMES = {
  dark: themeBlock(':root[data-theme="dark"]'),
  light: themeBlock(':root[data-theme="light"]'),
};

/** Names that assert a relationship to another token. ADR 005. */
const RELATIONAL: { token: string; against: string; claim: string }[] = [
  { token: "--cl-bg-elevated", against: "--cl-bg", claim: "sits above the base surface" },
  { token: "--cl-bg-hover", against: "--cl-bg", claim: "replaces a surface on hover" },
  { token: "--cl-border-strong", against: "--cl-border", claim: "stronger than the default border" },
  { token: "--cl-border-input-hover", against: "--cl-border-input", claim: "the hover form of the input border" },
  { token: "--cl-border-input-focus", against: "--cl-border-input", claim: "the focus form of the input border" },
  { token: "--cl-accent-hover", against: "--cl-accent", claim: "the hover form of the accent" },
  { token: "--cl-accent-bg-hover", against: "--cl-accent-bg", claim: "the hover form of the accent background" },
  { token: "--cl-on-accent", against: "--cl-accent", claim: "is legible on the accent" },
  { token: "--cl-on-error", against: "--cl-error", claim: "is legible on the error colour" },
  // ADR 007. "quiet" is a relation to the chrome step, and "recessed" is a
  // relation to the surface it is set into — both assert something checkable.
  { token: "--cl-text-chrome-quiet", against: "--cl-text-chrome", claim: "is quieter than the chrome text" },
  { token: "--cl-bg-recessed", against: "--cl-bg-panel", claim: "sits below the panel surface" },
];

/** Names that assert only a role. Listed so the enumeration is complete. */
const ROLE_ONLY = [
  "--cl-bg",
  "--cl-bg-input",
  "--cl-bg-panel",
  "--cl-bg-item-hover",
  "--cl-border",
  "--cl-border-input",
  "--cl-text",
  // ADR 007: interface text as opposed to content. A role, and it claims no
  // relation to `--cl-text` — in light the two are the same value, which is
  // the same shape as `--cl-bg-panel` equalling `--cl-bg` there.
  "--cl-text-chrome",
  "--cl-text-secondary",
  "--cl-text-tertiary",
  "--cl-text-disabled",
  "--cl-accent",
  "--cl-accent-bg",
  "--cl-success",
  "--cl-warning",
  "--cl-error",
  "--cl-error-bg",
  "--cl-code-bg",
  "--cl-code-text",
  "--cl-shadow-sm",
  "--cl-shadow-md",
];

/** An ordered numeric scale: each step must exceed the one below it. */
const ORDERED_SCALES: { name: string; steps: string[] }[] = [
  { name: "radius", steps: ["--cl-radius-sm", "--cl-radius-md", "--cl-radius-lg"] },
];

const classified = new Set([
  ...RELATIONAL.map((r) => r.token),
  ...ROLE_ONLY,
  ...ORDERED_SCALES.flatMap((s) => s.steps),
]);

const px = (v: string) => Number.parseFloat(v.replace("px", ""));

describe("token vocabulary contract", () => {
  describe("self-check", () => {
    it("both themes parsed, and they differ", () => {
      expect(Object.keys(THEMES.dark).length).toBeGreaterThan(20);
      expect(Object.keys(THEMES.light).length).toBeGreaterThan(20);
      expect(THEMES.dark["--cl-bg"]).not.toBe(THEMES.light["--cl-bg"]);
    });

    it("catches a relational token equal to what it claims to differ from", () => {
      // The exact shape of the ADR 004 defect: `elevated` collapsing onto `bg`.
      const planted: Record<string, string> = {
        "--cl-bg": "#ffffff",
        "--cl-bg-elevated": "#ffffff",
      };
      const rule = RELATIONAL.find((r) => r.token === "--cl-bg-elevated")!;
      expect(planted[rule.token]).toBe(planted[rule.against]);
    });

    it("does not object to a role-only token sharing a value", () => {
      // `panel` equalling `bg` in light is permitted; `elevated` doing so is not.
      expect(ROLE_ONLY).toContain("--cl-bg-panel");
      expect(RELATIONAL.map((r) => r.token)).not.toContain("--cl-bg-panel");
    });
  });

  it("classifies every token in the stylesheet", () => {
    const unclassified = Object.keys(THEMES.dark).filter((t) => !classified.has(t));
    expect(
      unclassified,
      "a token nobody has said whether its name makes a claim — ADR 005 T3",
    ).toEqual([]);
  });

  it("declares no token that the stylesheet does not have", () => {
    const missing = [...classified].filter((t) => !(t in THEMES.dark));
    expect(missing, "the classification names a token that no longer exists").toEqual([]);
  });

  it("defines every token in both themes", () => {
    const onlyOne = [...classified].filter(
      (t) => (t in THEMES.dark) !== (t in THEMES.light),
    );
    expect(onlyOne, "a token defined in one theme only").toEqual([]);
  });

  it("keeps the committed tokens.css in step with index.css", () => {
    /**
     * `src/styles/tokens.css` is generated from this file and committed. It had
     * drifted: `--cl-bg-panel` and `--cl-bg-item-hover` were missing outright
     * and two values were stale. Nothing shipped wrong — `build:tokens` runs
     * first in `build:lib`, so `dist/tokens.css` is regenerated every time —
     * and that is precisely why it went unnoticed for as long as it did.
     *
     * Shelling out to the generator rather than reimplementing it: a second
     * copy of the formatting rules would drift from the first, which is the
     * defect this test is about.
     */
    expect(() =>
      execFileSync("node", ["scripts/build-tokens.mjs", "--check"], { stdio: "pipe" }),
    ).not.toThrow();
  }, 120_000);

  describe.each(RELATIONAL)("$token", ({ token, against, claim }) => {
    it.each(["dark", "light"])(`differs from ${against} in %s`, (themeName) => {
      const theme = THEMES[themeName as "dark" | "light"];
      expect(
        theme[token],
        `${token} says it ${claim}, and in ${themeName} it is the same value as ${against} ` +
          `(${theme[token]}). The name has stopped being true — ADR 005 T2.`,
      ).not.toBe(theme[against]);
    });
  });

  describe.each(ORDERED_SCALES)("$name scale", ({ steps }) => {
    it.each(["dark", "light"])("increases across the scale in %s", (themeName) => {
      const theme = THEMES[themeName as "dark" | "light"];
      const values = steps.map((s) => px(theme[s]));
      const sorted = [...values].every((v, i) => i === 0 || v > values[i - 1]);
      expect(
        sorted,
        `${steps.join(" < ")} is ${values.join(" , ")} in ${themeName}`,
      ).toBe(true);
    });
  });
});
