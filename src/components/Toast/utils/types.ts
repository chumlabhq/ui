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
  container?: string;
  content?: string;
  message?: string;
  description?: string;
  progress?: string;
  closeButton?: string;
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
  /**
   * @deprecated Use `onDismiss` instead — kept for backward compatibility.
   * If both are provided, `onDismiss` takes precedence.
   */
  onClose?: () => void;
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
}

export interface ToastProviderProps {
  children: ReactNode;
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
