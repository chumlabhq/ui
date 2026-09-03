# ADR 002 — what the AI Playground reads that still names a pre-migration key

Produced by Task 5. Unknown keys in a `classes` object are **ignored, not rejected**, so a
stale input does not fail — it generates code that compiles, renders unstyled, and looks
like a styling bug in the consumer's app. That is why this is a list and not a warning.

Checked against the live interfaces: 221 pre-migration key names no longer exist anywhere.

## In-repo doc surfaces — clean

| Surface | Retired names in a `classes` position |
| --- | --- |
| 31 `*.ai.md` | 0 |
| 28 `*.schema.json` | 0 |
| `ai/component-index.json` | 0 |
| `llms-full.txt` (generated from the `.ai.md`) | 0 |
| `src/pages/playground/**` | 0 |

Checked precisely, not by word match: schema files against their `classes.properties` block,
`.ai.md` against backticked names on a line that also names a surviving key. A bare-word
scan reports 86 files, but almost all of those are prop names (`tooltip`, `checked`,
`option`) or third-party bundles (`babel.min.js`, `react-dom-client.js`,
`tailwindcss-browser.js`) where the match is a coincidence.

## The vendored preview bundle — STALE

`public/preview-vendor/` was built **2026-09-02 18:40**, before all six migration commits
(2026-09-03 00:03 → 02:38). It is a pre-migration build of the library, so every preview the
Playground renders uses the old anatomy.

Confirmed by sampling names that are gone from `src/` but present in the bundle:

| Name | In `src/` | In `public/preview-vendor/` |
| --- | --- | --- |
| `contentWrapper` | 0 files | 1 |
| `daySelected` | 0 | 1 |
| `menuItemSelected` | 0 | 1 |
| `selectorButton` | 0 | 2 |
| `countrySelectTrigger` | 0 | 1 |
| `tabActive` | 0 | 1 |
| `stepContainer` | 0 | 1 |

**Fix:** `npm run build:preview` (`scripts/build-preview-vendor.mjs`). Not run here — it is a
build artifact, and rebuilding it is a deploy step rather than a source change.

## Outside this repo — not fixed, listed only

The codegen prompts and the eval set live in `chumlab-be` (`src/ai/prompts/*.txt`,
`eval/`), which this repo cannot see. Two things there will still name pre-migration keys:

1. **`CHUMLAB_CODEGEN_SYSTEM_PROMPT.md` and `ai/prompts/*.txt`** — any anatomy or `classes`
   example written before the migration.
2. **The eval set** — fixtures asserting generated output against old key names will now
   pass while generating dead keys, because an unknown key is ignored.

Both need re-checking against the final shape. `llms-full.txt` in this repo is regenerated
and correct, so a prompt that reads it at runtime is fine; one that inlines a copy is not.
