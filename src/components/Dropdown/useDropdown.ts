import { useState, useCallback, useMemo, useRef } from "react";
import type { DropdownOption } from "./types";

interface UseDropdownProps {
  options: DropdownOption[];
  value: string | null;
  disabled: boolean;
  onChange: (value: string, option: DropdownOption | null) => void;
  onLoadOptions?: () => Promise<DropdownOption[]>;
  loadOnOpen?: boolean;
}

export const useDropdown = ({
  options,
  value,
  disabled,
  onChange,
  onLoadOptions,
  loadOnOpen = false,
}: UseDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);
  const [loadedOptions, setLoadedOptions] = useState<DropdownOption[]>([]);
  const hasLoadedRef = useRef(false);

  const displayOptions = useMemo(() => {
    if (onLoadOptions && loadedOptions.length > 0) {
      return loadedOptions;
    }
    return options;
  }, [options, loadedOptions, onLoadOptions]);

  const selectedOption = useMemo(
    () => displayOptions.find((option) => option.value === value) || null,
    [displayOptions, value]
  );

  const loadOptions = useCallback(() => {
    if (!loadOnOpen || !onLoadOptions || hasLoadedRef.current || isLoadingOptions) {
      return;
    }

    setIsLoadingOptions(true);
    onLoadOptions()
      .then((results) => {
        setLoadedOptions(results);
        hasLoadedRef.current = true;
      })
      .catch((error) => {
        console.error("Failed to load options:", error);
      })
      .finally(() => {
        setIsLoadingOptions(false);
      });
  }, [loadOnOpen, onLoadOptions, isLoadingOptions]);

  const handleToggle = useCallback(() => {
    if (!disabled) {
      const willOpen = !isOpen;
      setIsOpen(willOpen);
      setFocusedIndex(-1);
      if (willOpen) {
        loadOptions();
      }
    }
  }, [disabled, isOpen, loadOptions]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setFocusedIndex(-1);
  }, []);

  const handleOptionSelect = useCallback(
    (option: DropdownOption) => {
      if (!option.disabled) {
        onChange(option.value, option);
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    },
    [onChange]
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
            handleToggle();
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
            loadOptions();
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
              (option) => !option.disabled
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
    [disabled, isOpen, focusedIndex, displayOptions, handleToggle, handleClose, handleOptionSelect, loadOptions]
  );

  return {
    isOpen,
    focusedIndex,
    isLoadingOptions,
    displayOptions,
    selectedOption,
    setFocusedIndex,
    handleToggle,
    handleClose,
    handleOptionSelect,
    handleKeyDown,
  };
};
