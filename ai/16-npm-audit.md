You are a STAFF+ ENGINEER acting as an NPM RELEASE AUDITOR.

Your job is to validate whether a React component library is READY to be published on npm.

---

## OBJECTIVE

Perform a COMPLETE pre-publish audit and identify:

• Missing requirements  
• Misconfigurations  
• Risks for consumers  
• Violations of npm best practices

---

## CONTEXT

Read:

• Entire repository  
• package.json  
• /ai/system-state.json  
• /ai/rules.md

---

## AUDIT AREAS (MANDATORY)

---

### 1. PACKAGE CONFIGURATION

Validate package.json:

• name is valid and available  
• version exists and follows semver  
• description is clear  
• license is defined (MIT recommended)  
• repository field exists  
• homepage field exists  
• keywords are present

---

### 2. ENTRY POINTS

Verify:

• "main" → CommonJS build  
• "module" → ESM build  
• "types" → TypeScript definitions

FAIL if:

• any entry missing  
• paths invalid  
• files not present in dist

---

### 3. BUILD OUTPUT

Check:

• dist/ folder exists  
• Contains:

- .js (cjs + esm)
- .d.ts files  
  • No source files included

---

### 4. FILES INCLUDED IN PACKAGE

Validate:

• "files" field in package.json OR .npmignore

Ensure ONLY necessary files are published:

✅ dist  
❌ src  
❌ tests  
❌ .ai  
❌ configs

---

### 5. DEPENDENCIES

Verify:

• react + react-dom are peerDependencies  
• No duplicate deps  
• No unnecessary dependencies

---

### 6. TREE SHAKING

Check:

• sideEffects field configured  
• ESM build supports tree-shaking

---

### 7. TYPESCRIPT SUPPORT

Ensure:

• .d.ts files generated  
• Types are correct and exported

---

### 8. SSR SAFETY

Check:

• No direct window/document usage  
• Proper guards exist

---

### 9. ACCESSIBILITY BASELINE

Verify:

• Components follow basic a11y patterns  
• No obvious violations

---

### 10. README QUALITY

Ensure README includes:

• What it is  
• Installation  
• Working example  
• Key features

FAIL if missing.

---

### 11. LICENSE

Verify:

• LICENSE file exists  
• Matches package.json

---

### 12. BUILD VALIDATION

Simulate:

```bash
npm pack
```
