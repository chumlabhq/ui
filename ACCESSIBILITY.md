# Accessibility conformance — @chumlab/ui

**Target:** WCAG 2.2 Level AA
**Scope:** the 30 components published from this package
**Last reviewed:** 2026-09-06
**Decision record:** [ADR 003](https://github.com/chumlabhq/ui/blob/main/docs/adr/003-accessibility-conformance-target.md)

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

Of the 55 Level A and AA criteria: **11 Supports, 9 Partially supports, 13 Does not support,
22 Not applicable**. 1.4.11 moved from Does not support to Partially supports on 2026-09-07
when ADR 007 gated it. 2.4.7 moved down and back on the same day: the indicator it certifies
was measured for the first time, at 1.60:1 in dark, and the 757 elements that appeared to have
none turned out to be four blind spots in the new sweep rather than a defect — five real ones
were found in the process and fixed. 1.3.1 and 1.4.3 each moved to Partially supports on 2026-09-06, when the
axe sweep's scope was widened to include the surfaces this library portals, and each moved
back when the findings that caused it were fixed — 57 ARIA structure defects and 4 contrast
defects, plus 31 more the painted-contrast gate found on its first run. Both rows are better
evidenced than they were before they moved.

The ten a component library genuinely owns — 1.3.1, 2.1.1, 2.1.2,
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

**The full sweep audits the fixture and its portals.** It audited only the fixture subtree
until 2026-09-06, which excluded every surface this library portals to `document.body` —
see "What the sweep's scope was hiding" below, and read every row citing
`accessibility-full` in that light. `e2e/accessibility.spec.ts` still audits the fixture
subtree alone; of the 38 fixtures it selects, one portals anything (`Modal/open`) and that
surface reports nothing, so the same hole currently costs it nothing.

### What a component library can and cannot own

Several criteria are met jointly. This package can ship a labelled, keyboard-operable
control; it cannot stop a consumer removing the label, overriding the contrast tokens, or
placing the control inside a page with no heading structure. Where a criterion is shared,
the row says which half is ours.

---

## 1. Perceivable

| SC | Level | Status | Justification | Gate |
| --- | --- | --- | --- | --- |
| 1.1.1 Non-text Content | A | Partially supports | Decorative icons carry `aria-hidden`; icon-only controls take `aria-label`. Controls that mount with no accessible name warn in development, now including the six combobox triggers. Not every one of the 30 components has been audited for icon labelling. | `accessibleName.test`, `combobox-name.contract` (jsdom); `e2e/accessibility-full.spec.ts` (chromium, fixture + portals since 2026-09-06) |
| 1.2.1 Audio-only / Video-only | A | Not applicable | The package ships no audio or video component. | — |
| 1.2.2 Captions (Prerecorded) | A | Not applicable | As above. | — |
| 1.2.3 Audio Description or Media Alternative | A | Not applicable | As above. | — |
| 1.2.4 Captions (Live) | AA | Not applicable | As above. | — |
| 1.2.5 Audio Description (Prerecorded) | AA | Not applicable | As above. | — |
| 1.3.1 Info and Relationships | A | Supports | Label, description and error are associated programmatically, state is published as data attributes with a recorded vocabulary, and **every ARIA relationship in every fixture resolves to an element that exists**. That check found `Breadcrumb`'s ellipsis trigger naming a menu with no `id` at all — `aria-controls` pointing at nothing precisely while the menu was open. A dangling `aria-controls` is excused only while the control reports `aria-expanded="false"`. **Downgraded and restored 2026-09-06:** the widened sweep reported 57 ARIA structure findings inside portalled surfaces, and all 57 are fixed — the popups no longer claim to be the listbox or menu they contain, `DatePicker`'s weekday row is inside its grid, and `CascadingDropdown`'s submenu is portalled out of the menu that owned it. | `aria-relationships.contract` (jsdom, every fixture); `e2e/accessibility.spec.ts` axe (all five); `e2e/accessibility-full.spec.ts` (chromium, fixture + portals) |
| 1.3.2 Meaningful Sequence | A | Does not support | Not gated. DOM order is authored to match reading order, but nothing asserts it. | — |
| 1.3.3 Sensory Characteristics | A | Does not support | Not gated. | — |
| 1.3.4 Orientation | AA | Does not support | No component locks orientation, but nothing tests either orientation. | — |
| 1.3.5 Identify Input Purpose | AA | Does not support | `autoComplete` passes through to the underlying input; the package sets no purpose tokens of its own and nothing gates them. | — |
| 1.4.1 Use of Color | A | Does not support | Not gated. Error states pair colour with an icon and a message in most components; "most" is not a claim. | — |
| 1.4.2 Audio Control | A | Not applicable | The package plays no audio. | — |
| 1.4.3 Contrast (Minimum) | AA | Supports | Every text token is checked against every surface it is used on, in both themes, parsed from `src/index.css` rather than copied into the test. Consumer overrides of the tokens are outside this. **Downgraded and restored 2026-09-06:** the token arithmetic cannot see text painted with a raw palette class, and the widened axe sweep found four it had missed. All four are fixed, and the blind spot is closed by a second gate that measures the painted colour of every fixture in both themes — see "The contrast gates, and why there are two". | `contrast.contract` (jsdom — token arithmetic, engine-independent by construction); `e2e/contrast-painted.spec.ts` (chromium, every fixture, both themes, computed colour); `e2e/accessibility-full.spec.ts` (chromium, fixture + portals) |
| 1.4.4 Resize Text | AA | Does not support | Not gated. Sizing is in `rem`-based Tailwind utilities throughout, which is the precondition, not the proof. | — |
| 1.4.5 Images of Text | AA | Not applicable | The published `dist` contains no bitmap assets; all iconography is inline SVG and all text is live text. (The repository's `src/assets/images` holds demo-site artwork, which is not published.) | — |
| 1.4.10 Reflow | AA | Does not support | Not gated at 320px. The components are authored mobile-first and the README claims 320px support; no test holds that claim. | — |
| 1.4.11 Non-text Contrast | AA | Partially supports | **Gated since 2026-09-07 (ADR 007).** Two things are measured at 3:1 against what sits behind them, over all 429 fixtures in both themes: the focus indicator — whatever outline, ring or border changes when an element or an ancestor is focused, read as a diff so it does not depend on how a component draws one — and any graphical object painted in the accent at any alpha, which is Slider's range, TabPanel's indicator and TimePicker's clock dot. Building it found the gap it was built for: the focus ring on `Input`, `TextArea` and `InternationalPhoneInput` measured **1.60:1** in dark and the focus border **2.54:1**, and the three accent fills **1.65:1**. All are solid in both themes now. **Partial, not full:** a control boundary that is not a focus state — a resting input border, a checkbox outline — is still not measured. | `e2e/contrast-painted.spec.ts` (1349 indicators, 36 fills, 2 recorded), `contrast.contract` (token level) |
| 1.4.12 Text Spacing | AA | Does not support | Not gated. | — |
| 1.4.13 Content on Hover or Focus | AA | Partially supports | Tooltip content is dismissible with Escape and stays open while hovered (`disableHoverableContent` opts out); both are gated. Covered for Tooltip only — the date marker tooltip and other hover surfaces are not. | `Tooltip.test` (jsdom); `e2e/tooltip.spec.ts` (all five, one Tab assertion skipped in WebKit) |

---

## 2. Operable

| SC | Level | Status | Justification | Gate |
| --- | --- | --- | --- | --- |
| 2.1.1 Keyboard | A | Supports | Every control reporting an interactive role can take focus, every roving group has exactly one tab stop or an active-descendant owner, and every drag has a keyboard route. The gate found seven "Clear selection" buttons shipped at `tabIndex={-1}` — for a single select there is no other way back to an empty value — and a `TabPanel` whose tablist had no tab stop at all when `defaultValue` named a disabled tab. The widened sweep reported `scrollable-region-focusable` on seven option scrollers on 2026-09-06 and reports none now: axe exempts a combobox popup from that rule, and the scrolling element became the popup when the listbox role moved off the panel onto it. | `keyboard-reachable.contract`, `roving-focus.contract`, `dragging-alternatives.contract` (jsdom, every fixture); component keyboard specs (all five) |
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
| 2.4.7 Focus Visible | AA | Supports | Focusing any interactive element changes a visible property on it or on an ancestor — the indicator need not sit on the focused node, and `Input` paints `focus-within:ring-2` on the control wrapping its `<input>`. Read from computed style, not from a class string. **Downgraded on 2026-09-07 and restored the same day**, which is worth recording: the new 1.4.11 sweep reported 757 focusable elements changing nothing visible on focus, and that number was the gate rather than the library — a transparent placeholder layer read as the ring colour, a baseline snapshotted while the element was already focused, an indicator drawn by `focus-within` on an ancestor, and `oklab()` ring colours it could not parse. All four fixed, and **five elements that genuinely had none were given the standard ring**. Asserted rather than sampled now: **no focusable element in any of the 429 fixtures may lack an indicator, in either theme**, with an empty recorded-exception list. **`unstyled` still removes it:** ADR 001 classifies the ring as decorative, so a consumer running unstyled has no indicator until they supply one. | `e2e/wcag-layout.spec.ts` (all five, 7 fixtures) and `e2e/contrast-painted.spec.ts` (every focusable element of 429 fixtures, both themes) |
| 2.4.11 Focus Not Obscured (Minimum) | AA | Supports | Both halves asserted. Floating content resolves its layer from the nearest overlay, so a dropdown opened inside a Drawer computes a higher layer than its container; and the focused element inside each overlay is hit-tested at its own centre, so anything painted over it fails. The hit test asks what the criterion asks, rather than inferring it from z-index. A third case was added on 2026-09-11 and is separate from overlays: an element obscured not by something painted over it but by an ancestor that CLIPS it. Measured across every fixture — 77 to 78 hold a focusable child inside a clipping ancestor and 128 to 129 such children, across three runs, none obscured after taking focus. The count moves by one between runs because a fixture whose overlay is still opening contributes no focusable child yet, which is why the gate asserts a floor and not an equality. The earlier figures in this row (103/157 when the gate was written, 101/154 once MultiSelectDropdown's chip strip stopped clipping, 104/159 after two fixtures were added) were all counted over the whole document rather than the fixtures, for the reason below, and are not comparable to these. That gate must focus before it measures: `overflow: hidden` is programmatically scrollable and the browser scrolls it on focus, so a static rect comparison reports failures that do not exist, and did — ten controls in a clipped strip read as outside it until focus scrolled them in. `overflow: clip` does not scroll, which is what the gate's self-check builds to prove it can fail; no component in the library produces the condition on its own. **That gate failed three times and is diagnosed: both defects were in the gate, neither in the library, and the Supports claim now rests on a corrected scope rather than an undiagnosed failure.** The failing findings named a Drawer close button. Its selector was built as `[data-fixture]` followed by a comma-separated focusable list, and CSS splits a selector list on its top-level commas — so only `a[href]` was ever scoped to a fixture and every other clause matched the whole document, page chrome and portals included. Its ancestor walk then climbed out of the portal to `document.body`, which an open Drawer gives `overflow: hidden` to lock scroll and which is ~48px tall on a fixture page, and treated it as the clipping ancestor of a `position: fixed` panel CSS does not clip. Under load the panel is measured mid-transition, its rect falls outside that 48px box, and the gate reports — which is why it looked intermittent. Both are fixed: every clause carries its own scope, portal roots are in scope via `markPortalRoots`, and the walk stops at a `fixed` ancestor. The fall from 104 to the 77-78 above is the harness leaving the count, not coverage lost, and the gate's own self-check is why this survived three runs: it built its own DOM and compared rects by hand, proving the measurement while never exercising the selector or the walk. | `layering.contract` (jsdom, every overlay x floating pair); `e2e/wcag-layout.spec.ts` hit-test (all five, 4 overlays); `e2e/focus-not-obscured.spec.ts` (128-129 focusable children of a clipping ancestor, across 77-78 of 445 fixtures, plus portalled overlay content — measured over three runs 2026-09-13 on the corrected scope) |
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
| 3.2.4 Consistent Identification | AA | Partially supports | Part naming across components is a closed vocabulary with a recorded precedent for every name outside it, so the same element is identified the same way in every component. That governs the styling API and the data attributes, not the visible labels. | `key-migration.contract` (jsdom); [ADR 002](https://github.com/chumlabhq/ui/blob/main/docs/adr/002-classes-key-vocabulary.md) |
| 3.2.6 Consistent Help | A | Not applicable | New in 2.2. A page-level obligation about where help mechanisms appear across a set of pages. A component library has no page set. | — |
| 3.3.1 Error Identification | A | Partially supports | Form components render the error message in a `role="alert"` region, associate it with `aria-describedby`, and mark the control `aria-invalid`. Gated for the components with error fixtures. | `fixtures.contract`, `status-messages.contract` (jsdom); `e2e/accessibility-full.spec.ts` (chromium, fixture + portals since 2026-09-06) |
| 3.3.2 Labels or Instructions | A | Partially supports | `label`, `description` and `required` are wired to the control; an unnamed control warns in development. | `accessibleName.test` (jsdom) |
| 3.3.3 Error Suggestion | AA | Not applicable | The package renders the message the consumer supplies and does not perform validation, so it cannot suggest a correction. | — |
| 3.3.4 Error Prevention (Legal, Financial, Data) | AA | Not applicable | Application-level; the package submits nothing. | — |
| 3.3.7 Redundant Entry | A | Not applicable | New in 2.2. A multi-step process obligation. The package holds no cross-step state. | — |
| 3.3.8 Accessible Authentication (Minimum) | AA | Not applicable | New in 2.2. An authentication-flow obligation. `OTPInput` renders the field and does not impose a cognitive function test; whether an auth flow relies on one is the application's. | — |

---

## 4. Robust

| SC | Level | Status | Justification | Gate |
| --- | --- | --- | --- | --- |
| 4.1.2 Name, Role, Value | A | Supports | Roles, states and properties are exposed and kept true. Every `role="combobox"` resolves to a non-empty accessible name; every roving group moves DOM focus with its tabindex, so the highlight is announced rather than merely marked; every ARIA reference resolves. Three roles declared without their behaviour have been implemented — see below. | `combobox-name.contract`, `roving-focus.contract`, `aria-relationships.contract` (jsdom); `e2e/accessibility.spec.ts` axe (all five); `e2e/accessibility-full.spec.ts` every fixture, and since 2026-09-06 every fixture's portals (chromium). Three `button-name` nodes remain: Switch fixtures that pass no label, which is the consumer's half |
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

## What the sweep's scope was hiding

Until 2026-09-06 the full sweep audited `[data-fixture]` — the fixture subtree, and nothing
else. Every surface this library opens is `createPortal`ed to `document.body`: every menu,
listbox, calendar, tooltip, modal and drawer. None of them was ever inside the audited
subtree. The 25 recorded findings are all on inline form controls because those are the only
elements that stayed in scope, and the count did not move when fifty fixtures started
reaching their opened state — not because the surfaces were clean.

The audit now covers the fixture plus every body-level element React rendered. That is how a
portal root is told from the app root and from a third-party injection: `createPortal`
mounts the surface's own element on `document.body`, so it carries a React fiber key, while
the app root carries a container key and the injected checkout container carries neither.
125 of the 429 fixtures portal something.

**The sweep reported 93 findings the first time it looked in the right place.** 25 were the
recorded ones; 68 were new. All 68 are fixed: the sweep reports **25 findings** across 429
fixtures — the recorded set, and nothing open.

| Rule | Criterion | Found | Now | |
| --- | --- | --- | --- | --- |
| `aria-required-children` | 1.3.1 | 44 | **0** | — |
| `aria-required-parent` | 1.3.1 | 13 | **0** | — |
| `scrollable-region-focusable` | 2.1.1 | 7 | **0** | — |
| `color-contrast` | 1.4.3 | 4 | **0** | — |

**`aria-required-children` was two defects, not one.** A `listbox` or `menu` owns options or
menu items and nothing else, and these surfaces put a search field and a status message
inside theirs. So the popup is no longer the listbox: the portalled panel holds the search
field, the status message and a listbox of options as siblings, and the listbox carries the
id `aria-controls` names. The second shape was the same mistake in the empty and loading
states, where a `role="status"` message was the listbox's only child. Those messages are now
siblings too and the listbox is genuinely empty — axe reports an empty listbox as *needs
review*, not as a violation, and the alternative of dropping the role while empty would have
left `aria-haspopup="listbox"`, `aria-expanded="true"` and `aria-controls` all pointing at
something that is not a listbox. Nothing about the announcement changed: the message was
already a live region and still is.

**The last 2 were one structure, and it has been taken out.** `CascadingDropdown` rendered
its submenu inside the parent menu for positioning, so the submenu's search field was an
owned descendant of that menu however the panel itself was marked — axe walks through
generic wrappers and through `group`, both tried and neither helping, and the one role that
terminates the walk (`menu`) only moved the finding down a level. The submenu is portalled
and anchored now, like every other floating surface, which takes it out of the parent menu's
subtree; the same move let its loading and empty messages take `role="status"`, which they
could not carry while a status inside a menu was an unallowed child of it.

**`aria-required-parent`** was a single line of markup reported thirteen times: `DatePicker`
rendered its weekday header as `<div role="row">` whose parent was a plain `div`, while the
six date rows sat inside the `role="grid"`. It is inside the grid now, above the date rows.
The grid's keyboard model counts `[role="gridcell"][tabindex="0"]` and not rows, and all
fourteen assertions in `focusManagement.test.tsx` — one tabbable cell, day and week arrows,
Home/End with `weekStartsOn`, PageUp/PageDown, Shift+PageUp/PageDown, Enter, the
disabled-day step and the `maxDate` bound — pass unchanged.

**`scrollable-region-focusable` went to zero as a consequence, not as a fix.** axe does not
apply that rule to a combobox popup, and the scrolling element *is* the popup now that the
listbox role sits on it rather than on the panel around it. That is the same reasoning this
document gave for calling six of the seven arguable — the options are reached with the
combobox's own arrow keys — and the seventh, `TimePicker/loading`, turns out to render 96
options behind its spinner rather than a bare message, so the exception was wrong too.

**`color-contrast`** was the raw-palette remainder showing up as a defect rather than a style
note, and it is fixed at the source rather than by darkening a grey. `Table`'s filter menu
wrote `text-gray-500` (4.02:1 on the dark panel) and `text-gray-700` (1.88:1) in a component
that has tokens for exactly this; the menu is tokenised. `Pagination`'s selected option
painted `bg-cl-accent/15` with a `dark:` override at `/60` — the accent itself at 60%, under
accent text, which axe measured at 2.2:1. It is `--cl-accent-bg` in both themes now, and the
highlight no longer repaints a selected row: `data-[selected]` and `data-[highlighted]` are
the same specificity, so which state owned the background was decided by emission order, and
the transient one was winning. A highlighted selected option keeps its tint and deepens its
text to `--cl-accent-hover`.

Finding them took a gate that measures what is painted rather than what the tokens declare —
see "The contrast gates, and why there are two" below.

### The findings that needed the act as well as the scope

15 of the 68 reported only once the fixture's `act` had landed, so they needed both this
scope fix and the act fix before it. All but the `color-contrast` four are fixed:

- `Table/filter-open` and `/filter-selected` — all three `color-contrast` nodes (open)
- `Pagination/rows-per-page-open` — the selected option's contrast (open)
- `InternationalPhoneInput/country-open` and `/country-no-results` — the country listbox and
  its scroller
- `CascadingDropdown/open-submenu`, `/async-submenu-search-resolved`,
  `/async-children-pending`, `/async-children-empty`, `/async-children-error` — the submenu
- `Dropdown/async-load-pending`, `/async-load-empty`, `MultiSelectDropdown/async-load-empty`
  — the listbox in its loading and empty states

### `region` is not in this list, and is not suppressed

A body-level portal sits outside this page's `<main>` by construction, so "all page content
should be contained by landmarks" fires on every surface when axe is given a whole-document
context — 36 of them in the survey that found the scope hole. Given an `include` list axe
reports the rule inapplicable instead: it is a question about the document's landmark
structure, which the consumer composes, not about the component. Nothing is disabled, so a
portal that ever does report it would still be reported.

---

## The contrast gates, and why there are two

`contrast.contract` reads `src/index.css`: every text token against every surface token, in
both themes, plus the accent-on-tint pairs a selected row uses. It is a design constraint on
the scale, and it is structurally blind to a component that does not use the scale. Four
contrast defects shipped inside two components while it reported green, because
`text-gray-500` is not a token and `bg-cl-accent/15` is an alpha of the foreground rather
than a background any token names.

`e2e/contrast-painted.spec.ts` asks the other question, of all 429 fixtures in both themes: the
computed foreground, against the background stack composited down to the first opaque layer,
against WCAG AA's 4.5:1 (3:1 for large text). Both are kept. They fail for different reasons
— the token check fails when the palette moves, the painted check fails when a component
writes a colour that is not in it — and the painted one is self-checked by planting Tailwind
grey-500 on `Button/default`, which the token check cannot see and this one reports.

**It found 31 the first time it ran, and every one is fixed.** Two shapes:

- **Every `message` key wrote both colours.** `"text-sm mt-1 text-cl-error text-cl-success"`
  — unconditional, so `tailwind-merge` kept the last one and *every error message in fifteen
  components painted success green*. The contrast failure (3.30:1 in light) was the symptom;
  the defect was an error announced in the colour of success, in both themes. The colour
  follows the state now: `data-[invalid]:text-cl-error data-[valid]:text-cl-success`, on the
  attributes ADR 002 already put there.
- **White text on the panel token.** `Slider`'s value tooltip and `DatePicker`'s marker
  tooltip both wrote `text-white` on `bg-cl-bg-panel`, which is white in the light theme —
  a 1:1 tooltip.

Two tokens moved with them, and `contrast.contract` gained both as text tokens: light
`--cl-success` from `#16a34a` (3.30:1) to green-700 `#15803d` (5.02:1), and light
`--cl-error` from `#dc2626` to red-700 `#b91c1c`, because `#dc2626` cleared 4.83:1 on the
page and panel but 4.45:1 on the two hover surfaces. `--cl-warning` is deliberately left at
3.19:1 and out of the text tokens: nothing in the package paints text with it.

**What it cannot see is what no fixture renders**, and that bound is now measured and
ratcheted. `scripts/audit-fixture-gap.mjs` classifies every prop with no fixture from the
AST: 151 of 648 put markup on screen no fixture produces, and the count may fall but a rise
fails `doc-truth.contract`. The 37 that would have changed a gate's answer — three portals,
ten roles, ten interactive elements, two colour pairs and eighteen ARIA attributes — were
fixtured first, and the sweeps found five defects in them the moment they rendered:

- **Four dangling accessible names.** `renderTrigger` replaces the library's trigger, and
  with it the value element `comboboxNameProps` falls back to — so `Dropdown`,
  `MultiSelectDropdown`, `MultiSelectSearchableDropdown` and `SearchableDropdown` pointed
  `aria-labelledby` at an id that resolved to nothing. A name the platform cannot compute is
  worse than no name; the fallback is now suppressed when the value element is the
  consumer's to render, and the components warn as they already did.
- **Two more in `Modal`.** `showHeader={false}` keeps `aria-labelledby` and
  `aria-describedby` pointing at the title and description the header no longer renders. The
  title string is still known, so it becomes `aria-label` instead.
- **`aria-allowed-attr`, twice.** `ButtonGroup` put `aria-orientation` on `role="group"`,
  which does not support it — it belongs to the roles that own arrow-key navigation. And
  `CascadingDropdown`'s trigger carried `aria-required`, which `button` does not support:
  that trigger is a menu button, not one of the five combobox siblings that keep it.

---

## Right-to-left is not supported

`dir="rtl"` is out of scope for 0.1.0, and this is the statement of that rather than an
omission. The components render and nothing is clipped — the viewport clamp is symmetrical
because it works from both edges — but nothing mirrors.

Measured, on 2026-09-06, across fourteen `dir="rtl"` fixtures. `e2e/rtl.spec.ts` keeps every
one of these as a skipped assertion with the numbers in its skip reason, so the next person
starts from evidence rather than from a re-measurement:

| | Measured in RTL at 1024px |
| --- | --- |
| `SearchableDropdown` | surface `[25..267]` against a trigger at `[24..1000]` — left-aligned |
| `TimePicker` | surface `[777..999]` against a trigger at `[813..987]` |
| `DatePicker` | surface `[24..338]` against a trigger at `[24..1000]` |
| `Breadcrumb` | surface `[856..1016]` against a trigger at `[882..922]` |
| `Table` filter menu | surface `[45..225]` against a trigger at `[45..59]` |
| `CascadingDropdown` submenu | opens to the **right** of an item at `[25..283]` with room on both sides |
| `Slider` | at `value: 25` the thumb sits 75% from the leading edge |

`Dropdown`, `MultiSelectDropdown` and `Pagination` are not in the table because their surface
is sized to the trigger, so both alignments coincide and the measurement says nothing.

**It does not mirror; it does not mirror the wrong way.** `useAnchoredPosition` takes no
direction input at all, so there is nothing to get wrong. The flip machinery works — the LTR
near-edge fixtures prove a submenu picks the other side when the preferred one cannot hold it
— and its only input is available space.

### The order this has to be done in

1. **Logical properties across the constants files.** `pl-*`/`pr-*`, `ml-*`/`mr-*`,
   `text-left`, `left-*`/`right-*` become their `start`/`end` equivalents. This is the
   largest part and it comes first, because mirroring the positioner while the padding stays
   physical produces a surface in the right place with its contents on the wrong side — a bug
   report per component.
2. **A direction input to `useAnchoredPosition`.** The main-axis alignment and the flip
   preference both read it; the clamp already needs no change.
3. **Icon mirroring.** Chevrons, Breadcrumb separators and Pagination arrows, which are
   markup rather than layout and are the part a user notices last and complains about first.

`Drawer` is deliberately outside all three: its `direction` is physical (`left`/`right`), not
logical (`start`/`end`), so an RTL consumer swaps the value themselves.

---

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
- **Right-to-left**, which is not supported in 0.1.0 and has its own section above with the
  measurements and the order the work has to be done in.
- **Consumer overrides.** Every gate here measures the shipped defaults. `classes`,
  `unstyled` and token overrides can invalidate any row, and 1.4.3 in particular.
