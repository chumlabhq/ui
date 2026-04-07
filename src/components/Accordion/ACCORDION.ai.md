# Accordion

> A vertically stacked set of collapsible sections. Each item has a clickable trigger that toggles its content panel.

**Category:** Disclosure
**Keywords:** accordion, collapsible, expandable, toggle, faq, disclosure, panel

---

## Quick Answer

Use `<Accordion type="single" collapsible>` for FAQs. Use `type="multiple"` when users need several sections open. Works out-of-the-box with zero configuration beyond `type` and children.

---

## Import

```tsx
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@chumlab/ui/accordion";
```

---

## Basic Usage (copy-paste ready)

```tsx
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@chumlab/ui/accordion";

export default function FAQ() {
  return (
    <Accordion type="single" collapsible defaultValue="q1">
      <AccordionItem value="q1">
        <AccordionTrigger>What is your return policy?</AccordionTrigger>
        <AccordionContent>
          You can return any item within 30 days of purchase.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="q2">
        <AccordionTrigger>How long does shipping take?</AccordionTrigger>
        <AccordionContent>
          Standard shipping takes 3-5 business days.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
```

This renders correctly with no additional props, classes, or setup.

---

## Prop Constraints (critical for correct usage)

These props have dependencies — using them wrong causes silent bugs:

| Prop | Constraint |
|------|-----------|
| `collapsible` | Only works with `type="single"`. Ignored on `type="multiple"`. |
| `maxExpanded` | Only works with `type="multiple"`. Ignored on `type="single"`. |
| `defaultExpandAll` | Only works with `type="multiple"` AND uncontrolled mode. |
| `storageKey` | Only works in uncontrolled mode (no `value` prop). |
| `value` + `defaultValue` | Never combine. Use one or the other. |
| `value` requires `onValueChange` | Controlled mode — both are needed together. |

---

## Data Attributes (for CSS selectors and testing)

- `data-state="open|closed"` — on item, trigger, and content
- `data-disabled` — on disabled items/triggers
- `data-pending` — during async preventClose
- `data-orientation="vertical|horizontal"` — on root
- `data-value` — item's unique value string
- `data-type="single|multiple"`, `data-size`, `data-variant` — on root

**DOM nesting:** root `<div>` → item `<div>` → heading `<h3>` → trigger `<button>` + content `<div role="region">`

---

## All Props

### Accordion (root)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `"single" \| "multiple"` | **required** | Single = one open at a time. Multiple = any number. |
| `collapsible` | `boolean` | `false` | (single only) Allow closing the open item. |
| `value` | `string \| string[]` | — | Controlled expanded value(s). |
| `defaultValue` | `string \| string[]` | — | Uncontrolled initial value(s). |
| `onValueChange` | `(value) => void` | — | Callback when expanded items change. |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Padding and font size preset. |
| `variant` | `"default" \| "bordered" \| "separated" \| "flush"` | `"default"` | Visual style. |
| `disabled` | `boolean` | `false` | Disable all items globally. |
| `orientation` | `"vertical" \| "horizontal"` | `"vertical"` | Arrow key navigation direction. |
| `dir` | `"ltr" \| "rtl"` | `"ltr"` | Text direction (affects horizontal arrow keys). |
| `loop` | `boolean` | `true` | Wrap keyboard focus from last to first. |
| `headingLevel` | `1-6` | `3` | HTML heading level wrapping triggers. |
| `animationDuration` | `number` | `300` | Expand/collapse animation in ms. |
| `animationEasing` | `string` | `"ease-in-out"` | CSS easing function. |
| `reduceMotion` | `boolean \| "auto"` | `"auto"` | `"auto"` respects OS setting. |
| `unstyled` | `boolean` | `false` | Strip all default classes. |
| `classes` | `AccordionClasses` | — | Override classes per slot (see Classes section). |
| `maxExpanded` | `number` | — | (multiple only) Max simultaneously open items. |
| `defaultExpandAll` | `boolean` | `false` | (multiple, uncontrolled only) Open all on mount. |
| `storageKey` | `string \| StorageConfig` | — | Persist state to localStorage (uncontrolled only). |
| `expandOnPrint` | `boolean` | `false` | Force-expand all when printing. |
| `announceExpanded` | `boolean` | `false` | aria-live announcements on toggle. |
| `preventClose` | `(value: string) => boolean \| Promise<boolean>` | — | Conditionally prevent closing. |
| `onExpandedChange` | `(event) => void` | — | Detailed expand/collapse event callback. |
| `asChild` | `boolean` | `false` | Render as child element (polymorphic). |

