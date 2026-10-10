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
- `data-accordion-expand-print="true"` — on root when `expandOnPrint` is set. The
  print stylesheet the component ships keys off it: `[data-accordion-expand-print="true"]`
  forces every `data-state="closed"` panel open for print and unhides its
  `aria-hidden` content.
- `data-accordion-print-styles` — marks the injected print stylesheet itself, so
  a second accordion on the page does not inject a second copy.

**DOM nesting:** root `<div>` → item `<div>` → heading `<h3>` → trigger `<button>` + content `<div role="region">`

---

## All Props

<!-- generated from Accordion.schema.json — edit the schema, not this table -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` **(required)** | `"single"` \| `"multiple"` | — | Selection mode: single or multiple expanded items. |
| `orientation` | `"vertical"` \| `"horizontal"` | `"vertical"` | Layout orientation for keyboard navigation. |
| `dir` | `"ltr"` \| `"rtl"` | `"ltr"` | Text direction. Reverses the horizontal arrow keys and sets `dir` on the root; the layout itself does not mirror. |
| `disabled` | boolean | `false` | Disables all accordion items. |
| `loop` | boolean | `true` | Whether keyboard navigation wraps from last to first item. |
| `classes` | object | — | CSS class overrides for accordion sub-elements. |
| `headingLevel` | `1` \| `2` \| `3` \| `4` \| `5` \| `6` | `3` | HTML heading level for accordion item triggers. |
| `children` **(required)** | object | — | React.ReactNode — AccordionItem children. |
| `asChild` | boolean | `false` | Merges accordion props onto a child element via Slot. |
| `size` | `"sm"` \| `"md"` \| `"lg"` | `"md"` | Preset size variant. |
| `variant` | `"default"` \| `"bordered"` \| `"separated"` \| `"flush"` | `"default"` | Visual style variant. |
| `animationEasing` | string | `"ease-in-out"` | CSS easing function for expand/collapse animation. |
| `animationDuration` | number | `300` | Duration in milliseconds for expand/collapse animation. |
| `reduceMotion` | boolean \| `"auto"` | `"auto"` | Controls motion preferences. 'auto' respects OS setting. |
| `unstyled` | boolean | `false` | Removes all default styling. |
| `defaultExpandAll` | boolean | `false` | Expands all items on initial render. |
| `expandOnPrint` | boolean | `false` | Expands all items when printing. |
| `storageKey` | string \| object | — | Key or config for persisting expanded state to storage. |
| `onKeyDown` | object | — | (event: KeyboardEvent, itemValue: string \| null) => void |
| `preventClose` | object | — | (value: string) => boolean \| Promise<boolean> |
| `preventCloseTimeout` | number | `10000` | Timeout in ms for the preventClose callback. |
| `onFocusCapture` | object | — | (event: FocusEvent) => void |
| `onBlurCapture` | object | — | (event: FocusEvent) => void |
| `aria-busy` | boolean | — | ARIA busy state for async content. |
| `aria-live` | `"off"` \| `"polite"` \| `"assertive"` | — | ARIA live region behavior. |
| `announceExpanded` | boolean | `false` | Announces expanded state changes to screen readers. |

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

## Sub-component Props

Generated from the types by `scripts/build-subcomponent-schemas.mjs`.

### AccordionItem

| Prop | Type | Description |
| --- | --- | --- |
| `value` | `string` | Identifies this item. Matches the values passed to the accordion's `value` or `defaultValue`. |
| `disabled` | `boolean \| undefined` | Disables this item alone. It stays visible but cannot be toggled and leaves the tab order. |
| `children` | `ReactNode` | Content rendered inside this element. |
| `asChild` | `boolean \| undefined` | Render the passed child instead of the default element, keeping behaviour, ARIA and props. |
| `onExpandedChange` | `((isExpanded: boolean) => void) \| undefined` | Fires when the item's expanded state changes. |
| `aria-describedby` | `string \| undefined` | Identifies the element (or elements) that describes the object. |

### AccordionTrigger

| Prop | Type | Description |
| --- | --- | --- |
| `children` | `ReactNode` | Content rendered inside this element. |
| `expandedIcon` | `ReactNode` | Icon shown while the item is expanded. Replaces the default chevron. |
| `collapsedIcon` | `ReactNode` | Icon shown while the item is collapsed. Replaces the default chevron. |
| `iconPosition` | `"left" \| "right" \| "none" \| undefined` | Which side of the trigger the icon sits on, or `"none"` to drop it. |
| `asChild` | `boolean \| undefined` | Render the passed child instead of the default element, keeping behaviour, ARIA and props. |
| `subtitle` | `ReactNode` | Secondary line rendered under the trigger's label. |
| `iconAnimation` | `"none" \| "rotate" \| "switch" \| undefined` | How the icon changes on toggle: rotate the chevron, switch between the two icons, or neither. |
| `leftSlot` | `ReactNode` | Content placed before the label, inside the trigger. |
| `rightSlot` | `ReactNode` | Content placed after the label and before the icon. |
| `aria-describedby` | `string \| undefined` | Identifies the element (or elements) that describes the object. |

### AccordionContent

| Prop | Type | Description |
| --- | --- | --- |
| `children` | `ReactNode` | Content rendered inside this element. |
| `forceMount` | `boolean \| undefined` | Keeps the panel mounted while collapsed, so an exit animation or a measurement has a node to read. |
| `animationDuration` | `number \| undefined` | Expand and collapse duration in milliseconds. |
| `animationEasing` | `string \| undefined` | CSS easing function for the expand and collapse transition. |
| `asChild` | `boolean \| undefined` | Render the passed child instead of the default element, keeping behaviour, ARIA and props. |
| `lazyLoad` | `boolean \| undefined` | Delays rendering the panel's children until it is first expanded. |
| `unmountOnClose` | `boolean \| undefined` | Unmounts the panel's children again each time it collapses. |
| `onOpenStart` | `(() => void) \| undefined` | Fires when the expand transition begins. |
| `onOpenEnd` | `(() => void) \| undefined` | Fires when the expand transition finishes. |
| `onCloseStart` | `(() => void) \| undefined` | Fires when the collapse transition begins. |
| `onCloseEnd` | `(() => void) \| undefined` | Fires when the collapse transition finishes. |

### AccordionShimmer

| Prop | Type | Description |
| --- | --- | --- |
| `reduceMotion` | `boolean \| "auto" \| undefined` | Whether to stop the shimmer animation. `"auto"` follows the OS reduced-motion setting. |
| `classes` | `AccordionShimmerClasses \| undefined` | Class overrides for this component's slots. |
| `unstyled` | `boolean \| undefined` | Drops the decorative default classes and keeps the structural ones, along with focus, keyboard and ARIA wiring. |
| `count` | `number \| undefined` | How many placeholder items to draw. |
| `size` | `AccordionSize \| undefined` | Matches the accordion size the placeholder stands in for. |
| `variant` | `AccordionVariant \| undefined` | Matches the accordion variant the placeholder stands in for. |
| `animate` | `boolean \| undefined` | Whether the placeholder pulses. Set false for a still skeleton. |
| `className` | `string \| undefined` | Additional classes for the root element. |
| `style` | `CSSProperties \| undefined` | Inline styles for the root element. |
| `showContent` | `boolean \| undefined` | Also draws a placeholder for the expanded panel, not just the triggers. |
| `asChild` | `boolean \| undefined` | Render the passed child instead of the default element, keeping behaviour, ARIA and props. |

---

## Styling Guide

> **A plain utility replaces the library's for that property, in every state.**
> `classes={{ slot: "text-red-500" }}` drops the library's `hover:text-…` and
> `data-[state=…]:text-…` on that slot as well — otherwise they would sit beside
> your class and win in their own state, leaving your override in the DOM and
> inert. Pass your own variant to keep one: `"text-red-500 hover:text-red-400"`.
> A variant YOU pass is never dropped.

### How class merging works

The component has three styling modes:

1. **Default** (`unstyled=false`, no `classes`): Uses `DEFAULT_ACCORDION_CLASSES` — fully styled with dark mode support.
2. **Partial override** (`unstyled=false`, partial `classes`): Your values **replace** the default for that slot. Unspecified slots keep their defaults. This is NOT additive — if you pass `trigger: "my-class"`, the entire default trigger class string is replaced, not appended.

**A slot that carries states is replaced as a whole.** Several slots absorbed what were
separate per-state keys, so overriding one replaces its base styling *and* every state
variant on it. Write the base and all the states you want in one string — a one-state
override silently drops the rest.

3. **Unstyled** (`unstyled=true`): All slots start as empty strings. You must provide everything via `classes`.

```tsx
// This REPLACES the default trigger classes entirely:
<Accordion classes={{ trigger: "my-custom-trigger" }} />

