# Known flakes

A test that has failed without a defect behind it, and has been re-run enough to
say so. One row per observation, with the evidence that made "flake" the reading
rather than the excuse.

The bar for an entry is deliberately high, because this file is the obvious
place to hide a real failure:

- **Reproduced green.** Passed in isolation AND on at least one subsequent full
  run. A single re-run that happens to pass is not evidence.
- **A mechanism, named.** Timing under parallel load, a wall-clock threshold, a
  real clock, an animation frame — something that explains why the outcome
  varies while the component does not. "Intermittent" is not a mechanism.
- **Dated, and attributed to a commit or a slice.** A flake that stops
  reproducing is deleted with a note, not left standing forever.

An entry here is a decision NOT to chase something, so it carries the cost of
being wrong. If the same row is observed three times, it stops being a flake and
becomes a defect in the test.

A row needs a NAME, and a summary line does not give you one. Run the suite as
`VITEST_RECONCILE_JSON=/tmp/vitest.json npx vitest run` when you are hunting
one: the reconcile reporter writes every non-pass to that file, and without it a
failure in run 5 of 10 is a number you cannot act on. That happened while this
file was being written — see the note under the table.

Related: `E2E-TRIAGE.md` Appendix A deleted 14 tests that were flaky *by
construction* — wall-clock thresholds measuring the host machine rather than the
library. A test that can only fail under load and says nothing about a component
when it does belongs there, deleted, not here.

