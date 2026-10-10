export { default as MultiSelectDropdown } from "./MultiSelectDropdown.js";
/**
 * `MultiSelectDropdownOption` and `SelectedChip` are deliberately NOT exported,
 * for the reason `TabButton` is not: both require props only the parent has.
 * The option needs `isSelected`, `isFocused`, `dropdownId`, `index`, `onToggle`
 * and `onHover`; both need `classes: Required<MultiSelectDropdownClasses>`,
 * which asks a consumer to supply every slot. Public names nobody can
 * construct cost a reader more than they give.
 */
// MultiSelectDropdownShimmer is INTERNAL: it is never rendered without
// MultiSelectDropdown, nothing imports it standalone, and its styling arrives
// through the parent's `loadingItemControl` / `loadingBar` keys. Un-exported rather
// than given a second styling route — free pre-1.0, and it shrinks the API.
export type {
  MultiSelectOption,
  MultiSelectDropdownProps,
  MultiSelectDropdownClasses,
} from "./utils/types.js";
export { useMultiSelectDropdown } from "./utils/useMultiSelectDropdown.js";
export {
  DEFAULT_MULTISELECTDROPDOWN_CLASSES,
  UNSTYLED_MULTISELECTDROPDOWN_CLASSES,
} from "./utils/constants.js";
export { ChevronDownIcon, CheckIcon, XIcon } from "./utils/icons.js";
