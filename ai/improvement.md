# Self-Improvement Patch — 2026-04-04

## Missed Issues in Initial Audit

1. **Accordion usePrintStyles** — used `typeof document === "undefined"` but was not flagged in initial audit. The SSR consistency scan should check ALL hooks, not just component files.

## Weak Detection Areas

1. **Hook files** — Audit focused on component TSX files but missed utility hooks that also access browser APIs.
2. **Nested utility files** — Should scan `utils/`, `hooks/`, and `components/` subdirectories of each component.

## New Rules to Add

1. **SSR Rule**: Grep for `typeof window`, `typeof document`, `window.`, `document.` across ALL `.ts` and `.tsx` files in `src/`. Every occurrence must either use the shared `isBrowser` utility or be inside a `useEffect` with an `isBrowser` guard.

2. **displayName Rule**: Every component exported from `src/index.ts` MUST have a `.displayName` property. Automate this check.

3. **Export Consistency Rule**: All components should use `export const ComponentName = forwardRef(...)` pattern. No default exports from component files.

## Failure Prevention

- Run `grep -r "typeof document\|typeof window" src/` as a post-fix validation step
- Run `grep -rL "displayName" src/components/*/` to find missing displayNames
- Add these as CI lint rules in future
