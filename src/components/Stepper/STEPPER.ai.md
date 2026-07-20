# Stepper

> A step progress indicator with numbered/icon/dot variants, horizontal/vertical layouts, clickable steps, tooltips, and keyboard navigation.

**Category:** Navigation
**Keywords:** stepper, progress, wizard, multi-step, workflow, steps, timeline, numbered, icon, dot, horizontal, vertical

---

## Quick Answer

Use `<Stepper steps={[...]} value={activeStep} onValueChange={setActiveStep} />` for a controlled stepper. Steps have `id`, `label`, optional `description` and `icon`. Supports horizontal/vertical layouts, numbered/icon/dot variants, tooltips, non-linear navigation, and responsive sizing. Works out-of-the-box with built-in Tailwind styles.

---

## Import

```tsx
import { Stepper } from "@chumlab/ui/stepper";
import type { Step, StepStatus, StepperProps } from "@chumlab/ui/stepper";
```

---

## Basic Usage (copy-paste ready)

```tsx
import { useState } from "react";
import { Stepper } from "@chumlab/ui/stepper";

const steps = [
  { id: 1, label: "Account" },
  { id: 2, label: "Profile" },
  { id: 3, label: "Review" },
];

export default function Example() {
  const [active, setActive] = useState<string | number>(1);
  return (
    <Stepper
      steps={steps}
      value={active}
      onValueChange={setActive}
      isStepClickable={() => true}
    />
  );
}
```

---

## Prop Constraints (critical for correct usage)

| Prop | Constraint |
|------|-----------|
| `steps` | **Required.** Array of `Step` objects with `id` (unique). |
| `value` + `onValueChange` | Controlled mode — both needed together. |
| `defaultValue` | Uncontrolled mode — do not combine with `value`. |
| `isStepClickable` | Function `(stepId, status) => boolean`. Controls which steps are interactive. |
| `beforeStepChange` | Return `false` to prevent navigation. |
| `variant` | `"numbered"` (default), `"icon"`, or `"dot"`. |
| `orientation` | `"horizontal"` (default) or `"vertical"`. |
| `labelPosition` | `"right"` (default) or `"bottom"`. Only applies to horizontal. |
| `showTooltips` | Requires `tooltip` property on individual steps. |
| `getStepStatus` | Overrides default status logic. Must handle all steps. |
| `renderStep` | Custom renderer. Receives `(props, defaultElement)`. |
| `unstyled` | Strips all defaults. Must provide styling via `classes`. |

---

## Data Attributes (for CSS selectors and testing)

**Root (`<div>`):**
- `data-orientation` — `"horizontal"` or `"vertical"`
- `data-variant` — `"numbered"`, `"icon"`, or `"dot"`
- `data-disabled` — present when globally disabled
- `data-reduce-motion` — present when reduced motion active

**Step `<li>`:**
- `data-status` — `"pending"`, `"active"`, `"completed"`, or `"error"`
- `data-orientation` — inherited from parent

**Connector:**
- `data-status` — status of the step before
- `data-next-status` — status of the step after

DOM nesting: `root(nav) > ol(list) > li(stepContainer) > button/div(step) > indicator + labelWrapper(label + description) + connector`

---

## All Props

