# Demo and fixture coverage of the public API

Branch `refactor/v1-hardening`. Report only — nothing in this slice was changed.

## How the numbers were derived

One `ts.createProgram` over all 30 `src/components/<name>/index.ts` roots, and every
list below comes from `checker.getPropertiesOfType`. Nothing here is grepped: the
regex scanner that desynchronised on a comment apostrophe earlier on this branch is
exactly the failure this audit would otherwise repeat, and it would have repeated it —
`OtpInput/utils/types.ts:64` contains the string `` `groupPattern` `` inside a comment
that exists to say the prop is *not* called that.

Four decisions shape every count, and each was made because the naive version was wrong:

- **The prop set is what each exported component accepts**, resolved through
  `forwardRef<_, XProps>` rather than by reading every exported `*Props` type. The
  naive version audits `DropdownTriggerRenderProps` and reports `isOpen`,
  `role: "combobox"` and `aria-expanded` as undemonstrated props, when they are the
  payload handed *to* `renderTrigger` and cannot be passed at all.
- **Inherited DOM props are separated from library-authored ones.** `className`,
  `placeholder` and `disabled` arrive from `HTMLAttributes`; counting them as missing
  from the type turns every real doc example into a phantom.
- **`.ai.md` is read by section.** The Styling Guide's slot table has the same row
  shape as All Props, so reading the whole file reports every `classes` key — `root`,
  `arrow`, `message` — as a prop. Only `## All Props` and `## Prop Constraints` are
  read as prop claims, and only when the row's whole first cell is the name: the row
  `` | `href` on items | `` documents a `BreadcrumbItem` field and says so.
- **A prop the contract tier drives itself counts as covered.** `registry.tsx`
  applies `unstyled`, `classes`, `open`, `keepMounted` and `asChild` over every
  fixture, so no fixture declares them and none needs to. Treating a fixture's
  `props: {}` keys as the whole truth reports `unstyled` as uncovered on all 30
  components, when `unstyled.contract` is one of the strongest gates in the repo.
- **Demo usage is matched on the exported tag**, not the folder name. Loader ships
  four siblings and no `<Loader>`; Toast's surface is driven through
  `useToast().show({...})`, so its config-object keys are counted alongside JSX
  attributes and marked as the weaker signal they are.

| | count |
| --- | --- |
| Props across the public surface | 1135 |
| With no demo | 219 (19%) |
| With no fixture | 751 (66%) |
| Phantom claims (documented, absent from the type) | 14 |

Severity tiers, assigned from the declared type rather than by hand. Literal members
are counted through the checker, not off the printed type, so `dropdownPosition`
tiers the same whether it prints as `"top" | "bottom"` or as the alias
`DropdownPosition`. Every prop name tiers identically on every component that
declares it — that is asserted, not assumed.

| Tier | Meaning | Test |
| --- | --- | --- |
| **A** | a whole mode | a bare boolean-literal type (`loadOnOpen: true`, the async discriminant), a `Promise`-returning callback, a union of two or more literal members, or a name in the mode vocabulary (`unstyled`, `asChild`, `variant`, `keepMounted`, `lockScroll`, `trapFocus`, `restoreFocus`, `showOverlay`, `reduceMotion`, `portalContainer`, …) |
| **B** | behaviour | `on*` / `render*` handlers, controlled-vs-uncontrolled state, and `classes` |
| **C** | content | labels, icons, text, sizes, counts |
| **D** | passthrough | `className`, `style`, `id`, `name`, `aria-*`, `data-*` |

`unstyled` is tier A deliberately: ADR 001 makes it a whole rendering mode, not a
styling convenience. It is nonetheless well covered — see *What looks like a gap and
is not* below.

---

## Summary, ranked by severity

### 1. The async dropdown mode is proven at compile time and rendered by nothing

`prop-unions.type-test.tsx` makes the invalid async combination fail to typecheck,
and `npm run typecheck` enforces it. What no test does is render the valid branch —
**no fixture on any of the five dropdowns selects the async mode**:

| Component | Discriminant | Loader callback | Type test | Fixture |
| --- | --- | --- | --- | --- |
| `Dropdown` | `loadOnOpen` | `onLoadOptions` | yes | **none** |
| `SearchableDropdown` | `loadInitialOnOpen` | `onLoadInitialOptions` | yes | **none** |
| `MultiSelectDropdown` | `loadOnOpen` | `onLoadOptions` | yes | **none** |
| `MultiSelectSearchableDropdown` | `loadInitialOnOpen` | `onLoadInitialOptions` | yes | **none** |
| `CascadingDropdown` | `—` | `onLoadChildren` | **no** | **none** |

`CascadingDropdown` is the sharp end: it appears nowhere in the type test and has no
fixture, so its entire lazy-submenu mode — `onLoadChildren`, `onMenuSearch`,
`onSubmenuSearch`, three `Promise`-returning callbacks — is unverified at both
levels. The other four are at least union-checked.

This is the load-bearing gap for the composition phase. Ten components move onto
shared machinery next; the async branch is the behaviour that machinery could drop
with nothing failing.

### 2. `reduceMotion` has no fixture on any component

`reduceMotion?: boolean | "auto"` exists on 16 components — `Accordion`, `Avatar`, `Button`, `Checkbox`, `CountryFlag`, `DatePicker`, `Drawer`, `Loader`, `Modal`, `Pagination`, `RadioButton`, `ResizablePanel`, `Stepper`, `Switch`, `TabPanel`, `TimePicker`.
It has no demo on 8 and no fixture on 16.

`reduced-motion.contract` does exist, but it drives the **media query** through
`setReducedMotion()`; it never sets the prop. So the `"auto"` value — the branch
that reads the OS setting, and the default — is exercised, while explicit
`reduceMotion={true}` and `reduceMotion={false}` are exercised nowhere. Unlike
`unstyled`, this prop is not in `registry.tsx`'s `supports` map, so no contract
picks it up generically.

### 3. Fourteen documented props do not exist

The generated `All Props` tables and the `schema.json` files are almost entirely
faithful to the types. The defects are concentrated in hand-written prose — the
`.ai.md` examples and the `Prop Constraints` tables — and they are one mistake made
repeatedly: **a `classes` slot key presented as a top-level prop.**

**In `.ai.md` example code** — these snippets do not compile:

| Component | Claimed | Actually is | The example passes |
| --- | --- | --- | --- |
| `Input` | `message` | `InputClasses` slot | `message={!isValid}` **and** `message={isValid}` on the same element |
| `TextArea` | `message` | `TextAreaClasses` slot | `message={!isValid}` **and** `message={isValid}` on the same element |
| `Checkbox` | `message` | `CheckboxClasses` slot | `message={!!errors.terms}` |
| `Dropdown` | `message` | `DropdownClasses` slot | `message={!value}` |
| `CascadingDropdown` | `message` | `CascadingDropdownClasses` slot | `message={!!errors.category}` |
| `DatePicker` | `message` | `DatePickerClasses` slot | `message={!date}` |
| `InternationalPhoneInput` | `message` | `InternationalPhoneInputClasses` slot | `message={phone ? !phone.isValid : false}` |
| `DatePicker` | `presetGroup` | `DatePickerClasses` slot | `presetGroup={presetGroup}` — the real prop is `presets` |
| `Button` | `icon` | `ButtonClasses` slot | `icon={<PlusIcon />}` — a ReactNode into a className slot |
| `Table` | `selectable` | **nothing** — absent from the codebase entirely | `selectable` alongside `onSelectionChange`, which is real |

`INPUT.ai.md` and `TEXTAREA.ai.md` share the worst of them, an identical "With
validation" block that sets `message` **twice on one element** — a duplicate JSX
attribute as well as a nonexistent prop. The intended props are plainly `error` and
`success`; `InputProps.error`'s own doc comment reads *"Error state boolean. Pass
message via `errorMessage`."*

**In `Prop Constraints` tables** — documented as props, in a table of props:

| Component | Claimed | Actually is |
| --- | --- | --- |
| `Toast` | `root` | a `ToastClasses` slot typed `root?: string`. The row describes it as *"ReactNode that replaces the default message/description layout entirely"* — a capability that does not exist in any form. |
| `DatePicker` | `presetGroup` | a `DatePickerClasses` slot. The real prop is `presets`. |
| `CascadingDropdown` | `subSearchControl` | a `CascadingDropdownClasses` slot. |
| `CascadingDropdown` | `selectionMode` | a field of the `CascadingOption` data object, not a prop of the component. |

