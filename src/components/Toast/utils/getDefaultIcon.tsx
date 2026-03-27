import type { ToastType } from "./types";
import { SuccessIcon, WarningIcon, ErrorIcon, InfoIcon } from "./icons";

export const getDefaultIcon = (type: ToastType) => {
  const iconClass = "w-5 h-5 shrink-0";
  switch (type) {
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
