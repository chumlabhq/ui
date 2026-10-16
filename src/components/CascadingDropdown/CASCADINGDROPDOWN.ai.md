# CascadingDropdown

> A multi-level dropdown menu with nested submenus. Supports single and multi-select per level, async data loading, and search with debounce.

**Category:** Form
**Keywords:** cascading dropdown, nested menu, multi-level select, submenu, hierarchical, category picker, tree select, async dropdown

---

## Quick Answer

Use `<CascadingDropdown options={[...]} />` for hierarchical data (categories → subcategories). Children can use `selectionMode: "single"` or `"multi"` independently. For async data, pass `loadChildren` to fetch children on hover. For search, set `showMenuSearch` and/or `showSubmenuSearch`.

---

## Import

```tsx
import { CascadingDropdown } from "@chumlab/ui/cascading-dropdown";
import type { CascadingOption, CascadingValue } from "@chumlab/ui/cascading-dropdown";
```

---

## Basic Usage (copy-paste ready)

```tsx
import { CascadingDropdown } from "@chumlab/ui/cascading-dropdown";
import type { CascadingOption, CascadingValue } from "@chumlab/ui/cascading-dropdown";
import { useState } from "react";

const options: CascadingOption[] = [
  {
    value: "electronics",
    label: "Electronics",
    children: [
      { value: "phones", label: "Phones" },
      { value: "laptops", label: "Laptops" },
    ],
  },
  {
    value: "clothing",
    label: "Clothing",
    children: [
      { value: "shirts", label: "Shirts" },
      { value: "pants", label: "Pants" },
    ],
  },
];

export default function Example() {
  const [value, setValue] = useState<CascadingValue>({});
  return (
    <CascadingDropdown
      options={options}
      value={value}
      onValueChange={setValue}
      placeholder="Select category..."
    />
  );
}
```

This renders correctly with built-in styles, dark mode, and keyboard navigation.

---

## Prop Constraints (critical for correct usage)

| Prop | Constraint |
|------|-----------|
| `selectionMode` on an option | Set on each `CascadingOption.children` parent. `"single"` = radio behavior, `"multi"` = checkbox. Defaults to `"single"`. |
| `loadChildren` | Only called when `option.hasChildren` is true and `option.children` is undefined. Must return `Promise<CascadingOption[]>`. |
| `searchMenu` | When provided, disables client-side menu filtering. You must return filtered results. |
| `searchSubmenu` | When provided, disables client-side submenu filtering. Receives `(query, parent)`. |
| `value` / `onValueChange` | Controlled mode. Shape: `{ parentValue: "childValue" }` for single, `{ parentValue: ["a","b"] }` for multi. |
| `defaultValue` | Uncontrolled mode. Cannot be used with `value`. |
| `closeOnSelect` | Defaults to `true`. Set `false` to keep menu open after selection (useful for multi-select). |
| `classes.subSearchControl` | Falls back to `searchControl` if not set. Same for `subSearchInput` and `subSearchIcon`. |

---

## Data Attributes (for CSS selectors and testing)

- `data-disabled` on trigger — when `disabled={true}`
- `data-error` on trigger — when `error={true}`
- `data-open` on trigger — when dropdown is open
- `role="menu"` on the dropdown menu container
- `role="menuitem"` on parent-level menu items
- `role="menuitemcheckbox"` on multi-select submenu items
- `role="menuitemradio"` on single-select submenu items
- `aria-expanded` on trigger and menu items with children
- `aria-checked` on submenu items

DOM nesting: `root > control > trigger + portal(menu > menuItem* + submenu > submenuItem*)`

---

## All Props

