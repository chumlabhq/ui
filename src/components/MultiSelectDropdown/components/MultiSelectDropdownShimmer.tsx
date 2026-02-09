import { memo } from "react";

interface MultiSelectDropdownShimmerProps {
  count?: number;
  className?: string;
  itemClassName?: string;
}

const MultiSelectDropdownShimmer = memo(function MultiSelectDropdownShimmer({
  count = 5,
  className = "",
  itemClassName = "",
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
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
            <div className="flex-1 h-4 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
});

export default MultiSelectDropdownShimmer;
