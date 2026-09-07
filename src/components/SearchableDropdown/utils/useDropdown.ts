import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { useMenuNavigation } from "../../../utils/menu/useMenuNavigation.js";
import type { SearchableDropdownOption } from "./types.js";
import { useControllableState } from "../../../utils/useControllableState.js";
import { useIsomorphicLayoutEffect } from "../../../utils/useIsomorphicLayoutEffect.js";

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

  // Owned here rather than by `useMenuNavigation`: the callbacks below reset
  // it and are declared before the hook runs.
  const [focusedIndex, setFocusedIndex] = useState(-1);

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
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingInitial, setIsLoadingInitial] = useState(false);
  const [asyncOptions, setAsyncOptions] = useState<SearchableDropdownOption[]>([]);
  const [loadedInitialOptions, setLoadedInitialOptions] = useState<SearchableDropdownOption[]>([]);
  const [hasLoadedInitial, setHasLoadedInitial] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shouldRestoreFocusRef = useRef(false);
  const searchVersionRef = useRef(0);
  const loadInitialMountedRef = useRef(true);

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

  const shouldLoadInitial = isOpen && loadInitialOnOpen && !!onLoadInitialOptions && !hasLoadedInitial;

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

  const hasActiveSearch = isAsync && !!onSearch && !!searchQuery.trim();

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
    shouldRestoreFocusRef.current = true;
  }, [setIsOpen]);

  const handleToggle = useCallback(() => {
    if (disabled) return;
    setIsOpen((prev: boolean) => {
      if (prev) {
        setSearchQuery("");
        setFocusedIndex(-1);
        setAsyncOptions([]);
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

  /**
   * The shared keyboard model. Two things stay here because they are this
   * component's own: Delete/Backspace clears only while the surface is closed,
   * and a Space typed into the search field is a character rather than a
   * commit — the trigger is a button, the search box is not.
   */
  const {
    onKeyDown: onMenuKeyDown,
    firstEnabledIndex,
  } = useMenuNavigation<SearchableDropdownOption>({
    items: displayOptions,
    isOpen,
    activeIndex: focusedIndex,
    onActiveIndexChange: setFocusedIndex,
    isDisabled: (option) => !!option.disabled,
    onSelect: handleOptionSelect,
    onOpen: handleOpen,
    onClose: () => handleClose(),
    typeahead: { getLabel: (option) => option.label, timeout: typeaheadTimeout },
  });

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (disabled) return;

      const inSearchField =
        (event.target as HTMLElement | null)?.tagName === "INPUT" && showSearch && isOpen;

      // The search box owns its own text. Space types, and a printable
      // character goes to the query rather than to type-ahead.
      if (inSearchField && (event.key === " " || event.key.length === 1)) return;

      // Opening with Enter or Space lands on the first option, so the next
      // Enter selects it. Dropdown opens with nothing active; this component
      // has always seeded, and that is not one of the differences this slice
      // is resolving.
      if (!isOpen && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        handleOpen();
        if (firstEnabledIndex !== -1) setFocusedIndex(firstEnabledIndex);
        return;
      }

      // Type-ahead does not reach a closed surface here. Unlike Dropdown, this
      // component does not open on a typed character, so searching would move a
      // highlight nobody can see and leave it there for the next open.
      if (
        !isOpen &&
        event.key.length === 1 &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.altKey
      ) {
        return;
      }

      if (
        (event.key === "Delete" || event.key === "Backspace") &&
        clearable &&
        currentValue &&
        !isOpen
      ) {
        event.preventDefault();
        handleClear(event);
        return;
      }

      onMenuKeyDown(event);
    },
    [
      disabled,
      isOpen,
      showSearch,
      clearable,
      currentValue,
      handleClear,
      handleOpen,
      setFocusedIndex,
      firstEnabledIndex,
      onMenuKeyDown,
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
