import { useEffect, useRef, useCallback, memo, useState } from "react";
import type { ToastProps } from "./utils/types";
import { CloseIcon, getDefaultIcon } from "./utils/icons";
import { getRoleForType, defaultContainerStyles } from "./utils/constants";
import { cn } from "../../utils/cn";

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
  onClose,
  onRemove,
  visible,
  position,
  role: roleProp,
  className,
  contentClassName,
  messageClassName,
  descriptionClassName,
  progressClassName,
  closeButtonClassName,
  iconClassName,
  pauseOnHover = true,
  animationDuration = 200,
  style,
  closeAriaLabel = "Close notification",
}: ToastProps) {
  const deadlineRef = useRef<number>(0);
  const remainingRef = useRef<number>(duration);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  const onRemoveRef = useRef(onRemove);

  useEffect(() => {
    onCloseRef.current = onClose;
    onRemoveRef.current = onRemove;
  });
  const [isPaused, setIsPaused] = useState(false);
  const [progressPercent, setProgressPercent] = useState(100);
  const [animDuration, setAnimDuration] = useState(duration);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

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

  const isTopPosition = position.startsWith("top");
  const animationClass = visible
    ? isTopPosition
      ? "animate-toast-enter-top motion-reduce:animate-none"
      : "animate-toast-enter-bottom motion-reduce:animate-none"
    : isTopPosition
      ? "animate-toast-leave-top motion-reduce:animate-none motion-reduce:opacity-0"
      : "animate-toast-leave-bottom motion-reduce:animate-none motion-reduce:opacity-0";

  const hasFiniteDuration = duration !== Infinity && duration > 0;
  const progressAnimationStyle: React.CSSProperties | undefined =
    hasFiniteDuration && showProgress
      ? isPaused || prefersReducedMotion
        ? { width: `${progressPercent}%`, backgroundColor: progressColor }
        : {
            width: "0%",
            backgroundColor: progressColor,
            animation: `kern-toast-progress ${animDuration}ms linear forwards`,
          }
      : undefined;

  return (
    <div
      ref={toastRef}
      role={toastRole}
      aria-atomic="true"
      className={cn(
        "relative overflow-hidden rounded-lg border shadow-lg",
        defaultContainerStyles[type] ?? defaultContainerStyles.default,
        animationClass,
        className,
      )}
      style={{
        ...style,
        animationDuration: `${animationDuration}ms`,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-toast-id={id}
      data-toast-type={type}
    >
      <div className={cn("flex items-start gap-3 p-4", contentClassName)}>
        {(icon || defaultIcon) && (
          <span className={cn("text-white", iconClassName)}>
            {icon ?? defaultIcon}
          </span>
        )}

        {content ? (
          <div className="flex-1 min-w-0">{content}</div>
        ) : (
          <div className="flex-1 min-w-0">
            {message && (
              <p className={cn("font-medium text-sm", messageClassName)}>
                {message}
              </p>
            )}
            {description && (
              <p
                className={cn("text-sm mt-1 opacity-80", descriptionClassName)}
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
              "cursor-pointer shrink-0 p-1 rounded hover:bg-white/20 transition-colors",
              closeButtonClassName,
            )}
            aria-label={closeAriaLabel}
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        )}
      </div>

      {showProgress && hasFiniteDuration && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
          <div
            className={cn(
              "h-full bg-white/40",
              progressClassName,
            )}
            style={progressAnimationStyle}
          />
        </div>
      )}
    </div>
  );
});

export default Toast;
