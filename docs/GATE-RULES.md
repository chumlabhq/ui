# Gate rules

How the gates in this repository are shaped, and why. Every rule below is
followed by the incident that produced it — the bundle ratchet that walked while
its ledger stayed still, the contrast failure that shipped through two slices,
the pixel tolerance wide enough to delete a component's paint without counting a
pixel. **The numbers are what make these arguments rather than preferences.** A
rule stripped of its incident is a rule the next person deletes when it is
inconvenient, so keep the evidence attached when you edit one.

> **This file was untracked until 2026-09-13.**
>
> The rules themselves are older. They accumulated in a `CLAUDE.md` at
> `~/Developer/chumlab/`, a directory that is not a git repository — so from
> `511a74a` (2026-08-04), which removed this repo's own `CLAUDE.md` and
> gitignored the name as "local agent-workflow instructions, not part of the
> published library", until today, **none of them was version-controlled, in a
> commit, or shipped.** They existed on one machine.
>
> That reasoning was right for what the file held in August: wiki-query
> workflow and agent housekeeping. It stopped being right once the file started
> carrying findings about this library's own gates. The split now is: rules
> about the code live here and travel with it; rules about how an agent works
> stay local and stay ignored.
>
> So a rule here may cite an incident that predates the file it is written in.
> That is expected. The same reason `docs/adr/002-gate-populations.json` records
> what measured it: a record that does not say where it came from invites the
> next reader to assume it was always there.

---

## Code style — clean, idiomatic, not "AI-authored"

- Match the existing codebase exactly. It has a strong, consistent style. Follow
  it; do not impose your own.
- Comments: match the existing convention — explain non-obvious *why* (a subtle
  decision, a workaround, a browser quirk, a gotcha). NEVER narrate the *what*. No
  `// loop over users`, no `// import React`, no `// Step 1:` scaffolding, no
  comment that restates the line below it. Bar: would a senior dev on this team
  write this comment? If the line is self-evident, no comment.
- No emojis anywhere in code or generated files. No filler. No "here's the…"
  preambles inside files.
- Typed end to end (TS strict on the frontend). No `any` unless unavoidable and
  justified in a comment.
- No stray `console.log`. Use the existing error channels.
- Small, focused functions. No premature abstraction, no dead code, no
  speculative config.


---

## Stack & conventions (do not deviate)

**Backend (`chumlab-be`)** — CommonJS, Express, Mongoose. Controllers are thin
functions wrapped in `asyncHandler`; raise errors with
`throw new ApiError(status, message, details)`; routes wire middleware + the
controller; config via `process.env`. Auth is an HTTP-only cookie `chumlab_token`
verified by `requireAuth` (`middleware/auth.js`). New controllers/routes/models
must mirror the existing shapes in those folders.

**Frontend (`chumlab-fe`)** — React 19 + TypeScript, Vite, Tailwind v4 with design
tokens in `src/index.css`. Use token utility classes (`bg-bg-base`, `text-fg`,
`border-border-faint`, …) and `var(--accent)` — NEVER raw hex. Data via RTK Query
`baseApi.injectEndpoints` with `credentials: 'include'`; the generation STREAM is
the one exception (raw `fetch` + `getReader()`, not RTK Query). Use the `cn()`
util. Controlled/uncontrolled via `onValueChange`. Mirror existing component/hook
patterns.

**AI (`chumlab-be/src/ai`)** — the staged pipeline: router → clarify → plan →
develop → verify → qa → deliver. Prompts in `ai/prompts/*.txt`, Anthropic client
in `ai/anthropic.js`. Stages are functions the orchestrator drives; they emit SSE
events per the frozen schema in `ai/sse.js`. Never hardcode a prompt inline in a
controller — it lives in `ai/prompts/`.


---

## Testing

- Backend: exercise each endpoint against its documented request/response shape;
  respect the existing validation style. Do not add a test framework the repo
  doesn't already use without asking.
- Frontend: the component must render and the flow must work in the browser. The
  library already uses vitest + playwright — follow those patterns if adding tests.
- AI: prompt/stage changes are validated against the `eval/` set.
- The verify gates are the product's own test suite — a generation is only "done"
  when lint + typecheck + render pass.
- **Scoping may skip a browser engine, or a suite the change cannot affect. It
  may never skip a ratchet or a conformance gate.** A ratchet nobody pulls is a
  number, not a gate; a conformance gate nobody runs is an assertion nobody is
  making. Concretely, a slice touching `src/components` runs at least:
  - `node scripts/assert-bundle-size.mjs` — the bundle ratchet. It stood at a
    recorded 148.70 while the real figure walked to 149.92 across five slices,
    and the ledger that requires a reason for every move never saw one of them.
  - `npx playwright test e2e/contrast-painted.spec.ts --project=a11y-full` — the
    WCAG gate. An AA failure of 4.31:1 shipped through two slices scoped to
    typecheck and a site build.

  Both holes were the same hole, found a week apart. If a ratchet goes red,
  attribute the move and append it — do not raise the record to match. If a
  conformance gate goes red, fix it; do not waive it.

