# SELF-IMPROVEMENT PATCH — Chumlab UI

**Date:** 2026-04-03
**Architect:** Principal Architect (System + Prompt Optimizer)

---

## INPUT

- **Audit report:** 8 blockers (B1-B8), 14 high-risk issues (H1-H14)
- **Fix summary:** B1-B5, B8, H1-H3, H8-H9 resolved. B6-B7, H4-H7, H10-H14 deferred.
- **Verification:** 1497/1497 tests pass, 0 type errors, 0 lint warnings. Verdict: NOT SAFE TO SHIP (e2e gaps, JSDoc gaps).

---

## 1. MISSED ISSUES

### A. isBrowser Import Missing from Dropdown/helpers.ts
- **What happened:** SSR fix agent added `isBrowser` usage but used `export { isBrowser } from ...` (re-export only, no local binding). This crashed all Dropdown tests.
- **Root cause:** Agent confused `export { X } from` (re-export) with `import { X } from` (local import).
- **Detection gap:** No type-check was run between fix and test.

### B. Pagination aria-label Broke Test Accessible Name Queries
- **What happened:** Adding `aria-label="${option} rows per page"` to options that already had text content changed the accessible name from "50" to "50 rows per page", breaking `getByRole("option", { name: "50" })`.
- **Root cause:** Agent didn't check if text content already provided an accessible name before adding aria-label.
- **Detection gap:** No test run after accessibility fixes.

### C. SearchableDropdown Duplicate "No Results" Text
- **What happened:** Agent changed status message from "0 options available" to "No results found", duplicating the visible empty state text, breaking `getByText`.
- **Root cause:** Agent didn't check that the visible component already rendered "No results found" separately.
- **Detection gap:** No awareness of existing visible text vs. SR-only text distinction.

---

## 2. WEAK DETECTION AREAS

### A. SSR Guards
- **Current:** Audit found 8 files with window/document access. Agent fix missed import issue.
- **Improvement:** Run `tsc --noEmit` AND `vitest run` after EACH file modification, not in batch.

### B. Accessibility
- **Current:** Audit flagged missing accessible names correctly, but fix introduced regressions by adding redundant aria-labels.
- **Improvement:** Before adding aria-label, verify: does the element already have an accessible name via text content, aria-labelledby, or title? Only add aria-label if no accessible name exists.

### C. Test Awareness
- **Current:** Fixes applied without consulting test expectations.
- **Improvement:** Read test file for any component before modifying that component.

---

## 3. PROMPT IMPROVEMENTS

### A. Audit Prompt Additions

```
ADDITIONAL AUDIT RULES:
- For each SSR issue: verify the isBrowser utility exists AND document the exact import path needed.
- For each accessibility issue: document whether the element ALREADY has an accessible name (via text content, aria-label, or aria-labelledby) vs. truly missing one.
- For each consistency issue: note whether fixing it would break existing test assertions.
- After detecting deprecated props: check if the deprecated prop is TESTED and whether removal would break tests.
```

### B. Fix Prompt Additions

```
ADDITIONAL FIX RULES:
- After EVERY file edit, run `tsc --noEmit` before moving to the next file.
- Before modifying accessibility attributes, read the component's test file to understand expected accessible names.
- When adding imports: NEVER use `export { X } from` when you need a local binding. Use `import { X } from` followed by separate `export { X }` if re-export is also needed.
- When adding aria-label to elements with text content: the aria-label OVERRIDES the text content as the accessible name. Only add it if the text content is insufficient.
- When adding SR-only status text: ensure the text is DIFFERENT from any visible text to avoid duplicate element queries in tests.
```

### C. Verify Prompt Additions

```
ADDITIONAL VERIFICATION RULES:
- Run full test suite (`vitest run`) as the FIRST validation step, not just tsc.
- Check for new console.warn/error output in test runs that wasn't there before.
- Verify that aria-live regions don't duplicate visible text.
- Verify that new imports are actual imports (not just re-exports) when used locally.
```

---

## 4. NEW RULES TO ADD

