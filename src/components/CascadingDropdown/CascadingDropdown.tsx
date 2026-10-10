import { useRef, useEffect, useId, forwardRef, memo, useMemo, useCallback } from "react";
import { useLayer } from "../../utils/layers.js";
import type { ReactNode, KeyboardEvent, MutableRefObject, RefObject } from "react";
import type { CascadingOption, CascadingDropdownProps, CascadingDropdownClasses } from "./utils/types.js";
import { useCascadingDropdown } from "./utils/useCascadingDropdown.js";
import { ChevronDownIcon, ChevronRightIcon, CheckIcon, ClearIcon as ClearIconDefault, SearchIcon as SearchIconDefault } from "./utils/icons.js";
import { cn } from "../../utils/scopedCn.js";
import { mergeSlot } from "../../utils/mergeSlot.js";
import { isBrowser } from "../../utils/isBrowser.js";
import { motionSafeClasses } from "../../utils/classLayers.js";
import { useReducedMotion } from "../../utils/useReducedMotion.js";
import { useInertPropWarning } from "../../utils/useInertPropWarning.js";
import MenuSurface from "../../utils/menu/MenuSurface.js";
import { mergeRefs, setRef } from "../../utils/mergeRefs.js";
import { focusTriggerOnMouseDown } from "../../utils/menu/focusTriggerOnMouseDown.js";
import {
  DEFAULT_CASCADINGDROPDOWN_CLASSES,
  UNSTYLED_CASCADINGDROPDOWN_CLASSES,
} from "./utils/constants.js";

const SubmenuItem = memo(function SubmenuItem({
  option,
  isSelected,
  isFocused,
  parentValue,
  index,
  selectionMode,
  classes,
  showSelectedIcon,
  selectedIcon,
  checkboxIcon,
  onSelect,
  onHover,
}: {
  option: CascadingOption;
  isSelected: boolean;
  isFocused: boolean;
  parentValue: string;
  index: number;
  selectionMode: "single" | "multi";
  classes: Required<CascadingDropdownClasses>;
  showSelectedIcon: boolean;
  selectedIcon?: ReactNode;
  checkboxIcon?: ReactNode;
  onSelect: () => void;
  onHover: (index: number) => void;
}) {
  const combinedClassName = cn(
    classes.subItem,
  );

  const combinedCheckboxClassName = cn(
    classes.itemControl,
  );
  const checkboxState = isSelected ? "checked" : "unchecked";

  return (
    <div
      id={`${parentValue}-submenu-option-${index}`}
      role="menuitemcheckbox"
      tabIndex={isFocused ? 0 : -1}
      aria-checked={isSelected}
      aria-disabled={option.disabled}
      className={combinedClassName || undefined}
      data-selected={isSelected || undefined}
      data-highlighted={isFocused || undefined}
      data-disabled={option.disabled || undefined}
      onClick={onSelect}
      onMouseEnter={() => onHover(index)}
    >
      {selectionMode === "multi" && (
        <span
          className={combinedCheckboxClassName || undefined}
          data-state={checkboxState}
          data-checked={isSelected || undefined}
        >
          {isSelected &&
            (checkboxIcon || <CheckIcon className="w-full h-full" />)}
        </span>
      )}
      <span className="flex-1 truncate">{option.content || option.label}</span>
      {selectionMode === "single" &&
        isSelected &&
        showSelectedIcon &&
        (selectedIcon || <CheckIcon className={classes.itemIndicator || undefined} />)}
    </div>
  );
});

interface MenuItemProps {
  option: CascadingOption;
  isFocused: boolean;
  isSelected: boolean;
  hasSubmenu: boolean;
  isSubmenuOpen: boolean;
  dropdownId: string;
  index: number;
  classes: Required<CascadingDropdownClasses>;
  onHover: (option: CascadingOption, index: number) => void;
  onClick: (option: CascadingOption) => void;
  /** Set only while the submenu is open, so the reference always resolves. */
  submenuId?: string;
}