| Date | Test | Observed | Reading |
|---|---|---|---|
| 2026-09-13 | `focus is never entirely obscured by a clipping ancestor` (`e2e/focus-not-obscured.spec.ts`) | Failed its FINDINGS assertion in three full `npm run gates` runs under parallel load; passed in isolation every time it was tried. | **RESOLVED, and it was never a timing failure — it was two defects in the gate, and the library was never wrong.** This is filed here because it was twice mistaken for a flake, and the mistake is the lesson. It failed the assertion that LISTS elements outside their clipping ancestor, not the population floor, so the gate was always reporting something real to itself; what nobody had was the finding, because playwright's `test-results/` artefacts were deleted by the next run and `run-all-gates` printed only a failing gate's last 25 lines and discarded the rest. The third occurrence was read instead of re-run: `FOCUS_OBSCURED_FINDING Drawer/open: <button> "Close"`, and the same for `Drawer/open-swipeable`. **Cause one, the scope:** targets were selected with `` `[data-fixture] ${SEL}` `` where `SEL` is a comma-separated focusable list. CSS splits a selector list on its top-level commas before anything else, so only `a[href]` was scoped to a fixture and `button`, `input`, `select`, `textarea` and `[tabindex]` matched the whole document — index nav, page chrome and every portal included. **Cause two, the walk:** from a portalled control it climbed to `document.body`, which an open Drawer gives `overflow: hidden` to lock scroll and which is ~48px tall on a fixture page, and called that the clipping ancestor of a `position: fixed` panel CSS does not clip. Those two together are the whole of the load sensitivity: mid-transition the panel's rect is outside that 48px box and the gate reports, settled it is inside and the gate passes. **A gate that fails only under load is not thereby a timing problem — it is a gate whose inputs move under load, and the first question is what it is looking at.** Fixed: every clause carries its own scope prefix, portal roots are in scope via the existing `markPortalRoots`, and the walk stops at a `fixed` ancestor. Population 104 → **77-78 fixtures and 128-129 focusable children over three runs, `obscured=0`**; the one-step variance is a fixture whose overlay is still opening contributing no focusable child yet, which is why the assertion is a floor of 50 and not an equality. It fell because the harness left the count, not because coverage did. Why it shipped, which is the part worth keeping: the spec HAD a self-check and it was a real one, but it built its own DOM and compared rects by hand, so it proved the measurement and never the selection or the walk — the two parts that were wrong. The measurement now lives in `e2e/_clip.ts`, the walk and a five-case plant both call it, and each of the three fixes was reverted in turn to confirm the plant goes red for it. |
| 2026-09-11 | `DatePicker > Uncontrolled Mode > applies a preset to its own selection when uncontrolled` (`src/components/DatePicker/__tests__/DatePicker.test.tsx`) | Failed once in a full parallel `vitest run` (95 files). Passed in isolation (`vitest run src/components/DatePicker`, 226/226) and on two subsequent full runs (4727 passed each). | `userEvent.setup({ advanceTimers: vi.advanceTimersByTime })` driving a click through fake timers: the click is resolved by advancing a clock the test owns, and under a loaded parallel run the interleaving of that advance with React's act queue is not deterministic. Nothing in the slice that surfaced it touches DatePicker beyond `border-none` → `border-0` in its constants, which is a class string. **REOPENED at a fourth observation — the fix did not hold.** Its file's slowest case measured 3.0s against a 30s limit, so a timeout is not the mechanism here; the fake-timer driving is. The per-file timeout does not cover it — this file's slowest case is 3.0s against a 30s limit, so the clock was never the mechanism. **Observed three times** (2026-09-11 twice, 2026-09-12 once), each time green in isolation and on the next full run. The third made it a defect in the test by the rule above, and it was fixed there rather than logged again: the assertion now settles the frames the selection queues, with the file's own `flushPositionFrames` helper, before reading the trigger. It was reading between the click and the re-render. Five consecutive runs of that test green; nothing about what it asserts changed. **2026-09-12, fourth observation:** it failed again in a full parallel run, and passed both in isolation (226/226) and on the next full run (4783). So settling the frames reduced the rate but did not remove the race — the remaining exposure is `userEvent`'s own timer advance, not the frames the selection queues. Not chased further in this slice; the next attempt should drop `advanceTimers` for this case entirely and drive it on real timers, which is the change I avoided last time as the larger one. **2026-09-12, fifth observation — and that prescribed next attempt was tried and DOES NOT WORK.** On real timers the calendar opens (`data-open="true"`) but its presets never mount: the position hook calls `requestAnimationFrame` inside `requestAnimationFrame`, and this file's own header records that jsdom does not fire those on their own, which is why `flushPositionFrames` exists. `findByRole("Today")` then fails on every run, not intermittently, and the real-timer leak took a full parallel run from 1 failure to 36. Reverted. Do not retry this route: the fake clock is not incidental here, the calendar is unqueryable without it. What is left to try is removing the rAF dependency from the test's path — a `waitFor` on the dialog with frames driven explicitly, or a component-level seam that lets the calendar position without two nested frames. **2026-09-12, sixth observation:** failed on two of four full runs in the Stepper/TabPanel/Switch slice and passed on the other two; green in isolation (153/153) as always. No change attempted — the route recorded above is still the one to try, and this slice touched nothing near DatePicker. **2026-09-12, seventh observation:** failed again in the first end-to-end `npm run gates` run, at `getByRole("button", { name: "Today" })` — the presets had not mounted when the assertion ran, which is the same fake-timer race from the other side. Still green in isolation. The count matters now: seven observations, two attempted fixes, one of them a dead end recorded above. **2026-09-13, eighth observation:** failed again at `DatePicker.test.tsx:256` in a full `npm run gates` run, having passed in the immediately preceding full unit run on the same tree. Eight observations now. It is the only case in the suite with this profile and it has cost more diagnosis time across slices than the fix would. **RESOLVED 2026-09-14, and the label was wrong from the first observation.** Read under the same lens that closed `focus-not-obscured`: not "is it flaky" but what moves when the machine is busy, and is the thing it measures the thing it names. **What was racing:** the last two recorded failures both name `getByRole("button", { name: "Today" })`, which is a QUERY and not an assertion. `getByRole` does not retry, so placing it after `flushPositionFrames()` asserted that the 32ms that helper advances is always enough for the presets to mount — a tolerance nobody chose, inherited from a helper written for the calendar's position hook. Under load it is not enough and the query throws. Every fix attempted before this one worked on the click and the frames AFTER the query, which is why five of them reduced the rate and none removed it. `findByRole` waits for the condition instead of asserting a frame count; the two sibling preset cases had the identical shape and got the same change. **And the second half, which nobody had asked:** the assertion below it read `getByText(String(new Date().getFullYear()), { exact: false })` — the current year anywhere on screen — while the calendar the test has just opened paints that year in its own header. Measured with no preset clicked: it already matches one `<span>`. Paired with the placeholder check it did catch a preset that applied nothing, and one that applied a different year, since selecting navigates the calendar. What it could not see is the wrong DAY: planted with "Today" returning the 1st, the old pair PASSED and the new assertion fails. A case named `applies a preset to its own selection` now reads the selection off the trigger. Both halves planted; 226/226 in isolation and 4855 green in a full parallel run. **2026-10-12, ninth observation (G2), and the 09-14 resolution was a clock too:** it failed in a full run at load 5.8 at `findByRole("button", { name: "Today" })`, which gave up at its default second (the case took 1573ms); 156/156 alone. The presets are a lazy half, and `findByRole` had only traded 32ms for 1000ms. Resolved in G3 by waiting on the load itself — see "The lazy halves" below. |
| 2026-09-11 | `portal semantics contract > Table announces every portalled surface a user can operate` (`src/__tests__/contracts/portal-semantics.contract.test.tsx`) | Failed once in a full parallel `vitest run`, immediately after a run in which it passed. Passed in isolation (42/42) and on the next full run (4732 passed). | Not asked for; recorded because it appeared in the same sitting and this file is the only place it would be visible. Table renders the largest tree in the suite and this case drives several portalled surfaces open in one test, so it is the most timing-exposed contract there is. **OPEN — not covered by the per-file timeout either, and for a measured reason**: this file's slowest case across three instrumented full runs was 3.4s against a 30s limit, a 9x margin, so whatever failed was not the clock. I do not know the mechanism; one observation and no captured assertion is not enough to name one. What would close it: catch the next occurrence with `VITEST_RECONCILE_JSON` set and read the actual failure instead of inferring one. **2026-09-14: one reproduction attempt, not reproduced — still open, and still unexplained.** A full parallel run (96 files, 4855 collected, 4787 passed) came back clean. One observation with no captured assertion remains too little to name a mechanism, so none is named here; that was the standard this row was opened under and inventing one now would be worse than the gap. One thing WAS found by reading, and is recorded as structure rather than as cause: `portalRoots` takes every child of `document.body` except the render container, while the loop attributes each orphan to the CURRENT `fixture.name` — so a portal outliving its `cleanup()` would be reported under whichever fixture rendered next. That would misattribute a finding, not manufacture one, and nothing observed says it happened. Left as the first place to look if it recurs. |
| 2026-09-11 | `classes override contract > 'DatePicker' > a slot keeps its default classes when a consumer overrides it` (`src/__tests__/contracts/overrides.contract.test.tsx`) | Failed on two of five full `vitest run` invocations the same day, always at a 30-second timeout and always on the heaviest trees (DatePicker, then Dropdown as a cascade). Green on the other three full runs and on two isolated runs of the file (81/81 each). | A fixed 30s test timeout against the largest render in the suite: this contract renders every fixture of every component and overrides every slot, and DatePicker's fixture tree is the biggest one. Under a loaded parallel run it crosses the timeout; nothing about the assertion or the component varies. **CLOSED** by `vi.setConfig({ testTimeout: 90_000 })` in the file itself, landing in `fix(ui): close six demo defects and give overrides.contract a derived timeout`. The number is derived rather than picked: with the limit lifted to 300s the tail was measured uncensored over three full runs at 13.3s, 16.3s and 32.8s for the same DatePicker case — a load factor of 2.5 on identical work — so 32.8 x 2.5 rounded up is 90. Per-file because the measurement says so: across all 96 files this is the only one with a case over 20s, the next heaviest peaks at 12.0s and everything else at 4.2s. Ten full runs after the change: nine clean at 4744 passed. |

