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
  className?: string;
  contentClassName?: string;
  messageClassName?: string;
  descriptionClassName?: string;
  progressClassName?: string;
  closeButtonClassName?: string;
  iconClassName?: string;
  pauseOnHover?: boolean;
}

export interface ToastProps extends Omit<ToastConfig, "id"> {
  id: string;
  visible: boolean;
  onRemove: (id: string) => void;
  position: ToastPosition;
}

export interface ToastProviderProps {
  children: ReactNode;
  position?: ToastPosition;
  maxToasts?: number;
  containerClassName?: string;
  defaultDuration?: number;
  gap?: number;
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
