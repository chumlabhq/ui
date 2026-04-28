# 09 — AI Knowledge Layer

You are a PRINCIPAL DESIGN SYSTEM ENGINEER building an AI-first knowledge layer.

This step generates a `.ai.md` file for every component. These files let AI agents (Claude, Cursor, Copilot, ChatGPT) use the components correctly without reading source code.

---

## INPUTS

- All components in `src/components/`
- `/ai/system-state.json`
- `/ai/rules.md`
- Existing `.ai.md` files (do not overwrite — read and update where present)

---

## OBJECTIVE

For every component, produce a `<Component>.ai.md` file at `src/components/<Component>/`. The file must enable AI agents to:

- Use the component correctly without reading source
- Generate valid implementations from a one-line description
- Style components correctly with the design system
- Debug usage issues
- Avoid known anti-patterns

---

## REQUIRED STRUCTURE

Every `.ai.md` file must follow this structure exactly. Section headings are stable so AI agents can parse them reliably.

```markdown
# ComponentName

## What this is

2–3 sentences. What it does, not how.

## When to use

- Bullet 1
- Bullet 2
- Bullet 3

## When NOT to use

- Bullet 1 (specific misuse)
- Bullet 2

## Quick Usage

A complete copy-paste example as a TSX code block. Must render successfully when pasted into a fresh React project that has @chumlab/ui installed.

## Mental Model

How the component thinks about its inputs. Cover:
- Controlled vs uncontrolled
- Internal state
- Composition pattern (children, slots, render props)

## Props

For every prop:
- Name + type + required/optional
- One-line description of behavior
- Default value
- Notable interactions with other props

Do NOT just list types — explain behavior.

## States

List every state and its visual / behavioral meaning:
- idle
- active
- disabled
- (others as relevant)

## Styling

How to customize:
- Class slots
- Theme tokens used
- Override patterns
- Unstyled mode (if supported)

## Accessibility

- Keyboard interactions (every key handled)
- ARIA roles applied
- Screen reader behavior
- Focus management

## Responsive Behavior

How it adapts at: 320px, 768px, 1024px, 1440px+

## Theme (Light + Dark)

Behavior in each mode. Required tokens. Common pitfalls.

## Data Attributes

All `data-*` and `aria-*` attributes the component sets, with element location.

## Patterns

3–5 real-world patterns:
- Controlled usage
- API-driven data
- Composition with other components
- Loading state
- Error state

## Anti-patterns

3–5 ways to get it wrong, and why they fail.

## Troubleshooting

| Problem | Cause | Fix |
| ------- | ----- | --- |

Minimum 5 rows.

## AI Instructions

Direct guidance for AI agents using this component:
- Safe defaults to apply automatically
- Required props that must always be set
- Common mistakes AI agents make
- Required accompanying components (e.g. parent providers)

## Demo Reference

Path to the demo file and explanation of what it shows.

## Source Map

Where the implementation lives:
- Main component
- Types
- Internal utilities
- Constants / styling
```

---

## CONTENT RULES

- No fluff. Every sentence must add information.
- No marketing language. Be technical.
- Use TypeScript syntax in code blocks.
- Code blocks must be self-contained and runnable.
- Maximum file length: 500 lines.

---

## OUTPUT FORMAT

```
KNOWLEDGE LAYER — <ISO date>

FILES CREATED: <count>
  - <path>

FILES UPDATED: <count>
  - <path>

COMPONENTS COMPLETE: <count>/<total>

MISSING SECTIONS:
  - <component>: <list of missing required sections>
```

---

## STATE UPDATE

In `/ai/system-state.json`:

- Set `pipeline.currentStep = 9`
- `coverage.knowledge` = (count of complete files / total components) × 100
- `validation.knowledge` = "PASS" if all files complete, else "FAIL"

---

## ACCEPTANCE CRITERIA

- Every public component has a `.ai.md` file
- Every file contains all required sections
- No section is empty
- Every code block is valid TypeScript that compiles
- Every linked path actually exists in the repository

PASS if all criteria met. FAIL otherwise.
