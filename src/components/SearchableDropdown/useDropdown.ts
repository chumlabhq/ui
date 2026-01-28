import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import type { SearchableDropdownOption } from "./types";

interface UseDropdownProps {
  options?: SearchableDropdownOption[];
  value: string | null;
  disabled?: boolean;
  showSearch?: boolean;
  onSearch?: (query: string) => Promise<SearchableDropdownOption[]>;
  searchDebounceMs?: number;
  onChange: (value: string, option: SearchableDropdownOption | null) => void;
  initialOptions?: SearchableDropdownOption[];
  onLoadInitialOptions?: () => Promise<SearchableDropdownOption[]>;
  loadInitialOnOpen?: boolean;
}

interface UseDropdownReturn {
  isOpen: boolean;
  searchQuery: string;
  focusedIndex: number;
  isSearching: boolean;
  isLoadingInitial: boolean;
  displayOptions: SearchableDropdownOption[];
  selectedOption: SearchableDropdownOption | null;
  setSearchQuery: (query: string) => void;
  setFocusedIndex: (index: number) => void;
  handleToggle: () => void;
  handleClose: () => void;
  handleOptionSelect: (option: SearchableDropdownOption) => void;
  handleKeyDown: (event: React.KeyboardEvent) => void;
}

export function useDropdown({
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
}: UseDropdownProps): UseDropdownReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingInitial, setIsLoadingInitial] = useState(false);
  const [asyncOptions, setAsyncOptions] = useState<SearchableDropdownOption[]>([]);
  const [loadedInitialOptions, setLoadedInitialOptions] = useState<SearchableDropdownOption[]>([]);
  const [hasLoadedInitial, setHasLoadedInitial] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isAsync = typeof onSearch === "function";

  const allInitialOptions = useMemo(
    () => [...initialOptions, ...loadedInitialOptions],
    [initialOptions, loadedInitialOptions]
  );

  const selectedOption = useMemo(
    () => {
      const allOptions = isAsync 
        ? [...options, ...asyncOptions, ...allInitialOptions] 
        : options;
      return allOptions.find((option) => option.value === value) || null;
    },
    [options, asyncOptions, allInitialOptions, value, isAsync]
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

  const handleOptionSelect = useCallback(
    (option: SearchableDropdownOption) => {
      if (option.disabled) return;
      onChange(option.value, option);
      handleClose();
    },
    [onChange, handleClose]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (disabled) return;

      switch (event.key) {
        case "Enter":
          event.preventDefault();
          if (isOpen && focusedIndex >= 0 && displayOptions[focusedIndex]) {
            handleOptionSelect(displayOptions[focusedIndex]);
          } else if (!isOpen) {
            handleToggle();
          }
          break;
        case " ":
          if (!showSearch || !isOpen) {
            event.preventDefault();
            if (!isOpen) {
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
    [disabled, isOpen, focusedIndex, displayOptions, showSearch, handleToggle, handleClose, handleOptionSelect]
  );

  return {
    isOpen,
    searchQuery,
    focusedIndex,
    isSearching,
    isLoadingInitial,
    displayOptions,
    selectedOption,
    setSearchQuery,
    setFocusedIndex,
    handleToggle,
    handleClose,
    handleOptionSelect,
    handleKeyDown,
  };
}
