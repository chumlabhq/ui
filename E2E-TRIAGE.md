# E2E Triage — should these 103 tests exist at all?

Input: the 103 rows marked **stale test** in `E2E-INVENTORY.md`. This document
decides, per test, whether it belongs in the e2e tier, is already asserted
elsewhere, or is real behaviour that has no home yet.

**Executed on `refactor/v1-hardening`.** Three verdicts changed during execution,
when the re-verification pass reached citations the triage had not grepped; they
are marked **[corrected]** in the tables below and the counts here are the
corrected ones. Everything else was carried out as written.

## Verdicts

- **BROWSER-ONLY** — asserts something jsdom cannot: real focus and tab order,
  computed layout or paint, pointer/touch/drag, portal stacking, scroll, axe.
  Keep and repoint.
- **COVERED** — the same behaviour is asserted in the unit or contract tier, at
  the cited `file:line`. Delete the e2e test.
- **UNCOVERED-BUT-NOT-BROWSER** — real behaviour, no browser requirement, no unit
  coverage found. Write it as a unit test rather than repointing it.

Every COVERED cite below was produced by grepping the named file in this working
tree, not from memory. Where the match was arguable, the verdict is the
conservative one — UNCOVERED rather than COVERED — because a wrong COVERED
silently deletes the only test of a behaviour and a wrong UNCOVERED only costs a
duplicate test.

Unit-test paths are abbreviated: `Drawer.test.tsx` means
`src/components/Drawer/__tests__/Drawer.test.tsx`.

## Summary

| Spec | Stale | BROWSER-ONLY | COVERED | UNCOVERED | Survives as e2e? |
|---|---|---|---|---|---|
| drawer.spec.ts | 18 | 8 | 10 | 0 | yes, 8 tests |
| pagination.spec.ts | 18 | 7 | 10 | 1 | yes, 7 tests |
| input.spec.ts | 13 | 3 | 8 | 2 | yes, 3 tests |
| tooltip.spec.ts | 12 | 3 | 9 | 0 | yes, 3 tests |
| otpinput.spec.ts | 10 | 0 | 10 | 0 | delete 10 tests; spec survives on untriaged tests |
| stepper.spec.ts | 10 | 3 | 7 | 0 | yes, 3 tests |
| button.spec.ts | 6 | 3 | 2 | 1 | yes, 3 tests |
| textarea.spec.ts | 6 | 0 | 5 | 1 | delete 6 tests; spec survives on untriaged tests |
| countryflag.spec.ts | 4 | 1 | 3 | 0 | yes, 1 test |
| avatar.spec.ts | 2 | 0 | 2 | 0 | delete 2 tests; spec survives on untriaged tests |
| checkbox.spec.ts | 2 | 0 | 2 | 0 | delete 2 tests; spec survives on untriaged tests |
| switch.spec.ts | 1 | 1 | 0 | 0 | yes, 1 test |
| toast.spec.ts | 1 | 1 | 0 | 0 | yes, 1 test |
| **Total** | **103** | **30** | **68** | **5** | **13 of 13 spec files** |

**66% of the stale e2e suite is duplicate coverage.** Repointing it would have
bought nothing. 30 tests are worth the browser; 5 are behaviours that need a unit
test written, not a spec repointed.

Not one of the 21 stale tests in `otpinput`, `textarea`, `avatar` or `checkbox`
asserts anything a browser is required for, so all 21 were deleted. **The four
spec files were not.** The triage classified only the 103 stale tests; those four
files hold 131 tests between them, and the 110 that were passing were never
triaged. Spot-checking them found real browser-only work — axe audits, mobile
viewports, touch, tab traversal, "clicking label focuses the textarea". Deleting
the files would have taken that with them, so each kept its untriaged remainder.
Triaging those 110 is the obvious next pass.

Of the nine specs with browser-only work, five survive on three tests or fewer.

### On the drawer hour

`drawer.spec.ts` was repointed first, and 10 of its 18 tests are COVERED. The
`render` field on `Fixture` and the `Toggle` harness were built to drive
`with-trigger`, which exists to serve four tests (trigger click, overlay click,
Escape, close button) that `Drawer.test.tsx` already asserts at :56, :166, :188
and :240. That work is not wasted — the remaining 8 drawer tests are genuinely
browser-only and 6 of them need a live trigger — but the 18-test spec should come
out at 8.

## Direct answer: render fixtures and lost contract coverage

**2 of 264 fixtures are render fixtures.** Both are in
`src/__tests__/fixtures/Drawer.fixtures.tsx`: `with-trigger` and
`with-trigger-non-modal`. No other fixture file declares `render`.

Five contract suites skip them — `fixtures.contract`, `overrides.contract`,
`unstyled.contract`, `reduced-motion.contract`, `hydration.contract` — so the
question is what those five no longer assert about Drawer.

**Nothing.** `DEFAULT_DRAWER_CLASSES` in
`src/components/Drawer/utils/constants.ts` has exactly three keys — `root`,
`overlay`, `panel` — and all three are rendered by Drawer's three *non*-render
fixtures (`open`, `open-left`, `closed-kept-mounted`), which the five suites do
run. Drawer appears in neither `waived` nor `decorativeLeaks` in
`docs/adr/002-unrenderable-keys.json`, so no key was quietly parked to make the
skip work.

The two skipped fixtures are duplicates for contract purposes: the same component
with the same three keys, wrapped in a state harness. The harness is precisely
what breaks the contracts (they pass a sentinel `classes` map that a `render`
fixture never receives), and it adds no key the plain fixtures miss.

So: not more than a handful, and no hole. **The remaining repoints matter more —
except that this triage says most of them should be deletions, not repoints.**

The risk worth naming is forward-looking, not current: `render` is an escape
hatch that opts a fixture out of five contracts at once, silently. If a future
render fixture is the *only* fixture exercising some key, the contracts go quiet
without failing. Cheap guard: assert in `fixtures.contract` that every component's
declared `classes` keys are reachable from its non-render fixtures. Out of scope
here; noted.

## drawer.spec.ts — 18

| Test | Verdict | Evidence |
|---|---|---|
| should open drawer on trigger click | COVERED | `Drawer.test.tsx:56` renders dialog when open; `:1019` re-renders correctly when toggling open. There is no `DrawerTrigger` export — the fixture's "trigger" is the `Toggle` harness flipping the `open` prop, which is what these two assert. |
| should close drawer on overlay click | COVERED | `Drawer.test.tsx:166` calls onOpenChange on overlay click; `:177` negative case for `closeOnOverlayClick={false}` |
| should close drawer on Escape key | COVERED | `Drawer.test.tsx:188` calls onOpenChange on Escape keydown |
| should close drawer via DrawerCloseButton | COVERED | `Drawer.test.tsx:240` calls onOpenChange via context; `:294` close button has aria-label |
| should restore focus to trigger on close | BROWSER-ONLY | Real focus restoration. `Drawer.test.tsx:353` asserts it in jsdom, where focus is bookkeeping; only a browser proves the user's caret lands back on the trigger. |
| should trap focus inside modal drawer | BROWSER-ONLY | Real Tab order. `Drawer.test.tsx:314`/`:337` dispatch Tab keydown and check the handler; they do not exercise the browser's own sequential focus navigation, which is the thing that can regress. |
| should open without overlay | COVERED | `Drawer.test.tsx:574` non-modal mode does not render overlay |
| should not have aria-modal attribute | COVERED | `Drawer.test.tsx:504` does not have aria-modal in non-modal mode |
| should preserve form input across open/close | COVERED | `Drawer.test.tsx:591` keeps content in DOM when closed with keepMounted; `:1019` |
| should render overlay with custom opacity | COVERED | `Drawer.test.tsx:896` overlay opacity is set when drawer is visualOpen |
| should open swipeable bottom sheet | BROWSER-ONLY | Pointer drag + transform. `Drawer.test.tsx:831`–`:855` cover touch-action and handler wiring, not the gesture. |
| should change snap point on button click | BROWSER-ONLY | The observable effect is a computed panel height. `Drawer.test.tsx:1235`/`:1255` cover index clamping and flooring only. |
| should prefer aria-label over auto-wired aria-labelledby | COVERED | `Drawer.test.tsx:509` supports aria-label; `:539` custom aria-labelledby overrides auto-wired one |
| should have correct ARIA attributes on dialog | COVERED | `Drawer.test.tsx:491` role='dialog'; `:496` aria-modal='true' |
| should pass axe accessibility audit | BROWSER-ONLY | axe |
| should be usable on mobile viewport | BROWSER-ONLY | Computed layout at a set viewport |
| should not shift layout when opening a drawer | BROWSER-ONLY | Scrollbar gutter / body offset; a paint concern |
| should open swipeable drawer on mobile | BROWSER-ONLY | Touch |

