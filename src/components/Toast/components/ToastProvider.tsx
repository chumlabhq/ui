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

interface ToastState extends ToastConfig {
  visible: boolean;
}

export const ToastProvider = ({
  children,
  position = "bottom-right",
  maxToasts = 5,
  containerClassName,
  defaultDuration = 5000,
  animationDuration = 500,
  gap = 12,
  zIndex = 9999,
  dismissOnEscape = false,
  containerAriaLabel = "Notifications",
  classes: providerClasses,
  unstyled: providerUnstyled = false,
}: ToastProviderProps) => {
  const [toasts, setToasts] = useState<ToastState[]>([]);
  const idCounterRef = useRef(0);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const portalTarget = isBrowser ? document.body : null;

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
          // Mark overflow toasts as invisible (triggers exit animation)
          // but keep them in the array until the animation completes
          const overflowCount = newToasts.length - maxToasts;
          const result = newToasts.map((t, i) =>
            i < overflowCount && t.visible ? { ...t, visible: false } : t,
          );
          // Remove them from DOM after exit animation finishes
          const overflowIds = newToasts.slice(0, overflowCount).map((t) => t.id);
          setTimeout(() => {
            setToasts((cur) => cur.filter((t) => !overflowIds.includes(t.id)));
          }, animationDuration);
          return result;
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
    setToasts((prev) => prev.map((t) => ({ ...t, visible: false })));
    setTimeout(() => {
      setToasts([]);
      restoreFocus();
    }, animationDuration);
  }, [animationDuration, restoreFocus]);

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
      <style>{PROGRESS_KEYFRAMES}</style>
      {portalTarget &&
        createPortal(
          <div
            style={{
              position: "fixed",
              zIndex,
              pointerEvents: "none",
              inset: 0,
            }}
          >
            <div
              className={cn(
                "fixed flex pointer-events-none",
                positionClasses[position],
                stackDirectionClasses[stackDirection],
                containerClassName,
              )}
              style={{ gap: 0 }}
              role="region"
              aria-label={containerAriaLabel}
            >
              {toasts.map((toast) => (
                <div
                  key={toast.id}
                  className="pointer-events-auto grid"
                  style={{
                    gridTemplateRows: toast.visible ? "1fr" : "0fr",
                    opacity: toast.visible ? 1 : 0,
                    transform: toast.visible ? "scale(1)" : "scale(0.96)",
                    marginBottom: stackDirection === "bottom" ? (toast.visible ? gap : 0) : 0,
                    marginTop: stackDirection === "top" ? (toast.visible ? gap : 0) : 0,
                    transition: `grid-template-rows ${animationDuration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity ${Math.round(animationDuration * 0.5)}ms cubic-bezier(0.25, 0.46, 0.45, 0.94), transform ${Math.round(animationDuration * 0.5)}ms cubic-bezier(0.25, 0.46, 0.45, 0.94), margin ${animationDuration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
                  }}
                >
                  <div className="overflow-hidden">
                    <Toast
                      {...toast}
                      onRemove={removeToast}
                      position={position}
                      animationDuration={animationDuration}
                      providerClasses={providerClasses}
                      providerUnstyled={providerUnstyled}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>,
          portalTarget,
        )}
    </ToastContext.Provider>
  );
};

export default ToastProvider;
