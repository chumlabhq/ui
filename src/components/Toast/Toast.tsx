import { useEffect, useRef, useCallback, memo, forwardRef, useState, useMemo } from "react";
import type { ToastProps, ToastClasses } from "./utils/types.js";
import { CloseIcon } from "./utils/icons.js";
import { getDefaultIcon } from "./utils/getDefaultIcon.js";
import { getRoleForVariant, defaultContainerStyles, DEFAULT_TOAST_CLASSES, UNSTYLED_TOAST_CLASSES } from "./utils/constants.js";
import { cn } from "../../utils/scopedCn.js";
import { mergeSlot } from "../../utils/mergeSlot.js";

import { useReducedMotion } from "../../utils/useReducedMotion.js";
/**
 * Component: Toast
 *
 * Purpose: Individual toast notification with auto-dismiss, progress bar, icons,
 * close button, and aria-live announcements.
 *
 * AI Usage Guidelines:
 * - Use via `useToast()` hook inside `<ToastProvider>`
 * - Call `toast.success()`, `.error()`, `.warning()`, `.info()` for typed toasts
 * - Use `content` prop for fully custom toast layout
 * - Use `classes` prop for per-slot styling overrides
 *
 * Reference: TOAST.ai.md (this directory), src/pages/demo/ToastDemo.tsx
 */
const Toast = memo(forwardRef<HTMLDivElement, ToastProps>(function Toast({
  id,
  variant = "info",
  message,
  description,
  content,
  duration = 5000,
  showProgress = true,
  progressColor,
  icon,
  showCloseButton = true,
  onDismiss,
  closeOnEscape = false,
  role: roleProp,
  classes: classesProp,
  unstyled = false,
  providerClasses,
  providerUnstyled = false,
  pauseOnHover = true,
  style,
  className,
  closeAriaLabel = "Close notification",
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
}, ref) {
  const deadlineRef = useRef<number>(0);
  const remainingRef = useRef<number>(duration);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const onDismissRef = useRef(onDismiss);

  useEffect(() => {
    onDismissRef.current = onDismiss;
  }, [onDismiss]);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const isPaused = hovered || focused;
  const [progressPercent, setProgressPercent] = useState(100);
  const [animDuration, setAnimDuration] = useState(duration);
  const prefersReducedMotion = useReducedMotion();

  const isUnstyled = unstyled || providerUnstyled;
  const baseClasses = isUnstyled ? UNSTYLED_TOAST_CLASSES : DEFAULT_TOAST_CLASSES;
  const mergedClasses: Required<ToastClasses> = useMemo(() => ({
    root: mergeSlot(baseClasses.root, classesProp?.root ?? providerClasses?.root),
    body: mergeSlot(baseClasses.body, classesProp?.body ?? providerClasses?.body),
    track: mergeSlot(baseClasses.track, classesProp?.track ?? providerClasses?.track),
    title: mergeSlot(baseClasses.title, classesProp?.title ?? providerClasses?.title),
    description: mergeSlot(baseClasses.description, classesProp?.description ?? providerClasses?.description),
    range: mergeSlot(baseClasses.range, classesProp?.range ?? providerClasses?.range),
    closeTrigger: mergeSlot(baseClasses.closeTrigger, classesProp?.closeTrigger ?? providerClasses?.closeTrigger),
    icon: mergeSlot(baseClasses.icon, classesProp?.icon ?? providerClasses?.icon),
  }), [classesProp, providerClasses, baseClasses]);

  const defaultIcon = getDefaultIcon(variant);
  const toastRole = roleProp ?? getRoleForVariant(variant);

  const handleClose = useCallback(() => {
    onDismissRef.current?.(id);
  }, [id]);

  // On window, in the bubble phase, so it is the last thing an Escape reaches:
  // an open dialog, drawer, menu or tooltip has already stopped the key or
  // prevented its default by then, and a marked Escape was theirs.
  useEffect(() => {
    if (!closeOnEscape) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || event.defaultPrevented) return;
      event.preventDefault();
      handleClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeOnEscape, handleClose]);

  useEffect(() => {
    if (duration === Infinity || duration <= 0 || isPaused) return;

    deadlineRef.current = Date.now() + remainingRef.current;
    setAnimDuration(remainingRef.current);

    timerRef.current = setTimeout(() => {
      handleClose();
    }, remainingRef.current);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      remainingRef.current = Math.max(0, deadlineRef.current - Date.now());
    };
  }, [duration, handleClose, isPaused]);

  useEffect(() => {
    if (duration === Infinity || duration <= 0) return;
    if (isPaused) {
      setProgressPercent((remainingRef.current / duration) * 100);
    }
  }, [isPaused, duration]);

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
      ref={(node) => {
        (toastRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }}
      id={id}
      role={toastRole}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      aria-live={toastRole === "alert" ? "assertive" : "polite"}
      aria-atomic="true"
      className={cn(
                !isUnstyled && (defaultContainerStyles[variant] ?? defaultContainerStyles.default),
        mergedClasses.root,
        className,
      )}
      style={style}
      onMouseEnter={pauseOnHover ? () => setHovered(true) : undefined}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
      }}
      data-toast-id={id}
      data-variant={variant}
    >
      <div className={mergedClasses.body || undefined}>
        {(icon || defaultIcon) && (
          <span className={cn(mergedClasses.icon)}>
            {icon ?? defaultIcon}
          </span>
        )}

        {content ? (
          <div className="flex-1 min-w-0">{content}</div>
        ) : (
          <div className="flex-1 min-w-0">
            {message && (
              <p className={cn(mergedClasses.title)}>
                {message}
              </p>
            )}
            {description && (
              <p
                className={cn(mergedClasses.description)}
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
                            mergedClasses.closeTrigger,
            )}
            aria-label={closeAriaLabel}
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        )}
      </div>

      {showProgress && hasFiniteDuration && (
        <div className={mergedClasses.track || undefined}>
          <div
            className={cn(
                            mergedClasses.range,
            )}
            style={progressAnimationStyle}
          />
        </div>
      )}
    </div>
  );
}));

Toast.displayName = "Toast";

export default Toast;
