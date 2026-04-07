You are building the AI knowledge layer for a React component library (Chumlab).

Your task: for the given component, produce three deliverables that let AI agents (Copilot, Cursor, Claude, etc.) implement, style, and troubleshoot the component without reading source code.

---

## DELIVERABLES

### 1. `COMPONENT.ai.md` — Knowledge doc (co-located with component)

Place at: `src/components/<Component>/COMPONENT.ai.md`

This is the primary artifact. Follow the exact section structure below.

### 2. JSDoc on the main component

Add above the component's `forwardRef` / function declaration. Keep it short — purpose, when to use, key behaviors, and a pointer to the `.ai.md` file.

### 3. Discovery comment in `index.ts`

Add as line 1: `// AI Knowledge: See COMPONENT.ai.md in this directory for full usage guide, props, styling, and patterns.`

---

## COMPONENT.ai.md STRUCTURE

Follow this exact section order. Every section is required unless marked (if applicable).

```markdown
# ComponentName

> One-line description of what it does.

**Category:** (form | disclosure | feedback | navigation | layout | display | overlay)
**Keywords:** comma, separated, search, terms

---

## Quick Answer

2-3 sentences. What it is, when to use it, minimum required setup. This is what an LLM reads first when deciding how to use the component.

---

## Import

\```tsx
import { Component } from "@chumlab/ui/component";
\```

---

## Basic Usage (copy-paste ready)

A COMPLETE working file — not a fragment. Must include the import, a function component, and the return. Must render correctly with zero additional setup.

\```tsx
import { Component } from "@chumlab/ui/component";

export default function Example() {
  return <Component>...</Component>;
}
\```

---

## Prop Constraints (critical for correct usage)

Table of props that have dependencies or restrictions. These cause silent bugs when used wrong.

| Prop | Constraint |
|------|-----------|
| `propA` | Only works when `propB="x"`. Ignored otherwise. |

---

## Data Attributes (for CSS selectors and testing)

Bullet list of `data-*` and `aria-*` attributes exposed on the rendered DOM. Include which element they appear on.

One-line DOM nesting summary: `root > wrapper > trigger + content`

---

## All Props

One table per sub-component (root, children). Include: Prop, Type, Default, Description. Mark required props. Include constraint notes inline (e.g., "(single only)").

---

## Ref API (if applicable)

Code block showing `useRef` setup and all available methods with inline comments.

---

## Styling Guide

This section is CRITICAL. It must contain ALL of the following subsections:

### How class merging works

Explain the three modes:
1. Default (no classes, no unstyled) — uses DEFAULT_*_CLASSES
2. Partial override (classes without unstyled) — REPLACES per slot, not additive
3. Unstyled (unstyled=true) — all slots empty, you provide everything

### Slot → visual mapping

ASCII diagram showing the visual nesting of all class slots. Then a lookup table:

| "I want to change..." | Slot to use | Notes |
|------------------------|-------------|-------|

### Dark mode

Explain that defaults use Tailwind `dark:` prefix, activated by `<html class="dark">`. When overriding, always provide both variants.

### Styling via data attributes

Show how to use `data-state`, `data-disabled` etc. with Tailwind arbitrary variants and plain CSS.

### Size/variant interaction with classes (if applicable)

Explain whether size/variant props stack on top of custom classes. If yes, explain that `unstyled` is needed for full control.

### Complete themed example

Full copy-paste code block showing a completely custom-styled version (unstyled + classes). Pick a recognizable real-world style (e.g., "macOS Settings", "Stripe Dashboard", "Notion sidebar").

---

## Patterns

3-5 common real-world patterns as complete code blocks. Examples:
- Controlled state
- Dynamic items from API data
- Loading state with shimmer
- Composition with other components

---

## Accessibility

Bullet list covering: keyboard navigation, ARIA attributes, screen reader behavior, reduced motion support.

---

## Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|

Include 5-8 rows covering the most common mistakes. Include styling-related issues (e.g., "overrode one slot but styles look wrong" → "classes replaces, not merges").

---

## Demo Reference

**File:** `src/pages/demo/ComponentDemo.tsx`

Searchable lookup table:

| Feature | Search for | What you'll find |
|---------|-----------|------------------|
| Minimal example | `title="Basic Usage"` | ... |

Then a source file index:

| File | Contains |
|------|----------|
| `Component.tsx` | Main component, context, ref API |
```

---

## JSDOC FORMAT

```typescript
/**
 * Component: ComponentName
 *
 * Purpose:
 * What this component does in 1-2 sentences.
 *
 * AI Usage Guidelines:
 * - When to use (common scenarios)
 * - How to use safely (minimum required props)
 * - What to avoid (common mistakes)
 *
 * Behavior:
 * - Key states and modes supported
 *
 * Reference:
 * - COMPONENT.ai.md (this directory) — full AI knowledge doc
 * - src/pages/demo/ComponentDemo.tsx — live demo
 */
```

---

## HOW TO EXTRACT INFORMATION

### Props
- Extract ONLY from TypeScript interfaces in `utils/types.ts`
- Validate defaults from the component file (destructured props with `= defaultValue`)
- Cross-reference with demo usage to confirm real-world patterns

### Styling slots
- Read the `DEFAULT_*_CLASSES` constant in `utils/constants.ts`
- Map each key to its DOM element by reading the component's JSX
- Check for `SIZE_CLASSES`, `VARIANT_CLASSES` or similar maps that stack additional classes

### Demo sections
- Scan for `title="..."` strings in the demo file to build the searchable index
- Identify the simplest working example as the Basic Usage
- Extract themed/styled examples for the Styling Guide

### Prop constraints
- Look for discriminated unions in types (e.g., `type: "single"` vs `type: "multiple"`)
- Check for runtime guards / early returns in the component
- Look for props that are only destructured inside conditional branches

---

## STRICT RULES

- Process ONE component at a time
- Do NOT hallucinate props — extract only from source types
- Do NOT copy demo code verbatim — simplify into clean patterns
- Do NOT create redundant sections (if Troubleshooting covers a "don't", don't repeat it in a separate Do/Don't section)
- Do NOT bloat — every line must earn its place. An agent's context window is limited.
- Keep `COMPONENT.ai.md` under 500 lines
- Use markdown, not JSON — LLMs parse markdown natively
- Always provide both `dark:` and light variants in styling examples

---

## REFERENCE IMPLEMENTATION

See `src/components/Accordion/ACCORDION.ai.md` as the canonical example. Match its structure, depth, and style for all other components.

---

## CHECKLIST (verify before marking complete)

- [ ] `COMPONENT.ai.md` exists at `src/components/<Component>/`
- [ ] All sections from the structure above are present
- [ ] Basic Usage is a complete, copy-paste-ready file
- [ ] Prop Constraints table covers all dependent/conditional props
- [ ] Styling Guide has: merge behavior, slot map, dark mode, data attributes, themed example
- [ ] Troubleshooting has 5+ rows including styling issues
- [ ] Demo Reference has searchable `title="..."` lookup table
- [ ] Source file index maps every file to its responsibility
- [ ] JSDoc added to main component file with pointer to `.ai.md`
- [ ] `index.ts` has discovery comment at line 1
- [ ] No redundancy between sections
- [ ] Under 500 lines total
