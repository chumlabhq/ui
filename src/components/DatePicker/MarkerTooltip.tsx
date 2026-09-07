import { LAYERS } from "../../utils/layers.js";
import type { DateMarker } from "./utils/types.js";

/**
 * The marker tooltip, in its own chunk.
 *
 * `markers` with `showMarkerTooltip` is off by default, and the tooltip is the
 * whole of it — sixty lines of positioned, inline-styled subtree that every
 * consumer of a plain calendar was paying for. Loaded through
 * `useLazyComponent`, so it leaves the eager closure the bundle gate measures.
 *
 * Only the SUBTREE moved. The state and the pointer handlers stay in
 * `useMarkerTooltip`: they are a few lines, they run on a real hover, and a
 * tooltip that had to wait for a chunk before it could decide where to sit
 * would be a worse trade than the bytes are worth.
 */
export interface MarkerTooltipProps {
  marker: DateMarker;
  tooltipId?: string;
  position: { top: number; left: number };
  placement: "top" | "bottom";
}

export function MarkerTooltip({ marker, tooltipId, position, placement }: MarkerTooltipProps) {
  return (
        <div
          role="tooltip"
          id={tooltipId}
          className="bg-cl-bg-elevated text-cl-text border border-cl-border"
          style={{
            position: "fixed",
            zIndex: LAYERS.tooltip,
            top: position.top,
            left: position.left,
            // When anchored to the cell's top edge (placement="top"),
            // pull the tooltip up by its full height so the gap is
            // exactly `gap` regardless of the tooltip's content height.
            // For bottom placement, the tooltip sits below — only X is
            // centered.
            transform:
              placement === "top"
                ? "translate(-50%, -100%)"
                : "translateX(-50%)",
            maxWidth: 240,
            padding: "8px 12px",
            borderRadius: 8,
            fontSize: 12,
            lineHeight: 1.5,
            // The shadow token, not a fixed black: `--cl-shadow-md` is
            // rgba(0,0,0,0.35) in dark and rgba(15,18,24,0.06) in light, and
            // this was the dark value painted in both.
            boxShadow: "var(--cl-shadow-md)",
            pointerEvents: "none",
          }}
        >
          <div className="flex items-center gap-1.5">
            {marker.color && (
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: marker.color }}
              />
            )}
            <span className="font-semibold">{marker.label}</span>
          </div>
          {marker.description && (
            <div className="text-cl-text-secondary mt-0.5">{marker.description}</div>
          )}
          {marker.type && (
            <div className="text-cl-text-tertiary mt-1 capitalize text-[11px]">{marker.type}</div>
          )}
        </div>
  );
}