### AccordionItem

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | **required** | Unique identifier. |
| `disabled` | `boolean` | `false` | Disable this item. |
| `onExpandedChange` | `(isExpanded: boolean) => void` | — | Per-item toggle callback. |

### AccordionTrigger

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `iconPosition` | `"left" \| "right" \| "none"` | `"right"` | Where the chevron icon appears. |
| `iconAnimation` | `"rotate" \| "switch" \| "none"` | `"rotate"` | How the icon animates. |
| `expandedIcon` | `ReactNode` | — | Custom icon when expanded. |
| `collapsedIcon` | `ReactNode` | — | Custom icon when collapsed. |
| `subtitle` | `ReactNode` | — | Secondary text below the label. |
| `leftSlot` | `ReactNode` | — | Content to the left of the label. |
| `rightSlot` | `ReactNode` | — | Content to the right (before icon). |

### AccordionContent

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `forceMount` | `boolean` | `false` | Always render in DOM. |
| `lazyLoad` | `boolean` | `false` | Don't render until first opened. |
| `unmountOnClose` | `boolean` | `false` | Remove from DOM when closed. |
| `onOpenStart` | `() => void` | — | Fires when expand animation begins. |
| `onOpenEnd` | `() => void` | — | Fires when expand animation completes. |
| `onCloseStart` | `() => void` | — | Fires when collapse animation begins. |
| `onCloseEnd` | `() => void` | — | Fires when collapse animation completes. |

### AccordionShimmer

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `count` | `number` | `3` | Number of skeleton items. |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Matches Accordion size. |
| `variant` | `"default" \| "bordered" \| "separated" \| "flush"` | `"default"` | Matches Accordion variant. |
| `animate` | `boolean` | `true` | Pulse animation. |
| `showContent` | `boolean` | `false` | Show content placeholder lines. |

---

## Ref API (AccordionRef)

```tsx
const ref = useRef<AccordionRef>(null);

// Use in JSX
<Accordion ref={ref} type="multiple">...</Accordion>

// Available methods:
ref.current?.expandAll()             // Open all items (multiple mode only)
ref.current?.collapseAll()           // Close all items
ref.current?.expand("item-1")        // Open specific item
ref.current?.collapse("item-1")      // Close specific item
ref.current?.toggle("item-1")        // Toggle specific item
ref.current?.getExpandedValues()     // Returns string[] of open items
ref.current?.isExpanded("item-1")    // Returns boolean
ref.current?.getItemCount()          // Returns number
ref.current?.focusItem("item-1")     // Focus a trigger (optionally scroll into view)
ref.current?.element                 // Root HTMLDivElement
```

---

## Styling Guide

### How class merging works

The component has three styling modes:

1. **Default** (`unstyled=false`, no `classes`): Uses `DEFAULT_ACCORDION_CLASSES` — fully styled with dark mode support.
2. **Partial override** (`unstyled=false`, partial `classes`): Your values **replace** the default for that slot. Unspecified slots keep their defaults. This is NOT additive — if you pass `trigger: "my-class"`, the entire default trigger class string is replaced, not appended.
3. **Unstyled** (`unstyled=true`): All slots start as empty strings. You must provide everything via `classes`.

```tsx
// This REPLACES the default trigger classes entirely:
<Accordion classes={{ trigger: "my-custom-trigger" }} />

// The other slots (item, content, icon, etc.) still use their defaults.
// To ADD to defaults, you must include the default classes yourself.
```

### Slot → visual mapping

Use this to know which slot to change for a given visual outcome:

```
┌─────────────────────────────────────────────────────┐
│ root                                                 │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │ item                                          │   │
│  │                                               │   │
│  │  ┌─ heading ──────────────────────────────┐  │   │
│  │  │ ┌─ trigger ──────────────────────────┐ │  │   │
│  │  │ │ [triggerLeft] [triggerInner] [triggerRight] [iconWrapper > icon] │ │   │
│  │  │ │               └─ subtitle                │ │  │   │
│  │  │ └────────────────────────────────────┘ │  │   │
│  │  └────────────────────────────────────────┘  │   │
│  │                                               │   │
│  │  ┌─ contentWrapper (animation layer) ─────┐  │   │
│  │  │ ┌─ contentInner ─────────────────────┐ │  │   │
│  │  │ │  content (your text/elements)      │ │  │   │
│  │  │ └───────────────────────────────────┘ │  │   │
│  │  └────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────┘   │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │ item (next)                                   │   │
│  │ ...                                           │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

| "I want to change..." | Slot to use | Notes |
|------------------------|-------------|-------|
| Overall container width/bg | `root` | |
| Border between items | `item` | Use `border-b` and `last:border-b-0` |
| Trigger background on hover | `trigger` | Use `hover:bg-*` |
| Trigger text color | `trigger` | Includes font weight, size from `size` prop |
| Expanded/collapsed text color | `trigger` | Target via `data-state` in CSS: `[data-state=open]:text-blue-600` |
| Chevron icon color/size | `icon` | Rotation is automatic via `iconAnimation` |
| Subtitle appearance | `subtitle` | Below the main trigger label |
| Content text styling | `content` | Wraps your children |
| Open/close animation speed | `contentWrapper` | Must keep `overflow-hidden transition-[max-height,opacity,visibility]` |
| Extra spacing inside content | `contentInner` | Inner wrapper if you need it |
| Heading semantics (h1-h6 tag) | `heading` | Rarely styled — use for CSS resets only |

### Dark mode

The default classes use Tailwind's `dark:` prefix. Dark mode activates when `<html class="dark">` is present (Tailwind's class strategy).

```tsx
// Default classes already handle dark mode:
// trigger: "text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"

