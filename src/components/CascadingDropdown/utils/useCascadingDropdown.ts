import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import type {
  CascadingOption,
  CascadingValue,
  UseCascadingDropdownProps,
  UseCascadingDropdownReturn,
} from "./types";
import { useControllableState } from "../../../utils/useControllableState";

export const useCascadingDropdown = ({
  options,
  value,
  defaultValue,
  disabled = false,
  closeOnSelect = true,
  onValueChange,
  onLoadChildren,
  onLoadError,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  label,
  "aria-label": ariaLabel,
}: UseCascadingDropdownProps): UseCascadingDropdownReturn => {
  const [internalValue, setInternalValue] = useControllableState<CascadingValue>({
    value,
    defaultValue: defaultValue ?? {},
    onChange: () => {
      // onChange with path is handled directly in updateValue
    },
  });

  const [isOpen, setIsOpen] = useControllableState<boolean>({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [submenuFocusedIndex, setSubmenuFocusedIndex] = useState(-1);
  const [loadingChildren, setLoadingChildren] = useState<Record<string, boolean>>({});
  const [loadedChildren, setLoadedChildren] = useState<Record<string, CascadingOption[]>>({});
  const submenuTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isHoveringSubmenuRef = useRef(false);

  // Accessibility dev warning for missing label/aria-label
  const warnedRef = useRef(false);
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" && !warnedRef.current) {
      if (!label && !ariaLabel) {
        warnedRef.current = true;
        console.warn(
          "[CascadingDropdown] Missing accessible name. Provide either a `label` or `aria-label` prop " +
          "so that screen readers can identify this dropdown."
        );
      }
    }
  }, [label, ariaLabel]);

  const clearSubmenuTimeout = useCallback(() => {
    if (submenuTimeoutRef.current) {
      clearTimeout(submenuTimeoutRef.current);
      submenuTimeoutRef.current = null;
    }
  }, []);

  const handleToggle = useCallback(() => {
    if (!disabled) {
      setIsOpen((prev) => !prev);
      setFocusedIndex(-1);
      setActiveSubmenu(null);
      setSubmenuFocusedIndex(-1);
    }
  }, [disabled, setIsOpen]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setFocusedIndex(-1);
    setActiveSubmenu(null);
    setSubmenuFocusedIndex(-1);
    clearSubmenuTimeout();
  }, [clearSubmenuTimeout, setIsOpen]);

  const updateValue = useCallback(
    (newValue: CascadingValue, path: CascadingOption[]) => {
      setInternalValue(newValue);
      onValueChange?.(newValue, path);
    },
    [setInternalValue, onValueChange]
  );

  const loadChildrenForOption = useCallback(
    async (option: CascadingOption) => {
      if (!onLoadChildren) return;
      if (loadedChildren[option.value]) return;
      if (loadingChildren[option.value]) return;

      setLoadingChildren((prev) => ({ ...prev, [option.value]: true }));

      try {
        const children = await onLoadChildren(option);
        setLoadedChildren((prev) => ({ ...prev, [option.value]: children }));
      } catch (error: unknown) {
        onLoadError?.(error);
      } finally {
        setLoadingChildren((prev) => ({ ...prev, [option.value]: false }));
      }
    },
    [onLoadChildren, loadedChildren, loadingChildren, onLoadError]
  );

  const handleMenuItemHover = useCallback(
    (option: CascadingOption, index: number) => {
      setFocusedIndex(index);
      clearSubmenuTimeout();

      const hasStaticChildren = option.children && option.children.length > 0;
      const hasLoadedChildren = loadedChildren[option.value]?.length > 0;
      const canLoadChildren = option.hasChildren && onLoadChildren && !loadedChildren[option.value];

      if (hasStaticChildren || hasLoadedChildren || canLoadChildren) {
        setActiveSubmenu(option.value);
        setSubmenuFocusedIndex(-1);

        if (canLoadChildren) {
          loadChildrenForOption(option);
        }
      } else if (!isHoveringSubmenuRef.current) {
        submenuTimeoutRef.current = setTimeout(() => {
          if (!isHoveringSubmenuRef.current) {
            setActiveSubmenu(null);
            setSubmenuFocusedIndex(-1);
          }
        }, 150);
      }
    },
    [clearSubmenuTimeout, loadedChildren, onLoadChildren, loadChildrenForOption]
  );

  const handleMenuItemClick = useCallback(
    (option: CascadingOption) => {
      if (option.disabled) return;

      if (!option.children || option.children.length === 0) {
        const newValue = { ...internalValue, root: option.value };
        updateValue(newValue, [option]);
        if (closeOnSelect) {
          handleClose();
        }
      }
    },
    [internalValue, updateValue, closeOnSelect, handleClose]
  );

  const handleSubmenuItemClick = useCallback(
    (parent: CascadingOption, option: CascadingOption) => {
      if (option.disabled) return;

      const selectionMode = parent.selectionMode || "single";
      const currentSelection = internalValue[parent.value];

      let newSelection: string | string[];

      if (selectionMode === "multi") {
        const currentArray = Array.isArray(currentSelection)
          ? currentSelection
          : currentSelection
          ? [currentSelection]
          : [];

        if (currentArray.includes(option.value)) {
          newSelection = currentArray.filter((v) => v !== option.value);
        } else {
          newSelection = [...currentArray, option.value];
        }
      } else {
        newSelection = option.value;
      }

      const newValue = { ...internalValue, [parent.value]: newSelection };
      updateValue(newValue, [parent, option]);

      if (closeOnSelect && selectionMode === "single") {
        handleClose();
      }
    },
    [internalValue, updateValue, closeOnSelect, handleClose]
  );

  const handleSubmenuItemHover = useCallback((index: number) => {
    setSubmenuFocusedIndex(index);
  }, []);

  const handleSubmenuMouseEnter = useCallback(() => {
    isHoveringSubmenuRef.current = true;
    clearSubmenuTimeout();
  }, [clearSubmenuTimeout]);

  const handleSubmenuMouseLeave = useCallback(() => {
    isHoveringSubmenuRef.current = false;
  }, []);

  const getActiveParent = useCallback((): CascadingOption | null => {
    if (!activeSubmenu) return null;
    const option = options.find((opt) => opt.value === activeSubmenu);
    if (!option) return null;

    const dynamicChildren = loadedChildren[option.value];
    if (dynamicChildren) {
      return { ...option, children: dynamicChildren };
    }
    return option;
  }, [activeSubmenu, options, loadedChildren]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (disabled) return;

      const activeParent = getActiveParent();
      const submenuOptions = activeParent?.children || [];
      const isInSubmenu = activeSubmenu && submenuFocusedIndex >= 0;

      switch (event.key) {
        case "Enter":
        case " ":
          event.preventDefault();
          if (isInSubmenu && submenuOptions[submenuFocusedIndex]) {
            handleSubmenuItemClick(
              activeParent!,
              submenuOptions[submenuFocusedIndex]
            );
          } else if (focusedIndex >= 0 && options[focusedIndex]) {
            const option = options[focusedIndex];
            if (option.children && option.children.length > 0) {
              setActiveSubmenu(option.value);
              setSubmenuFocusedIndex(0);
            } else {
              handleMenuItemClick(option);
            }
          } else if (!isOpen) {
            handleToggle();
          }
          break;

        case "Escape":
          event.preventDefault();
          if (isInSubmenu) {
            setSubmenuFocusedIndex(-1);
            setActiveSubmenu(null);
          } else if (isOpen) {
            handleClose();
          }
          break;

        case "ArrowDown":
          event.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
            setFocusedIndex(0);
          } else if (isInSubmenu) {
            setSubmenuFocusedIndex((prev) => {
              const next = prev < submenuOptions.length - 1 ? prev + 1 : 0;
              for (let i = next; i < submenuOptions.length; i++) {
                if (!submenuOptions[i].disabled) return i;
              }
              for (let i = 0; i < next; i++) {
                if (!submenuOptions[i].disabled) return i;
              }
              return prev;
            });
          } else {
            setFocusedIndex((prev) => {
              const next = prev < options.length - 1 ? prev + 1 : 0;
              for (let i = next; i < options.length; i++) {
                if (!options[i].disabled) return i;
              }
              for (let i = 0; i < next; i++) {
                if (!options[i].disabled) return i;
              }
              return prev;
            });
          }
          break;

        case "ArrowUp":
          event.preventDefault();
          if (isOpen) {
            if (isInSubmenu) {
              setSubmenuFocusedIndex((prev) => {
                const next = prev > 0 ? prev - 1 : submenuOptions.length - 1;
                for (let i = next; i >= 0; i--) {
                  if (!submenuOptions[i].disabled) return i;
                }
                for (let i = submenuOptions.length - 1; i > next; i--) {
                  if (!submenuOptions[i].disabled) return i;
                }
                return prev;
              });
            } else {
              setFocusedIndex((prev) => {
                const next = prev > 0 ? prev - 1 : options.length - 1;
                for (let i = next; i >= 0; i--) {
                  if (!options[i].disabled) return i;
                }
                for (let i = options.length - 1; i > next; i--) {
                  if (!options[i].disabled) return i;
                }
                return prev;
              });
            }
          }
          break;

        case "ArrowRight":
          event.preventDefault();
          if (isOpen && focusedIndex >= 0) {
            const option = options[focusedIndex];
            if (option.children && option.children.length > 0) {
              setActiveSubmenu(option.value);
              setSubmenuFocusedIndex(0);
            }
          }
          break;

        case "ArrowLeft":
          event.preventDefault();
          if (isInSubmenu) {
            setSubmenuFocusedIndex(-1);
            setActiveSubmenu(null);
          }
          break;

        case "Home":
          event.preventDefault();
          if (isOpen) {
            if (isInSubmenu) {
              const firstEnabled = submenuOptions.findIndex((o) => !o.disabled);
              if (firstEnabled !== -1) setSubmenuFocusedIndex(firstEnabled);
            } else {
              const firstEnabled = options.findIndex((o) => !o.disabled);
              if (firstEnabled !== -1) setFocusedIndex(firstEnabled);
            }
          }
          break;

        case "End":
          event.preventDefault();
          if (isOpen) {
            if (isInSubmenu) {
              for (let i = submenuOptions.length - 1; i >= 0; i--) {
                if (!submenuOptions[i].disabled) {
                  setSubmenuFocusedIndex(i);
                  break;
                }
              }
            } else {
              for (let i = options.length - 1; i >= 0; i--) {
                if (!options[i].disabled) {
                  setFocusedIndex(i);
                  break;
                }
              }
            }
          }
          break;

        case "Tab":
          handleClose();
          break;
      }
    },
    [
      disabled,
      isOpen,
      focusedIndex,
      activeSubmenu,
      submenuFocusedIndex,
      options,
      getActiveParent,
      handleToggle,
      handleClose,
      handleMenuItemClick,
      handleSubmenuItemClick,
      setIsOpen,
    ]
  );

  const getDisplayValue = useCallback((): string => {
    const parts: string[] = [];

    for (const option of options) {
      if (internalValue.root === option.value) {
        parts.push(option.label);
        break;
      }

      const selection = internalValue[option.value];
      if (selection) {
        const selectedLabels: string[] = [];
        const values = Array.isArray(selection) ? selection : [selection];
        const children = loadedChildren[option.value] || option.children || [];

        for (const val of values) {
          const child = children.find((c) => c.value === val);
          if (child) {
            selectedLabels.push(child.label);
          }
        }

        if (selectedLabels.length > 0) {
          parts.push(`${option.label}: ${selectedLabels.join(", ")}`);
        }
      }
    }

    return parts.join(" | ");
  }, [options, internalValue, loadedChildren]);

  const isSubmenuOpen = useCallback(
    (value: string) => activeSubmenu === value,
    [activeSubmenu]
  );

  return useMemo(
    () => ({
      isOpen,
      internalValue,
      focusedIndex,
      activeSubmenu,
      submenuFocusedIndex,
      loadingChildren,
      loadedChildren,
      setFocusedIndex,
      setSubmenuFocusedIndex,
      handleToggle,
      handleClose,
      handleMenuItemHover,
      handleMenuItemClick,
      handleSubmenuItemClick,
      handleSubmenuItemHover,
      handleSubmenuMouseEnter,
      handleSubmenuMouseLeave,
      handleKeyDown,
      getDisplayValue,
      isSubmenuOpen,
    }),
    [
      isOpen,
      internalValue,
      focusedIndex,
      activeSubmenu,
      submenuFocusedIndex,
      loadingChildren,
      loadedChildren,
      handleToggle,
      handleClose,
      handleMenuItemHover,
      handleMenuItemClick,
      handleSubmenuItemClick,
      handleSubmenuItemHover,
      handleSubmenuMouseEnter,
      handleSubmenuMouseLeave,
      handleKeyDown,
      getDisplayValue,
      isSubmenuOpen,
    ]
  );
};
