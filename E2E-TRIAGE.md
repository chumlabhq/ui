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

## Trimmed, not deleted (2)

**otpinput › should handle rapid input across browsers** — its throughput
assertion (`endTime - startTime < 3000`) was removed; its real assertion, that
typing `123456` lands one digit per slot, was kept.

**tooltip › should show tooltip instantly when delay is 0** — a straggler,
found by the release matrix on 2026-09-05 rather than by this triage. It carried
`expect(Date.now() - startTime).toBeLessThan(400)` *after* an
`expect(tooltip).toBeVisible({ timeout: 500 })`, so the stopwatch was stricter
than the wait that preceded it: under load Firefox measured 696ms on a tooltip
that had appeared. The triage missed it because it read the whole test rather
than its assertions — the `toBeVisible` half is a real assertion about
`delayDuration={0}`, and it kept the test out of the PERFORMANCE bucket while
the line beside it belonged there. Only the stopwatch was removed.

The lesson for the category: PERFORMANCE is a property of an *assertion*, not of
a test. A test can be half of each.

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

---

# Appendix I — `--cl-text-tertiary`, raised

## The measurement

| theme | token | was | on --cl-bg | on --cl-bg-hover |
|---|---|---|---|---|
| dark | tertiary | 45% | 4.02 FAIL | 4.09 FAIL |
| light | tertiary | 50% | 3.53 FAIL | 3.46 FAIL |

The minimum alpha clearing 4.5:1 on the worst surface is **0.4835 dark, 0.5822
light**.

## What was changed, and why both tokens moved

Raising tertiary alone closes the gap to secondary. Measured as ΔL* on `--cl-bg`:

| | current | tertiary raised alone | both raised |
|---|---|---|---|
| dark | 18.1 | 11.7 | **17.8** |
| light | 19.0 | **7.8** | **18.0** |

Light collapses to ΔL* 7.8 — the two weights become one. So the step moves as a
unit:

- dark: secondary `0.65 → 0.72`, tertiary `0.45 → 0.52`
- light: secondary `0.70 → 0.80`, tertiary `0.50 → 0.62`

**This is not what the instruction said.** It said to *lower* secondary if the
two collapse. Lowering secondary moves it toward tertiary and collapses the gap
further — and at a low enough value secondary fails 4.5:1 too. Raising it is the
only adjustment that satisfies both stated goals. Flagged rather than assumed.

## Result — every text token against every surface, both themes

### dark (default)

| token | bg | bg-elevated | bg-hover | bg-input |
|---|---|---|---|---|
| `--cl-text` | 17.62 | 16.91 | 16.63 | 17.62 |
| `--cl-text-secondary` | 9.11 | 8.93 | 8.85 | 9.11 |
| `--cl-text-tertiary` | 5.07 | 5.09 | 5.09 | 5.07 |
| `--cl-text-disabled` | 2.35 exempt | 2.44 exempt | 2.46 exempt | 2.35 exempt |

### light (`.light`)

| token | bg | bg-elevated | bg-hover | bg-input |
|---|---|---|---|---|
| `--cl-text` | 18.75 | 17.80 | 17.28 | 18.75 |
| `--cl-text-secondary` | 10.17 | 9.83 | 9.65 | 10.17 |
| `--cl-text-tertiary` | 5.26 | 5.16 | 5.11 | 5.26 |
| `--cl-text-disabled` | 2.27 exempt | 2.26 exempt | 2.25 exempt | 2.27 exempt |

`--cl-text-disabled` is exempt by WCAG 1.4.3, which excludes inactive controls;
holding it to 4.5:1 would make disabled indistinguishable from enabled. It is
excluded from the contract by name, with that reason.

## The gate

`src/__tests__/contracts/contrast.contract.test.ts` — 27 assertions. It parses
the values out of `src/index.css` rather than carrying its own copy, so a test
that agrees with itself but not with the stylesheet is impossible.

Proven falsifiable both ways:

- restoring dark tertiary to 45% → *"`--cl-text-tertiary` on `--cl-bg` is 4.02:1,
  under WCAG AA's 4.5:1 for text"*, three surfaces red
- collapsing secondary onto tertiary → *"secondary and tertiary are only ΔL* 3.6
  apart"*

## Consequences

