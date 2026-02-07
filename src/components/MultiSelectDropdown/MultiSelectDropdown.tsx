import { useRef, useEffect, useId, forwardRef, memo } from "react";
import type { ReactNode } from "react";
import type { MultiSelectOption, MultiSelectDropdownProps } from "./types";
import { useMultiSelectDropdown } from "./useMultiSelectDropdown";
import { ChevronDownIcon, CheckIcon, XIcon } from "./icons";
import MultiSelectDropdownShimmer from "./MultiSelectDropdownShimmer";

const OptionItem = memo(function OptionItem({
  option,
  isSelected,
  isFocused,
  dropdownId,
  index,
  optionClassName,
  selectedOptionClassName,
  focusedOptionClassName,
  checkboxClassName,
  checkboxCheckedClassName,
  checkboxIconClassName,
  checkboxIcon,
  onToggle,
  onHover,
}: {
  option: MultiSelectOption;
  isSelected: boolean;
  isFocused: boolean;
  dropdownId: string;
  index: number;
  optionClassName: string;
  selectedOptionClassName: string;
  focusedOptionClassName: string;
  checkboxClassName: string;
  checkboxCheckedClassName: string;
  checkboxIconClassName: string;
  checkboxIcon?: ReactNode;
  onToggle: (option: MultiSelectOption) => void;
  onHover: (index: number) => void;
}) {
  const combinedOptionClassName = [
    optionClassName,
    isSelected && selectedOptionClassName,
    isFocused && focusedOptionClassName,
  ].filter(Boolean).join(" ");

  const combinedCheckboxClassName = [
    checkboxClassName,
    isSelected && checkboxCheckedClassName,
  ].filter(Boolean).join(" ");

  return (
    <div
      id={`${dropdownId}-option-${index}`}
      role="option"
      aria-selected={isSelected}
      aria-disabled={option.disabled}
      className={combinedOptionClassName}
      data-selected={isSelected || undefined}
      data-focused={isFocused || undefined}
      data-disabled={option.disabled || undefined}
      onClick={() => onToggle(option)}
      onMouseEnter={() => onHover(index)}
    >
      <span className={combinedCheckboxClassName} data-checked={isSelected || undefined}>
        {isSelected && (checkboxIcon || <CheckIcon className={checkboxIconClassName || "w-full h-full"} />)}
      </span>
      <span className="flex-1 truncate">
        {option.content || option.label}
      </span>
    </div>
  );
});

const SelectedChip = memo(function SelectedChip({
  option,
  chipClassName,
  chipRemoveClassName,
  onRemove,
}: {
  option: MultiSelectOption;
  chipClassName: string;
  chipRemoveClassName: string;
  onRemove: (value: string) => void;
}) {
  return (
    <span className={chipClassName}>
      <span className="truncate">
        {option.selectedContent || option.content || option.label}
      </span>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(option.value);
        }}
        className={chipRemoveClassName}
        aria-label={`Remove ${option.label}`}
      >
        <XIcon className="w-full h-full" />
      </button>
    </span>
  );
});

const MultiSelectDropdown = forwardRef<
  HTMLDivElement,
  MultiSelectDropdownProps
>(
  (
    {
      options = [],
      value,
      onChange,
      id,
      name,
      placeholder = "Select options...",
      disabled = false,
      error = false,
      errorMessage,
      label,
      required = false,
      noResultsText = "No options available",
      showChevron = true,
      fullWidth = false,
      loading: externalLoading = false,
      onLoadOptions,
      loadOnOpen = false,
      shimmerCount = 5,
      maxDisplayedChips = 3,
      showSelectedChips = true,
      checkboxIcon,
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
      chipClassName = "",
      chipRemoveClassName = "",
      chevronClassName = "",
      checkboxClassName = "",
      checkboxCheckedClassName = "",
      checkboxIconClassName = "",
      noResultsClassName = "",
      shimmerClassName = "",
      shimmerItemClassName = "",
      moreCountClassName = "",
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
      selectedOptions,
      setFocusedIndex,
      handleToggle,
      handleClose,
      handleOptionToggle,
      handleRemoveOption,
      handleKeyDown,
    } = useMultiSelectDropdown({
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
    const displayedChips = selectedOptions.slice(0, maxDisplayedChips);
    const remainingCount = selectedOptions.length - maxDisplayedChips;

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
            <span className="flex-1 flex items-center gap-1 min-w-0 overflow-hidden">
              {showSelectedChips && selectedOptions.length > 0 ? (
                <>
                  {displayedChips.map((option) => (
                    <SelectedChip
                      key={option.value}
                      option={option}
                      chipClassName={chipClassName}
                      chipRemoveClassName={chipRemoveClassName}
                      onRemove={handleRemoveOption}
                    />
                  ))}
                  {remainingCount > 0 && (
                    <span className={moreCountClassName}>
                      +{remainingCount}
                    </span>
                  )}
                </>
              ) : selectedOptions.length > 0 ? (
                <span className="truncate">
                  {selectedOptions.length} selected
                </span>
              ) : (
                <span className="truncate">{placeholder}</span>
              )}
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
              aria-multiselectable="true"
              aria-busy={loading || undefined}
              className={dropdownClassName}
            >
              <div className={optionListClassName}>
                {loading ? (
                  <MultiSelectDropdownShimmer
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
                    <OptionItem
                      key={option.value}
                      option={option}
                      isSelected={value.includes(option.value)}
                      isFocused={index === focusedIndex}
                      dropdownId={dropdownId}
                      index={index}
                      optionClassName={optionClassName}
                      selectedOptionClassName={selectedOptionClassName}
                      focusedOptionClassName={focusedOptionClassName}
                      checkboxClassName={checkboxClassName}
                      checkboxCheckedClassName={checkboxCheckedClassName}
                      checkboxIconClassName={checkboxIconClassName}
                      checkboxIcon={checkboxIcon}
                      onToggle={handleOptionToggle}
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

MultiSelectDropdown.displayName = "MultiSelectDropdown";

export default MultiSelectDropdown;
