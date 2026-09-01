# ADR 001 — `unstyled` strips decoration, not layout

- **Status:** accepted and implemented (phase 2, branch `fix/unstyled-split`)
- **Date:** 2026-09-01
- **Supersedes:** the implicit contract encoded in the `UNSTYLED_*_CLASSES` constants
- **Relates to:** `AUDIT-GAP.md` §6.1, remediation items `6.1`, `1.1`–`1.7`

## Context

Every component ships two class sets: `DEFAULT_*_CLASSES` and `UNSTYLED_*_CLASSES`. The
unstyled set blanks **every** key to `""`, and the component picks one set wholesale:

```ts
const baseClasses = unstyled ? UNSTYLED_DROPDOWN_CLASSES : DEFAULT_DROPDOWN_CLASSES;
// src/components/Dropdown/Dropdown.tsx:388-390
```

The default sets do not separate what a component *looks like* from what makes it *work*.
Measured across all 26 default sets: **420 class keys, 156 of them (37%) carry
position, display, overflow, sizing or flex/grid utilities.** `unstyled` deletes all 156.

The clearest instance is Modal. `src/components/Modal/utils/constants.ts:4-6`:

```ts
root:    "fixed inset-0 z-50 flex items-center justify-center",
overlay: "fixed inset-0 bg-black/60 dark:bg-black/70 backdrop-blur-sm transition-opacity",
```

`Modal.tsx:314` and `:335` take the unstyled branch wholesale, so an unstyled modal loses
`fixed inset-0` on both nodes. It is no longer an overlay — it renders inline in document
flow, in the middle of the page content, with no backdrop. The same shape appears in
Dropdown, where `wrapper: "relative"` is blanked while `clearIcon` keeps
`absolute right-8 top-1/2`, so the clear button positions itself against the page instead
of the field.

The consequence for consumers is that `unstyled` is unusable as "give me your behaviour,
I will bring my own palette". Opting out of the palette also opts out of the DOM working,
so every call site has to re-supply layout it never wanted to own. That is what a
downstream project's ~400 hand-maintained class strings in `modalClasses.ts` and
`tableClasses.ts` actually are.

`unstyled` is currently one switch controlling two unrelated concerns.

## Decision

Split every `DEFAULT_*_CLASSES` entry into two layers.

- **`structural`** — always applied. `unstyled` cannot remove it. `classes` overrides may
  replace it, because a consumer naming a slot explicitly has taken responsibility for it.
- **`decorative`** — what `unstyled` strips, and what `classes` replaces per slot today.

### The rule

> A utility is **structural** if removing it changes the box's participation in layout —
> where it is positioned, what formatting context it establishes or joins, whether it can
> overflow, and what size it takes. Everything else is **decorative**.

The rule is the authority; the category lists below are its application, and any utility
not listed is classified by applying the rule directly.

### Structural

| Group | Utilities |
| --- | --- |
| Position & stacking | `static` `relative` `absolute` `fixed` `sticky`, `inset-*` `top-*` `right-*` `bottom-*` `left-*`, `z-*` |
| Display | `block` `inline-block` `inline` `flex` `inline-flex` `grid` `inline-grid` `table` `table-*` `contents` `hidden` |
| Flex & grid participation | `flex-row` `flex-col` `flex-wrap` `flex-nowrap` `flex-1` `flex-auto` `flex-initial` `flex-none` `grow` `shrink` `shrink-0` `basis-*`, `grid-cols-*` `grid-rows-*` `col-*` `row-*` `order-*`, `items-*` `justify-*` `content-*` `self-*` `place-*` |
| Overflow & clipping | `overflow-*` `overscroll-*` `truncate` `text-ellipsis` `whitespace-nowrap` |
| Sizing | `w-*` `h-*` `min-w-*` `min-h-*` `max-w-*` `max-h-*` `size-*` `aspect-*` |
| Box model that changes participation | `box-border` `box-content`, `float-*` `clear-*`, `isolate` |

### Decorative