### Rule 1: Test-Before-Fix
Before modifying any component file, read its `__tests__/*.test.tsx` file to understand:
- What accessible names are queried (getByRole name parameter)
- What text content is queried (getByText)
- What ARIA attributes are asserted

### Rule 2: Import vs Re-export
- `import { X } from "path"` — creates a local binding, usable in the file
- `export { X } from "path"` — creates a re-export, NOT usable locally
- When you need BOTH: `import { X } from "path"; export { X };`

### Rule 3: Accessible Name Priority
Per WAI-ARIA name computation: aria-labelledby > aria-label > text content > title. Adding aria-label to an element with sufficient text content CHANGES the accessible name. Never add aria-label unless text content is missing or inadequate.

### Rule 4: SR-Only Text Must Be Unique
Visually hidden status regions (aria-live) must use text that differs from any visible text in the same component tree to avoid `getByText` ambiguity.

### Rule 5: Incremental Validation
After each file modification:
1. `tsc --noEmit` (type safety)
2. `vitest run <component>` (unit tests)
3. Only proceed to next file if both pass

---

## 5. PATTERN FIXES

### Pattern: SSR Guard Application
```typescript
// WRONG: re-export only, no local binding
export { isBrowser } from "../../utils/isBrowser";
const x = isBrowser ? window.foo : fallback; // ReferenceError!

// CORRECT: import for local use + re-export if needed
import { isBrowser } from "../../utils/isBrowser";
export { isBrowser };
const x = isBrowser ? window.foo : fallback; // Works
```

### Pattern: Accessibility Fix for Options
```tsx
// WRONG: adds aria-label when text content already exists
<div role="option" aria-label={`${option} rows per page`}>
  {option}  {/* "50" — this already provides accessible name "50" */}
</div>

// CORRECT: text content is the accessible name, use aria-label only if no text
<div role="option">
  {option}  {/* accessible name: "50" */}
</div>
```

### Pattern: SR-Only Status vs Visible Text
```tsx
// WRONG: SR-only duplicates visible text
<div>No results found</div>  {/* visible */}
<div style={SR_ONLY_STYLE} aria-live="polite">No results found</div>  {/* SR — DUPLICATE */}

// CORRECT: SR-only provides different context
<div>No results found</div>  {/* visible */}
<div style={SR_ONLY_STYLE} aria-live="polite">0 options available</div>  {/* SR — distinct */}
```

---

## 6. FAILURE PREVENTION STRATEGIES

### Strategy 1: Gate-Based Fix Pipeline
Each fix must pass through gates:
1. **Pre-fix:** Read component file + test file
2. **Fix:** Apply minimal change
3. **Gate 1:** tsc --noEmit passes
4. **Gate 2:** Component tests pass
5. **Post-fix:** Move to next component

### Strategy 2: Accessibility Regression Prevention
Before any a11y fix:
- Grep test file for `getByRole`, `getByText`, `getByLabelText`
- Document current accessible names
- Verify fix doesn't change names that tests depend on

### Strategy 3: SSR Fix Validation
After any SSR guard fix:
- Verify the guard variable is imported (not just re-exported)
- Check if the function is called at module level (needs different pattern than in useEffect)
- Run tests in jsdom (simulates missing window APIs)

### Strategy 4: Deferred Work Tracking
Issues deferred from this cycle should be tracked as tech debt:
- B6: E2E tests for 13 components
- B7: JSDoc for 39 component files
- H4-H7: Performance optimizations
- H10-H14: Consistency improvements

---

## [SELF-IMPROVEMENT PATCH]

Append to system prompt:

```
CRITICAL RULES (learned from Chumlab UI audit cycle):

1. NEVER use `export { X } from "path"` when X is used locally in the same file. Use `import` + separate `export`.
2. NEVER add aria-label to elements that already have accessible names via text content.
3. NEVER add SR-only text that duplicates visible text in the same component tree.
4. ALWAYS read the test file before modifying a component.
5. ALWAYS run type-check and component tests after EACH file modification.
6. When fixing SSR issues, verify the guard utility is IMPORTED, not just re-exported.
7. When fixing accessibility, document the current accessible name BEFORE changing it.
8. Deferred issues must be explicitly listed with severity — never silently drop them.
```