- `axeBaseline.color-contrast` went **18 → 0**. `accessibility.spec.ts`'s
  stale-baseline ratchet caught it and demanded the entry be removed; it is gone,
  leaving `button-name` as the only baselined rule.
- The five fixture axe tests that disabled `color-contrast` citing that baseline
  no longer need to. **No rule is disabled in any fixture-scoped axe test.**
- The 72 demo overrides that restate the library's own tertiary resolve without
  being edited — confirmed by the full sweep finding **zero** contrast violations
  across 276 fixtures.

---

# Appendix J — the demo overrides, corrected

**The 27 in Appendix H was wrong. The real number is 15.**

Twelve of the twenty-seven were false positives: eleven `label` entries and one
`fallback`, all sitting at the top level of a demo's own style factory beside
`card`, `kbd` and `note`, used as `className={s.label}` on the demo's section
headings. They are demo chrome, not `classes` overrides. Deleting them, as the
instruction for the thirteen `label`s directed, would have broken the demos
without touching a single component.

The over-count came from matching a key name against the library's `classes`
vocabulary without checking whether the enclosing object is ever handed to a
`classes` prop. Three successive scanners disagreed before I stopped and read the
files.

## The 15 real overrides, all fixed

| Demo | Line(s) | Key | Library default | Action |
|---|---|---|---|---|
| PaginationDemo | 409, 783, 806, 834 | `navButton` | `text-cl-text-secondary` | named the right token |
| PaginationDemo | 410, 784, 807 | `pageButton` | `dark:text-cl-text-secondary` | named the right token |
| PaginationDemo | 785 | `activePageButton` | — | named the right token |
| BreadcrumbDemo | 148, 160 | `ellipsisButton` | `text-cl-text-secondary` | named the right token |
| CountryFlagDemo | 34 | `count` | `text-cl-text-secondary` | named the right token |
| StepperDemo | 776 | `indicator` | sets no colour | named the right token |
| InternationalPhoneInputDemo | 124 | `countrySelectTrigger` | sets no colour | **removed** — `opacity-50` already reads as disabled |
| ModalDemo | 422 | `closeButton` | sets no colour | **removed** — the default inherits `--cl-text` |
| TableDemo | 3940 | `expandIcon` | `""` | **removed** — both ternary branches were identical |

TabPanelDemo's twenty, fixed in the previous phase, are not counted here.

---

# Appendix K — the full accessibility sweep

`e2e/accessibility-full.spec.ts`, project `a11y-full`. Excluded from every other
project by `testIgnore`, so it never runs in a default local pass.

**276 fixtures, 35 registry entries, 353s (5m53s), 84 violations.** Written to
`e2e/.a11y-full-report.json` as well as logged — a record built from scrollback is
the kind that outlives its run.

| Rule | Nodes | Where |
|---|---|---|
| `button-name` | 59 | DatePicker 13, MultiSelectSearchableDropdown 10, IPI 9, MultiSelectDropdown 9, SearchableDropdown 8, Dropdown 7, **Switch 3** |
| `label` | 16 | Input 7, TextArea 5, Checkbox 4 |
| `heading-order` | 7 | Accordion |
| `label-title-only` | 2 | Input 1, TextArea 1 |

**Zero `color-contrast`.**

### What they are

- **56 of the 59 `button-name`** are the `role="combobox"` trigger with no
  accessible name, on the six dropdown-family components. This is the combobox
  pattern, on the do-not-touch list and already the only entry in `axeBaseline`.
  The sweep shows it is six components wide, not the one the baseline names.
- **3 `button-name` on Switch** — `<button role="switch">` in the `default`,
  `checked` and `loading` fixtures, which pass no label. Every `labelled` fixture
  is clean. A consumer must name a switch; the fixture does not.
- **16 `label` + 2 `label-title-only`** — Checkbox, Input and TextArea fixtures
  that render the bare control. `accessibility.spec.ts` already prefers the
  `labelled` fixture for exactly this reason, and every `labelled` variant is
  clean.
- **7 `heading-order`** — Accordion's `<h3>` triggers on a fixture page that
  renders no `h1`/`h2`. A harness artefact, not the component.

Nothing was fixed, as instructed. On this reading the sweep found **no new
library defect** beyond the six-component reach of the known combobox gap — the
one it did find, Avatar's `with-status` announcing nothing, was caught building
it and is already fixed.

