import { useState, useCallback, useMemo } from "react";
import type { UseTimePickerProps, UseTimePickerReturn } from "./types";
import {
  generateTimeOptions,
  parseTimeInput,
  formatTimeValue,
  timeValueFromString,
} from "./utils";

function computeInputValue(
  value: string | null | undefined,
  format: "12h" | "24h"
): { inputValue: string; lastValid: string } {
  if (value) {
    const timeValue = timeValueFromString(value, format);
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
  onChange,
}: UseTimePickerProps): UseTimePickerReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(() => computeInputValue(value, format).inputValue);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [isTyping, setIsTyping] = useState(false);
  const [prevValue, setPrevValue] = useState(value);
  const [lastValidValue, setLastValidValue] = useState(() => computeInputValue(value, format).lastValid);

  const timeOptions = useMemo(
    () => generateTimeOptions(format, minuteStep, minTime, maxTime),
    [format, minuteStep, minTime, maxTime]
  );

  if (value !== prevValue && !isTyping) {
    setPrevValue(value);
    const computed = computeInputValue(value, format);
    setInputValue(computed.inputValue);
    setLastValidValue(computed.lastValid);
  }

  const displayOptions = useMemo(() => {
    if (!inputValue.trim()) return timeOptions;

    const searchLower = inputValue.toLowerCase().replace(/\s+/g, "");

    const exactMatch: string[] = [];
    const startsWith: string[] = [];
    const contains: string[] = [];
    const rest: string[] = [];

    for (const option of timeOptions) {
      const optionLower = option.toLowerCase().replace(/\s+/g, "");

      if (optionLower === searchLower) {
        exactMatch.push(option);
      } else if (optionLower.startsWith(searchLower)) {
        startsWith.push(option);
      } else if (optionLower.includes(searchLower)) {
        contains.push(option);
      } else {
        rest.push(option);
      }
    }

    return [...exactMatch, ...startsWith, ...contains, ...rest];
  }, [inputValue, timeOptions]);

  const commitValue = useCallback(() => {
    if (!inputValue.trim()) {
      setLastValidValue("");
      onChange(null, null);
      setIsTyping(false);
      return;
    }

    const parsed = parseTimeInput(inputValue, format);
    if (parsed) {
      const formatted = formatTimeValue(parsed, format);
      setInputValue(formatted);
      setLastValidValue(formatted);
      onChange(formatted, parsed);
    } else {
      setInputValue(lastValidValue);
    }
    setIsTyping(false);
  }, [inputValue, format, onChange, lastValidValue]);

  const handleToggle = useCallback(() => {
    if (disabled) return;
    setIsOpen((prev) => !prev);
    setFocusedIndex(-1);
  }, [disabled]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setFocusedIndex(-1);
  }, []);

  const handleInputChange = useCallback((newValue: string) => {
    const cleaned = newValue.replace(/[^0-9:aAmMpP\s]/g, "");
    setInputValue(cleaned);
    setIsTyping(true);
    setIsOpen(true);
  }, []);

  const handleOptionSelect = useCallback(
    (time: string) => {
      const timeValue = timeValueFromString(time, format);
      setInputValue(time);
      onChange(time, timeValue);
      setIsTyping(false);
      handleClose();
    },
    [format, onChange, handleClose]
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
          if (isOpen && focusedIndex >= 0 && displayOptions[focusedIndex]) {
            handleOptionSelect(displayOptions[focusedIndex]);
          } else {
            commitValue();
            handleClose();
          }
          break;
        case "Tab":
          commitValue();
          handleClose();
          break;
        case "Escape":
          if (isOpen) {
            event.preventDefault();
            handleClose();
          }
          break;
        case "ArrowDown":
          event.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
            setFocusedIndex(0);
          } else {
            setFocusedIndex((prev) =>
              prev < displayOptions.length - 1 ? prev + 1 : 0
            );
          }
          break;
        case "ArrowUp":
          event.preventDefault();
          if (isOpen) {
            setFocusedIndex((prev) =>
              prev > 0 ? prev - 1 : displayOptions.length - 1
            );
          }
          break;
        case "Home":
          event.preventDefault();
          if (isOpen) setFocusedIndex(0);
          break;
        case "End":
          event.preventDefault();
          if (isOpen) setFocusedIndex(displayOptions.length - 1);
          break;
      }
    },
    [disabled, isOpen, focusedIndex, displayOptions, handleOptionSelect, commitValue, handleClose]
  );

  return {
    isOpen,
    inputValue,
    focusedIndex,
    displayOptions,
    setInputValue,
    setFocusedIndex,
    handleToggle,
    handleClose,
    handleInputChange,
    handleOptionSelect,
    handleKeyDown,
    handleBlur,
    commitValue,
  };
}
