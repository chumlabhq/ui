# Changelog

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this
project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html) under the policy
in [VERSIONING.md](VERSIONING.md).

## [0.1.0] — unreleased

The first release. `@chumlab/ui` has never been published to npm, so there is nothing here
to upgrade from and no migration to perform.

Everything below is listed anyway. The package went through a long hardening pass before it
was published, and several defaults moved during it. If you have been building against a
branch or a local link, these are the changes that will reach you.

### Added

- 30 components, each with a subpath export (`@chumlab/ui/button`,
  `@chumlab/ui/date-picker`, …) alongside the root barrel. ESM and CJS, with declarations
  for both.
- `styles.css` — precompiled, no Tailwind required — and `tokens.css` for projects that
  would rather generate the utilities themselves. Import one or the other, never both.
- An `unstyled` prop and a `classes` map on every component, with `UNSTYLED_*_CLASSES` and
  `DEFAULT_*_CLASSES` exported from each subpath.
- `reduceMotion`, `keepMounted`, `asChild` and `portalContainer` where each applies.
- `.ai.md` knowledge files and `.schema.json` schemas per component, plus `llms.txt` and
  `llms-full.txt`.

### Changed

- **`classes` now composes with a component's own defaults instead of replacing them.**
  Passing `classes={{ trigger: "px-6" }}` used to discard everything the library had put on
  that slot — including `cursor-pointer` and the focus ring, so any overridden interactive
  slot silently lost its visible focus indicator and with it WCAG 2.4.7. The library's
  classes are applied first and yours last, so a conflicting value of yours still wins
  through tailwind-merge: `classes={{ trigger: "cursor-default" }}` genuinely computes
  `cursor-default`, and `focus-visible:ring-4` genuinely replaces the library's `ring-2`.
  This matches how `className` has always behaved, and it applied at 386 sites across all
  30 components, so **any override you already have may now render additional classes it
  did not before** — most visibly a cursor, a focus ring and a transition.

  To get the old behaviour — no library styling on a slot at all — use `unstyled`, which
  strips the decorative defaults and keeps the structural ones, then add your own:

  ```tsx
  <Accordion unstyled classes={{ trigger: "px-6 py-3 my-own-styles" }} />
  ```

  Nothing about `unstyled` changed.

- `InternationalPhoneInput` carries its 193 countries as a packed string unpacked at module
  load rather than as an array of object literals — 2.16 KB less gzipped, with the same data:
  the decoded array is identical row for row. `DEFAULT_COUNTRIES` is unchanged as an export
  and as a value.

- **`TimePicker`'s clock face, `DatePicker`'s presets and its marker tooltip load on demand.**
  Each is behind a prop that is off by default, and each is now a separate chunk fetched when
  that prop is set — so a consumer of the time dropdown no longer pays for the analog clock.
  TimePicker's exclusive cost falls from 10.50 KB to 7.93 and DatePicker's from 12.59 to
  12.03 — TimePicker is under its ceiling, DatePicker is 0.03 KB over it. The subtree is absent from the server HTML and
  from the first client render, exactly like a portal, and arrives on a later render; if you
  render `mode="clock"` or `showPresets` you may see one frame without it.

- **`dark:` variants are down to six**, from 361 before the retirement began and 76 at the
  start of this pass. Interface text moved onto two new tokens (`--cl-text-chrome`,
  `--cl-text-chrome-quiet`), the accent tints onto `--cl-accent-bg`, input surfaces onto
  `--cl-bg-input` — whose dark value was the page colour and is now the 4% wash its six call
  sites were writing by hand — and menu search bars onto `--cl-bg-recessed`. If you were
  overriding any of these through `classes`, the slot is unchanged; the value it resolves to
  in dark may not be. See `docs/adr/007-dark-variant-endpoint.md` for what got louder or
  quieter, per family, with the measurements.

These are the behavioural changes a consumer would notice. Each was made deliberately;
none is a bug fix that happened to move behaviour.

- **CascadingDropdown's submenu is portalled and anchored, and `classes.subPositioner`
  changed meaning with it.** The submenu was a `position: absolute` child of the menu item
  it opens from, which made it the only floating surface in the package with no viewport
  clamp and no flip: at 1024px it opened 199px past the right edge, and at 320px it painted
  nothing at all. It now renders through the same anchored portal as every other surface.
  `subPositioner` is still the key for that element and still defaults to `z-[9999]`, but it
  is the portal root rather than an absolutely-positioned wrapper, so positioning utilities
  written on it (`left-full`, `top-0`, `absolute`) no longer have any effect — the
  coordinates are inline styles. `submenuSide` picks the preferred side and the side
  actually used is published as `data-side`.
- **Error messages are painted in the error colour.** Every component's `message` class
  carried `text-cl-error text-cl-success` unconditionally, so the merge kept the last one and
  every error message rendered in the success green — in both themes, in fifteen components.
  The colour follows `data-invalid` / `data-valid` now. If you overrode `classes.message`
  with a colour of your own, nothing changes; if you relied on the default, your error text
  changes colour.