| Group | Utilities |
| --- | --- |
| Colour | `bg-*` `text-<colour>` `border-<colour>` `ring-<colour>` `divide-<colour>` `fill-*` `stroke-*` `placeholder:*` `accent-*` `caret-*` |
| Border & radius | `border` `border-<width>` `border-<style>` `divide-*` `rounded-*` `outline-*` `ring` `ring-<width>` `ring-offset-*` |
| Shadow & depth | `shadow-*` `drop-shadow-*` `opacity-*` `backdrop-*` `mix-blend-*` |
| Typography | `font-*` `text-<size>` `leading-*` `tracking-*` `text-left/center/right` `uppercase` `lowercase` `capitalize` `underline` `line-through` `no-underline` `antialiased` |
| Spacing | `p-*` `px-*` `py-*` `pt-*` `pr-*` `pb-*` `pl-*`, `m-*` `mx-*` `my-*` `mt-*` `mr-*` `mb-*` `ml-*`, `gap-*` `space-x-*` `space-y-*` |
| Motion | `transition-*` `duration-*` `ease-*` `delay-*` `animate-*` `transform` `scale-*` `rotate-*` `translate-*` |
| Interaction affordance | `cursor-*` `select-*` `pointer-events-*` `resize-*` `appearance-*` |

### The two tie-breaks worth recording

**`gap-*` is decorative.** It is both a flex/grid property and a spacing property. Applying
the rule settles it: a flex row that loses `gap-1` still lays out as a row — the children's
participation is unchanged, only the whitespace between them. `space-x-*` and `space-y-*`
are margin utilities and follow the same way. Anyone reaching for the categorical intuition
"gap belongs to flexbox, so it is structural" should note that the rule, not the CSS
specification's grouping, is the authority.

**`z-*` is structural.** It is not decoration: an overlay that loses its z-index renders
behind the content it is supposed to cover, which is a layout failure, not a visual one.
This makes `Drawer`'s `root: "z-999999"` structural in its entirety.

**`pointer-events-*` is decorative** by the rule (it changes hit-testing, not layout), but
it is load-bearing for overlay dismissal. It is listed under interaction affordance and
should be audited when the split is implemented; it is the one entry where the rule and the
practical consequence may diverge.

## Consequences

- `unstyled` becomes "no palette", which is what it reads like and what consumers assume.
- The 156 layout-bearing keys stop being the consumer's problem. Shared override files that
  exist only to re-supply layout can shrink to the decorative deltas they were meant to be.
- `UNSTYLED_*_CLASSES` stops being an all-empty mirror of `DEFAULT_*_CLASSES`. It becomes
  the structural half — derived, not hand-maintained, so the two cannot drift.
- Consumers currently passing a full `classes` map to work around this keep working: an
  explicit `classes` value still replaces the slot outright, structural half included.
- **This is a breaking change** for any consumer relying on `unstyled` producing an empty
  `class` attribute. It needs a major version and a migration note.

Implementation landed in phase 2 on `fix/unstyled-split`. This ADR defined the contract and
moved the tests onto it first, deliberately, so the tests described the intended behaviour
before the code did.

## Tests changed

Three assertions specified the old behaviour as the requirement rather than merely failing
to cover it. Each is rewritten to assert the new contract, and each **fails today**. That is
the intended end state of this change.

### 1. `src/components/Modal/__tests__/Modal.test.tsx:618-626`

Was titled *"does not apply fixed positioning classes to root when unstyled=true"* and
asserted `expect(root.className).not.toContain("fixed inset-0")` — the exact defect above,
written as a requirement.

Rewritten to assert that the root retains `fixed`, `inset-0` and `flex` under `unstyled`,
using `toHaveClass` so matching is token-based rather than substring-based. The companion
test at `:606-616` (`not.toContain("bg-white")`) is **left alone**: `bg-white` is
decorative, so that assertion is already correct under the new contract and is the natural
other half of the pair.

### 2. `src/components/TimePicker/__tests__/TimePicker.test.tsx:423`

Asserted `not.toContain("inline-flex")` against a root default of
`"inline-flex flex-col gap-1 text-cl-text dark:text-cl-text"`.

Rewritten to assert both halves on one node: `inline-flex` and `flex-col` survive,
`text-cl-text` and `gap-1` do not. This is the clearest single example in the suite of the
split doing what it is for, because the root default contains both categories.

### 3. `src/components/InternationalPhoneInput/__tests__/InternationalPhoneInput.test.tsx:457`

Asserted `not.toContain("flex-col")` against a root default of `"flex flex-col gap-1"`.

