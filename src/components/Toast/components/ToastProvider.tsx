import { useState, useCallback, useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import type {
  ToastConfig,
  ToastContextValue,
  ToastProviderProps,
} from "../utils/types";
import Toast from "../Toast";
import { ToastContext } from "../utils/context";
import { positionClasses, stackDirectionClasses, PROGRESS_KEYFRAMES } from "../utils/constants";
import { cn } from "../../../utils/cn";

const isBrowser = typeof document !== "undefined";
const STYLE_ID = "kern-toast-keyframes";

function injectKeyframes() {
  if (!isBrowser) return;
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = PROGRESS_KEYFRAMES;
  document.head.appendChild(style);
}

interface ToastState extends ToastConfig {
  visible: boolean;
}

export const ToastProvider = ({
  children,
  position = "bottom-right",
  maxToasts = 5,
  containerClassName,
  defaultDuration = 5000,
  animationDuration = 200,
  gap = 12,
  zIndex = 9999,
  dismissOnEscape = false,
}: ToastProviderProps) => {
  const [toasts, setToasts] = useState<ToastState[]>([]);
  const idCounterRef = useRef(0);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const [portalElement, setPortalElement] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isBrowser) return;
    injectKeyframes();
    const portal = document.createElement("div");
    portal.style.cssText = `position:fixed;z-index:${zIndex};pointer-events:none;inset:0;`;
    document.body.appendChild(portal);
    setPortalElement(portal);

    return () => {
      portal.parentNode?.removeChild(portal);
    };
  }, [zIndex]);

  const restoreFocus = useCallback(() => {
    if (previousFocusRef.current && previousFocusRef.current.isConnected) {
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    }
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, visible: false } : t))
    );

    setTimeout(() => {
      setToasts((prev) => {
        const next = prev.filter((t) => t.id !== id);
        if (next.length === 0) {
          restoreFocus();
        }
        return next;
      });
    }, animationDuration);
  }, [animationDuration, restoreFocus]);

  const addToast = useCallback(
    (config: Omit<ToastConfig, "id"> | string): string => {
      const id = `toast-${++idCounterRef.current}-${Date.now()}`;

      if (isBrowser) {
        const active = document.activeElement as HTMLElement;
        const isToastElement = active?.closest?.("[data-toast-id]");
        if (!isToastElement) {
          previousFocusRef.current = active;
        }
      }

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
    [defaultDuration, maxToasts, removeToast],
  );

  const success = useCallback(
    (message: ReactNode, options?: Partial<ToastConfig>): string => {
      return addToast({ ...options, message, type: "success" });
    },
    [addToast],
  );

  const warning = useCallback(
    (message: ReactNode, options?: Partial<ToastConfig>): string => {
      return addToast({ ...options, message, type: "warning" });
    },
    [addToast],
  );

  const error = useCallback(
    (message: ReactNode, options?: Partial<ToastConfig>): string => {
      return addToast({ ...options, message, type: "error" });
    },
    [addToast],
  );

  const info = useCallback(
    (message: ReactNode, options?: Partial<ToastConfig>): string => {
      return addToast({ ...options, message, type: "info" });
    },
    [addToast],
  );

  const dismiss = useCallback(
    (id: string) => {
      removeToast(id);
    },
    [removeToast],
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
              containerClassName,
            )}
            style={{ gap: `${gap}px` }}
            role="region"
            aria-label="Notifications"
          >
            {toasts.map((toast) => (
              <div key={toast.id} className="pointer-events-auto">
                <Toast
                  {...toast}
                  onRemove={removeToast}
                  position={position}
                  animationDuration={animationDuration}
                />
              </div>
            ))}
          </div>,
          portalElement,
        )}
    </ToastContext.Provider>
  );
};

export default ToastProvider;
