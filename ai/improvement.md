# CHUMLAB DESIGN SYSTEM — SELF-IMPROVEMENT PATCH (v2)

## INPUT

- **Audit report (v2)**: 5 blockers, 5 high-risk issues found
- **Fix summary**: All 5 blockers resolved — 0 ESLint errors, 0 warnings, 1497/1497 tests pass, unused code removed, dependencies corrected
- **Verifier report (v2)**: SAFE TO SHIP, HIGH confidence

---

## 1. IDENTIFY

### Missed Issues

| Issue | Why Missed | Impact |
|-------|-----------|--------|
| `eslint-disable` suppressions count as technical debt | Audit focused on presence of errors, not on whether suppressions are the right fix | 3 suppressions remain as permanent escape hatches |
| `React` as a useCallback dependency is a false positive | ESLint doesn't know module-level imports are stable | Required suppression comment |

### Weak Detection Areas

1. **setState-in-effect patterns**: The audit correctly identified these, but the fix phase attempted to refactor them to render-time derivation. This introduced NEW errors (ref-during-render) because refs can't be mutated during render. The fix had to be reverted to eslint-disable. **Root cause**: Insufficient analysis of which state patterns CAN be refactored vs which MUST remain as effects.

2. **Dependency array analysis**: The audit correctly flagged missing/unnecessary deps, but the fix for Table's `React` dep required understanding that `React` is a module namespace (stable) not a reactive value. The lint rule can't distinguish these.

3. **Test isolation issues**: The Drawer focus-forward test passed in isolation but failed in the full suite. The audit identified it as a "timing issue" but didn't analyze the cross-test pollution mechanism (jsdom global state, event listener accumulation).

### Repeated Failure Patterns

1. **Refactoring useEffect to render-time state → introduces ref-during-render errors**
   - Occurred in: TimePicker/useTimePicker.ts
   - Pattern: Moving `ref.current = x` from effect body to render body
   - Prevention: Before refactoring any useEffect, check if the body reads/writes refs

2. **eslint-disable-next-line vs block-level disable**
   - Occurred in: TimePicker, Table
   - Pattern: `eslint-disable-next-line` doesn't cover multi-line patterns
   - Prevention: Always use block-level `/* eslint-disable */` ... `/* eslint-enable */` for effect bodies

3. **Test timing in jsdom**
   - Occurred in: Drawer, Slider
   - Pattern: useEffect listeners not attached before test assertions
   - Prevention: Always `await act(async () => { await timeout(100); })` before testing effect-dependent behavior

---

## 2. IMPROVE

### Audit Coverage Improvements

```
ADDITIONAL AUDIT RULES:

• When reporting setState-in-effect: classify whether the effect body:
  a) Reads/writes refs (CANNOT be moved to render phase)
  b) Only reads props/state (CAN potentially be refactored to render-time derivation)
  c) Calls external APIs (MUST remain in effect)

• When reporting unused code: verify by running `grep -r "import.*<name>" src/`
  before reporting. Zero false positives allowed.

• When reporting dependency issues in package.json:
  - Check if the dep is imported in src/components/ (library code)
  - Check if the dep is only imported in src/pages/ (demo code)
  - Check if the dep is only imported in config files (build tools)

• For EACH ESLint error/warning, provide:
  1. Exact file:line
  2. Rule name
  3. Whether it can be structurally fixed vs requires suppression
  4. If suppression: the justification text
```

### Fix Rules Improvements

```
ADDITIONAL FIX RULES:

• NEVER move ref mutations from useEffect to render phase.
  Refs (useRef) can ONLY be read/written in:
  - Event handlers
  - useEffect / useLayoutEffect
  - useCallback bodies (when called from event handlers)
  NOT in the component render body.

• When suppressing ESLint rules:
  - Use block-level /* eslint-disable RULE */ ... /* eslint-enable RULE */
  - NEVER use inline eslint-disable-next-line for multi-line patterns
  - ALWAYS include a justification comment explaining WHY the suppression is needed

• When fixing dependency arrays:
  - Module-level imports (React, constants) are stable — suppress with comment
  - Function/object props are unstable — must be included or memoized
  - Class strings from prop destructuring are unstable — extract to useMemo if used in deps

• When fixing tests:
  - Always wrap effect-dependent assertions in act() + timeout
  - Run tests BOTH in isolation AND as part of full suite to catch isolation issues
  - Use waitFor() for async state changes, not bare expect()
```

