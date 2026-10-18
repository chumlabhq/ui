import { memo } from "react";
import type { SearchableDropdownOption as OptionType, SearchableDropdownClasses } from "../utils/types.js";
import { cn } from "../../../utils/scopedCn.js";
import { CheckIcon } from "../utils/icons.js";

export const SearchableDropdownOption = memo(function SearchableDropdownOption({
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
  option: OptionType;
  isSelected: boolean;
  isFocused: boolean;
  dropdownId: string;
  index: number;
  classes: Required<SearchableDropdownClasses>;
  showSelectedIcon: boolean;
  selectedIcon?: React.ReactNode;
  onSelect: (option: OptionType) => void;
  onHover: (index: number) => void;
}) {
  const combinedClassName =
    cn(
      classes.item,
    ) || undefined;

  return (
    <div
      id={`${dropdownId}-option-${index}`}
      role="option"
      aria-selected={isSelected}
      aria-disabled={option.disabled || undefined}
      className={combinedClassName}
      data-selected={isSelected || undefined}
      data-highlighted={isFocused || undefined}
      data-disabled={option.disabled || undefined}
      data-value={option.value}
      onClick={() => {
        if (!option.disabled) onSelect(option);
      }}
      onMouseEnter={option.disabled ? undefined : () => onHover(index)}
    >
      <span className="flex-1 truncate">
        {option.content || option.label}
      </span>
      {isSelected &&
        showSelectedIcon &&
        (selectedIcon || (
          <CheckIcon className={classes.itemIndicator} />
        ))}
    </div>
  );
});
