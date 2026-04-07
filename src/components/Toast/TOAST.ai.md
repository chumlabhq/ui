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

function App() {
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
| `position` | Set on `<ToastProvider>`. 6 options: `"top-right"` (default), `"top-left"`, `"top-center"`, `"bottom-right"`, `"bottom-left"`, `"bottom-center"` |
| `duration` | Milliseconds before auto-dismiss. `0` = persistent. Default varies by type. |
| `content` | ReactNode that replaces the default message/description layout entirely |
| `onDismiss` | Preferred over deprecated `onClose` |
| `maxToasts` | Set on `<ToastProvider>` to limit visible toasts |

---

## API Methods

```tsx
const toast = useToast();
toast.success("message", options?);
toast.warning("message", options?);
toast.error("message", options?);
toast.info("message", options?);
toast.toast({ type, message, ...options }); // generic
toast.dismiss(id);
toast.dismissAll();
```

---

## Accessibility

- `role="alert"` for error/warning, `role="status"` for success/info
- `aria-live="assertive"` for alerts, `"polite"` for status
- `aria-atomic="true"` — full toast announced on update
- Close button has configurable `aria-label` (default: "Close notification")
- Container has `role="region"` with `aria-label`
- Escape key dismissal support

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
| Custom content | `title="Custom Content"` |
| Positions | `title="Position"` |
| Unstyled | `title="Unstyled Mode"` |
| CSS variables | `title="CSS Variables"` |

| File | Contains |
|------|----------|
| `Toast.tsx` | Individual toast component with progress, close |
| `components/ToastProvider.tsx` | Context provider, positioning, toast queue |
| `utils/types.ts` | ToastConfig, ToastProps, ToastClasses, ToastPosition |
| `utils/constants.ts` | Default styles per type, position classes |
