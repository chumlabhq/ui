import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import type {
  MultiSelectOption,
  UseMultiSelectDropdownProps,
  UseMultiSelectDropdownReturn,
} from "./types";

function getFirstEnabledIndex(opts: MultiSelectOption[]): number {
  return opts.findIndex((o) => !o.disabled);
}

export function useMultiSelectDropdown({
  options = [],
  value,
  disabled = false,
  onValueChange,
  onLoadOptions,
  loadOnOpen = false,
  onLoadError,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
}: UseMultiSelectDropdownProps): UseMultiSelectDropdownReturn {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpenControlled = openProp !== undefined;
  const isOpen = isOpenControlled ? openProp : internalOpen;
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);
  const [loadedOptions, setLoadedOptions] = useState<MultiSelectOption[]>([]);
  const hasLoadedRef = useRef(false);
  const mountedRef = useRef(true);
  const shouldRestoreFocusRef = useRef(false);
  const isOpenControlledRef = useRef(openProp !== undefined);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production" && isOpenControlledRef.current !== (openProp !== undefined)) {
      console.error(
        "[MultiSelectDropdown] Component is changing between controlled and uncontrolled open state. " +
          "Decide between using open or defaultOpen for the lifetime of the component."
      );
    }
    isOpenControlledRef.current = openProp !== undefined;
  }, [openProp]);

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

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isOpenControlled) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [isOpenControlled, onOpenChange],
  );

  const handleToggle = useCallback(() => {
    if (!disabled) {
      const willOpen = !isOpen;
      setOpen(willOpen);
      setFocusedIndex(-1);
      if (willOpen) {
        loadOptions();
      }
    }
  }, [disabled, isOpen, loadOptions, setOpen]);

  const handleClose = useCallback(() => {
    shouldRestoreFocusRef.current = true;
    setOpen(false);
    setFocusedIndex(-1);
  }, [setOpen]);

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
            setOpen(true);
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
    [disabled, isOpen, focusedIndex, displayOptions, handleToggle, handleClose, handleOptionToggle, loadOptions, setOpen],
  );

  return {
    isOpen,
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
