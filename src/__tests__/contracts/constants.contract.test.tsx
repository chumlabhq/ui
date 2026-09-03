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
import { isStructural } from "../../utils/classLayers";

import { setReducedMotion } from "../../test/matchMedia";

// Fixtures render motion-aware components; the stub answers nothing
// until asked. reduced-motion.contract is where the true branch is tested.
beforeEach(() => setReducedMotion(false));

const sources = import.meta.glob("../../components/**/*.tsx", {
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
  "Avatar/components/AvatarShimmer.tsx": 1,
  "CascadingDropdown/CascadingDropdown.tsx": 9,
  "Checkbox/Checkbox.tsx": 1,
  "CountryFlag/components/CountryFlagGroup.tsx": 1,
  "CountryFlag/components/CountryFlagShimmer.tsx": 1,
  "DatePicker/DatePicker.tsx": 22,
  "Drawer/Drawer.tsx": 8,
  "Input/Input.tsx": 1,
  "InternationalPhoneInput/InternationalPhoneInput.tsx": 1,
  "Loader/CircularLoader.tsx": 0,
  "Modal/Modal.tsx": 5,
  "MultiSelectDropdown/MultiSelectDropdown.tsx": 3,
  "MultiSelectDropdown/components/MultiSelectDropdownOption.tsx": 1,
  "MultiSelectDropdown/components/MultiSelectDropdownShimmer.tsx": 0,
  "MultiSelectDropdown/components/SelectedChip.tsx": 2,
  "MultiSelectSearchableDropdown/MultiSelectSearchableDropdown.tsx": 6,
  "OtpInput/OtpInput.tsx": 2,
  "Pagination/Pagination.tsx": 1,
  "RadioButton/RadioButton.tsx": 6,
  "ResizablePanel/ResizablePanel.tsx": 7,
  "SearchableDropdown/components/SearchableDropdownOption.tsx": 1,
  "Stepper/Stepper.tsx": 9,
  "Switch/Switch.tsx": 1,
  "Table/Table.tsx": 72,
  "Table/icons.tsx": 2,
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

describe("constants contract", () => {
  const findings = scan();

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
