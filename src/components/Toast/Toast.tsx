import { useEffect, useRef, useState, useCallback, memo } from "react";
import type { ToastProps, ToastType } from "./types";
import {
  SuccessIcon,
  WarningIcon,
  ErrorIcon,
  InfoIcon,
  CloseIcon,
} from "./icons";
import { cn } from "../../utils/cn";

const getDefaultIcon = (type: ToastType) => {
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

const defaultContainerStyles: Record<ToastType | "default", string> = {
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
  className,
  contentClassName,
  messageClassName,
  descriptionClassName,
  progressClassName,
  closeButtonClassName,
  iconClassName,
  pauseOnHover = true,
  dismissOnEscape = false,
  style,
}: ToastProps) {
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);
  const startTimeRef = useRef<number>(0);
  const remainingTimeRef = useRef<number>(duration);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const initializedRef = useRef(false);
  const toastRef = useRef<HTMLDivElement>(null);

  const defaultIcon = getDefaultIcon(type);

  const handleClose = useCallback(() => {
    onClose?.();
    onRemove(id);
  }, [id, onClose, onRemove]);

  useEffect(() => {
    if (!dismissOnEscape) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [dismissOnEscape, handleClose]);

  useEffect(() => {
    if (duration === Infinity || duration <= 0) return;

    if (!initializedRef.current) {
      startTimeRef.current = Date.now();
      initializedRef.current = true;
    }

    const updateProgress = () => {
      if (isPaused) {
        animationFrameRef.current = requestAnimationFrame(updateProgress);
        return;
      }

      const elapsed = Date.now() - startTimeRef.current;
      const remaining = remainingTimeRef.current - elapsed;
      const newProgress = (remaining / duration) * 100;

      if (remaining <= 0) {
        setProgress(0);
        handleClose();
        return;
      }

      setProgress(Math.max(0, newProgress));
      animationFrameRef.current = requestAnimationFrame(updateProgress);
    };

    animationFrameRef.current = requestAnimationFrame(updateProgress);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [duration, isPaused, handleClose]);

  const handleMouseEnter = useCallback(() => {
    if (pauseOnHover && duration !== Infinity && duration > 0) {
      setIsPaused(true);
      remainingTimeRef.current = (progress / 100) * duration;
    }
  }, [pauseOnHover, duration, progress]);

  const handleMouseLeave = useCallback(() => {
    if (pauseOnHover && duration !== Infinity && duration > 0) {
      setIsPaused(false);
      startTimeRef.current = Date.now();
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

  return (
    <div
      ref={toastRef}
      role="alert"
      className={cn(
        "relative overflow-hidden rounded-lg border shadow-lg min-w-[300px] max-w-[420px]",
        defaultContainerStyles[type] ?? defaultContainerStyles.default,
        animationClass,
        className
      )}
      style={style}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-toast-id={id}
      data-toast-type={type}
      data-paused={isPaused || undefined}
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
            type="button"
            onClick={handleClose}
            className={cn(
              "cursor-pointer shrink-0 p-1 rounded hover:bg-white/20 transition-colors",
              closeButtonClassName,
            )}
            aria-label="Close notification"
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        )}
      </div>

      {showProgress && duration !== Infinity && duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
          <div
            className={cn(
              "h-full transition-none bg-white/40",
              progressClassName,
            )}
            style={{ width: `${progress}%`, backgroundColor: progressColor }}
          />
        </div>
      )}
    </div>
  );
});

export default Toast;
