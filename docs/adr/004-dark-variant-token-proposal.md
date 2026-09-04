# ADR 004 (proposal) — the token decisions `dark:` group B is waiting on

**Status:** Decided and applied for three of the four. Nothing was minted.
Tokens are public API, and this program has already shipped one vocabulary
carelessly enough to need ADR 002 to unpick it.

**Decision (2026-09-07):** fix the token bugs, mint nothing. §1, §2 and §3 were
revalued; §4 was left alone.

**Amended (2026-09-08):** §2 was wrong and is reverted. Revaluing
`--cl-bg-elevated`'s light value to `#ffffff` made it equal `--cl-bg`, so a
token named *elevated* no longer sat above anything — and 51 elements that never
asked for it, `Table`'s header among them, lost their tint. The light value is
back at `#f8f9fb` and the panel role has its own token, `--cl-bg-panel`. All 27
of the affected sites are a clean fit; the collapse total is unchanged at 85. 85 of the 152 call sites collapsed; 67 remain.
`contrast.contract` stayed green on its own terms — it was not re-baselined, and
a planted bad value confirmed it still fails when a revaluation breaks a ratio.

**What it cost, measured rather than assumed.** The change moves pixels by
design, so it was proven confined rather than absent: of 6,414 elements captured
across 305 fixtures in both themes, 57 moved. Six carried one of the classes this
change removed. **51 did not** — see "Blast radius" below.
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


## Applied: what changed

| Token | Theme | From | To | Sites collapsed |
| --- | --- | --- | --- | --- |
| `--cl-bg-hover` | dark | `rgba(237, 239, 244, 0.04)` | `#0a0d12` | 37 |
| `--cl-bg-elevated` | light | `#f8f9fb` | `#ffffff` | 26 |
| `--cl-border-input` | dark | `rgba(237, 239, 244, 0.12)` | `rgba(237, 239, 244, 0.08)` | 21 |

One further site (`bg-white` + `dark:bg-cl-bg-hover`) needed two of the three at
once, which is why the column sums to 84 and the total is 85.

`--cl-text` was **not** touched, per §4. Its 18 sites remain.

## Blast radius

51 elements changed without having overridden the token — every one of them the
same thing, and all in light: `--cl-bg-elevated` moving `#f8f9fb` → `#ffffff`.
49 are `Table` (47 `<th>`, the search input, one more) and 2 are
`CountryFlagGroup`'s overflow chip.

**This is the finding, and it is not cosmetic.** `--cl-bg` in light is already
`#ffffff`, so after the revaluation `--cl-bg-elevated` is *identical to the base
surface in light*. The token no longer elevates anything there. A `Table`
header, which used the token to sit a shade above the page, is now the same
colour as the page.

The revaluation introduced three token collisions of that kind:

| Theme | Value | Now shared by |
| --- | --- | --- |
| light | `#ffffff` | `bg`, `bg-elevated`, `bg-input`, `on-accent` |
| dark | `#0a0d12` | `bg-elevated`, `bg-hover`, `code-bg` |
| dark | `rgba(237, 239, 244, 0.08)` | `border`, `border-input` |

Two of the three are the intended consequence — `bg-hover` matching
`bg-elevated` in dark, and `border-input` matching `border` in dark, are exactly
what the 59 overriding call sites were asking for, and they raise the fair
question of whether those tokens still earn separate names. The light one is
different: nothing asked for `bg-elevated` to equal `bg`, and 51 elements got it
anyway.

**Recommendation, not applied:** reconsider §2. The 26 sites wanted a *panel* on
pure white; `Table`'s header wanted a *surface* a shade above the page. Those are
two roles, and collapsing them onto one value serves the first by breaking the
second. Either §2 mints `--cl-bg-panel` after all, or `Table` and
`CountryFlagGroup` move off `--cl-bg-elevated` onto something that still
elevates. Left for a decision rather than taken here.

## How the confinement was proven

`scripts/analyse-token-blast-radius.mjs` compares two `capture-theme-styles.mjs`
snapshots and splits every changed element by whether its *pre-change* class list
carried one of the removed overrides. Elements that carried one asked for the
change; elements that did not are the blast radius.