---

# Appendix L — two records closed

## The dist content-hash guard

`scripts/assert-dist-records.mjs`. Four records describe `dist/`:
`validation.build`, `validation.performance`, `validation.npmAudit`, and
`issues.high[8].evidence` (the DatePicker chunk size). GATE-HONESTY 1.1 found
that the three `assert-*.mjs` scripts cannot read a stale dist — but nothing
detected drift *between* runs, and AUDIT-GAP 7.2 caught the DatePicker chunk at
12.63kb, past its hard fail, while the record still said 10.25.

`validation.distFingerprint` is a sha256 over the shipped `.js/.cjs/.mjs/.d.ts/.css`.

| Mode | Who runs it | Effect |
|---|---|---|
| default | `npm run verify:dist-records`, and `04-validate.md` | fails if the fingerprint is missing or has drifted, naming the four stale records |
| `--invalidate` | `postbuild:lib` | clears it — a new dist means the numbers describe the previous one |
| `--stamp` | after the four values are re-measured | records the current fingerprint |

Build invalidates, measurement stamps. Proven end to end: stamp → verify passes →
append one byte to a dist CSS file → *"dist has changed since these records were
written"* → restore → passes → invalidate.

**Left invalidated**, which is the honest state: `dist/` currently holds an app
build, not the `build:lib` output those records were written against, so
`npm run verify:dist-records` fails until someone re-measures.

## README

`- 44px+ touch targets` removed (ADR 003 D2 — no claim without a gate). Nothing
ever measured it, and the OtpInput fixture sweep shows slots at 32px, so it was
also false. The `prefers-reduced-motion` line stays: `reduced-motion.contract`
gates it in both directions.

---

# Appendix M — the last four

## 1. `heading-order` — the h1 was already there; the skip was the problem

`FixtureRoute` already rendered a visually-hidden `h1`. The seven Accordion
nodes persisted because `heading-order` faults a **skip**, not an absence:
Accordion's trigger defaults to `h3` (`DEFAULT_HEADING_LEVEL`), so `h1 → h3`
jumps a level.

Added the missing rung — a visually-hidden `h2` beside the `h1`, both outside
`[data-fixture]` so a component-scoped audit does not inherit them. All seven
clear; the full sweep drops 84 → 77.

## 2 & 3. `label` and `label-title-only` are one defect, not two

**Item 3's premise does not hold.** Neither Input nor TextArea sets a `title`
attribute — the rendered nodes carry only `aria-describedby="…-count"`:

```
<input id="_r_1_" maxlength="40" … aria-describedby="_r_1_-count" type="text" value="hi">
  Only title used to generate label for form element
```

axe's rule name mentions `title`; what actually fires it is a control that is
*described* but not *named*. The `with-counter` fixture adds `aria-describedby`
for the character count, so the same missing-name defect reports under a second
rule. **18 nodes, one cause.**

### The docs check, before touching anything

Grepped every `.ai.md`, `docs/**` and `README.md` for `title` near
label/aria/accessibility wording. **Nothing proposes the HTML `title` attribute
as a labelling mechanism.** Every hit is one of two innocents:

- `title="Basic Usage"` in the demo-reference tables — the demo *section*
  heading attribute, in 17 `.ai.md` files
- Modal's `title` **prop**, which renders a real heading and is auto-linked via
  `aria-labelledby` (`MODAL.ai.md:298`) — a correct mechanism, not this one
- `docs/adr/002-classes-key-vocabulary.md:42`, where `title` is a `classes` key
  name for the header slot

**No documentation changed.**

### The warning

`src/utils/useAccessibleNameWarning.ts`, wired into Input, TextArea and Checkbox.
Warns once per instance when none of `label` / `aria-label` / `aria-labelledby`
is present, and names `title` explicitly when it is the only thing there.
Guarded by `import.meta.env.DEV`, so the branch and the strings leave the
production build. It warns from an effect rather than during render —
`react-hooks/refs` forbids reading the once-guard ref in the render pass.

The message says the warning may be a false positive if the consumer supplies an
external `<label for>`, because it can be, and a warning that overstates its
case gets muted.

