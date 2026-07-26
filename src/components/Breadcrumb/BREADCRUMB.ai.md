# Breadcrumb

> A navigation trail showing the user's current location in a hierarchy. Supports truncation with a dropdown for collapsed items, custom separators, icons, links, tooltips, and full style customization.

**Category:** Navigation
**Keywords:** breadcrumb, navigation, trail, path, hierarchy, crumb, truncation

---

## Quick Answer

Pass an `items` array of `{ id, label }` objects. The last item is treated as the active page. Use `maxVisibleItems` to collapse long trails into a dropdown. Works out-of-the-box with zero configuration beyond `items`.

---

## Import

```tsx
import { Breadcrumb } from "@chumlab/ui/breadcrumb";
import type { BreadcrumbItem } from "@chumlab/ui/breadcrumb";
```

---

## Basic Usage (copy-paste ready)

```tsx
import { Breadcrumb } from "@chumlab/ui/breadcrumb";

export default function PageHeader() {
  return (
    <Breadcrumb
      items={[
        { id: "home", label: "Home" },
        { id: "products", label: "Products" },
        { id: "electronics", label: "Electronics" },
        { id: "phones", label: "Phones" },
      ]}
      onItemClick={(item) => console.log("Navigate to:", item.label)}
    />
  );
}
```

This renders correctly with no additional props, classes, or setup. The last item ("Phones") is automatically styled as the active page.

---

## Prop Constraints (critical for correct usage)

| Prop | Constraint |
|------|-----------|
| `items` | **Required.** Must have at least one item. Last item is always treated as the active/current page. |
| `maxVisibleItems` | When total items exceed this, middle items collapse into an ellipsis dropdown. First item and last N-1 items remain visible. |
| `separator` vs `separatorIcon` | `separator` (ReactNode) takes priority. `separatorIcon` (Component) is only used if `separator` is not provided. |
| `href` on items | Renders the item as `<a>` instead of `<button>`. Disabled items always render as `<button>` regardless of `href`. |
| `item.onClick` | Per-item click overrides the global `onItemClick`. Both can coexist — per-item runs first. |
| `showTooltips` | Enables tooltips globally. Individual items still need `tooltip` content set. |
| `dropdownPosition` | Only affects the collapsed items dropdown, not individual items. Options: top, bottom, left, right. |

---

## Data Attributes (for CSS selectors and testing)

- `data-truncated="true"` — on root `<nav>` when items are truncated
- `data-dropdown-open="true"` — on root `<nav>` when ellipsis dropdown is open
- `data-state="active|inactive"` — on each item (last item is "active")
- `data-disabled="true"` — on disabled items
- `data-clickable="true"` — on interactive (non-active, non-disabled) items
- `aria-current="page"` — on the last (active) item

**DOM nesting:** `<nav>` → `<ol>` → `<li>` items interleaved with `<li role="presentation">` separators

---

## All Props

<!-- generated from Breadcrumb.schema.json — edit the schema, not this table -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` **(required)** | array | — | List of breadcrumb items to render. |
| `maxVisibleItems` | number | `4` | Maximum visible items before collapsing into an ellipsis dropdown. |
| `separator` | object | — | React.ReactNode — Custom separator between breadcrumb items. |
| `onItemClick` | object | — | (item: BreadcrumbItem) => void — Called when a breadcrumb item is clicked. |
| `aria-label` | string | — | Accessible label for the breadcrumb nav element. |
| `classes` | object | — | CSS class overrides for breadcrumb sub-elements. |
| `unstyled` | boolean | `false` | Removes all default styling. |
| `className` | string | — | CSS class for the root element. |
| `style` | object | — | CSSProperties — Inline styles for the root element. |
| `separatorIcon` | object | — | React.ComponentType<{ className?: string; style?: CSSProperties }> — Custom separator icon component. |
| `ellipsisIcon` | object | — | React.ComponentType<{ className?: string; style?: CSSProperties }> — Custom ellipsis icon component. |
| `iconSize` | number \| string | `16` | Size of breadcrumb icons. |
| `showTooltips` | boolean | `true` | Enables tooltips on breadcrumb items. |
| `tooltipPosition` | `"top"` \| `"right"` \| `"bottom"` \| `"left"` | `"bottom"` | Default tooltip position for all items. |
| `tooltipOffset` | number | `4` | Default tooltip offset in pixels. |
| `defaultTooltipProps` | object | — | Default tooltip configuration for all items. |
| `ellipsisTooltip` | object | — | React.ReactNode — Tooltip content for the ellipsis button. |
| `ellipsisTooltipProps` | object | — | Tooltip configuration for the ellipsis button. |
| `dropdownPosition` | `"top"` \| `"bottom"` \| `"left"` \| `"right"` | `"top"` | Position of the overflow dropdown. |
| `dropdownZIndex` | number | `50` | Z-index of the overflow dropdown. |
| `portalContainer` | object | — | HTMLElement \| null — Portal container for the dropdown. |
| `ellipsisAriaLabel` | string | `"Show collapsed breadcrumb items"` | Accessible label for the ellipsis button. |
| `onDropdownOpenChange` | object | — | (open: boolean) => void — Called when the dropdown open state changes. |

## Ref API

Forwards ref to the root `<nav>` element:

```tsx
const navRef = useRef<HTMLElement>(null);
<Breadcrumb ref={navRef} items={items} />
// navRef.current is the <nav> DOM element
```

---

## Styling Guide

### How class merging works

1. **Default** (`unstyled=false`, no `classes`): Uses `DEFAULT_BREADCRUMB_CLASSES` with dark mode support.
2. **Partial override** (`unstyled=false`, partial `classes`): Your value **replaces** the default for that slot. Other slots keep defaults.
3. **Unstyled** (`unstyled=true`): All slots empty. You provide everything.

### Slot → visual mapping

```
┌─ root ──────────────────────────────────────────────────────┐
│                                                              │
│  ┌─ list (<ol>) ──────────────────────────────────────────┐ │
│  │                                                         │ │
│  │  [item/link] [separator] [ellipsisButton] [separator]  │ │
│  │  [item/link] [separator] [itemActive]                  │ │
│  │                                                         │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌─ dropdown (portal) ──────────────────────────────────┐   │
│  │  [dropdownItem] [dropdownItem] ...                    │   │
│  └───────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

