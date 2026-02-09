import { useState, useCallback, useMemo, useRef } from "react";
import type {
  MultiSelectOption,
  UseMultiSelectDropdownProps,
  UseMultiSelectDropdownReturn,
} from "./types";

export function useMultiSelectDropdown({
  options = [],
  value,
  disabled = false,
  onValueChange,
  onLoadOptions,
  loadOnOpen = false,
}: UseMultiSelectDropdownProps): UseMultiSelectDropdownReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);
  const [loadedOptions, setLoadedOptions] = useState<MultiSelectOption[]>([]);
  const hasLoadedRef = useRef(false);

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
        setLoadedOptions(results);
        hasLoadedRef.current = true;
      })
      .catch((error) => {
        console.error("Failed to load options:", error);
      })
      .finally(() => {
        setIsLoadingOptions(false);
      });
  }, [loadOnOpen, onLoadOptions, isLoadingOptions]);

  const handleToggle = useCallback(() => {
    if (!disabled) {
      const willOpen = !isOpen;
      setIsOpen(willOpen);
      setFocusedIndex(-1);
      if (willOpen) {
        loadOptions();
      }
    }
  }, [disabled, isOpen, loadOptions]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setFocusedIndex(-1);
  }, []);

  const handleOptionToggle = useCallback(
    (option: MultiSelectOption) => {
      if (option.disabled) return;

      const isSelected = value.includes(option.value);
      const newValues = isSelected
        ? value.filter((v) => v !== option.value)
        : [...value, option.value];

      const newSelectedOptions = displayOptions.filter((opt) =>
        newValues.includes(opt.value),
      );

      onValueChange(newValues, newSelectedOptions);
    },
    [value, displayOptions, onValueChange],
  );

  const handleRemoveOption = useCallback(
    (optionValue: string) => {
      const newValues = value.filter((v) => v !== optionValue);
      const newSelectedOptions = displayOptions.filter((opt) =>
        newValues.includes(opt.value),
      );
      onValueChange(newValues, newSelectedOptions);
    },
    [value, displayOptions, onValueChange],
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
            setFocusedIndex(0);
            loadOptions();
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
    [disabled, isOpen, focusedIndex, displayOptions, handleToggle, handleClose, handleOptionToggle, loadOptions],
  );

  return {
    isOpen,
    focusedIndex,
    isLoadingOptions,
    displayOptions,
    selectedOptions,
    setFocusedIndex,
    handleToggle,
    handleClose,
    handleOptionToggle,
    handleRemoveOption,
    handleKeyDown,
  };
}
