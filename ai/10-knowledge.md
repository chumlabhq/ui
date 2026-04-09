You are a PRINCIPAL DESIGN SYSTEM ENGINEER building an AI-FIRST KNOWLEDGE LAYER for a React component library.

---

## OBJECTIVE

Enable AI agents (Claude, Cursor, Copilot, ChatGPT) to:

• Use components WITHOUT reading source code  
• Generate correct implementations  
• Style components correctly  
• Debug issues reliably  
• Understand constraints and edge cases

This system must eliminate guesswork.

---

## DELIVERABLES (MANDATORY)

For EACH component generate:

1. COMPONENT.ai.md (human + AI readable)
2. COMPONENT.schema.json (machine-readable)
3. JSDoc on component
4. index.ts discovery comment

---

## FILE LOCATIONS

src/components/<Component>/
├── Component.tsx
├── index.ts
├── COMPONENT.ai.md
├── COMPONENT.schema.json

---

## 1. COMPONENT.ai.md (PRIMARY ARTIFACT)

This is the MOST IMPORTANT file.

It must be:

• Highly structured  
• Optimized for LLM parsing  
• Concise but complete  
• No fluff  
• Max ~500 lines

---

## REQUIRED STRUCTURE

# ComponentName

## What this is

2–3 lines. Direct explanation.

---

## When to use

Bullet list of real-world use cases.

---

## When NOT to use

Critical misuse prevention.

---

## Quick Usage (copy-paste)

A COMPLETE working file.

---

## Mental Model (VERY IMPORTANT)

Explain behavior:

• controlled vs uncontrolled  
• internal state logic  
• composition model

---

## Prop Intelligence (CRITICAL)

Explain:

• Required props  
• Optional props  
• Conditional props  
• Invalid combinations  
• Silent failure cases

DO NOT just list types — explain behavior.

---

## State Machine (IMPORTANT)

List states:

• idle  
• active  
• disabled  
• open/closed (if applicable)

Explain transitions.

---

## Styling System

Explain:

• Class slots  
• Override rules  
• Unstyled mode  
• Variant system  
• Size system

---

## Accessibility Behavior

• Keyboard interactions  
• ARIA roles  
• Screen reader behavior

---

## Responsive Behavior

Explain how it adapts across screen sizes.

---

## Theme Behavior (LIGHT/DARK)

Explain:

• Light vs dark rendering  
• Required tokens  
• Common issues

---

## Data Attributes

List ALL:

• data-_  
• aria-_

Include element location.

---

## Patterns (REAL USAGE)

Include complete examples:

• Controlled usage  
• API-driven data  
• Composition  
• Loading states

---

## Anti-patterns (VERY IMPORTANT)

Show WRONG usage and why it fails.

---

## Troubleshooting

| Problem | Cause | Fix |
| ------- | ----- | --- |

Minimum 5 rows.

---

## AI INSTRUCTIONS (CRITICAL 🔥)

Explain how AI should use this component:

• Safe defaults  
• Required props  
• Common mistakes AI makes  
• What to ALWAYS include

Example:

- Always provide accessible labels
- Do not partially override class slots
- Use controlled mode for dynamic data

---

## DEMO REFERENCE

Link demo file and explain sections.

---

## SOURCE MAP

Explain:

• Main component  
• Types file  
• Styling constants
