import type { ComponentPropsWithoutRef, ReactNode } from "react";

export interface SliderMark {
  value: number;
  label?: ReactNode;
}

export interface SliderClasses {
  /** Root container */
  root?: string;
  /** Label above the slider */
  label?: string;
  /** Description below the label */
  description?: string;
  /** Horizontal/vertical wrapper around track + thumbs */
  wrapper?: string;
  /** Full-length track background */
  track?: string;
  /** Filled portion of the track */
  range?: string;
  /** Draggable thumb(s) */
  thumb?: string;
  /** Active/dragging thumb */
  thumbActive?: string;
  /** Disabled thumb */
  thumbDisabled?: string;
  /** Value tooltip above the thumb */
  tooltip?: string;
  /** Mark tick container */
  mark?: string;
  /** Mark tick dot */
  markDot?: string;
  /** Active mark tick dot (within range) */
  markDotActive?: string;
  /** Mark label text */
  markLabel?: string;
  /** Error message */
  error?: string;
  /** Success message */
  success?: string;
}

export type SliderValue = number | [number, number];

export interface SliderMarkRenderProps {
  value: number;
  label?: ReactNode;
  isActive: boolean;
  isDisabled: boolean;
  percent: number;
}

export interface SliderThumbRenderProps {
  value: number;
  index: number;
  isDragging: boolean;
  isDisabled: boolean;
}

/**
 * Props for the Slider component.
 *
 * @example Single value
 * ```tsx
 * <Slider value={50} onValueChange={setValue} />
 * ```
 *
 * @example Range
 * ```tsx
 * <Slider value={[20, 80]} onValueChange={setRange} />
 * ```
 */
export interface SliderProps
  extends Omit<
    ComponentPropsWithoutRef<"div">,
    "defaultValue" | "onChange" | "value"
  > {
  /** Current value (number for single, [min, max] tuple for range). For range mode, pass a tuple. There is no separate `range` prop. Not `currentValue`. */
  value?: SliderValue;
  /** Default uncontrolled value. */
  defaultValue?: SliderValue;
  /** Fires when the value changes. Not `onChange`. */
  onValueChange?: (value: SliderValue) => void;
  /** Fires when drag starts. */
  onValueCommit?: (value: SliderValue) => void;

  /** Minimum value. Default: 0 */
  min?: number;
  /** Maximum value. Default: 100 */
  max?: number;
  /** Step increment. Default: 1 */
  step?: number;

  /** Minimum distance between range thumbs. Default: 0 */
  minStepsBetweenThumbs?: number;

  /** Orientation. Default: "horizontal" */
  orientation?: "horizontal" | "vertical";
  /** Reverse the direction. Default: false */
  inverted?: boolean;

  /** Show value tooltip on hover/drag. Default: false */
  showTooltip?: boolean;
  /** Always show tooltip (not just on hover/drag). Default: false */
  tooltipAlways?: boolean;
  /** Format the tooltip display value. */
  formatTooltip?: (value: number) => string;

  /** Marks/ticks on the track. */
  marks?: SliderMark[];
  /** Show mark labels. Default: true when marks are provided */
  showMarkLabels?: boolean;

  /** Custom thumb content renderer. */
  renderThumb?: (props: SliderThumbRenderProps) => ReactNode;
  /** Custom mark dot renderer. Return null to hide the default dot. */
  renderMark?: (props: SliderMarkRenderProps) => ReactNode;
  /** Size of mark dots in pixels. Default: 6 */
  markDotSize?: number;

  // ─── Form ───────────────────────────────────────────────────────────
  id?: string;
  name?: string;
  label?: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
  required?: boolean;
  /** Error state flag. Pass message via `errorMessage`, not as a string here. */
  error?: boolean;
  errorMessage?: ReactNode;
  success?: boolean;
  successMessage?: ReactNode;
  loading?: boolean;

  // ─── Styling ────────────────────────────────────────────────────────
  classes?: SliderClasses;
  unstyled?: boolean;

  // ─── Accessibility ──────────────────────────────────────────────────
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-valuetext"?: string;
}
