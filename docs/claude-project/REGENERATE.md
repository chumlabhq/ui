You're writing the knowledge base for a Claude.ai Project about this repo (Chumlab, @chumlab/ui). A separate Claude with NO repo access will read these files to plan work, triage defects, review your reports and write prompts for you. It knows only what you write. Accuracy beats coverage.

## Rules

- Write only under `docs/claude-project/`. Modify nothing else. No git operations.
- Docs-only task. Do not run test suites, the e2e matrix, or builds. Read files and run cheap read-only commands (wc, ls, grep, node scripts in `--check` mode that write nothing). If a number needs a build to measure, take it from the latest record file and name that file and its date.
- Re-derive every number from the tree as it is now. Do not trust numbers quoted in older docs without checking them against the record or code they describe.
- Every factual claim cites a path, plus a line when it's specific. Anything you cannot verify gets marked `UNVERIFIED`.
- Condense. Do not paste source docs. Each file should be under ~5,000 words, and the total under ~40,000. Use tables where they help. Write for someone expert in React who has never seen this repo.
- Check whether `docs/claude-project/` would ship in the npm package (package.json `files`, .npmignore, `npm pack --dry-run` file list). Report the answer. Don't edit to fix it.

## Files to write

Put a header on every file with: snapshot date, branch, HEAD short hash.

- **00-INDEX.md**
  - One line per file: what it covers and when to read it.
  - A "start here" order for a new reader.

- **01-product.md**
  - What Chumlab is and who it's for.
  - All 30 components by group, each with a one-line purpose and its exported sub-components.
  - Package facts: name, version, the exports map, peer deps and supported ranges, React versions.
  - Publish status.
  - Positioning against Radix, shadcn, Ark and MUI, only as the repo's own docs state it.
  - What is explicitly unsupported (RTL, anything else).
  - Recorded roadmap: RTL 1.1 plan, playground return, Table split, anything else in the docs.

- **02-architecture.md**
  - Directory map, 2 to 3 levels deep, with purpose.
  - A component folder's anatomy: which files, and which are generated vs hand-written.
  - The `.cl-s` marker and custom JSX runtime.
  - `cn` vs `scopedCn`, plus `composeClasses`, `classLayers`, `structuralOnly` and `motionSafe`.
  - The token and stylesheet pipeline: generated tokens.css, `@layer chumlab.tokens`, build-styles.mjs, keyframes.css.
  - Shared primitives and hooks: MenuSurface, useAnchoredPosition, LAYERS, useHydrated, useControllableState, useLazyComponent, useAccessibleNameWarning, useControlledSwitchWarning, and any others.
  - The SSR and hydration approach.
  - Lazy chunks.
  - `dist/` vs `dist-site/`, and the ownership manifests in scripts/.owned/.
  - A `scripts/` inventory, one line each.

- **03-api-conventions.md**
  - Prop conventions.
  - Controlled vs uncontrolled, and onValueChange naming (including Switch reporting `checked`).
  - Styling semantics: `className` merges, `classes` composes, `unstyled` strips.
  - The ADR 002 slot vocabulary in summary, and where the full ledger lives.
  - The R4 `data-*` state attributes.
  - asChild/Slot, ref forwarding, sub-component patterns, dev-only warnings.
  - A checklist for adding a prop, a slot, a state or a whole component, derived from what the gates, schemas, .ai.md, fixtures and docs generator actually require.

- **04-styling-and-tokens.md**
  - Token groups and their purposes. Include values only for contrast-critical tokens.
  - The light/dark model: which theme is the default and how to opt in.
  - The enumerated allowed `dark:` list.
  - Contrast rules and the tokens that exist for them: --cl-on-accent, --cl-accent-hover, --cl-bg-skeleton and others.
  - How a consumer themes and overrides.
  - What Tailwind setup a consumer needs.
  - Pitfalls in demo-page overrides.

- **05-accessibility.md**
  - The WCAG 2.2 AA target.
  - Each gated criterion and the gate that checks it.
  - The ACCESSIBILITY.md conformance split, and what is Partial or No and why.
  - The keyboard model per component family.
  - The accessible-name warning mechanism.
  - The RTL status.

- **06-testing-and-gates.md**
  - Every npm script that verifies something, as a table: command, what it proves, what it cannot see, typical runtime, whether it has a self-check.
  - Test tiers: unit, contracts, fixtures, e2e projects, a11y-full, visual, consumer matrix, SSR record.
  - The gate-scoping rule from CLAUDE.md.
  - Gate order dependencies, e.g. site build → build:lib → vitest.
  - Matrix mechanics: the fingerprint, .matrix-state.json, the memory/swap instrumentation, failure.md and non-passes.log.
  - Every ratchet and record (bundle history, fixture gap, dark variants, etc.), and how to update each one legitimately.

- **07-docs-site-and-snippets.md**
  - How component pages are generated: .ai.md, schema.json, build-component-docs, build-demo-snippets, and the snippet typecheck and floor.
  - llms.txt and llms-full.txt.
  - Guide pages and verify:guide-claims.
  - Demo page conventions: sections, Show code, DemoLabel, per-section state.
  - Site routes.
  - Where the site deploys from. If unknown, say so.

- **08-adrs-and-decisions.md**
  - Each ADR: decision, date, status, consequence.
  - Notable decisions recorded outside ADRs, in CHANGELOG, RELEASE-READINESS and CLAUDE.md. Examples: classes composes instead of replacing, the Firefox waiver removed, RTL deferred, publishing 0.1.0 to latest rather than as an rc.

