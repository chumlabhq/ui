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
  root?: string;
  /**
   * The padded row inside `root` that holds the icon, the message and the close
   * button. Style `root` for the toast's outer box and this for its contents.
   */
  body?: string;
  /** The auto-dismiss progress groove that `indicator` fills. */
  track?: string;
  title?: string;
  /** Description text element */
  description?: string;
  indicator?: string;
  closeTrigger?: string;
  /** Icon wrapper element */
  icon?: string;
}

export interface ToastConfig {
  id: string;
  type?: ToastType;
  message?: ReactNode;
  description?: ReactNode;
  content?: ReactNode;
  duration?: number;
  showProgress?: boolean;
  progressColor?: string;
  icon?: ReactNode;
  showCloseButton?: boolean;
  /** Fires when the toast is dismissed. */
  onDismiss?: () => void;
  role?: "alert" | "status";
  style?: React.CSSProperties;
  pauseOnHover?: boolean;
  closeAriaLabel?: string;
  classes?: ToastClasses;
  unstyled?: boolean;
}

export interface ToastProps extends Omit<ToastConfig, "id"> {
  id: string;
  onRemove: (id: string) => void;
  providerClasses?: ToastClasses;
  providerUnstyled?: boolean;
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
  /** Dismisses the newest toast when Escape is pressed. */
  dismissOnEscape?: boolean;
  /** Accessible name for the toast region. */
  containerAriaLabel?: string;
  /** Class overrides for this component's slots. */
  classes?: ToastClasses;
  /** Drops the decorative default classes and keeps the structural ones, along with focus, keyboard and ARIA wiring. */
  unstyled?: boolean;
}

export interface ToastContextValue {
  toast: (config: Omit<ToastConfig, "id"> | string) => string;
  success: (message: ReactNode, options?: Partial<ToastConfig>) => string;
  warning: (message: ReactNode, options?: Partial<ToastConfig>) => string;
  error: (message: ReactNode, options?: Partial<ToastConfig>) => string;
  info: (message: ReactNode, options?: Partial<ToastConfig>) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}
