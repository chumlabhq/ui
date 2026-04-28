# 12 — Brand Consistency Audit

You are performing brand standardization across the entire repository.

This step ensures every reference to the product uses the canonical strings.

---

## INPUTS

- Entire repository
- `package.json`
- `/ai/system-state.json`

---

## CANONICAL STRINGS

These are the only acceptable forms:

| Context | Canonical form |
| --- | --- |
| Display name | Chumlab |
| Product name | Chumlab UI |
| Package name | `@chumlab/ui` |
| Domain | chumlab.com |
| GitHub | github.com/chumlab/ui |
| npm | npmjs.com/package/@chumlab/ui |
| License | MIT |
| Tagline | "A free, open source React component library, built for people who care about craft." |

---

## DETECTION

Find and flag any of these:

- "Chumlab UI" written as "ChumlabUI", "chumlab-ui", "chumlab/ui" without the `@`
- "@chumlab/ui" written as `chumlab/ui`, `chumlab-ui`, `@chumlab-ui`
- Any reference to a previous name if one existed (placeholder names from before publish)
- Inconsistent capitalization (CHUMLAB, chumlab, ChumLab)
- Copyright lines with wrong year or owner
- Commented-out brand references

---

## SCAN COVERAGE

Check:

- `package.json` (name, description, repository, homepage, author, keywords)
- `README.md`
- All `.md` files in the repo
- All `<title>`, `<meta>`, JSON-LD in HTML / framework metadata files
- All component `.ai.md` files
- LICENSE
- CONTRIBUTING.md
- CODE_OF_CONDUCT.md
- All footer / header components
- All marketing site sections

---

## FIX RULES

- Replace non-canonical forms with canonical
- If a placeholder name exists from before publish, replace it everywhere
- Update copyright year if wrong
- Do not invent brand assertions (e.g. don't add "trusted by 1000+ teams" without source)

---

## OUTPUT FORMAT

```
BRAND AUDIT — <ISO date>

INCONSISTENCIES FOUND: <count>
  - <file>:<line> — "<found>" should be "<canonical>"

REPLACEMENTS MADE: <count>

FILES MODIFIED:
  - <path>
```

---

## STATE UPDATE

In `/ai/system-state.json`:

- Set `pipeline.currentStep = 12`
- `validation.brand = "PASS"` if all canonical

---

## ACCEPTANCE CRITERIA

- Zero non-canonical brand strings remain
- `package.json` uses canonical name and metadata
- Copyright lines are current
- No placeholder names remain anywhere

PASS if all criteria met. FAIL otherwise.
