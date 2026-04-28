import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import type { SearchableDropdownOption } from "./types";
import { useControllableState } from "../../../utils/useControllableState";
import { useIsomorphicLayoutEffect } from "../../../utils/useIsomorphicLayoutEffect";

interface UseDropdownProps {
  options?: SearchableDropdownOption[];
  value?: string | null;
  defaultValue?: string;
  onValueChange?: (value: string | null, option: SearchableDropdownOption | null) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  clearable?: boolean;
  showSearch?: boolean;
  onSearch?: (query: string) => Promise<SearchableDropdownOption[]>;
  searchDebounceMs?: number;
  initialOptions?: SearchableDropdownOption[];
  onLoadInitialOptions?: () => Promise<SearchableDropdownOption[]>;
  loadInitialOnOpen?: boolean;
  onLoadError?: (error: unknown) => void;
  typeaheadTimeout?: number;
  label?: React.ReactNode;
  "aria-label"?: string;
}

interface UseDropdownReturn {
  isOpen: boolean;
  searchQuery: string;
  focusedIndex: number;
  isSearching: boolean;
  isLoadingInitial: boolean;
  displayOptions: SearchableDropdownOption[];
  selectedOption: SearchableDropdownOption | null;
  internalValue: string | null;
  shouldRestoreFocusRef: React.MutableRefObject<boolean>;
  setSearchQuery: (query: string) => void;
  setFocusedIndex: (index: number) => void;
  handleToggle: () => void;
  handleOpen: () => void;
  handleClose: () => void;
  handleClear: (event: React.SyntheticEvent) => void;
  handleOptionSelect: (option: SearchableDropdownOption) => void;
  handleKeyDown: (event: React.KeyboardEvent) => void;
}

