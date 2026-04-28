# 19 — Publish Dry Run

You are the FINAL release gate. This step performs a complete dry run of `npm publish` and verifies the package is ready to ship.

This is the last step. After this passes, a human runs `npm publish` (the pipeline does NOT publish automatically).

---

## INPUTS

- Complete repository
- `/ai/system-state.json` (must show all prior steps PASS)
- `package.json` with bumped version
- `CHANGELOG.md` with new entry
- `dist/` build output

---

## CHECKS

### 1. Pipeline state

- [ ] All prior steps in `/ai/system-state.json` show `status: "PASS"`
- [ ] `pipeline.failedStep` is null
- [ ] `confidence` is HIGH

### 2. Clean build

Run from a clean state:

```bash
rm -rf node_modules dist
npm install
npm run build
npm test
```

All must succeed. Capture timing and output.

### 3. npm pack dry run

```bash
npm pack --dry-run
```

Verify file list matches expected. No surprises.

### 4. Tarball inspection

Run `npm pack` (creates an actual tarball without publishing). Inspect:

- Total size
- File list
- Compare against expected manifest

Then delete the tarball.

### 5. Local install verification

Create a temporary fresh project, install the tarball, and verify:

```bash
mkdir -p /tmp/chumlab-verify && cd /tmp/chumlab-verify
npm init -y
npm install <path-to-tarball> react react-dom
```

Then in a test file:

```tsx
import { Button } from "@chumlab/ui";
import * as ReactDOMServer from "react-dom/server";
import * as React from "react";

const html = ReactDOMServer.renderToString(<Button>Test</Button>);
console.log(html);
```

Verify it compiles, runs, and renders without errors.

### 6. Sanity scan of the tarball

Inside the unpacked tarball:

- [ ] No `src/` folder
- [ ] No test files
- [ ] No `.ai.md` or `.schema.json` files
- [ ] No `.env`, `.eslintrc`, `tsconfig.json`, `vitest.config.ts`
- [ ] No `node_modules`
- [ ] README.md is present
- [ ] LICENSE is present
- [ ] CHANGELOG.md is present (optional but recommended)

### 7. npm publish dry run

```bash
npm publish --dry-run
```

Verify zero warnings, zero errors. Capture output.

### 8. Registry collision check

```bash
npm view @chumlab/ui@<new-version>
```

If this returns data, the version already exists on npm. STOP — bump version again.

If it returns `404 Not Found`, the version is available — proceed.

### 9. Last manual sanity

- [ ] Visit https://npmjs.com/package/@chumlab/ui in a browser — verify the previous version shows correctly (this confirms the registry is reachable and the package name is yours)
- [ ] Visit https://github.com/chumlab/ui — verify the repo is public and matches `package.json` repository field

---

## OUTPUT FORMAT

```
PUBLISH DRY RUN — <ISO date>

PACKAGE: @chumlab/ui@<version>

CHECK RESULTS:
  1. Pipeline state             : <PASS | FAIL>
  2. Clean build                : <PASS | FAIL> (<time>)
  3. npm pack --dry-run         : <PASS | FAIL>
  4. Tarball inspection         : <PASS | FAIL> (<size>)
  5. Local install verification : <PASS | FAIL>
  6. Tarball sanity scan        : <PASS | FAIL>
  7. npm publish --dry-run      : <PASS | FAIL>
  8. Registry collision check   : <PASS | FAIL>
  9. Manual sanity              : <PASS | FAIL>

PACKAGE SIZE: <kb>
FILE COUNT: <count>

VERDICT: <READY TO PUBLISH | NOT READY>
NEXT STEP: <run `npm publish` manually | fix issue X>
```

---

## STATE UPDATE

In `/ai/system-state.json`:

- Set `pipeline.currentStep = 19`
- `pipeline.allStepsComplete = true` if all PASS
- `pipeline.status = "PASS"`
- `validation.publishDryRun = "PASS"`
- Set `confidence = "HIGH"`

---

## ACCEPTANCE CRITERIA

- All 9 checks return PASS
- Local install verification renders successfully
- Registry shows the new version is available
- Tarball contains only intended files
- No warnings from `npm publish --dry-run`

PASS if all criteria met. FAIL otherwise.

---

## NEXT STEP (manual)

After this step passes, a human (not the pipeline) runs:

```bash
npm publish --access public
```

The pipeline does NOT publish automatically. This is intentional — there should always be a human in the loop for the final publish action.

---

## POST-PUBLISH (informational, not part of this pipeline)

After publishing:

1. Tag the release: `git tag v<version> && git push --tags`
2. Create a GitHub release from the tag with the CHANGELOG entry as the body
3. Verify the new version is visible at https://npmjs.com/package/@chumlab/ui
4. Verify a fresh `npm install @chumlab/ui` works in a clean project
5. Update `system-state.json`: set `lastPublished` to the new version and timestamp
