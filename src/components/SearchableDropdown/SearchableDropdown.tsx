import { useRef, useState, useEffect, useId, forwardRef, memo } from "react";
import type { SearchableDropdownOption, SearchableDropdownProps } from "./types";
import { useDropdown } from "./useDropdown";
import { ChevronDownIcon, CheckIcon, SearchIcon } from "./icons";

const DropdownOption = memo(function DropdownOption({
  option,
  isSelected,
  isFocused,
  dropdownId,
  index,
  optionClassName,
  optionSelectedClassName,
  optionFocusedClassName,
  selectedIndicatorClassName,
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
  optionClassName: string;
  optionSelectedClassName: string;
  optionFocusedClassName: string;
  selectedIndicatorClassName: string;
  showSelectedIcon: boolean;
  selectedIcon?: React.ReactNode;
  onSelect: (option: SearchableDropdownOption) => void;
  onHover: (index: number) => void;
}) {
  const combinedClassName = [
    optionClassName,
    isSelected && optionSelectedClassName,
    isFocused && optionFocusedClassName,
  ].filter(Boolean).join(" ");

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
      {isSelected && showSelectedIcon && (
        selectedIcon || <CheckIcon className={selectedIndicatorClassName} />
      )}
    </div>
  );
});

const SearchableDropdown = forwardRef<HTMLDivElement, SearchableDropdownProps>(
  (
    {
      options = [],
      value,
      onChange,
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
      className = "",
      triggerClassName = "",
      triggerFocusClassName = "",
      dropdownClassName = "",
      optionClassName = "",
      optionSelectedClassName = "",
      optionFocusedClassName = "",
      optionListClassName = "",
      labelClassName = "",
      errorClassName = "",
      searchInputClassName = "",
      searchInputElementClassName = "",
      containerClassName = "",
      chevronClassName = "",
      selectedIndicatorClassName = "",
      searchIconClassName = "",
      noResultsClassName = "",
      loadingClassName = "",
    },
    ref
  ) => {
    const generatedId = useId();
    const dropdownId = id || name || generatedId;
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
      onChange,
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

    const fullWidthClass = fullWidth ? "w-full" : "";

    return (
      <div
        ref={ref}
        className={[containerClassName, fullWidthClass].filter(Boolean).join(" ")}
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

        <div ref={containerRef} className={["relative", className].filter(Boolean).join(" ")}>
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
            className={[triggerClassName, isTriggerFocused ? triggerFocusClassName : ""]
              .filter(Boolean)
              .join(" ")}
            data-disabled={disabled || undefined}
            data-error={error || undefined}
            data-open={isOpen || undefined}
            data-focused={isTriggerFocused || undefined}
          >
            <span className="flex-1 truncate">
              {selectedOption
                ? selectedOption.selectedContent || selectedOption.content || selectedOption.label
                : placeholder}
            </span>
            {showChevron && (
              <ChevronDownIcon
                className={[
                  chevronClassName,
                  isOpen ? "rotate-180" : "",
                ].filter(Boolean).join(" ")}
              />
            )}
          </button>

          {isOpen && (
            <div
              id={listboxId}
              role="listbox"
              aria-label={typeof label === "string" ? label : "Options"}
              className={dropdownClassName}
            >
              {showSearch && (
                <div className={searchInputClassName}>
                  <SearchIcon className={searchIconClassName} />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder={searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onClick={(e) => e.stopPropagation()}
                    className={["flex-1 outline-none", searchInputElementClassName].filter(Boolean).join(" ")}
                  />
                </div>
              )}

              <div className={optionListClassName}>
                {loading ? (
                  <div className={loadingClassName}>
                    {loadingText}
                  </div>
                ) : displayOptions.length === 0 ? (
                  <div className={noResultsClassName}>
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
                      optionClassName={optionClassName}
                      optionSelectedClassName={optionSelectedClassName}
                      optionFocusedClassName={optionFocusedClassName}
                      selectedIndicatorClassName={selectedIndicatorClassName}
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

        {error && errorMessage && (
          <div id={errorId} role="alert" className={errorClassName}>
            {errorMessage}
          </div>
        )}
      </div>
    );
  }
);

SearchableDropdown.displayName = "SearchableDropdown";

export default SearchableDropdown;
