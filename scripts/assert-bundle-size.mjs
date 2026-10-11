/**
 * Bundle size as a gate rather than a sentence in a JSON file.
 *
 * `validation.performance` read PASS on numbers measured 2026-04-28 and never
 * re-measured. Table went from an assumed 6.2 KB to a real 15.30 and nothing
 * failed, because the size lived in a record. The 6.2 was not even a
 * measurement — it was the worked example in `ai/07-performance.md`'s OUTPUT
 * FORMAT block, read as data.
 *
 * ── What is gated: `exclusive` ──────────────────────────────────────────────
 *
 * Three numbers exist per entry and only one of them makes a fair ceiling.
 *
 *   own        the component's own chunk. Meaningless: Rollup splits some
 *              components across siblings, so Button is 0.17 KB and Avatar
 *              0.23 KB. A ceiling you pass by moving bytes next door.
 *   closure    the eager static closure of the public entry — what
 *              `@chumlab/ui/<name>` costs imported alone. Honest, but it
 *              charges a component for composing: CountryFlag is 11.19 here
 *              and 1.59 exclusive, the difference being a Tooltip that any
 *              page using Tooltip has already paid for. A gate on this
 *              reddens when composition improves, which points it backwards.
 *   exclusive  bytes reachable from this entry and from no other — the
 *              marginal cost of adding the component to a page already using
 *              the library. GATED.
 *
 * `own` and `closure` are still reported, because the gap between them is the
 * composition story and hiding it would be the same mistake in a new place.
 *
 * ── Shape, and why it is derived from SOURCE ───────────────────────────────
 *
 * The shape sets the ceiling, so hand-assigning it would make the ceiling a
 * matter of opinion. It is derived, first match wins — and it is derived from
 * `src/components/<name>`, not from the built artifact.
 *
 * It used to read the built chunk, which measured a proxy. "Does this component
 * portal?" is a fact about its source; which chunk the `createPortal` call ends
 * up in is a fact about Rollup. When the menu surfaces were extracted behind
 * `MenuSurface`, the call moved into a shared chunk and eight components lost
 * their overlay classification — their ceilings fell 2-4 KB because they got
 * smaller. Three more (Modal, Drawer, Toast) had been misread the same way for
 * longer, their own chunks being too small to hold the call.
 *
 * Reading the whole closure instead would swap one proxy for another: every
 * component that renders a Tooltip would inherit "overlay" from it. Source is
 * the level the question is actually asked at.
 *
 *   surface   renders a two-dimensional cell grid (`role="grid"`)
 *   overlay   renders into a portal — `createPortal`, or `MenuSurface`, which
 *             is the shared surface that portals on its behalf
 *   composed  EITHER ships sub-components of its own — a named export the
 *             package root re-exports from this component's directory, with a
 *             `<Tag>Props` type of its own, which is the same derivation
 *             `build-subcomponent-schemas.mjs` uses — OR imports another
 *             component, resolved by path rather than matched by name:
 *             `../CircularLoader` from inside Loader is Loader's own file, and
 *             a chunk called `AccordionShimmer-*.js` is not evidence that
 *             Accordion depends on something else
 *   control   none of the above
 *
 * The positive half was added because "else control" is a default, not a
 * classification. Accordion portals nothing and imports no sibling, so it fell
 * to control by elimination and was measured against a Button's ceiling while
 * shipping four sub-components and 27 props. A component that ships its own
 * composition is composed on any reading of the ladder; that it also has to be
 * caught by an import was an artefact of there being only one test.
 *
 * ── Ceilings ────────────────────────────────────────────────────────────────
 *
 * Multiples of the library's own floor: 4.15 KB, the closure of Loader, the
 * cheapest complete shipping component. 1.5 / 2 / 2.5 / 3 by shape. Derived
 * from what a component of each shape should cost, not from what the current
 * worst costs — fitting to the breaches is what a baseline does.
 */
import { gzipSync } from "node:zlib";
import {
  readFileSync, existsSync, readdirSync, statSync,
  writeFileSync, rmSync, mkdirSync,
} from "node:fs";
import { randomBytes } from "node:crypto";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = resolve(root, "dist");

const FLOOR = 4.15;
const CEILINGS = { control: 6, composed: 8, overlay: 10, surface: 12 };

/**
 * The whole library, deduplicated: every entry's closure unioned once.
 * Individual entries can each stay green while the aggregate drifts, and
 * nothing would have noticed.
 *
 * Every move of this number is a row here, and every row states why. It used
 * to be a bare constant that only ratcheted down, and a down-only ratchet
 * cannot tell a library that got leaner from one that stopped doing its job:
 * both read as a smaller number, and the second one is a defect. That is not
 * hypothetical. 6dd1925 deleted the default styling for every checked,
 * selected and active state; the loss landed in a8c7a15's re-record two days
 * later, where 43 commits shared one window and no single cause had to be
 * named. The gate went green on a regression, and stayed green for five days.
 *
 * So a drop nobody can attribute is now a question rather than a pass: see
 * `attribution` below.
 */

/**
 * @typedef {object} TotalMove
 * @property {number} kb           the record as of this move
 * @property {string} commit       where it moved
 * @property {string} date         when
 * @property {string} reason       why, in a sentence a reader can check
 * @property {"measured"|"attributed"|"unattributed"} attribution
 *   `measured`     — the first record, taken when the gate was written.
 *   `attributed`   — a named change in the window accounts for the delta.
 *   `unattributed` — nothing in the window accounts for it. Allowed, but a
 *                    drop of this kind must also answer `question`.
 * @property {string} [question]   what was checked before accepting it
 */