Rewritten to assert `flex` and `flex-col` survive and `gap-1` does not — the `gap-*`
tie-break recorded above, pinned by a test so it cannot be quietly re-decided.

## Other assertions encoding the old contract — found, not changed

A repo-wide scan of every negative class assertion inside an `unstyled` test context
returned 11 hits. Eight are consistent with the new contract or unrelated. **Three more
beyond the ones rewritten above will fail when phase 2 lands**, in forms the first scan
missed because they do not name a layout utility:

| Location | Assertion | Why it breaks |
| --- | --- | --- |
| `src/components/Drawer/__tests__/Drawer.test.tsx:1205` | `not.toContain("z-999999")` | `DEFAULT_DRAWER_CLASSES.root` is `"z-999999"` and nothing else. Under the `z-*` tie-break the whole value is structural, so the unstyled root retains it and this assertion inverts. |
| `src/components/Breadcrumb/__tests__/Breadcrumb.test.tsx:653` | `expect(list.className).toBeFalsy()` | Default `list` is `"flex flex-wrap items-center gap-1"`, three-quarters structural. The unstyled list will carry a class string, so a falsy assertion cannot hold. Notable because it asserts emptiness in general rather than naming a utility. |
| `src/components/InternationalPhoneInput/__tests__/constants.test.ts:229-235` | `for (const value of Object.values(UNSTYLED_…_CLASSES)) expect(value).toBe("")` | The strongest of the three: a whole-constant invariant that every unstyled value is empty. It fails on the first key that retains its structural half, and it is the only test of its kind in the suite. |

They are left as-is because phase 1 is scoped to the three named assertions, and because
each needs the phase-2 constant to exist before it can be rewritten meaningfully — the
Drawer and Breadcrumb rewrites need to know which tokens survive, and the IPI invariant
should be replaced by its inverse (every unstyled value contains only structural
utilities), which is not expressible until the split is derived rather than hand-written.

**Consistent with the new contract, no action needed** — all assert on decorative
utilities: `Tooltip.test.tsx:1277` (`rounded-lg`), `:1278` (`bg-white`),
`DatePicker.test.tsx:544` (`border-gray-300`), `Table.test.tsx:57` (`bg-cl-bg-elevated`),
`Modal.test.tsx:615` (`bg-white`).

No documentation asserts that `unstyled` removes layout. `llms-full.txt:234` says
*"All slots start as empty strings. You must provide everything via `classes`"*, and the
per-component repeats at `:615-616`, `:925-926` say the same. Those are descriptions of the
current implementation rather than assertions about layout, and they will need updating in
phase 2, but they do not conflict with this ADR's reasoning.

---

# Addendum — `cl-s` marker coverage (Task 2)

Recorded here because the marker work is what makes the contract testable: a contract test
that asserts "structural utilities survive" is meaningless if the utilities never had a
rule behind them in the first place.

## What changed

`src/utils/cn.ts` now appends the scope marker to every non-empty class string it returns,
and exports it as `MARKER`. Three properties, all deliberate:

1. **Idempotent.** Any pre-existing `cl-s` tokens are stripped before one is appended, so
   `cn(cn(a), b)` and a string that has already passed through the JSX runtime both end up
   with exactly one.
2. **Appended after `twMerge`.** The marker is not a Tailwind utility, so passing it
   through `twMerge` risks nothing today but constrains nothing either. Appending it after
   the merge guarantees `twMerge` can never drop, reorder or group it, and keeps it in last
   position where the JSX runtime also expects to find it.
3. **Empty stays empty.** `cn()` with no resolvable classes returns `""`, not `"cl-s"`.
   Without this, every `className={cn(...) || undefined}` guard in the library inverts —
   `"cl-s"` is truthy — and elements with no styling at all would carry a scope marker.
   This matches the rule `src/jsx/mark.ts:32-33` already applies.

`src/jsx/mark.ts` was given the same idempotence check. It is a required companion, not an
optional tidy-up: without it, an element whose class string came from `cn()` receives the
marker twice — once from `cn`, once from the runtime — and "exactly once" fails.

## Holes this closes — verified by source inspection, not assumption

Every site listed in `AUDIT-GAP.md` §1.1 and §1.2 routes its class string through `cn()`,
so all of them are closed. Each was read individually:

