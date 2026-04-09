# Global Engineering Rules

## Core Principles

- Fix root causes, not symptoms
- Prefer system-level solutions
- Do not break public APIs
- Maintain consistency across system

---

## Severity Levels

🔴 BLOCKER

- Security issues (XSS, injection)
- SSR crashes
- Accessibility failures
- Type errors
- Broken UI

🟡 HIGH

- Performance issues
- Missing tests
- Responsiveness issues
- Theme inconsistencies

🔵 LOW

- Minor DX issues
- Cosmetic issues

RULE:
FAIL only if 🔴 exists

---

## Component Contract

Every component MUST:

- Be fully typed
- Be accessible (WCAG AA)
- Be responsive
- Support light + dark mode
- Be SSR safe
- Avoid unsafe rendering
- Have a Basic Usage example

---

## SSR Rules

Never access browser APIs without:
if (typeof window !== "undefined")

---

## Accessibility Rules

- Keyboard accessible
- Proper ARIA
- Focus visible
- No traps

---

## Performance Rules

- Avoid re-renders
- Optimize heavy components

---

## Security Rules

- No unsafe HTML injection
- Validate inputs

---

## Responsiveness Rules

• Works at 320px → 1440px+
• No horizontal scroll EVER
• No fixed widths
• Use flex/grid
• Tap targets ≥ 44px

---

## Theme Rules

• Must support light + dark
• No hardcoded colors
• Use dark: variants
• Maintain contrast (WCAG AA)

FAIL IF:
• UI breaks in dark mode
• Text not readable
