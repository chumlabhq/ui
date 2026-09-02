# ADR 002 — surfaces the rename must reach

Produced before Task 3a; **the migration has since been applied** and the counts below are historical. The closing section records the state afterwards. The rename itself is held (see
`002-migration-blockers.json`), but the blast radius does not depend on when it
lands, and an AI surface naming a key that no longer exists fails **silently**:
an unknown key in a `classes` object is ignored, so a playground generation
keeps compiling and quietly loses its styling.

Counts are of *distinct old key names present in the file* that the migration
does not preserve under that name.

## Generated AI artifacts

| Artifact | Old key names present |
| --- | --- |
| `llms-full.txt` | 161 |
| `ai/component-index.json` | 39 |

`ai/build-llms-full.mjs` regenerates `llms-full.txt` from the `.ai.md` files, so
the `.ai.md` files are the real source and must be corrected first.

## Per-component `.ai.md`

31 files on disk. The heaviest, by distinct stale names:

| File | Names |
| --- | --- |
| `DatePicker/DATEPICKER.ai.md` | 26 |
| `CascadingDropdown/CASCADINGDROPDOWN.ai.md` | 25 |
| `TimePicker/TIMEPICKER.ai.md` | 19 |
| `SearchableDropdown/SEARCHABLEDROPDOWN.ai.md` | 16 |
| `Dropdown`, `Table`, `MultiSelectDropdown`, `TabPanel` | 15 each |
| `InternationalPhoneInput` | 14 |
| `MultiSelectSearchableDropdown`, `Stepper` | 13 each |
| `Pagination` | 12 |
| `Accordion` | 9 |
| `Checkbox` | 8 |
| `Breadcrumb`, `RadioButton` | 6 each |
| `Loader` | 5 |
| `Toast`, `Slider`, `TextArea`, `Button` | 4 each |
| `Input` | 3 |
| `Avatar`, `OtpInput`, `Switch` | 2 each |
| `Drawer`, `ResizablePanel`, `Tooltip`, `Modal` | 1 each |

## Call sites passing a `classes` object

66 files repo-wide, of which 29 are demo pages under `src/pages/demo/`, plus
`src/pages/playground/Playground.tsx`. The rest are fixtures, unit tests and the
`.ai.md` examples.

## Two count discrepancies found while building this

- The task brief says **35 `.ai.md` files**; there are **31**. The migration
  table's 35 entries include four that are sub-components documented inside a
  parent's file (`Loader/DotLoader`, `Loader/LinearLoader`, `Loader/PulseLoader`
  share `LOADER.ai.md`; `RadioButton/RadioButton` shares `RADIOBUTTON.ai.md`;
  `CountryFlag/CountryFlagGroup` shares `COUNTRYFLAG.ai.md`). No component in
  the migration table lacks a documenting file.
- `ai/component-index.json` lists **30** components. `BrandLogo` has an `.ai.md`
  but no index entry — it is marketing chrome, not a published component, so the
  gap is in the `.ai.md`, not the index.

## No vendored bundles

Searched for vendored or pre-built bundles carrying key names; there are none in
this repo. If the AI Playground vendors `@chumlab/ui` on the backend, that copy
is outside this repo and is not covered here.

## After Task 3a (2026-09-03)

227 key moves applied by `scripts/adr002-codemod.mjs`, which uses the TypeScript checker
rather than text matching — a `classes` bag written inside `<Button>` may belong to Tooltip,
and only the contextual type knows which.

| Surface | State |
| --- | --- |
| Types, constants, component source, tests, fixtures, registry, demos | migrated; `tsc --build` clean |
| 27 `.ai.md` files | migrated inside backticks and fenced blocks; prose left alone |
| 28 `*.schema.json` | 225 key renames under `classes.properties` |
| `ai/component-index.json` | 9 anatomy renames (the button/trigger family) |
| `llms-full.txt` | regenerated from the `.ai.md` sources |

**Nothing the AI Playground reads still names a retired key.** The remaining textual matches
for names like `tooltip`, `step`, `startIcon` and `loader` are *props*, not class keys —
verified by checking each against the `classes.properties` block rather than by word match.

### Deferred, 19 rows

- **InternationalPhoneInput ×13, Pagination ×5** — targets are R6-nested
  (`countrySelect.item`, `rowsPerPage.trigger`). Applying them needs the nested `classes`
  object, which is Task 4. Their present keys are untouched and still work.
- **ResizablePanel.handle → resizeHandle ×1** — `resizeHandle` is the last RECALLED
  precedent in the ledger. Not renamed on recall.
