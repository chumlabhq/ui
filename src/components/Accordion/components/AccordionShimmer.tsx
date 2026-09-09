import { motionSafeClasses } from "../../../utils/classLayers.js";
import { useReducedMotion } from "../../../utils/useReducedMotion.js";
import { forwardRef, useMemo } from "react";
import type { AccordionShimmerProps } from "../utils/types.js";
import {
  SIZE_CLASSES,
  VARIANT_CLASSES,
  DEFAULT_ACCORDION_SHIMMER_CLASSES,
  UNSTYLED_ACCORDION_SHIMMER_CLASSES,
} from "../utils/constants.js";
import { Slot } from "../../../utils/Slot.js";
import { cn, composeClasses } from "../../../utils/scopedCn.js";

const TITLE_WIDTHS = [75, 68, 82, 70, 78];
const SUBTITLE_WIDTHS = [55, 62, 48, 58, 52];

const AccordionShimmer = forwardRef<HTMLDivElement, AccordionShimmerProps>(
  (
    {
      count = 3,
      classes,
      unstyled = false,
      reduceMotion = "auto",
      size = "md",
      variant = "default",
      animate = true,
      className,
      style,
      showContent = false,
      asChild = false,
    },
    ref,
  ) => {
    const sizeClasses = SIZE_CLASSES[size];
    const variantClasses = VARIANT_CLASSES[variant];
    const Comp = asChild ? Slot : "div";

    const items = useMemo(
      () => Array.from({ length: count }, (_, i) => i),
      [count],
    );
    const effectiveReduceMotion = useReducedMotion(reduceMotion);
    const base = unstyled
      ? UNSTYLED_ACCORDION_SHIMMER_CLASSES
      : DEFAULT_ACCORDION_SHIMMER_CLASSES;
    // The animation lives in the defaults now, so `unstyled` can strip it and a
    // consumer can reach it. `animate={false}` still switches it off.
    // Both the prop and the OS preference switch it off; reduced-motion is not
    // something an `animate` default gets to override.
    const c = motionSafeClasses(
      composeClasses(base, classes),
      !animate || effectiveReduceMotion,
    );

    return (
      <Comp
        ref={ref}
        className={cn(c.root, variantClasses.root, className)}
        style={style}
        role="status"
        aria-label={`Loading ${count} accordion items`}
        aria-busy="true"
      >
        {items.map((index) => (
          <div key={index} className={cn(c.item, variantClasses.item) || undefined}>
            <div
              className={cn(c.trigger, sizeClasses.trigger)}
            >
              <div className={c.itemText || undefined}>
                <div
                  className={c.titleBar || undefined}
                  style={{
                    width: `${TITLE_WIDTHS[index % TITLE_WIDTHS.length]}%`,
                  }}
                />
                {showContent && (
                  <div
                    className={c.descriptionBar || undefined}
                    style={{
                      width: `${SUBTITLE_WIDTHS[index % SUBTITLE_WIDTHS.length]}%`,
                    }}
                  />
                )}
              </div>
              <div
                className={cn(sizeClasses.icon, c.icon)}
              />
            </div>
            {showContent && (
              <div className={sizeClasses.content}>
                <div className={c.body || undefined}>
                  <div
                    className={c.descriptionBar || undefined}
                    style={{ width: "100%" }}
                  />
                  <div
                    className={c.descriptionBar || undefined}
                    style={{ width: "85%" }}
                  />
                  <div
                    className={c.descriptionBar || undefined}
                    style={{ width: "70%" }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </Comp>
    );
  },
);

AccordionShimmer.displayName = "AccordionShimmer";

export default AccordionShimmer;
