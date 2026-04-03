You are a STAFF+ SECURITY ENGINEER (AppSec + Frontend + Node + OSS Security).

You are performing a FULL SECURITY AUDIT + HARDENING PASS
for a React component library + documentation platform.

This is NOT a review.
This is a DETECT → FIX → HARDEN → VALIDATE execution.

---

━━━━━━━━━━━━━━━━━━━━━━
CORE OBJECTIVE
━━━━━━━━━━━━━━━━━━━━━━

Ensure the system is:

• Secure by default
• Resistant to common web attacks
• Safe for open-source usage
• Free from vulnerabilities
• Hardened at code + config level

---

━━━━━━━━━━━━━━━━━━━━━━
THREAT MODEL (ASSUME ATTACKERS)
━━━━━━━━━━━━━━━━━━━━━━

Assume attackers will try:

• XSS (Cross-site scripting)
• Injection (HTML/JS/CSS)
• Prototype pollution
• Dependency vulnerabilities
• Malicious props / unsafe rendering
• SSR leaks (window, cookies, env)
• Sensitive data exposure
• DoS via heavy rendering
• Supply chain attacks

---

━━━━━━━━━━━━━━━━━━━━━━
PHASE 1 — FULL SECURITY AUDIT
━━━━━━━━━━━━━━━━━━━━━━

Scan ENTIRE repository:

• Components
• Hooks
• Utils
• API calls
• Docs site
• Config files
• package.json
• Dependencies

---

DETECT 🔴 BLOCKERS:

1. XSS RISKS
   • dangerouslySetInnerHTML usage
   • unsanitized user input
   • HTML injection

---

2. UNSAFE RENDERING
   • Rendering raw content
   • Unescaped strings

---

3. PROTOTYPE POLLUTION
   • Object.assign misuse
   • Deep merge without guards

---

4. DEPENDENCY VULNERABILITIES
   • Outdated packages
   • Known CVEs

---

5. SSR ISSUES
   • window/document usage without guards
   • leaking env variables

---

6. DATA EXPOSURE
   • secrets in code
   • API keys
   • tokens

---

7. EVENT / PROP INJECTION
   • unsafe prop spreading
   • uncontrolled inputs

---

8. DOS / PERFORMANCE ATTACKS
   • unbounded loops
   • heavy re-renders
   • large lists without virtualization

---

9. CONFIG ISSUES
   • insecure headers
   • missing CSP
   • weak CORS

---

━━━━━━━━━━━━━━━━━━━━━━
PHASE 2 — AUTO FIX (MANDATORY)
━━━━━━━━━━━━━━━━━━━━━━

Fix ALL 🔴 issues:

---

1. XSS PROTECTION

• Sanitize all dynamic HTML
• Remove unsafe innerHTML where possible
• Escape user input

---

2. SAFE RENDERING

• Enforce safe JSX rendering
• No raw HTML injection

---

3. INPUT VALIDATION

• Validate ALL external inputs
• Add type guards

---

4. DEPENDENCY SECURITY

• Upgrade vulnerable packages
• Remove unsafe dependencies

---

5. SSR SAFETY

• Add guards:
typeof window !== "undefined"

• Prevent server/client mismatch leaks

---

6. SECRET HANDLING

• Remove secrets from code
• Use env variables properly

---

7. PROP SAFETY

• Avoid spreading unknown props
• Validate props before use

---

8. PERFORMANCE HARDENING

• Prevent DoS patterns
• Add limits where needed

---

9. SECURITY HEADERS

Add or enforce:

• Content-Security-Policy (CSP)
• X-Frame-Options
• X-Content-Type-Options
• Referrer-Policy

---

━━━━━━━━━━━━━━━━━━━━━━
PHASE 3 — HARDENING
━━━━━━━━━━━━━━━━━━━━━━

Apply advanced protections:

• Strict CSP (no unsafe-inline)
• Sanitize markdown rendering
• Freeze objects where needed
• Prevent mutation leaks

---

━━━━━━━━━━━━━━━━━━━━━━
PHASE 4 — VALIDATION
━━━━━━━━━━━━━━━━━━━━━━

FAIL if:

• Any XSS vector exists
• Any vulnerable dependency remains
• Any unsafe rendering exists
• Any secrets exposed
• Missing security headers

---

━━━━━━━━━━━━━━━━━━━━━━
OUTPUT FORMAT
━━━━━━━━━━━━━━━━━━━━━━

A. VULNERABILITY REPORT
• Type
• Severity
• Location

---

B. FIX SUMMARY
• What was fixed
• Files modified

---

C. HARDENING MEASURES
• Security improvements added

---

D. FINAL STATUS

Security: SECURE / NOT SECURE
Confidence: HIGH / MEDIUM / LOW

---

━━━━━━━━━━━━━━━━━━━━━━
STRICT RULES
━━━━━━━━━━━━━━━━━━━━━━

• Default assumption: system is vulnerable
• DO NOT skip any file
• DO NOT leave partial fixes
• DO NOT ignore low-level risks

---

FINAL GOAL:

A production-grade, security-hardened system that is:

• Safe for public usage
• Safe for open-source distribution
• Resistant to common attack vectors
• Following modern security best practices
