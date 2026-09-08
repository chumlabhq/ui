# Release readiness — `@chumlab/ui` 0.1.0

**Measured 2026-09-08.** Every number below was produced by a gate run on that date against
the tree at `refactor/v1-hardening`. Where a number was not re-measured, the text says so and
says why. Nothing here is carried forward on trust.

This is written for someone who has not followed the work and has to decide whether to trust
the package. It says what is claimed and what proves each claim, what is knowingly untrue or
ungated, what has never been tested at all, and what publishing commits us to.

**The package is not publishable today.** Every gate passes except the browser matrix, which
is red in three projects — and the same tree was green in all seven earlier the same day, with
nothing but a type declaration changed in `e2e/` since. §1.2 has the numbers and the two
readings they admit; §7 has what remains.

---

## 1. What was measured

### 1.1 Gates

| Gate | Verdict | Evidence |
| --- | --- | --- |
| `lint` | pass | 0 errors, 7 warnings — the standing baseline, unchanged |
| `typecheck` | pass | Both configs clean, each after rejecting its own planted error. `focusVisible` is declared in a local augmentation in `wcag-layout.spec.ts` rather than cast away at the call site: it is in the HTML standard and shipped in every engine here, and TypeScript's DOM lib simply has not caught up |
| `test:run` | pass | 92 files, 4749 collected, 4749 executed, 4681 passed, 68 skipped. Contracts 1577, unit 3172 |
| `test:coverage` | pass | 92.04% statements, 87.39% branch, 94.71% functions, 93.95% lines |
| `test:e2e:all` (7 projects) | **FAIL** | 2512 collected, 2512 executed, 2427 passed, 71 skipped, 14 non-passes across firefox (8), Mobile Chrome (4) and webkit (2). No project is waived any more (§3.6), so this is the aggregate verdict |
| `verify:consumers` | pass | 9 apps, 2 React majors, 4 frameworks, production builds; plus `publint` and `attw` as their own rows |
| `verify:consumers:self-check` | pass | 3 plants caught: a subpath export pointing at a missing file, `"use client"` stripped from 154 chunks, the token layer unwrapped |
| `verify:packaging` | pass | `publint --strict` clean; `attw` clean across node10, node16 and bundler over 32 entrypoints; 8 relative links across 4 shipped documents resolve inside the tarball |
| `verify:packaging:self-check` | pass | 4 plants caught |
| `verify:bundle-size` | pass **after a ratchet** | 30 entries, 4 declared breaches, library total 146.65 KB across 80 files. The gate failed first and named its own fix (§1.3) |
| `assert-bundle-size --self-check` | pass | 2 plants: shape derivation, and a 25.48 KB entry breaching a 6 KB ceiling |
| `verify:ssr-record` | pass | Every component's `ssr` verdict is what the consumer matrix measured, across `next-app`, `next-pages` and `react-router7`; 30 components, all safe |
| `verify:ssr-record:self-check` | pass | 4 plants caught |
| `verify:playground-removed` | pass | 0 hits for `/playground|chumlab\.ai/i` across the built site, no preview artefacts, and `/playground` and `/oauth/google` both answer the 404 page |
| `verify:playground-removed:self-check` | pass | 3 plants caught, against a synthetic tree the site build is not needed for |
| `build-tokens --check` | pass | `tokens.css` matches `src/index.css`, 35 dark and 35 light |
| `audit-demo-coverage --check` | pass | 1136 props, 0 tier-A gaps |
| `audit-fixture-gap --check` | pass | 151 props render unfixtured markup, of 648 with no fixture |
| `build-component-docs --check` | pass | 30 components, 60 snippets |
| `verify:dist-records` | pass **after re-measurement** | Four records describing `dist/` were re-measured and the fingerprint re-stamped (§1.4) |
| `npm publish --dry-run` | pass | 1661 files, 2.2 MB packed, 7.0 MB unpacked |
| `npm audit` (production tree) | pass | 0 vulnerabilities across the 3 production dependencies and their tree. The dev tree reports 12 (9 high, 1 moderate, 2 low); none of it ships |

