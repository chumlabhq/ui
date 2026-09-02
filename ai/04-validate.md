# 04 — Final Correctness Gate

You are a FINAL RELEASE GATE ENGINEER.

This is the last step of Phase 1 (Correctness). It produces a binary verdict on whether the codebase has cleared all correctness requirements.

---

## INPUTS

- Entire repository
- `/ai/system-state.json`
- `/ai/rules.md`

---

## OBJECTIVE

Verify the codebase satisfies every correctness requirement defined in `/ai/rules.md`. If any requirement is not met, return NOT SAFE TO SHIP.

---

## VERIFICATION CHECKLIST

Run each check. Each is independent and must PASS.

### 1. Issue resolution

- [ ] Zero open `issues.blockers` (every entry has `status = "fixed"`)
- [ ] Every `issues.high` entry is fixed OR has matching `issues.deferred` record
- [ ] No issues lack severity classification

### 2. Regressions

- [ ] `regressions` array's most recent entry is a clean run (zero new issues)

### 3. Tests

- [ ] All tests pass
- [ ] Coverage ≥ 65% (current floor — see `run.md` STRICT MODE; ratchet upward only)
- [ ] No skipped or pending tests in committed code

### 4. TypeScript

- [ ] `npm run verify:bundle-size` passes — measures every packaged entry's
      gzipped size against its class ceiling and fails on a hard-fail breach.
      Needs a `build:lib` dist. NOT wired into `postbuild:lib` on purpose: it is
      red today (Table, DatePicker), and chaining it there would make the
      library unbuildable and take `npm run build` with it. The breach belongs
      in validation, not in everyone's build.
      Reports two numbers per entry — `own`, the component's own chunk, which is
      the basis the ceilings were set against and what the gate enforces; and
      `closure`, the eager static closure of the public entry, which is what a
      consumer actually downloads. Nine entries exceed their ceiling on
      `closure`. That is a threshold decision, not a regression.
- [ ] `npm run verify:dist-records` passes — the four dist-derived records
      (validation.build, .performance, .npmAudit, issues.high[8].evidence) are
      tied to a dist fingerprint. `postbuild:lib` clears it, so after any build
      they read as unverified until re-measured and re-stamped. Read the
      filesystem, not the record (GATE-HONESTY 1.1).
- [ ] `npm run typecheck` passes — it runs `tsc --build` and first proves the
      gate can fail by planting a type error. Never `tsc --noEmit`: the root
      tsconfig.json is a solution file with `files: []`, so `--noEmit`
      compiles nothing and exits 0 regardless of the source.
- [ ] No new `any` types introduced
- [ ] No new double assertions

### 5. Build

- [ ] `npm run build` succeeds
- [ ] Output `dist/` exists with cjs + esm + d.ts files

### 6. SSR

- [ ] No unguarded browser API access at module top-level
- [ ] No `useLayoutEffect` without SSR shim
- [ ] Server-side render of test page succeeds

### 7. Lint

- [ ] `npm run lint` returns zero errors
- [ ] Zero new warnings vs. baseline

### 8. Security

- [ ] `npm audit` returns zero high/critical vulnerabilities
- [ ] No new `dangerouslySetInnerHTML` without sanitization
- [ ] No `eval`, `new Function`, or string-form `setTimeout`

---

## OUTPUT FORMAT

> Placeholders below, not readings. Fill every `<…>` from a command's output.

```
VALIDATION REPORT — <ISO date>

CHECK RESULTS:
  Issue resolution     : <PASS | FAIL>
  Regressions          : <PASS | FAIL>
  Tests                : <PASS | FAIL> (<%> coverage)
  TypeScript           : <PASS | FAIL>
  Build                : <PASS | FAIL>
  SSR                  : <PASS | FAIL>
  Lint                 : <PASS | FAIL>
  Security             : <PASS | FAIL>

REMAINING ISSUES:
  Blockers   : <count>
  High open  : <count>
  Deferred   : <count> (with reasons logged)

VERDICT: <SAFE TO SHIP | NOT SAFE TO SHIP>
CONFIDENCE: <HIGH | MEDIUM | LOW>
```

---

## STATE UPDATE

In `/ai/system-state.json`:

- Set `pipeline.currentStep = 4`
- Update `validation` object with results from each check
- Set `confidence` (HIGH if all PASS, MEDIUM if deferred items present, LOW if any FAIL)
- If verdict == NOT SAFE TO SHIP:
  - `pipeline.status = "FAIL"`
  - `pipeline.failedStep = "04-validate"`
- If SAFE TO SHIP: `pipeline.status = "PASS"`

---

## RULE

NOT SAFE TO SHIP is a hard stop. Phase 2 (Quality) cannot run unless this step returns SAFE TO SHIP.

If any 🔴 BLOCKER exists in `issues.blockers` with `status` other than `"fixed"`, the verdict is automatically NOT SAFE TO SHIP regardless of other check results.

---

## ACCEPTANCE CRITERIA

- All 8 checks return PASS
- Final verdict = SAFE TO SHIP
- `system-state.json` reflects accurate state

PASS if all criteria met. FAIL otherwise → STOP pipeline.
