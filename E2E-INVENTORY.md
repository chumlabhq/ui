# e2e failure inventory

Branch `refactor/v1-hardening`. Full `e2e/` run — 19 specs, chromium, 0 retries — taken after Parts 1 and 2.

**109 failing / 438 passing.**

## What this suite was actually testing

Before Part 1, every spec navigated to `/demo/<name>`. Those routes do not exist: `src/App.tsx:63` mounts the demo pages at the root (`/button`, `/avatar`, …) under a pathless parent route, and `src/App.tsx:127` redirects everything unmatched to `/`. **All 19 specs were asserting against the marketing home page.** They passed as widely as they did only because most assertions sat behind `if (await x.count() > 0)` guards, which pass when the element is absent.

That is also what `validation.accessibility: PASS` in `ai/system-state.json` was reading from — four axe checks, run against the home page.

With the routes corrected and the guards removed, the suite finally reports on the components. The dominant cause below is the second half of the same story: the specs were written against an earlier generation of demo pages and were never updated, because nothing was checking.

| Cause | Count | Meaning |
| --- | --- | --- |
| stale test | 103 | the spec references markup the demo no longer has |
| library bug | 4 | the component is wrong |
| environment | 2 | the check cannot work headless as written |
| demo-page bug | 0 | none survived Part 1; the three found there are fixed |

## Library bugs — the four worth acting on

**accordion.spec.ts › should have no critical accessibility violations in accordion**  
axe: an aria-hidden `<span class="ml-2 shrink-0">` sits inside the focusable trigger button, and the trigger has focusable descendants. Two critical violations.

**countryflag.spec.ts › inner img elements are aria-hidden**  
the inner `<img>` carries `alt=""` but no `aria-hidden`, while its parent is `role="img"`.

**switch.spec.ts › disabled switch has correct ARIA attributes**  
the disabled switch renders `disabled` and `data-disabled="true"` but no `aria-disabled`. Conventional on `role="switch"`.

**tabpanel.spec.ts › should pass axe accessibility audit**  
axe reports 1 violation on the tab list; the suite already disables `scrollable-region-focusable`, so this is a second, unrelated one.

## Environment

**resizablepanel.spec.ts › dragging the handle resizes the panel**  
aria-valuenow stayed at 300 after the drag; synthetic pointer drags need explicit intermediate moves in headless chromium.

**resizablepanel.spec.ts › resize events appear in callback log**  
same drag, so the callback log never filled.

## Stale tests, by spec


### drawer.spec.ts (18)

**Root cause:** every test opens via `getByRole("button", { name: "Navigation Menu" })` or `"Shopping Cart"`. The demo's triggers are "Open Drawer", "left", "right", "top", "bottom", "Open 500px Drawer" — none of the six labels the spec uses exists.

| Test | Failure | Cause |
| --- | --- | --- |
| should open drawer on trigger click | `locator.click: Test timeout of 30000ms exceeded.` | stale test |
| should close drawer on overlay click | `locator.click: Test timeout of 30000ms exceeded.` | stale test |
| should close drawer on Escape key | `locator.click: Test timeout of 30000ms exceeded.` | stale test |
| should close drawer via DrawerCloseButton | `locator.click: Test timeout of 30000ms exceeded.` | stale test |
| should restore focus to trigger on close | `locator.click: Test timeout of 30000ms exceeded.` | stale test |
| should trap focus inside modal drawer | `locator.click: Test timeout of 30000ms exceeded.` | stale test |
| should open without overlay | `locator.click: Test timeout of 30000ms exceeded.` | stale test |
| should not have aria-modal attribute | `locator.click: Test timeout of 30000ms exceeded.` | stale test |
| should preserve form input across open/close | `locator.click: Test timeout of 30000ms exceeded.` | stale test |
| should render overlay with custom opacity | `locator.click: Test timeout of 30000ms exceeded.` | stale test |
| should open swipeable bottom sheet | `locator.click: Test timeout of 30000ms exceeded.` | stale test |
| should change snap point on button click | `locator.click: Test timeout of 30000ms exceeded.` | stale test |
| should prefer aria-label over auto-wired aria-labelledby | `locator.click: Test timeout of 30000ms exceeded.` | stale test |
| should have correct ARIA attributes on dialog | `locator.click: Test timeout of 30000ms exceeded.` | stale test |
| should pass axe accessibility audit | `locator.click: Test timeout of 30000ms exceeded.` | stale test |
| should be usable on mobile viewport | `locator.click: Test timeout of 30000ms exceeded.` | stale test |
| should not shift layout when opening a drawer | `locator.click: Test timeout of 30000ms exceeded.` | stale test |
| should open swipeable drawer on mobile | `locator.click: Test timeout of 30000ms exceeded.` | stale test |

