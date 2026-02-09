import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import type { SearchableDropdownOption } from "./types";

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
  handleClear: (event: React.MouseEvent) => void;
  handleOptionSelect: (option: SearchableDropdownOption) => void;
  handleKeyDown: (event: React.KeyboardEvent) => void;
}

export function useDropdown({
  options = [],
  value,
  defaultValue,
  onValueChange,
  open,
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
  const isControlledValue = value !== undefined;
  const isControlledOpen = open !== undefined;

  const [internalValue, setInternalValue] = useState<string | null>(
    isControlledValue ? null : (defaultValue ?? null)
  );
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
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

  const isOpen = isControlledOpen ? open : internalOpen;
  const currentValue = isControlledValue ? value : internalValue;

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

  useEffect(() => {
    loadInitialMountedRef.current = true;
    return () => {
      loadInitialMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    setHasLoadedInitial(false);
  }, [onLoadInitialOptions, loadInitialOnOpen]);

  useEffect(() => {
    if (!isOpen || !loadInitialOnOpen || !onLoadInitialOptions || hasLoadedInitial) {
      return;
    }

    setIsLoadingInitial(true);
    onLoadInitialOptions()
      .then((results) => {
        if (!loadInitialMountedRef.current) return;
        setLoadedInitialOptions(results);
        setHasLoadedInitial(true);
      })
      .catch((error) => {
        if (!loadInitialMountedRef.current) return;
        onLoadError?.(error);
      })
      .finally(() => {
        if (loadInitialMountedRef.current) {
          setIsLoadingInitial(false);
        }
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
  }, [searchQuery, onSearch, searchDebounceMs, isAsync, onLoadError]);

  const handleOpen = useCallback(() => {
    if (disabled) return;
    if (!isControlledOpen) {
      setInternalOpen(true);
    }
    onOpenChange?.(true);
  }, [disabled, isControlledOpen, onOpenChange]);

  const handleClose = useCallback(() => {
    if (!isControlledOpen) {
      setInternalOpen(false);
    }
    onOpenChange?.(false);
    setSearchQuery("");
    setFocusedIndex(-1);
    setAsyncOptions([]);
    setTypeaheadQuery("");
    shouldRestoreFocusRef.current = true;
  }, [isControlledOpen, onOpenChange]);

  const handleToggle = useCallback(() => {
    if (isOpen) {
      handleClose();
    } else {
      handleOpen();
    }
  }, [isOpen, handleOpen, handleClose]);

  const handleClear = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      if (!isControlledValue) {
        setInternalValue(null);
      }
      onValueChange?.(null, null);
    },
    [isControlledValue, onValueChange],
  );

  const handleOptionSelect = useCallback(
    (option: SearchableDropdownOption) => {
      if (option.disabled) return;
      if (!isControlledValue) {
        setInternalValue(option.value);
      }
      onValueChange?.(option.value, option);
      handleClose();
    },
    [isControlledValue, onValueChange, handleClose],
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
            handleClear(event as unknown as React.MouseEvent);
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
