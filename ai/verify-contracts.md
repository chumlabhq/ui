# 03b — Verify Contracts

You are a STAFF+ engineer gating the cross-cutting behavioural contracts of the library.

This step runs immediately after `03-regression.md` and before `04-validate.md`. It is a
Phase 1 (CORRECTNESS) gate: if it fails, the pipeline STOPS.

---

## WHY THIS STEP EXISTS

The per-component suites cover 2,976 assertions and still shipped three defects, because
each of them lives *between* components rather than inside one, and the suite is organised
strictly per component:

- The `cl-s` scope marker appeared in **0 of 47** test files. Every utility in
  `dist/styles.css` is emitted as `.foo:where(.cl-s)`, so a class that reaches the DOM
  unmarked has no rule behind it. `asChild` composes through `cloneElement`, which never
  touches the marking JSX runtime — silently unstyling every element it merged onto.
- `react-dom/server` appeared in **0 of 47** test files, while `system-state.json` recorded
  "SSR safety — carried PASS". `DatePicker.tsx:987` reads `document.body` during render.
- The `unstyled` contract was asserted **backwards** in six tests, so the defect was the
  specification rather than a coverage gap.
- Class strings written at JSX call sites are invisible to both `unstyled` and `classes`,
  so no rendered-output test could see them. `constants.contract` reads source instead.

This step owns the tier those checks live in: `src/__tests__/contracts/`.

---

## INPUTS

- `src/__tests__/contracts/**`
- `ai/component-index.json` — the roster the suites iterate
- `docs/adr/001-unstyled-contract.md` — the structural/decorative split
- `/ai/system-state.json`
- `/ai/rules.md`

---

## COMMAND

```
npm run test:contracts
```

---

## CHECKS

### 1. Roster integrity

- [ ] Every component in `ai/component-index.json` resolves to a real subpath barrel
- [ ] No suite uses a hand-written component list — a new component is picked up by the
      index alone
- [ ] `registry.ts` throws (rather than skips) on a component it cannot resolve

### 2. `marker.contract` — must be GREEN

- [ ] `cn()` and `src/jsx/mark.ts` agree on the marker string
- [ ] `cn()` is idempotent, keeps the marker last, and returns `""` for empty input
- [ ] Every component renders at least one marked element
- [ ] No element carries the marker twice
- [ ] Every `asChild` path marks the element it merges its classes onto

### 3. `ssr.contract` — must be GREEN

- [ ] Runs under `environment: "node"`, with `document` and `window` genuinely undefined
- [ ] Every component renders to string with default props without throwing
- [ ] Every component declaring `open` or `keepMounted` renders to string in that state

### 4. `unstyled.contract` — must be GREEN

- [ ] Structural utilities that the styled render puts in the DOM survive `unstyled`
- [ ] Decorative utilities do not
- [ ] The classifier's ADR tie-breaks (`gap-*` decorative, `z-*` structural) hold

### 5. `overrides.contract` — must be GREEN

- [ ] Overriding a slot key removes that key's identifying default tokens from the DOM
- [ ] No slot renders its default once every key is overridden

### 6. `constants.contract` — must be GREEN

- [ ] No file exceeds its `BASELINE` count of literal class strings at JSX call sites
- [ ] No `BASELINE` entry sits above the actual count (stale entries buy silent headroom)
- [ ] The count of literal class strings carrying a STRUCTURAL utility does not exceed
      `STRUCTURAL_BASELINE`

Both numbers in that suite ratchet DOWN only. Raising either requires an explicit waiver
in the same change, naming what will retire it.

---

## ACCEPTANCE

PASS when **all six suites are green** (roster integrity plus the five contract suites). `contracts.knownFailing` must be empty: as of
ADR 001's implementation there are no waived contract failures, and the gate no longer
accepts any.

Any failure is a regression: mark this step `FAIL` and STOP.

Re-introducing `contracts.knownFailing` requires an explicit waiver in the same change
that adds it, naming the remediation item that will retire it. The list ratchets DOWN
only, and its floor is now zero.

---

## STATE UPDATES

```json
{
  "contracts": {
    "lastRun": "<ISO timestamp>",
    "suites": {
      "marker": "PASS | FAIL",
      "ssr": "PASS | FAIL",
      "unstyled": "PASS | FAIL",
      "overrides": "PASS | FAIL",
      "constants": "PASS | FAIL"
    },
    "knownFailing": [],
    "componentsCovered": <count from ai/component-index.json>
  }
}
```

---

## OUTPUT

```
STEP: 03b-verify-contracts
STATUS: <PASS | FAIL>
COMPONENTS COVERED: <count>/<total in component-index.json>
SUITES: marker=<> ssr=<> unstyled=<> overrides=<> constants=<>
KNOWN FAILING: 0 (the gate no longer accepts a non-empty list)
UNEXPECTED FAILURES: <count>
```
