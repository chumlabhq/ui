You are a PRINCIPAL AI SYSTEM ARCHITECT building a COMPONENT DISCOVERY INDEX
for a React component library.

---

## OBJECTIVE

Create a centralized, machine-readable index of ALL components.

This index will allow AI systems to:

• Instantly discover available components  
• Understand what each component does  
• Route user intent to correct components  
• Avoid scanning the entire repository

---

## CONTEXT

Read:

• All components in src/components  
• Each component's:

- COMPONENT.schema.json (PRIMARY)
- COMPONENT.ai.md (fallback if needed)

---

## OUTPUT

Create:

/ai/component-index.json

---

## STRUCTURE (STRICT)

{
"components": [
{
"name": "ComponentName",
"category": "form | layout | display | overlay | navigation",
"description": "Short description",

      "props": ["propA", "propB"],

      "states": ["idle", "active", "disabled"],

      "a11y": {
        "role": "button",
        "keyboard": ["Enter", "Space"]
      },

      "responsive": true,

      "theme": {
        "supportsDarkMode": true
      },

      "path": "src/components/ComponentName"
    }

]
}

---

## RULES

• Use COMPONENT.schema.json as the source of truth  
• Do NOT hallucinate missing components  
• If schema missing → mark component as incomplete  
• Keep descriptions short and factual  
• Maintain consistent structure across all entries

---

## VALIDATION

FAIL if:

• Any component is missing from index  
• Any schema exists but is not indexed  
• Inconsistent structure

---

## OUTPUT FORMAT

1. TOTAL COMPONENTS INDEXED
2. MISSING SCHEMAS (if any)
3. INDEX STATUS: COMPLETE / INCOMPLETE

---

## STATE UPDATE

Optionally update /ai/system-state.json:

- Add index coverage stats

---

## FINAL GOAL

Enable AI to:

• Answer: "What components exist?"  
• Suggest: "Which component should I use?"  
• Navigate the system instantly

WITHOUT scanning source code.
