# CHUMLAB DESIGN SYSTEM — AUDIT REPORT (v2)

## 1. SYSTEM MODEL (Inferred)

- **Name**: chumlab v0.1.0
- **Type**: React 19 component library / design system
- **Stack**: React 19.2.0, TypeScript ~5.9.3, Tailwind CSS 4.1.18, Vite 7.2.4
- **Components**: 32 components across 6 categories
- **Architecture**: Compound component pattern with forwardRef, controlled/uncontrolled, unstyled mode
- **Testing**: Vitest (31 test files, 1497 tests) + Playwright (19 E2E specs)
- **Build**: Vite dev server + library build mode (`build:lib`), TypeScript declarations via `tsconfig.lib.json`
- **Current State**: Build passes. 1497/1497 unit tests pass. 4 ESLint errors, 10 ESLint warnings.

---

## 2. BLOCKERS (🔴)

### 🔴 B-01: ESLint Errors — 4 errors violate STRICT MODE (ZERO warnings allowed)

**Error 1: CascadingDropdown.tsx:469 — Ref accessed during render**
- `renderTrigger()` is called during render and receives `renderTriggerRefCallback` which mutates a ref
- Rule: `react-hooks/refs`
- File: `src/components/CascadingDropdown/CascadingDropdown.tsx:469`

**Error 2: Drawer.tsx:152 — setState synchronously within effect**
- `setMounted(true)` and `setVisualOpen(false)` called directly inside `useEffect`
- Causes cascading re-renders
- Rule: `react-hooks/set-state-in-effect`
- File: `src/components/Drawer/Drawer.tsx:152`

**Error 3: useTimePicker.ts:67 — setState synchronously within effect**
- `setInputValue()` and `setLastValidValue()` called directly inside `useEffect`
- Multiple sequential state setters cause unnecessary re-renders
- Rule: `react-hooks/set-state-in-effect`
- File: `src/components/TimePicker/useTimePicker.ts:67`

**Error 4: BlogListing.tsx:140 — setState synchronously within effect**
- `setCurrentPage(1)` called directly inside `useEffect`
- Rule: `react-hooks/set-state-in-effect`
- File: `src/pages/blog/BlogListing.tsx:140`

### 🔴 B-02: ESLint Warnings — 10 warnings violate STRICT MODE

**Warning 1: DatePicker.tsx:672** — useEffect missing dependencies `dropdownGap` and `dropdownPosition`. Calendar position will be stale if these props change while dropdown is open.

**Warning 2-4: Pagination.tsx:213-215** — `label`, `error`, `errorMessage` destructured from props but never used. Dead code in component API.

**Warning 5: Table.tsx:267** — `columns` logical expression (`columnsProp ?? COLUMNS ?? []`) creates unstable reference on every render, breaking memoization.

**Warning 6: Table.tsx:1271** — useCallback has unnecessary dependencies: `filterDropdownClassName`, `renderColumnFilter`, `setColumnFilterValues`.

**Warning 7: Table.tsx:1531** — useCallback has missing dependencies: `React`, `expandOnRowClick`, `stripedClassNameProp`. Stale closure bug.

**Warning 8-10: TableDemo.tsx:1805,4724,5131** — useMemo has unnecessary dependency `dark` (demo page).

### 🔴 B-03: Unused Code — Violates ZERO unused code rule

- `src/utils/useId.ts` — Completely unused polyfill. No imports anywhere. React 19 provides native `useId`.
- `Pagination.tsx` — Props `label`, `error`, `errorMessage` destructured but never used (dead code).

### 🔴 B-04: Dependency Miscategorization — Library ships unnecessary runtime deps

- `react` and `react-dom` in BOTH `dependencies` AND `peerDependencies`. Must be peerDependencies ONLY for a library.
- `react-router-dom` in `dependencies` — only used in demo pages (`src/pages/`), not in any component.
- `@tailwindcss/vite` in `dependencies` — build tool, never used at runtime.
- `tailwindcss` in `dependencies` — CSS processed at build time, should be devDependency.

### 🔴 B-05: Failing Test — 1 test failure violates test pass requirement

- `src/components/Drawer/__tests__/Drawer.test.tsx` > `Drawer > Focus Management > traps focus forward with Tab in modal mode`
- Root cause: Test bug — missing `await` timeout before `user.tab()`. The focus trap `useEffect` hasn't attached the keydown listener yet when Tab is simulated. The backward Tab test has this timeout but the forward test doesn't.

---

## 3. HIGH-RISK ISSUES (🟡)

### 🟡 H-01: File Structure Inconsistency

- 4 components (DatePicker, InternationalPhoneInput, Table, TimePicker) have `constants.ts`, `utils.ts`, `icons.tsx` at root level instead of in `utils/` subfolder.
- Modal has `ModalContext.ts` at root instead of `utils/context.ts`.
- Table has `TableShimmer.tsx` at root instead of `components/`.
- Accordion has unique `hooks/` directory; no other component follows this pattern.

### 🟡 H-02: Export Pattern Inconsistency

- Most components: `export { default as ComponentName }` from index.ts
- Avatar, CountryFlag, ResizablePanel: `export { ComponentName }` (named export)
- RadioButton: Mixed — both `export { default as RadioGroup }` AND `export { RadioButton }`

### 🟡 H-03: Type Assertions (100+ instances)

- 13 instances of double-casting (`as unknown as X`) circumventing type system
- 23 instances of `event.target as Node` without null checks
- 14 unsafe function callback type assertions
- 10 instances of `(error || undefined) as boolean | undefined` anti-pattern

### 🟡 H-04: Missing Types from Public API

- Accordion index.ts exports `AccordionType`, `Orientation`, `Direction`, `AnimationCallbacks`, `AccordionSize`, `AccordionVariant`, `AnimationEasing`, `AccordionContextValue`, `AccordionItemContextValue`, `StorageConfig`, `UseAccordionStateOptions` — none re-exported from main `src/index.ts`.
- Tooltip index.ts exports `TooltipShadowPreset` — not re-exported from main index.

### 🟡 H-05: Accordion hooks/useReducedMotion.ts Indirection

- `src/components/Accordion/hooks/useReducedMotion.ts` is a re-export wrapper of `src/utils/useReducedMotion.ts`. Unnecessary indirection layer.

---

## 4. ROOT CAUSES (System-Level)

### RC-01: No Lint-Clean CI Gate
No CI pipeline enforces zero ESLint errors/warnings before merge. Issues accumulate.

### RC-02: No Dependency Audit Automation
No tooling validates dependency categorization (deps vs devDeps vs peerDeps).

### RC-03: Organic File Structure Growth
No automated folder structure linter. Components created at different times follow different conventions.

### RC-04: setState-in-effect Pattern
Multiple components use setState directly in useEffect bodies. This is a React 19 lint rule violation that wasn't enforced in earlier React versions.

---

## 5. AFFECTED COMPONENT GROUPS

| Group | Affected Components | Issues |
|-------|-------------------|--------|
| **Overlay** | Drawer, Modal | setState-in-effect (Drawer), focus trap test failure (Drawer) |
| **Selection** | CascadingDropdown | Ref-during-render error |
| **Form Inputs** | DatePicker, TimePicker | Missing deps warning, setState-in-effect |
| **Display** | Table | 3 hook dependency warnings, unstable column reference |
| **Navigation** | Pagination | Unused props (dead code) |
| **Demo/Pages** | TableDemo, BlogListing | setState-in-effect, unnecessary useMemo deps |
| **Utilities** | useId.ts | Completely unused file |
| **Package Config** | package.json | 4 dependency miscategorizations |
