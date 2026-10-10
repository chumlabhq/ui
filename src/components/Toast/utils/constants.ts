import type { ToastVariant, ToastPosition, ToastClasses } from "./types.js";
import { structuralOnly } from "../../../utils/classLayers.js";

export const getRoleForVariant = (variant: ToastVariant): "alert" | "status" => {
  switch (variant) {
    case "error":
    case "warning":
      return "alert";
    case "success":
    case "info":
    default:
      return "status";
  }
};

export const defaultContainerStyles: Record<ToastVariant | "default", string> = {
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
  root: "relative overflow-hidden rounded-cl-md border shadow-lg",
  body: "flex items-start gap-3 p-4",
  track: "absolute bottom-0 left-0 right-0 h-1 bg-white/20",
  title: "font-medium text-sm",
  description: "text-sm mt-1 opacity-80",
  indicator: "h-full bg-white/40",
  closeTrigger: "cursor-pointer shrink-0 p-1 rounded hover:bg-white/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80",
  icon: "text-white",
};

export const UNSTYLED_TOAST_CLASSES: Required<ToastClasses> =
  structuralOnly(DEFAULT_TOAST_CLASSES);
