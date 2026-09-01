# Gate Honesty Audit — @chumlab/ui

Branch `audit/gate-honesty`. Read-only. No source, test or config changes.

**Question asked:** which greens are earned, and which are environmental or tautological?

**Method.** Every `PASS` in `ai/system-state.json` traced to the artefact that produced it;
an AST pass over all 47 unit test files, 20 e2e specs and the 5 contract suites; a runtime
probe of all 495 `classes` keys (created, run, deleted — the tree is unchanged); and static
tracing of cross-component nesting and README claims.

**Markers:** `untrustworthy-gate` (records a PASS it did not earn) · `unfalsifiable-test`
(cannot fail) · `untested-claim` (true but unverified) · `false-claim` (contradicted by
source).

**Headline.** The six known cases were not a cluster; they were a sample. The dominant
pattern across all five sections is the same: **an assertion whose subject may not exist,
and which passes silently when it doesn't.** That covers 213 unrendered `classes` keys, 20
existence-guarded e2e assertions, 18 tests with no assertion at all, and 3 negative
assertions naming classes the library has never emitted.

---

## 1. Recorded PASSes in `ai/system-state.json`

47 fields hold a `PASS`. Grouped by what actually produced them.

### 1.1 Every dist-reading gate is currently reading a four-month-old artifact — `untrustworthy-gate`

`dist/index.js` was built **2026-08-04 13:45**. **94 source files under `src/` are newer
than it**, including every change from both remediation phases.

Four records were written against that build:

| Record | Claim |
| --- | --- |
| `ai/system-state.json:868` (`validation.build`) | "dist/ built; gzip 695kB … 2026-04-28T00:17:35Z" |
| `ai/system-state.json:861` (`validation.performance`) | "DatePicker 10.25KB ≤ 12KB date-class hard-fail" |
| `ai/system-state.json:183` | "dist/shared/DatePicker-D7SQLxwx.cjs 35.04 KB / gzip: 10.25 KB" |
| `ai/system-state.json:867` (`validation.npmAudit`) | "npm pack ships 373 files at 371.8KB gzipped" |

The three assert scripts themselves are structurally sound — `package.json:319`
(`postbuild:lib`) chains them immediately after `build:lib`, so they cannot run against a
stale dist. The defect is that **nothing detects the drift between runs**: the recorded
values outlive the artifact they measured, and `04-validate.md` reads the record, not the
filesystem. `AUDIT-GAP.md` §7.2 already showed the DatePicker chunk had grown to 12.63 kb —
past its hard fail — while the record still said 10.25.

### 1.2 `validation.tests` records a count that no longer exists — `untrustworthy-gate`

`ai/system-state.json:—` (`validation.tests`): *"PASS - 2992/2992 (45 files)"*.
Actual today: **3307 passed, 40 skipped, 56 files**. The record has drifted by 11 files and
315 assertions and would still read PASS if the suite had shrunk instead of grown, because
nothing compares the recorded number to a fresh run.

Same shape at `validation.step04Cycle3.checks.tests` — *"PASS (2992/2992 pass + 0 skipped
+ coverage 65.88%)"*. There are now 40 skipped tests (§2.6), so "0 skipped" is false as
written, and the 65.88% coverage figure has not been re-measured since 2026-04-28.

### 1.3 `validation.accessibility: PASS` has no executable gate at all — `untrustworthy-gate`

The record reads *"PASS - all blockers and high issues fixed"*. Tracing it:

- **No `axe` assertion exists in any unit test.** `axe`, `jest-axe` and
  `toHaveNoViolations` appear zero times across all 47 unit test files.
- `axe-playwright` is installed and `checkA11y` does throw on violations, so those e2e
  tests do assert — but only **4 of 20 e2e specs** call it: `e2e/drawer.spec.ts`,
  `e2e/resizablepanel.spec.ts`, `e2e/tabpanel.spec.ts`, `e2e/switch.spec.ts`.