<!-- generated from CascadingDropdown.schema.json — edit the schema, not this table -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` **(required)** | array | `[]` | Top-level options for the dropdown. |
| `value` | object | — | Controlled selection value as { [parentValue]: string \| string[] }. |
| `defaultValue` | object | — | Initial selection value for uncontrolled usage. |
| `onValueChange` | object | — | (value: CascadingValue, path: CascadingOption[]) => void |
| `loadChildren` | object | — | (parent: CascadingOption) => Promise<CascadingOption[]> — Async child loader. |
| `onLoadError` | object | — | (error: unknown) => void — Called when async child loading fails. |
| `open` | boolean | — | Controlled open state. |
| `defaultOpen` | boolean | `false` | Initial open state for uncontrolled usage. |
| `onOpenChange` | object | — | (open: boolean) => void |
| `onBlur` | object | — | (event: FocusEvent<HTMLElement>) => void — Fires when the trigger loses focus, with the native focus event. |
| `onFocus` | object | — | (event: FocusEvent<HTMLElement>) => void — Fires when the trigger takes focus, with the native focus event. |
| `onKeyDown` | object | — | (event: React.KeyboardEvent) => void |
| `id` | string | — | HTML id attribute. |
| `name` | string | — | Form field name. |
| `placeholder` | object | `"Select an option"` | React.ReactNode — Placeholder content when no value is selected. |
| `disabled` | boolean | `false` | Disables the dropdown. |
| `error` | boolean | `false` | Displays error state. |
| `errorMessage` | object | — | React.ReactNode — Error message. |
| `label` | object | — | React.ReactNode — Label above the trigger. |
| `description` | object | — | React.ReactNode — Description text. |
| `success` | boolean | `false` | Displays success state. |
| `successMessage` | object | — | React.ReactNode — Success message. |
| `required` | boolean | `false` | Marks the field as required. |
| `emptyContent` | object | `"No options found"` | React.ReactNode — Content shown when no results match. |
| `loadingContent` | object | `"Loading..."` | React.ReactNode — Text shown during async loading. |
| `shimmerCount` | number | — | Number of shimmer placeholders during loading. |
| `loading` | boolean | — | Shows loading state. |
| `clearable` | boolean | `false` | Shows a clear button to reset the selection. |
| `showChevron` | boolean | `true` | Shows a chevron indicator on the trigger. |
| `showSelectedIcon` | boolean | `true` | Shows an icon on selected items. |
| `selectedIcon` | object | — | React.ReactNode — Custom icon for selected items. |
| `checkboxIcon` | object | — | React.ReactNode — Custom checkbox icon for multi-select. |
| `fullWidth` | boolean | `false` | Stretches the dropdown to fill its container width. |
| `submenuSide` | `"start"` \| `"end"` | `"end"` | The side submenus open on, logical: `"end"` is the right in a left-to-right page and the left in a right-to-left one, read from the closest `dir` attribute when the submenu opens, else the document's. RTL is not supported in 0.1.0; the values are logical so they need no rename when it is. |
| `dropdownSide` | `"top"` \| `"bottom"` | `"bottom"` | Vertical position of the dropdown. |
| `closeOnSelect` | boolean | `true` | Closes the dropdown after an item is selected. |
| `classes` | object | — | CSS class overrides for dropdown sub-elements. |
| `unstyled` | boolean | `false` | Removes all default styling. |
| `lockScroll` | boolean | `false` | Locks body scroll when the dropdown is open. |
| `portalContainer` | object | — | HTMLElement \| null — Portal container for the dropdown. |
| `dropdownZIndex` | number | `50` | Z-index of the dropdown. |
| `dropdownOffset` | number | `4` | Gap in pixels between trigger and dropdown. |
| `keepMounted` | boolean | `false` | Keep the dropdown DOM mounted when closed. |
| `className` | string | — | CSS class for the root element. |
| `style` | object | — | CSSProperties — Inline styles. |
| `clearIcon` | object | — | ReactNode — Replaces the clear button's glyph. Rendered as given. |
| `renderTrigger` | object | — | (triggerProps: CascadingDropdownTriggerRenderProps, state: CascadingDropdownTriggerState) => ReactNode - Custom render function for the trigger element. Spread triggerProps onto a <button>; draw from state (isOpen, displayValue, placeholder). |
| `showMenuSearch` | boolean | `false` | Show a search input inside the main menu. |
| `showSubmenuSearch` | boolean | `false` | Show a search input inside submenus. |
| `menuSearchPlaceholder` | string | `"Search..."` | Placeholder text for the main menu search input. |
| `submenuSearchPlaceholder` | string | `"Search..."` | Placeholder text for the submenu search input. |
| `searchMenu` | object | — | (query: string) => Promise<CascadingOption[]> — Async search for main menu. |
| `searchSubmenu` | object | — | (query: string, parent: CascadingOption) => Promise<CascadingOption[]> — Async search for submenu. |
| `searchDebounce` | number | `300` | Debounce delay in ms for async search callbacks. |
| `searchIcon` | object | — | ReactNode — Replaces the search field's magnifier. Rendered as given; `classes.searchIcon` styles the default one. |
| `menuSearchAriaLabel` | string | `"Search menu"` | Accessible label for the menu search input. |
| `submenuSearchAriaLabel` | string | `"Search submenu"` | Accessible label for the submenu search input. |
| `aria-label` | string | — | Accessible label for the dropdown. |

## Styling Guide

> **A plain utility replaces the library's for that property, in every state.**
> `classes={{ slot: "text-red-500" }}` drops the library's `hover:text-…` and
> `data-[state=…]:text-…` on that slot as well — otherwise they would sit beside
> your class and win in their own state, leaving your override in the DOM and
> inert. Pass your own variant to keep one: `"text-red-500 hover:text-red-400"`.
> A variant YOU pass is never dropped.

### How class merging works

1. **Default** (no classes, no unstyled) — uses `DEFAULT_CASCADINGDROPDOWN_CLASSES` with full dark mode
2. **Partial override** (`classes={{ trigger: "..." }}`) — REPLACES that slot only, others keep defaults

**A slot that carries states is replaced as a whole.** Several slots absorbed what were
separate per-state keys, so overriding one replaces its base styling *and* every state
variant on it. Write the base and all the states you want in one string — a one-state
override silently drops the rest.

3. **Unstyled** (`unstyled={true}`) — all slots empty, you provide everything

```tsx
// `item` carries the base AND 2 state variants. Overriding it
// replaces all of them, so write them together:
<CascadingDropdown
  classes={{
    item:
      "rounded-cl-md px-2 py-1 " +           // base
      "data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed " +
      "data-[highlighted]:bg-cl-bg-hover ",
  }}