## pagination.spec.ts — 18

| Test | Verdict | Evidence |
|---|---|---|
| should render page buttons and nav buttons | COVERED | `Pagination.test.tsx:38` renders page buttons for all pages; `:48` renders prev and next navigation buttons |
| should navigate to next page on click | COVERED | `Pagination.test.tsx:182` |
| should mark active page with aria-current and data-active | COVERED | `Pagination.test.tsx:57` aria-current='page'; `:66` data-active |
| should disable previous button on first page | COVERED | `Pagination.test.tsx:75` |
| should navigate to previous page on click | COVERED | `Pagination.test.tsx:170` |
| should navigate directly to a page number on click | COVERED | `Pagination.test.tsx:158` calls onValueChange when clicking a page button |
| should disable next button on last page | COVERED | `Pagination.test.tsx:85` |
| should enable both buttons on a middle page | UNCOVERED-BUT-NOT-BROWSER | `:75` and `:85` assert the disabled ends only. No test asserts both enabled in the middle — grep for `middle`/`enable` in `Pagination.test.tsx` returns nothing. Write it as a unit test. |
| should be focusable via Tab key | BROWSER-ONLY | Sequential focus navigation |
| should activate page button on Enter key | BROWSER-ONLY | Native button key activation. jsdom does not synthesise a click from Enter on a `<button>`; only a browser proves it. |
| should have aria-current=page on active page button | COVERED | `Pagination.test.tsx:57` — duplicate of row 3 above |
| should activate page button on Space key | BROWSER-ONLY | Same as Enter |
| should render page info via renderPageInfo | COVERED | `Pagination.test.tsx:507` |
| should update page info when navigating | COVERED | `Pagination.test.tsx:507`, `:522` passes rowsPerPage to renderPageInfo |
| should handle touch interactions on mobile | BROWSER-ONLY | Touch |
| should maintain visible focus on page buttons | BROWSER-ONLY | Focus ring is paint |
| should not trap focus within pagination | BROWSER-ONLY | Tab order out of the component |
| should handle rapid page navigation without lag | BROWSER-ONLY | Wall-clock timing. Keep only if you want a perf smoke test; it asserts nothing about correctness and has no failure mode short of a hang. |

## input.spec.ts — 13

| Test | Verdict | Evidence |
|---|---|---|
| should render input components on the page | COVERED | `Input.test.tsx:14` renders basic input with placeholder; `:56` renders text input by default |
| should display placeholder text | COVERED | `Input.test.tsx:14` |
| should accept user input | COVERED | `Input.test.tsx:79` calls onChange when user types |
| should handle clickable icon interactions | COVERED | `Input.test.tsx:335` onStartIconClick; `:350` onEndIconClick |
| should render disabled inputs | COVERED | `Input.test.tsx:110` disables input when disabled=true; `:120` data-disabled |
| should clear input value | COVERED | `Input.test.tsx:226` shows clear button when clearable and has value; `:246` calls onClear; `:254` fires onChange exactly once |
| should allow typing after tabbing to input | BROWSER-ONLY | Tab order plus real focus, then typing into the focused element |
| should have proper labels on inputs | COVERED | `Input.test.tsx:19` renders with label |
| icon buttons should have button role when clickable | COVERED | `Input.test.tsx:335`, `:350` — both resolve the icon via `getByRole("button")` |
| should work within form context | UNCOVERED-BUT-NOT-BROWSER | Grep for `<form`, `form submission`, `requestSubmit` in `Input.test.tsx` returns **0 hits**. Native form participation (name, submit, reset) is jsdom-testable. Write it as a unit test. |
| should load page within acceptable time | BROWSER-ONLY (delete) | Measures a page's load time, not the component. Nothing about `Input` can fail this. Delete rather than repoint. |
| should handle rapid typing without lag | BROWSER-ONLY | Wall-clock timing; same caveat as pagination's rapid-navigation test |
| should handle multiple inputs on page | UNCOVERED-BUT-NOT-BROWSER | The real behaviour is id uniqueness across instances. `Input.test.tsx:35`/`:42` cover id generation for a single instance; nothing asserts two instances do not collide. Write it as a unit test. |

## tooltip.spec.ts — 12

| Test | Verdict | Evidence |
|---|---|---|
| should position tooltip on bottom | BROWSER-ONLY | Rendered geometry. `Tooltip.test.tsx:1597` computes bottom positioning tests the pure coordinate function; it cannot catch the tooltip landing off-screen. |
| should show tooltip on hover | COVERED | `Tooltip.test.tsx:97` shows tooltip on mouse enter after delay |
| should hide tooltip when mouse leaves trigger | COVERED | `Tooltip.test.tsx:136` hides tooltip on mouse leave |
| should show tooltip on focus | COVERED | `Tooltip.test.tsx:190` |
| should dismiss tooltip on Escape key | COVERED | `Tooltip.test.tsx:234` |
| should hide tooltip when focus moves away | COVERED | `Tooltip.test.tsx:207` hides tooltip on blur |
| should have proper ARIA attributes | COVERED | `Tooltip.test.tsx:272` role='tooltip'; `:284` trigger has aria-describedby |
| should have focusable trigger | BROWSER-ONLY | Real tab reachability of the trigger |
| should show tooltip on touch/tap for mobile | COVERED | `Tooltip.test.tsx:1349` shows tooltip after long press on touch; `:1371` cancels if touch ends before timeout |
| should handle rapid hover/unhover without memory leaks | COVERED | `Tooltip.test.tsx:623`, `:654` timeout clearing. The e2e version could not observe a leak anyway; the unit tests assert the actual mechanism. |
| should handle scroll during tooltip display | BROWSER-ONLY | Scroll plus reposition |
| should render tooltip in portal (body) | COVERED | `Tooltip.test.tsx:939` renders into document.body via portal; `:953` inline when portal=false; `:970` custom container. (Portal *stacking* would be browser-only; this test only asserts placement in the tree.) |

## otpinput.spec.ts — 10

Nothing here needs a browser. All ten were deleted.

