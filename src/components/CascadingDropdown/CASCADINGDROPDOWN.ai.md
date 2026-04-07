# CascadingDropdown

> A multi-level dropdown menu with nested submenus. Supports single and multi-select per level, async data loading, and search with debounce.

**Category:** Form
**Keywords:** cascading dropdown, nested menu, multi-level select, submenu, hierarchical, category picker, tree select, async dropdown

---

## Quick Answer

Use `<CascadingDropdown options={[...]} />` for hierarchical data (categories → subcategories). Children can use `selectionMode: "single"` or `"multi"` independently. For async data, pass `onLoadChildren` to fetch children on hover. For search, set `showMenuSearch` and/or `showSubmenuSearch`.

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
| `selectionMode` | Set on each `CascadingOption.children` parent. `"single"` = radio behavior, `"multi"` = checkbox. Defaults to `"single"`. |
| `onLoadChildren` | Only called when `option.hasChildren` is true and `option.children` is undefined. Must return `Promise<CascadingOption[]>`. |
| `onMenuSearch` | When provided, disables client-side menu filtering. You must return filtered results. |
| `onSubmenuSearch` | When provided, disables client-side submenu filtering. Receives `(query, parent)`. |
| `value` / `onValueChange` | Controlled mode. Shape: `{ parentValue: "childValue" }` for single, `{ parentValue: ["a","b"] }` for multi. |
| `defaultValue` | Uncontrolled mode. Cannot be used with `value`. |
| `closeOnSelect` | Defaults to `true`. Set `false` to keep menu open after selection (useful for multi-select). |
| `submenuSearchInput` | Falls back to `searchInput` if not set. Same for `submenuSearchInputElement` and `submenuSearchIcon`. |

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

DOM nesting: `root > wrapper > trigger + portal(menu > menuItem* + submenu > submenuItem*)`

---

## All Props

### CascadingDropdownProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `CascadingOption[]` | **required** | Array of top-level menu items with optional `children` |
| `value` | `CascadingValue` | — | Controlled value: `{ parentValue: "child" \| string[] }` |
| `defaultValue` | `CascadingValue` | — | Uncontrolled initial value |
| `onValueChange` | `(value, path) => void` | — | Called when selection changes |
| `onLoadChildren` | `(parent) => Promise<CascadingOption[]>` | — | Async loader for children on hover |
| `onLoadError` | `(error) => void` | — | Called when async child loading fails |
| `open` | `boolean` | — | Controlled open state |
| `defaultOpen` | `boolean` | — | Uncontrolled initial open state |
| `onOpenChange` | `(open) => void` | — | Called when dropdown opens/closes |
| `placeholder` | `ReactNode` | — | Trigger placeholder text |
| `disabled` | `boolean` | `false` | Disables the dropdown |
| `error` | `boolean` | `false` | Shows error state |
| `errorMessage` | `ReactNode` | — | Error message below trigger |
| `label` | `ReactNode` | — | Label above trigger |
| `description` | `ReactNode` | — | Description text above trigger |
| `success` | `boolean` | `false` | Shows success state |
| `successMessage` | `ReactNode` | — | Success message below trigger |
| `required` | `boolean` | `false` | Marks as required |
| `clearable` | `boolean` | `false` | Shows clear button |
| `showChevron` | `boolean` | `true` | Shows chevron on trigger |
| `submenuPosition` | `"right" \| "left"` | `"right"` | Submenu opens to right or left |
| `dropdownPosition` | `"top" \| "bottom"` | `"bottom"` | Dropdown opens above or below |
| `closeOnSelect` | `boolean` | `true` | Close on selection |
| `lockScroll` | `boolean` | `false` | Prevent page scroll when open |
| `fullWidth` | `boolean` | `false` | Trigger takes full width |
| `classes` | `CascadingDropdownClasses` | — | Per-slot class overrides |
| `unstyled` | `boolean` | `false` | Remove all default styles |
| `showMenuSearch` | `boolean` | `false` | Show search input in menu |
| `showSubmenuSearch` | `boolean` | `false` | Show search input in submenus |
| `onMenuSearch` | `(query) => Promise<CascadingOption[]>` | — | Async menu search callback |
| `onSubmenuSearch` | `(query, parent) => Promise<CascadingOption[]>` | — | Async submenu search callback |
| `searchDebounceMs` | `number` | `300` | Debounce delay for async search |
| `menuSearchPlaceholder` | `string` | — | Menu search placeholder |
| `submenuSearchPlaceholder` | `string` | — | Submenu search placeholder |
| `SearchIcon` | `ComponentType` | Built-in magnifier | Custom search icon |
| `ClearIcon` | `ComponentType` | Built-in X | Custom clear icon |
| `renderTrigger` | `(props) => ReactNode` | — | Custom trigger render function |
| `shimmerCount` | `number` | `5` | Number of shimmer items during loading (max 50) |
| `keepMounted` | `boolean` | `false` | Keep portal in DOM when closed |
| `portalContainer` | `HTMLElement \| null` | `document.body` | Portal render target |
| `dropdownZIndex` | `number` | — | z-index for dropdown portal |
| `dropdownGap` | `number` | — | Gap between trigger and dropdown |

