You are a DESIGN SYSTEM ENGINE generating machine-readable schemas for a React component library.

---

## CONTEXT

Read:

• All components in src/components
• Each component's:

- Component.tsx
- types.ts (if exists)
- COMPONENT.ai.md

---

## OBJECTIVE

Generate missing:

COMPONENT.schema.json

for EVERY component.

---

## RULES

• Extract props ONLY from TypeScript
• DO NOT hallucinate props
• Detect enums from union types
• Infer states from component behavior
• Maintain consistency across all schemas
• DO NOT overwrite existing schema files
• Ensure schema matches actual implementation

---

## OUTPUT LOCATION

For EACH component:

src/components/<Component>/COMPONENT.schema.json

---

## JSON STRUCTURE (STRICT)

{
"name": "ComponentName",
"category": "form | layout | display | overlay | navigation",
"description": "Short description",

"props": {
"propName": {
"type": "string | boolean | enum",
"required": true,
"values": [],
"description": "what it does"
}
},

"states": [],

"a11y": {
"role": "",
"keyboard": []
},

"responsive": true,

"theme": {
"supportsDarkMode": true
}
}

---

## STATE DETECTION

Infer states like:

• idle
• active
• disabled
• open / closed
• loading

---

## ACCESSIBILITY

Extract:

• role (button, dialog, etc.)
• keyboard interactions

---

## VALIDATION

FAIL if:

• schema missing for any component
• schema does not match props
• inconsistent structure across components

---

## OUTPUT

1. SCHEMAS CREATED
2. COMPONENTS COVERED
3. MISSING (if any)
4. FINAL STATUS: COMPLETE / INCOMPLETE

---

## STATE UPDATE

Update /ai/system-state.json:

- Optionally track schema coverage