The two "numeric" tests looked like a contradiction until `validate` was grepped
— see the **[corrected]** rows. **OtpInput has no numeric mode and no
alphanumeric mode; it has no mode at all.** It accepts any character and filtering
is opt-in through one prop, `validate: (char) => boolean`, applied on typing
(`OtpInput.tsx:170`) and on paste (`:158`, `:218`). Two other props change only
the *advertisement*: `inputPattern` (default `"\\d*"`) sets the HTML `pattern`
and flips `inputMode` to `numeric` (`:235`), and `inputType="tel"` does the same.
Neither filters anything — `pattern` is form-validation metadata, not an input
filter. So a default `<OtpInput />` tells the browser and the screen reader
("Digit N of M", `:251`) that it wants digits, and then accepts letters. That
incoherence is a source decision, not a test gap, and is left for a human;
`OtpInput.test.tsx` now also pins the pattern/inputMode wiring, which had no
test at all.

| Test | Verdict | Evidence |
|---|---|---|
| should only accept numeric input | COVERED **[corrected]** | `OtpInput.test.tsx:729` rejects invalid characters when validate is provided; `:782` accepts all characters when no validate prop. The triage read this as a contradiction with `:151` because it had not grepped `validate` — `:151` pins the no-`validate` default, `:729` pins the filtering path, and the demo section the e2e drove ("Digits Only") was the `validate` case. Both states are tested. |
| should filter non-digits from typed content | COVERED **[corrected]** | `OtpInput.test.tsx:761` filters invalid characters from paste when validate is provided; `:729` for typing |
| should navigate through grouped inputs seamlessly | COVERED | `OtpInput.test.tsx:191` moves focus to next input after typing digit, and the focus-navigation block through `:303` |
| should display grouped inputs with separators | COVERED | `OtpInput.test.tsx:64` renders inputs in groups; `:71` renders separator between groups; `:82` correct number across groups |
| should display error styling on error state | COVERED | `OtpInput.test.tsx:467` sets data-error attribute on container |
| should mark inputs with aria-invalid in error state | COVERED | `OtpInput.test.tsx:439` |
| should have role=group on wrapper | COVERED | `OtpInput.test.tsx:517` wrapper has role=group with aria-label |
| should have aria-describedby linking to error in error state | COVERED | `OtpInput.test.tsx:460` |
| should render disabled OTP inputs | COVERED | `OtpInput.test.tsx:412` disables all inputs when disabled=true; `:421` data-disabled |
| should mask input when inputType is password | COVERED | `OtpInput.test.tsx:180` renders password type when inputType=password |

## stepper.spec.ts — 10

| Test | Verdict | Evidence |
|---|---|---|
| displays step labels | COVERED | `Stepper.test.tsx:36` renders all step labels |
| active step has aria-current='step' | COVERED | `Stepper.test.tsx:130` |
| steps use semantic list markup | COVERED | `Stepper.test.tsx:121` uses semantic ol/li structure |
| clicking a completed step changes the active step | COVERED | `Stepper.test.tsx:233` updates active step on click in uncontrolled mode; `:262` calls onValueChange on step click; `:286` only completed and active steps are clickable |
| Next and Previous buttons navigate between steps | COVERED | `Stepper.test.tsx:233`, `:262`. Note: Stepper ships no Next/Prev buttons — those were the demo page's own furniture. The library half is the value change, which these cover. |
| stepper steps are visible at mobile viewport | BROWSER-ONLY | Computed layout at a set viewport |
| stepper has no critical accessibility violations | BROWSER-ONLY | axe |
| click navigation works consistently | COVERED | `Stepper.test.tsx:233` — duplicate of the completed-step test above |
| tap activates a step on mobile | BROWSER-ONLY | Touch |
| user can navigate through all steps using buttons | COVERED | `Stepper.test.tsx:233`, `:262`. Demo-page buttons again; no library surface beyond the value change. |

## button.spec.ts — 6

| Test | Verdict | Evidence |
|---|---|---|
| should support aria-label on button groups | COVERED | `Button.test.tsx:481` accepts aria-label for screen readers (ButtonGroup); `:455` renders children with role='group' |
| should show tooltip on hover | UNCOVERED-BUT-NOT-BROWSER | `Button.tsx:66`–`:188` implement a real `tooltip`/`tooltipProps` prop, and grep for `tooltip` in `Button.test.tsx` returns **0 hits**. `Tooltip.test.tsx:97` covers Tooltip's own hover, not Button's wiring of it. Write the unit test. |
| span buttons should not be focusable when disabled | COVERED | `Button.test.tsx:314` has tabIndex=-1 when disabled (for `as="span" disabled`) — the attribute is the mechanism, and it is what regresses |
| should render correctly on mobile viewport | BROWSER-ONLY | Computed layout at a set viewport |
| should handle touch interactions on mobile | BROWSER-ONLY | Touch |
| should handle multiple button interactions without lag | BROWSER-ONLY | Wall-clock timing; low value |

## textarea.spec.ts — 6

| Test | Verdict | Evidence |
|---|---|---|
| should handle clickable icon interactions | COVERED | `TextArea.test.tsx:304` onStartIconClick; `:312` onEndIconClick |
| should render disabled textareas | COVERED | `TextArea.test.tsx:92` disables textarea when disabled=true; `:102` data-disabled |
| should have proper labels on textareas | COVERED | `TextArea.test.tsx:19` renders with label; `:29` associates label via htmlFor; `:384` provides accessible name via label |
| should have aria-describedby linking to error message | COVERED | `TextArea.test.tsx:129` sets aria-describedby to error element; `:134` includes error id when error and errorMessage provided |
| icon buttons should have button role when clickable | COVERED | `TextArea.test.tsx:320` does not render button role when no onClick handler (negative); `:389` icon buttons have accessible labels |
| should work within form context | UNCOVERED-BUT-NOT-BROWSER | The 6 `form` matches in `TextArea.test.tsx` are all the string `"Format"` (an icon label) — there is no form-context test. Write it as a unit test. |

## countryflag.spec.ts — 4

| Test | Verdict | Evidence |
|---|---|---|
| should load flag images from the local path | COVERED | `CountryFlag.test.tsx:23` builds the src from basePath; `:37` resolves the packaged flag without any network request by default |
| should render flags at multiple sizes | COVERED | `CountryFlag.test.tsx:60` applies custom pixel size via number prop; `:67` applies a named size preset |
| loading flags inside a group should show shimmer alongside real flags | BROWSER-ONLY | The claim is that a shimmer and a decoded image sit side by side without a layout jump — image decode plus layout, which jsdom never does. The DOM half of the shimmer is covered by the `CountryFlagShimmer` suite at `CountryFlag.test.tsx:468`; the coexistence is not. |
| should show fallback content for invalid country codes | COVERED | `CountryFlag.test.tsx:50` resolves an unknown code to a src that fails; `:89` renders custom fallback when image fails; `:103` renders nothing when no fallback provided |

## avatar.spec.ts — 2

| Test | Verdict | Evidence |
|---|---|---|
| should handle avatar click in group | COVERED **[corrected]** | `Avatar.test.tsx:446` calls onAvatarClick with correct info; `:465` via Enter; `:486` via Space. The triage grepped `onClick` and found only `AvatarGroupCount` at `:647`; the prop is `onAvatarClick`, and it is covered three ways. |
| should show tooltip on hover | COVERED | `Avatar.test.tsx:509` builds tooltip content from remaining children names (AvatarGroup `showTooltip`); the hover-to-show mechanism is `Tooltip.test.tsx:97` |