The library build's own post-build asserts ran with it: the default phone entry is
libphonenumber-free, 250 per-flag chunks are emitted in each module format with no inlined
SVG, `styles.css` carries 484 rules with 471 utility selectors confined to the `cl-s` marker
and no preflight, and 1161 built files carry no fixture-harness code.

### 1.2 The browser matrix

```
  project        verdict  collected  executed  note
  a11y-full      pass     5          5         316s
  visual         pass     257        257       152s
  chromium       pass     450        450       259s
  firefox        FAIL     450        450       1 of 4 shard(s) did not pass
    └ 1/4        pass     113        113       283s
    └ 2/4        pass     113        113       173s
    └ 3/4        FAIL     112        112       8 test(s) did not pass
    └ 4/4        pass     112        112       125s
  webkit         FAIL     450        450       2 test(s) did not pass
  Mobile Chrome  FAIL     450        450       4 test(s) did not pass
  Mobile Safari  pass     450        450       266s

  totals: collected 2512  executed 2512  passed=2427 skipped=71 failed=6 timedOut=8
```

The fourteen: eight in `searchable-dropdown.spec.ts` in Firefox (four timeouts, four
assertions, one contiguous block); `fixture-act.spec.ts` and `table.spec.ts:50` in WebKit;
three `accordion.spec.ts` keyboard tests and the axe fixture sweep in Mobile Chrome.

**Earlier the same day, on the same tree, all seven were green** — 2444 passed, no
non-passes. The only change to `e2e/` between the two runs is a `declare global` adding
`focusVisible` to `FocusOptions`, which emits nothing and cannot alter behaviour.

That leaves two readings, and this document will not pick one for you.

- **The machine.** Every project ran slower than its green counterpart, and shard 3 ran
  **27.7 minutes against 86 seconds**. Re-run alone on a quiet machine immediately afterwards,
  the same shard passed: **101 passed, 11 skipped, 2.1 minutes, no failures.** Three
  independent projects going red at once, in specs that have never failed together, is the
  signature this suite has produced twice before under load (once from a harness change that
  cost one project 2.2h, once from an OS index rebuild).
- **A real contention defect.** The failures are not scattered — eight consecutive tests in
  one spec is what a genuine race looks like, and `CascadingDropdown/open-search` was exactly
  that: reproducible only under four-worker load and closed by a real fix, not by a re-run.

**What is recorded is FAIL.** A green matrix taken on a contended machine is not a
measurement, and neither is a red one; the difference is that a red one is at least not a
claim. The next step is to re-run on a quiet machine — and if `searchable-dropdown.spec.ts`
comes back, to fix it rather than re-run it again.

The reporter behind those numbers is itself tested: `run-e2e-matrix.mjs --self-check` plants a
failing test and a timing-out test and requires both to be named by spec, line and title. A
project that collects zero tests fails, because a filter matching nothing is not a pass. One
defect in it was found and fixed while writing this: the per-project note appended "recorded,
not blocking" to *every* failing project, not only a waived one, so the table contradicted its
own `RESULT: FAILED`. It had gone unnoticed because Firefox was the only project that ever
failed and Firefox was waived.

Firefox's own history is worth keeping. It had never been seen green until 2026-09-08, and its
failures had been read as environmental for four attempts on the strength of "always a timeout,
never an assertion". That was false: `wcag-layout.spec.ts` read computed style in the same tick
as `.focus()`, so Firefox returned the pre-transition value where Chromium returned the target,
and SC 2.4.7 had been passing by engine rather than by evidence. With the gate fixed, **every
one of the 13 focusables it checks has an indicator in Firefox** — by box-shadow for Button,
Switch, Pagination and Slider, by the native outline for Checkbox, and by box-shadow plus
border colour on the wrapping control for Input and Dropdown.

### 1.3 One gate failed and named its own fix

`verify:bundle-size` failed on a down-only ratchet: the library measured 146.65 KB against a
recorded 147.76 KB, and Table 15.79 KB against a recorded 16.21 KB. Both had shrunk because
the narration-comment cleanup (`4886b70`) landed after the records were set and the gate
measures the unminified `dist`. A record left above reality buys back headroom nobody agreed
to, so both were lowered to what this run measured. No ceiling moved and no component changed.

### 1.4 Records regenerated from this run

