# ADR 004 (proposal) — the token decisions `dark:` group B is waiting on

**Status:** Proposal. Nothing here is minted. Tokens are public API, and this
program has already shipped one vocabulary carelessly enough to need ADR 002 to
unpick it.
**Date:** 2026-09-07
**Related:** ADR 001 (`unstyled`), ADR 002 (`classes` key vocabulary)

## What this is

Component source carried 361 `dark:` variants in three kinds:

| Group | What it is | Count | State |
| --- | --- | --- | --- |
| A | Literal no-op — the same token on both sides | 150 | **Retired.** |
| B | A different `cl-` token under `.dark` | 167 | 15 collapsed; **152 waiting on this document** |
| C | Raw palette under `.dark` — `dark:bg-gray-700` | 44 | Untouched, a later slice |

A group B variant can only be collapsed when a single token already carries both
values. Fifteen did. The remaining 152 are asking for a value pair that no token
holds, and inventing one per call site is how a vocabulary rots.

**The single most useful fact in this document:** 119 of the 152 call sites want
a pair where *both* halves already exist — the light value of one token and the
dark value of another. They are crosses, not new colours. That strongly suggests
most of these are not requests for new tokens at all, but disagreements about
what an existing token's value should be in one theme.

## The 23 value pairs whose two ends both resolve

Five more pairs (6 call sites) resolve to no colour on one side and are listed
at the end.

Read `light side`/`dark side` as the class that applies in each theme. `n` is
call sites.

