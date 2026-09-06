<h1 align="center">Chumlab UI</h1>

<p align="center">
  Production-grade React components. Accessible. Themeable. Zero lock-in.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@chumlab/ui"><img src="https://img.shields.io/npm/v/@chumlab/ui?color=blue&label=npm" alt="npm version" /></a>
  <a href="https://github.com/chumlabhq/ui/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-green" alt="MIT License" /></a>
  <img src="https://img.shields.io/badge/react-18%20%7C%2019-blue" alt="React 18 and 19" />
  <img src="https://img.shields.io/badge/tailwind-v4-blue" alt="Tailwind CSS v4" />
  <img src="https://img.shields.io/badge/typescript-strict-blue" alt="TypeScript" />
</p>

<p align="center">
  <a href="https://chumlab.com">Website</a> &middot;
  <a href="https://chumlab.com/getting-started">Getting Started</a> &middot;
  <a href="https://chumlab.com/accordion">Components</a> &middot;
  <a href="https://chumlab.com/blog">Blog</a> &middot;
  <a href="https://github.com/chumlabhq/ui">GitHub</a>
</p>

---

## What is Chumlab UI?

An open-source React component library with **30 production-ready components** — accessible, fully responsive, and themeable. Built with TypeScript and Tailwind CSS v4. Ships with polished defaults, full dark mode, and zero vendor lock-in.

---

## 30-Second Example

```tsx
import "@chumlab/ui/styles.css";
import { Button, Input, Modal } from "@chumlab/ui";
import { useState } from "react";

export default function App() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Input label="Email" placeholder="you@example.com" clearable />

      <Button
        className="px-4 py-2 rounded-cl-md bg-cl-accent text-cl-on-accent"
        onClick={() => setOpen(true)}
      >
        Open Modal
      </Button>

      <Modal open={open} onOpenChange={setOpen} title="Welcome">
        <p>You're using Chumlab UI.</p>
      </Modal>
    </>
  );
}
```

The `styles.css` import is required — without it the components render unstyled.
It carries the `cl-*` design tokens and the components' own layout rules, so this
works with no Tailwind in your project. It is not a general Tailwind build, so
utilities of your own (`bg-blue-600`, `rounded-lg`) still need Tailwind or your
own CSS.

---

## Why Chumlab UI?

| Feature                         | Chumlab UI                | MUI / Ant Design  | Radix / Headless UI |
| ------------------------------- | ------------------------- | ------------------ | ------------------- |
| Polished defaults               | Yes                       | Yes (opinionated)  | No (headless)       |
| Fully unstyled mode             | Yes                       | No                 | Yes                 |
| Per-element `classes` overrides | Yes                       | Theme overrides    | BYO                 |
| Runtime CSS-in-JS               | None                      | Yes (Emotion)      | None                |
| Dark mode                       | Design tokens, no provider | Theme provider     | BYO                 |
| Responsive (320px+)             | Yes, mobile-first         | Partial            | BYO                 |
| SSR safe                        | Yes                       | Yes                | Yes                 |
| Accessibility                   | [WCAG 2.2 AA, per criterion](ACCESSIBILITY.md) | Partial            | Strong              |
| Tree-shakeable                  | Yes                       | Large bundle       | Yes                 |

**The sweet spot:** production-ready defaults with full escape hatches. Ship fast, then customize any element when your design system demands it.

**On accessibility:** the target is WCAG 2.2 Level AA, and
[`ACCESSIBILITY.md`](ACCESSIBILITY.md) records every Level A and AA criterion with a status,
a justification and the test that holds it. A criterion is only marked as supported when a
test fails if the behaviour regresses, so the document names several criteria the package
does not yet claim — including three it is known to fail. Read it rather than this table if
conformance matters to you.

---

## Installation

```bash
npm install @chumlab/ui
```

Then import the stylesheet:

```js
import "@chumlab/ui/styles.css";
```

That is the whole setup. `styles.css` is precompiled — it carries the design
tokens *and* the layout rules the components are built from, so they render
correctly with no Tailwind in your project. It contains no CSS reset, so your
own page styling is untouched.

### Using Tailwind yourself

If your project already runs Tailwind and you would rather it generate the
utilities (so they dedupe against your own), import the tokens instead and point
Tailwind at the package:

```css
@import "tailwindcss";
@import "@chumlab/ui/tokens.css";

@source "../node_modules/@chumlab/ui/dist";
```

The `@source` path is resolved **relative to the CSS file** — the example assumes
the common layout with your stylesheet in `src/`. Import one or the other, not
both.

