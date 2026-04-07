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
} from "./utils/types";
import { CloseIcon } from "./icons";
import { ModalContext } from "./ModalContext";
import { mergeRefs } from "../../utils/mergeRefs";
import { useControllableState } from "../../utils/useControllableState";
import { acquireScrollLock, releaseScrollLock } from "../../utils/scrollLock";
import { isBrowser } from "../../utils/isBrowser";
import { useReducedMotion } from "../../utils/useReducedMotion";
import { getFocusableElements } from "../../utils/focusUtils";
import {
  DEFAULT_MODAL_CLASSES,
  UNSTYLED_MODAL_CLASSES,
} from "./utils/constants";

const BASE_Z_INDEX = 9999;
const Z_INDEX_INCREMENT = 10;

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
      overlayOpacity = 0.5,
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

    const prefersReducedMotion = useReducedMotion(reduceMotion);
    const effectiveDuration = prefersReducedMotion || disableAnimation ? 0 : animationDuration;
    const shouldAnimate = effectiveDuration > 0;

    // Merge classes: individual classNames take precedence over classes object
    const baseClasses = unstyled
      ? UNSTYLED_MODAL_CLASSES
      : DEFAULT_MODAL_CLASSES;

    const mergedClasses = useMemo<Required<ModalClasses>>(() => ({
      root: classesProp?.root ?? baseClasses.root,
      overlay: classesProp?.overlay ?? baseClasses.overlay,
      container: classesProp?.container ?? baseClasses.container,
      content: classesProp?.content ?? baseClasses.content,
      header: classesProp?.header ?? baseClasses.header,
      title: classesProp?.title ?? baseClasses.title,
      description: classesProp?.description ?? baseClasses.description,
      icon: classesProp?.icon ?? baseClasses.icon,
      closeButton: classesProp?.closeButton ?? baseClasses.closeButton,
      closeIcon: classesProp?.closeIcon ?? baseClasses.closeIcon,
      body: classesProp?.body ?? baseClasses.body,
    }), [classesProp, baseClasses]);

    const parentContext = useContext(ModalContext);
    const nestingLevel =
      externalNestingLevel ?? (parentContext ? parentContext.nestingLevel + 1 : 0);
    const isNestingAllowed = nestingLevel < maxNestingLevel;

    const zIndex = customZIndex ?? BASE_Z_INDEX + nestingLevel * Z_INDEX_INCREMENT;

    const handleClose = useCallback(() => {
      setIsOpen(false);
    }, [setIsOpen]);

    // Mount/unmount management
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

    // Keyboard: Escape + Focus trap
    const handleKeyDown = useCallback(
      (event: KeyboardEvent) => {
        if (!isOpen) return;

        if (event.key === "Escape" && closeOnEscape) {
          event.stopPropagation();
          handleClose();
          return;
        }

        if (event.key === "Tab" && trapFocus) {
          const content = contentRef.current;
          if (!content) return;

          const focusable = getFocusableElements(content);
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
      [isOpen, closeOnEscape, trapFocus, handleClose],
    );

    useEffect(() => {
      if (isOpen) {
        document.addEventListener("keydown", handleKeyDown, true);
        return () => document.removeEventListener("keydown", handleKeyDown, true);
      }
    }, [isOpen, handleKeyDown]);

    // Scroll lock
    useEffect(() => {
      if (lockScroll && isOpen) {
        acquireScrollLock();
        return () => releaseScrollLock();
      }
    }, [isOpen, lockScroll]);

    // Focus management
    useEffect(() => {
      if (isOpen) {
        previousActiveElement.current = document.activeElement as HTMLElement;
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
      <ModalContext.Provider value={contextValue}>
        <div
          id={modalId}
          className={unstyled ? mergedClasses.root : [
            "fixed inset-0",
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
                "fixed inset-0",
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
            className={unstyled ? mergedClasses.container : [
              "fixed inset-0 overflow-y-auto",
              centered && "flex items-center justify-center",
              mergedClasses.container,
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={handleOverlayClick}
            data-modal-container
          >
            <div
              ref={mergedContentRef}
              role="dialog"
              aria-modal="true"
              aria-label={ariaLabel}
              aria-labelledby={hasTitle ? titleId : ariaLabelledBy}
              aria-describedby={hasDescription ? descriptionId : ariaDescribedBy}
              tabIndex={-1}
              className={unstyled ? [mergedClasses.content, className].filter(Boolean).join(" ") : [
                "relative outline-none bg-white",
                shouldAnimate && "transition-all transform",
                fullScreen && "w-full h-full",
                shouldAnimate && (isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"),
                mergedClasses.content,
                className,
              ]
                .filter(Boolean)
                .join(" ")}
              style={contentStyles}
              onClick={handleContentClick}
              data-modal-content
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
                      className={mergedClasses.closeButton || undefined}
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
    );

    if (!isBrowser) return null;
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
