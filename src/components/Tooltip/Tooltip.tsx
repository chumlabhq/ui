import {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useId,
  forwardRef,
  isValidElement,
  cloneElement,
} from "react";
import type { ReactElement, Ref } from "react";

type Naming = Partial<Record<"id" | "aria-label" | "aria-labelledby" | "aria-describedby", string>>;
import { createPortal } from "react-dom";
import { LAYERS } from "../../utils/layers.js";
import { cn } from "../../utils/scopedCn.js";
import { mergeSlot } from "../../utils/mergeSlot.js";
import { useIsomorphicLayoutEffect } from "../../utils/useIsomorphicLayoutEffect.js";
import { useControllableState } from "../../utils/useControllableState.js";
import type { TooltipProps } from "./utils/types.js";
import {
  shadowPresets,
  isPresetShadow,
  wordWrapStyles,
  DEFAULT_TOOLTIP_CLASSES,
  UNSTYLED_TOOLTIP_CLASSES,
} from "./utils/constants.js";
import {
  mergeTooltipRefs,
  hasInteractiveChild,
  calculatePosition,
  type Position,
} from "./utils/helpers.js";
import { TooltipAsChildTrigger } from "./components/TooltipAsChildTrigger.js";
import { isBrowser, isRtl } from "../../utils/isBrowser.js";
import { useHydrated } from "../../utils/useHydrated.js";

import { motionSafeClasses } from "../../utils/classLayers.js";
import { useReducedMotion } from "../../utils/useReducedMotion.js";
const INTERACTIVE_ELEMENT_TYPES = new Set([
  "button",
  "a",
  "input",
  "textarea",
  "select",
]);

const isFocusVisible = (element: EventTarget): boolean => {
  try {
    return (element as Element).matches(":focus-visible");
  } catch {
    return true;
  }
};

