import {
  forwardRef,
  useRef,
  useState,
  useEffect,
  useCallback,
  useLayoutEffect,
} from "react";
import { createPortal } from "react-dom";
import type {
  TooltipProps,
  TooltipProviderProps,
  TooltipShadowPreset,
} from "./types";

export const TooltipProvider: React.FC<TooltipProviderProps> = ({
  children,
}) => {
  return <>{children}</>;
};

const shadowPresets: Record<TooltipShadowPreset, string> = {
  none: "none",
  sm: "0 1px 2px rgba(0, 0, 0, 0.12)",
  md: "0 3px 8px rgba(0, 0, 0, 0.16)",
  lg: "0 6px 16px rgba(0, 0, 0, 0.2)",
  xl: "0 12px 28px rgba(0, 0, 0, 0.24)",
  "2xl": "0 20px 40px rgba(0, 0, 0, 0.3)",
};

const isPresetShadow = (shadow: string): shadow is TooltipShadowPreset => {
  return shadow in shadowPresets;
};

interface Position {
  top: number;
  left: number;
  arrowTop?: number;
  arrowLeft?: number;
  arrowRotation?: number;
}

const calculatePosition = (
  triggerRect: DOMRect,
  tooltipRect: DOMRect,
  side: "top" | "right" | "bottom" | "left",
  align: "start" | "center" | "end",
  sideOffset: number,
  alignOffset: number,
): Position => {
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  let top = 0;
  let left = 0;
  let arrowTop: number | undefined;
  let arrowLeft: number | undefined;
  let arrowRotation = 0;

  switch (side) {
    case "top":
      top = triggerRect.top + scrollY - tooltipRect.height - sideOffset;
      arrowRotation = 180;
      break;
    case "bottom":
      top = triggerRect.bottom + scrollY + sideOffset;
      arrowRotation = 0;
      break;
    case "left":
      left = triggerRect.left + scrollX - tooltipRect.width - sideOffset;
      arrowRotation = 90;
      break;
    case "right":
      left = triggerRect.right + scrollX + sideOffset;
      arrowRotation = -90;
      break;
  }

  if (side === "top" || side === "bottom") {
    switch (align) {
      case "start":
        left = triggerRect.left + scrollX + alignOffset;
        break;
      case "center":
        left =
          triggerRect.left +
          scrollX +
          (triggerRect.width - tooltipRect.width) / 2 +
          alignOffset;
        break;
      case "end":
        left = triggerRect.right + scrollX - tooltipRect.width + alignOffset;
        break;
    }

    arrowLeft = triggerRect.left + scrollX + triggerRect.width / 2 - left;
  }

  if (side === "left" || side === "right") {
    switch (align) {
      case "start":
        top = triggerRect.top + scrollY + alignOffset;
        break;
      case "center":
        top =
          triggerRect.top +
          scrollY +
          (triggerRect.height - tooltipRect.height) / 2 +
          alignOffset;
        break;
      case "end":
        top = triggerRect.bottom + scrollY - tooltipRect.height + alignOffset;
        break;
    }

    arrowTop = triggerRect.top + scrollY + triggerRect.height / 2 - top;
  }

  const padding = 8;

  if (left < padding) {
    const adjustment = padding - left;
    left = padding;
    if (arrowLeft !== undefined) arrowLeft -= adjustment;
  } else if (left + tooltipRect.width > viewportWidth - padding + scrollX) {
    const adjustment =
      left + tooltipRect.width - (viewportWidth - padding + scrollX);
    left = viewportWidth - padding + scrollX - tooltipRect.width;
    if (arrowLeft !== undefined) arrowLeft += adjustment;
  }

  if (top < padding + scrollY) {
    const adjustment = padding + scrollY - top;
    top = padding + scrollY;
    if (arrowTop !== undefined) arrowTop -= adjustment;
  } else if (top + tooltipRect.height > viewportHeight - padding + scrollY) {
    const adjustment =
      top + tooltipRect.height - (viewportHeight - padding + scrollY);
    top = viewportHeight - padding + scrollY - tooltipRect.height;
    if (arrowTop !== undefined) arrowTop += adjustment;
  }

  if (arrowLeft !== undefined) {
    arrowLeft = Math.max(12, Math.min(tooltipRect.width - 12, arrowLeft));
  }
  if (arrowTop !== undefined) {
    arrowTop = Math.max(12, Math.min(tooltipRect.height - 12, arrowTop));
  }

  return { top, left, arrowTop, arrowLeft, arrowRotation };
};

