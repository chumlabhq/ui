# E2E Triage — should these 103 tests exist at all?

Input: the 103 rows marked **stale test** in `E2E-INVENTORY.md`. This document
decides, per test, whether it belongs in the e2e tier, is already asserted
elsewhere, or is real behaviour that has no home yet.

No test file was changed. Nothing was committed.

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
| otpinput.spec.ts | 10 | 0 | 8 | 2 | **no — delete the spec** |
| stepper.spec.ts | 10 | 3 | 7 | 0 | yes, 3 tests |
| button.spec.ts | 6 | 3 | 2 | 1 | yes, 3 tests |
| textarea.spec.ts | 6 | 0 | 5 | 1 | **no — delete the spec** |
| countryflag.spec.ts | 4 | 1 | 3 | 0 | yes, 1 test |
| avatar.spec.ts | 2 | 0 | 1 | 1 | **no — delete the spec** |
| checkbox.spec.ts | 2 | 0 | 2 | 0 | **no — delete the spec** |
| switch.spec.ts | 1 | 1 | 0 | 0 | yes, 1 test |
| toast.spec.ts | 1 | 1 | 0 | 0 | yes, 1 test |
| **Total** | **103** | **30** | **65** | **8** | **9 of 13 specs** |

**63% of the stale e2e suite is duplicate coverage.** Repointing it would have
bought nothing. 30 tests are worth the browser; 8 are behaviours that need a unit
test written, not a spec repointed.

Four specs die outright: `otpinput`, `textarea`, `avatar`, `checkbox`. Not one of
their 21 tests asserts anything a browser is required for.

Of the nine that survive, five survive on three tests or fewer. The realistic
shape of the e2e tier after this is roughly 30 tests across 9 files, most of them
focus, viewport, touch, and axe.

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

Nothing here needs a browser. The spec should be deleted, but two of its tests
contradict the unit tier and must be resolved before they are.

| Test | Verdict | Evidence |
|---|---|---|
| should only accept numeric input | UNCOVERED-BUT-NOT-BROWSER ⚠ | **Contradicts** `OtpInput.test.tsx:151` *does not filter non-numeric characters internally*. The e2e asserts filtering the component deliberately does not do. It never failed only because it ran against the marketing home page and found no inputs. Decide the intended behaviour before writing anything; `:173` sets inputMode to numeric is the only related assertion that exists. |
| should filter non-digits from typed content | UNCOVERED-BUT-NOT-BROWSER ⚠ | Same contradiction; see also `OtpInput.test.tsx:343` does not filter non-numeric characters from paste |
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
| should support aria-label on button groups | COVERED | `Button.test.tsx:480` accepts aria-label for screen readers (ButtonGroup); `:455` renders children with role='group' |
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
| should handle avatar click in group | UNCOVERED-BUT-NOT-BROWSER | `Avatar.test.tsx:647` calls onClick when clicked covers `AvatarGroupCount` (the +N chip) only. Nothing covers clicking an individual avatar inside a group. If the e2e meant the chip, this is COVERED at `:647`; the conservative verdict assumes it meant an avatar. Confirm the intent, then either delete or write the unit test. |
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

## Recommended order of work

1. **Delete 65 COVERED e2e tests**, which removes four specs entirely
   (`otpinput`, `textarea`, `avatar`, `checkbox`). Cheapest, largest win; no new
   test code.
2. **Repoint the 30 BROWSER-ONLY tests** onto fixtures. Nine specs, and five of
   them are three tests or fewer — nothing like the drawer hour.
3. **Write the 8 UNCOVERED tests at the unit tier.** Resolve the two OtpInput
   contradictions first: they assert digit filtering that
   `OtpInput.test.tsx:151`/`:343` say the component deliberately does not do.
   The `Button.tooltip` gap is the most substantive of the eight — a shipped prop
   with no test at any tier.

Three of the 30 BROWSER-ONLY tests are wall-clock "without lag" assertions
(`pagination` rapid navigation, `input` rapid typing, `button` multiple
interactions) plus one page-load timing test in `input`. They technically require
a browser and technically cannot fail. Deleting them too takes the e2e tier to
about 26 tests.
