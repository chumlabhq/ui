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
import { useReducedMotion } from "../../utils/useReducedMotion";
import {
  DEFAULT_DRAWER_CLASSES,
  UNSTYLED_DRAWER_CLASSES,
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
import { mergeRefs } from "../../utils/mergeRefs";

import { isBrowser } from "../../utils/isBrowser";

/**
 * Component: Drawer
 *
 * Purpose: Sliding panel overlay with focus trapping, scroll lock, swipe-to-close,
 * snap points, stacked drawer support, and accessible keyboard navigation.
 *
 * AI Usage Guidelines:
 * - Use `direction` for slide direction (left/right/top/bottom)
 * - Use DrawerHeader/Body/Footer/CloseButton as children
 * - Use `swipeable` + `snapPoints` for bottom sheet patterns
 * - Focus is trapped and restored automatically
 *
 * Reference: DRAWER.ai.md (this directory), src/pages/demo/DrawerDemo.tsx
 */
const Drawer = forwardRef<HTMLDivElement, DrawerProps>(
  (
    {
      open,
      defaultOpen = false,
      onOpenChange,
      zIndex = 9999,
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
      classes: classesProp,
      unstyled = false,
      reduceMotion: reduceMotionProp,
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
    const [isOpen, setIsOpen] = useControllableState({
      value: open,
      defaultValue: defaultOpen,
      onChange: onOpenChange,
    });

    const handleClose = useCallback(() => {
      setIsOpen(false);
    }, [setIsOpen]);

    const generatedId = useId();
    const drawerId = `drawer-${generatedId}`;
    const titleId = `drawer-title-${generatedId}`;
    const panelRef = useRef<HTMLDivElement>(null);
    const mergedPanelRef = useMemo(() => mergeRefs(panelRef, ref), [ref]);
    const triggerRef = useRef<Element | null>(null);
    const [mounted, setMounted] = useState(isOpen);
    const [visualOpen, setVisualOpen] = useState(false);
    const prefersReducedMotion = useReducedMotion(reduceMotionProp);

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

    const baseClasses = unstyled ? UNSTYLED_DRAWER_CLASSES : DEFAULT_DRAWER_CLASSES;
    const mergedClasses: Required<DrawerClasses> = useMemo(
      () => ({
        root: classesProp?.root ?? baseClasses.root,
        overlay: classesProp?.overlay ?? baseClasses.overlay,
        panel: classesProp?.panel ?? baseClasses.panel,
      }),
      [classesProp, baseClasses],
    );

    const drawerStyles = useMemo(
      () => getDirectionStyles(direction, size, fraction, effectiveDuration),
      [direction, size, fraction, effectiveDuration],
    );

    /* eslint-disable react-hooks/set-state-in-effect -- synchronizes mount/visual state with isOpen prop */
    useEffect(() => {
      if (isOpen && !mounted) {
        setMounted(true);
      }
      if (!isOpen && visualOpen) {
        setVisualOpen(false);
      }
    }, [isOpen, mounted, visualOpen]);
    /* eslint-enable react-hooks/set-state-in-effect */

    useEffect(() => {
      if (!isOpen && !keepMounted) {
        const timer = setTimeout(() => setMounted(false), effectiveDuration);
        return () => clearTimeout(timer);
      }
    }, [isOpen, effectiveDuration, keepMounted]);

    useEffect(() => {
      if (mounted && isOpen) {
        const raf = requestAnimationFrame(() => {
          setVisualOpen(true);
        });
        return () => cancelAnimationFrame(raf);
      }
    }, [mounted, isOpen]);

    const prevOpenRef = useRef(isOpen);
    useEffect(() => {
      const changed = prevOpenRef.current !== isOpen;
      prevOpenRef.current = isOpen;

      if (!changed || !onTransitionEndProp) return;
      const timer = setTimeout(
        () => onTransitionEndProp(isOpen),
        effectiveDuration,
      );
      return () => clearTimeout(timer);
    }, [isOpen, effectiveDuration, onTransitionEndProp]);

    const prevOpenForCapture = useRef(false);
    useEffect(() => {
      const wasOpen = prevOpenForCapture.current;
      prevOpenForCapture.current = isOpen;

      if (isOpen && !wasOpen && restoreFocus && modal) {
        triggerRef.current = document.activeElement;
      }
    }, [isOpen, restoreFocus, modal]);

    useEffect(() => {
      if (!isOpen && restoreFocus && modal && triggerRef.current) {
        const el = triggerRef.current as HTMLElement;
        triggerRef.current = null;
        if (typeof el.focus === "function") {
          el.focus();
        }
      }
    }, [isOpen, restoreFocus, modal]);

    useEffect(() => {
      if (isOpen && modal) {
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
    }, [isOpen, modal, initialFocus]);

    useEffect(() => {
      if (isOpen) {
        pushDrawer(drawerId);
        return () => popDrawer(drawerId);
      }
    }, [isOpen, drawerId]);

    const handleKeyDown = useCallback(
      (event: KeyboardEvent) => {
        if (event.key === "Escape" && closeOnEscape) {
          if (!isTopDrawer(drawerId)) return;
          event.stopImmediatePropagation();
          handleClose();
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
      [handleClose, closeOnEscape, trapFocus, modal, drawerId],
    );

    const handleOverlayClick = useCallback(() => {
      if (closeOnOverlayClick) {
        handleClose();
      }
    }, [closeOnOverlayClick, handleClose]);

    useEffect(() => {
      if (!isBrowser) return;
      if (lockScroll && isOpen && modal) {
        acquireScrollLock();
        return () => releaseScrollLock();
      }
    }, [isOpen, lockScroll, modal]);

    useEffect(() => {
      if (!isBrowser) return;
      if (isOpen) {
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
      }
    }, [isOpen, handleKeyDown]);

    const dragRef = useRef({
      startX: 0,
      startY: 0,
      startTime: 0,
      isDragging: false,
      hasMoved: false,
    });

    const handlePanelPointerDown = useCallback(
      (e: React.PointerEvent) => {
        if (!swipeable || !isOpen) return;

        dragRef.current = {
          startX: e.clientX,
          startY: e.clientY,
          startTime: Date.now(),
          isDragging: true,
          hasMoved: false,
        };
      },
      [swipeable, isOpen],
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
            handleClose();
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
            handleClose();
          }
        }
      },
      [
        direction,
        hasSnapPoints,
        snapPoints,
        clampedSnapIndex,
        swipeThreshold,
        handleClose,
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
      () => ({ onClose: handleClose, titleId }),
      [handleClose, titleId],
    );

    if (!isBrowser) return null;
    if (!keepMounted && !mounted) return null;

    const container = portalContainer ?? document.body;
    const isClosed = !isOpen;
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
            style={{ zIndex }}
            data-state={isOpen ? "open" : "closed"}
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
              ref={mergedPanelRef}
              role="dialog"
              aria-modal={modal || undefined}
              aria-label={ariaLabel ?? (!ariaLabelledBy && !titleId ? "Dialog" : undefined)}
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