- Two of the four scope the audit to a single selector — `e2e/switch.spec.ts:196`
  (`'[role="switch"]'`) and `e2e/resizablepanel.spec.ts:208` (`"[role='separator']"`) — so
  everything else on the page is exempt.
- The one full-page audit, `e2e/tabpanel.spec.ts:311`, disables a rule:
  `"scrollable-region-focusable": { enabled: false }` (`:321`).

So a claim covering 30 components rests on 4 specs, 2 of them selector-scoped and 1
rule-limited. `AUDIT-GAP.md` §3.1 found DatePicker shipping `role="dialog"
aria-modal="true"` with no focus trap and zero `.focus()` calls in its entire directory —
DatePicker has no e2e spec at all, which is why nothing caught it.

### 1.4 `validation.responsive` claims six breakpoints; two are exercised — `untrustworthy-gate`

The record: *"coverage 100% (all 30 components verified at 6 breakpoints
320/375/768/1024/1440/1920)"*.

Every `setViewportSize` call across all 20 e2e specs uses one of exactly two widths:
`{ width: 1280, height: 720 }` and `{ width: 375, height: 667 }`. Playwright's device
presets add Pixel 5 (393px) and iPhone 12 (390px) via `playwright.config.ts:32,36`.
**320, 768, 1024, 1440 and 1920 are never set anywhere.** The narrowest width the suite
ever renders at is 375px — 55px wider than the claimed floor.

"Verified" here means a model looked at them, not that anything asserts them.

### 1.5 `validation.ssr: PASS - all issues fixed` — `untrustworthy-gate` (now partly earned)

Recorded before any SSR test existed: `react-dom/server` appeared in 0 of 47 unit test
files. `AUDIT-GAP.md` §2.1 then found `DatePicker.tsx:987` reading `document.body` during
render, reachable through the public `keepMounted` and `open` props — a crash that the PASS
had covered for four months.

`src/__tests__/contracts/ssr.contract.test.tsx` now backs this, and deliberately runs under
`environment: "node"` (`:2`) rather than jsdom — under jsdom `document` exists and the gate
would still be green on a lie. The record itself has not been re-derived.

### 1.6 Records that are file-existence checks wearing a quality name — `untested-claim`

These are accurate about what they counted, and say more than they measured:

| Record | Counts | Does not check |
| --- | --- | --- |
| `validation.knowledge` | 31 `.ai.md` files exist | that any is accurate or current |
| `validation.schema` | 31 `.schema.json` files exist | that any matches its component's props |
| `validation.demos` | 30 `<Name>Demo.tsx` files exist | that any renders |
| `validation.aiIndex` | `component-index.json` regenerated | that its `props` arrays match source |
| `validation.semanticText` | `semantic-text.json` regenerated | content |
| `validation.brand` | canonical strings used | — |
| `validation.readme` | README present, 329 lines | any claim inside it (see §5) |

`ai/component-index.json` is the concrete risk: it was generated **2026-04-28** and the
contract tier now iterates it (`src/__tests__/contracts/registry.ts:26`). Its `props`
arrays already omit `unstyled` for `Loader` and `RadioButton` — both of which do accept it.
Any component added since is invisible to all five contract suites.

### 1.7 Records that are genuinely earned — no marker

`validation.typescript` (`tsc --noEmit`, re-verified clean), `validation.lint` (`eslint .`,
clean), `validation.build`'s compile half, `validation.security` (npm audit + a real
`dangerouslySetInnerHTML` count), `validation.changelog`, `validation.publishDryRun`
(`npm pack --dry-run`). These trace to a command that fails when the claim is false.

---

## 2. Assertions that cannot fail

AST pass over all 47 unit test files, 20 e2e specs, 5 contract suites.

### 2.1 Tests with zero `expect` — `unfalsifiable-test`

**18 found.** Three are false positives: `e2e/resizablepanel.spec.ts:205`,
`e2e/switch.spec.ts:191` and `e2e/tabpanel.spec.ts:311` assert through `checkA11y`, which
throws. The remaining **15 assert nothing by any mechanism**:

| Location | Test name |
| --- | --- |
| `src/components/InternationalPhoneInput/__tests__/InternationalPhoneInput.test.tsx:324` | "detects and parses international numbers when pasted" |
| `src/components/InternationalPhoneInput/__tests__/InternationalPhoneInput.test.tsx:398` | "calls onCountryChange when country is changed" |
| `src/components/MultiSelectDropdown/__tests__/MultiSelectDropdown.test.tsx:398` | "calls stopPropagation on keyboard events" |
| `src/components/Table/__tests__/Table.test.tsx:1164` | "filters data when a filter option is selected" |
| `src/components/Table/__tests__/Table.test.tsx:1247` | "renders mobile cards when renderMobileCard is provided and mobileBreakpoint met" |
| `src/components/Table/__tests__/Table.test.tsx:1875` | "renders mobile cards with onContextMenu when mobileBreakpoint is exceeded" |
| `e2e/avatar.spec.ts:129` | "should handle avatar click in group" |
| `e2e/button.spec.ts:58, :66, :74, :84` | "should activate button on Enter/Space key" (×4) |
| `e2e/input.spec.ts:215, :227` | "should activate icon buttons with Enter/Space key" |
| `e2e/textarea.spec.ts:219, :231` | "should activate icon buttons with Enter/Space key" |

The unit ones are the more misleading: each sets up `vi.fn()` spies, dispatches the event,
and then states the expectation **in a comment**.
`InternationalPhoneInput.test.tsx:346-347` ends with

```
// Should have detected the country from the paste
// The paste handler parses the international number
```

and nothing else — three spies created, none asserted. `MultiSelectDropdown.test.tsx:417`
is the same shape: *"// onRemove is called via React synthetic events, but stopPropagation
…"*.

The e2e ones state it in the test body: `e2e/button.spec.ts:62` — `// Press Enter - should
not throw`. A Playwright `keyboard.press` on a focused button cannot throw regardless of
whether the button does anything, so four tests named "should activate button on Enter/Space
key" verify only that the page is still alive.

### 2.2 Assertions behind an existence guard — `unfalsifiable-test`

**20 sites, 19 of them in one file.** `e2e/avatar.spec.ts` has 26 tests; **19 wrap their
assertions in `if (await X.count() > 0)`**, so each passes when the element it is testing is
absent — which is precisely the failure it exists to catch.

`e2e/avatar.spec.ts:37, :50, :60, :75, :89, :106, :120, :135, :148, :157, :166` and 8 more.
Also `e2e/pagination.spec.ts:446` (`if (await ellipsis.count() > 0)`).

Two are doubly conditional — `e2e/input.spec.ts:215` and `e2e/avatar.spec.ts:129` combine an
existence guard with having no `expect` at all.

One unit instance: `src/components/Slider/__tests__/Slider.test.tsx:887` —
`if (onValueChange.mock.calls.length > 0) { … }`. If the callback never fires, the test
passes.

### 2.3 Negative assertions naming classes the library never emits — `unfalsifiable-test`

`not.toContain` against a string that appears in **zero non-test files** of that component:

| Location | Assertion | Component actually uses |
| --- | --- | --- |
| `src/components/DatePicker/__tests__/DatePicker.test.tsx:544` | `not.toContain("border-gray-300")` | `border-cl-border-input` |
| `src/components/Tooltip/__tests__/Tooltip.test.tsx:1277` | `not.toContain("rounded-lg")` | `rounded-cl-md` |
| `src/components/Accordion/__tests__/Accordion.test.tsx:1703` | `not.toHaveClass("rounded-lg")` | `rounded-cl-md` |

The DatePicker one matters most: it is the **only** class assertion in a test named
*"renders in unstyled mode without default classes"*, so that test's stated purpose is
entirely unverified. The other two sit beside real assertions (`bg-white` at
`Tooltip.test.tsx:1278`, `border` / `space-y-2` at `Accordion.test.tsx:1701-1702`), so those
tests are half-vacuous rather than wholly.