/** @type {TotalMove[]} */
const LIBRARY_TOTAL_HISTORY = [
  {
    kb: 155.76,
    commit: "c1d6d2e",
    date: "2026-09-02",
    attribution: "measured",
    reason:
      "First record, measured when this gate was written. Nothing to compare against yet.",
  },
  {
    kb: 151.11,
    commit: "a8c7a15",
    date: "2026-09-05",
    attribution: "unattributed",
    reason:
      "Re-record after the gate went red on the shrink check. 43 commits in the window, " +
      "40 of them touching src/; the commit's own source change is Dropdown.tsx +28 lines, " +
      "which adds rather than removes. No single change accounts for -4.65 KB.",
    question:
      "Established retroactively on 2026-09-09, and the answer is bad: 6dd1925 is in this " +
      "window. It deleted 104 state keys AND the default styling for the states they named, " +
      "worth about 1.8 KB of the drop. Restoring that styling is what raised the record to " +
      "148.52. This row is the one the gate should have refused, and it is left here as an " +
      "unattributed drop rather than tidied into a reason it never had.",
  },
  {
    kb: 150.76,
    commit: "aa3a802",
    date: "2026-09-07",
    attribution: "attributed",
    reason:
      "DatePicker's optional halves deferred behind useLazyComponent — MarkerTooltip and " +
      "PresetsPanel moved out of the entry's static closure.",
  },
  {
    kb: 148.35,
    commit: "c75d126",
    date: "2026-09-07",
    attribution: "attributed",
    reason:
      "InternationalPhoneInput's country data packed: constants.ts lost 262 lines of " +
      "per-country object literals for a compact encoding.",
  },
  {
    kb: 147.76,
    commit: "ad3f479",
    date: "2026-09-07",
    attribution: "attributed",
    reason:
      "Table's column-filter dialog split into FilterPanel.tsx and loaded from its own " +
      "chunk, taking 218 lines out of Table's static closure.",
  },
  {
    kb: 146.65,
    commit: "e7f7940",
    date: "2026-09-08",
    attribution: "unattributed",
    reason:
      "Re-measure of every gate record. This commit changes no file under src/ at all; " +
      "5 of the 6 commits in the window do, and none of them is a size change anyone named.",
    question:
      "Re-checked on 2026-09-09. The window is after 6dd1925, so this drop is not the " +
      "deleted styling; it is ordinary drift from the token and portal work in those five " +
      "commits. Accepted as drift, not as a saving anyone can claim.",
  },
  {
    kb: 148.52,
    commit: "(uncommitted)",
    date: "2026-09-09",
    attribution: "attributed",
    reason:
      "INCREASE, the first this record has had. Restored the state styling 6dd1925 deleted " +
      "across Checkbox, RadioButton, Switch, Stepper and TabPanel. Measured 148.51 against " +
      "146.65 and split by building the tree twice: +1.82 KB the restored styling and " +
      "TabPanel's flex layout, +0.04 KB the 18 added cursor-pointer class tokens.",
  },
  {
    kb: 148.7,
    commit: "(uncommitted)",
    date: "2026-09-09",
    attribution: "attributed",
    reason:
      "INCREASE, +0.18 KB. The accordion keyframes now ship. They referenced " +
      "`animation-name: cl-accordion-down` from the components while the " +
      "@keyframes lived only in src/index.css, the docs site's own stylesheet — " +
      "so the animation worked on the site and was dead for every consumer. " +
      "Moving them into dist/styles.css is what the bytes are. `verify:css-names` " +
      "now fails when a name the shipped JS references has no definition in the " +
      "shipped CSS, so this cannot recur silently.",
  },
  {
    kb: 148.71,
    commit: "678837c",
    date: "2026-09-10",
    attribution: "attributed",
    reason:
      "INCREASE, +0.01 KB. Accordion's controlled value accepts `null`, so the " +
      "state manager gained a branch. Backfilled — see the 150.00 row for why " +
      "these eight rows were established after the fact rather than as they landed.",
  },
  {
    kb: 148.89,
    commit: "6ea7eea",
    date: "2026-09-10",
    attribution: "attributed",
    reason:
      "INCREASE, +0.18 KB. `useControlledSwitchWarning` called from " +
      "`useControllableState`, which 22 components share. The message strings are " +
      "behind `import.meta.env.DEV` and dist ships none of them — checked, the " +
      "text appears only in .d.ts comments — so this is the plumbing, not the " +
      "prose: two refs and an effect in a module every one of those components " +
      "pulls in.",
  },
  {
    kb: 149.19,
    commit: "36d270d",
    date: "2026-09-10",
    attribution: "attributed",
    reason:
      "INCREASE, +0.30 KB. AvatarBadge's `tone` doubled its class table — six " +
      "variant strings became twelve, one set per token family — and " +
      "AvatarGroupShimmer went to two elements per placeholder so the ring stops " +
      "inheriting the pulse. Class strings are most of it.",
  },
  {
    kb: 149.93,
    commit: "a3c6059",
    date: "2026-09-10",
    attribution: "attributed",
    reason:
      "INCREASE, +0.74 KB, the largest single move in the window and the one " +
      "worth reading. AvatarGroupCount gained 119 lines: the cap, the glyph-fit " +
      "arithmetic that sizes the count to the circle, the overlap padding, and " +
      "the group-only style branch. Three rounds of geometry fixes on one " +
      "sub-component cost half the window.\n\n" +
      "CORRECTED 2026-09-10: this row first read \"comments strip; the arithmetic " +
      "does not\". That is false — `build:lib` ships comments into dist. Measured " +
      "directly: `dist/shared/AvatarBadge-*.js` is 9% comment lines, and cutting " +
      "one five-line comment to one line moved the library total 150.22 to " +
      "150.05. So a large share of this +0.74 KB is the prose added alongside " +
      "the logic, not the logic. Prose in `src/components` is shipped bytes.",
  },
  {
    kb: 149.92,
    commit: "76c8ea0",
    date: "2026-09-10",
    attribution: "attributed",
    reason:
      "DECREASE, -0.01 KB. Avatar's close-out. The fallback-during-load underlay " +
      "adds JSX and the constants extraction removes duplicated literals; they " +
      "net out.",
  },
  {
    kb: 150.0,
    commit: "ad0b666",
    date: "2026-09-10",
    attribution: "attributed",
    reason:
      "INCREASE, +0.08 KB over 149.92. The skeleton " +
      "fill became `--cl-bg-skeleton` across 8 components, and `bg-cl-bg-skeleton` " +
      "is a longer string than `bg-gray-200` at 13 sites. The token itself is CSS " +
      "and this total is gzipped JS only, so it contributes nothing here. Table's " +
      "dead gradient default and MultiSelectDropdown's two nested `animate-pulse` " +
      "came out in the same pass, which is why 13 renames cost only 80 bytes.\n\n" +
      "The five rows above this one were backfilled on 2026-09-10 by building each " +
      "commit in a worktree and measuring with this same script. They should have " +
      "been recorded as they landed; they were not, because those slices were " +
      "scoped to typecheck and a site build and never ran this gate. 148.70 stood " +
      "while the real figure walked to 149.92 — a ratchet nobody pulls is a number, " +
      "not a gate. CLAUDE.md now requires this gate on any slice touching " +
      "src/components. Two commits in the window changed no component and moved it " +
      "0.00 KB, which is the control that says the ladder measures what it claims.",
  },
  {
    kb: 150.05,
    commit: "(uncommitted)",
    date: "2026-09-10",
    attribution: "attributed",
    reason:
      "INCREASE, +0.05 KB. AvatarBadge's soft accent count moved from " +
      "`text-cl-accent` to `text-cl-accent-hover`: the first measured 4.31:1 on " +
      "`--cl-accent-bg` in light, under AA at 11px, which `contrast-painted` " +
      "caught the first time this slice ran it. The 15 new visual subjects cost " +
      "nothing — baselines are not shipped — and neither does the fixture-wrap " +
      "fix, which is in the fixture route.\n\n" +
      "The first measurement of this change read +0.22 KB. 0.17 of that was a " +
      "five-line comment explaining the contrast maths, which `build:lib` ships " +
      "verbatim. Trimmed to one line; the reasoning lives in the ADR instead. " +
      "This is what corrected the a3c6059 row above.",
  },
  {
    kb: 150.38,
    commit: "(uncommitted)",
    date: "2026-09-10",
    attribution: "attributed",
    reason:
      "INCREASE, +0.31 KB, spread across 19 components rather than concentrated. " +
      "Two conformance fixes, both class strings in constants files:\n" +
      "  * disabled affordances. An absolute audit of every component with a " +
      "`disabled` fixture found 11 that marked an element `data-disabled` and " +
      "painted it no differently, and 11 that kept `cursor: pointer` while " +
      "disabled. `data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed` " +
      "on the bordered slot of each.\n" +
      "  * error on the field, not only the message. 11 components coloured the " +
      "message and left the field neutral; they now carry " +
      "`data-[error]:border-cl-error` (plus the `has-[[data-error]]` form where " +
      "the attribute sits on an input inside the bordered control).\n" +
      "Measured at 150.36 with a DatePicker focus guard that was then reverted; " +
      "the tree now measures 150.34, and the record is left at 150.36 rather " +
      "than lowered, because a ratchet that tracks every 0.02 KB stops being " +
      "read. The next move down should re-record it." +
      "\n\n2026-09-10, still 150.36 and now measured at 150.37: the five " +
      "dropdowns gained `data-[highlighted]:bg-cl-bg-hover` on their option " +
      "slot. They emitted `data-highlighted` on the active option and styled it " +
      "nowhere, so arrowing through any dropdown moved a highlight that painted " +
      "nothing — SC 2.4.7 for the aria-activedescendant pattern. One class " +
      "token across five files, inside the 0.01 KB this record already carries.",
  },
  {
    kb: 150.50,
    commit: "(uncommitted)",
    date: "2026-09-11",
    attribution: "attributed",
    reason:
      "INCREASE, +0.07 KB. WCAG 2.2 AA is now claimed whole with no rule " +
      "disabled, which meant fixing `target-size` rather than waiving it: 17 " +
      "controls under 24x24 across both multiselects and Table. The bytes are " +
      "the hit-area class strings plus two glyph sizes — the chip icons filled " +
      "their box with `w-full h-full`, so a 24px box would have drawn a 24px X.",
  },
  {
    kb: 150.61,
    commit: "(uncommitted)",
    date: "2026-09-11",
    attribution: "attributed",
    reason:
      "INCREASE, +0.11 KB, and all of it prose. MultiSelectDropdown's chip strip " +
      "dropped `overflow: hidden` and wraps instead, which is what finally made " +
      "the chip remove button 24x24 in fact rather than on paper — the clip was " +
      "taking its negative margin back out of the hit area, 24x20 effective " +
      "against a 24x24 rect, which `target-size` cannot see because it reads the " +
      "rect. Measured three ways: 150.73 with the six-line comment that change " +
      "arrived with, 150.61 with it cut to three lines, 150.49 with no comment " +
      "at all. So the class strings are free — the wrap replaces the clip — and " +
      "the 0.12 KB is the comment, kept because it is the one thing standing " +
      "between the next reader and re-adding `overflow: hidden`. The long form " +
      "lives in the schema and MULTISELECTDROPDOWN.ai.md, which ship as data " +
      "rather than as JS.\n\n" +
      "The 345 descriptions written this slice cost nothing here: they are in " +
      "`utils/types.ts` files, which emit to `.d.ts` and erase from the JS.",
  },
  {
    kb: 150.53,
    commit: "(uncommitted)",
    date: "2026-09-11",
    attribution: "attributed",
    reason:
      "DECREASE, -0.08 KB, recorded rather than left standing: a record held " +
      "above the real figure is the hole the a8c7a15 row above documents, and " +
      "a drop nobody attributes is how 1.8 KB of deleted state styling went " +
      "unnoticed for six days. Breadcrumb's collapsed dropdown stopped wrapping " +
      "each item in a Tooltip, which takes the Tooltip import out of the " +
      "Breadcrumb chunk's closure — the menu focuses its first item on open, so " +
      "the tooltip opened with no pointer near it and landed on the row below, " +
      "and the label it repeats is already fully visible in a menu. Against " +
      "that: `border-none` became `border-0` in four components (same reset, " +
      "and the consumer's `border` can beat it), the Button loader takes " +
      "`text-current`, and three comments explaining all of it. Net -0.08.",
  },
  {
    kb: 150.79,
    commit: "(uncommitted)",
    date: "2026-09-11",
    attribution: "attributed",
    reason:
      "INCREASE, +0.26 KB. Button's `size` paints for v1: three class strings " +
      "(padding, type, gap, icon box) plus a three-entry loader map, and the " +
      "merge that applies them ahead of the consumer's classes. The prop " +
      "emitted `data-size` and painted nothing before, with the schema calling " +
      "that a decision — sm, md and lg rendered at one height. Button's own " +
      "exclusive chunk carries 0.31 of it, 2.23 to 2.54 KB.\n\n" +
      "Measured with and without the 18-line docblock above the scale: 150.79 " +
      "either way. That refines what the a3c6059 and 150.61 rows found — a " +
      "comment ABOVE an exported declaration becomes JSDoc on the `.d.ts` and " +
      "is stripped from the JS, while a comment INSIDE a value has no " +
      "declaration to attach to and ships verbatim, which is why " +
      "MultiSelectDropdown's mid-object comment cost 0.12 KB and this one costs " +
      "nothing. Position decides, not prose.",
  },
  {
    kb: 151.19,
    commit: "(uncommitted)",
    date: "2026-09-11",
    attribution: "attributed",
    reason:
      "INCREASE, +0.40 KB. Input and TextArea took Button's size scale for v1, " +
      "closing the last two places where `size` emitted `data-size` and painted " +
      "nothing — the same schema sentence in three components, and the one that " +
      "had already been read as a decision once. Each carries a three-entry " +
      "record (control padding, input padding and type, and for Input the " +
      "prefix/suffix type) plus the merge that applies it ahead of the " +
      "consumer's classes: Input 2.23 to 2.37 KB exclusive, TextArea 2.27 to " +
      "2.41.\n\n" +
      "The vertical padding moved from the control onto the input itself, which " +
      "costs nothing here and was not cosmetic: with it on the control, `sm` " +
      "rendered a 16px-tall `<input>` inside a 30px box and a click in the " +
      "padding landed on the wrapper. `e2e/target-size.spec.ts` failed it at " +
      "1206x16 against the 24px floor before the scale shipped.",
  },
  {
    kb: 151.60,
    commit: "(uncommitted)",
    date: "2026-09-11",
    attribution: "attributed",
    reason:
      "INCREASE, +0.41 KB, across two components fixing defects found by eye on " +
      "the demo pages.\n\n" +
      "Checkbox (+0.10 exclusive, 2.92 to 3.02): the checked, indeterminate, " +
      "error and success fills left the default class string and became a " +
      "resolved record merged ahead of the consumer's classes. As " +
      "`data-[state=checked]:bg-cl-accent` they beat " +
      "`classes={{ control: 'bg-green-500' }}` outright — measured on the " +
      "checked fixture, the consumer's class present in the DOM and the box " +
      "still rgb(91,155,255) — which is the `border-none` defect in its third " +
      "and most visible place. Success is new paint rather than moved paint: " +
      "the message went green and the box stayed accent, so a validated field " +
      "disagreed with itself.\n\n" +
      "CountryFlag (+0.31 closure): the flag surplus now occupies exactly one " +
      "flag's tile inside the row's own overlap, the way AvatarGroup's has " +
      "since 36d270d. It was `minWidth` plus padding with a `marginLeft: 8` " +
      "cancelling that overlap, so it grew with its count and sat outside the " +
      "stack. The bytes are the fit arithmetic and the cap.",
  },
  {
    kb: 152.05,
    commit: "(uncommitted)",
    date: "2026-09-12",
    attribution: "attributed",
    reason:
      "INCREASE, +0.45 KB, and it buys a consumer-facing contract rather than " +
      "a look: `src/utils/mergeSlot.ts`, plus routing all 33 components' slot " +
      "merges through it. A library default written as `data-[state=checked]:" +
      "bg-cl-accent` and a consumer's `bg-green-500` are different " +
      "tailwind-merge keys, so both survived and the variant won at paint time " +
      "— the consumer's class in the DOM, doing nothing. Found by eye three " +
      "times and fixed three times as an instance; the sweep then found 99 more " +
      "reachable sites across 20 components, which is what a shared merge " +
      "boundary costs 0.45 KB to close.\n\n" +
      "It is one function rather than 99 edits because the rendered result is " +
      "identical either way — the visual suite did not move a single baseline — " +
      "and 99 hand-plumbed state resolutions would have been 99 chances to get " +
      "one wrong. The cost is bounded: `twMerge` is 0.6us per token pair " +
      "measured, and the work only happens when a consumer actually passes " +
      "`classes`.",
  },
  {
    kb: 152.10,
    commit: "(uncommitted)",
    date: "2026-09-12",
    attribution: "attributed",
    reason:
      "INCREASE, +0.05 KB, all of it Tooltip: the arrow's offset on the rotated " +
      "sides. `rotate(90deg)` spins the SVG about its own centre, so the box the " +
      "offsets are measured from does not change and only about half the arrow " +
      "cleared the bubble — the rest lay ON it with both stroked edges showing, " +
      "which is why a right-placed arrow read as a diamond overlapping the card " +
      "rather than a point growing out of it. Measured at dx -2 before and dx -5 " +
      "after, matching top and bottom exactly. The bytes are one derived " +
      "constant and the comment that says why it exists.",
  },
  {
    kb: 152.12,
    commit: "(uncommitted)",
    date: "2026-09-12",
    attribution: "attributed",
    reason:
      "INCREASE, +0.02 KB, all of it TextArea's size table: the control now " +
      "releases its right padding when the textarea is its last child, and the " +
      "textarea takes that padding back in the same case. The browser draws a " +
      "resize grip at the TEXTAREA's border-box corner, so the control's " +
      "padding held it 15px inside the visible border with the field's own " +
      "background under it — the vertical half of this was fixed when the size " +
      "scale landed and the horizontal half was left. Measured 15px before and " +
      "1px (the border) after; the visual suite moved 19 pixels on " +
      "`TextArea/labelled` and they are all the grip. The bytes are one " +
      "arbitrary variant and one `last:` per size.",
  },
  {
    kb: 152.16,
    commit: "(uncommitted)",
    date: "2026-09-12",
    attribution: "attributed",
    reason:
      "INCREASE, +0.04 KB, all of it Switch: `aria-invalid` on the control in " +
      "the error state, plus the comment that says why. Input, OtpInput and " +
      "Checkbox all expose it; Switch linked `errorMessage` through " +
      "`aria-describedby` and stopped there, so a screen reader read the error " +
      "out while the control it belongs to was still announced as valid. " +
      "Switch has no border to colour, so this attribute and the message are " +
      "the whole of its error state — which is also why nothing had noticed. " +
      "Planted by removing the attribute: the new ARIA case fails alone.",
  },
  {
    kb: 152.61,
    commit: "(uncommitted)",
    date: "2026-09-13",
    attribution: "attributed",
    reason:
      "INCREASE, +0.45 KB, and all of it Drawer's grab handle: two slots in " +
      "the type — `handle` for the hit row and `handleBar` for the bar drawn " +
      "inside it — their default classes, and the element rendered when " +
      "`swipeable` is set. It measured 152.50 with the bar's classes written " +
      "inline; `constants.contract` counts a literal className at a call site " +
      "and that was the ninth in Drawer.tsx against a baseline of eight, so " +
      "the bar became a slot of its own. Two keys rather than one because they " +
      "are two promises: restyling the bar should not shrink the target, and " +
      "widening the target should not redraw the bar. Swipe was pointer-invisible before it — the panel " +
      "took `onPointerDown` and nothing on screen said so, and a drag begun on " +
      "body text selected the text instead. The handle is a 36x4 bar in a " +
      "full-width 20px hit row, `cursor: grab`, `select-none`, `aria-hidden` " +
      "because Escape and the close button already cover the keyboard. " +
      "Rendered only when `swipeable`, so a drawer that cannot be dragged does " +
      "not advertise that it can. Photographed by a new subject, " +
      "`Drawer/swipeable-bottom`, whose plant margin is 132 pixels against a " +
      "budget of 1 at every width — removing the bar's fill.",
  },
  {
    kb: 154.3,
    commit: "eae3cf5",
    date: "2026-09-14",
    attribution: "attributed",
    reason:
      "INCREASE, +1.69 KB, recorded after the fact: eae3cf5 was committed with " +
      "this gate red and the failure was read as machine load, although the " +
      "gate ran at its normal 11s. Measured per entry by building afa8d4a and " +
      "eae3cf5 from clean worktrees. Slider +0.74 closure: `markLabel` split " +
      "from `marker` so labels stop wearing the dot's chip classes, the end " +
      "labels aligned to the track, `--cl-bg-track`, and the cursor classes. " +
      "Drawer +0.63: the drag rewrite — pointer capture on press, a drag that " +
      "ends when `buttons` reports nothing held, secondary buttons ignored, a " +
      "mouse dragging only from the handle, one transform write per frame — " +
      "and the comments saying why. Pagination +0.31: default classes for the " +
      "selected page, which was announced three ways and painted none. " +
      "TimePicker +0.05: `cursor-pointer` on the clock face, found by the " +
      "pointer-affordance gate. The closure deltas sum to 1.73 because shared " +
      "chunks count under more than one entry.",
  },
  {
    kb: 154.56,
    commit: "(uncommitted)",
    date: "2026-09-14",
    attribution: "attributed",
    reason:
      "INCREASE, +0.26 KB. Modal +0.12 closure: `overlayOpacity` moves from the " +
      "overlay's CSS opacity to the alpha of its background, as Drawer's did, " +
      "so the default backdrop blur actually paints — edge energy behind the " +
      "overlay 1.414 before, 0.082 after; the comment is three lines pointing " +
      "at Drawer's rather than a second copy, which is 0.33 KB less than the " +
      "first draft measured. Pagination +0.11: the selected page's text moves " +
      "to `--cl-accent-hover`, because `text-cl-accent` on its tint painted " +
      "4.31:1 in light where 4.50 had been reported, and hover deepens the " +
      "tint instead; the comment records the wrong figure. Slider +0.01: " +
      "`data-disabled` on the control and each mark dot with " +
      "`cursor-not-allowed`, so a disabled slider stops offering a pointer. " +
      "The remaining 0.02 is spread across the shared chunks those three import.",
  },
  {
    kb: 154.63,
    commit: "(uncommitted)",
    date: "2026-09-14",
    attribution: "attributed",
    reason:
      "INCREASE, +0.07 KB, all of it Pagination (+0.08 closure). The selected " +
      "rows-per-page option's text moves from `--cl-accent` to " +
      "`--cl-accent-hover`, because `text-cl-accent` on `--cl-accent-bg` " +
      "painted 4.4999:1 in light and passed only because every contrast gate " +
      "compared a two-decimal ratio; a highlighted or hovered selected option " +
      "now deepens the tint to `--cl-accent-bg-hover` instead of the text. " +
      "Most of the bytes are the rewritten comment that records the measured " +
      "figure and why no fixture had rendered the state. The same text change " +
      "on both multi-select chips and Table's selected filter item swaps one " +
      "class name for another of the same length and measures no change.",
  },
  {
    kb: 155.44,
    commit: "(uncommitted)",
    date: "2026-09-30",
    attribution: "attributed",
    reason:
      "INCREASE, +0.81 KB, and none of it is new behaviour: it is five dev " +
      "warnings that were always in source and never in the package. They were " +
      "guarded by `import.meta.env.DEV`, which the library build folds to " +
      "`false`, so every branch and message was dropped before a consumer's " +
      "bundler saw it. The guard is now `process.env.NODE_ENV`, which the " +
      "build leaves for the consumer, and `assert-dev-warnings` fails when a " +
      "message is compiled out again. Exclusive moves: Button +0.14 (the " +
      "`span` accessible-name message), Modal +0.08 (nesting limit), " +
      "CascadingDropdown +0.06 — not its message, which shipped all along as " +
      "the argument it passes, but `useInertPropWarning`'s body, which rollup " +
      "bundles into its chunk as the only caller and which was an empty " +
      "effect before. Stepper, MultiSelectDropdown, Switch, Dropdown and " +
      "Pagination +0.01 each, not attributed further: none of them carries a " +
      "message. The other 0.48 is the accessible-name and controlled-switch " +
      "messages in their shared chunks, which exclusive measurement assigns " +
      "to no entry. Measured in the vite-react19 consumer's production " +
      "build on 2026-09-30: 4 of 5 messages and every library `console.warn` " +
      "are dropped. CascadingDropdown's survives, because it is the literal " +
      "argument at the call site and `useInertPropWarning`'s body, emptied " +
      "there, is the only part a bundler can remove.",
  },
  {
    kb: 155.4,
    commit: "(uncommitted)",
    date: "2026-09-30",
    attribution: "attributed",
    reason:
      "DECREASE, -0.04 KB, all of it CascadingDropdown (-0.03 exclusive; no " +
      "other entry moved at two decimals). The 0.01 between those is not a " +
      "second move: the total gzips all 80 files as one stream and the " +
      "exclusive figure gzips only CascadingDropdown's own files, so the same " +
      "deleted bytes compress differently in each, and each is rounded to two " +
      "decimals on its own. `useInertPropWarning` now takes the raw " +
      "`onLoadChildren` and `options` and does the tree walk and the message " +
      "inside its guarded effect, so the component's `useMemo` and the " +
      "component-name argument are gone. The message itself still ships in " +
      "the package — it is behind the guard rather than in the call — which " +
      "is why this is small here: the saving is in a consumer's production " +
      "build, where `verify:consumers` now reads 0 of 5 messages in all nine " +
      "templates against 1 of 5 in the five that render this component.",
  },
  {
    kb: 155.44,
    commit: "(uncommitted)",
    date: "2026-09-30",
    attribution: "attributed",
    reason:
      "INCREASE, +0.04 KB, two entries and nothing else. Slider +0.07 " +
      "exclusive, split by building the tree twice: the range's " +
      "`data-[disabled]:opacity-50` costs 0.00 at two decimals (5.47 without " +
      "its comment, as before), and the four-line comment saying why the " +
      "range is a sibling the track's opacity never reached is all 0.07 — " +
      "`build:lib` ships comments, so that prose is bytes. DatePicker -0.02: " +
      "`showClearButton` deleted as a duplicate of `clearable`, taking its " +
      "destructured default and the `??` chain that made `clearable` dead. " +
      "The total moves 0.01 less than the entries sum to because it is one " +
      "gzip stream over all 80 files, not the sum of per-entry streams.",
  },
  {
    kb: 155.63,
    commit: "(uncommitted)",
    date: "2026-10-01",
    attribution: "attributed",
    reason:
      "INCREASE, +0.19 KB. A success state now paints the field border an " +
      "error state does: `data-[valid]:border-cl-success` beside every " +
      "`data-[error]:border-cl-error`, and `data-valid` emitted on the twelve " +
      "triggers, cells and radio controls that carried `data-error` alone, so " +
      "the class has an element to match. Exclusive moves, all class strings " +
      "and one attribute each: RadioButton +0.03 (also a `valid` field on the " +
      "group context), DatePicker +0.02, TimePicker +0.02, and +0.01 each for " +
      "CascadingDropdown, Dropdown, Input, InternationalPhoneInput, " +
      "MultiSelectDropdown, MultiSelectSearchableDropdown, OtpInput and " +
      "TextArea. TabPanel +0.01: the count badge's default `bg-cl-accent-bg " +
      "text-cl-accent-hover`. Those sum to 0.16; the other 0.03 is inferred to " +
      "be SearchableDropdown's identical change, which lands in a chunk it " +
      "shares and so under no entry — its exclusive held at 0.23.",
  },
  {
    kb: 155.71,
    commit: "(uncommitted)",
    date: "2026-10-01",
    attribution: "attributed",
    reason:
      "INCREASE, +0.08 KB. Escape dismisses the newest toast by default and " +
      "yields to whatever is above it. Exclusive moves, measured against a " +
      "build of 68e2cef from `git archive` rather than against the record: " +
      "Toast +0.07 — the listener moved from the provider to the toast, on " +
      "window, skipping a key an overlay already marked, plus the newest-" +
      "visible lookup and its two comments. Modal +0.01 and Drawer +0.01: " +
      "`preventDefault` on every Escape while open and on top, including under " +
      "`closeOnEscape={false}`. DatePicker +0.01: the month/year list's Escape " +
      "marks the key and fires only while open. CascadingDropdown +0.01: its " +
      "trigger marks Escape only when a submenu or the menu closes, which " +
      "splits one `preventDefault` into two branches and adds a comment. " +
      "Breadcrumb gained a `preventDefault` and Table's inline edit one, while " +
      "Table's grid Escape lost its own; both held at two decimals. Those sum " +
      "to 0.11 at two decimals; " +
      "the total is one gzip stream over all 80 files, not the sum of " +
      "per-entry streams. Table reads 15.86 against its declared 15.85 in both " +
      "builds, so that 0.01 predates this move.",
  },
  {
    kb: 155.74,
    commit: "(uncommitted)",
    date: "2026-10-01",
    attribution: "attributed",
    reason:
      "INCREASE, +0.03 KB. Tooltip opens on focus only when the focus is " +
      "`:focus-visible`: an `isFocusVisible` helper and its comment, and the " +
      "asChild trigger forwarding the focus event it used to drop. Measured " +
      "against a build of f3a8320 from `git archive`: Tooltip's own chunk " +
      "4.33 -> 4.38, which is shared, so it lands under no entry's exclusive " +
      "(Tooltip held at 0.16) and shows instead as +0.03 to +0.05 in the " +
      "closures of the seven entries that compose it — Avatar, Breadcrumb, " +
      "Button, CountryFlag, InternationalPhoneInput, Stepper, TabPanel. " +
      "Stepper and CountryFlag exclusive -0.01 each, with no source change in " +
      "either: where the gzip boundaries of the shared chunks fell. The " +
      "underline fix is demo recipes, fixtures and docs, none of which ships.",
  },
  {
    kb: 155.86,
    commit: "(uncommitted)",
    date: "2026-10-01",
    attribution: "attributed",
    reason:
      "INCREASE, +0.12 KB, and 80 -> 81 files. React 18 ref paths: a new " +
      "shared `getElementRef` chunk (0.19 KB standalone at gzip -9, computed) " +
      "that Tooltip's asChild trigger and Slot both import, and MenuItem " +
      "wrapped in `forwardRef`. Measured against a build of ebfc46c from " +
      "`git archive`, which reproduces 155.74 across 80 files: closures +0.09 " +
      "to +0.12 for the nine entries that compose Tooltip or Slot — Accordion, " +
      "Avatar, Breadcrumb, Button, CountryFlag, InternationalPhoneInput, " +
      "Stepper, TabPanel, Tooltip — with every exclusive held, because the new " +
      "chunk is shared. Tooltip own 4.38 -> 4.41. CascadingDropdown exclusive " +
      "9.27 -> 9.28 and closure +0.01, the `forwardRef` wrapper. Stepper and " +
      "CountryFlag exclusive +0.01, Accordion own -0.01 and TabPanel own " +
      "+0.01, with no source change in any of the four: where the gzip " +
      "boundaries of the shared chunks fell. No declared breach moved above " +
      "its record.",
  },
  {
    kb: 155.96,
    commit: "b02b4771",
    date: "2026-10-07",
    attribution: "attributed",
    reason:
      "INCREASE, +0.10 KB (159,605 -> 159,700 B gzipped, +95 B), 81 files " +
      "held. AccordionContent's latest-ref fix for the infinite render: the " +
      "callbacks and duration are read through refs synced in a layout " +
      "effect, the main effect keys on `isExpanded` alone, and a ref skips " +
      "mount. Inline callbacks that set parent state had re-run the effect on " +
      "every render. Measured against a build of b02b4771^ from `git archive`: " +
      "Accordion exclusive 9.14 -> 9.22 (+79 B), all of it in the chunk " +
      "holding AccordionContent (+371 B raw), plus a hash change in " +
      "Accordion's index. No other entry moved. f4b06be3 adds 5 B more (155.957 " +
      "-> 155.962), under the 0.01 a row needs.",
  },
  {
    kb: 155.70,
    commit: "(uncommitted)",
    date: "2026-10-07",
    attribution: "attributed",
    reason:
      "DECREASE, -0.26 KB (159,705 -> 159,435 B gzipped, -270 B), 81 files " +
      "held. `renderTrigger(triggerProps, state)`: MultiSelectDropdown, " +
      "MultiSelectSearchableDropdown and CascadingDropdown wrote their trigger " +
      "attributes out twice, once per branch, and now build one object both " +
      "branches spread — exclusive -58 B, -59 B and -9 B (Cascading's net of " +
      "the dedupe and its new subItem disabled tokens). Dropdown +6 B, " +
      "`type` moving into the shared object. TimePicker +5 B, the clockNumber " +
      "disabled tokens. SearchableDropdown and InternationalPhoneInput -2 B " +
      "each, chunk hashes only. Table did not move. Measured against a build " +
      "of f4b06be3, whose library is HEAD's.",
  },
  {
    kb: 155.74,
    commit: "(uncommitted)",
    date: "2026-10-08",
    attribution: "attributed",
    reason:
      "+0.04 KB (159,435 -> 159,476 B gzipped, +41 B), 81 files held, all of " +
      "it TimePicker: own +26 B, closure +20 B, exclusive +23 B. The clock's " +
      "pressed toggles get Pagination's active-item paint (three " +
      "`data-[active]:` tokens on clockHours, clockMinutes and periodButton), " +
      "disabled clock numbers carry aria-disabled, the slider's aria-valuemin/" +
      "max read the bounded range, clearable defaults to true, and the clear " +
      "icon's size test reads the consumer's clearTrigger rather than the " +
      "never-empty default (a3354b7a inverted it). No other entry moved; " +
      "Table held. Measured against a build of 6f7f96a6.",
  },
  {
    kb: 155.72,
    commit: "(uncommitted)",
    date: "2026-10-08",
    attribution: "attributed",
    reason:
      "DECREASE, -0.01 KB (159,472 -> 159,458 B gzipped, -14 B), 81 files " +
      "held. Tooltip: own -20 B, closure -25 B, exclusive -1 B. Its Escape moved " +
      "from a handler passed to both triggers (and composed into asChild " +
      "children) to one window capture listener while open, so it dismisses " +
      "wherever focus is and ahead of a Modal or Drawer. Avatar, Button, " +
      "CountryFlag, Stepper and TabPanel carry Tooltip in their closures, -14 " +
      "to -25 B each; their own/exclusive +-1-2 B are chunk hashes. Table held. " +
      "Measured against a build of a752e433.",
  },
  {
    kb: 155.74,
    commit: "(uncommitted)",
    date: "2026-10-08",
    attribution: "attributed",
    reason:
      "INCREASE, +0.02 KB (159,458 -> 159,479 B gzipped, +21 B), 81 files " +
      "held. MultiSelectSearchableDropdown: own +26 B, closure +33 B, exclusive " +
      "+27 B. Its `loadingItem` slot carried the status text's classes, so its " +
      "shimmer rows painted nothing; it now carries Dropdown's skeleton row, " +
      "`mx-2 my-1.5 h-4 rounded bg-cl-bg-skeleton animate-pulse` (+4 B raw). " +
      "The old string repeated `loading` and `empty` in the same object and " +
      "gzipped as a back-reference; the new one is fresh text in this chunk. " +
      "Every other entry byte-identical, Table held. Measured against a build " +
      "of dc6fc0b2.",
  },  {
    kb: 155.84,
    commit: "(uncommitted)",
    date: "2026-10-08",
    attribution: "attributed",
    reason:
      "INCREASE, +0.10 KB (159,479 -> 159,577 B gzipped, +98 B), 81 files " +
      "held. Button: closure +82 B, exclusive +79 B. Its content span gained " +
      "`align-top` and its `loading` slot went from empty to `inline-flex " +
      "shrink-0`, each with a one-line comment, which ships: an icon-led or " +
      "loading Button stood up to 5px taller than its size. `classLayers` " +
      "gained `/^align-/` as structural, so `unstyled` keeps it; that shared " +
      "chunk is the +1 to +11 B in every other closure. Own and exclusive " +
      "elsewhere -3 to +4 B, chunk hashes. Table held (exclusive 16,239 -> " +
      "16,237 B). Measured against a build of 9d7830c3.",
  },  {
    kb: 155.94,
    commit: "(uncommitted)",
    date: "2026-10-08",
    attribution: "attributed",
    reason:
      "INCREASE, +0.11 KB (159,577 -> 159,685 B gzipped, +108 B), 81 files " +
      "held. Table: own +129 B, closure +139 B, exclusive +131 B (16,237 -> " +
      "16,368 B), its declared breach raised 15.85 -> 15.98 in the same move: " +
      "the custom-checkbox selection becomes a keyboard-operable native " +
      "checkbox (a11y defect: not focusable, no Space); HEAD sat 3.6 B under " +
      "the limit. One input for both paths, visually hidden beside the custom " +
      "icon in a label; its four class strings in constants.ts, where the " +
      "call-site ratchet wants them (Table.tsx 46 -> 45 literals). Every other " +
      "entry byte-identical bar a +4 B shared closure. Measured against a " +
      "build of ba82f508.",
  },  {
    kb: 155.92,
    commit: "(uncommitted)",
    date: "2026-10-09",
    attribution: "attributed",
    reason:
      "DECREASE, -0.03 KB (159,685 -> 159,658 B gzipped, -27 B), 81 files " +
      "held. Control boundaries move to `--cl-border-input`, now #6b7280 in " +
      "both themes, so a field clears 3:1 on every library surface. Switch " +
      "-13 B exclusive: its off-track default became that token, dropping the " +
      "`dark:` duplicate and both hex values. The seven field triggers +1 to " +
      "+3 B each: hover now names `--cl-border-input-hover` instead of the " +
      "rest token. Input, TextArea, Pagination and Table -2 to -1 B: their " +
      "field border names the input token instead of `--cl-border`. Shared " +
      "closure -12 B. No declared breach moved (Table exclusive -2 B). " +
      "Measured against a build of 71d52c1e.",
  },  {
    kb: 156.08,
    commit: "(uncommitted)",
    date: "2026-10-09",
    attribution: "attributed",
    reason:
      "INCREASE, +0.16 KB (159,658 -> 159,823 B gzipped, +165 B), 81 files " +
      "held. Table alone: own +149 B, closure +143 B, exclusive +146 B " +
      "(16,366 -> 16,512 B), its declared breach raised 15.98 -> 16.13 in the " +
      "same move. +102 B is the cell editor fixed (L9): the roving-focus effect " +
      "no longer takes focus from inside the cell, which closed the editor on " +
      "open; Enter and F2 open it; it keeps its own keys; Enter and Escape hand " +
      "focus back to the cell; the cell leaves the tab order while its editor " +
      "is open. +36 B is the editor's field boundary and focus classes, +10 B " +
      "its accessible name. Every other entry byte-identical. Measured against a build of " +
      "76e92aa6.",
  },
  {
    kb: 156.19,
    commit: "(uncommitted)",
    date: "2026-10-09",
    attribution: "attributed",
    reason:
      "INCREASE, +0.12 KB (159,823 -> 159,942 B gzipped, +119 B), 81 files " +
      "held. Table alone: own +134 B, closure +138 B, exclusive +135 B " +
      "(16,512 -> 16,647 B), its declared breach raised 16.13 -> 16.26 in the " +
      "same move. +78 B is footerContent (L10): a footer of rows renders " +
      "directly in <tfoot> instead of nested inside Table's own cell. +57 B is " +
      "Home/End and Ctrl+Home/Ctrl+End on the grid's cells (L10). Every other " +
      "entry byte-identical. Measured against a build of f297c01b.",
  },
  {
    kb: 156.28,
    commit: "(uncommitted)",
    date: "2026-10-10",
    attribution: "attributed",
    reason:
      "INCREASE, +0.09 KB (159,942 -> 160,030 B gzipped, +88 B), 81 files " +
      "held. Table exclusive +68 B (16,647 -> 16,715 B; own +65 B, closure " +
      "+64 B), its declared breach raised 16.26 -> 16.32 in the same move: one " +
      "body tab stop with pinned columns (L11), each pinned part continuing the " +
      "column index. Loader exclusive +12 B (1,745 -> 1,757 B): the LinearLoader " +
      "track fix (L11), the default track painted at 20% on its own instead of " +
      "the root's opacity fading the bar with it. Every other entry " +
      "byte-identical. Measured against a build of 1b1c91f9.",
  },
  {
    kb: 156.24,
    commit: "(uncommitted)",
    date: "2026-10-10",
    attribution: "attributed",
    reason:
      "DECREASE, -0.04 KB (160,030 -> 159,990 B gzipped, -40 B), 81 files " +
      "held. A2a API renames. Accordion exclusive -65 B (9,442 -> 9,377 B): " +
      "its root onExpandedChange(event) and the AccordionExpandEvent payload " +
      "removed, onValueChange already reporting the same change. Table " +
      "exclusive +27 B (16,715 -> 16,742 B), its declared breach raised 16.32 " +
      "-> 16.35 in the same move: onPinnedColumnsChange builds the full new " +
      "array; the renames alone measure 0 B. Toast -7 B (4,570 -> 4,563 B): " +
      "onRemove and onDismiss merged into one onDismiss(id). Drawer -4 B, " +
      "CascadingDropdown +3 B, Avatar +2 B (onLoad/onError forward the " +
      "event), TimePicker -2 B (onBlur forwards the event), MultiSelectDropdown " +
      "-2 B, SearchableDropdown +1 B, Checkbox, Switch, Dropdown -1 B each: " +
      "name lengths. Every other entry byte-identical. Measured against a " +
      "build of cd48847c.",
  },
  {
    kb: 156.41,
    commit: "(uncommitted)",
    date: "2026-10-11",
    attribution: "attributed",
    reason:
      "INCREASE, +0.17 KB over the record (measured 156.09 -> 156.41 KB; " +
      "159,834 -> 160,163 B gzipped, +329 B), 81 files held. A2e routing: " +
      "id/aria-* reach the primary control (a11y correctness). DatePicker " +
      "+64 B (12,378 -> 12,442), its declared breach raised 12.09 -> 12.15 in " +
      "the same move. MultiSelectSearchableDropdown +53 B (7,302 -> 7,355), " +
      "Dropdown +51 B (6,248 -> 6,299), MultiSelectDropdown +49 B " +
      "(7,030 -> 7,079), CascadingDropdown +38 B (9,506 -> 9,544): id is the " +
      "trigger's own, aria-labelledby/-describedby reach it. RadioButton +36 B " +
      "(3,272 -> 3,308): id and aria-* on the input, not the label. OtpInput " +
      "+32 B (3,217 -> 3,249): aria-* on the group. Slider +27 B " +
      "(5,689 -> 5,716): id and aria-describedby on the thumbs. ResizablePanel " +
      "+25 B (2,316 -> 2,341): id and aria-* on the separator. Input +8 B, " +
      "TextArea +6 B: the consumer's aria-describedby joined, not overwritten. " +
      "TimePicker -48 B (8,368 -> 8,320): its aria-label and aria-labelledby " +
      "read once from props instead of twice from restProps. Breadcrumb -11 B " +
      "(4,698 -> 4,687): separatorIcon removed. InternationalPhoneInput -1 B. " +
      "Every other entry byte-identical. Code only: the slice's comments were " +
      "deleted before measuring. Measured against a build of ea7c4101.",
  },
  {
    kb: 156.77,
    commit: "(uncommitted)",
    date: "2026-10-11",
    attribution: "attributed",
    reason:
      "INCREASE, +0.36 KB (160,163 -> 160,535 B gzipped, +372 B), 81 files " +
      "held. A2f routing: className, style and classes.root share one root, " +
      "and id/aria-* reach the element they name (a11y correctness). Per " +
      "chunk: Tooltip +81 B (4,492 -> 4,573; shared, so Tooltip's exclusive " +
      "moves +2 B): style, id and aria-* on the trigger wrapper, the " +
      "consumer's aria-describedby joined with the tooltip's id. Table +78 B " +
      "(16,727 -> 16,805 exclusive), its declared breach raised 16.35 -> " +
      "16.41 in the same move: id, aria-labelledby and aria-describedby on " +
      "both region renders. Stepper +36 B: aria-labelledby and " +
      "aria-describedby on the navigation. Toast +32 B: id, aria-label, " +
      "aria-labelledby and aria-describedby on the status root. Modal +32 B: " +
      "className and style on the outer layer, id on the dialog, the parts " +
      "spread their attributes. Accordion +29 B: AccordionContent's className " +
      "on the region and style merged, the shimmer spreads its attributes. " +
      "Avatar +25 B: both shimmers spread theirs. InternationalPhoneInput " +
      "+23 B: the group takes the name and description, the input " +
      "numberAriaLabel. Drawer +22 B: className and style on the outer " +
      "layer, id on the dialog. TabPanel +17 B: id on the root, " +
      "aria-describedby on the tablist. TextArea +14 B, Input +10 B, " +
      "FieldWrapper +3 B: style on the field root. Checkbox +9 B: style on " +
      "the root, off the native input. OtpInput -9 B: groupAriaLabel folded " +
      "into aria-label. Breadcrumb -1 B, CountryFlagGroup -1 B, ButtonGroup " +
      "+1 B: minifier noise, no source change. Chunk deltas sum to +401 B; " +
      "the concatenation gzips the shared names once, hence +372 B. No " +
      "comments added. Measured against a build of 6affdbee.",
  },
];