Self-checked by planting a change nobody asked for — one
`text-cl-text-secondary` swapped to `text-cl-text-tertiary` in `Accordion` — and
confirming it is reported: collateral rose from 51 to 67, with the Accordion
element named and its old class list shown.

Two limits worth stating. The capture reads the resting state, so the
`hover:`-scoped half of the `--cl-bg-hover` revaluation is not exercised by it —
which is why only 6 of the 85 collapses show as moved elements. And the analysis
compares the shipped fixtures, not every possible consumer usage.


## Amendment: `--cl-bg-panel`

`--cl-bg-elevated: #f8f9fb` (light) / `#0a0d12` (dark) — restored.
`--cl-bg-panel: #ffffff` (light) / `#0a0d12` (dark) — new.

Two roles that a single value cannot serve. `Table`'s header wants a surface a
shade above the page; a dropdown, calendar or menu panel wants pure white with a
border. Collapsing them served the second by breaking the first, and broke the
name while doing it.

**There is no precedent scheme for design tokens, and this was minted without
one.** ADR 002's precedent ledger governs `classes` key names — the anatomy
parts — not CSS custom properties, and nothing else in the repo governs
`--cl-*`. Saying so is the point: the name was chosen against the only evidence
available, which is the existing family's own shape.

- **Internal convention:** the surface family is `--cl-bg`, `--cl-bg-elevated`,
  `--cl-bg-hover`, `--cl-bg-input`. `--cl-bg-<role>` is the established form and
  `panel` names the role rather than the appearance, which is what the other
  four do.
- **Peer precedent: not verified.** Radix Themes is recalled to ship
  `--color-panel-*` and shadcn/ui a `--popover` surface, but this was written
  without network access and ADR 002 exists because a name was once justified by
  exactly that kind of recall. Treat the peer claim as unverified; the internal
  convention is the whole of the argument.
- **Not a duplicate.** No existing token holds `#ffffff` / `#0a0d12`.
  `--cl-bg-elevated` differs in light, `--cl-bg` differs in dark.

`--cl-bg-panel` was added to `contrast.contract`'s surface list at the same time
— a surface token that text sits on belongs in the gate the moment it exists, or
the gate covers four of five. It clears AA for all three text tokens in both
themes (27 assertions became 33).

## Amendment: what the hover measurement found

`capture-theme-styles.mjs` reads the resting state, so 28 of the 37
`--cl-bg-hover` collapses were unexercised by it.
`scripts/capture-hover-styles.mjs` forces `:hover` through CDP — not
`locator.hover()`, which fails on anything scrolled out of view or covered, and
would have silently shrunk the measured set — and reads 263 elements across 152
fixtures in both themes, with no probe unreachable.

**Every one of the 148 elements using `hover:bg-cl-bg-hover` in the baseline also
carried a `dark:hover:` override. Not one used the token's dark value as it
stood.** That is the strongest evidence in this document that the value was
wrong rather than the call sites.

14 hovered readings changed, and none of them for the reason one would guess:

| n | What | Why |
| --- | --- | --- |
| 12 | `DatePicker` hovered border in dark: `rgba(237,239,244,0.08)` -> transparent | The trigger is focused while the picker is open. `focus:border-transparent` and `hover:border-cl-border-input` are the same specificity, and Tailwind emits `dark:` after `focus:` — so the removed `dark:hover:border-cl-border` had been masking the focus rule in dark only. Removing it makes dark agree with light. |
| 2 | `Accordion` `flush` hovered background in dark: `#0a0d12` -> transparent | `flush` sets `hover:bg-transparent`. `dark:hover:bg-cl-bg-elevated` was a different utility group to tailwind-merge, so it survived the merge and gave flush a hover background in dark that it does not have in light. Collapsing it into `hover:bg-cl-bg-hover` puts both in one group and the variant wins, as it already did in light. |

Both are the same shape: a `dark:` variant sitting later in the cascade than the
`hover:`/`focus:` rule it shadowed, so dark behaved differently from light for
no stated reason. Reported rather than folded in, because they are behaviour
changes even though each makes the two themes agree.

**Limit of the classifier.** It answers "did this element carry one of the
removed classes", not "is this particular delta attributable to that class". A
planted change on an element that also carried an override is counted as
asked-for. Confirmed by planting one — `hover:bg-cl-bg-hover` swapped to
`hover:bg-cl-accent` in `Breadcrumb` — which moved the count from 14 to 50 and
so was detected, but landed in the asked-for bucket. The collateral path is
exercised separately in the resting capture, where a planted `Accordion` change
moved collateral from 51 to 67.


