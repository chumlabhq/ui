import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import type {
  MultiSelectOption,
  UseMultiSelectDropdownProps,
  UseMultiSelectDropdownReturn,
} from "./utils/types";
import { useControllableState } from "../../utils/useControllableState";

function getFirstEnabledIndex(opts: MultiSelectOption[]): number {
  return opts.findIndex((o) => !o.disabled);
}

export function useMultiSelectDropdown({
  options = [],
  value,
  defaultValue,
  disabled = false,
  showSearch = true,
  onSearch,
  searchDebounceMs = 300,
  onValueChange,
  initialOptions = [],
  onLoadInitialOptions,
  loadInitialOnOpen = false,
  onLoadError,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  label,
  "aria-label": ariaLabel,
}: UseMultiSelectDropdownProps): UseMultiSelectDropdownReturn {
  const [isOpen, setIsOpen] = useControllableState<boolean>({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  const [currentValues, setCurrentValues] = useControllableState<string[]>({
    value,
    defaultValue: defaultValue ?? [],
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingInitial, setIsLoadingInitial] = useState(false);
  const [asyncOptions, setAsyncOptions] = useState<MultiSelectOption[]>([]);
  const [loadedInitialOptions, setLoadedInitialOptions] = useState<MultiSelectOption[]>([]);
  const [hasLoadedInitial, setHasLoadedInitial] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shouldRestoreFocusRef = useRef(false);

  // Accessibility dev warning for missing label/aria-label
  const warnedRef = useRef(false);
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" && !warnedRef.current) {
      if (!label && !ariaLabel) {
        warnedRef.current = true;
        console.warn(
          "[MultiSelectSearchableDropdown] Missing accessible name. Provide either a `label` or `aria-label` prop " +
          "so that screen readers can identify this dropdown."
        );
      }
    }
  }, [label, ariaLabel]);

  const isAsync = typeof onSearch === "function";

  const allInitialOptions = useMemo(
    () => [...initialOptions, ...loadedInitialOptions],
    [initialOptions, loadedInitialOptions]
  );

  const allOptions = useMemo(() => {
    if (isAsync) {
      return [...options, ...asyncOptions, ...allInitialOptions];
    }
    return options;
  }, [options, asyncOptions, allInitialOptions, isAsync]);

  const selectedOptions = useMemo(
    () => allOptions.filter((option) => currentValues.includes(option.value)),
    [allOptions, currentValues]
  );

  const filteredSyncOptions = useMemo(() => {
    if (isAsync || !showSearch || !searchQuery.trim()) return options;
    const query = searchQuery.toLowerCase();
    return options.filter((option) =>
      option.label.toLowerCase().includes(query)
    );
  }, [options, searchQuery, showSearch, isAsync]);

  const displayOptions = useMemo(() => {
    if (isAsync) {
      if (searchQuery.trim()) {
        return asyncOptions;
      }
      return allInitialOptions;
    }
    return filteredSyncOptions;
  }, [isAsync, searchQuery, asyncOptions, allInitialOptions, filteredSyncOptions]);

  useEffect(() => {
    if (!isOpen || !loadInitialOnOpen || !onLoadInitialOptions || hasLoadedInitial) {
      return;
    }

    setIsLoadingInitial(true);
    onLoadInitialOptions()
      .then((results) => {
        setLoadedInitialOptions(results);
        setHasLoadedInitial(true);
      })
      .catch((error: unknown) => {
        onLoadError?.(error);
      })
      .finally(() => {
        setIsLoadingInitial(false);
      });
  }, [isOpen, loadInitialOnOpen, onLoadInitialOptions, hasLoadedInitial, onLoadError]);

  useEffect(() => {
    if (!isAsync || !onSearch || !searchQuery.trim()) {
      setAsyncOptions([]);
      setIsSearching(false);
      return;
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    setIsSearching(true);

    debounceRef.current = setTimeout(async () => {
      try {
        const results = await onSearch(searchQuery);
        setAsyncOptions(results);
      } catch (error: unknown) {
        onLoadError?.(error);
        setAsyncOptions([]);
      } finally {
        setIsSearching(false);
      }
    }, searchDebounceMs);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchQuery, onSearch, searchDebounceMs, isAsync, onLoadError]);

  const handleToggle = useCallback(() => {
    if (disabled) return;
    setIsOpen((prev: boolean) => {
      if (prev) {
        setSearchQuery("");
        setFocusedIndex(-1);
        setAsyncOptions([]);
        return false;
      }
      setSearchQuery("");
      setFocusedIndex(-1);
      setAsyncOptions([]);
      return true;
    });
  }, [disabled, setIsOpen]);

  const handleClose = useCallback(() => {
    shouldRestoreFocusRef.current = true;
    setIsOpen(false);
    setSearchQuery("");
    setFocusedIndex(-1);
    setAsyncOptions([]);
  }, [setIsOpen]);

  const handleOptionToggle = useCallback(
    (option: MultiSelectOption) => {
      if (option.disabled) return;

      const isSelected = currentValues.includes(option.value);
      const newValues = isSelected
        ? currentValues.filter((v) => v !== option.value)
        : [...currentValues, option.value];

      setCurrentValues(newValues);
      const newSelectedOptions = allOptions.filter((opt) =>
        newValues.includes(opt.value)
      );
      onValueChange?.(newValues, newSelectedOptions);
    },
    [currentValues, allOptions, onValueChange, setCurrentValues]
  );

  const handleRemoveOption = useCallback(
    (optionValue: string) => {
      const newValues = currentValues.filter((v) => v !== optionValue);
      setCurrentValues(newValues);
      const newSelectedOptions = allOptions.filter((opt) =>
        newValues.includes(opt.value)
      );
      onValueChange?.(newValues, newSelectedOptions);
    },
    [currentValues, allOptions, onValueChange, setCurrentValues]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (disabled) return;

      switch (event.key) {
        case "Enter":
          event.preventDefault();
          if (isOpen && focusedIndex >= 0 && displayOptions[focusedIndex]) {
            handleOptionToggle(displayOptions[focusedIndex]);
          } else if (!isOpen) {
            handleToggle();
          }
          break;
        case " ":
          if (!showSearch || !isOpen) {
            event.preventDefault();
            if (isOpen && focusedIndex >= 0 && displayOptions[focusedIndex]) {
              handleOptionToggle(displayOptions[focusedIndex]);
            } else if (!isOpen) {
              handleToggle();
            }
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
    [disabled, isOpen, focusedIndex, displayOptions, showSearch, handleToggle, handleClose, handleOptionToggle, setIsOpen]
  );

  return {
    isOpen,
    searchQuery,
    focusedIndex,
    isSearching,
    isLoadingInitial,
    displayOptions,
    selectedOptions,
    selectedValues: currentValues,
    shouldRestoreFocusRef,
    setSearchQuery,
    setFocusedIndex,
    handleToggle,
    handleClose,
    handleOptionToggle,
    handleRemoveOption,
    handleKeyDown,
  };
}
