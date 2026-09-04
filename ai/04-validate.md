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

- [ ] `npm run verify:bundle-size` passes — measures every packaged entry and
      the library as a whole. Needs a `build:lib` dist. NOT wired into
      `postbuild:lib` on purpose: it is red today, and chaining it there would
      make the library unbuildable and take `npm run build` with it. The breach
      belongs in validation, not in everyone's build.
      Gated on `exclusive` — bytes reachable from this entry and no other, the
      marginal cost of adding the component to a page already using the library.
      Not `own` (Rollup splits some components across siblings, so Button reads
      0.17 KB) and not `closure` (it charges a component for composing:
      CountryFlag is 11.19 closure against 1.59 exclusive, the difference being
      a Tooltip any page using Tooltip already paid for — a gate on that reddens
      when composition improves). Both are still reported beside it.
      Shape sets the ceiling and is derived from the built artifact, not
      assigned: `"grid"` role → surface, `createPortal` → overlay, pulls another
      component's chunk → composed, otherwise control. Read from the
      component's OWN chunk, or everything rendering a Tooltip inherits
      "overlay" from it.
      Also gates the whole library, deduplicated, against `LIBRARY_TOTAL_KB`,
      ratchet-down-only: every entry can sit under its ceiling while the
      aggregate drifts, and nothing else would notice.
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

### 6b. Cross-browser e2e (release gate)

- [ ] `npm run test:e2e:all` reports every project green — chromium, firefox,
      webkit, Mobile Chrome, Mobile Safari and the axe sweep, each run as its
      own `playwright test` invocation and reconciled on its own.
- [ ] The aggregate is `npm run test:e2e:matrix`, which reads the recorded
      verdicts and exits non-zero unless all six are present, fresh and passing.

      The matrix is roughly forty minutes, which exceeds the task limit of at
      least one environment this repo is developed in, so the runner records
      each project as it finishes and can be driven one project at a time
      (`node scripts/run-e2e-matrix.mjs --project webkit`). A recorded verdict
      is tied to a content fingerprint of `src/` and `e2e/`: change either and
      it reads STALE and stops counting, so the aggregate can never be assembled
      out of runs against different trees. A project that collected zero tests
      fails rather than passing quietly.

      `npm run test:e2e` is chromium only, ~4 minutes, and is the iteration
      loop, not the gate.

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
