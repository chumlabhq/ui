import { useEffect, useRef, useCallback, memo, useState, useMemo } from "react";
import type { ToastProps, ToastClasses } from "./utils/types";
import { CloseIcon } from "./utils/icons";
import { getDefaultIcon } from "./utils/getDefaultIcon";
import { getRoleForType, defaultContainerStyles, DEFAULT_TOAST_CLASSES, UNSTYLED_TOAST_CLASSES } from "./utils/constants";
import { cn } from "../../utils/cn";
import { isBrowser } from "../../utils/isBrowser";

const Toast = memo(function Toast({
  id,
  type = "info",
  message,
  description,
  content,
  duration = 5000,
  showProgress = true,
  progressColor,
  icon,
  showCloseButton = true,
  onDismiss,
  onClose,
  onRemove,
  role: roleProp,
  classes: classesProp,
  unstyled = false,
  providerClasses,
  providerUnstyled = false,
  pauseOnHover = true,
  style,
  closeAriaLabel = "Close notification",
}: ToastProps) {
  const deadlineRef = useRef<number>(0);
  const remainingRef = useRef<number>(duration);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const resolvedDismissCallback = onDismiss ?? onClose;
  const onCloseRef = useRef(resolvedDismissCallback);
  const onRemoveRef = useRef(onRemove);

  useEffect(() => {
    onCloseRef.current = onDismiss ?? onClose;
    onRemoveRef.current = onRemove;
  });
  const [isPaused, setIsPaused] = useState(false);
  const [progressPercent, setProgressPercent] = useState(100);
  const [animDuration, setAnimDuration] = useState(duration);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (!isBrowser) return false;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  });

  useEffect(() => {
    if (!isBrowser) return;
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  const isUnstyled = unstyled || providerUnstyled;
  const baseClasses = isUnstyled ? UNSTYLED_TOAST_CLASSES : DEFAULT_TOAST_CLASSES;
  const mergedClasses: Required<ToastClasses> = useMemo(() => ({
    container: classesProp?.container ?? providerClasses?.container ?? baseClasses.container,
    content: classesProp?.content ?? providerClasses?.content ?? baseClasses.content,
    message: classesProp?.message ?? providerClasses?.message ?? baseClasses.message,
    description: classesProp?.description ?? providerClasses?.description ?? baseClasses.description,
    progress: classesProp?.progress ?? providerClasses?.progress ?? baseClasses.progress,
    closeButton: classesProp?.closeButton ?? providerClasses?.closeButton ?? baseClasses.closeButton,
    icon: classesProp?.icon ?? providerClasses?.icon ?? baseClasses.icon,
  }), [classesProp, providerClasses, baseClasses]);

  const defaultIcon = getDefaultIcon(type);
  const toastRole = roleProp ?? getRoleForType(type);

  const handleClose = useCallback(() => {
    onCloseRef.current?.();
    onRemoveRef.current(id);
  }, [id]);

  useEffect(() => {
    if (duration === Infinity || duration <= 0 || isPaused) return;

    deadlineRef.current = Date.now() + remainingRef.current;
    setAnimDuration(remainingRef.current);

    timerRef.current = setTimeout(() => {
      handleClose();
    }, remainingRef.current);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [duration, handleClose, isPaused]);

  useEffect(() => {
    if (duration === Infinity || duration <= 0) return;
    if (isPaused) {
      setProgressPercent((remainingRef.current / duration) * 100);
    }
  }, [isPaused, duration]);

  const handleMouseEnter = useCallback(() => {
    if (pauseOnHover && duration !== Infinity && duration > 0) {
      if (timerRef.current) clearTimeout(timerRef.current);
      remainingRef.current = Math.max(0, deadlineRef.current - Date.now());
      setIsPaused(true);
    }
  }, [pauseOnHover, duration]);

  const handleMouseLeave = useCallback(() => {
    if (pauseOnHover && duration !== Infinity && duration > 0) {
      setIsPaused(false);
    }
  }, [pauseOnHover, duration]);

  const hasFiniteDuration = duration !== Infinity && duration > 0;
  const progressAnimationStyle: React.CSSProperties | undefined =
    hasFiniteDuration && showProgress
      ? isPaused || prefersReducedMotion
        ? { width: `${progressPercent}%`, backgroundColor: progressColor }
        : {
            width: "0%",
            backgroundColor: progressColor,
            animation: `chumlab-toast-progress ${animDuration}ms linear forwards`,
          }
      : undefined;

  return (
    <div
      ref={toastRef}
      role={toastRole}
      aria-live={toastRole === "alert" ? "assertive" : "polite"}
      aria-atomic="true"
      className={cn(
        !isUnstyled && "relative overflow-hidden rounded-lg border shadow-lg",
        !isUnstyled && (defaultContainerStyles[type] ?? defaultContainerStyles.default),
        mergedClasses.container,
      )}
      style={style}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-toast-id={id}
      data-toast-type={type}
    >
      <div className={cn(!isUnstyled && "flex items-start gap-3 p-4", mergedClasses.content)}>
        {(icon || defaultIcon) && (
          <span className={cn(!isUnstyled && "text-white", mergedClasses.icon)}>
            {icon ?? defaultIcon}
          </span>
        )}

        {content ? (
          <div className="flex-1 min-w-0">{content}</div>
        ) : (
          <div className="flex-1 min-w-0">
            {message && (
              <p className={cn(!isUnstyled && "font-medium text-sm", mergedClasses.message)}>
                {message}
              </p>
            )}
            {description && (
              <p
                className={cn(!isUnstyled && "text-sm mt-1 opacity-80", mergedClasses.description)}
              >
                {description}
              </p>
            )}
          </div>
        )}

        {showCloseButton && (
          <button
            ref={closeButtonRef}
            type="button"
            onClick={handleClose}
            className={cn(
              !isUnstyled && "cursor-pointer shrink-0 p-1 rounded hover:bg-white/20 transition-colors",
              mergedClasses.closeButton,
            )}
            aria-label={closeAriaLabel}
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        )}
      </div>

      {showProgress && hasFiniteDuration && (
        <div className={cn(!isUnstyled && "absolute bottom-0 left-0 right-0 h-1 bg-white/20")}>
          <div
            className={cn(
              !isUnstyled && "h-full bg-white/40",
              mergedClasses.progress,
            )}
            style={progressAnimationStyle}
          />
        </div>
      )}
    </div>
  );
});

export default Toast;
