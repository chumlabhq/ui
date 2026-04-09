import { forwardRef, useRef, useEffect, useState } from "react";
import { useAccordionConfig, useAccordionItemContext } from "../utils/context";
import { Slot } from "../../../utils/Slot";
import { mergeRefs } from "../../../utils/mergeRefs";
import type { AccordionContentProps } from "../utils/types";
import { cn } from "../../../utils/cn";

const AccordionContent = forwardRef<HTMLDivElement, AccordionContentProps>(
  (
    {
      children,
      forceMount = false,
      animationDuration: propAnimationDuration,
      animationEasing: propAnimationEasing,
      onOpenStart,
      onOpenEnd,
      onCloseStart,
      onCloseEnd,
      className,
      asChild = false,
      lazyLoad = false,
      unmountOnClose = false,
      ...rest
    },
    ref,
  ) => {
    const config = useAccordionConfig();
    const item = useAccordionItemContext();

    const animationDuration =
      propAnimationDuration ?? config.animationDuration;
    const animationEasing = propAnimationEasing ?? config.animationEasing;
    const effectiveDuration = config.reduceMotion ? 0 : animationDuration;

    const [showExpanded, setShowExpanded] = useState(false);
    const [hasBeenOpened, setHasBeenOpened] = useState(item.isExpanded);
    const [prevIsExpanded, setPrevIsExpanded] = useState(item.isExpanded);
    const [isClosing, setIsClosing] = useState(false);
    const [measuredHeight, setMeasuredHeight] = useState<number>(0);
    const rafRef = useRef<number | null>(null);

    if (item.isExpanded !== prevIsExpanded) {
      setPrevIsExpanded(item.isExpanded);
      if (item.isExpanded && !hasBeenOpened) {
        setHasBeenOpened(true);
      }
      if (!item.isExpanded && prevIsExpanded) {
        setIsClosing(true);
        setShowExpanded(false);
      }
    }

    const contentNodeRef = useRef<HTMLDivElement>(null);

    const measureHeight = () => {
      if (contentNodeRef.current) {
        setMeasuredHeight(contentNodeRef.current.scrollHeight);
      }
    };

    useEffect(() => {
      if (item.isExpanded) {
        measureHeight();
        rafRef.current = requestAnimationFrame(() => {
          setShowExpanded(true);
        });
      }

      return () => {
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
        }
      };
    }, [item.isExpanded]);

    // Observe content size changes while expanded (debounced)
    useEffect(() => {
      if (!item.isExpanded || !contentNodeRef.current) return;
      if (typeof ResizeObserver === "undefined") return;

      let rafId: number | null = null;
      const observer = new ResizeObserver(() => {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          if (item.isExpanded && contentNodeRef.current) {
            setMeasuredHeight(contentNodeRef.current.scrollHeight);
          }
        });
      });
      observer.observe(contentNodeRef.current);
      return () => {
        observer.disconnect();
        if (rafId) cancelAnimationFrame(rafId);
      };
    }, [item.isExpanded]);

    // Animation callbacks via transitionend (with fallback for duration=0)
    const endFiredRef = useRef(false);
    useEffect(() => {
      const node = contentNodeRef.current;
      endFiredRef.current = false;

      if (item.isExpanded) {
        onOpenStart?.();
      } else {
        onCloseStart?.();
      }

      const fireEnd = () => {
        if (endFiredRef.current) return;
        endFiredRef.current = true;

        if (item.isExpanded) {
          onOpenEnd?.();
        } else {
          onCloseEnd?.();
          setIsClosing(false);
        }
      };

      // For zero-duration (reduced motion), fire callbacks immediately
      if (effectiveDuration === 0) {
        fireEnd();
        return;
      }

      if (!node) return;

      const handleTransitionEnd = (e: TransitionEvent) => {
        // Only respond to transitions on this element (not children)
        if (e.target !== node) return;
        // Only respond to max-height transition (the primary one)
        if (e.propertyName !== "max-height") return;
        fireEnd();
      };

      node.addEventListener("transitionend", handleTransitionEnd);

      // Safety fallback: if transitionend doesn't fire (e.g., display:none parent)
      const fallbackTimer = setTimeout(fireEnd, effectiveDuration + 50);

      return () => {
        node.removeEventListener("transitionend", handleTransitionEnd);
        clearTimeout(fallbackTimer);
      };
    }, [
      item.isExpanded,
      effectiveDuration,
      onOpenStart,
      onOpenEnd,
      onCloseStart,
      onCloseEnd,
    ]);

    const combinedRef = mergeRefs(ref, contentNodeRef);

    const shouldRender = (() => {
      if (forceMount) return true;
      if (item.isExpanded) return true;
      if (unmountOnClose) return false;
      if (lazyLoad && !hasBeenOpened) return false;
      if (isClosing) return true;
      return hasBeenOpened;
    })();

    if (!shouldRender) {
      return null;
    }

    const wrapperClassName = cn(config.classes.contentWrapper, className);

    const contentStyle: React.CSSProperties = {
      maxHeight: showExpanded ? measuredHeight : 0,
      opacity: showExpanded ? 1 : 0,
      visibility: showExpanded ? "visible" : "hidden",
      overflow: showExpanded ? undefined : "hidden",
      // Prevent interaction with content during close animation
      pointerEvents: showExpanded ? undefined : "none",
      transitionDuration: `${effectiveDuration}ms`,
      transitionTimingFunction: animationEasing,
    };

    const Comp = asChild ? Slot : "div";

    return (
      <Comp
        ref={combinedRef}
        id={item.contentId}
        role={item.isExpanded ? "region" : undefined}
        aria-labelledby={item.isExpanded ? item.triggerId : undefined}
        aria-hidden={!item.isExpanded}
        data-state={item.isExpanded ? "open" : "closed"}
        data-disabled={item.disabled || undefined}
        data-orientation={config.orientation}
        className={wrapperClassName || undefined}
        style={contentStyle}
        {...rest}
      >
        {asChild ? (
          children
        ) : (
          <div
            className={
              cn(
                config.classes.content,
                config.classes.contentInner,
              ) || undefined
            }
          >
            {children}
          </div>
        )}
      </Comp>
    );
  },
);

AccordionContent.displayName = "AccordionContent";

export default AccordionContent;