/>

// Passing only `item: "data-[disabled]:…"` drops the base and the other
// 1 states.
```

### Slot → visual mapping

```
root
├── label
├── description
├── control
│   ├── trigger [icon, selectedContent]
│   └── clearTrigger
├── errorMessage / successMessage
└── portal
    ├── content
    │   ├── searchControl [searchIcon + searchInput]
    │   ├── item* [itemIcon]
    │   ├── empty
    │   ├── loading
    │   └── loading > loadingItem*
    └── subPositioner            (its own portal, anchored to the open item)
        └── subContent
            ├── subSearchControl [subSearchIcon + subSearchInput]
            └── subItem* [itemControl data-state=checked, itemIndicator]
```

**`subPositioner` changed meaning in 0.1.0.** It used to be an
`absolute left-full top-0` wrapper *inside* the menu item, so a consumer could
move the submenu by overriding it with their own offsets. It is now the root of
the submenu's own portal, positioned by `useAnchoredPosition` — the same
clamp-and-flip every other floating surface in the package uses. Positioning
utilities on this key no longer do anything: `top`, `left` and `position` are
inline styles, and inline wins. Everything else it carried still applies; the
default value (`z-[9999]`) is unchanged. Use `submenuSide` to choose a side:
`"end"` (the default) or `"start"`, logical, so `"end"` opens right in a
left-to-right page and left in a right-to-left one, read from the closest `dir`
attribute when the submenu opens. RTL is not supported in 0.1.0; the values are
logical so that supporting it later needs no rename. The physical side actually
used, after any flip, is on the element as `data-side`.

| "I want to change..." | Slot to use | Notes |
|------------------------|-------------|-------|
| Trigger button style | `trigger` | |
| Dropdown background | `content` | |
| Menu item hover | `item` | Uses hover: pseudo-class |
| Selected item highlight | `subItem` + `data-selected:` | The selected item is the same slot in a state |
| Focused item (keyboard) | `menuItemFocused` | Stacks on top of menuItem |
| Submenu panel | `subContent` | |
| Checkbox style | `itemControl` + `data-[state=checked]:` | The checked box is the same slot in a state |
| Search bar in menu | `searchControl`, `searchInput`, `searchIcon` | |
| Search bar in submenu | `subSearchControl` | Falls back to `searchControl` if empty |
| Loading state | `loading`, `loading`, `loadingItem` | |

### Dark mode

Defaults use Tailwind `dark:` prefix, activated by `<html class="dark">`. When overriding a slot, always provide both variants:

```tsx
classes={{
  trigger: "bg-white dark:bg-gray-900 text-black dark:text-white border-gray-200 dark:border-gray-700",
}}
```

### Styling via data attributes

```css
/* Style trigger when open */
[data-open] { border-color: blue; }

