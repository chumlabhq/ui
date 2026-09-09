import {
  forwardRef,
  useEffect,
  useCallback,
  useMemo,
  useId,
  useContext,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import type {
  ModalProps,
  ModalClasses,
  ModalHeaderProps,
  ModalBodyProps,
  ModalFooterProps,
  ModalContextValue,
} from "./utils/types.js";
import { CloseIcon } from "./icons.js";
import { ModalContext } from "./ModalContext.js";
import { LAYERS, LAYER_STEP, OverlayLayerContext } from "../../utils/layers.js";
import { mergeRefs } from "../../utils/mergeRefs.js";
import { useControllableState } from "../../utils/useControllableState.js";
import { acquireScrollLock, releaseScrollLock } from "../../utils/scrollLock.js";
import { useHydrated } from "../../utils/useHydrated.js";
import { useReducedMotion } from "../../utils/useReducedMotion.js";
import { cycleTabWithin } from "../../utils/focusUtils.js";
import {
  DEFAULT_MODAL_CLASSES,
  UNSTYLED_MODAL_CLASSES,
} from "./utils/constants.js";
import { pushModal, popModal, isTopModal } from "./utils/helpers.js";

import { motionSafeClasses } from "../../utils/classLayers.js";
import { cn } from "../../utils/scopedCn.js";
// ADR: one scale, so a modal and a dropdown inside it cannot disagree.
const BASE_Z_INDEX = LAYERS.overlay;
const Z_INDEX_INCREMENT = LAYER_STEP;

/**
 * Component: Modal
 *
 * Purpose: Accessible dialog overlay with focus trapping, scroll lock, nested modals,
 * animations, Escape to close, and full keyboard navigation.
 *
 * AI Usage Guidelines:
 * - Use `open` + `onOpenChange` for controlled state (or `useModal()` hook)
 * - Pass `title` and optional `description` for header content
 * - Use `nestingLevel` for stacked modals
 * - Built-in overlay, focus trap, scroll lock, and focus restore
 *
 * Reference: MODAL.ai.md (this directory), src/pages/demo/ModalDemo.tsx
 */
const Modal = forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      open: openProp,
      onOpenChange,
      defaultOpen = false,
      children,
      title,
      description,
      icon,
      showIcon = false,
      showCloseButton = true,
      closeIcon: closeIconProp,
      showHeader = true,
      showOverlay = true,
      preventOutsideClick = false,
      closeOnEscape = true,
      lockScroll = true,
      trapFocus = true,
      restoreFocus = true,
      initialFocus,
      keepMounted = false,
      maxWidth,
      maxHeight,
      minWidth,
      minHeight,
      fullScreen = false,
      centered = true,
      overlayColor = "black",
      overlayOpacity = 0.32,
      animationDuration = 200,
      disableAnimation = false,
      reduceMotion = "auto",
      nestingLevel: externalNestingLevel,
      maxNestingLevel = 5,
      zIndex: customZIndex,
      classes: classesProp,
      unstyled = false,
      className = "",
      contentStyle,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      "aria-describedby": ariaDescribedBy,
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useControllableState({
      value: openProp,
      defaultValue: defaultOpen,
      onChange: onOpenChange,
    });

    const generatedId = useId();
    const modalId = `modal-${generatedId}`;
    const titleId = `${modalId}-title`;
    const descriptionId = `${modalId}-description`;
    const contentRef = useRef<HTMLDivElement>(null);
    const mergedContentRef = useMemo(() => mergeRefs(contentRef, ref), [ref]);
    const previousActiveElement = useRef<HTMLElement | null>(null);
    const [mounted, setMounted] = useState(isOpen || keepMounted);
    // A modal open on first paint would otherwise portal during hydration,
    // which is a subtree the server never sent. See `useHydrated`.
    const hydrated = useHydrated();

    const prefersReducedMotion = useReducedMotion(reduceMotion);
    const effectiveDuration = prefersReducedMotion || disableAnimation ? 0 : animationDuration;
    const shouldAnimate = effectiveDuration > 0;

    const baseClassesRaw = unstyled
      ? UNSTYLED_MODAL_CLASSES
      : DEFAULT_MODAL_CLASSES;
    const baseClasses = motionSafeClasses(baseClassesRaw, prefersReducedMotion);

    const mergedClasses = useMemo<Required<ModalClasses>>(() => ({
      root: cn(baseClasses.root, classesProp?.root),
      overlay: cn(baseClasses.overlay, classesProp?.overlay),
      positioner: cn(baseClasses.positioner, classesProp?.positioner),
      content: cn(baseClasses.content, classesProp?.content),
      header: cn(baseClasses.header, classesProp?.header),
      title: cn(baseClasses.title, classesProp?.title),
      description: cn(baseClasses.description, classesProp?.description),
      icon: cn(baseClasses.icon, classesProp?.icon),
      closeTrigger: cn(baseClasses.closeTrigger, classesProp?.closeTrigger),
      closeIcon: cn(baseClasses.closeIcon, classesProp?.closeIcon),
      body: cn(baseClasses.body, classesProp?.body),
    }), [classesProp, baseClasses]);

    const parentContext = useContext(ModalContext);
    const nestingLevel =
      externalNestingLevel ?? (parentContext ? parentContext.nestingLevel + 1 : 0);
    const isNestingAllowed = nestingLevel < maxNestingLevel;

    const zIndex = customZIndex ?? BASE_Z_INDEX + nestingLevel * Z_INDEX_INCREMENT;

    const handleClose = useCallback(() => {
      setIsOpen(false);
    }, [setIsOpen]);

    const [prevOpen, setPrevOpen] = useState(isOpen);
    if (prevOpen !== isOpen) {
      setPrevOpen(isOpen);
      if (isOpen && !mounted) {
        setMounted(true);
      }
    }

    useEffect(() => {
      if (!isOpen && !keepMounted && mounted) {
        const timer = setTimeout(() => setMounted(false), effectiveDuration);
        return () => clearTimeout(timer);
      }
    }, [isOpen, keepMounted, mounted, effectiveDuration]);

    useEffect(() => {
      if (isOpen) {
        pushModal(modalId);
        return () => popModal(modalId);
      }
    }, [isOpen, modalId]);

    const handleKeyDown = useCallback(
      (event: KeyboardEvent) => {
        if (!isOpen) return;

        if (event.key === "Escape" && closeOnEscape) {
          // Every open modal listens on document, so stopPropagation can't stop a
          // sibling listener on that same node - only the stack tells us who is on
          // top, and only stopImmediatePropagation keeps the rest from firing.
          if (!isTopModal(modalId)) return;
          event.stopImmediatePropagation();
          handleClose();
          return;
        }

        if (event.key === "Tab" && trapFocus) {
          const content = contentRef.current;
          if (!content) return;
          cycleTabWithin(content, event);
        }
      },
      [isOpen, closeOnEscape, trapFocus, handleClose, modalId],
    );

    useEffect(() => {
      if (isOpen) {
        document.addEventListener("keydown", handleKeyDown, true);
        return () => document.removeEventListener("keydown", handleKeyDown, true);
      }
    }, [isOpen, handleKeyDown]);

    useEffect(() => {
      if (lockScroll && isOpen) {
        acquireScrollLock();
        return () => releaseScrollLock();
      }
    }, [isOpen, lockScroll]);

    useEffect(() => {
      if (isOpen) {
        const active = document.activeElement;
        previousActiveElement.current =
          active instanceof HTMLElement ? active : null;
        const timer = setTimeout(() => {
          if (initialFocus?.current) {
            initialFocus.current.focus();
          } else {
            contentRef.current?.focus();
          }
        }, 10);
        return () => {
          clearTimeout(timer);
          if (restoreFocus && previousActiveElement.current?.focus) {
            previousActiveElement.current.focus();
          }
        };
      }
    }, [isOpen, initialFocus, restoreFocus]);

    const handleOverlayClick = useCallback(
      (event: React.MouseEvent<HTMLDivElement>) => {
        if (preventOutsideClick) {
          event.preventDefault();
          event.stopPropagation();
          return;
        }
        if (event.target === event.currentTarget) {
          handleClose();
        }
      },
      [preventOutsideClick, handleClose],
    );

    const handleContentClick = useCallback((event: React.MouseEvent) => {
      event.stopPropagation();
    }, []);

    const contentStyles = useMemo(() => {
      const styles: React.CSSProperties = {
        ...(contentStyle ?? undefined),
        transitionDuration: `${effectiveDuration}ms`,
      };

      if (maxWidth) {
        styles.maxWidth = typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth;
      }
      if (maxHeight) {
        styles.maxHeight = typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight;
      }
      if (minWidth) {
        styles.minWidth = typeof minWidth === "number" ? `${minWidth}px` : minWidth;
      }
      if (minHeight) {
        styles.minHeight = typeof minHeight === "number" ? `${minHeight}px` : minHeight;
      }

      return styles;
    }, [contentStyle, maxWidth, maxHeight, minWidth, minHeight, effectiveDuration]);

    const contextValue = useMemo<ModalContextValue>(
      () => ({
        nestingLevel,
        close: handleClose,
      }),
      [nestingLevel, handleClose],
    );

    if (!isNestingAllowed && nestingLevel >= maxNestingLevel) {
      if (import.meta.env.DEV) {
        console.warn(
          `Modal: Maximum nesting level (${maxNestingLevel}) reached. Modal will not render.`,
        );
      }
      return null;
    }

    if (!mounted && !keepMounted) {
      return null;
    }

    const hasTitle = title !== undefined && title !== null;
    const hasDescription = description !== undefined && description !== null;

    const modalContent = (
      <OverlayLayerContext.Provider value={zIndex}>
      <ModalContext.Provider value={contextValue}>
        <div
          id={modalId}
          className={unstyled ? mergedClasses.root : [
            shouldAnimate && "transition-opacity",
            isOpen ? "opacity-100" : "opacity-0",
            mergedClasses.root,
          ]
            .filter(Boolean)
            .join(" ")}
          style={{
            zIndex,
            transitionDuration: `${effectiveDuration}ms`,
            pointerEvents: isOpen ? undefined : "none",
            visibility: isOpen ? undefined : "hidden",
          }}
          data-modal-root
          data-open={isOpen || undefined}
          data-nesting-level={nestingLevel}
          data-reduce-motion={prefersReducedMotion || undefined}
        >
          {showOverlay && (
            <div
              className={unstyled ? mergedClasses.overlay : [
                shouldAnimate && "transition-opacity",
                mergedClasses.overlay,
              ]
                .filter(Boolean)
                .join(" ")}
              style={{
                backgroundColor: overlayColor,
                opacity: isOpen ? overlayOpacity : 0,
                transitionDuration: `${effectiveDuration}ms`,
              }}
              onClick={handleOverlayClick}
              aria-hidden="true"
              data-modal-overlay
            />
          )}

          <div
            className={mergedClasses.positioner || undefined}
            onClick={handleOverlayClick}
            data-modal-container
            data-centered={centered || undefined}
          >
            <div
              ref={mergedContentRef}
              role="dialog"
              aria-modal="true"
              // The header is what renders the title and the description, so a
              // dialog with `showHeader={false}` pointed both references at
              // elements that do not exist — a name that resolves to nothing,
              // which the platform cannot compute and a checker cannot see. The
              // string is still known here, so it becomes the label instead.
              aria-label={
                ariaLabel ??
                (!showHeader && typeof title === "string" ? title : undefined)
              }
              aria-labelledby={showHeader && hasTitle ? titleId : ariaLabelledBy}
              aria-describedby={
                showHeader && hasDescription ? descriptionId : ariaDescribedBy
              }
              tabIndex={-1}
              className={unstyled ? [mergedClasses.content, className].filter(Boolean).join(" ") : [
                // Full-screen anchors the panel to the viewport directly
                // (position: fixed inset-0 with !important) so it bypasses
                // the container's flex/centered layout. Otherwise the
                // container's `relative` declaration wins over `fixed` in
                // Tailwind's cascade order and the panel ends up sized to
                // its own content — covering only the area its content
                // happens to occupy instead of the whole viewport.
                mergedClasses.content,
                className,
              ]
                .filter(Boolean)
                .join(" ")}
              style={contentStyles}
              onClick={handleContentClick}
              data-modal-content
              data-fullscreen={fullScreen || undefined}
              data-open={isOpen || undefined}
            >
              {showHeader && (hasTitle || hasDescription || showCloseButton) && (
                <div className={mergedClasses.header || undefined} data-modal-header>
                  {showIcon && icon && (
                    <span className={mergedClasses.icon || undefined}>
                      {icon}
                    </span>
                  )}
                  <div>
                    {hasTitle && (
                      <div id={titleId} className={mergedClasses.title || undefined}>
                        {title}
                      </div>
                    )}
                    {hasDescription && (
                      <div id={descriptionId} className={mergedClasses.description || undefined}>
                        {description}
                      </div>
                    )}
                  </div>
                  {showCloseButton && (
                    <button
                      type="button"
                      onClick={handleClose}
                      className={mergedClasses.closeTrigger || undefined}
                      aria-label="Close modal"
                    >
                      {closeIconProp || <CloseIcon className={mergedClasses.closeIcon || undefined} />}
                    </button>
                  )}
                </div>
              )}
              <div className={mergedClasses.body || undefined} data-modal-body>
                {children}
              </div>
            </div>
          </div>
        </div>
      </ModalContext.Provider>
      </OverlayLayerContext.Provider>
    );

    if (!hydrated) return null;
    return createPortal(modalContent, document.body);
  },
);

Modal.displayName = "Modal";

export const ModalHeader = forwardRef<HTMLDivElement, ModalHeaderProps>(
  ({ children, className = "" }, ref) => {
    return (
      <div ref={ref} className={className} data-modal-header>
        {children}
      </div>
    );
  },
);

ModalHeader.displayName = "ModalHeader";

export const ModalBody = forwardRef<HTMLDivElement, ModalBodyProps>(
  ({ children, className = "" }, ref) => {
    return (
      <div ref={ref} className={className} data-modal-body>
        {children}
      </div>
    );
  },
);

ModalBody.displayName = "ModalBody";

export const ModalFooter = forwardRef<HTMLDivElement, ModalFooterProps>(
  ({ children, className = "" }, ref) => {
    return (
      <div ref={ref} className={className} data-modal-footer>
        {children}
      </div>
    );
  },
);

ModalFooter.displayName = "ModalFooter";

export default Modal;
