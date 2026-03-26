import { memo } from "react";
import type { SearchableDropdownOption as OptionType, SearchableDropdownClasses } from "../utils/types";
import { cn } from "../../../utils/cn";
import { CheckIcon } from "../utils/icons";

export const SearchableDropdownOption = memo(function SearchableDropdownOption({
  option,
  isSelected,
  isFocused,
  dropdownId,
  index,
  classes,
  showSelectedIcon,
  selectedIcon,
  CheckIconComponent,
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
  CheckIconComponent?: React.ComponentType<{ className?: string }>;
  onSelect: (option: OptionType) => void;
  onHover: (index: number) => void;
}) {
  const combinedClassName =
    cn(
      classes.option,
      isSelected && classes.optionSelected,
      isFocused && classes.optionFocused,
      option.disabled && classes.optionDisabled,
    ) || undefined;

  const IconComponent = CheckIconComponent || CheckIcon;

  return (
    <div
      id={`${dropdownId}-option-${index}`}
      role="option"
      aria-selected={isSelected}
      aria-disabled={option.disabled || undefined}
      className={combinedClassName}
      data-selected={isSelected || undefined}
      data-focused={isFocused || undefined}
      data-disabled={option.disabled || undefined}
      data-value={option.value}
      onClick={() => {
        if (!option.disabled) onSelect(option);
      }}
      onMouseEnter={() => onHover(index)}
    >
      <span className="flex-1 truncate">
        {option.content || option.label}
      </span>
      {isSelected &&
        showSelectedIcon &&
        (selectedIcon || (
          <IconComponent className={classes.checkIcon} />
        ))}
    </div>
  );
});
