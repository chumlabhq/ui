<h1 align="center">Chumlab UI</h1>

<p align="center">
  Production-grade React components. Accessible. Themeable. Zero lock-in.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@chumlab/ui"><img src="https://img.shields.io/npm/v/@chumlab/ui?color=blue&label=npm" alt="npm version" /></a>
  <a href="https://github.com/chumlabhq/ui/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-green" alt="MIT License" /></a>
  <img src="https://img.shields.io/badge/react-18%2B-blue" alt="React 18+" />
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
import { Button, Input, Modal } from "@chumlab/ui";
import { useState } from "react";

export default function App() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Input label="Email" placeholder="you@example.com" clearable />

      <Button
        className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg"
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

---

## Why Chumlab UI?

| Feature                         | Chumlab UI                | MUI / Ant Design  | Radix / Headless UI |
| ------------------------------- | ------------------------- | ------------------ | ------------------- |
| Polished defaults               | Yes                       | Yes (opinionated)  | No (headless)       |
| Fully unstyled mode             | Yes                       | No                 | Yes                 |
| Per-element `classes` overrides | Yes                       | Theme overrides    | BYO                 |
| Runtime CSS-in-JS               | None                      | Yes (Emotion)      | None                |
| Dark mode                       | Built-in `dark:` variants | Theme provider     | BYO                 |
| Responsive (320px+)             | Yes, mobile-first         | Partial            | BYO                 |
| SSR safe                        | Yes                       | Yes                | Yes                 |
| Accessibility                   | WCAG 2.1 AA               | Partial            | Strong              |
| Tree-shakeable                  | Yes                       | Large bundle       | Yes                 |

**The sweet spot:** production-ready defaults with full escape hatches. Ship fast, then customize any element when your design system demands it.

---

## Installation

### Via NPM (recommended)

```bash
npm install @chumlab/ui
```

Add the library to your Tailwind CSS content sources so its classes are included in your build:

```css
@import "tailwindcss";

@source "../node_modules/@chumlab/ui/dist/**/*.js";
```

Add the `@source` line right below your existing `@import "tailwindcss"` — typically in `app.css`, `globals.css`, or `index.css`.

### Via CDN

For quick prototyping, include the stylesheet and script directly:

```html
<link
  href="https://cdn.jsdelivr.net/npm/@chumlab/ui@0.1.0/dist/style.css"
  rel="stylesheet"
/>

<script
  src="https://cdn.jsdelivr.net/npm/@chumlab/ui@0.1.0/dist/index.js"
  type="module"
></script>
```

> **Note:** For production, install via NPM to get tree-shaking, TypeScript types, and subpath imports.

### Peer dependencies

| Package | Required | Notes |
|---------|----------|-------|
| `react` >= 18 | Yes | |
| `react-dom` >= 18 | Yes | |
| `@tanstack/react-table` ^8 | Only for Table | `npm install @tanstack/react-table` |
| `date-fns` ^4 | Only for DatePicker | `npm install date-fns` |

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

```tsx
import { UNSTYLED_DROPDOWN_CLASSES } from "@chumlab/ui";

<Dropdown options={options} classes={UNSTYLED_DROPDOWN_CLASSES} />;
```

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

Every stateful component supports both:

```tsx
// Uncontrolled — component manages state
<Input defaultValue="hello" />

// Controlled — you own the state
<Input value={text} onValueChange={setText} />
```

---

## Dark Mode

Add `class="dark"` to `<html>` — every component adapts automatically:

```html
<html class="dark"></html>
```

No theme provider, no configuration, no extra imports.

---

## Accessibility

Every component ships with:

- ARIA roles and states (WAI-ARIA 1.2)
- Full keyboard navigation (arrows, Tab, Enter, Space, Escape, Home/End)
- Focus trapping and restoration (Modal, Drawer)
- Screen reader announcements (`aria-live`)
- `prefers-reduced-motion` support
- 44px+ touch targets

---

## Utilities

| Export                      | Description                                          |
| --------------------------- | ---------------------------------------------------- |
| `cn`                        | Tailwind-aware class merging (clsx + tailwind-merge) |
| `Slot`                      | Composition primitive for `asChild` pattern          |
| `mergeRefs`                 | Combine multiple React refs                          |
| `useControllableState`      | Dual controlled/uncontrolled state hook              |
| `useReducedMotion`          | Respects `prefers-reduced-motion`                    |
| `useIsomorphicLayoutEffect` | SSR safe `useLayoutEffect`                           |
| `SR_ONLY_STYLE`             | Screen-reader-only inline styles                     |

---

## Browser Support

| Browser                | Versions |
| ---------------------- | -------- |
| Chrome / Edge          | Latest 2 |
| Firefox                | Latest 2 |
| Safari                 | Latest 2 |
| Mobile Chrome / Safari | Latest 2 |

---

## Development

```bash
git clone https://github.com/chumlabhq/ui.git && cd ui && npm install
npm run dev            # Dev server at localhost:5173
npm run test:run       # Unit tests (Vitest, 2992 tests)
npm run test:e2e       # E2E tests (Playwright)
npm run build:lib      # Build library
```

---

## Contributing

1. Fork the repo
2. Create your branch (`git checkout -b feat/my-feature`)
3. Make changes and run `npm run test:run && npx tsc --noEmit`
4. Open a pull request

---

## FAQ

**Does it work with Next.js?**
Yes. Compatible with App Router and Pages Router. Use `"use client"` for interactive components.

**Can I use it without Tailwind CSS?**
Yes. Use the `unstyled` prop or pass `UNSTYLED_*_CLASSES` constants and apply your own CSS.

**How do I report a bug?**
Open an issue on [GitHub](https://github.com/chumlabhq/ui/issues).

---

## License

[MIT](LICENSE) &copy; 2026 Chumlab

---

<p align="center">
  Built by <a href="https://chumlab.com">Chumlab</a> &middot;
  <a href="mailto:hello@chumlab.com">hello@chumlab.com</a>
</p>