21 tests in `src/components/Input/__tests__/accessibleName.test.tsx`: silent when
named three different ways, loud when not, the `title` special case, once per
instance across re-renders, and twice for two instances.

### The expectation list

`docs/adr/002-unrenderable-keys.json` → `axeFixtureExpectations`, and
`accessibility-full.spec.ts` now asserts against it in both directions:

- a finding on a fixture with no recorded expectation **fails**
- an expectation that no longer reports **fails as stale**

Per **fixture**, not per rule. A rule waived across the board is what would have
hidden `Avatar/with-status` — the finding this sweep exists for. 16 `label`
fixtures, 2 `label-title-only`, 59 `button-name`; `heading-order` is not listed,
because it is fixed.

The sweep is now a gate, not a report: **276 fixtures, 349s, 77 violations, all
accounted for.**

## 4. The dist records, earned

`npm run build:lib` ran clean — all five `postbuild:lib` assertions pass, and the
guard invalidated the fingerprint on the way out, as designed.

### Bundle sizes, re-measured

Measured on `dist/shared/<Name>-<hash>.js`, the component's own chunk.
`@tanstack/react-table`, `date-fns`, `clsx` and `tailwind-merge` are external
(`vite.config.ts:131`), so these are the components' own bytes.

| component | gzip KB | class | target | hard fail | status |
|---|---|---|---|---|---|
| Table | 15.30 | leaf | 5 | 10 | **HARD FAIL** |
| DatePicker | 12.32 | date | 10 | 12 | **HARD FAIL** |
| TimePicker | 10.80 | date | 10 | 12 | over target |
| InternationalPhoneInput | 10.46 | locale | 10 | 12 | over target |
| CascadingDropdown | 9.05 | composite | 10 | 12 | ok |
| AccordionShimmer | 8.59 | leaf | 5 | 10 | over target |
| MultiSelectSearchableDropdown | 7.71 | composite | 10 | 12 | ok |
| SearchableDropdown | 7.70 | composite | 10 | 12 | ok |
| MultiSelectDropdown | 7.09 | composite | 10 | 12 | ok |
| Dropdown | 6.90 | leaf | 5 | 10 | over target |
| AvatarBadge | 6.13 | leaf | 5 | 10 | over target |
| Stepper | 5.80 | leaf | 5 | 10 | over target |

**Two hard fails.** `validation.performance` read PASS on numbers from
2026-04-28 — DatePicker 10.25, Table 6.2 — and now reads FAIL.

DatePicker was the one you named: recorded 10.25, AUDIT-GAP 7.2 caught 12.63,
今 12.32. It has been over its 12 KB hard fail for some time and the record said
PASS throughout. **Table is the bigger surprise** — 6.2 → 15.30 KB against a
10 KB ceiling, and nobody had looked.

One measurement trap worth recording: folding in `dist/components/<Name>/**`
reports InternationalPhoneInput at **52.58 KB**, because that path includes the
opt-in `./phone-validators` entry carrying libphonenumber on purpose. The real
default entry is 10.46 KB, and `assert-phone-bundle.mjs` already gates the
separation. Measure the component chunk, not the directory.

### Package

`npm pack --dry-run`: **1136 files, 1.7 MB packed, 5.5 MB unpacked**, against a
recorded 373 files / 371.8 KB. The growth is the per-flag chunk split — 250 flag
chunks in each of two formats plus types — which is opt-in and tree-shaken, so
the default entry is unaffected. The record was simply years stale.

### Green for the right reason

```
✓ stamped sha256:1973efbf62ef42535f918384c2f3c611:1130
✓ dist-derived records match dist/ (sha256:1973efbf62ef42535f918384c2f3c611:1130)
```

All four records — `validation.build`, `validation.performance`,
`validation.npmAudit`, `issues.high[8].evidence` — were re-measured against this
exact artifact before the stamp. `validation.build` was re-scoped from the app
build to `build:lib`, since that is what the other three and the fingerprint
describe.

---

# Appendix N — bundle size, gated

`scripts/assert-bundle-size.mjs`, `npm run verify:bundle-size`.

## What it measures, and the two ways to get it wrong

Both of which had already happened here:

- **`dist/components/<Name>/**`** sweeps in sibling *entries*. IPI's
  `./phone-validators` lives there and carries libphonenumber on purpose;
  counting it reports **52.58 KB**, a number no consumer ever pays.
