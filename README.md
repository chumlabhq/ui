# Chumlab UI

A production-grade React component library built with TypeScript, Tailwind CSS v4, and modern React 19 patterns. Designed for full customizability through composable APIs, CSS class overrides, and unstyled modes.

## Installation

```bash
npm install @chumlab/ui
```

**Peer dependencies:** React 19+, Tailwind CSS 4+

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

Or import from individual component paths:

```tsx
import { Button } from "@chumlab/ui/components/Button";
import type { ButtonProps } from "@chumlab/ui/components/Button";
```

## Components

### Form Inputs

| Component | Description |
|-----------|-------------|
| `Input` | Text input with icons, prefix/suffix, clearable, character count |
| `TextArea` | Multi-line text input with auto-resize |
| `Checkbox` | Checkbox with indeterminate state support |
| `Switch` | Toggle switch with label and description |
| `OtpInput` | One-time password input with grouping and paste support |
| `DatePicker` | Calendar with single, range, and multiple date selection |
| `TimePicker` | Time selection with clock face |
| `InternationalPhoneInput` | Phone input with country code selection and validation |

### Selection

| Component | Description |
|-----------|-------------|
| `Dropdown` | Single-select dropdown with async loading |
| `SearchableDropdown` | Dropdown with search filtering |
| `MultiSelectDropdown` | Multi-select with chips |
| `MultiSelectSearchableDropdown` | Searchable multi-select |
| `CascadingDropdown` | Hierarchical multi-level selection |

### Navigation

| Component | Description |
|-----------|-------------|
| `Breadcrumb` | Breadcrumb trail with truncation and dropdown |
| `Pagination` | Page controls with rows-per-page selector |
| `TabPanel` | Tab navigation with keyboard support and RTL |
| `Stepper` | Step-by-step progress indicator |

### Overlay

| Component | Description |
|-----------|-------------|
| `Modal` | Dialog with focus trap, nesting, and compound children |
| `Drawer` | Side panel with swipe gestures and snap points |
| `Tooltip` | Positioned tooltip with rich content and arrow |
| `Toast` | Toast notifications with progress bar |

### Display

| Component | Description |
|-----------|-------------|
| `Avatar` | User avatar with initials, badges, status, and groups |
| `CountryFlag` | Country flag images with lazy loading |
| `Table` | Data table with sorting (powered by TanStack Table) |
| `Accordion` | Expandable sections with animations |
| `Loader` | Circular loading spinner |

### Layout

| Component | Description |
|-----------|-------------|
| `Button` | Polymorphic button (button/a/span/asChild) with icon animations |
| `ResizablePanel` | Adjustable panel with drag handle |

## Key Patterns

### Controlled & Uncontrolled

All stateful components support both patterns:

```tsx
// Uncontrolled (internal state)
<Input defaultValue="hello" />

// Controlled (external state)
<Input value={text} onValueChange={setText} />
```

### CSS Class Overrides

Every component accepts a `classes` prop for surgical styling:

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
<Input unstyled label="Custom" />
```

### Data Attributes

Components emit `data-*` attributes for CSS targeting:

```css
[data-disabled] { opacity: 0.5; }
[data-error] { border-color: red; }
[data-slot="label"] { font-weight: 600; }
```

## Utilities

| Export | Description |
|--------|-------------|
| `cn` | Tailwind-aware class merging (clsx + tailwind-merge) |
| `Slot` | Composition primitive for `asChild` pattern |
| `mergeRefs` | Combines multiple React refs |
| `useControllableState` | Hook for dual controlled/uncontrolled state |
| `useReducedMotion` | Respects `prefers-reduced-motion` |
| `useIsomorphicLayoutEffect` | SSR-safe `useLayoutEffect` |
| `SR_ONLY_STYLE` | Screen-reader-only inline styles |

## Accessibility

All components include:

- Proper ARIA roles, states, and properties
- Full keyboard navigation
- Focus management and trapping (modals, drawers)
- Screen reader announcements via live regions
- `prefers-reduced-motion` support
- Dev-mode warnings for missing accessible names

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile Chrome and Safari

## Development

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run test         # Unit tests (Vitest)
npm run test:e2e     # E2E tests (Playwright)
npm run test:all     # All tests
npm run lint         # ESLint
```

## License

MIT
