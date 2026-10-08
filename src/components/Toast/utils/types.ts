import type { ReactNode } from "react";

export type ToastType = "success" | "warning" | "error" | "info";

export type ToastPosition =
  | "top-left"
  | "top-right"
  | "top-center"
  | "bottom-left"
  | "bottom-right"
  | "bottom-center";

export interface ToastClasses {
  /** The toast surface — the coloured card the whole notice sits on. */
  root?: string;
  /**
   * The padded row inside `root` that holds the icon, the message and the close
   * button. Style `root` for the toast's outer box and this for its contents.
   */
  body?: string;
  /** The auto-dismiss progress groove that `indicator` fills. */
  track?: string;
  /** The message line, which is the toast's accessible name. */
  title?: string;
  /** Description text element */
  description?: string;
  /** The status glyph at the leading edge, which is what distinguishes the types apart from colour. */
  indicator?: string;
  /** The dismiss button. */
  closeTrigger?: string;
  /** Icon wrapper element */
  icon?: string;
}

/**
 * Everything one toast can be told. `useToast()`'s methods take this minus the fields they fill in themselves.
 */
export interface ToastConfig {
  /** Identifies the toast so it can be dismissed by name later; generated when omitted. */
  id: string;
  /** Which status this is, choosing the colour and the indicator glyph. */
  type?: ToastType;
  /** The main line, and the toast's accessible name. */
  message?: ReactNode;
  /** A second line under the message. */
  description?: ReactNode;
  /** Arbitrary nodes below the text. Interactive content here is the caller's to style — the library paints nothing inside it. */
  content?: ReactNode;
  /** Milliseconds before it dismisses itself. `Infinity` keeps it until dismissed. */
  duration?: number;
  /** Draws a bar counting the duration down. */
  showProgress?: boolean;
  /** Overrides that bar's colour. */
  progressColor?: string;
  /** Replaces the type's default indicator glyph. */
  icon?: ReactNode;
  /** Renders the dismiss button. */
  showCloseButton?: boolean;
  /** Fires when the toast is dismissed. */
  onDismiss?: () => void;
  /** `alert` interrupts a screen reader, `status` waits for a pause. Errors want the first, confirmations the second. */
  role?: "alert" | "status";
  /** Inline styles for the toast surface. */
  style?: React.CSSProperties;
  /** Holds the countdown while a pointer rests on the toast, so it cannot vanish mid-read. */
  pauseOnHover?: boolean;
  /** Accessible name for the dismiss button, for translating it. */
  closeAriaLabel?: string;
  /** Class overrides for this toast's slots. */
  classes?: ToastClasses;
  /** Drops the decorative defaults and keeps the structural ones. */
  unstyled?: boolean;
}

export interface ToastProps extends Omit<ToastConfig, "id"> {
  id: string;
  onRemove: (id: string) => void;
  providerClasses?: ToastClasses;
  providerUnstyled?: boolean;
  /**
   * Dismisses this toast on Escape, through the same path as its close button.
   * `ToastProvider` sets it on the newest toast only.
   */
  closeOnEscape?: boolean;
  /** Merged onto the toast root after the default and `classes.container` styles,
   *  so a consumer's class wins on conflict. Every other component already
   *  accepted this; Toast was the one that did not. */
  className?: string;
}

/**
 * Props for the ToastProvider component.
 *
 * @example
 * ```tsx
 * <ToastProvider position="bottom-right"><App /></ToastProvider>
 * ```
 */
export interface ToastProviderProps {
  /** Content rendered inside this element. */
  children: ReactNode;
  /** Toast position on screen. Default: `"bottom-right"`. */
  position?: ToastPosition;
  /** How many toasts may be visible at once. Older ones leave as new ones arrive. */
  maxToasts?: number;
  /** Additional classes for the toast container. */
  containerClassName?: string;
  /** How long a toast stays up, in milliseconds, when it does not set its own. */
  defaultDuration?: number;
  /** Enter and exit transition duration in milliseconds. */
  animationDuration?: number;
  /** Space between stacked toasts, in pixels. */
  gap?: number;
  /** Stacking order for the toast container. */
  zIndex?: number;
  /**
   * Dismisses the newest toast when Escape is pressed, unless something above
   * it — an open dialog, drawer or menu — has already handled the key. On by
   * default.
   */
  closeOnEscape?: boolean;
  /** Accessible name for the toast region. */
  containerAriaLabel?: string;
  /** Class overrides for this component's slots. */
  classes?: ToastClasses;
  /** Drops the decorative default classes and keeps the structural ones, along with focus, keyboard and ARIA wiring. */
  unstyled?: boolean;
}

/**
 * What `useToast()` returns: one method per status, plus the two dismissals.
 */
export interface ToastContextValue {
  /** Shows a toast and returns its id. The other methods are this with `type` filled in. */
  toast: (config: Omit<ToastConfig, "id"> | string) => string;
  /** Shows a success toast. */
  success: (message: ReactNode, options?: Partial<ToastConfig>) => string;
  /** Shows a warning toast. */
  warning: (message: ReactNode, options?: Partial<ToastConfig>) => string;
  /** Shows an error toast, which announces immediately. */
  error: (message: ReactNode, options?: Partial<ToastConfig>) => string;
  /** Shows an informational toast. */
  info: (message: ReactNode, options?: Partial<ToastConfig>) => string;
  /** Dismisses one toast by the id `toast` returned. */
  dismiss: (id: string) => void;
  /** Dismisses everything currently on screen. */
  dismissAll: () => void;
}
