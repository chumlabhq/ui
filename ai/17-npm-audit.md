# 17 — npm Publish Readiness

You are a STAFF+ release engineer validating whether the package is ready for `npm publish`.

This step is the final gate before publishing. If anything fails here, the pipeline stops and the release is blocked.

---

## INPUTS

- Entire repository
- `package.json`
- `dist/` (build output)
- `/ai/system-state.json`
- `/ai/rules.md`

---

## CHECKS

### 1. package.json validity

- [ ] `name` is `@chumlab/ui`
- [ ] `version` follows semver (no leading `v`, no pre-release tags unless intentional)
- [ ] `description` is set, ≤ 200 chars, matches the canonical tagline
- [ ] `license` is `MIT`
- [ ] `repository` field is set with `type: "git"` and the canonical URL
- [ ] `homepage` is set to `https://chumlab.com`
- [ ] `bugs` field points to GitHub issues
- [ ] `author` is set
- [ ] `keywords` includes core terms (react, components, ui, design system, accessible, ai)

### 2. Entry points

- [ ] `main` points to a valid CJS build file
- [ ] `module` points to a valid ESM build file
- [ ] `types` (or `typings`) points to a valid `.d.ts` file
- [ ] `exports` field present (preferred over `main`/`module` for modern publishes), with proper `import` / `require` / `types` conditions

### 3. Build output

- [ ] `dist/` exists
- [ ] Contains both CJS (`*.cjs.js` or `*.js`) and ESM (`*.esm.js` or `*.mjs`) builds
- [ ] Contains TypeScript declarations (`*.d.ts`)
- [ ] Does NOT contain source files (`*.tsx`, test files, story files)
- [ ] Does NOT contain `.ai.md`, `.schema.json`, or any AI infrastructure files

### 4. Files included

- [ ] `files` field in `package.json` lists ONLY `dist`, `LICENSE`, `README.md` (and similar minimum)
- [ ] `.npmignore` is consistent with `files` (or absent if `files` is used)
- [ ] Verify with `npm pack --dry-run`:
  - [ ] No `src/` files included
  - [ ] No test files included
  - [ ] No `.ai.md`, `.schema.json` included
  - [ ] No internal config files (`.eslintrc`, `tsconfig.json`, etc.) included

### 5. Dependencies

- [ ] `react` and `react-dom` are in `peerDependencies` (NOT `dependencies`)
- [ ] No duplicate deps across `dependencies` and `peerDependencies`
- [ ] No unused deps (run `depcheck` or equivalent)
- [ ] `peerDependenciesMeta` declares `react-dom` optional only if genuinely optional

### 6. Tree shaking

- [ ] `sideEffects` field is correctly set:
  - `false` if no side effects exist
  - An array of paths if side effects are limited (e.g. CSS files)
- [ ] ESM build re-exports allow tree shaking (no barrel files that block it)
- [ ] Verified by importing one component and confirming bundle excludes others

### 7. TypeScript

- [ ] All `.d.ts` files generated
- [ ] Types compile without errors when consumed externally
- [ ] No types depend on internal module paths
- [ ] Public types match the `.ai.md` documentation

### 8. SSR safety

- [ ] No top-level browser API access in any published file
- [ ] All effects use `useEffect` or guarded patterns
- [ ] Verified by running an SSR test (Next.js or `react-dom/server`)

### 9. README

- [ ] README is present and follows the structure from step 11
- [ ] Includes installation, working example, key features
- [ ] No internal references (`.ai.md`, embeddings, AI pipeline)

### 10. LICENSE

- [ ] `LICENSE` file exists at root
- [ ] Matches `package.json` `license` field
- [ ] Year and owner are current

### 11. CHANGELOG

- [ ] `CHANGELOG.md` exists
- [ ] Has an entry for the version being published
- [ ] Entry follows Keep a Changelog format
- [ ] Includes Added / Changed / Fixed / Deprecated / Removed sections as relevant

### 12. npm pack dry-run

Run:

```bash
npm pack --dry-run
```

Capture the file list. Verify it matches the expected output. Flag any unexpected files.

### 13. Build verification (final)

- [ ] `npm run build` succeeds from a clean state
- [ ] All tests pass
- [ ] TypeScript compiles
- [ ] Linter passes

### 14. Version readiness

- [ ] Version in `package.json` is greater than the latest published version on npm
- [ ] No work in progress committed
- [ ] No `console.log`, `debugger`, or TODO markers in published code

---

## OUTPUT FORMAT

```
NPM PUBLISH AUDIT — <ISO date>

CHECK RESULTS:
  1. package.json validity     : <PASS | FAIL>
  2. Entry points              : <PASS | FAIL>
  3. Build output              : <PASS | FAIL>
  4. Files included            : <PASS | FAIL>
  5. Dependencies              : <PASS | FAIL>
  6. Tree shaking              : <PASS | FAIL>
  7. TypeScript                : <PASS | FAIL>
  8. SSR safety                : <PASS | FAIL>
  9. README                    : <PASS | FAIL>
  10. LICENSE                  : <PASS | FAIL>
  11. CHANGELOG                : <PASS | FAIL>
  12. npm pack dry-run         : <PASS | FAIL>
  13. Build verification       : <PASS | FAIL>
  14. Version readiness        : <PASS | FAIL>

PACKAGE SIZE (gzipped): <kb>
FILES IN PACKAGE: <count>

VERDICT: <READY TO PUBLISH | NOT READY>
```

---

## STATE UPDATE

In `/ai/system-state.json`:

- Set `pipeline.currentStep = 17`
- `validation.npmAudit = "PASS"` if all checks pass
- `pipeline.status` = "FAIL" if any check fails

---

## ACCEPTANCE CRITERIA

- Every check returns PASS
- `npm pack --dry-run` includes only intended files
- Verdict = READY TO PUBLISH

PASS if all criteria met. FAIL otherwise → STOP pipeline.
