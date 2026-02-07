import { useState, useCallback, useRef } from "react";

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
  const isControlledRef = useRef(isControlled);

  if (import.meta.env.DEV) {
    if (isControlledRef.current !== isControlled) {
      console.warn(
        "useControllableState: A component is changing from " +
          (isControlledRef.current ? "controlled" : "uncontrolled") +
          " to " +
          (isControlled ? "controlled" : "uncontrolled") +
          ". This is likely a bug.",
      );
    }
  }

  const [internalValue, setInternalValue] = useState<T>(defaultValue);
  const value = isControlled ? controlledValue : internalValue;

  const setValue = useCallback(
    (nextValue: T | ((prev: T) => T)) => {
      const resolvedValue =
        typeof nextValue === "function"
          ? (nextValue as (prev: T) => T)(value)
          : nextValue;

      if (!isControlled) {
        setInternalValue(resolvedValue);
      }
      onChange?.(resolvedValue);
    },
    [isControlled, onChange, value],
  );

  return [value, setValue];
}
