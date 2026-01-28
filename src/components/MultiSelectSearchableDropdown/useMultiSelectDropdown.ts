import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import type {
  MultiSelectOption,
  UseMultiSelectDropdownProps,
  UseMultiSelectDropdownReturn,
} from "./types";

export function useMultiSelectDropdown({
  options = [],
  value,
  disabled = false,
  showSearch = true,
  onSearch,
  searchDebounceMs = 300,
  onChange,
  initialOptions = [],
  onLoadInitialOptions,
  loadInitialOnOpen = false,
}: UseMultiSelectDropdownProps): UseMultiSelectDropdownReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingInitial, setIsLoadingInitial] = useState(false);
  const [asyncOptions, setAsyncOptions] = useState<MultiSelectOption[]>([]);
  const [loadedInitialOptions, setLoadedInitialOptions] = useState<MultiSelectOption[]>([]);
  const [hasLoadedInitial, setHasLoadedInitial] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    () => allOptions.filter((option) => value.includes(option.value)),
    [allOptions, value]
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
      .catch((error) => {
        console.error("Failed to load initial options:", error);
      })
      .finally(() => {
        setIsLoadingInitial(false);
      });
  }, [isOpen, loadInitialOnOpen, onLoadInitialOptions, hasLoadedInitial]);

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
      } catch (error) {
        console.error("Search failed:", error);
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
  }, [searchQuery, onSearch, searchDebounceMs, isAsync]);

  const handleToggle = useCallback(() => {
    if (disabled) return;
    setIsOpen((prev) => !prev);
    setSearchQuery("");
    setFocusedIndex(-1);
    setAsyncOptions([]);
  }, [disabled]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setSearchQuery("");
    setFocusedIndex(-1);
    setAsyncOptions([]);
  }, []);

  const handleOptionToggle = useCallback(
    (option: MultiSelectOption) => {
      if (option.disabled) return;

      const isSelected = value.includes(option.value);
      const newValues = isSelected
        ? value.filter((v) => v !== option.value)
        : [...value, option.value];

      const newSelectedOptions = allOptions.filter((opt) =>
        newValues.includes(opt.value)
      );

      onChange(newValues, newSelectedOptions);
    },
    [value, allOptions, onChange]
  );

  const handleRemoveOption = useCallback(
    (optionValue: string) => {
      const newValues = value.filter((v) => v !== optionValue);
      const newSelectedOptions = allOptions.filter((opt) =>
        newValues.includes(opt.value)
      );
      onChange(newValues, newSelectedOptions);
    },
    [value, allOptions, onChange]
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
    [disabled, isOpen, focusedIndex, displayOptions, showSearch, handleToggle, handleClose, handleOptionToggle]
  );

  return {
    isOpen,
    searchQuery,
    focusedIndex,
    isSearching,
    isLoadingInitial,
    displayOptions,
    selectedOptions,
    setSearchQuery,
    setFocusedIndex,
    handleToggle,
    handleClose,
    handleOptionToggle,
    handleRemoveOption,
    handleKeyDown,
  };
}