- `ai/system-state.json` — `validation.build`, `validation.performance`, `validation.npmAudit`
  and `issues.high[8].evidence`, each re-measured and prefixed `RE-MEASURED 2026-09-08`, then
  the dist fingerprint re-stamped so the records are tied to the artifact they describe.
  The DatePicker evidence changed shape as well as number: the chunk it names is 9.68 KB as
  CJS and 11.83 KB as ESM, both under the 12 KB ceiling. What still breaches is the entry's
  exclusive closure at 12.03 KB, which is what the gate measures. The earlier readings (10.25,
  12.32, 12.42) were chunk-file sizes and were never comparable to it.
- `docs/adr/003-ssr-hydration.json` — rewritten by the consumer matrix, 30 components.
- `scripts/assert-bundle-size.mjs` — the two ratchets in §1.3.
- `scripts/run-e2e-matrix.mjs` — Firefox's waiver removed and `KNOWN_UNSTABLE` emptied
  (§3.6), and the per-project note corrected so "recorded, not blocking" appears only when
  something actually waives the project (§1.2).
- `e2e/wcag-layout.spec.ts` — `focusVisible` declared rather than cast, which is what
  unblocked `typecheck` and the site build.
- `ACCESSIBILITY.md` — three stale fixture counts corrected to what the sweep measured
  (429 fixtures, 125 of them portalling). The same document already said 429 in two other
  places, so it disagreed with itself.

### 1.5 What could not be regenerated, and why

- **The consumer matrix, packaging, bundle-size, ssr-record and the four `--check` gates.**
  Not re-run after the last two changes, deliberately: those gates measure `src/` and `dist/`,
  and the changes touched only `e2e/` and `scripts/`. The claim is checked rather than
  asserted — `dist/` was rebuilt afterwards and fingerprints byte-identically
  (`sha256:0b75e3e0…:1163`), so the artifact those gates measured is the artifact that is
  here now.
- **The `/ai` 20-step pipeline (`ai/run.md`).** Steps 01–19 are agent-driven audits — SEO,
  brand consistency, deep security review, demo review. They are prompt documents, not
  scripts; executing them means an agent forming judgements, and writing fresh PASS verdicts
  for twenty of those without doing the work is the failure mode this branch spent a month
  removing. Anything in `ai/system-state.json` without a `RE-MEASURED` prefix predates this
  run and should be read as unverified.
- **Lighthouse scores** (`ai/07-performance.md`, `ai/15-seo.md`). Need a deployed site and a
  headless-Chrome runner; neither exists here.

---

## 2. What the package claims, and what proves it

| Claim | Proved by |
| --- | --- |
| 30 components, each with a subpath export | `attw` resolves all 32 entrypoints under node10, node16 (CJS and ESM) and bundler |
| ESM and CJS, with correct types for each | `publint --strict` clean; `attw` reports 0 problems |
| Installs and builds in real frameworks | `verify:consumers`: 9 apps, 2 React majors, 4 frameworks, production builds, one running its own Tailwind v4 and one mounted in StrictMode |
| Tree-shakes | `vite-treeshake` imports only `@chumlab/ui/button` and the emitted JS is searched for markup only Table, DatePicker and CascadingDropdown write |
| Server-renders under Next and React Router | The same gate greps prerendered HTML for a sentinel and a `<table>`; a build alone is not accepted as proof |
| `"use client"` where hooks are used | The consumer self-check strips the directive from all 154 chunks and requires `next-app` to fail while `vite-react19` still passes |
| Optional peers really are optional | `vite-no-optional-peers` installs neither and asserts their absence |
| `styles.css` works with no Tailwind | `assert-styles-bundle.mjs`: 484 rules, 471 utility selectors confined to the `cl-s` marker, no preflight |
| `unstyled` drops every decorative class | `unstyled.contract` across all 30, with a ratcheted leak list |
| Every `classes` key reaches a real element | `fixtures.contract` renders every key in every anatomy; `key-uniqueness.contract` asserts one key per element |
| Layout holds 320–1920 px in both themes | 404 recorded screenshots — 30 components × 6 widths × 2 themes, plus 11 open surfaces × 2 widths × 2 themes — and three guards: one fails a baseline that is a picture of nothing, one fails a baseline whose render is not the same 26 hours later, one fails an anchored surface that lands on different coordinates when the web font arrives late |
| Text contrast meets AA in both themes | `contrast.contract` on the token scale and `contrast-painted.spec.ts` on what the browser computes over all 429 fixtures in both themes, self-checked by planting a raw-palette grey the first cannot see |
| No focusable element lacks an indicator | `contrast-painted.spec.ts` over every focusable of 429 fixtures in both themes, and `wcag-layout.spec.ts` in all five engine projects — the latter now settling the transition before it reads (§1.2) |
| Ten owned WCAG criteria | Named contract or e2e gate per criterion, listed in `ACCESSIBILITY.md` with the engines it ran in |
| Bundle size per component | `assert-bundle-size.mjs`, 30 entries, shape derived from source, per-entry ratchet, self-checked |
| Docs name no prop the types lack | `doc-truth.contract` |
| Committed generated files match their source | `build-tokens.mjs --check`, `build-component-docs.mjs --check`, `build-subcomponent-schemas.mjs --check` |
| Shipped docs' links resolve in the tarball | `assert-packaging.mjs`, with a planted broken link |
| The fixture harness never ships | `assert-fixture-bundle.mjs` over all 1161 built files |