// The other slots (item, body, icon, etc.) still use their defaults.
// To ADD to defaults, you must include the default classes yourself.
```

### Slot → element

| Slot | Element |
|------|---------|
| `root` | The accordion's outer element. |
| `item` | Each item's wrapper. Carries the variant's border treatment. |
| `header` | The heading element the trigger sits inside. |
| `trigger` | The `<button>` inside each item's heading. |
| `itemIcon` | An icon rendered before the label, when one is passed. |
| `itemText` | The trigger's label text. |
| `description` | The optional line under the trigger's label. |
| `triggerActions` | The slot after the label for controls that are not the trigger itself. |
| `icon` | The wrapper around the expand/collapse indicator. |
| `itemIndicator` | The chevron glyph itself, inside the `icon` slot. |
| `content` | The animating panel — the grid whose row goes `0fr` to `1fr`. |
| `body` | The padded region inside the panel that holds the content. |

`AccordionShimmer` has its own map: `root`, `item`, `trigger`, `itemText`,
`titleBar`, `descriptionBar`, `icon`, `body` — `titleBar` and `descriptionBar`
are the placeholder bars standing in for the label and its description.

### CSS custom properties

| Variable | Set by | Controls | Default |
|----------|--------|----------|---------|
| `--cl-accordion-content-height` | the component, on each panel element | The panel's open height, measured and written by `AccordionContent` before it animates. The `max-height` of an opening panel reads `var(--cl-accordion-content-height, auto)`, so the fallback is what renders if the keyframes are missing. | none — written per panel at runtime |

You do not set this one; it is listed because it is the whole animation
contract. It shipped once with its keyframes absent from `dist`, and a consumer
had no way to know the variable existed or why the panel would not animate.

### Slot → visual mapping

Use this to know which slot to change for a given visual outcome:

```
┌─────────────────────────────────────────────────────┐
│ root                                                 │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │ item                                          │   │
│  │                                               │   │
│  │  ┌─ header ──────────────────────────────┐  │   │
│  │  │ ┌─ trigger ──────────────────────────┐ │  │   │
│  │  │ │ [itemIcon] [itemText] [triggerActions] [icon] │ │   │
│  │  │ │               └─ description                │ │  │   │
│  │  │ └────────────────────────────────────┘ │  │   │
│  │  └────────────────────────────────────────┘  │   │
│  │                                               │   │
│  │  ┌─ content (animation layer) ─────┐  │   │
│  │  │ ┌─ body ─────────────────────┐ │  │   │
│  │  │ │  body (your text/elements)      │ │  │   │
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
| Subtitle appearance | `description` | Below the main trigger label |
| Content text styling | `body` | Wraps your children |
| Open/close animation speed | `content` | Must keep `overflow-hidden transition-[max-height,opacity,visibility]` |
| Extra spacing inside content | `body` | Inner wrapper if you need it |
| Heading semantics (h1-h6 tag) | `header` | Rarely styled — use for CSS resets only |

