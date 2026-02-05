import { forwardRef, useRef, useEffect, useCallback, useState, memo } from "react";
import { useAccordionContext, useAccordionItemContext } from "../utils/context";
import { Slot } from "../../../utils/Slot";
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
    ref
  ) => {
    const accordion = useAccordionContext();
    const item = useAccordionItemContext();

    const animationDuration = propAnimationDuration ?? accordion.animationDuration;
    const animationEasing = propAnimationEasing ?? accordion.animationEasing;
    const effectiveDuration = accordion.reduceMotion ? 0 : animationDuration;

    const [showExpanded, setShowExpanded] = useState(false);
    const [hasBeenOpened, setHasBeenOpened] = useState(item.isExpanded);
    const [prevIsExpanded, setPrevIsExpanded] = useState(item.isExpanded);
    const [isClosing, setIsClosing] = useState(false);
    const animationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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

    useEffect(() => {
      if (item.isExpanded) {
        rafRef.current = requestAnimationFrame(() => {
          rafRef.current = requestAnimationFrame(() => {
            setShowExpanded(true);
          });
        });
      }

      return () => {
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
        }
      };
    }, [item.isExpanded]);

    useEffect(() => {
      if (animationTimerRef.current) {
        clearTimeout(animationTimerRef.current);
      }

      if (item.isExpanded) {
        onOpenStart?.();
        animationTimerRef.current = setTimeout(() => onOpenEnd?.(), effectiveDuration);
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
    }, [item.isExpanded, effectiveDuration, onOpenStart, onOpenEnd, onCloseStart, onCloseEnd]);

    const combinedRef = useCallback(
      (node: HTMLDivElement | null) => {
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref]
    );

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

    const contentClassName = cn(
      "grid transition-all",
      showExpanded
        ? "grid-rows-[1fr] opacity-100 visible" 
        : "grid-rows-[0fr] opacity-0 invisible",
      className
    );

    const contentStyle: React.CSSProperties = {
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
        data-orientation={accordion.orientation}
        className={contentClassName || undefined}
        style={contentStyle}
        {...rest}
      >
        {asChild ? children : (
          <div className="overflow-hidden">
            <div className={cn(accordion.classNames.content, accordion.classNames.contentInner) || undefined}>
              {children}
            </div>
          </div>
        )}
      </Comp>
    );
  }
);

AccordionContent.displayName = "AccordionContent";

export default memo(AccordionContent);
