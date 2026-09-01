# @chumlab/ui — Gap Audit

Branch `audit/gap-2026-09`. Read-only pass over `src/` and `dist/` at HEAD.

**Scope.** This covers what a prior audit did not. Deliberately **out of scope and not
re-argued here**: `unstyled` stripping structural classes, `dark:` duplication in the
default class sets, the eight copies of `computeDropdownCoords`, the z-index *layering*
scale, the async `useDropdown` `options` drop, and `llms-full.txt` teaching `.dark`.
Three findings touch that ground from a genuinely different angle and say so where they do
(§6.1 is about a test that *specifies* the unstyled behaviour; §4.1 is about prop *naming*,
not layering; §7.4 is a byte measurement, not a drift argument).

**Severity.** `ship-blocker` — silently breaks a documented promise, crashes, or blocks a
known fix. `defect` — real bug, bounded blast radius. `inconsistency` — works, but the API
disagrees with itself. `cosmetic`.

**Measurement freshness.** `dist/` was built 2026-08-04 13:45; zero files under `src/`
are newer, so §7's numbers describe the current source.

**Findings that were checked and hold up** are recorded as `verified-safe` rather than
omitted, because several of the prompt's hypotheses are wrong and that is worth knowing.

---

## 1. `.cl-s` marker blast radius

The mechanism, for reference: `src/jsx/mark.ts:28-34` appends `cl-s` to every host
element the library renders that has a non-empty string `className`. It is wired in only
through `vite.config.ts:109` (`jsxImportSource: src/jsx`). The built shim is
`dist/shared/jsx-runtime-DrBUMfJO.js`. Every utility in `dist/styles.css` is emitted as
`.foo:where(.cl-s)` (`scripts/build-styles.mjs:27`, `:76-99`), so a class that reaches the
DOM without the marker has **no rule behind it** for any consumer on the precompiled
stylesheet.

Enumerated below: every path by which an element reaches the DOM outside that runtime.

### 1.1 `asChild` / `Slot` — library classes land on an unmarked element — **ship-blocker**

`src/utils/Slot.tsx:27` renders with `cloneElement`, which does not pass through the JSX
runtime. `src/utils/slotHelpers.ts:37-41` merges the slot's `className` into the child's.
The child was created by the **consumer's** `react/jsx-runtime`, so it carries no marker.

Concretely, `src/components/Button/Button.tsx:203-206` hands `combinedClassName` — the full
variant/size/layout string — to `<Slot>`. `<Button asChild><a href="/x">Go</a></Button>`
therefore renders an `<a>` with `inline-flex items-center justify-center …` and **none of
those rules match**. There is no error, no warning, and the element renders as a bare link.

- 11 `asChild ? Slot : …` render sites across the library.
- 4 components expose `asChild` publicly: `Tooltip/utils/types.ts:54`,
  `Accordion/utils/types.ts:84,158,172,186,242`, `Button/utils/types.ts:143`,
  `Avatar/utils/types.ts:172,208,238,280,294,316`.

