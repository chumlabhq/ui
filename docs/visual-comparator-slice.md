# Scoping: replacing pixelmatch with ssim-cie94 in the visual suite

**Status: scoped, not started.** Everything below was measured on
2026-09-11 on `refactor/v1-hardening`. Nothing here has been applied; the suite
still compares with pixelmatch at `maxDiffPixels: 1`.

## Why this exists

Four visual subjects cannot fail their own plant, and no budget fixes them:

- `MultiSelectDropdown/closed`
- `MultiSelectSearchableDropdown/closed`
- `TimePicker/closed`
- `MultiSelectDropdown/loading`

Each photographs a 16x16 chevron stroked in a mid-grey. Hide it with a
stylesheet rule and the baseline still passes at `maxDiffPixels: 1`,
`threshold: 0`. That is not a tolerance problem: **Playwright's comparator is
pixelmatch, and pixelmatch excludes antialiased pixels by design.** A thin grey
glyph on a light surface is almost entirely antialiasing to its heuristic.

The number, so nobody has to rediscover it: decoding the baseline and the
planted capture and comparing them byte by byte counts **28 differing pixels**
where **Playwright counts 1**. The decoder used was 40 lines of stdlib Python —
zlib plus PNG unfiltering — and the images differ visibly to the eye, so this
is not a subtle disagreement about edge pixels.

## What was already tried

| Lever | Result |
|---|---|
| `maxDiffPixels` 30 → 1 | Closed 33 of 37 at-risk subjects. Did nothing for these four. |
| `threshold` 0.05 → 0.02 → 0.01 → 0 | No change at all for these four. Threshold is per-pixel colour distance; it does not reach the antialiasing exclusion. |
| `_comparator: "ssim-cie94"` | **Sees all four**: 26, 26, 26 and 26 px for the three dropdown chevrons, 50–52 px for the Toast and Table cases in the same family. |

## What adopting it would take

1. **Re-record 437 baselines.** Not because the renders change — because the
   comparison does. A baseline recorded for one comparator is not evidence for
   another, and re-recording under the new one is the only way to start from a
   known-good state rather than from whatever happens to pass.

2. **A budget in a different space.** `maxDiffPixels: 1` is derived from a
   measured floor of exactly zero differing pixels across 437 pixelmatch
   comparisons. SSIM does not count pixels the same way: it scores structural
   similarity over sliding windows, so a single changed pixel can flag the
   whole window and the counts are not comparable. The equivalent derivation
   has to be redone from scratch — run the suite at the tightest setting, read
   the clean-run floor, add insurance.

3. **Two subjects that failed on a clean run.** With the comparator swapped and
   no other change, `Slider/disabled` and `CascadingDropdown/open-submenu`
   failed against their existing baselines at **1110 and 2902 pixels**
   respectively (largest observed in that run: 29918). Whether those are
   genuine sensitivity or artefacts of comparing pixelmatch-era baselines with
   an SSIM comparator is exactly what step 1 would settle — and if they still
   flag after re-recording, this is a gate that cries wolf and the trade is
   off.

4. **A private option.** `_comparator` is underscore-prefixed: it is not
   Playwright's public API. If a future version drops or renames it the option
   is likely to be IGNORED rather than to error, which puts the suite back on
   pixelmatch silently — the exact failure mode this whole line of work exists
   to prevent. Any adoption needs a self-check that the comparator in force can
   still see a hidden thin glyph, in the shape of the existing
   "the budget is tight enough to see a 14x14 glyph disappear" test.

## The alternative, for comparison

Crop each at-risk subject to the element it exists to capture and screenshot
that instead of the whole fixture. Signal-to-noise goes up without changing the
comparator at all, because the glyph stops being 0.07% of the image. Costs
roughly 340 additional baseline PNGs and a declared locator per subject — the
locator being the part with real value, since "what this subject exists to
capture" is currently written nowhere.

## Recommendation to whoever picks this up

Do step 1 and 2 on a branch and stop there: re-record under SSIM, derive the
floor, and see whether `Slider/disabled` and `CascadingDropdown/open-submenu`
still flag. That is a day's work and it answers the only open question. If they
still flag, take the crop option instead — it is more files but no new
comparator semantics and no private API.
