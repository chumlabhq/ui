// AI Knowledge: See MULTISELECTDROPDOWN.ai.md in this directory for full usage guide, props, styling, and patterns.
export { default as MultiSelectDropdown } from "./MultiSelectDropdown.js";
export { MultiSelectDropdownOption } from "./components/MultiSelectDropdownOption.js";
export { SelectedChip } from "./components/SelectedChip.js";
// MultiSelectDropdownShimmer is INTERNAL: it is never rendered without
// MultiSelectDropdown, nothing imports it standalone, and its styling arrives
// through the parent's `loadingIcon` / `loadingBar` keys. Un-exported rather
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