const LIBRARY_TOTAL_KB = LIBRARY_TOTAL_HISTORY.at(-1).kb;

/**
 * The ledger has to hold before any measurement is trusted, because a move
 * recorded without a reason is the failure this whole structure exists to
 * prevent — and it would otherwise be found by a reader, months later, with no
 * way left to establish what happened.
 */
const auditHistory = () => {
  const problems = [];
  for (const [i, m] of LIBRARY_TOTAL_HISTORY.entries()) {
    const at = `${m.commit} (${m.kb} KB)`;
    // A one-word reason is the same as no reason once the context is gone.
    if (!m.reason || m.reason.trim().length < 40) {
      problems.push(`${at}: no usable reason for the move`);
    }
    if (i === 0) continue;
    const delta = m.kb - LIBRARY_TOTAL_HISTORY[i - 1].kb;
    if (Math.abs(delta) < 0.01) {
      problems.push(`${at}: recorded as a move but the number did not change`);
    }
    if (m.attribution === "measured") {
      problems.push(`${at}: only the first record may be "measured"`);
    }
    // The clause this ledger exists for. An unattributed rise is someone
    // failing to explain growth, which the grow check already catches; an
    // unattributed FALL is the library quietly losing something, which nothing
    // else catches at all.
    if (m.attribution === "unattributed" && delta < 0 && !m.question) {
      problems.push(
        `${at}: an unattributed drop of ${delta.toFixed(2)} KB with no \`question\` — ` +
          "say what was checked before this was accepted, or attribute it",
      );
    }
  }
  return problems;
};

