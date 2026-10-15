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
import { focusAndReveal } from "../../utils/focusAndReveal.js";
import {
  getSideStyles,
  getFocusableElements,
  getClosingDelta,
  getTransformString,
  isHorizontalSide,
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
  DEFAULT_SIDE,
  DEFAULT_SIZE,
  DEFAULT_OVERLAY_COLOR,
  DEFAULT_OVERLAY_OPACITY,
  DEFAULT_OVERLAY_BLUR,
  DEFAULT_ANIMATION_DURATION,
  DEFAULT_SWIPE_THRESHOLD,
  DEFAULT_SNAP_POINT_INDEX,
  SWIPE_DEADZONE,
  VELOCITY_THRESHOLD,
} from "./utils/constants.js";
import { DrawerContext } from "./utils/context.js";
import { useControllableState } from "../../utils/useControllableState.js";
import { cn } from "../../utils/scopedCn.js";
import { mergeSlot } from "../../utils/mergeSlot.js";
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
 * - Use `side` for the edge it slides in from (left/right/top/bottom)
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
      side = DEFAULT_SIDE,
      size = DEFAULT_SIZE,
      overlayColor = DEFAULT_OVERLAY_COLOR,
      overlayOpacity = DEFAULT_OVERLAY_OPACITY,
      overlayBlur = DEFAULT_OVERLAY_BLUR,
      animationDuration = DEFAULT_ANIMATION_DURATION,
      lockScroll = true,
      closeOnOverlayClick = true,
      closeOnEscape = true,
      classes: classesProp,
      unstyled = false,
      reduceMotion: reduceMotionProp = "auto",
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
      snapPointIndex,
      defaultSnapPointIndex = DEFAULT_SNAP_POINT_INDEX,
      onSnapPointIndexChange,
      className,
      style,
      id,
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
      snapPointIndex !== undefined
        ? Math.max(0, Math.floor(snapPointIndex))
        : undefined;

    const [currentSnapIndex, setSnapIndex] = useControllableState({
      value: safeActiveSnap,
      defaultValue: Math.max(0, Math.floor(defaultSnapPointIndex)),
      onChange: onSnapPointIndexChange,
    });

    const effectiveDuration = prefersReducedMotion ? 0 : animationDuration;

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
        root: mergeSlot(baseClasses.root, classesProp?.root),
        overlay: mergeSlot(baseClasses.overlay, classesProp?.overlay),
        handle: mergeSlot(baseClasses.handle, classesProp?.handle),
      handleBar: mergeSlot(baseClasses.handleBar, classesProp?.handleBar),
        content: mergeSlot(baseClasses.content, classesProp?.content),
      }),
      [classesProp, baseClasses],
    );

    const drawerStyles = useMemo(
      () => getSideStyles(side, size, fraction, effectiveDuration),
      [side, size, fraction, effectiveDuration],
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

    /**
     * `mounted` is in the deps because the panel is portalled by a LATER
     * effect: on the commit where `isOpen` flips, `panelRef.current` is still
     * null and this returned early, so a drawer opened from closed left focus
     * on the trigger — `initialFocus` and `data-autofocus` both dead. The unit
     * tests could not see it; they render with `open` already true, which is
     * the one path where the portal exists on the first run.
     */
    useEffect(() => {
      if (isOpen && modal) {
        const panel = panelRef.current;
        if (!panel) return;

        let observer: ResizeObserver | undefined;
        const timer = requestAnimationFrame(() => {
          const target =
            initialFocus?.current ?? panel.querySelector<HTMLElement>("[data-autofocus]");
          if (target) {
            focusAndReveal(target);
            if (typeof ResizeObserver === "undefined") return;
            observer = new ResizeObserver(() => {
              if (document.activeElement === target) focusAndReveal(target);
              else observer?.disconnect();
            });
            for (const child of panel.children) observer.observe(child);
            return;
          }

          const focusable = getFocusableElements(panel);
          if (focusable.length > 0) {
            focusable[0].focus({ preventScroll: true });
            return;
          }

          panel.focus({ preventScroll: true });
        });

        return () => {
          cancelAnimationFrame(timer);
          observer?.disconnect();
        };
      }
    }, [isOpen, modal, initialFocus, mounted]);

    useEffect(() => {
      if (isOpen) {
        pushDrawer(drawerId);
        return () => popDrawer(drawerId);
      }
    }, [isOpen, drawerId]);

    const handleKeyDown = useCallback(
      (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          if (!isTopDrawer(drawerId)) return;
          // Marked even when it declines to close, as Modal does: nothing
          // behind an open drawer may act on the key.
          event.preventDefault();
          if (!closeOnEscape) return;
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

    const dragRef = useRef<{
      startX: number;
      startY: number;
      startTime: number;
      isDragging: boolean;
      hasMoved: boolean;
      frame: number;
      pending: { closingDelta: number; panelSize: number; baseFraction: number } | null;
    }>({
      startX: 0,
      startY: 0,
      startTime: 0,
      isDragging: false,
      hasMoved: false,
      frame: 0,
      pending: null,
    });

    /** Put the panel back and forget the drag. The one way out of a drag. */
    const endDrag = useCallback(() => {
      if (dragRef.current.frame !== 0) {
        cancelAnimationFrame(dragRef.current.frame);
        dragRef.current.frame = 0;
      }
      dragRef.current.pending = null;
      dragRef.current.isDragging = false;
      dragRef.current.hasMoved = false;
      const panel = panelRef.current;
      if (panel) {
        panel.style.transition = "";
        panel.style.transform = "";
      }
    }, []);

    const handlePanelPointerDown = useCallback(
      (e: React.PointerEvent) => {
        if (!swipeable || !isOpen) return;
        // Secondary and middle buttons do not drag anything.
        if (e.button !== 0) return;
        /**
         * A mouse drags from the handle; a finger drags from anywhere on a
         * side drawer, and from the handle or the header on a top or bottom
         * sheet, whose content scrolls along the same axis it dismisses on.
         *
         * Swipe-to-dismiss is a touch gesture and the whole panel is the
         * target for it. A mouse is different: the panel is full of text, and
         * a press-and-move on text means select, not drag. The handle exists
         * to say where the mouse can grab, and gating on it is what makes that
         * promise true rather than decorative. `swipeable` is not gated to
         * coarse pointers because that would leave the handle rendered on a
         * desktop where nothing it advertises works.
         */
        const mouse = e.pointerType === "mouse";
        if ((mouse || !isHorizontalSide(side)) && !(e.target as Element).closest?.(mouse ? "[data-drawer-handle]" : "[data-drawer-handle], [data-drawer-header]")) {
          return;
        }

        dragRef.current = {
          startX: e.clientX,
          startY: e.clientY,
          startTime: Date.now(),
          isDragging: true,
          hasMoved: false,
          frame: dragRef.current.frame,
          pending: null,
        };
        // Captured here, not after the deadzone. Capture is what guarantees
        // the matching pointerup arrives on this element; without it a release
        // outside the panel never reached the handler below, `isDragging`
        // stayed true, and the next bare cursor move dragged the panel with no
        // button held.
        (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
      },
      [swipeable, isOpen, side],
    );

    const handlePanelPointerMove = useCallback(
      (e: React.PointerEvent) => {
        if (!dragRef.current.isDragging) return;
        /**
         * No button held means no drag, whatever the latch says.
         *
         * `buttons` is a bitmask of what is currently pressed, so this is the
         * authoritative answer rather than a remembered one, and it ends the
         * drag rather than merely skipping the frame.
         */
        if (e.buttons === 0) {
          endDrag();
          return;
        }

        const deltaX = e.clientX - dragRef.current.startX;
        const deltaY = e.clientY - dragRef.current.startY;
        const panel = panelRef.current;
        if (!panel) return;

        if (!dragRef.current.hasMoved) {
          const totalDelta = Math.abs(deltaX) + Math.abs(deltaY);
          if (totalDelta < SWIPE_DEADZONE) return;
          dragRef.current.hasMoved = true;
        }

        const closingDelta = getClosingDelta(side, deltaX, deltaY);
        const horizontal = isHorizontalSide(side);
        const panelSize = horizontal ? panel.offsetWidth : panel.offsetHeight;
        const baseFraction = hasSnapPoints ? snapPoints![clampedSnapIndex] : 1;

        /**
         * One write per frame, not one per event.
         *
         * A pointermove stream runs well ahead of the compositor, and this set
         * `transform` on every event — so a fast drag queued dozens of style
         * writes and layout reads between two painted frames, which is the lag
         * reported on desktop. The latest position is the only one worth
         * painting, so the frame keeps that and drops the rest.
         */
        dragRef.current.pending = { closingDelta, panelSize, baseFraction };
        if (dragRef.current.frame !== 0) return;
        dragRef.current.frame = requestAnimationFrame(() => {
          dragRef.current.frame = 0;
          const next = dragRef.current.pending;
          const el = panelRef.current;
          if (!next || !el) return;
          if (next.closingDelta <= 0) {
            el.style.transform = "";
            el.style.transition = "";
            return;
          }
          const dragFraction = next.closingDelta / next.panelSize;
          const newFraction = Math.max(0, next.baseFraction - dragFraction);
          el.style.transition = "none";
          el.style.transform = getTransformString(side, (1 - newFraction) * 100);
        });
      },
      [side, hasSnapPoints, snapPoints, clampedSnapIndex, endDrag],
    );

    const handlePanelPointerUp = useCallback(
      (e: React.PointerEvent) => {
        if (!dragRef.current.isDragging) return;

        const { startX, startY, startTime, hasMoved } = dragRef.current;
        if (dragRef.current.frame !== 0) {
          cancelAnimationFrame(dragRef.current.frame);
          dragRef.current.frame = 0;
        }
        dragRef.current.pending = null;
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
        const closingDelta = getClosingDelta(side, deltaX, deltaY);

        if (closingDelta <= 0) return;

        const horizontal = isHorizontalSide(side);
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
        side,
        hasSnapPoints,
        snapPoints,
        clampedSnapIndex,
        swipeThreshold,
        handleClose,
        setSnapIndex,
      ],
    );

    const contextValue = useMemo(
      () => ({ onClose: handleClose, titleId, registerTitle: setHasTitle, swipeGrip: swipeable && !isHorizontalSide(side) }),
      [handleClose, titleId, setHasTitle, swipeable, side],
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
                className,
              ) || undefined
            }
            style={{ ...style, zIndex }}
            data-state={isOpen ? "open" : "closed"}
            data-side={side}
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
                  /**
                   * The tint is the background's alpha, not the element's
                   * opacity, and that is what makes `overlayBlur` visible.
                   *
                   * `opacity` composites the element AND its filtered backdrop
                   * back against the UNFILTERED backdrop, so at the default
                   * 0.3 seven tenths of the sharp page came through and the
                   * blur read as "not working". It was working: measured as
                   * edge energy over the region behind the panel, removing the
                   * filter moved it 1.274 -> 1.790, so the filter was painting
                   * about a quarter of the detail away. Moving the tint to the
                   * background and leaving the element opaque takes the same
                   * region to 0.052 — a 24x collapse, which is what blur(8px)
                   * should look like.
                   *
                   * Opacity still runs the fade, 0 to 1, because that is a
                   * transition and not a resting state.
                   */
                  backgroundColor: `color-mix(in srgb, ${overlayColor} ${overlayOpacity * 100}%, transparent)`,
                  opacity: visualOpen ? 1 : 0,
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
              id={id}
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
                ) || undefined
              }
              style={{
                ...drawerStyles,
                ...(swipeable
                  ? { touchAction: getTouchAction(side) }
                  : {}),
              }}
              data-drawer-panel
              data-side={side}
              onPointerDown={swipeable ? handlePanelPointerDown : undefined}
              onPointerMove={swipeable ? handlePanelPointerMove : undefined}
              onPointerUp={swipeable ? handlePanelPointerUp : undefined}
              // A cancelled pointer never sends pointerup, so without this the
              // drag latched exactly the way a release outside the panel did.
              // Cancel was already handled; what it did not do was drop the
              // frame this drag had queued, so a cancelled drag could still be
              // repainted one more time from a stale position.
              onPointerCancel={swipeable ? endDrag : undefined}
            >
              {/* Pointer-only. Escape and the close button already cover the
                  keyboard, and the handle is not focusable because it offers
                  nothing a keyboard user cannot already do — announcing it
                  would be a stop with no action behind it. */}
              {swipeable && (
                <div
                  className={mergedClasses.handle || undefined}
                  style={{ touchAction: "none" }}
                  data-drawer-handle
                  aria-hidden="true"
                >
                  <span className={mergedClasses.handleBar || undefined} />
                </div>
              )}
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
