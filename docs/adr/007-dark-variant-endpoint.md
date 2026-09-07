# ADR 007 — the three decisions ADR 006 was waiting on

**Status:** Accepted and applied.
**Date:** 2026-09-07
**Related:** ADR 004 (`dark:` retirement), ADR 005 (token vocabulary), ADR 006 (`dark:` closeout)

## Where it stood, re-derived

ADR 006 closed at 78 variants: 33 deliberately retained, 29 blocked on a token,
16 orphaned. Re-derived from source before anything was proposed, it was **76**
— 33 / **27** / 16. Two of the blocked ones had already been retired by
`29bd7ea`, and how they were retired is the whole argument of this document:

- `Pagination.item` was `data-[selected]:bg-cl-accent/15 dark:…/60`; it is
  `data-[selected]:bg-cl-accent-bg`, recorded at 4.50:1 light / 6.04:1 dark.
- Table's filter panel was `border-gray-200 dark:border-white/[0.08]`; it is
  `border-cl-border`.

Both went to a token that already existed. Neither needed a new value.

## The finding under the finding

The record said thirteen sites softened the accent at 20/30/50/60% and no two
agreed. They disagreed because they were **three different jobs compared as
one**. Split by job, each was unanimous — and two of the three were failing
WCAG, which is why "somebody has to pick" was the wrong frame. Nobody had to
pick a taste; somebody had to measure.

| Job | Sites | Dark, before | After | Floor |
| --- | --- | --- | --- | --- |
| Graphical fill (`bg-cl-accent` → `/30`) | 3 | **1.65:1** | **7.02:1** | 3:1 (SC 1.4.11) |
| Focus ring (`/15` → `/30`; one site 100%) | 3 | **1.60:1** | **7.31:1** | 3:1 |
| Focus border (100% → `/50`) | 3 | **2.54:1** | **7.31:1** | 3:1 |
| Accent wash behind accent text | 3 | 5.27:1 | 6.04:1 | 4.5:1 |

The minimum alpha that reaches 3:1 against the surfaces these fills sit on is
**58%**, so 30% was not a value anyone could have picked. All three fills are
solid in both themes now.

The wash was the one real decision, and it needed a second measurement:
`--cl-accent` on `--cl-accent-bg-hover` is **4.20:1 in light** — accent text on
an accent tint cannot clear AA at any alpha the tint can take. Pagination had
already solved it by deepening the text to `--cl-accent-hover` in the compound
state (**5.28:1**), and DatePicker's today button now does the same.

## The decisions

**1. Three tokens minted.**

| Token | Light | Dark | Why |
| --- | --- | --- | --- |
| `--cl-text-chrome` | `#0f1218` | 72% ink | Interface text — labels, headers, item and trigger text. 18 sites across 12 components wrote the primary step in light and one down in dark, by hand. |
| `--cl-text-chrome-quiet` | 80% ink | 52% ink | The same rule one step down: 5 sites, 4 components. |
| `--cl-bg-recessed` | 4% ink | `#050608` | The search bar inside a menu panel. Two callers, and one of them (`MultiSelectSearchableDropdown`) was painting `#0a0d12` onto a `#0a0d12` panel — 1:1, nothing at all. |

`--cl-text-chrome` is ROLE_ONLY under ADR 005 T3: it claims no relation to
`--cl-text`, and in light the two share a value, which is the same shape as
`--cl-bg-panel` equalling `--cl-bg` there. `--cl-text-chrome-quiet` and
`--cl-bg-recessed` both assert a relation and are gated as such.

**2. One token value corrected.** `--cl-bg-input` was `#050608` in dark —
identical to the page, so an input was invisible except for its border, and six
call sites patched it with a 4% ink wash. The token now holds that value. No
shipped component read it before; the demo page's own inputs did, and they move
with it.

**3. Six variants deleted outright**, because the value they were softening was
the one that cleared the floor.

## What this cost, per family

