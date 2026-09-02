# ADR 002 — precedent verification ledger

**Status:** 21 claims verified against live docs; 1 still unchecked; 3 divergences recorded
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

## Verified against live docs

### Ark Slider — `https://ark-ui.com/docs/components/slider`
Parts: Root, Label, ValueText, Control, Track, Range, Thumb, HiddenInput, MarkerGroup, Marker.

| Our name | Peer part | Marker |
| --- | --- | --- |
| `range` | `Slider.Range` | **VERIFIED** |
| `track` | `Slider.Track` | **VERIFIED** |
| `thumb` | `Slider.Thumb` | **VERIFIED** |
| `marker` | `Slider.Marker` | **VERIFIED** |
| `valueText` | `Slider.ValueText` | **VERIFIED** |
| `control` | `Slider.Control` (also Combobox, Select, Field) | **VERIFIED** |

Ark also ships `Slider.MarkerGroup`. Recorded in `vocabularyAmendments` as the available
name should a marker container ever need one; nothing claims it today.

### Ark DatePicker — `https://ark-ui.com/docs/components/date-picker`

| Our name | Peer part | Marker |
| --- | --- | --- |
| `clearTrigger` | `DatePicker.ClearTrigger` | **VERIFIED** |
| `positioner` | `DatePicker.Positioner` | **VERIFIED** |
| `presetTrigger` | `DatePicker.PresetTrigger` | **VERIFIED** |

`clearTrigger` was the largest single blocker at 7 rows. With it verified, the button/trigger
family is settled on Ark's Trigger spelling with two of its three members confirmed.

### Radix Avatar — `https://www.radix-ui.com/primitives/docs/components/avatar`
Parts: Root, Image, Fallback.

| Our name | Peer part | Marker |
| --- | --- | --- |
| `fallback` | `Avatar.Fallback` | **VERIFIED** |
| `image` | `Avatar.Image` | **VERIFIED** |

### Radix Checkbox — `https://www.radix-ui.com/primitives/docs/components/checkbox`
Parts: Root, Indicator.

| Our name | Peer part | Marker |
| --- | --- | --- |
| `indicator` | `Checkbox.Indicator` | **VERIFIED** |

**Citation corrected.** The old row claimed `Tabs.Indicator` under Radix. Radix Tabs has no
Indicator part — it is Root/List/Trigger/Content. Radix's Indicator parts are Checkbox and
NavigationMenu; `Tabs.Indicator` is Ark's. The name was right and the attribution was not,
which is the failure mode this ledger exists to catch: a correct name resting on a citation
nobody had opened.

### Radix Accordion
Parts: Root, Item, Header, Trigger, Content.

| Our name | Peer part | Marker |
| --- | --- | --- |
| `header` | `Accordion.Header` wrapping the trigger | **VERIFIED** |

### Radix Form

`data-valid` and `data-invalid` sit on Field, Control, Label and **Message**. The Message
placement is why Amendment B's message part is the right home for them.

### Ark Dialog — `https://ark-ui.com/docs/components/dialog`
Parts: Root, Trigger, Backdrop, Positioner, Content, Title, Description, CloseTrigger.

| Our name | Peer part | Marker |
| --- | --- | --- |
| `closeTrigger` | `Dialog.CloseTrigger` | **VERIFIED** |

### Ark Steps — `https://ark-ui.com/docs/components/steps`
Parts: Root, List, Item, Trigger, Indicator, Separator, Content, CompletedContent, PrevTrigger, NextTrigger.

| Our name | Peer part | Marker |
| --- | --- | --- |
| `separator` | `Steps.Separator` | **VERIFIED** |

### Radix Dialog — `https://www.radix-ui.com/primitives/docs/components/dialog`

| Our name | Peer part | Marker |
| --- | --- | --- |
| `overlay` | `Dialog.Overlay` | **VERIFIED** |

`overlay` was previously unattributed. Radix ships `Overlay` where Ark ships `Backdrop`; we
follow Radix, and R2 already carried the name.

## Divergences

| Name | Marker | Reason |
| --- | --- | --- |
| `navButton` | **DIVERGENT** | Ark splits `PrevTrigger` / `NextTrigger`. Unified here as one part carrying `data-side`: the two controls are structurally identical, so splitting them would mint a key with no reachable difference, and R4 already resolves direction as an attribute. Recorded as DIVERGENT rather than NOVEL because Ark demonstrably ships these parts. |
| `day` | **DIVERGENT** | Ark's calendar cell is `TableCell` + `TableCellTrigger`; ours is a single button, so adopting the split would mint two keys for one element. |
| `indicatorTrigger` | **DIVERGENT** | Ark Steps ships a single `Trigger`. We ship a second control because `labelPosition="bottom"` puts only the indicator inside the button and the label beside it, while the other layouts put both inside. One key would style two structurally different controls, which R9 forbids. |

## Still RECALLED — this blocks the rename

1 row, 1 name.

| Our name | Exact peer part claimed | Library | Row blocked |
| --- | --- | --- | --- |
| `resizeHandle` | `PanelResizeHandle` | react-resizable-panels | 1 — `ResizablePanel.handle` |

## Stepper anatomy vs Ark Steps

Checked before the rename lands, because `itemRow` would otherwise have shipped as an
unremarked coinage.

**The shapes correspond.** Ark is `Item > Trigger > Indicator`, with `Separator` inside
`Item`. Ours is `<li> > button > indicator`, with the connector inside the `<li>`
(`Stepper.tsx:407-421`). Same nesting, same roles:

| Ark part | Our element | Mapping |
| --- | --- | --- |
| `Item` | the `<li>` | `stepContainer` → `item` — correct |
| `Trigger` | `<button onClick onKeyDown>` wrapping indicator + label | `step` → **corrected to `trigger`** |
| `Indicator` | the numbered/ticked circle | `indicator` → `itemIndicator` — nested inside the trigger, as Ark has it |
| `Separator` | the connector, a sibling inside the `<li>` | `connector` → `separator` — correct |

`step` was mapped to `itemRow`, which was **wrong rather than divergent**. The element is a
`<button>` carrying `onClick` and `onKeyDown` (a `<div role="group">` when the step is not
interactive), and it wraps the indicator — Ark's `Trigger` exactly. A DIVERGENT marker would
have preserved a misnomer by explaining it; the fix is R2's `trigger`, which was free in
Stepper. `itemRow` is retired.

The one real divergence is `indicatorTrigger`, recorded above.

## Still RECALLED — not blocking a rename

Already in use, or attribute values; no rename waits on them.

| Our name | Exact peer part claimed | Library |
| --- | --- | --- |
| `ellipsis` | `Pagination.Ellipsis` | Ark |
| `monthSelect` | `DatePicker.MonthSelect` | Ark |
| `yearSelect` | `DatePicker.YearSelect` | Ark |
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
