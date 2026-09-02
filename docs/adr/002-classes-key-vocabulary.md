# ADR 002 — `classes` key vocabulary

**Status:** Accepted; amended 2026-09-02 (Amendments A-D)
**Date:** 2026-09-01
**Supersedes:** nothing
**Related:** ADR 001 (unstyled contract), AUDIT-GAP §4.5, GATE-HONESTY §3

## Context

`classes` is the library's primary styling escape hatch and its largest public API surface — 495 documented keys across 30 components, with a further ~125 candidate keys blocked behind this decision (`constants.contract` baseline; `Table.tsx` alone accounts for 42).

That surface emerged rather than being designed. AUDIT-GAP §4.5 found five different names for the same slot. GATE-HONESTY §3 found 377 of 495 keys never render under any test and 213 are never named anywhere in the repo, which means a meaningful fraction of the surface may be dead and nobody can currently tell which.

Three facts make this the moment to fix it:

1. The package is unpublished. Renaming and deleting keys is free today and a major version bump forever after.
2. Phase 2.5 introduces render fixtures, which for the first time make "is this key real?" a decidable question.
3. `llms-full.txt` and the `*.ai.md` files feed the AI Playground's codegen. An inconsistent vocabulary is not just awkward for humans — it is training pressure toward wrong output, at scale, in the product built on top of this one.

## Decision

### R1 — Anatomy is the contract

Each component declares a part anatomy tree in its `.ai.md`. A `classes` key exists **if and only if** it names a part in that anatomy. No key without an anatomy entry, no anatomy entry without a key. The anatomy is generated into `component-index.json` and is the input to every contract test.

### R2 — Closed part vocabulary

Part names are drawn from the fixed list below. The same DOM role gets the same name in every component. Adding a name to this list is an ADR amendment, not a component-level choice.

| Part | Meaning |
| --- | --- |
| `root` | outermost element the component renders |
| `trigger` | the control that opens, toggles, or activates |
| `value` | rendered current selection inside a trigger |
| `placeholder` | shown in place of `value` when empty |
| `icon` | indicator or decorative icon inside a trigger |
| `portal` | portal container element |
| `overlay` | backdrop behind floating content |
| `content` | the floating, expanding, or panel surface |
| `viewport` | scrollable region inside `content` |
| `header`, `body`, `footer` | sections of `content` |
| `title`, `description` | labelled/described-by text inside `content` |
| `closeButton` | dismissal control |
| `list` | collection container (`role="listbox"`, `"menu"`, `"grid"`) |
| `item` | a member of `list` |
| `itemText`, `itemIcon`, `itemIndicator` | parts within `item` |
| `group`, `groupLabel` | grouping within `list` |
| `separator` | visual or semantic divider |
| `input`, `searchInput` | text entry |
| `clearButton` | clears the current value |
| `arrow` | pointer/caret on floating content |
| `empty` | empty-state element |
| `loading` | skeleton or spinner element |
| `label` | form furniture around a control |
| `message` | validation feedback; carries `data-state="error"` or `"success"` (Amendment B) |
| `chip`, `chipLabel`, `chipRemove` | multi-value tokens |

### R2a — Amendment procedure (Amendment A, 2026-09-02)

R2's list was drawn from Radix and Ark menu anatomy. It has no word for a slider thumb, a
calendar cell or a table row, and the migration surfaced 46 parts outside it. Free-form
coinage at that scale is how a second emergent vocabulary starts, so:

**Every name outside R2 must cite a peer-library precedent (Radix, Ark/Zag, Base UI) or be
marked explicitly novel.** Where a peer convention exists it wins over a descriptive
coinage. The accepted list, with precedents, is `vocabularyAmendments` in
`docs/adr/002-key-migration.json`.

Conventions that absorbed coinages in this amendment:

| Coinage | Accepted | Precedent |
| --- | --- | --- |
| `checkbox`, `radio`, `tracker`, and nine spellings of `wrapper` | `control` | Ark Checkbox / RadioGroup / Switch / Combobox / Select |
| `progress`, and Loader's `indicator` | `indicator`, `track` + `range` | Radix Checkbox.Indicator; Ark Progress |
| `connector` | `separator` | Ark Steps — already in R2 |
| `heading` | `header` | Radix Accordion — already in R2 |
| `initials` | `fallback` | Radix Avatar: initials ARE the fallback |
| `mark` | `marker` | Ark Slider |
| Slider's `tooltip` | `valueText` | Ark Slider |
| `handle` | `resizeHandle` | react-resizable-panels |
| `presetButton` | `presetTrigger` | Ark DatePicker |

`clockFace`, `clockHand`, `clockNumber`, `day` and the Table controls are genuinely novel —
no peer library ships an analogue clock picker or a data grid with this anatomy — and are
marked so rather than dressed in a borrowed name.