- **09-current-state.md**
  - Release status as RELEASE-READINESS states it.
  - Current bundle totals and declared breaches.
  - Test counts, coverage, the fingerprint.
  - The verified defect appendix below.
  - Which of the 30 component pages have had no manual pass yet. Accordion, Avatar, Breadcrumb, Button, Checkbox, CountryFlag, Tooltip, Toast, Input, TabPanel, Stepper, Drawer, Modal, Pagination and Slider have been looked at.
  - The remaining pre-publish steps and the known risks.

- **10-lessons.md**
  - The recurring failure patterns in this repo's history, written as rules for future work, each with one concrete example and a path.
  - Sources: GATE-HONESTY.md, E2E-TRIAGE.md, RELEASE-READINESS §6, CLAUDE.md, commit messages.

- **11-components.md**
  - One table row per component: group, sub-components, shape class, exclusive bundle KB against its ceiling, classes slot count, fixture count, known caveats.
  - Then 3 to 6 lines per component on anything non-obvious.

- **12-workflow.md**
  - How sessions run, per CLAUDE.md: slice size, which gates to run, what a report must contain, what the agent may not do.
  - Commit message conventions, from `git log`.
  - How the release is cut.

## Appendix: manual-pass defects to verify for 09-current-state.md

These were logged by eye on the running site, and some may already be fixed. For each one, read the relevant component and demo source and record one of:

- `FIXED`: cite the code or commit.
- `OPEN`: cite the responsible code if you can find it.
- `NEEDS-EYE`: the code cannot settle it.

Do not fix anything.

**Cross-cutting**

- Many demo sections have no "Show code". List every section without one, with the reason the generator skipped it.
- Demo JSX and generated snippets use raw HTML where a Chumlab component exists, e.g. Input's Login Form checkbox and buttons, and Drawer's Initial Focus snippet.
- Some snippets are incomplete, e.g. Drawer's Form Drawer snippet stops at the trigger.
- Interactive controls are missing cursor:pointer, e.g. Drawer's close button and Slider's mark dots.
- Error and success states fill the field background instead of colouring only the border and message, e.g. Input's Validation, Live Validation and Registration Form sections. Check every component with these states.
- Doc-page structure is inconsistent across the 30: section set, order, depth, and whether every prop, attribute, slot and data attribute is documented. Anatomy is missing on composing components.
- Descriptions are empty in classes, shape and context tables: 351 of 395 were outstanding.
- Decided earlier but possibly not done:
  - Dropdown/disabled and Slider/disabled paint identically to enabled.
  - Input/error and OtpInput/error colour only the message.
  - The DatePicker demo opens itself on landing, its sections share state, and some sections are not wired to the prop they demonstrate.

**Breadcrumb**

- Per-Item Click Handlers shows "Clicked: Dropdown closed".
- In the Tooltips section, the last item's icon is on the right.
- Icon Size shows no icon.
- Pill Style shows no visible difference.
- In the Combined section, a tooltip is visible without hover.

**Button**

- Animate Both Icons does not animate.
- Always Sliding and Always Pulsing do not run.
- Sizes sm, md and lg render at the same height.

**Tooltip**

- The arrow is detached on right placement.
- The Dark theme arrow is light.
- Gradient arrows are a flat colour.
- Shadow presets none through 2xl look identical.
- Soft Elevated and Sharp Drop look identical.
- The Trigger Display block text is near-invisible in dark.

**Toast**

- Alternative triggers render as bare text in these sections:
  - Duration: Persistent
  - Progress Bar: Without
  - Custom Progress Color: all three
  - Close Button: Without
  - Pause: No Pause
  - Escape: Without
  - Position: the unselected options
  - Generic toast(): both
- The gradient progress bar is flat.
- The Position button stretches full width.
- Animation Duration and Container Aria Label have no demo.

**Input**

- The onValueChange readout stays at "".
- InputLabel Standalone's "Custom Layout" is not custom.
- Custom Themes fields are bulky, and Underline has a full border.
- The Login and Registration form containers are full width.

**TabPanel**

- Count badges have no background.

**Stepper**

- The keyboard loop shows two steps marked at once.
- The Validate step stays on the error icon in both icon-override sections.
- Full Width steps are not clickable.
- Audit state wiring across Stepper, TabPanel and Switch.

**Drawer**

- Blur Overlay shows no blur by eye, although a measurement said blur(8px). Explain the contradiction.
- Swipeable drawers drag on hover with no button held, and the page lags.
- Pointer users need a grab-handle drag affordance.
- The bottom sheet shows two grab handles.

**Modal**

- The Project Settings Notifications switch is a blue blob.
- Initial Focus reportedly lands on Email, not Name.
- Custom Close Icon is identical to the default.
- The Ref Forwarding focus button does nothing.

**Pagination**

- No section shows a selected state.
- The Ref Forwarding buttons do nothing.
- onValueChange has no readout.

**Slider**

- In Basic Usage the unfilled track is invisible.
- Mark labels are cluttered in all five mark examples and in Click-to-Jump.

**Site**

- `/faq#slug` does not open the linked question.
- The Loader Circular-Colors snippet collapses every colour to text-cl-accent.
- The host-level 404 rule is blocked because the deploy target is unknown.

## Finish

1. Save this entire prompt verbatim as `docs/claude-project/REGENERATE.md`.
2. Report:
   - files written, with word counts
   - everything marked UNVERIFIED
   - every contradiction you found between the repo's docs (RELEASE-READINESS, ACCESSIBILITY, ADRs, CLAUDE.md, README) and the code
   - the defect appendix tally: FIXED / OPEN / NEEDS-EYE
   - whether the folder ships in the package