- **One `dist/shared/<Name>-<hash>.js` chunk** undercounts, because an entry
  usually pulls several. `dist/components/Table/index.js` imports two.

A third, found while writing it: following `import()` sums CountryFlag's 250
lazy per-flag chunks and reports it at **349 KB**. Only static imports count.

So the gate reports two numbers per entry:

| | what it is | enforced? |
|---|---|---|
| `own` | the component's own chunk | **yes** — this is the basis the ceilings in `ai/07-performance.md` were set against |
| `closure` | the eager static closure of the public entry — what `@chumlab/ui/<name>` actually costs | reported |

Gating on `closure` against ceilings written for `own` would report **nine**
components as regressions without one byte having changed. That is a threshold
decision, not a regression, and it is recorded rather than acted on.

## Result — red, as intended

```
✓ self-check: a 25.39 KB entry is caught against the 10 KB leaf ceiling, across 2 files
  component                           own  closure  class      ceiling
  Table                             15.30    17.83  leaf        5/10  HARD FAIL
  DatePicker                        12.32    14.62  date       10/12  HARD FAIL
  TimePicker                        10.80    13.14  date       10/12  over target
  InternationalPhoneInput           10.46    27.58  locale     10/12  over target
  …
  30 entries measured, 4 over target, 2 over hard fail (measured on own-chunk)
  for reference, 9 entries exceed their ceiling on closure
✗ 2 bundle(s) over the class hard fail
```

The self-check plants a ceiling-busting entry and requires it to be caught. Its
first draft used 400,000 repeated characters, which gzip to **0.48 KB** — the
self-check caught its own probe not being a probe. It uses random bytes now.

## Where it is wired, and where it deliberately is not

`ai/04-validate.md` and the PR template, beside `verify:dist-records`.

**Not** in `postbuild:lib`. That chain is `&&`-joined, so a red gate there would
fail `build:lib`, which `prebuild` runs, which would make `npm run build` fail
too — the whole site unbuildable because Table is 5 KB over. The breach belongs
in validation, not in everyone's build.

`validation.performance` now cites the gate as its source instead of carrying
hand-transcribed numbers.

---

# Appendix O — Table's 15.30 KB, diagnosed

**Report only. Nothing changed.**

## First: there was never a 6.2 KB measurement

`ai/07-performance.md:167` reads `- Table : 6.2kb (over 5kb threshold)`. It sits
under `## OUTPUT FORMAT`, in a fenced block alongside `PERFORMANCE AUDIT — <ISO
date>`, `TREE SHAKING: <PASS | FAIL>` and `Performance : <score>`.

**It is the worked example showing the shape of the report.** Button 1.8kb,
DatePicker 4.1kb and Table 6.2kb are illustrative filler. `git log -S` dates the
line to `ec514bd` (2026-04-28), the commit that wrote the step's documentation.

So Table did not grow 2.5× from an honest 6.2 KB. **It has never been measured
before today.** The figure that has been quoted as its size is a placeholder
somebody read as data — the same failure mode as `validation.performance`, one
level further upstream.

## What did change, and when

| commit | date | Table.tsx | lines |
|---|---|---|---|
| 32ae771 | 2026-03-30 | 21.5 KB | 644 |
| **aa36173** | **2026-04-02** | **74.6 KB** | **2143** |
| ec514bd | 2026-04-28 | 81.2 KB | 2309 |
| e55aad9 | 2026-09-01 | 83.1 KB | 2332 |

One commit — *"updating all the components, working on the Table an…"* — took it
from 644 to 2143 lines. Everything since is noise by comparison: +8.5 KB across
five months. **Table has been this size since April.**

## Where the 81 KB of source sits

| region | KB raw | share |
|---|---|---|
| sub-render helpers | 23.8 | 29.4% |
| column & filter derivation | 14.6 | 18.0% |
| desktop table render | 12.8 | 15.8% |
| imports + hooks + types | 9.8 | 12.1% |
| mobile card view | 6.2 | 7.6% |
| state (editing / dnd / filters) | 5.9 | 7.3% |
| responsive + infinite scroll | 4.8 | 5.9% |
| editing / copy / dnd handlers | 3.0 | 3.6% |