These files are the library's AI-facing contract, and `Prop Constraints` is the
section most likely to be trusted verbatim. A generation that follows `INPUT.ai.md`
or `TABLE.ai.md` produces code that fails the verify gate.

The three phantoms named in the brief — OtpInput's `type`, `groupPattern` and
`masked` — are **gone**. None appears in the type, the schema, the `.ai.md` tables or
its examples. `OtpInput/utils/types.ts:64` now carries a comment saying the prop is
*not* called `groupPattern`, which is the apostrophe-adjacent trap that a string
scanner would have reported as a live claim.

**Found by inspection, not by the scan** — two doc defects the name-matching cannot
see because both names resolve to something real:

- `PAGINATION.ai.md` lists `` | `navIcon` / `navIcon` / `rowsPerPage.icon` | `` — the
  same slot named twice. Two distinct icon slots were clearly meant. The line repeats
  verbatim in the slot table further down, so it was copied rather than mistyped.
- `BREADCRUMB.ai.md`'s `` `href` on items `` and `CASCADINGDROPDOWN.ai.md`'s
  `selectionMode` both document fields of *data objects* (`BreadcrumbItem`,
  `CascadingOption`) inside prop tables. Breadcrumb qualifies the name in the cell;
  CascadingDropdown does not, which is why only the latter reads as a phantom.

### 4. Sub-components are documented nowhere

`schema.json` and `.ai.md` describe the root component only. Every exported
sub-component's props are absent from both — they are demonstrated in the demo pages
and then documented by nothing:

| Component | Undocumented prop types | Props |
| --- | --- | --- |
| `Avatar` | `AvatarBadgeProps`, `AvatarGroupProps`, `AvatarGroupCountProps`, `AvatarShimmerProps`, `AvatarGroupShimmerProps` | 23 |
| `Accordion` | `AccordionContentProps`, `AccordionItemProps`, `AccordionShimmerProps`, `AccordionTriggerProps` | 18 |
| `CountryFlag` | `CountryFlagGroupProps`, `CountryFlagGroupCountProps`, `CountryFlagShimmerProps`, `CountryFlagGroupShimmerProps` | 5 |
| `Button` | `ButtonGroupProps` | 3 |
| `TimePicker` | `ClockFaceProps` | 2 |

This is the same defect as a phantom, facing the other way: the type is real and the
documentation does not know it exists.

### 5. Fixture coverage is thin in absolute terms

751 of 1135 props (66%) have no fixture, including 69 tier-A modes,
after crediting the five props the contract tier drives itself. Demo coverage is much
better — 219 missing (19%) — so the library is largely *discoverable*
and largely *unverified*. Since the contract tier is glob-collected from the
fixtures, that is the ratio that matters for the composition work.

### What looks like a gap and is not

`unstyled` is declared on all 30 components and set by **no fixture at all**, which
reads as the worst gap in the library until you look at how it is tested.
`unstyled.contract` iterates the fixtures and applies the prop to each one, deriving
expectations from every component's own `DEFAULT_*_CLASSES` via the ADR 001
classifier. The same holds for `classes`, `open`, `keepMounted` and `asChild`.

These five are excluded from the no-fixture counts above. They are recorded per
component below as *contract-driven* rather than silently dropped, because the
distinction is exactly the kind that rots: if a component is ever removed from
`registry.tsx`'s roster, its `unstyled` coverage disappears with no fixture to
notice.

---

## Dropdown family: fixture gaps

Called out separately, as requested. The family is `Dropdown`,
`SearchableDropdown`, `MultiSelectDropdown`, `MultiSelectSearchableDropdown` and
`CascadingDropdown` — the five that share the portal/trigger machinery the next
slices consolidate.

| Component | Props | No fixture | Tier A with no fixture |
| --- | --- | --- | --- |
| `Dropdown` | 50 | 34 | **5** |
| `SearchableDropdown` | 57 | 38 | **5** |
| `MultiSelectDropdown` | 49 | 31 | **5** |
| `MultiSelectSearchableDropdown` | 54 | 33 | **5** |
| `CascadingDropdown` | 58 | 40 | **5** |

### Gaps shared across the family

These are the ones the shared machinery will own. A prop missing a fixture on every
member is a capability no contract can see before or after the move:

| Prop | Tier | Missing a fixture on | Type (as declared on the first member listed) |
| --- | --- | --- | --- |
| `lockScroll` | A | **all 5** | `boolean \| undefined` |
| `onBlur` | B | **all 5** | `(() => void) \| undefined` |
| `onFocus` | B | **all 5** | `(() => void) \| undefined` |
| `onKeyDown` | B | **all 5** | `((event: KeyboardEvent<Element>) => void) \| undefined` |
| `onLoadError` | B | **all 5** | `((error: unknown) => void) \| undefined` |
| `onOpenChange` | B | **all 5** | `((open: boolean) => void) \| undefined` |
| `onValueChange` | B | **all 5** | `((value: string \| null, option: DropdownOption \| null) => void) \| unde` |
| `portalContainer` | A | **all 5** | `HTMLElement \| null \| undefined` |
| `renderTrigger` | B | **all 5** | `((props: DropdownTriggerRenderProps) => ReactNode) \| undefined` |
| `required` | B | **all 5** | `boolean \| undefined` |
| `value` | B | **all 5** | `string \| null \| undefined` |
| `forceDropdownPosition` | A | 4/5 (Dropdown, SearchableDropdown, MultiSelectDropdown, MultiSelectSearchableDropdown) | `boolean \| undefined` |
| `loadInitialOnOpen` | A | 2/5 (SearchableDropdown, MultiSelectSearchableDropdown) | `true` |
| `loadOnOpen` | A | 2/5 (Dropdown, MultiSelectDropdown) | `true` |
| `onLoadInitialOptions` | A | 2/5 (SearchableDropdown, MultiSelectSearchableDropdown) | `() => Promise<DropdownOption[]>` |
| `onLoadOptions` | A | 2/5 (Dropdown, MultiSelectDropdown) | `() => Promise<DropdownOption[]>` |

### Family gaps unique to one member

| Component | Prop | Tier | Type |
| --- | --- | --- | --- |
| `CascadingDropdown` | `onLoadChildren` | A | `((parent: CascadingOption) => Promise<CascadingOption[]>) \| undefined` |
| `CascadingDropdown` | `onMenuSearch` | A | `((query: string) => Promise<CascadingOption[]>) \| undefined` |
| `CascadingDropdown` | `onSubmenuSearch` | A | `((query: string, parent: CascadingOption) => Promise<CascadingOption[]` |

`CascadingDropdown`'s three async callbacks — `onLoadChildren`, `onMenuSearch`,
`onSubmenuSearch` — are the largest single-component gap in the family: the whole
lazy-submenu mode, with no fixture behind any of it.

---

## Per component

### Accordion

52 props across `AccordionProps`, `AccordionContentProps`, `AccordionItemProps`, `AccordionShimmerProps`, `AccordionTriggerProps`, `IconProps`. No demo: 14. No fixture: 42.

Contract-driven (no fixture declares these; `registry.tsx` applies them): `asChild`, `classes`, `unstyled`.

**No demo** (14):

- *A — mode*:
  - `asChild` (AccordionProps, AccordionContentProps, AccordionItemProps, AccordionShimmerProps, AccordionTriggerProps) — `boolean | undefined`
  - `loop` — `boolean | undefined`
  - `orientation` — `Orientation | undefined`
  - `unstyled` (AccordionProps, AccordionShimmerProps) — `boolean | undefined`
  - `variant` (AccordionProps, AccordionShimmerProps) — `AccordionVariant | undefined`
- *B — behaviour*:
  - `onBlurCapture` — `((event: FocusEvent<HTMLDivElement, Element>) => void) | undefined`
  - `onFocusCapture` — `((event: FocusEvent<HTMLDivElement, Element>) => void) | undefined`
  - `onKeyDown` — `((event: KeyboardEvent<HTMLDivElement>, itemValue: string | null) => v`
- *C — content*: `children`, `preventCloseTimeout`
- *D — passthrough*: `aria-busy`, `aria-describedby`, `aria-live`, `style`

**No fixture** (42):

- *A — mode*:
  - `loop` — `boolean | undefined`
  - `orientation` — `Orientation | undefined`
  - `preventClose` — `((value: string) => boolean | Promise<boolean>) | undefined`
  - `reduceMotion` (AccordionProps, AccordionShimmerProps) — `boolean | "auto" | undefined`
