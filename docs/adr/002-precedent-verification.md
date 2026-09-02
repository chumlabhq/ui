# ADR 002 — precedent verification ledger

**Status:** 5 claims resolved against live docs; 26 still unchecked
**Date:** 2026-09-02

## Why this exists

Amendments A and E accept names outside R2 only if they cite a peer-library precedent.
Every one of those citations was written by an agent with no network access and no Radix,
Ark or Zag dependency in this repo. These names are permanent public API from the moment
they ship, and a wrong precedent does not merely mislabel a row — it launders a coinage
into a borrowed name and the library carries it forever.

**No name in this ledger may be changed on the strength of recall.**

## Confidence markers

The scheme now separates two claims that the old one collapsed. "No peer has this" and
"peers have this and we chose otherwise" are different statements, and only the second one
obliges us to justify the divergence.

| Marker | Meaning |
| --- | --- |
| `VERIFIED` | Confirmed against the peer's live documentation or a dependency in this repo, with the URL recorded |
| `RECALLED` | Written from model recall. **Unverified — blocks the rename.** |
| `DIVERGENT` | The peer ships this part and we deliberately chose otherwise. Requires a stated reason, not a citation |
| `NOVEL` | No peer ships an analogue; the name is ours and claims nothing |

## Resolved this round

Checked against `https://ark-ui.com/docs/components/date-picker`.

| Name | Marker | Note |
| --- | --- | --- |
| `positioner` | **VERIFIED** | Ark ships `Positioner` |
| `control` | **VERIFIED** | Ark ships `Control` |
| `presetTrigger` | **VERIFIED** | Ark ships `PresetTrigger` |
| `navButton` | **DIVERGENT** | Ark splits `PrevTrigger` / `NextTrigger`. The old ledger cited Ark *for* `navButton`, which was wrong as written. Unified here as one part carrying `data-side`, because the two controls are structurally identical — splitting them would mint a key with no reachable difference, and R4 already resolves direction as an attribute. Recorded as DIVERGENT rather than NOVEL: Ark demonstrably has these parts, which is the definition of a divergence, not a novelty. |
| `day` | **DIVERGENT** | Previously marked NOVEL. Ark's calendar cell is `TableCell` + `TableCellTrigger`; ours is a single button, so adopting the split would mint two keys for one element. |

`data-valid` was verified in the previous round against the Radix Form docs (custom
validation section), which puts `[data-valid]` and `[data-invalid]` on Field, Control,
Label and **Message** — the last of which is why Amendment B's message part is the right
place for them.

### The button/trigger family

`presetTrigger`, `clearButton` and `closeButton` were three spellings of one idea. Ark is
the only peer that ships all three (`PresetTrigger`, `ClearTrigger`, `CloseTrigger`), so the
family is unified on **Trigger**; the Button spelling would have mixed Ark with Radix
Dialog's `Close`. `clearButton` → `clearTrigger` and `closeButton` → `closeTrigger` are
recorded in the migration table, but only `presetTrigger` is VERIFIED — the other two are
RECALLED and appear in the blocking list below.

## Still RECALLED — these block renames

20 rows across 10 names cannot be renamed until these are checked. Exact peer part claimed:

| Our name | Exact peer part claimed | Library | Rows blocked |
| --- | --- | --- | --- |
| `clearTrigger` | `ClearTrigger` | Ark | 7 |
| `range` | `Progress.Range`; `Slider.Range` | Ark; Radix | 4 |
| `closeTrigger` | `Dialog.CloseTrigger` | Ark | 2 |
| `header` | `Accordion.Header` wrapping the trigger | Radix | 1 |
| `fallback` | `Avatar.Fallback` | Radix | 1 |
| `resizeHandle` | `PanelResizeHandle` | react-resizable-panels | 1 |
| `marker` | `Slider.Marker` | Ark | 1 |
| `valueText` | `Slider.ValueText` | Ark | 1 |
| `separator` | `Steps.Separator` as our step connector | Ark | 1 |
| `indicator` | `Checkbox.Indicator`; `Tabs.Indicator`; `Steps.Indicator` | Radix; Ark | 1 |

## Still RECALLED — not currently blocking a rename

These names are already in use or are attribute values, so no rename waits on them, but the
citation is still unchecked.

| Our name | Exact peer part claimed | Library |
| --- | --- | --- |
| `ellipsis` | `Pagination.Ellipsis` | Ark |
| `image` | `Avatar.Image` | Radix |
| `monthSelect` | `DatePicker.MonthSelect` | Ark |
| `yearSelect` | `DatePicker.YearSelect` | Ark |
| `thumb` | `Slider.Thumb`, `Switch.Thumb` | Radix |
| `track` | `Slider.Track`; `Progress.Track` | Radix; Ark |
| `data-invalid` | `data-invalid` on Field | Ark; Radix Form |
| `data-state="open"` | `data-state="open\|closed"` | Radix |
| `data-state="checked"` | Checkbox / Switch / RadioGroup | Radix |
| `data-state="indeterminate"` | `data-state="indeterminate"` | Radix |
| `data-state="active"` | Tabs / Steps | Ark |
| `data-state="inactive"` | Steps | Ark |
| `data-side` | `data-side` | Radix Popper |
| `data-today` | `data-today` | Ark DatePicker |
| `data-dragging` | `data-dragging` on the thumb | Ark Slider |
| `data-placeholder` | `data-placeholder` on an unset trigger | Radix Select |

## NOVEL

Amendment F added 22 promotion names — `searchControl`, `itemControl`, `itemRow`,
`collapsedItem`, `ellipsisTrigger`, `todayTrigger`, `triggerRow`, `headerCellText`,
`pinnedList`, `pinnedRightList`, `pinnedRightRegion`, `loadingFooter`, `loadingRow`,
`clockHours`, `clockMinutes`, `clockSeparator`, `clockContent`, `indicatorTrigger`,
`subSearchIcon`, `subSearchInput`, `subSearchControl`, `itemIcon` — all qualifier-first
compounds of an R2 or VERIFIED head. They claim no precedent and need no check.

`clockFace`, `clockHand`, `clockNumber` and the Table controls remain NOVEL. `day` has moved
out of this set to DIVERGENT.