### pagination.spec.ts (18)

**Root cause:** the `basicPagination()` helper filters for a section with text "Basic Pagination"; the demo heading is "Basic Usage". The helper returns an empty locator and every test built on it times out.

| Test | Failure | Cause |
| --- | --- | --- |
| should render page buttons and nav buttons | `expect(received).toBeGreaterThan(expected)` | stale test |
| should navigate to next page on click | `expect(locator).toHaveText(expected) failed` | stale test |
| should mark active page with aria-current and data-active | `expect(locator).toBeVisible() failed` | stale test |
| should disable previous button on first page | `expect(locator).toBeDisabled() failed` | stale test |
| should navigate to previous page on click | `locator.scrollIntoViewIfNeeded: Test timeout of 30000ms exce` | stale test |
| should navigate directly to a page number on click | `locator.click: Test timeout of 30000ms exceeded.` | stale test |
| should disable next button on last page | `locator.click: Test timeout of 30000ms exceeded.` | stale test |
| should enable both buttons on a middle page | `locator.click: Test timeout of 30000ms exceeded.` | stale test |
| should be focusable via Tab key | `locator.scrollIntoViewIfNeeded: Test timeout of 30000ms exce` | stale test |
| should activate page button on Enter key | `locator.scrollIntoViewIfNeeded: Test timeout of 30000ms exce` | stale test |
| should have aria-current=page on active page button | `expect(locator).toBeVisible() failed` | stale test |
| should activate page button on Space key | `locator.scrollIntoViewIfNeeded: Test timeout of 30000ms exce` | stale test |
| should render page info via renderPageInfo | `expect(locator).toBeVisible() failed` | stale test |
| should update page info when navigating | `expect(locator).toBeVisible() failed` | stale test |
| should handle touch interactions on mobile | `expect(locator).toBeAttached() failed` | stale test |
| should maintain visible focus on page buttons | `locator.scrollIntoViewIfNeeded: Test timeout of 30000ms exce` | stale test |
| should not trap focus within pagination | `locator.scrollIntoViewIfNeeded: Test timeout of 30000ms exce` | stale test |
| should handle rapid page navigation without lag | `locator.scrollIntoViewIfNeeded: Test timeout of 30000ms exce` | stale test |

### input.spec.ts (13)

**Root cause:** selectors written against an older Input demo: `[role="button"]` for clickable field icons (they render as real `<button type="button">`), and section/placeholder text that has since changed.

| Test | Failure | Cause |
| --- | --- | --- |
| should render input components on the page | `expect(locator).toBeVisible() failed` | stale test |
| should display placeholder text | `expect(locator).toBeVisible() failed` | stale test |
| should accept user input | `locator.fill: Test timeout of 30000ms exceeded.` | stale test |
| should handle clickable icon interactions | `expect(locator).toBeVisible() failed` | stale test |
| should render disabled inputs | `expect(locator).toBeVisible() failed` | stale test |
| should clear input value | `locator.fill: Test timeout of 30000ms exceeded.` | stale test |
| should allow typing after tabbing to input | `expect(locator).toHaveValue(expected) failed` | stale test |
| should have proper labels on inputs | `expect(locator).toBeVisible() failed` | stale test |
| icon buttons should have button role when clickable | `expect(locator).toBeVisible() failed` | stale test |
| should work within form context | `expect(locator).toBeVisible() failed` | stale test |
| should load page within acceptable time | `locator.scrollIntoViewIfNeeded: Test timeout of 30000ms exce` | stale test |
| should handle rapid typing without lag | `locator.scrollIntoViewIfNeeded: Test timeout of 30000ms exce` | stale test |
| should handle multiple inputs on page | `locator.scrollIntoViewIfNeeded: Test timeout of 30000ms exce` | stale test |

### tooltip.spec.ts (12)

