import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import type { UseTimePickerProps, UseTimePickerReturn } from "./utils/types.js";
import { useMenuNavigation } from "../../utils/menu/useMenuNavigation.js";
import {
  generateTimeOptions,
  parseTimeInput,
  formatTimeValue,
  clampMinuteStep,
} from "./utils.js";

function computeInputValue(
  value: string | null | undefined,
  format: "12h" | "24h"
): { inputValue: string; lastValid: string } {
  if (value) {
    const timeValue = parseTimeInput(value, format);
    if (timeValue) {
      const formatted = formatTimeValue(timeValue, format);
      return { inputValue: formatted, lastValid: formatted };
    }
    return { inputValue: value, lastValid: "" };
  }
  return { inputValue: "", lastValid: "" };
}

export function useTimePicker({
  value,
  format,
  minuteStep,
  minTime,
  maxTime,
  disabled,
  onValueChange,
}: UseTimePickerProps): UseTimePickerReturn {
  const safeStep = clampMinuteStep(minuteStep);
  const [inputValue, setInputValue] = useState(() => computeInputValue(value, format).inputValue);
  // Owned here rather than by `useMenuNavigation`: the callbacks below reset
  // it and are declared before the hook runs.
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const isTypingRef = useRef(false);
  const prevFormatRef = useRef(format);

  const [lastValidValue, setLastValidValue] = useState(() => computeInputValue(value, format).lastValid);

  const lastValidRef = useRef(lastValidValue);
  const inputValueRef = useRef(inputValue);

  useEffect(() => {
    lastValidRef.current = lastValidValue;
  }, [lastValidValue]);

  useEffect(() => {
    inputValueRef.current = inputValue;
  }, [inputValue]);

  const timeOptions = useMemo(
    () => generateTimeOptions(format, safeStep, minTime, maxTime),
    [format, safeStep, minTime, maxTime]
  );

  /* eslint-disable react-hooks/set-state-in-effect -- batched state sync on prop change */
  useEffect(() => {
    const formatChanged = prevFormatRef.current !== format;
    if (formatChanged) {
      prevFormatRef.current = format;
    }

    const computed = computeInputValue(value, format);
    if (formatChanged) {
      setInputValue(computed.inputValue);
      setLastValidValue(computed.lastValid);
      isTypingRef.current = false;
      return;
    }
    if (isTypingRef.current) return;
    setInputValue(computed.inputValue);
    setLastValidValue(computed.lastValid);
  }, [value, format]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const displayOptions = useMemo(() => {
    if (!inputValue.trim()) return timeOptions;

    const searchLower = inputValue.toLowerCase().replace(/\s+/g, "");

    const exactMatch: string[] = [];
    const startsWith: string[] = [];
    const contains: string[] = [];

    for (const option of timeOptions) {
      const optionLower = option.toLowerCase().replace(/\s+/g, "");

      if (optionLower === searchLower) {
        exactMatch.push(option);
      } else if (optionLower.startsWith(searchLower)) {
        startsWith.push(option);
      } else if (optionLower.includes(searchLower)) {
        contains.push(option);
      }
    }

    return [...exactMatch, ...startsWith, ...contains];
  }, [inputValue, timeOptions]);

  const commitValue = useCallback(() => {
    const currentInput = inputValueRef.current;
    const currentLastValid = lastValidRef.current;

    if (!currentInput.trim()) {
      setLastValidValue("");
      onValueChange(null, null);
      isTypingRef.current = false;
      return;
    }

    const parsed = parseTimeInput(currentInput, format);
    if (parsed) {
      const formatted = formatTimeValue(parsed, format);
      setInputValue(formatted);
      setLastValidValue(formatted);
      onValueChange(formatted, parsed);
    } else {
      setInputValue(currentLastValid);
    }
    isTypingRef.current = false;
  }, [format, onValueChange]);

  const handleToggle = useCallback(() => {
    if (disabled) return;
    setFocusedIndex(-1);
  }, [disabled]);

  const handleClose = useCallback(() => {
    setFocusedIndex(-1);
  }, []);

  const handleOpen = useCallback(() => {
    setFocusedIndex(-1);
  }, []);

  const handleInputChange = useCallback((newValue: string) => {
    const cleaned = newValue.replace(/[^0-9:aAmMpP\s]/g, "");
    setInputValue(cleaned);
    isTypingRef.current = true;
  }, []);

  const handleOptionSelect = useCallback(
    (time: string) => {
      const timeValue = parseTimeInput(time, format);
      setInputValue(time);
      setLastValidValue(time);
      onValueChange(time, timeValue);
      isTypingRef.current = false;
    },
    [format, onValueChange]
  );

  const handleBlur = useCallback(() => {
    commitValue();
  }, [commitValue]);

  /**
   * The shared keyboard model.
   *
   * No `isDisabled`: `generateTimeOptions` filters by `minTime`/`maxTime`, so
   * the list holds only selectable times and there is nothing to skip. The
   * disabled items a bounded range produces are ClockFace's dial numbers, which
   * are a different surface.
   *
   * `commitOnSpace` is false because the trigger is a text input. ARIA's
   * editable combobox does not bind Space — it is a character — and the
   * 12-hour format this component displays contains one.
   */
  const {
    onKeyDown: onMenuKeyDown,
  } = useMenuNavigation<(typeof displayOptions)[number]>({
    items: displayOptions,
    isOpen: true,
    activeIndex: focusedIndex,
    onActiveIndexChange: setFocusedIndex,
    onSelect: handleOptionSelect,
    commitOnSpace: false,
  });

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (disabled) return;

      // Both of these commit whatever has been typed into the input, which is
      // this component's own behaviour: its trigger is a text field, so there is
      // a value to parse even when no option is highlighted.
      if (event.key === "Tab") {
        commitValue();
        return;
      }
      if (event.key === "Enter" && focusedIndex < 0) {
        event.preventDefault();
        commitValue();
        return;
      }

      onMenuKeyDown(event);
    },
    [disabled, focusedIndex, commitValue, onMenuKeyDown],
  );

  return {
    inputValue,
    focusedIndex,
    displayOptions,
    setFocusedIndex,
    handleToggle,
    handleClose,
    handleOpen,
    handleInputChange,
    handleOptionSelect,
    handleKeyDown,
    handleBlur,
  };
}