## checkbox.spec.ts — 2

| Test | Verdict | Evidence |
|---|---|---|
| should be focusable via Tab key | COVERED | `Checkbox.test.tsx:290` allows focusing via Tab key — `userEvent.tab()` walks real focusable order in jsdom, and `:300` toggles with Space, `:423` programmatic focus via ref |
| should have name attribute for form submission | COVERED | `Checkbox.test.tsx:487`, `:495`, `:510` |

## switch.spec.ts — 1

| Test | Verdict | Evidence |
|---|---|---|
| switch components have no accessibility violations | BROWSER-ONLY | axe. Grep for `axe` in `Switch.test.tsx` returns **0 hits**, so this is the only accessibility gate Switch has. |

## toast.spec.ts — 1

| Test | Verdict | Evidence |
|---|---|---|
| should handle touch interactions on mobile | BROWSER-ONLY | Touch/swipe dismissal. Grep for `touch`/`swipe` in `Toast.test.tsx` returns **0 hits**, so this is the only assertion of swipe-to-dismiss anywhere. |

## What was executed

Order was units first, then repoints, then deletes, so no behaviour was ever
uncovered mid-flight.

**Unit tests written (5 UNCOVERED + the Button tooltip gap):**

| Where | Tests | For |
|---|---|---|
| `Pagination.test.tsx` | 1 | both nav buttons enabled on a middle page |
| `Input.test.tsx` > Form Participation | 5 | submit under `name`, `required` blocking, id/`aria-describedby` uniqueness across instances, and a characterisation of native form reset |
| `TextArea.test.tsx` > Form Participation | 3 | submit under `name`, `required` blocking, id uniqueness |
| `Button.test.tsx` > Tooltip | 9 | hover, unhover, focus, `delayDuration`, `aria-describedby`, `onClick` survival, `tooltipProps` pass-through, the anchor variant |
| `OtpInput.test.tsx` | 2 | the `pattern`/`inputMode` wiring, which had no test |

**Repointed (30 BROWSER-ONLY):** `drawer` 8, `pagination` 7, `input` 3,
`tooltip` 3, `stepper` 3, `button` 3, `countryflag` 1, `switch` 1 (fanned to 4
fixtures), `toast` 1. Six were rewritten rather than moved, because the originals
could not fail: four called `.focus()` and asserted `toBeFocused()`, one counted
a shimmer and an image in the same group, one asserted a button was still
visible after a scroll.

**Deleted (68 COVERED).** No spec file was deleted — see the note under Summary.

**New fixtures:** `Drawer/swipeable-bottom`, `Drawer/snap-points`,
`Tooltip/bottom`, `Tooltip/in-scroller`, `Toast/dismissable`,
`CountryFlag.CountryFlagGroup/mixed-loading`; `Toggle` gained `defaultOpen` and
`_harness` gained `IndexPicker` and `Dismissable`.

**Contract guard (the render-fixture hole).** `fixtures.contract` gained *every
component keeps a fixture the sentinel contracts can drive*. The per-key check
already filtered `render` out, so a key reachable only from a render fixture
would fail it — the case it could not see was a component whose fixtures were
**all** `render`: five suites would filter to an empty list and return early,
passing without asserting. Verified falsifiable by inverting the predicate, which
names all 33 components and fails.

## Still open

- ~~110 untriaged e2e tests~~ — classified in **Appendix B**. 76 COVERED, 25
  BROWSER-ONLY, 3 UNCOVERED, 7 PERFORMANCE. Nothing deleted yet.
- ~~`OtpInput` advertises digits and accepts anything~~ — **decided and fixed.**
  `validate` now derives from `inputPattern`, so the `pattern` attribute,
  `inputMode`, the "Digit N of M" label and the accepted characters all come
  from one source. An explicit `validate` still wins; an uncompilable pattern
  falls back to accepting everything, as the browser does. Behaviour change
  recorded in `OTPINPUT.ai.md`.
- **`Input` ignores `<button type="reset">`.** `defaultValue` seeds internal
  state that drives `value`, so the browser's reset is overwritten on the next
  render. Pinned by `Input.test.tsx` > *keeps its value through a native form
  reset*, which characterises the limitation rather than the desired behaviour.
- ~~Fixture props are unchecked~~ — **fixed; see Appendix C for what it found.**
- ~~`tabpanel.spec.ts` axe~~ — **reconciled and fixed; see Appendix D.**
- **`--cl-text-tertiary` contrast** — the Stepper and Switch axe repoints waive
  `color-contrast` only, citing the existing ratcheted baseline in
  `docs/adr/002-unrenderable-keys.json`, which lists both components.

---

# Appendix A — the fourth category: PERFORMANCE

The original triage had three verdicts. It needed a fourth, and missed it because
it only looked at the 103 *failing* tests: these were all passing.

**PERFORMANCE** — asserts a wall-clock threshold or a demo-page weight against
the dev server. It measures the host machine, not the library. Delete.

Two of the three failures in the previous run were of this kind, and both passed
in isolation — the definition of flaky by construction. They are not
BROWSER-ONLY: needing a browser to run is not the same as needing a browser to
*mean* something, and a threshold that only trips under parallel load has no
failure mode that says anything about the component.

## Deleted (14)

| Spec | Test | What it asserted |
|---|---|---|
| accordion | should load page within acceptable time | `/accordion` loads in <5s |
| avatar | should load page within acceptable time | `/avatar` loads in <5s (10s firefox) |
| button | should load page within acceptable time | `/button` loads in <10s |
| checkbox | should load page within acceptable time | `/checkbox` loads in <10s |
| checkbox | should handle rapid toggling without lag | 10 Space presses in <2s — the only assertion in the test |
| input | renders the fixture within a render budget | a fixture page loads in <10s (added during the repoint; deleted by the same rule) |
| otpinput | should load page within acceptable time | `/otp-input` loads in <10s |
| otpinput | should handle multiple OTP inputs on page efficiently | the demo renders >5 OTP groups — page weight, not behaviour |
| pagination | should load page within acceptable time | `/pagination` loads in <10s |
| tabpanel | should switch tabs without layout thrashing | clicking every tab takes <5s |
| textarea | should load page within acceptable time | `/text-area` loads in <10s |
| textarea | should handle rapid typing without lag | `fill()` takes < `length * 10 + buffer` ms |
| toast | should load page within acceptable time | `/toast` loads in <10s |
| toast | should handle rapid toast creation without lag | 5 toasts in <5s |

## Trimmed, not deleted (1)

**otpinput › should handle rapid input across browsers** — its throughput
assertion (`endTime - startTime < 3000`) was removed; its real assertion, that
typing `123456` lands one digit per slot, was kept.

## Kept (1)

**tooltip › Delay Duration** measures elapsed time, and stays. It is asserting
`delayDuration`, a documented prop of the component, not the speed of the host.

## Renamed

Six `Performance Tests` blocks kept a test that never measured time — shape
validity, no-page-errors, state after repeated open/close. Leaving them under a
"Performance" heading would be the stale-record pattern this branch keeps
finding, so the blocks are now `— Many Instances`, `— Repeated Interaction` and
`— Bulk Dismissal`, and pagination's *should handle rapid dropdown interactions
without lag* became *returns to a closed, valid state after repeated open/close*,
which is what it actually checks.

---

# Appendix B — the other 111