| "I want to change..." | Slot to use | Notes |
|------------------------|-------------|-------|
| Trail container layout | `list` | Flex container for items + separators. |
| Inactive item styling | `item` | Buttons/spans for non-link, non-active items. |
| Active (last) item styling | `itemActive` | The current page indicator. |
| Disabled item look | `itemDisabled` | Appended to `item` class when disabled. |
| Link items (with href) | `link` | Anchors — separate slot from `item`. |
| Separator icon/text | `separator` | Between each item. |
| Icon inside items | `icon` | Applied to the icon wrapper span. |
| Ellipsis "..." button | `ellipsisButton` | The collapse trigger. |
| Collapsed items dropdown | `dropdown` | The portal-rendered menu container. |
| Items inside dropdown | `dropdownItem` | Each collapsed item in the menu. |

### Dark mode

Default classes use Tailwind `dark:` prefix. Activated by `<html class="dark">`.

```tsx
<Breadcrumb
  items={items}
  classes={{
    item: "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800",
    itemActive: "text-gray-900 dark:text-white font-semibold",
    dropdown: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
  }}
/>
```

### Styling via data attributes

```tsx
// Highlight active item with data-state
<Breadcrumb classes={{
  item: "[&[data-state=active]]:font-bold [&[data-state=active]]:text-blue-600",
}} />
```

```css
/* Truncation-aware styling */
nav[data-truncated="true"] { border: 1px dashed orange; }
nav[data-dropdown-open="true"] .ellipsis-btn { background: blue; }
```

### Complete themed example: "Pill-style" breadcrumb

```tsx
<Breadcrumb
  items={items}
  onItemClick={handleClick}
  unstyled
  classes={{
    list: "flex items-center gap-1",
    item: "px-3 py-1.5 text-xs font-medium rounded-full cursor-pointer transition-all bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700",
    itemActive: "px-3 py-1.5 text-xs font-medium rounded-full bg-blue-600 text-white",
    separator: "text-gray-300 dark:text-gray-600 mx-0.5",
    ellipsisButton: "px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer",
    dropdown: "rounded-xl shadow-lg py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
    dropdownItem: "px-3 py-2 text-sm cursor-pointer text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700",
  }}
/>
```

---

## Patterns

### Truncated trail with dropdown callback

```tsx
<Breadcrumb
  items={deepPath}
  maxVisibleItems={3}
  onDropdownOpenChange={(open) => console.log("Dropdown:", open ? "opened" : "closed")}
  onItemClick={(item) => router.push(item.href ?? "/")}
/>
```

### Items with icons

```tsx
const items: BreadcrumbItem[] = [
  { id: "home", label: "Home", icon: <HomeIcon className="w-4 h-4" /> },
  { id: "docs", label: "Docs", icon: <FolderIcon className="w-4 h-4" /> },
  { id: "api", label: "API Reference" },
];

<Breadcrumb items={items} />
```

