import { memo } from "react";
import type { MultiSelectOption, MultiSelectDropdownClasses } from "../utils/types";
import { joinClasses } from "../utils/helpers";
import { CheckIcon } from "../utils/icons";
import type { ReactNode } from "react";

export const MultiSelectDropdownOption = memo(function MultiSelectDropdownOption({
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