/**
 * Breaches that are recorded rather than fixed, each with the reason and the
 * number it may not exceed. Down-only, like every other ratchet on this branch:
 * a declared entry that shrinks must be re-recorded, and one that falls under
 * its ceiling must be deleted. A breach that is not here fails the gate.
 *
 * A ceiling is never raised to accommodate a component, and no component is
 * split to satisfy a number.
 */
const DECLARED_BREACHES = new Map([
  [
    "Table",
    {
      kb: 16.41,
      why: "2026-10-11, A2f routing: 16.35 -> 16.41 (exclusive 16,727 -> 16,805 B gzipped, +78 B). " +
        "A consumer's id, aria-labelledby and aria-describedby reach the region, which took " +
        "aria-label alone and dropped the rest; both region renders (desktop and mobile card " +
        "view) carry them. " +
        "2026-10-10, A2a API renames: 16.32 -> 16.35 (exclusive 16,715 -> 16,742 B gzipped, +27 B). " +
        "The renames themselves are 0 B: built with every A2a name and the old pin call, Table " +
        "measured 16,715 B, identical to HEAD. All +27 B is onPinnedColumnsChange receiving the " +
        "full new pinnedColumns array (the column appended or filtered out) instead of one id and " +
        "a flag, which every consumer had to fold back into an array themselves. " +
        "2026-10-10, L11: 16.26 -> 16.32 (exclusive 16,647 -> 16,715 B gzipped, +68 B). " +
        "+68 B: one body tab stop with pinned columns (WCAG 2.4.3, APG grid). Pinned parts " +
        "numbered their cells from 0, giving two tab stops and arrows that couldn't cross; the " +
        "cheaper count-from-pinnedColumns variant gives a wrong offset when a pinned column is " +
        "hidden. " +
        "2026-10-09, L10: 16.13 -> 16.26 (exclusive 16,512 -> 16,647 B gzipped, +135 B). " +
        "+78 B: footerContent renders a footer of rows directly in <tfoot> (invalid DOM in " +
        "documented use: the prop is documented as rendered inside <tfoot>, and every row " +
        "passed to it was nested inside Table's own <td>, which the browser reports and the " +
        "parser rearranges, so hydration mismatched). Text and other elements keep the " +
        "full-width row. +57 B: Home/End and Ctrl+Home/Ctrl+End move the focused cell " +
        "(documented keys missing; APG grid). Each measured on its own build, items in that " +
        "order. " +
        "2026-10-09, L9: 15.98 -> 16.13 (exclusive 16,366 -> 16,512 B gzipped, +146 B). " +
        "+102 B: cell editing fixed: the editor closed on open when focus arrived without a " +
        "prior mousedown, there was no keyboard way in (Enter/F2, WCAG 2.1.1), the grid stole " +
        "the editor's arrow keys, and focus was lost on commit and cancel. The focus-steal " +
        "guard alone is +23 B and leaves the keyboard and focus defects. +36 B: the cell " +
        "editor takes the field boundary and focus treatment. +10 B: the editor gets an " +
        "accessible name (axe label, critical). +3 B: the cell leaves the tab order while " +
        "its editor is open (axe target-size). -5 B: one edit handler shared by the " +
        "double-click and the keys. " +
        "15.85 -> 15.98 on 2026-10-08 (exclusive 16,237 -> 16,368 B gzipped, +131 B): " +
        "the custom-checkbox selection becomes a keyboard-operable native checkbox " +
        "(a11y defect: not focusable, no Space); HEAD sat 3.6 B under the limit. " +
        "15.81 -> 15.85 on 2026-09-11: row select, expand, group toggle and drag handle were brought to the 24x24 target-size floor (SC 2.5.8), which is class strings on four controls, hoisted into constants.ts after the call-site literal ratchet caught them (48 -> 46 there). 16.76 until the column-filter dialog moved into a chunk of its own " +
        "(FilterPanel), with the popup behaviour that reads its element — focus " +
        "in, reposition, close on an outside click. It is the only part of " +
        "Table that exists after an interaction rather than at the first paint, " +
        "which is what ADR 003 allows to arrive late. Every other feature is " +
        "gated by a prop the consumer sets before the first render — resize " +
        "handles, filter triggers, the search bar, the mobile cards — so a " +
        "chunk arriving a frame later would widen a header or swap the tree " +
        "after paint. Measured, not assumed: deferring all of those anyway " +
        "reaches 14.67, and 11.64 arrives only when renderHeaderCell, " +
        "renderCell, renderRow and renderTable go too. The residue is the grid. " +
        "Its props, state, TanStack config and 45 class slots cost 11.64 with " +
        "every cell stubbed out — 97% of a surface's ceiling before anything is " +
        "drawn. Subpath entries do not help: they split what a consumer imports " +
        "separately, and these are props on one component. The one exception is " +
        "`exportTableToCSV` at 0.40 KB, which the component never calls and any " +
        "consumer's tree-shaker already drops.",
    },
  ],
  [
    "InternationalPhoneInput",
    {
      kb: 8.69,
      why: "10.65 until the 193 countries were packed into a delimited string " +
        "parsed at module load: 4.06 KB gzipped of object literals became 1.90, " +
        "and four fifths of what was there was structure rather than " +
        "information — five repeated keys a bundler cannot dedupe, plus `flag` " +
        "and `label`, which are derivable from the other three in all 193 rows. " +
        "The remaining 0.69 over is the data itself, which cannot be deferred: " +
        "`selectedCountry` resolves out of it during the first render to paint " +
        "the trigger's flag and dial code, so deferring it is a blank trigger " +
        "on first paint. The parse is 0.036 ms, once per module load.",
    },
  ],
  [
    "DatePicker",
    {
      kb: 12.15,
      why: "12.59 before its optional halves moved into chunks of their own: " +
        "the presets panel with the default-preset helper it now resolves, and " +
        "the marker tooltip's subtree. 0.03 over, and the last 0.18 KB of it is " +
        "comment text — this gate measures the unminified dist, which a " +
        "consumer's bundler strips. Week numbers were the third candidate and " +
        "are not one: the rendering is fourteen lines interleaved in the day " +
        "grid, and a column that arrives with a chunk would reflow the grid " +
        "after paint.\n\n" +
        "12.03 -> 12.07 on 2026-09-10: the trigger gained the disabled and error " +
        "variants the library-wide audit added everywhere. A conformance fix, " +
        "not a feature.\n\n" +
        "12.07 -> 12.09 on 2026-10-10, A2d refs (exclusive 12,344 -> 12,378 B " +
        "gzipped, +34 B). The slot renames are 0 B here: built with every A2d " +
        "rename and the old ref, DatePicker measured 12,344 B, identical to " +
        "HEAD. All +34 B is the ref moving from the root `<div>` to the trigger " +
        "`<button>`, merged with the trigger's own ref, so `ref.current.focus()` " +
        "focuses the field and a form library can focus it on an error.\n\n" +
        "12.09 -> 12.15 on 2026-10-11, A2e routing (exclusive 12,378 -> 12,442 B " +
        "gzipped, +64 B): id/aria-* reach the primary control (a11y correctness). " +
        "The trigger takes the consumer's id, aria-label, aria-labelledby and " +
        "aria-describedby, which were spread onto the role-less root `<div>`; " +
        "the description joins the trigger's own error id.",
    },
  ],
  [
    "Accordion",
    {
      kb: 9.22,
      why: "Composed, and still 1.22 over. Its own chunk is 0.52 KB; the rest " +
        "is AccordionContent and useAccordionStateManager in sibling chunks " +
        "nothing else reaches. It shipped four sub-components against a " +
        "Button's 6 KB ceiling until the shape rule gained a positive test for " +
        "composed — the 8 KB it is measured against now is the one it earns, " +
        "and it is over that too. Nothing here is optional behind a prop: an " +
        "item, a trigger and a content panel are what an accordion is.\n\n" +
        "9.16 -> 9.22 on 2026-10-07 (b02b4771): AccordionContent reads its four " +
        "callbacks and its duration through refs and skips mount, which ended " +
        "an infinite render on inline callbacks (reproduced on React 18 and 19). " +
        "+79 B exclusive. The smaller variants were built and measured: writing " +
        "the refs during render saves 15 B, dropping the mount guard 28 B, and " +
        "neither reaches 9.16 without changing behaviour.",
    },
  ],
]);

