import { forwardRef, useRef, useEffect, useCallback, useState, useMemo, memo } from "react";
import { useAccordionContext, useAccordionItemContext } from "../utils/context";
import { Slot } from "../../../utils/Slot";
import type { AccordionContentProps } from "../utils/types";

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
    ref
  ) => {
    const accordion = useAccordionContext();
    const item = useAccordionItemContext();

    const animationDuration = propAnimationDuration ?? accordion.animationDuration;
    const animationEasing = propAnimationEasing ?? accordion.animationEasing;
    const effectiveDuration = accordion.reduceMotion ? 0 : animationDuration;

    const [hasBeenOpened, setHasBeenOpened] = useState(item.isExpanded);
    const [prevExpanded, setPrevExpanded] = useState(item.isExpanded);
    const [isAnimating, setIsAnimating] = useState(false);
    const prevExpandedRef = useRef(item.isExpanded);
    const contentRef = useRef<HTMLDivElement>(null);
    const animationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    if (item.isExpanded !== prevExpanded) {
      setPrevExpanded(item.isExpanded);
      if (item.isExpanded && !hasBeenOpened) {
        setHasBeenOpened(true);
      }
    }

    const combinedRef = useCallback(
      (node: HTMLDivElement | null) => {
        (contentRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref]
    );

    useEffect(() => {
      const wasExpanded = prevExpandedRef.current;
      const isExpanded = item.isExpanded;

      if (wasExpanded !== isExpanded) {
        setIsAnimating(true);
        
        if (animationTimerRef.current) {
          clearTimeout(animationTimerRef.current);
        }

        if (isExpanded) {
          onOpenStart?.();
          animationTimerRef.current = setTimeout(() => {
            onOpenEnd?.();
            setIsAnimating(false);
          }, effectiveDuration);
        } else {
          onCloseStart?.();
          animationTimerRef.current = setTimeout(() => {
            onCloseEnd?.();
            setIsAnimating(false);
          }, effectiveDuration);
        }
      }

      prevExpandedRef.current = isExpanded;

      return () => {
        if (animationTimerRef.current) {
          clearTimeout(animationTimerRef.current);
        }
      };
    }, [item.isExpanded, effectiveDuration, onOpenStart, onOpenEnd, onCloseStart, onCloseEnd]);

    useEffect(() => {
      prevExpandedRef.current = item.isExpanded;
    }, [item.isExpanded]);

    const shouldRender = useMemo(() => {
      if (forceMount) return true;
      if (item.isExpanded) return true;
      if (unmountOnClose) return false;
      if (lazyLoad && !hasBeenOpened) return false;
      if (isAnimating) return true;
      return hasBeenOpened;
    }, [forceMount, item.isExpanded, unmountOnClose, lazyLoad, hasBeenOpened, isAnimating]);

    const dataState = item.isExpanded ? "open" : "closed";

    const contentClassName = useMemo(() => {
      const baseClass = "grid transition-all";
      const stateClass = item.isExpanded 
        ? "grid-rows-[1fr] opacity-100 visible" 
        : "grid-rows-[0fr] opacity-0 invisible";
      const customClass = className ?? "";
      return `${baseClass} ${stateClass} ${customClass}`.trim();
    }, [item.isExpanded, className]);

    const contentStyle = useMemo(() => ({
      transitionDuration: `${effectiveDuration}ms`,
      transitionTimingFunction: animationEasing,
      willChange: isAnimating ? "grid-template-rows, opacity" : undefined,
    }), [effectiveDuration, animationEasing, isAnimating]);

    if (!shouldRender) {
      return null;
    }

    const Comp = asChild ? Slot : "div";

    const contentProps = {
      id: item.contentId,
      role: "region" as const,
      "aria-labelledby": item.triggerId,
      "aria-hidden": !item.isExpanded,
      "data-state": dataState,
      "data-disabled": item.disabled || undefined,
      "data-orientation": accordion.orientation,
      "data-animating": isAnimating || undefined,
      className: contentClassName || undefined,
      style: contentStyle,
      ...rest,
    };

    if (asChild) {
      return (
        <Comp ref={combinedRef} {...contentProps}>
          {children}
        </Comp>
      );
    }

    const innerClassName = `${accordion.classNames.content ?? ""} ${accordion.classNames.contentInner ?? ""}`.trim();

    return (
      <Comp ref={combinedRef} {...contentProps}>
        <div className="overflow-hidden">
          <div className={innerClassName || undefined}>
            {children}
          </div>
        </div>
      </Comp>
    );
  }
);

AccordionContent.displayName = "AccordionContent";

export default memo(AccordionContent);
