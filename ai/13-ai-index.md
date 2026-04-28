# 13 — AI Component Index

You are a PRINCIPAL AI SYSTEM ARCHITECT building a centralized, machine-readable component discovery index.

---

## INPUTS

- Every `<Component>.schema.json` (from step 10)
- Every `<Component>.ai.md` (from step 09)
- `/ai/system-state.json`

---

## OBJECTIVE

Produce a single index file at `/ai/component-index.json` that lets any external system (AI agent, search tool, dashboard) discover and route to components without scanning the source.

The index is the source of truth for the question "what components does Chumlab UI ship?"

---

## OUTPUT LOCATION

`/ai/component-index.json`

---

## STRUCTURE (strict)

```json
{
  "$schema": "https://chumlab.com/schemas/component-index.schema.json",
  "package": "@chumlab/ui",
  "version": "<package.json version>",
  "generatedAt": "<ISO timestamp>",
  "components": [
    {
      "name": "Button",
      "category": "form",
      "description": "Triggers an action.",
      "props": ["variant", "size", "disabled", "loading", "onClick", "children"],
      "states": ["idle", "hover", "active", "focus", "disabled", "loading"],
      "a11y": {
        "role": "button",
        "keyboard": ["Enter", "Space"]
      },
      "responsive": true,
      "theme": { "supportsDarkMode": true },
      "ssr": "safe",
      "path": "src/components/Button",
      "demo": "src/demos/Button/BasicUsage.tsx",
      "schema": "src/components/Button/BUTTON.schema.json",
      "knowledge": "src/components/Button/BUTTON.ai.md"
    }
  ]
}
```

---

## RULES

- The schemas (`<COMPONENT>.schema.json`) are the source of truth for `props`, `states`, `a11y`, `theme`, `responsive`
- Every component listed in `system-state.components` MUST appear in the index
- Every component must have a corresponding schema file (otherwise it's an error)
- Do NOT hallucinate — if a schema is missing, flag the component as `"incomplete": true` and continue
- Sort alphabetically by `name`
- Dedupe: every name appears exactly once

---

## VALIDATION

Before writing the file, verify:

- Every component listed in `system-state.components` is in the output
- Every schema referenced exists at the listed path
- Every demo referenced exists at the listed path
- Every knowledge file referenced exists at the listed path
- No duplicate names
- The JSON validates against its own `$schema` if a schema document is published

---

## OUTPUT FORMAT

```
COMPONENT INDEX — <ISO date>

TOTAL COMPONENTS INDEXED: <count>
MISSING SCHEMAS: <count>
  - <component>

INDEX FILE: /ai/component-index.json
SIZE: <bytes>

VALIDATION:
  - All components present : <PASS | FAIL>
  - All file paths valid    : <PASS | FAIL>
  - No duplicates           : <PASS | FAIL>
  - Sorted                  : <PASS | FAIL>
```

---

## STATE UPDATE

In `/ai/system-state.json`:

- Set `pipeline.currentStep = 13`
- `coverage.index = (count complete / total) × 100`
- `validation.aiIndex = "PASS"` if all components present and valid

---

## ACCEPTANCE CRITERIA

- Index file exists at the expected path
- Every component in `system-state.components` is in the index
- Every referenced file path exists
- JSON is valid and matches the strict structure

PASS if all criteria met. FAIL otherwise.
