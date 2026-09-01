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

- **110 untriaged e2e tests** in `otpinput`, `textarea`, `avatar` and `checkbox`
  — the passing remainder of the four specs the triage expected to delete.
- **`OtpInput` advertises digits and accepts anything.** `pattern="\\d*"`,
  `inputMode="numeric"` and the "Digit N of M" label are all defaults; nothing
  filters without `validate`. Source decision.
- **`Input` ignores `<button type="reset">`.** `defaultValue` seeds internal
  state that drives `value`, so the browser's reset is overwritten on the next
  render. Pinned by `Input.test.tsx` > *keeps its value through a native form
  reset*, which characterises the limitation rather than the desired behaviour.
- **Fixture props are unchecked.** `Fixture["props"]` is
  `Record<string, unknown>`, so every `Pagination` fixture passed `currentPage` —
  a prop whose own doc comment says "Not `currentPage`" — and silently rendered
  page 1. Fixed here for `Pagination` and `Stepper`; the type still permits it
  everywhere else.
- **`tabpanel.spec.ts` axe** — pre-existing, E2E-INVENTORY.md's fourth library bug.
- **`--cl-text-tertiary` contrast** — the Stepper and Switch axe repoints waive
  `color-contrast` only, citing the existing ratcheted baseline in
  `docs/adr/002-unrenderable-keys.json`, which lists both components.