### Peer dependencies

| Package | Required | Notes |
|---------|----------|-------|
| `react` 18 or 19 | Yes | |
| `react-dom` 18 or 19 | Yes | |
| `@tanstack/react-table` ^8 | Only for Table | Declared optional; npm will not install it for you |
| `date-fns` ^4 | Only for DatePicker | Declared optional; npm will not install it for you |

The last two are marked `optional` in `peerDependenciesMeta`, so an app that imports neither
Table nor DatePicker installs neither. Import from the subpaths to keep it that way — the
root barrel re-exports every component, so it pulls both chunks in whether you render them
or not.

---

## Import

```tsx
// Full library
import { Button, Modal, Table } from "@chumlab/ui";

// Per-component (recommended — only ships what you use)
import { Button } from "@chumlab/ui/button";
import { Modal } from "@chumlab/ui/modal";
import { Table } from "@chumlab/ui/table";
```

---

## Components

### Form

| Component                                                                | What it does                                                         |
| ------------------------------------------------------------------------ | -------------------------------------------------------------------- |
| [Button](https://chumlab.com/button)                                     | Polymorphic (button/a/span/asChild), loading states, icon animations |
| [Input](https://chumlab.com/input)                                       | Prefix/suffix, icons, clearable, character count                     |
| [TextArea](https://chumlab.com/text-area)                                | Auto-resize, character count                                         |
| [Checkbox](https://chumlab.com/checkbox)                                 | Checked, unchecked, indeterminate                                    |
| [RadioButton](https://chumlab.com/radio-button)                          | Radio group, horizontal/vertical                                     |
| [Switch](https://chumlab.com/switch)                                     | Toggle with icons and loading                                        |
| [Slider](https://chumlab.com/slider)                                     | Single/dual thumbs, marks, tooltips                                  |
| [OtpInput](https://chumlab.com/otp-input)                                | Grouping, paste support, auto-advance                                |
| [DatePicker](https://chumlab.com/date-picker)                            | Single, range, multi-date, presets, markers                          |
| [TimePicker](https://chumlab.com/time-picker)                            | Dropdown list or analog clock face                                   |
| [InternationalPhoneInput](https://chumlab.com/international-phone-input) | Country selector, formatting, validation                             |

### Selection

| Component                                                                             | What it does                         |
| ------------------------------------------------------------------------------------- | ------------------------------------ |
| [Dropdown](https://chumlab.com/dropdown)                                              | Single-select, async loading, portal |
| [SearchableDropdown](https://chumlab.com/searchable-dropdown)                         | Search + single-select, async        |
| [MultiSelectDropdown](https://chumlab.com/multi-select-dropdown)                      | Chips, checkboxes, async             |
| [MultiSelectSearchableDropdown](https://chumlab.com/multi-select-searchable-dropdown) | Search + multi-select                |
| [CascadingDropdown](https://chumlab.com/cascading-dropdown)                           | Multi-level nested submenus          |

### Layout & Navigation

| Component                                             | What it does                                                                          |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------- |
| [Accordion](https://chumlab.com/accordion)            | Expandable sections, single/multiple modes                                            |
| [TabPanel](https://chumlab.com/tab-panel)             | Tabbed content, horizontal/vertical                                                   |
| [Table](https://chumlab.com/table)                    | Sorting, filtering, selection, pinning, inline editing, infinite scroll (TanStack v8) |
| [ResizablePanel](https://chumlab.com/resizable-panel) | Draggable split panels                                                                |
| [Breadcrumb](https://chumlab.com/breadcrumb)          | Navigation trail with overflow dropdown                                               |
| [Pagination](https://chumlab.com/pagination)          | Page controls, rows-per-page selector                                                 |
| [Stepper](https://chumlab.com/stepper)                | Multi-step progress (numbered/icon/dot)                                               |

### Overlay

| Component                              | What it does                                         |
| -------------------------------------- | ---------------------------------------------------- |
| [Modal](https://chumlab.com/modal)     | Focus trap, nesting, scroll lock                     |
| [Drawer](https://chumlab.com/drawer)   | Slide-out from any edge, swipe gestures, snap points |
| [Tooltip](https://chumlab.com/tooltip) | Arrow, truncation detection, rich content            |
| [Toast](https://chumlab.com/toast)     | Auto-dismiss, progress bar, action buttons           |

### Display

| Component                                       | What it does                                    |
| ----------------------------------------------- | ----------------------------------------------- |
| [Avatar](https://chumlab.com/avatar)            | Image/initials/fallback, status, badges, groups |
| [CountryFlag](https://chumlab.com/country-flag) | SVG flags from ISO codes                        |
| [Loader](https://chumlab.com/loader)            | Circular, linear, dot, pulse variants           |

---

## Styling

### Override any element

```tsx
<Dropdown
  options={options}
  classes={{
    trigger: "border-2 border-indigo-500 rounded-xl",
    content: "shadow-2xl",
    option: "px-4 py-3",
    optionSelected: "bg-indigo-100 font-bold",
  }}
/>
```

### Go fully unstyled

Every component takes an `unstyled` prop that drops its default classes while
keeping the behaviour, ARIA wiring, and keyboard handling:

```tsx
<Dropdown options={options} unstyled classes={{ trigger: "my-trigger", option: "my-option" }} />
```

Every component also ships a ready-made empty class map, exported from its own
subpath, if you would rather start from the slot names:

```tsx
import { Dropdown, UNSTYLED_DROPDOWN_CLASSES } from "@chumlab/ui/dropdown";

<Dropdown options={options} classes={UNSTYLED_DROPDOWN_CLASSES} />;
```

`DEFAULT_*_CLASSES` is exported the same way if you want to extend the defaults
rather than replace them.

### Target states with CSS

```css
[data-state="open"] {
  /* dropdown is open */
}
[data-selected] {
  /* option is selected */
}
[data-disabled] {
  /* element is disabled */
}
[data-error] {
  /* validation error */
}
```

---

## Controlled & Uncontrolled

Every component that owns state supports both. Omit the value prop and the component keeps
its own; pass it with `onValueChange` and you own it.

```tsx
// Uncontrolled — component manages state
<Input defaultValue="hello" />

// Controlled — you own the state
<Input value={text} onValueChange={setText} />
```

21 components take an explicit `default*` seed (`defaultValue`, `defaultOpen`,
`defaultChecked`); Input and TextArea inherit `defaultValue` from the native element.
Table is the exception: its `sorting`, `globalFilter` and `selectedRowIds` can be
controlled or left to the component, but there is no `default*` prop to seed them with.

---

## Dark Mode

Dark is the default. To opt into light, set either switch on `<html>`:

```html
<html class="light">          <!-- or -->
<html data-theme="light">
```

Both are honoured, and both drive the design tokens and the components' own
`dark:` styles together — so they can never disagree. `class="dark"` /
`data-theme="dark"` are accepted too if you prefer to be explicit.

No theme provider, no configuration, no extra imports.

---

## Accessibility

[`ACCESSIBILITY.md`](ACCESSIBILITY.md) is the document to read: it records every WCAG 2.2
Level A and AA criterion with a status, a justification, and the test that holds it —
including the ones this package does not claim, and the three it is known to fail.

The behaviours below are the ones with a contract test behind them, named so you can check:

| | Held by |
|---|---|
| ARIA relationships point at elements that exist | `aria-relationships.contract` |
| Every interactive element is keyboard reachable | `keyboard-reachable.contract` |
| Arrow-key roving focus in menus, tabs and the calendar grid | `roving-focus.contract` |
| Focus trapped and restored in Modal and Drawer | `overlay-focus.contract` |
| Status and error messages are announced | `status-messages.contract` |
| `prefers-reduced-motion` is honoured — and motion exists when it is not set | `reduced-motion.contract` |
| Text contrast meets the AA ratio in both themes | `contrast.contract` |

"WAI-ARIA 1.2" is not claimed as a conformance statement; the contracts above test specific
behaviours, not the whole specification.

### Right-to-left is not supported

`dir="rtl"` is not supported in 0.1.0. The components render, and nothing is lost off the
edge of the screen — every floating surface is still clamped into the viewport — but nothing
mirrors: a menu opens from the left of its trigger in both directions, a submenu opens to the
right in both, and a Slider fills from the left in both. Spacing, text alignment and icon
direction are written physically (`pl-*`, `text-left`, a chevron that points right), so they
do not mirror either.

It is measured rather than assumed: `e2e/rtl.spec.ts` renders fourteen `dir="rtl"` fixtures
and carries the measurement for each surface in its skip reason. RTL is a 1.1 feature, and
`ACCESSIBILITY.md` records the order the work has to be done in.

---

## Utilities

| Export                      | Description                                          |
| --------------------------- | ---------------------------------------------------- |
| `cn`                        | Tailwind-aware class merging (clsx + tailwind-merge). Merges your classes only — it adds nothing of the library's own, so it is safe to use on your own markup. |
| `Slot`                      | Composition primitive for `asChild` pattern          |
| `mergeRefs`                 | Combine multiple React refs                          |
| `useControllableState`      | Dual controlled/uncontrolled state hook              |
| `useReducedMotion`          | Respects `prefers-reduced-motion`                    |
| `useIsomorphicLayoutEffect` | SSR safe `useLayoutEffect`                           |
| `SR_ONLY_STYLE`             | Screen-reader-only inline styles                     |
| `copyToClipboard`           | `(text) => Promise<boolean>` — clipboard write with a success flag |
| `isInteractiveElement`      | `(target) => boolean` — is an event target a control? |
| `exportTableToCSV`          | `(data, columns, filename?)` — download table rows as CSV |
| `getColumnId`               | Resolve a TanStack column's id from its definition    |
| `getSortDirection`          | Map a sort state to an `aria-sort` value              |
| `useModal` / `useToast` / `useTimePicker` | Hooks powering Modal, Toast and TimePicker |

---

## Supported runtimes

| | Supported | How it is checked |
|---|---|---|
| React | 18 and 19 | Both majors build and typecheck against the packed tarball in the consumer matrix |
| React DOM | 18 and 19 | As above |
| Node | >= 18 | The `engines` floor. Only the current LTS is exercised in CI |
| TypeScript | 5.x, `bundler` / `node16` / node10 resolution | `attw` checks all three against the tarball on every build |

React 17 is not supported: the components use the automatic JSX runtime and
`useSyncExternalStore`.

### Browsers

| Engine                 | How it is checked |
| ---------------------- | ----------------- |
| Chromium (Chrome, Edge) | Full e2e suite, every release |
| Firefox                | Full e2e suite, every release |
| WebKit (Safari)        | Full e2e suite, every release |
| Mobile Chrome (Pixel 7) | Full e2e suite, every release |
| Mobile Safari (iPhone 14) | Full e2e suite, every release |

Those are the five Playwright projects the release matrix runs, at the engine version
Playwright ships. "Latest two versions" is the intent, but only one version of each engine
is actually exercised, so it is not claimed here.

Layout is verified at 320, 375, 768, 1024, 1440 and 1920 px in both themes, against
recorded screenshots.

---

## Development

```bash
git clone https://github.com/chumlabhq/ui.git && cd ui && npm install
npm run dev            # Dev server at localhost:5173
npm run test:run       # Unit and contract tests (Vitest, 4,409)
npm run test:e2e       # E2E, Chromium only (Playwright, 419)
npm run test:e2e:all   # The five-engine matrix
npm run verify:consumers  # Installs the packed tarball into five framework apps
npm run build:lib      # Build library
```

---

## Project documents

| | |
|---|---|
| [CHANGELOG.md](CHANGELOG.md) | What changed, including the behavioural changes made before the first release |
| [VERSIONING.md](VERSIONING.md) | What counts as public API, and which changes are major, minor or patch |
| [ACCESSIBILITY.md](ACCESSIBILITY.md) | Every WCAG 2.2 Level A and AA criterion, with a status and the test that holds it |
| [SECURITY.md](https://github.com/chumlabhq/ui/blob/main/SECURITY.md) | How to report a vulnerability |

---

## Contributing

1. Fork the repo
2. Create your branch (`git checkout -b feat/my-feature`)
3. Make changes and run `npm run test:run && npm run typecheck`
4. Open a pull request

---

## FAQ

**Does it work with Next.js?**
Yes — App Router and Pages Router, and React Router 7 in SSR mode. The interactive
components ship with `"use client"`, so you can import them straight into a Server
Component. Import `@chumlab/ui/styles.css` once in your root layout.

This is checked rather than assumed: `npm run verify:consumers` packs the library, installs
the tarball into throwaway apps for Vite (React 18 and 19), both Next.js routers and React
Router 7, and fails if any of them will not build or will not server-render.

**Can I use it without Tailwind CSS?**
Yes — that is the default path. `import "@chumlab/ui/styles.css"` is precompiled
and needs no Tailwind. If you want to drop the styling entirely and supply your
own, use the `unstyled` prop or the `UNSTYLED_*_CLASSES` constants.

**How do I report a bug?**
Open an issue on [GitHub](https://github.com/chumlabhq/ui/issues).

---

## License

[MIT](LICENSE) &copy; 2025-2026 Chumlab

---

<p align="center">
  Built by <a href="https://chumlab.com">Chumlab</a> &middot;
  <a href="mailto:hello@chumlab.com">hello@chumlab.com</a>
</p>
