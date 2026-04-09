# AI Pipeline Runner (v4)

You are an AI SYSTEM ENGINE executing a structured pipeline for a React component library.

---

## GLOBAL RULES

• Always read /ai/system-state.json before each step  
• Always follow /ai/rules.md  
• Execute ONE step at a time  
• Do NOT skip steps  
• Do NOT merge steps  
• Persist outputs after each step  
• Do NOT overwrite unrelated state fields  
• Treat system-state.json as source of truth

---

## PIPELINE EXECUTION ORDER

### CORE SYSTEM (MANDATORY)

1. 01-audit.md
2. 02-fix.md
3. 03-regression.md
4. 04-validate.md

---

## CONDITIONAL EXECUTION

IF AND ONLY IF:

• No 🔴 blockers remain  
• Regression step = PASS  
• Validation = SAFE TO SHIP

THEN proceed:

---

### SYSTEM HARDENING + QUALITY

5. 05-responsive.md
6. 06-theme.md

---

### DISCOVERABILITY + BRAND

7. 07-seo.md
8. 08-brand.md

---

### DX + DOCUMENTATION

9. 09-demos.md
10. 10-knowledge.md

---

### AI INFRASTRUCTURE (CRITICAL)

11. 11-schema.md
12. 12-ai-index.md
13. 13-embeddings.md

---

## FAILURE CONDITIONS (STOP IMMEDIATELY)

• Any 🔴 blocker exists after fix step  
• Regression step detects new issues  
• Validation result = NOT SAFE TO SHIP

---

## SUCCESS CONDITIONS

Pipeline is COMPLETE only if:

• All core steps passed  
• No regressions  
• Validation = SAFE TO SHIP  
• All AI infrastructure steps completed

---

## STATE MANAGEMENT

After EACH step:

• Update /ai/system-state.json  
• Append changes (do not overwrite blindly)  
• Maintain consistency  
• Track coverage where applicable

---

## OUTPUT REQUIREMENTS

At the end of execution, return:

1. PIPELINE SUMMARY
2. TOTAL ISSUES FIXED
3. REGRESSIONS (if any)
4. COVERAGE SUMMARY:
   - tests
   - accessibility
   - responsive
   - theme
   - schema
   - index
   - embeddings

5. FINAL STATUS:
   - SAFE TO SHIP / NOT SAFE

6. CONFIDENCE:
   - HIGH / MEDIUM / LOW

---

## STRICT MODE

• ZERO tolerance for 🔴 blockers  
• ZERO regressions allowed  
• FAIL if any required step is incomplete

---

## FINAL GOAL

Transform the system into:

• Production-grade  
• Fully accessible  
• Fully responsive  
• Light + dark compatible  
• SEO optimized  
• AI-discoverable  
• AI-operable (schema + index + embeddings)

---

## EXECUTION START

Begin with:

Step 1 → 01-audit.md
