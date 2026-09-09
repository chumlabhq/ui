/**
 * The invariant ADR 001 rests on: every class that reaches the DOM originates
 * in a constants file.
 *
 * AUDIT-GAP.md §4.6 recorded one instance — MSSD hardcoding
 * `cn("flex-1 bg-transparent outline-none", …)` at the JSX site, where
 * `unstyled` could not strip it and `classes` could not displace it. It was
 * never one component's mistake; it is what happens with no rule. Six of the
 * seven `unstyled` contract failures in this branch traced back to exactly this
 * shape.
 *
 * This suite reads component SOURCE, not rendered output, because that is where
 * the rule lives. A class string written at a call site is invisible to both
 * the split and the override map no matter what it renders to.
 *
 * The allowlist below is a RATCHET. It records what was already there when the
 * rule was introduced, and it may only shrink. A new literal at a new call site
 * fails immediately; retiring one means deleting its line here.
 */
import { describe, expect, it, beforeEach } from "vitest";
import { readFileSync } from "node:fs";
import { isStructural } from "../../utils/classLayers.js";
// The AST literal reader, shared rather than re-implemented: a regex over
// quotes desynchronises on an apostrophe in a comment, which this file's own
// docblock records.
import { literals as fileLiterals } from "./dark-variants.contract.test.js";

import { setReducedMotion } from "../../test/matchMedia.js";

// Fixtures render motion-aware components; the stub answers nothing
// until asked. reduced-motion.contract is where the true branch is tested.
beforeEach(() => setReducedMotion(false));

