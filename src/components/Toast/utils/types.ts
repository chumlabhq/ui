import type { ReactNode } from "react";

export type ToastType = "success" | "warning" | "error" | "info";

export type ToastPosition =
  | "top-left"
  | "top-right"
  | "top-center"
  | "bottom-left"
  | "bottom-right"
  | "bottom-center";

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
  onClose?: () => void;
  role?: "alert" | "status";
  className?: string;
  style?: React.CSSProperties;
  contentClassName?: string;
  messageClassName?: string;
  descriptionClassName?: string;
  progressClassName?: string;
  closeButtonClassName?: string;
  iconClassName?: string;
  pauseOnHover?: boolean;
  closeAriaLabel?: string;
}

export interface ToastProps extends Omit<ToastConfig, "id"> {
  id: string;
  visible: boolean;
  onRemove: (id: string) => void;
  position: ToastPosition;
  animationDuration?: number;
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