/**
 * The submenu anchors to this element; only the open item receives the ref.
 *
 * `forwardRef`, not a `ref` prop: React 18 never passes `ref` to a function
 * component, so on 18 the anchor stayed null and the submenu opened at 0,0
 * with an opacity that never reached 1.
 */
const MenuItem = memo(forwardRef<HTMLDivElement, MenuItemProps>(function MenuItem({
  option,
  isFocused,
  isSelected,
  hasSubmenu,
  isSubmenuOpen,
  dropdownId,
  index,
  classes,
  onHover,
  onClick,
  submenuId,
}, ref) {
  const combinedClassName = cn(
    classes.item,
  );

  return (
    <div
      ref={ref}
      id={`${dropdownId}-option-${index}`}
      role={hasSubmenu ? "menuitem" : "menuitemradio"}
      tabIndex={isFocused ? 0 : -1}
      aria-haspopup={hasSubmenu ? "menu" : undefined}
      aria-expanded={hasSubmenu ? isSubmenuOpen : undefined}
      // The submenu's items are a roving group with no tab stop of their own:
      // navigation is state-driven and DOM focus stays out here. This is what
      // points at them, and it only resolves while the submenu exists.
      aria-controls={hasSubmenu && isSubmenuOpen ? submenuId : undefined}
      aria-checked={!hasSubmenu ? isSelected : undefined}
      aria-disabled={option.disabled}
      className={combinedClassName || undefined}
      data-selected={isSelected || undefined}
      data-highlighted={isFocused || undefined}
      data-disabled={option.disabled || undefined}
      data-has-submenu={hasSubmenu || undefined}
      onMouseEnter={() => onHover(option, index)}
      onClick={() => onClick(option)}
    >
      <span className="flex-1 truncate">{option.content || option.label}</span>
      {hasSubmenu && <ChevronRightIcon className={classes.itemIcon || undefined} />}
    </div>
  );
}));

