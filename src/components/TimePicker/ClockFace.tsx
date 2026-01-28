import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import type { TimeFormat, TimeValue, ClockSelectionMode } from "./types";

interface ClockFaceProps {
  value: TimeValue | null;
  format: TimeFormat;
  minuteStep: number;
  onChange: (timeValue: TimeValue) => void;
  onConfirm: () => void;
  onCancel: () => void;
  disabled?: boolean;
  clockContainerClassName?: string;
  clockDisplayClassName?: string;
  clockDisplayHoursClassName?: string;
  clockDisplayMinutesClassName?: string;
  clockDisplayActiveClassName?: string;
  clockDisplaySeparatorClassName?: string;
  clockFaceClassName?: string;
  clockHandClassName?: string;
  clockHandLineClassName?: string;
  clockHandDotClassName?: string;
  clockNumberClassName?: string;
  clockNumberSelectedClassName?: string;
  clockNumberInnerClassName?: string;
  clockCenterClassName?: string;
  clockActionsClassName?: string;
  clockCancelButtonClassName?: string;
  clockOkButtonClassName?: string;
  clockPeriodToggleClassName?: string;
  clockPeriodButtonClassName?: string;
  clockPeriodActiveClassName?: string;
}

const pad = (n: number): string => n.toString().padStart(2, "0");

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
  onChange,
  onConfirm,
  onCancel,
  disabled = false,
  clockContainerClassName = "",
  clockDisplayClassName = "",
  clockDisplayHoursClassName = "",
  clockDisplayMinutesClassName = "",
  clockDisplayActiveClassName = "",
  clockDisplaySeparatorClassName = "",
  clockFaceClassName = "",
  clockHandClassName = "",
  clockHandLineClassName = "",
  clockHandDotClassName = "",
  clockNumberClassName = "",
  clockNumberSelectedClassName = "",
  clockNumberInnerClassName = "",
  clockCenterClassName = "",
  clockActionsClassName = "",
  clockCancelButtonClassName = "",
  clockOkButtonClassName = "",
  clockPeriodToggleClassName = "",
  clockPeriodButtonClassName = "",
  clockPeriodActiveClassName = "",
}: ClockFaceProps) {
  const [selectionMode, setSelectionMode] =
    useState<ClockSelectionMode>("hours");
  const [isDragging, setIsDragging] = useState(false);
  const clockRef = useRef<HTMLDivElement>(null);

  const [localValue, setLocalValue] = useState<TimeValue | null>(null);

  const internalValue = useMemo((): TimeValue => {
    if (localValue !== null) {
      return localValue;
    }
    if (value) {
      return value;
    }
    const now = new Date();
    const hours24 = now.getHours();
    const minutes = now.getMinutes();

    if (format === "12h") {
      const period = hours24 >= 12 ? "PM" : "AM";
      const hours12 =
        hours24 === 0 ? 12 : hours24 > 12 ? hours24 - 12 : hours24;
      return { hours: hours12, minutes, period };
    }
    return { hours: hours24, minutes };
  }, [localValue, value, format]);

  const setInternalValue = useCallback((newValue: TimeValue) => {
    setLocalValue(newValue);
  }, []);

  const displayHours = useMemo(() => {
    if (format === "12h") {
      return internalValue.hours;
    }
    return internalValue.hours;
  }, [format, internalValue.hours]);

  const outerNumbers = useMemo(() => {
    if (selectionMode === "minutes") {
      const nums: number[] = [];
      for (let i = 0; i < 60; i += 5) {
        nums.push(i);
      }
      return nums;
    }

    if (format === "24h") {
      return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    }

    return [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  }, [selectionMode, format]);

  const innerNumbers = useMemo(() => {
    if (selectionMode === "minutes" || format === "12h") {
      return [];
    }
    return [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
  }, [selectionMode, format]);

  const { handAngle, isInnerRing } = useMemo(() => {
    if (selectionMode === "minutes") {
      const angle = (internalValue.minutes / 60) * 360;
      return { handAngle: angle, isInnerRing: false };
    }

    if (format === "24h") {
      const hour = internalValue.hours;
      if (hour >= 12) {
        const angle = ((hour - 12) / 12) * 360;
        return { handAngle: angle, isInnerRing: true };
      }
      const angle = (hour / 12) * 360;
      return { handAngle: angle, isInnerRing: false };
    }

    const hour = internalValue.hours === 12 ? 0 : internalValue.hours;
    const angle = (hour / 12) * 360;
    return { handAngle: angle, isInnerRing: false };
  }, [selectionMode, internalValue, format]);

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

        minute = Math.round(minute / minuteStep) * minuteStep;
        if (minute >= 60) minute = 0;

        const newValue = { ...internalValue, minutes: minute };
        setInternalValue(newValue);
        onChange(newValue);
      } else {
        let hour = Math.round((angle / 360) * 12);
        if (hour === 12) hour = 0;

        if (format === "24h") {
          const isInner = normalizedDistance < 0.65;
          if (isInner) {
            hour = hour + 12;
            if (hour === 24) hour = 12;
          } else {
            if (hour === 0) hour = 0;
          }
        } else {
          if (hour === 0) hour = 12;
        }

        const newValue = { ...internalValue, hours: hour };
        setInternalValue(newValue);
        onChange(newValue);
      }
    },
    [
      disabled,
      selectionMode,
      minuteStep,
      internalValue,
      format,
      onChange,
      setInternalValue,
    ],
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (disabled) return;
      setIsDragging(true);
      handleClockInteraction(e.clientX, e.clientY);
    },
    [disabled, handleClockInteraction],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      handleClockInteraction(e.clientX, e.clientY);
    },
    [isDragging, handleClockInteraction],
  );

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
    }
  }, [isDragging]);

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
      }
    };

    if (isDragging) {
      window.addEventListener("mouseup", handleGlobalMouseUp);
    }

    return () => {
      window.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [isDragging]);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (disabled) return;
      e.preventDefault();
      setIsDragging(true);
      const touch = e.touches[0];
      handleClockInteraction(touch.clientX, touch.clientY);
    },
    [disabled, handleClockInteraction],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      const touch = e.touches[0];
      handleClockInteraction(touch.clientX, touch.clientY);
    },
    [isDragging, handleClockInteraction],
  );

  const handleTouchEnd = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
    }
  }, [isDragging]);

  const togglePeriod = useCallback(
    (period: "AM" | "PM") => {
      if (disabled) return;
      const newValue = { ...internalValue, period };
      setInternalValue(newValue);
      onChange(newValue);
    },
    [disabled, internalValue, onChange, setInternalValue],
  );

  const OUTER_RADIUS = 40;
  const INNER_RADIUS = 26;

  const renderNumber = useCallback(
    (num: number, index: number, isInner: boolean) => {
      const total = 12;
      const radius = isInner ? INNER_RADIUS : OUTER_RADIUS;
      const position = getPosition(index, total, radius);

      let isSelected = false;
      if (selectionMode === "minutes") {
        isSelected = internalValue.minutes === num;
      } else {
        isSelected = internalValue.hours === num;
      }

      const displayNum =
        selectionMode === "minutes" && num === 0 ? "00" : num.toString();

      return (
        <div
          key={`${isInner ? "inner" : "outer"}-${num}`}
          className={[
            clockNumberClassName,
            isSelected && clockNumberSelectedClassName,
            isInner && clockNumberInnerClassName,
          ]
            .filter(Boolean)
            .join(" ")}
          style={{
            position: "absolute",
            left: `calc(50% + ${position.x}%)`,
            top: `calc(50% + ${position.y}%)`,
            transform: "translate(-50%, -50%)",
          }}
          data-selected={isSelected || undefined}
          data-inner={isInner || undefined}
        >
          {displayNum}
        </div>
      );
    },
    [
      selectionMode,
      internalValue,
      clockNumberClassName,
      clockNumberSelectedClassName,
      clockNumberInnerClassName,
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

  return (
    <div
      className={clockContainerClassName}
      data-disabled={disabled || undefined}
    >
      <div className={clockDisplayClassName}>
        <button
          type="button"
          className={[
            clockDisplayHoursClassName,
            selectionMode === "hours" && clockDisplayActiveClassName,
          ]
            .filter(Boolean)
            .join(" ")}
          onClick={() => setSelectionMode("hours")}
          data-active={selectionMode === "hours" || undefined}
          disabled={disabled}
        >
          {pad(displayHours)}
        </button>
        <span className={clockDisplaySeparatorClassName}>:</span>
        <button
          type="button"
          className={[
            clockDisplayMinutesClassName,
            selectionMode === "minutes" && clockDisplayActiveClassName,
          ]
            .filter(Boolean)
            .join(" ")}
          onClick={() => setSelectionMode("minutes")}
          data-active={selectionMode === "minutes" || undefined}
          disabled={disabled}
        >
          {pad(internalValue.minutes)}
        </button>

        {format === "12h" && (
          <div className={clockPeriodToggleClassName}>
            <button
              type="button"
              className={[
                clockPeriodButtonClassName,
                internalValue.period === "AM" && clockPeriodActiveClassName,
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => togglePeriod("AM")}
              data-active={internalValue.period === "AM" || undefined}
              disabled={disabled}
            >
              AM
            </button>
            <button
              type="button"
              className={[
                clockPeriodButtonClassName,
                internalValue.period === "PM" && clockPeriodActiveClassName,
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => togglePeriod("PM")}
              data-active={internalValue.period === "PM" || undefined}
              disabled={disabled}
            >
              PM
            </button>
          </div>
        )}
      </div>

      <div
        ref={clockRef}
        className={clockFaceClassName}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        role="slider"
        aria-label={
          selectionMode === "hours" ? "Select hours" : "Select minutes"
        }
        aria-valuemin={0}
        aria-valuemax={
          selectionMode === "hours" ? (format === "24h" ? 23 : 12) : 59
        }
        aria-valuenow={
          selectionMode === "hours"
            ? internalValue.hours
            : internalValue.minutes
        }
        tabIndex={disabled ? -1 : 0}
      >
        <svg
          className={clockHandClassName}
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
            className={clockHandLineClassName}
            strokeWidth="0.8"
          />
          <circle cx="50" cy="50" r="1.5" className={clockCenterClassName} />
        </svg>

        <div
          className={clockHandDotClassName}
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

      <div className={clockActionsClassName}>
        <button
          type="button"
          className={clockCancelButtonClassName}
          onClick={onCancel}
          disabled={disabled}
        >
          Cancel
        </button>
        <button
          type="button"
          className={clockOkButtonClassName}
          onClick={onConfirm}
          disabled={disabled}
        >
          OK
        </button>
      </div>
    </div>
  );
}

export default ClockFace;