---

## 3. What is knowingly not true, or not gated

Everything in this section is deliberate and recorded. None of it is a surprise; all of it is
something a consumer could hit.

### 3.1 Four declared bundle breaches

| Component | Exclusive | Ceiling | Class |
| --- | --- | --- | --- |
| Table | 15.79 KB | 12 KB | surface |
| DatePicker | 12.03 KB | 12 KB | surface |
| Accordion | 9.09 KB | 8 KB | composed |
| InternationalPhoneInput | 8.57 KB | 8 KB | composed |

Each carries its reason in `DECLARED_BREACHES` and a per-entry ratchet, so none can grow
without an explicit record change. A ceiling is never raised to accommodate a component and no
component is split to satisfy a number. DatePicker misses by 0.03 KB and the last 0.18 KB of
it is comment text, which is declared rather than deleted — deleting comments to buy 30 bytes
would be fitting the code to the number. Accordion is `composed` because it ships four
sub-components the root re-exports; it was previously measured against a `control` ceiling by
elimination, and the shape rule was fixed rather than its number moved.

### 3.2 Six remaining `dark:` variants

From 361 in source and 76 after the first pass. The six that remain are enumerated with a
reason each in `dark-variants.contract` rather than held under a ceiling, so adding one fails
and retiring one fails until the list is updated: Breadcrumb's separator and TimePicker's
hover both step *up* in dark (the only two sites that do), `dark:shadow-none` on Input and
TextArea (no token expresses a shadow in one theme and none in the other), Modal's scrim
(a token was considered and declined in ADR 006), and Slider's thumb (near-white in both
themes, which no token holds, with exactly one caller).

### 3.3 The 151-entry fixture gap

648 of 1136 props have no fixture; 151 of those render markup no gate has seen — 49 slots,
46 props that decide whether the component renders at all, 17 class keys and 39 smaller
differences. `audit-fixture-gap.mjs` classifies them from the AST rather than from their
names, and the count is a ratchet: it may fall, a rise fails. The record carries the
classifier's own limit — it follows one hop of dataflow and therefore under-reports.

The tier above is closed. The 37 props whose markup would have changed a gate's answer have
fixtures, and rendering them found five defects in one run.

### 3.4 Two declared positioners, six declared portals

Two places compute an anchored position outside `useAnchoredPosition`: DatePicker's marker
tooltip (anchors to the cell under the pointer and guesses a 100 px height) and Table's
column-filter menu (a hardcoded 220 px width estimate rather than a measured element). Both
guess rather than measure, so both can mis-place near a viewport edge.

Six `createPortal` sites outside `MenuSurface`. Three are legitimately not anchored surfaces —
Modal (centred), Drawer (viewport edge), Toast (viewport corner). Three are genuine
remainders: Tooltip, which is anchored but owns a hover/focus lifecycle `MenuSurface` has no
notion of, and the same two positioners above.

### 3.5 One RECALLED precedent

