# Accordion

A composable, accessible accordion component following WAI-ARIA patterns. Supports keyboard navigation, single/multiple modes, controlled/uncontrolled state, RTL support, and customizable styling.

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Examples](#examples)
  - [Basic Usage](#basic-usage)
  - [Single Mode (Collapsible)](#single-mode-collapsible)
  - [Single Mode (Non-Collapsible)](#single-mode-non-collapsible)
  - [Multiple Mode](#multiple-mode)
  - [Controlled Mode](#controlled-mode)
  - [Custom Icons](#custom-icons)
  - [Disabled States](#disabled-states)
  - [Custom Styling](#custom-styling)
  - [Keyboard Navigation](#keyboard-navigation)
  - [RTL Support](#rtl-support)
  - [Animation Callbacks](#animation-callbacks)
  - [Render Delegation (asChild)](#render-delegation-aschild)
  - [Nested Accordions](#nested-accordions)
- [API Reference](#api-reference)
  - [Accordion](#accordion-1)
  - [AccordionItem](#accordionitem)
  - [AccordionTrigger](#accordiontrigger)
  - [AccordionContent](#accordioncontent)
  - [AccordionClassNames](#accordionclassnames)
- [Data Attributes](#data-attributes)
- [ARIA Attributes](#aria-attributes)
- [Accessibility](#accessibility)
- [Exports](#exports)

---

## Installation

```tsx
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@kern-ui/accordion";
```

---

## Quick Start

```tsx
<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>Is it accessible?</AccordionTrigger>
    <AccordionContent>
      Yes. It follows the WAI-ARIA Accordion pattern.
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-2">
    <AccordionTrigger>Is it styled?</AccordionTrigger>
    <AccordionContent>
      It comes with default styles that can be customized.
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

---

## Examples

### Basic Usage

The most basic accordion with single item expansion and collapsible behavior.

```tsx
<Accordion type="single" defaultValue="item-1" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>What is React?</AccordionTrigger>
    <AccordionContent>
      React is a JavaScript library for building user interfaces.
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-2">
    <AccordionTrigger>What is TypeScript?</AccordionTrigger>
    <AccordionContent>
      TypeScript is a strongly typed programming language.
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

### Single Mode (Collapsible)

Only one item can be expanded at a time. Users can collapse all items.

```tsx
<Accordion type="single" collapsible>
  {/* items */}
</Accordion>
```

### Single Mode (Non-Collapsible)

Only one item can be expanded, but at least one must always be open.

```tsx
<Accordion type="single" collapsible={false} defaultValue="item-1">
  {/* items */}
</Accordion>
```

### Multiple Mode

Multiple items can be expanded simultaneously.

```tsx
<Accordion type="multiple" defaultValue={["item-1", "item-2"]}>
  {/* items */}
</Accordion>
```

### Controlled Mode

Control the expanded state externally.

```tsx
// Single mode
const [value, setValue] = useState<string>("item-1");

<Accordion type="single" value={value} onValueChange={setValue} collapsible>
  {/* items */}
</Accordion>

// Multiple mode
const [values, setValues] = useState<string[]>(["item-1"]);

<Accordion type="multiple" value={values} onValueChange={setValues}>
  {/* items */}
</Accordion>
```

### Custom Icons

Customize the expand/collapse indicators.

```tsx
import { PlusIcon, MinusIcon, ChevronDownIcon, ChevronUpIcon } from "@kern-ui/accordion";

<AccordionTrigger
  expandedIcon={<MinusIcon className="w-4 h-4" />}
  collapsedIcon={<PlusIcon className="w-4 h-4" />}
>
  Click to expand
</AccordionTrigger>

// Position icons on the left
<AccordionTrigger iconPosition="left">
  Icon on the left
</AccordionTrigger>

// Hide icons completely
<AccordionTrigger iconPosition="none">
  No icon
</AccordionTrigger>
```

### Disabled States

Disable individual items or the entire accordion.

```tsx
// Disable individual item
<AccordionItem value="item-1" disabled>
  {/* content */}
</AccordionItem>

// Disable entire accordion
<Accordion type="single" disabled>
  {/* items */}
</Accordion>
```

### Custom Styling

Use the `classNames` prop for comprehensive styling.

```tsx
<Accordion
  type="single"
  collapsible
  classNames={{
    root: "divide-y divide-gray-200",
    item: "border-b border-gray-200",
    trigger: "flex w-full items-center justify-between px-4 py-4 text-left hover:bg-gray-50",
    content: "px-4 py-4 text-gray-600",
    icon: "h-4 w-4 text-gray-500 transition-transform duration-200",
  }}
>
  {/* items */}
</Accordion>

// Individual className props also available
<AccordionItem className="custom-item-class">
  <AccordionTrigger className="custom-trigger-class">
    Trigger
  </AccordionTrigger>
  <AccordionContent className="custom-content-class">
    Content
  </AccordionContent>
</AccordionItem>
```

### Keyboard Navigation

Full keyboard navigation is supported by default.

| Key | Action |
|-----|--------|
| `Space` / `Enter` | Toggle expanded state |
| `↓` / `↑` | Move to next/previous item (vertical mode) |
| `→` / `←` | Move to next/previous item (horizontal mode) |
| `Home` | Jump to first item |
| `End` | Jump to last item |
| `Tab` | Move focus out of accordion |

```tsx
// Vertical navigation (default)
<Accordion type="single" orientation="vertical">
  {/* items - use ↑↓ keys */}
</Accordion>

// Horizontal navigation
<Accordion type="single" orientation="horizontal">
  {/* items - use ←→ keys */}
</Accordion>

// Disable loop navigation
<Accordion type="single" loop={false}>
  {/* items - won't wrap around */}
</Accordion>
```

### RTL Support

Support for right-to-left languages.

```tsx
<Accordion type="single" dir="rtl" orientation="horizontal">
  {/* Left/right arrow keys are reversed */}
</Accordion>
```

### Animation Callbacks

Hook into animation lifecycle events.

```tsx
<AccordionContent
  animationDuration={300}
  onOpenStart={() => console.log("Opening...")}
  onOpenEnd={() => console.log("Opened")}
  onCloseStart={() => console.log("Closing...")}
  onCloseEnd={() => console.log("Closed")}
>
  Content
</AccordionContent>
```

### Force Mount

Keep content in DOM even when collapsed (useful for SEO or animations).

```tsx
<AccordionContent forceMount>
  This content stays in the DOM
</AccordionContent>
```

### Render Delegation (asChild)

Render accordion parts as different elements using the `asChild` prop.

```tsx
// Root as nav element
<Accordion type="single" asChild>
  <nav>
    {/* items */}
  </nav>
</Accordion>

// Item as section element
<AccordionItem value="item-1" asChild>
  <section>
    {/* trigger and content */}
  </section>
</AccordionItem>

// Content as article element
<AccordionContent asChild>
  <article>
    Content
  </article>
</AccordionContent>
```

### Nested Accordions

Accordions can be nested within each other.

```tsx
<Accordion type="single" collapsible>
  <AccordionItem value="parent-1">
    <AccordionTrigger>Parent Item</AccordionTrigger>
    <AccordionContent>
      <Accordion type="single" collapsible>
        <AccordionItem value="child-1">
          <AccordionTrigger>Child Item</AccordionTrigger>
          <AccordionContent>Nested content</AccordionContent>
        </AccordionItem>
      </Accordion>
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

---

## API Reference

### Accordion

The root component that wraps all accordion items.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `"single" \| "multiple"` | **required** | Whether one or multiple items can be open |
| `value` | `string \| string[]` | - | Controlled expanded value(s) |
| `defaultValue` | `string \| string[]` | - | Initial expanded value(s) for uncontrolled mode |
| `onValueChange` | `(value: string \| string[]) => void` | - | Callback when expanded items change |
| `collapsible` | `boolean` | `false` | Allow collapsing all items (single mode only) |
| `disabled` | `boolean` | `false` | Disable all items |
| `orientation` | `"vertical" \| "horizontal"` | `"vertical"` | Keyboard navigation direction |
| `dir` | `"ltr" \| "rtl"` | `"ltr"` | Text direction for RTL support |
| `loop` | `boolean` | `true` | Whether keyboard navigation wraps around |
| `id` | `string` | auto-generated | ID for predictable child element IDs |
| `aria-label` | `string` | - | Accessible label for the accordion |
| `headingLevel` | `1 \| 2 \| 3 \| 4 \| 5 \| 6` | `3` | Heading level for triggers (h1-h6) |
| `classNames` | `AccordionClassNames` | defaults | Custom classes for all parts |
| `className` | `string` | - | Additional CSS class for root |
| `asChild` | `boolean` | `false` | Render as child element instead of div |
| `onFocusCapture` | `(event: FocusEvent) => void` | - | Callback when focus enters |
| `onBlurCapture` | `(event: FocusEvent) => void` | - | Callback when focus leaves |

### AccordionItem

Wraps a single accordion item (trigger + content).

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | **required** | Unique identifier for this item |
| `disabled` | `boolean` | `false` | Disable this specific item |
| `className` | `string` | - | Additional CSS class |
| `asChild` | `boolean` | `false` | Render as child element instead of div |

### AccordionTrigger

The clickable button that toggles the accordion item.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | **required** | Trigger content |
| `expandedIcon` | `ReactNode` | ChevronDown (rotated) | Custom icon when expanded |
| `collapsedIcon` | `ReactNode` | ChevronDown | Custom icon when collapsed |
| `iconPosition` | `"left" \| "right" \| "none"` | `"right"` | Position of indicator icon |
| `className` | `string` | - | Additional CSS class |
| `asChild` | `boolean` | `false` | Render as child element instead of button |

### AccordionContent

The collapsible content panel.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | **required** | Content |
| `forceMount` | `boolean` | `false` | Keep in DOM when collapsed |
| `animationDuration` | `number` | `300` | Animation duration in ms |
| `onOpenStart` | `() => void` | - | Called when opening starts |
| `onOpenEnd` | `() => void` | - | Called when opening ends |
| `onCloseStart` | `() => void` | - | Called when closing starts |
| `onCloseEnd` | `() => void` | - | Called when closing ends |
| `className` | `string` | - | Additional CSS class |
| `asChild` | `boolean` | `false` | Render as child element instead of div |

### AccordionClassNames

Type definition for the `classNames` prop.

```typescript
interface AccordionClassNames {
  root?: string;    // Root accordion container
  item?: string;    // Each accordion item wrapper
  trigger?: string; // Trigger button
  content?: string; // Content panel inner wrapper
  icon?: string;    // Expand/collapse icon
}
```

---

## Data Attributes

All components expose data attributes for CSS styling:

| Attribute | Component | Values | Description |
|-----------|-----------|--------|-------------|
| `data-state` | Accordion | `"has-expanded" \| "all-closed"` | Whether any item is expanded |
| `data-state` | Item/Trigger/Content | `"open" \| "closed"` | Current expanded state |
| `data-disabled` | Item/Trigger/Content | Present when disabled | Whether item is disabled |
| `data-orientation` | All | `"vertical" \| "horizontal"` | Keyboard navigation direction |
| `data-type` | Accordion | `"single" \| "multiple"` | Accordion mode |

### CSS Styling Examples

```css
/* Style based on state */
[data-state="open"] > .trigger {
  background-color: #f0f0f0;
}

/* Style disabled items */
[data-disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Style based on orientation */
[data-orientation="horizontal"] {
  display: flex;
}
```

---

## ARIA Attributes

Automatically applied for accessibility:

| Attribute | Component | Description |
|-----------|-----------|-------------|
| `aria-expanded` | Trigger | Current expanded state (true/false) |
| `aria-controls` | Trigger | ID of the controlled content panel |
| `aria-labelledby` | Content | ID of the trigger that labels this content |
| `aria-hidden` | Content | Hidden from screen readers when collapsed |
| `role="region"` | Content | Identifies content as a region landmark |

---

## Accessibility

### WAI-ARIA Compliance

This accordion component follows the [WAI-ARIA Accordion Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/):

- Proper heading hierarchy using configurable heading levels (h1-h6)
- Full keyboard navigation support
- Screen reader friendly with proper ARIA attributes
- Focus management with visible focus indicators
- Supports RTL text direction for internationalization

### Keyboard Navigation

| Key | Action |
|-----|--------|
| `Enter` / `Space` | Toggle the focused accordion item |
| `↑` / `↓` | Navigate between items (vertical orientation) |
| `←` / `→` | Navigate between items (horizontal orientation) |
| `Home` | Jump to first item |
| `End` | Jump to last item |
| `Tab` | Move focus to next focusable element |

### Focus Management

- Focus ring is visible when navigating with keyboard
- Focus moves through accordion items in document order
- Disabled items are skipped during keyboard navigation
- Loop navigation can be enabled/disabled

---

## Exports

```typescript
// Components
export { Accordion } from "./Accordion";
export { AccordionItem } from "./components/AccordionItem";
export { AccordionTrigger } from "./components/AccordionTrigger";
export { AccordionContent } from "./components/AccordionContent";

// Icons
export { ChevronDownIcon, ChevronUpIcon, PlusIcon, MinusIcon } from "./utils/icons";

// Utilities
export { Slot } from "./utils/slot";

// Types
export type {
  AccordionProps,
  AccordionSingleProps,
  AccordionMultipleProps,
  AccordionItemProps,
  AccordionTriggerProps,
  AccordionContentProps,
  AccordionClassNames,
  AccordionType,
  Orientation,
  Direction,
  AnimationCallbacks,
  SlotProps,
} from "./utils/types";
```

---

## TypeScript

Full TypeScript support with exported types:

```typescript
import type {
  AccordionProps,
  AccordionSingleProps,
  AccordionMultipleProps,
  AccordionItemProps,
  AccordionTriggerProps,
  AccordionContentProps,
  AccordionClassNames,
} from "@kern-ui/accordion";
```

### Type Discrimination

The `AccordionProps` type uses discriminated unions based on the `type` prop:

```typescript
// Single mode
interface AccordionSingleProps {
  type: "single";
  collapsible?: boolean;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

// Multiple mode
interface AccordionMultipleProps {
  type: "multiple";
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
}
```

---

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

## License

MIT
