import {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useId,
  forwardRef,
  isValidElement,
} from "react";
import type { ReactElement, Ref } from "react";
import { createPortal } from "react-dom";
import { cn } from "../../utils/cn";
import { useIsomorphicLayoutEffect } from "../../utils/useIsomorphicLayoutEffect";
import { useControllableState } from "../../utils/useControllableState";
import type { TooltipProps } from "./utils/types";
import {
  shadowPresets,
  isPresetShadow,
  wordWrapStyles,
  DEFAULT_TOOLTIP_CLASSES,
  UNSTYLED_TOOLTIP_CLASSES,
} from "./utils/constants";
import {
  mergeTooltipRefs,
  hasInteractiveChild,
  calculatePosition,
  type Position,
} from "./utils/helpers";
import { TooltipAsChildTrigger } from "./components/TooltipAsChildTrigger";

const isBrowser = typeof window !== "undefined";

const INTERACTIVE_ELEMENT_TYPES = new Set([
  "button",
  "a",
  "input",
  "textarea",
  "select",
]);

const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  (
    {
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
      arrowSize: arrowSizeProp = 6,
      arrowColor,
      disabled = false,
      truncate = false,
      truncateWidth,
      shadow = "lg",
      zIndex = 9999,
      portal = true,
      portalContainer,
      asChild = false,
      triggerDisplay = "inline-flex",
      className,
      classes: classesProp,
      unstyled = false,
      contentStyle,
      arrowStyle,
      baseArrowStyle,
    },
    forwardedRef,
  ) => {
    const generatedId = useId();
    const tooltipId = `tooltip-${generatedId}`;

    const baseClasses = unstyled ? UNSTYLED_TOOLTIP_CLASSES : DEFAULT_TOOLTIP_CLASSES;
    const mergedClasses = useMemo(() => ({
      trigger: classesProp?.trigger ?? baseClasses.trigger,
      content: classesProp?.content ?? baseClasses.content,
      arrow: classesProp?.arrow ?? baseClasses.arrow,
      baseArrow: classesProp?.baseArrow ?? baseClasses.baseArrow,
    }), [classesProp, baseClasses]);

    const [triggerNode, setTriggerNode] = useState<HTMLElement | null>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);
    const delayTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const scrollRafRef = useRef<number | undefined>(undefined);

    const [isOpen, setOpenState] = useControllableState({
      value: controlledOpen,
      defaultValue: defaultOpen,
      onChange: onOpenChange,
    });

    const [isTruncated, setIsTruncated] = useState(false);
    const [position, setPosition] = useState<Position>({ top: 0, left: 0 });
    const [isPositioned, setIsPositioned] = useState(false);

    const childIsInteractiveElement = useMemo(() => {
      if (asChild || truncate) return false;
      if (isValidElement(children)) {
        const type = children.type;
        if (typeof type === "string" && INTERACTIVE_ELEMENT_TYPES.has(type)) {
          return true;
        }
        const childProps = children.props as Record<string, unknown>;
        if (
          childProps.role === "button" ||
          childProps.role === "link" ||
          childProps.role === "tab" ||
          childProps.role === "menuitem" ||
          typeof childProps.href === "string"
        ) {
          return true;
        }
        if (
          typeof childProps.tabIndex === "number" &&
          childProps.tabIndex >= 0
        ) {
          return true;
        }
      }
      return false;
    }, [children, asChild, truncate]);

    const triggerIsInteractive = useMemo(() => {
      if (childIsInteractiveElement) return true;
      if (triggerNode && !asChild) {
        return hasInteractiveChild(triggerNode);
      }
      return false;
    }, [childIsInteractiveElement, triggerNode, asChild]);

    const setOpen = useCallback(
      (value: boolean) => {
        setOpenState(value);
      },
      [setOpenState],
    );

    const checkTruncation = useCallback(() => {
      if (truncate && textRef.current) {
        const el = textRef.current;
        setIsTruncated(el.scrollWidth > el.clientWidth);
      }
    }, [truncate]);

    useEffect(() => {
      if (!isBrowser) return;
      checkTruncation();
      window.addEventListener("resize", checkTruncation);
      return () => window.removeEventListener("resize", checkTruncation);
    }, [checkTruncation, children, content]);

    const updatePosition = useCallback(() => {
      if (isOpen && triggerNode && tooltipRef.current) {
        const triggerRect = triggerNode.getBoundingClientRect();
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
    }, [isOpen, triggerNode, side, align, sideOffset, alignOffset]);

    useIsomorphicLayoutEffect(() => {
      updatePosition();
    }, [updatePosition]);

    useEffect(() => {
      if (!isOpen || !isBrowser) return;

      const handleScrollOrResize = () => {
        if (scrollRafRef.current) cancelAnimationFrame(scrollRafRef.current);
        scrollRafRef.current = requestAnimationFrame(() => {
          updatePosition();
        });
      };

      window.addEventListener("scroll", handleScrollOrResize, true);
      window.addEventListener("resize", handleScrollOrResize);

      if (window.visualViewport) {
        window.visualViewport.addEventListener("resize", handleScrollOrResize);
        window.visualViewport.addEventListener("scroll", handleScrollOrResize);
      }

      let resizeObserver: ResizeObserver | undefined;
      if (typeof ResizeObserver !== "undefined") {
        resizeObserver = new ResizeObserver(handleScrollOrResize);
        if (triggerNode) {
          resizeObserver.observe(triggerNode);
        }
        if (tooltipRef.current) {
          resizeObserver.observe(tooltipRef.current);
        }
      }

      return () => {
        window.removeEventListener("scroll", handleScrollOrResize, true);
        window.removeEventListener("resize", handleScrollOrResize);
        if (window.visualViewport) {
          window.visualViewport.removeEventListener(
            "resize",
            handleScrollOrResize,
          );
          window.visualViewport.removeEventListener(
            "scroll",
            handleScrollOrResize,
          );
        }
        resizeObserver?.disconnect();
        if (scrollRafRef.current) cancelAnimationFrame(scrollRafRef.current);
      };
    }, [isOpen, updatePosition, triggerNode]);

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
      if (delayTimeoutRef.current) {
        clearTimeout(delayTimeoutRef.current);
        delayTimeoutRef.current = null;
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

    // Touch support: long-press to show, tap elsewhere to dismiss
    const touchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleTouchStart = useCallback(() => {
      if (disabled) return;
      touchTimeoutRef.current = setTimeout(() => {
        setOpen(true);
      }, 500);
    }, [disabled, setOpen]);

    const handleTouchEnd = useCallback(() => {
      if (touchTimeoutRef.current) {
        clearTimeout(touchTimeoutRef.current);
        touchTimeoutRef.current = null;
      }
    }, []);

    useEffect(() => {
      if (!isOpen || !isBrowser) return;

      const handleTouchOutside = (e: TouchEvent) => {
        const target = e.target as Node;
        if (
          tooltipRef.current?.contains(target) ||
          triggerNode?.contains(target)
        )
          return;
        setOpen(false);
      };

      document.addEventListener("touchstart", handleTouchOutside, {
        passive: true,
      });
      return () =>
        document.removeEventListener("touchstart", handleTouchOutside);
    }, [isOpen, setOpen, triggerNode]);

    useEffect(() => {
      return () => {
        if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
      };
    }, []);

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

    const truncateStyle: React.CSSProperties | undefined =
      truncate && truncateWidth !== undefined
        ? {
            maxWidth:
              typeof truncateWidth === "number" ? truncateWidth : truncateWidth,
          }
        : undefined;

    const triggerContent = truncate ? (
      <span
        ref={textRef}
        className={cn("block truncate", mergedClasses.trigger)}
        style={truncateStyle}
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

    const finalContentClassName = mergedClasses.content;

    const resolvedSide = position.resolvedSide ?? side;
    const svgWidth = arrowSizeProp * 2;
    const svgHeight = arrowSizeProp;

    const getArrowPosition = (): React.CSSProperties => {
      const style: React.CSSProperties = {
        position: "absolute",
        transform: `rotate(${position.arrowRotation}deg)`,
      };

      switch (resolvedSide) {
        case "top":
          style.bottom = -svgHeight;
          style.left =
            position.arrowLeft !== undefined
              ? position.arrowLeft - svgHeight
              : "50%";
          if (position.arrowLeft === undefined)
            style.transform += " translateX(-50%)";
          break;
        case "bottom":
          style.top = -svgHeight;
          style.left =
            position.arrowLeft !== undefined
              ? position.arrowLeft - svgHeight
              : "50%";
          if (position.arrowLeft === undefined)
            style.transform += " translateX(-50%)";
          break;
        case "left":
          style.right = -svgHeight;
          style.top =
            position.arrowTop !== undefined
              ? position.arrowTop - svgHeight
              : "50%";
          if (position.arrowTop === undefined)
            style.transform += " translateY(-50%)";
          break;
        case "right":
          style.left = -svgHeight;
          style.top =
            position.arrowTop !== undefined
              ? position.arrowTop - svgHeight
              : "50%";
          if (position.arrowTop === undefined)
            style.transform += " translateY(-50%)";
          break;
      }

      return style;
    };

    const arrowElement = showArrow ? (
      <svg
        width={svgWidth}
        height={svgHeight}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        aria-hidden="true"
        className={cn(mergedClasses.baseArrow, mergedClasses.arrow)}
        style={{
          ...baseArrowStyle,
          ...getArrowPosition(),
          ...arrowStyle,
          ...(arrowColor ? { fill: arrowColor } : {}),
        }}
      >
        <path
          d={`M0 ${svgHeight}L${svgHeight} 0L${svgWidth} ${svgHeight}H0Z`}
        />
      </svg>
    ) : null;

    const portalTarget = portalContainer ?? (isBrowser ? document.body : null);

    const tooltipElement = isOpen && (
      <div
        ref={tooltipRef}
        id={tooltipId}
        role="tooltip"
        className={finalContentClassName}
        style={{
          position: "fixed",
          top: position.top,
          left: position.left,
          maxWidth: computedMaxWidth,
          ...wordWrapStyles[wordWrap],
          visibility: isPositioned ? "visible" : "hidden",
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

    const tooltipContent =
      portal && portalTarget
        ? tooltipElement && createPortal(tooltipElement, portalTarget)
        : tooltipElement;

    if (asChild && isValidElement(children)) {
      return (
        <TooltipAsChildTrigger
          child={children as ReactElement<Record<string, unknown>>}
          setTriggerNode={setTriggerNode}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          isOpen={isOpen}
          tooltipId={tooltipId}
          triggerClassName={mergedClasses.trigger}
          tooltipContent={tooltipContent}
        />
      );
    }

    return (
      <>
        <span
          ref={mergeTooltipRefs(
            setTriggerNode,
            forwardedRef as Ref<HTMLElement>,
          )}
          className={cn(mergedClasses.trigger, className) || undefined}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          tabIndex={triggerIsInteractive ? undefined : 0}
          style={{ display: triggerDisplay }}
          aria-describedby={isOpen ? tooltipId : undefined}
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