`asChild` is documented API (`README.md:305`, "Slot — Composition primitive for the
`asChild` pattern"). Nothing anywhere states that using it forfeits styling.

### 1.2 `TooltipAsChildTrigger` — same defect, separate code path — **ship-blocker**

`src/components/Tooltip/components/TooltipAsChildTrigger.tsx:41` calls `cloneElement`
directly and `:96-97` merges `triggerClassName` via `cn()` onto the consumer's element.
Same outcome as 1.1, reached without going through `Slot`, so a fix to `Slot` alone will
not cover it.

### 1.3 Consumer-supplied icon components — **defect**

`src/components/Dropdown/Dropdown.tsx:633` renders
`<ChevronIcon className={mergedClasses.chevron} />`, where `ChevronIcon` defaults to the
library's own icon but is a **public prop**. When a consumer passes their own component,
the `<svg>` it returns comes from their JSX runtime, so `w-4 h-4 shrink-0
transition-transform duration-200 text-cl-text-tertiary`
(`src/components/Dropdown/utils/constants.ts:19-20`) silently does nothing — including the
sizing, so the icon renders at its intrinsic size.

14 such props are declared across the library (`ChevronIcon` ×3, `ClearIcon` ×5,
`SearchIcon` ×3, `CheckIcon` ×2, `ExpandIcon` ×1, `CheckboxIcon` ×1), fed by 20 JSX sites
that pass a `className` to a component-typed prop.

### 1.4 `renderTrigger` silently discards `classes.trigger` — **defect**

`src/components/Dropdown/Dropdown.tsx:610-624`: when `renderTrigger` is supplied, the
`<button>` branch — and with it `mergedClasses.trigger` and `mergedClasses.triggerText` —
is never rendered. The render-prop payload
(`src/components/Dropdown/utils/types.ts:34-46`) carries `ref`, `id`, `role` and the aria
set but **no `className`**, so there is no way for the consumer to re-apply what they
configured. Passing both `renderTrigger` and `classes.trigger` typechecks and the latter is
ignored. 5 components declare `renderTrigger`: `Dropdown/utils/types.ts:123`,
`SearchableDropdown/utils/types.ts:100`, `MultiSelectDropdown/utils/types.ts:98`,
`MultiSelectSearchableDropdown/utils/types.ts:112`,
`CascadingDropdown/utils/types.ts:136`.

### 1.5 Consumer children and render props — **inconsistency**

Any markup the consumer authors — `children`, `renderOptionContent`, `renderMobileCard`,
`renderExpandedRow`, `renderCountryOption`, and 12 other `render*` props — is created by
their runtime and never marked, so the utilities in `dist/styles.css` do not apply to it.
This *is* documented, in effect, at `llms-full.txt:57-62` ("If the target project does not
run Tailwind, arbitrary utilities you invent … will have no rule behind them"). What is
not documented anywhere in `README.md`, `llms.txt` or `llms-full.txt` is the marker
mechanism itself, which is why 1.1–1.4 read as bugs rather than as consequences.

### 1.6 Paths that are safe — **verified-safe**

- **`createPortal` subtrees**: portal children are built by the library's own JSX, so they
  are marked. Checked at `Dropdown/Dropdown.tsx:291-306`, `Modal/Modal.tsx:434`,
  `Tooltip/Tooltip.tsx:479`. A consumer-supplied `portalContainer` is only the mount point;
  the marker is required on the compound carrying the utility, not on an ancestor
  (`scripts/build-styles.mjs:44-50`).
- **Consumer `classes` values containing `cl-*`**: these are applied by the library to
  elements the library renders, so they are marked and they work. Same for `className` on
  any component root. This is the one place the public styling API behaves as advertised.
- **`dangerouslySetInnerHTML`**: only at `ChumlabComparisonSection.tsx:322` and
  `GetStartedSection.tsx:92`, neither exported from `src/index.ts` nor packaged
  (`vite.config.ts:13-22` builds entries from directories only).
- **`React.createElement` bypass**: `src/components/ui/Button.tsx:166` and
  `src/components/Reveal/Reveal.tsx:141` call `createElement` directly, which would bypass
  the shim — but both live in `EXCLUDED_COMPONENTS` (`vite.config.ts:10`) and are not
  shipped.

### 1.7 The marker has zero test coverage — **ship-blocker**

`cl-s` appears **0 times** across all 47 test files. No test asserts that a rendered
element carries the marker; no test asserts that `asChild` output lacks it. The mechanism
every shipped style depends on is unverified, which is why 1.1 can exist.

---

## 2. SSR correctness

Better than the prompt's hypothesis. There are **no** raw `useLayoutEffect` imports — every
one routes through `src/utils/useIsomorphicLayoutEffect.ts:3-4`. There is **no** `Intl.*`
usage anywhere in `src/components`, so date and month labels come from date-fns with an
explicit locale and are deterministic. 210 of 316 DOM-global accesses are inside deferred
callbacks and 27 inside handlers; the rest are guarded by early returns the AST scan could
not see.

One real crash and a cluster of hydration risks remain.

### 2.1 DatePicker portal evaluates `document` during render — **ship-blocker**

`src/components/DatePicker/DatePicker.tsx:987`:

```
{(isOpen || keepMounted) && createPortal(…, portalContainer ?? document.body)}
```

There is no `isBrowser` gate on this path — `isBrowser` appears twice in the whole file
(`:50` import, `:89` inside an effect). `keepMounted` is a public prop
(`DatePicker.tsx:542`), as are `open` / `defaultOpen`
(`DatePicker/utils/types.ts:161-162`, `:304-305`). `<DatePicker keepMounted />` or
`<DatePicker open />` rendered on a server throws `document is not defined`.

Every sibling guards this correctly, which is what makes it an outlier:
`Dropdown/Dropdown.tsx:277`, `Modal/Modal.tsx:433`, `Tooltip/Tooltip.tsx:479`,
`TimePicker/TimePicker.tsx:604`, `CascadingDropdown/CascadingDropdown.tsx:552`,
`Pagination/Pagination.tsx:171`, `Drawer/Drawer.tsx:486`,
`SearchableDropdown/SearchableDropdown.tsx:245`,
`MultiSelectDropdown/MultiSelectDropdown.tsx:147`,
`MultiSelectSearchableDropdown/MultiSelectSearchableDropdown.tsx:176`,
`Breadcrumb/Breadcrumb.tsx:237`, `Toast/components/ToastProvider.tsx:37`.

`DatePicker.tsx:220` (the marker tooltip portal) is gated on `isVisible && position &&
marker`, all of which start falsy — safe. `Table/Table.tsx:2207` is gated on
`filterDropdownState`, which starts null — safe.

### 2.2 Initial display month is timezone-dependent — **defect**

`src/components/DatePicker/useDatePicker.ts:80` returns `startOfMonth(new Date())` from the
initial-value function when no value is supplied. A server in UTC and a client in UTC−5 can
be in different months at the same instant, so the server renders one calendar grid and
hydration renders another — a mismatch across the entire `role="grid"` subtree.

### 2.3 "Today" is computed in the render path — **defect**

`src/components/DatePicker/utils.ts:94` (`isDateDisabled`, called per cell during render)
and `:308` (`getDefaultPresets`) both read `startOfDay(new Date())`. Same timezone split as
2.2, affecting which cell is marked current and which cells are disabled.

By contrast `useDatePicker.ts:331` and `:336` read `new Date()` inside `useCallback`
handlers — not render-path, not a mismatch. Refuted.

### 2.4 ClockFace reads the wall clock during render — **defect**

`src/components/TimePicker/ClockFace.tsx:86-89`:
`useMemo(() => value ?? getDefaultTimeValue(format), [value, format])`, where
`getDefaultTimeValue` (`TimePicker/utils.ts:12-14`) reads `new Date()`. Uncontrolled,
server and client render different times.

### 2.5 Three reduced-motion implementations, two hydration-unsafe — **defect**

- `src/components/Drawer/utils/helpers.ts:8-22` — `useSyncExternalStore` with an explicit
  server snapshot (`() => false`). **Correct.**
- `src/utils/useReducedMotion.ts:5-8` — `useState` initializer reading `matchMedia`. On
  hydration the client's first render can disagree with the server's `false`.
- `src/components/Toast/Toast.tsx:62-65` — a fourth-copy inline duplicate of the same
  unsafe pattern.

The correct implementation exists in the repo and two call sites do not use it.

### 2.6 Zero SSR test coverage — **ship-blocker**

`react-dom/server`, `renderToString` and `renderToStaticMarkup` appear in **0 of 47** test
files. Across 2,976 `it`/`test` blocks nothing renders a component on the server. `README.md`
does not claim SSR support explicitly, but `ai/system-state.json:867` records
"(8) SSR safety — carried PASS" as a release gate. That gate is not backed by a test, and
2.1 is what got through it.

---

## 3. Accessibility claims vs source

`README.md:294-299` claims, for **every** component: WAI-ARIA 1.2 roles and states, full
keyboard navigation, focus trapping and restoration (scoped to Modal and Drawer), aria-live
announcements, `prefers-reduced-motion` support, and 44px+ touch targets.

The focus-trap claim is honestly scoped — `getFocusableElements`
(`src/utils/focusUtils.ts:21-28`) is used only by Modal and Drawer, exactly as stated. The
rest does not hold uniformly.

### 3.1 DatePicker: `aria-modal` with no trap and no focus management at all — **ship-blocker**

`src/components/DatePicker/DatePicker.tsx:991-992` declares `role="dialog"
aria-modal="true"`. `aria-modal="true"` tells assistive technology that everything outside
the node is inert. There is no focus trap, and **`.focus()` is called zero times anywhere
under `src/components/DatePicker/`** — verified by exhaustive grep over the directory.

Consequences, all three at once: Tab leaves the calendar into the page behind it while AT
believes the page is inert; opening the calendar never moves focus into it, so the
`role="grid"` cells are unreachable by keyboard even though `onKeyDown` handlers exist
(`DatePicker.tsx:367`, `:1176`); and closing never restores focus to the trigger. This is a
WCAG 2.1 AA failure under 2.4.3 (Focus Order) and 4.1.2 (Name, Role, Value).

### 3.2 TimePicker: `aria-modal` with a divergent private trap — **defect**

`src/components/TimePicker/TimePicker.tsx:649-650` declares `role="dialog"
aria-modal="true"`. TimePicker.tsx itself has no trap. `ClockFace.tsx:385-399` implements
one inline against its own selector string,
`'button:not(:disabled), [tabindex]:not([tabindex="-1"])'` — a 2-entry selector versus the
7-entry list in `focusUtils.ts:1-8`, and with none of that helper's visibility filtering
(`focusUtils.ts:11-18`). So the dialog is trapped only while the clock face is showing, and
trapped less correctly than Modal or Drawer.

### 3.3 SearchableDropdown: the active option is never announced — **ship-blocker**

`src/components/SearchableDropdown/SearchableDropdown.tsx:240-242` moves DOM focus to the
search input when the menu opens. That input (`:275-286`) carries `aria-label`,
`aria-autocomplete="list"` and `aria-controls`, but **no `role="combobox"`, no
`aria-expanded`, and no `aria-activedescendant`**. Meanwhile `aria-activedescendant` is set
on the trigger button (`:610`), which no longer holds focus.

Under the WAI-ARIA 1.2 combobox pattern `aria-activedescendant` must be on the element with
DOM focus. It is not, so arrow-key movement through the option list produces no screen
reader announcement at all. WCAG 4.1.2 failure.

### 3.4 MultiSelectSearchableDropdown: the same, one step worse — **ship-blocker**

`MultiSelectSearchableDropdown.tsx:494` focuses the search input; the input (`:792-802`)
has `aria-label` and `aria-controls` but lacks even `aria-autocomplete`, plus no
`role="combobox"`, `aria-expanded` or `aria-activedescendant`. The trigger holds
`aria-activedescendant` at `:708`.

### 3.5 Pagination: `aria-activedescendant` on an element that never has focus — **defect**

`src/components/Pagination/Pagination.tsx:182` puts `aria-activedescendant` on the
`role="listbox"` node itself. The rows-per-page trigger (`:468-470`) has `aria-expanded`,
`aria-haspopup="listbox"` and `aria-controls` but **no `role="combobox"`**. It is the only
member of the family to place the attribute this way — compare `Dropdown.tsx:566`,
`SearchableDropdown.tsx:610`, `MultiSelectDropdown.tsx:522`, `MSSD.tsx:682`, all on the
trigger.

### 3.6 The ten dropdown-family components have not converged on one pattern — **inconsistency**

They have drifted, in the same way the positioning helpers did. Roles actually emitted:

| Component | Popup role | Item role | `role="combobox"` on trigger | `aria-activedescendant` |
|---|---|---|---|---|
| Dropdown | `listbox` | `option` | yes (`Dropdown.tsx:563`) | trigger |
| SearchableDropdown | `listbox` | `option` | yes | trigger (but focus is elsewhere — 3.3) |
| MultiSelectDropdown | `listbox` | `option` | yes | trigger |
| MultiSelectSearchableDropdown | `listbox` | `option` | yes (`:704`) | trigger (focus elsewhere — 3.4) |
| TimePicker | `listbox` + `dialog` | `option` | yes | `TimePicker.tsx:731` |
| DatePicker | `grid` + `dialog` | `gridcell` | yes | **none in directory** |
| Pagination | `listbox` | `option` | **no** | listbox (3.5) |
| CascadingDropdown | `menu` | `menuitemcheckbox` | **no** | **none in directory** |
| Breadcrumb | `menu` | `menuitem` | **no** | **none in directory** |
| InternationalPhoneInput | delegates to SearchableDropdown | — | — | inherits 3.3 |

`CascadingDropdown` uses menu semantics for a value-selection control while five siblings
use listbox semantics for the same interaction. `Breadcrumb` uses menu semantics for
navigation links; it does at least implement roving focus by hand
(`Breadcrumb.tsx:475-495`) and restore focus to the ellipsis button (`:412`, `:495`).

### 3.7 `prefers-reduced-motion` is claimed universally and implemented in 18 of 30 — **defect**

`README.md:298` says every component ships with it. These 12 shipped components carry
`transition-*` / `animate-*` / `duration-*` classes and have no reduced-motion path
anywhere in their directory: **Breadcrumb, CascadingDropdown, Dropdown, Input,
InternationalPhoneInput, MultiSelectDropdown, MultiSelectSearchableDropdown, OtpInput,
SearchableDropdown, Slider, Table, TextArea.**

### 3.8 Touch dismissal missing in three components — **defect**

Eight components register both `mousedown` and `touchstart` for click-outside. Three
register `mousedown` only, so a tap outside does not close them on touch devices:
`CascadingDropdown.tsx:456`, `Pagination.tsx:327`, `Table.tsx:361`. In all three the
handler is even typed `(event: MouseEvent | TouchEvent)`, so the omission is an oversight
rather than a decision.

### 3.9 Three focus-trap implementations — **inconsistency**

Cross-cutting consequence of 3.1 and 3.2: the shared helper at `src/utils/focusUtils.ts:1-28`
used by Modal (`Modal.tsx:188-202`) and Drawer; an inline 2-entry-selector variant at
`ClockFace.tsx:385-399`; and none at all in DatePicker despite its dialog role. The
Tab-cycling logic itself is also duplicated between Modal and Drawer rather than living in
the helper.

---

## 4. API surface consistency

### 4.1 Portal z-index prop naming splits two ways — **inconsistency**

`dropdownZIndex` on 10 components: `Dropdown/utils/types.ts:116`,
`Pagination:71`, `TimePicker:252`, `MultiSelectSearchableDropdown:104`, `DatePicker:239`,
`SearchableDropdown:91`, `InternationalPhoneInput:158`, `MultiSelectDropdown:89`,
`Breadcrumb:78`, `CascadingDropdown:129`.
`zIndex` on 4: `Tooltip/utils/types.ts:51`, `Drawer:28`, `Toast:72`, `Modal:103`.

(Naming only. The layering-scale question is out of scope here.)

### 4.2 The root barrel exports 2 of 30 class-constant pairs — **inconsistency**

All 30 component `index.ts` files export their `DEFAULT_*_CLASSES` and
`UNSTYLED_*_CLASSES` at full parity. `src/index.ts` re-exports only **`SLIDER`** and
**`TABLE`**. So `import { DEFAULT_DROPDOWN_CLASSES } from "@chumlab/ui"` fails while
`from "@chumlab/ui/dropdown"` succeeds, with nothing in the docs marking the difference.

### 4.3 Accordion hand-rolls controlled/uncontrolled state — **inconsistency**

21 components use `src/utils/useControllableState.ts`. Accordion instead implements its own
in `src/components/Accordion/hooks/useAccordionStateManager.ts:70-98`, despite exposing the
same `value` / `defaultValue` / `onValueChange` contract
(`Accordion/utils/types.ts:121-125`, `:141-145`, `:247-249`). Two implementations of the
same contract with no shared tests.

### 4.4 Three components accept no HTML passthrough — **defect**

`Dropdown`, `Modal` and `Table` declare closed prop interfaces: no
`extends HTMLAttributes<…>`, no `...rest` spread onto the root. Verified —
`Dropdown/utils/types.ts` and `Dropdown.tsx` contain zero matches for either pattern, and
`Dropdown.tsx:363-386` destructures every prop explicitly with no rest element.

Ten others do extend HTML attributes: `CountryFlag/utils/types.ts:36,58,70,77,85`,
`Drawer:20,58,62,66,71`, `TimePicker:170`, `Pagination:48`, plus Checkbox, Switch, Button,
Slider, Input, Toast.

Practical effect: `data-testid`, `id` and undeclared `aria-*` attributes silently vanish on
Dropdown, Modal and Table. `"aria-label"` is declared explicitly on only 11 of 30
components, so on the other 19 it depends entirely on whether that component happens to
extend HTML attributes.

### 4.5 `classes` slot keys use five names for the same slot — **inconsistency**

The popup surface: `content` (10 components), `panel` (Drawer, TabPanel), `dropdown`
(Breadcrumb, TimePicker), `dropdownMenu` (DatePicker), `menu` (CascadingDropdown).
The selectable row: `option` (6), `item` (4), `menuItem` (CascadingDropdown).
The disclosure chevron: `chevron` (5) vs `dropdownIcon` (Pagination).
The outer wrappers: `root` (27), `wrapper` (11), `container` (Modal, Table, Toast) with no
stated rule for when a component gets two.

### 4.6 One default class string lives outside its constants file — **inconsistency**

`MultiSelectSearchableDropdown.tsx:802` hardcodes
`cn("flex-1 bg-transparent outline-none", mergedClasses.searchInputElement)`. Those three
utilities are not in `DEFAULT_MULTI_SELECT_SEARCHABLE_DROPDOWN_CLASSES`, are not removed by
`unstyled`, and cannot be overridden through `classes`. Every other default in the library
is declared in a `constants.ts`.

### 4.7 Claims that hold — **verified-safe**

- **Ref forwarding is complete, including Table.** `llms-full.txt:35-36` claims every
  component forwards a ref; `Table/Table.tsx:2309-2310` does so via
  `forwardRef(TableInner)` with a generic-preserving cast. The prompt's suspicion is wrong.
- **`onValueChange` is consistent.** All 20 value-bearing components use the name, and the
  shape is uniformly `(primitiveValue, richValue?) => void` — e.g.
  `Dropdown/utils/types.ts:78`, `MultiSelectDropdown:49`, `DatePicker:261`,
  `CascadingDropdown:88`. Accordion's two signatures (`:125`, `:145`) are a discriminated
  union on `type`, which is correct rather than inconsistent.

---

## 5. Lifecycle

### 5.1 Six `requestAnimationFrame` schedules with no cleanup — **defect**

Of 166 acquisitions of a listener, timer, observer or frame, 143 have matching cleanup.
The uncovered set is one pattern repeated across the dropdown family:

| Site | Captures the id? |
|---|---|
| `Dropdown/Dropdown.tsx:165-171` | yes (`rafIdRef`) |
| `MultiSelectDropdown/MultiSelectDropdown.tsx:68-73` | yes |
| `MultiSelectSearchableDropdown.tsx:97-102` | yes |
| `SearchableDropdown/SearchableDropdown.tsx:128-135` | yes |
| `Pagination/Pagination.tsx:139-141` | **no** |
| `Breadcrumb/Breadcrumb.tsx:200-202` | **no** |

In all six the effect returns no cleanup, so a frame scheduled just before unmount still
runs. In the four that capture the id, the sibling resize effect cancels it — but only
while `isOpen` is true, so a frame outstanding when `isOpen` flips false is never cancelled.
Pagination and Breadcrumb hold no handle at all, so their frame is unconditionally
uncancellable and re-scheduled on every `updatePosition` identity change.

React 18 makes the resulting `setState` a no-op rather than a warning, which is why this
has stayed invisible.

### 5.2 No focus-based dismissal anywhere — **defect**

Every click-outside handler in the library listens on `mousedown` (and mostly `touchstart`
— see 3.8). None registers `focusin` or `focusout`. Tabbing out of an open dropdown,
calendar or menu leaves it open and rendered over the newly focused control.

### 5.3 Table hardcodes the dropdown family's private attribute — **inconsistency**

`Table/Table.tsx:357-359` and `:371-372` special-case
`closest("[data-table-filter-content], [data-dropdown-id]")` so that a dropdown portalled
from inside a Table filter does not dismiss the filter. It works, but it couples Table to a
data attribute the dropdowns own and never publish; a rename in either place breaks the
other silently.

### 5.4 Portal-boundary and timer handling that is correct — **verified-safe**

- Click-outside survives portal boundaries by design: each dropdown stamps
  `data-dropdown-id` on its portalled content and the handler walks `closest()` for it —
  `Dropdown.tsx:511-517`, `SearchableDropdown.tsx:483-491`, `Breadcrumb.tsx:376-388` (its
  own `data-breadcrumb-dropdown-id`). Consistent across the family.
- Tooltip's three timers are cleared on unmount (`Tooltip.tsx:247-252`, `:321-324`) — the
  AST scan flagged them, inspection clears them.
- ToastProvider tracks every timeout in a `Set` and clears all on unmount
  (`ToastProvider.tsx:35`, `:177-180`).
- Focus restoration works where it is claimed: Modal (`Modal.tsx:227-241`, guarded by
  `restoreFocus`), Drawer, Breadcrumb (`:412`, `:495`). DatePicker is the exception — 3.1.

---

## 6. Test honesty

2,976 `it`/`test` blocks across 47 unit test files, plus 539 Playwright tests across 20
e2e specs.

### 6.1 Three tests specify the bug as the requirement — **ship-blocker**

This is the answer to "3000 tests and the bug shipped": for the structural-class behaviour
it is not a coverage gap. It is asserted as correct.

`src/components/Modal/__tests__/Modal.test.tsx:618-626` —
titled *"does not apply fixed positioning classes to root when unstyled=true"*, asserting
`expect(root.className).not.toContain("fixed inset-0")`. The companion at `:606-616`
asserts the same for the dialog node.

Two more of the same shape:
`src/components/TimePicker/__tests__/TimePicker.test.tsx:423` —
`expect(root?.className).not.toContain("inline-flex")`.
`src/components/InternationalPhoneInput/__tests__/InternationalPhoneInput.test.tsx:457` —
`expect(root?.className).not.toContain("flex-col")`.

Any change to the `unstyled` semantics fails all three. They are a hard dependency of that
work, not incidental fallout.

### 6.2 Coverage counts for the behaviours named in the prompt — **defect**

| Behaviour | Files | Hits | Verdict |
|---|---|---|---|
| SSR render (`react-dom/server`) | **0** / 47 | **0** | no coverage — enabled §2.1 |
| `cl-s` marker | **0** / 47 | **0** | no coverage — enabled §1.1 |
| `unstyled` rendering | 8 component files + Toast `context.test.tsx` | 22 | 22 of 30 components untested |
| `classes` override precedence | 18 | 82 | **covered** — the prompt's hypothesis is wrong |
| portal layering (`createPortal` / `portalContainer`) | 4 | 6 | thin |
| `zIndex` | 4 | 9 | thin |
| async dropdown (`onSearch`) | 5 | 54 | covered |
| async dropdown (`onLoadInitialOptions`) | 2 | 35 | covered |
| `renderTrigger` | 5 | 35 | covered (behaviour, not §1.4's class discard) |
| `asChild` | 4 | 29 | covered (behaviour, not §1.1's marker loss) |
| `keepMounted` | 6 | 43 | covered |
| `prefers-reduced-motion` | 1 | 1 | effectively none |

The `unstyled` files are Modal, Drawer, DatePicker, TimePicker, Table, Tooltip, Breadcrumb,
InternationalPhoneInput, and Toast's `context.test.tsx`.

Note the shape of the two zero rows: both are cross-cutting mechanisms rather than
per-component behaviour, and the suite is organised strictly per component. There is no
place in the current layout where a test of "the marker" or "server rendering" would live.

### 6.3 The e2e suite has no pixel coverage, and one block implies otherwise — **ship-blocker**

Zero `toHaveScreenshot` or `toMatchSnapshot` calls exist anywhere in `e2e/`. The block named
`test.describe("Visual Regression", …)` at `e2e/accordion.spec.ts:534-547` asserts only
that a bounding box is non-null with width and height greater than zero.
`e2e/accordion.spec.ts-snapshots/` still holds three baseline PNGs
(`accordion-component-{chromium,firefox,Mobile-Chrome}-darwin.png`) that no assertion
references.

So the failure category that actually reached production — styling — has no automated
visual check at all, while the suite carries a directory and a describe-block that read as
if it does.

11 of 30 components have no e2e spec: **Breadcrumb, CascadingDropdown, DatePicker,
InternationalPhoneInput, Loader, Modal, MultiSelectSearchableDropdown, RadioButton, Slider,
Table, TimePicker.** DatePicker — the component carrying §2.1 and §3.1 — is among them.

---

## 7. Bundle reality

Ceilings are stated at `ai/run.md:157-162`: leaf target ≤5 kb / hard fail >10 kb;
date-calendar and locale-aware target ≤10 kb / hard fail >12 kb; composite-form target
≤8 kb / hard fail >12 kb. `CHANGELOG.md:17` records the class-specific policy with a
"ratchet-upward-only" rule.

### 7.1 The gate measures one chunk; consumers import a closure — **defect**

`ai/system-state.json:183` records the DatePicker measurement as
*"dist/shared/DatePicker-D7SQLxwx.cjs 35.04 KB / gzip: 10.25 KB"* — a **single chunk**. But
`import { DatePicker } from "@chumlab/ui/date-picker"` pulls `dist/components/DatePicker/index.js`
and everything it transitively imports. Measured both ways on the current build, the gap is
1.15× to 2.8×:

| Component | Primary chunk (gzip) | Import closure (gzip) |
|---|---|---|
| DatePicker | 12.63 kb | 14.48 kb |
| InternationalPhoneInput | 10.31 kb | 29.23 kb |

The recorded number is not what a consumer pays.

### 7.2 The DatePicker chunk alone now exceeds its hard fail — **ship-blocker**

`dist/shared/DatePicker-BNO0mm_X.js` is **12.63 kb gzipped** on the current build, against
the 12 kb hard fail at `ai/run.md:159`. The recorded value is 10.25 kb from 2026-04-28
(`ai/system-state.json:183`, still classified HIGH rather than BLOCKER on the strength of
that number). The ratchet has not been re-run since, so the release gate is green against a
stale measurement of a chunk that has since crossed its own hard limit.

### 7.3 Import-closure sizes, all 30 subpaths

Gzipped, entry plus all transitively imported chunks, excluding the lazily-imported
`dist/flags/*` country data.

| Component | Class | gzip (kb) | Target | Verdict |
|---|---|---|---|---|
| InternationalPhoneInput | locale | 29.23 | 10 | hard fail |
| Table | leaf | 16.57 | 5 | hard fail |
| DatePicker | date | 14.48 | 10 | hard fail |
| Avatar | leaf | 13.11 | 5 | hard fail |
| TimePicker | date | 12.39 | 10 | hard fail |
| Stepper | leaf | 12.24 | 5 | hard fail |
| CountryFlag | leaf | 12.05 | 5 | hard fail |
| Accordion | leaf | 11.16 | 5 | over target |
| Breadcrumb | leaf | 10.89 | 5 | over target |
| CascadingDropdown | composite | 10.86 | 8 | over target |
| Button | leaf | 10.03 | 5 | over target |
| SearchableDropdown | composite | 9.92 | 8 | over target |
| MultiSelectSearchableDropdown | composite | 9.84 | 8 | over target |
| TabPanel | leaf | 9.68 | 5 | over target |
| MultiSelectDropdown | composite | 9.22 | 8 | over target |
| Dropdown | leaf | 9.08 | 5 | over target |
| Drawer | leaf | 6.89 | 5 | over target |
| Pagination | leaf | 6.84 | 5 | over target |
| TextArea | leaf | 6.51 | 5 | over target |
| Input | leaf | 6.46 | 5 | over target |
| Slider | leaf | 6.23 | 5 | over target |
| Tooltip | leaf | 5.98 | 5 | over target |
| Modal | leaf | 5.61 | 5 | over target |
| Toast | leaf | 5.48 | 5 | over target |
| OtpInput | leaf | 4.47 | 5 | ok |
| RadioButton | leaf | 4.41 | 5 | ok |
| Switch | leaf | 4.29 | 5 | ok |
| Checkbox | leaf | 4.27 | 5 | ok |
| Loader | leaf | 4.11 | 5 | ok |
| ResizablePanel | leaf | 4.07 | 5 | ok |

**24 of 30 over target, 7 over the 12 kb hard fail.** Six pass.

Some of this is honest composition rather than bloat. InternationalPhoneInput's 29 kb
decomposes as its own chunk 10.31 + SearchableDropdown 7.73 + Tooltip 4.30 + CountryFlag
4.11 + ~2.8 in small shared utilities — 16.1 kb of it is other components it legitimately
reuses. The `locale-aware ≤10 kb` classification cannot be met by a component that composes
three others; the ceiling needs to be per-class *and* closure-aware, or IPI needs its own
recorded waiver.

### 7.4 Positioning code duplicated across nine chunks — **inconsistency**

Nine built chunks each carry an independent copy of the viewport-reading coordinate
function. Seven read `visualViewport`:

`shared/DatePicker-BNO0mm_X.js`, `shared/Dropdown-C9yvVAdr.js`,
`shared/MultiSelectSearchableDropdown-Chw4kiL5.js`, `shared/MultiSelectDropdown-C_so0CFs.js`,
`shared/SearchableDropdown-CarZqjuU.js`, `shared/Tooltip-L8No0na_.js`,
`shared/TimePicker-bokqfAPe.js`.

Two more carry an `innerHeight`-only variant: `shared/Breadcrumb-C6lwS3F9.js`,
`shared/Pagination-aFfNHjHv.js`.

Per copy, minified: **645 raw bytes**, ~359 bytes gzipped in isolation — so roughly 5.8 kb
raw / ~3 kb gzipped duplicated across the package. That is a modest number and it is
reported here only because §7 asked for it; the reason to consolidate is drift, which is
out of scope for this pass.

---

## Summary

| Severity | Count | IDs |
|---|---|---|
| ship-blocker | 11 | 1.1, 1.2, 1.7, 2.1, 2.6, 3.1, 3.3, 3.4, 6.1, 6.3, 7.2 |
| defect | 16 | 1.3, 1.4, 2.2, 2.3, 2.4, 2.5, 3.2, 3.5, 3.7, 3.8, 4.4, 5.1, 5.2, 6.2, 7.1, 7.3 |
| inconsistency | 10 | 1.5, 3.6, 3.9, 4.1, 4.2, 4.3, 4.5, 4.6, 5.3, 7.4 |
| verified-safe | 3 | 1.6, 4.7, 5.4, plus refuted hypotheses noted inline |

37 actionable findings, carried into `remediation-plan.json` with the same IDs.

Five of the prompt's hypotheses were checked and do not hold: raw `useLayoutEffect` (none
exists), locale-driven hydration mismatch (no `Intl` usage), Table ref forwarding (present),
`classes`-override coverage (82 assertions across 18 files), and Tooltip/Toast timer leaks
(both clean).

The single highest-leverage item is §1.7 together with §6.2's two zero rows. The marker and
server rendering are the two mechanisms every shipped component depends on and neither has
a single test, because the suite is organised per component and has nowhere to put a
cross-cutting one. §1.1 and §2.1 are what got through that gap.
