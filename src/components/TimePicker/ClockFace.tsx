import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { isBrowser } from "../../utils/isBrowser";
import type { TimeValue, ClockSelectionMode, ClockFaceProps } from "./utils/types";
import { clampMinuteStep, getDefaultTimeValue, pad, timeValueToMinutes, isMinutesInRange } from "./utils";

/**
 * Radius of the outer number ring, expressed as a percentage offset
 * from the center of a 100x100 coordinate system (used for both SVG
 * and CSS `calc(50% + N%)`).
 */
const OUTER_RADIUS = 40;

/**
 * Radius of the inner number ring (24h hours 12-23). Smaller than
 * OUTER_RADIUS to create a visually distinct second ring.
 */
const INNER_RADIUS = 26;

/**
 * Normalised distance threshold (0-1, where 1 = edge of clock face)
 * below which pointer interactions select from the inner ring rather
 * than the outer ring in 24h mode.
 */
const INNER_RING_NORMALIZED_THRESHOLD = 0.65;

function getPosition(
  value: number,
  total: number,
  radius: number,
): { x: number; y: number } {
  const angle = ((value / total) * 360 - 90) * (Math.PI / 180);
  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
  };
}

function getAngleFromCenter(
  centerX: number,
  centerY: number,
  x: number,
  y: number,
): number {
  const dx = x - centerX;
  const dy = y - centerY;
  let angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
  if (angle < 0) angle += 360;
  return angle;
}

function getDistanceFromCenter(
  centerX: number,
  centerY: number,
  x: number,
  y: number,
): number {
  const dx = x - centerX;
  const dy = y - centerY;
  return Math.sqrt(dx * dx + dy * dy);
}

