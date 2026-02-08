import {
  forwardRef,
  useEffect,
  useCallback,
  useMemo,
  useId,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import type { DrawerProps, DrawerClasses } from "./utils/types";
import {
  getDirectionStyles,
  getFocusableElements,
  usePrefersReducedMotion,
  getClosingDelta,
  getTransformString,
  isHorizontalDirection,
  getTouchAction,
  pushDrawer,
  popDrawer,
  isTopDrawer,
  acquireScrollLock,
  releaseScrollLock,
} from "./utils/helpers";
import {
  DEFAULT_CLASS_NAMES,
  DEFAULT_DIRECTION,
  DEFAULT_SIZE,
  DEFAULT_OVERLAY_COLOR,
  DEFAULT_OVERLAY_OPACITY,
  DEFAULT_OVERLAY_BLUR,
  DEFAULT_DURATION,
  DEFAULT_SWIPE_THRESHOLD,
  DEFAULT_SNAP_POINT_INDEX,
  SWIPE_DEADZONE,
  VELOCITY_THRESHOLD,
} from "./utils/constants";
import { DrawerContext } from "./utils/context";
import { useControllableState } from "../../utils/useControllableState";
import { cn } from "../../utils/cn";

const isBrowser = typeof document !== "undefined";

const Drawer = forwardRef<HTMLDivElement, DrawerProps>(
  (
    {
      open,
      onClose,
      children,
      direction = DEFAULT_DIRECTION,
      size = DEFAULT_SIZE,
      overlayColor = DEFAULT_OVERLAY_COLOR,
      overlayOpacity = DEFAULT_OVERLAY_OPACITY,
      overlayBlur = DEFAULT_OVERLAY_BLUR,
      duration = DEFAULT_DURATION,
      lockScroll = true,
      closeOnOverlayClick = true,
      closeOnEscape = true,
      classes = {},
      trapFocus = true,
      restoreFocus = true,
      portalContainer,
      initialFocus,
      onTransitionEnd: onTransitionEndProp,
      keepMounted = false,
      modal = true,
      swipeable = false,
      swipeThreshold = DEFAULT_SWIPE_THRESHOLD,
      snapPoints,
      activeSnapPointIndex,
      defaultSnapPointIndex = DEFAULT_SNAP_POINT_INDEX,
      onSnapPointIndexChange,
      className,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      "aria-describedby": ariaDescribedBy,
      ...rest
    },
    ref,
  ) => {
    const generatedId = useId();
    const drawerId = `drawer-${generatedId}`;
    const titleId = `drawer-title-${generatedId}`;
    const panelRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<Element | null>(null);
    const restoreRafRef = useRef<number>(0);
    const [mounted, setMounted] = useState(open);
    const [visualOpen, setVisualOpen] = useState(false);
    const prefersReducedMotion = usePrefersReducedMotion();

    const safeActiveSnap =
      activeSnapPointIndex !== undefined
        ? Math.max(0, Math.floor(activeSnapPointIndex))
        : undefined;

    const [currentSnapIndex, setSnapIndex] = useControllableState({
      value: safeActiveSnap,
      defaultValue: Math.max(0, Math.floor(defaultSnapPointIndex)),
      onChange: onSnapPointIndexChange,
    });

    const effectiveDuration = prefersReducedMotion ? 0 : duration;

    const hasSnapPoints = snapPoints !== undefined && snapPoints.length > 0;
    const clampedSnapIndex = hasSnapPoints
      ? Math.min(
          Math.max(0, Math.floor(currentSnapIndex)),
          snapPoints!.length - 1,
        )
      : 0;

    const fraction = visualOpen
      ? hasSnapPoints
        ? snapPoints![clampedSnapIndex]
        : 1
      : 0;

    const mergedClasses: Required<DrawerClasses> = useMemo(
      () => ({
        root: cn(DEFAULT_CLASS_NAMES.root, classes.root),
        overlay: cn(DEFAULT_CLASS_NAMES.overlay, classes.overlay),
        panel: cn(DEFAULT_CLASS_NAMES.panel, classes.panel),
      }),
      [classes],
    );

    const drawerStyles = useMemo(
      () => getDirectionStyles(direction, size, fraction, effectiveDuration),
      [direction, size, fraction, effectiveDuration],
    );

    if (open && !mounted) {
      setMounted(true);
    }

    if (!open && visualOpen) {
      setVisualOpen(false);
    }

    useEffect(() => {
      if (!open && !keepMounted) {
        const timer = setTimeout(() => setMounted(false), effectiveDuration);
        return () => clearTimeout(timer);
      }
    }, [open, effectiveDuration, keepMounted]);

    useEffect(() => {
      if (mounted && open) {
        const raf = requestAnimationFrame(() => {
          setVisualOpen(true);
        });
        return () => cancelAnimationFrame(raf);
      }
    }, [mounted, open]);

    const prevOpenRef = useRef(open);
    useEffect(() => {
      const changed = prevOpenRef.current !== open;
      prevOpenRef.current = open;

      if (!changed || !onTransitionEndProp) return;
      const timer = setTimeout(
        () => onTransitionEndProp(open),
        effectiveDuration,
      );
      return () => clearTimeout(timer);
    }, [open, effectiveDuration, onTransitionEndProp]);

    const prevOpenForCapture = useRef(false);
    useEffect(() => {
      const wasOpen = prevOpenForCapture.current;
      prevOpenForCapture.current = open;

      if (open && !wasOpen && restoreFocus && modal) {
        triggerRef.current = document.activeElement;
      }
    }, [open, restoreFocus, modal]);

    useEffect(() => {
      if (!open && restoreFocus && modal && triggerRef.current) {
        const el = triggerRef.current as HTMLElement;
        triggerRef.current = null;
        if (typeof el.focus === "function") {
          restoreRafRef.current = requestAnimationFrame(() => {
            el.focus();
            restoreRafRef.current = 0;
          });
        }
      }
      return () => {
        if (restoreRafRef.current) {
          cancelAnimationFrame(restoreRafRef.current);
          restoreRafRef.current = 0;
        }
      };
    }, [open, restoreFocus, modal]);

    useEffect(() => {
      if (open && modal) {
        const panel = panelRef.current;
        if (!panel) return;

        const timer = requestAnimationFrame(() => {
          if (initialFocus?.current) {
            initialFocus.current.focus();
            return;
          }

          const autoFocusEl =
            panel.querySelector<HTMLElement>("[data-autofocus]");
          if (autoFocusEl) {
            autoFocusEl.focus();
            return;
          }

          const focusable = getFocusableElements(panel);
          if (focusable.length > 0) {
            focusable[0].focus();
            return;
          }

          panel.focus();
        });

        return () => cancelAnimationFrame(timer);
      }
    }, [open, modal, initialFocus]);

    useEffect(() => {
      if (open) {
        pushDrawer(drawerId);
        return () => popDrawer(drawerId);
      }
    }, [open, drawerId]);

    const handleKeyDown = useCallback(
      (event: KeyboardEvent) => {
        if (event.key === "Escape" && closeOnEscape) {
          if (!isTopDrawer(drawerId)) return;
          event.stopImmediatePropagation();
          onClose();
          return;
        }

        if (event.key === "Tab" && trapFocus && modal) {
          const panel = panelRef.current;
          if (!panel) return;

          const focusable = getFocusableElements(panel);
          if (focusable.length === 0) {
            event.preventDefault();
            return;
          }

          const first = focusable[0];
          const last = focusable[focusable.length - 1];

          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }
      },
      [onClose, closeOnEscape, trapFocus, modal, drawerId],
    );

    const handleOverlayClick = useCallback(() => {
      if (closeOnOverlayClick) {
        onClose();
      }
    }, [closeOnOverlayClick, onClose]);

    useEffect(() => {
      if (!isBrowser) return;
      if (lockScroll && open && modal) {
        acquireScrollLock();
        return () => releaseScrollLock();
      }
    }, [open, lockScroll, modal]);

    useEffect(() => {
      if (!isBrowser) return;
      if (open) {
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
      }
    }, [open, handleKeyDown]);

    const dragRef = useRef({
      startX: 0,
      startY: 0,
      startTime: 0,
      isDragging: false,
      hasMoved: false,
    });

    const handlePanelPointerDown = useCallback(
      (e: React.PointerEvent) => {
        if (!swipeable || !open) return;

        dragRef.current = {
          startX: e.clientX,
          startY: e.clientY,
          startTime: Date.now(),
          isDragging: true,
          hasMoved: false,
        };
      },
      [swipeable, open],
    );

    const handlePanelPointerMove = useCallback(
      (e: React.PointerEvent) => {
        if (!dragRef.current.isDragging) return;

        const deltaX = e.clientX - dragRef.current.startX;
        const deltaY = e.clientY - dragRef.current.startY;
        const panel = panelRef.current;
        if (!panel) return;

        if (!dragRef.current.hasMoved) {
          const totalDelta = Math.abs(deltaX) + Math.abs(deltaY);
          if (totalDelta < SWIPE_DEADZONE) return;
          dragRef.current.hasMoved = true;
          panel.setPointerCapture(e.pointerId);
        }

        const closingDelta = getClosingDelta(direction, deltaX, deltaY);

        if (closingDelta <= 0) {
          panel.style.transform = "";
          panel.style.transition = "";
          return;
        }

        const horizontal = isHorizontalDirection(direction);
        const panelSize = horizontal ? panel.offsetWidth : panel.offsetHeight;
        const baseFraction = hasSnapPoints
          ? snapPoints![clampedSnapIndex]
          : 1;
        const dragFraction = closingDelta / panelSize;
        const newFraction = Math.max(0, baseFraction - dragFraction);
        const closedPercent = (1 - newFraction) * 100;

        panel.style.transition = "none";
        panel.style.transform = getTransformString(direction, closedPercent);
      },
      [direction, hasSnapPoints, snapPoints, clampedSnapIndex],
    );

    const handlePanelPointerUp = useCallback(
      (e: React.PointerEvent) => {
        if (!dragRef.current.isDragging) return;

        const { startX, startY, startTime, hasMoved } = dragRef.current;
        dragRef.current.isDragging = false;
        dragRef.current.hasMoved = false;

        const panel = panelRef.current;
        if (panel) {
          try {
            panel.releasePointerCapture(e.pointerId);
          } catch {
            /* noop */
          }
          panel.style.transition = "";
          panel.style.transform = "";
        }

        if (!hasMoved) return;

        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        const elapsed = Date.now() - startTime;
        const closingDelta = getClosingDelta(direction, deltaX, deltaY);

        if (closingDelta <= 0) return;

        const horizontal = isHorizontalDirection(direction);
        const panelSize = panel
          ? horizontal
            ? panel.offsetWidth
            : panel.offsetHeight
          : 300;
        const dragFraction = closingDelta / panelSize;
        const velocity = closingDelta / Math.max(elapsed, 1);

        if (hasSnapPoints && snapPoints!.length > 0) {
          const baseFraction = snapPoints![clampedSnapIndex];
          const currentFraction = baseFraction - dragFraction;

          if (
            currentFraction <= 0 ||
            (velocity > VELOCITY_THRESHOLD && clampedSnapIndex === 0)
          ) {
            onClose();
            return;
          }

          let targetIndex = clampedSnapIndex;
          if (velocity > VELOCITY_THRESHOLD) {
            targetIndex = Math.max(0, clampedSnapIndex - 1);
          } else {
            let minDist = Infinity;
            for (let i = 0; i < snapPoints!.length; i++) {
              const dist = Math.abs(snapPoints![i] - currentFraction);
              if (dist < minDist) {
                minDist = dist;
                targetIndex = i;
              }
            }
          }

          if (targetIndex !== clampedSnapIndex) {
            setSnapIndex(targetIndex);
          }
        } else {
          if (
            dragFraction > swipeThreshold ||
            velocity > VELOCITY_THRESHOLD
          ) {
            onClose();
          }
        }
      },
      [
        direction,
        hasSnapPoints,
        snapPoints,
        clampedSnapIndex,
        swipeThreshold,
        onClose,
        setSnapIndex,
      ],
    );

    const handlePanelPointerCancel = useCallback(() => {
      if (dragRef.current.isDragging || dragRef.current.hasMoved) {
        dragRef.current.isDragging = false;
        dragRef.current.hasMoved = false;
        const panel = panelRef.current;
        if (panel) {
          panel.style.transition = "";
          panel.style.transform = "";
        }
      }
    }, []);

    const contextValue = useMemo(
      () => ({ onClose, titleId }),
      [onClose, titleId],
    );

    if (!isBrowser) return null;
    if (!keepMounted && !mounted) return null;

    const container = portalContainer ?? document.body;
    const isClosed = !open;
    const isHiddenMounted = keepMounted && isClosed;

    return (
      <DrawerContext.Provider value={contextValue}>
        {createPortal(
          <div
            {...rest}
            id={drawerId}
            className={
              cn(
                modal && "fixed inset-0",
                modal &&
                  (visualOpen
                    ? lockScroll
                      ? "pointer-events-auto"
                      : "pointer-events-none"
                    : "pointer-events-none"),
                mergedClasses.root,
              ) || undefined
            }
            data-state={open ? "open" : "closed"}
            data-direction={direction}
            aria-hidden={isHiddenMounted || undefined}
          >
            {modal && (
              <div
                className={
                  cn(
                    mergedClasses.overlay,
                    !lockScroll && "pointer-events-none",
                  ) || undefined
                }
                style={{
                  backgroundColor: overlayColor,
                  opacity: visualOpen ? overlayOpacity : 0,
                  transitionDuration: `${effectiveDuration}ms`,
                  ...(overlayBlur > 0 && visualOpen
                    ? {
                        backdropFilter: `blur(${overlayBlur}px)`,
                        WebkitBackdropFilter: `blur(${overlayBlur}px)`,
                      }
                    : {}),
                }}
                onClick={handleOverlayClick}
                aria-hidden="true"
                data-drawer-overlay
              />
            )}

            <div
              ref={(node) => {
                (
                  panelRef as React.MutableRefObject<HTMLDivElement | null>
                ).current = node;
                if (typeof ref === "function") ref(node);
                else if (ref)
                  (
                    ref as React.MutableRefObject<HTMLDivElement | null>
                  ).current = node;
              }}
              role="dialog"
              aria-modal={modal || undefined}
              aria-label={ariaLabel}
              aria-labelledby={
                ariaLabelledBy ?? (!ariaLabel ? titleId : undefined)
              }
              aria-describedby={ariaDescribedBy}
              tabIndex={-1}
              inert={isHiddenMounted || undefined}
              className={
                cn(
                  mergedClasses.panel,
                  modal && !lockScroll && "pointer-events-auto",
                  !modal &&
                    (visualOpen
                      ? "pointer-events-auto"
                      : "pointer-events-none"),
                  className,
                ) || undefined
              }
              style={{
                ...drawerStyles,
                ...(swipeable
                  ? { touchAction: getTouchAction(direction) }
                  : {}),
              }}
              data-drawer-panel
              data-direction={direction}
              onPointerDown={swipeable ? handlePanelPointerDown : undefined}
              onPointerMove={swipeable ? handlePanelPointerMove : undefined}
              onPointerUp={swipeable ? handlePanelPointerUp : undefined}
              onPointerCancel={
                swipeable ? handlePanelPointerCancel : undefined
              }
            >
              {children}
            </div>
          </div>,
          container,
        )}
      </DrawerContext.Provider>
    );
  },
);

Drawer.displayName = "Drawer";

export default Drawer;
