# AI Pipeline Runner — v5

You are an AI SYSTEM ENGINE executing a structured release pipeline for a React component library.

This file is the SINGLE source of truth for execution order, global rules, and state management. Individual step files focus only on their specific work. Do not re-state global context inside step files.

---

## GLOBAL RULES (apply to every step)

1. Read `/ai/system-state.json` BEFORE starting any step
2. Read `/ai/rules.md` BEFORE starting any step
3. Execute exactly ONE step per invocation
4. Never skip a step
5. Never merge steps
6. Persist outputs to `/ai/system-state.json` AFTER each step
7. Append to state arrays, never overwrite (unless explicitly allowed by the step)
8. `system-state.json` is the source of truth — file system reality must match it
9. If a step's acceptance criteria fail, mark the step status as `FAIL` and STOP the pipeline

---

## STATE MANAGEMENT CONTRACT

Every step MUST update these fields in `/ai/system-state.json`:

```json
{
  "pipeline": {
    "currentStep": <number>,
    "stepName": "<filename>",
    "status": "RUNNING | PASS | FAIL",
    "startedAt": "<ISO timestamp>",
    "completedAt": "<ISO timestamp>",
    "lastVerified": "<ISO date>"
  }
}
```

Step-specific updates are documented inside each step file.

---

## EXECUTION ORDER (v5)

The pipeline runs in 5 phases. Each phase is gated — proceed only if all prior steps pass.

### PHASE 1 — CORRECTNESS (mandatory, blocking)

1. `01-audit.md` — System audit, identify blockers / high / low issues
2. `02-fix.md` — Fix all 🔴 blockers and 🟡 high issues
3. `03-regression.md` — Detect any new issues caused by fixes
4. `04-validate.md` — Final correctness gate

**Gate:** No 🔴 blockers, no regressions, validate = SAFE TO SHIP. If any condition fails, STOP.

### PHASE 2 — QUALITY (system hardening)

5. `05-responsive.md` — Responsive coverage 320px → 1920px
6. `06-theme.md` — Light + dark mode coverage
7. `07-performance.md` — Bundle size, render performance, Lighthouse

**Gate:** Coverage scores meet thresholds defined in each step. Otherwise STOP.

### PHASE 3 — DX & DOCUMENTATION

8. `08-demos.md` — Basic Usage example for every component
9. `09-knowledge.md` — Generate `.ai.md` per component (human + AI readable)
10. `10-schema.md` — Generate `.schema.json` per component (machine readable)
11. `11-readme.md` — Top-level README

### PHASE 4 — DISCOVERABILITY (depends on Phase 3 outputs)

12. `12-brand.md` — Brand consistency audit
13. `13-ai-index.md` — Centralized component index
14. `14-semantic-text.md` — Semantic text source for embeddings (NOT vectors)
15. `15-seo.md` — SEO + GEO (Generative Engine Optimization) + AEO

### PHASE 5 — RELEASE READINESS

16. `16-security.md` — Deep security audit (XSS, prop injection, deps)
17. `17-npm-audit.md` — Pre-publish npm audit
18. `18-changelog.md` — Generate / update CHANGELOG, bump version
19. `19-publish-dryrun.md` — Final pre-publish dry run

**Gate:** All checks pass. Pipeline complete. Ready for `npm publish`.

---

## STOP CONDITIONS

Pipeline must STOP IMMEDIATELY (no further steps) if:

- Any 🔴 blocker is unresolved after step 02
- Step 03 finds any new regression
- Step 04 returns NOT SAFE TO SHIP
- Any phase gate fails its threshold
- A step is missing required input artifacts from prior steps

When stopping, the pipeline must:

- Set `pipeline.status = FAIL`
- Set `pipeline.failedStep = <step name>`
- Set `pipeline.failureReason = <reason>`
- Surface the failure in the final output

---

## SUCCESS CONDITION

The pipeline is COMPLETE only when:

- All 19 steps return `PASS`
- No regressions detected at any phase
- Validation result = SAFE TO SHIP
- Coverage thresholds met for tests, accessibility, responsive, theme, performance
- All AI infrastructure artifacts exist (`.ai.md`, `.schema.json`, `component-index.json`, `semantic-text.json`)
- README, CHANGELOG, SEO assets present

---

## FINAL OUTPUT

At pipeline completion, return:

```
PIPELINE: <PASS | FAIL>
COMPLETED STEPS: <count>/19

ISSUES FIXED: <count>
REGRESSIONS: <count>

COVERAGE:
  tests: <%>
  accessibility: <%>
  responsive: <%>
  theme: <%>
  performance: <Lighthouse score>
  bundle size: <kb gzipped>

DELIVERABLES:
  - <path to each artifact>

VERDICT: <SAFE TO SHIP | NOT SAFE TO SHIP>
CONFIDENCE: <HIGH | MEDIUM | LOW>
```

---

## STRICT MODE

- Zero tolerance for 🔴 blockers
- Zero tolerance for regressions
- Test coverage threshold: **65%** (current floor as of v5 / 2026-04-28). Ratchet upward only — once a higher coverage % is reached and validated, the floor moves to that new value and never down. Long-term target: 80%, then 90% once base is stable.
- Lighthouse SEO: 100
- Lighthouse Accessibility: ≥ 95
- Bundle size per component (gzipped):
  - **Default leaf component**: target ≤ 5kb, hard fail > 10kb
  - **Date/calendar components** (DatePicker, TimePicker): target ≤ 10kb, hard fail > 12kb
  - **Country/locale-aware components** (InternationalPhoneInput): target ≤ 10kb, hard fail > 12kb
  - **Composite form components** (CascadingDropdown, MSD, MSSD, SearchableDropdown): target ≤ 8kb, hard fail > 12kb
  Class-specific ceilings reflect that locale data, calendar math, and async-search machinery have an irreducible floor; raising the floor for those classes prevents thrashing the pipeline on irreducible weight while keeping leaf components honest. Ratchet rule applies: once a component drops below its target, the new size becomes its individual ceiling — it can never grow past that without a recorded waiver.

---

## START

Begin with step 01.
