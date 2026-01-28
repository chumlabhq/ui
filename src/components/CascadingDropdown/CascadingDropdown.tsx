import { useRef, useEffect, useId, forwardRef, memo } from "react";
import type { ReactNode } from "react";
import type { CascadingOption, CascadingDropdownProps } from "./types";
import { useCascadingDropdown } from "./useCascadingDropdown";
import { ChevronDownIcon, ChevronRightIcon, CheckIcon } from "./icons";

const SubmenuItem = memo(function SubmenuItem({
  option,
  isSelected,
  isFocused,
  parentValue,
  index,
  selectionMode,
  submenuItemClassName,
  submenuItemSelectedClassName,
  submenuItemFocusedClassName,
  checkIconClassName,
  checkboxClassName,
  checkboxCheckedClassName,
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
  submenuItemClassName: string;
  submenuItemSelectedClassName: string;
  submenuItemFocusedClassName: string;
  checkIconClassName: string;
  checkboxClassName: string;
  checkboxCheckedClassName: string;
  showSelectedIcon: boolean;
  selectedIcon?: ReactNode;
  checkboxIcon?: ReactNode;
  onSelect: () => void;
  onHover: (index: number) => void;
}) {
  const combinedClassName = [
    submenuItemClassName,
    isSelected && submenuItemSelectedClassName,
    isFocused && submenuItemFocusedClassName,
  ]
    .filter(Boolean)
    .join(" ");

  const combinedCheckboxClassName = [
    checkboxClassName,
    isSelected && checkboxCheckedClassName,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      id={`${parentValue}-submenu-option-${index}`}
      role="menuitemcheckbox"
      aria-checked={isSelected}
      aria-disabled={option.disabled}
      className={combinedClassName}
      data-selected={isSelected || undefined}
      data-focused={isFocused || undefined}
      data-disabled={option.disabled || undefined}
      onClick={onSelect}
      onMouseEnter={() => onHover(index)}
    >
      {selectionMode === "multi" && (
        <span
          className={combinedCheckboxClassName}
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
        (selectedIcon || <CheckIcon className={checkIconClassName} />)}
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
  menuItemClassName,
  menuItemSelectedClassName,
  menuItemFocusedClassName,
  submenuChevronClassName,
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
  menuItemClassName: string;
  menuItemSelectedClassName: string;
  menuItemFocusedClassName: string;
  submenuChevronClassName: string;
  onHover: (option: CascadingOption, index: number) => void;
  onClick: (option: CascadingOption) => void;
}) {
  const combinedClassName = [
    menuItemClassName,
    isSelected && menuItemSelectedClassName,
    isFocused && menuItemFocusedClassName,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      id={`${dropdownId}-option-${index}`}
      role={hasSubmenu ? "menuitem" : "menuitemradio"}
      aria-haspopup={hasSubmenu ? "menu" : undefined}
      aria-expanded={hasSubmenu ? isSubmenuOpen : undefined}
      aria-checked={!hasSubmenu ? isSelected : undefined}
      aria-disabled={option.disabled}
      className={combinedClassName}
      data-selected={isSelected || undefined}
      data-focused={isFocused || undefined}
      data-disabled={option.disabled || undefined}
      data-has-submenu={hasSubmenu || undefined}
      onMouseEnter={() => onHover(option, index)}
      onClick={() => onClick(option)}
    >
      <span className="flex-1 truncate">{option.content || option.label}</span>
      {hasSubmenu && <ChevronRightIcon className={submenuChevronClassName} />}
    </div>
  );
});

const Submenu = memo(function Submenu({
  parent,
  options,
  selectedValues,
  focusedIndex,
  isLoading,
  submenuClassName,
  submenuItemClassName,
  submenuItemSelectedClassName,
  submenuItemFocusedClassName,
  checkIconClassName,
  checkboxClassName,
  checkboxCheckedClassName,
  noResultsClassName,
  noResultsText,
  loadingClassName,
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
  isLoading: boolean;
  submenuClassName: string;
  submenuItemClassName: string;
  submenuItemSelectedClassName: string;
  submenuItemFocusedClassName: string;
  checkIconClassName: string;
  checkboxClassName: string;
  checkboxCheckedClassName: string;
  noResultsClassName: string;
  noResultsText: string;
  loadingClassName: string;
  loadingText: string;
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
      className={submenuClassName}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {isLoading ? (
        <div className={loadingClassName}>{loadingText}</div>
      ) : options.length === 0 ? (
        <div className={noResultsClassName}>{noResultsText}</div>
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
            submenuItemClassName={submenuItemClassName}
            submenuItemSelectedClassName={submenuItemSelectedClassName}
            submenuItemFocusedClassName={submenuItemFocusedClassName}
            checkIconClassName={checkIconClassName}
            checkboxClassName={checkboxClassName}
            checkboxCheckedClassName={checkboxCheckedClassName}
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
      onChange,
      onLoadChildren,
      id,
      name,
      placeholder = "Select an option",
      disabled = false,
      error = false,
      errorMessage,
      label,
      required = false,
      noResultsText = "No options available",
      loadingText = "Loading...",
      isLoading: externalLoading = false,
      showChevron = true,
      showSelectedIcon = true,
      selectedIcon,
      checkboxIcon,
      fullWidth = false,
      submenuPosition = "right",
      closeOnSelect = true,
      className = "",
      containerClassName = "",
      triggerClassName = "flex items-center justify-between gap-2 w-full",
      menuClassName = "absolute z-50 top-full left-0 mt-1 w-full min-w-[200px]",
      menuItemClassName = "flex items-center justify-between cursor-pointer",
      menuItemSelectedClassName = "",
      menuItemFocusedClassName = "",
      submenuClassName = "min-w-[180px]",
      submenuContainerClassName = "z-[9999]",
      submenuItemClassName = "flex items-center gap-2 cursor-pointer",
      submenuItemSelectedClassName = "",
      submenuItemFocusedClassName = "",
      labelClassName = "",
      errorClassName = "",
      chevronClassName = "w-4 h-4 shrink-0 transition-transform duration-200",
      submenuChevronClassName = "w-4 h-4 shrink-0",
      checkIconClassName = "w-4 h-4 shrink-0",
      checkboxClassName = "w-4 h-4 shrink-0 flex items-center justify-center",
      checkboxCheckedClassName = "",
      noResultsClassName = "",
      loadingClassName = "",
    },
    ref,
  ) => {
    const generatedId = useId();
    const dropdownId = id || name || generatedId;
    const menuId = `${dropdownId}-menu`;
    const triggerId = `${dropdownId}-trigger`;
    const errorId = `${dropdownId}-error`;

    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);

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
      onChange,
      onLoadChildren,
    });

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          handleClose();
        }
      };

      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isOpen, handleClose]);

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
        className={[containerClassName, fullWidthClass]
          .filter(Boolean)
          .join(" ")}
        data-disabled={disabled || undefined}
        data-error={error || undefined}
        data-open={isOpen || undefined}
      >
        {label && (
          <label htmlFor={triggerId} className={labelClassName}>
            {label}
            {required && <span aria-hidden="true">*</span>}
          </label>
        )}

        <div
          ref={containerRef}
          className={["relative", className].filter(Boolean).join(" ")}
        >
          <button
            ref={triggerRef}
            type="button"
            id={triggerId}
            role="combobox"
            aria-expanded={isOpen}
            aria-haspopup="menu"
            aria-controls={menuId}
            aria-invalid={error || undefined}
            aria-describedby={error && errorMessage ? errorId : undefined}
            aria-required={required || undefined}
            disabled={disabled}
            onClick={handleToggle}
            onKeyDown={handleKeyDown}
            className={triggerClassName}
            data-disabled={disabled || undefined}
            data-error={error || undefined}
            data-open={isOpen || undefined}
          >
            <span className="flex-1 truncate">
              {displayValue || placeholder}
            </span>
            {showChevron && (
              <ChevronDownIcon
                className={[chevronClassName, isOpen ? "rotate-180" : ""]
                  .filter(Boolean)
                  .join(" ")}
              />
            )}
          </button>

          {isOpen && (
            <div
              id={menuId}
              role="menu"
              aria-label={typeof label === "string" ? label : "Options"}
              className={menuClassName}
            >
              {externalLoading ? (
                <div className={loadingClassName}>{loadingText}</div>
              ) : options.length === 0 ? (
                <div className={noResultsClassName}>{noResultsText}</div>
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
                        menuItemClassName={menuItemClassName}
                        menuItemSelectedClassName={menuItemSelectedClassName}
                        menuItemFocusedClassName={menuItemFocusedClassName}
                        submenuChevronClassName={submenuChevronClassName}
                        onHover={handleMenuItemHover}
                        onClick={handleMenuItemClick}
                      />

                      {hasSubmenu && submenuOpen && (
                        <div
                          className={[
                            submenuPosition === "right"
                              ? "absolute left-full top-0"
                              : "absolute right-full top-0",
                            submenuContainerClassName,
                          ]
                            .filter(Boolean)
                            .join(" ")}
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
                            isLoading={isChildrenLoading}
                            submenuClassName={submenuClassName}
                            submenuItemClassName={submenuItemClassName}
                            submenuItemSelectedClassName={
                              submenuItemSelectedClassName
                            }
                            submenuItemFocusedClassName={
                              submenuItemFocusedClassName
                            }
                            checkIconClassName={checkIconClassName}
                            checkboxClassName={checkboxClassName}
                            checkboxCheckedClassName={checkboxCheckedClassName}
                            noResultsClassName={noResultsClassName}
                            noResultsText={noResultsText}
                            loadingClassName={loadingClassName}
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
            </div>
          )}
        </div>

        {error && errorMessage && (
          <div id={errorId} role="alert" className={errorClassName}>
            {errorMessage}
          </div>
        )}
      </div>
    );
  },
);

CascadingDropdown.displayName = "CascadingDropdown";

export default CascadingDropdown;