// When overriding, always provide both light and dark variants:
<Accordion classes={{
  trigger: "text-gray-900 dark:text-white bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800",
  content: "text-gray-600 dark:text-gray-300",
}} />
```

### Styling via data attributes (CSS/Tailwind)

Every item and trigger expose `data-state="open|closed"`. Use this for state-dependent styling without JavaScript:

```tsx
// Tailwind arbitrary variants:
<Accordion classes={{
  item: "[&[data-state=open]]:bg-blue-50 dark:[&[data-state=open]]:bg-blue-900/20 border-b border-gray-200 dark:border-gray-700",
  trigger: "[&[data-state=open]]:text-blue-600 dark:[&[data-state=open]]:text-blue-400 [&[data-state=open]]:font-semibold",
  icon: "[&[data-state=open]]:text-blue-600 dark:[&[data-state=open]]:text-blue-400",
}} />
```

Or in plain CSS:

```css
[data-state="open"] > button { color: #2563eb; }
[data-state="closed"] > button { color: #374151; }
[data-disabled] > button { opacity: 0.5; cursor: not-allowed; }
```

### Size + variant interaction with classes

`size` and `variant` props add extra classes on top of `classes`. They are always applied. If you set `classes.trigger`, the size padding (`px-4 py-4 text-sm` for md) is still added. To take full control, use `unstyled`:

```tsx
// Full control — no defaults, no size/variant classes:
<Accordion type="single" collapsible unstyled classes={{
  root: "divide-y divide-gray-200 dark:divide-gray-700",
  trigger: "w-full flex justify-between py-4 text-left text-base font-medium text-gray-900 dark:text-white",
  content: "pb-4 text-sm text-gray-500 dark:text-gray-400",
  contentWrapper: "overflow-hidden transition-[max-height,opacity,visibility]",
  icon: "h-5 w-5 text-gray-400 dark:text-gray-500 transition-transform duration-200",
}}>
```

### Complete themed example: "macOS Settings" style

```tsx
<Accordion
  type="single"
  collapsible
  unstyled
  classes={{
    root: "rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden shadow-sm",
    item: "border-b border-gray-100 dark:border-gray-700 last:border-b-0",
    trigger:
      "flex w-full items-center gap-3 px-4 py-3 text-[13px] font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors",
    triggerInner: "flex-1 text-left",
    content: "px-4 pb-3 text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed",
    contentWrapper: "overflow-hidden transition-[max-height,opacity,visibility]",
    icon: "h-3.5 w-3.5 text-gray-400 dark:text-gray-500 transition-transform duration-200",
    iconWrapper: "shrink-0",
  }}
  animationDuration={200}
  animationEasing="ease-out"
>
  <AccordionItem value="general">
    <AccordionTrigger
      leftSlot={<span className="text-base">⚙️</span>}
    >
      General
    </AccordionTrigger>
    <AccordionContent>
      Configure general application settings.
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="appearance">
    <AccordionTrigger
      leftSlot={<span className="text-base">🎨</span>}
    >
      Appearance
    </AccordionTrigger>
    <AccordionContent>
      Customize theme, fonts, and colors.
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

---

## Patterns

### Controlled accordion

```tsx
const [openItem, setOpenItem] = useState<string | null>("settings");

<Accordion type="single" collapsible value={openItem} onValueChange={setOpenItem}>
  <AccordionItem value="settings">
    <AccordionTrigger>Settings</AccordionTrigger>
    <AccordionContent>...</AccordionContent>
  </AccordionItem>
  <AccordionItem value="billing">
    <AccordionTrigger>Billing</AccordionTrigger>
    <AccordionContent>...</AccordionContent>
  </AccordionItem>
</Accordion>
```

### Multiple with limit

```tsx
<Accordion type="multiple" maxExpanded={2} defaultValue={["a", "b"]}>
  <AccordionItem value="a">...</AccordionItem>
  <AccordionItem value="b">...</AccordionItem>
  <AccordionItem value="c">...</AccordionItem>
</Accordion>
```

### Persist to localStorage

```tsx
<Accordion type="multiple" storageKey="sidebar-sections">
  ...
</Accordion>
```

### Loading state

```tsx
{isLoading ? (
  <AccordionShimmer count={3} variant="bordered" />
) : (
  <Accordion type="single" collapsible variant="bordered">
    {items.map(item => (
      <AccordionItem key={item.id} value={item.id}>
        <AccordionTrigger>{item.title}</AccordionTrigger>
        <AccordionContent>{item.body}</AccordionContent>
      </AccordionItem>
    ))}
  </Accordion>
)}
```

---

## Accessibility

- **Keyboard:** ArrowDown/Up navigates items, Home/End jump to first/last, Enter/Space toggles, disabled items are skipped, loop wraps focus
- **ARIA:** Triggers have `aria-expanded` + `aria-controls`, content has `role="region"` + `aria-labelledby`, headings provide semantic structure
- **Screen readers:** Set `announceExpanded` for live announcements like "Item expanded. 2 of 5 items expanded."
- **Reduced motion:** `reduceMotion="auto"` respects OS `prefers-reduced-motion` setting

---

## Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| Can't close the last open item | `collapsible` not set | Add `collapsible` to `type="single"` |
| `defaultExpandAll` does nothing | Wrong mode | Only works with `type="multiple"` + uncontrolled |
| `storageKey` not persisting | Controlled mode | Remove `value`/`onValueChange`, use `defaultValue` |
| No animation | OS or prop setting | Check `reduceMotion` — set to `false` to force |
| Icon not rotating | `iconAnimation="none"` or reduced motion | Set `iconAnimation="rotate"` |
| `maxExpanded` ignored | Wrong type | Only works with `type="multiple"` |
| Styles look wrong after overriding one slot | `classes` replaces, not merges | Include all needed classes in your override string |
| `size` padding still applies with custom `classes` | Size/variant classes stack | Use `unstyled` for full control |

---

## Demo Reference

**File:** `src/pages/demo/AccordionDemo.tsx`

To find a specific demo implementation, search for these `title=` strings in the demo file:

| Feature | Search for | What you'll find |
|---------|-----------|------------------|
| Minimal example | `title="Basic Usage"` | Single collapsible, zero config |
| Controlled state | `title="Controlled"` | `value` + `onValueChange` pattern |
| Multiple mode | `title="Multiple Mode"` | Multiple items open, `maxExpanded` |
| Visual variants | `title="Variants"` | default, bordered, separated, flush |
| Size presets | `title="Sizes"` | sm, md, lg side by side |
| Custom icons | `title="Custom Icons"` | `expandedIcon`, `collapsedIcon`, `iconPosition`, `iconAnimation` |
| Trigger slots | `title="Left / Right Slots"` | `leftSlot`, `rightSlot`, `subtitle` |
| Disabled states | `title="Disabled"` | Per-item and global disabled |
| Imperative API | `title="Ref API"` | `expandAll`, `collapseAll`, `toggle`, `focusItem` |
| Animation config | `title="Animation"` | Custom duration, easing, lifecycle callbacks |
| Accessibility | `title="Screen Reader"` | `announceExpanded`, `headingLevel` |
| Content rendering | `title="Lazy Load"` | `lazyLoad`, `forceMount`, `unmountOnClose` |
| Loading skeleton | `title="Shimmer"` | `AccordionShimmer` component |
| No default styles | `title="Unstyled Mode"` | `unstyled` with bare HTML output |
| Style overrides | `title="Classes System"` | Per-slot class customization |

**Source files:**

| File | Contains |
|------|----------|
| `Accordion.tsx` | Root component, context providers, ref API |
| `components/AccordionItem.tsx` | Item wrapper, item-level context |
| `components/AccordionTrigger.tsx` | Button, icon, slots, keyboard handling |
| `components/AccordionContent.tsx` | Animated content panel, lazy/mount logic |
| `components/AccordionShimmer.tsx` | Loading skeleton |
| `utils/types.ts` | All TypeScript interfaces |
| `utils/constants.ts` | Default classes, size/variant maps |
| `utils/context.ts` | React contexts |
| `hooks/` | State manager, focus, storage, motion, print |