/* Style when in message state */
[data-error] { border-color: red; }
```

### Complete themed example

```tsx
<CascadingDropdown
  unstyled
  options={options}
  value={value}
  onValueChange={setValue}
  placeholder="Pick a category"
  classes={{
    control: "relative w-64",
    trigger: "flex items-center justify-between w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white hover:border-blue-400 focus:ring-2 focus:ring-blue-500",
    content: "mt-1 rounded-lg shadow-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 py-1",
    item: "px-3 py-2 cursor-pointer text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/30 flex items-center justify-between",
    subContent: "rounded-lg shadow-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 py-1",
    subItem: "px-3 py-2 cursor-pointer text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/30 flex items-center gap-2 data-selected:bg-blue-50 data-selected:text-blue-700 dark:data-selected:bg-blue-900/40 dark:data-selected:text-blue-300",
    itemControl: "w-4 h-4 rounded border border-gray-300 dark:border-gray-600 flex items-center justify-center data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 data-[state=checked]:text-white",
    icon: "w-4 h-4 text-gray-400",
  }}
/>
```

---

## Patterns

### Async data loading (fetch children on hover)

```tsx
const loadChildren = async (parent: CascadingOption) => {
  const res = await fetch(`/api/categories/${parent.value}/children`);
  return res.json();
};

<CascadingDropdown
  options={[
    { value: "electronics", label: "Electronics", hasChildren: true },
    { value: "clothing", label: "Clothing", hasChildren: true },
  ]}
  loadChildren={loadChildren}
  value={value}
  onValueChange={setValue}
/>
```

### Multi-select with mixed modes

```tsx
const options: CascadingOption[] = [
  {
    value: "colors",
    label: "Colors",
    selectionMode: "multi",
    children: [
      { value: "red", label: "Red" },
      { value: "blue", label: "Blue" },
    ],
  },
  {
    value: "size",
    label: "Size",
    selectionMode: "single",
    children: [
      { value: "sm", label: "Small" },
      { value: "lg", label: "Large" },
    ],
  },
];
```

### Async search with debounce

```tsx
const searchCountries = async (query: string) => {
  const res = await fetch(`/api/countries/search?q=${encodeURIComponent(query)}`);
  const { countries } = await res.json();
  return countries.map((c) => ({ value: c.code, label: c.name }));
};

<CascadingDropdown
  options={regions}
  showMenuSearch
  searchMenu={searchCountries}
  searchDebounce={300}
/>
```

### Controlled with form integration

```tsx
<CascadingDropdown
  name="category"
  label="Category"
  required
  error={!!errors.category}
  errorMessage={errors.category}
  options={options}
  value={value}
  onValueChange={setValue}
