# 16 — Deep Security Audit

You are a SECURITY ENGINEER auditing the codebase for vulnerabilities that npm audit cannot catch.

This step is NEW in v5. The previous pipeline relied entirely on `npm audit`, which only catches dependency CVEs. It misses code-level issues like XSS, prop injection, and unsafe DOM access.

---

## INPUTS

- Entire codebase
- `package.json` and `package-lock.json`
- `/ai/system-state.json`

---

## CHECK 1 — Unsafe HTML rendering

Search for every use of `dangerouslySetInnerHTML`. For each instance:

- Verify input is sanitized (DOMPurify or equivalent)
- Verify input source is trusted (not from user input)
- Document each remaining instance with a justification

🔴 BLOCKER: any unsanitized `dangerouslySetInnerHTML` from user input.

---

## CHECK 2 — Code execution sinks

Search for:

- `eval(`
- `new Function(`
- `setTimeout("string"`
- `setInterval("string"`

🔴 BLOCKER: any of these in production code.

---

## CHECK 3 — Prop type injection

For components that accept rich props (e.g. `as` prop, `tag` prop, `href` prop):

- Verify type signatures restrict to safe values
- Verify URLs are validated before being placed in `href` (no `javascript:` URIs)
- Verify HTML element names are validated (no `<script>`, no `<iframe>`)

🔴 BLOCKER: any path where user-controlled string lands in `href` without validation.

---

## CHECK 4 — Event handler injection

Search for places that pass user-supplied data into:

- `onClick`, `onSubmit`, etc. as a string
- DOM event listeners via `addEventListener`

These should always be functions, never strings.

---

## CHECK 5 — DOM access without sanitization

Search for direct DOM mutations:

- `element.innerHTML = …`
- `element.outerHTML = …`
- `document.write(…)`

Each must use sanitized input or be removed.

---

## CHECK 6 — Sensitive data in logs

Search for `console.log`, `console.error`, etc. that include:

- User input
- Headers / cookies
- Tokens / API keys

🔴 BLOCKER: any sensitive data leak in production code.

---

## CHECK 7 — Dependencies

Run:

```bash
npm audit --production
```

Capture every advisory by severity. Verify:

- Zero `critical` advisories
- Zero `high` advisories on direct dependencies (transitive may be acceptable with mitigation)
- Document any `moderate` advisories

---

## CHECK 8 — License compatibility

For every dependency:

- Verify license is compatible with MIT (Chumlab UI's license)
- Flag any GPL / AGPL / proprietary deps that would force a license change

🔴 BLOCKER: GPL or AGPL dependencies in runtime / production code.

---

## CHECK 9 — Supply chain hygiene

- Verify lockfile (`package-lock.json` or `yarn.lock` or `pnpm-lock.yaml`) is committed
- Verify no `git+` or `file:` dependencies in `package.json`
- Verify all package versions are pinned (no `*` or `latest`)

---

## CHECK 10 — Build-time secrets

Search the codebase for:

- API keys (matching common patterns: `sk_…`, `key_…`, `Bearer …`)
- Hardcoded tokens
- `.env` files committed to the repo

🔴 BLOCKER: any committed secret.

---

## OUTPUT FORMAT

```
SECURITY AUDIT — <ISO date>

CHECKS:
  1. Unsafe HTML       : <PASS | FAIL> (<count> findings)
  2. Code exec sinks   : <PASS | FAIL>
  3. Prop injection    : <PASS | FAIL>
  4. Event handlers    : <PASS | FAIL>
  5. DOM mutations     : <PASS | FAIL>
  6. Sensitive logging : <PASS | FAIL>
  7. npm audit         : <PASS | FAIL> (<count> advisories)
  8. License compat    : <PASS | FAIL>
  9. Supply chain      : <PASS | FAIL>
  10. Committed secrets: <PASS | FAIL>

🔴 BLOCKERS: <count>
  - <description>

🟡 HIGH: <count>
  - <description>
```

---

## STATE UPDATE

In `/ai/system-state.json`:

- Set `pipeline.currentStep = 16`
- Append findings to `issues.*` with type `"security"`
- `validation.security = "PASS"` if zero blockers

---

## ACCEPTANCE CRITERIA

- Zero 🔴 BLOCKERS
- npm audit returns zero high/critical advisories on direct deps
- No license incompatibility
- No committed secrets
- Lockfile committed and clean

PASS if all criteria met. FAIL otherwise → STOP pipeline.