- *B — behaviour*:
  - `onBlurCapture` — `((event: FocusEvent<HTMLDivElement, Element>) => void) | undefined`
  - `onCloseEnd` (AccordionContentProps) — `(() => void) | undefined`
  - `onCloseStart` (AccordionContentProps) — `(() => void) | undefined`
  - `onExpandedChange` (AccordionProps, AccordionItemProps) — `((event: AccordionExpandEvent) => void) | undefined`
  - `onFocusCapture` — `((event: FocusEvent<HTMLDivElement, Element>) => void) | undefined`
  - `onKeyDown` — `((event: KeyboardEvent<HTMLDivElement>, itemValue: string | null) => v`
  - `onOpenEnd` (AccordionContentProps) — `(() => void) | undefined`
  - `onOpenStart` (AccordionContentProps) — `(() => void) | undefined`
  - `onValueChange` — `((value: string[]) => void) | undefined`
  - `value` (AccordionProps, AccordionItemProps) — `string[] | undefined`
- *C — content*: `animate`, `animationDuration`, `animationEasing`, `announceExpanded`, `collapsedIcon`, `count`, `defaultExpandAll`, `dir`, `expandOnPrint`, `expandedIcon`, `forceMount`, `iconAnimation`, `iconPosition`, `lazyLoad`, `leftSlot`, `maxExpanded`, `preventCloseTimeout`, `rightSlot`, `showContent`, `size`, `storageKey`, `subtitle`, `unmountOnClose`
- *D — passthrough*: `aria-busy`, `aria-describedby`, `aria-live`, `className`, `style`

**Demonstrated but undocumented** — in the type and in a demo, absent from both
`schema.json` and the `.ai.md` All Props table:

`animate`, `className`, `collapsedIcon`, `count`, `expandedIcon`, `forceMount`, `iconAnimation`, `iconPosition`, `lazyLoad`, `leftSlot`, `onCloseEnd`, `onCloseStart`, `onOpenEnd`, `onOpenStart`, `rightSlot`, `showContent`, `subtitle`, `unmountOnClose`

### Avatar

47 props across `AvatarProps`, `AvatarBadgeProps`, `AvatarGroupProps`, `AvatarGroupCountProps`, `AvatarShimmerProps`, `AvatarGroupShimmerProps`. No demo: 5. No fixture: 38.

Contract-driven (no fixture declares these; `registry.tsx` applies them): `asChild`, `classes`, `unstyled`.

**No demo** (5):

- *A — mode*:
  - `asChild` (AvatarProps, AvatarBadgeProps, AvatarGroupProps, AvatarGroupCountProps, AvatarGroupShimmerProps) — `boolean | undefined`
- *B — behaviour*:
  - `onLoad` — `(() => void) | undefined`
- *C — content*: `children`, `textClassName`
- *D — passthrough*: `aria-live`

**No fixture** (38):

- *A — mode*:
  - `reduceMotion` (AvatarProps, AvatarShimmerProps, AvatarGroupShimmerProps) — `boolean | "auto" | undefined`
  - `variant` (AvatarBadgeProps, AvatarGroupProps, AvatarGroupCountProps) — `BadgeVariant | undefined`
- *B — behaviour*:
  - `onAvatarClick` (AvatarGroupProps) — `((info: { index: number; name?: string | undefined; }, event: MouseEve`
  - `onError` — `(() => void) | undefined`
  - `onLoad` — `(() => void) | undefined`
  - `renderSurplus` (AvatarGroupProps) — `((count: number) => ReactNode) | undefined`
- *C — content*: `animate`, `autoColor`, `bordered`, `children`, `color`, `colors`, `count`, `dir`, `dot`, `format`, `imageConfig`, `invisible`, `max`, `maxInitials`, `offset`, `overlap`, `position`, `pulse`, `reverseOrder`, `ringColor`, `shape`, `showCount`, `showPlus`, `showTooltip`, `showZero`, `size`, `spacing`, `textClassName`, `textStyle`, `tooltip`, `total`
- *D — passthrough*: `aria-live`

**Demonstrated but undocumented** — in the type and in a demo, absent from both
`schema.json` and the `.ai.md` All Props table:

`animate`, `color`, `count`, `dir`, `dot`, `format`, `invisible`, `max`, `offset`, `onAvatarClick`, `overlap`, `position`, `pulse`, `renderSurplus`, `reverseOrder`, `ringColor`, `showCount`, `showPlus`, `showTooltip`, `showZero`, `spacing`, `total`, `variant`

### Breadcrumb

23 props across `BreadcrumbProps`. No demo: 9. No fixture: 18.

Contract-driven (no fixture declares these; `registry.tsx` applies them): `classes`, `unstyled`.

**No demo** (9):

- *A — mode*:
  - `portalContainer` — `HTMLElement | null | undefined`
  - `unstyled` — `boolean | undefined`
- *C — content*: `dropdownZIndex`, `ellipsisAriaLabel`, `ellipsisIcon`, `tooltipOffset`
- *D — passthrough*: `aria-label`, `className`, `style`

**No fixture** (18):

- *A — mode*:
  - `portalContainer` — `HTMLElement | null | undefined`
- *B — behaviour*:
  - `onDropdownOpenChange` — `((open: boolean) => void) | undefined`
  - `onItemClick` — `((item: BreadcrumbItem) => void) | undefined`
- *C — content*: `defaultTooltipProps`, `dropdownPosition`, `dropdownZIndex`, `ellipsisAriaLabel`, `ellipsisIcon`, `ellipsisTooltip`, `ellipsisTooltipProps`, `iconSize`, `separator`, `separatorIcon`, `tooltipOffset`, `tooltipPosition`
- *D — passthrough*: `aria-label`, `className`, `style`

### Button

28 props across `ButtonProps`, `ButtonGroupProps`. No demo: 3. No fixture: 19.

Contract-driven (no fixture declares these; `registry.tsx` applies them): `asChild`, `classes`, `unstyled`.

**Phantom** — claimed by the docs, absent from the type:

- `.ai.md` example code: `icon`

**No demo** (3):

- *A — mode*:
  - `unstyled` — `boolean | undefined`
- *C — content*: `children`
- *D — passthrough*: `style`

**No fixture** (19):

- *A — mode*:
  - `orientation` (ButtonGroupProps) — `"vertical" | "horizontal" | undefined`
  - `reduceMotion` — `boolean | "auto" | undefined`
- *B — behaviour*:
  - `onClick` — `((event: MouseEvent<HTMLElement, MouseEvent>) => void) | undefined`
- *C — content*: `animateIcon`, `animateOnHover`, `as`, `href`, `iconAnimation`, `loader`, `loaderPosition`, `loaderSize`, `loadingText`, `rel`, `size`, `target`, `tooltip`, `tooltipProps`
- *D — passthrough*: `className`, `style`

**Demonstrated but undocumented** — in the type and in a demo, absent from both
`schema.json` and the `.ai.md` All Props table:

`className`, `onClick`, `orientation`

### CascadingDropdown

58 props across `CascadingDropdownProps`. No demo: 23. No fixture: 40.

Contract-driven (no fixture declares these; `registry.tsx` applies them): `classes`, `keepMounted`, `open`, `unstyled`.

**Phantom** — claimed by the docs, absent from the type:

- `.ai.md` All Props table: `selectionMode`, `subSearchControl`
- `.ai.md` example code: `message`

**No demo** (23):

- *A — mode*:
  - `keepMounted` — `boolean | undefined`
  - `portalContainer` — `HTMLElement | null | undefined`
  - `unstyled` — `boolean | undefined`
- *B — behaviour*:
  - `defaultOpen` — `boolean | undefined`
  - `onBlur` — `(() => void) | undefined`
  - `onFocus` — `(() => void) | undefined`
  - `onKeyDown` — `((event: KeyboardEvent<Element>) => void) | undefined`
  - `onLoadError` — `((error: unknown) => void) | undefined`
  - `onOpenChange` — `((open: boolean) => void) | undefined`
  - `open` — `boolean | undefined`
  - `renderTrigger` — `((props: CascadingDropdownTriggerRenderProps) => ReactNode) | undefine`
- *C — content*: `ClearIcon`, `clearable`, `dropdownGap`, `dropdownPosition`, `dropdownZIndex`, `menuSearchAriaLabel`, `shimmerCount`, `submenuSearchAriaLabel`
- *D — passthrough*: `aria-label`, `id`, `name`, `style`

