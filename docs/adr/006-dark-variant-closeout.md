# ADR 006 — `dark:` closeout

**Status:** Accepted. The phase is closed at a declared endpoint.
**Date:** 2026-09-08
**Related:** ADR 004 (`dark:` retirement), ADR 005 (token vocabulary)

> **Superseded in part by ADR 007 (2026-09-07).** The endpoint below held for two days. The
> three decisions this document deferred were taken, and two of them turned out not to be
> decisions: the softened accent was failing SC 1.4.11 at 1.65:1 and the focus ring at
> 1.60:1, so the value that cleared the floor was the only one available. 70 of the 76
> variants that were left are gone; the ceilings here are replaced by an enumerated list of
> six. The classification below is kept as the record of what was known then.

## Where it ended

| Group | Start | End | Retired |
| --- | --- | --- | --- |
| A — literal no-op, same token both sides | 150 | **0** | 150 |
| B — token swap, a different `cl-` token in dark | 167 | **60** | 107 |
| C — raw palette in dark | 44 | **18** | 26 |
| **Total** | **361** | **78** | **283** |

283 of 361 retired, 78 declared. The ratchet is set to that endpoint, so it
holds the line rather than implying the remainder is unfinished work.

**The endpoint is not "everything left".** Of the 78, only 29 are genuinely
blocked on a token decision. 33 are deliberate and 16 are orphans of a palette
that predates the token system. Framing all 78 as a backlog would have been the
easier and less true thing to write.

## The split

| Class | Sites | What it means |
| --- | --- | --- |
| **Deliberately retained** | 33 | A decision was made and recorded. The variant stays. |
| **Blocked on a token** | 29 | The pair is real and repeated, but no token holds both values. |
| **Orphaned** | 16 | Predates the token system; no role to attach to. |

## Deliberately retained — 33

**Text legibility, 29 sites.** Every one steps the text scale in dark rather
than reusing the light value, and both endpoints clear AA — `contrast.contract`
gates all three text tokens against all six surfaces in both themes, so these
are judgements about weight, not legality.

| n | Pair | Note |
| --- | --- | --- |
| 18 | `text-cl-text` + `dark:text-cl-text-secondary` | The primary-text pair. Decided in ADR 004 §4: revaluing `--cl-text` would restyle every piece of primary text and force a contrast re-baseline for no correctness gain. |
| 5 | `text-cl-text-secondary` + `dark:text-cl-text-tertiary` | The same judgement one step down the scale. |
| 2 | `text-cl-accent` + `dark:text-cl-text` | An accent label reads as plain text in dark, where the accent is less legible on a near-black ground. |
| 2 | `hover:text-cl-accent` + `dark:hover:text-cl-text-secondary` | As above, on hover. |
| 1 | `text-cl-text-tertiary` + `dark:text-cl-text-secondary` | Breadcrumb steps *up* in dark. |
| 1 | `hover:text-cl-text-secondary` + `dark:hover:text-cl-text` | TimePicker steps up on hover. |

**Not a colour question, 4 sites.**

| n | Pair | Note |
| --- | --- | --- |
| 2 | `shadow-black/[0.04]` + `dark:shadow-none` | A drop shadow does not read on a near-black surface. Removing it in dark is the intent, and no token expresses "a shadow in one theme and none in the other". |
| 1 | `bg-black/60` + `dark:bg-black/70` | Modal's scrim. A token was considered and **declined** — see below. |
| 1 | `dark:bg-cl-bg-elevated` with no light counterpart | A dark-only surface. There is no light value for a token to hold. |

## Blocked on a token — 29

Each pair below is real and repeated. None has a token, and none should be
minted from this document without the decision ADR 005 requires.

**The accent scale in dark, 13 sites.** Every one softens the accent in dark,
and **no two agree on how much** — 20%, 30%, 50%, 60%. That disagreement is the
finding: a token cannot be derived from usage when usage has not converged. It
needs a designer to say what the accent's dark scale is, after which
`--cl-accent-bg` and `--cl-accent-bg-hover` may already cover most of it.

| n | Pair |
| --- | --- |
| 3 | `bg-cl-accent` + `dark:bg-cl-accent/30` |
| 2 | `bg-cl-accent/15` + `dark:bg-cl-text/10` |
| 2 | `focus-within:ring-cl-accent/15` + `dark:focus-within:ring-cl-accent/30` |
| 2 | `focus-within:border-cl-border-input-focus` + `dark:…/50` |
| 1 | `focus:ring-cl-accent` + `dark:focus:ring-cl-accent/30` |
| 1 | `focus:border-cl-border-input-focus` + `dark:…/50` |
| 1 | `hover:bg-cl-accent/15` + `dark:hover:bg-cl-accent/20` |
| 1 | `data-[selected]:bg-cl-accent/15` + `dark:…/60` |

**Ink washes on borders and input surfaces, 14 sites.** The same shape as the
hovered-item wash this ADR did mint, but on different properties and at
different alphas, and the alphas again disagree (4%, 8%, 10%).

