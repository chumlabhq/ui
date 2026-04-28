# 10 — Component Schema

You are a DESIGN SYSTEM ENGINE generating machine-readable schemas.

This step generates a `<Component>.schema.json` file for every component. These schemas are consumed by:

- The component index (step 13)
- The semantic text layer (step 14)
- External tooling that wants to understand the library programmatically

---

## INPUTS

- All components in `src/components/`
- TypeScript prop types (the source of truth for prop names and types)
- The `<Component>.ai.md` from step 09 (for descriptions)
- `/ai/system-state.json`

---

## OUTPUT LOCATION

For each component:

`src/components/<Component>/<COMPONENT>.schema.json`

---

## STRICT JSON STRUCTURE

```json
{
  "name": "ComponentName",
  "category": "form | layout | display | overlay | navigation | feedback",
  "description": "Single-sentence description (from .ai.md 'What this is' section)",

  "props": {
    "<propName>": {
      "type": "string | boolean | number | enum | function | node | object",
      "required": true,
      "values": ["..."],
      "default": "<default value or null>",
      "description": "Behavior, not just type"
    }
  },

  "states": ["idle", "active", "disabled", "loading", "error"],

  "a11y": {
    "role": "button | dialog | listbox | …",
    "keyboard": ["Enter", "Space", "Escape", "ArrowUp", "ArrowDown"],
    "ariaSupports": ["aria-label", "aria-describedby", "aria-expanded"]
  },

  "responsive": true,

  "theme": {
    "supportsDarkMode": true,
    "tokensUsed": ["--accent", "--bg-overlay", "--text-primary"]
  },

  "ssr": "safe",

  "dependencies": ["react"],

  "complexity": "simple | moderate | complex"
}
```

---

## EXTRACTION RULES

- Props come from TypeScript types — do NOT hallucinate props
- Detect enum values from union types (`type Variant = "primary" | "secondary"`)
- States are inferred from component behavior + visual variants
- Keyboard interactions come from event handlers in the source
- ARIA roles come from the source code (find `role={...}` and ARIA attributes)
- Description comes from the `.ai.md` "What this is" section, not invented
- `tokensUsed` comes from a static scan of theme tokens referenced in the component

---

## CATEGORY GUIDE

- **form** — Inputs, selects, checkboxes, anything in a form
- **layout** — Grids, panels, dividers, spacing primitives
- **display** — Avatar, badge, card, table, list
- **overlay** — Modal, drawer, toast, tooltip, popover
- **navigation** — Breadcrumb, tabs, pagination, stepper
- **feedback** — Loader, progress, alert, skeleton

---

## VALIDATION RULES (strict)

For each generated schema:

- `name` matches component file name
- `category` is one of the 6 allowed values
- Every prop's `type` is one of the 7 allowed values
- For `type: "enum"`, `values` is non-empty
- `states` is an array of strings, never empty
- `a11y.keyboard` is an array (may be empty for non-interactive)
- `theme.supportsDarkMode` is boolean
- `ssr` is `"safe"` or `"unsafe"` (and `"unsafe"` triggers a 🔴 BLOCKER)

---

## OUTPUT FORMAT

```
SCHEMA GENERATION — <ISO date>

SCHEMAS CREATED: <count>
SCHEMAS UPDATED: <count>
COMPONENTS COVERED: <count>/<total>

MISSING:
  - <component name> (reason)

VALIDATION ERRORS: <count>
  - <component>: <error>
```

---

## STATE UPDATE

In `/ai/system-state.json`:

- Set `pipeline.currentStep = 10`
- `coverage.schema` = (count valid / total) × 100
- `validation.schema = "PASS"` if all valid

---

## ACCEPTANCE CRITERIA

- Every component has a `.schema.json` file
- Every schema validates against the strict structure above
- Props match TypeScript source exactly
- No hallucinated props or values

PASS if all criteria met. FAIL otherwise.