- **`--cl-error` and `--cl-success` are a step darker in the light theme** — red-700
  `#b91c1c` and green-700 `#15803d`. The previous values were 4.45:1 and 3.30:1 against
  surfaces this package puts them on, both under WCAG AA for text. Dark is unchanged.
- **Pagination's selected row in the rows-per-page list uses `--cl-accent-bg`**, not an alpha
  of the accent (`bg-cl-accent/15`, with a `dark:` override at `/60` that put accent text on
  a 60% accent wash at 2.2:1). A highlighted selected row keeps its tint and deepens its text
  rather than being repainted with the hover background.
- **Six dangling ARIA references are gone, and two invalid attributes with them.** A custom
  `renderTrigger` on `Dropdown`, `MultiSelectDropdown`, `MultiSelectSearchableDropdown` and
  `SearchableDropdown` left `aria-labelledby` pointing at the value element the library no
  longer renders; it is omitted now, so label your custom trigger with `label` or
  `aria-label`. `Modal` with `showHeader={false}` did the same with its title and
  description, and falls back to `aria-label` from a string `title`. `ButtonGroup` published
  `aria-orientation` on `role="group"`, which does not allow it — the orientation is
  `data-orientation` now. `CascadingDropdown`'s trigger published `aria-required`, which
  `button` does not allow; it is dropped, and `CascadingDropdownTriggerRenderProps` no longer
  carries the field.
- **Design tokens ship in a cascade layer.** `@layer chumlab.tokens` wraps the `--cl-*` block
  in both `styles.css` and `tokens.css`. A consumer's own `:root { --cl-accent: … }` now wins
  whatever order the stylesheets are imported in; before, it won only if the library's
  stylesheet was imported first, and lost silently otherwise. The utilities are deliberately
  NOT layered — they are `.flex:where(.cl-s)`, and a layered rule loses to any unlayered one,
  which would undo the scoping that keeps a consumer's own Tailwind from overriding them.
- **Four components warn when they mount with no accessible name**, joining the six that
  already did: `Drawer` (a dialog composed without a `DrawerHeader`), `RadioGroup` (a
  `radiogroup` takes no name from its radios), `InternationalPhoneInput` (the phone field's
  placeholder is not a name) and `TimePicker` (whose combobox is an `<input>`, which is why
  no axe rule ever faulted it). Development only, as before.
- **Breadcrumb's overflow menu is named.** The `role="menu"` it opens had no accessible name
  at all; it takes the trigger's own `ellipsisAriaLabel`.
- **Drawer no longer names a title that is not there.** The panel's `aria-labelledby` pointed
  at the `DrawerHeader`'s id unconditionally, so a drawer composed without a header claimed a
  name that resolved to nothing. The header registers itself now; a drawer without one is
  unnamed unless you pass `aria-label`.
- **DatePicker's marker tooltip uses the shadow token.** It was
  `boxShadow: "0 4px 12px rgba(0,0,0,0.25)"` inline — the dark theme's shadow painted in
  both, where `--cl-shadow-md` is a tenth of that weight in light.
- **Three raw whites now follow the theme.** `RadioButton`'s checked dot was `white` inline —
  invisible on a light background — and is `--cl-text`. `Table`'s selected checkmark was
  `stroke="white"`, 2.77:1 on the dark theme's accent, and is `--cl-on-accent`. `Avatar`'s
  and `AvatarShimmer`'s `ringColor` defaulted to `"white"`, which drew a halo in dark; the
  default is `var(--cl-bg)`, the page behind the avatars. Two `Table` hover washes that were
  `bg-black/…` with no dark counterpart use `--cl-bg-item-hover`.
- **AvatarBadge follows the theme.** All three variants were Tailwind's red ramp:
  `bg-red-500` under `text-white` is 3.76:1, the outline variant painted `bg-white` — a
  light-theme assumption — and the soft variant's `bg-red-100 text-red-700` stayed light in
  dark. They use `--cl-error`, `--cl-error-bg` and `--cl-on-error` now. The last two are new
  tokens; if you have overridden the `--cl-*` set, define them or the badge falls back to an
  unset colour.
- **Table's column-filter menu is tokenised.** It wrote `text-gray-500`, `text-gray-700` and
  three grey borders — Tailwind's palette in a component with tokens for all of them — which
  measured 4.02:1 and 1.88:1 on the dark panel.
- **Slider's value tooltip and DatePicker's marker tooltip write `--cl-text`,** not
  `text-white`. Their background is the panel token, which is white in the light theme, so
  the label was invisible there.
- **DatePicker's focused trigger draws the same border in both themes.** Dark used a
  different colour from light for the same state, so a trigger that read as focused on one
  theme read as merely hovered on the other.
- **Accordion's `flush` variant uses the same hover surface in both themes,** for the same
  reason.
- **Table's search box is one token on mobile and desktop.** The two breakpoints had
  drifted onto different background tokens, so the control changed colour when the viewport
  crossed `sm`.
- **ArrowUp opens a closed surface on SearchableDropdown, MultiSelectSearchableDropdown and
  TimePicker.** ArrowDown already did; these three ignored ArrowUp entirely. It now opens
  the surface and highlights the last option, matching the other six.
