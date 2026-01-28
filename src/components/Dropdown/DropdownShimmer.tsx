import { memo } from "react";

interface DropdownShimmerProps {
  count?: number;
  className?: string;
  itemClassName?: string;
}

const DropdownShimmer = memo(function DropdownShimmer({
  count = 5,
  className = "",
  itemClassName = "",
}: DropdownShimmerProps) {
  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={itemClassName}
          role="presentation"
          aria-hidden="true"
        >
          <div className="flex-1 h-4 bg-gray-200 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
});

export default DropdownShimmer;