| Site | Class expression | Closed |
| --- | --- | --- |
| `Button.tsx:203` (asChild) | `combinedClassName` ← `cn(...)` at `:156` | yes |
| `TooltipAsChildTrigger.tsx:41` | `cn(child.props.className, triggerClassName)` at `:96` | yes |
| `Accordion.tsx:334` | `cn(mergedClasses.root, className)` | yes |
| `AccordionItem.tsx:54` | `cn(config.classes.item, className)` | yes |
| `AccordionShimmer.tsx:26` | `cn("w-full", variantClasses.root, className)` | yes |
| `AccordionTrigger.tsx:155` | `triggerProps.className` ← `cn(...)` at `:138` | yes |
| `AccordionContent.tsx:183` | `wrapperClassName` ← `cn(...)` at `:170` | yes |
| `Avatar.tsx:213` | `cn(mergedClasses.root, className)` | yes |
| `AvatarShimmer.tsx:26` | `cn(...)` | yes |
| `AvatarShimmer.tsx:75` | `cn("flex items-center", className)` | yes |
| `AvatarGroup.tsx:90` | `cn(variantClassNames[variant], classes.root, className)` | yes |
| `AvatarGroupCount.tsx:66` | `cn(...)` | yes |
| `AvatarBadge.tsx:84` | `cn(...)` | yes |

All 11 `asChild ? Slot : …` sites plus the two direct `cloneElement` paths. `Slot`'s own
merge (`slotHelpers.ts:37-41`) joins the slot's className with the child's, so the marker
survives the merge and needs no change there.

## Holes `cn()` does **not** close — patched explicitly

**§1.3, consumer-supplied icon components.** `<ChevronIcon className={mergedClasses.chevron
|| undefined} />` hands a raw constant to a component the consumer may replace, and a raw
constant never passes through `cn()`. Patched by routing those className expressions
through `cn()` so the string carries the marker; any icon component that forwards
`className` to its root element is then correctly scoped. This is a partial fix by
construction — an icon component that *swallows* `className` was already broken and remains
so — and it is the most that can be done without changing the icon-slot API.

Sites patched are listed in the commit diff; they are the `className={mergedClasses.<icon>}`
expressions feeding `ChevronIcon`, `ClearIcon`, `SearchIcon`, `CheckIcon`, `ExpandIcon` and
`CheckboxIcon` props.

## Holes knowingly left open

- **§1.4, `renderTrigger` discards `classes.trigger`.** Not a marker hole: the class string
  never reaches an element at all, so there is nothing for `cn()` to mark. Fixing it means
  adding `className` to the `*TriggerRenderProps` interfaces — remediation item `1.4`,
  phase 2.
- **§1.5, consumer-authored markup.** Inherent to the scoping design and not closable: the
  library cannot mark elements it does not render. It is a documentation gap
  (remediation item `1.5`), not a code one.

## Risk this change introduces — flagged, not resolved

`cn` is a **public export** (`README.md:305`, listed under Utilities). Injecting the marker
into it means a consumer calling `cn("hidden", …)` on their own markup now receives `cl-s`,
which makes the library's shipped `.hidden:where(.cl-s){display:none}` apply to their
element.

That is the precise failure the scoping mechanism was built to prevent —
`scripts/build-styles.mjs:8-18` and `src/jsx/mark.ts:5-11` both record it as a real
regression that made consumer content disappear.

The clean resolution is two functions: an internal `cn` that marks, for library use, and
the public `cn` re-exported without marking. That was not done here because it is a
scope decision beyond "change `cn()`", and because the public/internal split touches the
package's export surface. **It should be settled before this ships.**

---

# Addendum — cross-cutting contract tier (Task 3)

`src/__tests__/contracts/` is the tier `AUDIT-GAP.md` §1.7 and §2.6 identified as having
nowhere to live: the unit suite is organised strictly per component, so a test of the
marker or of server rendering had no home and neither mechanism had a single assertion
across 2,976 of them.

## Roster

Every suite iterates `ai/component-index.json`, not a literal list, so a new component is
covered the moment it is indexed. Two small maps in `registry.ts` are hand-maintained and
deliberately fail loudly rather than skip: `REQUIRED_PROPS` (minimal props for components
that cannot render bare) and `EXPORT_ALIAS` (index entries whose name is not an export —
`Loader` names a family of four, and `RadioButton` throws outside its `RadioGroup`).

