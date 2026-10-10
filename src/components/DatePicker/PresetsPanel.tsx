import { memo, useCallback } from "react";
import { isSameDay } from "date-fns";
import { cn } from "../../utils/scopedCn.js";
import { getDefaultPresets } from "./utils.js";
import type { DatePreset, DateRange } from "./utils/types.js";

/**
 * The preset column, in its own chunk.
 *
 * `showPresets` is off by default and the panel is a third of DatePicker's
 * optional weight once `getDefaultPresets` and the date-fns helpers it reaches
 * for come with it. Loaded through `useLazyComponent`, so it leaves the eager
 * closure `assert-bundle-size.mjs` measures — and the default presets are
 * computed HERE rather than in DatePicker, or the helper would stay behind in
 * the eager half on its own.
 */
export interface PresetsPanelProps {
  /** Omitted means the defaults for this mode, resolved in this chunk. */
  presets?: DatePreset[];
  selectionMode: "single" | "range" | "multiple";
  value?: Date | null;
  rangeValue?: DateRange | null;
  multipleValue?: Date[] | null;
  presetsClassName: string;
  presetButtonClassName: string;
  onPresetClick: (preset: DatePreset) => void;
}

export const PresetsPanel = memo(function PresetsPanel({
  presets: presetsProp,
  selectionMode,
  value,
  rangeValue,
  multipleValue,
  presetsClassName,
  presetButtonClassName,
  onPresetClick,
}: PresetsPanelProps) {
  const presets = presetsProp ?? getDefaultPresets(selectionMode);

  const isPresetActive = useCallback(
    (preset: DatePreset) => {
      const presetValue = preset.getValue();

      if (selectionMode === "single" && value) {
        return presetValue instanceof Date && isSameDay(presetValue, value);
      }

      if (selectionMode === "range" && rangeValue?.start && rangeValue?.end) {
        if (
          presetValue &&
          typeof presetValue === "object" &&
          "start" in presetValue
        ) {
          return (
            presetValue.start &&
            presetValue.end &&
            isSameDay(presetValue.start, rangeValue.start) &&
            isSameDay(presetValue.end, rangeValue.end)
          );
        }
      }

      if (selectionMode === "multiple" && multipleValue?.length) {
        if (Array.isArray(presetValue)) {
          if (presetValue.length !== multipleValue.length) return false;
          return presetValue.every((d) =>
            multipleValue.some((v) => isSameDay(d, v)),
          );
        }
      }

      return false;
    },
    [selectionMode, value, rangeValue, multipleValue],
  );

  return (
    <div className={presetsClassName} role="group" aria-label="Date presets" style={{ width: 0, minWidth: "100%" }}>
      {presets.map((preset) => {
        const isActive = isPresetActive(preset);
        return (
          <button
            key={preset.label}
            type="button"
            className={cn(
              presetButtonClassName,
            )}
            data-active={isActive || undefined}
            data-state={isActive ? "active" : undefined}
            onClick={() => onPresetClick(preset)}
          >
            {preset.label}
          </button>
        );
      })}
    </div>
  );
});

PresetsPanel.displayName = "PresetsPanel";
