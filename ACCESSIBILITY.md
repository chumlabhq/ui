# Accessibility conformance — @chumlab/ui

**Target:** WCAG 2.2 Level AA
**Scope:** the 30 components published from this package
**Last reviewed:** 2026-09-06
**Decision record:** [ADR 003](docs/adr/003-accessibility-conformance-target.md)

## How to read this document

Every WCAG 2.2 Level A and AA success criterion is listed — 55 of them. WCAG 2.2 has been
the W3C Recommendation since October 2023; 2.1 is superseded and this package no longer
claims it. SC 4.1.1 Parsing was removed in 2.2 and is not listed.

Four statuses are used, and one of them does not mean what it usually means in a VPAT:

| Status | Meaning here |
| --- | --- |
| **Supports** | The behaviour is implemented **and** a named test fails if it regresses. |
| **Partially supports** | Implemented and gated for some components or some part of the criterion; the rest is unproven. The row says which part. |
| **Does not support** | **Not gated, therefore not claimed.** Some of these are very likely satisfied by the current code. Until a test proves it, this document does not say so. |
| **Not applicable** | The criterion's trigger does not occur in a component library — page-level information architecture, media content, authentication flows. |

That third row is ADR 003 D4, and it is deliberate. This document exists because
`README.md` previously asserted "WCAG 2.1 AA" as a single adjective, alongside a "44px+
touch targets" claim that was not a WCAG requirement at any level and that the package did
not meet. A conformance claim nobody can check is how that survived. **A criterion moves to
Supports by someone writing the test, not by someone reading the code and being satisfied.**

### Where the package stands

Of the 55 Level A and AA criteria: **11 Supports, 8 Partially supports, 14 Does not support,
22 Not applicable**. The ten a component library genuinely owns — 1.3.1, 2.1.1, 2.1.2,
2.4.3, 2.4.7, 2.4.11, 2.5.7, 2.5.8, 4.1.2 and 4.1.3 — all carry a gate, and building those
gates found six classes of defect that no axe run had reported: a `Breadcrumb` menu with no
`id` for its own `aria-controls`; seven unreachable "Clear selection" buttons; a `TabPanel`
whose tablist lost its only tab stop when `defaultValue` named a disabled tab; twelve
components whose success confirmation was announced to nobody; two drag-only `Table`
functions; and a third instance of the roving-tabindex bug, in `CascadingDropdown`.

That is the argument for gates over adjectives: every one of those was invisible to a
checker, because a missing capability has no signature in the DOM.

### Every row says which engines its gate ran in

A criterion can hold in one browser and fail in another, and this document has the scar to
prove it: `Drawer`'s focus trap passed in Chromium for the life of this branch and let Tab
walk straight out of the dialog in WebKit, because WebKit leaves buttons out of the
sequential tab order. Nothing said so, because only Chromium was ever executed.

So the **Gate** column names the engines, and a criterion gated in one engine is gated in one
engine — not "supported". Three coverage levels appear:

| Coverage | Meaning |
| --- | --- |
| **jsdom** | A vitest contract. No layout, no `:focus-visible`, no engine differences. It proves the wiring, never the rendering. |
| **chromium** | `npm run test:e2e`, the iteration loop. Real layout, one engine. |
| **all five** | `npm run test:e2e:all` — chromium, firefox, webkit, Mobile Chrome, Mobile Safari. The release gate. |

Where a **skip** is what stops a row reaching all five, the row says which skip and what
would remove it. There are twelve, in two groups, both recorded in `e2e/_helpers.ts`:
`skipWithoutTouchEvents` (desktop Firefox defines no `TouchEvent`) and
`skipWithoutTabTraversal` (WebKit does not Tab to buttons or checkboxes, and does not focus
them on click, unless macOS Full Keyboard Access is on). A reasonless skip fails the run —
`e2e/_reconcile-reporter.ts` enforces that, along with collected-versus-executed.

Gates named below are real files. `--project contracts` and `--project unit` are vitest;
`e2e/` is Playwright, with the full axe sweep in its own project (`--project=a11y-full`,
Desktop Chrome only), while `e2e/accessibility.spec.ts` audits one fixture per component in
all five.

### What a component library can and cannot own

