import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import type {
  MultiSelectOption,
  UseMultiSelectDropdownProps,
  UseMultiSelectDropdownReturn,
} from "./types";
import { useControllableState } from "../../../utils/useControllableState";

function getFirstEnabledIndex(opts: MultiSelectOption[]): number {
  return opts.findIndex((o) => !o.disabled);
}

export function useMultiSelectDropdown({
  options = [],
  value: valueProp,
  defaultValue: defaultValueProp,
  disabled = false,
  onValueChange,
  onLoadOptions,
  loadOnOpen = false,
  onLoadError,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  label,
  "aria-label": ariaLabel,
}: UseMultiSelectDropdownProps): UseMultiSelectDropdownReturn {
  const [value, setValue] = useControllableState<string[]>({
    value: valueProp,
    defaultValue: defaultValueProp ?? [],
  });

  const [isOpen, setIsOpen] = useControllableState<boolean>({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);
  const [loadedOptions, setLoadedOptions] = useState<MultiSelectOption[]>([]);
  const hasLoadedRef = useRef(false);
  const mountedRef = useRef(true);
  const shouldRestoreFocusRef = useRef(false);

  // Accessibility dev warning for missing label/aria-label
  const warnedRef = useRef(false);
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" && !warnedRef.current) {
      if (!label && !ariaLabel) {
        warnedRef.current = true;
        console.warn(
          "[MultiSelectDropdown] Missing accessible name. Provide either a `label` or `aria-label` prop " +
          "so that screen readers can identify this dropdown."
        );
      }
    }
  }, [label, ariaLabel]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    hasLoadedRef.current = false;
  }, [onLoadOptions, loadOnOpen]);

  const displayOptions = useMemo(() => {
    if (onLoadOptions && loadedOptions.length > 0) {
      return loadedOptions;
    }
    return options;
  }, [options, loadedOptions, onLoadOptions]);

  const selectedOptions = useMemo(
    () => displayOptions.filter((option) => value.includes(option.value)),
    [displayOptions, value],
  );

  const loadOptions = useCallback(() => {
    if (!loadOnOpen || !onLoadOptions || hasLoadedRef.current || isLoadingOptions) {
      return;
    }

    setIsLoadingOptions(true);
    onLoadOptions()
      .then((results) => {
        if (!mountedRef.current) return;
        setLoadedOptions(results);
        hasLoadedRef.current = true;
      })
      .catch((err) => {
        if (!mountedRef.current) return;
        onLoadError?.(err);
      })
      .finally(() => {
        if (mountedRef.current) setIsLoadingOptions(false);
      });
  }, [loadOnOpen, onLoadOptions, isLoadingOptions, onLoadError]);

  const handleToggle = useCallback(() => {
    if (disabled) return;
    setIsOpen((prev: boolean) => {
      if (prev) {
        setFocusedIndex(-1);
        return false;
      }
      setFocusedIndex(-1);
      loadOptions();
      return true;
    });
  }, [disabled, setIsOpen, loadOptions]);

  const handleClose = useCallback(() => {
    shouldRestoreFocusRef.current = true;
    setIsOpen(false);
    setFocusedIndex(-1);
  }, [setIsOpen]);

  const handleOptionToggle = useCallback(
    (option: MultiSelectOption) => {
      if (option.disabled) return;

      const isSelected = value.includes(option.value);
      const newValues = isSelected
        ? value.filter((v) => v !== option.value)
        : [...value, option.value];

      setValue(newValues);
      const newSelectedOptions = displayOptions.filter((opt) =>
        newValues.includes(opt.value),
      );
      onValueChange?.(newValues, newSelectedOptions);
    },
    [value, displayOptions, onValueChange, setValue],
  );

  const handleRemoveOption = useCallback(
    (optionValue: string) => {
      const newValues = value.filter((v) => v !== optionValue);
      setValue(newValues);
      const newSelectedOptions = displayOptions.filter((opt) =>
        newValues.includes(opt.value),
      );
      onValueChange?.(newValues, newSelectedOptions);
    },
    [value, displayOptions, onValueChange, setValue],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (disabled) return;

      switch (event.key) {
        case "Enter":
        case " ":
          event.preventDefault();
          if (isOpen && focusedIndex >= 0 && displayOptions[focusedIndex]) {
            handleOptionToggle(displayOptions[focusedIndex]);
          } else if (!isOpen) {
            handleToggle();
          }
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
            loadOptions();
            const first = getFirstEnabledIndex(displayOptions);
            if (first !== -1) setFocusedIndex(first);
          } else {
            setFocusedIndex((prev) => {
              const nextIndex = prev < displayOptions.length - 1 ? prev + 1 : 0;
              for (let i = nextIndex; i < displayOptions.length; i++) {
                if (!displayOptions[i].disabled) return i;
              }
              for (let i = 0; i < nextIndex; i++) {
                if (!displayOptions[i].disabled) return i;
              }
              return prev;
            });
          }
          break;
        case "ArrowUp":
          event.preventDefault();
          if (isOpen) {
            setFocusedIndex((prev) => {
              const nextIndex = prev > 0 ? prev - 1 : displayOptions.length - 1;
              for (let i = nextIndex; i >= 0; i--) {
                if (!displayOptions[i].disabled) return i;
              }
              for (let i = displayOptions.length - 1; i > nextIndex; i--) {
                if (!displayOptions[i].disabled) return i;
              }
              return prev;
            });
          }
          break;
        case "Home":
          event.preventDefault();
          if (isOpen) {
            const firstEnabledIndex = displayOptions.findIndex(
              (option) => !option.disabled,
            );
            if (firstEnabledIndex !== -1) {
              setFocusedIndex(firstEnabledIndex);
            }
          }
          break;
        case "End":
          event.preventDefault();
          if (isOpen) {
            for (let i = displayOptions.length - 1; i >= 0; i--) {
              if (!displayOptions[i].disabled) {
                setFocusedIndex(i);
                break;
              }
            }
          }
          break;
      }
    },
    [disabled, isOpen, focusedIndex, displayOptions, handleToggle, handleClose, handleOptionToggle, loadOptions, setIsOpen],
  );

  return {
    isOpen,
    currentValue: value,
    focusedIndex,
    isLoadingOptions,
    displayOptions,
    selectedOptions,
    shouldRestoreFocusRef,
    setFocusedIndex,
    handleToggle,
    handleClose,
    handleOptionToggle,
    handleRemoveOption,
    handleKeyDown,
  };
}
