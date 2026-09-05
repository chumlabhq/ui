import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { useMenuNavigation } from "../../../utils/menu/useMenuNavigation.js";
import type { DropdownOption } from "./types.js";
import { useControllableState } from "../../../utils/useControllableState.js";
import { useIsomorphicLayoutEffect } from "../../../utils/useIsomorphicLayoutEffect.js";

interface UseDropdownProps {
  options: DropdownOption[];
  value?: string | null;
  defaultValue?: string;
  disabled: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  clearable?: boolean;
  onValueChange?: (value: string | null, option: DropdownOption | null) => void;
  onOpenChange?: (open: boolean) => void;
  onLoadOptions?: () => Promise<DropdownOption[]>;
  loadOnOpen?: boolean;
  onLoadError?: (error: unknown) => void;
  dropdownId: string;
  typeaheadTimeout?: number;
  label?: React.ReactNode;
  "aria-label"?: string;
  loadingText?: React.ReactNode;
}

export const useDropdown = ({
  options,
  value: valueProp,
  defaultValue,
  disabled,
  open: openProp,
  defaultOpen,
  clearable = false,
  onValueChange,
  onOpenChange,
  onLoadOptions,
  loadOnOpen = false,
  onLoadError,
  dropdownId,
  typeaheadTimeout = 500,
  loadingText = "Loading...",
}: UseDropdownProps) => {
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
    defaultValue: defaultOpen ?? false,
    onChange: onOpenChange,
  });

  const [isLoadingOptions, setIsLoadingOptions] = useState(false);
  // Owned here rather than by `useMenuNavigation`: the callbacks below reset
  // it and are declared before the hook runs.
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const [loadedOptions, setLoadedOptions] = useState<DropdownOption[]>([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [hasLoaded, setHasLoaded] = useState(false);

  const hasLoadedRef = useRef(false);
  const mountedRef = useRef(true);
  const isLoadingRef = useRef(false);
  const shouldRestoreFocusRef = useRef(false);

  const displayOptionsRef = useRef<DropdownOption[]>([]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Reset loaded state when onLoadOptions function changes
  const prevLoadOptionsRef = useRef(onLoadOptions);
  useIsomorphicLayoutEffect(() => {
    if (prevLoadOptionsRef.current !== onLoadOptions) {
      prevLoadOptionsRef.current = onLoadOptions;
      hasLoadedRef.current = false;
      setHasLoaded(false);
      setLoadedOptions([]);
    }
  });

  // Sync hasLoadedRef after render to match hasLoaded state
  useIsomorphicLayoutEffect(() => {
    hasLoadedRef.current = hasLoaded;
  });

  const displayOptions = useMemo(() => {
    if (loadOnOpen && onLoadOptions && hasLoaded) {
      return loadedOptions;
    }
    return options;
  }, [options, loadedOptions, loadOnOpen, onLoadOptions, hasLoaded]);

  // Keep ref in sync for use in onChange callback
  useEffect(() => {
    displayOptionsRef.current = displayOptions;
  }, [displayOptions]);

  const selectedOption = useMemo(
    () => displayOptions.find((option) => option.value === currentValue) || null,
    [displayOptions, currentValue],
  );

  /**
   * Whether the menu should be fetching right now.
   *
   * Derived from `isOpen` rather than called from `handleOpen`/`handleToggle`.
   * `defaultOpen` and a controlled `open` both reach the open state without
   * either handler running, so the handler-driven version left those consumers
   * with a menu that never populated and never retried. This is the shape the
   * two searchable dropdowns already used; the four now agree.
   */
  const shouldLoad = isOpen && loadOnOpen && !!onLoadOptions && !hasLoaded;

  // Loading state is adjusted during render, not from the effect below.
  // Setting it inside the effect is a cascading render — the effect would
  // schedule a second pass before the first had painted — and the searchable
  // dropdowns derive it exactly this way.
  const [prevShouldLoad, setPrevShouldLoad] = useState(false);
  if (prevShouldLoad !== shouldLoad) {
    setPrevShouldLoad(shouldLoad);
    if (shouldLoad) {
      setIsLoadingOptions(true);
      setStatusMessage(typeof loadingText === "string" ? loadingText : "Loading...");
    }
  }

  useEffect(() => {
    if (!shouldLoad || !onLoadOptions) return;

    let cancelled = false;
    isLoadingRef.current = true;
    onLoadOptions()
      .then((results) => {
        if (cancelled) return;
        setLoadedOptions(results);
        setFocusedIndex(-1);
        hasLoadedRef.current = true;
        setHasLoaded(true);
        setStatusMessage(
          results.length === 0
            ? "No options available"
            : `${results.length} option${results.length === 1 ? "" : "s"} available`,
        );
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        onLoadError?.(error);
        setStatusMessage("Failed to load options");
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

  const getInitialFocusIndex = useCallback(() => {
    if (currentValue) {
      const selectedIdx = displayOptions.findIndex(
        (o) => o.value === currentValue && !o.disabled,
      );
      if (selectedIdx !== -1) return selectedIdx;
    }
    return -1;
  }, [currentValue, displayOptions]);

  const handleOpen = useCallback(() => {
    if (disabled) return;
    setIsOpen(true);
    setFocusedIndex(getInitialFocusIndex());

    if (!loadOnOpen || !onLoadOptions) {
      const count = displayOptions.length;
      setStatusMessage(
        count === 0
          ? "No options available"
          : `${count} option${count === 1 ? "" : "s"} available`,
      );
    }
  }, [disabled, setIsOpen, getInitialFocusIndex, loadOnOpen, onLoadOptions, displayOptions.length]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setFocusedIndex(-1);
    setStatusMessage("");
  }, [setIsOpen]);

  const handleToggle = useCallback(() => {
    if (disabled) return;
    setIsOpen((prev: boolean) => {
      if (prev) {
        setFocusedIndex(-1);
        setStatusMessage("");
        return false;
      }
      setFocusedIndex(getInitialFocusIndex());
      if (!loadOnOpen || !onLoadOptions) {
        const count = displayOptions.length;
        setStatusMessage(
          count === 0
            ? "No options available"
            : `${count} option${count === 1 ? "" : "s"} available`,
        );
      }
      return true;
    });
  }, [disabled, setIsOpen, getInitialFocusIndex, loadOnOpen, onLoadOptions, displayOptions.length]);

  const handleOptionSelect = useCallback(
    (option: DropdownOption) => {
      if (option.disabled) return;

      if (clearable && option.value === currentValue) {
        setCurrentValue(null);
        setIsOpen(false);
        setFocusedIndex(-1);
        shouldRestoreFocusRef.current = true;
        return;
      }

      setCurrentValue(option.value);
      setIsOpen(false);
      setFocusedIndex(-1);
      shouldRestoreFocusRef.current = true;
    },
    [setCurrentValue, setIsOpen, clearable, currentValue],
  );

  const handleClear = useCallback(() => {
    setCurrentValue(null);
  }, [setCurrentValue]);


  /**
   * The shared keyboard model, plus the two behaviours that belong to this
   * component rather than to menus in general: clearing with Delete/Backspace,
   * and opening on the first typed character.
   */
  const {
    onKeyDown: onMenuKeyDown,
  } = useMenuNavigation<DropdownOption>({
    items: displayOptions,
    isOpen,
    activeIndex: focusedIndex,
    onActiveIndexChange: setFocusedIndex,
    isDisabled: (option) => !!option.disabled,
    onSelect: handleOptionSelect,
    onOpen: handleOpen,
    onClose: (reason) => {
      if (reason === "escape") {
        handleClose();
        shouldRestoreFocusRef.current = true;
      } else {
        handleClose();
      }
    },
    typeahead: { getLabel: (option) => option.label, timeout: typeaheadTimeout },
  });

  const activeDescendantId = useMemo(() => {
    if (isOpen && focusedIndex >= 0 && focusedIndex < displayOptions.length) {
      return `${dropdownId}-option-${focusedIndex}`;
    }
    return undefined;
  }, [isOpen, focusedIndex, displayOptions.length, dropdownId]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (disabled) return;

      if (
        (event.key === "Delete" || event.key === "Backspace") &&
        clearable &&
        currentValue
      ) {
        event.preventDefault();
        handleClear();
        return;
      }

      // Typing opens a closed dropdown before the character is searched for,
      // which the shared model does not do: a menu whose trigger is not a text
      // field has no reason to open on an arbitrary key.
      if (
        !isOpen &&
        event.key.length === 1 &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.altKey
      ) {
        handleOpen();
      }

      onMenuKeyDown(event);
    },
    [disabled, isOpen, clearable, currentValue, handleClear, handleOpen, onMenuKeyDown],
  );

  return {
    isOpen,
    focusedIndex,
    isLoadingOptions,
    displayOptions,
    selectedOption,
    currentValue,
    activeDescendantId,
    shouldRestoreFocusRef,
    statusMessage,
    setFocusedIndex,
    handleToggle,
    handleClose,
    handleOptionSelect,
    handleClear,
    handleKeyDown,
  };
};