**Root cause:** `filter({ hasText: "Basic Tooltip" })` — the demo has no such heading.

| Test | Failure | Cause |
| --- | --- | --- |
| should position tooltip on bottom | `expect(received).toBeGreaterThan(expected)` | stale test |
| should show tooltip on hover | `locator.scrollIntoViewIfNeeded: Test timeout of 30000ms exce` | stale test |
| should hide tooltip when mouse leaves trigger | `locator.scrollIntoViewIfNeeded: Test timeout of 30000ms exce` | stale test |
| should show tooltip on focus | `locator.scrollIntoViewIfNeeded: Test timeout of 30000ms exce` | stale test |
| should dismiss tooltip on Escape key | `locator.scrollIntoViewIfNeeded: Test timeout of 30000ms exce` | stale test |
| should hide tooltip when focus moves away | `locator.scrollIntoViewIfNeeded: Test timeout of 30000ms exce` | stale test |
| should have proper ARIA attributes | `locator.scrollIntoViewIfNeeded: Test timeout of 30000ms exce` | stale test |
| should have focusable trigger | `locator.scrollIntoViewIfNeeded: Test timeout of 30000ms exce` | stale test |
| should show tooltip on touch/tap for mobile | `locator.scrollIntoViewIfNeeded: Test timeout of 30000ms exce` | stale test |
| should handle rapid hover/unhover without memory leaks | `locator.scrollIntoViewIfNeeded: Test timeout of 30000ms exce` | stale test |
| should handle scroll during tooltip display | `locator.scrollIntoViewIfNeeded: Test timeout of 30000ms exce` | stale test |
| should render tooltip in portal (body) | `locator.scrollIntoViewIfNeeded: Test timeout of 30000ms exce` | stale test |

### otpinput.spec.ts (10)

**Root cause:** four of five `getByRole("heading")` names are absent: "Digits Only", "Disabled State", "Grouped OTP Variations", "Layout Variations".

| Test | Failure | Cause |
| --- | --- | --- |
| should only accept numeric input | `locator.scrollIntoViewIfNeeded: Test timeout of 30000ms exce` | stale test |
| should filter non-digits from typed content | `locator.scrollIntoViewIfNeeded: Test timeout of 30000ms exce` | stale test |
| should navigate through grouped inputs seamlessly | `locator.scrollIntoViewIfNeeded: Test timeout of 30000ms exce` | stale test |
| should display grouped inputs with separators | `locator.scrollIntoViewIfNeeded: Test timeout of 30000ms exce` | stale test |
| should display error styling on error state | `expect(locator).toBeVisible() failed` | stale test |
| should mark inputs with aria-invalid in error state | `expect(locator).toBeVisible() failed` | stale test |
| should have role=group on wrapper | `expect(locator).toHaveAttribute(expected) failed` | stale test |
| should have aria-describedby linking to error in error state | `expect(locator).toBeVisible() failed` | stale test |
| should render disabled OTP inputs | `locator.scrollIntoViewIfNeeded: Test timeout of 30000ms exce` | stale test |
| should mask input when inputType is password | `locator.scrollIntoViewIfNeeded: Test timeout of 30000ms exce` | stale test |

### stepper.spec.ts (10)

**Root cause:** `filter({ hasText: "Basic Stepper" })` — the demo has no such heading.

| Test | Failure | Cause |
| --- | --- | --- |
| displays step labels | `expect(locator).toBeVisible() failed` | stale test |
| active step has aria-current='step' | `expect(locator).toBeVisible() failed` | stale test |
| steps use semantic list markup | `expect(locator).toBeVisible() failed` | stale test |
| clicking a completed step changes the active step | `locator.click: Test timeout of 30000ms exceeded.` | stale test |
| Next and Previous buttons navigate between steps | `locator.click: Test timeout of 30000ms exceeded.` | stale test |
| stepper steps are visible at mobile viewport | `expect(locator).toBeVisible() failed` | stale test |
| stepper has no critical accessibility violations | `locator.scrollIntoViewIfNeeded: Test timeout of 30000ms exce` | stale test |
| click navigation works consistently | `locator.click: Test timeout of 30000ms exceeded.` | stale test |
| tap activates a step on mobile | `locator.tap: Test timeout of 30000ms exceeded.` | stale test |
| user can navigate through all steps using buttons | `locator.click: Test timeout of 30000ms exceeded.` | stale test |

