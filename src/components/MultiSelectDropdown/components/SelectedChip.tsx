import { memo } from "react";
import type { MultiSelectOption, MultiSelectDropdownClasses } from "../utils/types.js";
import { XIcon } from "../utils/icons.js";
import { CHIP_REMOVE_STYLE } from "../../../utils/isBrowser.js";

export const SelectedChip = memo(function SelectedChip({
  option,
  classes,
  onRemove,
  disabled,
}: {
  option: MultiSelectOption;
  classes: Required<MultiSelectDropdownClasses>;
  onRemove: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <span className={classes?.chip || undefined}>
      <span className="truncate" aria-hidden="true">
        {option.selectedContent || option.content || option.label}
      </span>
      <button
        type="button"
        disabled={disabled}
        className={classes?.chipRemoveTrigger || undefined}
        style={CHIP_REMOVE_STYLE}
        aria-label={`Remove ${option.label}`}
        onClick={() => onRemove(option.value)}
      >
        <XIcon className="w-3.5 h-3.5" />
      </button>
    </span>
  );
});
