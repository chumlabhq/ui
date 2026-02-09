import { memo } from "react";

interface DropdownShimmerProps {
  count?: number;
  className?: string;
  itemClassName?: string;
}

const DropdownShimmer = memo(function DropdownShimmer({
  count = 5,
  className,
  itemClassName,
}: DropdownShimmerProps) {
  return (
    <div className={className || undefined}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={itemClassName || undefined}
          role="presentation"
          aria-hidden="true"
        />
      ))}
    </div>
  );
});

export default DropdownShimmer;