**No fixture** (40):

- *A — mode*:
  - `lockScroll` — `boolean | undefined`
  - `onLoadChildren` — `((parent: CascadingOption) => Promise<CascadingOption[]>) | undefined`
  - `onMenuSearch` — `((query: string) => Promise<CascadingOption[]>) | undefined`
  - `onSubmenuSearch` — `((query: string, parent: CascadingOption) => Promise<CascadingOption[]`
  - `portalContainer` — `HTMLElement | null | undefined`
- *B — behaviour*:
  - `onBlur` — `(() => void) | undefined`
  - `onFocus` — `(() => void) | undefined`
  - `onKeyDown` — `((event: KeyboardEvent<Element>) => void) | undefined`
  - `onLoadError` — `((error: unknown) => void) | undefined`
  - `onOpenChange` — `((open: boolean) => void) | undefined`
  - `onValueChange` — `((value: CascadingValue, path: CascadingOption[]) => void) | undefined`
  - `renderTrigger` — `((props: CascadingDropdownTriggerRenderProps) => ReactNode) | undefine`
  - `required` — `boolean | undefined`
  - `value` — `CascadingValue | undefined`
- *C — content*: `ClearIcon`, `SearchIcon`, `checkboxIcon`, `closeOnSelect`, `dropdownGap`, `dropdownPosition`, `dropdownZIndex`, `fullWidth`, `loadingText`, `menuSearchAriaLabel`, `menuSearchPlaceholder`, `noResultsContent`, `placeholder`, `searchDebounceMs`, `selectedIcon`, `shimmerCount`, `showChevron`, `showSelectedIcon`, `submenuPosition`, `submenuSearchAriaLabel`, `submenuSearchPlaceholder`
- *D — passthrough*: `aria-label`, `className`, `id`, `name`, `style`

### Checkbox

21 props across `CheckboxProps`. No demo: 3. No fixture: 10.

Contract-driven (no fixture declares these; `registry.tsx` applies them): `classes`, `unstyled`.

**Phantom** — claimed by the docs, absent from the type:

- `.ai.md` example code: `message`

**No demo** (3):

- *A — mode*:
  - `reduceMotion` — `boolean | "auto" | undefined`
  - `unstyled` — `boolean | undefined`
- *C — content*: `indeterminateIcon`

**No fixture** (10):

- *A — mode*:
  - `reduceMotion` — `boolean | "auto" | undefined`
- *B — behaviour*:
  - `checked` — `boolean | undefined`
  - `onBlur` — `((event: FocusEvent<HTMLInputElement, Element>) => void) | undefined`
  - `onFocus` — `((event: FocusEvent<HTMLInputElement, Element>) => void) | undefined`
  - `onValueChange` — `((checked: boolean) => void) | undefined`
- *C — content*: `checkedIcon`, `indeterminateIcon`, `shape`, `size`, `uncheckedIcon`

### CountryFlag

22 props across `CountryFlagProps`, `CountryFlagGroupProps`, `CountryFlagGroupCountProps`, `CountryFlagShimmerProps`, `CountryFlagGroupShimmerProps`. No demo: 7. No fixture: 17.

Contract-driven (no fixture declares these; `registry.tsx` applies them): `classes`, `unstyled`.

**No demo** (7):

- *A — mode*:
  - `unstyled` (CountryFlagProps, CountryFlagShimmerProps) — `boolean | undefined`
- *B — behaviour*:
  - `onError` — `((event: SyntheticEvent<HTMLImageElement, Event>) => void) | undefined`
  - `onLoad` — `((event: SyntheticEvent<HTMLImageElement, Event>) => void) | undefined`
- *C — content*: `animate`, `children`, `countTooltip`, `surplusTooltipContent`

**No fixture** (17):

- *A — mode*:
  - `reduceMotion` (CountryFlagProps, CountryFlagShimmerProps, CountryFlagGroupShimmerProps) — `boolean | "auto" | undefined`
- *B — behaviour*:
  - `onError` — `((event: SyntheticEvent<HTMLImageElement, Event>) => void) | undefined`
  - `onLoad` — `((event: SyntheticEvent<HTMLImageElement, Event>) => void) | undefined`
  - `renderSurplus` (CountryFlagGroupProps) — `((count: number) => ReactNode) | undefined`
- *C — content*: `alt`, `animate`, `aspectRatio`, `basePath`, `children`, `count`, `countTooltip`, `max`, `showCount`, `showCountTooltip`, `size`, `surplusTooltipContent`, `tooltip`

**Demonstrated but undocumented** — in the type and in a demo, absent from both
`schema.json` and the `.ai.md` All Props table:

`count`, `max`, `renderSurplus`, `showCount`, `showCountTooltip`

### DatePicker

63 props across `DatePickerProps`. No demo: 12. No fixture: 41.

Contract-driven (no fixture declares these; `registry.tsx` applies them): `classes`, `keepMounted`, `open`, `unstyled`.

**Phantom** — claimed by the docs, absent from the type:

- `.ai.md` All Props table: `presetGroup`
- `.ai.md` example code: `message`, `presetGroup`

**No demo** (12):

- *A — mode*:
  - `keepMounted` — `boolean | undefined`
  - `portalContainer` — `HTMLElement | null | undefined`
  - `unstyled` — `boolean | undefined`
- *B — behaviour*:
  - `defaultValue` — `Date[] | null | undefined`
- *C — content*: `dropdownGap`, `dropdownZIndex`, `monthDropdownSelectedIcon`, `showCalendarIcon`, `todayAction`, `yearDropdownSelectedIcon`
- *D — passthrough*: `id`, `name`

**No fixture** (41):

- *A — mode*:
  - `forceDropdownPosition` — `boolean | undefined`
  - `lockScroll` — `boolean | undefined`
  - `portalContainer` — `HTMLElement | null | undefined`
  - `reduceMotion` — `boolean | "auto" | undefined`
- *B — behaviour*:
  - `defaultValue` — `Date[] | null | undefined`
  - `onClear` — `(() => void) | undefined`
  - `onMonthChange` — `((month: Date) => void) | undefined`
  - `onOpenChange` — `((open: boolean) => void) | undefined`
  - `onValueChange` — `((dates: Date[] | null, dateValues: DateValue[] | null) => void) | und`
  - `required` — `boolean | undefined`
- *C — content*: `calendarIcon`, `clearIcon`, `dateFormat`, `disabledDates`, `dropdownGap`, `dropdownPosition`, `dropdownZIndex`, `fixedWeeks`, `fullWidth`, `locale`, `monthDropdownSelectedIcon`, `nextMonthIcon`, `nextYearIcon`, `numberOfMonths`, `outsideDaysSelectable`, `placeholder`, `presets`, `prevMonthIcon`, `prevYearIcon`, `showCalendarIcon`, `showClearButton`, `showMarkerIndicator`, `showMarkerTooltip`, `showOutsideDays`, `showTodayIndicator`, `todayAction`, `todayIcon`, `weekStartsOn`, `yearDropdownSelectedIcon`
- *D — passthrough*: `id`, `name`

### Drawer

30 props across `DrawerProps`, `DrawerBodyProps`, `DrawerCloseButtonProps`, `DrawerFooterProps`, `DrawerHeaderProps`. No demo: 9. No fixture: 24.

Contract-driven (no fixture declares these; `registry.tsx` applies them): `classes`, `keepMounted`, `open`, `unstyled`.

**No demo** (9):

- *A — mode*:
  - `portalContainer` — `HTMLElement | null | undefined`
  - `restoreFocus` — `boolean | undefined`
  - `trapFocus` — `boolean | undefined`
  - `unstyled` — `boolean | undefined`
- *B — behaviour*:
  - `defaultOpen` — `boolean | undefined`
- *C — content*: `children`, `overlayColor`, `swipeThreshold`, `zIndex`

**No fixture** (24):

- *A — mode*:
  - `lockScroll` — `boolean | undefined`
  - `portalContainer` — `HTMLElement | null | undefined`
  - `reduceMotion` — `boolean | "auto" | undefined`
  - `restoreFocus` — `boolean | undefined`
  - `trapFocus` — `boolean | undefined`
- *B — behaviour*:
  - `defaultOpen` — `boolean | undefined`
  - `onOpenChange` — `((open: boolean) => void) | undefined`
  - `onSnapPointIndexChange` — `((index: number) => void) | undefined`
  - `onTransitionEnd` — `((open: boolean) => void) | undefined`