- **A gate states every tolerance, threshold and comparison basis explicitly,
  with a reason. It never inherits one from the tool.** An unconfigured default
  passes as an authored decision and is invisible while green — this branch hit
  it three times:
  - the fixture registry's default wrapper standing in for the fixture's own, so
    `RadioButton/checked` rendered unchecked in every gate that used the route;
  - a disabled/enabled comparison silently reading a *different* fixture, which
    reported Dropdown as 0 differing properties against one base and 6 against
    another;
  - Playwright's default 0.2 per-pixel tolerance standing in for a threshold
    nobody set, which was wide enough for `bg-cl-bg-skeleton` to be deleted
    outright — every bar in `Table/loading` losing its paint — without one
    pixel counting as different.

  The same shape appears when a check reads one place while what it judges lives
  in another: a colour plant against `Avatar/in-group`, `Drawer/open` and
  `CountryFlag/resolved` proved nothing, because their paint is a stack margin,
  an overlay scrim and an `<img src>` — none of them in the component's
  constants, which is the only place the plant looked.

  If a number decides whether a gate passes, it is written down where the gate
  is, with why that number. "The default was fine" is not a reason; nobody chose
  it — and neither is "the check was green" when the check was pointed elsewhere.

  **The denominator is a number like any other.** A tolerance nobody authored
  and a population nobody authored fail the same way: the gate is green, the
  figure is printed, and the part that was never counted is invisible precisely
  because it was never counted. The snippet extractor reported "82 sections
  carry no copy button" over the sections it could SEE — it found a demo
  wrapper only as a direct child of `<Section>`, so 131 sections that group
  their examples in a `<div>` were in no count at all: not emitted, not skipped,
  not reported. Every page with grouped examples looked partly covered for
  months, and the number that would have said otherwise was computed over a
  population that excluded them. State what a gate counts AND what it leaves
  out, in the gate; an exclusion that is real is worth a line, and one that
  cannot be justified in a line is not an exclusion, it is a hole.

  **A scan that reads source strips comments first.** Three times now a check
  has counted prose as code: the raw-palette sweep reported 18 sites against a
  real 13, the raw-unstyled-element count 20 against 19 by matching a `<button>`
  inside its own explanatory comment, and the defeated-override sweep opened at
  691 variant defaults against a real 450 because it read class names quoted in
  backticks inside comments. The fix is one line at the top of the scanner and
  the failure mode is always the same shape — a number that is too big, argued
  over, and wrong.

  **A number is reported as measured only if it was read off the rendered
  result, on the surface it ships on; a computed one is labelled computed and
  is never rounded across the threshold it is compared with.** Pagination's
  selected page went in as "measured 4.50:1": a script had composited the 10%
  accent tint over `#ffffff` and printed 4.49, and the button's tint actually
  sits on `--cl-bg-elevated` and the fixture's off-white, where
  `contrast-painted` read 4.31:1 across nine fixtures. It is the target-size
  table again, where rect arithmetic was reported as measured hit areas.

- **A new visual subject lands with its plant margin recorded.** Remove the
  painting the subject exists to capture, run that baseline alone, and record
  the pixel margin against the threshold. `Input/disabled` shipped as one of
  five approved representatives and could not fail for the state it was chosen
  for; three skeleton subjects could not either. A subject that cannot fail
  reads as coverage, which is worse than no subject. If it cannot be made to
  fail, do not ship it — say so and say why.


---

## A gate that runs a spec twice can report it green and red in the same run

`run-all-gates` ran `e2e:rest` as `--project=chromium`, which is every
chromium-routed spec — including `icon-bounds` and `demo-contrast`, both of
which already had a dedicated gate. So each ran twice: once alone, once under
the load of 31 other specs. In one run `demo-contrast` **passed as its own gate
and failed inside `e2e:rest`**, and both specs passed when re-run together in
isolation, 4 of 4.

It went unnoticed because a duplicate under load is indistinguishable from a
flake, and this repository has real flakes to compare it against. The tell is
not the failure; it is the same spec appearing in two gates' populations.

`e2e:rest` now runs only the specs no other gate claims — 457 cases against 461
— and the discovery check still fails when the repo has a spec nothing runs. A
runner change that widens a project back to "everything" reintroduces this, so:
**every spec belongs to exactly one gate, and the population is how you check.**

---

## A discriminator that makes a gate tractable can be the thing that blinds it

Written after trying and deleting `an enabled control affords a pointer`, and
kept because the shape will recur.

`DrawerCloseButton` shipped with **no default classes at all** — `cn(className)`
— so an unstyled drawer's close button was the one close button in the library
a pointer user could not tell was a button. Modal's has carried `cursor-pointer`
since it was written. The fix is one line; the gate was the hard part.

