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
  value: valueProp,
  defaultValue: defaultValueProp,
  disabled = false,
  onValueChange,
  loadOptions,
  loadOnOpen = false,
  onLoadError,
  typeaheadTimeout = 500,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
}: UseMultiSelectDropdownProps): UseMultiSelectDropdownReturn {
  const [value, setValue, resetValue] = useControllableState<string[]>({
    value: valueProp,
    defaultValue: defaultValueProp ?? [],
  });

  const [isOpen, setIsOpen] = useControllableState<boolean>({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

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
  const [prevLoadConfig, setPrevLoadConfig] = useState({ loadOptions, loadOnOpen });
  if (
    prevLoadConfig.loadOptions !== loadOptions ||
    prevLoadConfig.loadOnOpen !== loadOnOpen
  ) {
    setPrevLoadConfig({ loadOptions, loadOnOpen });
    if (hasLoaded) setHasLoaded(false);
  }

  const displayOptions = useMemo(() => {
    if (loadOptions && loadedOptions.length > 0) {
      return loadedOptions;
    }
    return options;
  }, [options, loadedOptions, loadOptions]);

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
  const shouldLoad = isOpen && loadOnOpen && !!loadOptions && !hasLoaded;

  // Adjusted during render rather than from the effect, which would be a
  // cascading render.
  const [prevShouldLoad, setPrevShouldLoad] = useState(false);
  if (prevShouldLoad !== shouldLoad) {
    setPrevShouldLoad(shouldLoad);
    if (shouldLoad) setIsLoadingOptions(true);
  }

  useEffect(() => {
    if (!shouldLoad || !loadOptions) return;

    let cancelled = false;
    isLoadingRef.current = true;
    loadOptions()
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
  }, [shouldLoad, loadOptions, onLoadError]);

  // The active index is not reset here: `useMenuNavigation` clears it whenever
  // the surface closes, so doing it again from the toggle would be a second
  // owner of the same state.
  const handleToggle = useCallback(() => {
    if (disabled) return;
    setIsOpen((prev: boolean) => !prev);
  }, [disabled, setIsOpen]);

  const handleClose = useCallback(() => {
    shouldRestoreFocusRef.current = true;
    setIsOpen(false);
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

  /**
   * The shared keyboard model. This component's list is exactly the shape the
   * primitive describes — wrap at the ends, skip disabled, Enter and Space
   * commit, Home and End to the enabled extremes — so there is nothing left
   * here but the two things that are its own: refusing keys while disabled, and
   * what "commit" means for a multi-select.
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
      // Tab is already closing the surface through blur; calling handleClose
      // would additionally set the restore-focus flag and pull focus back to
      // the trigger the user is tabbing away from.
      if (reason === "escape") handleClose();
    },
  });

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (disabled) return;
      onMenuKeyDown(event);
    },
    [disabled, onMenuKeyDown],
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
    resetValue,
  };
}