### Dark mode

The default classes use Tailwind's `dark:` prefix. Dark mode activates when `<html class="dark">` is present (Tailwind's class strategy).

```tsx
// Default classes already handle dark mode:
// trigger: "text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"

// When overriding, always provide both light and dark variants:
<Accordion classes={{
  trigger: "text-gray-900 dark:text-white bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800",
  body: "text-gray-600 dark:text-gray-300",
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
  body: "pb-4 text-sm text-gray-500 dark:text-gray-400",
  content: "overflow-hidden transition-[max-height,opacity,visibility]",
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
    itemText: "flex-1 text-left",
    body: "px-4 pb-3 text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed",
    content: "overflow-hidden transition-[max-height,opacity,visibility]",
    icon: "h-3.5 w-3.5 text-gray-400 dark:text-gray-500 transition-transform duration-200",
    icon: "shrink-0",
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

## AccordionShimmer classes

`AccordionShimmer` is a component in its own right, not a part of Accordion —
Accordion never renders it, the consumer does. It has its own anatomy and its own
`classes` bag; Accordion's keys do not reach it.

```
root
└── item
    ├── trigger
    │   ├── itemText
    │   │   ├── titleBar
    │   │   └── descriptionBar
    │   └── icon
    └── body
        └── descriptionBar
```

```tsx
<AccordionShimmer
  count={3}
  showContent
  classes={{
    item: "border-b border-gray-100",
    titleBar: "h-4 rounded bg-slate-200",
    descriptionBar: "h-3 rounded bg-slate-100",
  }}
