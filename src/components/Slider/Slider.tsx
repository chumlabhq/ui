import React, {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import type { CSSProperties, KeyboardEvent as ReactKeyboardEvent } from "react";
import type { SliderProps, SliderClasses, SliderValue } from "./utils/types";
import {
  DEFAULT_SLIDER_CLASSES,
  UNSTYLED_SLIDER_CLASSES,
} from "./utils/constants";
import { useControllableState } from "../../utils/useControllableState";
import { useIsomorphicLayoutEffect } from "../../utils/useIsomorphicLayoutEffect";
import { cn } from "../../utils/cn";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function clamp(val: number, min: number, max: number) {
  return Math.min(max, Math.max(min, val));
}

function snapToStep(val: number, min: number, step: number) {
  const steps = Math.round((val - min) / step);
  return clamp(
    min + steps * step,
    min,
    min + Math.ceil((1e12 - min) / step) * step,
  );
}

function valueToPercent(val: number, min: number, max: number) {
  return ((val - min) / (max - min)) * 100;
}

function percentToValue(pct: number, min: number, max: number, step: number) {
  const raw = min + (pct / 100) * (max - min);
  return snapToStep(raw, min, step);
}

function isRange(v: SliderValue): v is [number, number] {
  return Array.isArray(v);
}

// ─── Thumb ────────────────────────────────────────────────────────────────────

interface ThumbProps {
  value: number;
  index: number;
  min: number;
  max: number;
  step: number;
  disabled: boolean;
  orientation: "horizontal" | "vertical";
  inverted: boolean;
  isDragging: boolean;
  classes: Required<SliderClasses>;
  showTooltip: boolean;
  tooltipAlways: boolean;
  formatTooltip: (v: number) => string;
  renderThumb?: SliderProps["renderThumb"];
  sliderId: string;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  ariaValueText?: string;
  onPointerDown: (e: React.PointerEvent, index: number) => void;
  onKeyDown: (e: ReactKeyboardEvent, index: number) => void;
}

function Thumb({
  value,
  index,
  min,
  max,
  disabled,
  orientation,
  inverted,
  isDragging,
  classes,
  showTooltip,
  tooltipAlways,
  formatTooltip,
  renderThumb,
  sliderId,
  ariaLabel,
  ariaLabelledBy,
  ariaValueText,
  onPointerDown,
  onKeyDown,
}: ThumbProps) {
  const [hovered, setHovered] = useState(false);
  const pct = valueToPercent(value, min, max);
  const pos = inverted ? 100 - pct : pct;
  const isHorizontal = orientation === "horizontal";
  const thumbSize = 20;

  const positionTransition = isDragging
    ? "none"
    : "left 0.15s ease, bottom 0.15s ease";

  const thumbStyle: CSSProperties = isHorizontal
    ? {
        left: `${pos}%`,
        top: "50%",
        transform: "translate(-50%, -50%)",
        transition: positionTransition,
      }
    : {
        bottom: `${pos}%`,
        left: "50%",
        transform: "translate(-50%, 50%)",
        transition: positionTransition,
      };

  const tooltipVisible =
    showTooltip && (isDragging || hovered || tooltipAlways);

  const tooltipStyle: CSSProperties = isHorizontal
    ? {
        bottom: "100%",
        left: "50%",
        transform: "translateX(-50%)",
        marginBottom: "8px",
      }
    : {
        right: "100%",
        top: "50%",
        transform: "translateY(-50%)",
        marginRight: "8px",
      };

  const thumbClassName = cn(
    classes.thumb,
    isDragging && classes.thumbActive,
    disabled && classes.thumbDisabled,
  );

  return (
    <div
      role="slider"
      tabIndex={disabled ? -1 : 0}
      aria-valuenow={value}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuetext={ariaValueText ?? formatTooltip(value)}
      aria-orientation={orientation}
      aria-disabled={disabled || undefined}
      aria-label={ariaLabel ?? (index === 0 ? "Minimum" : "Maximum")}
      aria-labelledby={ariaLabelledBy}
      id={`${sliderId}-thumb-${index}`}
      className={thumbClassName || undefined}
      style={{
        position: "absolute",
        width: `${thumbSize}px`,
        height: `${thumbSize}px`,
        zIndex: isDragging ? 10 : 5,
        ...thumbStyle,
      }}
      data-index={index}
      data-dragging={isDragging || undefined}
      data-disabled={disabled || undefined}
      onPointerDown={(e) => onPointerDown(e, index)}
      onKeyDown={(e) => onKeyDown(e, index)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      {renderThumb
        ? renderThumb({ value, index, isDragging, isDisabled: disabled })
        : null}
      {tooltipVisible && (
        <div
          className={classes.tooltip || undefined}
          style={{ position: "absolute", ...tooltipStyle }}
          role="tooltip"
        >
          {formatTooltip(value)}
        </div>
      )}
    </div>
  );
}

// ─── Slider ───────────────────────────────────────────────────────────────────

/**
 * Component: Slider
 *
 * Purpose: Range slider with single/dual thumbs, marks, tooltips, vertical orientation.
 *
 * AI Usage Guidelines:
 * - Use `number` value for single, `[number, number]` for range
 * - Use `marks` for labeled positions on the track
 * - Use `showTooltip` to display value above thumb
 * - Use `orientation="vertical"` for vertical sliders
 *
 * Reference: SLIDER.ai.md (this directory), src/pages/demo/SliderDemo.tsx
 */
const Slider = forwardRef<HTMLDivElement, SliderProps>(
  (
    {
      value: valueProp,
      defaultValue,
      onValueChange,
      onValueCommit,
      min = 0,
      max = 100,
      step = 1,
      minStepsBetweenThumbs = 0,
      orientation = "horizontal",
      inverted = false,
      showTooltip = false,
      tooltipAlways = false,
      formatTooltip = String,
      marks,
      showMarkLabels = true,
      renderThumb,
      renderMark,
      markDotSize = 6,
      id,
      name,
      label,
      description,
      disabled = false,
      required = false,
      error = false,
      errorMessage,
      success,
      successMessage,
      loading,
      classes: classesProp,
      unstyled = false,
      className,
      style,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      "aria-valuetext": ariaValueText,
      ...rest
    },
    ref,
  ) => {
    // ─── IDs ────────────────────────────────────────────────────────────
    const generatedId = useId();
    const sliderId = id || generatedId;
    const labelId = `${sliderId}-label`;
    const descriptionId = `${sliderId}-description`;
    const errorId = `${sliderId}-error`;

    // ─── Controllable state ─────────────────────────────────────────────
    const [currentValue, setCurrentValue] = useControllableState<SliderValue>({
      value: valueProp,
      defaultValue: defaultValue ?? min,
      onChange: onValueChange,
    });

    const isRangeMode = isRange(currentValue);
    const values: [number, number] = isRangeMode
      ? currentValue
      : [currentValue as number, currentValue as number];

    // ─── Drag state ─────────────────────────────────────────────────────
    const [activeThumb, setActiveThumb] = useState<number | null>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const valuesRef = useRef(values);
    const commitRef = useRef(onValueCommit);

    useIsomorphicLayoutEffect(() => {
      valuesRef.current = values;
      commitRef.current = onValueCommit;
    });

    // ─── Classes ────────────────────────────────────────────────────────
    const baseClasses = unstyled
      ? UNSTYLED_SLIDER_CLASSES
      : DEFAULT_SLIDER_CLASSES;
    const mc: Required<SliderClasses> = useMemo(
      () => ({
        root: classesProp?.root ?? baseClasses.root,
        label: classesProp?.label ?? baseClasses.label,
        description: classesProp?.description ?? baseClasses.description,
        wrapper: classesProp?.wrapper ?? baseClasses.wrapper,
        track: classesProp?.track ?? baseClasses.track,
        range: classesProp?.range ?? baseClasses.range,
        thumb: classesProp?.thumb ?? baseClasses.thumb,
        thumbActive: classesProp?.thumbActive ?? baseClasses.thumbActive,
        thumbDisabled: classesProp?.thumbDisabled ?? baseClasses.thumbDisabled,
        tooltip: classesProp?.tooltip ?? baseClasses.tooltip,
        mark: classesProp?.mark ?? baseClasses.mark,
        markDot: classesProp?.markDot ?? baseClasses.markDot,
        markDotActive: classesProp?.markDotActive ?? baseClasses.markDotActive,
        markLabel: classesProp?.markLabel ?? baseClasses.markLabel,
        error: classesProp?.error ?? baseClasses.error,
        success: classesProp?.success ?? baseClasses.success,
      }),
      [classesProp, baseClasses],
    );

    // ─── Value update helpers ───────────────────────────────────────────
    const updateValue = useCallback(
      (thumbIndex: number, newVal: number) => {
        const clamped = clamp(snapToStep(newVal, min, step), min, max);
        if (isRangeMode) {
          const prev = valuesRef.current;
          const next: [number, number] = [...prev];
          next[thumbIndex] = clamped;

          // Enforce minimum distance
          const minDist = minStepsBetweenThumbs * step;
          if (thumbIndex === 0 && next[0] > next[1] - minDist) {
            next[0] = next[1] - minDist;
          } else if (thumbIndex === 1 && next[1] < next[0] + minDist) {
            next[1] = next[0] + minDist;
          }

          next[0] = clamp(next[0], min, max);
          next[1] = clamp(next[1], min, max);
          setCurrentValue(next);
        } else {
          setCurrentValue(clamped);
        }
      },
      [isRangeMode, min, max, step, minStepsBetweenThumbs, setCurrentValue],
    );

    // ─── Pointer → value conversion ─────────────────────────────────────
    const getValueFromPointer = useCallback(
      (clientX: number, clientY: number) => {
        const track = trackRef.current;
        if (!track) return min;
        const rect = track.getBoundingClientRect();
        let pct: number;
        if (orientation === "horizontal") {
          pct = ((clientX - rect.left) / rect.width) * 100;
        } else {
          pct = ((rect.bottom - clientY) / rect.height) * 100;
        }
        if (inverted) pct = 100 - pct;
        pct = clamp(pct, 0, 100);
        return percentToValue(pct, min, max, step);
      },
      [min, max, step, orientation, inverted],
    );

    // ─── Find closest thumb ─────────────────────────────────────────────
    const getClosestThumb = useCallback(
      (val: number) => {
        if (!isRangeMode) return 0;
        const [lo, hi] = valuesRef.current;
        const distLo = Math.abs(val - lo);
        const distHi = Math.abs(val - hi);
        if (distLo < distHi) return 0;
        if (distHi < distLo) return 1;
        return val <= lo ? 0 : 1;
      },
      [isRangeMode],
    );

    // ─── Pointer handlers ───────────────────────────────────────────────
    const handleTrackPointerDown = useCallback(
      (e: React.PointerEvent) => {
        if (disabled || e.button !== 0) return;
        e.preventDefault();
        const val = getValueFromPointer(e.clientX, e.clientY);
        const idx = getClosestThumb(val);
        setActiveThumb(idx);
        updateValue(idx, val);
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
      },
      [disabled, getValueFromPointer, getClosestThumb, updateValue],
    );

    const handleThumbPointerDown = useCallback(
      (e: React.PointerEvent, index: number) => {
        if (disabled || e.button !== 0) return;
        e.preventDefault();
        e.stopPropagation();
        setActiveThumb(index);
        document.body.style.cursor = "grabbing";
        document.body.style.userSelect = "none";
      },
      [disabled],
    );

    useEffect(() => {
      if (activeThumb === null) return;

      const handleMove = (e: PointerEvent) => {
        const val = getValueFromPointer(e.clientX, e.clientY);
        updateValue(activeThumb, val);
      };

      const handleUp = () => {
        setActiveThumb(null);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
        commitRef.current?.(
          valuesRef.current.length === 2 && isRangeMode
            ? valuesRef.current
            : valuesRef.current[0],
        );
      };

      document.addEventListener("pointermove", handleMove);
      document.addEventListener("pointerup", handleUp);
      return () => {
        document.removeEventListener("pointermove", handleMove);
        document.removeEventListener("pointerup", handleUp);
      };
    }, [activeThumb, getValueFromPointer, updateValue, isRangeMode]);

    // ─── Keyboard handler ───────────────────────────────────────────────
    const handleKeyDown = useCallback(
      (e: ReactKeyboardEvent, index: number) => {
        if (disabled) return;
        const largeStep = step * 10;
        let newVal: number | undefined;
        const current = valuesRef.current[index];

        switch (e.key) {
          case "ArrowRight":
          case "ArrowUp":
            e.preventDefault();
            newVal = current + (e.shiftKey ? largeStep : step);
            break;
          case "ArrowLeft":
          case "ArrowDown":
            e.preventDefault();
            newVal = current - (e.shiftKey ? largeStep : step);
            break;
          case "Home":
            e.preventDefault();
            newVal = min;
            break;
          case "End":
            e.preventDefault();
            newVal = max;
            break;
          case "PageUp":
            e.preventDefault();
            newVal = current + largeStep;
            break;
          case "PageDown":
            e.preventDefault();
            newVal = current - largeStep;
            break;
        }

        if (newVal !== undefined) {
          updateValue(index, newVal);
          commitRef.current?.(
            isRangeMode ? valuesRef.current : valuesRef.current[0],
          );
        }
      },
      [disabled, step, min, max, updateValue, isRangeMode],
    );

    // ─── Layout calculations ────────────────────────────────────────────
    const isHorizontal = orientation === "horizontal";
    const TRACK_SIZE = 6; // px — thickness of the track bar
    const THUMB_SIZE = 20; // px — diameter of the thumb

    const pct0 = valueToPercent(values[0], min, max);
    const pct1 = valueToPercent(values[1], min, max);

    const rangeStart = isRangeMode ? Math.min(pct0, pct1) : 0;
    const rangeEnd = isRangeMode ? Math.max(pct0, pct1) : pct0;

    // Range needs explicit top/bottom (horizontal) or left/right (vertical)
    const rangeStyle: CSSProperties = isHorizontal
      ? {
          position: "absolute",
          top: 0,
          bottom: 0,
          ...(inverted
            ? { right: `${rangeStart}%`, left: `${100 - rangeEnd}%` }
            : { left: `${rangeStart}%`, right: `${100 - rangeEnd}%` }),
          transition:
            activeThumb !== null ? "none" : "left 0.15s ease, right 0.15s ease",
        }
      : {
          position: "absolute",
          left: 0,
          right: 0,
          ...(inverted
            ? { top: `${rangeStart}%`, bottom: `${100 - rangeEnd}%` }
            : { bottom: `${rangeStart}%`, top: `${100 - rangeEnd}%` }),
          transition:
            activeThumb !== null ? "none" : "top 0.15s ease, bottom 0.15s ease",
        };

    // Reserve space: thumb overhang, mark labels below, always-visible tooltips above
    const hasMarkLabels = marks?.some((m) => m.label) && showMarkLabels;
    const thumbPad = (THUMB_SIZE - TRACK_SIZE) / 2;
    const markLabelSpace = hasMarkLabels ? 24 : 0;
    const tooltipSpace = showTooltip && tooltipAlways ? 32 : 0;

    // Wrapper is exactly TRACK_SIZE; margin reserves room for thumb/marks/tooltips
    const wrapperStyle: CSSProperties = isHorizontal
      ? {
          height: `${TRACK_SIZE}px`,
          width: "100%",
          marginTop: `${Math.max(thumbPad, tooltipSpace)}px`,
          marginBottom: `${Math.max(thumbPad, markLabelSpace)}px`,
        }
      : {
          width: `${TRACK_SIZE}px`,
          height: "100%",
          flex: "1 1 0%",
          marginLeft: `${Math.max(thumbPad, tooltipSpace)}px`,
          marginRight: `${Math.max(thumbPad, markLabelSpace)}px`,
        };

    // ─── aria-describedby ───────────────────────────────────────────────
    const ariaDescribedBy =
      [
        description ? descriptionId : null,
        error && errorMessage ? errorId : null,
      ]
        .filter(Boolean)
        .join(" ") || undefined;

    // ─── Render ─────────────────────────────────────────────────────────
    return (
      <div
        ref={ref}
        className={cn(mc.root, className) || undefined}
        style={style}
        data-disabled={disabled || undefined}
        data-error={error || undefined}
        data-loading={loading || undefined}
        data-success={success || undefined}
        data-orientation={orientation}
        {...rest}
      >
        {/* Label */}
        {label && (
          <label
            id={labelId}
            htmlFor={`${sliderId}-thumb-0`}
            className={mc.label || undefined}
          >
            {label}
            {required && <span aria-hidden="true"> *</span>}
          </label>
        )}

        {/* Description */}
        {description && (
          <p id={descriptionId} className={mc.description || undefined}>
            {description}
          </p>
        )}

        {/* Track wrapper — box-content so padding doesn't shrink track */}
        <div
          ref={trackRef}
          className={cn(mc.wrapper) || undefined}
          style={{ position: "relative", overflow: "visible", ...wrapperStyle, ...(loading ? { opacity: 0.5, pointerEvents: "none" } : {}) }}
          onPointerDown={handleTrackPointerDown}
          aria-describedby={ariaDescribedBy}
          data-orientation={orientation}
        >
          {/* Track background */}
          <div
            className={mc.track || undefined}
            style={{ position: "absolute", inset: 0 }}
            data-disabled={disabled || undefined}
          />

          {/* Filled range */}
          <div
            className={mc.range || undefined}
            style={rangeStyle}
            data-disabled={disabled || undefined}
          />

          {/* Marks — dots and labels positioned directly in the wrapper */}
          {marks?.map((mark) => {
            const markPct = valueToPercent(mark.value, min, max);
            const markPos = inverted ? 100 - markPct : markPct;
            const inRange = isRangeMode
              ? mark.value >= Math.min(values[0], values[1]) &&
                mark.value <= Math.max(values[0], values[1])
              : mark.value <= values[0];

            const dotPositionStyle: CSSProperties = isHorizontal
              ? { left: `${markPos}%`, top: "50%", transform: "translate(-50%, -50%)" }
              : { bottom: `${markPos}%`, left: "50%", transform: "translate(-50%, 50%)" };

            const customMark = renderMark?.({
              value: mark.value,
              label: mark.label,
              isActive: inRange,
              isDisabled: disabled,
              percent: markPct,
            });

            return (
              <React.Fragment key={mark.value}>
                {/* Dot */}
                {renderMark ? (
                  <div
                    style={{ position: "absolute", zIndex: 1, ...dotPositionStyle }}
                  >
                    {customMark}
                  </div>
                ) : (
                  <div
                    className={cn(mc.markDot, inRange && mc.markDotActive) || undefined}
                    style={{
                      position: "absolute",
                      width: `${markDotSize}px`,
                      height: `${markDotSize}px`,
                      borderRadius: "50%",
                      zIndex: 1,
                      ...dotPositionStyle,
                    }}
                  />
                )}
                {/* Label */}
                {showMarkLabels && mark.label && (
                  <span
                    className={mc.markLabel || undefined}
                    style={{
                      position: "absolute",
                      whiteSpace: "nowrap",
                      ...(isHorizontal
                        ? { left: `${markPos}%`, top: "100%", transform: "translateX(-50%)", marginTop: "8px" }
                        : { bottom: `${markPos}%`, left: "100%", transform: "translateY(50%)", marginLeft: "8px" }),
                    }}
                  >
                    {mark.label}
                  </span>
                )}
              </React.Fragment>
            );
          })}

          {/* Thumb(s) */}
          {isRangeMode ? (
            <>
              <Thumb
                value={values[0]}
                index={0}
                min={min}
                max={max}
                step={step}
                disabled={disabled}
                orientation={orientation}
                inverted={inverted}
                isDragging={activeThumb === 0}
                classes={mc}
                showTooltip={showTooltip}
                tooltipAlways={tooltipAlways}
                formatTooltip={formatTooltip}
                renderThumb={renderThumb}
                sliderId={sliderId}
                ariaLabel={ariaLabel}
                ariaLabelledBy={label ? labelId : ariaLabelledBy}
                ariaValueText={ariaValueText}
                onPointerDown={handleThumbPointerDown}
                onKeyDown={handleKeyDown}
              />
              <Thumb
                value={values[1]}
                index={1}
                min={min}
                max={max}
                step={step}
                disabled={disabled}
                orientation={orientation}
                inverted={inverted}
                isDragging={activeThumb === 1}
                classes={mc}
                showTooltip={showTooltip}
                tooltipAlways={tooltipAlways}
                formatTooltip={formatTooltip}
                renderThumb={renderThumb}
                sliderId={sliderId}
                ariaLabelledBy={label ? labelId : ariaLabelledBy}
                ariaValueText={ariaValueText}
                onPointerDown={handleThumbPointerDown}
                onKeyDown={handleKeyDown}
              />
            </>
          ) : (
            <Thumb
              value={values[0]}
              index={0}
              min={min}
              max={max}
              step={step}
              disabled={disabled}
              orientation={orientation}
              inverted={inverted}
              isDragging={activeThumb === 0}
              classes={mc}
              showTooltip={showTooltip}
              tooltipAlways={tooltipAlways}
              formatTooltip={formatTooltip}
              renderThumb={renderThumb}
              sliderId={sliderId}
              ariaLabel={ariaLabel}
              ariaLabelledBy={label ? labelId : ariaLabelledBy}
              ariaValueText={ariaValueText}
              onPointerDown={handleThumbPointerDown}
              onKeyDown={handleKeyDown}
            />
          )}
        </div>

        {/* Hidden inputs for form submission */}
        {name &&
          (isRangeMode ? (
            <>
              <input type="hidden" name={`${name}[0]`} value={values[0]} />
              <input type="hidden" name={`${name}[1]`} value={values[1]} />
            </>
          ) : (
            <input type="hidden" name={name} value={values[0]} />
          ))}

        {/* Error */}
        {error && errorMessage && (
          <div id={errorId} role="alert" className={mc.error || undefined}>
            {errorMessage}
          </div>
        )}

        {/* Success */}
        {success && successMessage && !error && (
          <div id={`${sliderId}-success`} className={mc.success || undefined}>
            {successMessage}
          </div>
        )}
      </div>
    );
  },
);

Slider.displayName = "Slider";

export default Slider;