### Link-based navigation

```tsx
<Breadcrumb
  items={[
    { id: "home", label: "Home", href: "/" },
    { id: "blog", label: "Blog", href: "/blog" },
    { id: "post", label: "Current Post" },
  ]}
/>
```

### Custom separator

```tsx
// String separator
<Breadcrumb items={items} separator={<span className="mx-1 text-gray-400">/</span>} />

// Custom icon component
<Breadcrumb items={items} separatorIcon={ArrowRightIcon} iconSize={14} />
```

### Loading state

```tsx
{isLoading ? (
  <div className="flex items-center gap-2">
    <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
    <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
  </div>
) : (
  <Breadcrumb items={items} onItemClick={handleClick} />
)}
```

---

## Accessibility

- **Landmark:** `<nav aria-label="Breadcrumb">` — configurable via `aria-label` prop
- **Semantic list:** `<ol>` with `<li>` for screen reader enumeration
- **Current page:** Last item has `aria-current="page"`
- **Separators:** `role="presentation"` and `aria-hidden="true"` — hidden from screen readers
- **Ellipsis button:** `aria-haspopup="menu"`, `aria-expanded`, customizable `aria-label`
- **Dropdown items:** `role="menuitem"` with full keyboard navigation
- **Keyboard:** ArrowDown/Up navigates dropdown, Home/End jump to first/last, Escape closes dropdown and refocuses ellipsis, Tab closes dropdown
- **Disabled items:** `aria-disabled="true"`, `tabIndex={-1}`, skipped in keyboard navigation

---

## Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| Last item is clickable | Expected behavior — it renders as a span, not interactive | Active item has `cursor-default`. Use `itemActive` class to style. |
| Truncation not working | Items count ≤ `maxVisibleItems` | Reduce `maxVisibleItems` or add more items. |
| Dropdown appears off-screen | Default position doesn't fit viewport | Change `dropdownPosition` to `"bottom"`, `"left"`, or `"right"`. |
| Custom separator not showing | Passed `separator` as string, not ReactNode | Wrap in JSX: `separator={<span>/</span>}` not `separator="/"`. |
| Icons missing in dropdown items | Icons are included — check if CSS hides them | Icons from collapsed items render in the dropdown by default. |
| Per-item onClick not firing | Item is disabled | Disabled items prevent all click handlers. |
| `classes.link` not applying | Item has no `href` | `link` slot only applies to items with `href`. Use `item` for non-link items. |
| Styles wrong after overriding one slot | `classes` replaces per-slot, not additive | Include all needed classes in your override string. |

---

## Demo Reference

**File:** `src/pages/demo/BreadcrumbDemo.tsx`

| Feature | Search for | What you'll find |
|---------|-----------|------------------|
| Minimal example | `title="Basic Usage"` | 4-item trail, onItemClick |
| Collapsed trail | `title="Truncation (maxVisibleItems)"` | maxVisibleItems with dropdown |
| Item icons | `title="With Icons"` | icon + iconPosition props |
| Icons in dropdown | `title="Icons + Truncation"` | Icons preserved in collapsed menu |
| Custom ReactNode items | `title="Custom Content"` | content prop with badges |
| Anchor links | `title="With Links"` | href renders as `<a>` |
| Per-item handlers | `title="Per-Item Click Handlers"` | item.onClick overriding global |
| Hover tooltips | `title="Tooltips"` | showTooltips + per-item tooltip |
| Ellipsis tooltip | `title="Ellipsis Tooltip"` | ellipsisTooltip prop |
| Disabled items | `title="Disabled Items"` | disabled in trail and dropdown |
| Dropdown direction | `title="Dropdown Position"` | top, bottom, left, right |
| Custom separator | `title="Custom Separator"` | String and icon separators |
| Icon sizing | `title="Icon Size"` | iconSize prop |
| Pill theme | `title="Pill Style"` | Custom pill-shaped classes |
| Colored theme | `title="Colored Theme"` | Blue-themed with background |
| Full-featured | `title="Combined: Tooltips + Icons + Truncation"` | Icons + tooltips + truncation |
| Dropdown callback | `title="onDropdownOpenChange"` | Open/close state tracking |

**Source files:**

| File | Contains |
|------|----------|
| `Breadcrumb.tsx` | Main component — rendering, truncation, dropdown, keyboard, portal |
| `components/BreadcrumbItemContent.tsx` | Item content renderer (label, icon, custom content) |
| `icons.tsx` | ChevronRightIcon, EllipsisIcon SVGs |
| `utils/types.ts` | All TypeScript interfaces |
| `utils/constants.ts` | Default classes, unstyled classes |
