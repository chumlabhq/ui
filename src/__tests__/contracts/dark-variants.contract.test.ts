/**
 * The `dark:` inventory, classified and ratcheted.
 *
 * Component source carried 361 `dark:` variants in three kinds:
 *
 *   A. literal no-ops — `text-cl-text dark:text-cl-text`, the same token on
 *      both sides, so the variant re-applies a declaration that is already
 *      there. 149 of them.
 *   B. token swaps — a different token under `.dark`. 168.
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
import { readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

const STRING =
  /"([^"\\]*(?:\\.[^"\\]*)*)"|'([^'\\]*(?:\\.[^'\\]*)*)'|`([^`\\]*(?:\\.[^`\\]*)*)`/gs;

/** A colour that is a raw palette value rather than a `cl-` design token. */
const RAW_PALETTE =
  /(#[0-9a-fA-F]{3,8})|\b(white|black|transparent|current)\b|\b(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}\b/;

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

export function classifyDarkVariants(root = resolve(process.cwd(), "src/components")) {
  const groups: Record<"A" | "B" | "C", Found[]> = { A: [], B: [], C: [] };

  for (const file of sourceFiles(root)) {
    const text = readFileSync(file, "utf8");
    for (const match of text.matchAll(STRING)) {
      const raw = match[1] ?? match[2] ?? match[3];
      if (!raw || !raw.includes("dark:")) continue;
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

/** Ratchet. These may fall; they may not rise. */
const CEILING = { B: 168, C: 44 };

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
      // Guards the walker: a broken path would report zero of everything and
      // every assertion below would pass while proving nothing.
      expect(groups.A.length + groups.B.length + groups.C.length).toBeGreaterThan(100);
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

  it("does not grow the token-swap backlog", () => {
    expect(groups.B.length, "group B is a ratchet — it may fall, not rise").toBeLessThanOrEqual(
      CEILING.B,
    );
  });

  it("does not grow the raw-palette backlog", () => {
    expect(groups.C.length, "group C is a ratchet — it may fall, not rise").toBeLessThanOrEqual(
      CEILING.C,
    );
  });
});