ADR 005's token ledger carries one name written from model recall and never checked against
the peer's live documentation. ADR 002's own ledger has none left. `RECALLED` is explicitly
not a justification — it is an admission that a citation was claimed and never verified.

### 3.6 Firefox's waiver, and why it is gone

**Removed 2026-09-08.** `KNOWN_UNSTABLE` is now empty and every project gates the release
verdict again. This entry stays because the absence of a waiver records nothing, and the
reason it went is worth more than the fact.

From 2026-09-05 Firefox ran and printed but did not gate, on this reason: "30s harness
timeouts, never a failed assertion". Across four attempts every Firefox non-pass had been a
30-second timeout on a test that passes alone in under three seconds, concentrated in
`pagination.spec.ts`, and never a wrong value or a missing element. That was the entire
argument for calling it environmental rather than a defect.

It was false. `wcag-layout.spec.ts` read computed style in the same tick as `.focus()`, so
Firefox returned the pre-transition value where Chromium returned the target; SC 2.4.7 had
been passing by engine rather than by evidence. Fixing the gate produced exactly the failed
assertion the waiver said had never happened. Two harness defects carried the timeouts — a
five-mount test given a longer wait instead of a bigger budget, and a fixture index a spec
could enumerate before it had populated — and both were engine-neutral. Firefox was the
slowest project and therefore the first to show them.

With those fixed Firefox went green on merit twice, all four shards each time, and it gates
like everything else now.

**It is red in the run this document records** (§1.2), on eight tests in
`searchable-dropdown.spec.ts`, and the waiver has stayed off. That is the decision landing
rather than a reason to reverse it: a project that fails should say so, and the answer to a
red Firefox is to find out whether it is the machine or a race and fix whichever it is. Shard
3 passes alone on a quiet machine in 2.1 minutes against 27.7 in the matrix, which is evidence
and not a verdict.

**The lesson is not about Firefox.** A waiver survives exactly as long as nothing is sharp
enough to contradict its reason. This one survived five weeks, and what ended it was building
a gate precise enough to disagree with it — not a decision to stop trusting it.

### 3.7 SC 1.4.11's painted gate runs only in Chrome

`contrast-painted.spec.ts` — the gate that measures focus indicators and accent fills at 3:1
against what sits behind them, over 429 fixtures in both themes — belongs to the `a11y-full`
project, which is Desktop Chrome only. Every other engine project explicitly ignores it. So
the criterion is measured in one engine, and the same is true of the full axe sweep. This is a
scope fact, separate from the timing defect they both shared: fixing that told us what Firefox
reports for 2.4.7, and told us nothing about 1.4.11 anywhere but Chrome.

### 3.8 Right-to-left is measured and recorded as unsupported

Fourteen `dir="rtl"` fixtures render the anchored and directional surfaces with the direction
on `<html>`. `e2e/rtl.spec.ts` keeps 7 of 10 assertions skipped, each carrying its own
measurement in the skip reason:

- **No anchored surface mirrors.** `SearchableDropdown`, `TimePicker`, `DatePicker`,
  `Breadcrumb` and Table's filter menu all align their LEFT edge to the trigger's left in RTL,
  exactly as in LTR. DatePicker is the plainest: trigger `[24..1000]`, surface `[24..338]`,
  where the mirror is `[686..1000]`.
- **The one surface that flips does not flip by direction.** `CascadingDropdown`'s submenu
  chooses a side from available space alone. There is no direction input to get wrong.
- **`Slider` is measured from the physical left.** At `value: 25` the thumb sits 75% from the
  leading edge in RTL.
- The viewport clamp is the one thing that already mirrors, because it works from both edges.

What would still be missing if all seven were fixed: text alignment (`text-left`, not
`text-start`), icon direction, and logical properties — the package writes `left`/`right`,
`pl-*`/`pr-*` and `ml-*`/`mr-*` throughout. `Drawer` takes a physical `direction`, so nothing
there mirrors by design. Making the package RTL-correct is a vocabulary change across every
constants file, which is why it is a 1.1 feature with a recorded order: logical properties
first, a direction input second, icons third. README and `ACCESSIBILITY.md` both say plainly
that RTL is not supported.

### 3.9 Every WCAG criterion below Supports

