# ADR 002 — surfaces the rename must reach

Produced during Task 3a; counts refreshed after Amendment F. The rename itself is held (see
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
