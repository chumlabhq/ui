# Toast

> A notification system for displaying brief messages. Supports multiple variants, positions, progress bars, custom content, and auto-dismiss.

**Category:** Feedback
**Keywords:** toast, notification, alert, snackbar, message, flash message, status

---

## Quick Answer

Wrap your app with `<ToastProvider>`, then call `toast.success("Done!")` from any child via `useToast()`. Supports 4 types (success/warning/error/info), 6 positions, auto-dismiss with duration, progress bars, and custom content.

---

## Import

```tsx
import { ToastProvider, useToast } from "@chumlab/ui/toast";
```

---

## Setup

Toast is the one component in the library with a structural requirement: it is
not something you place where you want it. `ToastProvider` wraps your tree once,
high enough that every caller is inside it, and toasts are created by calling a
function rather than rendering an element.

```tsx
// app root — once, around everything
import { ToastProvider } from "@chumlab/ui/toast";

export default function App({ children }) {
  return <ToastProvider position="top-right">{children}</ToastProvider>;
}
```

```tsx
// any child — no element, no state of your own
import { useToast } from "@chumlab/ui/toast";

function SaveButton() {
  const toast = useToast();
  return <button onClick={() => toast.success("Saved")}>Save</button>;
}
```

Three things that follow from that, and are the ones missed first:

- **`useToast()` throws outside the provider.** If you get that error, the
  component calling it is mounted above the wrap, or in a different React tree —
  a separate `createRoot`, or a portal rendered outside the provider's subtree.
- **One provider, not one per page.** Position, duration and `maxToasts` are the
  provider's props, so a second one gives you two independent stacks that do not
  know about each other's limits.
- **You never render `<Toast>` yourself.** It is exported for typing; the
  provider renders it, gives it its `id`, and removes it once your `onDismiss(id)` has run.

There is no Anatomy section for this, deliberately: the thing nested inside
`ToastProvider` is your tree, not another Toast part, and a diagram naming one
element would say less than the two snippets above.

---

## Basic Usage (copy-paste ready)

```tsx
import { ToastProvider, useToast } from "@chumlab/ui/toast";

export default function App() {
  return (
    <ToastProvider>
      <MyComponent />
    </ToastProvider>
  );
}

function MyComponent() {
  const toast = useToast();
  return (
    <button onClick={() => toast.success("Saved successfully!")}>
      Save
    </button>
  );
}
```

---

## Prop Constraints

| Prop | Constraint |
|------|-----------|
| `variant` | `"success"`, `"warning"`, `"error"`, `"info"` |
| `position` | Set on `<ToastProvider>`. 6 options: `"bottom-right"` (default), `"top-right"`, `"top-left"`, `"top-center"`, `"bottom-left"`, `"bottom-center"` |
| `duration` | Milliseconds before auto-dismiss. `0` = persistent. Default `5000` for every type. |
| `classes.root` | Class string for the toast's outer element. It does not replace the layout. |
| `onDismiss` | Fires when the toast is dismissed, by timeout or the close button |
| `maxToasts` | Set on `<ToastProvider>` to limit visible toasts |

---

## API Methods

```tsx
const toast = useToast();
toast.success("title", options?);
toast.warning("title", options?);
toast.error("title", options?);
toast.info("title", options?);
toast.toast({ variant, message, ...options }); // generic
toast.dismiss(id);
toast.dismissAll();
```

---

## Keyboard Interactions

A toast takes focus only when it has an action; otherwise it announces itself and stays out of the tab order.

| Key | Behaviour |
|-----|-----------|
| `Escape` | Dismisses the newest toast, and fires its `onDismiss`. An open Modal, Drawer, menu or tooltip takes the key first, and the toast is left alone. On by default; `closeOnEscape={false}` on the provider turns it off. |
| `Tab` | Moves to the toast's action and close button while it is on screen. |
| `Enter`, `Space` | Activates the focused action. |

---

## Accessibility

- `role="alert"` for error/warning, `role="status"` for success/info
- `aria-live="assertive"` for alerts, `"polite"` for status
- `aria-atomic="true"` — full toast announced on update
- Close button has configurable `aria-label` (default: "Close notification")
- Container has `role="region"` with `aria-label`
- Escape dismisses the newest toast, one per press, and yields to any open overlay

---

## All Props