Checked and cleared: `Avatar.test.tsx:675` `not.toContain("bg-gray-200")` is real —
`bg-gray-200` appears in 2 non-test Avatar files. `Input.test.tsx:642`,
`Checkbox.test.tsx:516`, `Switch.test.tsx:539` and `Drawer.test.tsx:777` name
consumer-supplied sentinels, which is the correct way to assert an override displaced a
default.

### 2.4 Orphaned snapshot artifacts — `untrustworthy-gate`

`grep` for `toHaveScreenshot`, `toMatchSnapshot` and `toMatchFileSnapshot` across `src/` and
`e2e/` returns **0 results**, yet `e2e/accordion.spec.ts-snapshots/` holds **10 PNG
baselines**. No assertion references any of them.

`e2e/accordion.spec.ts:534` declares `test.describe("Visual Regression", …)`; its single
test asserts only that a bounding box exists with non-zero width and height (`:542-546`).
A component rendered entirely without styles passes it.

### 2.5 Self-constructed subjects — mostly sound, one not

Twelve `expect(<literal>)` sites. Eleven are legitimate membership assertions of the shape
`expect(["ascending","descending"]).toContain(actual)` — reads backwards, but the runtime
value is the argument. They are **weak** rather than unfalsifiable: they pass for either
value and so cannot detect a wrong-but-valid state (`e2e/accordion.spec.ts:38, :160, :530`,
`e2e/avatar.spec.ts:366, :387`, `e2e/pagination.spec.ts:491`, `e2e/switch.spec.ts:261`,
`e2e/tabpanel.spec.ts:275`, `e2e/toast.spec.ts:325`,
`src/components/Table/__tests__/Table.test.tsx:211`,
`src/components/TimePicker/__tests__/TimePicker.test.tsx:1638`).

One is not: `e2e/checkbox.spec.ts:129` — `expect(true).toBe(…)`. — `unfalsifiable-test`

### 2.6 Clean

Zero `.only` and zero `.skip` / `xit` / `xdescribe` anywhere. Zero `try`/`catch` blocks
swallowing an assertion. No unawaited promise in an assertion position (the 7 flagged lines
are event-listener registrations and `page.evaluate` callback bodies, all correct).

The 40 skipped tests in the contracts run are `it.runIf` in
`src/__tests__/contracts/ssr.contract.test.tsx:37,43` — 2 per component × the 20 components
whose index entry declares neither `open` nor `keepMounted`. Correct conditional
execution, but it reports as "40 skipped", which reads like disabled tests.

---

## 3. `classes` keys no test has ever rendered

Measured by rendering every component with **every** key overridden to a unique sentinel
and recording which sentinels never reach the DOM, then removing any key named anywhere in
any test file.

**377 of 495 keys (76%) never render under the contract tier's props.**
**213 of 495 (43%) never render there AND are never named in any of the 47 unit test files,
20 e2e specs or 5 contract suites.**

This is the hole the current `overrides.contract` formulation leaves open by design. Stating
the guarantee as a negative — *override a key, assert its default is gone* — made it sound
(`docs/adr/001-unstyled-contract.md`, Task-4 addendum), and the cost is that a slot which
never renders passes trivially. For 213 keys, that is every run.

