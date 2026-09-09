# ADR 005 — the `--cl-*` token vocabulary

**Status:** Accepted
**Date:** 2026-09-08
**Related:** ADR 002 (`classes` key vocabulary), ADR 004 (`dark:` retirement)

## Context

ADR 002 governs the names of anatomy parts, because they are public API and a
wrong name ships forever. Design tokens are public API in exactly the same way —
a consumer writes `bg-cl-bg-elevated` or reads `var(--cl-bg-elevated)` — and
nothing governed them at all.

The cost showed up immediately. ADR 004 revalued `--cl-bg-elevated`'s light value
to `#ffffff` to collapse 26 `dark:` variants. `--cl-bg` in light is already
`#ffffff`, so a token named *elevated* became identical to the surface it claims
to sit above. Nothing failed. 51 elements that never asked for it lost their
tint, and the only reason it was caught is that the slice happened to include a
blast-radius measurement.

That is the same defect class ADR 002's ledger exists for — a name that stopped
being true — one layer down, and ungoverned.

## Decision

### T1 — `--cl-<category>-<role>`

Derived from the set that already exists, not invented for this document. The
categories in use are `bg`, `text`, `border`, `accent`, `on-accent`, `success`,
`warning`, `error`, `code`, `radius`, `shadow`. A new token extends an existing
category unless it genuinely opens a new one, and the segment after the category
names the **role** the token plays, not the appearance it happens to have.

`--cl-bg-panel`, not `--cl-bg-white`. The second is a fact about today's value
and stops being true the moment the value changes, which is how this started.

### T2 — a token's name must remain true of its value

The rule the ledger and the gate both serve. A name that asserts something —
that a surface is *elevated*, that a border is *strong*, that a colour is the
*hover* form of another — asserts it in **every** theme, and the assertion is
checkable.

Names that assert nothing beyond a role are not subject to this: `--cl-bg-panel`
may equal `--cl-bg` because "panel" claims no relationship to the base surface.
That is a real consequence and worth stating plainly: **in light, the panel
surface is the same colour as the page, and a panel is distinguished by its
border alone.** If that becomes untenable the fix is a value change or a new
token, not a rename.

### T3 — relational names are gated; role names are enumerated

`src/__tests__/contracts/token-vocabulary.contract.test.ts` holds both halves.
Every token must appear in exactly one list, so a token added without being
classified fails the gate rather than slipping past it.

### T4 — the same confidence markers as ADR 002

`VERIFIED` (checked against a peer's live documentation, URL recorded),
`RECALLED` (written from model recall — **not** a justification on its own),
`DIVERGENT` (a peer ships this and we chose otherwise, with a reason), `NOVEL`
(no peer analogue; the name is ours and claims nothing).

A token may ship on the internal convention alone. What it may not do is cite a
peer it has not checked.

## The relational claims

Gated. Each holds in both themes today.

| Token | Claim | Against |
| --- | --- | --- |
| `--cl-bg-elevated` | sits above the base surface | `--cl-bg` |
| `--cl-bg-hover` | replaces a surface on hover, so must be distinguishable from it | `--cl-bg` |
| `--cl-border-strong` | stronger than the default border | `--cl-border` |
| `--cl-border-input-hover` | the hover form of the input border | `--cl-border-input` |
| `--cl-border-input-focus` | the focus form of the input border | `--cl-border-input` |
| `--cl-accent-hover` | the hover form of the accent | `--cl-accent` |
| `--cl-accent-bg-hover` | the hover form of the accent background | `--cl-accent-bg` |
| `--cl-on-accent` | is legible *on* the accent, so cannot be the accent | `--cl-accent` |
| `--cl-radius-sm/md/lg` | an ordered scale | each other |

Two tokens deliberately **not** on this list, both of which currently share a
value with another token in one theme:

- `--cl-border-input` equals `--cl-border` in dark. "input" is a role, not a
  relation — the input border may match the default border and could diverge
  later without either name becoming false.
- `--cl-bg-panel` equals `--cl-bg` in light, per T2 above.

Text scale separation (`secondary` vs `tertiary`) is already gated by
`contrast.contract`, which asserts a dL\* floor rather than mere inequality.
It is not duplicated here.

## Ledger

| Token | Marker | Note |
| --- | --- | --- |
| `--cl-bg-panel` | **NOVEL** | Minted by ADR 004 for the panel role. Justified by T1 alone: the surface family is `--cl-bg`, `--cl-bg-elevated`, `--cl-bg-hover`, `--cl-bg-input`, and `--cl-bg-<role>` is its established form. Radix Themes' `--color-panel-*` and shadcn's `--popover` were recalled as peers while writing ADR 004 and are **not** cited here — recall is not a citation, and the internal convention carries the name without one. |

| `--cl-bg-skeleton` | **NOVEL** | The loading-placeholder surface. Justified by T1 alone: the surface family is `--cl-bg`, `--cl-bg-elevated`, `--cl-bg-hover`, `--cl-bg-input`, `--cl-bg-panel`, and `--cl-bg-<role>` is its established form. A role name under T2, like `--cl-bg-panel`: it claims no relation to the base surface, and its visibility comes from being a foreground overlay rather than from any relationship to `--cl-bg`. Minted rather than reusing `--cl-border-strong`, which was the second time in one night a component reached for a border token because the scale had no neutral at this strength. |

Both values are foreground overlays rather than fixed colours, chosen by
measurement. `bg-gray-200` sat at 1.24 against the page in light and **16.37**
in dark — more contrast than body text, which is what a skeleton must never be.
An overlay composites against whatever it is laid on, so one value holds
1.34–1.41 on the page, a panel, an elevated surface and a hovered row in both
themes: a spread of 0.07, where the fixed grey spanned 1.14 to 16.37.

MUI's Skeleton is recalled as using an alpha overlay of the foreground for what
looks like this reason. That is **recall, not a citation**, and is deliberately
not entered as `VERIFIED` — the marker above rests on T1 and the measurement,
per T4.

Every other token predates this ADR and is recorded as pre-existing rather than
retro-justified. Marking 28 names `VERIFIED` on recall is exactly what ADR 002's
ledger was built to stop.