export function ClockFace({
  value,
  format,
  minuteStep,
  onValueChange,
  onConfirm,
  onCancel,
  disabled = false,
  classes: cls,
  style,
  reduceMotion = false,
  minTime,
  maxTime,
  cancelText = "Cancel",
  okText = "OK",
}: ClockFaceProps) {
  const safeStep = clampMinuteStep(minuteStep);
  const [selectionMode, setSelectionMode] =
    useState<ClockSelectionMode>("hours");
  const [isDragging, setIsDragging] = useState(false);
  const clockRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const activePointerId = useRef<number | null>(null);

  const displayValue = useMemo(
    (): TimeValue => value ?? getDefaultTimeValue(format),
    [value, format],
  );

  // ── Min/max helpers ──────────────────────────────────────────────────
  const isHourDisabled = useCallback(
    (hour: number): boolean => {
      if (!minTime && !maxTime) return false;
      // An hour is disabled if NO minute within it is in range
      for (let m = 0; m < 60; m += safeStep) {
        if (isMinutesInRange(hour * 60 + m, format, minTime, maxTime)) {
          return false;
        }
      }
      return true;
    },
    [minTime, maxTime, format, safeStep],
  );

  const isMinuteDisabled = useCallback(
    (minute: number): boolean => {
      if (!minTime && !maxTime) return false;
      let hours24 = displayValue.hours;
      if (format === "12h" && displayValue.period) {
        if (displayValue.period === "PM" && displayValue.hours !== 12) hours24 = displayValue.hours + 12;
        else if (displayValue.period === "AM" && displayValue.hours === 12) hours24 = 0;
      }
      return !isMinutesInRange(hours24 * 60 + minute, format, minTime, maxTime);
    },
    [minTime, maxTime, format, displayValue],
  );

  const isCurrentTimeInRange = useMemo(() => {
    return isMinutesInRange(
      timeValueToMinutes(displayValue, format),
      format,
      minTime,
      maxTime,
    );
  }, [displayValue, format, minTime, maxTime]);

  // ── Numbers to render ────────────────────────────────────────────────
  const outerNumbers = useMemo(() => {
    if (selectionMode === "minutes") {
      const nums: number[] = [];
      for (let i = 0; i < 60; i += safeStep) {
        nums.push(i);
      }
      return nums;
    }

    if (format === "24h") {
      return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    }

    return [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  }, [selectionMode, format, safeStep]);

  const innerNumbers = useMemo(() => {
    if (selectionMode === "minutes" || format === "12h") {
      return [];
    }
    return [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
  }, [selectionMode, format]);

  const { handAngle, isInnerRing } = useMemo(() => {
    if (selectionMode === "minutes") {
      const angle = (displayValue.minutes / 60) * 360;
      return { handAngle: angle, isInnerRing: false };
    }

    if (format === "24h") {
      const hour = displayValue.hours;
      if (hour >= 12) {
        const angle = ((hour - 12) / 12) * 360;
        return { handAngle: angle, isInnerRing: true };
      }
      const angle = (hour / 12) * 360;
      return { handAngle: angle, isInnerRing: false };
    }

    const hour = displayValue.hours === 12 ? 0 : displayValue.hours;
    const angle = (hour / 12) * 360;
    return { handAngle: angle, isInnerRing: false };
  }, [selectionMode, displayValue, format]);

  // ── Pointer interaction ──────────────────────────────────────────────
  const handleClockInteraction = useCallback(
    (clientX: number, clientY: number) => {
      if (disabled || !clockRef.current) return;

      const rect = clockRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const radius = rect.width / 2;

      const angle = getAngleFromCenter(centerX, centerY, clientX, clientY);
      const distance = getDistanceFromCenter(
        centerX,
        centerY,
        clientX,
        clientY,
      );
      const normalizedDistance = distance / radius;

      if (selectionMode === "minutes") {
        let minute = Math.round((angle / 360) * 60);
        if (minute === 60) minute = 0;

        minute = Math.round(minute / safeStep) * safeStep;
        if (minute >= 60) minute = 0;

        if (!isMinuteDisabled(minute)) {
          onValueChange({ ...displayValue, minutes: minute });
        }
      } else {
        let hour = Math.round((angle / 360) * 12);
        if (hour === 12) hour = 0;

        if (format === "24h") {
          const isInner = normalizedDistance < INNER_RING_NORMALIZED_THRESHOLD;
          if (isInner) {
            hour = hour + 12;
            if (hour === 24) hour = 12;
          }
        } else {
          if (hour === 0) hour = 12;
        }

        if (!isHourDisabled(hour)) {
          onValueChange({ ...displayValue, hours: hour });
        }
      }
    },
    [disabled, selectionMode, safeStep, displayValue, format, onValueChange, isHourDisabled, isMinuteDisabled],
  );

  const endDrag = useCallback(() => {
    setIsDragging(false);
    activePointerId.current = null;
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (disabled || e.button !== 0) return;
      e.preventDefault();
      const el = e.currentTarget;
      el.setPointerCapture(e.pointerId);
      activePointerId.current = e.pointerId;
      setIsDragging(true);
      handleClockInteraction(e.clientX, e.clientY);
    },
    [disabled, handleClockInteraction],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging || e.pointerId !== activePointerId.current) return;
      handleClockInteraction(e.clientX, e.clientY);
    },
    [isDragging, handleClockInteraction],
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.pointerId !== activePointerId.current) return;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        /* already released */
      }
      endDrag();
    },
    [endDrag],
  );

  const handlePointerCancel = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.pointerId !== activePointerId.current) return;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        /* already released */
      }
      endDrag();
    },
    [endDrag],
  );

  useEffect(() => {
    const onWindowPointerUp = () => {
      if (isDragging) endDrag();
    };
    if (isDragging) {
      window.addEventListener("pointerup", onWindowPointerUp);
      window.addEventListener("pointercancel", onWindowPointerUp);
    }
    return () => {
      window.removeEventListener("pointerup", onWindowPointerUp);
      window.removeEventListener("pointercancel", onWindowPointerUp);
    };
  }, [isDragging, endDrag]);

  // ── Period toggle ────────────────────────────────────────────────────
  const togglePeriod = useCallback(
    (period: "AM" | "PM") => {
      if (disabled) return;
      onValueChange({ ...displayValue, period });
    },
    [disabled, displayValue, onValueChange],
  );

  // ── Keyboard navigation ──────────────────────────────────────────────
  const adjustFromKeyboard = useCallback(
    (delta: number) => {
      if (disabled) return;
      if (selectionMode === "minutes") {
        let m = displayValue.minutes + delta * safeStep;
        m = Math.round(m / safeStep) * safeStep;
        while (m < 0) m += 60;
        while (m >= 60) m -= 60;
        onValueChange({ ...displayValue, minutes: m });
        return;
      }
      if (format === "12h") {
        let h = displayValue.hours + delta;
        if (h < 1) h = 12;
        if (h > 12) h = 1;
        onValueChange({ ...displayValue, hours: h });
        return;
      }
      let h24 = displayValue.hours + delta;
      if (h24 < 0) h24 = 23;
      if (h24 > 23) h24 = 0;
      onValueChange({ ...displayValue, hours: h24 });
    },
    [disabled, selectionMode, format, displayValue, onValueChange, safeStep],
  );

  const handleClockKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;
      switch (e.key) {
        case "ArrowRight":
        case "ArrowUp":
          e.preventDefault();
          adjustFromKeyboard(1);
          break;
        case "ArrowLeft":
        case "ArrowDown":
          e.preventDefault();
          adjustFromKeyboard(-1);
          break;
        case "PageUp":
          e.preventDefault();
          adjustFromKeyboard(selectionMode === "minutes" ? 3 : 2);
          break;
        case "PageDown":
          e.preventDefault();
          adjustFromKeyboard(selectionMode === "minutes" ? -3 : -2);
          break;
        case "Home":
          e.preventDefault();
          if (selectionMode === "minutes") {
            onValueChange({ ...displayValue, minutes: 0 });
          } else if (format === "12h") {
            onValueChange({ ...displayValue, hours: 12 });
          } else {
            onValueChange({ ...displayValue, hours: 0 });
          }
          break;
        case "End":
          e.preventDefault();
          if (selectionMode === "minutes") {
            const last = 60 - safeStep;
            onValueChange({ ...displayValue, minutes: last });
          } else if (format === "12h") {
            onValueChange({ ...displayValue, hours: 11 });
          } else {
            onValueChange({ ...displayValue, hours: 23 });
          }
          break;
        default:
          break;
      }
    },
    [disabled, adjustFromKeyboard, selectionMode, format, displayValue, onValueChange, safeStep],
  );

  // ── Focus trap ───────────────────────────────────────────────────────
  const handleContainerKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key !== "Tab" || !containerRef.current) return;

      const focusable = containerRef.current.querySelectorAll<HTMLElement>(
        'button:not(:disabled), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (isBrowser) {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [],
  );

  // ── Number rendering ─────────────────────────────────────────────────
  const renderNumber = useCallback(
    (num: number, index: number, isInner: boolean) => {
      const total = 12;
      const radius = isInner ? INNER_RADIUS : OUTER_RADIUS;
      const position =
        selectionMode === "minutes"
          ? getPosition(num, 60, radius)
          : getPosition(index, total, radius);

      let isSelected = false;
      if (selectionMode === "minutes") {
        isSelected = displayValue.minutes === num;
      } else {
        isSelected = displayValue.hours === num;
      }

      const isDisabled = selectionMode === "minutes"
        ? isMinuteDisabled(num)
        : isHourDisabled(num);

      const displayNum =
        selectionMode === "minutes" && num === 0 ? "00" : num.toString();

      return (
        <div
          key={`${isInner ? "inner" : "outer"}-${num}`}
          className={[
            cls.clockNumber,
            isSelected && cls.clockNumberSelected,
            isInner && cls.clockNumberInner,
            isDisabled && cls.clockNumberDisabled,
          ]
            .filter(Boolean)
            .join(" ")}
          style={{
            position: "absolute",
            left: `calc(50% + ${position.x}%)`,
            top: `calc(50% + ${position.y}%)`,
            transform: "translate(-50%, -50%)",
            ...(reduceMotion ? { transition: "none", animation: "none" } : {}),
          }}
          data-selected={isSelected || undefined}
          data-inner={isInner || undefined}
          data-disabled={isDisabled || undefined}
        >
          {displayNum}
        </div>
      );
    },
    [
      selectionMode,
      displayValue,
      cls.clockNumber,
      cls.clockNumberSelected,
      cls.clockNumberInner,
      cls.clockNumberDisabled,
      reduceMotion,
      isHourDisabled,
      isMinuteDisabled,
    ],
  );

  const handEndPosition = useMemo(() => {
    const radius = isInnerRing ? INNER_RADIUS : OUTER_RADIUS;
    const angleRad = (handAngle - 90) * (Math.PI / 180);
    return {
      x: Math.cos(angleRad) * radius,
      y: Math.sin(angleRad) * radius,
    };
  }, [handAngle, isInnerRing]);

  const sliderMax =
    selectionMode === "hours" ? (format === "24h" ? 23 : 12) : 59;
  const sliderNow =
    selectionMode === "hours" ? displayValue.hours : displayValue.minutes;

  return (
    <div
      ref={containerRef}
      className={cls.clockContainer}
      style={{
        ...style,
        ...(reduceMotion ? { transition: "none", animation: "none" } : {}),
      }}
      data-disabled={disabled || undefined}
      onMouseDown={(e) => e.preventDefault()}
      onKeyDown={handleContainerKeyDown}
    >
      <div className={cls.clockDisplay}>
        <button
          type="button"
          className={[
            cls.clockDisplayHours,
            selectionMode === "hours" && cls.clockDisplayActive,
          ]
            .filter(Boolean)
            .join(" ")}
          onClick={() => setSelectionMode("hours")}
          aria-pressed={selectionMode === "hours"}
          data-active={selectionMode === "hours" || undefined}
          disabled={disabled}
        >
          {pad(displayValue.hours)}
        </button>
        <span className={cls.clockDisplaySeparator}>:</span>
        <button
          type="button"
          className={[
            cls.clockDisplayMinutes,
            selectionMode === "minutes" && cls.clockDisplayActive,
          ]
            .filter(Boolean)
            .join(" ")}
          onClick={() => setSelectionMode("minutes")}
          aria-pressed={selectionMode === "minutes"}
          data-active={selectionMode === "minutes" || undefined}
          disabled={disabled}
        >
          {pad(displayValue.minutes)}
        </button>

        {format === "12h" && (
          <div className={cls.clockPeriodToggle}>
            <button
              type="button"
              className={[
                cls.clockPeriodButton,
                displayValue.period === "AM" && cls.clockPeriodActive,
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => togglePeriod("AM")}
              aria-pressed={displayValue.period === "AM"}
              data-active={displayValue.period === "AM" || undefined}
              disabled={disabled}
            >
              AM
            </button>
            <button
              type="button"
              className={[
                cls.clockPeriodButton,
                displayValue.period === "PM" && cls.clockPeriodActive,
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => togglePeriod("PM")}
              aria-pressed={displayValue.period === "PM"}
              data-active={displayValue.period === "PM" || undefined}
              disabled={disabled}
            >
              PM
            </button>
          </div>
        )}
      </div>

      <div
        ref={clockRef}
        className={cls.clockFace}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onKeyDown={handleClockKeyDown}
        role="slider"
        aria-label={
          selectionMode === "hours" ? "Select hours" : "Select minutes"
        }
        aria-valuemin={0}
        aria-valuemax={sliderMax}
        aria-valuenow={sliderNow}
        tabIndex={disabled ? -1 : 0}
      >
        <svg
          className={cls.clockHand}
          viewBox="0 0 100 100"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
        >
          <line
            x1="50"
            y1="50"
            x2={50 + handEndPosition.x}
            y2={50 + handEndPosition.y}
            className={cls.clockHandLine}
            strokeWidth="0.8"
          />
          <circle cx="50" cy="50" r="1.5" className={cls.clockCenter} />
        </svg>

        <div
          className={cls.clockHandDot}
          style={{
            position: "absolute",
            left: `calc(50% + ${handEndPosition.x}%)`,
            top: `calc(50% + ${handEndPosition.y}%)`,
            transform: "translate(-50%, -50%)",
          }}
        />

        {outerNumbers.map((num, index) => renderNumber(num, index, false))}

        {innerNumbers.map((num, index) => renderNumber(num, index, true))}
      </div>

      <div className={cls.clockActions}>
        <button
          type="button"
          className={cls.clockCancelButton}
          onClick={onCancel}
          disabled={disabled}
        >
          {cancelText}
        </button>
        <button
          type="button"
          className={cls.clockOkButton}
          onClick={onConfirm}
          disabled={disabled || !isCurrentTimeInRange}
        >
          {okText}
        </button>
      </div>
    </div>
  );
}

export default ClockFace;
