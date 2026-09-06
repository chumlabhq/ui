# ADR 002 — closeout

**Status:** closed with a stated remainder
**Date:** 2026-09-04

This is the document the next phase reads and the one a consumer's questions land on. It
should answer "why is this key named this" without anyone rereading the branch history.

## Where the vocabulary ended

| | |
| --- | --- |
| Public `classes` keys | **397** across **38** anatomies |
| Started at | 523 across 35 |
| Amendment terms recorded | 98 |

38 anatomies, not 35: `AccordionShimmer`, `AvatarShimmer` and `CountryFlagShimmer` are
reachable from the package root and rendered standalone in the demos, so they are components
in their own right rather than parts of their parent. `MultiSelectDropdownShimmer` was the
opposite case — never rendered without its parent, never imported standalone — and was
un-exported instead, shrinking the API.

397 is higher than the migration table's predicted 369 for reasons each recorded below in
"What it did not achieve", and because 3c and 4 minted keys the original table never
contemplated: elements whose styling had been call-site literals had no key to predict.

## Precedent ledger, by marker

| Marker | Count | Meaning |
| --- | --- | --- |
| **VERIFIED** | 39 | Confirmed against the peer's live docs, URL recorded |
| **NOVEL** | 53 | No peer ships an analogue; the name is ours and claims nothing |
| **DIVERGENT** | 4 | The peer ships the part and we chose otherwise, with a stated reason |
| **RECALLED** | 2 | Written from model recall, still unchecked |

The four divergences, each with its reason, are the ones worth knowing:

- **`navButton`** — Ark splits `PrevTrigger` / `NextTrigger`. Unified here as one part with
  `data-side`, because the two controls are structurally identical and splitting would mint a
  key with no reachable difference.
- **`day`** — Ark's calendar cell is `TableCell` + `TableCellTrigger`. Ours is a single
  button, so the split would mint two keys for one element.
- **`headerRow`** — TanStack Table calls it `headerGroup`, which names the data role rather
  than the element. TanStack is headless and has no DOM parts, so it is not a peer for
  element names at all; that finding applies to every Table part.
- **`indicatorTrigger`** — Ark Steps ships a single `Trigger`. We ship a second because
  `labelPosition="bottom"` puts only the indicator inside the control while the other layouts
  put the label in too; one key would style two structurally different controls, which R9
  forbids.

The two still RECALLED are `resizeHandle` and `closeTrigger`'s Ark citation. `resizeHandle`
blocks one rename; see below.

## Literals: 151, and why the split matters

| | Structural | Decorative | Total |
| --- | --- | --- | --- |
| Remaining call-site literals | **81** | **70** | **151** |

Under R10 these are not one pile. A structural literal is applied in both modes by
definition, so `unstyled` was never going to strip it and the consumer loses nothing — it is
untidy, not broken, and not worth permanent API to remove. A decorative one is a real defect.
The two ratchets in `constants.contract` are tracked separately for exactly this reason: only
one of them is a bug count.

## Conditionals: 61 remaining, all deliberate

R10's second clause splits them the same way. A conditional switching **decoration** is
consumer-facing state and became a `data-` variant on a keyed element. A conditional
switching **layout** is internal implementation.

| Component | Layout (staying) | Why nobody styles it |
| --- | --- | --- |
| Table | 8 | `hasPinnedColumns ? "grid" : "flex"`, `enableColumnResizing ? "table-fixed" : "w-full"` — how the grid arranges itself |
| Stepper | 6 | `orientation === "horizontal"` row/column switches |
| ResizablePanel | 4 | handle axis and edge placement |
| Drawer, CascadingDropdown, CountryFlag, Input, OtpInput, RadioButton, TextArea, TimePicker | 1–2 each | `fullWidth`, `modal`, submenu side |

The decoration-switching remainder sits on elements that still have no key, concentrated in
Drawer (7) and Table (8). Those need a key first; they are not blocked on naming or on
attributes.

**This is an endpoint, not a backlog.** Minting keys for the layout conditionals would grow
the public API to satisfy a number.

## Waivers still standing — 18

Four classes, and the distinction between them is the point.

**Dead — grep-confirmed, zero source references (9).** `CascadingDropdown.option`,
`.optionSelected`, `.optionFocused`, `.optionDisabled`; `DatePicker.monthDropdown`,
`.yearDropdown`, `.navButtonDisabled`, `.dayHover`; `RadioButton/RadioButton.error` and
`.success` (the group owns both messages).