`otpinput`, `textarea`, `avatar` and `checkbox` held 131 tests. The first triage
classified 21 — the ones that were failing. These are the rest, classified the
same way, plus the new PERFORMANCE verdict. Every COVERED cite was grepped in
this tree.

**Executed.** The 76 COVERED are deleted, the 25 BROWSER-ONLY repointed onto
fixtures, and the 3 UNCOVERED written as unit tests first — `TextArea.test.tsx`
gained *Multiline* (3 tests) and *Label Association* (1). All 139 citations below
were re-resolved against the current files before anything was deleted; three had
shifted and are corrected. The four specs are now entirely fixture-based:
`otpinput` 5, `textarea` 9, `avatar` 5, `checkbox` 6.

The repoint found a library bug. `Avatar`'s status indicator is a bare `<span>`
carrying `aria-label`, and ARIA prohibits that on the implicit `generic` role —
the status was announced to nobody. `accessibility.spec.ts` audits one fixture per
component and prefers `default`, so `with-status` had never been audited. Fixed
with `role="img"` (`Avatar.tsx:290`); axe clean, 81 unit tests still pass.

| Spec | Total | BROWSER-ONLY | COVERED | UNCOVERED | PERFORMANCE |
|---|---|---|---|---|---|
| otpinput.spec.ts | 29 | 5 | 22 | 0 | 2 |
| textarea.spec.ts | 29 | 9 | 15 | 3 | 2 |
| avatar.spec.ts | 24 | 5 | 18 | 0 | 1 |
| checkbox.spec.ts | 29 | 6 | 21 | 0 | 2 |
| **Total** | **111** | **25** | **76** | **3** | **7** |

**68% is duplicate coverage** — almost exactly the 66% the failing set showed, so
the two halves of these specs rot at the same rate. Deleting the 76 leaves
`otpinput` at 5 tests, `textarea` at 12, `avatar` at 5 and `checkbox` at 6.

Combined with the first triage, the four specs go from 131 tests to 28.

## otpinput.spec.ts — 29

| Test | Verdict | Evidence |
|---|---|---|
| should render OTP input components on the page | COVERED | `OtpInput.test.tsx:14` renders 6 inputs by default; `:587` wrapper has role=group with aria-label |
| should accept digit input in first field | COVERED | `:111` calls onValueChange when user types a digit; `:164` accepts a digit under the default pattern |
| should auto-advance to next input after entering digit | COVERED | `:261` moves focus to next input after typing digit |
| should complete full OTP entry | COVERED | `:957` calls onComplete when multi-char input fills all slots; `:443` calls onComplete when paste fills all inputs |
| should handle paste of complete OTP | COVERED | `:398` fills multiple inputs on paste; `:443` |
| should navigate left with ArrowLeft | COVERED | `:313` |
| should navigate right with ArrowRight | COVERED | `:325` |
| should navigate to first input with Home | COVERED | `:337` |
| should navigate to last input with End | COVERED | `:349` |
| should clear and navigate back on Backspace | COVERED | `:273` moves focus to previous input on Backspace when current is empty; `:286` clears current input on Backspace when filled |
| should clear current input on Delete | COVERED | `:299` clears current input on Delete without moving focus |
| should not accept input when disabled | COVERED | `:482` disables all inputs; `:491`, `:498` data-disabled |
| should allow full keyboard-only OTP entry | COVERED | A composition of `:111`, `:261` and `:957`; `userEvent` drives the same keystrokes in jsdom |
| should support navigation and editing | COVERED | `:313`, `:325`, `:286` |
| should have no critical accessibility violations | BROWSER-ONLY | axe |
| should have proper aria-label on each input | COVERED | `:546` sets aria-label on each input |
| should have autocomplete=one-time-code on first input | COVERED | `:571`; `:578` autocomplete=off on subsequent inputs |
| should have labels properly associated via htmlFor | COVERED | `:40` associates label with first input via htmlFor |
| should render correctly on mobile viewport | BROWSER-ONLY | Computed layout at a set viewport |
| should handle touch interactions on mobile | BROWSER-ONLY | Touch |
| should maintain touch target size on mobile | BROWSER-ONLY | Computed box size against the WCAG 2.5.5 target — every rect is zero in jsdom |
| should handle focus correctly across browsers | BROWSER-ONLY | Real focus, and the point is the cross-engine difference |
| should handle rapid input across browsers | COVERED | After the throughput half was stripped, what remains is `:957` / `:398` |
| should complete verification code entry flow | COVERED | `:111`, `:261`, `:957` |
| should support edit and correct flow | COVERED | `:286`, `:313` |
| should handle clear and re-enter flow | COVERED | `:273`, `:286` |
| should handle copy-paste workflow | COVERED | `:398`, `:413` drops non-digits from a paste, `:443` |
| should load page within acceptable time | PERFORMANCE | deleted |
| should handle multiple OTP inputs on page efficiently | PERFORMANCE | deleted — asserted the demo renders >5 OTP groups |

## textarea.spec.ts — 29

| Test | Verdict | Evidence |
|---|---|---|
| should render textarea components on the page | COVERED | `TextArea.test.tsx:15` renders basic textarea with placeholder |
| should accept user input | COVERED | `:69` calls onChange when user types; `:84` allows typing in uncontrolled mode |
| should accept multiline input | UNCOVERED-BUT-NOT-BROWSER | Grep for `\n` in `TextArea.test.tsx` returns **0 hits**. A textarea holding a newline is jsdom-testable. Write it as a unit test. |
| should clear textarea value | COVERED | `:202`, `:222` calls onClear, `:230` fires onChange exactly once |
| should display placeholder text | COVERED | `:15` |
| should display labels for textareas | COVERED | `:20`, `:30` associates label via htmlFor |
| should show required indicator on required fields | COVERED | `:25`, `:380` hides required asterisk from screen readers |
| clicking label should focus associated textarea | UNCOVERED-BUT-NOT-BROWSER | `:30` asserts the `htmlFor` wiring but nothing asserts the click transfers focus. jsdom does implement it — `Checkbox.test.tsx:527` does exactly this. Write it as a unit test. |
| should render leading icons | COVERED | `:293` renders start icon |
| should display error message | COVERED | `:120` |
| should mark invalid textareas with aria-invalid | COVERED | `:115` |
| should not allow typing in disabled textarea | COVERED | `:93` |
| should display loader when loading | COVERED | `:328`, `:338` sets aria-busy on wrapper when loading |
| should focus textarea on tab | BROWSER-ONLY | Sequential focus navigation |
| should navigate through textareas with tab | BROWSER-ONLY | Tab order across instances |
| should activate icon buttons with Enter key | BROWSER-ONLY | Native button key activation; jsdom does not synthesise a click from Enter |
| should activate icon buttons with Space key | BROWSER-ONLY | Same |
| should allow typing after tabbing to textarea | BROWSER-ONLY | Tab order plus real focus |
| should support Enter key for newlines | UNCOVERED-BUT-NOT-BROWSER | Same gap as multiline above; `userEvent.type(el, "{enter}")` covers it |
| should have no critical accessibility violations | BROWSER-ONLY | axe |
| should have aria-invalid on error textareas | COVERED | `:115` — duplicate of the row above |
| should mark required textareas with aria-required | COVERED | `:375` |
| should render correctly on mobile viewport | BROWSER-ONLY | Computed layout at a set viewport |
| should handle touch interactions on mobile | BROWSER-ONLY | Touch |
| fullWidth textareas should span container | BROWSER-ONLY | Computed width. `:42` asserts the class only, which is not the same claim. |
| should handle multiple textareas on page | COVERED | `:518` gives each instance a distinct id so labels do not cross-wire |
| should respect rows attribute | COVERED | `:47` default 4 rows; `:52` custom rows |
| should load page within acceptable time | PERFORMANCE | deleted |
| should handle rapid typing without lag | PERFORMANCE | deleted |