## Found: a test that passed only in company (it did exist)

**2026-09-14** — the entry this replaces. A case was described as
`TimePicker clockHours`, failing 3 of 3 in isolation and passing in the full
suite. It was looked for and recorded as not existing: no test title contained
`clockHours`, and all 96 files were reported passing when run alone, one
`vitest run` each.

**2026-10-01 — corrected. It existed, in two contracts, from 2026-09-07.**

- **Why the search missed it.** The title is generated at runtime:
  `state-attributes.contract` builds `describe.each` rows from
  `docs/adr/002-state-attributes.json`, so `TimePicker clockHours data-state`
  is in no source file a grep for test names reads.
  `state-replacement.contract` has the same row, titled
  `TimePicker.clockDisplayActive -> clockHours`.
- **What it waited on.** Both fail at an assertion, not a query: no element
  carries `data-state` on clockHours (`state-attributes.contract.test.tsx:272`,
  `state-replacement.contract.test.tsx:305`).
  - ClockFace is a lazy half (`useClockFace` → `useLazyComponent`).
  - `applyAct` waited a single `setTimeout(0)`, measured at 1.2 ms.
  - A cold `import()` of ClockFace in a file run alone took 24.5–31.1 ms (three
    runs).
  - TimePicker's three clock fixtures render within 6 ms of each other
    (+50.1, +53.5, +55.8 ms into the row).
  - So every one was read before its face arrived, and no clock fixture comes
    later in the row.
