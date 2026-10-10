import { memo } from "react";

interface MultiSelectDropdownShimmerProps {
  count?: number;
  className?: string;
  itemClassName?: string;
  /**
   * Fed from MultiSelectDropdown's `loadingItemControl` / `loadingBar`. The shimmer
   * takes className props rather than a `classes` bag of its own: it is a
   * sub-component, and two routes to style one component's output would
   * diverge.
   */
  itemControlClassName?: string;
  barClassName?: string;
}

const MultiSelectDropdownShimmer = memo(function MultiSelectDropdownShimmer({
  count = 5,
  className = "",
  itemClassName = "",
  itemControlClassName = "",
  barClassName = "",
}: MultiSelectDropdownShimmerProps) {
  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={itemClassName}
          role="presentation"
          aria-hidden="true"
        >
          <div className={itemControlClassName} />
          <div className={barClassName} />
        </div>
      ))}
    </div>
  );
});

export default MultiSelectDropdownShimmer;
