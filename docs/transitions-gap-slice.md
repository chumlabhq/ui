# The transitions gap, scoped

Every visual subject in this repo photographs a **resting state**. 67 resting
subjects, 12 open surfaces and 3 focus subjects, and not one of them captures a
component mid-change. That is not an oversight in any single gate; it is a
property of how fixtures are built — a fixture is a props bag and a render, and
both describe a moment.

This page sizes what it would take to cover the changes. It does not build it.

## Why it matters, from this branch's own record

Every serious defect found here survived a green suite for the same reason.

| Defect | What the suite held | Why it could not see it |
|---|---|---|
| Drawer never moved focus when opened from closed | 4 unit cases on focus | all four rendered with `open` already true — the one path where the portal exists on the first effect |
| Stepper's status pinned to `error` | 11 fixtures | all 11 are frozen states; the defect was that a state could never be *reached* |
| Tooltip's arrow on rotated sides | 1 subject | top-placed only |
| `Input/disabled` shipped unable to fail | 1 subject | near-white on near-white; the plant margin was never taken |
| Checkbox's checked fill deleted for six days | 40 subjects | no `checked` state was in a picture at all |

The shape repeats: **the gates sample states, and the defects live in the moves
between them.**

## What no fixture reaches, by component

### Transitions — a component animating from one state to another

| Component | Not reached | Would need |
|---|---|---|
| **Accordion** | An opening or closing panel. 10 fixtures, all fully open or fully closed. `--cl-accordion-content-height` is written mid-open and read by the keyframes, so the one variable the animation depends on is never photographed while it is doing anything. | A subject captured at a fixed point in the open transition — a paused animation at 50%, not a sleep. |
| **Toast** | Entry, exit, and the dismiss track draining. 1 fixture file behind 51 unit cases; 2 visual subjects, both resting. The progress groove is the only moving part a consumer sees and nothing photographs it part-drained. | Animation paused at a known percentage, plus one subject at the entry keyframe. |
| **Drawer** | The slide. 1 subject, open. The direction prop has four values and none is captured mid-slide. | Four paused subjects, or one per axis. |
| **Modal** | Scrim fade and panel scale-in. 1 subject. | One paused subject. |
| **Switch** | The thumb in flight. `transitionDuration` and `transitionTimingFunction` are public props; nothing renders either. | One paused subject at 50%. |
| **Stepper** | Any status change. Covered by prose in the demo now, by no picture. | Not a picture problem — a driven e2e case. |

### Placements and sizes — states reachable only by driving the component

| Component | Not reached | Would need |
|---|---|---|
| **Tooltip** | 3 of 4 sides. `top` is the only placement photographed, and the arrow defect lived on the rotated sides. | 3 more open subjects. |
| **Dropdown family** | Flip-on-collision. Every open subject has room below. | A subject anchored near the viewport foot. |
| **Loader** | 3 of 4 variants have one subject each; the spin is never caught off-axis on purpose. | Nothing — the diagonal is now understood and exempted. |
| **Breadcrumb** | Collapse threshold crossing: the point where items start folding into the ellipsis. | A width-driven e2e case, not a fixture. |

### Interaction paths — sequences, not states

| Path | Components | Would need |
|---|---|---|
| Open from closed | Drawer, Modal, every dropdown, DatePicker, TimePicker | Driven e2e, not fixtures. Drawer's bug was exactly here. |
| Type-then-clear | Input, TextArea, OtpInput, SearchableDropdown | Driven e2e. |
| Keyboard traversal end to end | Stepper, TabPanel, Breadcrumb, every menu | Driven e2e; partially covered today. |
| Controlled value changing under the component | all of them | Unit, and mostly covered. |

## What it would cost

**Paused-animation subjects.** Playwright can pause CSS animations at a fixed
time (`animations: "disabled"` freezes at the end; a fixed seek needs
`document.getAnimations()` and `currentTime`). A subject is deterministic if the
clock is set explicitly rather than slept against.

| Item | Count | Baseline cost |
|---|---|---|
| Transition subjects (Accordion, Toast ×2, Drawer, Modal, Switch) | 6 | 6 × 6 viewports × 2 themes = **72 PNGs** |
| Tooltip placements | 3 | **36 PNGs** |
| Dropdown flip | 1 | **12 PNGs** |
| **Total** | **10 subjects** | **120 PNGs**, on top of today's 480 comparisons |

Runtime: the visual suite is 4.6 minutes for 480 comparisons, so 120 more is
roughly **+70 seconds**. The driven e2e paths are the larger number — each is a
test, not a picture, and the existing specs run 5-38 cases per component in
seconds.

**The real cost is not runtime.** It is that a paused-animation baseline is
only as stable as the clock it is seeked against, and this branch has already
recorded what an unstable comparator does: `maxDiffPixels: 1` exists because the
default tolerance was wide enough to delete a component's paint without one
pixel counting. A transition subject seeked by `currentTime` is deterministic;
one seeked by `waitForTimeout` is a flake generator. If this is built, the
acceptance test is that each new subject is planted — remove the painting it
exists to capture and record the margin — exactly as the 37 resting subjects
were.

## Recommendation

Two slices, in this order, and the first is worth more than the second:

1. **The interaction paths** — open-from-closed for Drawer, Modal and the
   dropdowns, as driven e2e. No baselines, no comparator risk, and it is where
   the one confirmed functional bug of this class lived.
2. **The transition subjects** — 10 subjects, 120 PNGs, +70s, each planted.

Neither is a publish blocker on its own. The first would have caught a real bug;
the second would have caught a visual regression nobody has yet reported.
