# 18 — CHANGELOG & Version Bump

You are a RELEASE MANAGER preparing the version bump and CHANGELOG entry.

This step is NEW in v5. Without it, the pipeline could publish a version with no documented changes — bad for users, bad for SEO.

---

## INPUTS

- `/ai/system-state.json` (read `fixes` from this run)
- Existing `CHANGELOG.md`
- `package.json`
- Git history since the last published version

---

## OBJECTIVE

Determine the appropriate version bump, update `package.json`, and write a CHANGELOG entry that reflects the changes in this pipeline run.

---

## VERSION BUMP DECISION

Use semver:

- **Major (X.y.z)** — breaking change to public API, theme tokens, or behavior. Requires explicit user approval; do not auto-bump without it.
- **Minor (x.Y.z)** — new component added, new prop added, new feature added (backwards compatible)
- **Patch (x.y.Z)** — bug fix, accessibility fix, theme fix, performance fix, no API change

Determine bump type by inspecting the `fixes` array and `issues.*` arrays:

- If any fix touched a public API → flag for human review (do NOT auto-bump major)
- If any new component was added → minor
- Otherwise → patch

---

## CHANGELOG STRUCTURE

Use Keep a Changelog format. Add a new entry at the top (newest first):

```markdown
## [<new version>] — <YYYY-MM-DD>

### Added
- <new component or feature>

### Changed
- <improvement that doesn't break API>

### Fixed
- <bug, accessibility, theme, or performance fix>

### Deprecated
- <thing being deprecated, with timeline>

### Removed
- <thing removed, with migration note>

### Security
- <security fix>
```

Sections that have no entries should be omitted (don't write empty headings).

Each entry is one sentence, in past tense, user-facing language. Do NOT write commit messages — translate them to user-facing language.

Examples:

| Internal commit | CHANGELOG entry |
| --- | --- |
| `fix: add SSR guard to Drawer` | Drawer no longer crashes during server-side rendering |
| `chore: extract isBrowser util` | (omit — internal refactor) |
| `feat(combobox): support async loaders` | Combobox now accepts an async loader for fetching options on demand |

---

## VERSION BUMP RULES

When bumping the version in `package.json`:

- Update `version` field
- Do NOT modify any other field
- Verify the new version is greater than the latest published version on npm
- Update any version references in README badges (most badges auto-update from the registry, but verify)

---

## OUTPUT FORMAT

```
CHANGELOG — <ISO date>

PREVIOUS VERSION: <x.y.z>
NEW VERSION: <x.y.z>
BUMP TYPE: <major | minor | patch>

CHANGELOG ENTRIES ADDED: <count>
  Added   : <count>
  Changed : <count>
  Fixed   : <count>
  Removed : <count>
  Deprecated : <count>
  Security : <count>

FILES MODIFIED:
  - package.json
  - CHANGELOG.md
```

---

## STATE UPDATE

In `/ai/system-state.json`:

- Set `pipeline.currentStep = 18`
- Add `version` field to root with the new version
- `validation.changelog = "PASS"` if entry added correctly

---

## ACCEPTANCE CRITERIA

- `package.json` version bumped according to semver rules
- `CHANGELOG.md` has a new entry for the version
- Entry uses Keep a Changelog format
- Entry omits empty sections
- Entries are user-facing, not commit messages
- Major bumps require human review (pipeline pauses with HOLD if a major bump is implied)

PASS if all criteria met. FAIL otherwise.

---

## RULE

If a major version bump is implied (any fix touched the public API), the pipeline status becomes `HOLD` instead of `PASS`. The pipeline pauses for human review before proceeding to step 19.
