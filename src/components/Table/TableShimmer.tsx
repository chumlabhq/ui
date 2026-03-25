import { memo } from "react";
import type { TableShimmerProps } from "./types";

const defaultContainerClass =
  "w-full border border-gray-200 rounded-lg overflow-hidden";
const defaultRowClass = "border-b border-gray-200";
const defaultCellClass = "px-3 py-2 h-[52px]";
const defaultShimmerClass =
  "h-full w-full bg-linear-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse";

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