Several criteria are met jointly. This package can ship a labelled, keyboard-operable
control; it cannot stop a consumer removing the label, overriding the contrast tokens, or
placing the control inside a page with no heading structure. Where a criterion is shared,
the row says which half is ours.

---

## 1. Perceivable

| SC | Level | Status | Justification | Gate |
| --- | --- | --- | --- | --- |
| 1.1.1 Non-text Content | A | Partially supports | Decorative icons carry `aria-hidden`; icon-only controls take `aria-label`. Controls that mount with no accessible name warn in development, now including the six combobox triggers. Not every one of the 30 components has been audited for icon labelling. | `accessibleName.test`, `combobox-name.contract` (jsdom); `e2e/accessibility-full.spec.ts` (chromium) |
| 1.2.1 Audio-only / Video-only | A | Not applicable | The package ships no audio or video component. | — |
| 1.2.2 Captions (Prerecorded) | A | Not applicable | As above. | — |
| 1.2.3 Audio Description or Media Alternative | A | Not applicable | As above. | — |
| 1.2.4 Captions (Live) | AA | Not applicable | As above. | — |
| 1.2.5 Audio Description (Prerecorded) | AA | Not applicable | As above. | — |
| 1.3.1 Info and Relationships | A | Supports | Label, description and error are associated programmatically, state is published as data attributes with a recorded vocabulary, and **every ARIA relationship in every fixture resolves to an element that exists**. That check found `Breadcrumb`'s ellipsis trigger naming a menu with no `id` at all — `aria-controls` pointing at nothing precisely while the menu was open. A dangling `aria-controls` is excused only while the control reports `aria-expanded="false"`. | `aria-relationships.contract` (jsdom, every fixture); `e2e/accessibility.spec.ts` axe (all five) |
| 1.3.2 Meaningful Sequence | A | Does not support | Not gated. DOM order is authored to match reading order, but nothing asserts it. | — |
| 1.3.3 Sensory Characteristics | A | Does not support | Not gated. | — |
| 1.3.4 Orientation | AA | Does not support | No component locks orientation, but nothing tests either orientation. | — |
| 1.3.5 Identify Input Purpose | AA | Does not support | `autoComplete` passes through to the underlying input; the package sets no purpose tokens of its own and nothing gates them. | — |
| 1.4.1 Use of Color | A | Does not support | Not gated. Error states pair colour with an icon and a message in most components; "most" is not a claim. | — |
| 1.4.2 Audio Control | A | Not applicable | The package plays no audio. | — |
| 1.4.3 Contrast (Minimum) | AA | Supports | Every text token is checked against every surface it is used on, in both themes, parsed from `src/index.css` rather than copied into the test. Consumer overrides of the tokens are outside this. | `contrast.contract` (jsdom — token arithmetic, engine-independent by construction) |
| 1.4.4 Resize Text | AA | Does not support | Not gated. Sizing is in `rem`-based Tailwind utilities throughout, which is the precondition, not the proof. | — |
| 1.4.5 Images of Text | AA | Not applicable | The published `dist` contains no bitmap assets; all iconography is inline SVG and all text is live text. (The repository's `src/assets/images` holds demo-site artwork, which is not published.) | — |
| 1.4.10 Reflow | AA | Does not support | Not gated at 320px. The components are authored mobile-first and the README claims 320px support; no test holds that claim. | — |
| 1.4.11 Non-text Contrast | AA | Does not support | Not gated. The contrast contract covers text tokens only — borders, focus rings and control boundaries are not measured. | — |
| 1.4.12 Text Spacing | AA | Does not support | Not gated. | — |
| 1.4.13 Content on Hover or Focus | AA | Partially supports | Tooltip content is dismissible with Escape and stays open while hovered (`disableHoverableContent` opts out); both are gated. Covered for Tooltip only — the date marker tooltip and other hover surfaces are not. | `Tooltip.test` (jsdom); `e2e/tooltip.spec.ts` (all five, one Tab assertion skipped in WebKit) |

---

## 2. Operable

| SC | Level | Status | Justification | Gate |
| --- | --- | --- | --- | --- |
| 2.1.1 Keyboard | A | Supports | Every control reporting an interactive role can take focus, every roving group has exactly one tab stop or an active-descendant owner, and every drag has a keyboard route. The gate found seven "Clear selection" buttons shipped at `tabIndex={-1}` — for a single select there is no other way back to an empty value — and a `TabPanel` whose tablist had no tab stop at all when `defaultValue` named a disabled tab. | `keyboard-reachable.contract`, `roving-focus.contract`, `dragging-alternatives.contract` (jsdom, every fixture); component keyboard specs (all five) |
| 2.1.2 No Keyboard Trap | A | Supports | The three surfaces that hold focus — Modal, Drawer, DatePicker — share `cycleTabWithin`, cycle Tab both ways and release on Escape. The helper drives the order from its own focusable list rather than intervening at the boundaries, which is what makes it hold in WebKit. | `overlay-focus.contract` (jsdom, all three); `e2e/drawer.spec.ts` trap (all five). **Modal and DatePicker are jsdom-only** — an e2e trap spec for each would close that |
| 2.1.4 Character Key Shortcuts | A | Not applicable | The package binds no single-character shortcuts. Typeahead in the select components is scoped to a focused listbox, which the criterion exempts. | — |
| 2.2.1 Timing Adjustable | A | Does not support | Toast auto-dismisses on a timer. `duration` is adjustable and `Infinity` disables it, but nothing gates pause-on-hover or pause-on-focus, and the default is a timed dismissal. This is a real exposure, not merely an ungated one. | — |
| 2.2.2 Pause, Stop, Hide | A | Partially supports | Shimmer and transition motion is dropped from the shipped defaults under `prefers-reduced-motion`. The gate asserts the class tokens are removed, not the resulting computed animation, so it proves the branch is taken rather than that nothing moves. Sixteen components also accept a `reduceMotion` prop that overrides the query in both directions — see [The `reduceMotion` prop](#the-reducemotion-prop-audited-against-222) below, which is where `reduceMotion={false}` is accounted for. Toast's auto-dismiss timer is not covered — see 2.2.1. | `reduced-motion.contract` (jsdom — asserts the class tokens are dropped, not the resulting animation; covers the media query and both explicit values of the prop) |
| 2.3.1 Three Flashes or Below Threshold | A | Not applicable | No component flashes. The only motion is opacity/transform transitions and a shimmer pulse, none of it a luminance flash. | — |
| 2.4.1 Bypass Blocks | A | Not applicable | Page-level. A component library ships no repeated page blocks and no skip-link target. | — |
| 2.4.2 Page Titled | A | Not applicable | Page-level. | — |
| 2.4.3 Focus Order | A | Supports | Focus moves into an overlay on open, follows the roving tabindex inside it, and returns to the invoking control on close. Restoration targets the trigger rather than the previously-focused element, because a pointer user on WebKit never focused anything to restore to. | `overlay-focus.contract`, `roving-focus.contract` (jsdom); `e2e/drawer.spec.ts` restore (all five). **Partial in WebKit:** four Tab-traversal assertions are skipped there by `skipWithoutTabTraversal`; running the suite with macOS Full Keyboard Access on would remove them |
| 2.4.4 Link Purpose (In Context) | A | Not applicable | The package ships no link component; `Breadcrumb` renders consumer-supplied hrefs and labels. | — |
| 2.4.5 Multiple Ways | AA | Not applicable | Page-level information architecture. | — |
| 2.4.6 Headings and Labels | AA | Partially supports | Form components render a programmatically associated `label` and warn in development when a control mounts unnamed. Heading structure is the consuming page's. | `accessibleName.test` (jsdom) |
| 2.4.7 Focus Visible | AA | Supports | Focusing any interactive element changes a visible property on it or on an ancestor — the indicator need not sit on the focused node, and `Input` paints `focus-within:ring-2` on the control wrapping its `<input>`. Read from computed style, not from a class string. **`unstyled` still removes it:** ADR 001 classifies the ring as decorative, so a consumer running unstyled has no indicator until they supply one. | `e2e/wcag-layout.spec.ts` (all five, 7 fixtures) |
| 2.4.11 Focus Not Obscured (Minimum) | AA | Supports | Both halves asserted. Floating content resolves its layer from the nearest overlay, so a dropdown opened inside a Drawer computes a higher layer than its container; and the focused element inside each overlay is hit-tested at its own centre, so anything painted over it fails. The hit test asks what the criterion asks, rather than inferring it from z-index. | `layering.contract` (jsdom, every overlay x floating pair); `e2e/wcag-layout.spec.ts` hit-test (all five, 4 overlays) |
| 2.5.1 Pointer Gestures | A | Does not support | Not gated. Drawer supports swipe-to-dismiss with a close control as the single-pointer alternative; Slider and ResizablePanel are covered under 2.5.7. | — |
| 2.5.2 Pointer Cancellation | A | Does not support | Not gated. Activation is on `click`/`pointerup` throughout, which is the criterion's requirement, but nothing asserts no component acts on `pointerdown`. | — |
| 2.5.3 Label in Name | A | Partially supports | The combobox triggers are named by the element already showing the value or placeholder, so their accessible name is exactly the visible text, and that resolution is asserted. Not compared for the other components. | `combobox-name.contract` (jsdom) |
| 2.5.4 Motion Actuation | A | Not applicable | No component responds to device motion. | — |
| 2.5.7 Dragging Movements | AA | Supports | Every drag surface offers a route that is not a drag. ADR 003 named `ResizablePanel` as the likely failure and was wrong — its separator has always had arrow keys, a Shift multiplier and Home/End. The two real failures were in `Table`: column resize was `onMouseDown` on a `<div>` with no `tabIndex`, and row reorder was HTML5 drag-and-drop on a `<span>` that could not take focus. Both now have arrow-key routes matching ResizablePanel's step and multiplier. | `dragging-alternatives.contract` (jsdom, all six surfaces); `e2e/resizablepanel.spec.ts` (all five) |
| 2.5.8 Target Size (Minimum) | AA | Supports | Rendered boxes are measured, not source classes: 24x24 CSS pixels, or the spacing exception, where an undersized target passes only if no other target's 24px circle intersects its own. Nothing was resized — 40px defaults already clear the floor, and SC 2.5.5's 44px is Level AAA and not claimed. | `e2e/wcag-layout.spec.ts` (all five, 7 fixtures). **Scope is those fixtures, not all 30 components** |

---

## 3. Understandable

| SC | Level | Status | Justification | Gate |
| --- | --- | --- | --- | --- |
| 3.1.1 Language of Page | A | Not applicable | Page-level; the consuming document owns `<html lang>`. | — |
| 3.1.2 Language of Parts | AA | Not applicable | The package ships no multilingual content of its own. Date formatting takes a `locale`. | — |
| 3.2.1 On Focus | A | Does not support | Not gated. No component initiates a context change on focus alone. | — |
| 3.2.2 On Input | A | Does not support | Not gated. Selection components emit `onValueChange` without navigating or submitting. | — |
| 3.2.3 Consistent Navigation | AA | Not applicable | Page-level. | — |
| 3.2.4 Consistent Identification | AA | Partially supports | Part naming across components is a closed vocabulary with a recorded precedent for every name outside it, so the same element is identified the same way in every component. That governs the styling API and the data attributes, not the visible labels. | `key-migration.contract` (jsdom); [ADR 002](docs/adr/002-classes-key-vocabulary.md) |
| 3.2.6 Consistent Help | A | Not applicable | New in 2.2. A page-level obligation about where help mechanisms appear across a set of pages. A component library has no page set. | — |
| 3.3.1 Error Identification | A | Partially supports | Form components render the error message in a `role="alert"` region, associate it with `aria-describedby`, and mark the control `aria-invalid`. Gated for the components with error fixtures. | `fixtures.contract`, `status-messages.contract` (jsdom); `e2e/accessibility-full.spec.ts` (chromium) |
| 3.3.2 Labels or Instructions | A | Partially supports | `label`, `description` and `required` are wired to the control; an unnamed control warns in development. | `accessibleName.test` (jsdom) |
| 3.3.3 Error Suggestion | AA | Not applicable | The package renders the message the consumer supplies and does not perform validation, so it cannot suggest a correction. | — |
| 3.3.4 Error Prevention (Legal, Financial, Data) | AA | Not applicable | Application-level; the package submits nothing. | — |
| 3.3.7 Redundant Entry | A | Not applicable | New in 2.2. A multi-step process obligation. The package holds no cross-step state. | — |
| 3.3.8 Accessible Authentication (Minimum) | AA | Not applicable | New in 2.2. An authentication-flow obligation. `OTPInput` renders the field and does not impose a cognitive function test; whether an auth flow relies on one is the application's. | — |

---

## 4. Robust

| SC | Level | Status | Justification | Gate |
| --- | --- | --- | --- | --- |
| 4.1.2 Name, Role, Value | A | Supports | Roles, states and properties are exposed and kept true. Every `role="combobox"` resolves to a non-empty accessible name; every roving group moves DOM focus with its tabindex, so the highlight is announced rather than merely marked; every ARIA reference resolves. Three roles declared without their behaviour have been implemented — see below. | `combobox-name.contract`, `roving-focus.contract`, `aria-relationships.contract` (jsdom); `e2e/accessibility.spec.ts` axe (all five); `e2e/accessibility-full.spec.ts` every fixture (chromium). Three `button-name` nodes remain: Switch fixtures that pass no label, which is the consumer's half |
| 4.1.3 Status Messages | AA | Supports | A message state renders a live region and does not take the focus — both halves, because a component that focuses its own error satisfies a checker looking for `role="alert"` while pulling a keyboard user out of the field they were filling in. The gate found twelve components rendering a success confirmation as a plain `<div>`, announced to nobody, while their error message was correctly `role="alert"`. It asserts the message text is inside the live region, not merely that the page has one — the looser check passed three of the twelve. | `status-messages.contract` (jsdom, every message fixture of 22 components) |

---

## Roles declared without their behaviour

ADR 003 treats a declared role as a promise. Satisfying an automated checker by adding an
attribute that no behaviour backs is the failure mode this section exists to prevent.

**Resolved.**

- `DatePicker` panel — declared `role="dialog" aria-modal="true"`, which tells assistive
  technology the rest of the page is inert, with no focus trap and no `.focus()` call
  anywhere in the directory. Implemented: focus moves into the panel on open, Tab and
  Shift+Tab cycle within it, Escape closes, and focus returns to the trigger. The trap is
  Modal's, extracted to `cycleTabWithin` so there is one implementation rather than two.
- `DatePicker` month/year menus — declared `role="listbox"` with `role="option"` children
  that were plain tabbable buttons: no arrow keys, no roving tabindex. Implemented rather
  than dropped, because the role is right for the control and tabbing through a year list is
  not a substitute.

- `DatePicker` clear control — was a `<span role="button" tabIndex={0}>` nested inside the
  trigger `<button>`. Invalid nesting, never focusable, and its `aria-label` was folded into
  the trigger's own name. It is now a real `<button>` and a sibling of the trigger, reachable
  by Tab.
- `useDatePicker.handleKeyDown` closed the panel on Tab from the trigger, which fought the
  focus order rather than following it. Removed; the panel's trap owns Tab.

- `CascadingDropdown` used the menu pattern (`role="menu"`, `menuitem`, `menuitemradio`) with
  a roving `tabIndex={isFocused ? 0 : -1}` that nothing ever called `.focus()` on, while the
  trigger that kept the focus was a `<button>` and so could not legally carry
  `aria-activedescendant` either. Now implemented in the two shapes each case calls for: with
  a filter field the field keeps the focus and points at the active item; without one, focus
  moves onto the menu item, which is the APG menu-button pattern. This was the third instance
  of the same defect, so `roving-focus.contract` asserts the property rather than the three
  places it happened to appear.

**Outstanding.**

- Nothing in this section. The three declared-but-unimplemented roles are implemented and
  each is now gated.

---

## Drag interactions, audited against 2.5.7

ADR 003 required every drag interaction in the package to be checked, and named
`ResizablePanel` as the likely failure. **That guess was wrong** and is corrected here:
`ResizablePanel` already implements keyboard resize. The two that did fail were in `Table`,
and both now have a keyboard route rather than a larger target.

| Surface | Drag | Non-drag alternative | Verdict |
| --- | --- | --- | --- |
| `ResizablePanel` separator | Pointer drag | `role="separator"`, `tabIndex=0`, arrow keys with `Shift` for a coarse step, Home/End | Passes, gated in unit and e2e |
| `Slider` thumb | Pointer drag | Arrow keys on the thumb | Passes |
| `Drawer` swipe-to-dismiss | Swipe | Close control and Escape | Passes |
| `TimePicker` clock face | Pointer drag of the hand | `handlePointerDown` sets the value at the tap position before any movement, so a single tap works | Passes, ungated for this property |
| `Table` column resize | `onMouseDown`/`onTouchStart` from TanStack's resize handler | `role="separator"`, `tabIndex=0`, arrow keys with `Shift` for a coarse step, Home/End | Passes, gated |
| `Table` row reorder | HTML5 `dragstart`/`drop` | A real `<button>` handle, ArrowUp/ArrowDown to move the row | Passes, gated |

## The `reduceMotion` prop, audited against 2.2.2

Sixteen components accept `reduceMotion?: boolean | "auto"`. It exists because a consumer
sometimes knows more than the OS setting does — a kiosk, a print preview, a page that is
already moving. The rule is the same on every component that has it:

| Value | Behaviour |
| --- | --- |
| `"auto"` (default) | Follows the operating system's `prefers-reduced-motion` setting. |
| `true` | Always reduces motion, whatever the OS reports. |
| `false` | Always animates, **including for a user who has asked their OS for less motion.** |

`false` is the row that matters for conformance, and it is stated plainly rather than
buried: passing it defeats the user's stated preference. Two things make that a considered
position rather than a hole.

The default is `"auto"`, so the preference is honoured unless a consumer writes `false`
explicitly. Nothing about installing this package overrides anyone's setting; only a
deliberate line of code does.

And the alternative is a worse lie. A prop named `reduceMotion` whose `false` did not
actually mean "do not reduce" would be a name that is not true of its behaviour — the exact
defect ADR 005 gates against for tokens, one layer up. If the escape hatch should not exist,
the honest fix is to remove the prop, not to keep it and quietly ignore half its range.

Consumers building for a general audience should leave it at `"auto"` and let the OS decide.
`reduceMotion={true}` is always safe.

**The prop applies to the classes as well as the behaviour.** Until this slice, eight of the
sixteen resolved the prop for their JS-driven motion but calmed their `transition-*` and
`animate-*` utilities from the media query alone, so `reduceMotion={true}` left the
decorative motion running. Both paths now read the same resolved value.

| Gate | Covers |
| --- | --- |
| `reduced-motion.contract` "stops animating when the user asks it to" | the media query, every fixture, all 30 components |
| `reduced-motion.contract` "stops animating on the prop alone" | `reduceMotion={true}` with the query reporting no preference |
| `reduced-motion.contract` "keeps the prop's answer when it disagrees" | `reduceMotion={false}` against a query asking for less |

The third is the one that pins the policy: if the precedence is ever reversed, that
assertion fails rather than the behaviour changing quietly. Five of the sixteen —
CountryFlag, Drawer, ResizablePanel, Stepper, Switch — have base fixtures with no motion in
them, so their assertions are vacuous; the suite names them in a list that may shrink but
must not grow.

## Known failures

These are not "ungated": they are believed to fail.

1. **2.2.1 Timing Adjustable** — `Toast` dismisses on a timer with no pause on hover or
   focus. `duration={Infinity}` avoids it; the default does not.
2. **2.4.7 Focus Visible under `unstyled`** — focus rings are classified as decorative, so
   `unstyled` strips them. Correct per ADR 001's layering, and a conformance failure for any
   consumer who runs unstyled without supplying their own indicator. The 2.4.7 row above is
   about the shipped defaults, which is what the gate measures.

2.5.7 was on this list. `Table` column resize and row reorder both have arrow-key routes
now, and `dragging-alternatives.contract` covers all six drag surfaces in the package.

---

## What this document does not cover

- **Level AAA** is out of scope, including 2.4.13 Focus Appearance and 2.5.5 Target Size
  (Enhanced). The 44px figure previously in the README is Apple's HIG number, not a WCAG AA
  requirement at any level; SC 2.5.8's Level AA floor is 24×24 CSS pixels.
- **The axe sweeps run axe's default rule set**, not a rule set filtered to WCAG 2.2 AA
  tags. They therefore report more than this document tracks, and map onto criteria only
  approximately. They also report less than is wrong: `button-name` never applied to
  `TimePicker`, whose combobox is an `<input>`, so an unnamed combobox there would have gone
  unreported. It is named, but by its `placeholder` in the unlabelled fixtures, which is a
  weak name that axe accepts.
- **Consumer overrides.** Every gate here measures the shipped defaults. `classes`,
  `unstyled` and token overrides can invalidate any row, and 1.4.3 in particular.
