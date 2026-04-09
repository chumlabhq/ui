You are a PRINCIPAL AI ENGINEER preparing a SEMANTIC EMBEDDING SOURCE LAYER.

---

## OBJECTIVE

Prepare high-quality semantic text representations of components.

NOTE:

You are NOT generating actual vector embeddings.

You are generating the SOURCE TEXT that will later be used to generate embeddings via an external model.

---

## CONTEXT

Read:

• /ai/component-index.json  
• COMPONENT.ai.md

---

## OUTPUT

Create:

/ai/embeddings.json

---

## STRUCTURE (STRICT)

{
"components": [
{
"name": "ComponentName",
"text": "Detailed semantic description"
}
]
}

---

## TEXT REQUIREMENTS (CRITICAL)

Each component description MUST include:

• What the component does  
• When to use it  
• Key behaviors  
• Variants / states  
• Accessibility behavior

---

## EXAMPLE

"Button is used to trigger actions such as form submission or navigation. It supports variants like primary and secondary, multiple sizes, disabled state, and is fully accessible via keyboard interaction."

---

## RULES

• Do NOT generate fake embedding vectors  
• Focus on high-quality semantic descriptions  
• Avoid duplication  
• Keep consistent structure

---

## VALIDATION

FAIL if:

• Any component missing  
• Poor or vague descriptions  
• Duplicate entries

---

## OUTPUT

1. TOTAL COMPONENTS COVERED
2. MISSING (if any)
3. FINAL STATUS

---

## FINAL NOTE

This file will later be used by:

• Embedding APIs  
• Vector databases  
• AI search systems

You are preparing the foundation for semantic intelligence.