/>
```

---

## Forms

- **Submitted value.** With `name`, it submits one entry, the value object as JSON (`{"fruit":"a"}`), or `{}` when nothing is selected.
- **Reset.** A form reset — a `type="reset"` button or `form.reset()` — restores an uncontrolled selection to `defaultValue` (or `{}`), and the submitted value with it. Like a native input it fires no change callback: `onValueChange` is not called. A controlled CascadingDropdown is left alone: it keeps the `value` you pass and calls nothing, as a controlled React `<input>` does. Reset your own state in the form's `onReset` if you want the field cleared.
- **Required.** A `required` CascadingDropdown needs at least one selection: with none, it blocks the form's submit with the browser's own "fill out this field" message and moves focus to the trigger. The field shows an error state only when you pass `error` and `errorMessage`.
- **Disabled.** A disabled CascadingDropdown submits nothing, as a disabled native control doesn't.

## Keyboard Interactions

| Key | Behaviour |
|-----|-----------|
| `Enter`, `Space` | Opens the menu from the trigger, and selects the focused item. |
| `ArrowDown`, `ArrowUp` | Moves between items in the open menu. |
| `ArrowRight` | Opens the focused item's submenu and moves into it. `ArrowLeft` closes it and returns to the parent. |
| `Home`, `End` | Jumps to the first or last item of the current level. |
| `Escape` | Closes the deepest open menu and returns focus to its trigger. Always: there is no prop to turn it off, because the APG menu button pattern requires Escape to close the menu. |
| `Tab` | Closes the menu and moves focus on. |
| Printable characters | Type-ahead: jumps to the first item starting with what you typed. |

---

## Ref API

The ref lands on the trigger, the menu `<button>` a keyboard user tabs to, so `ref.current.focus()` focuses the field — which is what a form library calls on the first invalid field. With `renderTrigger`, it is the element your trigger attaches `triggerProps.ref` to.

```tsx
const ref = useRef<HTMLButtonElement>(null);
<CascadingDropdown ref={ref} options={options} />
// ref.current is the trigger <button>
```

## Accessibility

- `role="menu"` on dropdown container, `role="menuitem"` / `role="menuitemcheckbox"` / `role="menuitemradio"` on items
- Full keyboard navigation: Arrow keys, Enter, Space, Escape, Home, End
- `aria-expanded` on trigger and parent items with submenus
- `aria-checked` on selectable submenu items
- `aria-haspopup="true"` on trigger
- `aria-label` for search inputs (configurable via `menuSearchAriaLabel`, `submenuSearchAriaLabel`)
- Focus management: focus moves into menu on open, returns to trigger on close
- Hidden `<input>` for form integration with `name` prop

---

## Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| Submenu clipped/hidden | Parent has `overflow: hidden` | Menu renders in portal — check `portalContainer` and z-index |
| No submenu appears on hover | `children` is empty or undefined | Provide `children` or set `hasChildren: true` with `loadChildren` |
| Async children load every hover | Children not cached | Hook caches loaded children by parent value automatically |
| Search not calling API | `showMenuSearch` is true but no `searchMenu` | Without `searchMenu`, search is client-side filtering only |
| Stale search results | Race condition with fast typing | Built-in version tracking prevents stale results; increase `searchDebounce` if needed |
| Submenu search styling same as menu | `subSearchControl` not set | Set `subSearchControl`, `subSearchInput`, `subSearchIcon` for independent styles |
| Classes override doesn't work | Expected additive behavior | Classes REPLACE per slot, not merge. Provide full styling for overridden slots |
| Value shape wrong | Using string instead of object | Value must be `{ parentValue: "childValue" }` or `{ parentValue: ["a","b"] }` |

---

## Demo Reference

**File:** `src/pages/demo/CascadingDropdownDemo.tsx`

| Feature | Search for | What you'll find |
|---------|-----------|------------------|
| Minimal example | `title="Basic Usage"` | Static options, controlled state |
| Async single-select | `title="Async Single-Select (Countries API)"` | REST Countries API integration |
| Async multi-select | `title="Async Multi-Select (Countries API)"` | Multi-select with API |
| Client-side search | `title="Client-Side Search"` | showMenuSearch + showSubmenuSearch |
| Async search | `title="Async Server-Side Search (Debounced)"` | searchMenu + searchSubmenu with debounce |
| Custom search styling | `title="Custom Search Styling: Teal"` | Independent menu/submenu search styles |
| Custom checkbox | `title="Custom Checkbox - Green Rounded"` | `itemControl` with a `data-[state=checked]:` variant |
| Disabled options | `title="Disabled Options"` | Per-option disabled |

Source file index:

| File | Contains |
|------|----------|
| `CascadingDropdown.tsx` | Main component, portal, Submenu, MenuItem sub-components |
| `utils/useCascadingDropdown.ts` | State management hook, keyboard navigation, search logic |
| `utils/types.ts` | All TypeScript interfaces |
| `utils/constants.ts` | DEFAULT + UNSTYLED class constants |
| `utils/icons.tsx` | ChevronDown, ChevronRight, Check, Search, Clear icons |
| `index.ts` | Public exports |