| n | Pair | Would need |
| --- | --- | --- |
| 4 | `border-cl-border` + `dark:border-cl-text/10` | light `rgba(15,18,24,0.1)` / dark `rgba(237,239,244,0.1)` |
| 3 | `bg-white` + `dark:bg-cl-text/4` | light `#ffffff` / dark `rgba(237,239,244,0.04)` |
| 2 | `border-cl-border-input` + `dark:border-cl-text/10` | light `rgba(15,18,24,0.15)` / dark `rgba(237,239,244,0.1)` |
| 2 | `hover:bg-black/5` + `dark:hover:bg-white/10` | light `rgba(0,0,0,0.05)` / dark `rgba(255,255,255,0.1)` |
| 1 | `bg-transparent` + `dark:bg-cl-text/4` | light `transparent` / dark `rgba(237,239,244,0.04)` |
| 1 | `bg-gray-50` + `dark:bg-white/[0.04]` | light `#f9fafb` / dark `rgba(255,255,255,0.04)` |
| 1 | `border-gray-200` + `dark:border-white/[0.08]` | light `#e5e7eb` / dark `rgba(255,255,255,0.08)` |

Two of those fourteen (`bg-gray-50`, `border-gray-200`) look like orphans
because their light side is written as a raw Tailwind grey. They are not:
`gray-50` is 1.4 units from `--cl-bg-elevated`'s light value and `gray-200` is
3.7 from `--cl-border`'s, composited over white. They are token values spelled
by hand, so an ink-wash token would cover them once the light side moves onto
the token it already matches.

**Two singletons, 2 sites.** `bg-cl-bg-hover` + `dark:bg-cl-bg` in
SearchableDropdown, and `bg-white` + `dark:bg-cl-text` in Slider. Both want a
pair no token holds, and one site each is not evidence for public API.

## Orphaned — 16

Nothing in the `--cl-*` set is within 100 units of these. They are not diverging
from the token system; they never joined it.

| n | Pair | Component |
| --- | --- | --- |
| 3 | `bg-gray-200` + `dark:bg-gray-700` | Accordion, Avatar |
| 3 | `text-gray-600` + `dark:text-gray-300` | Avatar |
| 2 | `border-gray-300` + `dark:border-gray-600` | Avatar, Table |
| 1 | `bg-gray-100` + `dark:bg-gray-600` | Accordion |
| 1 | `bg-inherit` + `dark:bg-gray-800` | Table |
| 1 | `text-inherit` + `dark:text-gray-100` | Table |
| 1 | `placeholder-gray-400` + `dark:placeholder-gray-500` | Table |
| 1 | `group-hover/resize:bg-gray-400` + `dark:…gray-500` | Table |
| 3 | `from-`/`via-`/`to-` + `dark:…fg/[0.10]` | Table — a gradient on `--fg`, the marketing token set, not `--cl-*` at all |

Moving them is a visual decision about eleven specific elements, not a
vocabulary one, and it is not `dark:` work.

## The two token candidates

### `--cl-bg-item-hover` — minted

**11 sites across 7 components** — Breadcrumb, DatePicker, InternationalPhoneInput,
MultiSelectDropdown, MultiSelectSearchableDropdown, Pagination, Table.

`--cl-bg-item-hover: rgba(15, 18, 24, 0.04)` light /
`rgba(237, 239, 244, 0.1)` dark.

ADR 004 gave `--cl-bg-hover` a solid `#0a0d12` in dark because 37 sites wanted a
raised panel on hover. These 11 want the translucent wash it used to be. They
are two roles that had been sharing one name: hovering a *panel* and hovering an
*item in a list*. The 37 kept the name; the 11 get their own.

Under ADR 005: category `bg`, role `item-hover`, so it satisfies T1. **Role-only,
not relational** — it asserts nothing about another token's value, and is
classified accordingly in `token-vocabulary.contract`. Added to
`contrast.contract`'s surface list at the same time, since text sits on it; it
is translucent, so the gate composites it over `--cl-bg` before measuring. 33
assertions became 39, all passing.

Ledger entry: **NOVEL**. No peer is cited. The internal family — `--cl-bg`,
`--cl-bg-elevated`, `--cl-bg-hover`, `--cl-bg-input`, `--cl-bg-panel` — carries
the name without one.

Eight of the 11 asked for a 10% wash and three for 6%; the token holds 10%, so
those three shift. Stated rather than smoothed over, and measured: see below.

### `--cl-overlay` — declined

**One call site.** Modal's `bg-black/60` + `dark:bg-black/70`.

A scrim is a real role and no token names it, but one site is not evidence for
public API — it is evidence that one component needed a value. Minting a token
so that a single `dark:` variant can be deleted inverts the point of the
exercise. The variant is recorded above as deliberately retained; if a second
scrim appears, the case changes.

## Proof

Both captures, before and after the `--cl-bg-item-hover` move:

| Capture | Elements | Changed, carried the override | Changed, carried none |
| --- | --- | --- | --- |
| Resting | 6,414 | 2 | **0** |
| Hovered | 526 | 64 | **0** |

The hovered readings are where the change lives, as expected for a hover token:
60 moved from a white-alpha wash to `rgba(237, 239, 244, 0.1)` and 4 from a
`cl-text` alpha to the same. Zero collateral in either capture.

`contrast.contract` was re-run after the mint and passes on its own terms.