| Component | Keys never rendered by any test |
| --- | --- |
| Table (34) | `checkboxCell` `dragHandle` `editInput` `expandIcon` `expandedRow` `filterDropdown` `filterIcon` `groupHeader` `headerCellContent` `headerCellHover` `headerRow` `loadingMore` `mobileCard` `pinButton` `pinIcon` `pinIconHover` `pinnedContainer` `pinnedPinButton` `pinnedPinIcon` `pinnedPinIconHover` `pinnedRightContainer` `pinnedRightTable` `pinnedTable` `resizeHandle` `searchBar` `searchInput` `selectedRow` `shimmer` `shimmerBar` `shimmerCell` `shimmerRow` `sortIcon` `unpinnedContainer` `unpinnedTable` |
| DatePicker (30) | `clearButton` `day` `dayDisabled` `dayFocused` `dayHover` `dayMarked` `dayOutside` `dayRangeEnd` `dayRangeMiddle` `dayRangeStart` `daySelected` `dayToday` `dropdownItem` `dropdownItemSelected` `dropdownMenu` `markerIndicator` `markerTooltip` `monthDropdown` `monthGrid` `monthNav` `monthSelect` `navButton` `navButtonDisabled` `presetActive` `presetButton` `todayButton` `weekday` `weekdayHeader` `yearDropdown` `yearSelect` |
| CascadingDropdown (24) | `checkIcon` `checkboxChecked` `clearIcon` `menuItem` `menuItemDisabled` `menuItemFocused` `menuItemSelected` `noResults` `optionDisabled` `optionFocused` `optionSelected` `searchIcon` `searchInput` `searchInputElement` `shimmer` `shimmerItem` `submenuChevron` `submenuContainer` `submenuItem` `submenuItemFocused` `submenuItemSelected` `submenuSearchIcon` `submenuSearchInput` `submenuSearchInputElement` |
| Stepper (22) | `connector` `connectorActive` `connectorCompleted` `connectorError` `connectorHorizontal` `connectorPending` `connectorVertical` `descriptionActive` `descriptionCompleted` `descriptionError` `descriptionPending` `indicatorButton` `indicatorCompleted` `indicatorError` `indicatorIcon` `indicatorPending` `labelCompleted` `labelError` `labelPending` `labelWrapperBottom` `stepContainerVertical` `stepDisabled` |
| MultiSelectSearchableDropdown (16) | `checkboxChecked` `checkboxIcon` `chip` `chipRemove` `clearIcon` `moreCount` `noResults` `optionDisabled` `optionFocused` `optionList` `optionSelected` `searchIcon` `searchInput` `searchInputElement` `shimmer` `shimmerItem` |
| MultiSelectDropdown (13) | `checkboxChecked` `checkboxIcon` `chip` `chipRemove` `clearIcon` `moreCount` `noResults` `optionDisabled` `optionFocused` `optionList` `optionSelected` `shimmer` `shimmerItem` |
| SearchableDropdown (12) | `checkIcon` `clearIcon` `noResults` `optionDisabled` `optionFocused` `optionList` `optionSelected` `searchIcon` `searchInput` `searchInputElement` `shimmer` `shimmerItem` |
| Dropdown (9) | `checkIcon` `clearIcon` `noResults` `optionDisabled` `optionFocused` `optionList` `optionSelected` `shimmer` `shimmerItem` |
| Accordion (7) | `contentInner` `contentWrapper` `iconWrapper` `subtitle` `triggerInner` `triggerLeft` `triggerRight` |
| TabPanel (7) | `countActive` `countInactive` `iconActive` `iconInactive` `labelInactive` `tabDisabled` `tabInactive` |
| Slider (6) | `mark` `markDot` `markDotActive` `markLabel` `thumbActive` `thumbDisabled` |
| TimePicker (6) | `clearIcon` `noResults` `optionFocused` `optionList` `optionSelected` `selectedIcon` |
| Pagination (5) | `dropdownIcon` `selectorButton` `selectorDropdown` `selectorDropdownWrapper` `selectorOption` |
| Switch (5) | `checkedThumb` `checkedTracker` `disabledLabel` `disabledTracker` `labelContainer` |
| Breadcrumb (4) | `dropdownItem` `dropdownItemDisabled` `ellipsisButton` `itemDisabled` |
| InternationalPhoneInput (3) | `countryOptionFlag` `countryOptionLabel` `countryOptionRow` |
| Modal (3) | `closeButton` `closeIcon` `title` |
| Avatar (2) | `image` `initials` |
| Button (2) | `endIcon` `startIcon` |
| Checkbox (1) | `labelContainer` |
| CountryFlag (1) | `image` |
| Tooltip (1) | `baseArrow` |

Marked `untested-claim`: every one of these is a documented, typed, publicly exported
`classes` key that the library promises will replace its default, and nothing anywhere
demonstrates that it does.