## avatar.spec.ts — 24

| Test | Verdict | Evidence |
|---|---|---|
| should render avatar components on the page | COVERED | `Avatar.test.tsx:21` renders initials from name; `:39` renders image when src provided |
| should display initials for text avatars | COVERED | `:21`, `:27` single initial for single-word name, `:33` respects maxInitials |
| should render images when src provided | COVERED | `:39`, `:87` applies imageConfig props to img element |
| should show status indicator when configured | COVERED | `:108`, `:114` config object, `:125` custom status color |
| should render circle shape correctly | COVERED | `:178` applies circle shape by default |
| should render square shape correctly | COVERED | `:185` |
| should render rounded shape correctly | COVERED | `:192` |
| should display avatar group with overlapping avatars | BROWSER-ONLY | The overlap is a computed `margin-inline-start` and z-index stack. `:373` asserts the children render, which is not the same claim. |
| should show surplus count when max exceeded | COVERED | `:387` limits visible avatars when max is set; `:401` shows surplus count |
| should display notification badge | COVERED | `:261` renders count badge |
| should display dot badge | COVERED | `:267` renders dot badge when dot=true |
| should show correct badge count | COVERED | `:275` shows max+ when count exceeds max; `:332` aria-label for count |
| should display loading shimmer | COVERED | `:52` renders shimmer when loading=true; `:719` renders loading state |
| should animate shimmer with pulse effect | COVERED | `:728` applies animate class by default; `:734` does not animate when animate=false. The e2e reads `className.includes("animate-pulse") \|\| getComputedStyle(el).animation !== "none"` — the `\|\|` short-circuits on the class, so the computed half never runs and the test needs no browser. |
| should have no critical accessibility violations | BROWSER-ONLY | axe |
| should have proper ARIA attributes on avatars | COVERED | `:217` role=img when showing initials; `:223`, `:229` aria-label |
| should have proper role on avatar groups | COVERED | `:576` has role=group; `:586` descriptive aria-label |
| should have proper role on badges | COVERED | `:332`, `:341` singular, `:350` dot |
| should render correctly on mobile viewport | BROWSER-ONLY | Computed layout at a set viewport |
| should handle touch interactions on mobile | BROWSER-ONLY | Touch |
| every avatar on the page reports a valid shape | COVERED | `:178`, `:185`, `:192`. A sweep of the demo page's `data-shape` values; the three unit tests assert the same mapping per shape. |
| should handle image loading gracefully | BROWSER-ONLY | `toBeVisible()` on a decoded `<img>`. The `src` and `loading` attributes it also checks are covered by `:39` / `:87`; the decode is not. |
| should show initials when data-has-image is not present | COVERED | `:46` renders fallback when no name or image; `:74` calls onError and shows initials |
| should load page within acceptable time | PERFORMANCE | deleted |

## checkbox.spec.ts — 29

| Test | Verdict | Evidence |
|---|---|---|
| should render checkbox components on the page | COVERED | `Checkbox.test.tsx:14` renders checkbox input |
| should toggle checkbox state on click | COVERED | `:72` calls onValueChange with checked value; `:84` when unchecking |
| should render labels correctly | COVERED | `:20` renders with label; `:360` provides accessible name via label |
| should display description text | COVERED | `:26` renders with description; `:366` links description via aria-describedby |
| should toggle checkbox with Space key | COVERED | `:300` |
| should navigate through checkboxes with Tab | BROWSER-ONLY | Tab order across instances. `:290` covers a single control reached by `userEvent.tab()`. |
| should render disabled checkboxes | COVERED | `:123`, `:140` data-disabled |
| should not toggle disabled checkbox on click | COVERED | `:129` does not call onValueChange when disabled; `:314` nor with Space |
| should display error message | COVERED | `:155` |
| should mark error checkbox with aria-invalid | COVERED | `:149` |
| should display indeterminate checkboxes | COVERED | `:97` sets indeterminate property on input; `:114` data-indeterminate |
| should display required indicator | COVERED | `:38`, `:201` hides asterisk from screen readers |
| should set aria-required on required checkboxes | COVERED | `:195` |
| should have no critical accessibility violations | BROWSER-ONLY | axe |
| should have proper checkbox roles | COVERED | `:14` resolves the control via `getByRole("checkbox")` |
| should have aria-invalid on error checkboxes | COVERED | `:149` — duplicate of the row above |
| should have aria-describedby linking to error message | COVERED | `:167`, `:379` links both description and error |
| error messages should have role='alert' | COVERED | `:155` renders error message when error and errorMessage provided, which asserts `getByRole("alert")` has the text; `:161` the negative case. The role is emitted at `Checkbox.tsx:244`. |
| should render correctly on mobile viewport | BROWSER-ONLY | Computed layout at a set viewport |
| should handle touch interactions on mobile | BROWSER-ONLY | Touch |
| should maintain focus after toggle | BROWSER-ONLY | Where focus lands after a real click. `:330` / `:341` cover the onFocus/onBlur handlers, not the browser's focus placement. |
| disabled checkboxes should not receive focus via Tab | BROWSER-ONLY | Tab order skipping a disabled control |
| should handle multiple checkboxes on page | COVERED | `:486`, `:494`, `:501` id generation across instances; `:72` |
| should have id attribute for label association | COVERED | `:480` uses provided id; `:486`, `:501` |
| should display different sizes | COVERED | `:260` data-size with predefined size; `:267` numeric size |
| should display different shapes | COVERED | `:274` data-shape; `:281` shape class |
| should toggle visual state on data-checked | COVERED | `:540` sets data-checked on checkbox span when checked |
| should load page within acceptable time | PERFORMANCE | deleted |
| should handle rapid toggling without lag | PERFORMANCE | deleted |

## Noted while classifying

- **`Checkbox.tsx:33`** documents "Error/success messages use `role="alert"`".
  The error message does (`:244`); the success message does not (`:250`). One
  half of that comment is false.

---

# Appendix C — typing the fixture props

`Fixture["props"]` was `Record<string, unknown>`. It is now
`Fixtures<typeof Component>`, which resolves to
`Fixture<ComponentProps<typeof Component>>[]`, with `children` omitted from the
props (the fixture supplies it through its own `children` field, which is now
typed from the component too). All 35 modules declare the type argument.

Two constraints shaped the design. `WithoutChildren` is distributive so a
discriminated union of props — Accordion's `type: "single" | "multiple"` —
survives instead of collapsing to its common keys. `Table` is generic over its
row and `ComponentProps` of a generic `forwardRef` erases the parameter to
`unknown`, so it declares `Fixture<TableProps<Row>>[]` directly.

## What it found: 24 wrong fixtures across 11 components

Every one of these rendered without complaint and was asserted against by up to
five contract suites.

