import { memo } from "react";
import type { MultiSelectOption, MultiSelectDropdownClasses } from "../utils/types";
import { cn } from "../../../utils/scopedCn";
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
  classes: Required<MultiSelectDropdownClasses>;
  checkboxIcon?: ReactNode;
  onToggle: (option: MultiSelectOption) => void;
  onHover: (index: number) => void;
}) {
  const combinedOptionClassName =
    cn(
      classes.item,
    ) || undefined;

  const combinedCheckboxClassName =
    cn(
      classes.itemControl,
    ) || undefined;
  // ADR 002 R4: the state the checkboxChecked key named.
  const checkboxState = isSelected ? "checked" : "unchecked";

  return (
    <div
      id={`${dropdownId}-option-${index}`}
      role="option"
      aria-selected={isSelected}
      aria-disabled={option.disabled}
      className={combinedOptionClassName}
      data-selected={isSelected || undefined}
      data-highlighted={isFocused || undefined}
      data-disabled={option.disabled || undefined}
      onClick={() => onToggle(option)}
      onMouseEnter={() => onHover(index)}
    >
      <span className={combinedCheckboxClassName} data-checked={isSelected || undefined} data-state={checkboxState}>
        {isSelected &&
          (checkboxIcon || (
            <CheckIcon className={classes.itemIndicator || undefined} />
          ))}
      </span>
      <span className="flex-1 truncate">
        {option.content || option.label}
      </span>
    </div>
  );
});
