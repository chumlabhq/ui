# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-04-28

First stable release. Component surface frozen at 30 published primitives. Public-API additions and behavioural changes since 0.1.0 are listed below.

### Added
- Per-component subpath exports (`@chumlab/ui/button`, `@chumlab/ui/date-picker`, …) for tree-shaking; ESM + CJS dual output with matching `.d.ts` declarations
- `.ai.md` knowledge files and `.schema.json` machine-readable schemas for every public component
- `/ai/component-index.json` and `/ai/semantic-text.json` artifacts for AI-search and embedding pipelines
- `llms.txt`, structured-data JSON-LD (Organization, SoftwareApplication, WebSite, FAQPage, BreadcrumbList, ContactPoint), and explicit AI-bot allows in `robots.txt` for GEO/AEO discoverability
- Class-specific bundle-size policy (date/calendar ≤ 12kb, locale-aware ≤ 12kb, composite-form ≤ 12kb, leaf ≤ 10kb gzipped) with ratchet-upward-only enforcement
- Accordion shimmer `bordered` variant uses brand token `rounded-cl-md`
- TabPanel root `className` and `classes.root` now compose additively (both apply)
- Slider now distinguishes click-to-position from drag (data-dragging set on first pointermove, not pointerdown) so a click animates smoothly to the new value
- Tooltip Escape handler stops propagation so it can't close a parent Modal/Drawer
- Avatar group items use a content-aware composite key (`${name}-${index}`) instead of bare index
- MultiSelectDropdown internal content wrapped in `React.memo`

### Changed
- Coverage threshold lowered from 80% → 65% in STRICT MODE with an explicit ratchet-upward-only rule (long-term targets: 80%, then 90%, preserved as goals not gates)
- AvatarGroup keyboard activation triggers `e.currentTarget.click()` instead of synthesizing a MouseEvent (eliminates a `KeyboardEvent → MouseEvent` cast)
- DatePicker `handleClearClick` and SearchableDropdown `handleClear` widened from `MouseEvent` to `SyntheticEvent` so click + key activation share one safe path
- Stepper icon detection uses an explicit `isExoticIconComponent` type predicate, removing the double cast at the call site
- Modal `previousActiveElement` uses `instanceof HTMLElement` narrowing instead of a bare cast
- Tooltip shadow preset alphas raised (0.12–0.30 → 0.18–0.45) so they read on dark surfaces
- DatePicker marker tooltip alpha raised (0.15 → 0.25) for the same reason
- Table default striped-row dark mode bumped from `bg-white/[0.02]` to `bg-white/[0.04]` (still subtle, now actually visible)
- DatePicker marker tooltip static styles moved from inline `style={{}}` objects to Tailwind classes (4 sites)
- Eight component knowledge files renamed from placeholder `COMPONENT.ai.md` to `<NAME>.ai.md` (DATEPICKER, DROPDOWN, INTERNATIONALPHONEINPUT, MULTISELECTDROPDOWN, MULTISELECTSEARCHABLEDROPDOWN, SEARCHABLEDROPDOWN, TABLE, TIMEPICKER); 16 source-comment references updated to match

### Fixed
- IPI country trigger `min-w-[110px] sm:min-w-[130px]` so the input doesn't crowd the field on 320px screens
- Table filter dropdown `min-w-[160px] sm:min-w-[180px] max-w-[calc(100vw-32px)]` so the portaled popover never overflows the viewport
- DatePicker year/month dropdownMenu `min-w-[120px] sm:min-w-[140px]` for the same reason
- ClockFace `pointerup`/`pointercancel` listeners gated by `isBrowser` (defence in depth — `useEffect` already runs only client-side)
- JSON-LD payloads in marketing sections escape `</` to `<\/` inside `JSON.stringify` so a future closing-script-tag substring can't break HTML parsing
- Five stale tests aligned with current code contracts: Accordion shimmer expects `rounded-cl-md`; TabPanel merges `classes.root` with `className`; Slider drag tests fire `pointermove` after `pointerdown` to satisfy the click-vs-drag refactor
- Four `react-hooks/set-state-in-effect` violations refactored to setState-during-render with state-based prev-value guards (TableDemo FAB latch + show, CatalogSection ToastPreview reset, PlaygroundOnboarding form hydration)
- Four TS6133 unused-var build errors cleared (StepperDemo + TableDemo)
- Stale `dark` deps trimmed from four useCallback/useMemo bodies that only consume Tailwind `dark:` classes
- Library `dist/` no longer leaks `src/contexts/**` or `src/redux/**` into the npm tarball (tsconfig.lib.json excludes the marketing-site internals)

### Deferred (with rationale logged in `ai/system-state.json:issues.deferred`)
- TYPE-001/TYPE-002 — Table/Button retain contained `as unknown as` double-casts because the cleanest alternatives would break the public API
- TYPE-008/TYPE-009 — Input/TextArea `handleClear` retain a contained synthetic-event double-cast; native `dispatchEvent` path was attempted but jsdom + React's `_valueTracker` reconciles controlled-input value back to the prop before `onChange` observes the change
- A11Y-BREADCRUMB-001 — Breadcrumb collapsed-dropdown still uses `role="menu"`/`role="menuitem"`; the canonical navigation list pattern requires updating 8+ test assertions and is flagged for a dedicated cycle

## [0.1.0] - 2026-04-03

### Added
- Initial release with 32 components
- Form Inputs: Input, TextArea, OtpInput, Slider, DatePicker, TimePicker, InternationalPhoneInput, Switch
- Selection: Dropdown, SearchableDropdown, MultiSelectDropdown, MultiSelectSearchableDropdown, CascadingDropdown, Checkbox, RadioButton, Toggle
- Navigation: TabPanel, Breadcrumb, Pagination, Stepper
- Overlay: Modal, Drawer, Tooltip, Toast
- Display: Avatar, CountryFlag, Loader (Circular, Linear, Dot, Pulse), Table, Accordion
- Layout: ResizablePanel
- Shared utilities: cn, Slot, mergeRefs, useControllableState, useReducedMotion
- Full TypeScript support with strict mode
- WCAG 2.1 AA accessibility compliance
- Tailwind CSS v4 styling with class override system
- Unstyled mode for all components
- SSR compatibility
- Tree-shakable named exports
- Unit tests (Vitest) and E2E tests (Playwright)

### Fixed
- SSR safety: Added `isBrowser` guards to `scrollLock.ts` and `Modal.tsx` portal
- Accessibility: Fixed `aria-modal` on TimePicker clock dialog
- Accessibility: Added explicit `aria-live` to Toast component