| Component | Fixtures | Wrong | Correct |
|---|---|---|---|
| Pagination | all 6 | `currentPage` | `defaultValue` — the prop's own doc comment reads "Not `currentPage` or `page`" |
| Breadcrumb | 2 | `maxItems` | `maxVisibleItems` |
| CascadingDropdown | 2 | `showSearch` | `showMenuSearch` + `showSubmenuSearch` |
| CountryFlagGroup | 1 | `showTooltip` | `showCountTooltip` |
| DatePicker | 1 | `showMonthDropdown`, `showYearDropdown` | neither exists — the dropdowns always render; their *menus* need a click, now an `act` |
| CircularLoader | 1 | `label` | no such prop; the fixture was identical to `default` |
| DotLoader | 2 | `label`, `size` | no `label`; `size` → `dotSize` |
| LinearLoader | 2 | `label`, `size` | no `label`; `size` → `height`/`width` |
| PulseLoader | 1 | `label` | no such prop |
| Stepper | 1 | `clickable` | no such prop; completed and active steps are interactive by default |
| Table | 1 | `mobileBreakpoint` | `responsiveBreakpoint` |
| TabPanel | all 5 | `content` on each tab object | `TabPanelProps` documents a `children` render function and says "Not a `renderContent` prop or `content` on tab objects" |
| Toast | 4 | missing required `id` and `onRemove`; `action`; `variant` | `content`; `type` |
| InternationalPhoneInput | 1 | `defaultValue: "+442071234567"` | `{ countryCode, phoneNumber }` |

Four of these were contradicted by the prop's own doc comment, which named the
wrong spelling and said not to use it.

## The consequence: 10 keys were waived as dead on false evidence

`docs/adr/002-unrenderable-keys.json` recorded these as unreachable. With the
props corrected they render, and `fixtures.contract`'s stale-waiver check caught
every one. The waivers are now ratcheted down.

| Component | Keys | Recorded cause |
|---|---|---|
| CascadingDropdown | `searchInput`, `searchInputElement`, `searchIcon`, `submenuSearchInput`, `submenuSearchInputElement`, `submenuSearchIcon` | "dead — CascadingDropdownProps declares no search prop at all, so the menu search never renders" |
| DatePicker | `dropdownMenu`, `dropdownItem`, `dropdownItemSelected` | "state-gated — the month/year menu opens from a click inside a portalled calendar" |
| Table | `mobileCard` | "state-gated — the mobile branch reads window.innerWidth" |

The CascadingDropdown entry is the sharpest illustration. An ADR declared six
public `classes` keys **dead** — on the grounds that no search prop exists — when
two do. The evidence for that claim was a fixture passing a prop name that had
never existed.

## Not fixed

`REQUIRED_PROPS` in `src/__tests__/contracts/registryMaps.tsx` carried the same
defect: `CountryFlag: { countryCode }`, `Pagination: { currentPage }`, a
`content` key on a tab object, and a `Toast` missing both required props. All
four are corrected by hand, but the map is heterogeneous — keyed by component
name with no component to be generic over — so nothing checks it. It remains the
one place in the contract tier where a wrong prop is still silent.

---

# Appendix D — the TabPanel axe contradiction

Two reports disagreed. **Both were true, and neither was wrong about what it
measured.**

- The earlier report — "verified by axe against reproduction fixtures: TabPanel
  clean" — audited the component. It still holds: `tabInactive` did move to
  `--cl-text-secondary` (`TabPanel/utils/constants.ts:14`), and all five TabPanel
  fixtures audit clean today, including a new one that renders `countInactive`.
- The later report audited `tabpanel.spec.ts`, which called
  `checkA11y(page, undefined, …)`. **A `undefined` selector audits the whole
  document**, so it was reporting on all of `/tab-panel`: the docs sidebar, the
  page's own prose, and fifteen TabPanel instances. 77 contrast nodes.

They disagree on **scope**, not on a rule and not on a fix that failed to hold.

The demo page is the source of nearly all 77: `TabPanelDemo.tsx:219-261` builds a
`classes` object that hands TabPanel back `text-cl-text-tertiary` in twenty
places, undoing the library's own fix on every instance the page renders.

This is E2E-INVENTORY.md's finding a second time — a spec reporting on a page
rather than on the library — and it is why the two reports could both be honest
and still contradict each other.

## Fixed

The audit is scoped to `[data-fixture]` and runs across all five TabPanel
fixtures, **with no rule disabled** — `scrollable-region-focusable` is gone too,
because it was the demo page's scroll containers that tripped it. 30/30 pass.

## Found on the way

`countInactive` had never been audited by anything. `_data.TABS` gives its
`count` to the tab that is active by default, so the *inactive* badge — the only
place `--cl-text-tertiary` still sits on a `bg-cl-bg-hover` ground in TabPanel —
was never rendered by any fixture. The new `inactive-count` fixture renders it,
and it passes. `accessibility.spec.ts` audits one fixture per component and
prefers `default`, so it would still not have caught this; the per-fixture loop
in `tabpanel.spec.ts` does.

## Still open

The `/tab-panel` demo page's own contrast. Twenty `text-cl-text-tertiary`
overrides, plus the page's prose and sidebar. No test covers it now, and none
should without a decision on `--cl-text-tertiary` — but it is a real accessibility
problem on a page real people visit, and it is not the library's.

---

# Appendix E — the hollow typecheck

`tsc --noEmit`, with or without `-p tsconfig.json`, compiles **nothing** in this
repo. The root config is a solution file — `{"files": [], "references": [...]}` —
so the command resolves an empty file set and exits 0 whatever the source says.

Proven, not assumed. With `export const probe: number = "this is not a number"`
in `src/`:

| Command | Result |
|---|---|
| `npx tsc --noEmit` | silent |
| `npx tsc --noEmit -p tsconfig.json` | silent |
| `npx tsc --build` | `error TS2322: Type 'string' is not assignable to type 'number'` |

## Every call site, and what happened to it

| Where | Was | Now |
|---|---|---|
| `package.json` `build` | `tsc -b && vite build` | unchanged — `-b` **is** `--build`, so the build gate was always real |
| `package.json` `build:lib` | `tsc --project tsconfig.lib.json` | unchanged — an explicit project, so it ran (this is what earned the `.d.ts` claim) |
| `package.json` | — | **new** `typecheck` script |
| `package.json` `test:all` | `test:run && test:e2e` | now runs `typecheck` first |
| `README.md:351` | `npx tsc --noEmit` | `npm run typecheck` |
| `ai/04-validate.md:45` | ``- [ ] `tsc --noEmit` returns zero errors`` | `npm run typecheck`, with the reason |
| `.github/PULL_REQUEST_TEMPLATE.md:21` | `npx tsc -b` | `npm run typecheck` (was already real; unified) |

There is no CI workflow and no git hook in this repo, so those were the only
places it ran.

## The gate now proves it can fail

`scripts/assert-typecheck.mjs` plants a deliberate type error in `src/`, requires
`tsc --build` to exit non-zero **and** to name the probe file, deletes it, and
only then runs the real check. It is the same shape as hydration.contract's
`onRecoverableError` self-check: run the detector against a known-bad input
before believing it about a good one.

```
✓ gate rejects a deliberate type error
✓ typecheck clean
```

## Records re-written

Four claims were made on the no-op reading. Each now says what was actually
measured and what the original reading was worth.

- `ai/system-state.json` → `validation.typescript`
- `ai/system-state.json` → `validation.npmAudit`, item (7)
- `ai/system-state.json` → `validation.step04Cycle3.checks.typescript`
- `ai/style-fix-report.json` → `typescript`
- Two nested `verifiedClean.tsc-noEmit` entries annotated in place.

