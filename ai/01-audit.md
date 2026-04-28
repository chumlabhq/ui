# 01 — System Audit

You are a STAFF+ FRONTEND ARCHITECT performing a complete system audit.

This step finds issues. It does NOT fix them. Fixing happens in step 02.

---

## INPUTS

- Entire repository
- `/ai/system-state.json`
- `/ai/rules.md`

---

## OBJECTIVE

Produce a comprehensive audit across all dimensions of `/ai/rules.md`. Every interactive component must be inspected. Every issue must be classified.

---

## AUDIT DIMENSIONS

For every component in `src/components/` check:

1. **Architecture**
   - Public API stable
   - No circular deps
   - File structure matches convention

2. **TypeScript**
   - No errors
   - No `any` in new code
   - No unsafe double assertions

3. **SSR safety**
   - No unguarded `window` / `document` / `localStorage` / `navigator`
   - No `useLayoutEffect` without SSR-safe shim
   - No browser APIs at module top-level

4. **Accessibility**
   - Keyboard reachable
   - Focus visible
   - Correct ARIA roles
   - Labels present
   - No keyboard traps
   - Color contrast WCAG AA

5. **Responsive**
   - Works 320px → 1920px
   - No fixed pixel widths on layout containers
   - Tap targets ≥ 44×44px
   - Tables / code wrap or scroll

6. **Theme (light + dark)**
   - All states render correctly in both modes
   - No hardcoded colors
   - No invisible elements (e.g. low-opacity black on dark bg)
   - Contrast maintained in both modes

7. **Performance**
   - Inline style objects (memoization breakers)
   - Missing `React.memo` on pure leaves
   - Index-as-key in dynamic lists
   - Re-renders triggered by parent

8. **Security**
   - No `dangerouslySetInnerHTML` without sanitization
   - No `eval` / `Function` constructor
   - No PII in logs

9. **Documentation**
   - `Basic Usage` demo present
   - `.ai.md` and `.schema.json` exist
   - JSDoc on public exports

---

## ISSUE CLASSIFICATION

Every issue gets:

```json
{
  "id": "<TYPE>-<COMPONENT>-<NUMBER>",
  "type": "ssr | a11y | theme | responsive | type-safety | performance | security | docs",
  "severity": "blocker | high | low",
  "component": "<name>",
  "file": "<path>",
  "description": "<one sentence>",
  "evidence": "<line ref or code snippet if useful>",
  "status": "open"
}
```

Severity rules from `/ai/rules.md` apply.

---

## OUTPUT FORMAT

```
SYSTEM AUDIT — <ISO date>

SCOPE: <count> components, <count> demos, <count> support files

🔴 BLOCKERS: <count>
  - <ID>: <description> (<file>)
  …

🟡 HIGH: <count>
  - <ID>: <description> (<file>)
  …

🔵 LOW: <count>
  - <ID>: <description> (<file>)
  …

ROOT CAUSES:
  <pattern observed across components, e.g. "5 components access window.matchMedia at module top-level">

AFFECTED COMPONENTS:
  <list>
```

---

## STATE UPDATE

In `/ai/system-state.json`:

- Set `pipeline.currentStep = 1`, `pipeline.stepName = "01-audit"`, `pipeline.status = "RUNNING"`
- Append all findings to `issues.blockers`, `issues.high`, `issues.low`
- Do not delete existing entries
- After completion: `pipeline.status = "PASS"` and write `completedAt`

---

## RULES FOR THIS STEP

- Do NOT fix any issue — fixing is step 02
- Do NOT make recommendations — only classify
- Be exhaustive. An incomplete audit causes downstream failures.
- Treat each component as independent
- If a finding is ambiguous, log it as 🔵 LOW with note "needs review"

---

## ACCEPTANCE CRITERIA

- Every component in `src/components/` has been inspected (count == file count)
- Every finding has an issue ID, severity, file path
- Output classifies every finding into exactly one severity
- `system-state.json` updated atomically (no partial writes)

PASS if all criteria met. FAIL otherwise.
