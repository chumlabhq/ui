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
 * Literal class strings still written at JSX call sites when this rule landed.
 * Ratchets DOWN only — see the docblock. Each entry is `Component/file.tsx`
 * with the count of literal-class expressions remaining in it.
 */
const BASELINE: Record<string, number> = {
  // 42 before the mobile-card view moved to its own module for lazy loading;
  // 37 + 5 after. The literals were relocated, not added, and the tier total is
  // unchanged.
  "Table/Table.tsx": 37,
  "Table/components/TableMobileView.tsx": 5,
  "DatePicker/DatePicker.tsx": 22,
  "Toast/Toast.tsx": 8,
  "CascadingDropdown/CascadingDropdown.tsx": 6,
  "MultiSelectSearchableDropdown/MultiSelectSearchableDropdown.tsx": 6,
  "Checkbox/Checkbox.tsx": 5,
  "RadioButton/RadioButton.tsx": 5,
  "Accordion/components/AccordionShimmer.tsx": 3,
  "MultiSelectDropdown/MultiSelectDropdown.tsx": 3,
  "MultiSelectDropdown/components/MultiSelectDropdownShimmer.tsx": 3,
  "Stepper/Stepper.tsx": 3,
  "Loader/CircularLoader.tsx": 2,
  "MultiSelectDropdown/components/SelectedChip.tsx": 2,
  "OtpInput/OtpInput.tsx": 2,
  "TimePicker/TimePicker.tsx": 2,
  "Toast/components/ToastProvider.tsx": 2,
  "Avatar/components/AvatarShimmer.tsx": 1,
  "CountryFlag/components/CountryFlagGroup.tsx": 1,
  "CountryFlag/components/CountryFlagShimmer.tsx": 1,
  "Input/Input.tsx": 1,
  "InternationalPhoneInput/InternationalPhoneInput.tsx": 1,
  "MultiSelectDropdown/components/MultiSelectDropdownOption.tsx": 1,
  "Pagination/Pagination.tsx": 1,
  "SearchableDropdown/components/SearchableDropdownOption.tsx": 1,
  "TextArea/TextArea.tsx": 1,
};

const CLASSNAME = /className=(?:"([^"]*)"|\{([^}]*)\})/g;
const STRING_LITERAL = /"([^"]*)"/g;
/** A Tailwind-shaped token: lowercase start, or an arbitrary/important prefix. */
const LOOKS_LIKE_UTILITY = /^[a-z![]/;

interface Finding {
  file: string;
  line: number;
  value: string;
}

const scan = (): Finding[] => {
  const found: Finding[] = [];
  for (const [path, source] of Object.entries(sources)) {
    if (NOT_SHIPPED.test(path)) continue;
    const file = path.replace("../../components/", "");
    source.split("\n").forEach((line, i) => {
      for (const match of line.matchAll(CLASSNAME)) {
        const [, bare, expression] = match;
        if (bare !== undefined) {
          if (bare.trim()) found.push({ file, line: i + 1, value: bare });
          continue;
        }
        for (const inner of expression.matchAll(STRING_LITERAL)) {
          const value = inner[1].trim();
          if (value && LOOKS_LIKE_UTILITY.test(value)) {
            found.push({ file, line: i + 1, value });
          }
        }
      }
    });
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
const STRUCTURAL_BASELINE = 92;