const Tooltip = forwardRef<HTMLElement, TooltipProps>(
  (
    {
      children,
      content,
      side = "top",
      align = "center",
      sideOffset = 6,
      alignOffset = 0,
      maxWidth = 300,
      delayDuration = 200,
      disableHoverableContent = false,
      open: controlledOpen,
      defaultOpen = false,
      onOpenChange,
      showArrow = true,
      arrowColor,
      disabled = false,
      truncate = false,
      truncateWidth,
      shadow = "lg",
      className = "",
      triggerClassName = "",
      contentClassName = "",
      contentStyle,
      arrowClassName = "",
      arrowStyle,
    },
    ref,
  ) => {
    const triggerRef = useRef<HTMLSpanElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);
    const delayTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [internalOpen, setInternalOpen] = useState(defaultOpen);
    const [isTruncated, setIsTruncated] = useState(false);
    const [position, setPosition] = useState<Position>({ top: 0, left: 0 });
    const [isPositioned, setIsPositioned] = useState(false);

    const isControlled = controlledOpen !== undefined;
    const isOpen = isControlled ? controlledOpen : internalOpen;

    const setOpen = useCallback(
      (value: boolean) => {
        if (!isControlled) {
          setInternalOpen(value);
        }
        onOpenChange?.(value);
      },
      [isControlled, onOpenChange],
    );

    const checkTruncation = useCallback(() => {
      if (truncate && textRef.current) {
        const el = textRef.current;
        setIsTruncated(el.scrollWidth > el.clientWidth);
      }
    }, [truncate]);

    useEffect(() => {
      checkTruncation();
      window.addEventListener("resize", checkTruncation);
      return () => window.removeEventListener("resize", checkTruncation);
    }, [checkTruncation, children, content]);

    useLayoutEffect(() => {
      if (isOpen && triggerRef.current && tooltipRef.current) {
        const triggerRect = triggerRef.current.getBoundingClientRect();
        const tooltipRect = tooltipRef.current.getBoundingClientRect();
        const newPosition = calculatePosition(
          triggerRect,
          tooltipRect,
          side,
          align,
          sideOffset,
          alignOffset,
        );
        setPosition(newPosition);
        setIsPositioned(true);
      } else {
        setIsPositioned(false);
      }
    }, [isOpen, side, align, sideOffset, alignOffset]);

    useEffect(() => {
      return () => {
        if (delayTimeoutRef.current) clearTimeout(delayTimeoutRef.current);
        if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      };
    }, []);

    const handleMouseEnter = useCallback(() => {
      if (disabled) return;
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
      if (delayDuration > 0) {
        delayTimeoutRef.current = setTimeout(() => {
          setOpen(true);
        }, delayDuration);
      } else {
        setOpen(true);
      }
    }, [disabled, delayDuration, setOpen]);

    const handleMouseLeave = useCallback(() => {
      if (delayTimeoutRef.current) {
        clearTimeout(delayTimeoutRef.current);
        delayTimeoutRef.current = null;
      }

      hideTimeoutRef.current = setTimeout(() => {
        setOpen(false);
      }, 100);
    }, [setOpen]);

    const handleTooltipMouseEnter = useCallback(() => {
      if (disableHoverableContent) return;
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
    }, [disableHoverableContent]);

    const handleTooltipMouseLeave = useCallback(() => {
      setOpen(false);
    }, [setOpen]);

    const handleFocus = useCallback(() => {
      if (disabled) return;
      setOpen(true);
    }, [disabled, setOpen]);

    const handleBlur = useCallback(() => {
      setOpen(false);
    }, [setOpen]);

    const computedMaxWidth =
      typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth;
    const shouldShowTooltip = !disabled && (!truncate || isTruncated);

    const triggerContent = truncate ? (
      <span
        ref={textRef}
        className={["block truncate", truncateWidth || "", triggerClassName]
          .filter(Boolean)
          .join(" ")}
      >
        {children}
      </span>
    ) : (
      children
    );

    if (!shouldShowTooltip) {
      return truncate ? (
        <span ref={ref as React.Ref<HTMLSpanElement>} className={className}>
          {triggerContent}
        </span>
      ) : (
        <>{children}</>
      );
    }

    const shadowValue = isPresetShadow(shadow) ? shadowPresets[shadow] : shadow;
    const shadowStyle = { boxShadow: shadowValue };

    const defaultContentClassName = `z-[9999] rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100`;
    const finalContentClassName = contentClassName || defaultContentClassName;

    const computedArrowStyle: React.CSSProperties = {
      ...arrowStyle,
      ...(arrowColor ? { fill: arrowColor } : {}),
    };

    const getArrowPosition = (): React.CSSProperties => {
      const arrowSize = 6;
      const style: React.CSSProperties = {
        position: "absolute",
        transform: `rotate(${position.arrowRotation}deg)`,
      };

      switch (side) {
        case "top":
          style.bottom = -arrowSize;
          style.left =
            position.arrowLeft !== undefined ? position.arrowLeft - 6 : "50%";
          if (position.arrowLeft === undefined)
            style.transform += " translateX(-50%)";
          break;
        case "bottom":
          style.top = -arrowSize;
          style.left =
            position.arrowLeft !== undefined ? position.arrowLeft - 6 : "50%";
          if (position.arrowLeft === undefined)
            style.transform += " translateX(-50%)";
          break;
        case "left":
          style.right = -arrowSize;
          style.top =
            position.arrowTop !== undefined ? position.arrowTop - 6 : "50%";
          if (position.arrowTop === undefined)
            style.transform += " translateY(-50%)";
          break;
        case "right":
          style.left = -arrowSize;
          style.top =
            position.arrowTop !== undefined ? position.arrowTop - 6 : "50%";
          if (position.arrowTop === undefined)
            style.transform += " translateY(-50%)";
          break;
      }

      return style;
    };

    const tooltipContent =
      isOpen &&
      createPortal(
        <div
          ref={tooltipRef}
          role="tooltip"
          className={finalContentClassName}
          style={{
            position: "absolute",
            top: position.top,
            left: position.left,
            maxWidth: computedMaxWidth,
            wordBreak: "break-word",
            whiteSpace: "normal",
            opacity: isPositioned ? 1 : 0,
            pointerEvents: isPositioned ? "auto" : "none",
            ...shadowStyle,
            ...contentStyle,
          }}
          onMouseEnter={handleTooltipMouseEnter}
          onMouseLeave={handleTooltipMouseLeave}
        >
          {truncate ? children : content}
          {showArrow && (
            <svg
              width={12}
              height={6}
              viewBox="0 0 12 6"
              className={arrowClassName || "fill-white dark:fill-gray-900"}
              style={{
                ...getArrowPosition(),
                ...computedArrowStyle,
              }}
            >
              <path d="M0 6L6 0L12 6H0Z" />
            </svg>
          )}
        </div>,
        document.body,
      );

    return (
      <>
        <span
          ref={triggerRef}
          className={truncate ? className : triggerClassName}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onFocus={handleFocus}
          onBlur={handleBlur}
          tabIndex={0}
          style={{ display: "inline-block" }}
        >
          {triggerContent}
        </span>
        {tooltipContent}
      </>
    );
  },
);

Tooltip.displayName = "Tooltip";

export default Tooltip;