## Group C — the 44 raw-palette variants

Classified the same way group B was: grouped by value pair first, existing token
preferred over a new one, and nothing minted outside ADR 005's scheme.

**44 sites, 21 distinct pairs. None matched an existing token exactly**, so each
was measured against the nearest one instead of being collapsed on sight.

**22 moved onto a token that already covers the role.** Each is a small measured
shift, not a neutral collapse, so the proof is that the change is confined —
not that nothing moved.

| n | Was | Now | Shift |
| --- | --- | --- | --- |
| 13 | `text-cl-text` + `dark:text-white` | `text-cl-text` | dark `#ffffff` -> `#edeff4` |
| 3 | `border-cl-border` + `dark:border-white/[0.06]` | `border-cl-border` | dark alpha `0.06` -> `0.08` |
| 2 | `hover:text-cl-text` + `dark:hover:text-white` | `hover:text-cl-text` | dark `#ffffff` -> `#edeff4` |
| 2 | `border-cl-border` + `dark:border-white/[0.04]` | `border-cl-border` | dark alpha `0.04` -> `0.08` |
| 1 | `bg-cl-bg-elevated` + `dark:bg-[#111118]` | `bg-cl-bg-elevated` | dark `#111118` -> `#0a0d12` |
| 1 | `bg-white` + `dark:bg-gray-900` | `bg-cl-bg-panel` | dark `#111827` -> `#0a0d12` |

Ten components had hard-coded pure white where `--cl-text` already meant
"primary text", which is the same shape as group B's token bugs — except that
here the token's value is right and the call sites were wrong.

**Proof, both captures.** Resting: 6,414 elements, 231 changed carrying an
override, 91 changed carrying none. All 91 of those set no colour class of their
own — they are descendants inheriting `color` from a parent that did carry the
override, which is why every `currentColor`-derived property moved with it. The
classifier is element-local and cannot see ancestry, so inherited change lands
in its "carried none" bucket; that is a limit of the tool, not a second finding.
Hover: 526 readings, 114 changed, **0 carrying none**.

### The 22 that remain

No existing token is close, and minting fourteen tokens for fifteen one-off call
sites is the carelessness ADR 005 exists to prevent. They need a decision, not a
sweep:

| n | Pair | Component |
| --- | --- | --- |
| 3 | `bg-gray-200` / `dark:bg-gray-700` | Accordion, Avatar |
| 3 | `text-gray-600` / `dark:text-gray-300` | Avatar |
| 2 | `border-gray-300` / `dark:border-gray-600` | Avatar, Table |
| 2 | `hover:bg-cl-bg-hover` / `dark:hover:bg-white/6` | InternationalPhoneInput |
| 2 | `hover:bg-black/5` / `dark:hover:bg-white/10` | TimePicker |
| 1 | `bg-gray-100` / `dark:bg-gray-600` | Accordion |
| 1 | `bg-black/60` / `dark:bg-black/70` | Modal |
| 8 | one-offs: `bg-gray-50`, `bg-inherit`, `text-inherit`, `placeholder-gray-400`, `border-gray-200`, `hover:bg-cl-bg-hover`, `group-hover/resize:bg-gray-400`, `data-[focused]:bg-cl-bg-hover` | Table, IPI |

Two observations for whoever takes them:

- **Nine sites are on Tailwind's grey palette on both sides** (Avatar, Accordion).
  Nothing in the `--cl-*` set is within 100 units of them. They predate the token
  system rather than diverging from it, and moving them is a visual decision.
- **Six are translucent ink washes in dark** — `white/6`, `white/10`,
  `white/[0.06]`. `--cl-bg-hover` was exactly that until this ADR revalued its
  dark value to the solid `#0a0d12`, which is why they no longer match anything.
  If a translucent hover wash is still wanted as a role, it needs its own token
  under ADR 005 rather than six hand-picked alphas.
- **`Modal`'s `bg-black/60` / `dark:bg-black/70`** is a scrim, and no token names
  that role. One site, so it is a candidate for `--cl-overlay` rather than a
  reason to mint one now.
