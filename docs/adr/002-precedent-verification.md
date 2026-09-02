# ADR 002 — precedent verification ledger

**Status:** open — 27 claims await checking
**Date:** 2026-09-02

## Why this exists

Amendments A and E accept names outside R2 only if they cite a peer-library precedent.
Every one of those citations was written by an agent with **no network access and no Radix,
Ark or Zag dependency in this repo**. They are recall or reviewer assertion, not verified
fact.

These names are permanent public API from the moment they ship. A wrong precedent does not
just mislabel a row in a table — it justifies a name the library then carries forever, and
the whole point of the precedent test was to stop coinage. A recalled precedent that turns
out to be invented is worse than an honest `NOVEL`, because it launders the coinage.

**No name in this ledger may be changed on the strength of recall.** The rows marked
`recalled` are the ones to check.

## Confidence markers

| Marker | Meaning |
| --- | --- |
| `verified-in-repo` | Confirmed against a dependency present in `node_modules`, or against this repo's own source |
| `asserted-on-review` | Stated by the reviewer in the task that accepted it; cited, not independently checked |
| `recalled` | Written from the agent's model recall. **Unverified. Check before 1.0.** |

## Part names — Amendment A (`002-key-migration.json` → `vocabularyAmendments`)

16 claims. All `recalled` unless noted.

| Our name | Claimed peer part | Library | Confidence |
| --- | --- | --- | --- |
| `control` | `Combobox.Control`, `Select.Control`, `Field.Control` | Ark | recalled |
| `ellipsis` | `Pagination.Ellipsis` | Ark | recalled |
| `fallback` | `Avatar.Fallback` | Radix | recalled |
| `image` | `Avatar.Image` | Radix | recalled |
| `indicator` | `Checkbox.Indicator`; `Tabs.Indicator`; `Steps.Indicator` | Radix; Ark | recalled |
| `marker` | `Slider.Marker` | Ark | recalled |
| `monthSelect` | `DatePicker.MonthSelect` | Ark | recalled |
| `navButton` | `Pagination.PrevTrigger` / `NextTrigger` — **not a match**; we unify them as one part plus `data-side` | Ark | recalled, and deliberately divergent |
| `positioner` | `Dialog.Positioner` | Ark | recalled |
| `presetTrigger` | `DatePicker.PresetTrigger` | Ark | recalled |
| `range` | `Slider.Range`; `Progress.Range` | Radix; Ark | recalled |
| `resizeHandle` | `PanelResizeHandle` | react-resizable-panels | recalled |
| `thumb` | `Slider.Thumb`, `Switch.Thumb` | Radix | recalled |
| `track` | `Slider.Track`; `Progress.Track` | Radix; Ark | recalled |
| `valueText` | `Slider.ValueText` | Ark | recalled |
| `yearSelect` | `DatePicker.YearSelect` | Ark | recalled |

The other 36 amendment terms are marked `NOVEL` and claim no precedent, so nothing is owed
on them. `clockFace`, `clockHand`, `clockNumber`, the Table controls and `message` are in
that set.

## State attributes — Amendment E (`002-state-attribute-catalogue.json`)

12 claims.

| Our attribute | Claimed peer attribute | Library | Confidence |
| --- | --- | --- | --- |
| `data-valid` (from `data-success`) | `[data-valid]` and `[data-invalid]` on Field, Control, Label, Message | Radix Form | **asserted-on-review** — cited to the Radix Form docs, custom validation section |
| `data-invalid` (from `data-error`) | `data-invalid` | Ark Field; Radix Form | recalled |
| `data-state="open"` (from `data-open`) | `data-state="open\|closed"` | Radix | recalled |
| `data-state="open"` (from `data-expanded`) | Accordion `data-state` | Radix | recalled |
| `data-state="checked"` (from `data-checked`) | Checkbox / Switch / RadioGroup `data-state` | Radix | recalled |
| `data-state="indeterminate"` | Checkbox `data-state="indeterminate"` | Radix | recalled |
| `data-state="active"` (from `data-active`) | Tabs / Steps | Ark | recalled |
| `data-state="inactive"` (from `data-pending`) | Steps | Ark | recalled |
| `data-side` (from `data-position`) | `data-side` | Radix Popper | recalled |
| `data-today` | `data-today` on the current day | Ark DatePicker | recalled |
| `data-dragging` | `data-dragging` on the thumb | Ark Slider | recalled |
| `data-placeholder` | `data-placeholder` on an unset trigger | Radix Select | recalled |

The six attributes marked `NOVEL` — `data-clickable`, `data-sorted`, `data-pinned`,
`data-editing`, `data-resizing`, `data-filled` — claim nothing and need no check.

## Also worth checking

Two claims in `002-key-migration.json` that read as precedent but were reasoning, not
citation:

- **`connector` → `separator`**, attributed to "Ark Steps". Ark Steps does have a
  `Separator`; whether it is the same element as our step connector is the open question.
- **`heading` → `header`**, attributed to "Radix Accordion". Radix Accordion has
  `Accordion.Header`; the claim is that it wraps the trigger the way ours does.

## What to do with a failed check

Downgrade the row to `NOVEL` and keep the name, or pick the real peer name — but the name
change is a Task 3 edit, not a table edit, because by then the constants and `.ai.md` files
carry it. Cheapest to resolve now.
