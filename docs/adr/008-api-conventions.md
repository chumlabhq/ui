# ADR 008 — API conventions

**Status:** Accepted and applied (A2a–A2e).
**Date:** 2026-10-11
**Related:** ADR 002 (classes key vocabulary), ADR 001 (`unstyled`)
**Gated by:** `src/__tests__/contracts/api-conventions.contract.test.ts` (the
rules readable off the types), `api-names.contract.test.ts` (the old names,
tombstoned), `refs.contract.test.tsx` (rule 11),
`prop-routing.contract.test.tsx` (the routing rules below).

Numbered 008, not 007: 007 is the dark-variant endpoint.

## Why

The public surface is 1,320 own props on 106 exports, as the conventions
contract walks it (`api-conventions.contract.test.ts`, 2026-10-11, after A2f
declared the attributes it routes). The A1 audit found 145 props that broke a
convention the rest of the library already followed, plus 17 slot names and 10
ref targets. A2a–A2d renamed every one. Nothing is published, so each rename
replaced the old name outright: no aliases, no deprecations. This records the
conventions themselves, so the next prop is held to them rather than to
whichever neighbour its author read last.

## The twelve rules

1. **`value` / `defaultValue` / `onValueChange(value)`** for a component's value.
   The callback receives the value first.
2. **`checked` / `defaultChecked` / `onCheckedChange(checked)`** for a toggle
   (Checkbox, Switch).
3. **`open` / `defaultOpen` / `onOpenChange(open)`** for anything that opens.
4. **`onChange` only forwards the native event.** No component declares its own
   `onChange`; Input and TextArea pass the native one through.
5. **Callbacks are `on<Subject><Event>`**, value first unless they forward a
   native event, which they pass whole (`onFocus(event)`, `onLoad(event)`). A
   prop that returns data is a loader, not an event, and has no `on`:
   `loadOptions`, `loadChildren`, `searchOptions`, `searchMenu`. A controlled
   state's callback is `on<State>Change` (`onSelectedRowIdsChange`,
   `onPinnedColumnsChange`, which hands back the whole new array).
6. **Booleans are plain adjectives**: `filterable`, `resizable`, `reorderable`,
   never `is…`, `has…`, `enable…`, `disable…`. `show<Part>` defaults to false
   where it can; the 32 `show*` props that show a part users expect stay true.
7. **Field vocabulary:** `label` (visible text), `description`, `error` with
   `errorMessage`, `success` with `successMessage`. An accessible name that is
   not visible is `…AriaLabel`.
8. **`size` is the shared scale** (`xs`, `sm`, `md`, `lg`, `xl`, `2xl`; a
   component takes a subset). **`variant` is visual style only**: a selection
   behaviour is `selectionMode`, an interaction mode is `mode`, an arrangement
   is `layout`. **Horizontal placement is `start` / `end`**, never
   `left` / `right`, so it flips in RTL.
9. **`className` lands on the root; `classes` names the parts**, from one shared
   vocabulary (below). A clickable part is a `…Trigger`.
10. **Icon and render props are camelCase.** An icon is a `ReactNode`, rendered
    as given; where the glyph itself changes with state it is a render function
    of that state (`renderExpandIcon({ expanded, className })`). Never a
    component type.
11. **A ref lands on the element a keyboard user operates**: the trigger of the
    five dropdowns and both pickers, Slider's first thumb, ResizablePanel's
    separator, RadioButton's input. A container's ref is its root.
12. **One concept, one name.** `emptyContent`, `maxVisible`, `searchDebounce`
    (ms), `animationDuration` (ms, every animation), `<part>Side`,
    `<part>Offset`, `keepMounted`, `closeOnOverlayClick`, `shimmerCount`.
    `…Content` takes a ReactNode, `…Text` a string.

### Corrections made while applying them

These supersede the A1 proposals where they differ.

- **Pagination:** `showLabel` → `rowsPerPagePrefix`, `rowsPerPageLabel` →
  `rowsPerPageSuffix` (`rowsPerPageLabel` was already taken). A2b.
- **`keepMounted`** is `boolean | "visited"` on AccordionContent (default
  `"visited"`) and TabPanel (default `false`): `true` always mounted, `false`
  unmounted when closed, `"visited"` mounted on first open and kept. Every other
  component keeps a plain boolean. A2c.
