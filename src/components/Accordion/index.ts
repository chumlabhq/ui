export { default as Accordion } from "./Accordion";
export { default as AccordionItem } from "./components/AccordionItem";
export { default as AccordionTrigger } from "./components/AccordionTrigger";
export { default as AccordionContent } from "./components/AccordionContent";
export { default as AccordionShimmer } from "./components/AccordionShimmer";

export type {
  AccordionProps,
  AccordionSingleProps,
  AccordionMultipleProps,
  AccordionItemProps,
  AccordionTriggerProps,
  AccordionContentProps,
  AccordionClasses,
  AccordionType,
  Orientation,
  Direction,
  AnimationCallbacks,
  AccordionRef,
  AccordionSize,
  AccordionVariant,
  AnimationEasing,
  AccordionShimmerProps,
  AccordionExpandEvent,
  AccordionContextValue,
  AccordionItemContextValue,
  StorageConfig,
  UseAccordionStateOptions,
} from "./utils/types";

export {
  ChevronDownIcon,
  ChevronUpIcon,
  PlusIcon,
  MinusIcon,
} from "./utils/icons";

export {
  DEFAULT_ACCORDION_CLASSES,
  DEFAULT_ANIMATION_DURATION,
  DEFAULT_HEADING_LEVEL,
  DEFAULT_ORIENTATION,
  DEFAULT_DIRECTION,
  DEFAULT_LOOP,
  DEFAULT_SIZE,
  DEFAULT_VARIANT,
  DEFAULT_ANIMATION_EASING,
  DEFAULT_ANNOUNCE_EXPANDED,
  getDefaultStorageConfig,
  SIZE_CLASSES,
  VARIANT_CLASSES,
  UNSTYLED_ACCORDION_CLASSES,
  PRINT_STYLES,
} from "./utils/constants";

export {
  AccordionContext,
  AccordionItemContext,
  AccordionExpandedContext,
  useAccordionContext,
  useAccordionItemContext,
  useAccordionItem,
  useAccordionState,
  useIsItemExpanded,
  useExpandedStore,
} from "./utils/context";

export { Slot } from "../../utils/Slot";
export type { SlotProps } from "../../utils/Slot";