/>
```

`unstyled` works the same way it does elsewhere: decorative classes are stripped,
structural ones stay. The pulse is in the defaults, so `unstyled`, `animate={false}`
and `prefers-reduced-motion` each switch it off.

## Keyboard Interactions

| Key | Behaviour |
|-----|-----------|
| `Tab` | Moves focus to the next trigger in the tab order. |
| `ArrowDown`, `ArrowUp` | Moves focus between triggers. `orientation="horizontal"` uses `ArrowRight`/`ArrowLeft` instead. Disabled items are skipped, and `loop` wraps past the ends. |
| `Home`, `End` | Moves focus to the first or last trigger. |
| `Enter`, `Space` | Toggles the focused item. In `type="single"` without `collapsible`, the open item cannot be closed this way. |

---

## Accessibility

- **Keyboard:** ArrowDown/Up navigates items, Home/End jump to first/last, Enter/Space toggles, disabled items are skipped, loop wraps focus
- **ARIA:** Triggers have `aria-expanded` + `aria-controls`, content has `role="region"` + `aria-labelledby`, headings provide semantic structure
- **Screen readers:** Set `announceExpanded` for live announcements like "Item expanded. 2 of 5 items expanded."
- **Reduced motion:** `reduceMotion` defaults to `"auto"`, which follows the OS
  `prefers-reduced-motion` setting. `true` always reduces motion. `false` always
  animates — **including for a user who has asked their OS for less motion**, so
  pass it only when you know more than the OS setting does. The value governs the
  decorative classes as well as the animation timings.

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

## Anti-patterns

```tsx
// ❌ DON'T: Combine value + defaultValue
<Accordion type="single" value={val} defaultValue="item-1" />

// ❌ DON'T: Use collapsible with type="multiple" (it's ignored)
<Accordion type="multiple" collapsible />

// ❌ DON'T: Use storageKey with controlled mode (value prop)
<Accordion type="single" value={val} storageKey="my-key" />

// ❌ DON'T: Override one class slot and expect others to remain
// classes replaces the entire slot, it does NOT merge with defaults
<Accordion classes={{ trigger: "my-trigger" }} />
// ✅ DO: Include all needed classes in the override
<Accordion classes={{ trigger: "flex w-full items-center px-4 py-4 my-trigger" }} />

// ❌ DON'T: Use maxExpanded with type="single"
<Accordion type="single" maxExpanded={3} />

// ❌ DON'T: Forget onValueChange with controlled value
<Accordion type="single" value={val} />
// ✅ DO: Always pair value with onValueChange
<Accordion type="single" value={val} onValueChange={setVal} />
```

---

## AI Instructions

- **Always set `type`** — it's required. Use `"single"` for FAQ/settings, `"multiple"` for checklists/filters.
- **Always add `collapsible`** to `type="single"` unless you intentionally want one item always open.
- **Use `defaultValue` for uncontrolled**, `value` + `onValueChange` for controlled. Never mix.
- **Don't partially override `classes`** — each slot replaces the default entirely. If you override `trigger`, include layout classes too.
- **Use `unstyled` for full custom styling** rather than fighting defaults.
- **Provide meaningful `value` strings** on AccordionItem — they're used for storage, controlled state, and callbacks.
- **Set `headingLevel`** appropriately for your page's heading hierarchy (default is `h3`).
- **Safe defaults:** `type="single" collapsible defaultValue="first-item"` works for most use cases.

---

## Demo Reference

**File:** `src/pages/demo/AccordionDemo.tsx`

To find a specific demo implementation, search for these `title=` strings in the demo file:

| Feature | Search for | What you'll find |
|---------|-----------|------------------|
| Minimal example | `title="Basic Usage"` | Single collapsible, zero config |
| Controlled state | `title="Controlled Mode (Single)"` | `value` + `onValueChange` pattern |
| Multiple mode | `title="Max Expanded (Multiple Mode)"` | Multiple items open, `maxExpanded` |
| Visual variants | `title="Variants"` | default, bordered, separated, flush |
| Size presets | `title="Sizes"` | sm, md, lg side by side |
| Custom icons | `title="Custom Icons"` | `expandedIcon`, `collapsedIcon`, `iconPosition`, `iconAnimation` |
| Trigger slots | `title="Subtitles & Slots"` | `leftSlot`, `rightSlot`, `description` |
| Disabled states | `title="Disabled"` | Per-item and global disabled |
| Imperative API | `title="Imperative Ref API"` | `expandAll`, `collapseAll`, `toggle`, `focusItem` |
| Animation config | `title="Animation Customization"` | Custom duration, easing, lifecycle callbacks |
| Accessibility | `title="Screen Reader Announcements"` | `announceExpanded`, `headingLevel` |
| Content rendering | `title="Lazy Loading & Unmount on Close"` | `lazyLoad`, `forceMount`, `unmountOnClose` |
| Loading skeleton | `title="Shimmer Options"` | `AccordionShimmer` component |

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