**Attempted and still unreachable (4).** These have real source references, unlike the dead
set, so they must not be deleted on the strength of this record:
`CascadingDropdown.menuItemSelected` and `.menuItemDisabled` (menuItem* appears to apply only
to a path no prop combination reaches), `.submenuItemFocused` (needs real keyboard
navigation), and `Table.input` (a fixture with `editable` + `editableColumns` + `onCellEdit`
and a `fireEvent.doubleClick` did not open edit mode).

**Browser tier (2).** `Slider.thumbActive` — gated on `setPointerCapture`, which jsdom does
not implement; asserted in `e2e/slider.spec.ts`. `DatePicker.markerTooltip` — needs a real
hover plus positioning.

> **Re-attempted 2026-09-07, and this whole section is now history.** Of the seventeen keys
> the record carried, sixteen had already been deleted from the API by this migration — the
> waivers outlived the keys, and nothing failed, because a waiver for a key that does not
> exist gates nothing. The browser-tier re-attempt used the fixture page's new
> `?classes={…}` probe with real interactions (`e2e/waived-keys.spec.ts`):
> `Table.input` is reachable and stays; `DatePicker.markerTooltip` is not — a real hover does
> open the tooltip, but `useMarkerTooltip` writes a literal class string and never reads the
> value threaded to it, so the key had no sink — and is deleted. `fixtures.contract` now
> fails on a waived key that is not in the component's classes map.

**Blocked on a named phase (1).** `InternationalPhoneInput.countrySelectOptionSelected` —
kept, not deleted; its replacement route is R6-nested and deleting the child's
`optionSelected` removed the sink it fed.

`DatePicker.dayFocused` was in this set and is now resolved: ADR 003's focus slice gave the
panel a focus trap and the grid a roving tabindex, so a focused day exists and
`data-highlighted` is reachable. `.dropdownItemSelected` resolved with it — its recorded
cause ("marks its selection through the same focus path") was wrong. The month menu's
selection is `option.value === value`, never focus-gated; it needed the menu opened, which a
fixture already did. Both keys are deleted and both now generate a passing case in
`state-replacement.contract`.

Fifteen keys were wrongly waived at some point on this branch, every one with a specific,
plausible, invented reason. Every reason above states what was actually attempted.

## What ADR 002 did not achieve

- **Four planned deletions were held back.** `CascadingDropdown.content` is not dead — `menu`
  took that name and it has five source references; the pre-migration dead list was stale.
  `DatePicker.dayFocused` and `.dropdownItemSelected` were blocked on the a11y phase and
  were deleted there; two of the four are resolved.
  `InternationalPhoneInput.countrySelectOptionSelected` is blocked on Task 4's nesting.
- **`ResizablePanel.handle` was never renamed to `resizeHandle`.** Its precedent
  (react-resizable-panels `PanelResizeHandle`) is still RECALLED, and no name changes on
  recall. One row, unapplied.
- **`AccordionShimmer`, `AvatarShimmer` and `CountryFlagShimmer` have no
  `component-index.json` entry.** `registry.tsx` resolves every entry there to
  `src/components/<name>/index.ts`, and they live inside their parent's directory. The
  contract tier already discovers them from the parent barrel, the same route
  `Loader/DotLoader` takes, but the index's directory convention has to change before they
  can be listed.
- **151 literals remain**, 81 structural (deliberate, per R10) and 70 decorative (real debt,
  bounded by the ratchet).
- **Table's bundle is still over its ceiling** — 15.72 KB exclusive against 12 KB. The
  migration added ~0.3 KB; the breach predates it and is a separate problem.
- **`AvatarShimmer`'s `asChild` prop was removed**, not fixed. It rendered a childless box, so
  `Slot` had nothing to clone and it always returned null.
- **Outside this repo, untouched and unverified**: `chumlab-be`'s codegen prompts and `eval/`
  set. The eval fixtures are the risk — an unknown key in a `classes` object is ignored, so a
  stale fixture passes while the product generates dead keys. Listed in
  `002-playground-stale-keys.md`.

## The gates that hold it

Nine contracts, each with self-checks that plant the defect they exist to catch:
`key-migration` (R9, including the ancestor clause), `key-uniqueness` (one key, two
elements — at render time), `key-source` (two keys, one source), `state-replacement`
(computed style under adversarial CSS order), `state-attributes`, `fixtures`, `unstyled`
(including a source read for structural utilities behind an `unstyled` guard), `constants`
(two ratchets), and `reduced-motion`.
