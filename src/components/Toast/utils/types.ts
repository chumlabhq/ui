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
   * ADR 002 R2: the padded row inside `root`. It had no key and was reached by
   * applying `root` to two different elements, so any override on `root` styled
   * both the container and this.
   */
  body?: string;
  /** R2 `track`: the auto-dismiss progress groove that `indicator` fills. */
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
  children: ReactNode;
  /** Toast position on screen. Default: `"bottom-right"`. */
  position?: ToastPosition;
  maxToasts?: number;
  containerClassName?: string;
  defaultDuration?: number;
  animationDuration?: number;
  gap?: number;
  zIndex?: number;
  dismissOnEscape?: boolean;
  containerAriaLabel?: string;
  classes?: ToastClasses;
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
