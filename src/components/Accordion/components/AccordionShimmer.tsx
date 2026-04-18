import { forwardRef, useMemo } from "react";
import type { AccordionShimmerProps } from "../utils/types";
import { SIZE_CLASSES, VARIANT_CLASSES } from "../utils/constants";
import { Slot } from "../../../utils/Slot";
import { cn } from "../../../utils/cn";

const TITLE_WIDTHS = [75, 68, 82, 70, 78];
const SUBTITLE_WIDTHS = [55, 62, 48, 58, 52];

const AccordionShimmer = forwardRef<HTMLDivElement, AccordionShimmerProps>(
  (
    {
      count = 3,
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
    const shimmerClass = animate ? "animate-pulse" : "";

    return (
      <Comp
        ref={ref}
        className={cn("w-full", variantClasses.root, className)}
        style={style}
        role="status"
        aria-label={`Loading ${count} accordion items`}
        aria-busy="true"
      >
        {items.map((index) => (
          <div key={index} className={variantClasses.item}>
            <div
              className={cn(
                "flex items-center justify-between",
                sizeClasses.trigger,
              )}
            >
              <div className="flex-1 space-y-2">
                <div
                  className={cn(
                    "h-4 rounded bg-gray-200 dark:bg-gray-700",
                    shimmerClass,
                  )}
                  style={{
                    width: `${TITLE_WIDTHS[index % TITLE_WIDTHS.length]}%`,
                  }}
                />
                {showContent && (
                  <div
                    className={cn(
                      "h-3 rounded bg-gray-100 dark:bg-gray-600",
                      shimmerClass,
                    )}
                    style={{
                      width: `${SUBTITLE_WIDTHS[index % SUBTITLE_WIDTHS.length]}%`,
                    }}
                  />
                )}
              </div>
              <div
                className={cn(
                  sizeClasses.icon,
                  "rounded bg-gray-200 dark:bg-gray-700 shrink-0 ml-4",
                  shimmerClass,
                )}
              />
            </div>
            {showContent && (
              <div className={sizeClasses.content}>
                <div className="space-y-2">
                  <div
                    className={cn(
                      "h-3 rounded bg-gray-100 dark:bg-gray-600",
                      shimmerClass,
                    )}
                    style={{ width: "100%" }}
                  />
                  <div
                    className={cn(
                      "h-3 rounded bg-gray-100 dark:bg-gray-600",
                      shimmerClass,
                    )}
                    style={{ width: "85%" }}
                  />
                  <div
                    className={cn(
                      "h-3 rounded bg-gray-100 dark:bg-gray-600",
                      shimmerClass,
                    )}
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