- **Space on the trigger commits the highlighted option.** ARIA treats Space as a selection
  key on a listbox or menu, and several surfaces ignored it. TimePicker opts out
  deliberately, because its trigger is itself a text input where Space has to stay a space.
  A search field inside a surface keeps its own key handling either way — this is the
  trigger only.
- **OtpInput filters typed characters against `pattern` by default.** `pattern` is
  form-validation metadata that browsers do not apply to typing, so a default OtpInput told
  the browser, the soft keyboard and the screen reader that it wanted digits and then
  accepted letters. `validate` is now derived from the same pattern when you do not supply
  one; an explicit `validate` still wins.
- **`reduceMotion={false}` animates even when the OS asks for reduced motion.** The prop
  used to be a floor that `prefers-reduced-motion` could override; it is now an explicit
  instruction in both directions. Omit the prop — the default — to keep following the OS.
- **`overlayOpacity` on `Modal` and `Drawer` is the tint's strength, not the overlay's
  opacity.** It used to be applied as the overlay element's CSS `opacity`, which composites
  the element's backdrop blur back against the unblurred page — at the default 0.32, two
  thirds of the sharp page showed through, and the blur (Modal's default `backdrop-blur-sm`,
  Drawer's `overlayBlur`) read as not working. It is now the alpha of `overlayColor` on the
  overlay's background, and the element stays fully opaque once open. Measured as detail
  remaining behind a default Modal: 1.414 before, 0.082 after, against 2.999 with no overlay.
  The same number gives the same tint over a plain background, so most overlays look
  unchanged; over detailed content the page is now actually blurred. If you read the
  overlay's `style.opacity` to find the prop's value, read its `background-color` alpha
  instead.

- `getDefaultStorageConfig()` (exported from `@chumlab/ui/accordion`) no longer returns a
  `storage` handle. It ran inside a `useMemo`, so reaching for `window.localStorage` there was
  a render-time branch on the environment; the default storage is resolved when a value is
  actually read or written. Passing your own `storage` in a `StorageConfig` is unchanged.

#### API names for 0.1.0

The last pass before publishing made the API consistent with itself: 145 props, 17
`classes` slots and 10 ref targets were renamed or moved to twelve conventions, written down
in `docs/adr/008-api-conventions.md`. Nothing was published under the old names, so there are
no aliases and no deprecation warnings: each old name below is simply gone, and
`api-names.contract` fails if one comes back. If you built against a branch, rename as the
tables say.

- **Callbacks that answer a native event now pass it.** `onFocus` and `onBlur` on the five
  dropdowns, and `onBlur` on `TimePicker`, receive the `FocusEvent`; `onStartIconClick` and
  `onEndIconClick` on `Input` and `TextArea` receive the `MouseEvent`; `Avatar`'s `onLoad`
  and `onError` receive the image's own event. They were called with no argument.
- **`Toast` has one dismiss callback, `onDismiss(id)`.** `onRemove(id)` and `onDismiss()`
  were two names for closing a toast.
- **`Table`'s `onPinnedColumnsChange` receives the whole new `pinnedColumns` array**, with the
  column added or removed; `onPinColumn(columnId)` left the consumer to rebuild it.
- **The loaders' `speed` (seconds) is `animationDuration` (milliseconds).** Defaults convert
  exactly: `CircularLoader` 750, `LinearLoader` 1500, `DotLoader` 1400, `PulseLoader` 1500.
  The CSS custom property is `--loader-duration`, not `--loader-speed`.
- **`keepMounted` takes `boolean | "visited"` on `AccordionContent` (default `"visited"`) and
  `TabPanel` (default `false`):** `true` keeps the content mounted always, `false` unmounts
  it when closed, `"visited"` mounts it on first open and keeps it. Every other
  `keepMounted` stays a boolean.
- **Icon props are camelCase and take a `ReactNode`, rendered as given.** Where the glyph
  itself changes with state, the prop is a render function of that state:
  `renderExpandIcon`, `renderFilterIcon` and `renderCheckboxIcon` on `Table`. `Pagination`'s
  `prevIcon`, `nextIcon` and `dropdownIcon`, `Stepper`'s `completedIcon` and `errorIcon` and
  each step's `icon`, `completedIcon` and `errorIcon`, and `Breadcrumb`'s `ellipsisIcon` take
  a `ReactNode` only; none takes a component any more.
- **Refs land on the element a keyboard user operates**, so `ref.current.focus()` focuses the
  field and a form library can focus it on an error. `Dropdown`, `SearchableDropdown`,
  `MultiSelectDropdown`, `MultiSelectSearchableDropdown`, `CascadingDropdown` and
  `DatePicker`: the trigger `<button>` (with `renderTrigger`, the element you attach
  `triggerProps.ref` to). `TimePicker`: its trigger `<input>`. `Slider`: the thumb, the first
  one on a range slider. `ResizablePanel`: the separator. `RadioButton`: its
  `<input type="radio">`. Each ref was the root element before (`RadioButton`'s, the
  `<label>`).
- **`id` and ARIA reach the primary control.** This breaks anything that selects
  `#<id>-trigger`:
  - On the five dropdowns, `id` is the trigger's own id. It used to become
    `` `${id}-trigger` `` on the trigger, and no element carried the id you passed.
  - `DatePicker` puts `id`, `aria-label`, `aria-labelledby` and `aria-describedby` on its
    trigger `<button>`, and `TimePicker` on its `<input>`. Both spread them onto the root
    `<div>`.
  - The five dropdowns take `aria-labelledby` and `aria-describedby` and put them on the
    trigger. A consumer's `aria-labelledby` wins over `label` and `aria-label`, as it does on a
    native control. A consumer's `aria-describedby` is joined with the component's own error
    and description ids, not replaced by them.
  - `Slider`'s `id` names the first thumb, and `<label for>` follows it.
  - `ResizablePanel`'s `id` names the separator; the panel keeps a generated id that the
    separator's `aria-controls` points at.
  - `CascadingDropdown`'s `classes.root` styles the root element, where `className` lands,
    and `classes.control` the box around the trigger. They were swapped. Both default to
    `relative`, so only an override moves.
- **`Toast`'s `dismissOnEscape` is `closeOnEscape`**, the name `Modal` and `Drawer` already
  used. A standalone `Toast` defaults to `false`; `ToastProvider` defaults to `true` and sets it
  on the newest toast only.
- **`renderTrigger` takes `(triggerProps, state)`** on `Dropdown`, `SearchableDropdown`,
  `MultiSelectDropdown`, `MultiSelectSearchableDropdown` and `CascadingDropdown`.
  `triggerProps` is exactly what the default trigger puts on its element: spread it onto
  yours. The state you draw from (`isOpen`, the selection, `placeholder`) arrives as the
  second argument. It used to sit inside the first, where spreading it put stray attributes
  on the DOM.
- **`TimePicker` is `clearable` by default**, matching `DatePicker`. Pass `clearable={false}`
  for the old behaviour.

##### Accordion

| Old | New | Note |
|---|---|---|
| `onExpandedChange` | `onValueChange` | `onValueChange(value)`, value first; AccordionItem keeps its own `onExpandedChange(expanded)` |
| `AccordionExpandEvent` | — | type removed; `onValueChange` reports the same change |
| `type` | `selectionMode` |  |
| `AccordionType` | `AccordionSelectionMode` | type |
| `data-type` | `data-selection-mode` | data attribute |

##### AccordionContent

| Old | New | Note |
|---|---|---|
| `forceMount` | `keepMounted` | `keepMounted: boolean \| "visited"`, default `"visited"` |
| `unmountOnClose` | `keepMounted` | `unmountOnClose` ≡ `keepMounted={false}` |

##### AccordionTrigger

| Old | New | Note |
|---|---|---|
| `iconPosition="left" \| "right"` | `iconPosition="start" \| "end" \| "none"` | values |

##### AvatarGroup

| Old | New | Note |
|---|---|---|
| `variant` | `layout` |  |
| `GroupVariant` | `AvatarGroupLayout` | type |
| `max` | `maxVisible` |  |

##### Breadcrumb

| Old | New | Note |
|---|---|---|
| `maxVisibleItems` | `maxVisible` |  |
| `dropdownPosition` | `dropdownSide` |  |
| `tooltipPosition` | `tooltipSide` |  |
| `DropdownPosition` | `DropdownSide` | type |
| `separatorIcon` | `separator` | `separator` takes text or an icon |
| `items[].iconPosition: "left" \| "right"` | `items[].iconPosition: "start" \| "end"` | values |

##### Button

| Old | New | Note |
|---|---|---|
| `loadingText` | `loadingContent` |  |
| `loaderPosition="left" \| "right"` | `loaderPosition="start" \| "end"` | values |

##### CascadingDropdown

| Old | New | Note |
|---|---|---|
| `onLoadChildren` | `loadChildren` |  |
| `onMenuSearch` | `searchMenu` |  |
| `onSubmenuSearch` | `searchSubmenu` |  |
| `noResultsContent` | `emptyContent` |  |
| `searchDebounceMs` | `searchDebounce` |  |
| `dropdownPosition` | `dropdownSide` |  |
| `submenuPosition` | `submenuSide` |  |
| `dropdownGap` | `dropdownOffset` |  |
| `loadingText` | `loadingContent` |  |
| `ClearIcon` | `clearIcon` | a `ReactNode`, rendered as given |
| `SearchIcon` | `searchIcon` | a `ReactNode`, rendered as given |

##### Checkbox

| Old | New | Note |
|---|---|---|
| `onValueChange` | `onCheckedChange` | receives the new `checked` |
| `classes.labelGroup` | `classes.group` | slot |

##### CircularLoader

| Old | New | Note |
|---|---|---|
| `speed` | `animationDuration` | seconds → milliseconds; default 750 |

##### CountryFlagGroup

| Old | New | Note |
|---|---|---|
| `max` | `maxVisible` |  |

##### DatePicker

| Old | New | Note |
|---|---|---|
| `mode` | `selectionMode` |  |
| `DatePickerMode` | `DatePickerSelectionMode` | type |
| `dropdownPosition` | `dropdownSide` |  |
| `forceDropdownPosition` | `forceDropdownSide` |  |
| `dropdownGap` | `dropdownOffset` |  |
| `classes.navButton` | `classes.navTrigger` | slot |

##### DotLoader

| Old | New | Note |
|---|---|---|
| `dotSize` | `size` |  |
| `speed` | `animationDuration` | seconds → milliseconds; default 1400 |

##### Drawer

| Old | New | Note |
|---|---|---|
| `activeSnapPointIndex` | `snapPointIndex` | pairs with `onSnapPointIndexChange` |
| `duration` | `animationDuration` | milliseconds; Toast's `duration` (display time) is unchanged |
| `direction` | `side` | values unchanged: `left`, `right`, `top`, `bottom`; `data-direction` → `data-side` |
| `DrawerDirection` | `DrawerSide` | type |

##### Dropdown

| Old | New | Note |
|---|---|---|
| `onLoadOptions` | `loadOptions` | a loader returns data, so it takes no `on` |
| `noResultsContent` | `emptyContent` |  |
| `dropdownPosition` | `dropdownSide` |  |
| `forceDropdownPosition` | `forceDropdownSide` |  |
| `dropdownGap` | `dropdownOffset` |  |
| `loadingText` | `loadingContent` |  |
| `ClearIcon` | `clearIcon` | a `ReactNode`, rendered as given |
| `ChevronIcon` | `chevronIcon` | a `ReactNode`, rendered as given |
| `CheckIcon` | `selectedIcon` | folded into the existing `selectedIcon` |

##### Input

| Old | New | Note |
|---|---|---|
| `startIconLabel` | `startIconAriaLabel` |  |
| `endIconLabel` | `endIconAriaLabel` |  |

##### InternationalPhoneInput

| Old | New | Note |
|---|---|---|
| `onPasteDetected` | `onPasteDetect` |  |
| `enablePasteDetection` | `pasteDetection` |  |
| `dropdownPosition` | `dropdownSide` |  |
| `forceDropdownPosition` | `forceDropdownSide` |  |
| `dropdownGap` | `dropdownOffset` |  |

##### LinearLoader

| Old | New | Note |
|---|---|---|
| `speed` | `animationDuration` | seconds → milliseconds; default 1500 |

##### Modal

| Old | New | Note |
|---|---|---|
| `disableAnimation` | `reduceMotion` | folded into the existing `reduceMotion: boolean \| "auto"` |
| `preventOutsideClick` | `closeOnOverlayClick` | inverted; default `true` |

##### MultiSelectDropdown

| Old | New | Note |
|---|---|---|
| `onLoadOptions` | `loadOptions` | a loader returns data, so it takes no `on` |
| `noResultsContent` | `emptyContent` |  |
| `maxDisplayedChips` | `maxVisible` |  |
| `dropdownPosition` | `dropdownSide` |  |
| `forceDropdownPosition` | `forceDropdownSide` |  |
| `dropdownGap` | `dropdownOffset` |  |
| `loadingText` | `loadingContent` |  |
| `ClearIcon` | `clearIcon` | a `ReactNode`, rendered as given |
| `ChevronIcon` | `chevronIcon` | a `ReactNode`, rendered as given |
| `classes.chipRemove` | `classes.chipRemoveTrigger` | slot |
| `classes.loadingIcon` | `classes.loadingItemControl` | the skeleton row's square, standing in for `itemControl` |

##### MultiSelectSearchableDropdown

| Old | New | Note |
|---|---|---|
| `onLoadInitialOptions` | `loadInitialOptions` |  |
| `onSearch` | `searchOptions` |  |
| `noResultsContent` | `emptyContent` |  |
| `maxDisplayedChips` | `maxVisible` |  |
| `searchDebounceMs` | `searchDebounce` |  |
| `dropdownPosition` | `dropdownSide` |  |
| `forceDropdownPosition` | `forceDropdownSide` |  |
| `dropdownGap` | `dropdownOffset` |  |
| `loadingText` | `loadingContent` |  |
| `ClearIcon` | `clearIcon` | a `ReactNode`, rendered as given |
| `classes.chipRemove` | `classes.chipRemoveTrigger` | slot |

##### Pagination

| Old | New | Note |
|---|---|---|
| `showLabel` | `rowsPerPagePrefix` | the visible text before the rows-per-page control |
| `rowsPerPageLabel` | `rowsPerPageSuffix` | the visible text after it |
| `dropdownPosition` | `dropdownSide` |  |
| `dropdownGap` | `dropdownOffset` |  |
| `classes.navButton` | `classes.navTrigger` | slot |

##### PulseLoader

| Old | New | Note |
|---|---|---|
| `speed` | `animationDuration` | seconds → milliseconds; default 1500 |

##### SearchableDropdown

| Old | New | Note |
|---|---|---|
| `onLoadInitialOptions` | `loadInitialOptions` |  |
| `onSearch` | `searchOptions` |  |
| `noResultsContent` | `emptyContent` |  |
| `searchDebounceMs` | `searchDebounce` |  |
| `dropdownPosition` | `dropdownSide` |  |
| `forceDropdownPosition` | `forceDropdownSide` |  |
| `dropdownGap` | `dropdownOffset` |  |
| `loadingText` | `loadingContent` |  |
| `ClearIcon` | `clearIcon` | a `ReactNode`, rendered as given |
| `SearchIcon` | `searchIcon` | a `ReactNode`, rendered as given |
| `ChevronIcon` | `chevronIcon` | a `ReactNode`, rendered as given |
| `CheckIcon` | `selectedIcon` | folded into the existing `selectedIcon` |

##### Slider

| Old | New | Note |
|---|---|---|
| `transitionDuration` | `animationDuration` |  |
| `classes.valueText` | `classes.value` | slot |
| `classes.marker` | `classes.mark` | slot |

##### Stepper

| Old | New | Note |
|---|---|---|
| `labelPosition="right"` | `labelPosition="end" \| "bottom"` | values |

##### Switch

| Old | New | Note |
|---|---|---|
| `onValueChange` | `onCheckedChange` | receives the new `checked`; `value` stays form data |
| `transitionDuration` | `animationDuration` |  |
| `classes.labelGroup` | `classes.group` | slot |

##### TabPanel

| Old | New | Note |
|---|---|---|
| `tooltipPosition` | `tooltipSide` |  |
| `forceMount` | `keepMounted` | folded into `keepMounted`, which gains `"visited"`; default `false` |
| `iconPosition="left" \| "right"` | `iconPosition="start" \| "end"` | values |

##### Table

| Old | New | Note |
|---|---|---|
| `onSelectionChange` | `onSelectedRowIdsChange` |  |
| `onExpandedChange` | `onExpandedRowIdsChange` | receives the expanded row ids |
| `onPinColumn` | `onPinnedColumnsChange` | receives the whole new `pinnedColumns` array, not one id and a flag |
| `isPopupOpen` | `popupOpen` |  |
| `onCursorPosition` | `onCursorPositionChange` |  |
| `onCursorOverHeader` | `onHeaderHoverChange` |  |
| `isFloatingActionsHovered` | `floatingActionsHovered` |  |
| `enableColumnFilters` | `filterable` |  |
| `enableColumnResizing` | `resizable` |  |
| `enableRowDragDrop` | `reorderable` |  |
| `enableCopyOnClick` | `copyOnClick` |  |
| `enableInfiniteScroll` | `infiniteScroll` |  |
| `density` | `size` | `compact`/`comfortable`/`spacious` → `sm`/`md`/`lg` |
| `data-density` | `data-size` | data attribute |
| `ariaLabel` | `aria-label` | the native attribute, through rest props |
| `shimmerRowCount` | `shimmerCount` |  |
| `SearchIcon` | `searchIcon` | a `ReactNode`, rendered as given |
| `PinIcon` | `pinIcon` | a `ReactNode`, rendered as given |
| `PinnedIcon` | `pinnedIcon` | a `ReactNode`, rendered as given |
| `FilterIcon` | `renderFilterIcon` | `renderFilterIcon({ active, className })` |
| `ExpandIcon` | `renderExpandIcon` | `renderExpandIcon({ expanded, className })` |
| `CheckboxIcon` | `renderCheckboxIcon` | `renderCheckboxIcon({ checked, indeterminate, className })` |
| `DragHandleIcon` | `dragHandleIcon` | a `ReactNode`, rendered as given |
| `expandColumnPosition="left" \| "right"` | `expandColumnPosition="start" \| "end"` | values |
| `dragColumnPosition="left" \| "right"` | `dragColumnPosition="start" \| "end"` | values |
| `searchIconPosition="left" \| "right"` | `searchIconPosition="start" \| "end" \| "none"` | values |
| `size="compact" \| "comfortable" \| "spacious"` | `size="sm" \| "md" \| "lg"` | values |
| `classes.expandButton` | `classes.expandTrigger` | slot |
| `classes.filterButton` | `classes.filterTrigger` | slot |
| `classes.pinButton` | `classes.pinTrigger` | slot |

##### TextArea

| Old | New | Note |
|---|---|---|
| `startIconLabel` | `startIconAriaLabel` |  |
| `endIconLabel` | `endIconAriaLabel` |  |

##### TimePicker

| Old | New | Note |
|---|---|---|
| `variant` | `mode` |  |
| `TimePickerVariant` | `TimePickerMode` | type |
| `dropdownPosition` | `dropdownSide` |  |
| `forceDropdownPosition` | `forceDropdownSide` |  |
| `dropdownGap` | `dropdownOffset` |  |
| `okText` | `confirmText` |  |
| `classes.cancelButton` | `classes.cancelTrigger` | slot |
| `classes.confirmButton` | `classes.confirmTrigger` | slot |
| `classes.periodButton` | `classes.periodTrigger` | slot |

##### Toast

| Old | New | Note |
|---|---|---|
| `onRemove` | `onDismiss` | merged with the old `onDismiss()` into one `onDismiss(id)` |
| `type` | `variant` | also in `toast({ variant })` options |
| `ToastType` | `ToastVariant` | type |
| `data-toast-type` | `data-variant` | data attribute |
| `classes.indicator` | `classes.range` | the auto-dismiss progress fill |

##### ToastProvider

| Old | New | Note |
|---|---|---|
| `classes.indicator` | `classes.range` | the auto-dismiss progress fill |

##### Tooltip

| Old | New | Note |
|---|---|---|
| `disableHoverableContent` | `hoverableContent` | inverted; default `true` |

### Removed

- `showClearButton` on `DatePicker`. Use `clearable`, which defaults to `true`.
- `separatorIcon` on `Breadcrumb`. `separator` takes text or an icon, rendered as given.
- `CheckIcon` on `Dropdown` and `SearchableDropdown`. Use the existing `selectedIcon`.
- `Accordion`'s root `onExpandedChange(event)` and its `AccordionExpandEvent` type.
  `onValueChange(value)` reports the same change. `AccordionItem`'s own
  `onExpandedChange(expanded)` is unchanged.
- `onRemove` on `Toast`, merged into `onDismiss(id)`.
- `disableAnimation` on `Modal`, folded into `reduceMotion`.
- `forceMount` and `unmountOnClose` on `AccordionContent`, and `forceMount` on `TabPanel`,
  folded into `keepMounted`.

- `TabButton`, exported from `@chumlab/ui/tab-panel`. It could not be called: its props
  interface was never exported, and it needs `index`, `isActive`, `isTabbable` and
  `setTabRef` from `TabPanel`'s own roving-focus state plus the context `TabPanel`
  provides. Nobody could construct one, but it autocompleted, and a name you can reach
  and cannot use costs a reader more than it gives. `TabPanel` imports it by path;
  nothing else depended on the export. For custom tab rendering use the `renderTab`
  prop, which hands you the default element already wired.

- `MultiSelectDropdownOption`, exported from `@chumlab/ui/multi-select-dropdown`. Same
  reason: it requires `isSelected`, `isFocused`, `dropdownId`, `index`, `onToggle` and
  `onHover` — all owned by the parent — and `classes: Required<MultiSelectDropdownClasses>`,
  which asks a consumer to supply every slot. Options are passed through the `options`
  prop; rendering one yourself was never the API.

- `SelectedChip`, exported from `@chumlab/ui/multi-select-dropdown`. Needs `onRemove` and
  the same `Required<…>` classes bag. The library's own unit test was importing it through
  the public entry, which is how an unusable name kept looking usable; it imports by path
  now.

- `classes.markerTooltip` on `DatePicker`. The key was threaded through three hops and then
  dropped: `useMarkerTooltip` writes a literal class string and never read it, so a consumer
  setting it saw nothing. The tooltip itself is unchanged. `e2e/waived-keys.spec.ts` asserts
  both halves — the hover opens the tooltip, and the override does not reach it — so wiring
  it up later cannot happen without the key coming back.

- Six sub-components are no longer exported from the package root:
  `DropdownShimmer`, `SearchableDropdownShimmer`, `MultiSelectDropdownShimmer`,
  `TableShimmer`, `OtpInputLabel` and `ClockFace`. Each is rendered by its parent and was
  never usable standalone; a shimmer that is reachable on its own — `AccordionShimmer`,
  `AvatarShimmer`, `CountryFlagShimmer` — is still exported. The corresponding `*Props`
  types remain exported, because they still appear in their parent's public types.

### Fixed

- **A consumer's `id` and ARIA reached the wrong element on ten components.**
  - `RadioButton` rendered your `id` twice, on its `<label>` and its `<input>`, and put
    `aria-*` on the label. They go on the input now.
  - `DatePicker` and `TimePicker` put `aria-label`, `aria-labelledby` and `aria-describedby`
    on a `<div>` with no role, which no screen reader announces. `TimePicker` also put
    `aria-label` on both the `<div>` and its input. They go on the trigger now.
  - `Slider` put its description and error ids on the track's wrapper, so neither was read on
    the thumb. They go on the thumbs now.
  - `ResizablePanel` put `id` and `aria-*` on the panel, not the separator a keyboard user
    focuses.
  - `OtpInput` put `aria-*` on its root `<div>`, beside the `role="group"` that assistive tech
    announces. They go on the group now, and `aria-label` wins over `groupAriaLabel`.
  - `Input` and `TextArea` overwrote a consumer's `aria-describedby` with their own ids
    whenever they had any. The two are joined now.
  - The five dropdowns dropped `aria-labelledby` and `aria-describedby` entirely.

- **Three places read refs the way only one React major passes them.** The peer range is
  `^18.0.0 || ^19.0.0`, and React 18 keeps `ref` out of props. On 18, `CascadingDropdown`'s
  submenu anchored to a ref that never arrived, so it opened at 0,0 and never faded in — open
  in the DOM, invisible on screen — and `Tooltip asChild` dropped the ref you put on its
  child. On 19, `Button`, `Accordion` and `Avatar` `asChild` read the child's ref as
  `element.ref`, which still worked but logged a deprecation warning in development. The
  submenu item forwards its ref now, and every cloned child's ref is read by one helper that
  takes it from wherever the running React put it, without touching either warning. The
  consumer matrix opens a submenu and renders `asChild` with a consumer ref on every React
  major it runs; before this fix its React 18 app failed both.
- **Accent text on an accent tint clears AA.** Four sites wrote `--cl-accent` on
  `--cl-accent-bg`: `Pagination`'s selected page and its selected rows-per-page option, the
  chips in `MultiSelectDropdown` and `MultiSelectSearchableDropdown`, and `Table`'s selected
  filter item. Measured as painted in light, the page button was 4.31:1 and the other three
  4.4999:1 — under AA, which does not round. The last three passed every gate because each
  compared a ratio rounded to two decimals, and the selected rows-per-page option was never
  rendered by a fixture at all. The text is `--cl-accent-hover` now: 5.59:1 light / 8.17:1
  dark on the page button, and 5.83:1 / 7.66:1 on the option, the chips and the filter item.
  A highlighted or hovered selected option, and a chip's remove control on hover, deepen
  the tint to `--cl-accent-bg-hover` (5.43:1 / 6.91:1) rather than changing text colour.
- **Five controls had no focus indicator at all** — `outline-none` with nothing in its place:
  `InternationalPhoneInput`'s country trigger, and the search inputs of `CascadingDropdown`,
  `SearchableDropdown`, `MultiSelectSearchableDropdown` and `InternationalPhoneInput`. All
  five carry the library's standard ring now. Found by asserting, rather than counting, that
  every focusable element in every fixture shows one.
- **`Table`'s infinite-scroll labels** were `text-gray-400` and `text-gray-500` — a fixed grey
  that cannot follow the theme, at 2.54:1 in light. They are `--cl-text-tertiary`, carried by
  the `loadingFooter` slot so `unstyled` and `classes` can both reach them, and a fixture
  renders the end-of-list state for the first time.
- **Focus indicators are visible in dark.** The focus ring on `Input`, `TextArea` and
  `InternationalPhoneInput` was softened to 30% in dark and measured 1.60:1 against the
  surface behind it; the focus border was softened to 50% and measured 2.54:1. WCAG SC 1.4.11
  asks for 3:1. Both are solid in both themes now, and the criterion is gated over every
  fixture — it was not among the ten this package measured, which is how this shipped.
- **`Table`'s search placeholder cleared AA in neither theme** — 2.54:1 in light, 3.04:1 in
  dark. The painted-contrast sweep reads an element's `color` and a placeholder is painted by
  `::placeholder`, so nothing could see it. It reads both now.
- **`Table`'s loading shimmer painted nothing.** Its gradient was written on `--fg`, the
  marketing surface's namespace, which the package does not ship: the class reached the
  bundle and no rule for it existed in `styles.css`. It uses the same token the other three
  shimmers do.
- **`MultiSelectSearchableDropdown`'s search bar was invisible in dark**, painting the panel
  colour onto the panel.
- Slider's range, TabPanel's active indicator and TimePicker's clock hand were softened to
  30% of the accent in dark — 1.65:1 against what they sit on, where a meaningful graphical
  object needs 3:1. They are solid in both themes; they are brighter in dark than they were.
- **Server-rendered applications hydrate without a mismatch.** Every portalled surface —
  `Modal`, `Drawer`, `Toast`, and the nine components that portal through the shared menu
  surface — decided where to portal *during render*, behind a `typeof window` branch, so a
  server rendered nothing and the first client render added a subtree the server never sent.
  React reported it as a hydration error (#418) in Next's App Router, Next's Pages Router and
  React Router 7. `Toast` failed on every page that mounted a `ToastProvider`; the rest failed
  as soon as they were open at first paint, or kept mounted while closed. A portal is now
  absent from the server HTML *and* from the first client render, and appears on the render
  after. `Tooltip` had a quieter version of the same thing: the server shipped the tip inline
  and the client silently relocated it — with `portal` set it now renders nothing until the
  portal target exists, so the server HTML and the first client render agree and the tip
  appears afterwards. See `docs/adr/003-ssr-hydration.md`.
- `Table` no longer seeds its viewport width from `window.innerWidth` during render, which
  rendered cards on a server and a table on the client (or the reverse) whenever
  `responsiveBreakpoint` and `renderMobileCard` were set.
- `Accordion` reads its stored expansion after mount rather than in a state initializer, so a
  page with a `storageKey` and a stored value hydrates cleanly. The stored value is still
  restored, one render later, and the write-back waits for the read so the default it is about
  to replace is not written over it.
- Types resolve under `moduleResolution: node16` as well as `bundler`. The published
  declarations imported relative paths without file extensions, which node16 does not
  resolve, and `attw` reported 240 such imports.
- CommonJS consumers get CommonJS declarations. `"type": "module"` made every `.d.ts` an
  ES module while `require` resolved to `.cjs`, so the types described the wrong shape for
  all 32 entrypoints.
- Floating surfaces re-anchor when a web font finishes loading. Position is measured from
  the trigger's box when the surface opens, and a font that lands after that re-lays out the
  page around a trigger whose size has not changed — which a `ResizeObserver` cannot see. On
  a consumer's first paint, every dropdown, menu, calendar and tooltip could sit up to a
  couple of pixels beside its trigger until the next scroll or resize.
- Escape closes a Dropdown from anywhere inside it, not only from the trigger.
- Focus reaches the surface on open, on every open rather than the first.