Of the 55 Level A and AA criteria: **11 Supports, 9 Partially supports, 13 Does not support,
22 Not applicable.**

Read the third column carefully, because it does not mean what it means in a VPAT. **"Does not
support" here means "not gated, therefore not claimed."** Several are very likely satisfied by
the current code — 1.4.4 Resize Text, 1.4.10 Reflow and 1.4.12 Text Spacing are the obvious
candidates. The document refuses to say so until a test fails when the behaviour regresses.
That policy is correct and it means the headline number understates conformance; it cannot be
quoted as a failure count.

**Partially supports (9)** — implemented and gated for some components or some part of the
criterion, with the row naming which part is unproven: 1.1.1 Non-text Content, 1.4.11 Non-text
Contrast, 1.4.13 Content on Hover or Focus, 2.2.2 Pause Stop Hide, 2.4.6 Headings and Labels,
2.5.3 Label in Name, 3.2.4 Consistent Identification, 3.3.1 Error Identification, 3.3.2 Labels
or Instructions.

**Does not support (13)** — ungated, not disproved: 1.3.2 Meaningful Sequence, 1.3.3 Sensory
Characteristics, 1.3.4 Orientation, 1.3.5 Identify Input Purpose, 1.4.1 Use of Color, 1.4.4
Resize Text, 1.4.10 Reflow, 1.4.12 Text Spacing, 2.2.1 Timing Adjustable, 2.5.1 Pointer
Gestures, 2.5.2 Pointer Cancellation, 3.2.1 On Focus, 3.2.2 On Input.

Anyone who needs a conformance statement should read `ACCESSIBILITY.md` per criterion, not
this summary. It records which engines each gate ran in.

---

## 4. What has never been tested

Named plainly, because these are the gaps no green run says anything about.

**The library has never run in a real consumer's application.** It has never been published —
`npm view` returns 404 — so there are no downstream users and no field evidence. **The
consumer matrix is nine throwaway templates that we wrote.** The five general ones render all
thirty components, each imported from its own subpath and mounted on its own route, and drive
one affordance on each of the twenty-five that have one. It is still an inference from
templates written by the same person who wrote the library, against no real application's
build configuration, data or interaction patterns.

**No assistive technology has ever touched it.** No NVDA, no JAWS, no VoiceOver. axe is a
static rule engine, not a screen reader; it cannot tell you whether an announcement is
comprehensible, whether focus order makes narrative sense, or whether a live region fires at a
useful moment. Every accessibility claim here is "the markup is correct", never "a person
using a screen reader could complete the task".

**No real device, no Lighthouse, no profiling in a real app.** Mobile Chrome and Mobile Safari
are desktop-engine emulations at a phone viewport, not phones. Touch is dispatched, not
performed.

**Visual coverage is 41 of 429 fixtures.** 30 resting subjects at six widths and eleven open
surfaces at two, 404 baselines in all. The rest of the fixture set has no baseline.

**Five fixture acts do not reach their named state on the fixture page.** `Slider/dragging` and
`Slider/thumb-active` need pointer capture, which a dispatched event cannot obtain;
`Table/pin-hover` needs `:hover`, which no script can dispatch in any browser;
`Table/editing-cell` and `Table/cell-editing` open the editor and close it in the same frame.
All five are asserted with a real pointer in `slider.spec.ts` and `table.spec.ts` instead, and
the limitation is declared in `fixture-act.spec.ts`.

**React 17, and bundlers other than Vite, Next and React Router.** Not tested; React 17 is
stated as unsupported.

---

## 5. The version decision

`package.json` says `0.1.0`. The package has never been published, so this is a free choice.

**What 0.1.0 commits us to.** Very little, deliberately. `VERSIONING.md`'s pre-1.0 clause
carries ADR 002 R7 forward verbatim: keys are renamed and deleted freely, with no deprecation
cycle, and any 0.x minor may contain what would otherwise be a major change. A consumer is
told to pin an exact version if that matters. That freedom is what made deleting
`DatePicker.markerTooltip` free.

**What `1.0.0-rc.1` would commit us to.** A release candidate is a promise about the shape of
what follows, not a lighter version of 1.0. It says: this vocabulary is the one we intend to
freeze. Under R7 the freeze lands the moment 1.0 does — every key present at 1.0 is a
stability commitment, and removing, renaming or repointing one is a major version from then
on. Tagging an rc invites people to build against 397 keys across 38 anatomies.

