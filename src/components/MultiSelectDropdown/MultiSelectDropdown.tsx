import { useRef, useEffect, useId, forwardRef, memo } from "react";
import type { ReactNode } from "react";
import type {
  MultiSelectOption,
  MultiSelectDropdownProps,
  MultiSelectDropdownClasses,
} from "./types";
import { useMultiSelectDropdown } from "./useMultiSelectDropdown";
import { ChevronDownIcon, CheckIcon, XIcon } from "./icons";
import MultiSelectDropdownShimmer from "./MultiSelectDropdownShimmer";

/**
 * Joins class names, filtering out falsy values.
 */
function joinClasses(
  ...classes: (string | false | null | undefined)[]
): string {
  return classes.filter(Boolean).join(" ");
}

const OptionItem = memo(function OptionItem({
  option,
  isSelected,
  isFocused,
  dropdownId,
  index,
  classes,
  checkboxIcon,
  onToggle,
  onHover,
}: {
  option: MultiSelectOption;
  isSelected: boolean;
  isFocused: boolean;
  dropdownId: string;
  index: number;
  classes?: MultiSelectDropdownClasses;
  checkboxIcon?: ReactNode;
  onToggle: (option: MultiSelectOption) => void;
  onHover: (index: number) => void;
}) {
  const combinedOptionClassName =
    joinClasses(
      classes?.option,
      isSelected && classes?.optionSelected,
      isFocused && classes?.optionFocused,
      option.disabled && classes?.optionDisabled,
    ) || undefined;

  const combinedCheckboxClassName =
    joinClasses(
      classes?.checkbox,
      isSelected && classes?.checkboxChecked,
    ) || undefined;

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
        {isSelected &&
          (checkboxIcon || (
            <CheckIcon className={classes?.checkboxIcon || "w-full h-full"} />
          ))}
      </span>
      <span className="flex-1 truncate">
        {option.content || option.label}
      </span>
    </div>
  );
});

const SelectedChip = memo(function SelectedChip({
  option,
  classes,
  onRemove,
}: {
  option: MultiSelectOption;
  classes?: MultiSelectDropdownClasses;
  onRemove: (value: string) => void;
}) {
  return (
    <span className={classes?.chip || undefined}>
      <span className="truncate">
        {option.selectedContent || option.content || option.label}
      </span>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(option.value);
        }}
        className={classes?.chipRemove || undefined}
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
      onValueChange,
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
      onValueChange,
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

    const rootClassName =
      joinClasses(
        classesProp?.root,
        className,
        fullWidth && "w-full",
      ) || undefined;

    const displayedChips = selectedOptions.slice(0, maxDisplayedChips);
    const remainingCount = selectedOptions.length - maxDisplayedChips;

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
            className={classesProp?.trigger || undefined}
            data-disabled={disabled || undefined}
            data-error={error || undefined}
            data-open={isOpen || undefined}
          >
            <span className={classesProp?.triggerText || "flex-1 flex items-center gap-1 min-w-0 overflow-hidden"}>
              {showSelectedChips && selectedOptions.length > 0 ? (
                <>
                  {displayedChips.map((option) => (
                    <SelectedChip
                      key={option.value}
                      option={option}
                      classes={classesProp}
                      onRemove={handleRemoveOption}
                    />
                  ))}
                  {remainingCount > 0 && (
                    <span className={classesProp?.moreCount || undefined}>
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
              aria-multiselectable="true"
              aria-busy={loading || undefined}
              className={classesProp?.content || undefined}
            >
              <div className={classesProp?.optionList || undefined}>
                {loading ? (
                  <MultiSelectDropdownShimmer
                    count={shimmerCount}
                    className={classesProp?.shimmer || undefined}
                    itemClassName={classesProp?.shimmerItem || undefined}
                  />
                ) : displayOptions.length === 0 ? (
                  <div className={classesProp?.noResults || undefined}>
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
                      classes={classesProp}
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

        {/* Hidden input for native form participation */}
        {name && (
          <input
            type="hidden"
            name={name}
            value={value.join(",")}
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

MultiSelectDropdown.displayName = "MultiSelectDropdown";

export default MultiSelectDropdown;
