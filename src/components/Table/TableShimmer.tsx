import { memo } from "react";
import type { TableShimmerProps } from "./utils/types.js";

const defaultContainerClass =
  "w-full border border-cl-border rounded-cl-md overflow-hidden";
const defaultRowClass = "border-b border-cl-border";
const defaultCellClass = "px-3 py-2 h-[52px]";
// The same flat pulse every other skeleton uses. This was a left-to-right
// gradient sweep, which was both the library's only sweeping shimmer and
// unreachable: `Table` always passes `shimmerClassName` from its own `classes`
// bag, and `TableShimmer` is not exported, so nothing could ever render it.
const defaultShimmerClass =
  "h-full w-full rounded animate-pulse bg-cl-bg-skeleton";

const TableShimmer = memo(function TableShimmer({
  rowCount = 10,
  className,
  rowClassName,
  cellClassName,
  shimmerClassName,
}: TableShimmerProps) {
  const containerStyle = className ?? defaultContainerClass;
  const rowStyle = rowClassName ?? defaultRowClass;
  const cellStyle = cellClassName ?? defaultCellClass;
  const shimmerStyle = shimmerClassName ?? defaultShimmerClass;

  return (
    <div
      className={containerStyle}
      role="status"
      aria-label="Loading table data"
    >
      <div className={rowStyle}>
        <div className={cellStyle}>
          <div className={shimmerStyle} />
        </div>
      </div>

      {Array.from({ length: rowCount }).map((_, index) => (
        <div key={`shimmer-row-${index}`} className={rowStyle}>
          <div className={cellStyle}>
            <div className={shimmerStyle} />
          </div>
        </div>
      ))}
    </div>
  );
});

export default TableShimmer;