<!-- generated from Toast.schema.json — edit the schema, not this table -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` **(required)** | string | — | Unique identifier for the toast, rendered as its root's id. |
| `variant` | `"success"` \| `"warning"` \| `"error"` \| `"info"` | `"info"` | Which status this is, choosing the colour and the status glyph. |
| `message` | object | — | React.ReactNode — Primary message content. |
| `description` | object | — | React.ReactNode — Secondary description text. |
| `content` | object | — | React.ReactNode — Custom content that replaces message and description. |
| `duration` | number | `5000` | Auto-dismiss duration in milliseconds. |
| `showProgress` | boolean | `true` | Whether to show a progress bar countdown. |
| `progressColor` | string | — | Custom color for the progress bar. |
| `icon` | object | — | React.ReactNode — Custom icon replacing the variant's default icon. |
| `showCloseButton` | boolean | `true` | Whether to show a close/dismiss button. |
| `onDismiss` | object | — | (id: string) => void — Fires with the toast's `id` when it is dismissed: its close button, Escape, or its duration running out. |
| `role` | `"alert"` \| `"status"` | — | ARIA role for the toast element. |
| `style` | object | — | Inline styles applied to the toast element. |
| `pauseOnHover` | boolean | `true` | Whether to pause the auto-dismiss timer on hover. Focus inside the toast pauses it whatever this is set to. |
| `closeAriaLabel` | string | `"Close notification"` | Accessible label for the close button. |
| `aria-label` | string | — | Accessible name of the toast's status region. |
| `aria-labelledby` | string | — | Ids of the elements that name the toast's status region. |
| `aria-describedby` | string | — | Ids of the elements that describe the toast's status region. |
| `classes` | object | — | CSS class overrides for sub-elements. |
| `unstyled` | boolean | `false` | When true, removes all default styling. |

## Sub-component Props

Generated from the types by `scripts/build-subcomponent-schemas.mjs`.

### ToastProvider

| Prop | Type | Description |
| --- | --- | --- |
| `children` | `ReactNode` | Content rendered inside this element. |
| `position` | `ToastPosition \| undefined` | Toast position on screen. Default: `"bottom-right"`. |
| `maxToasts` | `number \| undefined` | How many toasts may be visible at once. Older ones leave as new ones arrive. |
| `containerClassName` | `string \| undefined` | Additional classes for the toast container. |
| `defaultDuration` | `number \| undefined` | How long a toast stays up, in milliseconds, when it does not set its own. |
| `animationDuration` | `number \| undefined` | Enter and exit transition duration in milliseconds. |
| `gap` | `number \| undefined` | Space between stacked toasts, in pixels. |
| `zIndex` | `number \| undefined` | Stacking order for the toast container. |
| `closeOnEscape` | `boolean \| undefined` | Dismisses the newest toast when Escape is pressed, unless something above it — an open dialog, drawer or menu — has already handled the key. On by default. |
| `containerAriaLabel` | `string \| undefined` | Accessible name for the toast region. |
| `classes` | `ToastClasses \| undefined` | Class overrides for this component's slots. |
| `unstyled` | `boolean \| undefined` | Drops the decorative default classes and keeps the structural ones, along with focus, keyboard and ARIA wiring. |

---

## Data Attributes (for CSS selectors and testing)

- `data-toast-id` — on each toast, the id the API returns from `toast.success(...)`
- `data-variant="default" | "success" | "error" | "warning" | "info"` — the variant

---

## Class overrides

### Slot → element

| Slot | Element |
|------|---------|
| `root` | The toast surface — the coloured card the whole notice sits on. |
| `body` | The padded row inside `root` holding the icon, the message and the close button. |
| `range` | The fill inside `track`, which shrinks as the auto-dismiss timer runs. |
| `icon` | The icon wrapper. |
| `title` | The message line, which is the toast's accessible name. |
| `description` | The description under it. |
| `track` | The auto-dismiss progress groove. |
| `closeTrigger` | The dismiss button. |

### CSS custom properties

Each variant reads three, written as Tailwind arbitrary values with the
library's colour as the fallback — `bg-[var(--toast-default-bg,#374151)]`. Set
them on any ancestor to retheme toasts without touching `classes`.

| Variable | Controls | Default |
|----------|----------|---------|
| `--toast-default-bg` / `--toast-default-border` / `--toast-default-text` | the neutral toast | `#374151` / `#374151` / `white` |
| `--toast-success-bg` / `--toast-success-border` / `--toast-success-text` | the success variant | the library's success palette |
| `--toast-error-bg` / `--toast-error-border` / `--toast-error-text` | the error variant | the library's error palette |
| `--toast-warning-bg` / `--toast-warning-border` / `--toast-warning-text` | the warning variant | the library's warning palette |
| `--toast-info-bg` / `--toast-info-border` / `--toast-info-text` | the info variant | the library's info palette |

---


## Styling Guide

> **A plain utility replaces the library's for that property, in every state.**
> `classes={{ slot: "text-red-500" }}` drops the library's `hover:text-…` and
> `data-[state=…]:text-…` on that slot as well — otherwise they would sit beside
> your class and win in their own state, leaving your override in the DOM and
> inert. Pass your own variant to keep one: `"text-red-500 hover:text-red-400"`.
> A variant YOU pass is never dropped.

Toast supports CSS custom variables for theming:
- `--toast-success-bg`, `--toast-success-border`, `--toast-success-text`
- Same pattern for warning, error, info, default

Or use `classes` prop with 7 slots: container, content, message, description, progress, closeButton, icon.

---

## Demo Reference

**File:** `src/pages/demo/ToastDemo.tsx`

| Feature | Search for |
|---------|-----------|
| Basic variants | `title="Basic Usage"` |
| Description | `title="With Description"` |
| Progress bar | `title="Progress Bar"` |
| Custom icons | `title="Custom Icon"` |
| Custom content | `title="Custom Content (content prop)"` |
| Positions | `title="Position"` |
| CSS variables | `title="CSS Variables (Theming)"` |

| File | Contains |
|------|----------|
| `Toast.tsx` | Individual toast component with progress, close |
| `components/ToastProvider.tsx` | Context provider, positioning, toast queue |
| `utils/types.ts` | ToastConfig, ToastProps, ToastClasses, ToastPosition |
| `utils/constants.ts` | Default styles per type, position classes |
