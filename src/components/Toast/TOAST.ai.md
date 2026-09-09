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
| `type` | `"success"`, `"warning"`, `"error"`, `"info"` |
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
toast.toast({ type, title, ...options }); // generic
toast.dismiss(id);
toast.dismissAll();
```

---

## Keyboard Interactions

A toast takes focus only when it has an action; otherwise it announces itself and stays out of the tab order.

| Key | Behaviour |
|-----|-----------|
| `Escape` | Dismisses the toast when `dismissOnEscape` is set. |
| `Tab` | Moves to the toast's action and close button while it is on screen. |
| `Enter`, `Space` | Activates the focused action. |

---

## Accessibility

- `role="alert"` for error/warning, `role="status"` for success/info
- `aria-live="assertive"` for alerts, `"polite"` for status
- `aria-atomic="true"` — full toast announced on update
- Close button has configurable `aria-label` (default: "Close notification")
- Container has `role="region"` with `aria-label`
- Escape key dismissal support

---

## All Props

<!-- generated from Toast.schema.json — edit the schema, not this table -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` **(required)** | string | — | Unique identifier for the toast. |
| `type` | `"success"` \| `"warning"` \| `"error"` \| `"info"` | `"info"` | Visual type/severity of the toast. |
| `message` | object | — | React.ReactNode — Primary message content. |
| `description` | object | — | React.ReactNode — Secondary description text. |
| `content` | object | — | React.ReactNode — Custom content that replaces message and description. |
| `duration` | number | `5000` | Auto-dismiss duration in milliseconds. |
| `showProgress` | boolean | `true` | Whether to show a progress bar countdown. |
| `progressColor` | string | — | Custom color for the progress bar. |
| `icon` | object | — | React.ReactNode — Custom icon replacing the default type icon. |
| `showCloseButton` | boolean | `true` | Whether to show a close/dismiss button. |
| `onDismiss` | object | — | () => void — Fires when the toast is dismissed. |
| `role` | `"alert"` \| `"status"` | — | ARIA role for the toast element. |
| `style` | object | — | Inline styles applied to the toast element. |
| `pauseOnHover` | boolean | `true` | Whether to pause the auto-dismiss timer on hover. |
| `closeAriaLabel` | string | `"Close notification"` | Accessible label for the close button. |
| `classes` | object | — | CSS class overrides for sub-elements. |
| `unstyled` | boolean | `false` | When true, removes all default styling. |
| `onRemove` **(required)** | object | — | (id: string) => void — Internal callback to remove the toast from the provider. |

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
| `dismissOnEscape` | `boolean \| undefined` | Dismisses the newest toast when Escape is pressed. |
| `containerAriaLabel` | `string \| undefined` | Accessible name for the toast region. |
| `classes` | `ToastClasses \| undefined` | Class overrides for this component's slots. |
| `unstyled` | `boolean \| undefined` | Drops the decorative default classes and keeps the structural ones, along with focus, keyboard and ARIA wiring. |

---

## Styling Guide

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
