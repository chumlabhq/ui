import { forwardRef, useRef, useEffect, useState, memo } from "react";
import { useAccordionConfig, useAccordionItemContext } from "../utils/context";
import { Slot, mergeRefs } from "../../../utils/Slot";
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
    const animationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
      null,
    );
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

    useEffect(() => {
      if (!item.isExpanded || !contentNodeRef.current) return;
      if (typeof ResizeObserver === "undefined") return;

      const observer = new ResizeObserver(() => {
        if (item.isExpanded && contentNodeRef.current) {
          setMeasuredHeight(contentNodeRef.current.scrollHeight);
        }
      });
      observer.observe(contentNodeRef.current);
      return () => observer.disconnect();
    }, [item.isExpanded]);

    useEffect(() => {
      if (animationTimerRef.current) {
        clearTimeout(animationTimerRef.current);
      }

      if (item.isExpanded) {
        onOpenStart?.();
        animationTimerRef.current = setTimeout(
          () => onOpenEnd?.(),
          effectiveDuration,
        );
      } else {
        onCloseStart?.();
        animationTimerRef.current = setTimeout(() => {
          onCloseEnd?.();
          setIsClosing(false);
        }, effectiveDuration);
      }

      return () => {
        if (animationTimerRef.current) {
          clearTimeout(animationTimerRef.current);
        }
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

    const contentClassName = cn("overflow-hidden transition-all", className);

    const contentStyle: React.CSSProperties = {
      maxHeight: showExpanded ? measuredHeight : 0,
      opacity: showExpanded ? 1 : 0,
      visibility: showExpanded ? "visible" : undefined,
      overflow: showExpanded ? undefined : "hidden",
      transitionDuration: `${effectiveDuration}ms`,
      transitionTimingFunction: animationEasing,
    };

    const Comp = asChild ? Slot : "div";

    return (
      <Comp
        ref={combinedRef}
        id={item.contentId}
        role="region"
        aria-labelledby={item.triggerId}
        aria-hidden={!item.isExpanded}
        data-state={item.isExpanded ? "open" : "closed"}
        data-disabled={item.disabled || undefined}
        data-orientation={config.orientation}
        className={contentClassName || undefined}
        style={contentStyle}
        {...rest}
      >
        {asChild ? (
          children
        ) : (
          <div
            className={
              cn(
                config.classNames.content,
                config.classNames.contentInner,
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

export default memo(AccordionContent);