- **Modal** `disableAnimation` folded into the existing
  `reduceMotion: boolean | "auto"`. A2b.
- **AvatarBadge `soft`** kept: it measured as a different treatment from
  `ghost`. A2b.
- **Icons:** Table's `renderExpandIcon`, `renderFilterIcon` and
  `renderCheckboxIcon` are render functions; every other icon prop is a
  `ReactNode`. Pagination's `dropdownIcon` is a `ReactNode` whose rotation never
  applied (a finding for L12). A2c.
- **MultiSelectDropdown `loadingIcon`** → `loadingItemControl`, not `loading`,
  which is the skeleton container. A2d.
- **Breadcrumb `iconPosition`** `"left" | "right"` → `"start" | "end"`. A2c.
- **Breadcrumb `separatorIcon`** removed: `separator` takes text or an icon.
  A2e.

## The shared slot vocabulary

127 names, read from every `classes` key after A2d (435 entries on 40 exports;
153 names counted by their nested path). The list lives in
`api-conventions.contract.test.ts` as `SLOT_VOCABULARY`; that copy is the gate,
and a new slot is added there in the commit that adds it, where a reviewer sees
it beside the names it could have been.

The decisions that shaped it:

| Concept | Name | Not |
|---|---|---|
| A clickable part | `…Trigger` (`trigger`, `clearTrigger`, `closeTrigger`, `navTrigger`, `periodTrigger`, `chipRemoveTrigger`, …) | `…Button`, `chipRemove` |
| The filled part of a track | `range` (Slider, the loaders, Toast's progress) | `indicator` |
| The current-value text | `value` | `valueText` |
| A Slider tick | `mark` (beside `markLabel`) | `marker` |
| Label and description together | `group` | `labelGroup` |
| The active-tab underline | `indicator` (TabPanel only) | — |
| Placement layer vs surface | `positioner` and `content`, both kept | — |
| A skeleton's stand-in for a row control | `loadingItemControl` | `loadingIcon` |

## Routing

Held at runtime for every component export by `prop-routing.contract`:

- **`className`, `style` and `classes.root` land on one element, the root.**
  A slot is named for what it styles.
- **`id`, `aria-label`, `aria-labelledby` and `aria-describedby` land on the
  primary control**, the ref target from rule 11, and on no other element. A
  consumer's `aria-describedby` comes first and is joined with the component's
  own description and error ids, never replacing them; a consumer's
  `aria-labelledby` wins over `label`, `title` and `aria-label`, as it does on a
  native control. The contract reads the computed name and description, not
  where an attribute sits.
- **A component whose root has no role** (a generic `div` or `span`) forwards
  `id`, `aria-label`, `aria-labelledby` and `aria-describedby` to the element
  the user focuses or operates, because a name on a `generic` is prohibited and
  a description on an element nobody focuses is read by nothing. AccordionItem
  forwards them to its trigger, and Tooltip to the child it wraps when that
  child takes focus; a Tooltip around text keeps them on its wrapper, which is
  then the focusable element.
- **A composite whose primary element is a group** (`group`, `radiogroup`,
  `tablist`) is named and described as the group; its members carry their own
  names.
- **`name` lands only on fields inside the component**: the control, a group's
  member inputs, or the hidden input that submits a custom control's value.
- **No id is rendered twice**, the consumer's or the component's own.

A2f fixed what A2e found. Modal's and Drawer's root is the outer fixed layer,
which carries the z-index: `className` and `style` land there with
`classes.root`, `classes.content` styles the dialog surface, and `id` and
`aria-*` land on the `role="dialog"` element. Checkbox, Input and TextArea take
`style` on the root with `className`, AccordionContent takes `className` on its
region, and Tooltip takes `style` on the trigger wrapper with `className`.
InternationalPhoneInput's group carries the name and the
consumer's description; its number input is named by `numberAriaLabel`
(default "Number"), so no label is announced twice. A2g applied the role-less
root rule to Tooltip and AccordionItem, and the precedence rule to Modal (its
`title` beat a consumer's `aria-labelledby`, its `description` replaced a
consumer's `aria-describedby`), Slider (`label` beat `aria-labelledby`), and
Checkbox, Switch and RadioGroup (a consumer's `aria-describedby` replaced their
description and error ids). L12 joined the five dropdowns' and DatePicker's
own `description` into their trigger's `aria-describedby` (consumer's first, then
the description, then the error), named Pagination's rows-per-page select by
its visible prefix and suffix, with its number as the value, and gave
DatePicker's `name` a field: hidden inputs carrying the ISO value. The routing
contract excuses nothing.

## Named exceptions ("doesn't fit")

Where a contract would otherwise fail on one, it is named there too, with this
reason, and goes stale when it stops applying; the rest trip no mechanical rule
and are recorded here for review.

| Export | Prop | Rule | Why |
|---|---|---|---|
| Table | `hasMore` | 6 | The infinite-scroll idiom; `more` alone does not read as a boolean. |
| Table | `hideVerticalScrollbar`, `hideHorizontalScrollbar` | 6 | `hide*` keeps the default false. |
| Stepper | `isStepClickable` | 6 | A predicate function, not a boolean. |
| AccordionItem | `value` | 1 | The item's identity inside Accordion's `value`. |
| AccordionItem | `onExpandedChange` | 1 | Notification only: the state is the parent's `value`. |
| RadioButton | `value` | 1 | The option's identity inside RadioGroup's `value`. |
| Switch | `value` | 1 | Form data submitted when checked; the state is `checked`. |
| Input, TextArea | `onValueChange` | 1 | `value`/`defaultValue` are the native attributes, passed through. |
| InternationalPhoneInput | `onCountryChange` | 1 | Notification only: `defaultCountry` seeds it, `value` carries it after. |
| DatePicker | `onMonthChange` | 1 | Notification only: the visible month is internal. |
| Breadcrumb | `onDropdownOpenChange` | 3 | Notification only: the overflow menu's state is internal. |
| Table | `onCursorPositionChange`, `onHeaderHoverChange` | 5 | Notification only: a pointer cannot be controlled. |
| Tooltip `side`; Breadcrumb and TabPanel `tooltipSide`; Breadcrumb `dropdownSide` | — | 8 | A floating layer's side of its anchor, one of four physical edges. |
| Drawer | `side` | 8 | The viewport edge the drawer enters from, physical by decision. |
| CascadingDropdown | `submenuSide` | 8 | **A defect, not a fit:** a submenu opens toward the inline end and should flip in RTL, so it wants `start` / `end`. Excused until it is fixed. |
| InternationalPhoneInput | `validationMessage` | 7 | The built-in validation's fallback text; the consumer's `errorMessage` wins. |
| CircularLoader, PulseLoader, Drawer | `size` | 8 | A number or a CSS length, not the scale. |
| Part sizes (`loaderSize`, `flagSize`, `iconSize`, `markDotSize`, …) | — | 8 | The size of a part in px. |
| AvatarBadge, AvatarGroupCount | `max` | 12 | A count cap (99+), not a visible-items cap. |
| Slider | `min`, `max` | 12 | Value bounds. |
| Toast | `duration` | 12 | Display time, not an animation. |
| `portalContainer`, `<part>ZIndex` | — | 12 | Consistent `<part>` prefixes where a component owns several layers. |
| Accordion | ref → `AccordionRef` | 11 | An imperative handle, by design. |
| Tooltip | ref → the trigger wrapper | 11 | The trigger is the consumer's child; the wrapper `<span>` around it is the element Tooltip owns, where `className` and `style` land. |
| InputLabel, TextAreaLabel, ToastProvider | no ref | 11 | No element of their own to ref. |

## What the contracts check, and what they leave to review

`api-conventions.contract` reads seven rules off the types: the boolean
prefixes (6), PascalCase props (10), a Promise-returning `on…` prop (5), a
`value`/`checked`/`open` without its pair or an `on<X>Change` with no `<x>`
(1–3), `left`/`right` on a `…Position` or side prop (8), a slot outside the
vocabulary (9) and a component-typed icon (10). Each proves it can fail against
a props type compiled in memory. The field vocabulary (7), the size scale (8),
and one name per concept (12) are judgement, and stay with review and this
document; routing and refs (9, 11) are held at runtime.
