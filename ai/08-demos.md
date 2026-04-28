# 08 — Component Demos

You are a DX engineer ensuring every component has a working example.

This step ensures every public component has a `Basic Usage` demo that is copy-paste-ready and renders correctly.

---

## INPUTS

- `/ai/system-state.json`
- All components in `src/components/`
- The demos folder (typically `src/demos/` or `apps/web/src/demos/`)

---

## OBJECTIVE

Every public component MUST have:

1. A `Basic Usage` demo file at `src/demos/<Component>/BasicUsage.tsx` (or matching project structure)
2. The demo imports the component from the package's public entry (NOT relative path)
3. The demo is minimal — shows only what's needed to use the component
4. The demo renders without errors in light AND dark modes
5. The demo is referenced from the docs page for that component

---

## DEMO STRUCTURE

Every demo follows this exact pattern:

```tsx
import { ComponentName } from "@chumlab/ui";

export default function BasicUsage() {
  return (
    <ComponentName /* minimal required props */ />
  );
}
```

For interactive components, add the minimum state needed to demonstrate the interaction:

```tsx
import { useState } from "react";
import { Combobox } from "@chumlab/ui";

const options = [
  { value: "a", label: "Option A" },
  { value: "b", label: "Option B" },
];

export default function BasicUsage() {
  const [value, setValue] = useState<string>("");
  return <Combobox options={options} value={value} onChange={setValue} />;
}
```

---

## REQUIREMENTS

For every demo:

- [ ] Imports from `@chumlab/ui` (the public package), not from relative paths
- [ ] Uses minimum props required to render
- [ ] Includes any required state/callbacks for interactive components
- [ ] No external dependencies beyond React
- [ ] Renders successfully in light mode
- [ ] Renders successfully in dark mode
- [ ] Has a default export
- [ ] Does NOT use TypeScript-only syntax that would fail in a JS sandbox (avoid `as` casts; prefer explicit types on hooks)

---

## OUTPUT FORMAT

```
DEMO AUDIT — <ISO date>

COMPONENTS WITH DEMOS: <count>/<total>
COMPONENTS MISSING DEMOS: <count>
  - <component name>: <reason>

DEMOS UPDATED: <count>
  - <component>: <reason for update>

DEMOS CREATED: <count>
  - <component>

VERDICT: <PASS | FAIL>
```

---

## STATE UPDATE

In `/ai/system-state.json`:

- Set `pipeline.currentStep = 8`
- Update `validation.demos = "PASS"` or `"FAIL"`
- Add `coverage.demos = "<percent>"`

---

## ACCEPTANCE CRITERIA

- Every public component listed in `system-state.components` has a demo
- Every demo file follows the structure above
- Every demo renders in both light and dark modes
- Demos are referenced from their corresponding docs pages

PASS if all criteria met. FAIL otherwise.