const sources = import.meta.glob("../../components/**/*.tsx", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

/**
 * The `.ts` half — `utils/constants.ts` and the component-root `constants.ts`,
 * where the default class strings actually live. `sources` above is `.tsx`
 * only, which is why the duplicate check below needs its own glob.
 */
const constantSources = import.meta.glob("../../components/**/*.ts", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

/** Marketing and docs-only files; not part of the published package. */
const NOT_SHIPPED =
  /(CatalogSection|ChumlabComparison|GetStarted|SiteHeader|SiteFooter|BuyMeCoffee|WhyChumlab|Typographic|UserMenu|Announcement|FaqLogo|Reveal|\/ui\/|BrandLogo|__tests__)/;

/**
 * Literal class strings still written at JSX call sites.
 * Ratchets DOWN only — see the docblock. Each entry is `Component/file.tsx`
 * with the count of literal-class expressions remaining in it.
 *
 * CORRECTED in Task 3c. The old figures totalled 125 and were not a floor but a
 * blind spot: the scanner was a single-line regex, so a className that wrapped
 * — which is most of the interesting ones — was invisible, and comments inside
 * one were read as class strings. The real total was 230. These numbers are the
 * measured truth, not a relaxation; the ratchet resumes from here.
 */
const BASELINE: Record<string, number> = {
  "Accordion/components/AccordionShimmer.tsx": 0,
  "Avatar/components/AvatarBadge.tsx": 2,
  "Avatar/components/AvatarGroupCount.tsx": 2,
  "Avatar/components/AvatarShimmer.tsx": 0,
  "CascadingDropdown/CascadingDropdown.tsx": 5,
  "Checkbox/Checkbox.tsx": 1,
  "CountryFlag/components/CountryFlagGroup.tsx": 1,
  "CountryFlag/components/CountryFlagShimmer.tsx": 1,
  // 21 before the optional halves moved into their own chunks: six of those
  // literals went with the marker tooltip, which is the same code in a new
  // file rather than any of it being cleaned up.
  "DatePicker/DatePicker.tsx": 15,
  "DatePicker/MarkerTooltip.tsx": 6,
  "Drawer/Drawer.tsx": 8,
  "Input/Input.tsx": 1,
  "InternationalPhoneInput/InternationalPhoneInput.tsx": 0,
  "Loader/CircularLoader.tsx": 0,
  "Modal/Modal.tsx": 5,
  "MultiSelectDropdown/MultiSelectDropdown.tsx": 3,
  "MultiSelectDropdown/components/MultiSelectDropdownOption.tsx": 1,
  "MultiSelectDropdown/components/MultiSelectDropdownShimmer.tsx": 0,
  "MultiSelectDropdown/components/SelectedChip.tsx": 2,
  "MultiSelectSearchableDropdown/MultiSelectSearchableDropdown.tsx": 6,
  "OtpInput/OtpInput.tsx": 1,
  "Pagination/Pagination.tsx": 0,
  "RadioButton/RadioButton.tsx": 5,
  "ResizablePanel/ResizablePanel.tsx": 7,
  "SearchableDropdown/components/SearchableDropdownOption.tsx": 1,
  "Stepper/Stepper.tsx": 9,
  "Switch/Switch.tsx": 0,
  // 51 before the column-filter dialog moved into its own chunk: the three that
  // went with it are the same strings in a new file. They stay literals rather
  // than becoming class-map keys because they are the popup's structure —
  // `fixed`, the z-index, the viewport clamp — and a consumer who overrode
  // `filterContent` would otherwise take the positioning with it.
  "Table/Table.tsx": 48,
  "Table/FilterPanel.tsx": 3,
  "Table/icons.tsx": 0,
  "TextArea/TextArea.tsx": 1,
  "TimePicker/TimePicker.tsx": 5,
  "Toast/Toast.tsx": 3,
  "Toast/components/ToastProvider.tsx": 3,
};

/** A Tailwind-shaped token: lowercase start, or an arbitrary/important prefix. */
const LOOKS_LIKE_UTILITY = /^[a-z![]/;

interface Finding {
  file: string;
  line: number;
  value: string;
}

/**
 * End of the `className={...}` expression starting at `open`, string-aware.
 *
 * The scanner was a single-line regex (`className=\{([^}]*)\}`) and so could
 * not see a className that wraps — which is most of the interesting ones. It
 * under-reported the baseline, and the `transition-all` that reduced-motion
 * caught on Table's pin button had been sitting inside one of those.
 */
const closeBrace = (text: string, open: number): number => {
  let depth = 0;
  for (let i = open; i < text.length; i += 1) {
    const ch = text[i];
    if (ch === '"' || ch === "'" || ch === "`") {
      const quote = ch;
      i += 1;
      while (i < text.length && text[i] !== quote) i += text[i] === "\\" ? 2 : 1;
    } else if (ch === "{") depth += 1;
    else if (ch === "}") {
      depth -= 1;
      if (depth === 0) return i;
    }
  }
  return text.length;
};

/**
 * Comments inside a className expression are not class strings, and an
 * apostrophe in prose ("the element's layout") reads as a quoted literal if
 * they are left in. Strip them before extracting.
 */
const stripComments = (expression: string): string =>
  expression.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/\/\/[^\n]*/g, " ");

/** Every quoted or backticked chunk in an expression, ignoring interpolations. */
const literalsIn = (raw: string): string[] => {
  const expression = stripComments(raw);
  const out: string[] = [];
  for (const m of expression.matchAll(/"([^"]*)"|'([^']*)'/g)) out.push(m[1] ?? m[2]);
  for (const m of expression.matchAll(/`([^`]*)`/g)) {
    // a template's static text, split at each ${...}
    for (const chunk of m[1].split(/\$\{[^}]*\}/)) out.push(chunk);
  }
  return out;
};

const scan = (): Finding[] => {
  const found: Finding[] = [];
  for (const [path, source] of Object.entries(sources)) {
    if (NOT_SHIPPED.test(path)) continue;
    const file = path.replace("../../components/", "");
    const lineOf = (index: number) => source.slice(0, index).split("\n").length;

    for (const m of source.matchAll(/className=/g)) {
      const after = m.index + m[0].length;
      if (source[after] === '"') {
        const close = source.indexOf('"', after + 1);
        const value = source.slice(after + 1, close).trim();
        if (value) found.push({ file, line: lineOf(after), value });
        continue;
      }
      if (source[after] !== "{") continue;
      const expression = source.slice(after, closeBrace(source, after) + 1);
      for (const raw of literalsIn(expression)) {
        const value = raw.trim();
        if (value && LOOKS_LIKE_UTILITY.test(value)) {
          found.push({ file, line: lineOf(after), value });
        }
      }
    }
  }
  return found;
};

/**
 * Colour namespaces the shipped stylesheet can actually generate utilities for.
 *
 * `src/styles/tokens.css` is what a consumer imports, and its `@theme` block is
 * the whole list. Anything else is a class that reaches `dist/shared/*.js` with
 * no rule in `dist/styles.css` — which paints nothing and is invisible to every
 * other gate here: the DOM has the class, the stylesheet has no declaration,
 * and nothing compares the two. Table's loading shimmer shipped that way, as a
 * gradient on `--fg` from the marketing surface, until ADR 007 §4.
 */
const SHIPPED_COLOURS = new Set(
  [...readFileSync("src/styles/tokens.css", "utf8").matchAll(/--color-([\w-]+):/g)].map((m) => m[1]),
);

/** Tailwind's own palette and keywords, which it generates without a theme. */
const BUILTIN_COLOUR =
  /^(inherit|current|transparent|black|white|none|auto)$|^(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}$/;

/**
 * The same prefixes carry sizes, alignments and line styles: `text-center`,
 * `border-2`, `shadow-lg`, `to-90%`. Listed rather than inferred, so a word
 * this does not know fails loudly instead of being read as a colour — or, worse,
 * a colour namespace being read as a keyword.
 */
const NOT_A_COLOUR =
  /^(\d|\[|linear-|radial|conic|gradient-|xs$|sm$|md$|lg$|xl$|\dxl$|left$|center$|right$|justify$|start$|end$|top$|bottom$|middle$|wrap$|nowrap$|balance$|pretty$|ellipsis$|clip$|solid$|dashed$|dotted$|double$|hidden$|collapse$|separate$|inset$|offset$|x$|y$|t$|r$|b$|l$|s$|e$|wavy$|line$|base$|through$|box$)/;

/** A Tailwind palette colour written as a class: `bg-gray-200`, `via-gray-300`. */
const RAW_PALETTE_CLASS =
  /^(bg|text|border|from|via|to|ring|shadow|fill|stroke|placeholder|divide|outline|caret|decoration)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}(\/.*)?$/;

/** Utilities whose value is a colour rather than a size or a keyword. */
const COLOUR_UTILITY =
  /^(bg|text|border|from|via|to|ring|shadow|fill|stroke|placeholder|divide|outline|caret|accent|decoration)-(.+)$/;

/** Every colour namespace a class string reaches for, with where it was written. */
/** True when a class token reaches for a colour the package cannot generate. */
export const unshippedColour = (token: string): boolean => {
  const utility = token.split(":").pop() ?? "";
  const parts = COLOUR_UTILITY.exec(utility);
  if (!parts) return false;
  // `bg-white/10`, `from-fg/[0.06]`, `text-cl-text-chrome`
  const value = parts[2].replace(/\/.*$/, "").replace(/\[.*$/, "");
  if (!value || BUILTIN_COLOUR.test(value) || NOT_A_COLOUR.test(value)) return false;
  return !SHIPPED_COLOURS.has(value);
};

/**
 * Every class-shaped literal in the shipped source, not only the ones at a
 * `className=` site: the shimmer that shipped painting nothing was a value in a
 * constants object, which a className-scoped scan would never have read.
 */
const colourNamespaces = (): Finding[] => {
  const found: Finding[] = [];
  for (const path of Object.keys(sources)) {
    if (NOT_SHIPPED.test(path)) continue;
    const file = path.replace("../../components/", "");
    for (const raw of fileLiterals(path.replace("../../", "src/"))) {
      for (const token of raw.trim().split(/\s+/)) {
        if (token && unshippedColour(token)) found.push({ file, line: 0, value: token });
      }
    }
  }
  return found;
};

/**
 * A class token repeated inside one string.
 *
 * Harmless to the browser and a reliable sign that two passes edited the same
 * string: `"… transition-colors cursor-pointer cursor-pointer"` reached a diff
 * on this branch because one applier appended its class twice in a single
 * operation, and four components carried it before anyone looked. Nothing else
 * would have caught it — it changes no computed style, so no visual baseline
 * moves and no contrast reading shifts. It is cheap to check and it dates the
 * edit that caused it.
 */
const duplicateTokens = (): string[] => {
  const found: string[] = [];
  for (const [path, source] of Object.entries({ ...sources, ...constantSources })) {
    if (NOT_SHIPPED.test(path)) continue;
    const file = path.replace("../../components/", "");
    for (const literal of literalsIn(source)) {
      const tokens = literal.split(/\s+/).filter(Boolean);
      if (tokens.length < 2) continue;
      // Class strings only. Prose in a comment or a JSDoc line repeats words
      // constantly and is not what this is about.
      if (!tokens.every((t) => LOOKS_LIKE_UTILITY.test(t) || /^[a-z][a-z0-9:[\]/.,%()#-]*$/.test(t))) continue;
      const counts = new Map<string, number>();
      for (const t of tokens) counts.set(t, (counts.get(t) ?? 0) + 1);
      for (const [token, n] of counts) {
        if (n > 1) found.push(`${file}: "${token}" appears ${n} times in one class string`);
      }
    }
  }
  return [...new Set(found)];
};

describe("constants contract", () => {
  const findings = scan();

  it("repeats no class token inside one string", () => {
    expect(duplicateTokens(), "the same class applied twice to one element").toEqual([]);
  });

  it("notices a planted double", () => {
    // The check reads real source, so the plant is a literal put through the
    // same splitter rather than a file written to disk.
    const planted = "flex items-center gap-2 cursor-pointer cursor-pointer";
    const counts = new Map<string, number>();
    for (const t of planted.split(/\s+/)) counts.set(t, (counts.get(t) ?? 0) + 1);
    expect([...counts.entries()].filter(([, n]) => n > 1)).toEqual([["cursor-pointer", 2]]);
    // and the real scan is clean, so the two together mean something
    expect(duplicateTokens()).toEqual([]);
  });

  it("reads component source", () => {
    // A broken glob would make every assertion below vacuously pass.
    expect(Object.keys(sources).length).toBeGreaterThan(50);
  });

  it("introduces no literal className at a new call site", () => {
    const counts = new Map<string, number>();
    for (const { file } of findings) {
      counts.set(file, (counts.get(file) ?? 0) + 1);
    }

    const regressions: string[] = [];
    for (const [file, count] of counts) {
      const allowed = BASELINE[file] ?? 0;
      if (count > allowed) {
        const examples = findings
          .filter((f) => f.file === file)
          .slice(0, 3)
          .map((f) => `${f.file}:${f.line} "${f.value}"`);
        regressions.push(
          `${file}: ${count} literal(s), baseline ${allowed}\n      ${examples.join("\n      ")}`,
        );
      }
    }

    expect(
      regressions,
      `Class strings must live in a constants file, not at the call site.\n` +
        `Move each into its component's *_CLASSES under the right key and\n` +
        `render it through mergedClasses, then lower the baseline.\n\n` +
        regressions.join("\n"),
    ).toEqual([]);
  });

  it("keeps the baseline honest", () => {
    // A baseline entry that no longer matches reality is stale: either the file
    // was cleaned up (lower it) or renamed (remove it). Left alone it silently
    // buys headroom for a future regression.
    const counts = new Map<string, number>();
    for (const { file } of findings) {
      counts.set(file, (counts.get(file) ?? 0) + 1);
    }

    const stale = Object.entries(BASELINE)
      .filter(([file, allowed]) => (counts.get(file) ?? 0) < allowed)
      .map(([file, allowed]) => `${file}: baseline ${allowed}, actual ${counts.get(file) ?? 0}`);

    expect(
      stale,
      `Baseline entries are above actual — ratchet them down:\n${stale.join("\n")}`,
    ).toEqual([]);
  });

  it("names no colour the shipped stylesheet cannot generate", () => {
    // Self-check first: the rule has to be able to see the shape it exists for.
    // The shimmer exactly as it shipped, and the utilities beside it that must
    // not be faulted.
    const shimmer =
      "h-full w-full bg-linear-to-r rounded animate-pulse from-fg/[0.06] dark:from-fg/[0.10] " +
      "via-fg/[0.06] text-center text-sm border-2 bg-cl-bg-item-hover text-cl-text-chrome " +
      // `border-box` is a `box-sizing` VALUE, not a class. It parses as the
      // `border-` colour utility with a namespace of `box` and was faulted as
      // an unshippable colour; the same shape reaches this scan from any
      // `boxSizing` in a style object.
      "border-box";
    expect(
      shimmer.split(/\s+/).filter(unshippedColour),
      "the namespace check cannot see a marketing-namespace class, or faults a real one",
    ).toEqual(["from-fg/[0.06]", "dark:from-fg/[0.10]", "via-fg/[0.06]"]);

    const orphans = colourNamespaces();
    expect(
      [...new Set(orphans.map((f) => `${f.file} ${f.value}`))],
      "this colour namespace is not in the `@theme` block of src/styles/tokens.css, so the " +
        "class ships in the JS and no rule for it exists in the CSS — it paints nothing",
    ).toEqual([]);
  });

  it("introduces no new raw-palette colour", () => {
    // The singleton form of the `dark:` defect. ADR 006 retired 44 raw-palette
    // PAIRS; these have no `dark:` counterpart, so nothing counted them — a
    // fixed grey that cannot follow the theme, which is what the comment in
    // Table's own constants file says about the two it already replaced.
    // Every one is a shimmer surface, and only one of the five components has a
    // fixture that renders it: `bg-gray-200` reaches the DOM through Avatar's
    // loading state and nowhere else, and Table's shimmer is reached by no
    // fixture at all. Ratchets DOWN only.
    const DECLARED_RAW = 13;
    const found = Object.entries(sources)
      .filter(([path]) => !NOT_SHIPPED.test(path))
      .flatMap(([path]) =>
        fileLiterals(path.replace("../../", "src/")).flatMap((raw) =>
          raw
            .split(/\s+/)
            .filter((token) => RAW_PALETTE_CLASS.test(token.split(":").pop() ?? ""))
            .map((token) => `${path.replace("../../components/", "")} ${token}`),
        ),
      );
    expect(
      found.length,
      `raw palette classes in shipped source — ratchet, may fall only:\n${found.join("\n")}`,
    ).toBeLessThanOrEqual(DECLARED_RAW);
  });

  it("allows no structural utility at a call site, at any baseline", () => {
    // The hard half of the rule. A decorative literal is untidy; a structural
    // one is the ADR 001 defect itself — `unstyled` cannot strip what it cannot
    // see, and neither can `classes`.
    const structural = findings.filter(({ value }) =>
      value.split(/\s+/).some((token) => token && isStructural(token)),
    );

    // Recorded separately from BASELINE so the two ratchets move independently:
    // a decorative literal is untidy, a structural one is a latent defect, and
    // the second number is the one worth driving to zero first.
    expect(
      structural.length,
      structural
        .slice(0, 5)
        .map((f) => `${f.file}:${f.line} "${f.value}"`)
        .join("\n"),
    ).toBeLessThanOrEqual(STRUCTURAL_BASELINE);
  });
});

/**
 * Literal class strings at call sites that carry a structural utility. Every
 * one is a latent ADR 001 violation; the six that actually reached the DOM were
 * fixed in this branch, and this number must only fall.
 */
/**
 * CORRECTED in Task 3c, from 92. Not a relaxation: the scanner was a single-line
 * regex, so a className that wrapped was invisible and comments inside one were
 * read as class strings. 59 of these were always here and could not be seen.
 * They are the ADR 001 defect the hard gate exists to catch, and the number to
 * drive down first.
 */
const STRUCTURAL_BASELINE = 132;