- *C — content*: `activeSnapPointIndex`, `closeOnEscape`, `closeOnOverlayClick`, `defaultSnapPointIndex`, `duration`, `initialFocus`, `modal`, `overlayBlur`, `overlayColor`, `overlayOpacity`, `size`, `snapPoints`, `swipeThreshold`, `swipeable`, `zIndex`

### Dropdown

50 props across `DropdownProps`. No demo: 4. No fixture: 34.

Contract-driven (no fixture declares these; `registry.tsx` applies them): `classes`, `keepMounted`, `open`, `unstyled`.

**Phantom** — claimed by the docs, absent from the type:

- `.ai.md` example code: `message`

**No demo** (4):

- *A — mode*:
  - `unstyled` — `boolean | undefined`
- *B — behaviour*:
  - `defaultOpen` — `boolean | undefined`
- *C — content*: `loadingText`
- *D — passthrough*: `id`

**No fixture** (34):

- *A — mode*:
  - `forceDropdownPosition` — `boolean | undefined`
  - `loadOnOpen` — `true`
  - `lockScroll` — `boolean | undefined`
  - `onLoadOptions` — `() => Promise<DropdownOption[]>`
  - `portalContainer` — `HTMLElement | null | undefined`
- *B — behaviour*:
  - `onBlur` — `(() => void) | undefined`
  - `onFocus` — `(() => void) | undefined`
  - `onKeyDown` — `((event: KeyboardEvent<Element>) => void) | undefined`
  - `onLoadError` — `((error: unknown) => void) | undefined`
  - `onOpenChange` — `((open: boolean) => void) | undefined`
  - `onValueChange` — `((value: string | null, option: DropdownOption | null) => void) | unde`
  - `renderTrigger` — `((props: DropdownTriggerRenderProps) => ReactNode) | undefined`
  - `required` — `boolean | undefined`
  - `value` — `string | null | undefined`
- *C — content*: `CheckIcon`, `ChevronIcon`, `ClearIcon`, `dropdownGap`, `dropdownPosition`, `dropdownZIndex`, `fullWidth`, `loadingText`, `noResultsContent`, `placeholder`, `selectedIcon`, `shimmerCount`, `showChevron`, `showSelectedIcon`, `typeaheadTimeout`
- *D — passthrough*: `aria-label`, `className`, `id`, `name`, `style`

### Input

26 props across `InputProps`. No demo: 1. No fixture: 11.

Contract-driven (no fixture declares these; `registry.tsx` applies them): `classes`, `unstyled`.

**Phantom** — claimed by the docs, absent from the type:

- `.ai.md` example code: `message`

**No demo** (1):

- *A — mode*:
  - `unstyled` — `boolean | undefined`

**No fixture** (11):

- *B — behaviour*:
  - `onClear` — `(() => void) | undefined`
  - `onEndIconClick` — `(() => void) | undefined`
  - `onStartIconClick` — `(() => void) | undefined`
  - `onValueChange` — `((value: string) => void) | undefined`
- *C — content*: `endIconLabel`, `fullWidth`, `loader`, `loaderSize`, `size`, `startIconLabel`
- *D — passthrough*: `className`

### InternationalPhoneInput

48 props across `InternationalPhoneInputProps`. No demo: 9. No fixture: 35.

Contract-driven (no fixture declares these; `registry.tsx` applies them): `classes`, `unstyled`.

**Phantom** — claimed by the docs, absent from the type:

- `.ai.md` example code: `message`

**No demo** (9):

- *A — mode*:
  - `portalContainer` — `HTMLElement | null | undefined`
  - `unstyled` — `boolean | undefined`
- *B — behaviour*:
  - `onClear` — `(() => void) | undefined`
- *C — content*: `clearable`, `dropdownGap`, `dropdownZIndex`
- *D — passthrough*: `className`, `id`, `style`

**No fixture** (35):

- *A — mode*:
  - `forceDropdownPosition` — `boolean | undefined`
  - `lockScroll` — `boolean | undefined`
  - `portalContainer` — `HTMLElement | null | undefined`
- *B — behaviour*:
  - `onClear` — `(() => void) | undefined`
  - `onCountryChange` — `((country: CountryOption) => void) | undefined`
  - `onPasteDetected` — `((data: PasteDetectedData) => void) | undefined`
  - `onValueChange` — `((data: PhoneNumberData) => void) | undefined`
  - `renderCountryOption` — `((props: CountryOptionRenderProps) => ReactNode) | undefined`
  - `renderSelectedCountry` — `((country: CountryOption) => ReactNode) | undefined`
  - `required` — `boolean | undefined`
  - `value` — `PhoneNumberValue | undefined`
- *C — content*: `copyFormat`, `countries`, `countryDropdownAriaLabel`, `countryDropdownPlaceholder`, `countrySearchPlaceholder`, `defaultCountry`, `dropdownGap`, `dropdownPosition`, `dropdownZIndex`, `enablePasteDetection`, `flagSize`, `formatPatterns`, `fullWidth`, `lengthRules`, `placeholder`, `preferredCountries`, `selectedIcon`, `validate`, `validateOnBlur`, `validationMessage`
- *D — passthrough*: `className`, `id`, `name`, `style`

### Loader

14 props across `CircularLoaderProps`, `DotLoaderProps`, `LinearLoaderProps`, `PulseLoaderProps`. No demo: 3. No fixture: 10.

Contract-driven (no fixture declares these; `registry.tsx` applies them): `classes`, `unstyled`.

**No demo** (3):

- *A — mode*:
  - `reduceMotion` (CircularLoaderProps, DotLoaderProps, LinearLoaderProps, PulseLoaderProps) — `boolean | "auto" | undefined`
  - `unstyled` (CircularLoaderProps, DotLoaderProps, LinearLoaderProps, PulseLoaderProps) — `boolean | undefined`
- *B — behaviour*:
  - `classes` (CircularLoaderProps, DotLoaderProps, LinearLoaderProps, PulseLoaderProps) — `CircularLoaderClasses | undefined`

**No fixture** (10):

- *A — mode*:
  - `reduceMotion` (CircularLoaderProps, DotLoaderProps, LinearLoaderProps, PulseLoaderProps) — `boolean | "auto" | undefined`
- *C — content*: `borderRadius`, `count`, `dotSize`, `gap`, `height`, `rings`, `speed`, `trackColor`, `width`

### Modal

40 props across `ModalProps`, `ModalHeaderProps`, `ModalBodyProps`, `ModalFooterProps`. No demo: 14. No fixture: 29.

Contract-driven (no fixture declares these; `registry.tsx` applies them): `classes`, `keepMounted`, `open`, `unstyled`.

**No demo** (14):

- *A — mode*:
  - `lockScroll` — `boolean | undefined`
  - `restoreFocus` — `boolean | undefined`
  - `showOverlay` — `boolean | undefined`
- *B — behaviour*:
  - `defaultOpen` — `boolean | undefined`
- *C — content*: `animationDuration`, `children`, `contentStyle`, `maxNestingLevel`, `minHeight`, `minWidth`
- *D — passthrough*: `aria-describedby`, `aria-label`, `aria-labelledby`, `className`

**No fixture** (29):

- *A — mode*:
  - `lockScroll` — `boolean | undefined`
  - `reduceMotion` — `boolean | "auto" | undefined`
  - `restoreFocus` — `boolean | undefined`
  - `showOverlay` — `boolean | undefined`
  - `trapFocus` — `boolean | undefined`
- *B — behaviour*:
  - `defaultOpen` — `boolean | undefined`
  - `onOpenChange` — `((open: boolean) => void) | undefined`
- *C — content*: `animationDuration`, `centered`, `closeIcon`, `closeOnEscape`, `contentStyle`, `disableAnimation`, `initialFocus`, `maxHeight`, `maxNestingLevel`, `maxWidth`, `minHeight`, `minWidth`, `nestingLevel`, `overlayColor`, `overlayOpacity`, `preventOutsideClick`, `showHeader`, `zIndex`
- *D — passthrough*: `aria-describedby`, `aria-label`, `aria-labelledby`, `className`

### MultiSelectDropdown

49 props across `MultiSelectDropdownProps`. No demo: 9. No fixture: 31.

Contract-driven (no fixture declares these; `registry.tsx` applies them): `classes`, `keepMounted`, `open`, `unstyled`.

**No demo** (9):

