import { forwardRef } from "react";
import type { AccordionShimmerProps } from "./types";

const AccordionShimmer = forwardRef<HTMLDivElement, AccordionShimmerProps>(
  (
    {
      className = "",
      itemCount = 5,
      showExpandedItems = 2,
      itemClassName = "",
      headerClassName = "",
      titleClassName = "",
      iconClassName = "",
      contentClassName = "",
      lineClassName = "",
    },
    ref,
  ) => {
    return (
      <div ref={ref} className={`w-full flex flex-col ${className}`}>
        {[...Array(itemCount)].map((_, index) => {
          const isExpanded = index < showExpandedItems;

          return (
            <div
              key={`accordion-shimmer-${index}`}
              className={`w-full ${itemClassName}`}
              data-shimmer-item
              data-expanded={isExpanded || undefined}
            >
              <div
                className={`w-full flex items-center justify-between ${headerClassName}`}
              >
                <div className={titleClassName} />
                <div className={iconClassName} />
              </div>

              {isExpanded && (
                <div className={contentClassName}>
                  <div className="space-y-2">
                    <div className={`w-full ${lineClassName}`} />
                    <div className={`w-4/5 ${lineClassName}`} />
                    <div className={`w-3/4 ${lineClassName}`} />
                  </div>
                  <div className="space-y-2">
                    <div className={`w-2/3 ${lineClassName}`} />
                    <div className={`w-1/2 ${lineClassName}`} />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  },
);

AccordionShimmer.displayName = "AccordionShimmer";

export default AccordionShimmer;