A key whose value is another library component's `classes` object (R6) names the child, not
a part, and needs no amendment.

### R3 — Qualifier first, head noun last, camelCase

`itemText`, never `textItem`. `searchInput`, never `inputSearch`. No abbreviations, no shortening (`btn`, `desc`, `ctn` are all rejected).

### R4 — No state in key names

This is the rule that stops the surface exploding. State is **not** a key. It is a data attribute on the part, and consumers target it with Tailwind v4 variants against a single key.

Emitted attributes, on every part where the state is meaningful:

- `data-state` — `open` | `closed` | `checked` | `unchecked` | `indeterminate` | `active` | `inactive`
- `data-disabled`, `data-highlighted`, `data-selected`, `data-invalid`, `data-loading`, `data-readonly`
- `data-orientation` — `horizontal` | `vertical`
- `data-side`, `data-align` — for positioned content

Added by **Amendment E** (2026-09-02). R4 was drawn from the same menu-and-overlay sample
R2 was, and the library already emits 86 `data-*` attributes it never saw. The full
classification is `docs/adr/002-state-attribute-catalogue.json`; the state-bearing outcome:

**Converged onto the R4 name** — 8 attributes, 74 emission sites:

| Was | Now | Precedent |
| --- | --- | --- |
| `data-error` | `data-invalid` | Ark Field, Radix Form |
| `data-open` | `data-state="open"` | Radix, on every disclosure |
| `data-checked` | `data-state="checked"` | Radix Checkbox / Switch / RadioGroup |
| `data-active` | `data-state="active"` | Ark Tabs / Steps |
| `data-indeterminate` | `data-state="indeterminate"` | Radix Checkbox |
| `data-expanded` | `data-state="open"` | Radix Accordion |
| `data-pending` | `data-state="inactive"` | Ark Steps |
| `data-position` | `data-side` | Radix Popper |
| `data-focused` | `data-highlighted` | Radix, Ark — landed in the first slice |
| `data-success` | `data-valid` | Radix Form adds `[data-valid]` and `[data-invalid]` to Field, Control, Label and Message ([docs](https://www.radix-ui.com/primitives/docs/components/form), custom validation) |

**Added to R4** — 9 attributes: `data-today` (Ark DatePicker), `data-dragging` (Ark Slider),
`data-placeholder` (Radix Select), and six marked NOVEL because no peer ships a data grid or
an OTP field: `data-clickable`, `data-sorted`, `data-pinned`, `data-editing`,
`data-resizing`, `data-filled`. `data-clickable` is **not** the inverse of `data-disabled` —
a Stepper step ahead of the current one is non-clickable without being disabled, which is
why R4's original list could not express it.

**Kept under the existing name, with a reason** — 4. `data-status` because
Stepper's enum carries `error` and `pending`, which `data-state` cannot hold in one slot;
`data-direction` because writing direction is not a state; `data-next-status` because it
describes the *next* element; and the three `data-range-*` booleans until Task 3 retires
them alongside the keys they mirror.

The remaining 54 are identity, configuration and test hooks, outside R4's scope.

Added by Amendment D (2026-09-02), each with the same precedent test:

- `data-outside` — a calendar cell belonging to an adjacent month. *Precedent: Ark DatePicker `data-outside-range`.*
- `data-range` — `start` | `middle` | `end` for a cell inside a selected range. *Precedent: Ark DatePicker `data-in-range`; the tri-value form is ours.*
- `data-marked` — a calendar cell carrying an event marker. *NOVEL.*
- `completed` as a `data-state` value — a finished step. *Precedent: Ark Steps `data-complete`.*

Consumer usage:

```tsx
<Dropdown classes={{ item: "px-3 data-[highlighted]:bg-blue-50 data-[disabled]:opacity-40" }} />
```

Any existing key whose name encodes a state (`itemSelected`, `triggerDisabled`, `optionHighlighted`, and every sibling of that shape) is deleted and replaced by the attribute. This matches Radix, Ark, and Base UI, which is both the ecosystem convention and the idiom that codegen models already emit.

### R5 — No key for untargetable elements

A pure layout wrapper with no semantic role earns a part name only if it carries structural classes a consumer would plausibly need to change. Otherwise it is absorbed into its parent part and gets no key. "It exists in the DOM" is not sufficient grounds for a key.

**Amendment C (2026-09-02) makes the structural half binding.** A key whose default value
contains any structural utility under `src/utils/classLayers.ts` may **not** be absorbed:
absorbing it takes layout control away from the consumer, which is the failure ADR 001
exists to prevent. The first pass of the migration absorbed 105 keys; re-checking them
against `splitLayers` found **53 carrying structural classes**, and all 53 were promoted to
parts with canonical names. Absorption is now decidable by a command rather than by
judgement, and the check belongs in `fixtures.contract`.

### R4a — One validation message (Amendment B, 2026-09-02)

`error` and `success` are one part, `message`, carrying `data-state="error"` or
`data-state="success"`. R2's `errorText` and `helperText` are retired.

Checked before deciding: **all fourteen components that render a success message guard it
with `!error`**, so none can show both at once and no component needs two parts. If one ever
does, it keeps two — that is the stated exception, and it is currently unused.

### R6 — Nested components nest their classes

When a component renders another library component, the child is exposed under a key whose **value is the child's own `classes` object**, not a string:

```tsx
<InternationalPhoneInput classes={{ root: "...", flag: { root: "border-0" } }} />
```

The child's vocabulary is reused verbatim; no prefixed flat names are invented. `unstyled` propagates down the same path. This is the structural fix for GATE-HONESTY §4 — six of seven nesting sites currently forward neither.

### R7 — Deletion policy

Before 1.0: keys are renamed and deleted freely, with no deprecation cycle. Every key not present in an anatomy at 1.0 is **deleted, not deprecated**.

After 1.0: removing or renaming a key is a major. Adding one is a minor. Changing which element a key applies to is a major.

### R8 — A key ships only if a fixture renders it

Per phase 2.5, `fixtures.contract` must render every key in every anatomy at least once. A key that cannot be rendered by any prop combination is dead by definition and is removed under R7.

### R9 — One key, one element (Amendment F, 2026-09-02)

Amendment C forbade absorbing a key whose element carries structural utilities: the
consumer loses their only handle on how the box participates in layout, which is the defect
ADR 001 exists to prevent. That rule was right and its scope was wrong. It was applied to
the 53 rows being rewritten at the time and to no others, and it never examined a single
R6-nested target.

The rule generalises. **Any element that ends up sharing a key with a different element must
not merge differing structural layers.** How the table spells the row is irrelevant — an
absorb, a shared rename target and an R6 nesting all produce the same DOM outcome, and only
the absorb column was ever checked.

Re-running the test over all three populations found 30 further groups: 20 absorbs, 7 shared
rename targets and 3 R6 nestings. `Breadcrumb.ellipsisButton` was one of Amendment C's own
promotions, promoted straight into a collision with the `ellipsis` it now shared.

Two distinctions the generalised test has to make, or it reports noise:

- **Two keys on one element is not a merge.** `cn(classes.content, classes.contentInner)`
  is one div with two handles. The contract reads the component source and treats keys
  written into the same `className` expression as co-located.
- **Equal structural layers merge harmlessly.** `Pagination.navIcon` folds two icons that
  are both `w-5 h-5`; nothing is stranded.

45 rows were promoted to their own part. Names are R2 heads where one fits and qualifier-
first compounds otherwise, following Amendment C's convention; all 22 new terms are NOVEL
and claim no precedent.

**Known limit.** The test reads each key's default from its constants file, so an element
whose structural utilities are still written at the call site reports an empty layer.
`Table.headerCellContent` is `""` in constants while carrying `flex items-center` at
`Table.tsx:1198`. The test is exactly as complete as the constants ratchet, and becomes
sound when the remaining literals move (Task 3c).

## Consequences

**Accepted costs.** Every component, every constants file, every test naming a key, all 30 `*.ai.md`, `llms-full.txt`, `component-index.json`, and the AI Playground's codegen prompts and vendored bundle change in one sweep. Partial adoption is worse than none: a half-renamed vocabulary is exactly the state this ADR exists to end.

**R4 is a behaviour addition, not just a rename.** Emitting `data-*` state attributes on parts that don't currently carry them is new public surface with its own test obligations, and it must land in the same change as the key deletions it justifies.

**The playground must be regenerated in lockstep.** It generates against the old names. If the rename ships and the prompts don't, the codegen product emits keys that no longer exist — silently, since unknown keys in a `classes` object are ignored.

**Downstream: `unstyled` propagation gets a home.** R6 means propagation is a property of the key shape rather than a per-component patch, so the six known nesting bugs and every future one are covered by one contract test.

## Alternatives rejected

**Flat prefixed keys for nested components** (`tooltipRoot`, `tooltipArrow`). Rejected: mints a parallel vocabulary per parent, scales quadratically, and gives `unstyled` propagation nowhere to live.

**Keep state-variant keys.** Rejected: it is the direct cause of the surface size, it cannot express combined states (highlighted *and* disabled), and it diverges from every peer library.

**Deprecate rather than delete.** Rejected: the package is unpublished. There are no consumers to protect and a deprecation layer shipped at 1.0 would be permanent debt incurred voluntarily.