- *A — mode*:
  - `unstyled` — `boolean | undefined`
- *B — behaviour*:
  - `defaultOpen` — `boolean | undefined`
  - `defaultValue` — `string[] | undefined`
  - `onLoadError` — `((error: unknown) => void) | undefined`
  - `renderTrigger` — `((props: MultiSelectDropdownTriggerRenderProps) => ReactNode) | undefi`
- *C — content*: `ClearIcon`, `clearable`, `loadingText`
- *D — passthrough*: `id`

**No fixture** (31):

- *A — mode*:
  - `forceDropdownPosition` — `boolean | undefined`
  - `loadOnOpen` — `true`
  - `lockScroll` — `boolean | undefined`
  - `onLoadOptions` — `() => Promise<DropdownOption[]>`
  - `portalContainer` — `HTMLElement | null | undefined`
- *B — behaviour*:
  - `onBlur` — `(() => void) | undefined`
  - `onFocus` — `(() => void) | undefined`
  - `onKeyDown` — `((event: KeyboardEvent<Element>) => void) | undefined`
  - `onLoadError` — `((error: unknown) => void) | undefined`
  - `onOpenChange` — `((open: boolean) => void) | undefined`
  - `onValueChange` — `((values: string[], options: DropdownOption[]) => void) | undefined`
  - `renderTrigger` — `((props: MultiSelectDropdownTriggerRenderProps) => ReactNode) | undefi`
  - `required` — `boolean | undefined`
  - `value` — `string[] | undefined`
- *C — content*: `ChevronIcon`, `ClearIcon`, `checkboxIcon`, `dropdownGap`, `dropdownPosition`, `dropdownZIndex`, `fullWidth`, `loadingText`, `noResultsContent`, `placeholder`, `shimmerCount`, `showChevron`
- *D — passthrough*: `aria-label`, `className`, `id`, `name`, `style`

### MultiSelectSearchableDropdown

54 props across `MultiSelectSearchableDropdownProps`, `IconProps`. No demo: 11. No fixture: 33.

Contract-driven (no fixture declares these; `registry.tsx` applies them): `classes`, `keepMounted`, `open`, `unstyled`.

**No demo** (11):

- *A — mode*:
  - `unstyled` — `boolean | undefined`
- *B — behaviour*:
  - `onLoadError` — `((error: unknown) => void) | undefined`
  - `renderTrigger` — `((props: MultiSelectSearchableDropdownTriggerRenderProps) => ReactNode`
- *C — content*: `ClearIcon`, `clearable`, `initialOptions`, `searchInputAriaLabel`, `shimmerCount`, `showChevron`
- *D — passthrough*: `id`, `name`

**No fixture** (33):

- *A — mode*:
  - `forceDropdownPosition` — `boolean | undefined`
  - `loadInitialOnOpen` — `true`
  - `lockScroll` — `boolean | undefined`
  - `onLoadInitialOptions` — `() => Promise<MultiSelectOption[]>`
  - `portalContainer` — `HTMLElement | null | undefined`
- *B — behaviour*:
  - `onBlur` — `(() => void) | undefined`
  - `onFocus` — `(() => void) | undefined`
  - `onKeyDown` — `((event: KeyboardEvent<Element>) => void) | undefined`
  - `onLoadError` — `((error: unknown) => void) | undefined`
  - `onOpenChange` — `((open: boolean) => void) | undefined`
  - `onValueChange` — `((values: string[], options: MultiSelectOption[]) => void) | undefined`
  - `renderTrigger` — `((props: MultiSelectSearchableDropdownTriggerRenderProps) => ReactNode`
  - `required` — `boolean | undefined`
  - `value` — `string[] | undefined`
- *C — content*: `ClearIcon`, `checkboxIcon`, `dropdownGap`, `dropdownPosition`, `dropdownZIndex`, `fullWidth`, `loadingText`, `noResultsContent`, `placeholder`, `searchDebounceMs`, `searchInputAriaLabel`, `searchPlaceholder`, `shimmerCount`, `showChevron`
- *D — passthrough*: `aria-label`, `className`, `id`, `name`, `style`

### OtpInput

32 props across `OtpInputProps`, `OtpInputLabelProps`. No demo: 5. No fixture: 18.

Contract-driven (no fixture declares these; `registry.tsx` applies them): `classes`, `unstyled`.

**No demo** (5):

- *A — mode*:
  - `unstyled` — `boolean | undefined`
- *C — content*: `inputPattern`
- *D — passthrough*: `className`, `htmlFor`, `id`

**No fixture** (18):

- *B — behaviour*:
  - `onComplete` — `((value: string) => void) | undefined`
  - `onValueChange` — `((value: string) => void) | undefined`
  - `renderInput` — `((props: OtpInputRenderProps) => ReactNode) | undefined`
  - `required` (OtpInputProps, OtpInputLabelProps) — `boolean | undefined`
  - `value` — `string | undefined`
- *C — content*: `allowPaste`, `autoFocusFirst`, `fullWidth`, `groupAriaLabel`, `inputAriaLabel`, `inputClassNames`, `inputPattern`, `inputType`, `validate`
- *D — passthrough*: `className`, `htmlFor`, `id`, `name`

### Pagination

31 props across `PaginationProps`, `IconProps`. No demo: 5. No fixture: 23.

Contract-driven (no fixture declares these; `registry.tsx` applies them): `classes`, `unstyled`.

**No demo** (5):

- *A — mode*:
  - `portalContainer` — `HTMLElement | null | undefined`
  - `reduceMotion` — `boolean | "auto" | undefined`
  - `unstyled` — `boolean | undefined`
- *B — behaviour*:
  - `defaultValue` — `number | undefined`
- *C — content*: `dropdownGap`

**No fixture** (23):

- *A — mode*:
  - `portalContainer` — `HTMLElement | null | undefined`
  - `reduceMotion` — `boolean | "auto" | undefined`
- *B — behaviour*:
  - `onRowsPerPageChange` — `((rows: number) => void) | undefined`
  - `onValueChange` — `((page: number) => void) | undefined`
  - `renderEllipsis` — `((props: EllipsisRenderProps) => ReactNode) | undefined`
  - `value` — `number | undefined`
- *C — content*: `dropdownAriaLabel`, `dropdownGap`, `dropdownIcon`, `dropdownPosition`, `dropdownZIndex`, `nextAriaLabel`, `nextIcon`, `pageAriaLabel`, `paginationAriaLabel`, `prevAriaLabel`, `prevIcon`, `rowOptions`, `rowsPerPageLabel`, `sectionOrder`, `showLabel`, `siblingCount`
- *D — passthrough*: `className`

**Demonstrated but undocumented** — in the type and in a demo, absent from both
`schema.json` and the `.ai.md` All Props table:

`className`

### RadioButton

23 props across `RadioGroupProps`, `RadioButtonProps`. No demo: 5. No fixture: 10.

Contract-driven (no fixture declares these; `registry.tsx` applies them): `classes`, `unstyled`.

**No demo** (5):

- *A — mode*:
  - `reduceMotion` (RadioGroupProps) — `boolean | "auto" | undefined`
  - `unstyled` (RadioGroupProps) — `boolean | undefined`
- *B — behaviour*:
  - `onBlur` (RadioGroupProps) — `((event: FocusEvent<HTMLInputElement, Element>) => void) | undefined`
  - `onFocus` (RadioGroupProps) — `((event: FocusEvent<HTMLInputElement, Element>) => void) | undefined`
- *C — content*: `children`

**No fixture** (10):

- *A — mode*:
  - `reduceMotion` (RadioGroupProps) — `boolean | "auto" | undefined`
- *B — behaviour*:
  - `onBlur` (RadioGroupProps) — `((event: FocusEvent<HTMLInputElement, Element>) => void) | undefined`
  - `onFocus` (RadioGroupProps) — `((event: FocusEvent<HTMLInputElement, Element>) => void) | undefined`
  - `onValueChange` (RadioGroupProps) — `((value: string) => void) | undefined`
  - `required` (RadioGroupProps) — `boolean | undefined`
  - `value` (RadioGroupProps, RadioButtonProps) — `string | undefined`
- *C — content*: `checkedIcon`, `size`, `uncheckedIcon`
- *D — passthrough*: `name`

### ResizablePanel

14 props across `ResizablePanelProps`. No demo: 2. No fixture: 11.

Contract-driven (no fixture declares these; `registry.tsx` applies them): `classes`, `unstyled`.

**No demo** (2):