## Why the tier is a separate vitest project

`vitest.config.ts` now declares two projects. `contracts` compiles with
`jsxImportSource: src/jsx` — the same marking runtime `vite build --mode lib` uses — because
without it the marker does not exist in tests and `marker.contract` could only ever assert
its own absence. `unit` keeps the plain React runtime so the existing 3,058 assertions see
exactly the DOM they saw before.

Each contract file then opts back out per-file with `/** @jsxImportSource react */`. That
inversion is the point: the *library* compiles marked, the *test file* compiles unmarked,
which is precisely the production split between library and consumer. Without it the `<a>`
authored inside an `asChild` assertion would arrive pre-marked and the assertion would pass
whether or not `Slot` propagates anything.

`ssr.contract` additionally runs under `environment: "node"`. Under jsdom `document` exists,
so `DatePicker.tsx:987` renders happily and the gate stays green on a lie — which is how
`system-state.json:867` came to record "SSR safety — carried PASS". `src/test/setup.ts` is
now guarded by a `hasDom` check so it can be shared by both environments.

## Expected-red at the end of phase 1

- **`unstyled.contract` — 30 failures across 26 components.** The contract this ADR
  defines, asserted before it is implemented. Retired by phase 2.
- **`ssr.contract` — DatePicker `keepMounted` and `open`.** Exactly the two paths
  `AUDIT-GAP.md` §2.1 predicted, now caught by a test rather than by reading the source.
  Retired by remediation item `2.1`.

`marker.contract` is fully green, which is the evidence that the Task 2 change closed
§1.1 and §1.2: Accordion, Button and Tooltip all mark the consumer's element through
`Slot`, and no element carries the marker twice.

## Nine failures the tier surfaced on its first run

`overrides.contract` was expected green and is not. These are **pre-existing defects, not
regressions from Task 2** — verified by re-running the suite with the marker append in
`cn()` disabled, which produces a byte-identical failure list. None of the reported tokens
is the marker.

They violate the library's own documented guarantee at `llms-full.txt:233` — *"Your values
replace the default for that slot … the entire default trigger class string is replaced,
not appended."*

| Component | Slot key | Symptom |
| --- | --- | --- |
| CascadingDropdown | `searchInputElement` | consumer value never reaches the DOM |
| Checkbox | `labelContainer` | consumer value never reaches the DOM |
| DatePicker | `day` | consumer value never reaches the DOM |
| InternationalPhoneInput | `countrySelectDropdown` | consumer value never reaches the DOM |
| Stepper | `connectorHorizontal` | consumer value never reaches the DOM |
| Table | `unpinnedContainer` | consumer value never reaches the DOM |
| MultiSelectDropdown | `wrapper` | `relative` merged with the override instead of replaced |
| MultiSelectSearchableDropdown | `wrapper` | `relative` merged with the override instead of replaced |
| TimePicker | `endIcon` | `transition-transform duration-200` merged with the override |

The second group is the same shape as `AUDIT-GAP.md` §4.6: a utility hardcoded at the JSX
site rather than declared in the constants file, so `classes` cannot displace it and
`unstyled` cannot remove it. The first group needs per-component inspection — either the
slot is rendered from a different constant than the one the key names, or the key is dead.

Both groups are new findings. They belong in phase 2 alongside remediation item `4.6`, and
they should be recorded in `system-state.json` under `contracts.knownFailing` with a linked
remediation item until then, per `ai/verify-contracts.md`.

---

# Addendum — implementation (phase 2)

## How the split is applied

`src/utils/classLayers.ts` holds the classifier this ADR describes, promoted out of the
test tree, plus `structuralOnly(defaults)`. Every component's `UNSTYLED_*_CLASSES` is now:

```ts
export const UNSTYLED_DROPDOWN_CLASSES: Required<DropdownClasses> =
  structuralOnly(DEFAULT_DROPDOWN_CLASSES);
```

applied once at module load in all 27 constants files. No component's merge logic changed:
`unstyled ? UNSTYLED_X : DEFAULT_X` already read the right constant, it was just pointed at
an all-empty mirror.

