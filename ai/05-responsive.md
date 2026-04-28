# 05 — Responsive System Audit

You are a RESPONSIVE SYSTEM ARCHITECT.

Phase 2 begins here. This step ensures every component renders correctly across all target breakpoints.

---

## INPUTS

- `/ai/system-state.json`
- `/ai/rules.md`
- All component source files
- All demo / docs pages

---

## TARGET BREAKPOINTS

Test every component at:

- 320px (small mobile — minimum supported)
- 375px (mobile)
- 768px (tablet portrait)
- 1024px (tablet landscape / small desktop)
- 1440px (desktop)
- 1920px (large desktop — minimum supported maximum)

---

## DETECTION RULES

🔴 **BLOCKER**:

- Horizontal scroll on `<body>` at any breakpoint
- Content overflows viewport
- Component renders broken (overlapping, cut off, unreadable)
- Tap target < 44×44px on mobile

🟡 **HIGH**:

- Poor stacking behavior (e.g. labels collide with inputs)
- Fixed pixel widths on layout containers > 320px
- Text becomes unreadable due to truncation
- Modals exceed viewport at 320px

🔵 **LOW**:

- Suboptimal but functional spacing
- Minor visual imperfections at extreme breakpoints

---

## FIX PATTERNS

When fixing, follow these patterns:

- Replace fixed `w-[200px]` with `w-full sm:w-[200px]` or `min-w-0 max-w-[200px]`
- Wrap tables: `<div class="overflow-x-auto"><table>…</table></div>`
- Wrap code blocks: same pattern
- Increase tap targets: `p-2` minimum on icon buttons
- Use `clamp()` for fluid typography
- Use Tailwind responsive prefixes (`sm:`, `md:`, `lg:`)
- For modals: `max-h-[90vh] overflow-y-auto` and `w-[calc(100vw-32px)] sm:w-auto`

---

## OUTPUT FORMAT

```
RESPONSIVE AUDIT — <ISO date>

ISSUES FOUND:
  🔴 Blockers: <count>
  🟡 High: <count>
  🔵 Low: <count>

ISSUES FIXED:
  - <component>: <breakpoint> → <fix>

COMPONENTS VERIFIED: <count>/<total>

COVERAGE BY BREAKPOINT:
  320px  : <%>
  375px  : <%>
  768px  : <%>
  1024px : <%>
  1440px : <%>
  1920px : <%>
```

---

## STATE UPDATE

In `/ai/system-state.json`:

- Set `pipeline.currentStep = 5`
- Append new issues to `issues.*` arrays with type `"responsive"`
- Append fixes to `fixes`
- Update `coverage.responsive` (overall percent)
- Update `validation.responsive = "PASS"` or `"FAIL"`

---

## ACCEPTANCE CRITERIA

- Zero 🔴 blockers remain
- `coverage.responsive` ≥ 95%
- Every component verified at all 6 breakpoints
- Test results recorded in state

PASS if all criteria met. FAIL otherwise → log and continue (HIGH issues do not stop pipeline, but LOG to `pipeline.warnings`).