- **Why the full run hid it.** Another file in the same run had already loaded
  the module. Paired with a file that only imports ClockFace, the contract
  passed 3 of 3; paired with an unrelated contract (`token-vocabulary`), it
  failed 3 of 3.
- **When it started.** `aa3a802` (2026-09-07), which put ClockFace behind a
  dynamic import. Run alone from `git archive` copies (with today's
  `node_modules`), 2 runs each:
  - `ba355fc`, the parent of `aa3a802`, passes;
  - `aa3a802` fails;
  - `afa8d4a`, where the 2026-09-14 entry was written, fails;
  - `14e0eb0` fails.

  So the 2026-09-14 sweep was wrong about this file. It also fails at
  `afa8d4a` when run without `--project`. How that sweep reported it green is
  not established: the entry did not record how each file was invoked.
- **Fixed in the test tier, not the component.** `applyAct`
  (`src/__tests__/fixtures/_act.contract.ts`) waits for the condition. The
  first version waited for the *modules* behind the lazy halves. A 200 ms
  delay injected in front of each load showed the gap: the module resolved
  first and the clock-face rows failed again. The wait now covers the
  component's own pending loads. A contracts-only `vi.mock` of
  `useLazyComponent` (`src/test/setup.contracts.ts`; since G3 in
  `src/test/setup.ts`, for every tier) hands each load through
  `src/test/lazyLoads.ts`, and `applyAct` returns once none is in flight. The
  evidence:
  - with the delay, `state-replacement`, `state-attributes` and `unstyled` pass
    alone;
  - with the delay and without the wait, the clockHours and clockNumber rows
    fail;
  - `fixture-session.contract` keeps that delay as a permanent self-check.

**The sweep, re-run 2026-10-01 on the fixed tree.** All 99 files were run
alone (41 contracts, 58 unit), one `vitest run` each, after the cascade fix
below: **99 of 99 pass**. That is 4820 passed, 68 skipped, 0 failed, 4888
collected, and no step crossed the slow-step threshold. The first pass of this
sweep, made while the wait still lived only in one contract's loop, is what
found the second file.

What generalises: **a lazy half makes "settled" a property of the module cache,
not of the clock.** A check that waits a fixed number of ticks after rendering
one is asserting that the cache is warm, and whether it is depends on which
files ran first. Wait for the import itself.

## The lazy halves, waited on by their load (2026-10-12, G3)

