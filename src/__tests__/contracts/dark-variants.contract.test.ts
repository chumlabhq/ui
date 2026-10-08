/**
 * The `dark:` inventory, classified and ratcheted.
 *
 * Component source carried 361 `dark:` variants in three kinds:
 *
 *   A. literal no-ops — `text-cl-text dark:text-cl-text`, the same token on
 *      both sides, so the variant re-applies a declaration that is already
 *      there. 149 of them.
 *   B. token swaps — a different token under `.dark`. 167.
 *   C. raw palette — `dark:bg-gray-700` and friends, which bypass the design
 *      tokens entirely. 44.
 *
 * Group A is gone. It was safe to delete because the variant said nothing new,
 * and that was proven rather than assumed: `scripts/capture-theme-styles.mjs`
 * snapshots 13 computed colour properties of every element of all 305 fixtures
 * in both themes, and reported the render identical before and after. The
 * hovered state was checked separately, because a `dark:` rule is emitted after
 * a `hover:` rule and would win at equal specificity — in every real case the
 * source also carried a `dark:hover:` counterpart, which is more specific, so
 * hover was never suppressed.
 *
 * B and C need token decisions and are a later slice. They are ratcheted here
 * so they can only shrink, and A is held at zero so the no-ops cannot return.
 */
import { describe, expect, it } from "vitest";
import ts from "typescript";
import { readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

/** A colour that is a raw palette value rather than a `cl-` design token. */
const RAW_PALETTE =
  /(#[0-9a-fA-F]{3,8})|\b(white|black|transparent|current)\b|\b(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}\b/;

/**
 * String literals via the compiler, not a regex.
 *
 * The regex version desynchronised on an apostrophe inside a comment —
 * `// Tooltip's default` opened a single-quoted match that ran to the next
 * apostrophe and swallowed the literals between. It hid a real
 * `border-cl-border dark:border-cl-border` no-op in Breadcrumb from this
 * contract, which then reported group A empty while it was not.
 */
export function literals(file: string): string[] {
  const text = readFileSync(file, "utf8");
  const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const out: string[] = [];
  const visit = (node: ts.Node): void => {
    if (
      ts.isStringLiteral(node) ||
      ts.isNoSubstitutionTemplateLiteral(node) ||
      ts.isTemplateHead(node) ||
      ts.isTemplateMiddle(node) ||
      ts.isTemplateTail(node)
    ) {
      if (node.text.trim()) out.push(node.text);
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return out;
}

function sourceFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "__tests__") continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...sourceFiles(path));
    else if (/\.tsx?$/.test(entry.name)) out.push(path);
  }
  return out.sort();
}

interface Found {
  file: string;
  token: string;
  base: string;
}

/** How many class-shaped string literals the walker can see at all. */
export function classLiteralCount(root = resolve(process.cwd(), "src/components")): number {
  let total = 0;
  for (const file of sourceFiles(root)) total += literals(file).length;
  return total;
}

export function classifyDarkVariants(root = resolve(process.cwd(), "src/components")) {
  const groups: Record<"A" | "B" | "C", Found[]> = { A: [], B: [], C: [] };

  for (const file of sourceFiles(root)) {
    for (const raw of literals(file)) {
      if (!raw.includes("dark:")) continue;
      const classes = raw.split(/\s+/).filter(Boolean);
      const bag = new Set(classes);
      for (const token of classes) {
        if (!token.includes("dark:")) continue;
        const base = token.replace("dark:", "");
        const entry = { file, token, base };
        if (bag.has(base)) groups.A.push(entry);
        else if (RAW_PALETTE.test(base)) groups.C.push(entry);
        else groups.B.push(entry);
      }
    }
  }
  return groups;
}

/**
 * The endpoint, enumerated rather than counted.
 *
 * ADR 006 closed the phase at 78 with a ceiling on each group. ADR 007 took the
 * three decisions those numbers were waiting on and applied them: 70 of the 76
 * that were left are gone — onto `--cl-text-chrome`, `--cl-accent-bg`,
 * `--cl-bg-input`, `--cl-bg-item-hover`, `--cl-bg-recessed`, or onto nothing at
 * all where the variant was painting a focus ring at 1.60:1.
 *
 * Seven remain, and at seven a ceiling is the wrong instrument: each is listed with
 * its reason, so adding one fails and retiring one fails until the list is
 * updated. That is the ADR 002 DECLARED idiom, which is what a number stops
 * being able to express once it is small.
 */
const DECLARED: Record<string, string> = {
  "Breadcrumb/utils/constants.ts dark:text-cl-text-secondary":
    "The separator steps UP in dark rather than down — the only site that does, so it is a per-site judgement and not the chrome scale.",
  "Input/utils/constants.ts dark:shadow-none":
    "A drop shadow does not read on a near-black surface. No token expresses a shadow in one theme and none in the other.",
  "TextArea/utils/constants.ts dark:shadow-none": "As Input.",
  "Modal/utils/constants.ts dark:bg-black/70":
    "The scrim. A token was considered and declined in ADR 006; nothing has changed.",
  "Slider/utils/constants.ts dark:bg-cl-text":
    "The thumb is near-white in both themes, which no token holds, and it has exactly one caller. ADR 005 wants a repeated need before a mint.",
  "TimePicker/utils/constants.ts dark:hover:text-cl-text":
    "Steps UP on hover in dark. The second of the two sites that go the other way.",
};

describe("dark variant contract", () => {
  const groups = classifyDarkVariants();

  describe("self-check", () => {
    it("recognises a literal no-op", () => {
      const bag = new Set(["text-cl-text", "dark:text-cl-text"]);
      expect(bag.has("dark:text-cl-text".replace("dark:", ""))).toBe(true);
    });

    it("does not call a token swap a no-op", () => {
      const bag = new Set(["text-cl-text", "dark:text-cl-text-secondary"]);
      expect(bag.has("dark:text-cl-text-secondary".replace("dark:", ""))).toBe(false);
    });

    it("recognises a raw palette value", () => {
      expect(RAW_PALETTE.test("bg-gray-700")).toBe(true);
      expect(RAW_PALETTE.test("bg-cl-bg-elevated")).toBe(false);
    });

    it("is looking at real source", () => {
      // Guards the walker. It cannot be a floor on the variant count any more —
      // that count is seven — so it reads the corpus instead: a broken path finds
      // no class literals at all, and every assertion below would pass while
      // proving nothing.
      expect(classLiteralCount()).toBeGreaterThan(500);
    });
  });

  it("has no literal no-op left", () => {
    const sample = groups.A.slice(0, 10).map((e) => `${e.file}: ${e.token}`);
    expect(
      sample,
      "a `dark:` variant whose base class is the same token does nothing",
    ).toEqual([]);
    expect(groups.A).toHaveLength(0);
  });

  it("carries only the variants declared here, with a reason each", () => {
    const found = [...groups.B, ...groups.C]
      .map((entry) => `${entry.file.replace(/.*src\/components\//, "")} ${entry.token}`)
      .sort();
    expect(
      found,
      "every `dark:` variant in the package is enumerated in DECLARED with its reason. " +
        "A new one is a colour decision that belongs in a token; a missing one means a " +
        "decision was taken and this record was not updated",
    ).toEqual(Object.keys(DECLARED).sort());
  });
});