By feature, counted as lines mentioning it (a line can serve two, so these
overlap and do not sum):

| feature | lines | of 2332 |
|---|---|---|
| expandable rows | 77 | 3.3% |
| column filters | 70 | 3.0% |
| column pinning | 63 | 2.7% |
| sorting | 36 | 1.5% |
| inline editing | 27 | 1.2% |
| infinite scroll | 22 | 0.9% |
| row selection | 13 | 0.6% |
| mobile card path | 8 | 0.3% |
| search bar | 7 | 0.3% |
| drag & drop | 5 | 0.2% |

14 `useState`, 22 `useCallback`, 10 `useMemo` in one component.

## The chunk itself

```
shared/Table-D08pRczv.js        58.4 raw   15.30 gz   ← the component
shared/useReducedMotion.js       2.8        1.28
shared/scopedCn.js               1.6        0.72
shared/constants.js              2.8        0.68
components/Table/index.js        0.8        0.45
                                            17.83 gz  closure
```

`@tanstack/react-table`, `date-fns`, `clsx` and `tailwind-merge` are external
(`vite.config.ts:131`), so **15.30 KB is Table's own code**. `TableShimmer` and
`icons` are *not* in it — verified by string search on the built chunk — so the
shimmer contributes nothing to this number and removing it would save nothing.

## What comes off with the composition refactor

- **The 42 literal class strings.** `docs/adr/002-classes-key-vocabulary.md:10`:
  ~125 candidate keys blocked behind the vocabulary decision, *"`Table.tsx` alone
  accounts for 42"*. I count 54 literal `className` strings in the file totalling
  **4.3 KB raw**. Moving them into `DEFAULT_TABLE_CLASSES` relocates the bytes
  rather than deleting them — the win is that `unstyled` and `classes` start
  working, not size. Expect **little or no KB**.
- **The column-filter dropdown.** Table positions its own: an overflow-shift
  effect at `Table.tsx:381` and a right-edge alignment handler at `:1246` with a
  hardcoded `dropdownWidth = 220` estimate. `computeDropdownCoords` already
  exists — **twice**, in `Dropdown/utils/helpers.ts:12` and
  `SearchableDropdown/utils/helpers.ts:10`. That is the "positioning
  reimplemented four times" finding from the opening audit, and Table is one of
  the copies. Consolidating removes Table's copy and one of the other two.
- **`useReducedMotion` / `scopedCn` / `constants`** (2.68 KB of the closure) are
  already shared; they appear in Table's number only because the closure counts
  what an isolated import pulls. Nothing to win.

Realistic composition saving: **1–2 KB**, mostly the positioning block. It does
not bring 15.30 under 10.

## What needs Table-specific work

The weight is the monolith, not any single feature:

- **`sub-render helpers` at 23.8 KB (29%)** is the largest region and the obvious
  extraction target — filter dropdowns, header cells, pin controls, the expanded
  row. Splitting them into `Table/components/*` makes them separately
  tree-shakeable for consumers who use none of them.
- **The mobile card view, 6.2 KB (7.6%)**, is a second complete render path that
  every consumer downloads whether or not they set `responsiveBreakpoint`. It is
  the cleanest single lazy-load candidate.
- **Inline editing, drag & drop, infinite scroll** — 5.7% of lines between them,
  each opt-in by prop, each currently eager.

Getting Table under a 10 KB leaf ceiling means splitting it. Getting it under a
ceiling appropriate to a data grid means **deciding it is not a leaf** — a
`grid` class alongside `date`, `locale` and `composite` is the honest option,
and it is a threshold decision, not a refactor.

## DatePicker

12.32 KB against a 12 KB date-class hard fail — the ceiling we already knew
about, first caught at 12.63 KB in AUDIT-GAP 7.2 and recorded as 10.25 KB
throughout. Now gated.

---

# Appendix P — the gate, on exclusive

## Table's mobile split, reverted

0.02 KB net. `Table.tsx`, its two tests, the `mobile` fixture and the constants
baseline are back to `78709fe`; `TableMobileView.tsx` is deleted. Baseline total
is 125 again with `Table/Table.tsx: 42`.