<!-- generated from Stepper.schema.json — edit the schema, not this table -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `steps` **(required)** | array | — | Array of step definitions. |
| `value` | string \| number | — | Controlled active step ID. |
| `defaultValue` | string \| number | — | Default uncontrolled active step ID. |
| `onValueChange` | object | — | (stepId: string \| number) => void — Callback fired when the active step changes. |
| `beforeStepChange` | object | — | (nextStepId: string \| number, currentStepId: string \| number) => boolean — Guard callback invoked before changing steps. Return false to prevent the change. |
| `orientation` | `"horizontal"` \| `"vertical"` | `"horizontal"` | Layout orientation of the stepper. |
| `variant` | `"numbered"` \| `"icon"` \| `"dot"` | `"numbered"` | Visual variant of the step indicators. |
| `activationMode` | `"automatic"` \| `"manual"` | `"manual"` | Whether steps activate automatically on focus or require manual activation. |
| `isStepClickable` | object | — | (stepId: string \| number, status: StepStatus) => boolean — Determines whether a step is clickable. |
| `getStepStatus` | object | — | (stepId: string \| number, index: number, activeIndex: number) => StepStatus — Custom function to determine step status. |
| `showLabels` | boolean | `true` | Whether to show step labels. |
| `showDescriptions` | boolean | `false` | Whether to show step descriptions. |
| `showConnectors` | boolean | `true` | Whether to show connectors between steps. |
| `labelPosition` | `"bottom"` \| `"right"` | `"right"` | Position of step labels relative to the indicator. |
| `completedIcon` | object | — | React.ComponentType \| React.ReactNode — Default icon for completed steps. |
| `errorIcon` | object | — | React.ComponentType \| React.ReactNode — Default icon for error steps. |
| `fullWidth` | boolean | `false` | Whether the stepper expands to fill its container. |
| `aria-label` | string | — | Accessible label for the stepper. |
| `showTooltips` | boolean | `false` | Whether to show tooltips on steps. |
| `tooltipDefaults` | object | — | Default tooltip configuration applied to all step tooltips. |
| `indicatorSize` | number | — | Override indicator size in pixels for connector alignment. Defaults: dot=12, icon=40, numbered=32. |
| `reduceMotion` | boolean \| `"auto"` | — | Controls motion preferences. 'auto' respects the user's OS setting. |
| `classes` | object | — | CSS class overrides for sub-elements. |
| `unstyled` | boolean | `false` | When true, removes all default styling. |
| `className` | string | — | CSS class for the root element. |
| `style` | object | — | Inline styles applied to the root element. |
| `id` | string | — | HTML id attribute. |
| `disabled` | boolean | `false` | Whether the entire stepper is disabled. |
| `loop` | boolean | `false` | Whether keyboard navigation loops from last step to first. |
| `renderStep` | object | — | (props: StepRenderProps, defaultElement: ReactElement) => ReactNode — Custom step render function. |

## Styling Guide

### How class merging works

1. **Default** — uses `DEFAULT_STEPPER_CLASSES`
2. **Partial override** (`classes` without `unstyled`) — **replaces** per slot, not additive
3. **Unstyled** (`unstyled={true}`) — all slots empty, you build from scratch

### Slot → visual mapping

```
root (nav, data-orientation, data-variant)
└── list (ol, flex horizontal or flex-col vertical)
    ├── stepContainer (li)
    │   └── step (button or div)
    │       ├── indicator (rounded-full, sized per variant)
    │       │   └── indicatorIcon (check/error/number/dot)
    │       └── labelWrapper
    │           ├── label
    │           └── description
    ├── connector (li, flex-1)
    │   └── connectorHorizontal or connectorVertical
    └── ... more steps
```

| "I want to change..." | Slot to use | Notes |
|------------------------|-------------|-------|
| Indicator circle | `indicator` + status classes (`indicatorActive`, etc.) | |
| Step number/icon inside | `indicatorIcon` | |
| Step label text | `label` + status classes (`labelActive`, etc.) | |
| Step description | `description` + status classes | |
| Connecting line | `connectorHorizontal` / `connectorVertical` + status classes | |
| Clickable step hover | `stepInteractive` | |
| Disabled step | `stepDisabled` | |

### Dark mode

Defaults use Tailwind `dark:` prefix for labels, descriptions, and connectors. When overriding, always provide both variants.

### Responsive sizing

Default classes include responsive sizing: indicators, labels, descriptions, gaps, and padding are smaller on mobile (`< 640px`) and scale up at `sm:` breakpoint. Horizontal steppers use `overflow-x-auto` for scroll on narrow screens.

---

## Patterns

### Icon variant with descriptions

```tsx
const steps = [
  { id: 1, label: "Account", description: "Set up your account", icon: UserIcon },
  { id: 2, label: "Payment", description: "Add payment method", icon: CreditCardIcon },
  { id: 3, label: "Confirm", description: "Review and submit", icon: CheckIcon },
];
<Stepper steps={steps} variant="icon" showDescriptions labelPosition="bottom" fullWidth />
```

