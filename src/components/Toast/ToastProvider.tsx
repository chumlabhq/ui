import { useState, useCallback, useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import type {
  ToastConfig,
  ToastContextValue,
  ToastProviderProps,
  ToastPosition,
} from "./types";
import Toast from "./Toast";
import { ToastContext } from "./ToastContext";
import { cn } from "../../utils/cn";

let toastIdCounter = 0;
const generateId = () => `toast-${++toastIdCounter}-${Date.now()}`;

const getOrCreatePortal = (zIndex: number): HTMLDivElement | null => {
  if (typeof document === "undefined") return null;
  const existing = document.getElementById("toast-portal") as HTMLDivElement | null;
  if (existing) return existing;
  const portal = document.createElement("div");
  portal.id = "toast-portal";
  portal.style.cssText = `position:fixed;z-index:${zIndex};pointer-events:none;inset:0;`;
  document.body.appendChild(portal);
  return portal;
};

const positionClasses: Record<ToastPosition, string> = {
  "top-left": "top-4 left-4",
  "top-right": "top-4 right-4",
  "top-center": "top-4 left-1/2 -translate-x-1/2",
  "bottom-left": "bottom-4 left-4",
  "bottom-right": "bottom-4 right-4",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
};

const stackDirectionClasses: Record<"top" | "bottom", string> = {
  top: "flex-col",
  bottom: "flex-col-reverse",
};

interface ToastState extends ToastConfig {
  visible: boolean;
}

export const ToastProvider = ({
  children,
  position = "bottom-right",
  maxToasts = 5,
  containerClassName,
  defaultDuration = 5000,
  gap = 12,
  zIndex = 9999,
  dismissOnEscape = false,
}: ToastProviderProps) => {
  const [toasts, setToasts] = useState<ToastState[]>([]);
  const [portalElement] = useState(() => getOrCreatePortal(zIndex));

  const removeToast = useCallback((id: string) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, visible: false } : t))
    );

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 200);
  }, []);

  const addToast = useCallback(
    (config: Omit<ToastConfig, "id"> | string): string => {
      const id = generateId();

      const toastConfig: ToastState =
        typeof config === "string"
          ? {
              id,
              message: config,
              type: "info",
              duration: defaultDuration,
              visible: true,
            }
          : {
              ...config,
              id,
              duration: config.duration ?? defaultDuration,
              visible: true,
            };

      setToasts((prev) => {
        const newToasts = [...prev, toastConfig];
        if (newToasts.length > maxToasts) {
          const toRemove = newToasts.slice(0, newToasts.length - maxToasts);
          toRemove.forEach((t) => {
            setTimeout(() => removeToast(t.id), 0);
          });
          return newToasts.slice(-maxToasts);
        }
        return newToasts;
      });

      return id;
    },
    [defaultDuration, maxToasts, removeToast]
  );

  const success = useCallback(
    (message: ReactNode, options?: Partial<ToastConfig>): string => {
      return addToast({ ...options, message, type: "success" });
    },
    [addToast]
  );

  const warning = useCallback(
    (message: ReactNode, options?: Partial<ToastConfig>): string => {
      return addToast({ ...options, message, type: "warning" });
    },
    [addToast]
  );

  const error = useCallback(
    (message: ReactNode, options?: Partial<ToastConfig>): string => {
      return addToast({ ...options, message, type: "error" });
    },
    [addToast]
  );

  const info = useCallback(
    (message: ReactNode, options?: Partial<ToastConfig>): string => {
      return addToast({ ...options, message, type: "info" });
    },
    [addToast]
  );

  const dismiss = useCallback(
    (id: string) => {
      removeToast(id);
    },
    [removeToast]
  );

  const dismissAll = useCallback(() => {
    setToasts((prev) => {
      prev.forEach((t) => {
        setTimeout(() => removeToast(t.id), 0);
      });
      return prev;
    });
  }, [removeToast]);

  useEffect(() => {
    if (!dismissOnEscape || toasts.length === 0) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        dismissAll();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [dismissOnEscape, toasts.length, dismissAll]);

  const contextValue: ToastContextValue = {
    toast: addToast,
    success,
    warning,
    error,
    info,
    dismiss,
    dismissAll,
  };

  const stackDirection = position.startsWith("top") ? "top" : "bottom";

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {portalElement &&
        createPortal(
          <div
            className={cn(
              "fixed flex pointer-events-none",
              positionClasses[position],
              stackDirectionClasses[stackDirection],
              containerClassName
            )}
            style={{ gap: `${gap}px` }}
            aria-live="polite"
            aria-label="Notifications"
          >
            {toasts.map((toast) => (
              <div key={toast.id} className="pointer-events-auto">
                <Toast
                  {...toast}
                  onRemove={removeToast}
                  position={position}
                />
              </div>
            ))}
          </div>,
          portalElement
        )}
    </ToastContext.Provider>
  );
};

export default ToastProvider;
