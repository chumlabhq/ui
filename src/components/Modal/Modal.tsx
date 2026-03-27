import {
  forwardRef,
  useEffect,
  useCallback,
  useMemo,
  useId,
  useContext,
  useRef,
} from "react";
import { createPortal } from "react-dom";
import type {
  ModalProps,
  ModalHeaderProps,
  ModalBodyProps,
  ModalFooterProps,
  ModalContextValue,
} from "./utils/types";
import { CloseIcon } from "./icons";
import { ModalContext } from "./ModalContext";
import { mergeRefs } from "../../utils/mergeRefs";
import { acquireScrollLock, releaseScrollLock } from "../../utils/scrollLock";

const BASE_Z_INDEX = 9999;
const Z_INDEX_INCREMENT = 10;

const Modal = forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      open,
      onOpenChange,
      children,
      title,
      description,
      icon,
      showIcon = false,
      showCloseButton = true,
      closeIcon,
      showHeader = true,
      showOverlay = true,
      preventOutsideClick = false,
      closeOnEscape = true,
      lockBackgroundScroll = true,
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
      nestingLevel: externalNestingLevel,
      maxNestingLevel = 5,
      zIndex: customZIndex,
      className = "",
      overlayClassName = "",
      contentClassName = "",
      contentStyle = {},
      headerClassName = "",
      titleClassName = "",
      descriptionClassName = "",
      iconClassName = "",
      closeButtonClassName = "",
      closeIconClassName = "",
      bodyClassName = "",
      rootClassName = "",
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      "aria-describedby": ariaDescribedBy,
    },
    ref,
  ) => {
    const generatedId = useId();
    const modalId = `modal-${generatedId}`;
    const titleId = `${modalId}-title`;
    const descriptionId = `${modalId}-description`;
    const contentRef = useRef<HTMLDivElement>(null);
    const mergedContentRef = useMemo(() => mergeRefs(contentRef, ref), [ref]);
    const previousActiveElement = useRef<HTMLElement | null>(null);

    const parentContext = useContext(ModalContext);
    const nestingLevel =
      externalNestingLevel ?? (parentContext ? parentContext.nestingLevel + 1 : 0);
    const isNestingAllowed = nestingLevel < maxNestingLevel;

    const zIndex = customZIndex ?? BASE_Z_INDEX + nestingLevel * Z_INDEX_INCREMENT;

    const handleClose = useCallback(() => {
      onOpenChange(false);
    }, [onOpenChange]);

    const handleKeyDown = useCallback(
      (event: KeyboardEvent) => {
        if (event.key === "Escape" && open && closeOnEscape) {
          event.stopPropagation();
          handleClose();
        }
      },
      [open, closeOnEscape, handleClose],
    );

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

    useEffect(() => {
      if (lockBackgroundScroll && open) {
        acquireScrollLock();
        return () => releaseScrollLock();
      }
    }, [open, lockBackgroundScroll]);

    useEffect(() => {
      if (open) {
        document.addEventListener("keydown", handleKeyDown, true);
        return () => document.removeEventListener("keydown", handleKeyDown, true);
      }
    }, [open, handleKeyDown]);

    useEffect(() => {
      if (open) {
        previousActiveElement.current = document.activeElement as HTMLElement;
        const timer = setTimeout(() => {
          contentRef.current?.focus();
        }, 10);
        return () => {
          clearTimeout(timer);
          if (previousActiveElement.current?.focus) {
            previousActiveElement.current.focus();
          }
        };
      }
    }, [open]);

    const contentStyles = useMemo(() => {
      const styles: React.CSSProperties = {
        ...contentStyle,
        transitionDuration: disableAnimation ? "0ms" : `${animationDuration}ms`,
      };

      if (maxWidth) {
        styles.maxWidth = typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth;
      }
      if (maxHeight) {
        styles.maxHeight =
          typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight;
      }
      if (minWidth) {
        styles.minWidth = typeof minWidth === "number" ? `${minWidth}px` : minWidth;
      }
      if (minHeight) {
        styles.minHeight =
          typeof minHeight === "number" ? `${minHeight}px` : minHeight;
      }

      return styles;
    }, [
      contentStyle,
      maxWidth,
      maxHeight,
      minWidth,
      minHeight,
      animationDuration,
      disableAnimation,
    ]);

    const contextValue = useMemo<ModalContextValue>(
      () => ({
        nestingLevel,
        close: handleClose,
      }),
      [nestingLevel, handleClose],
    );

    const renderHeader = () => {
      if (!showHeader) return null;

      const hasTitle = title !== undefined && title !== null;
      const hasDescription = description !== undefined && description !== null;

      return (
        <div
          className={headerClassName}
          data-modal-header
        >
          {showIcon && icon && (
            <span className={iconClassName}>
              {icon}
            </span>
          )}
          <div>
            {hasTitle && (
              <div id={titleId} className={titleClassName}>
                {title}
              </div>
            )}
            {hasDescription && (
              <div id={descriptionId} className={descriptionClassName}>
                {description}
              </div>
            )}
          </div>
          {showCloseButton && (
            <button
              type="button"
              onClick={handleClose}
              className={closeButtonClassName}
              aria-label="Close modal"
            >
              {closeIcon || <CloseIcon className={closeIconClassName} />}
            </button>
          )}
        </div>
      );
    };

    if (!isNestingAllowed && nestingLevel >= maxNestingLevel) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          `Modal: Maximum nesting level (${maxNestingLevel}) reached. Modal will not render.`,
        );
      }
      return null;
    }

    const modalContent = (
      <ModalContext.Provider value={contextValue}>
        <div
          id={modalId}
          className={[
            "fixed inset-0",
            !disableAnimation && "transition-opacity",
            open
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none",
            rootClassName,
          ]
            .filter(Boolean)
            .join(" ")}
          style={{
            zIndex,
            transitionDuration: disableAnimation ? "0ms" : `${animationDuration}ms`,
          }}
          data-modal-root
          data-open={open || undefined}
          data-nesting-level={nestingLevel}
        >
          {showOverlay && (
            <div
              className={[
                "fixed inset-0",
                !disableAnimation && "transition-opacity",
                overlayClassName,
              ]
                .filter(Boolean)
                .join(" ")}
              style={{
                backgroundColor: overlayColor,
                opacity: open ? overlayOpacity : 0,
                transitionDuration: disableAnimation
                  ? "0ms"
                  : `${animationDuration}ms`,
              }}
              onClick={handleOverlayClick}
              aria-hidden="true"
              data-modal-overlay
            />
          )}

          <div
            className={[
              "fixed inset-0 overflow-y-auto",
              centered && "flex items-center justify-center",
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
              aria-labelledby={title ? titleId : ariaLabelledBy}
              aria-describedby={description ? descriptionId : ariaDescribedBy}
              tabIndex={-1}
              className={[
                "relative outline-none bg-white",
                !disableAnimation && "transition-all transform",
                fullScreen && "w-full h-full",
                !disableAnimation && (open ? "opacity-100 scale-100" : "opacity-0 scale-95"),
                contentClassName,
                className,
              ]
                .filter(Boolean)
                .join(" ")}
              style={contentStyles}
              onClick={handleContentClick}
              data-modal-content
              data-modal-ignore-outside
            >
              {showHeader && renderHeader()}
              <div className={bodyClassName} data-modal-body>
                {children}
              </div>
            </div>
          </div>
        </div>
      </ModalContext.Provider>
    );

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
