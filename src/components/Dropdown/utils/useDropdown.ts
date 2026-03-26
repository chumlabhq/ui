import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import type { DropdownOption } from "./types";
import { useControllableState } from "../../../utils/useControllableState";
import { useIsomorphicLayoutEffect } from "../../../utils/useIsomorphicLayoutEffect";

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
  label,
  "aria-label": ariaLabel,
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

  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);
  const [loadedOptions, setLoadedOptions] = useState<DropdownOption[]>([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [hasLoaded, setHasLoaded] = useState(false);

  const hasLoadedRef = useRef(false);
  const mountedRef = useRef(true);
  const isLoadingRef = useRef(false);
  const typeaheadRef = useRef("");
  const typeaheadTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const shouldRestoreFocusRef = useRef(false);

  const displayOptionsRef = useRef<DropdownOption[]>([]);

  // Accessibility dev warning for missing label/aria-label
  const warnedRef = useRef(false);
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" && !warnedRef.current) {
      if (!label && !ariaLabel) {
        warnedRef.current = true;
        console.warn(
          "[Dropdown] Missing accessible name. Provide either a `label` or `aria-label` prop " +
          "so that screen readers can identify this dropdown."
        );
      }
    }
  }, [label, ariaLabel]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (typeaheadTimerRef.current) {
        clearTimeout(typeaheadTimerRef.current);
      }
    };
  }, []);

  const [prevLoadOptions, setPrevLoadOptions] = useState(onLoadOptions);
  if (prevLoadOptions !== onLoadOptions) {
    setPrevLoadOptions(onLoadOptions);
    setHasLoaded(false);
    setLoadedOptions([]);
  }

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

  const loadOptions = useCallback(() => {
    if (!loadOnOpen || !onLoadOptions || hasLoadedRef.current || isLoadingRef.current) {
      return;
    }

    isLoadingRef.current = true;
    setIsLoadingOptions(true);
    setStatusMessage("Loading...");

    onLoadOptions()
      .then((results) => {
        if (mountedRef.current) {
          setLoadedOptions(results);
          setFocusedIndex(-1);
          hasLoadedRef.current = true;
          setHasLoaded(true);
          setStatusMessage(
            results.length === 0
              ? "No options available"
              : `${results.length} option${results.length === 1 ? "" : "s"} available`,
          );
        }
      })
      .catch((error) => {
        if (mountedRef.current) {
          onLoadError?.(error);
          setStatusMessage("Failed to load options");
        }
      })
      .finally(() => {
        isLoadingRef.current = false;
        if (mountedRef.current) {
          setIsLoadingOptions(false);
        }
      });
  }, [loadOnOpen, onLoadOptions, onLoadError]);

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
    loadOptions();

    if (!loadOnOpen || !onLoadOptions) {
      const count = displayOptions.length;
      setStatusMessage(
        count === 0
          ? "No options available"
          : `${count} option${count === 1 ? "" : "s"} available`,
      );
    }
  }, [disabled, setIsOpen, loadOptions, getInitialFocusIndex, loadOnOpen, onLoadOptions, displayOptions.length]);

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
      loadOptions();
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
  }, [disabled, setIsOpen, loadOptions, getInitialFocusIndex, loadOnOpen, onLoadOptions, displayOptions.length]);

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

  const activeDescendantId = useMemo(() => {
    if (isOpen && focusedIndex >= 0 && focusedIndex < displayOptions.length) {
      return `${dropdownId}-option-${focusedIndex}`;
    }
    return undefined;
  }, [isOpen, focusedIndex, displayOptions.length, dropdownId]);

  const findOptionByTypeahead = useCallback(
    (char: string): number => {
      typeaheadRef.current += char.toLowerCase();

      if (typeaheadTimerRef.current) {
        clearTimeout(typeaheadTimerRef.current);
      }
      typeaheadTimerRef.current = setTimeout(() => {
        typeaheadRef.current = "";
      }, typeaheadTimeout);

      const searchStr = typeaheadRef.current;
      const startIndex = focusedIndex >= 0 ? focusedIndex + 1 : 0;

      for (let i = 0; i < displayOptions.length; i++) {
        const idx = (startIndex + i) % displayOptions.length;
        const option = displayOptions[idx];
        if (!option.disabled && option.label.toLowerCase().startsWith(searchStr)) {
          return idx;
        }
      }

      if (searchStr.length > 1) {
        const singleChar = char.toLowerCase();
        for (let i = 0; i < displayOptions.length; i++) {
          const idx = (startIndex + i) % displayOptions.length;
          const option = displayOptions[idx];
          if (!option.disabled && option.label.toLowerCase().startsWith(singleChar)) {
            return idx;
          }
        }
      }

      return -1;
    },
    [displayOptions, focusedIndex, typeaheadTimeout],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (disabled) return;

      switch (event.key) {
        case "Enter":
        case " ":
          event.preventDefault();
          if (isOpen && focusedIndex >= 0 && focusedIndex < displayOptions.length) {
            handleOptionSelect(displayOptions[focusedIndex]);
          } else if (!isOpen) {
            handleOpen();
          }
          break;
        case "Escape":
          if (isOpen) {
            event.preventDefault();
            handleClose();
            shouldRestoreFocusRef.current = true;
          }
          break;
        case "ArrowDown":
          event.preventDefault();
          if (!isOpen) {
            handleOpen();
            const firstEnabled = displayOptions.findIndex((o) => !o.disabled);
            setFocusedIndex(firstEnabled >= 0 ? firstEnabled : 0);
          } else {
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
          break;
        case "ArrowUp":
          event.preventDefault();
          if (!isOpen) {
            handleOpen();
            let lastEnabled = -1;
            for (let i = displayOptions.length - 1; i >= 0; i--) {
              if (!displayOptions[i].disabled) {
                lastEnabled = i;
                break;
              }
            }
            setFocusedIndex(lastEnabled >= 0 ? lastEnabled : displayOptions.length - 1);
          } else {
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
          break;
        case "Home":
          if (isOpen) {
            event.preventDefault();
            const first = displayOptions.findIndex((o) => !o.disabled);
            if (first !== -1) setFocusedIndex(first);
          }
          break;
        case "End":
          if (isOpen) {
            event.preventDefault();
            for (let i = displayOptions.length - 1; i >= 0; i--) {
              if (!displayOptions[i].disabled) {
                setFocusedIndex(i);
                break;
              }
            }
          }
          break;
        case "Tab":
          if (isOpen) {
            handleClose();
          }
          break;
        case "Delete":
        case "Backspace":
          if (clearable && currentValue) {
            event.preventDefault();
            handleClear();
          }
          break;
        default:
          if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
            if (!isOpen) {
              handleOpen();
            }
            const idx = findOptionByTypeahead(event.key);
            if (idx !== -1) {
              setFocusedIndex(idx);
            }
          }
          break;
      }
    },
    [disabled, isOpen, focusedIndex, displayOptions, handleOpen, handleClose, handleOptionSelect, findOptionByTypeahead, clearable, currentValue, handleClear],
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
    handleOpen,
    handleClose,
    handleOptionSelect,
    handleClear,
    handleKeyDown,
  };
};
