import { forwardRef, useRef, useEffect, useState } from "react";
import { useAccordionConfig, useAccordionItemContext } from "../utils/context.js";
import { Slot } from "../../../utils/Slot.js";
import { mergeRefs } from "../../../utils/mergeRefs.js";
import type { AccordionContentProps } from "../utils/types.js";
import { cn } from "../../../utils/scopedCn.js";

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


    useEffect(() => {
      if (item.isExpanded) {
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

      if (effectiveDuration === 0) {
        fireEnd();
        return;
      }

      if (!node) return;

      const handleTransitionEnd = (e: TransitionEvent) => {
        if (e.target !== node) return;
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

    const wrapperClassName = cn(config.classes.content, className);

    // A grid row that animates from 0fr to 1fr, not a measured max-height.
    //
    // The old path read `scrollHeight` on every open. On the FIRST open that
    // read happens against content that has never been laid out — it is
    // `visibility: hidden` inside a `max-height: 0` box — so the height came
    // back wrong, the transition ran to the wrong target, and a ResizeObserver
    // corrected it a frame later. That is the jitter, and it is why only the
    // first open of an item stutters. Closing had the mirror problem: the panel
    // held its measured height until the measurement caught up.
    //
    // The browser can interpolate a grid track without being told the height,
    // so there is nothing to measure and nothing to correct. This is also what
    // the Animation guide has always claimed the component does.
    const contentStyle: React.CSSProperties = {
      display: "grid",
      gridTemplateRows: showExpanded ? "1fr" : "0fr",
      opacity: showExpanded ? 1 : 0,
      visibility: showExpanded ? "visible" : "hidden",
      pointerEvents: showExpanded ? undefined : "none",
      transitionProperty: "grid-template-rows, opacity, visibility",
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
            // The grid row itself. `min-height: 0` lets it shrink below its
            // content's intrinsic height, which is what makes 0fr collapse at
            // all; `overflow: hidden` keeps the content clipped on the way.
            style={{ minHeight: 0, overflow: "hidden" }}
            className={cn(config.classes.body) || undefined}
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