The contracts learned on 2026-10-01 to wait for a lazy half's load. The unit
tier never did, and G2's two full runs each failed one of its waits:
`DatePicker.test.tsx:253` (above) and `TimePicker/clock-state.test.tsx:46`,
whose `findByRole("slider")` gave up at its default second with load at 11.
Both passed alone.

- **Which tests.** An AST pass listed every `findBy*`/`waitFor` in a file that
  reaches a lazy half: 23 waits. It cannot tell which wait's target is lazy, and
  it misses a test that queries lazy content with `getBy` and passes only
  because an earlier test in the file warmed the cache. So the deciding run was
  dynamic: a fresh lazy cache per test and a 3s real-time delay on every load.
  30 unit tests failed: 9 DatePicker presets, 5 Table filter panel, 6
  TimePicker clock and 10 clock-state. Two of the Table ones passed silently
  behind `if (option)` guards; they assert the option now.
- **The fix.** The tracked `useLazyComponent` mock moved from the contracts'
  setup to `src/test/setup.ts`, and `lazyLoaded()` (`src/test/lazyLoads.ts`)
  awaits the component's own pending loads, then lets React render. Each of
  the 30 awaits it before its query, which is a plain `getBy*`. The injected
  delay uses a real `setTimeout` taken before any test fakes the clock.
- **The proof.** With `PresetsPanel`'s import delayed 3s in a scratch edit,
  the old `:253` failed at 1148ms ("Unable to find role=button and name
  Today") and the new one passed at 3248ms. Under the same delay with a fresh
  cache per test, all 30 pass.

## A timed-out test failed 90 tests after it (2026-10-01, full run)

`unit+contracts` failed 92 of 4884 in a run 3.5x slower than recorded (284 s
against 80 s). It looked like 92 problems. It was two.

- **Two tests hung.**
  - `state-replacement` DatePicker `dropdownItemSelected`: 30,271 ms.
  - `unstyled` InternationalPhoneInput "drops decorative utilities": 35,106 ms.
  - Both normally take about 0.3 s.
- **The other 90 were collateral.**
  - In `state-replacement`, 27 tests passed, then the timeout, then 75 of the
    next 76 failed. In `unstyled`, 17 of the 47 after its timeout failed.
  - Every one of the 46 "fixture act: target element not found" failures was
    the act's FIRST step, aimed at eagerly rendered content.
  - Every one of the 44 assertions found an empty DOM.
  - The mechanism: vitest stops waiting for a timed-out test, but its body keeps
    running. That loop's global `cleanup()` unmounted the next test's fixture
    mid-act, and its own renders landed in the next test's sweep.
  - Reproduced without load: a 2 s timeout and one DatePicker probe sleeping
    2.5 s failed 70 of 103, with the same fixture lines and messages.
- **Fixed by `fixtureSession()`** in `_act.contract.ts`, which every contract
  loop now goes through.
  - It unmounts only what it rendered.
  - It stops at its next render or act once `onTestFinished` has closed its
    test.
  - The same plant now fails exactly 1 of 103: the test that slept.
- **What is still open: the hang itself.** A timeout records no stack, and the
  test straight after DatePicker ran in 78 ms, so the process was not uniformly
  slow. Ruled out: the 2h change (both files time the same before and after it)
  and lazy act steps (none of the failing steps touched lazy content).
  `applyAct` now times every act step and lazy wait, and logs
  `SLOW_FIXTURE_STEP` past 2000 ms. The threshold sits above the slowest step
  of a normal full run (471 ms) times the observed pressure factor. The next
  occurrence names its fixture and step.

## Open, unnamed

**2026-09-11** — one failure in run 5 of ten consecutive full `vitest run`
invocations, immediately after the `overrides.contract` timeout fix. Runs 1-4
and 6-10 were clean at 4744 passed. The run was not logged beyond its summary
line, so the failing test has no name and this is not a row: a row without a
name cannot be checked off, and guessing which test it was would be worse than
recording that it happened. Nine further runs have not reproduced it. The next
person to see a one-in-ten failure here should run with
`VITEST_RECONCILE_JSON` set — that is the whole of the lesson.
