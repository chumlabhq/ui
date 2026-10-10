import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { useMenuNavigation } from "../../../utils/menu/useMenuNavigation.js";
import type {
  MultiSelectOption,
  UseMultiSelectDropdownProps,
  UseMultiSelectDropdownReturn,
} from "./types.js";
import { useControllableState } from "../../../utils/useControllableState.js";


export function useMultiSelectDropdown({
  options = [],
  value,
  defaultValue,
  disabled = false,
  showSearch = true,
  searchOptions,
  searchDebounceMs = 300,
  onValueChange,
  initialOptions = [],
  loadInitialOptions,
  loadInitialOnOpen = false,
  onLoadError,
  typeaheadTimeout = 500,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
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
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingInitial, setIsLoadingInitial] = useState(false);
  const [asyncOptions, setAsyncOptions] = useState<MultiSelectOption[]>([]);
  const [loadedInitialOptions, setLoadedInitialOptions] = useState<MultiSelectOption[]>([]);
  const [hasLoadedInitial, setHasLoadedInitial] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shouldRestoreFocusRef = useRef(false);

  const isAsync = typeof searchOptions === "function";

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
    if (!isOpen || !loadInitialOnOpen || !loadInitialOptions || hasLoadedInitial) {
      return;
    }

    setIsLoadingInitial(true);
    loadInitialOptions()
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
  }, [isOpen, loadInitialOnOpen, loadInitialOptions, hasLoadedInitial, onLoadError]);

  useEffect(() => {
    if (!isAsync || !searchOptions || !searchQuery.trim()) {
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
        const results = await searchOptions(searchQuery);
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
  }, [searchQuery, searchOptions, searchDebounceMs, isAsync, onLoadError]);

  const handleToggle = useCallback(() => {
    if (disabled) return;
    // The active index is not reset here: `useMenuNavigation` clears it when
    // the surface closes, so resetting again would be a second owner.
    setIsOpen((prev: boolean) => {
      setSearchQuery("");
      setAsyncOptions([]);
      return !prev;
    });
  }, [disabled, setIsOpen]);

  const handleClose = useCallback(() => {
    shouldRestoreFocusRef.current = true;
    setIsOpen(false);
    setSearchQuery("");
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

  /**
   * The shared keyboard model. Space is the one key this component decides for
   * itself: with the search box open it is a character, otherwise it commits.
   */
  const {
    activeIndex: focusedIndex,
    setActiveIndex: setFocusedIndex,
    onKeyDown: onMenuKeyDown,
  } = useMenuNavigation<MultiSelectOption>({
    items: displayOptions,
    isOpen,
    isDisabled: (option) => !!option.disabled,
    onSelect: handleOptionToggle,
    typeahead: { getLabel: (option) => option.label, timeout: typeaheadTimeout },
    onOpen: handleToggle,
    onClose: (reason) => {
      // Tab already closes through blur; calling handleClose as well would set
      // the restore-focus flag and pull focus back to the control the user is
      // tabbing away from.
      if (reason === "escape") handleClose();
    },
  });

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (disabled) return;

      // The search box owns typing only while it has focus. Keys arriving at
      // the trigger still commit on Space and still run type-ahead, which is
      // how SearchableDropdown has always split the two.
      const inSearchField =
        (event.target as HTMLElement | null)?.tagName === "INPUT" && showSearch && isOpen;
      if (
        inSearchField &&
        (event.key === " " ||
          (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey))
      ) {
        return;
      }

      onMenuKeyDown(event);
    },
    [disabled, isOpen, showSearch, onMenuKeyDown],
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