The mechanism was sound — separate chunk, `React.lazy`, null fallback, SSR
untouched. The target was wrong, and the 6.2 KB that made it look worthwhile was
my region measurement over lines 1839–2006 when the block ends at 1942. The
block is ~1.3 KB gzipped, and extracting a body that closes over 27 locals costs
a props interface weighing about the same. Table's real weight is the sub-render
helpers at 23.8 KB raw, 29% of the file, and that is composition-phase work.

## Gated on `exclusive`

| number | what it is | why not |
|---|---|---|
| `own` | the component's own chunk | Rollup splits some components across siblings — Button 0.17, Avatar 0.23, Toast 0.18. A ceiling you pass by moving bytes next door. |
| `closure` | eager static closure of the entry | charges a component for composing. CountryFlag: 11.19 closure, 1.59 exclusive — the gap is a Tooltip any page using Tooltip already paid for. A gate on this reddens when composition improves. |
| **`exclusive`** | **reachable from this entry and no other** | **the marginal cost of adding the component to a page already using the library.** |

`own` and `closure` are still printed. The gap between them is the composition
story, and hiding it would be the same mistake in a new place.

## Shape is derived, not assigned

The shape sets the ceiling, so assigning it by hand would make the ceiling a
matter of opinion. Read off the built artifact, first match wins:

| shape | signal | ceiling | members |
|---|---|---|---|
| surface | renders a `"grid"` role | 12 | 2 |
| overlay | calls `createPortal` | 10 | 9 |
| composed | pulls another component's chunk | 8 | 12 |
| control | none of the above | 6 | 7 |

Read from the component's **own chunk plus its entry**, not the whole closure.
Scoped to the closure it puts 18 of 30 in `overlay`, because everything that
renders a Tooltip inherits `createPortal` from it — the rule would have been
detecting "composes something that portals", not "is an overlay".

Ceilings unchanged from the proposal: floor 4.15 KB (Loader's closure, the
cheapest complete shipping component) × 1.5 / 2 / 2.5 / 3.

## Five breaches, left red

| component | shape | own | closure | exclusive | ceiling | over |
|---|---|---|---|---|---|---|
| Table | surface | 15.30 | 17.81 | 15.66 | 12 | **+3.66** |
| InternationalPhoneInput | composed | 10.46 | 27.58 | 10.80 | 8 | **+2.80** |
| TimePicker | overlay | 10.80 | 13.14 | 11.10 | 10 | **+1.10** |
| Accordion | composed | 0.55 | 11.18 | 9.09 | 8 | **+1.09** |
| DatePicker | surface | 12.32 | 14.62 | 12.53 | 12 | **+0.53** |

Five, not the four expected. **TimePicker is the extra**, and it is the rule
working rather than failing: it renders a clock face, not a `"grid"`, so it
classifies as `overlay` at 10 rather than `surface` at 12. It has no date
library and no grid role — nothing derivable puts it with DatePicker. Widening
the rule to include it by name would be hand-assignment wearing a derivation's
clothes, so it stays red at +1.10.

`InternationalPhoneInput` also moved: `composed`, not `overlay`, because its own
chunk does not portal — it composes SearchableDropdown, which does. That takes
its ceiling from 10 to 8 and its breach from +0.80 to +2.80.

## The aggregate gate

**155.76 KB, 75 files, deduplicated. Ratchet-down-only.**

Every entry can sit under its ceiling while the whole library drifts, and
nothing else would notice — the per-entry gate cannot see it by construction.

Both directions are enforced: above the record fails as growth; more than 0.5 KB
below fails as a stale record, because a record left above reality buys back
headroom nobody agreed to. Verified by moving the constant in each direction.

## Self-check

One probe serves both gates: an entry with 24 KB of random bytes.

```
✓ self-check: a 25.46 KB entry breaches its 6 KB ceiling,
  and moves the library total by 26.07 KB
```

Random, not repeated — the first draft used 400,000 identical characters, which
gzip to 0.48 KB, and the self-check caught its own probe not being a probe.

## `ai/` placeholders

`ai/07-performance.md`'s OUTPUT FORMAT block now carries `<Component>` /
`<n.n>kb` placeholders and a blockquote naming what went wrong. 17 other OUTPUT
FORMAT blocks carry a "Placeholders below, not readings" marker. `ai/run.md`'s
STRICT MODE numbers are thresholds, correctly stated as requirements, and were
left alone.