**Recommendation: publish 0.1.0**, once §7 is closed. Three reasons, in order of weight.

1. **The vocabulary is not ready to freeze.** The waived list is down to one key and that one
   is reachable in a browser, but everything R7 allows to move is still moving — the
   documentation was teaching twenty keys that no longer existed as recently as 2026-09-07.
2. **Nothing about an rc is easier to withdraw.** npm treats `1.0.0-rc.1` as a published
   version like any other; unpublishing is restricted and republishing a version is forbidden.
   The freedom 0.x gives is real; the freedom "rc" gives is marketing.
3. **Nine templates are not a user.** The first real consumer will find something none of this
   found, and 0.x is the version that expects it.

The counter-argument is worth stating: 92.04% coverage, 4749 tests, a seven-project browser
matrix now green in all seven, 404 visual baselines, nine consumer apps and a per-criterion
accessibility record are not 0.1.0-shaped artefacts, and calling this 0.1.0 undersells it. That
is true. It is also the correct price for keeping the right to delete a key.

---

## 6. Residual risk

What should be said out loud to whoever presses publish.

1. **The matrix is not green, and nobody should publish until it is.** Three projects are red
   on a tree that was green in all seven hours earlier (§1.2). Whether that is the machine or
   a contention race, the honest position is the same: the last recorded verdict is FAILED.
2. **A broken gate reached a commit, and the branch did not notice for a day.** `typecheck`
   was red at the previous commit because the change that broke it was verified against
   `tsconfig.app.json`, which does not include `e2e/`. Fixed now. A gate that is not run is
   not a gate, and this is the shape of the thing that gets waved through at the end of a
   long session.
3. **A waiver hid a reporting bug for five weeks.** The matrix table appended "recorded, not
   blocking" to every failing project, not only a waived one — invisible while Firefox was
   the only project that ever failed and Firefox was waived. Fixed (§1.2). Two mistakes
   compounding is how a table comes to disagree with its own verdict.
4. **The matrix is sensitive to the machine, and today proved it three times.** A harness
   change cost one project 2.2h; an OS index rebuild turned two projects red with no code
   change; and this run went red in three while a shard that failed in 27.7 minutes passed
   alone in 2.1. Read a red matrix for load before reading it for defects — and never read a
   green one taken under load at all.
5. **A gate went stale without anyone noticing, and it was the accessibility gate.** The axe
   expectation list was recorded against 276 fixtures while the suite had 364. It now records
   the count it was derived from and fails when that moves — but the same shape of failure has
   been found in `ai/system-state.json`, `src/styles/tokens.css`, `ACCESSIBILITY.md` (again,
   today) and in this document. Assume there are more. A guard on how much a gate ran is not a
   guard on what it looked at.
6. **The accessibility numbers will be misread.** "13 Does not support" published alongside a
   package will be quoted as thirteen failures. They are thirteen ungated criteria, most
   probably fine. The framing is honest and it is also a liability.
7. **Single-engine iteration cannot see a whole class of bug.** Three components once
   announced the highlighted option to `<body>` for every Safari user and a fourth never
   closed, and Chromium masked all four. The release matrix is the only thing that catches
   that. If it is ever skipped to save forty minutes, this comes back.
8. **`npm publish` is a one-way door.** 0.1.0 can never be republished, and the package name
   is claimed permanently on first publish.

---

## 7. What remains

One thing.

**Settle the browser matrix.** Re-run it on a quiet machine. If it comes back green, the
2026-09-08 red was load and the record says so. If `searchable-dropdown.spec.ts` comes back in
Firefox — or `fixture-act`/`table` in WebKit, or the accordion keyboard tests in Mobile Chrome
— then it is a contention race and it gets fixed, the way `CascadingDropdown/open-search` was
fixed rather than re-run. Either outcome is a result. A third run started because the second
was disliked is not.

Nothing else is outstanding. `typecheck`, the site build and `verify:playground-removed` are
closed; Firefox's waiver is gone and will not come back; every other gate in §1.1 passes
against a `dist/` that has been shown to be the one they measured.