/** How far under its record a declared breach may drift before it is stale. */
const DECLARED_SLACK_KB = 0.25;

/** Below this much under the record, the record is stale and must be lowered. */
const RATCHET_SLACK_KB = 0.5;

/** Every relative STATIC import reachable from an entry, entry included. */
const closure = (entry) => {
  const seen = new Set();
  const stack = [entry];
  while (stack.length) {
    const file = stack.pop();
    if (seen.has(file) || !existsSync(file)) continue;
    seen.add(file);
    // `import()` is not followed: CountryFlag lazy-loads one flag chunk per
    // country, and summing all 250 reports it at 349 KB — every flag at once,
    // which no consumer pays.
    for (const m of readFileSync(file, "utf8").matchAll(/from\s*["'](\.[^"']+)["']/g)) {
      stack.push(resolve(dirname(file), m[1]));
    }
  }
  return [...seen].sort();
};

const gz = (files) =>
  gzipSync(Buffer.concat(files.map((f) => readFileSync(f)))).length / 1024;

/**
 * What this gate weighs, and what it does not.
 *
 * EVERY FIGURE IN THIS FILE IS GZIPPED `.js`. Types are excluded — `.d.ts` and
 * `.d.cts` are not counted at any point, by any check — and so is
 * `dist/styles.css`, which the CSS build owns. That exclusion is load-bearing
 * twice over: it is why 345 JSDoc descriptions written across `utils/types.ts`
 * files moved the total by 0.00 KB, and why a comment ABOVE an exported
 * declaration is free while the same prose INSIDE a value ships (the 150.61
 * and 150.79 rows below measure both). A consumer downloads the `.js`; their
 * editor reads the `.d.ts` and their bundler never sees it.
 *
 * The population is therefore: every directory under `dist/components` that
 * has an `index.js`, plus the shared chunks those entries reach. A component
 * whose build emitted no `index.js` is not "0 KB", it is ABSENT — and the
 * ledger's history would show the total dropping with no attribution, which is
 * the one thing the ledger refuses. It has not happened; this note exists so
 * that if it ever does, the reading is written down in advance.
 */
