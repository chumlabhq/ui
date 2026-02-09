import { useRef, useState, useEffect, useId, forwardRef, memo } from "react";
import type { SearchableDropdownOption, SearchableDropdownProps, SearchableDropdownClasses } from "./types";
import { useDropdown } from "./useDropdown";
import { ChevronDownIcon, CheckIcon, SearchIcon } from "./icons";
import { joinClasses } from "./utils";

const DropdownOption = memo(function DropdownOption({
  option,
  isSelected,
  isFocused,
  dropdownId,
  index,
  classes,
  showSelectedIcon,
  selectedIcon,
  onSelect,
  onHover,
}: {
  option: SearchableDropdownOption;
  isSelected: boolean;
  isFocused: boolean;
  dropdownId: string;
  index: number;
  classes?: SearchableDropdownClasses;
  showSelectedIcon: boolean;
  selectedIcon?: React.ReactNode;
  onSelect: (option: SearchableDropdownOption) => void;
  onHover: (index: number) => void;
}) {
  const combinedClassName =
    joinClasses(
      classes?.option,
      isSelected && classes?.optionSelected,
      isFocused && classes?.optionFocused,
      option.disabled && classes?.optionDisabled,
    ) || undefined;

  return (
    <div
      id={`${dropdownId}-option-${index}`}
      role="option"
      aria-selected={isSelected}
      aria-disabled={option.disabled}
      className={combinedClassName}
      data-selected={isSelected || undefined}
      data-focused={isFocused || undefined}
      data-disabled={option.disabled || undefined}
      onClick={() => onSelect(option)}
      onMouseEnter={() => onHover(index)}
    >
      <span className="flex-1 truncate">
        {option.content || option.label}
      </span>
      {isSelected &&
        showSelectedIcon &&
        (selectedIcon || (
          <CheckIcon className={classes?.checkIcon} />
        ))}
    </div>
  );
});

const SearchableDropdown = forwardRef<HTMLDivElement, SearchableDropdownProps>(
  (
    {
      options = [],
      value,
      onValueChange,
      id,
      name,
      placeholder = "Select an option",
      disabled = false,
      error = false,
      errorMessage,
      label,
      required = false,
      showSearch = true,
      searchPlaceholder = "Search...",
      noResultsText = "No results found",
      loadingText = "Loading...",
      showChevron = true,
      showSelectedIcon = true,
      selectedIcon,
      fullWidth = false,
      loading: externalLoading = false,
      onSearch,
      searchDebounceMs = 300,
      initialOptions = [],
      onLoadInitialOptions,
      loadInitialOnOpen = false,
      classes: classesProp,
      className,
    },
    ref,
  ) => {
    const generatedId = useId();
    const dropdownId = id || generatedId;
    const listboxId = `${dropdownId}-listbox`;
    const triggerId = `${dropdownId}-trigger`;
    const errorId = `${dropdownId}-error`;

    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const [isTriggerFocused, setIsTriggerFocused] = useState(false);

    const {
      isOpen,
      searchQuery,
      focusedIndex,
      isSearching,
      isLoadingInitial,
      displayOptions,
      selectedOption,
      setSearchQuery,
      setFocusedIndex,
      handleToggle,
      handleClose,
      handleOptionSelect,
      handleKeyDown,
    } = useDropdown({
      options,
      value,
      disabled,
      showSearch,
      onSearch,
      searchDebounceMs,
      onValueChange,
      initialOptions,
      onLoadInitialOptions,
      loadInitialOnOpen,
    });

    const loading = externalLoading || isSearching || isLoadingInitial;

    useEffect(() => {
      if (isOpen && showSearch) {
        const timer = setTimeout(() => searchInputRef.current?.focus(), 10);
        return () => clearTimeout(timer);
      }
    }, [isOpen, showSearch]);

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

    const rootClassName =
      joinClasses(
        classesProp?.root,
        className,
        fullWidth && "w-full",
      ) || undefined;

    return (
      <div
        ref={ref}
        className={rootClassName}
        data-disabled={disabled || undefined}
        data-error={error || undefined}
        data-open={isOpen || undefined}
      >
        {label && (
          <label htmlFor={triggerId} className={classesProp?.label || undefined}>
            {label}
            {required && <span aria-hidden="true">*</span>}
          </label>
        )}

        <div
          ref={containerRef}
          className={joinClasses("relative", classesProp?.wrapper) || undefined}
        >
          <button
            ref={triggerRef}
            type="button"
            id={triggerId}
            role="combobox"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-controls={listboxId}
            aria-invalid={error || undefined}
            aria-describedby={error && errorMessage ? errorId : undefined}
            aria-required={required || undefined}
            disabled={disabled}
            onClick={handleToggle}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsTriggerFocused(true)}
            onBlur={() => setIsTriggerFocused(false)}
            className={
              joinClasses(
                classesProp?.trigger,
                isTriggerFocused && classesProp?.triggerFocused,
              ) || undefined
            }
            data-disabled={disabled || undefined}
            data-error={error || undefined}
            data-open={isOpen || undefined}
            data-focused={isTriggerFocused || undefined}
          >
            <span className={classesProp?.triggerText || "flex-1 truncate"}>
              {selectedOption
                ? selectedOption.selectedContent ||
                  selectedOption.content ||
                  selectedOption.label
                : placeholder}
            </span>
            {showChevron && (
              <ChevronDownIcon
                className={classesProp?.chevron || undefined}
                style={isOpen ? { transform: "rotate(180deg)" } : undefined}
              />
            )}
          </button>

          {isOpen && (
            <div
              id={listboxId}
              role="listbox"
              aria-label={typeof label === "string" ? label : "Options"}
              className={classesProp?.content || undefined}
            >
              {showSearch && (
                <div className={classesProp?.searchInput || undefined}>
                  <SearchIcon className={classesProp?.searchIcon || undefined} />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder={searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onClick={(e) => e.stopPropagation()}
                    className={
                      joinClasses(
                        "flex-1 outline-none",
                        classesProp?.searchInputElement,
                      ) || undefined
                    }
                  />
                </div>
              )}

              <div className={classesProp?.optionList || undefined}>
                {loading ? (
                  <div className={classesProp?.loading || undefined}>
                    {loadingText}
                  </div>
                ) : displayOptions.length === 0 ? (
                  <div className={classesProp?.noResults || undefined}>
                    {noResultsText}
                  </div>
                ) : (
                  displayOptions.map((option, index) => (
                    <DropdownOption
                      key={option.value}
                      option={option}
                      isSelected={option.value === value}
                      isFocused={index === focusedIndex}
                      dropdownId={dropdownId}
                      index={index}
                      classes={classesProp}
                      showSelectedIcon={showSelectedIcon}
                      selectedIcon={selectedIcon}
                      onSelect={handleOptionSelect}
                      onHover={setFocusedIndex}
                    />
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Hidden input for native form participation */}
        {name && (
          <input
            type="hidden"
            name={name}
            value={value ?? ""}
            aria-hidden="true"
          />
        )}

        {error && errorMessage && (
          <div
            id={errorId}
            role="alert"
            className={classesProp?.error || undefined}
          >
            {errorMessage}
          </div>
        )}
      </div>
    );
  },
);

SearchableDropdown.displayName = "SearchableDropdown";

export default SearchableDropdown;
