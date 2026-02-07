import { useRef, useEffect, useId, forwardRef, memo } from "react";
import type { ReactNode } from "react";
import type { DropdownOption, DropdownProps } from "./types";
import { useDropdown } from "./useDropdown";
import { ChevronDownIcon, CheckIcon } from "./icons";
import DropdownShimmer from "./DropdownShimmer";

const DropdownOptionItem = memo(function DropdownOptionItem({
  option,
  isSelected,
  isFocused,
  dropdownId,
  index,
  optionClassName,
  selectedOptionClassName,
  focusedOptionClassName,
  checkIconClassName,
  showSelectedIcon,
  selectedIcon,
  onSelect,
  onHover,
}: {
  option: DropdownOption;
  isSelected: boolean;
  isFocused: boolean;
  dropdownId: string;
  index: number;
  optionClassName: string;
  selectedOptionClassName: string;
  focusedOptionClassName: string;
  checkIconClassName: string;
  showSelectedIcon: boolean;
  selectedIcon?: ReactNode;
  onSelect: (option: DropdownOption) => void;
  onHover: (index: number) => void;
}) {
  const combinedClassName = [
    optionClassName,
    isSelected && selectedOptionClassName,
    isFocused && focusedOptionClassName,
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
        selectedIcon || <CheckIcon className={checkIconClassName} />
      )}
    </div>
  );
});

const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(
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
      noResultsText = "No options available",
      showChevron = true,
      showSelectedIcon = true,
      selectedIcon,
      fullWidth = false,
      loading: externalLoading = false,
      onLoadOptions,
      loadOnOpen = false,
      shimmerCount = 5,
      className = "",
      containerClassName = "",
      triggerClassName = "",
      dropdownClassName = "",
      optionClassName = "",
      selectedOptionClassName = "",
      focusedOptionClassName = "",
      optionListClassName = "",
      labelClassName = "",
      errorClassName = "",
      chevronClassName = "",
      checkIconClassName = "",
      noResultsClassName = "",
      shimmerClassName = "",
      shimmerItemClassName = "",
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

    const {
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
    } = useDropdown({
      options,
      value,
      disabled,
      onChange,
      onLoadOptions,
      loadOnOpen,
    });

    const loading = externalLoading || isLoadingOptions;

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
            className={triggerClassName}
            data-disabled={disabled || undefined}
            data-error={error || undefined}
            data-open={isOpen || undefined}
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
              aria-busy={loading || undefined}
              className={dropdownClassName}
            >
              <div className={optionListClassName}>
                {loading ? (
                  <DropdownShimmer
                    count={shimmerCount}
                    className={shimmerClassName}
                    itemClassName={shimmerItemClassName}
                  />
                ) : displayOptions.length === 0 ? (
                  <div className={noResultsClassName}>
                    {noResultsText}
                  </div>
                ) : (
                  displayOptions.map((option, index) => (
                    <DropdownOptionItem
                      key={option.value}
                      option={option}
                      isSelected={option.value === value}
                      isFocused={index === focusedIndex}
                      dropdownId={dropdownId}
                      index={index}
                      optionClassName={optionClassName}
                      selectedOptionClassName={selectedOptionClassName}
                      focusedOptionClassName={focusedOptionClassName}
                      checkIconClassName={checkIconClassName}
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

Dropdown.displayName = "Dropdown";

export default Dropdown;