| Family | Sites | Contrast before → after | The stated consequence |
| --- | --- | --- | --- |
| Focus ring and border | 6 | 1.60:1 and 2.54:1 dark → 7.31:1 both | The focus state is **louder in dark** than it was. That is the trade for one that can be seen. |
| Graphical fills | 3 | 1.65:1 → 7.02:1 dark | Slider's range, TabPanel's indicator and TimePicker's clock dot are **brighter in dark**. Eight visual baselines moved, all dark, all these two components. |
| Accent wash + chips | 3 + 4 | 4.20:1 → 5.28:1 light on the hovered tint | The chip is an accent tint in **both** themes now instead of an ink wash in dark, and the remove control deepens to `--cl-accent-hover` on hover rather than fading to secondary text. |
| Ink borders | 6 | 10% → 8% ink in dark (1.25:1 → 1.18:1) | Borders are **fractionally quieter in dark**. Two percentage points; under the visual threshold at 1px. |
| Input surfaces | 4 | unchanged (4% ink in dark, `#ffffff` in light) | Nothing moves. The sites were already painting what the token now holds. |
| Item hover | 3 | light 5% → 4% (1.12:1 → 1.08:1); Table's stripe dark 1.08:1 → **1.25:1** | The striped row is **louder in dark**. Hover still reads on it: the two washes stack, 1.32:1 apart. |
| Recessed search bar | 2 | MSSD 1:1 → 1.04:1 in dark | MSSD's search bar is **visible for the first time**; it was painting the panel colour onto the panel. |
| Chrome text | 23 | unchanged by construction | The token holds the two values the `dark:` pair produced. Both steps are now gated on all six surfaces: 18.75/8.95:1 and 10.21/5.11:1. |
| Orphans — Avatar | 5 | 6.10:1 light / 7.00:1 dark → 9.62:1 / 7.67:1 | The overflow badge is **higher contrast in both themes**. |
| Orphans — Table search | 4 | placeholder **2.54:1 light / 3.04:1 dark** → 5.26:1 / 5.06:1 | A live AA failure, in both themes, fixed. |
| Orphans — Table resize handle | 1 | 2.54:1 light / 4.02:1 dark → 5.26:1 / 5.11:1 | The hover state is **more visible in both themes**. |
| Orphans — shimmers | 3 + 3 | Accordion 1.24/1.89:1 → 1.08/1.25:1; Table **nothing → 1.08/1.25:1** | Accordion's shimmer is quieter in dark. Table's **existed only in the JS**: its gradient was on `--fg`, the marketing namespace, which the package does not ship — `dist/shared/Table-*.js` carried the class and `dist/styles.css` had no rule for it. |

**76 → 6.** What remains, enumerated in `dark-variants.contract` with a reason
each: Breadcrumb's separator and TimePicker's hover, which step *up* in dark;
two `dark:shadow-none`; the Modal scrim; and Slider's thumb, which wants a value
no token holds and has one caller.

## The four gates this closes

1. **SC 1.4.11 was not among the ten criteria gated**, which is how 1.60:1
   shipped. It is measured now over all 428 fixtures in both themes — focus
   indicators as a before/after diff, accent fills by solving for the alpha that
   composites the accent onto the element's own background — and at the token
   level in `contrast.contract`, so a revaluation cannot take the ring under the
   floor between two browser runs. ACCESSIBILITY.md moves 1.4.11 to Partially
   supports and **2.4.7 down from Supports**: the indicator it certified had
   never been measured, and 767 focusable elements still change nothing visible
   on focus.
2. **`::placeholder` was invisible to the painted sweep**, which reads
   `style.color`. It reads the pseudo-element too now. Its first run measured
   **nothing** and reported zero findings — the plant that proves the pass can
   fail was written before the number was believed, and the sweep now reports
   `placeholders=115` alongside its findings so a zero cannot be read as a pass.
   Beyond Table: **nothing**. Table's search box was the only one.
3. **The two new text tokens entered `contrast.contract` before any site moved
   onto them.** A token nothing measures is where this class of defect lives.
4. **A class can ship in the JS with no rule in the CSS**, and no gate could see
   it. `constants.contract` now reads every class-shaped literal in the shipped
   source and faults any colour namespace absent from the `@theme` block of
   `src/styles/tokens.css`. Swept: **one instance**, Table's shimmer, the one
   already found. The self-check runs the shimmer exactly as it shipped.

## Not in scope, recorded

- The marketing surface (`SiteHeader`, `SiteFooter`, `CatalogSection`) draws its
  focus rings at `ring-cl-accent/40`. It is not part of the package and no gate
  here reads it.
- `Table.tsx` has three `text-gray-400` / `text-gray-500` infinite-scroll
  labels with no `dark:` variant, so they were never in this inventory. Same
  defect class, unfixtured, unmeasured.
