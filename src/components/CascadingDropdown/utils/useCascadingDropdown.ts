import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { useMenuNavigation } from "../../../utils/menu/useMenuNavigation.js";
import type {
  CascadingOption,
  CascadingValue,
  UseCascadingDropdownProps,
  UseCascadingDropdownReturn,
} from "./types.js";
import { useControllableState } from "../../../utils/useControllableState.js";

export const useCascadingDropdown = ({
  options,
  value,
  defaultValue,
  disabled = false,
  closeOnSelect = true,
  onValueChange,
  loadChildren,
  onLoadError,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  showMenuSearch = false,
  showSubmenuSearch = false,
  searchMenu,
  searchSubmenu,
  searchDebounce = 300,
}: UseCascadingDropdownProps): UseCascadingDropdownReturn => {
  const [internalValue, setInternalValue] = useControllableState<CascadingValue>({
    value,
    defaultValue: defaultValue ?? {},
    onChange: () => {
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

  const [menuSearchQuery, setMenuSearchQuery] = useState("");
  const [submenuSearchQuery, setSubmenuSearchQuery] = useState("");
  const [isMenuSearching, setIsMenuSearching] = useState(false);
  const [isSubmenuSearching, setIsSubmenuSearching] = useState(false);
  const [asyncMenuResults, setAsyncMenuResults] = useState<CascadingOption[] | null>(null);
  const [asyncSubmenuResults, setAsyncSubmenuResults] = useState<CascadingOption[] | null>(null);
  const menuSearchVersionRef = useRef(0);
  const submenuSearchVersionRef = useRef(0);

  const hasActiveMenuSearch = !!searchMenu && !!menuSearchQuery.trim();

  useEffect(() => {
    if (!hasActiveMenuSearch) {
      setIsMenuSearching(false);
      setAsyncMenuResults(null);
      return;
    }
    setIsMenuSearching(true);
    const currentVersion = ++menuSearchVersionRef.current;

    const timer = setTimeout(() => {
      searchMenu!(menuSearchQuery)
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
    }, searchDebounce);

    return () => clearTimeout(timer);
  }, [hasActiveMenuSearch, menuSearchQuery, searchMenu, searchDebounce]);

  const activeSubmenuParent = useMemo(
    () => (activeSubmenu ? options.find((opt) => opt.value === activeSubmenu) ?? null : null),
    [activeSubmenu, options],
  );
  const hasActiveSubmenuSearch = !!searchSubmenu && !!submenuSearchQuery.trim() && !!activeSubmenuParent;

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
      searchSubmenu!(submenuSearchQuery, parent)
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
    }, searchDebounce);

    return () => clearTimeout(timer);
  }, [hasActiveSubmenuSearch, submenuSearchQuery, searchSubmenu, searchDebounce, activeSubmenuParent]);

  const isMenuAsync = !!searchMenu;
  const filteredOptions = useMemo(() => {
    if (isMenuAsync) {
      if (menuSearchQuery.trim()) {
        return asyncMenuResults ?? options;
      }
      return options;
    }
    if (!showMenuSearch || !menuSearchQuery.trim()) {
      return options;
    }
    const q = menuSearchQuery.toLowerCase();
    return options.filter((opt) => opt.label.toLowerCase().includes(q));
  }, [isMenuAsync, showMenuSearch, menuSearchQuery, options, asyncMenuResults]);

  const isSubmenuAsync = !!searchSubmenu;
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
      if (!loadChildren) return;
      if (loadedChildren[option.value]) return;
      if (loadingChildren[option.value]) return;

      setLoadingChildren((prev) => ({ ...prev, [option.value]: true }));

      try {
        const children = await loadChildren(option);
        setLoadedChildren((prev) => ({ ...prev, [option.value]: children }));
      } catch (error: unknown) {
        onLoadError?.(error);
      } finally {
        setLoadingChildren((prev) => ({ ...prev, [option.value]: false }));
      }
    },
    [loadChildren, loadedChildren, loadingChildren, onLoadError]
  );

  /**
   * Whether an option opens a submenu instead of committing a value.
   *
   * Three ways to be a parent: declared children, children already fetched, or
   * `hasChildren` with a loader that has not run yet. Hover and click each
   * decided this for themselves and disagreed — click tested `option.children`
   * alone, so a lazy parent was a leaf to it and clicking one committed
   * `{ root: value }` and closed the menu, before and after its children
   * arrived. One predicate, so they cannot drift apart again.
   */
  const isParentOption = useCallback(
    (option: CascadingOption) =>
      (option.children?.length ?? 0) > 0 ||
      (loadedChildren[option.value]?.length ?? 0) > 0 ||
      !!(option.hasChildren && loadChildren),
    [loadedChildren, loadChildren]
  );

  /** Opens a parent's submenu, fetching its children if they are not in yet. */
  const openSubmenuFor = useCallback(
    (option: CascadingOption, enter?: boolean) => {
      setActiveSubmenu(option.value);
      setSubmenuFocusedIndex(enter ? Math.max(0, (loadedChildren[option.value] || option.children || []).findIndex((child) => !child.disabled)) : -1);
      setSubmenuSearchQuery("");
      setAsyncSubmenuResults(null);

      if (option.hasChildren && loadChildren && !loadedChildren[option.value]) {
        loadChildrenForOption(option);
      }
    },
    [loadedChildren, loadChildren, loadChildrenForOption]
  );

  const handleMenuItemHover = useCallback(
    (option: CascadingOption, index: number) => {
      setFocusedIndex(index);
      clearSubmenuTimeout();

      if (isParentOption(option)) {
        openSubmenuFor(option);
      } else if (!isHoveringSubmenuRef.current) {
        submenuTimeoutRef.current = setTimeout(() => {
          if (!isHoveringSubmenuRef.current) {
            setActiveSubmenu(null);
            setSubmenuFocusedIndex(-1);
          }
        }, 150);
      }
    },
    [clearSubmenuTimeout, isParentOption, openSubmenuFor]
  );

  const handleMenuItemClick = useCallback(
    (option: CascadingOption) => {
      if (option.disabled) return;

      // A parent is a way into its submenu, never a value. Pointer users reach
      // it by hover; click has to agree, or the same gesture means "open" on
      // one option and "choose" on another that looks identical.
      if (isParentOption(option)) {
        openSubmenuFor(option);
        return;
      }

      const newValue = { ...internalValue, root: option.value };
      updateValue(newValue, [option]);
      if (closeOnSelect) {
        handleClose();
      }
    },
    [
      internalValue,
      updateValue,
      closeOnSelect,
      handleClose,
      isParentOption,
      openSubmenuFor,
    ]
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

  /**
   * Two lists, not one two-level list.
   *
   * The menu and its open submenu each navigate exactly the way every other
   * surface does — wrap at the ends, skip disabled, Home and End to the enabled
   * extremes, Enter and Space commit. So this runs two independent
   * `useMenuNavigation` instances rather than teaching the primitive about
   * submenus: a concept only this component has would otherwise be paid for by
   * the eight surfaces that do not have it.
   *
   * What is genuinely this component's own is the router below — which level a
   * key belongs to, and the two keys that move between them.
   */
  const activeParent = getActiveParent();
  const submenuOptions = useMemo(
    () => (activeParent ? getFilteredSubmenuOptions(activeParent) : []),
    [activeParent, getFilteredSubmenuOptions],
  );
  const isInSubmenu = !!activeSubmenu && submenuFocusedIndex >= 0;

  const menuNav = useMenuNavigation<CascadingOption>({
    items: filteredOptions,
    isOpen,
    activeIndex: focusedIndex,
    onActiveIndexChange: setFocusedIndex,
    isDisabled: (option) => !!option.disabled,
    onSelect: (option) => {
      // Committing a parent from the keyboard opens its submenu *and* lands on
      // the first item, so arrows can carry straight on. Hover and click open
      // it with nothing highlighted, which is what `openSubmenuFor` does — the
      // difference is the point, not an inconsistency.
      if (isParentOption(option)) {
        openSubmenuFor(option, true);
        return;
      }
      handleMenuItemClick(option);
    },
    onOpen: handleToggle,
    onClose: (reason) => {
      if (reason === "escape" || reason === "tab") handleClose();
    },
  });

  const submenuNav = useMenuNavigation<CascadingOption>({
    items: submenuOptions,
    isOpen,
    activeIndex: submenuFocusedIndex,
    onActiveIndexChange: setSubmenuFocusedIndex,
    isDisabled: (option) => !!option.disabled,
    onSelect: (option) => {
      if (activeParent) handleSubmenuItemClick(activeParent, option);
    },
    // Escape inside a submenu closes the submenu, not the menu; Tab closes
    // everything. The outer level owns both of those, so this instance is only
    // ever asked to move and to commit.
    onClose: () => {},
  });

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (disabled) return;

      switch (event.key) {
        case "ArrowRight": {
          event.preventDefault();
          if (!isOpen || focusedIndex < 0) return;
          const option = filteredOptions[focusedIndex];
          if (option && isParentOption(option)) openSubmenuFor(option, true);
          return;
        }
        case "ArrowLeft":
          event.preventDefault();
          if (isInSubmenu) {
            setSubmenuFocusedIndex(-1);
            setActiveSubmenu(null);
          }
          return;
        case "Escape":
          // Marked only when something closes, so a closed trigger leaves the
          // key to whatever else is listening — a toast, a parent dialog.
          if (isInSubmenu) {
            event.preventDefault();
            setSubmenuFocusedIndex(-1);
            setActiveSubmenu(null);
          } else if (isOpen) {
            event.preventDefault();
            handleClose();
          }
          return;
        case "Tab":
          handleClose();
          return;
      }

      (isInSubmenu ? submenuNav : menuNav).onKeyDown(event);
    },
    [
      disabled,
      isOpen,
      isInSubmenu,
      focusedIndex,
      filteredOptions,
      handleClose,
      menuNav,
      submenuNav,
      isParentOption,
      openSubmenuFor,
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
