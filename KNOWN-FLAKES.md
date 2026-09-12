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
| 2026-09-11 | `DatePicker > Uncontrolled Mode > applies a preset to its own selection when uncontrolled` (`src/components/DatePicker/__tests__/DatePicker.test.tsx`) | Failed once in a full parallel `vitest run` (95 files). Passed in isolation (`vitest run src/components/DatePicker`, 226/226) and on two subsequent full runs (4727 passed each). | `userEvent.setup({ advanceTimers: vi.advanceTimersByTime })` driving a click through fake timers: the click is resolved by advancing a clock the test owns, and under a loaded parallel run the interleaving of that advance with React's act queue is not deterministic. Nothing in the slice that surfaced it touches DatePicker beyond `border-none` → `border-0` in its constants, which is a class string. **REOPENED at a fourth observation — the fix did not hold.** Its file's slowest case measured 3.0s against a 30s limit, so a timeout is not the mechanism here; the fake-timer driving is. The per-file timeout does not cover it — this file's slowest case is 3.0s against a 30s limit, so the clock was never the mechanism. **Observed three times** (2026-09-11 twice, 2026-09-12 once), each time green in isolation and on the next full run. The third made it a defect in the test by the rule above, and it was fixed there rather than logged again: the assertion now settles the frames the selection queues, with the file's own `flushPositionFrames` helper, before reading the trigger. It was reading between the click and the re-render. Five consecutive runs of that test green; nothing about what it asserts changed. **2026-09-12, fourth observation:** it failed again in a full parallel run, and passed both in isolation (226/226) and on the next full run (4783). So settling the frames reduced the rate but did not remove the race — the remaining exposure is `userEvent`'s own timer advance, not the frames the selection queues. Not chased further in this slice; the next attempt should drop `advanceTimers` for this case entirely and drive it on real timers, which is the change I avoided last time as the larger one. **2026-09-12, fifth observation — and that prescribed next attempt was tried and DOES NOT WORK.** On real timers the calendar opens (`data-open="true"`) but its presets never mount: the position hook calls `requestAnimationFrame` inside `requestAnimationFrame`, and this file's own header records that jsdom does not fire those on their own, which is why `flushPositionFrames` exists. `findByRole("Today")` then fails on every run, not intermittently, and the real-timer leak took a full parallel run from 1 failure to 36. Reverted. Do not retry this route: the fake clock is not incidental here, the calendar is unqueryable without it. What is left to try is removing the rAF dependency from the test's path — a `waitFor` on the dialog with frames driven explicitly, or a component-level seam that lets the calendar position without two nested frames. **2026-09-12, sixth observation:** failed on two of four full runs in the Stepper/TabPanel/Switch slice and passed on the other two; green in isolation (153/153) as always. No change attempted — the route recorded above is still the one to try, and this slice touched nothing near DatePicker. |
| 2026-09-11 | `portal semantics contract > Table announces every portalled surface a user can operate` (`src/__tests__/contracts/portal-semantics.contract.test.tsx`) | Failed once in a full parallel `vitest run`, immediately after a run in which it passed. Passed in isolation (42/42) and on the next full run (4732 passed). | Not asked for; recorded because it appeared in the same sitting and this file is the only place it would be visible. Table renders the largest tree in the suite and this case drives several portalled surfaces open in one test, so it is the most timing-exposed contract there is. **OPEN — not covered by the per-file timeout either, and for a measured reason**: this file's slowest case across three instrumented full runs was 3.4s against a 30s limit, a 9x margin, so whatever failed was not the clock. I do not know the mechanism; one observation and no captured assertion is not enough to name one. What would close it: catch the next occurrence with `VITEST_RECONCILE_JSON` set and read the actual failure instead of inferring one. |
| 2026-09-11 | `classes override contract > 'DatePicker' > a slot keeps its default classes when a consumer overrides it` (`src/__tests__/contracts/overrides.contract.test.tsx`) | Failed on two of five full `vitest run` invocations the same day, always at a 30-second timeout and always on the heaviest trees (DatePicker, then Dropdown as a cascade). Green on the other three full runs and on two isolated runs of the file (81/81 each). | A fixed 30s test timeout against the largest render in the suite: this contract renders every fixture of every component and overrides every slot, and DatePicker's fixture tree is the biggest one. Under a loaded parallel run it crosses the timeout; nothing about the assertion or the component varies. **CLOSED** by `vi.setConfig({ testTimeout: 90_000 })` in the file itself, landing in `fix(ui): close six demo defects and give overrides.contract a derived timeout`. The number is derived rather than picked: with the limit lifted to 300s the tail was measured uncensored over three full runs at 13.3s, 16.3s and 32.8s for the same DatePicker case — a load factor of 2.5 on identical work — so 32.8 x 2.5 rounded up is 90. Per-file because the measurement says so: across all 96 files this is the only one with a case over 20s, the next heaviest peaks at 12.0s and everything else at 4.2s. Ten full runs after the change: nine clean at 4744 passed. |

## Open, unnamed

**2026-09-11** — one failure in run 5 of ten consecutive full `vitest run`
invocations, immediately after the `overrides.contract` timeout fix. Runs 1-4
and 6-10 were clean at 4744 passed. The run was not logged beyond its summary
line, so the failing test has no name and this is not a row: a row without a
name cannot be checked off, and guessing which test it was would be worse than
recording that it happened. Nine further runs have not reproduced it. The next
person to see a one-in-ten failure here should run with
`VITEST_RECONCILE_JSON` set — that is the whole of the lesson.