| n | utility | light side | dark side | light value | dark value | components |
|---|---|---|---|---|---|---|
| 37 | `bg-*` | `cl-bg-hover` | `cl-bg-elevated` | `rgba(15, 18, 24, 0.04)` | `rgb(10, 13, 18)` | Accordion, Breadcrumb, CascadingDropdown, DatePicker +9 |
| 26 | `bg-*` | `white | cl-bg` | `cl-bg-elevated` | `rgb(255, 255, 255)` | `rgb(10, 13, 18)` | Breadcrumb, CascadingDropdown, DatePicker, Dropdown +9 |
| 21 | `border-*` | `cl-border-input` | `cl-border` | `rgba(15, 18, 24, 0.15)` | `rgba(237, 239, 244, 0.08)` | CascadingDropdown, DatePicker, Dropdown, MultiSelectDropdown +6 |
| 18 | `text-*` | `cl-text` | `cl-text-secondary` | `rgb(15, 18, 24)` | `rgba(237, 239, 244, 0.72)` | CascadingDropdown, DatePicker, Dropdown, Input +8 |
| 7 | `bg-*` | `cl-bg-hover` | `cl-text/10` | `rgba(15, 18, 24, 0.04)` | `rgba(237, 239, 244, 0.1)` | Breadcrumb, DatePicker, MultiSelectDropdown, MultiSelectSearchableDropdown +1 |
| 5 | `text-*` | `cl-text-secondary` | `cl-text-tertiary` | `rgba(15, 18, 24, 0.8)` | `rgba(237, 239, 244, 0.52)` | DatePicker, Modal, Pagination, Table |
| 4 | `border-*` | `cl-border` | `cl-text/10` | `rgba(15, 18, 24, 0.1)` | `rgba(237, 239, 244, 0.1)` | Input, InternationalPhoneInput, TextArea |
| 4 | `bg-*` | `white` | `cl-text/4 | cl-bg-hover` | `rgb(255, 255, 255)` | `rgba(237, 239, 244, 0.04)` | Input, InternationalPhoneInput, Slider, TextArea |
| 3 | `border-*` | `cl-border-input-focus` | `cl-border-input-focus/50` | `rgb(37, 99, 235)` | `rgba(91, 155, 255, 0.5)` | Input, InternationalPhoneInput, TextArea |
| 3 | `bg-*` | `cl-accent` | `cl-accent/30` | `rgb(37, 99, 235)` | `rgba(91, 155, 255, 0.3)` | Slider, TabPanel, TimePicker |
| 2 | `ring-*` | `cl-accent/15` | `cl-accent/30` | `rgba(37, 99, 235, 0.15)` | `rgba(91, 155, 255, 0.3)` | Input, TextArea |
| 2 | `border-*` | `cl-border-input` | `cl-text/10` | `rgba(15, 18, 24, 0.15)` | `rgba(237, 239, 244, 0.1)` | InternationalPhoneInput |
| 2 | `bg-*` | `cl-accent/15` | `cl-text/10` | `rgba(37, 99, 235, 0.15)` | `rgba(237, 239, 244, 0.1)` | MultiSelectDropdown, MultiSelectSearchableDropdown |
| 2 | `text-*` | `cl-accent` | `cl-text` | `rgb(37, 99, 235)` | `rgb(237, 239, 244)` | MultiSelectDropdown, MultiSelectSearchableDropdown |
| 2 | `text-*` | `cl-accent` | `cl-text-secondary` | `rgb(37, 99, 235)` | `rgba(237, 239, 244, 0.72)` | MultiSelectDropdown, MultiSelectSearchableDropdown |
| 1 | `text-*` | `cl-text-tertiary` | `cl-text-secondary` | `rgba(15, 18, 24, 0.62)` | `rgba(237, 239, 244, 0.72)` | Breadcrumb |
| 1 | `bg-*` | `cl-accent/15` | `cl-accent/20` | `rgba(37, 99, 235, 0.15)` | `rgba(91, 155, 255, 0.2)` | DatePicker |
| 1 | `bg-*` | `transparent` | `cl-text/4` | `rgba(0, 0, 0, 0)` | `rgba(237, 239, 244, 0.04)` | InternationalPhoneInput |
| 1 | `ring-*` | `cl-accent` | `cl-accent/30` | `rgb(37, 99, 235)` | `rgba(91, 155, 255, 0.3)` | InternationalPhoneInput |
| 1 | `bg-*` | `cl-accent/15` | `cl-accent/60` | `rgba(37, 99, 235, 0.15)` | `rgba(91, 155, 255, 0.6)` | Pagination |
| 1 | `bg-*` | `cl-bg-hover` | `cl-bg` | `rgba(15, 18, 24, 0.04)` | `rgb(5, 6, 8)` | SearchableDropdown |
| 1 | `bg-*` | `white` | `cl-text` | `rgb(255, 255, 255)` | `rgb(237, 239, 244)` | Slider |
| 1 | `text-*` | `cl-text-secondary` | `cl-text` | `rgba(15, 18, 24, 0.8)` | `rgb(237, 239, 244)` | TimePicker |

## The four that matter

102 of the 152 call sites are these four pairs. Each needs one decision, and the
decision is the same shape every time: *is the existing token's value wrong in
one theme, or is this a role the vocabulary does not have?*

### 1. Hover surface — 37 sites, 13 components

`bg-cl-bg-hover` + `dark:bg-cl-bg-elevated`. Wants
`rgba(15, 18, 24, 0.04)` in light and `rgb(10, 13, 18)` in dark.

`--cl-bg-hover` already means "hover surface", and its light value is exactly
what these sites want. Its dark value is `rgba(237, 239, 244, 0.04)` — a 4% white
wash — and 37 sites have overridden it to the solid elevated surface instead.

**This reads as a token bug, not a missing role.** Thirteen components
independently deciding the dark hover is wrong is a statement about the token.
The proposal is to change `--cl-bg-hover`'s dark value to `#0a0d12` and delete
all 37 variants, not to mint anything.

**Cost of being wrong:** it is a visible change to every hover surface in dark
mode for any consumer who uses the token directly. That is why it is a decision
and not a codemod.

### 2. Panel surface — 26 sites, 13 components

`bg-white` (or `bg-cl-bg`) + `dark:bg-cl-bg-elevated`. Wants `#ffffff` light,
`#0a0d12` dark.

