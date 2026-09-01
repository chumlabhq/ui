# ADR 003 — Accessibility conformance target

**Status:** Accepted
**Date:** 2026-09-01
**Related:** ADR 002, AUDIT-GAP §3, GATE-HONESTY §1 and §5

## Context

`README.md` claims WCAG 2.1 AA conformance and "44px+ touch targets". GATE-HONESTY §5 found the second claim false: `h-11` ships in zero package constants, shipped defaults are 40px, and Stepper's icon indicator is 32px below the `sm` breakpoint.

Investigating the fix surfaced a larger problem with the first claim.

**44px is not a WCAG 2.1 AA requirement.** It is SC 2.5.5 Target Size (Enhanced), which is **Level AAA**. WCAG 2.1 AA contains no target-size criterion whatsoever. The 44px figure in the README is Apple's Human Interface Guidelines number (Material Design's equivalent is 48dp), presented as though it were a WCAG obligation.

**The Level AA target-size criterion exists, but not in 2.1.** SC 2.5.8 Target Size (Minimum), Level AA, 24×24 CSS pixels, was introduced in **WCAG 2.2** (W3C Recommendation, October 2023). It carries a spacing exception the AAA criterion does not: an undersized target conforms if a 24px-diameter circle centred on it does not intersect another target's circle.

So the current README pairs a stale conformance target with a claim borrowed from a different standards body, and the number it advertises is one the package does not meet.

Meanwhile the conformance claim itself is unsubstantiated in ways AUDIT-GAP §3 documents: DatePicker ships `role="dialog" aria-modal="true"` with no focus trap and no `.focus()` calls in the directory, and `validation.accessibility: PASS` covers 30 components on the strength of four e2e specs, two of which scope `checkA11y` to a single selector.

## Decision

### D1 — Target WCAG 2.2 Level AA

Not 2.1. WCAG 2.2 has been the W3C Recommendation since October 2023, the European Accessibility Act came into force on 28 June 2025, and 2.2 AA is a near-superset of 2.1 AA (4.1.1 Parsing was removed; six criteria were added). Publishing a new package against a superseded version in 2026 is a defect in the claim, not a conservative choice.

### D2 — State target sizes truthfully, in both directions

Replace the "44px+ touch targets" line with:

> Interactive targets meet WCAG 2.2 SC 2.5.8 Target Size (Minimum), Level AA — 24×24 CSS pixels, or the spacing exception where smaller. Default control height is 40px.

Do **not** resize components to chase 44px. 40px clears the Level AA floor with room to spare, and 2.5.5's 44px is AAA — a level the library does not claim and should not claim piecemeal. Resizing 30 components would be a breaking visual change for every consumer in exchange for no conformance gain.

Stepper's 32px indicator likewise clears 24px. Before treating it as a finding at all, determine whether it is an interactive target; if it is a static status indicator, 2.5.8 does not apply to it.

Where any target does fall below 24×24, satisfy it via the spacing exception and record which exception applies.

### D3 — Conformance is a document with per-criterion status, not a README adjective

Add `ACCESSIBILITY.md`: every WCAG 2.2 A and AA criterion, each marked Supports / Partially supports / Does not support / Not applicable, with a one-line justification and the gate that proves it. This is the VPAT-shaped form the claim should take. A single-word claim in a README is unverifiable by anyone, including us — which is how the 44px line survived.

`README.md` links to it and states nothing beyond what it contains.

### D4 — The claim is gated or it is not made

No criterion may be marked Supports without a test that would fail if the behaviour regressed. Criteria we do not test are marked Does not support until they are. The `validation.accessibility` record is rebuilt on this basis.

## Consequences

Moving from 2.1 AA to 2.2 AA adds six criteria. Four are application-level and resolve as **Not applicable** for a component library, with justification recorded in `ACCESSIBILITY.md`:

- 3.2.6 Consistent Help (A) — a page-level information architecture obligation
- 3.3.7 Redundant Entry (A) — a multi-step flow obligation
- 3.3.8 Accessible Authentication (Minimum) (AA) — an auth-flow obligation
- 2.4.13 Focus Appearance is AAA and out of scope

Two land squarely on this library and are new work:

**2.5.7 Dragging Movements (AA).** Any function operating on a drag must offer a single-pointer alternative that is not a drag. `ResizablePanel` is the obvious exposure and currently appears to be drag-only; the correct remedy is keyboard resize plus a click-target alternative, not a larger drag handle. Audit every drag interaction in the package against this.

**2.4.11 Focus Not Obscured (Minimum) (AA).** When an element receives keyboard focus it must not be entirely hidden by author-created content. Sticky headers, `Drawer`, `Modal`, and every floating surface are exposures, and this interacts directly with the pending z-index tier work — a dropdown rendering at z-50 underneath a z-9999 drawer is a 2.4.11 failure, not merely a visual bug.

**2.5.8** is satisfied by current defaults once D2's claim is corrected and a gate is added.

Both new criteria fold into the phase 3 accessibility work rather than becoming a separate effort. The phase 3 scope changes accordingly: it is no longer "fix the two ship-blockers" but "reach documented WCAG 2.2 AA with a gate behind every Supports."
