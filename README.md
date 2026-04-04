<p align="center">
  <img src="src/assets/images/logo-dark.png" alt="Chumlab UI, open-source React component library" height="60" />
</p>

<h1 align="center">Chumlab UI</h1>

<p align="center">
  Production-grade React components. Accessible. Themeable. Zero lock-in.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@chumlab/ui"><img src="https://img.shields.io/npm/v/@chumlab/ui?color=blue&label=npm" alt="npm version" /></a>
  <a href="https://github.com/chumlabhq/ui/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-green" alt="MIT License" /></a>
  <img src="https://img.shields.io/badge/react-19-blue" alt="React 19" />
  <img src="https://img.shields.io/badge/tailwind-v4-blue" alt="Tailwind CSS v4" />
  <img src="https://img.shields.io/badge/typescript-strict-blue" alt="TypeScript" />
</p>

<p align="center">
  <a href="https://chumlab.com">Website</a> &middot;
  <a href="https://chumlab.com/accordion">Components</a> &middot;
  <a href="https://chumlab.com/blog">Blog</a> &middot;
  <a href="https://github.com/chumlabhq/ui">GitHub</a>
</p>

---

## What is Chumlab UI?

Chumlab UI is an open-source React component library that provides production-grade, accessible, and fully themeable UI components. It is built with TypeScript and Tailwind CSS v4, and designed for teams who need polished interfaces without sacrificing control over design or accessibility.

