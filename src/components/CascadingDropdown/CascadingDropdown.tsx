import { useRef, useEffect, useId, forwardRef, memo, useMemo, useCallback } from "react";
import { createPortal } from "react-dom";
import { useLayer } from "../../utils/layers";
import type { ReactNode, ComponentType, KeyboardEvent, MutableRefObject } from "react";
import type { CascadingOption, CascadingDropdownProps, CascadingDropdownClasses } from "./utils/types";
import { useCascadingDropdown } from "./utils/useCascadingDropdown";
import { ChevronDownIcon, ChevronRightIcon, CheckIcon, ClearIcon as ClearIconDefault, SearchIcon as SearchIconDefault } from "./utils/icons";
import { cn } from "../../utils/scopedCn";
import { useStablePositionAfterOpen } from "../../utils/useStablePositionAfterOpen";
import { isBrowser } from "../../utils/isBrowser";
import { useAnchoredPosition } from "../../utils/useAnchoredPosition";
import { motionSafeClasses } from "../../utils/classLayers";
import { useReducedMotion } from "../../utils/useReducedMotion";
import { useInertPropWarning } from "../../utils/useInertPropWarning";
import {
  DEFAULT_CASCADINGDROPDOWN_CLASSES,
  UNSTYLED_CASCADINGDROPDOWN_CLASSES,
} from "./utils/constants";

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
  // ADR 002 R4: the state the checkboxChecked key named; Radix Checkbox spelling.
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