Three clusters are worth separating because they are the *most* likely to be wrong:

- **Open-state slots** (`optionList`, `optionSelected`, `noResults`, `menuItem*`,
  `submenu*`) — 90-odd keys across the six dropdown-family components, none reachable
  without opening the menu, which no contract suite does.
- **Shimmer slots** (`shimmer`, `shimmerItem`, `shimmerBar`, `shimmerCell`, `shimmerRow`) —
  need `loading`, which no suite passes.
- **The three keys added in phase 2** — `countryOptionFlag`, `countryOptionLabel`,
  `countryOptionRow` on IPI, plus `stepContainerVertical` on Stepper — were introduced by
  the very sweep meant to fix this category and arrived untested.

---

## 4. `unstyled` / `classes` propagation to nested components

Seven nesting sites across the library, from three real cross-component imports
(`CountryFlag/components/CountryFlagGroup.tsx:12`,
`Avatar/components/AvatarGroupCount.tsx:3`, `Breadcrumb/Breadcrumb.tsx:23`) plus
`InternationalPhoneInput.tsx:35-36` and `Button/Button.tsx:16`.

| Site | Nested | `unstyled` | `classes` |
| --- | --- | --- | --- |
| `InternationalPhoneInput/InternationalPhoneInput.tsx:304, :320` | CountryFlag | **yes** (phase 2) | no |
| `InternationalPhoneInput/InternationalPhoneInput.tsx:619` | SearchableDropdown | **no** | partial — maps its own `countrySelect*` keys |
| `Avatar/components/AvatarGroupCount.tsx:103` | Tooltip | **no** | partial — `content` only |
| `CountryFlag/components/CountryFlagGroup.tsx:172` | Tooltip | **no** | partial — `content` only |
| `Breadcrumb/Breadcrumb.tsx:129` | Tooltip | **no** | **no** |
| `Breadcrumb/Breadcrumb.tsx:582` | Tooltip | **no** | **no** |
| `Breadcrumb/Breadcrumb.tsx:681` | Tooltip | **no** | **no** |
| `Button/Button.tsx:91` | CircularLoader | **no** | **no** |

**Six of seven do not propagate `unstyled`.** — `untrustworthy-gate`

The IPI→CountryFlag fix in phase 2 was found by accident: `unstyled.contract` flagged
`border border-cl-border` surviving on IPI, and the token happened to be one IPI's *own*
defaults also declare, so the suite attributed it to IPI. **The other six are invisible to
that suite** — Tooltip and CircularLoader contribute tokens their parent does not declare,
so no assertion in the tier looks for them. `<Button loading unstyled>` still renders a
fully-styled spinner; `<Breadcrumb unstyled>` with tooltips still renders styled tooltips.

`classes` is worse: no site forwards the parent's `classes` map, so a consumer cannot reach
a nested component's slots at all. `AUDIT-GAP.md` §5 recorded this shape for
Pagination/DatePicker, which *reimplement* rather than compose; these six *do* compose and
still cannot be reached through.

---

## 5. README claims with no gate

### 5.1 "44px+ touch targets" (`README.md:300`) — `false-claim`

`h-11` (2.75rem = 44px) appears in **zero shipped component constants**. Its only three
occurrences are `src/components/ui/Button.tsx:66,73` and `src/components/SiteFooter.tsx:99`
— both excluded from the package by `vite.config.ts:10` (`EXCLUDED_COMPONENTS`) and by not
being a component directory.

Interactive defaults measured from the constants files:

| Control | Default | Height |
| --- | --- | --- |
| `InternationalPhoneInput` input / country trigger | `h-10` (`constants.ts:344, :357`) | 40px |
| `Breadcrumb` ellipsis button | `w-10 h-10` (`utils/constants.ts:14`) | 40px |
| `DatePicker` day cell | `w-10 h-10` (`constants.ts:24`) | 40px |
| `OtpInput` input | `w-10 h-10 sm:w-12 sm:h-12` (`utils/constants.ts:9`) | 40px, 48px ≥640px |
| `Dropdown` trigger | `px-3 py-2.5` + `text-sm` (`utils/constants.ts:6`) | ≈40px |
| `Stepper` icon indicator | `w-8 h-8 sm:w-10 sm:h-10` (`utils/constants.ts:63`) | 32px, 40px ≥640px |

