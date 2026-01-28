import { useEffect, useRef, useState, useCallback, memo } from "react";
import type { ToastProps, ToastType } from "./types";
import {
  SuccessIcon,
  WarningIcon,
  ErrorIcon,
  InfoIcon,
  CloseIcon,
} from "./icons";

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

const getDefaultStyles = (type: ToastType) => {
  switch (type) {
    case "success":
      return {
        container: "bg-[#195030] border-[#195030] text-white",
        icon: "text-white",
        progress: "bg-white/40",
      };
    case "warning":
      return {
        container: "bg-[#665823] border-[#665823] text-white",
        icon: "text-white",
        progress: "bg-white/40",
      };
    case "error":
      return {
        container: "bg-[#82363a] border-[#82363a] text-white",
        icon: "text-white",
        progress: "bg-white/40",
      };
    case "info":
      return {
        container: "bg-[#213f70] border-[#213f70] text-white",
        icon: "text-white",
        progress: "bg-white/40",
      };
    default:
      return {
        container: "bg-gray-700 border-gray-700 text-white",
        icon: "text-white",
        progress: "bg-white/40",
      };
  }
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
  className = "",
  contentClassName = "",
  messageClassName = "",
  descriptionClassName = "",
  progressClassName = "",
  closeButtonClassName = "",
  iconClassName = "",
  pauseOnHover = true,
}: ToastProps) {
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);
  const startTimeRef = useRef<number>(0);
  const remainingTimeRef = useRef<number>(duration);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const initializedRef = useRef(false);

  const defaultStyles = getDefaultStyles(type);
  const defaultIcon = getDefaultIcon(type);

  const handleClose = useCallback(() => {
    onClose?.();
    onRemove(id);
  }, [id, onClose, onRemove]);

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
      ? "animate-toast-enter-top"
      : "animate-toast-enter-bottom"
    : isTopPosition
      ? "animate-toast-leave-top"
      : "animate-toast-leave-bottom";

  return (
    <div
      role="alert"
      aria-live="polite"
      className={[
        "relative overflow-hidden rounded-lg border shadow-lg min-w-[300px] max-w-[420px]",
        defaultStyles.container,
        animationClass,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-toast-id={id}
      data-toast-type={type}
      data-paused={isPaused || undefined}
    >
      <div
        className={["flex items-start gap-3 p-4", contentClassName]
          .filter(Boolean)
          .join(" ")}
      >
        {(icon || defaultIcon) && (
          <span
            className={[defaultStyles.icon, iconClassName]
              .filter(Boolean)
              .join(" ")}
          >
            {icon ?? defaultIcon}
          </span>
        )}

        {content ? (
          <div className="flex-1 min-w-0">{content}</div>
        ) : (
          <div className="flex-1 min-w-0">
            {message && (
              <p
                className={["font-medium text-sm", messageClassName]
                  .filter(Boolean)
                  .join(" ")}
              >
                {message}
              </p>
            )}
            {description && (
              <p
                className={["text-sm mt-1 opacity-80", descriptionClassName]
                  .filter(Boolean)
                  .join(" ")}
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
            className={[
              "cursor-pointer shrink-0 p-1 rounded hover:bg-white/20 transition-colors",
              closeButtonClassName,
            ]
              .filter(Boolean)
              .join(" ")}
            aria-label="Close notification"
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        )}
      </div>

      {showProgress && duration !== Infinity && duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
          <div
            className={[
              "h-full transition-none",
              progressColor || defaultStyles.progress,
              progressClassName,
            ]
              .filter(Boolean)
              .join(" ")}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
});

export default Toast;
