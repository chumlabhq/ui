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
  const initialIsControlledRef = useRef(isControlled);

  if (process.env.NODE_ENV !== "production") {
    if (initialIsControlledRef.current !== isControlled) {
      console.warn(
        "useControllableState: A component is changing from " +
          (initialIsControlledRef.current ? "controlled" : "uncontrolled") +
          " to " +
          (isControlled ? "controlled" : "uncontrolled") +
          ". This is likely a bug.",
      );
    }
  }

  const [internalValue, setInternalValue] = useState<T>(defaultValue);
  const value = isControlled ? controlledValue : internalValue;

  const valueRef = useRef(value);
  valueRef.current = value;

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const currentIsControlledRef = useRef(isControlled);
  currentIsControlledRef.current = isControlled;

  const setValue = useCallback(
    (nextValue: T | ((prev: T) => T)) => {
      const resolvedValue =
        typeof nextValue === "function"
          ? (nextValue as (prev: T) => T)(valueRef.current)
          : nextValue;

      valueRef.current = resolvedValue;

      if (!currentIsControlledRef.current) {
        setInternalValue(resolvedValue);
      }
      onChangeRef.current?.(resolvedValue);
    },
    [],
  );

  return [value, setValue];
}
