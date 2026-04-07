# Stepper

> A step progress indicator with numbered/icon variants, horizontal/vertical layouts, clickable steps, and keyboard navigation.

**Category:** Navigation
**Keywords:** stepper, progress, wizard, multi-step, workflow, steps, timeline

---

## Quick Answer

Use `<Stepper steps={[...]} value={activeStep} onValueChange={setActiveStep} />` for a controlled stepper. Steps have `id`, `label`, optional `description` and `icon`. Supports horizontal/vertical layouts and numbered/icon variants.

---

## Import

```tsx
import { Stepper } from "@chumlab/ui/stepper";
```

---

## Basic Usage (copy-paste ready)

```tsx
import { Stepper } from "@chumlab/ui/stepper";
import { useState } from "react";

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

## Prop Constraints

| Prop | Constraint |
|------|-----------|
| `steps` | Array of `Step` objects with `id` (required), `label`, `description`, `icon`. |
| `value` + `onValueChange` | Controlled mode. Must match a step `id`. |
| `isStepClickable` | Function `(step, index) => boolean`. Controls which steps are interactive. |
| `variant` | `"numbered"` (default) or `"icon"`. |
| `orientation` | `"horizontal"` (default) or `"vertical"`. |

---

## Accessibility

- Semantic `<ol>/<li>` markup
- `aria-current="step"` on active step
- `role="button"` only on clickable steps
- `focus-visible` ring on interactive steps
- Keyboard: Arrow keys to navigate, Enter/Space to activate

---

## Demo Reference

**File:** `src/pages/demo/StepperDemo.tsx`

| Feature | Search for |
|---------|-----------|
| Basic | `title="Basic Usage"` |
| Icon variant | `title="Icon Variant"` |
| Vertical | `title="Vertical"` |
| Error state | `title="Error State"` |
| Custom theme | `title="Custom Theme"` |

| File | Contains |
|------|----------|
| `Stepper.tsx` | Main component with forwardRef, keyboard nav |
| `utils/types.ts` | StepperProps, StepperClasses, Step, StepStatus |
| `utils/constants.ts` | DEFAULT + UNSTYLED classes |
| `utils/icons.tsx` | CheckIcon, ErrorIcon |