Not one shipped interactive default reaches 44px, and `Stepper`'s is 32px at mobile widths —
where the guideline matters most. There is also no assertion anywhere: `44`, `min-h-11` and
`min-w-11` appear in zero test or spec files.

### 5.2 "prefers-reduced-motion support" for every component (`README.md:298`) — `false-claim`

`AUDIT-GAP.md` §3.7 established that 12 shipped components carry `transition-*` /
`animate-*` / `duration-*` with no reduced-motion path: Breadcrumb, CascadingDropdown,
Dropdown, Input, InternationalPhoneInput, MultiSelectDropdown,
MultiSelectSearchableDropdown, OtpInput, SearchableDropdown, Slider, Table, TextArea.
Unchanged on this branch.

The gate is one assertion: `prefers-reduced-motion` appears in **1 test file, 1 hit**, and
`src/test/setup.ts:29-40` mocks `matchMedia` to return `matches: false` unconditionally —
so under vitest the reduced-motion branch is never the one taken. Any component that
implements it correctly and any component that ignores it entirely produce identical test
output. — also `untrustworthy-gate`

### 5.3 "Responsive (320px+), mobile-first" (`README.md:77`) — `untested-claim`

Plausible and probably true — the constants use `sm:` prefixes throughout, which is
mobile-first by construction. But per §1.4, 320px is never rendered by anything. The
narrowest viewport in the suite is 375px.

### 5.4 "Tree-shakeable" (`README.md:81`) — partly gated, `untested-claim` for the rest

Genuinely gated, and well:

- `scripts/assert-flag-bundle.mjs:35-36` asserts no flag SVG payload is statically
  reachable from the CountryFlag entry.
- `scripts/assert-phone-bundle.mjs:1-2` asserts `libphonenumber-js` lives only in the
  opt-in `./phone-validators` chunk.
- `package.json:302` declares `sideEffects`, and 31 subpath exports exist.

Not gated: that importing one component does not pull in others. `AUDIT-GAP.md` §7.3
measured `@chumlab/ui/international-phone-input` at **29.23 kb gzipped**, of which 16.1 kb is
SearchableDropdown, Tooltip and CountryFlag. True in the narrow sense (subpaths work), and
the number a consumer pays is nearly 3× the record.

### 5.5 "WCAG 2.1 AA" (`README.md:294`) — `untested-claim`, and §1.3 for the gate

Covered above. Four e2e specs, two selector-scoped, one rule-limited; DatePicker's
`aria-modal` violation is in a component with no e2e spec at all.

---

## Summary

| Marker | Count | Where |
| --- | --- | --- |
| `untrustworthy-gate` | 8 | §1.1 §1.2 §1.3 §1.4 §1.5 §2.4 §4 §5.2 |
| `unfalsifiable-test` | 5 classes, 39 sites | §2.1 (15) §2.2 (20) §2.3 (3) §2.5 (1) |
| `untested-claim` | 4 + 213 keys | §1.6 §3 §5.3 §5.4 §5.5 |
| `false-claim` | 2 | §5.1 §5.2 |

**The one structural fix.** Every finding except §1.1 and §2.4 is the same bug wearing
different clothes: *an assertion that passes when its subject is absent*. The existence
guard, the missing `expect`, the never-emitted class name, the unrendered `classes` key, the
un-propagated `unstyled` — each is green because nothing was there to be wrong.

A gate that cannot distinguish "correct" from "absent" is not a gate. The cheapest general
remedy is to make absence loud: assert the subject exists **before** asserting anything
about it, and have `overrides.contract` fail on a key it could not render rather than skip
it — which converts §3's 213 silent passes into 213 explicit, rankable gaps.