**Package:** `@chumlab/ui` on [npm](https://www.npmjs.com/package/@chumlab/ui)

## Why Chumlab UI?

- **Accessibility built in.** WCAG 2.1 AA, keyboard navigation, focus trapping, screen reader support, and `prefers-reduced-motion` out of the box. Not retrofitted, engineered from the start.
- **Fully themeable.** Override any element via the `classes` prop. Go fully unstyled. Use your own design tokens. No vendor CSS to fight.
- **Lightweight & tree-shakeable.** Only ship what you use. No runtime CSS-in-JS. Built on Tailwind CSS v4 for optimal bundle size.
- **TypeScript-first.** Strict types, full IntelliSense, and exported prop types for every component.

## How is Chumlab UI different from other React component libraries?

| Feature | Chumlab UI | MUI / Ant Design | Radix / Headless UI |
|---------|-----------|-------------------|---------------------|
| Default styles | Yes, polished | Yes, opinionated | No (headless) |
| Unstyled mode | Yes (`unstyled` prop) | No | Yes (by default) |
| CSS class overrides | Yes (`classes` prop) | Theme overrides | BYO styles |
| Runtime CSS-in-JS | None | Yes (Emotion/styled) | None |
| Tailwind CSS native | v4 | No | Compatible |
| Accessibility | WCAG 2.1 AA | Partial | Strong |
| Bundle approach | Tree-shakeable | Large bundle | Tree-shakeable |

Chumlab UI sits in the sweet spot: **production-ready defaults** with **full escape hatches**. Ship fast with the defaults, then customize any element when your design system demands it.

## Installation

```bash
npm install @chumlab/ui
```

**Peer dependencies:** `react >= 18` &middot; `react-dom >= 18`

## Quick Start

```tsx
import { Button, Input, Modal } from "@chumlab/ui";

function App() {
  return (
    <div>
      <Input label="Email" placeholder="you@example.com" />
      <Button>Submit</Button>
    </div>
  );
}
```

Or import individual components for optimal tree-shaking:

```tsx
import { Button } from "@chumlab/ui/components/Button";
import type { ButtonProps } from "@chumlab/ui/components/Button";
```

## Components

### Form Inputs

| Component | Description |
|-----------|-------------|
| [`Input`](https://chumlab.com/input) | Text input with icons, prefix/suffix, clearable, character count |
| [`TextArea`](https://chumlab.com/text-area) | Multi-line input with auto-resize |
| [`Checkbox`](https://chumlab.com/checkbox) | Checkbox with indeterminate state |
| [`Switch`](https://chumlab.com/switch) | Toggle switch with label and description |
| [`RadioButton`](https://chumlab.com/radio-button) | Radio group with horizontal/vertical layouts |
| [`OtpInput`](https://chumlab.com/otp-input) | OTP input with grouping and paste support |
| [`Slider`](https://chumlab.com/slider) | Range slider with single and dual thumbs |
| [`DatePicker`](https://chumlab.com/date-picker) | Calendar with single, range, and multi-date selection |
| [`TimePicker`](https://chumlab.com/time-picker) | Time picker with analog clock face |
| [`InternationalPhoneInput`](https://chumlab.com/international-phone-input) | Phone input with country code and validation |

### Selection

| Component | Description |
|-----------|-------------|
| [`Dropdown`](https://chumlab.com/dropdown) | Single-select dropdown with async loading |
| [`SearchableDropdown`](https://chumlab.com/searchable-dropdown) | Filterable dropdown with search |
| [`MultiSelectDropdown`](https://chumlab.com/multi-select-dropdown) | Multi-select with chips display |
| [`MultiSelectSearchableDropdown`](https://chumlab.com/multi-select-searchable-dropdown) | Searchable multi-select |
| [`CascadingDropdown`](https://chumlab.com/cascading-dropdown) | Hierarchical multi-level selection |

### Navigation

| Component | Description |
|-----------|-------------|
| [`Breadcrumb`](https://chumlab.com/breadcrumb) | Breadcrumb trail with truncation and overflow dropdown |
| [`Pagination`](https://chumlab.com/pagination) | Page controls with rows-per-page selector |
| [`TabPanel`](https://chumlab.com/tab-panel) | Tabs with keyboard support and RTL |
| [`Stepper`](https://chumlab.com/stepper) | Step-by-step progress indicator |

### Overlay

| Component | Description |
|-----------|-------------|
| [`Modal`](https://chumlab.com/modal) | Dialog with focus trap, nesting, and compound children |
| [`Drawer`](https://chumlab.com/drawer) | Side panel with swipe gestures and snap points |
| [`Tooltip`](https://chumlab.com/tooltip) | Positioned tooltip with rich content and arrow |
| [`Toast`](https://chumlab.com/toast) | Toast notifications with progress bar |

### Display

| Component | Description |
|-----------|-------------|
| [`Avatar`](https://chumlab.com/avatar) | User avatar with initials, badges, status, and groups |
| [`CountryFlag`](https://chumlab.com/country-flag) | Country flag images with lazy loading |
| [`Table`](https://chumlab.com/table) | Data table with sorting (TanStack Table) |
| [`Accordion`](https://chumlab.com/accordion) | Expandable sections with animations |
| [`Loader`](https://chumlab.com/loader) | Circular loading spinner |

### Layout

| Component | Description |
|-----------|-------------|
| [`Button`](https://chumlab.com/button) | Polymorphic button (button/a/span/asChild) with icon animations |
| [`ResizablePanel`](https://chumlab.com/resizable-panel) | Adjustable panel with drag handle |

## Key Patterns

### Controlled & Uncontrolled

Every stateful component supports both patterns:

```tsx
// Uncontrolled: component manages its own state
<Input defaultValue="hello" />

// Controlled: you own the state
<Input value={text} onValueChange={setText} />
```

### CSS Class Overrides

Override any internal element with the `classes` prop:

```tsx
<Button
  classes={{
    root: "bg-blue-600 hover:bg-blue-700",
    content: "font-semibold",
    startIcon: "text-white/80",
  }}
/>
```

### Unstyled Mode

Strip all default styles and build from scratch:

```tsx
<Input unstyled label="Custom" className="border-2 rounded px-3 py-2" />
```

### Data Attributes

Components expose `data-*` attributes for CSS targeting:

```css
[data-disabled] { opacity: 0.5; }
[data-error] { border-color: red; }
[data-slot="label"] { font-weight: 600; }
```

## Utilities

| Export | Description |
|--------|-------------|
| `cn` | Tailwind-aware class merging (clsx + tailwind-merge) |
| `Slot` | Composition primitive for the `asChild` pattern |
| `mergeRefs` | Combines multiple React refs |
| `useControllableState` | Hook for dual controlled/uncontrolled state |
| `useReducedMotion` | Respects `prefers-reduced-motion` media query |
| `useIsomorphicLayoutEffect` | SSR-safe `useLayoutEffect` replacement |
| `SR_ONLY_STYLE` | Screen-reader-only inline styles object |

## Accessibility

Every component ships with:

- ARIA roles, states, and properties following WAI-ARIA 1.2
- Full keyboard navigation (arrow keys, Home/End, Escape, Enter/Space)
- Focus management and focus trapping (Modal, Drawer)
- Screen reader announcements via `aria-live` regions
- `prefers-reduced-motion` support
- Dev-mode console warnings for missing accessible names

## Browser Support

| Browser | Versions |
|---------|----------|
| Chrome / Edge | Latest 2 |
| Firefox | Latest 2 |
| Safari | Latest 2 |
| Mobile Chrome / Safari | Latest 2 |

## Development

```bash
git clone https://github.com/chumlabhq/ui.git
cd ui
npm install
npm run dev          # Dev server at localhost:5173
```

```bash
npm run build        # Production build
npm run lint         # ESLint (strict mode, zero warnings)
npm run test         # Unit tests (Vitest)
npm run test:e2e     # E2E tests (Playwright)
npm run test:all     # All tests
```

## Contributing

We welcome contributions. See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

1. Fork the repo
2. Create your branch (`git checkout -b feat/awesome-thing`)
3. Commit your changes
4. Open a pull request

## FAQ

**Q: Is Chumlab UI free to use?**
A: Yes. It is MIT licensed and free for personal and commercial use.

**Q: Does it work with Next.js?**
A: Yes. All components are compatible with Next.js App Router and Pages Router. Use the `"use client"` directive for interactive components.

**Q: Can I use Chumlab UI without Tailwind CSS?**
A: Yes. Use the `unstyled` prop on any component and apply your own CSS classes.

**Q: How do I report a bug?**
A: Open an issue on [GitHub](https://github.com/chumlabhq/ui/issues).

## License

[MIT](LICENSE) &copy; 2026 Chumlab

---

<p align="center">
  Built with care by <a href="https://chumlab.com">Chumlab</a> &middot;
  <a href="mailto:hello@chumlab.com">hello@chumlab.com</a>
</p>
