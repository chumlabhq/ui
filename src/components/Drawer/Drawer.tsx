import { forwardRef, useEffect, useCallback, useMemo, useId } from "react";
import { createPortal } from "react-dom";
import type {
  DrawerProps,
  DrawerHeaderProps,
  DrawerBodyProps,
  DrawerFooterProps,
  DrawerDirection,
} from "./types";

const getDirectionStyles = (
  direction: DrawerDirection,
  size: string,
  open: boolean,
  duration: number,
): React.CSSProperties => {
  const baseTransition = `transform ${duration}ms ease-in-out`;

  const styles: Record<DrawerDirection, React.CSSProperties> = {
    left: {
      top: 0,
      left: 0,
      height: "100vh",
      width: size,
      transform: open ? "translateX(0)" : "translateX(-100%)",
      transition: baseTransition,
    },
    right: {
      top: 0,
      right: 0,
      height: "100vh",
      width: size,
      transform: open ? "translateX(0)" : "translateX(100%)",
      transition: baseTransition,
    },
    top: {
      top: 0,
      left: 0,
      width: "100vw",
      height: size,
      transform: open ? "translateY(0)" : "translateY(-100%)",
      transition: baseTransition,
    },
    bottom: {
      bottom: 0,
      left: 0,
      width: "100vw",
      height: size,
      transform: open ? "translateY(0)" : "translateY(100%)",
      transition: baseTransition,
    },
  };

  return styles[direction];
};

const Drawer = forwardRef<HTMLDivElement, DrawerProps>(
  (
    {
      open,
      onClose,
      children,
      direction = "left",
      size = "300px",
      overlayColor = "black",
      overlayOpacity = 0.5,
      duration = 300,
      lockBackgroundScroll = true,
      closeOnOverlayClick = true,
      closeOnEscape = true,
      drawerClassName = "",
      overlayClassName = "",
      rootClassName = "",
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      "aria-describedby": ariaDescribedBy,
      ...rest
    },
    ref,
  ) => {
    const generatedId = useId();
    const drawerId = `drawer-${generatedId}`;

    const drawerStyles = useMemo(
      () => getDirectionStyles(direction, size, open, duration),
      [direction, size, open, duration],
    );

    const handleKeyDown = useCallback(
      (event: KeyboardEvent) => {
        if (event.key === "Escape" && open && closeOnEscape) {
          onClose();
        }
      },
      [open, onClose, closeOnEscape],
    );

    const handleOverlayClick = useCallback(() => {
      if (closeOnOverlayClick) {
        onClose();
      }
    }, [closeOnOverlayClick, onClose]);

    useEffect(() => {
      if (lockBackgroundScroll && open) {
        const originalOverflow = document.body.style.overflow || "";
        document.body.style.overflow = "hidden";

        return () => {
          document.body.style.overflow = originalOverflow;
        };
      }
    }, [open, lockBackgroundScroll]);

    useEffect(() => {
      if (open) {
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
      }
    }, [open, handleKeyDown]);

    return createPortal(
      <div
        id={drawerId}
        className={[
          "fixed inset-0 z-999999 transition-opacity",
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
          rootClassName,
        ]
          .filter(Boolean)
          .join(" ")}
        style={{ transitionDuration: `${duration}ms` }}
        data-open={open || undefined}
        data-direction={direction}
        {...rest}
      >
        <div
          className={["fixed inset-0 transition-opacity", overlayClassName]
            .filter(Boolean)
            .join(" ")}
          style={{
            backgroundColor: overlayColor,
            opacity: open ? overlayOpacity : 0,
            transitionDuration: `${duration}ms`,
          }}
          onClick={handleOverlayClick}
          aria-hidden="true"
          data-overlay
        />

        <div
          ref={ref}
          role="dialog"
          aria-modal="true"
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
          className={["fixed z-50", drawerClassName].filter(Boolean).join(" ")}
          style={drawerStyles}
          data-drawer-panel
          data-direction={direction}
        >
          {children}
        </div>
      </div>,
      document.body,
    );
  },
);

Drawer.displayName = "Drawer";

export const DrawerHeader = forwardRef<HTMLDivElement, DrawerHeaderProps>(
  ({ children, className = "", ...rest }, ref) => {
    return (
      <div ref={ref} className={className} data-drawer-header {...rest}>
        {children}
      </div>
    );
  },
);

DrawerHeader.displayName = "DrawerHeader";

export const DrawerBody = forwardRef<HTMLDivElement, DrawerBodyProps>(
  ({ children, className = "", ...rest }, ref) => {
    return (
      <div ref={ref} className={className} data-drawer-body {...rest}>
        {children}
      </div>
    );
  },
);

DrawerBody.displayName = "DrawerBody";

export const DrawerFooter = forwardRef<HTMLDivElement, DrawerFooterProps>(
  ({ children, className = "", ...rest }, ref) => {
    return (
      <div ref={ref} className={className} data-drawer-footer {...rest}>
        {children}
      </div>
    );
  },
);

DrawerFooter.displayName = "DrawerFooter";

export default Drawer;