A sweep of all 444 fixtures found 22 enabled controls with no pointer cursor.
Twenty-one were fixture-authored raw triggers — `<button>Trigger</button>` in a
Tooltip fixture, five `custom-trigger` fixtures — which say nothing about the
library. Measuring them would have made the assertion a list of exemptions, so
it was scoped to elements carrying `cl-s`, the marker every library utility is
scoped to. That worked: population 401, then 1954 once `markPortalRoots` reached
the portalled surfaces, and `missing=0`.

**And it could not fail.** Reverting the fix left the button with `class=""` and
`cursor: default` — the defect, reproduced exactly — and the assertion still
reported zero, because an element with no classes has no `cl-s` either and was
filtered out before it was measured. The discriminator that made the gate
tractable is the same one that blinds it to a component that emits nothing,
which is the defect class it was written for.

There is no repointing that fixes this: without `cl-s` the 21 fixture triggers
flood it, and the DOM does not otherwise record which element a library
component rendered. So the assertion was deleted rather than left green.

The rule this leaves: **when a gate is scoped by a property of the thing it
measures, check that the absence of that property is not the failure.** A filter
on "has the library's marker" cannot see "the library emitted nothing", a filter
on "has a `classes` key" cannot see a missing slot, and a filter on "declares a
default" cannot see a default that was never declared.

---

## A selector list behind one prefix is scoped only in its first clause

`focus-not-obscured` selected its targets with `` `[data-fixture] ${SEL}` ``,
where `SEL` was the usual comma-separated focusable list. CSS splits a selector
list on its top-level commas before anything else, so that string means
`[data-fixture] a[href]`, then `button:not([disabled])`, then
`input:not([disabled])`, and so on — one scoped clause and five that match the
whole document. The gate had been walking the index nav, the page chrome and
every portal on the page for the life of the branch, and its published
population of 104 fixtures was a number over a set nobody had chosen.

It surfaced as an intermittent failure, which is the part worth keeping. The
out-of-scope element it found was a Drawer close button in a portal, and the
walk then climbed to `document.body` — which an open Drawer gives
`overflow: hidden` to lock scroll, and which is about 48px tall on a fixture
page — and called that the clipping ancestor of a `position: fixed` panel CSS
does not clip. Mid-transition the panel's rect is outside that box and the gate
reports; settled, it is inside and the gate passes. So the same defect looked
like load sensitivity, was filed as a flake twice, and was re-run rather than
read. **A gate that fails only under load is not thereby a timing problem — it
is a gate whose inputs move under load, and the first question is what it is
actually looking at.**

Both fixes were available all along and neither was: interpolate the scope into
every clause, and include portal roots through the `markPortalRoots` helper that
already exists for exactly this. The corrected population is 78 fixtures and 129
children — *lower* than the wrong one, because the harness left the count.

The reason it survived three failures is the general rule. The spec had a
self-check, and it was a real one: it built a `clip` strip and a `hidden` strip
and proved the `hidden`-scrolls-on-focus distinction the gate turns on. But it
built its own DOM and compared rects by hand, so it exercised the MEASUREMENT
and never the SELECTION or the ancestor walk — the two parts that were wrong.
**A plant that reimplements the thing it is planting on tests the reimplementation.**
The measurement now lives in `e2e/_clip.ts`, the walk and the plant both call
it, and each of the three fixes was reverted in turn to confirm the plant goes
red for it.

## A non-retrying query is a tolerance nobody chose

`getByRole` throws immediately; `findByRole` waits. Placing the first one after
a helper that advances a fixed number of frames asserts that the frame count is
always enough — which is the same shape as an unconfigured threshold, and just
as invisible while green. `DatePicker`'s preset case carried eight observations
across five slices on exactly that: `flushPositionFrames()` advances 32ms for
the calendar's position hook, the presets mount a frame later, and every
recorded failure is at the QUERY rather than at any assertion below it. Five
attempted fixes all worked on the click and the frames after the query and the
best of them only reduced the rate, because the thing that was wrong came first.

Two lessons, and the second is the one that generalises further:

- **Read where a failure actually landed before theorising about it.** "Fails
  under load, passes alone, therefore timing" is a conclusion, and it was wrong
  here and in `focus-not-obscured` — two cases, five wasted fixes between them.
  A query that throws and an assertion that fails are different events and the
  line number distinguishes them for free.
- **A test named for a value must read that value.** The same case asserted the
  current year appeared *anywhere on screen* while the calendar it had just
  opened painted that year in its own header. Planted with the preset returning
  the 1st of the month instead of today, the old assertions passed. It was named
  `applies a preset to its own selection` and never read the selection. When a
  check can be satisfied by scenery, the name is the only thing still claiming
  it works.

## Definition of done (every task)

Compiles and typechecks; matches existing conventions; no narration comments; no
console noise; the phase's exit criterion is demonstrably met; a per-file change
summary + a one-line commit message are provided; nothing is committed or pushed.
