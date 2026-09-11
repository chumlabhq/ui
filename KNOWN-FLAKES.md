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

Related: `E2E-TRIAGE.md` Appendix A deleted 14 tests that were flaky *by
construction* — wall-clock thresholds measuring the host machine rather than the
library. A test that can only fail under load and says nothing about a component
when it does belongs there, deleted, not here.

| Date | Test | Observed | Reading |
|---|---|---|---|
| 2026-09-11 | `DatePicker > Uncontrolled Mode > applies a preset to its own selection when uncontrolled` (`src/components/DatePicker/__tests__/DatePicker.test.tsx`) | Failed once in a full parallel `vitest run` (95 files). Passed in isolation (`vitest run src/components/DatePicker`, 226/226) and on two subsequent full runs (4727 passed each). | `userEvent.setup({ advanceTimers: vi.advanceTimersByTime })` driving a click through fake timers: the click is resolved by advancing a clock the test owns, and under a loaded parallel run the interleaving of that advance with React's act queue is not deterministic. Nothing in the slice that surfaced it touches DatePicker beyond `border-none` → `border-0` in its constants, which is a class string. Not chased, by instruction. **Observed a second time the same day**, in the same way and with the same outcome — isolation green (226/226), next full run green (4731 passed). One more observation and this becomes a defect in the test by the rule above, and the fix is to drop the fake-timer driving rather than the assertion. |
| 2026-09-11 | `portal semantics contract > Table announces every portalled surface a user can operate` (`src/__tests__/contracts/portal-semantics.contract.test.tsx`) | Failed once in a full parallel `vitest run`, immediately after a run in which it passed. Passed in isolation (42/42) and on the next full run (4732 passed). | Not asked for; recorded because it appeared in the same sitting and this file is the only place it would be visible. Table renders the largest tree in the suite and this case drives several portalled surfaces open in one test, so it is the most timing-exposed contract there is. First observation — no reading beyond that yet, and deliberately no fix. |
| 2026-09-11 | `classes override contract > 'DatePicker' > a slot keeps its default classes when a consumer overrides it` (`src/__tests__/contracts/overrides.contract.test.tsx`) | Failed on two of five full `vitest run` invocations the same day, always at a 30-second timeout and always on the heaviest trees (DatePicker, then Dropdown as a cascade). Green on the other three full runs and on two isolated runs of the file (81/81 each). | A fixed 30s test timeout against the largest render in the suite: this contract renders every fixture of every component and overrides every slot, and DatePicker's fixture tree is the biggest one. Under a loaded parallel run it crosses the timeout; nothing about the assertion or the component varies. Two observations — one more and it is a defect in the test by the rule above, and the fix is a per-file timeout or splitting the file, not a change to what it asserts. |
