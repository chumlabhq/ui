# Accessibility conformance — @chumlab/ui

**Target:** WCAG 2.2 Level AA
**Scope:** the 30 components published from this package
**Last reviewed:** 2026-09-04
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

Gates named below are real files. `--project contracts` and `--project unit` are vitest;
`e2e/` is Playwright, with the full axe sweep in its own project (`--project=a11y-full`).

### What a component library can and cannot own

Several criteria are met jointly. This package can ship a labelled, keyboard-operable
control; it cannot stop a consumer removing the label, overriding the contrast tokens, or
placing the control inside a page with no heading structure. Where a criterion is shared,
the row says which half is ours.

---

## 1. Perceivable

| SC | Level | Status | Justification | Gate |
| --- | --- | --- | --- | --- |
| 1.1.1 Non-text Content | A | Partially supports | Decorative icons carry `aria-hidden`; icon-only controls take `aria-label`. Controls that mount with no accessible name warn in development. Not every one of the 30 components has been audited for icon labelling. | `src/components/Input/__tests__/accessibleName.test.tsx`; `e2e/accessibility-full.spec.ts` (axe `button-name`, `image-alt`) |
| 1.2.1 Audio-only / Video-only | A | Not applicable | The package ships no audio or video component. | — |
| 1.2.2 Captions (Prerecorded) | A | Not applicable | As above. | — |
| 1.2.3 Audio Description or Media Alternative | A | Not applicable | As above. | — |
| 1.2.4 Captions (Live) | AA | Not applicable | As above. | — |
| 1.2.5 Audio Description (Prerecorded) | AA | Not applicable | As above. | — |
| 1.3.1 Info and Relationships | A | Partially supports | Form controls associate label, description and error through `aria-describedby`/`aria-invalid`; state is exposed as data attributes with a recorded vocabulary. Composite widgets are gated only where a fixture renders the relationship. | `e2e/accessibility-full.spec.ts`; `src/__tests__/contracts/state-attributes.contract.test.tsx` |
| 1.3.2 Meaningful Sequence | A | Does not support | Not gated. DOM order is authored to match reading order, but nothing asserts it. | — |
| 1.3.3 Sensory Characteristics | A | Does not support | Not gated. | — |
| 1.3.4 Orientation | AA | Does not support | No component locks orientation, but nothing tests either orientation. | — |
| 1.3.5 Identify Input Purpose | AA | Does not support | `autoComplete` passes through to the underlying input; the package sets no purpose tokens of its own and nothing gates them. | — |
| 1.4.1 Use of Color | A | Does not support | Not gated. Error states pair colour with an icon and a message in most components; "most" is not a claim. | — |
| 1.4.2 Audio Control | A | Not applicable | The package plays no audio. | — |
| 1.4.3 Contrast (Minimum) | AA | Supports | Every text token is checked against every surface it is used on, in both themes, parsed from `src/index.css` rather than copied into the test. Consumer overrides of the tokens are outside this. | `src/__tests__/contracts/contrast.contract.test.ts` |
| 1.4.4 Resize Text | AA | Does not support | Not gated. Sizing is in `rem`-based Tailwind utilities throughout, which is the precondition, not the proof. | — |
| 1.4.5 Images of Text | AA | Not applicable | The published `dist` contains no bitmap assets; all iconography is inline SVG and all text is live text. (The repository's `src/assets/images` holds demo-site artwork, which is not published.) | — |
| 1.4.10 Reflow | AA | Does not support | Not gated at 320px. The components are authored mobile-first and the README claims 320px support; no test holds that claim. | — |
| 1.4.11 Non-text Contrast | AA | Does not support | Not gated. The contrast contract covers text tokens only — borders, focus rings and control boundaries are not measured. | — |
| 1.4.12 Text Spacing | AA | Does not support | Not gated. | — |
| 1.4.13 Content on Hover or Focus | AA | Partially supports | Tooltip content is dismissible with Escape and stays open while hovered (`disableHoverableContent` opts out); both are gated. Covered for Tooltip only — the date marker tooltip and other hover surfaces are not. | `src/components/Tooltip/__tests__/Tooltip.test.tsx`; `e2e/tooltip.spec.ts` |

---

## 2. Operable

| SC | Level | Status | Justification | Gate |
| --- | --- | --- | --- | --- |
| 2.1.1 Keyboard | A | Partially supports | Interactive components are operable from the keyboard, and the composite widgets that were not now are: DatePicker's grid implements the WAI-ARIA grid pattern (arrows, PageUp/PageDown by month, Shift+Page by year, Home/End to week bounds) and its month/year menus implement the listbox pattern. Gated per component, not across all 30. | `src/components/DatePicker/__tests__/focusManagement.test.tsx`; `e2e/*.spec.ts` keyboard cases |
| 2.1.2 No Keyboard Trap | A | Partially supports | The three trapping surfaces — Modal, Drawer and DatePicker — cycle Tab deliberately and each releases on Escape. All three traps are gated in both directions; focus return to the invoking control is gated for DatePicker. No other component holds focus. | `src/components/DatePicker/__tests__/focusManagement.test.tsx`; `src/components/Modal/__tests__/Modal.test.tsx`; `src/components/Drawer/__tests__/Drawer.test.tsx` |
| 2.1.4 Character Key Shortcuts | A | Not applicable | The package binds no single-character shortcuts. Typeahead in the select components is scoped to a focused listbox, which the criterion exempts. | — |
| 2.2.1 Timing Adjustable | A | Does not support | Toast auto-dismisses on a timer. `duration` is adjustable and `Infinity` disables it, but nothing gates pause-on-hover or pause-on-focus, and the default is a timed dismissal. This is a real exposure, not merely an ungated one. | — |
| 2.2.2 Pause, Stop, Hide | A | Partially supports | Shimmer and transition motion is dropped from the shipped defaults under `prefers-reduced-motion`. The gate asserts the class tokens are removed, not the resulting computed animation, so it proves the branch is taken rather than that nothing moves. Toast's auto-dismiss timer is not covered — see 2.2.1. | `src/__tests__/contracts/reduced-motion.contract.test.tsx` |
| 2.3.1 Three Flashes or Below Threshold | A | Not applicable | No component flashes. The only motion is opacity/transform transitions and a shimmer pulse, none of it a luminance flash. | — |
| 2.4.1 Bypass Blocks | A | Not applicable | Page-level. A component library ships no repeated page blocks and no skip-link target. | — |
| 2.4.2 Page Titled | A | Not applicable | Page-level. | — |
| 2.4.3 Focus Order | A | Partially supports | DatePicker's panel takes focus on open, moves it with the roving tabindex, and returns it to the trigger on close — previously it declared `aria-modal` while calling `.focus()` nowhere. Gated for DatePicker and Modal; not proven library-wide. | `src/components/DatePicker/__tests__/focusManagement.test.tsx` |
| 2.4.4 Link Purpose (In Context) | A | Not applicable | The package ships no link component; `Breadcrumb` renders consumer-supplied hrefs and labels. | — |
| 2.4.5 Multiple Ways | AA | Not applicable | Page-level information architecture. | — |
| 2.4.6 Headings and Labels | AA | Partially supports | Form components render a programmatically associated `label` and warn in development when a control mounts unnamed. Heading structure is the consuming page's. | `src/components/Input/__tests__/accessibleName.test.tsx` |
| 2.4.7 Focus Visible | AA | Does not support | Not gated. Focus rings are Tailwind `focus-visible:` utilities in the shipped defaults; ADR 001 classifies them as decorative, so `unstyled` removes them — a consumer running unstyled has no focus indicator until they supply one. That needs stating in the docs and gating, and neither has happened. | — |
| 2.4.11 Focus Not Obscured (Minimum) | AA | Partially supports | The stacking precondition is now proven: floating content resolves its layer from the nearest overlay, so a dropdown opened inside a Drawer or Modal computes a higher layer than its container. Every overlay × floating pair is asserted. What is **not** asserted is the criterion itself — that a focused element is not clipped by a sticky header or scrolled out of view. | `src/__tests__/contracts/layering.contract.test.tsx` |
| 2.5.1 Pointer Gestures | A | Does not support | Not gated. Drawer supports swipe-to-dismiss with a close control as the single-pointer alternative; Slider and ResizablePanel are covered under 2.5.7. | — |
| 2.5.2 Pointer Cancellation | A | Does not support | Not gated. Activation is on `click`/`pointerup` throughout, which is the criterion's requirement, but nothing asserts no component acts on `pointerdown`. | — |
| 2.5.3 Label in Name | A | Does not support | Not gated. Components render their visible label as the accessible name, but no test compares the two strings. | — |
| 2.5.4 Motion Actuation | A | Not applicable | No component responds to device motion. | — |
| 2.5.7 Dragging Movements | AA | Partially supports | Every drag surface was audited (below). Four of six offer a non-drag alternative, and ResizablePanel's — the one ADR 003 named as the likely failure — is keyboard-operable and gated. The two Table drag surfaces have no alternative. | `src/components/ResizablePanel/__tests__/ResizablePanel.test.tsx`; `e2e/resizablepanel.spec.ts` |
| 2.5.8 Target Size (Minimum) | AA | Does not support | The 24×24 CSS pixel floor is very probably met: `h-10` (40px) is the default control height, and the smallest height utility on any interactive default is `h-7` (28px). Those are source measurements, not rendered ones, and the previous README claim shows what happens when a size claim is asserted rather than measured. No test measures a rendered target box. | — |

---

## 3. Understandable

| SC | Level | Status | Justification | Gate |
| --- | --- | --- | --- | --- |
| 3.1.1 Language of Page | A | Not applicable | Page-level; the consuming document owns `<html lang>`. | — |
| 3.1.2 Language of Parts | AA | Not applicable | The package ships no multilingual content of its own. Date formatting takes a `locale`. | — |
| 3.2.1 On Focus | A | Does not support | Not gated. No component initiates a context change on focus alone. | — |
| 3.2.2 On Input | A | Does not support | Not gated. Selection components emit `onValueChange` without navigating or submitting. | — |
| 3.2.3 Consistent Navigation | AA | Not applicable | Page-level. | — |
| 3.2.4 Consistent Identification | AA | Partially supports | Part naming across components is a closed vocabulary with a recorded precedent for every name outside it, so the same element is identified the same way in every component. That governs the styling API and the data attributes, not the visible labels. | `src/__tests__/contracts/key-migration.contract.test.ts`; [ADR 002](docs/adr/002-classes-key-vocabulary.md) |
| 3.2.6 Consistent Help | A | Not applicable | New in 2.2. A page-level obligation about where help mechanisms appear across a set of pages. A component library has no page set. | — |
| 3.3.1 Error Identification | A | Partially supports | Form components render the error message in a `role="alert"` region, associate it with `aria-describedby`, and mark the control `aria-invalid`. Gated for the components with error fixtures. | `e2e/accessibility-full.spec.ts`; `src/__tests__/contracts/fixtures.contract.test.tsx` |
| 3.3.2 Labels or Instructions | A | Partially supports | `label`, `description` and `required` are wired to the control; an unnamed control warns in development. | `src/components/Input/__tests__/accessibleName.test.tsx` |
| 3.3.3 Error Suggestion | AA | Not applicable | The package renders the message the consumer supplies and does not perform validation, so it cannot suggest a correction. | — |
| 3.3.4 Error Prevention (Legal, Financial, Data) | AA | Not applicable | Application-level; the package submits nothing. | — |
| 3.3.7 Redundant Entry | A | Not applicable | New in 2.2. A multi-step process obligation. The package holds no cross-step state. | — |
| 3.3.8 Accessible Authentication (Minimum) | AA | Not applicable | New in 2.2. An authentication-flow obligation. `OTPInput` renders the field and does not impose a cognitive function test; whether an auth flow relies on one is the application's. | — |

---

## 4. Robust

| SC | Level | Status | Justification | Gate |
| --- | --- | --- | --- | --- |
| 4.1.2 Name, Role, Value | A | Partially supports | Roles, states and properties are exposed on every interactive element, and state is additionally published as data attributes with a recorded vocabulary. The full-fixture axe sweep runs every fixture of every component, not one per component. Two roles that were declared without their behaviour have been implemented — see below. | `e2e/accessibility-full.spec.ts`; `src/__tests__/contracts/state-attributes.contract.test.tsx` |
| 4.1.3 Status Messages | AA | Does not support | Not gated. Toast, and the error and loading regions, use `role="alert"` and `role="status"`, but no test asserts that a status change is announced without moving focus. | — |

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

**Outstanding.**

- `DatePicker` clear control — a `<span role="button" tabIndex={0}>` nested inside the
  `<button>` that is the combobox trigger. Interactive content inside a button is invalid,
  and the inner control is not reliably reachable. The combobox trigger is explicitly out of
  scope for this slice; recorded here so it is not rediscovered.
- `useDatePicker.handleKeyDown` still closes the panel on Tab from the trigger. With focus
  now moving into the panel on open, that path is unreachable in normal use, but it
  contradicts the trap and should be removed with the combobox trigger work.

---

## Drag interactions, audited against 2.5.7

ADR 003 required every drag interaction in the package to be checked, and named
`ResizablePanel` as the likely failure. **That guess was wrong** and is corrected here:
`ResizablePanel` already implements keyboard resize.

| Surface | Drag | Non-drag alternative | Verdict |
| --- | --- | --- | --- |
| `ResizablePanel` separator | Pointer drag | `role="separator"`, `tabIndex=0`, arrow keys with `Shift` for a coarse step, Home/End | Passes, gated in unit and e2e |
| `Slider` thumb | Pointer drag | Arrow keys on the thumb | Passes |
| `Drawer` swipe-to-dismiss | Swipe | Close control and Escape | Passes |
| `TimePicker` clock face | Pointer drag of the hand | `handlePointerDown` sets the value at the tap position before any movement, so a single tap works | Passes, ungated for this property |
| `Table` column resize | `onMouseDown`/`onTouchStart` from TanStack's resize handler | **None** | **Fails** |
| `Table` row reorder | HTML5 `dragstart`/`drop` | **None** | **Fails** |

## Known failures

These are not "ungated": they are believed to fail.

1. **2.5.7 Dragging Movements** — `Table` column resizing and `Table` row reordering are
   drag-only, with no keyboard or single-pointer path to either function.
2. **2.2.1 Timing Adjustable** — `Toast` dismisses on a timer with no pause on hover or
   focus. `duration={Infinity}` avoids it; the default does not.
3. **2.4.7 Focus Visible under `unstyled`** — focus rings are classified as decorative, so
   `unstyled` strips them. Correct per ADR 001's layering, and a conformance failure for any
   consumer who runs unstyled without supplying their own indicator.

---

## What this document does not cover

- **Level AAA** is out of scope, including 2.4.13 Focus Appearance and 2.5.5 Target Size
  (Enhanced). The 44px figure previously in the README is Apple's HIG number, not a WCAG AA
  requirement at any level; SC 2.5.8's Level AA floor is 24×24 CSS pixels.
- **The axe sweeps run axe's default rule set**, not a rule set filtered to WCAG 2.2 AA
  tags. They therefore report more than this document tracks, and map onto criteria only
  approximately.
- **Consumer overrides.** Every gate here measures the shipped defaults. `classes`,
  `unstyled` and token overrides can invalidate any row, and 1.4.3 in particular.