- *A — mode*:
  - `reduceMotion` — `boolean | "auto" | undefined`
  - `unstyled` — `boolean | undefined`

**No fixture** (11):

- *A — mode*:
  - `reduceMotion` — `boolean | "auto" | undefined`
- *B — behaviour*:
  - `defaultValue` — `number | undefined`
  - `onResizeEnd` — `((value: number) => void) | undefined`
  - `onResizeStart` — `((value: number) => void) | undefined`
  - `onValueChange` — `((value: number) => void) | undefined`
  - `value` — `number | undefined`
- *C — content*: `handleContent`, `maxValue`, `minValue`, `resizeDirection`, `step`

### SearchableDropdown

57 props across `SearchableDropdownProps`. No demo: 6. No fixture: 38.

Contract-driven (no fixture declares these; `registry.tsx` applies them): `classes`, `keepMounted`, `open`, `unstyled`.

**No demo** (6):

- *A — mode*:
  - `unstyled` — `boolean | undefined`
- *B — behaviour*:
  - `defaultOpen` — `boolean | undefined`
- *C — content*: `loadingText`, `searchInputAriaLabel`, `typeaheadTimeout`
- *D — passthrough*: `id`

**No fixture** (38):

- *A — mode*:
  - `forceDropdownPosition` — `boolean | undefined`
  - `loadInitialOnOpen` — `true`
  - `lockScroll` — `boolean | undefined`
  - `onLoadInitialOptions` — `() => Promise<DropdownOption[]>`
  - `portalContainer` — `HTMLElement | null | undefined`
- *B — behaviour*:
  - `onBlur` — `(() => void) | undefined`
  - `onFocus` — `(() => void) | undefined`
  - `onKeyDown` — `((event: KeyboardEvent<Element>) => void) | undefined`
  - `onLoadError` — `((error: unknown) => void) | undefined`
  - `onOpenChange` — `((open: boolean) => void) | undefined`
  - `onValueChange` — `((value: string | null, option: DropdownOption | null) => void) | unde`
  - `renderTrigger` — `((props: SearchableDropdownTriggerRenderProps) => ReactNode) | undefin`
  - `required` — `boolean | undefined`
  - `value` — `string | null | undefined`
- *C — content*: `CheckIcon`, `ChevronIcon`, `ClearIcon`, `SearchIcon`, `dropdownGap`, `dropdownPosition`, `dropdownZIndex`, `fullWidth`, `loadingText`, `noResultsContent`, `placeholder`, `searchDebounceMs`, `searchInputAriaLabel`, `searchPlaceholder`, `selectedIcon`, `shimmerCount`, `showChevron`, `showSelectedIcon`, `typeaheadTimeout`
- *D — passthrough*: `aria-label`, `className`, `id`, `name`, `style`

### Slider

35 props across `SliderProps`. No demo: 5. No fixture: 21.

Contract-driven (no fixture declares these; `registry.tsx` applies them): `classes`, `unstyled`.

**No demo** (5):

- *A — mode*:
  - `unstyled` — `boolean | undefined`
- *D — passthrough*: `aria-label`, `aria-labelledby`, `aria-valuetext`, `id`

**No fixture** (21):

- *B — behaviour*:
  - `onValueChange` — `((value: SliderValue) => void) | undefined`
  - `onValueCommit` — `((value: SliderValue) => void) | undefined`
  - `renderMark` — `((props: SliderMarkRenderProps) => ReactNode) | undefined`
  - `renderThumb` — `((props: SliderThumbRenderProps) => ReactNode) | undefined`
  - `required` — `boolean | undefined`
  - `value` — `SliderValue | undefined`
- *C — content*: `formatTooltip`, `inverted`, `loading`, `markDotSize`, `max`, `min`, `minStepsBetweenThumbs`, `showMarkLabels`, `step`, `transitionDuration`
- *D — passthrough*: `aria-label`, `aria-labelledby`, `aria-valuetext`, `id`, `name`

### Stepper

30 props across `StepperProps`, `IconProps`. No demo: 4. No fixture: 19.

Contract-driven (no fixture declares these; `registry.tsx` applies them): `classes`, `unstyled`.

**No demo** (4):

- *A — mode*:
  - `reduceMotion` — `boolean | "auto" | undefined`
  - `unstyled` — `boolean | undefined`
- *C — content*: `indicatorSize`
- *D — passthrough*: `style`

**No fixture** (19):

- *A — mode*:
  - `loop` — `boolean | undefined`
  - `reduceMotion` — `boolean | "auto" | undefined`
- *B — behaviour*:
  - `disabled` — `boolean | undefined`
  - `onValueChange` — `((stepId: string | number) => void) | undefined`
  - `renderStep` — `((props: StepRenderProps, defaultElement: ReactElement<unknown, string`
- *C — content*: `activationMode`, `beforeStepChange`, `completedIcon`, `errorIcon`, `fullWidth`, `indicatorSize`, `isStepClickable`, `showConnectors`, `showLabels`, `tooltipDefaults`
- *D — passthrough*: `aria-label`, `className`, `id`, `style`

### Switch

28 props across `SwitchProps`. No demo: 7. No fixture: 17.

Contract-driven (no fixture declares these; `registry.tsx` applies them): `classes`, `unstyled`.

**No demo** (7):

- *A — mode*:
  - `reduceMotion` — `boolean | "auto" | undefined`
  - `unstyled` — `boolean | undefined`
- *B — behaviour*:
  - `value` — `string | undefined`
- *C — content*: `loader`, `loaderSize`
- *D — passthrough*: `className`, `style`

**No fixture** (17):

- *A — mode*:
  - `reduceMotion` — `boolean | "auto" | undefined`
- *B — behaviour*:
  - `checked` — `boolean | undefined`
  - `onValueChange` — `((checked: boolean) => void) | undefined`
  - `renderDescription` — `((props: SwitchRenderProps) => ReactNode) | undefined`
  - `renderLabel` — `((props: SwitchRenderProps) => ReactNode) | undefined`
  - `required` — `boolean | undefined`
  - `value` — `string | undefined`
- *C — content*: `checkedIcon`, `loader`, `loaderSize`, `transitionDuration`, `transitionTimingFunction`, `uncheckedIcon`
- *D — passthrough*: `className`, `id`, `name`, `style`

### TabPanel

26 props across `TabPanelProps`. No demo: 6. No fixture: 18.

Contract-driven (no fixture declares these; `registry.tsx` applies them): `classes`, `keepMounted`, `unstyled`.

**No demo** (6):

- *A — mode*:
  - `reduceMotion` — `boolean | "auto" | undefined`
  - `unstyled` — `boolean | undefined`
- *C — content*: `children`
- *D — passthrough*: `aria-labelledby`, `className`, `style`

**No fixture** (18):

- *A — mode*:
  - `loop` — `boolean | undefined`
  - `reduceMotion` — `boolean | "auto" | undefined`
- *B — behaviour*:
  - `disabled` — `boolean | undefined`
  - `onValueChange` — `((tabId: string) => void) | undefined`
  - `renderTab` — `((props: TabRenderProps, defaultElement: ReactElement<unknown, string `
  - `value` — `string | undefined`
- *C — content*: `activationMode`, `alwaysShowLabels`, `forceMount`, `iconPosition`, `showZeroCount`, `tooltipOffset`, `tooltipPosition`
- *D — passthrough*: `aria-label`, `aria-labelledby`, `className`, `id`, `style`

### Table

99 props across `IconProps`, `TableProps`. No demo: 11. No fixture: 65.

Contract-driven (no fixture declares these; `registry.tsx` applies them): `classes`, `unstyled`.

**Phantom** — claimed by the docs, absent from the type:

- `.ai.md` example code: `selectable`

**No demo** (11):

- *A — mode*:
  - `unstyled` — `boolean | undefined`
- *B — behaviour*:
  - `onCursorOverHeader` — `((isOverHeader: boolean) => void) | undefined`
  - `onCursorPosition` — `((position: { x: number; y: number; } | null) => void) | undefined`
  - `onGroupByChange` — `((groupBy: string[]) => void) | undefined`
- *C — content*: `ariaLabel`, `caption`, `children`, `minHeight`, `pinnableColumns`, `showHeader`
- *D — passthrough*: `style`

**No fixture** (65):

