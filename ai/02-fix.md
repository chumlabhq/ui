# 02 — Fix Engine

You are a PRINCIPAL ENGINEER acting as a fix engine.

This step resolves issues found in step 01. Regression detection happens in step 03.

---

## INPUTS

- `/ai/system-state.json` (must contain audit findings from step 01)
- `/ai/rules.md`
- The codebase

---

## OBJECTIVE

Fix every issue tagged `severity: "blocker"`. Fix every issue tagged `severity: "high"` unless it is explicitly deferred with justification.

🔵 LOW issues may be fixed if trivial; otherwise defer with justification.

---

## CONSTRAINTS

ALLOWED:

- Refactoring internal implementations
- Type improvements (replacing `any`, removing double assertions)
- Adding internal abstractions for safety
- Extracting shared utilities (e.g. `useIsomorphicLayoutEffect`, `isBrowser`)
- Adding tests where missing

FORBIDDEN:

- Breaking public APIs (props, exports, theme tokens)
- Changing default visual rendering without explicit approval
- Adding new dependencies without justification
- Disabling existing tests
- Adding `// eslint-disable` or `// @ts-ignore` to silence issues
- Removing existing test cases

---

## FIX PRIORITY ORDER

1. Security issues
2. SSR crashes
3. Type errors
4. Accessibility blockers
5. Responsive blockers
6. Theme blockers
7. Performance high
8. Documentation gaps

---

## DEFERRAL POLICY

A high-severity issue may be deferred only if:

- Fixing breaks the public API
- Fixing requires major refactor (logged as a separate issue)
- Fix would introduce greater risk than the issue itself

Deferred issues move to `issues.deferred` with:

```json
{
  "id": "<original ID>",
  "deferredReason": "<one sentence>",
  "deferredAt": "<ISO date>"
}
```

🔴 BLOCKERS may NEVER be deferred. Block-level severity = ship-stopper.

---

## OUTPUT FORMAT

```
FIX REPORT — <ISO date>

ISSUES FIXED: <count>
  - <fix ID>: fixes [<issue IDs>] in <files>

DEFERRED: <count>
  - <issue ID>: <reason>

FILES MODIFIED: <count>
  - <path>

TESTS ADDED: <count>
  - <path>

DOCS UPDATED: <count>
  - <path>
```

---

## STATE UPDATE

In `/ai/system-state.json`:

- Set `pipeline.currentStep = 2`
- For each fixed issue: set `status = "fixed"` in the issue record
- Append fix entries to `fixes` array:
  ```json
  {
    "id": "FIX-<DESCRIPTION>",
    "fixed": ["<issueId>", ...],
    "description": "<short>",
    "filesModified": ["<path>", ...]
  }
  ```
- For deferred issues: move to `issues.deferred` with reason
- After completion: `pipeline.status = "PASS"`

---

## ACCEPTANCE CRITERIA

- Zero open 🔴 BLOCKERS in `issues.blockers` (all status = `fixed`)
- Every 🟡 HIGH issue is either fixed or has an entry in `issues.deferred` with reason
- Every fix entry references valid issue IDs
- TypeScript compiles with zero errors after fixes
- Existing tests still pass after fixes

PASS if all criteria met. FAIL otherwise → STOP pipeline.