**`GATE-HONESTY.md` §1.7 was itself wrong.** It listed `validation.typescript`
under *"Records that are genuinely earned"*, having "re-verified" it by re-running
the same no-op. That audit tested whether the command passed, not whether it
could fail — the exact distinction the rest of the document is about. Corrected
in place.

---

# Appendix F — the waiver list, re-derived

All 32 waivers were re-derived against the corrected fixtures, not just the ten
that flipped. Two independent checks:

1. **Reachability** — `fixtures.contract`'s stale-waiver check re-runs the
   sentinel-override probe against every corrected fixture. It is executable and
   it now passes, so no waived key renders.
2. **Classification** — each `dead` / `state-gated` label re-derived from source
   by asking whether the key is *applied to an element*, as opposed to merely
   merged into the classes map. **0 mismatches across all 32.**

The second pass needed two corrections of its own before it was trustworthy: it
first false-flagged Table (which aliases `classesProp?.pinIcon` into a local
before applying it) and RadioButton (whose group and item share one file, so the
group's `error` render looked like the item's).

## Three more waivers fell

The reachability check only ever answers for the fixtures that exist. Three
waivers named a prop that exists and that no fixture was passing:

| Component | Key | Recorded reason | What was true |
|---|---|---|---|
| DatePicker | `weekNumber` | "needs `showWeekNumbers` together with a locale week config the fixture could not resolve" | `showWeekNumbers: true` alone renders it |
| CascadingDropdown | `checkbox` | "only renders for multi-select leaf rows inside an entered submenu" | correct, and reachable — `selectionMode` is **per-option**, read from the parent (`CascadingDropdown.tsx:192`) |
| CascadingDropdown | `checkboxChecked` | "same, plus a selection" | correct, and reachable with `defaultValue` |

Two probes found nothing and were removed rather than left as dead fixtures:
`Table/editable` (`editInput` genuinely needs a measured cell) and a
top-level-states CascadingDropdown fixture (`menuItemSelected` and
`menuItemDisabled` are genuinely unreachable — `menuItem*` applies to main-menu
rows, which in this component are always parents).

While writing the `selectionMode` probe the new fixture type rejected
`"multiple"` immediately: the union is `"single" | "multi"`. Table spells the
same concept `selectionMode: "multiple"`. Two components, two spellings — noted,
not changed.

## Final: 29 waived keys across 7 components

| Component | Keys | Dead | State-gated |
|---|---|---|---|
| CascadingDropdown | 8 | `content`, `option`, `optionSelected`, `optionFocused`, `optionDisabled` | `menuItemSelected`, `menuItemDisabled`, `submenuItemFocused` |
| DatePicker | 9 | `monthDropdown`, `yearDropdown`, `navButtonDisabled`, `dayHover` | `dayFocused`, `dayMarked`, `markerIndicator`, `markerTooltip`, `presetActive` |
| Table | 7 | — | `pinIcon`, `pinIconHover`, `pinnedPinIcon`, `pinnedPinIconHover`, `pinButton`, `pinnedPinButton`, `editInput` |
| RadioButton/RadioButton | 2 | `error`, `success` | — |
| InternationalPhoneInput | 1 | — | `countrySelectNoResults` |
| Slider | 1 | — | `thumbActive` |
| Breadcrumb | 1 | — | `itemDisabled` |

**13 dead, 16 state-gated.** Every prop named in a state-gated reason was checked
to exist: `selectionMode`, `showWeekNumbers`, `editable`, `disabled`. That check
is what the CascadingDropdown entry failed a phase ago.

---

# Appendix G — REQUIRED_PROPS, made checkable

**Chosen: typed entries, not a runtime contract test.**

`registryMaps.tsx` now declares `RequiredPropsShape`, one field per component
typed as `Minimal<XProps>` (the component's props with `children` relaxed), and
the map is `satisfies` that shape. A wrong or missing prop is a compile error.

A runtime contract test was the alternative and is weaker here: TypeScript erases
types, so a runtime check would need a separate source of prop names to compare
against — another list that can rot, which is the problem being solved.

The constraint the file exists for still holds. Its own header explains that it
is split out to stay import-light, because the dev-only fixture route loads it
and value-importing the library cost ~30s per navigation. All seventeen new
imports are `import type`, which `verbatimModuleSyntax: true` guarantees are
erased — no runtime import, no eager load.

## It found an eighteenth wrong entry immediately

`RadioButton: { options: [{ value: "a", label: "A" }] }`. `RadioGroupProps` has no
`options`; RadioGroup takes `RadioButton` children. A prior audit had already
found and fixed exactly this in `RadioButton.fixtures.tsx`, whose header comment
reads *"RadioGroup takes RadioButton children, not an `options` array — passing
`options` renders an empty group, which is how its radio-level classes went
unexercised."* The same wrong prop sat in `REQUIRED_PROPS` untouched, because
nothing checked it.

---

# Appendix H — demo pages reinstating a token the library moved off

## TabPanelDemo — fixed

23 `text-cl-text-tertiary` occurrences replaced with `text-cl-text-secondary`,
20 of them inside the `classes` maps at `TabPanelDemo.tsx:210-268`. The whole-page
axe audit goes from **77 contrast nodes to 20**.

The 20 that remain are not this pattern and not the library: 17 are
`text-fg-tertiary` on `<td>` cells in the shared props table — a *different*
token, on the marketing/docs scale — and 3 are nav links and the header CTA. Site
chrome, on a page real people visit, and now covered by no test.

## The same pattern, elsewhere: 27 more

Scanned every demo page for a **library `classes` key** overridden with
`text-cl-text-tertiary` where that component's own default uses a stronger
colour. Constrained to each demo's own component, so `label` in `TableDemo` is
compared against Table's `label`, not Checkbox's.

| Demo | Line | Key |
|---|---|---|
| BreadcrumbDemo | 148, 160 | `ellipsisButton` |
| CascadingDropdownDemo | 416 | `label` |
| CheckboxDemo | 67 | `label` |
| CountryFlagDemo | 34, 42 | `count`, `fallback` |
| DatePickerDemo | 95 | `label` |
| DropdownDemo | 159 | `label` |
| InternationalPhoneInputDemo | 124, 125 | `countrySelectTrigger`, `label` |
| ModalDemo | 422 | `closeButton` |
| OtpInputDemo | 29 | `label` |
| PaginationDemo | 409, 410, 783, 784, 785, 806, 807, 834 | `navButton`, `pageButton`, `activePageButton` |
| RadioButtonDemo | 127 | `label` |
| SliderDemo | 20 | `label` |
| StepperDemo | 197, 776 | `label`, `indicator` |
| SwitchDemo | 32 | `label` |
| TableDemo | 3940 | `expandIcon` |
| TimePickerDemo | 25 | `label` |

**27 overrides across 16 demo files.** Thirteen are `label`, whose library
default is `text-cl-text` — full strength — knocked down to a token that fails
AA. `PaginationDemo` is the densest at eight.

A further **72** overrides pass tertiary for a key whose library default is
*also* tertiary. Those are not this pattern: they restate the library's own
choice, and they resolve when `--cl-text-tertiary` does.

Not fixed — the task was to fix TabPanelDemo and report the rest. The change is
mechanical (tertiary → secondary on 27 lines), but each demo needs its own axe
pass afterwards, and thirteen of them hinge on the same `label` decision that
`--cl-text-tertiary` itself is waiting on.