export function useDropdown({
  options = [],
  value: valueProp,
  defaultValue,
  onValueChange,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  disabled = false,
  clearable = false,
  showSearch = true,
  onSearch,
  searchDebounceMs = 300,
  initialOptions = [],
  onLoadInitialOptions,
  loadInitialOnOpen = false,
  onLoadError,
  typeaheadTimeout = 1000,
}: UseDropdownProps): UseDropdownReturn {
  const displayOptionsRef = useRef<SearchableDropdownOption[]>([]);

  const [currentValue, setCurrentValue] = useControllableState<string | null>({
    value: valueProp,
    defaultValue: defaultValue ?? null,
    onChange: (newValue) => {
      const option = displayOptionsRef.current.find((o) => o.value === newValue) || null;
      onValueChange?.(newValue, option);
    },
  });

  const [isOpen, setIsOpen] = useControllableState<boolean>({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingInitial, setIsLoadingInitial] = useState(false);
  const [asyncOptions, setAsyncOptions] = useState<SearchableDropdownOption[]>([]);
  const [loadedInitialOptions, setLoadedInitialOptions] = useState<SearchableDropdownOption[]>([]);
  const [hasLoadedInitial, setHasLoadedInitial] = useState(false);
  const [typeaheadQuery, setTypeaheadQuery] = useState("");

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const typeaheadRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shouldRestoreFocusRef = useRef(false);
  const searchVersionRef = useRef(0);
  const loadInitialMountedRef = useRef(true);

  function getFirstEnabledIndex(opts: SearchableDropdownOption[]): number {
    return opts.findIndex((o) => !o.disabled);
  }
  function getLastEnabledIndex(opts: SearchableDropdownOption[]): number {
    for (let i = opts.length - 1; i >= 0; i--) {
      if (!opts[i].disabled) return i;
    }
    return -1;
  }
  function getNextEnabledIndex(opts: SearchableDropdownOption[], from: number): number {
    const start = from < opts.length - 1 ? from + 1 : 0;
    for (let i = start; i < opts.length; i++) {
      if (!opts[i].disabled) return i;
    }
    for (let i = 0; i < start; i++) {
      if (!opts[i].disabled) return i;
    }
    return from;
  }
  function getPrevEnabledIndex(opts: SearchableDropdownOption[], from: number): number {
    const start = from > 0 ? from - 1 : opts.length - 1;
    for (let i = start; i >= 0; i--) {
      if (!opts[i].disabled) return i;
    }
    for (let i = opts.length - 1; i > start; i--) {
      if (!opts[i].disabled) return i;
    }
    return from;
  }

  // isOpen and currentValue are now managed by useControllableState above

  const isAsync = typeof onSearch === "function";

  const allInitialOptions = useMemo(
    () => [...initialOptions, ...loadedInitialOptions],
    [initialOptions, loadedInitialOptions],
  );

  const selectedOption = useMemo(() => {
    if (!currentValue) return null;
    const allOptions = isAsync
      ? [...options, ...asyncOptions, ...allInitialOptions]
      : options;
    return allOptions.find((option) => option.value === currentValue) || null;
  }, [options, asyncOptions, allInitialOptions, currentValue, isAsync]);

  const filteredSyncOptions = useMemo(() => {
    if (isAsync || !showSearch || !searchQuery.trim()) return options;
    const query = searchQuery.toLowerCase();
    return options.filter((option) =>
      option.label.toLowerCase().includes(query),
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

  useIsomorphicLayoutEffect(() => {
    displayOptionsRef.current = displayOptions;
  });

  useEffect(() => {
    loadInitialMountedRef.current = true;
    return () => {
      loadInitialMountedRef.current = false;
    };
  }, []);

  // Reset hasLoadedInitial when load config changes (render-time derived state)
  const [prevLoadConfig, setPrevLoadConfig] = useState({ onLoadInitialOptions, loadInitialOnOpen });
  if (
    prevLoadConfig.onLoadInitialOptions !== onLoadInitialOptions ||
    prevLoadConfig.loadInitialOnOpen !== loadInitialOnOpen
  ) {
    setPrevLoadConfig({ onLoadInitialOptions, loadInitialOnOpen });
    if (hasLoadedInitial) {
      setHasLoadedInitial(false);
    }
  }

  // Derive: should load initial options
  const shouldLoadInitial = isOpen && loadInitialOnOpen && !!onLoadInitialOptions && !hasLoadedInitial;

  // Derive loading state from shouldLoadInitial (pre-fetch = loading)
  const [prevShouldLoad, setPrevShouldLoad] = useState(false);
  if (prevShouldLoad !== shouldLoadInitial) {
    setPrevShouldLoad(shouldLoadInitial);
    if (shouldLoadInitial) {
      setIsLoadingInitial(true);
    }
  }

  useEffect(() => {
    if (!shouldLoadInitial || !onLoadInitialOptions) return;

    let cancelled = false;
    onLoadInitialOptions()
      .then((results) => {
        if (cancelled) return;
        setLoadedInitialOptions(results);
        setHasLoadedInitial(true);
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        onLoadError?.(error);
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoadingInitial(false);
        }
      });
    return () => { cancelled = true; };
  }, [shouldLoadInitial, onLoadInitialOptions, onLoadError]);

  // Derive: should we be in search mode
  const hasActiveSearch = isAsync && !!onSearch && !!searchQuery.trim();

  // Reset async state when search clears (render-time derived state)
  const [prevHasActiveSearch, setPrevHasActiveSearch] = useState(false);
  if (prevHasActiveSearch !== hasActiveSearch) {
    setPrevHasActiveSearch(hasActiveSearch);
    if (!hasActiveSearch) {
      if (asyncOptions.length > 0) setAsyncOptions([]);
      if (isSearching) setIsSearching(false);
    } else {
      if (!isSearching) setIsSearching(true);
    }
  }

  useEffect(() => {
    if (!hasActiveSearch || !onSearch) return;

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    const currentVersion = ++searchVersionRef.current;

    debounceRef.current = setTimeout(() => {
      onSearch(searchQuery)
        .then((results) => {
          if (searchVersionRef.current === currentVersion) {
            setAsyncOptions(results);
          }
        })
        .catch((error) => {
          if (searchVersionRef.current === currentVersion) {
            setAsyncOptions([]);
            onLoadError?.(error);
          }
        })
        .finally(() => {
          if (searchVersionRef.current === currentVersion) {
            setIsSearching(false);
          }
        });
    }, searchDebounceMs);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [hasActiveSearch, searchQuery, onSearch, searchDebounceMs, isAsync, onLoadError]);

  const handleOpen = useCallback(() => {
    if (disabled) return;
    setIsOpen(true);
  }, [disabled, setIsOpen]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setSearchQuery("");
    setFocusedIndex(-1);
    setAsyncOptions([]);
    setTypeaheadQuery("");
    shouldRestoreFocusRef.current = true;
  }, [setIsOpen]);

  const handleToggle = useCallback(() => {
    if (disabled) return;
    setIsOpen((prev: boolean) => {
      if (prev) {
        setSearchQuery("");
        setFocusedIndex(-1);
        setAsyncOptions([]);
        setTypeaheadQuery("");
        shouldRestoreFocusRef.current = true;
        return false;
      }
      return true;
    });
  }, [disabled, setIsOpen]);

  // SyntheticEvent so this can be invoked from both the trigger's onClick
  // (MouseEvent) and the keyboard Delete/Backspace path (KeyboardEvent)
  // without unsafe casts.
  const handleClear = useCallback(
    (event: React.SyntheticEvent) => {
      event.stopPropagation();
      setCurrentValue(null);
    },
    [setCurrentValue],
  );

  const handleOptionSelect = useCallback(
    (option: SearchableDropdownOption) => {
      if (option.disabled) return;
      setCurrentValue(option.value);
      handleClose();
    },
    [setCurrentValue, handleClose],
  );

  const handleTypeahead = useCallback(
    (char: string) => {
      if (!isOpen || !displayOptions.length) return;

      if (typeaheadRef.current) {
        clearTimeout(typeaheadRef.current);
      }

      const newQuery = typeaheadQuery + char.toLowerCase();
      setTypeaheadQuery(newQuery);

      const matchIndex = displayOptions.findIndex((option) =>
        option.label.toLowerCase().startsWith(newQuery)
      );

      if (matchIndex !== -1) {
        setFocusedIndex(matchIndex);
      }

      typeaheadRef.current = setTimeout(() => {
        setTypeaheadQuery("");
      }, typeaheadTimeout);
    },
    [isOpen, displayOptions, typeaheadQuery, typeaheadTimeout],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (disabled) return;

      if (event.key === "Tab") {
        if (isOpen) {
          handleClose();
        }
        return;
      }

      const searchInputFocused = (event.target as HTMLElement).tagName === "INPUT";

      if (searchInputFocused && showSearch && isOpen) {
        if (event.key === "Escape") {
          event.preventDefault();
          handleClose();
        } else if (event.key === "ArrowDown") {
          event.preventDefault();
          if (displayOptions.length > 0) {
            setFocusedIndex((prev) => {
              const start = prev < displayOptions.length - 1 ? prev + 1 : 0;
              for (let i = start; i < displayOptions.length; i++) {
                if (!displayOptions[i].disabled) return i;
              }
              for (let i = 0; i < start; i++) {
                if (!displayOptions[i].disabled) return i;
              }
              return prev;
            });
          }
        } else if (event.key === "ArrowUp") {
          event.preventDefault();
          if (displayOptions.length > 0) {
            setFocusedIndex((prev) => {
              const start = prev > 0 ? prev - 1 : displayOptions.length - 1;
              for (let i = start; i >= 0; i--) {
                if (!displayOptions[i].disabled) return i;
              }
              for (let i = displayOptions.length - 1; i > start; i--) {
                if (!displayOptions[i].disabled) return i;
              }
              return prev;
            });
          }
        } else if (event.key === "Home") {
          event.preventDefault();
          const first = displayOptions.findIndex((o) => !o.disabled);
          if (first !== -1) setFocusedIndex(first);
        } else if (event.key === "End") {
          event.preventDefault();
          for (let i = displayOptions.length - 1; i >= 0; i--) {
            if (!displayOptions[i].disabled) {
              setFocusedIndex(i);
              break;
            }
          }
        } else if (event.key === "Enter" && focusedIndex >= 0 && displayOptions[focusedIndex]) {
          event.preventDefault();
          handleOptionSelect(displayOptions[focusedIndex]);
        }
        return;
      }

      switch (event.key) {
        case "Enter":
        case " ":
          event.preventDefault();
          if (!isOpen) {
            handleOpen();
            if (displayOptions.length > 0) {
              const first = getFirstEnabledIndex(displayOptions);
              if (first !== -1) setFocusedIndex(first);
            }
          } else if (focusedIndex >= 0 && displayOptions[focusedIndex] && !displayOptions[focusedIndex].disabled) {
            handleOptionSelect(displayOptions[focusedIndex]);
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
            handleOpen();
            if (displayOptions.length > 0) {
              const first = getFirstEnabledIndex(displayOptions);
              if (first !== -1) setFocusedIndex(first);
            }
          } else {
            setFocusedIndex((prev) => getNextEnabledIndex(displayOptions, prev));
          }
          break;
        case "ArrowUp":
          event.preventDefault();
          if (isOpen) {
            setFocusedIndex((prev) => getPrevEnabledIndex(displayOptions, prev));
          }
          break;
        case "Home":
          if (isOpen) {
            event.preventDefault();
            const first = getFirstEnabledIndex(displayOptions);
            if (first !== -1) setFocusedIndex(first);
          }
          break;
        case "End":
          if (isOpen) {
            event.preventDefault();
            const last = getLastEnabledIndex(displayOptions);
            if (last !== -1) setFocusedIndex(last);
          }
          break;
        case "Delete":
        case "Backspace":
          if (clearable && currentValue && !isOpen) {
            event.preventDefault();
            handleClear(event);
          }
          break;
        default:
          if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
            event.preventDefault();
            handleTypeahead(event.key);
          }
          break;
      }
    },
    [
      disabled,
      isOpen,
      focusedIndex,
      displayOptions,
      showSearch,
      clearable,
      currentValue,
      handleOpen,
      handleClose,
      handleOptionSelect,
      handleClear,
      handleTypeahead,
    ],
  );

  return {
    isOpen,
    searchQuery,
    focusedIndex,
    isSearching,
    isLoadingInitial,
    displayOptions,
    selectedOption,
    internalValue: currentValue,
    shouldRestoreFocusRef,
    setSearchQuery,
    setFocusedIndex,
    handleToggle,
    handleOpen,
    handleClose,
    handleClear,
    handleOptionSelect,
    handleKeyDown,
  };
}
