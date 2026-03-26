import { useRef, useEffect, useId, forwardRef, memo, useMemo, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import type { ReactNode } from "react";
import type { CascadingOption, CascadingDropdownProps, CascadingDropdownClasses } from "./utils/types";
import { useCascadingDropdown } from "./useCascadingDropdown";
import { ChevronDownIcon, ChevronRightIcon, CheckIcon } from "./icons";
import { cn } from "../../utils/cn";
import { useStablePositionAfterOpen } from "../../utils/useStablePositionAfterOpen";
import {
  DEFAULT_CASCADINGDROPDOWN_CLASSES,
  UNSTYLED_CASCADINGDROPDOWN_CLASSES,
} from "./constants";

const isBrowser = typeof window !== "undefined";

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
    classes.submenuItem,
    isSelected && classes.submenuItemSelected,
    isFocused && classes.submenuItemFocused,
  );

  const combinedCheckboxClassName = cn(
    classes.checkbox,
    isSelected && classes.checkboxChecked,
  );

  return (
    <div
      id={`${parentValue}-submenu-option-${index}`}
      role="menuitemcheckbox"
      aria-checked={isSelected}
      aria-disabled={option.disabled}
      className={combinedClassName || undefined}
      data-selected={isSelected || undefined}
      data-focused={isFocused || undefined}
      data-disabled={option.disabled || undefined}
      onClick={onSelect}
      onMouseEnter={() => onHover(index)}
    >
      {selectionMode === "multi" && (
        <span
          className={combinedCheckboxClassName || undefined}
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
        (selectedIcon || <CheckIcon className={classes.checkIcon || undefined} />)}
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
    classes.menuItem,
    isSelected && classes.menuItemSelected,
    isFocused && classes.menuItemFocused,
  );

  return (
    <div
      id={`${dropdownId}-option-${index}`}
      role={hasSubmenu ? "menuitem" : "menuitemradio"}
      aria-haspopup={hasSubmenu ? "menu" : undefined}
      aria-expanded={hasSubmenu ? isSubmenuOpen : undefined}
      aria-checked={!hasSubmenu ? isSelected : undefined}
      aria-disabled={option.disabled}
      className={combinedClassName || undefined}
      data-selected={isSelected || undefined}
      data-focused={isFocused || undefined}
      data-disabled={option.disabled || undefined}
      data-has-submenu={hasSubmenu || undefined}
      onMouseEnter={() => onHover(option, index)}
      onClick={() => onClick(option)}
    >
      <span className="flex-1 truncate">{option.content || option.label}</span>
      {hasSubmenu && <ChevronRightIcon className={classes.submenuChevron || undefined} />}
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
}) {
  const selectionMode = parent.selectionMode || "single";

  return (
    <div
      role="menu"
      aria-label={`${parent.label} submenu`}
      className={classes.submenu || undefined}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {loading ? (
        <div className={classes.loading || undefined}>{loadingText}</div>
      ) : options.length === 0 ? (
        <div className={classes.noResults || undefined}>{noResultsContent}</div>
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

const CascadingDropdown = forwardRef<HTMLDivElement, CascadingDropdownProps>(
  (
    {
      options = [],
      value,
      defaultValue,
      onValueChange,
      onLoadChildren,
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
      required = false,
      noResultsContent = "No options found",
      loadingText = "Loading...",
      loading: externalLoading = false,
      showChevron = true,
      showSelectedIcon = true,
      selectedIcon,
      checkboxIcon,
      fullWidth = false,
      submenuPosition = "right",
      closeOnSelect = true,
      classes: classesProp,
      unstyled = false,
      lockScroll = true,
      portalContainer,
      dropdownZIndex = 50,
      "aria-label": ariaLabel,
    },
    ref,
  ) => {
    const baseClasses = unstyled ? UNSTYLED_CASCADINGDROPDOWN_CLASSES : DEFAULT_CASCADINGDROPDOWN_CLASSES;

    const mergedClasses: Required<CascadingDropdownClasses> = useMemo(
      () => ({
        root: classesProp?.root ?? baseClasses.root,
        wrapper: classesProp?.wrapper ?? baseClasses.wrapper,
        trigger: classesProp?.trigger ?? baseClasses.trigger,
        menu: classesProp?.menu ?? baseClasses.menu,
        menuItem: classesProp?.menuItem ?? baseClasses.menuItem,
        menuItemSelected: classesProp?.menuItemSelected ?? baseClasses.menuItemSelected,
        menuItemFocused: classesProp?.menuItemFocused ?? baseClasses.menuItemFocused,
        menuItemDisabled: classesProp?.menuItemDisabled ?? baseClasses.menuItemDisabled,
        submenu: classesProp?.submenu ?? baseClasses.submenu,
        submenuContainer: classesProp?.submenuContainer ?? baseClasses.submenuContainer,
        submenuItem: classesProp?.submenuItem ?? baseClasses.submenuItem,
        submenuItemSelected: classesProp?.submenuItemSelected ?? baseClasses.submenuItemSelected,
        submenuItemFocused: classesProp?.submenuItemFocused ?? baseClasses.submenuItemFocused,
        label: classesProp?.label ?? baseClasses.label,
        error: classesProp?.error ?? baseClasses.error,
        chevron: classesProp?.chevron ?? baseClasses.chevron,
        submenuChevron: classesProp?.submenuChevron ?? baseClasses.submenuChevron,
        checkIcon: classesProp?.checkIcon ?? baseClasses.checkIcon,
        checkbox: classesProp?.checkbox ?? baseClasses.checkbox,
        checkboxChecked: classesProp?.checkboxChecked ?? baseClasses.checkboxChecked,
        noResults: classesProp?.noResults ?? baseClasses.noResults,
        loading: classesProp?.loading ?? baseClasses.loading,
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
    } = useCascadingDropdown({
      options,
      value,
      defaultValue,
      disabled,
      closeOnSelect,
      onValueChange,
      onLoadChildren,
      label,
      "aria-label": ariaLabel,
    });

    useEffect(() => {
      if (!isOpen) return;
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
      if (!lockScroll || !isOpen) return;

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

    const [menuCoords, setMenuCoords] = useState<{ top: number; left: number; width: number } | null>(null);
    const isPositionStable = useStablePositionAfterOpen(isOpen);

    const updateMenuPosition = useCallback(() => {
      if (!triggerRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      setMenuCoords({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
      });
    }, []);

    useEffect(() => {
      if (!isOpen || !isBrowser) return;
      updateMenuPosition();
      window.addEventListener("scroll", updateMenuPosition, true);
      window.addEventListener("resize", updateMenuPosition);
      return () => {
        window.removeEventListener("scroll", updateMenuPosition, true);
        window.removeEventListener("resize", updateMenuPosition);
      };
    }, [isOpen, updateMenuPosition]);

    const portalTarget = isBrowser ? (portalContainer ?? document.body) : null;

    const combinedKeyDown = useCallback(
      (event: React.KeyboardEvent) => {
        onKeyDownProp?.(event);
        if (!event.defaultPrevented) {
          handleKeyDown(event);
        }
      },
      [handleKeyDown, onKeyDownProp],
    );

    const fullWidthClass = fullWidth ? "w-full" : "";
    const displayValue = getDisplayValue();

    const getSelectedValuesForParent = (parentValue: string): string[] => {
      const selection = internalValue[parentValue];
      if (!selection) return [];
      return Array.isArray(selection) ? selection : [selection];
    };

    return (
      <div
        ref={ref}
        className={cn(mergedClasses.wrapper, fullWidthClass) || undefined}
        data-disabled={disabled || undefined}
        data-error={error || undefined}
        data-open={isOpen || undefined}
      >
        {label && (
          <label htmlFor={triggerId} className={mergedClasses.label || undefined}>
            {label}
            {required && <span aria-hidden="true">*</span>}
          </label>
        )}

        <div
          ref={containerRef}
          className={cn("relative", mergedClasses.root) || undefined}
        >
          <button
            ref={triggerRef}
            type="button"
            id={triggerId}
            aria-expanded={isOpen}
            aria-haspopup="true"
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
            <span className="flex-1 text-left truncate">
              {displayValue || placeholder}
            </span>
            {showChevron && (
              <ChevronDownIcon
                className={cn(mergedClasses.chevron, isOpen && "rotate-180") || undefined}
              />
            )}
          </button>

          {isOpen && portalTarget && createPortal(
            <div
              ref={menuRef}
              id={menuId}
              role="menu"
              aria-label={typeof label === "string" ? label : ariaLabel || "Options"}
              className={mergedClasses.menu || undefined}
              style={{
                position: "fixed" as const,
                zIndex: dropdownZIndex,
                margin: 0,
                ...(menuCoords && isPositionStable
                  ? { top: menuCoords.top, left: menuCoords.left, width: menuCoords.width }
                  : { visibility: "hidden" as const, top: 0, left: 0 }),
              }}
            >
              {externalLoading ? (
                <div className={mergedClasses.loading || undefined}>{loadingText}</div>
              ) : options.length === 0 ? (
                <div className={mergedClasses.noResults || undefined}>{noResultsContent}</div>
              ) : (
                options.map((option, index) => {
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
                              ? "absolute left-full top-0"
                              : "absolute right-full top-0",
                            mergedClasses.submenuContainer,
                          ) || undefined}
                        >
                          <Submenu
                            parent={option}
                            options={children}
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

        {error && errorMessage && (
          <div id={errorId} role="alert" className={mergedClasses.error || undefined}>
            {errorMessage}
          </div>
        )}
      </div>
    );
  },
);

CascadingDropdown.displayName = "CascadingDropdown";

export default CascadingDropdown;
