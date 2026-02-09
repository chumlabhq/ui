import { memo } from "react";

interface SearchableDropdownShimmerProps {
  count?: number;
  className?: string;
  itemClassName?: string;
}

const SearchableDropdownShimmer = memo(function SearchableDropdownShimmer({
  count = 5,
  className,
  itemClassName,
}: SearchableDropdownShimmerProps) {
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

export default SearchableDropdownShimmer;