### Validation Strictness Improvements

```
ADDITIONAL VERIFICATION CHECKS:

• Run `npx eslint .` and verify LITERALLY 0 output (not just 0 errors)
• Run `npx vitest run` THREE times to catch flaky tests
• For each eslint-disable: verify the suppressed rule actually fires without it
• Count total eslint-disable comments — each is technical debt. Report the count.
• Verify `npm run build` produces zero TypeScript errors
• Verify package.json dependencies: no dev/build tools in dependencies
```

---

## 3. GENERATE

### A. PROMPT IMPROVEMENTS

**For audit.md:**
Add to RULES section:
```
• For each ESLint issue, classify fix approach: STRUCTURAL vs SUPPRESSION
• For setState-in-effect: check if body accesses refs before suggesting refactor
• For unused code: verify with grep before reporting
• For dependency issues: trace import paths to classify (library vs demo vs build)
```

**For fix.md:**
Add to STRICT RULES section:
```
• NEVER move ref.current mutations to render phase
• Use block-level eslint-disable for multi-line patterns
• Run tests both isolated and in full suite after each fix
• After fixing a useCallback/useMemo dependency array, verify the hook still works correctly
```

**For verify.md:**
Add to CHECK section:
```
• ESLint output is LITERALLY empty (zero characters)
• Run test suite 3x to catch flaky tests
• Count and report eslint-disable suppressions as technical debt
• Verify npm run build has zero TypeScript errors
```

### B. NEW RULES TO ADD

1. **Ref Safety Rule**: Before refactoring any useEffect, scan the body for `ref.current`. If found, the effect CANNOT be converted to render-time state derivation.

2. **Suppress vs Fix Decision Tree**:
   - Can the code be restructured without changing the public API? → STRUCTURAL FIX
   - Does restructuring introduce new errors (ref-in-render, stale closures)? → SUPPRESSION
   - Is the lint rule a false positive (e.g., React as dep)? → SUPPRESSION with documented justification

3. **Test Stability Rule**: Every test that depends on useEffect must include `act()` wrapper with sufficient timeout. Never use bare `await user.tab()` after render without ensuring effects have run.

4. **Dependency Classification Rule**: For package.json audit:
   - `dependencies`: Only packages imported at runtime by library code (`src/components/`, `src/utils/`)
   - `peerDependencies`: Framework deps consumers must provide (react, react-dom)
   - `devDependencies`: Everything else (build tools, test tools, demo deps, CSS tools)

### C. PATTERN FIXES

1. **setState-in-effect → Suppression Pattern**:
```typescript
/* eslint-disable react-hooks/set-state-in-effect -- [JUSTIFICATION] */
useEffect(() => {
  // state sync logic
}, [deps]);
/* eslint-enable react-hooks/set-state-in-effect */
```

2. **Stable-import dependency → Suppression Pattern**:
```typescript
// eslint-disable-next-line react-hooks/exhaustive-deps -- React is a stable module import
[dep1, dep2],
```

3. **Test effect timing → act() Pattern**:
```typescript
await act(async () => {
  await new Promise((r) => setTimeout(r, 100));
});
// NOW safe to assert on effect-dependent state
```

### D. FAILURE PREVENTION STRATEGIES

1. **Pre-fix checklist**: Before modifying any useEffect:
   - [ ] Does the body read/write `ref.current`? If yes → SUPPRESSION only
   - [ ] Does the body call setState? If yes → check if render-time derivation is safe
   - [ ] Does the body call external APIs? If yes → keep as effect

2. **Post-fix validation sequence**:
   ```bash
   npx eslint . 2>&1 | wc -l  # Must be 0
   npx vitest run              # Must be 100% pass
   npx vitest run              # Run again for flake detection
   npm run build               # Must succeed
   ```

3. **eslint-disable audit**: After all fixes, count suppressions:
   ```bash
   grep -r "eslint-disable" src/ | grep -v node_modules | wc -l
   ```
   Current count: 7 (3 component, 3 demo, 1 build tool). Target: minimize but accept when justified.
