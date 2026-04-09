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
  showMenuSearch = false,
  showSubmenuSearch = false,
  onMenuSearch,
  onSubmenuSearch,
  searchDebounceMs = 300,
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

  // ─── Search state ─────────────────────────────────────────────────
  const [menuSearchQuery, setMenuSearchQuery] = useState("");
  const [submenuSearchQuery, setSubmenuSearchQuery] = useState("");
  const [isMenuSearching, setIsMenuSearching] = useState(false);
  const [isSubmenuSearching, setIsSubmenuSearching] = useState(false);
  const [asyncMenuResults, setAsyncMenuResults] = useState<CascadingOption[] | null>(null);
  const [asyncSubmenuResults, setAsyncSubmenuResults] = useState<CascadingOption[] | null>(null);
  const menuSearchVersionRef = useRef(0);
  const submenuSearchVersionRef = useRef(0);

  // ─── Menu search: useEffect-based debounce (matches SearchableDropdown pattern)
  const hasActiveMenuSearch = !!onMenuSearch && !!menuSearchQuery.trim();

  useEffect(() => {
    if (!hasActiveMenuSearch) {
      setIsMenuSearching(false);
      setAsyncMenuResults(null);
      return;
    }
    setIsMenuSearching(true);
    const currentVersion = ++menuSearchVersionRef.current;

    const timer = setTimeout(() => {
      onMenuSearch!(menuSearchQuery)
        .then((results) => {
          if (menuSearchVersionRef.current === currentVersion) {
            setAsyncMenuResults(results);
          }
        })
        .catch(() => {
          if (menuSearchVersionRef.current === currentVersion) {
            setAsyncMenuResults(null);
          }
        })
        .finally(() => {
          if (menuSearchVersionRef.current === currentVersion) {
            setIsMenuSearching(false);
          }
        });
    }, searchDebounceMs);

    return () => clearTimeout(timer);
  }, [hasActiveMenuSearch, menuSearchQuery, onMenuSearch, searchDebounceMs]);

  // ─── Submenu search: useEffect-based debounce
  const activeSubmenuParent = useMemo(
    () => (activeSubmenu ? options.find((opt) => opt.value === activeSubmenu) ?? null : null),
    [activeSubmenu, options],
  );
  const hasActiveSubmenuSearch = !!onSubmenuSearch && !!submenuSearchQuery.trim() && !!activeSubmenuParent;

  useEffect(() => {
    if (!hasActiveSubmenuSearch || !activeSubmenuParent) {
      setIsSubmenuSearching(false);
      setAsyncSubmenuResults(null);
      return;
    }
    setIsSubmenuSearching(true);
    const currentVersion = ++submenuSearchVersionRef.current;
    const parent = activeSubmenuParent;

    const timer = setTimeout(() => {
      onSubmenuSearch!(submenuSearchQuery, parent)
        .then((results) => {
          if (submenuSearchVersionRef.current === currentVersion) {
            setAsyncSubmenuResults(results);
          }
        })
        .catch(() => {
          if (submenuSearchVersionRef.current === currentVersion) {
            setAsyncSubmenuResults(null);
          }
        })
        .finally(() => {
          if (submenuSearchVersionRef.current === currentVersion) {
            setIsSubmenuSearching(false);
          }
        });
    }, searchDebounceMs);

    return () => clearTimeout(timer);
  }, [hasActiveSubmenuSearch, submenuSearchQuery, onSubmenuSearch, searchDebounceMs, activeSubmenuParent]);

  // ─── Derived filtered options ─────────────────────────────────────
  const isMenuAsync = !!onMenuSearch;
  const filteredOptions = useMemo(() => {
    if (isMenuAsync) {
      // Async mode: show async results when searching, otherwise show all options
      if (menuSearchQuery.trim()) {
        return asyncMenuResults ?? options;
      }
      return options;
    }
    if (!showMenuSearch || !menuSearchQuery.trim()) {
      return options;
    }
    // Client-side filter
    const q = menuSearchQuery.toLowerCase();
    return options.filter((opt) => opt.label.toLowerCase().includes(q));
  }, [isMenuAsync, showMenuSearch, menuSearchQuery, options, asyncMenuResults]);

  const isSubmenuAsync = !!onSubmenuSearch;
  const getFilteredSubmenuOptions = useCallback(
    (parent: CascadingOption): CascadingOption[] => {
      const dynamicChildren = loadedChildren[parent.value];
      const children = dynamicChildren && dynamicChildren.length > 0 ? dynamicChildren : parent.children || [];

      if (isSubmenuAsync) {
        if (submenuSearchQuery.trim()) {
          return asyncSubmenuResults ?? children;
        }
        return children;
      }
      if (!showSubmenuSearch || !submenuSearchQuery.trim()) {
        return children;
      }
      const q = submenuSearchQuery.toLowerCase();
      return children.filter((opt) => opt.label.toLowerCase().includes(q));
    },
    [isSubmenuAsync, showSubmenuSearch, submenuSearchQuery, asyncSubmenuResults, loadedChildren],
  );

  // ─── Search change handlers (simple state setters) ────────────────
  const onMenuSearchChange = useCallback(
    (query: string) => {
      setMenuSearchQuery(query);
      setFocusedIndex(-1);
    },
    [],
  );

  const onSubmenuSearchChange = useCallback(
    (query: string) => {
      setSubmenuSearchQuery(query);
      setSubmenuFocusedIndex(-1);
    },
    [],
  );

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
      setMenuSearchQuery("");
      setSubmenuSearchQuery("");
      setAsyncMenuResults(null);
      setAsyncSubmenuResults(null);
    }
  }, [disabled, setIsOpen]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setFocusedIndex(-1);
    setActiveSubmenu(null);
    setSubmenuFocusedIndex(-1);
    setMenuSearchQuery("");
    setSubmenuSearchQuery("");
    setAsyncMenuResults(null);
    setAsyncSubmenuResults(null);
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
        setSubmenuSearchQuery("");
        setAsyncSubmenuResults(null);

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
      const submenuOpts = activeParent ? getFilteredSubmenuOptions(activeParent) : [];
      const isInSubmenu = activeSubmenu && submenuFocusedIndex >= 0;
      const menuOpts = filteredOptions;

      switch (event.key) {
        case "Enter":
        case " ":
          event.preventDefault();
          if (isInSubmenu && submenuOpts[submenuFocusedIndex]) {
            handleSubmenuItemClick(
              activeParent!,
              submenuOpts[submenuFocusedIndex]
            );
          } else if (focusedIndex >= 0 && menuOpts[focusedIndex]) {
            const option = menuOpts[focusedIndex];
            const dynamicChildren = loadedChildren[option.value] || [];
            const staticChildren = option.children || [];
            const hasSubmenu = dynamicChildren.length > 0 || staticChildren.length > 0 || option.hasChildren;
            if (hasSubmenu) {
              setActiveSubmenu(option.value);
              setSubmenuFocusedIndex(0);
              if (option.hasChildren && !loadedChildren[option.value]) {
                loadChildrenForOption(option);
              }
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
              const next = prev < submenuOpts.length - 1 ? prev + 1 : 0;
              for (let i = next; i < submenuOpts.length; i++) {
                if (!submenuOpts[i].disabled) return i;
              }
              for (let i = 0; i < next; i++) {
                if (!submenuOpts[i].disabled) return i;
              }
              return prev;
            });
          } else {
            setFocusedIndex((prev) => {
              const next = prev < menuOpts.length - 1 ? prev + 1 : 0;
              for (let i = next; i < menuOpts.length; i++) {
                if (!menuOpts[i].disabled) return i;
              }
              for (let i = 0; i < next; i++) {
                if (!menuOpts[i].disabled) return i;
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
                const next = prev > 0 ? prev - 1 : submenuOpts.length - 1;
                for (let i = next; i >= 0; i--) {
                  if (!submenuOpts[i].disabled) return i;
                }
                for (let i = submenuOpts.length - 1; i > next; i--) {
                  if (!submenuOpts[i].disabled) return i;
                }
                return prev;
              });
            } else {
              setFocusedIndex((prev) => {
                const next = prev > 0 ? prev - 1 : menuOpts.length - 1;
                for (let i = next; i >= 0; i--) {
                  if (!menuOpts[i].disabled) return i;
                }
                for (let i = menuOpts.length - 1; i > next; i--) {
                  if (!menuOpts[i].disabled) return i;
                }
                return prev;
              });
            }
          }
          break;

        case "ArrowRight":
          event.preventDefault();
          if (isOpen && focusedIndex >= 0) {
            const option = menuOpts[focusedIndex];
            if (option?.children && option.children.length > 0) {
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
              const firstEnabled = submenuOpts.findIndex((o) => !o.disabled);
              if (firstEnabled !== -1) setSubmenuFocusedIndex(firstEnabled);
            } else {
              const firstEnabled = menuOpts.findIndex((o) => !o.disabled);
              if (firstEnabled !== -1) setFocusedIndex(firstEnabled);
            }
          }
          break;

        case "End":
          event.preventDefault();
          if (isOpen) {
            if (isInSubmenu) {
              for (let i = submenuOpts.length - 1; i >= 0; i--) {
                if (!submenuOpts[i].disabled) {
                  setSubmenuFocusedIndex(i);
                  break;
                }
              }
            } else {
              for (let i = menuOpts.length - 1; i >= 0; i--) {
                if (!menuOpts[i].disabled) {
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
      filteredOptions,
      getActiveParent,
      getFilteredSubmenuOptions,
      handleToggle,
      handleClose,
      handleMenuItemClick,
      handleSubmenuItemClick,
      setIsOpen,
      loadedChildren,
      loadChildrenForOption,
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
      filteredOptions,
      menuSearchQuery,
      onMenuSearchChange,
      submenuSearchQuery,
      onSubmenuSearchChange,
      isMenuSearching,
      isSubmenuSearching,
      getFilteredSubmenuOptions,
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
      filteredOptions,
      menuSearchQuery,
      onMenuSearchChange,
      submenuSearchQuery,
      onSubmenuSearchChange,
      isMenuSearching,
      isSubmenuSearching,
      getFilteredSubmenuOptions,
    ]
  );
};
