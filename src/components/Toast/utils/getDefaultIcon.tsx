import type { ToastVariant } from "./types.js";
import { SuccessIcon, WarningIcon, ErrorIcon, InfoIcon } from "./icons.js";

export const getDefaultIcon = (variant: ToastVariant) => {
  const iconClass = "w-5 h-5 shrink-0";
  switch (variant) {
    case "success":
      return <SuccessIcon className={iconClass} />;
    case "warning":
      return <WarningIcon className={iconClass} />;
    case "error":
      return <ErrorIcon className={iconClass} />;
    case "info":
      return <InfoIcon className={iconClass} />;
    default:
      return <InfoIcon className={iconClass} />;
  }
};
