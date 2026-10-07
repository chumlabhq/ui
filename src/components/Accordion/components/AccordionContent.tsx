import { forwardRef, useRef, useEffect, useState } from "react";
import { useAccordionConfig, useAccordionItemContext } from "../utils/context.js";
import { Slot } from "../../../utils/Slot.js";
import { mergeRefs } from "../../../utils/mergeRefs.js";
import type { AccordionContentProps } from "../utils/types.js";
import { cn } from "../../../utils/scopedCn.js";
import { useIsomorphicLayoutEffect } from "../../../utils/useIsomorphicLayoutEffect.js";

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

    const [hasBeenOpened, setHasBeenOpened] = useState(item.isExpanded);
    const [prevIsExpanded, setPrevIsExpanded] = useState(item.isExpanded);
    const [isClosing, setIsClosing] = useState(false);

    if (item.isExpanded !== prevIsExpanded) {
      setPrevIsExpanded(item.isExpanded);
      if (item.isExpanded && !hasBeenOpened) {
        setHasBeenOpened(true);
      }
      if (!item.isExpanded && prevIsExpanded) {
        setIsClosing(true);
      }
    }

    const contentNodeRef = useRef<HTMLDivElement>(null);
    const innerRef = useRef<HTMLDivElement>(null);

    /**
     * Measure once, into a custom property, and let CSS keyframes do the rest.
     *
     * Two earlier attempts failed here. A `max-height` transition read
     * `scrollHeight` on every open, and the first open read content that had
     * never been laid out, so the transition ran to the wrong target and a
     * ResizeObserver corrected it a frame later. Grid rows removed the
     * measurement but jittered anyway, because the row being clipped was also
     * the element carrying `px-4 py-4` — a clipper with padding cannot collapse
     * cleanly, so it stuck and then snapped.
     *
     * So: the animating element is a bare clipper with no padding, margin or
     * border, all of that lives on the inner div, and the height it animates to
     * is written once to `--cl-accordion-content-height`. Animation is
     * suppressed for the read so the measurement is the content's natural
     * height rather than whatever frame the animation is on.
     *
     * The variable is deliberately on the element rather than kept in state: a
     * consumer can write their own keyframes against it, which is the whole
     * point of Radix exposing it.
     */
    useIsomorphicLayoutEffect(() => {
      const node = contentNodeRef.current;
      const inner = innerRef.current;
      if (!node || !inner) return;

      const previous = node.style.animationName;
      node.style.animationName = "none";
      const height = inner.getBoundingClientRect().height;
      if (height > 0) {
        node.style.setProperty("--cl-accordion-content-height", `${height}px`);
      }
      node.style.animationName = previous;
    }, [item.isExpanded, children]);



    /**
     * The callbacks are read through refs, and the effect below keys on
     * `item.isExpanded` alone.
     *
     * With the callbacks in its dependency array, a consumer passing inline
     * arrows re-ran the effect on every render, and the effect fires a start
     * callback each time it runs. A callback that set the parent's state
     * therefore looped: the docs page's Animation Callbacks section counted
     * onCloseStart into the thousands and starved React Router's navigation
     * transition, so the URL changed while the old page stayed on screen.
     */
    const callbacksRef = useRef({ onOpenStart, onOpenEnd, onCloseStart, onCloseEnd });
    const durationRef = useRef(effectiveDuration);
    useIsomorphicLayoutEffect(() => {
      callbacksRef.current = { onOpenStart, onOpenEnd, onCloseStart, onCloseEnd };
      durationRef.current = effectiveDuration;
    }, [onOpenStart, onOpenEnd, onCloseStart, onCloseEnd, effectiveDuration]);

    // Mounting is not opening or closing: the callbacks fire on a change only.
    const settledExpandedRef = useRef(item.isExpanded);

    const endFiredRef = useRef(false);
    useEffect(() => {
      if (settledExpandedRef.current === item.isExpanded) return;
      settledExpandedRef.current = item.isExpanded;

      const node = contentNodeRef.current;
      const duration = durationRef.current;
      endFiredRef.current = false;

      if (item.isExpanded) {
        callbacksRef.current.onOpenStart?.();
      } else {
        callbacksRef.current.onCloseStart?.();
      }

      const fireEnd = () => {
        if (endFiredRef.current) return;
        endFiredRef.current = true;

        if (item.isExpanded) {
          callbacksRef.current.onOpenEnd?.();
        } else {
          callbacksRef.current.onCloseEnd?.();
          setIsClosing(false);
        }
      };

      if (duration === 0) {
        fireEnd();
        return;
      }

      if (!node) return;

      // `animationend`, not `transitionend`. The panel is driven by keyframes
      // now, so the old listener — which also required `propertyName ===
      // "max-height"` — could never fire, and the timeout below had quietly
      // become the only thing firing onOpenEnd and onCloseEnd, always ~50ms
      // late. A fallback that is load-bearing is not a fallback.
      const handleAnimationEnd = (e: AnimationEvent) => {
        if (e.target !== node) return;
        if (e.animationName !== "cl-accordion-down" && e.animationName !== "cl-accordion-up") return;
        fireEnd();
      };

      node.addEventListener("animationend", handleAnimationEnd);

      // A real fallback: an element in a `display: none` subtree runs no
      // animation, so nothing would fire.
      const fallbackTimer = setTimeout(fireEnd, duration + 50);

      return () => {
        node.removeEventListener("animationend", handleAnimationEnd);
        clearTimeout(fallbackTimer);
      };
    }, [item.isExpanded]);

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

    // Deliberately NOT on the animating element.
    //
    // `content` used to be the clipper's own class, so a consumer writing
    // `classes={{ content: "px-4 py-4" }}` put padding back on the element
    // whose height is being animated — and a clipper with padding cannot
    // collapse to nothing, so it sticks and then snaps. That is the fault this
    // component has now had three times, and the third time a consumer
    // reintroduced it through a slot the library invited them to style.
    //
    // The clipper is internal now. Nothing a consumer can name lands on it, so
    // padding on `content` or `body` is inside the animated region where it is
    // clipped correctly.
    const panelClassName = cn(config.classes.content, className);

    const contentStyle: React.CSSProperties = {
      overflow: "hidden",
      // `data-state` selects the keyframe; the element carries no padding, so
      // there is nothing to re-lay out while the height runs.
      animationName: effectiveDuration
        ? item.isExpanded
          ? "cl-accordion-down"
          : "cl-accordion-up"
        : undefined,
      animationDuration: `${effectiveDuration}ms`,
      animationTimingFunction: animationEasing,
      animationFillMode: "forwards",
      // With motion off there is no animation to hold the end state.
      height: effectiveDuration
        ? undefined
        : item.isExpanded
          ? "var(--cl-accordion-content-height, auto)"
          : 0,
      visibility: item.isExpanded || isClosing ? "visible" : "hidden",
      pointerEvents: item.isExpanded ? undefined : "none",
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
        style={contentStyle}
        {...rest}
      >
        {asChild ? (
          children
        ) : (
          <div ref={innerRef} className={panelClassName || undefined}>
            <div className={cn(config.classes.body) || undefined}>{children}</div>
          </div>
        )}
      </Comp>
    );
  },
);

AccordionContent.displayName = "AccordionContent";

export default AccordionContent;