const components = () => {
  const dir = join(DIST, "components");
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((e) => statSync(join(dir, e)).isDirectory())
    .filter((e) => existsSync(join(dir, e, "index.js")))
    .sort();
};

const SRC_COMPONENTS = resolve(root, "src/components");

/** Every source file of one component, tests excluded. */
const sourceFilesOf = (name) => {
  const base = join(SRC_COMPONENTS, name);
  if (!existsSync(base)) return [];
  const walk = (dir) =>
    readdirSync(dir).flatMap((entry) => {
      const path = join(dir, entry);
      if (statSync(path).isDirectory()) return walk(path);
      return /\.tsx?$/.test(entry) && !path.includes("__tests__") ? [path] : [];
    });
  return walk(base);
};

/** The component directory a resolved path belongs to, or null if outside. */
const componentOwning = (absolute) => {
  const rel = absolute.slice(SRC_COMPONENTS.length + 1);
  if (absolute.slice(0, SRC_COMPONENTS.length) !== SRC_COMPONENTS) return null;
  const first = rel.split("/")[0];
  return first || null;
};

/**
 * The four tests, first match wins, over a component's own source.
 *
 * Separated from the file walk so the self-check can put synthetic sources
 * through the same function the gate uses.
 */
const shapeOf = (text, deps, ships = []) =>
  /role=["']grid["']|role:\s*["']grid["']/.test(text)
    ? "surface"
    : /\bcreatePortal\b|\bMenuSurface\b/.test(text)
      ? "overlay"
      : deps.size || ships.length
        ? "composed"
        : "control";

/**
 * Sub-components a component ships: a value export the package root re-exports
 * from this component's directory, which also declares a `<Tag>Props` type.
 *
 * Both halves matter. The root export is what makes it shipped rather than an
 * internal file — `TabButton` is exported from TabPanel's own index and not
 * from the package, so a consumer cannot compose with it. The props type is
 * what makes it a component rather than an icon: every component's index
 * exports `ChevronDownIcon` and friends, and none of them is composition.
 * This is the derivation `build-subcomponent-schemas.mjs` already uses to
 * decide what to write a schema for.
 */
const shipsSubComponents = (name, ownSource) => {
  const rootExports = readFileSync(join(SRC_COMPONENTS, "..", "index.ts"), "utf8");
  const tags = new Set();
  for (const m of rootExports.matchAll(
    /export\s*(type\s*)?\{([^}]*)\}\s*from\s*["']\.\/components\/([^/"']+)/g,
  )) {
    if (m[1] || m[3] !== name) continue;
    for (const part of m[2].split(",")) {
      const tag = part.trim().replace(/^type\s+/, "").split(/\s+as\s+/).pop()?.trim();
      if (!tag || tag === name) continue;
      if (!/^[A-Z][A-Za-z0-9]*$/.test(tag) || /^[A-Z0-9_]+$/.test(tag)) continue;
      if (new RegExp(`(interface|type)\\s+${tag}Props\\b`).test(ownSource)) tags.add(tag);
    }
  }
  return [...tags];
};

/** A component's shape, read from `src/components/<name>`. */
const shapeFromSource = (name) => {
  const files = sourceFilesOf(name);
  if (files.length === 0) return { shape: "control", deps: [], ships: [] };
  let text = "";
  const deps = new Set();
  for (const file of files) {
    const body = readFileSync(file, "utf8");
    text += body + "\n";
    for (const m of body.matchAll(/from\s*["']([^"']+)["']/g)) {
      if (!m[1].startsWith(".")) continue;
      const owner = componentOwning(resolve(dirname(file), m[1]));
      if (owner && owner !== name) deps.add(owner);
    }
  }
  const ships = shipsSubComponents(name, text);
  return { shape: shapeOf(text, deps, ships), deps: [...deps], ships };
};

const measureAll = () => {
  const names = components();
  const sets = new Map(
    names.map((n) => [n, closure(join(DIST, "components", n, "index.js"))]),
  );
  const reach = new Map();
  for (const files of sets.values())
    for (const f of files) reach.set(f, (reach.get(f) ?? 0) + 1);


  const rows = names.map((name) => {
    const files = sets.get(name);
    const entry = join(DIST, "components", name, "index.js");
    const ownPattern = new RegExp(`(^|/)${name}-[A-Za-z0-9_-]+\\.js$`);
    const ownFile = files.find((f) => ownPattern.test(f.replace(`${DIST}/`, "")));

    const ownSrc = [ownFile, entry]
      .filter(Boolean)
      .map((f) => readFileSync(f, "utf8"))
      .join("");
    const deps = [
      ...new Set(
        files
          .map((f) =>
            /(^|\/)([A-Z][A-Za-z]*)-[A-Za-z0-9_-]+\.js$/.exec(
              f.replace(`${DIST}/shared/`, ""),
            ),
          )
          .filter(Boolean)
          .map((m) => m[2])
          .filter((d) => d !== name),
      ),
    ];
    // Read from source, not from `ownSrc`: which chunk a call lands in is
    // Rollup's decision, and it moved eight ceilings when the surfaces were
    // shared. `deps` above stays for the report; the shape uses the resolved
    // source imports instead.
    const { shape } = shapeFromSource(name);

    const exclusiveFiles = files.filter((f) => reach.get(f) === 1);
    return {
      name,
      shape,
      deps,
      own: gz([ownFile ?? entry]),
      closure: gz(files),
      exclusive: exclusiveFiles.length ? gz(exclusiveFiles) : 0,
      ceiling: CEILINGS[shape],
    };
  });

  const everything = [...new Set([...sets.values()].flat())];
  return { rows, libraryTotal: everything.length ? gz(everything) : 0, files: everything.length };
};

const run = () => {
  const { rows, libraryTotal, files } = measureAll();
  rows.sort((a, b) => b.exclusive - b.ceiling - (a.exclusive - a.ceiling));

  console.log(
    `  ${"component".padEnd(30)} ${"shape".padEnd(9)} ${"own".padStart(6)} ${"closure".padStart(8)} ${"excl".padStart(7)} ceiling`,
  );
  for (const r of rows) {
    const breach = r.exclusive > r.ceiling;
    console.log(
      `  ${r.name.padEnd(30)} ${r.shape.padEnd(9)} ${r.own.toFixed(2).padStart(6)} ${r.closure
        .toFixed(2)
        .padStart(8)} ${r.exclusive.toFixed(2).padStart(7)} ${String(r.ceiling).padStart(4)}` +
        (breach ? `  BREACH +${(r.exclusive - r.ceiling).toFixed(2)}` : ""),
    );
  }

  const breaches = rows.filter((r) => r.exclusive > r.ceiling);
  console.log(
    `\n  ${rows.length} entries, ${breaches.length} over their class ceiling (gated on exclusive)`,
  );
  console.log(
    `  library total ${libraryTotal.toFixed(2)} KB across ${files} files, recorded ${LIBRARY_TOTAL_KB} KB`,
  );

  let failed = 0;

  const undeclared = breaches.filter((r) => !DECLARED_BREACHES.has(r.name));
  const grew = breaches.filter(
    (r) => DECLARED_BREACHES.has(r.name) && r.exclusive > DECLARED_BREACHES.get(r.name).kb + 0.01,
  );
  const shrank = breaches.filter(
    (r) =>
      DECLARED_BREACHES.has(r.name) &&
      r.exclusive < DECLARED_BREACHES.get(r.name).kb - DECLARED_SLACK_KB,
  );
  const cleared = [...DECLARED_BREACHES.keys()].filter((name) => {
    const row = rows.find((r) => r.name === name);
    return row && row.exclusive <= row.ceiling;
  });
  const missing = [...DECLARED_BREACHES.keys()].filter(
    (name) => !rows.some((r) => r.name === name),
  );

  if (breaches.length) {
    console.log(
      `\n  ${breaches.length - undeclared.length} declared breach(es):\n` +
        breaches
          .filter((r) => DECLARED_BREACHES.has(r.name))
          .map(
            (r) =>
              `    ${r.name}: ${r.exclusive.toFixed(2)} KB > ${r.ceiling} KB (${r.shape}), recorded ${DECLARED_BREACHES.get(r.name).kb}`,
          )
          .join("\n"),
    );
  }

  if (undeclared.length) {
    console.error(
      `\n✗ ${undeclared.length} bundle(s) over the class ceiling and not declared:\n` +
        undeclared
          .map(
            (r) =>
              `    ${r.name}: ${r.exclusive.toFixed(2)} KB > ${r.ceiling} KB (${r.shape})`,
          )
          .join("\n"),
    );
    failed = 1;
  }

  if (grew.length) {
    console.error(
      `\n✗ ${grew.length} declared breach(es) grew past their record:\n` +
        grew
          .map(
            (r) =>
              `    ${r.name}: ${r.exclusive.toFixed(2)} KB > recorded ${DECLARED_BREACHES.get(r.name).kb} KB`,
          )
          .join("\n") +
        `\n  A declared breach is a number held still, not a licence to grow.`,
    );
    failed = 1;
  }

  if (shrank.length) {
    console.error(
      `\n✗ ${shrank.length} declared breach(es) are now smaller than recorded:\n` +
        shrank
          .map(
            (r) =>
              `    ${r.name}: ${r.exclusive.toFixed(2)} KB, recorded ${DECLARED_BREACHES.get(r.name).kb} KB — lower it`,
          )
          .join("\n") +
        `\n  A record left above reality buys back headroom nobody agreed to.`,
    );
    failed = 1;
  }

  if (cleared.length) {
    console.error(
      `\n✗ ${cleared.length} declared breach(es) are now under their ceiling: ${cleared.join(", ")}.` +
        ` Remove them from DECLARED_BREACHES — an entry nobody needs is a licence left lying about.`,
    );
    failed = 1;
  }

  if (missing.length) {
    console.error(
      `\n✗ DECLARED_BREACHES names entries that were not measured: ${missing.join(", ")}`,
    );
    failed = 1;
  }
  const historyProblems = auditHistory();
  if (historyProblems.length) {
    console.error(`\n✗ LIBRARY_TOTAL_HISTORY does not hold:`);
    for (const p of historyProblems) console.error(`    ${p}`);
    failed = 1;
  }
  if (libraryTotal > LIBRARY_TOTAL_KB + 0.01) {
    console.error(
      `\n✗ the library grew: ${libraryTotal.toFixed(2)} KB > recorded ${LIBRARY_TOTAL_KB} KB.` +
        ` Every entry can stay under its ceiling while the whole gets heavier; this is that check.` +
        ` Raising the record is allowed, but it is a move like any other: append it to` +
        ` LIBRARY_TOTAL_HISTORY with the reason it grew.`,
    );
    failed = 1;
  } else if (libraryTotal < LIBRARY_TOTAL_KB - RATCHET_SLACK_KB) {
    console.error(
      `\n✗ the library shrank to ${libraryTotal.toFixed(2)} KB, under the recorded ${LIBRARY_TOTAL_KB} KB.` +
        ` Append a move to LIBRARY_TOTAL_HISTORY — a record left above reality buys back headroom nobody agreed to.` +
        ` Say what got smaller. If nothing in the window explains it, mark it "unattributed" and answer the` +
        ` \`question\` field: a drop no one can account for is the library losing something, until shown otherwise.`,
    );
    failed = 1;
  }
  if (!failed)
    console.log(
      "\n✓ no undeclared breach, every declared breach held at its record, library total within record",
    );
  return failed;
};

/**
 * Proof both gates can fail: plant an entry that busts the smallest ceiling and
 * require it to be caught, and require it to move the library total too.
 * Without this, "0 breaches" and "the walk found nothing" are the same output —
 * which is how the record this replaces passed for four months.
 */
/**
 * The shape must be a fact about source, not about bundling.
 *
 * Two directions, because the bug had two halves: a portal call that moves
 * between chunks must not change a component's shape, and a component that
 * stops portalling must actually lose it. The first is what cost eight
 * components 2-4 KB of ceiling for getting smaller.
 */
/**
 * The ledger's rules, shown failing.
 *
 * `auditHistory` reads a module-level array, so the check runs against copies
 * with one field removed rather than against the real rows. A rule that stops
 * matching reports nothing, which is indistinguishable from a ledger that is
 * in order.
 */
const historySelfCheck = () => {
  const fail = (message) => {
    console.error(`✗ self-check: ${message}`);
    process.exit(1);
  };

  const audit = (rows) => {
    const real = LIBRARY_TOTAL_HISTORY.splice(0, LIBRARY_TOTAL_HISTORY.length, ...rows);
    try {
      return auditHistory();
    } finally {
      LIBRARY_TOTAL_HISTORY.splice(0, LIBRARY_TOTAL_HISTORY.length, ...real);
    }
  };

  const base = {
    kb: 100,
    commit: "0000000",
    date: "2026-01-01",
    attribution: "measured",
    reason: "A first record long enough to clear the length floor this gate applies.",
  };
  const drop = {
    ...base,
    kb: 90,
    commit: "1111111",
    attribution: "unattributed",
    reason: "A drop nobody has accounted for, stated at length but never actually explained.",
  };

  if (audit([base, { ...drop, question: "checked, and here is what was found" }]).length)
    fail("a well-formed ledger was reported as broken");

  if (!audit([base, drop]).some((p) => p.includes("question")))
    fail("an unattributed drop with no question passed — the clause this ledger exists for");

  if (!audit([base, { ...drop, attribution: "attributed", reason: "too short" }]).some((p) => p.includes("no usable reason")))
    fail("a move with no usable reason passed");

  if (!audit([base, { ...base, commit: "2222222", attribution: "attributed" }]).some((p) => p.includes("did not change")))
    fail("a move that moves nothing passed");

  if (!audit([base, { ...base, kb: 90, commit: "3333333" }]).some((p) => p.includes('"measured"')))
    fail("a second row claiming to be the first measurement passed");

  // An unattributed RISE is fine: the grow check already refuses unexplained
  // growth, and asking for a `question` there would be asking twice.
  if (audit([base, { ...drop, kb: 110 }]).length)
    fail("an unattributed rise was refused, which is the grow check's job, not this one");

  console.log(
    "✓ self-check: the ledger refuses a reasonless move, a still move, a duplicate first " +
      "record, and an unattributed drop that answers no question",
  );
};

const shapeSelfCheck = () => {
  const fail = (message) => {
    console.error(`✗ self-check: ${message}`);
    process.exit(1);
  };

  const none = new Set();
  if (shapeOf('createPortal(<div />, document.body)', none) !== "overlay")
    fail("a direct createPortal is not read as an overlay");
  if (shapeOf('<MenuSurface trigger={ref} isOpen>x</MenuSurface>', none) !== "overlay")
    fail("portalling through MenuSurface is not read as an overlay");
  if (shapeOf('<div>plain</div>', none) !== "control")
    fail("a component that portals nothing is still read as an overlay");
  if (shapeOf('<div role="grid" />', none) !== "surface")
    fail("a grid is not read as a surface");
  if (shapeOf('<div />', new Set(["Tooltip"])) !== "composed")
    fail("a component importing another is not read as composed");
  if (shapeOf('<div />', none, ["AccordionItem"]) !== "composed")
    fail("a component shipping a sub-component is not read as composed");
  if (shapeOf('<div />', none, []) !== "control")
    fail("a component shipping nothing and importing nothing is not read as control");
  // Against the real tree, both directions: Accordion ships four sub-components
  // and imports no sibling — it is the component the positive test was added
  // for — and Checkbox ships none and must stay a control.
  const accordion = shapeFromSource("Accordion");
  if (accordion.shape !== "composed" || accordion.ships.length === 0)
    fail(`Accordion reads as ${accordion.shape}; it ships ${accordion.ships.length} sub-component(s)`);
  if (shapeFromSource("Checkbox").shape !== "control")
    fail("Checkbox ships no sub-component and must still read as a control");

  // The regression itself, against the real tree: Dropdown portals through
  // MenuSurface, so its own built chunk contains no `createPortal` at all. If
  // the shape ever goes back to reading the artifact, this is what fails.
  const dropdown = shapeFromSource("Dropdown");
  if (dropdown.shape !== "overlay")
    fail(`Dropdown reads as ${dropdown.shape}; it portals through MenuSurface and is an overlay`);
  const ownChunk = join(DIST, "components", "Dropdown", "index.js");
  if (existsSync(ownChunk) && /createPortal/.test(readFileSync(ownChunk, "utf8")))
    console.warn("  note: Dropdown's entry now contains createPortal directly — the check above is weaker than it was");

  console.log(
    "✓ self-check: shape survives the call moving chunks, is lost when the call goes, " +
      "and composed has a positive test",
  );
};

const selfCheck = () => {
  const probeDir = join(DIST, "components", "__CeilingProbe");
  const probeChunk = join(DIST, "shared", "__CeilingProbe-probe01.js");
  if (existsSync(probeDir) || existsSync(probeChunk)) {
    console.error(`✗ a previous probe was left behind — remove ${probeDir}`);
    process.exit(1);
  }
  historySelfCheck();
  shapeSelfCheck();
  const before = measureAll();
  try {
    // Random, not repeated: 400k identical characters gzip to under half a KB,
    // and the first draft of this self-check said so.
    writeFileSync(
      probeChunk,
      `export const probe = "${randomBytes(24_000).toString("hex")}";\n`,
      "utf8",
    );
    mkdirSync(probeDir, { recursive: true });
    writeFileSync(
      join(probeDir, "index.js"),
      'export { probe } from "../../shared/__CeilingProbe-probe01.js";\n',
      "utf8",
    );

    const after = measureAll();
    const probe = after.rows.find((r) => r.name === "__CeilingProbe");
    if (!probe) {
      console.error("✗ self-check: the probe entry was not measured at all");
      process.exit(1);
    }
    if (probe.exclusive <= probe.ceiling) {
      console.error(
        `✗ self-check: the probe measured ${probe.exclusive.toFixed(2)} KB exclusive, under its ${probe.ceiling} KB ceiling — not a ceiling-buster`,
      );
      process.exit(1);
    }
    const growth = after.libraryTotal - before.libraryTotal;
    if (growth <= 0.5) {
      console.error(
        `✗ self-check: the library total moved only ${growth.toFixed(2)} KB — the aggregate gate would not see a regression`,
      );
      process.exit(1);
    }
    console.log(
      `✓ self-check: a ${probe.exclusive.toFixed(2)} KB entry breaches its ${probe.ceiling} KB ceiling, and moves the library total by ${growth.toFixed(2)} KB`,
    );
  } finally {
    rmSync(probeDir, { recursive: true, force: true });
    rmSync(probeChunk, { force: true });
  }
};

if (process.argv[2] === "--explain") {
  const name = process.argv[3];
  const entry = join(DIST, "components", name, "index.js");
  if (!existsSync(entry)) {
    console.error(`✗ no entry for ${name}`);
    process.exit(1);
  }
  const files = closure(entry);
  const { rows } = measureAll();
  const row = rows.find((r) => r.name === name);
  console.log(
    `${name}: shape=${row.shape} own=${row.own.toFixed(2)} closure=${row.closure.toFixed(2)} exclusive=${row.exclusive.toFixed(2)} ceiling=${row.ceiling}`,
  );
  console.log(`composes: ${row.deps.join(", ") || "-"}\n`);
  console.log(`  ${"file".padEnd(52)} ${"raw KB".padStart(8)} ${"gz KB".padStart(7)}`);
  for (const f of files
    .map((f) => ({ f, raw: statSync(f).size / 1024, g: gz([f]) }))
    .sort((a, b) => b.g - a.g)) {
    console.log(
      `  ${f.f.replace(`${DIST}/`, "").padEnd(52)} ${f.raw.toFixed(1).padStart(8)} ${f.g.toFixed(2).padStart(7)}`,
    );
  }
  process.exit(0);
}

if (components().length === 0) {
  console.error(
    "✗ no library build in dist/. This gate measures the packaged entries — run `npm run build:lib` first.",
  );
  process.exit(1);
}
console.log(`  floor ${FLOOR} KB (Loader) → control 6, composed 8, overlay 10, surface 12\n`);
selfCheck();
process.exit(run());
