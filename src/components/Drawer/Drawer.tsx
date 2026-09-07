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
import { LAYERS, OverlayLayerContext } from "../../utils/layers.js";
import type { DrawerProps, DrawerClasses } from "./utils/types.js";
import { cycleTabWithin } from "../../utils/focusUtils.js";
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
} from "./utils/helpers.js";
import { useReducedMotion } from "../../utils/useReducedMotion.js";
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
} from "./utils/constants.js";
import { DrawerContext } from "./utils/context.js";
import { useControllableState } from "../../utils/useControllableState.js";
import { cn } from "../../utils/scopedCn.js";
import { mergeRefs } from "../../utils/mergeRefs.js";

import { useHydrated } from "../../utils/useHydrated.js";
import { isBrowser } from "../../utils/isBrowser.js";
import { useAccessibleNameWarning } from "../../utils/useAccessibleNameWarning.js";

import { motionSafeClasses } from "../../utils/classLayers.js";
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
      zIndex = LAYERS.overlay,
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
    const [hasTitle, setHasTitle] = useState(false);

    /**
     * A dialog is not named by its contents, so a drawer composed without a
     * `DrawerHeader` and without `aria-label` has no name at all. It used to
     * point `aria-labelledby` at the header's id regardless, which was a name
     * that resolved to nothing; removing that made the silence visible.
     *
     * The header registers in an effect, and a child's effect runs before its
     * parent's, so `hasTitle` is already true here when one is rendered.
     */
    useAccessibleNameWarning("Drawer", {
      label: hasTitle || undefined,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
    });
    const panelRef = useRef<HTMLDivElement>(null);
    const mergedPanelRef = useMemo(() => mergeRefs(panelRef, ref), [ref]);
    const triggerRef = useRef<Element | null>(null);
    const [mounted, setMounted] = useState(isOpen);
    // Same as Modal: open on first paint is the case that mismatched.
    const hydrated = useHydrated();
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

    const baseClassesRaw = unstyled ? UNSTYLED_DRAWER_CLASSES : DEFAULT_DRAWER_CLASSES;

    const baseClasses = motionSafeClasses(baseClassesRaw, prefersReducedMotion);
    const mergedClasses: Required<DrawerClasses> = useMemo(
      () => ({
        root: classesProp?.root ?? baseClasses.root,
        overlay: classesProp?.overlay ?? baseClasses.overlay,
        content: classesProp?.content ?? baseClasses.content,
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
          el.focus({ preventScroll: true });
        }
      }
    }, [isOpen, restoreFocus, modal]);

    useEffect(() => {
      if (isOpen && modal) {
        const panel = panelRef.current;
        if (!panel) return;

        const timer = requestAnimationFrame(() => {
          if (initialFocus?.current) {
            initialFocus.current.focus({ preventScroll: true });
            return;
          }

          const autoFocusEl =
            panel.querySelector<HTMLElement>("[data-autofocus]");
          if (autoFocusEl) {
            autoFocusEl.focus({ preventScroll: true });
            return;
          }

          const focusable = getFocusableElements(panel);
          if (focusable.length > 0) {
            focusable[0].focus({ preventScroll: true });
            return;
          }

          panel.focus({ preventScroll: true });
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
          cycleTabWithin(panel, event);
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
      () => ({ onClose: handleClose, titleId, registerTitle: setHasTitle }),
      [handleClose, titleId, setHasTitle],
    );

    if (!hydrated) return null;
    if (!keepMounted && !mounted) return null;

    const container = portalContainer ?? document.body;
    const isClosed = !isOpen;
    const isHiddenMounted = keepMounted && isClosed;

    return (
      // ADR: the drawer publishes its layer so floating content opened inside
      // it stacks above rather than at the dropdown tier.
      <OverlayLayerContext.Provider value={zIndex}>
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
              aria-label={ariaLabel}
              // `hasTitle`, not `titleId`: the id is a template string and
              // therefore always truthy, so guarding on it would point the panel
              // at an element that exists only while a `DrawerHeader` renders.
              // A dangling reference is a name the platform cannot compute.
              aria-labelledby={
                ariaLabelledBy ?? (!ariaLabel && hasTitle ? titleId : undefined)
              }
              aria-describedby={ariaDescribedBy}
              tabIndex={-1}
              inert={isHiddenMounted || undefined}
              className={
                cn(
                  mergedClasses.content,
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
      </OverlayLayerContext.Provider>
    );
  },
);

Drawer.displayName = "Drawer";

export default Drawer;
