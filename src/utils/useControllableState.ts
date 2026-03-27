import { useState, useCallback, useRef, useEffect } from "react";

interface UseControllableStateOptions<T> {
  value?: T;
  defaultValue: T;
  onChange?: (value: T) => void;
}

export function useControllableState<T>({
  value: controlledValue,
  defaultValue,
  onChange,
}: UseControllableStateOptions<T>): [T, (value: T | ((prev: T) => T)) => void] {
  const isControlled = controlledValue !== undefined;

  const [internalValue, setInternalValue] = useState<T>(defaultValue);
  const value = isControlled ? controlledValue : internalValue;

  // Use a single ref object to avoid multiple ref.current reads during render.
  // Updated via effect for React 19 compliance — stale by at most one commit.
  const stateRef = useRef({ value, onChange, isControlled });
  useEffect(() => {
    stateRef.current = { value, onChange, isControlled };
  });

  const setValue = useCallback(
    (nextValue: T | ((prev: T) => T)) => {
      const { value: currentVal, onChange: currentOnChange, isControlled: currentIsControlled } = stateRef.current;
      const resolvedValue =
        typeof nextValue === "function"
          ? (nextValue as (prev: T) => T)(currentVal)
          : nextValue;

      if (!currentIsControlled) {
        stateRef.current = { ...stateRef.current, value: resolvedValue };
        setInternalValue(resolvedValue);
      }
      if (!Object.is(resolvedValue, currentVal)) {
        currentOnChange?.(resolvedValue);
      }
    },
    [],
  );

  return [value, setValue];
}
