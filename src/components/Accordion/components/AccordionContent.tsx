import { forwardRef, useRef, useEffect, useCallback, useState } from "react";
import { useAccordionContext, useAccordionItemContext } from "../utils/context";
import { Slot } from "../utils/slot";
import { DEFAULT_ANIMATION_DURATION } from "../utils/constants";
import type { AccordionContentProps } from "../utils/types";

const AccordionContent = forwardRef<HTMLDivElement, AccordionContentProps>(
  (
    {
      children,
      forceMount = false,
      animationDuration = DEFAULT_ANIMATION_DURATION,
      onOpenStart,
      onOpenEnd,
      onCloseStart,
      onCloseEnd,
      className,
      asChild = false,
      ...rest
    },
    ref
  ) => {
    const accordion = useAccordionContext();
    const item = useAccordionItemContext();

    const [hasBeenOpened, setHasBeenOpened] = useState(item.isExpanded);
    const [prevExpanded, setPrevExpanded] = useState(item.isExpanded);
    const prevExpandedRef = useRef(item.isExpanded);
    const contentRef = useRef<HTMLDivElement>(null);

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
        if (isExpanded) {
          onOpenStart?.();
          const timer = setTimeout(() => {
            onOpenEnd?.();
          }, animationDuration);
          return () => clearTimeout(timer);
        } else {
          onCloseStart?.();
          const timer = setTimeout(() => {
            onCloseEnd?.();
          }, animationDuration);
          return () => clearTimeout(timer);
        }
      }

      prevExpandedRef.current = isExpanded;
    }, [item.isExpanded, animationDuration, onOpenStart, onOpenEnd, onCloseStart, onCloseEnd]);

    useEffect(() => {
      prevExpandedRef.current = item.isExpanded;
    }, [item.isExpanded]);

    const shouldRender = forceMount || item.isExpanded || hasBeenOpened;

    const dataState = item.isExpanded ? "open" : "closed";

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
      className: `grid transition-all ease-in-out ${
        item.isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
      } ${className ?? ""}`.trim(),
      style: { transitionDuration: `${animationDuration}ms` },
      ...rest,
    };

    if (asChild) {
      return (
        <Comp ref={combinedRef} {...contentProps}>
          {children}
        </Comp>
      );
    }

    return (
      <Comp ref={combinedRef} {...contentProps}>
        <div className="overflow-hidden">
          <div className={accordion.classNames.content ?? ""}>
            {children}
          </div>
        </div>
      </Comp>
    );
  }
);

AccordionContent.displayName = "AccordionContent";

export default AccordionContent;