Two components kept the split out of their constants and had to be corrected at the call
site instead:

- **Accordion** hardcoded `unstyled ? "" : cn(...)` in six places
  (`Accordion.tsx:198-224`), bypassing `baseClasses` entirely. Its `VARIANT_CLASSES` and
  `SIZE_CLASSES` are default class sets like any other and now take `structuralOnly` too,
  so `overflow-hidden` on a bordered accordion survives.
- **Stepper** kept `INDICATOR_SIZE` and `ICON_SIZE` as private maps inside `Stepper.tsx`.
  They moved to `utils/constants.ts` and are resolved once at the parent, where `variant`
  and `unstyled` are both in scope.

## Question (e): are `UNSTYLED_*_CLASSES` dead?

**No — they survive, and their meaning is now literal.** Each one is derived from its own
`DEFAULT_*_CLASSES` rather than hand-written, which is what makes the pair unable to drift.
The name still reads true: it is the set applied when `unstyled` is on.

Three reasons not to delete them:

1. They are public exports on all 30 component subpaths. Removing them is a breaking
   change with no benefit — the value a consumer gets is now *more* useful, not less.
2. Every component's merge already reads one. Deleting them would mean editing 30 merge
   blocks to call `structuralOnly` inline, computing the same result 30 times per render
   instead of once per module.
3. A consumer building an override set wants to see what survives. That is exactly what
   the constant now is.

What *is* dead and was removed: the 420 hand-written `""` values.

## What the sweep fixed, and what it did not

Six leaks reached the DOM and are closed — Accordion `w-full`, CascadingDropdown
`text-left`, DatePicker `gap-1`, InternationalPhoneInput `gap-2 border text-sm`, Pagination
`gap-2`, Stepper `text-xs font-medium`, TimePicker `transition-transform duration-200` —
plus the three merge-instead-of-replace cases (MultiSelectDropdown and MSSD `wrapper`,
TimePicker `endIcon`), all as instances of the same sweep rather than as one-offs.

New `classes` keys were added where a slot had markup but no key: CascadingDropdown
`triggerText`, DatePicker `triggerActions`, Stepper `stepContainerVertical` /
`stepContainerHorizontal`, and six on InternationalPhoneInput for its country rows.

One finding the sweep surfaced that is not a class-literal problem at all:
**`unstyled` did not propagate to nested library components.** `InternationalPhoneInput`
renders `CountryFlag`, which kept its own `border border-cl-border` while its parent
dropped everything. Fixed by passing `unstyled` down; the same shape is worth checking
wherever one component renders another.

**125 literal class strings remain at JSX call sites**, 92 of which carry a structural
utility. They are recorded as the ratcheting baseline in
`src/__tests__/contracts/constants.contract.test.tsx` and do not currently reach the DOM in
a way the `unstyled` or `overrides` contracts can see. Retiring them means adding ~125 new
public `classes` keys, which is an API-surface decision (see `AUDIT-GAP.md` §4.5 on the
slot vocabulary) rather than a mechanical sweep, and is deliberately not made here.
`Table/Table.tsx` alone accounts for 42.

## Question from Task 4: the six "unplumbed" `classes` keys

All six — CascadingDropdown `searchInputElement`, Checkbox `labelContainer`, DatePicker
`day`, InternationalPhoneInput `countrySelectDropdown`, Stepper `connectorHorizontal`,
Table `unpinnedContainer` — turned out to be **documented, typed, present in their merge
block, and rendered**. None needed plumbing and none needed removing.

The phase-1 failures were an artefact of the `overrides.contract` reachability heuristic,
not a library defect. That test inferred "this slot rendered" from the default render's
class tokens, and slots share utilities: Checkbox's `labelContainer` only renders when a
label is passed, but its tokens appear elsewhere regardless. A stricter variant (the whole
token set on one element) traded that for a superset coincidence — Stepper's `label`
shares `text-xs sm:text-sm font-medium` with `INDICATOR_SIZE.numbered`.

The suite is now stated as a **negative** and needs no reachability inference at all:
override a key, assert its identifying default tokens are gone. A slot that never rendered
passes trivially, which is correct — there was nothing to guarantee. It fails only when a
slot rendered and kept its default, which is the actual defect.
