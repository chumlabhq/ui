import {
  useRef,
  useState,
  useEffect,
  useCallback,
  useId,
  isValidElement,
  cloneElement,
} from "react";
import type { CSSProperties, ReactElement, Ref } from "react";
import { createPortal } from "react-dom";
import { cn } from "../../utils/cn";
import { useIsomorphicLayoutEffect } from "../../utils/useIsomorphicLayoutEffect";
import type {
  TooltipProps,
  TooltipShadowPreset,
  TooltipWordWrap,
} from "./types";

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

const wordWrapStyles: Record<TooltipWordWrap, CSSProperties> = {
  normal: { overflowWrap: "normal", whiteSpace: "normal" },
  "break-word": {
    overflowWrap: "break-word",
    wordBreak: "normal",
    whiteSpace: "normal",
  },
  nowrap: { overflowWrap: "normal", whiteSpace: "nowrap" },
};

const DEFAULT_CONTENT_CLASS =
  "rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100";

const DEFAULT_BASE_ARROW_CLASS = "fill-white dark:fill-gray-900";

function mergeTooltipRefs<T>(
  ...refs: (Ref<T> | undefined | null)[]
): (node: T | null) => void {
  return (node: T | null) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(node);
      } else if (ref != null) {
        (ref as React.MutableRefObject<T | null>).current = node;
      }
    });
  };
}

const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  side = "top",
  align = "center",
  sideOffset = 6,
  alignOffset = 0,
  maxWidth = 300,
  wordWrap = "break-word",
  delayDuration = 200,
  hideDelayDuration = 100,
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
  zIndex = 9999,
  portal = true,
  asChild = false,
  className,
  triggerClassName,
  contentClassName,
  contentStyle,
  arrowClassName,
  baseArrowClassName,
  arrowStyle,
  baseArrowStyle,
}) => {
  const generatedId = useId();
  const tooltipId = `tooltip-${generatedId}`;

  const triggerRef = useRef<HTMLElement>(null);
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

  const updatePosition = useCallback(() => {
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

  useIsomorphicLayoutEffect(() => {
    updatePosition();
  }, [updatePosition]);

  useEffect(() => {
    if (!isOpen) return;

    const handleScrollOrResize = () => {
      updatePosition();
    };

    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [isOpen, updatePosition]);

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
    }, hideDelayDuration);
  }, [setOpen, hideDelayDuration]);

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

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        event.preventDefault();
        setOpen(false);
      }
    },
    [isOpen, setOpen],
  );

  const computedMaxWidth =
    typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth;
  const shouldShowTooltip = !disabled && (!truncate || isTruncated);

  const triggerContent = truncate ? (
    <span
      ref={textRef}
      className={cn("block truncate", truncateWidth, triggerClassName)}
    >
      {children}
    </span>
  ) : (
    children
  );

  if (!shouldShowTooltip) {
    return truncate ? (
      <span className={className || undefined}>{triggerContent}</span>
    ) : (
      <>{children}</>
    );
  }

  const shadowValue = isPresetShadow(shadow) ? shadowPresets[shadow] : shadow;
  const shadowStyle = { boxShadow: shadowValue };

  const finalContentClassName = cn(DEFAULT_CONTENT_CLASS, contentClassName);

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

  const arrowElement =
    showArrow ? (
      <svg
        width={12}
        height={6}
        viewBox="0 0 12 6"
        aria-hidden="true"
        className={cn(DEFAULT_BASE_ARROW_CLASS, baseArrowClassName, arrowClassName)}
        style={{
          ...baseArrowStyle,
          ...getArrowPosition(),
          ...arrowStyle,
          ...(arrowColor ? { fill: arrowColor } : {}),
        }}
      >
        <path d="M0 6L6 0L12 6H0Z" />
      </svg>
    ) : null;

  const tooltipElement = isOpen && (
    <div
      ref={tooltipRef}
      id={tooltipId}
      role="tooltip"
      className={finalContentClassName}
      style={{
        position: "absolute",
        top: position.top,
        left: position.left,
        maxWidth: computedMaxWidth,
        ...wordWrapStyles[wordWrap],
        opacity: isPositioned ? 1 : 0,
        pointerEvents: isPositioned ? "auto" : "none",
        zIndex,
        ...shadowStyle,
        ...contentStyle,
      }}
      onMouseEnter={handleTooltipMouseEnter}
      onMouseLeave={handleTooltipMouseLeave}
    >
      {truncate ? children : content}
      {arrowElement}
    </div>
  );

  const tooltipContent = portal
    ? tooltipElement && createPortal(tooltipElement, document.body)
    : tooltipElement;

  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<Record<string, unknown>>;
    const childRef = (child as unknown as { ref?: Ref<HTMLElement> }).ref;

    return (
      <>
        {cloneElement(child, {
          ref: mergeTooltipRefs(
            triggerRef as React.MutableRefObject<HTMLElement>,
            childRef,
          ),
          onMouseEnter: (e: React.MouseEvent) => {
            handleMouseEnter();
            (child.props.onMouseEnter as ((e: React.MouseEvent) => void) | undefined)?.(e);
          },
          onMouseLeave: (e: React.MouseEvent) => {
            handleMouseLeave();
            (child.props.onMouseLeave as ((e: React.MouseEvent) => void) | undefined)?.(e);
          },
          onFocus: (e: React.FocusEvent) => {
            handleFocus();
            (child.props.onFocus as ((e: React.FocusEvent) => void) | undefined)?.(e);
          },
          onBlur: (e: React.FocusEvent) => {
            handleBlur();
            (child.props.onBlur as ((e: React.FocusEvent) => void) | undefined)?.(e);
          },
          onKeyDown: (e: React.KeyboardEvent) => {
            handleKeyDown(e);
            (child.props.onKeyDown as ((e: React.KeyboardEvent) => void) | undefined)?.(e);
          },
          "aria-describedby": isOpen ? tooltipId : undefined,
          className: cn(child.props.className as string | undefined, triggerClassName),
        })}
        {tooltipContent}
      </>
    );
  }

  return (
    <>
      <span
        ref={triggerRef as React.RefObject<HTMLSpanElement>}
        className={cn(triggerClassName, className) || undefined}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        style={{ display: "inline-block" }}
        aria-describedby={isOpen ? tooltipId : undefined}
      >
        {triggerContent}
      </span>
      {tooltipContent}
    </>
  );
};

Tooltip.displayName = "Tooltip";

export default Tooltip;