### Vertical layout

```tsx
<Stepper steps={steps} orientation="vertical" />
```

### Non-linear navigation

```tsx
<Stepper steps={steps} isStepClickable={() => true} />
```

### Error state with custom status

```tsx
<Stepper
  steps={steps}
  getStepStatus={(id, index, activeIndex) => {
    if (index === 1) return "error";
    if (index < activeIndex) return "completed";
    if (index === activeIndex) return "active";
    return "pending";
  }}
/>
```

### Step change prevention

```tsx
<Stepper
  steps={steps}
  beforeStepChange={(next, current) => {
    if (!isFormValid()) return false;
    return true;
  }}
/>
```

---

## Accessibility

- `role="navigation"` with `aria-label="Progress"` on root (configurable)
- Semantic `<ol>/<li>` markup for step sequence
- `aria-current="step"` on active step
- `role="group"` on non-interactive steps
- Interactive steps rendered as `<button>` elements
- Roving tabIndex (one tabbable step at a time)
- Arrow keys navigate between steps
- Enter/Space activates focused step
- `aria-disabled` on disabled steps
- `aria-hidden="true"` on decorative connectors and step numbers
- `aria-label` fallback "Step X of Y" when labels hidden
- `focus-visible:ring-2` for keyboard focus indicators
- `motion-reduce:transition-none` respects reduced motion
- Loop navigation via `loop` prop

---

## Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| Steps not clickable | Default only allows completed+active | Use `isStepClickable={() => true}` for all |
| Styles wrong after overriding one class | `classes` replaces per slot | Provide full class string |
| Labels not showing | `showLabels` defaults to `true` but `variant="dot"` may hide them | Set `showLabels={true}` explicitly |
| Descriptions not showing | `showDescriptions` defaults to `false` | Set `showDescriptions={true}` |
| Connectors missing | `showConnectors` set to `false` | Set `showConnectors={true}` (default) |
| Stepper overflows on mobile | Many steps in horizontal mode | Default includes `overflow-x-auto`; reduce steps or use vertical |
| Error state not showing | Default status logic doesn't set error | Use `getStepStatus` to return `"error"` |
| Tooltip not appearing | `showTooltips` not set | Add `showTooltips` and `tooltip` on steps |

---

## Demo Reference

**File:** `src/pages/demo/StepperDemo.tsx`

| Feature | Search for |
|---------|-----------|
| Minimal example | `title="Basic Usage"` |
| Uncontrolled | `title="Uncontrolled Usage"` |
| Icon variant | `title="Icon Variant with Descriptions"` |
| Vertical | `title="Vertical Stepper"` |
| Dot variant | `title="Dot Variant"` |
| Hidden connectors | `title="Hidden Connectors"` |
| Error state | `title="Error State"` |
| Disabled steps | `title="Disabled Steps"` |
| Globally disabled | `title="Globally Disabled"` |
| Non-linear | `title="Non-linear Navigation"` |
| Step prevention | `title="Step Change Prevention"` |
| Keyboard loop | `title="Keyboard Navigation with Loop"` |
| Auto activation | `title="Automatic Activation Mode"` |
| Custom icons | `title="Custom Completed & Error Icons"` |
| Per-step icons | `title="Per-Step Icon Overrides"` |
| Custom styling | `title="Custom Styling"` |
| Full width | `title="Full Width"` |
| Tooltips | `title="With Tooltips (Simple)"` |
| Tooltip config | `title="With Tooltips (Custom Config)"` |
| Custom renderer | `title="Custom Step Rendering"` |
| Ref forwarding | `title="Ref Forwarding"` |

### Source file index

| File | Contains |
|------|----------|
| `Stepper.tsx` | Main component, step item variants, keyboard nav, tooltip integration |
| `utils/types.ts` | StepperProps, StepperClasses, Step, StepStatus, StepRenderProps, tooltip types |
| `utils/constants.ts` | DEFAULT + UNSTYLED class maps |
| `utils/icons.tsx` | CheckIcon, ErrorIcon, DotIcon |
| `index.ts` | Public exports |
| `__tests__/` | Unit tests |