- *B — behaviour*:
  - `onCellCopy` — `((value: string, rowId: string, columnId: string) => void) | undefined`
  - `onColumnFiltersChange` — `((filters: ColumnFiltersState) => void) | undefined`
  - `onColumnOrderChange` — `((order: string[]) => void) | undefined`
  - `onColumnSizingChange` — `((sizing: ColumnSizingState) => void) | undefined`
  - `onColumnVisibilityChange` — `((visibility: Record<string, boolean>) => void) | undefined`
  - `onContextMenu` — `((event: MouseEvent<Element, MouseEvent>, row: TData) => void) | undef`
  - `onCursorOverHeader` — `((isOverHeader: boolean) => void) | undefined`
  - `onCursorPosition` — `((position: { x: number; y: number; } | null) => void) | undefined`
  - `onExpandedChange` — `((expandedIds: string[]) => void) | undefined`
  - `onGlobalFilterChange` — `((value: string) => void) | undefined`
  - `onGroupByChange` — `((groupBy: string[]) => void) | undefined`
  - `onRowClick` — `((rowData: TData) => void) | undefined`
  - `onRowHover` — `((rowIndex: number | null, rowRef?: RefObject<HTMLTableRowElement> | u`
  - `onRowReorder` — `((fromIndex: number, toIndex: number) => void) | undefined`
  - `onSearchClear` — `(() => void) | undefined`
  - `onSelectionChange` — `((selectedIds: string[]) => void) | undefined`
  - `onSortingChange` — `((sorting: SortingState) => void) | undefined`
  - `renderColumnFilter` — `((columnId: string, currentValues: string[], setValues: (values: strin`
- *C — content*: `CheckboxIcon`, `DragHandleIcon`, `ExpandIcon`, `FilterIcon`, `PinIcon`, `PinnedIcon`, `SearchIcon`, `ariaLabel`, `caption`, `checkboxColor`, `children`, `columnFilters`, `columnOrder`, `columnSizing`, `columnVisibility`, `density`, `dragColumnPosition`, `emptyContent`, `enableCopyOnClick`, `expandColumnPosition`, `expandOnRowClick`, `floatingActions`, `hideHorizontalScrollbar`, `hideVerticalScrollbar`, `infiniteEndContent`, `isFloatingActionsHovered`, `isPopupOpen`, `loadingMoreContent`, `manualFiltering`, `manualPagination`, `manualSorting`, `maxHeight`, `maxPinnedColumns`, `maxWidth`, `minHeight`, `searchIconPosition`, `searchPlaceholder`, `selectAllMode`, `selectedRowId`, `shimmerRowCount`, `showHeader`, `sorting`, `stickyHeader`, `striped`, `stripedClassName`
- *D — passthrough*: `className`, `style`

### TextArea

25 props across `TextAreaProps`. No demo: 1. No fixture: 7.

Contract-driven (no fixture declares these; `registry.tsx` applies them): `classes`, `unstyled`.

**Phantom** — claimed by the docs, absent from the type:

- `.ai.md` example code: `message`

**No demo** (1):

- *A — mode*:
  - `unstyled` — `boolean | undefined`

**No fixture** (7):

- *B — behaviour*:
  - `onClear` — `(() => void) | undefined`
  - `onValueChange` — `((value: string) => void) | undefined`
- *C — content*: `autoResize`, `loader`, `loaderSize`, `size`
- *D — passthrough*: `className`

### TimePicker

47 props across `ClockFaceProps`, `TimePickerProps`, `TimePickerIconProps`. No demo: 2. No fixture: 28.

Contract-driven (no fixture declares these; `registry.tsx` applies them): `classes`, `keepMounted`, `open`, `unstyled`.

**No demo** (2):

- *A — mode*:
  - `portalContainer` — `HTMLElement | null | undefined`
- *B — behaviour*:
  - `defaultOpen` — `boolean | undefined`

**No fixture** (28):

- *A — mode*:
  - `forceDropdownPosition` — `boolean | undefined`
  - `lockScroll` — `boolean | undefined`
  - `portalContainer` — `HTMLElement | null | undefined`
  - `reduceMotion` (ClockFaceProps, TimePickerProps) — `boolean | undefined`
- *B — behaviour*:
  - `onBlur` — `(() => void) | undefined`
  - `onCancel` (ClockFaceProps, TimePickerProps) — `() => void`
  - `onClear` — `(() => void) | undefined`
  - `onConfirm` (ClockFaceProps, TimePickerProps) — `() => void`
  - `onOpenChange` — `((open: boolean) => void) | undefined`
  - `onValueChange` (ClockFaceProps, TimePickerProps) — `(timeValue: TimeValue) => void`
  - `renderOptionContent` — `((time: string, isSelected: boolean) => ReactNode) | undefined`
  - `required` — `boolean | undefined`
  - `value` (ClockFaceProps, TimePickerProps) — `TimeValue | null`
- *C — content*: `cancelText`, `dropdownGap`, `dropdownPosition`, `dropdownZIndex`, `endIcon`, `fullWidth`, `minuteStep`, `okText`, `placeholder`, `selectedIcon`, `showEndIcon`, `showSelectedIcon`
- *D — passthrough*: `className`, `name`, `style`

**Demonstrated but undocumented** — in the type and in a demo, absent from both
`schema.json` and the `.ai.md` All Props table:

`className`, `style`

### Toast

31 props across `ToastProps`, `ToastProviderProps`. No demo: 15. No fixture: 22.

Contract-driven (no fixture declares these; `registry.tsx` applies them): `classes`, `unstyled`.

**Phantom** — claimed by the docs, absent from the type:

- `.ai.md` All Props table: `root`

**No demo** (15):

- *A — mode*:
  - `unstyled` (ToastProps, ToastProviderProps) — `boolean | undefined`
- *B — behaviour*:
  - `onRemove` — `(id: string) => void`
- *C — content*: `animationDuration`, `children`, `containerAriaLabel`, `containerClassName`, `defaultDuration`, `dismissOnEscape`, `gap`, `providerClasses`, `providerUnstyled`, `role`, `zIndex`
- *D — passthrough*: `className`, `id`

**No fixture** (22):

- *B — behaviour*:
  - `onDismiss` — `(() => void) | undefined`
- *C — content*: `animationDuration`, `children`, `closeAriaLabel`, `containerAriaLabel`, `containerClassName`, `defaultDuration`, `dismissOnEscape`, `duration`, `gap`, `icon`, `maxToasts`, `pauseOnHover`, `position`, `progressColor`, `providerClasses`, `providerUnstyled`, `role`, `showCloseButton`, `zIndex`
- *D — passthrough*: `className`, `style`

### Tooltip

32 props across `TooltipProps`. No demo: 9. No fixture: 22.

Contract-driven (no fixture declares these; `registry.tsx` applies them): `asChild`, `classes`, `open`, `unstyled`.

**No demo** (9):

- *A — mode*:
  - `portal` — `false`
  - `portalContainer` — `undefined`
  - `unstyled` — `boolean | undefined`
- *B — behaviour*:
  - `defaultOpen` — `boolean | undefined`
- *C — content*: `arrowStyle`, `baseArrowStyle`, `children`, `hideDelayDuration`
- *D — passthrough*: `className`

**No fixture** (22):

- *A — mode*:
  - `portal` — `false`
  - `portalContainer` — `undefined`
- *B — behaviour*:
  - `defaultOpen` — `boolean | undefined`
  - `onOpenChange` — `((open: boolean) => void) | undefined`
- *C — content*: `align`, `alignOffset`, `arrowColor`, `arrowSize`, `arrowStyle`, `baseArrowStyle`, `contentStyle`, `disableHoverableContent`, `hideDelayDuration`, `maxWidth`, `shadow`, `sideOffset`, `triggerDisplay`, `truncate`, `truncateWidth`, `wordWrap`, `zIndex`
- *D — passthrough*: `className`

---

## What this does not claim

- **Demo coverage is presence, not quality.** A prop counted as demonstrated appears
  as a JSX attribute on the component somewhere under `src/pages/demo/`. It does not
  follow that the demo shows the prop doing anything interesting.
- **Toast is measured by a weaker signal.** Its API is imperative, so config-object
  keys in `ToastDemo.tsx` are counted as demonstrations. An unrelated object literal
  sharing a prop name would read as coverage.
- **Fixture props are the keys of each fixture's `props: { … }` literal.** A prop set
  by a wrapper or by a spread is not counted, so fixture coverage is a floor.
- **Nothing here decides what should be fixed.** Not every prop earns a demo; the
  tiers rank the gaps, they do not prescribe.