/**
 * Component: Tooltip
 *
 * Purpose: Accessible tooltip with configurable positioning, delays, rich content,
 * arrows, shadows, auto-truncation, and full dark mode support.
 *
 * AI Usage Guidelines:
 * - Wrap any element: `<Tooltip content="text"><button>...</button></Tooltip>`
 * - Use `side` for placement, `align` for alignment
 * - Use `asChild` to merge props onto the child instead of wrapping
 * - Use `truncate` for auto-ellipsis with tooltip on overflow
 *
 * Reference: TOOLTIP.ai.md (this directory), src/pages/demo/TooltipDemo.tsx
 */
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
      hoverableContent = true,
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
      zIndex = LAYERS.tooltip,
      portal = true,
      portalContainer,
      asChild = false,
      triggerDisplay = "inline-flex",
      className,
      style,
      id,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      "aria-describedby": ariaDescribedBy,
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

    const prefersReducedMotionForClasses = useReducedMotion();

    const baseClassesRaw = unstyled ? UNSTYLED_TOOLTIP_CLASSES : DEFAULT_TOOLTIP_CLASSES;

    const baseClasses = motionSafeClasses(baseClassesRaw, prefersReducedMotionForClasses);
    const mergedClasses = useMemo(() => ({
      trigger: mergeSlot(baseClasses.trigger, classesProp?.trigger),
      content: mergeSlot(baseClasses.content, classesProp?.content),
      arrow: mergeSlot(baseClasses.arrow, classesProp?.arrow),
      baseArrow: mergeSlot(baseClasses.arrow, classesProp?.arrow),
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
    const [position, setPosition] = useState<Position>({ top: 0, inlineStart: 0 });
    const [isPositioned, setIsPositioned] = useState(false);
    const hydrated = useHydrated();

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
        const tooltip = tooltipRef.current;
        const triggerRect = triggerNode.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        const newPosition = calculatePosition(
          triggerRect,
          tooltipRect,
          side,
          align,
          sideOffset,
          alignOffset,
          isRtl(triggerNode),
          isRtl(tooltip),
        );
        setPosition({
          ...newPosition,
          arrowLeft: newPosition.arrowLeft === undefined ? undefined : newPosition.arrowLeft - tooltip.clientLeft,
          arrowTop: newPosition.arrowTop === undefined ? undefined : newPosition.arrowTop - tooltip.clientTop,
        });
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
      if (!hoverableContent) return;
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
    }, [hoverableContent]);

    const handleTooltipMouseLeave = useCallback(() => {
      setOpen(false);
    }, [setOpen]);

    // Focus opens the tip only when the browser would draw a focus ring for
    // it. A click, a tap, or focus a closing dialog hands back to its trigger
    // is not a request for the tip, and `:focus-visible` is the browser's own
    // answer to which one this was — the same one every ring in the library
    // is painted from. An engine without the selector keeps opening on focus.
    const handleFocus = useCallback(
      (event: React.FocusEvent) => {
        if (disabled) return;
        if (!isFocusVisible(event.target)) return;
        setOpen(true);
      },
      [disabled, setOpen],
    );

    const handleBlur = useCallback(
      (event: React.FocusEvent) => {
        const to = event.relatedTarget as Node | null;
        if (hoverableContent && to && tooltipRef.current?.contains(to)) return;
        setOpen(false);
      },
      [hoverableContent, setOpen],
    );

    const handleTooltipBlur = useCallback(
      (event: React.FocusEvent) => {
        const to = event.relatedTarget as Node | null;
        if (to && (tooltipRef.current?.contains(to) || triggerNode?.contains(to))) return;
        setOpen(false);
      },
      [setOpen, triggerNode],
    );

    // Escape dismisses an open tooltip wherever focus is (WCAG 1.4.13), and only
    // the tooltip. This was a handler on the trigger, so a tooltip opened by hover
    // with focus anywhere else ignored the key, and inside an open Modal the
    // Modal's capture listener on document closed the dialog first. Listening on
    // window in the capture phase runs ahead of every document listener, and
    // stopping the key there keeps the Modal or Drawer under the tooltip, and a
    // toast under that, from seeing it. Only while open: a closed tooltip lets
    // Escape through to whatever is underneath.
    useEffect(() => {
      if (!isOpen || !isBrowser) return;
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key !== "Escape") return;
        event.preventDefault();
        event.stopPropagation();
        setOpen(false);
      };
      window.addEventListener("keydown", handleEscape, true);
      return () => window.removeEventListener("keydown", handleEscape, true);
    }, [isOpen, setOpen]);

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
        className={cn(mergedClasses.trigger)}
        style={truncateStyle}
      >
        {children}
      </span>
    ) : (
      children
    );

    if (!shouldShowTooltip) {
      return truncate ? (
        <span
          id={id}
          className={className || undefined}
          style={style}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
        >
          {triggerContent}
        </span>
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

    /**
     * The rotation moves the arrow's footprint, so the rotated sides need it
     * back.
     *
     * The SVG's layout box is `svgWidth x svgHeight` (12x6 at the default
     * size) whatever the side, and `rotate(90deg)` spins it about its own
     * centre: the painted triangle ends up 6 wide and 12 tall, but the box the
     * offsets are measured from did not change. On `left` and `right` that put
     * only about 3px of the 6px arrow outside the bubble and left the other 3
     * lying ON it — where both stroked edges are visible against the card, so
     * the arrow read as a closed diamond overlapping the bubble instead of a
     * point growing out of it. Measured before this: a right-placed arrow sat
     * at dx -2 where top/bottom sit 5 to 6px clear.
     *
     * Half the difference between the two dimensions is exactly the shift.
     */
    const rotationInset = (svgWidth - svgHeight) / 2;

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
          style.right = -svgHeight - rotationInset;
          style.top =
            position.arrowTop !== undefined
              ? position.arrowTop - svgHeight / 2
              : "50%";
          if (position.arrowTop === undefined)
            style.transform += " translateY(-50%)";
          break;
        case "right":
          style.left = -svgHeight - rotationInset;
          style.top =
            position.arrowTop !== undefined
              ? position.arrowTop - svgHeight / 2
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
          overflow: "visible",
          ...baseArrowStyle,
          ...getArrowPosition(),
          ...arrowStyle,
          ...(arrowColor ? { fill: arrowColor } : {}),
        }}
      >
        {/* Path is intentionally unclosed: the two angled segments are
            stroked (so the arrow has a visible outline matching the
            tooltip border), while SVG's implicit fill rule still closes
            the triangle for the fill. The bottom edge — which sits flush
            against the tooltip card — has no stroke, so the outline
            blends seamlessly into the card border. */}
        <path
          d={`M0 ${svgHeight}L${svgHeight} 0L${svgWidth} ${svgHeight}`}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    ) : null;

    // Until hydration the target is null, which renders the tip inline — the
    // same tree the server sent. It moves to the portal on the render after.
    // Nothing reported this one: React deletes an unmatched trailing node
    // without a recoverable error, so the server shipped a tooltip inside
    // `<main>` and the client silently relocated it.
    const portalTarget = portalContainer ?? (hydrated ? document.body : null);

    const tooltipElement = isOpen && (
      <div
        ref={tooltipRef}
        id={tooltipId}
        role="tooltip"
        className={finalContentClassName}
        style={{
          position: "fixed",
          top: position.top,
          insetInlineStart: position.inlineStart,
          maxWidth: computedMaxWidth,
          ...wordWrapStyles[wordWrap],
          visibility: isPositioned ? "visible" : "hidden",
          opacity: isPositioned ? 1 : 0,
          pointerEvents: isPositioned ? "auto" : "none",
          zIndex,
          ...shadowStyle,
          ...contentStyle,
        }}
        tabIndex={hoverableContent ? -1 : undefined}
        onMouseEnter={handleTooltipMouseEnter}
        onMouseLeave={handleTooltipMouseLeave}
        onBlur={hoverableContent ? handleTooltipBlur : undefined}
      >
        {truncate ? children : content}
        {arrowElement}
      </div>
    );

    // Nothing at all until the portal target exists, rather than falling back
    // to rendering inline: a server has no target, so the fallback shipped the
    // tip inside `<main>` and the client moved it to the body on hydration. No
    // hydration error was reported — React deletes an unmatched trailing node
    // silently — which is why this one was found by comparing the HTML on disk
    // with the DOM afterwards rather than by the error channel.
    const tooltipContent = portal
      ? portalTarget && tooltipElement
        ? createPortal(tooltipElement, portalTarget)
        : null
      : tooltipElement;

    const naming = (own: Naming): Naming => ({
      id: id ?? own.id,
      "aria-label": ariaLabel ?? own["aria-label"],
      "aria-labelledby": ariaLabelledBy ?? own["aria-labelledby"],
      "aria-describedby":
        [own["aria-describedby"], ariaDescribedBy, isOpen && tooltipId].filter(Boolean).join(" ") || undefined,
    });

    if (asChild && isValidElement(children)) {
      return (
        <TooltipAsChildTrigger
          child={children as ReactElement<Record<string, unknown>>}
          setTriggerNode={setTriggerNode}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          naming={naming((children as ReactElement<Naming>).props)}
          triggerClassName={mergedClasses.trigger}
          tooltipContent={tooltipContent}
        />
      );
    }

    const onChild = triggerIsInteractive && !truncate && isValidElement(children);

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
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          tabIndex={triggerIsInteractive ? undefined : 0}
          style={{ display: triggerDisplay, ...style }}
          {...(onChild ? {} : naming({}))}
        >
          {onChild
            ? cloneElement(children as ReactElement<Naming>, naming((children as ReactElement<Naming>).props))
            : triggerContent}
        </span>
        {tooltipContent}
      </>
    );
  },
);

Tooltip.displayName = "Tooltip";

export default Tooltip;
