import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import type { UseTimePickerProps, UseTimePickerReturn } from "./utils/types";
import {
  generateTimeOptions,
  parseTimeInput,
  formatTimeValue,
  clampMinuteStep,
} from "./utils";

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
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const isTypingRef = useRef(false);
  const prevFormatRef = useRef(format);

  const [lastValidValue, setLastValidValue] = useState(() => computeInputValue(value, format).lastValid);

  // Use refs for values needed in commitValue to avoid stale closures
  const lastValidRef = useRef(lastValidValue);
  lastValidRef.current = lastValidValue;

  const inputValueRef = useRef(inputValue);
  inputValueRef.current = inputValue;

  const timeOptions = useMemo(
    () => generateTimeOptions(format, safeStep, minTime, maxTime),
    [format, safeStep, minTime, maxTime]
  );

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

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (disabled) return;

      switch (event.key) {
        case "Enter":
          event.preventDefault();
          if (focusedIndex >= 0 && displayOptions[focusedIndex]) {
            handleOptionSelect(displayOptions[focusedIndex]);
          } else {
            commitValue();
          }
          break;
        case "Tab":
          commitValue();
          break;
        case "Escape":
          event.preventDefault();
          break;
        case "ArrowDown":
          event.preventDefault();
          setFocusedIndex((prev) =>
            prev < displayOptions.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          event.preventDefault();
          setFocusedIndex((prev) =>
            prev > 0 ? prev - 1 : displayOptions.length - 1
          );
          break;
        case "Home":
          event.preventDefault();
          setFocusedIndex(0);
          break;
        case "End":
          event.preventDefault();
          setFocusedIndex(displayOptions.length - 1);
          break;
      }
    },
    [disabled, focusedIndex, displayOptions, handleOptionSelect, commitValue]
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
