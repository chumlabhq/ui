import { memo } from "react";
import type { MultiSelectOption, MultiSelectDropdownClasses } from "../utils/types";
import { XIcon } from "../utils/icons";

export const SelectedChip = memo(function SelectedChip({
  option,
  classes,
  onRemove,
}: {
  option: MultiSelectOption;
  classes: Required<MultiSelectDropdownClasses>;
  onRemove: (value: string) => void;
}) {
  return (
    <span className={classes?.chip || undefined}>
      <span className="truncate">
        {option.selectedContent || option.content || option.label}
      </span>
      <span
        role="button"
        tabIndex={-1}
        className={classes?.chipRemove || undefined}
        aria-label={`Remove ${option.label}`}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          onRemove(option.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            e.stopPropagation();
            onRemove(option.value);
          }
        }}
      >
        <XIcon className="w-full h-full" />
      </span>
    </span>
  );
});