This is one shade away from `--cl-bg-elevated`, which is `#f8f9fb` / `#0a0d12` —
the dark halves are identical and the light halves differ by `#f8f9fb` vs
`#ffffff`.

**Genuinely a distinct role, but only just.** A menu, popover or dropdown panel
sits on pure white in light and on the raised surface in dark. Either
`--cl-bg-elevated`'s light value becomes `#ffffff` — after checking what the
other elevated surfaces look like on it — or a token is minted.

**Proposed name if minted:** `--cl-bg-panel`, following the existing
`--cl-bg-*` surface family. Not `--cl-bg-overlay`: nothing here is an overlay.

### 3. Input border — 21 sites, 10 components

`border-cl-border-input` + `dark:border-cl-border`. Wants
`rgba(15, 18, 24, 0.15)` light, `rgba(237, 239, 244, 0.08)` dark.

`--cl-border-input` is `0.15` / `0.12`; `--cl-border` is `0.10` / `0.08`. These
sites want the input strength in light and the plain border strength in dark.

**A token bug in `--cl-border-input`'s dark value**, on the same reasoning as
the hover surface: ten components agreeing that `0.12` is too strong in dark is
evidence about the token. Proposal: `--cl-border-input` dark becomes `0.08`,
which makes it equal to `--cl-border` in dark and collapses 21 variants — and
then asks the sharper question of whether `--cl-border-input` earns its place as
a separate token at all, since it would then differ from `--cl-border` in one
theme only.

### 4. Primary text in dark — 18 sites, 12 components

`text-cl-text` + `dark:text-cl-text-secondary`. Wants `rgb(15, 18, 24)` light,
`rgba(237, 239, 244, 0.72)` dark.

This one is different from the other three, and it is the one to be most careful
with. `--cl-text` in dark is `#edeff4` at full opacity; these sites step it down
to 72%. That is a **contrast decision**, not a naming one: 72% white on
`--cl-bg` measures 9.1:1, which still clears AA comfortably, so both are
defensible.

**Recommendation: leave all 18 alone until someone decides what primary text is
in dark mode.** Collapsing them by changing `--cl-text` would restyle every
piece of primary text in the library, and `contrast.contract` would need
re-baselining. This is the clearest case in the document of a change that is
cheap to make and expensive to be wrong about.

## The remaining 24 pairs

50 call sites, none above 7 sites — 19 pairs that resolve (44 sites) and the 5
that do not (6 sites). They divide into:

- **Opacity variants of the accent** — `bg-cl-accent` + `dark:bg-cl-accent/30`,
  `ring-cl-accent/15` + `dark:ring-cl-accent/30`, and four more. Every one is
  the same accent at a different alpha in dark. If the accent needs to be
  softer in dark, that belongs in `--cl-accent` and its `--cl-accent-bg`
  siblings, not in six per-site alphas.
- **`cl-text/N` used as a surface or border** — 15 sites reach for
  `dark:bg-cl-text/10`, `dark:border-cl-text/10`, `dark:bg-cl-text/4`. These are
  the raw-ink washes that `--cl-bg-hover` and `--cl-border` already name. They
  look like group C in spirit: a value picked by eye rather than by role.
- **Six that are not colour at all** — two `dark:shadow-none`, three gradient
  stops on `fg/[0.10]` (a different token namespace entirely), and one
  `dark:bg-cl-bg-elevated` with no light-side class. None of them is a token
  question; they are individual component decisions.

## What this document is not

It does not mint a token, change a value, or rename anything. Every row above is
a question for someone who owns the design system, and the evidence for each is
the call-site count and the two values — both measured from the running
stylesheet rather than read off the source.

The one thing it does assert: **119 of 152 want a cross of two existing tokens.**
Whatever is decided, that number should fall by fixing token values, not by
adding tokens that hold a light value from one role and a dark value from
another.
