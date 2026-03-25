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

  // Warn on controlled/uncontrolled transition — in useEffect for React 19
  const initialIsControlledRef = useRef(isControlled);
  useEffect(() => {
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
  }, [isControlled]);

  const [internalValue, setInternalValue] = useState<T>(defaultValue);
  const value = isControlled ? controlledValue : internalValue;

  // Refs updated in effects for React 19 compliance
  const valueRef = useRef(value);
  const onChangeRef = useRef(onChange);
  const currentIsControlledRef = useRef(isControlled);

  useEffect(() => {
    valueRef.current = value;
    onChangeRef.current = onChange;
    currentIsControlledRef.current = isControlled;
  });

  const setValue = useCallback(
    (nextValue: T | ((prev: T) => T)) => {
      const resolvedValue =
        typeof nextValue === "function"
          ? (nextValue as (prev: T) => T)(valueRef.current)
          : nextValue;

      if (Object.is(resolvedValue, valueRef.current)) return;

      if (!currentIsControlledRef.current) {
        valueRef.current = resolvedValue;
        setInternalValue(resolvedValue);
      }
      onChangeRef.current?.(resolvedValue);
    },
    [],
  );

  return [value, setValue];
}
