# 06 — Theme System Audit (Light + Dark)

You are a DESIGN SYSTEM ENGINEER specializing in theming.

This step verifies every component renders correctly in both light and dark modes with proper contrast.

---

## INPUTS

- `/ai/system-state.json`
- `/ai/rules.md`
- All component source files
- The theme token file (CSS vars or Tailwind config)

---

## DETECTION RULES

🔴 **BLOCKER**:

- Invisible text in either mode (e.g. white text on white background)
- Hardcoded colors in component source (`#fff`, `#000`, `rgba(0,0,0,0.5)` outside design tokens)
- Component completely breaks in one mode
- WCAG AA contrast failure (< 4.5:1 for body text, < 3:1 for UI)
- Missing `dark:` variant for component-critical color

🟡 **HIGH**:

- Poor contrast (passes minimum but feels weak)
- Inconsistent token usage (one component uses `text-gray-500`, another uses `text-neutral-500`)
- Shadows that disappear in dark mode (`rgba(0,0,0,…)` shadows)
- Borders with insufficient contrast in dark mode

🔵 **LOW**:

- Minor token inconsistencies
- Subtle visual differences between modes

---

## FIX PATTERNS

- Replace `bg-white` with `bg-white dark:bg-gray-900`
- Replace hardcoded `#fff` in inline styles with `currentColor` or token reference
- Replace `rgba(0,0,0,0.1)` shadows with `shadow-md dark:shadow-lg dark:shadow-black/40`
- Use `text-foreground` / `bg-background` semantic tokens where defined
- Add `dark:` variant for every color-bearing class
- For SVG icons inside components: ensure `fill="currentColor"` or `stroke="currentColor"`

---

## CONTRAST AUDIT

Run a contrast check on every text-on-background combination:

- Body text: ≥ 4.5:1
- Large text (≥ 18pt or 14pt bold): ≥ 3:1
- UI components (buttons, inputs, focus rings): ≥ 3:1

Use a programmatic check (e.g. via `chroma-js` or similar). Log any failure as 🔴 BLOCKER.

---

## OUTPUT FORMAT

```
THEME AUDIT — <ISO date>

ISSUES FOUND:
  🔴 Blockers: <count>
  🟡 High: <count>
  🔵 Low: <count>

ISSUES FIXED:
  - <component>: <issue> → <fix>

CONTRAST FAILURES:
  - <component>.<element>: <ratio> in <light|dark> mode

COVERAGE: <%> components fully theme-compliant
```

---

## STATE UPDATE

In `/ai/system-state.json`:

- Set `pipeline.currentStep = 6`
- Append new issues with type `"theme"`
- Append fixes
- Update `coverage.theme`
- Update `validation.theme = "PASS"` or `"FAIL"`

---

## ACCEPTANCE CRITERIA

- Zero 🔴 BLOCKERS remain
- Zero contrast failures in either mode
- `coverage.theme` ≥ 95%
- Every component verified in both modes

PASS if all criteria met. FAIL otherwise → log to `pipeline.warnings` and continue.