const Submenu = memo(function Submenu({
  parent,
  options,
  selectedValues,
  focusedIndex,
  loading,
  classes,
  emptyContent,
  loadingContent,
  showSelectedIcon,
  selectedIcon,
  checkboxIcon,
  onItemClick,
  onItemHover,
  onMouseEnter,
  onMouseLeave,
  showSearch,
  searchQuery,
  onSearchChange,
  searchPlaceholder,
  searchAriaLabel,
  searchIcon,
  isSearching,
  submenuSearchInputClass,
  submenuSearchInputElementClass,
  submenuSearchIconClass,
  anchor,
  side,
  zIndex,
  portalContainer,
  menuId,
}: {
  parent: CascadingOption;
  options: CascadingOption[];
  selectedValues: string[];
  focusedIndex: number;
  loading: boolean;
  classes: Required<CascadingDropdownClasses>;
  emptyContent: ReactNode;
  loadingContent: ReactNode;
  showSelectedIcon: boolean;
  selectedIcon?: ReactNode;
  checkboxIcon?: ReactNode;
  onItemClick: (parent: CascadingOption, option: CascadingOption) => void;
  onItemHover: (index: number) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  showSearch?: boolean;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  searchPlaceholder?: string;
  searchAriaLabel?: string;
  searchIcon?: ReactNode;
  isSearching?: boolean;
  submenuSearchInputClass?: string;
  submenuSearchInputElementClass?: string;
  submenuSearchIconClass?: string;
  /** The menu item the submenu opens from. */
  anchor: RefObject<HTMLDivElement | null>;
  side: "left" | "right";
  zIndex: number;
  portalContainer?: HTMLElement | null;
  menuId: string;
}) {
  const selectionMode = parent.selectionMode || "single";

  return (
    // Portalled and anchored, like every other floating surface: an absolutely
    // positioned child of the menu item gets no clamp and no flip, and runs off
    // the frame at 1024 and out of the viewport at 320. Leaving the parent
    // menu's subtree is also what lets its search field and its status messages
    // carry their own roles — inside a `menu` they are unallowed children.
    <MenuSurface
      trigger={anchor}
      isOpen
      side={side}
      gap={4}
      zIndex={zIndex}
      portalContainer={portalContainer}
      matchTriggerWidth={false}
      // Announced, like the panels the searchable dropdowns portal: the search
      // field is portalled content and a role-less div tells a screen-reader
      // user nothing about what it belongs to (portal-semantics.contract).
      role="group"
      aria-label={`${parent.label} submenu`}
      className={classes.subPositioner || undefined}
      // The outside-click, scroll-lock and focus checks look for this: the
      // submenu is portalled, so `menu.contains(target)` cannot find it.
      data-cascading-submenu=""
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className={classes.subContent || undefined}>
        {showSearch && (
          <div className={submenuSearchInputClass || classes.searchControl || undefined}>
            {searchIcon ?? <SearchIconDefault className={cn(submenuSearchIconClass || classes.searchIcon) || undefined} />}
            <input
              type="text"
              value={searchQuery || ""}
              onChange={(e) => onSearchChange?.(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              placeholder={searchPlaceholder || "Search..."}
              className={submenuSearchInputElementClass || classes.searchInput || undefined}
              aria-label={searchAriaLabel || "Search submenu"}
              aria-autocomplete="list"
            />
          </div>
        )}
        {/* The panel is not the menu. A `menu` owns menu items, and the search
            field and the loading and empty messages are neither. */}
        {loading || isSearching ? (
          <div role="status" className={classes.loading || undefined}>{loadingContent}</div>
        ) : options.length === 0 ? (
          <div role="status" className={classes.empty || undefined}>{emptyContent}</div>
        ) : null}
        <div id={menuId} role="menu" aria-label={`${parent.label} submenu`}>
          {loading || isSearching
            ? null
            : options.map((option, index) => (
                <SubmenuItem
                  key={option.value}
                  option={option}
                  isSelected={selectedValues.includes(option.value)}
                  isFocused={index === focusedIndex}
                  parentValue={parent.value}
                  index={index}
                  selectionMode={selectionMode}
                  classes={classes}
                  showSelectedIcon={showSelectedIcon}
                  selectedIcon={selectedIcon}
                  checkboxIcon={checkboxIcon}
                  onSelect={() => onItemClick(parent, option)}
                  onHover={onItemHover}
                />
              ))}
        </div>
      </div>
    </MenuSurface>
  );
});

/**
 * Component: CascadingDropdown
 *
 * Purpose:
 * A multi-level dropdown menu with nested submenus for hierarchical data.
 * Supports single and multi-select per level, async child loading, and
 * search with debounce for both menu and submenu levels.
 *
 * AI Usage Guidelines:
 * - Pass `options` with nested `children` for static data
 * - Use `loadChildren` + `hasChildren: true` for async child loading
 * - Use `showMenuSearch` / `showSubmenuSearch` for search bars
 * - Use `searchMenu` / `searchSubmenu` for server-side search
 * - Value shape: `{ parentValue: "child" | string[] }`
 *
 * Behavior:
 * - Menu renders via portal to avoid overflow clipping
 * - Children are cached after first load
 * - Search uses useEffect-based debounce with version tracking
 *
 * Reference:
 * - CASCADINGDROPDOWN.ai.md (this directory) — full AI knowledge doc
 * - src/pages/demo/CascadingDropdownDemo.tsx — live demo
 */
const CascadingDropdown = forwardRef<HTMLButtonElement, CascadingDropdownProps>(
  (
    {
      options = [],
      value,
      defaultValue,
      onValueChange,
      loadChildren,
      onLoadError,
      open,
      defaultOpen,
      onOpenChange,
      onBlur,
      onFocus,
      onKeyDown: onKeyDownProp,
      id,
      name,
      placeholder = "Select an option",
      disabled = false,
      error = false,
      errorMessage,
      label,
      description,
      success = false,
      successMessage,
      required = false,
      emptyContent = "No options found",
      loadingContent = "Loading...",
      shimmerCount: rawShimmerCount = 5,
      loading: externalLoading = false,
      clearable = false,
      showChevron = true,
      showSelectedIcon = true,
      selectedIcon,
      checkboxIcon,
      fullWidth = false,
      submenuSide = "right",
      dropdownSide = "bottom",
      closeOnSelect = true,
      classes: classesProp,
      unstyled = false,
      lockScroll = false,
      portalContainer,
      dropdownZIndex: dropdownZIndexProp,
      dropdownOffset = 4,
      keepMounted = false,
      className,
      style,
      clearIcon,
      renderTrigger,
      showMenuSearch = false,
      showSubmenuSearch = false,
      menuSearchPlaceholder = "Search...",
      submenuSearchPlaceholder = "Search...",
      searchMenu,
      searchSubmenu,
      searchDebounce = 300,
      searchIcon,
      menuSearchAriaLabel = "Search menu",
      submenuSearchAriaLabel = "Search submenu",
      "aria-label": ariaLabel,
    },
    ref,
  ) => {
    const dropdownZIndex = useLayer(dropdownZIndexProp);

    // `loadChildrenForOption` runs only for an option whose `hasChildren` is
    // set, so a loader over options that never set it is silently inert. No
    // union can express a constraint on the consumer's own data.
    useInertPropWarning(loadChildren, options);

    const shimmerCount = Math.min(Math.max(0, rawShimmerCount), 50);
    const prefersReducedMotion = useReducedMotion();
    const baseClassesRaw = unstyled ? UNSTYLED_CASCADINGDROPDOWN_CLASSES : DEFAULT_CASCADINGDROPDOWN_CLASSES;
    const baseClasses = motionSafeClasses(baseClassesRaw, prefersReducedMotion);

    const mergedClasses: Required<CascadingDropdownClasses> = useMemo(
      () => ({
        root: mergeSlot(baseClasses.root, classesProp?.root),
        control: mergeSlot(baseClasses.control, classesProp?.control),
        trigger: mergeSlot(baseClasses.trigger, classesProp?.trigger),
        value: mergeSlot(baseClasses.value, classesProp?.value),
        content: mergeSlot(baseClasses.content, classesProp?.content),
        item: mergeSlot(baseClasses.item, classesProp?.item),
        subContent: mergeSlot(baseClasses.subContent, classesProp?.subContent),
        subPositioner: mergeSlot(baseClasses.subPositioner, classesProp?.subPositioner),
        subItem: mergeSlot(baseClasses.subItem, classesProp?.subItem),
        label: mergeSlot(baseClasses.label, classesProp?.label),
        message: mergeSlot(baseClasses.message, classesProp?.message),
        description: mergeSlot(baseClasses.description, classesProp?.description),
        icon: mergeSlot(baseClasses.icon, classesProp?.icon),
        itemIcon: mergeSlot(baseClasses.itemIcon, classesProp?.itemIcon),
        itemIndicator: mergeSlot(baseClasses.itemIndicator, classesProp?.itemIndicator),
        itemControl: mergeSlot(baseClasses.itemControl, classesProp?.itemControl),
        empty: mergeSlot(baseClasses.empty, classesProp?.empty),
        clearTrigger: mergeSlot(baseClasses.clearTrigger, classesProp?.clearTrigger),
        loading: mergeSlot(baseClasses.loading, classesProp?.loading),
        loadingItem: mergeSlot(baseClasses.loadingItem, classesProp?.loadingItem),
        searchControl: mergeSlot(baseClasses.searchControl, classesProp?.searchControl),
        searchInput: mergeSlot(baseClasses.searchInput, classesProp?.searchInput),
        searchIcon: mergeSlot(baseClasses.searchIcon, classesProp?.searchIcon),
        subSearchControl: mergeSlot(baseClasses.subSearchControl || baseClasses.searchControl, classesProp?.subSearchControl ?? classesProp?.searchControl),
        subSearchInput: mergeSlot(baseClasses.subSearchInput || baseClasses.searchInput, classesProp?.subSearchInput ?? classesProp?.searchInput),
        subSearchIcon: mergeSlot(baseClasses.subSearchIcon || baseClasses.searchIcon, classesProp?.subSearchIcon ?? classesProp?.searchIcon),
      }),
      [classesProp, baseClasses],
    );

    const generatedId = useId();
    const dropdownId = id || name || generatedId;
    const menuId = `${dropdownId}-menu`;
    const submenuId = `${dropdownId}-submenu`;
    const triggerId = `${dropdownId}-trigger`;
    const errorId = `${dropdownId}-error`;

    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    /** The menu item the open submenu anchors to. */
    const submenuAnchorRef = useRef<HTMLDivElement>(null);

    const {
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
    } = useCascadingDropdown({
      options,
      value,
      defaultValue,
      disabled,
      closeOnSelect,
      onValueChange,
      loadChildren,
      onLoadError,
      open,
      defaultOpen,
      onOpenChange,
      label,
      "aria-label": ariaLabel,
      showMenuSearch,
      showSubmenuSearch,
      searchMenu,
      searchSubmenu,
      searchDebounce,
    });

    const activeItemId =
      isOpen && focusedIndex >= 0
        ? `${dropdownId}-option-${focusedIndex}`
        : undefined;

    const prevOpenRef = useRef(false);
    useEffect(() => {
      if (prevOpenRef.current && !isOpen) {
        triggerRef.current?.focus();
      }
      prevOpenRef.current = isOpen;
    }, [isOpen]);

    /**
     * The menu and its submenu, which is no longer inside it.
     *
     * The submenu is portalled now, so `menuRef.contains` — which every one of
     * these checks used — reports a click, a scroll or a focus inside it as
     * being outside the menu entirely.
     */
    const inMenuSurface = useCallback((node: Node | null) => {
      if (!node) return false;
      if (menuRef.current?.contains(node)) return true;
      const element = node instanceof Element ? node : node.parentElement;
      return !!element?.closest("[data-cascading-submenu]");
    }, []);

    useEffect(() => {
      if (!isOpen || !isBrowser) return;
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as Node;
        if (containerRef.current?.contains(target)) return;
        if (inMenuSurface(target)) return;
        handleClose();
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isOpen, handleClose, inMenuSurface]);

    useEffect(() => {
      if (!lockScroll || !isOpen || !isBrowser) return;

      const preventScroll = (e: Event) => {
        if (inMenuSurface(e.target as Node)) return;
        e.preventDefault();
      };

      window.addEventListener("wheel", preventScroll, { capture: true, passive: false });
      window.addEventListener("touchmove", preventScroll, { capture: true, passive: false });

      return () => {
        window.removeEventListener("wheel", preventScroll, { capture: true } as EventListenerOptions);
        window.removeEventListener("touchmove", preventScroll, { capture: true } as EventListenerOptions);
      };
    }, [lockScroll, isOpen, inMenuSurface]);

    // Positioning, the portal and the measuring frame all belong to
    // `MenuSurface`, the submenu included since it stopped being a child of the
    // menu item it opens from.

    const menuSearchRef = useRef<HTMLInputElement>(null);

    /**
     * Moves the focus the roving tabindex was only pretending to move.
     *
     * Menu items carried `tabIndex={isFocused ? 0 : -1}` and `data-highlighted`,
     * and nothing ever called `.focus()` on them — the same defect the DatePicker
     * grid had. Focus stayed on the trigger, which is a `<button>` and so cannot
     * legally carry `aria-activedescendant` either, and the arrow-key highlight
     * was announced to nobody. axe cannot see it: every attribute is present and
     * correct in the DOM.
     *
     * Two shapes, each the right one for its case. With a filter field the field
     * keeps the focus and points at the active item, which is what the
     * searchable dropdowns do. Without one, focus moves onto the menu item
     * itself, which is the APG menu-button pattern.
     */
    useEffect(() => {
      if (!isOpen) return;
      const menu = menuRef.current;
      if (!menu) return;

      if (showMenuSearch) {
        if (!inMenuSurface(document.activeElement)) {
          menuSearchRef.current?.focus({ preventScroll: true });
        }
        return;
      }

      const active = document.activeElement;
      // Paging or filtering can unmount the item that had focus, dropping the
      // browser back to <body>; that is our own re-render, not the user leaving.
      const ours =
        active === triggerRef.current ||
        active === null ||
        active === document.body ||
        inMenuSurface(active);
      if (!ours) return;

      const item = menu.querySelector<HTMLElement>('[role^="menuitem"][tabindex="0"]');
      if (item && item !== active) item.focus({ preventScroll: true });
    }, [isOpen, focusedIndex, showMenuSearch, inMenuSurface]);

    const combinedKeyDown = useCallback(
      (event: KeyboardEvent) => {
        onKeyDownProp?.(event);
        if (!event.defaultPrevented) {
          handleKeyDown(event);
        }
      },
      [handleKeyDown, onKeyDownProp],
    );

    const handleClear = useCallback(() => {
      if (onValueChange) {
        onValueChange({}, []);
      }
    }, [onValueChange]);

    const renderTriggerRefCallback = useCallback(
      (node: HTMLElement | null) => {
        (triggerRef as MutableRefObject<HTMLButtonElement | null>).current = node as HTMLButtonElement | null;
        setRef(ref, node as HTMLButtonElement | null);
      },
      [ref],
    );
    const mergedTriggerRef = useMemo(() => mergeRefs(triggerRef, ref), [ref]);

    const fullWidthClass = fullWidth ? "w-full" : "";
    const displayValue = getDisplayValue();
    const hasValue = Object.keys(internalValue).length > 0;

    const getSelectedValuesForParent = (parentValue: string): string[] => {
      const selection = internalValue[parentValue];
      if (!selection) return [];
      return Array.isArray(selection) ? selection : [selection];
    };

    /** Lazily loaded children win over the static ones, as they always have. */
    const childrenOf = (option: CascadingOption): CascadingOption[] => {
      const loaded = loadedChildren[option.value] || [];
      return loaded.length > 0 ? loaded : option.children || [];
    };

    // One submenu is open at a time — `activeSubmenu` is a single value — so it
    // is rendered once rather than per item.
    const openSubmenuParent =
      filteredOptions.find((option) => option.value === activeSubmenu) ?? null;

    // One object for both triggers. The custom one was handed its own copy of
    // this list in three components, and the copies drifted: `type="button"`
    // and CascadingDropdown's `aria-controls` reached the default trigger only.
    //
    // No `aria-required`: this trigger is a menu button, not a combobox, and
    // `group`/`button` do not support the attribute — axe reports
    // `aria-allowed-attr`, critical. The asterisk in the label is what carries
    // the requirement here; the siblings that DO declare `role="combobox"` keep
    // the attribute.
    const triggerProps = {
      type: "button" as const,
      id: triggerId,
      "aria-expanded": isOpen,
      "aria-haspopup": "true" as const,
      "aria-controls": isOpen ? menuId : undefined,
      "aria-invalid": (error || undefined) as boolean | undefined,
      "aria-describedby": error && errorMessage ? errorId : undefined,
      "aria-label": ariaLabel,
      disabled,
      onClick: handleToggle,
      onMouseDown: focusTriggerOnMouseDown,
      onKeyDown: combinedKeyDown,
      onFocus,
      onBlur,
      "data-disabled": (disabled || undefined) as true | undefined,
      "data-error": (error || undefined) as true | undefined,
      "data-valid": ((!error && success) || undefined) as true | undefined,
      "data-open": (isOpen || undefined) as true | undefined,
    };

    return (
      <div
        className={cn(mergedClasses.control, fullWidthClass, className) || undefined}
        style={style}
        data-disabled={disabled || undefined}
        data-error={error || undefined}
        data-open={isOpen || undefined}
        data-valid={(!error && success) || undefined}
        data-full-width={fullWidth || undefined}
      >
        {label && (
          <label htmlFor={triggerId} className={mergedClasses.label || undefined}>
            {label}
            {required && <span aria-hidden="true">*</span>}
          </label>
        )}

        {description && (
          <div className={mergedClasses.description || undefined}>{description}</div>
        )}

        <div
          ref={containerRef}
          className={cn(mergedClasses.root) || undefined}
        >
          {renderTrigger ? (
            // eslint-disable-next-line react-hooks/refs -- ref callback is intentionally passed to render prop for consumer to attach
            renderTrigger(
              { ...triggerProps, ref: renderTriggerRefCallback },
              { isOpen, displayValue, placeholder },
            )
          ) : (
            <button
              ref={mergedTriggerRef}
              {...triggerProps}
              className={mergedClasses.trigger || undefined}
            >
              <span className={mergedClasses.value || undefined}>
                {displayValue || placeholder}
              </span>
              {showChevron && (
                <ChevronDownIcon
                  className={cn(mergedClasses.icon, isOpen && "rotate-180") || undefined}
                />
              )}
            </button>
          )}

          {clearable && hasValue && (
            <button
              type="button"
              aria-label="Clear selection"
              className={mergedClasses.clearTrigger || undefined}
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
                triggerRef.current?.focus({ preventScroll: true });
              }}
            >
              {clearIcon ?? <ClearIconDefault className="w-4 h-4" />}
            </button>
          )}

          {(isOpen || keepMounted) && (
            <MenuSurface
              ref={menuRef}
              trigger={triggerRef}
              isOpen={isOpen}
              side={dropdownSide}
              gap={dropdownOffset}
              zIndex={dropdownZIndex}
              portalContainer={portalContainer}
              keepMounted={keepMounted}
              onKeyDown={combinedKeyDown}
              // Announced even though it is no longer the menu: the search
              // field is portalled content and needs a container that says what
              // it belongs to (portal-semantics.contract).
              role="group"
              aria-label={typeof label === "string" ? label : ariaLabel || "Options"}
              className={mergedClasses.content || undefined}
            >
              {showMenuSearch && (
                <div className={mergedClasses.searchControl || undefined}>
                  {searchIcon ?? <SearchIconDefault className={cn(mergedClasses.searchIcon) || undefined} />}
                  <input
                    type="text"
                    value={menuSearchQuery}
                    onChange={(e) => onMenuSearchChange(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder={menuSearchPlaceholder}
                    className={mergedClasses.searchInput || undefined}
                    aria-label={menuSearchAriaLabel}
                    aria-autocomplete="list"
                    aria-controls={menuId}
                    aria-activedescendant={activeItemId}
                    ref={menuSearchRef}
                  />
                </div>
              )}
              {/* The panel is not the menu: the search field and the loading and
                  empty messages are siblings of it, because a `menu` owns menu
                  items and nothing else. */}
              {externalLoading || isMenuSearching ? (
                <>
                  <div role="status" className={mergedClasses.loading || undefined}>{loadingContent}</div>
                  <div className={mergedClasses.loading || undefined}>
                    {Array.from({ length: shimmerCount }).map((_, i) => (
                      <div key={i} className={mergedClasses.loadingItem || undefined} />
                    ))}
                  </div>
                </>
              ) : filteredOptions.length === 0 ? (
                <div role="status" className={mergedClasses.empty || undefined}>{emptyContent}</div>
              ) : null}

              <div
                id={menuId}
                role="menu"
                aria-label={typeof label === "string" ? label : ariaLabel || "Options"}
                aria-live={showMenuSearch ? "polite" : undefined}
                aria-busy={isMenuSearching || undefined}
              >
                {externalLoading || isMenuSearching || filteredOptions.length === 0
                  ? null
                  : filteredOptions.map((option, index) => {
                      const children = childrenOf(option);
                      const hasSubmenu = children.length > 0 || option.hasChildren;
                      const submenuOpen = isSubmenuOpen(option.value);

                      return (
                        <MenuItem
                          key={option.value}
                          // Only the open one: the submenu is rendered once,
                          // below, and anchors to whichever item opened it.
                          ref={submenuOpen ? submenuAnchorRef : undefined}
                          option={option}
                          isFocused={index === focusedIndex}
                          isSelected={
                            !hasSubmenu && internalValue.root === option.value
                          }
                          hasSubmenu={!!hasSubmenu}
                          isSubmenuOpen={submenuOpen}
                          dropdownId={dropdownId}
                          index={index}
                          classes={mergedClasses}
                          submenuId={submenuId}
                          onHover={handleMenuItemHover}
                          onClick={handleMenuItemClick}
                        />
                      );
                    })}
              </div>

              {/* Outside the menu element and inside the panel's React tree:
                  the portal puts its DOM on the body, and keeping the element
                  here is what still lets a key pressed inside the submenu
                  bubble to the menu's own handler. */}
              {openSubmenuParent && (
                <Submenu
                  key={openSubmenuParent.value}
                  menuId={submenuId}
                  anchor={submenuAnchorRef}
                  side={submenuSide === "right" ? "right" : "left"}
                  zIndex={dropdownZIndex}
                  portalContainer={portalContainer}
                  parent={openSubmenuParent}
                  options={
                    showSubmenuSearch
                      ? getFilteredSubmenuOptions(openSubmenuParent)
                      : childrenOf(openSubmenuParent)
                  }
                  selectedValues={getSelectedValuesForParent(openSubmenuParent.value)}
                  focusedIndex={submenuFocusedIndex}
                  loading={loadingChildren[openSubmenuParent.value] || false}
                  classes={mergedClasses}
                  emptyContent={emptyContent}
                  loadingContent={loadingContent}
                  showSelectedIcon={showSelectedIcon}
                  selectedIcon={selectedIcon}
                  checkboxIcon={checkboxIcon}
                  onItemClick={handleSubmenuItemClick}
                  onItemHover={handleSubmenuItemHover}
                  onMouseEnter={handleSubmenuMouseEnter}
                  onMouseLeave={handleSubmenuMouseLeave}
                  showSearch={showSubmenuSearch}
                  searchQuery={submenuSearchQuery}
                  onSearchChange={onSubmenuSearchChange}
                  searchPlaceholder={submenuSearchPlaceholder}
                  searchAriaLabel={submenuSearchAriaLabel}
                  searchIcon={searchIcon}
                  isSearching={isSubmenuSearching}
                  submenuSearchInputClass={mergedClasses.subSearchControl}
                  submenuSearchInputElementClass={mergedClasses.subSearchInput}
                  submenuSearchIconClass={mergedClasses.subSearchIcon}
                />
              )}
            </MenuSurface>
          )}
        </div>

        {name && (
          <input
            type="hidden"
            name={name}
            value={JSON.stringify(internalValue)}
            aria-hidden="true"
          />
        )}

        {error && errorMessage && (
          <div id={errorId} role="alert" data-invalid className={mergedClasses.message || undefined}>
            {errorMessage}
          </div>
        )}

        {success && successMessage && !error && (
          <div role="status" data-valid className={mergedClasses.message || undefined}>{successMessage}</div>
        )}
      </div>
    );
  },
);

CascadingDropdown.displayName = "CascadingDropdown";

export default CascadingDropdown;
