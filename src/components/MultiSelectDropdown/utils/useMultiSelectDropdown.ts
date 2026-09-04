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
  // State, not a ref: `shouldLoad` is computed during render and a ref cannot
  // be read there. Dropdown already tracked this as state.
  const [hasLoaded, setHasLoaded] = useState(false);
  const isLoadingRef = useRef(false);
  const mountedRef = useRef(true);
  const shouldRestoreFocusRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Reset when the loader config changes, adjusted during render rather than
  // from an effect. Same shape as SearchableDropdown's `prevLoadConfig`.
  const [prevLoadConfig, setPrevLoadConfig] = useState({ onLoadOptions, loadOnOpen });
  if (
    prevLoadConfig.onLoadOptions !== onLoadOptions ||
    prevLoadConfig.loadOnOpen !== loadOnOpen
  ) {
    setPrevLoadConfig({ onLoadOptions, loadOnOpen });
    if (hasLoaded) setHasLoaded(false);
  }

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

  /**
   * Whether the menu should be fetching right now.
   *
   * Derived from `isOpen` rather than called from the open handlers, so
   * `defaultOpen` and a controlled `open` fetch too. Matches Dropdown and the
   * two searchable dropdowns; all four resolve this the same way now.
   */
  const shouldLoad = isOpen && loadOnOpen && !!onLoadOptions && !hasLoaded;

  // Adjusted during render rather than from the effect, which would be a
  // cascading render.
  const [prevShouldLoad, setPrevShouldLoad] = useState(false);
  if (prevShouldLoad !== shouldLoad) {
    setPrevShouldLoad(shouldLoad);
    if (shouldLoad) setIsLoadingOptions(true);
  }

  useEffect(() => {
    if (!shouldLoad || !onLoadOptions) return;

    let cancelled = false;
    isLoadingRef.current = true;
    onLoadOptions()
      .then((results) => {
        if (cancelled) return;
        setLoadedOptions(results);
        setHasLoaded(true);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        onLoadError?.(err);
      })
      .finally(() => {
        isLoadingRef.current = false;
        // Unconditional. A successful load sets `hasLoaded`, which flips
        // `shouldLoad` and re-runs this effect — cancelling the very fetch
        // whose completion it is. Guarding this on `cancelled` left the
        // spinner up forever on the happy path. A newer fetch turns it back
        // on during render, so clearing it here cannot mask one.
        setIsLoadingOptions(false);
      });

    return () => {
      cancelled = true;
    };
  }, [shouldLoad, onLoadOptions, onLoadError]);

  const handleToggle = useCallback(() => {
    if (disabled) return;
    setIsOpen((prev: boolean) => {
      if (prev) {
        setFocusedIndex(-1);
        return false;
      }
      setFocusedIndex(-1);
      return true;
    });
  }, [disabled, setIsOpen]);

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
    [disabled, isOpen, focusedIndex, displayOptions, handleToggle, handleClose, handleOptionToggle, setIsOpen],
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
