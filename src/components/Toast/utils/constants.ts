import type { ToastType, ToastPosition, ToastClasses } from "./types";

export const getRoleForType = (type: ToastType): "alert" | "status" => {
  switch (type) {
    case "error":
    case "warning":
      return "alert";
    case "success":
    case "info":
    default:
      return "status";
  }
};

export const defaultContainerStyles: Record<ToastType | "default", string> = {
  success:
    "bg-[var(--toast-success-bg,#195030)] border-[var(--toast-success-border,#195030)] text-[var(--toast-success-text,white)]",
  warning:
    "bg-[var(--toast-warning-bg,#665823)] border-[var(--toast-warning-border,#665823)] text-[var(--toast-warning-text,white)]",
  error:
    "bg-[var(--toast-error-bg,#82363a)] border-[var(--toast-error-border,#82363a)] text-[var(--toast-error-text,white)]",
  info: "bg-[var(--toast-info-bg,#213f70)] border-[var(--toast-info-border,#213f70)] text-[var(--toast-info-text,white)]",
  default:
    "bg-[var(--toast-default-bg,#374151)] border-[var(--toast-default-border,#374151)] text-[var(--toast-default-text,white)]",
};

export const positionClasses: Record<ToastPosition, string> = {
  "top-left": "top-4 left-4",
  "top-right": "top-4 right-4",
  "top-center": "top-4 left-1/2 -translate-x-1/2",
  "bottom-left": "bottom-4 left-4",
  "bottom-right": "bottom-4 right-4",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
};

export const stackDirectionClasses: Record<"top" | "bottom", string> = {
  top: "flex-col",
  bottom: "flex-col-reverse",
};

export const PROGRESS_KEYFRAMES = `@keyframes chumlab-toast-progress{from{width:100%}to{width:0%}}`;

export const DEFAULT_TOAST_CLASSES: Required<ToastClasses> = {
  container: "",
  content: "",
  message: "",
  description: "",
  progress: "",
  closeButton: "",
  icon: "",
};

export const UNSTYLED_TOAST_CLASSES: Required<ToastClasses> = {
  container: "",
  content: "",
  message: "",
  description: "",
  progress: "",
  closeButton: "",
  icon: "",
};
