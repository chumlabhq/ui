# Global Engineering Rules

These rules apply to every step in the pipeline. Every step file references this document — do not duplicate these rules inside step files.

---

## 1. CORE PRINCIPLES

- Fix root causes, not symptoms
- Prefer system-level fixes over component-level patches
- Never break public APIs (props, exports, theme tokens)
- Maintain consistency across the system
- Do not introduce new dependencies without justification
- Every change must be traceable to an issue ID in `system-state.json`

---

## 2. SEVERITY LEVELS

🔴 **BLOCKER** — Pipeline FAILS if any of these exist:

- Security issues (XSS, injection, unsafe HTML)
- SSR crashes (window/document access without guard)
- Accessibility WCAG AA failures
- TypeScript compilation errors
- Broken UI (component does not render)
- Missing peer dependencies declared in code
- Public API regressions

🟡 **HIGH** — Must be fixed before ship:

- Performance regressions (render time > 16ms, bundle > 5kb gzipped per component)
- Missing test coverage on new code
- Responsive breakage at 320px or 1920px
- Theme inconsistency (light or dark mode breaks)
- Missing aria-* attributes on interactive elements
- TypeScript `any` types added in new code

🔵 **LOW** — Nice to fix, not blocking:

- Minor DX issues
- Cosmetic rendering imperfections
- Internal refactor opportunities
- Comment / doc cleanup

**Rule:** A pipeline phase fails only if 🔴 BLOCKERS exist. 🟡 HIGH issues require justification to defer (logged in `issues.deferred`). 🔵 LOW issues never block.

---

## 3. COMPONENT CONTRACT

Every component MUST satisfy:

- Fully typed (no `any`, no double assertions in new code)
- WCAG 2.1 AA compliant
- Responsive 320px → 1920px+
- Light + dark mode support
- SSR safe (no unguarded browser API access)
- No unsafe HTML rendering (`dangerouslySetInnerHTML` requires explicit security review)
- Has a `Basic Usage` demo
- Has a `.ai.md` knowledge file
- Has a `.schema.json` machine-readable file

---

## 4. SSR RULES

Never access browser APIs at module top-level or render-time. All access wrapped in:

```ts
if (typeof window !== "undefined") { ... }
```

OR via React `useEffect` (which only runs client-side).

Never use `useLayoutEffect` without an SSR-safe shim — replace with `useIsomorphicLayoutEffect`.

---

## 5. ACCESSIBILITY RULES

- Every interactive element is keyboard-reachable (tab order)
- Every interactive element has a visible focus state
- Every form control has an associated label (visible or aria-labelledby)
- Use semantic HTML first, ARIA only as supplement
- No keyboard traps
- All overlays return focus on close
- Color contrast ≥ 4.5:1 for normal text, ≥ 3:1 for large text and UI components

---

## 6. PERFORMANCE RULES

- Avoid inline style objects in render bodies (breaks `React.memo`)
- Wrap expensive subtrees in `React.memo`
- Memoize callbacks passed to memo'd children
- Never use array index as key for dynamic lists
- Per-component bundle size: target ≤ 5kb gzipped for default leaf components; class-specific higher ceilings apply for date/calendar, country/locale-aware, and composite form components — see `run.md` STRICT MODE for the per-class table
- No eager imports of heavy dependencies (lazy-load where possible)

---

## 7. SECURITY RULES

- No `dangerouslySetInnerHTML` without sanitization (DOMPurify or equivalent)
- All user input treated as untrusted
- No `eval`, `new Function`, or `setTimeout(string, …)`
- Validate prop types at runtime for security-sensitive components
- No PII or secrets in console logs
- No analytics calls embedded in the library

---

## 8. RESPONSIVE RULES

- Works 320px → 1920px+ without horizontal scroll
- No fixed widths in pixels for layout containers
- Use flex / grid / clamp() for fluid layouts
- Tap targets ≥ 44×44px
- Wrap tables, code blocks, and long content with `overflow-x: auto`
- Test at: 320, 375, 768, 1024, 1440, 1920

---

## 9. THEME RULES

- Light + dark mode required for every component
- No hardcoded colors — use design tokens (CSS vars or Tailwind tokens)
- Use `dark:` variants in Tailwind for dark-mode-specific styles
- Maintain WCAG AA contrast in both modes
- No `rgba()` colors that disappear in dark mode (e.g. black at low opacity on a dark bg)
- Test light + dark for every component

**FAIL if:** UI breaks in dark mode OR text becomes unreadable in either mode.

---

## 10. TYPESCRIPT RULES

- Strict mode enabled
- No `any` in new code (use `unknown` if type genuinely uncertain)
- No double assertions (`as unknown as X`) in new code — refactor instead
- Generics over union types where it preserves caller information
- Public types exported from package root

---

## 11. STATE MANAGEMENT CONTRACT

Every step that modifies the system MUST update `/ai/system-state.json`:

- Add new issues to the appropriate severity array
- Add fixes to `fixes` array with `id`, `fixed: [issueIds]`, `description`
- Update `coverage` percentages
- Update `validation` field results
- Set `pipeline.status` and timestamps
- Never delete history (deferred issues stay logged)

---

## 12. NAMING CONVENTIONS

- Issue IDs: `<TYPE>-<COMPONENT>-<NUMBER>` e.g. `A11Y-MODAL-001`, `SSR-DRAWER-002`
- Fix IDs: `FIX-<DESCRIPTION>` e.g. `FIX-SSR-DRAWER`
- Step files: `<NUMBER>-<NAME>.md` e.g. `01-audit.md`
- Component files: PascalCase matching component name

---

## 13. WHEN IN DOUBT

- If a rule conflicts with a step file's instruction, the step file wins
- If a step file conflicts with `run.md`, `run.md` wins
- If state and reality conflict, treat reality as truth and update state
- If unsure whether to fix or defer, defer with justification logged in `issues.deferred`