### CascadingOption

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | **required** | Unique value identifier |
| `label` | `string` | **required** | Display text |
| `content` | `ReactNode` | — | Custom render for menu item |
| `selectedContent` | `ReactNode` | — | Custom render when selected (in trigger) |
| `disabled` | `boolean` | `false` | Disable this option |
| `children` | `CascadingOption[]` | — | Nested submenu options |
| `selectionMode` | `"single" \| "multi"` | `"single"` | Selection mode for this item's children |
| `hasChildren` | `boolean` | — | Hint for async: shows chevron, triggers onLoadChildren |

---

## Styling Guide

### How class merging works

1. **Default** (no classes, no unstyled) — uses `DEFAULT_CASCADINGDROPDOWN_CLASSES` with full dark mode
2. **Partial override** (`classes={{ trigger: "..." }}`) — REPLACES that slot only, others keep defaults
3. **Unstyled** (`unstyled={true}`) — all slots empty, you provide everything

### Slot → visual mapping

```
root
└── wrapper
    ├── label
    ├── description
    ├── trigger [chevron, clearIcon, selectedContent]
    ├── errorMessage / successMessage
    └── portal
        └── menu
            ├── searchInput [searchIcon + searchInputElement]
            ├── menuItem* [submenuChevron]
            │   └── submenuContainer
            │       └── submenu
            │           ├── submenuSearchInput [submenuSearchIcon + submenuSearchInputElement]
            │           └── submenuItem* [checkbox/checkboxChecked, checkIcon]
            ├── noResults
            ├── loading
            └── shimmer > shimmerItem*
```

| "I want to change..." | Slot to use | Notes |
|------------------------|-------------|-------|
| Trigger button style | `trigger` | |
| Dropdown background | `menu` | |
| Menu item hover | `menuItem` | Uses hover: pseudo-class |
| Selected item highlight | `menuItemSelected` | Stacks on top of menuItem |
| Focused item (keyboard) | `menuItemFocused` | Stacks on top of menuItem |
| Submenu panel | `submenu` | |
| Checkbox style | `checkbox` + `checkboxChecked` | checkboxChecked applied when checked |
| Search bar in menu | `searchInput`, `searchInputElement`, `searchIcon` | |
| Search bar in submenu | `submenuSearchInput` | Falls back to `searchInput` if empty |
| Loading state | `loading`, `shimmer`, `shimmerItem` | |

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

/* Style when in error state */
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
    wrapper: "relative w-64",
    trigger: "flex items-center justify-between w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white hover:border-blue-400 focus:ring-2 focus:ring-blue-500",
    menu: "mt-1 rounded-lg shadow-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 py-1",
    menuItem: "px-3 py-2 cursor-pointer text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/30 flex items-center justify-between",
    menuItemSelected: "bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300",
    submenu: "rounded-lg shadow-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 py-1",
    submenuItem: "px-3 py-2 cursor-pointer text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/30 flex items-center gap-2",
    checkbox: "w-4 h-4 rounded border border-gray-300 dark:border-gray-600 flex items-center justify-center",
    checkboxChecked: "bg-blue-600 border-blue-600 text-white",
    chevron: "w-4 h-4 text-gray-400",
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
  onLoadChildren={loadChildren}
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
  const res = await fetch(`https://restcountries.com/v3.1/name/${query}`);
  const data = await res.json();
  return data.map((c: any) => ({ value: c.cca2, label: c.name.common }));
};

<CascadingDropdown
  options={regions}
  showMenuSearch
  onMenuSearch={searchCountries}
  searchDebounceMs={300}
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
| No submenu appears on hover | `children` is empty or undefined | Provide `children` or set `hasChildren: true` with `onLoadChildren` |
| Async children load every hover | Children not cached | Hook caches loaded children by parent value automatically |
| Search not calling API | `showMenuSearch` is true but no `onMenuSearch` | Without `onMenuSearch`, search is client-side filtering only |
| Stale search results | Race condition with fast typing | Built-in version tracking prevents stale results; increase `searchDebounceMs` if needed |
| Submenu search styling same as menu | `submenuSearchInput` not set | Set `submenuSearchInput`, `submenuSearchInputElement`, `submenuSearchIcon` for independent styles |
| Classes override doesn't work | Expected additive behavior | Classes REPLACE per slot, not merge. Provide full styling for overridden slots |
| Value shape wrong | Using string instead of object | Value must be `{ parentValue: "childValue" }` or `{ parentValue: ["a","b"] }` |

---

## Demo Reference

**File:** `src/pages/demo/CascadingDropdownDemo.tsx`

| Feature | Search for | What you'll find |
|---------|-----------|------------------|
| Minimal example | `title="Basic Usage"` | Static options, controlled state |
| Async single-select | `title="Async Single-Select"` | REST Countries API integration |
| Async multi-select | `title="Async Multi-Select"` | Multi-select with API |
| Client-side search | `title="Client-Side Search"` | showMenuSearch + showSubmenuSearch |
| Async search | `title="Async Server-Side Search"` | onMenuSearch + onSubmenuSearch with debounce |
| Custom search styling | `title="Custom Search Styling"` | Independent menu/submenu search styles |
| Dark theme | `title="Dark Theme"` | Full class override |
| Custom checkbox | `title="Custom Checkbox"` | checkbox + checkboxChecked classes |
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
