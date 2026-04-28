# 07 — Performance Audit

You are a PERFORMANCE ENGINEER auditing a production React component library.

This step measures and improves render performance, bundle size, and runtime overhead. It is a NEW step in v5 — your previous pipeline did not have this.

---

## INPUTS

- `/ai/system-state.json`
- `/ai/rules.md`
- The build output (`dist/`)
- All component source files

---

## METRICS TO MEASURE

### 1. Bundle size per component

For each component, measure:

- ESM gzipped size of the individual component import
- Whether tree-shaking actually eliminates unused components
- Total library size if all components imported

Use `rollup-plugin-visualizer`, `bundlesize`, or equivalent.

### 2. Render performance

For each component, profile:

- Initial render time (target: < 16ms on a baseline device)
- Re-render cost when props change
- Re-render cost when parent re-renders (tests `React.memo` correctness)

Use React Profiler or equivalent automated benchmarks.

### 3. Code patterns that hurt performance

Detect and flag:

- Inline style objects in render bodies (`style={{ ... }}`) — they break `React.memo`
- Inline arrow functions in props that pass to memo'd children
- `.map()` with index as key in dynamic lists
- Missing `React.memo` on pure leaf components
- Heavy computation in render body without `useMemo`
- `useState` updates that should be `useReducer`

### 4. Lighthouse scores (for the docs site, not the library itself)

- Performance: target ≥ 90
- Accessibility: target ≥ 95
- Best Practices: target 100
- SEO: target 100

---

## DETECTION SEVERITY

🔴 **BLOCKER**:

- Component bundle exceeds its class hard-fail threshold (see `run.md` STRICT MODE):
  - Default leaf component: > 10kb gzipped
  - Date/calendar (DatePicker, TimePicker): > 12kb gzipped
  - Country/locale-aware (InternationalPhoneInput): > 12kb gzipped
  - Composite form (CascadingDropdown, MSD, MSSD, SearchableDropdown): > 12kb gzipped
- Initial render > 100ms on baseline device
- Tree-shaking does not work (all imports pull entire library)
- Memory leak detected (event listeners or observers not cleaned up)

🟡 **HIGH**:

- Component bundle exceeds its class target ceiling (see `run.md` STRICT MODE):
  - Default leaf: > 5kb gzipped
  - Date/calendar: > 10kb gzipped
  - Country/locale-aware: > 10kb gzipped
  - Composite form: > 8kb gzipped
- Re-render > 16ms
- Inline style objects in component render bodies (memoization breakers)
- Missing `React.memo` on pure leaf components
- Lighthouse Performance < 90 on docs site

🔵 **LOW**:

- Inline arrow functions in non-memo'd component children
- Minor unmemoized computations

---

## FIX PATTERNS

### Inline styles

Before:

```tsx
<div style={{ padding: 16, color: 'red' }}>...</div>
```

After:

```tsx
const style = { padding: 16, color: 'red' };
// or
<div className="p-4 text-red-500">...</div>
```

### Missing memo

Before:

```tsx
export function MyButton(props) { … }
```

After:

```tsx
export const MyButton = React.memo(function MyButton(props) { … });
```

### Index as key

Before:

```tsx
items.map((item, i) => <Row key={i} {...item} />)
```

After:

```tsx
items.map(item => <Row key={item.id} {...item} />)
```

### Unmemoized callbacks

Before:

```tsx
<Child onClick={() => doThing(id)} />
```

After:

```tsx
const handleClick = useCallback(() => doThing(id), [id]);
<Child onClick={handleClick} />
```

---

## OUTPUT FORMAT

```
PERFORMANCE AUDIT — <ISO date>

BUNDLE SIZE PER COMPONENT (gzipped):
  Button       :  1.8kb  ✓
  DatePicker   :  4.1kb  ✓
  Table        :  6.2kb  ⚠
  …

LARGEST COMPONENTS:
  - Table    : 6.2kb (over 5kb threshold)

TREE SHAKING: <PASS | FAIL>

RENDER PROFILES (avg ms):
  Button       :  0.4ms initial,  0.1ms re-render
  …

MEMOIZATION ISSUES:
  - <component>.<file>: <issue>

LIGHTHOUSE (docs site):
  Performance       : <score>
  Accessibility     : <score>
  Best Practices    : <score>
  SEO               : <score>

ISSUES FIXED:
  - <component>: <issue> → <fix>

VERDICT: <PASS | FAIL>
```

---

## STATE UPDATE

In `/ai/system-state.json`:

- Set `pipeline.currentStep = 7`
- Append issues with type `"performance"`
- Append fixes
- Add `coverage.performance` field with `{ bundleSizeOk: <bool>, renderOk: <bool>, lighthouse: <score> }`
- Update `validation.performance = "PASS"` or `"FAIL"`

---

## ACCEPTANCE CRITERIA

- Zero 🔴 BLOCKERS remain
- Tree-shaking works (verified)
- No component bundle exceeds its class hard-fail threshold (see `run.md` STRICT MODE for the per-class table)
- Lighthouse Performance ≥ 90 on docs site

PASS if all criteria met. 🟡 HIGH issues are logged but do not stop the pipeline.