const MenuItem = memo(function MenuItem({
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
}: {
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
}) {
  const combinedClassName = cn(
    classes.item,
  );

  return (
    <div
      id={`${dropdownId}-option-${index}`}
      role={hasSubmenu ? "menuitem" : "menuitemradio"}
      tabIndex={isFocused ? 0 : -1}
      aria-haspopup={hasSubmenu ? "menu" : undefined}
      aria-expanded={hasSubmenu ? isSubmenuOpen : undefined}
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
});

const Submenu = memo(function Submenu({
  parent,
  options,
  selectedValues,
  focusedIndex,
  loading,
  classes,
  noResultsContent,
  loadingText,
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
  SearchIconComponent,
  isSearching,
  submenuSearchInputClass,
  submenuSearchInputElementClass,
  submenuSearchIconClass,
}: {
  parent: CascadingOption;
  options: CascadingOption[];
  selectedValues: string[];
  focusedIndex: number;
  loading: boolean;
  classes: Required<CascadingDropdownClasses>;
  noResultsContent: ReactNode;
  loadingText: ReactNode;
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
  SearchIconComponent?: ComponentType<{ className?: string }>;
  isSearching?: boolean;
  submenuSearchInputClass?: string;
  submenuSearchInputElementClass?: string;
  submenuSearchIconClass?: string;
}) {
  const selectionMode = parent.selectionMode || "single";
  const SearchIcon = SearchIconComponent || SearchIconDefault;

  return (
    <div
      role="menu"
      aria-label={`${parent.label} submenu`}
      className={classes.subContent || undefined}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {showSearch && (
        <div className={submenuSearchInputClass || classes.searchControl || undefined}>
          <SearchIcon className={cn(submenuSearchIconClass || classes.searchIcon) || undefined} />
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
      {loading || isSearching ? (
        <div className={classes.loading || undefined}>{loadingText}</div>
      ) : options.length === 0 ? (
        <div className={classes.empty || undefined}>{noResultsContent}</div>
      ) : (
        options.map((option, index) => (
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
        ))
      )}
    </div>
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
 * - Use `onLoadChildren` + `hasChildren: true` for async child loading
 * - Use `showMenuSearch` / `showSubmenuSearch` for search bars
 * - Use `onMenuSearch` / `onSubmenuSearch` for server-side search
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
const CascadingDropdown = forwardRef<HTMLDivElement, CascadingDropdownProps>(
  (
    {
      options = [],
      value,
      defaultValue,
      onValueChange,
      onLoadChildren,
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
      noResultsContent = "No options found",
      loadingText = "Loading...",
      shimmerCount: rawShimmerCount = 5,
      loading: externalLoading = false,
      clearable = false,
      showChevron = true,
      showSelectedIcon = true,
      selectedIcon,
      checkboxIcon,
      fullWidth = false,
      submenuPosition = "right",
      dropdownPosition = "bottom",
      closeOnSelect = true,
      classes: classesProp,
      unstyled = false,
      lockScroll = false,
      portalContainer,
      dropdownZIndex: dropdownZIndexProp,
      dropdownGap = 4,
      keepMounted = false,
      className,
      style,
      ClearIcon: ClearIconProp,
      renderTrigger,
      showMenuSearch = false,
      showSubmenuSearch = false,
      menuSearchPlaceholder = "Search...",
      submenuSearchPlaceholder = "Search...",
      onMenuSearch,
      onSubmenuSearch,
      searchDebounceMs = 300,
      SearchIcon: SearchIconProp,
      menuSearchAriaLabel = "Search menu",
      submenuSearchAriaLabel = "Search submenu",
      "aria-label": ariaLabel,
    },
    ref,
  ) => {
    // ADR: floating content resolves its layer from the nearest overlay, so a
    // dropdown inside a drawer stacks above it. An explicit prop still wins.
    const dropdownZIndex = useLayer(dropdownZIndexProp);

    // `loadChildrenForOption` runs only for an option whose `hasChildren` is
    // set, so a loader over options that never set it is silently inert. No
    // union can express a constraint on the consumer's own data.
    const loaderIsInert = useMemo(() => {
      if (!onLoadChildren) return false;
      const anyLazy = (list: CascadingOption[]): boolean =>
        list.some((o) => o.hasChildren || (o.children ? anyLazy(o.children) : false));
      return !anyLazy(options);
    }, [onLoadChildren, options]);

    useInertPropWarning(
      "CascadingDropdown",
      loaderIsInert,
      "`onLoadChildren` is set, but no option has `hasChildren: true`. Children " +
        "are loaded only for options that declare they have some, so the loader " +
        "will never fire.",
    );

    const shimmerCount = Math.min(Math.max(0, rawShimmerCount), 50);
    const prefersReducedMotion = useReducedMotion();
    const baseClassesRaw = unstyled ? UNSTYLED_CASCADINGDROPDOWN_CLASSES : DEFAULT_CASCADINGDROPDOWN_CLASSES;
    // Motion is decorative under ADR 001, so `unstyled` has already removed it;
    // this handles the other reason to stop animating. Applied to the defaults
    // only — a class string the consumer supplied is theirs to control.
    const baseClasses = motionSafeClasses(baseClassesRaw, prefersReducedMotion);

    const mergedClasses: Required<CascadingDropdownClasses> = useMemo(
      () => ({
        root: classesProp?.root ?? baseClasses.root,
        control: classesProp?.control ?? baseClasses.control,
        trigger: classesProp?.trigger ?? baseClasses.trigger,
        value: classesProp?.value ?? baseClasses.value,
        content: classesProp?.content ?? baseClasses.content,
        item: classesProp?.item ?? baseClasses.item,
        subContent: classesProp?.subContent ?? baseClasses.subContent,
        subPositioner: classesProp?.subPositioner ?? baseClasses.subPositioner,
        subItem: classesProp?.subItem ?? baseClasses.subItem,
        label: classesProp?.label ?? baseClasses.label,
        message: classesProp?.message ?? baseClasses.message,
        description: classesProp?.description ?? baseClasses.description,
        icon: classesProp?.icon ?? baseClasses.icon,
        itemIcon: classesProp?.itemIcon ?? baseClasses.itemIcon,
        itemIndicator: classesProp?.itemIndicator ?? baseClasses.itemIndicator,
        itemControl: classesProp?.itemControl ?? baseClasses.itemControl,
        empty: classesProp?.empty ?? baseClasses.empty,
        clearTrigger: classesProp?.clearTrigger ?? baseClasses.clearTrigger,
        loading: classesProp?.loading ?? baseClasses.loading,
        loadingItem: classesProp?.loadingItem ?? baseClasses.loadingItem,
        searchControl: classesProp?.searchControl ?? baseClasses.searchControl,
        searchInput: classesProp?.searchInput ?? baseClasses.searchInput,
        searchIcon: classesProp?.searchIcon ?? baseClasses.searchIcon,
        subSearchControl: classesProp?.subSearchControl ?? classesProp?.searchControl ?? (baseClasses.subSearchControl || baseClasses.searchControl),
        subSearchInput: classesProp?.subSearchInput ?? classesProp?.searchInput ?? (baseClasses.subSearchInput || baseClasses.searchInput),
        subSearchIcon: classesProp?.subSearchIcon ?? classesProp?.searchIcon ?? (baseClasses.subSearchIcon || baseClasses.searchIcon),
      }),
      [classesProp, baseClasses],
    );

    const generatedId = useId();
    const dropdownId = id || name || generatedId;
    const menuId = `${dropdownId}-menu`;
    const triggerId = `${dropdownId}-trigger`;
    const errorId = `${dropdownId}-error`;

    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

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
      onLoadChildren,
      onLoadError,
      open,
      defaultOpen,
      onOpenChange,
      label,
      "aria-label": ariaLabel,
      showMenuSearch,
      showSubmenuSearch,
      onMenuSearch,
      onSubmenuSearch,
      searchDebounceMs,
    });

    const activeItemId =
      isOpen && focusedIndex >= 0
        ? `${dropdownId}-option-${focusedIndex}`
        : undefined;

    const SearchIconComponent = SearchIconProp || SearchIconDefault;

    // Restore focus to trigger when dropdown closes
    const prevOpenRef = useRef(false);
    useEffect(() => {
      if (prevOpenRef.current && !isOpen) {
        triggerRef.current?.focus();
      }
      prevOpenRef.current = isOpen;
    }, [isOpen]);

    useEffect(() => {
      if (!isOpen || !isBrowser) return;
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as Node;
        if (containerRef.current?.contains(target)) return;
        if (menuRef.current?.contains(target)) return;
        handleClose();
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isOpen, handleClose]);

    // Scroll lock when dropdown is open
    useEffect(() => {
      if (!lockScroll || !isOpen || !isBrowser) return;

      const preventScroll = (e: Event) => {
        // Allow scroll inside the dropdown menu itself
        if (menuRef.current?.contains(e.target as Node)) return;
        e.preventDefault();
      };

      window.addEventListener("wheel", preventScroll, { capture: true, passive: false });
      window.addEventListener("touchmove", preventScroll, { capture: true, passive: false });

      return () => {
        window.removeEventListener("wheel", preventScroll, { capture: true } as EventListenerOptions);
        window.removeEventListener("touchmove", preventScroll, { capture: true } as EventListenerOptions);
      };
    }, [lockScroll, isOpen]);

    const isPositionStable = useStablePositionAfterOpen(isOpen);
    const menuCoords = useAnchoredPosition(triggerRef, menuRef, isOpen, {
      side: dropdownPosition,
      gap: dropdownGap,
    });

    const portalTarget = isBrowser ? (portalContainer ?? document.body) : null;

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
        if (!menu.contains(document.activeElement)) {
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
        menu.contains(active);
      if (!ours) return;

      const item = menu.querySelector<HTMLElement>('[role^="menuitem"][tabindex="0"]');
      if (item && item !== active) item.focus({ preventScroll: true });
    }, [isOpen, focusedIndex, showMenuSearch]);

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

    const ClearIconComponent = ClearIconProp ?? ClearIconDefault;

    const renderTriggerRefCallback = useCallback(
      (node: HTMLElement | null) => {
        (triggerRef as MutableRefObject<HTMLButtonElement | null>).current = node as HTMLButtonElement | null;
      },
      [],
    );

    const fullWidthClass = fullWidth ? "w-full" : "";
    const displayValue = getDisplayValue();
    const hasValue = Object.keys(internalValue).length > 0;

    const getSelectedValuesForParent = (parentValue: string): string[] => {
      const selection = internalValue[parentValue];
      if (!selection) return [];
      return Array.isArray(selection) ? selection : [selection];
    };

    return (
      <div
        ref={ref}
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
            renderTrigger({
              ref: renderTriggerRefCallback,
              id: triggerId,
              "aria-expanded": isOpen,
              "aria-haspopup": "true",
              "aria-invalid": (error || undefined) as boolean | undefined,
              "aria-describedby": error && errorMessage ? errorId : undefined,
              "aria-required": (required || undefined) as boolean | undefined,
              "aria-label": ariaLabel,
              disabled,
              onClick: handleToggle,
              onKeyDown: combinedKeyDown,
              onFocus: onFocus,
              onBlur: onBlur,
              "data-disabled": (disabled || undefined) as true | undefined,
              "data-error": (error || undefined) as true | undefined,
              "data-open": (isOpen || undefined) as true | undefined,
              isOpen,
              displayValue,
              placeholder: placeholder as string,
            })
          ) : (
            <button
              ref={triggerRef}
              type="button"
              id={triggerId}
              aria-expanded={isOpen}
              aria-haspopup="true"
              aria-controls={isOpen ? menuId : undefined}
              aria-invalid={error || undefined}
              aria-describedby={error && errorMessage ? errorId : undefined}
              aria-required={required || undefined}
              aria-label={ariaLabel}
              disabled={disabled}
              onClick={handleToggle}
              onKeyDown={combinedKeyDown}
              onBlur={onBlur}
              onFocus={onFocus}
              className={mergedClasses.trigger || undefined}
              data-disabled={disabled || undefined}
              data-error={error || undefined}
              data-open={isOpen || undefined}
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
              // SC 2.1.1: this was tabIndex={-1}, so clearing could only be done
              // with a pointer — and for a single select there is no other way
              // back to an empty value.
              aria-label="Clear selection"
              className={mergedClasses.clearTrigger || undefined}
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
                triggerRef.current?.focus({ preventScroll: true });
              }}
            >
              <ClearIconComponent className="w-4 h-4" />
            </button>
          )}

          {(isOpen || keepMounted) && portalTarget && createPortal(
            <div
              ref={menuRef}
              id={menuId}
              role="menu"
              onKeyDown={combinedKeyDown}
              aria-label={typeof label === "string" ? label : ariaLabel || "Options"}
              aria-live={showMenuSearch ? "polite" : undefined}
              aria-busy={isMenuSearching || undefined}
              className={mergedClasses.content || undefined}
              style={{
                position: "fixed" as const,
                zIndex: dropdownZIndex,
                margin: 0,
                ...(!isOpen ? { display: "none" } : menuCoords && isPositionStable
                  ? { top: menuCoords.top, left: menuCoords.left, width: menuCoords.width }
                  : { visibility: "hidden" as const, top: 0, left: 0 }),
              }}
            >
              {showMenuSearch && (
                <div className={mergedClasses.searchControl || undefined}>
                  <SearchIconComponent className={cn(mergedClasses.searchIcon) || undefined} />
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
              {externalLoading || isMenuSearching ? (
                <>
                  <div className={mergedClasses.loading || undefined}>{loadingText}</div>
                  <div className={mergedClasses.loading || undefined}>
                    {Array.from({ length: shimmerCount }).map((_, i) => (
                      <div key={i} className={mergedClasses.loadingItem || undefined} />
                    ))}
                  </div>
                </>
              ) : filteredOptions.length === 0 ? (
                <div className={mergedClasses.empty || undefined}>{noResultsContent}</div>
              ) : (
                filteredOptions.map((option, index) => {
                  const staticChildren = option.children || [];
                  const dynamicChildren = loadedChildren[option.value] || [];
                  const children =
                    dynamicChildren.length > 0
                      ? dynamicChildren
                      : staticChildren;
                  const hasSubmenu = children.length > 0 || option.hasChildren;
                  const submenuOpen = isSubmenuOpen(option.value);
                  const isChildrenLoading =
                    loadingChildren[option.value] || false;
                  const submenuChildren = showSubmenuSearch
                    ? getFilteredSubmenuOptions(option)
                    : children;

                  return (
                    <div key={option.value} className="relative">
                      <MenuItem
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
                        onHover={handleMenuItemHover}
                        onClick={handleMenuItemClick}
                      />

                      {hasSubmenu && submenuOpen && (
                        <div
                          className={cn(
                            submenuPosition === "right"
                              ? "absolute left-full top-0 pl-1"
                              : "absolute right-full top-0 pr-1",
                            mergedClasses.subPositioner,
                          ) || undefined}
                        >
                          <Submenu
                            parent={option}
                            options={submenuChildren}
                            selectedValues={getSelectedValuesForParent(
                              option.value,
                            )}
                            focusedIndex={
                              activeSubmenu === option.value
                                ? submenuFocusedIndex
                                : -1
                            }
                            loading={isChildrenLoading}
                            classes={mergedClasses}
                            noResultsContent={noResultsContent}
                            loadingText={loadingText}
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
                            SearchIconComponent={SearchIconComponent}
                            isSearching={isSubmenuSearching}
                            submenuSearchInputClass={mergedClasses.subSearchControl}
                            submenuSearchInputElementClass={mergedClasses.subSearchInput}
                            submenuSearchIconClass={mergedClasses.subSearchIcon}
                          />
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>,
          portalTarget)}
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
