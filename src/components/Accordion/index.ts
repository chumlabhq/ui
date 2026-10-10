
export { default as Accordion } from "./Accordion.js";
export { default as AccordionItem } from "./components/AccordionItem.js";
export { default as AccordionTrigger } from "./components/AccordionTrigger.js";
export { default as AccordionContent } from "./components/AccordionContent.js";
export { default as AccordionShimmer } from "./components/AccordionShimmer.js";

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
  AccordionContextValue,
  AccordionItemContextValue,
  StorageConfig,
  UseAccordionStateOptions,
} from "./utils/types.js";

export {
  ChevronDownIcon,
  ChevronUpIcon,
  PlusIcon,
  MinusIcon,
} from "./utils/icons.js";

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
} from "./utils/constants.js";

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
} from "./utils/context.js";