### button.spec.ts (6)

**Root cause:** tooltip and button-group sections the demo no longer labels the way the spec expects.

| Test | Failure | Cause |
| --- | --- | --- |
| should support aria-label on button groups | `expect(locator).toBeVisible() failed` | stale test |
| should show tooltip on hover | `expect(locator).toBeVisible() failed` | stale test |
| span buttons should not be focusable when disabled | `expect(locator).toBeVisible() failed` | stale test |
| should render correctly on mobile viewport | `locator.scrollIntoViewIfNeeded: Test timeout of 30000ms exce` | stale test |
| should handle touch interactions on mobile | `locator.scrollIntoViewIfNeeded: Test timeout of 30000ms exce` | stale test |
| should handle multiple button interactions without lag | `locator.click: Test timeout of 30000ms exceeded.` | stale test |

### textarea.spec.ts (6)

**Root cause:** same as input.spec.ts — the two were written together.

| Test | Failure | Cause |
| --- | --- | --- |
| should handle clickable icon interactions | `expect(locator).toBeVisible() failed` | stale test |
| should render disabled textareas | `expect(locator).toBeVisible() failed` | stale test |
| should have proper labels on textareas | `expect(locator).toBeVisible() failed` | stale test |
| should have aria-describedby linking to error message | `expect(locator).toBeVisible() failed` | stale test |
| icon buttons should have button role when clickable | `expect(locator).toBeVisible() failed` | stale test |
| should work within form context | `expect(locator).toBeVisible() failed` | stale test |

### countryflag.spec.ts (5)

**Root cause:** `filter({ hasText: "Preset Sizes" })` — absent from the demo.

| Test | Failure | Cause |
| --- | --- | --- |
| should load flag images from the local path | `expect(received).toContain(expected) // indexOf` | stale test |
| should render flags at multiple sizes | `expect(locator).toBeVisible() failed` | stale test |
| loading flags inside a group should show shimmer alongside real flags | `expect(received).toBe(expected) // Object.is equality` | stale test |
| inner img elements are aria-hidden | `expect(locator).toHaveAttribute(expected) failed` | library bug |
| should show fallback content for invalid country codes | `expect(locator).toBeVisible() failed` | stale test |

### avatar.spec.ts (2)

**Root cause:** group-click and tooltip sections the demo no longer renders in the shape the spec expects.

| Test | Failure | Cause |
| --- | --- | --- |
| should handle avatar click in group | `expect(locator).toBeVisible() failed` | stale test |
| should show tooltip on hover | `expect(locator).toBeVisible() failed` | stale test |

### checkbox.spec.ts (2)

**Root cause:** form-name and focus assertions against markup the demo changed.

| Test | Failure | Cause |
| --- | --- | --- |
| should be focusable via Tab key | `expect(received).toBeGreaterThan(expected)` | stale test |
| should have name attribute for form submission | `expect(locator).toBeVisible() failed` | stale test |

### resizablepanel.spec.ts (2)

| Test | Failure | Cause |
| --- | --- | --- |
| dragging the handle resizes the panel | `expect(received).toBeGreaterThan(expected)` | environment |
| resize events appear in callback log | `expect(locator).toContainText(expected) failed` | environment |

### switch.spec.ts (2)

**Root cause:** the axe scope selector no longer matches its section.

| Test | Failure | Cause |
| --- | --- | --- |
| disabled switch has correct ARIA attributes | `expect(locator).toHaveAttribute(expected) failed` | library bug |
| switch components have no accessibility violations | `locator.scrollIntoViewIfNeeded: Test timeout of 30000ms exce` | stale test |

### accordion.spec.ts (1)

| Test | Failure | Cause |
| --- | --- | --- |
| should have no critical accessibility violations in accordion | `expect(received).toHaveLength(expected)` | library bug |

### tabpanel.spec.ts (1)

| Test | Failure | Cause |
| --- | --- | --- |
| should pass axe accessibility audit | `1 accessibility violation was detected` | library bug |

### toast.spec.ts (1)

**Root cause:** mobile touch path targets a trigger the demo renders differently.

| Test | Failure | Cause |
| --- | --- | --- |
| should handle touch interactions on mobile | `locator.scrollIntoViewIfNeeded: Test ended.` | stale test |
