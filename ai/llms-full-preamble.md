<!-- Global head of the generated llms-full.txt: install/setup, shared
     conventions, the Common-mistakes block and the selection rubric.
     Edit HERE (not llms-full.txt) and run: npm run build:llms -->

# @chumlab/ui — Full Component Reference

> Production-grade React component library. TypeScript, Tailwind CSS v4, WCAG 2.1 AA.
> This file is optimized for AI coding tools. For human docs, visit https://chumlab.com

Package: @chumlab/ui | React 18+/19 | MIT License
GitHub: https://github.com/chumlabhq/ui

## Install
npm install @chumlab/ui

## Tailwind CSS setup (required)
In your CSS file where you import Tailwind, add:
@source "../node_modules/@chumlab/ui/dist/**/*.js";

## Import patterns
import { Button } from "@chumlab/ui";           // full library (dev only, no tree-shaking)
import { Button } from "@chumlab/ui/button";    // per-component (recommended)

Use the per-component subpath form in production. Kebab-case the component
name: Button → /button, MultiSelectDropdown → /multi-select-dropdown,
InternationalPhoneInput → /international-phone-input.

## Shared patterns
- Controlled: value + onValueChange. Uncontrolled: defaultValue. Never combine both.
- Styling: classes prop overrides per-slot. unstyled strips all defaults. className for root.
- Dark mode: Tailwind dark: variants. Add .dark class to <html>.
- All components are WCAG 2.1 AA, keyboard navigable, screen reader compatible.

## Common mistakes (AVOID these patterns)
- ✗ `error="Required field"` — `error` is a boolean. Use `error errorMessage="Required field"` (two props). Same for `success` + `successMessage`.
- ✗ Passing both `value` and `defaultValue` — pick one (controlled OR uncontrolled), never both.
- ✗ `onChange`, `onSelect`, `onTabChange`, `onPageChange`, `onStepChange`, `onCheckedChange` — the value callback is always `onValueChange`. Open-state callback is always `onOpenChange`.
- ✗ `placement="top"` on Tooltip — use `side="top"`. Drawer uses `direction`, not `side`/`placement`.
- ✗ CascadingDropdown value as a plain string — value is `Record<parentValue, string | string[]>`. Use key `"root"` for top-level (no-children) selections.
- ✗ Stepper `activeStep` / `currentStep` — those don't exist. Use `value` (current index, zero-based).
- ✗ `range` prop on Slider — pass `value={[min, max]}` (tuple) to enable range mode automatically.
- ✗ Forgetting `getRowId` on Table when row data mutates — without it, selection/expansion state drifts after reorder/edit.
- ✗ Reusing one `useState` across multiple component instances with different hardcoded props — clicks in one variant mutate the other's perceived state.
- ✗ Importing React types as runtime values — React types are TYPES, not runtime values. Import them with `import type` or inline `type` — e.g. `import { useState, type FormEvent } from "react"`. Never import FormEvent, ChangeEvent, ReactNode, etc. as runtime imports; it breaks at module load.
- ✗ Leaving callback parameter types implicit — always annotate them. e.g. `onValueChange={(v: string) => …}`, `onChange={(e: ChangeEvent<HTMLInputElement>) => …}`. An un-annotated `(v) =>` fails strict typecheck with implicit-any.
- ✗ Emitting a control with a selected/active state (a chosen dropdown option, an active tab, a checked item) without wiring its selected indicator — verify the checkmark/highlight/active style actually renders; don't ship the control without its selected-state feedback.

## Choosing a selection component
| Use | When |
|-----|------|
| `RadioButton` | 2-6 options, all visible. Faster than opening a dropdown. |
| `Checkbox` | One independent toggle. Multiple checkboxes aren't a multi-select — group them yourself. |
| `Dropdown` | Single value, ≤ ~20 static options, no search needed. |
| `SearchableDropdown` | Single value, many options OR async-loaded options. |
| `MultiSelectDropdown` | Multiple values, ≤ ~20 static options. |
| `MultiSelectSearchableDropdown` | Multiple values, many options OR async search. |
| `CascadingDropdown` | Hierarchical options (Category → Subcategory). Value is a map keyed by parent. |

---
