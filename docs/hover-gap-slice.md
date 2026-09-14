# The hover gap, scoped

Both contrast gates measure pages **at rest**. `contrast-painted.spec.ts` walks
every fixture in both themes, and `demo-contrast.spec.ts` walks every demo page
in both themes. Neither ever puts an element into its hover state, so a colour
that only exists on hover has never been measured by either one.

This page sizes that gap. It does not build anything to close it.

## Why it matters, from this branch's own record

The rounding sweep on 2026-09-14 turned up two hover sites of exactly the class
it was hunting for: accent text on an accent tint. Neither was measured, because
neither exists at rest.

| Site | Hover paint | Why no gate saw it |
|---|---|---|
| `InputDemo.tsx`'s "Forgot?" button | `text-cl-accent` on `hover:bg-cl-accent-bg` — the 4.4999:1 pair in light | the tint appears only on hover |
| The multi-select chips' remove control | marked hover with `hover:text-cl-accent-hover` on the chip tint | hover state only |

Both have been changed: the text is `--cl-accent-hover`, and hover on the chip's
remove control deepens the tint. The fixes were found by reading class strings,
not by any measurement. That is the gap: a sub-AA hover pair gets found when
someone happens to read the right line.

## What is not measured

Counted from source on 2026-09-14 with a grep for each variant, tests excluded.
These are **class variants, not rendered elements**. How many elements carry
them on a rendered page has not been counted.

| Where | Variant | Count |
|---|---|---|
| Library (`src/components`, 22 files) | `hover:` colour: text, background or border | **127** (44 text, 59 background, the rest border) |
| Library | `group-hover:` text or background | **7** |
| Library | `data-[highlighted]:` text or background | **8** |
| Demo pages (`src/pages/demo`, 34 files) | `hover:` text or background | **523** |
| Demo pages | `active:` text or background | 14 |

None of these is measured by a contrast gate. Hover appears in six e2e specs
(button, table, toast, tooltip, waived-keys, and one reference in fixture-act),
always as a behavioural `page.hover()` on one element, and never followed by a
contrast measurement.

## What can reach it, and what cannot

**`:hover` is forceable in Chromium only.** The DevTools protocol's
`CSS.forcePseudoState` sets `:hover` on one DOM node, reached through
`page.context().newCDPSession(page)` and a node id from `DOM.querySelector`.
The browser then applies the `hover:` rules without a pointer. It is one node
per call, and the forced state must be cleared again. Firefox and WebKit have no
equivalent. `contrast-painted` is already Chromium-only (RELEASE-READINESS §3.7),
so this adds no new engine limit.

What forcing `:hover` does **not** reach:

- **`group-hover:` (7 library variants).** The rule keys off the ancestor's
  hover, so the `.group` element has to be forced, not the element that paints.
  It is reachable, but only by finding the group root first.
- **`data-[highlighted]:` (8 library variants).** This is component state, not a
  pseudo-class. The highlight is set by keyboard or pointer handling, so forcing
  `:hover` changes nothing. These need a driven fixture, the way
  `Pagination/rows-per-page-open-unhighlighted` drives its highlight with
  ArrowDown.
- **Hover that runs JavaScript.** Tooltips, hover-to-open menus and anything
  listening for `mouseenter` stay closed, because a forced pseudo-state fires no
  events. Only CSS colour changes are reachable, and those are the target.

## What it would cost

**The shape.** Cost grows with hover-styled elements, not with pages. Per
fixture, per theme, on the page contrast-painted has already loaded:

1. Find the candidate elements: every node under the fixture and its portals
   whose computed `color` or `background-color` differs between rest and forced
   hover. That is one force, read and clear per element carrying a `hover:`
   class, found by walking the DOM.
2. For each element that changes, measure it and its text-painting descendants
   with the same `MEASURE` source and decide with `underFloor`. That reuses the
   gate's own compositing and floor logic rather than a second copy.
3. Clear the forced state before moving on.

**The number that is missing.** The runtime element count per fixture was not
taken, so there is no honest seconds figure. The comparison point is that
`e2e:a11y-full` ran 505s in the final run of 2026-09-14, most of it this gate's
two loads per fixture across 447 fixtures. A hover pass adds DevTools
round-trips on an already-loaded page, not more page loads. So it probably costs
less than the fresh-load-per-theme change added, but that is an estimate, not a
measurement.

**The risk is disturbance, not runtime.** This gate already measured light on a
page its own focus pass had disturbed: nine fixtures had a menu closed or a
tooltip opened between the dark pass and the light pass. A forced pseudo-state
fires no events, so it should disturb less than focusing does. It is still a
change to the page between measurements, and it needs the same proof: record
the page before and after the hover pass and fail if they differ.

## Recommendation

**Worth building, narrowly, and not before publish.**

- **Library fixtures only, `:hover` only** — the 127 variants across 22 files.
  That is where a consumer inherits a colour, and where the one confirmed defect
  of the class (the chip remove control) lived. Plant it the way the rounding
  fix was planted: a `hover:` pair at 4.4999:1 must fail and one at 4.5001:1
  must pass.
- **`group-hover` second.** Seven variants, and the only extra work is finding
  the group root.
- **`data-[highlighted]` is not this slice.** It is eight driven fixtures, one
  per state, and it belongs with the fixture gap, not with forced states.
- **The demo pages' 523 last, or never.** `demo-contrast` exists to measure the
  classes demo authors wrote for themselves. A hover pass over 33 pages would
  mostly re-measure the library, and the demos are not what ships.

It is not a publish blocker. The only known sub-AA hover pair of this class is
fixed. The case for building it is the same as the case for the rounding fix: a
gate that cannot see a class of defect reports that class as absent.
