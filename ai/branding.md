You are a PRINCIPAL ENGINEER performing a FULL REPOSITORY BRAND MIGRATION.

This is NOT a search-replace task.
This is a SYSTEM-WIDE SAFE TRANSFORMATION.

---

OBJECTIVE:

Migrate branding from:

OLD:
• "kern ui"
• "kern-ui"
• "kernui"
• Any variation of Kern UI

TO:

NEW:
• "Chumlab"
• npm package: "chumlab/ui"

---

CRITICAL RULES:

• Scan ENTIRE repository (no partial updates)
• Case-sensitive + case-insensitive matches
• Detect ALL variations (camelCase, kebab-case, PascalCase, etc.)
• DO NOT break imports or functionality
• Maintain consistency everywhere

---

PHASE 1 — DISCOVERY

Identify ALL occurrences of old branding in:

• Code (JS/TS/TSX)
• Component names
• Imports / exports
• Package names
• Config files
• Docs (MD/MDX)
• README
• Comments
• Storybook / demos
• Tests
• CSS / Tailwind config
• Build configs
• Metadata (package.json, tsconfig, etc.)

OUTPUT:

[BRAND USAGE MAP]

---

PHASE 2 — TRANSFORMATION

Apply SAFE transformations:

1. NAMING

• Replace:

- kern ui → Chumlab
- kern-ui → chumlab
- kernui → chumlab

• Ensure:

- Component prefixes updated if needed
- No broken identifiers

---

2. PACKAGE MIGRATION

• Update ALL imports:

OLD:
import { Button } from "kern-ui"

NEW:
import { Button } from "chumlab/ui"

• Update:

- package.json name
- peer dependencies
- internal imports

---

3. DOCUMENTATION

• Update ALL docs:

- Library name
- Examples
- Installation instructions
- Usage snippets

---

4. COMMENTS

• Update meaningful comments ONLY
• Remove outdated references

---

5. UI TEXT / BRAND COPY

• Replace visible branding in:

- Demo pages
- Storybook
- Examples

---

6. FILE / FOLDER NAMES

• Rename if required:

- folders
- files
- exports

---

7. CONFIG & BUILD

• Update:

- package.json
- tsconfig paths
- bundler configs
- storybook config

---

PHASE 3 — VALIDATION

Ensure:

• No remaining "kern" references
• No broken imports
• No invalid paths
• No type errors
• No build errors

---

PHASE 4 — CLEANUP

• Remove dead references
• Ensure naming consistency
• Normalize casing across system

---

OUTPUT:

A. CHANGES SUMMARY
• Files modified
• Renames performed
• Import updates

B. SAFETY CHECK
• Confirm zero old branding remains
• Confirm build stability

C. FINAL STATUS

Brand migration: COMPLETE / INCOMPLETE

---

STRICT RULES:

• DO NOT miss any occurrence
• DO NOT leave partial updates
• DO NOT break API or exports
• DO NOT introduce inconsistencies

DEFAULT ASSUMPTION:

Branding is inconsistently applied and must be fully corrected.

FINAL GOAL:

A clean, production-ready repository fully branded as:

👉 Chumlab
👉 npm: chumlab/ui
